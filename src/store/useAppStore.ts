import { create } from 'zustand'
import type { AppState, FilterState, Lead, Notification, PipelineStage, OutreachMessage, Proposal } from '@/types'
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient'

const defaultFilters: FilterState = {
  scoreBand: 'all',
  category: 'all',
  pipelineStage: 'all',
  sortBy: 'score',
  sortOrder: 'desc',
  searchQuery: '',
}

export const useAppStore = create<AppState & {
  /** Custom auth JWT token — stored in localStorage for persistence across reloads */
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  /** Demo JWT — set after calling /api/auth/demo. Used by apiFetch instead of Supabase session. */
  demoToken: string | null;
  setDemoToken: (token: string | null) => void;
  updateLeadScore: (id: string, scoreData: Record<string, unknown>) => void;
  initRealtime: () => () => void;
  clearAuth: () => void;
}>((set, get) => ({
  leads: [],
  selectedLeadId: null,
  filters: defaultFilters,
  discoveryResults: [],
  isDiscovering: false,
  sidebarCollapsed: false,
  darkMode: false,
  userRole: null,
  userEmail: null,
  avatarUrl: typeof window !== 'undefined' ? localStorage.getItem('cp_avatar_url') : null,
  setAvatarUrl: (url) => {
    if (typeof window !== 'undefined') {
      if (url) localStorage.setItem('cp_avatar_url', url);
      else localStorage.removeItem('cp_avatar_url');
    }
    set({ avatarUrl: url });
  },
  workspaceName: typeof window !== 'undefined' ? localStorage.getItem('cp_workspace_name') : null,
  setWorkspaceName: (name) => {
    if (typeof window !== 'undefined') {
      if (name) localStorage.setItem('cp_workspace_name', name);
      else localStorage.removeItem('cp_workspace_name');
    }
    set({ workspaceName: name });
  },
  proposals: [],
  /** Real-data only: notifications start empty and are populated from DB */
  notifications: [],

  /** Custom JWT auth token */
  authToken: typeof window !== 'undefined' ? localStorage.getItem('cp_auth_token') : null,
  setAuthToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('cp_auth_token', token);
      else localStorage.removeItem('cp_auth_token');
    }
    set({ authToken: token });
  },

  /** Demo JWT issued by /api/auth/demo */
  demoToken: null,
  setDemoToken: (token) => set({ demoToken: token }),

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cp_auth_token');
      localStorage.removeItem('cp_avatar_url');
      localStorage.removeItem('cp_workspace_name');
    }
    set({ authToken: null, demoToken: null, userRole: null, userEmail: null, avatarUrl: null, workspaceName: null });
  },

  setLeads: (leads: Lead[]) => set({ leads }),
  setSelectedLeadId: (id: string | null) => set({ selectedLeadId: id }),
  setFilters: (filters: Partial<FilterState>) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  setDiscoveryResults: (leads: Lead[]) => set({ discoveryResults: leads }),
  setIsDiscovering: (val: boolean) => set({ isDiscovering: val }),
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleDarkMode: () =>
    set((state) => {
      const next = !state.darkMode
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return { darkMode: next }
    }),
  setUserRole: (role: 'admin' | 'user' | null) => set({ userRole: role }),
  setUserEmail: (email: string | null) => set({ userEmail: email }),
  updateLeadStage: (id: string, stage: PipelineStage) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, pipelineStage: stage } : l)),
      discoveryResults: state.discoveryResults.map((l) =>
        l.id === id ? { ...l, pipelineStage: stage } : l
      ),
    })),
  updateLeadOutreach: (id: string, message: OutreachMessage) =>
    set((state) => {
      const updater = (l: Lead) =>
        l.id === id
          ? { ...l, outreachMessages: [message, ...(l.outreachMessages ?? [])] as OutreachMessage[] }
          : l;
      return {
        leads: state.leads.map(updater),
        discoveryResults: state.discoveryResults.map(updater),
      };
    }),

  // Merge partial field updates into both leads lists (used after /prepare response)
  updateLead: (id: string, updates: Partial<Lead>) =>
    set((state) => {
      const updater = (l: Lead) => (l.id === id ? { ...l, ...updates } : l);
      return {
        leads: state.leads.map(updater),
        discoveryResults: state.discoveryResults.map(updater),
      };
    }),

  updateLeadScore: (id: string, scoreData: Record<string, unknown>) =>
    set((state) => {
      const score = scoreData as {
        overall_score: number;
        digital_presence_gap: number;
        category_fit: number;
        review_activity: number;
        market_density: number;
        competitor_presence: number;
        ai_reasoning: string;
      };
      const updater = (l: Lead) => {
        if (l.id !== id) return l;
        return {
          ...l,
          score: score.overall_score,
          scoreBreakdown: {
            digitalPresenceGap: score.digital_presence_gap,
            categoryFit: score.category_fit,
            reviewActivity: score.review_activity,
            marketDensity: score.market_density,
            competitorPresence: score.competitor_presence,
          },
          aiAnalysis: score.ai_reasoning,
        };
      };
      return {
        leads: state.leads.map(updater),
        discoveryResults: state.discoveryResults.map(updater),
      };
    }),

  setProposals: (proposals: Proposal[]) => set({ proposals }),
  addProposal: (proposal: Proposal) =>
    set((state) => ({
      proposals: [proposal, ...state.proposals.filter((p) => p.id !== proposal.id)],
    })),
  updateProposalStatus: (id: string, status: Proposal['status']) =>
    set((state) => ({
      proposals: state.proposals.map((p) =>
        p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p
      ),
    })),
  deleteProposal: (id: string) =>
    set((state) => ({
      proposals: state.proposals.filter((p) => p.id !== id),
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          read: false,
          timestamp: new Date().toISOString(),
        } as Notification,
        ...state.notifications,
      ],
    })),

  markNotificationRead: (id: string) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  clearNotifications: () => set({ notifications: [] }),

  initRealtime: () => {
    // Only connect WebSocket Realtime if explicitly enabled in environment
    if (!isSupabaseConfigured || import.meta.env.VITE_ENABLE_REALTIME !== 'true') {
      return () => {};
    }

    try {
      // Subscribe to leads updates
      const leadsChannel = supabase.channel('leads_channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (_payload) => {
          // Handled via refetch
        })
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            // Realtime is not active on this remote Supabase project - detach channel
            supabase.removeChannel(leadsChannel);
          }
        });

      // Subscribe to lead scores arriving asynchronously
      const scoresChannel = supabase.channel('scores_channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'lead_scores' }, (payload) => {
          const record = payload.new as Record<string, unknown>;
          if (record && typeof record['lead_id'] === 'string') {
            get().updateLeadScore(record['lead_id'], record);
          }
        })
        .subscribe((status) => {
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            supabase.removeChannel(scoresChannel);
          }
        });

      return () => {
        try {
          supabase.removeChannel(leadsChannel);
          supabase.removeChannel(scoresChannel);
        } catch {
          // ignore
        }
      };
    } catch {
      return () => {};
    }
  }
}))
