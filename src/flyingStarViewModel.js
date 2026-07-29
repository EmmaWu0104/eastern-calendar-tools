import { STAR_DISPLAY_NAMES } from "./flyingStars.js";
import { createFlyingStarAfflictionViewModel } from "./annualAfflictions.js";

export const COMBINED_FLYING_STAR_LAYERS = Object.freeze([
  Object.freeze({ key: "period", label: "運" }),
  Object.freeze({ key: "annual", label: "年" }),
  Object.freeze({ key: "monthly", label: "月" }),
  Object.freeze({ key: "daily", label: "日" }),
  Object.freeze({ key: "hourly", label: "時" }),
]);

const CHINESE_NUMBER_LABELS = Object.freeze(["", "一", "二", "三", "四", "五", "六", "七", "八", "九"]);

export function formatStarCircleNumber(starNumber) {
  const displayName = STAR_DISPLAY_NAMES[starNumber] ?? "";
  return Array.from(displayName)[0] ?? "—";
}

export function formatStarName(palace) {
  const displayName = typeof palace?.starDisplayName === "string"
    ? palace.starDisplayName.trim()
    : "";
  return displayName.replace(/^[①-⑨]\s*/u, "");
}

export function formatPeriodCycle(period) {
  return `${getPeriodYuanName(period)}${formatChineseNumber(period)}運`;
}

export function getPeriodYuanName(period) {
  if (period >= 1 && period <= 3) {
    return "上元";
  }

  if (period >= 4 && period <= 6) {
    return "中元";
  }

  if (period >= 7 && period <= 9) {
    return "下元";
  }

  return "";
}

export function formatYinYangDun(direction) {
  return direction === "forward" ? "陽遁" : direction === "reverse" ? "陰遁" : "—";
}

export function formatMonthlySummary(monthlyChart) {
  const yearBranch = monthlyChart?.basis?.yearBranch ?? "—";
  const monthBranch = monthlyChart?.basis?.monthBranch ?? "—";
  return `${yearBranch}年${monthBranch}月`;
}

export function createCombinedFlyingStarSummary(charts) {
  const periodYuan = getPeriodYuanName(charts?.period?.period);

  return [
    {
      key: "period",
      label: "運",
      value: `${formatPeriodCycle(charts?.period?.period)} ${formatStarCircleNumber(charts?.period?.centerStar)}`,
    },
    {
      key: "annual",
      label: "年",
      value: `${periodYuan}${charts?.annual?.basis?.yearPillar ?? "—"} ${formatStarCircleNumber(charts?.annual?.centerStar)}`,
    },
    {
      key: "monthly",
      label: "月",
      value: `${formatMonthlySummary(charts?.monthly)} ${formatStarCircleNumber(charts?.monthly?.centerStar)}`,
    },
    {
      key: "daily",
      label: "日",
      value: `${formatYinYangDun(charts?.daily?.direction)} ${charts?.daily?.basis?.dayPillar ?? "—"} ${formatStarCircleNumber(charts?.daily?.centerStar)}`,
    },
    {
      key: "hourly",
      label: "時",
      value: `${formatYinYangDun(charts?.hourly?.direction)} ${charts?.hourly?.basis?.hourPillar ?? "—"} ${formatStarCircleNumber(charts?.hourly?.centerStar)}`,
    },
  ];
}

export function createCombinedFlyingStarViewModel(
  charts,
  afflictionViewModel = createFlyingStarAfflictionViewModel(charts)
) {
  const layout = charts?.period?.layout;
  if (!Array.isArray(layout)) {
    throw new Error("五層綜合盤需要運盤 layout");
  }

  return {
    layers: COMBINED_FLYING_STAR_LAYERS,
    layout: layout.map((row) =>
      row.map((periodPalace) =>
        createCombinedPalaceViewModel(periodPalace, charts, afflictionViewModel)
      )
    ),
  };
}

function createCombinedPalaceViewModel(periodPalace, charts, afflictionViewModel) {
  const palaceId = periodPalace?.id;
  if (!palaceId) {
    throw new Error("五層綜合盤缺少宮位 id");
  }

  return {
    id: palaceId,
    name: periodPalace.name,
    number: periodPalace.number,
    markers: afflictionViewModel?.combinedCellMarkers?.[palaceId] ?? [],
    layers: COMBINED_FLYING_STAR_LAYERS.map(({ key, label }) => {
      const palace = charts?.[key]?.palaces?.[palaceId];
      if (!palace) {
        throw new Error(`五層綜合盤缺少 ${key}.${palaceId}`);
      }

      const sanSha = afflictionViewModel?.sanShaByLayer?.[key] ?? null;
      const hasSanSha = sanSha?.palaceId === palaceId;
      return {
        key,
        label,
        starNumber: palace.starNumber,
        starCircle: formatStarCircleNumber(palace.starNumber),
        starName: formatStarName(palace),
        hasSanSha,
        sanSha: hasSanSha ? sanSha : null,
      };
    }),
  };
}

function formatChineseNumber(value) {
  return CHINESE_NUMBER_LABELS[value] ?? String(value ?? "—");
}
