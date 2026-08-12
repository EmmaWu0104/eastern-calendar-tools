# eastern-calendar-tools

東方玄學排盤工具，正式提供手錶時間與真太陽時兩種排盤模式，包含干支曆、節氣、七十二候、九宮飛星、金函玉鏡、登貴與奇門遁甲查詢。專案以靜態前端實作，資料檔由 `data/*.json` 載入，適合部署到 GitHub Pages。

## 線上網站

GitHub Pages URL：

```text
https://emmawu0104.github.io/eastern-calendar-tools/
```

## 功能清單

- 干支曆四柱與每日附屬資訊查詢。
- 24 節氣與節令換月資訊。
- 七十二候查詢，支援中國版 / 日本版候名同時顯示。
- 建除十二神與每日資訊。
- 九宮飛星運盤、年盤、月盤、日盤、時盤顯示。
- 金函玉鏡與青龍黑黃道資訊。
- 登貴日出／日落可用時間窗與時辰標記。
- 奇門遁甲 1080 盤正式 UI、置閏法與盤面查詢（維持手錶時間／Asia-Taipei 語意）。

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

系統正式提供兩種排盤模式。模式由 URL 的 `timeMode` 表示，未指定時為手錶時間：

- `?timeMode=watch`：預設與相容模式；各盤維持既有手錶時間計算。
- `?timeMode=true-solar`：四柱、每日附屬資訊、九宮飛星、金函玉鏡與登貴正式使用 Source A 上方排盤時間及 formal location；奇門遁甲仍維持既有手錶時間。

### 正式排盤與時間 authority

頁面上方的 `#datetime` 正式稱為「排盤時間」，是 Source A 與唯一正式排盤時間來源；其值一律代表 `Asia/Taipei` 的手錶／civil query time。真太陽模式以該 civil time 對應的同一個 actual instant、Source A formal location 與 immutable `ChartTimeContext` 建立正式排盤，不另存第二份正式 datetime authority。

真太陽模式已正式支援四柱、每日附屬資訊、九宮飛星、金函玉鏡、登貴、節氣時間、七十二候區間、十二時辰 active-clock picker、真太陽有效日，以及農曆 civil-date 語意提示。時間規則如下：

- 年柱／月柱以 actual civil instant 與節氣 actual instant 比較；真太陽時不會改變節氣發生的 instant。
- 日柱／時柱在手錶模式使用手錶 local clock，在真太陽模式使用真太陽 local clock；兩者都依各自 local clock 於 23:00 換日。
- 節氣、七十二候與登貴等天文事件保留同一 actual event instant；手錶模式顯示 civil clock，真太陽模式顯示 true-solar clock。

排盤時間支援秒級手動輸入，可跟隨現在時間或手動查詢。手動修改會暫停現在時間自動更新；點「現在時間」可恢復持續更新。

### Source A／B／C 與 location ownership

真太陽時頁面可選擇三種查詢時間來源：

1. **Source A — 上方排盤時間／正式排盤來源**：正式 charts 只使用 `#datetime`、其 `Asia/Taipei` civil instant 與 Source A formal location。
2. **Source B — 裝置目前時間與時區**：採用裝置提供的 IANA 時區與當下 offset，僅供換算查詢。
3. **Source C — 自訂當地日期時間與時區**：可查歷史、未來或海外時間，依指定 IANA 時區處理日光節約時間，僅供換算查詢。

三個來源各自保存 formal、device query、custom query location snapshot。畫面可共用同一組座標欄位，但 DOM value 只是目前來源的輸入與顯示 carrier，不是跨來源 authority；切換來源時會載入各自 snapshot。B/C 的日期、時區、DST、座標、計算與定位不會改寫 `#datetime`、Source A formal location、formal `ChartTimeContext`、正式 Bazi／Flying／Jinhan／GuiDeng 或 picker authority。

三種來源都可輸入經緯度或按自動定位，以查看手錶時間、地方平太陽時、真太陽時與太陽事件。座標只決定地點，不會自動推導時區。座標、定位與計算都在瀏覽器本地進行，不呼叫外部 API，也不使用 localStorage。

自訂時區可搜尋 IANA 名稱、城市、國家或地區別名，例如輸入 `Tromsø`、`特羅姆瑟` 或 `挪威` 都可選到 `Europe/Oslo`；也可直接輸入完整 IANA 名稱，如 `Asia/Kathmandu`。別名只協助選擇正式時區，不會改變座標或推導地點。完整清單優先使用瀏覽器支援的 IANA 時區；舊環境使用有限內建 fallback。搜尋不會呼叫外部時區服務，別名亦不是完整全球城市資料庫。

### 十二時辰、有效日與農曆

精確排盤時間輸入本身始終是手錶／civil semantic。十二時辰按鈕則跟隨 active chart clock：手錶模式點申時代表手錶 15:00；真太陽模式點申時代表真太陽 15:00，系統會反解 actual instant，再轉成 `Asia/Taipei` civil time 寫回正式 `#datetime`。

真太陽模式的日柱與每日資訊使用 true-solar local clock 及 23:00 真太陽有效日；農曆則固定使用 CWA Taiwan 手錶／civil date。因此跨日時可以同時顯示真太陽有效日 `2026/04/16`，而農曆仍依手錶日期 `2026/04/15`，這是正常的時間語意差異。

CWA 農曆正式資料範圍為 `2022-01-01 ～ 2050-12-31`；範圍外不自行推算，也不 fallback 成猜測結果。

### Intentional limitations

- 奇門遁甲 1080 盤正式 UI／query 已存在，但真太陽模式下仍使用手錶時間／Asia-Taipei semantic；Qimen true-solar 仍是 Hard Stop。
- Source B/C 不支援 formal apply，僅供換算查詢。
- Source C 支援 IANA DST nonexistent 與 ambiguous earlier/later 處理；GuiDeng 在 DST transition date 仍明確 unsupported。
- 真太陽正式排盤缺少 Source A location 時維持 unavailable，不 fallback 成手錶盤。

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
