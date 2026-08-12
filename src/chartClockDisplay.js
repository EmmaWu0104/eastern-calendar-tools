import {
  CHART_CONTEXT_MODE_TRUE_SOLAR,
  CHART_CONTEXT_MODE_WATCH,
  validateChartTimeContext,
} from "./chartTimeContext.js";
import { calculateTrueSolarTime } from "./trueSolarTime.js";
import { getZonedDateTimeParts } from "./timeZone.js";

export const GUI_DENG_DISPLAY_END_EXCLUSIVE_OFFSET_MS = 60_000;

/**
 * Resolves one actual instant to the local clock parts belonging to the
 * supplied chart mode.  For true-solar mode the event instant's own IANA
 * offset is used, so DST and equation-of-time are recomputed per event.
 */
export function getChartClockLocalPartsForInstant({ instantMs, context, mode = context?.mode } = {}) {
  if (!Number.isFinite(instantMs) || !isValidContextForMode(context, mode)) {
    return null;
  }

  const instant = new Date(instantMs);
  const civil = getZonedDateTimeParts(instant, context.civil.timeZone);
  if (!civil) {
    return null;
  }

  if (mode === CHART_CONTEXT_MODE_WATCH) {
    return Object.freeze({
      ...civil.localParts,
      millisecond: instant.getUTCMilliseconds(),
    });
  }

  const location = context.location;
  if (!location) {
    return null;
  }
  const civilLocalParts = {
    ...civil.localParts,
    millisecond: instant.getUTCMilliseconds(),
  };
  try {
    const result = calculateTrueSolarTime({
      date: createUtcCarrierFromLocalParts(civilLocalParts),
      latitude: location.latitude,
      longitude: location.longitude,
      utcOffsetMinutes: civil.utcOffsetMinutes,
      useUtcComponents: true,
    });
    return Object.freeze({ ...result.trueSolarParts });
  } catch {
    return null;
  }
}

/**
 * Formats one actual instant using the clock belonging to the supplied chart
 * mode.  The instant remains the calculation authority; this helper only
 * creates presentation text and never mutates a ChartTimeContext or result.
 */
export function formatInstantForChartMode({ instantMs, context, mode = context?.mode } = {}) {
  return formatClockParts(getChartClockLocalPartsForInstant({ instantMs, context, mode }));
}

/** Formats a chart-mode instant as YYYY/MM/DD HH:mm or MM/DD HH:mm. */
export function formatDateTimeForChartMode({
  instantMs,
  context,
  mode = context?.mode,
  includeYear = true,
} = {}) {
  const parts = getChartClockLocalPartsForInstant({ instantMs, context, mode });
  if (!parts) {
    return null;
  }
  const dateText = [
    includeYear ? String(parts.year).padStart(4, "0") : null,
    String(parts.month).padStart(2, "0"),
    String(parts.day).padStart(2, "0"),
  ].filter(Boolean).join("/");
  return `${dateText} ${formatClockParts(parts)}`;
}

/**
 * Formats an actual end-exclusive range.  The legacy UI displays the final
 * included minute, so the offset is applied to the actual end instant before
 * either mode's clock conversion.
 */
export function formatRangeForChartMode({
  startInstantMs,
  endInstantMs,
  context,
  mode = context?.mode,
  endExclusiveDisplayOffsetMs = GUI_DENG_DISPLAY_END_EXCLUSIVE_OFFSET_MS,
} = {}) {
  if (!Number.isFinite(startInstantMs) || !Number.isFinite(endInstantMs)
    || startInstantMs >= endInstantMs || !Number.isFinite(endExclusiveDisplayOffsetMs)
    || endExclusiveDisplayOffsetMs < 0) {
    return "";
  }

  const startText = formatInstantForChartMode({ instantMs: startInstantMs, context, mode });
  const displayEndInstantMs = endInstantMs - endExclusiveDisplayOffsetMs;
  const endText = formatInstantForChartMode({ instantMs: displayEndInstantMs, context, mode });
  return startText && endText ? `${startText}–${endText}` : "";
}

/**
 * Converts a GuiDeng adapter calculation snapshot into the small presentation
 * shape consumed by the existing Jinhan summary/hour-row renderer.
 */
export function createGuiDengDisplayModel({ result, context } = {}) {
  if (!result || result.status !== "resolved" || !isValidContextForMode(context, context?.mode)) {
    return Object.freeze({
      status: "unsupported",
      reason: result?.reason ?? "GuiDeng display context unavailable",
      mode: context?.mode ?? result?.mode ?? null,
      sunriseText: "",
      sunsetText: "",
      nextSunriseText: "",
      entries: Object.freeze([]),
      guiDengText: "無",
      dengGuiBranches: Object.freeze([]),
      phase: null,
      activeGuiRen: null,
    });
  }

  const solarEvents = result.solarEvents;
  const sunriseText = formatInstantForChartMode({
    instantMs: solarEvents?.sunriseInstantMs,
    context,
  }) ?? "";
  const sunsetText = formatInstantForChartMode({
    instantMs: solarEvents?.sunsetInstantMs,
    context,
  }) ?? "";
  const nextSunriseText = formatInstantForChartMode({
    instantMs: solarEvents?.nextSunriseInstantMs,
    context,
  }) ?? "";
  const sourceEntries = Array.isArray(result.guiDeng?.entries) ? result.guiDeng.entries : [];
  const entries = sourceEntries.map((entry) => {
    const availableRange = entry?.availableRange;
    const startInstantMs = availableRange?.start instanceof Date
      ? availableRange.start.getTime()
      : NaN;
    const endInstantMs = availableRange?.end instanceof Date
      ? availableRange.end.getTime()
      : NaN;
    return Object.freeze({
      type: entry?.type ?? null,
      label: entry?.label ?? "",
      hourBranch: entry?.hourBranch ?? "",
      isAvailable: entry?.isAvailable === true,
      rangeText: entry?.isAvailable === true
        ? formatRangeForChartMode({ startInstantMs, endInstantMs, context })
        : "",
    });
  });
  const availableEntries = entries.filter((entry) => entry.isAvailable && entry.rangeText);
  const guiDengText = availableEntries.length > 0
    ? availableEntries.map((entry) => `${entry.hourBranch}時（${entry.label}，${entry.rangeText}）`).join("；")
    : "無";
  const dengGuiBranches = [...new Set(availableEntries.map((entry) => entry.hourBranch).filter(Boolean))];

  return Object.freeze({
    status: "resolved",
    reason: null,
    mode: context.mode,
    sunriseText,
    sunsetText,
    nextSunriseText,
    entries: Object.freeze(entries),
    guiDengText,
    dengGuiBranches: Object.freeze(dengGuiBranches),
    phase: result.phase ?? null,
    activeGuiRen: result.activeGuiRen ?? null,
  });
}

function isValidContextForMode(context, mode) {
  if (mode !== CHART_CONTEXT_MODE_WATCH && mode !== CHART_CONTEXT_MODE_TRUE_SOLAR) {
    return false;
  }
  if (!context || context.mode !== mode) {
    return false;
  }
  const validation = validateChartTimeContext(context);
  return validation.valid && (mode !== CHART_CONTEXT_MODE_TRUE_SOLAR || context.location !== null);
}

function formatClockParts(parts) {
  if (!parts || !Number.isInteger(parts.hour) || !Number.isInteger(parts.minute)) {
    return null;
  }
  return `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}

function createUtcCarrierFromLocalParts(parts) {
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
