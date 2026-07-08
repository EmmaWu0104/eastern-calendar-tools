import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SEXAGENARY_CYCLE } from "./ganzhi.js";
import {
  buildQimen1080DryRunReport,
  convertQimen1080ParsedToDryRun,
} from "./qimen1080ConverterDryRun.js";

const PROJECT_ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const DEFAULT_PREVIEW_ROOT = path.join(PROJECT_ROOT, "tmp", "qimen1080-preview");
const FORMAL_QIMEN_PLATES_ROOT = path.join(PROJECT_ROOT, "data", "qimen", "plates");
const PREVIEW_SCHEMA_VERSION = "qimen-1080-preview-v1";
const PREVIEW_SOURCE = "data/1080.md";
const PREVIEW_GENERATOR = "qimen1080PreviewWriter";

export function buildQimen1080PreviewFiles(parsed) {
  const dryRunReport = buildQimen1080DryRunReport(parsed);
  if (dryRunReport.ok !== true) {
    return {
      ok: false,
      files: [],
      stats: createEmptyPreviewStats(),
      dryRunReport,
      errors: [
        createQimen1080PreviewDiagnostic("DRY_RUN_REPORT_NOT_OK", "dry-run report 必須 ok 才能建立 preview files"),
        ...dryRunReport.errors,
      ],
      warnings: [...dryRunReport.warnings],
    };
  }

  const conversion = convertQimen1080ParsedToDryRun(parsed);
  if (conversion.ok !== true) {
    return {
      ok: false,
      files: [],
      stats: createEmptyPreviewStats(),
      dryRunReport,
      errors: [
        createQimen1080PreviewDiagnostic("DRY_RUN_CONVERSION_NOT_OK", "dry-run conversion 必須 ok 才能建立 preview files"),
        ...conversion.errors,
      ],
      warnings: [...conversion.warnings],
    };
  }

  const files = [];
  for (const dun of ["yang", "yin"]) {
    for (let ju = 1; ju <= 9; ju += 1) {
      const plates = buildPreviewPlateMap(conversion.objects, dun, ju);
      const plateCount = Object.keys(plates).length;
      files.push({
        relativePath: `${dun}/ju-${ju}.json`,
        dun,
        ju,
        plateCount,
        content: {
          meta: {
            schemaVersion: PREVIEW_SCHEMA_VERSION,
            source: PREVIEW_SOURCE,
            generatedBy: PREVIEW_GENERATOR,
            generatedAt: null,
            dun,
            ju,
            plateCount,
            isPreview: true,
          },
          plates,
          diagnostics: {
            parserOk: parsed.ok === true,
            dryRunOk: dryRunReport.ok === true,
            errors: dryRunReport.errors.length,
            warnings: dryRunReport.warnings.length,
          },
          validation: {
            plateCount: plateCount === 60,
            everyPlateHas9Palaces: validatePreviewFileEveryPlateHas9Palaces(plates),
            requiredFieldsPresent: validatePreviewFileRequiredFieldsPresent(plates),
          },
        },
      });
    }
  }

  const stats = buildPreviewStats(files);
  const validationErrors = validatePreviewFiles(files);
  return {
    ok: validationErrors.length === 0,
    files,
    stats,
    dryRunReport,
    errors: validationErrors,
    warnings: [],
  };
}

export async function writeQimen1080PreviewFiles(parsed, options = {}) {
  const outputRootResult = resolveAllowedPreviewRoot(options.outputRoot, options);
  if (outputRootResult.ok !== true) {
    return {
      ok: false,
      outputRoot: outputRootResult.outputRoot,
      filesWritten: [],
      stats: createEmptyPreviewStats(),
      errors: outputRootResult.errors,
      warnings: [],
    };
  }

  const buildResult = buildQimen1080PreviewFiles(parsed);
  if (buildResult.ok !== true) {
    return {
      ok: false,
      outputRoot: outputRootResult.outputRoot,
      filesWritten: [],
      stats: buildResult.stats,
      dryRunReport: buildResult.dryRunReport,
      errors: buildResult.errors,
      warnings: buildResult.warnings,
    };
  }

  if (options.clean !== false) {
    await clearQimen1080PreviewOutput({ outputRoot: outputRootResult.outputRoot, allowedPreviewRoots: options.allowedPreviewRoots });
  }

  const filesWritten = [];
  for (const file of buildResult.files) {
    const filePath = path.join(outputRootResult.outputRoot, ...file.relativePath.split("/"));
    if (!isSameOrInside(filePath, outputRootResult.outputRoot)) {
      return {
        ok: false,
        outputRoot: outputRootResult.outputRoot,
        filesWritten,
        stats: buildResult.stats,
        dryRunReport: buildResult.dryRunReport,
        errors: [
          createQimen1080PreviewDiagnostic("PREVIEW_FILE_PATH_OUTSIDE_ROOT", "preview file path 不可離開 outputRoot", {
            filePath,
          }),
        ],
        warnings: [],
      };
    }

    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, `${JSON.stringify(file.content, null, 2)}\n`, "utf8");
    filesWritten.push({
      ...file,
      path: filePath,
    });
  }

  return {
    ok: true,
    outputRoot: outputRootResult.outputRoot,
    filesWritten,
    stats: buildResult.stats,
    dryRunReport: buildResult.dryRunReport,
    errors: [],
    warnings: [],
  };
}

export async function clearQimen1080PreviewOutput(options = {}) {
  const outputRootResult = resolveAllowedPreviewRoot(options.outputRoot, options);
  if (outputRootResult.ok !== true) {
    return {
      ok: false,
      outputRoot: outputRootResult.outputRoot,
      errors: outputRootResult.errors,
      warnings: [],
    };
  }

  await rm(outputRootResult.outputRoot, { recursive: true, force: true });
  return {
    ok: true,
    outputRoot: outputRootResult.outputRoot,
    errors: [],
    warnings: [],
  };
}

function buildPreviewPlateMap(objects, dun, ju) {
  const objectByHourPillar = new Map(
    objects
      .filter((object) => object.dun === dun && object.ju === ju)
      .map((object) => [object.hourPillar, object])
  );

  return Object.fromEntries(
    SEXAGENARY_CYCLE
      .filter((hourPillar) => objectByHourPillar.has(hourPillar))
      .map((hourPillar) => [hourPillar, objectByHourPillar.get(hourPillar)])
  );
}

function buildPreviewStats(files) {
  const byDunJu = {};
  for (const dun of ["yang", "yin"]) {
    for (let ju = 1; ju <= 9; ju += 1) {
      byDunJu[`${dun}-${ju}`] = files.find((file) => file.dun === dun && file.ju === ju)?.plateCount ?? 0;
    }
  }

  return {
    totalFiles: files.length,
    totalPlates: files.reduce((sum, file) => sum + file.plateCount, 0),
    yangPlates: files.filter((file) => file.dun === "yang").reduce((sum, file) => sum + file.plateCount, 0),
    yinPlates: files.filter((file) => file.dun === "yin").reduce((sum, file) => sum + file.plateCount, 0),
    byDunJu,
  };
}

function validatePreviewFiles(files) {
  const errors = [];
  if (files.length !== 18) {
    errors.push(createQimen1080PreviewDiagnostic("PREVIEW_FILE_COUNT_MISMATCH", "preview files 必須為 18 個", {
      expected: 18,
      actual: files.length,
    }));
  }

  for (const file of files) {
    if (file.plateCount !== 60) {
      errors.push(createQimen1080PreviewDiagnostic("PREVIEW_PLATE_COUNT_MISMATCH", "每個 preview file 必須有 60 盤", {
        relativePath: file.relativePath,
        expected: 60,
        actual: file.plateCount,
      }));
    }
    for (const [key, value] of Object.entries(file.content.validation)) {
      if (value !== true) {
        errors.push(createQimen1080PreviewDiagnostic("PREVIEW_FILE_VALIDATION_FAILED", `preview validation failed: ${key}`, {
          relativePath: file.relativePath,
        }));
      }
    }
  }

  return errors;
}

function validatePreviewFileEveryPlateHas9Palaces(plates) {
  return Object.values(plates).every((plate) => Object.keys(plate.palaces ?? {}).length === 9);
}

function validatePreviewFileRequiredFieldsPresent(plates) {
  return Object.values(plates).every((plate) => (
    Boolean(plate.id) &&
    Boolean(plate.dun) &&
    Number.isInteger(plate.ju) &&
    Boolean(plate.dayGroup) &&
    Boolean(plate.hourPillar) &&
    Boolean(plate.zhifuStar) &&
    Boolean(plate.zhishiDoor) &&
    Boolean(plate.raw?.header) &&
    Object.keys(plate.raw?.cells ?? {}).length === 9 &&
    Object.values(plate.palaces ?? {}).length === 9
  ));
}

function resolveAllowedPreviewRoot(outputRoot, options = {}) {
  const resolvedOutputRoot = path.resolve(
    outputRoot ? filePathFromOutputRoot(outputRoot) : DEFAULT_PREVIEW_ROOT
  );
  const allowedRoots = [
    DEFAULT_PREVIEW_ROOT,
    ...(options.allowedPreviewRoots ?? []).map((allowedRoot) => path.resolve(filePathFromOutputRoot(allowedRoot))),
  ];

  if (isSameOrInside(resolvedOutputRoot, FORMAL_QIMEN_PLATES_ROOT) || isSameOrInside(FORMAL_QIMEN_PLATES_ROOT, resolvedOutputRoot)) {
    return {
      ok: false,
      outputRoot: resolvedOutputRoot,
      errors: [
        createQimen1080PreviewDiagnostic("OUTPUT_ROOT_FORMAL_PLATES_FORBIDDEN", "outputRoot 不可指向 data/qimen/plates/**", {
          outputRoot: resolvedOutputRoot,
        }),
      ],
    };
  }

  if (!allowedRoots.some((allowedRoot) => isSameOrInside(resolvedOutputRoot, allowedRoot))) {
    return {
      ok: false,
      outputRoot: resolvedOutputRoot,
      errors: [
        createQimen1080PreviewDiagnostic("OUTPUT_ROOT_NOT_ALLOWED", "outputRoot 必須位於 preview allowlist 內", {
          outputRoot: resolvedOutputRoot,
          allowedRoots,
        }),
      ],
    };
  }

  return {
    ok: true,
    outputRoot: resolvedOutputRoot,
    errors: [],
  };
}

function filePathFromOutputRoot(outputRoot) {
  if (outputRoot instanceof URL) {
    return fileURLToPath(outputRoot);
  }
  return String(outputRoot);
}

function isSameOrInside(targetPath, parentPath) {
  const relativePath = path.relative(path.resolve(parentPath), path.resolve(targetPath));
  return relativePath === "" || (!relativePath.startsWith("..") && !path.isAbsolute(relativePath));
}

function createEmptyPreviewStats() {
  return {
    totalFiles: 0,
    totalPlates: 0,
    yangPlates: 0,
    yinPlates: 0,
    byDunJu: {},
  };
}

function createQimen1080PreviewDiagnostic(code, message, details = {}) {
  return {
    level: "error",
    code,
    message,
    ...details,
  };
}
