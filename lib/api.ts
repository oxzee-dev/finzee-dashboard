// Types for Financial API Data
export interface TickerData {
  ticker: string
  shortName: string
  timestamp: number
  main_info: {
    symbol: string
    shortName: string
    sector: string | null
    industry: string | null
    currency: string
    currentPrice: number
    oneDayChange: string
    fiftyTwoWeekChange: string
    marketCap: number | null
    PS: number | null
    PE: number | null
    forwardPE: number | null
    recommendation: string | null
    PT_Low: number | null
    PT_High: number | null
  }
  company_info: {
    website: string | null
    address1: string | null
    city: string | null
    state: string | null
    zip: string | null
    country: string | null
    phone: string | null
    sector: string | null
    industry: string | null
    industryKey: string | null
    sectorKey: string | null
    fullTimeEmployees: number | null
  }
  valuation: {
    marketCap: number | null
    enterpriseValue: number | null
    priceToBook: number | null
    priceToSalesTrailing12Months: number | null
    enterpriseToRevenue: number | null
    enterpriseToEbitda: number | null
    bookValue: number | null
    sharesOutstanding: number | null
    floatShares: number | null
    impliedSharesOutstanding: number | null
  }
  ratios: {
    trailingPE: number | null
    forwardPE: number | null
    pegRatio: number | null
    priceToBook: number | null
    priceToSalesTrailing12Months: number | null
    profitMargins: number | null
    operatingMargins: number | null
    returnOnAssets: number | null
    returnOnEquity: number | null
    currentRatio: number | null
    quickRatio: number | null
    debtToEquity: number | null
  }
  returns: {
    returnOnAssets: number | null
    returnOnEquity: number | null
    profitMargins: number | null
    operatingMargins: number | null
    grossMargins: number | null
    ebitdaMargins: number | null
  }
  growth: {
    revenueGrowth: number | null
    earningsGrowth: number | null
    earningsQuarterlyGrowth: number | null
    revenuePerShare: number | null
    totalRevenue: number | null
    earningsPerShare: number | null
    forwardEps: number | null
    bookValue: number | null
    priceToBook: number | null
    enterpriseValue: number | null
    pegRatio: number | null
    trailingPegRatio: number | null
  }
  price_performance: {
    currentPrice: number
    previousClose: number
    open: number
    dayLow: number
    dayHigh: number
    regularMarketPreviousClose: number
    fiftyTwoWeekLow: number
    fiftyTwoWeekHigh: number
    fiftyDayAverage: number
    twoHundredDayAverage: number
    "52WeekChange": string
    SandP52WeekChange: number | null
  }
  risk: {
    beta: number | null
    beta3Year: number | null
    overallRisk: number | null
    auditRisk: number | null
    boardRisk: number | null
    compensationRisk: number | null
    shareHolderRightsRisk: number | null
  }
  debt: {
    totalDebt: number | null
    totalCash: number | null
    totalCashPerShare: number | null
    debtToEquity: number | null
    currentRatio: number | null
    quickRatio: number | null
    freeCashflow: number | null
    operatingCashflow: number | null
  }
  trading_info: {
    volume: number
    regularMarketVolume: number
    averageVolume: number
    averageVolume10days: number
    averageDailyVolume10Day: number
    bid: number
    ask: number
    bidSize: number
    askSize: number
    fiftyDayAverage: number
    twoHundredDayAverage: number
    change_from_50DMA: string
    change_from_200DMA: string
    oneDayChange: string
  }
  price_targets: {
    targetHighPrice: number | null
    targetLowPrice: number | null
    targetMeanPrice: number | null
    targetMedianPrice: number | null
    recommendationMean: number | null
    recommendationKey: string | null
    numberOfAnalystOpinions: number | null
  }
  dividends: {
    dividendRate: number | null
    dividendYield: number | null
    exDividendDate: number | null
    payoutRatio: number | null
    fiveYearAvgDividendYield: number | null
    trailingAnnualDividendRate: number | null
    trailingAnnualDividendYield: number | null
  }
  earnings: {
    trailingEps: number | null
    forwardEps: number | null
    mostRecentQuarter: number | null
    netIncomeToCommon: number | null
    trailingPegRatio: number | null
  }
  company_business: {
    logo_url: string | null
    shortName: string
    longBusinessSummary: string | null
    sector: string | null
    industry: string | null
    website: string | null
  }
  recent_news: Array<{
    title: string
    summary: string
    pubDate: string
    provider: string
    source_url: string | null
  }>
}

const API_BASE = "https://mini-finapi.vercel.app/api/ticker"

export async function fetchTickers(tickers: string[]): Promise<TickerData[]> {
  const tickerString = tickers.join(",")
  const response = await fetch(`${API_BASE}?ticker=${tickerString}`)
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  
  const data = await response.json()
  
  // API returns single object for single ticker, array for multiple
  if (Array.isArray(data)) {
    return data
  }
  return [data]
}

export async function fetchTicker(ticker: string): Promise<TickerData> {
  const response = await fetch(`${API_BASE}?ticker=${ticker}`)
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  
  return response.json()
}

// Helper to format price
export function formatPrice(price: number | null): string {
  if (price === null) return "N/A"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

// Helper to format large numbers
export function formatLargeNumber(num: number | null): string {
  if (num === null) return "N/A"
  if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`
  return num.toFixed(2)
}

// Helper to format percentage change
export function formatChange(change: string | null): { value: string; isPositive: boolean } {
  if (!change) return { value: "N/A", isPositive: false }
  const cleanChange = change.replace(/\s/g, "")
  const isPositive = !cleanChange.startsWith("-")
  return { value: cleanChange, isPositive }
}

// Helper to parse percentage string to number
export function parsePercentage(value: string | null): number | null {
  if (!value) return null
  const cleaned = value.replace(/[%\s]/g, "")
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}
