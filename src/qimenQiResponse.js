import { EARTHLY_BRANCHES, SEXAGENARY_CYCLE } from "./ganzhi.js";
import { normalizeQimenDoorName, normalizeQimenStarName } from "./qimenPlateMarkers.js";
import { QIMEN_PALACE_KEYS } from "./qimenPlateValidation.js";
import { normalizeQimenSolarTermName } from "./qimenSolarTermVirtuePunishment.js";

export const QIMEN_STAR_QI_RESPONSE_GROUP_BY_STAR = Object.freeze({
  天衝: "chongFu",
  天輔: "chongFu",
  天英: "ying",
  天任: "renRuiQin",
  天芮: "renRuiQin",
  天禽: "renRuiQin",
  天柱: "zhuXin",
  天心: "zhuXin",
  天蓬: "peng",
});

export const QIMEN_MONTH_BRANCH_GROUPS = Object.freeze({
  fire: Object.freeze(["巳", "午"]),
  earth: Object.freeze(["辰", "戌", "丑", "未"]),
  metal: Object.freeze(["申", "酉"]),
  water: Object.freeze(["亥", "子"]),
  wood: Object.freeze(["寅", "卯"]),
});

export const QIMEN_STAR_QI_RESPONSE_BY_GROUP = Object.freeze({
  chongFu: Object.freeze({ fire: "旺", wood: "相", water: "廢", metal: "囚", earth: "休" }),
  ying: Object.freeze({ earth: "旺", fire: "相", wood: "廢", water: "囚", metal: "休" }),
  renRuiQin: Object.freeze({ metal: "旺", earth: "相", fire: "廢", wood: "囚", water: "休" }),
  zhuXin: Object.freeze({ water: "旺", metal: "相", earth: "廢", fire: "囚", wood: "休" }),
  peng: Object.freeze({ wood: "旺", water: "相", metal: "廢", earth: "囚", fire: "休" }),
});

export const QIMEN_DOOR_QI_RESPONSE_SOLAR_TERM_GROUPS = Object.freeze({
  winterSolstice: Object.freeze(["冬至", "小寒", "大寒"]),
  springStart: Object.freeze(["立春", "雨水", "驚蟄"]),
  springEquinox: Object.freeze(["春分", "清明", "穀雨"]),
  summerStart: Object.freeze(["立夏", "小滿", "芒種"]),
  summerSolstice: Object.freeze(["夏至", "小暑", "大暑"]),
  autumnStart: Object.freeze(["立秋", "處暑", "白露"]),
  autumnEquinox: Object.freeze(["秋分", "寒露", "霜降"]),
  winterStart: Object.freeze(["立冬", "小雪", "大雪"]),
});

const QIMEN_DOOR_QI_RESPONSE_STATES = Object.freeze(["旺", "絕", "胎", "沒", "死", "囚", "休", "廢"]);

export const QIMEN_DOOR_QI_RESPONSE_BY_GROUP = Object.freeze({
  winterSolstice: createDoorQiResponseMapping(["休", "生", "傷", "杜", "景", "死", "驚", "開"]),
  springStart: createDoorQiResponseMapping(["生", "傷", "杜", "景", "死", "驚", "開", "休"]),
  springEquinox: createDoorQiResponseMapping(["傷", "杜", "景", "死", "驚", "開", "休", "生"]),
  summerStart: createDoorQiResponseMapping(["杜", "景", "死", "驚", "開", "休", "生", "傷"]),
  summerSolstice: createDoorQiResponseMapping(["景", "死", "驚", "開", "休", "生", "傷", "杜"]),
  autumnStart: createDoorQiResponseMapping(["死", "驚", "開", "休", "生", "傷", "杜", "景"]),
  autumnEquinox: createDoorQiResponseMapping(["驚", "開", "休", "生", "傷", "杜", "景", "死"]),
  winterStart: createDoorQiResponseMapping(["開", "休", "生", "傷", "杜", "景", "死", "驚"]),
});

const QIMEN_MONTH_GROUP_BY_BRANCH = Object.freeze(
  Object.fromEntries(Object.entries(QIMEN_MONTH_BRANCH_GROUPS).flatMap(([group, branches]) => {
    return branches.map((branch) => [branch, group]);
  }))
);

const QIMEN_DOOR_SOLAR_TERM_GROUP_BY_TERM = Object.freeze(
  Object.fromEntries(Object.entries(QIMEN_DOOR_QI_RESPONSE_SOLAR_TERM_GROUPS).flatMap(([group, terms]) => {
    return terms.map((term) => [term, group]);
  }))
);

export function normalizeQimenMonthPillar(monthPillar) {
  if (typeof monthPillar !== "string") {
    return null;
  }

  const normalized = monthPillar.trim().replace(/月$/u, "");
  if (EARTHLY_BRANCHES.includes(normalized)) {
    return normalized;
  }

  return SEXAGENARY_CYCLE.includes(normalized) ? normalized : null;
}

export function getQimenMonthBranch(monthPillar) {
  const normalizedMonthPillar = normalizeQimenMonthPillar(monthPillar);
  return normalizedMonthPillar?.at(-1) ?? null;
}

export function resolveQimenStarQiResponse({ monthPillar, star } = {}) {
  const diagnostics = [];
  const normalizedMonthPillar = normalizeQimenMonthPillar(monthPillar);
  const monthBranch = getQimenMonthBranch(normalizedMonthPillar);
  const normalizedStar = normalizeQimenStarName(star);
  const starGroup = normalizedStar ? QIMEN_STAR_QI_RESPONSE_GROUP_BY_STAR[normalizedStar] ?? null : null;
  const monthGroup = monthBranch ? QIMEN_MONTH_GROUP_BY_BRANCH[monthBranch] ?? null : null;
  const state = starGroup && monthGroup
    ? QIMEN_STAR_QI_RESPONSE_BY_GROUP[starGroup]?.[monthGroup] ?? null
    : null;

  if (!normalizedMonthPillar || !monthBranch || !monthGroup) {
    diagnostics.push(createDiagnostic("MONTH_BRANCH_NOT_RESOLVED", "月柱或月支無法解析，未顯示九星氣應。"));
  }
  if (!normalizedStar || !starGroup) {
    diagnostics.push(createDiagnostic("STAR_GROUP_NOT_RESOLVED", "九星名稱無法解析，未顯示九星氣應。"));
  }

  return {
    monthPillar: normalizedMonthPillar,
    monthBranch,
    star: typeof star === "string" ? star : null,
    normalizedStar,
    starGroup,
    monthGroup,
    state,
    diagnostics,
  };
}

export function resolveQimenDoorQiResponse({ actualSolarTerm, door } = {}) {
  const diagnostics = [];
  const normalizedSolarTerm = normalizeQimenSolarTermName(actualSolarTerm);
  const normalizedDoor = normalizeQimenDoorName(door);
  const solarTermGroup = normalizedSolarTerm
    ? QIMEN_DOOR_SOLAR_TERM_GROUP_BY_TERM[normalizedSolarTerm] ?? null
    : null;
  const state = solarTermGroup && normalizedDoor
    ? QIMEN_DOOR_QI_RESPONSE_BY_GROUP[solarTermGroup]?.[normalizedDoor] ?? null
    : null;

  if (!normalizedSolarTerm || !solarTermGroup) {
    diagnostics.push(createDiagnostic("ACTUAL_SOLAR_TERM_GROUP_NOT_RESOLVED", "實際節氣無法解析，未顯示八門氣應。"));
  }
  if (!normalizedDoor || !state) {
    diagnostics.push(createDiagnostic("DOOR_NOT_RESOLVED", "八門名稱無法解析，未顯示八門氣應。"));
  }

  return {
    actualSolarTerm: normalizedSolarTerm,
    solarTermGroup,
    door: typeof door === "string" ? door : null,
    normalizedDoor,
    state,
    diagnostics,
  };
}

export function createQimenQiResponseViewModel({ monthPillar, actualSolarTerm, plate } = {}) {
  const palaces = {};

  for (const palaceKey of QIMEN_PALACE_KEYS) {
    const palace = plate?.palaces?.[palaceKey];
    const starQiResponse = typeof palace?.star === "string"
      ? resolveQimenStarQiResponse({ monthPillar, star: palace.star })
      : null;
    const doorQiResponse = typeof palace?.door === "string"
      ? resolveQimenDoorQiResponse({ actualSolarTerm, door: palace.door })
      : null;
    palaces[palaceKey] = {
      starQiResponse: starQiResponse?.state ? starQiResponse : null,
      doorQiResponse: doorQiResponse?.state ? doorQiResponse : null,
    };
  }

  return {
    monthPillar: normalizeQimenMonthPillar(monthPillar),
    monthBranch: getQimenMonthBranch(monthPillar),
    actualSolarTerm: normalizeQimenSolarTermName(actualSolarTerm),
    palaces,
  };
}

function createDoorQiResponseMapping(doorsByState) {
  return Object.freeze(Object.fromEntries(doorsByState.map((door, index) => [
    door,
    QIMEN_DOOR_QI_RESPONSE_STATES[index],
  ])));
}

function createDiagnostic(code, message) {
  return {
    level: "warning",
    code,
    message,
  };
}
