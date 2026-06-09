import { EARTHLY_BRANCHES } from "./ganzhi.js";

export const DEFAULT_GUIDENG_LOCATION = Object.freeze({
  latitude: 25.0330,
  longitude: 121.5654,
  timezone: "Asia/Taipei",
});

export const TIANMEN_BRANCH = "亥";

export const NOBLE_BRANCHES_BY_DAY_STEM = Object.freeze({
  甲: Object.freeze({ yang: "未", yin: "丑" }),
  乙: Object.freeze({ yang: "申", yin: "子" }),
  丙: Object.freeze({ yang: "酉", yin: "亥" }),
  丁: Object.freeze({ yang: "亥", yin: "酉" }),
  戊: Object.freeze({ yang: "丑", yin: "未" }),
  己: Object.freeze({ yang: "子", yin: "申" }),
  庚: Object.freeze({ yang: "丑", yin: "未" }),
  辛: Object.freeze({ yang: "寅", yin: "午" }),
  壬: Object.freeze({ yang: "卯", yin: "巳" }),
  癸: Object.freeze({ yang: "巳", yin: "卯" }),
});

export const MONTH_GENERAL_BY_CURRENT_TERM = Object.freeze({
  立春: "子",
  雨水: "亥",
  驚蟄: "亥",
  春分: "戌",
  清明: "戌",
  穀雨: "酉",
  立夏: "酉",
  小滿: "申",
  芒種: "申",
  夏至: "未",
  小暑: "未",
  大暑: "午",
  立秋: "午",
  處暑: "巳",
  白露: "巳",
  秋分: "辰",
  寒露: "辰",
  霜降: "卯",
  立冬: "卯",
  小雪: "寅",
  大雪: "寅",
  冬至: "丑",
  小寒: "丑",
  大寒: "子",
});

const HOUR_START_BY_BRANCH = Object.freeze({
  子: 23,
  丑: 1,
  寅: 3,
  卯: 5,
  辰: 7,
  巳: 9,
  午: 11,
  未: 13,
  申: 15,
  酉: 17,
  戌: 19,
  亥: 21,
});

let sunCalcPromise = null;

export function getMonthGeneralBySolarTermName(termName) {
  return MONTH_GENERAL_BY_CURRENT_TERM[termName] ?? null;
}

export function calculateGuiDengHourBranches(dayStem, monthGeneral) {
  const normalizedStem = normalizeBranchText(dayStem).charAt(0);
  const normalizedMonthGeneral = normalizeBranchText(monthGeneral);
  const nobleBranches = NOBLE_BRANCHES_BY_DAY_STEM[normalizedStem] ?? null;

  if (!nobleBranches || !isKnownBranch(normalizedMonthGeneral)) {
    return null;
  }

  return {
    dayStem: normalizedStem,
    monthGeneral: normalizedMonthGeneral,
    yang: {
      type: "yang",
      nobleBranch: nobleBranches.yang,
      hourBranch: calculateGuiDengHourBranch(nobleBranches.yang, normalizedMonthGeneral),
    },
    yin: {
      type: "yin",
      nobleBranch: nobleBranches.yin,
      hourBranch: calculateGuiDengHourBranch(nobleBranches.yin, normalizedMonthGeneral),
    },
  };
}

export async function calculateGuiDengForDate({
  date,
  dayStem,
  monthGeneral,
  latitude = DEFAULT_GUIDENG_LOCATION.latitude,
  longitude = DEFAULT_GUIDENG_LOCATION.longitude,
  timezone = DEFAULT_GUIDENG_LOCATION.timezone,
} = {}) {
  const targetDate = normalizeDate(date);
  if (!targetDate) {
    return null;
  }

  const SunCalc = await loadSunCalc();
  const nextDate = addDays(targetDate, 1);
  const todayTimes = SunCalc.getTimes(targetDate, latitude, longitude);
  const nextDayTimes = SunCalc.getTimes(nextDate, latitude, longitude);

  return calculateGuiDengWithSunTimes({
    date: targetDate,
    dayStem,
    monthGeneral,
    sunrise: todayTimes.sunrise,
    sunset: todayTimes.sunset,
    nextDaySunrise: nextDayTimes.sunrise,
    timezone,
  });
}

export function calculateGuiDengWithSunTimes({
  date,
  dayStem,
  monthGeneral,
  sunrise,
  sunset,
  nextDaySunrise,
  timezone = DEFAULT_GUIDENG_LOCATION.timezone,
} = {}) {
  const targetDate = normalizeDate(date);
  const hourBranches = calculateGuiDengHourBranches(dayStem, monthGeneral);
  const sun = {
    sunrise: normalizeDate(sunrise),
    sunset: normalizeDate(sunset),
    nextDaySunrise: normalizeDate(nextDaySunrise),
  };

  if (!targetDate || !hourBranches || !sun.sunrise || !sun.sunset || !sun.nextDaySunrise) {
    return null;
  }

  const yang = createGuiDengEntry({
    type: "yang",
    label: "陽貴",
    hourBranch: hourBranches.yang.hourBranch,
    date: targetDate,
    usableRange: { start: sun.sunrise, end: sun.sunset },
    timezone,
  });
  const yin = createGuiDengEntry({
    type: "yin",
    label: "陰貴",
    hourBranch: hourBranches.yin.hourBranch,
    date: targetDate,
    usableRange: { start: sun.sunset, end: sun.nextDaySunrise },
    timezone,
  });
  const entries = [yang, yin].filter((entry) => entry.isAvailable);

  return {
    dayStem: hourBranches.dayStem,
    monthGeneral: hourBranches.monthGeneral,
    sun,
    sunriseText: formatTime(sun.sunrise, timezone),
    sunsetText: formatTime(sun.sunset, timezone),
    yang,
    yin,
    entries,
    guiDengText: formatGuiDengEntries(entries),
  };
}

export function formatGuiDengEntries(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return "無";
  }

  return entries
    .map((entry) => `${entry.hourBranch}時（${entry.label}，${entry.rangeText}）`)
    .join("；");
}

function calculateGuiDengHourBranch(nobleBranch, monthGeneral) {
  const nobleIndex = EARTHLY_BRANCHES.indexOf(nobleBranch);
  const monthGeneralIndex = EARTHLY_BRANCHES.indexOf(monthGeneral);
  const tianmenIndex = EARTHLY_BRANCHES.indexOf(TIANMEN_BRANCH);
  const hourIndex = positiveMod(monthGeneralIndex + tianmenIndex - nobleIndex, EARTHLY_BRANCHES.length);

  return EARTHLY_BRANCHES[hourIndex];
}

function createGuiDengEntry({ type, label, hourBranch, date, usableRange, timezone }) {
  const hourRange = getChineseHourRange(date, hourBranch);
  const availableRange = intersectRanges(hourRange, usableRange);
  const isAvailable = availableRange !== null;

  return {
    type,
    label,
    hourBranch,
    hourRange,
    availableRange,
    isAvailable,
    rangeText: isAvailable ? formatRange(availableRange, timezone) : "",
  };
}

function getChineseHourRange(date, branch) {
  const startHour = HOUR_START_BY_BRANCH[branch];
  if (!Number.isInteger(startHour)) {
    return null;
  }

  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHour, 0, 0, 0);
  const end = new Date(start.getTime());
  end.setHours(end.getHours() + 2);

  return { start, end };
}

function intersectRanges(left, right) {
  if (!left || !right) {
    return null;
  }

  const startMs = Math.max(left.start.getTime(), right.start.getTime());
  const endMs = Math.min(left.end.getTime(), right.end.getTime());

  if (startMs >= endMs) {
    return null;
  }

  return {
    start: new Date(startMs),
    end: new Date(endMs),
  };
}

function formatRange(range, timezone) {
  const displayEnd = new Date(range.end.getTime() - 60_000);
  return `${formatTime(range.start, timezone)}–${formatTime(displayEnd, timezone)}`;
}

function formatTime(date, timezone) {
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

async function loadSunCalc() {
  if (!sunCalcPromise) {
    sunCalcPromise = typeof window === "undefined"
      ? import("suncalc").then((module) => module.default ?? module)
      : import("./vendor/suncalc.js").then(() => window.SunCalc);
  }

  const SunCalc = await sunCalcPromise;
  if (!SunCalc || typeof SunCalc.getTimes !== "function") {
    throw new Error("SunCalc 載入失敗，無法計算日出日落");
  }

  return SunCalc;
}

function normalizeDate(value) {
  if (value instanceof Date && Number.isFinite(value.getTime())) {
    return new Date(value.getTime());
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = new Date(value);
    return Number.isFinite(parsed.getTime()) ? parsed : null;
  }

  return null;
}

function addDays(date, dayOffset) {
  const next = new Date(date.getTime());
  next.setDate(next.getDate() + dayOffset);
  return next;
}

function normalizeBranchText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isKnownBranch(branch) {
  return EARTHLY_BRANCHES.includes(branch);
}

function positiveMod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}
