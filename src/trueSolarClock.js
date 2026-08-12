import { calculateTrueSolarTime } from "./trueSolarTime.js";
import {
  getZonedDateTimeParts,
  resolveLocalDateTimeInTimeZone,
  validateTimeZone,
} from "./timeZone.js";

export const TRUE_SOLAR_CLOCK_RESOLUTION_STATUS = Object.freeze({
  RESOLVED: "resolved",
  UNSUPPORTED: "unsupported",
  INVALID: "invalid",
});

export const TRUE_SOLAR_CLOCK_DEFAULT_TOLERANCE_MS = 1_000;
export const TRUE_SOLAR_CLOCK_DEFAULT_MAX_ITERATIONS = 12;
export const TRUE_SOLAR_CLOCK_MAX_ITERATIONS = 32;
export const TRUE_SOLAR_CLOCK_MAX_SEARCH_DISTANCE_MS = 48 * 60 * 60 * 1_000;

/**
 * Inverts a true-solar wall clock into its actual instant. The target remains
 * wall-clock parts throughout; only instantMs is an actual timeline value.
 */
export function resolveTrueSolarLocalDateTimeToInstant({
  targetLocalParts,
  timeZone,
  location,
  initialInstantMs = null,
  toleranceMs = TRUE_SOLAR_CLOCK_DEFAULT_TOLERANCE_MS,
  maxIterations = TRUE_SOLAR_CLOCK_DEFAULT_MAX_ITERATIONS,
  maxSearchDistanceMs = TRUE_SOLAR_CLOCK_MAX_SEARCH_DISTANCE_MS,
} = {}) {
  const target = normalizeLocalDateTimeParts(targetLocalParts);
  if (!target) {
    return invalid("targetLocalParts invalid");
  }
  if (!validateTimeZone(timeZone)) {
    return invalid("timeZone invalid");
  }
  if (!isValidLocation(location)) {
    return invalid("location invalid");
  }

  const tolerance = Number.isFinite(toleranceMs) && toleranceMs >= 0
    ? toleranceMs
    : TRUE_SOLAR_CLOCK_DEFAULT_TOLERANCE_MS;
  const iterations = Number.isInteger(maxIterations) && maxIterations > 0
    ? Math.min(maxIterations, TRUE_SOLAR_CLOCK_MAX_ITERATIONS)
    : TRUE_SOLAR_CLOCK_DEFAULT_MAX_ITERATIONS;
  const searchDistance = Number.isFinite(maxSearchDistanceMs) && maxSearchDistanceMs > 0
    ? Math.min(maxSearchDistanceMs, TRUE_SOLAR_CLOCK_MAX_SEARCH_DISTANCE_MS)
    : TRUE_SOLAR_CLOCK_MAX_SEARCH_DISTANCE_MS;
  const initialResolution = resolveLocalDateTimeInTimeZone({
    localParts: target,
    timeZone,
    disambiguation: "earlier",
  });
  if (initialResolution.status !== "resolved") {
    return unsupported(`無法建立 true-solar initial guess：${initialResolution.status}`);
  }
  if (initialResolution.candidates?.length > 1) {
    return unsupported("true-solar target 落在 DST ambiguous local time");
  }

  const targetWallMs = localDateTimeToWallMs(target);
  const civilGuessMs = initialResolution.instant.getTime() + target.millisecond;
  let guessMs = Number.isFinite(initialInstantMs)
    && Math.abs(initialInstantMs - civilGuessMs) <= searchDistance
    ? Math.round(initialInstantMs)
    : civilGuessMs;
  let lastProbe = null;

  for (let iteration = 1; iteration <= iterations; iteration += 1) {
    if (Math.abs(guessMs - civilGuessMs) > searchDistance) {
      return unsupported(`true-solar inversion 超出 ${searchDistance}ms 搜尋範圍`, lastProbe);
    }

    const probe = getZonedDateTimeParts(new Date(guessMs), timeZone);
    if (!probe) {
      return unsupported("無法取得 inversion guess 的 legal civil local parts", lastProbe);
    }
    const civilLocalParts = {
      ...probe.localParts,
      millisecond: getMillisecondsPart(guessMs),
    };

    let trueSolarResult;
    try {
      trueSolarResult = calculateTrueSolarTime({
        date: createUtcDateFromLocalParts(civilLocalParts),
        latitude: location.latitude,
        longitude: location.longitude,
        utcOffsetMinutes: probe.utcOffsetMinutes,
        useUtcComponents: true,
      });
    } catch (error) {
      return unsupported(
        `true-solar inversion 計算失敗：${error instanceof Error ? error.message : String(error)}`,
        lastProbe,
      );
    }

    const trueSolarLocalParts = { ...trueSolarResult.trueSolarParts };
    const errorMs = targetWallMs - localDateTimeToWallMs(trueSolarLocalParts);
    lastProbe = {
      iteration,
      instantMs: guessMs,
      civilLocalParts,
      trueSolarLocalParts,
      errorMs,
    };
    if (Math.abs(errorMs) <= tolerance) {
      return Object.freeze({
        status: TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.RESOLVED,
        instantMs: guessMs,
        targetLocalParts: Object.freeze({ ...target }),
        civilLocalParts: Object.freeze({ ...civilLocalParts }),
        trueSolarLocalParts: Object.freeze({ ...trueSolarLocalParts }),
        errorSeconds: errorMs / 1_000,
        iterations: iteration,
      });
    }

    guessMs = Math.round(guessMs + errorMs);
  }

  return unsupported(
    `true-solar inversion 未在 ${iterations} 次內收斂（誤差 ${lastProbe?.errorMs ?? "unknown"}ms）`,
    lastProbe,
  );
}

function invalid(reason) {
  return Object.freeze({ status: TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.INVALID, reason });
}

function unsupported(reason, lastProbe = null) {
  return Object.freeze({
    status: TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.UNSUPPORTED,
    reason,
    lastProbe: lastProbe ? Object.freeze({ ...lastProbe }) : null,
  });
}

function normalizeLocalDateTimeParts(value) {
  if (!value || !Number.isInteger(value.year) || !Number.isInteger(value.month)
    || !Number.isInteger(value.day) || !Number.isInteger(value.hour)
    || !Number.isInteger(value.minute) || !Number.isInteger(value.second)) {
    return null;
  }
  const millisecond = value.millisecond ?? 0;
  if (!Number.isInteger(millisecond) || millisecond < 0 || millisecond > 999) {
    return null;
  }
  const date = createUtcDateFromLocalParts({ ...value, millisecond });
  if (date.getUTCFullYear() !== value.year || date.getUTCMonth() !== value.month - 1
    || date.getUTCDate() !== value.day || date.getUTCHours() !== value.hour
    || date.getUTCMinutes() !== value.minute || date.getUTCSeconds() !== value.second
    || date.getUTCMilliseconds() !== millisecond) {
    return null;
  }
  return {
    year: value.year,
    month: value.month,
    day: value.day,
    hour: value.hour,
    minute: value.minute,
    second: value.second,
    millisecond,
  };
}

function createUtcDateFromLocalParts(parts) {
  return new Date(Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond ?? 0,
  ));
}

function localDateTimeToWallMs(parts) {
  return createUtcDateFromLocalParts(parts).getTime();
}

function getMillisecondsPart(instantMs) {
  return ((instantMs % 1_000) + 1_000) % 1_000;
}

function isValidLocation(location) {
  return location && Number.isFinite(location.latitude)
    && location.latitude >= -90 && location.latitude <= 90
    && Number.isFinite(location.longitude)
    && location.longitude >= -180 && location.longitude <= 180;
}
