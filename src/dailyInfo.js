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

export function getSanfuByDateKey(dateKey, sanfuDateKeys) {
  const normalizedDateKey = normalizeText(dateKey);
  if (!normalizedDateKey || typeof sanfuDateKeys !== "object" || sanfuDateKeys === null) {
    return null;
  }

  for (const sanfuType of ["初伏", "中伏", "末伏"]) {
    if (normalizedDateKey === normalizeText(sanfuDateKeys[sanfuType])) {
      return { ...SANFU_INFO[sanfuType] };
    }
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

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}
