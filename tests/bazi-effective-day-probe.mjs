import { getEffectiveDateKeyFromLocalParts } from "../src/bazi.js";

console.log(getEffectiveDateKeyFromLocalParts(JSON.parse(process.argv[2])));
