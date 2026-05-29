const TEST_TIME_ZONE = "Asia/Taipei";
process.env.TZ = TEST_TIME_ZONE;

const { readFile } = await import("node:fs/promises");
const { calculateBaziFromSolarTerms } = await import("../src/bazi.js");
const { getDailyGodsByStem } = await import("../src/dailyGods.js");
const { SEXAGENARY_CYCLE } = await import("../src/ganzhi.js");
const {
  getJinhanBlackYellowHours,
  getJinhanDeitiesByPalace,
  getJinhanYujingDayPan,
} = await import("../src/jinhanYujing.js");
const { getNaYinByPillar } = await import("../src/nayin.js");
const { normalizeSolarTerms, parseLocalDateTime } = await import("../src/solarTerms.js");
const {
  calculateAllFlyingStarCharts,
  calculateAnnualFlyingStarChart,
  calculateDailyFlyingStarChart,
  calculateHourlyFlyingStarChart,
  calculateMonthlyFlyingStarChart,
  calculatePeriodFlyingStarChart,
  flyStars,
} = await import("../src/flyingStars.js");
const resolvedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "unknown";

console.log(`測試基準時區：${TEST_TIME_ZONE}`);
if (resolvedTimeZone !== TEST_TIME_ZONE) {
  console.warn(
    `警告：目前 Intl resolved timeZone 為 ${resolvedTimeZone}，但測試案例預期以 ${TEST_TIME_ZONE} 本機時間撰寫。`
  );
}

const [termsRaw, casesRaw, flyingStarsCasesRaw, jinhanYujingRaw] = await Promise.all([
  readFile(new URL("../data/solar_terms_1899_2101.json", import.meta.url), "utf8"),
  readFile(new URL("./testcases.json", import.meta.url), "utf8"),
  readFile(new URL("./flying-stars-testcases.json", import.meta.url), "utf8"),
  readFile(new URL("../data/jinhan_yujing_day_pan.json", import.meta.url), "utf8"),
]);

const solarTerms = normalizeSolarTerms(JSON.parse(termsRaw));
const testCases = JSON.parse(casesRaw);
const flyingStarsTestCases = JSON.parse(flyingStarsCasesRaw);
const jinhanYujingData = JSON.parse(jinhanYujingRaw);
const failures = [];
const pendingCases = [];
let verifiedCaseCount = 0;
let flyingStarsVerifiedCaseCount = 0;
let dailyGodsVerifiedCaseCount = 0;
let naYinVerifiedCaseCount = 0;
let jinhanDayPillarCount = 0;
let jinhanPanCount = 0;
let jinhanBlackYellowHourCount = 0;
let jinhanLookupVerifiedCaseCount = 0;

const parsedLocalDateTime = parseLocalDateTime("2026-06-05T09:08:07.123");
const localDateTimeExpected = {
  year: 2026,
  month: 6,
  day: 5,
  hour: 9,
  minute: 8,
  second: 7,
  millisecond: 123,
};

for (const [key, expectedValue] of Object.entries(localDateTimeExpected)) {
  if (parsedLocalDateTime[key] !== expectedValue) {
    failures.push({
      id: "parse-local-datetime-components",
      key,
      expected: expectedValue,
      actual: parsedLocalDateTime[key],
    });
  }
}

for (const testCase of testCases) {
  if (testCase.status === "pending-verification") {
    pendingCases.push(testCase);
    continue;
  }

  if (!testCase.expected) {
    failures.push({
      id: testCase.id,
      key: "expected",
      expected: "expected object or status: pending-verification",
      actual: "missing",
    });
    continue;
  }

  const actual = calculateBaziFromSolarTerms(testCase.input, solarTerms);
  verifiedCaseCount += 1;
  const comparable = {
    yearPillar: actual.yearPillar,
    monthPillar: actual.monthPillar,
    dayPillar: actual.dayPillar,
    hourPillar: actual.hourPillar,
    monthBranch: actual.monthBranch,
    currentTerm: actual.currentTerm?.name,
    nextTerm: actual.nextTerm?.name,
  };

  for (const [key, expectedValue] of Object.entries(testCase.expected)) {
    if (comparable[key] !== expectedValue) {
      failures.push({
        id: testCase.id,
        key,
        expected: expectedValue,
        actual: comparable[key],
      });
    }
  }
}

for (const testCase of flyingStarsTestCases) {
  if (testCase.status === "pending-verification") {
    pendingCases.push(testCase);
    continue;
  }

  if (!testCase.expected) {
    failures.push({
      id: testCase.id,
      key: "expected",
      expected: "expected object or status: pending-verification",
      actual: "missing",
    });
    continue;
  }

  const actual = calculateFlyingStarsTestCase(testCase, solarTerms);
  flyingStarsVerifiedCaseCount += 1;

  for (const [path, expectedValue] of Object.entries(testCase.expected)) {
    const actualValue = getByPath(actual, path);
    if (actualValue !== expectedValue) {
      failures.push({
        id: testCase.id,
        key: path,
        expected: expectedValue,
        actual: actualValue,
      });
    }
  }
}

const dailyGodsTestCases = [
  { id: "daily-gods-gui", stem: "癸", expected: { xun: "喜陽", li: "財", zhen: "陰" } },
  { id: "daily-gods-jia", stem: "甲", expected: { gen: "喜財陰", kun: "陽" } },
  { id: "daily-gods-ding", stem: "丁", expected: { li: "喜", dui: "財陰", qian: "陽" } },
];

for (const testCase of dailyGodsTestCases) {
  const actual = getDailyGodsByStem(testCase.stem);
  const labelsByPalace = getDailyGodLabelsByPalace(actual);
  dailyGodsVerifiedCaseCount += 1;

  for (const [palaceId, expectedValue] of Object.entries(testCase.expected)) {
    const actualValue = labelsByPalace[palaceId] ?? "";
    if (actualValue !== expectedValue) {
      failures.push({
        id: testCase.id,
        key: palaceId,
        expected: expectedValue,
        actual: actualValue,
      });
    }
  }
}

const naYinTestCases = [
  { id: "nayin-jiazi", pillar: "甲子", expected: "海中金" },
  { id: "nayin-guimao", pillar: "癸卯", expected: "金箔金" },
  { id: "nayin-bingwu", pillar: "丙午", expected: "天河水" },
  { id: "nayin-guisi", pillar: "癸巳", expected: "長流水" },
  { id: "nayin-renxu", pillar: "壬戌", expected: "大海水" },
  { id: "nayin-invalid", pillar: "無效", expected: "" },
];

for (const testCase of naYinTestCases) {
  const actual = getNaYinByPillar(testCase.pillar);
  naYinVerifiedCaseCount += 1;

  if (actual !== testCase.expected) {
    failures.push({
      id: testCase.id,
      key: "nayin",
      expected: testCase.expected,
      actual,
    });
  }
}

const jinhanStats = validateJinhanYujingData(jinhanYujingData);
jinhanDayPillarCount = jinhanStats.dayPillars;
jinhanPanCount = jinhanStats.pans;
jinhanBlackYellowHourCount = jinhanStats.blackYellowHours;

runJinhanYujingLookupTests();

if (failures.length > 0) {
  console.error("測試失敗：");
  for (const failure of failures) {
    console.error(
      `- ${failure.id} ${failure.key}: expected ${failure.expected}, actual ${failure.actual}`
    );
  }
  process.exitCode = 1;
} else {
  console.log(`全部通過：${verifiedCaseCount} verified cases + parseLocalDateTime`);
  console.log(`九宮飛星測試通過：${flyingStarsVerifiedCaseCount} cases`);
  console.log(`日干吉神測試通過：${dailyGodsVerifiedCaseCount} cases`);
  console.log(`納音測試通過：${naYinVerifiedCaseCount} cases`);
  console.log(
    `金函玉鏡資料檢查通過：${jinhanDayPillarCount} day pillars, ${jinhanPanCount} pans, ${jinhanBlackYellowHourCount} blackYellowHours`
  );
  console.log(`金函玉鏡查表測試通過：${jinhanLookupVerifiedCaseCount} cases`);
  if (pendingCases.length > 0) {
    console.log(`待人工驗證案例略過：${pendingCases.length} cases`);
    for (const testCase of pendingCases) {
      console.log(`- ${testCase.id}: ${testCase.input}`);
    }
  }
}

function calculateFlyingStarsTestCase(testCase, solarTerms) {
  if (testCase.type === "flyStars") {
    return flyStars(testCase.centerStar, testCase.direction);
  }

  if (testCase.type === "period") {
    return calculatePeriodFlyingStarChart(testCase.input);
  }

  const calendarResult = testCase.calendarResult ?? calculateBaziFromSolarTerms(testCase.input, solarTerms);

  if (testCase.type === "all") {
    return calculateAllFlyingStarCharts(calendarResult, testCase.input);
  }

  if (testCase.type === "annual") {
    return calculateAnnualFlyingStarChart(calendarResult);
  }

  if (testCase.type === "monthly") {
    return calculateMonthlyFlyingStarChart(calendarResult);
  }

  if (testCase.type === "daily") {
    return calculateDailyFlyingStarChart(calendarResult);
  }

  if (testCase.type === "hourly") {
    return calculateHourlyFlyingStarChart(calendarResult);
  }

  throw new Error(`未知九宮飛星測試類型：${testCase.type}`);
}

function getByPath(value, path) {
  return path.split(".").reduce((current, key) => current?.[key], value);
}

function getDailyGodLabelsByPalace(result) {
  return Object.fromEntries(
    result.layout
      .flat()
      .map((palace) => [palace.id, palace.gods.map((god) => god.shortLabel).join("")])
  );
}

function validateJinhanYujingData(data) {
  const requiredDunTypes = ["陽遁", "陰遁"];
  const requiredPalaces = ["坎", "艮", "震", "巽", "離", "坤", "兌", "乾"];
  const requiredMetaFields = [
    "pillar",
    "dunType",
    "label",
    "center",
    "xishen",
    "caishen",
    "yinGuishen",
    "yangGuishen",
  ];
  const requiredHourFields = ["index", "pillar", "timeRange", "deity", "type", "notes"];
  const dayPillars = Object.keys(data);
  let panCount = 0;
  let blackYellowHourCount = 0;

  if (dayPillars.length !== 60) {
    failures.push({
      id: "jinhan-yujing-data",
      key: "dayPillarCount",
      expected: 60,
      actual: dayPillars.length,
    });
  }

  for (const pillar of SEXAGENARY_CYCLE) {
    const dayData = data[pillar];
    if (!dayData) {
      failures.push({
        id: `jinhan-yujing-${pillar}`,
        key: "dayPillar",
        expected: "present",
        actual: "missing",
      });
      continue;
    }

    for (const dunType of requiredDunTypes) {
      const pan = dayData[dunType];
      if (!pan) {
        failures.push({
          id: `jinhan-yujing-${pillar}-${dunType}`,
          key: "pan",
          expected: "present",
          actual: "missing",
        });
        continue;
      }

      panCount += 1;
      validateJinhanPan(pillar, dunType, pan, requiredMetaFields, requiredPalaces);
    }

    const hours = dayData.blackYellowHours;
    if (!Array.isArray(hours)) {
      failures.push({
        id: `jinhan-yujing-${pillar}`,
        key: "blackYellowHours",
        expected: "array",
        actual: typeof hours,
      });
      continue;
    }

    blackYellowHourCount += hours.length;
    if (hours.length !== 12) {
      failures.push({
        id: `jinhan-yujing-${pillar}`,
        key: "blackYellowHours.length",
        expected: 12,
        actual: hours.length,
      });
    }

    for (const [index, hour] of hours.entries()) {
      validateJinhanBlackYellowHour(pillar, index, hour, requiredHourFields);
    }
  }

  return {
    dayPillars: dayPillars.length,
    pans: panCount,
    blackYellowHours: blackYellowHourCount,
  };
}

function validateJinhanPan(pillar, dunType, pan, requiredMetaFields, requiredPalaces) {
  if (!pan.meta || typeof pan.meta !== "object") {
    failures.push({
      id: `jinhan-yujing-${pillar}-${dunType}`,
      key: "meta",
      expected: "object",
      actual: typeof pan.meta,
    });
    return;
  }

  for (const field of requiredMetaFields) {
    if (!pan.meta[field]) {
      failures.push({
        id: `jinhan-yujing-${pillar}-${dunType}`,
        key: `meta.${field}`,
        expected: "non-empty",
        actual: pan.meta[field] ?? "missing",
      });
    }
  }

  if (pan.meta.pillar !== pillar) {
    failures.push({
      id: `jinhan-yujing-${pillar}-${dunType}`,
      key: "meta.pillar",
      expected: pillar,
      actual: pan.meta.pillar,
    });
  }

  if (pan.meta.dunType !== dunType) {
    failures.push({
      id: `jinhan-yujing-${pillar}-${dunType}`,
      key: "meta.dunType",
      expected: dunType,
      actual: pan.meta.dunType,
    });
  }

  if (!pan.palaces || typeof pan.palaces !== "object") {
    failures.push({
      id: `jinhan-yujing-${pillar}-${dunType}`,
      key: "palaces",
      expected: "object",
      actual: typeof pan.palaces,
    });
    return;
  }

  for (const palaceName of requiredPalaces) {
    const palace = pan.palaces[palaceName];
    if (!palace) {
      failures.push({
        id: `jinhan-yujing-${pillar}-${dunType}`,
        key: `palaces.${palaceName}`,
        expected: "present",
        actual: "missing",
      });
      continue;
    }

    for (const field of ["door", "star"]) {
      if (!palace[field]) {
        failures.push({
          id: `jinhan-yujing-${pillar}-${dunType}`,
          key: `palaces.${palaceName}.${field}`,
          expected: "non-empty",
          actual: palace[field] ?? "missing",
        });
      }
    }
  }
}

function validateJinhanBlackYellowHour(pillar, index, hour, requiredHourFields) {
  for (const field of requiredHourFields) {
    if (!(field in hour)) {
      failures.push({
        id: `jinhan-yujing-${pillar}-hour-${index + 1}`,
        key: field,
        expected: "present",
        actual: "missing",
      });
    }
  }

  if (!Number.isInteger(hour.index)) {
    failures.push({
      id: `jinhan-yujing-${pillar}-hour-${index + 1}`,
      key: "index",
      expected: "integer",
      actual: hour.index,
    });
  }

  if (typeof hour.pillar !== "string" || hour.pillar.length !== 2) {
    failures.push({
      id: `jinhan-yujing-${pillar}-hour-${index + 1}`,
      key: "pillar",
      expected: "two-character pillar",
      actual: hour.pillar,
    });
  }

  if (hour.type !== "yellow" && hour.type !== "black") {
    failures.push({
      id: `jinhan-yujing-${pillar}-hour-${index + 1}`,
      key: "type",
      expected: "yellow or black",
      actual: hour.type,
    });
  }

  if (!Array.isArray(hour.notes)) {
    failures.push({
      id: `jinhan-yujing-${pillar}-hour-${index + 1}`,
      key: "notes",
      expected: "array",
      actual: typeof hour.notes,
    });
  }
}

function runJinhanYujingLookupTests() {
  const panTestCases = [
    { id: "jinhan-pan-jiazi-yang", pillar: "甲子", dunType: "陽遁", expected: "陽遁甲子日" },
    { id: "jinhan-pan-jiazi-yin", pillar: "甲子", dunType: "陰遁", expected: "陰遁甲子日" },
    { id: "jinhan-pan-yichou-yang", pillar: "乙丑", dunType: "陽遁", expected: "陽遁乙丑日" },
    { id: "jinhan-pan-invalid-pillar", pillar: "無效", dunType: "陽遁", expected: null },
    { id: "jinhan-pan-invalid-dun", pillar: "甲子", dunType: "錯誤", expected: null },
    { id: "jinhan-pan-empty-pillar", pillar: "", dunType: "陽遁", expected: null },
    { id: "jinhan-pan-empty-dun", pillar: "甲子", dunType: "", expected: null },
    { id: "jinhan-pan-non-string-pillar", pillar: 123, dunType: "陽遁", expected: null },
    { id: "jinhan-pan-non-string-dun", pillar: "甲子", dunType: 123, expected: null },
  ];

  for (const testCase of panTestCases) {
    const actual = getJinhanYujingDayPan(testCase.pillar, testCase.dunType);
    const actualValue = actual?.meta?.label ?? null;
    jinhanLookupVerifiedCaseCount += 1;

    if (actualValue !== testCase.expected) {
      failures.push({
        id: testCase.id,
        key: "meta.label",
        expected: testCase.expected,
        actual: actualValue,
      });
    }
  }

  const hours = getJinhanBlackYellowHours("甲子");
  jinhanLookupVerifiedCaseCount += 1;
  if (hours.length !== 12) {
    failures.push({ id: "jinhan-hours-jiazi", key: "length", expected: 12, actual: hours.length });
  }

  const firstHour = hours[0] ?? {};
  for (const [key, expectedValue] of Object.entries({
    index: 1,
    pillar: "甲子",
    timeRange: "23 ~ 01",
    deity: "金匱",
    type: "yellow",
  })) {
    if (firstHour[key] !== expectedValue) {
      failures.push({
        id: "jinhan-hours-jiazi-first",
        key,
        expected: expectedValue,
        actual: firstHour[key],
      });
    }
  }

  jinhanLookupVerifiedCaseCount += 1;
  const invalidHours = getJinhanBlackYellowHours("無效");
  if (invalidHours.length !== 0) {
    failures.push({ id: "jinhan-hours-invalid", key: "length", expected: 0, actual: invalidHours.length });
  }

  jinhanLookupVerifiedCaseCount += 1;
  hours.push({ index: 999 });
  const cleanHours = getJinhanBlackYellowHours("甲子");
  if (cleanHours.length !== 12) {
    failures.push({ id: "jinhan-hours-copy", key: "length", expected: 12, actual: cleanHours.length });
  }

  const jiaziYangPan = getJinhanYujingDayPan("甲子", "陽遁");
  const dingmaoYangPan = getJinhanYujingDayPan("丁卯", "陽遁");
  const deityTestCases = [
    {
      id: "jinhan-deities-jiazi",
      meta: jiaziYangPan?.meta,
      expected: { 艮: "喜財陰", 坤: "陽" },
    },
    {
      id: "jinhan-deities-dingmao",
      meta: dingmaoYangPan?.meta,
      expected: { 離: "喜", 兌: "財陰", 乾: "陽" },
    },
    {
      id: "jinhan-deities-missing-fields",
      meta: { xishen: "艮" },
      expected: { 艮: "喜" },
    },
    {
      id: "jinhan-deities-invalid-palace",
      meta: { xishen: "無效", caishen: "艮", yinGuishen: "無效", yangGuishen: "坤" },
      expected: { 艮: "財", 坤: "陽" },
    },
    {
      id: "jinhan-deities-order",
      meta: { xishen: "坎", caishen: "坎", yinGuishen: "坎", yangGuishen: "坎" },
      expected: { 坎: "喜財陰陽" },
    },
  ];

  for (const testCase of deityTestCases) {
    const actual = getJinhanDeitiesByPalace(testCase.meta);
    const labelsByPalace = getJinhanDeityLabelsByPalace(actual);
    jinhanLookupVerifiedCaseCount += 1;

    for (const [palaceName, expectedValue] of Object.entries(testCase.expected)) {
      const actualValue = labelsByPalace[palaceName] ?? "";
      if (actualValue !== expectedValue) {
        failures.push({
          id: testCase.id,
          key: palaceName,
          expected: expectedValue,
          actual: actualValue,
        });
      }
    }
  }
}

function getJinhanDeityLabelsByPalace(deitiesByPalace) {
  return Object.fromEntries(
    Object.entries(deitiesByPalace).map(([palaceName, deities]) => [
      palaceName,
      deities.map((deity) => deity.shortLabel).join(""),
    ])
  );
}
