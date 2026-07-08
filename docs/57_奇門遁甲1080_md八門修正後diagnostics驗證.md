# 奇門遁甲 1080.md 八門修正後 diagnostics 驗證

## 1. 本包目的

本文件是新第 95 包 docs-only 驗證報告。目的為在使用者手修 `data/1080.md` 的八門成對缺漏 / 重複問題後，重新執行 parser diagnostics 與指定驗證命令，確認盤數、結構與剩餘 diagnostics 狀態。

本包只做驗證與報告，不繼續修改 `data/1080.md`。

## 2. 本次使用者已手修項目摘要

使用者已依 `docs/56_奇門遁甲1080_md成對元素缺漏重複修正清單.md` 第 6 節，手工修正 `MISSING_DOOR` / `DUPLICATE_DOOR` 成對清單中的八門問題。

## 3. 前一輪基準 stats

前一輪基準來自 `docs/56_奇門遁甲1080_md成對元素缺漏重複修正清單.md`：

| item | value |
|---|---:|
| `totalPlates` | 1080 |
| `yangPlates` | 540 |
| `yinPlates` | 540 |
| `errors` | 128 |
| `warnings` | 0 |
| `DUPLICATE_DOOR` | 21 |
| `MISSING_DOOR` | 21 |

## 4. 本輪修正後 stats

使用 `src/qimen1080MarkdownParser.js` 重新解析目前工作樹的 `data/1080.md` 後：

| item | value |
|---|---:|
| `totalPlates` | 1080 |
| `yangPlates` | 540 |
| `yinPlates` | 540 |
| `parsedPlates` | 1080 |
| `dunSections` | 2 |
| `juSections` | 18 |
| `dayGroups` | 90 |
| `errors` | 4 |
| `warnings` | 0 |

parser `ok` 為 `false`，原因是仍有 4 個 error diagnostics。

## 5. 前後差異表

| item | docs/56 基準 | 本輪修正後 | difference |
|---|---:|---:|---:|
| `totalPlates` | 1080 | 1080 | 0 |
| `yangPlates` | 540 | 540 | 0 |
| `yinPlates` | 540 | 540 | 0 |
| `errors` | 128 | 4 | -124 |
| `warnings` | 0 | 0 | 0 |
| `DUPLICATE_DOOR` | 21 | 0 | -21 |
| `MISSING_DOOR` | 21 | 0 | -21 |

## 6. 盤數與結構檢查

| check | result |
|---|---|
| 是否仍維持 1080 盤 | 是，`totalPlates: 1080` |
| 陽遁是否仍為 540 | 是，`yangPlates: 540` |
| 陰遁是否仍為 540 | 是，`yinPlates: 540` |
| 每局是否仍各 60 | 是，陽遁 1-9 局各 60，陰遁 1-9 局各 60 |
| `INVALID_TABLE_SHAPE` 是否仍為 0 | 是 |
| `PLATE_COUNT_MISMATCH` 是否仍為 0 | 是 |
| `UNKNOWN_STAR` / `UNKNOWN_DOOR` / `UNKNOWN_DEITY` / `UNKNOWN_STEM` 是否仍為 0 | 是 |
| `INVALID_CELL_FORMAT` 是否仍為 0 | 是 |
| `warnings` 是否仍為 0 | 是 |
| `MISSING_DOOR` / `DUPLICATE_DOOR` 是否歸零 | 是 |

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

## 8. 剩餘 diagnostics code count

| code | count |
|---|---:|
| `DUPLICATE_HEAVEN_STEM` | 1 |
| `MISSING_HEAVEN_STEM` | 1 |
| `DUPLICATE_EARTH_STEM` | 1 |
| `MISSING_EARTH_STEM` | 1 |

本輪未出現下列 diagnostics：

| code | count |
|---|---:|
| `DUPLICATE_DOOR` | 0 |
| `MISSING_DOOR` | 0 |
| `DUPLICATE_STAR` | 0 |
| `MISSING_STAR` | 0 |
| `DUPLICATE_DEITY` | 0 |
| `MISSING_DEITY` | 0 |
| `INVALID_TABLE_SHAPE` | 0 |
| `PLATE_COUNT_MISMATCH` | 0 |
| `INVALID_CELL_FORMAT` | 0 |
| `UNKNOWN_STAR` | 0 |
| `UNKNOWN_DOOR` | 0 |
| `UNKNOWN_DEITY` | 0 |
| `UNKNOWN_STEM` | 0 |

## 9. 指定驗證命令結果

| command | result |
|---|---|
| `npm test` | 通過 |
| `node --check src/qimen1080MarkdownParser.js` | 通過 |
| `node --check tests/run-tests.js` | 通過 |
| `git diff --check` | 通過 |

`npm test` 最後列出 `奇門1080.md parser diagnostics測試通過：3 cases`，整體測試流程完成且 exit code 為 0。

## 10. 下一步建議

八門 `MISSING_DOOR` / `DUPLICATE_DOOR` 已歸零。若依前一輪清單的修正順序，下一步原可進入 `MISSING_STAR` / `DUPLICATE_STAR`；但本輪 diagnostics code count 已未再出現星類缺漏 / 重複，實際剩餘問題集中在天盤干與地盤干各 1 組。

若後續仍需回查或處理星類相關項目，請維持下列原則：

* 天禽 / 中宮 / 寄宮相關項目不要硬改 `center`。
* 先修明顯非天禽 / 非中宮的星。
* 涉及天禽寄宮的項目可先保留，或另開 parser 規則討論。

## 11. 本包不處理項目

本包未處理且不應處理下列項目：

* 不修改 `data/1080.md`
* 不修改 parser
* 不修改 tests
* 不修改 UI
* 不產生 JSON
* 不寫入 `data/qimen/plates/**`
* 不做 converter
* 不做格局、卦名、斷語、吉凶

## 12. 結論

本輪八門手修後 diagnostics 驗證通過主要目標：

* 仍維持 1080 盤。
* 陽遁 / 陰遁仍各 540。
* 每局仍各 60。
* 結構型 diagnostics、unknown token、cell format 與 warnings 皆為 0。
* `MISSING_DOOR` / `DUPLICATE_DOOR` 已歸零。
* 剩餘 diagnostics 共 4 個，集中於天盤干 / 地盤干成對缺漏重複。
