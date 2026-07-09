import {
  getAnnualAfflictionBadgesByPalace,
  getAnnualAfflictionsByYearBranch,
} from "./annualAfflictions.js";
import { calculateBaziFromSolarTerms } from "./bazi.js";
import { getDailyGodsByStem } from "./dailyGods.js";
import {
  getClashingZodiacByBranch,
  getDailyDaHuangDao,
} from "./dailyInfo.js";
import { getDongGongDaySelection } from "./dongGongDaySelection.js";
import { calculateAllFlyingStarCharts } from "./flyingStars.js";
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
import { getQimenPlate } from "./qimenPlateLookup.js";
import {
  decorateQimenPlateMarkers,
  findQimenDisplayZhiFuPalaceKey,
} from "./qimenPlateMarkers.js";
import { resolveQimenJuFromFullTermCycleDraft } from "./qimenResolver.js";
import { loadSolarTerms } from "./solarTerms.js";

const AUTO_NOW_REFRESH_MS = 30_000;

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
  "天禽寄宮未推導，第一版以 center 標記值符",
]);

const JINHAN_DEITY_CLASS_NAMES = Object.freeze({
  xishen: "jinhan-deity-xishen",
  caishen: "jinhan-deity-caishen",
  yinGuishen: "jinhan-deity-yin-guishen",
  yangGuishen: "jinhan-deity-yang-guishen",
});

const WEEKDAY_LABELS = Object.freeze(["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]);
const CHINESE_HOUR_LABELS = Object.freeze([
  Object.freeze({ index: 1, branch: "子", timeRange: "23 ~ 01" }),
  Object.freeze({ index: 2, branch: "丑", timeRange: "01 ~ 03" }),
  Object.freeze({ index: 3, branch: "寅", timeRange: "03 ~ 05" }),
  Object.freeze({ index: 4, branch: "卯", timeRange: "05 ~ 07" }),
  Object.freeze({ index: 5, branch: "辰", timeRange: "07 ~ 09" }),
  Object.freeze({ index: 6, branch: "巳", timeRange: "09 ~ 11" }),
  Object.freeze({ index: 7, branch: "午", timeRange: "11 ~ 13" }),
  Object.freeze({ index: 8, branch: "未", timeRange: "13 ~ 15" }),
  Object.freeze({ index: 9, branch: "申", timeRange: "15 ~ 17" }),
  Object.freeze({ index: 10, branch: "酉", timeRange: "17 ~ 19" }),
  Object.freeze({ index: 11, branch: "戌", timeRange: "19 ~ 21" }),
  Object.freeze({ index: 12, branch: "亥", timeRange: "21 ~ 23" }),
]);

const BRANCH_MONTH_LABELS = Object.freeze({
  寅: "正月",
  卯: "二月",
  辰: "三月",
  巳: "四月",
  午: "五月",
  未: "六月",
  申: "七月",
  酉: "八月",
  戌: "九月",
  亥: "十月",
  子: "十一月",
  丑: "十二月",
});

const CHINESE_NUMBER_LABELS = Object.freeze(["", "一", "二", "三", "四", "五", "六", "七", "八", "九"]);
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
  datetime: getElement("#datetime"),
  useNow: getElement("#use-now"),
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
let isCalculating = false;
let pendingDateTimeValue = null;
let currentDateTimeValue = null;
let qimenManualOverride = {
  enabled: false,
  dunType: "",
  ju: null,
};
const pillarExtraPanel = createPillarExtraPanel();
const qimenElements = createQimenSection();

elements.pillars.append(pillarExtraPanel);
insertQimenSection(qimenElements.section);

elements.useNow.addEventListener("click", () => {
  startAutoNowMode();
});
elements.datetime.addEventListener("input", handleManualDateTimeInput);
elements.datetime.addEventListener("change", handleManualDateTimeChange);
elements.datetime.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleManualDateTimeChange();
  }
});
window.addEventListener("pagehide", stopAutoNowRefresh);
elements.jinhanDunType.addEventListener("change", () => {
  isJinhanDunTypeManuallyOverridden = true;
  void renderJinhanYujing(currentCalendarResult, currentDateTimeValue ?? elements.datetime.value);
});
qimenElements.manualToggle.addEventListener("change", handleQimenManualToggleChange);
qimenElements.manualDunSelect.addEventListener("change", handleQimenManualDunChange);
qimenElements.manualJuSelect.addEventListener("change", handleQimenManualJuChange);
qimenElements.manualRestore.addEventListener("click", restoreQimenAutoPlateLookup);

startAutoNowMode();

function startAutoNowMode() {
  isAutoNowMode = true;
  stopAutoNowRefresh();
  refreshFromCurrentTime();
  autoNowTimerId = window.setInterval(refreshFromCurrentTime, AUTO_NOW_REFRESH_MS);
}

function pauseAutoNowMode() {
  if (!isAutoNowMode) {
    return;
  }

  isAutoNowMode = false;
  stopAutoNowRefresh();
}

function stopAutoNowRefresh() {
  if (autoNowTimerId !== null) {
    window.clearInterval(autoNowTimerId);
    autoNowTimerId = null;
  }
}

function refreshFromCurrentTime() {
  if (!isAutoNowMode) {
    return;
  }

  elements.datetime.value = toLocalDatetimeValue(new Date());
  requestRenderDateTime(elements.datetime.value);
}

function handleManualDateTimeInput() {
  pauseAutoNowMode();

  if (!readDateTimeInput()) {
    return;
  }

  requestRenderDateTime(elements.datetime.value);
}

function handleManualDateTimeChange() {
  pauseAutoNowMode();

  if (!readDateTimeInput()) {
    return;
  }

  requestRenderDateTime(elements.datetime.value);
}

function readDateTimeInput() {
  return parseDateTimeLocalValue(elements.datetime.value);
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
    renderFlyingStars(result, dateTimeValue);
    await renderJinhanYujing(result, dateTimeValue);
    renderQimenSection(dateTimeValue);
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
  renderPillarExtraPanel(result.jianchu, dailyDaHuangDao, result.dailyInfo);
  updateWeekdayLabel(dateTimeValue, result.dailyInfo);
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
  clearDongGongDaySelection();
  clearFlyingStars();
  clearJinhanYujing();
  clearQimenSection();
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

function createPillarPart(text, className) {
  const part = document.createElement("span");
  part.className = className;
  part.textContent = text;
  return part;
}

function createDailyInfoPillarParts(dailyInfo) {
  const lines = [];

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
    lines.push(createPillarPart(`💀 ${dailyInfo.seasonalMarker.label}`, "pillar-extra daily-info-line"));
  }

  return lines;
}

function createDailyInfoPanelLines(dailyInfo) {
  const lines = [];

  if (dailyInfo?.suiPo?.isSuiPo) {
    lines.push(createPillarExtraPanelLine(`☠️ ${dailyInfo.suiPo.label}`, "daily-info-line"));
  }

  if (dailyInfo?.tianShe?.isTianShe) {
    lines.push(createPillarExtraPanelLine(`😇 ${dailyInfo.tianShe.label}`, "daily-info-line"));
  }

  if (dailyInfo?.sanfu) {
    lines.push(createPillarExtraPanelLine(`♨ ${dailyInfo.sanfu.label}`, "daily-info-line"));
  }

  if (dailyInfo?.seasonalMarker) {
    lines.push(createPillarExtraPanelLine(`☠️ ${dailyInfo.seasonalMarker.label}`, "daily-info-line"));
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
    const yearBranch = typeof calendarResult?.yearPillar === "string" ? calendarResult.yearPillar[1] : "";
    elements.flyingStarsMessage.textContent = "";
    elements.flyingStars.replaceChildren(
      createFlyingStarComboChart(charts.period, charts.annual, charts.monthly, yearBranch),
      createFlyingStarChart("日盤", charts.daily),
      createFlyingStarChart("時盤", charts.hourly)
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
  section.className = "panel qimen-section";
  section.setAttribute("aria-labelledby", "qimen-title");

  const heading = document.createElement("div");
  heading.className = "qimen-heading";

  const title = document.createElement("h2");
  title.id = "qimen-title";
  title.textContent = "奇門遁甲";

  const subtitle = document.createElement("p");
  subtitle.className = "qimen-subtitle";
  subtitle.textContent = "傳統置閏法定局";

  heading.append(title, subtitle);

  const body = document.createElement("div");
  body.className = "qimen-body";

  const summaryPanel = document.createElement("div");
  summaryPanel.className = "qimen-summary-panel";

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
  platePanel.append(manualControls, plateSection, fallback);
  body.append(summaryPanel, platePanel);
  section.append(heading, body);

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
  const jinhanSection = getElement(".jinhan-section");
  jinhanSection.after(section);
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
        renderQimenPlateResult(plate, effective);
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

function renderQimenPlateResult(plateResult, effective) {
  const markers = decorateQimenPlateMarkers(plateResult.plate);
  const displayZhiFuPalaceKey = findQimenDisplayZhiFuPalaceKey(plateResult.plate);
  qimenElements.plateSection.replaceChildren(
    renderQimenPlateSummary(plateResult, effective),
    renderQimenPlateGrid(plateResult.plate, markers, displayZhiFuPalaceKey)
  );
}

function renderQimenPlateSummary(plateResult, effective) {
  const summary = document.createElement("div");
  summary.className = "qimen-plate-summary";

  const items = [
    ["遁別", effective.dunName || plateResult.meta?.dunName],
    ["局數", formatQimenJuLabel(effective.ju || plateResult.meta?.ju)],
    ["時柱", plateResult.plate?.hourPillar],
    ["直符", plateResult.plate?.zhiFuStar],
    ["直使", plateResult.plate?.zhiShiDoor],
  ];

  for (const [label, value] of items) {
    const item = document.createElement("div");
    item.className = "qimen-plate-summary-item";

    const labelElement = document.createElement("span");
    labelElement.className = "qimen-plate-summary-label";
    labelElement.textContent = `${label}：`;

    const valueElement = document.createElement("span");
    valueElement.className = "qimen-plate-summary-value";
    valueElement.textContent = formatNullableQimenValue(value);

    item.append(labelElement, valueElement);
    summary.append(item);
  }

  return summary;
}

function renderQimenPlateGrid(plate, markers, displayZhiFuPalaceKey) {
  const grid = document.createElement("div");
  grid.className = "qimen-plate-grid";
  grid.setAttribute("aria-label", "奇門盤面九宮");

  for (const palaceMeta of getQimenPlateDisplayOrder()) {
    grid.append(createQimenPalaceCell(
      plate?.palaces?.[palaceMeta.key],
      palaceMeta,
      markers?.palaces?.[palaceMeta.key],
      displayZhiFuPalaceKey
    ));
  }

  return grid;
}

function createQimenPalaceCell(palace, palaceMeta, palaceMarkers = {}, displayZhiFuPalaceKey = null) {
  const isDisplayZhiFuPalace = palaceMeta.key === displayZhiFuPalaceKey;
  const isZhiShiPalace = palace?.isZhiShiPalace === true;
  const cell = document.createElement("div");
  cell.className = [
    "qimen-palace-cell",
    palaceMeta.key === "center" ? "qimen-palace-center" : "",
    isDisplayZhiFuPalace || isZhiShiPalace ? "qimen-palace-zhi-marker" : "",
    isDisplayZhiFuPalace ? "qimen-palace-zhi-fu" : "",
    isZhiShiPalace ? "qimen-palace-zhi-shi" : "",
  ].filter(Boolean).join(" ");

  const header = document.createElement("div");
  header.className = "qimen-palace-header";
  header.textContent = formatQimenPalaceHeader(palace, palaceMeta);

  if (!palace) {
    const lines = document.createElement("div");
    lines.className = "qimen-palace-lines";
    lines.textContent = "資料缺漏";
    cell.append(header, lines);
    return cell;
  }

  const content = createQimenPalaceContent(palace, palaceMarkers, isDisplayZhiFuPalace);

  const note = createQimenPalaceNote(palace);

  cell.append(header, content);
  if (note) {
    cell.append(note);
  }

  return cell;
}

function createQimenPalaceContent(palace, palaceMarkers = {}, isDisplayZhiFuPalace = false) {
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

  const star = document.createElement("div");
  star.className = "qimen-palace-star";
  star.textContent = formatNullableQimenValue(palace.star);

  left.append(deity, star);

  const center = document.createElement("div");
  center.className = "qimen-palace-center-main";

  const door = document.createElement("div");
  door.className = [
    "qimen-palace-door",
    palace.isZhiShiPalace === true ? "qimen-palace-door-zhi-shi" : "",
  ].filter(Boolean).join(" ");
  door.append(document.createTextNode(formatNullableQimenValue(palace.door)));
  if (palaceMarkers.doorPo) {
    door.append(createQimenInlineMarker(palaceMarkers.doorPo, "qimen-door-po-marker"));
  }

  center.append(door);

  const right = document.createElement("div");
  right.className = "qimen-palace-right";

  const heavenStem = document.createElement("div");
  heavenStem.className = "qimen-stem-wrap qimen-palace-heaven-stem";
  heavenStem.append(document.createTextNode(formatNullableQimenValue(palace.heavenStem)));
  if (palaceMarkers.heavenStemMarker) {
    heavenStem.append(createQimenInlineMarker(palaceMarkers.heavenStemMarker, "qimen-heaven-stem-marker"));
  }
  if (palaceMarkers.centerHeavenStem) {
    heavenStem.append(createQimenInlineMarker(palaceMarkers.centerHeavenStem, "qimen-center-stem-marker qimen-center-heaven-stem-marker"));
  }

  const earthStem = document.createElement("div");
  earthStem.className = "qimen-stem-wrap qimen-palace-earth-stem";
  earthStem.append(document.createTextNode(formatNullableQimenValue(palace.earthStem)));
  if (palaceMarkers.centerEarthStem) {
    earthStem.append(createQimenInlineMarker(palaceMarkers.centerEarthStem, "qimen-center-stem-marker qimen-center-earth-stem-marker"));
  }

  right.append(heavenStem, earthStem);
  content.append(left, center, right);
  return content;
}

function createQimenInlineMarker(text, className) {
  const marker = document.createElement("span");
  marker.className = className;
  marker.textContent = text;
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

function formatQimenPalaceHeader(palace, palaceMeta) {
  const name = formatNullableQimenValue(palace?.palaceName || palaceMeta.name);
  const direction = formatNullableQimenValue(palace?.direction || palaceMeta.direction);
  const number = formatNullableQimenValue(palace?.luoshuNumber || palaceMeta.number);
  return `${name}｜${direction}｜${number}`;
}

function formatNullableQimenValue(value) {
  return value === null || value === undefined || value === "" ? "—" : String(value);
}

function getQimenPlateDisplayOrder() {
  return QIMEN_PALACE_DISPLAY_LAYOUT.flat();
}

function createQimenSummaryRows(qimen) {
  const rows = [];

  if (qimen.actualSolarTerm && qimen.actualSolarTerm !== qimen.qimenSolarTerm) {
    rows.push(createQimenSummaryRow("實際節氣", qimen.actualSolarTerm));
  }

  rows.push(
    createQimenSummaryRow("奇門節氣", formatQimenSolarTermLabel(qimen)),
    createQimenSummaryRow("元別", qimen.yuan),
    createQimenSummaryRow("遁別", qimen.dunName),
    createQimenSummaryRow("局數", formatQimenJuLabel(qimen.ju)),
    createQimenSummaryRow("時柱", qimen.hourPillar),
    createQimenSummaryRow("狀態", qimen.status)
  );

  const notes = formatQimenNotes(qimen.notes);
  if (notes) {
    rows.push(createQimenSummaryRow("備註", notes, "qimen-note"));
  }

  return rows;
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
  return Array.isArray(notes) && notes.length > 0 ? notes.join("；") : "";
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

function createFlyingStarChart(title, chart) {
  const article = document.createElement("article");
  article.className = "flying-star-card";

  const heading = document.createElement("h3");
  heading.textContent = title;

  const summary = document.createElement("div");
  summary.className = "flying-star-summary";
  summary.append(
    createMetaLine("中宮", `${chart.palaces.center.starDisplayName}入中`),
    createMetaLine("飛法", formatDirection(chart.direction)),
    createBasisBlock(formatFlyingStarBasis(chart))
  );

  const grid = document.createElement("div");
  grid.className = "nine-palace-grid";

  for (const row of chart.layout) {
    for (const palace of row) {
      grid.append(createPalaceCell(palace));
    }
  }

  article.append(heading, summary, grid);
  return article;
}

function createFlyingStarComboChart(periodChart, annualChart, monthlyChart, yearBranch) {
  const article = document.createElement("article");
  article.className = "flying-star-card flying-star-combo-card";

  const heading = document.createElement("h3");
  heading.textContent = "綜合盤（運盤 / 年盤 / 月盤）";

  const summary = document.createElement("div");
  summary.className = "flying-stars-combo-summary";
  summary.append(
    createFlyingStarComboSummaryCell("運盤", formatPeriodSummary(periodChart), periodChart),
    createFlyingStarComboSummaryCell("年盤", formatAnnualSummary(periodChart, annualChart), annualChart),
    createFlyingStarComboSummaryCell("月盤", formatMonthlySummary(monthlyChart), monthlyChart)
  );

  const grid = document.createElement("div");
  grid.className = "nine-palace-grid flying-stars-combo-grid";
  const annualAfflictions = getAnnualAfflictionsByYearBranch(yearBranch);
  const annualAfflictionBadgesByPalace = getAnnualAfflictionBadgesByPalace(yearBranch);

  for (const row of periodChart.layout) {
    for (const periodPalace of row) {
      const palaceId = periodPalace.id;
      grid.append(
        createFlyingStarComboCell(
          periodPalace,
          annualChart.palaces[palaceId],
          monthlyChart.palaces[palaceId],
          annualAfflictionBadgesByPalace[periodPalace.name] ?? []
        )
      );
    }
  }

  article.append(heading, summary, grid);
  if (annualAfflictions.summary) {
    article.append(createAnnualAfflictionSummary(annualAfflictions.summary));
  }
  return article;
}

function createFlyingStarComboSummaryCell(title, detail, chart) {
  const cell = document.createElement("div");
  cell.className = "flying-stars-combo-summary-row";

  const titleElement = document.createElement("div");
  titleElement.className = "flying-stars-combo-summary-title";
  titleElement.textContent = `${title}：${detail}`;

  const centerElement = document.createElement("div");
  centerElement.className = "flying-stars-combo-summary-center";
  centerElement.textContent = `中宮 ${chart.palaces.center.starDisplayName}`;

  cell.append(titleElement, centerElement);
  return cell;
}

function createFlyingStarComboCell(periodPalace, annualPalace, monthlyPalace, annualAfflictionBadges = []) {
  const cell = document.createElement("div");
  cell.className = periodPalace.id === "center"
    ? "palace-cell palace-center flying-stars-combo-cell"
    : "palace-cell flying-stars-combo-cell";

  cell.append(
    createComboStarLine(periodPalace.starDisplayName, "運"),
    createComboStarLine(annualPalace.starDisplayName, "年"),
    createComboStarLine(monthlyPalace.starDisplayName, "月"),
    createAnnualAfflictionBadges(annualAfflictionBadges),
    createPalaceFooter(periodPalace)
  );
  return cell;
}

function createAnnualAfflictionBadges(badges) {
  if (!Array.isArray(badges) || badges.length === 0) {
    return document.createDocumentFragment();
  }

  const container = document.createElement("div");
  container.className = "annual-affliction-badges";

  for (const badge of badges) {
    const badgeElement = document.createElement("span");
    badgeElement.className = "annual-affliction-badge";
    badgeElement.title = `${badge.name}${badge.direction}`;
    badgeElement.textContent = badge.label;
    container.append(badgeElement);
  }

  return container;
}

function createAnnualAfflictionSummary(summaryText) {
  const summary = document.createElement("div");
  summary.className = "annual-affliction-summary";
  summary.textContent = summaryText;
  return summary;
}

function createComboStarLine(starName, label) {
  const line = document.createElement("div");
  line.className = "flying-stars-combo-star";
  line.title = `${label}盤`;
  line.textContent = starName;
  return line;
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

function formatPeriodSummary(periodChart) {
  return `${getPeriodCycleName(periodChart.period)}${formatChineseNumber(periodChart.period)}運`;
}

function formatAnnualSummary(periodChart, annualChart) {
  return `${getPeriodCycleName(periodChart.period)}${annualChart.basis?.yearPillar ?? "—"}年`;
}

function formatMonthlySummary(monthlyChart) {
  const yearBranch = monthlyChart.basis?.yearBranch ?? "—";
  const monthBranch = monthlyChart.basis?.monthBranch ?? "";
  const monthLabel = BRANCH_MONTH_LABELS[monthBranch] ?? `${monthBranch || "—"}月`;
  return `${yearBranch}年${monthLabel}`;
}

function getPeriodCycleName(period) {
  if (period >= 1 && period <= 3) {
    return "上元";
  }

  if (period >= 4 && period <= 6) {
    return "中元";
  }

  if (period >= 7 && period <= 9) {
    return "下元";
  }

  return "";
}

function formatChineseNumber(value) {
  return CHINESE_NUMBER_LABELS[value] ?? String(value);
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

function createPalaceCell(palace) {
  const cell = document.createElement("div");
  cell.className = palace.id === "center" ? "palace-cell palace-center" : "palace-cell";

  const starName = document.createElement("div");
  starName.className = "palace-star-center";
  starName.textContent = palace.starDisplayName;

  const palaceLabel = document.createElement("div");
  palaceLabel.className = "palace-corner palace-corner-left";
  palaceLabel.textContent = `${palace.name}${palace.number}`;

  const directionLabel = document.createElement("div");
  directionLabel.className = "palace-corner palace-corner-right";
  directionLabel.textContent = PALACE_DIRECTION_LABELS[palace.id] ?? "";

  cell.append(starName, palaceLabel, directionLabel);
  return cell;
}

function formatDirection(direction) {
  return direction === "reverse" ? "逆飛" : "順飛";
}

function formatFlyingStarBasis(chart) {
  const basis = chart.basis ?? {};

  if (chart.type === "period") {
    return [
      { label: "西元年份", value: `${basis.year}` },
      { label: "三元九運", value: `${chart.period}運` },
    ];
  }

  if (chart.type === "annual") {
    return [
      { label: "有效年份", value: `${basis.year}` },
      { label: "年柱", value: basis.yearPillar },
    ];
  }

  if (chart.type === "monthly") {
    return [
      { label: "年支分組", value: basis.yearBranchGroup },
      { label: "月柱", value: basis.monthPillar },
      { label: "月支", value: basis.monthBranch },
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

function updateWeekdayLabel(dateTimeValue, dailyInfo = null) {
  const weekdayLine = document.createElement("span");
  weekdayLine.className = "weekday-line";
  weekdayLine.textContent = formatWeekdayLabel(dateTimeValue);

  const clothingBlock = createDailyClothingBlock(dailyInfo?.clothing);
  elements.weekdayLabel.replaceChildren(
    ...(clothingBlock ? [weekdayLine, clothingBlock] : [weekdayLine])
  );
}

function formatWeekdayLabel(dateTimeValue) {
  const date = parseDateTimeLocalValue(dateTimeValue);
  if (!date) {
    return "--";
  }

  return `查詢日：${WEEKDAY_LABELS[date.getDay()]}`;
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
