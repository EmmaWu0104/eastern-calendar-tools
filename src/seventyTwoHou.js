import seventyTwoHouData from "../data/seventy_two_hou.json" with { type: "json" };

export function getHouDefinitions() {
  return clonePlainData(seventyTwoHouData);
}

export function getHouBySolarTerm(termName) {
  const normalizedTermName = normalizeTextKey(termName);
  const definitions = seventyTwoHouData[normalizedTermName];

  return Array.isArray(definitions) ? clonePlainData(definitions) : [];
}

export function getCurrentHouBySolarTermRange(termName, termStart, nextTermStart, targetDateTime) {
  const definitions = getHouBySolarTerm(termName);
  if (definitions.length !== 3) {
    return null;
  }

  const startMs = parseTimeMs(termStart);
  const nextStartMs = parseTimeMs(nextTermStart);
  const targetMs = parseTimeMs(targetDateTime);

  if (
    !Number.isFinite(startMs) ||
    !Number.isFinite(nextStartMs) ||
    !Number.isFinite(targetMs) ||
    nextStartMs <= startMs ||
    targetMs < startMs ||
    targetMs >= nextStartMs
  ) {
    return null;
  }

  const segmentDuration = (nextStartMs - startMs) / 3;
  const firstBoundary = startMs + segmentDuration;
  const secondBoundary = startMs + segmentDuration * 2;
  const segmentIndex = targetMs < firstBoundary ? 0 : targetMs < secondBoundary ? 1 : 2;
  const hou = definitions[segmentIndex];
  const houStartMs = startMs + segmentDuration * segmentIndex;
  const houEndMs = segmentIndex === 2 ? nextStartMs : startMs + segmentDuration * (segmentIndex + 1);

  return {
    term: normalizeTextKey(termName),
    ...clonePlainData(hou),
    start: new Date(houStartMs).toISOString(),
    end: new Date(houEndMs).toISOString(),
  };
}

function normalizeTextKey(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseTimeMs(value) {
  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    return new Date(value.trim()).getTime();
  }

  return NaN;
}

function clonePlainData(value) {
  return JSON.parse(JSON.stringify(value));
}
