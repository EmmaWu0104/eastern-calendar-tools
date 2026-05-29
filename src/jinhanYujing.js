import jinhanYujingDayPanData from "../data/jinhan_yujing_day_pan.json" with { type: "json" };

export const JINHAN_PALACES = Object.freeze(["坎", "艮", "震", "巽", "離", "坤", "兌", "乾"]);
export const JINHAN_DUN_TYPES = Object.freeze(["陽遁", "陰遁"]);

export const JINHAN_DEITY_FIELDS = Object.freeze([
  Object.freeze({ key: "xishen", label: "喜神", shortLabel: "喜" }),
  Object.freeze({ key: "caishen", label: "財神", shortLabel: "財" }),
  Object.freeze({ key: "yinGuishen", label: "陰貴神", shortLabel: "陰" }),
  Object.freeze({ key: "yangGuishen", label: "陽貴神", shortLabel: "陽" }),
]);

const JINHAN_PALACE_SET = new Set(JINHAN_PALACES);

export function getJinhanYujingDayPan(dayPillar, dunType) {
  const normalizedPillar = normalizeTextKey(dayPillar);
  const normalizedDunType = normalizeTextKey(dunType);

  if (!normalizedPillar || !JINHAN_DUN_TYPES.includes(normalizedDunType)) {
    return null;
  }

  const pan = jinhanYujingDayPanData[normalizedPillar]?.[normalizedDunType];
  return pan ? clonePlainData(pan) : null;
}

export function getJinhanBlackYellowHours(dayPillar) {
  const normalizedPillar = normalizeTextKey(dayPillar);
  const hours = jinhanYujingDayPanData[normalizedPillar]?.blackYellowHours;
  return Array.isArray(hours) ? clonePlainData(hours) : [];
}

export function getJinhanDeitiesByPalace(meta) {
  if (!meta || typeof meta !== "object") {
    return {};
  }

  const deitiesByPalace = {};

  for (const deity of JINHAN_DEITY_FIELDS) {
    const palaceName = meta[deity.key];
    if (!JINHAN_PALACE_SET.has(palaceName)) {
      continue;
    }

    if (!deitiesByPalace[palaceName]) {
      deitiesByPalace[palaceName] = [];
    }

    deitiesByPalace[palaceName].push({
      key: deity.key,
      label: deity.label,
      shortLabel: deity.shortLabel,
    });
  }

  return deitiesByPalace;
}

function normalizeTextKey(value) {
  return typeof value === "string" ? value.trim() : "";
}

function clonePlainData(value) {
  return JSON.parse(JSON.stringify(value));
}
