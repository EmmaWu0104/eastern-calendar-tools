import {
  findSolarTermContext,
  getMonthBranch,
  loadSolarTerms,
} from "./solarTerms.js";
import {
  getDailyInfoByBranches,
  isGengDay,
} from "./dailyInfo.js";
import {
  getDayPillar,
  getHourPillar,
  getMonthPillar,
  getYearPillar,
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
  "使用輸入的手錶時間／瀏覽器本機時間，不套用真太陽時。",
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
  const currentHou = getCurrentHouFromTermContext(termContext);
  const nextHou = getNextHouFromTermContext(termContext, solarTerms);
  const jianchu = getJianchuFromBranches(monthBranch.branch, dayPillar.pillar);
  const dailyInfo = getDailyInfoFromContext({
    termContext,
    solarTerms,
    yearPillar: yearPillar.pillar,
    dayPillar: dayPillar.pillar,
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

function getJianchuFromBranches(monthBranch, dayPillar) {
  const dayBranch = typeof dayPillar === "string" ? dayPillar[1] : "";
  return getJianchuByBranches(monthBranch, dayBranch);
}

function getDailyInfoFromContext({ termContext, solarTerms, yearPillar, dayPillar }) {
  const targetTimeMs = termContext?.dateTime?.timeMs;
  const dateKey = Number.isFinite(targetTimeMs) ? getEffectiveDateKeyByTimeMs(targetTimeMs) : "";
  const targetYear = getYearFromDateKey(dateKey);
  const nextTerm = termContext?.nextTerm;

  return getDailyInfoByBranches({
    yearBranch: typeof yearPillar === "string" ? yearPillar[1] : "",
    dayPillar,
    upcomingTermName: nextTerm?.name ?? "",
    isPreviousEffectiveDay:
      Number.isFinite(targetTimeMs) && Number.isFinite(nextTerm?.timeMs)
        ? isPreviousEffectiveDayOfTerm(targetTimeMs, nextTerm.timeMs)
        : false,
    season: getSeasonByCurrentTermName(termContext?.currentTerm?.name),
    dateKey,
    sanfuDateKeys: Number.isFinite(targetYear) ? getSanfuDateKeysForYear(targetYear, solarTerms) : null,
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

function isPreviousEffectiveDayOfTerm(targetTimeMs, upcomingTermTimeMs) {
  if (!Number.isFinite(targetTimeMs) || !Number.isFinite(upcomingTermTimeMs)) {
    return false;
  }

  const targetDateKey = getEffectiveDateKeyByTimeMs(targetTimeMs);
  const upcomingDateKey = getEffectiveDateKeyByTimeMs(upcomingTermTimeMs);
  const previousDateKey = addDaysToDateKey(upcomingDateKey, -1);

  return targetDateKey === previousDateKey;
}

function getSanfuDateKeysForYear(targetYear, solarTerms) {
  if (!Number.isInteger(targetYear) || !Array.isArray(solarTerms)) {
    return null;
  }

  const summerSolstice = findTermForYear(solarTerms, "夏至", targetYear);
  const liqiu = findTermForYear(solarTerms, "立秋", targetYear);
  if (!summerSolstice || !liqiu) {
    return null;
  }

  const summerSolsticeDateKey = getEffectiveDateKeyByTimeMs(summerSolstice.timeMs);
  const liqiuDateKey = getEffectiveDateKeyByTimeMs(liqiu.timeMs);
  const summerGengDays = findGengDateKeysFrom(summerSolsticeDateKey, 4);
  const liqiuGengDays = findGengDateKeysFrom(liqiuDateKey, 1);

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

function findGengDateKeysFrom(startDateKey, requiredCount) {
  const gengDateKeys = [];
  let currentDateKey = startDateKey;

  for (let offset = 0; offset < 80 && gengDateKeys.length < requiredCount; offset += 1) {
    const dayPillar = getDayPillar(`${currentDateKey}T00:00:00`).pillar;
    if (isGengDay(dayPillar)) {
      gengDateKeys.push(currentDateKey);
    }

    currentDateKey = addDaysToDateKey(currentDateKey, 1);
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

function addDaysToDateKey(dateKey, dayOffset) {
  const date = createLocalDateFromDateKey(dateKey);
  if (!date) {
    return "";
  }

  date.setDate(date.getDate() + dayOffset);
  return formatDateKey(date);
}

function getYearFromDateKey(dateKey) {
  const date = createLocalDateFromDateKey(dateKey);
  return date ? date.getFullYear() : NaN;
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
