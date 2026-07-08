# 奇門遁甲 1080.md diagnostics 歸零最終驗證

## 1. 本包目的

本文件是新第 97 包 docs-only 最終驗證報告。目的為在使用者手工修正最後天盤干 / 地盤干成對缺漏重複問題後，重新執行 `src/qimen1080MarkdownParser.js` 解析目前工作樹的 `data/1080.md`，確認 parser diagnostics 是否已全數歸零。

本包只做最終 diagnostics 驗證與報告，不繼續修改 `data/1080.md`。

## 2. 本次使用者已手修項目摘要

使用者已手工修正最後 4 個 diagnostics 集中的天盤干 / 地盤干成對缺漏重複問題：

* `DUPLICATE_HEAVEN_STEM`
* `MISSING_HEAVEN_STEM`
* `DUPLICATE_EARTH_STEM`
* `MISSING_EARTH_STEM`

## 3. 前一輪基準

前一輪基準為第 95 包驗證時的剩餘 diagnostics 狀態：

| item | value |
|---|---:|
| `totalPlates` | 1080 |
| `yangPlates` | 540 |
| `yinPlates` | 540 |
| `errors` | 4 |
| `warnings` | 0 |
| `DUPLICATE_HEAVEN_STEM` | 1 |
| `MISSING_HEAVEN_STEM` | 1 |
| `DUPLICATE_EARTH_STEM` | 1 |
| `MISSING_EARTH_STEM` | 1 |

## 4. 本輪最終驗證 stats

使用 `src/qimen1080MarkdownParser.js` 重新解析目前工作樹的 `data/1080.md` 後：

| item | value |
|---|---:|
| `ok` | true |
| `totalPlates` | 1080 |
| `yangPlates` | 540 |
| `yinPlates` | 540 |
| `parsedPlates` | 1080 |
| `dunSections` | 2 |
| `juSections` | 18 |
| `dayGroups` | 90 |
| `errors` | 0 |
| `warnings` | 0 |

## 5. 前後差異表

| item | 前一輪基準 | 本輪最終驗證 | difference |
|---|---:|---:|---:|
| `totalPlates` | 1080 | 1080 | 0 |
| `yangPlates` | 540 | 540 | 0 |
| `yinPlates` | 540 | 540 | 0 |
| `errors` | 4 | 0 | -4 |
| `warnings` | 0 | 0 | 0 |
| `DUPLICATE_HEAVEN_STEM` | 1 | 0 | -1 |
| `MISSING_HEAVEN_STEM` | 1 | 0 | -1 |
| `DUPLICATE_EARTH_STEM` | 1 | 0 | -1 |
| `MISSING_EARTH_STEM` | 1 | 0 | -1 |

## 6. 盤數與 diagnostics 確認

| check | result |
|---|---|
| 是否維持 1080 盤 | 是，`totalPlates: 1080` |
| 陽遁是否為 540 | 是，`yangPlates: 540` |
| 陰遁是否為 540 | 是，`yinPlates: 540` |
| 每局是否各 60 | 是 |
| `errors` 是否為 0 | 是 |
| `warnings` 是否為 0 | 是 |
| diagnostics code count 是否為空 | 是，`{}` |

## 7. 每局盤數

| 遁別 | 局 | count |
|---|---:|---:|
| 陽遁 | 1 | 60 |
| 陽遁 | 2 | 60 |
| 陽遁 | 3 | 60 |
| 陽遁 | 4 | 60 |
| 陽遁 | 5 | 60 |
| 陽遁 | 6 | 60 |
| 陽遁 | 7 | 60 |
| 陽遁 | 8 | 60 |
| 陽遁 | 9 | 60 |
| 陰遁 | 1 | 60 |
| 陰遁 | 2 | 60 |
| 陰遁 | 3 | 60 |
| 陰遁 | 4 | 60 |
| 陰遁 | 5 | 60 |
| 陰遁 | 6 | 60 |
| 陰遁 | 7 | 60 |
| 陰遁 | 8 | 60 |
| 陰遁 | 9 | 60 |

## 8. 結構型 diagnostics 維持 0

| diagnostics | count | result |
|---|---:|---|
| `INVALID_TABLE_SHAPE` | 0 | 維持歸零 |
| `PLATE_COUNT_MISMATCH` | 0 | 維持歸零 |
| `UNKNOWN_STAR` | 0 | 維持歸零 |
| `UNKNOWN_DOOR` | 0 | 維持歸零 |
| `UNKNOWN_DEITY` | 0 | 維持歸零 |
| `UNKNOWN_STEM` | 0 | 維持歸零 |
| `INVALID_CELL_FORMAT` | 0 | 維持歸零 |

## 9. 指定驗證命令結果

| command | result |
|---|---|
| `npm test` | 通過 |
| `node --check src/qimen1080MarkdownParser.js` | 通過 |
| `node --check tests/run-tests.js` | 通過 |
| `git diff --check` | 通過 |

## 10. 本階段結論

* parser diagnostics 已歸零。
* `data/1080.md` 已可作為後續 converter 規劃依據。
* 本包仍未產生 JSON、未寫入 `data/qimen/plates/**`、未做 UI。

## 11. 下一步建議

* 先 commit 第 85～97 包整批 diagnostics / data 修正成果。
* 下一階段再規劃 converter dry-run。
* converter 第一版只做 dry-run 或暫存輸出，不直接覆蓋正式 `data/qimen/plates/**`。

## 12. 本包不處理項目

本包未處理且不應處理下列項目：

* 不修改 parser
* 不修改 tests
* 不修改 UI
* 不產生 JSON
* 不寫入 `data/qimen/plates/**`
* 不做 converter
* 不做格局、卦名、斷語、吉凶
* 不 commit
