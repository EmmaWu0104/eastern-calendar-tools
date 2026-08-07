export const CHART_DISPLAY_MODE_WATCH = "watch";
export const CHART_DISPLAY_MODE_TRUE_SOLAR = "true-solar";

const KNOWN_DISPLAY_MODES = new Set([
  CHART_DISPLAY_MODE_WATCH,
  CHART_DISPLAY_MODE_TRUE_SOLAR,
]);

export function normalizeChartDisplayMode(value) {
  return KNOWN_DISPLAY_MODES.has(value)
    ? value
    : CHART_DISPLAY_MODE_WATCH;
}

export function isTrueSolarDisplayMode(value) {
  return normalizeChartDisplayMode(value) === CHART_DISPLAY_MODE_TRUE_SOLAR;
}

export function getChartDisplayModeFromLocation(locationLike) {
  const location = toUrl(locationLike);
  return normalizeChartDisplayMode(location?.searchParams.get("timeMode"));
}

export function buildChartDisplayModeUrl(mode, locationLike) {
  const location = toUrl(locationLike);
  if (!location) {
    return `?timeMode=${normalizeChartDisplayMode(mode)}`;
  }

  location.searchParams.set("timeMode", normalizeChartDisplayMode(mode));
  return `${location.pathname}${location.search}${location.hash}`;
}

function toUrl(locationLike) {
  try {
    if (locationLike instanceof URL) {
      return new URL(locationLike.href);
    }
    if (typeof locationLike === "string") {
      return new URL(locationLike, "https://chart-display-mode.invalid/");
    }
    if (locationLike?.href) {
      return new URL(locationLike.href);
    }
    if (locationLike?.pathname) {
      return new URL(
        `${locationLike.pathname}${locationLike.search ?? ""}${locationLike.hash ?? ""}`,
        "https://chart-display-mode.invalid/"
      );
    }
  } catch {
    return null;
  }
  return null;
}
