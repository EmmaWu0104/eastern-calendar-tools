# eastern-calendar-tools

東方玄學排盤工具，提供以 Asia/Taipei 標準時間為基準的干支曆、節氣、七十二候、九宮飛星與金函玉鏡查詢。專案以靜態前端實作，資料檔由 `data/*.json` 載入，適合部署到 GitHub Pages。

## 線上網站

GitHub Pages URL：

```text
https://emmawu0104.github.io/eastern-calendar-tools/
```

## 功能清單

- 干支曆四柱查詢。
- 24 節氣與節令換月資訊。
- 七十二候查詢，支援中國版 / 日本版候名同時顯示。
- 建除十二神與每日資訊。
- 九宮飛星運盤、年盤、月盤、日盤、時盤顯示。
- 金函玉鏡與青龍黑黃道資訊。
- 奇門遁甲資料與置閏法相關測試資料整理。

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

## 測試方式

```bash
npm test
```

## 真太陽時

1. 上方先選擇手錶日期與時辰，再進入「真太陽時」頁籤。
2. 輸入經緯度或按自動定位，確認手錶時間、地方平太陽時、真太陽時與太陽事件。
3. 按「套用真太陽時至全部排盤」後，四柱節氣、金函玉鏡、九宮飛星、奇門遁甲與登貴會使用真太陽時；原始手錶時間會保留在上方查詢區與狀態列。
4. 可按「恢復手錶時間排盤」。改變上方日期或時辰後會自動解除套用，需重新確認。

目前時間基準固定為臺灣 UTC+8；海外座標不會自動推算當地歷史時區或夏令時間。座標、定位與計算都在瀏覽器本地進行，不呼叫外部 API。

## 授權

本專案採用 MIT License，詳見 [LICENSE](LICENSE)。

## GitHub Pages 發布方式

1. 將程式推送到 GitHub repository。
2. 進入 repository 的 Settings。
3. 開啟 Pages 設定。
4. Source 選擇 `Deploy from a branch`。
5. Branch 選擇 `main`。
6. Folder 選擇 `/ (root)`。
7. 儲存後等待 GitHub Pages 部署完成。

根目錄保留 `.nojekyll`，避免 GitHub Pages 使用 Jekyll 處理靜態檔案。

## 文件

- `docs/data-source.md`：節氣資料來源說明。
- `docs/validation-report.md`：節氣資料驗證報告。
- `docs/ganzhi-rules.md`：第一版干支曆規則。
- `docs/06_九宮飛星交接摘要.md`：九宮飛星時間五盤狀態、規則與測試摘要。
- `docs/31_七十二候中日雙版本階段交接摘要.md`：七十二候中日雙版本資料、查詢與 UI 交接摘要。
