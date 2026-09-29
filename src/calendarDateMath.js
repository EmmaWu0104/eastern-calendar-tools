const DAYS_IN_WEEK = 7;

// 月份使用 JavaScript Date 的 0-based 索引；回傳值以星期一為 0、星期日為 6。
export function getMondayFirstCalendarOffset(year, monthIndex) {
  return (new Date(year, monthIndex, 1).getDay() + 6) % DAYS_IN_WEEK;
}

export function getDaysInCalendarMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function createMondayFirstCalendarCells(year, monthIndex) {
  const leadingBlankCount = getMondayFirstCalendarOffset(year, monthIndex);
  const daysInMonth = getDaysInCalendarMonth(year, monthIndex);

  return [
    ...Array(leadingBlankCount).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
}
