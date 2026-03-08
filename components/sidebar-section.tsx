"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatChange, fetchTickers, type TickerData } from "@/lib/api"

interface SidebarSectionProps {
  id: string
  name: string
  icon?: React.ReactNode
  tickers: { symbol: string; name: string }[]
  preloadedData?: Record<string, TickerData>
  defaultExpanded?: boolean
  selectedTicker: string | null
  onSelectTicker: (symbol: string) => void
}

// Fetcher for SWR
const fetcher = async (tickers: string[]): Promise<Record<string, TickerData>> => {
  const data = await fetchTickers(tickers)
  return data.reduce((acc, item) => {
    acc[item.ticker] = item
    return acc
  }, {} as Record<string, TickerData>)
}

export function SidebarSection({
  id,
  name,
  icon,
  tickers,
  preloadedData,
  defaultExpanded = false,
  selectedTicker,
  onSelectTicker,
}: SidebarSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [shouldFetch, setShouldFetch] = useState(defaultExpanded)

  // Lazy load data when section is expanded
  useEffect(() => {
    if (isExpanded && !shouldFetch) {
      setShouldFetch(true)
    }
  }, [isExpanded, shouldFetch])

  const tickerSymbols = tickers.map(t => t.symbol)
  
  // Only fetch if section has been expanded and no preloaded data
  const { data: fetchedData, isLoading } = useSWR(
    shouldFetch && !preloadedData ? tickerSymbols : null,
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  )

  const tickerData = preloadedData || fetchedData || {}

  return (
    <div className="border-b border-border/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
          isExpanded 
            ? "text-primary bg-secondary/30" 
            : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
        )}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{name}</span>
        </div>
        <div className="flex items-center gap-1">
          {isLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </div>
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
                  "group flex w-full items-center justify-between px-3 py-1.5 text-xs transition-all duration-150",
                  selectedTicker === ticker.symbol 
                    ? "bg-primary/20 border-l-2 border-primary" 
                    : "hover:bg-secondary/50 hover:pl-4 border-l-2 border-transparent"
                )}
              >
                <div className="flex flex-col items-start">
                  <span className={cn(
                    "font-medium transition-colors",
                    selectedTicker === ticker.symbol ? "text-primary" : "text-foreground group-hover:text-primary"
                  )}>
                    {ticker.symbol}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate max-w-[100px] group-hover:text-muted-foreground/80">
                    {ticker.name}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  {price !== undefined ? (
                    <>
                      <span className="font-medium text-foreground group-hover:text-foreground/90">
                        {price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      {change && (
                        <span
                          className={cn(
                            "text-[10px] font-medium px-1 rounded",
                            change.isPositive 
                              ? "text-terminal-green bg-terminal-green/10 group-hover:bg-terminal-green/20" 
                              : "text-terminal-red bg-terminal-red/10 group-hover:bg-terminal-red/20"
                          )}
                        >
                          {change.isPositive && "+"}{change.value}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-[10px] text-muted-foreground animate-pulse">
                      {isLoading ? "..." : "N/A"}
                    </span>
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
