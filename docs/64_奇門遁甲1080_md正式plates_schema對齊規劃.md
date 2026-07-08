# 奇門遁甲 1080.md 正式 plates schema 對齊規劃

## 1. 本包目的

本文件是新第 104 包 docs-only 規劃文件，目的為規劃如何將 `data/1080.md` dry-run / preview object 對齊正式 `data/qimen/plates/**` schema。

本包只做正式 plates schema 對齊規劃：

* 不實作正式 writer。
* 不寫入 `data/qimen/plates/**`。
* 不修改 parser / converter / tests。
* 不接 UI。

## 2. 目前資料流整理

目前 1080.md 到正式 plates 的資料流可分成已完成與未來階段：

```text
data/1080.md
  -> parseQimen1080Markdown
  -> convertQimen1080ParsedToDryRun
  -> buildQimen1080PreviewFiles / writeQimen1080PreviewFiles
  -> 未來正式 schema adapter
  -> 未來正式 writer
  -> data/qimen/plates/{yang,yin}/ju-{1..9}.json
  -> getQimenPlate
```

已完成狀態：

| step | status |
|---|---|
| `data/1080.md` parser diagnostics | 已歸零 |
| `parseQimen1080Markdown` | 已可解析 1080 盤 |
| `convertQimen1080ParsedToDryRun` | 已產出 in-memory normalized objects |
| `buildQimen1080PreviewFiles` / `writeQimen1080PreviewFiles` | 已可產生並驗收 preview JSON |
| 正式 schema adapter | 尚未實作 |
| 正式 writer | 尚未實作 |
| `data/qimen/plates/**` 正式寫入 | 尚未寫入 |
| `getQimenPlate` | 仍維持 skeleton / `nullPlate` 行為 |

## 3. 既有正式 plates skeleton schema 檢查

目前正式 plates 路徑共有 18 個 skeleton JSON：

```text
data/qimen/plates/yang/ju-1.json ... ju-9.json
data/qimen/plates/yin/ju-1.json ... ju-9.json
```

### 3.1 檔案結構

每個正式 plates 檔案目前結構為：

```json
{
  "meta": {
    "schemaVersion": "1.0.0",
    "dunType": "yang",
    "dunName": "陽遁",
    "ju": 1,
    "plateCount": 60,
    "source": "御定奇門遁甲寶鑑整理",
    "notes": "本檔為盤面資料骨架。null 代表該時辰盤面尚未建立。"
  },
  "plates": {
    "甲子": null
  }
}
```

重點：

* `meta` 必須存在。
* `plates` 必須存在且為 object。
* 每檔 `plates` 需包含 60 個六十甲子 key。
* 目前所有 plate value 都是 `null`。
* `null` 表示該時辰盤面尚未建立，是 validation 允許的值。
* 未來正式寫入時，plate value 可由 `null` 改為 object。

### 3.2 `src/qimenPlateValidation.js` 目前期待

file-level validation：

| rule | 現況 |
|---|---|
| file data 必須是 plain object | 必須 |
| `meta` 必須存在 | 必須 |
| `plates` 必須存在 | 必須 |
| `meta.dunType` 必須符合 context `expectedDunType` | 必須 |
| `meta.ju` 必須符合 context `expectedJu` | 必須 |
| `plates` 必須是 object | 必須 |
| 必須有 60 個 `QIMEN_HOUR_PILLARS` key | 必須 |
| 不可有未知時柱 key | error |
| plate value 可為 `null` 或 object | `null` 合法 |

plate-level validation：

| field | 目前規則 |
|---|---|
| `schemaVersion` | 必須是 number 且等於 `1` |
| `hourPillar` | 必須存在，且等於 `plates` key |
| `palaces` | 必須存在且為 object |
| `notes` | 若存在，必須是 `string[]` |
| `zhiFuStar` | 若存在，必須是 string 或 null |
| `zhiShiDoor` | 若存在，必須是 string 或 null |
| `xunShou` | 若存在，必須是 string 或 null |

palace-level validation：

| field | 目前規則 |
|---|---|
| 9 宮 key | 必須包含 `QIMEN_PALACE_KEYS` 全部 key |
| 未知宮 key | error |
| palace value | 必須是 object |
| `palaceName` / `direction` / `luoshuNumber` | 必須等於 `QIMEN_PALACE_META` |
| `earthStem` / `heavenStem` / `door` / `star` / `deity` | 若存在，必須是 string 或 null |
| `isEmpty` / `isHorse` / `isZhiFuPalace` / `isZhiShiPalace` | 若存在，必須是 boolean |
| `notes` | 若存在，必須是 `string[]` |

### 3.3 `QIMEN_PALACE_KEYS`

目前正式 validation 使用的 key 集合為：

```js
[
  "kan",
  "kun",
  "zhen",
  "xun",
  "center",
  "qian",
  "dui",
  "gen",
  "li"
]
```

注意：這是 schema key 集合，不代表 UI 九宮排列順序。preview / parser 的 layout 為：

```js
[
  ["xun", "li", "kun"],
  ["zhen", "center", "dui"],
  ["gen", "kan", "qian"]
]
```

正式 adapter 應保留 key 集合完整，不依 object key 順序渲染 UI。

### 3.4 `QIMEN_PALACE_META`

目前正式 validation 固定宮位 meta：

| key | palaceName | direction | luoshuNumber |
|---|---|---|---:|
| `kan` | 坎 | 北 | 1 |
| `kun` | 坤 | 西南 | 2 |
| `zhen` | 震 | 東 | 3 |
| `xun` | 巽 | 東南 | 4 |
| `center` | 中 | 中 | 5 |
| `qian` | 乾 | 西北 | 6 |
| `dui` | 兌 | 西 | 7 |
| `gen` | 艮 | 東北 | 8 |
| `li` | 離 | 南 | 9 |

## 4. preview object 與正式 schema 差異

| 項目 | preview normalized object | 既有正式 minimal plate schema | 對齊建議 |
|---|---|---|---|
| `schemaVersion` | plate object 目前沒有；preview file meta 有 `qimen-1080-preview-v1` | plate object 必須 `schemaVersion: 1` | adapter 補 `schemaVersion: 1` |
| `hourPillar` | 已存在 | 必須存在且等於 `plates` key | 直接沿用 |
| 值符星命名 | `zhifuStar` | `zhiFuStar` | adapter 改名為 `zhiFuStar` |
| 值使門命名 | `zhishiDoor` | `zhiShiDoor` | adapter 改名為 `zhiShiDoor` |
| `xunShou` | 無 | 若存在需 string / null | 第一版補 `xunShou: null` |
| `notes` | 無 | 若存在需 `string[]` | plate 與 palace 第一版補 `notes: []` |
| `palaces` | 9 宮皆有 `heavenStem` / `star` / `earthStem` / `door` / `deity` | 9 宮需含 meta，其他欄位若存在需型別正確 | adapter 補宮位 meta 與 flags |
| `palaceName` / `direction` / `luoshuNumber` | 無 | 必須等於 `QIMEN_PALACE_META` | adapter 依 key 補齊 |
| `earthStem` / `heavenStem` / `door` / `star` / `deity` | 已有，center 門神可為 null | 若存在可為 string 或 null | 直接沿用 |
| `isEmpty` | 無 | 若存在需 boolean | 第一版補 `false` |
| `isHorse` | 無 | 若存在需 boolean | 第一版補 `false`，驛馬另包處理 |
| `isZhiFuPalace` | 無 | 若存在需 boolean | adapter 依 `star === zhiFuStar` 初版判斷 |
| `isZhiShiPalace` | 無 | 若存在需 boolean | adapter 依 `door === zhiShiDoor` 初版判斷 |
| `raw` | 有 `raw.header` / `raw.cells` | validation 未定義 raw | 不直接放 root `raw`；建議放 `source` |
| `source` / `provenance` | preview file meta 有 source；plate object 無 | validation 目前未限制未知 plate 欄位 | 建議新增 `source`，但需後續更新 validation 或確認未知欄位策略 |

## 5. 正式 plate object 建議 schema v1

以下是正式 plate object 草案，本包不實作。

```json
{
  "schemaVersion": 1,
  "hourPillar": "甲子",
  "zhiFuStar": "天蓬",
  "zhiShiDoor": "休",
  "xunShou": null,
  "notes": [],
  "source": {
    "type": "qimen1080-md",
    "file": "data/1080.md",
    "rawHeader": "| 甲子           |              | 直符：蓬<br>直使：休 |",
    "rawCells": {
      "kan": "戊 蓬<br>戊 休 符",
      "center": "壬 禽<br>壬"
    }
  },
  "palaces": {
    "kan": {
      "palaceName": "坎",
      "direction": "北",
      "luoshuNumber": 1,
      "earthStem": "戊",
      "heavenStem": "戊",
      "door": "休",
      "star": "天蓬",
      "deity": "值符",
      "isEmpty": false,
      "isHorse": false,
      "isZhiFuPalace": true,
      "isZhiShiPalace": true,
      "notes": []
    }
  }
}
```

設計重點：

* 欄位命名以 `qimenPlateValidation.js` 為準，使用 `zhiFuStar` / `zhiShiDoor`。
* `schemaVersion` 使用 number `1`，不是 preview meta 的字串版本。
* `xunShou` 第一版先為 `null`，不在正式寫入階段推導。
* `notes` 先補空陣列，保留後續註記空間。
* palace 必須補 `QIMEN_PALACE_META`。
* `isEmpty` / `isHorse` 第一版先填 `false`，不推導空亡 / 驛馬。
* `source` 作為 raw / provenance 承載位置；若後續認為正式 JSON 不應保留完整 raw，可改成 `sourceRef`。

## 6. center / 天禽正式表示策略

preview 已保留 `center`，正式 schema 也應保留 `center` palace。

建議第一版正式表示：

| 欄位 | 建議 |
|---|---|
| `center.palaceName` | `"中"` |
| `center.direction` | `"中"` |
| `center.luoshuNumber` | `5` |
| `center.heavenStem` | 沿用 preview |
| `center.star` | 通常為 `"天禽"`，沿用 preview |
| `center.earthStem` | 沿用 preview |
| `center.door` | `null` 可接受 |
| `center.deity` | `null` 可接受 |
| `center.isEmpty` | 第一版 `false` |
| `center.isHorse` | 第一版 `false` |
| `center.notes` | `[]`，必要時記錄天禽 / 寄宮待議 |

原則：

* 不丟棄中宮資料。
* 不在本階段硬做天禽寄宮規則推導。
* 不因 `center` 沒有門 / 神而套用外宮完整欄位規則。
* 若 `zhiFuStar` 為天禽，第一版可標記 `center.isZhiFuPalace: true`；寄宮對應另包討論。

## 7. zhiFu / zhiShi palace flag 策略

第一版 flag 策略建議：

| flag | 判斷 |
|---|---|
| `isZhiFuPalace` | `palace.star === plate.zhiFuStar` |
| `isZhiShiPalace` | `palace.door === plate.zhiShiDoor` |

注意事項：

* `zhiFuStar` 為天禽時，可能對應 `center` 或另有寄宮問題。
* 第一版先依 parser / preview 可找到的 star 直接標記，不推導寄宮。
* 若 `zhiFuStar === "天禽"`，可在 plate 或 center palace `notes` 記錄：`"天禽寄宮未推導，第一版以 center 標記值符"`。
* `zhiShiDoor` 只會在外宮找到；center `door` 為 null，不應被標記值使。
* 後續若補寄宮規則，需另包更新 adapter 與 tests。

## 8. raw / source / provenance 策略

可選策略比較：

| 策略 | 優點 | 缺點 |
|---|---|---|
| 正式 JSON 保留完整 `raw.header` / `raw.cells` | 錯盤修正可直接回查；adapter 可驗證 mapping | JSON 較大；UI 不一定需要；diff 較長 |
| 正式 JSON 不保留 raw，只在 docs 保留來源 | JSON 精簡；正式資料更乾淨 | 後續追查錯盤需回 `data/1080.md` 搜尋，成本較高 |
| 正式 JSON 放 `source.rawHeader` / `source.rawCells` | 兼顧 provenance 與欄位語意；不污染 root | 仍會增加檔案大小 |
| 正式 JSON 放 `sourceRef`，不放完整 raw | 精簡且可表示來源 | 回查仍需額外定位策略 |

第一版建議：

```json
"source": {
  "type": "qimen1080-md",
  "file": "data/1080.md",
  "rawHeader": "...",
  "rawCells": {}
}
```

理由：

* 1080 盤仍在資料轉換初期，保留 raw 有助人工追查與錯盤修正。
* 放在 `source` 下比 root `raw` 更接近 provenance 語意。
* UI 不需要使用 `source`，但資料審核與 rollback 有價值。
* 若後續覺得正式 JSON 過大，可在 schema v2 改成 `sourceRef`。

前提：

* 目前 `qimenPlateValidation.js` 不限制 plate object 未知欄位，所以 `source` 不會被 validation 擋下。
* 若要嚴格化 schema，應同步把 `source` schema 加進 validation。

## 9. 正式 writer 安全策略

未來正式 writer 必須滿足：

* 只在明確指令下寫 `data/qimen/plates/**`。
* 寫入前先跑 parser diagnostics，要求 `ok: true`、errors / warnings 為 0。
* 寫入前先跑 dry-run report，要求 1080 objects、陽陰各 540、每局 60。
* 寫入前先跑 preview validation，確認 preview 與 dry-run stats 一致。
* 寫入前 snapshot 正式 plates。
* 只覆蓋 18 個 `data/qimen/plates/{yang,yin}/ju-{1..9}.json`。
* 不碰 `data/qimen/qimen_yuan_ju_table.json`。
* 不碰 resolver / UI。
* 不修改 `getQimenPlate`。
* 寫入後跑 schema validation。
* 寫入後 `getQimenPlate` 從 `nullPlate` 轉為 `found` 的測試需另包處理。
* 提供 rollback 建議。

rollback 建議：

* 正式寫入前產生 deterministic preview / candidate。
* 寫入前記錄 `git diff -- data/qimen/plates`。
* 正式寫入應集中單一 commit。
* 若驗收失敗，使用 git 還原該 commit 或明確 restore 18 個 `ju-*.json`。
* 不使用廣泛刪除或模糊 glob 清理正式資料。

## 10. 後續分包建議

| package | 建議內容 |
|---|---|
| 第 105 包 | 正式 schema adapter module 規劃或實作 dry-run-only adapter，不寫檔 |
| 第 106 包 | 正式 schema adapter 測試 |
| 第 107 包 | 正式 writer 規劃文件 |
| 第 108 包 | 正式 writer 實作，但可先輸出到 preview/formal-candidate，不覆蓋正式 plates |
| 後續 | 正式寫入 `data/qimen/plates/**` 另行確認 |

第 105 / 106 包建議重點：

* dry-run object -> formal plate object。
* `zhifuStar` -> `zhiFuStar`。
* `zhishiDoor` -> `zhiShiDoor`。
* 補 `schemaVersion: 1`、`xunShou: null`、`notes: []`。
* 補 `QIMEN_PALACE_META`。
* 補 `isEmpty` / `isHorse` / `isZhiFuPalace` / `isZhiShiPalace`。
* 對 adapter output 跑 `validateQimenPlateObject`。
* 不寫檔。

## 11. 本包不處理項目

本包未處理且不應處理下列項目：

* 不修改 code。
* 不修改 tests。
* 不修改 `data/1080.md`。
* 不產生 JSON。
* 不保留 preview 檔。
* 不寫 `data/qimen/plates/**`。
* 不接 UI。
* 不做正式 converter 輸出。
* 不做 method switch。
* 不做拆補法 / 茅山法 / 無閏法。
* 不做格局、卦名、斷語、吉凶。
* 不 commit。
