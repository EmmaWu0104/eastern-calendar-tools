const MS_PER_DAY = 86_400_000;
const MAX_UTC_OFFSET_MINUTES = 14 * 60;
const MIN_UTC_OFFSET_MINUTES = -12 * 60;

/**
 * Parses a pasted latitude/longitude pair. This UI-facing helper returns null
 * for malformed input rather than throwing.
 */
export function parseCoordinateInput(input) {
  if (typeof input !== "string" || input.trim() === "") {
    return null;
  }

  const normalizedInput = normalizeCoordinateSymbols(input);
  const dmsCoordinates = parseDmsCoordinates(normalizedInput);
  if (dmsCoordinates) {
    return createCoordinateResult(dmsCoordinates, "dms");
  }

  const decimalCoordinates = parseDecimalCoordinates(normalizedInput);
  return decimalCoordinates ? createCoordinateResult(decimalCoordinates, "decimal") : null;
}

/**
 * Converts one degree/minute/second coordinate to signed decimal degrees.
 * Returns null for invalid direction, range, minutes, or seconds.
 */
export function convertDmsToDecimal(degrees, minutes, seconds, direction) {
  const normalizedDirection = typeof direction === "string" ? direction.trim().toUpperCase() : "";
  const isLatitude = normalizedDirection === "N" || normalizedDirection === "S";
  const isLongitude = normalizedDirection === "E" || normalizedDirection === "W";

  if (
    (!isLatitude && !isLongitude)
    || !Number.isFinite(degrees)
    || !Number.isFinite(minutes)
    || !Number.isFinite(seconds)
    || degrees < 0
    || minutes < 0
    || minutes >= 60
    || seconds < 0
    || seconds >= 60
  ) {
    return null;
  }

  const maximumDegrees = isLatitude ? 90 : 180;
  if (degrees > maximumDegrees || (degrees === maximumDegrees && (minutes !== 0 || seconds !== 0))) {
    return null;
  }

  const decimal = degrees + minutes / 60 + seconds / 3600;
  return normalizedDirection === "S" || normalizedDirection === "W" ? -decimal : decimal;
}

/**
 * Calculates the Equation of Time using the NOAA Solar Calculator / Meeus-like
 * solar-geometry expression. `date` is interpreted as watch-clock components;
 * `utcOffsetMinutes` explicitly maps that clock reading to its UTC instant.
 *
 * Returns seconds. Positive means apparent (true) solar time is ahead of mean
 * solar time and must be added to local mean solar time. This is suitable for
 * general true-solar-time use, not a high-precision ephemeris claim.
 */
export function calculateEquationOfTime({ date, utcOffsetMinutes, useUtcComponents = false } = {}) {
  const watchParts = getWatchDateParts(date, useUtcComponents);
  validateUtcOffsetMinutes(utcOffsetMinutes);
  const utcMs = watchPartsToUtcMs(watchParts, utcOffsetMinutes);
  const julianDay = utcMs / MS_PER_DAY + 2_440_587.5;
  const centuries = (julianDay - 2_451_545.0) / 36_525;
  const meanLongitude = normalizeDegrees(280.46646 + centuries * (36_000.76983 + 0.0003032 * centuries));
  const meanAnomaly = 357.52911 + centuries * (35_999.05029 - 0.0001537 * centuries);
  const eccentricity = 0.016708634 - centuries * (0.000042037 + 0.0000001267 * centuries);
  const obliquity = meanObliquityOfEcliptic(centuries) + 0.00256 * Math.cos(toRadians(125.04 - 1934.136 * centuries));
  const y = Math.tan(toRadians(obliquity) / 2) ** 2;
  const longitudeRadians = toRadians(meanLongitude);
  const anomalyRadians = toRadians(meanAnomaly);
  const equationMinutes = 4 * toDegrees(
    y * Math.sin(2 * longitudeRadians)
      - 2 * eccentricity * Math.sin(anomalyRadians)
      + 4 * eccentricity * y * Math.sin(anomalyRadians) * Math.cos(2 * longitudeRadians)
      - 0.5 * y * y * Math.sin(4 * longitudeRadians)
      - 1.25 * eccentricity * eccentricity * Math.sin(2 * anomalyRadians)
  );

  return equationMinutes * 60;
}

/**
 * Calculates mean and true solar time from an explicit watch-clock time zone.
 * Returned Date values are UTC-carrier Dates: read their UTC getters (or the
 * accompanying *Parts) as target watch-zone wall-clock components.
 */
export function calculateTrueSolarTime({ date, latitude, longitude, utcOffsetMinutes, useUtcComponents = false } = {}) {
  const watchParts = getWatchDateParts(date, useUtcComponents);
  validateLatitude(latitude);
  validateLongitude(longitude);
  validateUtcOffsetMinutes(utcOffsetMinutes);

  const standardMeridianDegrees = utcOffsetMinutes / 60 * 15;
  const longitudeCorrectionSeconds = (longitude - standardMeridianDegrees) * 240;
  const equationOfTimeSeconds = calculateEquationOfTime({ date, utcOffsetMinutes, useUtcComponents });
  const totalCorrectionSeconds = longitudeCorrectionSeconds + equationOfTimeSeconds;
  const meanSolarParts = addMillisecondsToParts(watchParts, longitudeCorrectionSeconds * 1000);
  const trueSolarParts = addMillisecondsToParts(watchParts, totalCorrectionSeconds * 1000);
  const dayDifference = civilDayDifference(watchParts, trueSolarParts);

  return {
    watchDate: createUtcCarrierDate(watchParts),
    meanSolarDate: createUtcCarrierDate(meanSolarParts),
    trueSolarDate: createUtcCarrierDate(trueSolarParts),
    watchDateParts: watchParts,
    meanSolarParts,
    trueSolarParts,
    latitude,
    longitude,
    utcOffsetMinutes,
    standardMeridianDegrees,
    longitudeCorrectionSeconds,
    equationOfTimeSeconds,
    totalCorrectionSeconds,
    crossedDateBoundary: dayDifference !== 0,
    dateBoundaryDirection: dayDifference < 0 ? "previous" : dayDifference > 0 ? "next" : null,
  };
}

function normalizeCoordinateSymbols(value) {
  return value
    .trim()
    .replace(/[′’]/g, "'")
    .replace(/[″”]/g, '"')
    .replace(/[，]/g, ",")
    .replace(/\s+/g, " ");
}

function parseDmsCoordinates(input) {
  const pattern = /(\d+(?:\.\d+)?)\s*°\s*(\d+(?:\.\d+)?)\s*'\s*(\d+(?:\.\d+)?)\s*"?\s*([NSEW])/gi;
  const matches = [...input.matchAll(pattern)];
  if (matches.length !== 2 || matches.map((match) => match[0]).join("").replace(/\s|,/g, "") !== input.replace(/\s|,/g, "")) {
    return null;
  }

  const values = matches.map((match) => ({
    direction: match[4].toUpperCase(),
    value: convertDmsToDecimal(Number(match[1]), Number(match[2]), Number(match[3]), match[4]),
  }));
  return coordinatesFromDirectedValues(values);
}

function parseDecimalCoordinates(input) {
  const pattern = /^([+-]?\d+(?:\.\d+)?)\s*([NSEW])?\s*,\s*([+-]?\d+(?:\.\d+)?)\s*([NSEW])?$/i;
  const match = input.match(pattern);
  if (!match) {
    return null;
  }

  const firstDirection = match[2]?.toUpperCase() ?? "";
  const secondDirection = match[4]?.toUpperCase() ?? "";
  const first = Number(match[1]);
  const second = Number(match[3]);
  if (!Number.isFinite(first) || !Number.isFinite(second)) {
    return null;
  }
  if (firstDirection || secondDirection) {
    if (!firstDirection || !secondDirection) {
      return null;
    }
    const directed = coordinatesFromDirectedValues([
      { direction: firstDirection, value: applyDecimalDirection(first, firstDirection) },
      { direction: secondDirection, value: applyDecimalDirection(second, secondDirection) },
    ]);
    return directed && isValidLatitude(directed.latitude) && isValidLongitude(directed.longitude) ? directed : null;
  }
  const latitude = firstDirection === "S" ? -Math.abs(first) : firstDirection === "N" ? Math.abs(first) : first;
  const longitude = secondDirection === "W" ? -Math.abs(second) : secondDirection === "E" ? Math.abs(second) : second;
  return isValidLatitude(latitude) && isValidLongitude(longitude) ? { latitude, longitude } : null;
}

function applyDecimalDirection(value, direction) {
  if (!"NSEW".includes(direction)) return null;
  return direction === "S" || direction === "W" ? -Math.abs(value) : Math.abs(value);
}

function coordinatesFromDirectedValues(values) {
  const latitudeEntry = values.find((entry) => entry.direction === "N" || entry.direction === "S");
  const longitudeEntry = values.find((entry) => entry.direction === "E" || entry.direction === "W");
  if (!latitudeEntry || !longitudeEntry || latitudeEntry.value === null || longitudeEntry.value === null) {
    return null;
  }
  return { latitude: latitudeEntry.value, longitude: longitudeEntry.value };
}

function createCoordinateResult({ latitude, longitude }, sourceFormat) {
  return {
    latitude,
    longitude,
    normalizedText: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
    sourceFormat,
  };
}

function getWatchDateParts(date, useUtcComponents) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
    throw new TypeError("date 必須是有效的 Date");
  }
  const get = useUtcComponents ? "getUTC" : "get";
  return Object.freeze({
    year: date[`${get}FullYear`](),
    month: date[`${get}Month`]() + 1,
    day: date[`${get}Date`](),
    hour: date[`${get}Hours`](),
    minute: date[`${get}Minutes`](),
    second: date[`${get}Seconds`](),
    millisecond: date[`${get}Milliseconds`](),
  });
}

function validateLatitude(value) {
  if (!isValidLatitude(value)) throw new RangeError("latitude 必須介於 -90 到 90");
}

function validateLongitude(value) {
  if (!isValidLongitude(value)) throw new RangeError("longitude 必須介於 -180 到 180");
}

function validateUtcOffsetMinutes(value) {
  if (!Number.isFinite(value)) throw new TypeError("utcOffsetMinutes 必須是有限數字");
  if (value < MIN_UTC_OFFSET_MINUTES || value > MAX_UTC_OFFSET_MINUTES) {
    throw new RangeError("utcOffsetMinutes 必須介於 UTC-12 到 UTC+14");
  }
}

function isValidLatitude(value) { return Number.isFinite(value) && value >= -90 && value <= 90; }
function isValidLongitude(value) { return Number.isFinite(value) && value >= -180 && value <= 180; }
function watchPartsToUtcMs(parts, utcOffsetMinutes) { return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second, parts.millisecond) - utcOffsetMinutes * 60_000; }
function createUtcCarrierDate(parts) { return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second, parts.millisecond)); }
function addMillisecondsToParts(parts, milliseconds) { const result = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second, parts.millisecond) + milliseconds); return Object.freeze({ year: result.getUTCFullYear(), month: result.getUTCMonth() + 1, day: result.getUTCDate(), hour: result.getUTCHours(), minute: result.getUTCMinutes(), second: result.getUTCSeconds(), millisecond: result.getUTCMilliseconds() }); }
function civilDayDifference(from, to) { return Math.round((Date.UTC(to.year, to.month - 1, to.day) - Date.UTC(from.year, from.month - 1, from.day)) / MS_PER_DAY); }
function meanObliquityOfEcliptic(centuries) { const seconds = 21.448 - centuries * (46.815 + centuries * (0.00059 - centuries * 0.001813)); return 23 + (26 + seconds / 60) / 60; }
function normalizeDegrees(value) { return ((value % 360) + 360) % 360; }
function toRadians(degrees) { return degrees * Math.PI / 180; }
function toDegrees(radians) { return radians * 180 / Math.PI; }
