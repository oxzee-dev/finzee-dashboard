"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatChange } from "@/lib/api"
import type { TickerData } from "@/lib/api"

interface SidebarSectionProps {
  id: string
  name: string
  tickers: { symbol: string; name: string }[]
  tickerData: Record<string, TickerData>
  defaultExpanded?: boolean
  selectedTicker: string | null
  onSelectTicker: (symbol: string) => void
}

export function SidebarSection({
  id,
  name,
  tickers,
  tickerData,
  defaultExpanded = false,
  selectedTicker,
  onSelectTicker,
}: SidebarSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-secondary/50 transition-colors"
      >
        <span>{name}</span>
        {isExpanded ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </button>
      
      {isExpanded && (
        <div className="pb-1">
          {tickers.map((ticker) => {
            const data = tickerData[ticker.symbol]
            const change = data ? formatChange(data.trading_info?.oneDayChange || data.main_info?.oneDayChange) : null
            const price = data?.main_info?.currentPrice
            
            return (
              <button
                key={ticker.symbol}
                onClick={() => onSelectTicker(ticker.symbol)}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-1.5 text-xs hover:bg-secondary/50 transition-colors",
                  selectedTicker === ticker.symbol && "bg-secondary"
                )}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium text-foreground">{ticker.symbol}</span>
                  <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                    {ticker.name}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  {price !== undefined && (
                    <span className="font-medium text-foreground">
                      {price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                  {change && (
                    <span
                      className={cn(
                        "text-[10px] font-medium",
                        change.isPositive ? "text-terminal-green" : "text-terminal-red"
                      )}
                    >
                      {change.isPositive && "+"}{change.value}
                    </span>
                  )}
                  {!data && (
                    <span className="text-[10px] text-muted-foreground">Loading...</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
