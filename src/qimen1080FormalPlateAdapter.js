import { QIMEN_HOUR_PILLARS, QIMEN_PALACE_KEYS, QIMEN_PALACE_META, validateQimenPlateFile } from "./qimenPlateValidation.js";
import {
  buildQimen1080DryRunReport,
  convertQimen1080ParsedToDryRun,
} from "./qimen1080ConverterDryRun.js";

const FORMAL_SCHEMA_VERSION = 1;
const FORMAL_SOURCE_TYPE = "qimen1080-md";
const FORMAL_SOURCE_FILE = "data/1080.md";
const TIANQIN_UNRESOLVED_NOTE = "天禽寄宮未推導，第一版以 center 標記直符";

export function convertQimen1080DryRunObjectToFormalPlate(object) {
  const notes = object.zhifuStar === "天禽" ? [TIANQIN_UNRESOLVED_NOTE] : [];
  const formalPlate = {
    schemaVersion: FORMAL_SCHEMA_VERSION,
    hourPillar: object.hourPillar,
    zhiFuStar: object.zhifuStar,
    zhiShiDoor: object.zhishiDoor,
    xunShou: null,
    notes,
    source: {
      type: FORMAL_SOURCE_TYPE,
      file: FORMAL_SOURCE_FILE,
      rawHeader: object.raw?.header ?? null,
      rawCells: object.raw?.cells ?? {},
    },
    palaces: {},
  };

  formalPlate.palaces = Object.fromEntries(QIMEN_PALACE_KEYS.map((palaceKey) => {
    const palace = object.palaces?.[palaceKey] ?? {};
    const palaceMeta = QIMEN_PALACE_META[palaceKey];
    const palaceNotes = palaceKey === "center" && object.zhifuStar === "天禽" ? [TIANQIN_UNRESOLVED_NOTE] : [];

    return [
      palaceKey,
      {
        palaceName: palaceMeta.palaceName,
        direction: palaceMeta.direction,
        luoshuNumber: palaceMeta.luoshuNumber,
        earthStem: palace.earthStem ?? null,
        heavenStem: palace.heavenStem ?? null,
        door: palace.door ?? null,
        star: palace.star ?? null,
        deity: palace.deity ?? null,
        isEmpty: false,
        isHorse: false,
        isZhiFuPalace: palace.star === formalPlate.zhiFuStar,
        isZhiShiPalace: palace.door === formalPlate.zhiShiDoor,
        notes: palaceNotes,
      },
    ];
  }));

  return formalPlate;
}

export function convertQimen1080DryRunObjectsToFormalPlateFiles(objects) {
  if (!Array.isArray(objects)) {
    return createFailedFormalAdapterResult("INVALID_DRY_RUN_OBJECTS", "objects 必須是 array");
  }

  const objectByKey = new Map(objects.map((object) => [
    `${object.dun}-${object.ju}-${object.hourPillar}`,
    object,
  ]));
  const files = [];

  for (const dunType of ["yang", "yin"]) {
    for (let ju = 1; ju <= 9; ju += 1) {
      const plates = Object.fromEntries(QIMEN_HOUR_PILLARS
        .filter((hourPillar) => objectByKey.has(`${dunType}-${ju}-${hourPillar}`))
        .map((hourPillar) => [
          hourPillar,
          convertQimen1080DryRunObjectToFormalPlate(objectByKey.get(`${dunType}-${ju}-${hourPillar}`)),
        ]));
      const content = {
        meta: {
          schemaVersion: "1.0.0",
          dunType,
          dunName: dunType === "yang" ? "陽遁" : "陰遁",
          ju,
          plateCount: Object.keys(plates).length,
          source: FORMAL_SOURCE_FILE,
          notes: "由 data/1080.md 轉換產生。",
        },
        plates,
      };
      const validation = validateQimenPlateFile(content, {
        filePath: `data/qimen/plates/${dunType}/ju-${ju}.json`,
        expectedDunType: dunType,
        expectedJu: ju,
      });

      files.push({
        relativePath: `${dunType}/ju-${ju}.json`,
        dunType,
        ju,
        content,
        validation,
      });
    }
  }

  const stats = buildFormalAdapterStats(files);
  const errors = validateFormalPlateFiles(files, stats);
  return {
    ok: errors.length === 0,
    files,
    stats,
    validation: {
      allFilesValid: files.every((file) => file.validation.ok),
      fileResults: files.map((file) => ({
        relativePath: file.relativePath,
        ok: file.validation.ok,
        errors: file.validation.errors,
        warnings: file.validation.warnings,
      })),
    },
    samples: buildFormalAdapterSamples(files),
    errors,
    warnings: [],
  };
}

export function buildQimen1080FormalPlateAdapterReport(parsed) {
  const dryRunReport = buildQimen1080DryRunReport(parsed);
  if (dryRunReport.ok !== true) {
    return {
      ok: false,
      dryRunReport,
      files: [],
      stats: createEmptyFormalAdapterStats(),
      validation: { allFilesValid: false, fileResults: [] },
      samples: {},
      errors: [
        createQimen1080FormalAdapterDiagnostic("DRY_RUN_REPORT_NOT_OK", "dry-run report 必須 ok 才能建立 formal plate candidates"),
        ...dryRunReport.errors,
      ],
      warnings: [...dryRunReport.warnings],
    };
  }

  const conversion = convertQimen1080ParsedToDryRun(parsed);
  if (conversion.ok !== true) {
    return {
      ok: false,
      dryRunReport,
      files: [],
      stats: createEmptyFormalAdapterStats(),
      validation: { allFilesValid: false, fileResults: [] },
      samples: {},
      errors: [
        createQimen1080FormalAdapterDiagnostic("DRY_RUN_CONVERSION_NOT_OK", "dry-run conversion 必須 ok 才能建立 formal plate candidates"),
        ...conversion.errors,
      ],
      warnings: [...conversion.warnings],
    };
  }

  const filesResult = convertQimen1080DryRunObjectsToFormalPlateFiles(conversion.objects);
  return {
    ok: filesResult.ok,
    dryRunReport,
    files: filesResult.files,
    stats: filesResult.stats,
    validation: filesResult.validation,
    samples: filesResult.samples,
    errors: filesResult.errors,
    warnings: filesResult.warnings,
  };
}

function buildFormalAdapterStats(files) {
  const byDunJu = {};
  for (const dunType of ["yang", "yin"]) {
    for (let ju = 1; ju <= 9; ju += 1) {
      byDunJu[`${dunType}-${ju}`] = files.find((file) => file.dunType === dunType && file.ju === ju)?.content.meta.plateCount ?? 0;
    }
  }

  return {
    totalFiles: files.length,
    totalPlates: files.reduce((sum, file) => sum + file.content.meta.plateCount, 0),
    yangPlates: files.filter((file) => file.dunType === "yang").reduce((sum, file) => sum + file.content.meta.plateCount, 0),
    yinPlates: files.filter((file) => file.dunType === "yin").reduce((sum, file) => sum + file.content.meta.plateCount, 0),
    byDunJu,
  };
}

function validateFormalPlateFiles(files, stats) {
  const errors = [];

  if (stats.totalFiles !== 18) {
    errors.push(createQimen1080FormalAdapterDiagnostic("FORMAL_FILE_COUNT_MISMATCH", "formal candidate files 必須為 18 個", {
      expected: 18,
      actual: stats.totalFiles,
    }));
  }

  if (stats.totalPlates !== 1080) {
    errors.push(createQimen1080FormalAdapterDiagnostic("FORMAL_TOTAL_PLATE_COUNT_MISMATCH", "formal candidate plates 必須為 1080", {
      expected: 1080,
      actual: stats.totalPlates,
    }));
  }

  if (stats.yangPlates !== 540 || stats.yinPlates !== 540) {
    errors.push(createQimen1080FormalAdapterDiagnostic("FORMAL_DUN_PLATE_COUNT_MISMATCH", "formal candidate 陽遁 / 陰遁盤數必須各 540", {
      expected: { yang: 540, yin: 540 },
      actual: { yang: stats.yangPlates, yin: stats.yinPlates },
    }));
  }

  for (const [key, count] of Object.entries(stats.byDunJu)) {
    if (count !== 60) {
      errors.push(createQimen1080FormalAdapterDiagnostic("FORMAL_JU_PLATE_COUNT_MISMATCH", "formal candidate 每局必須 60 盤", {
        key,
        expected: 60,
        actual: count,
      }));
    }
  }

  for (const file of files) {
    if (file.validation.ok !== true) {
      errors.push(createQimen1080FormalAdapterDiagnostic("FORMAL_FILE_VALIDATION_FAILED", "formal candidate file validation failed", {
        relativePath: file.relativePath,
        validationErrors: file.validation.errors,
      }));
    }
  }

  return errors;
}

function buildFormalAdapterSamples(files) {
  return {
    yangJu1Jiazi: files.find((file) => file.relativePath === "yang/ju-1.json")?.content.plates["甲子"] ?? null,
    yangJu9Guihai: files.find((file) => file.relativePath === "yang/ju-9.json")?.content.plates["癸亥"] ?? null,
    yinJu1Jiazi: files.find((file) => file.relativePath === "yin/ju-1.json")?.content.plates["甲子"] ?? null,
    yinJu9Guihai: files.find((file) => file.relativePath === "yin/ju-9.json")?.content.plates["癸亥"] ?? null,
  };
}

function createFailedFormalAdapterResult(code, message) {
  return {
    ok: false,
    files: [],
    stats: createEmptyFormalAdapterStats(),
    validation: { allFilesValid: false, fileResults: [] },
    samples: {},
    errors: [createQimen1080FormalAdapterDiagnostic(code, message)],
    warnings: [],
  };
}

function createEmptyFormalAdapterStats() {
  return {
    totalFiles: 0,
    totalPlates: 0,
    yangPlates: 0,
    yinPlates: 0,
    byDunJu: {},
  };
}

function createQimen1080FormalAdapterDiagnostic(code, message, details = {}) {
  return {
    level: "error",
    code,
    message,
    ...details,
  };
}
