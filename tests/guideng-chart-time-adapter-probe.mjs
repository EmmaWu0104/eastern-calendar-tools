import { calculateGuiDengFromChartTimeContext } from "../src/guidengChartTimeAdapter.js";

const input = JSON.parse(process.argv[2] ?? "null");
const result = await calculateGuiDengFromChartTimeContext(input);

console.log(JSON.stringify({
  status: result.status,
  mode: result.mode,
  queryInstantMs: result.queryInstantMs,
  clockLocal: result.clockLocalParts,
  trueSolarLocal: result.trueSolarLocalParts,
  effectiveDayDateKey: result.effectiveDayDateKey,
  dayPillar: result.dayPillar,
  dayStem: result.dayStem,
  monthGeneral: result.monthGeneral,
  solarEventCivilDateKey: result.solarEventCivilDateKey,
  solarEvents: result.solarEvents,
  phase: result.phase,
  activeGuiRen: result.activeGuiRen,
  dengGuiBranches: result.dengGuiBranches,
  guiDengHourRanges: result.guiDeng
    ? Object.fromEntries(["yang", "yin"].map((type) => [type, {
      hourBranch: result.guiDeng[type]?.hourBranch ?? null,
      startInstantMs: result.guiDeng[type]?.hourRange?.start?.getTime?.() ?? null,
      endInstantMs: result.guiDeng[type]?.hourRange?.end?.getTime?.() ?? null,
    }]))
    : null,
}));
