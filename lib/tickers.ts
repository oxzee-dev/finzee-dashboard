// Section definitions with tickers
export interface Section {
  id: string
  name: string
  tickers: { symbol: string; name: string }[]
}

export const sections: Section[] = [
  {
    id: "market-outlook",
    name: "Market Outlook",
    tickers: [
      { symbol: "^GSPC", name: "S&P 500" },
      { symbol: "^IXIC", name: "NASDAQ" },
      { symbol: "^DJI", name: "Dow Jones" },
      { symbol: "^RUT", name: "Russell 2000" },
      { symbol: "DX-Y.NYB", name: "Dollar Index" },
      { symbol: "^VIX", name: "VIX" },
      { symbol: "^TNX", name: "10Y Treasury" },
    ],
  },
  {
    id: "us-indices",
    name: "US Indices",
    tickers: [
      { symbol: "^GSPC", name: "S&P 500" },
      { symbol: "^IXIC", name: "NASDAQ" },
      { symbol: "^DJI", name: "Dow Jones" },
      { symbol: "^RUT", name: "Russell 2000" },
      { symbol: "^NYA", name: "NYSE Composite" },
      { symbol: "^GSPTSE", name: "S&P/TSX" },
      { symbol: "^MID", name: "S&P MidCap 400" },
    ],
  },
  {
    id: "world-indices",
    name: "World Indices",
    tickers: [
      { symbol: "^FTSE", name: "FTSE 100" },
      { symbol: "^GDAXI", name: "DAX" },
      { symbol: "^FCHI", name: "CAC 40" },
      { symbol: "^N225", name: "Nikkei 225" },
      { symbol: "^HSI", name: "Hang Seng" },
      { symbol: "000001.SS", name: "Shanghai" },
      { symbol: "^STOXX50E", name: "Euro Stoxx 50" },
      { symbol: "^AXJO", name: "ASX 200" },
    ],
  },
  {
    id: "sp-sectors",
    name: "S&P Sectors Perf",
    tickers: [
      { symbol: "XLK", name: "Technology" },
      { symbol: "XLF", name: "Financials" },
      { symbol: "XLV", name: "Healthcare" },
      { symbol: "XLE", name: "Energy" },
      { symbol: "XLI", name: "Industrials" },
      { symbol: "XLY", name: "Consumer Disc." },
      { symbol: "XLP", name: "Consumer Staples" },
      { symbol: "XLU", name: "Utilities" },
      { symbol: "XLRE", name: "Real Estate" },
      { symbol: "XLB", name: "Materials" },
      { symbol: "XLC", name: "Communication" },
    ],
  },
  {
    id: "global-assets",
    name: "Global Assets",
    tickers: [
      { symbol: "GC=F", name: "Gold" },
      { symbol: "SI=F", name: "Silver" },
      { symbol: "CL=F", name: "Crude Oil" },
      { symbol: "NG=F", name: "Natural Gas" },
      { symbol: "HG=F", name: "Copper" },
      { symbol: "PL=F", name: "Platinum" },
      { symbol: "ZW=F", name: "Wheat" },
      { symbol: "ZC=F", name: "Corn" },
    ],
  },
  {
    id: "bonds",
    name: "Bonds",
    tickers: [
      { symbol: "^TNX", name: "10Y Treasury" },
      { symbol: "^TYX", name: "30Y Treasury" },
      { symbol: "^FVX", name: "5Y Treasury" },
      { symbol: "^IRX", name: "13W Treasury" },
      { symbol: "TLT", name: "20+ Year Treasury" },
      { symbol: "IEF", name: "7-10 Year Treasury" },
      { symbol: "SHY", name: "1-3 Year Treasury" },
    ],
  },
  {
    id: "crypto",
    name: "Crypto",
    tickers: [
      { symbol: "BTC-USD", name: "Bitcoin" },
      { symbol: "ETH-USD", name: "Ethereum" },
      { symbol: "BNB-USD", name: "BNB" },
      { symbol: "SOL-USD", name: "Solana" },
      { symbol: "XRP-USD", name: "XRP" },
      { symbol: "ADA-USD", name: "Cardano" },
      { symbol: "DOGE-USD", name: "Dogecoin" },
      { symbol: "AVAX-USD", name: "Avalanche" },
    ],
  },
  {
    id: "etf",
    name: "ETF",
    tickers: [
      { symbol: "SPY", name: "SPDR S&P 500" },
      { symbol: "QQQ", name: "Invesco QQQ" },
      { symbol: "IWM", name: "iShares Russell" },
      { symbol: "VTI", name: "Vanguard Total" },
      { symbol: "ARKK", name: "ARK Innovation" },
      { symbol: "XLF", name: "Financial Select" },
      { symbol: "GLD", name: "SPDR Gold" },
      { symbol: "VWO", name: "Vanguard EM" },
      { symbol: "EFA", name: "iShares EAFE" },
      { symbol: "DIA", name: "SPDR Dow Jones" },
    ],
  },
]

// Market outlook tickers for main cards
export const marketOutlookTickers = [
  "^GSPC",
  "^IXIC", 
  "^DJI",
  "^RUT",
  "DX-Y.NYB",
  "^VIX",
  "^TNX",
]
