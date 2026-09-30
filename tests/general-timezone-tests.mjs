import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";

import {
  calculateBaziFromChartTimeContext,
} from "../src/baziChartTimeAdapter.js";
import { getDayPillarFromLocalParts } from "../src/ganzhi.js";
import {
  createQimenExportRows,
} from "../src/qimenExport.js";
import { resolveQimenJuFromChartTimeContext } from "../src/qimenResolver.js";
import {
  findSolarTermContextByTimeMs,
  getSolarTermOnDateForTimeZone,
  getSolarTermsInMonthForTimeZone,
  normalizeSolarTerms,
} from "../src/solarTerms.js";
import {
  getZonedDateTimeParts,
  resolveLocalDateTimeInTimeZone,
} from "../src/timeZone.js";
import {
  createWatchChartTimeContextFromDateTime,
  createWatchChartTimeContextFromInstant,
} from "../src/watchChartTime.js";

const rawSolarTerms = JSON.parse(await readFile(new URL("../data/solar_terms_1899_2101.json", import.meta.url), "utf8"));
const solarTerms = normalizeSolarTerms(rawSolarTerms);
const mainSource = await readFile(new URL("../src/main.js", import.meta.url), "utf8");
const indexSource = await readFile(new URL("../index.html", import.meta.url), "utf8");

function check(name, callback) {
  try {
    callback();
    console.log(`通過：${name}`);
  } catch (error) {
    console.error(`失敗：${name}`);
    throw error;
  }
}

const lichun = solarTerms.find((term) => term.name === "立春" && term.year_taipei === 2026);
assert.ok(lichun, "找不到 2026 立春");

check("節氣資料保留全球 absolute instant", () => {
  assert.equal(new Date(lichun.timeMs).toISOString(), "2026-02-03T20:02:09.050Z");
  assert.equal(new Date(lichun.utc).getTime(), lichun.timeMs);
  const years = new Set(rawSolarTerms.map((term) => term.year_taipei));
  assert.equal(Math.min(...years), 1899);
  assert.equal(Math.max(...years), 2101);
  assert.equal(solarTerms.filter((term) => term.year_taipei === 2026).length, 24);
});

check("2026 立春依三個 IANA 時區投影", () => {
  const expected = {
    "Asia/Taipei": [2026, 2, 4, 4, 2, 9],
    "Asia/Tokyo": [2026, 2, 4, 5, 2, 9],
    "America/Los_Angeles": [2026, 2, 3, 12, 2, 9],
  };
  for (const [timeZone, values] of Object.entries(expected)) {
    const local = getZonedDateTimeParts(new Date(lichun.timeMs), timeZone).localParts;
    assert.deepEqual(
      [local.year, local.month, local.day, local.hour, local.minute, local.second],
      values
    );
  }
  assert.deepEqual(
    getSolarTermOnDateForTimeZone(solarTerms, { year: 2026, month: 1, day: 3 }, "America/Los_Angeles").map((term) => term.name),
    ["立春"]
  );
  assert.equal(
    getSolarTermsInMonthForTimeZone(solarTerms, 2026, 2, "America/Los_Angeles").some((term) => term.name === "立春"),
    true
  );
  assert.equal(
    getSolarTermsInMonthForTimeZone(solarTerms, 2026, 2, "Asia/Taipei").some((term) => term.name === "立春"),
    true
  );
  assert.deepEqual(
    getSolarTermOnDateForTimeZone(solarTerms, { year: 2026, month: 1, day: 4 }, "America/Los_Angeles").map((term) => term.name),
    []
  );
});

check("節氣交接前後使用 actual instant", () => {
  assert.equal(findSolarTermContextByTimeMs(lichun.timeMs - 1, solarTerms).currentTerm.name, "大寒");
  assert.equal(findSolarTermContextByTimeMs(lichun.timeMs, solarTerms).currentTerm.name, "立春");
  assert.equal(findSolarTermContextByTimeMs(lichun.timeMs + 1, solarTerms).currentTerm.name, "立春");
});

check("同一 UTC instant 產生各地手錶 local parts 與四柱", () => {
  const instantMs = Date.parse("2026-01-01T00:30:00Z");
  const expected = {
    "Asia/Taipei": { local: [2026, 1, 1, 8, 30], day: "乙亥", hour: "庚辰" },
    "Asia/Tokyo": { local: [2026, 1, 1, 9, 30], day: "乙亥", hour: "辛巳" },
    "America/Los_Angeles": { local: [2025, 12, 31, 16, 30], day: "甲戌", hour: "壬申" },
  };
  for (const [timeZone, expectedCase] of Object.entries(expected)) {
    const context = createWatchChartTimeContextFromInstant({ instantMs, timeZone });
    const bazi = calculateBaziFromChartTimeContext(context, solarTerms);
    const qimen = resolveQimenJuFromChartTimeContext(context);
    assert.deepEqual(
      [context.civil.localParts.year, context.civil.localParts.month, context.civil.localParts.day, context.civil.localParts.hour, context.civil.localParts.minute],
      expectedCase.local
    );
    assert.equal(bazi.dayPillar, expectedCase.day);
    assert.equal(bazi.hourPillar, expectedCase.hour);
    assert.equal(qimen.hourPillar, expectedCase.hour);
    assert.equal(qimen.query.timeZone, timeZone);
  }
});

check("auto-now 切換時區保留 actual instant，manual 保留 civil input", () => {
  const instantMs = Date.parse("2026-01-01T04:00:00Z");
  const taipei = createWatchChartTimeContextFromInstant({ instantMs, timeZone: "Asia/Taipei" });
  const tokyo = createWatchChartTimeContextFromInstant({ instantMs, timeZone: "Asia/Tokyo" });
  const losAngeles = createWatchChartTimeContextFromInstant({ instantMs, timeZone: "America/Los_Angeles" });

  assert.equal(taipei.civil.instantMs, instantMs);
  assert.equal(tokyo.civil.instantMs, instantMs);
  assert.equal(losAngeles.civil.instantMs, instantMs);
  assert.deepEqual(
    [taipei.civil.localParts.year, taipei.civil.localParts.month, taipei.civil.localParts.day, taipei.civil.localParts.hour],
    [2026, 1, 1, 12]
  );
  assert.deepEqual(
    [tokyo.civil.localParts.year, tokyo.civil.localParts.month, tokyo.civil.localParts.day, tokyo.civil.localParts.hour],
    [2026, 1, 1, 13]
  );
  assert.deepEqual(
    [losAngeles.civil.localParts.year, losAngeles.civil.localParts.month, losAngeles.civil.localParts.day, losAngeles.civil.localParts.hour],
    [2025, 12, 31, 20]
  );

  const manualTaipei = createWatchChartTimeContextFromDateTime({
    dateTimeValue: "2026-01-01T05:00:00",
    timeZone: "Asia/Taipei",
  });
  const manualTokyo = createWatchChartTimeContextFromDateTime({
    dateTimeValue: "2026-01-01T05:00:00",
    timeZone: "Asia/Tokyo",
  });
  assert.equal(manualTaipei.status, "resolved");
  assert.equal(manualTokyo.status, "resolved");
  assert.equal(manualTaipei.context.civil.localParts.hour, 5);
  assert.equal(manualTokyo.context.civil.localParts.hour, 5);
  assert.equal(manualTokyo.context.civil.instantMs - manualTaipei.context.civil.instantMs, -3_600_000);
});

check("各時區 23:00 沿用既有換日規則", () => {
  for (const timeZone of ["Asia/Taipei", "Asia/Tokyo", "America/Los_Angeles"]) {
    const dateTimeValue = "2026-08-10T23:00:00";
    const context = createWatchChartTimeContextFromDateTime({ dateTimeValue, timeZone });
    const expectedDay = getDayPillarFromLocalParts(context.context.civil.localParts).pillar;
    const bazi = calculateBaziFromChartTimeContext(context.context, solarTerms);
    assert.equal(bazi.dayPillar, expectedDay);
    assert.equal(context.context.civil.localParts.hour, 23);
  }
});

check("Los Angeles DST 不存在與重複時間遵循 resolver", () => {
  const nonexistent = resolveLocalDateTimeInTimeZone({
    localParts: { year: 2026, month: 3, day: 8, hour: 2, minute: 30, second: 0 },
    timeZone: "America/Los_Angeles",
  });
  assert.equal(nonexistent.status, "nonexistent");

  const ambiguous = resolveLocalDateTimeInTimeZone({
    localParts: { year: 2026, month: 11, day: 1, hour: 1, minute: 30, second: 0 },
    timeZone: "America/Los_Angeles",
  });
  assert.equal(ambiguous.status, "ambiguous");
  const earlier = createWatchChartTimeContextFromDateTime({
    dateTimeValue: "2026-11-01T01:30:00",
    timeZone: "America/Los_Angeles",
    disambiguation: "earlier",
  });
  const later = createWatchChartTimeContextFromDateTime({
    dateTimeValue: "2026-11-01T01:30:00",
    timeZone: "America/Los_Angeles",
    disambiguation: "later",
  });
  assert.equal(earlier.status, "resolved");
  assert.equal(later.status, "resolved");
  assert.equal(earlier.context.civil.disambiguation, "earlier");
  assert.equal(later.context.civil.disambiguation, "later");
  assert.equal(later.context.civil.instantMs - earlier.context.civil.instantMs, 3_600_000);
});

check("auto-now 保留 fall-back 的 actual instant，manual 仍需 disambiguation", () => {
  const first = createWatchChartTimeContextFromInstant({
    instantMs: Date.parse("2026-11-01T08:30:00Z"),
    timeZone: "America/Los_Angeles",
  });
  const second = createWatchChartTimeContextFromInstant({
    instantMs: Date.parse("2026-11-01T09:30:00Z"),
    timeZone: "America/Los_Angeles",
  });

  assert.deepEqual(
    [first.civil.localParts.year, first.civil.localParts.month, first.civil.localParts.day, first.civil.localParts.hour, first.civil.localParts.minute],
    [2026, 11, 1, 1, 30]
  );
  assert.equal(first.civil.utcOffsetMinutes, -420);
  assert.equal(first.civil.disambiguation ?? null, null);
  assert.equal(first.civil.instantMs, Date.parse("2026-11-01T08:30:00Z"));

  assert.deepEqual(
    [second.civil.localParts.year, second.civil.localParts.month, second.civil.localParts.day, second.civil.localParts.hour, second.civil.localParts.minute],
    [2026, 11, 1, 1, 30]
  );
  assert.equal(second.civil.utcOffsetMinutes, -480);
  assert.equal(second.civil.disambiguation ?? null, null);
  assert.equal(second.civil.instantMs, Date.parse("2026-11-01T09:30:00Z"));

  const manual = createWatchChartTimeContextFromDateTime({
    dateTimeValue: "2026-11-01T01:30:00",
    timeZone: "America/Los_Angeles",
  });
  assert.equal(manual.status, "ambiguous");
  assert.ok(manual.resolution.candidates.length >= 2);
});

check("一般 watch seasonal marker 依 selected IANA timezone 投影", () => {
  const makeContext = (dateTimeValue, timeZone) => {
    const resolved = createWatchChartTimeContextFromDateTime({ dateTimeValue, timeZone });
    assert.equal(resolved.status, "resolved");
    return resolved.context;
  };

  const laBeforeLichun = calculateBaziFromChartTimeContext(
    makeContext("2026-02-02T12:00:00", "America/Los_Angeles"),
    solarTerms
  );
  assert.equal(laBeforeLichun.dailyInfo?.seasonalMarker?.label, "絕日：木旺水絕");

  const laSameDateBeforeLichun = calculateBaziFromChartTimeContext(
    makeContext("2026-02-03T10:00:00", "America/Los_Angeles"),
    solarTerms
  );
  assert.equal(laSameDateBeforeLichun.dailyInfo?.seasonalMarker ?? null, null);

  const laAtLocal2300 = calculateBaziFromChartTimeContext(
    makeContext("2026-02-02T23:00:00", "America/Los_Angeles"),
    solarTerms
  );
  assert.equal(laAtLocal2300.debug.effectiveDayDateKey, "2026-02-03");
  assert.equal(laAtLocal2300.dailyInfo?.seasonalMarker ?? null, null);
});

check("一般 watch 三伏日期依 selected IANA timezone 跨日期", () => {
  const makeResult = (dateTimeValue, timeZone) => {
    const resolved = createWatchChartTimeContextFromDateTime({ dateTimeValue, timeZone });
    assert.equal(resolved.status, "resolved");
    return calculateBaziFromChartTimeContext(resolved.context, solarTerms);
  };

  assert.equal(
    makeResult("2025-07-20T12:00:00", "Asia/Taipei").dailyInfo?.sanfu?.type,
    "初伏"
  );
  assert.equal(
    makeResult("2025-07-10T12:00:00", "America/Los_Angeles").dailyInfo?.sanfu?.type,
    "初伏"
  );
  assert.equal(
    makeResult("2025-07-09T12:00:00", "America/Los_Angeles").dailyInfo?.sanfu ?? null,
    null
  );
});

check("host timezone 不影響相同 civil input 與 selected IANA timezone", () => {
  const probe = `
    import { readFile } from "node:fs/promises";
    import { normalizeSolarTerms } from "./src/solarTerms.js";
    import { calculateBaziFromChartTimeContext } from "./src/baziChartTimeAdapter.js";
    import { createWatchChartTimeContextFromDateTime } from "./src/watchChartTime.js";
    const terms = normalizeSolarTerms(JSON.parse(await readFile("./data/solar_terms_1899_2101.json", "utf8")));
    const context = createWatchChartTimeContextFromDateTime({ dateTimeValue: "2026-02-04T05:00:00", timeZone: "Asia/Tokyo" }).context;
    const result = calculateBaziFromChartTimeContext(context, terms);
    console.log(JSON.stringify({ instantMs: context.civil.instantMs, local: context.civil.localParts, bazi: [result.yearPillar, result.monthPillar, result.dayPillar, result.hourPillar] }));
  `;
  const runProbe = (timeZone) => execFileSync(
    process.execPath,
    ["--input-type=module", "-e", probe],
    { cwd: process.cwd(), env: { ...process.env, TZ: timeZone }, encoding: "utf8" }
  ).trim();
  assert.equal(runProbe("Asia/Taipei"), runProbe("America/Los_Angeles"));
});

check("Excel fixed calendar contract 不受一般 selected timezone 影響", () => {
  const first = createQimenExportRows("2026-10-01", "2026-10-31");
  const second = createQimenExportRows("2026-10-01", "2026-10-31");
  assert.equal(first.length, 372);
  assert.deepEqual(second, first);
  assert.equal(first[0][0], "2026/10/01");
  assert.equal(first[0][2], "壬子時 23");
});

check("一般模式 UI 接線與真太陽時／Excel 契約分離", () => {
  assert.ok(indexSource.includes("id=\"general-time-zone\""));
  assert.ok(indexSource.includes("id=\"general-time-zone-disambiguation\""));
  assert.ok(mainSource.includes("getDeviceTimeZone()"));
  assert.ok(mainSource.includes("getSolarTermsInMonthForTimeZone"));
  assert.ok(mainSource.includes("getSolarTermOnDateForTimeZone"));
  assert.ok(mainSource.includes("resolveQimenJuFromChartTimeContext"));
  assert.ok(mainSource.includes("區間匯出不受顯示時區影響"));
  assert.ok(mainSource.includes('timeZone: "Asia/Taipei"'));
  assert.equal(mainSource.includes("term.asia_taipei.slice(8, 10)"), false);
  assert.ok(mainSource.includes("createWatchChartTimeContextFromInstant"));
  assert.ok(mainSource.includes("getActiveWatchChartTimeContextFromInstant(Date.now())"));
  assert.ok(mainSource.includes("requestRenderDateTime(elements.datetime.value, chartTimeContext)"));
});

console.log("一般模式 IANA 時區測試全部通過");
