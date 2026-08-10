import {
  findSolarTermContext,
  findSolarTermContextByTimeMs,
  getMonthBranch,
  loadSolarTerms,
} from "./solarTerms.js";
import {
  getDailyInfoByBranches,
  isGengDay,
} from "./dailyInfo.js";
import {
  getDayPillar,
  getDayPillarFromLocalParts,
  getHourPillar,
  getHourPillarFromLocalParts,
  getMonthPillar,
  getMonthPillarFromInstantMs,
  getYearPillar,
  getYearPillarFromInstantMs,
} from "./ganzhi.js";
import { getJianchuByBranches } from "./jianchu.js";
import {
  getCurrentHouBySolarTermRange,
  getNextHouBySolarTermRange,
} from "./seventyTwoHou.js";

export const RULE_NOTES = Object.freeze([
  "年柱以立春切換。",
  "月柱以 12 個「節」切換月令，不以中氣切月。",
  "第一版採用 23:00 起換日。",
  "預設使用輸入的手錶時間；可由介面手動套用真太陽時。",
  "日柱基準日採 2000-01-01 戊午日，後續需再交叉驗證。",
]);

export async function calculateBazi(dateTimeString) {
  const solarTerms = await loadSolarTerms();
  return calculateBaziFromSolarTerms(dateTimeString, solarTerms);
}

export function calculateBaziFromSolarTerms(dateTimeString, solarTerms) {
  const termContext = findSolarTermContext(dateTimeString, solarTerms);
  const monthBranch = getMonthBranch(dateTimeString, solarTerms);
  const yearPillar = getYearPillar(dateTimeString, solarTerms);
  const monthPillar = getMonthPillar(dateTimeString, solarTerms);
  const dayPillar = getDayPillar(dateTimeString);
  const hourPillar = getHourPillar(dateTimeString);
  return calculateBaziFromResolvedInputs({
    termContext,
    monthBranch,
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    solarTerms,
  });
}

/**
 * Pure separated-time core used by the ChartTimeContext adapter.  The term
 * comparison instant and local clock components intentionally have distinct
 * inputs: true solar local parts must never be treated as an instant.
 */
export function calculateBaziFromSeparatedTimeInputs({
  termComparisonInstantMs,
  termLookupYear,
  clockLocalParts,
  effectiveDayDateKey,
  solarTerms,
} = {}) {
  if (!Number.isFinite(termComparisonInstantMs)) {
    throw new TypeError("termComparisonInstantMs 必須是有限數字");
  }
  if (!Number.isInteger(termLookupYear)) {
    throw new TypeError("termLookupYear 必須是整數");
  }
  const derivedEffectiveDayDateKey = getEffectiveDateKeyFromLocalParts(clockLocalParts);
  if (!derivedEffectiveDayDateKey) {
    throw new TypeError("clockLocalParts 必須是完整有效的 local parts");
  }
  if (effectiveDayDateKey !== undefined && effectiveDayDateKey !== derivedEffectiveDayDateKey) {
    throw new TypeError("effectiveDayDateKey 必須符合 clockLocalParts 的 23:00 換日規則");
  }
  const resolvedEffectiveDayDateKey = effectiveDayDateKey ?? derivedEffectiveDayDateKey;
  const termContext = findSolarTermContextByTimeMs(termComparisonInstantMs, solarTerms, {
    ...clockLocalParts,
    timeMs: termComparisonInstantMs,
    input: formatLocalDateTime(clockLocalParts),
  });
  const monthBranch = getMonthPillarFromInstantMs(termComparisonInstantMs, termLookupYear, solarTerms);
  const yearPillar = getYearPillarFromInstantMs(termComparisonInstantMs, termLookupYear, solarTerms);
  const dayPillar = getDayPillarFromLocalParts(clockLocalParts);
  const hourPillar = getHourPillarFromLocalParts(clockLocalParts);
  return calculateBaziFromResolvedInputs({
    termContext,
    monthBranch: { branch: monthBranch.branch, term: monthBranch.switchTerm },
    yearPillar,
    monthPillar: monthBranch,
    dayPillar,
    hourPillar,
    solarTerms,
    dailyInfoDateKey: resolvedEffectiveDayDateKey,
  });
}

function calculateBaziFromResolvedInputs({
  termContext,
  monthBranch,
  yearPillar,
  monthPillar,
  dayPillar,
  hourPillar,
  solarTerms,
  dailyInfoDateKey,
}) {
  const currentHou = getCurrentHouFromTermContext(termContext);
  const nextHou = getNextHouFromTermContext(termContext, solarTerms);
  const jianchu = getJianchuFromBranches(monthBranch.branch, dayPillar.pillar);
  const dailyInfo = getDailyInfoFromContext({
    termContext,
    solarTerms,
    yearPillar: yearPillar.pillar,
    dayPillar: dayPillar.pillar,
    dateKeyOverride: dailyInfoDateKey,
    seasonOverride: dailyInfoDateKey !== undefined
      ? getSeasonByMonthBranch(monthBranch.branch)
      : undefined,
  });

  return {
    yearPillar: yearPillar.pillar,
    monthPillar: monthPillar.pillar,
    dayPillar: dayPillar.pillar,
    hourPillar: hourPillar.pillar,
    currentTerm: termContext.currentTerm,
    previousTerm: termContext.previousTerm,
    nextTerm: termContext.nextTerm,
    currentHou,
    nextHou,
    monthBranch: monthBranch.branch,
    jianchu,
    dailyInfo,
    ruleNotes: [...RULE_NOTES],
    meta: {
      dateTime: termContext.dateTime,
      ganzhiYear: yearPillar.ganzhiYear,
      effectiveDayDate: dayPillar.effectiveDate,
      monthSwitchTerm: monthBranch.term,
    },
  };
}

function formatLocalDateTime(parts) {
  if (!parts || typeof parts !== "object") return "";
  const date = `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
  const time = `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}`;
  return parts.millisecond ? `${date}T${time}.${String(parts.millisecond).padStart(3, "0")}` : `${date}T${time}`;
}

function getJianchuFromBranches(monthBranch, dayPillar) {
  const dayBranch = typeof dayPillar === "string" ? dayPillar[1] : "";
  return getJianchuByBranches(monthBranch, dayBranch);
}

function getDailyInfoFromContext({ termContext, solarTerms, yearPillar, dayPillar, dateKeyOverride, seasonOverride }) {
  const targetTimeMs = termContext?.dateTime?.timeMs;
  const hasExplicitDateKey = typeof dateKeyOverride === "string";
  const dateKey = hasExplicitDateKey
    ? dateKeyOverride
    : Number.isFinite(targetTimeMs) ? getEffectiveDateKeyByTimeMs(targetTimeMs) : "";
  const targetYear = getYearFromDateKey(dateKey);
  const nextTerm = termContext?.nextTerm;
  const upcomingTermDateKey = hasExplicitDateKey
    ? getTaipeiEffectiveDateKeyByTimeMs(nextTerm?.timeMs)
    : "";

  return getDailyInfoByBranches({
    yearBranch: typeof yearPillar === "string" ? yearPillar[1] : "",
    dayPillar,
    upcomingTermName: nextTerm?.name ?? "",
    isPreviousEffectiveDay: hasExplicitDateKey
      ? isPreviousEffectiveDayByDateKeys(dateKey, upcomingTermDateKey)
      : Number.isFinite(targetTimeMs) && Number.isFinite(nextTerm?.timeMs)
        ? isPreviousEffectiveDayOfTerm(targetTimeMs, nextTerm.timeMs)
        : false,
    season: seasonOverride ?? getSeasonByCurrentTermName(termContext?.currentTerm?.name),
    dateKey,
    sanfuDateKeys: Number.isFinite(targetYear)
      ? getSanfuDateKeysForYear(targetYear, solarTerms, { useTaipeiDateBasis: hasExplicitDateKey })
      : null,
  });
}

function getCurrentHouFromTermContext(termContext) {
  const currentTerm = termContext?.currentTerm;
  const nextTerm = termContext?.nextTerm;
  const targetTimeMs = termContext?.dateTime?.timeMs;

  if (!currentTerm || !nextTerm || !Number.isFinite(targetTimeMs)) {
    return null;
  }

  return getCurrentHouBySolarTermRange(
    currentTerm.name,
    currentTerm.timeMs,
    nextTerm.timeMs,
    targetTimeMs
  );
}

function getNextHouFromTermContext(termContext, solarTerms) {
  const currentTerm = termContext?.currentTerm;
  const nextTerm = termContext?.nextTerm;
  const afterNextTerm = findAfterNextTerm(termContext, solarTerms);
  const targetTimeMs = termContext?.dateTime?.timeMs;

  if (!currentTerm || !nextTerm || !afterNextTerm || !Number.isFinite(targetTimeMs)) {
    return null;
  }

  return getNextHouBySolarTermRange(
    currentTerm.name,
    currentTerm.timeMs,
    nextTerm.name,
    nextTerm.timeMs,
    afterNextTerm.timeMs,
    targetTimeMs
  );
}

function findAfterNextTerm(termContext, solarTerms) {
  const nextTerm = termContext?.nextTerm;
  if (!nextTerm || !Array.isArray(solarTerms)) {
    return null;
  }

  const terms = solarTerms
    .map((term) => ({
      ...term,
      timeMs: getTermTimeMs(term),
    }))
    .filter((term) => Number.isFinite(term.timeMs))
    .sort((a, b) => a.timeMs - b.timeMs);
  const nextIndex = terms.findIndex(
    (term) => term.name === nextTerm.name && term.timeMs === nextTerm.timeMs
  );

  return nextIndex >= 0 && nextIndex + 1 < terms.length ? terms[nextIndex + 1] : null;
}

function getTermTimeMs(term) {
  if (Number.isFinite(term?.timeMs)) {
    return term.timeMs;
  }

  return typeof term?.asia_taipei === "string" ? Date.parse(term.asia_taipei) : NaN;
}

const SEASON_TERMS = Object.freeze({
  "春季": Object.freeze(["立春", "雨水", "驚蟄", "春分", "清明", "穀雨"]),
  "夏季": Object.freeze(["立夏", "小滿", "芒種", "夏至", "小暑", "大暑"]),
  "秋季": Object.freeze(["立秋", "處暑", "白露", "秋分", "寒露", "霜降"]),
  "冬季": Object.freeze(["立冬", "小雪", "大雪", "冬至", "小寒", "大寒"]),
});

function getSeasonByCurrentTermName(currentTermName) {
  if (typeof currentTermName !== "string") {
    return null;
  }

  for (const [season, terms] of Object.entries(SEASON_TERMS)) {
    if (terms.includes(currentTermName)) {
      return season;
    }
  }

  return null;
}

function getSeasonByMonthBranch(monthBranch) {
  if (["寅", "卯", "辰"].includes(monthBranch)) return "春季";
  if (["巳", "午", "未"].includes(monthBranch)) return "夏季";
  if (["申", "酉", "戌"].includes(monthBranch)) return "秋季";
  if (["亥", "子", "丑"].includes(monthBranch)) return "冬季";
  return null;
}

function isPreviousEffectiveDayOfTerm(targetTimeMs, upcomingTermTimeMs) {
  if (!Number.isFinite(targetTimeMs) || !Number.isFinite(upcomingTermTimeMs)) {
    return false;
  }

  const targetDateKey = getEffectiveDateKeyByTimeMs(targetTimeMs);
  const upcomingDateKey = getEffectiveDateKeyByTimeMs(upcomingTermTimeMs);
  const previousDateKey = addDaysToDateKey(upcomingDateKey, -1);

  return targetDateKey === previousDateKey;
}

function isPreviousEffectiveDayByDateKeys(targetDateKey, upcomingTermDateKey) {
  if (!isDateKey(targetDateKey) || !isDateKey(upcomingTermDateKey)) {
    return false;
  }

  return targetDateKey === addDaysToDateKeyUtc(upcomingTermDateKey, -1);
}

function getSanfuDateKeysForYear(targetYear, solarTerms, options = {}) {
  if (!Number.isInteger(targetYear) || !Array.isArray(solarTerms)) {
    return null;
  }

  const summerSolstice = findTermForYear(solarTerms, "夏至", targetYear);
  const liqiu = findTermForYear(solarTerms, "立秋", targetYear);
  if (!summerSolstice || !liqiu) {
    return null;
  }

  const dateKeyFromTerm = options.useTaipeiDateBasis
    ? getTaipeiEffectiveDateKeyByTimeMs
    : getEffectiveDateKeyByTimeMs;
  const summerSolsticeDateKey = dateKeyFromTerm(summerSolstice.timeMs);
  const liqiuDateKey = dateKeyFromTerm(liqiu.timeMs);
  const summerGengDays = findGengDateKeysFrom(summerSolsticeDateKey, 4, options);
  const liqiuGengDays = findGengDateKeysFrom(liqiuDateKey, 1, options);

  if (summerGengDays.length < 4 || liqiuGengDays.length < 1) {
    return null;
  }

  const sanfuDateKeys = {
    "初伏": summerGengDays[2],
    "中伏": summerGengDays[3],
    "末伏": liqiuGengDays[0],
  };

  if (sanfuDateKeys["中伏"] === sanfuDateKeys["末伏"]) {
    // 本工具第一版採用「提前十日補一伏」：中伏與末伏同日時，中伏取末伏前 10 日。
    // 後續若要對照通勝，需另開校驗資料與案例。
    sanfuDateKeys["中伏"] = addDaysToDateKey(sanfuDateKeys["末伏"], -10);
  }

  return sanfuDateKeys;
}

function findTermForYear(solarTerms, termName, termYear) {
  return solarTerms
    .map((term) => ({
      ...term,
      timeMs: getTermTimeMs(term),
    }))
    .find(
      (term) =>
        term.name === termName &&
        term.year_taipei === termYear &&
        Number.isFinite(term.timeMs)
    );
}

function findGengDateKeysFrom(startDateKey, requiredCount, options = {}) {
  const gengDateKeys = [];
  let currentDateKey = startDateKey;

  for (let offset = 0; offset < 80 && gengDateKeys.length < requiredCount; offset += 1) {
    const dayPillar = getDayPillarFromLocalParts({
      year: Number(currentDateKey.slice(0, 4)),
      month: Number(currentDateKey.slice(5, 7)),
      day: Number(currentDateKey.slice(8, 10)),
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    }).pillar;
    if (isGengDay(dayPillar)) {
      gengDateKeys.push(currentDateKey);
    }

    currentDateKey = options.useTaipeiDateBasis
      ? addDaysToDateKeyUtc(currentDateKey, 1)
      : addDaysToDateKey(currentDateKey, 1);
  }

  return gengDateKeys;
}

function getEffectiveDateKeyByTimeMs(timeMs) {
  const date = new Date(timeMs);
  if (date.getHours() >= 23) {
    date.setDate(date.getDate() + 1);
  }

  return formatDateKey(date);
}

function getTaipeiEffectiveDateKeyByTimeMs(timeMs) {
  if (!Number.isFinite(timeMs)) {
    return "";
  }

  const date = new Date(timeMs + 8 * 60 * 60 * 1000);
  const localParts = {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
    millisecond: date.getUTCMilliseconds(),
  };
  return getEffectiveDateKeyFromLocalParts(localParts);
}

/** Returns the 23:00-effective date for a wall-clock component snapshot. */
export function getEffectiveDateKeyFromLocalParts(parts) {
  if (!isCompleteLocalParts(parts)) {
    return "";
  }

  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
  if (parts.hour >= 23) {
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return formatUtcDateKey(date);
}

function addDaysToDateKey(dateKey, dayOffset) {
  const date = createLocalDateFromDateKey(dateKey);
  if (!date) {
    return "";
  }

  date.setDate(date.getDate() + dayOffset);
  return formatDateKey(date);
}

function addDaysToDateKeyUtc(dateKey, dayOffset) {
  if (!isDateKey(dateKey) || !Number.isInteger(dayOffset)) {
    return "";
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + dayOffset);
  return formatUtcDateKey(date);
}

function getYearFromDateKey(dateKey) {
  return isDateKey(dateKey) ? Number(dateKey.slice(0, 4)) : NaN;
}

function isDateKey(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isCompleteLocalParts(parts) {
  if (!parts || typeof parts !== "object" || parts instanceof Date) {
    return false;
  }

  const names = ["year", "month", "day", "hour", "minute", "second", "millisecond"];
  if (!names.every((name) => Number.isInteger(parts[name]))) {
    return false;
  }

  const date = new Date(Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond
  ));
  return date.getUTCFullYear() === parts.year
    && date.getUTCMonth() === parts.month - 1
    && date.getUTCDate() === parts.day
    && date.getUTCHours() === parts.hour
    && date.getUTCMinutes() === parts.minute
    && date.getUTCSeconds() === parts.second
    && date.getUTCMilliseconds() === parts.millisecond;
}

function createLocalDateFromDateKey(dateKey) {
  if (typeof dateKey !== "string") {
    return null;
  }

  const match = dateKey.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function formatDateKey(date) {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatUtcDateKey(date) {
  const year = String(date.getUTCFullYear()).padStart(4, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
