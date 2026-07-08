# 奇門遁甲 1080.md 正式 plates 寫入前 final go/no-go

## 1. 本包目的

本文件是新第 110 包 docs-only final go/no-go 文件，目的為整理正式寫入 `data/qimen/plates/**` 前的最後檢查清單、預期覆蓋檔案、風險、rollback 與下一包執行條件。

本包只做正式 plates 寫入前 final go/no-go 文件：

* 不實作正式 writer。
* 不產生 candidate JSON。
* 不寫 `data/qimen/plates/**`。
* 不修改 `getQimenPlate`。
* 不接 UI。

## 2. 目前完成鏈路摘要

從 `data/1080.md` 到 formal candidate JSON 的鏈路已完成：

| step | status |
|---|---|
| parser diagnostics 歸零 | ok |
| converter dry-run | ok |
| preview writer | ok |
| preview JSON 驗收 | ok |
| formal schema adapter | ok |
| formal adapter 驗收 | ok |
| formal candidate writer | ok |
| formal candidate JSON 驗收 | ok |
| 正式 plates 寫入 | 尚未寫入 |

目前狀態重點：

* `data/1080.md` 已可被 parser 正確解析。
* formal candidate writer 可臨時產生 18 個正式 schema candidate JSON。
* candidate 總盤數 1080，陽遁 / 陰遁各 540，每局 60。
* 18 個 candidate files 全部通過 `validateQimenPlateFile`。
* candidate 驗收後已清理。
* 正式 `data/qimen/plates/**` 仍未寫入。
* `getQimenPlate` 仍維持 skeleton / `nullPlate` 行為。

## 3. final go/no-go 檢查清單

正式寫入前需逐項確認：

| check | required |
|---|---|
| parser diagnostics 仍 ok | 是 |
| parser errors / warnings | 0 / 0 |
| dry-run report still ok | 是 |
| dry-run `totalObjects` | 1080 |
| dry-run `yangObjects` / `yinObjects` | 540 / 540 |
| dry-run `byDunJu` | 每局 60 |
| preview writer still ok | 是 |
| preview 驗收報告 | 已完成 |
| formal adapter report still ok | 是 |
| formal adapter validation `allFilesValid` | true |
| formal candidate writer still ok | 是 |
| formal candidate JSON 驗收報告 | 已完成 |
| candidate JSON 已清理 | 不殘留 |
| `data/qimen/plates/**` 目前仍是 skeleton / null plates | 是 |
| `getQimenPlate` 目前仍是 `nullPlate` | 是 |
| `git status` | 只包含本包 docs 新增與既有 unrelated untracked files |
| 使用者明確確認 | 下一包才可正式寫入 |

## 4. 即將覆蓋的正式檔案清單

下一包若正式寫入，只應覆蓋下列 18 個檔案：

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
```

下一包不應修改：

* `data/qimen/qimen_yuan_ju_table.json`
* `data/1080.md`
* resolver
* UI
* `getQimenPlate`，除非另包處理 lookup `found` 行為測試

## 5. 正式寫入前的 git 狀態要求

正式寫入前應確認：

* 執行 `git status --short`。
* 不 stage unrelated files。
* 不加入 `2Drive.ffs_gui`。
* 不加入 `玄學小工具.txt`。
* 不加入 `Note.txt`。
* 正式寫入包只允許 `data/qimen/plates/{yang,yin}/ju-*.json` 被修改，另加必要 tests。
* 若下一包需要新增 docs report，可另行加入 docs，但不要混在正式寫入 commit 內，除非明確規劃。

建議正式寫入前工作樹應盡量乾淨，只保留下一包預期改動。

## 6. 正式寫入包建議範圍

第 111 包建議範圍：

* 執行 formal candidate writer 或共用 writer 生成 formal contents。
* 寫入正式 `data/qimen/plates/{yang,yin}/ju-*.json`。
* 寫入前 snapshot 18 個正式 files。
* 寫入後 `validateQimenPlateFile` 全通過。
* 寫入後 `npm test` 通過。
* 寫入後處理必要 lookup tests。
* 不改 UI。
* 不改 resolver。
* 不改 `data/1080.md`。
* 不改 `data/qimen/qimen_yuan_ju_table.json`。

`getQimenPlate` 對代表樣本是否 `found` 建議在第 111 同包驗證，原因見下一節。

## 7. getQimenPlate 行為風險

正式 plates 寫入後，`getQimenPlate` 會從目前 skeleton / `nullPlate` 行為轉為 `found` 的可能性很高。

目前 tests 有多個 `nullPlate` expectation：

* 代表樣本查詢目前期待 `found: false`。
* 18 個 file smoke 目前期待 `status: "nullPlate"`。
* 60 hour pillars smoke 目前期待 `status: "nullPlate"`。

正式寫入包的選項：

| option | 說明 | 風險 |
|---|---|---|
| A | 第 111 正式寫入同時更新必要 lookup tests，確認代表樣本 `found` | 範圍較大，但可確保 `npm test` 通過 |
| B | 第 111 僅寫入 plates，不更新 tests | 既有 `nullPlate` tests 很可能失敗，不建議 |

建議採用 A：

* 第 111 同步調整必要 tests。
* 驗證代表樣本 `found`。
* 仍不改 UI。
* 仍不改 resolver。
* 若要全面調整 lookup behavior，可在第 112 再做更完整測試。

## 8. rollback / restore 指令

若正式寫入後驗收失敗且尚未 commit，可使用下列明確 restore 指令：

```bash
git restore data/qimen/plates/yang/ju-1.json
git restore data/qimen/plates/yang/ju-2.json
git restore data/qimen/plates/yang/ju-3.json
git restore data/qimen/plates/yang/ju-4.json
git restore data/qimen/plates/yang/ju-5.json
git restore data/qimen/plates/yang/ju-6.json
git restore data/qimen/plates/yang/ju-7.json
git restore data/qimen/plates/yang/ju-8.json
git restore data/qimen/plates/yang/ju-9.json
git restore data/qimen/plates/yin/ju-1.json
git restore data/qimen/plates/yin/ju-2.json
git restore data/qimen/plates/yin/ju-3.json
git restore data/qimen/plates/yin/ju-4.json
git restore data/qimen/plates/yin/ju-5.json
git restore data/qimen/plates/yin/ju-6.json
git restore data/qimen/plates/yin/ju-7.json
git restore data/qimen/plates/yin/ju-8.json
git restore data/qimen/plates/yin/ju-9.json
```

明確禁止：

* 不使用 `git reset --hard`。
* 不使用模糊刪除。
* 不清理 unrelated dirty / untracked。
* 若已 commit，使用 `git revert` 或 `reset` 由使用者決定。

## 9. go 條件

第 111 可正式寫入的條件：

* 第 110 文件已 commit。
* 使用者明確說「可以正式寫入」或等價指令。
* `git status` 中無未預期修改。
* `2Drive.ffs_gui` / `玄學小工具.txt` / `Note.txt` 不被加入。
* 確認正式寫入只碰 18 個 plates JSON 與必要測試。
* 確認 `npm test` 必須通過。
* rollback 指令已準備。
* 使用者接受 `getQimenPlate` tests 需要從 `nullPlate` 改為代表樣本 `found` 的變更。

## 10. no-go 條件

不得進第 111 正式寫入的情況：

* 使用者未明確確認正式寫入。
* parser / dry-run / formal adapter / formal candidate 任一失敗。
* candidate JSON 驗收未通過。
* `git status` 有不明 dirty changes。
* 需要改 UI / resolver 才能通過。
* outputRoot guard 有疑慮。
* candidate 產物殘留且原因不明。
* 無法接受必要 tests 變更。

## 11. 第 111 Codex 指令草案

以下只是草案：

* 尚未執行。
* 必須等使用者在第 110 commit 後明確確認才可使用。
* 第 111 才能正式寫 `data/qimen/plates/**`。
* 這段草案只供下一步參考。

```text
請執行 eastern-calendar-tools／東方玄學排盤工具專案的新第 111 包：奇門遁甲 1080.md 正式 plates 寫入。

目標：
- 讀取 data/1080.md。
- parseQimen1080Markdown。
- build formal candidate files。
- 寫入正式 18 個 data/qimen/plates/{yang,yin}/ju-*.json。
- 更新必要 tests，讓 getQimenPlate 代表樣本從 nullPlate 轉為 found。
- 不改 UI。
- 不改 resolver。
- 不改 data/1080.md。
- 不改 data/qimen/qimen_yuan_ju_table.json。

驗證：
- npm test。
- node --check 相關 writer / adapter / validation / tests。
- git diff --check。
- git status --short。

回報：
- 修改檔案清單。
- 寫入 18 個正式 plates 檔案。
- tests 調整摘要。
- getQimenPlate 代表樣本 found 結果。
- rollback 狀態。
```

## 12. 本包不處理項目

本包未處理且不應處理下列項目：

* 不修改 code。
* 不修改 tests。
* 不修改 `data/1080.md`。
* 不產生 candidate JSON。
* 不保留 candidate JSON。
* 不寫 `data/qimen/plates/**`。
* 不修改 `getQimenPlate`。
* 不接 UI。
* 不做正式 plates 寫入。
* 不做 method switch。
* 不做拆補法 / 茅山法 / 無閏法。
* 不做格局、卦名、斷語、吉凶。
* 不 commit。
