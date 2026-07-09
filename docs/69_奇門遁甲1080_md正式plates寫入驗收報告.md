# 奇門遁甲 1080.md 正式 plates 寫入驗收報告

## 1. 本包目的

本文件是新第 112 包 docs-only 驗收報告，目的為整理第 111 包正式寫入 `data/qimen/plates/**` 後的驗收結果、測試結果、資料安全邊界、rollback 記錄與後續建議。

本包只整理正式 plates 寫入後的驗收報告：

* 不修改 code。
* 不修改 tests。
* 不修改 data。
* 不產生 JSON。
* 不接 UI。

## 2. 正式寫入摘要

第 111 包已正式寫入 18 個 `data/qimen/plates/{yang,yin}/ju-*.json`。

正式寫入後：

* skeleton / null plates 已替換為 formal plate object。
* `data/1080.md` 仍為母資料。
* `data/qimen/plates/**` 為由 `data/1080.md` 產生的正式衍生資料。
* 正式資料已可被既有 `getQimenPlate` lookup 讀取。

## 3. 修改檔案清單

第 111 包修改下列檔案：

```text
data/qimen/plates/yang/ju-1.json
data/qimen/plates/yang/ju-2.json
data/qimen/plates/yang/ju-3.json
data/qimen/plates/yang/ju-4.json
data/qimen/plates/yang/ju-5.json
data/qimen/plates/yang/ju-6.json
data/qimen/plates/yang/ju-7.json
data/qimen/plates/yang/ju-8.json
data/qimen/plates/yang/ju-9.json
data/qimen/plates/yin/ju-1.json
data/qimen/plates/yin/ju-2.json
data/qimen/plates/yin/ju-3.json
data/qimen/plates/yin/ju-4.json
data/qimen/plates/yin/ju-5.json
data/qimen/plates/yin/ju-6.json
data/qimen/plates/yin/ju-7.json
data/qimen/plates/yin/ju-8.json
data/qimen/plates/yin/ju-9.json
tests/run-tests.js
```

## 4. 未修改檔案 / 範圍

第 111 包未修改下列檔案與範圍：

* 未修改 `data/1080.md`。
* 未修改 `data/qimen/qimen_yuan_ju_table.json`。
* 未修改 resolver。
* 未修改 UI。
* 未修改 `src/qimenPlateLookup.js` / `getQimenPlate` implementation。
* 未修改 preview writer / formal adapter / formal candidate writer。
* 未做 method switch。
* 未做拆補法 / 茅山法 / 無閏法。
* 未做格局、卦名、斷語、吉凶。

## 5. 盤數與結構驗收

| item | result |
|---|---:|
| formal plates file count | 18 |
| 每檔 plate count | 60 |
| totalPlates | 1080 |
| yangPlates | 540 |
| yinPlates | 540 |
| byDunJu | 每局 60 |
| null plates | 0 |
| plate objects | 1080 |

## 6. validateQimenPlateFile 驗收

第 111 包驗證結果：

| item | result |
|---|---|
| 18 個正式 files | 全部通過 `validateQimenPlateFile` |
| validation errors | 0 |
| validation warnings | 0 |
| `meta.schemaVersion` | `"1.0.0"` |
| `meta.source` | `"data/1080.md"` |
| `plates` key | 60 六十甲子時柱 |

## 7. getQimenPlate 驗收

代表樣本驗收結果：

| sample | result |
|---|---|
| yang ju-1 甲子 | found true |
| yang ju-9 癸亥 | found true |
| yin ju-1 甲子 | found true |
| yin ju-9 癸亥 | found true |

lookup 行為整理：

* status 已從 `nullPlate` 轉為 `found`。
* invalid input 仍維持 `invalidInput`。
* clone safety 仍有測試。
* 18 file smoke 已改為 `found`。
* yang ju-1 60 hour pillars smoke 已改為 `found`。
* `getQimenPlate` implementation 未修改，只是正式資料由 null 變成 object。

## 8. tests/run-tests.js 調整摘要

第 111 包測試調整如下：

* qimen plate 資料檢查新增 / 使用 plate object count。
* `qimenPlateNullCount` 預期變成 0。
* `qimenPlateObjectCount` 預期 1080。
* lookup tests 從 `nullPlate` expectation 改成 `found` expectation。
* preview writer / formal adapter / formal candidate writer 的 safety 驗證改以正式 plates snapshot before / after 相同為主，不再期待 lookup `nullPlate`。
* 測試輸出改為可顯示 plate objects / null plates。

## 9. 驗證指令與結果

第 111 包回報的驗證結果：

| command | result |
|---|---|
| `npm test` | 通過 |
| `node --check src/qimen1080FormalCandidateWriter.js` | 通過 |
| `node --check src/qimen1080FormalPlateAdapter.js` | 通過 |
| `node --check src/qimen1080ConverterDryRun.js` | 通過 |
| `node --check src/qimen1080MarkdownParser.js` | 通過 |
| `node --check src/qimenPlateValidation.js` | 通過 |
| `node --check src/qimenPlateLookup.js` | 通過 |
| `node --check tests/run-tests.js` | 通過 |
| `git diff --check` | 通過 |

## 10. candidate output / tmp 清理

第 111 包完成後：

* `tmp/qimen1080-formal-candidate` 不存在。
* candidate output 已清理。
* 本包不保留 candidate JSON。
* 正式資料已在 `data/qimen/plates/**`。

## 11. rollback 記錄

rollback 原則：

* 第 111 commit 前可用 `git restore` 18 個 plates 檔 rollback。
* 第 111 已 commit 後，若要回退，應使用 `git revert` 或由使用者決定 reset。
* 不使用 `git reset --hard` 清理 unrelated files。
* 不清理 `2Drive.ffs_gui` / `玄學小工具.txt` / `Note.txt`。

## 12. 目前限制

目前仍未處理或仍保留第一版簡化的項目：

* UI 尚未顯示正式奇門盤面。
* center / 天禽已保留，但天禽寄宮未推導。
* `xunShou` 仍為 null。
* `isEmpty` 第一版 false，未推導空亡。
* `isHorse` 第一版 false，未推導驛馬。
* 格局、卦名、斷語、吉凶未做。
* method switch 未做，仍只做傳統置閏法主線。
* 盤面內容若有錯，應先修 `data/1080.md`，再重跑 parser / converter / adapter / writer，不應直接手修正式 JSON。

## 13. 後續建議

建議後續分包：

* 第 113 包：規劃 UI 顯示正式奇門盤面，docs-only。
* 或先做第 113 包：正式 plates lookup / data completion 階段總結文件，docs-only。
* 若要接 UI，應先規劃顯示欄位與 layout，不直接大改 UI。
* 建議下一步不要立刻大改 UI，可先做「正式 plates 階段交接摘要」。

## 14. 本包不處理項目

本包不處理：

* 不修改 code。
* 不修改 tests。
* 不修改 `data/1080.md`。
* 不修改 `data/qimen/plates/**`。
* 不產生 JSON。
* 不修改 `getQimenPlate`。
* 不接 UI。
* 不做 formal writer 新功能。
* 不做 method switch。
* 不做拆補法 / 茅山法 / 無閏法。
* 不做格局、卦名、斷語、吉凶。
* 不 commit。
