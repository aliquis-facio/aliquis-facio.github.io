---
layout: post
comments: true
sitemap:

title: "[Economy] 주식 시장 동향"
excerpt: "Stock Market"

date: 2024-11-04
last_modified_at:

categories: [WEB]
tags: [WEB, PHP]
---

<!-- markdownlint-disable MD025 MD033 -->

<style>
  /* TradingView embed height fix */
  .tv-embed { height: 70vh; min-height: 520px; }
  .tv-embed .tradingview-widget-container,
  .tv-embed .tradingview-widget-container__widget,
  .tv-embed iframe {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }
</style>

# Stock Market

## 목록

---

## 공포 탐욕 지수 & 변동성

## 지수

### S&P 500 Heatmap

<div class="tv-embed" markdown="0">
  <div class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
    <script
      type="text/javascript"
      src="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
      async
    >
    {
      "dataSource": "SPX500",
      "grouping": "sector",
      "blockSize": "market_cap_basic",
      "blockColor": "change",
      "hasTopBar": false,
      "isZoomEnabled": true,
      "width": "100%",
      "height": "100%"
    }
    </script>
  </div>
</div>

### KOSPI 200 Heatmap

<!-- TradingView Stock Heatmap (KOSPI200) -->
<div class="tv-embed" markdown="0">
  <div class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
    <script
      type="text/javascript"
      src="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
      async
    >
    {
      "exchanges": [],
      "dataSource": "KOSPI200",
      "grouping": "sector",
      "blockSize": "market_cap_basic",
      "blockColor": "change",
      "locale": "kr",
      "symbolUrl": "",
      "colorTheme": "light",
      "hasTopBar": false,
      "isDataSetEnabled": false,
      "isZoomEnabled": true,
      "hasSymbolTooltip": true,
      "width": "100%",
      "height": "100%"
    }
    </script>
  </div>
</div>

### 코스닥

<div class="tv-embed" markdown="0">
  <div class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
    <script
      type="text/javascript"
      src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
      async
    >
    {
      "autosize": true,
      "symbol": "KRX:KOSDAQ",
      "interval": "D",
      "timezone": "Asia/Seoul",
      "locale": "kr",
      "theme": "light",
      "hide_top_toolbar": false,
      "save_image": false,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    }
    </script>
  </div>
</div>

## 원자재

### Gold (XAUUSD)

<div class="tv-embed" markdown="0">
  <div class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
    <script
      type="text/javascript"
      src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
      async
    >
    {
      "autosize": true,
      "symbol": "PEPPERSTONE:XAUUSD",
      "interval": "60",
      "timezone": "Asia/Seoul",
      "theme": "light",
      "style": "1",
      "hide_top_toolbar": false,
      "save_image": false,
      "calendar": false,
      "locale": "kr",
      "support_host": "https://www.tradingview.com"
    }
    </script>
  </div>
</div>

### 원자재/금속/농산물

<div class="tv-embed" markdown="0">
  <div class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
    <script type="text/javascript"
      src="https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"
      async>
    {
      "title": "원자재/금속/농산물",
      "width": "100%",
      "height": "100%",
      "locale": "kr",
      "showSymbolLogo": true,
      "colorTheme": "light",
      "symbolsGroups": [
        {
          "name": "원자재(에너지)",
          "symbols": [
            { "name": "NYMEX:CL1!", "displayName": "WTI 원유" },
            { "name": "ICEEUR:BRN1!", "displayName": "브렌트 원유" },
            { "name": "NYMEX:NG1!", "displayName": "천연가스" }
          ]
        },
        {
          "name": "금속",
          "symbols": [
            { "name": "COMEX:GC1!", "displayName": "금" },
            { "name": "COMEX:SI1!", "displayName": "은" },
            { "name": "COMEX:HG1!", "displayName": "구리" }
          ]
        },
        {
          "name": "농산물",
          "symbols": [
            { "name": "CBOT:ZC1!", "displayName": "옥수수" },
            { "name": "CBOT:ZW1!", "displayName": "밀" },
            { "name": "CBOT:ZS1!", "displayName": "대두" },
            { "name": "ICEUS:KC1!", "displayName": "커피" },
            { "name": "ICEUS:SB1!", "displayName": "설탕" }
          ]
        }
      ]
    }
    </script>
  </div>
</div>

## 환율

<div class="tv-embed" markdown="0">
  <div class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
    <script
      type="text/javascript"
      src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
      async>
    {
      "autosize": true,
      "symbol": "FX_IDC:USDKRW",
      "interval": "60",
      "timezone": "Asia/Seoul",
      "locale": "kr",
      "theme": "light",
      "hide_top_toolbar": false,
      "save_image": false,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    }
    </script>
  </div>
</div>

## 환율(한국/미국)

<div class="tv-embed" markdown="0">
  <div class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
    <script
      type="text/javascript"
      src="https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js"
      async>
    {
      "symbols": [["FX_IDC:USDKRW|1D"]],
      "locale": "kr",
      "colorTheme": "light",
      "autosize": true,
      "chartOnly": false,
      "showVolume": false
    }
    </script>
  </div>
</div>

통화 히트맵: <https://kr.investing.com/tools/currency-heatmap>

## 암호화폐

### 비트코인

<div class="tv-embed" markdown="0">
  <div class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
    <script
      type="text/javascript"
      src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
      async>
    {
      "autosize": true,
      "symbol": "PEPPERSTONE:XAUUSD",
      "interval": "60",
      "timezone": "Asia/Seoul",
      "locale": "kr",
      "theme": "light",
      "hide_top_toolbar": false,
      "save_image": false,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    }
    </script>
  </div>
</div>
