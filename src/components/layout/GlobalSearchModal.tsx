import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Building2, Target, FileText, ArrowRight, ShieldCheck, MapPin, Sparkles
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn, getCategoryLabel, getScoreColor } from '@/lib/utils';
import type { Lead, Proposal } from '@/types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const leads = useAppStore((s) => s.leads);
  const discoveryResults = useAppStore((s) => s.discoveryResults);
  const proposals = useAppStore((s) => s.proposals);
  const setSelectedLeadId = useAppStore((s) => s.setSelectedLeadId);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Combined real leads from workspace & discovery (deduped by id)
  const allLeads = useMemo(() => {
    const map = new Map<string, Lead>();
    leads.forEach((l) => map.set(l.id, l));
    discoveryResults.forEach((l) => {
      if (!map.has(l.id)) map.set(l.id, l);
    });
    return Array.from(map.values());
  }, [leads, discoveryResults]);

  // Grouped search results from actual database / memory items
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { businesses: [], opportunities: [], proposals: [] };

    const matchingLeads = allLeads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.address?.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.aiAnalysis?.toLowerCase().includes(q)
    );

    const matchingProposals = proposals.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.content?.toLowerCase().includes(q)
    );

    return {
      businesses: matchingLeads.slice(0, 5),
      opportunities: matchingLeads
        .filter((l) => l.score >= 70 || l.opportunityAnalysis)
        .slice(0, 4),
      proposals: matchingProposals.slice(0, 4),
    };
  }, [allLeads, proposals, query]);

  const totalResultsCount =
    results.businesses.length + results.opportunities.length + results.proposals.length;

  const handleSelectLead = (leadId: string) => {
    setSelectedLeadId(leadId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-(--surface) border border-(--border) rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-(--border)">
            <Search className="h-5 w-5 text-(--text-muted) shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search real businesses, opportunities, proposals, or audits..."
              className="flex-1 bg-transparent text-(--text-primary) placeholder:text-(--text-muted) text-sm font-medium outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-(--text-muted) hover:text-(--text-primary) transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-(--surface-raised) text-(--text-muted) border border-(--border)">
              ESC
            </kbd>
          </div>

          {/* Results Container */}
          <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
            {!query.trim() ? (
              <div className="py-12 text-center text-(--text-muted)">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-semibold uppercase tracking-wider">
                  Real Database Search
                </p>
                <p className="text-[11px] mt-1 text-(--text-secondary)">
                  Type to query verified business profiles, audits, and opportunity proposals.
                </p>
              </div>
            ) : totalResultsCount === 0 ? (
              <div className="py-12 text-center text-(--text-muted)">
                <Building2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-semibold uppercase tracking-wider">
                  No records found
                </p>
                <p className="text-[11px] mt-1 text-(--text-secondary)">
                  No database entries match "{query}". Try searching another name, city, or category.
                </p>
              </div>
            ) : (
              <>
                {/* Opportunities Group */}
                {results.opportunities.length > 0 && (
                  <div>
                    <div className="px-3 py-1 text-[10px] font-bold text-(--text-muted) uppercase tracking-widest flex items-center gap-1.5">
                      <Target className="h-3 w-3 text-(--primary)" />
                      <span>High-Priority Opportunities ({results.opportunities.length})</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {results.opportunities.map((opp) => (
                        <div
                          key={`opp-${opp.id}`}
                          onClick={() => handleSelectLead(opp.id)}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-(--surface-hover) cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-(--surface-raised) border border-(--border) flex items-center justify-center shrink-0">
                              <Sparkles className="h-4 w-4 text-(--accent)" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-(--text-primary) truncate group-hover:text-(--primary) transition-colors">
                                {opp.name}
                              </p>
                              <p className="text-[11px] text-(--text-muted) truncate">
                                {getCategoryLabel(opp.category)} · {opp.city}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span
                              className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
                              style={{
                                color: getScoreColor(opp.score),
                                backgroundColor: `${getScoreColor(opp.score)}15`,
                              }}
                            >
                              Score {opp.score}
                            </span>
                            <ArrowRight className="h-4 w-4 text-(--text-muted) opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Businesses Group */}
                {results.businesses.length > 0 && (
                  <div>
                    <div className="px-3 py-1 text-[10px] font-bold text-(--text-muted) uppercase tracking-widest flex items-center gap-1.5">
                      <Building2 className="h-3 w-3 text-(--text-secondary)" />
                      <span>Businesses ({results.businesses.length})</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {results.businesses.map((biz) => (
                        <div
                          key={`biz-${biz.id}`}
                          onClick={() => handleSelectLead(biz.id)}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-(--surface-hover) cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-(--surface-raised) border border-(--border) flex items-center justify-center shrink-0">
                              <Building2 className="h-4 w-4 text-(--text-secondary)" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-(--text-primary) truncate group-hover:text-(--primary) transition-colors">
                                {biz.name}
                              </p>
                              <p className="text-[11px] text-(--text-muted) truncate flex items-center gap-1">
                                <MapPin className="h-3 w-3 shrink-0" />
                                {biz.address || biz.city}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] font-semibold text-(--text-muted)">
                              {getCategoryLabel(biz.category)}
                            </span>
                            <ArrowRight className="h-4 w-4 text-(--text-muted) opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Proposals Group */}
                {results.proposals.length > 0 && (
                  <div>
                    <div className="px-3 py-1 text-[10px] font-bold text-(--text-muted) uppercase tracking-widest flex items-center gap-1.5">
                      <FileText className="h-3 w-3 text-(--warning)" />
                      <span>Proposals ({results.proposals.length})</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {results.proposals.map((prop) => (
                        <div
                          key={`prop-${prop.id}`}
                          onClick={() => {
                            if (prop.leadId) handleSelectLead(prop.leadId);
                          }}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-(--surface-hover) cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-(--surface-raised) border border-(--border) flex items-center justify-center shrink-0">
                              <FileText className="h-4 w-4 text-(--warning)" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-(--text-primary) truncate group-hover:text-(--primary) transition-colors">
                                {prop.title}
                              </p>
                              <p className="text-[11px] text-(--text-muted) truncate">
                                Status: {prop.status}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-(--text-muted) opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-2.5 bg-(--surface-raised) border-t border-(--border) flex items-center justify-between text-[11px] text-(--text-muted)">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-(--success)" />
              Verified Database & Opportunity Index
            </span>
            <span className="font-mono text-[10px]">
              {allLeads.length} indexed records
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
