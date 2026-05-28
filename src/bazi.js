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

  return {
    yearPillar: yearPillar.pillar,
    monthPillar: monthPillar.pillar,
    dayPillar: dayPillar.pillar,
    hourPillar: hourPillar.pillar,
    currentTerm: termContext.currentTerm,
    previousTerm: termContext.previousTerm,
    nextTerm: termContext.nextTerm,
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
