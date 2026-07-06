# 45 奇門遁甲 1080 盤面 schema validation 設計

本文件是第 80 包 docs-only validation 設計文件，目標是定義未來如何驗證 1080 盤面 JSON。

本包不實作 validation，不修改 `data/qimen/plates/**`，不填任何 plate object，不修改 `getQimenPlate(...)`，也不做 UI rendering。本包延續第 79 包 `docs/44_奇門遁甲1080盤面object_schema設計.md` 的 schema。

`nullPlate` 仍是合法狀態，代表盤面尚未建立。validation 第一版應先做 schema-level，不急著做內容正確性推導。

## 1. validation 分層

validation 分三層：file-level、plate-level、palace-level。content-level 暫緩。

### 1.1 file-level validation

檢查每個 `ju-{n}.json` 檔案本身：

* JSON 可解析。
* 有 `meta`。
* 有 `plates`。
* `meta.dunType` 與路徑一致。
* `meta.ju` 與檔名一致。
* `plates` 有完整 60 個時柱 key。
* 每個 value 必須是 `null` 或合法 plate object。

### 1.2 plate-level validation

當某個時柱 value 是 object 時，檢查單盤：

* `schemaVersion`
* `hourPillar`
* `palaces`
* `notes`
* `zhiFuStar`
* `zhiShiDoor`
* `xunShou`

### 1.3 palace-level validation

檢查每一宮：

* 9 個固定 palace key
* `palaceName`
* `direction`
* `luoshuNumber`
* 天盤干 / 地盤干 / 八門 / 九星 / 八神欄位型別
* boolean 標記型別
* `notes`

### 1.4 content-level validation 暫緩

八門數量、九星數量、八神數量、值符值使唯一性等屬於 content-level validation。content-level 可能牽涉盤法細節與流派差異，第一版先不做，等 sample plate object 與 UI rendering 穩定後再做。

## 2. 固定常數設計

未來 validation helper 可使用下列常數。

### 2.1 allowed dun types

```js
const QIMEN_DUN_TYPES = ["yang", "yin"];
```

### 2.2 allowed ju numbers

```js
const QIMEN_JU_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
```

### 2.3 expected hour pillars

應使用既有 60 甲子順序。未來可以共用或新增常數，不建議在多處硬編碼不同版本。

完整 60 甲子：

```text
甲子、乙丑、丙寅、丁卯、戊辰、己巳、庚午、辛未、壬申、癸酉、
甲戌、乙亥、丙子、丁丑、戊寅、己卯、庚辰、辛巳、壬午、癸未、
甲申、乙酉、丙戌、丁亥、戊子、己丑、庚寅、辛卯、壬辰、癸巳、
甲午、乙未、丙申、丁酉、戊戌、己亥、庚子、辛丑、壬寅、癸卯、
甲辰、乙巳、丙午、丁未、戊申、己酉、庚戌、辛亥、壬子、癸丑、
甲寅、乙卯、丙辰、丁巳、戊午、己未、庚申、辛酉、壬戌、癸亥
```

### 2.4 expected palace meta

```js
const QIMEN_PALACE_META = {
  kan: { palaceName: "坎", direction: "北", luoshuNumber: 1 },
  kun: { palaceName: "坤", direction: "西南", luoshuNumber: 2 },
  zhen: { palaceName: "震", direction: "東", luoshuNumber: 3 },
  xun: { palaceName: "巽", direction: "東南", luoshuNumber: 4 },
  center: { palaceName: "中", direction: "中", luoshuNumber: 5 },
  qian: { palaceName: "乾", direction: "西北", luoshuNumber: 6 },
  dui: { palaceName: "兌", direction: "西", luoshuNumber: 7 },
  gen: { palaceName: "艮", direction: "東北", luoshuNumber: 8 },
  li: { palaceName: "離", direction: "南", luoshuNumber: 9 },
};
```

### 2.5 expected palace keys

```js
const QIMEN_PALACE_KEYS = [
  "kan",
  "kun",
  "zhen",
  "xun",
  "center",
  "qian",
  "dui",
  "gen",
  "li",
];
```

補充：

* validation 可檢查 key 集合，不必依 object key 順序。
* UI rendering 另用 layout array，不依 object 順序。

## 3. file-level validation 規則

函式設計：

```js
function validateQimenPlateFile(fileData, context) {
  // validate file-level shape and dispatch object plates to plate-level validation
}
```

context 建議：

```js
{
  filePath: "data/qimen/plates/yang/ju-1.json",
  expectedDunType: "yang",
  expectedJu: 1
}
```

回傳格式建議：

```js
{
  ok: true,
  errors: [],
  warnings: []
}
```

錯誤規則：

* `fileData` 不是 object：error
* `meta` 缺失：error
* `plates` 缺失：error
* `meta.dunType` 不等於 expectedDunType：error
* `meta.ju` 不等於 expectedJu：error
* `plates` 不是 object：error
* 少任一 60 甲子 key：error
* 多出未知 key：warning 或 error，建議 error
* 任一 value 不是 null 也不是 object：error

補充：

* 第一版建議多出未知 key 當 error，避免 typo。
* `null` value 合法。
* value 是 object 時，交給 plate-level validation。

## 4. plate-level validation 規則

函式設計：

```js
function validateQimenPlateObject(plate, context) {
  // validate one hour-pillar plate object
}
```

context 建議：

```js
{
  filePath: "data/qimen/plates/yang/ju-1.json",
  hourPillarKey: "甲子"
}
```

錯誤規則：

* plate 不是 object：error
* `schemaVersion` 不是 number：error
* `schemaVersion` 不是 1：warning 或 error，建議 error
* `hourPillar` 缺失：error
* `hourPillar` 不等於 hourPillarKey：error
* `palaces` 缺失：error
* `palaces` 不是 object：error
* `notes` 若存在但不是 array：error
* `zhiFuStar` 若存在但不是 string / null：error
* `zhiShiDoor` 若存在但不是 string / null：error
* `xunShou` 若存在但不是 string / null：error

補充：

* `zhiFuStar` / `zhiShiDoor` 第一版可不強迫存在。
* `palaces` 交給 palace-level validation。
* `notes` array 內每個 item 建議必須是 string。

## 5. palace-level validation 規則

函式設計：

```js
function validateQimenPalaces(palaces, context) {
  // validate nine palace keys and palace-level field types
}
```

錯誤規則：

* 缺任一 9 宮 key：error
* 多出未知宮 key：error
* 每宮 value 不是 object：error
* `palaceName` 不等於固定 mapping：error
* `direction` 不等於固定 mapping：error
* `luoshuNumber` 不等於固定 mapping：error
* `earthStem` 若存在，必須是 string 或 null
* `heavenStem` 若存在，必須是 string 或 null
* `door` 若存在，必須是 string 或 null
* `star` 若存在，必須是 string 或 null
* `deity` 若存在，必須是 string 或 null
* `isEmpty` 若存在，必須是 boolean
* `isHorse` 若存在，必須是 boolean
* `isZhiFuPalace` 若存在，必須是 boolean
* `isZhiShiPalace` 若存在，必須是 boolean
* `notes` 若存在，必須是 string[]

補充：

* 第一版不檢查八門 / 九星 / 八神的合法文字集合。
* 因為名稱細節可能需要等資料來源確定。
* 第一版只檢查型別與九宮 meta 一致性。

## 6. 錯誤訊息格式

建議錯誤 object：

```js
{
  level: "error",
  code: "MISSING_HOUR_PILLAR",
  path: "data/qimen/plates/yang/ju-1.json#plates.甲子",
  message: "缺少時柱 key：甲子"
}
```

欄位：

| 欄位 | 說明 |
|---|---|
| `level` | error / warning |
| `code` | 穩定錯誤代碼 |
| `path` | 檔案與 JSON path |
| `message` | 中文可讀訊息 |

建議代碼：

* `INVALID_FILE_OBJECT`
* `MISSING_META`
* `MISSING_PLATES`
* `DUN_TYPE_MISMATCH`
* `JU_MISMATCH`
* `MISSING_HOUR_PILLAR`
* `UNKNOWN_HOUR_PILLAR`
* `INVALID_PLATE_VALUE`
* `INVALID_SCHEMA_VERSION`
* `HOUR_PILLAR_MISMATCH`
* `MISSING_PALACES`
* `MISSING_PALACE`
* `UNKNOWN_PALACE`
* `PALACE_META_MISMATCH`
* `INVALID_FIELD_TYPE`
* `INVALID_NOTES`

## 7. validation runner 設計

未來 runner：

```js
function validateAllQimenPlateFiles() {
  // validate all 18 qimen plate files and aggregate diagnostics
}
```

流程：

1. 載入 18 個 plate JSON。
2. 依路徑解析 expectedDunType / expectedJu。
3. 對每檔執行 file-level validation。
4. file-level 發現 object plate 時，執行 plate-level / palace-level validation。
5. 彙整 errors / warnings。
6. 若有 errors，測試 fail。
7. warnings 可先列出但不 fail；第一版建議 errors fail、warnings 不 fail。

補充：

* 目前 plate 全是 null，validation 應該通過。
* 若將來填入 object，才會驗 object schema。
* validation 不計算盤面正確性。
* validation 不依賴 DOM。
* validation 不依賴 main.js。

## 8. 測試規劃

未來第 81 包若實作 validation，建議加測。

### 8.1 current skeleton passes

* 18 個 plate JSON
* 全部 60 key 存在
* value 全 null
* validation 通過

### 8.2 missing hour key fails

建立人工 fixture：

* 少一個 hourPillar key
* 預期 error `MISSING_HOUR_PILLAR`

### 8.3 unknown hour key fails

建立人工 fixture：

* 多一個未知 key
* 預期 error `UNKNOWN_HOUR_PILLAR`

### 8.4 invalid meta fails

建立人工 fixture：

* expected yang / ju-1
* meta 寫 yin 或 ju 2
* 預期 `DUN_TYPE_MISMATCH` / `JU_MISMATCH`

### 8.5 valid minimal object passes

建立人工 fixture：

* 一個合法 plate object
* 9 宮完整
* schemaVersion 1
* hourPillar matching
* validation 通過

### 8.6 invalid palace meta fails

建立人工 fixture：

* `kan.palaceName` 寫錯
* 預期 `PALACE_META_MISMATCH`

### 8.7 invalid field type fails

建立人工 fixture：

* `isEmpty: "false"`
* 預期 `INVALID_FIELD_TYPE`

補充：

* fixture 可先放在測試程式內，不一定新增 data 檔。
* 不要為測試改正式 plate JSON。
* 不要把 invalid fixture 寫進正式 data/qimen/plates。

## 9. 與 getQimenPlate 的關係

* validation helper 不應被 `getQimenPlate(...)` 每次呼叫。
* `getQimenPlate(...)` 應保持輕量 lookup。
* validation 應主要在 test / build-time 執行。
* 若未來需要 runtime safety，可在 `getQimenPlate(...)` found branch 加非常輕量的防護，但不建議第一版加入。
* 第一版 validation 不改 `getQimenPlate(...)`。

## 10. 與 UI rendering 的關係

* UI rendering 可假設通過 validation 的 plate object 結構穩定。
* 若 plate object 有局部缺漏，UI 仍應 graceful fallback。
* validation 不負責排版。
* UI 不應顯示 validation errors，除非未來新增 debug mode。
* 一般使用者只看到盤面或 fallback。

## 11. 目前不處理項目

* 不實作 validation helper。
* 不新增 tests。
* 不修改 `tests/run-tests.js`。
* 不修改正式 plate JSON。
* 不填 sample plate object。
* 不檢查八門 / 九星 / 八神內容正確性。
* 不檢查盤面推導正確性。
* 不做 UI rendering。
* 不做 runtime validation。
* 不做 method switch。
* 不做拆補法、茅山法、無閏法。
* 不加入真太陽時。

## 12. 後續建議

建議下一步：

1. 第 81 包：實作 minimal schema validation helper / tests。
2. 第 82 包：填入一筆 sample plate object。
3. 第 83 包：UI rendering found plate 設計文件。
4. 第 84 包：實作 found plate minimal rendering。
5. 後續才規劃完整 1080 plate data。

補充：

* 第 81 包應保持只做 validation helper / tests。
* 第 81 包不應填任何正式 plate object。
* 第 82 包才填一筆 sample。
* 不建議 validation、sample data、UI rendering 同包完成。

## 13. 本文件結論

* validation 第一版應以 schema-level 為主。
* 目前 null skeleton 應通過 validation。
* 未來 object plate 應檢查 hourPillar、schemaVersion、palaces 與九宮 meta。
* content-level validation 暫緩。
* validation 應在 test / build-time 執行，不放進一般 lookup flow。
* 下一步可實作 minimal validation helper / tests。
