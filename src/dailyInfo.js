export const BRANCH_ELEMENTS = Object.freeze({
  "子": "水",
  "丑": "土",
  "寅": "木",
  "卯": "木",
  "辰": "土",
  "巳": "火",
  "午": "火",
  "未": "土",
  "申": "金",
  "酉": "金",
  "戌": "土",
  "亥": "水",
});

const STEM_ELEMENTS = Object.freeze({
  "甲": "木",
  "乙": "木",
  "丙": "火",
  "丁": "火",
  "戊": "土",
  "己": "土",
  "庚": "金",
  "辛": "金",
  "壬": "水",
  "癸": "水",
});

export const ELEMENT_COLORS = Object.freeze({
  "土": Object.freeze(["黃色", "咖啡色"]),
  "金": Object.freeze(["金色", "銀色", "白色", "淺灰色"]),
  "水": Object.freeze(["黑色", "深藍色", "深灰色"]),
  "木": Object.freeze(["綠色"]),
  "火": Object.freeze(["紅色", "粉紅色", "橘色", "紫色"]),
});

export const ELEMENT_GENERATES = Object.freeze({
  "木": "火",
  "火": "土",
  "土": "金",
  "金": "水",
  "水": "木",
});

const ELEMENT_CONTROLS = Object.freeze({
  "木": "土",
  "土": "水",
  "水": "火",
  "火": "金",
  "金": "木",
});

export const CLASH_BRANCHES = Object.freeze({
  "子": "午",
  "午": "子",
  "丑": "未",
  "未": "丑",
  "寅": "申",
  "申": "寅",
  "卯": "酉",
  "酉": "卯",
  "辰": "戌",
  "戌": "辰",
  "巳": "亥",
  "亥": "巳",
});

export const BRANCH_ZODIACS = Object.freeze({
  "子": "鼠",
  "丑": "牛",
  "寅": "虎",
  "卯": "兔",
  "辰": "龍",
  "巳": "蛇",
  "午": "馬",
  "未": "羊",
  "申": "猴",
  "酉": "雞",
  "戌": "狗",
  "亥": "豬",
});

export const DAILY_DA_HUANG_DAO_TABLE = Object.freeze({
  寅: Object.freeze({
    子: "青龍",
    丑: "明堂",
    寅: "天刑",
    卯: "朱雀",
    辰: "金匱",
    巳: "天德",
    午: "白虎",
    未: "玉堂",
    申: "天牢",
    酉: "玄武",
    戌: "司命",
    亥: "勾陳",
  }),
  卯: Object.freeze({
    寅: "青龍",
    卯: "明堂",
    辰: "天刑",
    巳: "朱雀",
    午: "金匱",
    未: "天德",
    申: "白虎",
    酉: "玉堂",
    戌: "天牢",
    亥: "玄武",
    子: "司命",
    丑: "勾陳",
  }),
  辰: Object.freeze({
    辰: "青龍",
    巳: "明堂",
    午: "天刑",
    未: "朱雀",
    申: "金匱",
    酉: "天德",
    戌: "白虎",
    亥: "玉堂",
    子: "天牢",
    丑: "玄武",
    寅: "司命",
    卯: "勾陳",
  }),
  巳: Object.freeze({
    午: "青龍",
    未: "明堂",
    申: "天刑",
    酉: "朱雀",
    戌: "金匱",
    亥: "天德",
    子: "白虎",
    丑: "玉堂",
    寅: "天牢",
    卯: "玄武",
    辰: "司命",
    巳: "勾陳",
  }),
  午: Object.freeze({
    申: "青龍",
    酉: "明堂",
    戌: "天刑",
    亥: "朱雀",
    子: "金匱",
    丑: "天德",
    寅: "白虎",
    卯: "玉堂",
    辰: "天牢",
    巳: "玄武",
    午: "司命",
    未: "勾陳",
  }),
  未: Object.freeze({
    戌: "青龍",
    亥: "明堂",
    子: "天刑",
    丑: "朱雀",
    寅: "金匱",
    卯: "天德",
    辰: "白虎",
    巳: "玉堂",
    午: "天牢",
    未: "玄武",
    申: "司命",
    酉: "勾陳",
  }),
  申: Object.freeze({
    子: "青龍",
    丑: "明堂",
    寅: "天刑",
    卯: "朱雀",
    辰: "金匱",
    巳: "天德",
    午: "白虎",
    未: "玉堂",
    申: "天牢",
    酉: "玄武",
    戌: "司命",
    亥: "勾陳",
  }),
  酉: Object.freeze({
    寅: "青龍",
    卯: "明堂",
    辰: "天刑",
    巳: "朱雀",
    午: "金匱",
    未: "天德",
    申: "白虎",
    酉: "玉堂",
    戌: "天牢",
    亥: "玄武",
    子: "司命",
    丑: "勾陳",
  }),
  戌: Object.freeze({
    辰: "青龍",
    巳: "明堂",
    午: "天刑",
    未: "朱雀",
    申: "金匱",
    酉: "天德",
    戌: "白虎",
    亥: "玉堂",
    子: "天牢",
    丑: "玄武",
    寅: "司命",
    卯: "勾陳",
  }),
  亥: Object.freeze({
    午: "青龍",
    未: "明堂",
    申: "天刑",
    酉: "朱雀",
    戌: "金匱",
    亥: "天德",
    子: "白虎",
    丑: "玉堂",
    寅: "天牢",
    卯: "玄武",
    辰: "司命",
    巳: "勾陳",
  }),
  子: Object.freeze({
    申: "青龍",
    酉: "明堂",
    戌: "天刑",
    亥: "朱雀",
    子: "金匱",
    丑: "天德",
    寅: "白虎",
    卯: "玉堂",
    辰: "天牢",
    巳: "玄武",
    午: "司命",
    未: "勾陳",
  }),
  丑: Object.freeze({
    戌: "青龍",
    亥: "明堂",
    子: "天刑",
    丑: "朱雀",
    寅: "金匱",
    卯: "天德",
    辰: "白虎",
    巳: "玉堂",
    午: "天牢",
    未: "玄武",
    申: "司命",
    酉: "勾陳",
  }),
});

const DA_HUANG_DAO_YELLOW_DEITIES = Object.freeze(["青龍", "明堂", "金匱", "天德", "玉堂", "司命"]);
const DA_HUANG_DAO_BLACK_DEITIES = Object.freeze(["天刑", "朱雀", "白虎", "天牢", "玄武", "勾陳"]);

const SEASONAL_MARKERS = Object.freeze({
  "春分": Object.freeze({ type: "離日", name: "木離日" }),
  "夏至": Object.freeze({ type: "離日", name: "火離日" }),
  "秋分": Object.freeze({ type: "離日", name: "金離日" }),
  "冬至": Object.freeze({ type: "離日", name: "水離日" }),
  "立春": Object.freeze({ type: "絕日", name: "木旺水絕" }),
  "立夏": Object.freeze({ type: "絕日", name: "火旺木絕" }),
  "立秋": Object.freeze({ type: "絕日", name: "金旺土絕" }),
  "立冬": Object.freeze({ type: "絕日", name: "水旺金絕" }),
});

const TIAN_SHE_REQUIRED_PILLARS = Object.freeze({
  "春季": "戊寅",
  "夏季": "甲午",
  "秋季": "戊申",
  "冬季": "甲子",
});

const SANFU_INFO = Object.freeze({
  "初伏": Object.freeze({ type: "初伏", label: "初伏", basisTerm: "夏至", gengIndex: 3 }),
  "中伏": Object.freeze({ type: "中伏", label: "中伏", basisTerm: "夏至", gengIndex: 4 }),
  "末伏": Object.freeze({ type: "末伏", label: "末伏", basisTerm: "立秋", gengIndex: 1 }),
});

export function getClothingAdviceByDayBranch(dayBranch) {
  const normalizedDayBranch = normalizeText(dayBranch);
  const dayElement = BRANCH_ELEMENTS[normalizedDayBranch];
  if (!dayElement) {
    return null;
  }

  const bestElement = ELEMENT_GENERATES[dayElement];
  const avoidElement = findGeneratingElement(dayElement);

  return {
    dayBranch: normalizedDayBranch,
    dayElement,
    best: createClothingItem("讚的", bestElement),
    good: createClothingItem("吉的", dayElement),
    avoid: createClothingItem("大忌", avoidElement),
  };
}

export function getDailyClashByDayBranch(dayBranch) {
  const normalizedDayBranch = normalizeText(dayBranch);
  const clashBranch = CLASH_BRANCHES[normalizedDayBranch];
  const zodiac = getClashingZodiacByBranch(normalizedDayBranch);
  if (!clashBranch || !zodiac) {
    return null;
  }

  return {
    dayBranch: normalizedDayBranch,
    clashBranch,
    zodiac,
    label: `衝煞：${zodiac}`,
  };
}

export function getClashingZodiacByBranch(branch) {
  const normalizedBranch = normalizeText(branch);
  const clashBranch = CLASH_BRANCHES[normalizedBranch];
  return BRANCH_ZODIACS[clashBranch] ?? "";
}

export function getDaHuangDaoFortune(deity) {
  const normalizedDeity = normalizeText(deity);

  if (DA_HUANG_DAO_YELLOW_DEITIES.includes(normalizedDeity)) {
    return {
      type: "黃道",
      fortune: "吉",
    };
  }

  if (DA_HUANG_DAO_BLACK_DEITIES.includes(normalizedDeity)) {
    return {
      type: "黑道",
      fortune: "凶",
    };
  }

  return null;
}

export function getDailyDaHuangDao(monthBranch, dayBranch) {
  const normalizedMonthBranch = normalizeText(monthBranch);
  const normalizedDayBranch = normalizeText(dayBranch);
  const deity = DAILY_DA_HUANG_DAO_TABLE[normalizedMonthBranch]?.[normalizedDayBranch];
  const fortune = getDaHuangDaoFortune(deity);

  if (!deity || !fortune) {
    return null;
  }

  return {
    deity,
    type: fortune.type,
    fortune: fortune.fortune,
  };
}

export function getSuiPoByBranches(yearBranch, dayBranch) {
  const normalizedYearBranch = normalizeText(yearBranch);
  const normalizedDayBranch = normalizeText(dayBranch);
  if (!CLASH_BRANCHES[normalizedYearBranch] || !CLASH_BRANCHES[normalizedDayBranch]) {
    return null;
  }

  const isSuiPo = CLASH_BRANCHES[normalizedDayBranch] === normalizedYearBranch;

  return {
    yearBranch: normalizedYearBranch,
    dayBranch: normalizedDayBranch,
    isSuiPo,
    label: isSuiPo ? "歲破日" : "",
  };
}

export function getSeasonalMarkerByUpcomingTerm(upcomingTermName, isPreviousEffectiveDay) {
  if (isPreviousEffectiveDay !== true) {
    return null;
  }

  const termName = normalizeText(upcomingTermName);
  const marker = SEASONAL_MARKERS[termName];
  if (!marker) {
    return null;
  }

  return {
    type: marker.type,
    name: marker.name,
    label: `${marker.type}：${marker.name}`,
    termName,
  };
}

export function getTianSheBySeasonAndDayPillar(season, dayPillar) {
  const normalizedSeason = normalizeText(season);
  const normalizedDayPillar = normalizeText(dayPillar);
  const requiredPillar = TIAN_SHE_REQUIRED_PILLARS[normalizedSeason];
  if (!requiredPillar || normalizedDayPillar.length < 2) {
    return null;
  }

  const isTianShe = normalizedDayPillar === requiredPillar;

  return {
    isTianShe,
    label: isTianShe ? "天赦日" : "",
    season: normalizedSeason,
    requiredPillar,
  };
}

export function isGengDay(dayPillar) {
  const normalizedDayPillar = normalizeText(dayPillar);
  return normalizedDayPillar[0] === "庚";
}

export function getBaoYiHeZhiFaByDayPillar(dayPillar) {
  const normalizedDayPillar = normalizeText(dayPillar);
  const stem = normalizedDayPillar[0] ?? "";
  const branch = normalizedDayPillar[1] ?? "";
  const stemElement = STEM_ELEMENTS[stem];
  const branchElement = BRANCH_ELEMENTS[branch];

  if (!stemElement || !branchElement) {
    return null;
  }

  const type = stemElement === branchElement
    ? "和日"
    : ELEMENT_CONTROLS[stemElement] === branchElement
      ? "制日"
      : ELEMENT_CONTROLS[branchElement] === stemElement
        ? "伐日"
        : ELEMENT_GENERATES[stemElement] === branchElement
          ? "寶日"
          : ELEMENT_GENERATES[branchElement] === stemElement
            ? "義日"
            : "";

  const symbol = {
    "寶日": "⭕",
    "義日": "⭕",
    "和日": "⭕",
    "制日": "‼️",
    "伐日": "❌",
  }[type];

  if (!symbol) {
    return null;
  }

  return {
    type,
    label: `${symbol} ${type}`,
    stem,
    branch,
    stemElement,
    branchElement,
  };
}

export function getSanfuByDateKey(dateKey, sanfuDateKeys) {
  const normalizedDateKey = normalizeText(dateKey);
  if (!normalizedDateKey || typeof sanfuDateKeys !== "object" || sanfuDateKeys === null) {
    return null;
  }

  const initialStart = normalizeText(sanfuDateKeys["初伏"]);
  const middleStart = normalizeText(sanfuDateKeys["中伏"]);
  const finalStart = normalizeText(sanfuDateKeys["末伏"]);
  const finalEnd = addDaysToDateKey(finalStart, 10);

  if (
    isDateKeyInRange(normalizedDateKey, initialStart, middleStart)
  ) {
    return { ...SANFU_INFO["初伏"] };
  }

  if (isDateKeyInRange(normalizedDateKey, middleStart, finalStart)) {
    return { ...SANFU_INFO["中伏"] };
  }

  if (isDateKeyInRange(normalizedDateKey, finalStart, finalEnd)) {
    return { ...SANFU_INFO["末伏"] };
  }

  return null;
}

export function getDailyInfoByBranches({
  yearBranch,
  dayPillar,
  upcomingTermName,
  isPreviousEffectiveDay,
  season,
  dateKey,
  sanfuDateKeys,
} = {}) {
  const normalizedDayPillar = normalizeText(dayPillar);
  const dayBranch = normalizedDayPillar[1] ?? "";

  return {
    clothing: getClothingAdviceByDayBranch(dayBranch),
    clash: getDailyClashByDayBranch(dayBranch),
    suiPo: getSuiPoByBranches(yearBranch, dayBranch),
    seasonalMarker: getSeasonalMarkerByUpcomingTerm(upcomingTermName, isPreviousEffectiveDay),
    tianShe: getTianSheBySeasonAndDayPillar(season, normalizedDayPillar),
    baoYiHeZhiFa: getBaoYiHeZhiFaByDayPillar(normalizedDayPillar),
    sanfu: getSanfuByDateKey(dateKey, sanfuDateKeys),
  };
}

function createClothingItem(label, element) {
  return {
    label,
    element,
    colors: [...(ELEMENT_COLORS[element] ?? [])],
  };
}

function findGeneratingElement(targetElement) {
  return Object.entries(ELEMENT_GENERATES).find(([, generated]) => generated === targetElement)?.[0] ?? "";
}

function isDateKeyInRange(dateKey, startDateKey, endDateKey) {
  return isDateKey(dateKey)
    && isDateKey(startDateKey)
    && isDateKey(endDateKey)
    && dateKey >= startDateKey
    && dateKey < endDateKey;
}

function addDaysToDateKey(dateKey, dayOffset) {
  if (!isDateKey(dateKey) || !Number.isInteger(dayOffset)) {
    return "";
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + dayOffset);
  return [
    String(date.getFullYear()).padStart(4, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function isDateKey(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}
