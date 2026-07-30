import { resolveQimenJiaXun } from "./qimenJiaXun.js";
import { QIMEN_BRANCH_POSITIONS } from "./qimenPlateMarkers.js";
import { QIMEN_PALACE_KEYS } from "./qimenPlateValidation.js";

const SOLAR_TERM_NAME_ALIASES = Object.freeze({
  谷雨: "穀雨",
  惊蛰: "驚蟄",
  处暑: "處暑",
  小满: "小滿",
  芒种: "芒種",
});

const QIMEN_SOLAR_TERM_VIRTUE_PUNISHMENT_GROUPS = Object.freeze([
  createGroup(["冬至", "小寒", "大寒"], "卯", "酉", "jiaChen", "jiaXu"),
  createGroup(["夏至", "小暑", "大暑"], "酉", "卯", "jiaChen", "jiaXu"),
  createGroup(["立春", "雨水", "驚蟄"], "辰", "戌", "jiaWu", "jiaZi"),
  createGroup(["立秋", "處暑", "白露"], "戌", "辰", "jiaWu", "jiaZi"),
  createGroup(["春分", "清明", "穀雨"], "午", "子", "jiaShen", "jiaYin"),
  createGroup(["秋分", "寒露", "霜降"], "子", "午", "jiaShen", "jiaYin"),
  createGroup(["立夏", "小滿", "芒種"], "未", "丑", "jiaShen", "jiaYin"),
  createGroup(["立冬", "小雪", "大雪"], "丑", "未", "jiaShen", "jiaYin"),
]);

export const QIMEN_SOLAR_TERM_VIRTUE_PUNISHMENT_BY_TERM = Object.freeze(
  Object.fromEntries(QIMEN_SOLAR_TERM_VIRTUE_PUNISHMENT_GROUPS.flatMap((group) => {
    return group.solarTerms.map((solarTerm) => [solarTerm, group]);
  }))
);

export function normalizeQimenSolarTermName(solarTerm) {
  if (typeof solarTerm !== "string") {
    return null;
  }

  const normalized = solarTerm.trim();
  if (!normalized) {
    return null;
  }

  return SOLAR_TERM_NAME_ALIASES[normalized] ?? normalized;
}

export function resolveQimenSolarTermVirtuePunishment({ solarTerm, hourPillar } = {}) {
  const diagnostics = [];
  const normalizedSolarTerm = normalizeQimenSolarTermName(solarTerm);
  if (!normalizedSolarTerm) {
    return createEmptyResolution(solarTerm, hourPillar, diagnostics, "ACTUAL_SOLAR_TERM_NOT_FOUND");
  }

  const group = QIMEN_SOLAR_TERM_VIRTUE_PUNISHMENT_BY_TERM[normalizedSolarTerm];
  if (!group) {
    return createEmptyResolution(normalizedSolarTerm, hourPillar, diagnostics, "SOLAR_TERM_RULE_NOT_FOUND");
  }

  const xun = resolveQimenJiaXun(hourPillar);
  if (!xun) {
    return createEmptyResolution(normalizedSolarTerm, hourPillar, diagnostics, "JIA_XUN_NOT_RESOLVED");
  }

  const markers = [];
  if (xun.key !== group.onlyPunishmentXunKey) {
    markers.push(createMarker("virtue", "德", group.virtueBranch));
  }
  if (xun.key !== group.onlyVirtueXunKey) {
    markers.push(createMarker("punishment", "刑", group.punishmentBranch));
  }

  return {
    solarTerm: normalizedSolarTerm,
    hourPillar,
    xunKey: xun.key,
    xunLabel: xun.label,
    chiefStem: xun.chiefStem,
    markers,
    diagnostics,
  };
}

export function createQimenSolarTermVirtuePunishmentViewModel(qimen, plate, guXu = null) {
  const resolution = resolveQimenSolarTermVirtuePunishment({
    solarTerm: qimen?.actualSolarTerm,
    hourPillar: qimen?.hourPillar,
  });
  const diagnostics = [...resolution.diagnostics];
  const guXuBranches = new Set([...(guXu?.gu ?? []), ...(guXu?.xu ?? [])]);
  const markers = resolution.markers
    .filter((marker) => {
      if (plate?.palaces?.[marker.palaceKey]) {
        return true;
      }

      diagnostics.push({
        level: "warning",
        code: "MARKER_PALACE_NOT_FOUND",
        message: "節氣德刑目標宮位不存在，未顯示該標記。",
        branch: marker.branch,
        palaceKey: marker.palaceKey,
      });
      return false;
    })
    .map((marker) => ({
      ...marker,
      hasGuXuMarker: guXuBranches.has(marker.branch),
    }));
  const palaces = Object.fromEntries(QIMEN_PALACE_KEYS.map((palaceKey) => [
    palaceKey,
    markers.filter((marker) => marker.palaceKey === palaceKey),
  ]));

  return {
    ...resolution,
    markers,
    palaces,
    diagnostics,
  };
}

function createGroup(solarTerms, virtueBranch, punishmentBranch, onlyPunishmentXunKey, onlyVirtueXunKey) {
  return Object.freeze({
    solarTerms: Object.freeze(solarTerms),
    virtueBranch,
    punishmentBranch,
    onlyPunishmentXunKey,
    onlyVirtueXunKey,
  });
}

function createMarker(type, label, branch) {
  const branchPosition = QIMEN_BRANCH_POSITIONS[branch];
  return {
    type,
    label,
    branch,
    palaceKey: branchPosition?.palaceKey ?? null,
    position: branchPosition?.position ?? null,
    edge: branchPosition?.edge ?? null,
  };
}

function createEmptyResolution(solarTerm, hourPillar, diagnostics, code) {
  diagnostics.push({
    level: "warning",
    code,
    message: "節氣德刑資料不足，未顯示德刑。",
  });
  return {
    solarTerm: normalizeQimenSolarTermName(solarTerm),
    hourPillar: typeof hourPillar === "string" ? hourPillar : null,
    xunKey: null,
    xunLabel: null,
    chiefStem: null,
    markers: [],
    diagnostics,
  };
}
