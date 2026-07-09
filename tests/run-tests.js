const TEST_TIME_ZONE = "Asia/Taipei";
process.env.TZ = TEST_TIME_ZONE;

const {
  getAnnualAfflictionBadgesByPalace,
  getAnnualAfflictionsByYearBranch,
} = await import("../src/annualAfflictions.js");
const { access, readdir, readFile } = await import("node:fs/promises");
const { calculateBaziFromSolarTerms } = await import("../src/bazi.js");
const { getDailyGodsByStem } = await import("../src/dailyGods.js");
const {
  getClothingAdviceByDayBranch,
  getDaHuangDaoFortune,
  getDailyDaHuangDao,
  getDailyClashByDayBranch,
  getDailyInfoByBranches,
  getSanfuByDateKey,
  getSeasonalMarkerByUpcomingTerm,
  getSuiPoByBranches,
  getTianSheBySeasonAndDayPillar,
  isGengDay,
} = await import("../src/dailyInfo.js");
const { getDongGongDaySelection } = await import("../src/dongGongDaySelection.js");
const { SEXAGENARY_CYCLE } = await import("../src/ganzhi.js");
const {
  getEarthlyBranchIndex,
  getJianchuByBranches,
  getJianchuSequence,
} = await import("../src/jianchu.js");
const {
  calculateGuiDengHourBranches,
  calculateGuiDengWithSunTimes,
} = await import("../src/guideng.js");
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
  parseQimen1080Markdown,
} = await import("../src/qimen1080MarkdownParser.js");
const {
  buildQimen1080DryRunReport,
  convertQimen1080ParsedToDryRun,
} = await import("../src/qimen1080ConverterDryRun.js");
const {
  clearQimen1080PreviewOutput,
  writeQimen1080PreviewFiles,
} = await import("../src/qimen1080PreviewWriter.js");
const {
  buildQimen1080FormalPlateAdapterReport,
} = await import("../src/qimen1080FormalPlateAdapter.js");
const {
  clearQimen1080FormalCandidateOutput,
  writeQimen1080FormalCandidateFiles,
} = await import("../src/qimen1080FormalCandidateWriter.js");
const {
  QIMEN_PALACE_KEYS,
  QIMEN_PALACE_META,
  validateQimenPlateFile: validateQimenPlateSchemaFile,
} = await import("../src/qimenPlateValidation.js");
const {
  addQimenEffectiveDays,
  analyzeQimenIntercalationCandidate,
  analyzeQimenIntercalationWindowsForYear,
  analyzeQimenIntercalationWindowsForYearAuto,
  buildQimenFullTermCycleDraftInputForYear,
  buildQimenFullTermCycleTimelineDraftForYear,
  buildQimenMultiYearFullTermCycleTimelineDraft,
  buildQimenIntercalationWindowCandidatesForYear,
  buildQimenFullTermSeedCycle,
  buildQimenSequentialTermSeeds,
  buildQimenTimelineFromFullTermSeedCycle,
  buildQimenTimelineFromYearSeedRecommendations,
  buildQimenYearSeedRecommendations,
  buildSeedDrivenQimenTimelineFixture2027,
  buildQimenTermRanges,
  buildQimenTermAssignmentsFromSeeds,
  buildQimenTimelineFromFuTouDays,
  buildQimenTimelineFromFuTouSeeds,
  buildQimenYuanRange,
  clearQimenFullTermCycleTimelineDraftCache,
  getDayPillarForEffectiveDay,
  getQimenFullTermCycleTimelineDraftCacheStats,
  getQimenFullTermCycleTimelineDraftForYearCached,
  findQimenTimelineEntry,
  findQimenFullTermCycleTimelineDraftEntry,
  findQimenFullTermCycleTimelineDraftEntryCached,
  getQimenEffectiveDayStart,
  getQimenTimelineForRange,
  getQimenYuanByFuTou,
  isQimenFuTou,
  resolveQimenJu,
  resolveQimenJuFromFullTermCycleDraft,
  resolveQimenJuFromFullTermCycleDraftCached,
  scanQimenFuTouDays,
} = await import("../src/qimenResolver.js");
const { getQimenPlate } = await import("../src/qimenPlateLookup.js");
const {
  decorateQimenPlateMarkers,
  findQimenDisplayZhiFuPalaceKey,
  findQimenTianRuiPalaceKey,
  getQimenCenterStemPlacements,
  getQimenDoorPoMarker,
  getQimenHeavenStemMarker,
} = await import("../src/qimenPlateMarkers.js");
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

const [
  termsRaw,
  casesRaw,
  flyingStarsCasesRaw,
  jinhanYujingRaw,
  qimenYuanJuTableRaw,
  qimen1080MarkdownRaw,
  dongGongDataRaw,
  dongGongModuleRaw,
] = await Promise.all([
  readFile(new URL("../data/solar_terms_1899_2101.json", import.meta.url), "utf8"),
  readFile(new URL("./testcases.json", import.meta.url), "utf8"),
  readFile(new URL("./flying-stars-testcases.json", import.meta.url), "utf8"),
  readFile(new URL("../data/jinhan_yujing_day_pan.json", import.meta.url), "utf8"),
  readFile(new URL("../data/qimen/qimen_yuan_ju_table.json", import.meta.url), "utf8"),
  readFile(new URL("../data/1080.md", import.meta.url), "utf8"),
  readFile(new URL("../data/dong_gong_day_selection.json", import.meta.url), "utf8"),
  readFile(new URL("../src/dongGongDaySelection.js", import.meta.url), "utf8"),
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
let qimenPlateObjectCount = 0;
let qimenHelperVerifiedCaseCount = 0;
let qimenFuTouScanVerifiedCaseCount = 0;
let qimenTermAssignmentVerifiedCaseCount = 0;
let qimenTimelineBuildVerifiedCaseCount = 0;
let qimenTimelineFromSeedFlowVerifiedCaseCount = 0;
let qimenSeedDrivenFixtureVerifiedCaseCount = 0;
let qimenIntercalationCandidateVerifiedCaseCount = 0;
let qimenIntercalationWindowYearVerifiedCaseCount = 0;
let qimenIntercalationWindowCandidateAutoVerifiedCaseCount = 0;
let qimenSequentialTermSeedVerifiedCaseCount = 0;
let qimenFullTermSeedCycleVerifiedCaseCount = 0;
let qimenFullTermSeedCycleTimelineVerifiedCaseCount = 0;
let qimenFullTermCycleDraftInputVerifiedCaseCount = 0;
let qimenFullTermCycleTimelineDraftForYearVerifiedCaseCount = 0;
let qimenFullTermCycleTimelineDraftCrossYearVerifiedCaseCount = 0;
let qimenFullTermCycleTimelineDraftMultiYearObservationVerifiedCaseCount = 0;
let qimenMultiYearFullTermCycleTimelineDraftVerifiedCaseCount = 0;
let qimenMultiYearFullRangeDiagnosticsVerifiedCaseCount = 0;
let qimenMultiYearDuplicateDetailDiagnosticsVerifiedCaseCount = 0;
let qimenFullTermCycleTimelineDraftLookupVerifiedCaseCount = 0;
let qimenFullTermCycleTimelineDraftLookupDuplicateBoundaryVerifiedCaseCount = 0;
let qimenFullTermCycleTimelineDraftLookupResolverAlignmentVerifiedCaseCount = 0;
let qimenFullTermCycleDraftResolverFormatterVerifiedCaseCount = 0;
let qimenFullTermCycleDraftResolverFormatterRegressionVerifiedCaseCount = 0;
let qimenFullTermCycleDraftResolverFormatterDuplicateBoundaryVerifiedCaseCount = 0;
let qimenFullTermCycleDraftCacheVerifiedCaseCount = 0;
let qimenFullTermCycleTimelineDraftCachedLookupVerifiedCaseCount = 0;
let qimenFullTermCycleDraftCachedResolverFormatterVerifiedCaseCount = 0;
let qimenFullTermCycleDraftCachedResolverFormatterRegressionVerifiedCaseCount = 0;
let qimenFullTermCycleDraftCachedResolverFormatterDuplicateBoundaryVerifiedCaseCount = 0;
let qimenFullTermCycleDraftCachedResolverFormatterFullRangeDiagnosticsVerifiedCaseCount = 0;
let qimenFullTermCycleDraftResolverFormatterCacheReplacementVerifiedCaseCount = 0;
let qimenPlateLookupVerifiedCaseCount = 0;
let qimenPlateValidationVerifiedCaseCount = 0;
let qimenPlateMarkersVerifiedCaseCount = 0;
let qimen1080MarkdownParserVerifiedCaseCount = 0;
let qimen1080ConverterDryRunVerifiedCaseCount = 0;
let qimen1080PreviewWriterVerifiedCaseCount = 0;
let qimen1080FormalPlateAdapterVerifiedCaseCount = 0;
let qimen1080FormalCandidateWriterVerifiedCaseCount = 0;
let qimenYearSeedRecommendationVerifiedCaseCount = 0;
let qimenTimelineFromYearSeedRecommendationVerifiedCaseCount = 0;
let qimenResolverVerifiedCaseCount = 0;
let seventyTwoHouVerifiedCaseCount = 0;
let baziCurrentHouVerifiedCaseCount = 0;
let baziJianchuVerifiedCaseCount = 0;
let baziDailyInfoVerifiedCaseCount = 0;
let guiDengVerifiedCaseCount = 0;
let annualAfflictionsVerifiedCaseCount = 0;
let dongGongVerifiedCaseCount = 0;

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
qimenPlateObjectCount = qimenStats.plateObjects;

runJinhanYujingLookupTests();
runJinhanDunTypeV1Tests();
runQimenHelperTests();
runQimenFuTouScanTests();
runQimenTermAssignmentTests();
runQimenTimelineBuildTests();
runQimenTimelineFromSeedFlowTests();
runQimenSeedDrivenFixtureTests();
runQimenIntercalationCandidateTests();
runQimenIntercalationWindowYearTests();
runQimenIntercalationWindowCandidateAutoTests();
runQimenSequentialTermSeedTests();
runQimenFullTermSeedCycleTests();
runQimenFullTermSeedCycleTimelineTests();
runQimenFullTermCycleDraftInputTests();
runQimenFullTermCycleTimelineDraftForYearTests();
runQimenFullTermCycleTimelineDraftCrossYearTests();
runQimenFullTermCycleTimelineDraftMultiYearObservationTests();
runQimenMultiYearFullTermCycleTimelineDraftTests();
runQimenMultiYearFullRangeDiagnosticsTests();
runQimenMultiYearDuplicateDetailDiagnosticsTests();
runQimenFullTermCycleTimelineDraftLookupTests();
runQimenFullTermCycleTimelineDraftLookupDuplicateBoundaryTests();
runQimenFullTermCycleTimelineDraftLookupResolverAlignmentTests();
runQimenFullTermCycleDraftResolverFormatterTests();
runQimenFullTermCycleDraftResolverFormatterRegressionTests();
runQimenFullTermCycleDraftResolverFormatterDuplicateBoundaryTests();
runQimenFullTermCycleDraftCacheTests();
runQimenFullTermCycleTimelineDraftCachedLookupTests();
runQimenFullTermCycleDraftCachedResolverFormatterTests();
runQimenFullTermCycleDraftCachedResolverFormatterRegressionTests();
runQimenFullTermCycleDraftCachedResolverFormatterDuplicateBoundaryTests();
runQimenFullTermCycleDraftCachedResolverFormatterFullRangeDiagnosticsTests();
runQimenFullTermCycleDraftResolverFormatterCacheReplacementTests();
runQimenPlateLookupTests();
runQimenPlateMarkersTests();
await runQimenPlateValidationTests();
runQimen1080MarkdownParserTests();
await runQimen1080ConverterDryRunTests();
await runQimen1080PreviewWriterTests();
await runQimen1080FormalPlateAdapterTests();
await runQimen1080FormalCandidateWriterTests();
runQimenYearSeedRecommendationTests();
runQimenTimelineFromYearSeedRecommendationTests();
runQimenResolverTests();
runDailyInfoTests();
runBaziCurrentHouTests(solarTerms);
runBaziJianchuTests(solarTerms);
runBaziDailyInfoTests(solarTerms);
runSeventyTwoHouTests();
runGuiDengTests();
runAnnualAfflictionsTests();
runDongGongDaySelectionTests();

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
    `奇門遁甲資料檢查通過：${qimenYuanJuTermCount} terms, ${qimenPlateFileCount} plate files, ${qimenPlateObjectCount} plate objects, ${qimenPlateNullCount} null plates`
  );
  console.log(`奇門置閏法 helper 測試通過：${qimenHelperVerifiedCaseCount} cases`);
  console.log(`奇門符頭掃描測試通過：${qimenFuTouScanVerifiedCaseCount} cases`);
  console.log(`奇門節氣指定展開測試通過：${qimenTermAssignmentVerifiedCaseCount} cases`);
  console.log(`奇門三元timeline產生測試通過：${qimenTimelineBuildVerifiedCaseCount} cases`);
  console.log(`奇門Seed流程timeline測試通過：${qimenTimelineFromSeedFlowVerifiedCaseCount} cases`);
  console.log(`奇門2027 Seed fixture測試通過：${qimenSeedDrivenFixtureVerifiedCaseCount} cases`);
  console.log(`奇門置閏候選判斷測試通過：${qimenIntercalationCandidateVerifiedCaseCount} cases`);
  console.log(`奇門年度置閏窗口分析測試通過：${qimenIntercalationWindowYearVerifiedCaseCount} cases`);
  console.log(`奇門年度置閏窗口候選自動產生測試通過：${qimenIntercalationWindowCandidateAutoVerifiedCaseCount} cases`);
  console.log(`奇門節氣Seed序列推進測試通過：${qimenSequentialTermSeedVerifiedCaseCount} cases`);
  console.log(`奇門完整節氣Seed循環測試通過：${qimenFullTermSeedCycleVerifiedCaseCount} cases`);
  console.log(`奇門完整節氣Seed循環Timeline測試通過：${qimenFullTermSeedCycleTimelineVerifiedCaseCount} cases`);
  console.log(`奇門完整循環草案輸入測試通過：${qimenFullTermCycleDraftInputVerifiedCaseCount} cases`);
  console.log(`奇門年度完整循環Timeline草案測試通過：${qimenFullTermCycleTimelineDraftForYearVerifiedCaseCount} cases`);
  console.log(`奇門年度完整循環Timeline跨年草案測試通過：${qimenFullTermCycleTimelineDraftCrossYearVerifiedCaseCount} cases`);
  console.log(`奇門年度完整循環Timeline多年觀察測試通過：${qimenFullTermCycleTimelineDraftMultiYearObservationVerifiedCaseCount} cases`);
  console.log(`奇門多年完整循環Timeline草案串接測試通過：${qimenMultiYearFullTermCycleTimelineDraftVerifiedCaseCount} cases`);
  console.log(`奇門多年完整循環Timeline全範圍diagnostics測試通過：${qimenMultiYearFullRangeDiagnosticsVerifiedCaseCount} cases`);
  console.log(`奇門多年完整循環Timeline duplicate detail diagnostics測試通過：${qimenMultiYearDuplicateDetailDiagnosticsVerifiedCaseCount} cases`);
  console.log(`奇門完整循環Timeline草案查詢測試通過：${qimenFullTermCycleTimelineDraftLookupVerifiedCaseCount} cases`);
  console.log(`奇門完整循環Timeline草案duplicate boundary查詢測試通過：${qimenFullTermCycleTimelineDraftLookupDuplicateBoundaryVerifiedCaseCount} cases`);
  console.log(`奇門完整循環Timeline草案查詢與resolver對齊測試通過：${qimenFullTermCycleTimelineDraftLookupResolverAlignmentVerifiedCaseCount} cases`);
  console.log(`奇門完整循環草案resolver formatter測試通過：${qimenFullTermCycleDraftResolverFormatterVerifiedCaseCount} cases`);
  console.log(`奇門完整循環草案resolver formatter regression測試通過：${qimenFullTermCycleDraftResolverFormatterRegressionVerifiedCaseCount} cases`);
  console.log(`奇門完整循環草案resolver formatter duplicate boundary測試通過：${qimenFullTermCycleDraftResolverFormatterDuplicateBoundaryVerifiedCaseCount} cases`);
  console.log(`奇門完整循環草案yearDraft cache測試通過：${qimenFullTermCycleDraftCacheVerifiedCaseCount} cases`);
  console.log(`奇門完整循環Timeline草案cached lookup測試通過：${qimenFullTermCycleTimelineDraftCachedLookupVerifiedCaseCount} cases`);
  console.log(`奇門完整循環草案cached resolver formatter測試通過：${qimenFullTermCycleDraftCachedResolverFormatterVerifiedCaseCount} cases`);
  console.log(`奇門完整循環草案cached resolver formatter regression測試通過：${qimenFullTermCycleDraftCachedResolverFormatterRegressionVerifiedCaseCount} cases`);
  console.log(`奇門完整循環草案cached resolver formatter duplicate boundary測試通過：${qimenFullTermCycleDraftCachedResolverFormatterDuplicateBoundaryVerifiedCaseCount} cases`);
  console.log(`奇門完整循環草案cached resolver formatter full range diagnostics測試通過：${qimenFullTermCycleDraftCachedResolverFormatterFullRangeDiagnosticsVerifiedCaseCount} cases`);
  console.log(`奇門完整循環草案resolver formatter cache replacement測試通過：${qimenFullTermCycleDraftResolverFormatterCacheReplacementVerifiedCaseCount} cases`);
  console.log(`奇門1080盤面lookup測試通過：${qimenPlateLookupVerifiedCaseCount} cases`);
  console.log(`奇門盤面標記規則測試通過：${qimenPlateMarkersVerifiedCaseCount} cases`);
  console.log(`奇門1080盤面schema validation測試通過：${qimenPlateValidationVerifiedCaseCount} cases`);
  console.log(`奇門1080.md parser diagnostics測試通過：${qimen1080MarkdownParserVerifiedCaseCount} cases`);
  console.log(`奇門1080.md converter dry-run測試通過：${qimen1080ConverterDryRunVerifiedCaseCount} cases`);
  console.log(`奇門1080.md preview writer測試通過：${qimen1080PreviewWriterVerifiedCaseCount} cases`);
  console.log(`奇門1080.md formal plate adapter測試通過：${qimen1080FormalPlateAdapterVerifiedCaseCount} cases`);
  console.log(`奇門1080.md formal candidate writer測試通過：${qimen1080FormalCandidateWriterVerifiedCaseCount} cases`);
  console.log(`奇門年度Seed建議測試通過：${qimenYearSeedRecommendationVerifiedCaseCount} cases`);
  console.log(`奇門年度Seed建議Timeline測試通過：${qimenTimelineFromYearSeedRecommendationVerifiedCaseCount} cases`);
  console.log(`奇門置閏法 resolver 初版測試通過：${qimenResolverVerifiedCaseCount} cases`);
  console.log(`干支曆七十二候整合測試通過：${baziCurrentHouVerifiedCaseCount} cases`);
  console.log(`干支曆建除十二神整合測試通過：${baziJianchuVerifiedCaseCount} cases`);
  console.log(`干支曆每日資訊整合測試通過：${baziDailyInfoVerifiedCaseCount} cases`);
  console.log(`七十二候測試通過：${seventyTwoHouVerifiedCaseCount} cases`);
  console.log(`貴人登天門測試通過：${guiDengVerifiedCaseCount} cases`);
  console.log(`流年方位煞測試通過：${annualAfflictionsVerifiedCaseCount} cases`);
  console.log(`董公擇日測試通過：${dongGongVerifiedCaseCount} cases`);
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
  let plateObjects = 0;

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
      const plateStats = validateQimenPlateFile(dunType, ju, plateData, expectedPillarSet);
      nullPlates += plateStats.nullPlates;
      plateObjects += plateStats.plateObjects;
    }
  }

  return {
    termCount: termNames.length,
    plateFiles,
    nullPlates,
    plateObjects,
  };
}

function validateQimenPlateFile(dunType, ju, plateData, expectedPillarSet) {
  const id = `qimen-plate-${dunType}-ju-${ju}`;
  const expectedDunName = dunType === "yang" ? "陽遁" : "陰遁";
  const meta = plateData.meta;
  const plates = plateData.plates;
  let nullCount = 0;
  let objectCount = 0;

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
    return {
      nullPlates: nullCount,
      plateObjects: objectCount,
    };
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

    if (typeof plates[pillar] === "object" && !Array.isArray(plates[pillar])) {
      objectCount += 1;
      continue;
    }

    failures.push({
      id,
      key: `plates.${pillar}`,
      expected: "null or object",
      actual: Array.isArray(plates[pillar]) ? "array" : typeof plates[pillar],
    });
  }

  const schemaResult = validateQimenPlateSchemaFile(plateData, createQimenPlateValidationContext(dunType, ju));
  if (!schemaResult.ok) {
    failures.push({
      id,
      key: "schemaValidation",
      expected: "ok",
      actual: schemaResult.errors.map((error) => error.code).join(","),
    });
  }

  return {
    nullPlates: nullCount,
    plateObjects: objectCount,
  };
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

function runQimenFuTouScanTests() {
  const dayPillarCases = [
    { id: "qimen-effective-day-pillar-mangzhong-upper", input: "2027-05-29T23:00:00+08:00", expected: "己酉" },
    { id: "qimen-effective-day-pillar-mangzhong-middle", input: "2027-06-03T23:00:00+08:00", expected: "甲寅" },
    { id: "qimen-effective-day-pillar-mangzhong-lower", input: "2027-06-08T23:00:00+08:00", expected: "己未" },
    { id: "qimen-effective-day-pillar-xiazhi-upper", input: "2027-06-13T23:00:00+08:00", expected: "甲子" },
    { id: "qimen-effective-day-pillar-daxue-intercalary-upper", input: "2027-12-10T23:00:00+08:00", expected: "甲子" },
    { id: "qimen-effective-day-pillar-dongzhi-upper", input: "2027-12-25T23:00:00+08:00", expected: "己卯" },
  ];

  for (const testCase of dayPillarCases) {
    const dayPillar = getDayPillarForEffectiveDay(testCase.input);
    qimenFuTouScanVerifiedCaseCount += 1;
    assertEqual(testCase.id, "dayPillar", testCase.expected, dayPillar);
    assertEqual(testCase.id, "dayPillar.length", 2, dayPillar.length);
    assertEqual(testCase.id, "isQimenFuTou", true, isQimenFuTou(dayPillar));
  }

  const mangzhongFuTouDays = scanQimenFuTouDays(
    "2027-05-20T23:00:00+08:00",
    "2027-06-20T23:00:00+08:00"
  );
  assertScannedFuTouEntries("qimen-scan-mangzhong", mangzhongFuTouDays);
  const expectedMangzhongFuTouDays = [
    { effectiveDayStart: "2027-05-29T23:00:00+08:00", dayPillar: "己酉", yuan: "上元" },
    { effectiveDayStart: "2027-06-03T23:00:00+08:00", dayPillar: "甲寅", yuan: "中元" },
    { effectiveDayStart: "2027-06-08T23:00:00+08:00", dayPillar: "己未", yuan: "下元" },
    { effectiveDayStart: "2027-06-13T23:00:00+08:00", dayPillar: "甲子", yuan: "上元" },
  ];

  for (const expectedEntry of expectedMangzhongFuTouDays) {
    qimenFuTouScanVerifiedCaseCount += 1;
    assertFuTouScanIncludes("qimen-scan-mangzhong", mangzhongFuTouDays, expectedEntry);
  }

  const daxueFuTouDays = scanQimenFuTouDays(
    "2027-11-20T23:00:00+08:00",
    "2027-12-31T23:00:00+08:00"
  );
  assertScannedFuTouEntries("qimen-scan-daxue", daxueFuTouDays);
  const expectedDaxueFuTouDays = [
    { effectiveDayStart: "2027-11-25T23:00:00+08:00", dayPillar: "己酉", yuan: "上元" },
    { effectiveDayStart: "2027-11-30T23:00:00+08:00", dayPillar: "甲寅", yuan: "中元" },
    { effectiveDayStart: "2027-12-05T23:00:00+08:00", dayPillar: "己未", yuan: "下元" },
    { effectiveDayStart: "2027-12-10T23:00:00+08:00", dayPillar: "甲子", yuan: "上元" },
    { effectiveDayStart: "2027-12-15T23:00:00+08:00", dayPillar: "己巳", yuan: "中元" },
    { effectiveDayStart: "2027-12-20T23:00:00+08:00", dayPillar: "甲戌", yuan: "下元" },
    { effectiveDayStart: "2027-12-25T23:00:00+08:00", dayPillar: "己卯", yuan: "上元" },
  ];

  for (const expectedEntry of expectedDaxueFuTouDays) {
    qimenFuTouScanVerifiedCaseCount += 1;
    assertFuTouScanIncludes("qimen-scan-daxue", daxueFuTouDays, expectedEntry);
  }

  qimenFuTouScanVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-scan-invalid-range", () => {
    scanQimenFuTouDays("2027-12-31T23:00:00+08:00", "2027-12-01T23:00:00+08:00");
  });
}

function assertScannedFuTouEntries(id, entries) {
  for (const entry of entries) {
    if (typeof entry.dayPillar !== "string" || entry.dayPillar.length !== 2) {
      failures.push({
        id,
        key: `${entry.effectiveDayStart}.dayPillar`,
        expected: "two-character day pillar",
        actual: entry.dayPillar,
      });
    }

    if (!isQimenFuTou(entry.dayPillar)) {
      failures.push({
        id,
        key: `${entry.effectiveDayStart}.isQimenFuTou`,
        expected: true,
        actual: false,
      });
    }
  }
}

function assertFuTouScanIncludes(id, entries, expected) {
  const actual = entries.find((entry) => entry.effectiveDayStart === expected.effectiveDayStart);
  if (!actual) {
    failures.push({
      id,
      key: expected.effectiveDayStart,
      expected: "present",
      actual: "missing",
    });
    return;
  }

  for (const [key, expectedValue] of Object.entries(expected)) {
    assertEqual(`${id}-${expected.effectiveDayStart}`, key, expectedValue, actual[key]);
  }
}

function assertThrowsRangeError(id, callback) {
  try {
    callback();
  } catch (error) {
    if (error instanceof RangeError) {
      return;
    }

    failures.push({
      id,
      key: "throw",
      expected: "RangeError",
      actual: error instanceof Error ? error.constructor.name : String(error),
    });
    return;
  }

  failures.push({
    id,
    key: "throw",
    expected: "RangeError",
    actual: "not throw",
  });
}

function runQimenTermAssignmentTests() {
  const mangzhongFuTouDays = scanQimenFuTouDays(
    "2027-05-20T23:00:00+08:00",
    "2027-06-20T23:00:00+08:00"
  );
  const mangzhongAssignments = buildQimenTermAssignmentsFromSeeds({
    fuTouDays: mangzhongFuTouDays,
    seeds: [
      {
        effectiveDayStart: "2027-05-29T23:00:00+08:00",
        qimenSolarTerm: "芒種",
        isIntercalary: false,
      },
      {
        effectiveDayStart: "2027-06-13T23:00:00+08:00",
        qimenSolarTerm: "夏至",
        isIntercalary: false,
      },
    ],
  });
  qimenTermAssignmentVerifiedCaseCount += 1;
  assertQimenAssignments("qimen-term-assignment-mangzhong", mangzhongAssignments, {
    "2027-05-29T23:00:00+08:00": { qimenSolarTerm: "芒種", isIntercalary: false },
    "2027-06-03T23:00:00+08:00": { qimenSolarTerm: "芒種", isIntercalary: false },
    "2027-06-08T23:00:00+08:00": { qimenSolarTerm: "芒種", isIntercalary: false },
    "2027-06-13T23:00:00+08:00": { qimenSolarTerm: "夏至", isIntercalary: false },
  });

  const mangzhongTimeline = buildQimenTimelineFromFuTouDays({
    fuTouDays: filterFuTouDaysByStart(mangzhongFuTouDays, [
      "2027-05-29T23:00:00+08:00",
      "2027-06-03T23:00:00+08:00",
      "2027-06-08T23:00:00+08:00",
      "2027-06-13T23:00:00+08:00",
    ]),
    termAssignments: mangzhongAssignments,
  });
  assertQimenTimelineEntries("qimen-term-assignment-mangzhong-timeline", mangzhongTimeline, [
    {
      qimenSolarTerm: "芒種",
      yuan: "上元",
      start: "2027-05-29T23:00:00+08:00",
      end: "2027-06-03T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "己酉",
    },
    {
      qimenSolarTerm: "芒種",
      yuan: "中元",
      start: "2027-06-03T23:00:00+08:00",
      end: "2027-06-08T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "甲寅",
    },
    {
      qimenSolarTerm: "芒種",
      yuan: "下元",
      start: "2027-06-08T23:00:00+08:00",
      end: "2027-06-13T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "己未",
    },
    {
      qimenSolarTerm: "夏至",
      yuan: "上元",
      start: "2027-06-13T23:00:00+08:00",
      end: "2027-06-18T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "甲子",
    },
  ]);

  const daxueFuTouDays = scanQimenFuTouDays(
    "2027-11-20T23:00:00+08:00",
    "2027-12-12T23:00:00+08:00"
  );
  const daxueAssignments = buildQimenTermAssignmentsFromSeeds({
    fuTouDays: daxueFuTouDays,
    seeds: [
      {
        effectiveDayStart: "2027-11-25T23:00:00+08:00",
        qimenSolarTerm: "大雪",
        isIntercalary: false,
      },
    ],
  });
  qimenTermAssignmentVerifiedCaseCount += 1;
  assertQimenAssignments("qimen-term-assignment-daxue", daxueAssignments, {
    "2027-11-25T23:00:00+08:00": { qimenSolarTerm: "大雪", isIntercalary: false },
    "2027-11-30T23:00:00+08:00": { qimenSolarTerm: "大雪", isIntercalary: false },
    "2027-12-05T23:00:00+08:00": { qimenSolarTerm: "大雪", isIntercalary: false },
  });
  assertEqual(
    "qimen-term-assignment-daxue-stop-at-next-unseeded-upper",
    "nextUpper",
    undefined,
    daxueAssignments["2027-12-10T23:00:00+08:00"]
  );

  const intercalaryDaxueFuTouDays = scanQimenFuTouDays(
    "2027-12-10T23:00:00+08:00",
    "2027-12-26T23:00:00+08:00"
  );
  const intercalaryDaxueAssignments = buildQimenTermAssignmentsFromSeeds({
    fuTouDays: intercalaryDaxueFuTouDays,
    seeds: [
      {
        effectiveDayStart: "2027-12-10T23:00:00+08:00",
        qimenSolarTerm: "大雪",
        isIntercalary: true,
      },
    ],
  });
  qimenTermAssignmentVerifiedCaseCount += 1;
  assertQimenAssignments("qimen-term-assignment-intercalary-daxue", intercalaryDaxueAssignments, {
    "2027-12-10T23:00:00+08:00": { qimenSolarTerm: "大雪", isIntercalary: true },
    "2027-12-15T23:00:00+08:00": { qimenSolarTerm: "大雪", isIntercalary: true },
    "2027-12-20T23:00:00+08:00": { qimenSolarTerm: "大雪", isIntercalary: true },
  });
  assertEqual(
    "qimen-term-assignment-intercalary-daxue-stop-at-next-unseeded-upper",
    "nextUpper",
    undefined,
    intercalaryDaxueAssignments["2027-12-25T23:00:00+08:00"]
  );

  qimenTermAssignmentVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-term-assignment-seed-not-found", () => {
    buildQimenTermAssignmentsFromSeeds({
      fuTouDays: mangzhongFuTouDays,
      seeds: [{ effectiveDayStart: "2027-06-01T23:00:00+08:00", qimenSolarTerm: "芒種" }],
    });
  });

  qimenTermAssignmentVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-term-assignment-seed-not-upper", () => {
    buildQimenTermAssignmentsFromSeeds({
      fuTouDays: mangzhongFuTouDays,
      seeds: [{ effectiveDayStart: "2027-06-03T23:00:00+08:00", qimenSolarTerm: "芒種" }],
    });
  });

  qimenTermAssignmentVerifiedCaseCount += 1;
  assertThrowsTypeError("qimen-term-assignment-invalid-futou-days", () => {
    buildQimenTermAssignmentsFromSeeds({ fuTouDays: null, seeds: [] });
  });

  qimenTermAssignmentVerifiedCaseCount += 1;
  assertThrowsTypeError("qimen-term-assignment-invalid-seeds", () => {
    buildQimenTermAssignmentsFromSeeds({ fuTouDays: mangzhongFuTouDays, seeds: null });
  });
}

function assertQimenAssignments(id, actual, expected) {
  for (const [effectiveDayStart, expectedAssignment] of Object.entries(expected)) {
    const actualAssignment = actual[effectiveDayStart];
    if (!actualAssignment) {
      failures.push({
        id,
        key: effectiveDayStart,
        expected: "assignment",
        actual: "missing",
      });
      continue;
    }

    for (const [key, expectedValue] of Object.entries(expectedAssignment)) {
      assertEqual(`${id}-${effectiveDayStart}`, key, expectedValue, actualAssignment[key]);
    }
  }
}

function runQimenTimelineBuildTests() {
  const mangzhongFuTouDays = filterFuTouDaysByStart(
    scanQimenFuTouDays("2027-05-20T23:00:00+08:00", "2027-06-20T23:00:00+08:00"),
    [
      "2027-05-29T23:00:00+08:00",
      "2027-06-03T23:00:00+08:00",
      "2027-06-08T23:00:00+08:00",
      "2027-06-13T23:00:00+08:00",
    ]
  );
  const mangzhongTimeline = buildQimenTimelineFromFuTouDays({
    fuTouDays: mangzhongFuTouDays,
    termAssignments: {
      "2027-05-29T23:00:00+08:00": { qimenSolarTerm: "芒種", isIntercalary: false },
      "2027-06-03T23:00:00+08:00": { qimenSolarTerm: "芒種", isIntercalary: false },
      "2027-06-08T23:00:00+08:00": { qimenSolarTerm: "芒種", isIntercalary: false },
      "2027-06-13T23:00:00+08:00": { qimenSolarTerm: "夏至", isIntercalary: false },
    },
  });
  qimenTimelineBuildVerifiedCaseCount += 1;
  assertEqual("qimen-build-timeline-mangzhong", "length", 4, mangzhongTimeline.length);
  assertQimenTimelineEntries("qimen-build-timeline-mangzhong", mangzhongTimeline, [
    {
      qimenSolarTerm: "芒種",
      yuan: "上元",
      start: "2027-05-29T23:00:00+08:00",
      end: "2027-06-03T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "己酉",
    },
    {
      qimenSolarTerm: "芒種",
      yuan: "中元",
      start: "2027-06-03T23:00:00+08:00",
      end: "2027-06-08T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "甲寅",
    },
    {
      qimenSolarTerm: "芒種",
      yuan: "下元",
      start: "2027-06-08T23:00:00+08:00",
      end: "2027-06-13T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "己未",
    },
    {
      qimenSolarTerm: "夏至",
      yuan: "上元",
      start: "2027-06-13T23:00:00+08:00",
      end: "2027-06-18T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "甲子",
    },
  ]);

  const daxueFuTouDays = filterFuTouDaysByStart(
    scanQimenFuTouDays("2027-11-20T23:00:00+08:00", "2027-12-12T23:00:00+08:00"),
    [
      "2027-11-25T23:00:00+08:00",
      "2027-11-30T23:00:00+08:00",
      "2027-12-05T23:00:00+08:00",
    ]
  );
  const daxueTimeline = buildQimenTimelineFromFuTouDays({
    fuTouDays: daxueFuTouDays,
    termAssignments: {
      "2027-11-25T23:00:00+08:00": { qimenSolarTerm: "大雪", isIntercalary: false },
      "2027-11-30T23:00:00+08:00": { qimenSolarTerm: "大雪", isIntercalary: false },
      "2027-12-05T23:00:00+08:00": { qimenSolarTerm: "大雪", isIntercalary: false },
    },
  });
  qimenTimelineBuildVerifiedCaseCount += 1;
  assertEqual("qimen-build-timeline-daxue", "length", 3, daxueTimeline.length);
  assertQimenTimelineEntries("qimen-build-timeline-daxue", daxueTimeline, [
    {
      qimenSolarTerm: "大雪",
      yuan: "上元",
      start: "2027-11-25T23:00:00+08:00",
      end: "2027-11-30T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "己酉",
    },
    {
      qimenSolarTerm: "大雪",
      yuan: "中元",
      start: "2027-11-30T23:00:00+08:00",
      end: "2027-12-05T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "甲寅",
    },
    {
      qimenSolarTerm: "大雪",
      yuan: "下元",
      start: "2027-12-05T23:00:00+08:00",
      end: "2027-12-10T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "己未",
    },
  ]);

  const intercalaryDaxueFuTouDays = filterFuTouDaysByStart(
    scanQimenFuTouDays("2027-12-10T23:00:00+08:00", "2027-12-26T23:00:00+08:00"),
    [
      "2027-12-10T23:00:00+08:00",
      "2027-12-15T23:00:00+08:00",
      "2027-12-20T23:00:00+08:00",
    ]
  );
  const intercalaryDaxueTimeline = buildQimenTimelineFromFuTouDays({
    fuTouDays: intercalaryDaxueFuTouDays,
    termAssignments: {
      "2027-12-10T23:00:00+08:00": { qimenSolarTerm: "大雪", isIntercalary: true },
      "2027-12-15T23:00:00+08:00": { qimenSolarTerm: "大雪", isIntercalary: true },
      "2027-12-20T23:00:00+08:00": { qimenSolarTerm: "大雪", isIntercalary: true },
    },
  });
  qimenTimelineBuildVerifiedCaseCount += 1;
  assertEqual("qimen-build-timeline-intercalary-daxue", "length", 3, intercalaryDaxueTimeline.length);
  assertQimenTimelineEntries("qimen-build-timeline-intercalary-daxue", intercalaryDaxueTimeline, [
    {
      qimenSolarTerm: "大雪",
      yuan: "上元",
      start: "2027-12-10T23:00:00+08:00",
      end: "2027-12-15T23:00:00+08:00",
      isIntercalary: true,
      sourceDayPillar: "甲子",
    },
    {
      qimenSolarTerm: "大雪",
      yuan: "中元",
      start: "2027-12-15T23:00:00+08:00",
      end: "2027-12-20T23:00:00+08:00",
      isIntercalary: true,
      sourceDayPillar: "己巳",
    },
    {
      qimenSolarTerm: "大雪",
      yuan: "下元",
      start: "2027-12-20T23:00:00+08:00",
      end: "2027-12-25T23:00:00+08:00",
      isIntercalary: true,
      sourceDayPillar: "甲戌",
    },
  ]);

  qimenTimelineBuildVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-build-timeline-missing-assignment", () => {
    buildQimenTimelineFromFuTouDays({
      fuTouDays: [
        {
          effectiveDayStart: "2027-12-10T23:00:00+08:00",
          dayPillar: "甲子",
          yuan: "上元",
        },
      ],
      termAssignments: {},
    });
  });

  qimenTimelineBuildVerifiedCaseCount += 1;
  assertThrowsTypeError("qimen-build-timeline-invalid-futou-days", () => {
    buildQimenTimelineFromFuTouDays({
      fuTouDays: null,
      termAssignments: {},
    });
  });
}

function filterFuTouDaysByStart(fuTouDays, starts) {
  const startSet = new Set(starts);
  return fuTouDays.filter((fuTouDay) => startSet.has(fuTouDay.effectiveDayStart));
}

function assertQimenTimelineEntries(id, actualEntries, expectedEntries) {
  for (const [index, expectedEntry] of expectedEntries.entries()) {
    assertQimenRange(`${id}-${index + 1}`, actualEntries[index], expectedEntry);
  }
}

function assertThrowsTypeError(id, callback) {
  try {
    callback();
  } catch (error) {
    if (error instanceof TypeError) {
      return;
    }

    failures.push({
      id,
      key: "throw",
      expected: "TypeError",
      actual: error instanceof Error ? error.constructor.name : String(error),
    });
    return;
  }

  failures.push({
    id,
    key: "throw",
    expected: "TypeError",
    actual: "not throw",
  });
}

function runQimenTimelineFromSeedFlowTests() {
  const mangzhongTimeline = buildQimenTimelineFromFuTouSeeds({
    startEffectiveDay: "2027-05-20T23:00:00+08:00",
    endEffectiveDay: "2027-06-20T23:00:00+08:00",
    seeds: [
      {
        effectiveDayStart: "2027-05-29T23:00:00+08:00",
        qimenSolarTerm: "芒種",
        isIntercalary: false,
      },
      {
        effectiveDayStart: "2027-06-13T23:00:00+08:00",
        qimenSolarTerm: "夏至",
        isIntercalary: false,
      },
    ],
  });
  qimenTimelineFromSeedFlowVerifiedCaseCount += 1;
  assertEqual("qimen-seed-flow-mangzhong", "length", 4, mangzhongTimeline.length);
  assertQimenTimelineEntries("qimen-seed-flow-mangzhong", mangzhongTimeline, [
    {
      qimenSolarTerm: "芒種",
      yuan: "上元",
      start: "2027-05-29T23:00:00+08:00",
      end: "2027-06-03T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "己酉",
    },
    {
      qimenSolarTerm: "芒種",
      yuan: "中元",
      start: "2027-06-03T23:00:00+08:00",
      end: "2027-06-08T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "甲寅",
    },
    {
      qimenSolarTerm: "芒種",
      yuan: "下元",
      start: "2027-06-08T23:00:00+08:00",
      end: "2027-06-13T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "己未",
    },
    {
      qimenSolarTerm: "夏至",
      yuan: "上元",
      start: "2027-06-13T23:00:00+08:00",
      end: "2027-06-18T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "甲子",
    },
  ]);

  const daxueTimeline = buildQimenTimelineFromFuTouSeeds({
    startEffectiveDay: "2027-11-20T23:00:00+08:00",
    endEffectiveDay: "2027-12-12T23:00:00+08:00",
    seeds: [
      {
        effectiveDayStart: "2027-11-25T23:00:00+08:00",
        qimenSolarTerm: "大雪",
        isIntercalary: false,
      },
    ],
  });
  qimenTimelineFromSeedFlowVerifiedCaseCount += 1;
  assertEqual("qimen-seed-flow-daxue", "length", 3, daxueTimeline.length);
  assertQimenTimelineEntries("qimen-seed-flow-daxue", daxueTimeline, [
    {
      qimenSolarTerm: "大雪",
      yuan: "上元",
      start: "2027-11-25T23:00:00+08:00",
      end: "2027-11-30T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "己酉",
    },
    {
      qimenSolarTerm: "大雪",
      yuan: "中元",
      start: "2027-11-30T23:00:00+08:00",
      end: "2027-12-05T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "甲寅",
    },
    {
      qimenSolarTerm: "大雪",
      yuan: "下元",
      start: "2027-12-05T23:00:00+08:00",
      end: "2027-12-10T23:00:00+08:00",
      isIntercalary: false,
      sourceDayPillar: "己未",
    },
  ]);
  assertEqual(
    "qimen-seed-flow-daxue-excludes-unseeded-upper",
    "nextUpper",
    false,
    daxueTimeline.some((entry) => entry.start === "2027-12-10T23:00:00+08:00")
  );

  const intercalaryDaxueTimeline = buildQimenTimelineFromFuTouSeeds({
    startEffectiveDay: "2027-12-10T23:00:00+08:00",
    endEffectiveDay: "2027-12-26T23:00:00+08:00",
    seeds: [
      {
        effectiveDayStart: "2027-12-10T23:00:00+08:00",
        qimenSolarTerm: "大雪",
        isIntercalary: true,
      },
    ],
  });
  qimenTimelineFromSeedFlowVerifiedCaseCount += 1;
  assertEqual("qimen-seed-flow-intercalary-daxue", "length", 3, intercalaryDaxueTimeline.length);
  assertQimenTimelineEntries("qimen-seed-flow-intercalary-daxue", intercalaryDaxueTimeline, [
    {
      qimenSolarTerm: "大雪",
      yuan: "上元",
      start: "2027-12-10T23:00:00+08:00",
      end: "2027-12-15T23:00:00+08:00",
      isIntercalary: true,
      sourceDayPillar: "甲子",
    },
    {
      qimenSolarTerm: "大雪",
      yuan: "中元",
      start: "2027-12-15T23:00:00+08:00",
      end: "2027-12-20T23:00:00+08:00",
      isIntercalary: true,
      sourceDayPillar: "己巳",
    },
    {
      qimenSolarTerm: "大雪",
      yuan: "下元",
      start: "2027-12-20T23:00:00+08:00",
      end: "2027-12-25T23:00:00+08:00",
      isIntercalary: true,
      sourceDayPillar: "甲戌",
    },
  ]);
  assertEqual(
    "qimen-seed-flow-intercalary-daxue-excludes-unseeded-upper",
    "nextUpper",
    false,
    intercalaryDaxueTimeline.some((entry) => entry.start === "2027-12-25T23:00:00+08:00")
  );

  qimenTimelineFromSeedFlowVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-seed-flow-seed-not-found", () => {
    buildQimenTimelineFromFuTouSeeds({
      startEffectiveDay: "2027-05-20T23:00:00+08:00",
      endEffectiveDay: "2027-06-20T23:00:00+08:00",
      seeds: [{ effectiveDayStart: "2027-06-01T23:00:00+08:00", qimenSolarTerm: "芒種" }],
    });
  });

  qimenTimelineFromSeedFlowVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-seed-flow-include-unassigned", () => {
    buildQimenTimelineFromFuTouSeeds({
      startEffectiveDay: "2027-05-20T23:00:00+08:00",
      endEffectiveDay: "2027-06-20T23:00:00+08:00",
      seeds: [],
      includeUnassigned: true,
    });
  });
}

function runQimenSeedDrivenFixtureTests() {
  const fixture = buildSeedDrivenQimenTimelineFixture2027();
  const yearSeedTimeline = buildQimenTimelineFromYearSeedRecommendations(2027);
  qimenSeedDrivenFixtureVerifiedCaseCount += 1;

  if (!Array.isArray(fixture) || fixture.length === 0) {
    failures.push({
      id: "qimen-seed-fixture-structure",
      key: "fixture",
      expected: "non-empty array",
      actual: Array.isArray(fixture) ? fixture.length : typeof fixture,
    });
  }

  for (const [index, entry] of fixture.entries()) {
    for (const field of ["qimenSolarTerm", "yuan", "start", "end", "isIntercalary"]) {
      if (!(field in entry)) {
        failures.push({
          id: "qimen-seed-fixture-structure",
          key: `${index}.${field}`,
          expected: "present",
          actual: "missing",
        });
      }
    }

    if (Date.parse(entry.start) >= Date.parse(entry.end)) {
      failures.push({
        id: "qimen-seed-fixture-structure",
        key: `${index}.range`,
        expected: "start < end",
        actual: `${entry.start} >= ${entry.end}`,
      });
    }

    if ("sourceDayPillar" in entry && (typeof entry.sourceDayPillar !== "string" || entry.sourceDayPillar.length !== 2)) {
      failures.push({
        id: "qimen-seed-fixture-structure",
        key: `${index}.sourceDayPillar`,
        expected: "two-character string",
        actual: entry.sourceDayPillar,
      });
    }
  }

  qimenSeedDrivenFixtureVerifiedCaseCount += 1;
  assertEqual("qimen-seed-fixture-year-seed-timeline-alignment", "length", yearSeedTimeline.length, fixture.length);
  for (const [index, fixtureEntry] of fixture.entries()) {
    assertQimenTimelineFields(
      `qimen-seed-fixture-year-seed-timeline-alignment-${index + 1}`,
      yearSeedTimeline[index],
      fixtureEntry,
      ["qimenSolarTerm", "yuan", "start", "end", "isIntercalary", "sourceDayPillar"]
    );
  }

  assertSeedFixtureMatchesInitialTimeline(
    "qimen-seed-fixture-mangzhong-xiazhi",
    fixture,
    getQimenTimelineForRange("2027-05-29T23:00:00+08:00", "2027-06-18T23:00:00+08:00"),
    [
      {
        qimenSolarTerm: "芒種",
        yuan: "上元",
        start: "2027-05-29T23:00:00+08:00",
        end: "2027-06-03T23:00:00+08:00",
        isIntercalary: false,
      },
      {
        qimenSolarTerm: "芒種",
        yuan: "中元",
        start: "2027-06-03T23:00:00+08:00",
        end: "2027-06-08T23:00:00+08:00",
        isIntercalary: false,
      },
      {
        qimenSolarTerm: "芒種",
        yuan: "下元",
        start: "2027-06-08T23:00:00+08:00",
        end: "2027-06-13T23:00:00+08:00",
        isIntercalary: false,
      },
      {
        qimenSolarTerm: "夏至",
        yuan: "上元",
        start: "2027-06-13T23:00:00+08:00",
        end: "2027-06-18T23:00:00+08:00",
        isIntercalary: false,
      },
    ]
  );

  assertSeedFixtureMatchesInitialTimeline(
    "qimen-seed-fixture-daxue",
    fixture,
    getQimenTimelineForRange("2027-11-25T23:00:00+08:00", "2027-12-10T23:00:00+08:00"),
    [
      {
        qimenSolarTerm: "大雪",
        yuan: "上元",
        start: "2027-11-25T23:00:00+08:00",
        end: "2027-11-30T23:00:00+08:00",
        isIntercalary: false,
      },
      {
        qimenSolarTerm: "大雪",
        yuan: "中元",
        start: "2027-11-30T23:00:00+08:00",
        end: "2027-12-05T23:00:00+08:00",
        isIntercalary: false,
      },
      {
        qimenSolarTerm: "大雪",
        yuan: "下元",
        start: "2027-12-05T23:00:00+08:00",
        end: "2027-12-10T23:00:00+08:00",
        isIntercalary: false,
      },
    ]
  );

  assertSeedFixtureMatchesInitialTimeline(
    "qimen-seed-fixture-intercalary-daxue",
    fixture,
    getQimenTimelineForRange("2027-12-10T23:00:00+08:00", "2027-12-25T23:00:00+08:00"),
    [
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
    ]
  );

  assertSeedFixtureMatchesInitialTimeline(
    "qimen-seed-fixture-dongzhi-upper",
    fixture,
    getQimenTimelineForRange("2027-12-25T23:00:00+08:00", "2027-12-30T23:00:00+08:00"),
    [
      {
        qimenSolarTerm: "冬至",
        yuan: "上元",
        start: "2027-12-25T23:00:00+08:00",
        end: "2027-12-30T23:00:00+08:00",
        isIntercalary: false,
      },
    ]
  );

  qimenSeedDrivenFixtureVerifiedCaseCount += 1;
  const intercalaryDaxueTimeline = getQimenTimelineForRange(
    "2027-12-10T23:00:00+08:00",
    "2027-12-15T23:00:00+08:00"
  );
  assertQimenTimelineFields(
    "qimen-seed-driven-initial-range-source",
    intercalaryDaxueTimeline[0],
    {
      qimenSolarTerm: "大雪",
      yuan: "上元",
      start: "2027-12-10T23:00:00+08:00",
      end: "2027-12-15T23:00:00+08:00",
      isIntercalary: true,
      sourceDayPillar: "甲子",
    },
    ["qimenSolarTerm", "yuan", "start", "end", "isIntercalary", "sourceDayPillar"]
  );

  qimenSeedDrivenFixtureVerifiedCaseCount += 1;
  assertQimenTimelineFields(
    "qimen-seed-driven-find-entry-source",
    findQimenTimelineEntry("2027-12-11T12:00:00+08:00"),
    {
      qimenSolarTerm: "大雪",
      yuan: "上元",
      isIntercalary: true,
      sourceDayPillar: "甲子",
    },
    ["qimenSolarTerm", "yuan", "isIntercalary", "sourceDayPillar"]
  );

  const initialTimeline = getQimenTimelineForRange(
    "2027-05-29T23:00:00+08:00",
    fixture.at(-1).end
  );
  qimenSeedDrivenFixtureVerifiedCaseCount += 1;
  for (const fixtureEntry of fixture) {
    assertQimenTimelineFields(
      `qimen-seed-driven-full-entry-${fixtureEntry.start}`,
      findTimelineEntryByStart(initialTimeline, fixtureEntry.start),
      fixtureEntry,
      ["qimenSolarTerm", "yuan", "start", "end", "isIntercalary", "sourceDayPillar"]
    );
  }
}

function assertSeedFixtureMatchesInitialTimeline(id, fixture, initialEntries, expectedEntries) {
  qimenSeedDrivenFixtureVerifiedCaseCount += 1;

  for (const expectedEntry of expectedEntries) {
    assertQimenTimelineCommonFields(
      `${id}-expected-${expectedEntry.start}`,
      findTimelineEntryByStart(fixture, expectedEntry.start),
      expectedEntry
    );
    assertQimenTimelineCommonFields(
      `${id}-initial-${expectedEntry.start}`,
      findTimelineEntryByStart(initialEntries, expectedEntry.start),
      expectedEntry
    );
  }
}

function findTimelineEntryByStart(entries, start) {
  return entries.find((entry) => entry.start === start);
}

function assertQimenTimelineCommonFields(id, actual, expected) {
  assertQimenTimelineFields(id, actual, expected, ["qimenSolarTerm", "yuan", "start", "end", "isIntercalary"]);
}

function assertQimenTimelineFields(id, actual, expected, keys) {
  for (const key of keys) {
    assertEqual(id, key, expected[key], actual?.[key]);
  }
}

function runQimenIntercalationCandidateTests() {
  const testCases = [
    {
      id: "qimen-intercalation-candidate-2027-mangzhong-no",
      input: {
        qimenSolarTerm: "芒種",
        qimenUpperStart: "2027-05-29T23:00:00+08:00",
        actualSolarTermTime: "2027-06-06T05:26:00+08:00",
      },
      expected: {
        qimenSolarTerm: "芒種",
        chaoShenDays: 8,
        reachesNineDays: false,
        isIntercalationWindow: true,
        shouldIntercalate: false,
        intercalarySolarTerm: null,
      },
    },
    {
      id: "qimen-intercalation-candidate-2027-daxue-yes",
      input: {
        qimenSolarTerm: "大雪",
        qimenUpperStart: "2027-11-25T23:00:00+08:00",
        actualSolarTermTime: "2027-12-07T16:38:00+08:00",
      },
      expected: {
        qimenSolarTerm: "大雪",
        chaoShenDays: 12,
        reachesNineDays: true,
        isIntercalationWindow: true,
        shouldIntercalate: true,
        intercalarySolarTerm: "大雪",
      },
    },
    {
      id: "qimen-intercalation-candidate-non-window",
      input: {
        qimenSolarTerm: "小滿",
        qimenUpperStart: "2027-05-10T23:00:00+08:00",
        actualSolarTermTime: "2027-05-22T12:00:00+08:00",
      },
      expected: {
        reachesNineDays: true,
        isIntercalationWindow: false,
        shouldIntercalate: false,
        intercalarySolarTerm: null,
      },
    },
    {
      id: "qimen-intercalation-candidate-not-chaoshen",
      input: {
        qimenSolarTerm: "冬至",
        qimenUpperStart: "2027-12-25T23:00:00+08:00",
        actualSolarTermTime: "2027-12-22T10:42:00+08:00",
      },
      expected: {
        chaoShenDays: 0,
        reachesNineDays: false,
        shouldIntercalate: false,
        intercalarySolarTerm: null,
      },
    },
  ];

  for (const testCase of testCases) {
    const actual = analyzeQimenIntercalationCandidate(testCase.input);
    qimenIntercalationCandidateVerifiedCaseCount += 1;

    for (const [key, expectedValue] of Object.entries(testCase.expected)) {
      assertEqual(testCase.id, key, expectedValue, actual[key]);
    }

    if (typeof actual.reason !== "string" || actual.reason.length === 0) {
      failures.push({
        id: testCase.id,
        key: "reason",
        expected: "non-empty string",
        actual: actual.reason,
      });
    }
  }

  qimenIntercalationCandidateVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-intercalation-candidate-invalid-term", () => {
    analyzeQimenIntercalationCandidate({
      qimenSolarTerm: "不存在",
      qimenUpperStart: "2027-11-25T23:00:00+08:00",
      actualSolarTermTime: "2027-12-07T16:38:00+08:00",
    });
  });
}

function runQimenIntercalationWindowYearTests() {
  const windows2027 = analyzeQimenIntercalationWindowsForYear({
    year: 2027,
    candidates: [
      {
        qimenSolarTerm: "芒種",
        qimenUpperStart: "2027-05-29T23:00:00+08:00",
      },
      {
        qimenSolarTerm: "大雪",
        qimenUpperStart: "2027-11-25T23:00:00+08:00",
      },
    ],
  });
  qimenIntercalationWindowYearVerifiedCaseCount += 1;
  assertEqual("qimen-year-window-2027", "length", 2, windows2027.length);
  assertQimenIntercalationWindow("qimen-year-window-2027-mangzhong", windows2027[0], {
    qimenSolarTerm: "芒種",
    actualSolarTermTime: findSolarTermForTest(solarTerms, "芒種", 2027)?.asia_taipei,
    chaoShenDays: 8,
    reachesNineDays: false,
    isIntercalationWindow: true,
    shouldIntercalate: false,
    intercalarySolarTerm: null,
  });
  assertQimenIntercalationWindow("qimen-year-window-2027-daxue", windows2027[1], {
    qimenSolarTerm: "大雪",
    actualSolarTermTime: findSolarTermForTest(solarTerms, "大雪", 2027)?.asia_taipei,
    chaoShenDays: 12,
    reachesNineDays: true,
    isIntercalationWindow: true,
    shouldIntercalate: true,
    intercalarySolarTerm: "大雪",
  });

  const mangzhongOnly = analyzeQimenIntercalationWindowsForYear({
    year: 2027,
    candidates: [
      {
        qimenSolarTerm: "芒種",
        qimenUpperStart: "2027-05-29T23:00:00+08:00",
      },
    ],
  });
  qimenIntercalationWindowYearVerifiedCaseCount += 1;
  assertEqual("qimen-year-window-mangzhong-only", "length", 1, mangzhongOnly.length);
  assertEqual("qimen-year-window-mangzhong-only", "shouldIntercalate", false, mangzhongOnly[0]?.shouldIntercalate);
  assertEqual("qimen-year-window-mangzhong-only", "chaoShenDays", 8, mangzhongOnly[0]?.chaoShenDays);

  qimenIntercalationWindowYearVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-year-window-invalid-candidate-term", () => {
    analyzeQimenIntercalationWindowsForYear({
      year: 2027,
      candidates: [
        {
          qimenSolarTerm: "小滿",
          qimenUpperStart: "2027-05-10T23:00:00+08:00",
        },
      ],
    });
  });

  qimenIntercalationWindowYearVerifiedCaseCount += 1;
  assertThrowsTypeError("qimen-year-window-invalid-candidates", () => {
    analyzeQimenIntercalationWindowsForYear({
      year: 2027,
      candidates: null,
    });
  });

  qimenIntercalationWindowYearVerifiedCaseCount += 1;
  assertThrowsTypeError("qimen-year-window-invalid-year", () => {
    analyzeQimenIntercalationWindowsForYear({
      year: "2027",
      candidates: [],
    });
  });

  qimenIntercalationWindowYearVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-year-window-missing-year", () => {
    analyzeQimenIntercalationWindowsForYear({
      year: 1800,
      candidates: [
        {
          qimenSolarTerm: "芒種",
          qimenUpperStart: "1800-05-29T23:00:00+08:00",
        },
      ],
    });
  });
}

function runQimenIntercalationWindowCandidateAutoTests() {
  const candidates2027 = buildQimenIntercalationWindowCandidatesForYear(2027);
  qimenIntercalationWindowCandidateAutoVerifiedCaseCount += 1;
  assertEqual("qimen-year-window-auto-candidates-2027", "length", 2, candidates2027.length);
  assertQimenIntercalationWindowCandidate("qimen-year-window-auto-candidates-2027-mangzhong", candidates2027[0], {
    qimenSolarTerm: "芒種",
    qimenUpperStart: "2027-05-29T23:00:00+08:00",
    actualSolarTermTime: findSolarTermForTest(solarTerms, "芒種", 2027)?.asia_taipei,
    sourceDayPillar: "己酉",
  });
  assertQimenIntercalationWindowCandidate("qimen-year-window-auto-candidates-2027-daxue", candidates2027[1], {
    qimenSolarTerm: "大雪",
    qimenUpperStart: "2027-11-25T23:00:00+08:00",
    actualSolarTermTime: findSolarTermForTest(solarTerms, "大雪", 2027)?.asia_taipei,
    sourceDayPillar: "己酉",
  });

  const windowsFromAutoCandidates = analyzeQimenIntercalationWindowsForYear({
    year: 2027,
    candidates: candidates2027,
  });
  qimenIntercalationWindowCandidateAutoVerifiedCaseCount += 1;
  assertEqual("qimen-year-window-auto-candidates-analysis", "length", 2, windowsFromAutoCandidates.length);
  assertQimenIntercalationWindow("qimen-year-window-auto-candidates-analysis-mangzhong", windowsFromAutoCandidates[0], {
    qimenSolarTerm: "芒種",
    chaoShenDays: 8,
    shouldIntercalate: false,
    intercalarySolarTerm: null,
  });
  assertQimenIntercalationWindow("qimen-year-window-auto-candidates-analysis-daxue", windowsFromAutoCandidates[1], {
    qimenSolarTerm: "大雪",
    chaoShenDays: 12,
    shouldIntercalate: true,
    intercalarySolarTerm: "大雪",
  });

  const autoWindows2027 = analyzeQimenIntercalationWindowsForYearAuto(2027);
  qimenIntercalationWindowCandidateAutoVerifiedCaseCount += 1;
  assertEqual("qimen-year-window-auto-analysis-2027", "length", 2, autoWindows2027.length);
  assertEqual("qimen-year-window-auto-analysis-2027-mangzhong", "shouldIntercalate", false, autoWindows2027[0]?.shouldIntercalate);
  assertEqual("qimen-year-window-auto-analysis-2027-mangzhong", "chaoShenDays", 8, autoWindows2027[0]?.chaoShenDays);
  assertEqual("qimen-year-window-auto-analysis-2027-daxue", "shouldIntercalate", true, autoWindows2027[1]?.shouldIntercalate);
  assertEqual("qimen-year-window-auto-analysis-2027-daxue", "chaoShenDays", 12, autoWindows2027[1]?.chaoShenDays);

  qimenIntercalationWindowCandidateAutoVerifiedCaseCount += 1;
  assertThrowsTypeError("qimen-year-window-auto-candidates-invalid-year", () => {
    buildQimenIntercalationWindowCandidatesForYear("2027");
  });

  qimenIntercalationWindowCandidateAutoVerifiedCaseCount += 1;
  assertThrowsTypeError("qimen-year-window-auto-analysis-invalid-year", () => {
    analyzeQimenIntercalationWindowsForYearAuto("2027");
  });

  qimenIntercalationWindowCandidateAutoVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-year-window-auto-candidates-missing-year", () => {
    buildQimenIntercalationWindowCandidatesForYear(1800);
  });
}

function runQimenSequentialTermSeedTests() {
  const mangzhongSeeds = buildQimenSequentialTermSeeds({
    startSeed: {
      effectiveDayStart: "2027-05-29T23:00:00+08:00",
      qimenSolarTerm: "芒種",
      isIntercalary: false,
    },
    count: 2,
  });
  qimenSequentialTermSeedVerifiedCaseCount += 1;
  assertEqual("qimen-sequential-seed-mangzhong-xiazhi", "length", 2, mangzhongSeeds.length);
  assertQimenYearSeedRecommendation("qimen-sequential-seed-mangzhong-xiazhi-1", mangzhongSeeds[0], {
    effectiveDayStart: "2027-05-29T23:00:00+08:00",
    qimenSolarTerm: "芒種",
    isIntercalary: false,
  });
  assertQimenYearSeedRecommendation("qimen-sequential-seed-mangzhong-xiazhi-2", mangzhongSeeds[1], {
    effectiveDayStart: "2027-06-13T23:00:00+08:00",
    qimenSolarTerm: "夏至",
    isIntercalary: false,
  });

  const daxueSeeds = buildQimenSequentialTermSeeds({
    startSeed: {
      effectiveDayStart: "2027-11-25T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      isIntercalary: false,
    },
    count: 2,
    intercalations: [
      {
        afterTerm: "大雪",
        atEffectiveDayStart: "2027-12-10T23:00:00+08:00",
      },
    ],
  });
  qimenSequentialTermSeedVerifiedCaseCount += 1;
  assertEqual("qimen-sequential-seed-daxue-intercalary-dongzhi", "length", 3, daxueSeeds.length);
  assertQimenYearSeedRecommendation("qimen-sequential-seed-daxue-intercalary-dongzhi-1", daxueSeeds[0], {
    effectiveDayStart: "2027-11-25T23:00:00+08:00",
    qimenSolarTerm: "大雪",
    isIntercalary: false,
  });
  assertQimenYearSeedRecommendation("qimen-sequential-seed-daxue-intercalary-dongzhi-2", daxueSeeds[1], {
    effectiveDayStart: "2027-12-10T23:00:00+08:00",
    qimenSolarTerm: "大雪",
    isIntercalary: true,
  });
  assertQimenYearSeedRecommendation("qimen-sequential-seed-daxue-intercalary-dongzhi-3", daxueSeeds[2], {
    effectiveDayStart: "2027-12-25T23:00:00+08:00",
    qimenSolarTerm: "冬至",
    isIntercalary: false,
  });

  const dongzhiSeeds = buildQimenSequentialTermSeeds({
    startSeed: {
      effectiveDayStart: "2027-12-25T23:00:00+08:00",
      qimenSolarTerm: "冬至",
      isIntercalary: false,
    },
    count: 3,
  });
  qimenSequentialTermSeedVerifiedCaseCount += 1;
  assertQimenYearSeedRecommendation("qimen-sequential-seed-dongzhi-cross-year-1", dongzhiSeeds[0], {
    effectiveDayStart: "2027-12-25T23:00:00+08:00",
    qimenSolarTerm: "冬至",
    isIntercalary: false,
  });
  assertQimenYearSeedRecommendation("qimen-sequential-seed-dongzhi-cross-year-2", dongzhiSeeds[1], {
    effectiveDayStart: "2028-01-09T23:00:00+08:00",
    qimenSolarTerm: "小寒",
    isIntercalary: false,
  });
  assertQimenYearSeedRecommendation("qimen-sequential-seed-dongzhi-cross-year-3", dongzhiSeeds[2], {
    effectiveDayStart: "2028-01-24T23:00:00+08:00",
    qimenSolarTerm: "大寒",
    isIntercalary: false,
  });

  qimenSequentialTermSeedVerifiedCaseCount += 1;
  for (const [index, seed] of [...mangzhongSeeds, ...daxueSeeds, ...dongzhiSeeds].entries()) {
    const id = `qimen-sequential-seed-structure-${index + 1}`;
    assertEqual(id, "source.present", true, typeof seed.source === "string" && seed.source.length > 0);
    assertEqual(id, "reason.present", true, typeof seed.reason === "string" && seed.reason.length > 0);
  }

  qimenSequentialTermSeedVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-sequential-seed-intercalation-time-mismatch", () => {
    buildQimenSequentialTermSeeds({
      startSeed: {
        effectiveDayStart: "2027-11-25T23:00:00+08:00",
        qimenSolarTerm: "大雪",
        isIntercalary: false,
      },
      count: 2,
      intercalations: [
        {
          afterTerm: "大雪",
          atEffectiveDayStart: "2027-12-11T23:00:00+08:00",
        },
      ],
    });
  });

  qimenSequentialTermSeedVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-sequential-seed-invalid-term", () => {
    buildQimenSequentialTermSeeds({
      startSeed: {
        effectiveDayStart: "2027-05-29T23:00:00+08:00",
        qimenSolarTerm: "不存在",
        isIntercalary: false,
      },
      count: 2,
    });
  });

  qimenSequentialTermSeedVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-sequential-seed-invalid-count-zero", () => {
    buildQimenSequentialTermSeeds({
      startSeed: {
        effectiveDayStart: "2027-05-29T23:00:00+08:00",
        qimenSolarTerm: "芒種",
        isIntercalary: false,
      },
      count: 0,
    });
  });
  assertThrowsTypeError("qimen-sequential-seed-invalid-count-type", () => {
    buildQimenSequentialTermSeeds({
      startSeed: {
        effectiveDayStart: "2027-05-29T23:00:00+08:00",
        qimenSolarTerm: "芒種",
        isIntercalary: false,
      },
      count: "2",
    });
  });
}

function runQimenFullTermSeedCycleTests() {
  const dongzhiCycle = buildQimenFullTermSeedCycle({
    startSeed: {
      effectiveDayStart: "2027-12-25T23:00:00+08:00",
      qimenSolarTerm: "冬至",
      isIntercalary: false,
    },
  });
  qimenFullTermSeedCycleVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-dongzhi", "length", 24, dongzhiCycle.length);
  assertQimenYearSeedRecommendation("qimen-full-term-cycle-dongzhi-1", dongzhiCycle[0], {
    effectiveDayStart: "2027-12-25T23:00:00+08:00",
    qimenSolarTerm: "冬至",
    isIntercalary: false,
  });
  assertQimenYearSeedRecommendation("qimen-full-term-cycle-dongzhi-2", dongzhiCycle[1], {
    effectiveDayStart: "2028-01-09T23:00:00+08:00",
    qimenSolarTerm: "小寒",
    isIntercalary: false,
  });
  assertQimenYearSeedRecommendation("qimen-full-term-cycle-dongzhi-3", dongzhiCycle[2], {
    effectiveDayStart: "2028-01-24T23:00:00+08:00",
    qimenSolarTerm: "大寒",
    isIntercalary: false,
  });
  assertQimenYearSeedRecommendation("qimen-full-term-cycle-dongzhi-24", dongzhiCycle[23], {
    qimenSolarTerm: "大雪",
    isIntercalary: false,
  });

  const daxueCycle = buildQimenFullTermSeedCycle({
    startSeed: {
      effectiveDayStart: "2027-11-25T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      isIntercalary: false,
    },
    intercalations: [
      {
        afterTerm: "大雪",
        atEffectiveDayStart: "2027-12-10T23:00:00+08:00",
      },
    ],
  });
  qimenFullTermSeedCycleVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-daxue-intercalary", "length", 25, daxueCycle.length);
  assertQimenYearSeedRecommendation("qimen-full-term-cycle-daxue-intercalary-1", daxueCycle[0], {
    effectiveDayStart: "2027-11-25T23:00:00+08:00",
    qimenSolarTerm: "大雪",
    isIntercalary: false,
  });
  assertQimenYearSeedRecommendation("qimen-full-term-cycle-daxue-intercalary-2", daxueCycle[1], {
    effectiveDayStart: "2027-12-10T23:00:00+08:00",
    qimenSolarTerm: "大雪",
    isIntercalary: true,
  });
  assertQimenYearSeedRecommendation("qimen-full-term-cycle-daxue-intercalary-3", daxueCycle[2], {
    effectiveDayStart: "2027-12-25T23:00:00+08:00",
    qimenSolarTerm: "冬至",
    isIntercalary: false,
  });
  assertEqual(
    "qimen-full-term-cycle-daxue-intercalary",
    "normalSeedCount",
    24,
    daxueCycle.filter((seed) => seed.isIntercalary === false).length
  );
  assertEqual(
    "qimen-full-term-cycle-daxue-intercalary",
    "intercalarySeedCount",
    1,
    daxueCycle.filter((seed) => seed.isIntercalary === true).length
  );

  const mangzhongCycle = buildQimenFullTermSeedCycle({
    startSeed: {
      effectiveDayStart: "2027-05-29T23:00:00+08:00",
      qimenSolarTerm: "芒種",
      isIntercalary: false,
    },
  });
  qimenFullTermSeedCycleVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-mangzhong", "length", 24, mangzhongCycle.length);
  assertQimenYearSeedRecommendation("qimen-full-term-cycle-mangzhong-1", mangzhongCycle[0], {
    effectiveDayStart: "2027-05-29T23:00:00+08:00",
    qimenSolarTerm: "芒種",
    isIntercalary: false,
  });
  assertQimenYearSeedRecommendation("qimen-full-term-cycle-mangzhong-2", mangzhongCycle[1], {
    effectiveDayStart: "2027-06-13T23:00:00+08:00",
    qimenSolarTerm: "夏至",
    isIntercalary: false,
  });
  assertQimenYearSeedRecommendation("qimen-full-term-cycle-mangzhong-3", mangzhongCycle[2], {
    effectiveDayStart: "2027-06-28T23:00:00+08:00",
    qimenSolarTerm: "小暑",
    isIntercalary: false,
  });
  assertQimenYearSeedRecommendation("qimen-full-term-cycle-mangzhong-4", mangzhongCycle[3], {
    effectiveDayStart: "2027-07-13T23:00:00+08:00",
    qimenSolarTerm: "大暑",
    isIntercalary: false,
  });

  qimenFullTermSeedCycleVerifiedCaseCount += 1;
  for (const [index, seed] of [...dongzhiCycle, ...daxueCycle, ...mangzhongCycle].entries()) {
    const id = `qimen-full-term-cycle-structure-${index + 1}`;
    assertEqual(id, "source.present", true, typeof seed.source === "string" && seed.source.length > 0);
    assertEqual(id, "reason.present", true, typeof seed.reason === "string" && seed.reason.length > 0);
  }

  qimenFullTermSeedCycleVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-intercalation-time-mismatch", () => {
    buildQimenFullTermSeedCycle({
      startSeed: {
        effectiveDayStart: "2027-11-25T23:00:00+08:00",
        qimenSolarTerm: "大雪",
        isIntercalary: false,
      },
      intercalations: [
        {
          afterTerm: "大雪",
          atEffectiveDayStart: "2027-12-11T23:00:00+08:00",
        },
      ],
    });
  });

  qimenFullTermSeedCycleVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-invalid-start-term", () => {
    buildQimenFullTermSeedCycle({
      startSeed: {
        effectiveDayStart: "2027-12-25T23:00:00+08:00",
        qimenSolarTerm: "不存在",
        isIntercalary: false,
      },
    });
  });

  const sequentialDaxueCycle = buildQimenSequentialTermSeeds({
    startSeed: {
      effectiveDayStart: "2027-11-25T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      isIntercalary: false,
    },
    count: 24,
    intercalations: [
      {
        afterTerm: "大雪",
        atEffectiveDayStart: "2027-12-10T23:00:00+08:00",
      },
    ],
  });
  qimenFullTermSeedCycleVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-sequential-alignment", "length", sequentialDaxueCycle.length, daxueCycle.length);
  for (const [index, expectedSeed] of sequentialDaxueCycle.entries()) {
    assertQimenYearSeedRecommendation(
      `qimen-full-term-cycle-sequential-alignment-${index + 1}`,
      daxueCycle[index],
      {
        effectiveDayStart: expectedSeed.effectiveDayStart,
        qimenSolarTerm: expectedSeed.qimenSolarTerm,
        isIntercalary: expectedSeed.isIntercalary,
      }
    );
  }
}

function runQimenFullTermSeedCycleTimelineTests() {
  const dongzhiTimeline = buildQimenTimelineFromFullTermSeedCycle({
    startSeed: {
      effectiveDayStart: "2027-12-25T23:00:00+08:00",
      qimenSolarTerm: "冬至",
      isIntercalary: false,
    },
  });
  qimenFullTermSeedCycleTimelineVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-timeline-dongzhi", "length", 72, dongzhiTimeline.length);
  assertQimenRange("qimen-full-term-cycle-timeline-dongzhi-1", dongzhiTimeline[0], {
    qimenSolarTerm: "冬至",
    yuan: "上元",
    start: "2027-12-25T23:00:00+08:00",
    end: "2027-12-30T23:00:00+08:00",
    isIntercalary: false,
    sourceDayPillar: "己卯",
  });
  assertQimenRange("qimen-full-term-cycle-timeline-dongzhi-2", dongzhiTimeline[1], {
    qimenSolarTerm: "冬至",
    yuan: "中元",
    start: "2027-12-30T23:00:00+08:00",
    isIntercalary: false,
  });
  assertQimenRange("qimen-full-term-cycle-timeline-dongzhi-3", dongzhiTimeline[2], {
    qimenSolarTerm: "冬至",
    yuan: "下元",
    start: "2028-01-04T23:00:00+08:00",
    isIntercalary: false,
  });
  assertQimenRange("qimen-full-term-cycle-timeline-dongzhi-4", dongzhiTimeline[3], {
    qimenSolarTerm: "小寒",
    yuan: "上元",
    start: "2028-01-09T23:00:00+08:00",
    isIntercalary: false,
  });
  assertQimenRange("qimen-full-term-cycle-timeline-dongzhi-last-upper", dongzhiTimeline[69], {
    qimenSolarTerm: "大雪",
    yuan: "上元",
    isIntercalary: false,
  });
  assertQimenRange("qimen-full-term-cycle-timeline-dongzhi-last-middle", dongzhiTimeline[70], {
    qimenSolarTerm: "大雪",
    yuan: "中元",
    isIntercalary: false,
  });
  assertQimenRange("qimen-full-term-cycle-timeline-dongzhi-last-lower", dongzhiTimeline[71], {
    qimenSolarTerm: "大雪",
    yuan: "下元",
    isIntercalary: false,
  });
  assertTimelineStartsStrictlyIncreasing("qimen-full-term-cycle-timeline-dongzhi-order", dongzhiTimeline);

  const daxueTimeline = buildQimenTimelineFromFullTermSeedCycle({
    startSeed: {
      effectiveDayStart: "2027-11-25T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      isIntercalary: false,
    },
    intercalations: [
      {
        afterTerm: "大雪",
        atEffectiveDayStart: "2027-12-10T23:00:00+08:00",
      },
    ],
  });
  qimenFullTermSeedCycleTimelineVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-timeline-daxue-intercalary", "length", 75, daxueTimeline.length);
  assertQimenRange("qimen-full-term-cycle-timeline-daxue-intercalary-1", daxueTimeline[0], {
    qimenSolarTerm: "大雪",
    yuan: "上元",
    isIntercalary: false,
  });
  assertQimenRange("qimen-full-term-cycle-timeline-daxue-intercalary-2", daxueTimeline[1], {
    qimenSolarTerm: "大雪",
    yuan: "中元",
    isIntercalary: false,
  });
  assertQimenRange("qimen-full-term-cycle-timeline-daxue-intercalary-3", daxueTimeline[2], {
    qimenSolarTerm: "大雪",
    yuan: "下元",
    isIntercalary: false,
  });
  assertQimenRange("qimen-full-term-cycle-timeline-daxue-intercalary-4", daxueTimeline[3], {
    qimenSolarTerm: "大雪",
    yuan: "上元",
    isIntercalary: true,
  });
  assertQimenRange("qimen-full-term-cycle-timeline-daxue-intercalary-5", daxueTimeline[4], {
    qimenSolarTerm: "大雪",
    yuan: "中元",
    isIntercalary: true,
  });
  assertQimenRange("qimen-full-term-cycle-timeline-daxue-intercalary-6", daxueTimeline[5], {
    qimenSolarTerm: "大雪",
    yuan: "下元",
    isIntercalary: true,
  });
  assertQimenRange("qimen-full-term-cycle-timeline-daxue-intercalary-7", daxueTimeline[6], {
    qimenSolarTerm: "冬至",
    yuan: "上元",
    start: "2027-12-25T23:00:00+08:00",
    isIntercalary: false,
  });
  assertEqual(
    "qimen-full-term-cycle-timeline-daxue-intercalary",
    "normalEntryCount",
    72,
    daxueTimeline.filter((entry) => entry.isIntercalary === false).length
  );
  assertEqual(
    "qimen-full-term-cycle-timeline-daxue-intercalary",
    "intercalaryEntryCount",
    3,
    daxueTimeline.filter((entry) => entry.isIntercalary === true).length
  );

  qimenFullTermSeedCycleTimelineVerifiedCaseCount += 1;
  for (const expectedEntry of [
    {
      start: "2027-11-25T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "上元",
      isIntercalary: false,
    },
    {
      start: "2027-11-30T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "中元",
      isIntercalary: false,
    },
    {
      start: "2027-12-05T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "下元",
      isIntercalary: false,
    },
    {
      start: "2027-12-10T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "上元",
      isIntercalary: true,
    },
    {
      start: "2027-12-15T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "中元",
      isIntercalary: true,
    },
    {
      start: "2027-12-20T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "下元",
      isIntercalary: true,
    },
    {
      start: "2027-12-25T23:00:00+08:00",
      qimenSolarTerm: "冬至",
      yuan: "上元",
      isIntercalary: false,
    },
  ]) {
    assertQimenTimelineEntryByStart(
      `qimen-full-term-cycle-timeline-fixture-daxue-${expectedEntry.start}`,
      daxueTimeline,
      expectedEntry
    );
  }

  qimenFullTermSeedCycleTimelineVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-timeline-intercalation-time-mismatch", () => {
    buildQimenTimelineFromFullTermSeedCycle({
      startSeed: {
        effectiveDayStart: "2027-11-25T23:00:00+08:00",
        qimenSolarTerm: "大雪",
        isIntercalary: false,
      },
      intercalations: [
        {
          afterTerm: "大雪",
          atEffectiveDayStart: "2027-12-11T23:00:00+08:00",
        },
      ],
    });
  });

  qimenFullTermSeedCycleTimelineVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-timeline-invalid-start-term", () => {
    buildQimenTimelineFromFullTermSeedCycle({
      startSeed: {
        effectiveDayStart: "2027-12-25T23:00:00+08:00",
        qimenSolarTerm: "不存在",
        isIntercalary: false,
      },
    });
  });
}

function runQimenFullTermCycleDraftInputTests() {
  const draft2027 = buildQimenFullTermCycleDraftInputForYear(2027);
  qimenFullTermCycleDraftInputVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-input-2027", "year", 2027, draft2027.year);
  assertQimenYearSeedRecommendation("qimen-full-term-cycle-draft-input-2027-start", draft2027.startSeed, {
    effectiveDayStart: "2027-11-25T23:00:00+08:00",
    qimenSolarTerm: "大雪",
    isIntercalary: false,
  });
  assertEqual("qimen-full-term-cycle-draft-input-2027", "intercalations.length", 1, draft2027.intercalations.length);
  assertEqual("qimen-full-term-cycle-draft-input-2027", "intercalations.0.afterTerm", "大雪", draft2027.intercalations[0]?.afterTerm);
  assertEqual(
    "qimen-full-term-cycle-draft-input-2027",
    "intercalations.0.atEffectiveDayStart",
    "2027-12-10T23:00:00+08:00",
    draft2027.intercalations[0]?.atEffectiveDayStart
  );
  assertEqual("qimen-full-term-cycle-draft-input-2027", "windows.length", 2, draft2027.windows.length);
  assertEqual("qimen-full-term-cycle-draft-input-2027", "windows.hasMangzhong", true, draft2027.windows.some((window) => window.qimenSolarTerm === "芒種"));
  assertEqual("qimen-full-term-cycle-draft-input-2027", "windows.hasDaxue", true, draft2027.windows.some((window) => window.qimenSolarTerm === "大雪"));

  const draftTimeline = buildQimenTimelineFromFullTermSeedCycle({
    startSeed: draft2027.startSeed,
    intercalations: draft2027.intercalations,
  });
  qimenFullTermCycleDraftInputVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-input-timeline-2027", "length", 75, draftTimeline.length);
  assertQimenTimelineEntryByStart("qimen-full-term-cycle-draft-input-timeline-2027-daxue", draftTimeline, {
    start: "2027-11-25T23:00:00+08:00",
    qimenSolarTerm: "大雪",
    yuan: "上元",
    isIntercalary: false,
  });
  assertQimenTimelineEntryByStart("qimen-full-term-cycle-draft-input-timeline-2027-intercalary-daxue", draftTimeline, {
    start: "2027-12-10T23:00:00+08:00",
    qimenSolarTerm: "大雪",
    yuan: "上元",
    isIntercalary: true,
  });
  assertQimenTimelineEntryByStart("qimen-full-term-cycle-draft-input-timeline-2027-dongzhi", draftTimeline, {
    start: "2027-12-25T23:00:00+08:00",
    qimenSolarTerm: "冬至",
    yuan: "上元",
    isIntercalary: false,
  });

  qimenFullTermCycleDraftInputVerifiedCaseCount += 1;
  for (const expectedEntry of [
    {
      start: "2027-11-25T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "上元",
      isIntercalary: false,
    },
    {
      start: "2027-11-30T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "中元",
      isIntercalary: false,
    },
    {
      start: "2027-12-05T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "下元",
      isIntercalary: false,
    },
    {
      start: "2027-12-10T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "上元",
      isIntercalary: true,
    },
    {
      start: "2027-12-15T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "中元",
      isIntercalary: true,
    },
    {
      start: "2027-12-20T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "下元",
      isIntercalary: true,
    },
    {
      start: "2027-12-25T23:00:00+08:00",
      qimenSolarTerm: "冬至",
      yuan: "上元",
      isIntercalary: false,
    },
  ]) {
    assertQimenTimelineEntryByStart(
      `qimen-full-term-cycle-draft-input-fixture-daxue-${expectedEntry.start}`,
      draftTimeline,
      expectedEntry
    );
  }

  qimenFullTermCycleDraftInputVerifiedCaseCount += 1;
  assertThrowsTypeError("qimen-full-term-cycle-draft-input-invalid-year", () => {
    buildQimenFullTermCycleDraftInputForYear("2027");
  });

  qimenFullTermCycleDraftInputVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-draft-input-missing-year", () => {
    buildQimenFullTermCycleDraftInputForYear(1800);
  });

  qimenFullTermCycleDraftInputVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-draft-input-unsupported-start-term", () => {
    buildQimenFullTermCycleDraftInputForYear(2027, { startTerm: "芒種" });
  });
}

function runQimenFullTermCycleTimelineDraftForYearTests() {
  const draft2027 = buildQimenFullTermCycleTimelineDraftForYear(2027);
  qimenFullTermCycleTimelineDraftForYearVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-timeline-draft-year-2027", "year", 2027, draft2027.year);
  assertQimenYearSeedRecommendation("qimen-full-term-cycle-timeline-draft-year-2027-start", draft2027.startSeed, {
    effectiveDayStart: "2027-11-25T23:00:00+08:00",
    qimenSolarTerm: "大雪",
    isIntercalary: false,
  });
  assertEqual("qimen-full-term-cycle-timeline-draft-year-2027", "intercalations.length", 1, draft2027.intercalations.length);
  assertEqual("qimen-full-term-cycle-timeline-draft-year-2027", "intercalations.0.afterTerm", "大雪", draft2027.intercalations[0]?.afterTerm);
  assertEqual(
    "qimen-full-term-cycle-timeline-draft-year-2027",
    "intercalations.0.atEffectiveDayStart",
    "2027-12-10T23:00:00+08:00",
    draft2027.intercalations[0]?.atEffectiveDayStart
  );
  assertEqual("qimen-full-term-cycle-timeline-draft-year-2027", "windows.length", 2, draft2027.windows.length);
  assertEqual("qimen-full-term-cycle-timeline-draft-year-2027", "timeline.length", 75, draft2027.timeline.length);

  qimenFullTermCycleTimelineDraftForYearVerifiedCaseCount += 1;
  for (const expectedEntry of [
    {
      start: "2027-11-25T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "上元",
      isIntercalary: false,
    },
    {
      start: "2027-11-30T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "中元",
      isIntercalary: false,
    },
    {
      start: "2027-12-05T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "下元",
      isIntercalary: false,
    },
    {
      start: "2027-12-10T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "上元",
      isIntercalary: true,
    },
    {
      start: "2027-12-15T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "中元",
      isIntercalary: true,
    },
    {
      start: "2027-12-20T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "下元",
      isIntercalary: true,
    },
    {
      start: "2027-12-25T23:00:00+08:00",
      qimenSolarTerm: "冬至",
      yuan: "上元",
      isIntercalary: false,
    },
  ]) {
    assertQimenTimelineEntryByStart(
      `qimen-full-term-cycle-timeline-draft-year-core-${expectedEntry.start}`,
      draft2027.timeline,
      expectedEntry
    );
  }

  const directDraft = buildQimenFullTermCycleDraftInputForYear(2027);
  const directTimeline = buildQimenTimelineFromFullTermSeedCycle({
    startSeed: directDraft.startSeed,
    intercalations: directDraft.intercalations,
  });
  qimenFullTermCycleTimelineDraftForYearVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-timeline-draft-year-direct-alignment", "length", directTimeline.length, draft2027.timeline.length);
  for (const [index, expectedEntry] of directTimeline.entries()) {
    assertQimenRange(
      `qimen-full-term-cycle-timeline-draft-year-direct-alignment-${index + 1}`,
      draft2027.timeline[index],
      {
        qimenSolarTerm: expectedEntry.qimenSolarTerm,
        yuan: expectedEntry.yuan,
        start: expectedEntry.start,
        end: expectedEntry.end,
        isIntercalary: expectedEntry.isIntercalary,
        sourceDayPillar: expectedEntry.sourceDayPillar,
      }
    );
  }

  qimenFullTermCycleTimelineDraftForYearVerifiedCaseCount += 1;
  assertThrowsTypeError("qimen-full-term-cycle-timeline-draft-year-invalid-year", () => {
    buildQimenFullTermCycleTimelineDraftForYear("2027");
  });

  qimenFullTermCycleTimelineDraftForYearVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-timeline-draft-year-missing-year", () => {
    buildQimenFullTermCycleTimelineDraftForYear(1800);
  });

  qimenFullTermCycleTimelineDraftForYearVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-timeline-draft-year-unsupported-start-term", () => {
    buildQimenFullTermCycleTimelineDraftForYear(2027, { startTerm: "芒種" });
  });
}

function runQimenFullTermCycleTimelineDraftCrossYearTests() {
  for (const year of [2026, 2028]) {
    const draft = buildQimenFullTermCycleTimelineDraftForYear(year);
    qimenFullTermCycleTimelineDraftCrossYearVerifiedCaseCount += 1;

    assertQimenTimelineDraftShape(
      `qimen-full-term-cycle-timeline-draft-cross-year-${year}`,
      draft,
      year
    );
    assertQimenDraftTimelineLengthByIntercalations(
      `qimen-full-term-cycle-timeline-draft-cross-year-${year}`,
      draft
    );
    assertQimenDraftStartSeedEntry(
      `qimen-full-term-cycle-timeline-draft-cross-year-${year}`,
      draft
    );
    assertQimenDraftIntercalationEntries(
      `qimen-full-term-cycle-timeline-draft-cross-year-${year}`,
      draft
    );
  }
}

function runQimenFullTermCycleTimelineDraftMultiYearObservationTests() {
  const multiYearObservationCases = [
    {
      year: 2024,
      expectedStartSeed: "2024-11-25T23:00:00+08:00",
      expectedIntercalations: [
        {
          afterTerm: "大雪",
          atEffectiveDayStart: "2024-12-10T23:00:00+08:00",
        },
      ],
      expectedTimelineLength: 75,
    },
    {
      year: 2025,
      expectedStartSeed: "2025-12-05T23:00:00+08:00",
      expectedIntercalations: [],
      expectedTimelineLength: 72,
    },
    {
      year: 2026,
      expectedStartSeed: "2026-11-30T23:00:00+08:00",
      expectedIntercalations: [],
      expectedTimelineLength: 72,
    },
    {
      year: 2027,
      expectedStartSeed: "2027-11-25T23:00:00+08:00",
      expectedIntercalations: [
        {
          afterTerm: "大雪",
          atEffectiveDayStart: "2027-12-10T23:00:00+08:00",
        },
      ],
      expectedTimelineLength: 75,
    },
    {
      year: 2028,
      expectedStartSeed: "2028-12-04T23:00:00+08:00",
      expectedIntercalations: [],
      expectedTimelineLength: 72,
    },
    {
      year: 2029,
      expectedStartSeed: "2029-11-29T23:00:00+08:00",
      expectedIntercalations: [],
      expectedTimelineLength: 72,
    },
    {
      year: 2030,
      expectedStartSeed: "2030-11-24T23:00:00+08:00",
      expectedIntercalations: [
        {
          afterTerm: "大雪",
          atEffectiveDayStart: "2030-12-09T23:00:00+08:00",
        },
      ],
      expectedTimelineLength: 75,
    },
  ];

  for (const testCase of multiYearObservationCases) {
    const id = `qimen-full-term-cycle-timeline-draft-multi-year-${testCase.year}`;
    const draft = buildQimenFullTermCycleTimelineDraftForYear(testCase.year);
    qimenFullTermCycleTimelineDraftMultiYearObservationVerifiedCaseCount += 1;

    assertQimenTimelineDraftShape(id, draft, testCase.year);
    assertEqual(id, "startSeed.effectiveDayStart", testCase.expectedStartSeed, draft.startSeed?.effectiveDayStart);
    assertEqual(id, "intercalations.length", testCase.expectedIntercalations.length, draft.intercalations?.length);
    assertEqual(id, "timeline.length.observed", testCase.expectedTimelineLength, draft.timeline?.length);
    assertQimenDraftTimelineLengthByIntercalations(id, draft);
    assertQimenDraftStartSeedEntry(id, draft);
    assertQimenDraftIntercalationEntries(id, draft);

    for (const [index, expectedIntercalation] of testCase.expectedIntercalations.entries()) {
      assertEqual(
        `${id}-observed-intercalation-${index + 1}`,
        "afterTerm",
        expectedIntercalation.afterTerm,
        draft.intercalations?.[index]?.afterTerm
      );
      assertEqual(
        `${id}-observed-intercalation-${index + 1}`,
        "atEffectiveDayStart",
        expectedIntercalation.atEffectiveDayStart,
        draft.intercalations?.[index]?.atEffectiveDayStart
      );
    }
  }
}

function runQimenMultiYearFullTermCycleTimelineDraftTests() {
  const result2024To2030 = buildQimenMultiYearFullTermCycleTimelineDraft({
    startYear: 2024,
    endYear: 2030,
  });
  qimenMultiYearFullTermCycleTimelineDraftVerifiedCaseCount += 1;
  assertEqual("qimen-multi-year-full-term-cycle-draft-2024-2030", "startYear", 2024, result2024To2030.startYear);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2024-2030", "endYear", 2030, result2024To2030.endYear);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2024-2030", "yearDrafts.length", 7, result2024To2030.yearDrafts?.length);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2024-2030", "diagnostics.yearCount", 7, result2024To2030.diagnostics?.yearCount);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2024-2030", "diagnostics.entryCountBeforeDedupe", 513, result2024To2030.diagnostics?.entryCountBeforeDedupe);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2024-2030", "diagnostics.entryCountAfterDedupe", 513, result2024To2030.diagnostics?.entryCountAfterDedupe);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2024-2030", "diagnostics.afterDedupeAtMostBefore", true, result2024To2030.diagnostics?.entryCountAfterDedupe <= result2024To2030.diagnostics?.entryCountBeforeDedupe);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2024-2030", "duplicateStarts.length", 0, result2024To2030.diagnostics?.duplicateStarts?.length);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2024-2030", "gaps.length", 0, result2024To2030.diagnostics?.gaps?.length);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2024-2030", "overlaps.length", 0, result2024To2030.diagnostics?.overlaps?.length);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2024-2030", "timeline.isArray", true, Array.isArray(result2024To2030.timeline));
  assertEqual("qimen-multi-year-full-term-cycle-draft-2024-2030", "timeline.nonEmpty", true, result2024To2030.timeline?.length > 0);
  assertTimelineStartsStrictlyIncreasing("qimen-multi-year-full-term-cycle-draft-2024-2030-timeline", result2024To2030.timeline);
  for (const yearDraft of result2024To2030.yearDrafts) {
    assertQimenTimelineEntryByStart(
      `qimen-multi-year-full-term-cycle-draft-2024-2030-start-${yearDraft.year}`,
      result2024To2030.timeline,
      {
        start: yearDraft.startSeed.effectiveDayStart,
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: false,
      }
    );
  }

  const result2026To2028 = buildQimenMultiYearFullTermCycleTimelineDraft({
    startYear: 2026,
    endYear: 2028,
  });
  qimenMultiYearFullTermCycleTimelineDraftVerifiedCaseCount += 1;
  assertEqual("qimen-multi-year-full-term-cycle-draft-2026-2028", "yearDrafts.length", 3, result2026To2028.yearDrafts?.length);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2026-2028", "diagnostics.entryCountBeforeDedupe", 219, result2026To2028.diagnostics?.entryCountBeforeDedupe);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2026-2028", "diagnostics.entryCountAfterDedupe", 219, result2026To2028.diagnostics?.entryCountAfterDedupe);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2026-2028", "duplicateStarts.length", 0, result2026To2028.diagnostics?.duplicateStarts?.length);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2026-2028", "gaps.length", 0, result2026To2028.diagnostics?.gaps?.length);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2026-2028", "overlaps.length", 0, result2026To2028.diagnostics?.overlaps?.length);
  assertTimelineStartsStrictlyIncreasing("qimen-multi-year-full-term-cycle-draft-2026-2028-timeline", result2026To2028.timeline);
  for (const expectedStart of [
    "2026-11-30T23:00:00+08:00",
    "2027-11-25T23:00:00+08:00",
    "2028-12-04T23:00:00+08:00",
  ]) {
    assertQimenTimelineEntryByStart(
      `qimen-multi-year-full-term-cycle-draft-2026-2028-start-${expectedStart}`,
      result2026To2028.timeline,
      {
        start: expectedStart,
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: false,
      }
    );
  }
  assertQimenTimelineEntryByStart(
    "qimen-multi-year-full-term-cycle-draft-2026-2028-intercalary-daxue",
    result2026To2028.timeline,
    {
      start: "2027-12-10T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "上元",
      isIntercalary: true,
    }
  );

  const result2027 = buildQimenMultiYearFullTermCycleTimelineDraft({
    startYear: 2027,
    endYear: 2027,
  });
  const draft2027 = buildQimenFullTermCycleTimelineDraftForYear(2027);
  qimenMultiYearFullTermCycleTimelineDraftVerifiedCaseCount += 1;
  assertEqual("qimen-multi-year-full-term-cycle-draft-2027", "yearDrafts.length", 1, result2027.yearDrafts?.length);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2027", "entryCountBeforeDedupe", 75, result2027.diagnostics?.entryCountBeforeDedupe);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2027", "entryCountAfterDedupe", 75, result2027.diagnostics?.entryCountAfterDedupe);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2027", "timeline.length", 75, result2027.timeline?.length);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2027", "duplicateStarts.length", 0, result2027.diagnostics?.duplicateStarts?.length);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2027", "gaps.length", 0, result2027.diagnostics?.gaps?.length);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2027", "overlaps.length", 0, result2027.diagnostics?.overlaps?.length);
  assertEqual("qimen-multi-year-full-term-cycle-draft-2027", "directTimeline.length", draft2027.timeline.length, result2027.timeline?.length);
  for (const [index, expectedEntry] of draft2027.timeline.entries()) {
    assertQimenRange(
      `qimen-multi-year-full-term-cycle-draft-2027-direct-alignment-${index + 1}`,
      result2027.timeline[index],
      {
        qimenSolarTerm: expectedEntry.qimenSolarTerm,
        yuan: expectedEntry.yuan,
        start: expectedEntry.start,
        end: expectedEntry.end,
        isIntercalary: expectedEntry.isIntercalary,
        sourceDayPillar: expectedEntry.sourceDayPillar,
      }
    );
  }

  qimenMultiYearFullTermCycleTimelineDraftVerifiedCaseCount += 1;
  assertThrowsTypeError("qimen-multi-year-full-term-cycle-draft-invalid-start-year", () => {
    buildQimenMultiYearFullTermCycleTimelineDraft({ startYear: "2024", endYear: 2030 });
  });

  qimenMultiYearFullTermCycleTimelineDraftVerifiedCaseCount += 1;
  assertThrowsTypeError("qimen-multi-year-full-term-cycle-draft-invalid-end-year", () => {
    buildQimenMultiYearFullTermCycleTimelineDraft({ startYear: 2024, endYear: "2030" });
  });

  qimenMultiYearFullTermCycleTimelineDraftVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-multi-year-full-term-cycle-draft-invalid-range", () => {
    buildQimenMultiYearFullTermCycleTimelineDraft({ startYear: 2030, endYear: 2024 });
  });

  qimenMultiYearFullTermCycleTimelineDraftVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-multi-year-full-term-cycle-draft-missing-year-data", () => {
    buildQimenMultiYearFullTermCycleTimelineDraft({ startYear: 1800, endYear: 1800 });
  });
}

function runQimenMultiYearFullRangeDiagnosticsTests() {
  const safeStartYear = 1899;
  const safeEndYear = 2101;
  const fullRange = buildQimenMultiYearFullTermCycleTimelineDraft({
    startYear: safeStartYear,
    endYear: safeEndYear,
  });

  qimenMultiYearFullRangeDiagnosticsVerifiedCaseCount += 1;
  assertEqual("qimen-multi-year-full-range-diagnostics", "startYear", safeStartYear, fullRange.startYear);
  assertEqual("qimen-multi-year-full-range-diagnostics", "endYear", safeEndYear, fullRange.endYear);
  assertEqual("qimen-multi-year-full-range-diagnostics", "yearDrafts.length", 203, fullRange.yearDrafts?.length);
  assertEqual("qimen-multi-year-full-range-diagnostics", "diagnostics.yearCount", fullRange.yearDrafts?.length, fullRange.diagnostics?.yearCount);
  assertEqual("qimen-multi-year-full-range-diagnostics", "timeline.isArray", true, Array.isArray(fullRange.timeline));
  assertEqual("qimen-multi-year-full-range-diagnostics", "timeline.nonEmpty", true, fullRange.timeline?.length > 0);
  assertTimelineStartsStrictlyIncreasing("qimen-multi-year-full-range-diagnostics-timeline", fullRange.timeline);
  assertEqual(
    "qimen-multi-year-full-range-diagnostics",
    "afterDedupeAtMostBefore",
    true,
    fullRange.diagnostics?.entryCountAfterDedupe <= fullRange.diagnostics?.entryCountBeforeDedupe
  );
  assertEqual("qimen-multi-year-full-range-diagnostics", "entryCountBeforeDedupe", 14898, fullRange.diagnostics?.entryCountBeforeDedupe);
  assertEqual("qimen-multi-year-full-range-diagnostics", "entryCountAfterDedupe", 14829, fullRange.diagnostics?.entryCountAfterDedupe);
  assertEqual("qimen-multi-year-full-range-diagnostics", "duplicateStarts.length", 69, fullRange.diagnostics?.duplicateStarts?.length);
  assertEqual("qimen-multi-year-full-range-diagnostics", "gaps.length", 0, fullRange.diagnostics?.gaps?.length);
  assertEqual("qimen-multi-year-full-range-diagnostics", "overlaps.length", 0, fullRange.diagnostics?.overlaps?.length);
  assertEqual("qimen-multi-year-full-range-diagnostics-first-duplicate", "start", "1910-11-24T23:00:00+08:00", fullRange.diagnostics?.duplicateStarts?.[0]?.start);
  assertEqual("qimen-multi-year-full-range-diagnostics-first-duplicate", "count", 2, fullRange.diagnostics?.duplicateStarts?.[0]?.count);

  const intercalationCounts = fullRange.yearDrafts.map((draft) => ({
    year: draft.year,
    count: draft.intercalations.length,
    intercalations: draft.intercalations,
  }));
  const yearsWithIntercalation = intercalationCounts.filter((item) => item.count > 0);
  const yearsWithoutIntercalation = intercalationCounts.filter((item) => item.count === 0);
  const maxIntercalationsPerYear = Math.max(...intercalationCounts.map((item) => item.count));
  const yearsWithMultipleIntercalations = intercalationCounts.filter((item) => item.count > 1);

  assertEqual("qimen-multi-year-full-range-diagnostics-stats", "totalYears", 203, intercalationCounts.length);
  assertEqual("qimen-multi-year-full-range-diagnostics-stats", "yearsWithIntercalation.length", 94, yearsWithIntercalation.length);
  assertEqual("qimen-multi-year-full-range-diagnostics-stats", "yearsWithoutIntercalation.length", 109, yearsWithoutIntercalation.length);
  assertEqual("qimen-multi-year-full-range-diagnostics-stats", "maxIntercalationsPerYear", 1, maxIntercalationsPerYear);
  assertEqual("qimen-multi-year-full-range-diagnostics-stats", "yearsWithMultipleIntercalations.length", 0, yearsWithMultipleIntercalations.length);

  for (const expected of [
    {
      year: 2024,
      intercalationCount: 1,
      intercalationStart: "2024-12-10T23:00:00+08:00",
    },
    {
      year: 2025,
      intercalationCount: 0,
    },
    {
      year: 2027,
      intercalationCount: 1,
      intercalationStart: "2027-12-10T23:00:00+08:00",
    },
    {
      year: 2030,
      intercalationCount: 1,
      intercalationStart: "2030-12-09T23:00:00+08:00",
    },
  ]) {
    const yearDraft = fullRange.yearDrafts.find((draft) => draft.year === expected.year);
    assertEqual(
      `qimen-multi-year-full-range-diagnostics-sanity-${expected.year}`,
      "intercalations.length",
      expected.intercalationCount,
      yearDraft?.intercalations?.length
    );
    if (expected.intercalationStart) {
      assertEqual(
        `qimen-multi-year-full-range-diagnostics-sanity-${expected.year}`,
        "intercalations.0.afterTerm",
        "大雪",
        yearDraft?.intercalations?.[0]?.afterTerm
      );
      assertEqual(
        `qimen-multi-year-full-range-diagnostics-sanity-${expected.year}`,
        "intercalations.0.atEffectiveDayStart",
        expected.intercalationStart,
        yearDraft?.intercalations?.[0]?.atEffectiveDayStart
      );
    }
  }
}

function runQimenMultiYearDuplicateDetailDiagnosticsTests() {
  const fullRange = buildQimenMultiYearFullTermCycleTimelineDraft({
    startYear: 1899,
    endYear: 2101,
  });
  const duplicateGroups = getDuplicateTimelineGroupsFromYearDrafts(fullRange.yearDrafts);
  const duplicateStartByStart = new Map(
    fullRange.diagnostics.duplicateStarts.map((duplicateStart) => [duplicateStart.start, duplicateStart])
  );
  const groupsWithMoreThanTwoEntries = duplicateGroups.filter((group) => group.entries.length > 2);
  const equivalentDuplicateGroups = duplicateGroups.filter((group) => compareDuplicateTimelineEntries(group.entries));
  const differentDuplicateGroups = duplicateGroups.filter((group) => !compareDuplicateTimelineEntries(group.entries));
  const adjacentYearDuplicateGroups = duplicateGroups.filter((group) => {
    return Math.abs(group.entries[0].year - group.entries[1].year) === 1;
  });
  const nonAdjacentYearDuplicateGroups = duplicateGroups.filter((group) => {
    return Math.abs(group.entries[0].year - group.entries[1].year) !== 1;
  });
  const firstDuplicateGroup = duplicateGroups[0];
  const firstDifferentGroup = differentDuplicateGroups[0];
  const firstDifferentKeys = getDifferentKeysBetweenTimelineEntries(
    firstDifferentGroup.entries[0],
    firstDifferentGroup.entries[1]
  );

  qimenMultiYearDuplicateDetailDiagnosticsVerifiedCaseCount += 1;
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics", "duplicateGroups.length", 69, duplicateGroups.length);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics", "first.start", "1910-11-24T23:00:00+08:00", firstDuplicateGroup?.start);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics", "first.entries.length", 2, firstDuplicateGroup?.entries?.length);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics", "groupsWithMoreThanTwoEntries.length", 0, groupsWithMoreThanTwoEntries.length);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics", "diagnostics.duplicateStarts.length", fullRange.diagnostics.duplicateStarts.length, duplicateGroups.length);

  for (const [index, group] of duplicateGroups.entries()) {
    const diagnosticsDuplicate = duplicateStartByStart.get(group.start);
    assertEqual(`qimen-multi-year-duplicate-detail-diagnostics-group-${index + 1}`, "entries.length", 2, group.entries.length);
    assertEqual(`qimen-multi-year-duplicate-detail-diagnostics-group-${index + 1}`, "diagnostics.present", true, Boolean(diagnosticsDuplicate));
    assertEqual(`qimen-multi-year-duplicate-detail-diagnostics-group-${index + 1}`, "diagnostics.count", group.entries.length, diagnosticsDuplicate?.count);
  }

  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-equivalence", "equivalentDuplicateGroups.length", 0, equivalentDuplicateGroups.length);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-equivalence", "differentDuplicateGroups.length", 69, differentDuplicateGroups.length);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-equivalence", "firstDifferent.start", "1910-11-24T23:00:00+08:00", firstDifferentGroup?.start);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-equivalence", "firstDifferent.entries.0.year", 1909, firstDifferentGroup?.entries?.[0]?.year);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-equivalence", "firstDifferent.entries.1.year", 1910, firstDifferentGroup?.entries?.[1]?.year);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-equivalence", "firstDifferentKeys.length", 1, firstDifferentKeys.length);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-equivalence", "firstDifferentKeys.0", "qimenSolarTerm", firstDifferentKeys[0]);

  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-year-source", "adjacentYearDuplicateGroups.length", 69, adjacentYearDuplicateGroups.length);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-year-source", "nonAdjacentYearDuplicateGroups.length", 0, nonAdjacentYearDuplicateGroups.length);

  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-first", "start", "1910-11-24T23:00:00+08:00", firstDuplicateGroup?.start);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-first", "entries.0.year", 1909, firstDuplicateGroup?.entries?.[0]?.year);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-first", "entries.1.year", 1910, firstDuplicateGroup?.entries?.[1]?.year);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-first", "entries.0.qimenSolarTerm", "小雪", firstDuplicateGroup?.entries?.[0]?.qimenSolarTerm);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-first", "entries.1.qimenSolarTerm", "大雪", firstDuplicateGroup?.entries?.[1]?.qimenSolarTerm);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-first", "yuan", "上元", firstDuplicateGroup?.entries?.[0]?.yuan);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-first", "end", "1910-11-29T23:00:00+08:00", firstDuplicateGroup?.entries?.[0]?.end);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-first", "isIntercalary", false, firstDuplicateGroup?.entries?.[0]?.isIntercalary);
  assertEqual("qimen-multi-year-duplicate-detail-diagnostics-first", "sourceDayPillar", "甲午", firstDuplicateGroup?.entries?.[0]?.sourceDayPillar);
}

function runQimenFullTermCycleTimelineDraftLookupTests() {
  const lookupCases = [
    {
      id: "qimen-full-term-cycle-draft-lookup-1910-duplicate-start",
      input: "1910-11-24T23:30:00+08:00",
      expected: {
        qimenSolarTerm: "大雪",
        yuan: "上元",
        start: "1910-11-24T23:00:00+08:00",
        end: "1910-11-29T23:00:00+08:00",
        isIntercalary: false,
        sourceDayPillar: "甲午",
        queryEffectiveDayStart: "1910-11-24T23:00:00+08:00",
        selectedYear: 1910,
        candidateYears: [1910],
      },
    },
    {
      id: "qimen-full-term-cycle-draft-lookup-1910-before-duplicate-start",
      input: "1910-11-24T22:30:00+08:00",
      expected: {
        qimenSolarTerm: "立冬",
        yuan: "下元",
        start: "1910-11-19T23:00:00+08:00",
        end: "1910-11-24T23:00:00+08:00",
        isIntercalary: false,
        sourceDayPillar: "己丑",
        queryEffectiveDayStart: "1910-11-23T23:00:00+08:00",
        selectedYear: 1909,
        candidateYears: [1910, 1909],
      },
    },
    {
      id: "qimen-full-term-cycle-draft-lookup-1910-after-duplicate-start",
      input: "1910-11-25T12:00:00+08:00",
      expected: {
        qimenSolarTerm: "大雪",
        yuan: "上元",
        start: "1910-11-24T23:00:00+08:00",
        end: "1910-11-29T23:00:00+08:00",
        isIntercalary: false,
        sourceDayPillar: "甲午",
        queryEffectiveDayStart: "1910-11-24T23:00:00+08:00",
        selectedYear: 1910,
        candidateYears: [1910],
      },
    },
    {
      id: "qimen-full-term-cycle-draft-lookup-2027-intercalary-daxue",
      input: "2027-12-11T12:00:00+08:00",
      expected: {
        qimenSolarTerm: "大雪",
        yuan: "上元",
        start: "2027-12-10T23:00:00+08:00",
        end: "2027-12-15T23:00:00+08:00",
        isIntercalary: true,
        sourceDayPillar: "甲子",
        queryEffectiveDayStart: "2027-12-10T23:00:00+08:00",
        selectedYear: 2027,
        candidateYears: [2027],
      },
    },
    {
      id: "qimen-full-term-cycle-draft-lookup-2027-dongzhi",
      input: "2027-12-26T12:00:00+08:00",
      expected: {
        qimenSolarTerm: "冬至",
        yuan: "上元",
        start: "2027-12-25T23:00:00+08:00",
        end: "2027-12-30T23:00:00+08:00",
        isIntercalary: false,
        sourceDayPillar: "己卯",
        queryEffectiveDayStart: "2027-12-25T23:00:00+08:00",
        selectedYear: 2027,
        candidateYears: [2027],
      },
    },
    {
      id: "qimen-full-term-cycle-draft-lookup-2028-year-start-fallback",
      input: "2028-01-01T12:00:00+08:00",
      expected: {
        qimenSolarTerm: "冬至",
        yuan: "中元",
        start: "2027-12-30T23:00:00+08:00",
        end: "2028-01-04T23:00:00+08:00",
        isIntercalary: false,
        sourceDayPillar: "甲申",
        queryEffectiveDayStart: "2027-12-31T23:00:00+08:00",
        selectedYear: 2027,
        candidateYears: [2028, 2027],
      },
    },
  ];

  for (const testCase of lookupCases) {
    const actual = findQimenFullTermCycleTimelineDraftEntry(testCase.input);
    qimenFullTermCycleTimelineDraftLookupVerifiedCaseCount += 1;
    assertQimenRange(testCase.id, actual, {
      qimenSolarTerm: testCase.expected.qimenSolarTerm,
      yuan: testCase.expected.yuan,
      start: testCase.expected.start,
      end: testCase.expected.end,
      isIntercalary: testCase.expected.isIntercalary,
      sourceDayPillar: testCase.expected.sourceDayPillar,
    });
    assertEqual(testCase.id, "lookup.strategy", "cycle-year", actual?.lookup?.strategy);
    assertEqual(testCase.id, "lookup.queryEffectiveDayStart", testCase.expected.queryEffectiveDayStart, actual?.lookup?.queryEffectiveDayStart);
    assertEqual(testCase.id, "lookup.selectedYear", testCase.expected.selectedYear, actual?.lookup?.selectedYear);
    assertEqual(testCase.id, "lookup.candidateYears.length", testCase.expected.candidateYears.length, actual?.lookup?.candidateYears?.length);
    for (const [index, expectedYear] of testCase.expected.candidateYears.entries()) {
      assertEqual(`${testCase.id}-candidate-year-${index + 1}`, "year", expectedYear, actual?.lookup?.candidateYears?.[index]);
    }
  }

  qimenFullTermCycleTimelineDraftLookupVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-draft-lookup-invalid-strategy", () => {
    findQimenFullTermCycleTimelineDraftEntry("2027-12-26T12:00:00+08:00", {
      strategy: "unknown",
    });
  });

  qimenFullTermCycleTimelineDraftLookupVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-draft-lookup-missing-data", () => {
    findQimenFullTermCycleTimelineDraftEntry("1800-01-01T12:00:00+08:00");
  });
}

function runQimenFullTermCycleTimelineDraftLookupDuplicateBoundaryTests() {
  const fullRange = buildQimenMultiYearFullTermCycleTimelineDraft({
    startYear: 1899,
    endYear: 2101,
  });
  const duplicateGroups = getDuplicateTimelineGroupsFromYearDrafts(fullRange.yearDrafts);
  const sortedDuplicateGroups = duplicateGroups.map((group) => ({
    start: group.start,
    entries: [...group.entries].sort((a, b) => a.year - b.year),
  }));
  let boundaryAfterSelectedCurrentYearCount = 0;
  let boundaryAfterMismatchCount = 0;
  let boundaryBeforeSelectedPreviousYearCount = 0;
  let boundaryBeforeSelectedCurrentYearCount = 0;
  let boundaryBeforeOtherSelectedYearCount = 0;
  const boundaryBeforeOtherSamples = [];

  qimenFullTermCycleTimelineDraftLookupDuplicateBoundaryVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary", "duplicateGroups.length", 69, sortedDuplicateGroups.length);
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary", "first.start", "1910-11-24T23:00:00+08:00", sortedDuplicateGroups[0]?.start);

  for (const [index, group] of sortedDuplicateGroups.entries()) {
    const previousYearEntry = group.entries[0];
    const currentYearEntry = group.entries[1];
    const queryAfter = group.start.replace("T23:00:00+08:00", "T23:30:00+08:00");
    const lookupAfter = findQimenFullTermCycleTimelineDraftEntry(queryAfter);
    const queryBefore = group.start.replace("T23:00:00+08:00", "T22:30:00+08:00");
    const lookupBefore = findQimenFullTermCycleTimelineDraftEntry(queryBefore);
    const queryBeforeEffectiveDayStart = addQimenEffectiveDays(group.start, -1);

    assertEqual(`qimen-full-term-cycle-draft-lookup-duplicate-boundary-group-${index + 1}`, "entries.length", 2, group.entries.length);
    assertEqual(
      `qimen-full-term-cycle-draft-lookup-duplicate-boundary-group-${index + 1}`,
      "adjacentYears",
      1,
      currentYearEntry.year - previousYearEntry.year
    );

    if (
      lookupAfter?.lookup?.selectedYear === currentYearEntry.year
      && lookupAfter?.lookup?.queryEffectiveDayStart === group.start
      && lookupAfter?.qimenSolarTerm === currentYearEntry.qimenSolarTerm
      && lookupAfter?.yuan === currentYearEntry.yuan
      && lookupAfter?.start === currentYearEntry.start
      && lookupAfter?.end === currentYearEntry.end
      && lookupAfter?.isIntercalary === currentYearEntry.isIntercalary
      && lookupAfter?.sourceDayPillar === currentYearEntry.sourceDayPillar
    ) {
      boundaryAfterSelectedCurrentYearCount += 1;
    } else {
      boundaryAfterMismatchCount += 1;
    }

    assertEqual(
      `qimen-full-term-cycle-draft-lookup-duplicate-boundary-after-${index + 1}`,
      "selectedYear",
      currentYearEntry.year,
      lookupAfter?.lookup?.selectedYear
    );
    assertEqual(
      `qimen-full-term-cycle-draft-lookup-duplicate-boundary-after-${index + 1}`,
      "queryEffectiveDayStart",
      group.start,
      lookupAfter?.lookup?.queryEffectiveDayStart
    );

    assertEqual(
      `qimen-full-term-cycle-draft-lookup-duplicate-boundary-before-${index + 1}`,
      "present",
      true,
      Boolean(lookupBefore)
    );
    assertEqual(
      `qimen-full-term-cycle-draft-lookup-duplicate-boundary-before-${index + 1}`,
      "queryEffectiveDayStart",
      queryBeforeEffectiveDayStart,
      lookupBefore?.lookup?.queryEffectiveDayStart
    );
    assertEqual(
      `qimen-full-term-cycle-draft-lookup-duplicate-boundary-before-${index + 1}`,
      "end",
      group.start,
      lookupBefore?.end
    );
    assertEqual(
      `qimen-full-term-cycle-draft-lookup-duplicate-boundary-before-${index + 1}`,
      "ascendingRange",
      true,
      Date.parse(lookupBefore?.start) < Date.parse(lookupBefore?.end)
    );
    assertEqual(
      `qimen-full-term-cycle-draft-lookup-duplicate-boundary-before-${index + 1}`,
      "candidateYears.hasBoundaryYear",
      true,
      lookupBefore?.lookup?.candidateYears?.includes(currentYearEntry.year)
        || lookupBefore?.lookup?.candidateYears?.includes(previousYearEntry.year)
    );
    assertEqual(
      `qimen-full-term-cycle-draft-lookup-duplicate-boundary-before-${index + 1}`,
      "selectedYearIsBoundaryYear",
      true,
      lookupBefore?.lookup?.selectedYear === previousYearEntry.year
        || lookupBefore?.lookup?.selectedYear === currentYearEntry.year
    );

    if (lookupBefore?.lookup?.selectedYear === previousYearEntry.year) {
      boundaryBeforeSelectedPreviousYearCount += 1;
    } else if (lookupBefore?.lookup?.selectedYear === currentYearEntry.year) {
      boundaryBeforeSelectedCurrentYearCount += 1;
    } else {
      boundaryBeforeOtherSelectedYearCount += 1;
      if (boundaryBeforeOtherSamples.length < 3) {
        boundaryBeforeOtherSamples.push({
          start: group.start,
          queryBefore,
          previousYear: previousYearEntry.year,
          currentYear: currentYearEntry.year,
          selectedYear: lookupBefore?.lookup?.selectedYear,
          qimenSolarTerm: lookupBefore?.qimenSolarTerm,
          yuan: lookupBefore?.yuan,
          entryStart: lookupBefore?.start,
          entryEnd: lookupBefore?.end,
        });
      }
    }
  }

  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-stats", "boundaryAfterSelectedCurrentYearCount", 69, boundaryAfterSelectedCurrentYearCount);
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-stats", "boundaryAfterMismatchCount", 0, boundaryAfterMismatchCount);
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-stats", "boundaryBeforeSelectedPreviousYearCount", 23, boundaryBeforeSelectedPreviousYearCount);
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-stats", "boundaryBeforeSelectedCurrentYearCount", 46, boundaryBeforeSelectedCurrentYearCount);
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-stats", "boundaryBeforeOtherSelectedYearCount", 0, boundaryBeforeOtherSelectedYearCount);
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-stats", "boundaryBeforeOtherSamples.length", 0, boundaryBeforeOtherSamples.length);

  const firstBoundary = sortedDuplicateGroups[0];
  const firstBoundaryAfter = findQimenFullTermCycleTimelineDraftEntry("1910-11-24T23:30:00+08:00");
  const firstBoundaryBefore = findQimenFullTermCycleTimelineDraftEntry("1910-11-24T22:30:00+08:00");
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-1910-after", "start", "1910-11-24T23:00:00+08:00", firstBoundary?.start);
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-1910-after", "selectedYear", 1910, firstBoundaryAfter?.lookup?.selectedYear);
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-1910-after", "qimenSolarTerm", "大雪", firstBoundaryAfter?.qimenSolarTerm);
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-1910-after", "yuan", "上元", firstBoundaryAfter?.yuan);
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-1910-after", "sourceDayPillar", "甲午", firstBoundaryAfter?.sourceDayPillar);
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-1910-before", "selectedYear", 1909, firstBoundaryBefore?.lookup?.selectedYear);
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-1910-before", "qimenSolarTerm", "立冬", firstBoundaryBefore?.qimenSolarTerm);
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-1910-before", "yuan", "下元", firstBoundaryBefore?.yuan);
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-1910-before", "sourceDayPillar", "己丑", firstBoundaryBefore?.sourceDayPillar);
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-1910-before", "start", "1910-11-19T23:00:00+08:00", firstBoundaryBefore?.start);
  assertEqual("qimen-full-term-cycle-draft-lookup-duplicate-boundary-1910-before", "end", "1910-11-24T23:00:00+08:00", firstBoundaryBefore?.end);
}

function runQimenFullTermCycleTimelineDraftLookupResolverAlignmentTests() {
  const alignmentCases = [
    {
      id: "qimen-full-term-cycle-draft-lookup-resolver-alignment-mangzhong-middle",
      input: "2027-06-06T12:00:00+08:00",
      expected: {
        qimenSolarTerm: "芒種",
        yuan: "中元",
        isIntercalary: false,
        selectedYear: 2026,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-lookup-resolver-alignment-mangzhong-lower",
      input: "2027-06-13T12:00:00+08:00",
      expected: {
        qimenSolarTerm: "芒種",
        yuan: "下元",
        isIntercalary: false,
        selectedYear: 2026,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-lookup-resolver-alignment-xiazhi-upper",
      input: "2027-06-14T12:00:00+08:00",
      expected: {
        qimenSolarTerm: "夏至",
        yuan: "上元",
        isIntercalary: false,
        selectedYear: 2026,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-lookup-resolver-alignment-daxue-lower",
      input: "2027-12-07T18:00:00+08:00",
      expected: {
        qimenSolarTerm: "大雪",
        yuan: "下元",
        isIntercalary: false,
        selectedYear: 2027,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-lookup-resolver-alignment-daxue-intercalary-upper",
      input: "2027-12-11T12:00:00+08:00",
      expected: {
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: true,
        selectedYear: 2027,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-lookup-resolver-alignment-daxue-intercalary-middle",
      input: "2027-12-16T12:00:00+08:00",
      expected: {
        qimenSolarTerm: "大雪",
        yuan: "中元",
        isIntercalary: true,
        selectedYear: 2027,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-lookup-resolver-alignment-daxue-intercalary-lower",
      input: "2027-12-22T12:00:00+08:00",
      expected: {
        qimenSolarTerm: "大雪",
        yuan: "下元",
        isIntercalary: true,
        selectedYear: 2027,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-lookup-resolver-alignment-daxue-intercalary-lower-end",
      input: "2027-12-25T12:00:00+08:00",
      expected: {
        qimenSolarTerm: "大雪",
        yuan: "下元",
        isIntercalary: true,
        selectedYear: 2027,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-lookup-resolver-alignment-dongzhi-upper",
      input: "2027-12-26T12:00:00+08:00",
      expected: {
        qimenSolarTerm: "冬至",
        yuan: "上元",
        isIntercalary: false,
        selectedYear: 2027,
      },
    },
  ];

  for (const testCase of alignmentCases) {
    const resolverResult = resolveQimenJu(testCase.input);
    const draftEntry = findQimenFullTermCycleTimelineDraftEntry(testCase.input);
    qimenFullTermCycleTimelineDraftLookupResolverAlignmentVerifiedCaseCount += 1;

    assertEqual(testCase.id, "draftEntry.present", true, Boolean(draftEntry));
    assertEqual(testCase.id, "lookup.strategy", "cycle-year", draftEntry?.lookup?.strategy);
    assertEqual(testCase.id, "lookup.selectedYear", testCase.expected.selectedYear, draftEntry?.lookup?.selectedYear);
    assertEqual(testCase.id, "qimenSolarTerm.alignment", resolverResult.qimenSolarTerm, draftEntry?.qimenSolarTerm);
    assertEqual(testCase.id, "yuan.alignment", resolverResult.yuan, draftEntry?.yuan);
    assertEqual(testCase.id, "isIntercalary.alignment", resolverResult.isIntercalary, draftEntry?.isIntercalary);
    assertEqual(testCase.id, "qimenSolarTerm.expected", testCase.expected.qimenSolarTerm, draftEntry?.qimenSolarTerm);
    assertEqual(testCase.id, "yuan.expected", testCase.expected.yuan, draftEntry?.yuan);
    assertEqual(testCase.id, "isIntercalary.expected", testCase.expected.isIntercalary, draftEntry?.isIntercalary);
    assertEqual(testCase.id, "start.isString", true, typeof draftEntry?.start === "string" && draftEntry.start.length > 0);
    assertEqual(testCase.id, "end.isString", true, typeof draftEntry?.end === "string" && draftEntry.end.length > 0);
    assertEqual(testCase.id, "ascendingRange", true, Date.parse(draftEntry?.start) < Date.parse(draftEntry?.end));
    assertEqual(testCase.id, "sourceDayPillar.isString", true, typeof draftEntry?.sourceDayPillar === "string");
    assertEqual(testCase.id, "sourceDayPillar.length", 2, draftEntry?.sourceDayPillar?.length);
  }
}

function runQimenFullTermCycleDraftResolverFormatterTests() {
  const formatterCases = [
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-mangzhong-middle",
      input: "2027-06-06T12:00:00+08:00",
      expectedSelectedYear: 2026,
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-xiazhi-upper",
      input: "2027-06-14T12:00:00+08:00",
      expectedSelectedYear: 2026,
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-daxue-lower",
      input: "2027-12-07T18:00:00+08:00",
      expectedSelectedYear: 2027,
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-daxue-intercalary-upper",
      input: "2027-12-11T12:00:00+08:00",
      expectedSelectedYear: 2027,
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-daxue-intercalary-lower",
      input: "2027-12-22T12:00:00+08:00",
      expectedSelectedYear: 2027,
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-daxue-intercalary-lower-end",
      input: "2027-12-25T12:00:00+08:00",
      expectedSelectedYear: 2027,
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-dongzhi-upper",
      input: "2027-12-26T12:00:00+08:00",
      expectedSelectedYear: 2027,
    },
  ];

  for (const testCase of formatterCases) {
    const baseline = resolveQimenJu(testCase.input);
    const draftResult = resolveQimenJuFromFullTermCycleDraft(testCase.input);
    qimenFullTermCycleDraftResolverFormatterVerifiedCaseCount += 1;

    for (const key of [
      "actualSolarTerm",
      "qimenSolarTerm",
      "status",
      "yuan",
      "dunType",
      "dunName",
      "ju",
      "hourPillar",
      "isIntercalary",
    ]) {
      assertEqual(testCase.id, key, baseline[key], draftResult[key]);
    }

    assertEqual(testCase.id, "notes.isArray", true, Array.isArray(draftResult.notes));
    assertEqual(testCase.id, "notes.length", baseline.isIntercalary ? true : 0, baseline.isIntercalary ? draftResult.notes.length > 0 : draftResult.notes.length);
    assertEqual(testCase.id, "lookup.present", true, Boolean(draftResult.lookup));
    assertEqual(testCase.id, "lookup.strategy", "cycle-year", draftResult.lookup?.strategy);
    assertEqual(testCase.id, "lookup.selectedYear", testCase.expectedSelectedYear, draftResult.lookup?.selectedYear);
    assertEqual(testCase.id, "lookup.selectedYear.isInteger", true, Number.isInteger(draftResult.lookup?.selectedYear));
    assertEqual(testCase.id, "lookup.candidateYears.isArray", true, Array.isArray(draftResult.lookup?.candidateYears));
    assertEqual(testCase.id, "lookup.candidateYears.nonEmpty", true, draftResult.lookup?.candidateYears?.length > 0);
  }

  qimenFullTermCycleDraftResolverFormatterVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-draft-resolver-formatter-invalid-strategy", () => {
    resolveQimenJuFromFullTermCycleDraft("2027-12-26T12:00:00+08:00", {
      strategy: "unknown",
    });
  });

  qimenFullTermCycleDraftResolverFormatterVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-draft-resolver-formatter-missing-data", () => {
    resolveQimenJuFromFullTermCycleDraft("1800-01-01T12:00:00+08:00");
  });
}

function runQimenFullTermCycleDraftResolverFormatterRegressionTests() {
  const regressionCases = [
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-regression-2024-intercalary-daxue",
      input: "2024-12-11T12:00:00+08:00",
      expected: {
        selectedYear: 2024,
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: true,
        dunType: "yin",
        dunName: "陰遁",
        ju: 4,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-regression-2024-dongzhi",
      input: "2024-12-26T12:00:00+08:00",
      expected: {
        selectedYear: 2024,
        qimenSolarTerm: "冬至",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yang",
        dunName: "陽遁",
        ju: 1,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-regression-2025-daxue",
      input: "2025-12-06T12:00:00+08:00",
      expected: {
        selectedYear: 2025,
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yin",
        dunName: "陰遁",
        ju: 4,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-regression-2025-dongzhi",
      input: "2025-12-21T12:00:00+08:00",
      expected: {
        selectedYear: 2025,
        qimenSolarTerm: "冬至",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yang",
        dunName: "陽遁",
        ju: 1,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-regression-2026-daxue",
      input: "2026-12-01T12:00:00+08:00",
      expected: {
        selectedYear: 2026,
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yin",
        dunName: "陰遁",
        ju: 4,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-regression-2026-dongzhi",
      input: "2026-12-16T12:00:00+08:00",
      expected: {
        selectedYear: 2026,
        qimenSolarTerm: "冬至",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yang",
        dunName: "陽遁",
        ju: 1,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-regression-2027-intercalary-daxue",
      input: "2027-12-11T12:00:00+08:00",
      expected: {
        selectedYear: 2027,
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: true,
        dunType: "yin",
        dunName: "陰遁",
        ju: 4,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-regression-2027-dongzhi",
      input: "2027-12-26T12:00:00+08:00",
      expected: {
        selectedYear: 2027,
        qimenSolarTerm: "冬至",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yang",
        dunName: "陽遁",
        ju: 1,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-regression-2028-fallback-dongzhi",
      input: "2028-01-01T12:00:00+08:00",
      expected: {
        selectedYear: 2027,
        qimenSolarTerm: "冬至",
        yuan: "中元",
        isIntercalary: false,
        dunType: "yang",
        dunName: "陽遁",
        ju: 7,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-regression-2028-daxue",
      input: "2028-12-05T12:00:00+08:00",
      expected: {
        selectedYear: 2028,
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yin",
        dunName: "陰遁",
        ju: 4,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-regression-2029-daxue",
      input: "2029-11-30T12:00:00+08:00",
      expected: {
        selectedYear: 2029,
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yin",
        dunName: "陰遁",
        ju: 4,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-regression-2029-dongzhi",
      input: "2029-12-15T12:00:00+08:00",
      expected: {
        selectedYear: 2029,
        qimenSolarTerm: "冬至",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yang",
        dunName: "陽遁",
        ju: 1,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-regression-2030-intercalary-daxue",
      input: "2030-12-10T12:00:00+08:00",
      expected: {
        selectedYear: 2030,
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: true,
        dunType: "yin",
        dunName: "陰遁",
        ju: 4,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-resolver-formatter-regression-2030-dongzhi",
      input: "2030-12-25T12:00:00+08:00",
      expected: {
        selectedYear: 2030,
        qimenSolarTerm: "冬至",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yang",
        dunName: "陽遁",
        ju: 1,
      },
    },
  ];
  let intercalaryCaseCount = 0;
  let nonIntercalaryCaseCount = 0;
  let selectedYearFallbackCount = 0;
  let selectedYearSameAsCivilYearCount = 0;

  for (const testCase of regressionCases) {
    const actual = resolveQimenJuFromFullTermCycleDraft(testCase.input);
    const civilYear = Number(testCase.input.slice(0, 4));
    qimenFullTermCycleDraftResolverFormatterRegressionVerifiedCaseCount += 1;

    assertEqual(testCase.id, "present", true, Boolean(actual));
    assertEqual(testCase.id, "actualSolarTerm.isString", true, typeof actual.actualSolarTerm === "string" && actual.actualSolarTerm.length > 0);
    assertEqual(testCase.id, "qimenSolarTerm", testCase.expected.qimenSolarTerm, actual.qimenSolarTerm);
    assertEqual(testCase.id, "yuan", testCase.expected.yuan, actual.yuan);
    assertEqual(testCase.id, "isIntercalary", testCase.expected.isIntercalary, actual.isIntercalary);
    assertEqual(testCase.id, "dunType", testCase.expected.dunType, actual.dunType);
    assertEqual(testCase.id, "dunName", testCase.expected.dunName, actual.dunName);
    assertEqual(testCase.id, "ju", testCase.expected.ju, actual.ju);
    assertEqual(testCase.id, "hourPillar.isString", true, typeof actual.hourPillar === "string");
    assertEqual(testCase.id, "hourPillar.length", 2, actual.hourPillar?.length);
    assertEqual(testCase.id, "status.isString", true, typeof actual.status === "string" && actual.status.length > 0);
    assertEqual(testCase.id, "notes.isArray", true, Array.isArray(actual.notes));
    assertEqual(testCase.id, "notes.length", testCase.expected.isIntercalary ? true : 0, testCase.expected.isIntercalary ? actual.notes.length > 0 : actual.notes.length);
    assertEqual(testCase.id, "lookup.strategy", "cycle-year", actual.lookup?.strategy);
    assertEqual(testCase.id, "lookup.selectedYear", testCase.expected.selectedYear, actual.lookup?.selectedYear);
    assertEqual(testCase.id, "lookup.candidateYears.isArray", true, Array.isArray(actual.lookup?.candidateYears));
    assertEqual(testCase.id, "lookup.candidateYears.nonEmpty", true, actual.lookup?.candidateYears?.length > 0);
    assertEqual(testCase.id, "lookup.queryEffectiveDayStart.isString", true, typeof actual.lookup?.queryEffectiveDayStart === "string" && actual.lookup.queryEffectiveDayStart.length > 0);

    if (actual.isIntercalary) {
      intercalaryCaseCount += 1;
    } else {
      nonIntercalaryCaseCount += 1;
    }

    if (actual.lookup?.selectedYear === civilYear) {
      selectedYearSameAsCivilYearCount += 1;
    } else {
      selectedYearFallbackCount += 1;
    }
  }

  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-regression-stats", "normalCaseCount", 14, regressionCases.length);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-regression-stats", "intercalaryCaseCount", 3, intercalaryCaseCount);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-regression-stats", "nonIntercalaryCaseCount", 11, nonIntercalaryCaseCount);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-regression-stats", "selectedYearFallbackCount", 1, selectedYearFallbackCount);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-regression-stats", "selectedYearSameAsCivilYearCount", 13, selectedYearSameAsCivilYearCount);
}

function runQimenFullTermCycleDraftResolverFormatterDuplicateBoundaryTests() {
  const fullRange = buildQimenMultiYearFullTermCycleTimelineDraft({
    startYear: 1899,
    endYear: 2101,
  });
  const duplicateGroups = getDuplicateTimelineGroupsFromYearDrafts(fullRange.yearDrafts);
  const sortedDuplicateGroups = duplicateGroups.map((group) => ({
    start: group.start,
    entries: [...group.entries].sort((a, b) => a.year - b.year),
  }));
  let boundaryAfterSelectedCurrentYearCount = 0;
  let boundaryAfterMismatchCount = 0;
  let boundaryBeforeSelectedPreviousYearCount = 0;
  let boundaryBeforeSelectedCurrentYearCount = 0;
  let boundaryBeforeOtherSelectedYearCount = 0;

  qimenFullTermCycleDraftResolverFormatterDuplicateBoundaryVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary", "duplicateGroups.length", 69, sortedDuplicateGroups.length);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary", "first.start", "1910-11-24T23:00:00+08:00", sortedDuplicateGroups[0]?.start);

  for (const [index, group] of sortedDuplicateGroups.entries()) {
    const previousYearEntry = group.entries[0];
    const currentYearEntry = group.entries[1];
    const queryAfter = group.start.replace("T23:00:00+08:00", "T23:30:00+08:00");
    const formatterAfter = resolveQimenJuFromFullTermCycleDraft(queryAfter);
    const queryBefore = group.start.replace("T23:00:00+08:00", "T22:30:00+08:00");
    const formatterBefore = resolveQimenJuFromFullTermCycleDraft(queryBefore);
    const queryBeforeEffectiveDayStart = addQimenEffectiveDays(group.start, -1);

    assertEqual(`qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-group-${index + 1}`, "entries.length", 2, group.entries.length);
    assertEqual(
      `qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-group-${index + 1}`,
      "adjacentYears",
      1,
      currentYearEntry.year - previousYearEntry.year
    );

    if (
      formatterAfter?.lookup?.selectedYear === currentYearEntry.year
      && formatterAfter?.lookup?.queryEffectiveDayStart === group.start
      && formatterAfter?.qimenSolarTerm === currentYearEntry.qimenSolarTerm
      && formatterAfter?.yuan === currentYearEntry.yuan
      && formatterAfter?.isIntercalary === currentYearEntry.isIntercalary
    ) {
      boundaryAfterSelectedCurrentYearCount += 1;
    } else {
      boundaryAfterMismatchCount += 1;
    }

    assertEqual(
      `qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-after-${index + 1}`,
      "selectedYear",
      currentYearEntry.year,
      formatterAfter?.lookup?.selectedYear
    );
    assertEqual(
      `qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-after-${index + 1}`,
      "queryEffectiveDayStart",
      group.start,
      formatterAfter?.lookup?.queryEffectiveDayStart
    );
    assertEqual(
      `qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-after-${index + 1}`,
      "qimenSolarTerm",
      currentYearEntry.qimenSolarTerm,
      formatterAfter?.qimenSolarTerm
    );
    assertEqual(
      `qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-after-${index + 1}`,
      "yuan",
      currentYearEntry.yuan,
      formatterAfter?.yuan
    );
    assertEqual(
      `qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-after-${index + 1}`,
      "isIntercalary",
      currentYearEntry.isIntercalary,
      formatterAfter?.isIntercalary
    );
    assertQimenDraftFormatterBoundaryShape(
      `qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-after-${index + 1}`,
      formatterAfter
    );

    assertEqual(
      `qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-before-${index + 1}`,
      "queryEffectiveDayStart",
      queryBeforeEffectiveDayStart,
      formatterBefore?.lookup?.queryEffectiveDayStart
    );
    assertEqual(
      `qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-before-${index + 1}`,
      "candidateYears.hasBoundaryYear",
      true,
      formatterBefore?.lookup?.candidateYears?.includes(previousYearEntry.year)
        || formatterBefore?.lookup?.candidateYears?.includes(currentYearEntry.year)
    );
    assertEqual(
      `qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-before-${index + 1}`,
      "selectedYearIsBoundaryYear",
      true,
      formatterBefore?.lookup?.selectedYear === previousYearEntry.year
        || formatterBefore?.lookup?.selectedYear === currentYearEntry.year
    );
    assertEqual(
      `qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-before-${index + 1}`,
      "yuan.isKnown",
      true,
      ["上元", "中元", "下元"].includes(formatterBefore?.yuan)
    );
    assertEqual(
      `qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-before-${index + 1}`,
      "isIntercalary.isBoolean",
      true,
      typeof formatterBefore?.isIntercalary === "boolean"
    );
    assertQimenDraftFormatterBoundaryShape(
      `qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-before-${index + 1}`,
      formatterBefore
    );

    if (formatterBefore?.lookup?.selectedYear === previousYearEntry.year) {
      boundaryBeforeSelectedPreviousYearCount += 1;
    } else if (formatterBefore?.lookup?.selectedYear === currentYearEntry.year) {
      boundaryBeforeSelectedCurrentYearCount += 1;
    } else {
      boundaryBeforeOtherSelectedYearCount += 1;
    }
  }

  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-stats", "boundaryAfterSelectedCurrentYearCount", 69, boundaryAfterSelectedCurrentYearCount);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-stats", "boundaryAfterMismatchCount", 0, boundaryAfterMismatchCount);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-stats", "boundaryBeforeSelectedPreviousYearCount", 23, boundaryBeforeSelectedPreviousYearCount);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-stats", "boundaryBeforeSelectedCurrentYearCount", 46, boundaryBeforeSelectedCurrentYearCount);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-stats", "boundaryBeforeOtherSelectedYearCount", 0, boundaryBeforeOtherSelectedYearCount);

  const firstBoundaryAfter = resolveQimenJuFromFullTermCycleDraft("1910-11-24T23:30:00+08:00");
  const firstBoundaryBefore = resolveQimenJuFromFullTermCycleDraft("1910-11-24T22:30:00+08:00");
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-1910-after", "selectedYear", 1910, firstBoundaryAfter?.lookup?.selectedYear);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-1910-after", "qimenSolarTerm", "大雪", firstBoundaryAfter?.qimenSolarTerm);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-1910-after", "yuan", "上元", firstBoundaryAfter?.yuan);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-1910-after", "isIntercalary", false, firstBoundaryAfter?.isIntercalary);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-1910-after", "dunName", "陰遁", firstBoundaryAfter?.dunName);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-1910-after", "ju", 4, firstBoundaryAfter?.ju);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-1910-before", "selectedYear", 1909, firstBoundaryBefore?.lookup?.selectedYear);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-1910-before", "qimenSolarTerm", "立冬", firstBoundaryBefore?.qimenSolarTerm);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-1910-before", "yuan", "下元", firstBoundaryBefore?.yuan);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-1910-before", "isIntercalary", false, firstBoundaryBefore?.isIntercalary);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-1910-before", "dunName", "陰遁", firstBoundaryBefore?.dunName);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-duplicate-boundary-1910-before", "ju", 3, firstBoundaryBefore?.ju);
}

function assertQimenDraftFormatterBoundaryShape(id, result) {
  assertEqual(id, "present", true, Boolean(result));
  assertEqual(id, "actualSolarTerm.isString", true, typeof result?.actualSolarTerm === "string" && result.actualSolarTerm.length > 0);
  assertEqual(id, "qimenSolarTerm.isString", true, typeof result?.qimenSolarTerm === "string" && result.qimenSolarTerm.length > 0);
  assertEqual(id, "dunType.isKnown", true, ["yin", "yang"].includes(result?.dunType));
  assertEqual(id, "dunName.isKnown", true, ["陰遁", "陽遁"].includes(result?.dunName));
  assertEqual(id, "ju.isInteger", true, Number.isInteger(result?.ju));
  assertEqual(id, "ju.inRange", true, result?.ju >= 1 && result?.ju <= 9);
  assertEqual(id, "hourPillar.isString", true, typeof result?.hourPillar === "string");
  assertEqual(id, "hourPillar.length", 2, result?.hourPillar?.length);
  assertEqual(id, "status.isString", true, typeof result?.status === "string" && result.status.length > 0);
  assertEqual(id, "notes.isArray", true, Array.isArray(result?.notes));
  assertEqual(id, "notes.length", result?.isIntercalary ? true : 0, result?.isIntercalary ? result.notes.length > 0 : result?.notes?.length);
}

function runQimenFullTermCycleDraftCacheTests() {
  clearQimenFullTermCycleTimelineDraftCache();
  let stats = getQimenFullTermCycleTimelineDraftCacheStats();
  qimenFullTermCycleDraftCacheVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cache-initial", "size", 0, stats.size);
  assertEqual("qimen-full-term-cycle-draft-cache-initial", "keys.length", 0, stats.keys.length);
  assertEqual("qimen-full-term-cycle-draft-cache-initial", "hits", 0, stats.hits);
  assertEqual("qimen-full-term-cycle-draft-cache-initial", "misses", 0, stats.misses);

  clearQimenFullTermCycleTimelineDraftCache();
  for (const year of [2024, 2025, 2026, 2027, 2028, 2029, 2030]) {
    const nonCached = buildQimenFullTermCycleTimelineDraftForYear(year);
    const cached = getQimenFullTermCycleTimelineDraftForYearCached(year);
    qimenFullTermCycleDraftCacheVerifiedCaseCount += 1;
    assertQimenFullTermCycleDraftEquivalent(
      `qimen-full-term-cycle-draft-cache-equivalence-${year}`,
      nonCached,
      cached
    );
  }

  stats = getQimenFullTermCycleTimelineDraftCacheStats();
  qimenFullTermCycleDraftCacheVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cache-stats-after-fill", "size", 7, stats.size);
  assertEqual("qimen-full-term-cycle-draft-cache-stats-after-fill", "keys.length", 7, stats.keys.length);
  assertEqual("qimen-full-term-cycle-draft-cache-stats-after-fill", "has.2024", true, stats.keys.includes("year=2024|startTerm=大雪|before=0|after=15"));
  assertEqual("qimen-full-term-cycle-draft-cache-stats-after-fill", "has.2030", true, stats.keys.includes("year=2030|startTerm=大雪|before=0|after=15"));
  assertEqual("qimen-full-term-cycle-draft-cache-stats-after-fill", "hits", 0, stats.hits);
  assertEqual("qimen-full-term-cycle-draft-cache-stats-after-fill", "misses", 7, stats.misses);

  getQimenFullTermCycleTimelineDraftForYearCached(2024);
  getQimenFullTermCycleTimelineDraftForYearCached(2027);
  getQimenFullTermCycleTimelineDraftForYearCached(2030);
  stats = getQimenFullTermCycleTimelineDraftCacheStats();
  assertEqual("qimen-full-term-cycle-draft-cache-stats-after-hits", "size", 7, stats.size);
  assertEqual("qimen-full-term-cycle-draft-cache-stats-after-hits", "hits", 3, stats.hits);
  assertEqual("qimen-full-term-cycle-draft-cache-stats-after-hits", "misses", 7, stats.misses);

  clearQimenFullTermCycleTimelineDraftCache();
  const firstCached2027 = getQimenFullTermCycleTimelineDraftForYearCached(2027);
  firstCached2027.timeline[0].qimenSolarTerm = "污染測試";
  firstCached2027.startSeed.qimenSolarTerm = "污染測試";
  if (firstCached2027.intercalations[0]) {
    firstCached2027.intercalations[0].afterTerm = "污染測試";
  }
  const secondCached2027 = getQimenFullTermCycleTimelineDraftForYearCached(2027);
  qimenFullTermCycleDraftCacheVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cache-mutation-safety", "timeline.0.notPolluted", true, secondCached2027.timeline[0]?.qimenSolarTerm !== "污染測試");
  assertEqual("qimen-full-term-cycle-draft-cache-mutation-safety", "startSeed.qimenSolarTerm", "大雪", secondCached2027.startSeed.qimenSolarTerm);
  assertEqual("qimen-full-term-cycle-draft-cache-mutation-safety", "timeline.0.qimenSolarTerm", "大雪", secondCached2027.timeline[0]?.qimenSolarTerm);
  assertEqual("qimen-full-term-cycle-draft-cache-mutation-safety", "intercalations.0.afterTerm", "大雪", secondCached2027.intercalations[0]?.afterTerm);

  clearQimenFullTermCycleTimelineDraftCache();
  const defaultOptionsDraft = getQimenFullTermCycleTimelineDraftForYearCached(2027);
  const explicitDefaultOptionsDraft = getQimenFullTermCycleTimelineDraftForYearCached(2027, {
    startTerm: "大雪",
    beforeStartEffectiveDays: 0,
    afterEndEffectiveDays: 15,
  });
  stats = getQimenFullTermCycleTimelineDraftCacheStats();
  qimenFullTermCycleDraftCacheVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cache-options-normalization", "size", 1, stats.size);
  assertEqual("qimen-full-term-cycle-draft-cache-options-normalization", "key", "year=2027|startTerm=大雪|before=0|after=15", stats.keys[0]);
  assertEqual("qimen-full-term-cycle-draft-cache-options-normalization", "hits", 1, stats.hits);
  assertEqual("qimen-full-term-cycle-draft-cache-options-normalization", "misses", 1, stats.misses);
  assertQimenFullTermCycleDraftEquivalent(
    "qimen-full-term-cycle-draft-cache-options-normalization-equivalence",
    defaultOptionsDraft,
    explicitDefaultOptionsDraft
  );

  clearQimenFullTermCycleTimelineDraftCache();
  getQimenFullTermCycleTimelineDraftForYearCached(2027);
  getQimenFullTermCycleTimelineDraftForYearCached(2027, { afterEndEffectiveDays: 30 });
  stats = getQimenFullTermCycleTimelineDraftCacheStats();
  qimenFullTermCycleDraftCacheVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cache-options-split", "size", 2, stats.size);
  assertEqual("qimen-full-term-cycle-draft-cache-options-split", "has.default", true, stats.keys.includes("year=2027|startTerm=大雪|before=0|after=15"));
  assertEqual("qimen-full-term-cycle-draft-cache-options-split", "has.after30", true, stats.keys.includes("year=2027|startTerm=大雪|before=0|after=30"));
  assertEqual("qimen-full-term-cycle-draft-cache-options-split", "hits", 0, stats.hits);
  assertEqual("qimen-full-term-cycle-draft-cache-options-split", "misses", 2, stats.misses);

  clearQimenFullTermCycleTimelineDraftCache();
  qimenFullTermCycleDraftCacheVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-draft-cache-error-no-pollution", () => {
    getQimenFullTermCycleTimelineDraftForYearCached(1800);
  });
  stats = getQimenFullTermCycleTimelineDraftCacheStats();
  assertEqual("qimen-full-term-cycle-draft-cache-error-no-pollution", "size", 0, stats.size);
  assertEqual("qimen-full-term-cycle-draft-cache-error-no-pollution", "keys.length", 0, stats.keys.length);
}

function assertQimenFullTermCycleDraftEquivalent(id, expected, actual) {
  assertEqual(id, "year", expected.year, actual.year);
  assertEqual(id, "startSeed.effectiveDayStart", expected.startSeed?.effectiveDayStart, actual.startSeed?.effectiveDayStart);
  assertEqual(id, "startSeed.qimenSolarTerm", expected.startSeed?.qimenSolarTerm, actual.startSeed?.qimenSolarTerm);
  assertEqual(id, "startSeed.isIntercalary", expected.startSeed?.isIntercalary, actual.startSeed?.isIntercalary);
  assertEqual(id, "intercalations.length", expected.intercalations?.length, actual.intercalations?.length);
  assertEqual(id, "windows.length", expected.windows?.length, actual.windows?.length);
  assertEqual(id, "timeline.length", expected.timeline?.length, actual.timeline?.length);

  for (const [index, expectedEntry] of expected.timeline.entries()) {
    const actualEntry = actual.timeline[index];
    assertEqual(`${id}-timeline-${index + 1}`, "qimenSolarTerm", expectedEntry.qimenSolarTerm, actualEntry?.qimenSolarTerm);
    assertEqual(`${id}-timeline-${index + 1}`, "yuan", expectedEntry.yuan, actualEntry?.yuan);
    assertEqual(`${id}-timeline-${index + 1}`, "start", expectedEntry.start, actualEntry?.start);
    assertEqual(`${id}-timeline-${index + 1}`, "end", expectedEntry.end, actualEntry?.end);
    assertEqual(`${id}-timeline-${index + 1}`, "isIntercalary", expectedEntry.isIntercalary, actualEntry?.isIntercalary);
    assertEqual(`${id}-timeline-${index + 1}`, "sourceDayPillar", expectedEntry.sourceDayPillar, actualEntry?.sourceDayPillar);
  }
}

function runQimenFullTermCycleTimelineDraftCachedLookupTests() {
  const representativeCases = [
    "1910-11-24T23:30:00+08:00",
    "1910-11-24T22:30:00+08:00",
    "1910-11-25T12:00:00+08:00",
    "2027-06-06T12:00:00+08:00",
    "2027-06-14T12:00:00+08:00",
    "2027-12-11T12:00:00+08:00",
    "2027-12-26T12:00:00+08:00",
    "2028-01-01T12:00:00+08:00",
    "2030-12-10T12:00:00+08:00",
    "2030-12-25T12:00:00+08:00",
  ];

  clearQimenFullTermCycleTimelineDraftCache();
  for (const input of representativeCases) {
    const nonCached = findQimenFullTermCycleTimelineDraftEntry(input);
    const cached = findQimenFullTermCycleTimelineDraftEntryCached(input);
    qimenFullTermCycleTimelineDraftCachedLookupVerifiedCaseCount += 1;
    assertQimenDraftLookupEquivalent(
      `qimen-full-term-cycle-draft-cached-lookup-representative-${input}`,
      nonCached,
      cached
    );
  }

  clearQimenFullTermCycleTimelineDraftCache();
  const cachedDaxueUpper = findQimenFullTermCycleTimelineDraftEntryCached("2027-12-11T12:00:00+08:00");
  const cachedDaxueMiddle = findQimenFullTermCycleTimelineDraftEntryCached("2027-12-16T12:00:00+08:00");
  const cachedDongzhiUpper = findQimenFullTermCycleTimelineDraftEntryCached("2027-12-26T12:00:00+08:00");
  let stats = getQimenFullTermCycleTimelineDraftCacheStats();
  qimenFullTermCycleTimelineDraftCachedLookupVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-stats-2027", "selectedYear.1", 2027, cachedDaxueUpper?.lookup?.selectedYear);
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-stats-2027", "selectedYear.2", 2027, cachedDaxueMiddle?.lookup?.selectedYear);
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-stats-2027", "selectedYear.3", 2027, cachedDongzhiUpper?.lookup?.selectedYear);
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-stats-2027", "size", 1, stats.size);
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-stats-2027", "misses", 1, stats.misses);
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-stats-2027", "hits.atLeast2", true, stats.hits >= 2);
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-stats-2027", "has.key", true, stats.keys.includes("year=2027|startTerm=大雪|before=0|after=15"));

  clearQimenFullTermCycleTimelineDraftCache();
  const fallbackLookup = findQimenFullTermCycleTimelineDraftEntryCached("2028-01-01T12:00:00+08:00");
  stats = getQimenFullTermCycleTimelineDraftCacheStats();
  qimenFullTermCycleTimelineDraftCachedLookupVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-fallback", "selectedYear", 2027, fallbackLookup?.lookup?.selectedYear);
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-fallback", "candidateYears.length", 2, fallbackLookup?.lookup?.candidateYears?.length);
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-fallback", "candidateYears.0", 2028, fallbackLookup?.lookup?.candidateYears?.[0]);
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-fallback", "candidateYears.1", 2027, fallbackLookup?.lookup?.candidateYears?.[1]);
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-fallback", "size", 2, stats.size);
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-fallback", "misses", 2, stats.misses);
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-fallback", "has.2028", true, stats.keys.includes("year=2028|startTerm=大雪|before=0|after=15"));
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-fallback", "has.2027", true, stats.keys.includes("year=2027|startTerm=大雪|before=0|after=15"));

  const fullRange = buildQimenMultiYearFullTermCycleTimelineDraft({
    startYear: 1899,
    endYear: 2101,
  });
  const duplicateGroups = getDuplicateTimelineGroupsFromYearDrafts(fullRange.yearDrafts);
  let boundaryAfterCachedMismatchCount = 0;
  let boundaryBeforeCachedMismatchCount = 0;

  clearQimenFullTermCycleTimelineDraftCache();
  for (const [index, group] of duplicateGroups.entries()) {
    const queryAfter = group.start.replace("T23:00:00+08:00", "T23:30:00+08:00");
    const queryBefore = group.start.replace("T23:00:00+08:00", "T22:30:00+08:00");
    const nonCachedAfter = findQimenFullTermCycleTimelineDraftEntry(queryAfter);
    const cachedAfter = findQimenFullTermCycleTimelineDraftEntryCached(queryAfter);
    const nonCachedBefore = findQimenFullTermCycleTimelineDraftEntry(queryBefore);
    const cachedBefore = findQimenFullTermCycleTimelineDraftEntryCached(queryBefore);
    const afterEquivalent = areQimenDraftLookupEntriesEquivalent(nonCachedAfter, cachedAfter);
    const beforeEquivalent = areQimenDraftLookupEntriesEquivalent(nonCachedBefore, cachedBefore);

    if (!afterEquivalent) {
      boundaryAfterCachedMismatchCount += 1;
    }
    if (!beforeEquivalent) {
      boundaryBeforeCachedMismatchCount += 1;
    }

    assertQimenDraftLookupEquivalent(
      `qimen-full-term-cycle-draft-cached-lookup-duplicate-boundary-after-${index + 1}`,
      nonCachedAfter,
      cachedAfter
    );
    assertQimenDraftLookupEquivalent(
      `qimen-full-term-cycle-draft-cached-lookup-duplicate-boundary-before-${index + 1}`,
      nonCachedBefore,
      cachedBefore
    );
  }

  qimenFullTermCycleTimelineDraftCachedLookupVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-duplicate-boundary", "duplicateGroups.length", 69, duplicateGroups.length);
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-duplicate-boundary", "boundaryAfterCachedMismatchCount", 0, boundaryAfterCachedMismatchCount);
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-duplicate-boundary", "boundaryBeforeCachedMismatchCount", 0, boundaryBeforeCachedMismatchCount);

  clearQimenFullTermCycleTimelineDraftCache();
  const defaultOptionsLookup = findQimenFullTermCycleTimelineDraftEntryCached("2027-12-26T12:00:00+08:00");
  const explicitDefaultOptionsLookup = findQimenFullTermCycleTimelineDraftEntryCached("2027-12-26T12:00:00+08:00", {
    startTerm: "大雪",
    beforeStartEffectiveDays: 0,
    afterEndEffectiveDays: 15,
  });
  stats = getQimenFullTermCycleTimelineDraftCacheStats();
  qimenFullTermCycleTimelineDraftCachedLookupVerifiedCaseCount += 1;
  assertQimenDraftLookupEquivalent(
    "qimen-full-term-cycle-draft-cached-lookup-options-normalization-equivalence",
    defaultOptionsLookup,
    explicitDefaultOptionsLookup
  );
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-options-normalization", "size", 1, stats.size);
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-options-normalization", "hits.atLeast1", true, stats.hits >= 1);
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-options-normalization", "key", "year=2027|startTerm=大雪|before=0|after=15", stats.keys[0]);

  clearQimenFullTermCycleTimelineDraftCache();
  qimenFullTermCycleTimelineDraftCachedLookupVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-draft-cached-lookup-invalid-strategy", () => {
    findQimenFullTermCycleTimelineDraftEntryCached("2027-12-26T12:00:00+08:00", {
      strategy: "unknown",
    });
  });
  stats = getQimenFullTermCycleTimelineDraftCacheStats();
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-invalid-strategy", "size", 0, stats.size);

  clearQimenFullTermCycleTimelineDraftCache();
  qimenFullTermCycleTimelineDraftCachedLookupVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-draft-cached-lookup-missing-data", () => {
    findQimenFullTermCycleTimelineDraftEntryCached("1800-01-01T12:00:00+08:00");
  });
  stats = getQimenFullTermCycleTimelineDraftCacheStats();
  assertEqual("qimen-full-term-cycle-draft-cached-lookup-missing-data", "size", 0, stats.size);
}

function runQimenFullTermCycleDraftCachedResolverFormatterTests() {
  const representativeCases = [
    "1910-11-24T23:30:00+08:00",
    "1910-11-24T22:30:00+08:00",
    "1910-11-25T12:00:00+08:00",
    "2027-06-06T12:00:00+08:00",
    "2027-06-14T12:00:00+08:00",
    "2027-12-11T12:00:00+08:00",
    "2027-12-22T12:00:00+08:00",
    "2027-12-26T12:00:00+08:00",
    "2028-01-01T12:00:00+08:00",
    "2030-12-10T12:00:00+08:00",
    "2030-12-25T12:00:00+08:00",
  ];

  clearQimenFullTermCycleTimelineDraftCache();
  for (const input of representativeCases) {
    const nonCached = resolveQimenJuFromFullTermCycleDraft(input);
    const cached = resolveQimenJuFromFullTermCycleDraftCached(input);
    qimenFullTermCycleDraftCachedResolverFormatterVerifiedCaseCount += 1;
    assertQimenDraftResolverFormatterEquivalent(
      `qimen-full-term-cycle-draft-cached-resolver-formatter-representative-${input}`,
      nonCached,
      cached
    );
  }

  clearQimenFullTermCycleTimelineDraftCache();
  const cachedDaxueUpper = resolveQimenJuFromFullTermCycleDraftCached("2027-12-11T12:00:00+08:00");
  const cachedDaxueMiddle = resolveQimenJuFromFullTermCycleDraftCached("2027-12-16T12:00:00+08:00");
  const cachedDongzhiUpper = resolveQimenJuFromFullTermCycleDraftCached("2027-12-26T12:00:00+08:00");
  let stats = getQimenFullTermCycleTimelineDraftCacheStats();
  qimenFullTermCycleDraftCachedResolverFormatterVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-stats-2027", "selectedYear.1", 2027, cachedDaxueUpper?.lookup?.selectedYear);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-stats-2027", "selectedYear.2", 2027, cachedDaxueMiddle?.lookup?.selectedYear);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-stats-2027", "selectedYear.3", 2027, cachedDongzhiUpper?.lookup?.selectedYear);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-stats-2027", "size", 1, stats.size);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-stats-2027", "misses", 1, stats.misses);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-stats-2027", "hits.atLeast2", true, stats.hits >= 2);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-stats-2027", "has.key", true, stats.keys.includes("year=2027|startTerm=大雪|before=0|after=15"));

  clearQimenFullTermCycleTimelineDraftCache();
  const fallbackFormatter = resolveQimenJuFromFullTermCycleDraftCached("2028-01-01T12:00:00+08:00");
  stats = getQimenFullTermCycleTimelineDraftCacheStats();
  qimenFullTermCycleDraftCachedResolverFormatterVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-fallback", "selectedYear", 2027, fallbackFormatter?.lookup?.selectedYear);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-fallback", "candidateYears.length", 2, fallbackFormatter?.lookup?.candidateYears?.length);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-fallback", "candidateYears.0", 2028, fallbackFormatter?.lookup?.candidateYears?.[0]);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-fallback", "candidateYears.1", 2027, fallbackFormatter?.lookup?.candidateYears?.[1]);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-fallback", "size", 2, stats.size);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-fallback", "misses", 2, stats.misses);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-fallback", "has.2028", true, stats.keys.includes("year=2028|startTerm=大雪|before=0|after=15"));
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-fallback", "has.2027", true, stats.keys.includes("year=2027|startTerm=大雪|before=0|after=15"));

  clearQimenFullTermCycleTimelineDraftCache();
  const nonCachedIntercalary = resolveQimenJuFromFullTermCycleDraft("2027-12-11T12:00:00+08:00");
  const cachedIntercalary = resolveQimenJuFromFullTermCycleDraftCached("2027-12-11T12:00:00+08:00");
  const nonCachedNormal = resolveQimenJuFromFullTermCycleDraft("2027-12-26T12:00:00+08:00");
  const cachedNormal = resolveQimenJuFromFullTermCycleDraftCached("2027-12-26T12:00:00+08:00");
  qimenFullTermCycleDraftCachedResolverFormatterVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-notes-intercalary", "notes.length", nonCachedIntercalary.notes.length, cachedIntercalary.notes.length);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-notes-intercalary", "notes.nonEmpty", true, cachedIntercalary.notes.length > 0);
  for (const [index, expectedNote] of nonCachedIntercalary.notes.entries()) {
    assertEqual(`qimen-full-term-cycle-draft-cached-resolver-formatter-notes-intercalary-${index + 1}`, "note", expectedNote, cachedIntercalary.notes[index]);
  }
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-notes-normal", "notes.length", nonCachedNormal.notes.length, cachedNormal.notes.length);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-notes-normal", "notes.empty", 0, cachedNormal.notes.length);

  clearQimenFullTermCycleTimelineDraftCache();
  qimenFullTermCycleDraftCachedResolverFormatterVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-draft-cached-resolver-formatter-invalid-strategy", () => {
    resolveQimenJuFromFullTermCycleDraftCached("2027-12-26T12:00:00+08:00", {
      strategy: "unknown",
    });
  });
  stats = getQimenFullTermCycleTimelineDraftCacheStats();
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-invalid-strategy", "size", 0, stats.size);

  clearQimenFullTermCycleTimelineDraftCache();
  qimenFullTermCycleDraftCachedResolverFormatterVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-full-term-cycle-draft-cached-resolver-formatter-missing-data", () => {
    resolveQimenJuFromFullTermCycleDraftCached("1800-01-01T12:00:00+08:00");
  });
  stats = getQimenFullTermCycleTimelineDraftCacheStats();
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-missing-data", "size", 0, stats.size);
}

function runQimenFullTermCycleDraftCachedResolverFormatterRegressionTests() {
  const regressionCases = [
    {
      id: "qimen-full-term-cycle-draft-cached-resolver-formatter-regression-2024-intercalary-daxue",
      input: "2024-12-11T12:00:00+08:00",
      expected: {
        selectedYear: 2024,
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: true,
        dunType: "yin",
        dunName: "陰遁",
        ju: 4,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-cached-resolver-formatter-regression-2024-dongzhi",
      input: "2024-12-26T12:00:00+08:00",
      expected: {
        selectedYear: 2024,
        qimenSolarTerm: "冬至",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yang",
        dunName: "陽遁",
        ju: 1,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-cached-resolver-formatter-regression-2025-daxue",
      input: "2025-12-06T12:00:00+08:00",
      expected: {
        selectedYear: 2025,
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yin",
        dunName: "陰遁",
        ju: 4,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-cached-resolver-formatter-regression-2025-dongzhi",
      input: "2025-12-21T12:00:00+08:00",
      expected: {
        selectedYear: 2025,
        qimenSolarTerm: "冬至",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yang",
        dunName: "陽遁",
        ju: 1,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-cached-resolver-formatter-regression-2026-daxue",
      input: "2026-12-01T12:00:00+08:00",
      expected: {
        selectedYear: 2026,
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yin",
        dunName: "陰遁",
        ju: 4,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-cached-resolver-formatter-regression-2026-dongzhi",
      input: "2026-12-16T12:00:00+08:00",
      expected: {
        selectedYear: 2026,
        qimenSolarTerm: "冬至",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yang",
        dunName: "陽遁",
        ju: 1,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-cached-resolver-formatter-regression-2027-intercalary-daxue",
      input: "2027-12-11T12:00:00+08:00",
      expected: {
        selectedYear: 2027,
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: true,
        dunType: "yin",
        dunName: "陰遁",
        ju: 4,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-cached-resolver-formatter-regression-2027-dongzhi",
      input: "2027-12-26T12:00:00+08:00",
      expected: {
        selectedYear: 2027,
        qimenSolarTerm: "冬至",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yang",
        dunName: "陽遁",
        ju: 1,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-cached-resolver-formatter-regression-2028-fallback-dongzhi",
      input: "2028-01-01T12:00:00+08:00",
      expected: {
        selectedYear: 2027,
        qimenSolarTerm: "冬至",
        yuan: "中元",
        isIntercalary: false,
        dunType: "yang",
        dunName: "陽遁",
        ju: 7,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-cached-resolver-formatter-regression-2028-daxue",
      input: "2028-12-05T12:00:00+08:00",
      expected: {
        selectedYear: 2028,
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yin",
        dunName: "陰遁",
        ju: 4,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-cached-resolver-formatter-regression-2029-daxue",
      input: "2029-11-30T12:00:00+08:00",
      expected: {
        selectedYear: 2029,
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yin",
        dunName: "陰遁",
        ju: 4,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-cached-resolver-formatter-regression-2029-dongzhi",
      input: "2029-12-15T12:00:00+08:00",
      expected: {
        selectedYear: 2029,
        qimenSolarTerm: "冬至",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yang",
        dunName: "陽遁",
        ju: 1,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-cached-resolver-formatter-regression-2030-intercalary-daxue",
      input: "2030-12-10T12:00:00+08:00",
      expected: {
        selectedYear: 2030,
        qimenSolarTerm: "大雪",
        yuan: "上元",
        isIntercalary: true,
        dunType: "yin",
        dunName: "陰遁",
        ju: 4,
      },
    },
    {
      id: "qimen-full-term-cycle-draft-cached-resolver-formatter-regression-2030-dongzhi",
      input: "2030-12-25T12:00:00+08:00",
      expected: {
        selectedYear: 2030,
        qimenSolarTerm: "冬至",
        yuan: "上元",
        isIntercalary: false,
        dunType: "yang",
        dunName: "陽遁",
        ju: 1,
      },
    },
  ];
  let intercalaryCaseCount = 0;
  let nonIntercalaryCaseCount = 0;
  let selectedYearFallbackCount = 0;
  let selectedYearSameAsCivilYearCount = 0;

  clearQimenFullTermCycleTimelineDraftCache();
  for (const testCase of regressionCases) {
    const nonCached = resolveQimenJuFromFullTermCycleDraft(testCase.input);
    const cached = resolveQimenJuFromFullTermCycleDraftCached(testCase.input);
    const civilYear = Number(testCase.input.slice(0, 4));
    qimenFullTermCycleDraftCachedResolverFormatterRegressionVerifiedCaseCount += 1;

    assertQimenDraftResolverFormatterEquivalent(testCase.id, nonCached, cached);
    assertEqual(testCase.id, "qimenSolarTerm", testCase.expected.qimenSolarTerm, cached.qimenSolarTerm);
    assertEqual(testCase.id, "yuan", testCase.expected.yuan, cached.yuan);
    assertEqual(testCase.id, "isIntercalary", testCase.expected.isIntercalary, cached.isIntercalary);
    assertEqual(testCase.id, "dunType", testCase.expected.dunType, cached.dunType);
    assertEqual(testCase.id, "dunName", testCase.expected.dunName, cached.dunName);
    assertEqual(testCase.id, "ju", testCase.expected.ju, cached.ju);
    assertEqual(testCase.id, "lookup.selectedYear", testCase.expected.selectedYear, cached.lookup?.selectedYear);
    assertEqual(testCase.id, "lookup.strategy", "cycle-year", cached.lookup?.strategy);
    assertEqual(testCase.id, "lookup.candidateYears.isArray", true, Array.isArray(cached.lookup?.candidateYears));
    assertEqual(testCase.id, "lookup.candidateYears.nonEmpty", true, cached.lookup?.candidateYears?.length > 0);
    assertEqual(testCase.id, "lookup.queryEffectiveDayStart.isString", true, typeof cached.lookup?.queryEffectiveDayStart === "string" && cached.lookup.queryEffectiveDayStart.length > 0);
    assertEqual(testCase.id, "actualSolarTerm.isString", true, typeof cached.actualSolarTerm === "string" && cached.actualSolarTerm.length > 0);
    assertEqual(testCase.id, "hourPillar.isString", true, typeof cached.hourPillar === "string");
    assertEqual(testCase.id, "hourPillar.length", 2, cached.hourPillar?.length);
    assertEqual(testCase.id, "status.isString", true, typeof cached.status === "string" && cached.status.length > 0);
    assertEqual(testCase.id, "notes.isArray", true, Array.isArray(cached.notes));

    if (cached.isIntercalary) {
      intercalaryCaseCount += 1;
    } else {
      nonIntercalaryCaseCount += 1;
    }

    if (cached.lookup?.selectedYear === civilYear) {
      selectedYearSameAsCivilYearCount += 1;
    } else {
      selectedYearFallbackCount += 1;
    }
  }

  qimenFullTermCycleDraftCachedResolverFormatterRegressionVerifiedCaseCount += 1;
  const stats = getQimenFullTermCycleTimelineDraftCacheStats();
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-regression-stats", "normalCaseCount", 14, regressionCases.length);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-regression-stats", "intercalaryCaseCount", 3, intercalaryCaseCount);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-regression-stats", "nonIntercalaryCaseCount", 11, nonIntercalaryCaseCount);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-regression-stats", "selectedYearFallbackCount", 1, selectedYearFallbackCount);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-regression-stats", "selectedYearSameAsCivilYearCount", 13, selectedYearSameAsCivilYearCount);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-regression-cache-stats", "size.positive", true, stats.size > 0);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-regression-cache-stats", "misses.positive", true, stats.misses > 0);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-regression-cache-stats", "hits.positive", true, stats.hits > 0);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-regression-cache-stats", "has.2024", true, stats.keys.includes("year=2024|startTerm=大雪|before=0|after=15"));
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-regression-cache-stats", "has.2027", true, stats.keys.includes("year=2027|startTerm=大雪|before=0|after=15"));
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-regression-cache-stats", "has.2030", true, stats.keys.includes("year=2030|startTerm=大雪|before=0|after=15"));
}

function runQimenFullTermCycleDraftCachedResolverFormatterDuplicateBoundaryTests() {
  const fullRange = buildQimenMultiYearFullTermCycleTimelineDraft({
    startYear: 1899,
    endYear: 2101,
  });
  const duplicateGroups = getDuplicateTimelineGroupsFromYearDrafts(fullRange.yearDrafts);
  const sortedDuplicateGroups = duplicateGroups.map((group) => ({
    start: group.start,
    entries: [...group.entries].sort((a, b) => a.year - b.year),
  }));
  let boundaryAfterCachedMismatchCount = 0;
  let boundaryBeforeCachedMismatchCount = 0;
  let boundaryAfterSelectedCurrentYearCount = 0;
  let boundaryBeforeSelectedPreviousYearCount = 0;
  let boundaryBeforeSelectedCurrentYearCount = 0;
  let boundaryBeforeOtherSelectedYearCount = 0;

  qimenFullTermCycleDraftCachedResolverFormatterDuplicateBoundaryVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary", "duplicateGroups.length", 69, sortedDuplicateGroups.length);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary", "first.start", "1910-11-24T23:00:00+08:00", sortedDuplicateGroups[0]?.start);

  clearQimenFullTermCycleTimelineDraftCache();
  for (const [index, group] of sortedDuplicateGroups.entries()) {
    const previousYearEntry = group.entries[0];
    const currentYearEntry = group.entries[1];
    const queryAfter = group.start.replace("T23:00:00+08:00", "T23:30:00+08:00");
    const queryBefore = group.start.replace("T23:00:00+08:00", "T22:30:00+08:00");
    const nonCachedAfter = resolveQimenJuFromFullTermCycleDraft(queryAfter);
    const cachedAfter = resolveQimenJuFromFullTermCycleDraftCached(queryAfter);
    const nonCachedBefore = resolveQimenJuFromFullTermCycleDraft(queryBefore);
    const cachedBefore = resolveQimenJuFromFullTermCycleDraftCached(queryBefore);

    assertEqual(`qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-group-${index + 1}`, "entries.length", 2, group.entries.length);
    assertEqual(
      `qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-group-${index + 1}`,
      "adjacentYears",
      1,
      currentYearEntry.year - previousYearEntry.year
    );

    if (!areQimenDraftResolverFormatterResultsEquivalent(nonCachedAfter, cachedAfter)) {
      boundaryAfterCachedMismatchCount += 1;
    }
    if (!areQimenDraftResolverFormatterResultsEquivalent(nonCachedBefore, cachedBefore)) {
      boundaryBeforeCachedMismatchCount += 1;
    }

    assertQimenDraftResolverFormatterEquivalent(
      `qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-after-${index + 1}`,
      nonCachedAfter,
      cachedAfter
    );
    assertQimenDraftResolverFormatterEquivalent(
      `qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-before-${index + 1}`,
      nonCachedBefore,
      cachedBefore
    );

    if (cachedAfter?.lookup?.selectedYear === currentYearEntry.year) {
      boundaryAfterSelectedCurrentYearCount += 1;
    }

    if (cachedBefore?.lookup?.selectedYear === previousYearEntry.year) {
      boundaryBeforeSelectedPreviousYearCount += 1;
    } else if (cachedBefore?.lookup?.selectedYear === currentYearEntry.year) {
      boundaryBeforeSelectedCurrentYearCount += 1;
    } else {
      boundaryBeforeOtherSelectedYearCount += 1;
    }
  }

  qimenFullTermCycleDraftCachedResolverFormatterDuplicateBoundaryVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-equivalence", "boundaryAfterCachedMismatchCount", 0, boundaryAfterCachedMismatchCount);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-equivalence", "boundaryBeforeCachedMismatchCount", 0, boundaryBeforeCachedMismatchCount);

  qimenFullTermCycleDraftCachedResolverFormatterDuplicateBoundaryVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-selected-year", "boundaryAfterSelectedCurrentYearCount", 69, boundaryAfterSelectedCurrentYearCount);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-selected-year", "boundaryBeforeSelectedPreviousYearCount", 23, boundaryBeforeSelectedPreviousYearCount);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-selected-year", "boundaryBeforeSelectedCurrentYearCount", 46, boundaryBeforeSelectedCurrentYearCount);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-selected-year", "boundaryBeforeOtherSelectedYearCount", 0, boundaryBeforeOtherSelectedYearCount);

  const firstBoundaryAfter = resolveQimenJuFromFullTermCycleDraftCached("1910-11-24T23:30:00+08:00");
  const firstBoundaryBefore = resolveQimenJuFromFullTermCycleDraftCached("1910-11-24T22:30:00+08:00");
  qimenFullTermCycleDraftCachedResolverFormatterDuplicateBoundaryVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-1910-after", "selectedYear", 1910, firstBoundaryAfter?.lookup?.selectedYear);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-1910-after", "qimenSolarTerm", "大雪", firstBoundaryAfter?.qimenSolarTerm);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-1910-after", "yuan", "上元", firstBoundaryAfter?.yuan);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-1910-after", "isIntercalary", false, firstBoundaryAfter?.isIntercalary);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-1910-after", "dunName", "陰遁", firstBoundaryAfter?.dunName);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-1910-after", "ju", 4, firstBoundaryAfter?.ju);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-1910-before", "selectedYear", 1909, firstBoundaryBefore?.lookup?.selectedYear);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-1910-before", "qimenSolarTerm", "立冬", firstBoundaryBefore?.qimenSolarTerm);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-1910-before", "yuan", "下元", firstBoundaryBefore?.yuan);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-1910-before", "isIntercalary", false, firstBoundaryBefore?.isIntercalary);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-1910-before", "dunName", "陰遁", firstBoundaryBefore?.dunName);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-1910-before", "ju", 3, firstBoundaryBefore?.ju);

  const stats = getQimenFullTermCycleTimelineDraftCacheStats();
  qimenFullTermCycleDraftCachedResolverFormatterDuplicateBoundaryVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-cache-stats", "size.positive", true, stats.size > 0);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-cache-stats", "misses.positive", true, stats.misses > 0);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-cache-stats", "hits.positive", true, stats.hits > 0);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-cache-stats", "has.1909", true, stats.keys.includes("year=1909|startTerm=大雪|before=0|after=15"));
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-duplicate-boundary-cache-stats", "has.1910", true, stats.keys.includes("year=1910|startTerm=大雪|before=0|after=15"));
}

function runQimenFullTermCycleDraftCachedResolverFormatterFullRangeDiagnosticsTests() {
  const fullRange = buildQimenMultiYearFullTermCycleTimelineDraft({
    startYear: 1899,
    endYear: 2101,
  });
  const lookupOptions = { startYear: 1899, endYear: 2101 };
  const yearDraftEntryByYearAndStart = new Map(
    fullRange.yearDrafts.map((draft) => {
      return [
        draft.year,
        new Map(draft.timeline.map((entry) => [entry.start, entry])),
      ];
    })
  );
  let queryCount = 0;
  let intercalaryResultCount = 0;
  let nonIntercalaryResultCount = 0;
  let yinCount = 0;
  let yangCount = 0;
  let selectedYearSameAsCivilYearCount = 0;
  let selectedYearFallbackCount = 0;
  const juCounts = new Map();

  qimenFullTermCycleDraftCachedResolverFormatterFullRangeDiagnosticsVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-sanity", "yearDrafts.length", 203, fullRange.yearDrafts.length);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-sanity", "entryCountBeforeDedupe", 14898, fullRange.diagnostics?.entryCountBeforeDedupe);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-sanity", "entryCountAfterDedupe", 14829, fullRange.diagnostics?.entryCountAfterDedupe);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-sanity", "duplicateStarts.length", 69, fullRange.diagnostics?.duplicateStarts?.length);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-sanity", "gaps.length", 0, fullRange.diagnostics?.gaps?.length);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-sanity", "overlaps.length", 0, fullRange.diagnostics?.overlaps?.length);

  clearQimenFullTermCycleTimelineDraftCache();
  for (const [index, entry] of fullRange.timeline.entries()) {
    const id = `qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-entry-${index + 1}`;
    assertEqual(id, "start.hasExpectedTime", true, entry.start.includes("T23:00:00+08:00"));
    const query = entry.start.replace("T23:00:00+08:00", "T23:30:00+08:00");
    const cached = resolveQimenJuFromFullTermCycleDraftCached(query, lookupOptions);
    const selectedYearEntry = yearDraftEntryByYearAndStart
      .get(cached.lookup?.selectedYear)
      ?.get(entry.start);
    const expectedEntry = selectedYearEntry ?? entry;
    queryCount += 1;

    assertEqual(id, "qimenSolarTerm", expectedEntry.qimenSolarTerm, cached.qimenSolarTerm);
    assertEqual(id, "yuan", expectedEntry.yuan, cached.yuan);
    assertEqual(id, "isIntercalary", expectedEntry.isIntercalary, cached.isIntercalary);
    assertEqual(id, "lookup.strategy", "cycle-year", cached.lookup?.strategy);
    assertEqual(id, "lookup.queryEffectiveDayStart", entry.start, cached.lookup?.queryEffectiveDayStart);
    assertEqual(id, "lookup.selectedYear.isInteger", true, Number.isInteger(cached.lookup?.selectedYear));
    assertEqual(id, "lookup.candidateYears.isArray", true, Array.isArray(cached.lookup?.candidateYears));
    assertEqual(id, "lookup.candidateYears.nonEmpty", true, cached.lookup?.candidateYears?.length > 0);
    assertEqual(id, "actualSolarTerm.isString", true, typeof cached.actualSolarTerm === "string" && cached.actualSolarTerm.length > 0);
    assertEqual(id, "status.isString", true, typeof cached.status === "string" && cached.status.length > 0);
    assertEqual(id, "hourPillar.isString", true, typeof cached.hourPillar === "string");
    assertEqual(id, "hourPillar.length", 2, cached.hourPillar?.length);
    assertEqual(id, "dunType.isKnown", true, ["yin", "yang"].includes(cached.dunType));
    assertEqual(id, "dunName.isKnown", true, ["陰遁", "陽遁"].includes(cached.dunName));
    assertEqual(id, "ju.isInteger", true, Number.isInteger(cached.ju));
    assertEqual(id, "ju.inRange", true, cached.ju >= 1 && cached.ju <= 9);
    assertEqual(id, "notes.isArray", true, Array.isArray(cached.notes));
    assertEqual(id, "notes.length", expectedEntry.isIntercalary ? true : 0, expectedEntry.isIntercalary ? cached.notes.length > 0 : cached.notes.length);

    if (cached.isIntercalary) {
      intercalaryResultCount += 1;
    } else {
      nonIntercalaryResultCount += 1;
    }
    if (cached.dunType === "yin") {
      yinCount += 1;
    } else if (cached.dunType === "yang") {
      yangCount += 1;
    }
    juCounts.set(cached.ju, (juCounts.get(cached.ju) ?? 0) + 1);

    const civilYear = Number(query.slice(0, 4));
    if (cached.lookup?.selectedYear === civilYear) {
      selectedYearSameAsCivilYearCount += 1;
    } else {
      selectedYearFallbackCount += 1;
    }
  }

  qimenFullTermCycleDraftCachedResolverFormatterFullRangeDiagnosticsVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-coverage", "queryCount", fullRange.timeline.length, queryCount);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-coverage", "queryCount.fixed", 14829, queryCount);

  qimenFullTermCycleDraftCachedResolverFormatterFullRangeDiagnosticsVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-intercalary", "intercalaryResultCount", 282, intercalaryResultCount);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-intercalary", "nonIntercalaryResultCount", queryCount - 282, nonIntercalaryResultCount);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-intercalary", "nonIntercalaryResultCount.fixed", 14547, nonIntercalaryResultCount);

  qimenFullTermCycleDraftCachedResolverFormatterFullRangeDiagnosticsVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-dun-type", "yinCount.positive", true, yinCount > 0);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-dun-type", "yangCount.positive", true, yangCount > 0);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-dun-type", "total", queryCount, yinCount + yangCount);

  qimenFullTermCycleDraftCachedResolverFormatterFullRangeDiagnosticsVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-ju", "juCounts.size", 9, juCounts.size);
  let juTotal = 0;
  for (let ju = 1; ju <= 9; ju += 1) {
    const count = juCounts.get(ju) ?? 0;
    juTotal += count;
    assertEqual(`qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-ju-${ju}`, "count.positive", true, count > 0);
  }
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-ju", "total", queryCount, juTotal);

  qimenFullTermCycleDraftCachedResolverFormatterFullRangeDiagnosticsVerifiedCaseCount += 1;
  assertEqual(
    "qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-selected-year",
    "total",
    queryCount,
    selectedYearSameAsCivilYearCount + selectedYearFallbackCount
  );
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-selected-year", "fallback.positive", true, selectedYearFallbackCount > 0);

  qimenFullTermCycleDraftCachedResolverFormatterFullRangeDiagnosticsVerifiedCaseCount += 1;
  const stats = getQimenFullTermCycleTimelineDraftCacheStats();
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-cache-stats", "size.positive", true, stats.size > 0);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-cache-stats", "misses.positive", true, stats.misses > 0);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-cache-stats", "hits.positive", true, stats.hits > 0);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-cache-stats", "keys.length", stats.size, stats.keys.length);
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-cache-stats", "has.1899", true, stats.keys.includes("year=1899|startTerm=大雪|before=0|after=15"));
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-cache-stats", "has.1900", true, stats.keys.includes("year=1900|startTerm=大雪|before=0|after=15"));
  assertEqual("qimen-full-term-cycle-draft-cached-resolver-formatter-full-range-cache-stats", "has.2101", true, stats.keys.includes("year=2101|startTerm=大雪|before=0|after=15"));
}

function runQimenFullTermCycleDraftResolverFormatterCacheReplacementTests() {
  clearQimenFullTermCycleTimelineDraftCache();
  const first = resolveQimenJuFromFullTermCycleDraft("2027-12-11T12:00:00+08:00");
  const afterFirstStats = getQimenFullTermCycleTimelineDraftCacheStats();
  const second = resolveQimenJuFromFullTermCycleDraft("2027-12-16T12:00:00+08:00");
  const afterSecondStats = getQimenFullTermCycleTimelineDraftCacheStats();
  qimenFullTermCycleDraftResolverFormatterCacheReplacementVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-cache-replacement-smoke", "first.lookup.selectedYear", 2027, first.lookup?.selectedYear);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-cache-replacement-smoke", "second.lookup.selectedYear", 2027, second.lookup?.selectedYear);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-cache-replacement-smoke", "afterFirstStats.size.positive", true, afterFirstStats.size > 0);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-cache-replacement-smoke", "afterFirstStats.misses.positive", true, afterFirstStats.misses > 0);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-cache-replacement-smoke", "afterSecondStats.hits.increased", true, afterSecondStats.hits > afterFirstStats.hits);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-cache-replacement-smoke", "has.2027", true, afterSecondStats.keys.includes("year=2027|startTerm=大雪|before=0|after=15"));

  const equivalenceCases = [
    "1910-11-24T23:30:00+08:00",
    "1910-11-24T22:30:00+08:00",
    "2027-06-06T12:00:00+08:00",
    "2027-12-11T12:00:00+08:00",
    "2027-12-26T12:00:00+08:00",
    "2028-01-01T12:00:00+08:00",
    "2030-12-10T12:00:00+08:00",
    "2030-12-25T12:00:00+08:00",
  ];

  clearQimenFullTermCycleTimelineDraftCache();
  for (const input of equivalenceCases) {
    const formal = resolveQimenJuFromFullTermCycleDraft(input);
    const cached = resolveQimenJuFromFullTermCycleDraftCached(input);
    qimenFullTermCycleDraftResolverFormatterCacheReplacementVerifiedCaseCount += 1;
    assertQimenDraftResolverFormatterEquivalent(
      `qimen-full-term-cycle-draft-resolver-formatter-cache-replacement-alias-${input}`,
      formal,
      cached
    );
  }

  const nonCachedLookup = findQimenFullTermCycleTimelineDraftEntry("2027-12-26T12:00:00+08:00");
  const cachedLookup = findQimenFullTermCycleTimelineDraftEntryCached("2027-12-26T12:00:00+08:00");
  qimenFullTermCycleDraftResolverFormatterCacheReplacementVerifiedCaseCount += 1;
  assertQimenDraftLookupEquivalent(
    "qimen-full-term-cycle-draft-resolver-formatter-cache-replacement-lookup-baseline",
    nonCachedLookup,
    cachedLookup
  );

  clearQimenFullTermCycleTimelineDraftCache();
  findQimenFullTermCycleTimelineDraftEntry("2027-12-26T12:00:00+08:00");
  const nonCachedLookupStats = getQimenFullTermCycleTimelineDraftCacheStats();
  qimenFullTermCycleDraftResolverFormatterCacheReplacementVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-cache-replacement-lookup-no-pollution", "size", 0, nonCachedLookupStats.size);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-cache-replacement-lookup-no-pollution", "hits", 0, nonCachedLookupStats.hits);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-cache-replacement-lookup-no-pollution", "misses", 0, nonCachedLookupStats.misses);

  const initialResolver = resolveQimenJu("2027-12-26T12:00:00+08:00");
  qimenFullTermCycleDraftResolverFormatterCacheReplacementVerifiedCaseCount += 1;
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-cache-replacement-initial-resolver", "qimenSolarTerm", "冬至", initialResolver.qimenSolarTerm);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-cache-replacement-initial-resolver", "yuan", "上元", initialResolver.yuan);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-cache-replacement-initial-resolver", "dunName", "陽遁", initialResolver.dunName);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-cache-replacement-initial-resolver", "ju", 1, initialResolver.ju);
  assertEqual("qimen-full-term-cycle-draft-resolver-formatter-cache-replacement-initial-resolver", "isIntercalary", false, initialResolver.isIntercalary);
}

function runQimenPlateLookupTests() {
  const invalidInputMessage = "奇門盤面查詢參數不完整，暫時無法顯示盤面。";

  const yangJu1Jiazi = getQimenPlate({
    dunType: "yang",
    ju: 1,
    hourPillar: "甲子",
  });
  qimenPlateLookupVerifiedCaseCount += 1;
  assertFoundQimenPlate("qimen-plate-lookup-yang-ju-1-jiazi", yangJu1Jiazi, {
    dunType: "yang",
    dunName: "陽遁",
    ju: 1,
    hourPillar: "甲子",
    filePath: "data/qimen/plates/yang/ju-1.json",
  });
  assertEqual("qimen-plate-lookup-yang-ju-1-jiazi", "meta.dunType", "yang", yangJu1Jiazi.meta?.dunType);
  assertEqual("qimen-plate-lookup-yang-ju-1-jiazi", "meta.dunName", "陽遁", yangJu1Jiazi.meta?.dunName);
  assertEqual("qimen-plate-lookup-yang-ju-1-jiazi", "meta.ju", 1, yangJu1Jiazi.meta?.ju);
  assertEqual("qimen-plate-lookup-yang-ju-1-jiazi", "meta.plateCount", 60, yangJu1Jiazi.meta?.plateCount);

  const yinJu9Guihai = getQimenPlate({
    dunType: "yin",
    ju: 9,
    hourPillar: "癸亥",
  });
  qimenPlateLookupVerifiedCaseCount += 1;
  assertFoundQimenPlate("qimen-plate-lookup-yin-ju-9-guihai", yinJu9Guihai, {
    dunType: "yin",
    dunName: "陰遁",
    ju: 9,
    hourPillar: "癸亥",
    filePath: "data/qimen/plates/yin/ju-9.json",
  });
  assertEqual("qimen-plate-lookup-yin-ju-9-guihai", "meta.dunType", "yin", yinJu9Guihai.meta?.dunType);
  assertEqual("qimen-plate-lookup-yin-ju-9-guihai", "meta.dunName", "陰遁", yinJu9Guihai.meta?.dunName);
  assertEqual("qimen-plate-lookup-yin-ju-9-guihai", "meta.ju", 9, yinJu9Guihai.meta?.ju);

  const invalidDunType = getQimenPlate({
    dunType: "invalid",
    ju: 1,
    hourPillar: "甲子",
  });
  qimenPlateLookupVerifiedCaseCount += 1;
  assertEqual("qimen-plate-lookup-invalid-dun-type", "found", false, invalidDunType.found);
  assertEqual("qimen-plate-lookup-invalid-dun-type", "status", "invalidInput", invalidDunType.status);
  assertEqual("qimen-plate-lookup-invalid-dun-type", "message", invalidInputMessage, invalidDunType.message);
  assertEqual("qimen-plate-lookup-invalid-dun-type", "meta", null, invalidDunType.meta);
  assertEqual("qimen-plate-lookup-invalid-dun-type", "plate", null, invalidDunType.plate);

  const invalidJu = getQimenPlate({
    dunType: "yang",
    ju: 10,
    hourPillar: "甲子",
  });
  qimenPlateLookupVerifiedCaseCount += 1;
  assertEqual("qimen-plate-lookup-invalid-ju", "found", false, invalidJu.found);
  assertEqual("qimen-plate-lookup-invalid-ju", "status", "invalidInput", invalidJu.status);
  assertEqual("qimen-plate-lookup-invalid-ju", "message", invalidInputMessage, invalidJu.message);

  const invalidHourPillar = getQimenPlate({
    dunType: "yang",
    ju: 1,
    hourPillar: "無效",
  });
  qimenPlateLookupVerifiedCaseCount += 1;
  assertEqual("qimen-plate-lookup-invalid-hour-pillar", "found", false, invalidHourPillar.found);
  assertEqual("qimen-plate-lookup-invalid-hour-pillar", "status", "invalidInput", invalidHourPillar.status);
  assertEqual("qimen-plate-lookup-invalid-hour-pillar", "message", invalidInputMessage, invalidHourPillar.message);

  const emptyInput = getQimenPlate(null);
  qimenPlateLookupVerifiedCaseCount += 1;
  assertEqual("qimen-plate-lookup-empty-input", "found", false, emptyInput.found);
  assertEqual("qimen-plate-lookup-empty-input", "status", "invalidInput", emptyInput.status);
  assertEqual("qimen-plate-lookup-empty-input", "message", invalidInputMessage, emptyInput.message);
  assertEqual("qimen-plate-lookup-empty-input", "meta", null, emptyInput.meta);
  assertEqual("qimen-plate-lookup-empty-input", "plate", null, emptyInput.plate);

  const firstLookup = getQimenPlate({ dunType: "yang", ju: 1, hourPillar: "甲子" });
  firstLookup.meta.dunType = "污染";
  firstLookup.plate.palaces.kan.star = "污染";
  const secondLookup = getQimenPlate({ dunType: "yang", ju: 1, hourPillar: "甲子" });
  qimenPlateLookupVerifiedCaseCount += 1;
  assertEqual("qimen-plate-lookup-clone-safety", "second.meta.dunType", "yang", secondLookup.meta?.dunType);
  assertEqual("qimen-plate-lookup-clone-safety", "second.meta.ju", 1, secondLookup.meta?.ju);
  assertEqual("qimen-plate-lookup-clone-safety", "second.plate.palaces.kan.star", "天蓬", secondLookup.plate?.palaces?.kan?.star);

  const qimen = resolveQimenJuFromFullTermCycleDraft("2027-12-26T12:00:00+08:00");
  const plate = getQimenPlate({
    dunType: qimen.dunType,
    ju: qimen.ju,
    hourPillar: qimen.hourPillar,
  });
  qimenPlateLookupVerifiedCaseCount += 1;
  assertEqual("qimen-plate-lookup-formatter-integration", "qimen.dunType", "yang", qimen.dunType);
  assertEqual("qimen-plate-lookup-formatter-integration", "qimen.ju", 1, qimen.ju);
  assertEqual("qimen-plate-lookup-formatter-integration", "qimen.hourPillar.string", true, typeof qimen.hourPillar === "string");
  assertEqual("qimen-plate-lookup-formatter-integration", "plate.status", "found", plate.status);
  assertEqual("qimen-plate-lookup-formatter-integration", "plate.found", true, plate.found);
  assertEqual("qimen-plate-lookup-formatter-integration", "plate.hourPillar", qimen.hourPillar, plate.plate?.hourPillar);

  qimenPlateLookupVerifiedCaseCount += 1;
  for (const dunType of ["yang", "yin"]) {
    for (let ju = 1; ju <= 9; ju += 1) {
      const actual = getQimenPlate({ dunType, ju, hourPillar: "甲子" });
      const id = `qimen-plate-lookup-18-file-smoke-${dunType}-ju-${ju}`;
      assertEqual(id, "found", true, actual.found);
      assertEqual(id, "status", "found", actual.status);
      assertEqual(id, "meta.dunType", dunType, actual.meta?.dunType);
      assertEqual(id, "meta.ju", ju, actual.meta?.ju);
      assertEqual(id, "lookup.filePath", `data/qimen/plates/${dunType}/ju-${ju}.json`, actual.lookup?.filePath);
      assertEqual(id, "plate.hourPillar", "甲子", actual.plate?.hourPillar);
    }
  }

  qimenPlateLookupVerifiedCaseCount += 1;
  for (const pillar of SEXAGENARY_CYCLE) {
    const actual = getQimenPlate({ dunType: "yang", ju: 1, hourPillar: pillar });
    assertEqual(`qimen-plate-lookup-60-hour-pillars-${pillar}`, "found", true, actual.found);
    assertEqual(`qimen-plate-lookup-60-hour-pillars-${pillar}`, "status", "found", actual.status);
    assertEqual(`qimen-plate-lookup-60-hour-pillars-${pillar}`, "lookup.hourPillar", pillar, actual.lookup?.hourPillar);
    assertEqual(`qimen-plate-lookup-60-hour-pillars-${pillar}`, "plate.hourPillar", pillar, actual.plate?.hourPillar);
  }
}

function assertFoundQimenPlate(id, actual, expected) {
  assertEqual(id, "found", true, actual.found);
  assertEqual(id, "status", "found", actual.status);
  assertEqual(id, "message", "", actual.message);
  assertEqual(id, "lookup.filePath", expected.filePath, actual.lookup?.filePath);
  assertEqual(id, "lookup.hourPillar", expected.hourPillar, actual.lookup?.hourPillar);
  assertEqual(id, "meta.dunType", expected.dunType, actual.meta?.dunType);
  assertEqual(id, "meta.dunName", expected.dunName, actual.meta?.dunName);
  assertEqual(id, "meta.ju", expected.ju, actual.meta?.ju);
  assertEqual(id, "plate.hourPillar", expected.hourPillar, actual.plate?.hourPillar);
  assertEqual(id, "plate.zhiFuStar.exists", true, typeof actual.plate?.zhiFuStar === "string" && actual.plate.zhiFuStar.length > 0);
  assertEqual(id, "plate.zhiShiDoor.exists", true, typeof actual.plate?.zhiShiDoor === "string" && actual.plate.zhiShiDoor.length > 0);
  assertEqual(id, "plate.palaces.center.exists", true, Boolean(actual.plate?.palaces?.center));
  assertEqual(id, "plate.palaces.center.star", "天禽", actual.plate?.palaces?.center?.star);
}

function runQimenPlateMarkersTests() {
  qimenPlateMarkersVerifiedCaseCount += 1;
  assertEqual("qimen-plate-markers-heaven-stem-kan-bing", "marker", "制", getQimenHeavenStemMarker("kan", "丙"));
  assertEqual("qimen-plate-markers-heaven-stem-kan-ding", "marker", "制", getQimenHeavenStemMarker("kan", "丁"));
  assertEqual("qimen-plate-markers-heaven-stem-gen-geng", "marker", "刑", getQimenHeavenStemMarker("gen", "庚"));
  assertEqual("qimen-plate-markers-heaven-stem-qian-bing", "marker", "墓", getQimenHeavenStemMarker("qian", "丙"));
  assertEqual("qimen-plate-markers-heaven-stem-xun-gui", "marker", "刑", getQimenHeavenStemMarker("xun", "癸"));
  assertEqual("qimen-plate-markers-heaven-stem-no-match", "marker", null, getQimenHeavenStemMarker("kan", "戊"));
  assertEqual("qimen-plate-markers-heaven-stem-invalid-palace", "marker", null, getQimenHeavenStemMarker(null, "丙"));
  assertEqual("qimen-plate-markers-heaven-stem-invalid-stem", "marker", null, getQimenHeavenStemMarker("kan", null));

  qimenPlateMarkersVerifiedCaseCount += 1;
  assertEqual("qimen-plate-markers-door-po-li-xiu", "marker", "迫", getQimenDoorPoMarker("li", "休"));
  assertEqual("qimen-plate-markers-door-po-kun-shang", "marker", "迫", getQimenDoorPoMarker("kun", "傷"));
  assertEqual("qimen-plate-markers-door-po-dui-jing", "marker", "迫", getQimenDoorPoMarker("dui", "景"));
  assertEqual("qimen-plate-markers-door-po-kan-sheng", "marker", "迫", getQimenDoorPoMarker("kan", "生"));
  assertEqual("qimen-plate-markers-door-po-no-match", "marker", null, getQimenDoorPoMarker("li", "生"));
  assertEqual("qimen-plate-markers-door-po-invalid-palace", "marker", null, getQimenDoorPoMarker(null, "休"));
  assertEqual("qimen-plate-markers-door-po-invalid-door", "marker", null, getQimenDoorPoMarker("li", null));

  const formalPlate = getQimenPlate({ dunType: "yang", ju: 1, hourPillar: "甲子" }).plate;
  qimenPlateMarkersVerifiedCaseCount += 1;
  assertEqual("qimen-plate-markers-tian-rui-formal-plate", "palaceKey", "kun", findQimenTianRuiPalaceKey(formalPlate));
  assertEqual("qimen-plate-markers-tian-rui-missing", "palaceKey", null, findQimenTianRuiPalaceKey(createQimenMarkerFixturePlate({ includeTianRui: false })));
  assertEqual("qimen-plate-markers-tian-rui-invalid", "palaceKey", null, findQimenTianRuiPalaceKey(null));

  const placementPlate = createQimenMarkerFixturePlate();
  const placementBefore = JSON.stringify(placementPlate);
  const placements = getQimenCenterStemPlacements(placementPlate);
  qimenPlateMarkersVerifiedCaseCount += 1;
  assertEqual("qimen-plate-markers-center-placement-earth", "palaceKey", "kun", placements.centerEarthStem?.palaceKey);
  assertEqual("qimen-plate-markers-center-placement-earth", "value", "己", placements.centerEarthStem?.value);
  assertEqual("qimen-plate-markers-center-placement-heaven", "palaceKey", "kun", placements.centerHeavenStem?.palaceKey);
  assertEqual("qimen-plate-markers-center-placement-heaven", "value", "戊", placements.centerHeavenStem?.value);
  assertEqual("qimen-plate-markers-center-placement-diagnostics", "length", 0, placements.diagnostics.length);
  assertEqual("qimen-plate-markers-center-placement-original-heaven", "center.heavenStem", "戊", placementPlate.palaces.center.heavenStem);
  assertEqual("qimen-plate-markers-center-placement-original-earth", "center.earthStem", "己", placementPlate.palaces.center.earthStem);
  assertEqual("qimen-plate-markers-center-placement-no-pollution", "json", placementBefore, JSON.stringify(placementPlate));

  const missingTianRuiPlate = createQimenMarkerFixturePlate({ includeTianRui: false });
  const missingTianRuiPlacement = getQimenCenterStemPlacements(missingTianRuiPlate);
  qimenPlateMarkersVerifiedCaseCount += 1;
  assertEqual("qimen-plate-markers-center-placement-missing-tian-rui", "centerHeavenStem", null, missingTianRuiPlacement.centerHeavenStem);
  assertEqual("qimen-plate-markers-center-placement-missing-tian-rui", "centerEarthStem.palaceKey", "kun", missingTianRuiPlacement.centerEarthStem?.palaceKey);
  assertEqual("qimen-plate-markers-center-placement-missing-tian-rui", "diagnostics.length", 1, missingTianRuiPlacement.diagnostics.length);
  assertEqual("qimen-plate-markers-center-placement-missing-tian-rui", "diagnostics.0.level", "warning", missingTianRuiPlacement.diagnostics[0]?.level);
  assertEqual("qimen-plate-markers-center-placement-missing-tian-rui", "diagnostics.0.code", "TIAN_RUI_PALACE_NOT_FOUND", missingTianRuiPlacement.diagnostics[0]?.code);

  const nullCenterStemPlate = createQimenMarkerFixturePlate({ centerHeavenStem: null, centerEarthStem: "" });
  const nullCenterStemPlacement = getQimenCenterStemPlacements(nullCenterStemPlate);
  qimenPlateMarkersVerifiedCaseCount += 1;
  assertEqual("qimen-plate-markers-center-placement-null-earth", "centerEarthStem", null, nullCenterStemPlacement.centerEarthStem);
  assertEqual("qimen-plate-markers-center-placement-null-heaven", "centerHeavenStem", null, nullCenterStemPlacement.centerHeavenStem);
  assertEqual("qimen-plate-markers-center-placement-null-diagnostics", "length", 0, nullCenterStemPlacement.diagnostics.length);

  const decoratedPlate = createQimenMarkerFixturePlate();
  const decoratedBefore = JSON.stringify(decoratedPlate);
  const markers = decorateQimenPlateMarkers(decoratedPlate);
  qimenPlateMarkersVerifiedCaseCount += 1;
  assertEqual("qimen-plate-markers-decorate", "palace.count", QIMEN_PALACE_KEYS.length, Object.keys(markers.palaces).length);
  for (const palaceKey of QIMEN_PALACE_KEYS) {
    assertEqual(`qimen-plate-markers-decorate-palace-key-${palaceKey}`, "exists", true, Object.hasOwn(markers.palaces, palaceKey));
  }
  assertEqual("qimen-plate-markers-decorate-kan-heaven-marker", "heavenStemMarker", "制", markers.palaces.kan.heavenStemMarker);
  assertEqual("qimen-plate-markers-decorate-kan-door-po", "doorPo", "迫", markers.palaces.kan.doorPo);
  assertEqual("qimen-plate-markers-decorate-kun-heaven-marker", "heavenStemMarker", "刑", markers.palaces.kun.heavenStemMarker);
  assertEqual("qimen-plate-markers-decorate-kun-door-po", "doorPo", "迫", markers.palaces.kun.doorPo);
  assertEqual("qimen-plate-markers-decorate-kun-center-earth", "centerEarthStem", "己", markers.palaces.kun.centerEarthStem);
  assertEqual("qimen-plate-markers-decorate-kun-center-heaven", "centerHeavenStem", "戊", markers.palaces.kun.centerHeavenStem);
  assertEqual("qimen-plate-markers-decorate-placements-earth", "palaceKey", "kun", markers.placements.centerEarthStem?.palaceKey);
  assertEqual("qimen-plate-markers-decorate-placements-heaven", "palaceKey", "kun", markers.placements.centerHeavenStem?.palaceKey);
  assertEqual("qimen-plate-markers-decorate-diagnostics-array", "isArray", true, Array.isArray(markers.diagnostics));
  assertEqual("qimen-plate-markers-decorate-no-pollution", "json", decoratedBefore, JSON.stringify(decoratedPlate));

  const generalZhiFuPlate = createQimenDisplayZhiFuFixturePlate({ zhiFuPalaceKey: "li" });
  const generalZhiFuBefore = JSON.stringify(generalZhiFuPlate);
  const tianQinZhiFuPlate = createQimenDisplayZhiFuFixturePlate({
    zhiFuStar: "天禽",
    zhiFuPalaceKey: "center",
    deityZhiFuPalaceKey: "xun",
  });
  const tianQinZhiFuBefore = JSON.stringify(tianQinZhiFuPlate);
  const tianQinMissingDeityPlate = createQimenDisplayZhiFuFixturePlate({
    zhiFuStar: "天禽",
    zhiFuPalaceKey: "center",
  });
  qimenPlateMarkersVerifiedCaseCount += 1;
  assertEqual("qimen-plate-markers-display-zhi-fu-general", "palaceKey", "li", findQimenDisplayZhiFuPalaceKey(generalZhiFuPlate));
  assertEqual("qimen-plate-markers-display-zhi-fu-tian-qin-outer-deity", "palaceKey", "xun", findQimenDisplayZhiFuPalaceKey(tianQinZhiFuPlate));
  assertEqual("qimen-plate-markers-display-zhi-fu-tian-qin-not-center", "notCenter", true, findQimenDisplayZhiFuPalaceKey(tianQinZhiFuPlate) !== "center");
  assertEqual("qimen-plate-markers-display-zhi-fu-tian-qin-fallback", "palaceKey", "center", findQimenDisplayZhiFuPalaceKey(tianQinMissingDeityPlate));
  assertEqual("qimen-plate-markers-display-zhi-fu-no-flag", "palaceKey", null, findQimenDisplayZhiFuPalaceKey(createQimenDisplayZhiFuFixturePlate({ zhiFuPalaceKey: null })));
  assertEqual("qimen-plate-markers-display-zhi-fu-invalid", "palaceKey", null, findQimenDisplayZhiFuPalaceKey(null));
  assertEqual("qimen-plate-markers-display-zhi-fu-general-no-pollution", "json", generalZhiFuBefore, JSON.stringify(generalZhiFuPlate));
  assertEqual("qimen-plate-markers-display-zhi-fu-tian-qin-no-pollution", "json", tianQinZhiFuBefore, JSON.stringify(tianQinZhiFuPlate));
}

function createQimenMarkerFixturePlate(options = {}) {
  const {
    centerHeavenStem = "戊",
    centerEarthStem = "己",
    includeTianRui = true,
  } = options;
  const palaces = {};

  for (const palaceKey of QIMEN_PALACE_KEYS) {
    palaces[palaceKey] = {
      earthStem: "甲",
      heavenStem: "甲",
      door: "休",
      star: "天任",
      deity: "太陰",
      isEmpty: false,
      isHorse: false,
      isZhiFuPalace: false,
      isZhiShiPalace: false,
      notes: [],
    };
  }

  palaces.kan.heavenStem = "丙";
  palaces.kan.door = "生";
  palaces.kun.heavenStem = "己";
  palaces.kun.door = "傷";
  palaces.kun.star = includeTianRui ? "天芮" : "天任";
  palaces.center.heavenStem = centerHeavenStem;
  palaces.center.earthStem = centerEarthStem;
  palaces.center.star = "天禽";
  palaces.center.door = null;
  palaces.center.deity = null;

  return {
    hourPillar: "甲子",
    zhiFuStar: "天任",
    zhiShiDoor: "休",
    palaces,
  };
}

function createQimenDisplayZhiFuFixturePlate(options = {}) {
  const {
    zhiFuStar = "天任",
    zhiFuPalaceKey = "kan",
    deityZhiFuPalaceKey = null,
  } = options;
  const plate = createQimenMarkerFixturePlate();

  plate.zhiFuStar = zhiFuStar;
  for (const palaceKey of QIMEN_PALACE_KEYS) {
    plate.palaces[palaceKey].isZhiFuPalace = false;
    plate.palaces[palaceKey].deity = palaceKey === "center" ? null : "太陰";
  }

  if (zhiFuPalaceKey) {
    plate.palaces[zhiFuPalaceKey].isZhiFuPalace = true;
  }

  if (deityZhiFuPalaceKey) {
    plate.palaces[deityZhiFuPalaceKey].deity = "值符";
  }

  return plate;
}

async function runQimenPlateValidationTests() {
  qimenPlateValidationVerifiedCaseCount += 1;
  for (const dunType of ["yang", "yin"]) {
    for (let ju = 1; ju <= 9; ju += 1) {
      const fixture = await loadQimenPlateFileFixture(dunType, ju);
      const result = validateQimenPlateSchemaFile(fixture, createQimenPlateValidationContext(dunType, ju));
      assertEqual(`qimen-plate-validation-current-skeleton-${dunType}-ju-${ju}`, "ok", true, result.ok);
      assertEqual(`qimen-plate-validation-current-skeleton-${dunType}-ju-${ju}`, "errors.length", 0, result.errors.length);
    }
  }

  const baseFixture = await loadQimenPlateFileFixture("yang", 1);
  const context = createQimenPlateValidationContext("yang", 1);

  const missingHourKey = clonePlainTestData(baseFixture);
  delete missingHourKey.plates["甲子"];
  const missingHourKeyResult = validateQimenPlateSchemaFile(missingHourKey, context);
  qimenPlateValidationVerifiedCaseCount += 1;
  assertEqual("qimen-plate-validation-missing-hour-key", "ok", false, missingHourKeyResult.ok);
  assertValidationHasError(missingHourKeyResult, "MISSING_HOUR_PILLAR", "qimen-plate-validation-missing-hour-key");

  const unknownHourKey = clonePlainTestData(baseFixture);
  unknownHourKey.plates["不存在"] = null;
  const unknownHourKeyResult = validateQimenPlateSchemaFile(unknownHourKey, context);
  qimenPlateValidationVerifiedCaseCount += 1;
  assertEqual("qimen-plate-validation-unknown-hour-key", "ok", false, unknownHourKeyResult.ok);
  assertValidationHasError(unknownHourKeyResult, "UNKNOWN_HOUR_PILLAR", "qimen-plate-validation-unknown-hour-key");

  const invalidMeta = clonePlainTestData(baseFixture);
  invalidMeta.meta.dunType = "yin";
  invalidMeta.meta.ju = 2;
  const invalidMetaResult = validateQimenPlateSchemaFile(invalidMeta, context);
  qimenPlateValidationVerifiedCaseCount += 1;
  assertEqual("qimen-plate-validation-invalid-meta", "ok", false, invalidMetaResult.ok);
  assertValidationHasError(invalidMetaResult, "DUN_TYPE_MISMATCH", "qimen-plate-validation-invalid-meta");
  assertValidationHasError(invalidMetaResult, "JU_MISMATCH", "qimen-plate-validation-invalid-meta");

  const validMinimalObject = clonePlainTestData(baseFixture);
  validMinimalObject.plates["甲子"] = createMinimalValidQimenPlateObject("甲子");
  const validMinimalObjectResult = validateQimenPlateSchemaFile(validMinimalObject, context);
  qimenPlateValidationVerifiedCaseCount += 1;
  assertEqual("qimen-plate-validation-valid-minimal-object", "ok", true, validMinimalObjectResult.ok);
  assertEqual("qimen-plate-validation-valid-minimal-object", "errors.length", 0, validMinimalObjectResult.errors.length);

  const invalidPalaceMeta = clonePlainTestData(validMinimalObject);
  invalidPalaceMeta.plates["甲子"].palaces.kan.palaceName = "錯";
  const invalidPalaceMetaResult = validateQimenPlateSchemaFile(invalidPalaceMeta, context);
  qimenPlateValidationVerifiedCaseCount += 1;
  assertEqual("qimen-plate-validation-invalid-palace-meta", "ok", false, invalidPalaceMetaResult.ok);
  assertValidationHasError(invalidPalaceMetaResult, "PALACE_META_MISMATCH", "qimen-plate-validation-invalid-palace-meta");

  const invalidFieldType = clonePlainTestData(validMinimalObject);
  invalidFieldType.plates["甲子"].palaces.kan.isEmpty = "false";
  const invalidFieldTypeResult = validateQimenPlateSchemaFile(invalidFieldType, context);
  qimenPlateValidationVerifiedCaseCount += 1;
  assertEqual("qimen-plate-validation-invalid-field-type", "ok", false, invalidFieldTypeResult.ok);
  assertValidationHasError(invalidFieldTypeResult, "INVALID_FIELD_TYPE", "qimen-plate-validation-invalid-field-type");

  const invalidNotes = clonePlainTestData(validMinimalObject);
  invalidNotes.plates["甲子"].notes = ["ok", 123];
  invalidNotes.plates["甲子"].palaces.kan.notes = "note";
  const invalidNotesResult = validateQimenPlateSchemaFile(invalidNotes, context);
  qimenPlateValidationVerifiedCaseCount += 1;
  assertEqual("qimen-plate-validation-invalid-notes", "ok", false, invalidNotesResult.ok);
  assertValidationHasError(invalidNotesResult, "INVALID_NOTES", "qimen-plate-validation-invalid-notes");
}

function runQimen1080MarkdownParserTests() {
  const parsed = parseQimen1080Markdown(qimen1080MarkdownRaw);

  qimen1080MarkdownParserVerifiedCaseCount += 1;
  assertEqual("qimen-1080-md-parser-smoke", "result.object", true, isPlainTestObject(parsed));
  assertEqual("qimen-1080-md-parser-smoke", "stats.object", true, isPlainTestObject(parsed.stats));
  assertEqual("qimen-1080-md-parser-smoke", "plates.array", true, Array.isArray(parsed.plates));
  assertEqual("qimen-1080-md-parser-smoke", "errors.array", true, Array.isArray(parsed.errors));
  assertEqual("qimen-1080-md-parser-smoke", "warnings.array", true, Array.isArray(parsed.warnings));
  assertEqual("qimen-1080-md-parser-smoke", "totalPlates.positive", true, parsed.stats.totalPlates > 0);
  assertEqual("qimen-1080-md-parser-smoke", "yangPlates.positive", true, parsed.stats.yangPlates > 0);
  assertEqual("qimen-1080-md-parser-smoke", "yinPlates.positive", true, parsed.stats.yinPlates > 0);

  const yangJu1Jiazi = parsed.plates.find((plate) => (
    plate.dunType === "yang" &&
    plate.ju === 1 &&
    plate.hourPillar === "甲子"
  ));
  qimen1080MarkdownParserVerifiedCaseCount += 1;
  assertEqual("qimen-1080-md-parser-yang-ju-1-jiazi", "plate.exists", true, Boolean(yangJu1Jiazi));
  assertEqual("qimen-1080-md-parser-yang-ju-1-jiazi", "zhiShiDoor", "休", yangJu1Jiazi?.zhiShiDoor);
  assertEqual("qimen-1080-md-parser-yang-ju-1-jiazi", "palaces.xun.heavenStem", "辛", yangJu1Jiazi?.palaces?.xun?.heavenStem);
  assertEqual("qimen-1080-md-parser-yang-ju-1-jiazi", "palaces.xun.earthStem", "辛", yangJu1Jiazi?.palaces?.xun?.earthStem);
  assertEqual("qimen-1080-md-parser-yang-ju-1-jiazi", "palaces.xun.star", "天輔", yangJu1Jiazi?.palaces?.xun?.star);
  assertEqual("qimen-1080-md-parser-yang-ju-1-jiazi", "palaces.xun.door", "杜", yangJu1Jiazi?.palaces?.xun?.door);
  assertEqual("qimen-1080-md-parser-yang-ju-1-jiazi", "palaces.xun.deity", "六合", yangJu1Jiazi?.palaces?.xun?.deity);
  assertEqual("qimen-1080-md-parser-yang-ju-1-jiazi", "palaces.center.star", "天禽", yangJu1Jiazi?.palaces?.center?.star);
  assertEqual("qimen-1080-md-parser-yang-ju-1-jiazi", "palaces.center.door", null, yangJu1Jiazi?.palaces?.center?.door);
  assertEqual("qimen-1080-md-parser-yang-ju-1-jiazi", "palaces.center.deity", null, yangJu1Jiazi?.palaces?.center?.deity);
  assertEqual("qimen-1080-md-parser-yang-ju-1-jiazi", "palaces.kan.star", "天蓬", yangJu1Jiazi?.palaces?.kan?.star);
  assertEqual("qimen-1080-md-parser-yang-ju-1-jiazi", "palaces.kan.door", "休", yangJu1Jiazi?.palaces?.kan?.door);
  assertEqual("qimen-1080-md-parser-yang-ju-1-jiazi", "palaces.kan.deity", "值符", yangJu1Jiazi?.palaces?.kan?.deity);

  const invalidFixture = `# 陽遁
### 陽遁一局
| 甲子 | | 直符：逢<br>直使：休 |
| --- | --- | --- |
| 辛 輔<br>辛 杜 合 | 壞資料 | 己 芮<br>己 死 雀 |`;
  const invalidResult = parseQimen1080Markdown(invalidFixture);
  const invalidCodes = [
    ...invalidResult.errors.map((error) => error.code),
    ...invalidResult.warnings.map((warning) => warning.code),
  ];
  qimen1080MarkdownParserVerifiedCaseCount += 1;
  assertEqual("qimen-1080-md-parser-invalid-fixture", "result.object", true, isPlainTestObject(invalidResult));
  assertEqual("qimen-1080-md-parser-invalid-fixture", "diagnostics.present", true, invalidCodes.length > 0);
  assertEqual(
    "qimen-1080-md-parser-invalid-fixture",
    "diagnostics.expected-code",
    true,
    ["INVALID_TABLE_SHAPE", "INVALID_CELL_FORMAT", "SUSPICIOUS_TEXT"].some((code) => invalidCodes.includes(code))
  );
}

async function runQimen1080ConverterDryRunTests() {
  const plateFilesSnapshotBefore = await readQimenPlateFilesSnapshot();
  const parsed = parseQimen1080Markdown(qimen1080MarkdownRaw);
  const conversion = convertQimen1080ParsedToDryRun(parsed);
  const report = buildQimen1080DryRunReport(parsed);
  const plateFilesSnapshotAfter = await readQimenPlateFilesSnapshot();

  qimen1080ConverterDryRunVerifiedCaseCount += 1;
  assertEqual("qimen-1080-converter-dry-run-conversion", "ok", true, conversion.ok);
  assertEqual("qimen-1080-converter-dry-run-conversion", "objects.length", 1080, conversion.objects.length);
  assertEqual("qimen-1080-converter-dry-run-conversion", "errors.length", 0, conversion.errors.length);
  assertEqual("qimen-1080-converter-dry-run-conversion", "warnings.length", 0, conversion.warnings.length);

  qimen1080ConverterDryRunVerifiedCaseCount += 1;
  assertEqual("qimen-1080-converter-dry-run-report", "ok", true, report.ok);
  assertEqual("qimen-1080-converter-dry-run-report", "stats.totalObjects", 1080, report.stats.totalObjects);
  assertEqual("qimen-1080-converter-dry-run-report", "stats.yangObjects", 540, report.stats.yangObjects);
  assertEqual("qimen-1080-converter-dry-run-report", "stats.yinObjects", 540, report.stats.yinObjects);
  assertEqual("qimen-1080-converter-dry-run-report", "errors.length", 0, report.errors.length);
  assertEqual("qimen-1080-converter-dry-run-report", "warnings.length", 0, report.warnings.length);

  qimen1080ConverterDryRunVerifiedCaseCount += 1;
  for (const dun of ["yang", "yin"]) {
    for (let ju = 1; ju <= 9; ju += 1) {
      assertEqual("qimen-1080-converter-dry-run-by-ju", `${dun}-${ju}`, 60, report.stats.byDunJu[`${dun}-${ju}`]);
    }
  }

  qimen1080ConverterDryRunVerifiedCaseCount += 1;
  assertEqual("qimen-1080-converter-dry-run-samples", "yangJu1JiajiJiazi", true, Boolean(report.samples.yangJu1JiajiJiazi?.object));
  assertEqual("qimen-1080-converter-dry-run-samples", "yangJu9WuguiGuihai", true, Boolean(report.samples.yangJu9WuguiGuihai?.object));
  assertEqual("qimen-1080-converter-dry-run-samples", "yinJu1JiajiJiazi", true, Boolean(report.samples.yinJu1JiajiJiazi?.object));
  assertEqual("qimen-1080-converter-dry-run-samples", "yinJu9WuguiGuihai", true, Boolean(report.samples.yinJu9WuguiGuihai?.object));
  assertEqual("qimen-1080-converter-dry-run-samples", "center.preserved", true, Boolean(report.samples.yangJu1JiajiJiazi?.object?.palaces?.center));

  qimen1080ConverterDryRunVerifiedCaseCount += 1;
  assertEqual("qimen-1080-converter-dry-run-validation", "totalObjects1080", true, report.validation.totalObjects1080.ok);
  assertEqual("qimen-1080-converter-dry-run-validation", "dunCounts", true, report.validation.dunCounts.ok);
  assertEqual("qimen-1080-converter-dry-run-validation", "byDunJuCounts", true, report.validation.byDunJuCounts.ok);
  assertEqual("qimen-1080-converter-dry-run-validation", "everyPlateHas9Palaces", true, report.validation.everyPlateHas9Palaces.ok);
  assertEqual("qimen-1080-converter-dry-run-validation", "requiredFieldsPresent", true, report.validation.requiredFieldsPresent.ok);
  assertEqual("qimen-1080-converter-dry-run-validation", "zhifuStarFound", true, report.validation.zhifuStarFound.ok);
  assertEqual("qimen-1080-converter-dry-run-validation", "zhishiDoorFound", true, report.validation.zhishiDoorFound.ok);

  qimen1080ConverterDryRunVerifiedCaseCount += 1;
  assertEqual(
    "qimen-1080-converter-dry-run-no-formal-write",
    "data/qimen/plates snapshot",
    plateFilesSnapshotBefore,
    plateFilesSnapshotAfter
  );
}

async function runQimen1080PreviewWriterTests() {
  const plateFilesSnapshotBefore = await readQimenPlateFilesSnapshot();
  const parsed = parseQimen1080Markdown(qimen1080MarkdownRaw);
  const dryRunReport = buildQimen1080DryRunReport(parsed);
  await clearQimen1080PreviewOutput();

  let writeResult = null;
  let previewFiles = new Map();
  try {
    writeResult = await writeQimen1080PreviewFiles(parsed);
    previewFiles = await readPreviewJsonFiles(writeResult.filesWritten);

    qimen1080PreviewWriterVerifiedCaseCount += 1;
    assertEqual("qimen-1080-preview-writer-result", "ok", true, writeResult.ok);
    assertEqual("qimen-1080-preview-writer-result", "filesWritten.length", 18, writeResult.filesWritten.length);
    assertEqual("qimen-1080-preview-writer-result", "errors.length", 0, writeResult.errors.length);
    assertEqual("qimen-1080-preview-writer-result", "warnings.length", 0, writeResult.warnings.length);

    qimen1080PreviewWriterVerifiedCaseCount += 1;
    assertPreviewFileMeta(previewFiles, "yang/ju-1.json", "yang", 1);
    assertPreviewFileMeta(previewFiles, "yang/ju-9.json", "yang", 9);
    assertPreviewFileMeta(previewFiles, "yin/ju-1.json", "yin", 1);
    assertPreviewFileMeta(previewFiles, "yin/ju-9.json", "yin", 9);
    assertEqual("qimen-1080-preview-writer-meta-all", "allIsPreview", true, [...previewFiles.values()].every((file) => file.meta?.isPreview === true));
    assertEqual("qimen-1080-preview-writer-meta-all", "allPlateCount60", true, [...previewFiles.values()].every((file) => file.meta?.plateCount === 60));
    assertEqual("qimen-1080-preview-writer-meta-all", "allGeneratedAtNull", true, [...previewFiles.values()].every((file) => file.meta?.generatedAt === null));

    const previewStats = buildPreviewJsonStats(previewFiles);
    qimen1080PreviewWriterVerifiedCaseCount += 1;
    assertEqual("qimen-1080-preview-writer-stats", "totalPlates", 1080, previewStats.totalPlates);
    assertEqual("qimen-1080-preview-writer-stats", "yangPlates", 540, previewStats.yangPlates);
    assertEqual("qimen-1080-preview-writer-stats", "yinPlates", 540, previewStats.yinPlates);
    assertEqual("qimen-1080-preview-writer-stats", "matchesDryRunTotal", dryRunReport.stats.totalObjects, previewStats.totalPlates);
    assertEqual("qimen-1080-preview-writer-stats", "matchesDryRunYang", dryRunReport.stats.yangObjects, previewStats.yangPlates);
    assertEqual("qimen-1080-preview-writer-stats", "matchesDryRunYin", dryRunReport.stats.yinObjects, previewStats.yinPlates);
    for (const [key, expectedCount] of Object.entries(dryRunReport.stats.byDunJu)) {
      assertEqual("qimen-1080-preview-writer-stats-by-ju", key, expectedCount, previewStats.byDunJu[key]);
    }

    qimen1080PreviewWriterVerifiedCaseCount += 1;
    assertEqual("qimen-1080-preview-writer-samples", "yang/ju-1 甲子", true, Boolean(previewFiles.get("yang/ju-1.json")?.plates?.["甲子"]));
    assertEqual("qimen-1080-preview-writer-samples", "yang/ju-9 癸亥", true, Boolean(previewFiles.get("yang/ju-9.json")?.plates?.["癸亥"]));
    assertEqual("qimen-1080-preview-writer-samples", "yin/ju-1 甲子", true, Boolean(previewFiles.get("yin/ju-1.json")?.plates?.["甲子"]));
    assertEqual("qimen-1080-preview-writer-samples", "yin/ju-9 癸亥", true, Boolean(previewFiles.get("yin/ju-9.json")?.plates?.["癸亥"]));
    assertEqual("qimen-1080-preview-writer-samples", "center.preserved", true, Boolean(previewFiles.get("yang/ju-1.json")?.plates?.["甲子"]?.palaces?.center));
    assertEqual("qimen-1080-preview-writer-samples", "raw.header.preserved", true, Boolean(previewFiles.get("yang/ju-1.json")?.plates?.["甲子"]?.raw?.header));
    assertEqual("qimen-1080-preview-writer-samples", "raw.cells.preserved", 9, Object.keys(previewFiles.get("yang/ju-1.json")?.plates?.["甲子"]?.raw?.cells ?? {}).length);

    qimen1080PreviewWriterVerifiedCaseCount += 1;
    assertEqual("qimen-1080-preview-writer-validation", "allPlateCountTrue", true, [...previewFiles.values()].every((file) => file.validation?.plateCount === true));
    assertEqual("qimen-1080-preview-writer-validation", "allEveryPlateHas9PalacesTrue", true, [...previewFiles.values()].every((file) => file.validation?.everyPlateHas9Palaces === true));
    assertEqual("qimen-1080-preview-writer-validation", "allRequiredFieldsPresentTrue", true, [...previewFiles.values()].every((file) => file.validation?.requiredFieldsPresent === true));
    assertEqual("qimen-1080-preview-writer-validation", "allParserOk", true, [...previewFiles.values()].every((file) => file.diagnostics?.parserOk === true));
    assertEqual("qimen-1080-preview-writer-validation", "allDryRunOk", true, [...previewFiles.values()].every((file) => file.diagnostics?.dryRunOk === true));

  } finally {
    await clearQimen1080PreviewOutput();
  }

  const plateFilesSnapshotAfter = await readQimenPlateFilesSnapshot();
  qimen1080PreviewWriterVerifiedCaseCount += 1;
  assertEqual(
    "qimen-1080-preview-writer-no-formal-write",
    "data/qimen/plates snapshot",
    plateFilesSnapshotBefore,
    plateFilesSnapshotAfter
  );

  const forbiddenOutputRootResult = await writeQimen1080PreviewFiles(parsed, {
    outputRoot: new URL("../data/qimen/plates/", import.meta.url),
  });
  qimen1080PreviewWriterVerifiedCaseCount += 1;
  assertEqual("qimen-1080-preview-writer-forbidden-output-root", "ok", false, forbiddenOutputRootResult.ok);
  assertEqual(
    "qimen-1080-preview-writer-forbidden-output-root",
    "hasForbiddenCode",
    true,
    forbiddenOutputRootResult.errors.some((error) => error.code === "OUTPUT_ROOT_FORMAL_PLATES_FORBIDDEN")
  );
}

async function runQimen1080FormalPlateAdapterTests() {
  const plateFilesSnapshotBefore = await readQimenPlateFilesSnapshot();
  const parsed = parseQimen1080Markdown(qimen1080MarkdownRaw);
  const report = buildQimen1080FormalPlateAdapterReport(parsed);
  const plateFilesSnapshotAfter = await readQimenPlateFilesSnapshot();

  qimen1080FormalPlateAdapterVerifiedCaseCount += 1;
  assertEqual("qimen-1080-formal-adapter-report", "ok", true, report.ok);
  assertEqual("qimen-1080-formal-adapter-report", "errors.length", 0, report.errors.length);
  assertEqual("qimen-1080-formal-adapter-report", "warnings.length", 0, report.warnings.length);
  assertEqual("qimen-1080-formal-adapter-report", "files.length", 18, report.files.length);

  qimen1080FormalPlateAdapterVerifiedCaseCount += 1;
  assertEqual("qimen-1080-formal-adapter-stats", "totalFiles", 18, report.stats.totalFiles);
  assertEqual("qimen-1080-formal-adapter-stats", "totalPlates", 1080, report.stats.totalPlates);
  assertEqual("qimen-1080-formal-adapter-stats", "yangPlates", 540, report.stats.yangPlates);
  assertEqual("qimen-1080-formal-adapter-stats", "yinPlates", 540, report.stats.yinPlates);
  for (const dunType of ["yang", "yin"]) {
    for (let ju = 1; ju <= 9; ju += 1) {
      assertEqual("qimen-1080-formal-adapter-by-ju", `${dunType}-${ju}`, 60, report.stats.byDunJu[`${dunType}-${ju}`]);
    }
  }

  qimen1080FormalPlateAdapterVerifiedCaseCount += 1;
  assertEqual("qimen-1080-formal-adapter-validation", "allFilesValid", true, report.validation.allFilesValid);
  assertEqual("qimen-1080-formal-adapter-validation", "fileResults.length", 18, report.validation.fileResults.length);
  assertEqual(
    "qimen-1080-formal-adapter-validation",
    "allFileResultsOk",
    true,
    report.validation.fileResults.every((fileResult) => fileResult.ok === true)
  );

  qimen1080FormalPlateAdapterVerifiedCaseCount += 1;
  assertEqual("qimen-1080-formal-adapter-samples", "yangJu1Jiazi.exists", true, Boolean(report.samples.yangJu1Jiazi));
  assertEqual("qimen-1080-formal-adapter-samples", "yangJu9Guihai.exists", true, Boolean(report.samples.yangJu9Guihai));
  assertEqual("qimen-1080-formal-adapter-samples", "yinJu1Jiazi.exists", true, Boolean(report.samples.yinJu1Jiazi));
  assertEqual("qimen-1080-formal-adapter-samples", "yinJu9Guihai.exists", true, Boolean(report.samples.yinJu9Guihai));

  qimen1080FormalPlateAdapterVerifiedCaseCount += 1;
  assertFormalAdapterSamplePlate("qimen-1080-formal-adapter-sample-yang-ju-1-jiazi", report.samples.yangJu1Jiazi, "甲子");
  assertFormalAdapterSamplePlate("qimen-1080-formal-adapter-sample-yang-ju-9-guihai", report.samples.yangJu9Guihai, "癸亥");
  assertFormalAdapterSamplePlate("qimen-1080-formal-adapter-sample-yin-ju-1-jiazi", report.samples.yinJu1Jiazi, "甲子");
  assertFormalAdapterSamplePlate("qimen-1080-formal-adapter-sample-yin-ju-9-guihai", report.samples.yinJu9Guihai, "癸亥");

  const yangJu1File = report.files.find((file) => file.relativePath === "yang/ju-1.json");
  qimen1080FormalPlateAdapterVerifiedCaseCount += 1;
  assertEqual("qimen-1080-formal-adapter-file-shape", "yangJu1.exists", true, Boolean(yangJu1File));
  assertEqual("qimen-1080-formal-adapter-file-shape", "meta.schemaVersion", "1.0.0", yangJu1File?.content?.meta?.schemaVersion);
  assertEqual("qimen-1080-formal-adapter-file-shape", "meta.dunType", "yang", yangJu1File?.content?.meta?.dunType);
  assertEqual("qimen-1080-formal-adapter-file-shape", "meta.ju", 1, yangJu1File?.content?.meta?.ju);
  assertEqual("qimen-1080-formal-adapter-file-shape", "plates.length", 60, Object.keys(yangJu1File?.content?.plates ?? {}).length);

  qimen1080FormalPlateAdapterVerifiedCaseCount += 1;
  assertEqual(
    "qimen-1080-formal-adapter-no-formal-write",
    "data/qimen/plates snapshot",
    plateFilesSnapshotBefore,
    plateFilesSnapshotAfter
  );

}

async function runQimen1080FormalCandidateWriterTests() {
  const plateFilesSnapshotBefore = await readQimenPlateFilesSnapshot();
  const parsed = parseQimen1080Markdown(qimen1080MarkdownRaw);
  await clearQimen1080FormalCandidateOutput();

  let writeResult = null;
  let candidateFiles = new Map();
  try {
    writeResult = await writeQimen1080FormalCandidateFiles(parsed);
    candidateFiles = await readFormalCandidateJsonFiles(writeResult.filesWritten);

    qimen1080FormalCandidateWriterVerifiedCaseCount += 1;
    assertEqual("qimen-1080-formal-candidate-writer-result", "ok", true, writeResult.ok);
    assertEqual("qimen-1080-formal-candidate-writer-result", "filesWritten.length", 18, writeResult.filesWritten.length);
    assertEqual("qimen-1080-formal-candidate-writer-result", "errors.length", 0, writeResult.errors.length);
    assertEqual("qimen-1080-formal-candidate-writer-result", "warnings.length", 0, writeResult.warnings.length);

    qimen1080FormalCandidateWriterVerifiedCaseCount += 1;
    assertEqual("qimen-1080-formal-candidate-writer-files", "allFilesRead", 18, candidateFiles.size);
    assertFormalCandidateFile(candidateFiles, "yang/ju-1.json", "yang", "陽遁", 1);
    assertFormalCandidateFile(candidateFiles, "yang/ju-9.json", "yang", "陽遁", 9);
    assertFormalCandidateFile(candidateFiles, "yin/ju-1.json", "yin", "陰遁", 1);
    assertFormalCandidateFile(candidateFiles, "yin/ju-9.json", "yin", "陰遁", 9);

    const candidateStats = buildFormalCandidateJsonStats(candidateFiles);
    qimen1080FormalCandidateWriterVerifiedCaseCount += 1;
    assertEqual("qimen-1080-formal-candidate-writer-stats", "totalPlates", 1080, candidateStats.totalPlates);
    assertEqual("qimen-1080-formal-candidate-writer-stats", "yangPlates", 540, candidateStats.yangPlates);
    assertEqual("qimen-1080-formal-candidate-writer-stats", "yinPlates", 540, candidateStats.yinPlates);
    for (const [key, expectedCount] of Object.entries(writeResult.stats.byDunJu)) {
      assertEqual("qimen-1080-formal-candidate-writer-stats-by-ju", key, expectedCount, candidateStats.byDunJu[key]);
    }

    qimen1080FormalCandidateWriterVerifiedCaseCount += 1;
    for (const [relativePath, file] of candidateFiles) {
      const [dunType, juFile] = relativePath.split("/");
      const ju = Number(juFile.replace("ju-", "").replace(".json", ""));
      const validation = validateQimenPlateSchemaFile(file, {
        filePath: `tmp/qimen1080-formal-candidate/${relativePath}`,
        expectedDunType: dunType,
        expectedJu: ju,
      });
      assertEqual(`qimen-1080-formal-candidate-writer-validation-${relativePath}`, "ok", true, validation.ok);
      assertEqual(`qimen-1080-formal-candidate-writer-validation-${relativePath}`, "errors.length", 0, validation.errors.length);
      assertEqual(`qimen-1080-formal-candidate-writer-validation-${relativePath}`, "warnings.length", 0, validation.warnings.length);
    }

    qimen1080FormalCandidateWriterVerifiedCaseCount += 1;
    assertEqual("qimen-1080-formal-candidate-writer-samples", "yang/ju-1 甲子", true, Boolean(candidateFiles.get("yang/ju-1.json")?.plates?.["甲子"]));
    assertEqual("qimen-1080-formal-candidate-writer-samples", "yang/ju-9 癸亥", true, Boolean(candidateFiles.get("yang/ju-9.json")?.plates?.["癸亥"]));
    assertEqual("qimen-1080-formal-candidate-writer-samples", "yin/ju-1 甲子", true, Boolean(candidateFiles.get("yin/ju-1.json")?.plates?.["甲子"]));
    assertEqual("qimen-1080-formal-candidate-writer-samples", "yin/ju-9 癸亥", true, Boolean(candidateFiles.get("yin/ju-9.json")?.plates?.["癸亥"]));
    assertFormalAdapterSamplePlate("qimen-1080-formal-candidate-writer-sample-yang-ju-1-jiazi", candidateFiles.get("yang/ju-1.json")?.plates?.["甲子"], "甲子");
    assertFormalAdapterSamplePlate("qimen-1080-formal-candidate-writer-sample-yang-ju-9-guihai", candidateFiles.get("yang/ju-9.json")?.plates?.["癸亥"], "癸亥");
    assertFormalAdapterSamplePlate("qimen-1080-formal-candidate-writer-sample-yin-ju-1-jiazi", candidateFiles.get("yin/ju-1.json")?.plates?.["甲子"], "甲子");
    assertFormalAdapterSamplePlate("qimen-1080-formal-candidate-writer-sample-yin-ju-9-guihai", candidateFiles.get("yin/ju-9.json")?.plates?.["癸亥"], "癸亥");

  } finally {
    await clearQimen1080FormalCandidateOutput();
  }

  const plateFilesSnapshotAfter = await readQimenPlateFilesSnapshot();
  qimen1080FormalCandidateWriterVerifiedCaseCount += 1;
  assertEqual(
    "qimen-1080-formal-candidate-writer-no-formal-write",
    "data/qimen/plates snapshot",
    plateFilesSnapshotBefore,
    plateFilesSnapshotAfter
  );

  qimen1080FormalCandidateWriterVerifiedCaseCount += 1;
  assertEqual(
    "qimen-1080-formal-candidate-writer-cleanup",
    "candidate root exists",
    false,
    await pathExists(new URL("../tmp/qimen1080-formal-candidate/", import.meta.url))
  );

  const forbiddenFormalRoot = await writeQimen1080FormalCandidateFiles(parsed, {
    outputRoot: new URL("../data/qimen/plates/", import.meta.url),
  });
  const forbiddenFormalSubRoot = await writeQimen1080FormalCandidateFiles(parsed, {
    outputRoot: new URL("../data/qimen/plates/yang/", import.meta.url),
  });
  const forbiddenProjectRoot = await writeQimen1080FormalCandidateFiles(parsed, {
    outputRoot: new URL("../", import.meta.url),
  });

  qimen1080FormalCandidateWriterVerifiedCaseCount += 1;
  assertEqual("qimen-1080-formal-candidate-writer-forbidden-output-root", "formalRoot.ok", false, forbiddenFormalRoot.ok);
  assertEqual("qimen-1080-formal-candidate-writer-forbidden-output-root", "formalRoot.hasForbiddenCode", true, forbiddenFormalRoot.errors.some((error) => error.code === "OUTPUT_ROOT_FORMAL_PLATES_FORBIDDEN"));
  assertEqual("qimen-1080-formal-candidate-writer-forbidden-output-root", "formalSubRoot.ok", false, forbiddenFormalSubRoot.ok);
  assertEqual("qimen-1080-formal-candidate-writer-forbidden-output-root", "formalSubRoot.hasForbiddenCode", true, forbiddenFormalSubRoot.errors.some((error) => error.code === "OUTPUT_ROOT_FORMAL_PLATES_FORBIDDEN"));
  assertEqual("qimen-1080-formal-candidate-writer-forbidden-output-root", "projectRoot.ok", false, forbiddenProjectRoot.ok);
  assertEqual("qimen-1080-formal-candidate-writer-forbidden-output-root", "projectRoot.hasForbiddenCode", true, forbiddenProjectRoot.errors.some((error) => error.code === "OUTPUT_ROOT_PROJECT_ROOT_FORBIDDEN"));
}

async function readFormalCandidateJsonFiles(filesWritten) {
  const candidateFiles = new Map();
  for (const file of filesWritten) {
    const raw = await readFile(file.path, "utf8");
    candidateFiles.set(file.relativePath, JSON.parse(raw));
  }
  return candidateFiles;
}

function assertFormalCandidateFile(candidateFiles, relativePath, dunType, dunName, ju) {
  const file = candidateFiles.get(relativePath);
  assertEqual(`qimen-1080-formal-candidate-writer-file-${relativePath}`, "exists", true, Boolean(file));
  assertEqual(`qimen-1080-formal-candidate-writer-file-${relativePath}`, "meta.schemaVersion", "1.0.0", file?.meta?.schemaVersion);
  assertEqual(`qimen-1080-formal-candidate-writer-file-${relativePath}`, "meta.dunType", dunType, file?.meta?.dunType);
  assertEqual(`qimen-1080-formal-candidate-writer-file-${relativePath}`, "meta.dunName", dunName, file?.meta?.dunName);
  assertEqual(`qimen-1080-formal-candidate-writer-file-${relativePath}`, "meta.ju", ju, file?.meta?.ju);
  assertEqual(`qimen-1080-formal-candidate-writer-file-${relativePath}`, "meta.plateCount", 60, file?.meta?.plateCount);
  assertEqual(`qimen-1080-formal-candidate-writer-file-${relativePath}`, "meta.source", "data/1080.md", file?.meta?.source);
  assertEqual(`qimen-1080-formal-candidate-writer-file-${relativePath}`, "meta.notes", "由 data/1080.md 轉換產生。", file?.meta?.notes);
  assertEqual(`qimen-1080-formal-candidate-writer-file-${relativePath}`, "plates.length", 60, Object.keys(file?.plates ?? {}).length);
}

function buildFormalCandidateJsonStats(candidateFiles) {
  const stats = {
    totalPlates: 0,
    yangPlates: 0,
    yinPlates: 0,
    byDunJu: {},
  };

  for (const file of candidateFiles.values()) {
    const count = Object.keys(file.plates ?? {}).length;
    stats.totalPlates += count;
    if (file.meta?.dunType === "yang") {
      stats.yangPlates += count;
    } else if (file.meta?.dunType === "yin") {
      stats.yinPlates += count;
    }
    stats.byDunJu[`${file.meta?.dunType}-${file.meta?.ju}`] = count;
  }

  return stats;
}

function assertFormalAdapterSamplePlate(id, plate, expectedHourPillar) {
  assertEqual(id, "schemaVersion", 1, plate?.schemaVersion);
  assertEqual(id, "hourPillar", expectedHourPillar, plate?.hourPillar);
  assertEqual(id, "zhiFuStar.exists", true, typeof plate?.zhiFuStar === "string" && plate.zhiFuStar.length > 0);
  assertEqual(id, "zhiShiDoor.exists", true, typeof plate?.zhiShiDoor === "string" && plate.zhiShiDoor.length > 0);
  assertEqual(id, "xunShou", null, plate?.xunShou);
  assertEqual(id, "notes.array", true, Array.isArray(plate?.notes));
  assertEqual(id, "source.type", "qimen1080-md", plate?.source?.type);
  assertEqual(id, "source.file", "data/1080.md", plate?.source?.file);
  assertEqual(id, "source.rawHeader.exists", true, typeof plate?.source?.rawHeader === "string" && plate.source.rawHeader.length > 0);
  assertEqual(id, "source.rawCells.9", 9, Object.keys(plate?.source?.rawCells ?? {}).length);
  assertEqual(id, "palaces.9", 9, Object.keys(plate?.palaces ?? {}).length);
  assertEqual(id, "center.exists", true, Boolean(plate?.palaces?.center));
  assertEqual(id, "center.palaceName", "中", plate?.palaces?.center?.palaceName);
  assertEqual(id, "center.direction", "中", plate?.palaces?.center?.direction);
  assertEqual(id, "center.luoshuNumber", 5, plate?.palaces?.center?.luoshuNumber);
  assertEqual(id, "center.star", "天禽", plate?.palaces?.center?.star);
  assertEqual(id, "kan.palaceName", "坎", plate?.palaces?.kan?.palaceName);
  assertEqual(id, "kan.direction", "北", plate?.palaces?.kan?.direction);
  assertEqual(id, "kan.luoshuNumber", 1, plate?.palaces?.kan?.luoshuNumber);
  assertEqual(id, "kan.isZhiFuPalace.boolean", true, typeof plate?.palaces?.kan?.isZhiFuPalace === "boolean");
  assertEqual(id, "kan.isZhiShiPalace.boolean", true, typeof plate?.palaces?.kan?.isZhiShiPalace === "boolean");
  assertEqual(id, "center.isZhiFuPalace.boolean", true, typeof plate?.palaces?.center?.isZhiFuPalace === "boolean");
  assertEqual(id, "center.isZhiShiPalace.boolean", true, typeof plate?.palaces?.center?.isZhiShiPalace === "boolean");
}

async function readPreviewJsonFiles(filesWritten) {
  const previewFiles = new Map();
  for (const file of filesWritten) {
    const raw = await readFile(file.path, "utf8");
    previewFiles.set(file.relativePath, JSON.parse(raw));
  }
  return previewFiles;
}

function assertPreviewFileMeta(previewFiles, relativePath, dun, ju) {
  const file = previewFiles.get(relativePath);
  assertEqual(`qimen-1080-preview-writer-meta-${relativePath}`, "exists", true, Boolean(file));
  assertEqual(`qimen-1080-preview-writer-meta-${relativePath}`, "schemaVersion", "qimen-1080-preview-v1", file?.meta?.schemaVersion);
  assertEqual(`qimen-1080-preview-writer-meta-${relativePath}`, "source", "data/1080.md", file?.meta?.source);
  assertEqual(`qimen-1080-preview-writer-meta-${relativePath}`, "generatedBy", "qimen1080PreviewWriter", file?.meta?.generatedBy);
  assertEqual(`qimen-1080-preview-writer-meta-${relativePath}`, "generatedAt", null, file?.meta?.generatedAt);
  assertEqual(`qimen-1080-preview-writer-meta-${relativePath}`, "dun", dun, file?.meta?.dun);
  assertEqual(`qimen-1080-preview-writer-meta-${relativePath}`, "ju", ju, file?.meta?.ju);
  assertEqual(`qimen-1080-preview-writer-meta-${relativePath}`, "plateCount", 60, file?.meta?.plateCount);
  assertEqual(`qimen-1080-preview-writer-meta-${relativePath}`, "isPreview", true, file?.meta?.isPreview);
  assertEqual(`qimen-1080-preview-writer-meta-${relativePath}`, "plates.length", 60, Object.keys(file?.plates ?? {}).length);
}

function buildPreviewJsonStats(previewFiles) {
  const stats = {
    totalPlates: 0,
    yangPlates: 0,
    yinPlates: 0,
    byDunJu: {},
  };

  for (const file of previewFiles.values()) {
    const count = Object.keys(file.plates ?? {}).length;
    stats.totalPlates += count;
    if (file.meta?.dun === "yang") {
      stats.yangPlates += count;
    } else if (file.meta?.dun === "yin") {
      stats.yinPlates += count;
    }
    stats.byDunJu[`${file.meta?.dun}-${file.meta?.ju}`] = count;
  }

  return stats;
}

async function readQimenPlateFilesSnapshot() {
  const entries = await readDirectoryFilesSnapshot(new URL("../data/qimen/plates/", import.meta.url));
  return entries.join("\n--- qimen plate file ---\n");
}

async function pathExists(pathUrl) {
  try {
    await access(pathUrl);
    return true;
  } catch {
    return false;
  }
}

async function readDirectoryFilesSnapshot(directoryUrl, prefix = "") {
  const entries = await readdir(directoryUrl, { withFileTypes: true });
  const snapshots = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (entry.isDirectory()) {
      snapshots.push(...await readDirectoryFilesSnapshot(new URL(`${entry.name}/`, directoryUrl), `${prefix}${entry.name}/`));
    } else if (entry.isFile()) {
      const content = await readFile(new URL(entry.name, directoryUrl), "utf8");
      snapshots.push(`${prefix}${entry.name}\n${content}`);
    }
  }

  return snapshots;
}

async function loadQimenPlateFileFixture(dunType, ju) {
  const raw = await readFile(
    new URL(`../data/qimen/plates/${dunType}/ju-${ju}.json`, import.meta.url),
    "utf8"
  );
  return JSON.parse(raw);
}

function createQimenPlateValidationContext(dunType, ju) {
  return {
    filePath: `data/qimen/plates/${dunType}/ju-${ju}.json`,
    expectedDunType: dunType,
    expectedJu: ju,
  };
}

function createMinimalValidQimenPlateObject(hourPillar = "甲子") {
  const palaces = Object.fromEntries(
    QIMEN_PALACE_KEYS.map((key) => {
      const meta = QIMEN_PALACE_META[key];
      return [
        key,
        {
          palaceName: meta.palaceName,
          direction: meta.direction,
          luoshuNumber: meta.luoshuNumber,
          earthStem: null,
          heavenStem: null,
          door: null,
          star: null,
          deity: null,
          isEmpty: false,
          isHorse: false,
          isZhiFuPalace: false,
          isZhiShiPalace: false,
          notes: [],
        },
      ];
    })
  );

  return {
    schemaVersion: 1,
    hourPillar,
    zhiFuStar: null,
    zhiShiDoor: null,
    xunShou: null,
    notes: [],
    palaces,
  };
}

function assertValidationHasError(result, code, label) {
  if (!result.errors.some((error) => error.code === code)) {
    failures.push({
      id: label,
      key: "errors",
      expected: code,
      actual: result.errors.map((error) => error.code).join(",") || "none",
    });
  }
}

function clonePlainTestData(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainTestObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertQimenDraftResolverFormatterEquivalent(id, expected, actual) {
  for (const key of [
    "actualSolarTerm",
    "qimenSolarTerm",
    "status",
    "yuan",
    "dunType",
    "dunName",
    "ju",
    "hourPillar",
    "isIntercalary",
  ]) {
    assertEqual(id, key, expected[key], actual[key]);
  }

  assertEqual(id, "notes.length", expected.notes.length, actual.notes.length);
  for (const [index, expectedNote] of expected.notes.entries()) {
    assertEqual(`${id}-note-${index + 1}`, "note", expectedNote, actual.notes[index]);
  }
  assertEqual(id, "lookup.strategy", expected.lookup?.strategy, actual.lookup?.strategy);
  assertEqual(id, "lookup.queryEffectiveDayStart", expected.lookup?.queryEffectiveDayStart, actual.lookup?.queryEffectiveDayStart);
  assertEqual(id, "lookup.selectedYear", expected.lookup?.selectedYear, actual.lookup?.selectedYear);
  assertEqual(id, "lookup.candidateYears.length", expected.lookup?.candidateYears?.length, actual.lookup?.candidateYears?.length);
  for (const [index, expectedYear] of (expected.lookup?.candidateYears ?? []).entries()) {
    assertEqual(`${id}-candidate-year-${index + 1}`, "year", expectedYear, actual.lookup?.candidateYears?.[index]);
  }
}

function areQimenDraftResolverFormatterResultsEquivalent(expected, actual) {
  if (!expected || !actual) {
    return expected === actual;
  }

  for (const key of [
    "actualSolarTerm",
    "qimenSolarTerm",
    "status",
    "yuan",
    "dunType",
    "dunName",
    "ju",
    "hourPillar",
    "isIntercalary",
  ]) {
    if (expected[key] !== actual[key]) {
      return false;
    }
  }
  if (expected.notes?.length !== actual.notes?.length) {
    return false;
  }
  for (const [index, expectedNote] of (expected.notes ?? []).entries()) {
    if (expectedNote !== actual.notes?.[index]) {
      return false;
    }
  }
  if (
    expected.lookup?.strategy !== actual.lookup?.strategy
    || expected.lookup?.queryEffectiveDayStart !== actual.lookup?.queryEffectiveDayStart
    || expected.lookup?.selectedYear !== actual.lookup?.selectedYear
    || expected.lookup?.candidateYears?.length !== actual.lookup?.candidateYears?.length
  ) {
    return false;
  }

  return (expected.lookup?.candidateYears ?? []).every((year, index) => {
    return year === actual.lookup?.candidateYears?.[index];
  });
}

function assertQimenDraftLookupEquivalent(id, expected, actual) {
  const expectedPresent = Boolean(expected);
  const actualPresent = Boolean(actual);
  assertEqual(id, "present", expectedPresent, actualPresent);
  if (!expectedPresent && !actualPresent) {
    return;
  }

  assertEqual(id, "qimenSolarTerm", expected?.qimenSolarTerm, actual?.qimenSolarTerm);
  assertEqual(id, "yuan", expected?.yuan, actual?.yuan);
  assertEqual(id, "start", expected?.start, actual?.start);
  assertEqual(id, "end", expected?.end, actual?.end);
  assertEqual(id, "isIntercalary", expected?.isIntercalary, actual?.isIntercalary);
  assertEqual(id, "sourceDayPillar", expected?.sourceDayPillar, actual?.sourceDayPillar);
  assertEqual(id, "lookup.strategy", expected?.lookup?.strategy, actual?.lookup?.strategy);
  assertEqual(id, "lookup.queryEffectiveDayStart", expected?.lookup?.queryEffectiveDayStart, actual?.lookup?.queryEffectiveDayStart);
  assertEqual(id, "lookup.selectedYear", expected?.lookup?.selectedYear, actual?.lookup?.selectedYear);
  assertEqual(id, "lookup.candidateYears.length", expected?.lookup?.candidateYears?.length, actual?.lookup?.candidateYears?.length);
  for (const [index, expectedYear] of (expected?.lookup?.candidateYears ?? []).entries()) {
    assertEqual(`${id}-candidate-year-${index + 1}`, "year", expectedYear, actual?.lookup?.candidateYears?.[index]);
  }
}

function areQimenDraftLookupEntriesEquivalent(expected, actual) {
  if (!expected || !actual) {
    return expected === actual;
  }
  if (
    expected.qimenSolarTerm !== actual.qimenSolarTerm
    || expected.yuan !== actual.yuan
    || expected.start !== actual.start
    || expected.end !== actual.end
    || expected.isIntercalary !== actual.isIntercalary
    || expected.sourceDayPillar !== actual.sourceDayPillar
    || expected.lookup?.strategy !== actual.lookup?.strategy
    || expected.lookup?.queryEffectiveDayStart !== actual.lookup?.queryEffectiveDayStart
    || expected.lookup?.selectedYear !== actual.lookup?.selectedYear
    || expected.lookup?.candidateYears?.length !== actual.lookup?.candidateYears?.length
  ) {
    return false;
  }

  return expected.lookup.candidateYears.every((year, index) => {
    return year === actual.lookup.candidateYears[index];
  });
}

function runQimenYearSeedRecommendationTests() {
  const recommendations2027 = buildQimenYearSeedRecommendations(2027);
  const expectedSeeds2027 = [
    {
      effectiveDayStart: "2027-05-29T23:00:00+08:00",
      qimenSolarTerm: "芒種",
      isIntercalary: false,
    },
    {
      effectiveDayStart: "2027-06-13T23:00:00+08:00",
      qimenSolarTerm: "夏至",
      isIntercalary: false,
    },
    {
      effectiveDayStart: "2027-11-25T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      isIntercalary: false,
    },
    {
      effectiveDayStart: "2027-12-10T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      isIntercalary: true,
    },
    {
      effectiveDayStart: "2027-12-25T23:00:00+08:00",
      qimenSolarTerm: "冬至",
      isIntercalary: false,
    },
  ];

  qimenYearSeedRecommendationVerifiedCaseCount += 1;
  assertEqual("qimen-year-seed-recommendations-2027", "year", 2027, recommendations2027.year);
  assertEqual("qimen-year-seed-recommendations-2027", "seeds.length", 5, recommendations2027.seeds?.length);
  assertEqual("qimen-year-seed-recommendations-2027", "windows.length", 2, recommendations2027.windows?.length);
  for (const [index, expectedSeed] of expectedSeeds2027.entries()) {
    assertQimenYearSeedRecommendation(`qimen-year-seed-recommendations-2027-${index + 1}`, recommendations2027.seeds?.[index], expectedSeed);
  }

  qimenYearSeedRecommendationVerifiedCaseCount += 1;
  for (const [index, seed] of recommendations2027.seeds.entries()) {
    const id = `qimen-year-seed-recommendation-structure-${index + 1}`;
    for (const key of ["effectiveDayStart", "qimenSolarTerm", "isIntercalary", "source", "reason"]) {
      if (!(key in seed)) {
        failures.push({
          id,
          key,
          expected: "present",
          actual: "missing",
        });
      }
    }

    if (typeof seed.reason !== "string" || seed.reason.length === 0) {
      failures.push({
        id,
        key: "reason",
        expected: "non-empty string",
        actual: seed.reason,
      });
    }
  }

  const expectedSources2027 = [
    "auto-window",
    "derived-next-term",
    "auto-window",
    "auto-intercalation",
    "derived-next-term",
  ];
  qimenYearSeedRecommendationVerifiedCaseCount += 1;
  for (const [index, expectedSource] of expectedSources2027.entries()) {
    assertEqual(
      `qimen-year-seed-recommendations-source-2027-${index + 1}`,
      "source",
      expectedSource,
      recommendations2027.seeds[index]?.source
    );
  }

  const sequentialMangzhongSeeds = buildQimenSequentialTermSeeds({
    startSeed: {
      effectiveDayStart: "2027-05-29T23:00:00+08:00",
      qimenSolarTerm: "芒種",
      isIntercalary: false,
    },
    count: 2,
  });
  const sequentialDaxueSeeds = buildQimenSequentialTermSeeds({
    startSeed: {
      effectiveDayStart: "2027-11-25T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      isIntercalary: false,
    },
    count: 2,
    intercalations: [
      {
        afterTerm: "大雪",
        atEffectiveDayStart: "2027-12-10T23:00:00+08:00",
      },
    ],
  });
  const sequentialExpectedSeeds = [...sequentialMangzhongSeeds, ...sequentialDaxueSeeds];
  qimenYearSeedRecommendationVerifiedCaseCount += 1;
  assertEqual("qimen-year-seed-recommendations-sequential-alignment", "length", sequentialExpectedSeeds.length, recommendations2027.seeds.length);
  for (const [index, expectedSeed] of sequentialExpectedSeeds.entries()) {
    assertQimenYearSeedRecommendation(
      `qimen-year-seed-recommendations-sequential-alignment-${index + 1}`,
      recommendations2027.seeds[index],
      {
        effectiveDayStart: expectedSeed.effectiveDayStart,
        qimenSolarTerm: expectedSeed.qimenSolarTerm,
        isIntercalary: expectedSeed.isIntercalary,
      }
    );
  }

  const fixture2027 = buildSeedDrivenQimenTimelineFixture2027();
  qimenYearSeedRecommendationVerifiedCaseCount += 1;
  for (const seed of recommendations2027.seeds) {
    const fixtureEntry = fixture2027.find((entry) => entry.start === seed.effectiveDayStart);
    assertEqual(`qimen-year-seed-fixture-alignment-${seed.effectiveDayStart}`, "present", true, Boolean(fixtureEntry));
    assertEqual(`qimen-year-seed-fixture-alignment-${seed.effectiveDayStart}`, "qimenSolarTerm", seed.qimenSolarTerm, fixtureEntry?.qimenSolarTerm);
    assertEqual(`qimen-year-seed-fixture-alignment-${seed.effectiveDayStart}`, "isIntercalary", seed.isIntercalary, fixtureEntry?.isIntercalary);
  }

  qimenYearSeedRecommendationVerifiedCaseCount += 1;
  assertThrowsTypeError("qimen-year-seed-recommendations-invalid-year", () => {
    buildQimenYearSeedRecommendations("2027");
  });

  qimenYearSeedRecommendationVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-year-seed-recommendations-missing-year", () => {
    buildQimenYearSeedRecommendations(1800);
  });
}

function runQimenTimelineFromYearSeedRecommendationTests() {
  const timeline2027 = buildQimenTimelineFromYearSeedRecommendations(2027);
  const expectedUpperEntries2027 = [
    {
      start: "2027-05-29T23:00:00+08:00",
      qimenSolarTerm: "芒種",
      yuan: "上元",
      isIntercalary: false,
      sourceDayPillar: "己酉",
    },
    {
      start: "2027-06-13T23:00:00+08:00",
      qimenSolarTerm: "夏至",
      yuan: "上元",
      isIntercalary: false,
      sourceDayPillar: "甲子",
    },
    {
      start: "2027-11-25T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "上元",
      isIntercalary: false,
      sourceDayPillar: "己酉",
    },
    {
      start: "2027-12-10T23:00:00+08:00",
      qimenSolarTerm: "大雪",
      yuan: "上元",
      isIntercalary: true,
      sourceDayPillar: "甲子",
    },
    {
      start: "2027-12-25T23:00:00+08:00",
      qimenSolarTerm: "冬至",
      yuan: "上元",
      isIntercalary: false,
      sourceDayPillar: "己卯",
    },
  ];

  qimenTimelineFromYearSeedRecommendationVerifiedCaseCount += 1;
  assertEqual("qimen-year-seed-timeline-2027", "isArray", true, Array.isArray(timeline2027));
  assertEqual("qimen-year-seed-timeline-2027", "nonEmpty", true, timeline2027.length > 0);
  for (const expectedEntry of expectedUpperEntries2027) {
    assertQimenTimelineEntryByStart(
      `qimen-year-seed-timeline-2027-${expectedEntry.start}`,
      timeline2027,
      expectedEntry
    );
  }

  const fixture2027 = buildSeedDrivenQimenTimelineFixture2027();
  qimenTimelineFromYearSeedRecommendationVerifiedCaseCount += 1;
  for (const fixtureEntry of fixture2027) {
    assertQimenTimelineEntryByStart(
      `qimen-year-seed-timeline-fixture-alignment-${fixtureEntry.start}`,
      timeline2027,
      {
        qimenSolarTerm: fixtureEntry.qimenSolarTerm,
        yuan: fixtureEntry.yuan,
        start: fixtureEntry.start,
        end: fixtureEntry.end,
        isIntercalary: fixtureEntry.isIntercalary,
        sourceDayPillar: fixtureEntry.sourceDayPillar,
      }
    );
  }

  qimenTimelineFromYearSeedRecommendationVerifiedCaseCount += 1;
  const timelineStarts = timeline2027.map((entry) => entry.start);
  const uniqueTimelineStarts = new Set(timelineStarts);
  assertEqual("qimen-year-seed-timeline-order", "uniqueStarts", timelineStarts.length, uniqueTimelineStarts.size);
  for (let index = 1; index < timeline2027.length; index += 1) {
    const previousMs = Date.parse(timeline2027[index - 1].start);
    const currentMs = Date.parse(timeline2027[index].start);
    assertEqual(`qimen-year-seed-timeline-order-${index}`, "ascending", true, previousMs < currentMs);
  }

  qimenTimelineFromYearSeedRecommendationVerifiedCaseCount += 1;
  assertThrowsTypeError("qimen-year-seed-timeline-invalid-year", () => {
    buildQimenTimelineFromYearSeedRecommendations("2027");
  });

  qimenTimelineFromYearSeedRecommendationVerifiedCaseCount += 1;
  assertThrowsRangeError("qimen-year-seed-timeline-missing-year", () => {
    buildQimenTimelineFromYearSeedRecommendations(1800);
  });
}

function assertQimenIntercalationWindow(id, actual, expected) {
  for (const [key, expectedValue] of Object.entries(expected)) {
    assertEqual(id, key, expectedValue, actual?.[key]);
  }
}

function assertQimenYearSeedRecommendation(id, actual, expected) {
  for (const [key, expectedValue] of Object.entries(expected)) {
    assertEqual(id, key, expectedValue, actual?.[key]);
  }
}

function assertQimenTimelineEntryByStart(id, timeline, expected) {
  const actual = Array.isArray(timeline)
    ? timeline.find((entry) => entry.start === expected.start)
    : null;

  if (!actual) {
    failures.push({
      id,
      key: expected.start,
      expected: "present",
      actual: "missing",
    });
    return;
  }

  assertQimenRange(id, actual, expected);
}

function assertTimelineStartsStrictlyIncreasing(id, timeline) {
  const starts = timeline.map((entry) => entry.start);
  const uniqueStarts = new Set(starts);
  assertEqual(id, "uniqueStarts", starts.length, uniqueStarts.size);

  for (let index = 1; index < timeline.length; index += 1) {
    const previousMs = Date.parse(timeline[index - 1].start);
    const currentMs = Date.parse(timeline[index].start);
    assertEqual(`${id}-${index}`, "ascending", true, previousMs < currentMs);
  }
}

function getDuplicateTimelineGroupsFromYearDrafts(yearDrafts) {
  const groupsByStart = new Map();

  for (const draft of yearDrafts) {
    for (const entry of draft.timeline) {
      const groupedEntry = { year: draft.year, ...entry };
      const group = groupsByStart.get(entry.start) ?? [];
      group.push(groupedEntry);
      groupsByStart.set(entry.start, group);
    }
  }

  return [...groupsByStart.entries()]
    .filter(([, entries]) => entries.length > 1)
    .map(([start, entries]) => ({ start, entries }));
}

function compareDuplicateTimelineEntries(entries) {
  if (!Array.isArray(entries) || entries.length < 2) {
    return false;
  }

  return getDifferentKeysBetweenTimelineEntries(entries[0], entries[1]).length === 0;
}

function getDifferentKeysBetweenTimelineEntries(a, b) {
  const comparisonKeys = [
    "qimenSolarTerm",
    "yuan",
    "start",
    "end",
    "isIntercalary",
    "sourceDayPillar",
  ];

  return comparisonKeys.filter((key) => a?.[key] !== b?.[key]);
}

function assertQimenTimelineDraftShape(id, draft, expectedYear) {
  assertEqual(id, "year", expectedYear, draft?.year);
  assertEqual(id, "startSeed.qimenSolarTerm", "大雪", draft?.startSeed?.qimenSolarTerm);
  assertEqual(id, "startSeed.isIntercalary", false, draft?.startSeed?.isIntercalary);
  assertEqual(id, "intercalations.isArray", true, Array.isArray(draft?.intercalations));
  assertEqual(id, "windows.isArray", true, Array.isArray(draft?.windows));
  assertEqual(id, "windows.length", 2, draft?.windows?.length);
  assertEqual(
    id,
    "windows.hasMangzhong",
    true,
    Array.isArray(draft?.windows) && draft.windows.some((window) => window.qimenSolarTerm === "芒種")
  );
  assertEqual(
    id,
    "windows.hasDaxue",
    true,
    Array.isArray(draft?.windows) && draft.windows.some((window) => window.qimenSolarTerm === "大雪")
  );
  assertEqual(id, "timeline.isArray", true, Array.isArray(draft?.timeline));
  assertEqual(id, "timeline.nonEmpty", true, Array.isArray(draft?.timeline) && draft.timeline.length > 0);

  if (Array.isArray(draft?.timeline)) {
    assertTimelineStartsStrictlyIncreasing(`${id}-timeline`, draft.timeline);
  }
}

function assertQimenDraftTimelineLengthByIntercalations(id, draft) {
  const intercalationCount = Array.isArray(draft?.intercalations) ? draft.intercalations.length : -1;
  assertEqual(id, "intercalations.supportedCount", true, intercalationCount >= 0 && intercalationCount <= 1);

  const normalEntryCount = Array.isArray(draft?.timeline)
    ? draft.timeline.filter((entry) => !entry.isIntercalary).length
    : 0;
  assertEqual(id, "normalEntryCountAtLeast72", true, normalEntryCount >= 72);
  assertEqual(id, "timeline.length", 72 + intercalationCount * 3, draft?.timeline?.length);
}

function assertQimenDraftStartSeedEntry(id, draft) {
  const start = draft?.startSeed?.effectiveDayStart;
  const startEntry = Array.isArray(draft?.timeline)
    ? draft.timeline.find((entry) => entry.start === start)
    : null;

  assertQimenRange(`${id}-start-seed-entry`, startEntry, {
    qimenSolarTerm: "大雪",
    yuan: "上元",
    start,
    isIntercalary: false,
  });
  assertEqual(
    `${id}-start-seed-entry`,
    "sourceDayPillar.isString",
    true,
    typeof startEntry?.sourceDayPillar === "string"
  );
  assertEqual(`${id}-start-seed-entry`, "sourceDayPillar.length", 2, startEntry?.sourceDayPillar?.length);
}

function assertQimenDraftIntercalationEntries(id, draft) {
  if (!Array.isArray(draft?.intercalations) || !Array.isArray(draft?.timeline)) {
    return;
  }

  for (const [index, intercalation] of draft.intercalations.entries()) {
    const intercalationId = `${id}-intercalation-${index + 1}`;
    const upperIndex = draft.timeline.findIndex(
      (entry) => entry.start === intercalation.atEffectiveDayStart
    );

    assertEqual(intercalationId, "upper.present", true, upperIndex >= 0);
    assertQimenRange(`${intercalationId}-upper`, draft.timeline[upperIndex], {
      qimenSolarTerm: intercalation.afterTerm,
      yuan: "上元",
      start: intercalation.atEffectiveDayStart,
      isIntercalary: true,
    });
    assertQimenRange(`${intercalationId}-middle`, draft.timeline[upperIndex + 1], {
      qimenSolarTerm: intercalation.afterTerm,
      yuan: "中元",
      isIntercalary: true,
    });
    assertQimenRange(`${intercalationId}-lower`, draft.timeline[upperIndex + 2], {
      qimenSolarTerm: intercalation.afterTerm,
      yuan: "下元",
      isIntercalary: true,
    });
  }
}

function assertQimenIntercalationWindowCandidate(id, actual, expected) {
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

  const daHuangDaoCases = [
    {
      id: "daily-info-da-huang-dao-yin-zi",
      monthBranch: "寅",
      dayBranch: "子",
      expected: { deity: "青龍", type: "黃道", fortune: "吉" },
    },
    {
      id: "daily-info-da-huang-dao-you-si",
      monthBranch: "酉",
      dayBranch: "巳",
      expected: { deity: "朱雀", type: "黑道", fortune: "凶" },
    },
    {
      id: "daily-info-da-huang-dao-wu-zi",
      monthBranch: "午",
      dayBranch: "子",
      expected: { deity: "金匱", type: "黃道", fortune: "吉" },
    },
    {
      id: "daily-info-da-huang-dao-chou-you",
      monthBranch: "丑",
      dayBranch: "酉",
      expected: { deity: "勾陳", type: "黑道", fortune: "凶" },
    },
  ];

  for (const testCase of daHuangDaoCases) {
    const actual = getDailyDaHuangDao(testCase.monthBranch, testCase.dayBranch);
    dailyInfoVerifiedCaseCount += 1;
    assertEqual(testCase.id, "deity", testCase.expected.deity, actual?.deity);
    assertEqual(testCase.id, "type", testCase.expected.type, actual?.type);
    assertEqual(testCase.id, "fortune", testCase.expected.fortune, actual?.fortune);
  }

  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-da-huang-dao-invalid-month", "result", null, getDailyDaHuangDao("無", "子"));

  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-da-huang-dao-invalid-day", "result", null, getDailyDaHuangDao("寅", "無"));

  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-da-huang-dao-fortune-invalid", "result", null, getDaHuangDaoFortune("無"));

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

  const baziHouWithVariants = calculateBaziFromSolarTerms(formatLocalDateTimeForTest(lichun.timeMs), solarTerms);
  baziCurrentHouVerifiedCaseCount += 1;
  assertSeventyTwoHouResult("bazi-current-hou-variants-current", baziHouWithVariants.currentHou, {
    name: "東風解凍",
  });
  assertSeventyTwoHouVariants("bazi-current-hou-variants-current", baziHouWithVariants.currentHou, {
    zhName: "東風解凍",
    jpName: "東風解凍",
  });
  assertSeventyTwoHouResult("bazi-current-hou-variants-next", baziHouWithVariants.nextHou, {
    name: "蟄蟲始振",
  });
  assertSeventyTwoHouVariants("bazi-current-hou-variants-next", baziHouWithVariants.nextHou, {
    zhName: "蟄蟲始振",
    jpName: "黄鶯睍睆",
  });
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
  const expectedJpVariantNames = new Map([
    [2, "黄鶯睍睆"],
    [7, "蟄虫啓戸"],
    [26, "腐草為蛍"],
    [47, "蟄虫坏戸"],
    [58, "虹蔵不見"],
    [72, "鶏始乳"],
  ]);

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

  seventyTwoHouVerifiedCaseCount += 1;
  for (const hou of allHou) {
    if (!hou.variants || typeof hou.variants !== "object") {
      failures.push({
        id: "seventy-two-hou-variants",
        key: `${hou.globalHouIndex}.variants`,
        expected: "present",
        actual: hou.variants,
      });
      continue;
    }

    if (!hou.variants.zh || typeof hou.variants.zh !== "object") {
      failures.push({
        id: "seventy-two-hou-variants",
        key: `${hou.globalHouIndex}.variants.zh`,
        expected: "present",
        actual: hou.variants.zh,
      });
    }

    if (!hou.variants.jp || typeof hou.variants.jp !== "object") {
      failures.push({
        id: "seventy-two-hou-variants",
        key: `${hou.globalHouIndex}.variants.jp`,
        expected: "present",
        actual: hou.variants.jp,
      });
    }

    assertEqual("seventy-two-hou-variants", `${hou.globalHouIndex}.variants.zh.label`, "中", hou.variants.zh?.label);
    assertEqual("seventy-two-hou-variants", `${hou.globalHouIndex}.variants.jp.label`, "日", hou.variants.jp?.label);
    assertEqual("seventy-two-hou-variants", `${hou.globalHouIndex}.variants.zh.name`, hou.name, hou.variants.zh?.name);
    assertEqual(
      "seventy-two-hou-variants",
      `${hou.globalHouIndex}.variants.zh.shortName`,
      hou.shortName,
      hou.variants.zh?.shortName
    );

    if (typeof hou.variants.jp?.name !== "string" || hou.variants.jp.name.trim() === "") {
      failures.push({
        id: "seventy-two-hou-variants",
        key: `${hou.globalHouIndex}.variants.jp.name`,
        expected: "non-empty string",
        actual: hou.variants.jp?.name,
      });
    }

    if (typeof hou.variants.jp?.shortName !== "string" || hou.variants.jp.shortName.trim() === "") {
      failures.push({
        id: "seventy-two-hou-variants",
        key: `${hou.globalHouIndex}.variants.jp.shortName`,
        expected: "non-empty string",
        actual: hou.variants.jp?.shortName,
      });
    }
  }

  seventyTwoHouVerifiedCaseCount += 1;
  for (const [globalHouIndex, expectedName] of expectedJpVariantNames) {
    const hou = allHou.find((candidate) => candidate.globalHouIndex === globalHouIndex);
    assertEqual(
      "seventy-two-hou-jp-variant-samples",
      `${globalHouIndex}.variants.jp.name`,
      expectedName,
      hou?.variants?.jp?.name
    );
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

  seventyTwoHouVerifiedCaseCount += 1;
  const lichunFirstHou = getCurrentHouBySolarTermRange("立春", lichunStart, yushuiStart, lichunStart);
  assertSeventyTwoHouVariants("seventy-two-hou-current-variants-lichun-first", lichunFirstHou, {
    zhName: "東風解凍",
    jpName: "東風解凍",
  });

  seventyTwoHouVerifiedCaseCount += 1;
  const lichunSecondHou = getCurrentHouBySolarTermRange("立春", lichunStart, yushuiStart, lichunFirstBoundary);
  assertSeventyTwoHouVariants("seventy-two-hou-current-variants-lichun-second", lichunSecondHou, {
    zhName: "蟄蟲始振",
    jpName: "黄鶯睍睆",
  });

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
  const lichunFirstNextHou = getNextHouBySolarTermRange(
    "立春",
    lichunStart,
    "雨水",
    yushuiStart,
    jingzheStart,
    lichunStart
  );
  assertSeventyTwoHouVariants("seventy-two-hou-next-variants-lichun-first", lichunFirstNextHou, {
    zhName: "蟄蟲始振",
    jpName: "黄鶯睍睆",
  });

  seventyTwoHouVerifiedCaseCount += 1;
  const lichunThirdNextHou = getNextHouBySolarTermRange(
    "立春",
    lichunStart,
    "雨水",
    yushuiStart,
    jingzheStart,
    lichunSecondBoundary
  );
  assertSeventyTwoHouVariants("seventy-two-hou-next-variants-cross-term", lichunThirdNextHou, {
    zhName: "獺祭魚",
    jpName: "土脉潤起",
  });

  seventyTwoHouVerifiedCaseCount += 1;
  const dahanThirdNextHou = getNextHouBySolarTermRange(
    "大寒",
    "2026-01-20T00:00:00",
    "立春",
    lichunStart,
    yushuiStart,
    "2026-01-30T00:00:00"
  );
  assertSeventyTwoHouResult("seventy-two-hou-next-variants-cross-year", dahanThirdNextHou, {
    name: "東風解凍",
    globalHouIndex: 1,
  });
  assertSeventyTwoHouVariants("seventy-two-hou-next-variants-cross-year", dahanThirdNextHou, {
    zhName: "東風解凍",
    jpName: "東風解凍",
  });

  seventyTwoHouVerifiedCaseCount += 1;
  lichunFirstHou.variants.jp.name = "測試污染";
  const lichunFirstHouAgain = getCurrentHouBySolarTermRange("立春", lichunStart, yushuiStart, lichunStart);
  assertSeventyTwoHouVariants("seventy-two-hou-variants-copy", lichunFirstHouAgain, {
    zhName: "東風解凍",
    jpName: "東風解凍",
  });

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

function runGuiDengTests() {
  const hourBranches = calculateGuiDengHourBranches("甲", "亥");
  guiDengVerifiedCaseCount += 1;
  assertEqual("guideng-jia-hai-yang-hour", "yang.hourBranch", "卯", hourBranches?.yang?.hourBranch);
  assertEqual("guideng-jia-hai-yin-hour", "yin.hourBranch", "酉", hourBranches?.yin?.hourBranch);

  const baseSunTimes = {
    date: new Date("2026-06-01T12:00:00+08:00"),
    sunrise: new Date("2026-06-01T05:03:00+08:00"),
    sunset: new Date("2026-06-01T18:43:00+08:00"),
    nextDaySunrise: new Date("2026-06-02T05:03:00+08:00"),
  };
  const jiaHai = calculateGuiDengWithSunTimes({
    ...baseSunTimes,
    dayStem: "甲",
    monthGeneral: "亥",
  });
  guiDengVerifiedCaseCount += 1;
  assertEqual("guideng-yang-mao-sunrise-intersection", "yang.rangeText", "05:03–06:59", jiaHai?.yang?.rangeText);

  guiDengVerifiedCaseCount += 1;
  assertEqual("guideng-yin-you-sunset-intersection", "yin.rangeText", "18:43–18:59", jiaHai?.yin?.rangeText);

  const bingHai = calculateGuiDengWithSunTimes({
    ...baseSunTimes,
    dayStem: "丙",
    monthGeneral: "亥",
  });
  guiDengVerifiedCaseCount += 1;
  assertEqual("guideng-yang-fully-night-hidden", "yang.isAvailable", false, bingHai?.yang?.isAvailable);

  const renHai = calculateGuiDengWithSunTimes({
    ...baseSunTimes,
    dayStem: "壬",
    monthGeneral: "亥",
  });
  guiDengVerifiedCaseCount += 1;
  assertEqual("guideng-yin-fully-day-hidden", "yin.isAvailable", false, renHai?.yin?.isAvailable);
}

function runAnnualAfflictionsTests() {
  const testCases = [
    {
      id: "annual-afflictions-wu",
      branch: "午",
      expected: {
        taiSui: "南",
        suiPo: "北",
        sanSha: "北",
        summary: "年煞：太歲南｜歲破北｜三煞北",
        palaceLabels: { 離: "太", 坎: "歲三" },
      },
    },
    {
      id: "annual-afflictions-zi",
      branch: "子",
      expected: {
        taiSui: "北",
        suiPo: "南",
        sanSha: "南",
        summary: "年煞：太歲北｜歲破南｜三煞南",
        palaceLabels: { 坎: "太", 離: "歲三" },
      },
    },
    {
      id: "annual-afflictions-mao",
      branch: "卯",
      expected: {
        taiSui: "東",
        suiPo: "西",
        sanSha: "西",
        summary: "年煞：太歲東｜歲破西｜三煞西",
        palaceLabels: { 震: "太", 兌: "歲三" },
      },
    },
  ];

  for (const testCase of testCases) {
    const afflictions = getAnnualAfflictionsByYearBranch(testCase.branch);
    const badgesByPalace = getAnnualAfflictionBadgesByPalace(testCase.branch);
    annualAfflictionsVerifiedCaseCount += 1;

    assertEqual(testCase.id, "taiSui.direction", testCase.expected.taiSui, afflictions.taiSui?.direction);
    assertEqual(testCase.id, "suiPo.direction", testCase.expected.suiPo, afflictions.suiPo?.direction);
    assertEqual(testCase.id, "sanSha.direction", testCase.expected.sanSha, afflictions.sanSha?.direction);
    assertEqual(testCase.id, "summary", testCase.expected.summary, afflictions.summary);

    for (const [palace, expectedLabels] of Object.entries(testCase.expected.palaceLabels)) {
      assertEqual(
        testCase.id,
        `badges.${palace}`,
        expectedLabels,
        formatAnnualAfflictionBadgeLabels(badgesByPalace[palace])
      );
    }
  }

  for (const invalidBranch of ["", "ABC", null]) {
    const afflictions = getAnnualAfflictionsByYearBranch(invalidBranch);
    const badgesByPalace = getAnnualAfflictionBadgesByPalace(invalidBranch);
    annualAfflictionsVerifiedCaseCount += 1;

    assertEqual("annual-afflictions-invalid", `${invalidBranch}.summary`, "", afflictions.summary);
    assertEqual(
      "annual-afflictions-invalid",
      `${invalidBranch}.badges`,
      0,
      Object.keys(badgesByPalace).length
    );
  }
}

function runDongGongDaySelectionTests() {
  const dongGongData = JSON.parse(dongGongDataRaw);
  const firstMonthEntries = dongGongData.filter((entry) => entry.monthBranch === "寅");
  const firstMonthKeys = firstMonthEntries.map((entry) => `${entry.monthBranch}:${entry.dayBranch}`);
  const expectedFirstMonthJianChuByBranch = {
    寅: "建",
    卯: "除",
    辰: "滿",
    巳: "平",
    午: "定",
    未: "執",
    申: "破",
    酉: "危",
    戌: "成",
    亥: "收",
    子: "開",
    丑: "閉",
  };

  dongGongVerifiedCaseCount += 1;
  assertEqual("dong-gong-yin-month-count", "length", 12, firstMonthEntries.length);

  dongGongVerifiedCaseCount += 1;
  assertEqual("dong-gong-yin-month-unique-keys", "size", 12, new Set(firstMonthKeys).size);

  for (const [dayBranch, expectedJianChu] of Object.entries(expectedFirstMonthJianChuByBranch)) {
    const entry = firstMonthEntries.find((item) => item.dayBranch === dayBranch);
    dongGongVerifiedCaseCount += 1;
    assertEqual("dong-gong-yin-month-jianchu", dayBranch, expectedJianChu, entry?.jianChu);
  }

  const jianYin = getDongGongDaySelection({
    monthBranch: "寅",
    dayPillar: "甲寅",
    jianChu: "建",
  });
  dongGongVerifiedCaseCount += 1;
  assertEqual("dong-gong-yin-jian-jiayin", "found", true, jianYin.found);
  assertEqual("dong-gong-yin-jian-jiayin", "title", "正月建寅日", jianYin.title);
  assertIncludes("dong-gong-yin-jian-jiayin", "effectiveAvoid", "起造", jianYin.effectiveAvoid);
  assertIncludes("dong-gong-yin-jian-jiayin", "effectiveAvoid", "婚姻", jianYin.effectiveAvoid);
  assertIncludes("dong-gong-yin-jian-jiayin", "effectiveAvoid", "納采", jianYin.effectiveAvoid);

  const dingYou = getDongGongDaySelection({
    monthBranch: "寅",
    dayPillar: "丁酉",
    jianChu: "危",
  });
  dongGongVerifiedCaseCount += 1;
  assertEqual("dong-gong-yin-wei-dingyou", "found", true, dingYou.found);
  assertEqual("dong-gong-yin-wei-dingyou", "effectiveLevel", "吉", dingYou.effectiveLevel);
  assertIncludes("dong-gong-yin-wei-dingyou", "effectiveSuitable", "安葬", dingYou.effectiveSuitable);
  assertIncludes("dong-gong-yin-wei-dingyou", "effectiveAvoid", "起造", dingYou.effectiveAvoid);

  const xinYou = getDongGongDaySelection({
    monthBranch: "寅",
    dayPillar: "辛酉",
    jianChu: "危",
  });
  dongGongVerifiedCaseCount += 1;
  assertEqual("dong-gong-yin-wei-xinyou", "found", true, xinYou.found);
  assertEqual("dong-gong-yin-wei-xinyou", "effectiveLevel", "凶", xinYou.effectiveLevel);
  assertIncludes("dong-gong-yin-wei-xinyou", "effectiveStars", "正四廢", xinYou.effectiveStars);

  const wuZi = getDongGongDaySelection({
    monthBranch: "寅",
    dayPillar: "戊子",
    jianChu: "開",
  });
  dongGongVerifiedCaseCount += 1;
  assertEqual("dong-gong-yin-kai-wuzi", "found", true, wuZi.found);
  assertEqual("dong-gong-yin-kai-wuzi", "effectiveLevel", "大吉", wuZi.effectiveLevel);
  assertIncludes("dong-gong-yin-kai-wuzi", "effectiveSuitable", "安葬", wuZi.effectiveSuitable);
  assertIncludes("dong-gong-yin-kai-wuzi", "effectiveNotes", "水土生人用之尤吉。", wuZi.effectiveNotes);

  const biChou = getDongGongDaySelection({
    monthBranch: "寅",
    dayPillar: "丁丑",
    jianChu: "閉",
  });
  dongGongVerifiedCaseCount += 1;
  assertEqual("dong-gong-yin-bi-dingchou", "found", true, biChou.found);
  assertEqual("dong-gong-yin-bi-dingchou", "title", "正月閉丑日", biChou.title);

  const missing = getDongGongDaySelection({
    monthBranch: "午",
    dayPillar: "甲午",
    jianChu: "建",
  });
  dongGongVerifiedCaseCount += 1;
  assertEqual("dong-gong-missing", "found", false, missing.found);
  assertEqual("dong-gong-missing", "effectiveSummary", "資料待補", missing.effectiveSummary);

  const forbiddenTerms = ["金神七煞", "二十八宿", "玉匣記九星值日", "煞貢", "直星", "人專"];
  const dongGongSources = `${dongGongDataRaw}\n${dongGongModuleRaw}`;
  for (const term of forbiddenTerms) {
    dongGongVerifiedCaseCount += 1;
    assertEqual("dong-gong-no-external-rules", term, false, dongGongSources.includes(term));
  }
}

function formatAnnualAfflictionBadgeLabels(badges) {
  return Array.isArray(badges) ? badges.map((badge) => badge.label).join("") : "";
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

function assertIncludes(id, key, expectedItem, actual) {
  if (!Array.isArray(actual) || !actual.includes(expectedItem)) {
    failures.push({
      id,
      key,
      expected: `include ${expectedItem}`,
      actual: Array.isArray(actual) ? actual.join(",") : actual,
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

function assertSeventyTwoHouVariants(id, actual, expected) {
  if (!actual) {
    failures.push({
      id,
      key: "result",
      expected: "hou object",
      actual: actual,
    });
    return;
  }

  assertEqual(id, "variants.zh.label", "中", actual.variants?.zh?.label);
  assertEqual(id, "variants.jp.label", "日", actual.variants?.jp?.label);
  assertEqual(id, "variants.zh.name", expected.zhName, actual.variants?.zh?.name);
  assertEqual(id, "variants.zh.shortName", expected.zhShortName ?? expected.zhName, actual.variants?.zh?.shortName);
  assertEqual(id, "variants.jp.name", expected.jpName, actual.variants?.jp?.name);
  assertEqual(id, "variants.jp.shortName", expected.jpShortName ?? expected.jpName, actual.variants?.jp?.shortName);
}
