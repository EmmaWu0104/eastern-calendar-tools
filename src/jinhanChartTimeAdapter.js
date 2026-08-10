import {
  getBaziClockLocalParts,
} from "./baziChartTimeAdapter.js";
import {
  CHART_CONTEXT_MODE_TRUE_SOLAR,
  CHART_CONTEXT_MODE_WATCH,
  validateChartTimeContext,
} from "./chartTimeContext.js";
import {
  getHourBranchIndex,
  SEXAGENARY_CYCLE,
} from "./ganzhi.js";
import {
  createJinhanBoundarySwitch,
  JINHAN_DUN_TYPE_MODE,
  JINHAN_DUN_TYPE_STATUS,
  resolveJinhanDunTypeFromLocalParts,
} from "./jinhanDunType.js";
import {
  getJinhanBlackYellowHours,
  getJinhanDeitiesByPalace,
  getJinhanYujingDayPan,
} from "./jinhanYujing.js";
import { getZonedDateTimeParts } from "./timeZone.js";
import { calculateTrueSolarTime } from "./trueSolarTime.js";

const JINHAN_MODES = new Set([CHART_CONTEXT_MODE_WATCH, CHART_CONTEXT_MODE_TRUE_SOLAR]);
const CHINESE_HOUR_LABELS = Object.freeze([
  Object.freeze({ index: 1, branch: "子", timeRange: "23 ~ 01", startHour: 23 }),
  Object.freeze({ index: 2, branch: "丑", timeRange: "01 ~ 03", startHour: 1 }),
  Object.freeze({ index: 3, branch: "寅", timeRange: "03 ~ 05", startHour: 3 }),
  Object.freeze({ index: 4, branch: "卯", timeRange: "05 ~ 07", startHour: 5 }),
  Object.freeze({ index: 5, branch: "辰", timeRange: "07 ~ 09", startHour: 7 }),
  Object.freeze({ index: 6, branch: "巳", timeRange: "09 ~ 11", startHour: 9 }),
  Object.freeze({ index: 7, branch: "午", timeRange: "11 ~ 13", startHour: 11 }),
  Object.freeze({ index: 8, branch: "未", timeRange: "13 ~ 15", startHour: 13 }),
  Object.freeze({ index: 9, branch: "申", timeRange: "15 ~ 17", startHour: 15 }),
  Object.freeze({ index: 10, branch: "酉", timeRange: "17 ~ 19", startHour: 17 }),
  Object.freeze({ index: 11, branch: "戌", timeRange: "19 ~ 21", startHour: 19 }),
  Object.freeze({ index: 12, branch: "亥", timeRange: "21 ~ 23", startHour: 21 }),
]);

/**
 * Returns the Jinhan clock authority for a validated ChartTimeContext.
 * Watch uses civil local parts; true-solar uses the context's true-solar
 * local parts. No Date/string parsing is involved.
 */
export function getJinhanClockLocalParts(context) {
  assertContext(context);
  return cloneLocalParts(getBaziClockLocalParts(context));
}

/**
 * Converts a solar-term instant into the selected mode's local clock.
 * True-solar mode recalculates the correction for this term instant; it never
 * reuses the query instant's trueSolar.localParts or equation of time.
 */
export function getJinhanTermLocalParts({ context, term, mode = context?.mode } = {}) {
  assertContext(context);
  assertTerm(term);
  if (!JINHAN_MODES.has(mode)) throw new TypeError("mode 必須是 watch 或 true-solar");

  const civil = getZonedDateTimeParts(new Date(term.timeMs), context.civil.timeZone);
  if (!civil) throw new TypeError("term.timeMs 無法轉成 context.civil.timeZone local parts");
  const civilLocalParts = withMillisecond(civil.localParts, term.timeMs);
  if (mode === CHART_CONTEXT_MODE_WATCH) {
    return {
      mode,
      localParts: civilLocalParts,
      civilLocalParts,
      timeZone: civil.timeZone,
      utcOffsetMinutes: civil.utcOffsetMinutes,
      abbreviation: civil.abbreviation,
      termTimeMs: term.timeMs,
      equationOfTimeSeconds: null,
      longitudeCorrectionSeconds: null,
      totalCorrectionSeconds: null,
    };
  }

  if (!context.location) {
    throw new TypeError("true-solar mode 需要 context.location");
  }
  const carrier = createUtcCarrierFromLocalParts(civilLocalParts);
  const trueSolarResult = calculateTrueSolarTime({
    date: carrier,
    latitude: context.location.latitude,
    longitude: context.location.longitude,
    utcOffsetMinutes: civil.utcOffsetMinutes,
    useUtcComponents: true,
  });
  return {
    mode,
    localParts: cloneLocalParts(trueSolarResult.trueSolarParts),
    civilLocalParts,
    timeZone: civil.timeZone,
    utcOffsetMinutes: civil.utcOffsetMinutes,
    abbreviation: civil.abbreviation,
    termTimeMs: term.timeMs,
    equationOfTimeSeconds: trueSolarResult.equationOfTimeSeconds,
    longitudeCorrectionSeconds: trueSolarResult.longitudeCorrectionSeconds,
    totalCorrectionSeconds: trueSolarResult.totalCorrectionSeconds,
  };
}

/** Resolves v1 winter/summer switches from the selected mode's local clocks. */
export function resolveJinhanDunTypeFromChartTimeContext({ context, solarTerms } = {}) {
  assertContext(context);
  const solarTermErrors = getSolarTermsValidationErrors(solarTerms);
  if (solarTermErrors.length > 0) {
    return createUnsupportedDunTypeResult(solarTermErrors.join("；"));
  }

  const queryLocalParts = getJinhanClockLocalParts(context);
  const year = queryLocalParts.year;
  const boundaryTerms = {
    prePreviousWinter: findBoundaryTerm(solarTerms, year - 2, "冬至"),
    previousSummer: findBoundaryTerm(solarTerms, year - 1, "夏至"),
    previousWinter: findBoundaryTerm(solarTerms, year - 1, "冬至"),
    currentSummer: findBoundaryTerm(solarTerms, year, "夏至"),
    currentWinter: findBoundaryTerm(solarTerms, year, "冬至"),
  };
  const boundaries = Object.fromEntries(
    Object.entries(boundaryTerms).map(([key, term]) => {
      if (!term) return [key, null];
      const termLocal = getJinhanTermLocalParts({ context, term });
      return [key, {
        ...createJinhanBoundarySwitch({
          boundary: term.name,
          termLocalParts: termLocal.localParts,
          termTimeMs: term.timeMs,
        }),
        termEotSeconds: termLocal.equationOfTimeSeconds,
      }];
    })
  );
  const result = resolveJinhanDunTypeFromLocalParts({
    queryLocalParts,
    ...boundaries,
  });
  const boundary = Object.values(boundaries).find((candidate) =>
    candidate?.boundary === result.boundary && candidate.switchDate === result.switchEffectiveDay
  ) ?? null;
  return {
    ...result,
    boundarySnapshot: boundary,
    queryLocalParts,
  };
}

/** Creates the complete, pure input snapshot consumed by the adapter. */
export function createJinhanCalculationInput({ context, baziResult, solarTerms } = {}) {
  const validation = validateJinhanChartTimeInput({ context, baziResult, solarTerms });
  if (!validation.valid) {
    const onlySolarTermsMissing = validation.errors.length > 0
      && validation.errors.every((error) => error.startsWith("solarTerms"));
    if (!onlySolarTermsMissing) {
      throw new TypeError(validation.errors.join("；"));
    }
  }

  const clockLocalParts = getJinhanClockLocalParts(context);
  const dayPillar = baziResult.dayPillar;
  const dunTypeResult = validation.valid
    ? resolveJinhanDunTypeFromChartTimeContext({ context, solarTerms })
    : createUnsupportedDunTypeResult(validation.errors.join("；"));
  return Object.freeze({
    context,
    mode: context.mode,
    clockLocalParts: Object.freeze(clockLocalParts),
    dayPillar,
    dayStem: dayPillar[0],
    solarTerms: Array.isArray(solarTerms) ? solarTerms : null,
    dunTypeResult,
  });
}

/** Calculates the Jinhan day pan and hour presentation from a pure snapshot. */
export function calculateJinhanFromChartTimeContext({ context, baziResult, solarTerms } = {}) {
  const input = createJinhanCalculationInput({ context, baziResult, solarTerms });
  const chineseHour = getChineseHourInfoFromLocalParts(input.clockLocalParts);
  const base = {
    mode: input.mode,
    clockLocalParts: cloneLocalParts(input.clockLocalParts),
    dayPillar: input.dayPillar,
    dayStem: input.dayStem,
    chineseHour,
    dunTypeResult: input.dunTypeResult,
    currentHourIndex: chineseHour?.index ?? null,
    debug: createDebugSnapshot(input, null, null),
  };
  if (input.dunTypeResult.status !== JINHAN_DUN_TYPE_STATUS.RESOLVED) {
    return { status: JINHAN_DUN_TYPE_STATUS.UNSUPPORTED, ...base, pan: null, deitiesByPalace: {}, blackYellowHours: [] };
  }

  const pan = getJinhanYujingDayPan(input.dayPillar, input.dunTypeResult.dunType);
  if (!pan) {
    throw new TypeError("無法依 dayPillar 與 dunType 取得金函日盤");
  }
  const deitiesByPalace = getJinhanDeitiesByPalace(pan.meta);
  const blackYellowHours = getJinhanBlackYellowHours(input.dayPillar);
  const debug = createDebugSnapshot(input, input.dunTypeResult.boundarySnapshot, pan);
  return {
    status: JINHAN_DUN_TYPE_STATUS.RESOLVED,
    ...base,
    pan,
    deitiesByPalace,
    blackYellowHours,
    debug,
  };
}

export function getChineseHourInfoFromLocalParts(localParts) {
  if (!localParts || !Number.isInteger(localParts.hour) || localParts.hour < 0 || localParts.hour > 23) {
    return null;
  }
  const index = getHourBranchIndex(localParts.hour) + 1;
  const label = CHINESE_HOUR_LABELS[index - 1];
  return label ? { index: label.index, branch: label.branch, timeRange: label.timeRange } : null;
}

export function validateJinhanChartTimeInput({ context, baziResult, solarTerms } = {}) {
  const errors = [];
  const contextValidation = validateChartTimeContext(context);
  if (!contextValidation.valid) errors.push(...contextValidation.errors.map((error) => `context invalid: ${error}`));
  if (context?.mode === CHART_CONTEXT_MODE_TRUE_SOLAR && !context.location) {
    errors.push("true-solar mode 需要 location");
  }
  if (!baziResult || typeof baziResult !== "object") {
    errors.push("baziResult 必須存在");
  } else if (typeof baziResult.dayPillar !== "string" || !SEXAGENARY_CYCLE.includes(baziResult.dayPillar)) {
    errors.push("baziResult.dayPillar 必須是有效六十甲子日柱");
  }
  errors.push(...getSolarTermsValidationErrors(solarTerms));
  return { valid: errors.length === 0, errors };
}

export function formatJinhanChartTimeDebug(result) {
  if (!result || typeof result !== "object" || !result.debug || typeof result.debug !== "object") {
    throw new TypeError("result 必須是 adapter calculation result");
  }
  return Object.freeze({ ...result.debug });
}

function createDebugSnapshot(input, boundary, pan) {
  const queryInstantMs = input.context.civil.instantMs;
  const termLocalParts = boundary?.termLocalParts ?? null;
  return {
    mode: input.mode,
    queryInstant: new Date(queryInstantMs).toISOString(),
    queryClockLocal: formatLocalDateTime(input.clockLocalParts),
    queryDayPillar: input.dayPillar,
    boundary: boundary?.boundary ?? null,
    termInstant: Number.isFinite(boundary?.termTimeMs) ? new Date(boundary.termTimeMs).toISOString() : null,
    termClockLocal: termLocalParts ? formatLocalDateTime(termLocalParts) : null,
    termDayPillar: boundary?.termDayPillar ?? null,
    termDayStem: boundary?.termStem ?? null,
    termEffectiveDay: boundary?.termEffectiveDate ?? null,
    transferMode: input.dunTypeResult.mode,
    offsetDays: input.dunTypeResult.offsetDays,
    switchEffectiveDay: input.dunTypeResult.switchEffectiveDay,
    dunType: input.dunTypeResult.dunType,
    currentChineseHour: input.dunTypeResult.status === JINHAN_DUN_TYPE_STATUS.RESOLVED
      ? getChineseHourInfoFromLocalParts(input.clockLocalParts)?.branch ?? null
      : null,
    queryEotMinutes: input.mode === CHART_CONTEXT_MODE_TRUE_SOLAR
      ? (input.context.trueSolar.equationOfTimeSeconds / 60)
      : null,
    termEotMinutes: Number.isFinite(boundary?.termEotSeconds)
      ? boundary.termEotSeconds / 60
      : null,
    dayPan: pan?.meta?.label ?? null,
  };
}

function createUnsupportedDunTypeResult(reason) {
  return {
    status: JINHAN_DUN_TYPE_STATUS.UNSUPPORTED,
    dunType: null,
    mode: JINHAN_DUN_TYPE_MODE.UNKNOWN,
    boundary: null,
    switchEffectiveDay: null,
    offsetDays: null,
    reason,
    boundarySnapshot: null,
    queryLocalParts: null,
  };
}

function findBoundaryTerm(solarTerms, year, boundary) {
  return solarTerms.find((term) => getTermYear(term) === year && term.name === boundary) ?? null;
}

function getTermYear(term) {
  if (Number.isInteger(term?.year_taipei)) return term.year_taipei;
  if (Number.isInteger(term?.year)) return term.year;
  return new Date(term.timeMs).getUTCFullYear();
}

function getSolarTermsValidationErrors(solarTerms) {
  if (!Array.isArray(solarTerms) || solarTerms.length === 0) {
    return ["solarTerms 必須是非空陣列"];
  }
  if (!solarTerms.every((term) => term && typeof term.name === "string" && term.name && Number.isFinite(term.timeMs))) {
    return ["solarTerms 每筆資料都需要 name 與有限 timeMs"];
  }
  return [];
}

function assertContext(context) {
  const validation = validateChartTimeContext(context);
  if (!validation.valid) throw new TypeError(`無效的 ChartTimeContext：${validation.errors.join("；")}`);
  if (context.mode === CHART_CONTEXT_MODE_TRUE_SOLAR && !context.location) {
    throw new TypeError("true-solar mode 需要 context.location");
  }
}

function assertTerm(term) {
  if (!term || !Number.isFinite(term.timeMs)) {
    throw new TypeError("term.timeMs 必須是有限 epoch milliseconds");
  }
  if (typeof term.name !== "string" || !term.name) throw new TypeError("term.name 必須是非空字串");
}

function cloneLocalParts(parts) {
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
    millisecond: parts.millisecond ?? 0,
  };
}

function withMillisecond(parts, timeMs) {
  return { ...cloneLocalParts(parts), millisecond: new Date(timeMs).getUTCMilliseconds() };
}

function createUtcCarrierFromLocalParts(parts) {
  return new Date(Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond ?? 0
  ));
}

function formatLocalDateTime(parts) {
  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}T${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}.${String(parts.millisecond ?? 0).padStart(3, "0")}`;
}
