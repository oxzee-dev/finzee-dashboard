"use client"

import { formatLargeNumber } from "@/lib/api"
import type { TickerData } from "@/lib/api"
import { cn } from "@/lib/utils"
import { 
  DollarSign, TrendingUp, BarChart3, Percent, 
  PieChart, Wallet, Scale, Shield, Activity, Building2, Globe
} from "lucide-react"

interface TickerSidebarProps {
  data: TickerData
}

function DataRow({ label, value, suffix = "", highlight }: { 
  label: string
  value: string | number | null | undefined
  suffix?: string
  highlight?: "green" | "red" | "warning"
}) {
  const displayValue = value !== null && value !== undefined && value !== "N/A" ? `${value}${suffix}` : "N/A"
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

function formatNumber(num: number | null | undefined, decimals = 2): string {
  if (num === null || num === undefined) return "N/A"
  if (typeof num !== "number" || isNaN(num)) return "N/A"
  return num.toFixed(decimals)
}

function formatPercent(num: number | null | undefined): string {
  if (num === null || num === undefined) return "N/A"
  if (typeof num !== "number" || isNaN(num)) return "N/A"
  return `${(num * 100).toFixed(2)}%`
}

function getPercentHighlight(num: number | null | undefined): "green" | "red" | undefined {
  if (num === null || num === undefined || typeof num !== "number") return undefined
  return num > 0 ? "green" : num < 0 ? "red" : undefined
}

// Helper for ratio-based highlights (valuation metrics)
function getPEHighlight(pe: number | null | undefined): "green" | "red" | "warning" | undefined {
  if (pe === null || pe === undefined || typeof pe !== "number") return undefined
  if (pe < 0) return "red"
  if (pe < 15) return "green"
  if (pe > 40) return "warning"
  return undefined
}

function getPEGHighlight(peg: number | null | undefined): "green" | "red" | "warning" | undefined {
  if (peg === null || peg === undefined || typeof peg !== "number") return undefined
  if (peg < 0) return "red"
  if (peg < 1) return "green"
  if (peg > 2) return "warning"
  return undefined
}

function getPBHighlight(pb: number | null | undefined): "green" | "warning" | undefined {
  if (pb === null || pb === undefined || typeof pb !== "number") return undefined
  if (pb < 1) return "green"
  if (pb > 5) return "warning"
  return undefined
}

function getDebtEquityHighlight(de: number | null | undefined): "green" | "red" | "warning" | undefined {
  if (de === null || de === undefined || typeof de !== "number") return undefined
  if (de < 50) return "green"
  if (de > 100) return "warning"
  if (de > 200) return "red"
  return undefined
}

function getCurrentRatioHighlight(cr: number | null | undefined): "green" | "red" | "warning" | undefined {
  if (cr === null || cr === undefined || typeof cr !== "number") return undefined
  if (cr >= 2) return "green"
  if (cr >= 1.5) return "green"
  if (cr < 1) return "red"
  return undefined
}

function getBetaHighlight(beta: number | null | undefined): "green" | "warning" | undefined {
  if (beta === null || beta === undefined || typeof beta !== "number") return undefined
  if (beta < 0.8) return "green"
  if (beta > 1.5) return "warning"
  return undefined
}

function getMarginHighlight(margin: number | null | undefined, threshold = 0.2): "green" | "red" | undefined {
  if (margin === null || margin === undefined || typeof margin !== "number") return undefined
  if (margin > threshold) return "green"
  if (margin < 0) return "red"
  return undefined
}

function getPayoutHighlight(payout: number | null | undefined): "green" | "warning" | "red" | undefined {
  if (payout === null || payout === undefined || typeof payout !== "number") return undefined
  if (payout < 0.5) return "green"
  if (payout > 0.9) return "red"
  if (payout > 0.7) return "warning"
  return undefined
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
      <DataRow label="Mkt Cap" value={formatLargeNumber(data.valuation?.marketCap)} />
      <DataRow label="EV" value={formatLargeNumber(data.valuation?.enterpriseValue)} />
      <DataRow label="P/E (TTM)" value={formatNumber(data.ratios?.trailingPE)} highlight={getPEHighlight(data.ratios?.trailingPE)} />
      <DataRow label="Fwd P/E" value={formatNumber(data.ratios?.forwardPE)} highlight={getPEHighlight(data.ratios?.forwardPE)} />
      <DataRow label="PEG" value={formatNumber(data.ratios?.pegRatio)} highlight={getPEGHighlight(data.ratios?.pegRatio)} />
      <DataRow label="P/B" value={formatNumber(data.ratios?.priceToBook)} highlight={getPBHighlight(data.ratios?.priceToBook)} />
      <DataRow label="P/S" value={formatNumber(data.ratios?.priceToSalesTrailing12Months)} />
      <DataRow label="EV/Rev" value={formatNumber(data.valuation?.enterpriseToRevenue)} />
      <DataRow label="EV/EBITDA" value={formatNumber(data.valuation?.enterpriseToEbitda)} />

      {/* Profitability */}
      <SectionTitle title="Profitability" icon={<TrendingUp className="h-3 w-3" />} />
      <DataRow label="Profit Mgn" value={formatPercent(data.returns?.profitMargins)} highlight={getMarginHighlight(data.returns?.profitMargins, 0.1)} />
      <DataRow label="Op Mgn" value={formatPercent(data.returns?.operatingMargins)} highlight={getMarginHighlight(data.returns?.operatingMargins, 0.15)} />
      <DataRow label="Gross Mgn" value={formatPercent(data.returns?.grossMargins)} highlight={getMarginHighlight(data.returns?.grossMargins, 0.3)} />
      <DataRow label="EBITDA Mgn" value={formatPercent(data.returns?.ebitdaMargins)} highlight={getMarginHighlight(data.returns?.ebitdaMargins, 0.2)} />
      <DataRow label="ROA" value={formatPercent(data.returns?.returnOnAssets)} highlight={getPercentHighlight(data.returns?.returnOnAssets)} />
      <DataRow label="ROE" value={formatPercent(data.returns?.returnOnEquity)} highlight={data.returns?.returnOnEquity && data.returns.returnOnEquity > 0.15 ? "green" : getPercentHighlight(data.returns?.returnOnEquity)} />

      {/* Growth */}
      <SectionTitle title="Growth" icon={<BarChart3 className="h-3 w-3" />} />
      <DataRow label="Rev Growth" value={formatPercent(data.growth?.revenueGrowth)} highlight={getPercentHighlight(data.growth?.revenueGrowth)} />
      <DataRow label="Earn Growth" value={formatPercent(data.growth?.earningsGrowth)} highlight={getPercentHighlight(data.growth?.earningsGrowth)} />
      <DataRow label="Qtr EPS Gr" value={formatPercent(data.growth?.earningsQuarterlyGrowth)} highlight={getPercentHighlight(data.growth?.earningsQuarterlyGrowth)} />
      <DataRow label="Rev/Share" value={formatNumber(data.growth?.revenuePerShare)} />
      <DataRow label="Tot Rev" value={formatLargeNumber(data.growth?.totalRevenue)} />

      {/* Earnings */}
      <SectionTitle title="Earnings" icon={<Percent className="h-3 w-3" />} />
      <DataRow label="EPS (TTM)" value={formatNumber(data.earnings?.trailingEps)} highlight={data.earnings?.trailingEps && data.earnings.trailingEps > 0 ? "green" : data.earnings?.trailingEps && data.earnings.trailingEps < 0 ? "red" : undefined} />
      <DataRow label="Fwd EPS" value={formatNumber(data.earnings?.forwardEps)} highlight={data.earnings?.forwardEps && data.earnings.forwardEps > 0 ? "green" : data.earnings?.forwardEps && data.earnings.forwardEps < 0 ? "red" : undefined} />
      <DataRow label="Net Income" value={formatLargeNumber(data.earnings?.netIncomeToCommon)} highlight={data.earnings?.netIncomeToCommon && data.earnings.netIncomeToCommon > 0 ? "green" : data.earnings?.netIncomeToCommon && data.earnings.netIncomeToCommon < 0 ? "red" : undefined} />

      {/* Balance Sheet */}
      <SectionTitle title="Balance Sheet" icon={<Scale className="h-3 w-3" />} />
      <DataRow label="Total Debt" value={formatLargeNumber(data.debt?.totalDebt)} />
      <DataRow label="Total Cash" value={formatLargeNumber(data.debt?.totalCash)} highlight={data.debt?.totalCash && data.debt.totalCash > 0 ? "green" : undefined} />
      <DataRow label="Cash/Shr" value={formatNumber(data.debt?.totalCashPerShare)} />
      <DataRow label="D/E Ratio" value={formatNumber(data.debt?.debtToEquity)} highlight={getDebtEquityHighlight(data.debt?.debtToEquity)} />
      <DataRow label="Curr Ratio" value={formatNumber(data.debt?.currentRatio)} highlight={getCurrentRatioHighlight(data.debt?.currentRatio)} />
      <DataRow label="Quick Ratio" value={formatNumber(data.debt?.quickRatio)} highlight={getCurrentRatioHighlight(data.debt?.quickRatio)} />
      <DataRow label="FCF" value={formatLargeNumber(data.debt?.freeCashflow)} highlight={data.debt?.freeCashflow && data.debt.freeCashflow > 0 ? "green" : data.debt?.freeCashflow && data.debt.freeCashflow < 0 ? "red" : undefined} />
      <DataRow label="Op CF" value={formatLargeNumber(data.debt?.operatingCashflow)} highlight={data.debt?.operatingCashflow && data.debt.operatingCashflow > 0 ? "green" : data.debt?.operatingCashflow && data.debt.operatingCashflow < 0 ? "red" : undefined} />

      {/* Dividends */}
      <SectionTitle title="Dividends" icon={<PieChart className="h-3 w-3" />} />
      <DataRow label="Div Rate" value={formatNumber(data.dividends?.dividendRate)} />
      <DataRow label="Div Yield" value={formatPercent(data.dividends?.dividendYield)} highlight={data.dividends?.dividendYield && data.dividends.dividendYield > 0 ? "green" : undefined} />
      <DataRow label="Payout" value={formatPercent(data.dividends?.payoutRatio)} highlight={getPayoutHighlight(data.dividends?.payoutRatio)} />
      <DataRow label="5Y Avg Yld" value={formatNumber(data.dividends?.fiveYearAvgDividendYield)} suffix="%" />

      {/* Trading */}
      <SectionTitle title="Trading" icon={<Wallet className="h-3 w-3" />} />
      <DataRow label="Volume" value={formatLargeNumber(data.trading_info?.volume)} />
      <DataRow label="Avg Vol" value={formatLargeNumber(data.trading_info?.averageVolume)} />
      <DataRow label="10D Vol" value={formatLargeNumber(data.trading_info?.averageVolume10days)} />
      <DataRow label="vs 50 DMA" value={data.trading_info?.change_from_50DMA} highlight={data.trading_info?.change_from_50DMA?.startsWith('-') ? "red" : "green"} />
      <DataRow label="vs 200 DMA" value={data.trading_info?.change_from_200DMA} highlight={data.trading_info?.change_from_200DMA?.startsWith('-') ? "red" : "green"} />
      <DataRow label="50 DMA" value={formatNumber(data.trading_info?.fiftyDayAverage)} />
      <DataRow label="200 DMA" value={formatNumber(data.trading_info?.twoHundredDayAverage)} />

      {/* Shares */}
      <SectionTitle title="Shares" icon={<BarChart3 className="h-3 w-3" />} />
      <DataRow label="Shares Out" value={formatLargeNumber(data.valuation?.sharesOutstanding)} />
      <DataRow label="Float" value={formatLargeNumber(data.valuation?.floatShares)} />
      <DataRow label="Book Val" value={formatNumber(data.valuation?.bookValue)} />

      {/* Risk */}
      <SectionTitle title="Risk" icon={<Shield className="h-3 w-3" />} />
      <DataRow label="Beta" value={formatNumber(data.risk?.beta)} highlight={getBetaHighlight(data.risk?.beta)} />
      <DataRow label="Beta 3Y" value={formatNumber(data.risk?.beta3Year)} highlight={getBetaHighlight(data.risk?.beta3Year)} />

      {/* Company */}
      {data.company_info?.fullTimeEmployees && (
        <>
          <SectionTitle title="Company" icon={<Building2 className="h-3 w-3" />} />
          <DataRow label="Employees" value={data.company_info?.fullTimeEmployees?.toLocaleString()} />
          <DataRow label="Country" value={data.company_info?.country} />
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
