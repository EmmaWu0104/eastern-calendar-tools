const QIMEN_1080_DRY_RUN_PALACE_KEYS = Object.freeze([
  "kan",
  "gen",
  "zhen",
  "xun",
  "li",
  "kun",
  "dui",
  "qian",
  "center",
]);

const QIMEN_1080_DRY_RUN_OUTER_PALACE_KEYS = Object.freeze([
  "kan",
  "gen",
  "zhen",
  "xun",
  "li",
  "kun",
  "dui",
  "qian",
]);

const QIMEN_1080_DRY_RUN_SAMPLE_DEFINITIONS = Object.freeze([
  Object.freeze({
    key: "yangJu1JiajiJiazi",
    label: "陽遁一局甲己日甲子",
    dun: "yang",
    ju: 1,
    dayGroup: "甲己日",
    hourPillar: "甲子",
  }),
  Object.freeze({
    key: "yangJu9WuguiGuihai",
    label: "陽遁九局戊癸日癸亥",
    dun: "yang",
    ju: 9,
    dayGroup: "戊癸日",
    hourPillar: "癸亥",
  }),
  Object.freeze({
    key: "yinJu1JiajiJiazi",
    label: "陰遁一局甲己日甲子",
    dun: "yin",
    ju: 1,
    dayGroup: "甲己日",
    hourPillar: "甲子",
  }),
  Object.freeze({
    key: "yinJu9WuguiGuihai",
    label: "陰遁九局戊癸日癸亥",
    dun: "yin",
    ju: 9,
    dayGroup: "戊癸日",
    hourPillar: "癸亥",
  }),
]);

export function convertQimen1080ParsedToDryRun(parsed) {
  const prerequisiteErrors = validateQimen1080ParsedPrerequisites(parsed);
  if (prerequisiteErrors.length > 0) {
    return {
      ok: false,
      objects: [],
      errors: prerequisiteErrors,
      warnings: [],
    };
  }

  return {
    ok: true,
    objects: parsed.plates.map((plate) => normalizeQimen1080Plate(plate)),
    errors: [],
    warnings: [],
  };
}

export function buildQimen1080DryRunReport(parsed) {
  const conversion = convertQimen1080ParsedToDryRun(parsed);
  const stats = buildQimen1080DryRunStats(conversion.objects);
  const samples = buildQimen1080DryRunSamples(conversion.objects);
  const validation = validateQimen1080DryRunObjects(conversion.objects, samples);
  const errors = [
    ...conversion.errors,
    ...validation.errors,
  ];
  const warnings = [
    ...conversion.warnings,
    ...validation.warnings,
  ];

  return {
    ok: conversion.ok && validation.ok && errors.length === 0 && warnings.length === 0,
    stats,
    samples,
    validation: validation.checks,
    errors,
    warnings,
  };
}

function validateQimen1080ParsedPrerequisites(parsed) {
  const errors = [];

  if (!parsed || typeof parsed !== "object") {
    errors.push(createQimen1080DryRunDiagnostic("INVALID_PARSED_RESULT", "parsed 必須是 object"));
    return errors;
  }

  if (parsed.ok !== true) {
    errors.push(createQimen1080DryRunDiagnostic("PARSER_NOT_OK", "parser result ok 必須是 true"));
  }

  if (!Array.isArray(parsed.plates)) {
    errors.push(createQimen1080DryRunDiagnostic("INVALID_PARSED_PLATES", "parsed.plates 必須是 array"));
  }

  if (!Array.isArray(parsed.errors)) {
    errors.push(createQimen1080DryRunDiagnostic("INVALID_PARSED_ERRORS", "parsed.errors 必須是 array"));
  } else if (parsed.errors.length !== 0) {
    errors.push(createQimen1080DryRunDiagnostic("PARSER_ERRORS_PRESENT", "parser errors 必須為 0", {
      actual: parsed.errors.length,
    }));
  }

  if (!Array.isArray(parsed.warnings)) {
    errors.push(createQimen1080DryRunDiagnostic("INVALID_PARSED_WARNINGS", "parsed.warnings 必須是 array"));
  } else if (parsed.warnings.length !== 0) {
    errors.push(createQimen1080DryRunDiagnostic("PARSER_WARNINGS_PRESENT", "parser warnings 必須為 0", {
      actual: parsed.warnings.length,
    }));
  }

  if ((parsed.stats?.errors ?? 0) !== 0) {
    errors.push(createQimen1080DryRunDiagnostic("PARSER_STATS_ERRORS_PRESENT", "parser stats.errors 必須為 0", {
      actual: parsed.stats?.errors,
    }));
  }

  if ((parsed.stats?.warnings ?? 0) !== 0) {
    errors.push(createQimen1080DryRunDiagnostic("PARSER_STATS_WARNINGS_PRESENT", "parser stats.warnings 必須為 0", {
      actual: parsed.stats?.warnings,
    }));
  }

  return errors;
}

function normalizeQimen1080Plate(plate) {
  const palaces = {};
  const rawCells = {};

  for (const palaceKey of QIMEN_1080_DRY_RUN_PALACE_KEYS) {
    const palace = plate.palaces?.[palaceKey] ?? {};
    palaces[palaceKey] = {
      heavenStem: palace.heavenStem ?? null,
      star: palace.star ?? null,
      earthStem: palace.earthStem ?? null,
      door: palace.door ?? null,
      deity: palace.deity ?? null,
    };
    rawCells[palaceKey] = palace.raw ?? null;
  }

  const dun = plate.dunType ?? null;
  return {
    id: `${dun}-${plate.ju}-${plate.dayGroup}-${plate.hourPillar}`,
    dun,
    ju: plate.ju ?? null,
    dayGroup: plate.dayGroup ?? null,
    hourPillar: plate.hourPillar ?? null,
    zhifuStar: plate.zhiFuStar ?? null,
    zhishiDoor: plate.zhiShiDoor ?? null,
    palaces,
    raw: {
      header: plate.rawHeader ?? null,
      cells: rawCells,
    },
  };
}

function buildQimen1080DryRunStats(objects) {
  const byDunJu = {};
  for (const dun of ["yang", "yin"]) {
    for (let ju = 1; ju <= 9; ju += 1) {
      byDunJu[`${dun}-${ju}`] = 0;
    }
  }

  for (const object of objects) {
    const key = `${object.dun}-${object.ju}`;
    byDunJu[key] = (byDunJu[key] ?? 0) + 1;
  }

  return {
    totalObjects: objects.length,
    yangObjects: objects.filter((object) => object.dun === "yang").length,
    yinObjects: objects.filter((object) => object.dun === "yin").length,
    byDunJu,
  };
}

function buildQimen1080DryRunSamples(objects) {
  return Object.fromEntries(QIMEN_1080_DRY_RUN_SAMPLE_DEFINITIONS.map((definition) => [
    definition.key,
    {
      label: definition.label,
      object: objects.find((object) => (
        object.dun === definition.dun &&
        object.ju === definition.ju &&
        object.dayGroup === definition.dayGroup &&
        object.hourPillar === definition.hourPillar
      )) ?? null,
    },
  ]));
}

function validateQimen1080DryRunObjects(objects, samples) {
  const checks = {
    totalObjects1080: {
      ok: objects.length === 1080,
      expected: 1080,
      actual: objects.length,
    },
    dunCounts: validateQimen1080DryRunDunCounts(objects),
    byDunJuCounts: validateQimen1080DryRunJuCounts(objects),
    everyPlateHas9Palaces: validateQimen1080DryRunPalaceCounts(objects),
    requiredFieldsPresent: validateQimen1080DryRunRequiredFields(objects),
    zhifuStarFound: validateQimen1080DryRunZhifuStar(objects),
    zhishiDoorFound: validateQimen1080DryRunZhishiDoor(objects),
    samplesPresent: validateQimen1080DryRunSamples(samples),
  };
  const failedChecks = Object.entries(checks).filter(([, check]) => check.ok !== true);

  return {
    ok: failedChecks.length === 0,
    checks,
    errors: failedChecks.map(([key, check]) => createQimen1080DryRunDiagnostic("VALIDATION_FAILED", `dry-run validation failed: ${key}`, {
      check,
    })),
    warnings: [],
  };
}

function validateQimen1080DryRunDunCounts(objects) {
  const yangObjects = objects.filter((object) => object.dun === "yang").length;
  const yinObjects = objects.filter((object) => object.dun === "yin").length;
  return {
    ok: yangObjects === 540 && yinObjects === 540,
    expected: {
      yang: 540,
      yin: 540,
    },
    actual: {
      yang: yangObjects,
      yin: yinObjects,
    },
  };
}

function validateQimen1080DryRunJuCounts(objects) {
  const failures = [];
  for (const dun of ["yang", "yin"]) {
    for (let ju = 1; ju <= 9; ju += 1) {
      const count = objects.filter((object) => object.dun === dun && object.ju === ju).length;
      if (count !== 60) {
        failures.push({ dun, ju, expected: 60, actual: count });
      }
    }
  }

  return {
    ok: failures.length === 0,
    failures,
  };
}

function validateQimen1080DryRunPalaceCounts(objects) {
  const failures = objects
    .filter((object) => QIMEN_1080_DRY_RUN_PALACE_KEYS.some((palaceKey) => !object.palaces?.[palaceKey]))
    .map((object) => ({
      id: object.id,
      missingPalaces: QIMEN_1080_DRY_RUN_PALACE_KEYS.filter((palaceKey) => !object.palaces?.[palaceKey]),
    }));

  return {
    ok: failures.length === 0,
    failures,
  };
}

function validateQimen1080DryRunRequiredFields(objects) {
  const failures = [];

  for (const object of objects) {
    for (const field of ["id", "dun", "ju", "dayGroup", "hourPillar", "zhifuStar", "zhishiDoor", "palaces", "raw"]) {
      if (object[field] === null || object[field] === undefined || object[field] === "") {
        failures.push({ id: object.id, field });
      }
    }

    for (const palaceKey of QIMEN_1080_DRY_RUN_OUTER_PALACE_KEYS) {
      const palace = object.palaces?.[palaceKey];
      for (const field of ["heavenStem", "star", "earthStem", "door", "deity"]) {
        if (palace?.[field] === null || palace?.[field] === undefined || palace?.[field] === "") {
          failures.push({ id: object.id, palaceKey, field });
        }
      }
    }

    const center = object.palaces?.center;
    for (const field of ["heavenStem", "star", "earthStem"]) {
      if (center?.[field] === null || center?.[field] === undefined || center?.[field] === "") {
        failures.push({ id: object.id, palaceKey: "center", field });
      }
    }
  }

  return {
    ok: failures.length === 0,
    failures,
  };
}

function validateQimen1080DryRunZhifuStar(objects) {
  const failures = objects
    .filter((object) => !Object.values(object.palaces ?? {}).some((palace) => palace.star === object.zhifuStar))
    .map((object) => ({ id: object.id, zhifuStar: object.zhifuStar }));

  return {
    ok: failures.length === 0,
    failures,
  };
}

function validateQimen1080DryRunZhishiDoor(objects) {
  const failures = objects
    .filter((object) => !Object.values(object.palaces ?? {}).some((palace) => palace.door === object.zhishiDoor))
    .map((object) => ({ id: object.id, zhishiDoor: object.zhishiDoor }));

  return {
    ok: failures.length === 0,
    failures,
  };
}

function validateQimen1080DryRunSamples(samples) {
  const missingSamples = QIMEN_1080_DRY_RUN_SAMPLE_DEFINITIONS
    .filter((definition) => !samples?.[definition.key]?.object)
    .map((definition) => ({
      key: definition.key,
      label: definition.label,
    }));

  return {
    ok: missingSamples.length === 0,
    missingSamples,
  };
}

function createQimen1080DryRunDiagnostic(code, message, details = {}) {
  return {
    level: "error",
    code,
    message,
    ...details,
  };
}
