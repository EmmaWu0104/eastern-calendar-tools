import {
  findTermByNameAndYear,
  getMonthBranch,
  parseLocalDateTime,
} from "./solarTerms.js";

export const HEAVENLY_STEMS = Object.freeze(["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]);
export const EARTHLY_BRANCHES = Object.freeze(["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]);

export const SEXAGENARY_CYCLE = Object.freeze(
  Array.from({ length: 60 }, (_, index) => {
    return `${HEAVENLY_STEMS[index % 10]}${EARTHLY_BRANCHES[index % 12]}`;
  })
);

export const MONTH_BRANCHES = Object.freeze(["寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥", "子", "丑"]);
export const DAY_PILLAR_BASE = Object.freeze({
  date: "2000-01-01",
  pillar: "戊午",
  cycleIndex: SEXAGENARY_CYCLE.indexOf("戊午"),
  note: "第一版採用 2000-01-01 為戊午日，後續需以權威萬年曆交叉驗證。",
});

const DAY_MS = 24 * 60 * 60 * 1000;

export function getYearPillar(dateTimeString, solarTerms) {
  const dateTime = parseLocalDateTime(dateTimeString);
  const lichun = findTermByNameAndYear(solarTerms, "立春", dateTime.year);

  if (!lichun) {
    throw new RangeError(`找不到 ${dateTime.year} 年立春資料，無法判斷年柱`);
  }

  const ganzhiYear = dateTime.timeMs >= lichun.timeMs ? dateTime.year : dateTime.year - 1;
  const cycleIndex = positiveMod(ganzhiYear - 1984, 60);

  return {
    pillar: SEXAGENARY_CYCLE[cycleIndex],
    ganzhiYear,
    cycleIndex,
    switchTerm: lichun,
  };
}

export function getMonthPillar(dateTimeString, solarTerms) {
  const yearPillar = getYearPillar(dateTimeString, solarTerms);
  const monthBranch = getMonthBranch(dateTimeString, solarTerms);
  const monthIndex = MONTH_BRANCHES.indexOf(monthBranch.branch);

  if (monthIndex < 0) {
    throw new Error(`未知月令地支：${monthBranch.branch}`);
  }

  const yearStemIndex = HEAVENLY_STEMS.indexOf(yearPillar.pillar[0]);
  const firstMonthStemIndex = ((yearStemIndex % 5) * 2 + 2) % 10;
  const monthStemIndex = (firstMonthStemIndex + monthIndex) % 10;

  return {
    pillar: `${HEAVENLY_STEMS[monthStemIndex]}${monthBranch.branch}`,
    branch: monthBranch.branch,
    switchTerm: monthBranch.term,
    yearPillar: yearPillar.pillar,
  };
}

export function getDayPillar(dateTimeString) {
  const dateTime = parseLocalDateTime(dateTimeString);
  const effectiveCivilDateMs = civilDateToEpochMs(dateTime.year, dateTime.month, dateTime.day);
  const dayStartAdjustedCivilDateMs =
    dateTime.hour >= 23 ? effectiveCivilDateMs + DAY_MS : effectiveCivilDateMs;
  const baseCivilDateMs = civilDateToEpochMs(2000, 1, 1);
  const daysFromBase = Math.round((dayStartAdjustedCivilDateMs - baseCivilDateMs) / DAY_MS);
  const cycleIndex = positiveMod(DAY_PILLAR_BASE.cycleIndex + daysFromBase, 60);

  return {
    pillar: SEXAGENARY_CYCLE[cycleIndex],
    cycleIndex,
    effectiveDate: formatCivilDate(dayStartAdjustedCivilDateMs),
    base: DAY_PILLAR_BASE,
  };
}

export function getHourPillar(dateTimeString) {
  const dateTime = parseLocalDateTime(dateTimeString);
  const dayPillar = getDayPillar(dateTimeString);
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayPillar.pillar[0]);
  const hourBranchIndex = getHourBranchIndex(dateTime.hour);
  const firstHourStemIndex = ((dayStemIndex % 5) * 2) % 10;
  const hourStemIndex = (firstHourStemIndex + hourBranchIndex) % 10;

  return {
    pillar: `${HEAVENLY_STEMS[hourStemIndex]}${EARTHLY_BRANCHES[hourBranchIndex]}`,
    branch: EARTHLY_BRANCHES[hourBranchIndex],
    dayPillar: dayPillar.pillar,
  };
}

export function getHourBranchIndex(hour) {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new RangeError("小時需為 0 到 23 的整數");
  }

  if (hour === 23 || hour === 0) {
    return 0;
  }

  return Math.floor((hour + 1) / 2);
}

function positiveMod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function civilDateToEpochMs(year, month, day) {
  return Date.UTC(year, month - 1, day);
}

function formatCivilDate(civilDateMs) {
  const date = new Date(civilDateMs);
  const year = String(date.getUTCFullYear()).padStart(4, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
