# 54 奇門遁甲 1080.md unknown 修正後 diagnostics 驗證

本文件是新第 92 包 docs-only 驗證報告，記錄使用者依 `docs/53_奇門遁甲1080_md_unknown_token完整修正清單.md` 手工修正 `UNKNOWN_*` 後，重新執行 `qimen1080MarkdownParser` 的 diagnostics 結果。

本包只做驗證與文件紀錄；不修改 `data/1080.md`、parser、tests、UI，不產生 JSON，也不寫入 `data/qimen/plates/**`。

## 1. 本包目的

本包目標是驗證 `UNKNOWN_DOOR` / `UNKNOWN_DEITY` / `UNKNOWN_STEM` 手修後是否歸零，並確認盤數、warnings、`PLATE_COUNT_MISMATCH`、`INVALID_CELL_FORMAT` 等關鍵 diagnostics 是否仍維持穩定。

## 2. 本次使用者已手修項目摘要

使用者已依第 91 包 `docs/53_奇門遁甲1080_md_unknown_token完整修正清單.md`，手工修正 `data/1080.md` 中的：

* `UNKNOWN_DOOR`
* `UNKNOWN_DEITY`
* `UNKNOWN_STEM`

本次驗證未繼續修改 `data/1080.md`。

## 3. 前一輪基準 stats

本報告依第 90 包作為基準：

| 指標 | 第 90 包基準 |
|---|---:|
| `totalPlates` | 1080 |
| `yangPlates` | 540 |
| `yinPlates` | 540 |
| `errors` | 179 |
| `warnings` | 0 |
| `UNKNOWN_DOOR` | 13 |
| `UNKNOWN_DEITY` | 7 |
| `UNKNOWN_STEM` | 1 |

第 90 包當時另已達成：

| code / 指標 | 第 90 包基準 |
|---|---:|
| `PLATE_COUNT_MISMATCH` | 0 |
| `INVALID_CELL_FORMAT` | 0 |

## 4. 本輪修正後 stats

本次重跑 parser 後 stats：

| 指標 | 本輪 |
|---|---:|
| `totalPlates` | 1079 |
| `yangPlates` | 539 |
| `yinPlates` | 540 |
| `errors` | 130 |
| `warnings` | 0 |

補充 parser stats：

| 指標 | 本輪 |
|---|---:|
| `dunSections` | 2 |
| `juSections` | 18 |
| `dayGroups` | 90 |
| `parsedPlates` | 1079 |

## 5. 前後差異表

| 指標 | 第 90 包基準 | 本輪 | 差異 |
|---|---:|---:|---:|
| `totalPlates` | 1080 | 1079 | -1 |
| `yangPlates` | 540 | 539 | -1 |
| `yinPlates` | 540 | 540 | 0 |
| `errors` | 179 | 130 | -49 |
| `warnings` | 0 | 0 | 0 |
| `UNKNOWN_DOOR` | 13 | 0 | -13 |
| `UNKNOWN_DEITY` | 7 | 0 | -7 |
| `UNKNOWN_STEM` | 1 | 0 | -1 |

## 6. 是否仍維持 1080 盤

目前未維持 1080 盤。

| 指標 | 本輪 | 預期 | 狀態 |
|---|---:|---:|---|
| `totalPlates` | 1079 | 1080 | 少 1 盤 |

## 7. 陽遁 / 陰遁是否仍各 540

| 遁別 | 本輪盤數 | 預期盤數 | 狀態 |
|---|---:|---:|---|
| 陽遁 | 539 | 540 | 少 1 盤 |
| 陰遁 | 540 | 540 | 通過 |

## 8. 每局是否仍各 60 盤

目前不是每局都維持 60 盤。

| 遁別 | 局數 | 本輪唯一時柱數 | 預期 | 缺少時柱 | 重複時柱 | 狀態 |
|---|---:|---:|---:|---|---|---|
| 陽遁 | 4 | 59 | 60 | `戊戌` | 無 | 未通過 |

本輪與盤數相關的 table-level diagnostics：

| code | 遁別 | 局 | 日群 | raw / 訊息 |
|---|---|---:|---|---|
| `INVALID_TABLE_SHAPE` | 陽遁 | 4 | 丙辛日 | `| 戊戌           |              | 直符：柱<br>直使：驚 |`；盤面 table 應有 5 行 |
| `PLATE_COUNT_MISMATCH` | 陽遁 | 4 | - | 每局應有 60 盤，目前為 59 盤 |

## 9. `PLATE_COUNT_MISMATCH` 是否仍為 0

`PLATE_COUNT_MISMATCH` 未維持 0。

| code | 第 90 包基準 | 本輪 | 狀態 |
|---|---:|---:|---|
| `PLATE_COUNT_MISMATCH` | 0 | 1 | 回升 |

## 10. `INVALID_CELL_FORMAT` 是否仍為 0

`INVALID_CELL_FORMAT` 仍為 0。

| code | 第 90 包基準 | 本輪 | 狀態 |
|---|---:|---:|---|
| `INVALID_CELL_FORMAT` | 0 | 0 | 維持歸零 |

## 11. `UNKNOWN_*` 是否歸零

`UNKNOWN_DOOR` / `UNKNOWN_DEITY` / `UNKNOWN_STEM` 已全部歸零。

| code | 第 90 包基準 | 本輪 | 狀態 |
|---|---:|---:|---|
| `UNKNOWN_DOOR` | 13 | 0 | 已歸零 |
| `UNKNOWN_DEITY` | 7 | 0 | 已歸零 |
| `UNKNOWN_STEM` | 1 | 0 | 已歸零 |

## 12. warnings 是否仍為 0

warnings 仍為 0。

| 指標 | 第 90 包基準 | 本輪 | 狀態 |
|---|---:|---:|---|
| `warnings` | 0 | 0 | 維持歸零 |

## 13. 剩餘 diagnostics code count

### 13.1 errors

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
| `INVALID_TABLE_SHAPE` | 1 |
| `PLATE_COUNT_MISMATCH` | 1 |

### 13.2 warnings

本輪 warnings 為 0，沒有 remaining warning code。

## 14. 剩餘 errors 的下一步處理建議

`UNKNOWN_*` 已歸零，下一步不應再以 unknown token 為主軸，而應先處理重新出現的盤數 / table-level 問題：

1. 先修陽遁四局丙辛日 `戊戌` 的 `INVALID_TABLE_SHAPE`，讓該盤重新被 parser 納入，並確認 `PLATE_COUNT_MISMATCH` 回到 0。
2. 確認總盤數回到 1080、陽遁 / 陰遁各 540、每局各 60 後，再檢查是否仍有 `ZHISHI_DOOR_NOT_FOUND`。
3. 若 `UNKNOWN_*` 維持歸零，下一步才開始處理 `ZHISHI_DOOR_NOT_FOUND`。
4. 接著再處理 `MISSING_DOOR` / `DUPLICATE_DOOR`。
5. 再處理 `MISSING_STAR` / `DUPLICATE_STAR`。
6. 最後才處理 `MISSING_DEITY` / `DUPLICATE_DEITY` 與天干缺漏 / 重複。

處理 `MISSING_*` / `DUPLICATE_*` 前，仍需分辨是資料錯、parser 中宮 / 寄宮規則不足，還是前面 table shape 或欄位錯位造成的連鎖錯誤。

## 15. 本包不處理項目

* 不修改 `data/1080.md`。
* 不修改 parser。
* 不修改 tests。
* 不修改 UI。
* 不產生 JSON。
* 不寫入 `data/qimen/plates/**`。
* 不做 converter。
* 不做格局、卦名、斷語、吉凶。

## 16. 本文件結論

本輪手修對 unknown token 有效：

* `UNKNOWN_DOOR` 已歸零。
* `UNKNOWN_DEITY` 已歸零。
* `UNKNOWN_STEM` 已歸零。
* warnings 維持 0。
* errors 從第 90 包基準 179 降至 130。

但目前總盤數為 1079，陽遁四局少 `戊戌`，並重新出現 `INVALID_TABLE_SHAPE: 1` 與 `PLATE_COUNT_MISMATCH: 1`。下一輪應先恢復陽遁四局 `戊戌` 盤面 table shape 與 1080 盤數，再進入 `ZHISHI_DOOR_NOT_FOUND` 與 `MISSING_*` / `DUPLICATE_*` 的分批修正。
