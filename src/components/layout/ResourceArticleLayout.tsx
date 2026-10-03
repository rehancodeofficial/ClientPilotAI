import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { ArrowLeft, ArrowRight, Clock, Tag, Sparkles, BookOpen, Share2, Check } from 'lucide-react'

interface ResourceArticleLayoutProps {
  title: string
  category: string
  readTime: string
  children: React.ReactNode
  subtitle?: string
}

export function ResourceArticleLayout({
  title,
  category,
  readTime,
  children,
  subtitle
}: ResourceArticleLayoutProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#edede8] text-charcoal-body font-sans selection:bg-lime-pulse selection:text-white overflow-x-hidden">
      {/* Top Reading Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-lime-pulse z-50 origin-left"
        style={{ scaleX }}
      />

      <PublicNavbar />

      {/* Hero / Article Header */}
      <header className="relative py-16 sm:py-24 border-b border-black/10 overflow-hidden bg-[#edede8]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-b from-[#edede8]/90 via-[#edede8]/85 to-[#edede8]" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-lime-pulse/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-220 mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-between"
          >
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 text-xs font-medium text-ash-subheading hover:text-graphite-ink transition-colors no-underline group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Knowledge Center</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-ash-subheading hover:text-graphite-ink bg-white/60 border border-black/8 hover:bg-white transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-lime-pulse" />
                  <span className="text-lime-pulse font-medium">Link Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap items-center gap-3 mb-5"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf5e7] border border-lime-pulse/30 text-[#2a7a18] text-[11px] font-mono font-semibold uppercase tracking-wider">
              <Tag className="w-3 h-3" />
              {category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] text-ash-subheading font-mono">
              <Clock className="w-3 h-3" />
              {readTime}
            </span>
            <span className="text-[11px] font-mono text-ash-subheading">•</span>
            <span className="text-[11px] font-mono text-ash-subheading">ClientPilot Intelligence Series</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="text-3xl sm:text-4xl lg:text-[44px] font-normal text-graphite-ink tracking-tight font-heading leading-[1.12] mb-5"
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="text-base sm:text-lg text-[#5c5c5b] leading-relaxed italic border-l-2 border-lime-pulse/50 pl-4 py-0.5"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </header>

      {/* Main Article Content with Professional Justified Formatting */}
      <main className="py-14 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="max-w-220 mx-auto px-4 sm:px-6"
        >
          <article className="prose prose-lg max-w-none
            [&_h2]:text-2xl [&_h2]:sm:text-[28px] [&_h2]:font-normal [&_h2]:text-graphite-ink [&_h2]:font-heading [&_h2]:tracking-tight [&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:leading-snug [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-black/6
            [&_h3]:text-xl [&_h3]:font-normal [&_h3]:text-graphite-ink [&_h3]:font-heading [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:leading-snug
            [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-graphite-ink [&_h4]:mt-7 [&_h4]:mb-2
            [&_p]:text-[15.5px] [&_p]:leading-[1.8] [&_p]:text-[#333333] [&_p]:mb-5 [&_p]:text-justify [&_p]:[text-justify:inter-word]
            [&_ul]:space-y-2.5 [&_ul]:mb-6 [&_ul]:pl-5 [&_ul]:list-disc
            [&_li]:text-[15px] [&_li]:leading-[1.75] [&_li]:text-[#3a3a3a] [&_li]:text-justify [&_li]:[text-justify:inter-word]
            [&_ol]:space-y-2.5 [&_ol]:mb-6 [&_ol]:pl-5 [&_ol]:list-decimal
            [&_blockquote]:border-l-3 [&_blockquote]:border-lime-pulse [&_blockquote]:pl-6 [&_blockquote]:py-4 [&_blockquote]:my-8 [&_blockquote]:bg-[#eaf5e7]/60 [&_blockquote]:rounded-r-2xl [&_blockquote]:pr-6 [&_blockquote]:shadow-2xs
            [&_blockquote_p]:text-[14.5px] [&_blockquote_p]:leading-[1.75] [&_blockquote_p]:text-[#1d5c10] [&_blockquote_p]:font-normal [&_blockquote_p]:italic [&_blockquote_p]:mb-0 [&_blockquote_p]:text-justify
            [&_strong]:text-graphite-ink [&_strong]:font-semibold
            [&_hr]:border-black/10 [&_hr]:my-12
            [&_code]:bg-black/5 [&_code]:px-2 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-[13px] [&_code]:font-mono [&_code]:text-graphite-ink [&_code]:font-medium
            [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse [&_table]:my-8 [&_table]:bg-white [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-black/8 [&_table]:shadow-2xs
            [&_th]:text-left [&_th]:py-3 [&_th]:px-4 [&_th]:bg-[#f4f4ee] [&_th]:border-b [&_th]:border-black/10 [&_th]:text-graphite-ink [&_th]:font-semibold [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wider
            [&_td]:py-3 [&_td]:px-4 [&_td]:border-b [&_td]:border-black/5 [&_td]:text-[#444444] [&_td]:text-xs [&_td]:leading-relaxed
          ">
            {children}
          </article>
        </motion.div>
      </main>

      {/* Bottom Conversion Section */}
      <section className="py-16 sm:py-20 bg-white/70 border-t border-black/8">
        <div className="max-w-220 mx-auto px-4 sm:px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-graphite-ink text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-pulse/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-3 max-w-lg text-center md:text-left relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-lime-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AGENCY PLATFORM ACCESS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-normal font-heading tracking-tight text-white leading-tight">
                Put these strategies into practice on autopilot.
              </h2>
              <p className="text-sm text-white/70 leading-relaxed text-justify md:text-left">
                ClientPilot scans prospect websites automatically across 40+ technical checkpoints to surface high-converting agency opportunities in minutes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto relative z-10 shrink-0">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-7 h-12 rounded-full text-sm font-medium text-graphite-ink bg-white hover:bg-[#eaeae5] transition-all shadow-sm no-underline cursor-pointer"
              >
                <span>Start Free Scan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/resources"
                className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-full text-sm font-medium text-white/90 bg-white/10 hover:bg-white/15 transition-all no-underline cursor-pointer border border-white/10"
              >
                <BookOpen className="w-4 h-4" />
                <span>All Guides</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
