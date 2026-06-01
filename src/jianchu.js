export const JIANCHU_SEQUENCE = Object.freeze([
  "建",
  "除",
  "滿",
  "平",
  "定",
  "執",
  "破",
  "危",
  "成",
  "收",
  "開",
  "閉",
]);

export const EARTHLY_BRANCH_INDEX = Object.freeze({
  "子": 0,
  "丑": 1,
  "寅": 2,
  "卯": 3,
  "辰": 4,
  "巳": 5,
  "午": 6,
  "未": 7,
  "申": 8,
  "酉": 9,
  "戌": 10,
  "亥": 11,
});

export function getJianchuSequence() {
  return [...JIANCHU_SEQUENCE];
}

export function getEarthlyBranchIndex(branch) {
  const normalizedBranch = normalizeBranch(branch);
  return Object.hasOwn(EARTHLY_BRANCH_INDEX, normalizedBranch)
    ? EARTHLY_BRANCH_INDEX[normalizedBranch]
    : -1;
}

export function getJianchuByBranches(monthBranch, dayBranch) {
  const normalizedMonthBranch = normalizeBranch(monthBranch);
  const normalizedDayBranch = normalizeBranch(dayBranch);
  const monthBranchIndex = getEarthlyBranchIndex(normalizedMonthBranch);
  const dayBranchIndex = getEarthlyBranchIndex(normalizedDayBranch);

  if (monthBranchIndex < 0 || dayBranchIndex < 0) {
    return null;
  }

  const index = (dayBranchIndex - monthBranchIndex + 12) % 12;
  const name = JIANCHU_SEQUENCE[index];

  return {
    name,
    fullName: `${name}日`,
    index,
    monthBranch: normalizedMonthBranch,
    dayBranch: normalizedDayBranch,
  };
}

function normalizeBranch(branch) {
  return typeof branch === "string" ? branch.trim() : "";
}
