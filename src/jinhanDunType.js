// 金函玉鏡超神接氣陰陽遁判斷的未來介面骨架。
// 目前因「甲日」、「第四逢之甲」、夏至對稱、節氣交接當日等規則仍待確認，
// 固定回傳 manual-required，不可在未確認規則前自行改成冬至後陽遁、夏至後陰遁。
// 詳細規則參考：
// - docs/09_金函玉鏡超神接氣規則整理.md
// - docs/10_金函玉鏡超神接氣工程規格草案.md

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

export function getJinhanDunType(dateTime, calendarResult, solarTerms) {
  void dateTime;
  void calendarResult;
  void solarTerms;

  return {
    status: JINHAN_DUN_TYPE_STATUS.MANUAL_REQUIRED,
    dunType: null,
    mode: JINHAN_DUN_TYPE_MODE.PENDING,
    boundary: null,
    reason: "金函玉鏡超神接氣規則尚未完整確認，請手動選擇陰陽遁。",
  };
}
