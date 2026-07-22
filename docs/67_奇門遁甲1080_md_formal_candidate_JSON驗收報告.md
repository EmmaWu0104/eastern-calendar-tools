# 奇門遁甲 1080.md formal candidate JSON 驗收報告

## 1. 本包目的

本文件是新第 109 包 docs-only 驗收報告。目的為臨時使用 `src/qimen1080FormalCandidateWriter.js` 產生 `tmp/qimen1080-formal-candidate/**`，讀取 18 個 formal candidate JSON 並整理驗收摘要。

candidate 檔僅作為本包驗收用暫存產物，驗收後已清理。本包不保留 candidate JSON，不將 candidate JSON 進版控，不寫正式 `data/qimen/plates/**`。

## 2. 驗收輸入

| input | 說明 |
|---|---|
| `data/1080.md` | 已完成 parser diagnostics 歸零的來源資料 |
| `src/qimen1080MarkdownParser.js` | 解析 `data/1080.md` |
| `src/qimen1080ConverterDryRun.js` | 產生 dry-run normalized objects |
| `src/qimen1080FormalPlateAdapter.js` | 產生 formal candidate file content |
| `src/qimen1080FormalCandidateWriter.js` | 臨時輸出 formal candidate JSON |
| `src/qimenPlateValidation.js` / `validateQimenPlateFile` | 驗證 candidate files |

## 3. 臨時輸出位置

本包臨時輸出位置：

```text
tmp/qimen1080-formal-candidate/
```

驗收完成後已呼叫 `clearQimen1080FormalCandidateOutput()` 清理。

| item | value |
|---|---|
| `cleanup.ok` | true |
| `tmp/qimen1080-formal-candidate` 是否仍存在 | false |

## 4. candidate file 結構驗收

檔案總數：

| item | value |
|---|---:|
| candidate JSON file count | 18 |

預期檔案存在性：

| file | exists |
|---|---|
| `yang/ju-1.json` | true |
| `yang/ju-2.json` | true |
| `yang/ju-3.json` | true |
| `yang/ju-4.json` | true |
| `yang/ju-5.json` | true |
| `yang/ju-6.json` | true |
| `yang/ju-7.json` | true |
| `yang/ju-8.json` | true |
| `yang/ju-9.json` | true |
| `yin/ju-1.json` | true |
| `yin/ju-2.json` | true |
| `yin/ju-3.json` | true |
| `yin/ju-4.json` | true |
| `yin/ju-5.json` | true |
| `yin/ju-6.json` | true |
| `yin/ju-7.json` | true |
| `yin/ju-8.json` | true |
| `yin/ju-9.json` | true |

meta / plates 驗收：

| check | result |
|---|---|
| 每檔 `meta.schemaVersion === "1.0.0"` | true |
| 每檔 `meta.dunType` 正確 | true |
| 每檔 `meta.dunName` 正確 | true |
| 每檔 `meta.ju` 正確 | true |
| 每檔 `meta.plateCount === 60` | true |
| 每檔 `meta.source === "data/1080.md"` | true |
| 每檔 `meta.notes === "由 data/1080.md 轉換產生。"` | true |
| 每檔 `plates` count === 60 | true |

## 5. 盤數驗收

| item | value |
|---|---:|
| `totalPlates` | 1080 |
| `yangPlates` | 540 |
| `yinPlates` | 540 |

byDunJu 每局 60：

| dun-ju | count |
|---|---:|
| `yang-1` | 60 |
| `yang-2` | 60 |
| `yang-3` | 60 |
| `yang-4` | 60 |
| `yang-5` | 60 |
| `yang-6` | 60 |
| `yang-7` | 60 |
| `yang-8` | 60 |
| `yang-9` | 60 |
| `yin-1` | 60 |
| `yin-2` | 60 |
| `yin-3` | 60 |
| `yin-4` | 60 |
| `yin-5` | 60 |
| `yin-6` | 60 |
| `yin-7` | 60 |
| `yin-8` | 60 |
| `yin-9` | 60 |

## 6. validateQimenPlateFile 驗收

| check | result |
|---|---|
| 18 個 candidate files 全部 validation ok | true |
| validation errors | 0 |
| validation warnings | 0 |

每檔 validation ok：

| file | validation ok |
|---|---|
| `yang/ju-1.json` | true |
| `yang/ju-2.json` | true |
| `yang/ju-3.json` | true |
| `yang/ju-4.json` | true |
| `yang/ju-5.json` | true |
| `yang/ju-6.json` | true |
| `yang/ju-7.json` | true |
| `yang/ju-8.json` | true |
| `yang/ju-9.json` | true |
| `yin/ju-1.json` | true |
| `yin/ju-2.json` | true |
| `yin/ju-3.json` | true |
| `yin/ju-4.json` | true |
| `yin/ju-5.json` | true |
| `yin/ju-6.json` | true |
| `yin/ju-7.json` | true |
| `yin/ju-8.json` | true |
| `yin/ju-9.json` | true |

## 7. formal plate object schema 驗收

candidate 中 plate object 欄位：

| field | 驗收結果 |
|---|---|
| `schemaVersion` | number `1` |
| `hourPillar` | 存在，且與 `plates` key 對齊 |
| `zhiFuStar` | 存在 |
| `zhiShiDoor` | 存在 |
| `xunShou` | `null` |
| `notes` | array |
| `source.type` | `qimen1080-md` |
| `source.file` | `data/1080.md` |
| `source.rawHeader` | 存在 |
| `source.rawCells` | 9 宮 |
| `palaces` | 9 宮 |
| `palaceName` / `direction` / `luoshuNumber` | 依 `QIMEN_PALACE_META` 補齊 |
| `earthStem` / `heavenStem` / `door` / `star` / `deity` | 存在或 null，符合 validation |
| `isEmpty` / `isHorse` | boolean |
| `isZhiFuPalace` / `isZhiShiPalace` | boolean |
| palace `notes` | array |

## 8. sample 驗收

以下四筆 sample 皆由實際讀取 candidate JSON 取得。

| sample | id | hourPillar | zhiFuStar | zhiShiDoor | xunShou | notes length | source.type | source.file | rawHeader | rawCells 9 宮 | palaces 9 宮 | center | center.star | center.isZhiFuPalace | center notes length | kan meta 完整 | flags boolean |
|---|---|---|---|---|---|---:|---|---|---|---|---|---|---|---|---:|---|---|
| `yang/ju-1.json plates["甲子"]` | 無 | `甲子` | `天蓬` | `休` | null | 0 | `qimen1080-md` | `data/1080.md` | true | true | true | true | `天禽` | false | 0 | true | true |
| `yang/ju-9.json plates["癸亥"]` | 無 | `癸亥` | `天禽` | `死` | null | 1 | `qimen1080-md` | `data/1080.md` | true | true | true | true | `天禽` | true | 1 | true | true |
| `yin/ju-1.json plates["甲子"]` | 無 | `甲子` | `天蓬` | `休` | null | 0 | `qimen1080-md` | `data/1080.md` | true | true | true | true | `天禽` | false | 0 | true | true |
| `yin/ju-9.json plates["癸亥"]` | 無 | `癸亥` | `天輔` | `杜` | null | 0 | `qimen1080-md` | `data/1080.md` | true | true | true | true | `天禽` | false | 0 | true | true |

## 9. 天禽 / center 驗收

| check | result |
|---|---|
| `center` 是否保留 | 是 |
| `center.palaceName` / `direction` / `luoshuNumber` | `中` / `中` / 5 |
| `center.door` / `center.deity` | 可為 null |
| `zhiFuStar === "天禽"` 時是否以 center 標記 `isZhiFuPalace` | 是，`yang/ju-9.json plates["癸亥"]` 為 true |
| 是否加入「天禽寄宮未推導，第一版以 center 標記直符」註記 | 是，天禽直符 sample 的 notes length 與 center notes length 皆為 1 |
| 是否推導天禽寄宮 | 否 |

本階段未推導天禽寄宮，只保留 center / 天禽資訊與註記。

## 10. 正式資料安全驗收

| check | result |
|---|---|
| 本包是否修改 `data/qimen/plates/**` | 否 |
| candidate writer 是否應被 `getQimenPlate` 使用 | 否 |
| `getQimenPlate` 是否仍維持 `nullPlate` | 是，第 108 包測試已驗證 |
| candidate 檔最後是否已清理 | 是 |
| `tmp/qimen1080-formal-candidate` 是否留在 git status | 否 |
| candidate JSON 是否進版控 | 否 |

## 11. 與第 107 安全規劃對照

| 第 107 規劃項目 | 本包驗收結果 |
|---|---|
| candidate root 使用 `tmp/qimen1080-formal-candidate/` | 達成 |
| 18 檔拆分 | 達成 |
| 每檔 60 盤 | 達成 |
| 正式 schema candidate，不是 preview schema | 達成 |
| 不寫正式 plates | 達成 |
| 不由 `getQimenPlate` 讀取 | 達成 |
| 驗收後清理 candidate | 達成 |
| outputRoot forbidden guard 已由第 108 測試驗證 | 達成 |

## 12. 結論

formal candidate writer 初版驗收通過：

* 可臨時產生 18 個 formal candidate JSON。
* candidate 總盤數為 1080。
* 陽遁 / 陰遁各 540。
* 每局各 60。
* 18 個 candidate files 全部通過 `validateQimenPlateFile`。
* 四筆 sample 皆可從 candidate JSON 找到。
* 天禽 / center 保留與註記符合目前策略。
* 驗收後 candidate 檔已清理。
* 正式 `data/qimen/plates/**` 仍未寫入。

本階段可進入第 110 包：正式 `data/qimen/plates/**` 寫入前 final go/no-go 文件。

## 13. 本包不處理項目

本包未處理且不應處理下列項目：

* 不修改 code。
* 不修改 tests。
* 不修改 `data/1080.md`。
* 不保留 candidate JSON。
* 不寫 `data/qimen/plates/**`。
* 不修改 `getQimenPlate`。
* 不接 UI。
* 不做正式 plates 寫入。
* 不做 method switch。
* 不做拆補法 / 茅山法 / 無閏法。
* 不做格局、卦名、斷語、吉凶。
* 不 commit。
