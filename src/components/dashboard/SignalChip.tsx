import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Globe,
  Lock,
  Smartphone,
  Calendar,
  ShoppingCart,
  Mail,
  Share2,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react'

export type SignalType =
  | 'website'
  | 'https'
  | 'mobile'
  | 'booking'
  | 'ordering'
  | 'contact_form'
  | 'social'
  | (string & {})

export type SignalStatus = 'detected' | 'not_detected' | 'unknown'

export interface SignalChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  type?: SignalType
  status?: SignalStatus
  label?: string
  isMissing?: boolean // Shorthand for missing signal warnings like "No website"
}

const signalIcons: Record<string, React.ElementType> = {
  website: Globe,
  https: Lock,
  mobile: Smartphone,
  booking: Calendar,
  ordering: ShoppingCart,
  contact_form: Mail,
  social: Share2,
}

const defaultLabels: Record<string, { detected: string; missing: string }> = {
  website: { detected: 'Website active', missing: 'No website' },
  https: { detected: 'HTTPS secure', missing: 'No HTTPS' },
  mobile: { detected: 'Mobile responsive', missing: 'Not mobile friendly' },
  booking: { detected: 'Online booking', missing: 'No online booking' },
  ordering: { detected: 'Online ordering', missing: 'No online ordering' },
  contact_form: { detected: 'Contact form', missing: 'No contact form' },
  social: { detected: 'Social profiles', missing: 'No social presence' },
}

export function SignalChip({
  type = 'website',
  status,
  label,
  isMissing,
  className,
  ...props
}: SignalChipProps) {
  const Icon = signalIcons[type] || Globe

  // If isMissing is explicitly provided or status is 'not_detected', treat as missing signal
  const missing = isMissing ?? status === 'not_detected'
  const isUnknown = status === 'unknown'

  const displayLabel =
    label ||
    (missing
      ? defaultLabels[type]?.missing || `Missing ${type}`
      : isUnknown
      ? `${type} unknown`
      : defaultLabels[type]?.detected || type)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border transition-colors select-none',
        missing
          ? 'bg-rose-500/10 text-(--danger) border-rose-500/20'
          : isUnknown
          ? 'bg-(--surface-raised) text-(--text-muted) border-(--border)'
          : 'bg-(--accent-soft) text-(--accent) border-(--accent)/20',
        className
      )}
      role="status"
      {...props}
    >
      <Icon className="w-3 h-3 shrink-0 opacity-80" aria-hidden="true" />
      <span>{displayLabel}</span>
      {missing ? (
        <AlertCircle className="w-2.5 h-2.5 shrink-0 opacity-70" aria-hidden="true" />
      ) : isUnknown ? (
        <HelpCircle className="w-2.5 h-2.5 shrink-0 opacity-70" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="w-2.5 h-2.5 shrink-0 opacity-70" aria-hidden="true" />
      )}
    </span>
  )
}
