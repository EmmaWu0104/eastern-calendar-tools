import qimenYuanJuTable from "../data/qimen/qimen_yuan_ju_table.json" with { type: "json" };
import rawSolarTerms from "../data/solar_terms_1899_2101.json" with { type: "json" };
import { getDayPillar, getHourPillar } from "./ganzhi.js";
import { normalizeSolarTerms } from "./solarTerms.js";

export const QIMEN_TERM_SEQUENCE = Object.freeze([
  "冬至",
  "小寒",
  "大寒",
  "立春",
  "雨水",
  "驚蟄",
  "春分",
  "清明",
  "穀雨",
  "立夏",
  "小滿",
  "芒種",
  "夏至",
  "小暑",
  "大暑",
  "立秋",
  "處暑",
  "白露",
  "秋分",
  "寒露",
  "霜降",
  "立冬",
  "小雪",
  "大雪",
]);

const DUN_NAME_BY_TYPE = Object.freeze({
  yang: "陽遁",
  yin: "陰遁",
});
const YUAN_SEQUENCE = Object.freeze(["上元", "中元", "下元"]);
const YUAN_BRANCHES = Object.freeze({
  上元: new Set(["子", "午", "卯", "酉"]),
  中元: new Set(["寅", "申", "巳", "亥"]),
  下元: new Set(["辰", "戌", "丑", "未"]),
});
const INTERCALATION_WINDOW_TERM_NAMES = Object.freeze(["芒種", "大雪"]);
const INTERCALATION_WINDOW_TERMS = new Set(INTERCALATION_WINDOW_TERM_NAMES);
const TAIPEI_OFFSET_MS = 8 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// 初版驗證資料：先覆蓋 2027 芒種、大雪核心案例。
// 後續應改為由符頭三元推進與置閏規則產生 timeline。
const INITIAL_QIMEN_TIMELINE = Object.freeze(
  buildSeedDrivenQimenTimelineFixture2027().map(cloneTimelineEntry)
);

const solarTerms = normalizeSolarTerms(rawSolarTerms);

export function resolveQimenJu(dateTimeText) {
  const timelineEntry = findQimenTimelineEntry(dateTimeText);
  if (!timelineEntry) {
    throw new RangeError("查詢時間不在奇門 resolver 初版 timeline 覆蓋範圍內");
  }

  const actualSolarTerm = findActualSolarTerm(dateTimeText);
  const yuanJu = getQimenYuanJu(timelineEntry.qimenSolarTerm, timelineEntry.yuan);
  const localDateTimeText = toTaipeiLocalDateTimeText(dateTimeText);
  const hourPillar = getHourPillar(localDateTimeText).pillar;

  return {
    actualSolarTerm,
    qimenSolarTerm: timelineEntry.qimenSolarTerm,
    status: resolveQimenStatus(actualSolarTerm, timelineEntry),
    yuan: timelineEntry.yuan,
    dunType: yuanJu.dunType,
    dunName: yuanJu.dunName,
    ju: yuanJu.ju,
    hourPillar,
    isIntercalary: timelineEntry.isIntercalary,
    notes: timelineEntry.isIntercalary ? ["查詢時間落在初版置閏 timeline 內。"] : [],
  };
}

export function getQimenYuanJu(termName, yuan) {
  const term = qimenYuanJuTable.terms?.[termName];
  if (!term) {
    throw new RangeError(`未知奇門節氣：${termName}`);
  }

  const ju = term.ju?.[yuan];
  if (!Number.isInteger(ju)) {
    throw new RangeError(`未知奇門元別：${termName} ${yuan}`);
  }

  return {
    dunType: term.dunType,
    dunName: DUN_NAME_BY_TYPE[term.dunType] ?? "",
    ju,
  };
}

export function getQimenTimelineForRange(startDateTime, endDateTime) {
  const startMs = toTimeMs(startDateTime);
  const endMs = toTimeMs(endDateTime);

  if (startMs >= endMs) {
    throw new RangeError("timeline 查詢範圍需符合 start < end");
  }

  return INITIAL_QIMEN_TIMELINE.filter((entry) => {
    return toTimeMs(entry.start) < endMs && toTimeMs(entry.end) > startMs;
  }).map(cloneTimelineEntry);
}

export function findQimenTimelineEntry(dateTimeText) {
  const targetMs = toTimeMs(dateTimeText);
  const entry = INITIAL_QIMEN_TIMELINE.find((candidate) => {
    return toTimeMs(candidate.start) <= targetMs && targetMs < toTimeMs(candidate.end);
  });

  return entry ? cloneTimelineEntry(entry) : null;
}

export function isQimenFuTou(dayPillar) {
  if (typeof dayPillar !== "string" || dayPillar.length !== 2) {
    return false;
  }

  return dayPillar[0] === "甲" || dayPillar[0] === "己";
}

export function getQimenYuanByFuTou(dayPillar) {
  if (!isQimenFuTou(dayPillar)) {
    return null;
  }

  const branch = dayPillar[1];
  for (const [yuan, branches] of Object.entries(YUAN_BRANCHES)) {
    if (branches.has(branch)) {
      return yuan;
    }
  }

  return null;
}

export function getDayPillarForEffectiveDay(effectiveDayStartText) {
  return getDayPillar(toTaipeiLocalDateTimeText(effectiveDayStartText)).pillar;
}

export function scanQimenFuTouDays(startEffectiveDayText, endEffectiveDayText) {
  const startMs = toTimeMs(startEffectiveDayText);
  const endMs = toTimeMs(endEffectiveDayText);

  if (startMs >= endMs) {
    throw new RangeError("符頭掃描範圍需符合 start < end");
  }

  const result = [];
  let current = formatTaipeiDateTime(startMs);

  while (toTimeMs(current) < endMs) {
    const dayPillar = getDayPillarForEffectiveDay(current);
    if (isQimenFuTou(dayPillar)) {
      result.push({
        effectiveDayStart: current,
        dayPillar,
        yuan: getQimenYuanByFuTou(dayPillar),
      });
    }

    current = addQimenEffectiveDays(current, 1);
  }

  return result;
}

export function getQimenEffectiveDayStart(dateTimeText) {
  const targetMs = toTimeMs(dateTimeText);
  const taipeiDate = new Date(targetMs + TAIPEI_OFFSET_MS);
  const year = taipeiDate.getUTCFullYear();
  const month = taipeiDate.getUTCMonth();
  const day = taipeiDate.getUTCDate();
  const hour = taipeiDate.getUTCHours();
  const minute = taipeiDate.getUTCMinutes();
  const second = taipeiDate.getUTCSeconds();
  const isSameDayStart = hour > 23 || (hour === 23 && (minute > 0 || second >= 0));
  const startCivilMs = Date.UTC(year, month, day, 23, 0, 0) - TAIPEI_OFFSET_MS;
  const effectiveStartMs = isSameDayStart ? startCivilMs : startCivilMs - DAY_MS;

  return formatTaipeiDateTime(effectiveStartMs);
}

export function addQimenEffectiveDays(effectiveDayStartText, days) {
  if (!Number.isInteger(days)) {
    throw new RangeError("有效日加減天數需為整數");
  }

  return formatTaipeiDateTime(toTimeMs(effectiveDayStartText) + days * DAY_MS);
}

export function buildQimenYuanRange({ qimenSolarTerm, yuan, start, isIntercalary = false }) {
  return {
    qimenSolarTerm,
    yuan,
    start,
    end: addQimenEffectiveDays(start, 5),
    isIntercalary,
  };
}

export function buildQimenTermRanges({ qimenSolarTerm, start, isIntercalary = false }) {
  return YUAN_SEQUENCE.map((yuan, index) => {
    return buildQimenYuanRange({
      qimenSolarTerm,
      yuan,
      start: addQimenEffectiveDays(start, index * 5),
      isIntercalary,
    });
  });
}

export function buildQimenTimelineFromFuTouDays({ fuTouDays, termAssignments }) {
  if (!Array.isArray(fuTouDays)) {
    throw new TypeError("fuTouDays 需為陣列");
  }

  if (!termAssignments || typeof termAssignments !== "object" || Array.isArray(termAssignments)) {
    throw new RangeError("termAssignments 需為物件");
  }

  return fuTouDays.map((fuTouDay) => {
    const assignment = termAssignments[fuTouDay.effectiveDayStart];
    if (!assignment?.qimenSolarTerm || typeof assignment.isIntercalary !== "boolean") {
      throw new RangeError(`缺少奇門節氣指定：${fuTouDay.effectiveDayStart}`);
    }

    return {
      qimenSolarTerm: assignment.qimenSolarTerm,
      yuan: fuTouDay.yuan,
      start: fuTouDay.effectiveDayStart,
      end: addQimenEffectiveDays(fuTouDay.effectiveDayStart, 5),
      isIntercalary: assignment.isIntercalary,
      sourceDayPillar: fuTouDay.dayPillar,
    };
  });
}

export function buildQimenTermAssignmentsFromSeeds({ fuTouDays, seeds }) {
  if (!Array.isArray(fuTouDays)) {
    throw new TypeError("fuTouDays 需為陣列");
  }

  if (!Array.isArray(seeds)) {
    throw new TypeError("seeds 需為陣列");
  }

  const fuTouDayByStart = Object.fromEntries(
    fuTouDays.map((fuTouDay) => [fuTouDay.effectiveDayStart, fuTouDay])
  );
  const seedByStart = {};

  for (const seed of seeds) {
    const fuTouDay = fuTouDayByStart[seed.effectiveDayStart];
    if (!fuTouDay) {
      throw new RangeError(`seed 不在符頭序列中：${seed.effectiveDayStart}`);
    }

    if (fuTouDay.yuan !== "上元") {
      throw new RangeError(`seed 必須指定在上元符頭：${seed.effectiveDayStart}`);
    }

    if (!seed.qimenSolarTerm) {
      throw new RangeError(`seed 缺少奇門節氣：${seed.effectiveDayStart}`);
    }

    seedByStart[seed.effectiveDayStart] = {
      qimenSolarTerm: seed.qimenSolarTerm,
      isIntercalary: seed.isIntercalary ?? false,
    };
  }

  const assignments = {};
  let activeAssignment = null;

  for (const fuTouDay of fuTouDays) {
    const seed = seedByStart[fuTouDay.effectiveDayStart];
    if (seed) {
      activeAssignment = seed;
    } else if (fuTouDay.yuan === "上元") {
      activeAssignment = null;
    }

    if (!activeAssignment) {
      continue;
    }

    assignments[fuTouDay.effectiveDayStart] = { ...activeAssignment };
  }

  return assignments;
}

export function buildQimenTimelineFromFuTouSeeds({
  startEffectiveDay,
  endEffectiveDay,
  seeds,
  includeUnassigned = false,
}) {
  if (includeUnassigned) {
    throw new RangeError("includeUnassigned 尚未支援");
  }

  const fuTouDays = scanQimenFuTouDays(startEffectiveDay, endEffectiveDay);
  const termAssignments = buildQimenTermAssignmentsFromSeeds({ fuTouDays, seeds });
  const assignedFuTouDays = trimIncompleteFinalSeedTerm(fuTouDays.filter((fuTouDay) => {
    return termAssignments[fuTouDay.effectiveDayStart];
  }));

  return buildQimenTimelineFromFuTouDays({
    fuTouDays: assignedFuTouDays,
    termAssignments,
  });
}

export function buildSeedDrivenQimenTimelineFixture2027() {
  return [
    ...buildQimenTimelineFromFuTouSeeds({
      startEffectiveDay: "2027-05-20T23:00:00+08:00",
      endEffectiveDay: "2027-06-25T23:00:00+08:00",
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
    }),
    ...buildQimenTimelineFromFuTouSeeds({
      startEffectiveDay: "2027-11-20T23:00:00+08:00",
      endEffectiveDay: "2027-12-12T23:00:00+08:00",
      seeds: [
        {
          effectiveDayStart: "2027-11-25T23:00:00+08:00",
          qimenSolarTerm: "大雪",
          isIntercalary: false,
        },
      ],
    }),
    ...buildQimenTimelineFromFuTouSeeds({
      startEffectiveDay: "2027-12-10T23:00:00+08:00",
      endEffectiveDay: "2027-12-26T23:00:00+08:00",
      seeds: [
        {
          effectiveDayStart: "2027-12-10T23:00:00+08:00",
          qimenSolarTerm: "大雪",
          isIntercalary: true,
        },
      ],
    }),
    ...buildQimenTimelineFromFuTouSeeds({
      startEffectiveDay: "2027-12-25T23:00:00+08:00",
      endEffectiveDay: "2028-01-10T23:00:00+08:00",
      seeds: [
        {
          effectiveDayStart: "2027-12-25T23:00:00+08:00",
          qimenSolarTerm: "冬至",
          isIntercalary: false,
        },
      ],
    }),
  ].sort((a, b) => toTimeMs(a.start) - toTimeMs(b.start));
}

export function analyzeQimenIntercalationCandidate({
  qimenSolarTerm,
  qimenUpperStart,
  actualSolarTermTime,
}) {
  if (!QIMEN_TERM_SEQUENCE.includes(qimenSolarTerm)) {
    throw new RangeError(`未知奇門節氣：${qimenSolarTerm}`);
  }

  const qimenUpperStartMs = toTimeMs(qimenUpperStart);
  const actualSolarTermTimeMs = toTimeMs(actualSolarTermTime);
  const isChaoShen = qimenUpperStartMs < actualSolarTermTimeMs;
  const actualEffectiveDayStart = getQimenEffectiveDayStart(actualSolarTermTime);
  const chaoShenDays = isChaoShen
    ? Math.floor((toTimeMs(actualEffectiveDayStart) - qimenUpperStartMs) / DAY_MS) + 1
    : 0;
  const reachesNineDays = chaoShenDays >= 9;
  const isIntercalationWindow = INTERCALATION_WINDOW_TERMS.has(qimenSolarTerm);
  const shouldIntercalate = reachesNineDays && isIntercalationWindow;

  return {
    qimenSolarTerm,
    qimenUpperStart,
    actualSolarTermTime,
    chaoShenDays,
    reachesNineDays,
    isIntercalationWindow,
    shouldIntercalate,
    intercalarySolarTerm: shouldIntercalate ? qimenSolarTerm : null,
    reason: getIntercalationCandidateReason({
      qimenSolarTerm,
      isChaoShen,
      reachesNineDays,
      isIntercalationWindow,
      shouldIntercalate,
    }),
  };
}

export function analyzeQimenIntercalationWindowsForYear({ year, candidates }) {
  if (!Number.isInteger(year)) {
    throw new TypeError("year 需為整數");
  }

  if (!Array.isArray(candidates)) {
    throw new TypeError("candidates 需為陣列");
  }

  return candidates.map((candidate) => {
    if (!INTERCALATION_WINDOW_TERMS.has(candidate.qimenSolarTerm)) {
      throw new RangeError(`年度置閏窗口只支援芒種或大雪：${candidate.qimenSolarTerm}`);
    }

    const actualSolarTermTime = findActualSolarTermTimeByYear(candidate.qimenSolarTerm, year);

    return analyzeQimenIntercalationCandidate({
      qimenSolarTerm: candidate.qimenSolarTerm,
      qimenUpperStart: candidate.qimenUpperStart,
      actualSolarTermTime,
    });
  });
}

export function buildQimenIntercalationWindowCandidatesForYear(year) {
  if (!Number.isInteger(year)) {
    throw new TypeError("year 需為整數");
  }

  return INTERCALATION_WINDOW_TERM_NAMES.map((qimenSolarTerm) => {
    const actualSolarTermTime = findActualSolarTermTimeByYear(qimenSolarTerm, year);
    const actualEffectiveDayStart = getQimenEffectiveDayStart(actualSolarTermTime);
    const scanStart = addQimenEffectiveDays(actualEffectiveDayStart, -20);
    const scanEnd = addQimenEffectiveDays(actualEffectiveDayStart, 1);
    const upperStart = scanQimenFuTouDays(scanStart, scanEnd)
      .filter((fuTouDay) => {
        return fuTouDay.yuan === "上元" && toTimeMs(fuTouDay.effectiveDayStart) <= toTimeMs(actualEffectiveDayStart);
      })
      .sort((a, b) => toTimeMs(b.effectiveDayStart) - toTimeMs(a.effectiveDayStart))[0];

    if (!upperStart) {
      throw new RangeError(`找不到 ${year} 年 ${qimenSolarTerm} 前的奇門上元符頭`);
    }

    return {
      qimenSolarTerm,
      qimenUpperStart: upperStart.effectiveDayStart,
      actualSolarTermTime,
      sourceDayPillar: upperStart.dayPillar,
    };
  });
}

export function analyzeQimenIntercalationWindowsForYearAuto(year) {
  if (!Number.isInteger(year)) {
    throw new TypeError("year 需為整數");
  }

  return analyzeQimenIntercalationWindowsForYear({
    year,
    candidates: buildQimenIntercalationWindowCandidatesForYear(year),
  });
}

export function buildQimenYearSeedRecommendations(year) {
  if (!Number.isInteger(year)) {
    throw new TypeError("year 需為整數");
  }

  const windows = analyzeQimenIntercalationWindowsForYearAuto(year);
  const mangzhongWindow = findWindowAnalysisByTerm(windows, "芒種");
  const daxueWindow = findWindowAnalysisByTerm(windows, "大雪");
  const seeds = [
    createSeedRecommendation({
      effectiveDayStart: mangzhongWindow.qimenUpperStart,
      qimenSolarTerm: "芒種",
      isIntercalary: false,
      source: "auto-window",
      reason: mangzhongWindow.shouldIntercalate
        ? "芒種窗口達九日，先立芒種本氣。"
        : "芒種窗口未達九日，不置閏。",
    }),
    createSeedRecommendation({
      effectiveDayStart: addQimenEffectiveDays(mangzhongWindow.qimenUpperStart, 15),
      qimenSolarTerm: "夏至",
      isIntercalary: false,
      source: "derived-next-term",
      reason: "芒種三元後接夏至。",
    }),
    createSeedRecommendation({
      effectiveDayStart: daxueWindow.qimenUpperStart,
      qimenSolarTerm: "大雪",
      isIntercalary: false,
      source: "auto-window",
      reason: daxueWindow.shouldIntercalate
        ? "大雪窗口達九日，先立大雪本氣。"
        : "大雪窗口未達九日，不置閏。",
    }),
  ];

  if (daxueWindow.shouldIntercalate) {
    const intercalaryDaxueStart = addQimenEffectiveDays(daxueWindow.qimenUpperStart, 15);
    seeds.push(
      createSeedRecommendation({
        effectiveDayStart: intercalaryDaxueStart,
        qimenSolarTerm: "大雪",
        isIntercalary: true,
        source: "auto-intercalation",
        reason: "大雪窗口超神達九日，置閏大雪。",
      }),
      createSeedRecommendation({
        effectiveDayStart: addQimenEffectiveDays(intercalaryDaxueStart, 15),
        qimenSolarTerm: "冬至",
        isIntercalary: false,
        source: "derived-next-term",
        reason: "閏大雪三元後接冬至。",
      })
    );
  } else {
    seeds.push(createSeedRecommendation({
      effectiveDayStart: addQimenEffectiveDays(daxueWindow.qimenUpperStart, 15),
      qimenSolarTerm: "冬至",
      isIntercalary: false,
      source: "derived-next-term",
      reason: "大雪三元後接冬至。",
    }));
  }

  return {
    year,
    seeds: seeds.sort((a, b) => toTimeMs(a.effectiveDayStart) - toTimeMs(b.effectiveDayStart)),
    windows,
  };
}

export function buildQimenTimelineFromYearSeedRecommendations(year) {
  if (!Number.isInteger(year)) {
    throw new TypeError("year 需為整數");
  }

  const recommendations = buildQimenYearSeedRecommendations(year);
  const timelineSeeds = recommendations.seeds.map(({ effectiveDayStart, qimenSolarTerm, isIntercalary }) => {
    return { effectiveDayStart, qimenSolarTerm, isIntercalary };
  });
  const mangzhongSeed = findSeedByTermAndIntercalary(timelineSeeds, "芒種", false);
  const xiazhiSeed = findSeedByTermAndIntercalary(timelineSeeds, "夏至", false);
  const daxueSeed = findSeedByTermAndIntercalary(timelineSeeds, "大雪", false);
  const intercalaryDaxueSeed = findSeedByTermAndIntercalary(timelineSeeds, "大雪", true);
  const dongzhiSeed = findSeedByTermAndIntercalary(timelineSeeds, "冬至", false);

  if (!mangzhongSeed || !xiazhiSeed || !daxueSeed || !dongzhiSeed) {
    throw new RangeError("年度 seed 建議缺少芒種、夏至、大雪或冬至必要 seed");
  }

  const timeline = [
    ...buildTimelineSegmentFromSeeds({
      startEffectiveDay: addQimenEffectiveDays(mangzhongSeed.effectiveDayStart, -9),
      endEffectiveDay: addQimenEffectiveDays(xiazhiSeed.effectiveDayStart, 16),
      seeds: [mangzhongSeed, xiazhiSeed],
    }),
    ...buildTimelineSegmentFromSeeds({
      startEffectiveDay: addQimenEffectiveDays(daxueSeed.effectiveDayStart, -9),
      endEffectiveDay: addQimenEffectiveDays(dongzhiSeed.effectiveDayStart, 16),
      seeds: [
        daxueSeed,
        ...(intercalaryDaxueSeed ? [intercalaryDaxueSeed] : []),
        dongzhiSeed,
      ],
    }),
  ];

  return dedupeTimelineByStart(timeline)
    .sort((a, b) => toTimeMs(a.start) - toTimeMs(b.start));
}

function findSeedByTermAndIntercalary(seeds, termName, isIntercalary) {
  return seeds.find((seed) => {
    return seed.qimenSolarTerm === termName && seed.isIntercalary === isIntercalary;
  }) ?? null;
}

function buildTimelineSegmentFromSeeds({ startEffectiveDay, endEffectiveDay, seeds }) {
  return buildQimenTimelineFromFuTouSeeds({
    startEffectiveDay,
    endEffectiveDay,
    seeds,
  });
}

function dedupeTimelineByStart(timeline) {
  const entryByStart = new Map();

  for (const entry of timeline) {
    if (!entryByStart.has(entry.start)) {
      entryByStart.set(entry.start, entry);
    }
  }

  return [...entryByStart.values()];
}

function findWindowAnalysisByTerm(windows, termName) {
  const window = Array.isArray(windows)
    ? windows.find((candidate) => candidate.qimenSolarTerm === termName)
    : null;

  if (!window) {
    throw new RangeError(`年度置閏窗口分析缺少 ${termName}`);
  }

  return window;
}

function createSeedRecommendation({
  effectiveDayStart,
  qimenSolarTerm,
  isIntercalary,
  source,
  reason,
}) {
  return {
    effectiveDayStart,
    qimenSolarTerm,
    isIntercalary,
    source,
    reason,
  };
}

function findActualSolarTermTimeByYear(termName, year) {
  const term = solarTerms.find((candidate) => {
    return candidate.name === termName && candidate.year_taipei === year;
  });

  if (!term) {
    throw new RangeError(`找不到 ${year} 年 ${termName} 節氣資料`);
  }

  return term.asia_taipei;
}

function getIntercalationCandidateReason({
  qimenSolarTerm,
  isChaoShen,
  reachesNineDays,
  isIntercalationWindow,
  shouldIntercalate,
}) {
  if (!isChaoShen) {
    return `奇門${qimenSolarTerm}上元未早於實際${qimenSolarTerm}，不是超神狀態。`;
  }

  if (shouldIntercalate) {
    return `奇門${qimenSolarTerm}上元早於實際${qimenSolarTerm}，超神達九日，且${qimenSolarTerm}為可置閏窗口。`;
  }

  if (!reachesNineDays) {
    return `奇門${qimenSolarTerm}上元早於實際${qimenSolarTerm}，但超神未達九日。`;
  }

  if (!isIntercalationWindow) {
    return `奇門${qimenSolarTerm}上元早於實際${qimenSolarTerm}且超神達九日，但${qimenSolarTerm}不是可置閏窗口。`;
  }

  return `奇門${qimenSolarTerm}不符合置閏條件。`;
}

function trimIncompleteFinalSeedTerm(fuTouDays) {
  const lastFuTouDay = fuTouDays.at(-1);
  if (!lastFuTouDay || lastFuTouDay.yuan === "下元") {
    return fuTouDays;
  }

  const lastUpperIndex = fuTouDays.findLastIndex((fuTouDay) => fuTouDay.yuan === "上元");
  if (lastUpperIndex < 0) {
    return [];
  }

  return fuTouDays.slice(0, lastUpperIndex + 1);
}

function findActualSolarTerm(dateTimeText) {
  const targetMs = toTimeMs(dateTimeText);
  let currentTerm = null;

  for (const term of solarTerms) {
    if (term.timeMs > targetMs) {
      break;
    }

    currentTerm = term;
  }

  if (!currentTerm) {
    throw new RangeError("輸入時間早於節氣資料範圍");
  }

  return currentTerm.name;
}

function resolveQimenStatus(actualSolarTerm, timelineEntry) {
  if (timelineEntry.isIntercalary && isActualTermAhead(actualSolarTerm, timelineEntry.qimenSolarTerm)) {
    return "置閏後接氣";
  }

  if (timelineEntry.isIntercalary) {
    return "置閏";
  }

  if (actualSolarTerm === timelineEntry.qimenSolarTerm) {
    return "正常";
  }

  if (isQimenTermAhead(actualSolarTerm, timelineEntry.qimenSolarTerm)) {
    return "超神";
  }

  return "接氣";
}

function isQimenTermAhead(actualSolarTerm, qimenSolarTerm) {
  const forwardDistance = getForwardTermDistance(actualSolarTerm, qimenSolarTerm);
  return forwardDistance > 0 && forwardDistance <= QIMEN_TERM_SEQUENCE.length / 2;
}

function isActualTermAhead(actualSolarTerm, qimenSolarTerm) {
  return actualSolarTerm !== qimenSolarTerm && !isQimenTermAhead(actualSolarTerm, qimenSolarTerm);
}

function getForwardTermDistance(fromTerm, toTerm) {
  const fromIndex = QIMEN_TERM_SEQUENCE.indexOf(fromTerm);
  const toIndex = QIMEN_TERM_SEQUENCE.indexOf(toTerm);

  if (fromIndex < 0 || toIndex < 0) {
    throw new RangeError(`未知節氣：${fromIndex < 0 ? fromTerm : toTerm}`);
  }

  return (toIndex - fromIndex + QIMEN_TERM_SEQUENCE.length) % QIMEN_TERM_SEQUENCE.length;
}

function toTaipeiLocalDateTimeText(dateTimeText) {
  if (!hasExplicitOffset(dateTimeText)) {
    return dateTimeText;
  }

  if (/[+]08:00$/.test(dateTimeText)) {
    return dateTimeText.slice(0, -6);
  }

  const date = new Date(toTimeMs(dateTimeText));
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}`;
}

function hasExplicitOffset(dateTimeText) {
  return /(?:Z|[+-]\d{2}:?\d{2})$/.test(dateTimeText);
}

function toTimeMs(dateTimeText) {
  const normalized = typeof dateTimeText === "string" && !hasExplicitOffset(dateTimeText)
    ? `${dateTimeText}+08:00`
    : dateTimeText;
  const timeMs = Date.parse(normalized);
  if (!Number.isFinite(timeMs)) {
    throw new Error(`日期時間格式錯誤：${dateTimeText}`);
  }

  return timeMs;
}

function cloneTimelineEntry(entry) {
  return { ...entry };
}

function formatTaipeiDateTime(timeMs) {
  const taipeiDate = new Date(timeMs + TAIPEI_OFFSET_MS);
  const year = String(taipeiDate.getUTCFullYear()).padStart(4, "0");
  const month = String(taipeiDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(taipeiDate.getUTCDate()).padStart(2, "0");
  const hour = String(taipeiDate.getUTCHours()).padStart(2, "0");
  const minute = String(taipeiDate.getUTCMinutes()).padStart(2, "0");
  const second = String(taipeiDate.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}:${second}+08:00`;
}
