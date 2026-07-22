import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseQimen1080Markdown } from "./qimen1080MarkdownParser.js";

export const QIMEN_SEQUENCE_DIAGNOSTIC_RULES = Object.freeze({
  outerPalaceKeys: Object.freeze(["kan", "gen", "zhen", "xun", "li", "kun", "dui", "qian"]),
  palaceNames: Object.freeze({
    kan: "坎",
    gen: "艮",
    zhen: "震",
    xun: "巽",
    li: "離",
    kun: "坤",
    dui: "兌",
    qian: "乾",
    center: "中",
  }),
  starSequence: Object.freeze(["天蓬", "天任", "天衝", "天輔", "天英", "天芮", "天柱", "天心"]),
  doorSequence: Object.freeze(["開", "休", "生", "傷", "杜", "景", "死", "驚"]),
  deitySequence: Object.freeze(["直符", "騰蛇", "太陰", "六合", "勾陳", "朱雀", "九地", "九天"]),
});

const STEM_SEQUENCE_RULES = Object.freeze({
  1: Object.freeze({ center: "壬", sequence: Object.freeze(["辛", "乙", "己", "丁", "癸", "戊", "丙", "庚"]) }),
  2: Object.freeze({ center: "辛", sequence: Object.freeze(["壬", "乙", "丁", "己", "庚", "丙", "戊", "癸"]) }),
  3: Object.freeze({ center: "庚", sequence: Object.freeze(["丁", "乙", "壬", "辛", "丙", "癸", "戊", "己"]) }),
  4: Object.freeze({ center: "己", sequence: Object.freeze(["壬", "乙", "戊", "癸", "丙", "辛", "庚", "丁"]) }),
  5: Object.freeze({ center: "戊", sequence: Object.freeze(["丙", "乙", "壬", "丁", "庚", "己", "癸", "辛"]) }),
  6: Object.freeze({ center: "乙", sequence: Object.freeze(["丁", "丙", "辛", "癸", "己", "戊", "壬", "庚"]) }),
  7: Object.freeze({ center: "丙", sequence: Object.freeze(["戊", "乙", "辛", "己", "癸", "丁", "庚", "壬"]) }),
  8: Object.freeze({ center: "丁", sequence: Object.freeze(["辛", "乙", "丙", "庚", "戊", "壬", "癸", "己"]) }),
  9: Object.freeze({ center: "癸", sequence: Object.freeze(["己", "乙", "辛", "壬", "戊", "庚", "丙", "丁"]) }),
});

const STAR_NORMALIZATION = Object.freeze({
  蓬: "天蓬", 任: "天任", 衝: "天衝", 沖: "天衝", 輔: "天輔", 英: "天英", 芮: "天芮", 柱: "天柱", 心: "天心",
  天沖: "天衝",
});

const DEITY_NORMALIZATION = Object.freeze({
  符: "直符", 蛇: "騰蛇", 陰: "太陰", 合: "六合", 陳: "勾陳", 雀: "朱雀", 地: "九地", 天: "九天",
  腾蛇: "騰蛇", 勾陈: "勾陳",
});

export function isCircularSequenceMatch(actual, expected) {
  if (!Array.isArray(actual) || !Array.isArray(expected) || actual.length !== expected.length || actual.length === 0) {
    return false;
  }
  if (actual.some((value) => value == null || value === "") || expected.some((value) => value == null || value === "")) {
    return false;
  }

  return expected.some((_, rotation) => actual.every((value, index) => value === expected[(index + rotation) % expected.length]));
}

export function normalizeQimenStarForSequence(value) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }
  return STAR_NORMALIZATION[normalized] ?? normalized.replace("天沖", "天衝");
}

export function normalizeQimenDoorForSequence(value) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }
  return normalized.replace(/門$/u, "");
}

export function getQimenStemSequenceRule(dunType, ju) {
  const numericJu = Number(ju);
  if (!Number.isInteger(numericJu) || numericJu < 1 || numericJu > 9 || !["yang", "yin"].includes(dunType)) {
    return null;
  }
  const ruleJu = dunType === "yang" ? numericJu : 10 - numericJu;
  return STEM_SEQUENCE_RULES[ruleJu] ?? null;
}

export function buildQimen1080SequenceDiagnostics(markdownTextOrParsed) {
  const parsed = typeof markdownTextOrParsed === "string"
    ? parseQimen1080Markdown(markdownTextOrParsed)
    : markdownTextOrParsed;
  const plates = Array.isArray(parsed?.plates) ? parsed.plates : [];
  const errors = [];
  const warnings = [];

  for (const plate of plates) {
    checkPlateSequences(plate, errors);
  }

  const summary = buildSummary(plates.length, errors, warnings);
  return {
    parsed,
    errors,
    warnings,
    summary,
  };
}

export function formatQimenSequenceDiagnosticsReport(diagnostics, options = {}) {
  const maxErrors = Number.isInteger(options.maxErrors) && options.maxErrors >= 0 ? options.maxErrors : 100;
  const summary = diagnostics?.summary ?? buildSummary(0, [], []);
  const lines = [
    "奇門 1080 排盤序列檢查",
    "Summary：",
    ...Object.entries(summary).map(([key, value]) => `- ${key}: ${value}`),
  ];
  const errors = Array.isArray(diagnostics?.errors) ? diagnostics.errors : [];
  const displayedErrors = errors.slice(0, maxErrors);

  lines.push("", `錯誤清單（顯示 ${displayedErrors.length} / ${errors.length}）：`);
  if (displayedErrors.length === 0) {
    lines.push("（無）");
  }
  for (const [index, error] of displayedErrors.entries()) {
    lines.push(
      "",
      `[${String(index + 1).padStart(3, "0")}] ${formatPlateIdentity(error)}`,
      `錯誤類型：${error.type}`,
      `實際順序：${formatSequence(error.actual, error.palaceKeys)}`,
      `${error.type.includes("中宮") ? "預期中宮" : "預期循環"}：${formatExpected(error.expected)}`,
      `原始標題：${error.rawHeader ?? "（未提供）"}`
    );
  }
  if (errors.length > displayedErrors.length) {
    lines.push("", `其餘 ${errors.length - displayedErrors.length} 筆錯誤未列出。`);
  }
  return lines.join("\n");
}

function checkPlateSequences(plate, errors) {
  const outerPalaceKeys = QIMEN_SEQUENCE_DIAGNOSTIC_RULES.outerPalaceKeys;
  const starActual = getOuterValues(plate, "star", normalizeQimenStarForSequence);
  const doorActual = getOuterValues(plate, "door", normalizeQimenDoorForSequence);
  const deityActual = getOuterValues(plate, "deity", normalizeQimenDeityForSequence);
  const heavenStemActual = getOuterValues(plate, "heavenStem", normalizeStem);
  const earthStemActual = getOuterValues(plate, "earthStem", normalizeStem);
  const stemRule = getQimenStemSequenceRule(plate?.dunType, plate?.ju);

  addSequenceErrorIfNeeded(errors, plate, "九星", starActual, QIMEN_SEQUENCE_DIAGNOSTIC_RULES.starSequence, outerPalaceKeys);
  addSequenceErrorIfNeeded(errors, plate, "八門", doorActual, QIMEN_SEQUENCE_DIAGNOSTIC_RULES.doorSequence, outerPalaceKeys);
  addSequenceErrorIfNeeded(
    errors,
    plate,
    "八神",
    deityActual,
    plate?.dunType === "yin" ? [...QIMEN_SEQUENCE_DIAGNOSTIC_RULES.deitySequence].reverse() : QIMEN_SEQUENCE_DIAGNOSTIC_RULES.deitySequence,
    outerPalaceKeys
  );
  addSequenceErrorIfNeeded(errors, plate, "天盤干", heavenStemActual, stemRule?.sequence ?? [], outerPalaceKeys);
  addSequenceErrorIfNeeded(errors, plate, "地盤干", earthStemActual, stemRule?.sequence ?? [], outerPalaceKeys);

  const centerHeavenStem = normalizeStem(plate?.palaces?.center?.heavenStem);
  const centerEarthStem = normalizeStem(plate?.palaces?.center?.earthStem);
  addCenterErrorIfNeeded(errors, plate, "中宮天盤干", centerHeavenStem, stemRule?.center ?? null);
  addCenterErrorIfNeeded(errors, plate, "中宮地盤干", centerEarthStem, stemRule?.center ?? null);
}

function addSequenceErrorIfNeeded(errors, plate, type, actual, expected, palaceKeys) {
  if (!isCircularSequenceMatch(actual, expected)) {
    errors.push(createDiagnosticError(plate, type, actual, expected, palaceKeys));
  }
}

function addCenterErrorIfNeeded(errors, plate, type, actual, expected) {
  if (!actual || !expected || actual !== expected) {
    errors.push(createDiagnosticError(plate, type, actual, expected, ["center"]));
  }
}

function createDiagnosticError(plate, type, actual, expected, palaceKeys) {
  return {
    type,
    dunType: plate?.dunType ?? null,
    dunName: plate?.dunName ?? null,
    ju: plate?.ju ?? null,
    dayGroup: plate?.dayGroup ?? null,
    hourPillar: plate?.hourPillar ?? null,
    actual,
    expected,
    palaceKeys,
    rawHeader: plate?.rawHeader ?? null,
  };
}

function getOuterValues(plate, field, normalize) {
  return QIMEN_SEQUENCE_DIAGNOSTIC_RULES.outerPalaceKeys.map((palaceKey) => normalize(plate?.palaces?.[palaceKey]?.[field]));
}

function buildSummary(totalPlates, errors, warnings) {
  const countByType = (type) => errors.filter((error) => error.type === type).length;
  return {
    totalPlates,
    checkedPlates: totalPlates,
    totalErrors: errors.length,
    totalWarnings: warnings.length,
    starSequenceErrorCount: countByType("九星"),
    doorSequenceErrorCount: countByType("八門"),
    deitySequenceErrorCount: countByType("八神"),
    heavenStemSequenceErrorCount: countByType("天盤干"),
    earthStemSequenceErrorCount: countByType("地盤干"),
    heavenStemCenterErrorCount: countByType("中宮天盤干"),
    earthStemCenterErrorCount: countByType("中宮地盤干"),
  };
}

function normalizeQimenDeityForSequence(value) {
  const normalized = normalizeText(value);
  return normalized ? (DEITY_NORMALIZATION[normalized] ?? normalized) : null;
}

function normalizeStem(value) {
  return normalizeText(value);
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/gu, "") || null : null;
}

function formatPlateIdentity(error) {
  const dunName = error.dunName ?? (error.dunType === "yang" ? "陽遁" : error.dunType === "yin" ? "陰遁" : "遁別未提供");
  return `${dunName}${error.ju ?? "？"}局 ${error.dayGroup ?? "日組未提供"} ${error.hourPillar ?? "時柱未提供"}`;
}

function formatSequence(actual, palaceKeys) {
  if (Array.isArray(actual)) {
    return actual.map((value, index) => `${QIMEN_SEQUENCE_DIAGNOSTIC_RULES.palaceNames[palaceKeys[index]] ?? palaceKeys[index]}=${value ?? "（缺漏）"}`).join("、");
  }
  return `中=${actual ?? "（缺漏）"}`;
}

function formatExpected(expected) {
  return Array.isArray(expected) ? expected.join("、") : expected ?? "（規則未定義）";
}

async function runCli() {
  const markdownPath = new URL("../data/1080.md", import.meta.url);
  const markdown = await readFile(markdownPath, "utf8");
  const diagnostics = buildQimen1080SequenceDiagnostics(markdown);
  console.log(formatQimenSequenceDiagnosticsReport(diagnostics));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
