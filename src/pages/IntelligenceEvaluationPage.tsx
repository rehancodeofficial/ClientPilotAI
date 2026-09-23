import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award, CheckCircle2, TrendingUp, ShieldCheck, HelpCircle,
  BarChart2, RefreshCw, FileText, Check, AlertCircle, ArrowUpRight,
  Sparkles, Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Skeleton } from '@/components/ui';
import { getModelEvaluation } from '@/lib/mockApi';
import type { ModelEvaluationStats } from '@/types';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

export function IntelligenceEvaluationPage() {
  const [stats, setStats] = useState<ModelEvaluationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isDemoMode = useAppStore((s) => s.isDemoMode);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await getModelEvaluation();
      setStats(data);
    } catch (err) {
      console.error('Failed to load model evaluation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [isDemoMode]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl clay-raised text-(--primary)">
              <Award className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">
              Intelligence Model Evaluation & Research Validation
            </h1>
            {isDemoMode && (
              <Badge variant="warning" className="text-xs px-2 py-0.5">DEMO DATA</Badge>
            )}
          </div>
          <p className="text-sm text-(--text-secondary)">
            Empirical validation of multi-factor opportunity scoring against real-world operational outcomes for the Software Engineering FYP.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchStats}
          disabled={isLoading}
          className="gap-2 shrink-0"
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          Recompute Evaluation
        </Button>
      </div>

      {/* Academic Research Questions Card */}
      <div className="clay-raised p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-(--primary)" />
          <h2 className="text-base font-bold text-(--text-primary)">
            FYP Research Hypotheses & Experimental Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 clay-inset rounded-xl space-y-1.5">
            <span className="text-[10px] font-bold text-(--primary) uppercase tracking-wider block">RQ 1: Systemic Discovery</span>
            <p className="text-xs font-semibold text-(--text-primary)">
              Multi-Factor Opportunity Intelligence vs Raw Discovery
            </p>
            <p className="text-[11px] text-(--text-secondary) leading-relaxed">
              Evaluating whether combining geospatial metadata with automated digital maturity audits yields higher intent targets than plain listing queries.
            </p>
          </div>

          <div className="p-4 clay-inset rounded-xl space-y-1.5">
            <span className="text-[10px] font-bold text-(--primary) uppercase tracking-wider block">RQ 2: Actionable Explainability</span>
            <p className="text-xs font-semibold text-(--text-primary)">
              Transparent Evidence Layer vs Generic Lead Scores
            </p>
            <p className="text-[11px] text-(--text-secondary) leading-relaxed">
              Assessing whether grounded evidence (booking absence, SSL deficiency, review velocity) improves human agency proposal formulation speed.
            </p>
          </div>

          <div className="p-4 clay-inset rounded-xl space-y-1.5">
            <span className="text-[10px] font-bold text-(--primary) uppercase tracking-wider block">RQ 3: Outcome Correlation</span>
            <p className="text-xs font-semibold text-(--text-primary)">
              Opportunity Score Correlation with Actual Conversion
            </p>
            <p className="text-[11px] text-(--text-secondary) leading-relaxed">
              Measuring empirical response and deal acceptance rates across distinct opportunity score bands (80-100, 60-79, &lt;60).
            </p>
          </div>
        </div>
      </div>

      {/* Empirical Outcome Correlation Table */}
      <div className="clay-raised p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-(--text-primary)">
              Opportunity Score Band Performance & Conversion Metrics
            </h2>
            <p className="text-xs text-(--text-secondary)">
              Measured from logged operational outcome events (replies, proposals sent, and accepted clients)
            </p>
          </div>
          <BarChart2 className="h-5 w-5 text-(--text-muted)" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-(--border) text-(--text-secondary) text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Opportunity Score Band</th>
                <th className="py-3 px-4">Sample Size</th>
                <th className="py-3 px-4">Replies Recorded</th>
                <th className="py-3 px-4">Proposals Sent</th>
                <th className="py-3 px-4">Won Deals</th>
                <th className="py-3 px-4">Reply Rate</th>
                <th className="py-3 px-4 text-right">Deal Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border)">
              {(stats?.scoreBands || []).map((band) => (
                <tr key={band.band} className="hover:bg-(--surface-raised) transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-(--text-primary)">
                    {band.band}
                  </td>
                  <td className="py-3.5 px-4 text-(--text-secondary)">
                    {band.leadCount} opportunities
                  </td>
                  <td className="py-3.5 px-4 text-(--text-secondary)">
                    {band.replies}
                  </td>
                  <td className="py-3.5 px-4 text-(--text-secondary)">
                    {band.proposalsSent}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                    {band.wonDeals}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold">{band.replyRatePct}%</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Badge
                      variant={band.conversionRatePct >= 15 ? 'success' : band.conversionRatePct > 0 ? 'default' : 'outline'}
                      className="text-xs py-0.5"
                    >
                      {band.conversionRatePct}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Academic Statistical Integrity Note */}
        <div className="p-4 clay-inset rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-(--text-primary)">Statistical Observation & Rigor:</span>
            <p className="text-(--text-secondary) leading-relaxed">
              {stats?.researchMetrics.correlationDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Data Quality & Confidence Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="clay-raised p-5 space-y-2">
          <div className="flex items-center justify-between text-(--text-secondary)">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Confidence Rating</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-(--text-primary)">
            {isLoading ? <Skeleton className="h-9 w-16" /> : `${stats?.evidenceQualityStats.avgConfidencePct ?? 0}%`}
          </div>
          <p className="text-xs text-(--text-muted)">Factored across direct crawl and directory data</p>
        </div>

        <div className="clay-raised p-5 space-y-2">
          <div className="flex items-center justify-between text-(--text-secondary)">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Contact Rate</span>
            <Database className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-(--text-primary)">
            {isLoading ? <Skeleton className="h-9 w-16" /> : `${stats?.evidenceQualityStats.verifiedContactsPct ?? 0}%`}
          </div>
          <p className="text-xs text-(--text-muted)">Prospects with verified phone or email</p>
        </div>

        <div className="clay-raised p-5 space-y-2">
          <div className="flex items-center justify-between text-(--text-secondary)">
            <span className="text-xs font-bold uppercase tracking-wider">Direct Crawler Coverage</span>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-(--text-primary)">
            {isLoading ? <Skeleton className="h-9 w-16" /> : `${stats?.evidenceQualityStats.directCrawlCoveragePct ?? 0}%`}
          </div>
          <p className="text-xs text-(--text-muted)">Target websites inspected via live HTTP client</p>
        </div>
      </div>
    </div>
  );
}
