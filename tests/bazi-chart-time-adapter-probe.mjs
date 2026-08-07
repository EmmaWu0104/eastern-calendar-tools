import { readFile } from "node:fs/promises";
import { calculateBaziFromChartTimeContext } from "../src/baziChartTimeAdapter.js";
import { createChartTimeContext } from "../src/chartTimeContext.js";
import { normalizeSolarTerms } from "../src/solarTerms.js";

const fixture = JSON.parse(process.argv[2]);
const terms = normalizeSolarTerms(JSON.parse(await readFile(new URL("../data/solar_terms_1899_2101.json", import.meta.url), "utf8")));
const result = calculateBaziFromChartTimeContext(createChartTimeContext(fixture), terms);
console.log(JSON.stringify({
  pillars: [result.yearPillar, result.monthPillar, result.dayPillar, result.hourPillar],
  currentTerm: result.currentTerm?.name ?? null,
  nextTerm: result.nextTerm?.name ?? null,
  clockLocalDateTime: result.debug.clockLocalDateTime,
  termComparisonInstantIso: result.debug.termComparisonInstantIso,
  effectiveDayDateKey: result.debug.effectiveDayDateKey,
}));
