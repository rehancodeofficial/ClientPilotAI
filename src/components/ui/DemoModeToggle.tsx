import { useState } from 'react';
import { Sparkles, Check, ChevronDown, FlaskConical, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const DEMO_SCENARIOS = [
  {
    id: 'high_opportunity',
    title: '1. High Opportunity (Al-Noor Bakers)',
    subtitle: 'Zero website, 87 reviews, high gap (Score: 91/100, Conf: 90%)',
    leadId: 'lead-001',
  },
  {
    id: 'mature_business',
    title: '2. Digitally Mature (City Care Clinic)',
    subtitle: 'Existing website + SSL + booking flow (Maturity: Level 3)',
    leadId: 'lead-003',
  },
  {
    id: 'low_evidence',
    title: '3. Low Evidence / High Uncertainty',
    subtitle: 'Demonstrates handling of unknown states & low confidence',
    leadId: 'lead-005',
  },
  {
    id: 'competitive_gap',
    title: '4. Competitive Gap Scenario',
    subtitle: 'Peers offer online booking; target lacks transactional flow',
    leadId: 'lead-002',
  },
];

export function DemoModeToggle() {
  const isDemoMode = useAppStore((s) => s.isDemoMode);
  const setIsDemoMode = useAppStore((s) => s.setIsDemoMode);
  const selectedDemoScenario = useAppStore((s) => s.selectedDemoScenario);
  const setSelectedDemoScenario = useAppStore((s) => s.setSelectedDemoScenario);
  const setSelectedLeadId = useAppStore((s) => s.setSelectedLeadId);

  const [isOpen, setIsOpen] = useState(false);

  const handleSelectScenario = (scenarioId: string, leadId: string) => {
    setSelectedDemoScenario(scenarioId);
    if (!isDemoMode) setIsDemoMode(true);
    setSelectedLeadId(leadId);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center gap-1.5 p-1 clay-inset rounded-xl">
        <button
          onClick={() => setIsDemoMode(!isDemoMode)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
            isDemoMode
              ? "bg-amber-500 text-white shadow-sm"
              : "text-(--text-secondary) hover:text-(--text-primary)"
          )}
          title="Toggle controlled demonstration dataset for academic defense"
        >
          <FlaskConical className="h-3.5 w-3.5" />
          <span>{isDemoMode ? 'DEMO DATA ACTIVE' : 'FYP Demo Mode'}</span>
        </button>

        {isDemoMode && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-raised)"
            title="Select demonstration scenario"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {isOpen && isDemoMode && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl clay-floating p-2 z-50 border border-(--border) shadow-2xl space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-(--text-muted) border-b border-(--border)">
            Select FYP Defense Scenario
          </div>

          {DEMO_SCENARIOS.map((sc) => {
            const isSelected = selectedDemoScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleSelectScenario(sc.id, sc.leadId)}
                className={cn(
                  "w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start gap-2",
                  isSelected
                    ? "bg-(--primary-soft) text-(--primary) font-semibold"
                    : "hover:bg-(--surface-raised) text-(--text-primary)"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{sc.title}</div>
                  <div className="text-[10px] text-(--text-muted) mt-0.5 leading-snug">{sc.subtitle}</div>
                </div>
                {isSelected && <Check className="h-4 w-4 shrink-0 text-(--primary)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
