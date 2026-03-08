"use client"

import { useState, useEffect, useCallback } from "react"
import useSWR from "swr"
import { SidebarSection } from "./sidebar-section"
import { MarketOutlook } from "./market-outlook"
import { TickerDetail } from "./ticker-detail"
import { sections } from "@/lib/tickers"
import { fetchTickers, type TickerData } from "@/lib/api"
import { Menu, X, RefreshCw, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

// Get all unique tickers from all sections
const allTickers = [...new Set(sections.flatMap((s) => s.tickers.map((t) => t.symbol)))]

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

  // Fetch all ticker data
  const { data: tickerData, error, isLoading, mutate } = useSWR(
    allTickers,
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
        </div>

        {/* Section Navigation */}
        <nav className="py-2">
          {sections.map((section, index) => (
            <SidebarSection
              key={section.id}
              id={section.id}
              name={section.name}
              tickers={section.tickers}
              tickerData={tickerData || {}}
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
              data={selectedTickerData?.[selectedTicker] || tickerData?.[selectedTicker] || null}
              symbol={selectedTicker}
            />
          ) : (
            <MarketOutlook
              tickerData={tickerData || {}}
              onSelectTicker={handleSelectTicker}
            />
          )}
        </div>
      </main>
    </div>
  )
}
