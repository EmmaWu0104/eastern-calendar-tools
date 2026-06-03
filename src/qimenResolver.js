import qimenYuanJuTable from "../data/qimen/qimen_yuan_ju_table.json" with { type: "json" };
import rawSolarTerms from "../data/solar_terms_1899_2101.json" with { type: "json" };
import { getDayPillar, getHourPillar } from "./ganzhi.js";
import { normalizeSolarTerms } from "./solarTerms.js";

export const QIMEN_TERM_SEQUENCE = Object.freeze([
  "冬至",
  "小寒",
  "大寒",
  "立春",
  "雨水",
  "驚蟄",
  "春分",
  "清明",
  "穀雨",
  "立夏",
  "小滿",
  "芒種",
  "夏至",
  "小暑",
  "大暑",
  "立秋",
  "處暑",
  "白露",
  "秋分",
  "寒露",
  "霜降",
  "立冬",
  "小雪",
  "大雪",
]);

const DUN_NAME_BY_TYPE = Object.freeze({
  yang: "陽遁",
  yin: "陰遁",
});
const YUAN_SEQUENCE = Object.freeze(["上元", "中元", "下元"]);
const YUAN_BRANCHES = Object.freeze({
  上元: new Set(["子", "午", "卯", "酉"]),
  中元: new Set(["寅", "申", "巳", "亥"]),
  下元: new Set(["辰", "戌", "丑", "未"]),
});
const TAIPEI_OFFSET_MS = 8 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// 初版驗證資料：先覆蓋 2027 芒種、大雪核心案例。
// 後續應改為由符頭三元推進與置閏規則產生 timeline。
const INITIAL_QIMEN_TIMELINE = Object.freeze(buildInitialQimenTimeline());

const solarTerms = normalizeSolarTerms(rawSolarTerms);

export function resolveQimenJu(dateTimeText) {
  const timelineEntry = findQimenTimelineEntry(dateTimeText);
  if (!timelineEntry) {
    throw new RangeError("查詢時間不在奇門 resolver 初版 timeline 覆蓋範圍內");
  }

  const actualSolarTerm = findActualSolarTerm(dateTimeText);
  const yuanJu = getQimenYuanJu(timelineEntry.qimenSolarTerm, timelineEntry.yuan);
  const localDateTimeText = toTaipeiLocalDateTimeText(dateTimeText);
  const hourPillar = getHourPillar(localDateTimeText).pillar;

  return {
    actualSolarTerm,
    qimenSolarTerm: timelineEntry.qimenSolarTerm,
    status: resolveQimenStatus(actualSolarTerm, timelineEntry),
    yuan: timelineEntry.yuan,
    dunType: yuanJu.dunType,
    dunName: yuanJu.dunName,
    ju: yuanJu.ju,
    hourPillar,
    isIntercalary: timelineEntry.isIntercalary,
    notes: timelineEntry.isIntercalary ? ["查詢時間落在初版置閏 timeline 內。"] : [],
  };
}

export function getQimenYuanJu(termName, yuan) {
  const term = qimenYuanJuTable.terms?.[termName];
  if (!term) {
    throw new RangeError(`未知奇門節氣：${termName}`);
  }

  const ju = term.ju?.[yuan];
  if (!Number.isInteger(ju)) {
    throw new RangeError(`未知奇門元別：${termName} ${yuan}`);
  }

  return {
    dunType: term.dunType,
    dunName: DUN_NAME_BY_TYPE[term.dunType] ?? "",
    ju,
  };
}

export function getQimenTimelineForRange(startDateTime, endDateTime) {
  const startMs = toTimeMs(startDateTime);
  const endMs = toTimeMs(endDateTime);

  if (startMs >= endMs) {
    throw new RangeError("timeline 查詢範圍需符合 start < end");
  }

  return INITIAL_QIMEN_TIMELINE.filter((entry) => {
    return toTimeMs(entry.start) < endMs && toTimeMs(entry.end) > startMs;
  }).map(cloneTimelineEntry);
}

export function findQimenTimelineEntry(dateTimeText) {
  const targetMs = toTimeMs(dateTimeText);
  const entry = INITIAL_QIMEN_TIMELINE.find((candidate) => {
    return toTimeMs(candidate.start) <= targetMs && targetMs < toTimeMs(candidate.end);
  });

  return entry ? cloneTimelineEntry(entry) : null;
}

export function isQimenFuTou(dayPillar) {
  if (typeof dayPillar !== "string" || dayPillar.length !== 2) {
    return false;
  }

  return dayPillar[0] === "甲" || dayPillar[0] === "己";
}

export function getQimenYuanByFuTou(dayPillar) {
  if (!isQimenFuTou(dayPillar)) {
    return null;
  }

  const branch = dayPillar[1];
  for (const [yuan, branches] of Object.entries(YUAN_BRANCHES)) {
    if (branches.has(branch)) {
      return yuan;
    }
  }

  return null;
}

export function getDayPillarForEffectiveDay(effectiveDayStartText) {
  return getDayPillar(toTaipeiLocalDateTimeText(effectiveDayStartText)).pillar;
}

export function scanQimenFuTouDays(startEffectiveDayText, endEffectiveDayText) {
  const startMs = toTimeMs(startEffectiveDayText);
  const endMs = toTimeMs(endEffectiveDayText);

  if (startMs >= endMs) {
    throw new RangeError("符頭掃描範圍需符合 start < end");
  }

  const result = [];
  let current = formatTaipeiDateTime(startMs);

  while (toTimeMs(current) < endMs) {
    const dayPillar = getDayPillarForEffectiveDay(current);
    if (isQimenFuTou(dayPillar)) {
      result.push({
        effectiveDayStart: current,
        dayPillar,
        yuan: getQimenYuanByFuTou(dayPillar),
      });
    }

    current = addQimenEffectiveDays(current, 1);
  }

  return result;
}

export function getQimenEffectiveDayStart(dateTimeText) {
  const targetMs = toTimeMs(dateTimeText);
  const taipeiDate = new Date(targetMs + TAIPEI_OFFSET_MS);
  const year = taipeiDate.getUTCFullYear();
  const month = taipeiDate.getUTCMonth();
  const day = taipeiDate.getUTCDate();
  const hour = taipeiDate.getUTCHours();
  const minute = taipeiDate.getUTCMinutes();
  const second = taipeiDate.getUTCSeconds();
  const isSameDayStart = hour > 23 || (hour === 23 && (minute > 0 || second >= 0));
  const startCivilMs = Date.UTC(year, month, day, 23, 0, 0) - TAIPEI_OFFSET_MS;
  const effectiveStartMs = isSameDayStart ? startCivilMs : startCivilMs - DAY_MS;

  return formatTaipeiDateTime(effectiveStartMs);
}

export function addQimenEffectiveDays(effectiveDayStartText, days) {
  if (!Number.isInteger(days)) {
    throw new RangeError("有效日加減天數需為整數");
  }

  return formatTaipeiDateTime(toTimeMs(effectiveDayStartText) + days * DAY_MS);
}

export function buildQimenYuanRange({ qimenSolarTerm, yuan, start, isIntercalary = false }) {
  return {
    qimenSolarTerm,
    yuan,
    start,
    end: addQimenEffectiveDays(start, 5),
    isIntercalary,
  };
}

export function buildQimenTermRanges({ qimenSolarTerm, start, isIntercalary = false }) {
  return YUAN_SEQUENCE.map((yuan, index) => {
    return buildQimenYuanRange({
      qimenSolarTerm,
      yuan,
      start: addQimenEffectiveDays(start, index * 5),
      isIntercalary,
    });
  });
}

export function buildQimenTimelineFromFuTouDays({ fuTouDays, termAssignments }) {
  if (!Array.isArray(fuTouDays)) {
    throw new TypeError("fuTouDays 需為陣列");
  }

  if (!termAssignments || typeof termAssignments !== "object" || Array.isArray(termAssignments)) {
    throw new RangeError("termAssignments 需為物件");
  }

  return fuTouDays.map((fuTouDay) => {
    const assignment = termAssignments[fuTouDay.effectiveDayStart];
    if (!assignment?.qimenSolarTerm || typeof assignment.isIntercalary !== "boolean") {
      throw new RangeError(`缺少奇門節氣指定：${fuTouDay.effectiveDayStart}`);
    }

    return {
      qimenSolarTerm: assignment.qimenSolarTerm,
      yuan: fuTouDay.yuan,
      start: fuTouDay.effectiveDayStart,
      end: addQimenEffectiveDays(fuTouDay.effectiveDayStart, 5),
      isIntercalary: assignment.isIntercalary,
      sourceDayPillar: fuTouDay.dayPillar,
    };
  });
}

function buildInitialQimenTimeline() {
  return [
    ...buildQimenTermRanges({
      qimenSolarTerm: "芒種",
      start: "2027-05-29T23:00:00+08:00",
      isIntercalary: false,
    }),
    ...buildQimenTermRanges({
      qimenSolarTerm: "夏至",
      start: "2027-06-13T23:00:00+08:00",
      isIntercalary: false,
    }),
    ...buildQimenTermRanges({
      qimenSolarTerm: "大雪",
      start: "2027-11-25T23:00:00+08:00",
      isIntercalary: false,
    }),
    ...buildQimenTermRanges({
      qimenSolarTerm: "大雪",
      start: "2027-12-10T23:00:00+08:00",
      isIntercalary: true,
    }),
    ...buildQimenTermRanges({
      qimenSolarTerm: "冬至",
      start: "2027-12-25T23:00:00+08:00",
      isIntercalary: false,
    }),
  ];
}

function findActualSolarTerm(dateTimeText) {
  const targetMs = toTimeMs(dateTimeText);
  let currentTerm = null;

  for (const term of solarTerms) {
    if (term.timeMs > targetMs) {
      break;
    }

    currentTerm = term;
  }

  if (!currentTerm) {
    throw new RangeError("輸入時間早於節氣資料範圍");
  }

  return currentTerm.name;
}

function resolveQimenStatus(actualSolarTerm, timelineEntry) {
  if (timelineEntry.isIntercalary && isActualTermAhead(actualSolarTerm, timelineEntry.qimenSolarTerm)) {
    return "置閏後接氣";
  }

  if (timelineEntry.isIntercalary) {
    return "置閏";
  }

  if (actualSolarTerm === timelineEntry.qimenSolarTerm) {
    return "正常";
  }

  if (isQimenTermAhead(actualSolarTerm, timelineEntry.qimenSolarTerm)) {
    return "超神";
  }

  return "接氣";
}

function isQimenTermAhead(actualSolarTerm, qimenSolarTerm) {
  const forwardDistance = getForwardTermDistance(actualSolarTerm, qimenSolarTerm);
  return forwardDistance > 0 && forwardDistance <= QIMEN_TERM_SEQUENCE.length / 2;
}

function isActualTermAhead(actualSolarTerm, qimenSolarTerm) {
  return actualSolarTerm !== qimenSolarTerm && !isQimenTermAhead(actualSolarTerm, qimenSolarTerm);
}

function getForwardTermDistance(fromTerm, toTerm) {
  const fromIndex = QIMEN_TERM_SEQUENCE.indexOf(fromTerm);
  const toIndex = QIMEN_TERM_SEQUENCE.indexOf(toTerm);

  if (fromIndex < 0 || toIndex < 0) {
    throw new RangeError(`未知節氣：${fromIndex < 0 ? fromTerm : toTerm}`);
  }

  return (toIndex - fromIndex + QIMEN_TERM_SEQUENCE.length) % QIMEN_TERM_SEQUENCE.length;
}

function toTaipeiLocalDateTimeText(dateTimeText) {
  if (!hasExplicitOffset(dateTimeText)) {
    return dateTimeText;
  }

  if (/[+]08:00$/.test(dateTimeText)) {
    return dateTimeText.slice(0, -6);
  }

  const date = new Date(toTimeMs(dateTimeText));
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`;
}

function hasExplicitOffset(dateTimeText) {
  return /(?:Z|[+-]\d{2}:?\d{2})$/.test(dateTimeText);
}

function toTimeMs(dateTimeText) {
  const normalized = typeof dateTimeText === "string" && !hasExplicitOffset(dateTimeText)
    ? `${dateTimeText}+08:00`
    : dateTimeText;
  const timeMs = Date.parse(normalized);
  if (!Number.isFinite(timeMs)) {
    throw new Error(`日期時間格式錯誤：${dateTimeText}`);
  }

  return timeMs;
}

function cloneTimelineEntry(entry) {
  return { ...entry };
}

function formatTaipeiDateTime(timeMs) {
  const taipeiDate = new Date(timeMs + TAIPEI_OFFSET_MS);
  const year = String(taipeiDate.getUTCFullYear()).padStart(4, "0");
  const month = String(taipeiDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(taipeiDate.getUTCDate()).padStart(2, "0");
  const hour = String(taipeiDate.getUTCHours()).padStart(2, "0");
  const minute = String(taipeiDate.getUTCMinutes()).padStart(2, "0");
  const second = String(taipeiDate.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}:${second}+08:00`;
}
