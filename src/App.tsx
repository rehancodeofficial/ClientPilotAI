import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { AuthGuard } from '@/components/layout/AuthGuard'
import { DashboardPage } from '@/pages/DashboardPage'
import { LeadDiscoveryPage } from '@/pages/LeadDiscoveryPage'
import { PipelinePage } from '@/pages/PipelinePage'
import { LeadsPage } from '@/pages/LeadsPage'
import { MessagesPage } from '@/pages/MessagesPage'
import { ProposalsPage } from '@/pages/ProposalsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { AdminDashboardPage } from '@/pages/AdminDashboardPage'
import { LandingPage } from '@/pages/LandingPage'
import { ProductPage } from '@/pages/ProductPage'
import { FeaturesPage } from '@/pages/FeaturesPage'
import { SolutionsPage } from '@/pages/SolutionsPage'
import { HowItWorksPage } from '@/pages/HowItWorksPage'
import { PricingPage } from '@/pages/PricingPage'
import { AboutPage } from '@/pages/AboutPage'
import { ResourcesPage } from '@/pages/ResourcesPage'
import { FaqPage } from '@/pages/FaqPage'
import { ContactPage } from '@/pages/ContactPage'
import { LoginPage } from '@/pages/LoginPage'
import { ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage } from '@/pages/AuthFlowPages'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { PrivacyPage, TermsPage, CookiePolicyPage, AcceptableUsePage } from '@/pages/LegalPages'
import { NotFoundPage, ErrorPage } from '@/pages/SystemPages'
import { ProfilePage } from '@/pages/ProfilePage'
import { MarketIntelligencePage } from '@/pages/MarketIntelligencePage'
import { OpportunityZonesPage } from '@/pages/OpportunityZonesPage'
import { IntelligenceEvaluationPage } from '@/pages/IntelligenceEvaluationPage'
import { useAppStore } from '@/store/useAppStore'

// Role Guard for Admin Panel
function AdminGuard({ children }: { children: React.ReactNode }) {
  const userRole = useAppStore((s) => s.userRole)
  if (userRole !== 'admin') {
    return <Navigate to="/app" replace />
  }
  return <>{children}</>
}

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Public marketing pages ─────────────────────────── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* ── Auth & Onboarding pages ────────────────────────── */}
        <Route path="/login" element={<LoginPage initialMode="login" />} />
        <Route path="/sign-in" element={<LoginPage initialMode="login" />} />
        <Route path="/signup" element={<LoginPage initialMode="signup" />} />
        <Route path="/sign-up" element={<LoginPage initialMode="signup" />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* ── Legal pages ────────────────────────────────────── */}
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />
        <Route path="/acceptable-use" element={<AcceptableUsePage />} />

        {/* ── Protected app routes ───────────────────────────── */}
        <Route element={<AuthGuard />}>
          <Route element={<AppShell />}>
            <Route path="/app" element={<DashboardPage />} />
            <Route path="/app/discover" element={<LeadDiscoveryPage />} />
            <Route path="/app/pipeline" element={<PipelinePage />} />
            <Route path="/app/leads" element={<LeadsPage />} />
            <Route path="/app/messages" element={<MessagesPage />} />
            <Route path="/app/proposals" element={<ProposalsPage />} />
            <Route path="/app/profile" element={<ProfilePage />} />
            <Route path="/app/market" element={<MarketIntelligencePage />} />
            <Route path="/app/zones" element={<OpportunityZonesPage />} />
            <Route path="/app/evaluation" element={<IntelligenceEvaluationPage />} />
            <Route
              path="/app/admin"
              element={
                <AdminGuard>
                  <AdminDashboardPage />
                </AdminGuard>
              }
            />
            <Route
              path="/app/settings"
              element={
                <AdminGuard>
                  <SettingsPage />
                </AdminGuard>
              }
            />
          </Route>
        </Route>

        {/* Catch-all 404 */}
        <Route path="/500" element={<ErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App
