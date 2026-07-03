# 37 奇門遁甲 cache / formatter 階段交接摘要

本文件是第 66 包 docs-only 交接摘要。

本文件彙整第 50～65 包完成的 cache / lookup / formatter replacement 階段。本階段只處理 full cycle draft formatter / lookup / cache，沒有接 UI，沒有接 1080 盤面 lookup，沒有修改 `resolveQimenJu()` 主 resolver，沒有修改 `INITIAL_QIMEN_TIMELINE`，也沒有修改奇門置閏核心規則。

本階段沒有加入拆補法、茅山法、無閏法或 method switch。

## 1. 階段完成狀態總覽

已完成：

- read-only per-year yearDraft cache helper。
- cached lookup helper。
- cached formatter helper / wrapper。
- cached / non-cached lookup equivalence tests。
- cached / non-cached formatter equivalence tests。
- 2024～2030 cached formatter regression。
- 69 組 duplicate boundary cached formatter regression。
- 1899～2101 full range cached formatter diagnostics。
- replacement 風險評估。
- `resolveQimenJuFromFullTermCycleDraft(...)` 內部改用 cache。
- replacement tests 12 cases。
- replacement 文件補充。

未完成：

- `resolveQimenJu()` 主 resolver 尚未切到 full cycle draft。
- UI 尚未接 full cycle draft formatter。
- 1080 盤面 lookup 尚未接。
- 盤面缺資料 fallback 尚未接。
- 手動覆寫遁別 / 局數 UI 尚未接。
- cache eviction / LRU 尚未設計。
- cache stats 是否長期保留尚未決定。
- docs/34 年度完整循環草案交接摘要尚未同步最新 replacement 狀態。
- 尚未建立 UI 接入前 formatter contract 文件。

## 2. 核心設計決策

### 2.1 只處理 full cycle draft formatter

- replacement 只限 `resolveQimenJuFromFullTermCycleDraft(...)`。
- 不代表 `resolveQimenJu()` 主 resolver replacement。
- 不代表 UI 已改用 full cycle draft formatter。
- 不代表奇門主線已切到 1899～2101 full cycle draft。

### 2.2 cache 是效能優化

- cache 不應改變結果。
- cache key 目前包含：
  - year
  - startTerm
  - beforeStartEffectiveDays
  - afterEndEffectiveDays
- key 範例：
  - `year=2027|startTerm=大雪|before=0|after=15`
- 第一版不納入 method，因為本專案第一版只做傳統置閏法，不做 method switch。
- 未來若加入 method / 真太陽時 / 地區時間，cache key 必須擴充。

### 2.3 cycle-year lookup 語意

- lookup strategy 仍是 `cycle-year`。
- candidate years 順序仍是：
  - civil year
  - civil year - 1
  - civil year + 1
- duplicate start 不能直接用全域 deduped entry 當唯一真相。
- lookup 結果應以 selectedYear 對應的 yearDraft entry 為準。

### 2.4 baseline 保留

- non-cached lookup `findQimenFullTermCycleTimelineDraftEntry(...)` 保留。
- cached lookup `findQimenFullTermCycleTimelineDraftEntryCached(...)` 保留。
- `resolveQimenJuFromFullTermCycleDraftCached(...)` 保留為正式 formatter wrapper。
- cache stats / clear helper 保留。

## 3. 目前重要函式狀態

| 函式 | 目前狀態 | 備註 |
|---|---|---|
| `resolveQimenJu(...)` | 未改 | 初版 resolver 主線，仍使用 INITIAL_QIMEN_TIMELINE |
| `findQimenTimelineEntry(...)` | 未改 | 查初版 timeline |
| `resolveQimenJuFromFullTermCycleDraft(...)` | 已改用 cache | full cycle draft formatter 正式入口 |
| `resolveQimenJuFromFullTermCycleDraftCached(...)` | wrapper | 呼叫正式 draft formatter |
| `findQimenFullTermCycleTimelineDraftEntry(...)` | non-cached baseline | 不污染 cache |
| `findQimenFullTermCycleTimelineDraftEntryCached(...)` | cached lookup | 使用 cached yearDraft |
| `getQimenFullTermCycleTimelineDraftForYearCached(...)` | cache helper | module-level Map + clone |
| `clearQimenFullTermCycleTimelineDraftCache()` | 保留 | 測試 / diagnostic 用 |
| `getQimenFullTermCycleTimelineDraftCacheStats()` | 保留 | 測試 / diagnostic 用 |
| `buildQimenYearSeedRecommendations(year)` | 未改 | 年度 seed 主線未動 |
| `INITIAL_QIMEN_TIMELINE` | 未改 | 仍由 2027 fixture 產生 |

## 4. 測試摘要

### 4.1 cache helper

- `奇門完整循環草案yearDraft cache測試通過：13 cases`
- 2024～2030 cached / non-cached yearDraft equivalence。
- mutation safety。
- options normalization / split。
- error no-pollution。

### 4.2 cached lookup

- `奇門完整循環Timeline草案cached lookup測試通過：16 cases`
- 10 筆代表案例 equivalence。
- 69 組 duplicate boundary lookup equivalence。
- fallback stats。
- invalid strategy / missing data no-pollution。

### 4.3 cached formatter

- `奇門完整循環草案cached resolver formatter測試通過：16 cases`
- 11 筆代表案例 equivalence。
- notes 行為一致。
- fallback stats。
- invalid strategy / missing data no-pollution。

### 4.4 cached formatter regression

- `奇門完整循環草案cached resolver formatter regression測試通過：15 cases`
- 14 筆 2024～2030 regression。
- 置閏 3、非置閏 11。
- selectedYear fallback 1。
- cache stats 確認使用 cache。

### 4.5 duplicate boundary regression

- `奇門完整循環草案cached resolver formatter duplicate boundary測試通過：5 cases`
- duplicateGroups.length = 69。
- after cached / non-cached 一致。
- before cached / non-cached 一致。
- mismatch count 全部 0。
- selectedYear 統計：
  - after current year = 69
  - before previous year = 23
  - before current year = 46
  - before other year = 0。
- 1910 sanity check 通過。

### 4.6 full range diagnostics

- `奇門完整循環草案cached resolver formatter full range diagnostics測試通過：7 cases`
- 1899～2101。
- yearDrafts.length = 203。
- entryCountBeforeDedupe = 14898。
- entryCountAfterDedupe = 14829。
- duplicateStarts.length = 69。
- gaps.length = 0。
- overlaps.length = 0。
- queryCount = 14829。
- intercalaryResultCount = 282。
- nonIntercalaryResultCount = 14547。
- 陰陽遁皆出現。
- 1～9 局皆出現。
- selectedYearFallbackCount > 0。
- cache stats 確認使用 cache。

### 4.7 replacement tests

- `奇門完整循環草案resolver formatter cache replacement測試通過：12 cases`
- 正式 `resolveQimenJuFromFullTermCycleDraft(...)` 使用 cache smoke 通過。
- `resolveQimenJuFromFullTermCycleDraftCached(...)` 與正式 formatter 8 筆代表案例一致。
- non-cached lookup baseline 與 cached lookup 結果一致。
- non-cached lookup 不污染 cache。
- `resolveQimenJu()` 主流程 sanity 通過。

## 5. 代表案例摘要

| 查詢時間 | 用途 | 期待重點 |
|---|---|---|
| `1910-11-24T23:30:00+08:00` | duplicate boundary after | selectedYear 1910，大雪上元 |
| `1910-11-24T22:30:00+08:00` | duplicate boundary before | selectedYear 1909，立冬下元 |
| `2027-06-06T12:00:00+08:00` | 2027 芒種中元 | selectedYear 2026 fallback |
| `2027-12-11T12:00:00+08:00` | 2027 閏大雪上元 | 置閏、陰遁四局 |
| `2027-12-22T12:00:00+08:00` | 2027 實際冬至後仍在閏大雪 | 置閏後接氣 |
| `2027-12-26T12:00:00+08:00` | 2027 冬至上元 | 陽遁一局 |
| `2028-01-01T12:00:00+08:00` | 年初 fallback | selectedYear 2027，冬至中元 |
| `2030-12-10T12:00:00+08:00` | 2030 閏大雪上元 | 置閏、陰遁四局 |
| `2030-12-25T12:00:00+08:00` | 2030 冬至上元 | 陽遁一局 |

## 6. 文件狀態

- `docs/35_奇門遁甲formatter_lookup_cache設計草案.md`
  - 記錄 cache 設計、cache helper、cached lookup、cached formatter、regression、duplicate boundary、full range diagnostics。
- `docs/36_奇門遁甲cached_formatter_replacement風險評估.md`
  - 記錄 replacement 風險評估與第 64 包正式 draft formatter 改用 cache 結果。
- 本文件 `docs/37_奇門遁甲cache_formatter階段交接摘要.md`
  - 彙整第 50～65 包階段交接狀態。
- `docs/34_奇門遁甲年度完整循環草案交接摘要.md`
  - 仍是年度完整循環草案較早期交接文件，尚未同步 cache replacement 最新狀態；後續若需要可另包整理。

## 7. 目前限制與注意事項

- full cycle draft formatter 已 cached，但 `resolveQimenJu()` 主 resolver 尚未切換。
- UI 尚未接 full cycle draft formatter。
- 1080 盤面 lookup 尚未接。
- 盤面 JSON 仍是 skeleton / null plates。
- 若未來 UI 查不到盤面，應顯示「盤面資料尚未建立，目前僅顯示定局結果」類似 fallback。
- 手動覆寫遁別 / 局數尚未接。
- 手動覆寫是 UI / 盤面查表層，不應回寫 resolver 結果。
- cache 是 module-level Map，目前未做 LRU / eviction。
- cache stats / clear helper 目前仍 export，主要供測試與 diagnostic。
- 未來若加入 method / 真太陽時 / 地區時間，cache key 必須擴充。
- duplicate start 語意必須以 cycle-year selectedYear entry 為準，不可改成全域 deduped lookup。
- 本階段沒有加入拆補法、茅山法、無閏法或 method switch。

## 8. 後續建議

1. 先暫停 cache / formatter replacement 階段。
2. 下一階段可先做 UI 接入前 contract 文件：
   - full cycle draft formatter 對 UI 回傳欄位。
   - 定局資訊欄位。
   - lookup metadata 是否顯示。
   - notes 顯示規則。
   - 缺盤 fallback。
3. 再做 1080 盤面 lookup 設計：
   - 以 `dunType + ju + hourPillar` 查盤。
   - JSON plate skeleton 目前為 null。
   - null plate fallback。
4. 再討論 UI 接 full cycle draft formatter。
5. 最後再討論手動覆寫遁別 / 局數 UI。
6. 不建議立刻改 `resolveQimenJu()` 主線。
7. 不建議未整理 UI contract 前直接接 UI。

## 9. 本階段結論

第 50～65 包完成奇門 full cycle draft formatter 的 cache 設計、helper 實作、lookup / formatter 對照、regression、full range diagnostics、replacement 風險評估與正式 draft formatter 改用 cache。

`resolveQimenJuFromFullTermCycleDraft(...)` 已成為 cached draft formatter 正式入口。`resolveQimenJuFromFullTermCycleDraftCached(...)` 保留為 wrapper。non-cached lookup baseline 保留。

full range diagnostics 已覆蓋 1899～2101 共 14829 筆查詢。replacement tests 已確認正式 draft formatter 使用 cache。

正式 `resolveQimenJu()` 主線仍未切換。UI / 1080 盤面 / 手動覆寫尚未開始。

下一階段建議先做 UI contract / 盤面 lookup 設計，而不是直接接 UI。
