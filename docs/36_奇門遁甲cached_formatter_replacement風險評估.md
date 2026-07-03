# 36 奇門遁甲 cached formatter replacement 風險評估

本文件是第 63 包 docs-only 風險評估。

目標是評估是否可讓 `resolveQimenJuFromFullTermCycleDraft(...)` 內部改用 cache。本包不修改任何 code、tests、UI 或 data。

目前正式 `resolveQimenJu()` 主線仍維持原本 `INITIAL_QIMEN_TIMELINE` / 傳統置閏法初版流程。full cycle draft formatter 仍是平行驗證路線，不是 UI 主線。cache 是效能優化，不應改變結果。

## 1. 目前已完成驗證摘要

### 1.1 cached yearDraft cache helper

已新增 cached yearDraft cache helper：

- `getQimenFullTermCycleTimelineDraftForYearCached(year, options = {})`
- `clearQimenFullTermCycleTimelineDraftCache()`
- `getQimenFullTermCycleTimelineDraftCacheStats()`

目前 cache 是 module-level Map。key 格式例如：

```text
year=2027|startTerm=大雪|before=0|after=15
```

cached helper 回傳 clone，避免 mutation 污染 cache 內容。

已測項目：

- 2024～2030 cached / non-cached yearDraft equivalence
- mutation safety
- options normalization
- options split
- error no-pollution

### 1.2 cached lookup helper

已新增 cached lookup helper：

- `findQimenFullTermCycleTimelineDraftEntryCached(dateTimeText, options = {})`

此 helper 是 `findQimenFullTermCycleTimelineDraftEntry(...)` 的 cached parallel helper，使用 cached yearDraft helper，支援 `strategy: "cycle-year"`，也支援 `startYear` / `endYear`。

目前不改既有 lookup 主流程。

已測項目：

- 10 筆代表案例 cached / non-cached lookup equivalence
- 69 組 duplicate boundary cached / non-cached lookup equivalence
- fallback cache stats
- invalid strategy / missing data no-pollution

### 1.3 cached formatter helper

已新增 cached formatter helper：

- `resolveQimenJuFromFullTermCycleDraftCached(dateTimeText, options = {})`

此 helper 是 `resolveQimenJuFromFullTermCycleDraft(...)` 的 cached parallel helper，使用 cached lookup helper，回傳格式與 non-cached formatter 對齊。

目前不改既有 formatter 主流程。

已測項目：

- 11 筆代表案例 cached / non-cached formatter equivalence
- notes 行為一致
- cache stats
- invalid strategy / missing data no-pollution

### 1.4 regression / diagnostics

cached formatter 2024～2030 regression：

- 15 cases
- 14 筆固定案例 + 1 筆 cache stats
- 置閏 3、非置閏 11
- selectedYear fallback 1

cached formatter 69 組 duplicate boundary regression：

- 5 cases
- duplicateGroups.length = 69
- before / after mismatch 都是 0
- selectedYear 統計：
  - after current year = 69
  - before previous year = 23
  - before current year = 46
  - before other year = 0

cached formatter full range diagnostics：

- 7 cases
- 1899～2101
- yearDrafts.length = 203
- entryCountBeforeDedupe = 14898
- entryCountAfterDedupe = 14829
- duplicateStarts.length = 69
- gaps.length = 0
- overlaps.length = 0
- queryCount = 14829
- intercalaryResultCount = 282
- nonIntercalaryResultCount = 14547
- 陰陽遁皆出現
- 1～9 局皆出現
- selectedYearFallbackCount > 0
- cache stats 確認使用 cache

## 2. replacement 候選方案

### 2.1 方案 A：維持 parallel helper，不替換

保留：

- `resolveQimenJuFromFullTermCycleDraft(...)` non-cached
- `resolveQimenJuFromFullTermCycleDraftCached(...)` cached

UI / 未來測試可自行選擇 cached helper。

優點：

- 最安全
- baseline 清楚
- 可長期比較 cached / non-cached

缺點：

- API 增加
- 若未來 UI 要用 cache，需要明確選 cached helper
- 兩條路線可能長期並存

### 2.2 方案 B：讓正式 draft formatter 內部改用 cache

`resolveQimenJuFromFullTermCycleDraft(...)` 內部改呼叫 cached lookup。`resolveQimenJuFromFullTermCycleDraftCached(...)` 可保留為 alias 或 deprecated wrapper。non-cached lookup / private provider 還保留供測試 baseline。

優點：

- 對外 API 不變
- 高頻查詢自然受益
- 未來 UI 可直接用正式 formatter

缺點：

- cache 成為正式 formatter 行為的一部分
- module-level Map 生命周期要明確
- cache stats / clear 是否仍 export 要決定
- 若 cache key 未來擴充不完整，可能造成錯誤重用

### 2.3 方案 C：context cache，不採 module-level replacement

未來改成呼叫層 context cache，例如：

- `createQimenDraftLookupContext()`
- `resolveQimenJuFromFullTermCycleDraft(dateTimeText, { context })`

優點：

- cache 生命週期更清楚
- batch diagnostics / UI session 可自行控制
- 測試污染風險低

缺點：

- API 複雜
- 目前已完成 module-level cache helper，需要額外重構
- 對第一版可能過度設計

## 3. replacement 風險評估

| 風險 | 說明 | 目前緩解 | replacement 前是否仍需處理 |
|---|---|---|---|
| cache key 不完整 | 未來若新增 method / startTerm / 真太陽時 / 地區時間，key 若未納入會污染結果。 | key 已納入 year / startTerm / before / after；第一版不做 method switch。 | 需註明未來新增 method 時必須擴充 key。 |
| module-level Map 長期累積 | 單頁 app 長期使用可能累積 cache。 | 1899～2101 全範圍最多約 203～205 個 default year keys，規模可控。 | 需決定是否保留 clear helper；LRU 暫可不做。 |
| mutation 污染 | cache 若回傳同一物件，外部修改會污染。 | cached yearDraft 回傳 clone；mutation safety tests 已通過。 | 保留 clone 行為。 |
| duplicate start 語意 | 全域 dedupe entry 不能取代 cycle-year selectedYear entry。 | lookup strategy 仍以 selected year draft 為準；full range diagnostics 已用 selectedYear entry 對齊。 | 不可改成全域 deduped lookup。 |
| error no-pollution | invalid strategy / missing data 不應留下半成品 cache。 | 相關測試已通過。 | 保留現有錯誤處理。 |
| baseline 消失 | 若正式 formatter 改用 cache，non-cached baseline 可能不容易比較。 | 目前 parallel helper 還存在。 | 建議保留 non-cached private provider 或 test-only baseline。 |
| cache stats 是否正式輸出 | stats 對測試有用，但正式 API 是否應暴露待定。 | 目前已 export，測試使用。 | 建議暫時保留，等 UI 穩定後再決定是否移除或標記 diagnostic。 |
| `resolveQimenJu()` 主線混淆 | 正式 UI 主線目前可能仍用 `resolveQimenJu()` / INITIAL_QIMEN_TIMELINE；draft formatter replacement 不等於替換主 resolver。 | 文件多次標示 full cycle draft 是平行路線。 | commit message 與文件需明確，不宣稱替換正式奇門主線。 |

## 4. 建議決策

短期建議採用 **方案 B：讓正式 draft formatter 內部改用 cache**，但只限於：

```js
resolveQimenJuFromFullTermCycleDraft(...)
```

不要改：

```js
resolveQimenJu(...)
findQimenTimelineEntry(...)
INITIAL_QIMEN_TIMELINE
buildQimenYearSeedRecommendations(year)
```

建議理由：

- cached formatter 已通過 representative equivalence
- cached formatter 已通過 2024～2030 regression
- cached formatter 已通過 69 duplicate boundary regression
- cached formatter 已通過 1899～2101 full range diagnostics
- 對外 API 可維持不變
- cache 只影響 full cycle draft formatter，不影響目前正式 resolver 主線
- module-level cache 對 1899～2101 範圍規模可控
- 保留 non-cached lookup / private provider baseline，可降低 replacement 風險

不建議事項：

- 不建議現在改 `resolveQimenJu()`
- 不建議現在接 UI
- 不建議加入 method switch
- 不建議改成全域 deduped lookup
- 不建議移除 non-cached helper
- 不建議移除 cache stats / clear helper

## 5. 第 64 包建議實作範圍

### 5.1 code

修改 `src/qimenResolver.js`：

- 讓 `resolveQimenJuFromFullTermCycleDraft(dateTimeText, options = {})` 內部改用 cached lookup provider
- 或將其改為呼叫共用 private formatter helper + cached lookup
- 保留 `resolveQimenJuFromFullTermCycleDraftCached(...)`：
  - 可作為 alias
  - 或繼續保留平行 helper，但結果應與正式 formatter一致
- 保留 `findQimenFullTermCycleTimelineDraftEntry(...)` non-cached lookup
- 保留 `findQimenFullTermCycleTimelineDraftEntryCached(...)` cached lookup
- 不改 `resolveQimenJu()`

### 5.2 tests

修改 `tests/run-tests.js`：

- 既有 non-cached formatter regression 應仍通過，但名稱可能已不準，請評估是否改成 draft formatter regression
- 新增或調整 replacement tests：
  - `resolveQimenJuFromFullTermCycleDraft(...)` 確認使用 cache stats
  - 代表案例與 cached helper 結果一致
  - 2024～2030 regression 維持通過
  - 69 duplicate boundary regression 維持通過
  - full range diagnostics 可視情況保留或只跑 cached formatter 主流程
- 不要弱化既有 assertions

### 5.3 docs

第 65 包再補文件，不要在第 64 包同時大改文件。

## 6. replacement 後驗收條件

第 64 包完成後必須確認：

- `npm test` 通過
- `git diff --check` 通過
- `node --check src/qimenResolver.js` 通過
- `node --check tests/run-tests.js` 通過
- `resolveQimenJuFromFullTermCycleDraft(...)` 對外回傳欄位不變
- `resolveQimenJuFromFullTermCycleDraft(...)` 使用 cache stats 可觀察到 cache hit/miss
- `resolveQimenJuFromFullTermCycleDraftCached(...)` 與正式 formatter 結果一致
- `findQimenFullTermCycleTimelineDraftEntry(...)` non-cached 行為保留
- `findQimenFullTermCycleTimelineDraftEntryCached(...)` cached 行為保留
- `resolveQimenJu()` 主流程未修改
- `INITIAL_QIMEN_TIMELINE` 未修改
- `buildQimenYearSeedRecommendations(year)` 主線未修改
- UI 未修改
- data JSON 未修改
