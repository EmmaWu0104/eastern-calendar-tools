# 奇門遁甲 1080.md converter dry-run sample report

## 1. 本包目的

本文件是新第 100 包 docs-only sample report。目的為使用現有 `src/qimen1080ConverterDryRun.js` 與 `data/1080.md` 實際跑出的 dry-run report，整理 sample object 摘要，作為後續 preview JSON / 正式 plates schema 對齊前的人工檢查依據。

本包只整理 dry-run sample object，不改程式、不改測試、不輸出 JSON、不寫 preview 檔、不寫正式 `data/qimen/plates/**`。

## 2. dry-run report stats 摘要

| item | value |
|---|---:|
| `ok` | true |
| `totalObjects` | 1080 |
| `yangObjects` | 540 |
| `yinObjects` | 540 |
| `errors` | 0 |
| `warnings` | 0 |

byDunJu 每局皆 60：

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

validation 全部通過：

| validation | result |
|---|---|
| `totalObjects1080` | true |
| `dunCounts` | true |
| `byDunJuCounts` | true |
| `everyPlateHas9Palaces` | true |
| `requiredFieldsPresent` | true |
| `zhifuStarFound` | true |
| `zhishiDoorFound` | true |
| `samplesPresent` | true |

## 3. sample objects 清單

本節 sample 由臨時 node 指令讀取 `data/1080.md`、呼叫 `parseQimen1080Markdown(...)`，再呼叫 `buildQimen1080DryRunReport(...)` 取得，未手寫猜測。

| sample key | label | exists |
|---|---|---|
| `yangJu1JiajiJiazi` | 陽遁一局甲己日甲子 | true |
| `yangJu9WuguiGuihai` | 陽遁九局戊癸日癸亥 | true |
| `yinJu1JiajiJiazi` | 陰遁一局甲己日甲子 | true |
| `yinJu9WuguiGuihai` | 陰遁九局戊癸日癸亥 | true |

## 4. `yangJu1JiajiJiazi`

| field | value |
|---|---|
| label | 陽遁一局甲己日甲子 |
| `id` | `yang-1-甲己日-甲子` |
| `dun` | `yang` |
| `ju` | 1 |
| `dayGroup` | `甲己日` |
| `hourPillar` | `甲子` |
| `zhifuStar` | `天蓬` |
| `zhishiDoor` | `休` |
| palaces keys 是否 9 宮完整 | 是 |
| center 是否保留 | 是 |
| raw.header 是否保留 | 是，`| 甲子           |              | 直符：蓬<br>直使：休 |` |
| raw.cells 是否保留 | 是 |

| palace key | heavenStem | star | earthStem | door | deity |
|---|---|---|---|---|---|
| `kan` | `戊` | `天蓬` | `戊` | `休` | `值符` |
| `gen` | `丙` | `天任` | `丙` | `生` | `騰蛇` |
| `zhen` | `庚` | `天衝` | `庚` | `傷` | `太陰` |
| `xun` | `辛` | `天輔` | `辛` | `杜` | `六合` |
| `li` | `乙` | `天英` | `乙` | `景` | `勾陳` |
| `kun` | `己` | `天芮` | `己` | `死` | `朱雀` |
| `dui` | `丁` | `天柱` | `丁` | `驚` | `九地` |
| `qian` | `癸` | `天心` | `癸` | `開` | `九天` |
| `center` | `壬` | `天禽` | `壬` | null | null |

## 5. `yangJu9WuguiGuihai`

| field | value |
|---|---|
| label | 陽遁九局戊癸日癸亥 |
| `id` | `yang-9-戊癸日-癸亥` |
| `dun` | `yang` |
| `ju` | 9 |
| `dayGroup` | `戊癸日` |
| `hourPillar` | `癸亥` |
| `zhifuStar` | `天禽` |
| `zhishiDoor` | `死` |
| palaces keys 是否 9 宮完整 | 是 |
| center 是否保留 | 是 |
| raw.header 是否保留 | 是，`| 癸亥           |              | 直符：禽<br>直使：死 |` |
| raw.cells 是否保留 | 是 |

| palace key | heavenStem | star | earthStem | door | deity |
|---|---|---|---|---|---|
| `kan` | `己` | `天蓬` | `己` | `休` | `六合` |
| `gen` | `乙` | `天任` | `乙` | `生` | `勾陳` |
| `zhen` | `辛` | `天衝` | `辛` | `傷` | `朱雀` |
| `xun` | `壬` | `天輔` | `壬` | `杜` | `九地` |
| `li` | `戊` | `天英` | `戊` | `景` | `九天` |
| `kun` | `庚` | `天芮` | `庚` | `死` | `值符` |
| `dui` | `丙` | `天柱` | `丙` | `驚` | `騰蛇` |
| `qian` | `丁` | `天心` | `丁` | `開` | `太陰` |
| `center` | `癸` | `天禽` | `癸` | null | null |

## 6. `yinJu1JiajiJiazi`

| field | value |
|---|---|
| label | 陰遁一局甲己日甲子 |
| `id` | `yin-1-甲己日-甲子` |
| `dun` | `yin` |
| `ju` | 1 |
| `dayGroup` | `甲己日` |
| `hourPillar` | `甲子` |
| `zhifuStar` | `天蓬` |
| `zhishiDoor` | `休` |
| palaces keys 是否 9 宮完整 | 是 |
| center 是否保留 | 是 |
| raw.header 是否保留 | 是，`| 甲子           |              | 直符：蓬<br>直使：休 |` |
| raw.cells 是否保留 | 是 |

| palace key | heavenStem | star | earthStem | door | deity |
|---|---|---|---|---|---|
| `kan` | `戊` | `天蓬` | `戊` | `休` | `值符` |
| `gen` | `庚` | `天衝` | `庚` | `生` | `九天` |
| `zhen` | `丙` | `天任` | `丙` | `傷` | `九地` |
| `xun` | `丁` | `天輔` | `丁` | `杜` | `朱雀` |
| `li` | `己` | `天英` | `己` | `景` | `勾陳` |
| `kun` | `乙` | `天芮` | `乙` | `死` | `六合` |
| `dui` | `辛` | `天柱` | `辛` | `驚` | `太陰` |
| `qian` | `壬` | `天心` | `壬` | `開` | `騰蛇` |
| `center` | `癸` | `天禽` | `癸` | null | null |

## 7. `yinJu9WuguiGuihai`

| field | value |
|---|---|
| label | 陰遁九局戊癸日癸亥 |
| `id` | `yin-9-戊癸日-癸亥` |
| `dun` | `yin` |
| `ju` | 9 |
| `dayGroup` | `戊癸日` |
| `hourPillar` | `癸亥` |
| `zhifuStar` | `天輔` |
| `zhishiDoor` | `杜` |
| palaces keys 是否 9 宮完整 | 是 |
| center 是否保留 | 是 |
| raw.header 是否保留 | 是，`| 癸亥           |              | 直符：輔<br>直使：杜 |` |
| raw.cells 是否保留 | 是 |

| palace key | heavenStem | star | earthStem | door | deity |
|---|---|---|---|---|---|
| `kan` | `乙` | `天蓬` | `乙` | `休` | `六合` |
| `gen` | `己` | `天任` | `己` | `生` | `太陰` |
| `zhen` | `丁` | `天衝` | `丁` | `傷` | `騰蛇` |
| `xun` | `癸` | `天輔` | `癸` | `杜` | `值符` |
| `li` | `戊` | `天英` | `戊` | `景` | `九天` |
| `kun` | `丙` | `天芮` | `丙` | `死` | `九地` |
| `dui` | `庚` | `天柱` | `庚` | `驚` | `朱雀` |
| `qian` | `辛` | `天心` | `辛` | `開` | `勾陳` |
| `center` | `壬` | `天禽` | `壬` | null | null |

## 8. schema 人工檢查重點

* `id` 是否穩定且可重建。
* `dun` / `ju` / `dayGroup` / `hourPillar` 是否足以定位 1080 盤。
* `zhifuStar` / `zhishiDoor` 是否可由 `palaces` 找到。
* `center` 是否保留天禽資訊。
* `raw.header` / `raw.cells` 是否足以回查 `data/1080.md`。
* 外宮欄位是否完整。

## 9. 目前不決定事項

* 正式 JSON schema 是否完全沿用 dry-run object。
* 正式 `data/qimen/plates/**` 寫入格式。
* 是否保留 `raw` 欄位到正式 JSON。
* 是否需要新增 `source` / `provenance` 欄位。
* 是否需要轉換中文宮名 / 方位 metadata。
* 是否加入 `empty` / `horse` / `xunShou` 等既有 schema 欄位。
* 格局、卦名、斷語、吉凶全部之後再討論。

## 10. 後續分包建議

| package | 建議內容 |
|---|---|
| 第 101 包 | 規劃 preview JSON 暫存輸出路徑與檔名，不寫正式 plates |
| 第 102 包 | 實作 preview JSON writer，只寫 preview 路徑 |
| 第 103 包 | preview JSON 人工驗收與 schema 對齊 |
| 後續 | 正式寫入 `data/qimen/plates/**` 另行規劃 |

## 11. 本包不處理項目

本包未處理且不應處理下列項目：

* 不修改 code。
* 不修改 tests。
* 不修改 `data/1080.md`。
* 不產生 JSON。
* 不寫入 preview 檔。
* 不寫入 `data/qimen/plates/**`。
* 不做 UI。
* 不做 converter 正式輸出。
* 不做 method switch。
* 不做拆補法 / 茅山法 / 無閏法。
* 不做格局、卦名、斷語、吉凶。
* 不 commit。
