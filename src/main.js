import { calculateBazi } from "./bazi.js";
import { getDailyGodsByStem } from "./dailyGods.js";
import { calculateAllFlyingStarCharts } from "./flyingStars.js";

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

const elements = {
  datetime: getElement("#datetime"),
  calculate: getElement("#calculate"),
  yearPillar: getElement("#year-pillar"),
  monthPillar: getElement("#month-pillar"),
  dayPillar: getElement("#day-pillar"),
  hourPillar: getElement("#hour-pillar"),
  dailyGodsGrid: getElement("#daily-gods-grid"),
  currentTerm: getElement("#current-term"),
  nextTerm: getElement("#next-term"),
  monthBranch: getElement("#month-branch"),
  flyingStars: getElement("#flying-stars"),
  flyingStarsMessage: getElement("#flying-stars-message"),
  ruleNotes: getElement("#rule-notes"),
  message: getElement("#message"),
};

elements.datetime.value = toLocalDatetimeValue(new Date());
elements.calculate.addEventListener("click", handleCalculate);
elements.datetime.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleCalculate();
  }
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
    const result = await calculateBazi(value);
    renderResult(result);
    renderFlyingStars(result, value);
    setMessage("", "");
  } catch (error) {
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
  elements.ruleNotes.replaceChildren(
    ...result.ruleNotes.map((note) => {
      const item = document.createElement("li");
      item.textContent = note;
      return item;
    })
  );
}

function clearResult() {
  for (const element of [
    elements.yearPillar,
    elements.monthPillar,
    elements.dayPillar,
    elements.hourPillar,
    elements.currentTerm,
    elements.nextTerm,
    elements.monthBranch,
  ]) {
    element.textContent = "--";
  }
  renderDailyGods("");
  clearFlyingStars();
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

function renderPillar(element, pillar) {
  if (typeof pillar !== "string" || pillar.length < 2) {
    element.textContent = "--";
    return;
  }

  element.replaceChildren(
    createPillarPart(pillar[0], "pillar-stem"),
    createPillarPart(pillar[1], "pillar-branch")
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

function getElement(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`找不到必要的 DOM 元素：${selector}`);
  }

  return element;
}

function toLocalDatetimeValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
}
