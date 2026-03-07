"use client"

import { MarketCard } from "./market-card"
import { TradingViewChart } from "./tradingview-chart"
import type { TickerData } from "@/lib/api"

interface MarketOutlookProps {
  tickerData: Record<string, TickerData>
  onSelectTicker: (symbol: string) => void
}

const outlookTickers = [
  { symbol: "^GSPC", label: "S&P 500" },
  { symbol: "^IXIC", label: "NASDAQ" },
  { symbol: "^DJI", label: "Dow Jones" },
  { symbol: "^RUT", label: "Russell 2000" },
  { symbol: "DX-Y.NYB", label: "Dollar Index" },
  { symbol: "^VIX", label: "VIX" },
  { symbol: "^TNX", label: "10Y Treasury" },
]

export function MarketOutlook({ tickerData, onSelectTicker }: MarketOutlookProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Market Outlook</h1>
          <p className="text-xs text-muted-foreground">
            US Market Overview | {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 bg-terminal-green/20 text-terminal-green rounded">
            Market Open
          </span>
        </div>
      </div>

      {/* Market Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
        {outlookTickers.map((ticker) => (
          <MarketCard
            key={ticker.symbol}
            data={tickerData[ticker.symbol]}
            onClick={() => onSelectTicker(ticker.symbol)}
          />
        ))}
      </div>

      {/* Main S&P 500 Chart */}
      <div className="border border-border rounded-md bg-card overflow-hidden">
        <div className="px-3 py-2 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">S&P 500</span>
            <span className="text-xs text-muted-foreground">^GSPC</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            {tickerData["^GSPC"] && (
              <>
                <span className="text-foreground">
                  {tickerData["^GSPC"].main_info?.currentPrice?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <span className={
                  tickerData["^GSPC"].trading_info?.oneDayChange?.startsWith("-") 
                    ? "text-terminal-red" 
                    : "text-terminal-green"
                }>
                  {tickerData["^GSPC"].trading_info?.oneDayChange}
                </span>
              </>
            )}
          </div>
        </div>
        <TradingViewChart symbol="SPX" height={450} />
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Fear & Greed / VIX Section */}
        <div className="bg-card border border-border rounded-md p-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Volatility Index
          </h3>
          {tickerData["^VIX"] ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-foreground">
                  {tickerData["^VIX"].main_info?.currentPrice?.toFixed(2)}
                </span>
                <span className={
                  tickerData["^VIX"].trading_info?.oneDayChange?.startsWith("-")
                    ? "text-terminal-green text-sm"
                    : "text-terminal-red text-sm"
                }>
                  {tickerData["^VIX"].trading_info?.oneDayChange}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low Fear</span>
                  <span>High Fear</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-terminal-green via-warning to-terminal-red"
                    style={{
                      width: `${Math.min(100, (tickerData["^VIX"].main_info?.currentPrice || 0) / 50 * 100)}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-secondary rounded w-20" />
              <div className="h-2 bg-secondary rounded" />
            </div>
          )}
        </div>

        {/* Treasury Yields */}
        <div className="bg-card border border-border rounded-md p-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            10-Year Treasury
          </h3>
          {tickerData["^TNX"] ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-foreground">
                  {tickerData["^TNX"].main_info?.currentPrice?.toFixed(3)}%
                </span>
                <span className={
                  tickerData["^TNX"].trading_info?.oneDayChange?.startsWith("-")
                    ? "text-terminal-green text-sm"
                    : "text-terminal-red text-sm"
                }>
                  {tickerData["^TNX"].trading_info?.oneDayChange}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-secondary/50 rounded p-2">
                  <span className="text-muted-foreground">52W Low</span>
                  <div className="font-medium text-foreground">
                    {tickerData["^TNX"].price_performance?.fiftyTwoWeekLow?.toFixed(3)}%
                  </div>
                </div>
                <div className="bg-secondary/50 rounded p-2">
                  <span className="text-muted-foreground">52W High</span>
                  <div className="font-medium text-foreground">
                    {tickerData["^TNX"].price_performance?.fiftyTwoWeekHigh?.toFixed(3)}%
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-secondary rounded w-20" />
              <div className="h-12 bg-secondary rounded" />
            </div>
          )}
        </div>

        {/* Dollar Index */}
        <div className="bg-card border border-border rounded-md p-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Dollar Index
          </h3>
          {tickerData["DX-Y.NYB"] ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-foreground">
                  {tickerData["DX-Y.NYB"].main_info?.currentPrice?.toFixed(2)}
                </span>
                <span className={
                  tickerData["DX-Y.NYB"].trading_info?.oneDayChange?.startsWith("-")
                    ? "text-terminal-red text-sm"
                    : "text-terminal-green text-sm"
                }>
                  {tickerData["DX-Y.NYB"].trading_info?.oneDayChange}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-secondary/50 rounded p-2">
                  <span className="text-muted-foreground">50 DMA</span>
                  <div className="font-medium text-foreground">
                    {tickerData["DX-Y.NYB"].trading_info?.fiftyDayAverage?.toFixed(2)}
                  </div>
                </div>
                <div className="bg-secondary/50 rounded p-2">
                  <span className="text-muted-foreground">200 DMA</span>
                  <div className="font-medium text-foreground">
                    {tickerData["DX-Y.NYB"].trading_info?.twoHundredDayAverage?.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-secondary rounded w-20" />
              <div className="h-12 bg-secondary rounded" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
