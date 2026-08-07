import { createTrueSolarChartTimeContext } from "../src/chartTimeContext.js";

const input = JSON.parse(process.argv[2]);
const context = createTrueSolarChartTimeContext(input);

console.log(JSON.stringify(context));
