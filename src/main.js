import { calculateBazi } from "./bazi.js";
import { formatTerm } from "./solarTerms.js";

const elements = {
  datetime: document.querySelector("#datetime"),
  calculate: document.querySelector("#calculate"),
  yearPillar: document.querySelector("#year-pillar"),
  monthPillar: document.querySelector("#month-pillar"),
  dayPillar: document.querySelector("#day-pillar"),
  hourPillar: document.querySelector("#hour-pillar"),
  currentTerm: document.querySelector("#current-term"),
  nextTerm: document.querySelector("#next-term"),
  monthBranch: document.querySelector("#month-branch"),
  ruleNotes: document.querySelector("#rule-notes"),
  message: document.querySelector("#message"),
};

elements.datetime.value = toLocalDatetimeValue(new Date());
elements.calculate.addEventListener("click", handleCalculate);

async function handleCalculate() {
  const value = elements.datetime.value;
  elements.message.textContent = "";

  if (!value) {
    elements.message.textContent = "請先輸入日期時間。";
    return;
  }

  elements.calculate.disabled = true;

  try {
    const result = await calculateBazi(value);
    renderResult(result);
  } catch (error) {
    clearResult();
    elements.message.textContent = error instanceof Error ? error.message : String(error);
  } finally {
    elements.calculate.disabled = false;
  }
}

function renderResult(result) {
  elements.yearPillar.textContent = result.yearPillar;
  elements.monthPillar.textContent = result.monthPillar;
  elements.dayPillar.textContent = result.dayPillar;
  elements.hourPillar.textContent = result.hourPillar;
  elements.currentTerm.textContent = formatTerm(result.currentTerm);
  elements.nextTerm.textContent = formatTerm(result.nextTerm);
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

function toLocalDatetimeValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
}
