"use client"

import { TradingViewChart } from "./tradingview-chart"
import { TickerSidebar } from "./ticker-sidebar"
import { formatChange, parsePercentage } from "@/lib/api"
import type { TickerData } from "@/lib/api"
import { cn } from "@/lib/utils"
import { 
  TrendingUp, TrendingDown, ExternalLink, Clock, 
  BarChart2, Target, Newspaper, Activity, ArrowUpRight, ArrowDownRight
} from "lucide-react"

interface TickerDetailProps {
  data: TickerData | null
  symbol: string
}

// Helper to calculate percentage change from current price
function calcPercentFromPrice(current: number | undefined, target: number | undefined): number | null {
  if (!current || !target) return null
  return ((current - target) / target) * 100
}

// Helper to calculate volume change percentage
function calcVolumeChange(currentVol: number | undefined, avgVol: number | undefined): number | null {
  if (!currentVol || !avgVol || avgVol === 0) return null
  return ((currentVol - avgVol) / avgVol) * 100
}

export function TickerDetail({ data, symbol }: TickerDetailProps) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Loading {symbol}...</p>
        </div>
      </div>
    )
  }

  const change = formatChange(data.trading_info?.oneDayChange || data.main_info?.oneDayChange)
  const TrendIcon = change.isPositive ? TrendingUp : TrendingDown
  const ArrowIcon = change.isPositive ? ArrowUpRight : ArrowDownRight

  // Calculate performance metrics
  const currentPrice = data.main_info?.currentPrice
  const low52w = data.price_performance?.fiftyTwoWeekLow
  const high52w = data.price_performance?.fiftyTwoWeekHigh
  const dma50 = data.price_performance?.fiftyDayAverage
  const dma200 = data.price_performance?.twoHundredDayAverage
  const beta = data.risk?.beta

  const pctFromLow52w = calcPercentFromPrice(currentPrice, low52w)
  const pctFromHigh52w = calcPercentFromPrice(currentPrice, high52w)
  const pctVs50DMA = calcPercentFromPrice(currentPrice, dma50)
  const pctVs200DMA = calcPercentFromPrice(currentPrice, dma200)
  const volumeChange = calcVolumeChange(data.trading_info?.volume, data.trading_info?.averageVolume10days)

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Main Content - 2/3 */}
      <div className="flex-1 lg:w-2/3 space-y-4 overflow-auto">
        {/* Ticker Header */}
        <div className="bg-card border border-border rounded-md p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <h1 className="text-xl font-bold text-foreground">{data.main_info?.shortName || symbol}</h1>
                <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded">{symbol}</span>
              </div>
              {(data.main_info?.sector || data.main_info?.industry) && (
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  {data.main_info?.sector && (
                    <span className="px-2 py-0.5 bg-secondary rounded">{data.main_info.sector}</span>
                  )}
                  {data.main_info?.industry && (
                    <span className="px-2 py-0.5 bg-secondary rounded">{data.main_info.industry}</span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">
                  {data.main_info?.currentPrice?.toLocaleString("en-US", { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                  <span className="text-sm text-muted-foreground ml-1">{data.main_info?.currency || "USD"}</span>
                </div>
                <div className={cn(
                  "flex items-center justify-end gap-1 text-sm font-medium",
                  change.isPositive ? "text-terminal-green" : "text-terminal-red"
                )}>
                  <ArrowIcon className="h-4 w-4" />
                  {change.isPositive && "+"}{change.value}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TradingView Chart */}
        <TradingViewChart symbol={symbol} height={400} />

        {/* Price Performance - 3 Grid Layout */}
        <div className="bg-card border border-border rounded-md p-4">
          <h3 className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            <BarChart2 className="h-3.5 w-3.5" />
            Price Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Grid 1: 52W Low/High */}
            <div className="space-y-2">
              <div className="bg-secondary/50 rounded p-3 hover:bg-secondary/70 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-muted-foreground">52W Low</span>
                  <span className="text-xs text-muted-foreground">${low52w?.toFixed(2) || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">% from Low</span>
                  <span className={cn(
                    "text-sm font-bold",
                    pctFromLow52w !== null && pctFromLow52w >= 0 ? "text-terminal-green" : "text-terminal-red"
                  )}>
                    {pctFromLow52w !== null ? `${pctFromLow52w >= 0 ? "+" : ""}${pctFromLow52w.toFixed(2)}%` : "N/A"}
                  </span>
                </div>
              </div>
              <div className="bg-secondary/50 rounded p-3 hover:bg-secondary/70 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-muted-foreground">52W High</span>
                  <span className="text-xs text-muted-foreground">${high52w?.toFixed(2) || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">% from High</span>
                  <span className={cn(
                    "text-sm font-bold",
                    pctFromHigh52w !== null && pctFromHigh52w >= 0 ? "text-terminal-green" : "text-terminal-red"
                  )}>
                    {pctFromHigh52w !== null ? `${pctFromHigh52w >= 0 ? "+" : ""}${pctFromHigh52w.toFixed(2)}%` : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Grid 2: DMA Comparisons */}
            <div className="space-y-2">
              <div className="bg-secondary/50 rounded p-3 hover:bg-secondary/70 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-muted-foreground">50 DMA</span>
                  <span className="text-xs text-muted-foreground">${dma50?.toFixed(2) || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">% vs 50 DMA</span>
                  <span className={cn(
                    "text-sm font-bold",
                    pctVs50DMA !== null && pctVs50DMA >= 0 ? "text-terminal-green" : "text-terminal-red"
                  )}>
                    {pctVs50DMA !== null ? `${pctVs50DMA >= 0 ? "+" : ""}${pctVs50DMA.toFixed(2)}%` : "N/A"}
                  </span>
                </div>
              </div>
              <div className="bg-secondary/50 rounded p-3 hover:bg-secondary/70 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-muted-foreground">200 DMA</span>
                  <span className="text-xs text-muted-foreground">${dma200?.toFixed(2) || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">% vs 200 DMA</span>
                  <span className={cn(
                    "text-sm font-bold",
                    pctVs200DMA !== null && pctVs200DMA >= 0 ? "text-terminal-green" : "text-terminal-red"
                  )}>
                    {pctVs200DMA !== null ? `${pctVs200DMA >= 0 ? "+" : ""}${pctVs200DMA.toFixed(2)}%` : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Grid 3: Beta & Volume */}
            <div className="space-y-2">
              <div className="bg-secondary/50 rounded p-3 hover:bg-secondary/70 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-muted-foreground">Market Sensitivity</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Beta</span>
                  <span className={cn(
                    "text-sm font-bold",
                    beta !== null && beta !== undefined
                      ? beta > 1.5 ? "text-warning" : beta < 0.8 ? "text-terminal-green" : "text-foreground"
                      : "text-muted-foreground"
                  )}>
                    {beta?.toFixed(2) || "N/A"}
                  </span>
                </div>
              </div>
              <div className="bg-secondary/50 rounded p-3 hover:bg-secondary/70 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-muted-foreground">vs 10D Avg Vol</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Vol Change</span>
                  <span className={cn(
                    "text-sm font-bold",
                    volumeChange !== null 
                      ? Math.abs(volumeChange) > 50 
                        ? "text-warning" 
                        : volumeChange >= 0 
                          ? "text-terminal-green" 
                          : "text-terminal-red"
                      : "text-muted-foreground"
                  )}>
                    {volumeChange !== null ? `${volumeChange >= 0 ? "+" : ""}${volumeChange.toFixed(1)}%` : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 52-Week Range Bar */}
          {low52w && high52w && (
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>{low52w.toFixed(2)}</span>
                <span>52-Week Range</span>
                <span>{high52w.toFixed(2)}</span>
              </div>
              <div className="relative h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-terminal-red/60 via-warning/60 to-terminal-green/60"
                  style={{ width: "100%" }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-foreground rounded-full border border-background shadow-sm"
                  style={{
                    left: `${Math.min(
                      100,
                      Math.max(
                        0,
                        ((currentPrice || 0) - low52w) /
                          (high52w - low52w) *
                          100
                      )
                    )}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Price Targets & Recommendations - Recommendation Last */}
        {(data.price_targets?.targetMeanPrice || data.price_targets?.recommendationKey) && (
          <div className="bg-card border border-border rounded-md p-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              <Target className="h-3.5 w-3.5" />
              Analyst Targets
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-secondary/50 rounded p-2 hover:bg-secondary/70 transition-colors">
                <span className="text-[10px] text-muted-foreground block">Low Target</span>
                <span className="text-sm font-medium text-terminal-red">
                  {data.price_targets?.targetLowPrice?.toFixed(2) || "N/A"}
                </span>
              </div>
              <div className="bg-secondary/50 rounded p-2 hover:bg-secondary/70 transition-colors">
                <span className="text-[10px] text-muted-foreground block">Mean Target</span>
                <span className="text-sm font-medium text-warning">
                  {data.price_targets?.targetMeanPrice?.toFixed(2) || "N/A"}
                </span>
              </div>
              <div className="bg-secondary/50 rounded p-2 hover:bg-secondary/70 transition-colors">
                <span className="text-[10px] text-muted-foreground block">High Target</span>
                <span className="text-sm font-medium text-terminal-green">
                  {data.price_targets?.targetHighPrice?.toFixed(2) || "N/A"}
                </span>
              </div>
              <div className="bg-secondary/50 rounded p-2 hover:bg-secondary/70 transition-colors">
                <span className="text-[10px] text-muted-foreground block">Analyst Count</span>
                <span className="text-sm font-medium text-foreground">
                  {data.price_targets?.numberOfAnalystOpinions || "N/A"}
                </span>
              </div>
              <div className="bg-secondary/50 rounded p-2 hover:bg-secondary/70 transition-colors">
                <span className="text-[10px] text-muted-foreground block">Recommendation</span>
                <span className={cn(
                  "text-sm font-medium uppercase",
                  data.price_targets?.recommendationKey === "buy" || data.price_targets?.recommendationKey === "strong_buy"
                    ? "text-terminal-green"
                    : data.price_targets?.recommendationKey === "sell" || data.price_targets?.recommendationKey === "strong_sell"
                    ? "text-terminal-red"
                    : "text-warning"
                )}>
                  {data.price_targets?.recommendationKey?.replace("_", " ") || "N/A"}
                </span>
              </div>
            </div>

            {/* Target Range Bar */}
            {data.price_targets?.targetLowPrice && data.price_targets?.targetHighPrice && currentPrice && (
              <div className="mt-4">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                  <span>Low: ${data.price_targets.targetLowPrice.toFixed(2)}</span>
                  <span>Price Target Range</span>
                  <span>High: ${data.price_targets.targetHighPrice.toFixed(2)}</span>
                </div>
                <div className="relative h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                  <div className="absolute h-full bg-gradient-to-r from-terminal-red/60 via-warning/60 to-terminal-green/60 w-full" />
                  {/* Current Price Marker */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-foreground rounded-full border border-background shadow-sm"
                    style={{
                      left: `${Math.min(
                        100,
                        Math.max(
                          0,
                          ((currentPrice - data.price_targets.targetLowPrice) /
                            (data.price_targets.targetHighPrice - data.price_targets.targetLowPrice)) *
                            100
                        )
                      )}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    title={`Current: $${currentPrice.toFixed(2)}`}
                  />
                </div>
                <div className="text-center text-[10px] text-muted-foreground mt-1">
                  Current Price: ${currentPrice.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent News */}
        {data.recent_news && data.recent_news.length > 0 && (
          <div className="bg-card border border-border rounded-md p-4">
            <h3 className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              <Newspaper className="h-3.5 w-3.5" />
              Recent News
            </h3>
            <div className="space-y-3">
              {data.recent_news.slice(0, 5).map((news, index) => (
                <div
                  key={index}
                  className="bg-secondary/30 rounded p-3 hover:bg-secondary/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {news.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {news.summary}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                        <span>{news.provider}</span>
                        <span>|</span>
                        <Clock className="h-3 w-3" />
                        <span>{new Date(news.pubDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {news.source_url && (
                      <a
                        href={news.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - 1/3 */}
      <div className="lg:w-1/3">
        <TickerSidebar data={data} />
      </div>
    </div>
  )
}
