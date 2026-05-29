# eastern-calendar-tools

東方曆法與排盤工具。

目前資料：
- `data/solar_terms_1899_2101.json`：1899～2101 年 24 節氣資料
- 目標查詢範圍：1900～2100

## 本機啟動

本專案使用 ES module 與 `fetch` 載入資料，不能直接雙擊 `index.html` 或用 `file://` 開啟，否則瀏覽器會阻擋模組或資料載入。請使用本機靜態伺服器。

```bash
npm install
npm run dev
```

開啟：

```text
http://localhost:8080/
```

文件：
- `docs/data-source.md`：節氣資料來源說明
- `docs/validation-report.md`：節氣資料驗證報告
- `docs/ganzhi-rules.md`：第一版干支曆規則

後續預計功能：
- 干支曆查詢
- 八字四柱
- 九宮飛星
- 奇門遁甲置閏起局
