import { getDayPillarFromLocalParts } from "./ganzhi.js";
import { getQimenPlate } from "./qimenPlateLookup.js";
import { QIMEN_PALACE_META } from "./qimenPlateValidation.js";
import { resolveQimenJuFromFullTermCycleDraft } from "./qimenResolver.js";
import { resolveQimenTimeSpecialConditions } from "./qimenTimeSpecialConditions.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const TAIPEI_OFFSET = "+08:00";
const DATE_KEY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/u;
const DEFAULT_YIELD_EVERY_DAYS = 4;
export const QIMEN_EXPORT_MAX_RANGE_MESSAGE = "單次最多匯出 3 個月，請縮短日期區間。";

const QIMEN_EXPORT_PALACE_KEYS = Object.freeze([
  "qian",
  "kan",
  "gen",
  "zhen",
  "xun",
  "li",
  "kun",
  "dui",
]);

const QIMEN_EXPORT_FIELDS = Object.freeze([
  Object.freeze({ key: "deity", suffix: "神" }),
  Object.freeze({ key: "star", suffix: "星" }),
  Object.freeze({ key: "door", suffix: "門" }),
  Object.freeze({ key: "heavenStem", suffix: "天" }),
  Object.freeze({ key: "earthStem", suffix: "地" }),
]);

const QIMEN_JU_DIGITS = Object.freeze({
  1: "一",
  2: "二",
  3: "三",
  4: "四",
  5: "五",
  6: "六",
  7: "七",
  8: "八",
  9: "九",
});

export const QIMEN_EXPORT_COLUMN_HEADERS = Object.freeze([
  "日期",
  "遁局 日干支",
  "時辰",
  "格局",
  ...QIMEN_EXPORT_PALACE_KEYS.flatMap((palaceKey) => {
    const palaceName = QIMEN_PALACE_META[palaceKey]?.palaceName ?? palaceKey;
    return QIMEN_EXPORT_FIELDS.map((field) => `${palaceName}${field.suffix}`);
  }),
]);

export const QIMEN_EXPORT_PALACES = Object.freeze(
  QIMEN_EXPORT_PALACE_KEYS.map((key) => Object.freeze({
    key,
    name: QIMEN_PALACE_META[key]?.palaceName ?? key,
  }))
);

export function validateQimenExportDateRange(startDate, endDate) {
  const normalizedStartDate = normalizeQimenExportDateKey(startDate, "起始日期");
  const normalizedEndDate = normalizeQimenExportDateKey(endDate, "結束日期");
  const startMs = getDateKeyMs(normalizedStartDate);
  const endMs = getDateKeyMs(normalizedEndDate);

  if (startMs > endMs) {
    throw new RangeError("起始日期不可晚於結束日期。");
  }

  const latestAllowedDate = getLatestAllowedQimenExportDate(normalizedStartDate);
  if (endMs > getDateKeyMs(latestAllowedDate)) {
    throw new RangeError(QIMEN_EXPORT_MAX_RANGE_MESSAGE);
  }

  return Object.freeze({
    startDate: normalizedStartDate,
    endDate: normalizedEndDate,
    totalDays: Math.floor((endMs - startMs) / DAY_MS) + 1,
  });
}

export function normalizeQimenExportDateKey(dateKey, label = "日期") {
  if (typeof dateKey !== "string") {
    throw new TypeError(`${label}必須是 YYYY-MM-DD。`);
  }

  const normalized = dateKey.trim();
  const match = normalized.match(DATE_KEY_PATTERN);
  if (!match) {
    throw new RangeError(`${label}格式無效，請選擇有效日期。`);
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = createUtcDate(year, month, day);

  if (!date || date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
    throw new RangeError(`${label}不是有效日期。`);
  }

  return formatDateKey(date);
}

export function getQimenExportTimeSlots(displayDate) {
  const normalizedDate = normalizeQimenExportDateKey(displayDate);
  const hours = [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

  return Object.freeze(hours.map((hour, index) => {
    const calculationDate = hour === 23
      ? addDateKey(normalizedDate, -1)
      : normalizedDate;
    const localDateTime = `${calculationDate}T${String(hour).padStart(2, "0")}:00:00`;

    return Object.freeze({
      index,
      displayDate: normalizedDate,
      calculationDate,
      hour,
      localDateTime,
      qimenDateTime: `${localDateTime}${TAIPEI_OFFSET}`,
    });
  }));
}

export function resolveQimenExportEntry({ displayDate, slot } = {}) {
  const normalizedDate = normalizeQimenExportDateKey(displayDate ?? slot?.displayDate);
  const resolvedSlot = slot ?? getQimenExportTimeSlots(normalizedDate)[0];
  if (resolvedSlot.displayDate !== normalizedDate) {
    throw new RangeError("時辰資料與匯出日期不一致。");
  }

  const qimen = resolveQimenJuFromFullTermCycleDraft(resolvedSlot.qimenDateTime);
  const localParts = createLocalParts(resolvedSlot.calculationDate, resolvedSlot.hour);
  const dayPillar = getDayPillarFromLocalParts(localParts).pillar;
  const plateResult = getQimenPlate({
    dunType: qimen.dunType,
    ju: qimen.ju,
    hourPillar: qimen.hourPillar,
  });

  if (!plateResult.found || !plateResult.plate) {
    throw new Error(
      `找不到 ${resolvedSlot.qimenDateTime} 的奇門盤面：${plateResult.status ?? "unknown"}`
    );
  }

  const patterns = getQimenExportPatterns({
    dayPillar,
    hourPillar: qimen.hourPillar,
    plate: plateResult.plate,
  });

  return Object.freeze({
    displayDate: normalizedDate,
    calculationDate: resolvedSlot.calculationDate,
    calculationDateTime: resolvedSlot.localDateTime,
    slotIndex: resolvedSlot.index,
    hour: resolvedSlot.hour,
    qimen,
    dayPillar,
    plate: plateResult.plate,
    patterns,
    values: createQimenExportRow({
      displayDate: normalizedDate,
      hour: resolvedSlot.hour,
      dayPillar,
      qimen,
      plate: plateResult.plate,
      patterns,
    }),
  });
}

export function getQimenExportPatterns({ dayPillar, hourPillar, plate } = {}) {
  const result = resolveQimenTimeSpecialConditions({
    dayPillar,
    hourPillar,
    plate,
  });

  return Object.freeze(
    result.conditions
      .map((condition) => condition?.label)
      .filter((label) => typeof label === "string" && label.length > 0)
  );
}

export function createQimenExportEntries(startDate, endDate) {
  const range = validateQimenExportDateRange(startDate, endDate);
  const entries = [];
  let currentDate = range.startDate;

  for (let index = 0; index < range.totalDays; index += 1) {
    const slots = getQimenExportTimeSlots(currentDate);
    for (const slot of slots) {
      entries.push(resolveQimenExportEntry({ displayDate: currentDate, slot }));
    }
    currentDate = addDateKey(currentDate, 1);
  }

  return entries;
}

export function createQimenExportRows(startDate, endDate) {
  return createQimenExportEntries(startDate, endDate).map((entry) => entry.values);
}

export async function createQimenExportRowsAsync({
  startDate,
  endDate,
  onProgress,
  yieldEveryDays = DEFAULT_YIELD_EVERY_DAYS,
} = {}) {
  const range = validateQimenExportDateRange(startDate, endDate);
  if (!Number.isInteger(yieldEveryDays) || yieldEveryDays < 1) {
    throw new RangeError("yieldEveryDays 必須是正整數。");
  }

  const rows = [];
  let currentDate = range.startDate;
  for (let dayIndex = 0; dayIndex < range.totalDays; dayIndex += 1) {
    for (const slot of getQimenExportTimeSlots(currentDate)) {
      rows.push(resolveQimenExportEntry({ displayDate: currentDate, slot }).values);
    }

    const completedDays = dayIndex + 1;
    if (typeof onProgress === "function") {
      onProgress({
        completedDays,
        totalDays: range.totalDays,
        rowCount: rows.length,
      });
    }

    currentDate = addDateKey(currentDate, 1);
    if (completedDays < range.totalDays && completedDays % yieldEveryDays === 0) {
      await yieldToEventLoop();
    }
  }

  return rows;
}

export function createQimenExportRow({ displayDate, hour, dayPillar, qimen, plate, patterns } = {}) {
  const normalizedDate = normalizeQimenExportDateKey(displayDate);
  const row = [
    formatQimenExportDate(normalizedDate),
    `${formatQimenDunJu(qimen)} ${formatNullable(dayPillar)}日`,
    `${formatNullable(qimen?.hourPillar)}時 ${formatQimenExportHour(hour)}`,
    patterns?.length > 0 ? patterns.join("；") : "—",
  ];

  for (const { key } of QIMEN_EXPORT_PALACES) {
    const palace = plate?.palaces?.[key];
    for (const field of QIMEN_EXPORT_FIELDS) {
      row.push(field.key === "door"
        ? formatQimenDoorName(palace?.[field.key])
        : formatNullable(palace?.[field.key]));
    }
  }

  if (row.length !== QIMEN_EXPORT_COLUMN_HEADERS.length) {
    throw new Error(`奇門匯出資料欄位數錯誤：${row.length}`);
  }

  return Object.freeze(row);
}

export function createQimenExportFileName(startDate, endDate) {
  const range = validateQimenExportDateRange(startDate, endDate);
  return `奇門遁甲_${range.startDate.replaceAll("-", "")}-${range.endDate.replaceAll("-", "")}.xlsx`;
}

export function createQimenExportSheetData(rows) {
  validateQimenExportRows(rows);

  const headerRow = QIMEN_EXPORT_COLUMN_HEADERS.map((value) => ({
    value,
    fontWeight: "bold",
    textColor: "#FFFFFF",
    backgroundColor: "#1F4E78",
    align: "center",
    alignVertical: "center",
    wrap: true,
  }));

  const dataRows = rows.map((row) => row.map(
    (value, columnIndex) => ({
      value,
      alignVertical: "top",
      wrap: columnIndex === 3,
    })
  ));

  return [headerRow, ...dataRows];
}

export function getQimenExportSheetOptions() {
  const widths = [13, 24, 13, 30];
  for (let index = 0; index < QIMEN_EXPORT_PALACE_KEYS.length * QIMEN_EXPORT_FIELDS.length; index += 1) {
    widths.push(10);
  }

  return Object.freeze({
    sheet: "奇門遁甲",
    columns: Object.freeze(widths.map((width) => Object.freeze({ width }))),
    stickyRowsCount: 1,
    orientation: "landscape",
  });
}

export async function createQimenExportBlob({ rows, writeExcelFile } = {}) {
  const library = writeExcelFile ?? globalThis.writeXlsxFile;
  if (typeof library !== "function") {
    throw new Error("Excel 匯出函式庫尚未載入，無法建立 Excel 檔案。");
  }

  const output = library(
    createQimenExportSheetData(rows),
    getQimenExportSheetOptions(),
    { fontFamily: "Arial", fontSize: 11 }
  );

  if (!output || typeof output.toBlob !== "function") {
    throw new Error("Excel 匯出函式庫未提供瀏覽器 Blob 輸出功能。");
  }

  return output.toBlob();
}

export function downloadQimenExportBlob(blob, fileName, browser = globalThis) {
  if (!blob) {
    throw new TypeError("Excel 檔案內容不可為空。");
  }
  if (!browser?.document?.createElement || !browser?.URL?.createObjectURL) {
    throw new Error("目前環境不支援瀏覽器下載。");
  }

  const url = browser.URL.createObjectURL(blob);
  const anchor = browser.document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.style.display = "none";
  browser.document.body.append(anchor);
  anchor.click();
  anchor.remove();
  browser.setTimeout(() => browser.URL.revokeObjectURL(url), 0);
}

function validateQimenExportRows(rows) {
  if (!Array.isArray(rows)) {
    throw new TypeError("Excel 匯出資料必須是陣列。");
  }
  for (const row of rows) {
    if (!Array.isArray(row) || row.length !== QIMEN_EXPORT_COLUMN_HEADERS.length) {
      throw new RangeError(`Excel 匯出資料每列必須有 ${QIMEN_EXPORT_COLUMN_HEADERS.length} 欄。`);
    }
  }
  return rows;
}

function createLocalParts(dateKey, hour) {
  const date = parseDateKey(dateKey);
  return {
    year: date.year,
    month: date.month,
    day: date.day,
    hour,
    minute: 0,
    second: 0,
    millisecond: 0,
  };
}

function formatQimenDunJu(qimen) {
  const digit = QIMEN_JU_DIGITS[qimen?.ju] ?? String(qimen?.ju ?? "");
  const dunName = typeof qimen?.dunName === "string" ? qimen.dunName : "";
  return `${dunName}${digit}局`.trim();
}

function formatQimenExportDate(dateKey) {
  return dateKey.replaceAll("-", "/");
}

function formatQimenExportHour(hour) {
  return Number.isInteger(hour) && hour >= 0 && hour <= 23
    ? String(hour).padStart(2, "0")
    : "—";
}

function formatQimenDoorName(door) {
  const value = formatNullable(door);
  return value === "—" || value.endsWith("門") ? value : `${value}門`;
}

function formatNullable(value) {
  return value === null || value === undefined || value === "" ? "—" : String(value);
}

function parseDateKey(dateKey) {
  const normalized = normalizeQimenExportDateKey(dateKey);
  const match = normalized.match(DATE_KEY_PATTERN);
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function getDateKeyMs(dateKey) {
  const { year, month, day } = parseDateKey(dateKey);
  return createUtcDate(year, month, day).getTime();
}

function getLatestAllowedQimenExportDate(startDate) {
  const { year, month, day } = parseDateKey(startDate);
  const targetMonthIndex = year * 12 + (month - 1) + 3;
  const targetYear = Math.floor(targetMonthIndex / 12);
  const targetMonth = targetMonthIndex % 12 + 1;
  const targetMonthLastDay = getDaysInMonth(targetYear, targetMonth);
  const targetDay = Math.min(day, targetMonthLastDay);
  const targetDate = formatDateKey(createUtcDate(targetYear, targetMonth, targetDay));

  // A normal matching day is the exclusive three-month boundary. If the
  // target month has no matching day, its last day is the inclusive boundary.
  return day > targetMonthLastDay ? targetDate : addDateKey(targetDate, -1);
}

function getDaysInMonth(year, month) {
  return createUtcDate(year, month + 1, 0).getUTCDate();
}

function createUtcDate(year, month, day) {
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateKey(date) {
  return [
    String(date.getUTCFullYear()).padStart(4, "0"),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function addDateKey(dateKey, days) {
  const { year, month, day } = parseDateKey(dateKey);
  const date = createUtcDate(year, month, day);
  date.setUTCDate(date.getUTCDate() + days);
  return formatDateKey(date);
}

function yieldToEventLoop() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}
