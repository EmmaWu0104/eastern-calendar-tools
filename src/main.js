import {
  createFlyingStarAfflictionViewModel,
} from "./annualAfflictions.js";
import { calculateBaziFromSolarTerms } from "./bazi.js";
import { getDailyGodsByStem } from "./dailyGods.js";
import {
  formatBaziDailySummary,
  getClashingZodiacByBranch,
  getDailyDaHuangDao,
} from "./dailyInfo.js";
import { getDongGongDaySelection } from "./dongGongDaySelection.js";
import { calculateAllFlyingStarCharts } from "./flyingStars.js";
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
  getJinhanBlackYellowHours,
  getJinhanDeitiesByPalace,
  getJinhanYujingDayPan,
} from "./jinhanYujing.js";
import { getJinhanDunType } from "./jinhanDunType.js";
import { getNaYinByPillar } from "./nayin.js";
import { calculateTrueSolarTime, parseCoordinateInput } from "./trueSolarTime.js";
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
// 第一版真太陽時 UI 固定以臺灣手錶時間 UTC+8；不處理海外歷史時區或夏令時間。
const TAIPEI_UTC_OFFSET_MINUTES = 480;

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
  qimenTabPanel: getElement("#panel-qimen"),
  trueSolarTimeCoordinate: getElement("#true-solar-time-coordinate"),
  trueSolarTimeCalculate: getElement("#true-solar-time-calculate"),
  trueSolarTimeGeolocate: getElement("#true-solar-time-geolocate"),
  trueSolarTimeWatchValue: getElement("#true-solar-time-watch-value"),
  trueSolarTimeLocationValue: getElement("#true-solar-time-location-value"),
  trueSolarTimeStatus: getElement("#true-solar-time-status"),
  trueSolarTimeResult: getElement("#true-solar-time-result"),
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
  message: getElement("#message"),
};

let currentCalendarResult = null;
let currentSolarTerms = null;
let isJinhanDunTypeManuallyOverridden = false;
let isAutoNowMode = false;
let autoNowTimerId = null;
let trueSolarTimeClockTimerId = null;
let isCalculating = false;
let pendingDateTimeValue = null;
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
elements.calendarPrevious.addEventListener("click", () => shiftVisibleCalendarMonth(-1));
elements.calendarNext.addEventListener("click", () => shiftVisibleCalendarMonth(1));
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
});
elements.jinhanDunType.addEventListener("change", () => {
  isJinhanDunTypeManuallyOverridden = true;
  void renderJinhanYujing(currentCalendarResult, currentDateTimeValue ?? elements.datetime.value);
});
elements.trueSolarTimeCalculate.addEventListener("click", calculateTrueSolarTimeFromCoordinateInput);
elements.trueSolarTimeGeolocate.addEventListener("click", requestTrueSolarTimeGeolocation);
qimenElements.manualToggle.addEventListener("change", handleQimenManualToggleChange);
qimenElements.manualDunSelect.addEventListener("change", handleQimenManualDunChange);
qimenElements.manualJuSelect.addEventListener("change", handleQimenManualJuChange);
qimenElements.manualRestore.addEventListener("click", restoreQimenAutoPlateLookup);

initializeQueryPicker();
startAutoNowMode();

function startAutoNowMode() {
  isAutoNowMode = true;
  stopAutoNowRefresh();
  startTrueSolarTimeClockRefresh();
  refreshFromCurrentTime();
  autoNowTimerId = window.setInterval(refreshFromCurrentTime, AUTO_NOW_REFRESH_MS);
}

function pauseAutoNowMode() {
  if (!isAutoNowMode) {
    return;
  }

  isAutoNowMode = false;
  stopAutoNowRefresh();
  stopTrueSolarTimeClockRefresh();
}

function stopAutoNowRefresh() {
  if (autoNowTimerId !== null) {
    window.clearInterval(autoNowTimerId);
    autoNowTimerId = null;
  }
}

function startTrueSolarTimeClockRefresh() {
  if (trueSolarTimeClockTimerId !== null) {
    return;
  }
  trueSolarTimeClockTimerId = window.setInterval(
    refreshTrueSolarTimeClock,
    TRUE_SOLAR_TIME_CLOCK_REFRESH_MS
  );
}

function stopTrueSolarTimeClockRefresh() {
  if (trueSolarTimeClockTimerId !== null) {
    window.clearInterval(trueSolarTimeClockTimerId);
    trueSolarTimeClockTimerId = null;
  }
}

function refreshTrueSolarTimeClock() {
  if (!isAutoNowMode) {
    return;
  }
  renderTrueSolarTimeForWatchDate(new Date());
}

function refreshFromCurrentTime() {
  if (!isAutoNowMode) {
    return;
  }

  elements.datetime.value = toLocalDatetimeValue(new Date());
  syncQueryPickerFromDateTime(elements.datetime.value, { syncVisibleMonth: true });
  requestRenderDateTime(elements.datetime.value);
}

function handleManualDateTimeInput() {
  pauseAutoNowMode();

  if (!readDateTimeInput()) {
    return;
  }

  syncQueryPickerFromDateTime(elements.datetime.value, { syncVisibleMonth: true });
  requestRenderDateTime(elements.datetime.value);
}

function handleManualDateTimeChange() {
  pauseAutoNowMode();

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
  const selectedIndex = getChineseHourIndex(elements.datetime.value);
  const currentIndex = getChineseHourIndex(toLocalDatetimeValue(new Date()));
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
  const selectedDate = selectedCalendarDate
    ?? getSelectedCalendarDateFromDateTime(elements.datetime.value)
    ?? getSelectedCalendarDateFromDateTime(toLocalDatetimeValue(new Date()));
  if (!selectedDate) {
    return;
  }

  const dateTimeValue = buildDateTimeValueFromDateAndChineseHour(
    selectedDate.year,
    selectedDate.month,
    selectedDate.day,
    hourIndex
  );
  if (!dateTimeValue) {
    return;
  }

  pauseAutoNowMode();
  elements.datetime.value = dateTimeValue;
  syncQueryPickerFromDateTime(dateTimeValue, { syncSelectedCalendarDate: false });
  requestRenderDateTime(dateTimeValue);
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
  if (!parseDateTimeLocalValue(dateTimeValue)) {
    return;
  }

  if (isCalculating) {
    pendingDateTimeValue = dateTimeValue;
    return;
  }

  void renderByDateTime(dateTimeValue);
}

async function renderByDateTime(dateTimeValue) {
  setMessage("計算中...", "loading");
  isCalculating = true;

  try {
    const solarTerms = await loadSolarTerms();
    const result = calculateBaziFromSolarTerms(dateTimeValue, solarTerms);
    currentCalendarResult = result;
    currentSolarTerms = solarTerms;
    currentDateTimeValue = dateTimeValue;
    isJinhanDunTypeManuallyOverridden = false;
    renderResult(result, dateTimeValue);
    renderQueryPicker();
    renderFlyingStars(result, dateTimeValue);
    await renderJinhanYujing(result, dateTimeValue);
    renderQimenSection(dateTimeValue);
    renderTrueSolarTimeForWatchDate(dateTimeValue);
    setMessage("", "");
  } catch (error) {
    currentCalendarResult = null;
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
    }
  }
}

function renderResult(result, dateTimeValue) {
  const dailyDaHuangDao = getDailyDaHuangDao(result.monthBranch, result.dayPillar?.[1]);
  renderPillar(elements.yearPillar, result.yearPillar, undefined, undefined, true);
  renderPillar(elements.monthPillar, result.monthPillar, undefined, undefined, true);
  renderPillar(elements.dayPillar, result.dayPillar, undefined, undefined, true);
  renderPillar(elements.hourPillar, result.hourPillar, undefined, undefined, true);
  renderSolarTermDayPanel(getSelectedSolarTermDay());
  renderPillarExtraPanel(result.jianchu, dailyDaHuangDao, result.dailyInfo);
  updateWeekdayLabel(dateTimeValue, result.dayPillar, result.jianchu, result.dailyInfo);
  renderSeasonInfo(result);
  renderDongGongDaySelection(result);
  renderSpecNotes();
}

function clearResult() {
  currentCalendarResult = null;
  currentSolarTerms = null;
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

function renderSeasonInfo(result) {
  const currentTerm = result?.currentTerm ?? null;
  const nextTerm = result?.nextTerm ?? null;
  const currentHou = result?.currentHou ?? null;
  const nextHou = result?.nextHou ?? null;
  const lines = [
    createSeasonInfoLine(`目前節氣：${currentTerm?.name ?? "—"}`, "season-line-title"),
    createSeasonInfoLine(currentTerm ? formatTermDateTime(currentTerm) : "—", "season-line-time"),
    createSeasonInfoLine("七十二候：", "season-line-title"),
    createSeasonInfoLine(formatSeasonHouVariantLine(currentHou, "zh"), "season-line-hou-current"),
    createSeasonInfoLine(formatSeasonHouVariantLine(currentHou, "jp"), "season-line-hou-current"),
    createSeasonInfoLine(
      currentHou ? `${formatHouRangeDateTime(currentHou.start)} ～ ${formatHouRangeDateTime(currentHou.end)}` : "—",
      "season-line-time"
    ),
    createSeasonInfoLine("下一候：", "season-line-next-title"),
    createSeasonInfoLine(formatSeasonHouVariantLine(nextHou, "zh"), "season-line-hou-next"),
    createSeasonInfoLine(formatSeasonHouVariantLine(nextHou, "jp"), "season-line-hou-next"),
    createSeasonInfoLine(`下一節氣：${nextTerm?.name ?? "—"}`, "season-line-title season-line-next-term"),
    createSeasonInfoLine(nextTerm ? formatTermDateTime(nextTerm) : "—", "season-line-time"),
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
    "查詢採手錶時間／瀏覽器本機時間，未套用真太陽時。",
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

function renderSolarTermDayPanel(solarTerms) {
  solarTermDayPanel.replaceChildren(
    ...solarTerms.map((term) => createBlockSpan(formatSolarTermDateTime(term), "solar-term-day-panel-line"))
  );
  solarTermDayPanel.hidden = solarTerms.length === 0;
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

function renderFlyingStars(calendarResult, inputDateTime) {
  try {
    const charts = calculateAllFlyingStarCharts(calendarResult, inputDateTime);
    const afflictionViewModel = createFlyingStarAfflictionViewModel(charts);
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
  } catch (error) {
    console.error("九宮飛星計算失敗", error);
    clearFlyingStars();
    const message = error instanceof Error ? error.message : String(error);
    elements.flyingStarsMessage.textContent = `九宮飛星計算失敗：${message}`;
  }
}

function clearFlyingStars() {
  elements.flyingStars.replaceChildren();
  elements.flyingStarsMessage.textContent = "";
}

async function renderJinhanYujing(calendarResult, dateTimeValue) {
  const dayPillar = calendarResult?.dayPillar;
  if (typeof dayPillar !== "string" || dayPillar.length < 2) {
    clearJinhanYujing("尚無日柱資料，無法顯示金函玉鏡日盤");
    return;
  }

  try {
    const dunTypeStatus = getJinhanDunType(dateTimeValue, calendarResult, currentSolarTerms);
    const selectedDunType = resolveJinhanSelectedDunType(dunTypeStatus);
    const pan = getJinhanYujingDayPan(dayPillar, selectedDunType.dunType);

    if (!pan) {
      clearJinhanYujing("查無金函玉鏡日盤資料");
      return;
    }

    const deitiesByPalace = getJinhanDeitiesByPalace(pan.meta);
    const blackYellowHours = getJinhanBlackYellowHours(dayPillar);
    const currentHourInfo = getCurrentChineseHourInfo(dateTimeValue);
    const currentHourIndex = currentHourInfo?.index ?? null;
    const guiDeng = await getGuiDengForCalendarResult(calendarResult, dateTimeValue);
    const dengGuiBranches = getDengGuiBranchSet(guiDeng);
    elements.jinhanMessage.textContent = "";
    updateJinhanCurrentHourLabel(currentHourInfo);
    elements.jinhanSummary.replaceChildren(...createJinhanSummaryItems(dayPillar, pan, guiDeng));
    elements.jinhanGrid.replaceChildren(...createJinhanGridCells(pan, deitiesByPalace));
    elements.jinhanHoursBody.replaceChildren(
      ...blackYellowHours.map((hour, index) =>
        createJinhanHourRow(hour, currentHourIndex, index + 1, dengGuiBranches)
      )
    );
  } catch (error) {
    console.error("金函玉鏡日盤顯示失敗", error);
    clearJinhanYujing("金函玉鏡日盤顯示失敗");
  }
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
  });
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

function calculateTrueSolarTimeFromCoordinateInput() {
  const input = elements.trueSolarTimeCoordinate.value.trim();
  if (!input) {
    setTrueSolarTimeStatus("請輸入經緯度。", "error");
    return;
  }
  const coordinate = parseCoordinateInput(input);
  if (!coordinate) {
    setTrueSolarTimeStatus("無法辨識座標，請貼上 Google Maps 經緯度。", "error");
    return;
  }
  trueSolarTimeLocation = coordinate;
  elements.trueSolarTimeCoordinate.value = coordinate.normalizedText;
  renderTrueSolarTimeForWatchDate(currentDateTimeValue ?? elements.datetime.value);
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
      renderTrueSolarTimeForWatchDate(currentDateTimeValue ?? elements.datetime.value);
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
  const watchDate = dateTimeValue instanceof Date ? new Date(dateTimeValue.getTime()) : parseDateTimeLocalValue(dateTimeValue);
  if (!watchDate) return;
  elements.trueSolarTimeWatchValue.textContent = formatDateTimeParts(getLocalDateParts(watchDate));
  if (!trueSolarTimeLocation) return;
  try {
    const result = calculateTrueSolarTime({ date: watchDate, latitude: trueSolarTimeLocation.latitude, longitude: trueSolarTimeLocation.longitude, utcOffsetMinutes: TAIPEI_UTC_OFFSET_MINUTES });
    elements.trueSolarTimeLocationValue.textContent = `緯度：${formatCoordinate(result.latitude, "N", "S")}；經度：${formatCoordinate(result.longitude, "E", "W")}`;
    elements.trueSolarTimeResult.replaceChildren(createTrueSolarTimeResultContent(result));
    elements.trueSolarTimeResult.hidden = false;
    setTrueSolarTimeStatus(result.crossedDateBoundary ? `真太陽時已跨至${result.dateBoundaryDirection === "previous" ? "前一日" : "次一日"}` : "", "");
  } catch {
    setTrueSolarTimeStatus("目前無法計算真太陽時，請確認查詢時間與座標。", "error");
  }
}

function createTrueSolarTimeResultContent(result) {
  const definitions = [["手錶時間", formatDateTimeParts(result.watchDateParts)], ["平太陽時", formatDateTimeParts(result.meanSolarParts)], ["真太陽時", formatDateTimeParts(result.trueSolarParts)], ["經度修正", formatSignedSeconds(result.longitudeCorrectionSeconds)], ["當日均時差", formatSignedSeconds(result.equationOfTimeSeconds)], ["合計修正", formatSignedSeconds(result.totalCorrectionSeconds)]];
  const list = document.createElement("dl");
  for (const [label, value] of definitions) { const term = document.createElement("dt"); const detail = document.createElement("dd"); term.textContent = label; detail.textContent = value; list.append(term, detail); }
  return list;
}

function formatDateTimeParts(parts) { return `${parts.year}/${String(parts.month).padStart(2, "0")}/${String(parts.day).padStart(2, "0")} ${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}`; }
function formatSignedSeconds(seconds) { const rounded = Math.round(seconds); const sign = rounded >= 0 ? "+" : "-"; const absolute = Math.abs(rounded); return `${sign}${Math.floor(absolute / 60)}分${absolute % 60}秒`; }
function formatCoordinate(value, positive, negative) { return `${Math.abs(value).toFixed(6)}° ${value >= 0 ? positive : negative}`; }
function getLocalDateParts(date) { return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() }; }
function setTrueSolarTimeStatus(message, type) { elements.trueSolarTimeStatus.textContent = message; elements.trueSolarTimeStatus.className = `section-message ${type ? `section-message-${type}` : ""}`.trim(); }

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

function formatTermDateTime(term) {
  const date = new Date(term.timeMs);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}/${month}/${day} ${hour}:${minute}`;
}

function formatHouRangeDateTime(dateTimeValue) {
  const date = new Date(dateTimeValue);
  if (!Number.isFinite(date.getTime())) {
    return "—";
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
  const weekdayLine = document.createElement("span");
  weekdayLine.className = "weekday-line";
  weekdayLine.textContent = formatWeekdayLabel(dateTimeValue, dayPillar, jianchu, dailyInfo);

  const clothingBlock = createDailyClothingBlock(dailyInfo?.clothing);
  elements.weekdayLabel.replaceChildren(
    ...(clothingBlock ? [weekdayLine, clothingBlock] : [weekdayLine])
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

  const hour = date.getHours();
  if (hour === 23 || hour === 0) {
    return 1;
  }

  return Math.floor((hour + 1) / 2) + 1;
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
  if (typeof dateTimeValue !== "string" || dateTimeValue.trim() === "") {
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

  return `${year}-${month}-${day}T${hour}:${minute}`;
}
