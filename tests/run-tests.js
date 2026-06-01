const TEST_TIME_ZONE = "Asia/Taipei";
process.env.TZ = TEST_TIME_ZONE;

const { readFile } = await import("node:fs/promises");
const { calculateBaziFromSolarTerms } = await import("../src/bazi.js");
const { getDailyGodsByStem } = await import("../src/dailyGods.js");
const { SEXAGENARY_CYCLE } = await import("../src/ganzhi.js");
const {
  getJinhanDunType,
  JINHAN_DUN_TYPE_MODE,
  JINHAN_DUN_TYPE_STATUS,
} = await import("../src/jinhanDunType.js");
const {
  getJinhanBlackYellowHours,
  getJinhanDeitiesByPalace,
  getJinhanYujingDayPan,
} = await import("../src/jinhanYujing.js");
const { getNaYinByPillar } = await import("../src/nayin.js");
const {
  getCurrentHouBySolarTermRange,
  getHouBySolarTerm,
  getHouDefinitions,
  getNextHouBySolarTermRange,
} = await import("../src/seventyTwoHou.js");
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
let jinhanDunTypeVerifiedCaseCount = 0;
let seventyTwoHouVerifiedCaseCount = 0;
let baziCurrentHouVerifiedCaseCount = 0;

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
runJinhanDunTypeV1Tests();
runBaziCurrentHouTests(solarTerms);
runSeventyTwoHouTests();

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
  console.log(`金函玉鏡超神接氣 v1 測試通過：${jinhanDunTypeVerifiedCaseCount} cases`);
  console.log(`干支曆七十二候整合測試通過：${baziCurrentHouVerifiedCaseCount} cases`);
  console.log(`七十二候測試通過：${seventyTwoHouVerifiedCaseCount} cases`);
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

function runJinhanDunTypeV1Tests() {
  const testCases = [
    {
      id: "jinhan-dun-type-missing-solar-terms",
      input: ["2026-01-01T00:00", { dayPillar: "甲子" }, null],
      expected: {
        status: JINHAN_DUN_TYPE_STATUS.UNSUPPORTED,
        dunType: null,
        mode: JINHAN_DUN_TYPE_MODE.UNKNOWN,
        boundary: null,
      },
    },
    {
      id: "jinhan-dun-type-winter-zheng-shou",
      input: [
        "2026-12-17T00:00",
        { dayPillar: "甲子" },
        createJinhanDunTypeMockTerms({
          previousWinter: "2025-12-21T10:00:00",
          summer: "2026-06-19T10:00:00",
          winter: "2026-12-16T10:00:00",
        }),
      ],
      expected: {
        status: JINHAN_DUN_TYPE_STATUS.RESOLVED,
        dunType: "陽遁",
        mode: JINHAN_DUN_TYPE_MODE.ZHENG_SHOU,
        boundary: "冬至",
      },
    },
    {
      id: "jinhan-dun-type-winter-jie-qi",
      input: [
        "2026-12-17T00:00",
        { dayPillar: "甲子" },
        createJinhanDunTypeMockTerms({
          previousWinter: "2025-12-21T10:00:00",
          summer: "2026-06-19T10:00:00",
          winter: "2026-12-18T10:00:00",
        }),
      ],
      expected: {
        status: JINHAN_DUN_TYPE_STATUS.RESOLVED,
        dunType: "陽遁",
        mode: JINHAN_DUN_TYPE_MODE.JIE_QI,
        boundary: "冬至",
      },
    },
    {
      id: "jinhan-dun-type-winter-chao-shen-before-switch",
      input: [
        "2026-12-25T00:00",
        { dayPillar: "甲子" },
        createJinhanDunTypeMockTerms({
          previousWinter: "2025-12-21T10:00:00",
          summer: "2026-06-19T10:00:00",
          winter: "2026-12-24T10:00:00",
        }),
      ],
      expected: {
        status: JINHAN_DUN_TYPE_STATUS.RESOLVED,
        dunType: "陰遁",
        mode: JINHAN_DUN_TYPE_MODE.CHAO_SHEN,
        boundary: "冬至",
      },
    },
    {
      id: "jinhan-dun-type-winter-chao-shen-after-switch",
      input: [
        "2026-12-26T00:00",
        { dayPillar: "甲子" },
        createJinhanDunTypeMockTerms({
          previousWinter: "2025-12-21T10:00:00",
          summer: "2026-06-19T10:00:00",
          winter: "2026-12-24T10:00:00",
        }),
      ],
      expected: {
        status: JINHAN_DUN_TYPE_STATUS.RESOLVED,
        dunType: "陽遁",
        mode: JINHAN_DUN_TYPE_MODE.CHAO_SHEN,
        boundary: "冬至",
      },
    },
    {
      id: "jinhan-dun-type-summer-zheng-shou",
      input: [
        "2026-06-20T00:00",
        { dayPillar: "甲子" },
        createJinhanDunTypeMockTerms({
          previousWinter: "2025-12-21T10:00:00",
          summer: "2026-06-19T10:00:00",
          winter: "2026-12-16T10:00:00",
        }),
      ],
      expected: {
        status: JINHAN_DUN_TYPE_STATUS.RESOLVED,
        dunType: "陰遁",
        mode: JINHAN_DUN_TYPE_MODE.ZHENG_SHOU,
        boundary: "夏至",
      },
    },
    {
      id: "jinhan-dun-type-summer-jie-qi",
      input: [
        "2026-06-20T00:00",
        { dayPillar: "甲子" },
        createJinhanDunTypeMockTerms({
          previousWinter: "2025-12-21T10:00:00",
          summer: "2026-06-22T10:00:00",
          winter: "2026-12-16T10:00:00",
        }),
      ],
      expected: {
        status: JINHAN_DUN_TYPE_STATUS.RESOLVED,
        dunType: "陰遁",
        mode: JINHAN_DUN_TYPE_MODE.JIE_QI,
        boundary: "夏至",
      },
    },
    {
      id: "jinhan-dun-type-summer-chao-shen-before-switch",
      input: [
        "2026-06-27T00:00",
        { dayPillar: "甲子" },
        createJinhanDunTypeMockTerms({
          previousWinter: "2025-12-21T10:00:00",
          summer: "2026-06-26T10:00:00",
          winter: "2026-12-16T10:00:00",
        }),
      ],
      expected: {
        status: JINHAN_DUN_TYPE_STATUS.RESOLVED,
        dunType: "陽遁",
        mode: JINHAN_DUN_TYPE_MODE.CHAO_SHEN,
        boundary: "夏至",
      },
    },
    {
      id: "jinhan-dun-type-summer-chao-shen-after-switch",
      input: [
        "2026-06-29T00:00",
        { dayPillar: "甲子" },
        createJinhanDunTypeMockTerms({
          previousWinter: "2025-12-21T10:00:00",
          summer: "2026-06-26T10:00:00",
          winter: "2026-12-16T10:00:00",
        }),
      ],
      expected: {
        status: JINHAN_DUN_TYPE_STATUS.RESOLVED,
        dunType: "陰遁",
        mode: JINHAN_DUN_TYPE_MODE.CHAO_SHEN,
        boundary: "夏至",
      },
    },
    {
      id: "jinhan-dun-type-january-uses-previous-winter",
      input: [
        "2026-01-01T00:00",
        { dayPillar: "甲子" },
        createJinhanDunTypeMockTerms({
          previousWinter: "2025-12-21T10:00:00",
          summer: "2026-06-19T10:00:00",
          winter: "2026-12-16T10:00:00",
        }),
      ],
      expected: {
        status: JINHAN_DUN_TYPE_STATUS.RESOLVED,
        dunType: "陽遁",
        mode: JINHAN_DUN_TYPE_MODE.ZHENG_SHOU,
        boundary: "冬至",
      },
    },
    {
      id: "jinhan-dun-type-term-after-2300-uses-next-ganzhi-day",
      input: [
        "2025-12-22T00:30",
        { dayPillar: "乙丑" },
        createJinhanDunTypeMockTerms({
          prePreviousWinter: "2024-12-21T10:00:00",
          previousSummer: "2025-06-19T10:00:00",
          previousWinter: "2025-12-21T23:10:00",
          summer: "2026-06-19T10:00:00",
          winter: "2026-12-16T10:00:00",
        }),
      ],
      expected: {
        status: JINHAN_DUN_TYPE_STATUS.RESOLVED,
        dunType: "陽遁",
        mode: JINHAN_DUN_TYPE_MODE.JIE_QI,
        boundary: "冬至",
      },
    },
  ];

  for (const testCase of testCases) {
    let actual;
    try {
      actual = getJinhanDunType(...testCase.input);
    } catch (error) {
      failures.push({
        id: testCase.id,
        key: "throw",
        expected: "not throw",
        actual: error instanceof Error ? error.message : String(error),
      });
      continue;
    }

    jinhanDunTypeVerifiedCaseCount += 1;
    assertJinhanDunTypeResult(testCase.id, actual, testCase.expected);
  }
}

function assertJinhanDunTypeResult(id, actual, expected) {
  for (const [key, expectedValue] of Object.entries(expected)) {
    if (actual?.[key] !== expectedValue) {
      failures.push({
        id,
        key,
        expected: expectedValue,
        actual: actual?.[key],
      });
    }
  }

  if (typeof actual?.reason !== "string" || actual.reason.length === 0) {
    failures.push({
      id,
      key: "reason",
      expected: "non-empty string",
      actual: actual?.reason,
    });
  }
}

function createJinhanDunTypeMockTerms({
  prePreviousWinter,
  previousSummer,
  previousWinter,
  summer,
  winter,
}) {
  return [
    prePreviousWinter ? createJinhanDunTypeMockTerm(2024, "冬至", prePreviousWinter) : null,
    previousSummer ? createJinhanDunTypeMockTerm(2025, "夏至", previousSummer) : null,
    previousWinter ? createJinhanDunTypeMockTerm(2025, "冬至", previousWinter) : null,
    summer ? createJinhanDunTypeMockTerm(2026, "夏至", summer) : null,
    winter ? createJinhanDunTypeMockTerm(2026, "冬至", winter) : null,
  ].filter(Boolean);
}

function createJinhanDunTypeMockTerm(year, name, localDateTime) {
  return {
    year_taipei: year,
    name,
    asia_taipei: `${localDateTime}+08:00`,
    timeMs: new Date(localDateTime).getTime(),
  };
}

function runBaziCurrentHouTests(solarTerms) {
  const dahan = findSolarTermForTest(solarTerms, "大寒", 2026);
  const lichun = findSolarTermForTest(solarTerms, "立春", 2026);
  const yushui = findSolarTermForTest(solarTerms, "雨水", 2026);
  const jingzhe = findSolarTermForTest(solarTerms, "驚蟄", 2026);

  if (!dahan || !lichun || !yushui || !jingzhe) {
    failures.push({
      id: "bazi-current-hou-setup",
      key: "solarTerms",
      expected: "2026 大寒, 立春, 雨水 and 驚蟄",
      actual: "missing",
    });
    return;
  }

  const segmentDuration = (yushui.timeMs - lichun.timeMs) / 3;
  const firstBoundary = Math.ceil(lichun.timeMs + segmentDuration);
  const secondBoundary = Math.ceil(lichun.timeMs + segmentDuration * 2);
  const dahanSegmentDuration = (lichun.timeMs - dahan.timeMs) / 3;
  const dahanSecondBoundary = Math.ceil(dahan.timeMs + dahanSegmentDuration * 2);
  const testCases = [
    {
      id: "bazi-current-hou-lichun-first",
      input: formatLocalDateTimeForTest(lichun.timeMs),
      expected: { term: "立春", phase: "初候", name: "東風解凍", houIndex: 1, globalHouIndex: 1 },
      expectedNext: { term: "立春", phase: "次候", name: "蟄蟲始振", houIndex: 2, globalHouIndex: 2 },
    },
    {
      id: "bazi-current-hou-lichun-second",
      input: formatLocalDateTimeForTest(firstBoundary),
      expected: { term: "立春", phase: "次候", name: "蟄蟲始振", houIndex: 2, globalHouIndex: 2 },
      expectedNext: { term: "立春", phase: "末候", name: "魚陟負冰", houIndex: 3, globalHouIndex: 3 },
    },
    {
      id: "bazi-current-hou-lichun-third",
      input: formatLocalDateTimeForTest(secondBoundary),
      expected: { term: "立春", phase: "末候", name: "魚陟負冰", houIndex: 3, globalHouIndex: 3 },
      expectedNext: { term: "雨水", phase: "初候", name: "獺祭魚", houIndex: 1, globalHouIndex: 4 },
    },
    {
      id: "bazi-current-hou-yushui-start",
      input: formatLocalDateTimeForTest(yushui.timeMs),
      expected: { term: "雨水", phase: "初候", name: "獺祭魚", houIndex: 1, globalHouIndex: 4 },
      expectedNext: { term: "雨水", phase: "次候", name: "鴻雁來", houIndex: 2, globalHouIndex: 5 },
    },
    {
      id: "bazi-current-hou-cross-year-next",
      input: formatLocalDateTimeForTest(dahanSecondBoundary),
      expected: { term: "大寒", phase: "末候", name: "水澤腹堅", houIndex: 3, globalHouIndex: 72 },
      expectedNext: { term: "立春", phase: "初候", name: "東風解凍", houIndex: 1, globalHouIndex: 1 },
    },
  ];

  for (const testCase of testCases) {
    const actual = calculateBaziFromSolarTerms(testCase.input, solarTerms);
    baziCurrentHouVerifiedCaseCount += 1;

    if (!actual.currentHou) {
      failures.push({
        id: testCase.id,
        key: "currentHou",
        expected: "hou object",
        actual: actual.currentHou,
      });
      continue;
    }

    for (const [key, expectedValue] of Object.entries(testCase.expected)) {
      if (actual.currentHou[key] !== expectedValue) {
        failures.push({
          id: testCase.id,
          key: `currentHou.${key}`,
          expected: expectedValue,
          actual: actual.currentHou[key],
        });
      }
    }

    assertSeventyTwoHouResult(`${testCase.id}-next`, actual.nextHou, testCase.expectedNext);
  }
}

function runSeventyTwoHouTests() {
  const definitions = getHouDefinitions();
  const termNames = Object.keys(definitions);
  const allHou = termNames.flatMap((termName) => definitions[termName].map((hou) => ({ termName, ...hou })));
  const globalIndexes = allHou.map((hou) => hou.globalHouIndex);
  const uniqueGlobalIndexes = new Set(globalIndexes);
  const expectedGlobalIndexes = Array.from({ length: 72 }, (_, index) => index + 1);

  seventyTwoHouVerifiedCaseCount += 1;
  if (termNames.length !== 24) {
    failures.push({
      id: "seventy-two-hou-definitions",
      key: "termCount",
      expected: 24,
      actual: termNames.length,
    });
  }

  for (const termName of termNames) {
    if (!Array.isArray(definitions[termName]) || definitions[termName].length !== 3) {
      failures.push({
        id: "seventy-two-hou-definitions",
        key: `${termName}.length`,
        expected: 3,
        actual: definitions[termName]?.length,
      });
    }
  }

  seventyTwoHouVerifiedCaseCount += 1;
  if (allHou.length !== 72) {
    failures.push({
      id: "seventy-two-hou-definitions",
      key: "houCount",
      expected: 72,
      actual: allHou.length,
    });
  }

  if (uniqueGlobalIndexes.size !== 72) {
    failures.push({
      id: "seventy-two-hou-definitions",
      key: "uniqueGlobalHouIndex",
      expected: 72,
      actual: uniqueGlobalIndexes.size,
    });
  }

  for (const expectedIndex of expectedGlobalIndexes) {
    if (!uniqueGlobalIndexes.has(expectedIndex)) {
      failures.push({
        id: "seventy-two-hou-definitions",
        key: `globalHouIndex.${expectedIndex}`,
        expected: "present",
        actual: "missing",
      });
    }
  }

  const lichunStart = "2026-02-04T00:00:00";
  const yushuiStart = "2026-02-19T00:00:00";
  const lichunFirstBoundary = "2026-02-09T00:00:00";
  const lichunSecondBoundary = "2026-02-14T00:00:00";
  const lichunCases = [
    {
      id: "seventy-two-hou-lichun-start",
      target: lichunStart,
      expected: { phase: "初候", name: "東風解凍", houIndex: 1, globalHouIndex: 1 },
    },
    {
      id: "seventy-two-hou-lichun-first-boundary",
      target: lichunFirstBoundary,
      expected: { phase: "次候", name: "蟄蟲始振", houIndex: 2, globalHouIndex: 2 },
    },
    {
      id: "seventy-two-hou-lichun-second-boundary",
      target: lichunSecondBoundary,
      expected: { phase: "末候", name: "魚陟負冰", houIndex: 3, globalHouIndex: 3 },
    },
  ];

  for (const testCase of lichunCases) {
    const actual = getCurrentHouBySolarTermRange("立春", lichunStart, yushuiStart, testCase.target);
    seventyTwoHouVerifiedCaseCount += 1;
    assertSeventyTwoHouResult(testCase.id, actual, testCase.expected);
  }

  const jingzheStart = "2026-03-06T00:00:00";
  const nextHouCases = [
    {
      id: "seventy-two-hou-next-lichun-first",
      target: lichunStart,
      expected: { term: "立春", phase: "次候", name: "蟄蟲始振", houIndex: 2, globalHouIndex: 2 },
    },
    {
      id: "seventy-two-hou-next-lichun-second",
      target: lichunFirstBoundary,
      expected: { term: "立春", phase: "末候", name: "魚陟負冰", houIndex: 3, globalHouIndex: 3 },
    },
    {
      id: "seventy-two-hou-next-lichun-third",
      target: lichunSecondBoundary,
      expected: { term: "雨水", phase: "初候", name: "獺祭魚", houIndex: 1, globalHouIndex: 4 },
    },
  ];

  for (const testCase of nextHouCases) {
    const actual = getNextHouBySolarTermRange(
      "立春",
      lichunStart,
      "雨水",
      yushuiStart,
      jingzheStart,
      testCase.target
    );
    seventyTwoHouVerifiedCaseCount += 1;
    assertSeventyTwoHouResult(testCase.id, actual, testCase.expected);
  }

  seventyTwoHouVerifiedCaseCount += 1;
  const atNextTerm = getCurrentHouBySolarTermRange("立春", lichunStart, yushuiStart, yushuiStart);
  if (atNextTerm !== null) {
    failures.push({
      id: "seventy-two-hou-lichun-next-term-start",
      key: "result",
      expected: null,
      actual: atNextTerm?.name,
    });
  }

  seventyTwoHouVerifiedCaseCount += 1;
  const crossYearHou = getCurrentHouBySolarTermRange(
    "冬至",
    "2025-12-21T00:00:00",
    "2026-01-05T00:00:00",
    "2026-01-01T12:00:00"
  );
  assertSeventyTwoHouResult("seventy-two-hou-cross-year", crossYearHou, {
    phase: "末候",
    name: "水泉動",
    houIndex: 3,
    globalHouIndex: 66,
  });

  seventyTwoHouVerifiedCaseCount += 1;
  const crossTermNextHou = getNextHouBySolarTermRange(
    "立春",
    lichunStart,
    "雨水",
    yushuiStart,
    null,
    lichunSecondBoundary
  );
  if (crossTermNextHou !== null) {
    failures.push({
      id: "seventy-two-hou-next-missing-after-next",
      key: "result",
      expected: null,
      actual: crossTermNextHou?.name,
    });
  }

  const invalidCases = [
    {
      id: "seventy-two-hou-invalid-term",
      args: ["不存在", lichunStart, yushuiStart, lichunStart],
    },
    {
      id: "seventy-two-hou-invalid-time",
      args: ["立春", "invalid", yushuiStart, lichunStart],
    },
    {
      id: "seventy-two-hou-invalid-range",
      args: ["立春", yushuiStart, lichunStart, lichunStart],
    },
  ];

  for (const testCase of invalidCases) {
    seventyTwoHouVerifiedCaseCount += 1;
    let actual;
    try {
      actual = getCurrentHouBySolarTermRange(...testCase.args);
    } catch (error) {
      failures.push({
        id: testCase.id,
        key: "throw",
        expected: "not throw",
        actual: error instanceof Error ? error.message : String(error),
      });
      continue;
    }

    if (actual !== null) {
      failures.push({
        id: testCase.id,
        key: "result",
        expected: null,
        actual: actual?.name,
      });
    }
  }

  seventyTwoHouVerifiedCaseCount += 1;
  let invalidNextHou = null;
  try {
    invalidNextHou = getNextHouBySolarTermRange(
      "不存在",
      lichunStart,
      "雨水",
      yushuiStart,
      jingzheStart,
      lichunStart
    );
  } catch (error) {
    failures.push({
      id: "seventy-two-hou-next-invalid-term",
      key: "throw",
      expected: "not throw",
      actual: error instanceof Error ? error.message : String(error),
    });
  }

  if (invalidNextHou !== null) {
    failures.push({
      id: "seventy-two-hou-next-invalid-term",
      key: "result",
      expected: null,
      actual: invalidNextHou?.name,
    });
  }

  seventyTwoHouVerifiedCaseCount += 1;
  const invalidTermDefinitions = getHouBySolarTerm("不存在");
  if (invalidTermDefinitions.length !== 0) {
    failures.push({
      id: "seventy-two-hou-invalid-term-definitions",
      key: "length",
      expected: 0,
      actual: invalidTermDefinitions.length,
    });
  }
}

function findSolarTermForTest(solarTerms, name, year) {
  return solarTerms.find((term) => term.name === name && term.year_taipei === year);
}

function formatLocalDateTimeForTest(timeMs) {
  const date = new Date(timeMs);
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  const millisecond = String(date.getMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}`;
}

function assertSeventyTwoHouResult(id, actual, expected) {
  if (!actual) {
    failures.push({
      id,
      key: "result",
      expected: "hou object",
      actual: actual,
    });
    return;
  }

  for (const [key, expectedValue] of Object.entries(expected)) {
    if (actual[key] !== expectedValue) {
      failures.push({
        id,
        key,
        expected: expectedValue,
        actual: actual[key],
      });
    }
  }
}
