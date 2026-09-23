import { create } from 'zustand';

/**
 * Global store — zustand gives stable actions & selectors,
 * which prevents the re-render / infinite-loop pitfalls of
 * naive useEffect-driven context state.
 */
export const useAppStore = create((set, get) => ({
  // ---- UI / navigation ----
  lang: 'ar',
  view: 'auth',          // auth | home | history | withdraw | account | admin
  adminSection: null,    // sub-view key of the admin panel
  setLang: (lang) => set({ lang }),
  setView: (view) => set({ view }),
  setAdminSection: (adminSection) => set({ adminSection }),

  // ---- session ----
  user: null,            // { id, name, email, role }
  login: (user) => set({ user, view: 'home' }),
  logout: () => set({ user: null, view: 'auth' }),

  // ---- wallet ----
  balance: 8.50,
  dailyClaimed: false,
  claimDailyBonus: () => {
    const { dailyClaimed, balance } = get();
    if (dailyClaimed) return;
    set({ dailyClaimed: true, balance: +(balance + 0.25).toFixed(2) });
  },

  // ---- surveys / offers (matches History screenshot) ----
  transactions: [
    { id: 1, label: 'مكافأة الحضور اليومي', source: 'daily', status: 'earned', amount: 0.25, date: '2026/9/21, 4:37:23 م' },
    { id: 2, label: 'مكافأة الحضور اليومي', source: 'daily', status: 'earned', amount: 0.25, date: '2026/9/17, 6:35:21 م' },
    { id: 3, label: 'CPX Research', source: 'cpx', status: 'rejected', amount: 0, date: '2026/8/23, 4:39:41 م' },
    { id: 4, label: 'BitLabs', source: 'bitlabs', status: 'earned', amount: 3.75, date: '2026/8/23, 4:39:41 م' },
    { id: 5, label: 'CPX Research', source: 'cpx', status: 'earned', amount: 5.50, date: '2026/8/23, 4:39:41 م' },
    { id: 6, label: 'مكافأة الحضور اليومي', source: 'daily', status: 'earned', amount: 0.25, date: '2026/8/23, 4:15:17 م' },
  ],
  addTransaction: (tx) =>
    set((s) => ({
      transactions: [{ id: Date.now(), ...tx }, ...s.transactions],
      balance: tx.status === 'earned' ? +(s.balance + tx.amount).toFixed(2) : s.balance,
    })),

  // ---- offers ----
  offers: [
    { id: 'cpx', name: 'CPX Research', payout: 2.50, category: 'surveys' },
    { id: 'bitlabs', name: 'BitLabs', payout: 3.75, category: 'surveys' },
    { id: 'theoremreach', name: 'TheoremReach', payout: 1.80, category: 'surveys' },
    { id: 'cpalead', name: 'CPALead', payout: 4.20, category: 'offers' },
    { id: 'theoremreach2', name: 'TheoremReach', payout: 2.10, category: 'surveys' },
    { id: 'bitlabs2', name: 'BitLabs', payout: 3.20, category: 'surveys' },
  ],
  activeOffer: null,
  setActiveOffer: (activeOffer) => set({ activeOffer }),

  // ---- withdrawals ----
  withdrawMethods: [
    { id: 'paypal', titleKey: 'paypal', subtitleKey: 'minPaypal', min: 3.00, icon: 'paypal' },
    { id: 'topup', titleKey: 'topup', subtitleKey: 'topupSub', min: 20.60, icon: 'topup' },
    { id: 'game', titleKey: 'gameCredit', subtitleKey: 'gameSub', min: 11.25, icon: 'game' },
  ],
  withdrawRequests: [
    { id: 1001, method: 'PayPal Cashout', amount: 3.00, status: 'approved', date: '2026/9/20' },
  ],
  requestWithdrawal: (methodId) => {
    const { balance, withdrawMethods, withdrawRequests } = get();
    const method = withdrawMethods.find((m) => m.id === methodId);
    if (!method || balance < method.min) return { ok: false, reason: 'insufficient' };
    set({
      balance: +(balance - method.min).toFixed(2),
      withdrawRequests: [
        { id: Date.now(), method: method.titleKey === 'paypal' ? 'PayPal Cashout' : method.id, amount: method.min, status: 'approved', date: new Date().toLocaleDateString('ar-SA') },
        ...withdrawRequests,
      ],
    });
    return { ok: true };
  },

  // ---- admin data ----
  adminStats: {
    totalUsers: 217,
    dau: 0,
    retention: '81%',
    pendingWithdrawals: 0,
    queuedTickets: 0,
  },
  users: Array.from({ length: 217 }, (_, i) => ({
    id: i + 1,
    name: `مستخدم ${i + 1}`,
    email: `user${i + 1}@example.com`,
    balance: +(Math.random() * 30).toFixed(2),
    status: i % 11 === 0 ? 'banned' : 'active',
  })),
}));
