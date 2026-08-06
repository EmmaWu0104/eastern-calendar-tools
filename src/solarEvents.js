const MS_PER_DAY = 86_400_000;
const SUNRISE_ZENITH_DEGREES = 90.833; // NOAA: solar radius plus standard atmospheric refraction.

/** NOAA/Meeus-style solar events. All returned parts use the explicit target offset. */
export async function calculateSolarEvents({ date, latitude, longitude, utcOffsetMinutes } = {}) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) throw new TypeError("date 必須是有效的 Date");
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) throw new RangeError("latitude 必須介於 -90 到 90");
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) throw new RangeError("longitude 必須介於 -180 到 180");
  if (!Number.isFinite(utcOffsetMinutes)) throw new TypeError("utcOffsetMinutes 必須是有限數字");
  const local = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  const utcMidnight = Date.UTC(local.year, local.month - 1, local.day) - utcOffsetMinutes * 60_000;
  const noonUtc = utcMidnight + 12 * 60 * 60_000;
  const solar = solarGeometry(noonUtc);
  const solarNoonMinutes = 720 - 4 * longitude - solar.equationMinutes + utcOffsetMinutes;
  const hourAngle = sunriseHourAngle(latitude, solar.declinationDegrees);
  const result = { latitude, longitude, utcOffsetMinutes, dateKey: `${local.year}-${String(local.month).padStart(2, "0")}-${String(local.day).padStart(2, "0")}`, sunrise: null, solarNoon: null, sunset: null, sunriseParts: null, solarNoonParts: null, sunsetParts: null, daylightStatus: "unavailable" };
  if (!Number.isFinite(hourAngle)) return result;
  const sunrise = new Date(utcMidnight + (solarNoonMinutes - hourAngle * 4) * 60_000);
  const solarNoon = new Date(utcMidnight + solarNoonMinutes * 60_000);
  const sunset = new Date(utcMidnight + (solarNoonMinutes + hourAngle * 4) * 60_000);
  if (!(sunrise < solarNoon && solarNoon < sunset)) return result;
  return { ...result, sunrise, solarNoon, sunset, sunriseParts: toOffsetParts(sunrise, utcOffsetMinutes), solarNoonParts: toOffsetParts(solarNoon, utcOffsetMinutes), sunsetParts: toOffsetParts(sunset, utcOffsetMinutes), daylightStatus: "normal" };
}

function solarGeometry(timeMs) { const t = (timeMs / MS_PER_DAY + 2440587.5 - 2451545) / 36525; const l = normalize(280.46646 + t * (36000.76983 + 0.0003032 * t)); const m = 357.52911 + t * (35999.05029 - 0.0001537 * t); const e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t); const omega = 125.04 - 1934.136 * t; const obliq = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60 + 0.00256 * Math.cos(rad(omega)); const y = Math.tan(rad(obliq) / 2) ** 2; const equationMinutes = 4 * deg(y * Math.sin(2 * rad(l)) - 2 * e * Math.sin(rad(m)) + 4 * e * y * Math.sin(rad(m)) * Math.cos(2 * rad(l)) - 0.5 * y * y * Math.sin(4 * rad(l)) - 1.25 * e * e * Math.sin(2 * rad(m))); const c = Math.sin(rad(m)) * (1.914602 - t * (0.004817 + 0.000014 * t)) + Math.sin(2 * rad(m)) * (0.019993 - 0.000101 * t) + Math.sin(3 * rad(m)) * 0.000289; const trueLong = l + c; const appLong = trueLong - 0.00569 - 0.00478 * Math.sin(rad(omega)); return { equationMinutes, declinationDegrees: deg(Math.asin(Math.sin(rad(obliq)) * Math.sin(rad(appLong)))) }; }
function sunriseHourAngle(latitude, declination) { const value = Math.cos(rad(SUNRISE_ZENITH_DEGREES)) / (Math.cos(rad(latitude)) * Math.cos(rad(declination))) - Math.tan(rad(latitude)) * Math.tan(rad(declination)); return value < -1 || value > 1 ? NaN : deg(Math.acos(value)); }
function toOffsetParts(date, offset) { const shifted = new Date(date.getTime() + offset * 60_000); return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth() + 1, day: shifted.getUTCDate(), hour: shifted.getUTCHours(), minute: shifted.getUTCMinutes(), second: shifted.getUTCSeconds() }; }
function rad(value) { return value * Math.PI / 180; } function deg(value) { return value * 180 / Math.PI; } function normalize(value) { return ((value % 360) + 360) % 360; }
