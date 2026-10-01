import React from 'react'
import { Link } from 'react-router-dom'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans flex flex-col justify-between selection:bg-[#4cc02b] selection:text-white">
      <PublicNavbar />
      <main className="py-20 flex-1 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="text-6xl font-normal text-[#292929] font-mono">404</div>
          <h1 className="text-3xl font-normal text-[#292929] font-heading">This page doesn't exist.</h1>
          <p className="text-sm text-[#6f6f6e]">The page you're looking for may have moved or no longer exists.</p>
          <div className="flex justify-center gap-3 pt-2">
            <Link to="/" className="inline-flex items-center gap-2 px-6 h-[40px] rounded-[200px] text-xs font-normal text-white bg-[#141414] hover:bg-[#292929] transition-all">
              Go Home
            </Link>
            <button onClick={() => window.history.back()} className="inline-flex items-center gap-2 px-6 h-[40px] rounded-[200px] text-xs font-normal text-[#292929] bg-[#dbdbd2] hover:bg-[#d0d0c8] transition-all">
              Back
            </button>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}

export function ErrorPage() {
  return (
    <div className="min-h-screen bg-[#edede8] text-[#292929] font-sans flex flex-col justify-between selection:bg-[#4cc02b] selection:text-white">
      <PublicNavbar />
      <main className="py-20 flex-1 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-normal text-[#292929] font-heading">Something went wrong.</h1>
          <p className="text-sm text-[#6f6f6e]">We couldn't complete that request. Please try again.</p>
          <div className="flex justify-center gap-3 pt-2">
            <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 px-6 h-[40px] rounded-[200px] text-xs font-normal text-white bg-[#141414] hover:bg-[#292929] transition-all">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
            <Link to="/" className="inline-flex items-center gap-2 px-6 h-[40px] rounded-[200px] text-xs font-normal text-[#292929] bg-[#dbdbd2] hover:bg-[#d0d0c8] transition-all">
              Go Home
            </Link>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  )
}
