#!/usr/bin/env node
"use strict";

// Builds the compact, offline CWA lunar-calendar lookup data.  The source CSV
// is intentionally not committed; see THIRD_PARTY_DATA.md for its checksum and
// acquisition record.  This parser deliberately accepts only the observed CWA
// CSV dialect and fails before emitting data when anything is inconsistent.

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const EXPECTED_HEADER = ["日期", "民國年", "農曆年", "農曆月", "農曆日", "星期"];
const EXPECTED_SHA256 = "1977895ede93d8cac33355fa5d51cd021f384c1298e46c075b81d8be99d576be";
const EXPECTED_START = "2022-01-01";
const EXPECTED_END = "2050-12-31";
const EXPECTED_ROWS = 10592;
const SOURCE_URL = "https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/A-A0087-001?Authorization=rdec-key-123-45678-011121314&format=CSV";
const RETRIEVED_AT = "2026-08-03T05:39:11.801Z";

function getArgument(name, fallback = null) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  if (index === process.argv.length - 1) throw new Error(`${name} requires a path`);
  return process.argv[index + 1];
}

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(year, month) {
  return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

function parseSolarDate(value, context) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`${context}: invalid Gregorian date ${value}`);
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    throw new Error(`${context}: invalid Gregorian date ${value}`);
  }
  return { year, month, day };
}

// A timezone-free proleptic-Gregorian serial day.  It is used only for
// structural validation and cannot be affected by the host's Date/TZ settings.
function solarDayNumber(date) {
  const { year, month, day } = parseSolarDate(date, "solarDayNumber");
  const completedYears = year - 1;
  const daysBeforeYear = completedYears * 365
    + Math.floor(completedYears / 4)
    - Math.floor(completedYears / 100)
    + Math.floor(completedYears / 400);
  let daysBeforeMonth = 0;
  for (let value = 1; value < month; value += 1) daysBeforeMonth += daysInMonth(year, value);
  return daysBeforeYear + daysBeforeMonth + day;
}

function parseCsvLine(line, lineNumber) {
  // Current resource has no quoted fields.  Do not silently implement a
  // partial CSV parser should CWA change the dialect.
  if (line.includes('"')) throw new Error(`line ${lineNumber}: quoted CSV is unsupported`);
  const fields = line.split(",");
  if (fields.length !== EXPECTED_HEADER.length) throw new Error(`line ${lineNumber}: expected six columns`);
  return fields;
}

function parseRows(sourceText) {
  const lines = sourceText.replace(/^\uFEFF/, "").split(/\r?\n/);
  while (lines.length && lines.at(-1) === "") lines.pop();
  if (!lines.length) throw new Error("source CSV is empty");
  const header = parseCsvLine(lines.shift(), 1);
  if (JSON.stringify(header) !== JSON.stringify(EXPECTED_HEADER)) {
    throw new Error(`unexpected header: ${header.join("|")}`);
  }

  // The downloaded CWA file ends with one all-empty six-column trailer.  It is
  // not a data row; tolerate exactly that one trailer and reject it elsewhere.
  if (/^,*$/.test(lines.at(-1) ?? "")) lines.pop();
  if (!lines.length) throw new Error("source CSV has no data rows");

  const rows = lines.map((line, index) => {
    const lineNumber = index + 2;
    if (line === "" || /^,*$/.test(line)) throw new Error(`line ${lineNumber}: empty row is not allowed`);
    const [date, rocYear, lunarYearName, lunarMonthText, lunarDayText, weekdayText] = parseCsvLine(line, lineNumber);
    const solar = parseSolarDate(date, `line ${lineNumber}`);
    if (!/^\d+$/.test(rocYear) || !/^[\u4e00-\u9fff]{2}$/.test(lunarYearName) || !/^(?:閏)?(?:[1-9]|1[0-2])$/.test(lunarMonthText)
      || !/^(?:[1-9]|[12]\d|30)$/.test(lunarDayText) || !/^[1-7]$/.test(weekdayText)) {
      throw new Error(`line ${lineNumber}: invalid CWA field value`);
    }
    return {
      date,
      solar,
      rocYear: Number(rocYear),
      lunarYearName,
      lunarMonth: Number(lunarMonthText.replace("閏", "")),
      lunarDay: Number(lunarDayText),
      isLeapMonth: lunarMonthText.startsWith("閏"),
      weekday: Number(weekdayText),
    };
  });

  if (rows.length !== EXPECTED_ROWS || rows[0].date !== EXPECTED_START || rows.at(-1).date !== EXPECTED_END) {
    throw new Error(`unexpected CWA range: ${rows.length} rows, ${rows[0].date} to ${rows.at(-1).date}`);
  }
  const dates = new Set();
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (dates.has(row.date)) throw new Error(`duplicate Gregorian date: ${row.date}`);
    dates.add(row.date);
    if (index && solarDayNumber(row.date) - solarDayNumber(rows[index - 1].date) !== 1) {
      throw new Error(`missing Gregorian date between ${rows[index - 1].date} and ${row.date}`);
    }
  }
  return rows;
}

function assignNumericLunarYears(rows) {
  const firstMonthStarts = rows.filter((row) => row.lunarMonth === 1 && !row.isLeapMonth && row.lunarDay === 1);
  if (firstMonthStarts.length !== 29) throw new Error(`expected 29 lunar new years, found ${firstMonthStarts.length}`);
  const yearsByName = new Map();
  for (const row of firstMonthStarts) {
    if (yearsByName.has(row.lunarYearName)) throw new Error(`duplicated lunar-year name at ${row.date}`);
    yearsByName.set(row.lunarYearName, row.solar.year);
  }
  const leadingName = rows[0].lunarYearName;
  if (yearsByName.has(leadingName) || rows[0].lunarMonth < 11 || rows[0].isLeapMonth) {
    throw new Error("cannot derive numeric lunar year for the leading partial month from CWA rows");
  }
  yearsByName.set(leadingName, rows[0].solar.year - 1);
  return rows.map((row) => ({ ...row, lunarYear: yearsByName.get(row.lunarYearName) }));
}

function assertMonthProgression(previous, current) {
  if (current.lunarYear === previous.lunarYear) {
    const valid = (!previous.isLeapMonth && current.isLeapMonth && current.lunarMonth === previous.lunarMonth)
      || (current.lunarMonth === previous.lunarMonth + 1 && !current.isLeapMonth);
    if (!valid) throw new Error(`invalid lunar month sequence: ${previous.date} -> ${current.date}`);
  } else if (current.lunarYear !== previous.lunarYear + 1 || previous.lunarMonth !== 12 || previous.isLeapMonth
    || current.lunarMonth !== 1 || current.isLeapMonth) {
    throw new Error(`invalid lunar-year transition: ${previous.date} -> ${current.date}`);
  }
}

function makeSegment(rows, startIndex, endIndex, label) {
  const segment = rows.slice(startIndex, endIndex);
  if (!segment.length) throw new Error(`${label}: empty segment`);
  const first = segment[0];
  for (let offset = 0; offset < segment.length; offset += 1) {
    const row = segment[offset];
    if (row.lunarYear !== first.lunarYear || row.lunarMonth !== first.lunarMonth || row.isLeapMonth !== first.isLeapMonth
      || row.lunarDay !== first.lunarDay + offset) {
      throw new Error(`${label}: lunar dates are not consecutive at ${row.date}`);
    }
  }
  return {
    solarStart: first.date,
    lunarYear: first.lunarYear,
    lunarMonth: first.lunarMonth,
    lunarDay: first.lunarDay,
    isLeapMonth: first.isLeapMonth,
    daysAvailable: segment.length,
  };
}

function buildHybridData(rows) {
  const starts = rows.map((row, index) => ({ row, index })).filter(({ row }) => row.lunarDay === 1);
  if (starts.length !== 359) throw new Error(`expected 359 observed month starts, found ${starts.length}`);
  const firstStart = starts[0];
  const leadingSegment = makeSegment(rows, 0, firstStart.index, "leading segment");
  if (leadingSegment.lunarDay === 1 || leadingSegment.daysAvailable >= 29) throw new Error("leading segment is not minimal partial data");

  const monthStarts = [];
  for (let index = 0; index < starts.length - 1; index += 1) {
    const current = starts[index];
    const next = starts[index + 1];
    assertMonthProgression(current.row, next.row);
    const monthLength = next.index - current.index;
    if (monthLength !== 29 && monthLength !== 30) throw new Error(`invalid month length ${monthLength} at ${current.row.date}`);
    const segment = makeSegment(rows, current.index, next.index, `month ${current.row.date}`);
    if (segment.lunarDay !== 1 || segment.daysAvailable !== monthLength) throw new Error(`invalid month segment at ${current.row.date}`);
    monthStarts.push({
      solarStart: current.row.date,
      lunarYear: current.row.lunarYear,
      lunarMonth: current.row.lunarMonth,
      isLeapMonth: current.row.isLeapMonth,
      monthLength,
    });
  }
  const finalStart = starts.at(-1);
  assertMonthProgression(starts.at(-2).row, finalStart.row);
  const trailingSegment = makeSegment(rows, finalStart.index, rows.length, "trailing segment");
  if (trailingSegment.lunarDay !== 1 || trailingSegment.daysAvailable >= 29) throw new Error("trailing segment is not minimal partial data");
  return { leadingSegment, monthStarts, trailingSegment };
}

function lookupFromHybrid(data, solarDate) {
  const target = solarDayNumber(solarDate);
  const leadingStart = solarDayNumber(data.leadingSegment.solarStart);
  if (target >= leadingStart && target < leadingStart + data.leadingSegment.daysAvailable) {
    const offset = target - leadingStart;
    return { ...data.leadingSegment, lunarDay: data.leadingSegment.lunarDay + offset };
  }
  const trailingStart = solarDayNumber(data.trailingSegment.solarStart);
  if (target >= trailingStart && target < trailingStart + data.trailingSegment.daysAvailable) {
    const offset = target - trailingStart;
    return { ...data.trailingSegment, lunarDay: data.trailingSegment.lunarDay + offset };
  }
  let low = 0;
  let high = data.monthStarts.length - 1;
  let found = -1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (solarDayNumber(data.monthStarts[middle].solarStart) <= target) {
      found = middle;
      low = middle + 1;
    } else high = middle - 1;
  }
  if (found < 0) return null;
  const month = data.monthStarts[found];
  const lunarDay = target - solarDayNumber(month.solarStart) + 1;
  if (lunarDay < 1 || lunarDay > month.monthLength) return null;
  return { ...month, lunarDay };
}

function validateRoundTrip(rows, data) {
  let mismatch = 0;
  for (const row of rows) {
    const actual = lookupFromHybrid(data, row.date);
    if (!actual || actual.lunarYear !== row.lunarYear || actual.lunarMonth !== row.lunarMonth
      || actual.lunarDay !== row.lunarDay || actual.isLeapMonth !== row.isLeapMonth) mismatch += 1;
  }
  if (mismatch) throw new Error(`round-trip mismatch: ${mismatch}`);
  return { dailyRows: rows.length, mismatch, missing: 0, duplicate: 0, invalidMonthLength: 0 };
}

async function main() {
  const sourcePath = getArgument("--source");
  if (!sourcePath) throw new Error("--source <CWA A-A0087-001 CSV path> is required; the raw source is intentionally not committed");
  const outputPath = resolve(ROOT, getArgument("--output", "data/cwa_lunar_month_starts_2022_2050.json"));
  const manifestPath = resolve(ROOT, getArgument("--manifest", "data/cwa_lunar_calendar_manifest_2022_2050.json"));
  const summaryPath = resolve(ROOT, getArgument("--summary", "data/cwa_lunar_calendar_validation_2022_2050.json"));
  const bytes = await readFile(resolve(sourcePath));
  const sourceSha256 = createHash("sha256").update(bytes).digest("hex");
  if (sourceSha256 !== EXPECTED_SHA256) throw new Error(`unexpected source SHA-256: ${sourceSha256}`);
  const rows = assignNumericLunarYears(parseRows(bytes.toString("utf8")));
  const hybrid = buildHybridData(rows);
  const runtimeData = {
    schemaVersion: 1,
    supportedRange: { start: EXPECTED_START, end: EXPECTED_END },
    leadingSegment: hybrid.leadingSegment,
    monthStarts: hybrid.monthStarts,
    trailingSegment: hybrid.trailingSegment,
  };
  const validation = validateRoundTrip(rows, runtimeData);
  const pretty = `${JSON.stringify(runtimeData, null, 2)}\n`;
  const minified = JSON.stringify(runtimeData);
  const manifest = {
    schemaVersion: 1,
    datasetName: "日曆資料",
    datasetId: "157677",
    resourceId: "A-A0087-001",
    resourceName: "國農曆日期對照",
    sourceUrl: SOURCE_URL,
    sourceFilename: "A-A0087-001.bin",
    sourceFormat: "UTF-8 CSV",
    sourceSha256,
    retrievedAt: RETRIEVED_AT,
    sourceRange: { start: EXPECTED_START, end: EXPECTED_END },
    sourceRows: rows.length,
    sourceColumns: EXPECTED_HEADER,
    generator: "scripts/build-cwa-lunar-calendar-data.js",
    generatorVersion: 1,
    outputFormat: "month-starts-with-boundary-segments",
  };
  const summary = {
    schemaVersion: 1,
    sourceSha256,
    supportedRange: runtimeData.supportedRange,
    sourceRows: rows.length,
    generatedMonthStarts: hybrid.monthStarts.length,
    leadingSegmentDays: hybrid.leadingSegment.daysAvailable,
    trailingSegmentDays: hybrid.trailingSegment.daysAvailable,
    validation,
    dataSizeBytes: { pretty: Buffer.byteLength(pretty), minified: Buffer.byteLength(minified), gzip: gzipSync(minified).length },
  };
  await Promise.all([
    writeFile(outputPath, pretty, "utf8"),
    writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8"),
    writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8"),
  ]);
  process.stdout.write(`${JSON.stringify(summary)}\n`);
}

main().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
