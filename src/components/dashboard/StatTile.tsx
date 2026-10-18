import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui'
import { Skeleton } from '@/components/ui'
import { TrendSparkline, type SparklineDataPoint } from './TrendSparkline'

export interface StatTileProps {
  label: string
  value?: number | string
  subtext?: string
  icon?: React.ElementType
  trendData?: SparklineDataPoint[] | number[]
  trendColor?: string
  isLoading?: boolean
  isActive?: boolean
  onClick?: () => void
  className?: string
  ariaLabel?: string
}

export function StatTile({
  label,
  value,
  subtext,
  icon: Icon,
  trendData,
  trendColor = 'var(--accent)',
  isLoading = false,
  isActive = false,
  onClick,
  className,
  ariaLabel,
}: StatTileProps) {
  const isClickable = typeof onClick === 'function'

  const content = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-(--text-secondary) truncate">
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg clay-inset flex items-center justify-center shrink-0 text-(--text-primary)">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="my-1">
        {isLoading ? (
          <Skeleton className="h-8 w-20 rounded" />
        ) : (
          <div className="text-2xl sm:text-3xl font-extrabold font-heading text-(--text-primary) tabular-nums tracking-tight">
            {value ?? 0}
          </div>
        )}
      </div>

      {trendData && !isLoading && (
        <div className="mt-2 pt-2 border-t border-(--border-subtle)">
          <TrendSparkline
            data={trendData}
            color={trendColor}
            height={28}
            ariaLabel={`${label} 30-day trend`}
          />
        </div>
      )}

      {subtext && !isLoading && (
        <p className="mt-2 text-xs text-(--text-muted) truncate">{subtext}</p>
      )}
    </div>
  )

  const cardClasses = cn(
    'relative overflow-hidden transition-all duration-200 text-left w-full clay-raised',
    isClickable && 'cursor-pointer hover:bg-(--surface-hover) active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
    isActive && 'ring-2 ring-(--accent) shadow-md',
    className
  )

  if (isClickable) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cardClasses}
        aria-label={ariaLabel || `${label}: ${value ?? 0}`}
        aria-pressed={isActive}
      >
        {content}
      </button>
    )
  }

  return (
    <Card className={cardClasses} aria-label={ariaLabel || `${label}: ${value ?? 0}`}>
      {content}
    </Card>
  )
}
