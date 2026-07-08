# 奇門遁甲 1080.md preview JSON 暫存輸出規劃

## 1. 本包目的

本文件是新第 101 包 docs-only 規劃文件，目的為規劃 `data/1080.md` converter dry-run 之後的 preview JSON 暫存輸出路徑、檔名、內容粒度、安全邊界與後續驗收方式。

本包只規劃 preview JSON，不實作 writer、不產生 JSON、不寫 preview 檔、不寫正式 `data/qimen/plates/**`。

## 2. preview JSON 的定位

preview JSON 是人工驗收用暫存產物。

preview JSON 不是：

* 不是正式 `data/qimen/plates/**`。
* 不由 UI 使用。
* 不應被 `getQimenPlate` lookup 使用。
* 不應覆蓋現有 skeleton JSON。
* 不作為正式 converter 輸出格式的最終承諾。

preview JSON 的用途是讓後續分包可以檢查 1080.md 轉出的 normalized objects 是否符合人工預期，並在正式 plates schema 對齊前降低一次性覆蓋正式資料的風險。

## 3. 建議輸出路徑

可選路徑比較：

| 選項 | 優點 | 風險 / 缺點 |
|---|---|---|
| `tmp/qimen1080-preview/` | 偏臨時，語意清楚；不靠近正式 `data/qimen/plates/**`；較不容易被 lookup 誤讀 | 可能不進版控；使用者或 CI 清理 tmp 後不易追蹤歷史 |
| `data/qimen/preview/1080-md/` | 偏可保留檢查；路徑語意接近資料產物；若短期進版控較方便 review | 位於 `data/qimen/` 下，需明確避免正式 lookup 誤讀；未來資料掃描若寫得太寬可能誤納入 |

第一版建議採用：

```text
tmp/qimen1080-preview/
```

理由：

* 第一版 writer 仍是 preview，不應靠近正式資料路徑。
* 能明確傳達暫存與人工驗收性質。
* 可降低 `getQimenPlate` 或未來資料掃描誤讀的機率。
* 等 preview JSON 格式穩定後，再討論是否將可 review 的 preview 移到 `data/qimen/preview/1080-md/`。

若後續需要進版控 review，應另開一包討論是否改用 `data/qimen/preview/1080-md/`，並同步加上 lookup 排除規則與測試。

## 4. 檔案拆分策略

可選拆分策略比較：

| 策略 | 範例 | 人工檢查 | 與正式 plates 對齊 | git diff 可讀性 | 檔案大小 | 誤覆蓋正式資料風險 |
|---|---|---|---|---|---|---|
| 單一完整檔 | `qimen-1080-preview.json` | 可一次看總量，但單檔很大 | 與目前正式 `ju-*.json` 不對齊 | 大 diff，不利逐局 review | 最大 | 低，檔名不同 |
| 依遁別拆分 | `yang.json` / `yin.json` | 可分陰陽檢查 | 只部分對齊 | diff 仍偏大 | 中 | 低，檔名不同 |
| 依遁別與局拆分 | `yang/ju-1.json` ... `yin/ju-9.json` | 最方便逐局人工檢查 | 最接近正式 `data/qimen/plates/{dun}/ju-{n}.json` | 單檔 diff 較小 | 最分散 | 中，檔名接近正式資料，需路徑隔離 |

第一版 preview 建議採用：

```text
tmp/qimen1080-preview/
  yang/
    ju-1.json
    ...
    ju-9.json
  yin/
    ju-1.json
    ...
    ju-9.json
```

理由：

* 每檔 60 盤，人工檢查與 diff review 都比單檔清楚。
* 與未來正式 `data/qimen/plates/**` 的遁別 / 局數概念接近。
* 雖然檔名接近正式資料，但 `tmp/qimen1080-preview/` 路徑與正式路徑隔離，可降低誤覆蓋風險。
* 第 102 包 writer 可明確 hard-code preview root，禁止接受 `data/qimen/plates/` 作為輸出 root。

## 5. preview JSON 內容草案

每個 preview 檔案建議包含：

```json
{
  "meta": {
    "schemaVersion": "qimen-1080-preview-v1",
    "source": "data/1080.md",
    "generatedBy": "qimen1080ConverterDryRun",
    "generatedAt": null,
    "dun": "yang",
    "ju": 1,
    "plateCount": 60,
    "isPreview": true
  },
  "plates": {},
  "diagnostics": {
    "parserOk": true,
    "dryRunOk": true,
    "errors": 0,
    "warnings": 0
  },
  "validation": {}
}
```

### `generatedAt`

`generatedAt` 若寫入真實時間，會造成每次輸出都有 diff 噪音。第一版建議：

```json
"generatedAt": null
```

若後續需要追蹤產生時間，可改由 report 文件或命令列輸出呈現，不放入 preview JSON。

### `plates` key by hourPillar 或 array

| 策略 | 優點 | 缺點 |
|---|---|---|
| key by `hourPillar` | 與每局 60 盤查找需求自然對齊；可快速比對 `甲子` 到 `癸亥`；接近現有 `plates` object 方向 | JSON object 順序需由 writer 固定，避免 diff 不穩 |
| array | 保留原始順序直觀；可支援重複 key 狀況 | 查找需要 scan；正式 lookup 若以時柱定位，仍需轉成 map |

第一版建議 `plates` 使用 key by `hourPillar`：

```json
{
  "plates": {
    "甲子": {},
    "乙丑": {},
    "...": {}
  }
}
```

理由：

* 每個 preview 檔案已由 `dun` + `ju` + `dayGroup` / day groups 內部分組描述上下文，時柱是盤面查找的直接 key。
* 與未來正式 `data/qimen/plates/**` 的 lookup 方向較容易對齊。
* writer 必須固定依六十甲子排序輸出，避免 object key diff 不穩。

### raw 是否保留

第一版 preview 建議保留 `raw`：

* `raw.header` 可回查原始 table header。
* `raw.cells` 可回查九宮原始 cell。
* preview 是人工驗收產物，保留 raw 有助檢查 converter 是否錯位。

正式 JSON 是否保留 `raw` 另行討論，不在本包決定。

### diagnostics / validation summary 是否保留

第一版 preview 建議每檔保留簡短 summary：

* `diagnostics.parserOk`
* `diagnostics.dryRunOk`
* `diagnostics.errors`
* `diagnostics.warnings`
* `validation.plateCount`
* `validation.everyPlateHas9Palaces`
* `validation.requiredFieldsPresent`

完整 validation 明細可留在 writer 命令列輸出或 report 文件，不必重複塞進每個 preview JSON。

## 6. 是否進版控

preview JSON 是否進版控需按用途決定：

| 選項 | 優點 | 風險 / 缺點 |
|---|---|---|
| 不進版控 | 避免大型暫存產物污染 repo；避免後續每次重跑產生大量 diff | review 只能靠本機檔案或報告摘要；跨環境人工驗收較不方便 |
| 短期進版控 | 可做 PR diff / 人工 review；能固定一版 preview 作 schema 對齊依據 | 1080 盤 JSON 可能造成大量 diff；若 preview 格式還不穩，會增加維護成本 |

第一版建議：

* writer 先輸出到 `tmp/qimen1080-preview/`。
* preview JSON 預設不進版控。
* 第 103 包若需要人工驗收紀錄，先新增 docs report 摘要，不急著提交完整 preview JSON。
* 若確定要把 preview JSON 作為 review artifact，再另開分包討論移到可版控路徑與 `.gitignore` 策略。

## 7. 防呆邊界

第 102 包 writer 必須明確遵守：

* writer 不得寫入 `data/qimen/plates/**`。
* writer 不得覆蓋既有 `ju-*.json`。
* writer 預設只寫 preview 路徑。
* writer 輸出 root 應固定為 `tmp/qimen1080-preview/`，或只接受明確 allowlist 內的 preview root。
* 若 preview 目錄已存在，需先明確定義清理或覆蓋策略。
* 第一版建議覆蓋策略為：只允許清理 `tmp/qimen1080-preview/` 內的 writer 產物，不可刪除其他路徑。
* 清理前需 resolve absolute path，確認仍在專案 root 的 `tmp/qimen1080-preview/` 內。
* `npm test` 需驗證正式 plates snapshot 不變。
* `getQimenPlate` 不讀 preview 路徑。
* writer 不提供 UI 入口。
* writer 不做正式 converter 輸出。

## 8. 驗收方式

第 102 writer 實作後，應驗證：

| check | expected |
|---|---|
| preview 檔案存在 | `tmp/qimen1080-preview/{yang,yin}/ju-1.json` 到 `ju-9.json` 皆存在 |
| preview 總盤數 | 1080 |
| 陽 / 陰盤數 | 陽 540，陰 540 |
| 每局盤數 | 每檔 60 |
| samples | 四筆 samples 可從 preview 找到 |
| stats 一致性 | preview 與 dry-run report stats 一致 |
| 正式 plates snapshot | `data/qimen/plates/**` 不變 |
| tests | `npm test` 通過 |
| syntax | writer module `node --check` 通過 |
| whitespace | `git diff --check` 通過 |

samples 至少包含：

* `yang-1-甲己日-甲子`
* `yang-9-戊癸日-癸亥`
* `yin-1-甲己日-甲子`
* `yin-9-戊癸日-癸亥`

## 9. 後續分包建議

| package | 建議內容 |
|---|---|
| 第 102 包 | 實作 preview JSON writer，只寫 preview 路徑 |
| 第 103 包 | preview JSON 檔案驗收與人工檢查報告 |
| 第 104 包 | 正式 plates schema 對齊規劃 |
| 後續 | 正式寫入 `data/qimen/plates/**` 另行規劃 |

第 102 包建議仍維持安全預設：

* 不接 UI。
* 不寫正式 plates。
* 不加入 method switch。
* 不做拆補法 / 茅山法 / 無閏法。
* 不做格局、卦名、斷語、吉凶。

## 10. 本包不處理項目

本包未處理且不應處理下列項目：

* 不修改 code。
* 不修改 tests。
* 不修改 `data/1080.md`。
* 不產生 JSON。
* 不寫 preview 檔。
* 不寫 `data/qimen/plates/**`。
* 不接 UI。
* 不做 converter 正式輸出。
* 不做 method switch。
* 不做拆補法 / 茅山法 / 無閏法。
* 不做格局、卦名、斷語、吉凶。
* 不 commit。
