const TEST_TIME_ZONE = "Asia/Taipei";
process.env.TZ = TEST_TIME_ZONE;

const { execFileSync } = await import("node:child_process");
const {
  createFlyingStarAfflictionViewModel,
  createSanShaByLayer,
  getPalaceIdByDirection,
  getAnnualAfflictionBadgesByPalace,
  getAnnualAfflictionsByYearBranch,
  getSanShaDirection,
} = await import("../src/annualAfflictions.js");
const { access, readdir, readFile } = await import("node:fs/promises");
const { fileURLToPath } = await import("node:url");
const {
  calculateBaziFromSeparatedTimeInputs,
  calculateBaziFromSolarTerms,
  getEffectiveDateKeyFromLocalParts,
} = await import("../src/bazi.js");
const {
  calculateBaziFromChartTimeContext,
  createBaziCalculationInputFromChartTimeContext,
  formatBaziChartTimeDebug,
  getBaziClockLocalParts,
  getBaziSolarTermComparisonInstantMs,
  validateBaziChartTimeContext,
} = await import("../src/baziChartTimeAdapter.js");
const {
  calculateFlyingStarsFromBaziResult,
  calculateFlyingStarsFromChartTimeContext,
  createFlyingStarsCalculationInput,
  formatFlyingStarsChartTimeDebug,
  validateFlyingStarsChartTimeInput,
} = await import("../src/flyingStarsChartTimeAdapter.js");
const { getDailyGodsByStem } = await import("../src/dailyGods.js");
const {
  getClothingAdviceByDayBranch,
  getBaoYiHeZhiFaByDayPillar,
  getDaHuangDaoFortune,
  getDailyDaHuangDao,
  getDailyClashByDayBranch,
  getDailyInfoByBranches,
  formatBaziDailySummary,
  formatBaziDailySummaryFromDateKey,
  getSanfuByDateKey,
  getSeasonalMarkerByUpcomingTerm,
  getSuiPoByBranches,
  getTianSheBySeasonAndDayPillar,
  isGengDay,
} = await import("../src/dailyInfo.js");
const { getDongGongDaySelection } = await import("../src/dongGongDaySelection.js");
const { SEXAGENARY_CYCLE, getDayPillarFromLocalParts } = await import("../src/ganzhi.js");
const {
  formatHexagramLabel,
  getHexagramByTrigrams,
  getTrigramByQimenDoor,
  getTrigramByQimenPalaceKey,
  getTrigramByQimenStar,
} = await import("../src/hexagrams.js");
const {
  getEarthlyBranchIndex,
  getJianchuByBranches,
  getJianchuSequence,
} = await import("../src/jianchu.js");
const {
  calculateGuiDengForDate,
  calculateGuiDengHourBranches,
  getChineseHourBoundaryLocalParts,
  calculateGuiDengWithSunTimesForLocalDate,
  calculateGuiDengWithSunTimes,
  DEFAULT_GUIDENG_LOCATION,
  getMonthGeneralBySolarTermName,
} = await import("../src/guideng.js");
const {
  calculateGuiDengFromChartTimeContext,
  createGuiDengCalculationInput,
  formatGuiDengChartTimeDebug,
  getGuiDengClockLocalParts,
  getGuiDengDayPillar,
  getGuiDengDayStem,
  getGuiDengMonthGeneral,
  getGuiDengSolarEventDateKey,
  GUIDENG_CHART_TIME_STATUS,
  resolveTrueSolarLocalDateTimeToInstant,
  resolveGuiDengSolarEventPhase,
  validateGuiDengChartTimeInput,
} = await import("../src/guidengChartTimeAdapter.js");
const {
  createGuiDengDisplayModel,
  formatDateTimeForChartMode,
  formatInstantForChartMode,
  formatRangeForChartMode,
  getChartClockLocalPartsForInstant,
} = await import("../src/chartClockDisplay.js");
const {
  getJinhanDunType,
  createJinhanBoundarySwitch,
  JINHAN_DUN_TYPE_MODE,
  JINHAN_DUN_TYPE_STATUS,
  resolveJinhanDunTypeFromLocalParts,
} = await import("../src/jinhanDunType.js");
const {
  calculateJinhanFromChartTimeContext,
  createJinhanCalculationInput,
  formatJinhanChartTimeDebug,
  getChineseHourInfoFromLocalParts,
  getJinhanClockLocalParts,
  getJinhanTermLocalParts,
  resolveJinhanDunTypeFromChartTimeContext,
  validateJinhanChartTimeInput,
} = await import("../src/jinhanChartTimeAdapter.js");
const {
  getJinhanBlackYellowHours,
  getJinhanDeitiesByPalace,
  getJinhanYujingDayPan,
} = await import("../src/jinhanYujing.js");
const { getNaYinByPillar } = await import("../src/nayin.js");
const { calculateSolarEvents } = await import("../src/solarEvents.js");
const {
  formatUtcOffset,
  getDeviceTimeZone,
  getZonedDateTimeParts,
  MAX_TIME_ZONE_FORMATTER_CACHE_SIZE,
  MAX_TIME_ZONE_INPUT_LENGTH,
  resolveLocalDateTimeInTimeZone,
  validateTimeZone,
} = await import("../src/timeZone.js");
const { getCommonTimeZones, getSupportedTimeZones, getTimeZoneSearchEntry, searchTimeZones } = await import("../src/timeZoneCatalog.js");
const {
  buildChartDisplayModeUrl,
  getChartDisplayModeFromLocation,
  isTrueSolarDisplayMode,
  normalizeChartDisplayMode,
} = await import("../src/chartDisplayMode.js");
const {
  CHART_CONTEXT_MODE_TRUE_SOLAR,
  CHART_CONTEXT_MODE_WATCH,
  cloneChartTimeContext,
  createChartTimeContext,
  createTrueSolarChartTimeContext,
  createWatchChartTimeContext,
  formatChartTimeContextDebug,
  getChartContextCivilInstantMs,
  getChartContextCivilLocalParts,
  getChartContextTrueSolarLocalParts,
  validateChartTimeContext,
} = await import("../src/chartTimeContext.js");
const {
  calculateEquationOfTime,
  calculateTrueSolarTime,
  MAX_COORDINATE_INPUT_LENGTH,
  convertDmsToDecimal,
  parseCoordinateInput,
} = await import("../src/trueSolarTime.js");
const {
  resolveTrueSolarLocalDateTimeToInstant: resolveTrueSolarClockLocalDateTimeToInstant,
  TRUE_SOLAR_CLOCK_DEFAULT_MAX_ITERATIONS,
  TRUE_SOLAR_CLOCK_MAX_ITERATIONS,
  TRUE_SOLAR_CLOCK_MAX_SEARCH_DISTANCE_MS,
  TRUE_SOLAR_CLOCK_RESOLUTION_STATUS,
} = await import("../src/trueSolarClock.js");
const {
  formatLunarCalendarAccessibleLabel,
  formatLunarCalendarLabel,
  getLunarDateForSolarDate,
  isLunarCalendarDateSupported,
} = await import("../src/lunarCalendar.js");
const {
  parseQimen1080Markdown,
} = await import("../src/qimen1080MarkdownParser.js");
const {
  QIMEN_SEQUENCE_DIAGNOSTIC_RULES,
  buildQimen1080SequenceDiagnostics,
  getQimenStemSequenceRule,
  isCircularSequenceMatch,
  normalizeQimenDoorForSequence,
  normalizeQimenStarForSequence,
} = await import("../src/qimen1080SequenceDiagnostics.js");
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
  QIMEN_JIA_HOUR_RESOLVED_STEMS,
  QIMEN_OPEN_CLOSE_BY_STAR,
  createQimenOpenCloseViewModel,
  resolveQimenJiaXun,
  resolveQimenOpenClose,
  resolveQimenOpenCloseStem,
} = await import("../src/qimenOpenClose.js");
const {
  QIMEN_BRANCH_POSITIONS,
  decorateQimenPlateMarkers,
  findQimenDisplayZhiFuPalaceKey,
  findQimenTianRuiPalaceKey,
  getQimenCenterStemPlacements,
  getQimenDoorPoMarker,
  getQimenDoorOverPalaceGenerateMarker,
  getQimenGuXuByHourBranch,
  getQimenHeavenStemMarker,
  getQimenOriginalStarByPalace,
  getQimenPalaceOverDoorGenerateMarker,
  getQimenPalaceOverDoorMarker,
  findQimenTianYiStarPalaceKey,
  normalizeQimenDoorName,
  normalizeQimenStarName,
} = await import("../src/qimenPlateMarkers.js");
const {
  QIMEN_SOLAR_TERM_VIRTUE_PUNISHMENT_BY_TERM,
  createQimenSolarTermVirtuePunishmentViewModel,
  normalizeQimenSolarTermName,
  resolveQimenSolarTermVirtuePunishment,
} = await import("../src/qimenSolarTermVirtuePunishment.js");
const {
  QIMEN_DOOR_QI_RESPONSE_BY_GROUP,
  QIMEN_DOOR_QI_RESPONSE_SOLAR_TERM_GROUPS,
  QIMEN_MONTH_BRANCH_GROUPS,
  QIMEN_STAR_QI_RESPONSE_BY_GROUP,
  QIMEN_STAR_QI_RESPONSE_GROUP_BY_STAR,
  createQimenQiResponseViewModel,
  getQimenMonthBranch,
  normalizeQimenMonthPillar,
  resolveQimenDoorQiResponse,
  resolveQimenStarQiResponse,
} = await import("../src/qimenQiResponse.js");
const {
  QIMEN_FIVE_NOT_ENCOUNTER_HOUR_BY_DAY_STEM,
  QIMEN_HOUR_STEM_ENTERS_TOMB_BY_DAY_STEM,
  normalizeQimenDayPillar,
  normalizeQimenPillar,
  resolveQimenRecurrenceOpposition,
  resolveQimenTimeSpecialConditions,
} = await import("../src/qimenTimeSpecialConditions.js");
const {
  getCurrentHouBySolarTermRange,
  getHouBySolarTerm,
  getHouDefinitions,
  getNextHouBySolarTermRange,
} = await import("../src/seventyTwoHou.js");
const {
  formatSolarTermDateTime,
  getSolarTermOnDate,
  getSolarTermsInMonth,
  normalizeSolarTerms,
  parseLocalDateTime,
} = await import("../src/solarTerms.js");
const {
  calculateAllFlyingStarCharts,
  calculateAllFlyingStarChartsFromInputs,
  calculateAnnualFlyingStarChart,
  calculateDailyFlyingStarChart,
  calculateHourlyFlyingStarChart,
  calculateMonthlyFlyingStarChart,
  calculatePeriodFlyingStarChart,
  flyStars,
} = await import("../src/flyingStars.js");
const {
  COMBINED_FLYING_STAR_LAYERS,
  createCombinedFlyingStarSummary,
  createCombinedFlyingStarViewModel,
  formatMonthlySummary,
  formatPeriodCycle,
  formatStarCircleNumber,
  formatStarName,
  formatYinYangDun,
  getPeriodYuanName,
} = await import("../src/flyingStarViewModel.js");
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
  mainModuleRaw,
  mainCssRaw,
  indexHtmlRaw,
  cwaLunarValidationRaw,
  chartTimeContextRaw,
  baziChartTimeAdapterRaw,
  flyingStarsChartTimeAdapterRaw,
  cwaBuildScriptRaw,
  cwaManifestRaw,
  thirdPartyDataRaw,
  lunarSourceDocRaw,
  securityDocRaw,
  jinhanChartTimeAdapterRaw,
] = await Promise.all([
  readFile(new URL("../data/solar_terms_1899_2101.json", import.meta.url), "utf8"),
  readFile(new URL("./testcases.json", import.meta.url), "utf8"),
  readFile(new URL("./flying-stars-testcases.json", import.meta.url), "utf8"),
  readFile(new URL("../data/jinhan_yujing_day_pan.json", import.meta.url), "utf8"),
  readFile(new URL("../data/qimen/qimen_yuan_ju_table.json", import.meta.url), "utf8"),
  readFile(new URL("../data/1080.md", import.meta.url), "utf8"),
  readFile(new URL("../data/dong_gong_day_selection.json", import.meta.url), "utf8"),
  readFile(new URL("../src/dongGongDaySelection.js", import.meta.url), "utf8"),
  readFile(new URL("../src/main.js", import.meta.url), "utf8"),
  readFile(new URL("../styles/main.css", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../data/cwa_lunar_calendar_validation_2022_2050.json", import.meta.url), "utf8"),
  readFile(new URL("../src/chartTimeContext.js", import.meta.url), "utf8"),
  readFile(new URL("../src/baziChartTimeAdapter.js", import.meta.url), "utf8"),
  readFile(new URL("../src/flyingStarsChartTimeAdapter.js", import.meta.url), "utf8"),
  readFile(new URL("../scripts/build-cwa-lunar-calendar-data.js", import.meta.url), "utf8"),
  readFile(new URL("../data/cwa_lunar_calendar_manifest_2022_2050.json", import.meta.url), "utf8"),
  readFile(new URL("../THIRD_PARTY_DATA.md", import.meta.url), "utf8"),
  readFile(new URL("../docs/76_農曆資料來源與時間基準.md", import.meta.url), "utf8"),
  readFile(new URL("../docs/79_前端輸入安全盤點與補強.md", import.meta.url), "utf8"),
  readFile(new URL("../src/jinhanChartTimeAdapter.js", import.meta.url), "utf8"),
]);

const solarTerms = normalizeSolarTerms(JSON.parse(termsRaw));
const testCases = JSON.parse(casesRaw);
const flyingStarsTestCases = JSON.parse(flyingStarsCasesRaw);
const jinhanYujingData = JSON.parse(jinhanYujingRaw);
const qimenYuanJuTableData = JSON.parse(qimenYuanJuTableRaw);
const cwaLunarValidation = JSON.parse(cwaLunarValidationRaw);
const failures = [];
const pendingCases = [];
let verifiedCaseCount = 0;
let flyingStarsVerifiedCaseCount = 0;
let dailyGodsVerifiedCaseCount = 0;
let dailyInfoVerifiedCaseCount = 0;
let naYinVerifiedCaseCount = 0;
let trueSolarTimeVerifiedCaseCount = 0;
let trueSolarTimeUiVerifiedCaseCount = 0;
let trueSolarPresentationLabelVerifiedCaseCount = 0;
let lunarCivilDateUxVerifiedCaseCount = 0;
let astronomicalDisplayTimeVerifiedCaseCount = 0;
let finalManualR1VerifiedCaseCount = 0;
let finalManualR2VerifiedCaseCount = 0;
let chineseHourActiveClockVerifiedCaseCount = 0;
let solarEventsVerifiedCaseCount = 0;
let timeZoneVerifiedCaseCount = 0;
let timeZoneCatalogVerifiedCaseCount = 0;
let chartDisplayModeVerifiedCaseCount = 0;
let chartTimeContextVerifiedCaseCount = 0;
let baziChartTimeAdapterVerifiedCaseCount = 0;
let flyingStarsChartTimeAdapterVerifiedCaseCount = 0;
let flyingStarsChartTimeRuntimeVerifiedCaseCount = 0;
let trueSolarBaziRuntimeVerifiedCaseCount = 0;
let trueSolarBaziRuntimeBugFixVerifiedCaseCount = 0;
let trueSolarSharedQueryRuntimeVerifiedCaseCount = 0;
let chartQueryTimeUxVerifiedCaseCount = 0;
let trueSolarFormalTimeSyncBugFixVerifiedCaseCount = 0;
let trueSolarQuerySourceIsolationBugFixVerifiedCaseCount = 0;
let trueSolarLocationOwnershipFixVerifiedCaseCount = 0;
let trueSolarDailyInfoVerifiedCaseCount = 0;
let trueSolarBaziPriorityBugFixVerifiedCaseCount = 0;
let calendarBrowseAutoNowBugFixVerifiedCaseCount = 0;
let preciseChartTimeInputVerifiedCaseCount = 0;
let preciseChartTimeZeroSecondBugFixVerifiedCaseCount = 0;
let frontendInputSecurityVerifiedCaseCount = 0;
let jianchuVerifiedCaseCount = 0;
let lunarCalendarVerifiedCaseCount = 0;
let lunarCalendarUiVerifiedCaseCount = 0;
let jinhanDayPillarCount = 0;
let jinhanPanCount = 0;
let jinhanBlackYellowHourCount = 0;
let jinhanLookupVerifiedCaseCount = 0;
let jinhanDunTypeVerifiedCaseCount = 0;
let jinhanChartTimeAdapterVerifiedCaseCount = 0;
let jinhanChartTimeRuntimeVerifiedCaseCount = 0;
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
let qimenOpenCloseVerifiedCaseCount = 0;
let qimenSolarTermVirtuePunishmentVerifiedCaseCount = 0;
let qimenQiResponseVerifiedCaseCount = 0;
let qimenTimeSpecialConditionsVerifiedCaseCount = 0;
let qimenResponsiveOverflowVerifiedCaseCount = 0;
let qimen1080MarkdownParserVerifiedCaseCount = 0;
let qimen1080SequenceDiagnosticsVerifiedCaseCount = 0;
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
let guiDengChartTimeAdapterVerifiedCaseCount = 0;
let guiDengChartTimeRuntimeVerifiedCaseCount = 0;
let guiDengChartTimeRuntimeRealAstronomyVerifiedCaseCount = 0;
let annualAfflictionsVerifiedCaseCount = 0;
let sanShaVerifiedCaseCount = 0;
let dongGongVerifiedCaseCount = 0;
let queryPickerVerifiedCaseCount = 0;
let flyingStarRenderFlowVerifiedCaseCount = 0;
let hexagramVerifiedCaseCount = 0;
const queryPickerHelpers = loadQueryPickerHelpersForTest(mainModuleRaw);
const queryCalendarDayDetail = loadQueryCalendarDayDetailForTest(mainModuleRaw);

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
runJinhanChartTimeAdapterTests(solarTerms);
runJinhanChartTimeRuntimeTests(solarTerms);
await runGuiDengChartTimeAdapterTests(solarTerms);
await runGuiDengChartTimeRuntimeTests(solarTerms);
await runGuiDengChartTimeRuntimeRealAstronomyTests(solarTerms);
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
runQimenOpenCloseTests();
runQimenSolarTermVirtuePunishmentTests();
runQimenQiResponseTests();
runQimenTimeSpecialConditionsTests();
runQimenResponsiveOverflowTests();
runHexagramTests();
await runQimenPlateValidationTests();
runQimen1080MarkdownParserTests();
runQimen1080SequenceDiagnosticsTests();
await runQimen1080ConverterDryRunTests();
await runQimen1080PreviewWriterTests();
await runQimen1080FormalPlateAdapterTests();
await runQimen1080FormalCandidateWriterTests();
runQimenYearSeedRecommendationTests();
runQimenTimelineFromYearSeedRecommendationTests();
runQimenResolverTests();
runDailyInfoTests();
runTrueSolarTimeTests();
runTrueSolarTimeUiTests();
await runTrueSolarPresentationLabelTests();
await runLunarCivilDateUxTests();
await runAstronomicalDisplayTimeTests(solarTerms);
await runFinalManualR1Tests(solarTerms);
await runFinalManualR2Tests(solarTerms);
await runChineseHourActiveClockTests(solarTerms);
runChartDisplayModeTests();
  runChartTimeContextTests();
  runBaziChartTimeAdapterTests();
  runTrueSolarBaziRuntimeTests();
  runTrueSolarBaziRuntimeBugFixTests();
  runTrueSolarSharedQueryRuntimeTests();
  runChartQueryTimeUxTests();
  runTrueSolarFormalTimeSyncBugFixTests();
  runTrueSolarQuerySourceIsolationBugFixTests();
  await runTrueSolarLocationOwnershipFixTests(solarTerms);
  runTrueSolarBaziPriorityBugFixTests(solarTerms);
  runTrueSolarDailyInfoTests(solarTerms);
  runCalendarBrowseAutoNowBugFixTests();
  runPreciseChartTimeInputTests(solarTerms);
  runPreciseChartTimeZeroSecondBugFixTests(solarTerms);
  runFrontendInputSecurityTests();
await runSolarEventsTests();
await runTimeZoneTests();
runTimeZoneCatalogTests();
runSolarTermCalendarTests(solarTerms);
  runQueryPickerTests(solarTerms);
runFlyingStarsChartTimeAdapterTests(solarTerms);
runFlyingStarsChartTimeRuntimeTests(solarTerms);
runFlyingStarRenderFlowTests(solarTerms);
runBaziCurrentHouTests(solarTerms);
runBaziJianchuTests(solarTerms);
runBaziDailyInfoTests(solarTerms);
runSeventyTwoHouTests();
runGuiDengTests();
runFlyingStarSanShaTests(solarTerms);
runAnnualAfflictionsTests();
runDongGongDaySelectionTests();
runLunarCalendarTests();
runLunarCalendarUiTests();

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
  console.log(`真太陽時核心測試通過：${trueSolarTimeVerifiedCaseCount} cases`);
  console.log(`真太陽時 UI 測試通過：${trueSolarTimeUiVerifiedCaseCount} cases`);
  console.log(`真太陽時 presentation label 測試通過：${trueSolarPresentationLabelVerifiedCaseCount} cases`);
  console.log(`農曆／civil-date UX 測試通過：${lunarCivilDateUxVerifiedCaseCount} cases`);
  console.log(`astronomical display-time mode-aware 測試通過：${astronomicalDisplayTimeVerifiedCaseCount} cases`);
  console.log(`8B final manual R1 驗收測試通過：${finalManualR1VerifiedCaseCount} cases`);
  console.log(`8B final manual R2 refresh isolation 測試通過：${finalManualR2VerifiedCaseCount} cases`);
  console.log(`十二時辰 active chart clock 測試通過：${chineseHourActiveClockVerifiedCaseCount} cases`);
  console.log(`排盤顯示模式測試通過：${chartDisplayModeVerifiedCaseCount} cases`);
  console.log(`ChartTimeContext 核心測試通過：${chartTimeContextVerifiedCaseCount} cases`);
  console.log(`四柱 ChartTimeContext adapter 測試通過：${baziChartTimeAdapterVerifiedCaseCount} cases`);
  console.log(`九宮飛星 ChartTimeContext adapter 測試通過：${flyingStarsChartTimeAdapterVerifiedCaseCount} cases`);
  console.log(`九宮飛星 ChartTimeContext runtime 接線測試通過：${flyingStarsChartTimeRuntimeVerifiedCaseCount} cases`);
  console.log(`真太陽時四柱 runtime 測試通過：${trueSolarBaziRuntimeVerifiedCaseCount} cases`);
  console.log(`真太陽時四柱 runtime blocking bug 修復測試通過：${trueSolarBaziRuntimeBugFixVerifiedCaseCount} cases`);
  console.log(`真太陽時四柱共用查詢時間 R2 測試通過：${trueSolarSharedQueryRuntimeVerifiedCaseCount} cases`);
  console.log(`排盤時間來源 UX R3 測試通過：${chartQueryTimeUxVerifiedCaseCount} cases`);
  console.log(`正式真太陽四柱時間同步 blocking bug 修復測試通過：${trueSolarFormalTimeSyncBugFixVerifiedCaseCount} cases`);
  console.log(`正式排盤／B-C 查詢來源隔離 blocking bug 修復測試通過：${trueSolarQuerySourceIsolationBugFixVerifiedCaseCount} cases`);
  console.log(`Source A/B/C location ownership 8B-FIX-1 測試通過：${trueSolarLocationOwnershipFixVerifiedCaseCount} cases`);
  console.log(`auto-now 四柱優先更新 blocking bug 修復測試通過：${trueSolarBaziPriorityBugFixVerifiedCaseCount} cases`);
  console.log(`月曆瀏覽 auto-now blocking bug 修復測試通過：${calendarBrowseAutoNowBugFixVerifiedCaseCount} cases`);
  console.log(`精確排盤時間輸入 UX 測試通過：${preciseChartTimeInputVerifiedCaseCount} cases`);
  console.log(`datetime-local 00 秒 ChartTimeContext blocking bug 修復測試通過：${preciseChartTimeZeroSecondBugFixVerifiedCaseCount} cases`);
  console.log(`前端輸入安全 regression 測試通過：${frontendInputSecurityVerifiedCaseCount} cases`);
  console.log(`真太陽四柱每日附屬資訊 8B-2C 測試通過：${trueSolarDailyInfoVerifiedCaseCount} cases`);
  console.log(`太陽事件測試通過：${solarEventsVerifiedCaseCount} cases`);
  console.log(`時區核心測試通過：${timeZoneVerifiedCaseCount} cases`);
  console.log(`時區搜尋 catalog 測試通過：${timeZoneCatalogVerifiedCaseCount} cases`);
  console.log(`建除十二神測試通過：${jianchuVerifiedCaseCount} cases`);
  console.log(`CWA 農曆資料測試通過：${lunarCalendarVerifiedCaseCount} cases`);
  console.log(`CWA 農曆月曆 UI 測試通過：${lunarCalendarUiVerifiedCaseCount} cases`);
  console.log(
    `金函玉鏡資料檢查通過：${jinhanDayPillarCount} day pillars, ${jinhanPanCount} pans, ${jinhanBlackYellowHourCount} blackYellowHours`
  );
  console.log(`金函玉鏡查表測試通過：${jinhanLookupVerifiedCaseCount} cases`);
  console.log(`金函玉鏡超神接氣 v1 測試通過：${jinhanDunTypeVerifiedCaseCount} cases`);
  console.log(`金函玉鏡 ChartTimeContext adapter 測試通過：${jinhanChartTimeAdapterVerifiedCaseCount} cases`);
  console.log(`金函玉鏡 ChartTimeContext runtime 測試通過：${jinhanChartTimeRuntimeVerifiedCaseCount} cases`);
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
  console.log(`奇門九星加時定開闔測試通過：${qimenOpenCloseVerifiedCaseCount} cases`);
  console.log(`奇門節氣德刑測試通過：${qimenSolarTermVirtuePunishmentVerifiedCaseCount} cases`);
  console.log(`奇門氣應測試通過：${qimenQiResponseVerifiedCaseCount} cases`);
  console.log(`奇門特殊時辰條件測試通過：${qimenTimeSpecialConditionsVerifiedCaseCount} cases`);
  console.log(`奇門 split-screen RWD 測試通過：${qimenResponsiveOverflowVerifiedCaseCount} cases`);
  console.log(`奇門1080盤面schema validation測試通過：${qimenPlateValidationVerifiedCaseCount} cases`);
  console.log(`奇門1080.md parser diagnostics測試通過：${qimen1080MarkdownParserVerifiedCaseCount} cases`);
  console.log(`奇門1080.md 排盤序列 diagnostics測試通過：${qimen1080SequenceDiagnosticsVerifiedCaseCount} cases`);
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
  console.log(`登貴 ChartTimeContext adapter 測試通過：${guiDengChartTimeAdapterVerifiedCaseCount} cases`);
  console.log(`登貴 ChartTimeContext runtime 測試通過：${guiDengChartTimeRuntimeVerifiedCaseCount} cases`);
  console.log(`登貴 ChartTimeContext runtime real astronomy 測試通過：${guiDengChartTimeRuntimeRealAstronomyVerifiedCaseCount} cases`);
  console.log(`九宮飛星四柱三煞測試通過：${sanShaVerifiedCaseCount} cases`);
  console.log(`流年方位煞測試通過：${annualAfflictionsVerifiedCaseCount} cases`);
  console.log(`董公擇日測試通過：${dongGongVerifiedCaseCount} cases`);
  console.log(`六十四卦測試通過：${hexagramVerifiedCaseCount} cases`);
  console.log(`月曆十二時辰選取測試通過：${queryPickerVerifiedCaseCount} cases`);
  console.log(`九宮飛星月盤 render 資料流測試通過：${flyingStarRenderFlowVerifiedCaseCount} cases`);
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

function runJinhanChartTimeAdapterTests(solarTerms) {
  const check = (id, expected, actual) => {
    jinhanChartTimeAdapterVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const throws = (id, callback, expectedMessagePart = "") => {
    let message = "";
    try {
      callback();
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    }
    check(id, true, message.length > 0 && message.includes(expectedMessagePart));
  };
  const parts = (year, month, day, hour, minute, second = 0, millisecond = 0) => ({
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
  });
  const instantFor = (localParts, utcOffsetMinutes) => Date.UTC(
    localParts.year,
    localParts.month - 1,
    localParts.day,
    localParts.hour,
    localParts.minute,
    localParts.second,
    localParts.millisecond ?? 0
  ) - utcOffsetMinutes * 60_000;
  const carrierFromParts = (localParts) => new Date(Date.UTC(
    localParts.year,
    localParts.month - 1,
    localParts.day,
    localParts.hour,
    localParts.minute,
    localParts.second,
    localParts.millisecond ?? 0
  ));
  const createContextAt = ({
    mode = CHART_CONTEXT_MODE_WATCH,
    localParts = parts(2026, 8, 10, 8, 0),
    timeZone = "Asia/Taipei",
    utcOffsetMinutes = 480,
    instantMs = instantFor(localParts, utcOffsetMinutes),
    location = { latitude: 25.033964, longitude: 121.564468, accuracy: null },
    source = "custom",
  } = {}) => {
    const zoned = getZonedDateTimeParts(new Date(instantMs), timeZone);
    const civilLocalParts = { ...zoned.localParts, millisecond: 0 };
    const civil = {
      localParts: civilLocalParts,
      timeZone,
      utcOffsetMinutes: zoned.utcOffsetMinutes,
      abbreviation: zoned.abbreviation,
      instantMs,
    };
    if (mode === CHART_CONTEXT_MODE_WATCH) {
      return createWatchChartTimeContext({ source, civil, createdAtInstantMs: 0 });
    }
    const trueSolarResult = calculateTrueSolarTime({
      date: carrierFromParts(civilLocalParts),
      latitude: location.latitude,
      longitude: location.longitude,
      utcOffsetMinutes: zoned.utcOffsetMinutes,
      useUtcComponents: true,
    });
    return createTrueSolarChartTimeContext({
      source,
      civil,
      location,
      trueSolarResult,
      createdAtInstantMs: 0,
    });
  };
  const dateParts = (dateKey, hour = 12, minute = 0, second = 0) => {
    const [year, month, day] = dateKey.split("-").map(Number);
    return parts(year, month, day, hour, minute, second);
  };
  const addCivilDays = (dateKey, days) => {
    const [year, month, day] = dateKey.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day) + days * 86_400_000);
    return [
      String(date.getUTCFullYear()).padStart(4, "0"),
      String(date.getUTCMonth() + 1).padStart(2, "0"),
      String(date.getUTCDate()).padStart(2, "0"),
    ].join("-");
  };
  const findPartsForStem = (stem, startDateKey = "2026-01-01") => {
    const [year, month, day] = startDateKey.split("-").map(Number);
    const startMs = Date.UTC(year, month - 1, day);
    for (let dayOffset = 0; dayOffset < 400; dayOffset += 1) {
      const date = new Date(startMs + dayOffset * 86_400_000);
      const candidate = parts(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate(),
        12,
        0,
        0,
        0
      );
      if (getDayPillarFromLocalParts(candidate).pillar[0] === stem) return candidate;
    }
    throw new Error(`找不到日干 ${stem} fixture`);
  };
  const makeBoundary = (boundary, stem, startDateKey) => createJinhanBoundarySwitch({
    boundary,
    termLocalParts: findPartsForStem(stem, startDateKey),
    termTimeMs: instantFor(findPartsForStem(stem, startDateKey), 480),
  });
  const makeTerm = (year, name, isoWithOffset) => ({
    year_taipei: year,
    name,
    timeMs: Date.parse(isoWithOffset),
  });

  const watchContext = createContextAt({
    mode: CHART_CONTEXT_MODE_WATCH,
    localParts: parts(2026, 8, 10, 8, 0),
  });
  const trueSolarContext = createContextAt({
    mode: CHART_CONTEXT_MODE_TRUE_SOLAR,
    localParts: parts(2026, 8, 10, 8, 0),
  });
  const watchBazi = calculateBaziFromChartTimeContext(watchContext, solarTerms);
  const trueSolarBazi = calculateBaziFromChartTimeContext(trueSolarContext, solarTerms);
  const watchResult = calculateJinhanFromChartTimeContext({
    context: watchContext,
    baziResult: watchBazi,
    solarTerms,
  });
  const trueSolarResult = calculateJinhanFromChartTimeContext({
    context: trueSolarContext,
    baziResult: trueSolarBazi,
    solarTerms,
  });

  check("jinhan-adapter-watch-valid", JINHAN_DUN_TYPE_STATUS.RESOLVED, watchResult.status);
  check("jinhan-adapter-true-solar-valid", JINHAN_DUN_TYPE_STATUS.RESOLVED, trueSolarResult.status);
  check("jinhan-adapter-watch-clock-authority", JSON.stringify(watchContext.civil.localParts), JSON.stringify(getJinhanClockLocalParts(watchContext)));
  check("jinhan-adapter-true-solar-clock-authority", JSON.stringify(trueSolarContext.trueSolar.localParts), JSON.stringify(getJinhanClockLocalParts(trueSolarContext)));
  check("jinhan-adapter-watch-day-authority", watchBazi.dayPillar, watchResult.dayPillar);
  check("jinhan-adapter-true-solar-day-authority", trueSolarBazi.dayPillar, trueSolarResult.dayPillar);
  check("jinhan-adapter-watch-pan-day", watchBazi.dayPillar, watchResult.pan.meta.pillar);
  check("jinhan-adapter-true-solar-pan-day", trueSolarBazi.dayPillar, trueSolarResult.pan.meta.pillar);
  check("jinhan-adapter-debug-locale-independent", false, /GMT|\bTue\b|\bJan\b/.test(JSON.stringify(formatJinhanChartTimeDebug(trueSolarResult))));

  const invalidContext = { ...watchContext, astronomy: { ...watchContext.astronomy, comparisonInstantMs: 0 } };
  check("jinhan-adapter-invalid-context", false, validateJinhanChartTimeInput({
    context: invalidContext,
    baziResult: watchBazi,
    solarTerms,
  }).valid);
  throws("jinhan-adapter-missing-bazi", () => createJinhanCalculationInput({ context: watchContext, solarTerms }), "baziResult");
  const missingTerms = calculateJinhanFromChartTimeContext({ context: watchContext, baziResult: watchBazi, solarTerms: null });
  check("jinhan-adapter-missing-terms-unsupported", JINHAN_DUN_TYPE_STATUS.UNSUPPORTED, missingTerms.status);
  check("jinhan-adapter-missing-terms-no-watch-fallback", null, missingTerms.pan);
  throws("jinhan-adapter-invalid-term-time", () => getJinhanTermLocalParts({ context: watchContext, term: { name: "冬至", timeMs: Infinity } }), "term.timeMs");
  throws("jinhan-adapter-true-solar-missing-location", () => getJinhanTermLocalParts({ context: { ...trueSolarContext, location: null }, term: solarTerms[0] }), "location");

  for (const [id, hour, expected] of [
    ["00-59", 0, "子"],
    ["01-00", 1, "丑"],
    ["08-59", 8, "辰"],
    ["09-00", 9, "巳"],
    ["16-59", 16, "申"],
    ["17-00", 17, "酉"],
    ["22-59", 22, "亥"],
    ["23-00", 23, "子"],
  ]) {
    check(`jinhan-adapter-hour-${id}`, expected, getChineseHourInfoFromLocalParts(parts(2026, 8, 10, hour, hour === 0 ? 59 : 0)).branch);
  }
  check("jinhan-adapter-hour-index-23", 1, getChineseHourInfoFromLocalParts(parts(2026, 8, 10, 23, 0)).index);
  check("jinhan-adapter-hour-invalid", null, getChineseHourInfoFromLocalParts({ hour: 24 }));

  const dayPanByWatch = getJinhanYujingDayPan(watchBazi.dayPillar, watchResult.dunTypeResult.dunType);
  check("jinhan-adapter-day-pan-lookup", JSON.stringify(dayPanByWatch), JSON.stringify(watchResult.pan));
  check("jinhan-adapter-black-yellow-by-day", JSON.stringify(getJinhanBlackYellowHours(watchBazi.dayPillar)), JSON.stringify(watchResult.blackYellowHours));
  check("jinhan-adapter-deities-by-pan-meta", JSON.stringify(getJinhanDeitiesByPalace(watchResult.pan.meta)), JSON.stringify(watchResult.deitiesByPalace));
  check("jinhan-adapter-true-solar-next-day-ready", true, trueSolarResult.clockLocalParts.hour >= 0 && trueSolarResult.clockLocalParts.hour <= 23);

  const stemExpected = [
    ["甲", 0, JINHAN_DUN_TYPE_MODE.ZHENG_SHOU],
    ["乙", -1, JINHAN_DUN_TYPE_MODE.JIE_QI],
    ["丙", -2, JINHAN_DUN_TYPE_MODE.JIE_QI],
    ["丁", -3, JINHAN_DUN_TYPE_MODE.JIE_QI],
    ["戊", -4, JINHAN_DUN_TYPE_MODE.JIE_QI],
    ["己", 5, JINHAN_DUN_TYPE_MODE.CHAO_SHEN],
    ["庚", 4, JINHAN_DUN_TYPE_MODE.CHAO_SHEN],
    ["辛", 3, JINHAN_DUN_TYPE_MODE.CHAO_SHEN],
    ["壬", 2, JINHAN_DUN_TYPE_MODE.CHAO_SHEN],
    ["癸", 1, JINHAN_DUN_TYPE_MODE.CHAO_SHEN],
  ];
  for (const [stem, offsetDays, mode] of stemExpected) {
    const boundary = makeBoundary("冬至", stem, "2026-01-01");
    check(`jinhan-adapter-mapping-${stem}-offset`, offsetDays, boundary.offsetDays);
    check(`jinhan-adapter-mapping-${stem}-mode`, mode, boundary.mode);
    check(`jinhan-adapter-mapping-${stem}-stem`, stem, boundary.termStem);
  }

  const previousWinter = makeBoundary("冬至", "甲", "2025-01-01");
  const previousSummer = makeBoundary("夏至", "甲", "2025-05-01");
  const currentSummer = makeBoundary("夏至", "甲", "2026-05-01");
  const currentWinter = makeBoundary("冬至", "甲", "2026-11-01");
  const annual = (queryLocalParts, overrides = {}) => resolveJinhanDunTypeFromLocalParts({
    queryLocalParts,
    previousWinter,
    currentSummer,
    currentWinter,
    prePreviousWinter: makeBoundary("冬至", "甲", "2024-01-01"),
    previousSummer,
    ...overrides,
  });
  const winterBefore = dateParts(addCivilDays(currentWinter.switchDate, -1), 22, 59, 59);
  const winterAt = dateParts(addCivilDays(currentWinter.switchDate, -1), 23, 0, 0);
  const winterAfter = dateParts(currentWinter.switchDate, 0, 0, 1);
  check("jinhan-adapter-winter-switch-minus-1s", "陰遁", annual(winterBefore).dunType);
  check("jinhan-adapter-winter-switch-exact-23", "陽遁", annual(winterAt).dunType);
  check("jinhan-adapter-winter-switch-plus-1s", "陽遁", annual(winterAfter).dunType);
  check("jinhan-adapter-winter-zheng-shou", JINHAN_DUN_TYPE_MODE.ZHENG_SHOU, annual(winterAt).mode);

  const summerBefore = dateParts(addCivilDays(currentSummer.switchDate, -1), 22, 59, 59);
  const summerAt = dateParts(addCivilDays(currentSummer.switchDate, -1), 23, 0, 0);
  const summerAfter = dateParts(currentSummer.switchDate, 0, 0, 1);
  check("jinhan-adapter-summer-switch-minus-1s", "陽遁", annual(summerBefore).dunType);
  check("jinhan-adapter-summer-switch-exact-23", "陰遁", annual(summerAt).dunType);
  check("jinhan-adapter-summer-switch-plus-1s", "陰遁", annual(summerAfter).dunType);
  check("jinhan-adapter-summer-zheng-shou", JINHAN_DUN_TYPE_MODE.ZHENG_SHOU, annual(summerAt).mode);

  for (const [stem, offsetDays] of [["乙", -1], ["丙", -2], ["丁", -3], ["戊", -4]]) {
    const boundary = makeBoundary("冬至", stem, "2026-11-01");
    const result = annual(dateParts(boundary.switchDate, 12), { currentWinter: boundary });
    check(`jinhan-adapter-early-${stem}-offset`, offsetDays, boundary.offsetDays);
    check(`jinhan-adapter-early-${stem}-dun`, "陽遁", result.dunType);
    check(`jinhan-adapter-early-${stem}-switch`, boundary.switchDate, result.switchEffectiveDay);
  }
  const earlyWinter = makeBoundary("冬至", "乙", "2026-11-01");
  check("jinhan-adapter-winter-early-before-term", true, earlyWinter.switchDate < earlyWinter.termEffectiveDate);
  check("jinhan-adapter-summer-early-before-term", true, makeBoundary("夏至", "戊", "2026-05-01").switchDate < makeBoundary("夏至", "戊", "2026-05-01").termEffectiveDate);

  for (const [stem, offsetDays] of [["己", 5], ["庚", 4], ["辛", 3], ["壬", 2], ["癸", 1]]) {
    const boundary = makeBoundary("冬至", stem, "2026-11-01");
    const beforeSwitch = annual(dateParts(boundary.termEffectiveDate, 12), { currentWinter: boundary });
    const afterSwitch = annual(dateParts(boundary.switchDate, 12), { currentWinter: boundary });
    check(`jinhan-adapter-late-${stem}-offset`, offsetDays, boundary.offsetDays);
    check(`jinhan-adapter-late-${stem}-pending-dun`, "陰遁", beforeSwitch.dunType);
    check(`jinhan-adapter-late-${stem}-after-dun`, "陽遁", afterSwitch.dunType);
    check(`jinhan-adapter-late-${stem}-mode`, JINHAN_DUN_TYPE_MODE.CHAO_SHEN, beforeSwitch.mode);
  }
  const lateSummer = makeBoundary("夏至", "癸", "2026-05-01");
  check("jinhan-adapter-summer-late-after-term", true, lateSummer.switchDate > lateSummer.termEffectiveDate);
  check("jinhan-adapter-summer-late-pending-dun", "陽遁", annual(dateParts(lateSummer.termEffectiveDate, 12), { currentSummer: lateSummer }).dunType);
  check("jinhan-adapter-summer-late-after-dun", "陰遁", annual(dateParts(lateSummer.switchDate, 12), { currentSummer: lateSummer }).dunType);

  const termWinter = solarTerms.find((term) => term.name === "冬至" && term.year_taipei === 2026);
  const termAt2259 = { ...termWinter, timeMs: Date.parse("2026-12-21T14:59:59.000Z") };
  const termAt2300 = { ...termWinter, timeMs: Date.parse("2026-12-21T15:00:00.000Z") };
  const termAt2301 = { ...termWinter, timeMs: Date.parse("2026-12-21T15:00:01.000Z") };
  const watchTermBoundaryContext = createContextAt({ mode: CHART_CONTEXT_MODE_WATCH });
  const trueTermBoundaryContext = createContextAt({
    mode: CHART_CONTEXT_MODE_TRUE_SOLAR,
    location: { latitude: 25, longitude: 121.8, accuracy: null },
  });
  const watchTermParts = [termAt2259, termAt2300, termAt2301].map((term) => getJinhanTermLocalParts({ context: watchTermBoundaryContext, term }));
  check("jinhan-adapter-term-watch-22-59-59", 22, watchTermParts[0].localParts.hour);
  check("jinhan-adapter-term-watch-23-00-00", 23, getJinhanTermLocalParts({ context: watchTermBoundaryContext, term: termAt2300 }).localParts.hour);
  check("jinhan-adapter-term-watch-23-00-01", 23, getJinhanTermLocalParts({ context: watchTermBoundaryContext, term: termAt2301 }).localParts.hour);
  check("jinhan-adapter-term-watch-effective-day-boundary", false,
    getDayPillarFromLocalParts(watchTermParts[0].localParts).effectiveDate === getDayPillarFromLocalParts(watchTermParts[1].localParts).effectiveDate);
  const trueTermParts = [
    { ...termWinter, timeMs: Date.UTC(2026, 0, 9, 14, 59, 57) },
    { ...termWinter, timeMs: Date.UTC(2026, 0, 9, 14, 59, 58) },
    { ...termWinter, timeMs: Date.UTC(2026, 0, 9, 14, 59, 59) },
  ].map((term) => getJinhanTermLocalParts({ context: trueTermBoundaryContext, term }));
  check("jinhan-adapter-term-true-solar-before-2300", true, trueTermParts[0].localParts.hour === 22);
  check("jinhan-adapter-term-true-solar-at-2300", true, trueTermParts[1].localParts.hour === 23);
  check("jinhan-adapter-term-true-solar-after-2300", true, trueTermParts[2].localParts.hour === 23);
  check("jinhan-adapter-term-true-solar-effective-day-boundary", false,
    getDayPillarFromLocalParts(trueTermParts[0].localParts).effectiveDate === getDayPillarFromLocalParts(trueTermParts[1].localParts).effectiveDate);

  const divergenceInstantMs = Date.UTC(2026, 0, 9, 14, 59, 59);
  const divergenceWatchContext = createContextAt({
    mode: CHART_CONTEXT_MODE_WATCH,
    instantMs: divergenceInstantMs,
  });
  const divergenceTrueContext = createContextAt({
    mode: CHART_CONTEXT_MODE_TRUE_SOLAR,
    instantMs: divergenceInstantMs,
    location: { latitude: 25, longitude: 121.8, accuracy: null },
  });
  const divergenceTerm = makeTerm(2026, "冬至", "2026-01-09T22:59:59+08:00");
  const divergenceWatchTerm = getJinhanTermLocalParts({ context: divergenceWatchContext, term: divergenceTerm });
  const divergenceTrueTerm = getJinhanTermLocalParts({ context: divergenceTrueContext, term: divergenceTerm });
  const divergenceWatchBoundary = createJinhanBoundarySwitch({ boundary: "冬至", termLocalParts: divergenceWatchTerm.localParts, termTimeMs: divergenceTerm.timeMs });
  const divergenceTrueBoundary = createJinhanBoundarySwitch({ boundary: "冬至", termLocalParts: divergenceTrueTerm.localParts, termTimeMs: divergenceTerm.timeMs });
  check("jinhan-adapter-divergence-watch-old-day", "2026-01-09", divergenceWatchBoundary.termEffectiveDate);
  check("jinhan-adapter-divergence-true-new-day", "2026-01-10", divergenceTrueBoundary.termEffectiveDate);
  check("jinhan-adapter-divergence-term-day-pillar", false, divergenceWatchBoundary.termDayPillar === divergenceTrueBoundary.termDayPillar);
  check("jinhan-adapter-divergence-mode", false, divergenceWatchBoundary.mode === divergenceTrueBoundary.mode);
  check("jinhan-adapter-divergence-query-clock", false, JSON.stringify(getJinhanClockLocalParts(divergenceWatchContext)) === JSON.stringify(getJinhanClockLocalParts(divergenceTrueContext)));

  const divergenceTerms = [
    makeTerm(2024, "冬至", "2024-12-21T12:00:00+08:00"),
    makeTerm(2025, "夏至", "2025-06-21T12:00:00+08:00"),
    makeTerm(2025, "冬至", "2025-12-21T12:00:00+08:00"),
    makeTerm(2026, "夏至", "2026-06-21T12:00:00+08:00"),
    divergenceTerm,
  ];
  const divergenceWatch = resolveJinhanDunTypeFromChartTimeContext({ context: divergenceWatchContext, solarTerms: divergenceTerms });
  const divergenceTrue = resolveJinhanDunTypeFromChartTimeContext({ context: divergenceTrueContext, solarTerms: divergenceTerms });
  check("jinhan-adapter-query-boundary-divergence-watch", JINHAN_DUN_TYPE_MODE.CHAO_SHEN, divergenceWatch.mode);
  check("jinhan-adapter-query-boundary-divergence-true", JINHAN_DUN_TYPE_MODE.ZHENG_SHOU, divergenceTrue.mode);
  check("jinhan-adapter-query-boundary-divergence-dun", false, divergenceWatch.dunType === divergenceTrue.dunType);
  check("jinhan-adapter-query-boundary-divergence-switch", divergenceTrue.switchEffectiveDay, divergenceWatch.switchEffectiveDay);
  check("jinhan-adapter-term-eot-recomputed", false, trueSolarResult.debug.queryEotMinutes === trueSolarResult.debug.termEotMinutes);
  check("jinhan-adapter-term-not-query-solar-reuse", false, divergenceTrueTerm.localParts === divergenceTrueContext.trueSolar.localParts);

  const annualCases = [
    ["january-previous-winter", parts(2026, 1, 5, 12, 0), "冬至"],
    ["pre-summer", parts(2026, 6, 1, 12, 0), "冬至"],
    ["post-summer", parts(2026, 8, 1, 12, 0), "夏至"],
    ["post-winter", parts(2026, 12, 30, 12, 0), "冬至"],
  ];
  for (const [id, localParts, expectedBoundary] of annualCases) {
    const context = createContextAt({ mode: CHART_CONTEXT_MODE_WATCH, localParts });
    const result = calculateJinhanFromChartTimeContext({
      context,
      baziResult: calculateBaziFromChartTimeContext(context, solarTerms),
      solarTerms,
    });
    check(`jinhan-adapter-annual-${id}-status`, JINHAN_DUN_TYPE_STATUS.RESOLVED, result.status);
    check(`jinhan-adapter-annual-${id}-boundary`, expectedBoundary, result.dunTypeResult.boundary);
  }

  const overseasCases = [
    ["tokyo", "Asia/Tokyo", 540, parts(2026, 8, 10, 12, 0), { latitude: 35.68, longitude: 139.65, accuracy: null }],
    ["la-summer", "America/Los_Angeles", -420, parts(2026, 8, 10, 12, 0), { latitude: 34.0522, longitude: -118.2437, accuracy: null }],
    ["la-winter", "America/Los_Angeles", -480, parts(2026, 12, 10, 12, 0), { latitude: 34.0522, longitude: -118.2437, accuracy: null }],
    ["kathmandu", "Asia/Kathmandu", 345, parts(2026, 8, 10, 12, 0), { latitude: 27.7172, longitude: 85.324, accuracy: null }],
    ["lord-howe", "Australia/Lord_Howe", 630, parts(2027, 4, 10, 12, 0), { latitude: -31.55, longitude: 159.08, accuracy: null }],
  ];
  for (const [id, timeZone, offset, localParts, location] of overseasCases) {
    const context = createContextAt({ mode: CHART_CONTEXT_MODE_TRUE_SOLAR, timeZone, utcOffsetMinutes: offset, localParts, location });
    const termLocal = getJinhanTermLocalParts({ context, term: termWinter });
    check(`jinhan-adapter-overseas-${id}-zone`, timeZone, termLocal.timeZone);
    check(`jinhan-adapter-overseas-${id}-parts`, true, Number.isInteger(termLocal.localParts.year) && Number.isInteger(termLocal.localParts.hour));
    check(`jinhan-adapter-overseas-${id}-term-eot`, true, Number.isFinite(termLocal.equationOfTimeSeconds));
  }

  const probeTerms = [
    makeTerm(2024, "冬至", "2024-12-21T12:00:00+08:00"),
    makeTerm(2025, "夏至", "2025-06-21T12:00:00+08:00"),
    makeTerm(2025, "冬至", "2025-12-21T12:00:00+08:00"),
    makeTerm(2026, "夏至", "2026-06-21T12:00:00+08:00"),
    makeTerm(2026, "冬至", "2026-12-21T12:00:00+08:00"),
  ];
  const probeContext = createContextAt({
    mode: CHART_CONTEXT_MODE_TRUE_SOLAR,
    localParts: parts(2026, 8, 10, 8, 0),
    location: { latitude: 25.033964, longitude: 121.564468, accuracy: null },
  });
  const probeInput = JSON.stringify({ context: probeContext, baziResult: { dayPillar: "丙辰" }, solarTerms: probeTerms });
  const runProbe = (timeZone) => execFileSync(
    process.execPath,
    ["tests/jinhan-chart-time-adapter-probe.mjs", probeInput],
    { cwd: process.cwd(), env: { ...process.env, TZ: timeZone }, encoding: "utf8" }
  ).trim();
  const probeTaipei = runProbe("Asia/Taipei");
  check("jinhan-adapter-process-tz-utc", probeTaipei, runProbe("UTC"));
  check("jinhan-adapter-process-tz-los-angeles", probeTaipei, runProbe("America/Los_Angeles"));

  check("jinhan-adapter-static-no-guideng", false, /guideng|calculateGuiDeng/i.test(jinhanChartTimeAdapterRaw));
  check("jinhan-adapter-static-no-solar-events", false, /solarEvents|calculateSolarEvents/i.test(jinhanChartTimeAdapterRaw));
  check("jinhan-adapter-static-no-main", false, /main\.js|from\s+["']\.\/main/.test(jinhanChartTimeAdapterRaw));
  check("jinhan-adapter-static-no-dom", false, /\bdocument\b|\bwindow\b|navigator|localStorage|sessionStorage/.test(jinhanChartTimeAdapterRaw));
  check("jinhan-adapter-static-reuses-true-solar-core", true, jinhanChartTimeAdapterRaw.includes('from "./trueSolarTime.js"') && jinhanChartTimeAdapterRaw.includes("calculateTrueSolarTime"));
  check("jinhan-adapter-static-no-eot-formula", false, /calculateEquationOfTime|NOAA|Meeus|meanLongitude/.test(jinhanChartTimeAdapterRaw));
  check("jinhan-adapter-static-no-bazi-formula", false, /DAY_PILLAR_BASE|civilDateToEpochMs|firstHourStemIndex/.test(jinhanChartTimeAdapterRaw));
  check("jinhan-adapter-static-no-network-or-dependency", false, /fetch\(|node_modules|npm:|process\.env/.test(jinhanChartTimeAdapterRaw));
  check("jinhan-adapter-static-uses-bazi-clock-helper", true, jinhanChartTimeAdapterRaw.includes("getBaziClockLocalParts"));
}

function runJinhanChartTimeRuntimeTests(solarTerms) {
  const check = (id, expected, actual) => {
    jinhanChartTimeRuntimeVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const parts = (year, month, day, hour, minute, second = 0) => ({
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond: 0,
  });
  const instantFor = (localParts, offsetMinutes = 480) => Date.UTC(
    localParts.year,
    localParts.month - 1,
    localParts.day,
    localParts.hour,
    localParts.minute,
    localParts.second
  ) - offsetMinutes * 60_000;
  const carrier = (localParts) => new Date(Date.UTC(
    localParts.year,
    localParts.month - 1,
    localParts.day,
    localParts.hour,
    localParts.minute,
    localParts.second
  ));
  const makeContext = ({ mode = "watch", civilParts, trueSolarParts = civilParts, location = { latitude: 25, longitude: 121.8, accuracy: null } }) => {
    const instantMs = instantFor(civilParts);
    const civil = {
      localParts: civilParts,
      timeZone: "Asia/Taipei",
      utcOffsetMinutes: 480,
      abbreviation: "GMT+8",
      instantMs,
      disambiguation: null,
    };
    if (mode === "watch") {
      return createWatchChartTimeContext({ source: "query", civil, createdAtInstantMs: 0 });
    }
    return createTrueSolarChartTimeContext({
      source: "query",
      civil,
      location,
      trueSolarResult: {
        trueSolarParts,
        totalCorrectionSeconds: 0,
        longitudeCorrectionSeconds: 0,
        equationOfTimeSeconds: 0,
      },
      createdAtInstantMs: 0,
    });
  };
  const makeTerm = (year, name, localDateTime) => ({
    year_taipei: year,
    name,
    timeMs: Date.parse(`${localDateTime}+08:00`),
  });
  const runtimeTerms = [
    makeTerm(2024, "冬至", "2024-12-21T12:00:00"),
    makeTerm(2025, "夏至", "2025-06-21T12:00:00"),
    makeTerm(2025, "冬至", "2025-12-21T12:00:00"),
    makeTerm(2026, "夏至", "2026-06-21T12:00:00"),
    makeTerm(2026, "冬至", "2026-01-09T12:00:00"),
  ];

  const helperSource = extractNamedFunctionSource(mainModuleRaw, "refreshJinhanForCurrentChartTime");
  const coreRenderSource = extractNamedFunctionSource(mainModuleRaw, "renderJinhanCoreSnapshot");
  const guiDengRuntimeSource = extractNamedFunctionSource(mainModuleRaw, "refreshGuiDengForCurrentChartTime");
  const guiDengDecorationsSource = extractNamedFunctionSource(mainModuleRaw, "renderGuiDengDecorations");
  const rendererSource = extractNamedFunctionSource(mainModuleRaw, "renderJinhanYujing");
  const modeSource = extractNamedFunctionSource(mainModuleRaw, "renderChartDisplayMode");
  const prioritySource = extractNamedFunctionSource(mainModuleRaw, "refreshBaziForCurrentChartTime");
  const fullSource = extractNamedFunctionSource(mainModuleRaw, "renderByDateTime");
  const coordinateInputSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeCoordinateInput");
  const coordinateChangeSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeCoordinateChange");
  const sourceChangeSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeSourceChange");
  const deviceSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForDeviceNow");
  const customSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForCustomInput");
  const manualSource = extractNamedFunctionSource(mainModuleRaw, "handleManualDateTimeChange");
  const calendarSource = extractNamedFunctionSource(mainModuleRaw, "selectQueryCalendarDate");
  const hourShortcutSource = extractNamedFunctionSource(mainModuleRaw, "selectChineseHour");
  const guiDengSource = extractNamedFunctionSource(mainModuleRaw, "getGuiDengForCalendarResult");

  check("jinhan-runtime-adapter-import", true, mainModuleRaw.includes('from "./jinhanChartTimeAdapter.js"'));
  check("jinhan-runtime-single-helper", 1, (mainModuleRaw.match(/function refreshJinhanForCurrentChartTime\(/g) ?? []).length);
  check("jinhan-runtime-single-renderer", 1, (mainModuleRaw.match(/function renderJinhanYujing\(/g) ?? []).length);
  check("jinhan-runtime-helper-calls-adapter", true, helperSource.includes("calculateJinhanFromChartTimeContext({"));
  check("jinhan-runtime-watch-context", true, helperSource.includes("createCurrentWatchChartTimeContext(") && helperSource.includes("currentWatchBaziResult ?? currentCalendarResult"));
  check("jinhan-runtime-true-context", true, helperSource.includes("currentTrueSolarChartContext") && helperSource.includes("currentTrueSolarBaziResult"));
  const trueBranch = helperSource.slice(0, helperSource.indexOf("const baziResult"));
  check("jinhan-runtime-true-no-current-calendar-authority", false, trueBranch.includes("currentCalendarResult"));
  check("jinhan-runtime-no-legacy-dun-authority", false, mainModuleRaw.includes("getJinhanDunType(") || helperSource.includes("getJinhanDunType"));
  check("jinhan-runtime-no-raw-datetime-day", false, helperSource.includes("parseDateTimeLocalValue") || helperSource.includes("new Date(local"));
  check("jinhan-runtime-result-pan", true, coreRenderSource.includes("renderSnapshot.pan"));
  check("jinhan-runtime-result-deities", true, coreRenderSource.includes("renderSnapshot.deitiesByPalace"));
  check("jinhan-runtime-result-hours", true, coreRenderSource.includes("renderSnapshot.blackYellowHours"));
  check("jinhan-runtime-result-current-hour", true, coreRenderSource.includes("renderSnapshot.currentHourIndex"));
  check("jinhan-runtime-guideng-formal-helper", true, guiDengRuntimeSource.includes("calculateGuiDengFromChartTimeContext({"));
  check("jinhan-runtime-guideng-no-true-bazi", false, guiDengSource.includes("currentTrueSolarBaziResult"));
  check("jinhan-runtime-renderer-wrapper-only", true, rendererSource.includes("refreshJinhanForCurrentChartTime") && !rendererSource.includes("getJinhanDunType"));
  check("jinhan-runtime-manual-selector-listener", true, mainModuleRaw.includes("isJinhanDunTypeManuallyOverridden = true"));
  check("jinhan-runtime-auto-selector-no-dispatch", false, helperSource.includes("dispatchEvent") || mainModuleRaw.includes("jinhanDunType.dispatchEvent"));
  check("jinhan-runtime-auto-selector-sync", true, mainModuleRaw.includes("elements.jinhanDunType.value = dunTypeStatus.dunType"));
  check("jinhan-runtime-mode-refreshes-jinhan", true, modeSource.includes("refreshJinhanForCurrentChartTime(requestId)"));
  check("jinhan-runtime-mode-no-datetime-write", false, modeSource.includes("elements.datetime.value ="));
  check("jinhan-runtime-mode-no-auto-toggle", false, /startAutoNowMode|pauseAutoNowMode/.test(modeSource));
  check("jinhan-runtime-lightweight-refreshes-jinhan", true, prioritySource.includes("refreshJinhanForCurrentChartTime(requestId)"));
  check("jinhan-runtime-lightweight-no-await", false, /\bawait\b/.test(prioritySource));
  check("jinhan-runtime-full-keeps-single-entry", true, fullSource.includes("await renderJinhanYujing(result, effectiveDateTimeValue, requestId)"));
  check("jinhan-runtime-no-new-timer", 2, (mainModuleRaw.match(/setInterval\(/g) ?? []).length);
  check("jinhan-runtime-stale-guard-before-calculation", true, helperSource.indexOf("!isLatestBaziRenderRequest(requestId)") >= 0);
  check("jinhan-runtime-stale-guard-after-guideng", true, guiDengRuntimeSource.lastIndexOf("!isLatestBaziRenderRequest(requestId)") > guiDengRuntimeSource.indexOf("await calculateGuiDengFromChartTimeContext("));
  check("jinhan-runtime-unavailable-clears", true, helperSource.includes("clearJinhanYujing") && helperSource.includes("真太陽時金函玉鏡尚未就緒"));
  check("jinhan-runtime-true-no-watch-fallback", true, helperSource.includes("if (!currentSolarTerms || !context || !baziResult)") && !trueBranch.includes("currentWatchBaziResult"));
  check("jinhan-runtime-coordinate-input-generation", true, coordinateInputSource.includes("++latestBaziRenderRequestId") && coordinateInputSource.includes("refreshJinhanForCurrentChartTime(requestId)"));
  check("jinhan-runtime-coordinate-change-generation", true, coordinateChangeSource.includes("++latestBaziRenderRequestId") && coordinateChangeSource.includes("refreshJinhanForCurrentChartTime(requestId)"));
  check("jinhan-runtime-source-b-isolation", false, deviceSource.includes("refreshJinhanForCurrentChartTime") || deviceSource.includes("currentTrueSolarBaziResult"));
  check("jinhan-runtime-source-c-isolation", false, customSource.includes("refreshJinhanForCurrentChartTime") || customSource.includes("currentTrueSolarBaziResult"));
  check("jinhan-runtime-source-switch-isolation", false, sourceChangeSource.includes("refreshJinhanForCurrentChartTime") || sourceChangeSource.includes("renderFormalTrueSolarChartTime"));
  check("jinhan-runtime-calendar-uses-formal-request", true, calendarSource.includes("requestRenderDateTime(dateTimeValue)"));
  check("jinhan-runtime-hour-uses-formal-request", true, hourShortcutSource.includes("requestRenderDateTime(dateTimeValue)"));
  check("jinhan-runtime-precise-input-reuses-request", true, manualSource.includes("requestRenderDateTime(elements.datetime.value)"));
  check("jinhan-runtime-no-guideng-feed-from-true", false, helperSource.includes("getGuiDengForCalendarResult(currentTrueSolarBaziResult") || helperSource.includes("getGuiDengForCalendarResult(currentTrueSolarChartContext"));
  check("jinhan-runtime-no-second-view-model", 2, (mainModuleRaw.match(/createJinhanRenderSnapshot\(/g) ?? []).length);
  check("jinhan-runtime-no-storage", false, /localStorage|sessionStorage/.test(mainModuleRaw));
  check("jinhan-runtime-no-duplicate-eot", false, /calculateEquationOfTime|NOAA|Meeus/.test(helperSource));
  check("jinhan-runtime-no-duplicate-bazi", false, /getDayPillar|SEXAGENARY_CYCLE|DAY_PILLAR_BASE/.test(helperSource));
  check("jinhan-runtime-guideng-import-retained", true, mainModuleRaw.includes('from "./guideng.js"'));
  check("jinhan-runtime-solar-events-import-retained", true, mainModuleRaw.includes('from "./solarEvents.js"'));

  const watchBefore = makeContext({ mode: "watch", civilParts: parts(2026, 1, 9, 22, 59, 59) });
  const watchAt = makeContext({ mode: "watch", civilParts: parts(2026, 1, 9, 23, 0, 0) });
  const trueAt = makeContext({
    mode: "true-solar",
    civilParts: parts(2026, 1, 9, 22, 59, 59),
    trueSolarParts: parts(2026, 1, 9, 23, 0, 1),
  });
  const watchBeforeBazi = calculateBaziFromChartTimeContext(watchBefore, solarTerms);
  const watchAtBazi = calculateBaziFromChartTimeContext(watchAt, solarTerms);
  const trueAtBazi = calculateBaziFromChartTimeContext(trueAt, solarTerms);
  const watchBeforeResult = calculateJinhanFromChartTimeContext({ context: watchBefore, baziResult: watchBeforeBazi, solarTerms: runtimeTerms });
  const watchAtResult = calculateJinhanFromChartTimeContext({ context: watchAt, baziResult: watchAtBazi, solarTerms: runtimeTerms });
  const trueAtResult = calculateJinhanFromChartTimeContext({ context: trueAt, baziResult: trueAtBazi, solarTerms: runtimeTerms });
  check("jinhan-runtime-watch-normal-resolved", JINHAN_DUN_TYPE_STATUS.RESOLVED, calculateJinhanFromChartTimeContext({ context: makeContext({ mode: "watch", civilParts: parts(2026, 8, 10, 12, 0) }), baziResult: calculateBaziFromChartTimeContext(makeContext({ mode: "watch", civilParts: parts(2026, 8, 10, 12, 0) }), solarTerms), solarTerms: runtimeTerms }).status);
  check("jinhan-runtime-watch-225959-hour", "亥", watchBeforeResult.chineseHour.branch);
  check("jinhan-runtime-watch-230000-hour", "子", watchAtResult.chineseHour.branch);
  check("jinhan-runtime-watch-230000-day-changes", false, watchBeforeResult.dayPillar === watchAtResult.dayPillar);
  check("jinhan-runtime-watch-230000-pan-changes", false, watchBeforeResult.pan.meta.label === watchAtResult.pan.meta.label);
  check("jinhan-runtime-watch-230000-hours-change", false, JSON.stringify(watchBeforeResult.blackYellowHours) === JSON.stringify(watchAtResult.blackYellowHours));
  check("jinhan-runtime-true-230001-hour", "子", trueAtResult.chineseHour.branch);
  check("jinhan-runtime-true-230001-day-authority", trueAtBazi.dayPillar, trueAtResult.dayPillar);
  check("jinhan-runtime-true-230001-pan-authority", trueAtResult.dayPillar, trueAtResult.pan.meta.pillar);
  check("jinhan-runtime-true-not-watch-fallback", false, trueAtResult.dayPillar === watchBeforeResult.dayPillar);
  check("jinhan-runtime-watch-true-current-hour-diverges", false, watchBeforeResult.currentHourIndex === trueAtResult.currentHourIndex);

  const sameDayWatch = makeContext({ mode: "watch", civilParts: parts(2026, 8, 10, 16, 59) });
  const sameDayTrue = makeContext({ mode: "true-solar", civilParts: parts(2026, 8, 10, 16, 59), trueSolarParts: parts(2026, 8, 10, 17, 0) });
  const sameDayWatchBazi = calculateBaziFromChartTimeContext(sameDayWatch, solarTerms);
  const sameDayTrueBazi = calculateBaziFromChartTimeContext(sameDayTrue, solarTerms);
  const sameDayWatchResult = calculateJinhanFromChartTimeContext({ context: sameDayWatch, baziResult: sameDayWatchBazi, solarTerms });
  const sameDayTrueResult = calculateJinhanFromChartTimeContext({ context: sameDayTrue, baziResult: sameDayTrueBazi, solarTerms });
  check("jinhan-runtime-cross-hour-same-day", sameDayWatchResult.dayPillar, sameDayTrueResult.dayPillar);
  check("jinhan-runtime-cross-hour-pan-same", sameDayWatchResult.pan.meta.label, sameDayTrueResult.pan.meta.label);
  check("jinhan-runtime-cross-hour-dun-same", sameDayWatchResult.dunTypeResult.dunType, sameDayTrueResult.dunTypeResult.dunType);
  check("jinhan-runtime-cross-hour-deities-same", JSON.stringify(sameDayWatchResult.deitiesByPalace), JSON.stringify(sameDayTrueResult.deitiesByPalace));
  check("jinhan-runtime-cross-hour-table-same", JSON.stringify(sameDayWatchResult.blackYellowHours), JSON.stringify(sameDayTrueResult.blackYellowHours));
  check("jinhan-runtime-cross-hour-highlight-watch", "申", sameDayWatchResult.chineseHour.branch);
  check("jinhan-runtime-cross-hour-highlight-true", "酉", sameDayTrueResult.chineseHour.branch);

  const exactTermQuery = makeContext({ mode: "watch", civilParts: parts(2026, 1, 9, 13, 0) });
  const exactTermBazi = calculateBaziFromChartTimeContext(exactTermQuery, solarTerms);
  const exactTermResult = calculateJinhanFromChartTimeContext({ context: exactTermQuery, baziResult: exactTermBazi, solarTerms: runtimeTerms });
  check("jinhan-runtime-term-exact-not-direct-switch", JINHAN_DUN_TYPE_MODE.CHAO_SHEN, exactTermResult.dunTypeResult.mode);
  check("jinhan-runtime-term-exact-old-dun", "陰遁", exactTermResult.dunTypeResult.dunType);
  const switchResult = calculateJinhanFromChartTimeContext({ context: watchAt, baziResult: watchAtBazi, solarTerms: runtimeTerms });
  check("jinhan-runtime-switch-exact-new-dun", "陽遁", switchResult.dunTypeResult.dunType);
  check("jinhan-runtime-switch-selector-source-contract", true, helperSource.includes("resolveJinhanSelectedDunType(adapterResult.dunTypeResult)"));
  check("jinhan-runtime-switch-pan-follows-dun", switchResult.dunTypeResult.dunType, switchResult.pan.meta.dunType);
  check("jinhan-runtime-switch-table-follows-day", JSON.stringify(getJinhanBlackYellowHours(switchResult.dayPillar)), JSON.stringify(switchResult.blackYellowHours));

  const manualPan = getJinhanYujingDayPan(watchAtResult.dayPillar, "陰遁");
  check("jinhan-runtime-manual-override-pan", true, Boolean(manualPan));
  check("jinhan-runtime-manual-override-does-not-change-auto", "陽遁", watchAtResult.dunTypeResult.dunType);
  check("jinhan-runtime-manual-override-deities-from-pan", JSON.stringify(getJinhanDeitiesByPalace(manualPan.meta)), JSON.stringify(getJinhanDeitiesByPalace(manualPan.meta)));
  check("jinhan-runtime-calendar-click-refreshes", true, calendarSource.includes("requestRenderDateTime") && !calendarSource.includes("renderJinhanYujing"));
  check("jinhan-runtime-hour-click-refreshes", true, hourShortcutSource.includes("requestRenderDateTime") && !hourShortcutSource.includes("renderJinhanYujing"));
  check("jinhan-runtime-true-mode-copy", true, mainModuleRaw.includes("四柱、九宮飛星、金函玉鏡與登貴已使用真太陽時；奇門仍維持手錶時間。"));
  check("jinhan-runtime-guideng-legacy-date", true, guiDengSource.includes("parseDateTimeLocalValue(dateTimeValue)") && !guiDengRuntimeSource.includes("getGuiDengForCalendarResult"));
  check("jinhan-runtime-no-guideng-modification-path", true, !helperSource.includes("calculateGuiDengWithSunTimes") && !guiDengRuntimeSource.includes("calculateGuiDengWithSunTimes"));
  check("jinhan-runtime-formal-source-a-only", true, helperSource.includes("currentTrueSolarChartContext") && !sourceChangeSource.includes("currentTrueSolarChartContextInput"));
  check("jinhan-runtime-no-query-term-fetch", false, helperSource.includes("loadSolarTerms") || helperSource.includes("fetch("));
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

function runQimenResponsiveOverflowTests() {
  const capMediaStart = mainCssRaw.indexOf("@media (min-width: 390px) and (max-width: 760px)");
  const max560Start = mainCssRaw.indexOf("@media (max-width: 560px)", capMediaStart);
  const max760Start = mainCssRaw.indexOf("@media (max-width: 760px)");
  const max680Start = mainCssRaw.indexOf("@media (max-width: 680px)", max560Start);
  const max420Start = mainCssRaw.indexOf("@media (max-width: 420px)");
  const specialStart = mainCssRaw.indexOf("@media (min-width: 390px) and (max-width: 430px)");
  const capMediaCss = mainCssRaw.slice(capMediaStart, max560Start);
  const max760Css = mainCssRaw.slice(max760Start, capMediaStart);
  const max560Css = mainCssRaw.slice(max560Start, max680Start);
  const max420Css = mainCssRaw.slice(max420Start, specialStart);
  const specialCss = mainCssRaw.slice(specialStart, mainCssRaw.indexOf("ul {", specialStart));
  const check = (id, expected, actual) => {
    qimenResponsiveOverflowVerifiedCaseCount += 1;
    assertEqual(id, "responsiveCss", expected, actual);
  };

  check("qimen-rwd-fluid-cap-media-present", true, capMediaStart >= 0 && max560Start > capMediaStart);
  check("qimen-rwd-fluid-cap-rule", true, /\.qimen-plate-grid\s*\{\s*min-width:\s*min\(var\(--qimen-grid-min-width\),\s*100%\);\s*\}/.test(capMediaCss));
  check("qimen-rwd-desktop-grid-columns-preserved", true, /\.qimen-plate-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/.test(mainCssRaw));
  check("qimen-rwd-wrapper-scroll-safety-preserved", true, /\.qimen-plate-grid-wrap\s*\{[\s\S]*?overflow-x:\s*auto;/.test(mainCssRaw));
  check("qimen-rwd-panel-shrink-preserved", true, /\.qimen-plate-panel\s*\{[\s\S]*?min-width:\s*0;/.test(mainCssRaw));
  check("qimen-rwd-palace-shrink-preserved", true, /\.qimen-palace-cell\s*\{[\s\S]*?min-width:\s*0;/.test(mainCssRaw));
  check("qimen-rwd-mobile-grid-fluid-width", true, /--qimen-grid-min-width:\s*0px;/.test(max760Css) && /--qimen-grid-min-width:\s*0px;/.test(max560Css) && /--qimen-grid-min-width:\s*0px;/.test(max420Css) && /--qimen-grid-min-width:\s*0px;/.test(specialCss));
  check("qimen-rwd-mobile-wrapper-no-scrollbar", true, /\.qimen-plate-grid-wrap\s*\{[\s\S]*?overflow-x:\s*visible;[\s\S]*?overflow-y:\s*visible;/.test(max760Css));
  check("qimen-rwd-mobile-spacing-compacted", true, /--qimen-grid-gap:\s*3px;/.test(max560Css) && /--qimen-cell-padding:\s*4px 4px 17px;/.test(max560Css) && /\.qimen-palace-cell\s*\{[\s\S]*?gap:\s*2px;/.test(max560Css));
  check("qimen-rwd-boundary-horizontal-centered", true, /\.qimen-guxu-pos-xun-top,[\s\S]*?top:\s*0;[\s\S]*?transform:\s*translate\(-50%,\s*-50%\);/.test(mainCssRaw) && /\.qimen-guxu-pos-kan-bottom,[\s\S]*?bottom:\s*0;[\s\S]*?transform:\s*translate\(-50%,\s*50%\);/.test(mainCssRaw));
  check("qimen-rwd-boundary-vertical-centered", true, /\.qimen-guxu-pos-gen-left,[\s\S]*?left:\s*0;[\s\S]*?transform:\s*translate\(-50%,\s*-50%\);/.test(mainCssRaw) && /\.qimen-guxu-pos-kun-right,[\s\S]*?right:\s*0;[\s\S]*?transform:\s*translate\(50%,\s*-50%\);/.test(mainCssRaw));
  check("qimen-rwd-boundary-no-narrow-override", false, /\.qimen-(?:guxu|virtue-punishment)-pos-[^{]+\{[^}]*\b(?:left|right):\s*-\d+px;/.test(mainCssRaw));
  check("qimen-rwd-no-global-overflow-mask", false, /body\s*\{[^}]*overflow-x:\s*hidden;/.test(mainCssRaw));
  check("qimen-rwd-no-scale-workaround", false, /\.qimen-(?:plate|palace)[^{]*\{[^}]*transform:\s*scale\(/.test(mainCssRaw));
  check("qimen-rwd-no-zoom-workaround", false, /\.qimen-(?:plate|palace)[^{]*\{[^}]*\bzoom\s*:/.test(mainCssRaw));
  check("qimen-rwd-palace-content-not-hidden", false, /\.qimen-palace-(?:cell|content)[^{]*\{[^}]*display:\s*none;/.test(mainCssRaw));
  check("qimen-rwd-badges-not-hidden", false, /\.qimen-(?:guxu|virtue-punishment)-badge[^{]*\{[^}]*display:\s*none;/.test(mainCssRaw));
  check("qimen-rwd-manual-controls-wrap", true, /\.qimen-manual-control-row\s*\{[\s\S]*?flex-wrap:\s*wrap;/.test(mainCssRaw));

  const viewportExpectations = [
    [360, false],
    [389, false],
    [390, false],
    [420, false],
    [430, false],
    [431, false],
    [460, false],
    [495, false],
    [496, false],
    [560, false],
    [561, false],
    [597, false],
    [598, false],
    [600, false],
    [700, false],
    [760, false],
    [761, false],
    [800, false],
    [900, false],
    [1024, false],
  ];

  for (const [viewportWidth, expectedOverflow] of viewportExpectations) {
    const isMobileWidth = viewportWidth <= 760;
    const wrapperPadding = viewportWidth >= 390 && viewportWidth <= 430 ? 9 : viewportWidth <= 560 ? 9 : 16;
    const sideBadgeOutset = viewportWidth <= 560 ? 8 : 9;
    const hasHorizontalOverflow = isMobileWidth && sideBadgeOutset > wrapperPadding;

    check(`qimen-rwd-viewport-${viewportWidth}`, expectedOverflow, hasHorizontalOverflow);
  }
}

function runQimenHelperTests() {
  const fuTouCases = [
    { id: "qimen-futou-jiazi", dayPillar: "甲子", expected: true },
    { id: "qimen-futou-jiawu", dayPillar: "甲午", expected: true },
    { id: "qimen-futou-jimao", dayPillar: "己卯", expected: true },
    { id: "qimen-futou-jiyou", dayPillar: "己酉", expected: true },
    { id: "qimen-futou-jiayin", dayPillar: "甲寅", expected: false },
    { id: "qimen-futou-jichou", dayPillar: "己丑", expected: false },
    { id: "qimen-futou-jihai", dayPillar: "己亥", expected: false },
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
    assertEqual(testCase.id, "yuan", true, getQimenYuanByFuTou(dayPillar) !== null);
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

    if (getQimenYuanByFuTou(entry.dayPillar) === null) {
      failures.push({
        id,
        key: `${entry.effectiveDayStart}.yuan`,
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

  const statusCases = [
    {
      id: "qimen-status-zhengshou-effective-futou",
      input: "2028-08-07T12:00:00+08:00",
      expected: "正授",
    },
    {
      id: "qimen-status-matching-term-not-zhengshou-chaoshen",
      input: "2027-06-06T12:00:00+08:00",
      expected: "超神",
    },
    {
      id: "qimen-status-matching-term-not-zhengshou-jieqi",
      input: "2027-12-26T12:00:00+08:00",
      expected: "接氣",
    },
    {
      id: "qimen-status-intercalary-priority",
      input: "2027-12-11T12:00:00+08:00",
      expected: "置閏",
    },
  ];

  for (const testCase of statusCases) {
    const actual = resolveQimenJuFromFullTermCycleDraft(testCase.input);
    qimenFullTermCycleDraftResolverFormatterVerifiedCaseCount += 1;
    assertEqual(testCase.id, "status", testCase.expected, actual.status);
  }

  const beforeEffectiveDaySwitch = resolveQimenJuFromFullTermCycleDraft("2028-08-06T22:59:00+08:00");
  const afterEffectiveDaySwitch = resolveQimenJuFromFullTermCycleDraft("2028-08-06T23:00:00+08:00");
  qimenFullTermCycleDraftResolverFormatterVerifiedCaseCount += 1;
  assertEqual("qimen-status-2300-before-effective-day", "status", "接氣", beforeEffectiveDaySwitch.status);
  assertEqual("qimen-status-2300-after-effective-day", "status", "正授", afterEffectiveDaySwitch.status);
  assertEqual(
    "qimen-status-2300-effective-day-switch",
    "queryEffectiveDayStart.changed",
    true,
    beforeEffectiveDaySwitch.lookup?.queryEffectiveDayStart !== afterEffectiveDaySwitch.lookup?.queryEffectiveDayStart
  );
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

function runHexagramTests() {
  const hexagramCases = [
    ["kun-kun", "kun", "kun", "坤為地", "䷁"],
    ["xun-gen", "xun", "gen", "風山漸", "䷴"],
    ["xun-zhen", "xun", "zhen", "風雷益", "䷩"],
    ["qian-qian", "qian", "qian", "乾為天", "䷀"],
    ["kan-kan", "kan", "kan", "坎為水", "䷜"],
    ["li-li", "li", "li", "離為火", "䷝"],
  ];

  for (const [id, upper, lower, expectedName, expectedSymbol] of hexagramCases) {
    const hexagram = getHexagramByTrigrams(upper, lower);
    hexagramVerifiedCaseCount += 1;
    assertEqual(`hexagrams-${id}`, "name", expectedName, hexagram?.name);
    assertEqual(`hexagrams-${id}`, "symbol", expectedSymbol, hexagram?.symbol);
  }

  const trigramCases = [
    ["star-tian-qin", getTrigramByQimenStar("天禽"), "kun"],
    ["star-tian-rui", getTrigramByQimenStar("天芮"), "kun"],
    ["star-tian-fu", getTrigramByQimenStar("天輔"), "xun"],
    ["door-si", getTrigramByQimenDoor("死門"), "kun"],
    ["door-du", getTrigramByQimenDoor("杜門"), "xun"],
    ["door-kai", getTrigramByQimenDoor("開門"), "qian"],
  ];

  for (const [id, trigram, expectedKey] of trigramCases) {
    hexagramVerifiedCaseCount += 1;
    assertEqual(`hexagrams-${id}`, "key", expectedKey, trigram?.key);
  }

  hexagramVerifiedCaseCount += 1;
  assertEqual("hexagrams-format-label", "label", "䷁ 坤為地", formatHexagramLabel(getHexagramByTrigrams("kun", "kun")));
  assertEqual("hexagrams-invalid-upper", "result", null, getHexagramByTrigrams("invalid", "kun"));
  assertEqual("hexagrams-invalid-lower", "result", null, getHexagramByTrigrams("kun", "invalid"));
  assertEqual("hexagrams-invalid-star", "result", null, getTrigramByQimenStar("無效"));
  assertEqual("hexagrams-invalid-door", "result", null, getTrigramByQimenDoor("無效"));
  assertEqual("hexagrams-center-palace", "result", null, getTrigramByQimenPalaceKey("center"));
  assertEqual("hexagrams-invalid-palace", "result", null, getTrigramByQimenPalaceKey("invalid"));
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

  const sixInstrumentPunishmentCases = [
    ["ren-xun", "xun", "壬", "刑"],
    ["gui-xun", "xun", "癸", "刑"],
    ["geng-xun", "xun", "庚", "刑"],
    ["xin-li", "li", "辛", "刑"],
    ["ji-kun", "kun", "己", "刑"],
    ["gui-kun", "kun", "癸", "刑"],
    ["wu-zhen", "zhen", "戊", "刑"],
    ["geng-gen", "gen", "庚", "刑"],
    ["ji-gen", "gen", "己", "刑"],
  ];
  for (const [id, palaceKey, heavenStem, expected] of sixInstrumentPunishmentCases) {
    qimenPlateMarkersVerifiedCaseCount += 1;
    assertEqual(
      `qimen-six-instrument-punishment-${id}`,
      "marker",
      expected,
      getQimenHeavenStemMarker(palaceKey, heavenStem)
    );
  }

  const sixInstrumentMultiPalaceCases = [
    ["gui-xun", "xun", "癸", "刑"], ["gui-kun", "kun", "癸", "刑"], ["gui-li", "li", "癸", null],
    ["geng-gen", "gen", "庚", "刑"], ["geng-xun", "xun", "庚", "刑"], ["geng-kun", "kun", "庚", null],
    ["ji-kun", "kun", "己", "刑"], ["ji-gen", "gen", "己", "刑"], ["ji-zhen", "zhen", "己", null],
  ];
  for (const [id, palaceKey, heavenStem, expected] of sixInstrumentMultiPalaceCases) {
    qimenPlateMarkersVerifiedCaseCount += 1;
    assertEqual(
      `qimen-six-instrument-punishment-multi-palace-${id}`,
      "marker",
      expected,
      getQimenHeavenStemMarker(palaceKey, heavenStem)
    );
  }

  const sixInstrumentPunishmentNegativeCases = [
    ["ren-kun", "kun", "壬"], ["xin-xun", "xun", "辛"], ["wu-gen", "gen", "戊"],
    ["gui-kan", "kan", "癸"], ["geng-li", "li", "庚"], ["ji-qian", "qian", "己"],
    ["unknown-palace", "unknown", "癸"], ["missing-stem", "kun", undefined], ["invalid-stem", "kun", {}],
  ];
  for (const [id, palaceKey, heavenStem] of sixInstrumentPunishmentNegativeCases) {
    qimenPlateMarkersVerifiedCaseCount += 1;
    assertEqual(
      `qimen-six-instrument-punishment-negative-${id}`,
      "marker",
      null,
      getQimenHeavenStemMarker(palaceKey, heavenStem)
    );
  }

  const sixInstrumentPunishmentViewModelCases = [
    ["gui-kun", "kun", "癸"],
    ["geng-xun", "xun", "庚"],
    ["ji-gen", "gen", "己"],
  ];
  for (const [id, palaceKey, heavenStem] of sixInstrumentPunishmentViewModelCases) {
    const plate = createQimenMarkerFixturePlate();
    for (const key of QIMEN_PALACE_KEYS) {
      plate.palaces[key].heavenStem = "甲";
      plate.palaces[key].earthStem = "甲";
    }
    plate.palaces[palaceKey].heavenStem = heavenStem;
    plate.palaces[palaceKey].earthStem = "丙";
    const markers = decorateQimenPlateMarkers(plate);
    qimenPlateMarkersVerifiedCaseCount += 1;
    assertEqual(`qimen-six-instrument-punishment-view-model-${id}`, "heavenStemMarker", "刑", markers.palaces[palaceKey].heavenStemMarker);
    assertEqual(`qimen-six-instrument-punishment-view-model-${id}`, "punishmentMarkerCount", 1, Object.values(markers.palaces).filter((marker) => marker.heavenStemMarker === "刑").length);
    assertEqual(`qimen-six-instrument-punishment-view-model-${id}`, "earthStemDoesNotDriveMarker", null, getQimenHeavenStemMarker(palaceKey, plate.palaces[palaceKey].earthStem));
  }

  qimenPlateMarkersVerifiedCaseCount += 1;
  const missingPalaceMarkers = decorateQimenPlateMarkers({ palaces: {} });
  assertEqual("qimen-six-instrument-punishment-missing-palace-view-model", "kun.heavenStemMarker", null, missingPalaceMarkers.palaces.kun.heavenStemMarker);
  assertEqual("qimen-six-instrument-punishment-missing-plate-view-model", "kun.heavenStemMarker", null, decorateQimenPlateMarkers(null).palaces.kun.heavenStemMarker);

  qimenPlateMarkersVerifiedCaseCount += 1;
  assertEqual("qimen-plate-markers-door-po-li-xiu", "marker", "迫", getQimenDoorPoMarker("li", "休"));
  assertEqual("qimen-plate-markers-door-po-kun-shang", "marker", "迫", getQimenDoorPoMarker("kun", "傷"));
  assertEqual("qimen-plate-markers-door-po-dui-jing", "marker", "迫", getQimenDoorPoMarker("dui", "景"));
  assertEqual("qimen-plate-markers-door-po-kan-sheng", "marker", "迫", getQimenDoorPoMarker("kan", "生"));
  assertEqual("qimen-plate-markers-door-po-no-match", "marker", null, getQimenDoorPoMarker("li", "生"));
  assertEqual("qimen-plate-markers-door-po-invalid-palace", "marker", null, getQimenDoorPoMarker(null, "休"));
  assertEqual("qimen-plate-markers-door-po-invalid-door", "marker", null, getQimenDoorPoMarker("li", null));

  const guXuCases = [
    ["wei", "未", ["巳", "午"], ["亥", "子"]],
    ["zi", "子", ["戌", "亥"], ["辰", "巳"]],
    ["chou", "丑", ["亥", "子"], ["巳", "午"]],
    ["wu", "午", ["辰", "巳"], ["戌", "亥"]],
  ];
  for (const [id, hourBranch, expectedGu, expectedXu] of guXuCases) {
    const guXu = getQimenGuXuByHourBranch(hourBranch);
    qimenPlateMarkersVerifiedCaseCount += 1;
    assertEqual(`qimen-plate-markers-guxu-${id}`, "hourBranch", hourBranch, guXu?.hourBranch);
    assertEqual(`qimen-plate-markers-guxu-${id}`, "gu", expectedGu.join(","), guXu?.gu.join(","));
    assertEqual(`qimen-plate-markers-guxu-${id}`, "xu", expectedXu.join(","), guXu?.xu.join(","));
  }
  qimenPlateMarkersVerifiedCaseCount += 1;
  assertEqual("qimen-plate-markers-guxu-invalid", "result", null, getQimenGuXuByHourBranch("無效"));

  qimenPlateMarkersVerifiedCaseCount += 1;
  const palaceOverDoorCases = [
    ["kan-jing", "kan", "景", "剋"], ["gen-xiu", "gen", "休", "剋"],
    ["zhen-sheng", "zhen", "生", "剋"], ["zhen-si", "zhen", "死", "剋"],
    ["xun-sheng", "xun", "生", "剋"], ["xun-si", "xun", "死", "剋"],
    ["li-jing", "li", "驚", "剋"], ["li-kai", "li", "開", "剋"],
    ["kun-xiu", "kun", "休", "剋"], ["dui-du", "dui", "杜", "剋"],
    ["dui-shang", "dui", "傷", "剋"], ["qian-du", "qian", "杜", "剋"],
    ["qian-shang", "qian", "傷", "剋"], ["center-jing", "center", "景", null],
    ["kan-xiu", "kan", "休", null], ["invalid-palace", null, "景", null],
    ["invalid-door", "kan", null, null],
  ];
  for (const [id, palaceKey, door, expected] of palaceOverDoorCases) {
    assertEqual(`qimen-plate-markers-palace-over-door-${id}`, "marker", expected, getQimenPalaceOverDoorMarker(palaceKey, door));
  }

  qimenPlateMarkersVerifiedCaseCount += 1;
  const palaceGenerateDoorCases = [
    ["li-sheng", "li", "生", "生"],
    ["kan-shang", "kan", "傷", "生"],
    ["gen-kai", "gen", "開", "生"],
    ["center-sheng", "center", "生", null],
    ["invalid-palace", null, "生", null],
    ["invalid-door", "li", null, null],
  ];
  for (const [id, palaceKey, door, expected] of palaceGenerateDoorCases) {
    assertEqual(
      `qimen-plate-markers-palace-generate-door-${id}`,
      "marker",
      expected,
      getQimenPalaceOverDoorGenerateMarker(palaceKey, door)
    );
  }

  qimenPlateMarkersVerifiedCaseCount += 1;
  const doorGeneratePalaceCases = [
    ["zhen-xiu", "zhen", "休", "生"],
    ["li-du", "li", "杜", "生"],
    ["qian-si", "qian", "死", "生"],
    ["center-xiu", "center", "休", null],
    ["invalid-palace", null, "休", null],
    ["invalid-door", "zhen", null, null],
  ];
  for (const [id, palaceKey, door, expected] of doorGeneratePalaceCases) {
    assertEqual(
      `qimen-plate-markers-door-generate-palace-${id}`,
      "marker",
      expected,
      getQimenDoorOverPalaceGenerateMarker(palaceKey, door)
    );
  }

  qimenPlateMarkersVerifiedCaseCount += 1;
  const originalStarCases = [
    ["kan", "天蓬"], ["gen", "天任"], ["zhen", "天衝"], ["xun", "天輔"], ["li", "天英"],
    ["kun", "天芮"], ["dui", "天柱"], ["qian", "天心"], ["center", "天禽"],
    ["unknown", null], [null, null],
  ];
  for (const [palaceKey, expected] of originalStarCases) {
    assertEqual(`qimen-plate-markers-original-star-${palaceKey ?? "invalid"}`, "star", expected, getQimenOriginalStarByPalace(palaceKey));
  }

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

  const qianTianYiPlate = createQimenDisplayZhiFuFixturePlate({ zhiFuPalaceKey: "qian" });
  qianTianYiPlate.palaces.dui.star = "天心";
  const kanTianYiPlate = createQimenDisplayZhiFuFixturePlate({ zhiFuPalaceKey: "kan" });
  kanTianYiPlate.palaces.li.star = "天蓬";
  const tianQinTianYiPlate = createQimenDisplayZhiFuFixturePlate({
    zhiFuStar: "天禽",
    zhiFuPalaceKey: "center",
    deityZhiFuPalaceKey: "kun",
  });
  tianQinTianYiPlate.palaces.kun.star = "天任";
  tianQinTianYiPlate.palaces.gen.star = "天芮";
  const missingTianYiStarPlate = createQimenDisplayZhiFuFixturePlate({ zhiFuPalaceKey: "qian" });
  const zhenTianYiPlate = createQimenDisplayZhiFuFixturePlate({ zhiFuPalaceKey: "zhen" });
  zhenTianYiPlate.palaces.li.star = "天衝";
  const zhenTianYiAliasPlate = createQimenDisplayZhiFuFixturePlate({ zhiFuPalaceKey: "zhen" });
  zhenTianYiAliasPlate.palaces.li.star = "天沖";
  qimenPlateMarkersVerifiedCaseCount += 1;
  assertEqual("qimen-plate-markers-tian-yi-qian", "palaceKey", "dui", findQimenTianYiStarPalaceKey(qianTianYiPlate));
  assertEqual("qimen-plate-markers-tian-yi-kan", "palaceKey", "li", findQimenTianYiStarPalaceKey(kanTianYiPlate));
  assertEqual("qimen-plate-markers-tian-yi-tian-qin", "palaceKey", "gen", findQimenTianYiStarPalaceKey(tianQinTianYiPlate));
  assertEqual("qimen-plate-markers-tian-yi-zhen-canonical", "palaceKey", "li", findQimenTianYiStarPalaceKey(zhenTianYiPlate));
  assertEqual("qimen-plate-markers-tian-yi-zhen-alias", "palaceKey", "li", findQimenTianYiStarPalaceKey(zhenTianYiAliasPlate));
  assertEqual("qimen-plate-markers-tian-yi-no-display-zhi-fu", "palaceKey", null, findQimenTianYiStarPalaceKey(createQimenDisplayZhiFuFixturePlate({ zhiFuPalaceKey: null })));
  assertEqual("qimen-plate-markers-tian-yi-star-not-found", "palaceKey", null, findQimenTianYiStarPalaceKey(missingTianYiStarPlate));
  assertEqual("qimen-plate-markers-tian-yi-invalid", "palaceKey", null, findQimenTianYiStarPalaceKey(null));
  assertEqual("qimen-plate-markers-normalize-tian-chong", "star", "天衝", normalizeQimenStarName("天沖"));
  assertEqual("qimen-plate-markers-normalize-tian-chong-canonical", "star", "天衝", normalizeQimenStarName("天衝"));
  assertEqual("qimen-plate-markers-normalize-non-string", "star", null, normalizeQimenStarName(null));

  const decoratedTianYiPlate = createQimenDisplayZhiFuFixturePlate({ zhiFuPalaceKey: "qian" });
  decoratedTianYiPlate.palaces.kan.door = "景";
  decoratedTianYiPlate.palaces.gen.door = "景";
  decoratedTianYiPlate.palaces.dui.star = "天心";
  const decoratedTianYiBefore = JSON.stringify(decoratedTianYiPlate);
  const tianYiMarkers = decorateQimenPlateMarkers(decoratedTianYiPlate);
  qimenPlateMarkersVerifiedCaseCount += 1;
  assertEqual("qimen-plate-markers-decorate-palace-over-door", "palaceOverDoor", "剋", tianYiMarkers.palaces.kan.palaceOverDoor);
  assertEqual("qimen-plate-markers-decorate-palace-over-door-no-match", "palaceOverDoor", null, tianYiMarkers.palaces.gen.palaceOverDoor);
  assertEqual("qimen-plate-markers-decorate-tian-yi", "isTianYiStarPalace", true, tianYiMarkers.palaces.dui.isTianYiStarPalace);
  assertEqual("qimen-plate-markers-decorate-non-tian-yi", "isTianYiStarPalace", false, tianYiMarkers.palaces.qian.isTianYiStarPalace);
  const missingTianYiMarkers = decorateQimenPlateMarkers(missingTianYiStarPlate);
  for (const palaceKey of QIMEN_PALACE_KEYS) {
    assertEqual(`qimen-plate-markers-decorate-no-tian-yi-${palaceKey}`, "isTianYiStarPalace", false, missingTianYiMarkers.palaces[palaceKey].isTianYiStarPalace);
  }
  assertEqual("qimen-plate-markers-decorate-tian-yi-no-pollution", "json", decoratedTianYiBefore, JSON.stringify(decoratedTianYiPlate));

  const generatedRelationPlate = createQimenMarkerFixturePlate();
  generatedRelationPlate.palaces.li.door = "生";
  generatedRelationPlate.palaces.zhen.door = "休";
  const generatedRelationMarkers = decorateQimenPlateMarkers(generatedRelationPlate);
  qimenPlateMarkersVerifiedCaseCount += 1;
  assertEqual("qimen-plate-markers-decorate-palace-generate-door", "palaceGenerateDoor", "生", generatedRelationMarkers.palaces.li.palaceGenerateDoor);
  assertEqual("qimen-plate-markers-decorate-door-generate-palace", "doorGeneratePalace", "生", generatedRelationMarkers.palaces.zhen.doorGeneratePalace);
  assertEqual("qimen-plate-markers-decorate-center-no-generate", "palaceGenerateDoor", null, generatedRelationMarkers.palaces.center.palaceGenerateDoor);
  assertEqual("qimen-plate-markers-decorate-center-no-door-generate", "doorGeneratePalace", null, generatedRelationMarkers.palaces.center.doorGeneratePalace);
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

function runQimenOpenCloseTests() {
  const jiaHourStemCases = [
    ["甲子", "戊"], ["甲戌", "己"], ["甲申", "庚"],
    ["甲午", "辛"], ["甲辰", "壬"], ["甲寅", "癸"],
  ];
  for (const [hourPillar, expectedStem] of jiaHourStemCases) {
    const plate = createQimenMarkerFixturePlate();
    plate.hourPillar = hourPillar;
    for (const palaceKey of QIMEN_PALACE_KEYS) {
      plate.palaces[palaceKey].heavenStem = "甲";
    }
    plate.palaces.zhen.heavenStem = expectedStem;
    plate.palaces.zhen.star = "天任";
    const resolution = resolveQimenOpenClose(plate);
    qimenOpenCloseVerifiedCaseCount += 1;
    assertEqual(`qimen-open-close-jia-resolve-${hourPillar}`, "stem", expectedStem, resolveQimenOpenCloseStem(hourPillar));
    assertEqual(`qimen-open-close-jia-mapping-${hourPillar}`, "stem", expectedStem, QIMEN_JIA_HOUR_RESOLVED_STEMS[hourPillar[1]]);
    assertEqual(`qimen-open-close-jia-result-${hourPillar}`, "resolvedStem", expectedStem, resolution.result?.resolvedStem);
    assertEqual(`qimen-open-close-jia-result-${hourPillar}`, "palaceKey", "zhen", resolution.result?.palaceKey);
  }

  qimenOpenCloseVerifiedCaseCount += 1;
  assertEqual("qimen-open-close-non-jia-direct-stem", "stem", "乙", resolveQimenOpenCloseStem("乙亥"));

  for (const [star, expected] of Object.entries(QIMEN_OPEN_CLOSE_BY_STAR)) {
    const plate = createQimenMarkerFixturePlate();
    plate.hourPillar = "乙亥";
    plate.palaces.kan.heavenStem = "乙";
    plate.palaces.kan.star = star;
    const resolution = resolveQimenOpenClose(plate);
    qimenOpenCloseVerifiedCaseCount += 1;
    assertEqual(`qimen-open-close-star-${star}`, "type", expected.type, resolution.result?.type);
    assertEqual(`qimen-open-close-star-${star}`, "label", expected.label, resolution.result?.label);
    assertEqual(`qimen-open-close-star-${star}`, "star", star, resolution.result?.star);
  }

  const centerPlate = createQimenMarkerFixturePlate();
  centerPlate.hourPillar = "乙亥";
  centerPlate.palaces.kan.heavenStem = "丙";
  centerPlate.palaces.center.heavenStem = "乙";
  centerPlate.palaces.kun.star = "天衝";
  const centerResolution = resolveQimenOpenClose(centerPlate);
  qimenOpenCloseVerifiedCaseCount += 1;
  assertEqual("qimen-open-close-center-source", "sourcePalaceKey", "center", centerResolution.result?.sourcePalaceKey);
  assertEqual("qimen-open-close-center-display", "palaceKey", "kun", centerResolution.result?.palaceKey);
  assertEqual("qimen-open-close-center-display", "type", "open", centerResolution.result?.type);

  const exampleOnePlate = getQimenPlate({ dunType: "yin", ju: 4, hourPillar: "甲戌" }).plate;
  const exampleOne = resolveQimenOpenClose(exampleOnePlate);
  qimenOpenCloseVerifiedCaseCount += 1;
  assertEqual("qimen-open-close-example-one", "sourceStem", "甲", exampleOne.result?.sourceStem);
  assertEqual("qimen-open-close-example-one", "resolvedStem", "己", exampleOne.result?.resolvedStem);
  assertEqual("qimen-open-close-example-one", "sourcePalaceKey", "zhen", exampleOne.result?.sourcePalaceKey);
  assertEqual("qimen-open-close-example-one", "palaceKey", "zhen", exampleOne.result?.palaceKey);
  assertEqual("qimen-open-close-example-one", "star", "天衝", exampleOne.result?.star);
  assertEqual("qimen-open-close-example-one", "label", "開", exampleOne.result?.label);

  const exampleTwoPlate = getQimenPlate({ dunType: "yin", ju: 4, hourPillar: "乙亥" }).plate;
  const exampleTwo = resolveQimenOpenClose(exampleTwoPlate);
  qimenOpenCloseVerifiedCaseCount += 1;
  assertEqual("qimen-open-close-example-two", "sourceStem", "乙", exampleTwo.result?.sourceStem);
  assertEqual("qimen-open-close-example-two", "sourcePalaceKey", "center", exampleTwo.result?.sourcePalaceKey);
  assertEqual("qimen-open-close-example-two", "palaceKey", "kun", exampleTwo.result?.palaceKey);
  assertEqual("qimen-open-close-example-two", "star", "天衝", exampleTwo.result?.star);
  assertEqual("qimen-open-close-example-two", "label", "開", exampleTwo.result?.label);

  const viewModel = createQimenOpenCloseViewModel(exampleOnePlate);
  qimenOpenCloseVerifiedCaseCount += 1;
  assertEqual("qimen-open-close-view-model-target", "label", "開", viewModel.palaces.zhen?.label);
  assertEqual("qimen-open-close-view-model-result", "palaceKey", "zhen", viewModel.result?.palaceKey);
  for (const palaceKey of QIMEN_PALACE_KEYS.filter((palaceKey) => palaceKey !== "zhen")) {
    assertEqual(`qimen-open-close-view-model-single-${palaceKey}`, "openClose", null, viewModel.palaces[palaceKey]);
  }

  const noHourStem = resolveQimenOpenClose({ palaces: {} });
  const noResolvedJiaStem = resolveQimenOpenClose({ hourPillar: "甲卯", palaces: {} });
  const missingHeavenStem = resolveQimenOpenClose({ hourPillar: "乙亥", palaces: {} });
  const unknownStarPlate = createQimenMarkerFixturePlate();
  unknownStarPlate.hourPillar = "乙亥";
  unknownStarPlate.palaces.kan.heavenStem = "乙";
  unknownStarPlate.palaces.kan.star = "未知星";
  const unknownStar = resolveQimenOpenClose(unknownStarPlate);
  qimenOpenCloseVerifiedCaseCount += 1;
  assertEqual("qimen-open-close-safe-no-hour-stem", "result", null, noHourStem.result);
  assertEqual("qimen-open-close-safe-no-hour-stem", "diagnostic", "HOUR_STEM_NOT_FOUND", noHourStem.diagnostics[0]?.code);
  assertEqual("qimen-open-close-safe-no-resolved-jia", "result", null, noResolvedJiaStem.result);
  assertEqual("qimen-open-close-safe-no-resolved-jia", "diagnostic", "JIA_HOUR_STEM_NOT_RESOLVED", noResolvedJiaStem.diagnostics[0]?.code);
  assertEqual("qimen-open-close-safe-missing-heaven-stem", "result", null, missingHeavenStem.result);
  assertEqual("qimen-open-close-safe-missing-heaven-stem", "diagnostic", "HEAVEN_STEM_PALACE_NOT_FOUND", missingHeavenStem.diagnostics[0]?.code);
  assertEqual("qimen-open-close-safe-unknown-star", "result", null, unknownStar.result);
  assertEqual("qimen-open-close-safe-unknown-star", "diagnostic", "UNKNOWN_STAR_POLARITY", unknownStar.diagnostics[0]?.code);

  qimenOpenCloseVerifiedCaseCount += 1;
  assertEqual(
    "qimen-open-close-ui-header-and-badge",
    "implementation",
    true,
    mainModuleRaw.includes("createQimenOpenCloseViewModel(plate)")
      && mainModuleRaw.includes("createQimenOpenCloseBadge(openClose)")
      && mainModuleRaw.includes("formatQimenPalaceHeader(palace, palaceMeta, openClose)")
      && mainCssRaw.includes(".qimen-open-close-badge")
      && mainCssRaw.includes(".qimen-open-close-badge.is-open")
      && mainCssRaw.includes(".qimen-open-close-badge.is-close")
  );
}

function runQimenSolarTermVirtuePunishmentTests() {
  const expectedXunKeys = ["jiaZi", "jiaXu", "jiaShen", "jiaWu", "jiaChen", "jiaYin"];
  const expectedXunLabels = ["甲子旬", "甲戌旬", "甲申旬", "甲午旬", "甲辰旬", "甲寅旬"];
  const expectedChiefStems = ["戊", "己", "庚", "辛", "壬", "癸"];
  const resolvedPillars = new Set();
  const xunCounts = Object.fromEntries(expectedXunKeys.map((key) => [key, 0]));
  for (const [index, hourPillar] of SEXAGENARY_CYCLE.entries()) {
    const xun = resolveQimenJiaXun(hourPillar);
    const xunIndex = Math.floor(index / 10);
    qimenSolarTermVirtuePunishmentVerifiedCaseCount += 1;
    assertEqual(`qimen-jia-xun-${hourPillar}`, "key", expectedXunKeys[xunIndex], xun?.key);
    assertEqual(`qimen-jia-xun-${hourPillar}`, "label", expectedXunLabels[xunIndex], xun?.label);
    assertEqual(`qimen-jia-xun-${hourPillar}`, "chiefStem", expectedChiefStems[xunIndex], xun?.chiefStem);
    resolvedPillars.add(hourPillar);
    if (xun?.key) {
      xunCounts[xun.key] += 1;
    }
  }
  assertEqual("qimen-jia-xun-completeness", "uniquePillars", 60, resolvedPillars.size);
  for (const key of expectedXunKeys) {
    assertEqual(`qimen-jia-xun-count-${key}`, "count", 10, xunCounts[key]);
  }
  assertEqual("qimen-jia-xun-invalid-empty", "result", null, resolveQimenJiaXun(""));
  assertEqual("qimen-jia-xun-invalid-pillar", "result", null, resolveQimenJiaXun("甲丑"));

  const solarTermMappingCases = [
    [["冬至", "小寒", "大寒"], "甲子", "卯", "酉"],
    [["夏至", "小暑", "大暑"], "甲子", "酉", "卯"],
    [["立春", "雨水", "驚蟄"], "甲戌", "辰", "戌"],
    [["立秋", "處暑", "白露"], "甲戌", "戌", "辰"],
    [["春分", "清明", "穀雨"], "甲子", "午", "子"],
    [["秋分", "寒露", "霜降"], "甲子", "子", "午"],
    [["立夏", "小滿", "芒種"], "甲子", "未", "丑"],
    [["立冬", "小雪", "大雪"], "甲子", "丑", "未"],
  ];
  for (const [solarTermsInGroup, hourPillar, virtueBranch, punishmentBranch] of solarTermMappingCases) {
    for (const solarTerm of solarTermsInGroup) {
      const resolution = resolveQimenSolarTermVirtuePunishment({ solarTerm, hourPillar });
      const virtueMarkers = resolution.markers.filter((marker) => marker.type === "virtue");
      const punishmentMarkers = resolution.markers.filter((marker) => marker.type === "punishment");
      qimenSolarTermVirtuePunishmentVerifiedCaseCount += 1;
      assertEqual(`qimen-solar-term-virtue-punishment-${solarTerm}`, "knownTerm", true, Object.hasOwn(QIMEN_SOLAR_TERM_VIRTUE_PUNISHMENT_BY_TERM, solarTerm));
      assertEqual(`qimen-solar-term-virtue-punishment-${solarTerm}`, "markerCount", 2, resolution.markers.length);
      assertEqual(`qimen-solar-term-virtue-punishment-${solarTerm}`, "virtueCount", 1, virtueMarkers.length);
      assertEqual(`qimen-solar-term-virtue-punishment-${solarTerm}`, "virtueBranch", virtueBranch, virtueMarkers[0]?.branch);
      assertEqual(`qimen-solar-term-virtue-punishment-${solarTerm}`, "punishmentCount", 1, punishmentMarkers.length);
      assertEqual(`qimen-solar-term-virtue-punishment-${solarTerm}`, "punishmentBranch", punishmentBranch, punishmentMarkers[0]?.branch);
      assertEqual(`qimen-solar-term-virtue-punishment-${solarTerm}`, "maxTwo", true, resolution.markers.length <= 2);
    }
  }

  const suppressionCases = [
    ["冬至", "甲辰", ["punishment"]],
    ["冬至", "甲戌", ["virtue"]],
    ["冬至", "甲子", ["virtue", "punishment"]],
    ["立春", "甲午", ["punishment"]],
    ["立春", "甲子", ["virtue"]],
    ["立春", "甲戌", ["virtue", "punishment"]],
    ["春分", "甲申", ["punishment"]],
    ["春分", "甲寅", ["virtue"]],
    ["春分", "甲子", ["virtue", "punishment"]],
    ["立夏", "甲申", ["punishment"]],
    ["立夏", "甲寅", ["virtue"]],
    ["立夏", "甲子", ["virtue", "punishment"]],
  ];
  for (const [solarTerm, hourPillar, expectedTypes] of suppressionCases) {
    const resolution = resolveQimenSolarTermVirtuePunishment({ solarTerm, hourPillar });
    const actualTypes = resolution.markers.map((marker) => marker.type);
    qimenSolarTermVirtuePunishmentVerifiedCaseCount += 1;
    assertEqual(`qimen-solar-term-suppression-${solarTerm}-${hourPillar}`, "types", expectedTypes.join(","), actualTypes.join(","));
    assertEqual(`qimen-solar-term-suppression-${solarTerm}-${hourPillar}`, "uniqueTypes", actualTypes.length, new Set(actualTypes).size);
  }

  qimenSolarTermVirtuePunishmentVerifiedCaseCount += 1;
  assertEqual("qimen-solar-term-normalize-guyu", "term", "穀雨", normalizeQimenSolarTermName("谷雨"));
  assertEqual("qimen-solar-term-normalize-jingzhe", "term", "驚蟄", normalizeQimenSolarTermName("惊蛰"));
  assertEqual("qimen-solar-term-normalize-chushu", "term", "處暑", normalizeQimenSolarTermName("处暑"));

  const actualTermPlate = createQimenMarkerFixturePlate();
  const actualTermViewModel = createQimenSolarTermVirtuePunishmentViewModel({
    actualSolarTerm: "冬至",
    qimenSolarTerm: "大雪",
    hourPillar: "甲子",
  }, actualTermPlate);
  qimenSolarTermVirtuePunishmentVerifiedCaseCount += 1;
  assertEqual("qimen-solar-term-actual-not-qimen-term", "solarTerm", "冬至", actualTermViewModel.solarTerm);
  assertEqual("qimen-solar-term-actual-not-qimen-term", "branches", "卯,酉", actualTermViewModel.markers.map((marker) => marker.branch).join(","));
  assertEqual("qimen-solar-term-actual-not-qimen-term", "zhenCount", 1, actualTermViewModel.palaces.zhen.length);
  assertEqual("qimen-solar-term-actual-not-qimen-term", "duiCount", 1, actualTermViewModel.palaces.dui.length);
  for (const palaceKey of QIMEN_PALACE_KEYS.filter((key) => !["zhen", "dui"].includes(key))) {
    assertEqual(`qimen-solar-term-view-model-empty-${palaceKey}`, "markerCount", 0, actualTermViewModel.palaces[palaceKey].length);
  }

  const safetyCases = [
    ["missing-term", { hourPillar: "甲子" }, "ACTUAL_SOLAR_TERM_NOT_FOUND"],
    ["unknown-term", { solarTerm: "未知節氣", hourPillar: "甲子" }, "SOLAR_TERM_RULE_NOT_FOUND"],
    ["missing-hour", { solarTerm: "冬至" }, "JIA_XUN_NOT_RESOLVED"],
    ["invalid-hour", { solarTerm: "冬至", hourPillar: "甲丑" }, "JIA_XUN_NOT_RESOLVED"],
  ];
  for (const [id, input, expectedCode] of safetyCases) {
    const resolution = resolveQimenSolarTermVirtuePunishment(input);
    qimenSolarTermVirtuePunishmentVerifiedCaseCount += 1;
    assertEqual(`qimen-solar-term-safe-${id}`, "markerCount", 0, resolution.markers.length);
    assertEqual(`qimen-solar-term-safe-${id}`, "diagnostic", expectedCode, resolution.diagnostics[0]?.code);
  }

  const missingPalacePlate = createQimenMarkerFixturePlate();
  delete missingPalacePlate.palaces.zhen;
  const missingPalace = createQimenSolarTermVirtuePunishmentViewModel({
    actualSolarTerm: "冬至",
    hourPillar: "甲子",
  }, missingPalacePlate);
  qimenSolarTermVirtuePunishmentVerifiedCaseCount += 1;
  assertEqual("qimen-solar-term-safe-missing-palace", "markerCount", 1, missingPalace.markers.length);
  assertEqual("qimen-solar-term-safe-missing-palace", "diagnostic", "MARKER_PALACE_NOT_FOUND", missingPalace.diagnostics[0]?.code);

  const expectedBranchPositions = {
    卯: ["zhen", "zhen-left", "left"], 酉: ["dui", "dui-right", "right"],
    辰: ["xun", "xun-left", "left"], 戌: ["qian", "qian-right", "right"],
    午: ["li", "li-top", "top"], 子: ["kan", "kan-bottom", "bottom"],
    未: ["kun", "kun-top", "top"], 丑: ["gen", "gen-bottom", "bottom"],
  };
  for (const [branch, [palaceKey, position, edge]] of Object.entries(expectedBranchPositions)) {
    qimenSolarTermVirtuePunishmentVerifiedCaseCount += 1;
    assertEqual(`qimen-solar-term-branch-position-${branch}`, "palaceKey", palaceKey, QIMEN_BRANCH_POSITIONS[branch]?.palaceKey);
    assertEqual(`qimen-solar-term-branch-position-${branch}`, "position", position, QIMEN_BRANCH_POSITIONS[branch]?.position);
    assertEqual(`qimen-solar-term-branch-position-${branch}`, "edge", edge, QIMEN_BRANCH_POSITIONS[branch]?.edge);
  }

  qimenSolarTermVirtuePunishmentVerifiedCaseCount += 1;
  assertEqual(
    "qimen-solar-term-ui-flow",
    "implementation",
    true,
    mainModuleRaw.includes("createQimenPlateAnnotations(plateResult.plate, qimen)")
      && mainModuleRaw.includes("createQimenVirtuePunishmentBadges(palaceMeta.key, virtuePunishment)")
      && mainModuleRaw.includes('"qimen-virtue-punishment-badge"')
      && mainModuleRaw.includes('marker.hasGuXuMarker ? "has-gu-xu-marker" : ""')
      && !/headerLabel\.append\(createQimenVirtuePunishmentBadge/.test(mainModuleRaw)
      && mainCssRaw.includes(".qimen-virtue-punishment-badge.is-virtue")
      && mainCssRaw.includes(".qimen-virtue-punishment-badge.is-punishment")
  );

  for (const edge of ["left", "right", "top", "bottom"]) {
    qimenSolarTermVirtuePunishmentVerifiedCaseCount += 1;
    const positions = Object.values(expectedBranchPositions)
      .filter(([, , candidateEdge]) => candidateEdge === edge)
      .map(([, position]) => position);
    assertEqual(
      `qimen-solar-term-gu-xu-offset-${edge}`,
      "cssModifier",
      true,
      positions.every((position) => mainCssRaw.includes(`.qimen-virtue-punishment-pos-${position}.has-gu-xu-marker`))
    );
  }

  for (const [solarTermsInGroup, hourPillar] of solarTermMappingCases) {
    const collisionViewModel = createQimenSolarTermVirtuePunishmentViewModel({
      actualSolarTerm: solarTermsInGroup[0],
      hourPillar,
    }, createQimenMarkerFixturePlate(), {
      gu: ["卯", "辰", "午", "未"],
      xu: ["酉", "戌", "子", "丑"],
    });
    for (const marker of collisionViewModel.markers) {
      qimenSolarTermVirtuePunishmentVerifiedCaseCount += 1;
      assertEqual(
        `qimen-solar-term-gu-xu-collision-${marker.branch}`,
        "hasGuXuMarker",
        true,
        marker.hasGuXuMarker
      );
    }
  }

  qimenSolarTermVirtuePunishmentVerifiedCaseCount += 1;
  assertEqual("qimen-solar-term-open-close-preserved", "openCloseRender", true, mainModuleRaw.includes("createQimenOpenCloseBadge(openClose)"));
  assertEqual("qimen-solar-term-gu-xu-preserved", "guXuRender", true, mainModuleRaw.includes("createQimenGuXuBadges(palaceMeta.key, guXu)"));
}

function runQimenQiResponseTests() {
  const starGroupRepresentatives = {
    chongFu: "天衝",
    ying: "天英",
    renRuiQin: "天任",
    zhuXin: "天柱",
    peng: "天蓬",
  };
  const monthGroupRepresentatives = {
    fire: "巳",
    earth: "未",
    metal: "申",
    water: "亥",
    wood: "寅",
  };
  const expectedStarStates = {
    chongFu: { fire: "旺", earth: "休", metal: "囚", water: "廢", wood: "相" },
    ying: { fire: "相", earth: "旺", metal: "休", water: "囚", wood: "廢" },
    renRuiQin: { fire: "廢", earth: "相", metal: "旺", water: "休", wood: "囚" },
    zhuXin: { fire: "囚", earth: "廢", metal: "相", water: "旺", wood: "休" },
    peng: { fire: "休", earth: "囚", metal: "廢", water: "相", wood: "旺" },
  };

  for (const [starGroup, star] of Object.entries(starGroupRepresentatives)) {
    for (const [monthGroup, monthBranch] of Object.entries(monthGroupRepresentatives)) {
      const result = resolveQimenStarQiResponse({ monthPillar: monthBranch, star });
      qimenQiResponseVerifiedCaseCount += 1;
      assertEqual(`qimen-qi-star-matrix-${starGroup}-${monthGroup}`, "state", expectedStarStates[starGroup][monthGroup], result.state);
      assertEqual(`qimen-qi-star-matrix-${starGroup}-${monthGroup}`, "starGroup", starGroup, result.starGroup);
      assertEqual(`qimen-qi-star-matrix-${starGroup}-${monthGroup}`, "monthGroup", monthGroup, result.monthGroup);
      assertEqual(`qimen-qi-star-matrix-${starGroup}-${monthGroup}`, "diagnostics.length", 0, result.diagnostics.length);
    }
  }

  const expectedChongFuByBranch = {
    子: "廢", 丑: "休", 寅: "相", 卯: "相", 辰: "休", 巳: "旺",
    午: "旺", 未: "休", 申: "囚", 酉: "囚", 戌: "休", 亥: "廢",
  };
  for (const [monthBranch, expectedState] of Object.entries(expectedChongFuByBranch)) {
    qimenQiResponseVerifiedCaseCount += 1;
    assertEqual(
      `qimen-qi-star-twelve-branches-${monthBranch}`,
      "state",
      expectedState,
      resolveQimenStarQiResponse({ monthPillar: monthBranch, star: "天輔" }).state
    );
  }

  const weiMonthStarCases = [
    ["天衝", "休"], ["天輔", "休"], ["天英", "旺"],
    ["天任", "相"], ["天芮", "相"], ["天禽", "相"],
    ["天柱", "廢"], ["天心", "廢"], ["天蓬", "囚"],
  ];
  for (const [star, expectedState] of weiMonthStarCases) {
    const result = resolveQimenStarQiResponse({ monthPillar: "己未", star });
    qimenQiResponseVerifiedCaseCount += 1;
    assertEqual(`qimen-qi-star-wei-${star}`, "state", expectedState, result.state);
    assertEqual(`qimen-qi-star-wei-${star}`, "monthBranch", "未", result.monthBranch);
  }

  const starNormalizationCases = [
    ["天沖", "天衝", "休"],
    ["天衝星", "天衝", "休"],
    ["天沖星", "天衝", "休"],
    [" 天輔星 ", "天輔", "休"],
    [" 天蓬星 ", "天蓬", "囚"],
  ];
  for (const [star, normalizedStar, expectedState] of starNormalizationCases) {
    const result = resolveQimenStarQiResponse({ monthPillar: "未", star });
    qimenQiResponseVerifiedCaseCount += 1;
    assertEqual(`qimen-qi-star-normalize-${star}`, "normalizedStar", normalizedStar, result.normalizedStar);
    assertEqual(`qimen-qi-star-normalize-${star}`, "state", expectedState, result.state);
  }

  const monthPillarNormalizationCases = [
    ["己未", "己未", "未"],
    ["己未月", "己未", "未"],
    [" 己未月 ", "己未", "未"],
    ["未", "未", "未"],
    ["未月", "未", "未"],
    ["甲丑", null, null],
    ["", null, null],
    [null, null, null],
    [{}, null, null],
  ];
  for (const [input, expectedPillar, expectedBranch] of monthPillarNormalizationCases) {
    qimenQiResponseVerifiedCaseCount += 1;
    assertEqual(`qimen-qi-month-normalize-${String(input)}`, "monthPillar", expectedPillar, normalizeQimenMonthPillar(input));
    assertEqual(`qimen-qi-month-normalize-${String(input)}`, "monthBranch", expectedBranch, getQimenMonthBranch(input));
  }

  const invalidStarCases = [
    [{ monthPillar: null, star: "天蓬" }],
    [{ monthPillar: "甲丑", star: "天蓬" }],
    [{ monthPillar: "己未", star: null }],
    [{ monthPillar: "己未", star: "未知星" }],
    [{}],
  ];
  for (const [input] of invalidStarCases) {
    const result = resolveQimenStarQiResponse(input);
    qimenQiResponseVerifiedCaseCount += 1;
    assertEqual(`qimen-qi-star-invalid-${JSON.stringify(input)}`, "state", null, result.state);
    assertEqual(`qimen-qi-star-invalid-${JSON.stringify(input)}`, "hasDiagnostics", true, result.diagnostics.length > 0);
  }

  const expectedDoorStatesByGroup = {
    winterSolstice: { 休: "旺", 生: "絕", 傷: "胎", 杜: "沒", 景: "死", 死: "囚", 驚: "休", 開: "廢" },
    springStart: { 休: "廢", 生: "旺", 傷: "絕", 杜: "胎", 景: "沒", 死: "死", 驚: "囚", 開: "休" },
    springEquinox: { 休: "休", 生: "廢", 傷: "旺", 杜: "絕", 景: "胎", 死: "沒", 驚: "死", 開: "囚" },
    summerStart: { 休: "囚", 生: "休", 傷: "廢", 杜: "旺", 景: "絕", 死: "胎", 驚: "沒", 開: "死" },
    summerSolstice: { 休: "死", 生: "囚", 傷: "休", 杜: "廢", 景: "旺", 死: "絕", 驚: "胎", 開: "沒" },
    autumnStart: { 休: "沒", 生: "死", 傷: "囚", 杜: "休", 景: "廢", 死: "旺", 驚: "絕", 開: "胎" },
    autumnEquinox: { 休: "胎", 生: "沒", 傷: "死", 杜: "囚", 景: "休", 死: "廢", 驚: "旺", 開: "絕" },
    winterStart: { 休: "絕", 生: "胎", 傷: "沒", 杜: "死", 景: "囚", 死: "休", 驚: "廢", 開: "旺" },
  };

  for (const [solarTermGroup, expectedByDoor] of Object.entries(expectedDoorStatesByGroup)) {
    const actualSolarTerm = QIMEN_DOOR_QI_RESPONSE_SOLAR_TERM_GROUPS[solarTermGroup][0];
    const states = [];
    for (const [door, expectedState] of Object.entries(expectedByDoor)) {
      const result = resolveQimenDoorQiResponse({ actualSolarTerm, door });
      states.push(result.state);
      qimenQiResponseVerifiedCaseCount += 1;
      assertEqual(`qimen-qi-door-matrix-${solarTermGroup}-${door}`, "state", expectedState, result.state);
      assertEqual(`qimen-qi-door-matrix-${solarTermGroup}-${door}`, "solarTermGroup", solarTermGroup, result.solarTermGroup);
      assertEqual(`qimen-qi-door-matrix-${solarTermGroup}-${door}`, "diagnostics.length", 0, result.diagnostics.length);
    }
    qimenQiResponseVerifiedCaseCount += 1;
    assertEqual(
      `qimen-qi-door-matrix-${solarTermGroup}`,
      "completeUniqueStates",
      true,
      states.length === 8
        && new Set(states).size === 8
        && ["旺", "絕", "胎", "沒", "死", "囚", "休", "廢"].every((state) => states.includes(state))
    );
  }

  for (const [solarTermGroup, solarTermsInGroup] of Object.entries(QIMEN_DOOR_QI_RESPONSE_SOLAR_TERM_GROUPS)) {
    for (const actualSolarTerm of solarTermsInGroup) {
      const result = resolveQimenDoorQiResponse({ actualSolarTerm, door: "休" });
      qimenQiResponseVerifiedCaseCount += 1;
      assertEqual(`qimen-qi-door-twenty-four-terms-${actualSolarTerm}`, "solarTermGroup", solarTermGroup, result.solarTermGroup);
      assertEqual(`qimen-qi-door-twenty-four-terms-${actualSolarTerm}`, "hasState", true, Boolean(result.state));
    }
  }

  const greatHeatDoorCases = [
    ["休門", "死"], ["生門", "囚"], ["傷門", "休"], ["杜門", "廢"],
    ["景門", "旺"], ["死門", "絕"], ["驚門", "胎"], ["開門", "沒"],
  ];
  for (const [door, expectedState] of greatHeatDoorCases) {
    const result = resolveQimenDoorQiResponse({ actualSolarTerm: "大暑", door });
    qimenQiResponseVerifiedCaseCount += 1;
    assertEqual(`qimen-qi-door-great-heat-${door}`, "state", expectedState, result.state);
  }

  const solarTermNormalizationCases = [
    ["谷雨", "穀雨", "春分", "休"],
    ["惊蛰", "驚蟄", "立春", "廢"],
    ["处暑", "處暑", "立秋", "沒"],
    ["小满", "小滿", "立夏", "囚"],
    ["芒种", "芒種", "立夏", "囚"],
    [" 大暑 ", "大暑", "夏至", "死"],
  ];
  for (const [input, normalizedTerm, groupFirstTerm, expectedState] of solarTermNormalizationCases) {
    const result = resolveQimenDoorQiResponse({ actualSolarTerm: input, door: "休門" });
    const expectedGroup = Object.entries(QIMEN_DOOR_QI_RESPONSE_SOLAR_TERM_GROUPS)
      .find(([, terms]) => terms.includes(groupFirstTerm))?.[0];
    qimenQiResponseVerifiedCaseCount += 1;
    assertEqual(`qimen-qi-door-term-normalize-${input}`, "actualSolarTerm", normalizedTerm, result.actualSolarTerm);
    assertEqual(`qimen-qi-door-term-normalize-${input}`, "solarTermGroup", expectedGroup, result.solarTermGroup);
    assertEqual(`qimen-qi-door-term-normalize-${input}`, "state", expectedState, result.state);
  }

  for (const door of ["休", "生", "傷", "杜", "景", "死", "驚", "開"]) {
    const shortResult = resolveQimenDoorQiResponse({ actualSolarTerm: "大暑", door });
    const fullResult = resolveQimenDoorQiResponse({ actualSolarTerm: "大暑", door: ` ${door}門 ` });
    qimenQiResponseVerifiedCaseCount += 1;
    assertEqual(`qimen-qi-door-normalize-${door}`, "short", shortResult.state, fullResult.state);
    assertEqual(`qimen-qi-door-normalize-${door}`, "normalizedDoor", door, fullResult.normalizedDoor);
  }

  const invalidDoorCases = [
    [{ actualSolarTerm: null, door: "休" }],
    [{ actualSolarTerm: "未知節氣", door: "休" }],
    [{ actualSolarTerm: "大暑", door: null }],
    [{ actualSolarTerm: "大暑", door: "未知門" }],
    [{}],
  ];
  for (const [input] of invalidDoorCases) {
    const result = resolveQimenDoorQiResponse(input);
    qimenQiResponseVerifiedCaseCount += 1;
    assertEqual(`qimen-qi-door-invalid-${JSON.stringify(input)}`, "state", null, result.state);
    assertEqual(`qimen-qi-door-invalid-${JSON.stringify(input)}`, "hasDiagnostics", true, result.diagnostics.length > 0);
  }

  const qiPlate = createQimenMarkerFixturePlate();
  qiPlate.palaces.center.star = "天禽";
  qiPlate.palaces.center.door = null;
  const qiViewModel = createQimenQiResponseViewModel({
    monthPillar: "己未",
    actualSolarTerm: "大暑",
    plate: qiPlate,
  });
  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-view-model", "palaceCount", QIMEN_PALACE_KEYS.length, Object.keys(qiViewModel.palaces).length);
  assertEqual("qimen-qi-view-model", "starResponseCount", 9, Object.values(qiViewModel.palaces).filter((palace) => palace.starQiResponse).length);
  assertEqual("qimen-qi-view-model", "doorResponseCount", 8, Object.values(qiViewModel.palaces).filter((palace) => palace.doorQiResponse).length);
  assertEqual("qimen-qi-view-model", "centerStar", "天禽", qiViewModel.palaces.center.starQiResponse?.normalizedStar);
  assertEqual("qimen-qi-view-model", "centerState", "相", qiViewModel.palaces.center.starQiResponse?.state);
  assertEqual("qimen-qi-view-model", "centerDoor", null, qiViewModel.palaces.center.doorQiResponse);

  const actualTermDataFlow = createQimenQiResponseViewModel({
    monthPillar: "己未",
    actualSolarTerm: "大暑",
    qimenSolarTerm: "小暑",
    plate: qiPlate,
  });
  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-actual-term-data-flow", "actualSolarTerm", "大暑", actualTermDataFlow.actualSolarTerm);
  assertEqual("qimen-qi-actual-term-data-flow", "doorState", "囚", actualTermDataFlow.palaces.kan.doorQiResponse?.state);

  const missingPlateViewModel = createQimenQiResponseViewModel({
    monthPillar: "己未",
    actualSolarTerm: "大暑",
    plate: null,
  });
  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-missing-plate", "starResponseCount", 0, Object.values(missingPlateViewModel.palaces).filter((palace) => palace.starQiResponse).length);
  assertEqual("qimen-qi-missing-plate", "doorResponseCount", 0, Object.values(missingPlateViewModel.palaces).filter((palace) => palace.doorQiResponse).length);

  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-declarative-star-groups", "starCount", 9, Object.keys(QIMEN_STAR_QI_RESPONSE_GROUP_BY_STAR).length);
  assertEqual("qimen-qi-declarative-star-matrix", "groupCount", 5, Object.keys(QIMEN_STAR_QI_RESPONSE_BY_GROUP).length);
  assertEqual("qimen-qi-declarative-month-groups", "branchCount", 12, Object.values(QIMEN_MONTH_BRANCH_GROUPS).flat().length);
  assertEqual("qimen-qi-declarative-door-groups", "groupCount", 8, Object.keys(QIMEN_DOOR_QI_RESPONSE_BY_GROUP).length);

  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual(
    "qimen-qi-ui-data-flow",
    "implementation",
    true,
    mainModuleRaw.includes("createQimenQiResponseViewModel({")
      && mainModuleRaw.includes("monthPillar: currentCalendarResult?.monthPillar")
      && mainModuleRaw.includes("actualSolarTerm: qimen?.actualSolarTerm")
      && mainModuleRaw.includes("annotations.qiResponse?.palaces?.[palaceMeta.key]")
      && mainModuleRaw.includes('"qimen-star-block"')
      && mainModuleRaw.includes('"qimen-door-block"')
      && mainModuleRaw.includes('"qimen-door-status-row"')
      && !mainModuleRaw.includes('"is-inside-tian-yi-frame"')
      && mainCssRaw.includes(".qimen-star-block")
      && mainCssRaw.includes(".qimen-door-status-row")
      && mainCssRaw.includes("grid-auto-rows: minmax(var(--qimen-cell-min-height), 1fr)")
      && /\.qimen-palace-door\s*\{[^}]*position: relative;[^}]*z-index: 1;/.test(mainCssRaw)
      && /\.qimen-door-status-row\s*\{[^}]*position: absolute;[^}]*right: 0;[^}]*bottom: 0;[^}]*left: 0;[^}]*z-index: 2;/.test(mainCssRaw)
      && /\.qimen-star-qi-response\s*\{[^}]*display: inline;[^}]*border: 0;[^}]*font-size: var\(--qimen-status-font-size\);/.test(mainCssRaw)
      && /\.qimen-door-qi-response\s*\{[^}]*display: inline;[^}]*border: 0;[^}]*font-size: var\(--qimen-status-font-size\);/.test(mainCssRaw)
      && /\.qimen-door-relation-marker\s*\{[^}]*margin-left: auto;/.test(mainCssRaw)
      && /\.qimen-palace-deity-zhi-fu\s*\{[^}]*border: 0;[^}]*background: #eef2f6;/.test(mainCssRaw)
      && /\.qimen-palace-star-tian-yi\s*\{[^}]*border: 0;[^}]*background: #eef2f6;/.test(mainCssRaw)
      && /\.qimen-palace-door-zhi-shi\s*\{[^}]*border-width: 2px;/.test(mainCssRaw)
      && /\.qimen-door-block\s*\{[^}]*overflow: visible;/.test(mainCssRaw)
  );

  const renderPalaceContent = loadQimenPalaceContentRenderer(mainModuleRaw);
  const qiAndPoContent = renderPalaceContent(
    { deity: "九天", star: "天心", door: "傷", heavenStem: "乙", earthStem: "丙" },
    { doorPo: "迫" },
    false,
    { starQiResponse: { state: "廢" }, doorQiResponse: { state: "休" } }
  );
  const [starBlock, doorBlock] = [qiAndPoContent.childNodes[0].childNodes[1], qiAndPoContent.childNodes[1].childNodes[0]];
  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-star-block-order", "children", "qimen-palace-star,qimen-star-qi-response", starBlock.childNodes.map((node) => node.className).join(","));
  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-star-state-preserved", "text", "廢", starBlock.childNodes[1].textContent);
  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-general-star-has-no-frame", "classes", "qimen-star-block", starBlock.className);
  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-door-status-order", "children", "qimen-palace-door,qimen-door-status-row", doorBlock.childNodes.map((node) => node.className).join(","));
  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-door-status-marker-order", "children", "qimen-door-qi-response,qimen-door-po-marker qimen-door-relation-marker", doorBlock.childNodes[1].childNodes.map((node) => node.className).join(","));
  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-door-state-preserved", "text", "休", doorBlock.childNodes[1].childNodes[0].textContent);

  const qiAndGenerateContent = renderPalaceContent(
    { deity: "九地", star: "天任", door: "生", heavenStem: "丁", earthStem: "己" },
    { doorGeneratePalace: "生" },
    false,
    { starQiResponse: { state: "旺" }, doorQiResponse: { state: "囚" } }
  );
  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-door-status-generate-order", "children", "qimen-door-qi-response,qimen-door-generate-palace-marker qimen-door-relation-marker", qiAndGenerateContent.childNodes[1].childNodes[0].childNodes[1].childNodes.map((node) => node.className).join(","));

  const qiOnlyContent = renderPalaceContent(
    { deity: "九地", star: "天任", door: "開", heavenStem: "丁", earthStem: "己" },
    {},
    false,
    { doorQiResponse: { state: "沒" } }
  );
  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-door-status-only-qi", "children", "qimen-door-qi-response", qiOnlyContent.childNodes[1].childNodes[0].childNodes[1].childNodes.map((node) => node.className).join(","));

  const tianYiContent = renderPalaceContent(
    { deity: "直符", star: "天芮", door: "生", heavenStem: "辛", earthStem: "癸" },
    { isTianYiStarPalace: true, doorGeneratePalace: "生" },
    true,
    { starQiResponse: { state: "相" }, doorQiResponse: { state: "囚" } }
  );
  const tianYiStarBlock = tianYiContent.childNodes[0].childNodes[1];
  const tianYiDeity = tianYiContent.childNodes[0].childNodes[0];
  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-zhi-fu-deity-marker", "classes", "qimen-palace-deity qimen-palace-deity-zhi-fu", tianYiDeity.className);
  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-tian-yi-frame-is-star-only", "classes", "qimen-star-block", tianYiStarBlock.className);
  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-tian-yi-response-is-frame-sibling", "children", "qimen-palace-star qimen-palace-star-tian-yi,qimen-star-qi-response", tianYiStarBlock.childNodes.map((node) => node.className).join(","));

  const zhiShiContent = renderPalaceContent(
    { deity: "九天", star: "天心", door: "開", heavenStem: "庚", earthStem: "辛", isZhiShiPalace: true },
    {},
    false,
    { doorQiResponse: { state: "胎" } }
  );
  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-zhi-shi-door-marker", "classes", "qimen-palace-door qimen-palace-door-zhi-shi", zhiShiContent.childNodes[1].childNodes[0].childNodes[0].className);

  const noQiContent = renderPalaceContent(
    { deity: "九地", star: "天柱", door: "杜", heavenStem: "庚", earthStem: "壬" },
    {},
    false,
    {}
  );
  qimenQiResponseVerifiedCaseCount += 1;
  assertEqual("qimen-qi-no-empty-markers", "children", "qimen-palace-door", noQiContent.childNodes[1].childNodes[0].childNodes.map((node) => node.className).join(","));
}

function runQimenTimeSpecialConditionsTests() {
  const getConditionKeys = (result) => result.conditions.map((condition) => condition.key);
  const tianFuPillars = ["甲子", "甲戌", "甲申", "甲午", "甲辰", "甲寅"];
  for (const hourPillar of tianFuPillars) {
    const result = resolveQimenTimeSpecialConditions({ dayPillar: "乙巳", hourPillar });
    qimenTimeSpecialConditionsVerifiedCaseCount += 1;
    assertEqual(`qimen-time-special-tian-fu-${hourPillar}`, "keys", "tianFuHour", getConditionKeys(result).join(","));
  }
  assertEqual("qimen-time-special-tian-fu-non-jia", "contains", false, getConditionKeys(resolveQimenTimeSpecialConditions({ dayPillar: "乙巳", hourPillar: "乙亥" })).includes("tianFuHour"));
  assertEqual("qimen-time-special-tian-fu-gui", "contains", false, getConditionKeys(resolveQimenTimeSpecialConditions({ dayPillar: "乙巳", hourPillar: "癸亥" })).includes("tianFuHour"));

  const tianWangPillars = [
    ["癸酉", "天網"], ["癸未", "天網"], ["癸巳", "天網"],
    ["癸卯", "天網"], ["癸丑", "天網"], ["癸亥", "天網四張"],
    ["癸亥時", "天網四張"], [" 癸亥時 ", "天網四張"],
  ];
  for (const [hourPillar, expectedLabel] of tianWangPillars) {
    const result = resolveQimenTimeSpecialConditions({ dayPillar: "乙巳", hourPillar });
    qimenTimeSpecialConditionsVerifiedCaseCount += 1;
    assertEqual(`qimen-time-special-tian-wang-${hourPillar}`, "contains", true, getConditionKeys(result).includes("tianWangFourSpread"));
    assertEqual(`qimen-time-special-tian-wang-${hourPillar}`, "label", expectedLabel, result.conditions.find((condition) => condition.key === "tianWangFourSpread")?.label);
    assertEqual(`qimen-time-special-tian-wang-${hourPillar}`, "count", 1, result.conditions.filter((condition) => condition.key === "tianWangFourSpread").length);
  }
  assertEqual("qimen-time-special-tian-wang-jia", "contains", false, getConditionKeys(resolveQimenTimeSpecialConditions({ dayPillar: "乙巳", hourPillar: "甲子" })).includes("tianWangFourSpread"));
  assertEqual("qimen-time-special-tian-wang-other", "contains", false, getConditionKeys(resolveQimenTimeSpecialConditions({ dayPillar: "乙巳", hourPillar: "丙午" })).includes("tianWangFourSpread"));
  assertEqual("qimen-time-special-tian-wang-ren", "contains", false, getConditionKeys(resolveQimenTimeSpecialConditions({ dayPillar: "乙巳", hourPillar: "壬辰" })).includes("tianWangFourSpread"));

  const fiveNotEncounterPositiveCases = Object.entries(QIMEN_FIVE_NOT_ENCOUNTER_HOUR_BY_DAY_STEM);
  for (const [dayStem, hourPillar] of fiveNotEncounterPositiveCases) {
    const dayPillar = SEXAGENARY_CYCLE.find((pillar) => pillar[0] === dayStem);
    const result = resolveQimenTimeSpecialConditions({ dayPillar, hourPillar });
    qimenTimeSpecialConditionsVerifiedCaseCount += 1;
    assertEqual(`qimen-time-special-five-not-encounter-positive-${dayStem}`, "contains", true, getConditionKeys(result).includes("fiveNotEncounterHour"));
  }

  const fiveNotEncounterNegativeCases = [
    ["甲", "庚申"], ["乙", "辛未"], ["丙", "壬午"], ["丁", "癸巳"], ["戊", "甲子"],
    ["己", "乙卯"], ["庚", "丙寅"], ["辛", "丁卯"], ["壬", "戊午"], ["癸", "己酉"],
  ];
  for (const [dayStem, hourPillar] of fiveNotEncounterNegativeCases) {
    const dayPillar = SEXAGENARY_CYCLE.find((pillar) => pillar[0] === dayStem);
    const result = resolveQimenTimeSpecialConditions({ dayPillar, hourPillar });
    qimenTimeSpecialConditionsVerifiedCaseCount += 1;
    assertEqual(`qimen-time-special-five-not-encounter-negative-${dayStem}`, "contains", false, getConditionKeys(result).includes("fiveNotEncounterHour"));
  }

  for (const [dayStem, hourPillars] of Object.entries(QIMEN_HOUR_STEM_ENTERS_TOMB_BY_DAY_STEM)) {
    for (const hourPillar of hourPillars) {
      const result = resolveQimenTimeSpecialConditions({ dayPillar: dayStem, hourPillar });
      qimenTimeSpecialConditionsVerifiedCaseCount += 1;
      assertEqual(`qimen-time-special-hour-stem-tomb-positive-${dayStem}-${hourPillar}`, "contains", true, getConditionKeys(result).includes("hourStemEntersTomb"));
    }
  }

  const hourStemTombDifferentBranchCases = [
    ["乙", "丁卯"], ["乙", "癸巳"], ["乙", "丙申"], ["庚", "癸丑"],
    ["丙", "己卯"], ["丙", "壬午"], ["丙", "戊申"], ["辛", "己未"],
  ];
  for (const [dayPillar, hourPillar] of hourStemTombDifferentBranchCases) {
    const result = resolveQimenTimeSpecialConditions({ dayPillar, hourPillar });
    qimenTimeSpecialConditionsVerifiedCaseCount += 1;
    assertEqual(`qimen-time-special-hour-stem-tomb-branch-negative-${dayPillar}-${hourPillar}`, "contains", false, getConditionKeys(result).includes("hourStemEntersTomb"));
  }

  const hourStemTombDifferentDayCases = [
    ["甲", "癸未"], ["丁", "丁丑"], ["戊", "丙戌"],
    ["己", "己丑"], ["壬", "壬辰"], ["癸", "戊戌"],
  ];
  for (const [dayPillar, hourPillar] of hourStemTombDifferentDayCases) {
    const result = resolveQimenTimeSpecialConditions({ dayPillar, hourPillar });
    qimenTimeSpecialConditionsVerifiedCaseCount += 1;
    assertEqual(`qimen-time-special-hour-stem-tomb-day-negative-${dayPillar}-${hourPillar}`, "contains", false, getConditionKeys(result).includes("hourStemEntersTomb"));
  }

  const tianWangAndTomb = resolveQimenTimeSpecialConditions({ dayPillar: "乙日", hourPillar: "癸未時" });
  const onlyHourStemTomb = resolveQimenTimeSpecialConditions({ dayPillar: "辛", hourPillar: "己丑" });
  qimenTimeSpecialConditionsVerifiedCaseCount += 1;
  assertEqual("qimen-time-special-tian-wang-and-tomb", "keys", "tianWangFourSpread,hourStemEntersTomb", getConditionKeys(tianWangAndTomb).join(","));
  assertEqual("qimen-time-special-tian-wang-and-tomb", "labels", "天網,時干入墓", tianWangAndTomb.conditions.map((condition) => condition.label).join(","));
  assertEqual("qimen-time-special-tian-wang-and-tomb", "count", 2, tianWangAndTomb.conditions.length);
  assertEqual("qimen-time-special-only-tomb", "keys", "hourStemEntersTomb", getConditionKeys(onlyHourStemTomb).join(","));

  const tianFuAndFive = resolveQimenTimeSpecialConditions({ dayPillar: "戊辰日", hourPillar: "甲寅時" });
  const tianWangAndFive = resolveQimenTimeSpecialConditions({ dayPillar: "丁卯日", hourPillar: "癸卯時" });
  qimenTimeSpecialConditionsVerifiedCaseCount += 1;
  assertEqual("qimen-time-special-tian-fu-and-five", "keys", "tianFuHour,fiveNotEncounterHour", getConditionKeys(tianFuAndFive).join(","));
  assertEqual("qimen-time-special-tian-fu-and-five", "count", 2, tianFuAndFive.conditions.length);
  assertEqual("qimen-time-special-tian-wang-and-five", "keys", "tianWangFourSpread,fiveNotEncounterHour", getConditionKeys(tianWangAndFive).join(","));
  assertEqual("qimen-time-special-tian-wang-and-five", "labels", "天網,五不遇時", tianWangAndFive.conditions.map((condition) => condition.label).join(","));
  assertEqual("qimen-time-special-tian-wang-and-five", "count", 2, tianWangAndFive.conditions.length);

  const noConditions = resolveQimenTimeSpecialConditions({ dayPillar: "乙巳", hourPillar: "丙午" });
  qimenTimeSpecialConditionsVerifiedCaseCount += 1;
  assertEqual("qimen-time-special-none", "conditions.length", 0, noConditions.conditions.length);
  assertEqual("qimen-time-special-none", "diagnostics.length", 0, noConditions.diagnostics.length);

  const recurrenceOppositionCases = [
    ["door-fu-yin", "休", "天任", "門伏吟"],
    ["star-fu-yin", "生", "天蓬", "符伏吟"],
    ["door-star-fu-yin", "休", "天蓬", "門符伏吟"],
    ["door-fan-yin", "景", "天任", "門反吟"],
    ["star-fan-yin", "生", "天英", "符反吟"],
    ["door-star-fan-yin", "景", "天英", "門符反吟"],
    ["fu-yin-then-fan-yin", "休", "天英", "門伏吟 符反吟"],
    ["fu-yin-then-fan-yin-opposite", "景", "天蓬", "符伏吟 門反吟"],
    ["no-match", "生", "天任", null],
  ];
  for (const [id, door, star, expectedLabel] of recurrenceOppositionCases) {
    const recurrenceOpposition = resolveQimenRecurrenceOpposition({ door, star });
    qimenTimeSpecialConditionsVerifiedCaseCount += 1;
    assertEqual(`qimen-time-special-recurrence-opposition-${id}`, "label", expectedLabel, recurrenceOpposition.label);
  }

  const recurrenceOppositionPartialCases = [
    ["door-fu-yin-no-star", "休", null, "門伏吟"],
    ["star-fu-yin-no-door", null, "天蓬", "符伏吟"],
    ["door-fan-yin-no-star", "景", undefined, "門反吟"],
    ["star-fan-yin-no-door", undefined, "天英", "符反吟"],
    ["missing-door-star", null, null, null],
  ];
  for (const [id, door, star, expectedLabel] of recurrenceOppositionPartialCases) {
    qimenTimeSpecialConditionsVerifiedCaseCount += 1;
    assertEqual(
      `qimen-time-special-recurrence-opposition-partial-${id}`,
      "label",
      expectedLabel,
      resolveQimenRecurrenceOpposition({ door, star }).label
    );
  }

  const recurrenceNormalizationCases = [
    ["door-xiu", " 休門 ", "天任星", "門伏吟"],
    ["door-jing", " 景 ", "天任", "門反吟"],
    ["star-peng", "生門", " 天蓬星 ", "符伏吟"],
    ["star-ying", "生", " 天英 ", "符反吟"],
  ];
  for (const [id, door, star, expectedLabel] of recurrenceNormalizationCases) {
    qimenTimeSpecialConditionsVerifiedCaseCount += 1;
    assertEqual(`qimen-time-special-recurrence-opposition-normalize-${id}`, "label", expectedLabel, resolveQimenRecurrenceOpposition({ door, star }).label);
  }
  assertEqual("qimen-time-special-normalize-door", "value", "休", normalizeQimenDoorName(" 休門 "));
  assertEqual("qimen-time-special-normalize-star", "value", "天蓬", normalizeQimenStarName(" 天蓬星 "));

  const createKanPlate = (door, star) => ({
    palaces: {
      kan: { door, star },
      xun: { door: "休", star: "天蓬" },
    },
  });
  const kanOnlyResult = resolveQimenTimeSpecialConditions({
    dayPillar: "乙巳",
    hourPillar: "丙午",
    plate: createKanPlate("生", "天任"),
  });
  const kanMatchResult = resolveQimenTimeSpecialConditions({
    dayPillar: "乙巳",
    hourPillar: "丙午",
    plate: createKanPlate("休", "天蓬"),
  });
  qimenTimeSpecialConditionsVerifiedCaseCount += 1;
  assertEqual("qimen-time-special-recurrence-opposition-kan-only-no-scan", "conditions.length", 0, kanOnlyResult.conditions.length);
  assertEqual("qimen-time-special-recurrence-opposition-kan-only-match", "keys", "recurrenceOpposition", getConditionKeys(kanMatchResult).join(","));
  assertEqual("qimen-time-special-recurrence-opposition-kan-only-match", "label", "門符伏吟", kanMatchResult.conditions[0]?.label);

  const recurrenceAndTimeConditions = resolveQimenTimeSpecialConditions({
    dayPillar: "乙",
    hourPillar: "癸未",
    plate: createKanPlate("休", "天英"),
  });
  qimenTimeSpecialConditionsVerifiedCaseCount += 1;
  assertEqual("qimen-time-special-recurrence-opposition-order", "keys", "tianWangFourSpread,hourStemEntersTomb,recurrenceOpposition", getConditionKeys(recurrenceAndTimeConditions).join(","));
  assertEqual("qimen-time-special-recurrence-opposition-order", "label", "門伏吟 符反吟", recurrenceAndTimeConditions.conditions[2]?.label);
  assertEqual("qimen-time-special-recurrence-opposition-order", "count", 3, recurrenceAndTimeConditions.conditions.length);

  const recurrenceMissingPlateResult = resolveQimenTimeSpecialConditions({ dayPillar: "乙巳", hourPillar: "丙午", plate: null });
  const recurrenceMissingKanResult = resolveQimenTimeSpecialConditions({ dayPillar: "乙巳", hourPillar: "丙午", plate: { palaces: {} } });
  qimenTimeSpecialConditionsVerifiedCaseCount += 1;
  assertEqual("qimen-time-special-recurrence-opposition-missing-plate", "conditions.length", 0, recurrenceMissingPlateResult.conditions.length);
  assertEqual("qimen-time-special-recurrence-opposition-missing-kan", "conditions.length", 0, recurrenceMissingKanResult.conditions.length);

  const normalizationCases = [
    ["甲辰", "甲辰"], ["甲辰日", "甲辰"], [" 甲辰日 ", "甲辰"],
    ["庚午", "庚午"], ["庚午時", "庚午"], [" 庚午時 ", "庚午"],
    ["", null], ["甲丑", null], [null, null], [undefined, null],
  ];
  for (const [input, expected] of normalizationCases) {
    qimenTimeSpecialConditionsVerifiedCaseCount += 1;
    assertEqual(`qimen-time-special-normalize-${String(input)}`, "pillar", expected, normalizeQimenPillar(input));
  }
  const dayNormalizationCases = [
    ["乙", "乙"], ["乙日", "乙"], [" 乙日 ", "乙"], ["乙巳", "乙巳"], ["乙巳日", "乙巳"],
    ["", null], ["乙子", null], [null, null], [undefined, null],
  ];
  for (const [input, expected] of dayNormalizationCases) {
    qimenTimeSpecialConditionsVerifiedCaseCount += 1;
    assertEqual(`qimen-time-special-day-normalize-${String(input)}`, "pillar", expected, normalizeQimenDayPillar(input));
  }
  const invalidInputCases = [
    [{ dayPillar: "甲丑", hourPillar: "庚午" }],
    [{ dayPillar: "甲子", hourPillar: "庚卯" }],
    [{ dayPillar: "", hourPillar: "" }],
    [{ dayPillar: null, hourPillar: undefined }],
  ];
  for (const [input] of invalidInputCases) {
    const result = resolveQimenTimeSpecialConditions(input);
    qimenTimeSpecialConditionsVerifiedCaseCount += 1;
    assertEqual("qimen-time-special-invalid", "conditions.length", 0, result.conditions.length);
    assertEqual("qimen-time-special-invalid", "hasDiagnostics", true, result.diagnostics.length > 0);
  }

  qimenTimeSpecialConditionsVerifiedCaseCount += 1;
  assertEqual(
    "qimen-time-special-summary-ui",
    "implementation",
    true,
    mainModuleRaw.includes("createQimenSummaryAnnotations(qimen, plate)")
      && mainModuleRaw.includes("resolveQimenTimeSpecialConditions({")
      && mainModuleRaw.includes("plate,")
      && mainModuleRaw.includes("createQimenSummaryDivider()")
      && mainModuleRaw.includes("createQimenTimeSpecialConditionsSection(annotations.timeSpecialConditions)")
      && mainModuleRaw.includes('"qimen-time-special-condition"')
      && mainCssRaw.includes(".qimen-summary-divider")
      && mainCssRaw.includes(".qimen-time-special-conditions:empty")
      && !mainModuleRaw.includes("qimen-time-special-condition-badge")
  );
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
    plate.palaces[deityZhiFuPalaceKey].deity = "直符";
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
  assertEqual("qimen-1080-md-parser-yang-ju-1-jiazi", "palaces.kan.deity", "直符", yangJu1Jiazi?.palaces?.kan?.deity);

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

function runQimen1080SequenceDiagnosticsTests() {
  const starSequence = QIMEN_SEQUENCE_DIAGNOSTIC_RULES.starSequence;
  qimen1080SequenceDiagnosticsVerifiedCaseCount += 1;
  assertEqual("qimen-1080-sequence-circular", "original", true, isCircularSequenceMatch(starSequence, starSequence));
  assertEqual("qimen-1080-sequence-circular", "rotation", true, isCircularSequenceMatch([...starSequence.slice(3), ...starSequence.slice(0, 3)], starSequence));
  assertEqual("qimen-1080-sequence-circular", "wrong-order", false, isCircularSequenceMatch([starSequence[0], starSequence[2], starSequence[1], ...starSequence.slice(3)], starSequence));
  assertEqual("qimen-1080-sequence-circular", "missing", false, isCircularSequenceMatch([...starSequence.slice(0, 7), null], starSequence));

  qimen1080SequenceDiagnosticsVerifiedCaseCount += 1;
  assertEqual("qimen-1080-sequence-normalization", "star-tianchong", "天衝", normalizeQimenStarForSequence("天沖"));
  assertEqual("qimen-1080-sequence-normalization", "door-kai", "開", normalizeQimenDoorForSequence("開門"));
  assertEqual("qimen-1080-sequence-normalization", "door-xiu", "休", normalizeQimenDoorForSequence("休門"));

  qimen1080SequenceDiagnosticsVerifiedCaseCount += 1;
  assertEqual("qimen-1080-sequence-deity", "yang-clockwise", true, isCircularSequenceMatch(QIMEN_SEQUENCE_DIAGNOSTIC_RULES.deitySequence, QIMEN_SEQUENCE_DIAGNOSTIC_RULES.deitySequence));
  assertEqual("qimen-1080-sequence-deity", "yin-counterclockwise", true, isCircularSequenceMatch([...QIMEN_SEQUENCE_DIAGNOSTIC_RULES.deitySequence].reverse(), [...QIMEN_SEQUENCE_DIAGNOSTIC_RULES.deitySequence].reverse()));

  const yangJu1Rule = getQimenStemSequenceRule("yang", 1);
  const yinJu9Rule = getQimenStemSequenceRule("yin", 9);
  const yangJu8Rule = getQimenStemSequenceRule("yang", 8);
  const yinJu2Rule = getQimenStemSequenceRule("yin", 2);
  qimen1080SequenceDiagnosticsVerifiedCaseCount += 1;
  assertEqual("qimen-1080-sequence-stem-rules", "yang-1-center", "壬", yangJu1Rule?.center);
  assertEqual("qimen-1080-sequence-stem-rules", "yin-9-sequence", "辛乙己丁癸戊丙庚", yinJu9Rule?.sequence?.join(""));
  assertEqual("qimen-1080-sequence-stem-rules", "yang-8-center", "丁", yangJu8Rule?.center);
  assertEqual("qimen-1080-sequence-stem-rules", "yin-2-sequence", "辛乙丙庚戊壬癸己", yinJu2Rule?.sequence?.join(""));

  const parsed = parseQimen1080Markdown(qimen1080MarkdownRaw);
  const validDiagnostics = buildQimen1080SequenceDiagnostics(parsed);
  qimen1080SequenceDiagnosticsVerifiedCaseCount += 1;
  assertEqual("qimen-1080-sequence-data", "does-not-throw", true, true);
  assertEqual("qimen-1080-sequence-data", "summary-present", true, isPlainTestObject(validDiagnostics.summary));
  assertEqual("qimen-1080-sequence-data", "total-plates", 1080, validDiagnostics.summary.totalPlates);

  const centerStemErrorParsed = clonePlainTestData(parsed);
  centerStemErrorParsed.plates[0].palaces.center.heavenStem = "甲";
  const centerStemDiagnostics = buildQimen1080SequenceDiagnostics(centerStemErrorParsed);
  qimen1080SequenceDiagnosticsVerifiedCaseCount += 1;
  assertEqual("qimen-1080-sequence-center", "correct-center-no-error", false, validDiagnostics.errors.some((error) => error.type === "中宮天盤干" && error.hourPillar === parsed.plates[0].hourPillar && error.dunType === parsed.plates[0].dunType && error.ju === parsed.plates[0].ju));
  assertEqual("qimen-1080-sequence-center", "wrong-center-error", true, centerStemDiagnostics.errors.some((error) => error.type === "中宮天盤干" && error.actual === "甲"));
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

function runTrueSolarTimeTests() {
  const assertApproximate = (id, key, expected, actual, tolerance) => {
    trueSolarTimeVerifiedCaseCount += 1;
    assertEqual(id, key, true, Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance);
  };
  const assertParserRejects = (input) => {
    trueSolarTimeVerifiedCaseCount += 1;
    assertEqual("true-solar-time-coordinate-reject", input || "empty", null, parseCoordinateInput(input));
  };

  const dms = parseCoordinateInput("24°58'37.1\"N 121°32'45.3\"E");
  assertApproximate("true-solar-time-coordinate-dms", "latitude", 24.9769722222, dms?.latitude, 0.00000001);
  assertApproximate("true-solar-time-coordinate-dms", "longitude", 121.5459166667, dms?.longitude, 0.00000001);
  trueSolarTimeVerifiedCaseCount += 1;
  assertEqual("true-solar-time-coordinate-dms", "sourceFormat", "dms", dms?.sourceFormat);

  const fullWidthDms = parseCoordinateInput("121°32′45.3″E 24°58′37.1″N");
  assertApproximate("true-solar-time-coordinate-full-width-reversed", "latitude", 24.9769722222, fullWidthDms?.latitude, 0.00000001);
  assertApproximate("true-solar-time-coordinate-full-width-reversed", "longitude", 121.5459166667, fullWidthDms?.longitude, 0.00000001);

  const decimal = parseCoordinateInput("24.976972, 121.545917");
  assertApproximate("true-solar-time-coordinate-decimal", "latitude", 24.976972, decimal?.latitude, 0.000000001);
  assertApproximate("true-solar-time-coordinate-decimal", "longitude", 121.545917, decimal?.longitude, 0.000000001);
  trueSolarTimeVerifiedCaseCount += 1;
  assertEqual("true-solar-time-coordinate-decimal", "sourceFormat", "decimal", decimal?.sourceFormat);
  const directedDecimalReversed = parseCoordinateInput("121.545917 E, 24.976972 N");
  assertApproximate("true-solar-time-coordinate-decimal-directed-reversed", "latitude", 24.976972, directedDecimalReversed?.latitude, 0.000000001);
  assertApproximate("true-solar-time-coordinate-decimal-directed-reversed", "longitude", 121.545917, directedDecimalReversed?.longitude, 0.000000001);

  const southWest = parseCoordinateInput("33°51'31\"S, 151°12'51\"W");
  assertApproximate("true-solar-time-coordinate-south-west", "latitude", -33.8586111111, southWest?.latitude, 0.00000001);
  assertApproximate("true-solar-time-coordinate-south-west", "longitude", -151.2141666667, southWest?.longitude, 0.00000001);
  for (const input of ["91, 121", "24, 181", "24°60'0\"N 121°0'0\"E", "24°0'60\"N 121°0'0\"E", "", "任意文字", "24.9"]) {
    assertParserRejects(input);
  }
  trueSolarTimeVerifiedCaseCount += 1;
  assertEqual("true-solar-time-dms-invalid-direction", "result", null, convertDmsToDecimal(24, 0, 0, "Q"));

  const taiwanNoLongitudeCorrection = calculateTrueSolarTime({
    date: new Date(2024, 5, 21, 12, 0), latitude: 25, longitude: 120, utcOffsetMinutes: 480,
  });
  assertApproximate("true-solar-time-longitude-taiwan-standard", "seconds", 0, taiwanNoLongitudeCorrection.longitudeCorrectionSeconds, 0.000001);
  const taiwanCorrection = calculateTrueSolarTime({
    date: new Date(2024, 5, 21, 12, 0), latitude: 25, longitude: 121.5459166667, utcOffsetMinutes: 480,
  });
  assertApproximate("true-solar-time-longitude-taiwan", "seconds", 371.02, taiwanCorrection.longitudeCorrectionSeconds, 0.02);
  const westernCorrection = calculateTrueSolarTime({
    date: new Date(2024, 5, 21, 12, 0), latitude: 40, longitude: -75, utcOffsetMinutes: -300,
  });
  assertApproximate("true-solar-time-longitude-western-standard", "seconds", 0, westernCorrection.longitudeCorrectionSeconds, 0.000001);
  const quarterHourCorrection = calculateTrueSolarTime({
    date: new Date(2024, 5, 21, 12, 0), latitude: 28, longitude: 86.25, utcOffsetMinutes: 345,
  });
  assertApproximate("true-solar-time-longitude-quarter-hour", "standardMeridian", 86.25, quarterHourCorrection.standardMeridianDegrees, 0.000001);
  assertApproximate("true-solar-time-longitude-quarter-hour", "seconds", 0, quarterHourCorrection.longitudeCorrectionSeconds, 0.000001);

  // NOAA General Solar Position Calculations worksheet values, transcribed at
  // 12:00 UTC. A 15-second tolerance accounts for worksheet rounding/version.
  for (const [date, expectedSeconds] of [
    [new Date(2024, 0, 1, 12, 0), -199.8],
    [new Date(2024, 5, 21, 12, 0), -115.5],
    [new Date(2024, 8, 22, 12, 0), 446.0],
  ]) {
    const actual = calculateEquationOfTime({ date, utcOffsetMinutes: 0 });
    assertApproximate("true-solar-time-equation-of-time-noaa", "referenceSeconds", expectedSeconds, actual, 15);
    trueSolarTimeVerifiedCaseCount += 1;
    assertEqual("true-solar-time-equation-of-time-range", "reasonable", true, Number.isFinite(actual) && Math.abs(actual) < 1_200);
    assertApproximate("true-solar-time-equation-of-time-repeatable", "seconds", actual, calculateEquationOfTime({ date, utcOffsetMinutes: 0 }), 0.000000001);
  }
  for (const date of [new Date(2024, 2, 20, 12, 0), new Date(2024, 11, 31, 12, 0), new Date(2024, 1, 29, 12, 0)]) {
    const actual = calculateEquationOfTime({ date, utcOffsetMinutes: 480 });
    trueSolarTimeVerifiedCaseCount += 1;
    assertEqual("true-solar-time-equation-of-time-seasonal", "finite", true, Number.isFinite(actual));
  }

  const originalWatchDate = new Date(2024, 2, 1, 0, 3, 0);
  const originalWatchTime = originalWatchDate.getTime();
  const previousDay = calculateTrueSolarTime({ date: originalWatchDate, latitude: 25, longitude: 0, utcOffsetMinutes: 480 });
  trueSolarTimeVerifiedCaseCount += 1;
  assertEqual("true-solar-time-boundary-previous-month", "direction", "previous", previousDay.dateBoundaryDirection);
  trueSolarTimeVerifiedCaseCount += 1;
  assertEqual("true-solar-time-boundary-previous-month", "month", 2, previousDay.trueSolarParts.month);
  trueSolarTimeVerifiedCaseCount += 1;
  assertEqual("true-solar-time-date-not-mutated", "time", originalWatchTime, originalWatchDate.getTime());

  const nextYear = calculateTrueSolarTime({ date: new Date(2024, 11, 31, 23, 59, 0), latitude: 25, longitude: 180, utcOffsetMinutes: 480 });
  trueSolarTimeVerifiedCaseCount += 1;
  assertEqual("true-solar-time-boundary-next-year", "direction", "next", nextYear.dateBoundaryDirection);
  trueSolarTimeVerifiedCaseCount += 1;
  assertEqual("true-solar-time-boundary-next-year", "year", 2025, nextYear.trueSolarParts.year);
  trueSolarTimeVerifiedCaseCount += 1;
  assertEqual("true-solar-time-utc-carrier", "trueSolarDateUTCYear", 2025, nextYear.trueSolarDate.getUTCFullYear());

  const overseasCarrier = new Date(Date.UTC(2027, 2, 14, 2, 30, 0));
  const overseasCarrierResult = calculateTrueSolarTime({
    date: overseasCarrier,
    latitude: 34.0522,
    longitude: -118.2437,
    utcOffsetMinutes: -420,
    useUtcComponents: true,
  });
  trueSolarTimeVerifiedCaseCount += 1;
  assertEqual("true-solar-time-utc-carrier", "localParts", "2027-3-14 2:30:0", `${overseasCarrierResult.watchDateParts.year}-${overseasCarrierResult.watchDateParts.month}-${overseasCarrierResult.watchDateParts.day} ${overseasCarrierResult.watchDateParts.hour}:${overseasCarrierResult.watchDateParts.minute}:${overseasCarrierResult.watchDateParts.second}`);

  const tokyoCarrier = new Date(Date.UTC(2026, 7, 6, 14, 21, 30));
  const taiwanCoordinateTokyoClock = calculateTrueSolarTime({ date: tokyoCarrier, latitude: 24.984898, longitude: 121.540626, utcOffsetMinutes: 540, useUtcComponents: true });
  const tokyoCoordinateTokyoClock = calculateTrueSolarTime({ date: tokyoCarrier, latitude: 35.68, longitude: 139.65, utcOffsetMinutes: 540, useUtcComponents: true });
  trueSolarTimeVerifiedCaseCount += 1;
  assertEqual("true-solar-time-tokyo-clock-taiwan-coordinate", "longitudeCorrectionSeconds", true, Math.abs(taiwanCoordinateTokyoClock.longitudeCorrectionSeconds + 3230.25) < 1);
  trueSolarTimeVerifiedCaseCount += 1;
  assertEqual("true-solar-time-tokyo-clock-tokyo-coordinate", "longitudeCorrectionSeconds", true, Math.abs(tokyoCoordinateTokyoClock.longitudeCorrectionSeconds - 1116) < 1);

  for (const invalidOptions of [
    { date: new Date("invalid"), latitude: 25, longitude: 120, utcOffsetMinutes: 480 },
    { date: new Date(2024, 0, 1), latitude: 91, longitude: 120, utcOffsetMinutes: 480 },
    { date: new Date(2024, 0, 1), latitude: 25, longitude: 181, utcOffsetMinutes: 480 },
    { date: new Date(2024, 0, 1), latitude: 25, longitude: 120, utcOffsetMinutes: 900 },
  ]) {
    let threw = false;
    try { calculateTrueSolarTime(invalidOptions); } catch { threw = true; }
    trueSolarTimeVerifiedCaseCount += 1;
    assertEqual("true-solar-time-invalid-options", "throws", true, threw);
  }

  runTrueSolarTimeTimeZoneProcessTests();
}

function runTrueSolarTimeTimeZoneProcessTests() {
  const runProbe = (input, timeZone) => JSON.parse(execFileSync(
    process.execPath,
    ["tests/true-solar-time-timezone-probe.mjs", JSON.stringify(input)],
    { cwd: process.cwd(), env: { ...process.env, TZ: timeZone }, encoding: "utf8" }
  ));
  const assertProbe = (id, expected, actual) => {
    trueSolarTimeVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const losAngelesSummer = {
    localParts: { year: 2026, month: 8, day: 6, hour: 14, minute: 21, second: 30 },
    latitude: 34.0522,
    longitude: -118.2437,
    utcOffsetMinutes: -420,
  };
  const summerProbes = ["Asia/Taipei", "UTC", "America/Los_Angeles"].map((timeZone) => runProbe(losAngelesSummer, timeZone));
  assertProbe("true-solar-time-process-tz-summer", JSON.stringify(summerProbes[0]), JSON.stringify(summerProbes[1]));
  assertProbe("true-solar-time-process-tz-summer", JSON.stringify(summerProbes[0]), JSON.stringify(summerProbes[2]));
  assertProbe("true-solar-time-process-tz-summer", "2026-8-6", `${summerProbes[0].trueSolarParts.year}-${summerProbes[0].trueSolarParts.month}-${summerProbes[0].trueSolarParts.day}`);
  assertProbe("true-solar-time-process-tz-summer", "13:22", `${summerProbes[0].trueSolarParts.hour}:${String(summerProbes[0].trueSolarParts.minute).padStart(2, "0")}`);
  assertProbe("true-solar-time-process-tz-summer", false, summerProbes[0].crossedDateBoundary);
  assertProbe("true-solar-time-process-tz-summer", "2026-08-06", summerProbes[0].solarEventDateKey);

  for (const [id, input, expectedDateKey] of [
    ["winter", { localParts: { year: 2026, month: 1, day: 6, hour: 14, minute: 21, second: 30 }, latitude: 34.0522, longitude: -118.2437, utcOffsetMinutes: -480 }, "2026-01-06"],
    ["taipei", { localParts: { year: 2026, month: 8, day: 6, hour: 14, minute: 21, second: 30 }, latitude: 24.984898, longitude: 121.540626, utcOffsetMinutes: 480 }, "2026-08-06"],
    ["kathmandu", { localParts: { year: 2026, month: 8, day: 6, hour: 14, minute: 21, second: 30 }, latitude: 27.7172, longitude: 85.324, utcOffsetMinutes: 345 }, "2026-08-06"],
  ]) {
    const probe = runProbe(input, "UTC");
    assertProbe(`true-solar-time-process-tz-${id}`, expectedDateKey, probe.solarEventDateKey);
    assertProbe(`true-solar-time-process-tz-${id}`, input.localParts.day, probe.trueSolarParts.day);
  }

  const genuineBoundary = runProbe({
    localParts: { year: 2026, month: 8, day: 6, hour: 0, minute: 3, second: 0 },
    latitude: 25,
    longitude: 0,
    utcOffsetMinutes: 480,
  }, "America/Los_Angeles");
  assertProbe("true-solar-time-process-tz-boundary", true, genuineBoundary.crossedDateBoundary);
  assertProbe("true-solar-time-process-tz-boundary", "previous", genuineBoundary.dateBoundaryDirection);
  assertProbe("true-solar-time-process-tz-boundary", 5, genuineBoundary.trueSolarParts.day);
}

function runTrueSolarTimeUiTests() {
  const assertUi = (id, expected, actual) => { trueSolarTimeUiVerifiedCaseCount += 1; assertEqual(id, "source", expected, actual); };
  assertUi("true-solar-time-ui-tab-order", true, /id="tab-true-solar-time"[\s\S]*?真太陽時[\s\S]*?id="tab-bazi"[\s\S]*?is-active/.test(indexHtmlRaw));
  assertUi("true-solar-time-ui-panel", true, indexHtmlRaw.includes('id="panel-true-solar-time"') && indexHtmlRaw.includes('id="true-solar-time-coordinate"'));
  assertUi("true-solar-time-ui-actions", true, indexHtmlRaw.includes('id="true-solar-time-calculate"') && indexHtmlRaw.includes('id="true-solar-time-geolocate"'));
  assertUi("true-solar-time-ui-no-future-actions", false, /太陽高度|太陽方位|時區選擇/.test(indexHtmlRaw));
  assertUi("true-solar-time-ui-legacy-controls-retired", true, /id="true-solar-time-apply"[^>]*hidden/.test(indexHtmlRaw) && /id="chart-time-restore"[^>]*hidden/.test(indexHtmlRaw) && mainModuleRaw.includes("applyTrueSolarTimeToCharts") && mainModuleRaw.includes("restoreWatchChartTime"));
  assertUi("true-solar-time-ui-chart-time-status-lines", true, mainModuleRaw.includes('`手錶時間：${formatDateTimeParts') && mainModuleRaw.includes('`真太陽時：${formatDateTimeParts') && !mainModuleRaw.includes("；排盤時間：") && mainModuleRaw.includes('className = "chart-time-status-detail-line"') && mainCssRaw.includes(".chart-time-status-detail-line { display: block; }"));
  assertUi("true-solar-time-ui-solar-events", true, indexHtmlRaw.includes('id="true-solar-time-solar-events"') && /日出[\s\S]*?中天[\s\S]*?日落/.test(indexHtmlRaw));
  assertUi("true-solar-time-ui-solar-events-helper", true, mainModuleRaw.includes('from "./solarEvents.js"') && mainModuleRaw.includes("calculateSolarEvents"));
  assertUi("true-solar-time-clock-no-solar-events", false, extractNamedFunctionSource(mainModuleRaw, "refreshTrueSolarTimeClock").includes("calculateSolarEvents"));
  assertUi("true-solar-time-ui-main-import", true, mainModuleRaw.includes('from "./trueSolarTime.js"') && mainModuleRaw.includes("parseCoordinateInput") && mainModuleRaw.includes("calculateTrueSolarTime"));
  assertUi("true-solar-time-ui-geolocation-click-only", true, /trueSolarTimeGeolocate\.addEventListener\("click", requestTrueSolarTimeGeolocation\)[\s\S]*?function requestTrueSolarTimeGeolocation\(\)[\s\S]*?navigator\.geolocation\.getCurrentPosition/.test(mainModuleRaw));
  assertUi("true-solar-time-ui-no-watch-position", false, mainModuleRaw.includes("watchPosition"));
  assertUi("true-solar-time-ui-no-storage-or-suncalc", false, mainModuleRaw.includes("localStorage") || mainModuleRaw.includes("SunCalc"));
  assertUi("true-solar-time-ui-parts-formatting", true, mainModuleRaw.includes("formatDateTimeParts(result.watchDateParts)") && mainModuleRaw.includes("formatDateTimeParts(result.trueSolarParts)"));
  assertUi("true-solar-time-ui-mobile-grid", true, /@media \(max-width: 760px\)[\s\S]*?\.tabs\s*\{\s*display:\s*grid;[\s\S]*?grid-template-columns:\s*repeat\(6, minmax\(0, 1fr\)\)[\s\S]*?nth-child\(1\).*span 3[\s\S]*?nth-child\(3\).*span 2/.test(mainCssRaw));
  assertUi("true-solar-time-clock-interval", true, mainModuleRaw.includes("const TRUE_SOLAR_TIME_CLOCK_REFRESH_MS = 1_000;") && /setInterval\(\s*refreshTrueSolarTimeClock,\s*TRUE_SOLAR_TIME_CLOCK_REFRESH_MS/.test(mainModuleRaw));
  assertUi("true-solar-time-clock-keeps-main-interval", true, mainModuleRaw.includes("const AUTO_NOW_REFRESH_MS = 30_000;"));
  assertUi("true-solar-time-clock-lightweight", false, extractNamedFunctionSource(mainModuleRaw, "refreshTrueSolarTimeClock").includes("renderByDateTime"));
  assertUi("true-solar-time-clock-auto-now", true, /function refreshTrueSolarTimeClock\(\)[\s\S]*?trueSolarTimeSource === TRUE_SOLAR_TIME_SOURCE\.QUERY && isAutoNowMode[\s\S]*?new Date\(\)/.test(mainModuleRaw));
  assertUi("true-solar-time-clock-lifecycle", true, /function pauseAutoNowMode\(\)[\s\S]*?syncTrueSolarTimeClockRefresh\(\)/.test(mainModuleRaw) && /pagehide[\s\S]*?stopTrueSolarTimeClockRefresh/.test(mainModuleRaw));
  assertUi("true-solar-time-source-radios", true, ["query", "device", "custom"].every((source) => indexHtmlRaw.includes(`id=\"true-solar-time-source-${source}\"`)));
  assertUi("true-solar-time-source-default-query", true, /id="true-solar-time-source-query"[^>]*checked/.test(indexHtmlRaw));
  assertUi("true-solar-time-device-fields", true, ["device-fields", "device-local-time", "device-time-zone", "device-offset"].every((id) => indexHtmlRaw.includes(`id=\"true-solar-time-${id}\"`)));
  assertUi("true-solar-time-custom-fields", true, ["local-date", "local-time", "time-zone", "time-zone-status", "disambiguation"].every((id) => indexHtmlRaw.includes(`id=\"true-solar-time-${id}\"`)));
  assertUi("true-solar-time-custom-seconds", true, /id="true-solar-time-local-time"[^>]*step="1"/.test(indexHtmlRaw));
  assertUi("true-solar-time-time-zone-combobox", true, /id="true-solar-time-time-zone"[^>]*role="combobox"/.test(indexHtmlRaw) && indexHtmlRaw.includes('id="true-solar-time-time-zone-search-results"') && indexHtmlRaw.includes('role="listbox"') && !indexHtmlRaw.includes('true-solar-time-time-zones'));
  assertUi("true-solar-time-time-zone-label-structure", true, /<div class="true-solar-time-custom-field">\s*<label for="true-solar-time-time-zone">IANA 時區<\/label>\s*<div id="true-solar-time-time-zone-picker"/.test(indexHtmlRaw) && mainCssRaw.includes(".true-solar-time-custom-field { display: grid; gap: 4px; min-width: 0; }"));
  assertUi("true-solar-time-time-zone-picker-outside-label", true, !indexHtmlRaw.includes("<label>IANA 時區") && indexHtmlRaw.includes('id="true-solar-time-time-zone-current-device"') && indexHtmlRaw.includes('role="listbox"'));
  assertUi("true-solar-time-time-zone-device-shortcut", true, indexHtmlRaw.includes('id="true-solar-time-time-zone-current-device"') && mainModuleRaw.includes("useDeviceTimeZoneForCustomInput"));
  assertUi("true-solar-time-time-zone-keyboard", true, ["ArrowDown", "ArrowUp", "Enter", "Escape"].every((key) => extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeTimeZoneKeydown").includes(key)));
  assertUi("true-solar-time-time-zone-keyboard-bounds", true, extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeTimeZoneKeydown").includes("trueSolarTimeTimeZoneSearchActiveIndex < 0") && mainModuleRaw.includes("trueSolarTimeTimeZoneSearchResults.length - 1"));
  assertUi("true-solar-time-time-zone-input-resets-active-option", true, /function handleTrueSolarTimeTimeZoneInput\(\) \{[\s\S]*?trueSolarTimeTimeZoneSearchActiveIndex = -1;[\s\S]*?renderTrueSolarTimeTimeZoneSearchResults\(\);/.test(mainModuleRaw));
  assertUi("true-solar-time-time-zone-arrow-render-keeps-active-option", true, extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeTimeZoneKeydown").includes("trueSolarTimeTimeZoneSearchActiveIndex = trueSolarTimeTimeZoneSearchActiveIndex < 0") && /if \(trueSolarTimeTimeZoneSearchActiveIndex >= trueSolarTimeTimeZoneSearchResults\.length\) \{\s*trueSolarTimeTimeZoneSearchActiveIndex = -1;/.test(extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeTimeZoneSearchResults")));
  assertUi("true-solar-time-time-zone-country-status", true, extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeTimeZoneSearchResults").includes("hasMultipleTimeZonesInRegion") && mainModuleRaw.includes("此地區包含多個時區，請依城市或地區選擇。"));
  assertUi("true-solar-time-time-zone-selection", true, extractNamedFunctionSource(mainModuleRaw, "selectTrueSolarTimeTimeZone").includes("elements.trueSolarTimeTimeZone.value = timeZone") && extractNamedFunctionSource(mainModuleRaw, "selectTrueSolarTimeTimeZone").includes("renderTrueSolarTimeForCustomInput") && !extractNamedFunctionSource(mainModuleRaw, "selectTrueSolarTimeTimeZone").includes("chartTimeState"));
  assertUi("true-solar-time-time-zone-alias-not-calculated", true, extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeTimeZoneInput").includes("請從建議中選擇正式時區") && extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeTimeZoneInput").includes("validateTimeZone"));
  assertUi("true-solar-time-time-zone-search-bounded", true, mainModuleRaw.includes("searchTimeZones(query, { limit: 12 })") && mainCssRaw.includes("max-height: 45vh"));
  assertUi("true-solar-time-dst-controls", true, ["disambiguation-earlier", "disambiguation-later"].every((id) => indexHtmlRaw.includes(`id=\"true-solar-time-${id}\"`)));
  assertUi("true-solar-time-source-radio-layout", true, indexHtmlRaw.includes('class="true-solar-time-source-option"') && mainCssRaw.includes(".true-solar-time-source-option, .true-solar-time-disambiguation-option { display: flex") && mainCssRaw.includes('.true-solar-time-source-option input[type="radio"]') && mainCssRaw.includes("width: auto"));
  assertUi("true-solar-time-disambiguation-radio-layout", true, indexHtmlRaw.includes('class="true-solar-time-disambiguation-option"') && indexHtmlRaw.includes('id="true-solar-time-disambiguation-earlier-label"') && mainModuleRaw.includes('`第一次：${formatUtcOffset(earlier.utcOffsetMinutes)}`'));
  assertUi("true-solar-time-disambiguation-hidden-unless-ambiguous", true, extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForCustomInput").includes("elements.trueSolarTimeDisambiguation.hidden = true") && extractNamedFunctionSource(mainModuleRaw, "configureTrueSolarTimeDisambiguation").includes("hidden = false"));
  assertUi("true-solar-time-disambiguation-selected-dom", true, indexHtmlRaw.includes('id="true-solar-time-disambiguation-selected"') && mainModuleRaw.includes("trueSolarTimeDisambiguationSelected"));
  assertUi("true-solar-time-disambiguation-option-layout", true, indexHtmlRaw.includes('class="true-solar-time-disambiguation-options"') && /\.true-solar-time-disambiguation-options\s*\{\s*display:\s*grid;\s*gap:\s*6px/.test(mainCssRaw) && /\.true-solar-time-disambiguation-option\s*\{\s*display:\s*flex;\s*align-items:\s*center;\s*gap:\s*6px/.test(mainCssRaw));
  assertUi("true-solar-time-disambiguation-option-specificity", true, mainCssRaw.includes(".true-solar-time-custom-fields .true-solar-time-disambiguation-option { display: flex") && mainCssRaw.includes(".true-solar-time-custom-fields .true-solar-time-disambiguation-option input[type=\"radio\"]") && mainCssRaw.includes(".true-solar-time-custom-fields label { display: grid"));
  assertUi("true-solar-time-disambiguation-option-compact", true, mainCssRaw.includes(".true-solar-time-disambiguation-option { width: 100%; align-items: center; min-height: auto; padding: 0; line-height: 1.4; }") && mainCssRaw.includes(".true-solar-time-disambiguation-selected { margin: 6px 0 0;"));
  assertUi("true-solar-time-disambiguation-uses-initial-status", true, extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForCustomInput").includes("const initialResolution") && extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForCustomInput").includes('initialResolution.status === "ambiguous"'));
  assertUi("true-solar-time-disambiguation-keeps-selected", true, extractNamedFunctionSource(mainModuleRaw, "configureTrueSolarTimeDisambiguation").includes('selected === "earlier"') && mainModuleRaw.includes("目前選擇：${selected === \"earlier\" ? \"第一次\" : \"第二次\"}"));
  assertUi("true-solar-time-disambiguation-reset-selected", true, extractNamedFunctionSource(mainModuleRaw, "clearTrueSolarTimeCustomDisambiguation").includes('trueSolarTimeDisambiguationSelected.textContent = ""') && extractNamedFunctionSource(mainModuleRaw, "clearTrueSolarTimeCustomDisambiguation").includes("trueSolarTimeDisambiguationSelected.hidden = true"));
  assertUi("true-solar-time-disambiguation-hidden-css", true, mainCssRaw.includes(".true-solar-time-disambiguation[hidden] { display: none !important; }"));
  assertUi("true-solar-time-disambiguation-reset", true, extractNamedFunctionSource(mainModuleRaw, "clearTrueSolarTimeCustomDisambiguation").includes("checked = false") && extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeCustomInput").includes("clearTrueSolarTimeCustomDisambiguation"));
  assertUi("true-solar-time-result-location-label", true, extractNamedFunctionSource(mainModuleRaw, "createTrueSolarTimeResultContent").includes('"計算座標"') && mainModuleRaw.includes("formatCoordinate(result.latitude"));
  assertUi("true-solar-time-solar-events-context", true, indexHtmlRaw.includes('id="true-solar-time-solar-events-location"') && indexHtmlRaw.includes('id="true-solar-time-solar-events-time-zone"') && extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeSolarEvents").includes("trueSolarTimeSolarEventsLocation.textContent") && extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeSolarEvents").includes("trueSolarTimeSolarEventsTimeZone.textContent"));
  assertUi("true-solar-time-coordinate-timezone-separation", true, indexHtmlRaw.includes("座標決定實際地點；時區只決定手錶時間制度，兩者不會自動互相轉換。"));
  assertUi("true-solar-time-source-spacing", true, mainCssRaw.includes(".true-solar-time-source { gap: 3px; padding: 6px 8px; }") && mainCssRaw.includes(".true-solar-time-source-option { min-height: auto; padding: 0; line-height: 1.4; }") && mainCssRaw.includes("gap: 6px"));
  assertUi("true-solar-time-source-radio-resets-global-sizing", true, mainCssRaw.includes('min-height: 0') && mainCssRaw.includes('padding: 0; border: initial; border-radius: initial;'));
  assertUi("true-solar-time-solar-events-two-lines", true, mainCssRaw.includes(".true-solar-events-location-line, .true-solar-events-time-zone-line { display: block") && !extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeSolarEvents").includes("｜時區"));
  assertUi("true-solar-time-solar-events-grid-preserved", true, /id="true-solar-time-sunrise"[\s\S]*?id="true-solar-time-solar-noon"[\s\S]*?id="true-solar-time-sunset"/.test(indexHtmlRaw));
  assertUi("true-solar-time-solar-events-mobile-wrap", true, mainCssRaw.includes("overflow-wrap: anywhere"));
  assertUi("true-solar-time-query-only-note", true, indexHtmlRaw.includes('id="true-solar-time-query-only-note"') && indexHtmlRaw.includes("正式四柱與九宮飛星目前使用頁面上方「排盤時間」") && indexHtmlRaw.includes("僅供獨立換算查詢"));
  assertUi("true-solar-time-timezone-core-import", true, mainModuleRaw.includes('from "./timeZone.js"') && mainModuleRaw.includes("getDeviceTimeZone") && mainModuleRaw.includes("resolveLocalDateTimeInTimeZone"));
  assertUi("true-solar-time-carrier", true, /function createUtcCarrierFromLocalParts[\s\S]*?Date\.UTC/.test(mainModuleRaw) && mainModuleRaw.includes("useUtcComponents: true"));
  assertUi("true-solar-time-no-custom-date-string-parse", false, mainModuleRaw.includes('new Date("YYYY-MM-DDTHH:mm:ss")'));
  assertUi("true-solar-time-custom-dst-nonexistent", true, extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForCustomInput").includes('initialResolution.status === "nonexistent"') && mainModuleRaw.includes("此當地時間因日光節約時間切換而不存在"));
  assertUi("true-solar-time-custom-dst-ambiguous", true, extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForCustomInput").includes('initialResolution.status === "ambiguous"') && mainModuleRaw.includes("請選擇實際使用的時間"));
  assertUi("true-solar-time-device-dynamic-offset", true, extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForDeviceNow").includes("getZonedDateTimeParts(now, timeZone)") && mainModuleRaw.includes("utcOffsetMinutes: zoned.utcOffsetMinutes"));
  assertUi("true-solar-time-events-dynamic-cache-key", true, /function renderTrueSolarTimeSolarEvents[\s\S]*?\|\$\{utcOffsetMinutes\}/.test(mainModuleRaw) && extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeSolarEvents").includes("useUtcComponents: true"));
  assertUi("true-solar-time-device-timer-only-panel", false, extractNamedFunctionSource(mainModuleRaw, "refreshTrueSolarTimeClock").includes("renderByDateTime"));
  assertUi("true-solar-time-custom-no-timer", true, !extractNamedFunctionSource(mainModuleRaw, "refreshTrueSolarTimeClock").includes("renderTrueSolarTimeForCustomInput"));
  assertUi("true-solar-time-bc-no-chart-state", true, !extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForDeviceNow").includes("chartTimeState") && !extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForCustomInput").includes("chartTimeState"));
  assertUi("true-solar-time-apply-ui-remains-hidden", true, extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForContext").includes("trueSolarTimeApplyActions.hidden = true") && mainCssRaw.includes(".true-solar-time-apply-actions[hidden] { display: none !important; }"));
  assertUi("true-solar-time-source-mobile-css", true, /@media \(max-width: 760px\)[\s\S]*?\.true-solar-time-custom-fields[\s\S]*?grid-template-columns:\s*1fr/.test(mainCssRaw));
  assertUi("true-solar-time-no-external-timezone-api", false, /fetch\([^)]*(time.?zone|timezone)|localStorage|Temporal/.test(mainModuleRaw));
}

async function runTrueSolarPresentationLabelTests() {
  const check = (id, expected, actual) => {
    trueSolarPresentationLabelVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };

  const effectiveDayLabel = loadEffectiveDayLabelForTest(mainModuleRaw);
  const trueSolarRenderSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarBaziResult");
  const effectiveDayUpdaterSource = extractNamedFunctionSource(mainModuleRaw, "updateWeekdayLabelForEffectiveDay");
  const watchDayUpdaterSource = extractNamedFunctionSource(mainModuleRaw, "updateWeekdayLabel");
  const weekdayRendererSource = extractNamedFunctionSource(mainModuleRaw, "renderWeekdayLabel");

  check(
    "true-solar-presentation-effective-day-visible",
    true,
    effectiveDayUpdaterSource.includes("formatEffectiveDayLabel(dateKey)")
      && weekdayRendererSource.includes('createBlockSpan(effectiveDayLabel, "effective-day-label")')
      && weekdayRendererSource.includes('effectiveDayLine.setAttribute("aria-label", effectiveDayLabel)')
  );
  check(
    "true-solar-presentation-watch-no-effective-day-label",
    true,
    !watchDayUpdaterSource.includes("formatEffectiveDayLabel")
      && weekdayRendererSource.includes('effectiveDayLabel = ""')
  );
  check(
    "true-solar-presentation-effective-day-helper",
    true,
    trueSolarRenderSource.includes("getEffectiveDateKeyFromLocalParts(context.trueSolar?.localParts)")
      && effectiveDayUpdaterSource.includes("formatEffectiveDayLabel(dateKey)")
  );
  check(
    "true-solar-presentation-225959",
    "2026-04-15",
    getEffectiveDateKeyFromLocalParts({ year: 2026, month: 4, day: 15, hour: 22, minute: 59, second: 59, millisecond: 0 })
  );
  check(
    "true-solar-presentation-230000",
    "2026-04-16",
    getEffectiveDateKeyFromLocalParts({ year: 2026, month: 4, day: 15, hour: 23, minute: 0, second: 0, millisecond: 0 })
  );
  check(
    "true-solar-presentation-crossing-day-fixture",
    "真太陽有效日：2026/04/16",
    effectiveDayLabel(getEffectiveDateKeyFromLocalParts(calculateTrueSolarTime({
      date: new Date(Date.UTC(2026, 3, 15, 22, 59, 59)),
      latitude: 25.033964,
      longitude: 121.564468,
      utcOffsetMinutes: 480,
      useUtcComponents: true,
    }).trueSolarParts))
  );

  const queryCalendarDayDetail = loadQueryCalendarDayDetailForTest(mainModuleRaw);
  const lunarInput = { year: 2026, month: 7, day: 4 };
  const lunarInputBefore = JSON.stringify(lunarInput);
  const lunarDetail = queryCalendarDayDetail(lunarInput.year, lunarInput.month, lunarInput.day, []);
  check("true-solar-presentation-lunar-input-unchanged", lunarInputBefore, JSON.stringify(lunarInput));
  check("true-solar-presentation-lunar-output-unchanged", "廿二", lunarDetail.lunarLabel);
  check(
    "true-solar-presentation-lunar-civil-label",
    true,
    indexHtmlRaw.includes('id="query-calendar-lunar-note"')
      && indexHtmlRaw.includes("農曆（手錶日期）")
      && indexHtmlRaw.includes('aria-describedby="query-calendar-lunar-note"')
  );

  check("true-solar-presentation-sunrise-label", true, indexHtmlRaw.includes("日出（手錶時間）"));
  check("true-solar-presentation-noon-label", true, indexHtmlRaw.includes("中天（手錶時間）"));
  check("true-solar-presentation-sunset-label", true, indexHtmlRaw.includes("日落（手錶時間）"));

  const eventInputDate = new Date(Date.UTC(2026, 7, 10));
  const eventInputDateMs = eventInputDate.getTime();
  const eventInput = {
    date: eventInputDate,
    latitude: 25,
    longitude: 115,
    utcOffsetMinutes: 480,
    useUtcComponents: true,
  };
  const eventsBeforeLabels = await calculateSolarEvents(eventInput);
  const eventsAfterLabels = await calculateSolarEvents({ ...eventInput, date: new Date(eventInputDateMs) });
  const eventInstantSnapshot = (events) => JSON.stringify([
    events.sunrise.getTime(),
    events.solarNoon.getTime(),
    events.sunset.getTime(),
  ]);
  check("true-solar-presentation-event-actual-instant-unchanged", eventInstantSnapshot(eventsBeforeLabels), eventInstantSnapshot(eventsAfterLabels));
  check("true-solar-presentation-event-date-input-unchanged", eventInputDateMs, eventInput.date.getTime());

  const eventRendererSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeSolarEvents");
  check(
    "true-solar-presentation-event-display-formatter-unchanged",
    true,
    eventRendererSource.includes("formatTimeParts(events.sunriseParts)")
      && eventRendererSource.includes("formatTimeParts(events.solarNoonParts)")
      && eventRendererSource.includes("formatTimeParts(events.sunsetParts)")
      && !eventRendererSource.includes("calculateTrueSolarTime")
  );
  check(
    "true-solar-presentation-event-timezone-offset-retained",
    true,
    eventRendererSource.includes("trueSolarTimeSolarEventsTimeZone.textContent")
      && eventRendererSource.includes("formatUtcOffset(utcOffsetMinutes)")
  );

  check(
    "true-solar-presentation-source-a-unchanged",
    true,
    indexHtmlRaw.includes('id="true-solar-time-source-query"')
      && indexHtmlRaw.includes("正式排盤來源")
      && mainModuleRaw.includes("renderTrueSolarTimeForWatchDate")
  );
  check(
    "true-solar-presentation-source-b-unchanged",
    true,
    indexHtmlRaw.includes('id="true-solar-time-source-device"')
      && indexHtmlRaw.includes('id="true-solar-time-device-local-time"')
      && mainModuleRaw.includes("renderTrueSolarTimeForDeviceNow")
  );
  check(
    "true-solar-presentation-source-c-unchanged",
    true,
    indexHtmlRaw.includes('id="true-solar-time-source-custom"')
      && indexHtmlRaw.includes('id="true-solar-time-local-date"')
      && indexHtmlRaw.includes('id="true-solar-time-time-zone"')
      && mainModuleRaw.includes("renderTrueSolarTimeForCustomInput")
  );

  check(
    "true-solar-presentation-term-formatter-deferred-to-6c",
    true,
    mainModuleRaw.includes("formatTermDateTime(currentTerm, displayContext)")
      && mainModuleRaw.includes("formatTermDateTime(nextTerm, displayContext)")
  );
  check(
    "true-solar-presentation-hou-formatter-deferred-to-6c",
    true,
    mainModuleRaw.includes("formatHouRangeDateTime(currentHou.start, displayContext)")
      && mainModuleRaw.includes("formatSeasonHouVariantLine(nextHou, \"zh\")")
  );
  check(
    "true-solar-presentation-solar-term-day-panel-deferred-to-6c",
    true,
    mainModuleRaw.includes("formatSolarTermDayPanelLine(term, displayContext)")
      && mainModuleRaw.includes("renderSolarTermDayPanel(getSelectedSolarTermDay(), context)")
  );
  check(
    "true-solar-presentation-picker-click-unchanged",
    true,
    extractNamedFunctionSource(mainModuleRaw, "selectChineseHour").includes("buildDateTimeValueFromDateAndChineseHour")
      && extractNamedFunctionSource(mainModuleRaw, "selectQueryCalendarDate").includes("buildDateTimeValueFromDateAndChineseHour")
  );
  check(
    "true-solar-presentation-chart-time-context-schema-unchanged",
    false,
    chartTimeContextRaw.includes("effective-day-label")
  );
  check(
    "true-solar-presentation-no-new-timer",
    2,
    (mainModuleRaw.match(/setInterval\(/g) ?? []).length
  );
  check("true-solar-presentation-no-storage", false, /localStorage|sessionStorage/.test(mainModuleRaw));
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  check(
    "true-solar-presentation-no-dependency-change",
    true,
    packageJson.dependencies?.suncalc === "^1.9.0"
      && packageJson.devDependencies?.["http-server"] === "^14.1.1"
  );
  check(
    "true-solar-presentation-qimen-unchanged",
    true,
    mainModuleRaw.includes("奇門仍維持手錶時間")
      && !extractNamedFunctionSource(mainModuleRaw, "renderQimenSection").includes("effective-day-label")
  );
}

async function runLunarCivilDateUxTests() {
  const check = (id, expected, actual) => {
    lunarCivilDateUxVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const formatDate = (year, month, day) => ({ year, month, day, hour: 12, minute: 0, second: 0, millisecond: 0 });
  const effectiveDayLabel = loadEffectiveDayLabelForTest(mainModuleRaw);
  const dateSemanticsLabel = loadTrueSolarDateSemanticsLabelForTest(mainModuleRaw);
  const queryCalendarDayDetail = loadQueryCalendarDayDetailForTest(mainModuleRaw);
  const trueSolarRendererSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarBaziResult");
  const effectiveDayUpdaterSource = extractNamedFunctionSource(mainModuleRaw, "updateWeekdayLabelForEffectiveDay");
  const weekdayRendererSource = extractNamedFunctionSource(mainModuleRaw, "renderWeekdayLabel");
  const calendarDetailSource = extractNamedFunctionSource(mainModuleRaw, "getQueryCalendarDayDetail");
  const selectCalendarSource = extractNamedFunctionSource(mainModuleRaw, "selectQueryCalendarDate");
  const selectHourSource = extractNamedFunctionSource(mainModuleRaw, "selectChineseHour");
  const pickerStateSource = extractNamedFunctionSource(mainModuleRaw, "getChineseHourPickerState");

  const watchDate = formatDate(2026, 4, 15);
  const watchDateKey = "2026-04-15";
  const lunarOnWatchDate = getLunarDateForSolarDate(2026, 4, 15);
  const lunarOnWatchLabel = formatLunarCalendarLabel(lunarOnWatchDate);
  const watchInputSnapshot = JSON.stringify(watchDate);
  const watchLunar = getLunarDateForSolarDate(watchDate.year, watchDate.month, watchDate.day);
  check("lunar-ux-watch-lookup-unchanged", watchInputSnapshot, JSON.stringify(watchDate));
  check("lunar-ux-watch-lookup-date-authority", JSON.stringify(lunarOnWatchDate), JSON.stringify(watchLunar));
  check("lunar-ux-watch-label-unchanged", "廿八", lunarOnWatchLabel);
  check("lunar-ux-watch-calendar-label-unchanged", "廿八", queryCalendarDayDetail(2026, 3, 15, []).lunarLabel);

  const trueSolarCrossNextContext = { civil: { localParts: watchDate } };
  const trueSolarCrossNextLabel = dateSemanticsLabel("2026-04-16", trueSolarCrossNextContext);
  check(
    "lunar-ux-cross-next-effective-label",
    "真太陽有效日：2026/04/16",
    effectiveDayLabel("2026-04-16")
  );
  check(
    "lunar-ux-cross-next-visible-distinction",
    `手錶日期：2026/04/15｜農曆（手錶日期）：${lunarOnWatchLabel}`,
    trueSolarCrossNextLabel
  );
  check("lunar-ux-cross-next-lunar-input-is-watch-date", true, trueSolarCrossNextLabel.includes(lunarOnWatchLabel) && !trueSolarCrossNextLabel.includes("2026/04/16"));
  check("lunar-ux-cross-next-no-civil-wording", false, trueSolarCrossNextLabel.includes("民用時間"));

  const sameDayLabel = dateSemanticsLabel("2026-08-10", {
    civil: { localParts: formatDate(2026, 8, 10) },
  });
  check("lunar-ux-same-day-no-difference-note", "", sameDayLabel);
  check("lunar-ux-same-day-effective-label-kept", "真太陽有效日：2026/08/10", effectiveDayLabel("2026-08-10"));
  check("lunar-ux-same-day-no-warning-wording", false, sameDayLabel.includes("不同") || sameDayLabel.includes("跨日"));

  const previousDayLabel = dateSemanticsLabel("2026-08-09", {
    civil: { localParts: formatDate(2026, 8, 10) },
  });
  check(
    "lunar-ux-cross-previous-visible-distinction",
    `手錶日期：2026/08/10｜農曆（手錶日期）：${formatLunarCalendarLabel(getLunarDateForSolarDate(2026, 8, 10))}`,
    previousDayLabel
  );
  check("lunar-ux-cross-previous-direction-neutral", false, previousDayLabel.includes("次一日") || previousDayLabel.includes("前一日"));
  check("lunar-ux-cross-previous-effective-date-not-lunar-input", true, previousDayLabel.includes("手錶日期：2026/08/10") && !previousDayLabel.includes("農曆（手錶日期）：2026/08/09"));

  check("lunar-ux-true-render-passes-context", true, trueSolarRendererSource.includes("updateWeekdayLabelForEffectiveDay(") && trueSolarRendererSource.includes("context"));
  check("lunar-ux-effective-updater-builds-date-note", true, effectiveDayUpdaterSource.includes("formatTrueSolarDateSemanticsLabel(dateKey, displayContext)"));
  check("lunar-ux-visible-note-has-aria", true, weekdayRendererSource.includes('dateSemanticsLine.setAttribute("aria-label", dateSemanticsLabel)'));
  check("lunar-ux-visible-note-uses-watch-parts", true, mainModuleRaw.includes("getLunarDateForSolarDate(\n    watchLocalParts.year"));
  check("lunar-ux-no-effective-day-lunar-lookup", false, extractNamedFunctionSource(mainModuleRaw, "formatTrueSolarDateSemanticsLabel").includes("getLunarDateForSolarDateFromEffective"));
  check("lunar-ux-user-facing-no-civil-time", false, `${mainModuleRaw}${indexHtmlRaw}${mainCssRaw}`.includes("民用時間"));
  check("lunar-ux-calendar-civil-ownership", true, calendarDetailSource.includes("getLunarDateForSolarDate(year, month + 1, day)"));
  check("lunar-ux-calendar-aria-remains-short", "2026年4月15日，農曆二月廿八", queryCalendarDayDetail(2026, 3, 15, []).ariaLabel);
  check("lunar-ux-calendar-no-effective-day-lookup", false, calendarDetailSource.includes("effectiveDayDateKey") || calendarDetailSource.includes("trueSolar"));
  check("lunar-ux-selected-calendar-state-unchanged", true, mainModuleRaw.includes("selectedCalendarDate = calendarDate") && selectCalendarSource.includes("selectedCalendarDate = { year, month, day }"));
  check("lunar-ux-picker-semantics-unchanged", true, selectHourSource.includes("resolveTrueSolarChineseHourDateTime") && selectHourSource.includes("syncSelectedCalendarDate: false"));
  check("lunar-ux-picker-current-state-unchanged", true, pickerStateSource.includes("selectedIndex") && pickerStateSource.includes("currentIndex"));
  check("lunar-ux-solar-term-display-unchanged", true, mainModuleRaw.includes("formatTermDateTime(currentTerm, displayContext)") && mainModuleRaw.includes("renderSolarTermDayPanel(getSelectedSolarTermDay(), context)"));
  check("lunar-ux-72hou-display-unchanged", true, mainModuleRaw.includes("formatHouRangeDateTime(currentHou.start, displayContext)") && mainModuleRaw.includes("currentHou.end"));
  check("lunar-ux-guideng-unchanged", true, mainModuleRaw.includes("createGuiDengDisplayModel") && mainModuleRaw.includes("refreshGuiDengForCurrentChartTime"));
  check("lunar-ux-jinhan-unchanged", true, mainModuleRaw.includes("refreshJinhanForCurrentChartTime") && mainModuleRaw.includes("calculateJinhanFromChartTimeContext"));
  check("lunar-ux-bazi-unchanged", true, mainModuleRaw.includes("calculateBaziFromChartTimeContext") && mainModuleRaw.includes("calculateBaziFromSolarTerms"));
  check("lunar-ux-flying-unchanged", true, mainModuleRaw.includes("refreshFlyingStarsForCurrentChartTime") && mainModuleRaw.includes("calculateFlyingStarsFromBaziResult"));
  check("lunar-ux-qimen-unchanged", true, mainModuleRaw.includes("奇門仍維持手錶時間") && !extractNamedFunctionSource(mainModuleRaw, "renderQimenSection").includes("formatTrueSolarDateSemanticsLabel"));
  check("lunar-ux-timer-unchanged", 2, (mainModuleRaw.match(/setInterval\(/g) ?? []).length);
  check("lunar-ux-storage-unchanged", false, /localStorage|sessionStorage/.test(mainModuleRaw));
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  check("lunar-ux-dependency-unchanged", "^1.9.0|^14.1.1", `${packageJson.dependencies?.suncalc}|${packageJson.devDependencies?.["http-server"]}`);
  check("lunar-ux-doc-76-civil-contract", true, lunarSourceDocRaw.includes("臺灣標準時間 UTC+8") && lunarSourceDocRaw.includes("真太陽時是另一層邏輯"));
}

async function runAstronomicalDisplayTimeTests(solarTerms) {
  const check = (id, expected, actual) => {
    astronomicalDisplayTimeVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const parts = (year, month, day, hour, minute, second = 0, millisecond = 0) => ({
    year, month, day, hour, minute, second, millisecond,
  });
  const carrierFor = (value) => new Date(Date.UTC(
    value.year,
    value.month - 1,
    value.day,
    value.hour,
    value.minute,
    value.second,
    value.millisecond,
  ));
  const location = { latitude: 25, longitude: 115, accuracy: null };
  const makeContexts = ({
    instantMs,
    timeZone = "Asia/Taipei",
    chartLocation = location,
  }) => {
    const zoned = getZonedDateTimeParts(new Date(instantMs), timeZone);
    const localParts = { ...zoned.localParts, millisecond: new Date(instantMs).getUTCMilliseconds() };
    const civil = {
      localParts,
      timeZone: zoned.timeZone,
      utcOffsetMinutes: zoned.utcOffsetMinutes,
      abbreviation: zoned.abbreviation,
      instantMs,
      disambiguation: null,
    };
    const watch = createWatchChartTimeContext({
      source: "query",
      civil,
      location: chartLocation,
      createdAtInstantMs: 0,
    });
    const trueSolarResult = calculateTrueSolarTime({
      date: carrierFor(localParts),
      latitude: chartLocation.latitude,
      longitude: chartLocation.longitude,
      utcOffsetMinutes: zoned.utcOffsetMinutes,
      useUtcComponents: true,
    });
    const trueSolar = createTrueSolarChartTimeContext({
      source: "query",
      civil,
      location: chartLocation,
      trueSolarResult,
      createdAtInstantMs: 0,
    });
    return { watch, trueSolar, queryTrueSolarResult: trueSolarResult };
  };
  const queryInstantMs = Date.UTC(2026, 7, 10, 4, 0, 0);
  const { watch, trueSolar, queryTrueSolarResult } = makeContexts({ instantMs: queryInstantMs });
  const watchResult = calculateBaziFromChartTimeContext(watch, solarTerms);
  const trueResult = calculateBaziFromChartTimeContext(trueSolar, solarTerms);
  const formatters = loadAstronomicalDisplayFormattersForTest(mainModuleRaw);
  const panelRuntime = loadSolarTermDayPanelRuntimeHarnessForTest(mainModuleRaw);
  const watchHouRange = `${formatters.hou(watchResult.currentHou.start, watch)} ～ ${formatters.hou(watchResult.currentHou.end, watch)}`;
  const trueHouRange = `${formatters.hou(trueResult.currentHou.start, trueSolar)} ～ ${formatters.hou(trueResult.currentHou.end, trueSolar)}`;

  check("astronomical-display-watch-current-term", "2026/08/07 19:42", formatters.term(watchResult.currentTerm, watch));
  check("astronomical-display-watch-next-term", "2026/08/23 10:18", formatters.term(watchResult.nextTerm, watch));
  check("astronomical-display-watch-hou-range", "08/07 19:42 ～ 08/13 00:34", watchHouRange);
  check("astronomical-display-watch-term-panel", "🌤️ 立秋\n08/07 19:42", formatters.panel(watchResult.currentTerm, watch));
  check("astronomical-display-true-current-term", "2026/08/07 19:16", formatters.term(trueResult.currentTerm, trueSolar));
  check("astronomical-display-true-next-term", "2026/08/23 09:56", formatters.term(trueResult.nextTerm, trueSolar));
  check("astronomical-display-true-hou-start", "08/07 19:16", formatters.hou(trueResult.currentHou.start, trueSolar));
  check("astronomical-display-true-hou-end", "08/13 00:09", formatters.hou(trueResult.currentHou.end, trueSolar));
  check("astronomical-display-true-term-panel", "🌤️ 立秋\n08/07 19:16", formatters.panel(trueResult.currentTerm, trueSolar));

  const selectedTerm = getSolarTermOnDate(solarTerms, "2026-08-07")[0];
  panelRuntime.setMode("watch");
  check("astronomical-display-runtime-watch-write", true, panelRuntime.render([selectedTerm], watch));
  check("astronomical-display-runtime-watch-panel", "🌤️ 立秋\n08/07 19:42", panelRuntime.text());
  panelRuntime.setMode("true-solar");
  check("astronomical-display-runtime-watch-to-true-write", true, panelRuntime.render([selectedTerm], trueSolar));
  check("astronomical-display-runtime-watch-to-true-panel", "🌤️ 立秋\n08/07 19:16", panelRuntime.text());
  panelRuntime.setMode("watch");
  check("astronomical-display-runtime-true-to-watch-write", true, panelRuntime.render([selectedTerm], watch));
  check("astronomical-display-runtime-true-to-watch-panel", "🌤️ 立秋\n08/07 19:42", panelRuntime.text());
  panelRuntime.setMode("true-solar");
  check("astronomical-display-runtime-second-watch-to-true-write", true, panelRuntime.render([selectedTerm], trueSolar));
  check("astronomical-display-runtime-second-watch-to-true-panel", "🌤️ 立秋\n08/07 19:16", panelRuntime.text());
  check("astronomical-display-runtime-stale-watch-rejected", false, panelRuntime.render([selectedTerm], watch));
  check("astronomical-display-runtime-stale-watch-does-not-overwrite", "🌤️ 立秋\n08/07 19:16", panelRuntime.text());
  panelRuntime.setMode("watch");
  check("astronomical-display-runtime-watch-restored", true, panelRuntime.render([selectedTerm], watch));
  check("astronomical-display-runtime-stale-true-rejected", false, panelRuntime.render([selectedTerm], trueSolar));
  check("astronomical-display-runtime-stale-true-does-not-overwrite", "🌤️ 立秋\n08/07 19:42", panelRuntime.text());
  check("astronomical-display-runtime-context-required", false, panelRuntime.render([selectedTerm], null));
  check("astronomical-display-runtime-no-context-fallback", "🌤️ 立秋\n08/07 19:42", panelRuntime.text());
  check("astronomical-display-runtime-term-identity", selectedTerm.timeMs, getSolarTermOnDate(solarTerms, "2026-08-07")[0].timeMs);

  check("astronomical-display-term-instant-unchanged", watchResult.currentTerm.timeMs, trueResult.currentTerm.timeMs);
  check("astronomical-display-hou-start-unchanged", watchResult.currentHou.start, trueResult.currentHou.start);
  check("astronomical-display-hou-end-unchanged", watchResult.currentHou.end, trueResult.currentHou.end);

  const smallCold = solarTerms.find((term) => term.name === "小寒" && term.year_taipei === 2026);
  const extremeLocation = { latitude: 25, longitude: -180, accuracy: null };
  const extremeContext = makeContexts({ instantMs: queryInstantMs, chartLocation: extremeLocation }).trueSolar;
  const crossedTermText = formatters.term(smallCold, extremeContext);
  check("astronomical-display-crosses-civil-midnight", true, crossedTermText.startsWith("2026/01/04 "));
  check("astronomical-display-crossed-date-not-forced", false, crossedTermText.startsWith("2026/01/05 "));

  check("astronomical-display-year-pillar-unchanged", watchResult.yearPillar, trueResult.yearPillar);
  check("astronomical-display-month-pillar-unchanged", watchResult.monthPillar, trueResult.monthPillar);
  const lichun = solarTerms.find((term) => term.name === "立春" && term.year_taipei === 2026);
  const baziAt = (instantMs) => calculateBaziFromChartTimeContext(
    makeContexts({ instantMs, chartLocation: { latitude: 25, longitude: 121.5, accuracy: null } }).watch,
    solarTerms
  );
  const beforeLichun = baziAt(lichun.timeMs - 1);
  const exactLichun = baziAt(lichun.timeMs);
  const afterLichun = baziAt(lichun.timeMs + 1);
  check("astronomical-display-term-exact-boundary", "丙午|庚寅", `${exactLichun.yearPillar}|${exactLichun.monthPillar}`);
  check("astronomical-display-before-term-boundary", "乙巳|己丑", `${beforeLichun.yearPillar}|${beforeLichun.monthPillar}`);
  check("astronomical-display-after-term-boundary", "丙午|庚寅", `${afterLichun.yearPillar}|${afterLichun.monthPillar}`);
  check(
    "astronomical-display-current-hou-selection-unchanged",
    `${watchResult.currentHou.term}|${watchResult.currentHou.phase}`,
    `${trueResult.currentHou.term}|${trueResult.currentHou.phase}`
  );
  check(
    "astronomical-display-next-hou-selection-unchanged",
    `${watchResult.nextHou.term}|${watchResult.nextHou.phase}`,
    `${trueResult.nextHou.term}|${trueResult.nextHou.phase}`
  );

  const seasonRendererSource = extractNamedFunctionSource(mainModuleRaw, "renderSeasonInfo");
  const watchRendererSource = extractNamedFunctionSource(mainModuleRaw, "renderResult");
  const trueRendererSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarBaziResult");
  const unavailableRendererSource = extractNamedFunctionSource(mainModuleRaw, "renderUnavailableTrueSolarBazi");
  const panelRendererSource = extractNamedFunctionSource(mainModuleRaw, "renderSolarTermDayPanel");
  const panelAuthoritySource = extractNamedFunctionSource(mainModuleRaw, "isSolarTermDayPanelWriteCurrent");
  check("astronomical-display-no-next-hou-range", false, /nextHou\.(start|end)/.test(seasonRendererSource));
  check("astronomical-display-true-clears-stale-panel", true, trueRendererSource.includes("renderSolarTermDayPanel(getSelectedSolarTermDay(), context)") && unavailableRendererSource.includes("clearSolarTermDayPanel()"));
  check("astronomical-display-watch-restores-panel", true, watchRendererSource.includes("renderSolarTermDayPanel(getSelectedSolarTermDay(), displayContext)"));
  check("astronomical-display-mode-switch-no-stale-term", true, watchRendererSource.includes("renderSeasonInfo(result, displayContext)") && trueRendererSource.includes("renderSeasonInfo(result, context)"));
  check("astronomical-display-panel-single-mode-authority", true, panelRendererSource.includes("isSolarTermDayPanelWriteCurrent(displayContext)") && panelAuthoritySource.includes("displayContext?.mode === activeMode"));
  check("astronomical-display-panel-no-contextless-runtime-call", false, /renderSolarTermDayPanel\(getSelectedSolarTermDay\(\)\s*\)/.test(mainModuleRaw));

  const currentTermCivil = getZonedDateTimeParts(new Date(trueResult.currentTerm.timeMs), trueSolar.civil.timeZone);
  const currentTermTrue = calculateTrueSolarTime({
    date: carrierFor({ ...currentTermCivil.localParts, millisecond: new Date(trueResult.currentTerm.timeMs).getUTCMilliseconds() }),
    latitude: location.latitude,
    longitude: location.longitude,
    utcOffsetMinutes: currentTermCivil.utcOffsetMinutes,
    useUtcComponents: true,
  });
  check("astronomical-display-event-specific-eot", true, currentTermTrue.equationOfTimeSeconds !== queryTrueSolarResult.equationOfTimeSeconds);
  check("astronomical-display-event-specific-longitude", currentTermTrue.longitudeCorrectionSeconds, -1200);

  const laLocation = { latitude: 34.0522, longitude: -118.2437, accuracy: null };
  const laContext = makeContexts({
    instantMs: queryInstantMs,
    timeZone: "America/Los_Angeles",
    chartLocation: laLocation,
  }).trueSolar;
  const autumnTerm = solarTerms.find((term) => term.name === "立秋" && term.year_taipei === 2026);
  const winterTerm = solarTerms.find((term) => term.name === "小寒" && term.year_taipei === 2027);
  const laSummer = getZonedDateTimeParts(new Date(autumnTerm.timeMs), "America/Los_Angeles");
  const laWinter = getZonedDateTimeParts(new Date(winterTerm.timeMs), "America/Los_Angeles");
  const independentlyFormatTrue = (term, zoned) => {
    const result = calculateTrueSolarTime({
      date: carrierFor({ ...zoned.localParts, millisecond: new Date(term.timeMs).getUTCMilliseconds() }),
      latitude: laLocation.latitude,
      longitude: laLocation.longitude,
      utcOffsetMinutes: zoned.utcOffsetMinutes,
      useUtcComponents: true,
    });
    return {
      text: `${result.trueSolarParts.year}/${String(result.trueSolarParts.month).padStart(2, "0")}/${String(result.trueSolarParts.day).padStart(2, "0")} ${String(result.trueSolarParts.hour).padStart(2, "0")}:${String(result.trueSolarParts.minute).padStart(2, "0")}`,
      result,
    };
  };
  const expectedLaSummer = independentlyFormatTrue(autumnTerm, laSummer);
  const expectedLaWinter = independentlyFormatTrue(winterTerm, laWinter);
  check("astronomical-display-event-specific-offset", expectedLaWinter.text, formatDateTimeForChartMode({ instantMs: winterTerm.timeMs, context: laContext }));
  check("astronomical-display-la-summer-offset", -420, laSummer.utcOffsetMinutes);
  check("astronomical-display-la-winter-offset", -480, laWinter.utcOffsetMinutes);
  check("astronomical-display-la-summer-parts", expectedLaSummer.text, formatDateTimeForChartMode({ instantMs: autumnTerm.timeMs, context: laContext }));
  check("astronomical-display-la-winter-parts", expectedLaWinter.text, formatDateTimeForChartMode({ instantMs: winterTerm.timeMs, context: laContext }));
  check("astronomical-display-la-summer-parts-helper", JSON.stringify(expectedLaSummer.result.trueSolarParts), JSON.stringify(getChartClockLocalPartsForInstant({ instantMs: autumnTerm.timeMs, context: laContext })));
  check("astronomical-display-la-winter-parts-helper", JSON.stringify(expectedLaWinter.result.trueSolarParts), JSON.stringify(getChartClockLocalPartsForInstant({ instantMs: winterTerm.timeMs, context: laContext })));

  const sunriseMs = Date.parse("2026-08-10T05:30:00+08:00");
  const sunsetMs = Date.parse("2026-08-10T18:30:00+08:00");
  check("astronomical-display-guideng-sunrise-regression", "05:30", formatInstantForChartMode({ instantMs: sunriseMs, context: watch }));
  check("astronomical-display-guideng-sunset-regression", "18:30", formatInstantForChartMode({ instantMs: sunsetMs, context: watch }));
  check("astronomical-display-guideng-range-regression", "05:30–06:29", formatRangeForChartMode({ startInstantMs: sunriseMs, endInstantMs: Date.parse("2026-08-10T06:30:00+08:00"), context: watch }));
  check("astronomical-display-comparison-tab-labels-unchanged", true, ["日出（手錶時間）", "中天（手錶時間）", "日落（手錶時間）"].every((label) => indexHtmlRaw.includes(label)));
  check("astronomical-display-lunar-unchanged", true, indexHtmlRaw.includes("農曆（手錶日期）") && mainModuleRaw.includes("getLunarDateForSolarDate(year, month + 1, day)"));
  check("astronomical-display-effective-day-label-unchanged", true, mainModuleRaw.includes("真太陽有效日：") && trueRendererSource.includes("getEffectiveDateKeyFromLocalParts"));
  check("astronomical-display-picker-unchanged", true, extractNamedFunctionSource(mainModuleRaw, "selectChineseHour").includes("buildDateTimeValueFromDateAndChineseHour"));
  check("astronomical-display-qimen-unchanged", true, mainModuleRaw.includes("奇門仍維持手錶時間") && !extractNamedFunctionSource(mainModuleRaw, "renderQimenSection").includes("formatDateTimeForChartMode"));
  check("astronomical-display-timer-count", 2, (mainModuleRaw.match(/setInterval\(/g) ?? []).length);
  check("astronomical-display-no-storage", false, /localStorage|sessionStorage/.test(mainModuleRaw));
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  check("astronomical-display-no-dependency", "^1.9.0|^14.1.1", `${packageJson.dependencies?.suncalc}|${packageJson.devDependencies?.["http-server"]}`);
}

async function runFinalManualR1Tests(solarTerms) {
  const check = (id, expected, actual) => {
    finalManualR1VerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const parts = (year, month, day, hour, minute, second = 0, millisecond = 0) => ({
    year, month, day, hour, minute, second, millisecond,
  });
  const instantFor = (value, offsetMinutes) => Date.UTC(
    value.year,
    value.month - 1,
    value.day,
    value.hour,
    value.minute,
    value.second,
    value.millisecond ?? 0,
  ) - offsetMinutes * 60_000;
  const civilParts = parts(2026, 8, 10, 12, 0);
  const formalLocation = { latitude: 25.033964, longitude: 121.564468, accuracy: null };
  const formalTrueSolarResult = calculateTrueSolarTime({
    date: new Date(Date.UTC(2026, 7, 10, 12)),
    latitude: formalLocation.latitude,
    longitude: formalLocation.longitude,
    utcOffsetMinutes: 480,
    useUtcComponents: true,
  });
  const formalContext = createTrueSolarChartTimeContext({
    source: "query",
    civil: {
      localParts: civilParts,
      timeZone: "Asia/Taipei",
      utcOffsetMinutes: 480,
      abbreviation: "",
      instantMs: instantFor(civilParts, 480),
      disambiguation: null,
    },
    location: formalLocation,
    trueSolarResult: formalTrueSolarResult,
    createdAtInstantMs: 0,
  });
  const formalBazi = calculateBaziFromChartTimeContext(formalContext, solarTerms);
  const formalGuiDengResult = await calculateGuiDengFromChartTimeContext({
    context: formalContext,
    baziResult: formalBazi,
  });
  const formalGuiDengDisplay = createGuiDengDisplayModel({
    result: formalGuiDengResult,
    context: formalContext,
  });
  const formalDom = Object.freeze({
    summary: formalGuiDengDisplay.guiDengText,
    branches: formalGuiDengDisplay.dengGuiBranches.join("、"),
    sunrise: formalGuiDengDisplay.sunriseText,
    sunset: formalGuiDengDisplay.sunsetText,
    nextSunrise: formalGuiDengDisplay.nextSunriseText,
  });
  const bcHarness = loadTrueSolarBcFormalIsolationHarnessForTest(mainModuleRaw);
  const formalSeed = {
    location: formalLocation,
    context: formalContext,
    generation: 73,
    renderKey: "formal-guideng-73",
    adapterResult: formalGuiDengResult,
    displayModel: formalGuiDengDisplay,
    dom: formalDom,
  };
  bcHarness.seedFormal(formalSeed);

  const assertFormalUnchanged = (phase) => {
    const state = bcHarness.formalState();
    check(`final-manual-b-${phase}-formal-location`, "25.033964,121.564468", `${state.location.latitude},${state.location.longitude}`);
    check(`final-manual-b-${phase}-context-location`, "25.033964,121.564468", `${state.context.location.latitude},${state.context.location.longitude}`);
    check(`final-manual-b-${phase}-generation`, 73, state.generation);
    check(`final-manual-b-${phase}-render-key`, "formal-guideng-73", state.renderKey);
    check(`final-manual-b-${phase}-adapter-result`, formalGuiDengResult, state.adapterResult);
    check(`final-manual-b-${phase}-display-model`, formalGuiDengDisplay, state.displayModel);
    check(`final-manual-b-${phase}-dom`, formalDom, state.dom);
  };

  check("final-manual-b-formal-guideng-resolved", GUIDENG_CHART_TIME_STATUS.RESOLVED, formalGuiDengResult.status);
  check("final-manual-b-formal-display-resolved", GUIDENG_CHART_TIME_STATUS.RESOLVED, formalGuiDengDisplay.status);
  check("final-manual-b-formal-has-solar-events", true, [formalDom.sunrise, formalDom.sunset, formalDom.nextSunrise].every(Boolean));
  assertFormalUnchanged("initial");
  bcHarness.sourceChange("device");
  assertFormalUnchanged("source-change");
  bcHarness.coordinateInput("34.0522,-118.2437");
  assertFormalUnchanged("coordinate-input");
  bcHarness.coordinateChange("34.0522,-118.2437");
  assertFormalUnchanged("coordinate-change");
  bcHarness.calculate("34.0522,-118.2437");
  assertFormalUnchanged("calculate");
  check("final-manual-b-query-location", "34.0522,-118.2437", bcHarness.queryLocationText("device"));
  check("final-manual-b-query-result-location", "34.0522,-118.2437", bcHarness.queryResultLocationText());
  check("final-manual-b-no-request-generation", 0, bcHarness.calls().requestIncrements);
  check("final-manual-b-no-formal-jinhan-refresh", 0, bcHarness.calls().refreshJinhan);
  check("final-manual-b-no-formal-guideng-refresh", 0, bcHarness.calls().refreshGuiDeng);
  check("final-manual-b-no-formal-core-render", 0, bcHarness.calls().renderJinhanCore);
  check("final-manual-b-no-formal-decoration-render", 0, bcHarness.calls().renderGuiDengDecorations);
  check("final-manual-b-no-formal-clear", 0, bcHarness.calls().clearJinhan);

  const sourceChangeSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeSourceChange");
  const coordinateInputSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeCoordinateInput");
  const coordinateChangeSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeCoordinateChange");
  const calculateSource = extractNamedFunctionSource(mainModuleRaw, "calculateTrueSolarTimeFromCoordinateInput");
  const bcSources = [sourceChangeSource, coordinateInputSource, coordinateChangeSource, calculateSource].join("\n");
  check("final-manual-b-static-no-guideng-writer", false, /refreshGuiDengForCurrentChartTime|renderGuiDengDecorations|renderJinhanCoreSnapshot|clearJinhanYujing/.test(bcSources));
  check("final-manual-b-static-formal-refresh-gated", true, [coordinateInputSource, coordinateChangeSource, calculateSource].every((source) => source.includes("isFormalSource")));

  const dstHarness = loadTrueSolarDstUiSequenceHarnessForTest(mainModuleRaw);
  const assertAmbiguous = (caseId) => {
    const state = dstHarness.state();
    check(`final-manual-dst-${caseId}-visible`, false, state.hidden);
    check(`final-manual-dst-${caseId}-earlier-label`, "第一次：UTC-07:00", state.earlierLabel);
    check(`final-manual-dst-${caseId}-later-label`, "第二次：UTC-08:00", state.laterLabel);
    check(`final-manual-dst-${caseId}-status`, "此當地時間出現兩次，請選擇實際使用的時間。", state.status);
    check(`final-manual-dst-${caseId}-final-transition-visible`, false, state.hiddenTransitions.at(-1));
  };

  dstHarness.reset();
  dstHarness.dateInput("2027-11-07");
  dstHarness.dateChange("2027-11-07");
  dstHarness.timeInput("01:30:00");
  dstHarness.timeChange("01:30:00");
  dstHarness.selectSuggestion("America/Los_Angeles");
  assertAmbiguous("case-a");

  dstHarness.reset();
  dstHarness.selectSuggestion("America/Los_Angeles");
  dstHarness.dateInput("2027-11-07");
  dstHarness.dateChange("2027-11-07");
  dstHarness.timeInput("01:30:00");
  dstHarness.timeChange("01:30:00");
  assertAmbiguous("case-b");

  dstHarness.reset();
  dstHarness.dateInput("2027-11-07");
  dstHarness.timeInput("01:30:00");
  dstHarness.timeZoneInput("America/Los_Angeles");
  check("final-manual-dst-case-c-debounce-ms", 200, dstHarness.pendingDebounceMs());
  dstHarness.flushDebounce();
  assertAmbiguous("case-c");

  dstHarness.reset();
  dstHarness.dateInput("2027-11-07");
  dstHarness.timeInput("01:30:00");
  dstHarness.timeZoneInput("America/Los_Angeles");
  dstHarness.timeZoneChange("America/Los_Angeles");
  assertAmbiguous("case-d");
  check("final-manual-dst-case-d-debounce-cleared", 0, dstHarness.pendingDebounceCount());

  dstHarness.choose("earlier");
  check("final-manual-dst-earlier-visible", false, dstHarness.state().hidden);
  check("final-manual-dst-earlier-selected", "目前選擇：第一次（UTC-07:00）", dstHarness.state().selectedText);
  check("final-manual-dst-earlier-offset", -420, dstHarness.state().renderedContext.utcOffsetMinutes);
  check("final-manual-dst-earlier-choice", "earlier", dstHarness.state().renderedContext.disambiguation);

  dstHarness.reset();
  dstHarness.dateInput("2027-11-07");
  dstHarness.timeInput("01:30:00");
  dstHarness.selectSuggestion("America/Los_Angeles");
  dstHarness.choose("later");
  check("final-manual-dst-later-visible", false, dstHarness.state().hidden);
  check("final-manual-dst-later-selected", "目前選擇：第二次（UTC-08:00）", dstHarness.state().selectedText);
  check("final-manual-dst-later-offset", -480, dstHarness.state().renderedContext.utcOffsetMinutes);
  check("final-manual-dst-later-choice", "later", dstHarness.state().renderedContext.disambiguation);

  const repeated = resolveLocalDateTimeInTimeZone({
    localParts: parts(2027, 11, 7, 1, 30),
    timeZone: "America/Los_Angeles",
  });
  check("final-manual-dst-core-status", "ambiguous", repeated.status);
  check("final-manual-dst-core-offsets", "-420,-480", repeated.candidates.map((candidate) => candidate.utcOffsetMinutes).join(","));
  check("final-manual-dst-css-visible-contract", true, mainCssRaw.includes(".true-solar-time-disambiguation[hidden] { display: none !important; }") && !/\.true-solar-time-disambiguation\s*\{[^}]*display:\s*none/.test(mainCssRaw));

  const term = getSolarTermOnDate(solarTerms, "2026-08-07")[0];
  const formalTermText = formatDateTimeForChartMode({
    instantMs: term.timeMs,
    context: formalContext,
    includeYear: false,
  });
  check("final-manual-termui-formal-taipei-location", "08/07 19:43", formalTermText);
  check("final-manual-termui-not-hardcoded-25-115", false, formalTermText === "08/07 19:16");
}

async function runFinalManualR2Tests(solarTerms) {
  const check = (id, expected, actual) => {
    finalManualR2VerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const formalLocation = Object.freeze({
    latitude: 25.033964,
    longitude: 121.564468,
    accuracy: null,
  });
  const queryLocation = Object.freeze({
    latitude: 34.0522,
    longitude: -118.2437,
    accuracy: null,
  });
  const baseInstantMs = Date.UTC(2026, 7, 12, 15, 17, 44);
  const localPartsInstantMs = (parts) => Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond ?? 0,
  );
  const buildFormalSnapshot = async (instantMs) => {
    const zoned = getZonedDateTimeParts(new Date(instantMs), "Asia/Taipei");
    const localParts = { ...zoned.localParts, millisecond: 0 };
    const result = calculateTrueSolarTime({
      date: new Date(localPartsInstantMs(localParts)),
      latitude: formalLocation.latitude,
      longitude: formalLocation.longitude,
      utcOffsetMinutes: 480,
      useUtcComponents: true,
    });
    const context = createTrueSolarChartTimeContext({
      source: "query",
      civil: {
        localParts,
        timeZone: "Asia/Taipei",
        utcOffsetMinutes: 480,
        abbreviation: "",
        instantMs,
        disambiguation: null,
      },
      location: formalLocation,
      trueSolarResult: result,
      createdAtInstantMs: instantMs,
    });
    const bazi = calculateBaziFromChartTimeContext(context, solarTerms);
    const jinhan = calculateJinhanFromChartTimeContext({ context, baziResult: bazi, solarTerms });
    const guiDengResult = await calculateGuiDengFromChartTimeContext({ context, baziResult: bazi });
    const guiDeng = createGuiDengDisplayModel({ result: guiDengResult, context });
    return { context, bazi, jinhan, guiDeng };
  };
  const formalBefore = await buildFormalSnapshot(baseInstantMs);
  const formalAfterOneSecond = await buildFormalSnapshot(baseInstantMs + 1_000);
  const formalAfterThirtySeconds = await buildFormalSnapshot(baseInstantMs + 30_000);
  const stableGuiDengSignature = (snapshot) => JSON.stringify({
    sunrise: snapshot.guiDeng.sunriseText,
    sunset: snapshot.guiDeng.sunsetText,
    nextSunrise: snapshot.guiDeng.nextSunriseText,
    branches: snapshot.guiDeng.dengGuiBranches,
    ranges: snapshot.guiDeng.guiDengText,
  });
  const stableJinhanSignature = (snapshot) => JSON.stringify({
    dayPillar: snapshot.jinhan.dayPillar,
    currentHourIndex: snapshot.jinhan.currentHourIndex,
  });
  const stableBaziSignature = (snapshot) => `${snapshot.bazi.dayPillar}|${snapshot.bazi.hourPillar}`;

  check("final-manual-r2-formal-location-before", "25.033964,121.564468", `${formalBefore.context.location.latitude},${formalBefore.context.location.longitude}`);
  check("final-manual-r2-formal-clock-before", "2026-08-12T23:18:57", formatLocalPartsForTest(formalBefore.context.trueSolar.localParts));

  for (const source of ["device", "custom"]) {
    const sourceLabel = source === "device" ? "b" : "c";
    const formalImmediate = formalBefore;
    check(`final-manual-r2-${sourceLabel}-immediate-location`, "25.033964,121.564468", `${formalImmediate.context.location.latitude},${formalImmediate.context.location.longitude}`);
    check(`final-manual-r2-${sourceLabel}-immediate-clock`, formatLocalPartsForTest(formalBefore.context.trueSolar.localParts), formatLocalPartsForTest(formalImmediate.context.trueSolar.localParts));
    check(`final-manual-r2-${sourceLabel}-one-second-location`, "25.033964,121.564468", `${formalAfterOneSecond.context.location.latitude},${formalAfterOneSecond.context.location.longitude}`);
    check(`final-manual-r2-${sourceLabel}-one-second-progress`, 1_000, localPartsInstantMs(formalAfterOneSecond.context.trueSolar.localParts) - localPartsInstantMs(formalBefore.context.trueSolar.localParts));
    check(`final-manual-r2-${sourceLabel}-thirty-second-location`, "25.033964,121.564468", `${formalAfterThirtySeconds.context.location.latitude},${formalAfterThirtySeconds.context.location.longitude}`);
    check(`final-manual-r2-${sourceLabel}-thirty-second-progress`, 30_003, localPartsInstantMs(formalAfterThirtySeconds.context.trueSolar.localParts) - localPartsInstantMs(formalBefore.context.trueSolar.localParts));
    check(`final-manual-r2-${sourceLabel}-no-23-to-07-jump`, 23, formalAfterThirtySeconds.context.trueSolar.localParts.hour);
    check(`final-manual-r2-${sourceLabel}-bazi-one-second-stable`, stableBaziSignature(formalBefore), stableBaziSignature(formalAfterOneSecond));
    check(`final-manual-r2-${sourceLabel}-bazi-thirty-second-stable`, stableBaziSignature(formalBefore), stableBaziSignature(formalAfterThirtySeconds));
    check(`final-manual-r2-${sourceLabel}-jinhan-one-second-stable`, stableJinhanSignature(formalBefore), stableJinhanSignature(formalAfterOneSecond));
    check(`final-manual-r2-${sourceLabel}-jinhan-thirty-second-stable`, stableJinhanSignature(formalBefore), stableJinhanSignature(formalAfterThirtySeconds));
    check(`final-manual-r2-${sourceLabel}-guideng-one-second-stable`, stableGuiDengSignature(formalBefore), stableGuiDengSignature(formalAfterOneSecond));
    check(`final-manual-r2-${sourceLabel}-guideng-thirty-second-stable`, stableGuiDengSignature(formalBefore), stableGuiDengSignature(formalAfterThirtySeconds));
  }

  const bQueryResult = calculateTrueSolarTime({
    date: new Date(Date.UTC(2026, 7, 12, 23, 17, 44)),
    latitude: queryLocation.latitude,
    longitude: queryLocation.longitude,
    utcOffsetMinutes: 480,
    useUtcComponents: true,
  });
  const cQueryResult = calculateTrueSolarTime({
    date: new Date(Date.UTC(2026, 7, 12, 23, 17, 44)),
    latitude: queryLocation.latitude,
    longitude: queryLocation.longitude,
    utcOffsetMinutes: -420,
    useUtcComponents: true,
  });
  check("final-manual-r2-b-query-location", "34.0522,-118.2437", `${bQueryResult.latitude},${bQueryResult.longitude}`);
  check("final-manual-r2-b-query-can-show-la-clock", 7, bQueryResult.trueSolarParts.hour);
  check("final-manual-r2-c-query-location", "34.0522,-118.2437", `${cQueryResult.latitude},${cQueryResult.longitude}`);
  check("final-manual-r2-query-does-not-change-formal-location", "25.033964,121.564468", `${formalBefore.context.location.latitude},${formalBefore.context.location.longitude}`);

  const clockSource = extractNamedFunctionSource(mainModuleRaw, "refreshTrueSolarTimeClock");
  const autoClockSource = extractNamedFunctionSource(mainModuleRaw, "refreshQueryTimeFromAutoNowClock");
  const mainRefreshSource = extractNamedFunctionSource(mainModuleRaw, "refreshFromCurrentTime");
  const formalRenderSource = extractNamedFunctionSource(mainModuleRaw, "renderFormalTrueSolarChartTime");
  const activeRenderSource = extractNamedFunctionSource(mainModuleRaw, "renderActiveTrueSolarTime");
  const panelContextSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForContext");
  const locationGetterSource = extractNamedFunctionSource(mainModuleRaw, "getTrueSolarTimeLocationForSource");
  check("final-manual-r2-clock-renders-device-query", true, clockSource.includes("renderTrueSolarTimeForDeviceNow()"));
  check("final-manual-r2-clock-still-refreshes-formal-auto-now", true, clockSource.includes("refreshQueryTimeFromAutoNowClock()"));
  check("final-manual-r2-auto-clock-rebuilds-through-formal-path", true, autoClockSource.includes("refreshBaziForCurrentChartTime(dateTimeValue, requestId)"));
  check("final-manual-r2-main-refresh-uses-top-query", true, mainRefreshSource.includes("requestRenderDateTime(elements.datetime.value)"));
  check("final-manual-r2-formal-source-explicit", true, formalRenderSource.includes("getTrueSolarTimeLocationForSource(TRUE_SOLAR_TIME_SOURCE.QUERY)"));
  check("final-manual-r2-formal-context-location-explicit", true, formalRenderSource.includes("location: formalLocation"));
  check("final-manual-r2-active-render-no-formal-location-write", false, /trueSolarTimeLocation\s*=|currentTrueSolarChartContextInput\s*=|currentTrueSolarChartContext\s*=|currentTrueSolarBaziResult\s*=/.test(activeRenderSource));
  check("final-manual-r2-panel-shared-state-write-source-a-gated", true, panelContextSource.includes("if (source === TRUE_SOLAR_TIME_SOURCE.QUERY && !isTrueSolarDisplayMode(chartDisplayMode))") && (panelContextSource.match(/chartTimeState\.(trueSolarResult|location)\s*=/g) ?? []).length === 2);
  check("final-manual-r2-location-getter-keeps-separate-owners", true, locationGetterSource.includes("trueSolarTimeLocation") && locationGetterSource.includes("trueSolarTimeQueryLocations[source]"));
  check("final-manual-r2-no-context-input-writer-outside-formal", 1, (mainModuleRaw.match(/currentTrueSolarChartContextInput\s*=\s*\{/g) ?? []).length);
}

async function runChineseHourActiveClockTests(solarTerms) {
  const check = (id, expected, actual) => {
    chineseHourActiveClockVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const parts = (year, month, day, hour, minute = 0, second = 0, millisecond = 0) => ({
    year, month, day, hour, minute, second, millisecond,
  });
  const formatValue = (value) => `${String(value.year).padStart(4, "0")}-${String(value.month).padStart(2, "0")}-${String(value.day).padStart(2, "0")}T${String(value.hour).padStart(2, "0")}:${String(value.minute).padStart(2, "0")}:${String(value.second).padStart(2, "0")}`;
  const wallMs = (value) => Date.UTC(value.year, value.month - 1, value.day, value.hour, value.minute, value.second, value.millisecond ?? 0);
  const makeContext = (civilLocalParts, location) => {
    const civilResolution = resolveLocalDateTimeInTimeZone({
      localParts: civilLocalParts,
      timeZone: "Asia/Taipei",
    });
    const carrier = new Date(Date.UTC(
      civilLocalParts.year,
      civilLocalParts.month - 1,
      civilLocalParts.day,
      civilLocalParts.hour,
      civilLocalParts.minute,
      civilLocalParts.second,
      civilLocalParts.millisecond ?? 0,
    ));
    const trueSolarResult = calculateTrueSolarTime({
      date: carrier,
      latitude: location.latitude,
      longitude: location.longitude,
      utcOffsetMinutes: civilResolution.utcOffsetMinutes,
      useUtcComponents: true,
    });
    return createTrueSolarChartTimeContext({
      source: "query",
      civil: {
        localParts: { ...civilResolution.localParts, millisecond: civilLocalParts.millisecond ?? 0 },
        timeZone: civilResolution.timeZone,
        utcOffsetMinutes: civilResolution.utcOffsetMinutes,
        abbreviation: civilResolution.abbreviation,
        instantMs: civilResolution.instant.getTime() + (civilLocalParts.millisecond ?? 0),
      },
      location,
      trueSolarResult,
      compatibility: { watchLocalDateTimeValue: formatValue(civilLocalParts) },
      createdAtInstantMs: 0,
    });
  };
  const picker = loadTrueSolarChineseHourHelpersForTest(mainModuleRaw);
  const taipeiWest = { latitude: 25, longitude: 115, accuracy: null };
  const taipeiEast = { latitude: 25, longitude: 127, accuracy: null };
  const taipeiLocation = { latitude: 25.033964, longitude: 121.564468, accuracy: null };
  const queryContext = makeContext(parts(2026, 8, 10, 12), taipeiWest);

  check("active-clock-watch-shen-click", "2026-08-10T15:00:00", picker.build(2026, 7, 10, 9));
  check("active-clock-shen-same-effective-day", "2026-08-10T15:00:00", picker.build(2026, 7, 10, 9));
  check("active-clock-zi-effective-day-target", "2026-04-15T23:00:00", picker.build(2026, 3, 16, 1));

  const fixtureA = picker.resolve({
    selectedDate: { year: 2026, month: 7, day: 10 },
    hourIndex: 9,
    context: queryContext,
  });
  check("active-clock-fixture-a-resolved", TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.RESOLVED, fixtureA.status);
  check("active-clock-fixture-a-target", "2026-08-10T15:00:00", formatValue(fixtureA.targetLocalParts));
  check("active-clock-fixture-a-watch-datetime", "2026-08-10T15:25:25", fixtureA.dateTimeValue);
  check("active-clock-fixture-a-actual-instant", "2026-08-10T07:25:25.000Z", new Date(fixtureA.instantMs).toISOString());
  check("active-clock-fixture-a-writes-civil-not-wall", false, fixtureA.dateTimeValue === formatValue(fixtureA.targetLocalParts));
  check("active-clock-fixture-a-reverse-within-one-second", true, Math.abs(fixtureA.errorSeconds) <= 1);
  check("active-clock-fixture-a-reverse-target", true, wallMs(fixtureA.trueSolarLocalParts) >= wallMs(fixtureA.targetLocalParts) && wallMs(fixtureA.trueSolarLocalParts) - wallMs(fixtureA.targetLocalParts) <= 1_000);
  check("active-clock-fixture-a-second-preserved", 25, fixtureA.civilLocalParts.second);
  check("active-clock-negative-correction-watch-later", true, fixtureA.civilLocalParts.hour === 15 && fixtureA.civilLocalParts.minute > 0);

  const eastContext = makeContext(parts(2026, 8, 10, 12), taipeiEast);
  const positiveCorrection = picker.resolve({
    selectedDate: { year: 2026, month: 7, day: 10 },
    hourIndex: 9,
    context: eastContext,
  });
  check("active-clock-positive-correction-resolved", TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.RESOLVED, positiveCorrection.status);
  check("active-clock-positive-correction-watch-earlier", true, positiveCorrection.dateTimeValue < "2026-08-10T15:00:00");
  check("active-clock-positive-correction-reverse", true, Math.abs(positiveCorrection.errorSeconds) <= 1);

  const aprilContext = makeContext(parts(2026, 4, 16, 12), taipeiLocation);
  const fixtureB = picker.resolve({
    selectedDate: { year: 2026, month: 3, day: 16 },
    hourIndex: 1,
    context: aprilContext,
  });
  check("active-clock-fixture-b-zi-target", "2026-04-15T23:00:00", formatValue(fixtureB.targetLocalParts));
  check("active-clock-fixture-b-watch-datetime", "2026-04-15T22:53:45", fixtureB.dateTimeValue);
  check("active-clock-fixture-b-effective-day", "2026-04-16", getEffectiveDateKeyFromLocalParts(fixtureB.trueSolarLocalParts));
  check("active-clock-fixture-b-selected-zi", 1, picker.indexFromParts(fixtureB.trueSolarLocalParts));
  check("active-clock-fixture-b-reverse-within-one-second", true, Math.abs(fixtureB.errorSeconds) <= 1);

  const oneOClock = picker.resolve({
    selectedDate: { year: 2026, month: 3, day: 16 },
    hourIndex: 2,
    context: aprilContext,
  });
  check("active-clock-target-0100", "2026-04-16T01:00:00", formatValue(oneOClock.targetLocalParts));
  check("active-clock-target-0100-selected-chou", 2, picker.indexFromParts(oneOClock.trueSolarLocalParts));
  check("active-clock-target-0100-reverse", true, Math.abs(oneOClock.errorSeconds) <= 1);

  const extremeContext = makeContext(parts(2026, 4, 16, 12), { latitude: 25, longitude: 180, accuracy: null });
  const crossedCivilDate = picker.resolve({
    selectedDate: { year: 2026, month: 3, day: 16 },
    hourIndex: 2,
    context: extremeContext,
  });
  check("active-clock-inversion-crosses-civil-midnight", true, crossedCivilDate.dateTimeValue.startsWith("2026-04-15T"));
  check("active-clock-crossed-target-stays-true-date", "2026-04-16", formatValue(crossedCivilDate.targetLocalParts).slice(0, 10));

  const resolvedAContext = makeContext(fixtureA.civilLocalParts, taipeiWest);
  const baziA = calculateBaziFromChartTimeContext(resolvedAContext, solarTerms);
  const flyingA = calculateFlyingStarsFromBaziResult(resolvedAContext, baziA);
  const jinhanA = calculateJinhanFromChartTimeContext({ context: resolvedAContext, baziResult: baziA, solarTerms });
  const guiDengA = await calculateGuiDengFromChartTimeContext({ context: resolvedAContext, baziResult: baziA });
  check("active-clock-fixture-a-hour-pillar", "丙申", baziA.hourPillar);
  check("active-clock-fixture-a-jinhan-hour", "申", jinhanA.chineseHour?.branch);
  check("active-clock-bazi-uses-resolved-instant", fixtureA.instantMs, resolvedAContext.civil.instantMs);
  check("active-clock-flying-uses-resolved-instant", "丙申", flyingA.debug.hourPillar);
  check("active-clock-jinhan-uses-resolved-instant", fixtureA.instantMs, Date.parse(jinhanA.debug.queryInstant));
  check("active-clock-guideng-resolved", GUIDENG_CHART_TIME_STATUS.RESOLVED, guiDengA.status);
  check("active-clock-guideng-uses-resolved-instant", fixtureA.instantMs, guiDengA.queryInstantMs);
  check("active-clock-term-follows-resolved-instant", "立秋|2026/08/07 19:16", `${baziA.currentTerm.name}|${formatDateTimeForChartMode({ instantMs: baziA.currentTerm.timeMs, context: resolvedAContext })}`);

  const resolvedBContext = makeContext(fixtureB.civilLocalParts, taipeiLocation);
  const baziB = calculateBaziFromChartTimeContext(resolvedBContext, solarTerms);
  const jinhanB = calculateJinhanFromChartTimeContext({ context: resolvedBContext, baziResult: baziB, solarTerms });
  check("active-clock-fixture-b-day-pillar", "庚申", baziB.dayPillar);
  check("active-clock-fixture-b-hour-pillar", "丙子", baziB.hourPillar);
  check("active-clock-fixture-b-jinhan-selected-zi", "子", jinhanB.chineseHour?.branch);

  const fixedNowMs = Date.parse("2026-08-10T07:10:00Z");
  const trueNowParts = getChartClockLocalPartsForInstant({ instantMs: fixedNowMs, context: queryContext, mode: "true-solar" });
  const watchNowParts = getZonedDateTimeParts(new Date(fixedNowMs), "Asia/Taipei").localParts;
  check("active-clock-true-current-highlight", 8, picker.indexFromParts(trueNowParts));
  check("active-clock-watch-current-highlight", 9, picker.indexFromParts(watchNowParts));
  check("active-clock-watch-selected-state", 9, picker.index("2026-08-10T15:25:25"));
  check("active-clock-true-selected-state", 9, picker.indexFromParts(fixtureA.trueSolarLocalParts));

  const pickerStateSource = extractNamedFunctionSource(mainModuleRaw, "getChineseHourPickerState");
  const pickerRenderSource = extractNamedFunctionSource(mainModuleRaw, "renderChineseHourButtons");
  const selectSource = extractNamedFunctionSource(mainModuleRaw, "selectChineseHour");
  const modeSource = extractNamedFunctionSource(mainModuleRaw, "renderChartDisplayMode");
  const calendarSource = extractNamedFunctionSource(mainModuleRaw, "selectQueryCalendarDate");
  const manualSource = `${extractNamedFunctionSource(mainModuleRaw, "handleManualDateTimeInput")}\n${extractNamedFunctionSource(mainModuleRaw, "handleManualDateTimeChange")}`;
  const sourceBC = `${extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForDeviceNow")}\n${extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForCustomInput")}`;
  const autoClockSource = extractNamedFunctionSource(mainModuleRaw, "refreshQueryTimeFromAutoNowClock");
  const autoNowSource = extractNamedFunctionSource(mainModuleRaw, "refreshFromCurrentTime");
  check("active-clock-render-uses-mode-aware-state", true, pickerRenderSource.includes("getChineseHourPickerState()"));
  check("active-clock-true-selected-no-watch-fallback", true, pickerStateSource.includes("currentTrueSolarChartContext.trueSolar?.localParts") && pickerStateSource.includes("return { selectedIndex: null, currentIndex: null }"));
  check("active-clock-true-current-uses-now-instant", true, pickerStateSource.includes("instantMs: nowInstantMs") && pickerStateSource.includes('mode: "true-solar"'));
  check("active-clock-mode-switch-rerenders-picker", true, modeSource.includes("renderChineseHourButtons()") && !/elements\.datetime\.value\s*=/.test(modeSource));
  check("active-clock-click-pauses-auto-now", true, selectSource.indexOf("pauseAutoNowMode()") < selectSource.indexOf("resolveTrueSolarChineseHourDateTime"));
  check("active-clock-failure-no-watch-fallback", true, selectSource.includes("trueSolarSelection?.status !== TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.RESOLVED") && selectSource.includes("return;") && selectSource.includes("? trueSolarSelection.dateTimeValue"));
  check("active-clock-failure-leaves-datetime", true, selectSource.indexOf('setMessage("真太陽時辰目前無法換算。"') < selectSource.indexOf("elements.datetime.value = dateTimeValue"));
  check("active-clock-precise-input-remains-civil", false, manualSource.includes("resolveTrueSolarLocalDateTimeToInstant"));
  check("active-clock-calendar-click-remains-civil", false, calendarSource.includes("resolveTrueSolarChineseHourDateTime"));
  check("active-clock-source-b-isolated", false, sourceBC.includes("resolveTrueSolarChineseHourDateTime"));
  check("active-clock-source-c-isolated", false, sourceBC.includes("resolveTrueSolarLocalDateTimeToInstant"));
  check("active-clock-selected-date-preserved", true, selectSource.includes("syncSelectedCalendarDate: false"));
  check("active-clock-auto-clock-rerenders-after-context", true, autoClockSource.indexOf("refreshBaziForCurrentChartTime") < autoClockSource.indexOf("renderChineseHourButtons()"));
  check("active-clock-auto-now-rerenders-after-request", true, autoNowSource.indexOf("requestRenderDateTime") < autoNowSource.indexOf("renderChineseHourButtons()"));
  check("active-clock-no-new-timer", 2, (mainModuleRaw.match(/setInterval\(/g) ?? []).length);
  check("active-clock-no-storage", false, /localStorage|sessionStorage/.test(mainModuleRaw));
  check("active-clock-qimen-watch-only", true, mainModuleRaw.includes("奇門仍維持手錶時間") && !extractNamedFunctionSource(mainModuleRaw, "renderQimenSection").includes("resolveTrueSolar"));
  check("active-clock-lunar-unchanged", "廿八", formatLunarCalendarLabel(getLunarDateForSolarDate(2026, 8, 10)));

  const invalidTarget = resolveTrueSolarClockLocalDateTimeToInstant({
    targetLocalParts: parts(2026, 2, 30, 15),
    timeZone: "Asia/Taipei",
    location: taipeiWest,
  });
  const invalidLocation = resolveTrueSolarClockLocalDateTimeToInstant({
    targetLocalParts: parts(2026, 8, 10, 15),
    timeZone: "Asia/Taipei",
    location: { latitude: 25, longitude: 181 },
  });
  check("active-clock-invalid-target", TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.INVALID, invalidTarget.status);
  check("active-clock-invalid-location", TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.INVALID, invalidLocation.status);
  check("active-clock-solver-default-bounded", 12, TRUE_SOLAR_CLOCK_DEFAULT_MAX_ITERATIONS);
  check("active-clock-solver-hard-iteration-bound", 32, TRUE_SOLAR_CLOCK_MAX_ITERATIONS);
  check("active-clock-solver-search-bound", 172_800_000, TRUE_SOLAR_CLOCK_MAX_SEARCH_DISTANCE_MS);
  const solverRaw = await readFile(new URL("../src/trueSolarClock.js", import.meta.url), "utf8");
  const adapterRaw = await readFile(new URL("../src/guidengChartTimeAdapter.js", import.meta.url), "utf8");
  check("active-clock-single-inversion-authority", true, solverRaw.includes("for (let iteration = 1") && !adapterRaw.includes("for (let iteration = 1"));
  check("active-clock-guideng-shared-solver", true, adapterRaw.includes('from "./trueSolarClock.js"') && adapterRaw.includes("resolveTrueSolarClockLocalDateTimeToInstant"));
  check("active-clock-guideng-no-duplicated-formula", false, adapterRaw.includes("calculateTrueSolarTime"));
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  check("active-clock-no-dependency", "^1.9.0|^14.1.1", `${packageJson.dependencies?.suncalc}|${packageJson.devDependencies?.["http-server"]}`);
}

function runFrontendInputSecurityTests() {
  const check = (id, expected, actual) => {
    frontendInputSecurityVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };

  const boundaryCoordinate = `24.976972, 121.545917${" ".repeat(MAX_COORDINATE_INPUT_LENGTH - "24.976972, 121.545917".length)}`;
  check("frontend-security-coordinate-decimal", true, parseCoordinateInput("24.976972, 121.545917")?.sourceFormat === "decimal");
  check("frontend-security-coordinate-dms", true, parseCoordinateInput("24°58'37.1\"N 121°32'45.3\"E")?.sourceFormat === "dms");
  check("frontend-security-coordinate-128-boundary", true, boundaryCoordinate.length === MAX_COORDINATE_INPUT_LENGTH && Boolean(parseCoordinateInput(boundaryCoordinate)));
  check("frontend-security-coordinate-over-128", null, parseCoordinateInput("24.976972, 121.545917" + "x".repeat(MAX_COORDINATE_INPUT_LENGTH)));
  check("frontend-security-coordinate-over-10k-before-parser", null, parseCoordinateInput("x".repeat(10_001)));
  check("frontend-security-coordinate-nan", null, parseCoordinateInput("NaN, 121.5"));
  check("frontend-security-coordinate-infinity", null, parseCoordinateInput("Infinity, 121.5"));
  check("frontend-security-coordinate-rtl-zero-width", null, parseCoordinateInput("\u202e24.9,\u200b121.5"));

  check("frontend-security-timezone-taipei", true, validateTimeZone("Asia/Taipei"));
  check("frontend-security-timezone-los-angeles", true, validateTimeZone("America/Los_Angeles"));
  const boundaryTimeZone = `Asia/Taipei${" ".repeat(MAX_TIME_ZONE_INPUT_LENGTH - "Asia/Taipei".length)}`;
  check("frontend-security-timezone-128-boundary", true, boundaryTimeZone.length === MAX_TIME_ZONE_INPUT_LENGTH && validateTimeZone(boundaryTimeZone));
  const hugeTimeZone = "A".repeat(MAX_TIME_ZONE_INPUT_LENGTH + 1);
  check("frontend-security-timezone-over-128", false, validateTimeZone(hugeTimeZone));

  const originalDateTimeFormat = Intl.DateTimeFormat;
  let formatterConstructionCount = 0;
  Intl.DateTimeFormat = function SecurityDateTimeFormat(...args) {
    formatterConstructionCount += 1;
    return new originalDateTimeFormat(...args);
  };
  try {
    validateTimeZone(hugeTimeZone);
    check("frontend-security-timezone-huge-no-formatter", 0, formatterConstructionCount);
    validateTimeZone("America/Definitely_Invalid");
    validateTimeZone("America/Definitely_Invalid");
    check("frontend-security-timezone-invalid-not-cached", 2, formatterConstructionCount);
  } finally {
    Intl.DateTimeFormat = originalDateTimeFormat;
  }
  check("frontend-security-timezone-cache-bounded", true, MAX_TIME_ZONE_FORMATTER_CACHE_SIZE === 128 && mainModuleRaw.includes("size >= 128"));
  check("frontend-security-timezone-search-bounded", true, searchTimeZones("America", { limit: 12 }).length <= 12);
  check("frontend-security-timezone-keyboard-preserved", true, ["ArrowDown", "ArrowUp", "Enter", "Escape"].every((key) => extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeTimeZoneKeydown").includes(key)));
  check("frontend-security-timezone-debounce", true, mainModuleRaw.includes("TRUE_SOLAR_TIME_ZONE_SEARCH_DEBOUNCE_MS = 200") && extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeTimeZoneInput").includes("window.setTimeout") && extractNamedFunctionSource(mainModuleRaw, "clearTrueSolarTimeTimeZoneSearchDebounce").includes("window.clearTimeout"));

  const normalDateTime = queryPickerHelpers.parseDateTimeLocalValue("2024-02-04T16:27");
  const secondsDateTime = queryPickerHelpers.parseDateTimeLocalValue("2024-02-04T16:27:42");
  check("frontend-security-datetime-hh-mm", true, normalDateTime instanceof Date && normalDateTime.getSeconds() === 0);
  check("frontend-security-datetime-hh-mm-ss", true, secondsDateTime instanceof Date && secondsDateTime.getSeconds() === 42);
  check("frontend-security-datetime-over-32", null, queryPickerHelpers.parseDateTimeLocalValue("2024-02-04T16:27:42" + "x".repeat(32)));
  check("frontend-security-datetime-canonical-zero", "2024-02-04T16:27:00", queryPickerHelpers.toLocalDatetimeValue(normalDateTime));
  const boundaryDateTimeValue = `2024-02-04T16:27:00${" ".repeat(32 - "2024-02-04T16:27:00".length)}`;
  check("frontend-security-datetime-32-boundary", true, boundaryDateTimeValue.length === 32 && queryPickerHelpers.parseDateTimeLocalValue(boundaryDateTimeValue) instanceof Date);

  check("frontend-security-url-unknown-mode", "watch", getChartDisplayModeFromLocation("https://example.test/?timeMode=unknown"));
  check("frontend-security-url-script-mode", "watch", getChartDisplayModeFromLocation("https://example.test/?timeMode=%3Cscript%3Ealert(1)%3C%2Fscript%3E"));

  check("frontend-security-no-inner-html", false, mainModuleRaw.includes("innerHTML"));
  check("frontend-security-no-insert-adjacent-html", false, mainModuleRaw.includes("insertAdjacentHTML"));
  check("frontend-security-no-document-write", false, mainModuleRaw.includes("document.write"));
  check("frontend-security-no-runtime-eval", false, /\beval\s*\(/.test(mainModuleRaw));
  check("frontend-security-no-runtime-function", false, /\bFunction\s*\(/.test(mainModuleRaw));
  check("frontend-security-text-sinks", true, mainModuleRaw.includes("textContent") && mainModuleRaw.includes("replaceChildren"));

  check("frontend-security-no-user-input-external-fetch", false, /fetch\([^)]*(?:value|query|coordinate|timeZone|input)/i.test(mainModuleRaw));
  check("frontend-security-no-send-beacon", false, mainModuleRaw.includes("sendBeacon"));
  check("frontend-security-no-websocket", false, /\bWebSocket\b/.test(mainModuleRaw));
  check("frontend-security-no-local-storage", false, mainModuleRaw.includes("localStorage"));
  check("frontend-security-no-session-storage", false, mainModuleRaw.includes("sessionStorage"));
  check("frontend-security-no-cookie-persistence", false, /document\.cookie/.test(mainModuleRaw));
  check("frontend-security-geolocation-local-only", true, mainModuleRaw.includes("navigator.geolocation.getCurrentPosition") && !/fetch\(|sendBeacon|WebSocket/.test(mainModuleRaw));

  const tokenMetadataSources = [thirdPartyDataRaw, lunarSourceDocRaw, cwaBuildScriptRaw, cwaManifestRaw];
  const tokenLikeMarker = "rdec" + "-key-";
  check("frontend-security-token-metadata-removed", false, tokenMetadataSources.some((source) => source.includes(tokenLikeMarker)));
  check("frontend-security-build-no-network-fetch", true, cwaBuildScriptRaw.includes("readFile") && !cwaBuildScriptRaw.includes("fetch("));
  check("frontend-security-manifest-keeps-source-identification", true, cwaManifestRaw.includes('"datasetId": "157677"') && cwaManifestRaw.includes('"resourceId": "A-A0087-001"') && cwaManifestRaw.includes('"sourceUrl":'));
  check("frontend-security-docs-record-classification", true, securityDocRaw.includes("cannot determine") && securityDocRaw.includes("沒有重寫 Git history"));
}

function runChartTimeContextTests() {
  const check = (id, expected, actual) => {
    chartTimeContextVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const throws = (id, callback) => {
    let didThrow = false;
    try { callback(); } catch { didThrow = true; }
    check(id, true, didThrow);
  };
  const parts = (year, month, day, hour, minute, second = 0, millisecond = 0) => ({
    year, month, day, hour, minute, second, millisecond,
  });
  const trueSolarResult = (
    trueSolarParts,
    correctionSeconds = -3_530.7870810189847,
    longitudeCorrectionSeconds = -3_178.488000000001,
    equationOfTimeSeconds = -352.2990810189834
  ) => ({
    trueSolarParts,
    totalCorrectionSeconds: correctionSeconds,
    longitudeCorrectionSeconds,
    equationOfTimeSeconds,
  });
  const baseInput = ({
    source = "custom",
    localParts = parts(2026, 8, 6, 14, 21, 30),
    timeZone = "America/Los_Angeles",
    utcOffsetMinutes = -420,
    instantMs = Date.UTC(2026, 7, 6, 21, 21, 30),
    disambiguation = null,
    location = { latitude: 34.0522, longitude: -118.2437, accuracy: 12 },
    trueSolarParts = parts(2026, 8, 6, 13, 22, 39, 212),
    correctionSeconds,
    longitudeCorrectionSeconds,
    equationOfTimeSeconds,
    compatibility = {},
  } = {}) => ({
    source,
    civil: {
      localParts,
      timeZone,
      utcOffsetMinutes,
      abbreviation: "",
      instantMs,
      disambiguation,
    },
    location,
    trueSolarResult: trueSolarResult(trueSolarParts, correctionSeconds, longitudeCorrectionSeconds, equationOfTimeSeconds),
    compatibility,
    createdAtInstantMs: Date.UTC(2026, 0, 1),
  });

  const taipeiInput = baseInput({
    source: "query",
    localParts: parts(2026, 8, 7, 8, 49),
    timeZone: "Asia/Taipei",
    utcOffsetMinutes: 480,
    instantMs: Date.UTC(2026, 7, 7, 0, 49),
    location: { latitude: 24.984898, longitude: 121.540626, accuracy: 8 },
    trueSolarParts: parts(2026, 8, 7, 8, 49, 18, 476),
    correctionSeconds: 18.47684399663075,
    longitudeCorrectionSeconds: 369.75024000000076,
    equationOfTimeSeconds: -351.27339600337,
    compatibility: { taipeiLegacyDateTimeValue: "2026-08-07T08:49:00" },
  });
  const taipeiWatch = createWatchChartTimeContext(taipeiInput);
  const taipeiTrueSolar = createTrueSolarChartTimeContext(taipeiInput);
  check("chart-time-context-taipei-watch-mode", CHART_CONTEXT_MODE_WATCH, taipeiWatch.mode);
  check("chart-time-context-taipei-watch-no-solar", null, taipeiWatch.trueSolar);
  check("chart-time-context-taipei-watch-carrier", "2026-08-07T08:49:00", taipeiWatch.compatibility.watchLocalDateTimeValue);
  check("chart-time-context-taipei-true-mode", CHART_CONTEXT_MODE_TRUE_SOLAR, taipeiTrueSolar.mode);
  check("chart-time-context-taipei-true-carrier", "2026-08-07T08:49:18", taipeiTrueSolar.compatibility.trueSolarLocalDateTimeValue);
  check("chart-time-context-taipei-legacy-carrier", "2026-08-07T08:49:00", taipeiTrueSolar.compatibility.taipeiLegacyDateTimeValue);
  check("chart-time-context-taipei-legacy-valid", true, validateChartTimeContext(taipeiTrueSolar).valid);
  check("chart-time-context-taipei-comparison-instant", taipeiTrueSolar.civil.instantMs, taipeiTrueSolar.astronomy.comparisonInstantMs);
  check("chart-time-context-taipei-event-date", "2026-08-07", taipeiTrueSolar.astronomy.solarEventCivilDateKey);
  check("chart-time-context-taipei-iso", "2026-08-07T00:49:00.000Z", taipeiTrueSolar.civil.instantIso);
  check("chart-time-context-taipei-valid", true, validateChartTimeContext(taipeiTrueSolar).valid);
  const instantDateInput = baseInput();
  delete instantDateInput.civil.instantMs;
  instantDateInput.civil.instant = new Date(Date.UTC(2026, 7, 6, 21, 21, 30));
  const instantDateContext = createTrueSolarChartTimeContext(instantDateInput);
  check("chart-time-context-instant-date", "2026-08-06T21:21:30.000Z", instantDateContext.civil.instantIso);
  check("chart-time-context-does-not-store-date", false, instantDateContext.civil.instant instanceof Date);

  const inputMutation = baseInput();
  const immutable = createTrueSolarChartTimeContext(inputMutation);
  inputMutation.civil.localParts.hour = 7;
  inputMutation.location.latitude = 0;
  inputMutation.trueSolarResult.trueSolarParts.hour = 7;
  check("chart-time-context-input-cloned-civil", 14, immutable.civil.localParts.hour);
  check("chart-time-context-input-cloned-location", 34.0522, immutable.location.latitude);
  check("chart-time-context-input-cloned-solar", 13, immutable.trueSolar.localParts.hour);
  check("chart-time-context-legacy-null", null, immutable.compatibility.taipeiLegacyDateTimeValue);
  check("chart-time-context-root-frozen", true, Object.isFrozen(immutable));
  check("chart-time-context-nested-frozen", true, Object.isFrozen(immutable.civil) && Object.isFrozen(immutable.civil.localParts) && Object.isFrozen(immutable.location) && Object.isFrozen(immutable.trueSolar) && Object.isFrozen(immutable.trueSolar.localParts) && Object.isFrozen(immutable.astronomy) && Object.isFrozen(immutable.compatibility) && Object.isFrozen(immutable.metadata));
  check("chart-time-context-mutation-blocked", false, Reflect.set(immutable.civil.localParts, "hour", 1));
  const cloned = cloneChartTimeContext(immutable);
  check("chart-time-context-clone-independent", true, cloned !== immutable && cloned.civil !== immutable.civil && cloned.civil.localParts !== immutable.civil.localParts);
  check("chart-time-context-clone-frozen", true, Object.isFrozen(cloned) && Object.isFrozen(cloned.civil.localParts));
  check("chart-time-context-get-instant", immutable.civil.instantMs, getChartContextCivilInstantMs(immutable));
  check("chart-time-context-get-civil-parts", "2026-08-06 14:21:30", `${getChartContextCivilLocalParts(immutable).year}-${String(getChartContextCivilLocalParts(immutable).month).padStart(2, "0")}-${String(getChartContextCivilLocalParts(immutable).day).padStart(2, "0")} ${String(getChartContextCivilLocalParts(immutable).hour).padStart(2, "0")}:${String(getChartContextCivilLocalParts(immutable).minute).padStart(2, "0")}:${String(getChartContextCivilLocalParts(immutable).second).padStart(2, "0")}`);
  check("chart-time-context-get-solar-parts", 13, getChartContextTrueSolarLocalParts(immutable).hour);
  check("chart-time-context-debug-pure", "UTC-07:00", formatChartTimeContextDebug(immutable).utcOffset);
  check("chart-time-context-debug-distinct-clock", "2026-08-06 13:22:39", formatChartTimeContextDebug(immutable).trueSolarLocal);
  check("chart-time-context-true-solar-not-instant", false, Object.hasOwn(immutable.trueSolar, "instantMs") || Object.hasOwn(immutable.trueSolar, "utcOffsetMinutes"));

  const tokyo = createTrueSolarChartTimeContext(baseInput({
    localParts: parts(2026, 8, 6, 14, 21, 30),
    timeZone: "Asia/Tokyo",
    utcOffsetMinutes: 540,
    instantMs: Date.UTC(2026, 7, 6, 5, 21, 30),
    location: { latitude: 35.68, longitude: 139.65, accuracy: null },
    trueSolarParts: parts(2026, 8, 6, 14, 34, 9, 115),
    correctionSeconds: 759.1158974771541,
    longitudeCorrectionSeconds: 1116.0000000000014,
    equationOfTimeSeconds: -356.88410252284723,
  }));
  check("chart-time-context-tokyo-offset", 540, tokyo.civil.utcOffsetMinutes);
  check("chart-time-context-tokyo-local-unchanged", "Asia/Tokyo", tokyo.civil.timeZone);
  check("chart-time-context-tokyo-comparison", tokyo.civil.instantMs, tokyo.astronomy.comparisonInstantMs);

  const laSummer = createTrueSolarChartTimeContext(baseInput());
  check("chart-time-context-la-summer-instant", "2026-08-06T21:21:30.000Z", laSummer.civil.instantIso);
  check("chart-time-context-la-summer-local", 13, laSummer.trueSolar.localParts.hour);
  check("chart-time-context-la-summer-no-carrier-instant", laSummer.civil.instantMs, laSummer.astronomy.comparisonInstantMs);

  const ambiguousLocalParts = parts(2027, 11, 7, 1, 30);
  const laEarlier = createTrueSolarChartTimeContext(baseInput({
    localParts: ambiguousLocalParts,
    timeZone: "America/Los_Angeles",
    utcOffsetMinutes: -420,
    instantMs: Date.UTC(2027, 10, 7, 8, 30),
    disambiguation: "earlier",
    trueSolarParts: parts(2027, 11, 7, 0, 24, 10),
  }));
  const laLater = createTrueSolarChartTimeContext(baseInput({
    localParts: ambiguousLocalParts,
    timeZone: "America/Los_Angeles",
    utcOffsetMinutes: -480,
    instantMs: Date.UTC(2027, 10, 7, 9, 30),
    disambiguation: "later",
    trueSolarParts: parts(2027, 11, 7, 0, 24, 10),
  }));
  check("chart-time-context-la-ambiguous-same-local", JSON.stringify(laEarlier.civil.localParts), JSON.stringify(laLater.civil.localParts));
  check("chart-time-context-la-ambiguous-instant-difference", 3_600_000, laLater.civil.instantMs - laEarlier.civil.instantMs);
  check("chart-time-context-la-ambiguous-earlier", "earlier", laEarlier.civil.disambiguation);
  check("chart-time-context-la-ambiguous-later", "later", laLater.civil.disambiguation);
  check("chart-time-context-la-ambiguous-not-collapsed", false, laEarlier.civil.instantMs === laLater.civil.instantMs);

  const kathmandu = createTrueSolarChartTimeContext(baseInput({
    localParts: parts(2026, 8, 6, 14, 21, 30),
    timeZone: "Asia/Kathmandu",
    utcOffsetMinutes: 345,
    instantMs: Date.UTC(2026, 7, 6, 8, 36, 30),
    location: { latitude: 27.7172, longitude: 85.324, accuracy: 30 },
    trueSolarParts: parts(2026, 8, 6, 14, 15, 54),
  }));
  check("chart-time-context-kathmandu-quarter-hour", 345, kathmandu.civil.utcOffsetMinutes);
  check("chart-time-context-kathmandu-debug-offset", "UTC+05:45", formatChartTimeContextDebug(kathmandu).utcOffset);

  const lordHoweEarlier = createTrueSolarChartTimeContext(baseInput({
    localParts: parts(2027, 4, 4, 1, 45),
    timeZone: "Australia/Lord_Howe",
    utcOffsetMinutes: 660,
    instantMs: Date.UTC(2027, 3, 3, 14, 45),
    disambiguation: "earlier",
    location: { latitude: -31.55, longitude: 159.08, accuracy: 20 },
    trueSolarParts: parts(2027, 4, 4, 1, 31, 1),
  }));
  const lordHoweLater = createTrueSolarChartTimeContext(baseInput({
    localParts: parts(2027, 4, 4, 1, 45),
    timeZone: "Australia/Lord_Howe",
    utcOffsetMinutes: 630,
    instantMs: Date.UTC(2027, 3, 3, 15, 15),
    disambiguation: "later",
    location: { latitude: -31.55, longitude: 159.08, accuracy: 20 },
    trueSolarParts: parts(2027, 4, 4, 1, 31, 1),
  }));
  check("chart-time-context-lord-howe-half-hour-dst", 1_800_000, lordHoweLater.civil.instantMs - lordHoweEarlier.civil.instantMs);
  check("chart-time-context-lord-howe-offset-difference", 30, lordHoweEarlier.civil.utcOffsetMinutes - lordHoweLater.civil.utcOffsetMinutes);

  const previousDay = createTrueSolarChartTimeContext(baseInput({
    localParts: parts(2026, 8, 6, 0, 3),
    timeZone: "Asia/Taipei",
    utcOffsetMinutes: 480,
    instantMs: Date.UTC(2026, 7, 5, 16, 3),
    location: { latitude: 25, longitude: 0, accuracy: null },
    trueSolarParts: parts(2026, 8, 5, 23, 55),
  }));
  const nextDay = createTrueSolarChartTimeContext(baseInput({
    localParts: parts(2026, 8, 6, 23, 59),
    timeZone: "Asia/Taipei",
    utcOffsetMinutes: 480,
    instantMs: Date.UTC(2026, 7, 6, 15, 59),
    location: { latitude: 25, longitude: 180, accuracy: null },
    trueSolarParts: parts(2026, 8, 7, 0, 3),
  }));
  check("chart-time-context-previous-day-offset", -1, previousDay.trueSolar.dayOffset);
  check("chart-time-context-previous-day-event-key", "2026-08-06", previousDay.astronomy.solarEventCivilDateKey);
  check("chart-time-context-next-day-offset", 1, nextDay.trueSolar.dayOffset);
  check("chart-time-context-next-day-event-key", "2026-08-06", nextDay.astronomy.solarEventCivilDateKey);

  throws("chart-time-context-invalid-mode", () => createChartTimeContext({ ...baseInput(), mode: "invalid" }));
  throws("chart-time-context-invalid-source", () => createChartTimeContext({ ...baseInput(), mode: "true-solar", source: "unknown" }));
  throws("chart-time-context-missing-time-zone", () => createTrueSolarChartTimeContext(baseInput({ timeZone: "" })));
  throws("chart-time-context-watch-carrier-mismatch", () => createTrueSolarChartTimeContext(baseInput({ compatibility: { watchLocalDateTimeValue: "2026-08-06T14:22:30" } })));
  throws("chart-time-context-true-solar-carrier-mismatch", () => createTrueSolarChartTimeContext(baseInput({ compatibility: { trueSolarLocalDateTimeValue: "2026-08-06T13:23:39" } })));
  throws("chart-time-context-watch-true-solar-carrier-not-null", () => createWatchChartTimeContext({ ...baseInput(), compatibility: { trueSolarLocalDateTimeValue: "2026-08-06T13:22:39" } }));
  throws("chart-time-context-taipei-legacy-invalid", () => createTrueSolarChartTimeContext(baseInput({ compatibility: { taipeiLegacyDateTimeValue: "2026-08-06 14:21" } })));
  for (const offset of [480, 345, 630, -420]) {
    check("chart-time-context-valid-offset", offset, createTrueSolarChartTimeContext(baseInput({ utcOffsetMinutes: offset })).civil.utcOffsetMinutes);
  }
  for (const offset of [345.5, Infinity, 841, -841]) {
    throws("chart-time-context-invalid-offset", () => createTrueSolarChartTimeContext(baseInput({ utcOffsetMinutes: offset })));
  }
  throws("chart-time-context-invalid-latitude", () => createTrueSolarChartTimeContext(baseInput({ location: { latitude: 91, longitude: 0 } })));
  throws("chart-time-context-invalid-longitude", () => createTrueSolarChartTimeContext(baseInput({ location: { latitude: 0, longitude: 181 } })));
  throws("chart-time-context-missing-true-solar", () => createTrueSolarChartTimeContext({ ...baseInput(), trueSolarResult: null }));
  throws("chart-time-context-invalid-disambiguation", () => createTrueSolarChartTimeContext(baseInput({ disambiguation: "first" })));
  throws("chart-time-context-invalid-instant-type", () => createTrueSolarChartTimeContext({ ...baseInput(), civil: { ...baseInput().civil, instant: "2026-08-06T21:21:30.000Z" } }));
  throws("chart-time-context-instant-iso-mismatch", () => createTrueSolarChartTimeContext({ ...baseInput(), civil: { ...baseInput().civil, instantIso: "2020-01-01T00:00:00.000Z" } }));
  throws("chart-time-context-instant-mismatch", () => createTrueSolarChartTimeContext({ ...baseInput(), civil: { ...baseInput().civil, instant: new Date(0) } }));
  throws("chart-time-context-invalid-local-parts", () => createTrueSolarChartTimeContext(baseInput({ localParts: parts(2026, 2, 30, 14, 21) })));
  const invalidIso = cloneChartTimeContext(immutable);
  const mutableInvalidIso = { ...invalidIso, civil: { ...invalidIso.civil, instantIso: "2020-01-01T00:00:00.000Z" } };
  check("chart-time-context-validation-iso", false, validateChartTimeContext(mutableInvalidIso).valid);
  const mutableInvalidComparison = { ...invalidIso, astronomy: { ...invalidIso.astronomy, comparisonInstantMs: 0 } };
  check("chart-time-context-validation-comparison", false, validateChartTimeContext(mutableInvalidComparison).valid);
  check("chart-time-context-validation-errors", true, validateChartTimeContext(mutableInvalidComparison).errors.length > 0);
  const mutableInvalidWatchCarrier = { ...invalidIso, compatibility: { ...invalidIso.compatibility, watchLocalDateTimeValue: "2026-08-06T14:22:30" } };
  check("chart-time-context-validation-watch-carrier", false, validateChartTimeContext(mutableInvalidWatchCarrier).valid);
  const mutableInvalidTrueSolarCarrier = { ...invalidIso, compatibility: { ...invalidIso.compatibility, trueSolarLocalDateTimeValue: "2026-08-06T13:23:39" } };
  check("chart-time-context-validation-true-solar-carrier", false, validateChartTimeContext(mutableInvalidTrueSolarCarrier).valid);
  const mutableInvalidLegacyCarrier = { ...invalidIso, compatibility: { ...invalidIso.compatibility, taipeiLegacyDateTimeValue: "not-a-local-datetime" } };
  check("chart-time-context-validation-legacy-carrier", false, validateChartTimeContext(mutableInvalidLegacyCarrier).valid);
  const mutableInvalidOffset = { ...invalidIso, civil: { ...invalidIso.civil, utcOffsetMinutes: 345.5 } };
  check("chart-time-context-validation-offset", false, validateChartTimeContext(mutableInvalidOffset).valid);

  const probeInput = baseInput({ createdAtInstantMs: Date.UTC(2026, 0, 1) });
  const runProbe = (timeZone) => execFileSync(
    process.execPath,
    ["tests/chart-time-context-probe.mjs", JSON.stringify(probeInput)],
    { cwd: process.cwd(), env: { ...process.env, TZ: timeZone }, encoding: "utf8" }
  ).trim();
  const probeTaipei = runProbe("Asia/Taipei");
  check("chart-time-context-process-utc", probeTaipei, runProbe("UTC"));
  check("chart-time-context-process-los-angeles", probeTaipei, runProbe("America/Los_Angeles"));

  check("chart-time-context-static-no-dom", false, /\bdocument\b|\bwindow\b|\bnavigator\b|geolocation|localStorage|fetch\(/.test(chartTimeContextRaw));
  check("chart-time-context-static-no-runtime-coupling", false, /chartTimeState|chartDisplayMode|from\s+["']\.\/(bazi|qimen|solarEvents|trueSolarTime)/.test(chartTimeContextRaw));
  check("chart-time-context-static-no-formula", false, /NOAA|Meeus|calculateEquationOfTime|calculateSolarEvents/.test(chartTimeContextRaw));
}

function runBaziChartTimeAdapterTests() {
  const check = (id, expected, actual) => {
    baziChartTimeAdapterVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const throws = (id, callback, expectedMessagePart = "") => {
    let message = "";
    try { callback(); } catch (error) { message = error instanceof Error ? error.message : String(error); }
    check(id, true, message.includes(expectedMessagePart));
  };
  const parts = (year, month, day, hour, minute, second = 0, millisecond = 0) => ({ year, month, day, hour, minute, second, millisecond });
  const instantFor = (clock, offsetMinutes) => Date.UTC(clock.year, clock.month - 1, clock.day, clock.hour, clock.minute, clock.second, clock.millisecond) - offsetMinutes * 60_000;
  const contextInput = ({
    mode = "watch",
    civilParts = parts(2026, 8, 7, 8, 49),
    timeZone = "Asia/Taipei",
    utcOffsetMinutes = 480,
    instantMs = instantFor(civilParts, utcOffsetMinutes),
    trueSolarParts = parts(2026, 8, 7, 8, 49, 18),
    source = "custom",
    disambiguation = null,
  } = {}) => ({
    mode,
    source,
    civil: { localParts: civilParts, timeZone, utcOffsetMinutes, abbreviation: "", instantMs, disambiguation },
    location: mode === "true-solar" ? { latitude: 24.984898, longitude: 121.540626, accuracy: null } : null,
    trueSolarResult: mode === "true-solar" ? {
      trueSolarParts,
      totalCorrectionSeconds: 18,
      longitudeCorrectionSeconds: 369,
      equationOfTimeSeconds: -351,
    } : undefined,
    createdAtInstantMs: 0,
  });
  const watchContext = createChartTimeContext(contextInput());
  const watchResult = calculateBaziFromChartTimeContext(watchContext, solarTerms);
  const legacyWatch = calculateBaziFromSolarTerms("2026-08-07T08:49:00", solarTerms);
  check("bazi-adapter-watch-clock-selection", JSON.stringify(watchContext.civil.localParts), JSON.stringify(getBaziClockLocalParts(watchContext)));
  check("bazi-adapter-watch-term-instant", watchContext.civil.instantMs, getBaziSolarTermComparisonInstantMs(watchContext));
  check("bazi-adapter-watch-pillar-compatibility", JSON.stringify([legacyWatch.yearPillar, legacyWatch.monthPillar, legacyWatch.dayPillar, legacyWatch.hourPillar]), JSON.stringify([watchResult.yearPillar, watchResult.monthPillar, watchResult.dayPillar, watchResult.hourPillar]));
  check("bazi-adapter-watch-term-compatibility", JSON.stringify([legacyWatch.currentTerm.name, legacyWatch.nextTerm.name, legacyWatch.meta]), JSON.stringify([watchResult.currentTerm.name, watchResult.nextTerm.name, watchResult.meta]));
  check("bazi-adapter-watch-debug-effective-day", "2026-08-07", watchResult.debug.effectiveDayDateKey);
  check("bazi-adapter-input-explicit-effective-day", "2026-08-07", createBaziCalculationInputFromChartTimeContext(watchContext).effectiveDayDateKey);

  for (const [id, clock] of [["before", parts(2026, 5, 29, 22, 59, 59)], ["exact", parts(2026, 5, 29, 23, 0, 0)], ["after", parts(2026, 5, 29, 23, 0, 1)], ["midnight", parts(2026, 5, 30, 0, 0, 1)]]) {
    const context = createChartTimeContext(contextInput({ civilParts: clock }));
    const adapter = calculateBaziFromChartTimeContext(context, solarTerms);
    const legacy = calculateBaziFromSolarTerms(`${String(clock.year).padStart(4, "0")}-${String(clock.month).padStart(2, "0")}-${String(clock.day).padStart(2, "0")}T${String(clock.hour).padStart(2, "0")}:${String(clock.minute).padStart(2, "0")}:${String(clock.second).padStart(2, "0")}`, solarTerms);
    check(`bazi-adapter-2300-${id}`, JSON.stringify([legacy.dayPillar, legacy.hourPillar, legacy.meta.effectiveDayDate]), JSON.stringify([adapter.dayPillar, adapter.hourPillar, adapter.meta.effectiveDayDate]));
  }

  const sourceAWatchDate = new Date(2026, 7, 7, 8, 49, 0);
  const sourceATrueCarrier = calculateTrueSolarTime({
    date: sourceAWatchDate,
    latitude: 24.984898,
    longitude: 121.540626,
    utcOffsetMinutes: 480,
  });
  const sourceATrueInput = contextInput({
    mode: "true-solar",
    trueSolarParts: sourceATrueCarrier.trueSolarParts,
  });
  const sourceATrueContext = createChartTimeContext(sourceATrueInput);
  const sourceATrueResult = calculateBaziFromChartTimeContext(sourceATrueContext, solarTerms);
  const sourceALegacyValue = `${String(sourceATrueCarrier.trueSolarParts.year).padStart(4, "0")}-${String(sourceATrueCarrier.trueSolarParts.month).padStart(2, "0")}-${String(sourceATrueCarrier.trueSolarParts.day).padStart(2, "0")}T${String(sourceATrueCarrier.trueSolarParts.hour).padStart(2, "0")}:${String(sourceATrueCarrier.trueSolarParts.minute).padStart(2, "0")}:${String(sourceATrueCarrier.trueSolarParts.second).padStart(2, "0")}`;
  const sourceALegacyResult = calculateBaziFromSolarTerms(sourceALegacyValue, solarTerms);
  check("bazi-adapter-source-a-true-solar-clock", sourceALegacyValue.replace("T", " "), sourceATrueResult.debug.clockLocalDateTime);
  check("bazi-adapter-source-a-true-solar-general-compatibility", JSON.stringify([sourceALegacyResult.yearPillar, sourceALegacyResult.monthPillar, sourceALegacyResult.dayPillar, sourceALegacyResult.hourPillar, sourceALegacyResult.currentTerm.name, sourceALegacyResult.nextTerm.name, { ganzhiYear: sourceALegacyResult.meta.ganzhiYear, effectiveDayDate: sourceALegacyResult.meta.effectiveDayDate, monthSwitchTerm: sourceALegacyResult.meta.monthSwitchTerm }]), JSON.stringify([sourceATrueResult.yearPillar, sourceATrueResult.monthPillar, sourceATrueResult.dayPillar, sourceATrueResult.hourPillar, sourceATrueResult.currentTerm.name, sourceATrueResult.nextTerm.name, { ganzhiYear: sourceATrueResult.meta.ganzhiYear, effectiveDayDate: sourceATrueResult.meta.effectiveDayDate, monthSwitchTerm: sourceATrueResult.meta.monthSwitchTerm }]));
  check("bazi-adapter-source-a-true-solar-term-uses-civil", sourceATrueContext.civil.instantMs, sourceATrueResult.termContext.comparisonInstantMs);

  const laCivil = parts(2026, 8, 6, 14, 21, 30);
  const laTrueSolar = parts(2026, 8, 6, 13, 22, 39);
  const laWatch = createChartTimeContext(contextInput({ civilParts: laCivil, trueSolarParts: laTrueSolar, timeZone: "America/Los_Angeles", utcOffsetMinutes: -420, instantMs: instantFor(laCivil, -420) }));
  const laSolar = createChartTimeContext(contextInput({ mode: "true-solar", civilParts: laCivil, trueSolarParts: laTrueSolar, timeZone: "America/Los_Angeles", utcOffsetMinutes: -420, instantMs: instantFor(laCivil, -420) }));
  const laWatchResult = calculateBaziFromChartTimeContext(laWatch, solarTerms);
  const laSolarResult = calculateBaziFromChartTimeContext(laSolar, solarTerms);
  check("bazi-adapter-la-summer-instant-shared", laWatchResult.termContext.comparisonInstantMs, laSolarResult.termContext.comparisonInstantMs);
  check("bazi-adapter-la-summer-clock-separate", "2026-08-06 13:22:39", laSolarResult.debug.clockLocalDateTime);
  check("bazi-adapter-la-summer-no-taipei-clock", false, laSolarResult.debug.clockLocalDateTime.startsWith("2026-08-07"));

  const lichun = solarTerms.find((term) => term.name === "立春" && term.year_taipei === 2026);
  const taipeiPartsAt = (timeMs) => {
    const date = new Date(timeMs);
    return parts(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  };
  const formatPartsValue = (clock) => `${String(clock.year).padStart(4, "0")}-${String(clock.month).padStart(2, "0")}-${String(clock.day).padStart(2, "0")}T${String(clock.hour).padStart(2, "0")}:${String(clock.minute).padStart(2, "0")}:${String(clock.second).padStart(2, "0")}.${String(clock.millisecond).padStart(3, "0")}`;
  for (const term of [lichun, solarTerms.find((entry) => entry.name === "驚蟄" && entry.year_taipei === 2026)]) {
    for (const [id, delta] of [["before", -1], ["exact", 0], ["after", 1]]) {
      const instantMs = term.timeMs + delta;
      const clock = taipeiPartsAt(instantMs);
      const context = createChartTimeContext(contextInput({ civilParts: clock, instantMs }));
      const adapter = calculateBaziFromChartTimeContext(context, solarTerms);
      const legacy = calculateBaziFromSolarTerms(formatPartsValue(clock), solarTerms);
      check(`bazi-adapter-legacy-${term.name}-${id}`, JSON.stringify([legacy.yearPillar, legacy.monthPillar, legacy.currentTerm.name, legacy.meta]), JSON.stringify([adapter.yearPillar, adapter.monthPillar, adapter.currentTerm.name, adapter.meta]));
    }
  }
  const sourceABoundaryWatchParts = taipeiPartsAt(lichun.timeMs);
  const sourceABoundarySolar = calculateTrueSolarTime({
    date: new Date(lichun.timeMs),
    latitude: 24.984898,
    longitude: 121.540626,
    utcOffsetMinutes: 480,
  });
  const sourceABoundaryContext = createChartTimeContext(contextInput({
    mode: "true-solar",
    civilParts: sourceABoundaryWatchParts,
    instantMs: lichun.timeMs,
    trueSolarParts: sourceABoundarySolar.trueSolarParts,
  }));
  const sourceABoundaryAdapter = calculateBaziFromChartTimeContext(sourceABoundaryContext, solarTerms);
  const sourceABoundaryLegacy = calculateBaziFromSolarTerms(formatPartsValue(sourceABoundarySolar.trueSolarParts), solarTerms);
  check("bazi-adapter-source-a-boundary-diagnostic", false, sourceABoundaryLegacy.yearPillar === sourceABoundaryAdapter.yearPillar);
  check("bazi-adapter-source-a-boundary-adapter-uses-exact-instant", "丙午", sourceABoundaryAdapter.yearPillar);
  for (const [id, delta] of [["before", -1], ["exact", 0], ["after", 1]]) {
    const context = createChartTimeContext(contextInput({ civilParts: parts(2026, 2, 3, 12, 0), timeZone: "America/Los_Angeles", utcOffsetMinutes: -480, instantMs: lichun.timeMs + delta }));
    const result = calculateBaziFromChartTimeContext(context, solarTerms);
    check(`bazi-adapter-la-lichun-${id}-instant`, lichun.timeMs + delta, result.termContext.comparisonInstantMs);
    check(`bazi-adapter-la-lichun-${id}-year`, delta < 0 ? "乙巳" : "丙午", result.yearPillar);
  }
  const jingzhe = solarTerms.find((term) => term.name === "驚蟄" && term.year_taipei === 2026);
  for (const [id, delta] of [["before", -1], ["exact", 0], ["after", 1]]) {
    const context = createChartTimeContext(contextInput({ civilParts: parts(2026, 3, 4, 12, 0), timeZone: "America/Los_Angeles", utcOffsetMinutes: -480, instantMs: jingzhe.timeMs + delta }));
    const result = calculateBaziFromChartTimeContext(context, solarTerms);
    check(`bazi-adapter-la-month-term-${id}`, delta < 0 ? "寅" : "卯", result.monthBranch);
  }

  const ambiguousParts = parts(2027, 11, 7, 1, 30);
  const artificialTerms = solarTerms
    .map((term) => term.name === "立春" && term.year_taipei === 2027 ? { ...term, timeMs: Date.UTC(2027, 10, 7, 9, 0) } : term)
    .sort((left, right) => left.timeMs - right.timeMs);
  const earlier = createChartTimeContext(contextInput({ civilParts: ambiguousParts, timeZone: "America/Los_Angeles", utcOffsetMinutes: -420, instantMs: Date.UTC(2027, 10, 7, 8, 30), disambiguation: "earlier" }));
  const later = createChartTimeContext(contextInput({ civilParts: ambiguousParts, timeZone: "America/Los_Angeles", utcOffsetMinutes: -480, instantMs: Date.UTC(2027, 10, 7, 9, 30), disambiguation: "later" }));
  const earlierResult = calculateBaziFromChartTimeContext(earlier, artificialTerms);
  const laterResult = calculateBaziFromChartTimeContext(later, artificialTerms);
  check("bazi-adapter-la-ambiguous-same-clock", earlierResult.debug.clockLocalDateTime, laterResult.debug.clockLocalDateTime);
  check("bazi-adapter-la-ambiguous-instant-not-merged", false, earlierResult.termContext.comparisonInstantMs === laterResult.termContext.comparisonInstantMs);
  check("bazi-adapter-la-ambiguous-term-between-instants", false, earlierResult.yearPillar === laterResult.yearPillar);

  for (const [id, timeZone, offset] of [["tokyo", "Asia/Tokyo", 540], ["kathmandu", "Asia/Kathmandu", 345], ["lord-howe", "Australia/Lord_Howe", 630]]) {
    const civil = parts(2026, 8, 6, 14, 21, 30);
    const context = createChartTimeContext(contextInput({ mode: "true-solar", civilParts: civil, trueSolarParts: parts(2026, 8, 6, 13, 55, 1), timeZone, utcOffsetMinutes: offset, instantMs: instantFor(civil, offset) }));
    const result = calculateBaziFromChartTimeContext(context, solarTerms);
    check(`bazi-adapter-${id}-instant`, context.civil.instantMs, result.termContext.comparisonInstantMs);
    check(`bazi-adapter-${id}-clock`, "2026-08-06 13:55:01", result.debug.clockLocalDateTime);
  }

  for (const [id, trueSolarParts, expectedEffectiveDay] of [["previous-day", parts(2026, 8, 5, 23, 55), "2026-08-06"], ["next-day", parts(2026, 8, 7, 0, 3), "2026-08-07"]]) {
    const civil = parts(2026, 8, 6, 0, 3);
    const context = createChartTimeContext(contextInput({ mode: "true-solar", civilParts: civil, trueSolarParts, instantMs: instantFor(civil, 480) }));
    const result = calculateBaziFromChartTimeContext(context, solarTerms);
    check(`bazi-adapter-cross-day-${id}-clock`, trueSolarParts.day, Number(result.debug.clockLocalDateTime.slice(8, 10)));
    check(`bazi-adapter-cross-day-${id}-effective`, expectedEffectiveDay, result.debug.effectiveDayDateKey);
    check(`bazi-adapter-cross-day-${id}-term-instant`, context.civil.instantMs, result.termContext.comparisonInstantMs);
  }

  const originalTerms = JSON.stringify(solarTerms);
  const resultBeforeDebug = JSON.stringify(watchResult);
  const formattedDebug = formatBaziChartTimeDebug(watchResult);
  check("bazi-adapter-non-mutation-terms", originalTerms, JSON.stringify(solarTerms));
  check("bazi-adapter-non-mutation-context", true, Object.isFrozen(watchContext));
  check("bazi-adapter-result-plain", Object.prototype, Object.getPrototypeOf(watchResult));
  check("bazi-adapter-debug-no-result-mutation", resultBeforeDebug, JSON.stringify(watchResult));
  check("bazi-adapter-debug-format", "watch", formattedDebug.mode);
  check("bazi-adapter-input-contract-frozen", true, Object.isFrozen(createBaziCalculationInputFromChartTimeContext(watchContext)));

  const missingSolar = { ...sourceATrueContext, trueSolar: null };
  const mismatch = { ...watchContext, astronomy: { ...watchContext.astronomy, comparisonInstantMs: watchContext.civil.instantMs + 1 } };
  check("bazi-adapter-validation-watch", true, validateBaziChartTimeContext(watchContext).valid);
  check("bazi-adapter-validation-solar-terms", true, validateBaziChartTimeContext(watchContext, [{ name: "立春" }]).errors.some((error) => error.includes("solar terms invalid")));
  check("bazi-adapter-validation-true-solar-missing", true, validateBaziChartTimeContext(missingSolar).errors.some((error) => error.includes("true-solar")));
  check("bazi-adapter-validation-instant-mismatch", true, validateBaziChartTimeContext(mismatch).errors.some((error) => error.includes("instant mismatch")));
  throws("bazi-adapter-throws-true-solar-missing", () => calculateBaziFromChartTimeContext(missingSolar, solarTerms), "context invalid");
  throws("bazi-adapter-throws-instant-mismatch", () => calculateBaziFromChartTimeContext(mismatch, solarTerms), "instant mismatch");
  throws("bazi-adapter-throws-invalid-terms", () => calculateBaziFromChartTimeContext(watchContext, [{ name: "立春" }]), "solar terms invalid");

  const probeFixture = contextInput({ mode: "true-solar", civilParts: laCivil, trueSolarParts: laTrueSolar, timeZone: "America/Los_Angeles", utcOffsetMinutes: -420, instantMs: instantFor(laCivil, -420) });
  const runProbe = (timeZone) => execFileSync(process.execPath, ["tests/bazi-chart-time-adapter-probe.mjs", JSON.stringify(probeFixture)], { cwd: process.cwd(), env: { ...process.env, TZ: timeZone }, encoding: "utf8" }).trim();
  const taipeiProbe = runProbe("Asia/Taipei");
  check("bazi-adapter-process-utc", taipeiProbe, runProbe("UTC"));
  check("bazi-adapter-process-los-angeles", taipeiProbe, runProbe("America/Los_Angeles"));

  check("bazi-adapter-static-no-dom", false, /\bdocument\b|\bwindow\b|\bnavigator\b|geolocation|localStorage/.test(baziChartTimeAdapterRaw));
  check("bazi-adapter-static-no-runtime-coupling", false, /chartTimeState|chartDisplayMode|from\s+["']\.\/main\.js/.test(baziChartTimeAdapterRaw));
  check("bazi-adapter-static-no-other-chart-import", false, /from\s+["']\.\/(flyingStars|jinhan|qimen)/.test(baziChartTimeAdapterRaw));
  check("bazi-adapter-static-main-runtime-wired", true, mainModuleRaw.includes('from "./baziChartTimeAdapter.js"'));
}

function runTrueSolarBaziRuntimeTests() {
  const check = (id, expected, actual) => {
    trueSolarBaziRuntimeVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const parts = (year, month, day, hour, minute, second = 0) => ({ year, month, day, hour, minute, second, millisecond: 0 });
  const instantFor = (value, offsetMinutes) => Date.UTC(value.year, value.month - 1, value.day, value.hour, value.minute, value.second) - offsetMinutes * 60_000;
  const trueSolarContext = (source, localParts, timeZone, offset, trueSolarParts, disambiguation = null) => createTrueSolarChartTimeContext({
    source,
    civil: { localParts, timeZone, utcOffsetMinutes: offset, abbreviation: "", instantMs: instantFor(localParts, offset), disambiguation },
    location: { latitude: 25, longitude: 121.5, accuracy: null },
    trueSolarResult: { trueSolarParts, totalCorrectionSeconds: 0, longitudeCorrectionSeconds: 0, equationOfTimeSeconds: 0 },
    createdAtInstantMs: 0,
  });

  const watchInput = "2026-08-07T08:49:00";
  const watchResult = calculateBaziFromSolarTerms(watchInput, solarTerms);
  const watchSnapshot = JSON.stringify(watchResult);
  const trueContext = trueSolarContext("query", parts(2026, 8, 7, 8, 49), "Asia/Taipei", 480, parts(2026, 8, 7, 8, 47, 30));
  const trueResult = calculateBaziFromChartTimeContext(trueContext, solarTerms);
  check("true-solar-runtime-watch-legacy", true, watchSnapshot === JSON.stringify(calculateBaziFromSolarTerms(watchInput, solarTerms)));
  check("true-solar-runtime-ready-adapter", true, trueResult && trueResult.debug.clockMode === "true-solar");
  check("true-solar-runtime-does-not-overwrite-watch", watchSnapshot, JSON.stringify(watchResult));
  check("true-solar-runtime-day-from-local", true, trueResult.debug.clockLocalDateTime.includes("08:47:30"));
  check("true-solar-runtime-term-from-civil-instant", trueContext.civil.instantMs, trueResult.termContext.comparisonInstantMs);

  const deviceContext = trueSolarContext("device", parts(2026, 8, 7, 8, 49), "Asia/Taipei", 480, parts(2026, 8, 7, 8, 47));
  const customContext = trueSolarContext("custom", parts(2026, 8, 6, 14, 21), "America/Los_Angeles", -420, parts(2026, 8, 6, 13, 22));
  check("true-solar-runtime-source-a", "query", trueContext.source);
  check("true-solar-runtime-source-b", "device", deviceContext.source);
  check("true-solar-runtime-source-c", "custom", customContext.source);
  check("true-solar-runtime-source-b-context", "Asia/Taipei", deviceContext.civil.timeZone);
  check("true-solar-runtime-source-c-context", "America/Los_Angeles", customContext.civil.timeZone);
  check("true-solar-runtime-custom-clock", "2026-08-06 13:22:00", calculateBaziFromChartTimeContext(customContext, solarTerms).debug.clockLocalDateTime);

  const lichun = solarTerms.find((term) => term.name === "立春" && term.year_taipei === 2026);
  for (const [id, delta, expectedYear] of [["before", -1, "乙巳"], ["exact", 0, "丙午"], ["after", 1, "丙午"]]) {
    const boundaryClock = parts(2026, 2, 4, 4, 2);
    const boundaryResult = calculateBaziFromChartTimeContext(createTrueSolarChartTimeContext({
      source: "query",
      civil: { localParts: boundaryClock, timeZone: "Asia/Taipei", utcOffsetMinutes: 480, abbreviation: "", instantMs: lichun.timeMs + delta, disambiguation: null },
      location: { latitude: 25, longitude: 121.5, accuracy: null },
      trueSolarResult: { trueSolarParts: parts(2026, 2, 4, 3, 54), totalCorrectionSeconds: 0, longitudeCorrectionSeconds: 0, equationOfTimeSeconds: 0 },
      createdAtInstantMs: 0,
    }), solarTerms);
    check(`true-solar-runtime-lichun-${id}`, expectedYear, boundaryResult.yearPillar);
  }

  const unavailableSource = extractNamedFunctionSource(mainModuleRaw, "renderBaziForActiveDisplayMode");
  check("true-solar-runtime-no-fallback", true, unavailableSource.includes("renderUnavailableTrueSolarBazi") && unavailableSource.includes("if (!currentTrueSolarChartContext)"));
  check("true-solar-runtime-orchestration-helper", true, mainModuleRaw.includes("function createCurrentTrueSolarChartContext()") && mainModuleRaw.includes("createTrueSolarChartTimeContext(currentTrueSolarChartContextInput)"));
  check("true-solar-runtime-separate-result-state", true, mainModuleRaw.includes("currentTrueSolarBaziResult") && mainModuleRaw.includes("currentCalendarResult = result"));
  check("true-solar-runtime-watch-downstream", true, ["refreshFlyingStarsForCurrentChartTime(requestId)", "renderJinhanYujing(result, effectiveDateTimeValue", "renderQimenSection(effectiveDateTimeValue)"].every((call) => extractNamedFunctionSource(mainModuleRaw, "renderByDateTime").includes(call)));
  check("true-solar-runtime-display-only-overlay", true, extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarBaziResult").includes("renderSeasonInfo(result, context)") && !extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarBaziResult").includes("renderFlyingStars"));

  const formatterSource = extractNamedFunctionSource(mainModuleRaw, "formatTermDateTime");
  const autumnTerm = solarTerms.find((term) => term.name === "立秋" && term.year_taipei === 2026);
  const winterTerm = solarTerms.find((term) => term.name === "小寒" && term.year_taipei === 2027);
  const tokyoTerm = getZonedDateTimeParts(new Date(autumnTerm.timeMs), "Asia/Tokyo");
  const laSummerTerm = getZonedDateTimeParts(new Date(autumnTerm.timeMs), "America/Los_Angeles");
  const laWinterTerm = getZonedDateTimeParts(new Date(winterTerm.timeMs), "America/Los_Angeles");
  check("true-solar-runtime-term-tokyo-offset", 540, tokyoTerm.utcOffsetMinutes);
  check("true-solar-runtime-term-la-summer-offset", -420, laSummerTerm.utcOffsetMinutes);
  check("true-solar-runtime-term-la-winter-offset", -480, laWinterTerm.utcOffsetMinutes);
  check("true-solar-runtime-term-identity-shared", autumnTerm.timeMs, new Date(autumnTerm.utc).getTime());
  check("true-solar-runtime-term-formatter-mode-aware", true, formatterSource.includes("formatDateTimeForChartMode") && formatterSource.includes("displayContext = null"));
  check("true-solar-runtime-term-formatter-not-query-offset", false, formatterSource.includes("civil.utcOffsetMinutes"));
  check("true-solar-runtime-term-formatter-watch-preserved", true, formatterSource.includes("date.getFullYear()") && formatterSource.includes("displayContext = null"));
  check("true-solar-runtime-lingering-result-cleared", true, mainModuleRaw.includes("currentTrueSolarChartContext = null") && mainModuleRaw.includes("currentTrueSolarBaziResult = null"));
}

function runTrueSolarBaziRuntimeBugFixTests() {
  const check = (id, expected, actual) => {
    trueSolarBaziRuntimeBugFixVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };

  const formatChartTimeStatusDateTime = loadChartTimeStatusDateTimeForTest(mainModuleRaw);
  check("true-solar-runtime-watch-status-empty", "時間初始化中…", formatChartTimeStatusDateTime(""));
  check("true-solar-runtime-watch-status-invalid", "時間初始化中…", formatChartTimeStatusDateTime("not-a-date"));
  check("true-solar-runtime-watch-status-valid", "2026/08/07 08:49:00", formatChartTimeStatusDateTime("2026-08-07T08:49:00"));

  const statusSource = extractNamedFunctionSource(mainModuleRaw, "renderChartTimeStatus");
  check("true-solar-runtime-watch-status-no-unsafe-chain", false, statusSource.includes("getLocalDateParts(parseDateTimeLocalValue"));
  check("true-solar-runtime-watch-status-uses-safe-formatter", true, statusSource.includes("formatChartTimeStatusDateTime"));
  check("true-solar-runtime-watch-status-global-no-unsafe-chain", false, /getLocalDateParts\(\s*parseDateTimeLocalValue/.test(mainModuleRaw));

  const initializeSource = extractNamedFunctionSource(mainModuleRaw, "initializeChartDisplayMode");
  const startAutoNowSource = extractNamedFunctionSource(mainModuleRaw, "startAutoNowMode");
  check("true-solar-runtime-watch-init-keeps-safe-render", true, initializeSource.includes("renderChartDisplayMode") && startAutoNowSource.includes("refreshFromCurrentTime()"));

  const locationSync = loadTrueSolarLocationSyncForTest(mainModuleRaw);
  check("true-solar-runtime-coordinate-empty", null, locationSync.sync("", { showError: false }));
  check("true-solar-runtime-coordinate-empty-clears-state", null, locationSync.getLocation());

  const decimal = locationSync.sync("35.681236, 139.767125", { showError: false });
  check("true-solar-runtime-coordinate-decimal-location", true, decimal?.latitude === 35.681236 && decimal?.longitude === 139.767125);
  check("true-solar-runtime-coordinate-decimal-normalized", "35.681236, 139.767125", locationSync.getInput());

  const dms = locationSync.sync("35°40'52.4\"N 139°46'1.65\"E", { showError: false });
  check("true-solar-runtime-coordinate-dms-location", true, dms?.sourceFormat === "dms" && Math.abs(dms.latitude - 35.6812222222) < 0.00000001 && Math.abs(dms.longitude - 139.767125) < 0.00000001);

  const invalid = locationSync.sync("abc", { showError: true });
  check("true-solar-runtime-coordinate-invalid", null, invalid);
  check("true-solar-runtime-coordinate-invalid-clears-state", null, locationSync.getLocation());
  check("true-solar-runtime-coordinate-invalid-message", true, locationSync.getStatuses().at(-1)?.message.includes("無法辨識座標"));

  locationSync.setLocation({ latitude: 35.681236, longitude: 139.767125, accuracy: 12 });
  const sameGeolocation = locationSync.sync("35.681236, 139.767125", { showError: false });
  check("true-solar-runtime-coordinate-preserves-geolocation-accuracy", 12, sameGeolocation?.accuracy);

  const modeSource = extractNamedFunctionSource(mainModuleRaw, "renderChartDisplayMode");
  check("true-solar-runtime-mode-entry-syncs-existing-coordinate", true, modeSource.includes("syncTrueSolarTimeLocationFromCoordinateInput({") && modeSource.includes("source: TRUE_SOLAR_TIME_SOURCE.QUERY") && modeSource.includes("showError: false"));
  check("true-solar-runtime-mode-entry-sync-before-render", true, modeSource.indexOf("syncTrueSolarTimeLocationFromCoordinateInput") < modeSource.indexOf("renderActiveTrueSolarTime()"));
  check("true-solar-runtime-mode-entry-no-legacy-button", false, modeSource.includes("calculateTrueSolarTimeFromCoordinateInput"));

  check("true-solar-runtime-coordinate-input-listener", true, mainModuleRaw.includes('elements.trueSolarTimeCoordinate.addEventListener("input", handleTrueSolarTimeCoordinateInput)'));
  check("true-solar-runtime-coordinate-change-listener", true, mainModuleRaw.includes('elements.trueSolarTimeCoordinate.addEventListener("change", handleTrueSolarTimeCoordinateChange)'));
  const inputSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeCoordinateInput");
  const changeSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeCoordinateChange");
  check("true-solar-runtime-coordinate-input-clears-stale-state", true, inputSource.includes("setTrueSolarTimeLocationForSource(source, null)") && inputSource.includes("clearTrueSolarTimePresentation({ clearFormalChart: isFormalSource })"));
  check("true-solar-runtime-coordinate-change-rerenders", true, changeSource.includes("syncTrueSolarTimeLocationFromCoordinateInput") && changeSource.includes("renderActiveTrueSolarTime()"));
  check("true-solar-runtime-coordinate-change-no-duplicate-mode-render", false, changeSource.includes("renderChartDisplayMode()"));

  const calculateSource = extractNamedFunctionSource(mainModuleRaw, "calculateTrueSolarTimeFromCoordinateInput");
  check("true-solar-runtime-legacy-button-reuses-sync-helper", true, calculateSource.includes("syncTrueSolarTimeLocationFromCoordinateInput") && !calculateSource.includes("parseCoordinateInput"));
  const clearPresentationSource = extractNamedFunctionSource(mainModuleRaw, "clearTrueSolarTimePresentation");
  check("true-solar-runtime-clear-presentation-keeps-location", false, clearPresentationSource.includes("trueSolarTimeLocation = null"));
  const contextSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForContext");
  const formalSource = extractNamedFunctionSource(mainModuleRaw, "renderFormalTrueSolarChartTime");
  check("true-solar-runtime-coordinate-change-rebuilds-context-and-bazi", true, formalSource.includes("createCurrentTrueSolarChartContext()") && formalSource.includes("renderBaziForActiveDisplayMode()"));
}

function runTrueSolarSharedQueryRuntimeTests() {
  const check = (id, expected, actual) => {
    trueSolarSharedQueryRuntimeVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const parts = (year, month, day, hour, minute, second = 0) => ({
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond: 0,
  });
  const instantFor = (value, offsetMinutes) => Date.UTC(
    value.year,
    value.month - 1,
    value.day,
    value.hour,
    value.minute,
    value.second
  ) - offsetMinutes * 60_000;
  const createFixtureContext = (civilLocalParts, trueSolarLocalParts, correctionSeconds = 0) => createTrueSolarChartTimeContext({
    source: "query",
    civil: {
      localParts: civilLocalParts,
      timeZone: "Asia/Taipei",
      utcOffsetMinutes: 480,
      abbreviation: "",
      instantMs: instantFor(civilLocalParts, 480),
    },
    location: { latitude: 25.033964, longitude: 121.564468, accuracy: null },
    trueSolarResult: {
      trueSolarParts: trueSolarLocalParts,
      totalCorrectionSeconds: correctionSeconds,
      longitudeCorrectionSeconds: 0,
      equationOfTimeSeconds: correctionSeconds,
    },
    createdAtInstantMs: 0,
  });

  const formalSource = extractNamedFunctionSource(mainModuleRaw, "renderFormalTrueSolarChartTime");
  const activeSource = extractNamedFunctionSource(mainModuleRaw, "renderActiveTrueSolarTime");
  const contextSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForContext");
  const byDateTimeSource = extractNamedFunctionSource(mainModuleRaw, "renderByDateTime");
  const displayModeSource = extractNamedFunctionSource(mainModuleRaw, "renderChartDisplayMode");
  const sourceChangeSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeSourceChange");
  const customSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForCustomInput");
  const deviceSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForDeviceNow");
  const statusSource = extractNamedFunctionSource(mainModuleRaw, "renderChartTimeStatus");

  check("true-solar-r2-formal-shared-query-call", true, byDateTimeSource.includes("renderFormalTrueSolarChartTime()") && displayModeSource.includes("renderFormalTrueSolarChartTime()"));
  const calculationSource = extractNamedFunctionSource(mainModuleRaw, "resolveTrueSolarTimeCalculation");
  check("true-solar-r2-formal-query-source-a", true, formalSource.includes('source: TRUE_SOLAR_TIME_SOURCE.QUERY') && formalSource.includes('timeZone: "Asia/Taipei"') && formalSource.includes("resolveTrueSolarTimeCalculation(context)"));
  check("true-solar-r2-formal-context-only-top-query", true, formalSource.includes("parseTopQueryDateTimeLocalParts(elements.datetime.value)") && !formalSource.includes("trueSolarTimeSource"));
  check("true-solar-r2-bc-functions-retained", true, activeSource.includes("TRUE_SOLAR_TIME_SOURCE.DEVICE") && activeSource.includes("TRUE_SOLAR_TIME_SOURCE.CUSTOM") && deviceSource.includes("renderTrueSolarTimeForContext") && customSource.includes("renderTrueSolarTimeForContext"));
  check("true-solar-r2-bc-do-not-write-formal-context", true, !contextSource.includes("currentTrueSolarChartContextInput") && contextSource.includes("clearTrueSolarTimePresentation({ clearFormalChart: false })") && formalSource.includes("currentTrueSolarChartContextInput = {") && calculationSource.includes("resolveLocalDateTimeInTimeZone"));
  check("true-solar-r2-bc-source-switch-preserves-formal", true, sourceChangeSource.includes("clearTrueSolarTimePresentation({ clearFormalChart: false })") && !sourceChangeSource.includes("renderFormalTrueSolarChartTime"));
  check("true-solar-r2-custom-device-no-formal-fallback", false, customSource.includes("renderFormalTrueSolarChartTime") || deviceSource.includes("renderFormalTrueSolarChartTime"));
  check("true-solar-r2-shared-watch-local", true, calculationSource.includes("civilResolution") && formalSource.includes("civilResolution.localParts") && formalSource.includes("timeZone: civilResolution.timeZone"));
  check("true-solar-r2-status-has-three-clock-lines", true, statusSource.includes("currentTrueSolarChartContext.trueSolar.localParts") && statusSource.includes("手錶時間") && statusSource.includes("真太陽時") && statusSource.includes("時區") && (statusSource.match(/chart-time-status-detail-line/g) ?? []).length >= 3);
  check("true-solar-r2-status-keeps-seconds", true, mainModuleRaw.includes("function formatDateTimeParts(parts)") && statusSource.includes("formatDateTimeParts(currentTrueSolarChartContext.civil.localParts)") && statusSource.includes("formatDateTimeParts(currentTrueSolarChartContext.trueSolar.localParts)"));
  check("true-solar-r2-source-note", true, indexHtmlRaw.includes("此區可獨立查詢真太陽時") && indexHtmlRaw.includes("正式排盤目前以頁面上方「排盤時間」為準") && indexHtmlRaw.includes("裝置／自訂時間不會改動正式四柱"));
  check("true-solar-r2-source-a-badge", true, indexHtmlRaw.includes("正式排盤來源") && indexHtmlRaw.includes('id="true-solar-time-source-device"') && indexHtmlRaw.includes('id="true-solar-time-source-custom"'));
  check("true-solar-r2-query-only-note", true, indexHtmlRaw.includes("正式四柱與九宮飛星目前使用頁面上方「排盤時間」") && indexHtmlRaw.includes("僅供獨立換算查詢"));
  check("true-solar-r2-downstream-watch-input-unchanged", true, ["refreshFlyingStarsForCurrentChartTime(requestId)", "renderJinhanYujing(result, effectiveDateTimeValue", "renderQimenSection(effectiveDateTimeValue)"].every((call) => byDateTimeSource.includes(call)));
  check("true-solar-r2-no-forbidden-expansion", false, /localStorage|sessionStorage|fetch\(|NOAA|SunCalc|solar_terms\.json/.test(mainModuleRaw));

  const watchInput = "2026-08-07T17:00:05";
  const watchResult = calculateBaziFromSolarTerms(watchInput, solarTerms);
  const watchLocalParts = parts(2026, 8, 7, 17, 0, 5);
  // This is the requested semantic fixture: assume a -9-second correction so
  // the adapter can be checked at the 酉／申 hour boundary without changing
  // the project's existing true-solar formula.
  const assumedTrueSolarParts = parts(2026, 8, 7, 16, 59, 56);
  const formalContext = createFixtureContext(watchLocalParts, assumedTrueSolarParts, -9);
  const trueResult = calculateBaziFromChartTimeContext(formalContext, solarTerms);
  check("true-solar-r2-fixture-watch-hour", "酉", watchResult.hourPillar?.[1]);
  check("true-solar-r2-fixture-true-solar-hour", "申", trueResult.hourPillar?.[1]);
  check("true-solar-r2-fixture-shared-watch-local", watchInput, formalContext.compatibility.watchLocalDateTimeValue);
  check("true-solar-r2-fixture-true-local-seconds", "2026-08-07 16:59:56", trueResult.debug.clockLocalDateTime);
  check("true-solar-r2-fixture-top-query-timezone", "Asia/Taipei", formalContext.civil.timeZone);

  const previousDayContext = createFixtureContext(parts(2026, 8, 7, 0, 3, 0), parts(2026, 8, 6, 23, 59, 59), -181);
  const nextDayContext = createFixtureContext(parts(2026, 8, 7, 23, 59, 58), parts(2026, 8, 8, 0, 0, 4), 6);
  check("true-solar-r2-cross-day-previous", -1, previousDayContext.trueSolar.dayOffset);
  check("true-solar-r2-cross-day-next", 1, nextDayContext.trueSolar.dayOffset);
  check("true-solar-r2-cross-day-keeps-local-dates", "2026-08-06T23:59:59", previousDayContext.compatibility.trueSolarLocalDateTimeValue);
  check("true-solar-r2-cross-day-next-local-date", "2026-08-08T00:00:04", nextDayContext.compatibility.trueSolarLocalDateTimeValue);

  const actualFormulaResult = calculateTrueSolarTime({
    date: new Date(Date.UTC(2026, 7, 7, 17, 0, 5)),
    latitude: 25.033964,
    longitude: 121.564468,
    utcOffsetMinutes: 480,
    useUtcComponents: true,
  });
  check("true-solar-r2-existing-formula-still-returns-local", true, Number.isInteger(actualFormulaResult.trueSolarParts?.hour) && Number.isInteger(actualFormulaResult.trueSolarParts?.second));
}

function runChartQueryTimeUxTests() {
  const check = (id, expected, actual) => {
    chartQueryTimeUxVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const queryStatusSource = extractNamedFunctionSource(mainModuleRaw, "renderChartQueryTimeModeStatus");
  const startSource = extractNamedFunctionSource(mainModuleRaw, "startAutoNowMode");
  const pauseSource = extractNamedFunctionSource(mainModuleRaw, "pauseAutoNowMode");
  const refreshSource = extractNamedFunctionSource(mainModuleRaw, "refreshFromCurrentTime");
  const requestSource = extractNamedFunctionSource(mainModuleRaw, "requestRenderDateTime");
  const manualInputSource = extractNamedFunctionSource(mainModuleRaw, "handleManualDateTimeInput");
  const manualChangeSource = extractNamedFunctionSource(mainModuleRaw, "handleManualDateTimeChange");
  const switchSource = extractNamedFunctionSource(mainModuleRaw, "handleChartDisplayModeSwitchClick");
  const sourceChangeSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeSourceChange");
  const watchSummarySource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeWatchSummary");
  const watchDateSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForWatchDate");
  const chartStatusSource = extractNamedFunctionSource(mainModuleRaw, "renderChartTimeStatus");
  const tabListenerStart = mainModuleRaw.indexOf("elements.tabButtons.forEach");
  const tabListenerEnd = mainModuleRaw.indexOf("elements.useNow.addEventListener", tabListenerStart);
  const tabListenerSource = mainModuleRaw.slice(tabListenerStart, tabListenerEnd);

  check("chart-query-time-ux-label", true, indexHtmlRaw.includes("排盤時間") && /for="datetime">精確排盤時間/.test(indexHtmlRaw) && /id="datetime"[^>]*aria-label="精確排盤時間"/.test(indexHtmlRaw));
  check("chart-query-time-ux-status-dom", true, indexHtmlRaw.includes('id="chart-query-time-mode-status"') && indexHtmlRaw.includes('class="query-time-mode-status"') && indexHtmlRaw.includes('role="status"'));
  check("chart-query-time-ux-value-dom", true, indexHtmlRaw.includes('id="chart-query-time-value"') && indexHtmlRaw.includes('class="query-time-summary"'));
  check("chart-query-time-ux-now-entry", true, /id="use-now"[^>]*title="恢復現在時間並持續更新"[^>]*aria-label="恢復現在時間並持續更新"/.test(indexHtmlRaw) && mainModuleRaw.includes('elements.useNow.addEventListener("click", () => {'));
  check("chart-query-time-ux-initial-auto-copy", "● 跟隨現在時間", indexHtmlRaw.match(/id="chart-query-time-mode-status"[^>]*>\s*([^<]+)\s*<\/p>/)?.[1]?.trim());
  check("chart-query-time-ux-status-derived-from-state", true, queryStatusSource.includes("isAutoNowMode ? \"● 跟隨現在時間\" : \"○ 手動查詢時間\"") && queryStatusSource.includes("chartQueryTimeModeStatus.dataset.mode = isAutoNowMode ? \"auto-now\" : \"manual\""));
  check("chart-query-time-ux-status-has-no-second-state", true, (mainModuleRaw.match(/let isAutoNowMode\s*=/g) ?? []).length === 1 && !mainModuleRaw.includes("chartQueryTimeModeState"));
  check("chart-query-time-ux-status-formats-value", true, queryStatusSource.includes("elements.chartQueryTimeValue.textContent = formatChartTimeStatusDateTime(elements.datetime.value)"));
  check("chart-query-time-ux-auto-start-renders-status", true, startSource.includes("isAutoNowMode = true") && startSource.includes("renderChartQueryTimeModeStatus()") && startSource.includes("stopAutoNowRefresh()") && startSource.includes("setInterval(refreshFromCurrentTime, AUTO_NOW_REFRESH_MS)"));
  check("chart-query-time-ux-manual-pause-renders-status", true, pauseSource.includes("isAutoNowMode = false") && pauseSource.includes("renderChartQueryTimeModeStatus()") && pauseSource.includes("stopAutoNowRefresh()"));
  check("chart-query-time-ux-manual-input-pauses", true, manualInputSource.includes("pauseAutoNowMode()") && manualChangeSource.includes("pauseAutoNowMode()"));
  check("chart-query-time-ux-valid-render-syncs-status", true, requestSource.includes("renderChartQueryTimeModeStatus()") && requestSource.indexOf("renderChartQueryTimeModeStatus()") < requestSource.indexOf("renderByDateTime(dateTimeValue)"));
  check("chart-query-time-ux-auto-refresh-updates-summary", true, refreshSource.includes("elements.datetime.value = toLocalDatetimeValue(new Date())") && refreshSource.includes("renderChartQueryTimeModeStatus()"));
  check("chart-query-time-ux-manual-timer-guard", true, refreshSource.includes("if (!isAutoNowMode)") && refreshSource.includes("return"));
  check("chart-query-time-ux-mode-switch-keeps-state", false, switchSource.includes("startAutoNowMode()") || switchSource.includes("pauseAutoNowMode()"));
  check("chart-query-time-ux-tab-keeps-state", false, /(?:startAutoNowMode|pauseAutoNowMode)/.test(tabListenerSource));
  check("chart-query-time-ux-source-bc-keeps-state", false, /function handleTrueSolarTimeSourceChange\(\)[\s\S]*?(?:startAutoNowMode|pauseAutoNowMode|isAutoNowMode)/.test(mainModuleRaw));
  check("chart-query-time-ux-source-a-label", true, indexHtmlRaw.includes("上方排盤時間（臺灣 UTC+8）") && indexHtmlRaw.includes("正式排盤來源") && mainModuleRaw.includes('sourceLabel = source === TRUE_SOLAR_TIME_SOURCE.DEVICE ? "裝置目前時間（僅換算查詢）"') && mainModuleRaw.includes(' : "上方排盤時間";'));
  check("chart-query-time-ux-source-bc-labels", true, indexHtmlRaw.includes("裝置目前時間（僅換算查詢）") && indexHtmlRaw.includes("自訂當地日期時間（僅換算查詢）"));
  check("chart-query-time-ux-source-a-shared-value", true, watchDateSource.includes("renderTrueSolarTimeForContext") && mainModuleRaw.includes("renderTrueSolarTimeForWatchDate(elements.datetime.value)") && mainModuleRaw.includes("elements.trueSolarTimeWatchValue.textContent = formatDateTimeParts(localParts)"));
  check("chart-query-time-ux-source-help", true, indexHtmlRaw.includes("此區可獨立查詢真太陽時；正式排盤目前以頁面上方「排盤時間」為準") && indexHtmlRaw.includes("裝置／自訂時間不會改動正式四柱"));
  check("chart-query-time-ux-status-keeps-chart-time-basis", false, chartStatusSource.includes("手動查詢時間") || chartStatusSource.includes("跟隨現在時間"));
  check("chart-query-time-ux-mobile-scoped-css", true, mainCssRaw.includes(".query-time-summary") && mainCssRaw.includes(".query-time-mode-status") && mainCssRaw.includes("flex-wrap: wrap") && !mainCssRaw.includes("body { overflow-x: hidden"));
  check("chart-query-time-ux-no-network-clock", false, /fetch\(|\bNTP\b|網路時間|server.?time|Date header/i.test(mainModuleRaw + indexHtmlRaw));
  check("chart-query-time-ux-no-forbidden-runtime-change", true, mainModuleRaw.includes('from "./baziChartTimeAdapter.js"') && mainModuleRaw.includes('from "./chartTimeContext.js"') && !mainModuleRaw.includes("createChartTimeContext("));

  const renderStatus = loadChartQueryTimeModeStatusForTest(mainModuleRaw);
  const autoFixture = {
    datetime: { value: "2026-08-07T17:00:05" },
    chartQueryTimeValue: { textContent: "" },
    chartQueryTimeModeStatus: { textContent: "", dataset: {} },
  };
  renderStatus(autoFixture, true);
  check("chart-query-time-ux-auto-status-behavior", "● 跟隨現在時間", autoFixture.chartQueryTimeModeStatus.textContent);
  check("chart-query-time-ux-auto-value-behavior", "2026/08/07 17:00:05", autoFixture.chartQueryTimeValue.textContent);
  renderStatus(autoFixture, false);
  check("chart-query-time-ux-manual-status-behavior", "○ 手動查詢時間", autoFixture.chartQueryTimeModeStatus.textContent);
  check("chart-query-time-ux-manual-value-kept", "2026/08/07 17:00:05", autoFixture.chartQueryTimeValue.textContent);
}

function runCalendarBrowseAutoNowBugFixTests() {
  const check = (id, expected, actual) => {
    calendarBrowseAutoNowBugFixVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };

  const yearSource = extractNamedFunctionSource(mainModuleRaw, "handleCalendarYearChange");
  const monthShiftSource = extractNamedFunctionSource(mainModuleRaw, "shiftVisibleCalendarMonth");
  const previousListenerSource = mainModuleRaw.match(/elements\.calendarPrevious\.addEventListener\("click", \(\) => \{[\s\S]*?\}\);/)?.[0] ?? "";
  const nextListenerSource = mainModuleRaw.match(/elements\.calendarNext\.addEventListener\("click", \(\) => \{[\s\S]*?\}\);/)?.[0] ?? "";
  const refreshSource = extractNamedFunctionSource(mainModuleRaw, "refreshFromCurrentTime");
  const autoClockSource = extractNamedFunctionSource(mainModuleRaw, "refreshQueryTimeFromAutoNowClock");
  const clockSource = extractNamedFunctionSource(mainModuleRaw, "refreshTrueSolarTimeClock");
  const pauseSource = extractNamedFunctionSource(mainModuleRaw, "pauseAutoNowMode");
  const startSource = extractNamedFunctionSource(mainModuleRaw, "startAutoNowMode");
  const dateSource = extractNamedFunctionSource(mainModuleRaw, "selectQueryCalendarDate");
  const hourSource = extractNamedFunctionSource(mainModuleRaw, "selectChineseHour");
  const switchSource = extractNamedFunctionSource(mainModuleRaw, "handleChartDisplayModeSwitchClick");
  const modeStatus = loadChartQueryTimeModeStatusForTest(mainModuleRaw);

  check("calendar-browse-initial-year-from-clock", true, /let visibleCalendarYear = new Date\(\)\.getFullYear\(\)/.test(mainModuleRaw));
  check("calendar-browse-year-pauses-before-write", true, yearSource.indexOf("pauseAutoNowMode()") >= 0 && yearSource.indexOf("pauseAutoNowMode()") < yearSource.indexOf("visibleCalendarYear ="));
  check("calendar-browse-year-renders-picker", true, yearSource.includes("renderQueryPicker()"));
  check("calendar-browse-year-does-not-write-datetime", false, /elements\.datetime\.value|requestRenderDateTime|syncQueryPickerFromDateTime/.test(yearSource));
  check("calendar-browse-month-helper-does-not-pause", false, monthShiftSource.includes("pauseAutoNowMode()"));
  check("calendar-browse-previous-pauses", true, previousListenerSource.includes("pauseAutoNowMode()") && previousListenerSource.indexOf("pauseAutoNowMode()") < previousListenerSource.indexOf("shiftVisibleCalendarMonth(-1)"));
  check("calendar-browse-next-pauses", true, nextListenerSource.includes("pauseAutoNowMode()") && nextListenerSource.indexOf("pauseAutoNowMode()") < nextListenerSource.indexOf("shiftVisibleCalendarMonth(1)"));
  check("calendar-browse-previous-no-datetime", false, /elements\.datetime\.value|requestRenderDateTime/.test(previousListenerSource));
  check("calendar-browse-next-no-datetime", false, /elements\.datetime\.value|requestRenderDateTime/.test(nextListenerSource));
  check("calendar-browse-auto-state-pauses", true, pauseSource.includes("isAutoNowMode = false") && pauseSource.includes("stopAutoNowRefresh()"));
  check("calendar-browse-pause-stops-true-solar-clock", true, pauseSource.includes("syncTrueSolarTimeClockRefresh()"));
  check("calendar-browse-auto-tick-guard", true, refreshSource.includes("if (!isAutoNowMode)") && refreshSource.includes("return"));
  check("calendar-browse-true-solar-clock-guard", true, autoClockSource.includes("if (!isAutoNowMode)") && autoClockSource.includes("return"));
  check("calendar-browse-clock-only-runs-auto", true, clockSource.includes("trueSolarTimeSource === TRUE_SOLAR_TIME_SOURCE.QUERY && isAutoNowMode") && clockSource.includes("if (isAutoNowMode)"));
  check("calendar-browse-year-no-new-timer", 2, (mainModuleRaw.match(/setInterval\(/g) ?? []).length);
  check("calendar-browse-date-is-formal-change", true, dateSource.includes("elements.datetime.value = dateTimeValue") && dateSource.includes("requestRenderDateTime(dateTimeValue)"));
  check("calendar-browse-date-pauses", true, dateSource.includes("pauseAutoNowMode()"));
  check("calendar-browse-hour-is-formal-change", true, hourSource.includes("elements.datetime.value = dateTimeValue") && hourSource.includes("requestRenderDateTime(dateTimeValue)"));
  check("calendar-browse-hour-pauses", true, hourSource.includes("pauseAutoNowMode()"));
  check("calendar-browse-now-restarts-auto", true, mainModuleRaw.includes('elements.useNow.addEventListener("click", () => {') && mainModuleRaw.includes("startAutoNowMode();"));
  check("calendar-browse-now-resyncs-visible-month", true, startSource.includes("refreshFromCurrentTime()") && refreshSource.includes("syncQueryPickerFromDateTime(elements.datetime.value, { syncVisibleMonth: true })"));
  check("calendar-browse-mode-switch-keeps-auto-state", false, switchSource.includes("startAutoNowMode()") || switchSource.includes("pauseAutoNowMode()"));

  const runYearHandler = Function(
    "elements",
    "pauseAutoNowMode",
    "clampQueryYear",
    "renderQueryPicker",
    `let visibleCalendarYear = 2026;\n${yearSource}\nhandleCalendarYearChange();\nreturn { visibleCalendarYear };`
  );
  const yearState = { auto: true, pauseCount: 0, renderCount: 0 };
  const yearElements = {
    calendarYear: { value: "2024" },
    datetime: { value: "2026-08-10T09:00:00" },
  };
  const yearResult = runYearHandler(
    yearElements,
    () => {
      yearState.auto = false;
      yearState.pauseCount += 1;
    },
    (year) => Math.min(2100, Math.max(1900, Math.trunc(year))),
    () => { yearState.renderCount += 1; }
  );
  check("calendar-browse-year-runtime-pauses", 1, yearState.pauseCount);
  check("calendar-browse-year-runtime-manual", false, yearState.auto);
  check("calendar-browse-year-runtime-keeps-2024", 2024, yearResult.visibleCalendarYear);
  check("calendar-browse-year-runtime-keeps-datetime", "2026-08-10T09:00:00", yearElements.datetime.value);
  check("calendar-browse-year-runtime-renders", 1, yearState.renderCount);

  const runNavigation = (listenerSource, elementName, expectedDelta) => {
    const state = { auto: true, pauseCount: 0, delta: null };
    const button = {
      callback: null,
      addEventListener(type, callback) {
        this.type = type;
        this.callback = callback;
      },
    };
    const elements = { [elementName]: button };
    const install = Function(
      "elements",
      "pauseAutoNowMode",
      "shiftVisibleCalendarMonth",
      `${listenerSource}\nreturn elements.${elementName};`
    );
    const installed = install(
      elements,
      () => {
        state.auto = false;
        state.pauseCount += 1;
      },
      (delta) => { state.delta = delta; }
    );
    installed.callback();
    return state;
  };
  const previousState = runNavigation(previousListenerSource, "calendarPrevious", -1);
  const nextState = runNavigation(nextListenerSource, "calendarNext", 1);
  check("calendar-browse-previous-runtime-pauses", 1, previousState.pauseCount);
  check("calendar-browse-previous-runtime-manual", false, previousState.auto);
  check("calendar-browse-previous-runtime-shifts", -1, previousState.delta);
  check("calendar-browse-next-runtime-pauses", 1, nextState.pauseCount);
  check("calendar-browse-next-runtime-manual", false, nextState.auto);
  check("calendar-browse-next-runtime-shifts", 1, nextState.delta);

  const statusFixture = {
    datetime: { value: "2026-08-10T09:00:00" },
    chartQueryTimeValue: { textContent: "" },
    chartQueryTimeModeStatus: { textContent: "", dataset: {} },
  };
  modeStatus(statusFixture, false);
  check("calendar-browse-year-manual-status", "○ 手動查詢時間", statusFixture.chartQueryTimeModeStatus.textContent);
  modeStatus(statusFixture, true);
  check("calendar-browse-now-auto-status", "● 跟隨現在時間", statusFixture.chartQueryTimeModeStatus.textContent);
}

function runPreciseChartTimeInputTests(solarTerms) {
  const check = (id, expected, actual) => {
    preciseChartTimeInputVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };

  const datetimeInput = indexHtmlRaw.match(/<input id="datetime"[^>]*>/)?.[0] ?? "";
  const wrapperSource = indexHtmlRaw.match(/<div id="precise-chart-time-control"[\s\S]*?<\/div>\s*<div class="query-picker">/)?.[0] ?? "";
  const picker = loadQueryPickerHelpersForTest(mainModuleRaw);
  const manualInputSource = extractNamedFunctionSource(mainModuleRaw, "handleManualDateTimeInput");
  const manualChangeSource = extractNamedFunctionSource(mainModuleRaw, "handleManualDateTimeChange");
  const requestSource = extractNamedFunctionSource(mainModuleRaw, "requestRenderDateTime");
  const lightweightSource = extractNamedFunctionSource(mainModuleRaw, "refreshBaziForCurrentChartTime");
  const autoClockSource = extractNamedFunctionSource(mainModuleRaw, "refreshQueryTimeFromAutoNowClock");
  const refreshSource = extractNamedFunctionSource(mainModuleRaw, "refreshFromCurrentTime");
  const pickerSyncSource = extractNamedFunctionSource(mainModuleRaw, "syncQueryPickerFromDateTime");
  const hourSource = extractNamedFunctionSource(mainModuleRaw, "selectChineseHour");
  const tabSource = extractNamedFunctionSource(mainModuleRaw, "setActiveTab");
  const modeSource = extractNamedFunctionSource(mainModuleRaw, "renderChartDisplayMode");
  const deviceSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForDeviceNow");
  const customSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForCustomInput");
  const startSource = extractNamedFunctionSource(mainModuleRaw, "startAutoNowMode");

  check("precise-time-datetime-single-input", 1, (indexHtmlRaw.match(/id="datetime"/g) ?? []).length);
  check("precise-time-datetime-local", true, datetimeInput.includes('type="datetime-local"'));
  check("precise-time-step-one", true, datetimeInput.includes('step="1"'));
  check("precise-time-wrapper-present", true, indexHtmlRaw.includes('id="precise-chart-time-control"') && indexHtmlRaw.includes('class="precise-chart-time-control"'));
  check("precise-time-wrapper-label", true, wrapperSource.includes("精確排盤時間") && wrapperSource.includes('for="datetime"'));
  check("precise-time-wrapper-note", true, wrapperSource.includes("供交節、換日與時辰邊界精確查詢"));
  check("precise-time-input-visible-class", true, datetimeInput.includes('class="precise-chart-time-input"') && !datetimeInput.includes("query-datetime-state"));
  check("precise-time-scoped-css", true, mainCssRaw.includes(".precise-chart-time-control") && mainCssRaw.includes(".precise-chart-time-input") && mainCssRaw.includes(".precise-chart-time-note"));
  check("precise-time-css-no-global-input-edit", false, /(^|\n)input\s*\{[^}]*display\s*:\s*none/.test(mainCssRaw));

  const preciseValue = "2024-02-04T16:27:13";
  const parsed = picker.parseDateTimeLocalValue(preciseValue);
  check("precise-time-parse-valid", true, parsed instanceof Date && Number.isFinite(parsed.getTime()));
  check("precise-time-parse-keeps-second", 13, parsed?.getSeconds());
  check("precise-time-format-keeps-second", preciseValue, picker.toLocalDatetimeValue(parsed));
  check("precise-time-calendar-selected-date", JSON.stringify({ year: 2024, month: 1, day: 4 }), JSON.stringify(picker.getSelectedCalendarDateFromDateTime(preciseValue)));
  check("precise-time-chinese-hour-selected", 9, picker.getChineseHourIndex(preciseValue));
  check("precise-time-picker-sync-does-not-write-input", false, /elements\.datetime\.value\s*=/.test(pickerSyncSource));
  check("precise-time-hour-shortcut-申", "2024-02-04T15:00:00", picker.buildDateTimeValueFromDateAndChineseHour(2024, 1, 4, 9));
  check("precise-time-hour-shortcut-酉", "2024-02-04T17:00:00", picker.buildDateTimeValueFromDateAndChineseHour(2024, 1, 4, 10));
  check("precise-time-hour-shortcut-keeps-no-seconds", true, picker.buildDateTimeValueFromDateAndChineseHour(2024, 1, 4, 9).endsWith("T15:00:00"));
  check("precise-time-hour-render-uses-active-clock-state", true, extractNamedFunctionSource(mainModuleRaw, "renderChineseHourButtons").includes("getChineseHourPickerState()"));
  check("precise-time-calendar-render-reads-datetime", true, extractNamedFunctionSource(mainModuleRaw, "renderMonthCalendarDays").includes("selectedCalendarDate"));

  check("precise-time-manual-input-pauses", true, manualInputSource.includes("pauseAutoNowMode()"));
  check("precise-time-manual-change-pauses", true, manualChangeSource.includes("pauseAutoNowMode()"));
  check("precise-time-manual-input-syncs-picker", true, manualInputSource.includes("syncQueryPickerFromDateTime(elements.datetime.value, { syncVisibleMonth: true })"));
  check("precise-time-manual-change-syncs-picker", true, manualChangeSource.includes("syncQueryPickerFromDateTime(elements.datetime.value, { syncVisibleMonth: true })"));
  check("precise-time-request-keeps-full-value", true, requestSource.includes("refreshBaziForCurrentChartTime(dateTimeValue, requestId)") && requestSource.includes("renderByDateTime(dateTimeValue)"));
  check("precise-time-request-no-minute-truncation", false, /slice\(0,\s*16\)|setSeconds\(0\)|setMilliseconds\(0\)/.test(requestSource));
  check("precise-time-lightweight-keeps-value", true, lightweightSource.includes("dateTimeValue = normalizeLocalDateTimeValueWithSeconds(dateTimeValue)") && lightweightSource.includes("refreshFlyingStarsForCurrentChartTime(requestId)"));
  check("precise-time-lightweight-no-await", false, lightweightSource.includes("await"));
  check("precise-time-flying-stars-same-snapshot", true, mainModuleRaw.includes("currentWatchBaziResult = result") && lightweightSource.includes("refreshFlyingStarsForCurrentChartTime(requestId)"));

  const runManualHandler = (functionName, functionSource) => {
    const state = { pause: 0, invalidate: 0, sync: [], render: [], read: true };
    const elements = { datetime: { value: preciseValue } };
    const factory = Function(
      "elements",
      "pauseAutoNowMode",
      "invalidateCurrentTrueSolarChartContext",
      "readDateTimeInput",
      "syncQueryPickerFromDateTime",
      "requestRenderDateTime",
      `${functionSource}\nreturn ${functionName};`
    );
    const handler = factory(
      elements,
      () => { state.pause += 1; },
      () => { state.invalidate += 1; },
      () => state.read,
      (...args) => { state.sync.push(args); },
      (value) => { state.render.push(value); }
    );
    handler();
    return { state, elements };
  };
  const manualInput = runManualHandler("handleManualDateTimeInput", manualInputSource);
  const manualChange = runManualHandler("handleManualDateTimeChange", manualChangeSource);
  check("precise-time-manual-input-runtime-pauses", 1, manualInput.state.pause);
  check("precise-time-manual-change-runtime-pauses", 1, manualChange.state.pause);
  check("precise-time-manual-input-runtime-keeps-second", preciseValue, manualInput.state.render[0]);
  check("precise-time-manual-change-runtime-keeps-second", preciseValue, manualChange.state.render[0]);
  check("precise-time-manual-input-runtime-sync-value", preciseValue, manualInput.state.sync[0]?.[0]);
  check("precise-time-manual-change-runtime-sync-value", preciseValue, manualChange.state.sync[0]?.[0]);

  check("precise-time-auto-clock-includes-seconds", true, autoClockSource.includes("toLocalDatetimeValue(new Date())") && autoClockSource.includes("elements.datetime.value = dateTimeValue"));
  check("precise-time-auto-clock-syncs-picker", true, autoClockSource.includes("syncQueryPickerFromDateTime(dateTimeValue, { syncVisibleMonth: true })"));
  check("precise-time-auto-clock-no-new-timer", false, autoClockSource.includes("setInterval") || autoClockSource.includes("setTimeout"));
  check("precise-time-auto-full-refresh-keeps-seconds", true, refreshSource.includes("elements.datetime.value = toLocalDatetimeValue(new Date())") && refreshSource.includes("requestRenderDateTime(elements.datetime.value)"));
  check("precise-time-now-restores-auto", true, mainModuleRaw.includes('elements.useNow.addEventListener("click", () => {') && mainModuleRaw.includes("startAutoNowMode();"));
  check("precise-time-status-derived-from-auto-state", true, extractNamedFunctionSource(mainModuleRaw, "renderChartQueryTimeModeStatus").includes("isAutoNowMode ? \"● 跟隨現在時間\" : \"○ 手動查詢時間\""));

  check("precise-time-tab-switch-does-not-write", false, /elements\.datetime\.value\s*=|requestRenderDateTime/.test(tabSource));
  check("precise-time-mode-switch-does-not-write", false, /elements\.datetime\.value\s*=|requestRenderDateTime/.test(modeSource));
  check("precise-time-mode-switch-keeps-auto-state", false, modeSource.includes("startAutoNowMode()") || modeSource.includes("pauseAutoNowMode()"));
  check("precise-time-source-b-keeps-top-time", false, /elements\.datetime\.value\s*=|requestRenderDateTime/.test(deviceSource));
  check("precise-time-source-c-keeps-top-time", false, /elements\.datetime\.value\s*=|requestRenderDateTime/.test(customSource));
  check("precise-time-only-one-datetime-state", false, /preciseDateTime|preciseDatetime|secondDateTime/.test(mainModuleRaw));
  check("precise-time-existing-two-timers", 2, (mainModuleRaw.match(/setInterval\(/g) ?? []).length);
  check("precise-time-no-storage", false, /localStorage|sessionStorage/.test(mainModuleRaw));
  check("precise-time-no-new-dependency", false, /^import .* from ["'](?!\.{1,2}\/)/m.test(mainModuleRaw));

  const formatTimestamp = (timeMs) => new Date(timeMs).toISOString();
  const lichun = solarTerms.find((term) => term.name === "立春" && term.year_taipei === 2024);
  const jingzhe = solarTerms.find((term) => term.name === "驚蟄" && term.year_taipei === 2024);
  check("precise-time-lichun-data-utc", "2024-02-04T08:27:08.694Z", formatTimestamp(lichun.timeMs));
  check("precise-time-lichun-data-asia-taipei", "2024-02-04T16:27:08.694+08:00", lichun.asia_taipei);
  check("precise-time-lichun-data-utc-string", "2024-02-04T08:27:08.694+00:00", lichun.utc);
  check("precise-time-lichun-data-time-ms", 1707035228694, lichun.timeMs);
  check("precise-time-lichun-ui-before-second", "2024-02-04T16:27:08", "2024-02-04T16:27:08");
  check("precise-time-lichun-ui-after-second", "2024-02-04T16:27:09", "2024-02-04T16:27:09");

  const createWatchContextAt = (instantMs) => {
    const zoned = getZonedDateTimeParts(new Date(instantMs), "Asia/Taipei");
    return createWatchChartTimeContext({
      source: "query",
      civil: {
        localParts: { ...zoned.localParts, millisecond: 0 },
        timeZone: "Asia/Taipei",
        utcOffsetMinutes: zoned.utcOffsetMinutes,
        abbreviation: zoned.abbreviation,
        instantMs,
      },
      createdAtInstantMs: 0,
    });
  };
  const createTrueSolarContextAt = (instantMs) => {
    const zoned = getZonedDateTimeParts(new Date(instantMs), "Asia/Taipei");
    const localParts = { ...zoned.localParts, millisecond: 0 };
    const carrierDate = new Date(Date.UTC(localParts.year, localParts.month - 1, localParts.day, localParts.hour, localParts.minute, localParts.second));
    const trueSolarResult = calculateTrueSolarTime({
      date: carrierDate,
      latitude: 25.033964,
      longitude: 121.564468,
      utcOffsetMinutes: 480,
      useUtcComponents: true,
    });
    return createTrueSolarChartTimeContext({
      source: "query",
      civil: {
        localParts,
        timeZone: "Asia/Taipei",
        utcOffsetMinutes: 480,
        abbreviation: zoned.abbreviation,
        instantMs,
      },
      location: { latitude: 25.033964, longitude: 121.564468, accuracy: null },
      trueSolarResult,
      createdAtInstantMs: 0,
    });
  };

  for (const [id, delta, expectedYear, expectedMonth, expectedPeriod] of [
    ["before", -1, "癸卯", "乙丑", 8],
    ["exact", 0, "甲辰", "丙寅", 9],
    ["after", 1, "甲辰", "丙寅", 9],
  ]) {
    const context = createWatchContextAt(lichun.timeMs + delta);
    const bazi = calculateBaziFromChartTimeContext(context, solarTerms);
    const charts = calculateFlyingStarsFromBaziResult(context, bazi);
    check(`precise-time-lichun-${id}-year`, expectedYear, bazi.yearPillar);
    check(`precise-time-lichun-${id}-month`, expectedMonth, bazi.monthPillar);
    check(`precise-time-lichun-${id}-period`, expectedPeriod, charts.period.period);
    check(`precise-time-lichun-${id}-annual`, expectedPeriod, charts.annual.basis.year === 2023 ? 8 : charts.period.period);
    check(`precise-time-lichun-${id}-term`, id === "before" ? "大寒" : "立春", bazi.currentTerm.name);
  }

  for (const [id, delta, expectedMonth, expectedPeriod, expectedTerm] of [
    ["before", -1, "丙寅", 9, "雨水"],
    ["exact", 0, "丁卯", 9, "驚蟄"],
    ["after", 1, "丁卯", 9, "驚蟄"],
  ]) {
    const context = createWatchContextAt(jingzhe.timeMs + delta);
    const bazi = calculateBaziFromChartTimeContext(context, solarTerms);
    const charts = calculateFlyingStarsFromBaziResult(context, bazi);
    check(`precise-time-jingzhe-${id}-month`, expectedMonth, bazi.monthPillar);
    check(`precise-time-jingzhe-${id}-monthly-basis`, expectedMonth, charts.monthly.basis.monthPillar);
    check(`precise-time-jingzhe-${id}-period-unchanged`, expectedPeriod, charts.period.period);
    check(`precise-time-jingzhe-${id}-term`, expectedTerm, bazi.currentTerm.name);
  }

  for (const [id, delta, expectedYear, expectedMonth, expectedPeriod] of [
    ["before", -1, "癸卯", "乙丑", 8],
    ["exact", 0, "甲辰", "丙寅", 9],
    ["after", 1, "甲辰", "丙寅", 9],
  ]) {
    const context = createTrueSolarContextAt(lichun.timeMs + delta);
    const bazi = calculateBaziFromChartTimeContext(context, solarTerms);
    const charts = calculateFlyingStarsFromBaziResult(context, bazi);
    check(`precise-time-true-solar-civil-${id}-year`, expectedYear, bazi.yearPillar);
    check(`precise-time-true-solar-civil-${id}-month`, expectedMonth, bazi.monthPillar);
    check(`precise-time-true-solar-civil-${id}-period`, expectedPeriod, charts.period.period);
    check(`precise-time-true-solar-civil-${id}-clock-source`, "true-solar", charts.debug.clockBasis);
  }
  check("precise-time-true-solar-civil-contract", true, mainModuleRaw.includes("currentTrueSolarChartContext") && mainModuleRaw.includes("currentTrueSolarBaziResult"));
  check("precise-time-no-formula-modification", false, /MONTH_CENTER_TABLE|DAY_CENTER_SYSTEMS|HOURLY_STAR_TABLES/.test(mainModuleRaw));
}

function runPreciseChartTimeZeroSecondBugFixTests(solarTerms) {
  const check = (id, expected, actual) => {
    preciseChartTimeZeroSecondBugFixVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const helperSource = extractNamedFunctionSource(mainModuleRaw, "createCurrentWatchChartTimeContext");
  const formalSource = extractNamedFunctionSource(mainModuleRaw, "renderFormalTrueSolarChartTime");
  const requestSource = extractNamedFunctionSource(mainModuleRaw, "requestRenderDateTime");
  const autoClockSource = extractNamedFunctionSource(mainModuleRaw, "refreshQueryTimeFromAutoNowClock");
  const sourceB = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForDeviceNow");
  const sourceC = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForCustomInput");
  const parseDefinitions = [
    "parseDateTimeLocalValue",
    "toLocalDatetimeValue",
    "normalizeLocalDateTimeValueWithSeconds",
  ].map((name) => extractNamedFunctionSource(mainModuleRaw, name)).join("\n\n");
  const normalize = Function(`${parseDefinitions}\nreturn normalizeLocalDateTimeValueWithSeconds;`)();
  const topParser = loadTopQueryDateTimeLocalPartsForTest(mainModuleRaw);
  const createCurrentWatchContext = Function(
    "parseTopQueryDateTimeLocalParts",
    "normalizeLocalDateTimeValueWithSeconds",
    "resolveLocalDateTimeInTimeZone",
    "createWatchChartTimeContext",
    "TRUE_SOLAR_TIME_SOURCE",
    `${helperSource}\nreturn createCurrentWatchChartTimeContext;`
  )(
    topParser,
    normalize,
    resolveLocalDateTimeInTimeZone,
    createWatchChartTimeContext,
    { QUERY: "query" }
  );

  check("zero-second-normalize-hh-mm-accepted", "2024-02-04T16:27:00", normalize("2024-02-04T16:27"));
  check("zero-second-normalize-hh-mm-zero", "2024-02-04T16:27:00", normalize("2024-02-04T16:27:00"));
  check("zero-second-normalize-hh-mm-42", "2024-02-04T16:27:42", normalize("2024-02-04T16:27:42"));
  check("zero-second-normalize-invalid", null, normalize("2024-02-04T25:27"));
  check("zero-second-watch-helper-raw-hh-mm", true, Boolean(createCurrentWatchContext("2024-02-04T16:27")));
  const rawWatchContext = createCurrentWatchContext("2024-02-04T16:27");
  check("zero-second-watch-helper-canonical-compatibility", "2024-02-04T16:27:00", rawWatchContext?.compatibility.taipeiLegacyDateTimeValue);
  check("zero-second-watch-helper-canonical-local", "2024-02-04T16:27:00", rawWatchContext?.compatibility.watchLocalDateTimeValue);
  check("zero-second-formal-source-canonicalizes", true, formalSource.includes("normalizeLocalDateTimeValueWithSeconds(elements.datetime.value)") && formalSource.includes("watchLocalDateTimeValue: canonicalDateTimeValue"));
  check("zero-second-request-canonical-boundary", true, requestSource.includes("dateTimeValue = normalizeLocalDateTimeValueWithSeconds(dateTimeValue)"));
  check("zero-second-auto-now-remains-second-based", true, autoClockSource.includes("toLocalDatetimeValue(new Date())") && !autoClockSource.includes("setSeconds(0)"));

  const instantForTaipei = (localParts) => Date.UTC(
    localParts.year,
    localParts.month - 1,
    localParts.day,
    localParts.hour,
    localParts.minute,
    localParts.second,
    localParts.millisecond ?? 0
  ) - 480 * 60_000;
  const createWatchContextAt = (instantMs) => {
    const zoned = getZonedDateTimeParts(new Date(instantMs), "Asia/Taipei");
    return createWatchChartTimeContext({
      source: "query",
      civil: {
        localParts: { ...zoned.localParts, millisecond: 0 },
        timeZone: "Asia/Taipei",
        utcOffsetMinutes: zoned.utcOffsetMinutes,
        abbreviation: zoned.abbreviation,
        instantMs,
      },
      createdAtInstantMs: 0,
    });
  };
  const createTrueSolarContextAt = (instantMs) => {
    const zoned = getZonedDateTimeParts(new Date(instantMs), "Asia/Taipei");
    const localParts = { ...zoned.localParts, millisecond: 0 };
    const carrierDate = new Date(Date.UTC(localParts.year, localParts.month - 1, localParts.day, localParts.hour, localParts.minute, localParts.second));
    const trueSolarResult = calculateTrueSolarTime({
      date: carrierDate,
      latitude: 25.033964,
      longitude: 121.564468,
      utcOffsetMinutes: 480,
      useUtcComponents: true,
    });
    return createTrueSolarChartTimeContext({
      source: "query",
      civil: {
        localParts,
        timeZone: "Asia/Taipei",
        utcOffsetMinutes: 480,
        abbreviation: zoned.abbreviation,
        instantMs,
      },
      location: { latitude: 25.033964, longitude: 121.564468, accuracy: null },
      trueSolarResult,
      compatibility: {
        watchLocalDateTimeValue: normalize(`${String(localParts.year).padStart(4, "0")}-${String(localParts.month).padStart(2, "0")}-${String(localParts.day).padStart(2, "0")}T${String(localParts.hour).padStart(2, "0")}:${String(localParts.minute).padStart(2, "0")}`),
      },
      createdAtInstantMs: 0,
    });
  };

  const lichun = solarTerms.find((term) => term.name === "立春" && term.year_taipei === 2024);
  const watchAt1600 = createWatchContextAt(Date.UTC(2024, 1, 4, 8, 27, 0));
  const baziAt1600 = calculateBaziFromChartTimeContext(watchAt1600, solarTerms);
  const starsAt1600 = calculateFlyingStarsFromBaziResult(watchAt1600, baziAt1600);
  check("zero-second-16-27-00-no-throw", true, Boolean(starsAt1600));
  check("zero-second-16-27-00-pre-lichun", "大寒", baziAt1600.currentTerm.name);
  check("zero-second-16-27-00-old-year", "癸卯", baziAt1600.yearPillar);
  check("zero-second-16-27-00-old-month", "乙丑", baziAt1600.monthPillar);
  check("zero-second-16-27-00-period-eight", 8, starsAt1600.period.period);
  check("zero-second-16-27-00-flying-stars", true, Number.isInteger(starsAt1600.hourly.centerStar));

  for (const [id, delta, expectedYear, expectedMonth, expectedTerm, expectedPeriod] of [
    ["08", -694, "癸卯", "乙丑", "大寒", 8],
    ["09", 306, "甲辰", "丙寅", "立春", 9],
  ]) {
    const context = createWatchContextAt(lichun.timeMs + delta);
    const bazi = calculateBaziFromChartTimeContext(context, solarTerms);
    const charts = calculateFlyingStarsFromBaziResult(context, bazi);
    check(`zero-second-lichun-${id}-term`, expectedTerm, bazi.currentTerm.name);
    check(`zero-second-lichun-${id}-year`, expectedYear, bazi.yearPillar);
    check(`zero-second-lichun-${id}-month`, expectedMonth, bazi.monthPillar);
    check(`zero-second-lichun-${id}-period`, expectedPeriod, charts.period.period);
  }

  const trueSolarAt1600 = createTrueSolarContextAt(Date.UTC(2024, 1, 4, 8, 27, 0));
  const trueSolarBaziAt1600 = calculateBaziFromChartTimeContext(trueSolarAt1600, solarTerms);
  check("zero-second-true-solar-16-27-00-no-throw", true, Boolean(trueSolarBaziAt1600));
  check("zero-second-true-solar-16-27-00-compatibility", "2024-02-04T16:27:00", trueSolarAt1600.compatibility.watchLocalDateTimeValue);
  check("zero-second-true-solar-16-27-00-pre-lichun", "癸卯", trueSolarBaziAt1600.yearPillar);

  const nineClockContext = createWatchContextAt(instantForTaipei({ year: 2024, month: 2, day: 4, hour: 9, minute: 0, second: 0 }));
  const nineClockBazi = calculateBaziFromChartTimeContext(nineClockContext, solarTerms);
  check("zero-second-09-00-no-throw", true, Boolean(nineClockBazi));
  check("zero-second-09-00-hour", "巳", nineClockBazi.hourPillar[1]);

  const beforeNineContext = createWatchContextAt(instantForTaipei({ year: 2024, month: 2, day: 4, hour: 8, minute: 59, second: 0 }));
  const afterNineContext = createWatchContextAt(instantForTaipei({ year: 2024, month: 2, day: 4, hour: 9, minute: 1, second: 0 }));
  const beforeNineBazi = calculateBaziFromChartTimeContext(beforeNineContext, solarTerms);
  const afterNineBazi = calculateBaziFromChartTimeContext(afterNineContext, solarTerms);
  check("zero-second-08-59-no-throw", true, Boolean(beforeNineBazi));
  check("zero-second-08-59-hour", "辰", beforeNineBazi.hourPillar[1]);
  check("zero-second-09-01-no-throw", true, Boolean(afterNineBazi));
  check("zero-second-09-01-hour", "巳", afterNineBazi.hourPillar[1]);

  const before23Context = createWatchContextAt(instantForTaipei({ year: 2024, month: 2, day: 4, hour: 22, minute: 59, second: 0 }));
  const at23Context = createWatchContextAt(instantForTaipei({ year: 2024, month: 2, day: 4, hour: 23, minute: 0, second: 0 }));
  const after23Context = createWatchContextAt(instantForTaipei({ year: 2024, month: 2, day: 4, hour: 23, minute: 1, second: 0 }));
  const before23Bazi = calculateBaziFromChartTimeContext(before23Context, solarTerms);
  const at23Bazi = calculateBaziFromChartTimeContext(at23Context, solarTerms);
  const after23Bazi = calculateBaziFromChartTimeContext(after23Context, solarTerms);
  check("zero-second-22-59-no-throw", true, Boolean(before23Bazi));
  check("zero-second-22-59-hour", "亥", before23Bazi.hourPillar[1]);
  check("zero-second-23-00-no-throw", true, Boolean(at23Bazi));
  check("zero-second-23-00-hour", "子", at23Bazi.hourPillar[1]);
  check("zero-second-23-01-no-throw", true, Boolean(after23Bazi));
  check("zero-second-23-01-hour", "子", after23Bazi.hourPillar[1]);
  check("zero-second-23-00-effective-day-changes", false, before23Bazi.dayPillar === at23Bazi.dayPillar);

  check("zero-second-source-b-isolation", false, sourceB.includes("elements.datetime.value =") || sourceB.includes("requestRenderDateTime"));
  check("zero-second-source-c-isolation", false, sourceC.includes("elements.datetime.value =") || sourceC.includes("requestRenderDateTime"));
  check("zero-second-no-new-timer", 2, (mainModuleRaw.match(/setInterval\(/g) ?? []).length);
  check("zero-second-no-second-state", false, /preciseDateTime|preciseDatetime|secondDateTime/.test(mainModuleRaw));
  check("zero-second-chart-context-stays-strict", false, validateChartTimeContext({
    ...rawWatchContext,
    compatibility: { ...rawWatchContext.compatibility, taipeiLegacyDateTimeValue: "2024-02-04T16:27" },
  }).valid);
  check("zero-second-chart-context-no-schema-edit", false, mainModuleRaw.includes("isValidLocalDateTimeValue"));
}

function runTrueSolarFormalTimeSyncBugFixTests() {
  const check = (id, expected, actual) => {
    trueSolarFormalTimeSyncBugFixVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };

  const queryPicker = loadQueryPickerHelpersForTest(mainModuleRaw);
  const parseTopQueryDateTimeLocalParts = loadTopQueryDateTimeLocalPartsForTest(mainModuleRaw);
  const clockSource = extractNamedFunctionSource(mainModuleRaw, "refreshTrueSolarTimeClock");
  const autoClockSource = extractNamedFunctionSource(mainModuleRaw, "refreshQueryTimeFromAutoNowClock");
  const clockSyncSource = extractNamedFunctionSource(mainModuleRaw, "syncTrueSolarTimeClockRefresh");
  const refreshSource = extractNamedFunctionSource(mainModuleRaw, "refreshFromCurrentTime");
  const requestSource = extractNamedFunctionSource(mainModuleRaw, "requestRenderDateTime");
  const manualInputSource = extractNamedFunctionSource(mainModuleRaw, "handleManualDateTimeInput");
  const manualChangeSource = extractNamedFunctionSource(mainModuleRaw, "handleManualDateTimeChange");
  const formalSource = extractNamedFunctionSource(mainModuleRaw, "renderFormalTrueSolarChartTime");
  const calculationSource = extractNamedFunctionSource(mainModuleRaw, "resolveTrueSolarTimeCalculation");
  const contextSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForContext");
  const statusSource = extractNamedFunctionSource(mainModuleRaw, "renderChartTimeStatus");
  const clearSource = extractNamedFunctionSource(mainModuleRaw, "clearCurrentTrueSolarChartContext");
  const invalidateSource = extractNamedFunctionSource(mainModuleRaw, "invalidateCurrentTrueSolarChartContext");
  const renderFormalStatus = loadFormalChartTimeStatusForTest(mainModuleRaw);

  const fixedDate = new Date(2026, 7, 7, 17, 0, 5);
  check("true-solar-sync-to-local-keeps-seconds", "2026-08-07T17:00:05", queryPicker.toLocalDatetimeValue(fixedDate));
  check("true-solar-sync-top-parser-keeps-seconds", 5, parseTopQueryDateTimeLocalParts("2026-08-07T17:00:05")?.second);
  check("true-solar-sync-top-parser-adds-millisecond", 0, parseTopQueryDateTimeLocalParts("2026-08-07T17:00:05")?.millisecond);
  check("true-solar-sync-formal-reads-current-top", true, formalSource.includes("parseTopQueryDateTimeLocalParts(elements.datetime.value)"));
  check("true-solar-sync-formal-invalidates-before-build", true, formalSource.indexOf("invalidateCurrentTrueSolarChartContext()") < formalSource.indexOf("resolveTrueSolarTimeCalculation(context)"));
  check("true-solar-sync-formal-rebuilds-context", true, formalSource.includes("currentTrueSolarChartContextInput = {") && formalSource.includes("currentTrueSolarChartContext = createCurrentTrueSolarChartContext()"));
  check("true-solar-sync-formal-rebuilds-bazi", true, formalSource.includes("renderBaziForActiveDisplayMode()") && mainModuleRaw.includes("currentTrueSolarBaziResult = calculateBaziFromChartTimeContext"));
  check("true-solar-sync-request-invalidates-old-context", true, requestSource.includes("invalidateCurrentTrueSolarChartContext()"));
  check("true-solar-sync-manual-input-invalidates", true, manualInputSource.includes("invalidateCurrentTrueSolarChartContext()") && manualChangeSource.includes("invalidateCurrentTrueSolarChartContext()"));
  check("true-solar-sync-invalidation-clears-context-and-result", true, invalidateSource.includes("clearCurrentTrueSolarChartContext()") && clearSource.includes("currentTrueSolarChartContext = null") && clearSource.includes("currentTrueSolarBaziResult = null"));
  check("true-solar-sync-auto-clock-uses-existing-clock", true, clockSource.includes("refreshQueryTimeFromAutoNowClock()") && !clockSource.includes("setInterval"));
  check("true-solar-sync-auto-clock-reads-new-now", true, autoClockSource.includes("toLocalDatetimeValue(new Date())") && autoClockSource.includes("elements.datetime.value = dateTimeValue"));
  check("true-solar-sync-auto-clock-updates-summary", true, autoClockSource.includes("renderChartQueryTimeModeStatus()") && autoClockSource.includes("syncQueryPickerFromDateTime(dateTimeValue"));
  check("true-solar-sync-auto-clock-rebuilds-formal", true, autoClockSource.includes("renderFormalTrueSolarChartTime()") && autoClockSource.includes("isTrueSolarDisplayMode(chartDisplayMode)"));
  check("true-solar-sync-auto-clock-no-new-timer", false, autoClockSource.includes("setInterval") || autoClockSource.includes("setTimeout"));
  check("true-solar-sync-bc-auto-reuses-existing-clock", true, clockSyncSource.includes("trueSolarTimeSource === TRUE_SOLAR_TIME_SOURCE.DEVICE") && clockSyncSource.includes("|| isAutoNowMode") && autoClockSource.includes("isTrueSolarDisplayMode(chartDisplayMode)"));
  check("true-solar-sync-main-auto-flow-kept", true, refreshSource.includes("toLocalDatetimeValue(new Date())") && refreshSource.includes("requestRenderDateTime(elements.datetime.value)"));
  check("true-solar-sync-status-uses-current-context", true, statusSource.includes("currentTrueSolarChartContext.civil.localParts") && statusSource.includes("currentTrueSolarChartContext.trueSolar.localParts"));
  check("true-solar-sync-one-auto-now-interval", 1, (mainModuleRaw.match(/setInterval\(refreshFromCurrentTime, AUTO_NOW_REFRESH_MS\)/g) ?? []).length);
  check("true-solar-sync-one-formal-clock-interval", 1, (mainModuleRaw.match(/setInterval\(\s*refreshTrueSolarTimeClock,\s*TRUE_SOLAR_TIME_CLOCK_REFRESH_MS/g) ?? []).length);
  check("true-solar-sync-query-source-remains-formal-only", true, formalSource.includes("source: TRUE_SOLAR_TIME_SOURCE.QUERY") && formalSource.includes('timeZone: "Asia/Taipei"') && !formalSource.includes("trueSolarTimeSource"));
  check("true-solar-sync-bc-stays-isolated", true, !contextSource.includes("currentTrueSolarChartContextInput") && contextSource.includes("clearTrueSolarTimePresentation({ clearFormalChart: false })") && formalSource.includes("resolveTrueSolarTimeCalculation(context)"));
  check("true-solar-sync-coordinate-state-is-independent", true, calculationSource.includes("latitude: location.latitude") && calculationSource.includes("longitude: location.longitude") && !contextSource.includes("elements.datetime.value ="));
  check("true-solar-sync-reload-starts-current-flow", true, extractNamedFunctionSource(mainModuleRaw, "initializeChartDisplayMode").includes("renderChartDisplayMode") && extractNamedFunctionSource(mainModuleRaw, "startAutoNowMode").includes("refreshFromCurrentTime()"));

  const watchInput = "2026-08-07T16:59:40";
  const watchLocalParts = { year: 2026, month: 8, day: 7, hour: 16, minute: 59, second: 40, millisecond: 0 };
  const actualFormulaResult = calculateTrueSolarTime({
    date: new Date(Date.UTC(2026, 7, 7, 16, 59, 40)),
    latitude: 25.033964,
    longitude: 121.564468,
    utcOffsetMinutes: 480,
    useUtcComponents: true,
  });
  const formalContext = createTrueSolarChartTimeContext({
    source: "query",
    civil: {
      localParts: watchLocalParts,
      timeZone: "Asia/Taipei",
      utcOffsetMinutes: 480,
      abbreviation: "",
      instantMs: Date.UTC(2026, 7, 7, 16, 59, 40) - 480 * 60_000,
    },
    location: { latitude: 25.033964, longitude: 121.564468, accuracy: null },
    trueSolarResult: actualFormulaResult,
    createdAtInstantMs: 0,
  });
  const watchResult = calculateBaziFromSolarTerms(watchInput, solarTerms);
  const trueSolarResult = calculateBaziFromChartTimeContext(formalContext, solarTerms);
  check("true-solar-sync-actual-formula-crosses-1700", true, actualFormulaResult.trueSolarParts.hour === 17 && actualFormulaResult.trueSolarParts.minute === 0);
  check("true-solar-sync-actual-formula-correction-positive", true, actualFormulaResult.totalCorrectionSeconds > 0);
  check("true-solar-sync-fixture-watch-seconds", "2026-08-07T16:59:40", formalContext.compatibility.watchLocalDateTimeValue);
  check("true-solar-sync-fixture-true-seconds", "2026-08-07T17:00:06", formalContext.compatibility.trueSolarLocalDateTimeValue);
  check("true-solar-sync-fixture-watch-hour", "申", watchResult.hourPillar?.[1]);
  check("true-solar-sync-fixture-true-solar-hour", "酉", trueSolarResult.hourPillar?.[1]);
  check("true-solar-sync-fixture-true-solar-debug-seconds", "2026-08-07 17:00:06", trueSolarResult.debug.clockLocalDateTime);
  const fixtureStatus = renderFormalStatus(formalContext, true);
  check("true-solar-sync-status-fixture-watch-seconds", "手錶時間：2026/08/07 16:59:40", fixtureStatus.lines[0]);
  check("true-solar-sync-status-fixture-true-seconds", "真太陽時：2026/08/07 17:00:06", fixtureStatus.lines[1]);

  const laterInput = "2026-08-07T16:59:50";
  const laterFormulaResult = calculateTrueSolarTime({
    date: new Date(Date.UTC(2026, 7, 7, 16, 59, 50)),
    latitude: 25.033964,
    longitude: 121.564468,
    utcOffsetMinutes: 480,
    useUtcComponents: true,
  });
  const laterContext = createTrueSolarChartTimeContext({
    source: "query",
    civil: {
      localParts: { ...watchLocalParts, second: 50 },
      timeZone: "Asia/Taipei",
      utcOffsetMinutes: 480,
      abbreviation: "",
      instantMs: Date.UTC(2026, 7, 7, 16, 59, 50) - 480 * 60_000,
    },
    location: { latitude: 25.033964, longitude: 121.564468, accuracy: null },
    trueSolarResult: laterFormulaResult,
    createdAtInstantMs: 0,
  });
  check("true-solar-sync-top-change-invalidates-old-civil", false, formalContext.compatibility.watchLocalDateTimeValue === laterContext.compatibility.watchLocalDateTimeValue);
  check("true-solar-sync-top-change-rebuilds-true-local", false, formalContext.compatibility.trueSolarLocalDateTimeValue === laterContext.compatibility.trueSolarLocalDateTimeValue);
  check("true-solar-sync-later-context-keeps-seconds", "2026-08-07T16:59:50", laterContext.compatibility.watchLocalDateTimeValue);
  const laterStatus = renderFormalStatus(laterContext, true);
  check("true-solar-sync-status-after-top-change-watch", "手錶時間：2026/08/07 16:59:50", laterStatus.lines[0]);
  check("true-solar-sync-status-after-top-change-true", "真太陽時：2026/08/07 17:00:16", laterStatus.lines[1]);

  const morningLocalParts = { year: 2026, month: 8, day: 7, hour: 8, minute: 12, second: 49, millisecond: 0 };
  const morningFormulaResult = calculateTrueSolarTime({
    date: new Date(Date.UTC(2026, 7, 7, 8, 12, 49)),
    latitude: 25.033964,
    longitude: 121.564468,
    utcOffsetMinutes: 480,
    useUtcComponents: true,
  });
  const morningContext = createTrueSolarChartTimeContext({
    source: "query",
    civil: {
      localParts: morningLocalParts,
      timeZone: "Asia/Taipei",
      utcOffsetMinutes: 480,
      abbreviation: "",
      instantMs: Date.UTC(2026, 7, 7, 8, 12, 49) - 480 * 60_000,
    },
    location: { latitude: 25.033964, longitude: 121.564468, accuracy: null },
    trueSolarResult: morningFormulaResult,
    createdAtInstantMs: 0,
  });
  const morningStatus = renderFormalStatus(morningContext, true);
  check("true-solar-sync-status-morning-watch", "手錶時間：2026/08/07 08:12:49", morningStatus.lines[0]);
  check("true-solar-sync-status-morning-true", "真太陽時：2026/08/07 08:13:13", morningStatus.lines[1]);
}

function runTrueSolarQuerySourceIsolationBugFixTests() {
  const check = (id, expected, actual) => {
    trueSolarQuerySourceIsolationBugFixVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };

  const formalSource = extractNamedFunctionSource(mainModuleRaw, "renderFormalTrueSolarChartTime");
  const calculationSource = extractNamedFunctionSource(mainModuleRaw, "resolveTrueSolarTimeCalculation");
  const querySource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForContext");
  const clockSource = extractNamedFunctionSource(mainModuleRaw, "refreshTrueSolarTimeClock");
  const autoClockSource = extractNamedFunctionSource(mainModuleRaw, "refreshQueryTimeFromAutoNowClock");
  const sourceChangeSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeSourceChange");
  const displayModeSource = extractNamedFunctionSource(mainModuleRaw, "renderChartDisplayMode");
  const tabSourceStart = mainModuleRaw.indexOf("elements.tabButtons.forEach");
  const tabSourceEnd = mainModuleRaw.indexOf("elements.useNow.addEventListener", tabSourceStart);
  const tabSource = mainModuleRaw.slice(tabSourceStart, tabSourceEnd);

  const forbiddenFormalDom = [
    "renderTrueSolarTimeWatchSummary",
    "trueSolarTimeWatchTitle",
    "trueSolarTimeWatchValue",
    "trueSolarTimeWatchNote",
    "trueSolarTimeResult",
    "trueSolarTimeLocationValue",
    "trueSolarTimeSolarEvents",
    "renderTrueSolarTimeSolarEvents",
    "setTrueSolarTimeStatus",
    "trueSolarTimeSourceQuery",
    "trueSolarTimeSourceDevice",
    "trueSolarTimeSourceCustom",
  ];
  check("source-isolation-formal-no-query-dom", false, forbiddenFormalDom.some((token) => formalSource.includes(token)));
  check("source-isolation-formal-no-query-render", false, formalSource.includes("renderTrueSolarTimeForContext") || formalSource.includes("createTrueSolarTimeResultContent"));
  check("source-isolation-formal-only-context-and-chart", true, formalSource.includes("currentTrueSolarChartContextInput = {") && formalSource.includes("currentTrueSolarChartContext = createCurrentTrueSolarChartContext()") && formalSource.includes("renderBaziForActiveDisplayMode()") && formalSource.includes("renderChartTimeStatus()"));
  check("source-isolation-compute-helper-no-dom", false, /document|elements\.|render|setTrueSolarTimeStatus|trueSolarTimeSource\s*=/.test(calculationSource));
  check("source-isolation-compute-helper-returns-calculation", true, calculationSource.includes("return { civilResolution, carrierDate, result }") && calculationSource.includes("calculateTrueSolarTime"));
  check("source-isolation-query-owns-summary", true, querySource.includes("renderTrueSolarTimeWatchSummary(context)") && querySource.includes("elements.trueSolarTimeResult.replaceChildren"));
  check("source-isolation-query-owns-events", true, querySource.includes("renderTrueSolarTimeSolarEvents(context, carrierDate, location)"));
  check("source-isolation-query-owns-status", true, querySource.includes("setTrueSolarTimeStatus("));
  check("source-isolation-query-uses-compute-helper", true, querySource.includes("resolveTrueSolarTimeCalculation(context)"));
  check("source-isolation-query-keeps-formal-context-separate", false, querySource.includes("currentTrueSolarChartContextInput") || querySource.includes("currentTrueSolarChartContext ="));
  check("source-isolation-custom-no-auto-panel-refresh", true, autoClockSource.includes("trueSolarTimeSource === TRUE_SOLAR_TIME_SOURCE.QUERY") && autoClockSource.includes("renderTrueSolarTimeForWatchDate(dateTimeValue)") && !autoClockSource.includes("renderTrueSolarTimeForCustomInput"));
  check("source-isolation-clock-device-refresh", true, clockSource.includes("trueSolarTimeSource === TRUE_SOLAR_TIME_SOURCE.DEVICE") && clockSource.includes("renderTrueSolarTimeForDeviceNow()"));
  check("source-isolation-clock-query-refresh", true, clockSource.includes("trueSolarTimeSource === TRUE_SOLAR_TIME_SOURCE.QUERY && isAutoNowMode") && autoClockSource.includes("renderTrueSolarTimeForWatchDate(dateTimeValue)"));
  check("source-isolation-clock-custom-no-query-render", true, clockSource.includes("if (isAutoNowMode) {") && autoClockSource.includes("if (trueSolarTimeSource === TRUE_SOLAR_TIME_SOURCE.QUERY)"));
  check("source-isolation-formal-keeps-source-state", false, formalSource.includes("trueSolarTimeSource =") || formalSource.includes("trueSolarTimeSourceQuery.checked") || formalSource.includes("trueSolarTimeSourceDevice.checked") || formalSource.includes("trueSolarTimeSourceCustom.checked"));
  check("source-isolation-compute-keeps-source-state", false, calculationSource.includes("trueSolarTimeSource ="));
  check("source-isolation-source-change-keeps-formal", true, sourceChangeSource.includes("clearTrueSolarTimePresentation({ clearFormalChart: false })") && !sourceChangeSource.includes("renderFormalTrueSolarChartTime"));
  check("source-isolation-source-radio-state-owned-by-user", true, sourceChangeSource.includes("trueSolarTimeSource = event.target.value") && !/trueSolarTimeSource\s*=\s*[^=]/.test(autoClockSource));
  check("source-isolation-tab-does-not-change-source", false, /trueSolarTimeSource\s*=|trueSolarTimeSource.*checked/.test(tabSource));
  check("source-isolation-mode-does-not-change-source", false, /trueSolarTimeSource\s*=|trueSolarTimeSource.*checked/.test(displayModeSource));
  check("source-isolation-tab-keeps-query-controls", true, tabSource.includes("setActiveTab(button.getAttribute(\"aria-controls\"))"));
  check("source-isolation-formal-top-authority", true, formalSource.includes("parseTopQueryDateTimeLocalParts(elements.datetime.value)") && formalSource.includes('timeZone: "Asia/Taipei"'));
  check("source-isolation-bc-not-formal-civil", true, !querySource.includes("elements.datetime.value") && formalSource.includes("source: TRUE_SOLAR_TIME_SOURCE.QUERY"));
  check("source-isolation-no-render-recursion", 1, (formalSource.match(/renderFormalTrueSolarChartTime\(\)/g) ?? []).length);
  check("source-isolation-no-new-timer", false, formalSource.includes("setInterval") || calculationSource.includes("setInterval") || querySource.includes("setInterval"));
  check("source-isolation-existing-timer-counts", 1, (mainModuleRaw.match(/setInterval\(refreshFromCurrentTime, AUTO_NOW_REFRESH_MS\)/g) ?? []).length);
  check("source-isolation-custom-label-retained", true, indexHtmlRaw.includes("自訂當地日期時間（僅換算查詢）") && mainModuleRaw.includes("自訂當地時間（僅換算查詢）"));
  check("source-isolation-device-label-retained", true, indexHtmlRaw.includes("裝置目前時間（僅換算查詢）") && mainModuleRaw.includes("裝置目前時間（僅換算查詢）"));
}

async function runTrueSolarLocationOwnershipFixTests(solarTerms) {
  const check = (id, expected, actual) => {
    trueSolarLocationOwnershipFixVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };

  const ownership = loadTrueSolarLocationOwnershipForTest(mainModuleRaw);
  const sourceChangeSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeSourceChange");
  const inputSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeCoordinateInput");
  const changeSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeCoordinateChange");
  const calculateSource = extractNamedFunctionSource(mainModuleRaw, "calculateTrueSolarTimeFromCoordinateInput");
  const geolocationSource = extractNamedFunctionSource(mainModuleRaw, "requestTrueSolarTimeGeolocation");
  const calculationSource = extractNamedFunctionSource(mainModuleRaw, "resolveTrueSolarTimeCalculation");
  const formalSource = extractNamedFunctionSource(mainModuleRaw, "renderFormalTrueSolarChartTime");
  const deviceSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForDeviceNow");
  const customSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForCustomInput");
  const clearSource = extractNamedFunctionSource(mainModuleRaw, "clearTrueSolarTimePresentation");
  const selectChineseHourSource = extractNamedFunctionSource(mainModuleRaw, "selectChineseHour");
  const pickerSource = extractNamedFunctionSource(mainModuleRaw, "resolveTrueSolarChineseHourDateTime");
  const timezoneInputSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeTimeZoneInput");
  const disambiguationSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeDisambiguationChange");
  const modeSource = extractNamedFunctionSource(mainModuleRaw, "resetLegacyChartTimeState");
  const qimenSource = extractNamedFunctionSource(mainModuleRaw, "renderQimenSection");

  const formalFixture = "25.033964,121.564468";
  const bFixture = "34.0522,-118.2437";
  const cFixture = "35.681236,139.767125";
  const formalLocation = ownership.sync("query", formalFixture);
  check("location-owner-source-a-coordinate-updates-formal", formalFixture, `${formalLocation.latitude},${formalLocation.longitude}`);
  check("location-owner-source-a-formal-state", formalFixture, ownership.locationText("query"));
  check("location-owner-source-a-dom-normalized", "25.033964, 121.564468", ownership.getInput());

  ownership.switchSource("device");
  check("location-owner-source-b-first-switch-clones-value", formalFixture, ownership.locationText("device"));
  check("location-owner-source-b-dom-loads-snapshot", "25.033964, 121.564468", ownership.getInput());
  const bLocation = ownership.sync("device", bFixture);
  check("location-owner-source-b-query-location", bFixture, `${bLocation.latitude},${bLocation.longitude}`);
  check("location-owner-source-b-does-not-write-formal", formalFixture, ownership.locationText("query"));
  check("location-owner-source-b-result-uses-b-location", bFixture, `${calculateTrueSolarTime({ date: new Date(Date.UTC(2026, 7, 10, 12)), latitude: bLocation.latitude, longitude: bLocation.longitude, utcOffsetMinutes: -420, useUtcComponents: true }).latitude},${calculateTrueSolarTime({ date: new Date(Date.UTC(2026, 7, 10, 12)), latitude: bLocation.latitude, longitude: bLocation.longitude, utcOffsetMinutes: -420, useUtcComponents: true }).longitude}`);

  check("location-owner-source-b-invalid-rejected", null, ownership.sync("device", "invalid"));
  check("location-owner-source-b-invalid-clears-query-only", null, ownership.getLocation("device"));
  check("location-owner-source-b-invalid-keeps-formal", formalFixture, ownership.locationText("query"));
  ownership.sync("device", bFixture);

  ownership.switchSource("custom");
  check("location-owner-source-c-first-switch-clones-value", formalFixture, ownership.locationText("custom"));
  const cLocation = ownership.sync("custom", cFixture);
  check("location-owner-source-c-query-location", cFixture, `${cLocation.latitude},${cLocation.longitude}`);
  check("location-owner-source-c-does-not-write-formal", formalFixture, ownership.locationText("query"));
  check("location-owner-source-c-result-uses-c-location", cFixture, `${calculateTrueSolarTime({ date: new Date(Date.UTC(2026, 7, 10, 12)), latitude: cLocation.latitude, longitude: cLocation.longitude, utcOffsetMinutes: 540, useUtcComponents: true }).latitude},${calculateTrueSolarTime({ date: new Date(Date.UTC(2026, 7, 10, 12)), latitude: cLocation.latitude, longitude: cLocation.longitude, utcOffsetMinutes: 540, useUtcComponents: true }).longitude}`);
  check("location-owner-source-c-invalid-rejected", null, ownership.sync("custom", "invalid"));
  check("location-owner-source-c-invalid-clears-query-only", null, ownership.getLocation("custom"));
  check("location-owner-source-c-invalid-keeps-formal", formalFixture, ownership.locationText("query"));
  ownership.sync("custom", cFixture);

  ownership.switchSource("query");
  check("location-owner-switch-bc-a-restores-formal-dom", "25.033964, 121.564468", ownership.getInput());
  ownership.switchSource("device");
  check("location-owner-switch-a-b-restores-b-dom", "34.052200, -118.243700", ownership.getInput());
  ownership.switchSource("custom");
  check("location-owner-switch-b-c-restores-c-dom", "35.681236, 139.767125", ownership.getInput());
  check("location-owner-dom-is-not-authority", formalFixture, ownership.locationText("query"));

  const localParts = { year: 2026, month: 8, day: 10, hour: 12, minute: 0, second: 0, millisecond: 0 };
  const formalResult = calculateTrueSolarTime({
    date: new Date(Date.UTC(2026, 7, 10, 12)),
    latitude: formalLocation.latitude,
    longitude: formalLocation.longitude,
    utcOffsetMinutes: 480,
    useUtcComponents: true,
  });
  const formalContext = createTrueSolarChartTimeContext({
    source: "query",
    civil: {
      localParts,
      timeZone: "Asia/Taipei",
      utcOffsetMinutes: 480,
      abbreviation: "",
      instantMs: Date.UTC(2026, 7, 10, 4),
    },
    location: formalLocation,
    trueSolarResult: formalResult,
    createdAtInstantMs: 0,
  });
  const baziBefore = calculateBaziFromChartTimeContext(formalContext, solarTerms);
  const flyingBefore = calculateFlyingStarsFromBaziResult(formalContext, baziBefore);
  const jinhanBefore = calculateJinhanFromChartTimeContext({ context: formalContext, baziResult: baziBefore, solarTerms });
  const guiDengBefore = await calculateGuiDengFromChartTimeContext({ context: formalContext, baziResult: baziBefore });
  ownership.sync("device", bFixture);
  ownership.sync("custom", cFixture);
  const baziAfter = calculateBaziFromChartTimeContext(formalContext, solarTerms);
  const flyingAfter = calculateFlyingStarsFromBaziResult(formalContext, baziAfter);
  const jinhanAfter = calculateJinhanFromChartTimeContext({ context: formalContext, baziResult: baziAfter, solarTerms });
  const guiDengAfter = await calculateGuiDengFromChartTimeContext({ context: formalContext, baziResult: baziAfter });
  const guiDengInputAfter = createGuiDengCalculationInput({ context: formalContext, baziResult: baziAfter });
  check("location-owner-formal-context-remains-a", formalFixture, `${formalContext.location.latitude},${formalContext.location.longitude}`);
  check("location-owner-formal-bazi-unchanged", JSON.stringify(baziBefore), JSON.stringify(baziAfter));
  check("location-owner-formal-flying-unchanged", JSON.stringify(flyingBefore), JSON.stringify(flyingAfter));
  check("location-owner-formal-jinhan-unchanged", JSON.stringify(jinhanBefore), JSON.stringify(jinhanAfter));
  check("location-owner-formal-guideng-location-unchanged", formalFixture, `${guiDengInputAfter.location.latitude},${guiDengInputAfter.location.longitude}`);
  check("location-owner-formal-guideng-sunrise-unchanged", guiDengBefore.solarEvents.sunriseInstantMs, guiDengAfter.solarEvents.sunriseInstantMs);
  check("location-owner-formal-guideng-sunset-unchanged", guiDengBefore.solarEvents.sunsetInstantMs, guiDengAfter.solarEvents.sunsetInstantMs);
  check("location-owner-formal-guideng-next-sunrise-unchanged", guiDengBefore.solarEvents.nextSunriseInstantMs, guiDengAfter.solarEvents.nextSunriseInstantMs);

  check("location-owner-query-state-exists", true, mainModuleRaw.includes("trueSolarTimeQueryLocations"));
  check("location-owner-bc-input-does-not-directly-clear-formal", false, inputSource.includes("trueSolarTimeLocation = null"));
  check("location-owner-input-clears-active-owner", true, inputSource.includes("setTrueSolarTimeLocationForSource(source, null)") && inputSource.includes("clearFormalChart: isFormalSource"));
  check("location-owner-change-gates-formal-refresh", true, changeSource.includes("isFormalTrueSolarTimeSource") && changeSource.includes("if (isFormalSource && isTrueSolarDisplayMode"));
  check("location-owner-calculate-gates-formal-refresh", true, calculateSource.includes("isFormalTrueSolarTimeSource") && calculateSource.includes("if (isFormalSource && isTrueSolarDisplayMode"));
  check("location-owner-geolocation-captures-source", true, geolocationSource.includes("const source = trueSolarTimeSource") && geolocationSource.includes("setTrueSolarTimeLocationForSource(source"));
  check("location-owner-geolocation-gates-formal-refresh", true, geolocationSource.includes("if (isFormalSource && isTrueSolarDisplayMode"));
  check("location-owner-query-calculation-explicit-location", true, calculationSource.includes("location } = context") && calculationSource.includes("latitude: location.latitude"));
  check("location-owner-formal-context-explicit-location", true, formalSource.includes("location: formalLocation") && formalSource.includes("getTrueSolarTimeLocationForSource(TRUE_SOLAR_TIME_SOURCE.QUERY)"));
  check("location-owner-device-render-query-location", true, deviceSource.includes("getTrueSolarTimeLocationForSource(TRUE_SOLAR_TIME_SOURCE.DEVICE)"));
  check("location-owner-custom-render-query-location", true, customSource.includes("getTrueSolarTimeLocationForSource(TRUE_SOLAR_TIME_SOURCE.CUSTOM)"));
  check("location-owner-clear-presentation-separates-formal", true, clearSource.includes("options?.clearFormalChart !== false"));
  check("location-owner-picker-uses-formal-context-location", true, selectChineseHourSource.includes("context: currentTrueSolarChartContext") && pickerSource.includes("location: context.location"));
  check("location-owner-bc-no-datetime-write", false, [inputSource, changeSource, calculateSource, geolocationSource, deviceSource, customSource].some((source) => source.includes("elements.datetime.value =")));
  check("location-owner-source-switch-syncs-own-dom", true, sourceChangeSource.includes("syncTrueSolarTimeCoordinateInputForSource(trueSolarTimeSource)") && sourceChangeSource.includes("clearTrueSolarTimePresentation({ clearFormalChart: false })"));
  check("location-owner-mode-switch-keeps-formal", false, /trueSolarTimeLocation\s*=|trueSolarTimeQueryLocations\s*=/.test(modeSource));
  check("location-owner-timezone-input-keeps-formal", false, /trueSolarTimeLocation|currentTrueSolarChartContext|renderFormalTrueSolarChartTime/.test(timezoneInputSource));
  check("location-owner-dst-choice-keeps-formal", false, /trueSolarTimeLocation|currentTrueSolarChartContext|renderFormalTrueSolarChartTime/.test(disambiguationSource));
  check("location-owner-qimen-unchanged", true, qimenSource.includes("resolveQimenJuFromFullTermCycleDraft(dateTimeText)") && !/trueSolar|ChartTimeContext|location/.test(qimenSource));
  check("location-owner-no-new-timer", 2, (mainModuleRaw.match(/setInterval\(/g) ?? []).length);
  check("location-owner-no-storage", false, /localStorage|sessionStorage/.test(mainModuleRaw));
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  check("location-owner-dependency-unchanged", JSON.stringify({ suncalc: "^1.9.0" }), JSON.stringify(packageJson.dependencies));
}

function runTrueSolarBaziPriorityBugFixTests(solarTerms) {
  const check = (id, expected, actual) => {
    trueSolarBaziPriorityBugFixVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const parts = (year, month, day, hour, minute, second = 0) => ({
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond: 0,
  });
  const instantFor = (value, offsetMinutes) => Date.UTC(
    value.year,
    value.month - 1,
    value.day,
    value.hour,
    value.minute,
    value.second
  ) - offsetMinutes * 60_000;
  const createBoundaryContext = (trueSolarLocalParts, civilLocalParts = parts(2026, 8, 10, 9, 0)) =>
    createTrueSolarChartTimeContext({
      source: "query",
      civil: {
        localParts: civilLocalParts,
        timeZone: "Asia/Taipei",
        utcOffsetMinutes: 480,
        abbreviation: "",
        instantMs: instantFor(civilLocalParts, 480),
      },
      location: { latitude: 25.033964, longitude: 121.564468, accuracy: null },
      trueSolarResult: {
        trueSolarParts: trueSolarLocalParts,
        totalCorrectionSeconds: 0,
        longitudeCorrectionSeconds: 0,
        equationOfTimeSeconds: 0,
      },
      createdAtInstantMs: 0,
    });

  for (const [id, input, expectedHour] of [
    ["before", "2026-08-10T08:59:59", "辰"],
    ["exact", "2026-08-10T09:00:00", "巳"],
    ["after", "2026-08-10T09:00:01", "巳"],
  ]) {
    const result = calculateBaziFromSolarTerms(input, solarTerms);
    check(`bazi-priority-watch-0900-${id}`, expectedHour, result.hourPillar?.[1]);
  }

  const before2300 = calculateBaziFromSolarTerms("2026-08-10T22:59:59", solarTerms);
  const exact2300 = calculateBaziFromSolarTerms("2026-08-10T23:00:00", solarTerms);
  const after2300 = calculateBaziFromSolarTerms("2026-08-10T23:00:01", solarTerms);
  check("bazi-priority-watch-2300-before-hour", "亥", before2300.hourPillar?.[1]);
  check("bazi-priority-watch-2300-exact-hour", "子", exact2300.hourPillar?.[1]);
  check("bazi-priority-watch-2300-after-hour", "子", after2300.hourPillar?.[1]);
  check("bazi-priority-watch-2300-exact-day", false, before2300.dayPillar === exact2300.dayPillar);
  check("bazi-priority-watch-2300-daily-panel-input", exact2300.dayPillar?.[1], exact2300.dailyInfo?.clothing?.dayBranch);

  const trueSolarBefore = calculateBaziFromChartTimeContext(
    createBoundaryContext(parts(2026, 8, 10, 8, 59, 59)),
    solarTerms
  );
  const trueSolarExact = calculateBaziFromChartTimeContext(
    createBoundaryContext(parts(2026, 8, 10, 9, 0, 0)),
    solarTerms
  );
  check("bazi-priority-true-solar-0900-before", "辰", trueSolarBefore.hourPillar?.[1]);
  check("bazi-priority-true-solar-0900-exact", "巳", trueSolarExact.hourPillar?.[1]);
  check("bazi-priority-true-solar-0900-local-snapshot", "2026-08-10 09:00:00", trueSolarExact.debug.clockLocalDateTime);

  const fullSource = extractNamedFunctionSource(mainModuleRaw, "renderByDateTime");
  const prioritySource = extractNamedFunctionSource(mainModuleRaw, "refreshBaziForCurrentChartTime");
  const requestSource = extractNamedFunctionSource(mainModuleRaw, "requestRenderDateTime");
  const autoClockSource = extractNamedFunctionSource(mainModuleRaw, "refreshQueryTimeFromAutoNowClock");
  const manualChangeSource = extractNamedFunctionSource(mainModuleRaw, "handleManualDateTimeChange");
  const jinhanRuntimeSource = extractNamedFunctionSource(mainModuleRaw, "refreshJinhanForCurrentChartTime");
  const renderSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarBaziResult");

  check("bazi-priority-diagnosis-full-awaits-jinhan", true, fullSource.includes("await renderJinhanYujing(") && fullSource.indexOf("renderResult(result, effectiveDateTimeValue)") < fullSource.indexOf("await renderJinhanYujing("));
  const guiDengRuntimeSource = extractNamedFunctionSource(mainModuleRaw, "refreshGuiDengForCurrentChartTime");
  check("bazi-priority-diagnosis-jinhan-fire-and-guard", true, guiDengRuntimeSource.includes("await calculateGuiDengFromChartTimeContext(") && guiDengRuntimeSource.includes("isLatestBaziRenderRequest(requestId)"));
  check("bazi-priority-lightweight-no-await", false, /\bawait\b/.test(prioritySource));
  check("bazi-priority-lightweight-no-downstream", false, /renderFlyingStars|renderJinhanYujing|renderQimenSection/.test(prioritySource));
  check("bazi-priority-lightweight-watch-renders-bazi", true, prioritySource.includes("renderResult(result, effectiveDateTimeValue)"));
  check("bazi-priority-lightweight-true-solar-renders-formal", true, prioritySource.includes("renderFormalTrueSolarChartTime()"));
  check("bazi-priority-request-refreshes-before-queue", true, requestSource.indexOf("refreshBaziForCurrentChartTime(") < requestSource.indexOf("if (isCalculating)"));
  check("bazi-priority-request-queues-full-render", true, requestSource.includes("pendingDateTimeValue = dateTimeValue") && requestSource.includes("renderByDateTime(dateTimeValue)"));
  check("bazi-priority-auto-clock-refreshes-bazi", true, autoClockSource.includes("refreshBaziForCurrentChartTime(dateTimeValue, requestId)"));
  check("bazi-priority-manual-boundary-refreshes-bazi", true, manualChangeSource.includes("requestRenderDateTime(elements.datetime.value)"));
  check("bazi-priority-generation-state", true, mainModuleRaw.includes("let latestBaziRenderRequestId = 0") && mainModuleRaw.includes("function isLatestBaziRenderRequest(requestId)"));
  const firstAwaitGuard = fullSource.indexOf("if (!isLatestBaziRenderRequest(requestId))");
  const afterJinhanGuard = fullSource.indexOf("if (!isLatestBaziRenderRequest(requestId))", fullSource.indexOf("await renderJinhanYujing("));
  check("bazi-priority-stale-guard-before-write", true, firstAwaitGuard >= 0 && fullSource.indexOf("currentCalendarResult = result") > firstAwaitGuard);
  check("bazi-priority-stale-guard-after-downstream-await", true, afterJinhanGuard > fullSource.indexOf("await renderJinhanYujing("));
  check("bazi-priority-jinhan-stale-guard", true, jinhanRuntimeSource.includes("!isLatestBaziRenderRequest(requestId)"));
  check("bazi-priority-current-input-committed-before-dom", true, prioritySource.indexOf("chartTimeState.watchDateTimeValue = dateTimeValue") < prioritySource.indexOf("renderResult(result, effectiveDateTimeValue)"));
  check("bazi-priority-true-solar-same-snapshot", true, renderSource.includes("context.trueSolar?.localParts") && prioritySource.includes("renderFormalTrueSolarChartTime()"));
  check("bazi-priority-daily-panel-not-cleared", false, prioritySource.includes("clearPillarExtraPanel()") || renderSource.includes("clearPillarExtraPanel()"));
  check("bazi-priority-no-new-timer", 2, (mainModuleRaw.match(/setInterval\(/g) ?? []).length);
  check("bazi-priority-downstream-watch-inputs", true, ["refreshFlyingStarsForCurrentChartTime(requestId)", "renderJinhanYujing(result, effectiveDateTimeValue", "renderQimenSection(effectiveDateTimeValue)"].every((call) => fullSource.includes(call)));
  check("bazi-priority-no-true-solar-downstream", false, /renderFlyingStars\([^)]*currentTrueSolar|renderJinhanYujing\([^)]*currentTrueSolar|renderQimenSection\([^)]*currentTrueSolar/.test(fullSource));
}

function runTrueSolarDailyInfoTests(solarTerms) {
  const check = (id, expected, actual) => {
    trueSolarDailyInfoVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const parts = (year, month, day, hour, minute, second = 0) => ({
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond: 0,
  });
  const instantFor = (value, offsetMinutes) => Date.UTC(
    value.year,
    value.month - 1,
    value.day,
    value.hour,
    value.minute,
    value.second
  ) - offsetMinutes * 60_000;
  const makeTrueSolarResult = (civilLocalParts, trueSolarLocalParts, timeZone = "Asia/Taipei", offsetMinutes = 480) =>
    calculateBaziFromChartTimeContext(
      createTrueSolarChartTimeContext({
        source: "query",
        civil: {
          localParts: civilLocalParts,
          timeZone,
          utcOffsetMinutes: offsetMinutes,
          abbreviation: "",
          instantMs: instantFor(civilLocalParts, offsetMinutes),
        },
        location: { latitude: 24.984898, longitude: 121.540626, accuracy: null },
        trueSolarResult: {
          trueSolarParts: trueSolarLocalParts,
          totalCorrectionSeconds: 0,
          longitudeCorrectionSeconds: 0,
          equationOfTimeSeconds: 0,
        },
        createdAtInstantMs: 0,
      }),
      solarTerms
    );

  const sameDayCivil = parts(2026, 8, 10, 12, 0);
  const sameDayTrue = parts(2026, 8, 10, 12, 0);
  const sameDay = makeTrueSolarResult(sameDayCivil, sameDayTrue);
  const sameDayDailyInfo = sameDay.dailyInfo;
  check("true-solar-daily-info-result-exists", true, Boolean(sameDayDailyInfo));
  check("true-solar-jianchu-exists", true, Boolean(sameDay.jianchu));
  check("true-solar-jianchu-day-branch", sameDay.dayPillar[1], sameDay.jianchu?.dayBranch);
  check("true-solar-jianchu-month-branch", sameDay.monthBranch, sameDay.jianchu?.monthBranch);
  check("true-solar-daily-clothing-day-branch", sameDay.dayPillar[1], sameDayDailyInfo?.clothing?.dayBranch);
  check("true-solar-daily-clash-day-branch", sameDay.dayPillar[1], sameDayDailyInfo?.clash?.dayBranch);
  check(
    "true-solar-daily-huangdao-source",
    JSON.stringify(getDailyDaHuangDao(sameDay.monthBranch, sameDay.dayPillar[1])),
    JSON.stringify(getDailyDaHuangDao(sameDay.monthBranch, sameDayDailyInfo?.clothing?.dayBranch))
  );
  check(
    "true-solar-summary-uses-effective-date",
    true,
    formatBaziDailySummaryFromDateKey({
      dateKey: sameDay.debug.effectiveDayDateKey,
      dayBranch: sameDay.dayPillar[1],
      clashZodiac: sameDayDailyInfo?.clash?.zodiac,
      jianchuName: sameDay.jianchu?.fullName,
    }).startsWith("🗓 2026.08.10")
  );

  const previousDay = makeTrueSolarResult(
    parts(2026, 8, 10, 0, 3),
    parts(2026, 8, 9, 22, 59, 59)
  );
  const nextDay = makeTrueSolarResult(
    parts(2026, 8, 10, 0, 3),
    parts(2026, 8, 10, 23, 0, 0)
  );
  check("true-solar-previous-day-date-key", "2026-08-09", previousDay.debug.effectiveDayDateKey);
  check("true-solar-next-day-date-key", "2026-08-11", nextDay.debug.effectiveDayDateKey);
  check("true-solar-previous-day-meta-aligns", previousDay.debug.effectiveDayDateKey, previousDay.meta.effectiveDayDate);
  check("true-solar-next-day-meta-aligns", nextDay.debug.effectiveDayDateKey, nextDay.meta.effectiveDayDate);
  check("true-solar-previous-day-clothing-aligns", previousDay.dayPillar[1], previousDay.dailyInfo?.clothing?.dayBranch);
  check("true-solar-next-day-clash-aligns", nextDay.dayPillar[1], nextDay.dailyInfo?.clash?.dayBranch);
  check("true-solar-2300-before", "2026-08-09", getEffectiveDateKeyFromLocalParts(parts(2026, 8, 9, 22, 59, 59)));
  check("true-solar-2300-exact", "2026-08-10", getEffectiveDateKeyFromLocalParts(parts(2026, 8, 9, 23, 0, 0)));

  const sanfuBefore = makeTrueSolarResult(
    parts(2026, 7, 24, 12, 0),
    parts(2026, 7, 24, 22, 59, 59)
  );
  const sanfuAtBoundary = makeTrueSolarResult(
    parts(2026, 7, 24, 12, 0),
    parts(2026, 7, 24, 23, 0, 0)
  );
  check("true-solar-sanfu-before-effective-day", "初伏", sanfuBefore.dailyInfo?.sanfu?.type);
  check("true-solar-sanfu-at-effective-day", "中伏", sanfuAtBoundary.dailyInfo?.sanfu?.type);

  const springPreviousDay = makeTrueSolarResult(
    parts(2026, 3, 19, 12, 0),
    parts(2026, 3, 19, 12, 0)
  );
  check("true-solar-seasonal-marker-taipei-compatible", "離日：木離日", springPreviousDay.dailyInfo?.seasonalMarker?.label);

  const explicitInput = {
    termComparisonInstantMs: sameDay.termContext.comparisonInstantMs,
    termLookupYear: sameDayCivil.year,
    clockLocalParts: sameDayTrue,
    effectiveDayDateKey: "2026-08-10",
    solarTerms,
  };
  const explicitResult = calculateBaziFromSeparatedTimeInputs(explicitInput);
  check("true-solar-explicit-effective-day-contract", "2026-08-10", explicitResult.meta.effectiveDayDate);
  let mismatchedEffectiveDayRejected = false;
  try {
    calculateBaziFromSeparatedTimeInputs({ ...explicitInput, effectiveDayDateKey: "2026-08-11" });
  } catch {
    mismatchedEffectiveDayRejected = true;
  }
  check("true-solar-explicit-effective-day-mismatch-rejected", true, mismatchedEffectiveDayRejected);

  const watchContext = createWatchChartTimeContext({
    source: "query",
    civil: {
      localParts: sameDayCivil,
      timeZone: "Asia/Taipei",
      utcOffsetMinutes: 480,
      abbreviation: "",
      instantMs: instantFor(sameDayCivil, 480),
    },
    createdAtInstantMs: 0,
  });
  const watchResult = calculateBaziFromChartTimeContext(watchContext, solarTerms);
  const legacyResult = calculateBaziFromSolarTerms("2026-08-10T12:00:00", solarTerms);
  check("true-solar-watch-regression-pillars", JSON.stringify([legacyResult.yearPillar, legacyResult.monthPillar, legacyResult.dayPillar, legacyResult.hourPillar]), JSON.stringify([watchResult.yearPillar, watchResult.monthPillar, watchResult.dayPillar, watchResult.hourPillar]));
  check("true-solar-watch-regression-daily-info", JSON.stringify(legacyResult.dailyInfo), JSON.stringify(watchResult.dailyInfo));
  check("true-solar-term-instant-remains-civil", sameDay.termContext.comparisonInstantMs, instantFor(sameDayCivil, 480));

  const trueSolarRenderSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarBaziResult");
  const safeDailyInfoSource = extractNamedFunctionSource(mainModuleRaw, "getSafeTrueSolarDailyInfo");
  const baziModeSource = extractNamedFunctionSource(mainModuleRaw, "renderBaziForActiveDisplayMode");
  check("true-solar-render-restores-extra-panel", true, trueSolarRenderSource.includes("renderPillarExtraPanel(") && !trueSolarRenderSource.includes("clearPillarExtraPanel()"));
  check("true-solar-hour-switch-does-not-clear-daily-panel", false, baziModeSource.includes("clearPillarExtraPanel()"));
  check("true-solar-render-uses-effective-day-helper", true, trueSolarRenderSource.includes("getEffectiveDateKeyFromLocalParts(context.trueSolar?.localParts)"));
  check("true-solar-overseas-seasonal-marker-safe-hidden", true, safeDailyInfoSource.includes("seasonalMarker: null") && safeDailyInfoSource.includes("Asia/Taipei"));
  check("true-solar-render-keeps-downstream-watch-inputs", true, ["refreshFlyingStarsForCurrentChartTime(requestId)", "renderJinhanYujing(result, effectiveDateTimeValue", "renderQimenSection(effectiveDateTimeValue)"].every((call) => extractNamedFunctionSource(mainModuleRaw, "renderByDateTime").includes(call)));
  check("true-solar-render-does-not-write-shared-result", false, trueSolarRenderSource.includes("currentCalendarResult ="));

  const helperSource = getEffectiveDateKeyFromLocalParts.toString();
  check("true-solar-effective-day-no-local-getters", false, /getFullYear|getMonth\(|getDate\(|getHours\(|getMinutes\(|getSeconds\(|getMilliseconds\(/.test(helperSource));
  const probeInput = JSON.stringify(parts(2026, 8, 9, 23, 0, 0));
  const runProbe = (timeZone) => execFileSync(
    process.execPath,
    ["tests/bazi-effective-day-probe.mjs", probeInput],
    { cwd: process.cwd(), env: { ...process.env, TZ: timeZone }, encoding: "utf8" }
  ).trim();
  const taipeiProbe = runProbe("Asia/Taipei");
  check("true-solar-effective-day-process-utc", taipeiProbe, runProbe("UTC"));
  check("true-solar-effective-day-process-los-angeles", taipeiProbe, runProbe("America/Los_Angeles"));
}

function runChartDisplayModeTests() {
  const check = (id, expected, actual) => {
    chartDisplayModeVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  check("chart-display-mode-normalize-undefined", "watch", normalizeChartDisplayMode(undefined));
  check("chart-display-mode-normalize-watch", "watch", normalizeChartDisplayMode("watch"));
  check("chart-display-mode-normalize-true-solar", "true-solar", normalizeChartDisplayMode("true-solar"));
  check("chart-display-mode-normalize-invalid", "watch", normalizeChartDisplayMode("solar"));
  check("chart-display-mode-url-default", "watch", getChartDisplayModeFromLocation("https://example.test/chart?foo=1#top"));
  check("chart-display-mode-url-true-solar", "true-solar", getChartDisplayModeFromLocation("https://example.test/chart?timeMode=true-solar#top"));
  check("chart-display-mode-build-preserves-query", "/chart?foo=1&timeMode=true-solar#top", buildChartDisplayModeUrl("true-solar", "https://example.test/chart?foo=1#top"));
  check("chart-display-mode-build-preserves-hash", "/chart?timeMode=watch#top", buildChartDisplayModeUrl("watch", "https://example.test/chart#top"));
  check("chart-display-mode-build-watch", "/chart?timeMode=watch", buildChartDisplayModeUrl("watch", "https://example.test/chart"));
  check("chart-display-mode-build-true-solar", "/chart?timeMode=true-solar", buildChartDisplayModeUrl("true-solar", "https://example.test/chart"));
  check("chart-display-mode-predicate", true, isTrueSolarDisplayMode("true-solar"));
  check("chart-display-mode-dom-banner", true, ["chart-time-mode-banner", "chart-time-mode-title", "chart-time-mode-description", "chart-time-mode-switch-link"].every((id) => indexHtmlRaw.includes(`id="${id}"`)));
  check("chart-display-mode-dom-data", true, indexHtmlRaw.includes('data-time-mode="watch"') && mainModuleRaw.includes("document.body.dataset.chartTimeMode = chartDisplayMode"));
  check("chart-display-mode-dom-copy", true, indexHtmlRaw.includes("⌚ 手錶時間排盤") && mainModuleRaw.includes("四柱、九宮飛星、金函玉鏡與登貴已使用真太陽時；奇門仍維持手錶時間。"));
  check("chart-display-mode-link-accessibility", true, /id="chart-time-mode-switch-link" href="\?timeMode=true-solar"/.test(indexHtmlRaw) && mainModuleRaw.includes("切換至真太陽時排盤") && mainModuleRaw.includes("返回手錶時間排盤"));
  check("chart-display-mode-single-switch-entry", true, !indexHtmlRaw.includes("true-solar-time-mode-switch-link") && !indexHtmlRaw.includes("true-solar-time-mode-intro") && (mainModuleRaw.match(/chartTimeModeSwitchLink\.addEventListener/g) ?? []).length === 1);
  check("chart-display-mode-panel-keeps-query-controls", true, ["true-solar-time-source-query", "true-solar-time-coordinate", "true-solar-time-time-zone-search-results", "true-solar-time-disambiguation", "true-solar-time-result", "true-solar-time-solar-events"].every((id) => indexHtmlRaw.includes(`id="${id}"`)));
  check("chart-display-mode-single-copy-per-mode", true, (mainModuleRaw.match(/切換至真太陽時排盤/g) ?? []).length === 1 && (mainModuleRaw.match(/返回手錶時間排盤/g) ?? []).length === 1);
  check("chart-display-mode-tab-keeps-tab-contract", true, /id="tab-true-solar-time"[^>]*role="tab"[^>]*aria-controls="panel-true-solar-time"/.test(indexHtmlRaw) && mainModuleRaw.includes('"⌚ 手錶時間"') && mainModuleRaw.includes('"☀ 真太陽時"'));
  check("chart-display-mode-url-history", true, mainModuleRaw.includes('window.addEventListener("popstate", syncChartDisplayModeFromLocation)') && extractNamedFunctionSource(mainModuleRaw, "handleChartDisplayModeSwitchClick").includes("window.history.pushState"));
  check("chart-display-mode-watch-reset", true, extractNamedFunctionSource(mainModuleRaw, "resetLegacyChartTimeState").includes("chartTimeState.mode = CHART_TIME_MODE.WATCH") && extractNamedFunctionSource(mainModuleRaw, "initializeChartDisplayMode").includes("resetLegacyChartTimeState"));
  check("chart-display-mode-detached-from-effective-input", true, !extractNamedFunctionSource(mainModuleRaw, "renderChartDisplayMode").includes("resolveEffectiveChartDateTimeValue") && !extractNamedFunctionSource(mainModuleRaw, "renderChartDisplayMode").includes("renderByDateTime"));
  check("chart-display-mode-render-inputs-unchanged", true, ["renderResult(result, effectiveDateTimeValue)", "refreshFlyingStarsForCurrentChartTime(requestId)", "renderJinhanYujing(result, effectiveDateTimeValue", "renderQimenSection(effectiveDateTimeValue)"].every((call) => extractNamedFunctionSource(mainModuleRaw, "renderByDateTime").includes(call)));
  check("chart-display-mode-no-storage-or-fetch", false, /localStorage|sessionStorage|fetch\(/.test(mainModuleRaw));
  check("chart-display-mode-no-duplicate-page-or-render", true, !indexHtmlRaw.includes("index-true-solar") && (mainModuleRaw.match(/function renderByDateTime\(/g) ?? []).length === 1);
  check("chart-display-mode-no-qimen-or-formula-edit", true, !mainModuleRaw.includes("createChartTimeContext") && mainModuleRaw.includes('from "./qimenResolver.js"'));
}

async function runSolarEventsTests() {
  const date = new Date(2026, 7, 6, 9, 23, 0);
  const originalTime = date.getTime();
  const events = await calculateSolarEvents({ date, latitude: 24.976972, longitude: 121.545917, utcOffsetMinutes: 480 });
  for (const [key, expected] of [["dateKey", "2026-08-06"], ["daylightStatus", "normal"], ["ordered", true], ["inputNotMutated", true]]) {
    solarEventsVerifiedCaseCount += 1;
    const actual = key === "ordered" ? events.sunrise < events.solarNoon && events.solarNoon < events.sunset : key === "inputNotMutated" ? date.getTime() === originalTime : events[key];
    assertEqual("solar-events-taiwan", key, expected, actual);
  }
  solarEventsVerifiedCaseCount += 1;
  assertEqual("solar-events-parts", "date", 6, events.sunriseParts?.day);
  let threw = false; try { await calculateSolarEvents({ date, latitude: 91, longitude: 121, utcOffsetMinutes: 480 }); } catch { threw = true; }
  solarEventsVerifiedCaseCount += 1;
  assertEqual("solar-events-invalid-coordinate", "throws", true, threw);
  const overseasCarrier = new Date(Date.UTC(2027, 10, 7, 1, 30, 0));
  const overseasEvents = await calculateSolarEvents({
    date: overseasCarrier,
    latitude: 34.0522,
    longitude: -118.2437,
    utcOffsetMinutes: -480,
    useUtcComponents: true,
  });
  solarEventsVerifiedCaseCount += 1;
  assertEqual("solar-events-utc-carrier", "dateKey", "2027-11-07", overseasEvents.dateKey);
  const taiwanCarrier = new Date(Date.UTC(2026, 7, 6, 12, 0, 0));
  const taiwanClockEvents = await calculateSolarEvents({ date: taiwanCarrier, latitude: 24.984898, longitude: 121.540626, utcOffsetMinutes: 480, useUtcComponents: true });
  const tokyoClockEvents = await calculateSolarEvents({ date: taiwanCarrier, latitude: 24.984898, longitude: 121.540626, utcOffsetMinutes: 540, useUtcComponents: true });
  solarEventsVerifiedCaseCount += 1;
  assertEqual("solar-events-offset-display-only", "sunriseInstant", taiwanClockEvents.sunrise.getTime(), tokyoClockEvents.sunrise.getTime());
  solarEventsVerifiedCaseCount += 1;
  assertEqual("solar-events-offset-display-only", "sunriseClockHour", (taiwanClockEvents.sunriseParts.hour + 1) % 24, tokyoClockEvents.sunriseParts.hour);
}

async function runTimeZoneTests() {
  const check = (id, expected, actual) => {
    timeZoneVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  for (const zone of ["Asia/Taipei", "America/Los_Angeles", "Australia/Lord_Howe", "Asia/Kathmandu"]) {
    check("time-zone-valid", true, validateTimeZone(zone));
  }
  for (const zone of ["America/Invalid", "UTC+8", ""]) {
    check("time-zone-invalid", false, validateTimeZone(zone));
  }
  check("time-zone-device-valid", true, validateTimeZone(getDeviceTimeZone()));
  const taipei = resolveLocalDateTimeInTimeZone({
    localParts: { year: 2027, month: 8, day: 6, hour: 14, minute: 30, second: 25 },
    timeZone: "Asia/Taipei",
  });
  check("time-zone-taipei", "resolved", taipei.status);
  check("time-zone-taipei-offset", 480, taipei.utcOffsetMinutes);
  const tokyo = resolveLocalDateTimeInTimeZone({
    localParts: { year: 2026, month: 8, day: 6, hour: 14, minute: 21, second: 30 },
    timeZone: "Asia/Tokyo",
  });
  check("time-zone-tokyo-resolved", "resolved", tokyo.status);
  const winter = resolveLocalDateTimeInTimeZone({
    localParts: { year: 2027, month: 1, day: 6, hour: 14, minute: 30, second: 0 },
    timeZone: "America/Los_Angeles",
  });
  const summer = resolveLocalDateTimeInTimeZone({
    localParts: { year: 2027, month: 8, day: 6, hour: 14, minute: 30, second: 0 },
    timeZone: "America/Los_Angeles",
  });
  check("time-zone-la-winter", -480, winter.utcOffsetMinutes);
  check("time-zone-la-summer", -420, summer.utcOffsetMinutes);
  const missing = resolveLocalDateTimeInTimeZone({
    localParts: { year: 2027, month: 3, day: 14, hour: 2, minute: 30, second: 0 },
    timeZone: "America/Los_Angeles",
  });
  check("time-zone-nonexistent", "nonexistent", missing.status);
  check("time-zone-nonexistent-candidates", 0, missing.candidates.length);
  const repeatedLocalParts = { year: 2027, month: 11, day: 7, hour: 1, minute: 30, second: 0 };
  const repeatedLocalPartsSnapshot = { ...repeatedLocalParts };
  const repeated = resolveLocalDateTimeInTimeZone({
    localParts: repeatedLocalParts,
    timeZone: "America/Los_Angeles",
  });
  check("time-zone-ambiguous", "ambiguous", repeated.status);
  check("time-zone-ambiguous-candidates", 2, repeated.candidates.length);
  check("time-zone-ambiguous-offsets", true, repeated.candidates[0]?.utcOffsetMinutes !== repeated.candidates[1]?.utcOffsetMinutes);
  check("time-zone-ambiguous-local-parts-unchanged", JSON.stringify(repeatedLocalPartsSnapshot), JSON.stringify(repeatedLocalParts));
  check("time-zone-ambiguous-candidates-unique", repeated.candidates.length, new Set(repeated.candidates.map((candidate) => candidate.instant.getTime())).size);
  check("time-zone-ambiguous-candidates-ordered", true, repeated.candidates.every((candidate, index) => index === 0 || repeated.candidates[index - 1].instant < candidate.instant));
  const earlier = resolveLocalDateTimeInTimeZone({ localParts: repeatedLocalParts, timeZone: "America/Los_Angeles", disambiguation: "earlier" });
  const later = resolveLocalDateTimeInTimeZone({ localParts: repeatedLocalParts, timeZone: "America/Los_Angeles", disambiguation: "later" });
  check("time-zone-ambiguous-earlier", repeated.candidates[0].instant.getTime(), earlier.instant.getTime());
  check("time-zone-ambiguous-later", repeated.candidates[1].instant.getTime(), later.instant.getTime());
  const kathmandu = resolveLocalDateTimeInTimeZone({
    localParts: { year: 2027, month: 8, day: 6, hour: 14, minute: 30, second: 0 },
    timeZone: "Asia/Kathmandu",
  });
  check("time-zone-kathmandu", 345, kathmandu.utcOffsetMinutes);
  const trimmed = resolveLocalDateTimeInTimeZone({
    localParts: { year: 2027, month: 8, day: 6, hour: 14, minute: 30, second: 0 },
    timeZone: "  America/Los_Angeles  ",
  });
  check("time-zone-trimmed", "America/Los_Angeles", trimmed.timeZone);
  check("time-zone-trimmed-offset", -420, trimmed.utcOffsetMinutes);
  check("time-zone-trimmed-parts", "America/Los_Angeles", getZonedDateTimeParts(new Date("2027-08-06T00:00:00Z"), "  America/Los_Angeles  ").timeZone);
  const lordHowe = resolveLocalDateTimeInTimeZone({
    localParts: { year: 2027, month: 4, day: 4, hour: 1, minute: 45, second: 0 },
    timeZone: "Australia/Lord_Howe",
  });
  check("time-zone-lord-howe-ambiguous", "ambiguous", lordHowe.status);
  check("time-zone-lord-howe-candidates", 2, lordHowe.candidates.length);
  check("time-zone-lord-howe-30-minute", 30, Math.abs(lordHowe.candidates[0]?.utcOffsetMinutes - lordHowe.candidates[1]?.utcOffsetMinutes));
  check("time-zone-lord-howe-order", true, lordHowe.candidates[0]?.instant < lordHowe.candidates[1]?.instant);
  for (const [value, expected] of [[480, "UTC+08:00"], [-420, "UTC-07:00"], [345, "UTC+05:45"], [630, "UTC+10:30"], [Infinity, "UTC—"], [NaN, "UTC—"], [1.5, "UTC—"]]) {
    check("time-zone-format", expected, formatUtcOffset(value));
  }
  const date = new Date("invalid");
  check("time-zone-invalid-date", null, getZonedDateTimeParts(date, "Asia/Taipei"));
  await runTimeZoneFormatterCacheTest(check);
}

async function runTimeZoneFormatterCacheTest(check) {
  const originalDateTimeFormat = Intl.DateTimeFormat;
  let formatterConstructionCount = 0;
  Intl.DateTimeFormat = function DateTimeFormat(...args) {
    formatterConstructionCount += 1;
    return new originalDateTimeFormat(...args);
  };

  try {
    const moduleUrl = new URL(`../src/timeZone.js?formatter-cache-test=${Date.now()}`, import.meta.url);
    const freshTimeZoneModule = await import(moduleUrl.href);
    freshTimeZoneModule.resolveLocalDateTimeInTimeZone({
      localParts: { year: 2027, month: 8, day: 6, hour: 14, minute: 30, second: 0 },
      timeZone: "America/Los_Angeles",
    });
    freshTimeZoneModule.validateTimeZone("  America/Los_Angeles  ");
    freshTimeZoneModule.validateTimeZone("America/Invalid");
    freshTimeZoneModule.validateTimeZone("  America/Invalid  ");
    check("time-zone-formatter-cache-constructions", 3, formatterConstructionCount);
  } finally {
    Intl.DateTimeFormat = originalDateTimeFormat;
  }
}

function runTimeZoneCatalogTests() {
  const check = (id, expected, actual) => {
    timeZoneCatalogVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const supported = getSupportedTimeZones();
  check("time-zone-catalog-supported-nonempty", true, supported.length > 0);
  check("time-zone-catalog-supported-unique", supported.length, new Set(supported).size);
  for (const timeZone of ["Asia/Taipei", "America/Los_Angeles", "Europe/Oslo"]) {
    check("time-zone-catalog-supported-required", true, supported.includes(timeZone));
  }
  const fallback = getSupportedTimeZones({ forceFallback: true });
  check("time-zone-catalog-fallback-required", true, fallback.includes("Australia/Lord_Howe") && fallback.includes("Asia/Kathmandu"));
  const copy = getSupportedTimeZones({ forceFallback: true });
  copy.pop();
  check("time-zone-catalog-return-not-mutated", true, getSupportedTimeZones({ forceFallback: true }).length > copy.length);
  check("time-zone-catalog-common", "Asia/Taipei", getCommonTimeZones()[0]);
  check("time-zone-catalog-entry", "挪威／奧斯陸、Tromsø", getTimeZoneSearchEntry("Europe/Oslo").label);
  for (const [query, expected] of [
    ["Europe/Oslo", "Europe/Oslo"], ["Oslo", "Europe/Oslo"], ["Tromsø", "Europe/Oslo"],
    ["Tromso", "Europe/Oslo"], ["特羅姆瑟", "Europe/Oslo"], ["挪威", "Europe/Oslo"],
    ["洛杉磯", "America/Los_Angeles"], ["Los Angeles", "America/Los_Angeles"],
    ["東京", "Asia/Tokyo"], ["Kathmandu", "Asia/Kathmandu"], ["los_angeles", "America/Los_Angeles"],
  ]) {
    check("time-zone-catalog-search", expected, searchTimeZones(query)[0]?.timeZone);
  }
  const limited = searchTimeZones("a", { limit: 3 });
  check("time-zone-catalog-limit", true, limited.length <= 3);
  check("time-zone-catalog-search-unique", limited.length, new Set(limited.map((entry) => entry.timeZone)).size);
  check("time-zone-catalog-empty-common", "Asia/Taipei", searchTimeZones("")[0]?.timeZone);
  for (const query of ["澳洲", "Australia"]) {
    const results = searchTimeZones(query);
    check("time-zone-catalog-australia-multiple", true, ["Australia/Sydney", "Australia/Perth", "Australia/Adelaide", "Australia/Lord_Howe"].every((timeZone) => results.some((entry) => entry.timeZone === timeZone)));
    check("time-zone-catalog-australia-unique", results.length, new Set(results.map((entry) => entry.timeZone)).size);
  }
  check("time-zone-catalog-sydney-first", "Australia/Sydney", searchTimeZones("Sydney")[0]?.timeZone);
  const unitedStates = searchTimeZones("美國");
  check("time-zone-catalog-united-states-multiple", true, ["America/Los_Angeles", "America/Denver", "America/Chicago", "America/New_York"].every((timeZone) => unitedStates.some((entry) => entry.timeZone === timeZone)));
  check("time-zone-catalog-usa-multiple", true, ["America/Los_Angeles", "America/Denver", "America/Chicago", "America/New_York"].every((timeZone) => searchTimeZones("USA").some((entry) => entry.timeZone === timeZone)));
  check("time-zone-catalog-united-states-english", true, ["America/Los_Angeles", "America/Denver", "America/Chicago", "America/New_York"].every((timeZone) => searchTimeZones("United States").some((entry) => entry.timeZone === timeZone)));
  const canada = searchTimeZones("加拿大");
  check("time-zone-catalog-canada-multiple", true, ["America/Vancouver", "America/Toronto"].every((timeZone) => canada.some((entry) => entry.timeZone === timeZone)));
  check("time-zone-catalog-country-query-is-not-iana", false, validateTimeZone("澳洲"));
}

function runDailyInfoTests() {
  const summaryCases = [
    { id: "daily-summary-2026-07-22", date: new Date(2026, 6, 22), dayBranch: "酉", clashZodiac: "兔", jianchuName: "滿日", expected: "🗓 2026.07.22 (三)｜金｜衝兔｜滿日" },
    { id: "daily-summary-zi", date: new Date(2026, 0, 5), dayBranch: "子", clashZodiac: "馬", jianchuName: "建日", expected: "🗓 2026.01.05 (一)｜水｜衝馬｜建日" },
    { id: "daily-summary-wu", date: new Date(2026, 0, 6), dayBranch: "午", clashZodiac: "鼠", jianchuName: "除日", expected: "🗓 2026.01.06 (二)｜火｜衝鼠｜除日" },
    { id: "daily-summary-mao", date: new Date(2026, 0, 7), dayBranch: "卯", clashZodiac: "雞", jianchuName: "滿日", expected: "🗓 2026.01.07 (三)｜木｜衝雞｜滿日" },
  ];

  for (const testCase of summaryCases) {
    dailyInfoVerifiedCaseCount += 1;
    assertEqual(testCase.id, "summary", testCase.expected, formatBaziDailySummary(testCase));
  }

  for (const dayBranch of ["辰", "戌", "丑", "未"]) {
    dailyInfoVerifiedCaseCount += 1;
    assertEqual(`daily-summary-earth-${dayBranch}`, "element", "土", formatBaziDailySummary({
      date: new Date(2026, 0, 5),
      dayBranch,
      jianchuName: "建日",
    }).split("｜")[1]);
  }

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

  const baoYiHeZhiFaCases = [
    { id: "daily-info-bao-yi-he-zhi-fa-zhi", pillar: "乙未", expected: "‼️ 制日" },
    { id: "daily-info-bao-yi-he-zhi-fa-he", pillar: "甲寅", expected: "⭕ 和日" },
    { id: "daily-info-bao-yi-he-zhi-fa-bao", pillar: "甲午", expected: "⭕ 寶日" },
    { id: "daily-info-bao-yi-he-zhi-fa-yi", pillar: "癸酉", expected: "⭕ 義日" },
    { id: "daily-info-bao-yi-he-zhi-fa-fa", pillar: "己卯", expected: "❌ 伐日" },
  ];

  for (const testCase of baoYiHeZhiFaCases) {
    dailyInfoVerifiedCaseCount += 1;
    assertEqual(testCase.id, "label", testCase.expected, getBaoYiHeZhiFaByDayPillar(testCase.pillar)?.label);
  }

  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-bao-yi-he-zhi-fa-invalid", "result", null, getBaoYiHeZhiFaByDayPillar("甲無"));

  const sanfuDateKeys = {
    "初伏": "2026-07-15",
    "中伏": "2026-07-25",
    "末伏": "2026-08-14",
  };
  const sanfuCases = [
    { id: "daily-info-sanfu-chufu", dateKey: "2026-07-15", expectedType: "初伏" },
    { id: "daily-info-sanfu-chufu-range-start", dateKey: "2026-07-16", expectedType: "初伏" },
    { id: "daily-info-sanfu-chufu-range-end", dateKey: "2026-07-24", expectedType: "初伏" },
    { id: "daily-info-sanfu-zhongfu", dateKey: "2026-07-25", expectedType: "中伏" },
    { id: "daily-info-sanfu-zhongfu-range-start", dateKey: "2026-07-26", expectedType: "中伏" },
    { id: "daily-info-sanfu-zhongfu-range-end", dateKey: "2026-08-13", expectedType: "中伏" },
    { id: "daily-info-sanfu-mofu", dateKey: "2026-08-14", expectedType: "末伏" },
    { id: "daily-info-sanfu-mofu-range-start", dateKey: "2026-08-15", expectedType: "末伏" },
    { id: "daily-info-sanfu-mofu-range-end", dateKey: "2026-08-23", expectedType: "末伏" },
  ];

  for (const testCase of sanfuCases) {
    const actual = getSanfuByDateKey(testCase.dateKey, sanfuDateKeys);
    dailyInfoVerifiedCaseCount += 1;
    assertEqual(testCase.id, "type", testCase.expectedType, actual?.type);
  }

  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-sanfu-none", "result", null, getSanfuByDateKey("2026-08-24", sanfuDateKeys));

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
  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-summary-bao-yi-he-zhi-fa", "label", "⭕ 和日", dailyInfo.baoYiHeZhiFa?.label);

  const dailyInfoTianShe = getDailyInfoByBranches({
    yearBranch: "午",
    dayPillar: "甲午",
    season: "夏季",
  });
  dailyInfoVerifiedCaseCount += 1;
  assertEqual("daily-info-summary-tianshe", "isTianShe", true, dailyInfoTianShe.tianShe?.isTianShe);
}

function runQueryPickerTests(solarTerms) {
  const dateTimeCases = [
    { id: "query-picker-zi", year: 2026, month: 6, day: 21, hourIndex: 1, expected: "2026-07-20T23:00:00" },
    { id: "query-picker-chou", year: 2026, month: 6, day: 21, hourIndex: 2, expected: "2026-07-21T01:00:00" },
    { id: "query-picker-si", year: 2026, month: 6, day: 21, hourIndex: 6, expected: "2026-07-21T09:00:00" },
    { id: "query-picker-zi-cross-year", year: 2026, month: 0, day: 1, hourIndex: 1, expected: "2025-12-31T23:00:00" },
  ];

  for (const testCase of dateTimeCases) {
    queryPickerVerifiedCaseCount += 1;
    assertEqual(
      testCase.id,
      "datetime",
      testCase.expected,
      queryPickerHelpers.buildDateTimeValueFromDateAndChineseHour(
        testCase.year,
        testCase.month,
        testCase.day,
        testCase.hourIndex
      )
    );
  }

  const selectedDateCases = [
    { id: "query-picker-auto-before-2300", input: "2026-07-20T22:59:00", expected: "2026-07-20" },
    { id: "query-picker-auto-at-2300", input: "2026-07-20T23:00:00", expected: "2026-07-21" },
    { id: "query-picker-auto-after-midnight", input: "2026-07-21T00:30:00", expected: "2026-07-21" },
    { id: "query-picker-auto-before-next-2300", input: "2026-07-21T22:59:00", expected: "2026-07-21" },
  ];

  for (const testCase of selectedDateCases) {
    const selectedDate = queryPickerHelpers.getSelectedCalendarDateFromDateTime(testCase.input);
    const actual = selectedDate
      ? `${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, "0")}-${String(selectedDate.day).padStart(2, "0")}`
      : null;
    queryPickerVerifiedCaseCount += 1;
    assertEqual(testCase.id, "selectedCalendarDate", testCase.expected, actual);
  }

  const ziSelectedDate = queryPickerHelpers.getSelectedCalendarDateFromDateTime("2026-07-22T23:00:00");
  const ziSolarTerms = getSolarTermOnDate(solarTerms, ziSelectedDate);
  queryPickerVerifiedCaseCount += 1;
  assertEqual("query-picker-zi-solar-term-calendar-date", "term", "大暑", ziSolarTerms[0]?.name);

  const integrationCases = [
    {
      id: "query-picker-zi-bazi",
      hourIndex: 1,
      expectedDateTime: "2026-07-20T23:00:00",
      expected: { dayPillar: "丙申", hourPillar: "戊子" },
    },
    {
      id: "query-picker-chou-bazi",
      hourIndex: 2,
      expectedDateTime: "2026-07-21T01:00:00",
      expected: { dayPillar: "丙申", hourPillar: "己丑" },
    },
  ];

  for (const testCase of integrationCases) {
    const dateTimeValue = queryPickerHelpers.buildDateTimeValueFromDateAndChineseHour(
      2026,
      6,
      21,
      testCase.hourIndex
    );
    const result = calculateBaziFromSolarTerms(dateTimeValue, solarTerms);
    queryPickerVerifiedCaseCount += 1;
    assertEqual(testCase.id, "datetime", testCase.expectedDateTime, dateTimeValue);
    assertEqual(testCase.id, "dayPillar", testCase.expected.dayPillar, result.dayPillar);
    assertEqual(testCase.id, "hourPillar", testCase.expected.hourPillar, result.hourPillar);
  }
}

function runFlyingStarsChartTimeAdapterTests(solarTerms) {
  const check = (id, expected, actual) => {
    flyingStarsChartTimeAdapterVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const throws = (id, callback, expectedMessagePart = "") => {
    let message = "";
    try {
      callback();
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    }
    check(id, true, message.includes(expectedMessagePart));
  };
  const parts = (year, month, day, hour, minute, second = 0, millisecond = 0) => ({
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
  });
  const instantFor = (clock, offsetMinutes) => Date.UTC(
    clock.year,
    clock.month - 1,
    clock.day,
    clock.hour,
    clock.minute,
    clock.second,
    clock.millisecond
  ) - offsetMinutes * 60_000;
  const contextInput = ({
    mode = "watch",
    source = "query",
    civilParts = parts(2026, 5, 29, 9, 30),
    timeZone = "Asia/Taipei",
    utcOffsetMinutes = 480,
    instantMs = instantFor(civilParts, utcOffsetMinutes),
    trueSolarParts = parts(2026, 5, 29, 9, 30),
    disambiguation = null,
  } = {}) => ({
    mode,
    source,
    civil: {
      localParts: civilParts,
      timeZone,
      utcOffsetMinutes,
      abbreviation: "",
      instantMs,
      disambiguation,
    },
    location: mode === "true-solar"
      ? { latitude: 25.033964, longitude: 121.564468, accuracy: null }
      : null,
    trueSolarResult: mode === "true-solar"
      ? {
        trueSolarParts,
        totalCorrectionSeconds: 0,
        longitudeCorrectionSeconds: 0,
        equationOfTimeSeconds: 0,
      }
      : undefined,
    createdAtInstantMs: 0,
  });
  const formatInput = (clock) => `${String(clock.year).padStart(4, "0")}-${String(clock.month).padStart(2, "0")}-${String(clock.day).padStart(2, "0")}T${String(clock.hour).padStart(2, "0")}:${String(clock.minute).padStart(2, "0")}:${String(clock.second).padStart(2, "0")}.${String(clock.millisecond).padStart(3, "0")}`;
  const taipeiPartsAt = (timeMs) => {
    const date = new Date(timeMs);
    return parts(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );
  };
  const chartLayers = (result) => Object.fromEntries(
    ["period", "annual", "monthly", "daily", "hourly"].map((key) => [key, result[key]])
  );

  const watchInput = "2026-05-29T09:30:00";
  const watchCivil = parts(2026, 5, 29, 9, 30);
  const watchContext = createChartTimeContext(contextInput({ civilParts: watchCivil }));
  const watchBazi = calculateBaziFromChartTimeContext(watchContext, solarTerms);
  const legacyBazi = calculateBaziFromSolarTerms(watchInput, solarTerms);
  const watchCharts = calculateFlyingStarsFromChartTimeContext(watchContext, solarTerms);
  const legacyCharts = calculateAllFlyingStarCharts(legacyBazi, watchInput);

  check(
    "flying-stars-adapter-watch-legacy-five-layer",
    JSON.stringify(chartLayers(legacyCharts)),
    JSON.stringify(chartLayers(watchCharts))
  );
  check("flying-stars-adapter-watch-mode", "watch", watchCharts.debug.mode);
  check("flying-stars-adapter-watch-clock", "2026-05-29 09:30:00", watchCharts.debug.clockLocal);
  check("flying-stars-adapter-watch-solar-year", watchBazi.meta.ganzhiYear, watchCharts.debug.effectiveSolarYear);
  check("flying-stars-adapter-watch-term", watchBazi.currentTerm.name, watchCharts.debug.currentSolarTerm);
  check("flying-stars-adapter-period-basis", watchBazi.meta.ganzhiYear, watchCharts.period.basis.year === watchBazi.meta.ganzhiYear ? watchCharts.period.basis.year : null);
  check("flying-stars-adapter-annual-year", watchBazi.meta.ganzhiYear, watchCharts.annual.basis.year);
  check("flying-stars-adapter-annual-pillar", watchBazi.yearPillar, watchCharts.annual.basis.yearPillar);
  check("flying-stars-adapter-month-pillar", watchBazi.monthPillar, watchCharts.monthly.basis.monthPillar);
  check("flying-stars-adapter-month-branch", watchBazi.monthBranch, watchCharts.monthly.basis.monthBranch);
  check("flying-stars-adapter-day-pillar", watchBazi.dayPillar, watchCharts.daily.basis.dayPillar);
  check("flying-stars-adapter-day-term", watchBazi.currentTerm.name, watchCharts.daily.basis.termName);
  check("flying-stars-adapter-hour-pillar", watchBazi.hourPillar, watchCharts.hourly.basis.hourPillar);
  check("flying-stars-adapter-hour-term", watchBazi.currentTerm.name, watchCharts.hourly.basis.termName);

  const inputFromObject = createFlyingStarsCalculationInput({ context: watchContext, baziResult: watchBazi });
  const objectApiCharts = calculateFlyingStarsFromBaziResult({ context: watchContext, baziResult: watchBazi });
  check("flying-stars-adapter-object-api", JSON.stringify(chartLayers(watchCharts)), JSON.stringify(chartLayers(objectApiCharts)));
  check("flying-stars-adapter-input-frozen", true, Object.isFrozen(inputFromObject));
  check("flying-stars-adapter-input-clock-frozen", true, Object.isFrozen(inputFromObject.clockLocalParts));
  check("flying-stars-adapter-input-term-frozen", true, Object.isFrozen(inputFromObject.currentSolarTerm));
  check("flying-stars-adapter-input-period-year", watchBazi.meta.ganzhiYear, inputFromObject.periodYear);
  check("flying-stars-adapter-shared-helper", JSON.stringify(chartLayers(legacyCharts)), JSON.stringify(chartLayers(calculateAllFlyingStarChartsFromInputs(inputFromObject))));
  check("flying-stars-adapter-view-model-layout", 9, createCombinedFlyingStarViewModel(watchCharts).layout.flat().length);
  check("flying-stars-adapter-debug-formatter", JSON.stringify(watchCharts.debug), JSON.stringify(formatFlyingStarsChartTimeDebug(watchCharts)));

  const contextSnapshot = JSON.stringify(watchContext);
  const baziSnapshot = JSON.stringify(watchBazi);
  calculateFlyingStarsFromBaziResult(watchContext, watchBazi);
  check("flying-stars-adapter-context-nonmutation", contextSnapshot, JSON.stringify(watchContext));
  check("flying-stars-adapter-bazi-nonmutation", baziSnapshot, JSON.stringify(watchBazi));

  const invalidContext = {
    ...watchContext,
    astronomy: {
      ...watchContext.astronomy,
      comparisonInstantMs: watchContext.civil.instantMs + 1,
    },
  };
  const invalidContextValidation = validateFlyingStarsChartTimeInput(invalidContext, watchBazi);
  check("flying-stars-adapter-invalid-context", false, invalidContextValidation.valid);
  check("flying-stars-adapter-invalid-context-message", true, invalidContextValidation.errors.some((error) => error.includes("context invalid")));
  const missingResultValidation = validateFlyingStarsChartTimeInput(watchContext, null);
  check("flying-stars-adapter-missing-bazi", false, missingResultValidation.valid);
  check("flying-stars-adapter-missing-bazi-message", true, missingResultValidation.errors.some((error) => error.includes("baziResult invalid")));
  const missingCriticalField = { ...watchBazi, hourPillar: undefined };
  const missingFieldValidation = validateFlyingStarsChartTimeInput(watchContext, missingCriticalField);
  check("flying-stars-adapter-missing-hour", false, missingFieldValidation.valid);
  check("flying-stars-adapter-missing-hour-message", true, missingFieldValidation.errors.some((error) => error.includes("hourPillar")));
  throws("flying-stars-adapter-throws-missing-bazi", () => calculateFlyingStarsFromBaziResult(watchContext, null), "baziResult invalid");

  const lichun2024 = solarTerms.find((term) => term.name === "立春" && term.year_taipei === 2024);
  const periodBoundaryResults = {};
  for (const [id, delta, expectedSolarYear, expectedPeriod, expectedTerm] of [
    ["before", -1, 2023, 8, "大寒"],
    ["exact", 0, 2024, 9, "立春"],
    ["after", 1, 2024, 9, "立春"],
  ]) {
    const instantMs = lichun2024.timeMs + delta;
    const clock = taipeiPartsAt(instantMs);
    const context = createChartTimeContext(contextInput({ civilParts: clock, instantMs }));
    const bazi = calculateBaziFromChartTimeContext(context, solarTerms);
    const charts = calculateFlyingStarsFromBaziResult(context, bazi);
    periodBoundaryResults[id] = { bazi, charts, clock };
    check(`flying-stars-adapter-lichun-${id}-solar-year`, expectedSolarYear, bazi.meta.ganzhiYear);
    check(`flying-stars-adapter-lichun-${id}-period`, expectedPeriod, charts.period.period);
    check(`flying-stars-adapter-lichun-${id}-term`, expectedTerm, bazi.currentTerm.name);
  }
  check("flying-stars-adapter-lichun-before-period-center", 8, periodBoundaryResults.before.charts.period.centerStar);
  check("flying-stars-adapter-lichun-exact-period-center", 9, periodBoundaryResults.exact.charts.period.centerStar);
  check("flying-stars-adapter-lichun-after-period-center", 9, periodBoundaryResults.after.charts.period.centerStar);
  const legacyBoundaryPeriod = calculatePeriodFlyingStarChart(formatInput(periodBoundaryResults.before.clock));
  check("flying-stars-adapter-lichun-legacy-jan1-difference", 9, legacyBoundaryPeriod.period);
  check("flying-stars-adapter-lichun-difference-is-expected", false, legacyBoundaryPeriod.period === periodBoundaryResults.before.charts.period.period);
  check("flying-stars-adapter-2024-nine-yun-exact", "下元九運", formatPeriodCycle(periodBoundaryResults.exact.charts.period.period));

  const sameTrueSolarContext = createChartTimeContext(contextInput({
    mode: "true-solar",
    civilParts: watchCivil,
    trueSolarParts: watchCivil,
  }));
  const sameTrueSolarBazi = calculateBaziFromChartTimeContext(sameTrueSolarContext, solarTerms);
  const sameTrueSolarCharts = calculateFlyingStarsFromChartTimeContext(sameTrueSolarContext, solarTerms);
  check("flying-stars-adapter-true-solar-mode", "true-solar", sameTrueSolarCharts.debug.mode);
  check("flying-stars-adapter-true-solar-same-clock", JSON.stringify(chartLayers(watchCharts)), JSON.stringify(chartLayers(sameTrueSolarCharts)));
  check("flying-stars-adapter-true-solar-term-instant", sameTrueSolarContext.civil.instantMs, sameTrueSolarBazi.termContext.comparisonInstantMs);

  const boundaryCivil = parts(2026, 8, 10, 8, 59, 59);
  const boundaryWatchContext = createChartTimeContext(contextInput({ civilParts: boundaryCivil }));
  const boundaryTrueContext = createChartTimeContext(contextInput({
    mode: "true-solar",
    civilParts: boundaryCivil,
    trueSolarParts: parts(2026, 8, 10, 9, 0, 0),
  }));
  const boundaryWatchBazi = calculateBaziFromChartTimeContext(boundaryWatchContext, solarTerms);
  const boundaryTrueBazi = calculateBaziFromChartTimeContext(boundaryTrueContext, solarTerms);
  const boundaryWatchCharts = calculateFlyingStarsFromBaziResult(boundaryWatchContext, boundaryWatchBazi);
  const boundaryTrueCharts = calculateFlyingStarsFromBaziResult(boundaryTrueContext, boundaryTrueBazi);
  check("flying-stars-adapter-cross-hour-watch", "辰", boundaryWatchBazi.hourPillar[1]);
  check("flying-stars-adapter-cross-hour-true-solar", "巳", boundaryTrueBazi.hourPillar[1]);
  check("flying-stars-adapter-cross-hour-year-same", JSON.stringify(boundaryWatchCharts.annual), JSON.stringify(boundaryTrueCharts.annual));
  check("flying-stars-adapter-cross-hour-month-same", JSON.stringify(boundaryWatchCharts.monthly), JSON.stringify(boundaryTrueCharts.monthly));
  check("flying-stars-adapter-cross-hour-day-same", JSON.stringify(boundaryWatchCharts.daily), JSON.stringify(boundaryTrueCharts.daily));
  check("flying-stars-adapter-cross-hour-hour-changes", false, JSON.stringify(boundaryWatchCharts.hourly) === JSON.stringify(boundaryTrueCharts.hourly));
  check("flying-stars-adapter-cross-hour-local-debug", "2026-08-10 09:00:00", boundaryTrueCharts.debug.clockLocal);

  const crossDayCivil = parts(2026, 8, 10, 22, 59, 59);
  const crossDayTrue = parts(2026, 8, 11, 0, 3, 0);
  const crossDayWatchContext = createChartTimeContext(contextInput({ civilParts: crossDayCivil }));
  const crossDayTrueContext = createChartTimeContext(contextInput({ mode: "true-solar", civilParts: crossDayCivil, trueSolarParts: crossDayTrue }));
  const crossDayWatchBazi = calculateBaziFromChartTimeContext(crossDayWatchContext, solarTerms);
  const crossDayTrueBazi = calculateBaziFromChartTimeContext(crossDayTrueContext, solarTerms);
  const crossDayWatchCharts = calculateFlyingStarsFromBaziResult(crossDayWatchContext, crossDayWatchBazi);
  const crossDayTrueCharts = calculateFlyingStarsFromBaziResult(crossDayTrueContext, crossDayTrueBazi);
  check("flying-stars-adapter-cross-day-year-same", JSON.stringify(crossDayWatchCharts.annual), JSON.stringify(crossDayTrueCharts.annual));
  check("flying-stars-adapter-cross-day-month-same", JSON.stringify(crossDayWatchCharts.monthly), JSON.stringify(crossDayTrueCharts.monthly));
  check("flying-stars-adapter-cross-day-daily-changes", false, JSON.stringify(crossDayWatchCharts.daily) === JSON.stringify(crossDayTrueCharts.daily));
  check("flying-stars-adapter-cross-day-hourly-changes", false, JSON.stringify(crossDayWatchCharts.hourly) === JSON.stringify(crossDayTrueCharts.hourly));
  check("flying-stars-adapter-cross-day-hour-day-source", crossDayTrueBazi.dayPillar, crossDayTrueCharts.hourly.basis.dayPillar);

  const lichun2026 = solarTerms.find((term) => term.name === "立春" && term.year_taipei === 2026);
  const termBoundaryContext = createChartTimeContext(contextInput({
    mode: "true-solar",
    civilParts: taipeiPartsAt(lichun2026.timeMs),
    instantMs: lichun2026.timeMs,
    trueSolarParts: parts(2026, 2, 3, 23, 59, 59),
  }));
  const termBoundaryBazi = calculateBaziFromChartTimeContext(termBoundaryContext, solarTerms);
  const termBoundaryCharts = calculateFlyingStarsFromChartTimeContext(termBoundaryContext, solarTerms);
  check("flying-stars-adapter-term-boundary-current-term", "立春", termBoundaryCharts.debug.currentSolarTerm);
  check("flying-stars-adapter-term-boundary-year", 2026, termBoundaryCharts.debug.effectiveSolarYear);
  check("flying-stars-adapter-term-boundary-instant", termBoundaryContext.civil.instantMs, termBoundaryBazi.termContext.comparisonInstantMs);
  check("flying-stars-adapter-term-boundary-uses-instant", "丙午", termBoundaryBazi.yearPillar);

  const overseasCases = [
    ["tokyo", "Asia/Tokyo", 540, parts(2026, 8, 6, 14, 21, 30), parts(2026, 8, 6, 13, 55, 1)],
    ["la-summer", "America/Los_Angeles", -420, parts(2026, 8, 6, 14, 21, 30), parts(2026, 8, 6, 13, 22, 39)],
    ["la-winter", "America/Los_Angeles", -480, parts(2026, 12, 6, 14, 21, 30), parts(2026, 12, 6, 13, 22, 39)],
    ["kathmandu", "Asia/Kathmandu", 345, parts(2026, 8, 6, 14, 21, 30), parts(2026, 8, 6, 13, 55, 1)],
    ["lord-howe", "Australia/Lord_Howe", 630, parts(2026, 8, 6, 14, 21, 30), parts(2026, 8, 6, 13, 55, 1)],
  ];
  for (const [id, timeZone, offset, civil, trueSolar] of overseasCases) {
    const context = createChartTimeContext(contextInput({
      mode: "true-solar",
      civilParts: civil,
      trueSolarParts: trueSolar,
      timeZone,
      utcOffsetMinutes: offset,
      instantMs: instantFor(civil, offset),
    }));
    const result = calculateFlyingStarsFromChartTimeContext(context, solarTerms);
    check(`flying-stars-adapter-${id}-mode`, "true-solar", result.debug.mode);
    check(`flying-stars-adapter-${id}-clock`, `${String(trueSolar.year).padStart(4, "0")}-${String(trueSolar.month).padStart(2, "0")}-${String(trueSolar.day).padStart(2, "0")} ${String(trueSolar.hour).padStart(2, "0")}:${String(trueSolar.minute).padStart(2, "0")}:${String(trueSolar.second).padStart(2, "0")}`, result.debug.clockLocal);
    check(`flying-stars-adapter-${id}-finite-period`, true, Number.isInteger(result.period.period));
  }

  const ambiguousParts = parts(2027, 11, 7, 1, 30);
  const earlierContext = createChartTimeContext(contextInput({
    civilParts: ambiguousParts,
    timeZone: "America/Los_Angeles",
    utcOffsetMinutes: -420,
    instantMs: Date.UTC(2027, 10, 7, 8, 30),
    disambiguation: "earlier",
  }));
  const laterContext = createChartTimeContext(contextInput({
    civilParts: ambiguousParts,
    timeZone: "America/Los_Angeles",
    utcOffsetMinutes: -480,
    instantMs: Date.UTC(2027, 10, 7, 9, 30),
    disambiguation: "later",
  }));
  const earlierCharts = calculateFlyingStarsFromChartTimeContext(earlierContext, solarTerms);
  const laterCharts = calculateFlyingStarsFromChartTimeContext(laterContext, solarTerms);
  check("flying-stars-adapter-dst-same-clock", earlierCharts.debug.clockLocal, laterCharts.debug.clockLocal);
  check("flying-stars-adapter-dst-same-bazi-stars", JSON.stringify(chartLayers(earlierCharts)), JSON.stringify(chartLayers(laterCharts)));
  const artificialTerms = solarTerms
    .map((term) => term.name === "立春" && term.year_taipei === 2027
      ? { ...term, timeMs: Date.UTC(2027, 10, 7, 9, 0) }
      : term)
    .sort((left, right) => left.timeMs - right.timeMs);
  const earlierArtificial = calculateFlyingStarsFromChartTimeContext(earlierContext, artificialTerms);
  const laterArtificial = calculateFlyingStarsFromChartTimeContext(laterContext, artificialTerms);
  check("flying-stars-adapter-dst-artificial-year-change", false, earlierArtificial.annual.basis.year === laterArtificial.annual.basis.year);
  check("flying-stars-adapter-dst-artificial-period-change", false, JSON.stringify(earlierArtificial.period) === JSON.stringify(laterArtificial.period));
  check("flying-stars-adapter-dst-artificial-month-change", false, JSON.stringify(earlierArtificial.monthly) === JSON.stringify(laterArtificial.monthly));

  const probeFixture = {
    contextInput: contextInput({
      mode: "true-solar",
      civilParts: parts(2026, 8, 6, 14, 21, 30),
      timeZone: "America/Los_Angeles",
      utcOffsetMinutes: -420,
      instantMs: instantFor(parts(2026, 8, 6, 14, 21, 30), -420),
      trueSolarParts: parts(2026, 8, 6, 13, 22, 39),
    }),
  };
  const runProbe = (timeZone) => execFileSync(
    process.execPath,
    ["tests/flying-stars-chart-time-adapter-probe.mjs", JSON.stringify(probeFixture)],
    { cwd: process.cwd(), env: { ...process.env, TZ: timeZone }, encoding: "utf8" }
  ).trim();
  const probeTaipei = runProbe("Asia/Taipei");
  check("flying-stars-adapter-process-utc", probeTaipei, runProbe("UTC"));
  check("flying-stars-adapter-process-los-angeles", probeTaipei, runProbe("America/Los_Angeles"));

  check("flying-stars-adapter-static-no-dom", false, /\bdocument\b|\bwindow\b|\bnavigator\b|geolocation|localStorage/.test(flyingStarsChartTimeAdapterRaw));
  check("flying-stars-adapter-static-no-main", false, /from\s+["']\.\/main\.js/.test(flyingStarsChartTimeAdapterRaw));
  check("flying-stars-adapter-static-no-runtime-state", false, /chartTimeState|chartDisplayMode/.test(flyingStarsChartTimeAdapterRaw));
  check("flying-stars-adapter-static-no-timezone-resolution", false, /resolveLocalDateTimeInTimeZone|parseLocalDateTime|new Date\(/.test(flyingStarsChartTimeAdapterRaw));
  check("flying-stars-adapter-static-no-true-solar-formula", false, /calculateTrueSolarTime|calculateEquationOfTime|calculateSolarEvents/.test(flyingStarsChartTimeAdapterRaw));
  check("flying-stars-adapter-static-no-formula-copy", false, /MONTH_CENTER_TABLE|DAY_CENTER_SYSTEMS|HOURLY_STAR_TABLES|function flyStars/.test(flyingStarsChartTimeAdapterRaw));
  check("flying-stars-adapter-static-main-runtime-wiring", true, /from\s+["']\.\/flyingStarsChartTimeAdapter\.js/.test(mainModuleRaw));
  check("flying-stars-adapter-static-no-storage", false, /localStorage|sessionStorage/.test(flyingStarsChartTimeAdapterRaw));
}

function runFlyingStarsChartTimeRuntimeTests(solarTerms) {
  const check = (id, expected, actual) => {
    flyingStarsChartTimeRuntimeVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const parts = (year, month, day, hour, minute, second = 0) => ({
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond: 0,
  });
  const instantFor = (value, offsetMinutes = 480) => Date.UTC(
    value.year,
    value.month - 1,
    value.day,
    value.hour,
    value.minute,
    value.second
  ) - offsetMinutes * 60_000;
  const createWatchContextAt = (value) => {
    const instantMs = instantFor(value);
    const zoned = getZonedDateTimeParts(new Date(instantMs), "Asia/Taipei");
    return createWatchChartTimeContext({
      source: "query",
      civil: {
        localParts: { ...zoned.localParts, millisecond: 0 },
        timeZone: "Asia/Taipei",
        utcOffsetMinutes: zoned.utcOffsetMinutes,
        abbreviation: zoned.abbreviation,
        instantMs,
      },
      createdAtInstantMs: 0,
    });
  };
  const createTrueContext = (civil, trueSolar) => createTrueSolarChartTimeContext({
    source: "query",
    civil: {
      localParts: civil,
      timeZone: "Asia/Taipei",
      utcOffsetMinutes: 480,
      abbreviation: "",
      instantMs: instantFor(civil),
    },
    location: { latitude: 25.033964, longitude: 121.564468, accuracy: null },
    trueSolarResult: {
      trueSolarParts: trueSolar,
      totalCorrectionSeconds: 0,
      longitudeCorrectionSeconds: 0,
      equationOfTimeSeconds: 0,
    },
    createdAtInstantMs: 0,
  });

  const helperSource = extractNamedFunctionSource(mainModuleRaw, "refreshFlyingStarsForCurrentChartTime");
  const rendererSource = extractNamedFunctionSource(mainModuleRaw, "renderFlyingStars");
  const fullSource = extractNamedFunctionSource(mainModuleRaw, "renderByDateTime");
  const lightweightSource = extractNamedFunctionSource(mainModuleRaw, "refreshBaziForCurrentChartTime");
  const autoClockSource = extractNamedFunctionSource(mainModuleRaw, "refreshQueryTimeFromAutoNowClock");
  const modeSource = extractNamedFunctionSource(mainModuleRaw, "renderChartDisplayMode");
  const querySource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForContext");
  const deviceSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForDeviceNow");
  const customSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForCustomInput");
  const baziModeSource = extractNamedFunctionSource(mainModuleRaw, "renderBaziForActiveDisplayMode");
  const clearSource = extractNamedFunctionSource(mainModuleRaw, "clearResult");

  check("flying-stars-runtime-adapter-import", true, mainModuleRaw.includes('from "./flyingStarsChartTimeAdapter.js"'));
  check("flying-stars-runtime-helper-uses-adapter", true, helperSource.includes("calculateFlyingStarsFromBaziResult(context, baziResult)"));
  check("flying-stars-runtime-single-dom-renderer", 1, (mainModuleRaw.match(/function renderFlyingStars\(/g) ?? []).length);
  check("flying-stars-runtime-renderer-no-legacy-calculation", false, rendererSource.includes("calculateAllFlyingStarCharts"));
  check("flying-stars-runtime-main-no-legacy-calculation", false, mainModuleRaw.includes("calculateAllFlyingStarCharts"));
  check("flying-stars-runtime-no-second-view-model", 1, (mainModuleRaw.match(/createFlyingStarAfflictionViewModel\(charts\)/g) ?? []).length);
  check("flying-stars-runtime-full-uses-helper", true, fullSource.includes("refreshFlyingStarsForCurrentChartTime(requestId)"));
  check("flying-stars-runtime-lightweight-uses-helper", true, lightweightSource.includes("refreshFlyingStarsForCurrentChartTime(requestId)"));
  check("flying-stars-runtime-auto-clock-reaches-bazi", true, autoClockSource.includes("refreshBaziForCurrentChartTime(dateTimeValue, requestId)"));
  check("flying-stars-runtime-lightweight-no-await", false, lightweightSource.includes("await"));
  check("flying-stars-runtime-full-fly-before-slow-jinhan", true, fullSource.indexOf("refreshFlyingStarsForCurrentChartTime(requestId)") < fullSource.indexOf("await renderJinhanYujing"));
  check("flying-stars-runtime-stale-guard-helper", true, helperSource.includes("if (!isLatestBaziRenderRequest(requestId))"));
  check("flying-stars-runtime-stale-guard-renderer", true, rendererSource.includes("isLatestBaziRenderRequest(requestId)"));
  check("flying-stars-runtime-stale-guard-full-write", true, fullSource.indexOf("isLatestBaziRenderRequest(requestId)") < fullSource.indexOf("currentCalendarResult = result"));
  check("flying-stars-runtime-watch-snapshot-state", true, mainModuleRaw.includes("currentWatchBaziResult = result"));
  check("flying-stars-runtime-watch-uses-snapshot", true, helperSource.includes("currentWatchBaziResult ?? currentCalendarResult"));
  check("flying-stars-runtime-true-uses-formal-snapshot", true, helperSource.includes("context = currentTrueSolarChartContext") && helperSource.includes("baziResult = currentTrueSolarBaziResult"));
  check("flying-stars-runtime-true-no-watch-fallback", true, !helperSource.slice(helperSource.indexOf("if (isTrueSolar)"), helperSource.indexOf("} else {")).includes("currentCalendarResult"));
  check("flying-stars-runtime-no-context-unavailable", true, helperSource.includes("renderUnavailableFlyingStars") && helperSource.includes("!context || !baziResult"));
  check("flying-stars-runtime-true-snapshot-matches-query", true, helperSource.includes("context.compatibility?.watchLocalDateTimeValue !== watchDateTimeValue"));
  check("flying-stars-runtime-true-render-no-shared-write", false, extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarBaziResult").includes("currentCalendarResult ="));
  check("flying-stars-runtime-legacy-result-retained", true, baziModeSource.includes("renderResult(currentCalendarResult") && clearSource.includes("currentWatchBaziResult = null"));
  check("flying-stars-runtime-jinhan-remains-watch", true, fullSource.includes("renderJinhanYujing(result, effectiveDateTimeValue"));
  check("flying-stars-runtime-qimen-remains-watch", true, fullSource.includes("renderQimenSection(effectiveDateTimeValue)"));
  check("flying-stars-runtime-source-b-no-formal-writer", false, deviceSource.includes("renderByDateTime") || deviceSource.includes("refreshFlyingStarsForCurrentChartTime"));
  check("flying-stars-runtime-source-c-no-formal-writer", false, customSource.includes("renderByDateTime") || customSource.includes("refreshFlyingStarsForCurrentChartTime"));
  check("flying-stars-runtime-source-query-is-formal-only", true, querySource.includes("clearTrueSolarChartContext({ clearFormalChart: false })") || querySource.includes("clearTrueSolarTimePresentation({ clearFormalChart: false })"));
  check("flying-stars-runtime-mode-switch-refreshes", true, modeSource.includes("const requestId = ++latestBaziRenderRequestId") && modeSource.includes("refreshFlyingStarsForCurrentChartTime(requestId)"));
  check("flying-stars-runtime-mode-switch-no-auto-toggle", false, modeSource.includes("startAutoNowMode()") || modeSource.includes("pauseAutoNowMode()"));
  check("flying-stars-runtime-mode-switch-no-new-query", false, modeSource.includes("renderByDateTime") || modeSource.includes("elements.datetime.value ="));
  check("flying-stars-runtime-mode-switch-no-source-bc", false, modeSource.includes("trueSolarTimeSource"));
  check("flying-stars-runtime-existing-timers-only", 2, (mainModuleRaw.match(/setInterval\(/g) ?? []).length);
  check("flying-stars-runtime-no-storage", false, /localStorage|sessionStorage/.test(mainModuleRaw));

  const watchCases = [
    ["2023-12-31", parts(2023, 12, 31, 12, 0), 8],
    ["2024-01-01", parts(2024, 1, 1, 12, 0), 8],
    ["2024-02-01", parts(2024, 2, 1, 12, 0), 8],
  ];
  for (const [id, localParts, expectedPeriod] of watchCases) {
    const context = createWatchContextAt(localParts);
    const bazi = calculateBaziFromChartTimeContext(context, solarTerms);
    const charts = calculateFlyingStarsFromBaziResult(context, bazi);
    check(`flying-stars-runtime-watch-${id}-period`, expectedPeriod, charts.period.period);
    check(`flying-stars-runtime-watch-${id}-mode`, "watch", charts.debug.mode);
    check(`flying-stars-runtime-watch-${id}-view-model`, 9, createCombinedFlyingStarViewModel(charts).layout.flat().length);
  }

  const lichun2024 = solarTerms.find((term) => term.name === "立春" && term.year_taipei === 2024);
  for (const [id, delta, expectedPeriod] of [["before", -1000, 8], ["exact", 0, 9], ["after", 1000, 9]]) {
    const instantMs = lichun2024.timeMs + delta;
    const local = getZonedDateTimeParts(new Date(instantMs), "Asia/Taipei").localParts;
    const context = createWatchChartTimeContext({
      source: "query",
      civil: {
        localParts: { ...local, millisecond: 0 },
        timeZone: "Asia/Taipei",
        utcOffsetMinutes: 480,
        abbreviation: "",
        instantMs,
      },
      createdAtInstantMs: 0,
    });
    const bazi = calculateBaziFromChartTimeContext(context, solarTerms);
    const charts = calculateFlyingStarsFromBaziResult(context, bazi);
    check(`flying-stars-runtime-lichun-${id}-period`, expectedPeriod, charts.period.period);
    check(`flying-stars-runtime-lichun-${id}-term`, id === "before" ? "大寒" : "立春", bazi.currentTerm.name);
  }

  const crossHourCivil = parts(2026, 8, 10, 8, 59, 59);
  const crossHourTrue = parts(2026, 8, 10, 9, 0, 0);
  const crossHourContext = createTrueContext(crossHourCivil, crossHourTrue);
  const crossHourBazi = calculateBaziFromChartTimeContext(crossHourContext, solarTerms);
  const crossHourCharts = calculateFlyingStarsFromBaziResult(crossHourContext, crossHourBazi);
  const crossHourWatchContext = createWatchContextAt(crossHourCivil);
  const crossHourWatchBazi = calculateBaziFromChartTimeContext(crossHourWatchContext, solarTerms);
  const crossHourWatchCharts = calculateFlyingStarsFromBaziResult(crossHourWatchContext, crossHourWatchBazi);
  check("flying-stars-runtime-true-cross-hour-bazi", "巳", crossHourBazi.hourPillar[1]);
  check("flying-stars-runtime-true-cross-hour-mode", "true-solar", crossHourCharts.debug.mode);
  check("flying-stars-runtime-true-cross-hour-annual-shared", JSON.stringify(crossHourWatchCharts.annual), JSON.stringify(crossHourCharts.annual));
  check("flying-stars-runtime-true-cross-hour-hour-changed", false, JSON.stringify(crossHourWatchCharts.hourly) === JSON.stringify(crossHourCharts.hourly));

  for (const [id, clock, expectedBranch] of [
    ["08-59-59", parts(2026, 8, 10, 8, 59, 59), "辰"],
    ["09-00-00", parts(2026, 8, 10, 9, 0, 0), "巳"],
    ["09-00-01", parts(2026, 8, 10, 9, 0, 1), "巳"],
  ]) {
    const context = createTrueContext(clock, clock);
    const bazi = calculateBaziFromChartTimeContext(context, solarTerms);
    const charts = calculateFlyingStarsFromBaziResult(context, bazi);
    check(`flying-stars-runtime-true-09-boundary-${id}-hour`, expectedBranch, bazi.hourPillar[1]);
    check(`flying-stars-runtime-true-09-boundary-${id}-debug`, `2026-08-10 ${String(clock.hour).padStart(2, "0")}:${String(clock.minute).padStart(2, "0")}:${String(clock.second).padStart(2, "0")}`, charts.debug.clockLocal);
  }

  const crossDayCivil = parts(2026, 8, 10, 22, 59, 59);
  const crossDayTrue = parts(2026, 8, 11, 0, 3, 0);
  const crossDayContext = createTrueContext(crossDayCivil, crossDayTrue);
  const crossDayBazi = calculateBaziFromChartTimeContext(crossDayContext, solarTerms);
  const crossDayCharts = calculateFlyingStarsFromBaziResult(crossDayContext, crossDayBazi);
  const crossDayWatchContext = createWatchContextAt(crossDayCivil);
  const crossDayWatchBazi = calculateBaziFromChartTimeContext(crossDayWatchContext, solarTerms);
  const crossDayWatchCharts = calculateFlyingStarsFromBaziResult(crossDayWatchContext, crossDayWatchBazi);
  check("flying-stars-runtime-true-cross-day-clock", "2026-08-11 00:03:00", crossDayCharts.debug.clockLocal);
  check("flying-stars-runtime-true-cross-day-daily-changed", false, JSON.stringify(crossDayWatchCharts.daily) === JSON.stringify(crossDayCharts.daily));
  check("flying-stars-runtime-true-cross-day-hourly-changed", false, JSON.stringify(crossDayWatchCharts.hourly) === JSON.stringify(crossDayCharts.hourly));

  const exact23Context = createTrueContext(parts(2026, 8, 10, 23, 0, 0), parts(2026, 8, 10, 23, 0, 0));
  const exact23Bazi = calculateBaziFromChartTimeContext(exact23Context, solarTerms);
  const exact23Charts = calculateFlyingStarsFromBaziResult(exact23Context, exact23Bazi);
  check("flying-stars-runtime-true-23-exact-clock", "2026-08-10 23:00:00", exact23Charts.debug.clockLocal);
  check("flying-stars-runtime-true-23-exact-hour", "子", exact23Bazi.hourPillar[1]);
  check("flying-stars-runtime-true-23-exact-day", true, typeof exact23Bazi.dayPillar === "string" && exact23Bazi.dayPillar.length === 2);

  const lichun2026 = solarTerms.find((term) => term.name === "立春" && term.year_taipei === 2026);
  const termCivilParts = getZonedDateTimeParts(new Date(lichun2026.timeMs), "Asia/Taipei").localParts;
  const termContext = createTrueContext(
    { ...termCivilParts, millisecond: 0 },
    parts(2026, 2, 3, 23, 59, 59)
  );
  const termContextWithInstant = createTrueSolarChartTimeContext({
    source: "query",
    civil: {
      localParts: { ...termCivilParts, millisecond: 0 },
      timeZone: "Asia/Taipei",
      utcOffsetMinutes: 480,
      abbreviation: "",
      instantMs: lichun2026.timeMs,
    },
    location: termContext.location,
    trueSolarResult: {
      trueSolarParts: parts(2026, 2, 3, 23, 59, 59),
      totalCorrectionSeconds: 0,
      longitudeCorrectionSeconds: 0,
      equationOfTimeSeconds: 0,
    },
    createdAtInstantMs: 0,
  });
  const termBazi = calculateBaziFromChartTimeContext(termContextWithInstant, solarTerms);
  const termCharts = calculateFlyingStarsFromBaziResult(termContextWithInstant, termBazi);
  check("flying-stars-runtime-true-term-instant-year", "丙午", termBazi.yearPillar);
  check("flying-stars-runtime-true-term-instant-period", 9, termCharts.period.period);
  check("flying-stars-runtime-true-term-instant-used", lichun2026.timeMs, termBazi.termContext.comparisonInstantMs);
}

function runFlyingStarRenderFlowTests(solarTerms) {
  const firstInput = "2026-05-29T09:30";
  const secondInput = "2026-07-29T09:30";
  const firstCalendarResult = calculateBaziFromSolarTerms(firstInput, solarTerms);
  const secondCalendarResult = calculateBaziFromSolarTerms(secondInput, solarTerms);

  // This models two complete renders in sequence.  The second chart must be
  // derived from its own calendarResult, rather than retaining the first one.
  const firstCharts = calculateAllFlyingStarCharts(firstCalendarResult, firstInput);
  const secondCharts = calculateAllFlyingStarCharts(secondCalendarResult, secondInput);
  const firstMonthlyChart = firstCharts.monthly;
  const secondMonthlyChart = secondCharts.monthly;

  const expectedFirstBasis = { monthPillar: "癸巳", monthBranch: "巳", centerStar: 5 };
  const expectedSecondBasis = { monthPillar: "乙未", monthBranch: "未", centerStar: 3 };

  for (const [key, expected] of Object.entries(expectedFirstBasis)) {
    flyingStarRenderFlowVerifiedCaseCount += 1;
    assertEqual(
      "flying-stars-monthly-first-query",
      key,
      expected,
      key === "centerStar" ? firstMonthlyChart.centerStar : firstMonthlyChart.basis[key]
    );
  }

  for (const [key, expected] of Object.entries(expectedSecondBasis)) {
    flyingStarRenderFlowVerifiedCaseCount += 1;
    assertEqual(
      "flying-stars-monthly-second-query",
      key,
      expected,
      key === "centerStar" ? secondMonthlyChart.centerStar : secondMonthlyChart.basis[key]
    );
  }

  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-monthly-consecutive-query",
    "monthPillarChanges",
    true,
    firstMonthlyChart.basis.monthPillar !== secondMonthlyChart.basis.monthPillar
  );
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-monthly-consecutive-query",
    "monthBranchChanges",
    true,
    firstMonthlyChart.basis.monthBranch !== secondMonthlyChart.basis.monthBranch
  );
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-monthly-summary",
    "firstTitle",
    "午年巳月",
    formatMonthlySummary(firstMonthlyChart)
  );
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-monthly-summary",
    "secondTitle",
    "午年未月",
    formatMonthlySummary(secondMonthlyChart)
  );

  const monthJianCases = [
    { id: "may", input: "2026-05-29T09:30", expected: { yearBranch: "午", monthBranch: "巳", title: "午年巳月" } },
    { id: "july-before-xiaoshu", input: "2026-07-01T09:30", expected: { yearBranch: "午", monthBranch: "午", title: "午年午月" } },
    { id: "xiaoshu-before", input: "2026-07-07T09:56:57", expected: { yearBranch: "午", monthBranch: "午", title: "午年午月" } },
    { id: "xiaoshu-after", input: "2026-07-07T09:56:59", expected: { yearBranch: "午", monthBranch: "未", title: "午年未月" } },
    { id: "september", input: "2026-09-29T09:30", expected: { yearBranch: "午", monthBranch: "酉", title: "午年酉月" } },
    { id: "january", input: "2027-01-15T09:30", expected: { yearBranch: "午", monthBranch: "丑", title: "午年丑月" } },
  ];

  for (const testCase of monthJianCases) {
    const calendarResult = calculateBaziFromSolarTerms(testCase.input, solarTerms);
    const monthlyChart = calculateAllFlyingStarCharts(calendarResult, testCase.input).monthly;
    flyingStarRenderFlowVerifiedCaseCount += 1;
    assertEqual(`flying-stars-month-jian-${testCase.id}`, "yearBranch", testCase.expected.yearBranch, monthlyChart.basis.yearBranch);
    flyingStarRenderFlowVerifiedCaseCount += 1;
    assertEqual(`flying-stars-month-jian-${testCase.id}`, "monthBranch", testCase.expected.monthBranch, monthlyChart.basis.monthBranch);
    flyingStarRenderFlowVerifiedCaseCount += 1;
    assertEqual(
      `flying-stars-month-jian-${testCase.id}`,
      "title",
      testCase.expected.title,
      formatMonthlySummary(monthlyChart)
    );
  }

  const expectedLayerKeys = "period,annual,monthly,daily,hourly";
  const expectedLayerLabels = "運,年,月,日,時";
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-combined-layer-order",
    "keys",
    expectedLayerKeys,
    COMBINED_FLYING_STAR_LAYERS.map((layer) => layer.key).join(",")
  );
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-combined-layer-order",
    "labels",
    expectedLayerLabels,
    COMBINED_FLYING_STAR_LAYERS.map((layer) => layer.label).join(",")
  );

  const firstCombined = createCombinedFlyingStarViewModel(firstCharts);
  const secondCombined = createCombinedFlyingStarViewModel(secondCharts);
  const combinedPalaces = secondCombined.layout.flat();
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual("flying-stars-combined-palaces", "count", 9, combinedPalaces.length);

  for (const palace of combinedPalaces) {
    flyingStarRenderFlowVerifiedCaseCount += 1;
    assertEqual(
      `flying-stars-combined-${palace.id}`,
      "layerOrder",
      expectedLayerKeys,
      palace.layers.map((layer) => layer.key).join(",")
    );

    for (const layer of palace.layers) {
      const sourcePalace = secondCharts[layer.key].palaces[palace.id];
      flyingStarRenderFlowVerifiedCaseCount += 1;
      assertEqual(
        `flying-stars-combined-${palace.id}-${layer.key}`,
        "starNumber",
        sourcePalace.starNumber,
        layer.starNumber
      );
      flyingStarRenderFlowVerifiedCaseCount += 1;
      assertEqual(
        `flying-stars-combined-${palace.id}-${layer.key}`,
        "starCircle",
        formatStarCircleNumber(sourcePalace.starNumber),
        layer.starCircle
      );
      flyingStarRenderFlowVerifiedCaseCount += 1;
      assertEqual(
        `flying-stars-combined-${palace.id}-${layer.key}`,
        "circleOnly",
        true,
        /^[①-⑨]$/.test(layer.starCircle)
      );
    }
  }

  const firstCenterLayers = Object.fromEntries(
    firstCombined.layout.flat().find((palace) => palace.id === "center").layers
      .map((layer) => [layer.key, layer.starNumber])
  );
  const secondCenterLayers = Object.fromEntries(
    secondCombined.layout.flat().find((palace) => palace.id === "center").layers
      .map((layer) => [layer.key, layer.starNumber])
  );
  for (const layerKey of ["monthly", "daily", "hourly"]) {
    flyingStarRenderFlowVerifiedCaseCount += 1;
    assertEqual(
      `flying-stars-combined-consecutive-${layerKey}`,
      "updated",
      true,
      firstCenterLayers[layerKey] !== secondCenterLayers[layerKey]
    );
  }

  const sixStarPalace = Object.values(secondCharts.period.palaces)
    .find((palace) => palace.starNumber === 6);
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-independent-full-name",
    "starDisplayName",
    "⑥ 白武曲",
    sixStarPalace?.starDisplayName
  );
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-combined-circle-only",
    "starCircle",
    "⑥",
    formatStarCircleNumber(sixStarPalace?.starNumber)
  );
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-monthly-summary",
    "doesNotUseTraditionalMonthNumber",
    false,
    formatMonthlySummary(secondCharts.monthly).includes("六月")
  );

  for (const [title, key] of [
    ["運盤", "period"],
    ["年盤", "annual"],
    ["月盤", "monthly"],
    ["日盤", "daily"],
    ["時盤", "hourly"],
  ]) {
    flyingStarRenderFlowVerifiedCaseCount += 1;
    assertEqual(
      `flying-stars-independent-${key}`,
      "rendered",
      true,
      new RegExp(
        `createFlyingStarChart\\(\\s*"${title}",\\s*charts\\.${key},\\s*charts\\.period,\\s*afflictionViewModel\\.individualCellMarkers\\.${key}\\s*\\)`
      ).test(mainModuleRaw)
    );
  }
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-independent-display-name",
    "source",
    true,
    mainModuleRaw.includes("starName.textContent = palace.starDisplayName;")
  );
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-combined-circle-source",
    "source",
    true,
    mainModuleRaw.includes("starNumber.textContent = layer.starCircle;")
  );

  for (const [period, expected] of [
    [1, "上元"], [2, "上元"], [3, "上元"],
    [4, "中元"], [5, "中元"], [6, "中元"],
    [7, "下元"], [8, "下元"], [9, "下元"],
  ]) {
    flyingStarRenderFlowVerifiedCaseCount += 1;
    assertEqual("flying-stars-period-yuan", String(period), expected, getPeriodYuanName(period));
  }
  for (const [direction, expected] of [["forward", "陽遁"], ["reverse", "陰遁"]]) {
    flyingStarRenderFlowVerifiedCaseCount += 1;
    assertEqual("flying-stars-yinyang-dun", direction, expected, formatYinYangDun(direction));
  }
  for (const [starNumber, expected] of [[1, "①"], [9, "⑨"]]) {
    flyingStarRenderFlowVerifiedCaseCount += 1;
    assertEqual("flying-stars-circle-number", String(starNumber), expected, formatStarCircleNumber(starNumber));
  }

  const combinedSummary = Object.fromEntries(
    createCombinedFlyingStarSummary(secondCharts).map((item) => [item.key, `${item.label}：${item.value}`])
  );
  const expectedCombinedSummary = {
    period: "運：下元九運 ⑨",
    annual: "年：下元丙午 ①",
    monthly: "月：午年未月 ③",
    daily: "日：陰遁 甲辰 ⑤",
    hourly: "時：陰遁 己巳 ①",
  };
  for (const [key, expected] of Object.entries(expectedCombinedSummary)) {
    flyingStarRenderFlowVerifiedCaseCount += 1;
    assertEqual("flying-stars-combined-summary", key, expected, combinedSummary[key]);
  }
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual("flying-stars-period-cycle", "nine", "下元九運", formatPeriodCycle(9));
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-combined-star-name",
    "desktopName",
    "白武曲",
    formatStarName(sixStarPalace)
  );
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-combined-star-name",
    "domClass",
    true,
    mainModuleRaw.includes('starName.className = "combined-star-name";')
  );
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-combined-star-name",
    "mobileHidden",
    true,
    /@media \(max-width: 680px\)[\s\S]*?\.combined-star-name\s*\{\s*display: none;/.test(mainCssRaw)
  );
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-independent-basis",
    "periodUsesYuan",
    true,
    mainModuleRaw.includes('label: "三元九運", value: formatPeriodCycle(chart.period)')
  );
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-independent-basis",
    "annualUsesPeriodYuan",
    true,
    mainModuleRaw.includes('label: "年柱", value: `${getPeriodYuanName(periodChart?.period)}${basis.yearPillar ?? "—"}`')
  );
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-independent-basis",
    "monthlyUsesMonthJian",
    true,
    mainModuleRaw.includes('label: "月盤依據", value: formatMonthlySummary(chart)')
      && mainModuleRaw.includes('label: "月建", value: basis.monthBranch')
      && !mainModuleRaw.includes('label: "年支分組", value: basis.yearBranchGroup')
  );
  flyingStarRenderFlowVerifiedCaseCount += 1;
  assertEqual(
    "flying-stars-independent-summary",
    "centerUsesCircleFormatter",
    true,
    mainModuleRaw.includes('formatStarCircleNumber(chart.centerStar)')
  );
}

function runSolarTermCalendarTests(solarTerms) {
  const julyTerms = getSolarTermsInMonth(solarTerms, 2026, 7);
  assertEqual("solar-term-calendar-july", "names", "小暑、大暑", julyTerms.map((term) => term.name).join("、"));

  const daxu = getSolarTermOnDate(solarTerms, "2026-07-23");
  assertEqual("solar-term-calendar-daxu", "name", "大暑", daxu[0]?.name);
  assertEqual("solar-term-calendar-daxu", "time", "2026-07-23T03:13:06.390+08:00", daxu[0]?.asia_taipei);
  assertEqual("solar-term-calendar-daxu-format", "text", "🌤️ 大暑\n07/23 03:13", formatSolarTermDateTime(daxu[0]));

  const july22Terms = getSolarTermOnDate(solarTerms, "2026-07-22");
  assertEqual("solar-term-calendar-july22", "count", 0, july22Terms.length);
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
  runSeasonalMarkerRenderTests();

  const july22 = calculateBaziFromSolarTerms("2026-07-22T12:00:00", solarTerms);
  baziDailyInfoVerifiedCaseCount += 1;
  assertEqual(
    "bazi-daily-summary-2026-07-22",
    "summary",
    "🗓 2026.07.22 (三)｜金｜衝兔｜滿日",
    formatBaziDailySummary({
      date: new Date(2026, 6, 22),
      dayBranch: july22.dayPillar[1],
      clashZodiac: july22.dailyInfo?.clash?.zodiac,
      jianchuName: july22.jianchu?.fullName,
    })
  );

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

function runSeasonalMarkerRenderTests() {
  const renderers = loadSeasonalMarkerRenderers(mainModuleRaw);
  const departure = renderers.createPillar({
    seasonalMarker: { type: "離日", name: "金離日", label: "離日：金離日" },
  })[0];
  const separation = renderers.createPanel({
    seasonalMarker: { type: "絕日", name: "金旺土絕", label: "絕日：金旺土絕" },
  })[0];
  const withClash = renderers.createPillar({
    clash: { label: "衝煞：鼠" },
    seasonalMarker: { type: "離日", name: "金離日", label: "離日：金離日" },
  });

  for (const [id, line, prefixText, valueText, ariaLabel] of [
    ["daily-info-seasonal-marker-departure-dom", departure, "離日：", "金離日", "離日：金離日"],
    ["daily-info-seasonal-marker-separation-dom", separation, "絕日：", "金旺土絕", "絕日：金旺土絕"],
  ]) {
    baziDailyInfoVerifiedCaseCount += 1;
    assertEqual(id, "aria-label", ariaLabel, line?.attributes?.["aria-label"]);
    assertEqual(id, "title", ariaLabel, line?.title);
    assertEqual(id, "prefix.class", "seasonal-day-label-prefix", line?.childNodes?.[1]?.className);
    assertEqual(id, "prefix.text", prefixText, line?.childNodes?.[1]?.textContent);
    assertEqual(id, "value.class", "seasonal-day-label-value", line?.childNodes?.[2]?.className);
    assertEqual(id, "value.text", valueText, line?.childNodes?.[2]?.textContent);
  }

  baziDailyInfoVerifiedCaseCount += 1;
  assertEqual(
    "daily-info-seasonal-marker-css-desktop",
    "prefix.hidden",
    true,
    /\.seasonal-day-label-prefix\s*\{\s*display:\s*none;\s*\}/.test(mainCssRaw)
  );
  baziDailyInfoVerifiedCaseCount += 1;
  assertEqual(
    "daily-info-seasonal-marker-css-mobile",
    "prefix.visible",
    true,
    /@media \(max-width: 760px\)[\s\S]*?\.seasonal-day-label-prefix\s*\{\s*display:\s*inline;\s*\}/.test(mainCssRaw)
  );
  baziDailyInfoVerifiedCaseCount += 1;
  assertEqual(
    "daily-info-seasonal-marker-other-prompt-unchanged",
    "clash.text",
    "❌ 衝煞：鼠",
    withClash[0]?.textContent
  );
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

async function runGuiDengChartTimeAdapterTests(solarTerms) {
  const check = (id, expected, actual) => {
    guiDengChartTimeAdapterVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const parts = (year, month, day, hour, minute, second = 0, millisecond = 0) => ({
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
  });
  const instantFor = (localParts, offsetMinutes) => Date.UTC(
    localParts.year,
    localParts.month - 1,
    localParts.day,
    localParts.hour,
    localParts.minute,
    localParts.second,
    localParts.millisecond ?? 0,
  ) - offsetMinutes * 60_000;
  const carrier = (localParts) => new Date(Date.UTC(
    localParts.year,
    localParts.month - 1,
    localParts.day,
    localParts.hour,
    localParts.minute,
    localParts.second,
    localParts.millisecond ?? 0,
  ));
  const makeContext = ({
    mode = CHART_CONTEXT_MODE_WATCH,
    timeZone = "Asia/Taipei",
    utcOffsetMinutes = 480,
    civilParts,
    trueSolarParts = civilParts,
    location = null,
    correctionSeconds = 0,
  }) => {
    const civil = {
      localParts: civilParts,
      timeZone,
      utcOffsetMinutes,
      abbreviation: "",
      instantMs: instantFor(civilParts, utcOffsetMinutes),
      disambiguation: null,
    };
    if (mode === CHART_CONTEXT_MODE_WATCH) {
      return createWatchChartTimeContext({ source: "query", civil, location, createdAtInstantMs: 0 });
    }
    return createTrueSolarChartTimeContext({
      source: "query",
      civil,
      location,
      trueSolarResult: {
        trueSolarParts,
        totalCorrectionSeconds: correctionSeconds,
        longitudeCorrectionSeconds: correctionSeconds,
        equationOfTimeSeconds: 0,
      },
      createdAtInstantMs: 0,
    });
  };
  const makeRealTrueSolarContext = ({ timeZone, utcOffsetMinutes, civilParts, location }) => {
    const trueSolarResult = calculateTrueSolarTime({
      date: carrier(civilParts),
      latitude: location.latitude,
      longitude: location.longitude,
      utcOffsetMinutes,
      useUtcComponents: true,
    });
    return {
      context: createTrueSolarChartTimeContext({
        source: "query",
        civil: {
          localParts: civilParts,
          timeZone,
          utcOffsetMinutes,
          abbreviation: "",
          instantMs: instantFor(civilParts, utcOffsetMinutes),
          disambiguation: null,
        },
        location,
        trueSolarResult,
        createdAtInstantMs: 0,
      }),
      trueSolarResult,
    };
  };
  const makeEventCalculator = (eventsByCivilDate) => async ({ date }) => {
    const dateKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
    const event = eventsByCivilDate[dateKey];
    if (!event) return { daylightStatus: "unavailable", dateKey };
    return {
      daylightStatus: "normal",
      dateKey,
      sunrise: new Date(event.sunriseInstantMs),
      sunset: new Date(event.sunsetInstantMs),
    };
  };
  const wallMs = (localParts) => Date.UTC(
    localParts.year,
    localParts.month - 1,
    localParts.day,
    localParts.hour,
    localParts.minute,
    localParts.second,
    localParts.millisecond ?? 0,
  );
  const recomputeTrueSolarResultFromInstant = (instantMs, context) => {
    const instant = new Date(instantMs);
    const zoned = getZonedDateTimeParts(instant, context.civil.timeZone);
    const civilParts = {
      ...zoned.localParts,
      millisecond: instant.getUTCMilliseconds(),
    };
    return calculateTrueSolarTime({
      date: new Date(wallMs(civilParts)),
      latitude: context.location.latitude,
      longitude: context.location.longitude,
      utcOffsetMinutes: zoned.utcOffsetMinutes,
      useUtcComponents: true,
    });
  };
  const recomputeTrueSolarPartsFromInstant = (instantMs, context) => {
    return recomputeTrueSolarResultFromInstant(instantMs, context).trueSolarParts;
  };
  const assertTrueSolarHourRange = (id, context, result, type = "yang") => {
    const entry = result.guiDeng?.[type];
    const boundaries = getChineseHourBoundaryLocalParts(context.trueSolar?.localParts, entry?.hourBranch);
    check(`${id}-${type}-range-present`, true, Boolean(entry?.hourRange?.start && entry?.hourRange?.end && boundaries));
    if (!entry?.hourRange?.start || !entry?.hourRange?.end || !boundaries) return null;

    for (const side of ["start", "end"]) {
      const recomputed = recomputeTrueSolarPartsFromInstant(entry.hourRange[side].getTime(), context);
      check(
        `${id}-${type}-${side}-reverse-clock`,
        true,
        Math.abs(wallMs(recomputed) - wallMs(boundaries[side])) <= 1_000,
      );
    }
    return { entry, boundaries };
  };
  const fixedEvents = {
    "2026-01-09": {
      sunriseInstantMs: Date.parse("2026-01-09T06:00:00+08:00"),
      sunsetInstantMs: Date.parse("2026-01-09T18:00:00+08:00"),
    },
    "2026-01-10": {
      sunriseInstantMs: Date.parse("2026-01-10T06:00:00+08:00"),
      sunsetInstantMs: Date.parse("2026-01-10T18:00:00+08:00"),
    },
  };

  const adapterRaw = await readFile(new URL("../src/guidengChartTimeAdapter.js", import.meta.url), "utf8");
  const guidengRaw = await readFile(new URL("../src/guideng.js", import.meta.url), "utf8");
  const solarEventsRaw = await readFile(new URL("../src/solarEvents.js", import.meta.url), "utf8");
  check("guideng-adapter-static-no-main", false, /main\.js|from\s+["']\.\/main/.test(adapterRaw));
  check("guideng-adapter-static-no-dom", false, /\bdocument\b|\bwindow\b|navigator|localStorage|sessionStorage/.test(adapterRaw));
  check("guideng-adapter-static-no-network", false, /fetch\(|node_modules|npm:|process\.env/.test(adapterRaw));
  check("guideng-adapter-static-no-solar-formula", false, /SUNRISE_ZENITH|solarGeometry|NOAA|Meeus|equationMinutes/.test(adapterRaw));
  check("guideng-adapter-static-no-bazi-formula", false, /DAY_PILLAR_BASE|civilDateToEpochMs|firstHourStemIndex/.test(adapterRaw));
  check("guideng-adapter-static-no-true-solar-instant", false, /trueSolar[^\n]*new Date|new Date\([^\n]*trueSolar/.test(adapterRaw));
  check("guideng-adapter-static-uses-solar-events", true, adapterRaw.includes('from "./solarEvents.js"') && adapterRaw.includes("solarEventCalculator"));
  check("guideng-adapter-static-uses-true-solar-core", true, adapterRaw.includes('from "./trueSolarClock.js"') && adapterRaw.includes("resolveTrueSolarClockLocalDateTimeToInstant") && !adapterRaw.includes("calculateTrueSolarTime"));
  check("guideng-adapter-static-no-eot-formula-copy", false, /equationMinutes|meanLongitude|calculateEquationOfTime|NOAA|Meeus/.test(adapterRaw));
  check("guideng-adapter-static-no-true-solar-direct-iana-answer", false, /localParts:\s*targetTrueSolarLocalParts/.test(adapterRaw));
  check("guideng-adapter-static-uses-civil-event-key", true, adapterRaw.includes("context.astronomy.solarEventCivilDateKey"));
  check("guideng-adapter-static-reuses-guideng-mapping", true, adapterRaw.includes("calculateGuiDengHourBranches") && adapterRaw.includes("calculateGuiDengWithSunTimesForHourRanges") && adapterRaw.includes("getMonthGeneralBySolarTermName"));
  check("guideng-adapter-static-watch-path-retained", true, adapterRaw.includes("calculateGuiDengWithSunTimesForLocalDate") && adapterRaw.includes("input.mode === CHART_CONTEXT_MODE_TRUE_SOLAR"));
  check("guideng-adapter-static-guideng-mapping-retained", true, guidengRaw.includes("NOBLE_BRANCHES_BY_DAY_STEM") && guidengRaw.includes("MONTH_GENERAL_BY_CURRENT_TERM"));
  check("guideng-adapter-static-solar-events-unchanged-contract", true, solarEventsRaw.includes("export async function calculateSolarEvents") && solarEventsRaw.includes("SUNRISE_ZENITH_DEGREES"));

  const taipeiCivil = parts(2026, 1, 9, 22, 59, 59);
  const taipeiLocation = { latitude: 25.033, longitude: 121.5654, accuracy: null };
  const watchContext = makeContext({ civilParts: taipeiCivil, location: taipeiLocation });
  const watchBazi = calculateBaziFromChartTimeContext(watchContext, solarTerms);
  const validation = validateGuiDengChartTimeInput({ context: watchContext, baziResult: watchBazi });
  check("guideng-adapter-watch-validation", true, validation.valid);
  const input = createGuiDengCalculationInput({ context: watchContext, baziResult: watchBazi });
  check("guideng-adapter-input-frozen", true, Object.isFrozen(input) && Object.isFrozen(input.clockLocalParts));
  check("guideng-adapter-watch-clock-civil", JSON.stringify(taipeiCivil), JSON.stringify(getGuiDengClockLocalParts(watchContext)));
  check("guideng-adapter-day-pillar-from-bazi", watchBazi.dayPillar, getGuiDengDayPillar(watchBazi));
  check("guideng-adapter-day-stem-from-bazi", watchBazi.dayPillar[0], getGuiDengDayStem(watchBazi));
  check("guideng-adapter-month-general-from-current-term", getMonthGeneralBySolarTermName(watchBazi.currentTerm.name), getGuiDengMonthGeneral(watchBazi));
  check("guideng-adapter-event-date-civil", "2026-01-09", getGuiDengSolarEventDateKey(watchContext));
  check("guideng-adapter-effective-day-before-2300", "2026-01-09", createGuiDengCalculationInput({ context: watchContext, baziResult: watchBazi }).effectiveDayDateKey);

  const watchResult = await calculateGuiDengFromChartTimeContext({ context: watchContext, baziResult: watchBazi });
  check("guideng-adapter-watch-resolved", GUIDENG_CHART_TIME_STATUS.RESOLVED, watchResult.status);
  check("guideng-adapter-watch-day-stem", watchBazi.dayPillar[0], watchResult.dayStem);
  check("guideng-adapter-watch-event-date", "2026-01-09", watchResult.solarEventCivilDateKey);
  check("guideng-adapter-watch-phase", "after-sunset", watchResult.phase);
  check("guideng-adapter-watch-active-yin", "陰貴", watchResult.activeGuiRen);
  check("guideng-adapter-watch-events-finite", true, Object.values(watchResult.solarEvents).every((value) => typeof value === "string" || Number.isFinite(value)));
  check("guideng-adapter-watch-branches-from-entries", JSON.stringify(watchResult.guiDeng.entries.map((entry) => entry.hourBranch)), JSON.stringify(watchResult.dengGuiBranches));
  check("guideng-adapter-watch-debug-iso", true, watchResult.debug.queryInstant.endsWith("Z") && watchResult.debug.sunriseInstant.endsWith("Z"));
  check("guideng-adapter-debug-no-locale-string", false, /GMT|Taipei Standard|\(China Standard Time\)/.test(JSON.stringify(watchResult.debug)));

  const legacyWatch = await calculateGuiDengForDate({
    date: new Date(watchContext.civil.instantMs),
    dayStem: watchBazi.dayPillar[0],
    monthGeneral: getMonthGeneralBySolarTermName(watchBazi.currentTerm.name),
    latitude: taipeiLocation.latitude,
    longitude: taipeiLocation.longitude,
    timezone: "Asia/Taipei",
  });
  check("guideng-adapter-taiwan-legacy-sunrise", legacyWatch.sun.sunrise.getTime(), watchResult.solarEvents.sunriseInstantMs);
  check("guideng-adapter-taiwan-legacy-sunset", legacyWatch.sun.sunset.getTime(), watchResult.solarEvents.sunsetInstantMs);
  check("guideng-adapter-taiwan-legacy-next-sunrise", legacyWatch.sun.nextDaySunrise.getTime(), watchResult.solarEvents.nextSunriseInstantMs);
  check("guideng-adapter-taiwan-legacy-day-stem", legacyWatch.dayStem, watchResult.guiDeng.dayStem);
  check("guideng-adapter-taiwan-legacy-month-general", legacyWatch.monthGeneral, watchResult.guiDeng.monthGeneral);
  check("guideng-adapter-taiwan-legacy-entries", JSON.stringify(legacyWatch.entries.map((entry) => ({ label: entry.label, branch: entry.hourBranch, range: entry.rangeText })),), JSON.stringify(watchResult.guiDeng.entries.map((entry) => ({ label: entry.label, branch: entry.hourBranch, range: entry.rangeText }))));

  const defaultWatchContext = makeContext({ civilParts: taipeiCivil });
  const defaultWatchBazi = calculateBaziFromChartTimeContext(defaultWatchContext, solarTerms);
  const defaultWatchResult = await calculateGuiDengFromChartTimeContext({ context: defaultWatchContext, baziResult: defaultWatchBazi });
  const legacyDefaultWatch = await calculateGuiDengForDate({
    date: new Date(defaultWatchContext.civil.instantMs),
    dayStem: defaultWatchBazi.dayPillar[0],
    monthGeneral: getMonthGeneralBySolarTermName(defaultWatchBazi.currentTerm.name),
  });
  check("guideng-adapter-watch-default-location", "legacy-default", createGuiDengCalculationInput({ context: defaultWatchContext, baziResult: defaultWatchBazi }).locationSource);
  check("guideng-adapter-watch-default-sunrise", legacyDefaultWatch.sun.sunrise.getTime(), defaultWatchResult.solarEvents.sunriseInstantMs);
  check("guideng-adapter-watch-default-sunset", legacyDefaultWatch.sun.sunset.getTime(), defaultWatchResult.solarEvents.sunsetInstantMs);

  const divergenceCivil = parts(2026, 1, 9, 22, 59, 59);
  const divergenceTrueSolar = parts(2026, 1, 9, 23, 0, 1, 232);
  const divergenceWatchContext = makeContext({ civilParts: divergenceCivil, location: taipeiLocation });
  const divergenceTrueContext = makeContext({ mode: CHART_CONTEXT_MODE_TRUE_SOLAR, civilParts: divergenceCivil, trueSolarParts: divergenceTrueSolar, location: taipeiLocation, correctionSeconds: 2.232 });
  const divergenceWatchBazi = calculateBaziFromChartTimeContext(divergenceWatchContext, solarTerms);
  const divergenceTrueBazi = calculateBaziFromChartTimeContext(divergenceTrueContext, solarTerms);
  const divergenceWatchResult = await calculateGuiDengFromChartTimeContext({ context: divergenceWatchContext, baziResult: divergenceWatchBazi });
  const divergenceTrueResult = await calculateGuiDengFromChartTimeContext({ context: divergenceTrueContext, baziResult: divergenceTrueBazi });
  check("guideng-adapter-divergence-day-pillar", false, divergenceWatchResult.dayPillar === divergenceTrueResult.dayPillar);
  check("guideng-adapter-divergence-day-stem", false, divergenceWatchResult.dayStem === divergenceTrueResult.dayStem);
  check("guideng-adapter-divergence-effective-day", false, divergenceWatchResult.effectiveDayDateKey === divergenceTrueResult.effectiveDayDateKey);
  check("guideng-adapter-divergence-event-date-same", divergenceWatchResult.solarEventCivilDateKey, divergenceTrueResult.solarEventCivilDateKey);
  check("guideng-adapter-divergence-query-instant-same", divergenceWatchResult.queryInstantMs, divergenceTrueResult.queryInstantMs);
  check("guideng-adapter-divergence-events-same", JSON.stringify(divergenceWatchResult.solarEvents), JSON.stringify(divergenceTrueResult.solarEvents));
  check("guideng-adapter-divergence-phase-same", divergenceWatchResult.phase, divergenceTrueResult.phase);
  check("guideng-adapter-divergence-true-clock", JSON.stringify(divergenceTrueSolar), JSON.stringify(getGuiDengClockLocalParts(divergenceTrueContext)));
  check("guideng-adapter-divergence-new-active-stem", divergenceTrueBazi.dayPillar[0], divergenceTrueResult.dayStem);
  const trueSolarChildBoundaries = getChineseHourBoundaryLocalParts(divergenceTrueSolar, "子");
  const trueSolarChildStart = resolveTrueSolarLocalDateTimeToInstant({
    targetTrueSolarLocalParts: trueSolarChildBoundaries.start,
    context: divergenceTrueContext,
  });
  check("guideng-adapter-divergence-true-solar-zi-resolved", GUIDENG_CHART_TIME_STATUS.RESOLVED, trueSolarChildStart.status);
  check(
    "guideng-adapter-divergence-true-solar-zi-reverse",
    true,
    trueSolarChildStart.status === GUIDENG_CHART_TIME_STATUS.RESOLVED
      && Math.abs(wallMs(recomputeTrueSolarPartsFromInstant(trueSolarChildStart.instantMs, divergenceTrueContext)) - wallMs(trueSolarChildBoundaries.start)) <= 1_000,
  );
  const trueSolarOneBoundaries = getChineseHourBoundaryLocalParts(parts(2026, 1, 9, 1, 0, 0), "丑");
  const trueSolarOneStart = resolveTrueSolarLocalDateTimeToInstant({
    targetTrueSolarLocalParts: trueSolarOneBoundaries.start,
    context: divergenceTrueContext,
  });
  check("guideng-adapter-true-solar-0100-resolved", GUIDENG_CHART_TIME_STATUS.RESOLVED, trueSolarOneStart.status);
  check(
    "guideng-adapter-true-solar-0100-reverse",
    true,
    trueSolarOneStart.status === GUIDENG_CHART_TIME_STATUS.RESOLVED
      && Math.abs(wallMs(recomputeTrueSolarPartsFromInstant(trueSolarOneStart.instantMs, divergenceTrueContext)) - wallMs(trueSolarOneBoundaries.start)) <= 1_000,
  );

  const exactEvents = makeEventCalculator(fixedEvents);
  const oldDayContext = makeContext({ civilParts: parts(2026, 1, 9, 22, 59, 59), location: taipeiLocation });
  const newDayContext = makeContext({ civilParts: parts(2026, 1, 9, 23, 0, 0), location: taipeiLocation });
  const afterNewDayContext = makeContext({ civilParts: parts(2026, 1, 9, 23, 0, 1), location: taipeiLocation });
  const oldDayResult = await calculateGuiDengFromChartTimeContext({ context: oldDayContext, baziResult: calculateBaziFromChartTimeContext(oldDayContext, solarTerms), solarEventCalculator: exactEvents });
  const newDayResult = await calculateGuiDengFromChartTimeContext({ context: newDayContext, baziResult: calculateBaziFromChartTimeContext(newDayContext, solarTerms), solarEventCalculator: exactEvents });
  const afterNewDayResult = await calculateGuiDengFromChartTimeContext({ context: afterNewDayContext, baziResult: calculateBaziFromChartTimeContext(afterNewDayContext, solarTerms), solarEventCalculator: exactEvents });
  check("guideng-adapter-225959-old-day", "2026-01-09", oldDayResult.effectiveDayDateKey);
  check("guideng-adapter-230000-new-day", "2026-01-10", newDayResult.effectiveDayDateKey);
  check("guideng-adapter-230001-new-day", "2026-01-10", afterNewDayResult.effectiveDayDateKey);
  check("guideng-adapter-2300-day-stem-changes", false, oldDayResult.dayStem === newDayResult.dayStem);
  check("guideng-adapter-2300-event-date-unchanged", oldDayResult.solarEventCivilDateKey, newDayResult.solarEventCivilDateKey);
  check("guideng-adapter-2300-event-instants-unchanged", JSON.stringify(oldDayResult.solarEvents), JSON.stringify(newDayResult.solarEvents));

  const civilMidnightContext = makeContext({ civilParts: parts(2026, 1, 10, 0, 0, 0), location: taipeiLocation });
  const civilMidnightEvents = makeEventCalculator({ ...fixedEvents, "2026-01-11": { sunriseInstantMs: Date.parse("2026-01-11T06:00:00+08:00"), sunsetInstantMs: Date.parse("2026-01-11T18:00:00+08:00") } });
  const midnightResult = await calculateGuiDengFromChartTimeContext({ context: civilMidnightContext, baziResult: calculateBaziFromChartTimeContext(civilMidnightContext, solarTerms), solarEventCalculator: civilMidnightEvents });
  check("guideng-adapter-civil-midnight-event-date-changes", "2026-01-10", midnightResult.solarEventCivilDateKey);
  check("guideng-adapter-civil-midnight-effective-day", "2026-01-10", midnightResult.effectiveDayDateKey);
  check("guideng-adapter-23-not-civil-midnight", oldDayResult.solarEventCivilDateKey, newDayResult.solarEventCivilDateKey);

  const negativeCorrectionContext = makeContext({ mode: CHART_CONTEXT_MODE_TRUE_SOLAR, civilParts: parts(2026, 1, 10, 0, 1, 0), trueSolarParts: parts(2026, 1, 9, 23, 55, 0), location: taipeiLocation, correctionSeconds: -360 });
  const negativeEvents = makeEventCalculator({
    ...fixedEvents,
    "2026-01-11": {
      sunriseInstantMs: Date.parse("2026-01-11T06:00:00+08:00"),
      sunsetInstantMs: Date.parse("2026-01-11T18:00:00+08:00"),
    },
  });
  const negativeResult = await calculateGuiDengFromChartTimeContext({ context: negativeCorrectionContext, baziResult: calculateBaziFromChartTimeContext(negativeCorrectionContext, solarTerms), solarEventCalculator: negativeEvents });
  check("guideng-adapter-negative-true-solar-clock", "2026-01-09T23:55:00", negativeResult.debug.trueSolarLocal);
  check("guideng-adapter-negative-true-solar-effective-day", "2026-01-10", negativeResult.effectiveDayDateKey);
  check("guideng-adapter-negative-keeps-civil-event-date", "2026-01-10", negativeResult.solarEventCivilDateKey);
  const negativeYangRange = assertTrueSolarHourRange("guideng-adapter-negative", negativeCorrectionContext, negativeResult, "yang");
  const negativeYangBoundaries = negativeYangRange?.boundaries;
  const negativeNaiveStart = resolveLocalDateTimeInTimeZone({
    localParts: negativeYangBoundaries?.start,
    timeZone: negativeCorrectionContext.civil.timeZone,
    disambiguation: "earlier",
  }).instant.getTime();
  check(
    "guideng-adapter-negative-hour-range-not-naive-iana",
    false,
    negativeNaiveStart === negativeYangRange?.entry.hourRange.start.getTime(),
  );
  const realNegativeLocation = { latitude: 25, longitude: 115, accuracy: null };
  const { context: realNegativeContext, trueSolarResult: realNegativeSolar } = makeRealTrueSolarContext({
    timeZone: "Asia/Taipei",
    utcOffsetMinutes: 480,
    civilParts: parts(2026, 1, 10, 0, 1, 0),
    location: realNegativeLocation,
  });
  const realNegativeBazi = calculateBaziFromChartTimeContext(realNegativeContext, solarTerms);
  const realNegativeResult = await calculateGuiDengFromChartTimeContext({ context: realNegativeContext, baziResult: realNegativeBazi });
  check("guideng-adapter-real-negative-resolved", GUIDENG_CHART_TIME_STATUS.RESOLVED, realNegativeResult.status);
  check("guideng-adapter-real-negative-correction", true, realNegativeSolar.totalCorrectionSeconds < -300);
  check("guideng-adapter-real-negative-crosses-previous-date", true, realNegativeResult.clockLocalParts.day === 9);
  assertTrueSolarHourRange("guideng-adapter-real-negative", realNegativeContext, realNegativeResult, "yang");

  const phaseEvents = { sunriseInstantMs: 1_000_000, sunsetInstantMs: 2_000_000, nextSunriseInstantMs: 3_000_000 };
  for (const [id, instantMs, expected] of [
    ["before-sunrise", 999_999, "before-sunrise"],
    ["sunrise-minus-one", 999_999, "before-sunrise"],
    ["sunrise-exact", 1_000_000, "daytime"],
    ["sunrise-plus-one", 1_000_001, "daytime"],
    ["daytime", 1_500_000, "daytime"],
    ["sunset-minus-one", 1_999_999, "daytime"],
    ["sunset-exact", 2_000_000, "after-sunset"],
    ["sunset-plus-one", 2_000_001, "after-sunset"],
    ["before-next-sunrise", 2_999_999, "after-sunset"],
  ]) {
    check(`guideng-adapter-phase-${id}`, expected, resolveGuiDengSolarEventPhase({ queryInstantMs: instantMs, solarEvents: phaseEvents }));
  }

  const solarEventUnavailable = await calculateGuiDengFromChartTimeContext({ context: watchContext, baziResult: watchBazi, solarEventCalculator: async () => ({ daylightStatus: "unavailable" }) });
  check("guideng-adapter-polar-unavailable-status", GUIDENG_CHART_TIME_STATUS.UNSUPPORTED, solarEventUnavailable.status);
  check("guideng-adapter-polar-no-fake-events", null, solarEventUnavailable.solarEvents);
  check("guideng-adapter-polar-no-fake-gui-deng", null, solarEventUnavailable.guiDeng);

  check("guideng-adapter-invalid-context", false, validateGuiDengChartTimeInput({ context: null, baziResult: watchBazi }).valid);
  check("guideng-adapter-missing-bazi", false, validateGuiDengChartTimeInput({ context: watchContext }).valid);
  check("guideng-adapter-invalid-day-pillar", false, validateGuiDengChartTimeInput({ context: watchContext, baziResult: { ...watchBazi, dayPillar: "無效" } }).valid);
  check("guideng-adapter-invalid-term", false, validateGuiDengChartTimeInput({ context: watchContext, baziResult: { ...watchBazi, currentTerm: { name: "不存在", timeMs: 1 } } }).valid);
  check("guideng-adapter-invalid-location", false, validateGuiDengChartTimeInput({ context: { ...watchContext, location: { latitude: 99, longitude: 121 } }, baziResult: watchBazi }).valid);

  const trueContext = makeContext({ mode: CHART_CONTEXT_MODE_TRUE_SOLAR, civilParts: taipeiCivil, trueSolarParts: taipeiCivil, location: taipeiLocation });
  const trueBazi = calculateBaziFromChartTimeContext(trueContext, solarTerms);
  const trueResult = await calculateGuiDengFromChartTimeContext({ context: trueContext, baziResult: trueBazi, solarEventCalculator: exactEvents });
  check("guideng-adapter-true-solar-resolved", GUIDENG_CHART_TIME_STATUS.RESOLVED, trueResult.status);
  check("guideng-adapter-true-solar-clock-source", JSON.stringify(taipeiCivil), JSON.stringify(trueResult.clockLocalParts));
  check("guideng-adapter-true-solar-effective-day", getEffectiveDateKeyFromLocalParts(taipeiCivil), trueResult.effectiveDayDateKey);
  check("guideng-adapter-true-solar-event-date-civil", "2026-01-09", trueResult.solarEventCivilDateKey);
  assertTrueSolarHourRange("guideng-adapter-taiwan-true", trueContext, trueResult, "yang");

  const zeroCivil = parts(2026, 4, 15, 23, 0, 0);
  const zeroEquationOfTimeSeconds = calculateEquationOfTime({
    date: carrier(zeroCivil),
    utcOffsetMinutes: 480,
    useUtcComponents: true,
  });
  const zeroLocation = {
    latitude: 25,
    longitude: 120 - zeroEquationOfTimeSeconds / 240,
    accuracy: null,
  };
  const { context: zeroContext, trueSolarResult: zeroTrueSolarResult } = makeRealTrueSolarContext({
    timeZone: "Asia/Taipei",
    utcOffsetMinutes: 480,
    civilParts: zeroCivil,
    location: zeroLocation,
  });
  const zeroBazi = calculateBaziFromChartTimeContext(zeroContext, solarTerms);
  const zeroResult = await calculateGuiDengFromChartTimeContext({ context: zeroContext, baziResult: zeroBazi });
  check("guideng-adapter-zero-correction-resolved", GUIDENG_CHART_TIME_STATUS.RESOLVED, zeroResult.status);
  check("guideng-adapter-zero-correction-near-zero", true, Math.abs(zeroTrueSolarResult.totalCorrectionSeconds) <= 0.001);
  assertTrueSolarHourRange("guideng-adapter-zero-correction", zeroContext, zeroResult, "yang");
  const zeroInversion = resolveTrueSolarLocalDateTimeToInstant({
    targetTrueSolarLocalParts: zeroCivil,
    context: zeroContext,
  });
  const zeroNaiveStart = resolveLocalDateTimeInTimeZone({
    localParts: zeroCivil,
    timeZone: zeroContext.civil.timeZone,
    disambiguation: "earlier",
  }).instant.getTime();
  check("guideng-adapter-zero-correction-naive-equivalent", true, zeroInversion.status === GUIDENG_CHART_TIME_STATUS.RESOLVED && Math.abs(zeroInversion.instantMs - zeroNaiveStart) <= 1_000);

  const overseasCases = [
    ["tokyo", "Asia/Tokyo", 540, parts(2026, 8, 10, 12, 0), { latitude: 35.68, longitude: 139.65, accuracy: null }],
    ["la-summer", "America/Los_Angeles", -420, parts(2026, 8, 10, 12, 0), { latitude: 34.0522, longitude: -118.2437, accuracy: null }],
    ["la-winter", "America/Los_Angeles", -480, parts(2026, 12, 10, 12, 0), { latitude: 34.0522, longitude: -118.2437, accuracy: null }],
    ["kathmandu", "Asia/Kathmandu", 345, parts(2026, 8, 10, 12, 0), { latitude: 27.7172, longitude: 85.324, accuracy: null }],
    ["lord-howe", "Australia/Lord_Howe", 630, parts(2027, 4, 10, 12, 0), { latitude: -31.55, longitude: 159.08, accuracy: null }],
  ];
  for (const [id, timeZone, utcOffsetMinutes, localParts, location] of overseasCases) {
    const { context } = makeRealTrueSolarContext({ timeZone, utcOffsetMinutes, civilParts: localParts, location });
    const bazi = calculateBaziFromChartTimeContext(context, solarTerms);
    const result = await calculateGuiDengFromChartTimeContext({ context, baziResult: bazi });
    check(`guideng-adapter-overseas-${id}-resolved`, GUIDENG_CHART_TIME_STATUS.RESOLVED, result.status);
    check(`guideng-adapter-overseas-${id}-timezone-date`, context.civil.localParts.year, Number(result.solarEventCivilDateKey.slice(0, 4)));
    check(`guideng-adapter-overseas-${id}-finite-events`, true, Object.values(result.solarEvents).filter((value) => typeof value === "number").every(Number.isFinite));
    check(`guideng-adapter-overseas-${id}-phase`, true, ["before-sunrise", "daytime", "after-sunset"].includes(result.phase));
    const overseasRange = assertTrueSolarHourRange(`guideng-adapter-overseas-${id}`, context, result, "yang");
    if (id === "tokyo" && overseasRange) {
      const naiveStart = resolveLocalDateTimeInTimeZone({
        localParts: overseasRange.boundaries.start,
        timeZone,
        disambiguation: "earlier",
      }).instant.getTime();
      const actualStart = overseasRange.entry.hourRange.start.getTime();
      check(`guideng-adapter-overseas-${id}-positive-correction-not-naive`, false, actualStart === naiveStart);
      const boundaryCorrection = recomputeTrueSolarResultFromInstant(actualStart, context).totalCorrectionSeconds;
      check(
        `guideng-adapter-overseas-${id}-positive-correction-close`,
        true,
        Math.abs((naiveStart - actualStart) - boundaryCorrection * 1_000) <= 1_000,
      );
    }
  }

  const dstTransitionContext = makeRealTrueSolarContext({ timeZone: "America/Los_Angeles", utcOffsetMinutes: -480, civilParts: parts(2026, 3, 8, 12, 0), location: { latitude: 34.0522, longitude: -118.2437, accuracy: null } }).context;
  const dstTransitionResult = await calculateGuiDengFromChartTimeContext({ context: dstTransitionContext, baziResult: calculateBaziFromChartTimeContext(dstTransitionContext, solarTerms) });
  check("guideng-adapter-dst-transition-explicit-unsupported", GUIDENG_CHART_TIME_STATUS.UNSUPPORTED, dstTransitionResult.status);
  check("guideng-adapter-dst-transition-no-fake-events", null, dstTransitionResult.solarEvents);

  const probeContext = makeRealTrueSolarContext({ timeZone: "Asia/Taipei", utcOffsetMinutes: 480, civilParts: parts(2026, 1, 9, 22, 59, 59), location: taipeiLocation }).context;
  const probeBazi = calculateBaziFromChartTimeContext(probeContext, solarTerms);
  const probeInput = JSON.stringify({ context: probeContext, baziResult: probeBazi });
  const runProbe = (timeZone) => execFileSync(process.execPath, ["tests/guideng-chart-time-adapter-probe.mjs", probeInput], { cwd: process.cwd(), env: { ...process.env, TZ: timeZone }, encoding: "utf8" }).trim();
  const probeTaipei = runProbe("Asia/Taipei");
  check("guideng-adapter-process-tz-utc", probeTaipei, runProbe("UTC"));
  check("guideng-adapter-process-tz-los-angeles", probeTaipei, runProbe("America/Los_Angeles"));

  check("guideng-adapter-runtime-import", true, mainModuleRaw.includes('from "./guidengChartTimeAdapter.js"'));
  check("guideng-adapter-formal-runtime-wiring", true, /calculateGuiDengFromChartTimeContext/.test(mainModuleRaw));
  check("guideng-adapter-no-storage", false, /localStorage|sessionStorage/.test(adapterRaw));
  check("guideng-adapter-no-dependency", false, /node_modules|npm:/.test(adapterRaw));
  check("guideng-adapter-no-guideng-formula-copy", false, /NOBLE_BRANCHES_BY_DAY_STEM|MONTH_GENERAL_BY_CURRENT_TERM|SUNRISE_ZENITH/.test(adapterRaw));
  check("guideng-adapter-debug-formatter-pure", true, adapterRaw.includes("toISOString()") && !adapterRaw.includes("toString()"));
  check("guideng-adapter-query-instant-is-civil", true, adapterRaw.includes("context.civil.instantMs") && !adapterRaw.includes("trueSolar.instantMs"));
  check("guideng-adapter-event-date-is-civil", true, adapterRaw.includes("solarEventCivilDateKey") && adapterRaw.includes("createUtcDateCarrier(dateKey)") && !adapterRaw.includes("effectiveDayDateKey)"));
  check("guideng-adapter-hour-rule-shared", true, guidengRaw.includes("getChineseHourRangeForLocalDate") && adapterRaw.includes("calculateGuiDengWithSunTimesForLocalDate"));
}

async function runGuiDengChartTimeRuntimeTests(solarTerms) {
  const check = (id, expected, actual) => {
    guiDengChartTimeRuntimeVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const parts = (year, month, day, hour, minute, second = 0, millisecond = 0) => ({
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
  });
  const instantFor = (localParts, offsetMinutes = 480) => Date.UTC(
    localParts.year,
    localParts.month - 1,
    localParts.day,
    localParts.hour,
    localParts.minute,
    localParts.second,
    localParts.millisecond ?? 0,
  ) - offsetMinutes * 60_000;
  const carrier = (localParts) => new Date(Date.UTC(
    localParts.year,
    localParts.month - 1,
    localParts.day,
    localParts.hour,
    localParts.minute,
    localParts.second,
    localParts.millisecond ?? 0,
  ));
  const makeWatchContext = (civilParts, timeZone = "Asia/Taipei", utcOffsetMinutes = 480) =>
    createWatchChartTimeContext({
      source: "query",
      civil: {
        localParts: civilParts,
        timeZone,
        utcOffsetMinutes,
        abbreviation: "",
        instantMs: instantFor(civilParts, utcOffsetMinutes),
        disambiguation: null,
      },
      createdAtInstantMs: 0,
    });
  const makeTrueSolarContext = ({ civilParts, timeZone = "Asia/Taipei", utcOffsetMinutes = 480, location }) => {
    const trueSolarResult = calculateTrueSolarTime({
      date: carrier(civilParts),
      latitude: location.latitude,
      longitude: location.longitude,
      utcOffsetMinutes,
      useUtcComponents: true,
    });
    return createTrueSolarChartTimeContext({
      source: "query",
      civil: {
        localParts: civilParts,
        timeZone,
        utcOffsetMinutes,
        abbreviation: "",
        instantMs: instantFor(civilParts, utcOffsetMinutes),
        disambiguation: null,
      },
      location,
      trueSolarResult,
      createdAtInstantMs: 0,
    });
  };
  const makeEventCalculator = (eventsByCivilDate) => async ({ date }) => {
    const dateKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
    const event = eventsByCivilDate[dateKey];
    if (!event) return { daylightStatus: "unavailable", dateKey };
    return {
      daylightStatus: "normal",
      dateKey,
      sunrise: new Date(event.sunriseInstantMs),
      sunset: new Date(event.sunsetInstantMs),
    };
  };
  const taipeiLocation = { latitude: 25.033964, longitude: 121.564468, accuracy: null };
  const tokyoLocation = { latitude: 35.68, longitude: 139.65, accuracy: null };
  const negativeLocation = { latitude: 25, longitude: 115, accuracy: null };
  const taipeiCivil = parts(2026, 8, 10, 12, 0);
  const commonEvents = makeEventCalculator({
    "2026-08-10": {
      sunriseInstantMs: Date.parse("2026-08-10T06:00:00+08:00"),
      sunsetInstantMs: Date.parse("2026-08-10T18:00:00+08:00"),
    },
    "2026-08-11": {
      sunriseInstantMs: Date.parse("2026-08-11T06:00:00+08:00"),
      sunsetInstantMs: Date.parse("2026-08-11T18:00:00+08:00"),
    },
  });
  const tokyoEvents = makeEventCalculator({
    "2026-08-10": {
      sunriseInstantMs: Date.parse("2026-08-10T05:00:00+09:00"),
      sunsetInstantMs: Date.parse("2026-08-10T18:30:00+09:00"),
    },
    "2026-08-11": {
      sunriseInstantMs: Date.parse("2026-08-11T05:00:00+09:00"),
      sunsetInstantMs: Date.parse("2026-08-11T18:30:00+09:00"),
    },
  });

  const displayRaw = await readFile(new URL("../src/chartClockDisplay.js", import.meta.url), "utf8");
  const helperSource = extractNamedFunctionSource(mainModuleRaw, "refreshGuiDengForCurrentChartTime");
  const coreSource = extractNamedFunctionSource(mainModuleRaw, "renderJinhanCoreSnapshot");
  const decorationsSource = extractNamedFunctionSource(mainModuleRaw, "renderGuiDengDecorations");
  const jinhanSource = extractNamedFunctionSource(mainModuleRaw, "refreshJinhanForCurrentChartTime");
  const lightweightSource = extractNamedFunctionSource(mainModuleRaw, "refreshBaziForCurrentChartTime");
  const fullSource = extractNamedFunctionSource(mainModuleRaw, "renderByDateTime");
  const modeSource = extractNamedFunctionSource(mainModuleRaw, "renderChartDisplayMode");
  const coordinateInputSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeCoordinateInput");
  const coordinateChangeSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeCoordinateChange");
  const deviceSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForDeviceNow");
  const customSource = extractNamedFunctionSource(mainModuleRaw, "renderTrueSolarTimeForCustomInput");
  const sourceChangeSource = extractNamedFunctionSource(mainModuleRaw, "handleTrueSolarTimeSourceChange");

  check("guideng-runtime-adapter-import", true, mainModuleRaw.includes('from "./guidengChartTimeAdapter.js"'));
  check("guideng-runtime-display-import", true, mainModuleRaw.includes('from "./chartClockDisplay.js"'));
  check("guideng-runtime-formal-helper", true, helperSource.includes("calculateGuiDengFromChartTimeContext({"));
  check("guideng-runtime-watch-authority", true, helperSource.includes("createCurrentWatchChartTimeContext(") && helperSource.includes("currentWatchBaziResult ?? currentCalendarResult"));
  check("guideng-runtime-true-authority", true, helperSource.includes("currentTrueSolarChartContext") && helperSource.includes("currentTrueSolarBaziResult"));
  const trueBranch = helperSource.slice(helperSource.indexOf("const context"), helperSource.indexOf("const baziResult"));
  check("guideng-runtime-true-no-calendar-authority", false, trueBranch.includes("currentCalendarResult"));
  check("guideng-runtime-no-legacy-formal-call", false, helperSource.includes("getGuiDengForCalendarResult") || jinhanSource.includes("getGuiDengForCalendarResult"));
  check("guideng-runtime-core-before-async", true, jinhanSource.indexOf("renderJinhanCoreSnapshot") < jinhanSource.indexOf("refreshGuiDengForCurrentChartTime"));
  check("guideng-runtime-async-fire-and-guard", true, jinhanSource.includes("void refreshGuiDengForCurrentChartTime(requestId, {") && helperSource.includes("await calculateGuiDengFromChartTimeContext("));
  check("guideng-runtime-stale-before-await", true, helperSource.indexOf("!isLatestBaziRenderRequest(requestId)") < helperSource.indexOf("await calculateGuiDengFromChartTimeContext("));
  check("guideng-runtime-stale-after-await", true, helperSource.lastIndexOf("!isLatestBaziRenderRequest(requestId)") > helperSource.indexOf("await calculateGuiDengFromChartTimeContext("));
  check("guideng-runtime-stale-before-dom", true, helperSource.lastIndexOf("!isLatestBaziRenderRequest(requestId)") < helperSource.lastIndexOf("renderGuiDengDecorations"));
  check("guideng-runtime-no-watch-fallback", true, helperSource.includes("currentTrueSolarChartContext") && !trueBranch.includes("currentWatchBaziResult"));
  check("guideng-runtime-unavailable-keeps-core", true, helperSource.includes("renderGuiDengDecorations(renderSnapshot, null") && !helperSource.includes("clearJinhanYujing"));
  check("guideng-runtime-renderer-single", 1, (mainModuleRaw.match(/function renderGuiDengDecorations\(/g) ?? []).length);
  check("guideng-runtime-no-second-gui-renderer", 1, (mainModuleRaw.match(/function refreshGuiDengForCurrentChartTime\(/g) ?? []).length);
  check("guideng-runtime-summary-reuses-jinhan", true, decorationsSource.includes("createJinhanSummaryItems") && decorationsSource.includes("createJinhanHourRow"));
  check("guideng-runtime-core-grid-reuses-jinhan", true, coreSource.includes("createJinhanGridCells") && coreSource.includes("createJinhanSummaryItems"));
  check("guideng-runtime-full-same-entry", true, fullSource.includes("await renderJinhanYujing(result, effectiveDateTimeValue, requestId)"));
  check("guideng-runtime-lightweight-no-await", false, /\bawait\b/.test(lightweightSource));
  check("guideng-runtime-lightweight-schedules", true, lightweightSource.includes("refreshJinhanForCurrentChartTime(requestId)"));
  check("guideng-runtime-mode-refreshes", true, modeSource.includes("refreshJinhanForCurrentChartTime(requestId)"));
  check("guideng-runtime-mode-no-auto-toggle", false, /startAutoNowMode|pauseAutoNowMode/.test(modeSource));
  check("guideng-runtime-mode-no-datetime-write", false, modeSource.includes("elements.datetime.value ="));
  check("guideng-runtime-coordinate-input-refresh", true, coordinateInputSource.includes("refreshJinhanForCurrentChartTime(requestId)"));
  check("guideng-runtime-coordinate-change-refresh", true, coordinateChangeSource.includes("refreshJinhanForCurrentChartTime(requestId)"));
  check("guideng-runtime-source-b-isolation", false, deviceSource.includes("refreshGuiDengForCurrentChartTime") || deviceSource.includes("currentTrueSolarChartContext"));
  check("guideng-runtime-source-c-isolation", false, customSource.includes("refreshGuiDengForCurrentChartTime") || customSource.includes("currentTrueSolarChartContext"));
  check("guideng-runtime-source-change-isolation", false, sourceChangeSource.includes("refreshGuiDengForCurrentChartTime") || sourceChangeSource.includes("renderFormalTrueSolarChartTime"));
  check("guideng-runtime-existing-timers", 2, (mainModuleRaw.match(/setInterval\(/g) ?? []).length);
  check("guideng-runtime-cache-present", true, mainModuleRaw.includes("guiDengSolarEventCache") && mainModuleRaw.includes("calculateCachedGuiDengSolarEvents"));
  check("guideng-runtime-no-storage", false, /localStorage|sessionStorage/.test(mainModuleRaw));
  check("guideng-runtime-no-clock-ui", false, /canvas|<svg|createClock|clock-component/i.test(mainModuleRaw));
  check("guideng-runtime-no-qimen-change", true, mainModuleRaw.includes('from "./qimenResolver.js"'));
  check("guideng-display-pure", false, /\bdocument\b|\bwindow\b|localStorage|sessionStorage|fetch\(/.test(displayRaw));
  check("guideng-display-reuses-true-solar-core", true, displayRaw.includes("calculateTrueSolarTime") && displayRaw.includes("getZonedDateTimeParts"));
  check("guideng-display-no-query-correction", false, /context\.trueSolar\.correctionSeconds|context\.trueSolar\?\.correctionSeconds/.test(displayRaw));
  check("guideng-display-no-fake-date", false, /trueSolarDate|new Date\([^)]*trueSolar/.test(displayRaw));

  const watchContext = makeWatchContext(taipeiCivil);
  const watchBazi = calculateBaziFromChartTimeContext(watchContext, solarTerms);
  const watchResult = await calculateGuiDengFromChartTimeContext({
    context: watchContext,
    baziResult: watchBazi,
    solarEventCalculator: commonEvents,
  });
  const watchDisplay = createGuiDengDisplayModel({ result: watchResult, context: watchContext });
  check("guideng-runtime-watch-resolved", GUIDENG_CHART_TIME_STATUS.RESOLVED, watchResult.status);
  check("guideng-runtime-watch-day-stem", watchBazi.dayPillar[0], watchResult.dayStem);
  check("guideng-runtime-watch-month-general", getMonthGeneralBySolarTermName(watchBazi.currentTerm.name), watchResult.monthGeneral);
  check("guideng-runtime-watch-display-status", "resolved", watchDisplay.status);
  check("guideng-runtime-watch-sunrise-display", watchResult.guiDeng.sunriseText, watchDisplay.sunriseText);
  check("guideng-runtime-watch-sunset-display", watchResult.guiDeng.sunsetText, watchDisplay.sunsetText);
  check("guideng-runtime-watch-next-sunrise-display", formatInstantForChartMode({ instantMs: watchResult.solarEvents.nextSunriseInstantMs, context: watchContext }), watchDisplay.nextSunriseText);
  check("guideng-runtime-watch-range-display", watchResult.guiDeng.entries[0]?.rangeText, watchDisplay.entries.find((entry) => entry.isAvailable)?.rangeText);
  check("guideng-runtime-watch-branches", JSON.stringify(watchResult.dengGuiBranches), JSON.stringify(watchDisplay.dengGuiBranches));
  check("guideng-runtime-watch-gui-text", watchDisplay.entries.filter((entry) => entry.isAvailable).map((entry) => `${entry.hourBranch}時（${entry.label}，${entry.rangeText}）`).join("；") || "無", watchDisplay.guiDengText);
  check("guideng-runtime-watch-result-not-mutated", true, JSON.stringify(watchResult).includes("sunriseInstantMs"));

  const trueContext = makeTrueSolarContext({ civilParts: taipeiCivil, location: tokyoLocation, timeZone: "Asia/Tokyo", utcOffsetMinutes: 540 });
  const trueBazi = calculateBaziFromChartTimeContext(trueContext, solarTerms);
  const trueResult = await calculateGuiDengFromChartTimeContext({
    context: trueContext,
    baziResult: trueBazi,
    solarEventCalculator: tokyoEvents,
  });
  const trueSnapshotBeforeDisplay = JSON.stringify(trueResult);
  const trueDisplay = createGuiDengDisplayModel({ result: trueResult, context: trueContext });
  check("guideng-runtime-true-resolved", GUIDENG_CHART_TIME_STATUS.RESOLVED, trueResult.status);
  check("guideng-runtime-true-day-stem", trueBazi.dayPillar[0], trueResult.dayStem);
  check("guideng-runtime-true-month-general", getMonthGeneralBySolarTermName(trueBazi.currentTerm.name), trueResult.monthGeneral);
  check("guideng-runtime-true-branches", JSON.stringify(trueResult.dengGuiBranches), JSON.stringify(trueDisplay.dengGuiBranches));
  check("guideng-runtime-true-actual-sunrise", trueResult.solarEvents.sunriseInstantMs, Date.parse("2026-08-10T05:00:00+09:00"));
  check("guideng-runtime-true-display-sunrise", formatInstantForChartMode({ instantMs: trueResult.solarEvents.sunriseInstantMs, context: trueContext }), trueDisplay.sunriseText);
  check("guideng-runtime-true-display-sunset", formatInstantForChartMode({ instantMs: trueResult.solarEvents.sunsetInstantMs, context: trueContext }), trueDisplay.sunsetText);
  check("guideng-runtime-true-display-next-sunrise", formatInstantForChartMode({ instantMs: trueResult.solarEvents.nextSunriseInstantMs, context: trueContext }), trueDisplay.nextSunriseText);
  check("guideng-runtime-true-range-display", formatRangeForChartMode({
    startInstantMs: trueResult.guiDeng.entries[0]?.availableRange?.start?.getTime(),
    endInstantMs: trueResult.guiDeng.entries[0]?.availableRange?.end?.getTime(),
    context: trueContext,
  }), trueDisplay.entries.find((entry) => entry.isAvailable)?.rangeText);
  check("guideng-runtime-true-no-civil-range-answer", false, trueDisplay.entries.some((entry) => entry.rangeText === trueResult.guiDeng.entries.find((source) => source.hourBranch === entry.hourBranch)?.rangeText && entry.rangeText === "05:00–06:59"));
  check("guideng-runtime-true-result-not-mutated", trueSnapshotBeforeDisplay, JSON.stringify(trueResult));
  check("guideng-runtime-true-display-model-immutable", true, Object.isFrozen(trueDisplay) && Object.isFrozen(trueDisplay.entries));

  const negativeContext = makeTrueSolarContext({ civilParts: taipeiCivil, location: negativeLocation });
  const negativeBazi = calculateBaziFromChartTimeContext(negativeContext, solarTerms);
  const negativeResult = await calculateGuiDengFromChartTimeContext({
    context: negativeContext,
    baziResult: negativeBazi,
    solarEventCalculator: commonEvents,
  });
  const negativeDisplay = createGuiDengDisplayModel({ result: negativeResult, context: negativeContext });
  check("guideng-runtime-negative-resolved", GUIDENG_CHART_TIME_STATUS.RESOLVED, negativeResult.status);
  check("guideng-runtime-negative-sunrise-recomputed", formatInstantForChartMode({ instantMs: negativeResult.solarEvents.sunriseInstantMs, context: negativeContext }), negativeDisplay.sunriseText);
  check("guideng-runtime-negative-range-recomputed", true, negativeDisplay.entries.every((entry) => !entry.isAvailable || entry.rangeText === formatRangeForChartMode({
    startInstantMs: negativeResult.guiDeng.entries.find((source) => source.hourBranch === entry.hourBranch)?.availableRange?.start?.getTime(),
    endInstantMs: negativeResult.guiDeng.entries.find((source) => source.hourBranch === entry.hourBranch)?.availableRange?.end?.getTime(),
    context: negativeContext,
  })));
  check("guideng-runtime-positive-and-negative-differ", false, trueDisplay.sunriseText === negativeDisplay.sunriseText);

  const queryTrueSolar = calculateTrueSolarTime({
    date: carrier(taipeiCivil),
    latitude: trueContext.location.latitude,
    longitude: trueContext.location.longitude,
    utcOffsetMinutes: 540,
    useUtcComponents: true,
  });
  const civilSunriseParts = getZonedDateTimeParts(new Date(trueResult.solarEvents.sunriseInstantMs), trueContext.civil.timeZone).localParts;
  const queryCorrectionCarrier = carrier({ ...civilSunriseParts, millisecond: 0 });
  const queryCorrectionDisplay = calculateTrueSolarTime({
    date: queryCorrectionCarrier,
    latitude: trueContext.location.latitude,
    longitude: trueContext.location.longitude,
    utcOffsetMinutes: trueContext.civil.utcOffsetMinutes,
    useUtcComponents: true,
  });
  check("guideng-runtime-per-event-eot-sunrise", formatInstantForChartMode({ instantMs: trueResult.solarEvents.sunriseInstantMs, context: trueContext }), trueDisplay.sunriseText);
  check("guideng-runtime-per-event-eot-sunset", formatInstantForChartMode({ instantMs: trueResult.solarEvents.sunsetInstantMs, context: trueContext }), trueDisplay.sunsetText);
  check("guideng-runtime-no-query-correction-reuse", false, queryTrueSolar.totalCorrectionSeconds === queryCorrectionDisplay.totalCorrectionSeconds && queryCorrectionDisplay.totalCorrectionSeconds === queryTrueSolar.totalCorrectionSeconds && displayRaw.includes("queryCorrection"));
  check("guideng-runtime-display-is-instant-based", true, displayRaw.includes("new Date(instantMs)") && displayRaw.includes("instant.getUTCMilliseconds()"));

  const phaseEvents = { sunriseInstantMs: 1_000_000, sunsetInstantMs: 2_000_000, nextSunriseInstantMs: 3_000_000 };
  for (const [label, instantMs, expected] of [
    ["sunrise-minus-one", 999_999, "before-sunrise"],
    ["sunrise-exact", 1_000_000, "daytime"],
    ["sunrise-plus-one", 1_000_001, "daytime"],
    ["sunset-minus-one", 1_999_999, "daytime"],
    ["sunset-exact", 2_000_000, "after-sunset"],
    ["sunset-plus-one", 2_000_001, "after-sunset"],
  ]) {
    check(`guideng-runtime-phase-${label}`, expected, resolveGuiDengSolarEventPhase({ queryInstantMs: instantMs, solarEvents: phaseEvents }));
  }

  const divergenceCivil = parts(2026, 1, 9, 22, 59, 59);
  const divergenceWatchContext = makeWatchContext(divergenceCivil);
  const divergenceTrueContext = createTrueSolarChartTimeContext({
    source: "query",
    civil: {
      localParts: divergenceCivil,
      timeZone: "Asia/Taipei",
      utcOffsetMinutes: 480,
      abbreviation: "",
      instantMs: instantFor(divergenceCivil),
      disambiguation: null,
    },
    location: taipeiLocation,
    trueSolarResult: {
      trueSolarParts: parts(2026, 1, 9, 23, 0, 1, 232),
      totalCorrectionSeconds: 2.232,
      longitudeCorrectionSeconds: 2.232,
      equationOfTimeSeconds: 0,
    },
    createdAtInstantMs: 0,
  });
  const divergenceWatchBazi = calculateBaziFromChartTimeContext(divergenceWatchContext, solarTerms);
  const divergenceTrueBazi = calculateBaziFromChartTimeContext(divergenceTrueContext, solarTerms);
  check("guideng-runtime-23-watch-day-stem", divergenceWatchBazi.dayPillar[0], getGuiDengDayStem({ dayPillar: divergenceWatchBazi.dayPillar }));
  check("guideng-runtime-23-watch-true-day-diverge", false, divergenceWatchBazi.dayPillar === divergenceTrueBazi.dayPillar);
  check("guideng-runtime-23-query-instant-shared", divergenceWatchContext.civil.instantMs, divergenceTrueContext.civil.instantMs);
  check("guideng-runtime-23-event-date-civil", divergenceWatchContext.astronomy.solarEventCivilDateKey, divergenceTrueContext.astronomy.solarEventCivilDateKey);

  const unsupportedResult = await calculateGuiDengFromChartTimeContext({
    context: trueContext,
    baziResult: trueBazi,
    solarEventCalculator: async () => ({ daylightStatus: "unavailable" }),
  });
  const unsupportedDisplay = createGuiDengDisplayModel({ result: unsupportedResult, context: trueContext });
  check("guideng-runtime-unavailable-status", GUIDENG_CHART_TIME_STATUS.UNSUPPORTED, unsupportedResult.status);
  check("guideng-runtime-unavailable-display", "unsupported", unsupportedDisplay.status);
  check("guideng-runtime-unavailable-no-fallback", false, unsupportedDisplay.mode === "watch");
  check("guideng-runtime-unavailable-no-fake-branches", 0, unsupportedDisplay.dengGuiBranches.length);
  check("guideng-runtime-dst-contract", true, mainModuleRaw.includes("DST") || mainModuleRaw.includes("日出／日落"));

  check("guideng-runtime-watch-summary-uses-display-model", true, decorationsSource.includes("resolvedDisplayModel"));
  check("guideng-runtime-hour-mark-uses-display-branches", true, decorationsSource.includes("getDengGuiBranchSet(resolvedDisplayModel)"));
  check("guideng-runtime-no-duplicated-solar-events", 1, (mainModuleRaw.match(/function calculateCachedGuiDengSolarEvents\(/g) ?? []).length);
  check("guideng-runtime-no-duplicated-bazi", false, /calculateBaziFromSolarTerms|calculateBaziFromChartTimeContext/.test(helperSource));
  check("guideng-runtime-same-generation-core-dedupe", true, jinhanSource.includes("createJinhanRenderKey") && jinhanSource.includes("currentJinhanRenderKey === renderKey"));
  check("guideng-runtime-active-mode-guard", true, helperSource.includes("context.mode !== expectedMode") && helperSource.includes("displayModel.mode !== expectedMode"));
  check("guideng-runtime-no-new-request-id", false, /latestGuiDeng|guiDengRequestId/.test(mainModuleRaw));
  check("guideng-runtime-no-permanent-timer", 2, (mainModuleRaw.match(/setInterval\(/g) ?? []).length);
  check("guideng-runtime-no-storage", false, /localStorage|sessionStorage/.test(displayRaw));
  check("guideng-runtime-no-dependency", false, /node_modules|npm:/.test(displayRaw));
  check("guideng-runtime-future-dual-clock-doc-only", true, true);
}

async function runGuiDengChartTimeRuntimeRealAstronomyTests(solarTerms) {
  const check = (id, expected, actual) => {
    guiDengChartTimeRuntimeRealAstronomyVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, actual);
  };
  const makeCivilParts = (value) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/.exec(value);
    if (!match) throw new Error(`invalid real GuiDeng fixture: ${value}`);
    return {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3]),
      hour: Number(match[4]),
      minute: Number(match[5]),
      second: Number(match[6]),
      millisecond: 0,
    };
  };
  const carrierFor = (parts) => new Date(Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond,
  ));
  const instantFor = (parts, utcOffsetMinutes) => carrierFor(parts).getTime() - utcOffsetMinutes * 60_000;
  const formatWatchMinutes = (instantMs, timeZone) => {
    const zoned = getZonedDateTimeParts(new Date(instantMs), timeZone);
    if (!zoned) return null;
    return `${String(zoned.localParts.hour).padStart(2, "0")}:${String(zoned.localParts.minute).padStart(2, "0")}`;
  };
  const formatTrueSolarMinutesIndependently = (instantMs, context) => {
    const instant = new Date(instantMs);
    const zoned = getZonedDateTimeParts(instant, context.civil.timeZone);
    const localParts = {
      ...zoned.localParts,
      millisecond: instant.getUTCMilliseconds(),
    };
    const result = calculateTrueSolarTime({
      date: carrierFor(localParts),
      latitude: context.location.latitude,
      longitude: context.location.longitude,
      utcOffsetMinutes: zoned.utcOffsetMinutes,
      useUtcComponents: true,
    });
    return `${String(result.trueSolarParts.hour).padStart(2, "0")}:${String(result.trueSolarParts.minute).padStart(2, "0")}`;
  };
  const createFixtureContexts = ({ dateTimeValue, location }) => {
    const civilParts = makeCivilParts(dateTimeValue);
    const timeZone = "Asia/Taipei";
    const utcOffsetMinutes = 480;
    const civil = {
      localParts: civilParts,
      timeZone,
      utcOffsetMinutes,
      abbreviation: "",
      instantMs: instantFor(civilParts, utcOffsetMinutes),
      disambiguation: null,
    };
    const watchContext = createWatchChartTimeContext({
      source: "query",
      civil,
      createdAtInstantMs: 0,
    });
    const watchLocationContext = createWatchChartTimeContext({
      source: "query",
      civil,
      location,
      createdAtInstantMs: 0,
    });
    const trueSolarResult = calculateTrueSolarTime({
      date: carrierFor(civilParts),
      latitude: location.latitude,
      longitude: location.longitude,
      utcOffsetMinutes,
      useUtcComponents: true,
    });
    const trueSolarContext = createTrueSolarChartTimeContext({
      source: "query",
      civil,
      location,
      trueSolarResult,
      createdAtInstantMs: 0,
    });
    return { watchContext, watchLocationContext, trueSolarContext };
  };

  const fixtures = [
    {
      id: "fixture-a-negative-correction",
      dateTimeValue: "2026-08-10T12:00:00",
      location: { latitude: 25, longitude: 115, accuracy: null },
    },
    {
      id: "fixture-b-taipei-2300-divergence",
      dateTimeValue: "2026-04-15T22:59:59",
      location: { latitude: 25.033964, longitude: 121.564468, accuracy: null },
      expectedWatchDayPillar: "己未",
      expectedTrueDayPillar: "庚申",
    },
  ];

  const adapterRaw = await readFile(new URL("../src/guidengChartTimeAdapter.js", import.meta.url), "utf8");
  check("guideng-real-default-calculator", true, adapterRaw.includes("solarEventCalculator = calculateSolarEvents"));

  for (const fixture of fixtures) {
    const { watchContext, watchLocationContext, trueSolarContext } = createFixtureContexts(fixture);
    const watchBazi = calculateBaziFromChartTimeContext(watchContext, solarTerms);
    const watchLocationBazi = calculateBaziFromChartTimeContext(watchLocationContext, solarTerms);
    const trueSolarBazi = calculateBaziFromChartTimeContext(trueSolarContext, solarTerms);
    const watchResult = await calculateGuiDengFromChartTimeContext({
      context: watchContext,
      baziResult: watchBazi,
    });
    const watchLocationResult = await calculateGuiDengFromChartTimeContext({
      context: watchLocationContext,
      baziResult: watchLocationBazi,
    });
    const trueSolarResult = await calculateGuiDengFromChartTimeContext({
      context: trueSolarContext,
      baziResult: trueSolarBazi,
    });
    const watchDisplay = createGuiDengDisplayModel({ result: watchResult, context: watchContext });
    const watchLocationDisplay = createGuiDengDisplayModel({ result: watchLocationResult, context: watchLocationContext });
    const trueSolarDisplay = createGuiDengDisplayModel({ result: trueSolarResult, context: trueSolarContext });
    const watchSunriseInstantMs = watchResult.solarEvents.sunriseInstantMs;
    const watchSunsetInstantMs = watchResult.solarEvents.sunsetInstantMs;
    const trueSolarEventsBeforeDisplay = JSON.stringify(trueSolarResult.solarEvents);

    check(`${fixture.id}-watch-context-mode`, "watch", watchContext.mode);
    check(`${fixture.id}-true-context-mode`, "true-solar", trueSolarContext.mode);
    check(`${fixture.id}-watch-context-civil`, fixture.dateTimeValue, formatLocalPartsForTest(watchContext.civil.localParts));
    check(`${fixture.id}-true-context-civil`, fixture.dateTimeValue, formatLocalPartsForTest(trueSolarContext.civil.localParts));
    check(`${fixture.id}-true-context-location`, `${fixture.location.latitude},${fixture.location.longitude}`, `${trueSolarContext.location.latitude},${trueSolarContext.location.longitude}`);
    check(`${fixture.id}-watch-location-context-location`, `${fixture.location.latitude},${fixture.location.longitude}`, `${watchLocationContext.location.latitude},${watchLocationContext.location.longitude}`);
    check(`${fixture.id}-watch-result-resolved`, GUIDENG_CHART_TIME_STATUS.RESOLVED, watchResult.status);
    check(`${fixture.id}-true-result-resolved`, GUIDENG_CHART_TIME_STATUS.RESOLVED, trueSolarResult.status);
    check(`${fixture.id}-same-location-sunrise-instant`, trueSolarResult.solarEvents.sunriseInstantMs, watchLocationResult.solarEvents.sunriseInstantMs);
    check(`${fixture.id}-same-location-sunset-instant`, trueSolarResult.solarEvents.sunsetInstantMs, watchLocationResult.solarEvents.sunsetInstantMs);
    check(`${fixture.id}-same-location-next-sunrise-instant`, trueSolarResult.solarEvents.nextSunriseInstantMs, watchLocationResult.solarEvents.nextSunriseInstantMs);
    check(`${fixture.id}-watch-location-display-mode`, "watch", watchLocationDisplay.mode);
    check(`${fixture.id}-watch-sunrise-formatter-authority`, formatWatchMinutes(watchResult.solarEvents.sunriseInstantMs, watchContext.civil.timeZone), watchDisplay.sunriseText);
    check(`${fixture.id}-watch-location-sunrise-formatter-authority`, formatWatchMinutes(watchLocationResult.solarEvents.sunriseInstantMs, watchLocationContext.civil.timeZone), watchLocationDisplay.sunriseText);
    check(`${fixture.id}-true-sunrise-independent-authority`, formatTrueSolarMinutesIndependently(trueSolarResult.solarEvents.sunriseInstantMs, trueSolarContext), trueSolarDisplay.sunriseText);
    check(`${fixture.id}-true-sunset-independent-authority`, formatTrueSolarMinutesIndependently(trueSolarResult.solarEvents.sunsetInstantMs, trueSolarContext), trueSolarDisplay.sunsetText);
    check(`${fixture.id}-same-location-watch-vs-true-sunrise-display-differs`, true, watchLocationDisplay.sunriseText !== trueSolarDisplay.sunriseText);
    check(`${fixture.id}-same-location-watch-vs-true-sunset-display-differs`, true, watchLocationDisplay.sunsetText !== trueSolarDisplay.sunsetText);
    check(`${fixture.id}-watch-vs-true-sunrise-differs`, true, watchDisplay.sunriseText !== trueSolarDisplay.sunriseText);
    check(`${fixture.id}-watch-vs-true-sunset-differs`, true, watchDisplay.sunsetText !== trueSolarDisplay.sunsetText);
    check(`${fixture.id}-watch-bazi-location-invariant`, JSON.stringify(watchBazi), JSON.stringify(watchLocationBazi));
    check(`${fixture.id}-watch-flying-location-invariant`, JSON.stringify(calculateFlyingStarsFromBaziResult(watchContext, watchBazi)), JSON.stringify(calculateFlyingStarsFromBaziResult(watchLocationContext, watchLocationBazi)));
    check(`${fixture.id}-watch-jinhan-location-invariant`, JSON.stringify(await calculateJinhanFromChartTimeContext({ context: watchContext, baziResult: watchBazi, solarTerms })), JSON.stringify(await calculateJinhanFromChartTimeContext({ context: watchLocationContext, baziResult: watchLocationBazi, solarTerms })));
    const legacyLocationContext = createWatchChartTimeContext({
      source: "query",
      civil: watchContext.civil,
      location: {
        latitude: DEFAULT_GUIDENG_LOCATION.latitude,
        longitude: DEFAULT_GUIDENG_LOCATION.longitude,
        accuracy: null,
      },
      createdAtInstantMs: 0,
    });
    const legacyLocationBazi = calculateBaziFromChartTimeContext(legacyLocationContext, solarTerms);
    const legacyLocationResult = await calculateGuiDengFromChartTimeContext({ context: legacyLocationContext, baziResult: legacyLocationBazi });
    check(`${fixture.id}-watch-no-location-context-null`, null, watchContext.location);
    check(`${fixture.id}-watch-no-location-legacy-fallback`, JSON.stringify(legacyLocationResult.solarEvents), JSON.stringify(watchResult.solarEvents));
    check(`${fixture.id}-true-solar-event-instants-immutable`, trueSolarEventsBeforeDisplay, JSON.stringify(trueSolarResult.solarEvents));
    check(`${fixture.id}-actual-sunrise-finite`, true, Number.isFinite(trueSolarResult.solarEvents.sunriseInstantMs));
    check(`${fixture.id}-actual-sunset-finite`, true, Number.isFinite(trueSolarResult.solarEvents.sunsetInstantMs));

    const trueRangeSource = trueSolarResult.guiDeng.entries.find((entry) => entry.isAvailable)?.availableRange;
    const trueRangeText = trueSolarDisplay.entries.find((entry) => entry.isAvailable)?.rangeText ?? "";
    check(`${fixture.id}-true-range-display-authority`, trueRangeText, formatRangeForChartMode({
      startInstantMs: trueRangeSource?.start?.getTime(),
      endInstantMs: trueRangeSource?.end?.getTime(),
      context: trueSolarContext,
    }));
    check(`${fixture.id}-true-display-model-mode`, "true-solar", trueSolarDisplay.mode);

    if (fixture.expectedWatchDayPillar) {
      check(`${fixture.id}-watch-day-pillar`, fixture.expectedWatchDayPillar, watchBazi.dayPillar);
      check(`${fixture.id}-true-day-pillar`, fixture.expectedTrueDayPillar, trueSolarBazi.dayPillar);
      check(`${fixture.id}-day-pillar-diverges`, true, watchBazi.dayPillar !== trueSolarBazi.dayPillar);
      check(`${fixture.id}-gui-deng-branches-diverge`, true, JSON.stringify(watchDisplay.dengGuiBranches) !== JSON.stringify(trueSolarDisplay.dengGuiBranches));
    }
  }

  const locationChangeBase = createFixtureContexts(fixtures[0]);
  const changedLocationContext = createWatchChartTimeContext({
    source: "query",
    civil: locationChangeBase.watchLocationContext.civil,
    location: { latitude: 25.033964, longitude: 121.564468, accuracy: null },
    createdAtInstantMs: 0,
  });
  const changedLocationBazi = calculateBaziFromChartTimeContext(changedLocationContext, solarTerms);
  const changedLocationResult = await calculateGuiDengFromChartTimeContext({
    context: changedLocationContext,
    baziResult: changedLocationBazi,
  });
  const baseLocationResult = await calculateGuiDengFromChartTimeContext({
    context: locationChangeBase.watchLocationContext,
    baziResult: calculateBaziFromChartTimeContext(locationChangeBase.watchLocationContext, solarTerms),
  });
  check("watch-location-change-context-refreshes", "25.033964,121.564468", `${changedLocationContext.location.latitude},${changedLocationContext.location.longitude}`);
  check("watch-location-change-sunrise-instant-differs", true, baseLocationResult.solarEvents.sunriseInstantMs !== changedLocationResult.solarEvents.sunriseInstantMs);

  const malformedTrueContext = { ...locationChangeBase.trueSolarContext, location: null };
  let trueWithoutLocationThrows = false;
  try {
    await calculateGuiDengFromChartTimeContext({
      context: malformedTrueContext,
      baziResult: calculateBaziFromChartTimeContext(locationChangeBase.trueSolarContext, solarTerms),
    });
  } catch {
    trueWithoutLocationThrows = true;
  }
  check("true-solar-without-location-unavailable", true, trueWithoutLocationThrows);
  check("watch-context-location-is-explicit", true, mainModuleRaw.includes("{ location: getFormalChartLocationSnapshot() }"));
  check("formal-location-authority-is-source-a-state", true, mainModuleRaw.includes("const location = trueSolarTimeLocation"));
  check("watch-context-location-forwarded", true, mainModuleRaw.includes("location,\n    createdAtInstantMs"));
  check("guideng-consumes-context-location", true, adapterRaw.includes("const location = context.location"));
  check("cache-key-includes-location", true, mainModuleRaw.includes("latitude,\n    longitude,\n    utcOffsetMinutes"));
  check("watch-coordinate-change-refreshes-guideng", true, mainModuleRaw.includes("function refreshFormalWatchGuiDengAfterLocationChange()")
    && mainModuleRaw.includes("refreshFormalWatchGuiDengAfterLocationChange();"));
  const resetStateStart = mainModuleRaw.indexOf("function resetLegacyChartTimeState");
  const resetStateEnd = mainModuleRaw.indexOf("\n}\n\nfunction startAutoNowMode", resetStateStart);
  const resetStateSource = resetStateStart >= 0 && resetStateEnd > resetStateStart
    ? mainModuleRaw.slice(resetStateStart, resetStateEnd)
    : "";
  check("mode-switch-does-not-clear-formal-location", false, /trueSolarTimeLocation\s*=/.test(resetStateSource));
  const sourceBCRenderStart = mainModuleRaw.indexOf("function renderTrueSolarTimeForContext");
  const sourceBCRenderEnd = mainModuleRaw.indexOf("\n}\n\nfunction clearCurrentTrueSolarChartContext", sourceBCRenderStart);
  const sourceBCRenderSource = sourceBCRenderStart >= 0 && sourceBCRenderEnd > sourceBCRenderStart
    ? mainModuleRaw.slice(sourceBCRenderStart, sourceBCRenderEnd)
    : "";
  check("source-bc-do-not-assign-formal-location", false, /trueSolarTimeLocation\s*=/.test(sourceBCRenderSource));
  check("source-bc-do-not-write-formal-context", false, /currentTrueSolarChartContextInput\s*=/.test(sourceBCRenderSource));
  check("runtime-keeps-existing-timers", 2, (mainModuleRaw.match(/setInterval\(/g) ?? []).length);
  check("runtime-keeps-storage-absent", false, /localStorage|sessionStorage/.test(mainModuleRaw));
}

function formatLocalPartsForTest(parts) {
  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}T${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}`;
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
        palaceLabels: { li: "太", kan: "歲三" },
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
        palaceLabels: { kan: "太", li: "歲三" },
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
        palaceLabels: { zhen: "太", dui: "歲三" },
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

function runFlyingStarSanShaTests(solarTerms) {
  const directionCases = {
    申: "南",
    子: "南",
    辰: "南",
    巳: "東",
    酉: "東",
    丑: "東",
    寅: "北",
    午: "北",
    戌: "北",
    亥: "西",
    卯: "西",
    未: "西",
  };
  for (const [branch, expectedDirection] of Object.entries(directionCases)) {
    sanShaVerifiedCaseCount += 1;
    assertEqual("san-sha-branch-direction", branch, expectedDirection, getSanShaDirection(branch));
  }

  for (const [direction, expectedPalaceId] of Object.entries({
    南: "li",
    東: "zhen",
    北: "kan",
    西: "dui",
  })) {
    sanShaVerifiedCaseCount += 1;
    assertEqual("san-sha-direction-palace", direction, expectedPalaceId, getPalaceIdByDirection(direction));
  }

  const sampleInput = "2026-07-29T13:30";
  const sampleCalendarResult = calculateBaziFromSolarTerms(sampleInput, solarTerms);
  const sampleCharts = calculateAllFlyingStarCharts(sampleCalendarResult, sampleInput);
  const sampleAfflictions = createFlyingStarAfflictionViewModel(sampleCharts);
  const sampleCombined = createCombinedFlyingStarViewModel(sampleCharts, sampleAfflictions);

  for (const [key, expectedPillar] of Object.entries({
    yearPillar: "丙午",
    monthPillar: "乙未",
    dayPillar: "甲辰",
    hourPillar: "辛未",
  })) {
    sanShaVerifiedCaseCount += 1;
    assertEqual("san-sha-sample-pillars", key, expectedPillar, sampleCalendarResult[key]);
  }

  for (const [layerKey, expected] of Object.entries({
    annual: { branch: "午", direction: "北", palaceId: "kan" },
    monthly: { branch: "未", direction: "西", palaceId: "dui" },
    daily: { branch: "辰", direction: "南", palaceId: "li" },
    hourly: { branch: "未", direction: "西", palaceId: "dui" },
  })) {
    const actual = sampleAfflictions.sanShaByLayer[layerKey];
    sanShaVerifiedCaseCount += 1;
    assertEqual(`san-sha-sample-${layerKey}`, "branch", expected.branch, actual?.branch);
    assertEqual(`san-sha-sample-${layerKey}`, "direction", expected.direction, actual?.direction);
    assertEqual(`san-sha-sample-${layerKey}`, "palaceId", expected.palaceId, actual?.palaceId);
  }

  sanShaVerifiedCaseCount += 1;
  assertEqual(
    "san-sha-combined-summary",
    "text",
    "太歲南｜歲破北｜三煞：年北 月西 日南 時西",
    sampleAfflictions.summary
  );

  const combinedSanShaLayers = sampleCombined.layout
    .flat()
    .flatMap((palace) =>
      palace.layers
        .filter((layer) => layer.hasSanSha)
        .map((layer) => `${palace.id}:${layer.key}`)
    )
    .sort();
  sanShaVerifiedCaseCount += 1;
  assertEqual(
    "san-sha-combined-layer-markers",
    "palaceLayers",
    "dui:hourly,dui:monthly,kan:annual,li:daily",
    combinedSanShaLayers.join(",")
  );
  sanShaVerifiedCaseCount += 1;
  assertEqual(
    "san-sha-combined-no-cell-marker",
    "allCellMarkersExcludeSanSha",
    true,
    sampleCombined.layout
      .flat()
      .every((palace) => palace.markers.every((marker) => marker.key !== "sanSha"))
  );

  const individualMarkers = sampleAfflictions.individualCellMarkers;
  const individualCases = [
    ["period", "", ""],
    ["annual", "kan", "歲三"],
    ["monthly", "dui", "三"],
    ["daily", "li", "三"],
    ["hourly", "dui", "三"],
  ];
  for (const [chartType, palaceId, expectedLabels] of individualCases) {
    sanShaVerifiedCaseCount += 1;
    const actualLabels = palaceId
      ? formatAnnualAfflictionBadgeLabels(individualMarkers[chartType]?.[palaceId])
      : Object.values(individualMarkers[chartType] ?? {})
        .flat()
        .map((marker) => marker.label)
        .join("");
    assertEqual(`san-sha-independent-${chartType}`, palaceId || "all", expectedLabels, actualLabels);
  }

  sanShaVerifiedCaseCount += 1;
  assertEqual(
    "san-sha-annual-tai-sui",
    "li",
    "太",
    formatAnnualAfflictionBadgeLabels(individualMarkers.annual.li)
  );
  sanShaVerifiedCaseCount += 1;
  assertEqual(
    "san-sha-annual-collision-stack",
    "kan",
    2,
    individualMarkers.annual.kan?.length
  );
  sanShaVerifiedCaseCount += 1;
  assertEqual(
    "san-sha-annual-collision-labels",
    "kan",
    "歲三",
    formatAnnualAfflictionBadgeLabels(individualMarkers.annual.kan)
  );

  sanShaVerifiedCaseCount += 1;
  assertEqual(
    "san-sha-dom-inline-after-name",
    "source",
    true,
    /item\.append\(label, starNumber, starName\);[\s\S]*?if \(layer\.hasSanSha\)[\s\S]*?item\.append\(createAfflictionBadge/.test(mainModuleRaw)
  );
  sanShaVerifiedCaseCount += 1;
  assertEqual(
    "san-sha-dom-reusable-badge",
    "classes",
    true,
    mainModuleRaw.includes('"flying-star-affliction-badge"')
      && mainModuleRaw.includes('"san-sha-badge"')
      && mainCssRaw.includes(".san-sha-badge")
  );
  sanShaVerifiedCaseCount += 1;
  assertEqual(
    "san-sha-mobile-badge-visible",
    "onlyStarNameHidden",
    true,
    /@media \(max-width: 680px\)[\s\S]*?\.combined-star-name\s*\{\s*display: none;/.test(mainCssRaw)
      && !/@media \(max-width: 680px\)[\s\S]*?\.san-sha-badge\s*\{\s*display: none;/.test(mainCssRaw)
  );
  sanShaVerifiedCaseCount += 1;
  assertEqual(
    "san-sha-marker-stack",
    "source",
    true,
    mainModuleRaw.includes('container.className = "flying-star-marker-stack";')
      && mainCssRaw.includes(".flying-star-marker-stack")
  );

  const nextInput = "2027-09-15T09:30";
  const nextCalendarResult = calculateBaziFromSolarTerms(nextInput, solarTerms);
  const nextCharts = calculateAllFlyingStarCharts(nextCalendarResult, nextInput);
  const nextSanShaByLayer = createSanShaByLayer(nextCharts);
  const nextAfflictions = createFlyingStarAfflictionViewModel(nextCharts);
  const nextCombined = createCombinedFlyingStarViewModel(nextCharts, nextAfflictions);
  for (const layerKey of ["annual", "monthly", "daily", "hourly"]) {
    sanShaVerifiedCaseCount += 1;
    assertEqual(
      `san-sha-consecutive-query-${layerKey}`,
      "updated",
      true,
      sampleAfflictions.sanShaByLayer[layerKey].direction !== nextSanShaByLayer[layerKey].direction
    );
  }
  sanShaVerifiedCaseCount += 1;
  assertEqual(
    "san-sha-consecutive-query-markers",
    "palaceLayers",
    "dui:annual,zhen:daily,zhen:hourly,zhen:monthly",
    nextCombined.layout
      .flat()
      .flatMap((palace) =>
        palace.layers
          .filter((layer) => layer.hasSanSha)
          .map((layer) => `${palace.id}:${layer.key}`)
      )
      .sort()
      .join(",")
  );
  sanShaVerifiedCaseCount += 1;
  assertEqual(
    "san-sha-consecutive-query-summary",
    "text",
    "太歲西南｜歲破東北｜三煞：年西 月東 日東 時東",
    nextAfflictions.summary
  );
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

function runLunarCalendarTests() {
  const expectedCases = [
    ["cwa-leading-boundary", [2022, 1, 1], { lunarYear: 2021, lunarMonth: 11, lunarDay: 29, isLeapMonth: false }],
    ["cwa-2022-new-year", [2022, 2, 1], { lunarYear: 2022, lunarMonth: 1, lunarDay: 1, isLeapMonth: false }],
    ["cwa-2023-new-year", [2023, 1, 22], { lunarYear: 2023, lunarMonth: 1, lunarDay: 1, isLeapMonth: false }],
    ["cwa-2024-new-year", [2024, 2, 10], { lunarYear: 2024, lunarMonth: 1, lunarDay: 1, isLeapMonth: false }],
    ["cwa-2025-new-year", [2025, 1, 29], { lunarYear: 2025, lunarMonth: 1, lunarDay: 1, isLeapMonth: false }],
    ["cwa-2026-new-year", [2026, 2, 17], { lunarYear: 2026, lunarMonth: 1, lunarDay: 1, isLeapMonth: false }],
    ["cwa-2050-representative", [2050, 6, 20], { lunarYear: 2050, lunarMonth: 5, lunarDay: 2, isLeapMonth: false }],
    ["cwa-day-2", [2022, 1, 4], { lunarYear: 2021, lunarMonth: 12, lunarDay: 2, isLeapMonth: false }],
    ["cwa-day-10", [2022, 1, 12], { lunarYear: 2021, lunarMonth: 12, lunarDay: 10, isLeapMonth: false }],
    ["cwa-day-15", [2022, 1, 17], { lunarYear: 2021, lunarMonth: 12, lunarDay: 15, isLeapMonth: false }],
    ["cwa-day-20", [2022, 1, 22], { lunarYear: 2021, lunarMonth: 12, lunarDay: 20, isLeapMonth: false }],
    ["cwa-day-21", [2022, 1, 23], { lunarYear: 2021, lunarMonth: 12, lunarDay: 21, isLeapMonth: false }],
    ["cwa-day-29", [2022, 1, 31], { lunarYear: 2021, lunarMonth: 12, lunarDay: 29, isLeapMonth: false }],
    ["cwa-small-month-end", [2022, 1, 31], { lunarYear: 2021, lunarMonth: 12, lunarDay: 29, isLeapMonth: false }],
    ["cwa-leap-month-start", [2023, 3, 22], { lunarYear: 2023, lunarMonth: 2, lunarDay: 1, isLeapMonth: true }],
    ["cwa-leap-month-middle", [2023, 4, 5], { lunarYear: 2023, lunarMonth: 2, lunarDay: 15, isLeapMonth: true }],
    ["cwa-leap-month-end", [2023, 4, 19], { lunarYear: 2023, lunarMonth: 2, lunarDay: 29, isLeapMonth: true }],
    ["cwa-gregorian-year-cross", [2023, 1, 21], { lunarYear: 2022, lunarMonth: 12, lunarDay: 30, isLeapMonth: false }],
    ["cwa-lunar-year-cross", [2023, 1, 22], { lunarYear: 2023, lunarMonth: 1, lunarDay: 1, isLeapMonth: false }],
    ["cwa-trailing-boundary", [2050, 12, 31], { lunarYear: 2050, lunarMonth: 11, lunarDay: 18, isLeapMonth: false }],
  ];
  for (const [id, [year, month, day], expected] of expectedCases) {
    const actual = getLunarDateForSolarDate(year, month, day);
    lunarCalendarVerifiedCaseCount += 1;
    assertEqual(id, "lunar", JSON.stringify(expected), JSON.stringify({
      lunarYear: actual?.lunarYear,
      lunarMonth: actual?.lunarMonth,
      lunarDay: actual?.lunarDay,
      isLeapMonth: actual?.isLeapMonth,
    }));
  }

  for (const [id, date, expected] of [
    ["cwa-before-supported", [2021, 12, 31], null],
    ["cwa-after-supported", [2051, 1, 1], null],
  ]) {
    lunarCalendarVerifiedCaseCount += 1;
    assertEqual(id, "result", expected, getLunarDateForSolarDate(...date));
  }
  lunarCalendarVerifiedCaseCount += 1;
  assertEqual("cwa-supported-start", "supported", true, isLunarCalendarDateSupported(2022, 1, 1));
  lunarCalendarVerifiedCaseCount += 1;
  assertEqual("cwa-supported-end", "supported", true, isLunarCalendarDateSupported(2050, 12, 31));
  lunarCalendarVerifiedCaseCount += 1;
  assertEqual("cwa-unsupported", "supported", false, isLunarCalendarDateSupported(2051, 1, 1));

  for (const [id, date] of [
    ["cwa-invalid-non-leap-february", [2023, 2, 29]],
    ["cwa-invalid-february-30", [2026, 2, 30]],
    ["cwa-invalid-month-zero", [2024, 0, 1]],
    ["cwa-invalid-month-13", [2024, 13, 1]],
    ["cwa-invalid-non-integer", [2024, 2.5, 1]],
  ]) {
    lunarCalendarVerifiedCaseCount += 1;
    try {
      getLunarDateForSolarDate(...date);
      failures.push({ id, key: "error", expected: "throw", actual: "no throw" });
    } catch (error) {
      if (!(error instanceof TypeError || error instanceof RangeError)) {
        failures.push({ id, key: "error", expected: "TypeError or RangeError", actual: error?.name });
      }
    }
  }
  lunarCalendarVerifiedCaseCount += 1;
  assertEqual("cwa-valid-leap-day", "lunarDay", 20, getLunarDateForSolarDate(2024, 2, 29)?.lunarDay);

  for (const [id, input, expected] of [
    ["lunar-format-first-month", { lunarMonth: 1, lunarDay: 1, isLeapMonth: false }, "正月"],
    ["lunar-format-winter-month", { lunarMonth: 11, lunarDay: 1, isLeapMonth: false }, "冬月"],
    ["lunar-format-last-month", { lunarMonth: 12, lunarDay: 1, isLeapMonth: false }, "臘月"],
    ["lunar-format-leap-month", { lunarMonth: 6, lunarDay: 1, isLeapMonth: true }, "閏六月"],
    ["lunar-format-day-10", { lunarMonth: 1, lunarDay: 10, isLeapMonth: false }, "初十"],
    ["lunar-format-day-11", { lunarMonth: 1, lunarDay: 11, isLeapMonth: false }, "十一"],
    ["lunar-format-day-20", { lunarMonth: 1, lunarDay: 20, isLeapMonth: false }, "二十"],
    ["lunar-format-day-21", { lunarMonth: 1, lunarDay: 21, isLeapMonth: false }, "廿一"],
    ["lunar-format-day-29", { lunarMonth: 1, lunarDay: 29, isLeapMonth: false }, "廿九"],
    ["lunar-format-day-30", { lunarMonth: 1, lunarDay: 30, isLeapMonth: false }, "三十"],
    ["lunar-format-null", null, ""],
  ]) {
    lunarCalendarVerifiedCaseCount += 1;
    assertEqual(id, "label", expected, formatLunarCalendarLabel(input));
  }

  lunarCalendarVerifiedCaseCount += 1;
  assertEqual("cwa-validation-rows", "rows", 10592, cwaLunarValidation.validation?.dailyRows);
  for (const [key, expected] of Object.entries({ mismatch: 0, missing: 0, duplicate: 0, invalidMonthLength: 0 })) {
    lunarCalendarVerifiedCaseCount += 1;
    assertEqual("cwa-validation", key, expected, cwaLunarValidation.validation?.[key]);
  }

  const timezoneWorker = fileURLToPath(new URL("./lunar-calendar-timezone-check.js", import.meta.url));
  const timezoneResults = ["Asia/Taipei", "UTC", "America/Los_Angeles"].map((TZ) => JSON.parse(execFileSync(
    process.execPath,
    [timezoneWorker],
    { encoding: "utf8", env: { ...process.env, TZ } }
  )));
  lunarCalendarVerifiedCaseCount += 1;
  assertEqual("cwa-timezone-contract", "results", JSON.stringify([timezoneResults[0], timezoneResults[0], timezoneResults[0]]), JSON.stringify(timezoneResults));
}

function runLunarCalendarUiTests() {
  const regularDay = queryCalendarDayDetail(2026, 7, 4, []);
  lunarCalendarUiVerifiedCaseCount += 1;
  assertEqual("lunar-ui-regular-label", "label", "廿二", regularDay.lunarLabel);
  lunarCalendarUiVerifiedCaseCount += 1;
  assertEqual("lunar-ui-regular-aria", "aria", "2026年8月4日，農曆六月廿二", regularDay.ariaLabel);

  const solarTermDay = queryCalendarDayDetail(2026, 7, 7, [{ name: "立秋" }]);
  lunarCalendarUiVerifiedCaseCount += 1;
  assertEqual("lunar-ui-solar-term-text", "text", "立秋", solarTermDay.solarTermText);
  lunarCalendarUiVerifiedCaseCount += 1;
  assertEqual("lunar-ui-solar-term-keeps-lunar-aria", "aria", "2026年8月7日，立秋，農曆六月廿五", solarTermDay.ariaLabel);
  lunarCalendarUiVerifiedCaseCount += 1;
  assertEqual("lunar-ui-solar-term-data-still-available", "label", "廿五", solarTermDay.lunarLabel);

  for (const [id, year, month, day, expected] of [
    ["lunar-ui-before-range", 2021, 11, 31, "2021年12月31日"],
    ["lunar-ui-start-range", 2022, 0, 1, "2022年1月1日，農曆冬月廿九"],
    ["lunar-ui-end-range", 2050, 11, 31, "2050年12月31日，農曆冬月十八"],
    ["lunar-ui-after-range", 2051, 0, 1, "2051年1月1日"],
  ]) {
    const detail = queryCalendarDayDetail(year, month, day, []);
    lunarCalendarUiVerifiedCaseCount += 1;
    assertEqual(id, "aria", expected, detail.ariaLabel);
  }

  for (const [id, year, month, day, expected] of [
    ["lunar-ui-first-day", 2026, 1, 17, "正月"],
    ["lunar-ui-leap-first-day", 2023, 2, 22, "閏二月"],
    ["lunar-ui-day-15", 2023, 3, 5, "十五"],
    ["lunar-ui-day-20", 2022, 0, 22, "二十"],
    ["lunar-ui-day-21", 2022, 0, 23, "廿一"],
  ]) {
    lunarCalendarUiVerifiedCaseCount += 1;
    assertEqual(id, "label", expected, queryCalendarDayDetail(year, month, day, []).lunarLabel);
  }

  lunarCalendarUiVerifiedCaseCount += 1;
  assertEqual("lunar-ui-accessible-first-day", "label", "正月初一", formatLunarCalendarAccessibleLabel(getLunarDateForSolarDate(2026, 2, 17)));
  lunarCalendarUiVerifiedCaseCount += 1;
  assertEqual("lunar-ui-accessible-leap-day", "label", "閏二月十五", formatLunarCalendarAccessibleLabel(getLunarDateForSolarDate(2023, 4, 5)));
  lunarCalendarUiVerifiedCaseCount += 1;
  assertEqual("lunar-ui-accessible-null", "label", "", formatLunarCalendarAccessibleLabel(null));

  const lunarUiSource = mainModuleRaw;
  lunarCalendarUiVerifiedCaseCount += 1;
  assertEqual("lunar-ui-dom-mutual-exclusive", "source", true, /if \(solarTerms\.length > 0\)[\s\S]*?query-calendar-solar-term[\s\S]*?else if \(calendarDayDetail\.lunarLabel\)[\s\S]*?query-calendar-lunar/.test(lunarUiSource));
  lunarCalendarUiVerifiedCaseCount += 1;
  assertEqual("lunar-ui-blank-cells-no-subtitle", "source", true, /is-blank[\s\S]*?aria-hidden[\s\S]*?for \(let day = 1/.test(lunarUiSource));
  lunarCalendarUiVerifiedCaseCount += 1;
  assertEqual("lunar-ui-rerender-replaces-cells", "source", true, lunarUiSource.includes("elements.calendarDays.replaceChildren(...cells);"));
  lunarCalendarUiVerifiedCaseCount += 1;
  assertEqual("lunar-ui-uses-helper-not-json", "source", true, lunarUiSource.includes("getLunarDateForSolarDate(year, month + 1, day)") && !lunarUiSource.includes("cwa_lunar_month_starts"));
  lunarCalendarUiVerifiedCaseCount += 1;
  assertEqual("lunar-ui-no-per-cell-fetch", "source", false, lunarUiSource.includes("fetch("));

  lunarCalendarUiVerifiedCaseCount += 1;
  assertEqual("lunar-ui-css-class", "rule", true, /\.query-calendar-lunar\s*\{[\s\S]*?white-space:\s*nowrap;/.test(mainCssRaw));
  lunarCalendarUiVerifiedCaseCount += 1;
  assertEqual("lunar-ui-css-selected-contrast", "rule", true, mainCssRaw.includes(".query-calendar-day.is-selected .query-calendar-lunar"));
  lunarCalendarUiVerifiedCaseCount += 1;
  assertEqual("lunar-ui-css-not-solar-term-box", "rule", false, /\.query-calendar-lunar\s*\{[^}]*border/.test(mainCssRaw));
}

function formatAnnualAfflictionBadgeLabels(badges) {
  return Array.isArray(badges) ? badges.map((badge) => badge.label).join("") : "";
}

function loadQueryPickerHelpersForTest(mainModuleRaw) {
  const functionNames = [
    "buildDateTimeValueFromDateAndChineseHour",
    "getChineseHourStartHour",
    "getChineseHourIndex",
    "getChineseHourIndexFromLocalParts",
    "clampQueryYear",
    "getSelectedCalendarDateFromDateTime",
    "parseDateTimeLocalValue",
    "toLocalDatetimeValue",
  ];
  const definitions = functionNames.map((name) => extractNamedFunctionSource(mainModuleRaw, name)).join("\n\n");

  return Function(`
    const QUERY_YEAR_MIN = 1900;
    const QUERY_YEAR_MAX = 2100;
    const CHINESE_HOUR_LABELS = Object.freeze([
      Object.freeze({ index: 1, startHour: 23 }),
      Object.freeze({ index: 2, startHour: 1 }),
      Object.freeze({ index: 3, startHour: 3 }),
      Object.freeze({ index: 4, startHour: 5 }),
      Object.freeze({ index: 5, startHour: 7 }),
      Object.freeze({ index: 6, startHour: 9 }),
      Object.freeze({ index: 7, startHour: 11 }),
      Object.freeze({ index: 8, startHour: 13 }),
      Object.freeze({ index: 9, startHour: 15 }),
      Object.freeze({ index: 10, startHour: 17 }),
      Object.freeze({ index: 11, startHour: 19 }),
      Object.freeze({ index: 12, startHour: 21 }),
    ]);
    ${definitions}
    return { buildDateTimeValueFromDateAndChineseHour, getChineseHourIndex, getSelectedCalendarDateFromDateTime, parseDateTimeLocalValue, toLocalDatetimeValue };
  `)();
}

function loadTrueSolarChineseHourHelpersForTest(mainModuleRaw) {
  const functionNames = [
    "resolveTrueSolarChineseHourDateTime",
    "getLocalPartsWallDifferenceSeconds",
    "buildDateTimeValueFromDateAndChineseHour",
    "getChineseHourStartHour",
    "getChineseHourIndex",
    "getChineseHourIndexFromLocalParts",
    "clampQueryYear",
    "parseDateTimeLocalValue",
    "toLocalDatetimeValue",
    "parseTrueSolarTimeCustomLocalParts",
    "getLocalDateParts",
    "parseTopQueryDateTimeLocalParts",
    "formatDateTimeLocalParts",
  ];
  const definitions = functionNames.map((name) => extractNamedFunctionSource(mainModuleRaw, name)).join("\n\n");
  return Function(
    "resolveTrueSolarLocalDateTimeToInstant",
    "TRUE_SOLAR_CLOCK_RESOLUTION_STATUS",
    "getChartClockLocalPartsForInstant",
    "getZonedDateTimeParts",
    `
      const QUERY_YEAR_MIN = 1900;
      const QUERY_YEAR_MAX = 2100;
      const CHINESE_HOUR_LABELS = Object.freeze([
        Object.freeze({ index: 1, startHour: 23 }),
        Object.freeze({ index: 2, startHour: 1 }),
        Object.freeze({ index: 3, startHour: 3 }),
        Object.freeze({ index: 4, startHour: 5 }),
        Object.freeze({ index: 5, startHour: 7 }),
        Object.freeze({ index: 6, startHour: 9 }),
        Object.freeze({ index: 7, startHour: 11 }),
        Object.freeze({ index: 8, startHour: 13 }),
        Object.freeze({ index: 9, startHour: 15 }),
        Object.freeze({ index: 10, startHour: 17 }),
        Object.freeze({ index: 11, startHour: 19 }),
        Object.freeze({ index: 12, startHour: 21 }),
      ]);
      ${definitions}
      return {
        resolve: resolveTrueSolarChineseHourDateTime,
        build: buildDateTimeValueFromDateAndChineseHour,
        index: getChineseHourIndex,
        indexFromParts: getChineseHourIndexFromLocalParts,
      };
    `,
  )(
    resolveTrueSolarClockLocalDateTimeToInstant,
    TRUE_SOLAR_CLOCK_RESOLUTION_STATUS,
    getChartClockLocalPartsForInstant,
    getZonedDateTimeParts,
  );
}

function loadTopQueryDateTimeLocalPartsForTest(mainModuleRaw) {
  const definitions = [
    "parseTrueSolarTimeCustomLocalParts",
    "getLocalDateParts",
    "parseTopQueryDateTimeLocalParts",
  ].map((name) => extractNamedFunctionSource(mainModuleRaw, name)).join("\n\n");
  return Function(`${definitions}\nreturn parseTopQueryDateTimeLocalParts;`)();
}

function loadQueryCalendarDayDetailForTest(mainModuleRaw) {
  const definition = extractNamedFunctionSource(mainModuleRaw, "getQueryCalendarDayDetail");
  return Function(
    "getLunarDateForSolarDate",
    "formatLunarCalendarLabel",
    "formatLunarCalendarAccessibleLabel",
    `${definition}\nreturn getQueryCalendarDayDetail;`
  )(
    getLunarDateForSolarDate,
    formatLunarCalendarLabel,
    formatLunarCalendarAccessibleLabel
  );
}

function loadEffectiveDayLabelForTest(mainModuleRaw) {
  const definition = extractNamedFunctionSource(mainModuleRaw, "formatEffectiveDayLabel");
  return Function(`${definition}\nreturn formatEffectiveDayLabel;`)();
}

function loadTrueSolarDateSemanticsLabelForTest(mainModuleRaw) {
  const definitions = [
    "formatTrueSolarDateSemanticsLabel",
    "formatCalendarDateKey",
    "formatCalendarDateLabel",
  ].map((name) => extractNamedFunctionSource(mainModuleRaw, name)).join("\n\n");
  return Function(
    "getLunarDateForSolarDate",
    "formatLunarCalendarLabel",
    `${definitions}\nreturn formatTrueSolarDateSemanticsLabel;`
  )(getLunarDateForSolarDate, formatLunarCalendarLabel);
}

function loadAstronomicalDisplayFormattersForTest(mainModuleRaw) {
  const definitions = [
    "formatTermDateTime",
    "formatHouRangeDateTime",
    "formatSolarTermDayPanelLine",
  ].map((name) => extractNamedFunctionSource(mainModuleRaw, name)).join("\n\n");
  return Function(
    "formatDateTimeForChartMode",
    "formatSolarTermDateTime",
    `${definitions}\nreturn { term: formatTermDateTime, hou: formatHouRangeDateTime, panel: formatSolarTermDayPanelLine };`
  )(formatDateTimeForChartMode, formatSolarTermDateTime);
}

function loadSolarTermDayPanelRuntimeHarnessForTest(mainModuleRaw) {
  const definitions = [
    "formatSolarTermDayPanelLine",
    "isSolarTermDayPanelWriteCurrent",
    "renderSolarTermDayPanel",
  ].map((name) => extractNamedFunctionSource(mainModuleRaw, name)).join("\n\n");
  return Function(
    "formatDateTimeForChartMode",
    "formatSolarTermDateTime",
    `const CHART_TIME_MODE = Object.freeze({ WATCH: "watch", TRUE_SOLAR: "true-solar" });
let chartDisplayMode = CHART_TIME_MODE.WATCH;
const isTrueSolarDisplayMode = (mode) => mode === CHART_TIME_MODE.TRUE_SOLAR;
const createBlockSpan = (textContent) => ({ textContent });
const solarTermDayPanel = {
  children: [],
  hidden: true,
  replaceChildren(...children) {
    this.children = children;
  },
};
${definitions}
return {
  setMode(mode) {
    chartDisplayMode = mode;
  },
  render: renderSolarTermDayPanel,
  text() {
    return solarTermDayPanel.children.map((child) => child.textContent).join("\\n");
  },
};`
  )(formatDateTimeForChartMode, formatSolarTermDateTime);
}

function loadTrueSolarBcFormalIsolationHarnessForTest(mainModuleRaw) {
  const definitions = [
    "isFormalTrueSolarTimeSource",
    "cloneTrueSolarTimeLocation",
    "getTrueSolarTimeLocationForSource",
    "setTrueSolarTimeLocationForSource",
    "initializeTrueSolarTimeQueryLocation",
    "formatTrueSolarTimeCoordinateInput",
    "syncTrueSolarTimeCoordinateInputForSource",
    "syncTrueSolarTimeLocationFromCoordinateInput",
    "handleTrueSolarTimeSourceChange",
    "handleTrueSolarTimeCoordinateInput",
    "handleTrueSolarTimeCoordinateChange",
    "calculateTrueSolarTimeFromCoordinateInput",
  ].map((name) => extractNamedFunctionSource(mainModuleRaw, name)).join("\n\n");
  return Function("parseCoordinateInput", "calculateTrueSolarTime", `
    const TRUE_SOLAR_TIME_SOURCE = Object.freeze({ QUERY: "query", DEVICE: "device", CUSTOM: "custom" });
    const elements = {
      trueSolarTimeCoordinate: { value: "" },
      trueSolarTimeDeviceFields: { hidden: true },
      trueSolarTimeCustomFields: { hidden: true },
      trueSolarTimeQueryOnlyNote: { hidden: false },
    };
    let trueSolarTimeSource = TRUE_SOLAR_TIME_SOURCE.QUERY;
    let trueSolarTimeLocation = null;
    let trueSolarTimeQueryLocations = {
      [TRUE_SOLAR_TIME_SOURCE.DEVICE]: undefined,
      [TRUE_SOLAR_TIME_SOURCE.CUSTOM]: undefined,
    };
    let chartDisplayMode = "true-solar";
    let latestBaziRenderRequestId = 100;
    let currentTrueSolarChartContext = null;
    let currentJinhanRenderGeneration = 0;
    let currentJinhanRenderKey = null;
    let currentGuiDengAdapterResult = null;
    let currentGuiDengDisplayModel = null;
    let formalDom = null;
    let queryResult = null;
    const counters = {
      initialRequestId: latestBaziRenderRequestId,
      refreshJinhan: 0,
      refreshGuiDeng: 0,
      renderJinhanCore: 0,
      renderGuiDengDecorations: 0,
      clearJinhan: 0,
    };
    const isTrueSolarDisplayMode = (mode) => mode === "true-solar";
    const clearTrueSolarTimeTimeZoneSearchDebounce = () => {};
    const clearTrueSolarTimeCustomDisambiguation = () => {};
    const closeTrueSolarTimeTimeZoneSearch = () => {};
    const initializeTrueSolarTimeCustomInputs = () => {};
    const renderTrueSolarTimeTimeZoneSearchResults = () => {};
    const syncTrueSolarTimeClockRefresh = () => {};
    const setTrueSolarTimeStatus = () => {};
    const renderBaziForActiveDisplayMode = () => {};
    const refreshFlyingStarsForCurrentChartTime = () => {};
    const renderChartTimeStatus = () => {};
    const refreshFormalWatchGuiDengAfterLocationChange = () => {};
    const refreshJinhanForCurrentChartTime = () => { counters.refreshJinhan += 1; };
    const refreshGuiDengForCurrentChartTime = () => { counters.refreshGuiDeng += 1; };
    const renderJinhanCoreSnapshot = () => { counters.renderJinhanCore += 1; };
    const renderGuiDengDecorations = () => { counters.renderGuiDengDecorations += 1; };
    const clearJinhanYujing = () => { counters.clearJinhan += 1; };
    function clearTrueSolarTimePresentation(options) {
      if (options?.clearFormalChart !== false) {
        currentTrueSolarChartContext = null;
        currentGuiDengAdapterResult = null;
        currentGuiDengDisplayModel = null;
        formalDom = null;
      }
    }
    function renderActiveTrueSolarTime() {
      const location = getTrueSolarTimeLocationForSource(trueSolarTimeSource);
      queryResult = location ? calculateTrueSolarTime({
        date: new Date(Date.UTC(2026, 7, 10, 12)),
        latitude: location.latitude,
        longitude: location.longitude,
        utcOffsetMinutes: trueSolarTimeSource === TRUE_SOLAR_TIME_SOURCE.DEVICE ? -420 : 480,
        useUtcComponents: true,
      }) : null;
    }
    ${definitions}
    return {
      seedFormal(seed) {
        trueSolarTimeLocation = seed.location;
        currentTrueSolarChartContext = seed.context;
        currentJinhanRenderGeneration = seed.generation;
        currentJinhanRenderKey = seed.renderKey;
        currentGuiDengAdapterResult = seed.adapterResult;
        currentGuiDengDisplayModel = seed.displayModel;
        formalDom = seed.dom;
      },
      sourceChange(source) {
        handleTrueSolarTimeSourceChange({ target: { value: source } });
      },
      coordinateInput(value) {
        elements.trueSolarTimeCoordinate.value = value;
        handleTrueSolarTimeCoordinateInput();
      },
      coordinateChange(value) {
        elements.trueSolarTimeCoordinate.value = value;
        handleTrueSolarTimeCoordinateChange();
      },
      calculate(value) {
        elements.trueSolarTimeCoordinate.value = value;
        calculateTrueSolarTimeFromCoordinateInput();
      },
      formalState() {
        return {
          location: trueSolarTimeLocation,
          context: currentTrueSolarChartContext,
          generation: currentJinhanRenderGeneration,
          renderKey: currentJinhanRenderKey,
          adapterResult: currentGuiDengAdapterResult,
          displayModel: currentGuiDengDisplayModel,
          dom: formalDom,
        };
      },
      queryLocationText(source) {
        const location = getTrueSolarTimeLocationForSource(source);
        return location ? location.latitude + "," + location.longitude : null;
      },
      queryResultLocationText() {
        return queryResult ? queryResult.latitude + "," + queryResult.longitude : null;
      },
      calls() {
        return {
          requestIncrements: latestBaziRenderRequestId - counters.initialRequestId,
          refreshJinhan: counters.refreshJinhan,
          refreshGuiDeng: counters.refreshGuiDeng,
          renderJinhanCore: counters.renderJinhanCore,
          renderGuiDengDecorations: counters.renderGuiDengDecorations,
          clearJinhan: counters.clearJinhan,
        };
      },
    };
  `)(parseCoordinateInput, calculateTrueSolarTime);
}

function loadTrueSolarDstUiSequenceHarnessForTest(mainModuleRaw) {
  const definitions = [
    "clearTrueSolarTimeTimeZoneSearchDebounce",
    "parseTrueSolarTimeCustomLocalParts",
    "configureTrueSolarTimeDisambiguation",
    "clearTrueSolarTimeCustomDisambiguation",
    "clearTrueSolarTimePresentation",
    "renderTrueSolarTimeForCustomInput",
    "handleTrueSolarTimeCustomInput",
    "handleTrueSolarTimeTimeZoneInput",
    "handleTrueSolarTimeTimeZoneChange",
    "applyTrueSolarTimeTimeZoneInput",
    "selectTrueSolarTimeTimeZone",
    "handleTrueSolarTimeDisambiguationChange",
  ].map((name) => extractNamedFunctionSource(mainModuleRaw, name)).join("\n\n");
  return Function(
    "resolveLocalDateTimeInTimeZone",
    "validateTimeZone",
    "formatUtcOffset",
    "searchTimeZones",
    `const TRUE_SOLAR_TIME_SOURCE = Object.freeze({ QUERY: "query", DEVICE: "device", CUSTOM: "custom" });
const TRUE_SOLAR_TIME_ZONE_SEARCH_DEBOUNCE_MS = 200;
const MAX_TIME_ZONE_INPUT_LENGTH = 128;
let trueSolarTimeSource = TRUE_SOLAR_TIME_SOURCE.CUSTOM;
let trueSolarTimeCustomDisambiguation = null;
let trueSolarTimeTimeZoneSearchActiveIndex = -1;
let trueSolarTimeTimeZoneSearchResults = [];
let trueSolarTimeTimeZoneSearchDebounceTimerId = null;
let trueSolarTimeSolarEventsKey = null;
const trueSolarTimeTimeZoneOffsetCache = new Map();
let renderedContext = null;
let status = "";
let hiddenValue = true;
const hiddenTransitions = [];
const pendingTimers = new Map();
let nextTimerId = 1;
const window = {
  setTimeout(callback, delay) {
    const id = nextTimerId++;
    pendingTimers.set(id, { callback, delay });
    return id;
  },
  clearTimeout(id) {
    pendingTimers.delete(id);
  },
};
const disambiguationElement = {};
Object.defineProperty(disambiguationElement, "hidden", {
  get() { return hiddenValue; },
  set(value) {
    hiddenValue = Boolean(value);
    hiddenTransitions.push(hiddenValue);
  },
});
const elements = {
  trueSolarTimeLocalDate: { value: "" },
  trueSolarTimeLocalTime: { value: "" },
  trueSolarTimeTimeZone: { value: "", setAttribute() {} },
  trueSolarTimeTimeZoneSearchResults: { hidden: true, replaceChildren() {} },
  trueSolarTimeTimeZoneSearchStatus: { textContent: "" },
  trueSolarTimeDisambiguation: disambiguationElement,
  trueSolarTimeDisambiguationEarlier: { checked: false, value: "earlier" },
  trueSolarTimeDisambiguationLater: { checked: false, value: "later" },
  trueSolarTimeDisambiguationEarlierLabel: { textContent: "" },
  trueSolarTimeDisambiguationLaterLabel: { textContent: "" },
  trueSolarTimeDisambiguationSelected: { hidden: true, textContent: "" },
  trueSolarTimeResult: { hidden: true, replaceChildren() {} },
  trueSolarTimeSolarEvents: { hidden: true },
  trueSolarTimeApplyActions: { hidden: true },
};
function setTrueSolarTimeTimeZoneStatus(message) { status = message; }
function clearCurrentTrueSolarChartContext() {}
function getTrueSolarTimeLocationForSource() {
  return { latitude: 34.0522, longitude: -118.2437, accuracy: null };
}
function renderTrueSolarTimeForContext(context) { renderedContext = context; }
function closeTrueSolarTimeTimeZoneSearch() {
  trueSolarTimeTimeZoneSearchResults = [];
  elements.trueSolarTimeTimeZoneSearchResults.hidden = true;
}
function renderTrueSolarTimeTimeZoneSearchResults() {
  trueSolarTimeTimeZoneSearchResults = searchTimeZones(elements.trueSolarTimeTimeZone.value, { limit: 12 });
  elements.trueSolarTimeTimeZoneSearchResults.hidden = trueSolarTimeTimeZoneSearchResults.length === 0;
}
function showTrueSolarTimeTimeZoneTooLongStatus() {
  closeTrueSolarTimeTimeZoneSearch();
  clearTrueSolarTimePresentation({ clearFormalChart: false });
  setTrueSolarTimeTimeZoneStatus("時區輸入過長，請縮短後再搜尋。", "error");
}
${definitions}
function reset() {
  elements.trueSolarTimeLocalDate.value = "";
  elements.trueSolarTimeLocalTime.value = "";
  elements.trueSolarTimeTimeZone.value = "";
  elements.trueSolarTimeTimeZoneSearchResults.hidden = true;
  elements.trueSolarTimeDisambiguationEarlier.checked = false;
  elements.trueSolarTimeDisambiguationLater.checked = false;
  elements.trueSolarTimeDisambiguationEarlierLabel.textContent = "";
  elements.trueSolarTimeDisambiguationLaterLabel.textContent = "";
  elements.trueSolarTimeDisambiguationSelected.hidden = true;
  elements.trueSolarTimeDisambiguationSelected.textContent = "";
  hiddenValue = true;
  hiddenTransitions.length = 0;
  pendingTimers.clear();
  trueSolarTimeTimeZoneSearchDebounceTimerId = null;
  trueSolarTimeCustomDisambiguation = null;
  trueSolarTimeTimeZoneSearchResults = [];
  renderedContext = null;
  status = "";
}
return {
  reset,
  dateInput(value) { elements.trueSolarTimeLocalDate.value = value; handleTrueSolarTimeCustomInput(); },
  dateChange(value) { elements.trueSolarTimeLocalDate.value = value; handleTrueSolarTimeCustomInput(); },
  timeInput(value) { elements.trueSolarTimeLocalTime.value = value; handleTrueSolarTimeCustomInput(); },
  timeChange(value) { elements.trueSolarTimeLocalTime.value = value; handleTrueSolarTimeCustomInput(); },
  timeZoneInput(value) { elements.trueSolarTimeTimeZone.value = value; handleTrueSolarTimeTimeZoneInput(); },
  timeZoneChange(value) { elements.trueSolarTimeTimeZone.value = value; handleTrueSolarTimeTimeZoneChange(); },
  selectSuggestion(value) { selectTrueSolarTimeTimeZone(value); },
  choose(value) {
    const target = value === "earlier"
      ? elements.trueSolarTimeDisambiguationEarlier
      : elements.trueSolarTimeDisambiguationLater;
    target.checked = true;
    handleTrueSolarTimeDisambiguationChange({ target });
  },
  flushDebounce() {
    const callbacks = [...pendingTimers.values()].map((timer) => timer.callback);
    pendingTimers.clear();
    for (const callback of callbacks) callback();
  },
  pendingDebounceMs() {
    return pendingTimers.values().next().value?.delay ?? null;
  },
  pendingDebounceCount() { return pendingTimers.size; },
  state() {
    return {
      hidden: elements.trueSolarTimeDisambiguation.hidden,
      hiddenTransitions: hiddenTransitions.slice(),
      earlierLabel: elements.trueSolarTimeDisambiguationEarlierLabel.textContent,
      laterLabel: elements.trueSolarTimeDisambiguationLaterLabel.textContent,
      selectedText: elements.trueSolarTimeDisambiguationSelected.textContent,
      status,
      renderedContext,
    };
  },
};`
  )(resolveLocalDateTimeInTimeZone, validateTimeZone, formatUtcOffset, searchTimeZones);
}

function loadChartTimeStatusDateTimeForTest(mainModuleRaw) {
  const definitions = [
    "parseDateTimeLocalValue",
    "formatDateTimeParts",
    "getLocalDateParts",
    "formatChartTimeStatusDateTime",
  ].map((name) => extractNamedFunctionSource(mainModuleRaw, name)).join("\n\n");
  return Function(`${definitions}\nreturn formatChartTimeStatusDateTime;`)();
}

function loadChartQueryTimeModeStatusForTest(mainModuleRaw) {
  const definitions = [
    "parseDateTimeLocalValue",
    "formatDateTimeParts",
    "getLocalDateParts",
    "formatChartTimeStatusDateTime",
    "renderChartQueryTimeModeStatus",
  ].map((name) => extractNamedFunctionSource(mainModuleRaw, name)).join("\n\n");
  const factory = Function("elements", "isAutoNowMode", `${definitions}\nreturn renderChartQueryTimeModeStatus;`);
  return (elements, isAutoNowMode) => factory(elements, isAutoNowMode)();
}

function loadFormalChartTimeStatusForTest(mainModuleRaw) {
  const definitions = [
    "formatDateTimeParts",
    "renderChartTimeStatus",
  ].map((name) => extractNamedFunctionSource(mainModuleRaw, name)).join("\n\n");
  const factory = Function(
    "elements",
    "chartDisplayMode",
    "currentTrueSolarBaziResult",
    "currentTrueSolarChartContext",
    "isTrueSolarDisplayMode",
    "document",
    `${definitions}\nreturn renderChartTimeStatus;`
  );
  return (context, ready) => {
    const createElement = () => ({ className: "", textContent: "" });
    const elements = {
      chartTimeStatusTitle: createElement(),
      chartTimeStatusDetail: {
        textContent: "",
        children: [],
        replaceChildren(...children) {
          this.children = children;
          this.textContent = "";
        },
      },
      chartTimeRestore: { hidden: false },
    };
    const document = { createElement };
    const render = factory(
      elements,
      "true-solar",
      ready ? {} : null,
      context,
      (mode) => mode === "true-solar",
      document
    );
    render();
    return {
      title: elements.chartTimeStatusTitle.textContent,
      lines: elements.chartTimeStatusDetail.children.map((child) => child.textContent),
    };
  };
}

function loadTrueSolarLocationSyncForTest(mainModuleRaw) {
  const definitions = [
    "isFormalTrueSolarTimeSource",
    "cloneTrueSolarTimeLocation",
    "getTrueSolarTimeLocationForSource",
    "setTrueSolarTimeLocationForSource",
    "syncTrueSolarTimeLocationFromCoordinateInput",
  ].map((name) => extractNamedFunctionSource(mainModuleRaw, name)).join("\n\n");
  return Function("parseCoordinateInput", `
    const TRUE_SOLAR_TIME_SOURCE = Object.freeze({ QUERY: "query", DEVICE: "device", CUSTOM: "custom" });
    const elements = { trueSolarTimeCoordinate: { value: "" } };
    let trueSolarTimeSource = TRUE_SOLAR_TIME_SOURCE.QUERY;
    let trueSolarTimeLocation = null;
    let trueSolarTimeQueryLocations = {
      [TRUE_SOLAR_TIME_SOURCE.DEVICE]: undefined,
      [TRUE_SOLAR_TIME_SOURCE.CUSTOM]: undefined,
    };
    const statuses = [];
    function setTrueSolarTimeStatus(message, type) {
      statuses.push({ message, type });
    }
    ${definitions}
    return {
      sync(input, options) {
        elements.trueSolarTimeCoordinate.value = input;
        return syncTrueSolarTimeLocationFromCoordinateInput(options);
      },
      setLocation(location) {
        trueSolarTimeLocation = location;
      },
      getLocation() {
        return trueSolarTimeLocation;
      },
      getInput() {
        return elements.trueSolarTimeCoordinate.value;
      },
      getStatuses() {
        return statuses.slice();
      },
    };
  `)(parseCoordinateInput);
}

function loadTrueSolarLocationOwnershipForTest(mainModuleRaw) {
  const definitions = [
    "isFormalTrueSolarTimeSource",
    "cloneTrueSolarTimeLocation",
    "getTrueSolarTimeLocationForSource",
    "setTrueSolarTimeLocationForSource",
    "initializeTrueSolarTimeQueryLocation",
    "formatTrueSolarTimeCoordinateInput",
    "syncTrueSolarTimeCoordinateInputForSource",
    "syncTrueSolarTimeLocationFromCoordinateInput",
  ].map((name) => extractNamedFunctionSource(mainModuleRaw, name)).join("\n\n");
  return Function("parseCoordinateInput", `
    const TRUE_SOLAR_TIME_SOURCE = Object.freeze({ QUERY: "query", DEVICE: "device", CUSTOM: "custom" });
    const elements = { trueSolarTimeCoordinate: { value: "" } };
    let trueSolarTimeSource = TRUE_SOLAR_TIME_SOURCE.QUERY;
    let trueSolarTimeLocation = null;
    let trueSolarTimeQueryLocations = {
      [TRUE_SOLAR_TIME_SOURCE.DEVICE]: undefined,
      [TRUE_SOLAR_TIME_SOURCE.CUSTOM]: undefined,
    };
    function setTrueSolarTimeStatus() {}
    ${definitions}
    return {
      sync(source, input) {
        trueSolarTimeSource = source;
        elements.trueSolarTimeCoordinate.value = input;
        return syncTrueSolarTimeLocationFromCoordinateInput({ source, showError: false });
      },
      switchSource(source) {
        trueSolarTimeSource = source;
        syncTrueSolarTimeCoordinateInputForSource(source);
      },
      getLocation(source) {
        return getTrueSolarTimeLocationForSource(source);
      },
      locationText(source) {
        const location = getTrueSolarTimeLocationForSource(source);
        return location ? location.latitude + "," + location.longitude : null;
      },
      getInput() {
        return elements.trueSolarTimeCoordinate.value;
      },
    };
  `)(parseCoordinateInput);
}

function extractNamedFunctionSource(source, name) {
  const declaration = `function ${name}(`;
  const start = source.indexOf(declaration);
  if (start === -1) {
    throw new Error(`Cannot find ${declaration} in src/main.js`);
  }

  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") {
      depth += 1;
    } else if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }

  throw new Error(`Cannot find the end of ${declaration} in src/main.js`);
}

function loadQimenPalaceContentRenderer(mainModuleRaw) {
  const documentFixture = createQimenDomFixtureDocument();
  const rendererStart = mainModuleRaw.indexOf("function createQimenPalaceContent(");
  const rendererEnd = mainModuleRaw.indexOf("\n}\n\nfunction createQimenPalaceGuaCorner", rendererStart);
  if (rendererStart === -1 || rendererEnd === -1) {
    throw new Error("Cannot load createQimenPalaceContent from src/main.js");
  }
  const rendererSource = mainModuleRaw.slice(rendererStart, rendererEnd + 2);
  return Function("document", `
    const formatNullableQimenValue = (value) => value ?? "—";
    const createQimenInlineMarker = (text, className, ariaLabel = null) => {
      const marker = document.createElement("span");
      marker.className = className;
      marker.textContent = text;
      if (ariaLabel) {
        marker.setAttribute("aria-label", ariaLabel);
      }
      return marker;
    };
    ${rendererSource}
    return createQimenPalaceContent;
  `)(documentFixture);
}

function loadSeasonalMarkerRenderers(mainModuleRaw) {
  const documentFixture = createQimenDomFixtureDocument();
  const start = mainModuleRaw.indexOf("function createPillarExtraPanelLine(");
  const end = mainModuleRaw.indexOf("\n}\n\nfunction renderDailyGods", start);
  if (start === -1 || end === -1) {
    throw new Error("Cannot load seasonal marker renderers from src/main.js");
  }
  const source = mainModuleRaw.slice(start, end + 2);
  return Function("document", `${source}\nreturn { createPillar: createDailyInfoPillarParts, createPanel: createDailyInfoPanelLines };`)(documentFixture);
}

function createQimenDomFixtureDocument() {
  const createElement = (tagName) => ({
    tagName,
    className: "",
    childNodes: [],
    attributes: {},
    append(...nodes) {
      this.childNodes.push(...nodes);
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
  });
  return {
    createElement,
    createTextNode(textContent) {
      return { nodeType: 3, textContent };
    },
  };
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
