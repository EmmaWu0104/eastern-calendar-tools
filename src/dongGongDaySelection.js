import dongGongDaySelectionData from "../data/dong_gong_day_selection.json" with { type: "json" };

const FALLBACK_RESULT = Object.freeze({
  found: false,
  title: "董公擇日",
  effectiveLevel: "資料待補",
  effectiveSummary: "資料待補",
  effectiveSuitable: Object.freeze([]),
  effectiveAvoid: Object.freeze([]),
  effectiveStars: Object.freeze([]),
  effectiveNotes: Object.freeze([]),
});

const DONG_GONG_INDEX = buildDongGongIndex(dongGongDaySelectionData);

export function getDongGongDaySelection({ monthBranch, dayPillar, jianChu } = {}) {
  const normalizedMonthBranch = normalizeText(monthBranch);
  const normalizedDayPillar = normalizeText(dayPillar);
  const normalizedJianChu = normalizeText(jianChu);
  const dayBranch = normalizedDayPillar[1] ?? "";
  const entry = DONG_GONG_INDEX.get(createDongGongKey(normalizedMonthBranch, dayBranch));

  if (!entry) {
    return createFallbackResult({
      monthBranch: normalizedMonthBranch,
      dayPillar: normalizedDayPillar,
      jianChu: normalizedJianChu,
      dayBranch,
    });
  }

  const override = entry.stemBranchOverrides?.[normalizedDayPillar] ?? null;
  return {
    found: true,
    monthBranch: entry.monthBranch,
    monthName: entry.monthName,
    jianChu: entry.jianChu,
    inputJianChu: normalizedJianChu,
    dayBranch: entry.dayBranch,
    dayPillar: normalizedDayPillar,
    generalLevel: entry.generalLevel,
    title: entry.title,
    summary: entry.summary,
    suitable: cloneArray(entry.suitable),
    avoid: cloneArray(entry.avoid),
    stars: cloneArray(entry.stars),
    notes: cloneArray(entry.notes),
    hasStemBranchOverride: override !== null,
    effectiveLevel: override?.level ?? entry.generalLevel,
    effectiveSummary: override?.summary ?? entry.summary,
    effectiveSuitable: cloneArray(override?.suitable ?? entry.suitable),
    effectiveAvoid: cloneArray(override?.avoid ?? entry.avoid),
    effectiveStars: cloneArray(override?.stars ?? entry.stars),
    effectiveNotes: cloneArray(override?.notes ?? entry.notes),
  };
}

function buildDongGongIndex(entries) {
  const index = new Map();

  if (!Array.isArray(entries)) {
    return index;
  }

  for (const entry of entries) {
    const monthBranch = normalizeText(entry?.monthBranch);
    const dayBranch = normalizeText(entry?.dayBranch);
    if (!monthBranch || !dayBranch) {
      continue;
    }

    index.set(createDongGongKey(monthBranch, dayBranch), normalizeEntry(entry));
  }

  return index;
}

function normalizeEntry(entry) {
  return {
    monthBranch: normalizeText(entry.monthBranch),
    monthName: normalizeText(entry.monthName),
    jianChu: normalizeText(entry.jianChu),
    dayBranch: normalizeText(entry.dayBranch),
    generalLevel: normalizeText(entry.generalLevel),
    title: normalizeText(entry.title),
    summary: normalizeText(entry.summary),
    suitable: cloneArray(entry.suitable),
    avoid: cloneArray(entry.avoid),
    stars: cloneArray(entry.stars),
    notes: cloneArray(entry.notes),
    stemBranchOverrides: normalizeStemBranchOverrides(entry.stemBranchOverrides),
  };
}

function normalizeStemBranchOverrides(overrides) {
  if (!overrides || typeof overrides !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(overrides).map(([pillar, override]) => [
      normalizeText(pillar),
      {
        level: normalizeText(override?.level),
        summary: normalizeText(override?.summary),
        suitable: cloneArray(override?.suitable),
        avoid: cloneArray(override?.avoid),
        stars: cloneArray(override?.stars),
        notes: cloneArray(override?.notes),
      },
    ])
  );
}

function createFallbackResult(extra = {}) {
  return {
    ...FALLBACK_RESULT,
    effectiveSuitable: [],
    effectiveAvoid: [],
    effectiveStars: [],
    effectiveNotes: [],
    ...extra,
  };
}

function createDongGongKey(monthBranch, dayBranch) {
  return `${monthBranch}:${dayBranch}`;
}

function cloneArray(value) {
  return Array.isArray(value) ? value.map((item) => normalizeText(item)).filter(Boolean) : [];
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}
