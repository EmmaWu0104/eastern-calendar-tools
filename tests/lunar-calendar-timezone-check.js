import { getLunarDateForSolarDate } from "../src/lunarCalendar.js";

const result = getLunarDateForSolarDate(2023, 3, 22);
process.stdout.write(`${JSON.stringify(result)}\n`);
