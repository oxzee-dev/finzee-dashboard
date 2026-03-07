"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatChange } from "@/lib/api"
import type { TickerData } from "@/lib/api"

interface MarketCardProps {
  data: TickerData | null
  onClick?: () => void
}

export function MarketCard({ data, onClick }: MarketCardProps) {
  if (!data) {
    return (
      <div className="bg-card border border-border rounded-md p-3 animate-pulse">
        <div className="h-4 bg-secondary rounded w-20 mb-2" />
        <div className="h-6 bg-secondary rounded w-24 mb-1" />
        <div className="h-3 bg-secondary rounded w-16" />
      </div>
    )
  }

  const change = formatChange(data.trading_info?.oneDayChange || data.main_info?.oneDayChange)
  const price = data.main_info?.currentPrice
  const changeNum = parseFloat(change.value.replace("%", ""))
  
  const TrendIcon = changeNum > 0 ? TrendingUp : changeNum < 0 ? TrendingDown : Minus

  return (
    <button
      onClick={onClick}
      className="bg-card border border-border rounded-md p-3 text-left hover:bg-secondary/30 transition-colors w-full"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {data.main_info?.shortName || data.ticker}
        </span>
        <TrendIcon
          className={cn(
            "h-3 w-3",
            change.isPositive ? "text-terminal-green" : "text-terminal-red"
          )}
        />
      </div>
      <div className="text-lg font-bold text-foreground">
        {price?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "N/A"}
      </div>
      <div
        className={cn(
          "text-xs font-medium",
          change.isPositive ? "text-terminal-green" : "text-terminal-red"
        )}
      >
        {change.isPositive && "+"}{change.value}
      </div>
      
      {/* Mini progress bar showing position in 52-week range */}
      {data.price_performance?.fiftyTwoWeekLow && data.price_performance?.fiftyTwoWeekHigh && price && (
        <div className="mt-2">
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full",
                change.isPositive ? "bg-terminal-green" : "bg-terminal-red"
              )}
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    ((price - data.price_performance.fiftyTwoWeekLow) /
                      (data.price_performance.fiftyTwoWeekHigh - data.price_performance.fiftyTwoWeekLow)) *
                      100
                  )
                )}%`,
              }}
            />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-[8px] text-muted-foreground">52W L</span>
            <span className="text-[8px] text-muted-foreground">52W H</span>
          </div>
        </div>
      )}
    </button>
  )
}
