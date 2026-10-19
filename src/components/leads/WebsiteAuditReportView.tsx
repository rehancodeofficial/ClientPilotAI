/**
 * Renders the technical website report produced by the backend audit engine.
 *
 * Everything shown here is an observation the engine made about the live site:
 * the headline score and grade, the seven weighted category scores, the
 * measured metrics, and every issue with the fix for it. Nothing is inferred by
 * a model, so each line can be quoted directly to a prospect.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle, CheckCircle2, ChevronDown, Clock, ExternalLink, FileText,
  Gauge, Image as ImageIcon, Lock, Search, Smartphone, Sparkles, Target,
  TrendingUp, Wrench, XCircle, Zap,
} from 'lucide-react'
import type {
  WebsiteAuditCategoryId,
  WebsiteAuditIssue,
  WebsiteAuditReport,
  WebsiteGrade,
  WebsiteIssueSeverity,
} from '@/types'
import { cn } from '@/lib/utils'

// ─── Presentation maps ────────────────────────────────────────────────────────

const GRADE_COLOR: Record<WebsiteGrade, string> = {
  'A+': '#16a34a',
  A: '#22c55e',
  B: '#84cc16',
  C: '#eab308',
  D: '#f97316',
  F: '#ef4444',
}

const SEVERITY_STYLE: Record<WebsiteIssueSeverity, { label: string; chip: string; dot: string }> = {
  critical: {
    label: 'Critical',
    chip: 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300',
    dot: 'bg-red-500',
  },
  high: {
    label: 'High',
    chip: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300',
    dot: 'bg-orange-500',
  },
  medium: {
    label: 'Medium',
    chip: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  low: {
    label: 'Low',
    chip: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    dot: 'bg-zinc-400',
  },
}

const CATEGORY_ICON: Record<WebsiteAuditCategoryId, typeof Gauge> = {
  performance: Zap,
  seo: Search,
  security: Lock,
  mobile: Smartphone,
  accessibility: Target,
  content: FileText,
  conversion: TrendingUp,
}

const scoreColor = (score: number): string => {
  if (score >= 80) return '#22c55e'
  if (score >= 60) return '#eab308'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

const formatMs = (ms: number | null): string => {
  if (ms === null) return '—'
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)} s` : `${ms} ms`
}

const formatBytes = (bytes: number | null): string => {
  if (bytes === null) return '—'
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.round(bytes / 1024)} KB`
}

// ─── Score dial ───────────────────────────────────────────────────────────────

function GradeDial({ score, grade }: { score: number; grade: WebsiteGrade }) {
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const color = GRADE_COLOR[grade]

  return (
    <div className="relative h-[120px] w-[120px] shrink-0">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60" cy="60" r={radius}
          className="stroke-zinc-200 dark:stroke-zinc-700"
          strokeWidth="9" fill="none"
        />
        <motion.circle
          cx="60" cy="60" r={radius}
          stroke={color} strokeWidth="9" fill="none" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[28px] font-black leading-none" style={{ color }}>{score}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">/ 100</span>
        <span
          className="mt-1 rounded-md px-2 py-0.5 text-[11px] font-black text-white"
          style={{ backgroundColor: color }}
        >
          {grade}
        </span>
      </div>
    </div>
  )
}

// ─── Issue row ────────────────────────────────────────────────────────────────

function IssueRow({ issue }: { issue: WebsiteAuditIssue }) {
  const [open, setOpen] = useState(false)
  const style = SEVERITY_STYLE[issue.severity]

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', style.dot)} />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">{issue.title}</span>
            <span className={cn('rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide', style.chip)}>
              {style.label}
            </span>
            <span className="text-[10px] font-mono text-zinc-400">−{issue.points} pts</span>
          </span>
          {!open && (
            <span className="mt-0.5 block truncate text-[11px] text-zinc-500">{issue.detail}</span>
          )}
        </span>
        <ChevronDown
          className={cn('mt-0.5 h-4 w-4 shrink-0 text-zinc-400 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="space-y-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 px-3 py-2.5">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">What we found</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-zinc-600 dark:text-zinc-300">{issue.detail}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
              <Wrench className="h-3 w-3" /> How to fix it
            </p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-zinc-700 dark:text-zinc-200">
              {issue.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main report ──────────────────────────────────────────────────────────────

export function WebsiteAuditReportView({ report }: { report: WebsiteAuditReport }) {
  const [showAllIssues, setShowAllIssues] = useState(false)

  if (!report.reachable) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 p-4">
        <div className="flex items-start gap-2.5">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-red-700 dark:text-red-300">Website could not be loaded</p>
            <p className="mt-1 text-[12px] leading-relaxed text-red-600/90 dark:text-red-300/80">{report.verdict}</p>
            {report.failureReason && (
              <p className="mt-2 font-mono text-[11px] text-red-500/80 break-all">
                {report.url} → {report.failureReason}
              </p>
            )}
            <p className="mt-2 text-[11px] text-red-600/80 dark:text-red-300/70">
              A business whose website does not load is a strong prospect: the problem is visible to its customers today.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const visibleIssues = showAllIssues ? report.issues : report.issues.slice(0, 8)
  const criticalCount = report.issues.filter((i) => i.severity === 'critical').length
  const highCount = report.issues.filter((i) => i.severity === 'high').length

  return (
    <div className="space-y-5">
      {/* Headline */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <GradeDial score={report.score} grade={report.grade} />
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Website health score</p>
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">{report.verdict}</p>
          {report.finalUrl && (
            <a
              href={report.finalUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-indigo-500 hover:underline break-all"
            >
              {report.finalUrl} <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-zinc-500">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> audited {new Date(report.checkedAt).toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> {criticalCount} critical · {highCount} high · {report.issues.length} total
            </span>
          </div>
        </div>
      </div>

      {/* Category scores */}
      <div>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
          Category scores
        </p>
        <div className="space-y-2">
          {report.categories.map((category) => {
            const Icon = CATEGORY_ICON[category.category]
            return (
              <div key={category.category}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                    <span className="truncate text-[12px] font-medium text-zinc-700 dark:text-zinc-300">
                      {category.label}
                    </span>
                    <span className="shrink-0 text-[10px] text-zinc-400">
                      {category.checksPassed}/{category.checksTotal} passed
                    </span>
                  </span>
                  <span className="shrink-0 text-[12px] font-bold" style={{ color: scoreColor(category.score) }}>
                    {category.score}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: scoreColor(category.score) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${category.score}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Measured metrics */}
      <div>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400">Measured</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: 'Server response', value: formatMs(report.metrics.ttfbMs), icon: Gauge },
            { label: 'Page load', value: formatMs(report.metrics.loadMs), icon: Clock },
            { label: 'Page weight', value: formatBytes(report.metrics.htmlBytes), icon: FileText },
            { label: 'Words', value: String(report.metrics.wordCount), icon: FileText },
            { label: 'Images', value: `${report.metrics.imagesWithAlt}/${report.metrics.imageCount} with alt`, icon: ImageIcon },
            { label: 'Scripts', value: `${report.metrics.scriptCount} (${report.metrics.blockingScriptCount} blocking)`, icon: Zap },
            { label: 'Headings', value: `H1×${report.metrics.headingCounts.h1} H2×${report.metrics.headingCounts.h2}`, icon: Search },
            { label: 'Social profiles', value: String(report.metrics.socialLinks.length), icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-lg bg-zinc-50 px-2.5 py-2 dark:bg-zinc-800/50">
              <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-zinc-400">
                <Icon className="h-3 w-3" /> {label}
              </p>
              <p className="mt-0.5 truncate text-[12px] font-semibold text-zinc-700 dark:text-zinc-200">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies */}
      {report.technologies.length > 0 && (
        <div>
          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
            Technology detected
          </p>
          <div className="flex flex-wrap gap-1.5">
            {report.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick wins */}
      {report.quickWins.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" /> Quick wins — fixable in a day
          </p>
          <ul className="mt-2 space-y-1.5">
            {report.quickWins.map((issue) => (
              <li key={issue.id} className="flex items-start gap-2 text-[12px] text-emerald-900/90 dark:text-emerald-200/90">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>
                  <span className="font-semibold">{issue.title}.</span> {issue.recommendation}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Issues */}
      <div>
        <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
          All findings ({report.issues.length})
        </p>
        {report.issues.length === 0 ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-4 text-center dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-emerald-500" />
            <p className="text-[12px] font-medium text-emerald-700 dark:text-emerald-300">
              Every check passed. This site has no technical faults worth reporting.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {visibleIssues.map((issue) => (
              <IssueRow key={issue.id} issue={issue} />
            ))}
            {report.issues.length > 8 && (
              <button
                type="button"
                onClick={() => setShowAllIssues((v) => !v)}
                className="w-full rounded-lg border border-dashed border-zinc-300 py-2 text-[11px] font-semibold text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800/50"
              >
                {showAllIssues
                  ? 'Show fewer findings'
                  : `Show all ${report.issues.length} findings`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Strengths */}
      {report.strengths.length > 0 && (
        <div>
          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
            What is already working ({report.strengths.length})
          </p>
          <ul className="grid gap-1 sm:grid-cols-2">
            {report.strengths.map((strength, index) => (
              <li
                key={`${strength}-${index}`}
                className="flex items-start gap-1.5 text-[11.5px] text-zinc-600 dark:text-zinc-400"
              >
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
