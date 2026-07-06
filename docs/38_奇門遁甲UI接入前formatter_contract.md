# 38 奇門遁甲 UI 接入前 formatter contract

本文件是第 67 包 docs-only contract 文件，目標是定義 UI 接 full cycle draft formatter 前的資料契約。

目前建議 UI 後續接 `resolveQimenJuFromFullTermCycleDraft(...)`，而不是直接接 `resolveQimenJu()`。本包不實作 UI、不實作盤面 lookup、不修改 resolver / formatter / tests、不改 1080 盤面 JSON、不加入手動覆寫，也不加入拆補法、茅山法、無閏法或 method switch。

## 1. UI 資料來源定位

### 1.1 建議 UI 使用的 formatter

建議未來 UI 使用：

```js
resolveQimenJuFromFullTermCycleDraft(dateTimeText)
```

理由：

* 目前已改用 cache。
* 已通過 2024～2030 regression。
* 已通過 69 duplicate boundary regression。
* 已通過 1899～2101 full range diagnostics。
* 可涵蓋 1899～2101 主要節氣資料範圍。
* 回傳欄位接近 UI 所需的定局資訊。

### 1.2 目前不建議 UI 直接使用

暫不建議 UI 直接使用：

```js
resolveQimenJu(dateTimeText)
```

理由：

* 這是初版 resolver 主線。
* 目前使用 `INITIAL_QIMEN_TIMELINE`。
* 覆蓋範圍主要是 2027 fixture / 初版驗證資料。
* 尚未切到 full cycle draft。
* 保留作為 baseline / 舊主線，不應直接混入新 UI 判斷。

### 1.3 目前仍未處理

* UI 尚未接 formatter。
* 盤面 lookup 尚未接。
* 手動覆寫尚未接。
* `resolveQimenJu()` 主線尚未 replacement。
* 1080 plates 仍是 skeleton / null。

## 2. formatter 回傳欄位 contract

`resolveQimenJuFromFullTermCycleDraft(dateTimeText)` 的穩定回傳欄位建議如下：

| 欄位 | 型別 | UI 用途 | 是否建議顯示 | 備註 |
| -- | -- | -- | -- | -- |
| `actualSolarTerm` | string | 實際節氣 | 可選顯示 | 用於說明超神 / 接氣 / 置閏後接氣 |
| `qimenSolarTerm` | string | 奇門節氣 | 建議顯示 | 定局核心欄位 |
| `status` | string | 狀態 | 建議顯示 | 可能值：正常、超神、接氣、置閏、置閏後接氣 |
| `yuan` | string | 元別 | 建議顯示 | 上元 / 中元 / 下元 |
| `dunType` | string | 程式用遁別 | 不建議直接顯示 | `yang` / `yin` |
| `dunName` | string | 中文遁別 | 建議顯示 | 陽遁 / 陰遁 |
| `ju` | number | 局數 | 建議顯示 | 1～9 |
| `hourPillar` | string | 時柱 | 建議顯示 | 後續盤面 lookup 使用 |
| `isIntercalary` | boolean | 是否置閏 | 可選顯示 | 可用於顯示 badge |
| `notes` | string[] | 補充說明 | 有內容才顯示 | 置閏時會有 notes |
| `lookup` | object | debug / metadata | 預設不顯示 | 可於開發模式或 debug 模式顯示 |

`lookup` 內部欄位：

| lookup 欄位 | 型別 | 用途 | UI 顯示建議 |
| -- | -- | -- | -- |
| `strategy` | string | 查詢策略 | debug only |
| `queryEffectiveDayStart` | string | 奇門有效日 23:00 起點 | debug only 或進階資訊 |
| `selectedYear` | number | 命中的 cycle year | debug only 或進階資訊 |
| `candidateYears` | number[] | 嘗試年份 | debug only |

## 3. 建議 UI 顯示欄位

### 3.1 基本定局資訊

第一版 UI 建議顯示：

```text
奇門節氣：冬至
元別：上元
遁別：陽遁
局數：一局
時柱：丙午
狀態：正常
```

* `qimenSolarTerm` 顯示為奇門節氣。
* `yuan` 顯示為元別。
* `dunName` 顯示為遁別。
* `ju` 建議顯示為中文或數字皆可；第一版可顯示 `一局`～`九局`。
* `hourPillar` 顯示時柱。
* `status` 顯示狀態。

### 3.2 實際節氣與奇門節氣不同時

當 `actualSolarTerm !== qimenSolarTerm` 時，可顯示補充：

```text
實際節氣：冬至
奇門節氣：大雪
狀態：置閏後接氣
```

這對超神 / 接氣 / 置閏後接氣很重要。若兩者相同，可以只顯示奇門節氣，避免畫面太擠。

### 3.3 置閏 badge

當 `isIntercalary === true` 時，可顯示：

```text
置閏
```

或：

```text
閏大雪
```

建議第一版用：

```text
置閏
```

若要更清楚，再搭配 `qimenSolarTerm` 顯示為：

```text
奇門節氣：大雪（置閏）
```

### 3.4 notes 顯示

當 `notes.length > 0` 時顯示補充說明。

第一版可顯示：

```text
備註：查詢時間落在 full cycle draft 置閏 timeline 內。
```

若 `notes.length === 0`，不顯示備註區。

## 4. UI 不建議預設顯示欄位

* `dunType`：內部程式值，UI 顯示 `dunName` 即可。
* `lookup.strategy`：debug metadata。
* `lookup.candidateYears`：debug metadata。
* cache stats：不應顯示於一般 UI。
* `selectedYear`：預設不顯示，但可作為進階 / debug 資訊。
* `queryEffectiveDayStart`：預設不顯示，但可作為進階 / debug 資訊。

若未來需要「進階資訊」區塊，可以再顯示 `selectedYear` / `queryEffectiveDayStart`。第一版主畫面應保持簡潔。

## 5. 錯誤與 fallback contract

### 5.1 formatter 查詢錯誤

若 `resolveQimenJuFromFullTermCycleDraft(...)` 丟出錯誤，例如超出資料範圍，建議 UI 顯示：

```text
奇門遁甲資料目前無法查詢此時間。
```

詳細錯誤可只在 console / debug 顯示。

### 5.2 盤面尚未建立

目前 1080 盤面 JSON 仍是 skeleton / null plates。

若定局成功，但盤面查不到或為 null，建議 UI 顯示：

```text
盤面資料尚未建立，目前僅顯示定局結果。
```

定局成功不等於盤面資料已完成。缺盤不應讓整個奇門區塊失敗，盤面 lookup 應該是定局後的下一層 fallback。

### 5.3 notes / status fallback

若 `status` 是未知值，UI 可直接顯示原字串，不要硬轉譯。

若 `notes` 不是陣列，UI 可視為空陣列處理。

## 6. 手動覆寫遁別 / 局數邊界

手動覆寫不是 resolver replacement。

手動覆寫應該在 UI / 盤面查表層處理：

```text
自動定局：陽遁一局
手動覆寫：陰遁九局
```

資料邊界：

* resolver 原始結果不被修改。
* 自動結果仍保留：
  * `autoDunType`
  * `autoDunName`
  * `autoJu`
* UI 可另外產生 manual result：
  * `manualDunType`
  * `manualDunName`
  * `manualJu`
* 盤面 lookup 若有 manual override，使用 manual `dunType` / `ju` 查盤。
* 定局資訊仍應可顯示自動結果。
* 不要把手動覆寫解讀成拆補法、茅山法、無閏法或 method switch。

未來資料結構建議：

```js
{
  auto: {
    dunType: "yang",
    dunName: "陽遁",
    ju: 1
  },
  manual: {
    enabled: true,
    dunType: "yin",
    dunName: "陰遁",
    ju: 9
  },
  effectiveForPlateLookup: {
    dunType: "yin",
    dunName: "陰遁",
    ju: 9
  }
}
```

## 7. plate lookup 前置 contract

未來盤面 lookup 建議使用 formatter 結果中的：

* `dunType`
* `ju`
* `hourPillar`

查詢：

```js
getQimenPlate({
  dunType,
  ju,
  hourPillar,
})
```

若有 manual override：

* `dunType` / `ju` 使用 manual effective value。
* `hourPillar` 仍使用 formatter 的 `hourPillar`。
* 不回寫 formatter 原始結果。

第一版 plates 仍是 skeleton / null。plate lookup 應回傳狀態：

* `found`
* `missing`
* `nullPlate`
* `invalidInput`

`nullPlate` 不應視為 formatter 失敗。

## 8. 建議 UI 區塊

1. 奇門定局摘要
   * 奇門節氣
   * 元別
   * 遁別
   * 局數
   * 時柱
   * 狀態
2. 補充資訊
   * 實際節氣不同時顯示
   * notes 有內容時顯示
   * 置閏 badge
3. 盤面區
   * 有盤面：顯示盤面
   * 無盤面：顯示 fallback
4. 進階 / debug 區，第一版可不做
   * `selectedYear`
   * `queryEffectiveDayStart`
   * `candidateYears`

## 9. 後續建議

建議下一步：

1. 第 68 包：1080 盤面 lookup 設計文件。
2. 第 69 包：實作 qimen plate lookup helper + fallback tests。
3. 第 70 包：文件補充 plate lookup 實作結果。
4. 第 71 包：UI 接入設計文件。
5. 第 72 包之後：實作前端奇門區塊。

不建議未設計 plate lookup 前直接接 UI。不建議把手動覆寫與 resolver 混在一起。不建議把 `resolveQimenJu()` 主線 replacement 與 UI 接入混在同一包。

UI 第一版可以先顯示定局結果 + 缺盤 fallback。

## 10. 本文件結論

* UI 建議接 `resolveQimenJuFromFullTermCycleDraft(...)`。
* 第一版 UI 只需要穩定顯示定局資訊。
* lookup metadata 預設不顯示。
* notes 有內容才顯示。
* 盤面缺資料要 fallback，不應造成整個奇門區塊失敗。
* 手動覆寫屬於 UI / 盤面查表層，不應回寫 resolver。
* 下一步建議先做 plate lookup 設計，再接 UI。
