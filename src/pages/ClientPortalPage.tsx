import * as React from 'react'
import {
  Building2,
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Send,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { Button, Textarea, Skeleton, Badge, Card } from '@/components/ui'
import { apiGet, apiPost } from '@/api/client'
import { SignalChip, ScoreBadge } from '@/components/dashboard'

interface PortalContext {
  grantId: string
  leadId: string
  businessName: string
  category: string
  city: string
  agencyName: string
  grantedAt: string
}

interface PortalAudit {
  website_exists: 'detected' | 'not_detected' | 'unknown'
  https_enabled: 'detected' | 'not_detected' | 'unknown'
  mobile_indicator: 'detected' | 'not_detected' | 'unknown'
  booking_detected: 'detected' | 'not_detected' | 'unknown'
  ordering_detected: 'detected' | 'not_detected' | 'unknown'
  contact_form_detected: 'detected' | 'not_detected' | 'unknown'
  social_presence_detected: 'detected' | 'not_detected' | 'unknown'
  digital_maturity_level: number
  audit_score: number
  evidence: Array<{ signal: string; status: string; detail?: string }>
}

interface PortalRecommendation {
  primary_opportunity: string
  recommended_services: string[] | Record<string, any>
  estimated_complexity: string
  estimated_duration: string
  estimated_project_range: string
}

interface PortalProposal {
  id: string
  title: string
  content: string
  status: 'draft' | 'submitted' | 'reviewed' | 'replied' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}

interface PortalMessage {
  id: string
  sender_user_id: string
  body: string
  created_at: string
}

export function ClientPortalPage() {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const [context, setContext] = React.useState<PortalContext | null>(null)
  const [audit, setAudit] = React.useState<PortalAudit | null>(null)
  const [rec, setRec] = React.useState<PortalRecommendation | null>(null)
  const [proposal, setProposal] = React.useState<PortalProposal | null>(null)
  const [messages, setMessages] = React.useState<PortalMessage[]>([])

  // Response action state
  const [feedback, setFeedback] = React.useState('')
  const [isSubmittingResponse, setIsSubmittingResponse] = React.useState(false)
  const [responseNotice, setResponseNotice] = React.useState<string | null>(null)

  // Message state
  const [newMessage, setNewMessage] = React.useState('')
  const [isSendingMessage, setIsSendingMessage] = React.useState(false)

  const loadPortalData = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [ctxRes, auditRes, recRes, propRes, msgRes] = await Promise.all([
        apiGet<PortalContext>('/portal/context'),
        apiGet<{ audit: PortalAudit | null }>('/portal/audit').catch(() => ({ audit: null })),
        apiGet<{ recommendation: PortalRecommendation | null }>('/portal/recommendation').catch(() => ({ recommendation: null })),
        apiGet<{ proposal: PortalProposal | null }>('/portal/proposal').catch(() => ({ proposal: null })),
        apiGet<{ messages: PortalMessage[] }>('/portal/messages').catch(() => ({ messages: [] })),
      ])

      setContext(ctxRes)
      setAudit(auditRes?.audit || null)
      setRec(recRes?.recommendation || null)
      setProposal(propRes?.proposal || null)
      setMessages(msgRes?.messages || [])
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to access client portal. Please verify your invitation grant.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadPortalData()
  }, [loadPortalData])

  // Handle Accept / Request Changes / Decline
  const handleProposalResponse = async (action: 'accept' | 'request_changes' | 'decline') => {
    setIsSubmittingResponse(true)
    setResponseNotice(null)
    try {
      const res = await apiPost<{ success: boolean; status: string }>('/portal/proposal/respond', {
        action,
        feedback: feedback.trim() || undefined,
      })

      if (proposal) {
        setProposal({ ...proposal, status: res.status as any })
      }
      setFeedback('')
      setResponseNotice(
        action === 'accept'
          ? 'Proposal accepted! Your agency has been notified to proceed with onboarding.'
          : action === 'request_changes'
          ? 'Change request submitted. Your agency will review and update the proposal.'
          : 'Proposal declined. Thank you for your feedback.'
      )
      // Refresh messages
      apiGet<{ messages: PortalMessage[] }>('/portal/messages').then((m) => {
        if (m?.messages) setMessages(m.messages)
      })
    } catch (err: unknown) {
      setResponseNotice(err instanceof Error ? err.message : 'Failed to submit response.')
    } finally {
      setIsSubmittingResponse(false)
    }
  }

  // Handle Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSendingMessage) return

    setIsSendingMessage(true)
    try {
      const res = await apiPost<{ message: PortalMessage }>('/portal/messages', {
        body: newMessage.trim(),
      })
      if (res?.message) {
        setMessages((prev) => [...prev, res.message])
      }
      setNewMessage('')
    } catch (err: unknown) {
      console.error('Failed to post message:', err)
    } finally {
      setIsSendingMessage(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-(--bg) flex items-center justify-center p-4">
        <div className="clay-raised p-8 max-w-md w-full space-y-4 text-center rounded-2xl">
          <Skeleton className="h-6 w-32 mx-auto rounded" />
          <Skeleton className="h-4 w-48 mx-auto rounded" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (error || !context) {
    return (
      <div className="min-h-screen bg-(--bg) flex items-center justify-center p-4">
        <div className="clay-raised p-8 max-w-md w-full space-y-4 text-center rounded-2xl">
          <div className="w-12 h-12 rounded-xl clay-inset mx-auto flex items-center justify-center text-(--danger)">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-(--text-primary)">Portal Access Restricted</h2>
          <p className="text-xs text-(--text-secondary) leading-relaxed">
            {error || 'No active portal grant found. Please check with your agency partner for access.'}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Retry Connection
          </Button>
        </div>
      </div>
    )
  }

  // 7 objective audit signals
  const signalsList = [
    { key: 'website', name: 'Web Presence', status: audit?.website_exists || 'unknown' },
    { key: 'https', name: 'HTTPS & SSL Security', status: audit?.https_enabled || 'unknown' },
    { key: 'mobile', name: 'Mobile Responsiveness', status: audit?.mobile_indicator || 'unknown' },
    { key: 'booking', name: 'Online Booking System', status: audit?.booking_detected || 'unknown' },
    { key: 'ordering', name: 'Digital Ordering / eCommerce', status: audit?.ordering_detected || 'unknown' },
    { key: 'contact_form', name: 'Interactive Contact Form', status: audit?.contact_form_detected || 'unknown' },
    { key: 'social', name: 'Social Platform Integration', status: audit?.social_presence_detected || 'unknown' },
  ]

  return (
    <div className="min-h-screen bg-(--bg) text-(--text-primary) antialiased py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Minimal Client Shell Header */}
        <header className="p-6 clay-raised rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-(--text-muted) block mb-1">
              Client Portal · Prepared by {context.agencyName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              {context.businessName}
            </h1>
            <p className="text-xs sm:text-sm text-(--text-secondary) mt-1">
              Digital Audit Findings & Modernization Proposal
            </p>
          </div>

          {proposal && (
            <div className="shrink-0 flex items-center gap-2">
              <span className="text-xs text-(--text-muted)">Proposal Status:</span>
              <Badge
                variant={proposal.status === 'accepted' ? 'success' : 'default'}
                className="capitalize text-xs px-2.5 py-1"
              >
                {proposal.status}
              </Badge>
            </div>
          )}
        </header>

        {responseNotice && (
          <div className="p-4 rounded-xl clay-raised border border-(--accent)/30 bg-(--accent-soft) text-(--text-primary) text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-(--accent) shrink-0" />
            <span>{responseNotice}</span>
          </div>
        )}

        {/* 1. Digital Presence Scorecard */}
        <section className="clay-raised p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-(--border-subtle) pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-(--text-primary)">
                Your Digital Presence Findings
              </h2>
              <p className="text-xs text-(--text-secondary)">
                Objective technical evaluation of public customer-facing touchpoints.
              </p>
            </div>
            {audit?.audit_score !== undefined && (
              <div className="text-right">
                <span className="text-[10px] text-(--text-muted) uppercase block font-semibold">
                  Maturity Score
                </span>
                <span className="text-xl font-bold font-mono text-(--accent)">
                  {audit.audit_score}/100
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {signalsList.map((sig) => {
              const isDetected = sig.status === 'detected'
              const isMissing = sig.status === 'not_detected'
              return (
                <div
                  key={sig.key}
                  className="clay-row p-3 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <span className="font-medium text-(--text-primary)">{sig.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isDetected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-(--success)">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    ) : isMissing ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-(--danger)">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Missing</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-(--text-muted)">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Pending</span>
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 2. What We Recommend (Allowlisted opportunity fields only) */}
        {rec && (
          <section className="clay-raised p-6 rounded-2xl space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-(--text-primary)">
              Recommended Modernization Scope
            </h2>

            {rec.primary_opportunity && (
              <p className="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">
                {rec.primary_opportunity}
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {rec.estimated_duration && (
                <div className="clay-inset p-3 rounded-xl text-center">
                  <span className="text-[10px] text-(--text-muted) uppercase font-bold block">
                    Estimated Timeline
                  </span>
                  <span className="text-sm font-semibold text-(--text-primary)">
                    {rec.estimated_duration}
                  </span>
                </div>
              )}

              {rec.estimated_complexity && (
                <div className="clay-inset p-3 rounded-xl text-center">
                  <span className="text-[10px] text-(--text-muted) uppercase font-bold block">
                    Complexity
                  </span>
                  <span className="text-sm font-semibold capitalize text-(--text-primary)">
                    {rec.estimated_complexity}
                  </span>
                </div>
              )}

              {rec.estimated_project_range && (
                <div className="clay-inset p-3 rounded-xl text-center">
                  <span className="text-[10px] text-(--text-muted) uppercase font-bold block">
                    Estimated Range
                  </span>
                  <span className="text-sm font-semibold text-(--text-primary)">
                    {rec.estimated_project_range}
                  </span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 3. The Proposal & Response Actions */}
        {proposal ? (
          <section className="clay-raised p-6 rounded-2xl space-y-5">
            <div className="border-b border-(--border-subtle) pb-3">
              <span className="text-[10px] uppercase font-mono text-(--text-muted) block mb-1">
                Formal Work Proposal
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-(--text-primary)">
                {proposal.title}
              </h2>
            </div>

            {/* Markdown proposal content */}
            <div className="prose prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap p-4 clay-inset rounded-xl max-h-96 overflow-y-auto">
              {proposal.content}
            </div>

            {/* Response Section */}
            {proposal.status !== 'accepted' && (
              <div className="space-y-4 pt-2">
                <Textarea
                  placeholder="Optional notes, questions, or change requests for your agency..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="text-xs min-h-[70px]"
                />

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    type="button"
                    onClick={() => handleProposalResponse('accept')}
                    disabled={isSubmittingResponse}
                    className="clay-btn-primary w-full sm:w-auto h-11 px-6 text-sm font-bold gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accept Proposal</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleProposalResponse('request_changes')}
                    disabled={isSubmittingResponse}
                    className="w-full sm:w-auto h-11 px-5 text-xs"
                  >
                    Request Changes
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleProposalResponse('decline')}
                    disabled={isSubmittingResponse}
                    className="w-full sm:w-auto h-11 px-4 text-xs text-(--text-muted) hover:text-(--danger)"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            )}
          </section>
        ) : (
          <div className="clay-raised p-6 rounded-2xl text-center text-xs text-(--text-muted)">
            Your custom modernization proposal is being drafted by {context.agencyName}.
          </div>
        )}

        {/* 4. Message Thread with Agency */}
        <section className="clay-raised p-6 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-(--border-subtle) pb-3">
            <MessageSquare className="w-4 h-4 text-(--accent)" />
            <h2 className="text-base font-bold text-(--text-primary)">
              Direct Channel with {context.agencyName}
            </h2>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <p className="text-xs text-(--text-muted) py-4 text-center">
                No messages yet. Send a message to communicate directly with your project lead.
              </p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="clay-row p-3 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-(--text-muted)">
                    <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-(--text-primary) whitespace-pre-wrap">{m.body}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Ask a question or send a note..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 clay-inset px-3 py-2 text-xs rounded-xl bg-(--surface) text-(--text-primary) border border-(--border) focus:outline-none"
            />
            <Button
              type="submit"
              disabled={isSendingMessage || !newMessage.trim()}
              size="sm"
              className="clay-btn-primary px-4 h-9"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </section>
      </div>
    </div>
  )
}
