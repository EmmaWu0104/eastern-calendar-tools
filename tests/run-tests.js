const TEST_TIME_ZONE = "Asia/Taipei";
process.env.TZ = TEST_TIME_ZONE;

const { readFile } = await import("node:fs/promises");
const { calculateBaziFromSolarTerms } = await import("../src/bazi.js");
const { getDailyGodsByStem } = await import("../src/dailyGods.js");
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

const [termsRaw, casesRaw, flyingStarsCasesRaw] = await Promise.all([
  readFile(new URL("../data/solar_terms_1899_2101.json", import.meta.url), "utf8"),
  readFile(new URL("./testcases.json", import.meta.url), "utf8"),
  readFile(new URL("./flying-stars-testcases.json", import.meta.url), "utf8"),
]);

const solarTerms = normalizeSolarTerms(JSON.parse(termsRaw));
const testCases = JSON.parse(casesRaw);
const flyingStarsTestCases = JSON.parse(flyingStarsCasesRaw);
const failures = [];
const pendingCases = [];
let verifiedCaseCount = 0;
let flyingStarsVerifiedCaseCount = 0;
let dailyGodsVerifiedCaseCount = 0;
let naYinVerifiedCaseCount = 0;

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
