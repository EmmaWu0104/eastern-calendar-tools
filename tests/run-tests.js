const TEST_TIME_ZONE = "Asia/Taipei";
process.env.TZ = TEST_TIME_ZONE;

const { readFile } = await import("node:fs/promises");
const { calculateBaziFromSolarTerms } = await import("../src/bazi.js");
const { getDailyGodsByStem } = await import("../src/dailyGods.js");
const {
  getClothingAdviceByDayBranch,
  getDailyClashByDayBranch,
  getDailyInfoByBranches,
  getSanfuByDateKey,
  getSeasonalMarkerByUpcomingTerm,
  getSuiPoByBranches,
  getTianSheBySeasonAndDayPillar,
  isGengDay,
} = await import("../src/dailyInfo.js");
const { SEXAGENARY_CYCLE } = await import("../src/ganzhi.js");
const {
  getEarthlyBranchIndex,
  getJianchuByBranches,
  getJianchuSequence,
} = await import("../src/jianchu.js");
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
  addQimenEffectiveDays,
  buildQimenTermRanges,
  buildQimenYuanRange,
  getQimenEffectiveDayStart,
  getQimenTimelineForRange,
  getQimenYuanByFuTou,
  isQimenFuTou,
  resolveQimenJu,
} = await import("../src/qimenResolver.js");
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

const [termsRaw, casesRaw, flyingStarsCasesRaw, jinhanYujingRaw, qimenYuanJuTableRaw] = await Promise.all([
  readFile(new URL("../data/solar_terms_1899_2101.json", import.meta.url), "utf8"),
  readFile(new URL("./testcases.json", import.meta.url), "utf8"),
  readFile(new URL("./flying-stars-testcases.json", import.meta.url), "utf8"),
  readFile(new URL("../data/jinhan_yujing_day_pan.json", import.meta.url), "utf8"),
  readFile(new URL("../data/qimen/qimen_yuan_ju_table.json", import.meta.url), "utf8"),
]);

const solarTerms = normalizeSolarTerms(JSON.parse(termsRaw));
const testCases = JSON.parse(casesRaw);
const flyingStarsTestCases = JSON.parse(flyingStarsCasesRaw);
const jinhanYujingData = JSON.parse(jinhanYujingRaw);
const qimenYuanJuTableData = JSON.parse(qimenYuanJuTableRaw);
const failures = [];
const pendingCases = [];
let verifiedCaseCount = 0;
let flyingStarsVerifiedCaseCount = 0;
let dailyGodsVerifiedCaseCount = 0;
let dailyInfoVerifiedCaseCount = 0;
let naYinVerifiedCaseCount = 0;
let jianchuVerifiedCaseCount = 0;
let jinhanDayPillarCount = 0;
let jinhanPanCount = 0;
let jinhanBlackYellowHourCount = 0;
let jinhanLookupVerifiedCaseCount = 0;
let jinhanDunTypeVerifiedCaseCount = 0;
let qimenYuanJuTermCount = 0;
let qimenPlateFileCount = 0;
let qimenPlateNullCount = 0;
let qimenHelperVerifiedCaseCount = 0;
let qimenResolverVerifiedCaseCount = 0;
let seventyTwoHouVerifiedCaseCount = 0;
let baziCurrentHouVerifiedCaseCount = 0;
let baziJianchuVerifiedCaseCount = 0;
let baziDailyInfoVerifiedCaseCount = 0;

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

const jianchuTestCases = [
  {
    id: "jianchu-si-si",
    monthBranch: "巳",
    dayBranch: "巳",
    expected: { name: "建", fullName: "建日", index: 0, monthBranch: "巳", dayBranch: "巳" },
  },
  {
    id: "jianchu-si-wu",
    monthBranch: "巳",
    dayBranch: "午",
    expected: { name: "除", fullName: "除日", index: 1, monthBranch: "巳", dayBranch: "午" },
  },
  {
    id: "jianchu-si-hai",
    monthBranch: "巳",
    dayBranch: "亥",
    expected: { name: "破", fullName: "破日", index: 6, monthBranch: "巳", dayBranch: "亥" },
  },
  {
    id: "jianchu-yin-yin",
    monthBranch: "寅",
    dayBranch: "寅",
    expected: { name: "建", fullName: "建日", index: 0, monthBranch: "寅", dayBranch: "寅" },
  },
  {
    id: "jianchu-yin-mao",
    monthBranch: "寅",
    dayBranch: "卯",
    expected: { name: "除", fullName: "除日", index: 1, monthBranch: "寅", dayBranch: "卯" },
  },
  {
    id: "jianchu-yin-shen",
    monthBranch: "寅",
    dayBranch: "申",
    expected: { name: "破", fullName: "破日", index: 6, monthBranch: "寅", dayBranch: "申" },
  },
  {
    id: "jianchu-zi-hai",
    monthBranch: "子",
    dayBranch: "亥",
    expected: { name: "閉", fullName: "閉日", index: 11, monthBranch: "子", dayBranch: "亥" },
  },
];

for (const testCase of jianchuTestCases) {
  const actual = getJianchuByBranches(testCase.monthBranch, testCase.dayBranch);
  jianchuVerifiedCaseCount += 1;

  if (!actual) {
    failures.push({
      id: testCase.id,
      key: "result",
      expected: "jianchu object",
      actual,
    });
    continue;
  }

  for (const [key, expectedValue] of Object.entries(testCase.expected)) {
    if (actual[key] !== expectedValue) {
      failures.push({
        id: testCase.id,
        key,
        expected: expectedValue,
        actual: actual[key],
      });
    }
  }
}

const invalidJianchuCases = [
  { id: "jianchu-invalid-month", monthBranch: "無", dayBranch: "巳" },
  { id: "jianchu-invalid-day", monthBranch: "巳", dayBranch: "無" },
];

for (const testCase of invalidJianchuCases) {
  jianchuVerifiedCaseCount += 1;
  let actual;
  try {
    actual = getJianchuByBranches(testCase.monthBranch, testCase.dayBranch);
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

jianchuVerifiedCaseCount += 1;
const jianchuSequence = getJianchuSequence();
if (jianchuSequence.length !== 12 || jianchuSequence[0] !== "建" || jianchuSequence[11] !== "閉") {
  failures.push({
    id: "jianchu-sequence",
    key: "sequence",
    expected: "12 items from 建 to 閉",
    actual: jianchuSequence.join(","),
  });
}

jianchuVerifiedCaseCount += 1;
if (getEarthlyBranchIndex("子") !== 0 || getEarthlyBranchIndex("亥") !== 11 || getEarthlyBranchIndex("無") !== -1) {
  failures.push({
    id: "jianchu-branch-index",
    key: "index",
    expected: "子=0, 亥=11, invalid=-1",
    actual: `子=${getEarthlyBranchIndex("子")}, 亥=${getEarthlyBranchIndex("亥")}, 無=${getEarthlyBranchIndex("無")}`,
  });
}

const jinhanStats = validateJinhanYujingData(jinhanYujingData);
jinhanDayPillarCount = jinhanStats.dayPillars;
jinhanPanCount = jinhanStats.pans;
jinhanBlackYellowHourCount = jinhanStats.blackYellowHours;

const qimenStats = await validateQimenData(qimenYuanJuTableData);
qimenYuanJuTermCount = qimenStats.termCount;
qimenPlateFileCount = qimenStats.plateFiles;
qimenPlateNullCount = qimenStats.nullPlates;

runJinhanYujingLookupTests();
runJinhanDunTypeV1Tests();
runQimenHelperTests();
runQimenResolverTests();
runDailyInfoTests();
runBaziCurrentHouTests(solarTerms);
runBaziJianchuTests(solarTerms);
runBaziDailyInfoTests(solarTerms);
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
  console.log(`每日資訊測試通過：${dailyInfoVerifiedCaseCount} cases`);
  console.log(`納音測試通過：${naYinVerifiedCaseCount} cases`);
  console.log(`建除十二神測試通過：${jianchuVerifiedCaseCount} cases`);
  console.log(
    `金函玉鏡資料檢查通過：${jinhanDayPillarCount} day pillars, ${jinhanPanCount} pans, ${jinhanBlackYellowHourCount} blackYellowHours`
  );
  console.log(`金函玉鏡查表測試通過：${jinhanLookupVerifiedCaseCount} cases`);
  console.log(`金函玉鏡超神接氣 v1 測試通過：${jinhanDunTypeVerifiedCaseCount} cases`);
  console.log(
    `奇門遁甲資料檢查通過：${qimenYuanJuTermCount} terms, ${qimenPlateFileCount} plate files, ${qimenPlateNullCount} null plates`
  );
  console.log(`奇門置閏法 helper 測試通過：${qimenHelperVerifiedCaseCount} cases`);
  console.log(`奇門置閏法 resolver 初版測試通過：${qimenResolverVerifiedCaseCount} cases`);
  console.log(`干支曆七十二候整合測試通過：${baziCurrentHouVerifiedCaseCount} cases`);
  console.log(`干支曆建除十二神整合測試通過：${baziJianchuVerifiedCaseCount} cases`);
  console.log(`干支曆每日資訊整合測試通過：${baziDailyInfoVerifiedCaseCount} cases`);
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

async function validateQimenData(yuanJuTable) {
  const expectedTerms = {
    冬至: { dunType: "yang", ju: { 上元: 1, 中元: 7, 下元: 4 } },
    小寒: { dunType: "yang", ju: { 上元: 2, 中元: 8, 下元: 5 } },
    大寒: { dunType: "yang", ju: { 上元: 3, 中元: 9, 下元: 6 } },
    立春: { dunType: "yang", ju: { 上元: 8, 中元: 5, 下元: 2 } },
    雨水: { dunType: "yang", ju: { 上元: 9, 中元: 6, 下元: 3 } },
    驚蟄: { dunType: "yang", ju: { 上元: 1, 中元: 7, 下元: 4 } },
    春分: { dunType: "yang", ju: { 上元: 3, 中元: 9, 下元: 6 } },
    清明: { dunType: "yang", ju: { 上元: 7, 中元: 1, 下元: 4 } },
    穀雨: { dunType: "yang", ju: { 上元: 5, 中元: 2, 下元: 8 } },
    立夏: { dunType: "yang", ju: { 上元: 4, 中元: 1, 下元: 7 } },
    小滿: { dunType: "yang", ju: { 上元: 5, 中元: 2, 下元: 8 } },
    芒種: { dunType: "yang", ju: { 上元: 6, 中元: 3, 下元: 9 } },
    夏至: { dunType: "yin", ju: { 上元: 9, 中元: 3, 下元: 6 } },
    小暑: { dunType: "yin", ju: { 上元: 8, 中元: 2, 下元: 5 } },
    大暑: { dunType: "yin", ju: { 上元: 7, 中元: 1, 下元: 4 } },
    立秋: { dunType: "yin", ju: { 上元: 2, 中元: 5, 下元: 8 } },
    處暑: { dunType: "yin", ju: { 上元: 1, 中元: 7, 下元: 4 } },
    白露: { dunType: "yin", ju: { 上元: 9, 中元: 3, 下元: 6 } },
    秋分: { dunType: "yin", ju: { 上元: 7, 中元: 1, 下元: 4 } },
    寒露: { dunType: "yin", ju: { 上元: 6, 中元: 3, 下元: 9 } },
    霜降: { dunType: "yin", ju: { 上元: 5, 中元: 8, 下元: 2 } },
    立冬: { dunType: "yin", ju: { 上元: 6, 中元: 9, 下元: 3 } },
    小雪: { dunType: "yin", ju: { 上元: 5, 中元: 8, 下元: 2 } },
    大雪: { dunType: "yin", ju: { 上元: 4, 中元: 7, 下元: 1 } },
  };
  const yuanNames = ["上元", "中元", "下元"];
  const terms = yuanJuTable.terms;
  const termNames = terms && typeof terms === "object" ? Object.keys(terms) : [];
  let plateFiles = 0;
  let nullPlates = 0;

  if (!yuanJuTable.meta?.schemaVersion) {
    failures.push({
      id: "qimen-yuan-ju-table",
      key: "meta.schemaVersion",
      expected: "present",
      actual: yuanJuTable.meta?.schemaVersion ?? "missing",
    });
  }

  if ("method" in (yuanJuTable.meta ?? {}) || "method" in yuanJuTable) {
    failures.push({
      id: "qimen-yuan-ju-table",
      key: "method",
      expected: "not present",
      actual: "present",
    });
  }

  if (!terms || typeof terms !== "object" || Array.isArray(terms)) {
    failures.push({
      id: "qimen-yuan-ju-table",
      key: "terms",
      expected: "object",
      actual: Array.isArray(terms) ? "array" : typeof terms,
    });
  }

  if (termNames.length !== 24) {
    failures.push({
      id: "qimen-yuan-ju-table",
      key: "termCount",
      expected: 24,
      actual: termNames.length,
    });
  }

  for (const [termName, expectedTerm] of Object.entries(expectedTerms)) {
    const actualTerm = terms?.[termName];
    if (!actualTerm) {
      failures.push({
        id: `qimen-yuan-ju-${termName}`,
        key: "term",
        expected: "present",
        actual: "missing",
      });
      continue;
    }

    if (actualTerm.dunType !== expectedTerm.dunType) {
      failures.push({
        id: `qimen-yuan-ju-${termName}`,
        key: "dunType",
        expected: expectedTerm.dunType,
        actual: actualTerm.dunType,
      });
    }

    if (!actualTerm.ju || typeof actualTerm.ju !== "object" || Array.isArray(actualTerm.ju)) {
      failures.push({
        id: `qimen-yuan-ju-${termName}`,
        key: "ju",
        expected: "object",
        actual: Array.isArray(actualTerm.ju) ? "array" : typeof actualTerm.ju,
      });
      continue;
    }

    const actualYuanNames = Object.keys(actualTerm.ju);
    for (const yuanName of actualYuanNames) {
      if (!yuanNames.includes(yuanName)) {
        failures.push({
          id: `qimen-yuan-ju-${termName}`,
          key: `ju.${yuanName}`,
          expected: "上元, 中元 or 下元",
          actual: yuanName,
        });
      }
    }

    for (const yuanName of yuanNames) {
      const actualJu = actualTerm.ju[yuanName];
      if (!Number.isInteger(actualJu) || actualJu < 1 || actualJu > 9) {
        failures.push({
          id: `qimen-yuan-ju-${termName}`,
          key: `ju.${yuanName}`,
          expected: "integer 1-9",
          actual: actualJu,
        });
      }

      if (actualJu !== expectedTerm.ju[yuanName]) {
        failures.push({
          id: `qimen-yuan-ju-${termName}`,
          key: `ju.${yuanName}`,
          expected: expectedTerm.ju[yuanName],
          actual: actualJu,
        });
      }
    }
  }

  const expectedPillarSet = new Set(SEXAGENARY_CYCLE);
  for (const dunType of ["yang", "yin"]) {
    for (let ju = 1; ju <= 9; ju += 1) {
      const filePath = `../data/qimen/plates/${dunType}/ju-${ju}.json`;
      let plateData;
      try {
        const raw = await readFile(new URL(filePath, import.meta.url), "utf8");
        plateData = JSON.parse(raw);
      } catch (error) {
        failures.push({
          id: `qimen-plate-${dunType}-ju-${ju}`,
          key: "file",
          expected: "existing parseable JSON",
          actual: error instanceof Error ? error.message : String(error),
        });
        continue;
      }

      plateFiles += 1;
      nullPlates += validateQimenPlateFile(dunType, ju, plateData, expectedPillarSet);
    }
  }

  return {
    termCount: termNames.length,
    plateFiles,
    nullPlates,
  };
}

function validateQimenPlateFile(dunType, ju, plateData, expectedPillarSet) {
  const id = `qimen-plate-${dunType}-ju-${ju}`;
  const expectedDunName = dunType === "yang" ? "陽遁" : "陰遁";
  const meta = plateData.meta;
  const plates = plateData.plates;
  let nullCount = 0;

  if (!meta?.schemaVersion) {
    failures.push({
      id,
      key: "meta.schemaVersion",
      expected: "present",
      actual: meta?.schemaVersion ?? "missing",
    });
  }

  if (meta?.dunType !== dunType) {
    failures.push({
      id,
      key: "meta.dunType",
      expected: dunType,
      actual: meta?.dunType,
    });
  }

  if (meta?.dunName !== expectedDunName) {
    failures.push({
      id,
      key: "meta.dunName",
      expected: expectedDunName,
      actual: meta?.dunName,
    });
  }

  if (meta?.ju !== ju) {
    failures.push({
      id,
      key: "meta.ju",
      expected: ju,
      actual: meta?.ju,
    });
  }

  if (meta?.plateCount !== 60) {
    failures.push({
      id,
      key: "meta.plateCount",
      expected: 60,
      actual: meta?.plateCount,
    });
  }

  if (!plates || typeof plates !== "object" || Array.isArray(plates)) {
    failures.push({
      id,
      key: "plates",
      expected: "object",
      actual: Array.isArray(plates) ? "array" : typeof plates,
    });
    return nullCount;
  }

  const plateKeys = Object.keys(plates);
  if (plateKeys.length !== 60) {
    failures.push({
      id,
      key: "plates.count",
      expected: 60,
      actual: plateKeys.length,
    });
  }

  for (const pillar of SEXAGENARY_CYCLE) {
    if (!(pillar in plates)) {
      failures.push({
        id,
        key: `plates.${pillar}`,
        expected: "present",
        actual: "missing",
      });
    }
  }

  for (const pillar of plateKeys) {
    if (!expectedPillarSet.has(pillar)) {
      failures.push({
        id,
        key: `plates.${pillar}`,
        expected: "60 sexagenary hour pillar",
        actual: pillar,
      });
    }

    if (plates[pillar] === null) {
      nullCount += 1;
      continue;
    }

    failures.push({
      id,
      key: `plates.${pillar}`,
      expected: null,
      actual: typeof plates[pillar],
    });
  }

  return nullCount;
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

function runQimenHelperTests() {
  const fuTouCases = [
    { id: "qimen-futou-jiazi", dayPillar: "甲子", expected: true },
    { id: "qimen-futou-jimao", dayPillar: "己卯", expected: true },
    { id: "qimen-futou-jihai", dayPillar: "己亥", expected: true },
    { id: "qimen-futou-yichou", dayPillar: "乙丑", expected: false },
    { id: "qimen-futou-gengwu", dayPillar: "庚午", expected: false },
    { id: "qimen-futou-empty", dayPillar: "", expected: false },
    { id: "qimen-futou-null", dayPillar: null, expected: false },
    { id: "qimen-futou-short", dayPillar: "甲", expected: false },
  ];

  for (const testCase of fuTouCases) {
    qimenHelperVerifiedCaseCount += 1;
    assertEqual(testCase.id, "result", testCase.expected, isQimenFuTou(testCase.dayPillar));
  }

  const yuanCases = [
    { id: "qimen-yuan-jiazi", dayPillar: "甲子", expected: "上元" },
    { id: "qimen-yuan-jimao", dayPillar: "己卯", expected: "上元" },
    { id: "qimen-yuan-jiawu", dayPillar: "甲午", expected: "上元" },
    { id: "qimen-yuan-jiyou", dayPillar: "己酉", expected: "上元" },
    { id: "qimen-yuan-jiayin", dayPillar: "甲寅", expected: "中元" },
    { id: "qimen-yuan-jisi", dayPillar: "己巳", expected: "中元" },
    { id: "qimen-yuan-jiashen", dayPillar: "甲申", expected: "中元" },
    { id: "qimen-yuan-jihai", dayPillar: "己亥", expected: "中元" },
    { id: "qimen-yuan-jiachen", dayPillar: "甲辰", expected: "下元" },
    { id: "qimen-yuan-jiwei", dayPillar: "己未", expected: "下元" },
    { id: "qimen-yuan-jiaxu", dayPillar: "甲戌", expected: "下元" },
    { id: "qimen-yuan-jichou", dayPillar: "己丑", expected: "下元" },
    { id: "qimen-yuan-invalid-yichou", dayPillar: "乙丑", expected: null },
    { id: "qimen-yuan-invalid-empty", dayPillar: "", expected: null },
    { id: "qimen-yuan-invalid-null", dayPillar: null, expected: null },
    { id: "qimen-yuan-invalid-short", dayPillar: "甲", expected: null },
  ];

  for (const testCase of yuanCases) {
    qimenHelperVerifiedCaseCount += 1;
    assertEqual(testCase.id, "result", testCase.expected, getQimenYuanByFuTou(testCase.dayPillar));
  }

  const effectiveDayCases = [
    {
      id: "qimen-effective-day-noon",
      input: "2027-12-22T12:00:00+08:00",
      expected: "2027-12-21T23:00:00+08:00",
    },
    {
      id: "qimen-effective-day-before-2300",
      input: "2027-12-22T22:59:59+08:00",
      expected: "2027-12-21T23:00:00+08:00",
    },
    {
      id: "qimen-effective-day-at-2300",
      input: "2027-12-22T23:00:00+08:00",
      expected: "2027-12-22T23:00:00+08:00",
    },
    {
      id: "qimen-effective-day-after-midnight",
      input: "2027-12-23T00:30:00+08:00",
      expected: "2027-12-22T23:00:00+08:00",
    },
  ];

  for (const testCase of effectiveDayCases) {
    qimenHelperVerifiedCaseCount += 1;
    assertEqual(testCase.id, "start", testCase.expected, getQimenEffectiveDayStart(testCase.input));
  }

  const addDayCases = [
    {
      id: "qimen-add-effective-days-5-winter",
      start: "2027-12-10T23:00:00+08:00",
      days: 5,
      expected: "2027-12-15T23:00:00+08:00",
    },
    {
      id: "qimen-add-effective-days-15-winter",
      start: "2027-12-10T23:00:00+08:00",
      days: 15,
      expected: "2027-12-25T23:00:00+08:00",
    },
    {
      id: "qimen-add-effective-days-5-summer",
      start: "2027-06-13T23:00:00+08:00",
      days: 5,
      expected: "2027-06-18T23:00:00+08:00",
    },
  ];

  for (const testCase of addDayCases) {
    qimenHelperVerifiedCaseCount += 1;
    assertEqual(testCase.id, "result", testCase.expected, addQimenEffectiveDays(testCase.start, testCase.days));
  }

  const yuanRange = buildQimenYuanRange({
    qimenSolarTerm: "大雪",
    yuan: "上元",
    start: "2027-12-10T23:00:00+08:00",
    isIntercalary: true,
  });
  qimenHelperVerifiedCaseCount += 1;
  assertQimenRange("qimen-build-yuan-range", yuanRange, {
    qimenSolarTerm: "大雪",
    yuan: "上元",
    start: "2027-12-10T23:00:00+08:00",
    end: "2027-12-15T23:00:00+08:00",
    isIntercalary: true,
  });

  const termRanges = buildQimenTermRanges({
    qimenSolarTerm: "大雪",
    start: "2027-12-10T23:00:00+08:00",
    isIntercalary: true,
  });
  qimenHelperVerifiedCaseCount += 1;
  assertEqual("qimen-build-term-ranges", "length", 3, termRanges.length);
  const expectedRanges = [
    {
      qimenSolarTerm: "大雪",
      yuan: "上元",
      start: "2027-12-10T23:00:00+08:00",
      end: "2027-12-15T23:00:00+08:00",
      isIntercalary: true,
    },
    {
      qimenSolarTerm: "大雪",
      yuan: "中元",
      start: "2027-12-15T23:00:00+08:00",
      end: "2027-12-20T23:00:00+08:00",
      isIntercalary: true,
    },
    {
      qimenSolarTerm: "大雪",
      yuan: "下元",
      start: "2027-12-20T23:00:00+08:00",
      end: "2027-12-25T23:00:00+08:00",
      isIntercalary: true,
    },
  ];

  for (const [index, expectedRange] of expectedRanges.entries()) {
    assertQimenRange(`qimen-build-term-ranges-${index + 1}`, termRanges[index], expectedRange);
  }

  const intercalaryTimeline = getQimenTimelineForRange(
    "2027-12-10T23:00:00+08:00",
    "2027-12-25T23:00:00+08:00"
  );
  qimenHelperVerifiedCaseCount += 1;
  assertEqual("qimen-timeline-intercalary-daxue", "length", 3, intercalaryTimeline.length);
  for (const [index, expectedRange] of expectedRanges.entries()) {
    assertQimenRange(
      `qimen-timeline-intercalary-daxue-${index + 1}`,
      intercalaryTimeline[index],
      expectedRange
    );
  }
}

function assertQimenRange(id, actual, expected) {
  for (const [key, expectedValue] of Object.entries(expected)) {
    assertEqual(id, key, expectedValue, actual?.[key]);
  }
}

function runQimenResolverTests() {
  const testCases = [
    {
      id: "qimen-2027-mangzhong-middle",
      input: "2027-06-06T12:00:00+08:00",
      expected: {
        actualSolarTerm: "芒種",
        qimenSolarTerm: "芒種",
        yuan: "中元",
        dunType: "yang",
        dunName: "陽遁",
        ju: 3,
        isIntercalary: false,
      },
    },
    {
      id: "qimen-2027-mangzhong-lower",
      input: "2027-06-13T12:00:00+08:00",
      expected: {
        qimenSolarTerm: "芒種",
        yuan: "下元",
        dunType: "yang",
        dunName: "陽遁",
        ju: 9,
        isIntercalary: false,
      },
    },
    {
      id: "qimen-2027-early-xiazhi-yin",
      input: "2027-06-14T12:00:00+08:00",
      expected: {
        actualSolarTerm: "芒種",
        qimenSolarTerm: "夏至",
        status: "超神",
        yuan: "上元",
        dunType: "yin",
        dunName: "陰遁",
        ju: 9,
        isIntercalary: false,
      },
    },
    {
      id: "qimen-2027-actual-xiazhi",
      input: "2027-06-22T00:30:00+08:00",
      expected: {
        actualSolarTerm: "夏至",
        qimenSolarTerm: "夏至",
        dunType: "yin",
        dunName: "陰遁",
      },
    },
    {
      id: "qimen-2027-daxue-lower",
      input: "2027-12-07T18:00:00+08:00",
      expected: {
        actualSolarTerm: "大雪",
        qimenSolarTerm: "大雪",
        yuan: "下元",
        dunType: "yin",
        dunName: "陰遁",
        ju: 1,
        isIntercalary: false,
      },
    },
    {
      id: "qimen-2027-daxue-intercalary-upper",
      input: "2027-12-11T12:00:00+08:00",
      expected: {
        actualSolarTerm: "大雪",
        qimenSolarTerm: "大雪",
        status: "置閏",
        yuan: "上元",
        dunType: "yin",
        dunName: "陰遁",
        ju: 4,
        isIntercalary: true,
      },
    },
    {
      id: "qimen-2027-daxue-intercalary-middle",
      input: "2027-12-16T12:00:00+08:00",
      expected: {
        qimenSolarTerm: "大雪",
        yuan: "中元",
        dunType: "yin",
        dunName: "陰遁",
        ju: 7,
        isIntercalary: true,
      },
    },
    {
      id: "qimen-2027-dongzhi-still-intercalary-daxue",
      input: "2027-12-22T12:00:00+08:00",
      expected: {
        actualSolarTerm: "冬至",
        qimenSolarTerm: "大雪",
        status: "置閏後接氣",
        yuan: "下元",
        dunType: "yin",
        dunName: "陰遁",
        ju: 1,
        isIntercalary: true,
      },
    },
    {
      id: "qimen-2027-daxue-intercalary-lower-end",
      input: "2027-12-25T12:00:00+08:00",
      expected: {
        qimenSolarTerm: "大雪",
        yuan: "下元",
        dunType: "yin",
        dunName: "陰遁",
        ju: 1,
        isIntercalary: true,
      },
    },
    {
      id: "qimen-2027-dongzhi-upper-yang",
      input: "2027-12-26T12:00:00+08:00",
      expected: {
        actualSolarTerm: "冬至",
        qimenSolarTerm: "冬至",
        yuan: "上元",
        dunType: "yang",
        dunName: "陽遁",
        ju: 1,
        isIntercalary: false,
      },
    },
  ];

  for (const testCase of testCases) {
    const actual = resolveQimenJu(testCase.input);
    qimenResolverVerifiedCaseCount += 1;

    for (const [key, expectedValue] of Object.entries(testCase.expected)) {
      assertEqual(testCase.id, key, expectedValue, actual[key]);
    }

    if (typeof actual.hourPillar !== "string" || actual.hourPillar.length !== 2) {
      failures.push({
        id: testCase.id,
        key: "hourPillar",
        expected: "two-character pillar",
        actual: actual.hourPillar,
      });
    }
  }
}

function runDailyInfoTests() {
  const clothingCases = [
    {
      id: "daily-info-clothing-wu",
      dayBranch: "午",
      expected: { dayElement: "火", best: "土", good: "火", avoid: "木" },
    },
    {
      id: "daily-info-clothing-zi",
      dayBranch: "子",
      expected: { dayElement: "水", best: "木", good: "水", avoid: "金" },
    },
  ];

  for (const testCase of clothingCases) {
    const actual = getClothingAdviceByDayBranch(testCase.dayBranch);
    dailyInfoVerifiedCaseCount += 1;

    if (!actual) {
      failures.push({
        id: testCase.id,
        key: "clothing",
        expected: "clothing object",
        actual,
      });
      continue;
    }

    assertEqual(testCase.id, "dayElement", testCase.expected.dayElement, actual.dayElement);
    assertEqual(testCase.id, "best.element", testCase.expected.best, actual.best.element);
    assertEqual(testCase.id, "good.element", testCase.expected.good, actual.good.element);
    assertEqual(testCase.id, "avoid.element", testCase.expected.avoid, actual.avoid.element);
  }

  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-clothing-invalid", "result", null, getClothingAdviceByDayBranch("無"));

  const clashCases = [
    { id: "daily-info-clash-wu", dayBranch: "午", expectedLabel: "衝煞：鼠" },
    { id: "daily-info-clash-zi", dayBranch: "子", expectedLabel: "衝煞：馬" },
    { id: "daily-info-clash-si", dayBranch: "巳", expectedLabel: "衝煞：豬" },
  ];

  for (const testCase of clashCases) {
    const actual = getDailyClashByDayBranch(testCase.dayBranch);
    dailyInfoVerifiedCaseCount += 1;
    assertEqual(testCase.id, "label", testCase.expectedLabel, actual?.label);
  }

  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-clash-invalid", "result", null, getDailyClashByDayBranch("無"));

  const suiPoCases = [
    {
      id: "daily-info-suipo-true",
      yearBranch: "午",
      dayBranch: "子",
      expected: { isSuiPo: true, label: "歲破日" },
    },
    {
      id: "daily-info-suipo-false",
      yearBranch: "午",
      dayBranch: "午",
      expected: { isSuiPo: false, label: "" },
    },
  ];

  for (const testCase of suiPoCases) {
    const actual = getSuiPoByBranches(testCase.yearBranch, testCase.dayBranch);
    dailyInfoVerifiedCaseCount += 1;
    assertEqual(testCase.id, "isSuiPo", testCase.expected.isSuiPo, actual?.isSuiPo);
    assertEqual(testCase.id, "label", testCase.expected.label, actual?.label);
  }

  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-suipo-invalid", "result", null, getSuiPoByBranches("午", "無"));

  const seasonalCases = [
    { id: "daily-info-seasonal-chunfen", term: "春分", flag: true, expectedLabel: "離日：木離日" },
    { id: "daily-info-seasonal-xiazhi", term: "夏至", flag: true, expectedLabel: "離日：火離日" },
    { id: "daily-info-seasonal-lichun", term: "立春", flag: true, expectedLabel: "絕日：木旺水絕" },
    { id: "daily-info-seasonal-lidong", term: "立冬", flag: true, expectedLabel: "絕日：水旺金絕" },
  ];

  for (const testCase of seasonalCases) {
    const actual = getSeasonalMarkerByUpcomingTerm(testCase.term, testCase.flag);
    dailyInfoVerifiedCaseCount += 1;
    assertEqual(testCase.id, "label", testCase.expectedLabel, actual?.label);
  }

  dailyInfoVerifiedCaseCount += 1;
  assertEqual(
    "daily-info-seasonal-not-previous-day",
    "result",
    null,
    getSeasonalMarkerByUpcomingTerm("春分", false)
  );

  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-seasonal-not-marker", "result", null, getSeasonalMarkerByUpcomingTerm("小暑", true));

  const tianSheCases = [
    { id: "daily-info-tianshe-spring", season: "春季", dayPillar: "戊寅", expected: true },
    { id: "daily-info-tianshe-summer", season: "夏季", dayPillar: "甲午", expected: true },
    { id: "daily-info-tianshe-autumn", season: "秋季", dayPillar: "戊申", expected: true },
    { id: "daily-info-tianshe-winter", season: "冬季", dayPillar: "甲子", expected: true },
    { id: "daily-info-tianshe-false", season: "春季", dayPillar: "甲子", expected: false },
  ];

  for (const testCase of tianSheCases) {
    const actual = getTianSheBySeasonAndDayPillar(testCase.season, testCase.dayPillar);
    dailyInfoVerifiedCaseCount += 1;
    assertEqual(testCase.id, "isTianShe", testCase.expected, actual?.isTianShe);
  }

  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-tianshe-invalid", "result", null, getTianSheBySeasonAndDayPillar("無", "甲子"));

  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-geng-day-true", "isGengDay", true, isGengDay("庚午"));

  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-geng-day-false", "isGengDay", false, isGengDay("辛未"));

  const sanfuDateKeys = {
    "初伏": "2026-07-15",
    "中伏": "2026-07-25",
    "末伏": "2026-08-14",
  };
  const sanfuCases = [
    { id: "daily-info-sanfu-chufu", dateKey: "2026-07-15", expectedType: "初伏" },
    { id: "daily-info-sanfu-zhongfu", dateKey: "2026-07-25", expectedType: "中伏" },
    { id: "daily-info-sanfu-mofu", dateKey: "2026-08-14", expectedType: "末伏" },
  ];

  for (const testCase of sanfuCases) {
    const actual = getSanfuByDateKey(testCase.dateKey, sanfuDateKeys);
    dailyInfoVerifiedCaseCount += 1;
    assertEqual(testCase.id, "type", testCase.expectedType, actual?.type);
  }

  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-sanfu-none", "result", null, getSanfuByDateKey("2026-07-16", sanfuDateKeys));

  const dailyInfo = getDailyInfoByBranches({
    yearBranch: "子",
    dayPillar: "丙午",
    upcomingTermName: "春分",
    isPreviousEffectiveDay: true,
    season: "夏季",
    dateKey: "2026-07-15",
    sanfuDateKeys,
  });
  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-summary-clothing", "dayElement", "火", dailyInfo.clothing?.dayElement);
  assertEqual("daily-info-summary-clash", "label", "衝煞：鼠", dailyInfo.clash?.label);
  assertEqual("daily-info-summary-suipo", "isSuiPo", true, dailyInfo.suiPo?.isSuiPo);
  assertEqual("daily-info-summary-sanfu", "type", "初伏", dailyInfo.sanfu?.type);

  const dailyInfoTianShe = getDailyInfoByBranches({
    yearBranch: "午",
    dayPillar: "甲午",
    season: "夏季",
  });
  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-summary-tianshe", "isTianShe", true, dailyInfoTianShe.tianShe?.isTianShe);
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

function runBaziJianchuTests(solarTerms) {
  const testCases = [
    {
      id: "bazi-jianchu-si-month-hai-day",
      input: "2026-05-25T12:00:00",
      expected: {
        fullName: "破日",
        index: 6,
        monthBranch: "巳",
        dayBranch: "亥",
      },
    },
    {
      id: "bazi-jianchu-before-2300",
      input: "2026-05-29T22:59:00",
      expected: {
        fullName: "開日",
        monthBranch: "巳",
        dayBranchFromPillar: true,
      },
    },
    {
      id: "bazi-jianchu-after-2300",
      input: "2026-05-29T23:00:00",
      expected: {
        fullName: "閉日",
        monthBranch: "巳",
        dayBranchFromPillar: true,
      },
    },
  ];

  for (const testCase of testCases) {
    const actual = calculateBaziFromSolarTerms(testCase.input, solarTerms);
    baziJianchuVerifiedCaseCount += 1;

    if (!actual.jianchu) {
      failures.push({
        id: testCase.id,
        key: "jianchu",
        expected: "jianchu object",
        actual: actual.jianchu,
      });
      continue;
    }

    for (const [key, expectedValue] of Object.entries(testCase.expected)) {
      if (key === "dayBranchFromPillar") {
        const expectedDayBranch = actual.dayPillar[1];
        if (actual.jianchu.dayBranch !== expectedDayBranch) {
          failures.push({
            id: testCase.id,
            key: "jianchu.dayBranch",
            expected: expectedDayBranch,
            actual: actual.jianchu.dayBranch,
          });
        }
        continue;
      }

      if (actual.jianchu[key] !== expectedValue) {
        failures.push({
          id: testCase.id,
          key: `jianchu.${key}`,
          expected: expectedValue,
          actual: actual.jianchu[key],
        });
      }
    }
  }

  const beforeSwitch = calculateBaziFromSolarTerms("2026-05-29T22:59:00", solarTerms);
  const afterSwitch = calculateBaziFromSolarTerms("2026-05-29T23:00:00", solarTerms);
  baziJianchuVerifiedCaseCount += 1;
  if (beforeSwitch.jianchu?.dayBranch === afterSwitch.jianchu?.dayBranch) {
    failures.push({
      id: "bazi-jianchu-2300-day-branch-switch",
      key: "dayBranch",
      expected: "changed at 23:00",
      actual: beforeSwitch.jianchu?.dayBranch,
    });
  }
}

function runBaziDailyInfoTests(solarTerms) {
  const noonWuDay = calculateBaziFromSolarTerms("2026-05-20T12:00:00", solarTerms);
  baziDailyInfoVerifiedCaseCount += 1;
  if (!noonWuDay.dailyInfo) {
    failures.push({
      id: "bazi-daily-info-exists",
      key: "dailyInfo",
      expected: "dailyInfo object",
      actual: noonWuDay.dailyInfo,
    });
  } else {
    assertEqual("bazi-daily-info-clothing-element", "dayElement", "火", noonWuDay.dailyInfo.clothing?.dayElement);
    assertEqual("bazi-daily-info-clothing-best", "best.element", "土", noonWuDay.dailyInfo.clothing?.best?.element);
    assertEqual("bazi-daily-info-clash", "label", "衝煞：鼠", noonWuDay.dailyInfo.clash?.label);
    assertEqual("bazi-daily-info-tianshe-summer", "isTianShe", true, noonWuDay.dailyInfo.tianShe?.isTianShe);
  }

  const suiPoDay = calculateBaziFromSolarTerms("2026-02-07T12:00:00", solarTerms);
  baziDailyInfoVerifiedCaseCount += 1;
  assertEqual("bazi-daily-info-suipo", "isSuiPo", true, suiPoDay.dailyInfo?.suiPo?.isSuiPo);
  assertEqual("bazi-daily-info-suipo-label", "label", "歲破日", suiPoDay.dailyInfo?.suiPo?.label);

  const springTianShe = calculateBaziFromSolarTerms("2026-03-05T12:00:00", solarTerms);
  baziDailyInfoVerifiedCaseCount += 1;
  assertEqual("bazi-daily-info-tianshe-spring", "isTianShe", true, springTianShe.dailyInfo?.tianShe?.isTianShe);

  const autumnTianShe = calculateBaziFromSolarTerms("2026-10-01T12:00:00", solarTerms);
  baziDailyInfoVerifiedCaseCount += 1;
  assertEqual("bazi-daily-info-tianshe-autumn", "isTianShe", true, autumnTianShe.dailyInfo?.tianShe?.isTianShe);

  const winterTianShe = calculateBaziFromSolarTerms("2026-12-16T12:00:00", solarTerms);
  baziDailyInfoVerifiedCaseCount += 1;
  assertEqual("bazi-daily-info-tianshe-winter", "isTianShe", true, winterTianShe.dailyInfo?.tianShe?.isTianShe);

  const springMarker = calculateBaziFromSolarTerms("2026-03-19T12:00:00", solarTerms);
  baziDailyInfoVerifiedCaseCount += 1;
  assertEqual(
    "bazi-daily-info-seasonal-spring-marker",
    "label",
    "離日：木離日",
    springMarker.dailyInfo?.seasonalMarker?.label
  );

  const lichunMarker = calculateBaziFromSolarTerms("2026-02-03T12:00:00", solarTerms);
  baziDailyInfoVerifiedCaseCount += 1;
  assertEqual(
    "bazi-daily-info-seasonal-lichun-marker",
    "label",
    "絕日：木旺水絕",
    lichunMarker.dailyInfo?.seasonalMarker?.label
  );

  const after2300Marker = calculateBaziFromSolarTerms("1914-02-04T22:00:00", solarTerms);
  baziDailyInfoVerifiedCaseCount += 1;
  assertEqual(
    "bazi-daily-info-seasonal-2300-effective-day",
    "label",
    "絕日：木旺水絕",
    after2300Marker.dailyInfo?.seasonalMarker?.label
  );

  const sanfuCases = [
    { id: "bazi-daily-info-sanfu-chufu", input: "2026-07-15T12:00:00", expectedType: "初伏" },
    { id: "bazi-daily-info-sanfu-zhongfu", input: "2026-07-25T12:00:00", expectedType: "中伏" },
    { id: "bazi-daily-info-sanfu-mofu", input: "2026-08-14T12:00:00", expectedType: "末伏" },
  ];

  for (const testCase of sanfuCases) {
    const actual = calculateBaziFromSolarTerms(testCase.input, solarTerms);
    baziDailyInfoVerifiedCaseCount += 1;
    assertEqual(testCase.id, "sanfu.type", testCase.expectedType, actual.dailyInfo?.sanfu?.type);
  }

  const beforeSwitch = calculateBaziFromSolarTerms("2026-05-29T22:59:00", solarTerms);
  const afterSwitch = calculateBaziFromSolarTerms("2026-05-29T23:00:00", solarTerms);
  baziDailyInfoVerifiedCaseCount += 1;
  assertEqual(
    "bazi-daily-info-before-2300-day-branch",
    "clothing.dayBranch",
    beforeSwitch.dayPillar[1],
    beforeSwitch.dailyInfo?.clothing?.dayBranch
  );
  assertEqual(
    "bazi-daily-info-after-2300-day-branch",
    "clothing.dayBranch",
    afterSwitch.dayPillar[1],
    afterSwitch.dailyInfo?.clothing?.dayBranch
  );

  if (beforeSwitch.dailyInfo?.clash?.label === afterSwitch.dailyInfo?.clash?.label) {
    failures.push({
      id: "bazi-daily-info-2300-clash-switch",
      key: "clash.label",
      expected: "changed at 23:00 with day branch",
      actual: beforeSwitch.dailyInfo?.clash?.label,
    });
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

function assertEqual(id, key, expected, actual) {
  if (actual !== expected) {
    failures.push({
      id,
      key,
      expected,
      actual,
    });
  }
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
