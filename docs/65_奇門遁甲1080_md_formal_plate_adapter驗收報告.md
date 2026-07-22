# 奇門遁甲 1080.md formal plate adapter 驗收報告

## 1. 本包目的

本文件是新第 106 包 docs-only 驗收報告，目的為整理 `src/qimen1080FormalPlateAdapter.js` 的 in-memory formal candidate files、schema 對齊結果、sample、validation 與安全邊界。

formal plate adapter 目前只產生 in-memory candidate files，不寫正式 `data/qimen/plates/**`，不接 UI，不修改 `getQimenPlate`。

## 2. 驗收輸入

| input | 說明 |
|---|---|
| `data/1080.md` | 已完成 parser diagnostics 歸零的來源資料 |
| `parseQimen1080Markdown` | 解析 1080.md |
| `convertQimen1080ParsedToDryRun` | 產生 dry-run normalized objects |
| `src/qimen1080FormalPlateAdapter.js` | 將 dry-run object 轉成 formal plate object / in-memory candidate files |
| `validateQimenPlateFile` | 驗證 in-memory formal candidate file 是否符合正式 plates schema |

## 3. adapter report stats 摘要

以下結果由臨時 Node 指令實際呼叫 `buildQimen1080FormalPlateAdapterReport(parsed)` 取得。

| item | value |
|---|---:|
| `ok` | true |
| `totalFiles` | 18 |
| `totalPlates` | 1080 |
| `yangPlates` | 540 |
| `yinPlates` | 540 |
| `errors` | 0 |
| `warnings` | 0 |

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

## 4. formal candidate files 摘要

18 個 in-memory candidate files 皆為 `validation ok: true`。

| relativePath | meta.schemaVersion | meta.dunType | meta.dunName | meta.ju | meta.plateCount | plates count | validation ok |
|---|---|---|---|---:|---:|---:|---|
| `yang/ju-1.json` | `1.0.0` | `yang` | `陽遁` | 1 | 60 | 60 | true |
| `yang/ju-2.json` | `1.0.0` | `yang` | `陽遁` | 2 | 60 | 60 | true |
| `yang/ju-3.json` | `1.0.0` | `yang` | `陽遁` | 3 | 60 | 60 | true |
| `yang/ju-4.json` | `1.0.0` | `yang` | `陽遁` | 4 | 60 | 60 | true |
| `yang/ju-5.json` | `1.0.0` | `yang` | `陽遁` | 5 | 60 | 60 | true |
| `yang/ju-6.json` | `1.0.0` | `yang` | `陽遁` | 6 | 60 | 60 | true |
| `yang/ju-7.json` | `1.0.0` | `yang` | `陽遁` | 7 | 60 | 60 | true |
| `yang/ju-8.json` | `1.0.0` | `yang` | `陽遁` | 8 | 60 | 60 | true |
| `yang/ju-9.json` | `1.0.0` | `yang` | `陽遁` | 9 | 60 | 60 | true |
| `yin/ju-1.json` | `1.0.0` | `yin` | `陰遁` | 1 | 60 | 60 | true |
| `yin/ju-2.json` | `1.0.0` | `yin` | `陰遁` | 2 | 60 | 60 | true |
| `yin/ju-3.json` | `1.0.0` | `yin` | `陰遁` | 3 | 60 | 60 | true |
| `yin/ju-4.json` | `1.0.0` | `yin` | `陰遁` | 4 | 60 | 60 | true |
| `yin/ju-5.json` | `1.0.0` | `yin` | `陰遁` | 5 | 60 | 60 | true |
| `yin/ju-6.json` | `1.0.0` | `yin` | `陰遁` | 6 | 60 | 60 | true |
| `yin/ju-7.json` | `1.0.0` | `yin` | `陰遁` | 7 | 60 | 60 | true |
| `yin/ju-8.json` | `1.0.0` | `yin` | `陰遁` | 8 | 60 | 60 | true |
| `yin/ju-9.json` | `1.0.0` | `yin` | `陰遁` | 9 | 60 | 60 | true |

## 5. formal plate object schema 驗收

adapter output 的 formal plate object 欄位：

| field | 驗收結果 |
|---|---|
| `schemaVersion` | number `1` |
| `hourPillar` | 沿用時柱 key |
| `zhiFuStar` | 由 dry-run `zhifuStar` 轉入 |
| `zhiShiDoor` | 由 dry-run `zhishiDoor` 轉入 |
| `xunShou` | `null` |
| `notes` | `string[]`，一般為 `[]`；天禽直符盤可有註記 |
| `source.type` | `qimen1080-md` |
| `source.file` | `data/1080.md` |
| `source.rawHeader` | 保留 |
| `source.rawCells` | 保留 9 宮 raw cells |
| `palaces` | 9 宮完整 |
| `palaceName` / `direction` / `luoshuNumber` | 依 `QIMEN_PALACE_META` 補齊 |
| `earthStem` / `heavenStem` / `door` / `star` / `deity` | 沿用 dry-run object |
| `isEmpty` | boolean，第一版 `false` |
| `isHorse` | boolean，第一版 `false` |
| `isZhiFuPalace` | boolean，初版 `palace.star === zhiFuStar` |
| `isZhiShiPalace` | boolean，初版 `palace.door === zhiShiDoor` |
| palace `notes` | `string[]` |

## 6. sample 驗收

以下四筆 sample 皆由 adapter report 實際讀取。

| sample | hourPillar | zhiFuStar | zhiShiDoor | xunShou | notes length | source.type | rawHeader | rawCells 9 宮 | palaces 9 宮 | center | center.star | center.isZhiFuPalace | center notes length | kan meta 完整 | flags boolean |
|---|---|---|---|---|---:|---|---|---|---|---|---|---|---:|---|---|
| `yang/ju-1.json plates["甲子"]` | `甲子` | `天蓬` | `休` | null | 0 | `qimen1080-md` | true | true | true | true | `天禽` | false | 0 | true | true |
| `yang/ju-9.json plates["癸亥"]` | `癸亥` | `天禽` | `死` | null | 1 | `qimen1080-md` | true | true | true | true | `天禽` | true | 1 | true | true |
| `yin/ju-1.json plates["甲子"]` | `甲子` | `天蓬` | `休` | null | 0 | `qimen1080-md` | true | true | true | true | `天禽` | false | 0 | true | true |
| `yin/ju-9.json plates["癸亥"]` | `癸亥` | `天輔` | `杜` | null | 0 | `qimen1080-md` | true | true | true | true | `天禽` | false | 0 | true | true |

sample 補充：

* 四筆 sample 的 `source.rawCells` 皆為 9 宮。
* 四筆 sample 的 `palaces` 皆為 9 宮。
* 四筆 sample 的 `center` 皆存在，`center.star` 皆為 `天禽`。
* 四筆 sample 的 `kan` 宮 meta 皆完整，包含 `palaceName: "坎"`、`direction: "北"`、`luoshuNumber: 1`。
* 四筆 sample 全宮 `isEmpty` / `isHorse` / `isZhiFuPalace` / `isZhiShiPalace` 皆為 boolean。

## 7. 天禽 / center 驗收

| check | result |
|---|---|
| `center` 是否保留 | 是 |
| `center.palaceName` | `中` |
| `center.direction` | `中` |
| `center.luoshuNumber` | 5 |
| `center.door` | 可為 null |
| `center.deity` | 可為 null |
| `zhiFuStar === "天禽"` 時是否以 center 標記 `isZhiFuPalace` | 是，sample `yang/ju-9.json plates["癸亥"]` 為 true |
| 是否加入「天禽寄宮未推導」註記 | 是，天禽直符 sample 的 plate notes 與 center notes length 皆為 1 |
| 是否推導天禽寄宮 | 否 |

本階段只保留 center / 天禽資訊，並以直接 star match 做 `isZhiFuPalace` 初版標記；不推導天禽寄宮規則。

## 8. validation 驗收

| check | result |
|---|---|
| 18 個 candidate files 都通過 `validateQimenPlateFile` | true |
| validation errors | 0 |
| validation warnings | 0 |
| `data/qimen/plates/**` snapshot 不變 | 第 105 包測試已驗證 |
| `getQimenPlate` 是否仍維持 `nullPlate` | 第 105 包測試已驗證 |
| adapter candidate 是否被 `getQimenPlate` 讀取 | 否 |

## 9. 與第 104 schema 規劃對照

| 第 104 規劃項目 | adapter 驗收結果 |
|---|---|
| `zhiFuStar` / `zhiShiDoor` 命名 | 達成 |
| `schemaVersion: 1` | 達成 |
| `xunShou: null` | 達成 |
| `notes: []` | 達成；天禽直符盤可有註記 |
| `source.rawHeader` / `source.rawCells` | 達成 |
| 使用 `QIMEN_PALACE_META` | 達成 |
| `isEmpty` / `isHorse` | 達成，第一版皆為 false |
| `isZhiFuPalace` / `isZhiShiPalace` | 達成，皆為 boolean |
| center 保留 | 達成 |
| 不推導空亡 / 驛馬 / 天禽寄宮 | 達成 |
| 不寫正式 plates | 達成 |

## 10. 正式 writer 前剩餘風險

正式 writer 前仍需注意：

* 正式寫入 `data/qimen/plates/**` 尚未做。
* adapter candidate 尚未落盤。
* `getQimenPlate` 從 `nullPlate` 轉為 `found` 的行為尚未驗證。
* UI 尚未接正式盤面。
* 天禽寄宮未推導。
* `xunShou` / 空亡 / 驛馬仍為後續功能。
* `raw` / `source` 是否長期保留仍可後續調整。

## 11. 後續分包建議

| package | 建議內容 |
|---|---|
| 第 107 包 | 正式 writer 安全規劃文件 |
| 第 108 包 | 正式 writer candidate module，先輸出到 `tmp/qimen1080-formal-candidate/`，不覆蓋正式 plates |
| 第 109 包 | formal candidate JSON 驗收報告 |
| 第 110 包 | 正式 `data/qimen/plates/**` 寫入前 final go/no-go 文件 |
| 後續 | 正式寫入 `data/qimen/plates/**` 另行確認 |

## 12. 本包不處理項目

本包未處理且不應處理下列項目：

* 不修改 code。
* 不修改 tests。
* 不修改 `data/1080.md`。
* 不產生 JSON。
* 不寫 preview 檔。
* 不寫 `data/qimen/plates/**`。
* 不修改 `getQimenPlate`。
* 不接 UI。
* 不做正式 writer。
* 不做 method switch。
* 不做拆補法 / 茅山法 / 無閏法。
* 不做格局、卦名、斷語、吉凶。
* 不 commit。
