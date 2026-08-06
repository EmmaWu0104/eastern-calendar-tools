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

The Equation of Time core remains separate from SunCalc and charting formulas.

## Shared solar events

`src/solarEvents.js` uses the NOAA/Meeus-style solar geometry used by the true-solar-time core for sunrise, solar noon, and sunset. Sunrise/sunset use NOAA's 90.833° zenith (standard refraction plus solar radius); solar noon is the apparent solar noon. 登貴 and the true-solar-time panel share this helper. UI shows truncated `HH:mm`, while 登貴 keeps the underlying second-level Date values. When the user explicitly applies true solar time, the charting views and 登貴 share the selected coordinate; otherwise 登貴 uses its default location.

Browser Geolocation is requested only after the user presses the location button. Coordinates are not stored in localStorage or sent to an external service. The vendored SunCalc remains in the repository for other functionality, but is not the formal sunrise/sunset source.

## Time-zone data

The device and custom true-solar-time query modes use the browser's built-in `Intl.DateTimeFormat` implementation and its bundled IANA time-zone data. No external time-zone API is called, and Temporal is not a required runtime dependency. Custom IANA zones are resolved for the requested local date so that applicable daylight-saving offsets, nonexistent local times, and ambiguous repeated local times can be handled explicitly.

The available rules depend on the browser and operating system's included IANA data. Future government policy changes are therefore not guaranteed to appear immediately. Coordinates do not infer a time zone; the selected device or custom IANA zone remains the source of the clock offset.

The time-zone picker uses `Intl.supportedValuesOf("timeZone")` when it is available, with a limited project-maintained fallback for older environments. Its Chinese and city-name aliases are project-authored UI assistance data, not a third-party city database; they only select an IANA zone and never infer or modify latitude/longitude.
