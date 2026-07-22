import { SEXAGENARY_CYCLE } from "./ganzhi.js";

export const QIMEN_1080_STAR_SHORT_NAMES = Object.freeze({
  蓬: "天蓬",
  任: "天任",
  衝: "天衝",
  輔: "天輔",
  英: "天英",
  芮: "天芮",
  柱: "天柱",
  心: "天心",
  禽: "天禽",
});

export const QIMEN_1080_DOOR_NAMES = Object.freeze(["休", "生", "傷", "杜", "景", "死", "驚", "開"]);

export const QIMEN_1080_DEITY_SHORT_NAMES = Object.freeze({
  符: "直符",
  蛇: "騰蛇",
  陰: "太陰",
  合: "六合",
  陳: "勾陳",
  雀: "朱雀",
  地: "九地",
  天: "九天",
});

export const QIMEN_1080_STEMS = Object.freeze(["乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]);

export const QIMEN_1080_PALACE_LAYOUT = Object.freeze([
  Object.freeze(["xun", "li", "kun"]),
  Object.freeze(["zhen", "center", "dui"]),
  Object.freeze(["gen", "kan", "qian"]),
]);

export const QIMEN_1080_DAY_GROUPS = Object.freeze(["甲己日", "乙庚日", "丙辛日", "丁壬日", "戊癸日"]);

const CHINESE_JU_NUMBERS = Object.freeze({
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
});

const VALID_HOUR_PILLARS = new Set(SEXAGENARY_CYCLE);
const VALID_STARS = new Set(Object.values(QIMEN_1080_STAR_SHORT_NAMES));
const VALID_DOORS = new Set(QIMEN_1080_DOOR_NAMES);
const VALID_DEITIES = new Set(Object.values(QIMEN_1080_DEITY_SHORT_NAMES));
const VALID_STEMS = new Set(QIMEN_1080_STEMS);
const OUTER_PALACE_KEYS = new Set(["xun", "li", "kun", "zhen", "dui", "gen", "kan", "qian"]);
const DIAGNOSTIC_CODES = Object.freeze([
  "INVALID_MARKDOWN",
  "MISSING_DUN_SECTION",
  "MISSING_JU_SECTION",
  "PLATE_COUNT_MISMATCH",
  "DUPLICATE_PLATE",
  "INVALID_HOUR_PILLAR",
  "NORMALIZED_HOUR_PILLAR",
  "INVALID_TABLE_SHAPE",
  "INVALID_CELL_FORMAT",
  "UNKNOWN_STAR",
  "UNKNOWN_DOOR",
  "UNKNOWN_DEITY",
  "UNKNOWN_STEM",
  "DUPLICATE_STAR",
  "MISSING_STAR",
  "DUPLICATE_DOOR",
  "MISSING_DOOR",
  "DUPLICATE_DEITY",
  "MISSING_DEITY",
  "DUPLICATE_HEAVEN_STEM",
  "MISSING_HEAVEN_STEM",
  "DUPLICATE_EARTH_STEM",
  "MISSING_EARTH_STEM",
  "ZHIFU_STAR_NOT_FOUND",
  "ZHISHI_DOOR_NOT_FOUND",
  "SUSPICIOUS_TEXT",
]);

export function parseQimen1080Markdown(markdownText) {
  const initial = {
    ok: false,
    stats: createStats(),
    plates: [],
    errors: [],
    warnings: [],
  };

  if (typeof markdownText !== "string") {
    initial.errors.push(createQimen1080Diagnostic(
      "error",
      "INVALID_MARKDOWN",
      {},
      "markdownText 必須是 string"
    ));
    return finalizeParsedResult(initial);
  }

  const tableResult = parseQimen1080MarkdownTables(markdownText);
  const parsed = {
    ok: false,
    stats: createStats(),
    plates: tableResult.tables.map((table) => parseQimen1080Table(table)),
    errors: [...tableResult.errors],
    warnings: [...tableResult.warnings],
  };

  for (const plate of parsed.plates) {
    parsed.errors.push(...plate.errors);
    parsed.warnings.push(...plate.warnings);
    delete plate.errors;
    delete plate.warnings;
  }

  const validated = validateQimen1080ParsedResult(parsed);
  return finalizeParsedResult(validated);
}

export function parseQimen1080MarkdownTables(markdownText) {
  const result = {
    tables: [],
    errors: [],
    warnings: [],
  };

  if (typeof markdownText !== "string") {
    result.errors.push(createQimen1080Diagnostic(
      "error",
      "INVALID_MARKDOWN",
      {},
      "markdownText 必須是 string"
    ));
    return result;
  }

  const lines = markdownText.split(/\r?\n/);
  const context = {
    dunType: null,
    dunName: null,
    ju: null,
    dayGroup: null,
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();

    if (!line) {
      continue;
    }

    const dunMatch = line.match(/^#\s*(陽遁|陰遁)\s*$/);
    if (dunMatch) {
      context.dunName = dunMatch[1];
      context.dunType = context.dunName === "陽遁" ? "yang" : "yin";
      context.ju = null;
      context.dayGroup = null;
      continue;
    }

    const juMatch = line.match(/^###\s*(陽遁|陰遁)([一二三四五六七八九])局\s*$/);
    if (juMatch) {
      const dunName = juMatch[1];
      context.ju = CHINESE_JU_NUMBERS[juMatch[2]];
      context.dayGroup = null;
      if (context.dunName && context.dunName !== dunName) {
        result.errors.push(createQimen1080Diagnostic(
          "error",
          "MISSING_JU_SECTION",
          { ...context, raw: line },
          `局數標題 ${dunName} 與目前遁別 ${context.dunName} 不一致`
        ));
      }
      if (!context.dunName) {
        context.dunName = dunName;
        context.dunType = dunName === "陽遁" ? "yang" : "yin";
      }
      continue;
    }

    const dayGroupMatch = line.match(/^#####\s*(甲己日|乙庚日|丙辛日|丁壬日|戊癸日)\s*$/);
    if (dayGroupMatch) {
      context.dayGroup = dayGroupMatch[1];
      continue;
    }

    if (!isMarkdownTableRow(line)) {
      continue;
    }

    const cells = splitMarkdownRow(line);
    const headerLooksLikePlate = cells.length >= 3 && looksLikePlateHeader(cells);
    if (!headerLooksLikePlate) {
      continue;
    }

    const tableRows = lines.slice(index, index + 5);
    if (tableRows.length < 5 || !tableRows.every((row) => isMarkdownTableRow(row.trim()))) {
      result.errors.push(createQimen1080Diagnostic(
        "error",
        "INVALID_TABLE_SHAPE",
        { ...context, raw: line },
        "盤面 table 應有 5 行"
      ));
      continue;
    }

    result.tables.push({
      context: { ...context },
      startLine: index + 1,
      rows: tableRows,
    });
    index += 4;
  }

  return result;
}

export function validateQimen1080ParsedResult(parsed) {
  const result = {
    ok: false,
    stats: createStats(),
    plates: Array.isArray(parsed?.plates) ? parsed.plates : [],
    errors: [...(parsed?.errors ?? [])],
    warnings: [...(parsed?.warnings ?? [])],
  };

  const dunSections = new Set();
  const juSections = new Set();
  const dayGroups = new Set();
  const plateKeys = new Set();
  const platesByJu = new Map();

  for (const plate of result.plates) {
    if (plate.dunType) {
      dunSections.add(plate.dunType);
    }
    if (plate.dunType && Number.isInteger(plate.ju)) {
      juSections.add(`${plate.dunType}:${plate.ju}`);
    }
    if (plate.dayGroup) {
      dayGroups.add(`${plate.dunType}:${plate.ju}:${plate.dayGroup}`);
    }

    const plateKey = `${plate.dunType}:${plate.ju}:${plate.hourPillar}`;
    if (plateKeys.has(plateKey)) {
      result.errors.push(createQimen1080Diagnostic(
        "error",
        "DUPLICATE_PLATE",
        plate,
        `重複盤面：${plateKey}`
      ));
    }
    plateKeys.add(plateKey);

    const juKey = `${plate.dunType}:${plate.ju}`;
    if (!platesByJu.has(juKey)) {
      platesByJu.set(juKey, new Set());
    }
    platesByJu.get(juKey).add(plate.hourPillar);

    validateSinglePlate(plate, result);
  }

  for (const expectedDunType of ["yang", "yin"]) {
    if (!dunSections.has(expectedDunType)) {
      result.errors.push(createQimen1080Diagnostic(
        "error",
        "MISSING_DUN_SECTION",
        { dunType: expectedDunType },
        `缺少${expectedDunType === "yang" ? "陽遁" : "陰遁"}段落`
      ));
    }

    for (let ju = 1; ju <= 9; ju += 1) {
      const juKey = `${expectedDunType}:${ju}`;
      if (!juSections.has(juKey)) {
        result.errors.push(createQimen1080Diagnostic(
          "error",
          "MISSING_JU_SECTION",
          { dunType: expectedDunType, ju },
          `缺少${expectedDunType === "yang" ? "陽遁" : "陰遁"}${ju}局`
        ));
        continue;
      }

      const hourPillars = platesByJu.get(juKey) ?? new Set();
      if (hourPillars.size !== 60) {
        result.errors.push(createQimen1080Diagnostic(
          "error",
          "PLATE_COUNT_MISMATCH",
          { dunType: expectedDunType, ju },
          `每局應有 60 盤，目前為 ${hourPillars.size} 盤`
        ));
      }
    }
  }

  result.stats.dunSections = dunSections.size;
  result.stats.juSections = juSections.size;
  result.stats.dayGroups = dayGroups.size;
  return finalizeParsedResult(result);
}

export function createQimen1080Diagnostic(level, code, context = {}, message = "") {
  const normalizedLevel = level === "warning" ? "warning" : "error";
  const diagnostic = {
    level: normalizedLevel,
    code: typeof code === "string" && DIAGNOSTIC_CODES.includes(code) ? code : String(code),
    message,
  };

  for (const key of ["dunType", "dunName", "ju", "dayGroup", "hourPillar", "palaceKey", "raw", "line"]) {
    if (context?.[key] !== undefined) {
      diagnostic[key] = context[key];
    }
  }

  return diagnostic;
}

export function normalizeQimen1080Text(text) {
  return String(text ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/\u3000/g, " ")
    .split("\n")
    .map((line) => line.trim().replace(/\s+/g, " "))
    .join("\n")
    .trim();
}

function parseQimen1080Table(table) {
  const errors = [];
  const warnings = [];
  const context = { ...table.context, line: table.startLine };
  const parsedRows = table.rows.map((row) => splitMarkdownRow(row.trim()));
  const headerCells = parsedRows[0] ?? [];
  const header = parseQimen1080HeaderCell(headerCells[2] ?? "", context);
  errors.push(...header.errors);
  warnings.push(...header.warnings);

  const hourPillar = normalizeQimen1080HourPillar(headerCells[0] ?? "", context);
  errors.push(...hourPillar.errors);
  warnings.push(...hourPillar.warnings);

  const plate = {
    dunType: context.dunType,
    dunName: context.dunName,
    ju: context.ju,
    dayGroup: context.dayGroup,
    hourPillar: hourPillar.value,
    zhiFuStar: header.zhiFuStar,
    zhiShiDoor: header.zhiShiDoor,
    rawHeader: table.rows[0].trim(),
    palaces: {},
    errors,
    warnings,
  };

  if (parsedRows.length !== 5 || parsedRows.slice(2).some((row) => row.length !== 3)) {
    errors.push(createQimen1080Diagnostic(
      "error",
      "INVALID_TABLE_SHAPE",
      { ...plate, raw: table.rows.join("\n") },
      "盤面 table 應為 header + separator + 3x3 宮格"
    ));
  }

  for (let rowIndex = 0; rowIndex < QIMEN_1080_PALACE_LAYOUT.length; rowIndex += 1) {
    const row = parsedRows[rowIndex + 2] ?? [];
    for (let colIndex = 0; colIndex < QIMEN_1080_PALACE_LAYOUT[rowIndex].length; colIndex += 1) {
      const palaceKey = QIMEN_1080_PALACE_LAYOUT[rowIndex][colIndex];
      const rawCell = row[colIndex] ?? "";
      const palace = parseQimen1080PalaceCell(rawCell, { ...plate, palaceKey });
      plate.palaces[palaceKey] = palace.value;
      errors.push(...palace.errors);
      warnings.push(...palace.warnings);
    }
  }

  return plate;
}

function parseQimen1080HeaderCell(rawCell, context) {
  const errors = [];
  const warnings = [];
  const lines = normalizeQimen1080Text(rawCell).split("\n").filter(Boolean);
  const zhiFuRaw = lines.find((line) => line.includes("直符")) ?? "";
  const zhiShiRaw = lines.find((line) => line.includes("直使")) ?? "";
  const zhiFuStarShort = zhiFuRaw.match(/直符[:：]\s*(\S+)/)?.[1] ?? "";
  const zhiShiDoor = zhiShiRaw.match(/直使[:：]\s*(\S+)/)?.[1] ?? "";
  const zhiFuStar = normalizeStar(zhiFuStarShort, { ...context, raw: rawCell }, errors, warnings);
  validateDoor(zhiShiDoor, { ...context, raw: rawCell }, errors);

  return {
    zhiFuStar,
    zhiFuStarShort,
    zhiShiDoor: zhiShiDoor || null,
    errors,
    warnings,
  };
}

function normalizeQimen1080HourPillar(rawHourPillar, context) {
  const errors = [];
  const warnings = [];
  const raw = normalizeQimen1080Text(rawHourPillar).replace(/\s+/g, "");
  let value = raw;

  if (raw.includes("戍")) {
    value = raw.replace(/戍/g, "戌");
    warnings.push(createQimen1080Diagnostic(
      "warning",
      "NORMALIZED_HOUR_PILLAR",
      { ...context, hourPillar: value, raw: rawHourPillar },
      `時柱疑似異體字，已供解析使用：${raw} -> ${value}`
    ));
  }

  if (!VALID_HOUR_PILLARS.has(value)) {
    errors.push(createQimen1080Diagnostic(
      "error",
      "INVALID_HOUR_PILLAR",
      { ...context, hourPillar: value, raw: rawHourPillar },
      `時柱不在 60 甲子：${value}`
    ));
  }

  return { value, errors, warnings };
}

function parseQimen1080PalaceCell(rawCell, context) {
  const errors = [];
  const warnings = [];
  const normalized = normalizeQimen1080Text(rawCell);
  const lines = normalized.split("\n").filter(Boolean);
  const palace = {
    raw: rawCell.trim(),
    heavenStem: null,
    earthStem: null,
    star: null,
    door: null,
    deity: null,
  };
  const firstLineTokens = lines[0]?.split(" ").filter(Boolean) ?? [];
  const secondLineTokens = lines[1]?.split(" ").filter(Boolean) ?? [];

  if (firstLineTokens.length !== 2) {
    errors.push(createQimen1080Diagnostic(
      "error",
      "INVALID_CELL_FORMAT",
      { ...context, raw: rawCell },
      "宮格第一行應為：天盤干 + 九星"
    ));
  } else {
    palace.heavenStem = firstLineTokens[0];
    palace.star = normalizeStar(firstLineTokens[1], context, errors, warnings);
    validateStem(palace.heavenStem, "heavenStem", context, errors);
  }

  if (context.palaceKey === "center") {
    if (secondLineTokens.length !== 1) {
      const level = secondLineTokens.length > 1 ? "warning" : "error";
      const code = level === "warning" ? "SUSPICIOUS_TEXT" : "INVALID_CELL_FORMAT";
      (level === "warning" ? warnings : errors).push(createQimen1080Diagnostic(
        level,
        code,
        { ...context, raw: rawCell },
        "中宮第二行應只有地盤干"
      ));
    }
    palace.earthStem = secondLineTokens[0] ?? null;
    validateStem(palace.earthStem, "earthStem", context, errors);
  } else {
    if (secondLineTokens.length !== 3) {
      errors.push(createQimen1080Diagnostic(
        "error",
        "INVALID_CELL_FORMAT",
        { ...context, raw: rawCell },
        "外宮第二行應為：地盤干 + 八門 + 八神"
      ));
    }
    palace.earthStem = secondLineTokens[0] ?? null;
    palace.door = secondLineTokens[1] ?? null;
    palace.deity = normalizeDeity(secondLineTokens[2] ?? "", context, errors);
    validateStem(palace.earthStem, "earthStem", context, errors);
    validateDoor(palace.door, context, errors);
  }

  return {
    value: palace,
    errors,
    warnings,
  };
}

function validateSinglePlate(plate, result) {
  const palaceKeys = Object.keys(plate.palaces ?? {});
  if (palaceKeys.length !== 9) {
    result.errors.push(createQimen1080Diagnostic(
      "error",
      "INVALID_TABLE_SHAPE",
      plate,
      `每盤應有 9 宮，目前為 ${palaceKeys.length} 宮`
    ));
  }

  const stars = [];
  const doors = [];
  const deities = [];
  const heavenStems = [];
  const earthStems = [];

  for (const [palaceKey, palace] of Object.entries(plate.palaces ?? {})) {
    const context = { ...plate, palaceKey, raw: palace.raw };
    if (palace.star) {
      stars.push(palace.star);
    }
    if (palace.heavenStem) {
      heavenStems.push(palace.heavenStem);
    }
    if (palace.earthStem) {
      earthStems.push(palace.earthStem);
    }

    if (OUTER_PALACE_KEYS.has(palaceKey)) {
      if (!palace.door) {
        result.errors.push(createQimen1080Diagnostic("error", "MISSING_DOOR", context, "外宮缺八門"));
      } else {
        doors.push(palace.door);
      }
      if (!palace.deity) {
        result.errors.push(createQimen1080Diagnostic("error", "MISSING_DEITY", context, "外宮缺八神"));
      } else {
        deities.push(palace.deity);
      }
    } else if (palaceKey === "center") {
      if (palace.door !== null || palace.deity !== null) {
        result.warnings.push(createQimen1080Diagnostic("warning", "SUSPICIOUS_TEXT", context, "中宮不應有八門或八神"));
      }
    }
  }

  validateCompleteSet(stars, VALID_STARS, "STAR", plate, result);
  validateCompleteSet(doors, VALID_DOORS, "DOOR", plate, result);
  validateCompleteSet(deities, VALID_DEITIES, "DEITY", plate, result);
  validateCompleteSet(heavenStems, VALID_STEMS, "HEAVEN_STEM", plate, result);
  validateCompleteSet(earthStems, VALID_STEMS, "EARTH_STEM", plate, result);

  if (plate.zhiFuStar && !stars.includes(plate.zhiFuStar)) {
    result.errors.push(createQimen1080Diagnostic(
      "error",
      "ZHIFU_STAR_NOT_FOUND",
      plate,
      `直符星未出現在九宮：${plate.zhiFuStar}`
    ));
  }

  if (plate.zhiShiDoor && !doors.includes(plate.zhiShiDoor)) {
    result.errors.push(createQimen1080Diagnostic(
      "error",
      "ZHISHI_DOOR_NOT_FOUND",
      plate,
      `直使門未出現在八門：${plate.zhiShiDoor}`
    ));
  }
}

function validateCompleteSet(values, expectedSet, label, context, result) {
  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  for (const [value, count] of counts.entries()) {
    if (count > 1) {
      result.errors.push(createQimen1080Diagnostic(
        "error",
        `DUPLICATE_${label}`,
        context,
        `${label} 重複：${value}`
      ));
    }
  }

  for (const expected of expectedSet) {
    if (!counts.has(expected)) {
      result.errors.push(createQimen1080Diagnostic(
        "error",
        `MISSING_${label}`,
        context,
        `${label} 缺漏：${expected}`
      ));
    }
  }
}

function normalizeStar(starShort, context, errors, warnings) {
  if (starShort === "逢") {
    warnings.push(createQimen1080Diagnostic(
      "warning",
      "SUSPICIOUS_TEXT",
      { ...context, raw: context.raw },
      "九星簡稱出現「逢」，高度疑似「蓬」"
    ));
    errors.push(createQimen1080Diagnostic(
      "error",
      "UNKNOWN_STAR",
      { ...context, raw: context.raw },
      "未知九星簡稱：逢"
    ));
    return null;
  }

  const normalized = QIMEN_1080_STAR_SHORT_NAMES[starShort] ?? null;
  if (!normalized) {
    errors.push(createQimen1080Diagnostic(
      "error",
      "UNKNOWN_STAR",
      { ...context, raw: context.raw },
      `未知九星簡稱：${starShort || "(空)"}`
    ));
  }
  return normalized;
}

function normalizeDeity(deityShort, context, errors) {
  const normalized = QIMEN_1080_DEITY_SHORT_NAMES[deityShort] ?? null;
  if (!normalized) {
    errors.push(createQimen1080Diagnostic(
      "error",
      "UNKNOWN_DEITY",
      { ...context, raw: context.raw },
      `未知八神簡稱：${deityShort || "(空)"}`
    ));
  }
  return normalized;
}

function validateDoor(door, context, errors) {
  if (!door || !VALID_DOORS.has(door)) {
    errors.push(createQimen1080Diagnostic(
      "error",
      "UNKNOWN_DOOR",
      { ...context, raw: context.raw },
      `未知八門：${door || "(空)"}`
    ));
  }
}

function validateStem(stem, field, context, errors) {
  if (!stem || !VALID_STEMS.has(stem)) {
    errors.push(createQimen1080Diagnostic(
      "error",
      "UNKNOWN_STEM",
      { ...context, raw: context.raw },
      `${field} 不是乙～癸：${stem || "(空)"}`
    ));
  }
}

function looksLikePlateHeader(cells) {
  const firstCell = normalizeQimen1080Text(cells[0] ?? "").replace(/\s+/g, "");
  const thirdCell = normalizeQimen1080Text(cells[2] ?? "");
  return /^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥戍]$/.test(firstCell) &&
    (thirdCell.includes("直符") || thirdCell.includes("直使"));
}

function isMarkdownTableRow(line) {
  return line.startsWith("|") && line.endsWith("|");
}

function splitMarkdownRow(row) {
  const trimmed = row.trim();
  return trimmed
    .slice(1, trimmed.endsWith("|") ? -1 : undefined)
    .split("|")
    .map((cell) => cell.trim());
}

function createStats() {
  return {
    dunSections: 0,
    juSections: 0,
    dayGroups: 0,
    totalPlates: 0,
    yangPlates: 0,
    yinPlates: 0,
    parsedPlates: 0,
    errors: 0,
    warnings: 0,
  };
}

function finalizeParsedResult(result) {
  const stats = result.stats ?? createStats();
  stats.totalPlates = result.plates?.length ?? 0;
  stats.yangPlates = result.plates?.filter((plate) => plate.dunType === "yang").length ?? 0;
  stats.yinPlates = result.plates?.filter((plate) => plate.dunType === "yin").length ?? 0;
  stats.parsedPlates = stats.totalPlates;
  stats.errors = result.errors?.length ?? 0;
  stats.warnings = result.warnings?.length ?? 0;

  return {
    ok: stats.errors === 0,
    stats,
    plates: result.plates ?? [],
    errors: result.errors ?? [],
    warnings: result.warnings ?? [],
  };
}
