Build a beautiful financial market dashboard web app (single HTML file or React or VueJS) 
that collects and displays real-time/latest global financial market data 
when the user clicks a "Collect Data" button.

## Core Features

### Data Collection (triggered on button click)
Fetch latest available data for:

1. **Global Economy & Finance**
   - Major stock indices: S&P 500, Dow Jones, NASDAQ, Nikkei 225, 
     Hang Seng, FTSE 100, DAX, VN-Index
   - Major forex pairs: USD/VND, USD/JPY, EUR/USD, GBP/USD, USD/CNY

2. **Crypto Market**
   - Top 10 coins by market cap (price, 24h change, market cap, volume)
   - Total crypto market cap
   - Bitcoin dominance %
   - Fear & Greed Index

3. **Gold Market**
   - Gold spot price (XAU/USD)
   - Gold price in VND (SJC reference)
   - 24h change, weekly change

4. **Oil Market**
   - Brent Crude price
   - WTI Crude price
   - 24h change

5. **Data timestamp** — show exactly when data was last fetched

---

## Data Sources (use free public APIs, no API key required)

- **Crypto**: CoinGecko public API
  `https://api.coingecko.com/api/v3/`
  - `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10`
  - `/global` for market cap, BTC dominance
  - `/simple/price?ids=bitcoin&vs_currencies=usd` 

- **Gold & Forex**: 
  `https://api.frankfurter.dev/latest` for forex rates
  Use CoinGecko for XAU: `/simple/price?ids=gold&vs_currencies=usd,vnd`

- **Stocks**: 
  Use `https://query1.finance.yahoo.com/v8/finance/chart/{symbol}` 
  for symbols like `^GSPC`, `^DJI`, `^IXIC`, `^N225`, `^HSI`, 
  `^FTSE`, `^GDAXI`, `VNINDEX.VN`
  — fetch with `interval=1d&range=5d`

- **Fear & Greed**: `https://api.alternative.me/fng/`

- **Oil**: Yahoo Finance symbols `CL=F` (WTI) and `BZ=F` (Brent)

---

## UI/UX Requirements

- **Dark theme** — deep dark background (#0d0d0d or similar), 
  neon accent colors (green for up, red for down, gold for gold section)
- **Clean card grid layout** — each market category in its own card section
- **One big "🔄 Collect Data" button** at the top — glowing, prominent
- Show a **loading spinner / skeleton** while fetching
- Show **last updated timestamp** after fetch
- **Toggle**: "Today's snapshot" vs "Weekly overview" 
  (weekly = show 7d change % alongside 24h change)
- Color-coded changes: green = positive, red = negative, grey = neutral
- Responsive — works on both desktop and mobile
- No login, no backend, no database — pure frontend, stateless

---

## Tech Stack
- Plain HTML + CSS + Vanilla JS (single file preferred), OR React if cleaner
- No paid APIs, no API keys
- All fetch calls client-side with proper CORS handling
- Handle API errors gracefully — show "N/A" if a source fails, 
  don't crash the whole dashboard

---

## Nice to Have (if time allows)
- Mini sparkline chart for BTC price (last 7 days) using Chart.js
- Auto-refresh toggle (every 5 minutes)
- Export snapshot as PNG or JSON

---

Build this as a single deployable file. 
Make it look premium, like a Bloomberg terminal but chill.