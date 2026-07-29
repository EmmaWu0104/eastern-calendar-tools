export const ANNUAL_AFFLICTION_KEYS = Object.freeze(["taiSui", "suiPo", "sanSha"]);
export const SAN_SHA_LAYER_KEYS = Object.freeze(["annual", "monthly", "daily", "hourly"]);

const AFFLICTION_META = Object.freeze({
  taiSui: Object.freeze({ key: "taiSui", name: "太歲", label: "太" }),
  suiPo: Object.freeze({ key: "suiPo", name: "歲破", label: "歲" }),
  sanSha: Object.freeze({ key: "sanSha", name: "三煞", label: "三" }),
});

const ANNUAL_AFFLICTIONS_BY_YEAR_BRANCH = Object.freeze({
  子: Object.freeze({ taiSui: "北", suiPo: "南" }),
  丑: Object.freeze({ taiSui: "東北", suiPo: "西南" }),
  寅: Object.freeze({ taiSui: "東北", suiPo: "西南" }),
  卯: Object.freeze({ taiSui: "東", suiPo: "西" }),
  辰: Object.freeze({ taiSui: "東南", suiPo: "西北" }),
  巳: Object.freeze({ taiSui: "東南", suiPo: "西北" }),
  午: Object.freeze({ taiSui: "南", suiPo: "北" }),
  未: Object.freeze({ taiSui: "西南", suiPo: "東北" }),
  申: Object.freeze({ taiSui: "西南", suiPo: "東北" }),
  酉: Object.freeze({ taiSui: "西", suiPo: "東" }),
  戌: Object.freeze({ taiSui: "西北", suiPo: "東南" }),
  亥: Object.freeze({ taiSui: "西北", suiPo: "東南" }),
});

export const PALACE_ID_BY_DIRECTION = Object.freeze({
  北: "kan",
  東北: "gen",
  東: "zhen",
  東南: "xun",
  南: "li",
  西南: "kun",
  西: "dui",
  西北: "qian",
});

const SAN_SHA_DIRECTION_BY_BRANCH = Object.freeze({
  申: "南",
  子: "南",
  辰: "南",
  巳: "東",
  酉: "東",
  丑: "東",
  寅: "北",
  午: "北",
  戌: "北",
  亥: "西",
  卯: "西",
  未: "西",
});

const SAN_SHA_LAYER_META = Object.freeze({
  annual: Object.freeze({ key: "annual", label: "年" }),
  monthly: Object.freeze({ key: "monthly", label: "月" }),
  daily: Object.freeze({ key: "daily", label: "日" }),
  hourly: Object.freeze({ key: "hourly", label: "時" }),
});

export function getAnnualAfflictionsByYearBranch(yearBranch) {
  const normalizedBranch = normalizeBranch(yearBranch);
  const directions = ANNUAL_AFFLICTIONS_BY_YEAR_BRANCH[normalizedBranch] ?? null;

  if (!directions) {
    return {
      taiSui: null,
      suiPo: null,
      sanSha: null,
      summary: "",
    };
  }

  const taiSui = createAffliction("taiSui", directions.taiSui);
  const suiPo = createAffliction("suiPo", directions.suiPo);
  const sanSha = createAffliction("sanSha", getSanShaDirection(normalizedBranch));

  return {
    taiSui,
    suiPo,
    sanSha,
    summary: `年煞：${taiSui.name}${taiSui.direction}｜${suiPo.name}${suiPo.direction}｜${sanSha.name}${sanSha.direction}`,
  };
}

export function getAnnualAfflictionBadgesByPalace(yearBranch) {
  const afflictions = getAnnualAfflictionsByYearBranch(yearBranch);
  return groupAfflictionsByPalace(
    ANNUAL_AFFLICTION_KEYS.map((key) => afflictions[key]).filter(Boolean)
  );
}

export function getSanShaDirection(branch) {
  return SAN_SHA_DIRECTION_BY_BRANCH[normalizeBranch(branch)] ?? null;
}

export function getPalaceIdByDirection(direction) {
  return PALACE_ID_BY_DIRECTION[direction] ?? null;
}

export function createSanShaByLayer(charts) {
  const branchesByLayer = {
    annual: charts?.annual?.basis?.yearPillar?.[1] ?? null,
    monthly: charts?.monthly?.basis?.monthBranch ?? null,
    daily: charts?.daily?.basis?.dayBranch ?? null,
    hourly: charts?.hourly?.basis?.hourBranch ?? null,
  };

  return Object.fromEntries(
    SAN_SHA_LAYER_KEYS.map((layerKey) => {
      const branch = branchesByLayer[layerKey];
      const direction = getSanShaDirection(branch);
      return [
        layerKey,
        {
          ...SAN_SHA_LAYER_META[layerKey],
          branch,
          direction,
          palaceId: getPalaceIdByDirection(direction),
        },
      ];
    })
  );
}

export function createFlyingStarAfflictionViewModel(charts) {
  const yearBranch = charts?.annual?.basis?.yearPillar?.[1] ?? null;
  const annualAfflictions = getAnnualAfflictionsByYearBranch(yearBranch);
  const sanShaByLayer = createSanShaByLayer(charts);
  const annualCellMarkers = groupAfflictionsByPalace([
    annualAfflictions.taiSui,
    annualAfflictions.suiPo,
    createSanShaMarker(sanShaByLayer.annual),
  ]);
  const combinedCellMarkers = groupAfflictionsByPalace([
    annualAfflictions.taiSui,
    annualAfflictions.suiPo,
  ]);
  const individualCellMarkers = {
    period: {},
    annual: annualCellMarkers,
    monthly: groupAfflictionsByPalace([createSanShaMarker(sanShaByLayer.monthly)]),
    daily: groupAfflictionsByPalace([createSanShaMarker(sanShaByLayer.daily)]),
    hourly: groupAfflictionsByPalace([createSanShaMarker(sanShaByLayer.hourly)]),
  };

  return {
    annualAfflictions,
    sanShaByLayer,
    combinedCellMarkers,
    individualCellMarkers,
    summary: createFourPillarAfflictionSummary(annualAfflictions, sanShaByLayer),
  };
}

function createFourPillarAfflictionSummary(annualAfflictions, sanShaByLayer) {
  if (!annualAfflictions?.taiSui || !annualAfflictions?.suiPo) {
    return "";
  }

  const sanShaSummary = SAN_SHA_LAYER_KEYS
    .map((layerKey) => `${SAN_SHA_LAYER_META[layerKey].label}${sanShaByLayer[layerKey]?.direction ?? "—"}`)
    .join(" ");
  return `太歲${annualAfflictions.taiSui.direction}｜歲破${annualAfflictions.suiPo.direction}｜三煞：${sanShaSummary}`;
}

function createSanShaMarker(sanShaLayer) {
  if (!sanShaLayer?.direction) {
    return null;
  }

  return {
    ...AFFLICTION_META.sanSha,
    direction: sanShaLayer.direction,
    sourceLayer: sanShaLayer.key,
  };
}

function groupAfflictionsByPalace(afflictions) {
  const badgesByPalace = {};

  for (const affliction of afflictions) {
    const palaceId = getPalaceIdByDirection(affliction?.direction);
    if (!palaceId) {
      continue;
    }

    if (!badgesByPalace[palaceId]) {
      badgesByPalace[palaceId] = [];
    }

    badgesByPalace[palaceId].push({ ...affliction, palaceId });
  }

  return badgesByPalace;
}

function createAffliction(key, direction) {
  return {
    ...AFFLICTION_META[key],
    direction,
  };
}

function normalizeBranch(branch) {
  return typeof branch === "string" ? branch.trim().charAt(0) : "";
}
