import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildQimen1080FormalPlateAdapterReport } from "./qimen1080FormalPlateAdapter.js";
import { parseQimen1080Markdown, parseQimen1080MarkdownTables } from "./qimen1080MarkdownParser.js";
import {
  QIMEN_SEQUENCE_DIAGNOSTIC_RULES,
  buildQimen1080SequenceDiagnostics,
  getQimenStemSequenceRule,
} from "./qimen1080SequenceDiagnostics.js";

const PROJECT_ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const MARKDOWN_PATH = path.join(PROJECT_ROOT, "data", "1080.md");
const FORMAL_PLATES_ROOT = path.join(PROJECT_ROOT, "data", "qimen", "plates");
const OUTER_PALACE_KEYS = QIMEN_SEQUENCE_DIAGNOSTIC_RULES.outerPalaceKeys;
const DEITY_SHORT_NAMES = Object.freeze({
  直符: "符",
  騰蛇: "蛇",
  太陰: "陰",
  六合: "合",
  勾陳: "陳",
  朱雀: "雀",
  九地: "地",
  九天: "天",
});
const STAR_SHORT_NAMES = Object.freeze({
  天蓬: "蓬",
  天任: "任",
  天衝: "衝",
  天輔: "輔",
  天英: "英",
  天芮: "芮",
  天柱: "柱",
  天心: "心",
});

// User-provided correct 坎宮 values. "值符" is normalized to the parser's canonical "直符".
export const KAN_PALACE_ANCHORS = Object.freeze([
  anchor("yang", 1, "戊癸日", "甲寅", "騰蛇", "天蓬", "休", "戊", "戊"),
  anchor("yang", 2, "丁壬日", "癸卯", "太陰", "天心", "休", "壬", "乙"),
  anchor("yang", 2, "戊癸日", "甲寅", "太陰", "天蓬", "休", "乙", "乙"),
  anchor("yang", 4, "戊癸日", "甲寅", "勾陳", "天蓬", "休", "丁", "丁"),
  anchor("yang", 5, "戊癸日", "甲寅", "直符", "天蓬", "休", "癸", "癸"),
  anchor("yang", 8, "戊癸日", "甲寅", "朱雀", "天蓬", "休", "庚", "庚"),
  anchor("yang", 8, "戊癸日", "己未", "勾陳", "天心", "開", "丙", "庚"),
  anchor("yang", 9, "戊癸日", "甲寅", "六合", "天蓬", "休", "己", "己"),
  anchor("yang", 9, "戊癸日", "己未", "直符", "天芮", "死", "庚", "己"),
  anchor("yin", 9, "甲己日", "庚午", "九地", "天柱", "傷", "庚", "乙"),
  anchor("yin", 9, "戊癸日", "己未", "騰蛇", "天衝", "傷", "丁", "乙"),
  anchor("yin", 6, "丁壬日", "己酉", "朱雀", "天蓬", "驚", "癸", "癸"),
  anchor("yin", 6, "戊癸日", "己未", "朱雀", "天輔", "杜", "庚", "癸"),
  anchor("yin", 5, "丙辛日", "戊戌", "朱雀", "天蓬", "開", "壬", "壬"),
  anchor("yin", 4, "甲己日", "乙丑", "朱雀", "天柱", "生", "丁", "辛"),
  anchor("yin", 4, "丙辛日", "乙未", "朱雀", "天輔", "景", "戊", "辛"),
  anchor("yin", 3, "乙庚日", "丙子", "朱雀", "天蓬", "生", "庚", "庚"),
  anchor("yin", 3, "乙庚日", "丙戌", "朱雀", "天輔", "開", "乙", "庚"),
  anchor("yin", 3, "丙辛日", "戊子", "太陰", "天柱", "生", "庚", "庚"),
  anchor("yin", 3, "丁壬日", "丙午", "朱雀", "天英", "傷", "辛", "庚"),
  anchor("yin", 2, "乙庚日", "丁丑", "朱雀", "天輔", "傷", "丙", "己"),
  anchor("yin", 2, "丙辛日", "丁酉", "朱雀", "天英", "景", "庚", "己"),
  anchor("yin", 1, "甲己日", "癸酉", "朱雀", "天輔", "休", "丁", "戊"),
  anchor("yin", 1, "乙庚日", "癸未", "朱雀", "天心", "休", "壬", "戊"),
  anchor("yin", 1, "丙辛日", "癸巳", "朱雀", "天英", "休", "己", "戊"),
  anchor("yin", 1, "丁壬日", "癸卯", "朱雀", "天任", "休", "庚", "戊"),
]);

export async function repairQimen1080KanPalaces(options = {}) {
  const markdownPath = path.resolve(options.markdownPath ?? MARKDOWN_PATH);
  const formalPlatesRoot = path.resolve(options.formalPlatesRoot ?? FORMAL_PLATES_ROOT);
  const originalMarkdown = await readFile(markdownPath, "utf8");
  const originalParsed = parseQimen1080Markdown(originalMarkdown);
  assertParserOk(originalParsed, "修正前");
  const originalTables = parseQimen1080MarkdownTables(originalMarkdown);
  if (originalTables.errors.length !== 0 || originalTables.warnings.length !== 0) {
    throw new Error(`修正前 table diagnostics 不通過：${JSON.stringify({ errors: originalTables.errors, warnings: originalTables.warnings })}`);
  }
  const matches = findUniqueAnchorMatches(originalParsed.plates, originalTables.tables, KAN_PALACE_ANCHORS);
  const repairedMarkdown = repairMarkdown(originalMarkdown, matches);
  const repairedParsed = parseQimen1080Markdown(repairedMarkdown);
  assertParserOk(repairedParsed, "修正後");
  const verification = verifyKanPalaceAnchors(repairedParsed.plates, KAN_PALACE_ANCHORS);
  if (!verification.ok) {
    throw new Error(`坎宮 anchor 驗證失敗：${JSON.stringify(verification.failures)}`);
  }

  const sequenceDiagnostics = buildQimen1080SequenceDiagnostics(repairedParsed);
  if (sequenceDiagnostics.summary.totalErrors !== 0 || sequenceDiagnostics.summary.totalWarnings !== 0) {
    throw new Error(`排盤序列 diagnostics 未歸零：${JSON.stringify(sequenceDiagnostics.summary)}`);
  }

  const formalReport = buildQimen1080FormalPlateAdapterReport(repairedParsed);
  if (!formalReport.ok || formalReport.errors.length !== 0 || formalReport.warnings.length !== 0 || formalReport.stats.totalFiles !== 18 || formalReport.stats.totalPlates !== 1080) {
    throw new Error(`formal JSON 產生前置檢查失敗：${JSON.stringify({ ok: formalReport.ok, errors: formalReport.errors, warnings: formalReport.warnings, stats: formalReport.stats })}`);
  }
  const formalAnchorVerification = verifyFormalKanPalaceAnchors(formalReport.files, KAN_PALACE_ANCHORS);
  if (!formalAnchorVerification.ok) {
    throw new Error(`formal JSON 坎宮 anchor 驗證失敗：${JSON.stringify(formalAnchorVerification.failures)}`);
  }

  if (originalMarkdown !== repairedMarkdown) {
    await writeFile(markdownPath, repairedMarkdown, "utf8");
  }

  const jsonFilesWritten = [];
  for (const file of formalReport.files) {
    const filePath = path.join(formalPlatesRoot, ...file.relativePath.split("/"));
    await writeFile(filePath, `${JSON.stringify(file.content, null, 2)}\n`, "utf8");
    jsonFilesWritten.push(file.relativePath);
  }

  return {
    ok: true,
    matchedAnchors: matches.length,
    changedMarkdown: originalMarkdown !== repairedMarkdown,
    anchorVerification: verification,
    formalAnchorVerification,
    sequenceDiagnostics: sequenceDiagnostics.summary,
    formalStats: formalReport.stats,
    jsonFilesWritten,
  };
}

export function verifyKanPalaceAnchors(plates, anchors = KAN_PALACE_ANCHORS) {
  const failures = [];
  for (const target of anchors) {
    const matches = findMatchingPlates(plates, target);
    if (matches.length !== 1) {
      failures.push({ target: identityOf(target), reason: "target-must-match-exactly-once", count: matches.length });
      continue;
    }
    const kan = matches[0].palaces?.kan;
    for (const field of ["deity", "star", "door", "heavenStem", "earthStem"]) {
      if (kan?.[field] !== target[field]) {
        failures.push({ target: identityOf(target), field, expected: target[field], actual: kan?.[field] ?? null });
      }
    }
  }
  return { ok: failures.length === 0, checked: anchors.length, failures };
}

export function verifyFormalKanPalaceAnchors(files, anchors = KAN_PALACE_ANCHORS) {
  const filesByKey = new Map(files.map((file) => [`${file.dunType}-${file.ju}`, file]));
  const failures = [];
  for (const target of anchors) {
    const kan = filesByKey.get(`${target.dunType}-${target.ju}`)?.content?.plates?.[target.hourPillar]?.palaces?.kan;
    for (const field of ["deity", "star", "door", "heavenStem", "earthStem"]) {
      if (kan?.[field] !== target[field]) {
        failures.push({ target: identityOf(target), field, expected: target[field], actual: kan?.[field] ?? null });
      }
    }
  }
  return { ok: failures.length === 0, checked: anchors.length, failures };
}

function anchor(dunType, ju, dayGroup, hourPillar, deity, star, door, heavenStem, earthStem) {
  return Object.freeze({ dunType, ju, dayGroup, hourPillar, deity, star, door, heavenStem, earthStem });
}

function findUniqueAnchorMatches(plates, tables, anchors) {
  return anchors.map((target) => {
    const matches = findMatchingPlates(plates, target);
    if (matches.length !== 1) {
      throw new Error(`${identityOf(target)} 必須唯一命中，目前為 ${matches.length} 筆`);
    }
    const matchingTables = tables.filter((table) => table.context.dunType === target.dunType && table.context.ju === target.ju && table.context.dayGroup === target.dayGroup && getTableHourPillar(table) === target.hourPillar);
    if (matchingTables.length !== 1) {
      throw new Error(`${identityOf(target)} 的原始 table 必須唯一命中，目前為 ${matchingTables.length} 筆`);
    }
    return { target, plate: matches[0], tableStartLine: matchingTables[0].startLine };
  });
}

function findMatchingPlates(plates, target) {
  return plates.filter((plate) => plate.dunType === target.dunType && plate.ju === target.ju && plate.dayGroup === target.dayGroup && plate.hourPillar === target.hourPillar);
}

function repairMarkdown(markdown, matches) {
  const newline = markdown.includes("\r\n") ? "\r\n" : "\n";
  const hasTrailingNewline = /\r?\n$/u.test(markdown);
  const lines = markdown.split(/\r?\n/u);
  if (hasTrailingNewline) {
    lines.pop();
  }
  const permittedChangedLines = new Set();

  for (const { target, tableStartLine } of matches) {
    const bodyStartIndex = tableStartLine + 1;
    for (let index = bodyStartIndex; index < bodyStartIndex + 3; index += 1) {
      permittedChangedLines.add(index);
    }
    const palaces = buildRepairedPalaces(target);
    lines[bodyStartIndex] = formatRow(palaces.xun, palaces.li, palaces.kun);
    lines[bodyStartIndex + 1] = formatRow(palaces.zhen, palaces.center, palaces.dui);
    lines[bodyStartIndex + 2] = formatRow(palaces.gen, palaces.kan, palaces.qian);
  }

  const repaired = `${lines.join(newline)}${hasTrailingNewline ? newline : ""}`;
  const originalLines = markdown.split(/\r?\n/u);
  const repairedLines = repaired.split(/\r?\n/u);
  for (let index = 0; index < Math.max(originalLines.length, repairedLines.length); index += 1) {
    if (originalLines[index] !== repairedLines[index] && !permittedChangedLines.has(index)) {
      throw new Error(`偵測到目標盤面之外的 1080.md 變更：line ${index + 1}`);
    }
  }
  return repaired;
}

function getTableHourPillar(table) {
  return table.rows[0]
    .trim()
    .split("|")[1]
    ?.trim()
    .replace(/\s+/gu, "")
    .replace(/戍/gu, "戌") ?? "";
}

function buildRepairedPalaces(target) {
  const deitySequence = target.dunType === "yin"
    ? [...QIMEN_SEQUENCE_DIAGNOSTIC_RULES.deitySequence].reverse()
    : QIMEN_SEQUENCE_DIAGNOSTIC_RULES.deitySequence;
  const stemRule = getQimenStemSequenceRule(target.dunType, target.ju);
  if (!stemRule) {
    throw new Error(`${identityOf(target)} 缺少干序規則`);
  }
  const stars = rotateFrom(QIMEN_SEQUENCE_DIAGNOSTIC_RULES.starSequence, target.star);
  const doors = rotateFrom(QIMEN_SEQUENCE_DIAGNOSTIC_RULES.doorSequence, target.door);
  const deities = rotateFrom(deitySequence, target.deity);
  const heavenStems = rotateFrom(stemRule.sequence, target.heavenStem);
  const earthStems = rotateFrom(stemRule.sequence, target.earthStem);
  const palaces = { center: { heavenStem: stemRule.center, earthStem: stemRule.center, star: "天禽", door: null, deity: null } };

  for (const [index, palaceKey] of OUTER_PALACE_KEYS.entries()) {
    palaces[palaceKey] = {
      heavenStem: heavenStems[index],
      earthStem: earthStems[index],
      star: stars[index],
      door: doors[index],
      deity: deities[index],
    };
  }
  return palaces;
}

function rotateFrom(sequence, startingValue) {
  const startIndex = sequence.indexOf(startingValue);
  if (startIndex < 0) {
    throw new Error(`無法在循環序列中定位 anchor：${startingValue}`);
  }
  return sequence.map((_, index) => sequence[(startIndex + index) % sequence.length]);
}

function formatRow(...palaces) {
  return `| ${palaces.map(formatPalace).join(" | ")} |`;
}

function formatPalace(palace) {
  if (palace.door === null) {
    return `${palace.heavenStem} 禽<br>${palace.earthStem}`;
  }
  const star = STAR_SHORT_NAMES[palace.star];
  const deity = DEITY_SHORT_NAMES[palace.deity];
  if (!star || !deity) {
    throw new Error(`無法輸出宮格：${JSON.stringify(palace)}`);
  }
  return `${palace.heavenStem} ${star}<br>${palace.earthStem} ${palace.door} ${deity}`;
}

function assertParserOk(parsed, stage) {
  if (!parsed.ok || parsed.errors.length !== 0 || parsed.warnings.length !== 0 || parsed.stats.totalPlates !== 1080) {
    throw new Error(`${stage} parser diagnostics 不通過：${JSON.stringify({ ok: parsed.ok, errors: parsed.errors.length, warnings: parsed.warnings.length, totalPlates: parsed.stats.totalPlates })}`);
  }
}

function identityOf(target) {
  return `${target.dunType === "yang" ? "陽遁" : "陰遁"}${target.ju}局 ${target.dayGroup} ${target.hourPillar}時`;
}

async function runCli() {
  const result = await repairQimen1080KanPalaces();
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
