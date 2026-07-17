import { QIMEN_PALACE_KEYS } from "./qimenPlateValidation.js";

export const QIMEN_HEAVEN_STEM_MARKERS = Object.freeze({
  kan: Object.freeze({ 丙: "制", 丁: "制" }),
  gen: Object.freeze({ 丁: "墓", 庚: "刑" }),
  zhen: Object.freeze({ 戊: "刑" }),
  xun: Object.freeze({ 壬: "刑", 癸: "刑" }),
  li: Object.freeze({ 辛: "刑" }),
  kun: Object.freeze({ 乙: "墓", 己: "刑" }),
  dui: Object.freeze({ 乙: "制" }),
  qian: Object.freeze({ 乙: "制", 丙: "墓", 丁: "墓" }),
  center: Object.freeze({}),
});

export const QIMEN_DOOR_PO_MARKERS = Object.freeze({
  kan: Object.freeze(["生", "死"]),
  gen: Object.freeze(["傷", "杜"]),
  zhen: Object.freeze(["開", "驚"]),
  xun: Object.freeze(["開", "驚"]),
  li: Object.freeze(["休"]),
  kun: Object.freeze(["傷", "杜"]),
  dui: Object.freeze(["景"]),
  qian: Object.freeze(["景"]),
  center: Object.freeze([]),
});

export const QIMEN_PALACE_OVER_DOOR_MARKERS = Object.freeze({
  kan: Object.freeze(["景"]),
  gen: Object.freeze(["休"]),
  zhen: Object.freeze(["生", "死"]),
  xun: Object.freeze(["生", "死"]),
  li: Object.freeze(["驚", "開"]),
  kun: Object.freeze(["休"]),
  dui: Object.freeze(["杜", "傷"]),
  qian: Object.freeze(["杜", "傷"]),
  center: Object.freeze([]),
});

export const QIMEN_ORIGINAL_STARS_BY_PALACE = Object.freeze({
  kan: "天蓬",
  gen: "天任",
  zhen: "天沖",
  xun: "天輔",
  li: "天英",
  kun: "天芮",
  dui: "天柱",
  qian: "天心",
  center: "天禽",
});

const TIAN_RUI_PALACE_NOT_FOUND_DIAGNOSTIC = Object.freeze({
  level: "warning",
  code: "TIAN_RUI_PALACE_NOT_FOUND",
  message: "找不到天芮所在宮，無法顯示中宮天盤寄宮。",
});

export function getQimenHeavenStemMarker(palaceKey, heavenStem) {
  if (typeof palaceKey !== "string" || typeof heavenStem !== "string") {
    return null;
  }

  return QIMEN_HEAVEN_STEM_MARKERS[palaceKey]?.[heavenStem] ?? null;
}

export function getQimenDoorPoMarker(palaceKey, door) {
  if (typeof palaceKey !== "string" || typeof door !== "string") {
    return null;
  }

  return QIMEN_DOOR_PO_MARKERS[palaceKey]?.includes(door) ? "迫" : null;
}

export function getQimenPalaceOverDoorMarker(palaceKey, door) {
  if (typeof palaceKey !== "string" || typeof door !== "string") {
    return null;
  }

  return QIMEN_PALACE_OVER_DOOR_MARKERS[palaceKey]?.includes(door) ? "剋" : null;
}

export function getQimenOriginalStarByPalace(palaceKey) {
  if (typeof palaceKey !== "string") {
    return null;
  }

  return QIMEN_ORIGINAL_STARS_BY_PALACE[palaceKey] ?? null;
}

export function findQimenTianRuiPalaceKey(plate) {
  if (!isPlainObject(plate?.palaces)) {
    return null;
  }

  for (const palaceKey of QIMEN_PALACE_KEYS) {
    if (plate.palaces[palaceKey]?.star === "天芮") {
      return palaceKey;
    }
  }

  return null;
}

export function findQimenDisplayZhiFuPalaceKey(plate) {
  const fallbackPalaceKey = findQimenFlaggedPalaceKey(plate, "isZhiFuPalace");

  if (plate?.zhiFuStar === "天禽" && isPlainObject(plate?.palaces)) {
    for (const palaceKey of QIMEN_PALACE_KEYS) {
      if (palaceKey !== "center" && plate.palaces[palaceKey]?.deity === "值符") {
        return palaceKey;
      }
    }
  }

  return fallbackPalaceKey;
}

export function findQimenTianYiStarPalaceKey(plate) {
  if (!isPlainObject(plate?.palaces)) {
    return null;
  }

  const displayZhiFuPalaceKey = findQimenDisplayZhiFuPalaceKey(plate);
  if (!displayZhiFuPalaceKey) {
    return null;
  }

  const originalStar = getQimenOriginalStarByPalace(displayZhiFuPalaceKey);
  if (!originalStar) {
    return null;
  }

  for (const palaceKey of QIMEN_PALACE_KEYS) {
    if (plate.palaces[palaceKey]?.star === originalStar) {
      return palaceKey;
    }
  }

  return null;
}

export function getQimenCenterStemPlacements(plate) {
  const diagnostics = [];
  const center = plate?.palaces?.center;

  if (!isPlainObject(center)) {
    return {
      centerEarthStem: null,
      centerHeavenStem: null,
      diagnostics,
    };
  }

  const centerEarthStem = isNonEmptyString(center.earthStem)
    ? { palaceKey: "kun", value: center.earthStem }
    : null;

  let centerHeavenStem = null;
  if (isNonEmptyString(center.heavenStem)) {
    const tianRuiPalaceKey = findQimenTianRuiPalaceKey(plate);
    if (tianRuiPalaceKey) {
      centerHeavenStem = { palaceKey: tianRuiPalaceKey, value: center.heavenStem };
    } else {
      diagnostics.push({ ...TIAN_RUI_PALACE_NOT_FOUND_DIAGNOSTIC });
    }
  }

  return {
    centerEarthStem,
    centerHeavenStem,
    diagnostics,
  };
}

export function decorateQimenPlateMarkers(plate) {
  const placements = getQimenCenterStemPlacements(plate);
  const tianYiStarPalaceKey = findQimenTianYiStarPalaceKey(plate);
  const palaces = {};

  for (const palaceKey of QIMEN_PALACE_KEYS) {
    const palace = plate?.palaces?.[palaceKey];
    palaces[palaceKey] = {
      heavenStemMarker: getQimenHeavenStemMarker(palaceKey, palace?.heavenStem),
      doorPo: getQimenDoorPoMarker(palaceKey, palace?.door),
      palaceOverDoor: getQimenPalaceOverDoorMarker(palaceKey, palace?.door),
      centerHeavenStem: placements.centerHeavenStem?.palaceKey === palaceKey
        ? placements.centerHeavenStem.value
        : null,
      centerEarthStem: placements.centerEarthStem?.palaceKey === palaceKey
        ? placements.centerEarthStem.value
        : null,
      isTianYiStarPalace: palaceKey === tianYiStarPalaceKey,
    };
  }

  return {
    palaces,
    placements: {
      centerHeavenStem: placements.centerHeavenStem,
      centerEarthStem: placements.centerEarthStem,
    },
    diagnostics: placements.diagnostics,
  };
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function findQimenFlaggedPalaceKey(plate, flagName) {
  if (!isPlainObject(plate?.palaces)) {
    return null;
  }

  for (const palaceKey of QIMEN_PALACE_KEYS) {
    if (plate.palaces[palaceKey]?.[flagName] === true) {
      return palaceKey;
    }
  }

  return null;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}
