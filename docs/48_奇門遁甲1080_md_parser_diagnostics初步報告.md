# 48 奇門遁甲 1080.md parser diagnostics 初步報告

本文件是新第 86 包 docs-only 報告，依新第 85 包 `qimen1080MarkdownParser` 初版產出。

本文件目的不是修正資料，而是列出目前 `data/1080.md` 可疑問題。本包不修改 `data/1080.md`，不修改 parser / tests。後續由使用者依報告修正 `data/1080.md`，再重新跑 diagnostics。

## 1. 執行摘要

目前 parser stats：

```text
totalPlates: 1078
yangPlates: 540
yinPlates: 538
errors: 249
warnings: 103
```

結論：

* 陽遁已解析 540 盤。
* 陰遁目前只解析 538 盤，少 2 盤。
* 目前不適合直接轉入 `data/qimen/plates/**`。
* 需先修正 `data/1080.md` 的格式 / 疑似錯字 / 缺漏後再匯入。

## 2. diagnostics code 統計

### 2.1 errors 統計

| code | count |
|---|---:|
| `MISSING_DOOR` | 40 |
| `MISSING_STAR` | 30 |
| `MISSING_DEITY` | 26 |
| `DUPLICATE_STAR` | 24 |
| `DUPLICATE_DOOR` | 21 |
| `MISSING_HEAVEN_STEM` | 19 |
| `UNKNOWN_DOOR` | 19 |
| `DUPLICATE_HEAVEN_STEM` | 12 |
| `INVALID_CELL_FORMAT` | 11 |
| `UNKNOWN_DEITY` | 11 |
| `UNKNOWN_STAR` | 10 |
| `MISSING_EARTH_STEM` | 5 |
| `DUPLICATE_DEITY` | 4 |
| `DUPLICATE_EARTH_STEM` | 4 |
| `DUPLICATE_PLATE` | 3 |
| `PLATE_COUNT_MISMATCH` | 3 |
| `ZHISHI_DOOR_NOT_FOUND` | 3 |
| `INVALID_TABLE_SHAPE` | 2 |
| `UNKNOWN_STEM` | 2 |

### 2.2 warnings 統計

| code | count |
|---|---:|
| `NORMALIZED_HOUR_PILLAR` | 89 |
| `SUSPICIOUS_TEXT` | 14 |

## 3. plate count 檢查

理想總盤數：1080。

目前解析盤數：1078。

* 陽遁：540 / 540
* 陰遁：538 / 540

不是 60 盤的局：

| 遁別 | 局數 | 目前盤數 | 預期盤數 | 差異 |
|---|---:|---:|---:|---:|
| 陰遁 | 6 | 58 | 60 | -2 |

目前 parser 也列出 `PLATE_COUNT_MISMATCH`，表示至少有局數盤數不足或解析後出現重複 / 缺漏。優先檢查陰遁六局附近的 markdown table shape 與時柱標題。

## 4. 疑似格式問題代表案例

以下只列代表案例，不展開全部 diagnostics。

| code | 遁別 | 局 | 時柱 | 宮位 | 原始文字 | 訊息 |
|---|---|---:|---|---|---|---|
| `INVALID_TABLE_SHAPE` | 陰遁 | 6 | - | - | `| 丙申 | | 直符：衝<br>直使：傷 |` | 盤面 table 應有 5 行 |
| `INVALID_CELL_FORMAT` | 陽遁 | 1 | 辛丑 | `dui` | `丁 柱<br>丁景 合` | 外宮第二行應為：地盤干 + 八門 + 八神 |
| `UNKNOWN_DOOR` | 陽遁 | 1 | 丁卯 | `dui` | - | 未知八門：柱 |
| `UNKNOWN_STAR` | 陽遁 | 1 | - | - | `直符：逢<br>直使：休` | 未知九星簡稱：逢 |
| `UNKNOWN_DEITY` | 陽遁 | 1 | 辛丑 | `dui` | - | 未知八神簡稱：(空) |
| `SUSPICIOUS_TEXT` | 陽遁 | 1 | - | - | `直符：逢<br>直使：休` | 九星簡稱出現「逢」，高度疑似「蓬」 |

補充：

* `丁景 合` 可能是空白遺失造成 token 黏在一起。
* `柱` 出現在八門欄位高度可疑，需回原文人工確認。
* `逢` 目前不被 parser 自動改成正式 `蓬`，只列 warning / error。

## 5. 時柱正規化 warning

`NORMALIZED_HOUR_PILLAR` 目前共 89 筆。多數可能是 `戍` -> `戌`。

這類目前是 warning。使用者應回頭把 `data/1080.md` 內的時柱統一修成正確 60 甲子字形。parser 目前只是為了能繼續解析，不能視為正式資料已修正。

代表案例：

| 遁別 | 局 | 原始時柱 | parser 使用值 | 說明 |
|---|---:|---|---|---|
| 陽遁 | 1 | 甲戍 | 甲戌 | 疑似 `戍` 誤作 `戌` |
| 陽遁 | 1 | 丙戍 | 丙戌 | 疑似 `戍` 誤作 `戌` |
| 陽遁 | 1 | 戊戍 | 戊戌 | 疑似 `戍` 誤作 `戌` |
| 陽遁 | 1 | 庚戍 | 庚戌 | 疑似 `戍` 誤作 `戌` |
| 陽遁 | 1 | 壬戍 | 壬戌 | 疑似 `戍` 誤作 `戌` |
| 陽遁 | 2 | 甲戍 | 甲戌 | 疑似 `戍` 誤作 `戌` |

## 6. 元素重複 / 缺漏問題

| code | count |
|---|---:|
| `MISSING_DOOR` | 40 |
| `DUPLICATE_DOOR` | 21 |
| `MISSING_STAR` | 30 |
| `DUPLICATE_STAR` | 24 |
| `MISSING_DEITY` | 26 |
| `DUPLICATE_DEITY` | 4 |
| `MISSING_HEAVEN_STEM` | 19 |
| `DUPLICATE_HEAVEN_STEM` | 12 |
| `MISSING_EARTH_STEM` | 5 |
| `DUPLICATE_EARTH_STEM` | 4 |

這類問題可能來自實際資料錯字，也可能來自 parser 初版對某些不規則格式解析不足。修正前不應直接寫入正式 JSON。需要先看代表案例決定是資料錯，還是 parser 規則需要補強。

## 7. 使用者修正建議

### 7.1 優先修正

* 造成少 2 盤的 table shape / header 問題。
* 明顯錯字，例如：
  * `逢` 疑似 `蓬`
  * `恐` 非八門
  * `戍` 應統一成 `戌`
* 空格造成的時柱拆開，例如 `壬 戌`。
* 宮格 token 黏在一起，例如門 / 神貼在一起。

### 7.2 需人工確認

* 元素重複 / 缺漏。
* 中宮格式異常。
* 直符星找不到對應宮。
* 直使門找不到對應宮。
* 看似可解析但與唯一性檢查不一致的盤。

### 7.3 不建議 parser 自動修正

* 不要自動把所有疑似字都改成 parser 猜測值。
* 不要在 parser 內硬寫特例修盤。
* 不要在資料未修完前轉 JSON。
* 不要直接進 UI 顯示。

## 8. 後續流程

1. 使用者依本報告修正 `data/1080.md`。
2. 新第 87 包：重跑 parser diagnostics。
3. 若仍有 errors / warnings，繼續修正。
4. 等 `totalPlates === 1080` 且重大 errors 清掉後，再規劃 converter。
5. converter 先輸出暫存結果或 dry-run diff。
6. 最後才寫入 `data/qimen/plates/**`。
7. 寫入後再跑 schema validation。
8. 再進 found plate UI rendering 設計。

## 9. 本包不處理項目

* 不修改 `data/1080.md`。
* 不修改 parser。
* 不修改 tests。
* 不修資料。
* 不產生 JSON。
* 不寫入 `data/qimen/plates/**`。
* 不做 UI。
* 不做格局。
* 不做卦名。
* 不做斷語。
* 不做吉凶。

## 10. 本文件結論

* parser 初版已可跑完 `data/1080.md`。
* 目前陽遁完整，陰遁少 2 盤。
* 目前有 249 errors、103 warnings。
* 應先修 `data/1080.md`，不要直接匯入正式 JSON。
* 下一步以資料修正與 diagnostics 收斂為主。
