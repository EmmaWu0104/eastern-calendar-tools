import { SEXAGENARY_CYCLE } from "./ganzhi.js";
import yangJu1 from "../data/qimen/plates/yang/ju-1.json" with { type: "json" };
import yangJu2 from "../data/qimen/plates/yang/ju-2.json" with { type: "json" };
import yangJu3 from "../data/qimen/plates/yang/ju-3.json" with { type: "json" };
import yangJu4 from "../data/qimen/plates/yang/ju-4.json" with { type: "json" };
import yangJu5 from "../data/qimen/plates/yang/ju-5.json" with { type: "json" };
import yangJu6 from "../data/qimen/plates/yang/ju-6.json" with { type: "json" };
import yangJu7 from "../data/qimen/plates/yang/ju-7.json" with { type: "json" };
import yangJu8 from "../data/qimen/plates/yang/ju-8.json" with { type: "json" };
import yangJu9 from "../data/qimen/plates/yang/ju-9.json" with { type: "json" };
import yinJu1 from "../data/qimen/plates/yin/ju-1.json" with { type: "json" };
import yinJu2 from "../data/qimen/plates/yin/ju-2.json" with { type: "json" };
import yinJu3 from "../data/qimen/plates/yin/ju-3.json" with { type: "json" };
import yinJu4 from "../data/qimen/plates/yin/ju-4.json" with { type: "json" };
import yinJu5 from "../data/qimen/plates/yin/ju-5.json" with { type: "json" };
import yinJu6 from "../data/qimen/plates/yin/ju-6.json" with { type: "json" };
import yinJu7 from "../data/qimen/plates/yin/ju-7.json" with { type: "json" };
import yinJu8 from "../data/qimen/plates/yin/ju-8.json" with { type: "json" };
import yinJu9 from "../data/qimen/plates/yin/ju-9.json" with { type: "json" };

const QIMEN_PLATE_DATA = {
  yang: {
    1: yangJu1,
    2: yangJu2,
    3: yangJu3,
    4: yangJu4,
    5: yangJu5,
    6: yangJu6,
    7: yangJu7,
    8: yangJu8,
    9: yangJu9,
  },
  yin: {
    1: yinJu1,
    2: yinJu2,
    3: yinJu3,
    4: yinJu4,
    5: yinJu5,
    6: yinJu6,
    7: yinJu7,
    8: yinJu8,
    9: yinJu9,
  },
};

const QIMEN_PLATE_MESSAGES = {
  missingData: "盤面資料尚未建立，目前僅顯示定局結果。",
  invalidInput: "奇門盤面查詢參數不完整，暫時無法顯示盤面。",
  loadError: "奇門盤面資料讀取失敗，暫時無法顯示盤面。",
};

const VALID_DUN_TYPES = new Set(["yang", "yin"]);
const VALID_HOUR_PILLARS = new Set(SEXAGENARY_CYCLE);

export function getQimenPlate(input) {
  const { dunType, ju, hourPillar } = input ?? {};
  const lookup = createLookupMetadata({ dunType, ju, hourPillar });

  if (!isValidLookupInput({ dunType, ju, hourPillar })) {
    return createLookupResult({
      found: false,
      status: "invalidInput",
      message: QIMEN_PLATE_MESSAGES.invalidInput,
      meta: null,
      plate: null,
      lookup,
    });
  }

  const plateFile = QIMEN_PLATE_DATA[dunType]?.[ju] ?? null;
  if (!plateFile) {
    return createLookupResult({
      found: false,
      status: "missingFile",
      message: QIMEN_PLATE_MESSAGES.missingData,
      meta: null,
      plate: null,
      lookup,
    });
  }

  if (!plateFile.plates || !Object.hasOwn(plateFile.plates, hourPillar)) {
    return createLookupResult({
      found: false,
      status: "missingPlate",
      message: QIMEN_PLATE_MESSAGES.missingData,
      meta: clonePlainData(plateFile.meta ?? null),
      plate: null,
      lookup,
    });
  }

  const plate = plateFile.plates[hourPillar];
  if (plate === null) {
    return createLookupResult({
      found: false,
      status: "nullPlate",
      message: QIMEN_PLATE_MESSAGES.missingData,
      meta: clonePlainData(plateFile.meta ?? null),
      plate: null,
      lookup,
    });
  }

  return createLookupResult({
    found: true,
    status: "found",
    message: "",
    meta: clonePlainData(plateFile.meta ?? null),
    plate: clonePlainData(plate),
    lookup,
  });
}

function isValidLookupInput({ dunType, ju, hourPillar }) {
  return (
    VALID_DUN_TYPES.has(dunType) &&
    Number.isInteger(ju) &&
    ju >= 1 &&
    ju <= 9 &&
    VALID_HOUR_PILLARS.has(hourPillar)
  );
}

function createLookupMetadata({ dunType, ju, hourPillar }) {
  const canCreateFilePath = VALID_DUN_TYPES.has(dunType) && Number.isInteger(ju) && ju >= 1 && ju <= 9;

  return {
    filePath: canCreateFilePath ? `data/qimen/plates/${dunType}/ju-${ju}.json` : "",
    hourPillar: typeof hourPillar === "string" ? hourPillar : "",
  };
}

function createLookupResult({ found, status, message, meta, plate, lookup }) {
  return {
    found,
    status,
    message,
    meta,
    plate,
    lookup,
  };
}

function clonePlainData(value) {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => clonePlainData(item));
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      return [key, clonePlainData(item)];
    })
  );
}
