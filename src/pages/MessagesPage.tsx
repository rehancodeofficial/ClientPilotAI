import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertCircle, CheckCircle, Clock, Mail, MessageSquare, RefreshCw, Send,
} from 'lucide-react'
import { Badge, Button, Skeleton } from '@/components/ui'
import { getMessages, type MessageCounts, type MessageRecord } from '@/api/messages'
import { useAppStore } from '@/store/useAppStore'
import { cn, formatDate } from '@/lib/utils'

const FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Drafts' },
  { id: 'approved', label: 'Approved' },
  { id: 'sent', label: 'Sent' },
]

const EMPTY_COUNTS: MessageCounts = { total: 0, draft: 0, approved: 0, sent: 0, failed: 0 }

/**
 * Message Records — the full outreach history for the workspace.
 *
 * Loads from `GET /api/messages` rather than deriving rows from whatever leads
 * the store happened to hold, so the page is correct when opened directly and
 * does not sit on a skeleton forever when the workspace has no messages.
 */
export function MessagesPage() {
  const setSelectedLeadId = useAppStore((s) => s.setSelectedLeadId)

  const [messages, setMessages] = useState<MessageRecord[]>([])
  const [counts, setCounts] = useState<MessageCounts>(EMPTY_COUNTS)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (status: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMessages(status)
      setMessages(data.messages)
      setCounts(data.counts ?? EMPTY_COUNTS)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Message records could not be loaded.')
      setMessages([])
      setCounts(EMPTY_COUNTS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load(filter)
  }, [filter, load])

  const statusBadge = (status: string) => {
    if (status === 'sent') {
      return (
        <Badge variant="success" className="capitalize">
          <CheckCircle className="mr-1 h-3 w-3" /> sent
        </Badge>
      )
    }
    if (status === 'failed') {
      return (
        <Badge variant="warning" className="capitalize">
          <AlertCircle className="mr-1 h-3 w-3" /> failed
        </Badge>
      )
    }
    if (status === 'approved') {
      return (
        <Badge variant="secondary" className="capitalize">
          <Send className="mr-1 h-3 w-3" /> approved
        </Badge>
      )
    }
    return (
      <Badge variant="muted" className="capitalize">
        <Clock className="mr-1 h-3 w-3" /> {status}
      </Badge>
    )
  }

  return (
    <div className="w-full space-y-5 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            <MessageSquare className="h-5 w-5 text-indigo-500" /> Message Records
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Every outreach message generated or sent from this workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            {counts.total} total · {counts.sent} sent · {counts.draft} draft
          </span>
          <Button size="sm" variant="outline" onClick={() => load(filter)} disabled={loading}>
            <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} /> Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
              filter === id
                ? 'bg-indigo-500 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 dark:border-red-900/50 dark:bg-red-950/30">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-300">
              Message records could not be loaded
            </p>
            <p className="mt-0.5 text-xs text-red-600/90 dark:text-red-300/80">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-6 space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="mt-2 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                <tr>
                  {['Date', 'Business', 'Subject', 'Status'].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {messages.length === 0 && !error && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
                      No message records yet. Generate outreach from a lead to see it here.
                    </td>
                  </tr>
                )}
                {messages.map((message, index) => (
                  <motion.tr
                    key={message.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(index * 0.02, 0.4) }}
                    onClick={() => setSelectedLeadId(message.leadId)}
                    className="cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <td className="whitespace-nowrap px-4 py-4 align-top">
                      <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                        {formatDate(message.createdAt)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 align-top">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {message.leadName}
                      </span>
                      {message.recipientEmail && (
                        <span className="mt-0.5 block text-[11px] text-zinc-400">{message.recipientEmail}</span>
                      )}
                    </td>
                    <td className="w-full max-w-md px-4 py-4">
                      <p className="flex items-center gap-1.5 font-medium text-zinc-900 dark:text-zinc-100">
                        <Mail className="h-3.5 w-3.5 text-zinc-400" /> {message.subject}
                      </p>
                      <p className="mt-1 line-clamp-1 text-xs text-zinc-500">{message.body}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 align-top">{statusBadge(message.status)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
