# 52 奇門遁甲 1080.md 第三輪手修後 diagnostics 驗證

本文件是新第 90 包 docs-only 驗證報告，記錄使用者第三輪手動修正 `data/1080.md` 後，重新執行 `qimen1080MarkdownParser` 的 diagnostics 結果。

本包只做驗證與文件紀錄；不修改 parser、不修改 tests、不修改 UI、不產生 JSON，也不寫入 `data/qimen/plates/**`。

## 1. 本次第三輪手修項目摘要

使用者已手動修改 `data/1080.md`：

1. 找回第 89 包報告指出的陽遁二局甲己日缺少盤面 `己巳`。
2. 修正第 89 包報告列出的 3 筆 `INVALID_CELL_FORMAT`。

本次驗證僅重跑 parser diagnostics，未繼續修改 `data/1080.md`。

## 2. 前一輪 stats

第 89 包 `docs/51_奇門遁甲1080_md第二輪手修後diagnostics驗證.md` 記錄的前一輪 stats：

| 指標 | 前一輪 |
|---|---:|
| `totalPlates` | 1079 |
| `yangPlates` | 539 |
| `yinPlates` | 540 |
| `errors` | 192 |
| `warnings` | 0 |

## 3. 本輪修正後 stats

本次重跑 parser 後 stats：

| 指標 | 本輪 |
|---|---:|
| `totalPlates` | 1080 |
| `yangPlates` | 540 |
| `yinPlates` | 540 |
| `errors` | 179 |
| `warnings` | 0 |

補充 parser stats：

| 指標 | 本輪 |
|---|---:|
| `dunSections` | 2 |
| `juSections` | 18 |
| `dayGroups` | 90 |
| `parsedPlates` | 1080 |

## 4. 前後差異表

| 指標 | 前一輪 | 本輪 | 差異 |
|---|---:|---:|---:|
| `totalPlates` | 1079 | 1080 | +1 |
| `yangPlates` | 539 | 540 | +1 |
| `yinPlates` | 540 | 540 | 0 |
| `errors` | 192 | 179 | -13 |
| `warnings` | 0 | 0 | 0 |

## 5. 是否已回到 1080 盤

目前已回到 1080 盤。

| 遁別 | 本輪盤數 | 預期盤數 | 狀態 |
|---|---:|---:|---|
| 陽遁 | 540 | 540 | 通過 |
| 陰遁 | 540 | 540 | 通過 |
| 總數 | 1080 | 1080 | 通過 |

## 6. 陽遁二局是否已回到 60 盤

陽遁二局已回到 60 盤。

| 遁別 | 局數 | 本輪唯一時柱數 | 預期 | 缺少時柱 | 重複時柱 | 狀態 |
|---|---:|---:|---:|---|---|---|
| 陽遁 | 2 | 60 | 60 | 無 | 無 | 通過 |

本輪所有遁別 / 局數皆已達 60 個唯一時柱，沒有 `nonSixtyJuCounts`。

## 7. `PLATE_COUNT_MISMATCH` 是否歸零

`PLATE_COUNT_MISMATCH` 已歸零。

| code | 前一輪 | 本輪 | 狀態 |
|---|---:|---:|---|
| `PLATE_COUNT_MISMATCH` | 1 | 0 | 已歸零 |

## 8. `INVALID_CELL_FORMAT` 是否歸零

`INVALID_CELL_FORMAT` 已歸零。

| code | 前一輪 | 本輪 | 狀態 |
|---|---:|---:|---|
| `INVALID_CELL_FORMAT` | 3 | 0 | 已歸零 |

## 9. `UNKNOWN_*` 是否下降

| code | 前一輪 | 本輪 | 狀態 |
|---|---:|---:|---|
| `UNKNOWN_DOOR` | 13 | 13 | 未下降 |
| `UNKNOWN_DEITY` | 8 | 7 | 下降 |
| `UNKNOWN_STEM` | 1 | 1 | 未下降 |

代表案例：

| code | 代表位置 | 訊息 |
|---|---|---|
| `UNKNOWN_DOOR` | 陽遁一局 甲己日 丁卯 `dui` | 未知八門：`柱` |
| `UNKNOWN_DOOR` | 陽遁二局 甲己日 己巳 `zhen` | 未知八門：`辛` |
| `UNKNOWN_DOOR` | 陽遁四局 丁壬日 庚戌 `li` | 未知八門：`雀` |
| `UNKNOWN_DEITY` | 陽遁四局 丁壬日 庚戌 `li` | 未知八神簡稱：`休` |
| `UNKNOWN_DEITY` | 陰遁七局 乙庚日 丙子 `li` | 未知八神簡稱：`休` |
| `UNKNOWN_STEM` | 陽遁五局 丙辛日 乙未 `dui` | `heavenStem` 不是乙～癸：`生` |

## 10. 本輪 diagnostics code count

### 10.1 errors

| code | count |
|---|---:|
| `MISSING_DOOR` | 34 |
| `DUPLICATE_STAR` | 24 |
| `MISSING_STAR` | 24 |
| `DUPLICATE_DOOR` | 21 |
| `MISSING_DEITY` | 18 |
| `MISSING_HEAVEN_STEM` | 13 |
| `UNKNOWN_DOOR` | 13 |
| `DUPLICATE_HEAVEN_STEM` | 12 |
| `UNKNOWN_DEITY` | 7 |
| `DUPLICATE_DEITY` | 4 |
| `DUPLICATE_EARTH_STEM` | 3 |
| `MISSING_EARTH_STEM` | 3 |
| `ZHISHI_DOOR_NOT_FOUND` | 2 |
| `UNKNOWN_STEM` | 1 |

### 10.2 warnings

本輪 warnings 為 0，沒有 remaining warning code。

## 11. 剩餘 errors 的優先處理建議

建議下一輪處理順序：

1. 先處理 `UNKNOWN_DOOR` / `UNKNOWN_DEITY` / `UNKNOWN_STEM`。這些通常是 token 黏連、欄位錯位或單字誤植，可能會造成後續 `MISSING_*` / `DUPLICATE_*` 連鎖錯誤。
2. 處理 2 筆 `ZHISHI_DOOR_NOT_FOUND`，確認值使門是資料錯位、八門錯字，還是 parser 對該盤判讀不足。
3. 再分批處理 `MISSING_DOOR` / `DUPLICATE_DOOR`、`MISSING_STAR` / `DUPLICATE_STAR`。
4. 最後處理 `MISSING_DEITY` / `DUPLICATE_DEITY` 與天干缺漏 / 重複，避免在 unknown token 未釐清前誤修正確資料。

目前剩餘錯誤主要集中在 `MISSING_*` / `DUPLICATE_*`，但不應直接視為全都是資料錯。下一輪人工判讀前，應先分辨：

* 是否為 `data/1080.md` 原始資料誤植。
* 是否為 parser 對中宮、天禽寄宮、寄宮星神規則支援不足。
* 是否為前面的 unknown token 或欄位錯位造成的連鎖缺漏 / 重複。

## 12. 下一包建議

建議下一包繼續小範圍修 `data/1080.md`，但先只處理高信心項目：

1. 明顯的 `UNKNOWN_*` token。
2. 明確可定位的 `ZHISHI_DOOR_NOT_FOUND`。
3. 經人工確認不是中宮 / 寄宮規則造成的少量 `MISSING_*` / `DUPLICATE_*`。

若剩餘 `MISSING_*` / `DUPLICATE_*` 難以人工判斷，應先補強 parser diagnostics location 與中宮 / 寄宮規則註記，再繼續大批修資料。現階段不建議直接 converter 或寫入正式 JSON。

## 13. 本包不處理項目

* 不修改 parser。
* 不修改 tests。
* 不修改 UI。
* 不繼續修改 `data/1080.md`。
* 不產生 JSON。
* 不寫入 `data/qimen/plates/**`。
* 不做 converter。
* 不做格局、卦名、斷語、吉凶。

## 14. 本文件結論

第三輪手修已解決第 89 包的主要阻塞：

* 總盤數回到 1080。
* 陽遁二局回到 60 盤。
* `PLATE_COUNT_MISMATCH` 已歸零。
* `INVALID_CELL_FORMAT` 已歸零。
* errors 從 192 降至 179。
* warnings 維持 0。

目前仍有 179 errors，主要是 unknown token 與元素缺漏 / 重複。下一步應先處理高信心 `UNKNOWN_*` 與值使門問題，再判讀 `MISSING_*` / `DUPLICATE_*` 是資料問題、parser 規則不足，或前置錯誤造成的連鎖結果。
