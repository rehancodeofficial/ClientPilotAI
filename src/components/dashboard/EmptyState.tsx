import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { Inbox } from 'lucide-react'

export interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ElementType
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'clay-raised p-8 sm:p-12 text-center flex flex-col items-center justify-center rounded-2xl max-w-lg mx-auto w-full my-4',
        className
      )}
      role="region"
      aria-label={title}
    >
      <div className="w-14 h-14 rounded-2xl clay-inset flex items-center justify-center text-(--text-muted) mb-4">
        <Icon className="w-7 h-7" aria-hidden="true" />
      </div>

      <h4 className="text-base sm:text-lg font-heading font-bold text-(--text-primary) mb-1.5">
        {title}
      </h4>

      {description && (
        <p className="text-sm text-(--text-secondary) max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && (
        <div>
          {actionHref ? (
            <a
              href={actionHref}
              className="clay-btn-primary inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl select-none"
            >
              {actionLabel}
            </a>
          ) : (
            <Button
              type="button"
              onClick={onAction}
              variant="default"
              size="md"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
