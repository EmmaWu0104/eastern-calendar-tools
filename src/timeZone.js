const formatterCache = new Map();
const invalidTimeZoneCache = new Set();

export function getDeviceTimeZone() {
  return normalizeTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone) || "UTC";
}

export function validateTimeZone(timeZone) {
  return getFormatter(normalizeTimeZone(timeZone)) !== null;
}

export function getZonedDateTimeParts(date, timeZone) {
  const normalizedTimeZone = normalizeTimeZone(timeZone);
  const formatter = getFormatter(normalizedTimeZone);
  if (!(date instanceof Date) || !Number.isFinite(date.getTime()) || !formatter) {
    return null;
  }

  const values = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );
  const localParts = {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second),
  };
  const utcOffsetMinutes = Math.round(
    (
      Date.UTC(
        localParts.year,
        localParts.month - 1,
        localParts.day,
        localParts.hour,
        localParts.minute,
        localParts.second
      ) - date.getTime()
    ) / 60_000
  );

  return {
    timeZone: normalizedTimeZone,
    localParts,
    utcOffsetMinutes,
    abbreviation: values.timeZoneName || "",
    offsetText: formatUtcOffset(utcOffsetMinutes),
  };
}

export function resolveLocalDateTimeInTimeZone({ localParts, timeZone, disambiguation = null } = {}) {
  const normalizedTimeZone = normalizeTimeZone(timeZone);
  if (!getFormatter(normalizedTimeZone)) {
    return { status: "invalid-time-zone", timeZone: normalizedTimeZone, candidates: [] };
  }
  if (!isValidParts(localParts)) {
    return { status: "invalid-local-date-time", timeZone: normalizedTimeZone, candidates: [] };
  }

  const center = Date.UTC(
    localParts.year,
    localParts.month - 1,
    localParts.day,
    localParts.hour,
    localParts.minute,
    localParts.second
  );
  const offsets = new Set();
  for (
    let sampleMinutes = -36 * 60;
    sampleMinutes <= 36 * 60;
    sampleMinutes += 60
  ) {
    const zoned = getZonedDateTimeParts(new Date(center + sampleMinutes * 60_000), normalizedTimeZone);
    if (Number.isInteger(zoned?.utcOffsetMinutes)) offsets.add(zoned.utcOffsetMinutes);
  }

  const candidates = [...offsets]
    .map((utcOffsetMinutes) => {
      const instant = new Date(center - utcOffsetMinutes * 60_000);
      const zoned = getZonedDateTimeParts(instant, normalizedTimeZone);
      return sameParts(zoned?.localParts, localParts) ? { instant, ...zoned } : null;
    })
    .filter(Boolean)
    .sort((left, right) => left.instant - right.instant);

  if (candidates.length === 0) {
    return {
      status: "nonexistent",
      timeZone: normalizedTimeZone,
      localParts: { ...localParts },
      candidates: [],
    };
  }
  if (candidates.length > 1 && !["earlier", "later"].includes(disambiguation)) {
    return {
      status: "ambiguous",
      timeZone: normalizedTimeZone,
      localParts: { ...localParts },
      candidates,
    };
  }
  const selected = candidates[disambiguation === "later" ? candidates.length - 1 : 0];
  return {
    status: "resolved",
    timeZone: normalizedTimeZone,
    localParts: { ...localParts },
    candidates,
    ...selected,
  };
}

export function formatUtcOffset(offsetMinutes) {
  if (!Number.isInteger(offsetMinutes)) {
    return "UTC—";
  }
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const value = Math.abs(offsetMinutes);
  const hours = String(Math.floor(value / 60)).padStart(2, "0");
  const minutes = String(value % 60).padStart(2, "0");
  return `UTC${sign}${hours}:${minutes}`;
}

function normalizeTimeZone(timeZone) {
  return typeof timeZone === "string" ? timeZone.trim() : "";
}

function getFormatter(timeZone) {
  if (!timeZone || invalidTimeZoneCache.has(timeZone)) {
    return null;
  }
  if (formatterCache.has(timeZone)) {
    return formatterCache.get(timeZone);
  }

  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      timeZoneName: "short",
    });
    formatterCache.set(timeZone, formatter);
    return formatter;
  } catch {
    invalidTimeZoneCache.add(timeZone);
    return null;
  }
}

function sameParts(left, right) {
  const partNames = ["year", "month", "day", "hour", "minute", "second"];
  return left && partNames.every((key) => left[key] === right[key]);
}

function isValidParts(parts) {
  const partNames = ["year", "month", "day", "hour", "minute", "second"];
  if (!parts || !partNames.every((key) => Number.isInteger(parts[key]))) {
    return false;
  }

  const date = new Date(Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  ));
  return date.getUTCFullYear() === parts.year
    && date.getUTCMonth() === parts.month - 1
    && date.getUTCDate() === parts.day
    && date.getUTCHours() === parts.hour
    && date.getUTCMinutes() === parts.minute
    && date.getUTCSeconds() === parts.second;
}
