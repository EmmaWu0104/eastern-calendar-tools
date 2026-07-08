import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildQimen1080FormalPlateAdapterReport } from "./qimen1080FormalPlateAdapter.js";

const PROJECT_ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const DEFAULT_FORMAL_CANDIDATE_ROOT = path.join(PROJECT_ROOT, "tmp", "qimen1080-formal-candidate");
const DATA_QIMEN_ROOT = path.join(PROJECT_ROOT, "data", "qimen");
const FORMAL_QIMEN_PLATES_ROOT = path.join(DATA_QIMEN_ROOT, "plates");

export function buildQimen1080FormalCandidateFiles(parsed) {
  const adapterReport = buildQimen1080FormalPlateAdapterReport(parsed);
  const preconditionErrors = validateFormalCandidatePreconditions(adapterReport);
  if (preconditionErrors.length > 0) {
    return {
      ok: false,
      files: [],
      stats: adapterReport.stats ?? createEmptyFormalCandidateStats(),
      validation: adapterReport.validation ?? { allFilesValid: false, fileResults: [] },
      adapterReport,
      errors: preconditionErrors,
      warnings: adapterReport.warnings ?? [],
    };
  }

  return {
    ok: true,
    files: adapterReport.files,
    stats: adapterReport.stats,
    validation: adapterReport.validation,
    adapterReport,
    errors: [],
    warnings: [],
  };
}

export async function writeQimen1080FormalCandidateFiles(parsed, options = {}) {
  const outputRootResult = resolveAllowedFormalCandidateRoot(options.outputRoot, options);
  if (outputRootResult.ok !== true) {
    return {
      ok: false,
      outputRoot: outputRootResult.outputRoot,
      filesWritten: [],
      stats: createEmptyFormalCandidateStats(),
      validation: { allFilesValid: false, fileResults: [] },
      errors: outputRootResult.errors,
      warnings: [],
    };
  }

  const buildResult = buildQimen1080FormalCandidateFiles(parsed);
  if (buildResult.ok !== true) {
    return {
      ok: false,
      outputRoot: outputRootResult.outputRoot,
      filesWritten: [],
      stats: buildResult.stats,
      validation: buildResult.validation,
      adapterReport: buildResult.adapterReport,
      errors: buildResult.errors,
      warnings: buildResult.warnings,
    };
  }

  if (options.clean !== false) {
    await clearQimen1080FormalCandidateOutput({
      outputRoot: outputRootResult.outputRoot,
      allowedFormalCandidateRoots: options.allowedFormalCandidateRoots,
    });
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
        validation: buildResult.validation,
        adapterReport: buildResult.adapterReport,
        errors: [
          createQimen1080FormalCandidateDiagnostic("FORMAL_CANDIDATE_FILE_PATH_OUTSIDE_ROOT", "formal candidate file path 不可離開 outputRoot", {
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
    validation: buildResult.validation,
    adapterReport: buildResult.adapterReport,
    errors: [],
    warnings: [],
  };
}

export async function clearQimen1080FormalCandidateOutput(options = {}) {
  const outputRootResult = resolveAllowedFormalCandidateRoot(options.outputRoot, options);
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

function validateFormalCandidatePreconditions(adapterReport) {
  const errors = [];

  if (!adapterReport || typeof adapterReport !== "object") {
    errors.push(createQimen1080FormalCandidateDiagnostic("INVALID_ADAPTER_REPORT", "adapter report 必須是 object"));
    return errors;
  }

  if (adapterReport.ok !== true) {
    errors.push(createQimen1080FormalCandidateDiagnostic("ADAPTER_REPORT_NOT_OK", "adapter report 必須 ok"));
  }

  if ((adapterReport.errors?.length ?? 0) !== 0) {
    errors.push(createQimen1080FormalCandidateDiagnostic("ADAPTER_ERRORS_PRESENT", "adapter report errors 必須為 0", {
      actual: adapterReport.errors?.length,
    }));
  }

  if ((adapterReport.warnings?.length ?? 0) !== 0) {
    errors.push(createQimen1080FormalCandidateDiagnostic("ADAPTER_WARNINGS_PRESENT", "adapter report warnings 必須為 0", {
      actual: adapterReport.warnings?.length,
    }));
  }

  if (adapterReport.stats?.totalFiles !== 18) {
    errors.push(createQimen1080FormalCandidateDiagnostic("ADAPTER_TOTAL_FILES_MISMATCH", "adapter stats.totalFiles 必須為 18", {
      actual: adapterReport.stats?.totalFiles,
    }));
  }

  if (adapterReport.stats?.totalPlates !== 1080) {
    errors.push(createQimen1080FormalCandidateDiagnostic("ADAPTER_TOTAL_PLATES_MISMATCH", "adapter stats.totalPlates 必須為 1080", {
      actual: adapterReport.stats?.totalPlates,
    }));
  }

  if (adapterReport.stats?.yangPlates !== 540 || adapterReport.stats?.yinPlates !== 540) {
    errors.push(createQimen1080FormalCandidateDiagnostic("ADAPTER_DUN_PLATES_MISMATCH", "adapter 陽遁 / 陰遁盤數必須各 540", {
      actual: {
        yang: adapterReport.stats?.yangPlates,
        yin: adapterReport.stats?.yinPlates,
      },
    }));
  }

  for (const dunType of ["yang", "yin"]) {
    for (let ju = 1; ju <= 9; ju += 1) {
      const key = `${dunType}-${ju}`;
      if (adapterReport.stats?.byDunJu?.[key] !== 60) {
        errors.push(createQimen1080FormalCandidateDiagnostic("ADAPTER_JU_PLATES_MISMATCH", "adapter 每局必須 60 盤", {
          key,
          actual: adapterReport.stats?.byDunJu?.[key],
        }));
      }
    }
  }

  if (adapterReport.validation?.allFilesValid !== true) {
    errors.push(createQimen1080FormalCandidateDiagnostic("ADAPTER_VALIDATION_NOT_OK", "adapter validation.allFilesValid 必須為 true"));
  }

  if (!Array.isArray(adapterReport.validation?.fileResults) || adapterReport.validation.fileResults.length !== 18) {
    errors.push(createQimen1080FormalCandidateDiagnostic("ADAPTER_FILE_RESULTS_MISMATCH", "adapter validation.fileResults 必須為 18 筆", {
      actual: adapterReport.validation?.fileResults?.length,
    }));
  } else {
    for (const fileResult of adapterReport.validation.fileResults) {
      if (fileResult.ok !== true) {
        errors.push(createQimen1080FormalCandidateDiagnostic("ADAPTER_FILE_RESULT_NOT_OK", "adapter fileResult 必須全部 ok", {
          relativePath: fileResult.relativePath,
        }));
      }
    }
  }

  return errors;
}

function resolveAllowedFormalCandidateRoot(outputRoot, options = {}) {
  const resolvedOutputRoot = path.resolve(
    outputRoot ? filePathFromOutputRoot(outputRoot) : DEFAULT_FORMAL_CANDIDATE_ROOT
  );
  const allowedRoots = [
    DEFAULT_FORMAL_CANDIDATE_ROOT,
    ...(options.allowedFormalCandidateRoots ?? []).map((allowedRoot) => path.resolve(filePathFromOutputRoot(allowedRoot))),
  ];

  if (resolvedOutputRoot === PROJECT_ROOT) {
    return createRejectedOutputRoot("OUTPUT_ROOT_PROJECT_ROOT_FORBIDDEN", "outputRoot 不可指向 project root", resolvedOutputRoot, allowedRoots);
  }

  if (resolvedOutputRoot === DATA_QIMEN_ROOT) {
    return createRejectedOutputRoot("OUTPUT_ROOT_DATA_QIMEN_FORBIDDEN", "outputRoot 不可指向 data/qimen", resolvedOutputRoot, allowedRoots);
  }

  if (isSameOrInside(resolvedOutputRoot, FORMAL_QIMEN_PLATES_ROOT) || isSameOrInside(FORMAL_QIMEN_PLATES_ROOT, resolvedOutputRoot)) {
    return createRejectedOutputRoot("OUTPUT_ROOT_FORMAL_PLATES_FORBIDDEN", "outputRoot 不可指向 data/qimen/plates/**", resolvedOutputRoot, allowedRoots);
  }

  if (!allowedRoots.some((allowedRoot) => isSameOrInside(resolvedOutputRoot, allowedRoot))) {
    return createRejectedOutputRoot("OUTPUT_ROOT_NOT_ALLOWED", "outputRoot 必須位於 formal candidate allowlist 內", resolvedOutputRoot, allowedRoots);
  }

  return {
    ok: true,
    outputRoot: resolvedOutputRoot,
    errors: [],
  };
}

function createRejectedOutputRoot(code, message, outputRoot, allowedRoots) {
  return {
    ok: false,
    outputRoot,
    errors: [
      createQimen1080FormalCandidateDiagnostic(code, message, {
        outputRoot,
        allowedRoots,
      }),
    ],
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

function createEmptyFormalCandidateStats() {
  return {
    totalFiles: 0,
    totalPlates: 0,
    yangPlates: 0,
    yinPlates: 0,
    byDunJu: {},
  };
}

function createQimen1080FormalCandidateDiagnostic(code, message, details = {}) {
  return {
    level: "error",
    code,
    message,
    ...details,
  };
}
