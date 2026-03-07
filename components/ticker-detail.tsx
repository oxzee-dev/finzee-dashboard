"use client"

import { TradingViewChart } from "./tradingview-chart"
import { TickerSidebar } from "./ticker-sidebar"
import { formatChange, formatLargeNumber } from "@/lib/api"
import type { TickerData } from "@/lib/api"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, ExternalLink, Clock } from "lucide-react"

interface TickerDetailProps {
  data: TickerData | null
  symbol: string
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

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Main Content - 2/3 */}
      <div className="flex-1 lg:w-2/3 space-y-4 overflow-auto">
        {/* Ticker Header */}
        <div className="bg-card border border-border rounded-md p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{data.main_info?.shortName || symbol}</h1>
                <span className="text-sm text-muted-foreground">{symbol}</span>
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
                  <TrendIcon className="h-4 w-4" />
                  {change.isPositive && "+"}{change.value}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TradingView Chart */}
        <TradingViewChart symbol={symbol} height={400} />

        {/* Price Performance */}
        <div className="bg-card border border-border rounded-md p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Price Performance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-secondary/50 rounded p-2">
              <span className="text-[10px] text-muted-foreground block">Open</span>
              <span className="text-sm font-medium text-foreground">
                {data.price_performance?.open?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "N/A"}
              </span>
            </div>
            <div className="bg-secondary/50 rounded p-2">
              <span className="text-[10px] text-muted-foreground block">Prev Close</span>
              <span className="text-sm font-medium text-foreground">
                {data.price_performance?.previousClose?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "N/A"}
              </span>
            </div>
            <div className="bg-secondary/50 rounded p-2">
              <span className="text-[10px] text-muted-foreground block">Day Low</span>
              <span className="text-sm font-medium text-foreground">
                {data.price_performance?.dayLow?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "N/A"}
              </span>
            </div>
            <div className="bg-secondary/50 rounded p-2">
              <span className="text-[10px] text-muted-foreground block">Day High</span>
              <span className="text-sm font-medium text-foreground">
                {data.price_performance?.dayHigh?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "N/A"}
              </span>
            </div>
            <div className="bg-secondary/50 rounded p-2">
              <span className="text-[10px] text-muted-foreground block">52W Low</span>
              <span className="text-sm font-medium text-foreground">
                {data.price_performance?.fiftyTwoWeekLow?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "N/A"}
              </span>
            </div>
            <div className="bg-secondary/50 rounded p-2">
              <span className="text-[10px] text-muted-foreground block">52W High</span>
              <span className="text-sm font-medium text-foreground">
                {data.price_performance?.fiftyTwoWeekHigh?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "N/A"}
              </span>
            </div>
            <div className="bg-secondary/50 rounded p-2">
              <span className="text-[10px] text-muted-foreground block">50 DMA</span>
              <span className="text-sm font-medium text-foreground">
                {data.price_performance?.fiftyDayAverage?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "N/A"}
              </span>
            </div>
            <div className="bg-secondary/50 rounded p-2">
              <span className="text-[10px] text-muted-foreground block">200 DMA</span>
              <span className="text-sm font-medium text-foreground">
                {data.price_performance?.twoHundredDayAverage?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "N/A"}
              </span>
            </div>
          </div>

          {/* 52-Week Range Bar */}
          {data.price_performance?.fiftyTwoWeekLow && data.price_performance?.fiftyTwoWeekHigh && (
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>{data.price_performance.fiftyTwoWeekLow.toFixed(2)}</span>
                <span>52-Week Range</span>
                <span>{data.price_performance.fiftyTwoWeekHigh.toFixed(2)}</span>
              </div>
              <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-terminal-red via-warning to-terminal-green"
                  style={{ width: "100%" }}
                />
                <div
                  className="absolute top-0 w-0.5 h-full bg-foreground"
                  style={{
                    left: `${Math.min(
                      100,
                      Math.max(
                        0,
                        ((data.main_info?.currentPrice || 0) - data.price_performance.fiftyTwoWeekLow) /
                          (data.price_performance.fiftyTwoWeekHigh - data.price_performance.fiftyTwoWeekLow) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Price Targets & Recommendations */}
        {(data.price_targets?.targetMeanPrice || data.price_targets?.recommendationKey) && (
          <div className="bg-card border border-border rounded-md p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Analyst Targets & Recommendations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="bg-secondary/50 rounded p-2">
                <span className="text-[10px] text-muted-foreground block">Low Target</span>
                <span className="text-sm font-medium text-terminal-red">
                  {data.price_targets?.targetLowPrice?.toFixed(2) || "N/A"}
                </span>
              </div>
              <div className="bg-secondary/50 rounded p-2">
                <span className="text-[10px] text-muted-foreground block">Mean Target</span>
                <span className="text-sm font-medium text-warning">
                  {data.price_targets?.targetMeanPrice?.toFixed(2) || "N/A"}
                </span>
              </div>
              <div className="bg-secondary/50 rounded p-2">
                <span className="text-[10px] text-muted-foreground block">High Target</span>
                <span className="text-sm font-medium text-terminal-green">
                  {data.price_targets?.targetHighPrice?.toFixed(2) || "N/A"}
                </span>
              </div>
              <div className="bg-secondary/50 rounded p-2">
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
              <div className="bg-secondary/50 rounded p-2">
                <span className="text-[10px] text-muted-foreground block">Analyst Count</span>
                <span className="text-sm font-medium text-foreground">
                  {data.price_targets?.numberOfAnalystOpinions || "N/A"}
                </span>
              </div>
            </div>

            {/* Target Range Bar */}
            {data.price_targets?.targetLowPrice && data.price_targets?.targetHighPrice && data.main_info?.currentPrice && (
              <div className="mt-4">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                  <span>Low: ${data.price_targets.targetLowPrice.toFixed(2)}</span>
                  <span>Price Target Range</span>
                  <span>High: ${data.price_targets.targetHighPrice.toFixed(2)}</span>
                </div>
                <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="absolute h-full bg-gradient-to-r from-terminal-red via-warning to-terminal-green w-full" />
                  {/* Current Price Marker */}
                  <div
                    className="absolute top-0 w-1 h-full bg-foreground rounded"
                    style={{
                      left: `${Math.min(
                        100,
                        Math.max(
                          0,
                          ((data.main_info.currentPrice - data.price_targets.targetLowPrice) /
                            (data.price_targets.targetHighPrice - data.price_targets.targetLowPrice)) *
                            100
                        )
                      )}%`,
                    }}
                    title={`Current: $${data.main_info.currentPrice.toFixed(2)}`}
                  />
                </div>
                <div className="text-center text-[10px] text-muted-foreground mt-1">
                  Current Price: ${data.main_info.currentPrice.toFixed(2)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent News */}
        {data.recent_news && data.recent_news.length > 0 && (
          <div className="bg-card border border-border rounded-md p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Recent News
            </h3>
            <div className="space-y-3">
              {data.recent_news.slice(0, 5).map((news, index) => (
                <div
                  key={index}
                  className="bg-secondary/30 rounded p-3 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground line-clamp-2">
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
                        className="text-primary hover:text-primary/80 transition-colors"
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
