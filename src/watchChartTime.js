import { createWatchChartTimeContext } from "./chartTimeContext.js";
import {
  getZonedDateTimeParts,
  resolveLocalDateTimeInTimeZone,
  validateTimeZone,
} from "./timeZone.js";

const DATE_TIME_VALUE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;

/**
 * Parses a datetime-local value as civil fields only.  It never uses the
 * browser/Node host timezone, so the same input means the same wall clock in
 * every runtime.
 */
export function parseWatchDateTimeLocalParts(value) {
  if (typeof value !== "string" || value.trim().length > 32) {
    return null;
  }

  const match = value.trim().match(DATE_TIME_VALUE_PATTERN);
  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute, second = "0"] = match;
  const parts = {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
    millisecond: 0,
  };
  const carrier = new Date(Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  ));

  if (
    carrier.getUTCFullYear() !== parts.year
    || carrier.getUTCMonth() !== parts.month - 1
    || carrier.getUTCDate() !== parts.day
    || carrier.getUTCHours() !== parts.hour
    || carrier.getUTCMinutes() !== parts.minute
    || carrier.getUTCSeconds() !== parts.second
  ) {
    return null;
  }

  return parts;
}

export function formatWatchDateTimeLocalParts(parts) {
  if (!isValidWatchLocalParts(parts)) {
    return null;
  }

  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}T${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second ?? 0).padStart(2, "0")}`;
}

export function normalizeWatchDateTimeValue(value) {
  return formatWatchDateTimeLocalParts(parseWatchDateTimeLocalParts(value));
}

export function resolveWatchDateTimeValue({ dateTimeValue, timeZone, disambiguation = null } = {}) {
  const localParts = parseWatchDateTimeLocalParts(dateTimeValue);
  if (!validateTimeZone(timeZone)) {
    return {
      status: "invalid-time-zone",
      timeZone: typeof timeZone === "string" ? timeZone.trim() : "",
      localParts,
      candidates: [],
    };
  }

  if (!localParts) {
    return {
      status: "invalid-local-date-time",
      timeZone: timeZone.trim(),
      localParts: null,
      candidates: [],
    };
  }

  return resolveLocalDateTimeInTimeZone({ localParts, timeZone, disambiguation });
}

export function createWatchChartTimeContextFromDateTime({
  dateTimeValue,
  timeZone,
  disambiguation = null,
  source = "query",
  location = null,
} = {}) {
  const resolution = resolveWatchDateTimeValue({ dateTimeValue, timeZone, disambiguation });
  if (resolution.status !== "resolved") {
    return { status: resolution.status, resolution, context: null };
  }

  return {
    status: "resolved",
    resolution,
    context: createWatchChartTimeContext({
      source,
      civil: {
        localParts: { ...resolution.localParts, millisecond: 0 },
        timeZone: resolution.timeZone,
        utcOffsetMinutes: resolution.utcOffsetMinutes,
        abbreviation: resolution.abbreviation,
        instantMs: resolution.instant.getTime(),
        disambiguation: disambiguation ?? null,
      },
      compatibility: {
        watchLocalDateTimeValue: formatWatchDateTimeLocalParts(resolution.localParts),
      },
      location,
      createdAtInstantMs: Date.now(),
    }),
  };
}

export function createWatchChartTimeContextFromInstant({
  instantMs,
  timeZone,
  source = "query",
  location = null,
} = {}) {
  if (!Number.isFinite(instantMs) || !validateTimeZone(timeZone)) {
    return null;
  }

  const zoned = getZonedDateTimeParts(new Date(instantMs), timeZone);
  if (!zoned) {
    return null;
  }

  return createWatchChartTimeContext({
    source,
    civil: {
      localParts: { ...zoned.localParts, millisecond: 0 },
      timeZone: zoned.timeZone,
      utcOffsetMinutes: zoned.utcOffsetMinutes,
      abbreviation: zoned.abbreviation,
      instantMs,
    },
    compatibility: {
      watchLocalDateTimeValue: formatWatchDateTimeLocalParts(zoned.localParts),
    },
    location,
    createdAtInstantMs: Date.now(),
  });
}

export function getWatchDateTimeValueForInstant(instantMs, timeZone) {
  if (!Number.isFinite(instantMs) || !validateTimeZone(timeZone)) {
    return null;
  }

  const zoned = getZonedDateTimeParts(new Date(instantMs), timeZone);
  return zoned ? formatWatchDateTimeLocalParts(zoned.localParts) : null;
}

export function getWatchLocalPartsForInstant(instantMs, timeZone) {
  if (!Number.isFinite(instantMs) || !validateTimeZone(timeZone)) {
    return null;
  }

  return getZonedDateTimeParts(new Date(instantMs), timeZone)?.localParts ?? null;
}

export function getEffectiveWatchCalendarDate(dateTimeValue, timeZone) {
  const localParts = parseWatchDateTimeLocalParts(dateTimeValue);
  if (!localParts || !validateTimeZone(timeZone)) {
    return null;
  }

  const dateParts = localParts.hour >= 23
    ? addCivilDays(localParts, 1)
    : localParts;
  return {
    year: dateParts.year,
    month: dateParts.month - 1,
    day: dateParts.day,
  };
}

export function addCivilDays(parts, days) {
  if (!isValidWatchLocalParts(parts) || !Number.isInteger(days)) {
    return null;
  }

  const carrier = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days));
  return {
    year: carrier.getUTCFullYear(),
    month: carrier.getUTCMonth() + 1,
    day: carrier.getUTCDate(),
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second ?? 0,
    millisecond: parts.millisecond ?? 0,
  };
}

export function formatWatchCalendarDateKey(parts) {
  if (!isValidWatchLocalParts({ ...parts, hour: 0, minute: 0, second: 0, millisecond: 0 })) {
    return null;
  }

  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function isValidWatchLocalParts(parts) {
  if (!parts || !Number.isInteger(parts.year) || !Number.isInteger(parts.month)
    || !Number.isInteger(parts.day) || !Number.isInteger(parts.hour)
    || !Number.isInteger(parts.minute) || !Number.isInteger(parts.second ?? 0)) {
    return false;
  }

  const carrier = new Date(Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second ?? 0,
  ));
  return carrier.getUTCFullYear() === parts.year
    && carrier.getUTCMonth() === parts.month - 1
    && carrier.getUTCDate() === parts.day
    && carrier.getUTCHours() === parts.hour
    && carrier.getUTCMinutes() === parts.minute
    && carrier.getUTCSeconds() === (parts.second ?? 0);
}
