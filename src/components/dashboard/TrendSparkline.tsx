import * as React from 'react'
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'
import { cn } from '@/lib/utils'

export interface SparklineDataPoint {
  date: string
  value: number
}

export interface TrendSparklineProps {
  data: SparklineDataPoint[] | number[]
  color?: string
  height?: number
  className?: string
  ariaLabel?: string
}

export function TrendSparkline({
  data,
  color = 'var(--accent)',
  height = 36,
  className,
  ariaLabel = '30-day activity trend',
}: TrendSparklineProps) {
  // Normalize data points
  const points = React.useMemo(() => {
    if (!data || data.length === 0) return []
    return data.map((item, idx) => {
      if (typeof item === 'number') {
        return { date: `Day ${idx + 1}`, value: item }
      }
      return item
    })
  }, [data])

  const totalValue = points.reduce((sum, p) => sum + p.value, 0)
  const isUp = points.length > 1 && points[points.length - 1].value >= points[0].value

  if (points.length === 0) {
    return (
      <div
        className={cn('h-9 flex items-center justify-center text-[11px] text-(--text-muted)', className)}
        aria-label="No trend data available"
      >
        No trend
      </div>
    )
  }

  return (
    <div
      className={cn('w-full relative select-none', className)}
      style={{ height }}
      aria-label={`${ariaLabel}. Total: ${totalValue}. Trend is ${isUp ? 'upward' : 'downward'}.`}
      role="img"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as SparklineDataPoint
                return (
                  <div className="bg-(--surface-raised) border border-(--border) px-2 py-1 rounded text-[11px] font-medium shadow-sm text-(--text-primary)">
                    <span className="text-(--text-secondary) mr-1.5">{item.date}:</span>
                    <span className="font-bold tabular-nums">{item.value}</span>
                  </div>
                )
              }
              return null
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
