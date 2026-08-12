import {
  calculateGuiDengHourBranches,
  calculateGuiDengWithSunTimesForHourRanges,
  calculateGuiDengWithSunTimesForLocalDate,
  DEFAULT_GUIDENG_LOCATION,
  getChineseHourBoundaryLocalParts,
  getMonthGeneralBySolarTermName,
} from "./guideng.js";
import { calculateSolarEvents } from "./solarEvents.js";
import {
  CHART_CONTEXT_MODE_TRUE_SOLAR,
  validateChartTimeContext,
} from "./chartTimeContext.js";
import {
  getBaziClockLocalParts,
} from "./baziChartTimeAdapter.js";
import { getEffectiveDateKeyFromLocalParts } from "./bazi.js";
import { SEXAGENARY_CYCLE } from "./ganzhi.js";
import {
  resolveLocalDateTimeInTimeZone,
  validateTimeZone,
} from "./timeZone.js";
import {
  resolveTrueSolarLocalDateTimeToInstant as resolveTrueSolarClockLocalDateTimeToInstant,
  TRUE_SOLAR_CLOCK_RESOLUTION_STATUS,
} from "./trueSolarClock.js";

export const GUIDENG_CHART_TIME_STATUS = Object.freeze({
  RESOLVED: "resolved",
  UNSUPPORTED: "unsupported",
});

const PHASE_BEFORE_SUNRISE = "before-sunrise";
const PHASE_DAYTIME = "daytime";
const PHASE_AFTER_SUNSET = "after-sunset";
const VALID_PHASES = new Set([
  PHASE_BEFORE_SUNRISE,
  PHASE_DAYTIME,
  PHASE_AFTER_SUNSET,
]);
const DAY_MS = 86_400_000;
const TRUE_SOLAR_BOUNDARY_TOLERANCE_MS = 1_000;
const TRUE_SOLAR_BOUNDARY_MAX_ITERATIONS = 12;

/**
 * Returns the local clock authority for the selected ChartTimeContext mode.
 * No local clock is converted back to an instant here.
 */
export function getGuiDengClockLocalParts(context) {
  assertValidContext(context);
  return Object.freeze({ ...getBaziClockLocalParts(context) });
}

export function getGuiDengDayPillar(baziResultOrInput) {
  const baziResult = unwrapBaziResult(baziResultOrInput);
  return typeof baziResult?.dayPillar === "string" ? baziResult.dayPillar : null;
}

export function getGuiDengDayStem(baziResultOrInput) {
  const dayPillar = getGuiDengDayPillar(baziResultOrInput);
  return dayPillar?.[0] ?? null;
}

export function getGuiDengMonthGeneral(baziResultOrInput) {
  const baziResult = unwrapBaziResult(baziResultOrInput);
  return getMonthGeneralBySolarTermName(baziResult?.currentTerm?.name);
}

/** Returns the legal civil date used to look up sunrise/sunset events. */
export function getGuiDengSolarEventDateKey(context) {
  assertValidContext(context);
  return context.astronomy.solarEventCivilDateKey;
}

/**
 * Inverts one true-solar wall-clock boundary into its actual civil instant.
 * The IANA local-time resolver is used only for an initial numerical guess;
 * every returned instant is validated by the existing true-solar calculator.
 */
export function resolveTrueSolarLocalDateTimeToInstant({
  targetTrueSolarLocalParts,
  context,
  toleranceMs = TRUE_SOLAR_BOUNDARY_TOLERANCE_MS,
  maxIterations = TRUE_SOLAR_BOUNDARY_MAX_ITERATIONS,
} = {}) {
  const contextValidation = validateChartTimeContext(context);
  if (!contextValidation.valid) {
    return {
      status: GUIDENG_CHART_TIME_STATUS.UNSUPPORTED,
      reason: `context invalid: ${contextValidation.errors.join("；")}`,
    };
  }
  if (context.mode !== CHART_CONTEXT_MODE_TRUE_SOLAR || !isValidLocation(context.location)) {
    return {
      status: GUIDENG_CHART_TIME_STATUS.UNSUPPORTED,
      reason: "true-solar boundary inversion 需要合法 true-solar context/location",
    };
  }

  const timeZone = context.civil.timeZone;
  const resolved = resolveTrueSolarClockLocalDateTimeToInstant({
    targetLocalParts: targetTrueSolarLocalParts,
    timeZone,
    location: context.location,
    initialInstantMs: context.civil.instantMs,
    toleranceMs,
    maxIterations,
  });
  if (resolved.status !== TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.RESOLVED) {
    return {
      status: GUIDENG_CHART_TIME_STATUS.UNSUPPORTED,
      reason: resolved.reason,
    };
  }

  // GuiDeng solarEvents still has a fixed-offset day contract. Preserve its
  // explicit DST-transition rejection while sharing the neutral solver.
  for (const localParts of [resolved.targetLocalParts, resolved.civilLocalParts]) {
    const dateStatus = resolveCivilDateOffset(formatDateKey(localParts), timeZone);
    if (dateStatus.status !== "resolved") {
      return dateStatus;
    }
  }
  return {
    status: GUIDENG_CHART_TIME_STATUS.RESOLVED,
    instantMs: resolved.instantMs,
    instant: new Date(resolved.instantMs),
    targetTrueSolarLocalParts: { ...resolved.targetLocalParts },
    civilLocalParts: { ...resolved.civilLocalParts },
    trueSolarLocalParts: { ...resolved.trueSolarLocalParts },
    errorMs: resolved.errorSeconds * 1_000,
    iterations: resolved.iterations,
  };
}

/**
 * Creates the narrow immutable input consumed by this adapter.  Bazi and
 * month-general values are supplied by the caller; this module never
 * recalculates a day pillar or searches the solar-term array.
 */
export function createGuiDengCalculationInput({ context, baziResult } = {}) {
  const validation = validateGuiDengChartTimeInput({ context, baziResult });
  if (!validation.valid) {
    throw new TypeError(validation.errors.join("；"));
  }

  const clockLocalParts = getGuiDengClockLocalParts(context);
  const dayPillar = getGuiDengDayPillar(baziResult);
  const currentTerm = baziResult.currentTerm;
  const location = context.location
    ? { ...context.location }
    : { ...DEFAULT_GUIDENG_LOCATION };

  return deepFreeze({
    mode: context.mode,
    source: context.source,
    timeZone: context.civil.timeZone,
    queryInstantMs: context.civil.instantMs,
    queryInstantIso: context.civil.instantIso,
    civilLocalParts: { ...context.civil.localParts },
    clockLocalParts,
    trueSolarLocalParts: context.trueSolar ? { ...context.trueSolar.localParts } : null,
    effectiveDayDateKey: getEffectiveDateKeyFromLocalParts(clockLocalParts),
    dayPillar,
    dayStem: dayPillar[0],
    currentTerm: { ...currentTerm },
    monthGeneral: getGuiDengMonthGeneral(baziResult),
    solarEventCivilDateKey: getGuiDengSolarEventDateKey(context),
    location,
    locationSource: context.location ? "context" : "legacy-default",
    queryUtcOffsetMinutes: context.civil.utcOffsetMinutes,
  });
}

/**
 * Resolves sunrise/sunset phase by actual event instants.  Sunrise is
 * inclusive for daytime; sunset is inclusive for after-sunset/night.
 */
export function resolveGuiDengSolarEventPhase(input, maybeSolarEvents) {
  const queryInstantMs = typeof input === "number" ? input : input?.queryInstantMs;
  const solarEvents = typeof input === "number" ? maybeSolarEvents : input?.solarEvents ?? input;
  const sunriseInstantMs = solarEvents?.sunriseInstantMs;
  const sunsetInstantMs = solarEvents?.sunsetInstantMs;
  const nextSunriseInstantMs = solarEvents?.nextSunriseInstantMs;

  if (![queryInstantMs, sunriseInstantMs, sunsetInstantMs, nextSunriseInstantMs].every(Number.isFinite)) {
    throw new TypeError("query 與 sunrise/sunset/next sunrise 必須是有限 epoch milliseconds");
  }
  if (!(sunriseInstantMs < sunsetInstantMs && sunsetInstantMs < nextSunriseInstantMs)) {
    throw new RangeError("sunrise、sunset、next sunrise 的順序無效");
  }

  if (queryInstantMs < sunriseInstantMs) return PHASE_BEFORE_SUNRISE;
  if (queryInstantMs < sunsetInstantMs) return PHASE_DAYTIME;
  return PHASE_AFTER_SUNSET;
}

/**
 * Calculates the complete pure GuiDeng snapshot.  Solar event calculation is
 * injectable for deterministic tests, while the production default is the
 * existing solarEvents implementation.
 */
export async function calculateGuiDengFromChartTimeContext({
  context,
  baziResult,
  solarEventCalculator = calculateSolarEvents,
} = {}) {
  const input = createGuiDengCalculationInput({ context, baziResult });
  if (typeof solarEventCalculator !== "function") {
    throw new TypeError("solarEventCalculator 必須是函式");
  }

  const eventResult = await calculateSolarEventsForCivilDate(input, solarEventCalculator);
  if (eventResult.status !== GUIDENG_CHART_TIME_STATUS.RESOLVED) {
    return createUnsupportedResult(input, eventResult.reason);
  }

  const phase = resolveGuiDengSolarEventPhase({
    queryInstantMs: input.queryInstantMs,
    solarEvents: eventResult.solarEvents,
  });
  const activeGuiRen = phase === PHASE_DAYTIME ? "陽貴" : "陰貴";
  let guiDeng;
  if (input.mode === CHART_CONTEXT_MODE_TRUE_SOLAR) {
    const hourRanges = resolveTrueSolarGuiDengHourRanges({ input, context });
    if (hourRanges.status !== GUIDENG_CHART_TIME_STATUS.RESOLVED) {
      return createUnsupportedResult(input, hourRanges.reason);
    }
    guiDeng = calculateGuiDengWithSunTimesForHourRanges({
      dayStem: input.dayStem,
      monthGeneral: input.monthGeneral,
      sunrise: new Date(eventResult.solarEvents.sunriseInstantMs),
      sunset: new Date(eventResult.solarEvents.sunsetInstantMs),
      nextDaySunrise: new Date(eventResult.solarEvents.nextSunriseInstantMs),
      yangHourRange: hourRanges.ranges.yang,
      yinHourRange: hourRanges.ranges.yin,
      timezone: input.timeZone,
    });
  } else {
    guiDeng = calculateGuiDengWithSunTimesForLocalDate({
      dateLocalParts: input.clockLocalParts,
      dayStem: input.dayStem,
      monthGeneral: input.monthGeneral,
      sunrise: new Date(eventResult.solarEvents.sunriseInstantMs),
      sunset: new Date(eventResult.solarEvents.sunsetInstantMs),
      nextDaySunrise: new Date(eventResult.solarEvents.nextSunriseInstantMs),
      timezone: input.timeZone,
    });
  }

  if (!guiDeng) {
    return createUnsupportedResult(input, "無法依現有登貴規則建立日出／日落時間窗");
  }

  const result = {
    status: GUIDENG_CHART_TIME_STATUS.RESOLVED,
    mode: input.mode,
    source: input.source,
    queryInstantMs: input.queryInstantMs,
    civilLocalParts: { ...input.civilLocalParts },
    clockLocalParts: { ...input.clockLocalParts },
    trueSolarLocalParts: input.trueSolarLocalParts ? { ...input.trueSolarLocalParts } : null,
    effectiveDayDateKey: input.effectiveDayDateKey,
    dayPillar: input.dayPillar,
    dayStem: input.dayStem,
    currentTerm: { ...input.currentTerm },
    monthGeneral: input.monthGeneral,
    solarEventCivilDateKey: input.solarEventCivilDateKey,
    solarEvents: eventResult.solarEvents,
    phase,
    activeGuiRen,
    guiDeng: cloneValue(guiDeng),
    dengGuiBranches: getDengGuiBranches(guiDeng),
    debug: null,
  };
  result.debug = formatGuiDengChartTimeDebug(result);
  return deepFreeze(result);
}

function resolveTrueSolarGuiDengHourRanges({ input, context }) {
  const hourBranches = calculateGuiDengHourBranches(input.dayStem, input.monthGeneral);
  if (!hourBranches) {
    return {
      status: GUIDENG_CHART_TIME_STATUS.UNSUPPORTED,
      reason: "無法依既有登貴 mapping 解析 true-solar 時辰",
    };
  }

  const ranges = {};
  for (const [type, hourBranch] of [
    ["yang", hourBranches.yang.hourBranch],
    ["yin", hourBranches.yin.hourBranch],
  ]) {
    const boundaries = getChineseHourBoundaryLocalParts(input.clockLocalParts, hourBranch);
    if (!boundaries) {
      return {
        status: GUIDENG_CHART_TIME_STATUS.UNSUPPORTED,
        reason: `無法建立 ${type} ${hourBranch}時 true-solar wall-clock boundary`,
      };
    }

    const start = resolveTrueSolarLocalDateTimeToInstant({
      targetTrueSolarLocalParts: boundaries.start,
      context,
    });
    const end = resolveTrueSolarLocalDateTimeToInstant({
      targetTrueSolarLocalParts: boundaries.end,
      context,
    });
    if (start.status !== GUIDENG_CHART_TIME_STATUS.RESOLVED || end.status !== GUIDENG_CHART_TIME_STATUS.RESOLVED) {
      return {
        status: GUIDENG_CHART_TIME_STATUS.UNSUPPORTED,
        reason: `${type} ${hourBranch}時 true-solar boundary unsupported：${start.reason ?? end.reason}`,
      };
    }
    if (start.instantMs >= end.instantMs) {
      return {
        status: GUIDENG_CHART_TIME_STATUS.UNSUPPORTED,
        reason: `${type} ${hourBranch}時 true-solar actual instant 順序無效`,
      };
    }
    ranges[type] = {
      start: start.instant,
      end: end.instant,
    };
  }

  return {
    status: GUIDENG_CHART_TIME_STATUS.RESOLVED,
    ranges,
  };
}

export function validateGuiDengChartTimeInput({ context, baziResult } = {}) {
  const errors = [];
  const contextValidation = validateChartTimeContext(context);
  if (!contextValidation.valid) {
    errors.push(...contextValidation.errors.map((error) => `context invalid: ${error}`));
  }

  if (!isPlainObject(baziResult)) {
    errors.push("baziResult invalid: 必須是 plain object");
    return { valid: false, errors };
  }

  if (typeof baziResult.dayPillar !== "string" || !SEXAGENARY_CYCLE.includes(baziResult.dayPillar)) {
    errors.push("baziResult invalid: dayPillar 必須是有效六十甲子日柱");
  }

  const currentTerm = baziResult.currentTerm;
  if (!isPlainObject(currentTerm) || typeof currentTerm.name !== "string" || !currentTerm.name) {
    errors.push("baziResult invalid: currentTerm 需要有效 name");
  } else if (!Number.isFinite(currentTerm.timeMs)) {
    errors.push("baziResult invalid: currentTerm.timeMs 必須是有限數字");
  }

  if (getMonthGeneralBySolarTermName(currentTerm?.name) === null) {
    errors.push("baziResult invalid: currentTerm.name 無法解析月將");
  }

  if (context?.civil && !Number.isFinite(context.civil.instantMs)) {
    errors.push("context invalid: query instant 必須是有限 epoch milliseconds");
  }
  if (context?.civil && !validateTimeZone(context.civil.timeZone)) {
    errors.push("context invalid: civil.timeZone 無效");
  }
  if (context?.civil && !Number.isFinite(context.civil.utcOffsetMinutes)) {
    errors.push("context invalid: civil.utcOffsetMinutes 無效");
  }
  if (context?.mode === CHART_CONTEXT_MODE_TRUE_SOLAR && !context.location) {
    errors.push("true-solar mode 需要 location");
  }

  const location = context?.location ?? DEFAULT_GUIDENG_LOCATION;
  if (!isValidLocation(location)) {
    errors.push("location invalid: latitude/longitude 超出範圍");
  }

  return { valid: errors.length === 0, errors };
}

/** Returns locale-independent, instant-based diagnostics. */
export function formatGuiDengChartTimeDebug(result) {
  if (!isPlainObject(result)) {
    throw new TypeError("result 必須是 GuiDeng adapter calculation result");
  }

  const solarEvents = result.solarEvents;
  return Object.freeze({
    mode: result.mode ?? null,
    source: result.source ?? null,
    queryInstant: toIso(result.queryInstantMs),
    civilLocal: formatLocalDateTime(result.civilLocalParts ?? null),
    trueSolarLocal: formatLocalDateTime(result.trueSolarLocalParts ?? null),
    effectiveDay: result.effectiveDayDateKey ?? null,
    dayPillar: result.dayPillar ?? null,
    dayStem: result.dayStem ?? null,
    currentTerm: result.currentTerm?.name ?? null,
    monthGeneral: result.monthGeneral ?? null,
    solarEventCivilDate: result.solarEventCivilDateKey ?? null,
    sunriseInstant: toIso(solarEvents?.sunriseInstantMs),
    sunsetInstant: toIso(solarEvents?.sunsetInstantMs),
    nextSunriseInstant: toIso(solarEvents?.nextSunriseInstantMs),
    phase: VALID_PHASES.has(result.phase) ? result.phase : null,
    activeGuiRen: result.activeGuiRen ?? null,
    dengGuiBranches: Array.isArray(result.dengGuiBranches) ? [...result.dengGuiBranches] : [],
    reason: result.reason ?? null,
  });
}

async function calculateSolarEventsForCivilDate(input, solarEventCalculator) {
  const dateKey = input.solarEventCivilDateKey;
  const nextDateKey = addDaysToDateKey(dateKey, 1);
  const todayOffset = resolveCivilDateOffset(dateKey, input.timeZone);
  const nextOffset = resolveCivilDateOffset(nextDateKey, input.timeZone);
  if (todayOffset.status !== "resolved" || nextOffset.status !== "resolved") {
    return {
      status: GUIDENG_CHART_TIME_STATUS.UNSUPPORTED,
      reason: todayOffset.reason ?? nextOffset.reason,
    };
  }

  let today;
  let next;
  try {
    [today, next] = await Promise.all([
      solarEventCalculator({
        date: createUtcDateCarrier(dateKey),
        latitude: input.location.latitude,
        longitude: input.location.longitude,
        utcOffsetMinutes: todayOffset.utcOffsetMinutes,
        useUtcComponents: true,
      }),
      solarEventCalculator({
        date: createUtcDateCarrier(nextDateKey),
        latitude: input.location.latitude,
        longitude: input.location.longitude,
        utcOffsetMinutes: nextOffset.utcOffsetMinutes,
        useUtcComponents: true,
      }),
    ]);
  } catch (error) {
    return {
      status: GUIDENG_CHART_TIME_STATUS.UNSUPPORTED,
      reason: `solar events 計算失敗：${error instanceof Error ? error.message : String(error)}`,
    };
  }

  if (today?.daylightStatus !== "normal" || next?.daylightStatus !== "normal") {
    return {
      status: GUIDENG_CHART_TIME_STATUS.UNSUPPORTED,
      reason: "目前日期缺少可靠日出／日落資料",
    };
  }

  const sunriseInstantMs = getDateMs(today.sunrise);
  const sunsetInstantMs = getDateMs(today.sunset);
  const nextSunriseInstantMs = getDateMs(next.sunrise);
  if (![sunriseInstantMs, sunsetInstantMs, nextSunriseInstantMs].every(Number.isFinite)
    || !(sunriseInstantMs < sunsetInstantMs && sunsetInstantMs < nextSunriseInstantMs)) {
    return {
      status: GUIDENG_CHART_TIME_STATUS.UNSUPPORTED,
      reason: "solar events 缺少有效且有序的 sunrise/sunset/next sunrise instant",
    };
  }

  return {
    status: GUIDENG_CHART_TIME_STATUS.RESOLVED,
    solarEvents: {
      civilDateKey: dateKey,
      sunriseInstantMs,
      sunsetInstantMs,
      nextSunriseInstantMs,
    },
  };
}

function createUnsupportedResult(input, reason) {
  const result = {
    status: GUIDENG_CHART_TIME_STATUS.UNSUPPORTED,
    mode: input.mode,
    source: input.source,
    queryInstantMs: input.queryInstantMs,
    civilLocalParts: { ...input.civilLocalParts },
    clockLocalParts: { ...input.clockLocalParts },
    trueSolarLocalParts: input.trueSolarLocalParts ? { ...input.trueSolarLocalParts } : null,
    effectiveDayDateKey: input.effectiveDayDateKey,
    dayPillar: input.dayPillar,
    dayStem: input.dayStem,
    currentTerm: { ...input.currentTerm },
    monthGeneral: input.monthGeneral,
    solarEventCivilDateKey: input.solarEventCivilDateKey,
    solarEvents: null,
    phase: null,
    activeGuiRen: null,
    guiDeng: null,
    dengGuiBranches: [],
    reason,
    debug: null,
  };
  result.debug = formatGuiDengChartTimeDebug(result);
  return deepFreeze(result);
}

function resolveCivilDateOffset(dateKey, timeZone) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const sampleHours = [0, 6, 12, 18, 23];
  const resolutions = sampleHours.map((hour) => resolveLocalDateTimeInTimeZone({
    localParts: { year, month, day, hour, minute: 0, second: hour === 23 ? 59 : 0 },
    timeZone,
    disambiguation: "earlier",
  }));
  if (resolutions.some((resolution) => resolution.status !== "resolved")) {
    return { status: "unsupported", reason: `無法解析 ${dateKey} 的 legal civil local date` };
  }

  const offsets = new Set(resolutions.map((resolution) => resolution.utcOffsetMinutes));
  if (offsets.size > 1) {
    return {
      status: "unsupported",
      reason: `${dateKey} 為 DST transition date；現有 fixed-offset solarEvents contract 不保證事件精度`,
    };
  }
  return { status: "resolved", utcOffsetMinutes: resolutions[0].utcOffsetMinutes };
}

function getDengGuiBranches(guiDeng) {
  return [...new Set(
    (Array.isArray(guiDeng?.entries) ? guiDeng.entries : [])
      .filter((entry) => entry?.isAvailable && typeof entry.hourBranch === "string")
      .map((entry) => entry.hourBranch)
  )];
}

function unwrapBaziResult(value) {
  return value?.baziResult ?? value;
}

function assertValidContext(context) {
  const validation = validateChartTimeContext(context);
  if (!validation.valid) throw new TypeError(validation.errors.join("；"));
}

function addDaysToDateKey(dateKey, days) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return `${String(date.getUTCFullYear()).padStart(4, "0")}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function formatDateKey(parts) {
  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function createUtcDateCarrier(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

function getDateMs(value) {
  return value instanceof Date && Number.isFinite(value.getTime()) ? value.getTime() : NaN;
}

function toIso(value) {
  return Number.isFinite(value) ? new Date(value).toISOString() : null;
}

function formatLocalDateTime(parts) {
  if (!parts || !Number.isInteger(parts.year)) return null;
  const date = `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
  const time = `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}`;
  return parts.millisecond ? `${date}T${time}.${String(parts.millisecond).padStart(3, "0")}` : `${date}T${time}`;
}

function isValidLocation(location) {
  return location && Number.isFinite(location.latitude) && location.latitude >= -90 && location.latitude <= 90
    && Number.isFinite(location.longitude) && location.longitude >= -180 && location.longitude <= 180;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function deepFreeze(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value)) deepFreeze(child);
  return Object.freeze(value);
}

function cloneValue(value) {
  if (value instanceof Date) return new Date(value.getTime());
  if (Array.isArray(value)) return value.map(cloneValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, cloneValue(child)]));
  }
  return value;
}
