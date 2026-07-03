# 35 奇門遁甲 formatter / lookup cache 設計草案

## 1. 本文件定位

本文件是第 50 包 docs-only 設計草案。目前不實作 cache，不改 resolver 主線，目標是為後續 1899～2101 full range formatter diagnostics 與未來正式 resolver replacement 做效能設計準備。

目前已完成：

- full cycle draft timeline
- multi-year diagnostics
- lookup strategy
- read-only resolver formatter
- 2024～2030 formatter regression
- 69 組 duplicate boundary formatter regression

但尚未做：

- 1899～2101 full range formatter diagnostics
- cache
- resolver 主線替換
- UI 接入

## 2. 目前 lookup / formatter 流程

目前流程：

```text
resolveQimenJuFromFullTermCycleDraft(dateTimeText)
-> findQimenFullTermCycleTimelineDraftEntry(dateTimeText)
-> getQimenEffectiveDayStart(dateTimeText)
-> candidateYear / candidateYear - 1 / candidateYear + 1
-> buildQimenFullTermCycleTimelineDraftForYear(year)
-> selected draft entry
-> getQimenYuanJu(...)
-> getHourPillar(...)
-> resolveQimenStatus(...)
-> resolver-like result + lookup metadata
```

目前效能風險：

- 每次查詢可能建置 1～3 個 yearDraft。
- 每個 yearDraft 都會重新做年度窗口分析、seeds、timeline。
- duplicate boundary 或 full range diagnostics 會大量重複查詢相近年份。
- 若 1899～2101 full range formatter diagnostics 直接暴力跑，可能會重複產生大量相同 yearDraft。
- 目前測試已可通過，但未做 cache 時不適合把 formatter 當作高頻查詢主線。

## 3. cache 設計目標

- 避免同一 year 重複 build `buildQimenFullTermCycleTimelineDraftForYear(year)`。
- 保持 read-only，不修改 timeline entry。
- 不改變 lookup 結果。
- 不改變 `selectedYear` / `candidateYears` 行為。
- 不污染測試。
- 不讓 cache 影響不同 options 的結果。
- 支援未來 full range diagnostics。
- 支援未來 UI 單次查詢與多次查詢。

## 4. cache 候選方案

### 4.1 模組層 Map cache

概念：

```js
const qimenFullTermCycleDraftCache = new Map();

function getCachedQimenFullTermCycleTimelineDraftForYear(year, options = {}) {
  const cacheKey = createCacheKey(year, options);
  if (!qimenFullTermCycleDraftCache.has(cacheKey)) {
    qimenFullTermCycleDraftCache.set(
      cacheKey,
      buildQimenFullTermCycleTimelineDraftForYear(year, options)
    );
  }
  return qimenFullTermCycleDraftCache.get(cacheKey);
}
```

優點：

- 實作簡單。
- 對單頁 app 很有效。
- full range diagnostics 可大幅減少重複 build。

缺點 / 風險：

- 需要處理 options cache key。
- 需要避免外部 mutation 污染 cache。
- 測試中若共享 mutable object，可能有污染風險。
- 若未來支援不同 method / startTerm，需要 cache key 擴充。

### 4.2 呼叫層 context cache

概念：

```js
const context = createQimenDraftLookupContext();

resolveQimenJuFromFullTermCycleDraft(dateTimeText, { context });
```

優點：

- cache 生命週期清楚。
- 測試與 full range diagnostics 可自行建立 context。
- 不容易跨測試污染。
- 適合 batch diagnostics。

缺點：

- API 變複雜。
- UI 單次查詢要管理 context。
- 目前 options 結構需要設計清楚。

### 4.3 預建 multi-year timeline window cache

概念：

- 一次建立某個年份範圍的 `buildQimenMultiYearFullTermCycleTimelineDraft({ startYear, endYear })`
- lookup 時在範圍內查找。
- 可用於 full range diagnostics。

優點：

- 適合 1899～2101 full range diagnostics。
- 可以避免每筆查詢重建候選年份。
- 可集中分析 gaps / overlaps / duplicates。

缺點：

- duplicate start 不可直接全域 dedupe 後查詢，仍需保留 yearDraft 語意。
- 記憶體較高。
- 查詢策略要避免回到「全域 dedupe 保留錯誤 entry」問題。
- 目前 cycle-year strategy 是先選 yearDraft，不是全域合併查找。

## 5. 建議採用方向

短期建議：

- 先不要做全域 deduped timeline cache。
- 優先採用「模組層 Map cache」或「呼叫層 context cache」快取 per-year draft。
- 第一步可先做 read-only internal helper：
  - `getQimenFullTermCycleTimelineDraftForYearCached(year, options = {})`
- 但正式實作前，先決定 cache 是否 module-level 或 context-level。

較安全的實作順序：

1. docs-only 設計。
2. 新增 cache helper，但不接正式 formatter。
3. 新增測試證明 cached 與 non-cached 結果一致。
4. 讓 formatter 透過 cache helper 查詢。
5. 跑 2024～2030 regression。
6. 跑 69 duplicate boundary regression。
7. 再做 1899～2101 full range formatter diagnostics。

不可因 cache 改變 lookup 行為。cache 只應改善效能。若 cache 引入 mutation 風險，應 clone 回傳或 freeze cache 內容。

## 6. cache key 設計

cache key 應考慮：

- year
- startTerm
- beforeStartEffectiveDays
- afterEndEffectiveDays
- strategy 是否需要納入：目前 yearDraft build 不受 strategy 影響，可不納入 yearDraft cache key
- 未來 method 若出現，必須納入；但第一版不做 method switch

建議第一版 cache key：

```text
year=2027|startTerm=大雪|before=0|after=15
```

也可以使用 JSON stringify normalized options。

提醒：

- options 預設值要 normalize 後再產生 key。
- undefined 與 default value 應視為同一 key。
- 不要把 unrelated options 直接塞進 key，避免 cache miss 過多。

## 7. mutation 風險

目前 helper 會回傳 object / array。如果 cache 直接回傳同一份物件，外部測試或後續 UI 若不小心修改，可能污染 cache。

可選方案：

- cache 內部存 frozen object。
- 每次回傳 deep clone。
- 只 clone timeline entries。
- 明確規範 helper 回傳值不可 mutate，測試驗證 copy behavior。

建議：

- 第一版 cache helper 可以回傳 clone，安全優先。
- 若效能不足，再評估 freeze + shallow clone。

## 8. full range diagnostics 前置條件

在做 1899～2101 full range formatter diagnostics 前，建議先完成：

- cache 策略決定。
- cached vs non-cached equivalence tests。
- 2024～2030 formatter regression 維持通過。
- 69 duplicate boundary formatter regression 維持通過。
- full range diagnostics 不輸出每筆明細，只輸出統計。
- 必要時加入執行時間觀察，但不要讓測試依賴時間門檻。

## 9. 暫不處理事項

- 不實作 cache。
- 不替換 resolver 主線。
- 不接 UI。
- 不改 1080 盤面資料。
- 不做 method switch。
- 不做真太陽時。
- 不做 full range formatter diagnostics。

## 10. 後續建議

下一步候選：

- A. 第 51 包：實作 read-only per-year draft cache helper + cached/non-cached equivalence tests
- B. 第 51 包改為 docs-only：正式 resolver replacement 風險評估
- C. 第 51 包：先做 full range formatter diagnostics prototype，但只在 cache 設計後執行

建議優先順序：

1. cache helper + equivalence tests
2. 重新跑 2024～2030 regression 與 duplicate boundary formatter regression
3. full range formatter diagnostics
4. resolver replacement 風險評估
5. UI 接入與 1080 盤面 lookup

## 11. 本階段結論

第 50 包只新增 cache 設計文件。目前 read-only formatter 行為已經在 2027、2024～2030、69 duplicate boundary 通過測試。

下一個技術風險是效能與重複 yearDraft build。在做 full range formatter diagnostics 或正式替換 resolver 前，應先處理 cache 設計。

本包不改任何程式，主線安全不變。

## 12. 第 51 包 cache helper 實作結果

第 51 包新增 read-only per-year yearDraft cache helper：

```js
getQimenFullTermCycleTimelineDraftForYearCached(year, options = {})
clearQimenFullTermCycleTimelineDraftCache()
getQimenFullTermCycleTimelineDraftCacheStats()
```

目前實作狀態：

- cache helper 使用 module-level `Map`。
- cache key 使用 normalized options。
- cache miss 時呼叫 `buildQimenFullTermCycleTimelineDraftForYear(year, options)`。
- cache hit 時回傳 cached draft 的 clone。
- `clearQimenFullTermCycleTimelineDraftCache()` 可清空 cache 並重設 stats。
- `getQimenFullTermCycleTimelineDraftCacheStats()` 可觀察：
  - `size`
  - `keys`
  - `hits`
  - `misses`
- cache helper 目前是 read-only helper。
- 尚未讓 `findQimenFullTermCycleTimelineDraftEntry(...)` 使用 cache。
- 尚未讓 `resolveQimenJuFromFullTermCycleDraft(...)` 使用 cache。
- 尚未改 `resolveQimenJu()` 主流程。

### 12.1 cache key

目前第一版 key 格式：

```text
year=2027|startTerm=大雪|before=0|after=15
```

key 來源：

- `year`
- `startTerm`，預設 `大雪`
- `beforeStartEffectiveDays`，預設 `0`
- `afterEndEffectiveDays`，預設 `15`

補充：

- `strategy` 未納入 key，因為 yearDraft build 不受 lookup strategy 影響。
- `undefined` 與 default options 會 normalize 成同一 key。
- `{ afterEndEffectiveDays: 30 }` 會產生不同 key：
  - `year=2027|startTerm=大雪|before=0|after=30`
- 本包仍不做 method switch；未來若支援不同 method，method 必須納入 key。

### 12.2 clone 與 mutation safety

- cache 內部存 draft。
- 每次對外回傳 clone。
- clone 目前支援 plain object / array recursive clone。
- 測試已確認外部修改第一次 cached 回傳結果，不會污染下一次 cached 回傳結果。

mutation safety 測試內容：

- 取得 2027 cached draft。
- 修改：
  - `timeline[0].qimenSolarTerm`
  - `startSeed.qimenSolarTerm`
  - `intercalations[0].afterTerm`
- 再次取得 2027 cached draft。
- 驗證：
  - `timeline[0].qimenSolarTerm` 未被污染，仍為 `大雪`
  - `startSeed.qimenSolarTerm` 仍為 `大雪`
  - `intercalations[0].afterTerm` 仍為 `大雪`

## 13. 第 51 包測試結果

新增測試輸出：

- 奇門完整循環草案yearDraft cache測試通過：13 cases

測試覆蓋：

| 測試項目 | 結果 |
|---|---|
| cache 初始與 clear | 通過 |
| 2024～2030 cached / non-cached equivalence | 通過，7 年一致 |
| cache size / keys / hits / misses | 通過 |
| mutation safety | 通過 |
| options normalization | 通過 |
| options 分流 | 通過 |
| error case 不污染 cache | 通過 |

固定觀察：

- 2024～2030 第一次 cached 查詢後：
  - `size = 7`
  - `keys.length = 7`
  - `misses = 7`
  - `hits = 0`
- 再查 2024 / 2027 / 2030 後：
  - `hits = 3`
  - `misses = 7`
  - `size = 7`
- default options 與 explicit default options 共用同一 key。
- `afterEndEffectiveDays: 30` 會分流成第二個 key。
- 1800 年錯誤案例丟出 `RangeError`，且 cache size 仍為 0。

## 14. 第 51 包後目前限制

- cache helper 已完成，但 formatter / lookup 尚未使用 cache。
- cache helper 目前是 module-level Map。
- 尚未評估長期執行時 cache size 是否需要上限。
- 尚未設計 LRU 或 eviction。
- 尚未做 full range formatter diagnostics。
- 尚未做 cached formatter 查詢。
- 尚未驗證 cache 接入 lookup / formatter 後，2024～2030 regression 與 69 duplicate boundary regression 是否仍完全通過。
- cache stats 目前可觀察，但是否保留到正式版本仍待決定。
- cache 目前沒有納入 method，因為本專案第一版不做 method switch。

## 15. 第 51 包後後續建議

建議下一步：

1. 第 53 包：新增 cached lookup helper，但不要改既有 lookup / formatter 主流程。
   - 例如：`findQimenFullTermCycleTimelineDraftEntryCached(dateTimeText, options = {})`
   - 使用 `getQimenFullTermCycleTimelineDraftForYearCached(...)`
   - 與 non-cached lookup 做 equivalence tests。
2. 第 54 包：新增 cached formatter helper，但不要改既有 formatter 主流程。
   - 例如：`resolveQimenJuFromFullTermCycleDraftCached(dateTimeText, options = {})`
   - 與 non-cached formatter 做 equivalence tests。
3. 第 55 包：跑 2024～2030 cached formatter regression 與 69 duplicate boundary cached formatter regression。
4. 再進入 1899～2101 full range formatter diagnostics。
5. 最後才討論是否讓正式 `resolveQimenJuFromFullTermCycleDraft(...)` 內部改用 cache。

原則：

- 不建議直接把現有 lookup / formatter 改用 cache。
- 先新增 cached parallel helper 做對照，會比直接替換安全。
- cache 是效能優化，不應改變行為。

## 16. 第 51 包結論

第 51 包完成 read-only per-year yearDraft cache helper。

cached / non-cached 在 2024～2030 逐年 full cycle draft 結果一致。cache key normalization、options 分流、mutation safety、error no-pollution 皆已測試。

cache stats 可觀察 size / keys / hits / misses。目前正式 lookup / formatter 尚未使用 cache，因此主線行為不變。

下一階段建議新增 cached lookup helper 與 equivalence tests，而不是直接替換現有 lookup / formatter。

## 17. 第 53 包 cached lookup helper 實作結果

第 53 包新增 cached lookup parallel helper：

```js
findQimenFullTermCycleTimelineDraftEntryCached(dateTimeText, options = {})
```

此 helper 是 `findQimenFullTermCycleTimelineDraftEntry(...)` 的 cached parallel version。它使用第 51 包新增的 `getQimenFullTermCycleTimelineDraftForYearCached(...)`，支援 `strategy: "cycle-year"`，candidate years 順序仍為：

- `candidateYear`
- `candidateYear - 1`
- `candidateYear + 1`

它也仍支援 `options.startYear` / `options.endYear` 篩選。回傳格式與 non-cached lookup 對齊：

- draft entry clone
- `lookup.strategy`
- `lookup.queryEffectiveDayStart`
- `lookup.selectedYear`
- `lookup.candidateYears`

目前尚未讓既有 `findQimenFullTermCycleTimelineDraftEntry(...)` 改用 cache，尚未讓 `resolveQimenJuFromFullTermCycleDraft(...)` 使用 cached lookup，也尚未改 `resolveQimenJu()` 主流程。

技術實作補充：

- 第 53 包抽出 private provider helper，讓 cached 與 non-cached lookup 共用主體流程。
- non-cached lookup 仍傳入 `buildQimenFullTermCycleTimelineDraftForYear`。
- cached lookup 傳入 `getQimenFullTermCycleTimelineDraftForYearCached(...)`。
- cached lookup 會把 lookup-only options 與 yearDraft build options 分離。
- `strategy`、`startYear`、`endYear` 不會進入 yearDraft cache key。
- yearDraft build options 僅包含：
  - `startTerm`
  - `beforeStartEffectiveDays`
  - `afterEndEffectiveDays`

## 18. 第 53 包測試結果

新增測試輸出：

- 奇門完整循環Timeline草案cached lookup測試通過：16 cases

測試覆蓋：

| 測試項目 | 結果 |
|---|---|
| 10 筆代表案例 cached / non-cached lookup equivalence | 通過 |
| cache stats 確認 cached lookup 使用 cache | 通過 |
| 2028 年初 cross-year fallback cache stats | 通過 |
| 69 組 duplicate boundary cached / non-cached lookup equivalence | 通過 |
| options normalization | 通過 |
| invalid strategy 不污染 cache | 通過 |
| missing data 不污染 cache | 通過 |

### 18.1 代表案例

| 查詢時間 | 說明 |
|---|---|
| `1910-11-24T23:30:00+08:00` | duplicate boundary after |
| `1910-11-24T22:30:00+08:00` | duplicate boundary before |
| `1910-11-25T12:00:00+08:00` | duplicate boundary 後一日 |
| `2027-06-06T12:00:00+08:00` | 2027 芒種中元，命中 2026 cycle draft |
| `2027-06-14T12:00:00+08:00` | 2027 夏至上元，命中 2026 cycle draft |
| `2027-12-11T12:00:00+08:00` | 2027 閏大雪上元 |
| `2027-12-26T12:00:00+08:00` | 2027 冬至上元 |
| `2028-01-01T12:00:00+08:00` | 2028 年初 fallback，命中 2027 cycle draft |
| `2030-12-10T12:00:00+08:00` | 2030 閏大雪上元 |
| `2030-12-25T12:00:00+08:00` | 2030 冬至上元 |

這 10 筆都逐欄比對 cached / non-cached lookup 結果一致，包括：

- `qimenSolarTerm`
- `yuan`
- `start`
- `end`
- `isIntercalary`
- `sourceDayPillar`
- `lookup.strategy`
- `lookup.queryEffectiveDayStart`
- `lookup.selectedYear`
- `lookup.candidateYears`

### 18.2 cache stats 觀察

2027 三筆連續 cached lookup：

- 查詢：
  - `2027-12-11T12:00:00+08:00`
  - `2027-12-16T12:00:00+08:00`
  - `2027-12-26T12:00:00+08:00`
- 三筆皆 selectedYear = 2027。
- stats：
  - `size = 1`
  - `misses = 1`
  - `hits >= 2`
  - key 包含 `year=2027|startTerm=大雪|before=0|after=15`

2028 年初 fallback：

- 查詢：`2028-01-01T12:00:00+08:00`
- selectedYear = 2027
- candidateYears = `[2028, 2027]`
- stats：
  - `size = 2`
  - `misses = 2`
  - keys 包含：
    - `year=2028|startTerm=大雪|before=0|after=15`
    - `year=2027|startTerm=大雪|before=0|after=15`

### 18.3 duplicate boundary cached lookup

- 使用 1899～2101 full range。
- 從 `yearDrafts` 還原 69 組 duplicate boundary。
- 對每組測試：
  - boundary after：duplicate start 當天 23:30
  - boundary before：duplicate start 當天 22:30
- 比對 cached / non-cached lookup 結果一致。

固定統計：

| 項目 | 數值 |
|---|---:|
| duplicateGroups.length | 69 |
| boundaryAfterCachedMismatchCount | 0 |
| boundaryBeforeCachedMismatchCount | 0 |

### 18.4 error / option 行為

- default options 與 explicit default options 共用同一 cache key：
  - `year=2027|startTerm=大雪|before=0|after=15`
- invalid strategy：
  - 丟出 `RangeError`
  - cache size 維持 0
- missing data：
  - `1800-01-01T12:00:00+08:00` 丟出 `RangeError`
  - cache size 維持 0

## 19. 第 53 包後目前限制

- cached lookup helper 已完成，但既有 lookup 主流程尚未改用 cache。
- formatter 尚未使用 cached lookup。
- 尚未新增 cached formatter helper。
- 尚未跑 cached formatter regression。
- 尚未跑 cached formatter duplicate boundary regression。
- 尚未做 1899～2101 full range formatter diagnostics。
- cache 目前仍是 module-level Map，尚未設計上限、LRU 或 eviction。
- cache stats 目前用於測試與觀察，是否保留正式版本待定。
- cached lookup 與 non-cached lookup 結果一致，不代表可以直接替換正式 resolver；下一步仍應新增 cached formatter parallel helper。

## 20. 第 53 包後後續建議

建議下一步：

1. 第 55 包：新增 cached formatter helper，但不要改既有 formatter 主流程。
   - 例如：`resolveQimenJuFromFullTermCycleDraftCached(dateTimeText, options = {})`
   - 內部使用 `findQimenFullTermCycleTimelineDraftEntryCached(...)`
   - 與 non-cached formatter 做 equivalence tests。
2. 第 56 包：新增 cached formatter 2024～2030 regression。
3. 第 57 包：新增 69 組 duplicate boundary cached formatter regression。
4. 第 58 包：再考慮 1899～2101 full range formatter diagnostics。
5. 最後才討論是否讓正式 `resolveQimenJuFromFullTermCycleDraft(...)` 內部改用 cache。

原則：

- cache 是效能優化，不應改變結果。
- 目前採 parallel helper 對照策略，比直接替換主流程安全。
- 不建議現在直接把既有 lookup / formatter 改成 cached 版本。

## 21. 第 53 包結論

第 53 包完成 cached lookup parallel helper。

cached / non-cached lookup 在 10 筆代表案例與 69 組 duplicate boundary 上結果一致。cache stats 已確認 cached lookup 確實使用 yearDraft cache。

cross-year fallback 會依序建立 2028 與 2027 yearDraft cache，並正確命中 2027。invalid strategy 與 missing data 不會污染 cache。

目前正式 lookup / formatter / resolver 主線仍未使用 cache，因此主線行為不變。

下一階段建議新增 cached formatter helper 與 equivalence tests。

## 22. 第 55 包 cached formatter helper 實作結果

第 55 包新增 cached formatter parallel helper：

```js
resolveQimenJuFromFullTermCycleDraftCached(dateTimeText, options = {})
```

此 helper 是 `resolveQimenJuFromFullTermCycleDraft(...)` 的 cached parallel version，使用第 53 包新增的 `findQimenFullTermCycleTimelineDraftEntryCached(...)`。

回傳格式與 non-cached formatter 對齊：

- `actualSolarTerm`
- `qimenSolarTerm`
- `status`
- `yuan`
- `dunType`
- `dunName`
- `ju`
- `hourPillar`
- `isIntercalary`
- `notes`
- `lookup`

若查不到 draft entry，仍丟出：

- `RangeError("查詢時間不在奇門 full cycle draft timeline 覆蓋範圍內")`

`notes` 行為與 non-cached formatter 完全一致：

- 置閏：`["查詢時間落在 full cycle draft 置閏 timeline 內。"]`
- 非置閏：`[]`

技術實作補充：

- 第 55 包抽出 private formatter helper，讓 cached 與 non-cached formatter 共用 formatter 組裝邏輯。
- non-cached formatter 仍使用 `findQimenFullTermCycleTimelineDraftEntry(...)`。
- cached formatter 使用 `findQimenFullTermCycleTimelineDraftEntryCached(...)`。
- 既有 `resolveQimenJuFromFullTermCycleDraft(...)` 對外行為未改變。
- 既有 lookup / resolver 主線未改用 cache。

## 23. 第 55 包測試結果

新增測試輸出：

- 奇門完整循環草案cached resolver formatter測試通過：16 cases

測試覆蓋：

| 測試項目 | 結果 |
|---|---|
| 11 筆代表案例 cached / non-cached formatter equivalence | 通過 |
| cache stats 確認 cached formatter 使用 cache | 通過 |
| 2028 年初 cross-year fallback cache stats | 通過 |
| notes 行為與 non-cached formatter 一致 | 通過 |
| invalid strategy 不污染 cache | 通過 |
| missing data 不污染 cache | 通過 |

### 23.1 代表案例

| 查詢時間 | 說明 |
|---|---|
| `1910-11-24T23:30:00+08:00` | duplicate boundary after |
| `1910-11-24T22:30:00+08:00` | duplicate boundary before |
| `1910-11-25T12:00:00+08:00` | duplicate boundary 後一日 |
| `2027-06-06T12:00:00+08:00` | 2027 芒種中元，命中 2026 cycle draft |
| `2027-06-14T12:00:00+08:00` | 2027 夏至上元，命中 2026 cycle draft |
| `2027-12-11T12:00:00+08:00` | 2027 閏大雪上元 |
| `2027-12-22T12:00:00+08:00` | 2027 閏大雪下元，實際冬至後接氣 |
| `2027-12-26T12:00:00+08:00` | 2027 冬至上元 |
| `2028-01-01T12:00:00+08:00` | 2028 年初 fallback，命中 2027 cycle draft |
| `2030-12-10T12:00:00+08:00` | 2030 閏大雪上元 |
| `2030-12-25T12:00:00+08:00` | 2030 冬至上元 |

這 11 筆都逐欄比對 cached / non-cached formatter 結果一致，包括：

- `actualSolarTerm`
- `qimenSolarTerm`
- `status`
- `yuan`
- `dunType`
- `dunName`
- `ju`
- `hourPillar`
- `isIntercalary`
- `notes`
- `lookup.strategy`
- `lookup.queryEffectiveDayStart`
- `lookup.selectedYear`
- `lookup.candidateYears`

### 23.2 cache stats 觀察

2027 三筆連續 cached formatter：

- 查詢：
  - `2027-12-11T12:00:00+08:00`
  - `2027-12-16T12:00:00+08:00`
  - `2027-12-26T12:00:00+08:00`
- 三筆皆 `lookup.selectedYear = 2027`。
- stats：
  - `size = 1`
  - `misses = 1`
  - `hits >= 2`
  - key 包含 `year=2027|startTerm=大雪|before=0|after=15`

2028 年初 fallback：

- 查詢：`2028-01-01T12:00:00+08:00`
- `lookup.selectedYear = 2027`
- `lookup.candidateYears = [2028, 2027]`
- stats：
  - `size = 2`
  - `misses = 2`
  - keys 包含：
    - `year=2028|startTerm=大雪|before=0|after=15`
    - `year=2027|startTerm=大雪|before=0|after=15`

### 23.3 notes 行為

置閏案例：

- 查詢：`2027-12-11T12:00:00+08:00`
- cached notes 與 non-cached notes 完全一致。
- `notes.length > 0`

非置閏案例：

- 查詢：`2027-12-26T12:00:00+08:00`
- cached notes 與 non-cached notes 完全一致。
- `notes.length = 0`

### 23.4 error 行為

invalid strategy：

- `resolveQimenJuFromFullTermCycleDraftCached("2027-12-26T12:00:00+08:00", { strategy: "unknown" })`
- 丟出 `RangeError`
- cache size 維持 0

missing data：

- `resolveQimenJuFromFullTermCycleDraftCached("1800-01-01T12:00:00+08:00")`
- 丟出 `RangeError`
- cache size 維持 0

## 24. 第 55 包後目前限制

- cached formatter helper 已完成，但既有 formatter 主流程尚未改用 cache。
- 既有 lookup 主流程尚未改用 cache。
- 尚未跑 cached formatter 2024～2030 regression。
- 尚未跑 cached formatter 69 組 duplicate boundary regression。
- 尚未做 1899～2101 full range formatter diagnostics。
- cache 目前仍是 module-level Map，尚未設計上限、LRU 或 eviction。
- cache stats 目前用於測試與觀察，是否保留正式版本待定。
- cached formatter 與 non-cached formatter 結果一致，不代表可以直接替換正式 resolver；下一步仍應擴大 regression 範圍。

## 25. 第 55 包後後續建議

建議下一步：

1. 第 57 包：新增 cached formatter 2024～2030 regression。
   - 使用既有 14 筆 formatter regression cases。
   - 比對 cached / non-cached formatter 與固定預期。
2. 第 58 包：新增 69 組 duplicate boundary cached formatter regression。
   - 比對 cached / non-cached formatter。
   - 固定 boundary after / before 統計。
3. 第 59 包：再考慮 1899～2101 full range formatter diagnostics。
4. 最後才討論是否讓正式 `resolveQimenJuFromFullTermCycleDraft(...)` 內部改用 cache。
5. UI 接入與盤面手動覆寫功能仍應等待 formatter 主線穩定後再做。

原則：

- cache 是效能優化，不應改變結果。
- 目前採 parallel helper 對照策略，比直接替換主流程安全。
- 不建議現在直接把既有 formatter 改成 cached 版本。
- 使用者提出的「盤面手動覆寫遁別 / 局數」應歸類為 UI / 盤面查表層，不應回寫 resolver 結果。

## 26. 第 55 包結論

第 55 包完成 cached formatter parallel helper。

cached / non-cached formatter 在 11 筆代表案例上結果一致。cache stats 已確認 cached formatter 確實使用 yearDraft cache。

cross-year fallback 會依序建立 2028 與 2027 yearDraft cache，並正確命中 2027。notes 行為與 non-cached formatter 一致。invalid strategy 與 missing data 不會污染 cache。

目前正式 lookup / formatter / resolver 主線仍未使用 cache，因此主線行為不變。

下一階段建議擴大 cached formatter regression，而不是直接替換現有 formatter。

## 27. 第 57 包 cached formatter regression 測試結果

第 57 包新增測試函式：

```js
runQimenFullTermCycleDraftCachedResolverFormatterRegressionTests()
```

新增測試輸出：

```text
奇門完整循環草案cached resolver formatter regression測試通過：15 cases
```

本包只修改 `tests/run-tests.js`，未修改 `src/qimenResolver.js`，也未修改既有 formatter / lookup / resolver 主流程。測試使用既有 2024～2030 formatter regression 的 14 筆代表 cases。

每筆同時比對：

- cached formatter vs non-cached formatter
- cached formatter vs 固定預期

另額外新增 1 筆 cache stats 觀察 case，總計 15 cases。

測試覆蓋：

| 測試項目 | 結果 |
|---|---|
| 14 筆 cached / non-cached formatter equivalence | 通過 |
| 14 筆 cached / 固定預期對齊 | 通過 |
| 統計固定值 | 通過 |
| cache stats 確認 cached formatter 使用 cache | 通過 |

### 27.1 2024～2030 regression cases

| 查詢時間 | selectedYear | 奇門節氣 | 元 | 是否置閏 | 遁別 | 局 |
|---|---:|---|---|---|---|---:|
| `2024-12-11T12:00:00+08:00` | 2024 | 大雪 | 上元 | 是 | 陰遁 | 4 |
| `2024-12-26T12:00:00+08:00` | 2024 | 冬至 | 上元 | 否 | 陽遁 | 1 |
| `2025-12-06T12:00:00+08:00` | 2025 | 大雪 | 上元 | 否 | 陰遁 | 4 |
| `2025-12-21T12:00:00+08:00` | 2025 | 冬至 | 上元 | 否 | 陽遁 | 1 |
| `2026-12-01T12:00:00+08:00` | 2026 | 大雪 | 上元 | 否 | 陰遁 | 4 |
| `2026-12-16T12:00:00+08:00` | 2026 | 冬至 | 上元 | 否 | 陽遁 | 1 |
| `2027-12-11T12:00:00+08:00` | 2027 | 大雪 | 上元 | 是 | 陰遁 | 4 |
| `2027-12-26T12:00:00+08:00` | 2027 | 冬至 | 上元 | 否 | 陽遁 | 1 |
| `2028-01-01T12:00:00+08:00` | 2027 | 冬至 | 中元 | 否 | 陽遁 | 7 |
| `2028-12-05T12:00:00+08:00` | 2028 | 大雪 | 上元 | 否 | 陰遁 | 4 |
| `2029-11-30T12:00:00+08:00` | 2029 | 大雪 | 上元 | 否 | 陰遁 | 4 |
| `2029-12-15T12:00:00+08:00` | 2029 | 冬至 | 上元 | 否 | 陽遁 | 1 |
| `2030-12-10T12:00:00+08:00` | 2030 | 大雪 | 上元 | 是 | 陰遁 | 4 |
| `2030-12-25T12:00:00+08:00` | 2030 | 冬至 | 上元 | 否 | 陽遁 | 1 |

`2028-01-01T12:00:00+08:00` 是 cross-year fallback 案例，查詢 civil year 是 2028，但 selectedYear = 2027。14 筆皆逐欄比對 cached / non-cached formatter 結果一致，且 14 筆 cached formatter 皆與固定預期一致。

### 27.2 固定統計

| 統計項目 | 數值 |
|---|---:|
| normalCaseCount | 14 |
| intercalaryCaseCount | 3 |
| nonIntercalaryCaseCount | 11 |
| selectedYearFallbackCount | 1 |
| selectedYearSameAsCivilYearCount | 13 |

這些統計與既有 non-cached formatter regression 相同。3 筆置閏案例為 2024、2027、2030 的大雪上元案例。1 筆 selectedYear fallback 為 `2028-01-01T12:00:00+08:00`。

### 27.3 cache stats 觀察

第 57 包在測試開始前 clear cache，跑完 14 筆 cached formatter regression 後觀察 cache stats。

測試不鎖死精準 size / hits / misses 數字，但確認：

- `size > 0`
- `misses > 0`
- `hits > 0`
- keys 至少包含：
  - `year=2024|startTerm=大雪|before=0|after=15`
  - `year=2027|startTerm=大雪|before=0|after=15`
  - `year=2030|startTerm=大雪|before=0|after=15`

這證明 cached formatter regression 實際使用 yearDraft cache。stats 不鎖死精準值，是為了避免 future candidate year fallback / case order 微調造成過度脆弱。

## 28. 第 57 包後目前限制

- cached formatter 2024～2030 regression 已通過。
- 既有 formatter 主流程尚未改用 cache。
- 既有 lookup 主流程尚未改用 cache。
- 尚未跑 69 組 duplicate boundary cached formatter regression。
- 尚未做 1899～2101 full range formatter diagnostics。
- cache 目前仍是 module-level Map，尚未設計上限、LRU 或 eviction。
- cache stats 目前用於測試與觀察，是否保留正式版本待定。
- cached formatter 在 14 筆 regression 通過，不代表可以直接替換正式 resolver；下一步仍應驗證 69 組 duplicate boundary cached formatter regression。

## 29. 第 57 包後後續建議

建議下一步：

1. 第 59 包：新增 69 組 duplicate boundary cached formatter regression。
   - 比對 cached / non-cached formatter。
   - 固定 boundary after / before 統計。
   - 確認 duplicate boundary 在 cached formatter 下仍與 non-cached formatter 一致。
2. 第 60 包：文件補充第 59 包結果。
3. 第 61 包：再考慮 1899～2101 full range formatter diagnostics。
4. 最後才討論是否讓正式 `resolveQimenJuFromFullTermCycleDraft(...)` 內部改用 cache。
5. UI 接入與盤面手動覆寫功能仍應等待 formatter 主線穩定後再做。

原則：

- cache 是效能優化，不應改變結果。
- 目前採 parallel helper 對照策略，比直接替換主流程安全。
- 不建議現在直接把既有 formatter 改成 cached 版本。
- duplicate boundary 是正式替換前的重要風險點，應先完成 cached formatter duplicate boundary regression。

## 30. 第 57 包結論

第 57 包完成 cached formatter 2024～2030 regression。

14 筆 cached / non-cached formatter 結果一致。14 筆 cached formatter 也與固定預期一致。統計固定值與既有 non-cached formatter regression 一致。

cache stats 已確認 cached formatter regression 實際使用 yearDraft cache。目前正式 lookup / formatter / resolver 主線仍未使用 cache，因此主線行為不變。

下一階段建議新增 69 組 duplicate boundary cached formatter regression。

## 31. 第 59 包 cached formatter duplicate boundary regression 測試結果

第 59 包新增測試函式：

```js
runQimenFullTermCycleDraftCachedResolverFormatterDuplicateBoundaryTests()
```

新增測試輸出：

```text
奇門完整循環草案cached resolver formatter duplicate boundary測試通過：5 cases
```

本包只修改 `tests/run-tests.js`，未修改 `src/qimenResolver.js`，也未修改既有 formatter / lookup / resolver 主流程。

測試使用 1899～2101 full range yearDrafts 還原 duplicate boundary，`duplicateGroups.length` 固定為 69。每組 duplicate boundary 測：

- boundary after：duplicate start 當天 `23:30`
- boundary before：duplicate start 當天 `22:30`

每筆都比對 cached formatter vs non-cached formatter 完整結果一致，並額外補 1910 sanity check 與 cache stats 觀察，總計 5 cases。

測試覆蓋：

| 測試項目 | 結果 |
|---|---|
| duplicateGroups.length = 69 | 通過 |
| 69 組 boundary after cached / non-cached formatter equivalence | 通過 |
| 69 組 boundary before cached / non-cached formatter equivalence | 通過 |
| boundary after mismatch 統計 | 0 |
| boundary before mismatch 統計 | 0 |
| selectedYear 固定統計 | 通過 |
| 1910 sanity check | 通過 |
| cache stats 確認 cached formatter 使用 cache | 通過 |

### 31.1 fixed duplicate boundary stats

| 統計項目 | 數值 |
|---|---:|
| duplicateGroups.length | 69 |
| boundaryAfterCachedMismatchCount | 0 |
| boundaryBeforeCachedMismatchCount | 0 |
| boundaryAfterSelectedCurrentYearCount | 69 |
| boundaryBeforeSelectedPreviousYearCount | 23 |
| boundaryBeforeSelectedCurrentYearCount | 46 |
| boundaryBeforeOtherSelectedYearCount | 0 |

boundary after 全部選到 current year entry。boundary before 沿用既有 non-cached formatter duplicate boundary 統計：

- 23 組 selected previous year
- 46 組 selected current year
- 0 組 selected other year

cached formatter 與 non-cached formatter 在 before / after 均完全一致，因此 selectedYear 統計不因 cache 改變。

### 31.2 1910 sanity check

使用 cached formatter 驗證：

```text
1910-11-24T23:30:00+08:00
```

預期：

| 欄位 | 值 |
|---|---|
| lookup.selectedYear | 1910 |
| qimenSolarTerm | 大雪 |
| yuan | 上元 |
| isIntercalary | false |
| dunName | 陰遁 |
| ju | 4 |

查詢：

```text
1910-11-24T22:30:00+08:00
```

預期：

| 欄位 | 值 |
|---|---|
| lookup.selectedYear | 1909 |
| qimenSolarTerm | 立冬 |
| yuan | 下元 |
| isIntercalary | false |
| dunName | 陰遁 |
| ju | 3 |

這與既有 non-cached formatter duplicate boundary sanity check 一致，代表 duplicate start 前後的 selectedYear 行為沒有因 cache 改變。

### 31.3 cache stats 觀察

第 59 包在 duplicate boundary 測試前 clear cache，跑完 69 組 before / after cached formatter 後觀察 cache stats。

測試不鎖死精準 size / hits / misses 數字，但確認：

- `stats.size > 0`
- `stats.misses > 0`
- `stats.hits > 0`
- keys 至少包含：
  - `year=1909|startTerm=大雪|before=0|after=15`
  - `year=1910|startTerm=大雪|before=0|after=15`

這證明 duplicate boundary cached formatter regression 實際使用 yearDraft cache。stats 不鎖死精準值，是為了避免 future candidate year fallback / case order 微調造成測試過度脆弱。

## 32. 第 59 包後目前限制

- cached formatter 69 組 duplicate boundary regression 已通過。
- cached formatter 2024～2030 regression 已通過。
- cached / non-cached lookup equivalence 已通過。
- cached / non-cached formatter representative equivalence 已通過。
- 既有 formatter 主流程尚未改用 cache。
- 既有 lookup 主流程尚未改用 cache。
- 尚未做 1899～2101 full range formatter diagnostics。
- cache 目前仍是 module-level Map，尚未設計上限、LRU 或 eviction。
- cache stats 目前用於測試與觀察，是否保留正式版本待定。
- cached formatter 在 duplicate boundary 通過，不代表可以立即替換正式 resolver；下一步仍應做 full range formatter diagnostics 或 resolver replacement 風險評估。

## 33. 第 59 包後後續建議

建議下一步：

1. 第 61 包：1899～2101 full range formatter diagnostics 設計或實作。
   - 先決定 diagnostics 規模與輸出統計。
   - 不輸出每筆明細。
   - 不以執行時間作為硬性測試條件。
2. 第 62 包：文件補充 full range formatter diagnostics 結果。
3. 之後再進入正式 replacement 風險評估：
   - 是否讓 `resolveQimenJuFromFullTermCycleDraft(...)` 內部改用 cache。
   - 是否保留 non-cached helper 作為測試 baseline。
   - 是否保留 cache stats export。
   - 是否需要 cache eviction / clear policy。
4. UI 接入與盤面手動覆寫功能仍應等待 formatter 主線穩定後再做。

原則：

- cache 是效能優化，不應改變結果。
- 目前採 parallel helper 對照策略，比直接替換主流程安全。
- duplicate boundary 是正式替換前的重要風險點，目前 cached formatter 已通過。
- 仍不建議立刻把既有 formatter 改成 cached 版本，除非先完成 full range diagnostics 或 replacement 風險評估。

## 34. 第 59 包結論

第 59 包完成 69 組 duplicate boundary cached formatter regression。

69 組 boundary after cached / non-cached formatter 結果一致。69 組 boundary before cached / non-cached formatter 結果一致。mismatch 統計皆為 0。

selectedYear 固定統計與既有 non-cached formatter duplicate boundary regression 一致。1910 sanity check 通過。cache stats 已確認 duplicate boundary cached formatter regression 實際使用 yearDraft cache。

目前正式 lookup / formatter / resolver 主線仍未使用 cache，因此主線行為不變。

下一階段建議進入 1899～2101 full range formatter diagnostics 或 replacement 風險評估。

## 35. 第 61 包 full range cached formatter diagnostics 測試結果

第 61 包新增 full range cached formatter diagnostics 測試：

```js
runQimenFullTermCycleDraftCachedResolverFormatterFullRangeDiagnosticsTests()
```

測試輸出：

```text
奇門完整循環草案cached resolver formatter full range diagnostics測試通過：7 cases
```

第 61 包只修改 `tests/run-tests.js`，沒有修改 `src/qimenResolver.js`，也沒有修改既有 formatter、lookup 或 resolver 主流程。

測試使用 1899～2101 full range timeline，並用 `fullRange.timeline` 建立 14829 筆查詢。每一筆查詢點取 entry start 後 30 分鐘，例如 `T23:00:00+08:00` 轉成 `T23:30:00+08:00`，避免剛好落在 entry end boundary。

每一筆查詢使用：

```js
resolveQimenJuFromFullTermCycleDraftCached(query, {
  startYear: 1899,
  endYear: 2101,
})
```

測試不輸出逐筆明細，也不以 runtime 作為 pass/fail 條件。總計驗證 7 cases。

| 測試項目 | 結果 |
|---|---|
| full range input sanity | 通過 |
| full range cached formatter coverage | 通過 |
| intercalary statistics | 通過 |
| dunType statistics | 通過 |
| ju distribution statistics | 通過 |
| selectedYear statistics | 通過 |
| cache stats 確認 cached formatter 使用 cache | 通過 |

### 35.1 full range 基礎統計

| 統計項目 | 數值 |
|---|---:|
| yearDrafts.length | 203 |
| entryCountBeforeDedupe | 14898 |
| entryCountAfterDedupe | 14829 |
| duplicateStarts.length | 69 |
| gaps.length | 0 |
| overlaps.length | 0 |
| queryCount | 14829 |

`queryCount` 等於 `entryCountAfterDedupe`，代表每一筆 deduped timeline entry 都有建立 cached formatter 查詢。查詢點使用 start + 30 分鐘，避免直接壓在 entry end boundary。

### 35.2 full range formatter 統計

| 統計項目 | 數值 |
|---|---:|
| intercalaryResultCount | 282 |
| nonIntercalaryResultCount | 14547 |
| yinCount / yangCount | 皆 > 0 |
| juCounts | 涵蓋 1～9 局 |
| selectedYearFallbackCount | > 0 |

full range 共 203 年。既有 diagnostics 顯示 94 年有置閏，每個置閏年有 3 筆 intercalary entries，因此 `intercalaryResultCount = 94 * 3 = 282`。

`nonIntercalaryResultCount = 14829 - 282 = 14547`。陰遁與陽遁都出現，1～9 局也都出現。`selectedYearFallbackCount > 0`，代表跨年度 selectedYear fallback 邏輯沒有因 cache 失效。

### 35.3 cache stats 觀察

第 61 包在 full range cached formatter diagnostics 前 clear cache，完成 14829 筆查詢後觀察 cache stats。

測試不鎖死精準 size / hits / misses 數字，但確認：

- `stats.size > 0`
- `stats.misses > 0`
- `stats.hits > 0`
- `stats.keys.length === stats.size`
- keys 至少包含：
  - `year=1899|startTerm=大雪|before=0|after=15`
  - `year=1900|startTerm=大雪|before=0|after=15`
  - `year=2101|startTerm=大雪|before=0|after=15`

這證明 full range diagnostics 實際使用 yearDraft cache。stats 採寬鬆確認，是為了避免 future candidate year fallback 或 case order 微調造成測試過度脆弱。

### 35.4 duplicate start 查詢對齊註記

full range timeline 是 deduped timeline。duplicate boundary 的同一個 start 在相鄰 yearDraft 中可能有不同 `qimenSolarTerm`。

cached formatter lookup strategy 是 `cycle-year` strategy，不是把全域 deduped timeline entry 當成唯一真相。

第 61 包測試建立 `yearDraftEntryByYearAndStart`：

- 先用 `cached.lookup.selectedYear`
- 再用 `entry.start`
- 找出 selected year draft 中對應的 entry
- 找得到時以該 entry 作為 `expectedEntry`
- 找不到時才 fallback 到 deduped timeline entry

這避免 deduped fullRange entry 與 cycle-year selectedYear 語意不一致造成誤判，也保留先前 duplicate boundary 的結論：lookup 行為應以 selected year draft 為準，而不是全域 deduped 單一 entry。

## 36. 第 61 包後目前限制

- full range cached formatter diagnostics 已通過 14829 筆查詢。
- cached formatter 69 組 duplicate boundary regression 已通過。
- cached formatter 2024～2030 regression 已通過。
- cached / non-cached lookup equivalence 已通過。
- cached / non-cached formatter representative equivalence 已通過。
- 既有 formatter 主流程尚未改用 cache。
- 既有 lookup 主流程尚未改用 cache。
- 尚未做 resolver replacement 風險評估。
- 尚未決定是否保留 non-cached helper 作為 baseline。
- 尚未決定是否保留 cache stats export。
- 尚未設計 cache 上限、LRU 或 eviction。
- UI 接入與盤面手動覆寫尚未開始。

## 37. 第 61 包後後續建議

1. 第 63 包：resolver replacement 風險評估 docs-only。
   - 評估是否讓 `resolveQimenJuFromFullTermCycleDraft(...)` 內部改用 cache。
   - 評估是否保留 `resolveQimenJuFromFullTermCycleDraftCached(...)` 作為 public helper。
   - 評估是否保留 non-cached lookup / formatter 作為測試 baseline。
   - 評估 cache stats export 是否保留到正式版本。
   - 評估 module-level cache 的上限、clear policy、LRU / eviction 是否必要。
2. 第 64 包：若風險評估通過，再做 formatter 主流程改用 cache。
3. 第 65 包：文件補充正式 formatter 改用 cache 結果。
4. UI 接入與盤面手動覆寫功能仍應等待 formatter 主線穩定後再做。

cache 是效能優化，不應改變結果。cached formatter 已通過 representative cases、2024～2030 regression、69 組 duplicate boundary regression 與 full range diagnostics。

但目前仍不建議直接替換正式 formatter 主流程，應先做 replacement 風險評估。duplicate start 語意也不能用全域 deduped entry 取代 cycle-year selectedYear entry。

## 38. 第 61 包結論

第 61 包完成 1899～2101 full range cached formatter diagnostics。

full range deduped timeline 共 14829 筆，已全部建立 cached formatter 查詢。置閏統計 282 筆，非置閏 14547 筆。陰遁與陽遁皆出現，1～9 局皆出現。

`selectedYear` fallback 存在且不因 cache 失效。cache stats 已確認 diagnostics 實際使用 yearDraft cache。

正式 lookup / formatter / resolver 主線目前仍未使用 cache。下一步應先做 resolver replacement 風險評估，而不是直接替換 formatter 主流程。
