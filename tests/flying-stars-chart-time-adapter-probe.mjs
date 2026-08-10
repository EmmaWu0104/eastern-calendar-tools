import { readFile } from "node:fs/promises";
import { createChartTimeContext } from "../src/chartTimeContext.js";
import { calculateFlyingStarsFromChartTimeContext } from "../src/flyingStarsChartTimeAdapter.js";
import { normalizeSolarTerms } from "../src/solarTerms.js";

const fixture = JSON.parse(process.argv[2] ?? "{}");
const rawSolarTerms = JSON.parse(await readFile(new URL("../data/solar_terms_1899_2101.json", import.meta.url), "utf8"));
const solarTerms = normalizeSolarTerms(rawSolarTerms);
const context = createChartTimeContext(fixture.contextInput);
const result = calculateFlyingStarsFromChartTimeContext(context, solarTerms);

console.log(JSON.stringify({
  period: result.period,
  annual: result.annual,
  monthly: result.monthly,
  daily: result.daily,
  hourly: result.hourly,
}));
