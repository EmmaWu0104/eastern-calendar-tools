import {
  createFlyingStarAfflictionViewModel,
} from "./annualAfflictions.js";
import {
  calculateBaziFromSolarTerms,
  getEffectiveDateKeyFromLocalParts,
} from "./bazi.js";
import { calculateBaziFromChartTimeContext } from "./baziChartTimeAdapter.js";
import {
  createTrueSolarChartTimeContext,
  createWatchChartTimeContext,
} from "./chartTimeContext.js";
import { getDailyGodsByStem } from "./dailyGods.js";
import {
  formatBaziDailySummary,
  formatBaziDailySummaryFromDateKey,
  getClashingZodiacByBranch,
  getDailyDaHuangDao,
} from "./dailyInfo.js";
import { getDongGongDaySelection } from "./dongGongDaySelection.js";
import { calculateFlyingStarsFromBaziResult } from "./flyingStarsChartTimeAdapter.js";
import {
  createCombinedFlyingStarSummary,
  createCombinedFlyingStarViewModel,
  formatMonthlySummary,
  formatPeriodCycle,
  formatStarCircleNumber,
  formatStarName,
  getPeriodYuanName,
} from "./flyingStarViewModel.js";
import {
  formatHexagramLabel,
  getHexagramByTrigrams,
  getTrigramByQimenDoor,
  getTrigramByQimenPalaceKey,
  getTrigramByQimenStar,
} from "./hexagrams.js";
import {
  calculateGuiDengForDate,
  getMonthGeneralBySolarTermName,
} from "./guideng.js";
import {
  calculateGuiDengFromChartTimeContext,
  GUIDENG_CHART_TIME_STATUS,
} from "./guidengChartTimeAdapter.js";
import {
  createGuiDengDisplayModel,
  formatDateTimeForChartMode,
  getChartClockLocalPartsForInstant,
} from "./chartClockDisplay.js";
import {
  getJinhanBlackYellowHours,
  getJinhanDeitiesByPalace,
  getJinhanYujingDayPan,
} from "./jinhanYujing.js";
import { calculateJinhanFromChartTimeContext } from "./jinhanChartTimeAdapter.js";
import { getNaYinByPillar } from "./nayin.js";
import {
  calculateTrueSolarTime,
  parseCoordinateInput,
} from "./trueSolarTime.js";
import {
  resolveTrueSolarLocalDateTimeToInstant,
  TRUE_SOLAR_CLOCK_RESOLUTION_STATUS,
} from "./trueSolarClock.js";
import { calculateSolarEvents } from "./solarEvents.js";
import {
  formatUtcOffset,
  getDeviceTimeZone,
  getZonedDateTimeParts,
  MAX_TIME_ZONE_INPUT_LENGTH,
  resolveLocalDateTimeInTimeZone,
  validateTimeZone,
} from "./timeZone.js";
import {
  buildChartDisplayModeUrl,
  getChartDisplayModeFromLocation,
  isTrueSolarDisplayMode,
} from "./chartDisplayMode.js";
import { searchTimeZones } from "./timeZoneCatalog.js";
import { getQimenPlate } from "./qimenPlateLookup.js";
import { createQimenOpenCloseViewModel } from "./qimenOpenClose.js";
import {
  QIMEN_BRANCH_POSITIONS,
  decorateQimenPlateMarkers,
  findQimenDisplayZhiFuPalaceKey,
  getQimenGuXuByHourBranch,
} from "./qimenPlateMarkers.js";
import { createQimenQiResponseViewModel } from "./qimenQiResponse.js";
import { resolveQimenJuFromFullTermCycleDraft } from "./qimenResolver.js";
import {
  createQimenSolarTermVirtuePunishmentViewModel,
} from "./qimenSolarTermVirtuePunishment.js";
import { resolveQimenTimeSpecialConditions } from "./qimenTimeSpecialConditions.js";
import {
  formatSolarTermDateTime,
  getSolarTermOnDate,
  getSolarTermsInMonth,
  loadSolarTerms,
} from "./solarTerms.js";
import {
  formatLunarCalendarAccessibleLabel,
  formatLunarCalendarLabel,
  getLunarDateForSolarDate,
} from "./lunarCalendar.js";

const AUTO_NOW_REFRESH_MS = 30_000;
const TRUE_SOLAR_TIME_CLOCK_REFRESH_MS = 1_000;
const TRUE_SOLAR_TIME_ZONE_SEARCH_DEBOUNCE_MS = 200;
// 上方查詢時間維持臺灣 UTC+8；裝置／自訂來源另外以 IANA 時區解析。
const TAIPEI_UTC_OFFSET_MINUTES = 480;
const TRUE_SOLAR_TIME_SOURCE = Object.freeze({ QUERY: "query", DEVICE: "device", CUSTOM: "custom" });
const CHART_TIME_MODE = Object.freeze({ WATCH: "watch", TRUE_SOLAR: "true-solar" });
const DOCUMENT_TITLE_PREFIX = "東方玄學排盤";

const PALACE_DIRECTION_LABELS = {
  xun: "東南",
  li: "南",
  kun: "西南",
  zhen: "東",
  center: "中",
  dui: "西",
  gen: "東北",
  kan: "北",
  qian: "西北",
};

const JINHAN_PALACE_LAYOUT = Object.freeze([
  Object.freeze(["巽", "離", "坤"]),
  Object.freeze(["震", "中", "兌"]),
  Object.freeze(["艮", "坎", "乾"]),
]);

const JINHAN_PALACE_META = Object.freeze({
  坎: Object.freeze({ name: "坎", number: 1, direction: "北" }),
  艮: Object.freeze({ name: "艮", number: 8, direction: "東北" }),
  震: Object.freeze({ name: "震", number: 3, direction: "東" }),
  巽: Object.freeze({ name: "巽", number: 4, direction: "東南" }),
  離: Object.freeze({ name: "離", number: 9, direction: "南" }),
  坤: Object.freeze({ name: "坤", number: 2, direction: "西南" }),
  兌: Object.freeze({ name: "兌", number: 7, direction: "西" }),
  乾: Object.freeze({ name: "乾", number: 6, direction: "西北" }),
  中: Object.freeze({ name: "中", number: 5, direction: "中" }),
});

const QIMEN_PALACE_DISPLAY_LAYOUT = Object.freeze([
  Object.freeze([
    Object.freeze({ key: "xun", name: "巽", direction: "東南", number: 4 }),
    Object.freeze({ key: "li", name: "離", direction: "南", number: 9 }),
    Object.freeze({ key: "kun", name: "坤", direction: "西南", number: 2 }),
  ]),
  Object.freeze([
    Object.freeze({ key: "zhen", name: "震", direction: "東", number: 3 }),
    Object.freeze({ key: "center", name: "中", direction: "中", number: 5 }),
    Object.freeze({ key: "dui", name: "兌", direction: "西", number: 7 }),
  ]),
  Object.freeze([
    Object.freeze({ key: "gen", name: "艮", direction: "東北", number: 8 }),
    Object.freeze({ key: "kan", name: "坎", direction: "北", number: 1 }),
    Object.freeze({ key: "qian", name: "乾", direction: "西北", number: 6 }),
  ]),
]);

const QIMEN_HIDDEN_PLATE_NOTES = new Set([
  "天禽寄宮未推導，第一版以 center 標記直符",
]);

const JINHAN_DEITY_CLASS_NAMES = Object.freeze({
  xishen: "jinhan-deity-xishen",
  caishen: "jinhan-deity-caishen",
  yinGuishen: "jinhan-deity-yin-guishen",
  yangGuishen: "jinhan-deity-yang-guishen",
});

const QUERY_YEAR_MIN = 1900;
const QUERY_YEAR_MAX = 2100;
const CHINESE_HOUR_LABELS = Object.freeze([
  Object.freeze({ index: 1, branch: "子", timeRange: "23 ~ 01", startHour: 23 }),
  Object.freeze({ index: 2, branch: "丑", timeRange: "01 ~ 03", startHour: 1 }),
  Object.freeze({ index: 3, branch: "寅", timeRange: "03 ~ 05", startHour: 3 }),
  Object.freeze({ index: 4, branch: "卯", timeRange: "05 ~ 07", startHour: 5 }),
  Object.freeze({ index: 5, branch: "辰", timeRange: "07 ~ 09", startHour: 7 }),
  Object.freeze({ index: 6, branch: "巳", timeRange: "09 ~ 11", startHour: 9 }),
  Object.freeze({ index: 7, branch: "午", timeRange: "11 ~ 13", startHour: 11 }),
  Object.freeze({ index: 8, branch: "未", timeRange: "13 ~ 15", startHour: 13 }),
  Object.freeze({ index: 9, branch: "申", timeRange: "15 ~ 17", startHour: 15 }),
  Object.freeze({ index: 10, branch: "酉", timeRange: "17 ~ 19", startHour: 17 }),
  Object.freeze({ index: 11, branch: "戌", timeRange: "19 ~ 21", startHour: 19 }),
  Object.freeze({ index: 12, branch: "亥", timeRange: "21 ~ 23", startHour: 21 }),
]);

const QIMEN_JU_LABELS = Object.freeze({
  1: "一局",
  2: "二局",
  3: "三局",
  4: "四局",
  5: "五局",
  6: "六局",
  7: "七局",
  8: "八局",
  9: "九局",
});
const QIMEN_MISSING_PLATE_MESSAGE = "盤面資料尚未建立，目前僅顯示定局結果。";
const QIMEN_FORMATTER_ERROR_MESSAGE = "奇門遁甲資料目前無法查詢此時間。";
const QIMEN_PLATE_LOAD_ERROR_MESSAGE = "奇門盤面資料讀取失敗，暫時無法顯示盤面。";

const elements = {
  tabButtons: Array.from(document.querySelectorAll(".tab-button")),
  tabPanels: Array.from(document.querySelectorAll(".tab-panel")),
  trueSolarTimeTab: getElement("#tab-true-solar-time"),
  qimenTabPanel: getElement("#panel-qimen"),
  trueSolarTimeCoordinate: getElement("#true-solar-time-coordinate"),
  trueSolarTimeSourceQuery: getElement("#true-solar-time-source-query"),
  trueSolarTimeSourceDevice: getElement("#true-solar-time-source-device"),
  trueSolarTimeSourceCustom: getElement("#true-solar-time-source-custom"),
  trueSolarTimeCalculate: getElement("#true-solar-time-calculate"),
  trueSolarTimeGeolocate: getElement("#true-solar-time-geolocate"),
  trueSolarTimeWatchValue: getElement("#true-solar-time-watch-value"),
  trueSolarTimeWatchTitle: getElement("#true-solar-time-watch-title"),
  trueSolarTimeWatchNote: getElement("#true-solar-time-watch-note"),
  trueSolarTimeDeviceFields: getElement("#true-solar-time-device-fields"),
  trueSolarTimeDeviceLocalTime: getElement("#true-solar-time-device-local-time"),
  trueSolarTimeDeviceTimeZone: getElement("#true-solar-time-device-time-zone"),
  trueSolarTimeDeviceOffset: getElement("#true-solar-time-device-offset"),
  trueSolarTimeCustomFields: getElement("#true-solar-time-custom-fields"),
  trueSolarTimeLocalDate: getElement("#true-solar-time-local-date"),
  trueSolarTimeLocalTime: getElement("#true-solar-time-local-time"),
  trueSolarTimeTimeZone: getElement("#true-solar-time-time-zone"),
  trueSolarTimeTimeZonePicker: getElement("#true-solar-time-time-zone-picker"),
  trueSolarTimeTimeZoneCurrentDevice: getElement("#true-solar-time-time-zone-current-device"),
  trueSolarTimeTimeZoneCurrentDeviceLabel: getElement("#true-solar-time-time-zone-current-device-label"),
  trueSolarTimeTimeZoneSearchStatus: getElement("#true-solar-time-time-zone-search-status"),
  trueSolarTimeTimeZoneSearchResults: getElement("#true-solar-time-time-zone-search-results"),
  trueSolarTimeTimeZoneStatus: getElement("#true-solar-time-time-zone-status"),
  trueSolarTimeDisambiguation: getElement("#true-solar-time-disambiguation"),
  trueSolarTimeDisambiguationEarlier: getElement("#true-solar-time-disambiguation-earlier"),
  trueSolarTimeDisambiguationLater: getElement("#true-solar-time-disambiguation-later"),
  trueSolarTimeDisambiguationEarlierLabel: getElement("#true-solar-time-disambiguation-earlier-label"),
  trueSolarTimeDisambiguationLaterLabel: getElement("#true-solar-time-disambiguation-later-label"),
  trueSolarTimeDisambiguationSelected: getElement("#true-solar-time-disambiguation-selected"),
  trueSolarTimeLocationValue: getElement("#true-solar-time-location-value"),
  trueSolarTimeStatus: getElement("#true-solar-time-status"),
  trueSolarTimeResult: getElement("#true-solar-time-result"),
  trueSolarTimeSolarEvents: getElement("#true-solar-time-solar-events"), trueSolarTimeSolarEventsTitle: getElement("#true-solar-time-solar-events-title"), trueSolarTimeSolarEventsContext: getElement("#true-solar-time-solar-events-context"), trueSolarTimeSolarEventsLocation: getElement("#true-solar-time-solar-events-location"), trueSolarTimeSolarEventsTimeZone: getElement("#true-solar-time-solar-events-time-zone"), trueSolarTimeSunrise: getElement("#true-solar-time-sunrise"), trueSolarTimeSolarNoon: getElement("#true-solar-time-solar-noon"), trueSolarTimeSunset: getElement("#true-solar-time-sunset"), trueSolarTimeSolarEventsMessage: getElement("#true-solar-time-solar-events-message"),
  trueSolarTimeApplyActions: getElement("#true-solar-time-apply-actions"), trueSolarTimeApply: getElement("#true-solar-time-apply"), chartTimeStatusTitle: getElement("#chart-time-status-title"), chartTimeStatusDetail: getElement("#chart-time-status-detail"), chartTimeRestore: getElement("#chart-time-restore"),
  chartTimeModeBanner: getElement("#chart-time-mode-banner"), chartTimeModeTitle: getElement("#chart-time-mode-title"), chartTimeModeDescription: getElement("#chart-time-mode-description"), chartTimeModeSwitchLink: getElement("#chart-time-mode-switch-link"),
  trueSolarTimeQueryOnlyNote: getElement("#true-solar-time-query-only-note"),
  chartQueryTimeValue: getElement("#chart-query-time-value"), chartQueryTimeModeStatus: getElement("#chart-query-time-mode-status"),
  datetime: getElement("#datetime"),
  useNow: getElement("#use-now"),
  calendarPrevious: getElement("#calendar-previous"),
  calendarNext: getElement("#calendar-next"),
  calendarYear: getElement("#calendar-year"),
  calendarMonth: getElement("#calendar-month"),
  calendarDays: getElement("#calendar-days"),
  chineseHourButtons: getElement("#chinese-hour-buttons"),
  weekdayLabel: getElement("#weekday-label"),
  pillars: getElement(".pillars"),
  yearPillar: getElement("#year-pillar"),
  monthPillar: getElement("#month-pillar"),
  dayPillar: getElement("#day-pillar"),
  hourPillar: getElement("#hour-pillar"),
  seasonInfo: getElement("#season-info"),
  dongGongCard: getElement("#dong-gong-card"),
  flyingStars: getElement("#flying-stars"),
  flyingStarsMessage: getElement("#flying-stars-message"),
  jinhanDunType: getElement("#jinhan-dun-type"),
  jinhanMessage: getElement("#jinhan-message"),
  jinhanSummary: getElement("#jinhan-summary"),
  jinhanGrid: getElement("#jinhan-grid"),
  jinhanCurrentHourLabel: getElement("#jinhan-current-hour-label"),
  jinhanHoursBody: getElement("#jinhan-hours-body"),
  ruleNotes: getElement("#rule-notes"),
  baziTimeBasis: getElement("#bazi-time-basis"),
  message: getElement("#message"),
};

let currentCalendarResult = null;
let currentWatchBaziResult = null;
let currentSolarTerms = null;
let isJinhanDunTypeManuallyOverridden = false;
let isAutoNowMode = false;
let autoNowTimerId = null;
let trueSolarTimeClockTimerId = null;
let isCalculating = false;
let pendingDateTimeValue = null;
let latestBaziRenderRequestId = 0;
let currentDateTimeValue = null;
let selectedCalendarDate = null;
let visibleCalendarYear = new Date().getFullYear();
let visibleCalendarMonth = new Date().getMonth();
let qimenManualOverride = {
  enabled: false,
  dunType: "",
  ju: null,
};
let trueSolarTimeLocation = null;
let trueSolarTimeSolarEventsKey = null;
let trueSolarTimeSource = TRUE_SOLAR_TIME_SOURCE.QUERY;
let trueSolarTimeCustomDisambiguation = null;
let trueSolarTimeTimeZoneSearchResults = [];
let trueSolarTimeTimeZoneSearchActiveIndex = -1;
let trueSolarTimeTimeZoneSearchDebounceTimerId = null;
const trueSolarTimeTimeZoneOffsetCache = new Map();
let chartDisplayMode = getChartDisplayModeFromLocation(window.location);
let chartTimeState = { mode: CHART_TIME_MODE.WATCH, watchDateTimeValue: null, effectiveDateTimeValue: null, trueSolarResult: null, location: null };
let currentTrueSolarChartContextInput = null;
let currentTrueSolarChartContext = null;
let currentTrueSolarBaziResult = null;
let currentJinhanRenderSnapshot = null;
let currentJinhanRenderGeneration = 0;
let currentJinhanRenderKey = null;
let currentGuiDengAdapterResult = null;
let currentGuiDengDisplayModel = null;
const guiDengSolarEventCache = new Map();
const GUI_DENG_SOLAR_EVENT_CACHE_MAX_SIZE = 64;
const solarTermDayPanel = createSolarTermDayPanel();
const pillarExtraPanel = createPillarExtraPanel();
const qimenElements = createQimenSection();

elements.pillars.append(solarTermDayPanel);
elements.pillars.append(pillarExtraPanel);
insertQimenSection(qimenElements.section);

elements.tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTab(button.getAttribute("aria-controls"));
  });
});

elements.useNow.addEventListener("click", () => {
  startAutoNowMode();
});
elements.calendarPrevious.addEventListener("click", () => {
  pauseAutoNowMode();
  shiftVisibleCalendarMonth(-1);
});
elements.calendarNext.addEventListener("click", () => {
  pauseAutoNowMode();
  shiftVisibleCalendarMonth(1);
});
elements.calendarYear.addEventListener("change", handleCalendarYearChange);
elements.datetime.addEventListener("input", handleManualDateTimeInput);
elements.datetime.addEventListener("change", handleManualDateTimeChange);
elements.datetime.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleManualDateTimeChange();
  }
});
window.addEventListener("pagehide", () => {
  stopAutoNowRefresh();
  stopTrueSolarTimeClockRefresh();
  clearTrueSolarTimeTimeZoneSearchDebounce();
});
window.addEventListener("popstate", syncChartDisplayModeFromLocation);
elements.jinhanDunType.addEventListener("change", () => {
  isJinhanDunTypeManuallyOverridden = true;
  void renderJinhanYujing(currentCalendarResult, currentDateTimeValue ?? elements.datetime.value);
});
elements.trueSolarTimeCalculate.addEventListener("click", calculateTrueSolarTimeFromCoordinateInput);
elements.trueSolarTimeCoordinate.addEventListener("input", handleTrueSolarTimeCoordinateInput);
elements.trueSolarTimeCoordinate.addEventListener("change", handleTrueSolarTimeCoordinateChange);
elements.trueSolarTimeGeolocate.addEventListener("click", requestTrueSolarTimeGeolocation);
elements.trueSolarTimeApply.addEventListener("click", applyTrueSolarTimeToCharts);
elements.chartTimeModeSwitchLink.addEventListener("click", handleChartDisplayModeSwitchClick);
for (const sourceControl of [
  elements.trueSolarTimeSourceQuery,
  elements.trueSolarTimeSourceDevice,
  elements.trueSolarTimeSourceCustom,
]) {
  sourceControl.addEventListener("change", handleTrueSolarTimeSourceChange);
}
for (const customControl of [
  elements.trueSolarTimeLocalDate,
  elements.trueSolarTimeLocalTime,
]) {
  customControl.addEventListener("input", handleTrueSolarTimeCustomInput);
  customControl.addEventListener("change", handleTrueSolarTimeCustomInput);
}
elements.trueSolarTimeTimeZone.addEventListener("input", handleTrueSolarTimeTimeZoneInput);
elements.trueSolarTimeTimeZone.addEventListener("change", handleTrueSolarTimeTimeZoneChange);
elements.trueSolarTimeTimeZone.addEventListener("keydown", handleTrueSolarTimeTimeZoneKeydown);
elements.trueSolarTimeTimeZone.addEventListener("focus", renderTrueSolarTimeTimeZoneSearchResults);
elements.trueSolarTimeTimeZoneCurrentDevice.addEventListener("click", useDeviceTimeZoneForCustomInput);
document.addEventListener("click", handleTrueSolarTimeTimeZoneDocumentClick);
elements.trueSolarTimeDisambiguationEarlier.addEventListener("change", handleTrueSolarTimeDisambiguationChange);
elements.trueSolarTimeDisambiguationLater.addEventListener("change", handleTrueSolarTimeDisambiguationChange);
elements.chartTimeRestore.addEventListener("click", () => restoreWatchChartTime());
qimenElements.manualToggle.addEventListener("change", handleQimenManualToggleChange);
qimenElements.manualDunSelect.addEventListener("change", handleQimenManualDunChange);
qimenElements.manualJuSelect.addEventListener("change", handleQimenManualJuChange);
qimenElements.manualRestore.addEventListener("click", restoreQimenAutoPlateLookup);

initializeQueryPicker();
initializeChartDisplayMode();
startAutoNowMode();

function initializeChartDisplayMode() {
  resetLegacyChartTimeState();
  renderChartDisplayMode();
}

function handleChartDisplayModeSwitchClick(event) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return;
  }
  event.preventDefault();
  const nextMode = isTrueSolarDisplayMode(chartDisplayMode) ? "watch" : "true-solar";
  window.history.pushState({}, "", buildChartDisplayModeUrl(nextMode, window.location));
  chartDisplayMode = getChartDisplayModeFromLocation(window.location);
  if (!isTrueSolarDisplayMode(chartDisplayMode)) {
    resetLegacyChartTimeState();
  }
  renderChartDisplayMode();
}

function syncChartDisplayModeFromLocation() {
  chartDisplayMode = getChartDisplayModeFromLocation(window.location);
  if (!isTrueSolarDisplayMode(chartDisplayMode)) {
    resetLegacyChartTimeState();
  }
  renderChartDisplayMode();
}

function renderChartDisplayMode() {
  const requestId = ++latestBaziRenderRequestId;
  const isTrueSolar = isTrueSolarDisplayMode(chartDisplayMode);
  const nextMode = isTrueSolar ? "watch" : "true-solar";
  const switchUrl = buildChartDisplayModeUrl(nextMode, window.location);
  document.body.dataset.chartTimeMode = chartDisplayMode;
  elements.chartTimeModeBanner.dataset.timeMode = chartDisplayMode;
  document.title = `${DOCUMENT_TITLE_PREFIX}｜${isTrueSolar ? "真太陽時" : "手錶時間"}`;
  elements.trueSolarTimeTab.textContent = isTrueSolar ? "⌚ 手錶時間" : "☀ 真太陽時";
  elements.chartTimeModeTitle.textContent = isTrueSolar ? "☀ 真太陽時排盤" : "⌚ 手錶時間排盤";
  elements.chartTimeModeDescription.textContent = isTrueSolar
    ? "四柱、九宮飛星、金函玉鏡與登貴已使用真太陽時；奇門仍維持手錶時間。"
    : "目前各盤維持既有手錶時間計算。";
  elements.chartTimeModeSwitchLink.textContent = isTrueSolar ? "返回手錶時間排盤" : "切換至真太陽時排盤";
  elements.chartTimeModeSwitchLink.href = switchUrl;
  elements.trueSolarTimeQueryOnlyNote.hidden = !isTrueSolar;
  if (isTrueSolar) {
    if (!trueSolarTimeLocation) {
      syncTrueSolarTimeLocationFromCoordinateInput({ showError: false });
    }
    renderFormalTrueSolarChartTime();
    renderActiveTrueSolarTime();
  }
  if (currentCalendarResult && currentSolarTerms) {
    renderBaziForActiveDisplayMode();
    refreshFlyingStarsForCurrentChartTime(requestId);
    void refreshJinhanForCurrentChartTime(requestId);
  }
  renderChineseHourButtons();
  renderChartTimeStatus();
}

function resetLegacyChartTimeState() {
  chartTimeState.mode = CHART_TIME_MODE.WATCH;
  const canonicalDateTimeValue = normalizeLocalDateTimeValueWithSeconds(elements.datetime.value);
  chartTimeState.watchDateTimeValue = canonicalDateTimeValue;
  chartTimeState.effectiveDateTimeValue = canonicalDateTimeValue;
  chartTimeState.location = null;
  clearCurrentTrueSolarChartContext();
}

function startAutoNowMode() {
  if (chartTimeState.mode === CHART_TIME_MODE.TRUE_SOLAR) {
    chartTimeState.mode = CHART_TIME_MODE.WATCH;
    chartTimeState.location = null;
  }
  isAutoNowMode = true;
  stopAutoNowRefresh();
  syncTrueSolarTimeClockRefresh();
  renderChartQueryTimeModeStatus();
  refreshFromCurrentTime();
  autoNowTimerId = window.setInterval(refreshFromCurrentTime, AUTO_NOW_REFRESH_MS);
}

function pauseAutoNowMode() {
  if (!isAutoNowMode) {
    renderChartQueryTimeModeStatus();
    return;
  }

  isAutoNowMode = false;
  stopAutoNowRefresh();
  syncTrueSolarTimeClockRefresh();
  renderChartQueryTimeModeStatus();
}

function stopAutoNowRefresh() {
  if (autoNowTimerId !== null) {
    window.clearInterval(autoNowTimerId);
    autoNowTimerId = null;
  }
}

function startTrueSolarTimeClockRefresh() {
  if (trueSolarTimeSource !== TRUE_SOLAR_TIME_SOURCE.DEVICE && !isAutoNowMode) {
    return;
  }
  if (trueSolarTimeClockTimerId !== null) {
    return;
  }
  trueSolarTimeClockTimerId = window.setInterval(
    refreshTrueSolarTimeClock,
    TRUE_SOLAR_TIME_CLOCK_REFRESH_MS
  );
}

function syncTrueSolarTimeClockRefresh() {
  if (
    trueSolarTimeSource === TRUE_SOLAR_TIME_SOURCE.DEVICE
    || isAutoNowMode
  ) {
    startTrueSolarTimeClockRefresh();
  } else {
    stopTrueSolarTimeClockRefresh();
  }
}

function stopTrueSolarTimeClockRefresh() {
  if (trueSolarTimeClockTimerId !== null) {
    window.clearInterval(trueSolarTimeClockTimerId);
    trueSolarTimeClockTimerId = null;
  }
}

function refreshTrueSolarTimeClock() {
  if (trueSolarTimeSource === TRUE_SOLAR_TIME_SOURCE.DEVICE) {
    renderTrueSolarTimeForDeviceNow();
  }
  if (trueSolarTimeSource === TRUE_SOLAR_TIME_SOURCE.QUERY && isAutoNowMode) {
    refreshQueryTimeFromAutoNowClock();
    return;
  }
  if (isAutoNowMode) {
    refreshQueryTimeFromAutoNowClock();
  }
}

function refreshQueryTimeFromAutoNowClock() {
  if (!isAutoNowMode) {
    return;
  }

  const dateTimeValue = toLocalDatetimeValue(new Date());
  if (dateTimeValue === elements.datetime.value) {
    return;
  }

  elements.datetime.value = dateTimeValue;
  chartTimeState.watchDateTimeValue = dateTimeValue;
  chartTimeState.effectiveDateTimeValue = dateTimeValue;
  renderChartQueryTimeModeStatus();
  syncQueryPickerFromDateTime(dateTimeValue, { syncVisibleMonth: true });
  invalidateCurrentTrueSolarChartContext();

  if (trueSolarTimeSource === TRUE_SOLAR_TIME_SOURCE.QUERY) {
    renderTrueSolarTimeForWatchDate(dateTimeValue);
  }
  if (currentSolarTerms) {
    const requestId = ++latestBaziRenderRequestId;
    refreshBaziForCurrentChartTime(dateTimeValue, requestId);
    renderChineseHourButtons();
  }
  if (isTrueSolarDisplayMode(chartDisplayMode)) {
    if (!currentSolarTerms) {
      renderFormalTrueSolarChartTime();
    }
    return;
  }

  renderChartTimeStatus();
}

function refreshFromCurrentTime() {
  if (!isAutoNowMode) {
    return;
  }

  elements.datetime.value = toLocalDatetimeValue(new Date());
  renderChartQueryTimeModeStatus();
  syncQueryPickerFromDateTime(elements.datetime.value, { syncVisibleMonth: true });
  requestRenderDateTime(elements.datetime.value);
  renderChineseHourButtons();
}

function handleManualDateTimeInput() {
  pauseAutoNowMode();
  invalidateCurrentTrueSolarChartContext();

  if (!readDateTimeInput()) {
    return;
  }

  syncQueryPickerFromDateTime(elements.datetime.value, { syncVisibleMonth: true });
  requestRenderDateTime(elements.datetime.value);
}

function handleManualDateTimeChange() {
  pauseAutoNowMode();
  invalidateCurrentTrueSolarChartContext();

  if (!readDateTimeInput()) {
    return;
  }

  syncQueryPickerFromDateTime(elements.datetime.value, { syncVisibleMonth: true });
  requestRenderDateTime(elements.datetime.value);
}

function readDateTimeInput() {
  return parseDateTimeLocalValue(elements.datetime.value);
}

function initializeQueryPicker() {
  const yearOptions = [];
  for (let year = QUERY_YEAR_MIN; year <= QUERY_YEAR_MAX; year += 1) {
    yearOptions.push(createOption(String(year), `${year}年`));
  }
  elements.calendarYear.replaceChildren(...yearOptions);
  visibleCalendarYear = clampQueryYear(visibleCalendarYear);
  renderQueryPicker();
}

function syncQueryPickerFromDateTime(
  dateTimeValue,
  { syncVisibleMonth = false, syncSelectedCalendarDate = true } = {}
) {
  const calendarDate = getSelectedCalendarDateFromDateTime(dateTimeValue);
  if (!calendarDate) {
    renderQueryPicker();
    return;
  }

  if (syncSelectedCalendarDate) {
    selectedCalendarDate = calendarDate;
  }

  if (syncVisibleMonth) {
    visibleCalendarYear = clampQueryYear(calendarDate.year);
    visibleCalendarMonth = calendarDate.month;
  }

  renderQueryPicker();
}

function renderQueryPicker() {
  visibleCalendarYear = clampQueryYear(visibleCalendarYear);
  visibleCalendarMonth = Math.min(11, Math.max(0, visibleCalendarMonth));
  elements.calendarYear.value = String(visibleCalendarYear);
  elements.calendarMonth.textContent = `${visibleCalendarMonth + 1}月`;
  elements.calendarPrevious.disabled = visibleCalendarYear === QUERY_YEAR_MIN && visibleCalendarMonth === 0;
  elements.calendarNext.disabled = visibleCalendarYear === QUERY_YEAR_MAX && visibleCalendarMonth === 11;
  renderMonthCalendarDays();
  renderChineseHourButtons();
}

function renderMonthCalendarDays() {
  const selectedDate = selectedCalendarDate;
  const today = new Date();
  const firstWeekday = (new Date(visibleCalendarYear, visibleCalendarMonth, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(visibleCalendarYear, visibleCalendarMonth + 1, 0).getDate();
  const solarTermsByDay = getSolarTermsByDayInVisibleMonth();
  const cells = [];

  for (let index = 0; index < firstWeekday; index += 1) {
    const blank = document.createElement("span");
    blank.className = "query-calendar-day is-blank";
    blank.setAttribute("aria-hidden", "true");
    cells.push(blank);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const button = document.createElement("button");
    const isToday = isSameCalendarDate(today, visibleCalendarYear, visibleCalendarMonth, day);
    const isSelected = selectedDate
      && isSameCalendarDate(selectedDate, visibleCalendarYear, visibleCalendarMonth, day);
    const solarTerms = solarTermsByDay.get(day) ?? [];
    const calendarDayDetail = getQueryCalendarDayDetail(
      visibleCalendarYear,
      visibleCalendarMonth,
      day,
      solarTerms
    );
    button.type = "button";
    button.className = [
      "query-calendar-day",
      isToday ? "is-today" : "",
      isSelected ? "is-selected" : "",
      solarTerms.length > 0 ? "has-solar-term" : "",
    ].filter(Boolean).join(" ");
    button.append(createBlockSpan(String(day), "query-calendar-day-number"));
    if (solarTerms.length > 0) {
      button.append(createBlockSpan(calendarDayDetail.solarTermText, "query-calendar-solar-term"));
    } else if (calendarDayDetail.lunarLabel) {
      button.append(createBlockSpan(calendarDayDetail.lunarLabel, "query-calendar-lunar"));
    }
    button.setAttribute("role", "gridcell");
    button.setAttribute("aria-selected", String(Boolean(isSelected)));
    button.setAttribute("aria-label", calendarDayDetail.ariaLabel);
    button.addEventListener("click", () => selectQueryCalendarDate(visibleCalendarYear, visibleCalendarMonth, day));
    cells.push(button);
  }

  elements.calendarDays.replaceChildren(...cells);
}

function getQueryCalendarDayDetail(year, month, day, solarTerms) {
  const solarTermText = solarTerms.map((term) => term.name).join("／");
  const lunarDate = getLunarDateForSolarDate(year, month + 1, day);
  const lunarLabel = lunarDate ? formatLunarCalendarLabel(lunarDate) : "";
  const lunarAccessibleLabel = lunarDate ? formatLunarCalendarAccessibleLabel(lunarDate) : "";
  const solarTermAriaLabel = solarTermText ? `，${solarTerms.map((term) => term.name).join("、")}` : "";
  const lunarAriaLabel = lunarAccessibleLabel ? `，農曆${lunarAccessibleLabel}` : "";
  return {
    solarTermText,
    lunarLabel,
    ariaLabel: `${year}年${month + 1}月${day}日${solarTermAriaLabel}${lunarAriaLabel}`,
  };
}

function getSolarTermsByDayInVisibleMonth() {
  const termsByDay = new Map();
  if (!currentSolarTerms) {
    return termsByDay;
  }

  for (const term of getSolarTermsInMonth(currentSolarTerms, visibleCalendarYear, visibleCalendarMonth + 1)) {
    const day = Number(term.asia_taipei.slice(8, 10));
    const terms = termsByDay.get(day) ?? [];
    terms.push(term);
    termsByDay.set(day, terms);
  }

  return termsByDay;
}

function renderChineseHourButtons() {
  const { selectedIndex, currentIndex } = getChineseHourPickerState();
  const buttons = CHINESE_HOUR_LABELS.map((hour) => {
    const button = document.createElement("button");
    const isSelected = hour.index === selectedIndex;
    const isCurrent = hour.index === currentIndex;
    button.type = "button";
    button.className = [
      "chinese-hour-button",
      isSelected ? "is-selected" : "",
      isCurrent ? "is-current" : "",
    ].filter(Boolean).join(" ");
    button.setAttribute("aria-pressed", String(isSelected));
    button.setAttribute("aria-label", `${hour.branch}時 ${hour.timeRange}`);
    button.append(
      createBlockSpan(hour.branch, "chinese-hour-branch"),
      createBlockSpan(hour.timeRange, "chinese-hour-range")
    );
    button.addEventListener("click", () => selectChineseHour(hour.index));
    return button;
  });

  elements.chineseHourButtons.replaceChildren(...buttons);
}

function shiftVisibleCalendarMonth(delta) {
  const next = new Date(visibleCalendarYear, visibleCalendarMonth + delta, 1);
  if (next.getFullYear() < QUERY_YEAR_MIN || next.getFullYear() > QUERY_YEAR_MAX) {
    return;
  }

  visibleCalendarYear = next.getFullYear();
  visibleCalendarMonth = next.getMonth();
  renderQueryPicker();
}

function handleCalendarYearChange() {
  pauseAutoNowMode();
  visibleCalendarYear = clampQueryYear(Number(elements.calendarYear.value));
  renderQueryPicker();
}

function selectQueryCalendarDate(year, month, day) {
  const hourIndex = getChineseHourIndex(elements.datetime.value)
    ?? getChineseHourIndex(toLocalDatetimeValue(new Date()))
    ?? 1;
  const dateTimeValue = buildDateTimeValueFromDateAndChineseHour(year, month, day, hourIndex);
  if (!dateTimeValue) {
    return;
  }

  pauseAutoNowMode();
  selectedCalendarDate = { year, month, day };
  elements.datetime.value = dateTimeValue;
  syncQueryPickerFromDateTime(dateTimeValue, { syncSelectedCalendarDate: false });
  requestRenderDateTime(dateTimeValue);
}

function selectChineseHour(hourIndex) {
  pauseAutoNowMode();
  const selectedDate = selectedCalendarDate
    ?? getSelectedCalendarDateFromDateTime(elements.datetime.value)
    ?? getSelectedCalendarDateFromDateTime(toLocalDatetimeValue(new Date()));
  if (!selectedDate) {
    return;
  }

  const trueSolarSelection = isTrueSolarDisplayMode(chartDisplayMode)
    ? resolveTrueSolarChineseHourDateTime({ selectedDate, hourIndex, context: currentTrueSolarChartContext })
    : null;
  if (isTrueSolarDisplayMode(chartDisplayMode)
    && trueSolarSelection?.status !== TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.RESOLVED) {
    setMessage("真太陽時辰目前無法換算。", "error");
    renderChineseHourButtons();
    return;
  }
  const dateTimeValue = isTrueSolarDisplayMode(chartDisplayMode)
    ? trueSolarSelection.dateTimeValue
    : buildDateTimeValueFromDateAndChineseHour(
      selectedDate.year,
      selectedDate.month,
      selectedDate.day,
      hourIndex
    );
  if (!dateTimeValue) {
    return;
  }

  elements.datetime.value = dateTimeValue;
  requestRenderDateTime(dateTimeValue);
  // selectedCalendarDate remains the requested metaphysical effective day;
  // a true-solar 子時 may resolve to a different civil calendar date.
  syncQueryPickerFromDateTime(dateTimeValue, { syncSelectedCalendarDate: false });
}

function resolveTrueSolarChineseHourDateTime(options) {
  const { selectedDate, hourIndex, context } = options ?? {};
  if (context?.civil?.timeZone !== "Asia/Taipei" || !context.location) {
    return { status: TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.UNSUPPORTED, reason: "formal Source A context unavailable" };
  }
  const targetDateTimeValue = buildDateTimeValueFromDateAndChineseHour(
    selectedDate?.year,
    selectedDate?.month,
    selectedDate?.day,
    hourIndex,
  );
  const targetLocalParts = parseTopQueryDateTimeLocalParts(targetDateTimeValue);
  if (!targetLocalParts) {
    return { status: TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.INVALID, reason: "Chinese-hour target invalid" };
  }

  const resolved = resolveTrueSolarLocalDateTimeToInstant({
    targetLocalParts,
    timeZone: context.civil.timeZone,
    location: context.location,
    initialInstantMs: context.civil.instantMs,
    toleranceMs: 100,
  });
  if (resolved.status !== TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.RESOLVED) {
    return resolved;
  }

  let roundedInstantMs = Math.round(resolved.instantMs / 1_000) * 1_000;
  let reverseTrueSolarLocalParts;
  try {
    reverseTrueSolarLocalParts = getChartClockLocalPartsForInstant({
      instantMs: roundedInstantMs,
      context,
      mode: "true-solar",
    });
  } catch (error) {
    return {
      status: TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.UNSUPPORTED,
      reason: error instanceof Error ? error.message : String(error),
    };
  }
  let reverseErrorSeconds = getLocalPartsWallDifferenceSeconds(
    targetLocalParts,
    reverseTrueSolarLocalParts,
  );
  // At an exact Chinese-hour boundary, nearest-second rounding can land a
  // fraction before the target and select the preceding branch. Advance one
  // second in that case while retaining the required ±1 second reverse-check.
  if (reverseErrorSeconds > 0 && reverseErrorSeconds <= 1) {
    roundedInstantMs += 1_000;
    try {
      reverseTrueSolarLocalParts = getChartClockLocalPartsForInstant({
        instantMs: roundedInstantMs,
        context,
        mode: "true-solar",
      });
    } catch (error) {
      return {
        status: TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.UNSUPPORTED,
        reason: error instanceof Error ? error.message : String(error),
      };
    }
    reverseErrorSeconds = getLocalPartsWallDifferenceSeconds(
      targetLocalParts,
      reverseTrueSolarLocalParts,
    );
  }
  if (!Number.isFinite(reverseErrorSeconds) || Math.abs(reverseErrorSeconds) > 1) {
    return {
      status: TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.UNSUPPORTED,
      reason: "rounded civil datetime reverse-check 超過 1 second",
    };
  }

  const civil = getZonedDateTimeParts(new Date(roundedInstantMs), context.civil.timeZone);
  const dateTimeValue = formatDateTimeLocalParts(civil?.localParts);
  if (!dateTimeValue) {
    return { status: TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.UNSUPPORTED, reason: "resolved civil datetime unavailable" };
  }
  return Object.freeze({
    status: TRUE_SOLAR_CLOCK_RESOLUTION_STATUS.RESOLVED,
    instantMs: roundedInstantMs,
    dateTimeValue,
    targetLocalParts: Object.freeze({ ...targetLocalParts }),
    civilLocalParts: Object.freeze({ ...civil.localParts }),
    trueSolarLocalParts: Object.freeze({ ...reverseTrueSolarLocalParts }),
    errorSeconds: reverseErrorSeconds,
    iterations: resolved.iterations,
  });
}

function getLocalPartsWallDifferenceSeconds(target, actual) {
  if (!target || !actual) return NaN;
  const toWallMs = (parts) => Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond ?? 0,
  );
  return (toWallMs(target) - toWallMs(actual)) / 1_000;
}

function buildDateTimeValueFromDateAndChineseHour(year, month, day, hourIndex) {
  const startHour = getChineseHourStartHour(hourIndex);
  const clampedYear = clampQueryYear(year);
  if (!Number.isInteger(startHour) || clampedYear !== year) {
    return null;
  }

  const calendarDate = new Date(year, month, day);
  if (
    calendarDate.getFullYear() !== year
    || calendarDate.getMonth() !== month
    || calendarDate.getDate() !== day
  ) {
    return null;
  }

  const date = new Date(year, month, day, startHour, 0, 0);
  if (hourIndex === 1) {
    date.setDate(date.getDate() - 1);
  }

  return toLocalDatetimeValue(date);
}

function getChineseHourStartHour(hourIndex) {
  return CHINESE_HOUR_LABELS.find((hour) => hour.index === hourIndex)?.startHour ?? null;
}

function clampQueryYear(year) {
  if (!Number.isFinite(year)) {
    return QUERY_YEAR_MIN;
  }

  return Math.min(QUERY_YEAR_MAX, Math.max(QUERY_YEAR_MIN, Math.trunc(year)));
}

function isSameCalendarDate(date, year, month, day) {
  if (date instanceof Date) {
    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
  }

  return date?.year === year && date?.month === month && date?.day === day;
}

function requestRenderDateTime(dateTimeValue) {
  dateTimeValue = normalizeLocalDateTimeValueWithSeconds(dateTimeValue);
  if (!dateTimeValue) {
    return;
  }

  const requestId = ++latestBaziRenderRequestId;
  invalidateCurrentTrueSolarChartContext();
  renderChartQueryTimeModeStatus();
  if (chartTimeState.mode === CHART_TIME_MODE.TRUE_SOLAR) restoreWatchChartTime("手錶時間已變更，已恢復使用手錶時間排盤；請確認後重新套用真太陽時。", false);
  refreshBaziForCurrentChartTime(dateTimeValue, requestId);
  if (isCalculating) {
    pendingDateTimeValue = dateTimeValue;
    return;
  }

  void renderByDateTime(dateTimeValue);
}

function refreshBaziForCurrentChartTime(dateTimeValue, requestId) {
  dateTimeValue = normalizeLocalDateTimeValueWithSeconds(dateTimeValue);
  if (!currentSolarTerms || !dateTimeValue) {
    return false;
  }

  try {
    const effectiveDateTimeValue = resolveEffectiveChartDateTimeValue(dateTimeValue);
    // Keep the legacy/watch snapshot civil even while the active display is
    // true-solar; the formal true-solar result is rebuilt from its context
    // below and must not leak into Guideng/Qimen watch-only consumers.
    const result = calculateBaziFromSolarTerms(dateTimeValue, currentSolarTerms);
    if (!isLatestBaziRenderRequest(requestId)) {
      return false;
    }

    currentCalendarResult = result;
    currentWatchBaziResult = result;
    currentDateTimeValue = effectiveDateTimeValue;
    chartTimeState.watchDateTimeValue = dateTimeValue;
    chartTimeState.effectiveDateTimeValue = effectiveDateTimeValue;
    isJinhanDunTypeManuallyOverridden = false;
    if (isTrueSolarDisplayMode(chartDisplayMode)) {
      renderFormalTrueSolarChartTime();
    } else {
      renderResult(result, effectiveDateTimeValue);
    }
    refreshFlyingStarsForCurrentChartTime(requestId);
    void refreshJinhanForCurrentChartTime(requestId);
    return true;
  } catch {
    return false;
  }
}

function isLatestBaziRenderRequest(requestId) {
  return requestId === latestBaziRenderRequestId;
}

async function renderByDateTime(dateTimeValue, requestId = latestBaziRenderRequestId) {
  dateTimeValue = normalizeLocalDateTimeValueWithSeconds(dateTimeValue);
  if (!dateTimeValue) {
    return;
  }
  setMessage("計算中...", "loading");
  isCalculating = true;

  try {
    const solarTerms = await loadSolarTerms();
    if (!isLatestBaziRenderRequest(requestId)) {
      return;
    }
    const effectiveDateTimeValue = resolveEffectiveChartDateTimeValue(dateTimeValue);
    // `currentCalendarResult` remains the civil/watch compatibility snapshot;
    // true-solar Bazi is authoritative only through ChartTimeContext.
    const result = calculateBaziFromSolarTerms(dateTimeValue, solarTerms);
    if (!isLatestBaziRenderRequest(requestId)) {
      return;
    }
    currentCalendarResult = result;
    currentWatchBaziResult = result;
    currentSolarTerms = solarTerms;
    currentDateTimeValue = effectiveDateTimeValue;
    chartTimeState.watchDateTimeValue = dateTimeValue;
    chartTimeState.effectiveDateTimeValue = effectiveDateTimeValue;
    isJinhanDunTypeManuallyOverridden = false;
    if (isTrueSolarDisplayMode(chartDisplayMode)) {
      renderFormalTrueSolarChartTime();
    } else {
      renderResult(result, effectiveDateTimeValue);
    }
    renderQueryPicker();
    refreshFlyingStarsForCurrentChartTime(requestId);
    await renderJinhanYujing(result, effectiveDateTimeValue, requestId);
    if (!isLatestBaziRenderRequest(requestId)) {
      return;
    }
    renderQimenSection(effectiveDateTimeValue);
    renderActiveTrueSolarTime();
    renderBaziForActiveDisplayMode();
    renderChartTimeStatus();
    setMessage("", "");
  } catch (error) {
    if (!isLatestBaziRenderRequest(requestId)) {
      return;
    }
    currentCalendarResult = null;
    currentWatchBaziResult = null;
    currentSolarTerms = null;
    currentDateTimeValue = null;
    clearResult();
    const message = error instanceof Error ? error.message : String(error);
    setMessage(`查詢失敗：${message}`, "error");
  } finally {
    isCalculating = false;

    if (pendingDateTimeValue !== null && pendingDateTimeValue !== dateTimeValue) {
      const nextDateTimeValue = pendingDateTimeValue;
      pendingDateTimeValue = null;
      requestRenderDateTime(nextDateTimeValue);
    } else {
      pendingDateTimeValue = null;
      if (!isLatestBaziRenderRequest(requestId)) {
        setMessage("", "");
      }
    }
  }
}

function renderResult(result, dateTimeValue) {
  elements.baziTimeBasis.hidden = true;
  const displayContext = createCurrentWatchChartTimeContext(
    chartTimeState.watchDateTimeValue ?? elements.datetime.value
  );
  const dailyDaHuangDao = getDailyDaHuangDao(result.monthBranch, result.dayPillar?.[1]);
  renderPillar(elements.yearPillar, result.yearPillar, undefined, undefined, true);
  renderPillar(elements.monthPillar, result.monthPillar, undefined, undefined, true);
  renderPillar(elements.dayPillar, result.dayPillar, undefined, undefined, true);
  renderPillar(elements.hourPillar, result.hourPillar, undefined, undefined, true);
  renderSolarTermDayPanel(getSelectedSolarTermDay(), displayContext);
  renderPillarExtraPanel(result.jianchu, dailyDaHuangDao, result.dailyInfo);
  updateWeekdayLabel(dateTimeValue, result.dayPillar, result.jianchu, result.dailyInfo);
  renderSeasonInfo(result, displayContext);
  renderDongGongDaySelection(result);
  renderSpecNotes();
}

function renderBaziForActiveDisplayMode() {
  if (!currentCalendarResult || !currentSolarTerms) return;
  if (!isTrueSolarDisplayMode(chartDisplayMode)) {
    currentTrueSolarBaziResult = null;
    renderResult(currentCalendarResult, currentDateTimeValue ?? elements.datetime.value);
    return;
  }

  if (!currentTrueSolarChartContext) {
    currentTrueSolarBaziResult = null;
    renderUnavailableTrueSolarBazi();
    return;
  }

  try {
    currentTrueSolarBaziResult = calculateBaziFromChartTimeContext(
      currentTrueSolarChartContext,
      currentSolarTerms
    );
    renderTrueSolarBaziResult(currentTrueSolarBaziResult, currentTrueSolarChartContext);
  } catch (error) {
    currentTrueSolarBaziResult = null;
    currentTrueSolarChartContext = null;
    renderUnavailableTrueSolarBazi(error);
  }
}

function renderTrueSolarBaziResult(result, context) {
  renderPillar(elements.yearPillar, result.yearPillar, undefined, undefined, true);
  renderPillar(elements.monthPillar, result.monthPillar, undefined, undefined, true);
  renderPillar(elements.dayPillar, result.dayPillar, undefined, undefined, true);
  renderPillar(elements.hourPillar, result.hourPillar, undefined, undefined, true);
  const dailyDaHuangDao = getDailyDaHuangDao(result.monthBranch, result.dayPillar?.[1]);
  const safeTrueSolarDailyInfo = getSafeTrueSolarDailyInfo(result, context);
  const effectiveDayDateKey = getEffectiveDateKeyFromLocalParts(context.trueSolar?.localParts);
  renderPillarExtraPanel(result.jianchu, dailyDaHuangDao, safeTrueSolarDailyInfo);
    updateWeekdayLabelForEffectiveDay(
    effectiveDayDateKey,
    result.dayPillar,
    result.jianchu,
    safeTrueSolarDailyInfo,
    context
  );
  renderSolarTermDayPanel(getSelectedSolarTermDay(), context);
  renderSeasonInfo(result, context);
  elements.baziTimeBasis.hidden = false;
  elements.baziTimeBasis.textContent = "☀ 真太陽時";
  elements.baziTimeBasis.className = "bazi-time-basis is-true-solar";
}

function getSafeTrueSolarDailyInfo(result, context) {
  const dailyInfo = result?.dailyInfo;
  if (!dailyInfo) {
    return dailyInfo;
  }

  // Formal true-solar four-pillars currently uses the Asia/Taipei
  // compatibility phase.  Keep seasonal markers hidden for any future
  // overseas context until its local date ownership is specified.
  if (context?.civil?.timeZone !== "Asia/Taipei") {
    return { ...dailyInfo, seasonalMarker: null };
  }

  return dailyInfo;
}

function renderUnavailableTrueSolarBazi(error = null) {
  for (const element of [elements.yearPillar, elements.monthPillar, elements.dayPillar, elements.hourPillar]) {
    element.textContent = "--";
  }
  clearPillarExtraPanel();
  clearSolarTermDayPanel();
  elements.seasonInfo.replaceChildren(createSeasonInfoLine("尚未取得完整真太陽時資料。", "season-line-unavailable"));
  elements.baziTimeBasis.hidden = false;
  elements.baziTimeBasis.textContent = error ? "☀ 真太陽時（資料無效）" : "☀ 真太陽時（尚未就緒）";
  elements.baziTimeBasis.className = "bazi-time-basis is-true-solar is-unready";
}

function clearResult() {
  currentCalendarResult = null;
  currentWatchBaziResult = null;
  currentSolarTerms = null;
  elements.baziTimeBasis.hidden = true;
  updateWeekdayLabel("");
  for (const element of [
    elements.yearPillar,
    elements.monthPillar,
    elements.dayPillar,
    elements.hourPillar,
    elements.seasonInfo,
  ]) {
    element.textContent = "--";
  }
  clearPillarExtraPanel();
  clearSolarTermDayPanel();
  clearDongGongDaySelection();
  clearFlyingStars();
  clearJinhanYujing();
  clearQimenSection();
}

function getSelectedSolarTermDay() {
  if (!currentSolarTerms || !selectedCalendarDate) {
    return [];
  }

  return getSolarTermOnDate(currentSolarTerms, selectedCalendarDate);
}

function renderDongGongDaySelection(result) {
  const dongGong = getDongGongDaySelection({
    monthBranch: result?.monthBranch,
    dayPillar: result?.dayPillar,
    jianChu: result?.jianchu?.fullName,
  });

  elements.dongGongCard.replaceChildren(createDongGongContent(dongGong));
}

function clearDongGongDaySelection() {
  elements.dongGongCard.textContent = "董公擇日：資料待補";
}

function createDongGongContent(dongGong) {
  const container = document.createElement("article");
  container.className = "dong-gong-content";

  const heading = document.createElement("div");
  heading.className = "dong-gong-heading";

  const titleGroup = document.createElement("div");
  titleGroup.className = "dong-gong-title-group";
  titleGroup.append(
    createBlockSpan(formatDongGongSubtitle(dongGong), "dong-gong-title")
  );

  const level = dongGong.found ? dongGong.effectiveLevel : "資料待補";
  const badge = createInlineSpan(level || "資料待補", getDongGongLevelClassName(level));
  heading.append(titleGroup, badge);

  const summary = document.createElement("p");
  summary.className = "dong-gong-summary";
  summary.textContent = dongGong.effectiveSummary || "資料待補";

  container.append(heading, summary);
  appendDongGongListRow(container, "宜", dongGong.effectiveSuitable, "dong-gong-chip-suitable");
  appendDongGongListRow(container, "忌", dongGong.effectiveAvoid, "dong-gong-chip-avoid");
  appendDongGongListRow(container, "星曜 / 神煞", dongGong.effectiveStars, "dong-gong-chip-star");
  appendDongGongListRow(container, "備註", dongGong.effectiveNotes, "dong-gong-chip-note");

  const reminder = document.createElement("p");
  reminder.className = "dong-gong-reminder";
  reminder.textContent = "董公擇日僅列日期層級，未合本命、山向、時辰。";
  container.append(reminder);

  return container;
}

function formatDongGongSubtitle(dongGong) {
  if (dongGong.found) {
    return `${dongGong.title}｜${dongGong.dayPillar || "—"}`;
  }

  const monthText = dongGong.monthBranch ? `${dongGong.monthBranch}月令` : "月令—";
  const pillarText = dongGong.dayPillar || "日柱—";
  return `${monthText}｜${pillarText}`;
}

function appendDongGongListRow(container, labelText, items, chipClassName) {
  if (!Array.isArray(items) || items.length === 0) {
    return;
  }

  const row = document.createElement("div");
  row.className = "dong-gong-row";

  const label = document.createElement("span");
  label.className = "dong-gong-row-label";
  label.textContent = `${labelText}：`;

  const chips = document.createElement("span");
  chips.className = "dong-gong-chips";
  chips.append(...items.map((item) => createDongGongChip(item, chipClassName)));

  row.append(label, chips);
  container.append(row);
}

function createDongGongChip(text, className) {
  const chip = document.createElement("span");
  chip.className = `dong-gong-chip ${className}`.trim();
  chip.textContent = text;
  return chip;
}

function getDongGongLevelClassName(level) {
  const baseClass = "dong-gong-level-badge";

  if (["大吉", "吉", "次吉"].includes(level)) {
    return `${baseClass} dong-gong-level-good`;
  }

  if (["凶", "慎用"].includes(level)) {
    return `${baseClass} dong-gong-level-bad`;
  }

  if (level === "資料待補") {
    return `${baseClass} dong-gong-level-missing`;
  }

  return `${baseClass} dong-gong-level-neutral`;
}

function setMessage(text, state) {
  elements.message.textContent = text;
  elements.message.classList.toggle("message-loading", state === "loading");
  elements.message.classList.toggle("message-error", state === "error");
}

function renderTerm(element, label, term) {
  if (!term) {
    element.textContent = "--";
    return;
  }

  element.replaceChildren(
    createTermLine(label, term.name, "term-name"),
    createTermLine("交節時間", formatTermDateTime(term), "term-time")
  );
}

function renderCurrentHou(currentHou, nextHou) {
  if (!currentHou) {
    elements.currentHou.replaceChildren(createTermLine("七十二候", "—", "hou-empty"));
    return;
  }

  const houLines = [
    createHouVariantSection("七十二候", currentHou, "hou-name"),
    createTermLine(
      "候區間",
      `${formatHouRangeDateTime(currentHou.start)} ～ ${formatHouRangeDateTime(currentHou.end)}`,
      "hou-time"
    ),
  ];

  if (nextHou) {
    houLines.push(createHouVariantSection("下一候", nextHou, "hou-next"));
  } else {
    houLines.push(createTermLine("下一候", "—", "hou-next hou-empty"));
  }

  elements.currentHou.replaceChildren(...houLines);
}

function renderSeasonInfo(result, displayContext = null) {
  const currentTerm = result?.currentTerm ?? null;
  const nextTerm = result?.nextTerm ?? null;
  const currentHou = result?.currentHou ?? null;
  const nextHou = result?.nextHou ?? null;
  const lines = [
    createSeasonInfoLine(`目前節氣：${currentTerm?.name ?? "—"}`, "season-line-title"),
    createSeasonInfoLine(currentTerm ? formatTermDateTime(currentTerm, displayContext) : "—", "season-line-time"),
    createSeasonInfoLine("七十二候：", "season-line-title"),
    createSeasonInfoLine(formatSeasonHouVariantLine(currentHou, "zh"), "season-line-hou-current"),
    createSeasonInfoLine(formatSeasonHouVariantLine(currentHou, "jp"), "season-line-hou-current"),
    createSeasonInfoLine(
      currentHou ? `${formatHouRangeDateTime(currentHou.start, displayContext)} ～ ${formatHouRangeDateTime(currentHou.end, displayContext)}` : "—",
      "season-line-time"
    ),
    createSeasonInfoLine("下一候：", "season-line-next-title"),
    createSeasonInfoLine(formatSeasonHouVariantLine(nextHou, "zh"), "season-line-hou-next"),
    createSeasonInfoLine(formatSeasonHouVariantLine(nextHou, "jp"), "season-line-hou-next"),
    createSeasonInfoLine(`下一節氣：${nextTerm?.name ?? "—"}`, "season-line-title season-line-next-term"),
    createSeasonInfoLine(nextTerm ? formatTermDateTime(nextTerm, displayContext) : "—", "season-line-time"),
  ];

  elements.seasonInfo.replaceChildren(...lines);
}

function createSeasonInfoLine(text, className = "") {
  const line = document.createElement("div");
  line.className = `season-line ${className}`.trim();
  line.textContent = text;
  return line;
}

function formatHouTitle(hou) {
  return hou ? `${hou.term}${hou.phase}` : "—";
}

function formatSeasonHouVariantLine(hou, variantKey) {
  if (!hou) {
    return `(${variantKey === "zh" ? "中" : "日"}) —`;
  }

  const variant = getHouVariant(hou, variantKey);
  const label = variant.label || (variantKey === "zh" ? "中" : "日");
  return `(${label}) ${formatHouVariantLine(hou, variant)}`;
}

function renderSpecNotes() {
  const notes = [
    "本工具使用 Asia/Taipei 標準時間；立春換年、節令換月、23:00 換日。",
    "節氣資料來自 solar_terms_1899_2101.json；七十二候以節氣區間三等分。",
    "九宮飛星提供運、年、月、日、時盤，畫面合併運年月；金函玉鏡使用日盤資料表。",
    "預設使用手錶時間排盤；可於真太陽時頁籤輸入座標後手動套用，並可恢復手錶時間。",
  ];

  elements.ruleNotes.replaceChildren(
    ...notes.map((note) => {
      const item = document.createElement("li");
      item.textContent = note;
      return item;
    })
  );
}

function renderPillar(
  element,
  pillar,
  jianchu = undefined,
  dailyInfo = undefined,
  showBranchClash = false,
  dailyDaHuangDao = null
) {
  if (typeof pillar !== "string" || pillar.length < 2) {
    element.textContent = "--";
    return;
  }

  const parts = [
    createPillarPart(pillar[0], "pillar-stem"),
    createPillarPart(pillar[1], "pillar-branch"),
    createPillarPart(getNaYinByPillar(pillar), "pillar-nayin")
  ];

  if (jianchu !== undefined) {
    parts.push(createPillarPart(`建除：${jianchu?.fullName ?? "—"}`, "pillar-extra jianchu-label"));
  }

  if (dailyDaHuangDao) {
    parts.push(createDailyDaHuangDaoPart(dailyDaHuangDao));
  }

  if (showBranchClash) {
    const clashingZodiac = getClashingZodiacByBranch(pillar[1]);
    if (clashingZodiac) {
      parts.push(createPillarPart(`❌ 衝煞：${clashingZodiac}`, "pillar-extra pillar-clash-line"));
    }
  }

  if (dailyInfo !== undefined) {
    parts.push(...createDailyInfoPillarParts(dailyInfo));
  }

  element.replaceChildren(...parts);
}

function createPillarExtraPanel() {
  const panel = document.createElement("aside");
  panel.className = "pillar-extra-panel";
  panel.hidden = true;

  const lines = document.createElement("div");
  lines.className = "pillar-extra-panel-lines";

  panel.append(lines);
  return panel;
}

function createSolarTermDayPanel() {
  const panel = document.createElement("aside");
  panel.className = "pillar-extra-panel solar-term-day-panel";
  panel.hidden = true;
  return panel;
}

function renderSolarTermDayPanel(solarTerms, displayContext = null) {
  solarTermDayPanel.replaceChildren(
    ...solarTerms.map((term) => createBlockSpan(
      formatSolarTermDayPanelLine(term, displayContext),
      "solar-term-day-panel-line"
    ))
  );
  solarTermDayPanel.hidden = solarTerms.length === 0;
}

function formatSolarTermDayPanelLine(term, displayContext = null) {
  if (!displayContext) {
    return formatSolarTermDateTime(term);
  }
  const dateTimeText = formatDateTimeForChartMode({
    instantMs: term?.timeMs,
    context: displayContext,
    includeYear: false,
  });
  return term?.name && dateTimeText ? `🌤️ ${term.name}\n${dateTimeText}` : "—";
}

function clearSolarTermDayPanel() {
  solarTermDayPanel.replaceChildren();
  solarTermDayPanel.hidden = true;
}

function renderPillarExtraPanel(jianchu, dailyDaHuangDao, dailyInfo) {
  const lines = [];

  if (jianchu !== undefined) {
    lines.push(createPillarExtraPanelLine(`建除：${jianchu?.fullName ?? "—"}`, "jianchu-label"));
  }

  if (dailyDaHuangDao) {
    lines.push(createDailyDaHuangDaoPanelLine(dailyDaHuangDao));
  }

  lines.push(...createDailyInfoPanelLines(dailyInfo));

  const lineContainer = pillarExtraPanel.querySelector(".pillar-extra-panel-lines");
  lineContainer.replaceChildren(...lines);
  pillarExtraPanel.hidden = lines.length === 0;
}

function clearPillarExtraPanel() {
  const lineContainer = pillarExtraPanel.querySelector(".pillar-extra-panel-lines");
  lineContainer.replaceChildren();
  pillarExtraPanel.hidden = true;
}

function createDailyDaHuangDaoPart(dailyDaHuangDao) {
  const className = dailyDaHuangDao.type === "黃道"
    ? "pillar-extra pillar-extra-line daily-da-huang-dao daily-da-huang-dao-good"
    : "pillar-extra pillar-extra-line daily-da-huang-dao daily-da-huang-dao-bad";
  return createPillarPart(
    `${dailyDaHuangDao.deity}${dailyDaHuangDao.type}・${dailyDaHuangDao.fortune}`,
    className
  );
}

function createDailyDaHuangDaoPanelLine(dailyDaHuangDao) {
  const className = dailyDaHuangDao.type === "黃道"
    ? "daily-da-huang-dao daily-da-huang-dao-good"
    : "daily-da-huang-dao daily-da-huang-dao-bad";
  return createPillarExtraPanelLine(
    `${dailyDaHuangDao.deity}${dailyDaHuangDao.type}・${dailyDaHuangDao.fortune}`,
    className
  );
}

function createPillarExtraPanelLine(text, className = "") {
  const line = document.createElement("div");
  line.className = `pillar-extra-line ${className}`.trim();
  line.textContent = text;
  return line;
}

function appendSeasonalMarkerContent(line, seasonalMarker) {
  line.setAttribute("aria-label", seasonalMarker.label);
  line.title = seasonalMarker.label;

  const icon = document.createElement("span");
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "💀 ";

  const prefix = document.createElement("span");
  prefix.className = "seasonal-day-label-prefix";
  prefix.textContent = `${seasonalMarker.type}：`;

  const value = document.createElement("span");
  value.className = "seasonal-day-label-value";
  value.textContent = seasonalMarker.name;

  line.append(icon, prefix, value);
  return line;
}

function createSeasonalMarkerPillarPart(seasonalMarker) {
  return appendSeasonalMarkerContent(
    createPillarPart("", "pillar-extra daily-info-line"),
    seasonalMarker
  );
}

function createSeasonalMarkerPanelLine(seasonalMarker) {
  return appendSeasonalMarkerContent(
    createPillarExtraPanelLine("", "daily-info-line"),
    seasonalMarker
  );
}

function createPillarPart(text, className) {
  const part = document.createElement("span");
  part.className = className;
  part.textContent = text;
  return part;
}

function createDailyInfoPillarParts(dailyInfo) {
  const lines = [];

  if (dailyInfo?.baoYiHeZhiFa?.label) {
    lines.push(createPillarPart(dailyInfo.baoYiHeZhiFa.label, "pillar-extra daily-info-line"));
  }

  if (dailyInfo?.clash?.label) {
    lines.push(createPillarPart(`❌ ${dailyInfo.clash.label}`, "pillar-extra daily-info-line"));
  }

  if (dailyInfo?.suiPo?.isSuiPo) {
    lines.push(createPillarPart(`💀 ${dailyInfo.suiPo.label}`, "pillar-extra daily-info-line"));
  }

  if (dailyInfo?.tianShe?.isTianShe) {
    lines.push(createPillarPart(`😇 ${dailyInfo.tianShe.label}`, "pillar-extra daily-info-line"));
  }

  if (dailyInfo?.sanfu) {
    lines.push(createPillarPart(`♨ ${dailyInfo.sanfu.label}`, "pillar-extra daily-info-line"));
  }

  if (dailyInfo?.seasonalMarker) {
    lines.push(createSeasonalMarkerPillarPart(dailyInfo.seasonalMarker));
  }

  return lines;
}

function createDailyInfoPanelLines(dailyInfo) {
  const lines = [];

  if (dailyInfo?.baoYiHeZhiFa?.label) {
    lines.push(createPillarExtraPanelLine(dailyInfo.baoYiHeZhiFa.label, "daily-info-line"));
  }

  if (dailyInfo?.suiPo?.isSuiPo) {
    lines.push(createPillarExtraPanelLine(`💀 ${dailyInfo.suiPo.label}`, "daily-info-line"));
  }

  if (dailyInfo?.tianShe?.isTianShe) {
    lines.push(createPillarExtraPanelLine(`😇 ${dailyInfo.tianShe.label}`, "daily-info-line"));
  }

  if (dailyInfo?.sanfu) {
    lines.push(createPillarExtraPanelLine(`♨ ${dailyInfo.sanfu.label}`, "daily-info-line"));
  }

  if (dailyInfo?.seasonalMarker) {
    lines.push(createSeasonalMarkerPanelLine(dailyInfo.seasonalMarker));
  }

  return lines;
}

function renderDailyGods(dayPillar) {
  const dayStem = typeof dayPillar === "string" ? dayPillar[0] : "";
  const dailyGods = getDailyGodsByStem(dayStem);
  const cells = dailyGods.layout.flatMap((row) => row.map((palace) => createDailyGodsCell(palace)));
  elements.dailyGodsGrid.replaceChildren(...cells);
}

function createDailyGodsCell(palace) {
  const cell = document.createElement("div");
  cell.className = palace.id === "center" ? "daily-gods-palace daily-gods-center" : "daily-gods-palace";

  const badges = document.createElement("div");
  badges.className = "daily-gods-badges";
  badges.append(
    ...palace.gods.map((god) => {
      const badge = document.createElement("span");
      badge.className = "daily-gods-badge";
      badge.title = god.name;
      badge.textContent = god.shortLabel;
      return badge;
    })
  );

  const palaceLabel = document.createElement("div");
  palaceLabel.className = "daily-gods-corner daily-gods-corner-left";
  palaceLabel.textContent = `${palace.name}${palace.number}`;

  const directionLabel = document.createElement("div");
  directionLabel.className = "daily-gods-corner daily-gods-corner-right";
  directionLabel.textContent = palace.directionLabel;

  cell.append(badges, palaceLabel, directionLabel);
  return cell;
}

function refreshFlyingStarsForCurrentChartTime(requestId = latestBaziRenderRequestId) {
  if (!isLatestBaziRenderRequest(requestId)) {
    return false;
  }

  const isTrueSolar = isTrueSolarDisplayMode(chartDisplayMode);
  let context = null;
  let baziResult = null;
  if (isTrueSolar) {
    context = currentTrueSolarChartContext;
    baziResult = currentTrueSolarBaziResult;
    if (!context || !baziResult) {
      renderUnavailableFlyingStars("真太陽時九宮飛星尚未就緒：請先完成有效座標計算。");
      return false;
    }
    const watchDateTimeValue = chartTimeState.watchDateTimeValue ?? elements.datetime.value;
    if (context.compatibility?.watchLocalDateTimeValue !== watchDateTimeValue) {
      renderUnavailableFlyingStars("真太陽時九宮飛星尚未同步目前排盤時間。");
      return false;
    }
  } else {
    baziResult = currentWatchBaziResult ?? currentCalendarResult;
    const watchDateTimeValue = chartTimeState.watchDateTimeValue
      ?? elements.datetime.value
      ?? currentDateTimeValue;
    context = createCurrentWatchChartTimeContext(watchDateTimeValue);
    if (!context || !baziResult) {
      clearFlyingStars();
      return false;
    }
  }

  try {
    const charts = calculateFlyingStarsFromBaziResult(context, baziResult);
    if (!isLatestBaziRenderRequest(requestId)) {
      return false;
    }
    return renderFlyingStars(charts, requestId);
  } catch (error) {
    if (!isLatestBaziRenderRequest(requestId)) {
      return false;
    }
    console.error("九宮飛星計算失敗", error);
    clearFlyingStars();
    const message = error instanceof Error ? error.message : String(error);
    elements.flyingStarsMessage.textContent = `九宮飛星計算失敗：${message}`;
    return false;
  }
}

function getFormalChartLocationSnapshot() {
  const location = trueSolarTimeLocation;
  if (!location
    || !Number.isFinite(location.latitude)
    || location.latitude < -90
    || location.latitude > 90
    || !Number.isFinite(location.longitude)
    || location.longitude < -180
    || location.longitude > 180) {
    return null;
  }
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: Number.isFinite(location.accuracy) && location.accuracy >= 0
      ? location.accuracy
      : null,
  };
}

function createCurrentWatchChartTimeContext(dateTimeValue, options) {
  options = options ?? {};
  const { location = null } = options;
  dateTimeValue = normalizeLocalDateTimeValueWithSeconds(dateTimeValue);
  if (!dateTimeValue) {
    return null;
  }
  const localParts = parseTopQueryDateTimeLocalParts(dateTimeValue);
  if (!localParts) {
    return null;
  }
  const civilResolution = resolveLocalDateTimeInTimeZone({
    localParts,
    timeZone: "Asia/Taipei",
  });
  if (civilResolution.status !== "resolved") {
    return null;
  }
  return createWatchChartTimeContext({
    source: TRUE_SOLAR_TIME_SOURCE.QUERY,
    civil: {
      localParts: { ...civilResolution.localParts, millisecond: 0 },
      timeZone: civilResolution.timeZone,
      utcOffsetMinutes: civilResolution.utcOffsetMinutes,
      abbreviation: civilResolution.abbreviation,
      instantMs: civilResolution.instant.getTime(),
    },
    compatibility: {
      taipeiLegacyDateTimeValue: dateTimeValue,
    },
    location,
    createdAtInstantMs: Date.now(),
  });
}

function renderUnavailableFlyingStars(message) {
  clearFlyingStars();
  elements.flyingStarsMessage.textContent = message;
}

function renderFlyingStars(charts, requestId = null) {
  if (requestId !== null && !isLatestBaziRenderRequest(requestId)) {
    return false;
  }
  try {
    const afflictionViewModel = createFlyingStarAfflictionViewModel(charts);
    if (requestId !== null && !isLatestBaziRenderRequest(requestId)) {
      return false;
    }
    elements.flyingStarsMessage.textContent = "";
    elements.flyingStars.replaceChildren(
      createCombinedFlyingStarChart(charts, afflictionViewModel),
      createFlyingStarChart(
        "運盤",
        charts.period,
        charts.period,
        afflictionViewModel.individualCellMarkers.period
      ),
      createFlyingStarChart(
        "年盤",
        charts.annual,
        charts.period,
        afflictionViewModel.individualCellMarkers.annual
      ),
      createFlyingStarChart(
        "月盤",
        charts.monthly,
        charts.period,
        afflictionViewModel.individualCellMarkers.monthly
      ),
      createFlyingStarChart(
        "日盤",
        charts.daily,
        charts.period,
        afflictionViewModel.individualCellMarkers.daily
      ),
      createFlyingStarChart(
        "時盤",
        charts.hourly,
        charts.period,
        afflictionViewModel.individualCellMarkers.hourly
      )
    );
    return true;
  } catch (error) {
    if (requestId !== null && !isLatestBaziRenderRequest(requestId)) {
      return false;
    }
    console.error("九宮飛星計算失敗", error);
    clearFlyingStars();
    const message = error instanceof Error ? error.message : String(error);
    elements.flyingStarsMessage.textContent = `九宮飛星計算失敗：${message}`;
    return false;
  }
}

function clearFlyingStars() {
  elements.flyingStars.replaceChildren();
  elements.flyingStarsMessage.textContent = "";
}

async function refreshJinhanForCurrentChartTime(requestId = latestBaziRenderRequestId) {
  if (!isLatestBaziRenderRequest(requestId)) {
    return false;
  }

  const isTrueSolar = isTrueSolarDisplayMode(chartDisplayMode);
  const context = isTrueSolar
    ? currentTrueSolarChartContext
    : createCurrentWatchChartTimeContext(
      chartTimeState.watchDateTimeValue
        ?? currentDateTimeValue
        ?? elements.datetime.value,
      { location: getFormalChartLocationSnapshot() }
    );
  const baziResult = isTrueSolar
    ? currentTrueSolarBaziResult
    : currentWatchBaziResult ?? currentCalendarResult;

  if (!currentSolarTerms || !context || !baziResult) {
    currentJinhanRenderSnapshot = null;
    currentJinhanRenderGeneration = 0;
    currentJinhanRenderKey = null;
    clearJinhanYujing(isTrueSolar
      ? "真太陽時金函玉鏡尚未就緒。"
      : "尚無日柱資料，無法顯示金函玉鏡日盤");
    return false;
  }

  let adapterResult;
  try {
    adapterResult = calculateJinhanFromChartTimeContext({
      context,
      baziResult,
      solarTerms: currentSolarTerms,
    });
  } catch (error) {
    console.error("金函玉鏡 ChartTimeContext 計算失敗", error);
    currentJinhanRenderSnapshot = null;
    currentJinhanRenderGeneration = 0;
    currentJinhanRenderKey = null;
    clearJinhanYujing(isTrueSolar
      ? "真太陽時金函玉鏡資料無效。"
      : "金函玉鏡日盤計算失敗");
    return false;
  }

  if (!isLatestBaziRenderRequest(requestId)) {
    return false;
  }

  const selectedDunType = resolveJinhanSelectedDunType(adapterResult.dunTypeResult);
  const allowManualRecovery = isJinhanDunTypeManuallyOverridden
    && selectedDunType.source === "manual";
  if (adapterResult.status !== "resolved" && !allowManualRecovery) {
    currentJinhanRenderSnapshot = null;
    currentJinhanRenderGeneration = 0;
    currentJinhanRenderKey = null;
    clearJinhanYujing(isTrueSolar
      ? "真太陽時金函玉鏡尚未取得完整節氣資料。"
      : "尚未取得完整節氣資料，無法自動判斷金函玉鏡陰陽遁。");
    return false;
  }

  const renderSnapshot = createJinhanRenderSnapshot(adapterResult, selectedDunType);
  if (!renderSnapshot?.pan) {
    currentJinhanRenderSnapshot = null;
    currentJinhanRenderGeneration = 0;
    currentJinhanRenderKey = null;
    clearJinhanYujing("查無金函玉鏡日盤資料");
    return false;
  }

  try {
    if (!isLatestBaziRenderRequest(requestId)) {
      return false;
    }
    const renderKey = createJinhanRenderKey({
      context,
      renderSnapshot,
      selectedDunType,
    });
    // A single request can enter through both the lightweight and full
    // render paths. Reuse the existing immutable snapshot so a later
    // core-only write cannot clear an already committed GuiDeng display.
    if (currentJinhanRenderGeneration === requestId
      && currentJinhanRenderKey === renderKey
      && currentJinhanRenderSnapshot) {
      return true;
    }
    currentGuiDengAdapterResult = null;
    currentGuiDengDisplayModel = null;
    currentJinhanRenderSnapshot = renderSnapshot;
    currentJinhanRenderGeneration = requestId;
    currentJinhanRenderKey = renderKey;
    if (!renderJinhanCoreSnapshot(renderSnapshot, requestId)) {
      return false;
    }
    // Solar-event calculation is intentionally fire-and-guarded.  The Bazi,
    // Flying Stars and Jinhan core commit above must not wait on GuiDeng.
    void refreshGuiDengForCurrentChartTime(requestId, {
      context,
      baziResult,
      renderSnapshot,
    });
    return true;
  } catch (error) {
    if (!isLatestBaziRenderRequest(requestId)) {
      return false;
    }
    console.error("金函玉鏡日盤顯示失敗", error);
    currentJinhanRenderSnapshot = null;
    currentJinhanRenderGeneration = 0;
    currentJinhanRenderKey = null;
    clearJinhanYujing("金函玉鏡日盤顯示失敗");
    return false;
  }
}

function renderJinhanCoreSnapshot(renderSnapshot, requestId) {
  if (!isLatestBaziRenderRequest(requestId)
    || currentJinhanRenderSnapshot !== renderSnapshot
    || currentJinhanRenderGeneration !== requestId) {
    return false;
  }

  elements.jinhanMessage.textContent = "";
  updateJinhanCurrentHourLabel(renderSnapshot.chineseHour);
  elements.jinhanSummary.replaceChildren(
    ...createJinhanSummaryItems(renderSnapshot.dayPillar, renderSnapshot.pan, null)
  );
  elements.jinhanGrid.replaceChildren(
    ...createJinhanGridCells(renderSnapshot.pan, renderSnapshot.deitiesByPalace)
  );
  elements.jinhanHoursBody.replaceChildren(
    ...renderSnapshot.blackYellowHours.map((hour, index) =>
      createJinhanHourRow(hour, renderSnapshot.currentHourIndex, index + 1, new Set())
    )
  );
  return true;
}

/**
 * Calculates and decorates the existing Jinhan summary/hour rows from the
 * active mode's GuiDeng ChartTimeContext snapshot.  This is the only formal
 * GuiDeng runtime path; legacy getGuiDengForCalendarResult remains below for
 * compatibility tests and old callers only.
 */
async function refreshGuiDengForCurrentChartTime(requestId = latestBaziRenderRequestId, snapshotInput = null) {
  if (!isLatestBaziRenderRequest(requestId)
    || currentJinhanRenderGeneration !== requestId
    || !currentJinhanRenderSnapshot) {
    return false;
  }

  const renderSnapshot = snapshotInput?.renderSnapshot ?? currentJinhanRenderSnapshot;
  if (renderSnapshot !== currentJinhanRenderSnapshot) {
    return false;
  }
  const isTrueSolar = isTrueSolarDisplayMode(chartDisplayMode);
  const context = snapshotInput?.context ?? (isTrueSolar
    ? currentTrueSolarChartContext
    : createCurrentWatchChartTimeContext(
      chartTimeState.watchDateTimeValue
        ?? currentDateTimeValue
        ?? elements.datetime.value,
      { location: getFormalChartLocationSnapshot() }
    ));
  const baziResult = snapshotInput?.baziResult ?? (isTrueSolar
    ? currentTrueSolarBaziResult
    : currentWatchBaziResult ?? currentCalendarResult);
  const expectedMode = isTrueSolar ? "true-solar" : "watch";

  if (context && context.mode !== expectedMode) {
    return false;
  }

  if (!currentSolarTerms || !context || !baziResult) {
    currentGuiDengAdapterResult = null;
    currentGuiDengDisplayModel = null;
    return renderGuiDengDecorations(renderSnapshot, null, requestId, isTrueSolar
      ? "真太陽時登貴尚未就緒。"
      : "登貴尚未就緒。");
  }

  if (!isLatestBaziRenderRequest(requestId)) {
    return false;
  }

  let adapterResult;
  try {
    adapterResult = await calculateGuiDengFromChartTimeContext({
      context,
      baziResult,
      solarEventCalculator: calculateCachedGuiDengSolarEvents,
    });
  } catch (error) {
    if (!isLatestBaziRenderRequest(requestId)
      || currentJinhanRenderSnapshot !== renderSnapshot
      || currentJinhanRenderGeneration !== requestId) {
      return false;
    }
    console.error("登貴 ChartTimeContext 計算失敗", error);
    currentGuiDengAdapterResult = null;
    currentGuiDengDisplayModel = null;
    return renderGuiDengDecorations(renderSnapshot, null, requestId,
      isTrueSolar ? "真太陽時登貴資料無效。" : "登貴資料無效。");
  }

  if (!isLatestBaziRenderRequest(requestId)
    || currentJinhanRenderSnapshot !== renderSnapshot
    || currentJinhanRenderGeneration !== requestId) {
    return false;
  }

  let displayModel;
  try {
    displayModel = createGuiDengDisplayModel({ result: adapterResult, context });
  } catch (error) {
    console.error("登貴 display model 建立失敗", error);
    displayModel = Object.freeze({ status: GUIDENG_CHART_TIME_STATUS.UNSUPPORTED, reason: "登貴顯示資料無效" });
  }

  if (!isLatestBaziRenderRequest(requestId)
    || currentJinhanRenderSnapshot !== renderSnapshot
    || currentJinhanRenderGeneration !== requestId) {
    return false;
  }

  if (displayModel.mode !== expectedMode) {
    return false;
  }

  currentGuiDengAdapterResult = adapterResult;
  currentGuiDengDisplayModel = displayModel;
  const unavailableMessage = displayModel.status === GUIDENG_CHART_TIME_STATUS.RESOLVED
    ? ""
    : (isTrueSolar ? "真太陽時登貴目前無可用日出／日落時間窗。" : "登貴目前無可用日出／日落時間窗。");
  return renderGuiDengDecorations(renderSnapshot, displayModel, requestId, unavailableMessage);
}

function renderGuiDengDecorations(renderSnapshot, displayModel, requestId, unavailableMessage = "") {
  if (!isLatestBaziRenderRequest(requestId)
    || currentJinhanRenderSnapshot !== renderSnapshot
    || currentJinhanRenderGeneration !== requestId) {
    return false;
  }

  const expectedMode = isTrueSolarDisplayMode(chartDisplayMode) ? "true-solar" : "watch";
  if (displayModel && displayModel.mode !== expectedMode) {
    return false;
  }

  const resolvedDisplayModel = displayModel?.status === GUIDENG_CHART_TIME_STATUS.RESOLVED
    ? displayModel
    : null;
  const dengGuiBranches = getDengGuiBranchSet(resolvedDisplayModel);
  elements.jinhanMessage.textContent = unavailableMessage;
  elements.jinhanSummary.replaceChildren(
    ...createJinhanSummaryItems(renderSnapshot.dayPillar, renderSnapshot.pan, resolvedDisplayModel)
  );
  elements.jinhanHoursBody.replaceChildren(
    ...renderSnapshot.blackYellowHours.map((hour, index) =>
      createJinhanHourRow(hour, renderSnapshot.currentHourIndex, index + 1, dengGuiBranches)
    )
  );
  return true;
}

// Keep the existing renderer entry point as the single Jinhan core render
// entry.  GuiDeng decorations update the same summary/hour DOM after their
// guarded async snapshot; no second GuiDeng section or renderer is created.
async function renderJinhanYujing(calendarResult, dateTimeValue, requestId = null) {
  void calendarResult;
  void dateTimeValue;
  return refreshJinhanForCurrentChartTime(
    requestId === null ? latestBaziRenderRequestId : requestId
  );
}

function createJinhanRenderSnapshot(adapterResult, selectedDunType) {
  const selectedDun = selectedDunType?.dunType;
  const isAutoPan = selectedDun === adapterResult.dunTypeResult?.dunType;
  const pan = isAutoPan
    ? adapterResult.pan
    : getJinhanYujingDayPan(adapterResult.dayPillar, selectedDun);
  if (!pan) {
    return null;
  }

  return {
    ...adapterResult,
    effectiveDunType: selectedDun,
    pan,
    deitiesByPalace: isAutoPan
      ? adapterResult.deitiesByPalace
      : getJinhanDeitiesByPalace(pan.meta),
    blackYellowHours: adapterResult.blackYellowHours?.length > 0
      ? adapterResult.blackYellowHours
      : getJinhanBlackYellowHours(adapterResult.dayPillar),
  };
}

function createJinhanRenderKey({ context, renderSnapshot, selectedDunType } = {}) {
  return JSON.stringify({
    mode: context?.mode ?? null,
    timeZone: context?.civil?.timeZone ?? null,
    utcOffsetMinutes: context?.civil?.utcOffsetMinutes ?? null,
    queryInstantMs: context?.civil?.instantMs ?? null,
    trueSolarLocalParts: context?.trueSolar?.localParts ?? null,
    solarEventCivilDateKey: context?.astronomy?.solarEventCivilDateKey ?? null,
    location: context?.location
      ? [context.location.latitude, context.location.longitude]
      : null,
    dayPillar: renderSnapshot?.dayPillar ?? null,
    effectiveDunType: selectedDunType?.dunType ?? null,
    panLabel: renderSnapshot?.pan?.meta?.label ?? null,
    currentHourIndex: renderSnapshot?.currentHourIndex ?? null,
  });
}

async function getGuiDengForCalendarResult(calendarResult, dateTimeValue) {
  const dayStem = typeof calendarResult?.dayPillar === "string" ? calendarResult.dayPillar[0] : "";
  const monthGeneral = getMonthGeneralBySolarTermName(calendarResult?.currentTerm?.name);

  if (!dayStem || !monthGeneral) {
    return null;
  }

  return calculateGuiDengForDate({
    date: parseDateTimeLocalValue(dateTimeValue),
    dayStem,
    monthGeneral,
    ...(chartTimeState.mode === CHART_TIME_MODE.TRUE_SOLAR ? chartTimeState.location : {}),
  });
}

async function calculateCachedGuiDengSolarEvents(options = {}) {
  const cacheKey = createGuiDengSolarEventCacheKey(options);
  if (cacheKey && guiDengSolarEventCache.has(cacheKey)) {
    const cached = guiDengSolarEventCache.get(cacheKey);
    const cachedResult = cached instanceof Promise ? await cached : cached;
    return cloneGuiDengSolarEventResult(cachedResult);
  }

  const calculation = Promise.resolve().then(() => calculateSolarEvents(options));
  if (cacheKey) {
    if (guiDengSolarEventCache.size >= GUI_DENG_SOLAR_EVENT_CACHE_MAX_SIZE) {
      const oldestKey = guiDengSolarEventCache.keys().next().value;
      if (oldestKey !== undefined) {
        guiDengSolarEventCache.delete(oldestKey);
      }
    }
    guiDengSolarEventCache.set(cacheKey, calculation.then(
      (result) => {
        guiDengSolarEventCache.set(cacheKey, cloneGuiDengSolarEventResult(result));
        return result;
      },
      (error) => {
        guiDengSolarEventCache.delete(cacheKey);
        throw error;
      }
    ));
  }
  return cloneGuiDengSolarEventResult(await calculation);
}

function createGuiDengSolarEventCacheKey({ date, latitude, longitude, utcOffsetMinutes, useUtcComponents } = {}) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())
    || !Number.isFinite(latitude) || !Number.isFinite(longitude)
    || !Number.isFinite(utcOffsetMinutes)) {
    return null;
  }
  return [
    date.getTime(),
    latitude,
    longitude,
    utcOffsetMinutes,
    useUtcComponents === true ? "utc" : "local",
  ].join("|");
}

function cloneGuiDengSolarEventResult(result) {
  if (!result || typeof result !== "object") {
    return result;
  }
  return {
    ...result,
    sunrise: result.sunrise instanceof Date ? new Date(result.sunrise.getTime()) : result.sunrise,
    sunset: result.sunset instanceof Date ? new Date(result.sunset.getTime()) : result.sunset,
  };
}

function resolveJinhanSelectedDunType(dunTypeStatus) {
  const manualDunType = elements.jinhanDunType.value || "陽遁";

  if (
    !isJinhanDunTypeManuallyOverridden &&
    dunTypeStatus.status === "resolved" &&
    dunTypeStatus.dunType
  ) {
    elements.jinhanDunType.value = dunTypeStatus.dunType;
    return {
      dunType: dunTypeStatus.dunType,
      source: "auto",
    };
  }

  return {
    dunType: manualDunType,
    source: isJinhanDunTypeManuallyOverridden ? "manual" : "fallback",
  };
}

function clearJinhanYujing(message = "") {
  currentJinhanRenderSnapshot = null;
  currentJinhanRenderGeneration = 0;
  currentJinhanRenderKey = null;
  currentGuiDengAdapterResult = null;
  currentGuiDengDisplayModel = null;
  elements.jinhanMessage.textContent = message;
  updateJinhanCurrentHourLabel(null);
  elements.jinhanSummary.replaceChildren();
  elements.jinhanGrid.replaceChildren();
  elements.jinhanHoursBody.replaceChildren();
}

function createQimenSection() {
  const section = document.createElement("section");
  section.className = "qimen-section";
  section.setAttribute("aria-labelledby", "qimen-title");

  const heading = document.createElement("div");
  heading.className = "qimen-heading";

  const title = document.createElement("h2");
  title.id = "qimen-title";
  title.textContent = "奇門遁甲";

  const subtitle = document.createElement("p");
  subtitle.className = "qimen-subtitle";
  subtitle.textContent = "置閏法定局";

  heading.append(title, subtitle);

  const body = document.createElement("div");
  body.className = "qimen-body";

  const summaryPanel = document.createElement("div");
  summaryPanel.className = "qimen-summary-panel";

  const infoCard = document.createElement("section");
  infoCard.className = "panel qimen-info-card";

  const summary = document.createElement("div");
  summary.className = "qimen-summary";

  const platePanel = document.createElement("div");
  platePanel.className = "qimen-plate-panel";

  const manualControls = document.createElement("div");
  manualControls.className = "qimen-manual-controls";

  const manualControlRow = document.createElement("div");
  manualControlRow.className = "qimen-manual-control-row";

  const manualToggleLabel = document.createElement("label");
  manualToggleLabel.className = "qimen-manual-toggle";

  const manualToggle = document.createElement("input");
  manualToggle.type = "checkbox";
  manualToggle.className = "qimen-manual-toggle-input";

  const manualToggleText = document.createElement("span");
  manualToggleText.textContent = "手動覆寫盤面遁局";

  manualToggleLabel.append(manualToggle, manualToggleText);

  const manualFields = document.createElement("div");
  manualFields.className = "qimen-manual-fields";

  const dunField = createQimenManualField("遁別");
  const manualDunSelect = document.createElement("select");
  manualDunSelect.className = "qimen-manual-dun-select";
  manualDunSelect.append(
    createOption("yang", "陽遁"),
    createOption("yin", "陰遁")
  );
  dunField.append(manualDunSelect);

  const juField = createQimenManualField("局數");
  const manualJuSelect = document.createElement("select");
  manualJuSelect.className = "qimen-manual-ju-select";
  for (let ju = 1; ju <= 9; ju += 1) {
    manualJuSelect.append(createOption(String(ju), formatQimenJuLabel(ju)));
  }
  juField.append(manualJuSelect);

  const manualRestore = document.createElement("button");
  manualRestore.type = "button";
  manualRestore.className = "qimen-manual-restore";
  manualRestore.textContent = "恢復自動";

  manualFields.append(dunField, juField, manualRestore);

  const manualHint = document.createElement("p");
  manualHint.className = "qimen-manual-hint";
  manualHint.textContent = "手動覆寫只影響盤面查表，不改變左側自動定局。";

  manualControlRow.append(manualToggleLabel, manualFields);
  manualControls.append(manualControlRow, manualHint);

  const fallback = document.createElement("p");
  fallback.className = "qimen-fallback";
  fallback.setAttribute("role", "status");
  fallback.setAttribute("aria-live", "polite");

  const plateSection = createQimenPlateSection();

  summaryPanel.append(summary);
  infoCard.append(heading, summaryPanel);
  platePanel.append(manualControls, plateSection, fallback);
  body.append(infoCard, platePanel);
  section.append(body);

  return {
    section,
    summary,
    plateSection,
    manualToggle,
    manualFields,
    manualDunSelect,
    manualJuSelect,
    manualRestore,
    manualHint,
    fallback,
  };
}

function insertQimenSection(section) {
  elements.qimenTabPanel.append(section);
}

function syncTrueSolarTimeLocationFromCoordinateInput(options) {
  const { showError = true } = options ?? {};
  const rawInput = typeof elements.trueSolarTimeCoordinate.value === "string"
    ? elements.trueSolarTimeCoordinate.value
    : "";
  if (rawInput.length > 128) {
    trueSolarTimeLocation = null;
    if (showError) {
      setTrueSolarTimeStatus("座標輸入過長，請縮短後再試。", "error");
    }
    return null;
  }
  const input = rawInput.trim();
  if (!input) {
    trueSolarTimeLocation = null;
    if (showError) {
      setTrueSolarTimeStatus("請輸入經緯度。", "error");
    }
    return null;
  }

  const coordinate = parseCoordinateInput(input);
  if (!coordinate) {
    trueSolarTimeLocation = null;
    if (showError) {
      setTrueSolarTimeStatus("無法辨識座標，請貼上 Google Maps 經緯度。", "error");
    }
    return null;
  }

  const previousLocation = trueSolarTimeLocation;
  const isSameLocation = previousLocation
    && previousLocation.latitude === coordinate.latitude
    && previousLocation.longitude === coordinate.longitude;
  trueSolarTimeLocation = {
    ...coordinate,
    ...(isSameLocation && Number.isFinite(previousLocation.accuracy)
      ? { accuracy: previousLocation.accuracy }
      : {}),
  };
  elements.trueSolarTimeCoordinate.value = coordinate.normalizedText;
  return trueSolarTimeLocation;
}

function handleTrueSolarTimeCoordinateInput() {
  trueSolarTimeLocation = null;
  clearTrueSolarTimePresentation();
  if (isTrueSolarDisplayMode(chartDisplayMode)) {
    const requestId = ++latestBaziRenderRequestId;
    renderBaziForActiveDisplayMode();
    refreshFlyingStarsForCurrentChartTime(requestId);
    void refreshJinhanForCurrentChartTime(requestId);
    renderChartTimeStatus();
  }
}

function handleTrueSolarTimeCoordinateChange() {
  const location = syncTrueSolarTimeLocationFromCoordinateInput({ showError: true });
  if (!location) {
    clearTrueSolarTimePresentation();
    if (isTrueSolarDisplayMode(chartDisplayMode)) {
      const requestId = ++latestBaziRenderRequestId;
      renderBaziForActiveDisplayMode();
      refreshFlyingStarsForCurrentChartTime(requestId);
      void refreshJinhanForCurrentChartTime(requestId);
      renderChartTimeStatus();
    } else {
      refreshFormalWatchGuiDengAfterLocationChange();
    }
    return;
  }
  if (isTrueSolarDisplayMode(chartDisplayMode)) {
    const requestId = ++latestBaziRenderRequestId;
    renderFormalTrueSolarChartTime();
    refreshFlyingStarsForCurrentChartTime(requestId);
    void refreshJinhanForCurrentChartTime(requestId);
  } else {
    refreshFormalWatchGuiDengAfterLocationChange();
  }
  renderActiveTrueSolarTime();
}

function refreshFormalWatchGuiDengAfterLocationChange() {
  if (isTrueSolarDisplayMode(chartDisplayMode)) return;
  const requestId = ++latestBaziRenderRequestId;
  void refreshJinhanForCurrentChartTime(requestId);
}

function calculateTrueSolarTimeFromCoordinateInput() {
  const location = syncTrueSolarTimeLocationFromCoordinateInput({ showError: true });
  if (!location) return;
  if (isTrueSolarDisplayMode(chartDisplayMode)) {
    const requestId = ++latestBaziRenderRequestId;
    renderFormalTrueSolarChartTime();
    refreshFlyingStarsForCurrentChartTime(requestId);
    void refreshJinhanForCurrentChartTime(requestId);
  } else {
    refreshFormalWatchGuiDengAfterLocationChange();
  }
  renderActiveTrueSolarTime();
}

function requestTrueSolarTimeGeolocation() {
  if (!navigator.geolocation) {
    setTrueSolarTimeStatus("此瀏覽器不支援自動定位，請手動輸入座標。", "error");
    return;
  }
  elements.trueSolarTimeGeolocate.disabled = true;
  elements.trueSolarTimeGeolocate.textContent = "取得位置中…";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      trueSolarTimeLocation = { latitude, longitude, normalizedText: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`, sourceFormat: "geolocation", accuracy };
      elements.trueSolarTimeCoordinate.value = trueSolarTimeLocation.normalizedText;
      if (isTrueSolarDisplayMode(chartDisplayMode)) {
        const requestId = ++latestBaziRenderRequestId;
        renderFormalTrueSolarChartTime();
        refreshFlyingStarsForCurrentChartTime(requestId);
        void refreshJinhanForCurrentChartTime(requestId);
      } else {
        refreshFormalWatchGuiDengAfterLocationChange();
      }
      renderActiveTrueSolarTime();
      setTrueSolarTimeStatus(`定位精確度：約 ${Math.round(accuracy)} 公尺`, "");
      restoreTrueSolarTimeGeolocateButton();
    },
    (error) => {
      const message = error.code === error.PERMISSION_DENIED
        ? "未取得位置，請改用手動輸入座標。"
        : error.code === error.TIMEOUT
          ? "取得位置逾時，請稍後再試或改用手動輸入。"
          : "目前無法取得位置，請改用手動輸入座標。";
      setTrueSolarTimeStatus(message, "error");
      restoreTrueSolarTimeGeolocateButton();
    },
    { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 }
  );
}

function restoreTrueSolarTimeGeolocateButton() {
  elements.trueSolarTimeGeolocate.disabled = false;
  elements.trueSolarTimeGeolocate.textContent = "自動取得真太陽時";
}

function renderTrueSolarTimeForWatchDate(dateTimeValue) {
  if (trueSolarTimeSource !== TRUE_SOLAR_TIME_SOURCE.QUERY) return;
  dateTimeValue = normalizeLocalDateTimeValueWithSeconds(dateTimeValue);
  const localParts = parseTopQueryDateTimeLocalParts(dateTimeValue);
  if (!localParts) return;
  renderTrueSolarTimeForContext({
    source: TRUE_SOLAR_TIME_SOURCE.QUERY,
    localParts,
    timeZone: "Asia/Taipei",
    utcOffsetMinutes: TAIPEI_UTC_OFFSET_MINUTES,
    abbreviation: "",
  });
}

function renderTrueSolarTimeForDeviceNow() {
  if (trueSolarTimeSource !== TRUE_SOLAR_TIME_SOURCE.DEVICE) return;
  const now = new Date();
  const timeZone = getDeviceTimeZone() || "UTC";
  const zoned = getZonedDateTimeParts(now, timeZone) ?? getZonedDateTimeParts(now, "UTC");
  if (!zoned) {
    clearTrueSolarTimePresentation({ clearFormalChart: false });
    setTrueSolarTimeStatus("目前無法讀取裝置時區。", "error");
    return;
  }
  elements.trueSolarTimeDeviceLocalTime.textContent = formatDateTimeParts(zoned.localParts);
  elements.trueSolarTimeDeviceTimeZone.textContent = zoned.timeZone;
  elements.trueSolarTimeDeviceOffset.textContent = `${zoned.abbreviation ? `${zoned.abbreviation} ` : ""}(${zoned.offsetText})`;
  renderTrueSolarTimeForContext({
    source: TRUE_SOLAR_TIME_SOURCE.DEVICE,
    localParts: zoned.localParts,
    timeZone: zoned.timeZone,
    utcOffsetMinutes: zoned.utcOffsetMinutes,
    abbreviation: zoned.abbreviation,
  });
}

function renderTrueSolarTimeForCustomInput() {
  if (trueSolarTimeSource !== TRUE_SOLAR_TIME_SOURCE.CUSTOM) return;
  const localParts = parseTrueSolarTimeCustomLocalParts(
    elements.trueSolarTimeLocalDate.value,
    elements.trueSolarTimeLocalTime.value
  );
  const initialResolution = resolveLocalDateTimeInTimeZone({
    localParts,
    timeZone: elements.trueSolarTimeTimeZone.value,
  });
  elements.trueSolarTimeDisambiguation.hidden = true;
  if (initialResolution.status === "nonexistent") {
    clearTrueSolarTimePresentation({ clearFormalChart: false });
    setTrueSolarTimeTimeZoneStatus("此當地時間因日光節約時間切換而不存在，請選擇其他時間。", "error");
    return;
  }
  if (initialResolution.status === "ambiguous") {
    configureTrueSolarTimeDisambiguation(initialResolution.candidates, trueSolarTimeCustomDisambiguation);
    if (!trueSolarTimeCustomDisambiguation) {
      clearTrueSolarTimePresentation({ clearFormalChart: false });
      setTrueSolarTimeTimeZoneStatus("此當地時間出現兩次，請選擇實際使用的時間。", "error");
      return;
    }
  }
  if (initialResolution.status !== "resolved" && initialResolution.status !== "ambiguous") {
    clearTrueSolarTimePresentation({ clearFormalChart: false });
    setTrueSolarTimeTimeZoneStatus(
      initialResolution.status === "invalid-time-zone" ? "請輸入有效的 IANA 時區。" : "請輸入有效的當地日期與時間。",
      "error"
    );
    return;
  }
  const resolved = initialResolution.status === "ambiguous"
    ? resolveLocalDateTimeInTimeZone({
      localParts,
      timeZone: elements.trueSolarTimeTimeZone.value,
      disambiguation: trueSolarTimeCustomDisambiguation,
    })
    : initialResolution;
  if (resolved.status !== "resolved") {
    clearTrueSolarTimePresentation({ clearFormalChart: false });
    setTrueSolarTimeTimeZoneStatus("此當地時間無法解析，請重新選擇。", "error");
    return;
  }
  setTrueSolarTimeTimeZoneStatus("", "");
  renderTrueSolarTimeForContext({
    source: TRUE_SOLAR_TIME_SOURCE.CUSTOM,
    localParts: resolved.localParts,
    timeZone: resolved.timeZone,
    utcOffsetMinutes: resolved.utcOffsetMinutes,
    abbreviation: resolved.abbreviation,
    disambiguation: trueSolarTimeCustomDisambiguation,
  });
}

function renderActiveTrueSolarTime() {
  if (trueSolarTimeSource === TRUE_SOLAR_TIME_SOURCE.DEVICE) {
    renderTrueSolarTimeForDeviceNow();
  } else if (trueSolarTimeSource === TRUE_SOLAR_TIME_SOURCE.CUSTOM) {
    renderTrueSolarTimeForCustomInput();
  } else {
    renderTrueSolarTimeForWatchDate(elements.datetime.value);
  }
}

/**
 * Formal four-pillars compatibility path: the page query is always the
 * civil/watch instant, interpreted in Taipei UTC+8. Panel Source B/C remains
 * an independent query path and never writes this formal context.
 */
function renderFormalTrueSolarChartTime() {
  invalidateCurrentTrueSolarChartContext();
  const canonicalDateTimeValue = normalizeLocalDateTimeValueWithSeconds(elements.datetime.value);
  const localParts = parseTopQueryDateTimeLocalParts(elements.datetime.value);
  if (!canonicalDateTimeValue || !localParts) {
    renderBaziForActiveDisplayMode();
    renderChineseHourButtons();
    renderChartTimeStatus();
    return;
  }
  const context = {
    source: TRUE_SOLAR_TIME_SOURCE.QUERY,
    localParts,
    timeZone: "Asia/Taipei",
    utcOffsetMinutes: TAIPEI_UTC_OFFSET_MINUTES,
    abbreviation: "",
  };
  try {
    const { civilResolution, result } = resolveTrueSolarTimeCalculation(context);
    chartTimeState.trueSolarResult = result;
    chartTimeState.location = { latitude: trueSolarTimeLocation.latitude, longitude: trueSolarTimeLocation.longitude };
    currentTrueSolarChartContextInput = {
      source: TRUE_SOLAR_TIME_SOURCE.QUERY,
      civil: {
        localParts: { ...civilResolution.localParts, millisecond: 0 },
        timeZone: civilResolution.timeZone,
        utcOffsetMinutes: civilResolution.utcOffsetMinutes,
        abbreviation: civilResolution.abbreviation,
        instantMs: civilResolution.instant.getTime(),
        disambiguation: context.disambiguation ?? null,
      },
      location: {
        latitude: trueSolarTimeLocation.latitude,
        longitude: trueSolarTimeLocation.longitude,
        accuracy: trueSolarTimeLocation.accuracy ?? null,
      },
      trueSolarResult: result,
      compatibility: {
        watchLocalDateTimeValue: canonicalDateTimeValue,
      },
    };
    currentTrueSolarChartContext = createCurrentTrueSolarChartContext();
    renderBaziForActiveDisplayMode();
    renderChineseHourButtons();
    renderChartTimeStatus();
  } catch {
    clearCurrentTrueSolarChartContext();
    renderBaziForActiveDisplayMode();
    renderChineseHourButtons();
    renderChartTimeStatus();
  }
}

function resolveTrueSolarTimeCalculation(context) {
  const { localParts, timeZone, utcOffsetMinutes, disambiguation = null } = context;
  if (!trueSolarTimeLocation) {
    throw new Error("真太陽時座標尚未設定");
  }
  const civilResolution = resolveLocalDateTimeInTimeZone({ localParts, timeZone, disambiguation });
  if (civilResolution.status !== "resolved") {
    throw new Error(civilResolution.status);
  }
  const carrierDate = createUtcCarrierFromLocalParts(localParts);
  const result = calculateTrueSolarTime({
    date: carrierDate,
    latitude: trueSolarTimeLocation.latitude,
    longitude: trueSolarTimeLocation.longitude,
    utcOffsetMinutes,
    useUtcComponents: true,
  });
  return { civilResolution, carrierDate, result };
}

function renderTrueSolarTimeForContext(context) {
  const { source, localParts, timeZone, utcOffsetMinutes, abbreviation, disambiguation = null } = context;
  renderTrueSolarTimeWatchSummary(context);
  if (!isTrueSolarDisplayMode(chartDisplayMode)) clearCurrentTrueSolarChartContext();
  try {
    const { carrierDate, result } = resolveTrueSolarTimeCalculation(context);
    if (source === TRUE_SOLAR_TIME_SOURCE.QUERY && !isTrueSolarDisplayMode(chartDisplayMode)) {
      chartTimeState.trueSolarResult = result;
      chartTimeState.location = { latitude: trueSolarTimeLocation.latitude, longitude: trueSolarTimeLocation.longitude };
    }
    // Legacy compatibility handler remains below, but this old single-page apply UI is retired.
    elements.trueSolarTimeApplyActions.hidden = true;
    elements.trueSolarTimeQueryOnlyNote.hidden = !isTrueSolarDisplayMode(chartDisplayMode);
    elements.trueSolarTimeLocationValue.textContent = `緯度：${formatCoordinate(result.latitude, "N", "S")}；經度：${formatCoordinate(result.longitude, "E", "W")}`;
    elements.trueSolarTimeResult.replaceChildren(createTrueSolarTimeResultContent(result, context));
    elements.trueSolarTimeResult.hidden = false;
    setTrueSolarTimeStatus(result.crossedDateBoundary ? `真太陽時已跨至${result.dateBoundaryDirection === "previous" ? "前一日" : "次一日"}` : "", "");
    void renderTrueSolarTimeSolarEvents(context, carrierDate);
  } catch {
    clearTrueSolarTimePresentation({ clearFormalChart: false });
    setTrueSolarTimeStatus("目前無法計算真太陽時，請確認查詢時間與座標。", "error");
  }
}

function clearCurrentTrueSolarChartContext() {
  currentTrueSolarChartContextInput = null;
  currentTrueSolarChartContext = null;
  currentTrueSolarBaziResult = null;
}

function invalidateCurrentTrueSolarChartContext() {
  clearCurrentTrueSolarChartContext();
  if (isTrueSolarDisplayMode(chartDisplayMode)) {
    renderChartTimeStatus();
  }
}

// Compatibility-phase formal chart input is populated only by
// renderFormalTrueSolarChartTime (shared top query / Taipei), never by panel B/C.
function createCurrentTrueSolarChartContext() {
  if (!currentTrueSolarChartContextInput) return null;
  return createTrueSolarChartTimeContext(currentTrueSolarChartContextInput);
}

function renderTrueSolarTimeWatchSummary({ source, localParts, timeZone, utcOffsetMinutes, abbreviation }) {
  const sourceLabel = source === TRUE_SOLAR_TIME_SOURCE.DEVICE ? "裝置目前時間（僅換算查詢）" : source === TRUE_SOLAR_TIME_SOURCE.CUSTOM ? "自訂當地時間（僅換算查詢）" : "上方排盤時間";
  elements.trueSolarTimeWatchTitle.textContent = sourceLabel;
  elements.trueSolarTimeWatchValue.textContent = formatDateTimeParts(localParts);
  elements.trueSolarTimeWatchNote.textContent = `${timeZone}｜${abbreviation ? `${abbreviation} ` : ""}${formatUtcOffset(utcOffsetMinutes)}`;
}

async function renderTrueSolarTimeSolarEvents(context, carrierDate) {
  const { localParts, utcOffsetMinutes } = context;
  const key = `${localParts.year}-${localParts.month}-${localParts.day}|${trueSolarTimeLocation.latitude}|${trueSolarTimeLocation.longitude}|${utcOffsetMinutes}`;
  if (key === trueSolarTimeSolarEventsKey) return;
  trueSolarTimeSolarEventsKey = key;
  try {
    const events = await calculateSolarEvents({
      date: carrierDate,
      latitude: trueSolarTimeLocation.latitude,
      longitude: trueSolarTimeLocation.longitude,
      utcOffsetMinutes,
      useUtcComponents: true,
    });
    if (key !== trueSolarTimeSolarEventsKey) return;
    elements.trueSolarTimeSolarEvents.hidden = false;
    elements.trueSolarTimeSolarEventsTitle.textContent = `${events.dateKey.replaceAll("-", "/")} 太陽事件`;
    elements.trueSolarTimeSolarEventsLocation.textContent = `地點：${formatCoordinate(events.latitude, "N", "S")}，${formatCoordinate(events.longitude, "E", "W")}`;
    elements.trueSolarTimeSolarEventsTimeZone.textContent = `時區：${context.timeZone}（${formatUtcOffset(utcOffsetMinutes)}）`;
    if (events.daylightStatus !== "normal") { elements.trueSolarTimeSolarEventsMessage.textContent = "此日期與地點無法取得完整日出日落資料。"; return; }
    elements.trueSolarTimeSunrise.textContent = formatTimeParts(events.sunriseParts); elements.trueSolarTimeSolarNoon.textContent = formatTimeParts(events.solarNoonParts); elements.trueSolarTimeSunset.textContent = formatTimeParts(events.sunsetParts); elements.trueSolarTimeSolarEventsMessage.textContent = "";
  } catch { elements.trueSolarTimeSolarEvents.hidden = false; elements.trueSolarTimeSolarEventsMessage.textContent = "此日期與地點無法取得完整日出日落資料。"; }
}

function createTrueSolarTimeResultContent(result, context) {
  const sourceLabel = context.source === TRUE_SOLAR_TIME_SOURCE.DEVICE ? "裝置目前時間（僅換算查詢）" : context.source === TRUE_SOLAR_TIME_SOURCE.CUSTOM ? "自訂當地時間（僅換算查詢）" : "上方排盤時間";
  const definitions = [["時間來源", sourceLabel], ["計算座標", `${formatCoordinate(result.latitude, "N", "S")}，${formatCoordinate(result.longitude, "E", "W")}`], ["時區", context.timeZone], ["當日適用", formatUtcOffset(context.utcOffsetMinutes)], ["手錶時間", formatDateTimeParts(result.watchDateParts)], ["平太陽時", formatDateTimeParts(result.meanSolarParts)], ["真太陽時", formatDateTimeParts(result.trueSolarParts)], ["經度修正", formatSignedSeconds(result.longitudeCorrectionSeconds)], ["當日均時差", formatSignedSeconds(result.equationOfTimeSeconds)], ["合計修正", formatSignedSeconds(result.totalCorrectionSeconds)]];
  const list = document.createElement("dl");
  for (const [label, value] of definitions) { const term = document.createElement("dt"); const detail = document.createElement("dd"); term.textContent = label; detail.textContent = value; list.append(term, detail); }
  return list;
}

function handleTrueSolarTimeSourceChange(event) {
  clearTrueSolarTimeTimeZoneSearchDebounce();
  trueSolarTimeSource = event.target.value;
  trueSolarTimeCustomDisambiguation = null;
  clearTrueSolarTimeCustomDisambiguation();
  closeTrueSolarTimeTimeZoneSearch();
  clearTrueSolarTimePresentation({ clearFormalChart: false });
  elements.trueSolarTimeDeviceFields.hidden = trueSolarTimeSource !== TRUE_SOLAR_TIME_SOURCE.DEVICE;
  elements.trueSolarTimeCustomFields.hidden = trueSolarTimeSource !== TRUE_SOLAR_TIME_SOURCE.CUSTOM;
  elements.trueSolarTimeQueryOnlyNote.hidden = !isTrueSolarDisplayMode(chartDisplayMode);
  if (trueSolarTimeSource === TRUE_SOLAR_TIME_SOURCE.CUSTOM) {
    initializeTrueSolarTimeCustomInputs();
    renderTrueSolarTimeTimeZoneSearchResults();
  }
  syncTrueSolarTimeClockRefresh();
  renderActiveTrueSolarTime();
}

function handleTrueSolarTimeCustomInput() {
  trueSolarTimeCustomDisambiguation = null;
  trueSolarTimeTimeZoneOffsetCache.clear();
  clearTrueSolarTimeCustomDisambiguation();
  renderTrueSolarTimeForCustomInput();
  if (!elements.trueSolarTimeTimeZoneSearchResults.hidden) {
    renderTrueSolarTimeTimeZoneSearchResults();
  }
}

function clearTrueSolarTimeTimeZoneSearchDebounce() {
  if (trueSolarTimeTimeZoneSearchDebounceTimerId !== null) {
    window.clearTimeout(trueSolarTimeTimeZoneSearchDebounceTimerId);
    trueSolarTimeTimeZoneSearchDebounceTimerId = null;
  }
}

function showTrueSolarTimeTimeZoneTooLongStatus() {
  closeTrueSolarTimeTimeZoneSearch();
  clearTrueSolarTimePresentation({ clearFormalChart: false });
  setTrueSolarTimeTimeZoneStatus("時區輸入過長，請縮短後再搜尋。", "error");
}

function handleTrueSolarTimeTimeZoneInput() {
  // Expensive validateTimeZone/resolver work is deferred to the debounced apply step.
  trueSolarTimeCustomDisambiguation = null;
  trueSolarTimeTimeZoneSearchActiveIndex = -1;
  clearTrueSolarTimeCustomDisambiguation();
  clearTrueSolarTimeTimeZoneSearchDebounce();
  const rawTimeZone = typeof elements.trueSolarTimeTimeZone.value === "string"
    ? elements.trueSolarTimeTimeZone.value
    : "";
  if (rawTimeZone.length > MAX_TIME_ZONE_INPUT_LENGTH) {
    showTrueSolarTimeTimeZoneTooLongStatus();
    return;
  }
  clearTrueSolarTimePresentation({ clearFormalChart: false });
  closeTrueSolarTimeTimeZoneSearch();
  if (rawTimeZone.trim()) {
    elements.trueSolarTimeTimeZoneSearchStatus.textContent = "請從建議中選擇正式時區。";
  }
  trueSolarTimeTimeZoneSearchDebounceTimerId = window.setTimeout(() => {
    trueSolarTimeTimeZoneSearchDebounceTimerId = null;
    applyTrueSolarTimeTimeZoneInput();
  }, TRUE_SOLAR_TIME_ZONE_SEARCH_DEBOUNCE_MS);
}

function handleTrueSolarTimeTimeZoneChange() {
  clearTrueSolarTimeTimeZoneSearchDebounce();
  applyTrueSolarTimeTimeZoneInput();
}

function applyTrueSolarTimeTimeZoneInput() {
  const rawTimeZone = typeof elements.trueSolarTimeTimeZone.value === "string"
    ? elements.trueSolarTimeTimeZone.value
    : "";
  if (rawTimeZone.length > MAX_TIME_ZONE_INPUT_LENGTH) {
    showTrueSolarTimeTimeZoneTooLongStatus();
    return;
  }
  renderTrueSolarTimeTimeZoneSearchResults();
  const timeZone = rawTimeZone.trim();
  if (!timeZone || !validateTimeZone(timeZone)) {
    clearTrueSolarTimePresentation({ clearFormalChart: false });
    setTrueSolarTimeTimeZoneStatus(
      timeZone
        ? trueSolarTimeTimeZoneSearchResults.length ? "請從建議中選擇正式時區。" : "找不到符合的時區；可輸入完整 IANA 名稱，例如 Europe/Oslo。"
        : "請輸入 IANA 時區，或從建議中選擇。",
      "error"
    );
    return;
  }
  closeTrueSolarTimeTimeZoneSearch();
  renderTrueSolarTimeForCustomInput();
}

function handleTrueSolarTimeTimeZoneKeydown(event) {
  if (event.key === "Escape") {
    clearTrueSolarTimeTimeZoneSearchDebounce();
    closeTrueSolarTimeTimeZoneSearch();
    return;
  }
  if (!["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) return;
  if (trueSolarTimeTimeZoneSearchDebounceTimerId !== null) {
    clearTrueSolarTimeTimeZoneSearchDebounce();
    applyTrueSolarTimeTimeZoneInput();
  }
  if (trueSolarTimeTimeZoneSearchResults.length === 0) {
    renderTrueSolarTimeTimeZoneSearchResults();
  }
  if (trueSolarTimeTimeZoneSearchResults.length === 0) return;
  event.preventDefault();
  if (event.key === "Enter") {
    selectTrueSolarTimeTimeZone(trueSolarTimeTimeZoneSearchResults[Math.max(0, trueSolarTimeTimeZoneSearchActiveIndex)]?.timeZone);
    return;
  }
  const direction = event.key === "ArrowDown" ? 1 : -1;
  trueSolarTimeTimeZoneSearchActiveIndex = trueSolarTimeTimeZoneSearchActiveIndex < 0
    ? direction > 0 ? 0 : trueSolarTimeTimeZoneSearchResults.length - 1
    : (trueSolarTimeTimeZoneSearchActiveIndex + direction + trueSolarTimeTimeZoneSearchResults.length) % trueSolarTimeTimeZoneSearchResults.length;
  renderTrueSolarTimeTimeZoneSearchResults();
}

function useDeviceTimeZoneForCustomInput() {
  clearTrueSolarTimeTimeZoneSearchDebounce();
  const timeZone = getDeviceTimeZone() || "UTC";
  elements.trueSolarTimeTimeZone.value = timeZone;
  selectTrueSolarTimeTimeZone(timeZone);
}

function selectTrueSolarTimeTimeZone(timeZone) {
  clearTrueSolarTimeTimeZoneSearchDebounce();
  if (!timeZone || !validateTimeZone(timeZone)) return;
  elements.trueSolarTimeTimeZone.value = timeZone;
  trueSolarTimeCustomDisambiguation = null;
  clearTrueSolarTimeCustomDisambiguation();
  closeTrueSolarTimeTimeZoneSearch();
  renderTrueSolarTimeForCustomInput();
}

function renderTrueSolarTimeTimeZoneSearchResults() {
  if (trueSolarTimeSource !== TRUE_SOLAR_TIME_SOURCE.CUSTOM) return;
  const query = typeof elements.trueSolarTimeTimeZone.value === "string"
    ? elements.trueSolarTimeTimeZone.value
    : "";
  if (query.length > MAX_TIME_ZONE_INPUT_LENGTH) {
    showTrueSolarTimeTimeZoneTooLongStatus();
    return;
  }
  trueSolarTimeTimeZoneSearchResults = searchTimeZones(query, { limit: 12 });
  if (trueSolarTimeTimeZoneSearchActiveIndex >= trueSolarTimeTimeZoneSearchResults.length) {
    trueSolarTimeTimeZoneSearchActiveIndex = -1;
  }
  const isEmptyQuery = query.trim() === "";
  const hasMultipleTimeZonesInRegion = trueSolarTimeTimeZoneSearchResults.some((entry) => entry.regionLabel
    && trueSolarTimeTimeZoneSearchResults.filter((candidate) => candidate.regionLabel === entry.regionLabel).length > 1);
  elements.trueSolarTimeTimeZoneSearchStatus.textContent = isEmptyQuery
    ? "常用時區"
    : trueSolarTimeTimeZoneSearchResults.length
      ? `找到 ${trueSolarTimeTimeZoneSearchResults.length} 個時區${hasMultipleTimeZonesInRegion ? "；此地區包含多個時區，請依城市或地區選擇。" : ""}`
      : "找不到符合的時區；可輸入完整 IANA 名稱，例如 Europe/Oslo。";
  elements.trueSolarTimeTimeZoneSearchResults.replaceChildren(
    ...trueSolarTimeTimeZoneSearchResults.map((entry, index) => createTrueSolarTimeTimeZoneSearchOption(entry, index))
  );
  const isOpen = trueSolarTimeTimeZoneSearchResults.length > 0;
  elements.trueSolarTimeTimeZoneSearchResults.hidden = !isOpen;
  elements.trueSolarTimeTimeZone.setAttribute("aria-expanded", String(isOpen));
  elements.trueSolarTimeTimeZone.setAttribute(
    "aria-activedescendant",
    trueSolarTimeTimeZoneSearchActiveIndex >= 0 ? `true-solar-time-time-zone-option-${trueSolarTimeTimeZoneSearchActiveIndex}` : ""
  );
}

function createTrueSolarTimeTimeZoneSearchOption(entry, index) {
  const option = document.createElement("button");
  option.type = "button";
  option.id = `true-solar-time-time-zone-option-${index}`;
  option.className = "true-solar-time-time-zone-option";
  option.setAttribute("role", "option");
  option.setAttribute("aria-selected", String(index === trueSolarTimeTimeZoneSearchActiveIndex));
  option.append(
    createBlockSpan(entry.label || entry.timeZone, "true-solar-time-time-zone-option-label"),
    createBlockSpan(entry.timeZone, "true-solar-time-time-zone-option-name"),
    createBlockSpan(formatTrueSolarTimeTimeZoneSearchOffset(entry.timeZone), "true-solar-time-time-zone-option-offset")
  );
  option.addEventListener("click", () => selectTrueSolarTimeTimeZone(entry.timeZone));
  return option;
}

function formatTrueSolarTimeTimeZoneSearchOffset(timeZone) {
  const dateValue = elements.trueSolarTimeLocalDate.value;
  const timeValue = elements.trueSolarTimeLocalTime.value;
  const cacheKey = `${timeZone}|${dateValue}|${timeValue}`;
  if (trueSolarTimeTimeZoneOffsetCache.has(cacheKey)) return trueSolarTimeTimeZoneOffsetCache.get(cacheKey);
  const localParts = parseTrueSolarTimeCustomLocalParts(dateValue, timeValue);
  const resolved = resolveLocalDateTimeInTimeZone({ localParts, timeZone });
  const text = resolved.status === "resolved"
    ? `指定日期：${formatUtcOffset(resolved.utcOffsetMinutes)}`
    : resolved.status === "ambiguous"
      ? `需選擇重複時間：${resolved.candidates.map((candidate) => formatUtcOffset(candidate.utcOffsetMinutes)).join(" / ")}`
      : resolved.status === "nonexistent"
        ? "指定日期時間不存在"
        : "請先輸入有效日期時間";
  if (resolved.status === "resolved" || resolved.status === "ambiguous") {
    if (!trueSolarTimeTimeZoneOffsetCache.has(cacheKey) && trueSolarTimeTimeZoneOffsetCache.size >= 128) {
      const oldestKey = trueSolarTimeTimeZoneOffsetCache.keys().next().value;
      if (oldestKey !== undefined) trueSolarTimeTimeZoneOffsetCache.delete(oldestKey);
    }
    trueSolarTimeTimeZoneOffsetCache.set(cacheKey, text);
  }
  return text;
}

function closeTrueSolarTimeTimeZoneSearch() {
  trueSolarTimeTimeZoneSearchResults = [];
  trueSolarTimeTimeZoneSearchActiveIndex = -1;
  elements.trueSolarTimeTimeZoneSearchResults.replaceChildren();
  elements.trueSolarTimeTimeZoneSearchResults.hidden = true;
  elements.trueSolarTimeTimeZone.setAttribute("aria-expanded", "false");
  elements.trueSolarTimeTimeZone.setAttribute("aria-activedescendant", "");
}

function handleTrueSolarTimeTimeZoneDocumentClick(event) {
  if (!elements.trueSolarTimeTimeZonePicker.contains(event.target)) {
    closeTrueSolarTimeTimeZoneSearch();
  }
}

function handleTrueSolarTimeDisambiguationChange(event) {
  if (!event.target.checked) return;
  trueSolarTimeCustomDisambiguation = event.target.value;
  renderTrueSolarTimeForCustomInput();
}

function initializeTrueSolarTimeCustomInputs() {
  const now = new Date();
  const timeZone = getDeviceTimeZone() || "UTC";
  const zoned = getZonedDateTimeParts(now, timeZone) ?? getZonedDateTimeParts(now, "UTC");
  if (!zoned) return;
  elements.trueSolarTimeTimeZoneCurrentDeviceLabel.textContent = `目前裝置：${zoned.timeZone}`;
  if (elements.trueSolarTimeLocalDate.value && elements.trueSolarTimeLocalTime.value && elements.trueSolarTimeTimeZone.value.trim()) return;
  elements.trueSolarTimeLocalDate.value ||= formatDateInput(zoned.localParts);
  elements.trueSolarTimeLocalTime.value ||= formatTimeInput(zoned.localParts);
  elements.trueSolarTimeTimeZone.value ||= zoned.timeZone;
}

function configureTrueSolarTimeDisambiguation(candidates, selected = null) {
  const [earlier, later] = candidates;
  elements.trueSolarTimeDisambiguationEarlierLabel.textContent = `第一次：${formatUtcOffset(earlier.utcOffsetMinutes)}`;
  elements.trueSolarTimeDisambiguationLaterLabel.textContent = `第二次：${formatUtcOffset(later.utcOffsetMinutes)}`;
  elements.trueSolarTimeDisambiguationEarlier.checked = selected === "earlier";
  elements.trueSolarTimeDisambiguationLater.checked = selected === "later";
  const selectedCandidate = selected === "earlier" ? earlier : selected === "later" ? later : null;
  elements.trueSolarTimeDisambiguationSelected.hidden = !selectedCandidate;
  elements.trueSolarTimeDisambiguationSelected.textContent = selectedCandidate
    ? `目前選擇：${selected === "earlier" ? "第一次" : "第二次"}（${formatUtcOffset(selectedCandidate.utcOffsetMinutes)}）`
    : "";
  elements.trueSolarTimeDisambiguation.hidden = false;
}

function clearTrueSolarTimeCustomDisambiguation() {
  elements.trueSolarTimeDisambiguationEarlier.checked = false;
  elements.trueSolarTimeDisambiguationLater.checked = false;
  elements.trueSolarTimeDisambiguationSelected.textContent = "";
  elements.trueSolarTimeDisambiguationSelected.hidden = true;
  elements.trueSolarTimeDisambiguation.hidden = true;
  setTrueSolarTimeTimeZoneStatus("", "");
}

function clearTrueSolarTimePresentation(options) {
  const clearFormalChart = options?.clearFormalChart !== false;
  trueSolarTimeSolarEventsKey = null;
  if (clearFormalChart) {
    clearCurrentTrueSolarChartContext();
  }
  elements.trueSolarTimeResult.replaceChildren();
  elements.trueSolarTimeResult.hidden = true;
  elements.trueSolarTimeSolarEvents.hidden = true;
  elements.trueSolarTimeApplyActions.hidden = true;
}

function parseTrueSolarTimeCustomLocalParts(dateValue, timeValue) {
  if (
    typeof dateValue !== "string"
    || typeof timeValue !== "string"
    || dateValue.length > 32
    || timeValue.length > 32
  ) return null;
  const dateMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const timeMatch = timeValue.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!dateMatch || !timeMatch) return null;
  const parts = { year: Number(dateMatch[1]), month: Number(dateMatch[2]), day: Number(dateMatch[3]), hour: Number(timeMatch[1]), minute: Number(timeMatch[2]), second: Number(timeMatch[3] ?? 0) };
  const check = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second));
  return check.getUTCFullYear() === parts.year && check.getUTCMonth() === parts.month - 1 && check.getUTCDate() === parts.day && check.getUTCHours() === parts.hour && check.getUTCMinutes() === parts.minute && check.getUTCSeconds() === parts.second ? parts : null;
}

// This carrier preserves the chosen wall-clock components independently of the browser's own time zone.
function createUtcCarrierFromLocalParts(parts) {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second ?? 0));
}

function formatDateInput(parts) { return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`; }
function formatTimeInput(parts) { return `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second ?? 0).padStart(2, "0")}`; }
function setTrueSolarTimeTimeZoneStatus(message, type) { elements.trueSolarTimeTimeZoneStatus.textContent = message; elements.trueSolarTimeTimeZoneStatus.className = `section-message ${type ? `section-message-${type}` : ""}`.trim(); }

function formatDateTimeParts(parts) { return `${parts.year}/${String(parts.month).padStart(2, "0")}/${String(parts.day).padStart(2, "0")} ${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}`; }
function formatTimeParts(parts) { return parts ? `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}` : "--"; }
function formatSignedSeconds(seconds) { const rounded = Math.round(seconds); const sign = rounded >= 0 ? "+" : "-"; const absolute = Math.abs(rounded); return `${sign}${Math.floor(absolute / 60)}分${absolute % 60}秒`; }
function formatCoordinate(value, positive, negative) { return `${Math.abs(value).toFixed(6)}° ${value >= 0 ? positive : negative}`; }
function getLocalDateParts(date) { return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() }; }
function parseTopQueryDateTimeLocalParts(dateTimeValue) {
  if (dateTimeValue instanceof Date) {
    return { ...getLocalDateParts(dateTimeValue), millisecond: 0 };
  }
  if (typeof dateTimeValue !== "string" || dateTimeValue.length > 32) return null;
  const [dateValue, timeValue] = dateTimeValue.trim().split("T");
  const parts = parseTrueSolarTimeCustomLocalParts(dateValue, timeValue);
  return parts ? { ...parts, millisecond: 0 } : null;
}
function formatChartTimeStatusDateTime(dateTimeValue) {
  const date = parseDateTimeLocalValue(dateTimeValue);
  return date ? formatDateTimeParts(getLocalDateParts(date)) : "時間初始化中…";
}
function renderChartQueryTimeModeStatus() {
  elements.chartQueryTimeModeStatus.textContent = isAutoNowMode ? "● 跟隨現在時間" : "○ 手動查詢時間";
  elements.chartQueryTimeValue.textContent = formatChartTimeStatusDateTime(elements.datetime.value);
  elements.chartQueryTimeModeStatus.dataset.mode = isAutoNowMode ? "auto-now" : "manual";
}
function setTrueSolarTimeStatus(message, type) { elements.trueSolarTimeStatus.textContent = message; elements.trueSolarTimeStatus.className = `section-message ${type ? `section-message-${type}` : ""}`.trim(); }
function formatDateTimeLocalParts(parts) { return parts && Number.isInteger(parts.year) ? `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}T${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}` : null; }
function resolveEffectiveChartDateTimeValue(watchDateTimeValue) { return chartTimeState.mode === CHART_TIME_MODE.TRUE_SOLAR ? formatDateTimeLocalParts(chartTimeState.trueSolarResult?.trueSolarParts) ?? watchDateTimeValue : watchDateTimeValue; }
function applyTrueSolarTimeToCharts() { if (trueSolarTimeSource !== TRUE_SOLAR_TIME_SOURCE.QUERY) { setTrueSolarTimeStatus("此時間來源目前僅供真太陽時查詢。", "error"); return; } const watch = normalizeLocalDateTimeValueWithSeconds(elements.datetime.value); const result = chartTimeState.trueSolarResult; if (!trueSolarTimeLocation || !result || !watch) { setTrueSolarTimeStatus("請先完成真太陽時計算。", "error"); return; } chartTimeState = { mode: CHART_TIME_MODE.TRUE_SOLAR, watchDateTimeValue: watch, effectiveDateTimeValue: formatDateTimeLocalParts(result.trueSolarParts), trueSolarResult: result, location: { ...trueSolarTimeLocation } }; pauseAutoNowMode(); setTrueSolarTimeStatus("已固定此刻的真太陽時排盤；點「現在時間」可重新取得當下時間。", ""); void renderByDateTime(watch); }
function restoreWatchChartTime(message = "", shouldRender = true) { const canonicalDateTimeValue = normalizeLocalDateTimeValueWithSeconds(elements.datetime.value); chartTimeState.mode = CHART_TIME_MODE.WATCH; chartTimeState.watchDateTimeValue = canonicalDateTimeValue; chartTimeState.effectiveDateTimeValue = canonicalDateTimeValue; chartTimeState.location = null; if (message) setMessage(message, ""); if (shouldRender && canonicalDateTimeValue) requestRenderDateTime(canonicalDateTimeValue); else renderChartTimeStatus(); }
function renderChartTimeStatus() {
  if (isTrueSolarDisplayMode(chartDisplayMode)) {
    elements.chartTimeStatusTitle.textContent = currentTrueSolarBaziResult
      ? "☀ 目前四柱使用真太陽時"
      : "☀ 真太陽時四柱尚未就緒";
    if (currentTrueSolarChartContext) {
      const watchLine = document.createElement("span");
      const trueSolarLine = document.createElement("span");
      const timeZoneLine = document.createElement("span");
      watchLine.className = "chart-time-status-detail-line";
      trueSolarLine.className = "chart-time-status-detail-line";
      timeZoneLine.className = "chart-time-status-detail-line";
      watchLine.textContent = `手錶時間：${formatDateTimeParts(currentTrueSolarChartContext.civil.localParts)}`;
      trueSolarLine.textContent = `真太陽時：${formatDateTimeParts(currentTrueSolarChartContext.trueSolar.localParts)}`;
      timeZoneLine.textContent = `時區：${currentTrueSolarChartContext.civil.timeZone}`;
      elements.chartTimeStatusDetail.replaceChildren(watchLine, trueSolarLine, timeZoneLine);
    } else {
      elements.chartTimeStatusDetail.textContent = "尚未取得完整真太陽時資料。";
    }
    elements.chartTimeRestore.hidden = true;
    return;
  }

  const isLegacyTrue = chartTimeState.mode === CHART_TIME_MODE.TRUE_SOLAR;
  elements.chartTimeStatusTitle.textContent = isLegacyTrue ? "☀ 目前使用真太陽時排盤" : "🕒 目前使用手錶時間排盤";
  if (isLegacyTrue) {
    const watchLine = document.createElement("span");
    const trueSolarLine = document.createElement("span");
    watchLine.className = "chart-time-status-detail-line";
    trueSolarLine.className = "chart-time-status-detail-line";
    watchLine.textContent = `手錶時間：${formatChartTimeStatusDateTime(chartTimeState.watchDateTimeValue)}`;
    trueSolarLine.textContent = chartTimeState.trueSolarResult?.trueSolarParts
      ? `真太陽時：${formatDateTimeParts(chartTimeState.trueSolarResult.trueSolarParts)}`
      : "真太陽時：尚未就緒";
    elements.chartTimeStatusDetail.replaceChildren(watchLine, trueSolarLine);
  } else {
    elements.chartTimeStatusDetail.textContent = formatChartTimeStatusDateTime(elements.datetime.value);
  }
  elements.chartTimeRestore.hidden = true;
}

function setActiveTab(panelId) {
  elements.tabButtons.forEach((button) => {
    const isActive = button.getAttribute("aria-controls") === panelId;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  elements.tabPanels.forEach((panel) => {
    panel.hidden = panel.id !== panelId;
  });
}

function renderQimenSection(dateTimeText) {
  try {
    const qimen = resolveQimenJuFromFullTermCycleDraft(dateTimeText);
    syncQimenManualControlsWithAuto(qimen);
    const effective = resolveQimenPlateLookupInput(qimen, qimenManualOverride);
    qimenElements.summary.replaceChildren(...createQimenSummaryRows(qimen));
    renderQimenManualControlState();
    qimenElements.fallback.className = "qimen-fallback";

    try {
      const plate = getQimenPlate({
        dunType: effective.dunType,
        ju: effective.ju,
        hourPillar: effective.hourPillar,
      });

      if (plate.status === "found") {
        qimenElements.summary.replaceChildren(...createQimenSummaryRows(qimen, plate.plate));
        renderQimenPlateResult(plate, qimen);
        qimenElements.fallback.textContent = "";
      } else {
        clearQimenPlateDisplay();
        qimenElements.fallback.textContent = plate.message || QIMEN_MISSING_PLATE_MESSAGE;
      }
    } catch (error) {
      console.error("奇門遁甲盤面查詢失敗", error);
      clearQimenPlateDisplay();
      qimenElements.fallback.textContent = QIMEN_PLATE_LOAD_ERROR_MESSAGE;
    }
  } catch (error) {
    console.error("奇門遁甲定局查詢失敗", error);
    qimenElements.summary.replaceChildren();
    clearQimenPlateDisplay();
    qimenElements.fallback.className = "qimen-fallback qimen-fallback-error";
    qimenElements.fallback.textContent = QIMEN_FORMATTER_ERROR_MESSAGE;
  }
}

function clearQimenSection() {
  qimenElements.summary.replaceChildren();
  clearQimenPlateDisplay();
  qimenElements.fallback.className = "qimen-fallback";
  qimenElements.fallback.textContent = "";
  renderQimenManualControlState();
}

function handleQimenManualToggleChange() {
  qimenManualOverride.enabled = qimenElements.manualToggle.checked;
  rerenderCurrentQimenSection();
}

function handleQimenManualDunChange() {
  qimenManualOverride.dunType = qimenElements.manualDunSelect.value;
  rerenderCurrentQimenSection();
}

function handleQimenManualJuChange() {
  qimenManualOverride.ju = Number(qimenElements.manualJuSelect.value);
  rerenderCurrentQimenSection();
}

function restoreQimenAutoPlateLookup() {
  qimenManualOverride.enabled = false;
  rerenderCurrentQimenSection();
}

function rerenderCurrentQimenSection() {
  if (!currentDateTimeValue) {
    return;
  }

  renderQimenSection(currentDateTimeValue);
}

function syncQimenManualControlsWithAuto(qimen) {
  if (!qimenManualOverride.enabled) {
    qimenManualOverride.dunType = qimen.dunType;
    qimenManualOverride.ju = qimen.ju;
  } else if (!isValidQimenManualOverride(qimenManualOverride)) {
    qimenManualOverride.dunType = qimen.dunType;
    qimenManualOverride.ju = qimen.ju;
  }

  qimenElements.manualToggle.checked = qimenManualOverride.enabled;
  qimenElements.manualDunSelect.value = qimenManualOverride.dunType || qimen.dunType;
  qimenElements.manualJuSelect.value = String(qimenManualOverride.ju ?? qimen.ju);
}

function renderQimenManualControlState() {
  const isEnabled = qimenManualOverride.enabled;
  qimenElements.manualToggle.checked = isEnabled;
  qimenElements.manualDunSelect.disabled = !isEnabled;
  qimenElements.manualJuSelect.disabled = !isEnabled;
  qimenElements.manualRestore.disabled = !isEnabled;
  qimenElements.manualHint.hidden = !isEnabled;
}

function resolveQimenPlateLookupInput(qimen, manualOverride) {
  if (manualOverride?.enabled && isValidQimenManualOverride(manualOverride)) {
    return {
      dunType: manualOverride.dunType,
      dunName: getQimenDunName(manualOverride.dunType),
      ju: manualOverride.ju,
      hourPillar: qimen.hourPillar,
      source: "manual",
    };
  }

  return {
    dunType: qimen.dunType,
    dunName: qimen.dunName,
    ju: qimen.ju,
    hourPillar: qimen.hourPillar,
    source: "auto",
  };
}

function isValidQimenManualOverride(manualOverride) {
  return (
    ["yang", "yin"].includes(manualOverride?.dunType) &&
    Number.isInteger(manualOverride?.ju) &&
    manualOverride.ju >= 1 &&
    manualOverride.ju <= 9
  );
}

function createQimenPlateSection() {
  const section = document.createElement("section");
  section.className = "qimen-plate-section";
  section.setAttribute("aria-label", "奇門盤面");
  return section;
}

function clearQimenPlateDisplay() {
  qimenElements.plateSection.replaceChildren();
}

function renderQimenPlateResult(plateResult, qimen) {
  const annotations = createQimenPlateAnnotations(plateResult.plate, qimen);
  const gridWrap = document.createElement("div");
  gridWrap.className = "qimen-plate-grid-wrap";
  gridWrap.append(renderQimenPlateGrid(plateResult.plate, annotations));
  qimenElements.plateSection.replaceChildren(gridWrap);
}

function createQimenPlateAnnotations(plate, qimen) {
  const guXu = getQimenGuXuByHourBranch(getQimenHourBranch(plate?.hourPillar));
  return {
    plateMarkers: decorateQimenPlateMarkers(plate),
    displayZhiFuPalaceKey: findQimenDisplayZhiFuPalaceKey(plate),
    guXu,
    openClose: createQimenOpenCloseViewModel(plate),
    qiResponse: createQimenQiResponseViewModel({
      monthPillar: currentCalendarResult?.monthPillar,
      actualSolarTerm: qimen?.actualSolarTerm,
      plate,
    }),
    virtuePunishment: createQimenSolarTermVirtuePunishmentViewModel(qimen, plate, guXu),
  };
}

function renderQimenPlateGrid(plate, annotations) {
  const grid = document.createElement("div");
  grid.className = "qimen-plate-grid";
  grid.setAttribute("aria-label", "奇門盤面九宮");

  for (const palaceMeta of getQimenPlateDisplayOrder()) {
    grid.append(createQimenPalaceCell(
      plate?.palaces?.[palaceMeta.key],
      palaceMeta,
      annotations
    ));
  }

  return grid;
}

function createQimenPalaceCell(
  palace,
  palaceMeta,
  annotations = {}
) {
  const palaceMarkers = annotations.plateMarkers?.palaces?.[palaceMeta.key] ?? {};
  const displayZhiFuPalaceKey = annotations.displayZhiFuPalaceKey ?? null;
  const guXu = annotations.guXu ?? null;
  const openClose = annotations.openClose?.palaces?.[palaceMeta.key] ?? null;
  const qiResponse = annotations.qiResponse?.palaces?.[palaceMeta.key] ?? {};
  const virtuePunishment = annotations.virtuePunishment?.palaces?.[palaceMeta.key] ?? [];
  const isDisplayZhiFuPalace = palaceMeta.key === displayZhiFuPalaceKey;
  const isZhiShiPalace = palace?.isZhiShiPalace === true;
  const cell = document.createElement("div");
  cell.className = [
    "qimen-palace-cell",
    palaceMeta.key === "center" ? "qimen-palace-center" : "",
    isDisplayZhiFuPalace || isZhiShiPalace ? "qimen-palace-zhi-marker" : "",
    palaceMarkers.isTianYiStarPalace === true ? "qimen-palace-tian-yi" : "",
    isDisplayZhiFuPalace ? "qimen-palace-zhi-fu" : "",
    isZhiShiPalace ? "qimen-palace-zhi-shi" : "",
  ].filter(Boolean).join(" ");

  const header = document.createElement("div");
  header.className = "qimen-palace-header";
  const headerLabel = document.createElement("span");
  headerLabel.className = "qimen-palace-header-label";
  headerLabel.append(document.createTextNode(formatQimenPalaceHeader(palace, palaceMeta, openClose)));
  if (openClose) {
    headerLabel.append(createQimenOpenCloseBadge(openClose));
  }
  header.append(headerLabel);

  if (palaceMarkers.centerHeavenStem) {
    header.append(createQimenInlineMarker(
      palaceMarkers.centerHeavenStem,
      "qimen-center-heaven-stem-marker"
    ));
  }

  if (!palace) {
    const lines = document.createElement("div");
    lines.className = "qimen-palace-lines";
    lines.textContent = "資料缺漏";
    cell.append(
      header,
      lines,
      createQimenPalaceGuaCorner(palace, palaceMeta, palaceMarkers),
      createQimenGuXuBadges(palaceMeta.key, guXu),
      createQimenVirtuePunishmentBadges(palaceMeta.key, virtuePunishment)
    );
    return cell;
  }

  const content = createQimenPalaceContent(
    palace,
    palaceMarkers,
    isDisplayZhiFuPalace,
    qiResponse
  );

  const note = createQimenPalaceNote(palace);

  cell.append(
    header,
    content,
    createQimenPalaceGuaCorner(palace, palaceMeta, palaceMarkers),
    createQimenGuXuBadges(palaceMeta.key, guXu),
    createQimenVirtuePunishmentBadges(palaceMeta.key, virtuePunishment)
  );
  if (note) {
    cell.append(note);
  }

  return cell;
}

function getQimenHourBranch(hourPillar) {
  return typeof hourPillar === "string" ? hourPillar.at(-1) : null;
}

function createQimenGuXuBadges(palaceKey, guXu) {
  const badges = document.createDocumentFragment();
  for (const [type, branches] of [["gu", guXu?.gu], ["xu", guXu?.xu]]) {
    if (!Array.isArray(branches)) {
      continue;
    }

    for (const branch of branches) {
      const branchPosition = QIMEN_BRANCH_POSITIONS[branch];
      if (branchPosition?.palaceKey !== palaceKey) {
        continue;
      }

      const badge = document.createElement("span");
      badge.className = [
        "qimen-guxu-badge",
        `qimen-guxu-${type}`,
        `qimen-guxu-pos-${branchPosition.position}`,
      ].join(" ");
      badge.textContent = type === "gu" ? "孤" : "虛";
      badge.setAttribute("aria-label", `${branch}${badge.textContent}`);
      badges.append(badge);
    }
  }

  return badges;
}

function createQimenVirtuePunishmentBadges(palaceKey, markers) {
  const badges = document.createDocumentFragment();
  if (!Array.isArray(markers)) {
    return badges;
  }

  for (const marker of markers) {
    if (marker?.palaceKey !== palaceKey || !marker.position || !marker.branch) {
      continue;
    }

    const badge = document.createElement("span");
    badge.className = [
      "qimen-virtue-punishment-badge",
      marker.type === "virtue" ? "is-virtue" : "is-punishment",
      `qimen-virtue-punishment-pos-${marker.position}`,
      marker.hasGuXuMarker ? "has-gu-xu-marker" : "",
    ].filter(Boolean).join(" ");
    badge.textContent = marker.label;
    badge.setAttribute("aria-label", `${marker.branch}${marker.label}`);
    badges.append(badge);
  }

  return badges;
}

function createQimenPalaceContent(
  palace,
  palaceMarkers = {},
  isDisplayZhiFuPalace = false,
  qiResponse = {}
) {
  const content = document.createElement("div");
  content.className = "qimen-palace-content";

  const left = document.createElement("div");
  left.className = "qimen-palace-left";

  const deity = document.createElement("div");
  deity.className = [
    "qimen-palace-deity",
    isDisplayZhiFuPalace ? "qimen-palace-deity-zhi-fu" : "",
  ].filter(Boolean).join(" ");
  deity.textContent = formatNullableQimenValue(palace.deity);

  const starBlock = document.createElement("div");
  starBlock.className = "qimen-star-block";

  const star = document.createElement("div");
  star.className = [
    "qimen-palace-star",
    palaceMarkers.isTianYiStarPalace === true ? "qimen-palace-star-tian-yi" : "",
  ].filter(Boolean).join(" ");
  star.append(document.createTextNode(formatNullableQimenValue(palace.star)));
  starBlock.append(star);
  if (qiResponse.starQiResponse?.state) {
    starBlock.append(createQimenInlineMarker(
      qiResponse.starQiResponse.state,
      "qimen-star-qi-response",
      `九星氣應：${qiResponse.starQiResponse.state}`
    ));
  }

  left.append(deity, starBlock);

  const center = document.createElement("div");
  center.className = "qimen-palace-center-main";

  const doorBlock = document.createElement("div");
  doorBlock.className = "qimen-door-block";

  const door = document.createElement("div");
  door.className = [
    "qimen-palace-door",
    palace.isZhiShiPalace === true ? "qimen-palace-door-zhi-shi" : "",
  ].filter(Boolean).join(" ");
  door.append(document.createTextNode(formatNullableQimenValue(palace.door)));

  const doorStatusRow = document.createElement("div");
  doorStatusRow.className = "qimen-door-status-row";
  if (qiResponse.doorQiResponse?.state) {
    doorStatusRow.append(createQimenInlineMarker(
      qiResponse.doorQiResponse.state,
      "qimen-door-qi-response",
      `八門氣應：${qiResponse.doorQiResponse.state}`
    ));
  }
  if (palaceMarkers.doorPo) {
    doorStatusRow.append(createQimenInlineMarker(
      palaceMarkers.doorPo,
      "qimen-door-po-marker qimen-door-relation-marker"
    ));
  } else if (palaceMarkers.doorGeneratePalace) {
    doorStatusRow.append(createQimenInlineMarker(
      palaceMarkers.doorGeneratePalace,
      "qimen-door-generate-palace-marker qimen-door-relation-marker"
    ));
  }
  doorBlock.append(door);
  if (doorStatusRow.childNodes.length > 0) {
    doorBlock.append(doorStatusRow);
  }

  center.append(doorBlock);

  const right = document.createElement("div");
  right.className = "qimen-palace-right";

  const heavenStem = document.createElement("div");
  heavenStem.className = "qimen-stem-wrap qimen-palace-heaven-stem";
  heavenStem.append(document.createTextNode(formatNullableQimenValue(palace.heavenStem)));
  if (palaceMarkers.heavenStemMarker) {
    heavenStem.append(createQimenInlineMarker(palaceMarkers.heavenStemMarker, "qimen-heaven-stem-marker"));
  }

  const earthStem = document.createElement("div");
  earthStem.className = "qimen-stem-wrap qimen-palace-earth-stem";
  earthStem.append(document.createTextNode(formatNullableQimenValue(palace.earthStem)));
  if (palaceMarkers.centerEarthStem) {
    earthStem.append(createQimenInlineMarker(
      palaceMarkers.centerEarthStem,
      "qimen-center-earth-stem-marker"
    ));
  }
  right.append(heavenStem, earthStem);
  content.append(left, center, right);
  return content;
}

function createQimenPalaceGuaCorner(palace, palaceMeta, palaceMarkers = {}) {
  const corner = document.createElement("div");
  corner.className = "qimen-palace-gua-corner";

  const label = document.createElement("span");
  label.className = "qimen-palace-gua-label";
  label.textContent = formatNullableQimenValue(palace?.palaceName || palaceMeta.name);
  corner.append(label);

  if (palaceMarkers.palaceOverDoor === "剋") {
    corner.append(createQimenInlineMarker("剋", "qimen-palace-over-door-marker"));
  } else if (palaceMarkers.palaceGenerateDoor === "生") {
    corner.append(createQimenInlineMarker("生", "qimen-palace-generate-door-marker"));
  }

  return corner;
}

function createQimenInlineMarker(text, className, ariaLabel = null) {
  const marker = document.createElement("span");
  marker.className = className;
  marker.textContent = text;
  if (ariaLabel) {
    marker.setAttribute("aria-label", ariaLabel);
  }
  return marker;
}

function createQimenPalaceNote(palace) {
  const notes = Array.isArray(palace.notes)
    ? palace.notes.filter((note) => note && !QIMEN_HIDDEN_PLATE_NOTES.has(note))
    : [];
  if (notes.length === 0) {
    return null;
  }

  const note = document.createElement("div");
  note.className = "qimen-palace-note";
  note.textContent = notes.join("；");
  return note;
}

function createQimenOpenCloseBadge(openClose) {
  const badge = document.createElement("span");
  badge.className = [
    "qimen-open-close-badge",
    openClose.type === "open" ? "is-open" : "is-close",
  ].join(" ");
  badge.textContent = openClose.label;
  badge.setAttribute("aria-label", `九星加時定開闔：${openClose.label}`);
  return badge;
}

function formatQimenPalaceHeader(palace, palaceMeta, openClose = null) {
  const direction = formatNullableQimenValue(palace?.direction || palaceMeta.direction);
  const number = formatNullableQimenValue(palace?.luoshuNumber || palaceMeta.number);
  return `${direction}｜${number}${openClose ? "｜" : ""}`;
}

function formatNullableQimenValue(value) {
  return value === null || value === undefined || value === "" ? "—" : String(value);
}

function getQimenPlateDisplayOrder() {
  return QIMEN_PALACE_DISPLAY_LAYOUT.flat();
}

function createQimenSummaryRows(qimen, plate = null) {
  const markers = plate ? decorateQimenPlateMarkers(plate) : null;
  const zhiFuPalaceKey = plate ? findQimenDisplayZhiFuPalaceKey(plate) : null;
  const zhiShiPalaceKey = findQimenZhiShiPalaceKey(plate);
  const tianYiPalaceKey = findQimenTianYiPalaceKey(markers);
  const annotations = createQimenSummaryAnnotations(qimen, plate);

  const rows = [
    createQimenSummaryRow("節氣", qimen.actualSolarTerm),
    createQimenSummaryRow("起局", formatQimenJuSummary(qimen)),
    createQimenSummaryRow("時辰", formatQimenTimeSummary(qimen)),
    createQimenSummaryDivider(),
    createQimenSummaryRow("直符星", formatQimenStarPalace(plate?.zhiFuStar, zhiFuPalaceKey)),
    createQimenSummaryRow("直使門", formatQimenDoorPalace(plate?.zhiShiDoor, zhiShiPalaceKey)),
    createQimenSummaryRow(
      "天乙星",
      formatQimenStarPalace(plate?.palaces?.[tianYiPalaceKey]?.star, tianYiPalaceKey)
    ),
    createQimenSummaryDivider(),
    createQimenTimeSpecialConditionsSection(annotations.timeSpecialConditions),
  ];

  const notes = formatQimenNotes(qimen.notes);
  if (notes) {
    rows.push(createQimenSummaryRow("備註", notes, "qimen-note"));
  }

  return rows;
}

function createQimenSummaryAnnotations(qimen, plate = null) {
  return {
    timeSpecialConditions: resolveQimenTimeSpecialConditions({
      dayPillar: currentCalendarResult?.dayPillar,
      hourPillar: qimen?.hourPillar,
      plate,
    }),
  };
}

function createQimenSummaryDivider() {
  const divider = document.createElement("div");
  divider.className = "qimen-summary-divider";
  divider.setAttribute("aria-hidden", "true");
  return divider;
}

function createQimenTimeSpecialConditionsSection(timeSpecialConditions) {
  const section = document.createElement("div");
  section.className = "qimen-time-special-conditions";
  for (const condition of timeSpecialConditions?.conditions ?? []) {
    const line = document.createElement("div");
    line.className = "qimen-time-special-condition";
    line.textContent = condition.label;
    section.append(line);
  }
  return section;
}

function formatQimenJuSummary(qimen) {
  const term = qimen?.qimenSolarTerm || "—";
  const yuan = qimen?.yuan || "";
  const dunName = qimen?.dunName || "";
  const ju = Number.isInteger(qimen?.ju) ? formatQimenJuLabel(qimen.ju) : "";
  const status = qimen?.status ? ` (${qimen.status})` : "";
  return `${term}${yuan} ${dunName}${ju}${status}`.trim();
}

function formatQimenTimeSummary(qimen) {
  const dayPillar = currentCalendarResult?.dayPillar;
  const hourPillar = qimen?.hourPillar;

  if (!dayPillar || !hourPillar) {
    return "—";
  }

  return `${dayPillar}日 ${hourPillar}時`;
}

function findQimenZhiShiPalaceKey(plate) {
  return getQimenPlateDisplayOrder().find(({ key }) => plate?.palaces?.[key]?.isZhiShiPalace === true)?.key ?? null;
}

function findQimenTianYiPalaceKey(markers) {
  return getQimenPlateDisplayOrder().find(({ key }) => markers?.palaces?.[key]?.isTianYiStarPalace === true)?.key ?? null;
}

function formatQimenStarPalace(star, palaceKey) {
  if (typeof star !== "string" || !star || !palaceKey) {
    return "—";
  }

  const value = `${star.endsWith("星") ? star : `${star}星`} ${formatQimenPalaceName(palaceKey)}`;
  return appendQimenHexagramLabel(value, getTrigramByQimenStar(star), palaceKey);
}

function formatQimenDoorPalace(door, palaceKey) {
  if (!door || !palaceKey) {
    return "—";
  }

  const value = `${door}門 ${formatQimenPalaceName(palaceKey)}`;
  return appendQimenHexagramLabel(value, getTrigramByQimenDoor(door), palaceKey);
}

function appendQimenHexagramLabel(value, upperTrigram, palaceKey) {
  const lowerTrigram = getTrigramByQimenPalaceKey(palaceKey);
  const hexagram = getHexagramByTrigrams(upperTrigram?.key, lowerTrigram?.key);
  const label = formatHexagramLabel(hexagram);
  return label ? `${value} （${label}）` : value;
}

function formatQimenPalaceName(palaceKey) {
  const palace = getQimenPlateDisplayOrder().find(({ key }) => key === palaceKey);
  return palace ? `${palace.name}宮` : "—";
}

function createQimenSummaryRow(label, value, className = "") {
  const row = document.createElement("div");
  row.className = ["qimen-summary-row", className].filter(Boolean).join(" ");

  const labelElement = document.createElement("span");
  labelElement.className = "qimen-label";
  labelElement.textContent = `${label}：`;

  const valueElement = document.createElement("span");
  valueElement.className = "qimen-value";
  valueElement.textContent = value || "—";

  row.append(labelElement, valueElement);
  return row;
}

function createQimenManualField(labelText) {
  const field = document.createElement("label");
  field.className = "qimen-manual-field";

  const label = document.createElement("span");
  label.className = "qimen-manual-field-label";
  label.textContent = labelText;

  field.append(label);
  return field;
}

function createOption(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  return option;
}

function getQimenDunName(dunType) {
  return dunType === "yang" ? "陽遁" : dunType === "yin" ? "陰遁" : "";
}

function formatQimenSolarTermLabel(qimen) {
  const term = qimen?.qimenSolarTerm || "—";
  return qimen?.isIntercalary === true ? `${term}（置閏）` : term;
}

function formatQimenJuLabel(ju) {
  return QIMEN_JU_LABELS[ju] ?? `${ju}局`;
}

function formatQimenNotes(notes) {
  if (!Array.isArray(notes)) {
    return "";
  }

  return notes
    .filter((note) => typeof note === "string" && !note.includes("full cycle draft 置閏 timeline"))
    .join("；");
}

function createJinhanSummaryItems(dayPillar, pan, guiDeng = null) {
  const items = [
    { label: "日柱", value: `${dayPillar}日` },
    { label: "金函玉鏡盤", value: pan.meta.label },
    { label: "中宮", value: pan.meta.center },
  ];

  if (guiDeng) {
    items.push(
      { label: "登貴", valueNode: createJinhanDengGuiList(guiDeng.entries) },
      { label: "日出", value: `${guiDeng.sunriseText}　日落：${guiDeng.sunsetText}` }
    );
  }

  return items.map((item) => {
    const line = document.createElement("div");
    line.className = item.valueNode ? "jinhan-summary-item jhy-denggui" : "jinhan-summary-item";

    const label = document.createElement("span");
    label.className = item.valueNode ? "jinhan-summary-label jhy-denggui-label" : "jinhan-summary-label";
    label.textContent = `${item.label}：`;

    const value = document.createElement("span");
    value.className = item.valueNode ? "jinhan-summary-value jhy-denggui-list" : "jinhan-summary-value";
    if (item.valueNode) {
      value.append(item.valueNode);
    } else {
      value.textContent = item.value;
    }

    line.append(label, value);
    return line;
  });
}

function createJinhanDengGuiList(entries) {
  const fragment = document.createDocumentFragment();
  const availableEntries = Array.isArray(entries) ? entries : [];

  if (availableEntries.length === 0) {
    fragment.append(createBlockSpan("無"));
    return fragment;
  }

  fragment.append(
    ...availableEntries.map((entry) =>
      createBlockSpan(`${entry.hourBranch}時（${entry.label}，${entry.rangeText}）`)
    )
  );
  return fragment;
}

function createJinhanGridCells(pan, deitiesByPalace) {
  return JINHAN_PALACE_LAYOUT.flatMap((row) =>
    row.map((palaceName) => createJinhanPalaceCell(palaceName, pan, deitiesByPalace))
  );
}

function createJinhanPalaceCell(palaceName, pan, deitiesByPalace) {
  const palaceMeta = JINHAN_PALACE_META[palaceName];
  const cell = document.createElement("div");
  cell.className = palaceName === "中" ? "jinhan-palace jinhan-center" : "jinhan-palace";

  const palaceLabel = createInlineSpan(
    `${palaceMeta.name}${palaceMeta.number}`,
    "jinhan-palace-corner jinhan-palace-corner-left"
  );
  const directionLabel = createInlineSpan(
    palaceMeta.direction,
    "jinhan-palace-corner jinhan-palace-corner-right"
  );

  if (palaceName === "中") {
    const centerContent = document.createElement("div");
    centerContent.className = "jinhan-center-content";
    centerContent.append(
      createBlockSpan(pan.meta.dunType),
      createBlockSpan(`${pan.meta.pillar}日`),
      createBlockSpan(pan.meta.center, getJinhanStarClassName(pan.meta.center))
    );
    cell.append(centerContent, palaceLabel, directionLabel);
    return cell;
  }

  const palace = pan.palaces[palaceName] ?? {};
  const star = document.createElement("div");
  star.className = getJinhanStarClassName(palace.star);
  star.textContent = palace.star ?? "—";

  const door = document.createElement("div");
  door.className = getJinhanDoorClassName(palace.door);
  door.textContent = palace.door ?? "—";

  const main = document.createElement("div");
  main.className = "jinhan-palace-main";
  main.append(star, door);

  const chips = document.createElement("div");
  chips.className = "jinhan-deity-chips";
  chips.append(...(deitiesByPalace[palaceName] ?? []).map(createJinhanDeityChip));

  cell.append(main, chips, palaceLabel, directionLabel);
  return cell;
}

function createJinhanDeityChip(deity) {
  const chip = document.createElement("span");
  chip.className = `jinhan-deity-chip ${JINHAN_DEITY_CLASS_NAMES[deity.key] ?? ""}`.trim();
  chip.title = deity.label;
  chip.textContent = deity.shortLabel;
  return chip;
}

function createJinhanHourRow(hour, currentHourIndex, displayIndex, dengGuiBranches = new Set()) {
  const row = document.createElement("tr");
  const hourIndex = Number(hour.index);
  const isCurrent = hourIndex === currentHourIndex || displayIndex === currentHourIndex;
  const hourBranch = typeof hour.pillar === "string" ? hour.pillar[1] : "";
  const blackYellowText = [
    hour.deity,
    hour.type === "yellow" ? "吉" : "凶",
    dengGuiBranches.has(hourBranch) ? "登貴" : "",
  ].filter(Boolean).join(" ");

  if (isCurrent) {
    row.classList.add("jinhan-hour-current");
  }

  row.append(
    createJinhanPillarTimeCell(hour, isCurrent),
    createTableCell(blackYellowText, `jinhan-hour-type-${hour.type}`),
    createTableCell(hour.notes.length > 0 ? hour.notes.join("、") : "—")
  );
  return row;
}

function createJinhanPillarTimeCell(hour, isCurrent) {
  const cell = document.createElement("td");
  const hourBranch = typeof hour.pillar === "string" ? hour.pillar[1] : "";
  const clashingZodiac = getClashingZodiacByBranch(hourBranch);
  const pillar = createJinhanHourPillarLine(hour.pillar, clashingZodiac);
  const timeRange = createBlockSpan(formatJinhanHourTimeRange(hour.timeRange), "jinhan-hour-time-range");

  if (isCurrent) {
    const marker = document.createElement("span");
    marker.className = "jinhan-current-marker";
    marker.textContent = "▶";

    pillar.prepend(marker);
    cell.append(pillar, timeRange);
    return cell;
  }

  cell.append(pillar, timeRange);
  return cell;
}

function createJinhanHourPillarLine(pillarText, clashingZodiac) {
  const line = document.createElement("span");
  line.className = "hour-pillar-line jinhan-hour-pillar";

  if (!pillarText) {
    line.textContent = "—";
    return line;
  }

  line.append(document.createTextNode(pillarText));

  if (clashingZodiac) {
    const clash = document.createElement("span");
    clash.className = "hour-clash-zodiac";
    clash.textContent = `（衝煞 ${clashingZodiac}）`;
    line.append(clash);
  }

  return line;
}

function updateJinhanCurrentHourLabel(currentHourInfo) {
  if (!currentHourInfo) {
    elements.jinhanCurrentHourLabel.textContent = "目前時辰：--";
    return;
  }

  const clashingZodiac = getClashingZodiacByBranch(currentHourInfo.branch);
  elements.jinhanCurrentHourLabel.textContent = `目前時辰：${currentHourInfo.branch}時（${currentHourInfo.timeRange}）　❌ 衝煞：${clashingZodiac}`;
}

function getDengGuiBranchSet(guiDeng) {
  const entries = Array.isArray(guiDeng?.entries) ? guiDeng.entries : [];
  return new Set(entries.map((entry) => entry.hourBranch).filter(Boolean));
}

function formatJinhanHourTimeRange(timeRange) {
  const match = /^(\d{2})\s*~\s*(\d{2})$/.exec(String(timeRange ?? "").trim());
  if (!match) {
    return timeRange;
  }

  const startHour = Number(match[1]);
  const endHour = positiveMod(Number(match[2]) - 1, 24);
  return `${String(startHour).padStart(2, "0")}:00–${String(endHour).padStart(2, "0")}:59`;
}

function positiveMod(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function createInlineSpan(text, className) {
  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  return span;
}

function createBlockSpan(text, className = "") {
  const span = document.createElement("span");
  if (className) {
    span.className = className;
  }
  span.textContent = text;
  return span;
}

function getJinhanStarClassName(starName) {
  const classNames = ["jinhan-star", "jinhan-star-badge"];

  if (["太乙", "天乙", "青龍"].includes(starName)) {
    classNames.push("jhy-star-auspicious-strong");
  } else if (starName === "太陰") {
    classNames.push("jhy-star-auspicious-soft");
  } else if (["軒轅", "招搖"].includes(starName)) {
    classNames.push("jhy-star-auspicious-secondary");
  }

  return classNames.join(" ");
}

function getJinhanDoorClassName(doorName) {
  return ["開", "休", "生"].includes(doorName)
    ? "jinhan-door jhy-door-auspicious"
    : "jinhan-door";
}

function createTableCell(text, className = "") {
  const cell = document.createElement("td");
  if (className) {
    cell.className = className;
  }
  cell.textContent = text;
  return cell;
}

function createFlyingStarChart(title, chart, periodChart, cellMarkersByPalace = {}) {
  const article = document.createElement("article");
  article.className = "flying-star-card";
  article.setAttribute("data-chart-type", chart.type);

  const heading = document.createElement("h3");
  heading.textContent = title;

  const summary = document.createElement("div");
  summary.className = "flying-star-summary";
  const centerPalace = chart.palaces.center;
  summary.append(
    createMetaLine("中宮", `${formatStarCircleNumber(chart.centerStar)} ${formatStarName(centerPalace)}入中`),
    createMetaLine("飛法", formatDirection(chart.direction)),
    createBasisBlock(formatFlyingStarBasis(chart, periodChart))
  );

  const grid = document.createElement("div");
  grid.className = "nine-palace-grid";

  for (const row of chart.layout) {
    for (const palace of row) {
      grid.append(createPalaceCell(palace, cellMarkersByPalace[palace.id] ?? []));
    }
  }

  article.append(heading, summary, grid);
  return article;
}

function createCombinedFlyingStarChart(charts, afflictionViewModel) {
  const viewModel = createCombinedFlyingStarViewModel(charts, afflictionViewModel);
  const article = document.createElement("article");
  article.className = "flying-star-card combined-flying-star-card";

  const heading = document.createElement("h3");
  heading.textContent = "五層綜合盤";

  const summary = document.createElement("div");
  summary.className = "combined-flying-star-summary";
  summary.append(...createCombinedFlyingStarSummary(charts).map(createCombinedFlyingStarSummaryItem));

  const grid = document.createElement("div");
  grid.className = "nine-palace-grid combined-nine-palace-grid";

  for (const row of viewModel.layout) {
    for (const palace of row) {
      grid.append(createCombinedFlyingStarPalaceCell(palace));
    }
  }

  article.append(heading, summary, grid);
  if (afflictionViewModel.summary) {
    article.append(createAnnualAfflictionSummary(afflictionViewModel.summary));
  }
  return article;
}

function createCombinedFlyingStarSummaryItem(summary) {
  const item = document.createElement("div");
  item.className = "combined-flying-star-summary-item";
  item.textContent = `${summary.label}：${summary.value}`;
  return item;
}

function createCombinedFlyingStarPalaceCell(palace) {
  const cell = document.createElement("div");
  cell.className = palace.id === "center"
    ? "palace-cell palace-center combined-palace-cell"
    : "palace-cell combined-palace-cell";
  cell.setAttribute("data-palace-id", palace.id);

  cell.append(
    createCombinedStarLayers(palace.layers),
    createAfflictionMarkerStack(palace.markers),
    createPalaceFooter(palace)
  );
  return cell;
}

function createCombinedStarLayers(layers) {
  const container = document.createElement("div");
  container.className = "combined-star-layers";
  container.append(...layers.map(createCombinedStarItem));
  return container;
}

function createCombinedStarItem(layer) {
  const item = document.createElement("div");
  item.className = "combined-star-layer";
  item.setAttribute("data-layer", layer.key);

  const label = document.createElement("span");
  label.className = "combined-star-label";
  label.textContent = layer.label;

  const starNumber = document.createElement("span");
  starNumber.className = "combined-star-number";
  starNumber.textContent = layer.starCircle;

  const starName = document.createElement("span");
  starName.className = "combined-star-name";
  starName.textContent = layer.starName;

  item.append(label, starNumber, starName);
  if (layer.hasSanSha) {
    item.setAttribute("data-san-sha", "true");
    item.append(createAfflictionBadge({
      key: "sanSha",
      name: "三煞",
      label: "三",
      direction: layer.sanSha.direction,
    }, "san-sha-badge"));
  }
  return item;
}

function createAfflictionMarkerStack(badges) {
  if (!Array.isArray(badges) || badges.length === 0) {
    return document.createDocumentFragment();
  }

  const container = document.createElement("div");
  container.className = "flying-star-marker-stack";
  container.append(...badges.map((badge) => createAfflictionBadge(badge)));
  return container;
}

function createAfflictionBadge(badge, extraClassName = "") {
  const badgeElement = document.createElement("span");
  badgeElement.className = ["flying-star-affliction-badge", extraClassName]
    .filter(Boolean)
    .join(" ");
  badgeElement.setAttribute("data-affliction", badge.key);
  if (badge.sourceLayer) {
    badgeElement.setAttribute("data-layer", badge.sourceLayer);
  }
  badgeElement.title = `${badge.name}${badge.direction}`;
  badgeElement.textContent = badge.label;
  return badgeElement;
}

function createAnnualAfflictionSummary(summaryText) {
  const summary = document.createElement("div");
  summary.className = "annual-affliction-summary";
  summary.textContent = summaryText;
  return summary;
}

function createPalaceFooter(palace) {
  const fragment = document.createDocumentFragment();

  const palaceLabel = document.createElement("div");
  palaceLabel.className = "palace-corner palace-corner-left";
  palaceLabel.textContent = `${palace.name}${palace.number}`;

  const directionLabel = document.createElement("div");
  directionLabel.className = "palace-corner palace-corner-right";
  directionLabel.textContent = PALACE_DIRECTION_LABELS[palace.id] ?? "";

  fragment.append(palaceLabel, directionLabel);
  return fragment;
}

function createMetaLine(label, value) {
  const line = document.createElement("div");
  line.className = "meta-line";

  const labelElement = document.createElement("span");
  labelElement.className = "meta-label";
  labelElement.textContent = `${label}：`;

  const valueElement = document.createElement("span");
  valueElement.textContent = value;

  line.append(labelElement, valueElement);
  return line;
}

function createBasisBlock(items) {
  const container = document.createElement("div");
  container.className = "basis-block";

  const title = document.createElement("div");
  title.className = "basis-title";
  title.textContent = "依據";

  const list = document.createElement("dl");
  list.className = "basis-list";

  for (const item of items) {
    const term = document.createElement("dt");
    term.textContent = item.label;

    const description = document.createElement("dd");
    description.textContent = item.value;

    list.append(term, description);
  }

  container.append(title, list);
  return container;
}

function createPalaceCell(palace, afflictionBadges = []) {
  const cell = document.createElement("div");
  cell.className = palace.id === "center" ? "palace-cell palace-center" : "palace-cell";
  cell.setAttribute("data-palace-id", palace.id);

  const starName = document.createElement("div");
  starName.className = "palace-star-center";
  starName.textContent = palace.starDisplayName;

  const palaceLabel = document.createElement("div");
  palaceLabel.className = "palace-corner palace-corner-left";
  palaceLabel.textContent = `${palace.name}${palace.number}`;

  const directionLabel = document.createElement("div");
  directionLabel.className = "palace-corner palace-corner-right";
  directionLabel.textContent = PALACE_DIRECTION_LABELS[palace.id] ?? "";

  cell.append(
    starName,
    createAfflictionMarkerStack(afflictionBadges),
    palaceLabel,
    directionLabel
  );
  return cell;
}

function formatDirection(direction) {
  return direction === "reverse" ? "逆飛" : "順飛";
}

function formatFlyingStarBasis(chart, periodChart) {
  const basis = chart.basis ?? {};

  if (chart.type === "period") {
    return [
      { label: "西元年份", value: `${basis.year}` },
      { label: "三元九運", value: formatPeriodCycle(chart.period) },
    ];
  }

  if (chart.type === "annual") {
    return [
      { label: "有效年份", value: `${basis.year}` },
      { label: "年柱", value: `${getPeriodYuanName(periodChart?.period)}${basis.yearPillar ?? "—"}` },
    ];
  }

  if (chart.type === "monthly") {
    return [
      { label: "月盤依據", value: formatMonthlySummary(chart) },
      { label: "月柱", value: basis.monthPillar },
      { label: "月建", value: basis.monthBranch },
    ];
  }

  if (chart.type === "daily") {
    return [
      { label: "日柱", value: basis.dayPillar },
      { label: "目前節氣", value: basis.termName },
      { label: "日盤系統", value: basis.systemName },
    ];
  }

  if (chart.type === "hourly") {
    return [
      { label: "日柱", value: basis.dayPillar },
      { label: "時柱", value: basis.hourPillar },
      { label: "目前節氣", value: basis.termName },
      { label: "時盤系統", value: basis.systemName },
    ];
  }

  return [];
}

function createTermLine(label, value, className) {
  const line = document.createElement("div");
  line.className = className;
  line.textContent = `${label}：${value}`;
  return line;
}

function createHouVariantSection(title, hou, className) {
  const section = document.createElement("div");
  section.className = `hou-section ${className}`;

  const heading = document.createElement("div");
  heading.className = "hou-section-title";
  heading.textContent = title;

  const lines = document.createElement("div");
  lines.className = "hou-variant-lines";
  lines.append(createHouVariantLine(hou, "zh"), createHouVariantLine(hou, "jp"));

  section.append(heading, lines);
  return section;
}

function createHouVariantLine(hou, variantKey) {
  const line = document.createElement("div");
  line.className = `hou-variant-line hou-variant-${variantKey}`;

  const variant = getHouVariant(hou, variantKey);
  const label = document.createElement("span");
  label.className = "hou-variant-label";
  label.textContent = `${variant.label}：`;

  const text = document.createElement("span");
  text.className = "hou-variant-text";
  text.textContent = formatHouVariantLine(hou, variant);

  line.append(label, text);
  return line;
}

function getHouVariant(hou, variantKey) {
  const variant = hou?.variants?.[variantKey];
  const fallbackName = variantKey === "zh" ? hou?.shortName || hou?.name || "—" : "—";

  return {
    label: getNonEmptyText(variant?.label, variantKey === "zh" ? "中" : "日"),
    name: getNonEmptyText(variant?.name, fallbackName),
    shortName: getNonEmptyText(variant?.shortName, getNonEmptyText(variant?.name, fallbackName)),
  };
}

function formatHouVariantLine(hou, variant) {
  const termPhase = `${getNonEmptyText(hou?.term, "")}${getNonEmptyText(hou?.phase, "")}`;
  const name = getNonEmptyText(variant.shortName, getNonEmptyText(variant.name, "—"));

  return termPhase ? `${termPhase}・${name}` : name;
}

function getNonEmptyText(value, fallback) {
  return typeof value === "string" && value.trim() !== "" ? value : fallback;
}

function formatTermDateTime(term, displayContext = null) {
  if (displayContext) {
    return formatDateTimeForChartMode({
      instantMs: term?.timeMs,
      context: displayContext,
      includeYear: true,
    }) ?? "—";
  }
  const date = new Date(term.timeMs);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatHouRangeDateTime(dateTimeValue, displayContext = null) {
  const date = new Date(dateTimeValue);
  if (!Number.isFinite(date.getTime())) {
    return "—";
  }

  if (displayContext) {
    return formatDateTimeForChartMode({
      instantMs: date.getTime(),
      context: displayContext,
      includeYear: false,
    }) ?? "—";
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${month}/${day} ${hour}:${minute}`;
}

function getElement(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`找不到必要的 DOM 元素：${selector}`);
  }

  return element;
}

function updateWeekdayLabel(dateTimeValue, dayPillar = "", jianchu = null, dailyInfo = null) {
  renderWeekdayLabel(
    formatWeekdayLabel(dateTimeValue, dayPillar, jianchu, dailyInfo),
    dailyInfo
  );
}

function updateWeekdayLabelForEffectiveDay(
  dateKey,
  dayPillar = "",
  jianchu = null,
  dailyInfo = null,
  displayContext = null
) {
  renderWeekdayLabel(
    formatBaziDailySummaryFromDateKey({
      dateKey,
      dayBranch: dayPillar?.[1],
      clashZodiac: dailyInfo?.clash?.zodiac,
      jianchuName: jianchu?.fullName,
    }),
    dailyInfo,
    formatEffectiveDayLabel(dateKey),
    formatTrueSolarDateSemanticsLabel(dateKey, displayContext)
  );
}

function formatEffectiveDayLabel(dateKey) {
  if (typeof dateKey !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return "";
  }

  return `真太陽有效日：${dateKey.replaceAll("-", "/")}`;
}

function formatTrueSolarDateSemanticsLabel(effectiveDayDateKey, displayContext = null) {
  const watchLocalParts = displayContext?.civil?.localParts;
  const watchDateKey = formatCalendarDateKey(watchLocalParts);
  if (!watchDateKey || !/^\d{4}-\d{2}-\d{2}$/.test(effectiveDayDateKey ?? "") || watchDateKey === effectiveDayDateKey) {
    return "";
  }

  const lunarDate = getLunarDateForSolarDate(
    watchLocalParts.year,
    watchLocalParts.month,
    watchLocalParts.day
  );
  const lunarLabel = lunarDate ? formatLunarCalendarLabel(lunarDate) : "—";
  return `手錶日期：${formatCalendarDateLabel(watchLocalParts)}｜農曆（手錶日期）：${lunarLabel}`;
}

function formatCalendarDateKey(localParts) {
  if (!localParts || !Number.isInteger(localParts.year) || !Number.isInteger(localParts.month) || !Number.isInteger(localParts.day)) {
    return "";
  }

  const date = new Date(Date.UTC(localParts.year, localParts.month - 1, localParts.day));
  if (
    date.getUTCFullYear() !== localParts.year
    || date.getUTCMonth() !== localParts.month - 1
    || date.getUTCDate() !== localParts.day
  ) {
    return "";
  }

  return `${String(localParts.year).padStart(4, "0")}-${String(localParts.month).padStart(2, "0")}-${String(localParts.day).padStart(2, "0")}`;
}

function formatCalendarDateLabel(localParts) {
  const dateKey = formatCalendarDateKey(localParts);
  return dateKey ? dateKey.replaceAll("-", "/") : "—";
}

function renderWeekdayLabel(summary, dailyInfo, effectiveDayLabel = "", dateSemanticsLabel = "") {
  const weekdayLine = document.createElement("span");
  weekdayLine.className = "weekday-line";
  weekdayLine.textContent = summary;

  const effectiveDayLine = effectiveDayLabel
    ? createBlockSpan(effectiveDayLabel, "effective-day-label")
    : null;
  if (effectiveDayLine) {
    effectiveDayLine.setAttribute("aria-label", effectiveDayLabel);
  }
  const dateSemanticsLine = dateSemanticsLabel
    ? createBlockSpan(dateSemanticsLabel, "date-semantics-label")
    : null;
  if (dateSemanticsLine) {
    dateSemanticsLine.setAttribute("aria-label", dateSemanticsLabel);
  }
  const clothingBlock = createDailyClothingBlock(dailyInfo?.clothing);
  elements.weekdayLabel.replaceChildren(
    ...[
      weekdayLine,
      effectiveDayLine,
      dateSemanticsLine,
      clothingBlock,
    ].filter(Boolean)
  );
}

function formatWeekdayLabel(dateTimeValue, dayPillar, jianchu, dailyInfo) {
  const date = parseDateTimeLocalValue(dateTimeValue);
  if (!date) {
    return "--";
  }

  return formatBaziDailySummary({
    date,
    dayBranch: dayPillar?.[1],
    clashZodiac: dailyInfo?.clash?.zodiac,
    jianchuName: jianchu?.fullName,
  });
}

function createDailyClothingBlock(clothing) {
  if (!clothing) {
    return null;
  }

  const block = document.createElement("span");
  block.className = "daily-clothing";

  const title = document.createElement("span");
  title.className = "daily-clothing-title";
  title.textContent = "衣著：";

  const lines = document.createElement("span");
  lines.className = "daily-clothing-lines";
  lines.append(
    createDailyClothingLine("🧥", clothing.best),
    createDailyClothingLine("🧥", clothing.good),
    createDailyClothingLine("⛔", clothing.avoid)
  );

  block.append(title, lines);
  return block;
}

function createDailyClothingLine(icon, item) {
  const line = document.createElement("span");
  line.className = "daily-clothing-line";
  line.textContent = formatClothingLine(icon, item);
  return line;
}

function formatClothingLine(icon, item) {
  if (!item) {
    return `${icon} —`;
  }

  const colors = Array.isArray(item.colors) ? item.colors.join("、") : "";
  return `${icon} ${item.label}：${item.element}（${colors}）`;
}

function getChineseHourIndex(dateTimeValue) {
  const date = parseDateTimeLocalValue(dateTimeValue);
  if (!date) {
    return null;
  }

  return getChineseHourIndexFromLocalParts({ hour: date.getHours() });
}

function getChineseHourIndexFromLocalParts(localParts) {
  const hour = localParts?.hour;
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    return null;
  }
  if (hour === 23 || hour === 0) {
    return 1;
  }

  return Math.floor((hour + 1) / 2) + 1;
}

function getChineseHourPickerState(nowInstantMs = Date.now()) {
  if (!isTrueSolarDisplayMode(chartDisplayMode)) {
    return {
      selectedIndex: getChineseHourIndex(elements.datetime.value),
      currentIndex: getChineseHourIndex(toLocalDatetimeValue(new Date(nowInstantMs))),
    };
  }
  if (!currentTrueSolarChartContext) {
    return { selectedIndex: null, currentIndex: null };
  }

  let currentLocalParts = null;
  try {
    currentLocalParts = getChartClockLocalPartsForInstant({
      instantMs: nowInstantMs,
      context: currentTrueSolarChartContext,
      mode: "true-solar",
    });
  } catch {
    return { selectedIndex: null, currentIndex: null };
  }
  return {
    selectedIndex: getChineseHourIndexFromLocalParts(currentTrueSolarChartContext.trueSolar?.localParts),
    currentIndex: getChineseHourIndexFromLocalParts(currentLocalParts),
  };
}

function getCurrentChineseHourInfo(dateTimeValue) {
  const index = getChineseHourIndex(dateTimeValue);
  if (!index) {
    return null;
  }

  return CHINESE_HOUR_LABELS.find((item) => item.index === index) ?? null;
}

function getSelectedCalendarDateFromDateTime(dateTimeValue) {
  const date = parseDateTimeLocalValue(dateTimeValue);
  if (!date) {
    return null;
  }

  if (date.getHours() >= 23) {
    date.setDate(date.getDate() + 1);
  }

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
}

function parseDateTimeLocalValue(dateTimeValue) {
  if (
    typeof dateTimeValue !== "string"
    || dateTimeValue.length > 32
    || dateTimeValue.trim() === ""
  ) {
    return null;
  }

  const match = dateTimeValue
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);

  if (!match) {
    return null;
  }

  const [, year, month, day, hour, minute, second = "0"] = match;
  const components = {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
  };
  const date = new Date(
    components.year,
    components.month - 1,
    components.day,
    components.hour,
    components.minute,
    components.second
  );

  if (
    date.getFullYear() !== components.year ||
    date.getMonth() !== components.month - 1 ||
    date.getDate() !== components.day ||
    date.getHours() !== components.hour ||
    date.getMinutes() !== components.minute ||
    date.getSeconds() !== components.second
  ) {
    return null;
  }

  return date;
}

function toLocalDatetimeValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

function normalizeLocalDateTimeValueWithSeconds(value) {
  const date = parseDateTimeLocalValue(value);
  return date ? toLocalDatetimeValue(date) : null;
}
