"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import useSWR from "swr"
import { SidebarSection } from "./sidebar-section"
import { MarketOutlook } from "./market-outlook"
import { TickerDetail } from "./ticker-detail"
import { sections, marketOutlookTickers } from "@/lib/tickers"
import { fetchTickers, type TickerData } from "@/lib/api"
import { 
  Menu, X, RefreshCw, Activity, Search, Star, 
  BarChart3, Globe, PieChart, Briefcase, Landmark, 
  Bitcoin, Layers, TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

// Section icons mapping
const sectionIcons: Record<string, React.ReactNode> = {
  "market-outlook": <TrendingUp className="h-3 w-3" />,
  "us-indices": <BarChart3 className="h-3 w-3" />,
  "world-indices": <Globe className="h-3 w-3" />,
  "sp-sectors": <PieChart className="h-3 w-3" />,
  "global-assets": <Briefcase className="h-3 w-3" />,
  "bonds": <Landmark className="h-3 w-3" />,
  "crypto": <Bitcoin className="h-3 w-3" />,
  "etf": <Layers className="h-3 w-3" />,
}

// Fetcher for SWR
const fetcher = async (tickers: string[]): Promise<Record<string, TickerData>> => {
  const data = await fetchTickers(tickers)
  return data.reduce((acc, item) => {
    acc[item.ticker] = item
    return acc
  }, {} as Record<string, TickerData>)
}

export function Dashboard() {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [watchlist, setWatchlist] = useState<{ symbol: string; name: string }[]>([])

  // Handle time on client side only to avoid hydration mismatch
  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString())
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) setSidebarOpen(false)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Only fetch Market Outlook tickers on initial load (for performance)
  const { data: marketOutlookData, error, isLoading, mutate } = useSWR(
    marketOutlookTickers,
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
      dedupingInterval: 30000,
    }
  )

  // Fetch watchlist ticker data
  const watchlistSymbols = useMemo(() => watchlist.map(w => w.symbol), [watchlist])
  const { data: watchlistData } = useSWR(
    watchlistSymbols.length > 0 ? watchlistSymbols : null,
    fetcher,
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
      dedupingInterval: 30000,
    }
  )

  // Fetch individual ticker data when selected
  const { data: selectedTickerData } = useSWR(
    selectedTicker ? [selectedTicker] : null,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  )

  const handleSelectTicker = useCallback((symbol: string) => {
    setSelectedTicker(symbol)
    if (isMobile) setSidebarOpen(false)
  }, [isMobile])

  const handleBackToOutlook = useCallback(() => {
    setSelectedTicker(null)
  }, [])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = searchQuery.trim().toUpperCase()
    if (trimmedQuery) {
      // Add to watchlist if not already there
      if (!watchlist.some(w => w.symbol === trimmedQuery)) {
        setWatchlist(prev => [...prev, { symbol: trimmedQuery, name: trimmedQuery }])
      }
      // Navigate to ticker
      setSelectedTicker(trimmedQuery)
      setSearchQuery("")
      if (isMobile) setSidebarOpen(false)
    }
  }, [searchQuery, watchlist, isMobile])

  const removeFromWatchlist = useCallback((symbol: string) => {
    setWatchlist(prev => prev.filter(w => w.symbol !== symbol))
  }, [])

  // Combine market outlook data with watchlist data for sections that need it
  const combinedData = useMemo(() => ({
    ...marketOutlookData,
    ...watchlistData,
    ...selectedTickerData,
  }), [marketOutlookData, watchlistData, selectedTickerData])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "flex-shrink-0 bg-sidebar border-r border-sidebar-border overflow-y-auto transition-all duration-300",
          isMobile
            ? cn(
                "fixed inset-y-0 left-0 z-50 w-64",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              )
            : cn(sidebarOpen ? "w-64" : "w-0")
        )}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 bg-sidebar z-10 border-b border-sidebar-border">
          <div className="flex items-center justify-between px-3 py-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">FinTerminal</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 hover:bg-secondary rounded transition-colors lg:hidden"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          
          {/* Search Input */}
          <form onSubmit={handleSearch} className="px-3 pb-3">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticker..."
                className="w-full bg-secondary/50 border border-border rounded px-7 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Section Navigation */}
        <nav className="py-2">
          {/* Watchlist Section */}
          <div className="border-b border-border/50">
            <div className={cn(
              "flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider",
              watchlist.length > 0 ? "text-primary bg-secondary/30" : "text-muted-foreground"
            )}>
              <div className="flex items-center gap-2">
                <Star className="h-3 w-3" />
                <span>Watchlist</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{watchlist.length}</span>
            </div>
            {watchlist.length > 0 && (
              <div className="pb-1">
                {watchlist.map((ticker) => {
                  const data = combinedData[ticker.symbol]
                  const price = data?.main_info?.currentPrice
                  const change = data?.trading_info?.oneDayChange || data?.main_info?.oneDayChange
                  const isPositive = typeof change === 'number' ? change >= 0 : true
                  
                  return (
                    <div
                      key={ticker.symbol}
                      className={cn(
                        "group flex w-full items-center justify-between px-3 py-1.5 text-xs transition-all duration-150",
                        selectedTicker === ticker.symbol 
                          ? "bg-primary/20 border-l-2 border-primary" 
                          : "hover:bg-secondary/50 hover:pl-4 border-l-2 border-transparent"
                      )}
                    >
                      <button
                        onClick={() => handleSelectTicker(ticker.symbol)}
                        className="flex-1 flex flex-col items-start text-left"
                      >
                        <span className={cn(
                          "font-medium transition-colors",
                          selectedTicker === ticker.symbol ? "text-primary" : "text-foreground group-hover:text-primary"
                        )}>
                          {ticker.symbol}
                        </span>
                      </button>
                      <div className="flex items-center gap-2">
                        {price !== undefined && (
                          <span className="font-medium text-foreground text-[10px]">
                            {price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        )}
                        <button
                          onClick={() => removeFromWatchlist(ticker.symbol)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-secondary rounded transition-all"
                          title="Remove from watchlist"
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-terminal-red" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            {watchlist.length === 0 && (
              <div className="px-3 py-2 text-[10px] text-muted-foreground italic">
                Search for a ticker to add to watchlist
              </div>
            )}
          </div>

          {/* Other Sections */}
          {sections.map((section, index) => (
            <SidebarSection
              key={section.id}
              id={section.id}
              name={section.name}
              icon={sectionIcons[section.id]}
              tickers={section.tickers}
              preloadedData={index === 0 ? marketOutlookData : undefined}
              defaultExpanded={index === 0}
              selectedTicker={selectedTicker}
              onSelectTicker={handleSelectTicker}
            />
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex-shrink-0 bg-card border-b border-border px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Sidebar Toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 hover:bg-secondary rounded transition-colors"
              >
                <Menu className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={handleBackToOutlook}
                  className={cn(
                    "hover:text-primary transition-colors",
                    !selectedTicker ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                >
                  Market Outlook
                </button>
                {selectedTicker && (
                  <>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-foreground font-medium">{selectedTicker}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status */}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>Loading...</span>
                </div>
              )}
              {error && (
                <div className="text-xs text-terminal-red">
                  Error loading data
                </div>
              )}

              {/* Refresh */}
              <button
                onClick={() => mutate()}
                className="p-1.5 hover:bg-secondary rounded transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Last Updated - client-side only */}
              {currentTime && (
                <div className="text-[10px] text-muted-foreground hidden md:block">
                  {currentTime}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4">
          {selectedTicker ? (
            <TickerDetail
              data={selectedTickerData?.[selectedTicker] || combinedData[selectedTicker] || null}
              symbol={selectedTicker}
            />
          ) : (
            <MarketOutlook
              tickerData={marketOutlookData || {}}
              onSelectTicker={handleSelectTicker}
            />
          )}
        </div>
      </main>
    </div>
  )
}
