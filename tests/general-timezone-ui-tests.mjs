import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  formatUtcOffset,
  getZonedDateTimeParts,
  resolveLocalDateTimeInTimeZone,
} from "../src/timeZone.js";

const [indexSource, mainSource, cssSource] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../src/main.js", import.meta.url), "utf8"),
  readFile(new URL("../styles/main.css", import.meta.url), "utf8"),
]);

function extractNamedFunctionSource(source, name) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `找不到函式：${name}`);
  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  let inString = null;
  let escaped = false;
  for (let index = bodyStart; index < source.length; index += 1) {
    const character = source[index];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === inString) {
        inString = null;
      }
      continue;
    }
    if (character === "\"" || character === "'" || character === "`") {
      inString = character;
      continue;
    }
    if (character === "{") depth += 1;
    if (character === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  throw new Error(`函式未完整結束：${name}`);
}

function createLocalPartsParser(value) {
  const match = String(value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/u);
  if (!match) return null;
  const [, year, month, day, hour, minute, second = "0"] = match;
  const parts = {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
    millisecond: 0,
  };
  const carrier = new Date(Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  ));
  return carrier.getUTCFullYear() === parts.year
    && carrier.getUTCMonth() === parts.month - 1
    && carrier.getUTCDate() === parts.day
    && carrier.getUTCHours() === parts.hour
    && carrier.getUTCMinutes() === parts.minute
    && carrier.getUTCSeconds() === parts.second
    ? parts
    : null;
}

const summaryFunction = extractNamedFunctionSource(mainSource, "getGeneralTimeZoneSummaryText");
const getSummary = Function(
  "parseWatchDateTimeLocalParts",
  "resolveLocalDateTimeInTimeZone",
  "getZonedDateTimeParts",
  "formatUtcOffset",
  `return function (elements, generalTimeZone, generalTimeZoneDisambiguation, currentGeneralWatchChartTimeContext, isAutoNowMode) {\n${summaryFunction}\nreturn getGeneralTimeZoneSummaryText();\n}`
)(
  createLocalPartsParser,
  resolveLocalDateTimeInTimeZone,
  getZonedDateTimeParts,
  formatUtcOffset,
);

const effectiveTimeFunction = extractNamedFunctionSource(mainSource, "getEffectiveQueryTimeSummaryValue");
const applyTimeZoneFunction = extractNamedFunctionSource(mainSource, "applyGeneralTimeZoneInput");
const getEffectiveTime = Function(
  "currentTrueSolarChartContext",
  "chartTimeState",
  "formatDateTimeParts",
  "formatChartTimeStatusDateTime",
  `${effectiveTimeFunction}\nreturn getEffectiveQueryTimeSummaryValue;`
)(
  {
    trueSolar: {
      localParts: { year: 2026, month: 9, day: 30, hour: 12, minute: 2, second: 11 },
    },
  },
  { mode: "watch", effectiveDateTimeValue: "2026-09-30T12:02:11" },
  (parts) => `${parts.year}/${String(parts.month).padStart(2, "0")}/${String(parts.day).padStart(2, "0")} ${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}`,
  () => "fallback",
);
assert.equal(getEffectiveTime(), "2026/09/30 12:02:11");

const statusFunction = extractNamedFunctionSource(mainSource, "setGeneralTimeZoneStatus");
const expandFunction = extractNamedFunctionSource(mainSource, "expandQueryTimeSettings");
const syncAccessibilityFunction = extractNamedFunctionSource(mainSource, "syncQueryTimeSettingsAccessibility");
const createStatusHandler = Function(
  "elements",
  `${syncAccessibilityFunction}\n${expandFunction}\n${statusFunction}\nreturn setGeneralTimeZoneStatus;`
);
const errorElements = {
  generalTimeZoneStatus: { textContent: "", className: "" },
  queryTimeSettings: { open: false },
  queryTimeSettingsSummary: { setAttribute() {} },
};
createStatusHandler(errorElements)("輸入錯誤", "error");
assert.equal(errorElements.queryTimeSettings.open, true);

const settingsBlock = indexSource.match(/<details id="query-time-settings"[\s\S]*?<\/details>/u)?.[0];
assert.ok(settingsBlock, "一般時間／時區設定區應使用 details 元件");
assert.doesNotMatch(settingsBlock, /<details[^>]*\bopen(?:\s|=|>)/u, "設定區預設不可帶 open");
assert.match(settingsBlock, /<summary id="query-time-settings-summary"[^>]*aria-expanded="false"/u);
assert.match(settingsBlock, /調整時間／時區/u);
assert.match(settingsBlock, /id="query-time-settings-panel"/u);
assert.ok(settingsBlock.indexOf('id="precise-chart-time-control"') > settingsBlock.indexOf('id="query-time-settings-panel"'));
assert.ok(settingsBlock.indexOf('id="general-time-zone-control"') > settingsBlock.indexOf('id="query-time-settings-panel"'));
assert.doesNotMatch(settingsBlock, /一般排盤的手錶時間、節氣顯示/u, "長篇一般說明不可留在展開區");

assert.match(mainSource, /elements\.queryTimeSettings\.addEventListener\("toggle", syncQueryTimeSettingsAccessibility\)/u);
assert.match(mainSource, /function initializeQueryTimeSettings\(\)[\s\S]*?elements\.queryTimeSettings\.open = false/u);
assert.match(mainSource, /function syncQueryTimeSettingsAccessibility\(\)[\s\S]*?aria-expanded/u);
assert.match(mainSource, /if \(type === "error"\) \{[\s\S]*?expandQueryTimeSettings\(\)/u);
assert.match(mainSource, /function handleGeneralTimeZoneDisambiguationChange[\s\S]*?generalTimeZoneDisambiguation = event\.target\.value[\s\S]*?requestRenderDateTime/u);
assert.match(mainSource, /function renderChartQueryTimeModeStatus[\s\S]*?renderGeneralTimeZoneSummary\(\)/u);
assert.match(mainSource, /getGeneralTimeZoneSummaryText[\s\S]*?resolveLocalDateTimeInTimeZone[\s\S]*?formatUtcOffset/u);
assert.match(applyTimeZoneFunction, /const autoNowInstantMs = isAutoNowMode \? Date\.now\(\) : null/u);
assert.match(applyTimeZoneFunction, /if \(isAutoNowMode\) \{[\s\S]*?refreshFromCurrentTime\(autoNowInstantMs\)/u);
assert.match(applyTimeZoneFunction, /if \(!isAutoNowMode && elements\.datetime\.value\) \{[\s\S]*?requestRenderDateTime\(elements\.datetime\.value\)/u);
assert.match(summaryFunction, /isAutoNowMode[\s\S]*?currentGeneralWatchChartTimeContext[\s\S]*?utcOffsetMinutes/u);

const summaryFixture = { datetime: { value: "2026-07-01T12:00:00" } };
const summerSummary = getSummary(summaryFixture, "America/Los_Angeles", null);
assert.equal(summerSummary, "時區：America/Los_Angeles（UTC-07:00）");
summaryFixture.datetime.value = "2026-01-01T12:00:00";
const winterSummary = getSummary(summaryFixture, "America/Los_Angeles", null);
assert.equal(winterSummary, "時區：America/Los_Angeles（UTC-08:00）");

summaryFixture.datetime.value = "2026-03-08T02:30:00";
assert.match(getSummary(summaryFixture, "America/Los_Angeles", null), /當地時間不存在/u);
summaryFixture.datetime.value = "2026-11-01T01:30:00";
assert.match(getSummary(summaryFixture, "America/Los_Angeles", null), /請選 earlier \/ later/u);
assert.equal(
  getSummary(summaryFixture, "America/Los_Angeles", "earlier"),
  "時區：America/Los_Angeles（UTC-07:00）",
);
assert.equal(
  getSummary(summaryFixture, "America/Los_Angeles", "later"),
  "時區：America/Los_Angeles（UTC-08:00）",
);

const autoNowEarlyContext = {
  civil: {
    timeZone: "America/Los_Angeles",
    utcOffsetMinutes: -420,
  },
};
const autoNowLaterContext = {
  civil: {
    timeZone: "America/Los_Angeles",
    utcOffsetMinutes: -480,
  },
};
assert.equal(
  getSummary(summaryFixture, "America/Los_Angeles", null, autoNowEarlyContext, true),
  "時區：America/Los_Angeles（UTC-07:00）",
);
assert.equal(
  getSummary(summaryFixture, "America/Los_Angeles", null, autoNowLaterContext, true),
  "時區：America/Los_Angeles（UTC-08:00）",
);
assert.match(
  getSummary(summaryFixture, "America/Los_Angeles", null, autoNowEarlyContext, false),
  /請選 earlier \/ later/u,
);

const requiredSpecNotes = [
  "一般模式預設使用裝置時區",
  "節氣交接依 solar_terms_1899_2101.json 的絕對瞬間判定",
  "一般排盤使用所選時區的手錶時間",
  "23:00 起換日",
  "真太陽時頁面維持獨立設定，不受一般模式時區切換影響",
  "奇門日期區間 Excel 依奇門曆日產生，不受一般顯示時區影響",
  "農曆維持既有 CWA Taiwan civil date 契約",
];
for (const note of requiredSpecNotes) {
  assert.ok(indexSource.includes(note) || mainSource.includes(note), `規格說明缺少：${note}`);
}

assert.match(cssSource, /\.query-time-settings-summary[\s\S]*?cursor: pointer/u);
assert.match(cssSource, /\.query-time-settings-panel[\s\S]*?min-width: 0/u);
assert.match(cssSource, /@media \(max-width: 460px\)[\s\S]*?\.query-time-settings-summary/u);
assert.doesNotMatch(cssSource, /(?:^|\n)summary\s*\{/u, "不可用未限定的 summary 全域樣式");

console.log("一般時間／時區收合 UI 回歸測試全部通過");
