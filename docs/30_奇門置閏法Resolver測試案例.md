# 奇門置閏法 Resolver 測試案例

本文件整理奇門遁甲置閏法 resolver 後續實作時的測試案例。本文只記錄測試規格，不代表 resolver 已實作。

## 一、文件目的

本文件目的，是先建立奇門置閏法 resolver 的人工驗證案例與測試欄位，避免後續實作時只用一般節氣案例測試，忽略超神、接氣、置閏與跨年邊界。

本工具只採置閏法：

- 不支援拆補法。
- 不支援茅山法。
- 不支援無閏簡化法。
- 不預留 `method` 參數。

## 二、測試策略

resolver 測試應分為三層：

### 1. 硬欄位測試

硬欄位是規則已明確、後續應固定驗證的欄位：

- `qimenSolarTerm`
- `yuan`
- `dunType`
- `dunName`
- `ju`
- `isIntercalary`

### 2. 軟欄位測試

軟欄位是狀態名稱可在實作前再精修的欄位：

- `status`
- `notes`

測試若尚未完全確認 `status`，可先把 `status` 驗證分為 hard / soft。

### 3. 整合欄位測試

整合欄位用於確認 resolver 與既有干支曆銜接：

- `actualSolarTerm`
- `hourPillar`

`hourPillar` 需注意 23:00 換日與時辰切換，但不應影響 `qimenSolarTerm` 的硬驗證結果。

## 三、測試資料來源

測試資料來源：

- `docs/27_奇門超神接氣置閏規則.md`
- `docs/29_奇門置閏法Resolver演算法設計.md`
- 既有 24 節氣實際交節時間資料。
- `data/qimen/qimen_yuan_ju_table.json`
- 既有干支曆日柱與時柱邏輯。

測試不讀取 1080 盤面資料。

測試不檢查九宮盤、星、門、神、奇儀等完整盤面欄位。

## 四、必測欄位

resolver 測試至少要檢查：

- `actualSolarTerm`
- `qimenSolarTerm`
- `status`
- `yuan`
- `dunType`
- `dunName`
- `ju`
- `hourPillar`
- `isIntercalary`

其中：

- `qimenSolarTerm`、`yuan`、`dunType`、`ju`、`isIntercalary` 為主要硬驗證欄位。
- `status` 顯示名稱可先列為 soft 欄位。
- `hourPillar` 依既有時柱邏輯驗證，不由奇門 resolver 自行推算。

## 五、2027 芒種不置閏案例

案例 A：2027 芒種未置閏。

已知：

- 2027 芒種交節時間：2027/6/6 05:26。
- 2027/6/6 已是芒種中元第三天。
- 超神天數 = 芒種上元 5 日 + 芒種中元 3 日 = 8 日。
- 未達九日，不置閏。
- 2027/6/13 芒種下元結束。
- 2027/6/14 直接進入奇門夏至上元。
- 2027 夏至實際交節時間：2027/6/21 22:11。
- 但 2027/6/14 已依奇門局序進入陰遁。

### 測試點 A1：2027/6/6 12:00

預期：

- `actualSolarTerm`: 芒種
- `qimenSolarTerm`: 芒種
- `yuan`: 中元
- `dunType`: `yang`
- `dunName`: 陽遁
- `ju`: 3
- `isIntercalary`: `false`
- `status`: 正授或超神

狀態說明：

- `status` 可依 resolver 狀態定義再決定。
- `qimenSolarTerm`、`yuan`、`dunType`、`ju`、`isIntercalary` 必須固定。

### 測試點 A2：2027/6/13 12:00

預期：

- `qimenSolarTerm`: 芒種
- `yuan`: 下元
- `dunType`: `yang`
- `dunName`: 陽遁
- `ju`: 9
- `isIntercalary`: `false`

### 測試點 A3：2027/6/14 12:00

預期：

- `actualSolarTerm`: 芒種
- `qimenSolarTerm`: 夏至
- `yuan`: 上元
- `dunType`: `yin`
- `dunName`: 陰遁
- `ju`: 9
- `isIntercalary`: `false`
- `status`: 超神

此案例驗證：

- 未達九日不置閏。
- 實際夏至未到，但奇門局序已進入夏至上元。
- 陰陽遁依奇門節氣局序切換，2027/6/14 已開始陰遁。

### 測試點 A4：2027/6/21 23:00 或 2027/6/22 00:30

預期：

- `actualSolarTerm`: 夏至
- `qimenSolarTerm`: 夏至
- `status`: 正授或依實際 timeline 判定
- `dunType`: `yin`
- `dunName`: 陰遁

注意：

- 日柱 23:00 換日會影響 day / hour 相關欄位。
- 23:00 換日不改變 `qimenSolarTerm` 屬性。

## 六、2027 夏至提前陰遁案例

此案例可由測試點 A3 延伸。

測試時間：

```text
2027/6/14 12:00
```

重點：

- 實際節氣仍為芒種。
- 奇門節氣已為夏至。
- `dunType` 必須是 `yin`。
- `dunName` 必須是陰遁。
- `ju` 必須是夏至上元九局。

此案例禁止用實際夏至交節時間直接判斷陰陽遁。

## 七、2027 大雪置閏案例

案例 B：2027 大雪置閏。

已知：

- 2027 大雪交節時間：2027/12/7 16:38。
- 該日已是大雪下元第二天。
- 超神天數 = 大雪上元 5 日 + 大雪中元 5 日 + 大雪下元 2 日 = 12 日。
- 已達九日以上，因此在大雪後置閏。
- 2027/12/11 起重新走一次大雪三元，共 15 日。
- 2027 冬至交節時間：2027/12/22 10:42。
- 2027/12/25 置閏大雪下元結束。
- 2027/12/26 才進入奇門冬至上元，並開始陽遁。

### 測試點 B1：2027/12/7 18:00

預期：

- `actualSolarTerm`: 大雪
- `qimenSolarTerm`: 大雪
- `yuan`: 下元
- `dunType`: `yin`
- `dunName`: 陰遁
- `ju`: 1
- `isIntercalary`: `false`
- `status`: 正授或超神

狀態說明：

- `status` 可依 resolver 狀態定義再決定。
- `qimenSolarTerm`、`yuan`、`dunType`、`ju`、`isIntercalary` 必須固定。

### 測試點 B2：2027/12/11 12:00

預期：

- `actualSolarTerm`: 大雪
- `qimenSolarTerm`: 大雪
- `yuan`: 上元
- `dunType`: `yin`
- `dunName`: 陰遁
- `ju`: 4
- `isIntercalary`: `true`
- `status`: 置閏

### 測試點 B3：2027/12/16 12:00

預期：

- `qimenSolarTerm`: 大雪
- `yuan`: 中元
- `dunType`: `yin`
- `dunName`: 陰遁
- `ju`: 7
- `isIntercalary`: `true`
- `status`: 置閏

### 測試點 B4：2027/12/22 12:00

預期：

- `actualSolarTerm`: 冬至
- `qimenSolarTerm`: 大雪
- `yuan`: 下元
- `dunType`: `yin`
- `dunName`: 陰遁
- `ju`: 1
- `isIntercalary`: `true`
- `status`: 置閏後接氣

說明：

- 實際冬至已到，但奇門局序仍在閏大雪。
- 因此尚未切陽遁。

### 測試點 B5：2027/12/25 12:00

預期：

- `qimenSolarTerm`: 大雪
- `yuan`: 下元
- `dunType`: `yin`
- `dunName`: 陰遁
- `ju`: 1
- `isIntercalary`: `true`

## 八、2027 冬至仍未切陽遁案例

測試時間：

```text
2027/12/22 12:00
```

重點：

- `actualSolarTerm`: 冬至
- `qimenSolarTerm`: 大雪
- `isIntercalary`: `true`
- `dunType`: `yin`
- `dunName`: 陰遁
- `status`: 置閏後接氣

此案例驗證：

- 實際冬至交節時間不能直接切陽遁。
- 若奇門局序仍在閏大雪，仍為陰遁。

## 九、2027/12/26 進入冬至上元案例

### 測試點 B6：2027/12/26 12:00

預期：

- `actualSolarTerm`: 冬至
- `qimenSolarTerm`: 冬至
- `yuan`: 上元
- `dunType`: `yang`
- `dunName`: 陽遁
- `ju`: 1
- `isIntercalary`: `false`
- `status`: 正授或接氣

狀態說明：

- `status` 需依實際 timeline 狀態定義最終確認。
- `qimenSolarTerm`、`yuan`、`dunType`、`ju` 必須固定。

此案例驗證：

- 2027/12/25 置閏大雪下元結束。
- 2027/12/26 才進入奇門冬至上元。
- 進入奇門冬至上元後才開始陽遁。

## 十、一般正授案例

一般正授案例應挑選交節當天奇門有效日為甲子、甲午、己卯或己酉，且不在置閏區間的日期；實際節氣與奇門節氣相同不是充分條件。

預期：

- 交節當天的奇門有效日為符頭，且 `actualSolarTerm` 與 `qimenSolarTerm` 相同。
- `isIntercalary`: `false`
- `status`: 正授
- `dunType` 與 `ju` 由 `qimenSolarTerm + yuan` 查表取得。

建議後續補充：

```json
{
  "name": "一般正授案例",
  "query": "待補",
  "expected": {
    "actualSolarTerm": "待補",
    "qimenSolarTerm": "待補",
    "status": "正授",
    "isIntercalary": false
  }
}
```

## 十一、超神案例

超神案例應挑選奇門節氣走在實際節氣之前的日期。

已知可用案例：

```text
2027/6/14 12:00
```

預期：

- `actualSolarTerm`: 芒種
- `qimenSolarTerm`: 夏至
- `status`: 超神
- `dunType`: `yin`
- `ju`: 9
- `isIntercalary`: `false`

此案例同時驗證夏至提前陰遁。

## 十二、接氣案例

接氣案例應挑選實際節氣走在奇門節氣之前，且不在置閏區間的日期。

注意：

- 接氣不是固定天數規則。
- 不可以寫「接氣最多五日」。
- 接氣應由實際節氣與奇門 timeline 比對後自然得到。

後續需再補人工驗證日期。

建議格式：

```json
{
  "name": "接氣案例",
  "query": "待補",
  "expected": {
    "actualSolarTerm": "待補",
    "qimenSolarTerm": "待補",
    "status": "接氣",
    "isIntercalary": false
  },
  "assertionLevel": {
    "status": "soft"
  }
}
```

## 十三、跨年案例

跨年案例用於避免 timeline 只產生單一西曆年。

必測方向：

- 2027/12/26 進入冬至上元。
- 2028 年初仍能承接 2027 冬至後的奇門局序。
- 年初查詢不可因缺少前一年冬至 timeline 而失敗。
- 年底查詢不可因大雪置閏影響冬至而斷裂。

建議後續補充：

```json
{
  "name": "跨年冬至後承接",
  "query": "2028-01-01T12:00:00+08:00",
  "expected": {
    "actualSolarTerm": "待補",
    "qimenSolarTerm": "待補",
    "isIntercalary": false
  }
}
```

## 十四、後續補充案例格式

後續測試案例建議使用下列格式：

```json
{
  "name": "2027 大雪置閏後接氣",
  "query": "2027-12-22T12:00:00+08:00",
  "expected": {
    "actualSolarTerm": "冬至",
    "qimenSolarTerm": "大雪",
    "yuan": "下元",
    "dunType": "yin",
    "dunName": "陰遁",
    "ju": 1,
    "isIntercalary": true,
    "status": "置閏後接氣"
  },
  "assertionLevel": {
    "status": "soft",
    "qimenSolarTerm": "hard",
    "yuan": "hard",
    "dunType": "hard",
    "ju": "hard",
    "isIntercalary": "hard"
  }
}
```

欄位原則：

- `query` 使用明確時區，例如 `+08:00`。
- `expected` 保留 resolver 應回傳的主要欄位。
- `assertionLevel` 標示 hard / soft，避免狀態命名尚未固定時阻礙硬規則驗證。
- 若測試涉及 23:00 換日，需另外標示日柱與時柱預期。

## 十五、本包限制

本包只新增測試案例文件與演算法設計文件。

本包不修改：

- 程式碼。
- UI。
- 測試。
- 資料 JSON。
- `data/qimen/`。
- 1080 盤面資料。
- 既有干支曆核心。
- 既有 24 節氣資料。

本包不實作 resolver，也不接 UI。
