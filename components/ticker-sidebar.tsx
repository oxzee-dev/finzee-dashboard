"use client"

import { formatLargeNumber } from "@/lib/api"
import type { TickerData } from "@/lib/api"

interface TickerSidebarProps {
  data: TickerData
}

function DataRow({ label, value, suffix = "", highlight = false }: { 
  label: string
  value: string | number | null | undefined
  suffix?: string
  highlight?: boolean 
}) {
  const displayValue = value !== null && value !== undefined && value !== "N/A" ? `${value}${suffix}` : "N/A"
  return (
    <div className="flex justify-between items-center py-0.5">
      <span className="text-[9px] text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className={`text-[10px] font-medium ${highlight ? "text-primary" : "text-foreground"}`}>
        {displayValue}
      </span>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="text-[9px] font-bold text-primary uppercase tracking-wider mt-3 mb-1 pb-0.5 border-b border-primary/40">
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

export function TickerSidebar({ data }: TickerSidebarProps) {
  return (
    <div className="bg-card border border-border rounded-md p-2.5 h-full overflow-auto">
      <h3 className="text-[10px] font-bold text-foreground uppercase tracking-wider mb-2 pb-1 border-b border-border">
        Financial Data
      </h3>

      {/* Valuation */}
      <SectionTitle title="Valuation" />
      <DataRow label="Mkt Cap" value={formatLargeNumber(data.valuation?.marketCap)} />
      <DataRow label="EV" value={formatLargeNumber(data.valuation?.enterpriseValue)} />
      <DataRow label="P/E (TTM)" value={formatNumber(data.ratios?.trailingPE)} />
      <DataRow label="Fwd P/E" value={formatNumber(data.ratios?.forwardPE)} />
      <DataRow label="PEG" value={formatNumber(data.ratios?.pegRatio)} />
      <DataRow label="P/B" value={formatNumber(data.ratios?.priceToBook)} />
      <DataRow label="P/S" value={formatNumber(data.ratios?.priceToSalesTrailing12Months)} />
      <DataRow label="EV/Rev" value={formatNumber(data.valuation?.enterpriseToRevenue)} />
      <DataRow label="EV/EBITDA" value={formatNumber(data.valuation?.enterpriseToEbitda)} />

      {/* Profitability */}
      <SectionTitle title="Profitability" />
      <DataRow label="Profit Mgn" value={formatPercent(data.returns?.profitMargins)} />
      <DataRow label="Op Mgn" value={formatPercent(data.returns?.operatingMargins)} />
      <DataRow label="Gross Mgn" value={formatPercent(data.returns?.grossMargins)} />
      <DataRow label="EBITDA Mgn" value={formatPercent(data.returns?.ebitdaMargins)} />
      <DataRow label="ROA" value={formatPercent(data.returns?.returnOnAssets)} />
      <DataRow label="ROE" value={formatPercent(data.returns?.returnOnEquity)} />

      {/* Growth */}
      <SectionTitle title="Growth" />
      <DataRow label="Rev Growth" value={formatPercent(data.growth?.revenueGrowth)} />
      <DataRow label="Earn Growth" value={formatPercent(data.growth?.earningsGrowth)} />
      <DataRow label="Qtr EPS Gr" value={formatPercent(data.growth?.earningsQuarterlyGrowth)} />
      <DataRow label="Rev/Share" value={formatNumber(data.growth?.revenuePerShare)} />
      <DataRow label="Tot Rev" value={formatLargeNumber(data.growth?.totalRevenue)} />

      {/* Earnings */}
      <SectionTitle title="Earnings" />
      <DataRow label="EPS (TTM)" value={formatNumber(data.earnings?.trailingEps)} />
      <DataRow label="Fwd EPS" value={formatNumber(data.earnings?.forwardEps)} />
      <DataRow label="Net Income" value={formatLargeNumber(data.earnings?.netIncomeToCommon)} />

      {/* Balance Sheet */}
      <SectionTitle title="Balance Sheet" />
      <DataRow label="Total Debt" value={formatLargeNumber(data.debt?.totalDebt)} />
      <DataRow label="Total Cash" value={formatLargeNumber(data.debt?.totalCash)} />
      <DataRow label="Cash/Shr" value={formatNumber(data.debt?.totalCashPerShare)} />
      <DataRow label="D/E Ratio" value={formatNumber(data.debt?.debtToEquity)} />
      <DataRow label="Curr Ratio" value={formatNumber(data.debt?.currentRatio)} />
      <DataRow label="Quick Ratio" value={formatNumber(data.debt?.quickRatio)} />
      <DataRow label="FCF" value={formatLargeNumber(data.debt?.freeCashflow)} />
      <DataRow label="Op CF" value={formatLargeNumber(data.debt?.operatingCashflow)} />

      {/* Dividends */}
      <SectionTitle title="Dividends" />
      <DataRow label="Div Rate" value={formatNumber(data.dividends?.dividendRate)} />
      <DataRow label="Div Yield" value={formatPercent(data.dividends?.dividendYield)} />
      <DataRow label="Payout" value={formatPercent(data.dividends?.payoutRatio)} />
      <DataRow label="5Y Avg Yld" value={formatNumber(data.dividends?.fiveYearAvgDividendYield)} suffix="%" />

      {/* Trading */}
      <SectionTitle title="Trading" />
      <DataRow label="Volume" value={formatLargeNumber(data.trading_info?.volume)} />
      <DataRow label="Avg Vol" value={formatLargeNumber(data.trading_info?.averageVolume)} />
      <DataRow label="10D Vol" value={formatLargeNumber(data.trading_info?.averageVolume10days)} />
      <DataRow label="vs 50 DMA" value={data.trading_info?.change_from_50DMA} />
      <DataRow label="vs 200 DMA" value={data.trading_info?.change_from_200DMA} />
      <DataRow label="50 DMA" value={formatNumber(data.trading_info?.fiftyDayAverage)} />
      <DataRow label="200 DMA" value={formatNumber(data.trading_info?.twoHundredDayAverage)} />

      {/* Shares */}
      <SectionTitle title="Shares" />
      <DataRow label="Shares Out" value={formatLargeNumber(data.valuation?.sharesOutstanding)} />
      <DataRow label="Float" value={formatLargeNumber(data.valuation?.floatShares)} />
      <DataRow label="Book Val" value={formatNumber(data.valuation?.bookValue)} />

      {/* Risk */}
      <SectionTitle title="Risk" />
      <DataRow label="Beta" value={formatNumber(data.risk?.beta)} />
      <DataRow label="Beta 3Y" value={formatNumber(data.risk?.beta3Year)} />

      {/* Company */}
      {data.company_info?.fullTimeEmployees && (
        <>
          <SectionTitle title="Company" />
          <DataRow label="Employees" value={data.company_info?.fullTimeEmployees?.toLocaleString()} />
          <DataRow label="Country" value={data.company_info?.country} />
          {data.company_info?.website && (
            <div className="flex justify-between items-center py-0.5">
              <span className="text-[9px] text-muted-foreground uppercase tracking-wide">Website</span>
              <a
                href={data.company_info.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-medium text-primary hover:underline truncate max-w-[100px]"
              >
                {data.company_info.website.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]}
              </a>
            </div>
          )}
        </>
      )}
    </div>
  )
}
