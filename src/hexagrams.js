export const TRIGRAMS = Object.freeze({
  qian: Object.freeze({ key: "qian", name: "乾", image: "天" }),
  kun: Object.freeze({ key: "kun", name: "坤", image: "地" }),
  zhen: Object.freeze({ key: "zhen", name: "震", image: "雷" }),
  xun: Object.freeze({ key: "xun", name: "巽", image: "風" }),
  kan: Object.freeze({ key: "kan", name: "坎", image: "水" }),
  li: Object.freeze({ key: "li", name: "離", image: "火" }),
  gen: Object.freeze({ key: "gen", name: "艮", image: "山" }),
  dui: Object.freeze({ key: "dui", name: "兌", image: "澤" }),
});

const QIMEN_STARS_TO_TRIGRAMS = Object.freeze({
  天蓬: "kan",
  天任: "gen",
  天衝: "zhen",
  天沖: "zhen",
  天輔: "xun",
  天英: "li",
  天芮: "kun",
  天禽: "kun",
  天柱: "dui",
  天心: "qian",
});

const QIMEN_DOORS_TO_TRIGRAMS = Object.freeze({
  休: "kan",
  生: "gen",
  傷: "zhen",
  杜: "xun",
  景: "li",
  死: "kun",
  驚: "dui",
  開: "qian",
});

const QIMEN_PALACES_TO_TRIGRAMS = Object.freeze({
  kan: "kan",
  gen: "gen",
  zhen: "zhen",
  xun: "xun",
  li: "li",
  kun: "kun",
  dui: "dui",
  qian: "qian",
});

const HEXAGRAM_DEFINITIONS = Object.freeze([
  ["qian", "qian", "乾為天"], ["kun", "kun", "坤為地"], ["kan", "zhen", "水雷屯"], ["gen", "kan", "山水蒙"],
  ["kan", "qian", "水天需"], ["qian", "kan", "天水訟"], ["kun", "kan", "地水師"], ["kan", "kun", "水地比"],
  ["xun", "qian", "風天小畜"], ["qian", "dui", "天澤履"], ["kun", "qian", "地天泰"], ["qian", "kun", "天地否"],
  ["qian", "li", "天火同人"], ["li", "qian", "火天大有"], ["kun", "gen", "地山謙"], ["zhen", "kun", "雷地豫"],
  ["dui", "zhen", "澤雷隨"], ["gen", "xun", "山風蠱"], ["kun", "dui", "地澤臨"], ["xun", "kun", "風地觀"],
  ["li", "zhen", "火雷噬嗑"], ["gen", "li", "山火賁"], ["gen", "kun", "山地剝"], ["kun", "zhen", "地雷復"],
  ["qian", "zhen", "天雷無妄"], ["gen", "qian", "山天大畜"], ["gen", "zhen", "山雷頤"], ["dui", "xun", "澤風大過"],
  ["kan", "kan", "坎為水"], ["li", "li", "離為火"], ["dui", "gen", "澤山咸"], ["zhen", "xun", "雷風恆"],
  ["qian", "gen", "天山遯"], ["zhen", "qian", "雷天大壯"], ["li", "kun", "火地晉"], ["kun", "li", "地火明夷"],
  ["xun", "li", "風火家人"], ["li", "dui", "火澤睽"], ["kan", "gen", "水山蹇"], ["zhen", "kan", "雷水解"],
  ["gen", "dui", "山澤損"], ["xun", "zhen", "風雷益"], ["dui", "qian", "澤天夬"], ["qian", "xun", "天風姤"],
  ["dui", "kun", "澤地萃"], ["kun", "xun", "地風升"], ["dui", "kan", "澤水困"], ["kan", "xun", "水風井"],
  ["dui", "li", "澤火革"], ["li", "xun", "火風鼎"], ["zhen", "zhen", "震為雷"], ["gen", "gen", "艮為山"],
  ["xun", "gen", "風山漸"], ["zhen", "dui", "雷澤歸妹"], ["zhen", "li", "雷火豐"], ["li", "gen", "火山旅"],
  ["xun", "xun", "巽為風"], ["dui", "dui", "兌為澤"], ["xun", "kan", "風水渙"], ["kan", "dui", "水澤節"],
  ["xun", "dui", "風澤中孚"], ["zhen", "gen", "雷山小過"], ["kan", "li", "水火既濟"], ["li", "kan", "火水未濟"],
].map(([upperTrigramKey, lowerTrigramKey, name], index) => Object.freeze({
  index: index + 1,
  upperTrigramKey,
  lowerTrigramKey,
  name,
  symbol: String.fromCodePoint(0x4DC0 + index),
})));

const HEXAGRAMS_BY_TRIGRAMS = new Map(
  HEXAGRAM_DEFINITIONS.map((hexagram) => [`${hexagram.upperTrigramKey}:${hexagram.lowerTrigramKey}`, hexagram])
);

export function getTrigramByQimenStar(starName) {
  return getTrigramByKey(QIMEN_STARS_TO_TRIGRAMS[normalizeQimenStarName(starName)]);
}

export function getTrigramByQimenDoor(doorName) {
  return getTrigramByKey(QIMEN_DOORS_TO_TRIGRAMS[normalizeQimenDoorName(doorName)]);
}

export function getTrigramByQimenPalaceKey(palaceKey) {
  return getTrigramByKey(QIMEN_PALACES_TO_TRIGRAMS[palaceKey]);
}

export function getHexagramByTrigrams(upperTrigramKey, lowerTrigramKey) {
  if (!TRIGRAMS[upperTrigramKey] || !TRIGRAMS[lowerTrigramKey]) {
    return null;
  }

  return HEXAGRAMS_BY_TRIGRAMS.get(`${upperTrigramKey}:${lowerTrigramKey}`) ?? null;
}

export function formatHexagramLabel(hexagram) {
  if (!hexagram?.name) {
    return "";
  }

  return hexagram.symbol ? `${hexagram.symbol} ${hexagram.name}` : hexagram.name;
}

function getTrigramByKey(key) {
  return typeof key === "string" ? TRIGRAMS[key] ?? null : null;
}

function normalizeQimenStarName(starName) {
  if (typeof starName !== "string") {
    return "";
  }

  return starName.endsWith("星") ? starName.slice(0, -1) : starName;
}

function normalizeQimenDoorName(doorName) {
  if (typeof doorName !== "string") {
    return "";
  }

  return doorName.endsWith("門") ? doorName.slice(0, -1) : doorName;
}
