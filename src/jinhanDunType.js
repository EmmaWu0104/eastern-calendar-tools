import { getDayPillar, getDayPillarFromLocalParts } from "./ganzhi.js";
import { parseLocalDateTime } from "./solarTerms.js";

// 金函玉鏡超神接氣陰陽遁判斷 v1。
// v1 採使用者確認規則：換遁日一定是甲日，地支不計；
// 冬至換入陽遁，夏至換入陰遁；節氣交節時刻所屬日干依既有 23:00 換日規則判定。
// 詳細規則參考：
// - docs/09_金函玉鏡超神接氣規則整理.md
// - docs/10_金函玉鏡超神接氣工程規格草案.md

const DAY_MS = 24 * 60 * 60 * 1000;
const YANG_DUN = "陽遁";
const YIN_DUN = "陰遁";

export const JINHAN_DUN_TYPE_STATUS = Object.freeze({
  MANUAL_REQUIRED: "manual-required",
  RESOLVED: "resolved",
  UNSUPPORTED: "unsupported",
});

export const JINHAN_DUN_TYPE_MODE = Object.freeze({
  PENDING: "pending",
  ZHENG_SHOU: "正授",
  CHAO_SHEN: "超神",
  JIE_QI: "接氣",
  UNKNOWN: "unknown",
});

export const JINHAN_STEM_SWITCH_OFFSETS = Object.freeze({
  甲: Object.freeze({ offsetDays: 0, mode: JINHAN_DUN_TYPE_MODE.ZHENG_SHOU }),
  乙: Object.freeze({ offsetDays: -1, mode: JINHAN_DUN_TYPE_MODE.JIE_QI }),
  丙: Object.freeze({ offsetDays: -2, mode: JINHAN_DUN_TYPE_MODE.JIE_QI }),
  丁: Object.freeze({ offsetDays: -3, mode: JINHAN_DUN_TYPE_MODE.JIE_QI }),
  戊: Object.freeze({ offsetDays: -4, mode: JINHAN_DUN_TYPE_MODE.JIE_QI }),
  己: Object.freeze({ offsetDays: 5, mode: JINHAN_DUN_TYPE_MODE.CHAO_SHEN }),
  庚: Object.freeze({ offsetDays: 4, mode: JINHAN_DUN_TYPE_MODE.CHAO_SHEN }),
  辛: Object.freeze({ offsetDays: 3, mode: JINHAN_DUN_TYPE_MODE.CHAO_SHEN }),
  壬: Object.freeze({ offsetDays: 2, mode: JINHAN_DUN_TYPE_MODE.CHAO_SHEN }),
  癸: Object.freeze({ offsetDays: 1, mode: JINHAN_DUN_TYPE_MODE.CHAO_SHEN }),
});

/**
 * Builds the v1 boundary snapshot from an already-resolved local clock.
 * The local clock is authoritative for the 23:00 effective-day rule; the
 * astronomical term instant is retained only for diagnostics.
 */
export function createJinhanBoundarySwitch({ boundary, termLocalParts, termTimeMs = null } = {}) {
  if (boundary !== "冬至" && boundary !== "夏至") {
    throw new TypeError("boundary 必須是冬至或夏至");
  }
  const termDayPillar = getDayPillarFromLocalParts(termLocalParts);
  const termDateTime = formatLocalDateTime(termLocalParts);
  const termStem = termDayPillar.pillar[0];
  const switchRule = JINHAN_STEM_SWITCH_OFFSETS[termStem];
  if (!switchRule) {
    throw new TypeError(`節氣交節日干無法判斷金函規則：${termStem}`);
  }

  return {
    boundary,
    termDateTime,
    termLocalParts: cloneLocalParts(termLocalParts),
    termTimeMs: Number.isFinite(termTimeMs) ? termTimeMs : null,
    termDayPillar: termDayPillar.pillar,
    termStem,
    termEffectiveDate: termDayPillar.effectiveDate,
    switchDate: addDaysToCivilDate(termDayPillar.effectiveDate, switchRule.offsetDays),
    offsetDays: switchRule.offsetDays,
    mode: switchRule.mode,
    dunTypeAfter: boundary === "冬至" ? YANG_DUN : YIN_DUN,
    dunTypeBefore: boundary === "冬至" ? YIN_DUN : YANG_DUN,
  };
}

/** Resolves the existing v1 annual interval from explicit local snapshots. */
export function resolveJinhanDunTypeFromLocalParts({
  queryLocalParts,
  previousWinter,
  currentSummer,
  currentWinter,
  prePreviousWinter = null,
  previousSummer = null,
} = {}) {
  const queryEffectiveDate = getDayPillarFromLocalParts(queryLocalParts).effectiveDate;
  if (!previousWinter || !currentSummer || !currentWinter) {
    return createUnsupportedResult("缺少冬至 / 夏至邊界資料，無法判斷金函玉鏡陰陽遁。");
  }

  if (compareCivilDates(queryEffectiveDate, previousWinter.switchDate) < 0) {
    if (!prePreviousWinter || !previousSummer) {
      return createUnsupportedResult("缺少前一年冬至 / 夏至邊界資料，無法判斷金函玉鏡陰陽遁。");
    }
    return resolveDunType(queryEffectiveDate, prePreviousWinter, previousSummer, previousWinter);
  }

  return resolveDunType(queryEffectiveDate, previousWinter, currentSummer, currentWinter);
}

export function getJinhanDunType(dateTime, calendarResult, solarTerms) {
  void calendarResult;

  if (!Array.isArray(solarTerms)) {
    return createUnsupportedResult("缺少節氣資料，無法判斷金函玉鏡陰陽遁。");
  }

  try {
    const queryDateTime = parseLocalDateTime(dateTime);
    const queryEffectiveDate = getDayPillar(dateTime).effectiveDate;
    const year = queryDateTime.year;

    const previousWinter = getBoundarySwitch(year - 1, "冬至", solarTerms);
    const currentSummer = getBoundarySwitch(year, "夏至", solarTerms);
    const currentWinter = getBoundarySwitch(year, "冬至", solarTerms);

    if (!previousWinter || !currentSummer || !currentWinter) {
      return createUnsupportedResult("缺少冬至 / 夏至資料，無法判斷金函玉鏡陰陽遁。");
    }

    if (compareCivilDates(queryEffectiveDate, previousWinter.switchDate) < 0) {
      const prePreviousWinter = getBoundarySwitch(year - 2, "冬至", solarTerms);
      const previousSummer = getBoundarySwitch(year - 1, "夏至", solarTerms);

      if (!prePreviousWinter || !previousSummer) {
        return createUnsupportedResult("缺少前一年冬至 / 夏至資料，無法判斷金函玉鏡陰陽遁。");
      }

      return resolveDunType(queryEffectiveDate, prePreviousWinter, previousSummer, previousWinter);
    }

    return resolveDunType(queryEffectiveDate, previousWinter, currentSummer, currentWinter);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return createUnsupportedResult(`金函玉鏡陰陽遁判斷失敗：${message}`);
  }
}

function resolveDunType(queryEffectiveDate, previousWinter, currentSummer, currentWinter) {
  const pendingChaoBoundary = [currentWinter, currentSummer].find((boundary) =>
    isInChaoShenPendingRange(queryEffectiveDate, boundary)
  );

  if (pendingChaoBoundary) {
    return createResolvedResult(
      pendingChaoBoundary.dunTypeBefore,
      pendingChaoBoundary,
      `依金函玉鏡超神接氣 v1：${pendingChaoBoundary.boundary}交節日干為${pendingChaoBoundary.termStem}，超神，尚未至後方甲日，暫用${pendingChaoBoundary.dunTypeBefore}。`
    );
  }

  if (compareCivilDates(queryEffectiveDate, currentWinter.switchDate) >= 0) {
    return createResolvedResult(
      currentWinter.dunTypeAfter,
      currentWinter,
      createResolvedReason(currentWinter)
    );
  }

  if (compareCivilDates(queryEffectiveDate, currentSummer.switchDate) >= 0) {
    return createResolvedResult(
      currentSummer.dunTypeAfter,
      currentSummer,
      createResolvedReason(currentSummer)
    );
  }

  return createResolvedResult(
    previousWinter.dunTypeAfter,
    previousWinter,
    createResolvedReason(previousWinter)
  );
}

function getBoundarySwitch(year, boundaryName, solarTerms) {
  const term = findSolarTerm(year, boundaryName, solarTerms);
  if (!term) {
    return null;
  }

  const termDateTime = formatTermLocalDateTime(term);
  return createJinhanBoundarySwitch({
    boundary: boundaryName,
    termLocalParts: parseLocalDateTime(termDateTime),
    termTimeMs: getTermTimeMs(term),
  });
}

function findSolarTerm(year, name, solarTerms) {
  return solarTerms.find((term) => {
    const termYear = term.year_taipei ?? term.year;
    return term.name === name && termYear === year;
  });
}

function formatTermLocalDateTime(term) {
  const timeMs = getTermTimeMs(term);
  const date = new Date(timeMs);
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}

function getTermTimeMs(term) {
  const timeMs = term.timeMs ?? Date.parse(term.asia_taipei ?? term.time ?? term.utc);
  if (!Number.isFinite(timeMs)) {
    throw new Error(`節氣時間格式錯誤：${term.name ?? "未知節氣"}`);
  }

  return timeMs;
}

function isInChaoShenPendingRange(queryEffectiveDate, boundary) {
  return (
    boundary.mode === JINHAN_DUN_TYPE_MODE.CHAO_SHEN &&
    compareCivilDates(queryEffectiveDate, boundary.termEffectiveDate) >= 0 &&
    compareCivilDates(queryEffectiveDate, boundary.switchDate) < 0
  );
}

function createResolvedReason(boundary) {
  const switchDirection = boundary.offsetDays < 0 ? "前方甲日" : "後方甲日";
  const timingText =
    boundary.mode === JINHAN_DUN_TYPE_MODE.ZHENG_SHOU ? "當日甲日" : switchDirection;

  return `依金函玉鏡超神接氣 v1：${boundary.boundary}交節日干為${boundary.termStem}，${boundary.mode}，已於${timingText}換入${boundary.dunTypeAfter}。`;
}

function createResolvedResult(dunType, boundary, reason) {
  return {
    status: JINHAN_DUN_TYPE_STATUS.RESOLVED,
    dunType,
    mode: boundary.mode,
    boundary: boundary.boundary,
    switchEffectiveDay: boundary.switchDate,
    offsetDays: boundary.offsetDays,
    reason,
  };
}

function createUnsupportedResult(reason) {
  return {
    status: JINHAN_DUN_TYPE_STATUS.UNSUPPORTED,
    dunType: null,
    mode: JINHAN_DUN_TYPE_MODE.UNKNOWN,
    boundary: null,
    switchEffectiveDay: null,
    offsetDays: null,
    reason,
  };
}

function cloneLocalParts(parts) {
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    second: parts.second,
    millisecond: parts.millisecond ?? 0,
  };
}

function formatLocalDateTime(parts) {
  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}T${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}.${String(parts.millisecond ?? 0).padStart(3, "0")}`;
}

function addDaysToCivilDate(civilDate, days) {
  const [year, month, day] = civilDate.split("-").map(Number);
  const timeMs = Date.UTC(year, month - 1, day) + days * DAY_MS;
  const date = new Date(timeMs);

  return [
    String(date.getUTCFullYear()).padStart(4, "0"),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function compareCivilDates(a, b) {
  return a.localeCompare(b);
}
