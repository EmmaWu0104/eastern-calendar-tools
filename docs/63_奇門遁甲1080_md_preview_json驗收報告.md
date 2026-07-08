# 奇門遁甲 1080.md preview JSON 驗收報告

## 1. 本包目的

本文件是新第 103 包 docs-only 驗收報告。目的為臨時使用 `src/qimen1080PreviewWriter.js` 產生 `tmp/qimen1080-preview/**`，讀取 18 個 preview JSON 後整理驗收摘要。

preview 檔僅作為本包驗收用暫存產物，驗收後已清理。本包不保留 preview JSON，不將 preview JSON 進版控，不修改 code / tests / data，不寫正式 `data/qimen/plates/**`。

## 2. 驗收輸入

| input | 說明 |
|---|---|
| `data/1080.md` | 已完成 parser diagnostics 歸零的來源資料 |
| `src/qimen1080MarkdownParser.js` | 解析 `data/1080.md` |
| `src/qimen1080ConverterDryRun.js` | 建立 dry-run normalized objects / report |
| `src/qimen1080PreviewWriter.js` | 臨時產生 preview JSON |

## 3. 臨時輸出位置

本包臨時輸出位置：

```text
tmp/qimen1080-preview/
```

驗收完成後已呼叫 `clearQimen1080PreviewOutput()` 清理，清理結果：

| item | value |
|---|---|
| `cleanup.ok` | true |
| `tmp/qimen1080-preview` 是否仍存在 | false |

## 4. preview file 結構驗收

檔案總數：

| item | value |
|---|---:|
| preview JSON file count | 18 |

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

meta 欄位驗收：

| check | result |
|---|---|
| 每檔 `meta.schemaVersion === "qimen-1080-preview-v1"` | true |
| 每檔 `meta.source === "data/1080.md"` | true |
| 每檔 `meta.generatedBy === "qimen1080PreviewWriter"` | true |
| 每檔 `meta.generatedAt === null` | true |
| 每檔 `meta.isPreview === true` | true |
| 每檔 `meta.plateCount === 60` | true |

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

## 6. sample 驗收

以下四筆 sample 皆由實際讀取 preview JSON 取得。

| sample | id | dun | ju | dayGroup | hourPillar | zhifuStar | zhishiDoor | palaces 9 宮 | center 存在 | center.star | raw.header 存在 | raw.cells 9 宮 |
|---|---|---|---:|---|---|---|---|---|---|---|---|---|
| `yang/ju-1.json plates["甲子"]` | `yang-1-甲己日-甲子` | `yang` | 1 | `甲己日` | `甲子` | `天蓬` | `休` | true | true | `天禽` | true | true |
| `yang/ju-9.json plates["癸亥"]` | `yang-9-戊癸日-癸亥` | `yang` | 9 | `戊癸日` | `癸亥` | `天禽` | `死` | true | true | `天禽` | true | true |
| `yin/ju-1.json plates["甲子"]` | `yin-1-甲己日-甲子` | `yin` | 1 | `甲己日` | `甲子` | `天蓬` | `休` | true | true | `天禽` | true | true |
| `yin/ju-9.json plates["癸亥"]` | `yin-9-戊癸日-癸亥` | `yin` | 9 | `戊癸日` | `癸亥` | `天輔` | `杜` | true | true | `天禽` | true | true |

## 7. validation / diagnostics 驗收

| check | result |
|---|---|
| 每檔 `diagnostics.parserOk === true` | true |
| 每檔 `diagnostics.dryRunOk === true` | true |
| 每檔 `diagnostics.errors === 0` | true |
| 每檔 `diagnostics.warnings === 0` | true |
| 每檔 `validation.plateCount === true` | true |
| 每檔 `validation.everyPlateHas9Palaces === true` | true |
| 每檔 `validation.requiredFieldsPresent === true` | true |

## 8. 正式資料安全驗收

| check | result |
|---|---|
| 本包是否修改 `data/qimen/plates/**` | 否 |
| preview writer 是否應被 `getQimenPlate` 使用 | 否 |
| preview 檔最後是否已清理 | 是 |
| `tmp/qimen1080-preview` 是否留在 git status | 否 |
| preview JSON 是否進版控 | 否 |

## 9. 與第 101 規劃對照

| 第 101 規劃項目 | 本包驗收結果 |
|---|---|
| preview root 使用 `tmp/qimen1080-preview/` | 達成 |
| 18 檔拆分 | 達成 |
| 每檔 60 盤 | 達成 |
| `generatedAt` 為 `null` | 達成 |
| `raw` 保留 | 達成 |
| `center` 保留 | 達成 |
| 不寫正式 plates | 達成 |
| preview 不進版控 | 達成 |

## 10. 結論

preview writer 初版驗收通過：

* 可臨時產生 18 個 preview JSON。
* preview 總盤數為 1080。
* 陽遁 / 陰遁各 540。
* 每局各 60。
* 四筆 sample 皆可從 preview JSON 找到。
* diagnostics / validation 欄位皆符合預期。
* 驗收後 preview 檔已清理。
* 正式 `data/qimen/plates/**` 仍未寫入。

本階段可進入第 104 包正式 plates schema 對齊規劃，但正式 `data/qimen/plates/**` 仍需另行規劃，尚未寫入。

## 11. 本包不處理項目

本包未處理且不應處理下列項目：

* 不修改 code。
* 不修改 tests。
* 不修改 `data/1080.md`。
* 不保留 preview JSON。
* 不寫 `data/qimen/plates/**`。
* 不接 UI。
* 不做正式 converter 輸出。
* 不做 method switch。
* 不做拆補法 / 茅山法 / 無閏法。
* 不做格局、卦名、斷語、吉凶。
* 不 commit。
