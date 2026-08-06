# Third-party data notices

The repository's code is licensed under the [MIT License](LICENSE). The CWA-derived data described below is **not** relicensed as MIT; it remains subject to the separately stated Government Data Open License, version 1.0, including its attribution condition.

## Central Weather Administration calendar data

- Data provider: 交通部中央氣象署 (Central Weather Administration, CWA)
- Dataset: 日曆資料
- Dataset ID: `157677`
- Resource: `A-A0087-001` 國農曆日期對照
- Source URL: https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/A-A0087-001?Authorization=rdec-key-123-45678-011121314&format=CSV
- Retrieved: 2026-08-03T05:39:11.801Z
- Source format and SHA-256: UTF-8 CSV, `1977895ede93d8cac33355fa5d51cd021f384c1298e46c075b81d8be99d576be`
- Source coverage: 2022-01-01 through 2050-12-31, 10,592 daily rows
- Transformation: `scripts/build-cwa-lunar-calendar-data.js` normalizes the official daily table into lunar month starts plus two directly observed boundary segments. It does not calculate, infer, or add dates outside the source range.
- Derived files: `data/cwa_lunar_month_starts_2022_2050.json`, `data/cwa_lunar_calendar_manifest_2022_2050.json`, and `data/cwa_lunar_calendar_validation_2022_2050.json`

The source dataset identifies its license as **政府資料開放授權條款－第 1 版**. The official CWA rules and the official license both require explicit attribution for the source and derived works.

Official attribution statement, completed with this dataset's identifying name:

> 交通部中央氣象署 2026 日曆資料（資料集 ID 157677；資源 A-A0087-001 國農曆日期對照）
>
> 此開放資料依政府資料開放授權條款 (Open Government Data License) 進行公眾釋出，使用者於遵守本條款各項規定之前提下，得利用之。
>
> 政府資料開放授權條款：https://data.gov.tw/license

This attribution is based on the official 「附件：顯名聲明」 template, not an endorsement. The CWA does not recommend, approve, or endorse this project. The source data and this derived snapshot may change when CWA updates the official resource.

Official references:

- CWA rules: https://opendata.cwa.gov.tw/about/rules
- Dataset record: https://data.gov.tw/dataset/157677
- Government Data Open License, version 1.0: https://data.gov.tw/license

## True solar time calculation references

`src/trueSolarTime.js` independently implements a general-purpose Equation of Time calculation from NOAA Solar Calculator / Meeus-style solar geometry. It uses no downloaded third-party data, makes no external API calls, and does not infer true solar time from sunrise or sunset.

- NOAA, General Solar Position Calculations: https://gml.noaa.gov/grad/solcalc/solareqns.PDF
- NOAA Solar Calculation Details: https://gml.noaa.gov/grad/solcalc/

This first core-calculation package is not yet connected to SunCalc, 登貴, existing charting formulas, or any UI.
