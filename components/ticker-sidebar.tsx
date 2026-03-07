"use client"

import { formatLargeNumber } from "@/lib/api"
import type { TickerData } from "@/lib/api"

interface TickerSidebarProps {
  data: TickerData
}

function DataRow({ label, value, suffix = "" }: { label: string; value: string | number | null; suffix?: string }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-border/50">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span className="text-[11px] font-medium text-foreground">
        {value !== null && value !== undefined ? `${value}${suffix}` : "N/A"}
      </span>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h4 className="text-[10px] font-semibold text-primary uppercase tracking-wider mt-4 mb-2 pb-1 border-b border-primary/30">
      {title}
    </h4>
  )
}

export function TickerSidebar({ data }: TickerSidebarProps) {
  return (
    <div className="bg-card border border-border rounded-md p-3 space-y-1 h-full overflow-auto">
      <h3 className="text-xs font-bold text-foreground mb-3">Financial Data</h3>

      {/* Valuation */}
      {(data.valuation?.marketCap || data.ratios?.trailingPE) && (
        <>
          <SectionTitle title="Valuation" />
          <DataRow label="Market Cap" value={formatLargeNumber(data.valuation?.marketCap)} />
          <DataRow label="Enterprise Value" value={formatLargeNumber(data.valuation?.enterpriseValue)} />
          <DataRow label="P/E (TTM)" value={data.ratios?.trailingPE?.toFixed(2)} />
          <DataRow label="Forward P/E" value={data.ratios?.forwardPE?.toFixed(2)} />
          <DataRow label="PEG Ratio" value={data.ratios?.pegRatio?.toFixed(2)} />
          <DataRow label="P/B Ratio" value={data.ratios?.priceToBook?.toFixed(2)} />
          <DataRow label="P/S (TTM)" value={data.ratios?.priceToSalesTrailing12Months?.toFixed(2)} />
          <DataRow label="EV/Revenue" value={data.valuation?.enterpriseToRevenue?.toFixed(2)} />
          <DataRow label="EV/EBITDA" value={data.valuation?.enterpriseToEbitda?.toFixed(2)} />
        </>
      )}

      {/* Profitability */}
      {(data.returns?.profitMargins || data.returns?.operatingMargins) && (
        <>
          <SectionTitle title="Profitability" />
          <DataRow label="Profit Margin" value={data.returns?.profitMargins ? (data.returns.profitMargins * 100).toFixed(2) : null} suffix="%" />
          <DataRow label="Operating Margin" value={data.returns?.operatingMargins ? (data.returns.operatingMargins * 100).toFixed(2) : null} suffix="%" />
          <DataRow label="Gross Margin" value={data.returns?.grossMargins ? (data.returns.grossMargins * 100).toFixed(2) : null} suffix="%" />
          <DataRow label="EBITDA Margin" value={data.returns?.ebitdaMargins ? (data.returns.ebitdaMargins * 100).toFixed(2) : null} suffix="%" />
          <DataRow label="ROA" value={data.returns?.returnOnAssets ? (data.returns.returnOnAssets * 100).toFixed(2) : null} suffix="%" />
          <DataRow label="ROE" value={data.returns?.returnOnEquity ? (data.returns.returnOnEquity * 100).toFixed(2) : null} suffix="%" />
        </>
      )}

      {/* Growth */}
      {(data.growth?.revenueGrowth || data.growth?.earningsGrowth) && (
        <>
          <SectionTitle title="Growth" />
          <DataRow label="Revenue Growth" value={data.growth?.revenueGrowth ? (data.growth.revenueGrowth * 100).toFixed(2) : null} suffix="%" />
          <DataRow label="Earnings Growth" value={data.growth?.earningsGrowth ? (data.growth.earningsGrowth * 100).toFixed(2) : null} suffix="%" />
          <DataRow label="Qtr Earnings Growth" value={data.growth?.earningsQuarterlyGrowth ? (data.growth.earningsQuarterlyGrowth * 100).toFixed(2) : null} suffix="%" />
          <DataRow label="Revenue/Share" value={data.growth?.revenuePerShare?.toFixed(2)} />
          <DataRow label="Total Revenue" value={formatLargeNumber(data.growth?.totalRevenue)} />
        </>
      )}

      {/* Earnings */}
      {(data.earnings?.trailingEps || data.earnings?.forwardEps) && (
        <>
          <SectionTitle title="Earnings" />
          <DataRow label="EPS (TTM)" value={data.earnings?.trailingEps?.toFixed(2)} />
          <DataRow label="Forward EPS" value={data.earnings?.forwardEps?.toFixed(2)} />
          <DataRow label="Net Income" value={formatLargeNumber(data.earnings?.netIncomeToCommon)} />
        </>
      )}

      {/* Balance Sheet */}
      {(data.debt?.totalDebt || data.debt?.totalCash) && (
        <>
          <SectionTitle title="Balance Sheet" />
          <DataRow label="Total Debt" value={formatLargeNumber(data.debt?.totalDebt)} />
          <DataRow label="Total Cash" value={formatLargeNumber(data.debt?.totalCash)} />
          <DataRow label="Cash/Share" value={data.debt?.totalCashPerShare?.toFixed(2)} />
          <DataRow label="Debt/Equity" value={data.debt?.debtToEquity?.toFixed(2)} />
          <DataRow label="Current Ratio" value={data.debt?.currentRatio?.toFixed(2)} />
          <DataRow label="Quick Ratio" value={data.debt?.quickRatio?.toFixed(2)} />
          <DataRow label="Free Cash Flow" value={formatLargeNumber(data.debt?.freeCashflow)} />
          <DataRow label="Operating CF" value={formatLargeNumber(data.debt?.operatingCashflow)} />
        </>
      )}

      {/* Dividends */}
      {(data.dividends?.dividendRate || data.dividends?.dividendYield) && (
        <>
          <SectionTitle title="Dividends" />
          <DataRow label="Dividend Rate" value={data.dividends?.dividendRate?.toFixed(2)} />
          <DataRow label="Dividend Yield" value={data.dividends?.dividendYield ? (data.dividends.dividendYield * 100).toFixed(2) : null} suffix="%" />
          <DataRow label="Payout Ratio" value={data.dividends?.payoutRatio ? (data.dividends.payoutRatio * 100).toFixed(2) : null} suffix="%" />
          <DataRow label="5Y Avg Yield" value={data.dividends?.fiveYearAvgDividendYield?.toFixed(2)} suffix="%" />
        </>
      )}

      {/* Trading Info */}
      <SectionTitle title="Trading" />
      <DataRow label="Volume" value={formatLargeNumber(data.trading_info?.volume)} />
      <DataRow label="Avg Volume" value={formatLargeNumber(data.trading_info?.averageVolume)} />
      <DataRow label="10D Avg Vol" value={formatLargeNumber(data.trading_info?.averageVolume10days)} />
      <DataRow label="vs 50 DMA" value={data.trading_info?.change_from_50DMA} />
      <DataRow label="vs 200 DMA" value={data.trading_info?.change_from_200DMA} />

      {/* Shares */}
      {data.valuation?.sharesOutstanding && (
        <>
          <SectionTitle title="Shares" />
          <DataRow label="Shares Out" value={formatLargeNumber(data.valuation?.sharesOutstanding)} />
          <DataRow label="Float" value={formatLargeNumber(data.valuation?.floatShares)} />
          <DataRow label="Book Value" value={data.valuation?.bookValue?.toFixed(2)} />
        </>
      )}

      {/* Risk */}
      {data.risk?.beta && (
        <>
          <SectionTitle title="Risk" />
          <DataRow label="Beta" value={data.risk?.beta?.toFixed(2)} />
          <DataRow label="Beta (3Y)" value={data.risk?.beta3Year?.toFixed(2)} />
        </>
      )}

      {/* Company Info */}
      {data.company_info?.fullTimeEmployees && (
        <>
          <SectionTitle title="Company" />
          <DataRow label="Employees" value={data.company_info?.fullTimeEmployees?.toLocaleString()} />
          <DataRow label="Country" value={data.company_info?.country} />
          {data.company_info?.website && (
            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-[10px] text-muted-foreground">Website</span>
              <a
                href={data.company_info.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-medium text-primary hover:underline truncate max-w-[120px]"
              >
                {data.company_info.website.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            </div>
          )}
        </>
      )}
    </div>
  )
}
