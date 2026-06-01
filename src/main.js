import { calculateBaziFromSolarTerms } from "./bazi.js";
import { getDailyGodsByStem } from "./dailyGods.js";
import { calculateAllFlyingStarCharts } from "./flyingStars.js";
import {
  getJinhanBlackYellowHours,
  getJinhanDeitiesByPalace,
  getJinhanYujingDayPan,
} from "./jinhanYujing.js";
import { getJinhanDunType } from "./jinhanDunType.js";
import { getNaYinByPillar } from "./nayin.js";
import { loadSolarTerms } from "./solarTerms.js";

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

const elements = {
  datetime: getElement("#datetime"),
  calculate: getElement("#calculate"),
  useNow: getElement("#use-now"),
  weekdayLabel: getElement("#weekday-label"),
  yearPillar: getElement("#year-pillar"),
  monthPillar: getElement("#month-pillar"),
  dayPillar: getElement("#day-pillar"),
  hourPillar: getElement("#hour-pillar"),
  dailyGodsGrid: getElement("#daily-gods-grid"),
  currentTerm: getElement("#current-term"),
  nextTerm: getElement("#next-term"),
  monthBranch: getElement("#month-branch"),
  currentHou: getElement("#current-hou"),
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

elements.datetime.value = toLocalDatetimeValue(new Date());
elements.calculate.addEventListener("click", handleCalculate);
elements.useNow.addEventListener("click", () => {
  elements.datetime.value = toLocalDatetimeValue(new Date());
  handleCalculate();
});
elements.datetime.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleCalculate();
  }
});
elements.jinhanDunType.addEventListener("change", () => {
  isJinhanDunTypeManuallyOverridden = true;
  renderJinhanYujing(currentCalendarResult);
});

handleCalculate();

async function handleCalculate() {
  const value = elements.datetime.value;

  if (!value) {
    clearResult();
    setMessage("請先輸入日期時間。", "error");
    return;
  }

  setMessage("計算中...", "loading");
  elements.calculate.disabled = true;

  try {
    const solarTerms = await loadSolarTerms();
    const result = calculateBaziFromSolarTerms(value, solarTerms);
    currentCalendarResult = result;
    currentSolarTerms = solarTerms;
    isJinhanDunTypeManuallyOverridden = false;
    updateWeekdayLabel(value);
    renderResult(result);
    renderFlyingStars(result, value);
    renderJinhanYujing(result);
    setMessage("", "");
  } catch (error) {
    currentCalendarResult = null;
    currentSolarTerms = null;
    clearResult();
    const message = error instanceof Error ? error.message : String(error);
    setMessage(`查詢失敗：${message}`, "error");
  } finally {
    elements.calculate.disabled = false;
  }
}

function renderResult(result) {
  renderPillar(elements.yearPillar, result.yearPillar);
  renderPillar(elements.monthPillar, result.monthPillar);
  renderPillar(elements.dayPillar, result.dayPillar);
  renderPillar(elements.hourPillar, result.hourPillar);
  renderDailyGods(result.dayPillar);
  renderTerm(elements.currentTerm, "目前節氣", result.currentTerm);
  renderTerm(elements.nextTerm, "下一節氣", result.nextTerm);
  elements.monthBranch.textContent = `${result.monthBranch}月`;
  renderCurrentHou(result.currentHou);
  elements.ruleNotes.replaceChildren(
    ...result.ruleNotes.map((note) => {
      const item = document.createElement("li");
      item.textContent = note;
      return item;
    })
  );
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
    elements.currentTerm,
    elements.nextTerm,
    elements.monthBranch,
    elements.currentHou,
  ]) {
    element.textContent = "--";
  }
  renderDailyGods("");
  clearFlyingStars();
  clearJinhanYujing();
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

function renderCurrentHou(currentHou) {
  if (!currentHou) {
    elements.currentHou.textContent = "—";
    return;
  }

  const houName = currentHou.shortName || currentHou.name;
  elements.currentHou.replaceChildren(
    createTermLine("七十二候", `${currentHou.term}${currentHou.phase}・${houName}`, "hou-name"),
    createTermLine(
      "候區間",
      `${formatHouRangeDateTime(currentHou.start)} ～ ${formatHouRangeDateTime(currentHou.end)}`,
      "hou-time"
    )
  );
}

function renderPillar(element, pillar) {
  if (typeof pillar !== "string" || pillar.length < 2) {
    element.textContent = "--";
    return;
  }

  element.replaceChildren(
    createPillarPart(pillar[0], "pillar-stem"),
    createPillarPart(pillar[1], "pillar-branch"),
    createPillarPart(getNaYinByPillar(pillar), "pillar-nayin")
  );
}

function createPillarPart(text, className) {
  const part = document.createElement("span");
  part.className = className;
  part.textContent = text;
  return part;
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
    elements.flyingStarsMessage.textContent = "";
    elements.flyingStars.replaceChildren(
      createFlyingStarChart("運盤", charts.period),
      createFlyingStarChart("年盤", charts.annual),
      createFlyingStarChart("月盤", charts.monthly),
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

function renderJinhanYujing(calendarResult) {
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
    elements.jinhanMessage.textContent = "";
    updateJinhanCurrentHourLabel(currentHourInfo);
    elements.jinhanSummary.replaceChildren(...createJinhanSummaryItems(dayPillar, pan));
    elements.jinhanGrid.replaceChildren(...createJinhanGridCells(pan, deitiesByPalace));
    elements.jinhanHoursBody.replaceChildren(
      ...blackYellowHours.map((hour, index) => createJinhanHourRow(hour, currentHourIndex, index + 1))
    );
  } catch (error) {
    console.error("金函玉鏡日盤顯示失敗", error);
    clearJinhanYujing("金函玉鏡日盤顯示失敗");
  }
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

function createJinhanSummaryItems(dayPillar, pan) {
  const items = [
    { label: "日柱", value: `${dayPillar}日` },
    { label: "金函玉鏡盤", value: pan.meta.label },
    { label: "中宮", value: pan.meta.center },
  ];

  return items.map((item) => {
    const line = document.createElement("div");
    line.className = "jinhan-summary-item";

    const label = document.createElement("span");
    label.className = "jinhan-summary-label";
    label.textContent = `${item.label}：`;

    const value = document.createElement("span");
    value.className = "jinhan-summary-value";
    value.textContent = item.value;

    line.append(label, value);
    return line;
  });
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
      createBlockSpan(pan.meta.center, "jinhan-star-badge")
    );
    cell.append(centerContent, palaceLabel, directionLabel);
    return cell;
  }

  const palace = pan.palaces[palaceName] ?? {};
  const star = document.createElement("div");
  star.className = "jinhan-star jinhan-star-badge";
  star.textContent = palace.star ?? "—";

  const door = document.createElement("div");
  door.className = "jinhan-door";
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

function createJinhanHourRow(hour, currentHourIndex, displayIndex) {
  const row = document.createElement("tr");
  const hourIndex = Number(hour.index);
  const isCurrent = hourIndex === currentHourIndex || displayIndex === currentHourIndex;

  if (isCurrent) {
    row.classList.add("jinhan-hour-current");
  }

  row.append(
    createJinhanTimeRangeCell(hour.timeRange, isCurrent),
    createTableCell(hour.pillar),
    createTableCell(hour.deity),
    createTableCell(hour.type === "yellow" ? "黃道" : "黑道", `jinhan-hour-type-${hour.type}`),
    createTableCell(hour.notes.length > 0 ? hour.notes.join("、") : "—")
  );
  return row;
}

function createJinhanTimeRangeCell(timeRange, isCurrent) {
  const cell = document.createElement("td");

  if (isCurrent) {
    const marker = document.createElement("span");
    marker.className = "jinhan-current-marker";
    marker.textContent = "▶";

    const badge = document.createElement("span");
    badge.className = "jinhan-current-badge";
    badge.textContent = "目前";

    cell.append(marker, badge, document.createTextNode(timeRange));
    return cell;
  }

  cell.textContent = timeRange;
  return cell;
}

function updateJinhanCurrentHourLabel(currentHourInfo) {
  elements.jinhanCurrentHourLabel.textContent = currentHourInfo
    ? `目前時辰：${currentHourInfo.branch}時（${currentHourInfo.timeRange}）`
    : "目前時辰：--";
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

function updateWeekdayLabel(dateTimeValue) {
  elements.weekdayLabel.textContent = formatWeekdayLabel(dateTimeValue);
}

function formatWeekdayLabel(dateTimeValue) {
  const date = parseDateTimeLocalValue(dateTimeValue);
  if (!date) {
    return "--";
  }

  return `查詢日：${WEEKDAY_LABELS[date.getDay()]}`;
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
