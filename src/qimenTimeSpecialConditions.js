import { HEAVENLY_STEMS, SEXAGENARY_CYCLE } from "./ganzhi.js";

export const QIMEN_FIVE_NOT_ENCOUNTER_HOUR_BY_DAY_STEM = Object.freeze({
  甲: "庚午",
  乙: "辛巳",
  丙: "壬辰",
  丁: "癸卯",
  戊: "甲寅",
  己: "乙丑",
  庚: "丙子",
  辛: "丁丑",
  壬: "戊申",
  癸: "己未",
});

export const QIMEN_HOUR_STEM_ENTERS_TOMB_BY_DAY_STEM = Object.freeze({
  乙: Object.freeze(["丁丑", "癸未", "丙戌"]),
  庚: Object.freeze(["丁丑", "癸未", "丙戌"]),
  丙: Object.freeze(["己丑", "壬辰", "戊戌"]),
  辛: Object.freeze(["己丑", "壬辰", "戊戌"]),
});

export const QIMEN_TIME_SPECIAL_CONDITION_DEFINITIONS = Object.freeze([
  Object.freeze({ key: "tianFuHour", label: "天輔時" }),
  Object.freeze({ key: "tianWangFourSpread", label: "天網四張" }),
  Object.freeze({ key: "fiveNotEncounterHour", label: "五不遇時" }),
  Object.freeze({ key: "hourStemEntersTomb", label: "時干入墓" }),
]);

export function resolveQimenTimeSpecialConditions({ dayPillar, hourPillar } = {}) {
  const diagnostics = [];
  const normalizedDayPillar = normalizeQimenDayPillar(dayPillar);
  const normalizedHourPillar = normalizeQimenPillar(hourPillar);
  if (!normalizedDayPillar) {
    diagnostics.push(createDiagnostic("DAY_PILLAR_NOT_FOUND"));
  }
  if (!normalizedHourPillar) {
    diagnostics.push(createDiagnostic("HOUR_PILLAR_NOT_FOUND"));
  }

  if (!normalizedDayPillar || !normalizedHourPillar) {
    return {
      dayPillar: normalizedDayPillar,
      dayStem: null,
      hourPillar: normalizedHourPillar,
      hourStem: null,
      conditions: [],
      diagnostics,
    };
  }

  const dayStem = normalizedDayPillar[0];
  const hourStem = normalizedHourPillar[0];
  const conditions = QIMEN_TIME_SPECIAL_CONDITION_DEFINITIONS.filter((condition) => {
    if (condition.key === "tianFuHour") {
      return hourStem === "甲";
    }
    if (condition.key === "tianWangFourSpread") {
      return hourStem === "癸";
    }
    if (condition.key === "fiveNotEncounterHour") {
      return QIMEN_FIVE_NOT_ENCOUNTER_HOUR_BY_DAY_STEM[dayStem] === normalizedHourPillar;
    }
    return QIMEN_HOUR_STEM_ENTERS_TOMB_BY_DAY_STEM[dayStem]?.includes(normalizedHourPillar) === true;
  });

  return {
    dayPillar: normalizedDayPillar,
    dayStem,
    hourPillar: normalizedHourPillar,
    hourStem,
    conditions,
    diagnostics,
  };
}

export function normalizeQimenPillar(pillar) {
  if (typeof pillar !== "string") {
    return null;
  }

  const normalized = pillar.trim().replace(/[日時]$/, "");
  return SEXAGENARY_CYCLE.includes(normalized) ? normalized : null;
}

export function normalizeQimenDayPillar(dayPillar) {
  if (typeof dayPillar !== "string") {
    return null;
  }

  const normalized = dayPillar.trim().replace(/日$/, "");
  if (HEAVENLY_STEMS.includes(normalized)) {
    return normalized;
  }

  return normalizeQimenPillar(normalized);
}

function createDiagnostic(code) {
  return {
    level: "warning",
    code,
    message: "特殊時辰資料不足，未顯示特殊條件。",
  };
}
