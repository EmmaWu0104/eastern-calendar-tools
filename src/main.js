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

const elements = {
  datetime: getElement("#datetime"),
  calculate: getElement("#calculate"),
  useNow: getElement("#use-now"),
  weekdayLabel: getElement("#weekday-label"),
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

elements.calculate.addEventListener("click", () => {
  handleCalculate();
});
elements.useNow.addEventListener("click", () => {
  startAutoNowMode();
});
elements.datetime.addEventListener("input", pauseAutoNowMode);
elements.datetime.addEventListener("change", pauseAutoNowMode);
elements.datetime.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleCalculate();
  }
});
window.addEventListener("pagehide", stopAutoNowRefresh);
elements.jinhanDunType.addEventListener("change", () => {
  isJinhanDunTypeManuallyOverridden = true;
  void renderJinhanYujing(currentCalendarResult);
});

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
  handleCalculate();
}

async function handleCalculate() {
  if (isCalculating) {
    return;
  }

  const value = elements.datetime.value;

  if (!value) {
    clearResult();
    setMessage("請先輸入日期時間。", "error");
    return;
  }

  setMessage("計算中...", "loading");
  elements.calculate.disabled = true;
  isCalculating = true;

  try {
    const solarTerms = await loadSolarTerms();
    const result = calculateBaziFromSolarTerms(value, solarTerms);
    currentCalendarResult = result;
    currentSolarTerms = solarTerms;
    isJinhanDunTypeManuallyOverridden = false;
    renderResult(result);
    renderFlyingStars(result, value);
    await renderJinhanYujing(result);
    setMessage("", "");
  } catch (error) {
    currentCalendarResult = null;
    currentSolarTerms = null;
    clearResult();
    const message = error instanceof Error ? error.message : String(error);
    setMessage(`查詢失敗：${message}`, "error");
  } finally {
    isCalculating = false;
    elements.calculate.disabled = false;
  }
}

function renderResult(result) {
  const dailyDaHuangDao = getDailyDaHuangDao(result.monthBranch, result.dayPillar?.[1]);
  renderPillar(elements.yearPillar, result.yearPillar, undefined, undefined, true);
  renderPillar(elements.monthPillar, result.monthPillar, undefined, undefined, true);
  renderPillar(elements.dayPillar, result.dayPillar, result.jianchu, result.dailyInfo, false, dailyDaHuangDao);
  renderPillar(elements.hourPillar, result.hourPillar, undefined, undefined, true);
  updateWeekdayLabel(elements.datetime.value, result.dailyInfo);
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
  clearDongGongDaySelection();
  clearFlyingStars();
  clearJinhanYujing();
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

function createDailyDaHuangDaoPart(dailyDaHuangDao) {
  const className = dailyDaHuangDao.type === "黃道"
    ? "pillar-extra pillar-extra-line daily-da-huang-dao daily-da-huang-dao-good"
    : "pillar-extra pillar-extra-line daily-da-huang-dao daily-da-huang-dao-bad";
  return createPillarPart(
    `${dailyDaHuangDao.deity}${dailyDaHuangDao.type}・${dailyDaHuangDao.fortune}`,
    className
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

async function renderJinhanYujing(calendarResult) {
  const dayPillar = calendarResult?.dayPillar;
  if (typeof dayPillar !== "string" || dayPillar.length < 2) {
    clearJinhanYujing("尚無日柱資料，無法顯示金函玉鏡日盤");
    return;
  }

  try {
    const dunTypeStatus = getJinhanDunType(elements.datetime.value, calendarResult, currentSolarTerms);
    const selectedDunType = resolveJinhanSelectedDunType(dunTypeStatus);
    const pan = getJinhanYujingDayPan(dayPillar, selectedDunType.dunType);

    if (!pan) {
      clearJinhanYujing("查無金函玉鏡日盤資料");
      return;
    }

    const deitiesByPalace = getJinhanDeitiesByPalace(pan.meta);
    const blackYellowHours = getJinhanBlackYellowHours(dayPillar);
    const currentHourInfo = getCurrentChineseHourInfo(elements.datetime.value);
    const currentHourIndex = currentHourInfo?.index ?? null;
    const guiDeng = await getGuiDengForCalendarResult(calendarResult, elements.datetime.value);
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
