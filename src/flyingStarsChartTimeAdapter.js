import { calculateBaziFromChartTimeContext } from "./baziChartTimeAdapter.js";
import {
  CHART_CONTEXT_MODE_TRUE_SOLAR,
  validateChartTimeContext,
} from "./chartTimeContext.js";
import { calculateAllFlyingStarChartsFromInputs } from "./flyingStars.js";

const REQUIRED_PILLAR_FIELDS = Object.freeze([
  "yearPillar",
  "monthPillar",
  "dayPillar",
  "hourPillar",
]);

/**
 * Validates the narrow, already-resolved input consumed by the flying-star
 * adapter.  Time-zone resolution, true-solar conversion, and all four-pillar
 * formulas remain outside this module.
 */
export function validateFlyingStarsChartTimeInput(contextOrInput, baziResult) {
  const input = normalizeContextAndBaziResult(contextOrInput, baziResult);
  const errors = [];
  const contextValidation = validateChartTimeContext(input.context);

  if (!contextValidation.valid) {
    errors.push(...contextValidation.errors.map((error) => `context invalid: ${error}`));
  }

  if (!isPlainObject(input.baziResult)) {
    errors.push("baziResult invalid: 必須是 plain object");
    return { valid: false, errors };
  }

  if (!Number.isInteger(input.baziResult.meta?.ganzhiYear)) {
    errors.push("effective solar year invalid: baziResult.meta.ganzhiYear 必須是整數");
  }

  for (const field of REQUIRED_PILLAR_FIELDS) {
    if (!isPillar(input.baziResult[field])) {
      errors.push(`baziResult invalid: ${field} 必須是兩字干支`);
    }
  }

  if (!isBranch(input.baziResult.monthBranch)) {
    errors.push("baziResult invalid: monthBranch 必須是單一地支");
  }

  const currentSolarTerm = input.baziResult.currentTerm;
  if (!isPlainObject(currentSolarTerm)
    || typeof currentSolarTerm.name !== "string"
    || currentSolarTerm.name.length === 0
    || !Number.isFinite(currentSolarTerm.timeMs)) {
    errors.push("baziResult invalid: currentSolarTerm 需要 name 與有限 timeMs");
  }

  return { valid: errors.length === 0, errors };
}

/** Creates an immutable, context-safe input for the shared flying-star core. */
export function createFlyingStarsCalculationInput(contextOrInput, baziResult) {
  const input = normalizeContextAndBaziResult(contextOrInput, baziResult);
  assertValidInput(input.context, input.baziResult);

  const clockLocalParts = input.context.mode === CHART_CONTEXT_MODE_TRUE_SOLAR
    ? input.context.trueSolar.localParts
    : input.context.civil.localParts;
  const effectiveSolarYear = input.baziResult.meta.ganzhiYear;

  return deepFreeze({
    mode: input.context.mode,
    source: input.context.source,
    civilInstantMs: input.context.civil.instantMs,
    civilInstantIso: input.context.civil.instantIso,
    termComparisonInstantMs: input.context.astronomy.comparisonInstantMs,
    clockLocalParts: { ...clockLocalParts },
    effectiveSolarYear,
    periodYear: effectiveSolarYear,
    solarYear: effectiveSolarYear,
    yearPillar: input.baziResult.yearPillar,
    monthPillar: input.baziResult.monthPillar,
    monthBranch: input.baziResult.monthBranch,
    dayPillar: input.baziResult.dayPillar,
    hourPillar: input.baziResult.hourPillar,
    currentSolarTerm: { ...input.baziResult.currentTerm },
  });
}

/** Calculates all five layers from an existing ChartTimeContext Bazi result. */
export function calculateFlyingStarsFromBaziResult(contextOrInput, baziResult) {
  const input = normalizeContextAndBaziResult(contextOrInput, baziResult);
  const calculationInput = createFlyingStarsCalculationInput(input.context, input.baziResult);
  const charts = calculateAllFlyingStarChartsFromInputs(calculationInput);
  const result = {
    ...charts,
    calculationInput,
  };

  return {
    ...result,
    debug: formatFlyingStarsChartTimeDebug(result),
  };
}

/** Calculates Bazi from ChartTimeContext, then feeds that result to the pure adapter. */
export function calculateFlyingStarsFromChartTimeContext(context, solarTerms) {
  const baziResult = calculateBaziFromChartTimeContext(context, solarTerms);
  return calculateFlyingStarsFromBaziResult(context, baziResult);
}

/** Returns a locale-independent diagnostic snapshot for tests and debugging. */
export function formatFlyingStarsChartTimeDebug(result) {
  if (!isPlainObject(result) || !isPlainObject(result.calculationInput)) {
    throw new TypeError("result 必須是 flying-stars adapter calculation result");
  }

  const input = result.calculationInput;
  const clockLocal = formatLocalDateTime(input.clockLocalParts);
  return Object.freeze({
    mode: input.mode,
    source: input.source,
    civilInstant: input.civilInstantIso,
    clockLocal,
    clockBasis: input.mode === CHART_CONTEXT_MODE_TRUE_SOLAR ? "true-solar" : "civil",
    effectiveSolarYear: input.effectiveSolarYear,
    yearPillar: input.yearPillar,
    monthPillar: input.monthPillar,
    dayPillar: input.dayPillar,
    hourPillar: input.hourPillar,
    currentSolarTerm: input.currentSolarTerm.name,
    period: result.period?.period ?? null,
    annualCenter: result.annual?.centerStar ?? null,
    monthlyCenter: result.monthly?.centerStar ?? null,
    dailyCenter: result.daily?.centerStar ?? null,
    hourlyCenter: result.hourly?.centerStar ?? null,
  });
}

function normalizeContextAndBaziResult(contextOrInput, baziResult) {
  if (baziResult === undefined
    && isPlainObject(contextOrInput)
    && Object.hasOwn(contextOrInput, "context")
    && Object.hasOwn(contextOrInput, "baziResult")) {
    return {
      context: contextOrInput.context,
      baziResult: contextOrInput.baziResult,
    };
  }

  return { context: contextOrInput, baziResult };
}

function assertValidInput(context, baziResult) {
  const validation = validateFlyingStarsChartTimeInput(context, baziResult);
  if (!validation.valid) {
    throw new TypeError(validation.errors.join("；"));
  }
}

function isPillar(value) {
  return typeof value === "string" && Array.from(value).length === 2;
}

function isBranch(value) {
  return typeof value === "string" && Array.from(value).length === 1;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function deepFreeze(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) {
    return value;
  }

  for (const child of Object.values(value)) {
    deepFreeze(child);
  }
  return Object.freeze(value);
}

function formatLocalDateTime(parts) {
  const date = `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
  const time = `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}`;
  return parts.millisecond
    ? `${date} ${time}.${String(parts.millisecond).padStart(3, "0")}`
    : `${date} ${time}`;
}
