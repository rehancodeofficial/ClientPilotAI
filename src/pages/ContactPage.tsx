import React, { useState } from 'react'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export function ContactPage() {
  const [category, setCategory] = useState('Sales')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'validation_error' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('validation_error')
      setErrorMessage('Please fill out all required fields.')
      return
    }

    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      setName('')
      setEmail('')
      setCompany('')
      setSubject('')
      setMessage('')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans selection:bg-[#4cc02b] selection:text-white">
      <PublicNavbar />

      <section className="py-16 sm:py-24">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[200px] bg-[#dbdbd2] text-[#292929] text-xs font-normal">
              <span className="w-2 h-2 rounded-full bg-[#4cc02b]" />
              <span>GET IN TOUCH</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-normal text-[#292929] tracking-[-0.01em] font-heading">
              Let's talk.
            </h1>
            <p className="text-base text-[#6f6f6e]">
              Have questions about ClientPilot, pricing, integrations, or partnerships? Reach out to our team.
            </p>
          </div>

          <div className="p-8 rounded-[12px] bg-white border border-black/10 text-left space-y-6 shadow-sm">
            
            {status === 'success' && (
              <div className="p-4 rounded-[6px] bg-[#dbdbd2] text-[#292929] text-xs flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#4cc02b] shrink-0" />
                <span>Thank you! Your message has been sent successfully. We'll get back to you shortly.</span>
              </div>
            )}

            {status === 'validation_error' && (
              <div className="p-4 rounded-[6px] bg-red-50 text-red-700 border border-red-200 text-xs flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category picker */}
              <div>
                <label className="block text-xs font-normal uppercase text-[#8f8f8e] mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {['Sales', 'Product questions', 'Technical support', 'Partnerships', 'Feedback'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-[200px] text-xs font-normal transition-colors ${
                        category === cat
                          ? 'bg-[#141414] text-white'
                          : 'bg-[#edede8] border border-black/5 text-[#292929] hover:bg-[#dbdbd2]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-normal text-[#6f6f6e] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2 rounded-[6px] bg-[#edede8] border border-black/10 text-sm text-[#292929] focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-[#6f6f6e] mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@agency.com"
                    className="w-full px-3.5 py-2 rounded-[6px] bg-[#edede8] border border-black/10 text-sm text-[#292929] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-normal text-[#6f6f6e] mb-1">Company / Agency Name</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Digital"
                    className="w-full px-3.5 py-2 rounded-[6px] bg-[#edede8] border border-black/10 text-sm text-[#292929] focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-[#6f6f6e] mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Inquiry about Agency Plan"
                    className="w-full px-3.5 py-2 rounded-[6px] bg-[#edede8] border border-black/10 text-sm text-[#292929] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-normal text-[#6f6f6e] mb-1">Message *</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help your agency?"
                  className="w-full px-3.5 py-2 rounded-[6px] bg-[#edede8] border border-black/10 text-sm text-[#292929] focus:outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full h-[44px] rounded-[200px] bg-[#141414] hover:bg-[#292929] text-white font-normal text-sm transition-all flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Message</span>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
