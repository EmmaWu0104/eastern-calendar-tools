import {
  calculateBaziFromSeparatedTimeInputs,
} from "./bazi.js";
import {
  CHART_CONTEXT_MODE_TRUE_SOLAR,
  CHART_CONTEXT_MODE_WATCH,
  validateChartTimeContext,
} from "./chartTimeContext.js";

/**
 * Validates the narrow contract consumed by the four-pillars time adapter.
 * This module consumes snapshots only; it neither resolves time zones nor
 * calculates true solar time.
 */
export function validateBaziChartTimeContext(context, solarTerms) {
  const contextValidation = validateChartTimeContext(context);
  if (!contextValidation.valid) {
    const errors = contextValidation.errors.map((error) => `context invalid: ${error}`);
    if (context?.astronomy?.comparisonInstantMs !== context?.civil?.instantMs
      || errors.some((error) => error.includes("comparisonInstantMs 必須等於 civil.instantMs"))) {
      errors.push("instant mismatch: astronomy.comparisonInstantMs 必須等於 civil.instantMs");
    }
    if (context?.mode === CHART_CONTEXT_MODE_TRUE_SOLAR && !isCompleteLocalParts(context?.trueSolar?.localParts)) {
      errors.push("true-solar local missing: true-solar mode 需要 trueSolar.localParts");
    }
    if (solarTerms !== undefined) errors.push(...getSolarTermsValidationErrors(solarTerms));
    return { valid: false, errors };
  }

  const errors = [];
  if (!Number.isFinite(context.astronomy.comparisonInstantMs)) {
    errors.push("context invalid: comparisonInstantMs 必須是有限數字");
  }
  if (context.astronomy.comparisonInstantMs !== context.civil.instantMs) {
    errors.push("instant mismatch: comparisonInstantMs 必須等於 civil.instantMs");
  }
  if (context.mode === CHART_CONTEXT_MODE_WATCH && !isCompleteLocalParts(context.civil.localParts)) {
    errors.push("context invalid: watch mode 需要 civil.localParts");
  }
  if (context.mode === CHART_CONTEXT_MODE_TRUE_SOLAR && !isCompleteLocalParts(context.trueSolar?.localParts)) {
    errors.push("true-solar local missing: true-solar mode 需要 trueSolar.localParts");
  }
  if (solarTerms !== undefined) errors.push(...getSolarTermsValidationErrors(solarTerms));
  return { valid: errors.length === 0, errors };
}

export function getBaziClockLocalParts(context) {
  assertValidContext(context);
  const parts = context.mode === CHART_CONTEXT_MODE_TRUE_SOLAR
    ? context.trueSolar.localParts
    : context.civil.localParts;
  return cloneLocalParts(parts);
}

export function getBaziSolarTermComparisonInstantMs(context) {
  assertValidContext(context);
  return context.astronomy.comparisonInstantMs;
}

/** Creates the explicit, non-string input contract used by the shared core. */
export function createBaziCalculationInputFromChartTimeContext(context) {
  assertValidContext(context);
  return Object.freeze({
    termComparisonInstantMs: context.astronomy.comparisonInstantMs,
    termLookupYear: context.civil.localParts.year,
    clockLocalParts: Object.freeze(getBaziClockLocalParts(context)),
  });
}

/**
 * Calculates four pillars from a ChartTimeContext without converting the
 * selected clock back to an instant.  Solar terms always compare civil's
 * global instant; day/hour always use the selected local clock.
 */
export function calculateBaziFromChartTimeContext(context, solarTerms) {
  assertValidContext(context);
  assertValidSolarTerms(solarTerms);
  const input = createBaziCalculationInputFromChartTimeContext(context);
  const result = calculateBaziFromSeparatedTimeInputs({ ...input, solarTerms });
  const debug = Object.freeze({
    termComparisonInstantIso: new Date(input.termComparisonInstantMs).toISOString(),
    clockMode: context.mode,
    clockLocalDateTime: formatLocalDateTime(input.clockLocalParts),
    effectiveDayDateKey: getEffectiveDayDateKey(input.clockLocalParts),
    dayBoundaryRule: "23:00",
  });
  return {
    ...result,
    termContext: {
      previousTerm: result.previousTerm,
      currentTerm: result.currentTerm,
      nextTerm: result.nextTerm,
      comparisonInstantMs: input.termComparisonInstantMs,
    },
    debug,
  };
}

/** Returns a locale-independent diagnostic snapshot; it does not mutate result. */
export function formatBaziChartTimeDebug(result) {
  if (!result || typeof result !== "object" || !result.debug || typeof result.debug !== "object") {
    throw new TypeError("result 必須是 adapter calculation result");
  }
  const debug = result.debug;
  return Object.freeze({
    mode: debug.clockMode,
    clockLocal: debug.clockLocalDateTime,
    clockBasis: debug.clockMode === CHART_CONTEXT_MODE_TRUE_SOLAR ? "true-solar" : "civil",
    termComparisonInstantIso: debug.termComparisonInstantIso,
    effectiveDayDateKey: debug.effectiveDayDateKey,
    dayBoundary: debug.dayBoundaryRule,
    yearPillar: result.yearPillar,
    monthPillar: result.monthPillar,
    dayPillar: result.dayPillar,
    hourPillar: result.hourPillar,
    currentSolarTerm: result.currentTerm?.name ?? null,
    nextSolarTerm: result.nextTerm?.name ?? null,
  });
}

function assertValidContext(context) {
  const validation = validateBaziChartTimeContext(context);
  if (!validation.valid) throw new TypeError(validation.errors.join("；"));
}

function assertValidSolarTerms(solarTerms) {
  const errors = getSolarTermsValidationErrors(solarTerms);
  if (errors.length > 0) throw new TypeError(errors.join("；"));
}

function getSolarTermsValidationErrors(solarTerms) {
  if (!Array.isArray(solarTerms) || solarTerms.length === 0) {
    return ["solar terms invalid: 必須是非空陣列"];
  }
  if (!solarTerms.every((term) => term && typeof term.name === "string" && term.name && Number.isFinite(term.timeMs))) {
    return ["solar terms invalid: 每筆節氣都需要 name 與有限 timeMs"];
  }
  return [];
}

function isCompleteLocalParts(parts) {
  if (!parts || typeof parts !== "object" || parts instanceof Date) return false;
  const names = ["year", "month", "day", "hour", "minute", "second", "millisecond"];
  if (!names.every((name) => Number.isInteger(parts[name]))) return false;
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second, parts.millisecond));
  return date.getUTCFullYear() === parts.year
    && date.getUTCMonth() === parts.month - 1
    && date.getUTCDate() === parts.day
    && date.getUTCHours() === parts.hour
    && date.getUTCMinutes() === parts.minute
    && date.getUTCSeconds() === parts.second
    && date.getUTCMilliseconds() === parts.millisecond;
}

function cloneLocalParts(parts) {
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
    millisecond: parts.millisecond,
  };
}

function formatLocalDateTime(parts) {
  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")} ${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}`;
}

function getEffectiveDayDateKey(parts) {
  const dayMs = Date.UTC(parts.year, parts.month - 1, parts.day) + (parts.hour >= 23 ? 86_400_000 : 0);
  const date = new Date(dayMs);
  return `${String(date.getUTCFullYear()).padStart(4, "0")}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}
