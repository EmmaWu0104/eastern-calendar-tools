# 51 奇門遁甲 1080.md 第二輪手修後 diagnostics 驗證

本文件是新第 89 包 docs-only 驗證報告，記錄使用者第二輪手動修正 `data/1080.md` 後，重新執行 `qimen1080MarkdownParser` 的 diagnostics 結果。

本包只做驗證與文件紀錄；不修改 parser、不修改 tests、不修改 UI、不產生 JSON，也不寫入 `data/qimen/plates/**`。

## 1. 本次第二輪手修項目摘要

使用者已手動修改 `data/1080.md`：

1. 第一輪：補上陰遁六局缺少的 2 盤，並修正明顯疑似字。
2. 第二輪：依人工判讀修正陽遁二局 / 陽遁四局重複盤 header，以及少量明顯 cell format / unknown token 問題。

本次驗證僅重跑 parser diagnostics，未繼續修改 `data/1080.md`。

## 2. 前一輪 stats

第 88 包 `docs/50_奇門遁甲1080_md_manual_fix後diagnostics驗證.md` 記錄的前一輪 stats：

| 指標 | 前一輪 |
|---|---:|
| `totalPlates` | 1080 |
| `yangPlates` | 540 |
| `yinPlates` | 540 |
| `errors` | 223 |
| `warnings` | 4 |

## 3. 本輪修正後 stats

本次重跑 parser 後 stats：

| 指標 | 本輪 |
|---|---:|
| `totalPlates` | 1079 |
| `yangPlates` | 539 |
| `yinPlates` | 540 |
| `errors` | 192 |
| `warnings` | 0 |

補充 parser stats：

| 指標 | 本輪 |
|---|---:|
| `dunSections` | 2 |
| `juSections` | 18 |
| `dayGroups` | 90 |
| `parsedPlates` | 1079 |

## 4. 前後差異表

| 指標 | 前一輪 | 本輪 | 差異 |
|---|---:|---:|---:|
| `totalPlates` | 1080 | 1079 | -1 |
| `yangPlates` | 540 | 539 | -1 |
| `yinPlates` | 540 | 540 | 0 |
| `errors` | 223 | 192 | -31 |
| `warnings` | 4 | 0 | -4 |

## 5. 是否仍維持 1080 盤

目前未維持 1080 盤。

| 遁別 | 本輪盤數 | 預期盤數 | 狀態 |
|---|---:|---:|---|
| 陽遁 | 539 | 540 | 少 1 盤 |
| 陰遁 | 540 | 540 | 通過 |
| 總數 | 1079 | 1080 | 少 1 盤 |

## 6. 陽遁二局、陽遁四局盤數

| 遁別 | 局數 | 本輪唯一時柱數 | 預期 | 狀態 |
|---|---:|---:|---:|---|
| 陽遁 | 2 | 59 | 60 | 未通過 |
| 陽遁 | 4 | 60 | 60 | 通過 |

陽遁二局目前沒有重複時柱，但少 1 個唯一時柱。依 60 甲子比對，缺少：

| 遁別 | 局數 | 缺少時柱 |
|---|---:|---|
| 陽遁 | 2 | `己巳` |

這表示第二輪修正已解掉重複盤，但陽遁二局仍需要人工回查 `己巳` 盤是否缺漏、header 是否被誤改，或是否有 table 未被 parser 辨識為盤面。

## 7. `DUPLICATE_PLATE` 是否歸零

`DUPLICATE_PLATE` 已歸零。

| code | 前一輪 | 本輪 | 狀態 |
|---|---:|---:|---|
| `DUPLICATE_PLATE` | 3 | 0 | 已歸零 |

## 8. `PLATE_COUNT_MISMATCH` 是否歸零

`PLATE_COUNT_MISMATCH` 尚未歸零。

| code | 前一輪 | 本輪 | 狀態 |
|---|---:|---:|---|
| `PLATE_COUNT_MISMATCH` | 2 | 1 | 下降但未歸零 |

剩餘 1 筆：

| 遁別 | 局 | 訊息 |
|---|---:|---|
| 陽遁 | 2 | 每局應有 60 盤，目前為 59 盤 |

## 9. `INVALID_CELL_FORMAT` 是否下降

`INVALID_CELL_FORMAT` 已下降。

| code | 前一輪 | 本輪 | 狀態 |
|---|---:|---:|---|
| `INVALID_CELL_FORMAT` | 9 | 3 | 下降 |

剩餘 3 筆：

| 遁別 | 局 | 日群 | 時柱 | 宮位 | 原始文字 | 訊息 |
|---|---:|---|---|---|---|---|
| 陽遁 | 3 | 戊癸日 | 癸丑 | `xun` | `己 蓬 己<br>丙 杜 陰` | 宮格第一行應為：天盤干 + 九星 |
| 陰遁 | 3 | 丙辛日 | 癸巳 | `zhen` | `辛 英<br>戊 陳` | 外宮第二行應為：地盤干 + 八門 + 八神 |
| 陰遁 | 3 | 丁壬日 | 丙午 | `dui` | `戊 衝 癸<br>戊 休 合` | 宮格第一行應為：天盤干 + 九星 |

## 10. `UNKNOWN_*` 是否下降

| code | 前一輪 | 本輪 | 狀態 |
|---|---:|---:|---|
| `UNKNOWN_DOOR` | 16 | 13 | 下降 |
| `UNKNOWN_DEITY` | 10 | 8 | 下降 |
| `UNKNOWN_STEM` | 1 | 1 | 未下降 |

代表案例：

| code | 代表位置 | 訊息 |
|---|---|---|
| `UNKNOWN_DOOR` | 陽遁一局 甲己日 丁卯 `dui` | 未知八門：`柱` |
| `UNKNOWN_DOOR` | 陽遁四局 丁壬日 庚戌 `li` | 未知八門：`雀` |
| `UNKNOWN_DEITY` | 陽遁四局 丁壬日 庚戌 `li` | 未知八神簡稱：`休` |
| `UNKNOWN_DEITY` | 陰遁三局 丙辛日 癸巳 `zhen` | 未知八神簡稱：`(空)` |
| `UNKNOWN_STEM` | 陽遁五局 丙辛日 乙未 `dui` | `heavenStem` 不是乙～癸：`生` |

## 11. 本輪 diagnostics code count

### 11.1 errors

| code | count |
|---|---:|
| `MISSING_DOOR` | 34 |
| `MISSING_STAR` | 26 |
| `DUPLICATE_STAR` | 24 |
| `DUPLICATE_DOOR` | 21 |
| `MISSING_DEITY` | 20 |
| `MISSING_HEAVEN_STEM` | 15 |
| `UNKNOWN_DOOR` | 13 |
| `DUPLICATE_HEAVEN_STEM` | 12 |
| `UNKNOWN_DEITY` | 8 |
| `DUPLICATE_DEITY` | 4 |
| `DUPLICATE_EARTH_STEM` | 4 |
| `MISSING_EARTH_STEM` | 4 |
| `INVALID_CELL_FORMAT` | 3 |
| `ZHISHI_DOOR_NOT_FOUND` | 2 |
| `PLATE_COUNT_MISMATCH` | 1 |
| `UNKNOWN_STEM` | 1 |

### 11.2 warnings

本輪 warnings 為 0，沒有 remaining warning code。

## 12. 中宮 `壬<br>壬 禽` / `己<br>己 禽` 類型標註

本輪 diagnostics 未再出現舊報告中的中宮 `壬<br>壬 禽` / `己<br>己 禽` 類型，也沒有任何包含 `壬 禽` 或 `己 禽` 的 `SUSPICIOUS_TEXT` / `INVALID_CELL_FORMAT` diagnostics。

目前 `data/1080.md` 仍存在大量正常中宮形態，例如 `壬 禽<br>壬`、`己 禽<br>己`。這類資料應暫時保留，不建議做全域替換或格式化，以免誤修天禽寄宮資料。若下一輪要處理中宮，應只針對 parser 明確指出的 raw cell 逐筆判讀。

## 13. 剩餘 errors / warnings 優先處理建議

建議下一輪處理順序：

1. 先回查陽遁二局缺少的 `己巳` 盤，讓總盤數回到 1080，並讓 `PLATE_COUNT_MISMATCH` 歸零。
2. 處理剩餘 3 筆 `INVALID_CELL_FORMAT`，這些最可能造成後續 token 位移與連鎖 diagnostics。
3. 處理 `UNKNOWN_DOOR` / `UNKNOWN_DEITY` / `UNKNOWN_STEM`，優先查明是否為 token 黏連、欄位錯位或單字誤植。
4. 再重跑 diagnostics 後，才處理 `MISSING_*` / `DUPLICATE_*`，避免修到由前面錯位造成的連鎖問題。
5. `warnings` 已歸零，暫時不需另開 warning-only 修正批次。

## 14. 下一包建議

建議下一包先繼續小範圍修 `data/1080.md`，目標只放在：

1. 陽遁二局 `己巳` 盤缺漏 / header 辨識問題。
2. 3 筆 `INVALID_CELL_FORMAT`。
3. 少量明顯 `UNKNOWN_*`。

若陽遁二局 `己巳` 盤定位仍不方便，再補強 parser diagnostics location，例如在 `PLATE_COUNT_MISMATCH` 中列出缺少時柱，並在 table-level diagnostics 保留鄰近 header 或原始 block。現階段不建議直接 converter 或寫入正式 JSON。

## 15. 本包不處理項目

* 不修改 parser。
* 不修改 tests。
* 不修改 UI。
* 不繼續修改 `data/1080.md`。
* 不產生 JSON。
* 不寫入 `data/qimen/plates/**`。
* 不做 converter。
* 不做格局、卦名、斷語、吉凶。

## 16. 本文件結論

第二輪手修有效收斂 diagnostics：

* `DUPLICATE_PLATE` 已從 3 歸零。
* `INVALID_CELL_FORMAT` 從 9 降至 3。
* `UNKNOWN_DOOR` 從 16 降至 13。
* `UNKNOWN_DEITY` 從 10 降至 8。
* warnings 從 4 歸零。
* errors 從 223 降至 192。

但目前總盤數為 1079，陽遁二局仍少 `己巳` 1 盤，`PLATE_COUNT_MISMATCH` 尚未歸零。因此下一步仍應先做小範圍資料修正與 diagnostics 收斂，不建議直接進入 JSON 轉換。
