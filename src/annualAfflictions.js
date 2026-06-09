export const ANNUAL_AFFLICTION_KEYS = Object.freeze(["taiSui", "suiPo", "sanSha"]);

const AFFLICTION_META = Object.freeze({
  taiSui: Object.freeze({ key: "taiSui", name: "太歲", label: "太" }),
  suiPo: Object.freeze({ key: "suiPo", name: "歲破", label: "歲" }),
  sanSha: Object.freeze({ key: "sanSha", name: "三煞", label: "三" }),
});

const ANNUAL_AFFLICTIONS_BY_YEAR_BRANCH = Object.freeze({
  子: Object.freeze({ taiSui: "北", suiPo: "南", sanSha: "南" }),
  丑: Object.freeze({ taiSui: "東北", suiPo: "西南", sanSha: "東" }),
  寅: Object.freeze({ taiSui: "東北", suiPo: "西南", sanSha: "北" }),
  卯: Object.freeze({ taiSui: "東", suiPo: "西", sanSha: "西" }),
  辰: Object.freeze({ taiSui: "東南", suiPo: "西北", sanSha: "南" }),
  巳: Object.freeze({ taiSui: "東南", suiPo: "西北", sanSha: "東" }),
  午: Object.freeze({ taiSui: "南", suiPo: "北", sanSha: "北" }),
  未: Object.freeze({ taiSui: "西南", suiPo: "東北", sanSha: "西" }),
  申: Object.freeze({ taiSui: "西南", suiPo: "東北", sanSha: "南" }),
  酉: Object.freeze({ taiSui: "西", suiPo: "東", sanSha: "東" }),
  戌: Object.freeze({ taiSui: "西北", suiPo: "東南", sanSha: "北" }),
  亥: Object.freeze({ taiSui: "西北", suiPo: "東南", sanSha: "西" }),
});

const PALACE_BY_DIRECTION = Object.freeze({
  北: "坎",
  東北: "艮",
  東: "震",
  東南: "巽",
  南: "離",
  西南: "坤",
  西: "兌",
  西北: "乾",
});

export function getAnnualAfflictionsByYearBranch(yearBranch) {
  const normalizedBranch = typeof yearBranch === "string" ? yearBranch.trim().charAt(0) : "";
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
  const sanSha = createAffliction("sanSha", directions.sanSha);

  return {
    taiSui,
    suiPo,
    sanSha,
    summary: `年煞：${taiSui.name}${taiSui.direction}｜${suiPo.name}${suiPo.direction}｜${sanSha.name}${sanSha.direction}`,
  };
}

export function getAnnualAfflictionBadgesByPalace(yearBranch) {
  const afflictions = getAnnualAfflictionsByYearBranch(yearBranch);
  const badgesByPalace = {};

  for (const key of ANNUAL_AFFLICTION_KEYS) {
    const affliction = afflictions[key];
    const palace = PALACE_BY_DIRECTION[affliction?.direction] ?? "";

    if (!palace) {
      continue;
    }

    if (!badgesByPalace[palace]) {
      badgesByPalace[palace] = [];
    }

    badgesByPalace[palace].push({ ...affliction });
  }

  return badgesByPalace;
}

function createAffliction(key, direction) {
  return {
    ...AFFLICTION_META[key],
    direction,
  };
}
