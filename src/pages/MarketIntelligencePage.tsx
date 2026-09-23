import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Compass, Target, Layers, AlertCircle, BarChart3,
  PieChart as PieChartIcon, RefreshCw, MapPin, CheckCircle2, ShieldCheck,
  Building2, ArrowUpRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Skeleton } from '@/components/ui';
import { getMarketIntelligence } from '@/lib/apiClient';
import type { MarketIntelligenceStats } from '@/types';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

const MATURITY_COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'];
const GAP_COLORS = ['#f43f5e', '#f97316', '#eab308', '#06b6d4'];

export function MarketIntelligencePage() {
  const [stats, setStats] = useState<MarketIntelligenceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isDemoMode = useAppStore((s) => s.isDemoMode);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const data = await getMarketIntelligence();
      setStats(data);
    } catch (err) {
      console.error('Failed to load market intelligence:', err);
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
              <Compass className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">
              Market Opportunity Intelligence
            </h1>
            {isDemoMode && (
              <Badge variant="warning" className="text-xs px-2 py-0.5">DEMO DATA</Badge>
            )}
          </div>
          <p className="text-sm text-(--text-secondary)">
            Aggregated digital maturity gaps, category opportunity density, and service intervention potential across your target territory.
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
          Refresh Intelligence
        </Button>
      </div>

      {/* Top Intelligence KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="clay-raised p-5 space-y-2">
          <div className="flex items-center justify-between text-(--text-secondary)">
            <span className="text-xs font-bold uppercase tracking-wider">Total Scanned Market</span>
            <Building2 className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-(--text-primary)">
            {isLoading ? <Skeleton className="h-9 w-20" /> : stats?.totalOpportunities}
          </div>
          <p className="text-xs text-(--text-muted)">Commercial entities in database</p>
        </div>

        <div className="clay-raised p-5 space-y-2">
          <div className="flex items-center justify-between text-(--text-secondary)">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Opportunity Score</span>
            <Target className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {isLoading ? <Skeleton className="h-9 w-16" /> : `${stats?.avgOpportunityScore ?? 0}/100`}
          </div>
          <p className="text-xs text-(--text-muted)">High conversion intent indicator</p>
        </div>

        <div className="clay-raised p-5 space-y-2">
          <div className="flex items-center justify-between text-(--text-secondary)">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Confidence</span>
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-(--text-primary)">
            {isLoading ? <Skeleton className="h-9 w-16" /> : `${stats?.avgConfidenceScore ?? 0}%`}
          </div>
          <p className="text-xs text-(--text-muted)">Evidence completeness rating</p>
        </div>

        <div className="clay-raised p-5 space-y-2">
          <div className="flex items-center justify-between text-(--text-secondary)">
            <span className="text-xs font-bold uppercase tracking-wider">Primary Opportunity Gap</span>
            <Layers className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 truncate">
            {isLoading ? <Skeleton className="h-9 w-28" /> : (stats?.digitalGapDistribution[0]?.gap || 'Online Booking')}
          </div>
          <p className="text-xs text-(--text-muted)">Highest market deficiency</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Digital Maturity Distribution */}
        <div className="clay-raised p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-(--text-primary)">
                Digital Maturity Model Distribution
              </h2>
              <p className="text-xs text-(--text-secondary)">
                Breakdown of local businesses across the 5 digital maturity stages
              </p>
            </div>
            <BarChart3 className="h-5 w-5 text-(--text-muted)" />
          </div>

          <div className="h-64">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Skeleton className="h-48 w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.digitalMaturityDistribution || []} layout="vertical" margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="label" width={140} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}
                  />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                    {(stats?.digitalMaturityDistribution || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={MATURITY_COLORS[index % MATURITY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-(--border)">
            {(stats?.digitalMaturityDistribution || []).map((item, idx) => (
              <div key={item.level} className="text-xs flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: MATURITY_COLORS[idx] }} />
                <span className="text-(--text-secondary) truncate">Level {item.level}: <strong>{item.count}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Deficiency / Gap Distribution */}
        <div className="clay-raised p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-(--text-primary)">
                Market Service Deficiencies
              </h2>
              <p className="text-xs text-(--text-secondary)">
                Specific missing capabilities actionable as software agency interventions
              </p>
            </div>
            <PieChartIcon className="h-5 w-5 text-(--text-muted)" />
          </div>

          <div className="h-64">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Skeleton className="h-48 w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.digitalGapDistribution || []}
                    dataKey="count"
                    nameKey="gap"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {(stats?.digitalGapDistribution || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={GAP_COLORS[index % GAP_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}
                    formatter={(val, name, item) => [`${val} businesses (${(item?.payload as any)?.percentage}%)`, name]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="p-3 clay-inset rounded-xl text-xs space-y-1">
            <span className="font-semibold text-(--text-primary)">Intervention Insight:</span>
            <p className="text-(--text-secondary)">
              Over <strong>{stats?.digitalGapDistribution[1]?.percentage ?? 60}%</strong> of audited businesses lack online self-service booking, representing the highest ROI intervention for software agencies in this territory.
            </p>
          </div>
        </div>
      </div>

      {/* Top Opportunity Categories Table */}
      <div className="clay-raised p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-(--text-primary)">
              Top High-Potential Categories
            </h2>
            <p className="text-xs text-(--text-secondary)">
              Ranked by concentrated business volume and average opportunity score
            </p>
          </div>
          <TrendingUp className="h-5 w-5 text-emerald-500" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-(--border) text-(--text-secondary) text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Business Category</th>
                <th className="py-3 px-4">Volume</th>
                <th className="py-3 px-4">Avg Opportunity Score</th>
                <th className="py-3 px-4">Typical Need</th>
                <th className="py-3 px-4 text-right">Recommended Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border)">
              {(stats?.topCategoryOpportunities || []).map((cat) => (
                <tr key={cat.category} className="hover:bg-(--surface-raised) transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-(--text-primary) capitalize">
                    {cat.category.replace('_', ' ')}
                  </td>
                  <td className="py-3.5 px-4 text-(--text-secondary)">
                    {cat.count} businesses
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {cat.avgScore}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-(--text-secondary)">
                    {cat.category === 'clinic' ? 'Self-service patient appointment portal' :
                     cat.category === 'restaurant' ? 'Direct menu & WhatsApp ordering flow' :
                     cat.category === 'salon' ? 'Stylist booking & package selection' :
                     'Custom web presence & local SEO discoverability'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Badge variant="outline" className="text-[11px] py-0.5">
                      {cat.category === 'clinic' ? 'Booking Portal' :
                       cat.category === 'restaurant' ? 'Ordering System' :
                       'Custom Website'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
