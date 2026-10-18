import * as React from 'react'
import { cn, getScoreColor } from '@/lib/utils'

export interface ScoreBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  score: number
  showBand?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreBadge({
  score,
  showBand = false,
  size = 'md',
  className,
  ...props
}: ScoreBadgeProps) {
  const rounded = Math.round(Math.max(0, Math.min(100, score)))

  let band = 'Low'
  let color = 'var(--danger)'
  let bg = 'rgba(239, 68, 68, 0.12)'
  let border = 'rgba(239, 68, 68, 0.25)'

  if (rounded >= 80) {
    band = 'High'
    color = 'var(--success)'
    bg = 'rgba(76, 192, 43, 0.14)'
    border = 'rgba(76, 192, 43, 0.3)'
  } else if (rounded >= 50) {
    band = 'Moderate'
    color = 'var(--warning)'
    bg = 'rgba(245, 158, 11, 0.14)'
    border = 'rgba(245, 158, 11, 0.3)'
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full select-none transition-colors border',
        sizeClasses[size],
        className
      )}
      style={{
        color,
        backgroundColor: bg,
        borderColor: border,
      }}
      aria-label={`Opportunity score ${rounded} out of 100 (${band} priority)`}
      {...props}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="font-bold tabular-nums">{rounded}</span>
      {showBand && (
        <span className="text-[10px] uppercase tracking-wider opacity-85 font-semibold">
          {band}
        </span>
      )}
    </span>
  )
}
