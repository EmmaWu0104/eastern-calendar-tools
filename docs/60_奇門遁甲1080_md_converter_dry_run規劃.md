# 奇門遁甲 1080.md converter dry-run 規劃

## 1. 本包目的

本文件是新第 98 包 docs-only 規劃文件，目的為規劃 `data/1080.md` 後續 converter dry-run 的資料結構、輸出策略與安全邊界。

本包只規劃 converter dry-run，不寫 converter code、不產生 JSON、不寫入正式資料、不接 UI。

## 2. converter dry-run 的輸入

converter dry-run 第一版建議只接受下列輸入：

* `data/1080.md`
* `src/qimen1080MarkdownParser.js` 的 parse 結果

進入 converter dry-run 前必須先確認 parser diagnostics：

| check | required |
|---|---|
| `parsed.ok` | `true` |
| `stats.totalPlates` | 1080 |
| `stats.yangPlates` | 540 |
| `stats.yinPlates` | 540 |
| `stats.errors` | 0 |
| `stats.warnings` | 0 |
| diagnostics code count | empty |

若 parser diagnostics 不是 `ok: true`，converter dry-run 應直接停止並輸出 validation report，不進入 normalized object 轉換流程。

## 3. converter dry-run 的輸出原則

第一版 dry-run 只輸出記憶體中的 normalized plate objects，不直接寫正式資料。

可輸出項目：

* stats
* sample normalized plate objects
* validation report
* diagnostics summary

禁止項目：

* 不直接寫入 `data/qimen/plates/**`
* 不覆蓋既有 JSON
* 不接 UI
* 不產生正式輸出檔

若後續需要檔案型 preview，應另開分包，且只寫入暫存 preview 路徑，不覆蓋正式 `data/qimen/plates/**`。

## 4. 建議 normalized plate object 結構草案

以下只是 converter dry-run 的 normalized object 草案，本包不實作：

```js
{
  id: "yang-1-甲己日-甲子",
  dun: "yang",
  ju: 1,
  dayGroup: "甲己日",
  hourPillar: "甲子",
  zhifuStar: "天蓬",
  zhishiDoor: "休",
  palaces: {
    kan: {
      heavenStem: "戊",
      star: "天蓬",
      earthStem: "戊",
      door: "休",
      deity: "直符"
    },
    gen: {
      heavenStem: null,
      star: null,
      earthStem: null,
      door: null,
      deity: null
    },
    zhen: {
      heavenStem: null,
      star: null,
      earthStem: null,
      door: null,
      deity: null
    },
    xun: {
      heavenStem: null,
      star: null,
      earthStem: null,
      door: null,
      deity: null
    },
    li: {
      heavenStem: null,
      star: null,
      earthStem: null,
      door: null,
      deity: null
    },
    kun: {
      heavenStem: null,
      star: null,
      earthStem: null,
      door: null,
      deity: null
    },
    dui: {
      heavenStem: null,
      star: null,
      earthStem: null,
      door: null,
      deity: null
    },
    qian: {
      heavenStem: null,
      star: null,
      earthStem: null,
      door: null,
      deity: null
    },
    center: {
      heavenStem: null,
      star: "天禽",
      earthStem: null,
      door: null,
      deity: null
    }
  },
  raw: {
    header: "| 甲子 | | 直符：蓬<br>直使：休 |",
    cells: {
      kan: "戊 蓬<br>戊 休 符",
      center: "乙 禽<br>乙"
    }
  }
}
```

欄位規劃：

| field | 說明 |
|---|---|
| `id` | 建議使用可穩定重建的 key，例如 `${dun}-${ju}-${dayGroup}-${hourPillar}` |
| `dun` | `yang` / `yin` |
| `ju` | 1-9 |
| `dayGroup` | `甲己日` / `乙庚日` / `丙辛日` / `丁壬日` / `戊癸日` |
| `hourPillar` | 六十甲子時柱 |
| `zhifuStar` | 直符星，例如 `天蓬` |
| `zhishiDoor` | 直使門，例如 `休` |
| `palaces` | 九宮 normalized fields |
| `raw.header` | parser 解析出的原始 header |
| `raw.cells` | 各宮原始 cell 或 source text，可依 parser 現況保留 |

## 5. 九宮 mapping 確認

parser 目前九宮對應為：

| markdown 位置 | palace key |
|---|---|
| 第一列第一欄 | `xun` |
| 第一列第二欄 | `li` |
| 第一列第三欄 | `kun` |
| 第二列第一欄 | `zhen` |
| 第二列第二欄 | `center` |
| 第二列第三欄 | `dui` |
| 第三列第一欄 | `gen` |
| 第三列第二欄 | `kan` |
| 第三列第三欄 | `qian` |

converter 需沿用第 84 包規劃與 parser 現有 mapping：

```js
[
  ["xun", "li", "kun"],
  ["zhen", "center", "dui"],
  ["gen", "kan", "qian"]
]
```

中宮需保留，不要丟棄天禽 / 中宮資訊。即使後續正式 plates JSON 需要額外表示寄宮，也應先在 dry-run 保留 parser 已解析出的 `center` 資料與 raw cell，避免資料不可逆。

## 6. validation 設計

converter dry-run 建議至少包含下列 validation：

| validation | 說明 |
|---|---|
| 1080 盤 | normalized objects 總數必須為 1080 |
| 陽遁 / 陰遁 | 陽遁 540，陰遁 540 |
| 每局 60 | 陽遁 1-9 局各 60，陰遁 1-9 局各 60 |
| 每盤 9 宮 | 每盤需包含 `kan` / `gen` / `zhen` / `xun` / `li` / `kun` / `dui` / `qian` / `center` |
| 外宮欄位完整 | 外宮需有 `heavenStem` / `star` / `earthStem` / `door` / `deity` |
| 中宮格式 | 中宮需依 parser 現有規則處理，不套用外宮五欄完整規則 |
| 八門唯一性 | 外宮八門應完整且不重複 |
| 九星唯一性 | 需考慮天禽 / 中宮 / 寄宮，不可用簡化外宮規則硬判 |
| 八神唯一性 | 外宮八神應完整且不重複 |
| 天盤干唯一性 | 天盤干應依 parser diagnostics 已歸零結果驗證 |
| 地盤干唯一性 | 地盤干應依 parser diagnostics 已歸零結果驗證 |
| `zhifuStar` lookup | `zhifuStar` 能找到對應宮 |
| `zhishiDoor` lookup | `zhishiDoor` 能找到對應宮 |

dry-run validation 可分成兩層：

* parser-level prerequisites：沿用 parser diagnostics，要求 `ok: true`。
* converter-level normalized validation：確認轉換後 object 沒有遺失欄位、mapping 錯位或 raw 資訊丟失。

## 7. dry-run report 建議

dry-run report 建議輸出：

* stats
* sample plate objects
* validation summary
* parser diagnostics summary
* converter validation summary

sample plate objects 建議至少包含：

| sample | 條件 |
|---|---|
| 陽遁一局甲己日甲子 | `dun: yang`, `ju: 1`, `dayGroup: 甲己日`, `hourPillar: 甲子` |
| 陽遁九局戊癸日癸亥 | `dun: yang`, `ju: 9`, `dayGroup: 戊癸日`, `hourPillar: 癸亥` |
| 陰遁一局甲己日甲子 | `dun: yin`, `ju: 1`, `dayGroup: 甲己日`, `hourPillar: 甲子` |
| 陰遁九局戊癸日癸亥 | `dun: yin`, `ju: 9`, `dayGroup: 戊癸日`, `hourPillar: 癸亥` |

第一版 dry-run report 不輸出完整 1080 JSON 到正式路徑。若需要檔案形式，應使用 preview/report 路徑，且需在下一包明確定義。

## 8. 後續分包建議

| package | 建議內容 |
|---|---|
| 第 99 包 | 實作 converter dry-run module，但不寫檔 |
| 第 100 包 | 新增 converter dry-run 測試與 sample validation |
| 第 101 包 | 產出暫存 preview JSON 或 report，但不寫正式 `data/qimen/plates/**` |
| 後續 | 再討論正式 plates JSON 寫入 |

正式寫入前應先完成：

* dry-run module
* dry-run tests
* preview report
* sample object 人工檢查
* 正式輸出 schema 對齊
* 覆蓋策略與 rollback 策略

## 9. 本包不處理項目

本包未處理且不應處理下列項目：

* 不修改 parser。
* 不修改 tests。
* 不修改 `data/1080.md`。
* 不產生 JSON。
* 不寫入 `data/qimen/plates/**`。
* 不做 UI。
* 不做 method switch。
* 不做拆補法 / 茅山法 / 無閏法。
* 不做格局、卦名、斷語、吉凶。
* 不 commit。
