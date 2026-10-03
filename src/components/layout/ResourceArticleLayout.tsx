import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { ArrowLeft, ArrowRight, Clock, Tag } from 'lucide-react'

interface ResourceArticleLayoutProps {
  title: string
  category: string
  readTime: string
  children: React.ReactNode
}

export function ResourceArticleLayout({ title, category, readTime, children }: ResourceArticleLayoutProps) {
  return (
    <div className="min-h-screen bg-[#edede8] text-charcoal-body font-sans selection:bg-lime-pulse selection:text-white overflow-x-hidden">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative py-20 sm:py-28 border-b border-black/10 overflow-hidden bg-[#edede8]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-b from-[#edede8]/90 via-[#edede8]/85 to-[#edede8]" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-pulse/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-200 mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 text-xs font-medium text-ash-subheading hover:text-graphite-ink transition-colors no-underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Resources
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 mb-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf5e7] border border-lime-pulse/30 text-[#2a7a18] text-[11px] font-mono font-semibold uppercase tracking-wider">
              <Tag className="w-3 h-3" />
              {category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-ash-subheading font-mono">
              <Clock className="w-3 h-3" />
              {readTime}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-normal text-graphite-ink tracking-tight font-heading leading-[1.1] max-w-3xl"
          >
            {title}
          </motion.h1>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-200 mx-auto px-4 sm:px-6"
        >
          <article className="prose prose-lg max-w-none
            [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-normal [&_h2]:text-graphite-ink [&_h2]:font-heading [&_h2]:tracking-tight [&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:leading-tight
            [&_h3]:text-xl [&_h3]:font-normal [&_h3]:text-graphite-ink [&_h3]:font-heading [&_h3]:mt-10 [&_h3]:mb-3
            [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-graphite-ink [&_h4]:mt-8 [&_h4]:mb-2
            [&_p]:text-[15px] [&_p]:leading-relaxed [&_p]:text-[#4a4a49] [&_p]:mb-5
            [&_ul]:space-y-2 [&_ul]:mb-6 [&_ul]:pl-5
            [&_li]:text-[15px] [&_li]:leading-relaxed [&_li]:text-[#4a4a49]
            [&_ol]:space-y-2 [&_ol]:mb-6 [&_ol]:pl-5
            [&_blockquote]:border-l-3 [&_blockquote]:border-lime-pulse [&_blockquote]:pl-5 [&_blockquote]:py-2 [&_blockquote]:my-6 [&_blockquote]:bg-[#eaf5e7]/50 [&_blockquote]:rounded-r-xl [&_blockquote]:pr-4
            [&_blockquote_p]:text-[14px] [&_blockquote_p]:text-[#2e7d1b] [&_blockquote_p]:font-medium [&_blockquote_p]:italic [&_blockquote_p]:mb-0
            [&_strong]:text-graphite-ink [&_strong]:font-semibold
            [&_hr]:border-black/8 [&_hr]:my-12
            [&_code]:bg-black/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[13px] [&_code]:font-mono [&_code]:text-graphite-ink
            [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse [&_table]:my-6
            [&_th]:text-left [&_th]:py-2 [&_th]:px-3 [&_th]:border-b [&_th]:border-black/10 [&_th]:text-graphite-ink [&_th]:font-medium [&_th]:text-xs
            [&_td]:py-2 [&_td]:px-3 [&_td]:border-b [&_td]:border-black/5 [&_td]:text-[#4a4a49] [&_td]:text-xs
          ">
            {children}
          </article>
        </motion.div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-[#edede8] border-t border-black/8">
        <div className="max-w-200 mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-normal text-graphite-ink font-heading tracking-tight mb-4">
            Ready to put this into practice?
          </h2>
          <p className="text-sm text-[#5c5c5b] max-w-md mx-auto mb-8 leading-relaxed">
            Start discovering real business opportunities with ClientPilot's automated intelligence engine.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-7 h-12 rounded-full text-sm font-medium text-white bg-graphite-ink hover:bg-charcoal-body transition-all no-underline"
            >
              Start Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 px-7 h-12 rounded-full text-sm font-medium text-charcoal-body bg-white border border-black/8 hover:bg-[#f5f5f0] transition-all no-underline"
            >
              More Resources
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
