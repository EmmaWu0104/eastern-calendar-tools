import { calculateJinhanFromChartTimeContext } from "../src/jinhanChartTimeAdapter.js";

const input = JSON.parse(process.argv[2] ?? "null");
const result = calculateJinhanFromChartTimeContext(input);

console.log(JSON.stringify({
  status: result.status,
  mode: result.mode,
  queryLocalParts: result.clockLocalParts,
  dayPillar: result.dayPillar,
  termLocal: result.debug.termClockLocal,
  termDayPillar: result.debug.termDayPillar,
  dunMode: result.dunTypeResult.mode,
  dunType: result.dunTypeResult.dunType,
  switchEffectiveDay: result.dunTypeResult.switchEffectiveDay,
  pan: result.pan?.meta?.label ?? null,
  currentHourIndex: result.currentHourIndex,
}));
