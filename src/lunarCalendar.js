import lunarCalendarData from "../data/cwa_lunar_month_starts_2022_2050.json" with { type: "json" };

const MONTH_LABELS = Object.freeze([
  "正月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "冬月", "臘月",
]);
const DAY_LABELS = Object.freeze([
  null,
  "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
  "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
  "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十",
]);

function isGregorianLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function getDaysInGregorianMonth(year, month) {
  return [31, isGregorianLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

function assertSolarDate(year, month, day) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new TypeError("農曆查詢日期的 year、month、day 必須為整數");
  }
  if (year < 1 || year > 9999 || month < 1 || month > 12 || day < 1 || day > getDaysInGregorianMonth(year, month)) {
    throw new RangeError("農曆查詢日期不是有效的 Gregorian 日期");
  }
}

// Timezone-free proleptic-Gregorian day serial.  The helper accepts civil date
// components, never Date, so browser locale and UTC conversion cannot affect it.
function toSolarDayNumber(year, month, day) {
  const completedYears = year - 1;
  let days = completedYears * 365
    + Math.floor(completedYears / 4)
    - Math.floor(completedYears / 100)
    + Math.floor(completedYears / 400);
  for (let currentMonth = 1; currentMonth < month; currentMonth += 1) {
    days += getDaysInGregorianMonth(year, currentMonth);
  }
  return days + day;
}

function parseDataDate(date) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) throw new Error("CWA 農曆資料日期格式錯誤");
  return toSolarDayNumber(Number(match[1]), Number(match[2]), Number(match[3]));
}

const SUPPORTED_START = parseDataDate(lunarCalendarData.supportedRange.start);
const SUPPORTED_END = parseDataDate(lunarCalendarData.supportedRange.end);
const LEADING_START = parseDataDate(lunarCalendarData.leadingSegment.solarStart);
const TRAILING_START = parseDataDate(lunarCalendarData.trailingSegment.solarStart);
const MONTH_START_DAY_NUMBERS = Object.freeze(lunarCalendarData.monthStarts.map((month) => parseDataDate(month.solarStart)));

function makeResult(solarYear, solarMonth, solarDay, lunar) {
  return Object.freeze({
    solarYear,
    solarMonth,
    solarDay,
    lunarYear: lunar.lunarYear,
    lunarMonth: lunar.lunarMonth,
    lunarDay: lunar.lunarDay,
    isLeapMonth: lunar.isLeapMonth,
  });
}

function lookupSegment(segment, segmentStart, targetDayNumber) {
  const offset = targetDayNumber - segmentStart;
  if (offset < 0 || offset >= segment.daysAvailable) return null;
  return { ...segment, lunarDay: segment.lunarDay + offset };
}

function findMonthStartIndex(targetDayNumber) {
  let low = 0;
  let high = MONTH_START_DAY_NUMBERS.length - 1;
  let result = -1;
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (MONTH_START_DAY_NUMBERS[middle] <= targetDayNumber) {
      result = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return result;
}

/**
 * Returns the CWA civil lunar date for a Gregorian year/month/day, or null for
 * a valid date outside CWA A-A0087-001's published 2022-01-01…2050-12-31 range.
 */
export function getLunarDateForSolarDate(year, month, day) {
  assertSolarDate(year, month, day);
  const targetDayNumber = toSolarDayNumber(year, month, day);
  if (targetDayNumber < SUPPORTED_START || targetDayNumber > SUPPORTED_END) return null;

  const leading = lookupSegment(lunarCalendarData.leadingSegment, LEADING_START, targetDayNumber);
  if (leading) return makeResult(year, month, day, leading);
  const trailing = lookupSegment(lunarCalendarData.trailingSegment, TRAILING_START, targetDayNumber);
  if (trailing) return makeResult(year, month, day, trailing);

  const monthIndex = findMonthStartIndex(targetDayNumber);
  if (monthIndex < 0) throw new Error("CWA 農曆資料缺少月首");
  const monthStart = lunarCalendarData.monthStarts[monthIndex];
  const lunarDay = targetDayNumber - MONTH_START_DAY_NUMBERS[monthIndex] + 1;
  if (lunarDay < 1 || lunarDay > monthStart.monthLength) {
    throw new Error("CWA 農曆資料月長不一致");
  }
  return makeResult(year, month, day, { ...monthStart, lunarDay });
}

export function isLunarCalendarDateSupported(year, month, day) {
  assertSolarDate(year, month, day);
  const targetDayNumber = toSolarDayNumber(year, month, day);
  return targetDayNumber >= SUPPORTED_START && targetDayNumber <= SUPPORTED_END;
}

/** Formats a normalized lunar date as a concise Chinese month/day label. */
export function formatLunarCalendarLabel(lunarDate) {
  if (lunarDate == null) return "";
  if (typeof lunarDate !== "object") throw new TypeError("農曆日期必須是物件或 null");
  const { lunarMonth, lunarDay, isLeapMonth } = lunarDate;
  if (!Number.isInteger(lunarMonth) || lunarMonth < 1 || lunarMonth > 12) {
    throw new RangeError("農曆月份必須為 1 至 12 的整數");
  }
  if (!Number.isInteger(lunarDay) || lunarDay < 1 || lunarDay > 30) {
    throw new RangeError("農曆日期必須為 1 至 30 的整數");
  }
  if (typeof isLeapMonth !== "boolean") throw new TypeError("isLeapMonth 必須為 boolean");
  if (lunarDay === 1) return `${isLeapMonth ? "閏" : ""}${MONTH_LABELS[lunarMonth - 1]}`;
  return DAY_LABELS[lunarDay];
}

/** Formats a lunar date for an accessible label, including both month and day. */
export function formatLunarCalendarAccessibleLabel(lunarDate) {
  if (lunarDate == null) return "";
  formatLunarCalendarLabel(lunarDate);
  const { lunarMonth, lunarDay, isLeapMonth } = lunarDate;
  const monthLabel = `${isLeapMonth ? "閏" : ""}${MONTH_LABELS[lunarMonth - 1]}`;
  return `${monthLabel}${DAY_LABELS[lunarDay]}`;
}
