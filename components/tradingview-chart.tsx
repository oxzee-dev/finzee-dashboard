"use client"

import { useEffect, useRef, memo } from "react"

interface TradingViewChartProps {
  symbol: string
  height?: number
}

function TradingViewChartComponent({ symbol, height = 400 }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear previous widget
    containerRef.current.innerHTML = ""

    // Create container for widget
    const widgetContainer = document.createElement("div")
    widgetContainer.className = "tradingview-widget-container"
    widgetContainer.style.height = "100%"
    widgetContainer.style.width = "100%"

    const widgetInner = document.createElement("div")
    widgetInner.className = "tradingview-widget-container__widget"
    widgetInner.style.height = `calc(100% - 32px)`
    widgetInner.style.width = "100%"

    widgetContainer.appendChild(widgetInner)
    containerRef.current.appendChild(widgetContainer)

    // Create and append script
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: "D",
      timezone: "America/New_York",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(26, 22, 18, 1)",
      gridColor: "rgba(66, 56, 46, 0.3)",
      allow_symbol_change: false,
      calendar: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
    })

    widgetContainer.appendChild(script)

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [symbol])

  return (
    <div 
      ref={containerRef} 
      className="w-full bg-card rounded-md overflow-hidden border border-border"
      style={{ height: `${height}px` }}
    />
  )
}

export const TradingViewChart = memo(TradingViewChartComponent)
