import qimenYuanJuTable from "../data/qimen/qimen_yuan_ju_table.json" with { type: "json" };
import rawSolarTerms from "../data/solar_terms_1899_2101.json" with { type: "json" };
import { getHourPillar } from "./ganzhi.js";
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

// 初版驗證資料：先覆蓋 2027 芒種、大雪核心案例。
// 後續應改為由符頭三元推進與置閏規則產生 timeline。
const INITIAL_QIMEN_TIMELINE = Object.freeze([
  {
    qimenSolarTerm: "芒種",
    yuan: "上元",
    start: "2027-05-30T23:00:00+08:00",
    end: "2027-06-04T23:00:00+08:00",
    isIntercalary: false,
  },
  {
    qimenSolarTerm: "芒種",
    yuan: "中元",
    start: "2027-06-04T23:00:00+08:00",
    end: "2027-06-09T23:00:00+08:00",
    isIntercalary: false,
  },
  {
    qimenSolarTerm: "芒種",
    yuan: "下元",
    start: "2027-06-09T23:00:00+08:00",
    end: "2027-06-13T23:00:00+08:00",
    isIntercalary: false,
  },
  {
    qimenSolarTerm: "夏至",
    yuan: "上元",
    start: "2027-06-13T23:00:00+08:00",
    end: "2027-06-18T23:00:00+08:00",
    isIntercalary: false,
  },
  {
    qimenSolarTerm: "夏至",
    yuan: "中元",
    start: "2027-06-18T23:00:00+08:00",
    end: "2027-06-23T23:00:00+08:00",
    isIntercalary: false,
  },
  {
    qimenSolarTerm: "大雪",
    yuan: "上元",
    start: "2027-11-25T23:00:00+08:00",
    end: "2027-11-30T23:00:00+08:00",
    isIntercalary: false,
  },
  {
    qimenSolarTerm: "大雪",
    yuan: "中元",
    start: "2027-11-30T23:00:00+08:00",
    end: "2027-12-05T23:00:00+08:00",
    isIntercalary: false,
  },
  {
    qimenSolarTerm: "大雪",
    yuan: "下元",
    start: "2027-12-05T23:00:00+08:00",
    end: "2027-12-10T23:00:00+08:00",
    isIntercalary: false,
  },
  {
    qimenSolarTerm: "大雪",
    yuan: "上元",
    start: "2027-12-10T23:00:00+08:00",
    end: "2027-12-15T23:00:00+08:00",
    isIntercalary: true,
  },
  {
    qimenSolarTerm: "大雪",
    yuan: "中元",
    start: "2027-12-15T23:00:00+08:00",
    end: "2027-12-20T23:00:00+08:00",
    isIntercalary: true,
  },
  {
    qimenSolarTerm: "大雪",
    yuan: "下元",
    start: "2027-12-20T23:00:00+08:00",
    end: "2027-12-25T23:00:00+08:00",
    isIntercalary: true,
  },
  {
    qimenSolarTerm: "冬至",
    yuan: "上元",
    start: "2027-12-25T23:00:00+08:00",
    end: "2027-12-30T23:00:00+08:00",
    isIntercalary: false,
  },
]);

const DUN_NAME_BY_TYPE = Object.freeze({
  yang: "陽遁",
  yin: "陰遁",
});

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
  const timeMs = Date.parse(dateTimeText);
  if (!Number.isFinite(timeMs)) {
    throw new Error(`日期時間格式錯誤：${dateTimeText}`);
  }

  return timeMs;
}

function cloneTimelineEntry(entry) {
  return { ...entry };
}
