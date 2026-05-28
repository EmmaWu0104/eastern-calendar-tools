# 測試說明

第一版產品邏輯使用使用者輸入的瀏覽器本機手錶時間。`datetime-local` 輸入不含時區資訊，核心會以瀏覽器或 Node 執行環境的本機時區解析。

目前測試案例是以 Asia/Taipei 本機時間建立，主要用來驗證台灣常用干支曆情境與節氣交界。`tests/run-tests.js` 會將 Node 測試基準強制固定為 Asia/Taipei，不受外部 `TZ` 環境變數影響，讓 `npm test` 在不同系統時區下穩定執行。

節氣資料保留 UTC / Asia-Taipei 欄位；第一版輸入時間不固定為 UTC+8，也不套用真太陽時。若未來要驗證海外使用者情境，應新增獨立的 timezone 測試案例。

`tests/testcases.json` 可包含 `status: "pending-verification"` 的案例。這類案例保留給人工比對權威萬年曆，不納入目前 pass/fail。
