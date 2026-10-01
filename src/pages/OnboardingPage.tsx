import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { Check, ArrowRight, Sparkles, Rocket } from 'lucide-react'

export function OnboardingPage() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  // Form State
  const [agencyName, setAgencyName] = useState('')
  const [website, setWebsite] = useState('')
  const [country, setCountry] = useState('United States')
  const [teamSize, setTeamSize] = useState('2-10')

  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Web Development', 'Custom Integrations'
  ])

  const [targetIndustries, setTargetIndustries] = useState('Healthcare, E-commerce, Local Services')
  const [targetLocations, setTargetLocations] = useState('United States, Canada')

  const toggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter((s) => s !== srv))
    } else {
      setSelectedServices([...selectedServices, srv])
    }
  }

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
    else navigate('/app')
  }

  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans flex flex-col justify-between selection:bg-[#4cc02b] selection:text-white">
      <PublicNavbar />

      <main className="py-12 sm:py-20 flex-1 flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 w-full">
          
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono transition-colors ${
                    s === step
                      ? 'bg-[#141414] text-white'
                      : s < step
                      ? 'bg-[#dbdbd2] text-[#292929]'
                      : 'bg-white text-[#8f8f8e] border border-black/10'
                  }`}
                >
                  {s < step ? <Check className="w-3.5 h-3.5 text-[#4cc02b]" /> : s}
                </div>
                {s < 5 && <div className={`w-8 sm:w-12 h-0.5 ${s < step ? 'bg-[#141414]' : 'bg-black/10'}`} />}
              </div>
            ))}
          </div>

          {/* Card Container */}
          <div className="p-8 rounded-[12px] bg-white border border-black/10 text-left space-y-6 shadow-sm">
            
            {/* Step 1: Agency Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-normal text-[#292929] font-heading">Step 1 — Agency Details</h2>
                  <p className="text-xs text-[#6f6f6e] mt-1">Tell us about your agency workspace.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-normal text-[#6f6f6e] mb-1">Agency Name *</label>
                    <input
                      type="text"
                      required
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="Apex Digital Studio"
                      className="w-full px-3.5 py-2 rounded-[6px] bg-[#edede8] border border-black/10 text-sm text-[#292929] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-normal text-[#6f6f6e] mb-1">Agency Website</label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://apexdigital.com"
                      className="w-full px-3.5 py-2 rounded-[6px] bg-[#edede8] border border-black/10 text-sm text-[#292929] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-normal text-[#6f6f6e] mb-1">Country</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-[6px] bg-[#edede8] border border-black/10 text-sm text-[#292929] focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-normal text-[#6f6f6e] mb-1">Team Size</label>
                      <select
                        value={teamSize}
                        onChange={(e) => setTeamSize(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-[6px] bg-[#edede8] border border-black/10 text-sm text-[#292929] focus:outline-none focus:border-black"
                      >
                        <option value="1">Solo / Freelancer</option>
                        <option value="2-10">2–10 members</option>
                        <option value="11-50">11–50 members</option>
                        <option value="50+">50+ members</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Services */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-normal text-[#292929] font-heading">Step 2 — Services Provided</h2>
                  <p className="text-xs text-[#6f6f6e] mt-1">Select the services your agency offers to clients.</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                  {[
                    'Web Development', 'Software Development', 'SaaS Development', 'Mobile Development',
                    'SEO', 'UI/UX', 'E-commerce', 'Custom Integrations', 'AI Solutions', 'Other'
                  ].map((srv) => {
                    const sel = selectedServices.includes(srv)
                    return (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => toggleService(srv)}
                        className={`p-3 rounded-[6px] text-left text-xs font-normal border transition-all flex items-center justify-between ${
                          sel
                            ? 'bg-[#dbdbd2] border-black/20 text-[#292929]'
                            : 'bg-[#edede8] border-black/5 text-[#6f6f6e] hover:border-black/20'
                        }`}
                      >
                        <span>{srv}</span>
                        {sel && <Check className="w-3.5 h-3.5 text-[#4cc02b]" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Ideal Customers */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-normal text-[#292929] font-heading">Step 3 — Ideal Customers</h2>
                  <p className="text-xs text-[#6f6f6e] mt-1">Help ClientPilot score prospects for commercial fit.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-normal text-[#6f6f6e] mb-1">Target Industries</label>
                    <input
                      type="text"
                      value={targetIndustries}
                      onChange={(e) => setTargetIndustries(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-[6px] bg-[#edede8] border border-black/10 text-sm text-[#292929] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-normal text-[#6f6f6e] mb-1">Target Locations</label>
                    <input
                      type="text"
                      value={targetLocations}
                      onChange={(e) => setTargetLocations(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-[6px] bg-[#edede8] border border-black/10 text-sm text-[#292929] focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Primary Goals */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-normal text-[#292929] font-heading">Step 4 — Primary Goals</h2>
                  <p className="text-xs text-[#6f6f6e] mt-1">What is your primary objective with ClientPilot?</p>
                </div>

                <div className="space-y-2 pt-2">
                  {[
                    'Find new high-intent prospects',
                    'Improve lead qualification accuracy',
                    'Generate evidence-backed outreach',
                    'Discover website technical opportunities',
                    'Streamline developer handoff workflow'
                  ].map((goal, idx) => (
                    <div key={idx} className="p-3 rounded-[6px] bg-[#edede8] border border-black/5 flex items-center gap-3 text-xs text-[#292929]">
                      <Sparkles className="w-3.5 h-3.5 text-[#353535] shrink-0" />
                      <span>{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Finish */}
            {step === 5 && (
              <div className="text-center space-y-3 py-4">
                <div className="w-10 h-10 rounded-full bg-[#c0c0c0] flex items-center justify-center text-[#353535] mx-auto">
                  <Rocket className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-normal text-[#292929] font-heading">Your ClientPilot workspace is ready.</h2>
                <p className="text-xs text-[#6f6f6e] max-w-sm mx-auto">
                  Your agency profile, services, and opportunity scoring models have been configured.
                </p>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-black/10 flex items-center justify-between">
              {step > 1 && step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 rounded-[200px] text-xs font-normal text-[#6f6f6e] hover:text-[#292929]"
                >
                  Back
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 h-[40px] rounded-[200px] text-xs font-normal text-white bg-[#141414] hover:bg-[#292929] transition-all"
              >
                <span>{step === 5 ? 'Start Finding Opportunities' : 'Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}
