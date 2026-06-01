import {
  findSolarTermContext,
  getMonthBranch,
  loadSolarTerms,
} from "./solarTerms.js";
import {
  getDayPillar,
  getHourPillar,
  getMonthPillar,
  getYearPillar,
} from "./ganzhi.js";
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
    ruleNotes: [...RULE_NOTES],
    meta: {
      dateTime: termContext.dateTime,
      ganzhiYear: yearPillar.ganzhiYear,
      effectiveDayDate: dayPillar.effectiveDate,
      monthSwitchTerm: monthBranch.term,
    },
  };
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
