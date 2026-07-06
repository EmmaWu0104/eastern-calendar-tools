export const QIMEN_DUN_TYPES = Object.freeze(["yang", "yin"]);
export const QIMEN_JU_NUMBERS = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9]);

export const QIMEN_HOUR_PILLARS = Object.freeze([
  "甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉",
  "甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未",
  "甲申", "乙酉", "丙戌", "丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳",
  "甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥", "庚子", "辛丑", "壬寅", "癸卯",
  "甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑",
  "甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥",
]);

export const QIMEN_PALACE_META = Object.freeze({
  kan: Object.freeze({ palaceName: "坎", direction: "北", luoshuNumber: 1 }),
  kun: Object.freeze({ palaceName: "坤", direction: "西南", luoshuNumber: 2 }),
  zhen: Object.freeze({ palaceName: "震", direction: "東", luoshuNumber: 3 }),
  xun: Object.freeze({ palaceName: "巽", direction: "東南", luoshuNumber: 4 }),
  center: Object.freeze({ palaceName: "中", direction: "中", luoshuNumber: 5 }),
  qian: Object.freeze({ palaceName: "乾", direction: "西北", luoshuNumber: 6 }),
  dui: Object.freeze({ palaceName: "兌", direction: "西", luoshuNumber: 7 }),
  gen: Object.freeze({ palaceName: "艮", direction: "東北", luoshuNumber: 8 }),
  li: Object.freeze({ palaceName: "離", direction: "南", luoshuNumber: 9 }),
});

export const QIMEN_PALACE_KEYS = Object.freeze([
  "kan",
  "kun",
  "zhen",
  "xun",
  "center",
  "qian",
  "dui",
  "gen",
  "li",
]);

const STRING_OR_NULL_FIELDS = Object.freeze([
  "earthStem",
  "heavenStem",
  "door",
  "star",
  "deity",
]);
const BOOLEAN_FIELDS = Object.freeze([
  "isEmpty",
  "isHorse",
  "isZhiFuPalace",
  "isZhiShiPalace",
]);

export function validateQimenPlateFile(fileData, context = {}) {
  const filePath = context.filePath ?? "";
  const errors = [];
  const warnings = [];

  if (!isPlainObject(fileData)) {
    errors.push(createQimenValidationError(
      "INVALID_FILE_OBJECT",
      filePath,
      "盤面檔案資料必須是 object"
    ));
    return createQimenValidationResult(errors, warnings);
  }

  if (!Object.hasOwn(fileData, "meta")) {
    errors.push(createQimenValidationError(
      "MISSING_META",
      `${filePath}#meta`,
      "缺少 meta"
    ));
  }

  if (!Object.hasOwn(fileData, "plates")) {
    errors.push(createQimenValidationError(
      "MISSING_PLATES",
      `${filePath}#plates`,
      "缺少 plates"
    ));
  }

  if (fileData.meta?.dunType !== context.expectedDunType) {
    errors.push(createQimenValidationError(
      "DUN_TYPE_MISMATCH",
      `${filePath}#meta.dunType`,
      `meta.dunType 應為 ${context.expectedDunType}`
    ));
  }

  if (fileData.meta?.ju !== context.expectedJu) {
    errors.push(createQimenValidationError(
      "JU_MISMATCH",
      `${filePath}#meta.ju`,
      `meta.ju 應為 ${context.expectedJu}`
    ));
  }

  const plates = fileData.plates;
  if (!isPlainObject(plates)) {
    errors.push(createQimenValidationError(
      "INVALID_PLATES_OBJECT",
      `${filePath}#plates`,
      "plates 必須是 object"
    ));
    return createQimenValidationResult(errors, warnings);
  }

  const expectedHourPillars = new Set(QIMEN_HOUR_PILLARS);
  for (const hourPillar of QIMEN_HOUR_PILLARS) {
    if (!Object.hasOwn(plates, hourPillar)) {
      errors.push(createQimenValidationError(
        "MISSING_HOUR_PILLAR",
        `${filePath}#plates.${hourPillar}`,
        `缺少時柱 key：${hourPillar}`
      ));
    }
  }

  for (const [hourPillarKey, plate] of Object.entries(plates)) {
    if (!expectedHourPillars.has(hourPillarKey)) {
      errors.push(createQimenValidationError(
        "UNKNOWN_HOUR_PILLAR",
        `${filePath}#plates.${hourPillarKey}`,
        `未知時柱 key：${hourPillarKey}`
      ));
      continue;
    }

    if (plate === null) {
      continue;
    }

    if (!isPlainObject(plate)) {
      errors.push(createQimenValidationError(
        "INVALID_PLATE_VALUE",
        `${filePath}#plates.${hourPillarKey}`,
        "plate value 必須是 null 或 object"
      ));
      continue;
    }

    const plateResult = validateQimenPlateObject(plate, {
      filePath,
      hourPillarKey,
    });
    errors.push(...plateResult.errors);
    warnings.push(...plateResult.warnings);
  }

  return createQimenValidationResult(errors, warnings);
}

export function validateQimenPlateObject(plate, context = {}) {
  const path = `${context.filePath ?? ""}#plates.${context.hourPillarKey ?? ""}`;
  const errors = [];
  const warnings = [];

  if (!isPlainObject(plate)) {
    errors.push(createQimenValidationError(
      "INVALID_PLATE_OBJECT",
      path,
      "plate 必須是 object"
    ));
    return createQimenValidationResult(errors, warnings);
  }

  if (typeof plate.schemaVersion !== "number" || plate.schemaVersion !== 1) {
    errors.push(createQimenValidationError(
      "INVALID_SCHEMA_VERSION",
      `${path}.schemaVersion`,
      "schemaVersion 必須是 1"
    ));
  }

  if (!Object.hasOwn(plate, "hourPillar")) {
    errors.push(createQimenValidationError(
      "MISSING_HOUR_PILLAR_FIELD",
      `${path}.hourPillar`,
      "缺少 hourPillar"
    ));
  } else if (plate.hourPillar !== context.hourPillarKey) {
    errors.push(createQimenValidationError(
      "HOUR_PILLAR_MISMATCH",
      `${path}.hourPillar`,
      `hourPillar 應為 ${context.hourPillarKey}`
    ));
  }

  if (!Object.hasOwn(plate, "palaces")) {
    errors.push(createQimenValidationError(
      "MISSING_PALACES",
      `${path}.palaces`,
      "缺少 palaces"
    ));
  } else if (!isPlainObject(plate.palaces)) {
    errors.push(createQimenValidationError(
      "INVALID_PALACES_OBJECT",
      `${path}.palaces`,
      "palaces 必須是 object"
    ));
  } else {
    const palacesResult = validateQimenPalaces(plate.palaces, context);
    errors.push(...palacesResult.errors);
    warnings.push(...palacesResult.warnings);
  }

  if (Object.hasOwn(plate, "notes") && !isStringArray(plate.notes)) {
    errors.push(createQimenValidationError(
      "INVALID_NOTES",
      `${path}.notes`,
      "notes 必須是 string[]"
    ));
  }

  for (const field of ["zhiFuStar", "zhiShiDoor", "xunShou"]) {
    if (Object.hasOwn(plate, field) && !isStringOrNull(plate[field])) {
      errors.push(createQimenValidationError(
        "INVALID_FIELD_TYPE",
        `${path}.${field}`,
        `${field} 必須是 string 或 null`
      ));
    }
  }

  return createQimenValidationResult(errors, warnings);
}

export function validateQimenPalaces(palaces, context = {}) {
  const path = `${context.filePath ?? ""}#plates.${context.hourPillarKey ?? ""}.palaces`;
  const errors = [];
  const warnings = [];

  if (!isPlainObject(palaces)) {
    errors.push(createQimenValidationError(
      "INVALID_PALACES_OBJECT",
      path,
      "palaces 必須是 object"
    ));
    return createQimenValidationResult(errors, warnings);
  }

  const expectedPalaceKeys = new Set(QIMEN_PALACE_KEYS);
  for (const key of QIMEN_PALACE_KEYS) {
    if (!Object.hasOwn(palaces, key)) {
      errors.push(createQimenValidationError(
        "MISSING_PALACE",
        `${path}.${key}`,
        `缺少宮位 key：${key}`
      ));
    }
  }

  for (const [key, palace] of Object.entries(palaces)) {
    if (!expectedPalaceKeys.has(key)) {
      errors.push(createQimenValidationError(
        "UNKNOWN_PALACE",
        `${path}.${key}`,
        `未知宮位 key：${key}`
      ));
      continue;
    }

    if (!isPlainObject(palace)) {
      errors.push(createQimenValidationError(
        "INVALID_PALACE_OBJECT",
        `${path}.${key}`,
        "宮位資料必須是 object"
      ));
      continue;
    }

    const meta = QIMEN_PALACE_META[key];
    for (const field of ["palaceName", "direction", "luoshuNumber"]) {
      if (palace[field] !== meta[field]) {
        errors.push(createQimenValidationError(
          "PALACE_META_MISMATCH",
          `${path}.${key}.${field}`,
          `${key}.${field} 應為 ${meta[field]}`
        ));
      }
    }

    for (const field of STRING_OR_NULL_FIELDS) {
      if (Object.hasOwn(palace, field) && !isStringOrNull(palace[field])) {
        errors.push(createQimenValidationError(
          "INVALID_FIELD_TYPE",
          `${path}.${key}.${field}`,
          `${field} 必須是 string 或 null`
        ));
      }
    }

    for (const field of BOOLEAN_FIELDS) {
      if (Object.hasOwn(palace, field) && typeof palace[field] !== "boolean") {
        errors.push(createQimenValidationError(
          "INVALID_FIELD_TYPE",
          `${path}.${key}.${field}`,
          `${field} 必須是 boolean`
        ));
      }
    }

    if (Object.hasOwn(palace, "notes") && !isStringArray(palace.notes)) {
      errors.push(createQimenValidationError(
        "INVALID_NOTES",
        `${path}.${key}.notes`,
        "notes 必須是 string[]"
      ));
    }
  }

  return createQimenValidationResult(errors, warnings);
}

export function mergeQimenValidationResults(...results) {
  const errors = results.flatMap((result) => result?.errors ?? []);
  const warnings = results.flatMap((result) => result?.warnings ?? []);
  return createQimenValidationResult(errors, warnings);
}

export function createQimenValidationError(code, path, message) {
  return {
    level: "error",
    code,
    path,
    message,
  };
}

export function createQimenValidationWarning(code, path, message) {
  return {
    level: "warning",
    code,
    path,
    message,
  };
}

function createQimenValidationResult(errors, warnings) {
  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function isStringOrNull(value) {
  return typeof value === "string" || value === null;
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}
