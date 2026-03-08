"use client"

import type { TickerData } from "@/lib/api"
import { cn } from "@/lib/utils"
import { 
  DollarSign, TrendingUp, BarChart3, Percent, 
  PieChart, Wallet, Scale, Shield, Activity, Building2, Globe
} from "lucide-react"

interface TickerSidebarProps {
  data: TickerData
}

function DataRow({ label, value, highlight }: { 
  label: string
  value: string | number | null | undefined
  highlight?: "green" | "red" | "warning"
}) {
  // Display value directly - API returns formatted strings like "375.88 B$"
  let displayValue = "N/A"
  if (value !== null && value !== undefined && value !== "" && value !== "N/A") {
    displayValue = String(value)
  }
  
  return (
    <div className="flex justify-between items-center py-0.5 hover:bg-secondary/30 px-1 -mx-1 rounded transition-colors group">
      <span className="text-[9px] text-muted-foreground uppercase tracking-wide group-hover:text-muted-foreground/80">{label}</span>
      <span className={cn(
        "text-[10px] font-medium",
        highlight === "green" && "text-terminal-green",
        highlight === "red" && "text-terminal-red",
        highlight === "warning" && "text-warning",
        !highlight && "text-foreground"
      )}>
        {displayValue}
      </span>
    </div>
  )
}

function SectionTitle({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary uppercase tracking-wider mt-3 mb-1 pb-0.5 border-b border-primary/40">
      {icon}
      {title}
    </div>
  )
}

// Parse percentage string to number (e.g., "36.31 %" -> 0.3631)
function parsePercentStr(str: string | null | undefined): number | null {
  if (!str || str === "N/A") return null
  const match = String(str).match(/(-?[\d.]+)\s*%?/)
  if (match) return parseFloat(match[1]) / 100
  return null
}

// Parse number from string or return as-is
function parseNumeric(val: string | number | null | undefined): number | null {
  if (val === null || val === undefined || val === "" || val === "N/A") return null
  if (typeof val === "number") return val
  const numStr = String(val).replace(/[^\d.-]/g, "")
  const parsed = parseFloat(numStr)
  return isNaN(parsed) ? null : parsed
}

// Highlight helpers for financial metrics
function getPercentHighlight(str: string | null | undefined): "green" | "red" | undefined {
  if (!str) return undefined
  const val = parsePercentStr(str)
  if (val === null) return undefined
  return val > 0 ? "green" : val < 0 ? "red" : undefined
}

function getPEHighlight(pe: number | null | undefined): "green" | "red" | "warning" | undefined {
  if (pe === null || pe === undefined) return undefined
  if (pe < 0) return "red"
  if (pe < 15) return "green"
  if (pe > 40) return "warning"
  return undefined
}

function getPEGHighlight(peg: number | null | undefined): "green" | "red" | "warning" | undefined {
  if (peg === null || peg === undefined) return undefined
  if (peg < 0) return "red"
  if (peg < 1) return "green"
  if (peg > 2) return "warning"
  return undefined
}

function getPBHighlight(pb: number | null | undefined): "green" | "warning" | undefined {
  if (pb === null || pb === undefined) return undefined
  if (pb < 1) return "green"
  if (pb > 5) return "warning"
  return undefined
}

function getDebtEquityHighlight(de: number | null | undefined): "green" | "red" | "warning" | undefined {
  if (de === null || de === undefined) return undefined
  if (de < 50) return "green"
  if (de > 200) return "red"
  if (de > 100) return "warning"
  return undefined
}

function getCurrentRatioHighlight(cr: number | null | undefined): "green" | "red" | undefined {
  if (cr === null || cr === undefined) return undefined
  if (cr >= 1.5) return "green"
  if (cr < 1) return "red"
  return undefined
}

function getBetaHighlight(beta: number | null | undefined): "green" | "warning" | undefined {
  if (beta === null || beta === undefined) return undefined
  if (beta < 0.8) return "green"
  if (beta > 1.5) return "warning"
  return undefined
}

function getMarginHighlight(str: string | null | undefined, threshold = 10): "green" | "red" | undefined {
  const val = parsePercentStr(str)
  if (val === null) return undefined
  if (val * 100 > threshold) return "green"
  if (val < 0) return "red"
  return undefined
}

function getChangeHighlight(str: string | null | undefined): "green" | "red" | undefined {
  if (!str) return undefined
  return str.startsWith("-") ? "red" : "green"
}

function getEPSHighlight(eps: number | null | undefined): "green" | "red" | undefined {
  if (eps === null || eps === undefined) return undefined
  return eps > 0 ? "green" : eps < 0 ? "red" : undefined
}

export function TickerSidebar({ data }: TickerSidebarProps) {
  return (
    <div className="bg-card border border-border rounded-md p-2.5 h-full overflow-auto">
      <h3 className="flex items-center gap-2 text-[10px] font-bold text-foreground uppercase tracking-wider mb-2 pb-1 border-b border-border">
        <Activity className="h-3 w-3 text-primary" />
        Financial Data
      </h3>

      {/* Valuation */}
      <SectionTitle title="Valuation" icon={<DollarSign className="h-3 w-3" />} />
      <DataRow label="Mkt Cap" value={data.valuation?.marketCap || data.main_info?.marketCap} />
      <DataRow label="EV" value={data.valuation?.enterpriseValue} />
      <DataRow label="P/E (TTM)" value={data.ratios?.trailingPE} highlight={getPEHighlight(data.ratios?.trailingPE)} />
      <DataRow label="Fwd P/E" value={data.ratios?.forwardPE || data.main_info?.forwardPE} highlight={getPEHighlight(data.ratios?.forwardPE || data.main_info?.forwardPE)} />
      <DataRow label="PEG" value={data.ratios?.pegRatio || data.growth?.pegRatio} highlight={getPEGHighlight(data.ratios?.pegRatio)} />
      <DataRow label="P/B" value={data.ratios?.priceToBook || data.valuation?.priceToBook} highlight={getPBHighlight(data.ratios?.priceToBook || data.valuation?.priceToBook)} />
      <DataRow label="P/S" value={data.ratios?.priceToSalesTrailing12Months || data.main_info?.PS} />
      <DataRow label="EV/Rev" value={data.valuation?.enterpriseToRevenue} />
      <DataRow label="EV/EBITDA" value={data.valuation?.enterpriseToEbitda} />

      {/* Profitability */}
      <SectionTitle title="Profitability" icon={<TrendingUp className="h-3 w-3" />} />
      <DataRow label="Profit Mgn" value={data.ratios?.profitMargins || data.returns?.profitMargins} highlight={getMarginHighlight(data.ratios?.profitMargins || data.returns?.profitMargins, 10)} />
      <DataRow label="Op Mgn" value={data.ratios?.operatingMargins || data.returns?.operatingMargins} highlight={getMarginHighlight(data.ratios?.operatingMargins || data.returns?.operatingMargins, 15)} />
      <DataRow label="Gross Mgn" value={data.returns?.grossMargins} highlight={getMarginHighlight(data.returns?.grossMargins, 30)} />
      <DataRow label="EBITDA Mgn" value={data.returns?.ebitdaMargins} highlight={getMarginHighlight(data.returns?.ebitdaMargins, 20)} />
      <DataRow label="ROA" value={data.ratios?.returnOnAssets || data.returns?.returnOnAssets} highlight={getPercentHighlight(data.ratios?.returnOnAssets || data.returns?.returnOnAssets)} />
      <DataRow label="ROE" value={data.ratios?.returnOnEquity || data.returns?.returnOnEquity} highlight={getPercentHighlight(data.ratios?.returnOnEquity || data.returns?.returnOnEquity)} />

      {/* Growth */}
      <SectionTitle title="Growth" icon={<BarChart3 className="h-3 w-3" />} />
      <DataRow label="Rev Growth" value={data.growth?.revenueGrowth} highlight={getPercentHighlight(data.growth?.revenueGrowth)} />
      <DataRow label="Earn Growth" value={data.growth?.earningsGrowth} highlight={getPercentHighlight(data.growth?.earningsGrowth)} />
      <DataRow label="Qtr EPS Gr" value={data.growth?.earningsQuarterlyGrowth} highlight={getPercentHighlight(data.growth?.earningsQuarterlyGrowth)} />
      <DataRow label="Rev/Share" value={data.growth?.revenuePerShare} />
      <DataRow label="Tot Rev" value={data.growth?.totalRevenue} />

      {/* Earnings */}
      <SectionTitle title="Earnings" icon={<Percent className="h-3 w-3" />} />
      <DataRow label="EPS (TTM)" value={data.earnings?.trailingEps} highlight={getEPSHighlight(data.earnings?.trailingEps)} />
      <DataRow label="Fwd EPS" value={data.earnings?.forwardEps} highlight={getEPSHighlight(data.earnings?.forwardEps)} />
      <DataRow label="Net Income" value={data.earnings?.netIncomeToCommon} />
      <DataRow label="PEG Ratio" value={data.earnings?.trailingPegRatio || data.growth?.trailingPegRatio} highlight={getPEGHighlight(data.earnings?.trailingPegRatio)} />

      {/* Balance Sheet / Debt */}
      <SectionTitle title="Balance Sheet" icon={<Scale className="h-3 w-3" />} />
      <DataRow label="Total Debt" value={data.debt?.totalDebt} />
      <DataRow label="Total Cash" value={data.debt?.totalCash} highlight="green" />
      <DataRow label="Cash/Shr" value={data.debt?.totalCashPerShare} />
      <DataRow label="D/E Ratio" value={data.debt?.debtToEquity || data.ratios?.debtToEquity} highlight={getDebtEquityHighlight(data.debt?.debtToEquity || data.ratios?.debtToEquity)} />
      <DataRow label="Curr Ratio" value={data.debt?.currentRatio || data.ratios?.currentRatio} highlight={getCurrentRatioHighlight(data.debt?.currentRatio || data.ratios?.currentRatio)} />
      <DataRow label="Quick Ratio" value={data.debt?.quickRatio || data.ratios?.quickRatio} highlight={getCurrentRatioHighlight(data.debt?.quickRatio || data.ratios?.quickRatio)} />
      <DataRow label="FCF" value={data.debt?.freeCashflow} />
      <DataRow label="Op CF" value={data.debt?.operatingCashflow} />

      {/* Dividends */}
      <SectionTitle title="Dividends" icon={<PieChart className="h-3 w-3" />} />
      <DataRow label="Div Rate" value={data.dividends?.dividendRate} />
      <DataRow label="Div Yield" value={data.dividends?.dividendYield || data.dividends?.trailingAnnualDividendYield} highlight={data.dividends?.dividendYield ? "green" : undefined} />
      <DataRow label="Payout" value={data.dividends?.payoutRatio} />
      <DataRow label="5Y Avg Yld" value={data.dividends?.fiveYearAvgDividendYield} />

      {/* Trading */}
      <SectionTitle title="Trading" icon={<Wallet className="h-3 w-3" />} />
      <DataRow label="Volume" value={data.trading_info?.volume?.toLocaleString()} />
      <DataRow label="Avg Vol" value={data.trading_info?.averageVolume?.toLocaleString()} />
      <DataRow label="10D Vol" value={data.trading_info?.averageVolume10days?.toLocaleString()} />
      <DataRow label="vs 50 DMA" value={data.trading_info?.change_from_50DMA} highlight={getChangeHighlight(data.trading_info?.change_from_50DMA)} />
      <DataRow label="vs 200 DMA" value={data.trading_info?.change_from_200DMA} highlight={getChangeHighlight(data.trading_info?.change_from_200DMA)} />
      <DataRow label="50 DMA" value={data.trading_info?.fiftyDayAverage?.toFixed(2)} />
      <DataRow label="200 DMA" value={data.trading_info?.twoHundredDayAverage?.toFixed(2)} />

      {/* Shares */}
      <SectionTitle title="Shares" icon={<BarChart3 className="h-3 w-3" />} />
      <DataRow label="Shares Out" value={data.valuation?.sharesOutstanding} />
      <DataRow label="Float" value={data.valuation?.floatShares} />
      <DataRow label="Book Val" value={data.valuation?.bookValue} />

      {/* Risk */}
      <SectionTitle title="Risk" icon={<Shield className="h-3 w-3" />} />
      <DataRow label="Beta" value={data.risk?.beta} highlight={getBetaHighlight(data.risk?.beta)} />
      <DataRow label="Beta 3Y" value={data.risk?.beta3Year} highlight={getBetaHighlight(data.risk?.beta3Year)} />
      <DataRow label="Overall Risk" value={data.risk?.overallRisk} highlight={data.risk?.overallRisk && data.risk.overallRisk >= 8 ? "warning" : undefined} />

      {/* Company */}
      {(data.company_info?.fullTimeEmployees || data.company_info?.country) && (
        <>
          <SectionTitle title="Company" icon={<Building2 className="h-3 w-3" />} />
          {data.company_info?.fullTimeEmployees && (
            <DataRow label="Employees" value={data.company_info.fullTimeEmployees.toLocaleString()} />
          )}
          {data.company_info?.country && (
            <DataRow label="Country" value={data.company_info.country} />
          )}
          {data.company_info?.website && (
            <div className="flex justify-between items-center py-0.5 hover:bg-secondary/30 px-1 -mx-1 rounded transition-colors group">
              <span className="text-[9px] text-muted-foreground uppercase tracking-wide group-hover:text-muted-foreground/80">Website</span>
              <a
                href={data.company_info.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-medium text-primary hover:underline truncate max-w-[100px] flex items-center gap-1"
              >
                <Globe className="h-2.5 w-2.5" />
                {data.company_info.website.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
              </a>
            </div>
          )}
        </>
      )}
    </div>
  )
}
