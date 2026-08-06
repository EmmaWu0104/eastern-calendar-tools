import { calculateSolarEvents } from "../src/solarEvents.js";
import { calculateTrueSolarTime } from "../src/trueSolarTime.js";

const input = JSON.parse(process.argv[2]);
const { localParts, latitude, longitude, utcOffsetMinutes } = input;

// UTC is only a component carrier. The calculation explicitly reads UTC fields,
// so this remains independent from the child process's TZ setting.
const carrier = new Date(Date.UTC(
  localParts.year,
  localParts.month - 1,
  localParts.day,
  localParts.hour,
  localParts.minute,
  localParts.second
));
const result = calculateTrueSolarTime({
  date: carrier,
  latitude,
  longitude,
  utcOffsetMinutes,
  useUtcComponents: true,
});
const events = await calculateSolarEvents({
  date: carrier,
  latitude,
  longitude,
  utcOffsetMinutes,
  useUtcComponents: true,
});

console.log(JSON.stringify({
  meanSolarParts: result.meanSolarParts,
  trueSolarParts: result.trueSolarParts,
  crossedDateBoundary: result.crossedDateBoundary,
  dateBoundaryDirection: result.dateBoundaryDirection,
  solarEventDateKey: events.dateKey,
}));
