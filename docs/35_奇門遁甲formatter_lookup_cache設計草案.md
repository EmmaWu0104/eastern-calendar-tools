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
