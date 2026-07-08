# 55 奇門遁甲 1080.md table shape 修正後 diagnostics 驗證

本文件是新第 93 包 docs-only 驗證報告，記錄使用者修正陽遁四局丙辛日 `戊戌` 盤 table shape 後，重新執行 `qimen1080MarkdownParser` 的 diagnostics 結果。

本包只做驗證與文件紀錄；不修改 `data/1080.md`、parser、tests、UI，不產生 JSON，也不寫入 `data/qimen/plates/**`。

## 1. 本包目的

本包目標是驗證陽遁四局丙辛日 `戊戌` table shape 修正後：

* 是否回到 1080 盤。
* 陽遁 / 陰遁是否各 540。
* 每局是否各 60。
* `INVALID_TABLE_SHAPE` / `PLATE_COUNT_MISMATCH` 是否歸零。
* `UNKNOWN_*`、`INVALID_CELL_FORMAT`、warnings 是否維持歸零。

## 2. 本次使用者已手修項目摘要

使用者已手工修正 `data/1080.md`：

* 陽遁四局丙辛日 `戊戌` 盤第二行原本多出 `| 休`。
* 原錯誤行類似：`| 丙 芮<br>乙 杜 天 | 己 禽<br>己     | 壬 任<br>辛 開 合 | 休`。
* 已移除多餘欄位，使 table shape 回復正常。

本次驗證未繼續修改 `data/1080.md`。

## 3. 前一輪基準 stats

前一輪基準為第 92 包 `docs/54_奇門遁甲1080_md_unknown修正後diagnostics驗證.md`：

| 指標 / code | 前一輪 |
|---|---:|
| `totalPlates` | 1079 |
| `yangPlates` | 539 |
| `yinPlates` | 540 |
| `errors` | 130 |
| `warnings` | 0 |
| `INVALID_TABLE_SHAPE` | 1 |
| `PLATE_COUNT_MISMATCH` | 1 |
| `UNKNOWN_DOOR` | 0 |
| `UNKNOWN_DEITY` | 0 |
| `UNKNOWN_STEM` | 0 |

## 4. 本輪修正後 stats

本次重跑 parser 後 stats：

| 指標 | 本輪 |
|---|---:|
| `totalPlates` | 1080 |
| `yangPlates` | 540 |
| `yinPlates` | 540 |
| `errors` | 128 |
| `warnings` | 0 |

補充 parser stats：

| 指標 | 本輪 |
|---|---:|
| `dunSections` | 2 |
| `juSections` | 18 |
| `dayGroups` | 90 |
| `parsedPlates` | 1080 |

## 5. 前後差異表

| 指標 / code | 前一輪 | 本輪 | 差異 |
|---|---:|---:|---:|
| `totalPlates` | 1079 | 1080 | +1 |
| `yangPlates` | 539 | 540 | +1 |
| `yinPlates` | 540 | 540 | 0 |
| `errors` | 130 | 128 | -2 |
| `warnings` | 0 | 0 | 0 |
| `INVALID_TABLE_SHAPE` | 1 | 0 | -1 |
| `PLATE_COUNT_MISMATCH` | 1 | 0 | -1 |
| `UNKNOWN_DOOR` | 0 | 0 | 0 |
| `UNKNOWN_DEITY` | 0 | 0 | 0 |
| `UNKNOWN_STEM` | 0 | 0 | 0 |

## 6. 是否回到 1080 盤

目前已回到 1080 盤。

| 指標 | 本輪 | 預期 | 狀態 |
|---|---:|---:|---|
| `totalPlates` | 1080 | 1080 | 通過 |

## 7. 陽遁 / 陰遁是否各 540

| 遁別 | 本輪盤數 | 預期盤數 | 狀態 |
|---|---:|---:|---|
| 陽遁 | 540 | 540 | 通過 |
| 陰遁 | 540 | 540 | 通過 |

## 8. 每局是否各 60

目前每局皆為 60 盤，沒有 `nonSixtyJuCounts`。

| 檢查項目 | 狀態 |
|---|---|
| 陽遁一至九局 | 每局 60 盤 |
| 陰遁一至九局 | 每局 60 盤 |
| 缺少時柱 | 無 |
| 重複時柱 | 無 |

## 9. `INVALID_TABLE_SHAPE` 是否歸零

`INVALID_TABLE_SHAPE` 已歸零。

| code | 前一輪 | 本輪 | 狀態 |
|---|---:|---:|---|
| `INVALID_TABLE_SHAPE` | 1 | 0 | 已歸零 |

## 10. `PLATE_COUNT_MISMATCH` 是否歸零

`PLATE_COUNT_MISMATCH` 已歸零。

| code | 前一輪 | 本輪 | 狀態 |
|---|---:|---:|---|
| `PLATE_COUNT_MISMATCH` | 1 | 0 | 已歸零 |

## 11. `UNKNOWN_*` 是否維持歸零

`UNKNOWN_DOOR` / `UNKNOWN_DEITY` / `UNKNOWN_STEM` 維持歸零。

| code | 前一輪 | 本輪 | 狀態 |
|---|---:|---:|---|
| `UNKNOWN_DOOR` | 0 | 0 | 維持歸零 |
| `UNKNOWN_DEITY` | 0 | 0 | 維持歸零 |
| `UNKNOWN_STEM` | 0 | 0 | 維持歸零 |

## 12. `INVALID_CELL_FORMAT` 是否仍為 0

`INVALID_CELL_FORMAT` 仍為 0。

| code | 前一輪 | 本輪 | 狀態 |
|---|---:|---:|---|
| `INVALID_CELL_FORMAT` | 0 | 0 | 維持歸零 |

## 13. warnings 是否仍為 0

warnings 仍為 0。

| 指標 | 前一輪 | 本輪 | 狀態 |
|---|---:|---:|---|
| `warnings` | 0 | 0 | 維持歸零 |

## 14. 剩餘 diagnostics code count

### 14.1 errors

| code | count |
|---|---:|
| `DUPLICATE_STAR` | 24 |
| `MISSING_STAR` | 24 |
| `DUPLICATE_DOOR` | 21 |
| `MISSING_DOOR` | 21 |
| `DUPLICATE_HEAVEN_STEM` | 12 |
| `MISSING_HEAVEN_STEM` | 12 |
| `DUPLICATE_DEITY` | 4 |
| `MISSING_DEITY` | 4 |
| `DUPLICATE_EARTH_STEM` | 3 |
| `MISSING_EARTH_STEM` | 3 |

### 14.2 warnings

本輪 warnings 為 0，沒有 remaining warning code。

## 15. 下一步建議

目前剩餘 errors 已只剩 `MISSING_*` / `DUPLICATE_*` 類型。下一輪建議依序處理：

1. 先處理 `MISSING_DOOR` / `DUPLICATE_DOOR`。
2. 再處理 `MISSING_STAR` / `DUPLICATE_STAR`。
3. 再處理天干缺漏 / 重複，也就是 `MISSING_HEAVEN_STEM` / `DUPLICATE_HEAVEN_STEM`、`MISSING_EARTH_STEM` / `DUPLICATE_EARTH_STEM`。
4. 最後處理 `MISSING_DEITY` / `DUPLICATE_DEITY`。

每一類都要成對看，不要單看 missing 或 duplicate。缺漏與重複通常是同一個盤面內某個 token 放錯、漏寫、重複或中宮 / 寄宮規則造成的結果；若只修 missing，可能會把另一個 duplicate 留在原地，或誤改正確資料。

建議每次只修一小批同類型問題，重跑 parser diagnostics 確認：

* 總盤數仍為 1080。
* 陽遁 / 陰遁仍各 540。
* 每局仍各 60。
* `INVALID_TABLE_SHAPE`、`PLATE_COUNT_MISMATCH`、`UNKNOWN_*`、`INVALID_CELL_FORMAT` 維持 0。

## 16. 本包不處理項目

* 不修改 `data/1080.md`。
* 不修改 parser。
* 不修改 tests。
* 不修改 UI。
* 不產生 JSON。
* 不寫入 `data/qimen/plates/**`。
* 不做 converter。
* 不做格局、卦名、斷語、吉凶。

## 17. 本文件結論

本輪 table shape 修正有效：

* 總盤數回到 1080。
* 陽遁 / 陰遁各 540。
* 每局各 60。
* `INVALID_TABLE_SHAPE` 歸零。
* `PLATE_COUNT_MISMATCH` 歸零。
* `UNKNOWN_*` 維持歸零。
* `INVALID_CELL_FORMAT` 維持歸零。
* warnings 維持 0。

目前剩餘 128 errors，全部集中在 `MISSING_*` / `DUPLICATE_*` 類型。下一步可以開始進入成對的元素缺漏 / 重複人工修正清單。
