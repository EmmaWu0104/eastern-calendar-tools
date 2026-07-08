# 50 奇門遁甲 1080.md manual fix 後 diagnostics 驗證

本文件是新第 88 包 docs-only 驗證報告，記錄使用者手動修正 `data/1080.md` 後，重新執行 `qimen1080MarkdownParser` 的 diagnostics 結果。

本包不修改 parser、不修改 tests、不修改 UI、不產生 JSON，也不寫入 `data/qimen/plates/**`。

## 1. 本次使用者已手修項目摘要

使用者已手動修改 `data/1080.md`：

1. 補上陰遁六局缺少的 2 盤。
2. 修正第 87 文件第 4 節列出的明顯疑似字修正候選。

本次驗證僅重跑 parser diagnostics，未繼續修 `data/1080.md`。

## 2. 修正前 stats

第 86 / 87 包記錄的修正前 stats：

| 指標 | 修正前 |
|---|---:|
| `totalPlates` | 1078 |
| `yangPlates` | 540 |
| `yinPlates` | 538 |
| `errors` | 249 |
| `warnings` | 103 |

## 3. 修正後 stats

本次重跑 parser 後 stats：

| 指標 | 修正後 |
|---|---:|
| `totalPlates` | 1080 |
| `yangPlates` | 540 |
| `yinPlates` | 540 |
| `errors` | 223 |
| `warnings` | 4 |

## 4. 修正前後差異表

| 指標 | 修正前 | 修正後 | 差異 |
|---|---:|---:|---:|
| `totalPlates` | 1078 | 1080 | +2 |
| `yangPlates` | 540 | 540 | 0 |
| `yinPlates` | 538 | 540 | +2 |
| `errors` | 249 | 223 | -26 |
| `warnings` | 103 | 4 | -99 |

## 5. 盤數檢查

目前已回到 1080 盤：

* 陽遁：540 / 540
* 陰遁：540 / 540
* 總數：1080 / 1080

陰遁六局已回到 60 盤：

| 遁別 | 局數 | 修正後盤數 | 預期盤數 | 狀態 |
|---|---:|---:|---:|---|
| 陰遁 | 6 | 60 | 60 | 通過 |

## 6. 重點 diagnostics 變化

| code | 修正前 | 修正後 | 狀態 |
|---|---:|---:|---|
| `INVALID_TABLE_SHAPE` | 2 | 0 | 已歸零 |
| `NORMALIZED_HOUR_PILLAR` | 89 | 0 | 已歸零 |
| `UNKNOWN_STAR` | 10 | 0 | 已歸零 |
| `UNKNOWN_DOOR` | 19 | 16 | 下降 |
| `UNKNOWN_DEITY` | 11 | 10 | 下降 |
| `UNKNOWN_STEM` | 2 | 1 | 下降 |
| `SUSPICIOUS_TEXT` | 14 | 4 | 下降 |

## 7. 修正後 diagnostics code count

### 7.1 errors

| code | count |
|---|---:|
| `MISSING_DOOR` | 37 |
| `MISSING_STAR` | 30 |
| `DUPLICATE_STAR` | 24 |
| `MISSING_DEITY` | 24 |
| `DUPLICATE_DOOR` | 21 |
| `MISSING_HEAVEN_STEM` | 19 |
| `UNKNOWN_DOOR` | 16 |
| `DUPLICATE_HEAVEN_STEM` | 12 |
| `UNKNOWN_DEITY` | 10 |
| `INVALID_CELL_FORMAT` | 9 |
| `DUPLICATE_DEITY` | 4 |
| `DUPLICATE_EARTH_STEM` | 4 |
| `MISSING_EARTH_STEM` | 4 |
| `DUPLICATE_PLATE` | 3 |
| `ZHISHI_DOOR_NOT_FOUND` | 3 |
| `PLATE_COUNT_MISMATCH` | 2 |
| `UNKNOWN_STEM` | 1 |

### 7.2 warnings

| code | count |
|---|---:|
| `SUSPICIOUS_TEXT` | 4 |

## 8. 剩餘問題代表案例

### 8.1 `PLATE_COUNT_MISMATCH` / `DUPLICATE_PLATE`

雖然總數已回到 1080，但仍有陽遁局數的重複 / 局內盤數問題：

| code | 遁別 | 局 | 時柱 | 訊息 |
|---|---|---:|---|---|
| `PLATE_COUNT_MISMATCH` | 陽遁 | 2 | - | 每局應有 60 盤，目前為 59 盤 |
| `PLATE_COUNT_MISMATCH` | 陽遁 | 4 | - | 每局應有 60 盤，目前為 58 盤 |
| `DUPLICATE_PLATE` | 陽遁 | 2 | 乙巳 | 重複盤面：`yang:2:乙巳` |
| `DUPLICATE_PLATE` | 陽遁 | 4 | 乙巳 | 重複盤面：`yang:4:乙巳` |
| `DUPLICATE_PLATE` | 陽遁 | 4 | 癸亥 | 重複盤面：`yang:4:癸亥` |

這表示下一輪應先處理陽遁二局與陽遁四局的重複 / 缺漏，而不是直接轉 JSON。

### 8.2 `INVALID_CELL_FORMAT`

剩餘 9 筆，代表案例：

| 遁別 | 局 | 日群 | 時柱 | 宮位 | 原始文字 | 訊息 |
|---|---:|---|---|---|---|---|
| 陽遁 | 1 | 戊癸日 | 丙辰 | `center` | `壬<br>壬 禽` | 宮格第一行應為：天盤干 + 九星 |
| 陽遁 | 2 | 甲己日 | 壬申 | `kan` | `癸 柱<br>乙 蛇` | 外宮第二行應為：地盤干 + 八門 + 八神 |
| 陽遁 | 3 | 戊癸日 | 癸丑 | `xun` | `二 蓬 己<br>丙 杜 陰` | 宮格第一行應為：天盤干 + 九星 |
| 陽遁 | 4 | 丁壬日 | 乙巳 | `center` | `己<br>己 禽` | 宮格第一行應為：天盤干 + 九星 |
| 陽遁 | 8 | 丁壬日 | 己酉 | `li` | `壬 衝<br>己 符` | 外宮第二行應為：地盤干 + 八門 + 八神 |

### 8.3 `UNKNOWN_*`

| code | count | 代表案例 |
|---|---:|---|
| `UNKNOWN_DOOR` | 16 | 陽遁一局丁卯 `dui`：未知八門 `柱`；陽遁二局甲己日壬申 `kan`：未知八門 `蛇` |
| `UNKNOWN_DEITY` | 10 | 陽遁二局甲己日壬申 `kan`：未知八神 `(空)`；陽遁四局丁壬日庚戌 `li`：未知八神 `休` |
| `UNKNOWN_STEM` | 1 | 陽遁五局丙辛日乙未 `dui`：`heavenStem` 不是乙～癸：`生` |

### 8.4 `SUSPICIOUS_TEXT`

修正後只剩 4 筆，皆為中宮格式：

| 遁別 | 局 | 日群 | 時柱 | 宮位 | 原始文字 | 訊息 |
|---|---:|---|---|---|---|---|
| 陽遁 | 1 | 戊癸日 | 丙辰 | `center` | `壬<br>壬 禽` | 中宮第二行應只有地盤干 |
| 陽遁 | 4 | 丁壬日 | 乙巳 | `center` | `己<br>己 禽` | 中宮第二行應只有地盤干 |
| 陰遁 | 9 | 甲己日 | 癸酉 | `center` | `壬<br>壬 禽` | 中宮第二行應只有地盤干 |
| 陰遁 | 9 | 戊癸日 | 丙辰 | `center` | `壬<br>壬 禽` | 中宮第二行應只有地盤干 |

## 9. 剩餘 errors / warnings 的優先處理建議

建議下一輪處理順序：

1. 先處理陽遁二局與陽遁四局的 `PLATE_COUNT_MISMATCH` / `DUPLICATE_PLATE`。
2. 處理 9 筆 `INVALID_CELL_FORMAT`，尤其 token 缺漏或中宮行序異常。
3. 處理 `UNKNOWN_DOOR` / `UNKNOWN_DEITY` / `UNKNOWN_STEM`。
4. 重跑 diagnostics 後再判讀 `MISSING_*` / `DUPLICATE_*`，避免處理 parser 連鎖錯誤。
5. 最後再確認剩餘 4 筆 `SUSPICIOUS_TEXT` 是資料格式問題，還是 parser 對中宮格式需補強。

## 10. 下一包建議

建議下一包繼續修 `data/1080.md`，但範圍要小：

* 優先修陽遁二局、陽遁四局的重複 / 缺漏。
* 同包可修少量 `INVALID_CELL_FORMAT`，但不要一次大改所有 223 errors。
* 每修一批都重跑 `npm test` 與 parser diagnostics。

若人工定位仍不方便，則先補強 parser diagnostics location：

* 在 diagnostics 中加入 `startLine` / `endLine`。
* 對 table-level diagnostics 保留 raw table block。
* 對 `PLATE_COUNT_MISMATCH` 輸出缺少的 hourPillar 清單。

## 11. 本包不處理項目

* 不修改 parser。
* 不修改 tests。
* 不修改 UI。
* 不產生 JSON。
* 不寫入 `data/qimen/plates/**`。
* 不做 converter。
* 不做格局、卦名、斷語、吉凶。

## 12. 本文件結論

使用者本輪手修已有效收斂 diagnostics：

* 盤數已回到 1080。
* 陰遁六局已回到 60 盤。
* `INVALID_TABLE_SHAPE` 已歸零。
* `NORMALIZED_HOUR_PILLAR` 已歸零。
* `UNKNOWN_STAR` 已歸零。
* warnings 從 103 降至 4。

目前仍有 223 errors，主要集中在元素缺漏 / 重複、未知門神、少量 cell format 與陽遁二局 / 四局局內盤數問題。下一步仍應繼續做資料修正與 diagnostics 收斂，不建議直接 converter 寫入正式 JSON。
