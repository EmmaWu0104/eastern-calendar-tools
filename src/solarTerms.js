export const SOLAR_TERMS_URL = new URL("../data/solar_terms_1899_2101.json", import.meta.url);

export const MONTH_BRANCH_BY_TERM = Object.freeze({
  "立春": "寅",
  "驚蟄": "卯",
  "清明": "辰",
  "立夏": "巳",
  "芒種": "午",
  "小暑": "未",
  "立秋": "申",
  "白露": "酉",
  "寒露": "戌",
  "立冬": "亥",
  "大雪": "子",
  "小寒": "丑",
});

const SWITCH_TERM_NAMES = new Set(Object.keys(MONTH_BRANCH_BY_TERM));

let cachedSolarTerms = null;

export async function loadSolarTerms(url = SOLAR_TERMS_URL) {
  if (cachedSolarTerms && url === SOLAR_TERMS_URL) {
    return cachedSolarTerms;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`節氣資料載入失敗：${response.status} ${response.statusText}`);
  }

  const rawTerms = await response.json();
  const terms = normalizeSolarTerms(rawTerms);

  if (url === SOLAR_TERMS_URL) {
    cachedSolarTerms = terms;
  }

  return terms;
}

export function normalizeSolarTerms(rawTerms) {
  if (!Array.isArray(rawTerms)) {
    throw new TypeError("節氣資料格式錯誤：預期為陣列");
  }

  return rawTerms
    .map((term) => {
      const timeMs = Date.parse(term.asia_taipei);
      if (!Number.isFinite(timeMs)) {
        throw new Error(`節氣時間格式錯誤：${term.name ?? "未知節氣"}`);
      }

      return {
        ...term,
        timeMs,
      };
    })
    .sort((a, b) => a.timeMs - b.timeMs);
}

export function parseLocalDateTime(dateTimeString) {
  if (typeof dateTimeString !== "string" || dateTimeString.trim() === "") {
    throw new TypeError("請輸入本地日期時間字串");
  }

  const normalized = dateTimeString.trim();
  const match = normalized.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/
  );

  if (!match) {
    throw new Error("日期時間格式需為 YYYY-MM-DDTHH:mm 或 YYYY-MM-DDTHH:mm:ss");
  }

  const [, year, month, day, hour, minute, second = "0", millisecond = "0"] = match;
  const components = {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
    millisecond: Number(millisecond.padEnd(3, "0")),
  };

  validateLocalComponents(components);
  const localDate = new Date(
    components.year,
    components.month - 1,
    components.day,
    components.hour,
    components.minute,
    components.second,
    components.millisecond
  );

  return {
    ...components,
    timeMs: localDate.getTime(),
    input: normalized,
  };
}

export function findSolarTermContext(dateTimeString, solarTerms) {
  const dateTime = parseLocalDateTime(dateTimeString);
  const terms = normalizeIfNeeded(solarTerms);
  const currentIndex = findLastTermIndexAtOrBefore(terms, dateTime.timeMs);

  if (currentIndex < 0) {
    throw new RangeError("輸入時間早於節氣資料範圍");
  }

  return {
    dateTime,
    previousTerm: currentIndex > 0 ? terms[currentIndex - 1] : null,
    currentTerm: terms[currentIndex],
    nextTerm: currentIndex + 1 < terms.length ? terms[currentIndex + 1] : null,
  };
}

export function getMonthBranch(dateTimeString, solarTerms) {
  const dateTime = parseLocalDateTime(dateTimeString);
  const switchTerms = normalizeIfNeeded(solarTerms).filter((term) =>
    SWITCH_TERM_NAMES.has(term.name)
  );
  const currentIndex = findLastTermIndexAtOrBefore(switchTerms, dateTime.timeMs);

  if (currentIndex < 0) {
    throw new RangeError("輸入時間早於可判斷月令的節氣資料範圍");
  }

  const monthTerm = switchTerms[currentIndex];

  return {
    branch: MONTH_BRANCH_BY_TERM[monthTerm.name],
    term: monthTerm,
  };
}

export function findTermByNameAndYear(solarTerms, name, termYear) {
  return normalizeIfNeeded(solarTerms).find(
    (term) => term.name === name && term.year_taipei === termYear
  );
}

export function formatTerm(term) {
  if (!term) {
    return "--";
  }

  return `${term.name}（${term.asia_taipei}）`;
}

function normalizeIfNeeded(solarTerms) {
  if (!Array.isArray(solarTerms)) {
    throw new TypeError("呼叫前需提供已載入的節氣資料");
  }

  if (solarTerms.length === 0 || "timeMs" in solarTerms[0]) {
    return solarTerms;
  }

  return normalizeSolarTerms(solarTerms);
}

function findLastTermIndexAtOrBefore(terms, timeMs) {
  let low = 0;
  let high = terms.length - 1;
  let result = -1;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);

    if (terms[middle].timeMs <= timeMs) {
      result = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return result;
}

function validateLocalComponents(components) {
  const { year, month, day, hour, minute, second, millisecond } = components;

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59 ||
    millisecond < 0 ||
    millisecond > 999
  ) {
    throw new RangeError("日期時間數值超出可接受範圍");
  }

  const roundTrip = new Date(year, month - 1, day, hour, minute, second, millisecond);
  if (
    roundTrip.getFullYear() !== year ||
    roundTrip.getMonth() !== month - 1 ||
    roundTrip.getDate() !== day ||
    roundTrip.getHours() !== hour ||
    roundTrip.getMinutes() !== minute ||
    roundTrip.getSeconds() !== second ||
    roundTrip.getMilliseconds() !== millisecond
  ) {
    throw new RangeError("日期時間不是有效的 Gregorian 日期");
  }
}
