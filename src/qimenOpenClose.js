import { QIMEN_PALACE_KEYS } from "./qimenPlateValidation.js";
import { normalizeQimenStarName } from "./qimenPlateMarkers.js";
import { resolveQimenJiaXun } from "./qimenJiaXun.js";

export {
  QIMEN_JIA_HOUR_RESOLVED_STEMS,
  QIMEN_JIA_XUN_DEFINITIONS,
  resolveQimenJiaXun,
} from "./qimenJiaXun.js";

export const QIMEN_OPEN_CLOSE_BY_STAR = Object.freeze({
  天蓬: Object.freeze({ type: "open", label: "開" }),
  天任: Object.freeze({ type: "open", label: "開" }),
  天衝: Object.freeze({ type: "open", label: "開" }),
  天輔: Object.freeze({ type: "open", label: "開" }),
  天禽: Object.freeze({ type: "open", label: "開" }),
  天英: Object.freeze({ type: "close", label: "闔" }),
  天芮: Object.freeze({ type: "close", label: "闔" }),
  天柱: Object.freeze({ type: "close", label: "闔" }),
  天心: Object.freeze({ type: "close", label: "闔" }),
});

const QIMEN_OPEN_CLOSE_CENTER_DISPLAY_PALACE_KEY = "kun";

export function resolveQimenOpenCloseStem(hourPillar) {
  if (typeof hourPillar !== "string" || hourPillar.length !== 2) {
    return null;
  }

  const sourceStem = hourPillar[0];
  if (sourceStem !== "甲") {
    return sourceStem;
  }

  return resolveQimenJiaXun(hourPillar)?.chiefStem ?? null;
}

export function resolveQimenOpenClose(plate) {
  const diagnostics = [];
  const hourPillar = plate?.hourPillar;
  const sourceStem = getQimenHourStem(hourPillar);
  if (!sourceStem) {
    return createQimenOpenCloseResolution(null, diagnostics, "HOUR_STEM_NOT_FOUND");
  }

  const resolvedStem = resolveQimenOpenCloseStem(hourPillar);
  if (!resolvedStem) {
    return createQimenOpenCloseResolution(null, diagnostics, "JIA_HOUR_STEM_NOT_RESOLVED");
  }

  const sourcePalaceKey = findQimenHeavenStemPalaceKey(plate, resolvedStem);
  if (!sourcePalaceKey) {
    return createQimenOpenCloseResolution(null, diagnostics, "HEAVEN_STEM_PALACE_NOT_FOUND");
  }

  const palaceKey = sourcePalaceKey === "center"
    ? QIMEN_OPEN_CLOSE_CENTER_DISPLAY_PALACE_KEY
    : sourcePalaceKey;
  const palace = plate?.palaces?.[palaceKey];
  if (!palace) {
    return createQimenOpenCloseResolution(null, diagnostics, "DISPLAY_PALACE_NOT_FOUND");
  }

  const star = normalizeQimenStarName(palace.star);
  if (typeof star !== "string" || star.length === 0) {
    return createQimenOpenCloseResolution(null, diagnostics, "PALACE_STAR_NOT_FOUND");
  }

  const openClose = QIMEN_OPEN_CLOSE_BY_STAR[star];
  if (!openClose) {
    return createQimenOpenCloseResolution(null, diagnostics, "UNKNOWN_STAR_POLARITY", { star });
  }

  return {
    result: {
      palaceKey,
      sourcePalaceKey,
      sourceStem,
      resolvedStem,
      star,
      type: openClose.type,
      label: openClose.label,
    },
    diagnostics,
  };
}

export function createQimenOpenCloseViewModel(plate) {
  const resolution = resolveQimenOpenClose(plate);
  const palaces = Object.fromEntries(QIMEN_PALACE_KEYS.map((palaceKey) => [
    palaceKey,
    resolution.result?.palaceKey === palaceKey ? resolution.result : null,
  ]));

  return {
    ...resolution,
    palaces,
  };
}

function getQimenHourStem(hourPillar) {
  return typeof hourPillar === "string" && hourPillar.length === 2
    ? hourPillar[0]
    : null;
}

function findQimenHeavenStemPalaceKey(plate, heavenStem) {
  if (!plate?.palaces || typeof heavenStem !== "string") {
    return null;
  }

  return QIMEN_PALACE_KEYS.find((palaceKey) => {
    return plate.palaces[palaceKey]?.heavenStem === heavenStem;
  }) ?? null;
}

function createQimenOpenCloseResolution(result, diagnostics, code, details = {}) {
  diagnostics.push({
    level: "warning",
    code,
    message: "九星加時定開闔資料不足，未顯示開闔。",
    ...details,
  });
  return { result, diagnostics };
}
