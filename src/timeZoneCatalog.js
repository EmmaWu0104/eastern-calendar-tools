import { MAX_TIME_ZONE_INPUT_LENGTH } from "./timeZone.js";

const FALLBACK_TIME_ZONES = Object.freeze([
  "UTC",
  "Africa/Cairo", "Africa/Johannesburg",
  "America/Anchorage", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Mexico_City", "America/New_York", "America/Sao_Paulo", "America/Toronto",
  "America/Vancouver", "Asia/Bangkok", "Asia/Hong_Kong", "Asia/Kathmandu", "Asia/Kolkata",
  "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Taipei", "Asia/Tokyo",
  "Atlantic/Reykjavik", "Australia/Adelaide", "Australia/Brisbane", "Australia/Lord_Howe",
  "Australia/Melbourne", "Australia/Perth", "Australia/Sydney", "Europe/Berlin", "Europe/Helsinki",
  "Europe/London", "Europe/Madrid", "Europe/Moscow", "Europe/Oslo", "Europe/Paris", "Europe/Rome",
  "Pacific/Auckland", "Pacific/Chatham", "Pacific/Honolulu",
]);

const COMMON_TIME_ZONES = Object.freeze([
  "Asia/Taipei", "Asia/Tokyo", "America/Los_Angeles", "America/New_York",
  "Europe/London", "Europe/Oslo", "Asia/Kathmandu", "Australia/Lord_Howe",
]);

const ALIAS_ENTRIES = Object.freeze([
  entry("Asia/Taipei", "臺灣／臺北", "臺灣", ["臺灣", "台灣", "臺北", "台北", "高雄", "Taiwan", "Taipei"]),
  entry("Asia/Tokyo", "日本／東京", "日本", ["日本", "東京", "大阪", "Japan", "Tokyo", "Osaka"]),
  entry("Asia/Seoul", "韓國／首爾", "韓國", ["韓國", "首爾", "Korea", "Seoul"]),
  entry("Asia/Hong_Kong", "香港", "香港", ["香港", "Hong Kong"]),
  entry("Asia/Shanghai", "中國／北京、上海", "中國", ["中國", "北京", "上海", "China", "Beijing", "Shanghai"]),
  entry("America/Los_Angeles", "美國／洛杉磯", "美國", ["美國", "美国", "USA", "United States", "洛杉磯", "洛杉矶", "Los Angeles", "LA", "California"]),
  entry("America/New_York", "美國／紐約", "美國", ["美國", "美国", "USA", "United States", "紐約", "纽约", "New York", "NYC"]),
  entry("America/Chicago", "美國／芝加哥", "美國", ["美國", "美国", "USA", "United States", "芝加哥", "Chicago"]),
  entry("America/Denver", "美國／丹佛", "美國", ["美國", "美国", "USA", "United States", "丹佛", "Denver"]),
  entry("America/Anchorage", "美國／安克拉治", "美國", ["美國", "美国", "USA", "United States", "安克拉治", "Anchorage", "Alaska"]),
  entry("Pacific/Honolulu", "美國／檀香山（夏威夷）", "美國", ["美國", "美国", "USA", "United States", "檀香山", "Honolulu", "夏威夷", "Hawaii"]),
  entry("America/Vancouver", "加拿大／溫哥華", "加拿大", ["加拿大", "Canada", "溫哥華", "温哥华", "Vancouver"]),
  entry("America/Toronto", "加拿大／多倫多", "加拿大", ["加拿大", "Canada", "多倫多", "多伦多", "Toronto"]),
  entry("Europe/London", "英國／倫敦", "英國", ["英國", "倫敦", "London", "UK"]),
  entry("Europe/Paris", "法國／巴黎", "法國", ["法國", "巴黎", "France", "Paris"]),
  entry("Europe/Oslo", "挪威／奧斯陸、Tromsø", "挪威", ["挪威", "奧斯陸", "特羅姆瑟", "Norway", "Oslo", "Tromsø", "Tromso"]),
  entry("Atlantic/Reykjavik", "冰島／雷克雅維克", "冰島", ["冰島", "雷克雅維克", "Iceland", "Reykjavik"]),
  entry("Asia/Kathmandu", "尼泊爾／加德滿都", "尼泊爾", ["尼泊爾", "加德滿都", "Nepal", "Kathmandu"]),
  entry("Australia/Lord_Howe", "澳洲／豪勳爵島", "澳洲", ["澳洲", "Australia", "豪勳爵島", "Lord Howe"]),
  entry("Australia/Sydney", "澳洲／雪梨", "澳洲", ["澳洲", "雪梨", "悉尼", "Australia", "Sydney"]),
  entry("Australia/Melbourne", "澳洲／墨爾本", "澳洲", ["澳洲", "Australia", "墨爾本", "墨尔本", "Melbourne"]),
  entry("Australia/Brisbane", "澳洲／布里斯本", "澳洲", ["澳洲", "Australia", "布里斯本", "Brisbane"]),
  entry("Australia/Adelaide", "澳洲／阿德雷德", "澳洲", ["澳洲", "Australia", "阿德雷德", "Adelaide"]),
  entry("Australia/Perth", "澳洲／伯斯", "澳洲", ["澳洲", "Australia", "伯斯", "珀斯", "Perth"]),
  entry("Pacific/Auckland", "紐西蘭／奧克蘭", "紐西蘭", ["紐西蘭", "奧克蘭", "New Zealand", "Auckland"]),
]);

const aliasByTimeZone = new Map(ALIAS_ENTRIES.map((item) => [item.timeZone, item]));
const commonPriority = new Map(COMMON_TIME_ZONES.map((timeZone, index) => [timeZone, index]));
let supportedTimeZonesCache = null;

export function getSupportedTimeZones({ forceFallback = false } = {}) {
  if (forceFallback) return [...FALLBACK_TIME_ZONES];
  if (supportedTimeZonesCache) return [...supportedTimeZonesCache];

  let browserTimeZones = [];
  try {
    if (typeof Intl.supportedValuesOf === "function") {
      browserTimeZones = Intl.supportedValuesOf("timeZone");
    }
  } catch {
    browserTimeZones = [];
  }
  supportedTimeZonesCache = Object.freeze([...new Set([...browserTimeZones, ...FALLBACK_TIME_ZONES])].sort());
  return [...supportedTimeZonesCache];
}

export function getCommonTimeZones() {
  return [...COMMON_TIME_ZONES];
}

export function getTimeZoneAliases() {
  return ALIAS_ENTRIES.map((item) => ({ ...item, labels: [...item.labels] }));
}

export function getTimeZoneSearchEntry(timeZone) {
  const alias = aliasByTimeZone.get(timeZone);
  return alias
    ? { ...alias, labels: [...alias.labels] }
    : { timeZone, label: timeZone, regionLabel: "", labels: [] };
}

export function searchTimeZones(query, { limit = 16, timeZones = getSupportedTimeZones() } = {}) {
  if (typeof query === "string" && query.length > MAX_TIME_ZONE_INPUT_LENGTH) {
    return [];
  }
  const normalizedQuery = normalizeSearchText(query);
  const cappedLimit = Math.max(1, Math.min(20, Number.isInteger(limit) ? limit : 16));
  const source = Array.isArray(timeZones) ? timeZones : getSupportedTimeZones();
  const uniqueZones = [...new Set(source.filter((timeZone) => typeof timeZone === "string" && timeZone))];
  const candidateZones = normalizedQuery ? uniqueZones : COMMON_TIME_ZONES.filter((timeZone) => uniqueZones.includes(timeZone));

  return candidateZones
    .map((timeZone) => scoreSearchEntry(getTimeZoneSearchEntry(timeZone), normalizedQuery))
    .filter(Boolean)
    .sort(compareSearchEntries)
    .slice(0, cappedLimit)
    .map(({ score, ...entry }) => entry);
}

function entry(timeZone, label, regionLabel, labels) {
  return Object.freeze({ timeZone, label, regionLabel, labels: Object.freeze([...labels]) });
}

function scoreSearchEntry(entryValue, query) {
  if (!query) return { ...entryValue, score: commonPriority.get(entryValue.timeZone) ?? 100 };
  const timeZoneText = normalizeSearchText(entryValue.timeZone);
  const labels = [entryValue.label, entryValue.regionLabel, ...entryValue.labels].map(normalizeSearchText);
  let score = null;

  if (timeZoneText === query) score = 0;
  else if (timeZoneText.startsWith(query)) score = 1;
  else if (labels.includes(query)) score = 2;
  else if (labels.some((label) => label.startsWith(query))) score = 3;
  else if (timeZoneText.includes(query) || labels.some((label) => label.includes(query))) score = 4;
  if (score === null) return null;
  return { ...entryValue, score };
}

function compareSearchEntries(left, right) {
  return left.score - right.score
    || (commonPriority.get(left.timeZone) ?? 100) - (commonPriority.get(right.timeZone) ?? 100)
    || left.timeZone.localeCompare(right.timeZone);
}

function normalizeSearchText(value) {
  return typeof value === "string"
    ? value.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\/_-]/g, " ").replace(/\s+/g, " ")
    : "";
}
