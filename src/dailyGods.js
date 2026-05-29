export const DAILY_GOD_PALACES = Object.freeze({
  xun: Object.freeze({ id: "xun", name: "巽", number: 4, directionLabel: "東南" }),
  li: Object.freeze({ id: "li", name: "離", number: 9, directionLabel: "南" }),
  kun: Object.freeze({ id: "kun", name: "坤", number: 2, directionLabel: "西南" }),
  zhen: Object.freeze({ id: "zhen", name: "震", number: 3, directionLabel: "東" }),
  center: Object.freeze({ id: "center", name: "中", number: 5, directionLabel: "中" }),
  dui: Object.freeze({ id: "dui", name: "兌", number: 7, directionLabel: "西" }),
  gen: Object.freeze({ id: "gen", name: "艮", number: 8, directionLabel: "東北" }),
  kan: Object.freeze({ id: "kan", name: "坎", number: 1, directionLabel: "北" }),
  qian: Object.freeze({ id: "qian", name: "乾", number: 6, directionLabel: "西北" }),
});

export const DAILY_GOD_PALACE_LAYOUT = Object.freeze([
  Object.freeze(["xun", "li", "kun"]),
  Object.freeze(["zhen", "center", "dui"]),
  Object.freeze(["gen", "kan", "qian"]),
]);

export const DAILY_GOD_TABLE = Object.freeze({
  甲: Object.freeze({ joy: "gen", wealth: "gen", yinNoble: "gen", yangNoble: "kun" }),
  乙: Object.freeze({ joy: "qian", wealth: "gen", yinNoble: "kan", yangNoble: "kun" }),
  丙: Object.freeze({ joy: "kun", wealth: "dui", yinNoble: "qian", yangNoble: "dui" }),
  丁: Object.freeze({ joy: "li", wealth: "dui", yinNoble: "dui", yangNoble: "qian" }),
  戊: Object.freeze({ joy: "xun", wealth: "kan", yinNoble: "kun", yangNoble: "gen" }),
  己: Object.freeze({ joy: "gen", wealth: "kan", yinNoble: "kun", yangNoble: "kan" }),
  庚: Object.freeze({ joy: "qian", wealth: "zhen", yinNoble: "kun", yangNoble: "gen" }),
  辛: Object.freeze({ joy: "kun", wealth: "zhen", yinNoble: "li", yangNoble: "gen" }),
  壬: Object.freeze({ joy: "li", wealth: "li", yinNoble: "xun", yangNoble: "zhen" }),
  癸: Object.freeze({ joy: "xun", wealth: "li", yinNoble: "zhen", yangNoble: "xun" }),
});

const GOD_LABELS = Object.freeze({
  joy: Object.freeze({ id: "joy", name: "喜神", shortLabel: "喜" }),
  wealth: Object.freeze({ id: "wealth", name: "財神", shortLabel: "財" }),
  yinNoble: Object.freeze({ id: "yinNoble", name: "陰貴神", shortLabel: "陰" }),
  yangNoble: Object.freeze({ id: "yangNoble", name: "陽貴神", shortLabel: "陽" }),
});

export function getDailyGodsByStem(dayStem) {
  const normalizedStem = typeof dayStem === "string" ? dayStem.trim().charAt(0) : "";
  const assignments = DAILY_GOD_TABLE[normalizedStem] ?? null;
  const godsByPalace = createEmptyGodMap();

  if (assignments) {
    for (const [godId, palaceId] of Object.entries(assignments)) {
      const god = GOD_LABELS[godId];
      godsByPalace[palaceId].push({
        id: god.id,
        name: god.name,
        shortLabel: god.shortLabel,
        palaceId,
      });
    }
  }

  const layout = DAILY_GOD_PALACE_LAYOUT.map((row) =>
    row.map((palaceId) => ({
      ...DAILY_GOD_PALACES[palaceId],
      gods: godsByPalace[palaceId],
    }))
  );

  return {
    dayStem: normalizedStem,
    isKnownStem: Boolean(assignments),
    layout,
  };
}

function createEmptyGodMap() {
  return Object.fromEntries(Object.keys(DAILY_GOD_PALACES).map((palaceId) => [palaceId, []]));
}
