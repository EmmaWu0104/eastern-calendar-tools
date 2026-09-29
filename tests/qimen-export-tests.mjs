import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import vm from "node:vm";
import writeExcelFile from "write-excel-file/node";
import { strFromU8, unzipSync } from "fflate";

import {
  QIMEN_EXPORT_COLUMN_HEADERS,
  QIMEN_EXPORT_MAX_RANGE_MESSAGE,
  createQimenExportEntries,
  createQimenExportFileName,
  createQimenExportSheetData,
  createQimenExportRows,
  createQimenExportRowsAsync,
  getQimenExportSheetOptions,
  getQimenExportPatterns,
  getQimenExportTimeSlots,
  validateQimenExportDateRange,
} from "../src/qimenExport.js";
import { getDayPillarFromLocalParts, getHourPillarFromLocalParts } from "../src/ganzhi.js";
import {
  createMondayFirstCalendarCells,
  getDaysInCalendarMonth,
  getMondayFirstCalendarOffset,
} from "../src/calendarDateMath.js";
import { getQimenPlate } from "../src/qimenPlateLookup.js";
import { resolveQimenJuFromFullTermCycleDraft } from "../src/qimenResolver.js";
import { QIMEN_DUN_TYPES, QIMEN_HOUR_PILLARS } from "../src/qimenPlateValidation.js";

const failures = [];

function check(name, callback) {
  try {
    callback();
    console.log(`通過：${name}`);
  } catch (error) {
    failures.push({ name, error });
    console.error(`失敗：${name}`);
    console.error(error);
  }
}

async function checkAsync(name, callback) {
  try {
    await callback();
    console.log(`通過：${name}`);
  } catch (error) {
    failures.push({ name, error });
    console.error(`失敗：${name}`);
    console.error(error);
  }
}

check("單日匯出正好十二筆", () => {
  const entries = createQimenExportEntries("2026-10-01", "2026-10-01");
  assert.equal(entries.length, 12);
  assert.deepEqual(entries.map((entry) => entry.hour), [23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]);
});

check("2026/10/01～2026/10/31 正好產生 372 筆", () => {
  const rows = createQimenExportRows("2026-10-01", "2026-10-31");
  assert.equal(rows.length, 372);
});

check("日期區間包含起始日與結束日", () => {
  const rows = createQimenExportRows("2026-10-01", "2026-10-03");
  assert.equal(rows.length, 36);
  assert.equal(rows[0][0], "2026/10/01");
  assert.equal(rows.at(-1)[0], "2026/10/03");
  assert.deepEqual([...new Set(rows.map((row) => row[0]))], ["2026/10/01", "2026/10/02", "2026/10/03"]);
});

check("每天第一筆使用前一天 23:00", () => {
  const slots = getQimenExportTimeSlots("2026-10-01");
  assert.equal(slots[0].calculationDate, "2026-09-30");
  assert.equal(slots[0].localDateTime, "2026-09-30T23:00:00");
  assert.equal(slots[0].qimenDateTime, "2026-09-30T23:00:00+08:00");
  assert.equal(slots[1].localDateTime, "2026-10-01T01:00:00");
});

check("10/01 第一筆符合原始需求範例", () => {
  const entries = createQimenExportEntries("2026-10-01", "2026-10-01");
  const first = entries[0];
  assert.equal(first.qimen.dunType, "yin");
  assert.equal(first.qimen.dunName, "陰遁");
  assert.equal(first.qimen.ju, 4);
  assert.equal(first.dayPillar, "戊申");
  assert.equal(first.qimen.hourPillar, "壬子");
  assert.equal(first.values[1], "陰遁四局 戊申日");
  assert.equal(first.values[2], "壬子時 23");
  assert.equal(entries[1].qimen.hourPillar, "癸丑");
  assert.equal(entries[1].values[2], "癸丑時 01");
});

check("23:00 換日與其他十一個時辰均符合既有算法", () => {
  const entries = createQimenExportEntries("2026-10-01", "2026-10-01");
  const slots = getQimenExportTimeSlots("2026-10-01");

  entries.forEach((entry, index) => {
    const slot = slots[index];
    const localParts = {
      year: Number(slot.localDateTime.slice(0, 4)),
      month: Number(slot.localDateTime.slice(5, 7)),
      day: Number(slot.localDateTime.slice(8, 10)),
      hour: slot.hour,
      minute: 0,
      second: 0,
      millisecond: 0,
    };
    const expectedDayPillar = getDayPillarFromLocalParts(localParts).pillar;
    const expectedHourPillar = getHourPillarFromLocalParts(localParts).pillar;
    const expectedQimen = resolveQimenJuFromFullTermCycleDraft(slot.qimenDateTime);

    assert.equal(entry.dayPillar, expectedDayPillar, `第 ${index + 1} 筆日柱`);
    assert.equal(entry.qimen.hourPillar, expectedHourPillar, `第 ${index + 1} 筆時柱`);
    assert.equal(entry.qimen.dunType, expectedQimen.dunType, `第 ${index + 1} 筆遁別`);
    assert.equal(entry.qimen.ju, expectedQimen.ju, `第 ${index + 1} 筆局數`);
    assert.equal(entry.plate.hourPillar, expectedHourPillar, `第 ${index + 1} 筆查盤時柱`);
  });
});

check("跨月、跨年及閏年日期區間", () => {
  const leapRows = createQimenExportRows("2020-02-28", "2020-03-01");
  assert.equal(leapRows.length, 36);
  assert.ok(leapRows.some((row) => row[0] === "2020/02/29"));

  const yearRows = createQimenExportRows("2023-12-31", "2024-01-01");
  assert.equal(yearRows.length, 24);
  assert.equal(yearRows[0][0], "2023/12/31");
  assert.equal(yearRows.at(-1)[0], "2024/01/01");
});

check("匯出日期月曆固定週一開始且日期不偏移", () => {
  assert.equal(getMondayFirstCalendarOffset(2026, 9), 3);
  const october = createMondayFirstCalendarCells(2026, 9);
  assert.deepEqual(october.slice(0, 7), [null, null, null, 1, 2, 3, 4]);
  assert.equal(october.indexOf(1), 3);
  assert.equal(october.indexOf(31), 33);

  const sundayFirstMonth = createMondayFirstCalendarCells(2023, 0);
  assert.equal(getMondayFirstCalendarOffset(2023, 0), 6);
  assert.equal(sundayFirstMonth.indexOf(1), 6);
});

check("匯出日期月曆跨月、跨年及閏年排列正確", () => {
  const december = createMondayFirstCalendarCells(2023, 11);
  const january = createMondayFirstCalendarCells(2024, 0);
  const leapFebruary = createMondayFirstCalendarCells(2024, 1);

  assert.equal(getDaysInCalendarMonth(2023, 11), 31);
  assert.equal(december.indexOf(1), 4);
  assert.equal(january.indexOf(1), 0);
  assert.equal(getDaysInCalendarMonth(2024, 1), 29);
  assert.equal(leapFebruary.indexOf(1), 3);
  assert.equal(leapFebruary.indexOf(29), 31);
  assert.ok(december.length >= 31);
});

check("每筆固定 44 欄，宮位及欄位順序正確", () => {
  assert.equal(QIMEN_EXPORT_COLUMN_HEADERS.length, 44);
  assert.deepEqual(QIMEN_EXPORT_COLUMN_HEADERS.slice(0, 4), ["日期", "遁局 日干支", "時辰", "格局"]);
  assert.deepEqual(QIMEN_EXPORT_COLUMN_HEADERS.slice(4), [
    "乾神", "乾星", "乾門", "乾天", "乾地",
    "坎神", "坎星", "坎門", "坎天", "坎地",
    "艮神", "艮星", "艮門", "艮天", "艮地",
    "震神", "震星", "震門", "震天", "震地",
    "巽神", "巽星", "巽門", "巽天", "巽地",
    "離神", "離星", "離門", "離天", "離地",
    "坤神", "坤星", "坤門", "坤天", "坤地",
    "兌神", "兌星", "兌門", "兌天", "兌地",
  ]);

  const rows = createQimenExportRows("2026-10-01", "2026-10-01");
  assert.ok(rows.every((row) => row.length === 44));

  const first = createQimenExportEntries("2026-10-01", "2026-10-01")[0];
  const palaceKeys = ["qian", "kan", "gen", "zhen", "xun", "li", "kun", "dui"];
  const palaceFields = ["deity", "star", "door", "heavenStem", "earthStem"];
  const expectedPalaceValues = palaceKeys.flatMap((palaceKey) => (
    palaceFields.map((field) => {
      const value = first.plate.palaces[palaceKey][field] ?? "—";
      return field === "door" && value !== "—" && !value.endsWith("門") ? `${value}門` : value;
    })
  ));
  assert.deepEqual(first.values.slice(4), expectedPalaceValues);
});

check("格局沿用目前頁面動態條件判斷", () => {
  const first = createQimenExportEntries("2026-10-01", "2026-10-01")[0];
  assert.deepEqual(first.patterns, ["符伏吟 門反吟"]);
  assert.equal(first.values[3], "符伏吟 門反吟");
  assert.deepEqual(getQimenExportPatterns({
    dayPillar: first.dayPillar,
    hourPillar: first.qimen.hourPillar,
    plate: first.plate,
  }), first.patterns);
});

check("1080 盤資料查詢完整性", () => {
  for (const dunType of QIMEN_DUN_TYPES) {
    for (let ju = 1; ju <= 9; ju += 1) {
      for (const hourPillar of QIMEN_HOUR_PILLARS) {
        const result = getQimenPlate({ dunType, ju, hourPillar });
        assert.equal(result.status, "found", `${dunType} ${ju} ${hourPillar}`);
        assert.equal(result.plate?.hourPillar, hourPillar);
      }
    }
  }
});

await checkAsync("匯出不受真太陽時及手動盤局設定影響", async () => {
  const exportModule = await readFile(new URL("../src/qimenExport.js", import.meta.url), "utf8");
  assert.equal(exportModule.includes("qimenManualOverride"), false);
  assert.equal(exportModule.includes("trueSolarTime"), false);

  globalThis.qimenManualOverride = { enabled: true, dunType: "yang", ju: 9 };
  globalThis.trueSolarTimeResult = { trueSolarParts: { hour: 12 } };
  const rows = createQimenExportRows("2026-10-01", "2026-10-01");
  assert.equal(rows[0][1], "陰遁四局 戊申日");
  delete globalThis.qimenManualOverride;
  delete globalThis.trueSolarTimeResult;
});

check("無效日期與倒序日期會被拒絕", () => {
  assert.throws(() => validateQimenExportDateRange("2026-02-29", "2026-03-01"), /不是有效日期/);
  assert.throws(() => validateQimenExportDateRange("2026-10-02", "2026-10-01"), /不可晚於/);
  assert.equal(createQimenExportFileName("2026-10-01", "2026-10-31"), "奇門遁甲_20261001-20261031.xlsx");
});

check("三個月匯出上限及跨年邊界", () => {
  assert.equal(validateQimenExportDateRange("2026-10-01", "2026-12-31").totalDays, 92);
  assert.throws(
    () => validateQimenExportDateRange("2026-10-01", "2027-01-01"),
    (error) => error instanceof RangeError && error.message === QIMEN_EXPORT_MAX_RANGE_MESSAGE
  );
  assert.equal(validateQimenExportDateRange("2026-10-15", "2027-01-14").totalDays, 92);
  assert.throws(
    () => validateQimenExportDateRange("2026-10-15", "2027-01-15"),
    (error) => error instanceof RangeError && error.message === QIMEN_EXPORT_MAX_RANGE_MESSAGE
  );
});

check("三個月上限的月底與閏年邊界", () => {
  assert.equal(validateQimenExportDateRange("2026-11-30", "2027-02-28").totalDays, 91);
  assert.throws(
    () => validateQimenExportDateRange("2026-11-30", "2027-03-01"),
    (error) => error instanceof RangeError && error.message === QIMEN_EXPORT_MAX_RANGE_MESSAGE
  );
  assert.equal(validateQimenExportDateRange("2023-11-30", "2024-02-29").totalDays, 92);
  assert.throws(
    () => validateQimenExportDateRange("2023-11-30", "2024-03-01"),
    (error) => error instanceof RangeError && error.message === QIMEN_EXPORT_MAX_RANGE_MESSAGE
  );
});

await checkAsync("非同步逐日匯出可回報進度且不重複日期", async () => {
  const progress = [];
  const rows = await createQimenExportRowsAsync({
    startDate: "2026-10-01",
    endDate: "2026-10-02",
    yieldEveryDays: 1,
    onProgress(value) {
      progress.push(value);
    },
  });
  assert.equal(rows.length, 24);
  assert.deepEqual(progress.map((value) => value.completedDays), [1, 2]);
  assert.deepEqual([...new Set(rows.map((row) => row[0]))], ["2026/10/01", "2026/10/02"]);
});

await checkAsync("日期選擇器、下載按鈕及錯誤／重複點擊狀態已接線", async () => {
  const indexHtml = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const mainModule = await readFile(new URL("../src/main.js", import.meta.url), "utf8");
  const mainCss = await readFile(new URL("../styles/main.css", import.meta.url), "utf8");
  assert.match(indexHtml, /src="\.\/src\/vendor\/write-excel-file\.min\.js/u);
  assert.match(mainModule, /qimen-export-start-date/u);
  assert.match(mainModule, /qimen-export-end-date/u);
  assert.match(mainModule, /qimen-export-download/u);
  assert.match(mainModule, /if \(isQimenExporting\)/u);
  assert.match(mainModule, /qimenElements\.exportButton\.disabled = true/u);
  assert.match(mainModule, /QIMEN_EXPORT_MAX_RANGE_MESSAGE/u);
  assert.match(mainModule, /單次最多 3 個月/u);
  assert.match(mainModule, /input\.type = "text"/u);
  assert.doesNotMatch(mainModule, /input\.type = "date"/u);
  assert.match(mainModule, /qimen-export-date-picker-weekdays/u);
  assert.match(mainModule, /createMondayFirstCalendarCells/u);
  assert.match(mainModule, /input\.value = formatQimenExportDateInput/u);
  assert.match(mainModule, /qimen-export-date-picker-icon/u);
  assert.match(indexHtml, /一.*二.*三.*四.*五.*六.*日/u);
  assert.match(mainModule, /setQimenExportStatus\(/u);
  assert.match(mainCss, /\.qimen-export-date-picker-day \{[\s\S]*?background: transparent;[\s\S]*?color: #1f2933;/u);
  assert.match(mainCss, /\.qimen-export-date-picker-day\.is-selected \{[\s\S]*?background: #1f6feb;[\s\S]*?color: #ffffff;/u);
  assert.match(mainCss, /\.qimen-export-date-picker-day\.is-today \{[\s\S]*?border-color:/u);
  assert.match(mainCss, /\.qimen-export-date-picker-toggle \{[\s\S]*?background: #ffffff;/u);
  assert.match(mainCss, /\.qimen-export-date-picker-weekdays/u);
  assert.match(mainCss, /width: min\(292px, calc\(100vw - 32px\)\)/u);
  assert.match(mainCss, /@media \(max-width: 560px\)[\s\S]*?\.qimen-export-controls/u);
});

await checkAsync("本地瀏覽器 Excel bundle 可輸出 Blob", async () => {
  const source = await readFile(new URL("../src/vendor/write-excel-file.min.js", import.meta.url), "utf8");
  const context = {
    Blob,
    TextEncoder,
    TextDecoder,
    Uint8Array,
    Uint16Array,
    Int32Array,
    ArrayBuffer,
    DataView,
    Promise,
    queueMicrotask,
    setTimeout,
  };
  context.globalThis = context;
  vm.runInNewContext(source, context);
  assert.equal(typeof context.writeXlsxFile, "function");
  const rows = createQimenExportRows("2026-10-01", "2026-10-01");
  const blob = await context.writeXlsxFile(
    createQimenExportSheetData(rows.slice(0, 1)),
    getQimenExportSheetOptions(),
    { fontFamily: "Arial", fontSize: 11 }
  ).toBlob();
  assert.equal(blob.type, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  assert.ok(blob.size > 1000);
});

await checkAsync("下載的 Excel 可正常開啟，資料列數及標題正確", async () => {
  const rows = createQimenExportRows("2026-10-01", "2026-10-01");
  const output = writeExcelFile(
    createQimenExportSheetData(rows),
    getQimenExportSheetOptions(),
    { fontFamily: "Arial", fontSize: 11 }
  );
  const buffer = await output.toBuffer();
  assert.ok(buffer.byteLength > 1000);

  const files = unzipSync(new Uint8Array(buffer));
  const sheetXml = strFromU8(files["xl/worksheets/sheet1.xml"]);
  const sharedStringsXml = strFromU8(files["xl/sharedStrings.xml"]);
  assert.match(strFromU8(files["xl/workbook.xml"]), /name="奇門遁甲"/u);
  assert.equal((sheetXml.match(/<row /gu) ?? []).length, 13);
  assert.match(sheetXml, /r="AR1"/u);
  assert.match(sheetXml, /r="AR2"/u);
  assert.match(sharedStringsXml, /日期/u);
  assert.match(sharedStringsXml, /遁局 日干支/u);
  assert.match(sharedStringsXml, /陰遁四局 戊申日/u);
  assert.match(sharedStringsXml, /壬子時 23/u);
  assert.match(sharedStringsXml, /符伏吟 門反吟/u);
});

await checkAsync("農曆資料來源與時間基準文件存在", async () => {
  await access(new URL("../docs/76_農曆資料來源與時間基準.md", import.meta.url));
});

if (failures.length > 0) {
  console.error(`奇門日期區間匯出測試失敗：${failures.length} 項`);
  process.exitCode = 1;
} else {
  console.log("奇門日期區間匯出測試全部通過");
}
