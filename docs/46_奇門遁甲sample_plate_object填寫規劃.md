# 46 奇門遁甲 sample plate object 填寫規劃

本文件是第 83 包 docs-only 規劃文件，目標是規劃第一筆 sample plate object 的填寫方式。

本包不實際修改 `data/qimen/plates/**`，不填入 sample plate object，不修改 validation helper，也不修改 UI rendering。本包延續第 79 包 object schema 與第 81 包 validation helper。

第一筆 sample 目標是驗證資料結構與未來 UI rendering，不代表 1080 盤面已完成。

## 1. sample 目標與邊界

sample plate object 的目的：

* 驗證 plate object schema 是否足以承載九宮資料。
* 驗證 `getQimenPlate(...)` found branch 可承接 object。
* 驗證 validation helper 可檢查 object plate。
* 為未來 UI rendering found plate 做最小資料來源。
* 只填一筆，避免大量資料錯誤擴散。

sample 不代表：

* 不代表 1080 盤面完成。
* 不代表完整奇門資料庫完成。
* 不代表已完成九宮盤面 rendering。
* 不代表已完成 content-level validation。
* 不代表已加入新盤法或 method switch。

## 2. 建議 sample 位置

建議第一筆 sample 選：

```text
data/qimen/plates/yang/ju-1.json
plates.甲子
```

原因：

* `yang / ju-1 / 甲子` 是最容易理解的起點。
* 測試與文件中常用 `2027-12-26T12:00` 對應陽遁一局。
* `甲子` 是 60 甲子第一個 key。
* 後續測試容易定位。
* 不需新增檔案，只需把既有 null 替換成 object。
* validation helper 已可驗 object plate。

補充：

* 本包只規劃，不實際填。
* 下一包若要實作 sample，才修改 `data/qimen/plates/yang/ju-1.json`。
* 不建議第一筆 sample 選陰遁或置閏盤，避免同時引入太多認知負擔。

## 3. sample plate object 欄位策略

依第 79 包 schema，建議 sample 使用下列頂層欄位：

```json
{
  "schemaVersion": 1,
  "hourPillar": "甲子",
  "zhiFuStar": null,
  "zhiShiDoor": null,
  "xunShou": null,
  "notes": [],
  "palaces": {}
}
```

說明：

* `schemaVersion` 固定 1。
* `hourPillar` 必須等於 key `甲子`。
* `zhiFuStar` / `zhiShiDoor` / `xunShou` 若來源未確認，先用 null。
* `notes` 可放來源與人工確認狀態。
* `palaces` 必須含 9 宮。

## 4. palaces 欄位策略

每宮都要有：

* `palaceName`
* `direction`
* `luoshuNumber`
* `earthStem`
* `heavenStem`
* `door`
* `star`
* `deity`
* `isEmpty`
* `isHorse`
* `isZhiFuPalace`
* `isZhiShiPalace`
* `notes`

若真實資料尚未確認：

* `earthStem` / `heavenStem` / `door` / `star` / `deity` 可先填 null。
* boolean 標記先填 false。
* `notes` 先填空陣列。

補充：

* 即使內容暫時 null，也要建立 9 宮完整結構。
* sample 的重點是 schema 與 validation，不是先追求真盤內容。
* 不能把示意資料偽裝成正式盤。

## 5. 來源與可信度標記

sample notes 需標記：

* 資料來源。
* 是否人工校對。
* 是否可視為正式盤。
* 是否僅為 schema sample。

建議 notes 範例：

```json
[
  "sample：此筆資料用於 schema / validation / rendering 測試。",
  "尚未作為正式奇門盤資料使用。",
  "正式內容需另行依可靠資料來源校對。"
]
```

說明：

* 如果下一包只是 schema sample，不應填看似真實但未驗證的天盤 / 地盤 / 八門 / 九星 / 八神。
* 若要填真實盤面內容，必須明確列出資料來源與校對方式。
* 不建議用 AI 直接生成盤面資料作為正式盤。

## 6. sample 實作方案比較

### 6.1 方案 A：schema-only sample

內容：

* `甲子` 從 null 改成完整 object。
* 9 宮都存在。
* 宮位 meta 正確。
* 排盤欄位多數為 null。
* notes 明確標記 sample。

優點：

* 最安全。
* 不會誤導為正式盤。
* 可驗證 `getQimenPlate(...)` found branch。
* 可驗證 UI found plate rendering skeleton。
* 可驗證 validation object path。

缺點：

* 不能驗證真實盤面內容。
* UI 顯示會有很多空值。

### 6.2 方案 B：正式內容 sample

內容：

* 填入真實陽遁一局甲子時盤。
* 9 宮包含天盤干、地盤干、門、星、神等內容。
* notes 標記資料來源。

優點：

* 可以直接驗真實盤面 rendering。
* 更接近最終資料型態。

缺點：

* 需要可靠資料來源。
* 需要人工校對。
* 容易把未確認資料混入正式 data。
* 若錯誤，後續 UI / validation 可能建立在錯誤資料上。

建議：

* 第一筆先採 **方案 A：schema-only sample**。
* 等 schema-only sample、found branch 與 UI rendering 都穩定後，再另包填正式內容 sample。

## 7. 下一包若實作 sample 的建議範圍

若第 84 包實作 sample，建議只修改：

* `data/qimen/plates/yang/ju-1.json`
* `tests/run-tests.js`
* 可選：`docs/46_奇門遁甲sample_plate_object填寫規劃.md`

不建議修改：

* `src/main.js`
* `styles/main.css`
* `src/qimenPlateLookup.js`
* `src/qimenPlateValidation.js`
* `src/qimenResolver.js`

下一包應完成：

* 將 `plates.甲子` 從 null 改成 schema-only object。
* 保留其它 59 個時柱為 null。
* `npm test` 通過。
* validation 測試仍通過。
* `getQimenPlate({ dunType: "yang", ju: 1, hourPillar: "甲子" })` 應回 found。
* 新增 / 調整測試確認 found branch。
* 不做 UI rendering。

## 8. sample 實作驗收條件

若未來實作 sample，應驗收：

* `data/qimen/plates/yang/ju-1.json` JSON 可解析。
* `plates.甲子` 是 object。
* `plates.甲子.schemaVersion === 1`。
* `plates.甲子.hourPillar === "甲子"`。
* `plates.甲子.palaces` 含 9 宮。
* 每宮 meta 符合 `QIMEN_PALACE_META`。
* 其它 59 個 plate 仍是 null。
* `validateQimenPlateFile(...)` 通過。
* `getQimenPlate(...)` 對甲子回 `found`。
* `getQimenPlate(...)` 對乙丑仍回 `nullPlate`。
* 不影響奇門 resolver。
* 不影響 UI fallback。
* 不顯示 lookup metadata / cache stats。

## 9. 風險與避免方式

風險：

* sample 被誤認為正式盤面資料。
* sample object 空值太多，未來 UI 顯示不好看。
* 如果直接填真實盤但來源未驗證，會污染資料庫。
* 如果同包做 sample + rendering，問題難以定位。
* 若修改 validation helper，可能把 sample 特例寫死。

避免方式：

* notes 明確標記 sample。
* 第一筆採 schema-only sample。
* 不在 sample 包修改 UI。
* 不在 sample 包修改 validation helper，除非 validation 發現合理缺口。
* 不把 sample 轉成大量資料模板前先人工確認。
* 不在 README 宣稱 1080 盤面完成。

## 10. 目前不處理項目

* 不填入 sample。
* 不填真實盤面資料。
* 不修改 `data/qimen/plates/**`。
* 不新增 UI rendering。
* 不修改 validation helper。
* 不修改 getQimenPlate。
* 不做 content-level validation。
* 不做完整 1080 盤資料。
* 不做 method switch。
* 不做拆補法、茅山法、無閏法。
* 不加入真太陽時。

## 11. 後續建議

建議後續順序：

1. 第 84 包：實作 schema-only sample plate object。
2. 第 85 包：docs 補 sample 實作結果。
3. 第 86 包：found plate UI rendering 設計文件。
4. 第 87 包：實作 minimal found plate rendering。
5. 第 88 包以後：正式內容 sample / 資料來源校對 / 大量資料策略。

也可以選擇：

* 暫停奇門盤面資料，先整理其它模組。
* 先做人工驗收。
* 先找可靠奇門盤資料來源。

## 12. 本文件結論

* 第一筆 sample 建議選 `yang/ju-1.json` 的 `甲子`。
* 第一筆 sample 建議採 schema-only sample。
* 目的不是建立正式盤，而是驗證 object schema、validation 與 future found rendering。
* 實作 sample 時不要同包做 UI rendering。
* 不建議直接填大量 1080 盤資料。
* 若要填真實內容，需另行確認可靠資料來源與校對方式。
