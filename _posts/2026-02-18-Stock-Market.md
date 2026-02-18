# Stock Market

## S&P 500 Heatmap

<div class="tradingview-widget-container" style="height: 600px; width: 100%;">
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

## KOSPI 200 Heatmap

<!-- TradingView Stock Heatmap (KOSPI200) -->
<div class="tradingview-widget-container" style="height: 600px; width: 100%;">
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
