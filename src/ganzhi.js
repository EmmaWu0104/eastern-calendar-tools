import {
  findTermByNameAndYear,
  getMonthBranchByTimeMs,
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
  return getYearPillarFromInstantMs(dateTime.timeMs, dateTime.year, solarTerms);
}

/**
 * Calculates the year pillar using an astronomical instant and an explicit
 * civil year for the 立春 lookup.  No host-local timezone conversion occurs.
 */
export function getYearPillarFromInstantMs(comparisonInstantMs, civilYear, solarTerms) {
  if (!Number.isFinite(comparisonInstantMs)) {
    throw new TypeError("年柱比較時間必須是有限 epoch milliseconds");
  }
  if (!Number.isInteger(civilYear)) {
    throw new TypeError("年柱立春索引年必須是整數");
  }
  const lichun = findTermByNameAndYear(solarTerms, "立春", civilYear);

  if (!lichun) {
    throw new RangeError(`找不到 ${civilYear} 年立春資料，無法判斷年柱`);
  }

  const ganzhiYear = comparisonInstantMs >= lichun.timeMs ? civilYear : civilYear - 1;
  const cycleIndex = positiveMod(ganzhiYear - 1984, 60);

  return {
    pillar: SEXAGENARY_CYCLE[cycleIndex],
    ganzhiYear,
    cycleIndex,
    switchTerm: lichun,
  };
}

export function getMonthPillar(dateTimeString, solarTerms) {
  const dateTime = parseLocalDateTime(dateTimeString);
  return getMonthPillarFromInstantMs(dateTime.timeMs, dateTime.year, solarTerms);
}

export function getMonthPillarFromInstantMs(comparisonInstantMs, civilYear, solarTerms) {
  const yearPillar = getYearPillarFromInstantMs(comparisonInstantMs, civilYear, solarTerms);
  const monthBranch = getMonthBranchByTimeMs(comparisonInstantMs, solarTerms);
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
  return getDayPillarFromLocalParts(dateTime);
}

/** Calculates the day pillar from plain wall-clock components. */
export function getDayPillarFromLocalParts(localParts) {
  assertLocalParts(localParts);
  const effectiveCivilDateMs = civilDateToEpochMs(localParts.year, localParts.month, localParts.day);
  const dayStartAdjustedCivilDateMs =
    localParts.hour >= 23 ? effectiveCivilDateMs + DAY_MS : effectiveCivilDateMs;
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
  return getHourPillarFromLocalParts(dateTime);
}

/** Calculates the hour pillar from the same plain wall-clock components. */
export function getHourPillarFromLocalParts(localParts) {
  assertLocalParts(localParts);
  const dayPillar = getDayPillarFromLocalParts(localParts);
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayPillar.pillar[0]);
  const hourBranchIndex = getHourBranchIndex(localParts.hour);
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

function assertLocalParts(parts) {
  if (!parts || typeof parts !== "object" || ["year", "month", "day", "hour", "minute", "second", "millisecond"].some((name) => !Number.isInteger(parts[name]))) {
    throw new TypeError("日／時柱需要完整有效的 local parts");
  }
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second, parts.millisecond));
  if (date.getUTCFullYear() !== parts.year || date.getUTCMonth() !== parts.month - 1 || date.getUTCDate() !== parts.day || date.getUTCHours() !== parts.hour || date.getUTCMinutes() !== parts.minute || date.getUTCSeconds() !== parts.second || date.getUTCMilliseconds() !== parts.millisecond) {
    throw new RangeError("日／時柱 local parts 無效");
  }
}
