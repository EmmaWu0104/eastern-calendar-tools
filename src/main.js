import { calculateBazi } from "./bazi.js";

const elements = {
  datetime: getElement("#datetime"),
  calculate: getElement("#calculate"),
  yearPillar: getElement("#year-pillar"),
  monthPillar: getElement("#month-pillar"),
  dayPillar: getElement("#day-pillar"),
  hourPillar: getElement("#hour-pillar"),
  currentTerm: getElement("#current-term"),
  nextTerm: getElement("#next-term"),
  monthBranch: getElement("#month-branch"),
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
  elements.yearPillar.textContent = result.yearPillar;
  elements.monthPillar.textContent = result.monthPillar;
  elements.dayPillar.textContent = result.dayPillar;
  elements.hourPillar.textContent = result.hourPillar;
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
