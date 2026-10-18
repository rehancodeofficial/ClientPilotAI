import { cn } from '@/lib/utils'
import {
  Sparkles,
  Send,
  GitCommit,
  FileCheck2,
  Calendar,
  UserPlus,
  ArrowRight,
  Clock,
} from 'lucide-react'

export type ActivityType =
  | 'discovery'
  | 'pipeline_stage'
  | 'outreach_sent'
  | 'proposal_created'
  | 'proposal_status'
  | 'outcome_event'
  | 'portal_invite'
  | (string & {})

export interface ActivityFeedItemProps {
  id: string
  type: ActivityType
  title: string
  description?: string
  timestamp: string | Date
  leadId?: string
  leadName?: string
  onLeadClick?: (leadId: string) => void
  metadata?: Record<string, unknown>
  className?: string
}

const activityIcons: Record<string, { icon: typeof Sparkles; color: string }> = {
  discovery: { icon: Sparkles, color: 'text-(--accent)' },
  pipeline_stage: { icon: GitCommit, color: 'text-indigo-500' },
  outreach_sent: { icon: Send, color: 'text-sky-500' },
  proposal_created: { icon: FileCheck2, color: 'text-emerald-500' },
  proposal_status: { icon: FileCheck2, color: 'text-amber-500' },
  outcome_event: { icon: Calendar, color: 'text-purple-500' },
  portal_invite: { icon: UserPlus, color: 'text-teal-500' },
}

export function ActivityFeedItem({
  type,
  title,
  description,
  timestamp,
  leadId,
  leadName,
  onLeadClick,
  className,
}: ActivityFeedItemProps) {
  const iconMeta = activityIcons[type] || { icon: Clock, color: 'text-(--text-muted)' }
  const Icon = iconMeta.icon

  // Format relative or date time
  const timeFormatted = typeof timestamp === 'string'
    ? new Date(timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : timestamp.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

  return (
    <div
      className={cn(
        'group flex items-start gap-3 p-3 rounded-xl clay-row transition-colors',
        className
      )}
    >
      <div className="w-8 h-8 rounded-lg clay-inset flex items-center justify-center shrink-0 mt-0.5">
        <Icon className={cn('w-4 h-4', iconMeta.color)} aria-hidden="true" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs sm:text-sm font-semibold text-(--text-primary) truncate">
            {title}
          </p>
          <time
            dateTime={typeof timestamp === 'string' ? timestamp : timestamp.toISOString()}
            className="text-[10px] text-(--text-muted) shrink-0 tabular-nums"
          >
            {timeFormatted}
          </time>
        </div>

        {description && (
          <p className="text-xs text-(--text-secondary) mt-0.5 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {leadName && (
          <div className="mt-1.5 flex items-center gap-1.5">
            {leadId && onLeadClick ? (
              <button
                type="button"
                onClick={() => onLeadClick(leadId)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-(--primary) hover:underline select-none cursor-pointer"
              >
                <span>{leadName}</span>
                <ArrowRight className="w-3 h-3 opacity-60" aria-hidden="true" />
              </button>
            ) : (
              <span className="text-[11px] font-medium text-(--text-muted)">
                {leadName}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
