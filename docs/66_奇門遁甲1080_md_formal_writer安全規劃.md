# 奇門遁甲 1080.md formal writer 安全規劃

## 1. 本包目的

本文件是新第 107 包 docs-only 規劃文件，目的為規劃 `data/1080.md` formal writer 的安全策略與分階段落盤流程。

本包只規劃 formal writer 安全流程：

* 不實作 writer。
* 不產生 JSON。
* 不寫 preview 檔。
* 不寫 formal candidate 檔。
* 不寫正式 `data/qimen/plates/**`。
* 不接 UI。

## 2. 目前資料流狀態

目前已完成與未來資料流：

```text
data/1080.md
  -> parseQimen1080Markdown
  -> convertQimen1080ParsedToDryRun
  -> buildQimen1080PreviewFiles / writeQimen1080PreviewFiles
  -> buildQimen1080FormalPlateAdapterReport
  -> 未來 formal candidate writer
  -> 未來正式 writer
  -> data/qimen/plates/{yang,yin}/ju-{1..9}.json
  -> getQimenPlate
```

目前狀態：

| step | status |
|---|---|
| `data/1080.md` parser diagnostics | 已歸零 |
| dry-run normalized objects | 已完成 |
| preview writer | 已完成，僅寫 `tmp/qimen1080-preview/**` 並可清理 |
| formal adapter | 已完成 in-memory candidate files |
| formal candidate writer | 尚未實作 |
| 正式 writer | 尚未實作 |
| `data/qimen/plates/**` | 仍是 skeleton / null plates |
| `getQimenPlate` | 仍維持 `nullPlate` 行為 |
| UI | 尚未接正式盤面 |

## 3. formal writer 分階段策略

### Phase A：formal candidate writer

第 108 包建議只實作 formal candidate writer：

* 只輸出到 `tmp/qimen1080-formal-candidate/**`。
* 不覆蓋 `data/qimen/plates/**`。
* 輸出內容使用正式 plates schema，不是 preview schema。
* 可驗收 JSON 實體檔。
* 測試後預設清理 candidate 產物。

### Phase B：formal candidate 驗收

第 109 包建議只做 candidate JSON 驗收報告：

* 驗收 18 files。
* 驗收 1080 plates。
* 驗收每局 60。
* 驗收每檔 `validateQimenPlateFile` 通過。
* 驗收四筆 samples。
* 檢查 diff readability。
* 明確記錄 candidate 已清理或是否保留。
* 正式 `data/qimen/plates/**` 仍不得修改。

### Phase C：正式 `data/qimen/plates/**` 寫入

正式寫入需另包 final go/no-go 後才可做，不在第 108 直接做。

正式寫入前必須：

* 重新跑 parser / dry-run / preview / formal adapter / formal candidate writer。
* 驗收 candidate JSON。
* 明確列出即將覆蓋的 18 個正式檔案。
* 由使用者確認正式寫入。
* 準備 rollback / restore 策略。

## 4. formal candidate writer 輸出路徑規劃

第 108 第一版建議輸出：

```text
tmp/qimen1080-formal-candidate/
  yang/
    ju-1.json
    ...
    ju-9.json
  yin/
    ju-1.json
    ...
    ju-9.json
```

說明：

* 這是正式 schema candidate，不是 preview schema。
* 不由 `getQimenPlate` 讀取。
* 不進正式 lookup。
* 預設不進版控。
* 驗收完成後可清理。
* 若短期需要人工 diff review，需另包明確說明是否保留 candidate 產物。

## 5. formal candidate file 內容

第 108 candidate writer 應輸出與正式 skeleton 對齊的格式：

```json
{
  "meta": {
    "schemaVersion": "1.0.0",
    "dunType": "yang",
    "dunName": "陽遁",
    "ju": 1,
    "plateCount": 60,
    "source": "data/1080.md",
    "notes": "由 data/1080.md 轉換產生。"
  },
  "plates": {
    "甲子": {}
  }
}
```

內容要求：

| field | 要求 |
|---|---|
| `meta.schemaVersion` | `"1.0.0"` |
| `meta.dunType` | `yang` / `yin` |
| `meta.dunName` | `陽遁` / `陰遁` |
| `meta.ju` | 1-9 |
| `meta.plateCount` | 60 |
| `meta.source` | `"data/1080.md"` |
| `meta.notes` | `"由 data/1080.md 轉換產生。"` |
| `plates` | 60 個六十甲子 key |
| plate value | formal plate object |
| key order | 固定依 `QIMEN_HOUR_PILLARS` / `SEXAGENARY_CYCLE` |

formal plate object 應由 `src/qimen1080FormalPlateAdapter.js` 產生，不在 writer 內重寫 schema mapping。

## 6. safety guards

formal candidate writer 必須：

* 預設只寫 `tmp/qimen1080-formal-candidate/**`。
* 不接受 `data/qimen/plates` 作為 `outputRoot`。
* 不接受任何 `data/qimen/plates/**` 子路徑。
* `outputRoot` 必須在 allowlist 內。
* 清理時只能清理 `tmp/qimen1080-formal-candidate/**`。
* 清理前 resolve absolute path，確認仍在 project root 的 `tmp/qimen1080-formal-candidate/`。
* 不修改 `data/qimen/qimen_yuan_ju_table.json`。
* 不修改 `data/1080.md`。
* 不修改 `getQimenPlate`。
* 不接 UI。
* 不寫正式 `data/qimen/plates/**`。
* 不做 method switch。

建議 writer API：

```js
buildQimen1080FormalCandidateFiles(parsed)
writeQimen1080FormalCandidateFiles(parsed, options)
clearQimen1080FormalCandidateOutput(options)
```

其中 `build...` 僅回傳 in-memory file contents；`write...` 只允許寫入 candidate allowlist root。

## 7. write preconditions

formal candidate writer 寫檔前必須檢查：

| precondition | expected |
|---|---|
| parser `ok` | true |
| parser errors / warnings | 0 / 0 |
| dry-run report `ok` | true |
| dry-run `totalObjects` | 1080 |
| dry-run `yangObjects` / `yinObjects` | 540 / 540 |
| dry-run `byDunJu` | 每局 60 |
| formal adapter report `ok` | true |
| formal adapter validation `allFilesValid` | true |
| formal adapter errors / warnings | 0 / 0 |

若任一 precondition 失敗：

* writer 必須停止。
* 不寫任何 candidate file。
* 回傳 failed result 與 diagnostics。

## 8. 第 108 測試規劃

第 108 應新增測試：

* candidate writer ok。
* 18 candidate files 存在。
* 每檔 parseable JSON。
* 每檔 `validateQimenPlateFile` ok。
* `totalPlates` 1080。
* `yang` / `yin` 各 540。
* 每局 60。
* 四筆 sample 存在：
  * `yang/ju-1.json plates["甲子"]`
  * `yang/ju-9.json plates["癸亥"]`
  * `yin/ju-1.json plates["甲子"]`
  * `yin/ju-9.json plates["癸亥"]`
* sample `schemaVersion === 1`。
* sample `source` / `palaces` / `center` / flags 正確。
* `data/qimen/plates/**` snapshot 不變。
* `getQimenPlate` 仍為 `nullPlate`。
* `outputRoot` 指向 `data/qimen/plates` 時必須拒絕。
* 測試後清理 `tmp/qimen1080-formal-candidate/**`，避免產物殘留。

第 108 指定驗證建議：

* `npm test`
* `node --check src/qimen1080FormalCandidateWriter.js`
* `node --check src/qimen1080FormalPlateAdapter.js`
* `node --check tests/run-tests.js`
* `git diff --check`
* `git status --short`

## 9. formal candidate 驗收報告規劃

第 109 驗收文件應記錄：

* candidate 18 files。
* 1080 plates。
* 陽遁 / 陰遁各 540。
* 每局 60。
* validation 全通過。
* 四筆 samples。
* 天禽 / center 註記。
* `source.rawHeader` / `source.rawCells`。
* candidate 已清理或是否保留。
* 正式 plates 仍未修改。
* `getQimenPlate` 仍未讀 candidate。

## 10. 正式寫入 data/qimen/plates/** 前 final go/no-go

第 110 應檢查：

| check | expected |
|---|---|
| parser diagnostics | 仍歸零 |
| dry-run report | 仍 ok |
| preview writer | 仍 ok |
| formal adapter | 仍 ok |
| formal candidate writer | 仍 ok |
| candidate JSON 驗收 | 通過 |
| git status | 只包含預期檔案 |
| 即將覆蓋檔案 | 明確列出 18 個正式 plates 檔案 |
| rollback 指令 | 已準備 |
| 正式寫入 | 需使用者確認 |

即將覆蓋的正式檔案應明確列為：

```text
data/qimen/plates/yang/ju-1.json
...
data/qimen/plates/yang/ju-9.json
data/qimen/plates/yin/ju-1.json
...
data/qimen/plates/yin/ju-9.json
```

正式寫入不應同時修改：

* `data/1080.md`
* `data/qimen/qimen_yuan_ju_table.json`
* resolver
* UI
* `getQimenPlate`

## 11. rollback / restore 策略

正式寫入前：

* 先確認 `git status --short`。
* 確認沒有 unrelated dirty changes 會被覆蓋。
* 寫入集中單一 commit。
* 寫入前可保存 candidate output 與 stats report。

若寫入後驗收失敗且尚未 commit：

```powershell
git restore data/qimen/plates/yang/ju-*.json
git restore data/qimen/plates/yin/ju-*.json
```

注意：

* 不使用模糊刪除。
* 不清理 unrelated dirty / untracked。
* 不使用 `git reset --hard`。
* 若已 commit，使用 revert 或 reset 由使用者決定。

## 12. 本包不處理項目

本包未處理且不應處理下列項目：

* 不修改 code。
* 不修改 tests。
* 不修改 `data/1080.md`。
* 不產生 JSON。
* 不寫 preview 檔。
* 不寫 formal candidate 檔。
* 不寫 `data/qimen/plates/**`。
* 不修改 `getQimenPlate`。
* 不接 UI。
* 不做正式 writer。
* 不做 method switch。
* 不做拆補法 / 茅山法 / 無閏法。
* 不做格局、卦名、斷語、吉凶。
* 不 commit。
