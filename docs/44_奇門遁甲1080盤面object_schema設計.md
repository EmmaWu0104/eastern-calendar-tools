# 44 奇門遁甲 1080 盤面 object schema 設計

本文件是第 79 包 docs-only schema 設計文件，目標是定義未來 1080 盤面 JSON 的 plate object 結構。

本包不填盤面資料，不修改 `data/qimen/plates/**`，不修改 `getQimenPlate(...)`，不實作 UI rendering，也不加入拆補法、茅山法、無閏法或 method switch。本專案第一版仍只處理傳統置閏法。

目前 plate JSON 仍是 skeleton / null plates。`nullPlate` 仍是合法狀態，代表盤面尚未建立。

## 1. 目前資料狀態

目前 1080 plate 檔案位置：

```text
data/qimen/plates/{dunType}/ju-{ju}.json
```

目前已有 18 個檔案：

* `data/qimen/plates/yang/ju-1.json` ～ `ju-9.json`
* `data/qimen/plates/yin/ju-1.json` ～ `ju-9.json`

每個檔案包含：

* `meta`
* `plates`

目前 `plates` 內有 60 個時柱 key：

* 甲子
* 乙丑
* ...
* 癸亥

目前每個 value 都是 `null`。

補充：

* `null` 表示該盤尚未填入。
* `null` 不是錯誤。
* 目前 `getQimenPlate(...)` 會回 `nullPlate`。
* 本文件設計的是未來將 `null` 替換成 object 時的資料結構。

## 2. schema 設計原則

### 2.1 一盤一 object

每一個 hourPillar key 對應一個完整 plate object。

範例：

```json
{
  "甲子": {
    "schemaVersion": 1,
    "palaces": {}
  }
}
```

### 2.2 不重複存放可由檔案 meta 得到的資訊

plate file 已有：

* `dunType`
* `dunName`
* `ju`

所以單一 plate object 原則上不重複存：

* `dunType`
* `dunName`
* `ju`

但可視需要保留 `hourPillar`，方便人工檢查與單盤抽出。

### 2.3 以九宮為核心

plate object 的主體應是九宮資料：

* 坎
* 艮
* 震
* 巽
* 離
* 坤
* 兌
* 乾
* 中

請使用穩定 key，不要用中文宮名當唯一程式 key。

建議 key：

* `kan`
* `gen`
* `zhen`
* `xun`
* `li`
* `kun`
* `dui`
* `qian`
* `center`

### 2.4 中文顯示資料可放在 value 中

每個 palace object 可含：

* `palaceName`
* `direction`
* `luoshuNumber`

這樣 UI 顯示時不必另外查 mapping。

### 2.5 第一版先支援資料承載，不急著斷語

第一版 schema 先承載排盤結果，不急著放完整吉凶斷語。

可先包含：

* 天盤干
* 地盤干
* 八門
* 九星
* 八神
* 天禽 / 寄宮相關標記
* 空亡 / 馬星 / 直符 / 直使等可選標記

但不急著放：

* 大量斷語
* 宜忌
* 格局全集
* 流派差異說明

## 3. 建議 plate object 頂層結構

建議結構：

```json
{
  "schemaVersion": 1,
  "hourPillar": "甲子",
  "zhiFuStar": "蓬",
  "zhiShiDoor": "休",
  "xunShou": "甲子戊",
  "notes": [],
  "palaces": {
    "kan": {},
    "gen": {},
    "zhen": {},
    "xun": {},
    "li": {},
    "kun": {},
    "dui": {},
    "qian": {},
    "center": {}
  }
}
```

欄位說明：

| 欄位 | 型別 | 必要 | 說明 |
|---|---|---|---|
| `schemaVersion` | number | 是 | 單盤 schema 版本 |
| `hourPillar` | string | 是 | 此盤對應時柱 |
| `zhiFuStar` | string | 建議 | 直符星 |
| `zhiShiDoor` | string | 建議 | 直使門 |
| `xunShou` | string | 可選 | 旬首 |
| `notes` | string[] | 可選 | 人工備註 |
| `palaces` | object | 是 | 九宮資料 |

補充：

* `hourPillar` 應與 plates key 相同。
* `schemaVersion` 方便未來 migration。
* `notes` 初期可留空陣列。

## 4. palace object schema

每一宮的建議結構：

```json
{
  "palaceName": "坎",
  "direction": "北",
  "luoshuNumber": 1,
  "earthStem": "戊",
  "heavenStem": "丙",
  "door": "休",
  "star": "天蓬",
  "deity": "直符",
  "isEmpty": false,
  "isHorse": false,
  "isZhiFuPalace": true,
  "isZhiShiPalace": false,
  "notes": []
}
```

欄位說明：

| 欄位 | 型別 | 必要 | 說明 |
|---|---|---|---|
| `palaceName` | string | 是 | 中文宮名 |
| `direction` | string | 是 | 方位 |
| `luoshuNumber` | number | 是 | 洛書數 |
| `earthStem` | string / null | 建議 | 地盤干 |
| `heavenStem` | string / null | 建議 | 天盤干 |
| `door` | string / null | 建議 | 八門 |
| `star` | string / null | 建議 | 九星 |
| `deity` | string / null | 建議 | 八神 |
| `isEmpty` | boolean | 可選 | 空亡標記 |
| `isHorse` | boolean | 可選 | 馬星標記 |
| `isZhiFuPalace` | boolean | 可選 | 直符所在宮 |
| `isZhiShiPalace` | boolean | 可選 | 直使所在宮 |
| `notes` | string[] | 可選 | 該宮備註 |

補充：

* `center` 中宮可能沒有門，`door` 可為 null。
* 某些盤法中天禽 / 中宮寄宮處理可能需要 notes 或額外欄位。
* 第一版不強迫每一欄都有值，但 key 應穩定。

## 5. 九宮 key 與固定 meta

固定 mapping：

| key | palaceName | direction | luoshuNumber |
|---|---|---|---|
| `kan` | 坎 | 北 | 1 |
| `kun` | 坤 | 西南 | 2 |
| `zhen` | 震 | 東 | 3 |
| `xun` | 巽 | 東南 | 4 |
| `center` | 中 | 中 | 5 |
| `qian` | 乾 | 西北 | 6 |
| `dui` | 兌 | 西 | 7 |
| `gen` | 艮 | 東北 | 8 |
| `li` | 離 | 南 | 9 |

補充：

* UI layout 可使用既有九宮順序：
  * 巽、離、坤
  * 震、中、兌
  * 艮、坎、乾
* schema key 不一定等於 UI 排列順序。
* UI rendering 應使用 layout array 排列，不依 object key 順序。

## 6. 完整範例

以下只是 schema 範例，不是正式奇門盤資料，不可直接填入 data JSON 作為真實盤。內容只示範欄位形狀。

```json
{
  "schemaVersion": 1,
  "hourPillar": "甲子",
  "zhiFuStar": "天蓬",
  "zhiShiDoor": "休",
  "xunShou": "甲子戊",
  "notes": ["此為 schema 示意，不代表正式盤面。"],
  "palaces": {
    "kan": {
      "palaceName": "坎",
      "direction": "北",
      "luoshuNumber": 1,
      "earthStem": "戊",
      "heavenStem": "丙",
      "door": "休",
      "star": "天蓬",
      "deity": "直符",
      "isEmpty": false,
      "isHorse": false,
      "isZhiFuPalace": true,
      "isZhiShiPalace": true,
      "notes": []
    },
    "gen": {
      "palaceName": "艮",
      "direction": "東北",
      "luoshuNumber": 8,
      "earthStem": null,
      "heavenStem": null,
      "door": null,
      "star": null,
      "deity": null,
      "isEmpty": false,
      "isHorse": false,
      "isZhiFuPalace": false,
      "isZhiShiPalace": false,
      "notes": []
    }
  }
}
```

範例中只列部分宮位也可以，但正式 plate object 應包含 9 宮。

## 7. 與 getQimenPlate 的關係

目前 `getQimenPlate(...)`：

* 若 plate value 是 null，回 `nullPlate`
* 若 plate value 是 object，未來會回：
  * `found: true`
  * `status: "found"`
  * `plate` 為 clone 後 object

本 schema 設計完成後，未來只要某一個 hourPillar value 從 null 改成 object，現有 `getQimenPlate(...)` 的 found branch 就可開始工作。

補充：

* 本包不修改 `getQimenPlate(...)`。
* 未來若需要更嚴格 validation，可另包新增。
* `getQimenPlate(...)` 不應計算盤面，只讀取資料。

## 8. 與 UI rendering 的關係

未來 UI rendering 可依：

```text
plate.palaces
```

渲染九宮盤。

建議 UI rendering 使用固定 layout：

```js
[
  ["xun", "li", "kun"],
  ["zhen", "center", "dui"],
  ["gen", "kan", "qian"]
]
```

每宮可顯示：

* 宮名 / 洛書數
* 方位
* 天盤干
* 地盤干
* 八門
* 九星
* 八神
* 空亡 / 馬星 / 直符 / 直使標記

補充：

* UI rendering 不應依 object key 順序。
* UI rendering 不應回寫 plate data。
* 若 plate 缺某宮，UI 應 fallback 顯示該宮資料不完整，而不是讓整個奇門區塊壞掉。

## 9. validation 建議

未來若填入真實 plate object，建議新增 validation。

### 9.1 file-level validation

每個 `ju-{n}.json` 檔案：

* `meta.dunType` 與路徑一致
* `meta.ju` 與檔名一致
* `plates` 有 60 個 hourPillar key
* 每個 value 是 null 或合法 plate object

### 9.2 plate-level validation

若 value 是 object：

* `schemaVersion` 是 number
* `hourPillar` 與 key 一致
* `palaces` 有 9 宮 key
* 每宮 palaceName / direction / luoshuNumber 與固定 mapping 一致
* `notes` 若存在必須是 array
* boolean 欄位若存在必須是 boolean

### 9.3 content-level validation

未來可選：

* 八門數量檢查
* 九星數量檢查
* 八神數量檢查
* 直符 / 直使標記唯一性
* 天盤干 / 地盤干格式檢查
* 空亡 / 馬星標記檢查

補充：

* content-level validation 可能涉及流派與排盤細節，建議稍後再做。
* 初期先做 schema-level validation。

## 10. 資料填寫策略建議

未來不要一次手填 1080 盤。

建議順序：

1. 先選一個最小 sample：
   * 例如 `yang/ju-1.json` 的 `甲子`
2. 填入一個完整 plate object。
3. 新增 validation test。
4. 修改 UI rendering 支援 found plate。
5. 人工確認畫面。
6. 再決定是否批次填入更多盤。
7. 最後才考慮 1080 全量資料。

補充：

* 不建議下一包直接填完整 1080 盤。
* 不建議沒有 validation 就大量填資料。
* 不建議 schema 還沒定稿就做 rendering。
* 不建議把資料填寫與 UI rendering 放同一包。

## 11. 目前不處理項目

* 不填入 1080 盤面資料。
* 不改 `data/qimen/plates/**`。
* 不改 `getQimenPlate(...)`。
* 不做 UI rendering。
* 不做 validation 實作。
* 不做 method switch。
* 不做拆補法、茅山法、無閏法。
* 不加入真太陽時。
* 不加入斷語 / 格局 / 吉凶全集。

## 12. 後續建議

建議下一步：

1. 第 80 包：plate object schema validation 設計文件。
2. 第 81 包：實作 minimal schema validation helper / tests。
3. 第 82 包：填入一筆 sample plate object。
4. 第 83 包：UI rendering found plate 設計文件。
5. 第 84 包：實作 found plate minimal rendering。
6. 後續再規劃大量 1080 plate data 來源與填寫流程。

也可以選擇：

* 暫停奇門盤面資料，先做其它模組。
* 先做人工驗收 / 文件整理。

## 13. 本文件結論

* 未來 plate object 應以九宮資料為核心。
* 每一個 hourPillar key 可由 null 漸進替換成 object。
* `getQimenPlate(...)` 現有 found branch 可承接 object。
* 第一版 schema 應先穩定 key 與欄位，不急著放斷語。
* 下一步不建議直接填 1080 盤。
* 建議先做 validation 設計，再填最小 sample。
