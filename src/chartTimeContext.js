export const CHART_CONTEXT_MODE_WATCH = "watch";
export const CHART_CONTEXT_MODE_TRUE_SOLAR = "true-solar";

const CONTEXT_VERSION = 1;
const MS_PER_DAY = 86_400_000;
const PART_NAMES = ["year", "month", "day", "hour", "minute", "second", "millisecond"];
const CONTEXT_MODES = new Set([
  CHART_CONTEXT_MODE_WATCH,
  CHART_CONTEXT_MODE_TRUE_SOLAR,
]);
const CONTEXT_SOURCES = new Set(["query", "device", "custom"]);
const DISAMBIGUATIONS = new Set([null, "earlier", "later"]);

/**
 * Creates an immutable snapshot of explicit civil and (when requested) true
 * solar clock data. It deliberately does not resolve DST or recalculate solar
 * time: callers must provide the already-resolved civil instant and result.
 */
export function createChartTimeContext(input = {}) {
  const mode = input.mode;
  const source = input.source;
  const civilInput = input.civil ?? {};
  const civilLocalParts = cloneLocalParts(civilInput.localParts, "civil.localParts");
  const timeZone = normalizeTimeZone(civilInput.timeZone);
  const instantMs = resolveCivilInstantMs(civilInput);
  const utcOffsetMinutes = civilInput.utcOffsetMinutes;
  const disambiguation = civilInput.disambiguation ?? null;

  assertContextMode(mode);
  assertContextSource(source);
  assertValidTimeZone(timeZone);
  assertValidUtcOffsetMinutes(utcOffsetMinutes);
  assertDisambiguation(disambiguation);

  const civil = {
    localParts: civilLocalParts,
    timeZone,
    utcOffsetMinutes,
    abbreviation: typeof civilInput.abbreviation === "string" ? civilInput.abbreviation : "",
    instantMs,
    instantIso: new Date(instantMs).toISOString(),
    disambiguation,
  };
  if (civilInput.instantIso !== undefined && civilInput.instantIso !== civil.instantIso) {
    throw new TypeError("civil.instantIso 必須由 civil.instantMs 衍生");
  }
  const location = cloneLocation(input.location);
  const trueSolar = mode === CHART_CONTEXT_MODE_TRUE_SOLAR
    ? createTrueSolarSnapshot(input.trueSolarResult, civilLocalParts)
    : null;

  if (mode === CHART_CONTEXT_MODE_WATCH && input.trueSolarResult != null) {
    throw new TypeError("watch mode 不接受 trueSolarResult");
  }
  if (mode === CHART_CONTEXT_MODE_TRUE_SOLAR && location === null) {
    throw new TypeError("true-solar mode 需要有效 location");
  }

  const compatibility = createCompatibilitySnapshot(
    input.compatibility,
    civilLocalParts,
    trueSolar?.localParts ?? null
  );
  const context = {
    version: CONTEXT_VERSION,
    mode,
    source,
    civil,
    location,
    trueSolar,
    astronomy: {
      comparisonInstantMs: instantMs,
      solarEventCivilDateKey: formatDateKey(civilLocalParts),
    },
    compatibility,
    metadata: {
      createdAtInstantMs: input.createdAtInstantMs ?? Date.now(),
    },
  };

  const validation = validateChartTimeContext(context);
  if (!validation.valid) {
    throw new TypeError(`無效的 ChartTimeContext：${validation.errors.join("；")}`);
  }
  return deepFreezePlainObject(context);
}

export function createWatchChartTimeContext(input = {}) {
  return createChartTimeContext({
    ...input,
    mode: CHART_CONTEXT_MODE_WATCH,
    trueSolarResult: undefined,
  });
}

export function createTrueSolarChartTimeContext(input = {}) {
  return createChartTimeContext({
    ...input,
    mode: CHART_CONTEXT_MODE_TRUE_SOLAR,
  });
}

export function validateChartTimeContext(context) {
  const errors = [];
  if (!isPlainObject(context)) {
    return { valid: false, errors: ["context 必須是 plain object"] };
  }
  if (context.version !== CONTEXT_VERSION) errors.push("version 必須是 1");
  if (!CONTEXT_MODES.has(context.mode)) errors.push("mode 無效");
  if (!CONTEXT_SOURCES.has(context.source)) errors.push("source 無效");

  const civil = context.civil;
  if (!isPlainObject(civil)) {
    errors.push("civil 必須存在");
  } else {
    if (!isValidLocalParts(civil.localParts)) errors.push("civil.localParts 無效");
    if (!isValidTimeZone(normalizeTimeZone(civil.timeZone))) errors.push("civil.timeZone 無效");
    if (!isValidUtcOffsetMinutes(civil.utcOffsetMinutes)) errors.push("civil.utcOffsetMinutes 無效");
    if (!Number.isFinite(civil.instantMs)) errors.push("civil.instantMs 無效");
    if (typeof civil.instantIso !== "string" || !Number.isFinite(civil.instantMs)
      || civil.instantIso !== new Date(civil.instantMs).toISOString()) {
      errors.push("civil.instantIso 必須由 instantMs 衍生");
    }
    if (!DISAMBIGUATIONS.has(civil.disambiguation)) errors.push("civil.disambiguation 無效");
    if (typeof civil.abbreviation !== "string") errors.push("civil.abbreviation 必須是字串");
  }

  if (!isValidLocation(context.location)) errors.push("location 無效");
  if (!isPlainObject(context.astronomy)) {
    errors.push("astronomy 必須存在");
  } else if (!civil || context.astronomy.comparisonInstantMs !== civil.instantMs) {
    errors.push("astronomy.comparisonInstantMs 必須等於 civil.instantMs");
  } else if (!isValidLocalParts(civil.localParts)
    || context.astronomy.solarEventCivilDateKey !== formatDateKey(civil.localParts)) {
    errors.push("astronomy.solarEventCivilDateKey 必須是 civil local date");
  }

  if (context.mode === CHART_CONTEXT_MODE_TRUE_SOLAR && !isValidTrueSolar(context.trueSolar)) {
    errors.push("true-solar mode 需要有效 trueSolar");
  }
  if (context.mode === CHART_CONTEXT_MODE_WATCH && context.trueSolar !== null) {
    errors.push("watch mode 的 trueSolar 必須是 null");
  }
  if (!isValidCompatibility(context.compatibility, context.mode, civil?.localParts, context.trueSolar?.localParts)) {
    errors.push("compatibility 無效");
  }
  if (!isPlainObject(context.metadata) || !Number.isFinite(context.metadata.createdAtInstantMs)) {
    errors.push("metadata.createdAtInstantMs 無效");
  }
  return { valid: errors.length === 0, errors };
}

export function cloneChartTimeContext(context) {
  const validation = validateChartTimeContext(context);
  if (!validation.valid) {
    throw new TypeError(`無效的 ChartTimeContext：${validation.errors.join("；")}`);
  }
  return deepFreezePlainObject(clonePlainValue(context));
}

export function getChartContextCivilInstantMs(context) {
  assertValidContext(context);
  return context.civil.instantMs;
}

export function getChartContextCivilLocalParts(context) {
  assertValidContext(context);
  return deepFreezePlainObject({ ...context.civil.localParts });
}

export function getChartContextTrueSolarLocalParts(context) {
  assertValidContext(context);
  return context.trueSolar === null ? null : deepFreezePlainObject({ ...context.trueSolar.localParts });
}

export function formatChartTimeContextDebug(context) {
  assertValidContext(context);
  return {
    mode: context.mode,
    source: context.source,
    timeZone: context.civil.timeZone,
    utcOffset: formatUtcOffset(context.civil.utcOffsetMinutes),
    civilLocal: formatLocalParts(context.civil.localParts),
    civilInstant: context.civil.instantIso,
    trueSolarLocal: context.trueSolar ? formatLocalParts(context.trueSolar.localParts) : null,
    coordinates: context.location
      ? `${context.location.latitude},${context.location.longitude}`
      : null,
    disambiguation: context.civil.disambiguation,
  };
}

function createTrueSolarSnapshot(result, civilLocalParts) {
  if (!isPlainObject(result)) {
    throw new TypeError("true-solar mode 需要 trueSolarResult");
  }
  const localParts = cloneLocalParts(result.trueSolarParts ?? result.localParts, "trueSolarResult.localParts");
  const longitudeCorrectionSeconds = result.longitudeCorrectionSeconds;
  const equationOfTimeSeconds = result.equationOfTimeSeconds;
  const correctionSeconds = result.totalCorrectionSeconds ?? result.correctionSeconds;
  assertFiniteNumber(longitudeCorrectionSeconds, "trueSolarResult.longitudeCorrectionSeconds");
  assertFiniteNumber(equationOfTimeSeconds, "trueSolarResult.equationOfTimeSeconds");
  assertFiniteNumber(correctionSeconds, "trueSolarResult.totalCorrectionSeconds");
  return {
    localParts,
    correctionSeconds,
    longitudeCorrectionSeconds,
    equationOfTimeSeconds,
    dayOffset: getDayOffset(civilLocalParts, localParts),
  };
}

function createCompatibilitySnapshot(compatibilityInput, civilLocalParts, trueSolarLocalParts) {
  const compatibility = compatibilityInput ?? {};
  if (!isPlainObject(compatibility)) throw new TypeError("compatibility 必須是 plain object");
  const watchLocalDateTimeValue = compatibility.watchLocalDateTimeValue ?? formatLocalDateTimeValue(civilLocalParts);
  const trueSolarLocalDateTimeValue = trueSolarLocalParts === null
    ? compatibility.trueSolarLocalDateTimeValue ?? null
    : compatibility.trueSolarLocalDateTimeValue ?? formatLocalDateTimeValue(trueSolarLocalParts);
  const taipeiLegacyDateTimeValue = compatibility.taipeiLegacyDateTimeValue ?? null;
  if (watchLocalDateTimeValue !== formatLocalDateTimeValue(civilLocalParts)) {
    throw new TypeError("compatibility.watchLocalDateTimeValue 必須符合 civil.localParts");
  }
  if (trueSolarLocalParts === null && trueSolarLocalDateTimeValue !== null) {
    throw new TypeError("watch mode 的 compatibility.trueSolarLocalDateTimeValue 必須是 null");
  }
  if (trueSolarLocalParts !== null
    && trueSolarLocalDateTimeValue !== formatLocalDateTimeValue(trueSolarLocalParts)) {
    throw new TypeError("compatibility.trueSolarLocalDateTimeValue 必須符合 trueSolar.localParts");
  }
  if (taipeiLegacyDateTimeValue !== null && !isValidLocalDateTimeValue(taipeiLegacyDateTimeValue)) {
    throw new TypeError("compatibility.taipeiLegacyDateTimeValue 必須是有效 local datetime 字串");
  }
  return { watchLocalDateTimeValue, trueSolarLocalDateTimeValue, taipeiLegacyDateTimeValue };
}

function resolveCivilInstantMs(civil) {
  if (civil.instant !== undefined && !(civil.instant instanceof Date)) {
    throw new TypeError("civil.instant 必須是有效 Date");
  }
  const dateInstantMs = civil.instant instanceof Date ? civil.instant.getTime() : undefined;
  const providedInstantMs = civil.instantMs;
  if (providedInstantMs !== undefined && !Number.isFinite(providedInstantMs)) {
    throw new TypeError("civil.instantMs 必須是有限數字");
  }
  if (dateInstantMs !== undefined && !Number.isFinite(dateInstantMs)) {
    throw new TypeError("civil.instant 必須是有效 Date");
  }
  if (dateInstantMs === undefined && providedInstantMs === undefined) {
    throw new TypeError("civil 必須提供 instant 或 instantMs");
  }
  if (dateInstantMs !== undefined && providedInstantMs !== undefined && dateInstantMs !== providedInstantMs) {
    throw new TypeError("civil.instant 與 civil.instantMs 必須一致");
  }
  return providedInstantMs ?? dateInstantMs;
}

function cloneLocalParts(parts, name) {
  if (!isValidLocalParts(parts)) throw new TypeError(`${name} 必須是完整有效的 local parts`);
  return Object.fromEntries(PART_NAMES.map((partName) => [partName, parts[partName]]));
}

function cloneLocation(location) {
  if (location == null) return null;
  if (!isValidLocation(location)) throw new TypeError("location 必須含有效 latitude 與 longitude");
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: location.accuracy ?? null,
  };
}

function isValidLocation(location) {
  return location === null || (isPlainObject(location)
    && Number.isFinite(location.latitude)
    && location.latitude >= -90
    && location.latitude <= 90
    && Number.isFinite(location.longitude)
    && location.longitude >= -180
    && location.longitude <= 180
    && (location.accuracy == null || (Number.isFinite(location.accuracy) && location.accuracy >= 0)));
}

function isValidTrueSolar(trueSolar) {
  return isPlainObject(trueSolar)
    && isValidLocalParts(trueSolar.localParts)
    && Number.isFinite(trueSolar.correctionSeconds)
    && Number.isFinite(trueSolar.longitudeCorrectionSeconds)
    && Number.isFinite(trueSolar.equationOfTimeSeconds)
    && Number.isInteger(trueSolar.dayOffset)
    && !Object.hasOwn(trueSolar, "instantMs")
    && !Object.hasOwn(trueSolar, "utcOffsetMinutes");
}

function isValidCompatibility(compatibility, mode, civilLocalParts, trueSolarLocalParts) {
  return isPlainObject(compatibility)
    && typeof compatibility.watchLocalDateTimeValue === "string"
    && isValidLocalParts(civilLocalParts)
    && compatibility.watchLocalDateTimeValue === formatLocalDateTimeValue(civilLocalParts)
    && (mode === CHART_CONTEXT_MODE_WATCH
      ? compatibility.trueSolarLocalDateTimeValue === null
      : isValidLocalParts(trueSolarLocalParts)
        && compatibility.trueSolarLocalDateTimeValue === formatLocalDateTimeValue(trueSolarLocalParts))
    && (compatibility.taipeiLegacyDateTimeValue === null
      || isValidLocalDateTimeValue(compatibility.taipeiLegacyDateTimeValue));
}

function isValidLocalParts(parts) {
  if (!isPlainObject(parts) || !PART_NAMES.every((partName) => Number.isInteger(parts[partName]))) {
    return false;
  }
  const date = new Date(Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond
  ));
  return date.getUTCFullYear() === parts.year
    && date.getUTCMonth() === parts.month - 1
    && date.getUTCDate() === parts.day
    && date.getUTCHours() === parts.hour
    && date.getUTCMinutes() === parts.minute
    && date.getUTCSeconds() === parts.second
    && date.getUTCMilliseconds() === parts.millisecond;
}

function isValidLocalDateTimeValue(value) {
  if (typeof value !== "string") return false;
  const match = /^(\d{4,})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/.exec(value);
  if (!match) return false;
  return isValidLocalParts({
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
    hour: Number(match[4]),
    minute: Number(match[5]),
    second: Number(match[6]),
    millisecond: 0,
  });
}

function getDayOffset(civilLocalParts, trueSolarLocalParts) {
  return Math.round((
    Date.UTC(trueSolarLocalParts.year, trueSolarLocalParts.month - 1, trueSolarLocalParts.day)
    - Date.UTC(civilLocalParts.year, civilLocalParts.month - 1, civilLocalParts.day)
  ) / MS_PER_DAY);
}

function normalizeTimeZone(timeZone) {
  return typeof timeZone === "string" ? timeZone.trim() : "";
}

function isValidTimeZone(timeZone) {
  if (!timeZone) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

function assertValidTimeZone(timeZone) {
  if (!isValidTimeZone(timeZone)) throw new TypeError("civil.timeZone 必須是有效 IANA 時區");
}

function assertContextMode(mode) {
  if (!CONTEXT_MODES.has(mode)) throw new TypeError("mode 必須是 watch 或 true-solar");
}

function assertContextSource(source) {
  if (!CONTEXT_SOURCES.has(source)) throw new TypeError("source 必須是 query、device 或 custom");
}

function assertDisambiguation(disambiguation) {
  if (!DISAMBIGUATIONS.has(disambiguation)) throw new TypeError("civil.disambiguation 必須是 null、earlier 或 later");
}

function assertFiniteNumber(value, name) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} 必須是有限數字`);
}

function isValidUtcOffsetMinutes(value) {
  return Number.isInteger(value) && value >= -840 && value <= 840;
}

function assertValidUtcOffsetMinutes(value) {
  if (!isValidUtcOffsetMinutes(value)) {
    throw new TypeError("civil.utcOffsetMinutes 必須是介於 -840 到 840 的整數分鐘");
  }
}

function assertValidContext(context) {
  const validation = validateChartTimeContext(context);
  if (!validation.valid) throw new TypeError(`無效的 ChartTimeContext：${validation.errors.join("；")}`);
}

function formatDateKey(parts) {
  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function formatLocalDateTimeValue(parts) {
  return `${formatDateKey(parts)}T${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}`;
}

function formatLocalParts(parts) {
  return `${formatDateKey(parts)} ${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}`;
}

function formatUtcOffset(offsetMinutes) {
  if (!isValidUtcOffsetMinutes(offsetMinutes)) return "UTC—";
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const value = Math.abs(offsetMinutes);
  return `UTC${sign}${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function deepFreezePlainObject(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  if (Array.isArray(value) || isPlainObject(value)) {
    for (const child of Object.values(value)) deepFreezePlainObject(child);
    Object.freeze(value);
  }
  return value;
}

function clonePlainValue(value) {
  if (Array.isArray(value)) return value.map(clonePlainValue);
  if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, clonePlainValue(child)]));
  return value;
}

function isPlainObject(value) {
  return value !== null
    && typeof value === "object"
    && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}
