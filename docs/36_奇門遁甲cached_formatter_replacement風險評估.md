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

## 7. 第 64 包 replacement 實作結果

第 64 包已完成短期建議方案 B：

- 只讓 `resolveQimenJuFromFullTermCycleDraft(dateTimeText, options = {})` 內部改用 cached lookup / yearDraft cache。
- `resolveQimenJuFromFullTermCycleDraftCached(dateTimeText, options = {})` 保留為正式 formatter wrapper。
- non-cached lookup `findQimenFullTermCycleTimelineDraftEntry(dateTimeText, options = {})` 保留。
- cached lookup `findQimenFullTermCycleTimelineDraftEntryCached(dateTimeText, options = {})` 保留。
- cache stats / clear helper 保留。
- 未修改 `resolveQimenJu()`。
- 未修改 `findQimenTimelineEntry(...)`。
- 未修改 `INITIAL_QIMEN_TIMELINE`。
- 未修改 `buildQimenYearSeedRecommendations(year)` 主線。
- 未修改 UI。
- 未修改 data JSON。

目前定位：

- 這次 replacement 只影響 full cycle draft formatter。
- 不代表正式 UI 主 resolver 已切換到 full cycle draft formatter。
- 不代表奇門主線已接 1899～2101 full cycle draft。
- `resolveQimenJu()` 初版 resolver 仍維持原流程。

### 7.1 code change summary

`src/qimenResolver.js`：

- `resolveQimenJuFromFullTermCycleDraft(...)` 由 non-cached lookup 改為 cached lookup。
- `resolveQimenJuFromFullTermCycleDraftCached(...)` 改為呼叫 / 包裝正式 `resolveQimenJuFromFullTermCycleDraft(...)`。
- formatter 組裝邏輯仍由共用 formatter helper 處理。
- `findQimenFullTermCycleTimelineDraftEntry(...)` 仍使用 non-cached provider。
- `findQimenFullTermCycleTimelineDraftEntryCached(...)` 仍使用 cached provider。
- `getQimenFullTermCycleTimelineDraftForYearCached(...)` / clear / stats 保留。

`tests/run-tests.js`：

- 新增 `qimenFullTermCycleDraftResolverFormatterCacheReplacementVerifiedCaseCount`。
- 新增 `runQimenFullTermCycleDraftResolverFormatterCacheReplacementTests()`。
- 主流程加入 replacement 測試呼叫。
- 新增輸出：
  - `奇門完整循環草案resolver formatter cache replacement測試通過：12 cases`

## 8. 第 64 包測試結果

第 64 包檢查結果：

- `npm test`：通過
- `git diff --check`：通過
- `node --check src/qimenResolver.js`：通過
- `node --check tests/run-tests.js`：通過

新增測試輸出：

```text
奇門完整循環草案resolver formatter cache replacement測試通過：12 cases
```

| 測試項目 | 結果 |
|---|---|
| 正式 `resolveQimenJuFromFullTermCycleDraft(...)` 使用 cache smoke | 通過 |
| `resolveQimenJuFromFullTermCycleDraftCached(...)` 與正式 formatter 8 筆代表案例一致 | 通過 |
| non-cached lookup baseline 與 cached lookup 結果一致 | 通過 |
| non-cached lookup 不污染 cache | 通過 |
| `resolveQimenJu()` 主流程 sanity | 通過 |

### 8.1 cached wrapper equivalence 代表案例

| 查詢時間 | 說明 |
|---|---|
| `1910-11-24T23:30:00+08:00` | duplicate boundary after |
| `1910-11-24T22:30:00+08:00` | duplicate boundary before |
| `2027-06-06T12:00:00+08:00` | 2027 芒種中元 |
| `2027-12-11T12:00:00+08:00` | 2027 閏大雪上元 |
| `2027-12-26T12:00:00+08:00` | 2027 冬至上元 |
| `2028-01-01T12:00:00+08:00` | 2028 年初 fallback |
| `2030-12-10T12:00:00+08:00` | 2030 閏大雪上元 |
| `2030-12-25T12:00:00+08:00` | 2030 冬至上元 |

每筆都比對正式 formatter 與 cached wrapper 完整結果一致。

比對欄位包含：

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

## 9. 第 64 包 replacement 驗證重點

### 9.1 正式 formatter 使用 cache

測試方式：

- clear cache
- 呼叫 `resolveQimenJuFromFullTermCycleDraft("2027-12-11T12:00:00+08:00")`
- 觀察 cache stats：size > 0、misses > 0
- 再呼叫 `resolveQimenJuFromFullTermCycleDraft("2027-12-16T12:00:00+08:00")`
- 觀察 cache hits 增加
- keys 包含 `year=2027|startTerm=大雪|before=0|after=15`

結論：

- 正式 draft formatter 已確認使用 cache。

### 9.2 non-cached lookup baseline 保留

測試方式：

- `findQimenFullTermCycleTimelineDraftEntry(...)`
- `findQimenFullTermCycleTimelineDraftEntryCached(...)`
- 比對 `2027-12-26T12:00:00+08:00` 結果一致。

另測：

- clear cache
- 呼叫 non-cached lookup
- cache stats 仍為 size 0 / hits 0 / misses 0

結論：

- non-cached lookup baseline 仍可用。
- non-cached lookup 不污染 cache。

### 9.3 `resolveQimenJu()` 主流程 sanity

測試：

```text
2027-12-26T12:00:00+08:00
```

預期：

| 欄位 | 值 |
|---|---|
| qimenSolarTerm | 冬至 |
| yuan | 上元 |
| dunName | 陽遁 |
| ju | 1 |
| isIntercalary | false |

結論：

- 第 64 包未誤碰 `resolveQimenJu()` 主流程。

## 10. 第 64 包後目前狀態

已完成：

- cached yearDraft helper。
- cached lookup helper。
- cached formatter wrapper。
- 正式 full cycle draft formatter 內部改用 cache。
- non-cached lookup baseline 保留。
- 2024～2030 regression 通過。
- 69 duplicate boundary regression 通過。
- 1899～2101 full range diagnostics 通過。
- replacement smoke / wrapper equivalence / baseline no-pollution 通過。

仍未完成：

- `resolveQimenJu()` 主 resolver 尚未切到 full cycle draft。
- UI 尚未接 full cycle draft formatter。
- 1080 盤面 lookup 尚未接。
- 手動覆寫遁別 / 局數 UI 尚未接。
- cache eviction / LRU 尚未設計。
- cache stats 是否長期保留尚未決定。
- docs/34 年度完整循環草案交接摘要尚未同步最新 replacement 狀態；若需要可後續另包整理。
- 尚未建立本階段總結交接文件。

## 11. 第 64 包後後續建議

1. 第 66 包：docs-only 階段交接摘要。
   - 彙整第 50～65 包 cache / formatter replacement 階段狀態。
   - 說明目前 full cycle draft formatter 已 cached。
   - 說明正式 `resolveQimenJu()` 尚未切換。
   - 說明後續可以開始討論 UI 接入前的資料 / formatter / plate lookup 邊界。
2. 後續可選：
   - 盤面 lookup 層設計。
   - UI 接 full cycle draft formatter。
   - 盤面缺資料 fallback。
   - 手動覆寫遁別 / 局數 UI 設計。
   - cache stats 正式化或隱藏。
3. 不建議立刻改 `resolveQimenJu()` 主線，除非另做完整替換評估。
4. 不建議現在直接接 UI，除非先整理 formatter 對 UI 的穩定回傳格式。

第 64 包是 full cycle draft formatter replacement，不是主 resolver replacement。cache 是效能優化，不改結果。目前最安全的下一步是文件收斂 / 階段交接，而不是繼續直接改 UI。

## 12. 第 64 包結論

第 64 包完成 `resolveQimenJuFromFullTermCycleDraft(...)` 內部改用 cache。

`resolveQimenJuFromFullTermCycleDraftCached(...)` 保留為 wrapper。non-cached lookup baseline 保留且不污染 cache。replacement tests 12 cases 通過。`resolveQimenJu()` 主流程 sanity 通過。

`INITIAL_QIMEN_TIMELINE` 與 `buildQimenYearSeedRecommendations(year)` 主線未修改。UI / data JSON 未修改。

目前 full cycle draft formatter 已具備 cache，但正式主 resolver 與 UI 尚未切換。下一步建議 docs-only 階段交接摘要。
