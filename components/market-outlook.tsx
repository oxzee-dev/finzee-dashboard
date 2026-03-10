"use client"

import { MarketCard } from "./market-card"
import { TradingViewChart } from "./tradingview-chart"
import type { TickerData } from "@/lib/api"
import { Clock, ExternalLink } from "lucide-react"

interface MarketOutlookProps {
  tickerData: Record<string, TickerData>
  onSelectTicker: (symbol: string) => void
}

const outlookTickers = [
  { symbol: "^GSPC", label: "S&P 500" },
  { symbol: "^IXIC", label: "NASDAQ" },
  { symbol: "^DJI", label: "Dow Jones" },
  { symbol: "^RUT", label: "Russell 2000" },
  { symbol: "BTC-USD", label: "Bitcoin" },
  { symbol: "GC=F", label: "Gold" },
]

export function MarketOutlook({ tickerData, onSelectTicker }: MarketOutlookProps) {
  // Collect news from S&P and NASDAQ
  const spNews = tickerData["^GSPC"]?.recent_news || []
  const nasdaqNews = tickerData["^IXIC"]?.recent_news || []
  
  // Combine and dedupe news, take first 7
  const allNewsMap = new Map<string, typeof spNews[0]>()
  ;[...spNews, ...nasdaqNews].forEach(news => {
    if (!allNewsMap.has(news.title)) {
      allNewsMap.set(news.title, news)
    }
  })
  const combinedNews = Array.from(allNewsMap.values()).slice(0, 7)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Market Outlook</h1>
          <p className="text-xs text-muted-foreground">
            US Market Overview
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-1 bg-terminal-green/20 text-terminal-green rounded">
            Market Open
          </span>
        </div>
      </div>

      {/* Main Grid: Market Cards (left) + News (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Market Cards (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Market Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
            <TradingViewChart symbol="SPY" height={380} />
          </div>
        </div>

        {/* Right Column - News Grid (1/3 width) */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-md h-full flex flex-col">
            <div className="px-3 py-2 border-b border-border">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Market News
              </h3>
            </div>
            <div className="flex-1 overflow-auto max-h-[520px] p-2">
              <div className="space-y-2">
                {combinedNews.length > 0 ? (
                  combinedNews.map((news, index) => (
                    <div
                      key={index}
                      className="bg-secondary/30 rounded p-2.5 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-medium text-foreground line-clamp-2 leading-tight">
                            {news.title}
                          </h4>
                          <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-tight">
                            {news.summary}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5 text-[9px] text-muted-foreground">
                            <span className="font-medium">{news.provider}</span>
                            <span>|</span>
                            <Clock className="h-2.5 w-2.5" />
                            <span>{new Date(news.pubDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {news.source_url && (
                          <a
                            href={news.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-pulse space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-secondary rounded" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
