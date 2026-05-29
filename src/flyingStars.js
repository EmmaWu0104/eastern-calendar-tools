import { SEXAGENARY_CYCLE } from "./ganzhi.js";

export const PALACES = Object.freeze({
  xun: Object.freeze({ id: "xun", name: "巽", number: 4, position: "southeast" }),
  li: Object.freeze({ id: "li", name: "離", number: 9, position: "south" }),
  kun: Object.freeze({ id: "kun", name: "坤", number: 2, position: "southwest" }),
  zhen: Object.freeze({ id: "zhen", name: "震", number: 3, position: "east" }),
  center: Object.freeze({ id: "center", name: "中", number: 5, position: "center" }),
  dui: Object.freeze({ id: "dui", name: "兌", number: 7, position: "west" }),
  gen: Object.freeze({ id: "gen", name: "艮", number: 8, position: "northeast" }),
  kan: Object.freeze({ id: "kan", name: "坎", number: 1, position: "north" }),
  qian: Object.freeze({ id: "qian", name: "乾", number: 6, position: "northwest" }),
});

export const PALACE_LAYOUT = Object.freeze([
  Object.freeze(["xun", "li", "kun"]),
  Object.freeze(["zhen", "center", "dui"]),
  Object.freeze(["gen", "kan", "qian"]),
]);

export const FLYING_DIRECTIONS = Object.freeze({
  forward: Object.freeze(["center", "qian", "dui", "gen", "li", "kan", "kun", "zhen", "xun"]),
  reverse: Object.freeze(["center", "xun", "zhen", "kun", "kan", "li", "gen", "dui", "qian"]),
});

export const STAR_NAMES = Object.freeze({
  1: "一白貪狼",
  2: "二黑巨門",
  3: "三碧祿存",
  4: "四綠文曲",
  5: "五黃廉貞",
  6: "六白武曲",
  7: "七赤破軍",
  8: "八白左輔",
  9: "九紫右弼",
});

const WINTER_FORWARD_TERMS = new Set(["冬至", "小寒", "大寒", "立春", "雨水", "驚蟄", "春分", "清明", "穀雨", "立夏", "小滿", "芒種"]);
const SUMMER_REVERSE_TERMS = new Set(["夏至", "小暑", "大暑", "立秋", "處暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪"]);

const MONTH_CENTER_TABLE = Object.freeze({
  "子午卯酉": Object.freeze({ 寅: 8, 卯: 7, 辰: 6, 巳: 5, 午: 4, 未: 3, 申: 2, 酉: 1, 戌: 9, 亥: 8, 子: 7, 丑: 6 }),
  "辰戌丑未": Object.freeze({ 寅: 5, 卯: 4, 辰: 3, 巳: 2, 午: 1, 未: 9, 申: 8, 酉: 7, 戌: 6, 亥: 5, 子: 4, 丑: 3 }),
  "寅申巳亥": Object.freeze({ 寅: 2, 卯: 1, 辰: 9, 巳: 8, 午: 7, 未: 6, 申: 5, 酉: 4, 戌: 3, 亥: 2, 子: 1, 丑: 9 }),
});

const DAY_CENTER_SYSTEMS = Object.freeze({
  "冬至順": Object.freeze({ terms: Object.freeze(["冬至", "小寒", "大寒", "立春"]), direction: "forward", centers: Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9]) }),
  "雨水順": Object.freeze({ terms: Object.freeze(["雨水", "驚蟄", "春分", "清明"]), direction: "forward", centers: Object.freeze([7, 8, 9, 1, 2, 3, 4, 5, 6]) }),
  "穀雨順": Object.freeze({ terms: Object.freeze(["穀雨", "立夏", "小滿", "芒種"]), direction: "forward", centers: Object.freeze([4, 5, 6, 7, 8, 9, 1, 2, 3]) }),
  "夏至逆": Object.freeze({ terms: Object.freeze(["夏至", "小暑", "大暑", "立秋"]), direction: "reverse", centers: Object.freeze([9, 8, 7, 6, 5, 4, 3, 2, 1]) }),
  "處暑逆": Object.freeze({ terms: Object.freeze(["處暑", "白露", "秋分", "寒露"]), direction: "reverse", centers: Object.freeze([3, 2, 1, 9, 8, 7, 6, 5, 4]) }),
  "霜降逆": Object.freeze({ terms: Object.freeze(["霜降", "立冬", "小雪", "大雪"]), direction: "reverse", centers: Object.freeze([6, 5, 4, 3, 2, 1, 9, 8, 7]) }),
});

export const HOURLY_STAR_TABLES = Object.freeze({
  winterForward: Object.freeze({
    子: Object.freeze({ 子: 1, 丑: 2, 寅: 3, 卯: 4, 辰: 5, 巳: 6, 午: 7, 未: 8, 申: 9, 酉: 1, 戌: 2, 亥: 3 }),
    午: Object.freeze({ 子: 1, 丑: 2, 寅: 3, 卯: 4, 辰: 5, 巳: 6, 午: 7, 未: 8, 申: 9, 酉: 1, 戌: 2, 亥: 3 }),
    卯: Object.freeze({ 子: 1, 丑: 2, 寅: 3, 卯: 4, 辰: 5, 巳: 6, 午: 7, 未: 8, 申: 9, 酉: 1, 戌: 2, 亥: 3 }),
    酉: Object.freeze({ 子: 1, 丑: 2, 寅: 3, 卯: 4, 辰: 5, 巳: 6, 午: 7, 未: 8, 申: 9, 酉: 1, 戌: 2, 亥: 3 }),
    辰: Object.freeze({ 子: 4, 丑: 5, 寅: 6, 卯: 7, 辰: 8, 巳: 9, 午: 1, 未: 2, 申: 3, 酉: 4, 戌: 5, 亥: 6 }),
    戌: Object.freeze({ 子: 4, 丑: 5, 寅: 6, 卯: 7, 辰: 8, 巳: 9, 午: 1, 未: 2, 申: 3, 酉: 4, 戌: 5, 亥: 6 }),
    丑: Object.freeze({ 子: 4, 丑: 5, 寅: 6, 卯: 7, 辰: 8, 巳: 9, 午: 1, 未: 2, 申: 3, 酉: 4, 戌: 5, 亥: 6 }),
    未: Object.freeze({ 子: 4, 丑: 5, 寅: 6, 卯: 7, 辰: 8, 巳: 9, 午: 1, 未: 2, 申: 3, 酉: 4, 戌: 5, 亥: 6 }),
    寅: Object.freeze({ 子: 7, 丑: 8, 寅: 9, 卯: 1, 辰: 2, 巳: 3, 午: 4, 未: 5, 申: 6, 酉: 7, 戌: 8, 亥: 9 }),
    申: Object.freeze({ 子: 7, 丑: 8, 寅: 9, 卯: 1, 辰: 2, 巳: 3, 午: 4, 未: 5, 申: 6, 酉: 7, 戌: 8, 亥: 9 }),
    巳: Object.freeze({ 子: 7, 丑: 8, 寅: 9, 卯: 1, 辰: 2, 巳: 3, 午: 4, 未: 5, 申: 6, 酉: 7, 戌: 8, 亥: 9 }),
    亥: Object.freeze({ 子: 7, 丑: 8, 寅: 9, 卯: 1, 辰: 2, 巳: 3, 午: 4, 未: 5, 申: 6, 酉: 7, 戌: 8, 亥: 9 }),
  }),
  summerReverse: Object.freeze({
    子: Object.freeze({ 子: 9, 丑: 8, 寅: 7, 卯: 6, 辰: 5, 巳: 4, 午: 3, 未: 2, 申: 1, 酉: 9, 戌: 8, 亥: 7 }),
    午: Object.freeze({ 子: 9, 丑: 8, 寅: 7, 卯: 6, 辰: 5, 巳: 4, 午: 3, 未: 2, 申: 1, 酉: 9, 戌: 8, 亥: 7 }),
    卯: Object.freeze({ 子: 9, 丑: 8, 寅: 7, 卯: 6, 辰: 5, 巳: 4, 午: 3, 未: 2, 申: 1, 酉: 9, 戌: 8, 亥: 7 }),
    酉: Object.freeze({ 子: 9, 丑: 8, 寅: 7, 卯: 6, 辰: 5, 巳: 4, 午: 3, 未: 2, 申: 1, 酉: 9, 戌: 8, 亥: 7 }),
    辰: Object.freeze({ 子: 6, 丑: 5, 寅: 4, 卯: 3, 辰: 2, 巳: 1, 午: 9, 未: 8, 申: 7, 酉: 6, 戌: 5, 亥: 4 }),
    戌: Object.freeze({ 子: 6, 丑: 5, 寅: 4, 卯: 3, 辰: 2, 巳: 1, 午: 9, 未: 8, 申: 7, 酉: 6, 戌: 5, 亥: 4 }),
    丑: Object.freeze({ 子: 6, 丑: 5, 寅: 4, 卯: 3, 辰: 2, 巳: 1, 午: 9, 未: 8, 申: 7, 酉: 6, 戌: 5, 亥: 4 }),
    未: Object.freeze({ 子: 6, 丑: 5, 寅: 4, 卯: 3, 辰: 2, 巳: 1, 午: 9, 未: 8, 申: 7, 酉: 6, 戌: 5, 亥: 4 }),
    寅: Object.freeze({ 子: 3, 丑: 2, 寅: 1, 卯: 9, 辰: 8, 巳: 7, 午: 6, 未: 5, 申: 4, 酉: 3, 戌: 2, 亥: 1 }),
    申: Object.freeze({ 子: 3, 丑: 2, 寅: 1, 卯: 9, 辰: 8, 巳: 7, 午: 6, 未: 5, 申: 4, 酉: 3, 戌: 2, 亥: 1 }),
    巳: Object.freeze({ 子: 3, 丑: 2, 寅: 1, 卯: 9, 辰: 8, 巳: 7, 午: 6, 未: 5, 申: 4, 酉: 3, 戌: 2, 亥: 1 }),
    亥: Object.freeze({ 子: 3, 丑: 2, 寅: 1, 卯: 9, 辰: 8, 巳: 7, 午: 6, 未: 5, 申: 4, 酉: 3, 戌: 2, 亥: 1 }),
  }),
});

export function normalizeStarNumber(number) {
  if (!Number.isFinite(number)) {
    throw new TypeError("飛星數字需為有限數值");
  }

  return positiveMod(Math.trunc(number) - 1, 9) + 1;
}

export function flyStars(centerStar, direction) {
  const normalizedDirection = normalizeDirection(direction);
  const sequence = FLYING_DIRECTIONS[normalizedDirection];
  const normalizedCenterStar = normalizeStarNumber(centerStar);
  const palaces = {};

  for (const [index, palaceId] of sequence.entries()) {
    const starNumber = normalizeStarNumber(normalizedCenterStar + index);
    palaces[palaceId] = {
      ...PALACES[palaceId],
      starNumber,
      starName: STAR_NAMES[starNumber],
    };
  }

  return {
    centerStar: normalizedCenterStar,
    direction: normalizedDirection,
    palaces,
    sequence: [...sequence],
    layout: PALACE_LAYOUT.map((row) => row.map((palaceId) => palaces[palaceId])),
  };
}

export function calculatePeriodFlyingStarChart(date) {
  const year = getLocalYear(date);
  const period = normalizeStarNumber(Math.floor((year - 1864) / 20) + 1);

  return {
    type: "period",
    period,
    basis: { year },
    ...flyStars(period, "forward"),
  };
}

export function calculateAnnualFlyingStarChart(calendarResult) {
  const year = calendarResult?.meta?.ganzhiYear;
  if (!Number.isInteger(year)) {
    throw new Error("年盤需要 calendarResult.meta.ganzhiYear");
  }

  const centerStar = normalizeStarNumber(11 - digitSum(year));

  return {
    type: "annual",
    basis: {
      year,
      yearPillar: calendarResult.yearPillar,
    },
    ...flyStars(centerStar, "forward"),
  };
}

export function calculateMonthlyFlyingStarChart(calendarResult) {
  const yearBranch = calendarResult?.yearPillar?.[1];
  const monthBranch = calendarResult?.monthBranch;
  const group = getYearBranchGroup(yearBranch);
  const centerStar = MONTH_CENTER_TABLE[group]?.[monthBranch];

  if (!centerStar) {
    throw new Error(`月盤無法判斷入中星：yearBranch=${yearBranch}, monthBranch=${monthBranch}`);
  }

  return {
    type: "monthly",
    basis: {
      yearPillar: calendarResult.yearPillar,
      yearBranch,
      yearBranchGroup: group,
      monthPillar: calendarResult.monthPillar,
      monthBranch,
    },
    ...flyStars(centerStar, "forward"),
  };
}

export function calculateDailyFlyingStarChart(calendarResult) {
  const dayPillar = calendarResult?.dayPillar;
  const termName = calendarResult?.currentTerm?.name;
  const dayIndex = SEXAGENARY_CYCLE.indexOf(dayPillar);
  const system = getDayCenterSystem(termName);

  if (dayIndex < 0) {
    throw new Error(`日盤無法判斷六十甲子序號：${dayPillar}`);
  }

  const centerStar = system.centers[dayIndex % 9];

  return {
    type: "daily",
    basis: {
      dayPillar,
      dayBranch: dayPillar[1],
      sexagenaryIndex: dayIndex,
      termName,
      systemName: system.name,
    },
    ...flyStars(centerStar, system.direction),
  };
}

export function calculateHourlyFlyingStarChart(calendarResult) {
  const dayBranch = calendarResult?.dayPillar?.[1];
  const hourBranch = calendarResult?.hourPillar?.[1];
  const termName = calendarResult?.currentTerm?.name;
  const system = getHourlySystem(termName);
  const centerStar = HOURLY_STAR_TABLES[system.tableName]?.[dayBranch]?.[hourBranch];

  if (!centerStar) {
    throw new Error(`時盤無法查得入中星：dayBranch=${dayBranch}, hourBranch=${hourBranch}`);
  }

  return {
    type: "hourly",
    basis: {
      dayPillar: calendarResult.dayPillar,
      dayBranch,
      hourPillar: calendarResult.hourPillar,
      hourBranch,
      termName,
      systemName: system.name,
      tableName: system.tableName,
    },
    ...flyStars(centerStar, system.direction),
  };
}

export function calculateAllFlyingStarCharts(calendarResult, inputDateTime) {
  if (inputDateTime === undefined || inputDateTime === null || inputDateTime === "") {
    throw new Error("五盤整合需要有效的 inputDateTime");
  }

  return {
    period: calculatePeriodFlyingStarChart(inputDateTime),
    annual: calculateAnnualFlyingStarChart(calendarResult),
    monthly: calculateMonthlyFlyingStarChart(calendarResult),
    daily: calculateDailyFlyingStarChart(calendarResult),
    hourly: calculateHourlyFlyingStarChart(calendarResult),
  };
}

function normalizeDirection(direction) {
  if (direction === "forward" || direction === "順飛") {
    return "forward";
  }

  if (direction === "reverse" || direction === "逆飛") {
    return "reverse";
  }

  throw new Error(`未知飛星方向：${direction}`);
}

function getLocalYear(date) {
  const parsed = date instanceof Date ? date : new Date(date);
  if (!Number.isFinite(parsed.getTime())) {
    throw new Error(`無效日期：${date}`);
  }

  return parsed.getFullYear();
}

function getYearBranchGroup(yearBranch) {
  if ("子午卯酉".includes(yearBranch)) {
    return "子午卯酉";
  }

  if ("辰戌丑未".includes(yearBranch)) {
    return "辰戌丑未";
  }

  if ("寅申巳亥".includes(yearBranch)) {
    return "寅申巳亥";
  }

  throw new Error(`未知年支分組：${yearBranch}`);
}

function getDayCenterSystem(termName) {
  for (const [name, system] of Object.entries(DAY_CENTER_SYSTEMS)) {
    if (system.terms.includes(termName)) {
      return { name, direction: system.direction, centers: system.centers };
    }
  }

  throw new Error(`未知日盤節氣系統：${termName}`);
}

function getHourlySystem(termName) {
  if (WINTER_FORWARD_TERMS.has(termName)) {
    return { name: "冬至順", direction: "forward", tableName: "winterForward" };
  }

  if (SUMMER_REVERSE_TERMS.has(termName)) {
    return { name: "夏至逆", direction: "reverse", tableName: "summerReverse" };
  }

  throw new Error(`未知時盤節氣系統：${termName}`);
}

function digitSum(value) {
  return String(Math.abs(value))
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);
}

function positiveMod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}
