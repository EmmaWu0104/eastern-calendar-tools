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

  return createHouResult(termName, definitions[segmentIndex], segmentIndex, startMs, nextStartMs);
}

export function getNextHouBySolarTermRange(
  termName,
  termStart,
  nextTermName,
  nextTermStart,
  afterNextTermStart,
  targetDateTime
) {
  const currentHou = getCurrentHouBySolarTermRange(termName, termStart, nextTermStart, targetDateTime);
  if (!currentHou) {
    return null;
  }

  const currentTermDefinitions = getHouBySolarTerm(termName);
  const startMs = parseTimeMs(termStart);
  const nextStartMs = parseTimeMs(nextTermStart);

  if (
    currentHou.houIndex < 3 &&
    currentTermDefinitions.length === 3 &&
    Number.isFinite(startMs) &&
    Number.isFinite(nextStartMs) &&
    nextStartMs > startMs
  ) {
    const nextSegmentIndex = currentHou.houIndex;
    return createHouResult(
      termName,
      currentTermDefinitions[nextSegmentIndex],
      nextSegmentIndex,
      startMs,
      nextStartMs
    );
  }

  const nextTermDefinitions = getHouBySolarTerm(nextTermName);
  const afterNextStartMs = parseTimeMs(afterNextTermStart);
  if (
    nextTermDefinitions.length !== 3 ||
    !Number.isFinite(nextStartMs) ||
    !Number.isFinite(afterNextStartMs) ||
    afterNextStartMs <= nextStartMs
  ) {
    return null;
  }

  return createHouResult(nextTermName, nextTermDefinitions[0], 0, nextStartMs, afterNextStartMs);
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

function createHouResult(termName, hou, segmentIndex, startMs, nextStartMs) {
  const segmentDuration = (nextStartMs - startMs) / 3;
  const houStartMs = startMs + segmentDuration * segmentIndex;
  const houEndMs = segmentIndex === 2 ? nextStartMs : startMs + segmentDuration * (segmentIndex + 1);

  return {
    term: normalizeTextKey(termName),
    ...clonePlainData(hou),
    start: new Date(houStartMs).toISOString(),
    end: new Date(houEndMs).toISOString(),
  };
}

function clonePlainData(value) {
  return JSON.parse(JSON.stringify(value));
}
