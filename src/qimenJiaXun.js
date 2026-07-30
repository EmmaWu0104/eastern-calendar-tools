import { SEXAGENARY_CYCLE } from "./ganzhi.js";

export const QIMEN_JIA_XUN_DEFINITIONS = Object.freeze([
  Object.freeze({ key: "jiaZi", label: "甲子旬", chiefStem: "戊", startPillar: "甲子" }),
  Object.freeze({ key: "jiaXu", label: "甲戌旬", chiefStem: "己", startPillar: "甲戌" }),
  Object.freeze({ key: "jiaShen", label: "甲申旬", chiefStem: "庚", startPillar: "甲申" }),
  Object.freeze({ key: "jiaWu", label: "甲午旬", chiefStem: "辛", startPillar: "甲午" }),
  Object.freeze({ key: "jiaChen", label: "甲辰旬", chiefStem: "壬", startPillar: "甲辰" }),
  Object.freeze({ key: "jiaYin", label: "甲寅旬", chiefStem: "癸", startPillar: "甲寅" }),
]);

export const QIMEN_JIA_HOUR_RESOLVED_STEMS = Object.freeze(
  Object.fromEntries(QIMEN_JIA_XUN_DEFINITIONS.map((definition) => [
    definition.startPillar[1],
    definition.chiefStem,
  ]))
);

export function resolveQimenJiaXun(hourPillar) {
  const cycleIndex = SEXAGENARY_CYCLE.indexOf(hourPillar);
  if (cycleIndex < 0) {
    return null;
  }

  const definition = QIMEN_JIA_XUN_DEFINITIONS[Math.floor(cycleIndex / 10)];
  return definition ? { ...definition } : null;
}
