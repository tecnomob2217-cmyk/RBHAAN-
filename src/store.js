import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      lang: 'ar',
      view: 'auth',
      adminSection: null,
      setLang: (lang) => set({ lang }),
      setView: (view) => set({ view }),
      setAdminSection: (adminSection) => set({ adminSection }),

      user: null,
      login: (user) => {
        const { welcomeTestEnabled, welcomeQuestions, passedWelcomeUserIds } = get();
        const mustPassTest =
          user.role !== 'admin' &&
          welcomeTestEnabled &&
          welcomeQuestions.length > 0 &&
          !passedWelcomeUserIds.includes(user.id);
        set({ user, view: mustPassTest ? 'welcomeTest' : 'home' });
      },
      logout: () => set({ user: null, view: 'auth', adminSection: null }),

      balance: 8.5,
      dailyClaimed: false,
      claimDailyBonus: () => {
        const { dailyClaimed, balance, settings } = get();
        if (dailyClaimed) return;
        set({ dailyClaimed: true, balance: +(balance + settings.dailyBonusAmount).toFixed(2) });
      },

      transactions: [
        { id: 1, label: 'مكافأة الحضور اليومي', source: 'daily', status: 'earned', amount: 0.25, date: '2026/9/21, 4:37:23 م' },
        { id: 2, label: 'مكافأة الحضور اليومي', source: 'daily', status: 'earned', amount: 0.25, date: '2026/9/17, 6:35:21 م' },
        { id: 3, label: 'CPX Research', source: 'cpx', status: 'rejected', amount: 0, date: '2026/8/23, 4:39:41 م' },
        { id: 4, label: 'BitLabs', source: 'bitlabs', status: 'earned', amount: 3.75, date: '2026/8/23, 4:39:41 م' },
        { id: 5, label: 'CPX Research', source: 'cpx', status: 'earned', amount: 5.5, date: '2026/8/23, 4:39:41 م' },
        { id: 6, label: 'مكافأة الحضور اليومي', source: 'daily', status: 'earned', amount: 0.25, date: '2026/8/23, 4:15:17 م' },
      ],
      addTransaction: (tx) =>
        set((s) => ({
          transactions: [{ id: Date.now(), ...tx }, ...s.transactions],
          balance: tx.status === 'earned' ? +(s.balance + tx.amount).toFixed(2) : s.balance,
        })),

      offers: [
        { id: 'cpx', name: 'CPX Research', payout: 2.5, category: 'surveys' },
        { id: 'bitlabs', name: 'BitLabs', payout: 3.75, category: 'surveys' },
        { id: 'theoremreach', name: 'TheoremReach', payout: 1.8, category: 'surveys' },
        { id: 'cpalead', name: 'CPALead', payout: 4.2, category: 'offers' },
        { id: 'theoremreach2', name: 'TheoremReach', payout: 2.1, category: 'surveys' },
        { id: 'bitlabs2', name: 'BitLabs', payout: 3.2, category: 'surveys' },
      ],
      activeOffer: null,
      setActiveOffer: (activeOffer) => set({ activeOffer }),

      withdrawMethods: [
        { id: 'paypal', titleKey: 'paypal', subtitleKey: 'minPaypal', min: 3.0, icon: 'paypal' },
        { id: 'topup', titleKey: 'topup', subtitleKey: 'topupSub', min: 20.6, icon: 'topup' },
        { id: 'game', titleKey: 'gameCredit', subtitleKey: 'gameSub', min: 11.25, icon: 'game' },
      ],
      withdrawRequests: [
        { id: 1001, method: 'PayPal Cashout', amount: 3.0, status: 'approved', date: '2026/9/20' },
      ],
      requestWithdrawal: (methodId) => {
        const { balance, withdrawMethods, withdrawRequests } = get();
        const method = withdrawMethods.find((m) => m.id === methodId);
        if (!method || balance < method.min) return { ok: false, reason: 'insufficient' };
        set({
          balance: +(balance - method.min).toFixed(2),
          withdrawRequests: [
            {
              id: Date.now(),
              method: method.titleKey === 'paypal' ? 'PayPal Cashout' : method.id,
              amount: method.min,
              status: 'approved',
              date: new Date().toLocaleDateString('ar-SA'),
            },
            ...withdrawRequests,
          ],
        });
        return { ok: true };
      },
      updateWithdrawalStatus: (id, status) =>
        set((s) => ({
          withdrawRequests: s.withdrawRequests.map((r) => (r.id === id ? { ...r, status } : r)),
        })),

      settings: {
        appName: 'ربحان',
        primaryColor: '#10b981',
        primaryColorDark: '#059669',
        darkMode: false,
        dailyBonusAmount: 0.25,
        referralBonus: 2.0,
      },
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      offerNetworks: [
        { id: 'cpalead', name: 'CPALead', appId: '', apiKey: '', baseUrl: 'https://www.cpalead.com/dropscript.php', enabled: false },
        { id: 'theoremreach', name: 'TheoremReach', appId: '', apiKey: '', baseUrl: '', enabled: false },
      ],
      addOfferNetwork: (net) =>
        set((s) => ({
          offerNetworks: [...s.offerNetworks, { id: `net_${Date.now()}`, appId: '', apiKey: '', baseUrl: '', enabled: false, ...net }],
        })),
      updateOfferNetwork: (id, patch) =>
        set((s) => ({ offerNetworks: s.offerNetworks.map((n) => (n.id === id ? { ...n, ...patch } : n)) })),
      deleteOfferNetwork: (id) =>
        set((s) => ({ offerNetworks: s.offerNetworks.filter((n) => n.id !== id) })),

      postbackBaseUrl: 'https://your-domain.com/api/postback',
      setPostbackBaseUrl: (url) => set({ postbackBaseUrl: url }),

      homeLayout: [
        { key: 'balance', label: 'بطاقة الرصيد', visible: true },
        { key: 'actions', label: 'أزرار السجل والسحب', visible: true },
        { key: 'dailyBonus', label: 'مكافأة الحضور اليومي', visible: true },
        { key: 'offers', label: 'الاستطلاعات والعروض', visible: true },
      ],
      toggleHomeSection: (key) =>
        set((s) => ({
          homeLayout: s.homeLayout.map((sec) => (sec.key === key ? { ...sec, visible: !sec.visible } : sec)),
        })),
      moveHomeSection: (index, dir) =>
        set((s) => {
          const arr = [...s.homeLayout];
          const j = index + dir;
          if (j < 0 || j >= arr.length) return {};
          [arr[index], arr[j]] = [arr[j], arr[index]];
          return { homeLayout: arr };
        }),

      tickets: [],
      createTicket: (subject, message) =>
        set((s) => ({
          tickets: [
            {
              id: Date.now(),
              userId: s.user?.id,
              userName: s.user?.name,
              subject,
              status: 'open',
              messages: [{ from: 'user', text: message, date: new Date().toLocaleString('ar-SA') }],
            },
            ...s.tickets,
          ],
        })),
      replyTicket: (id, text, from = 'admin') =>
        set((s) => ({
          tickets: s.tickets.map((tkt) =>
            tkt.id === id
              ? { ...tkt, status: from === 'admin' ? 'answered' : 'open', messages: [...tkt.messages, { from, text, date: new Date().toLocaleString('ar-SA') }] }
              : tkt
          ),
        })),
      closeTicket: (id) =>
        set((s) => ({ tickets: s.tickets.map((tkt) => (tkt.id === id ? { ...tkt, status: 'closed' } : tkt)) })),

      welcomeTestEnabled: false,
      welcomeQuestions: [],
      passedWelcomeUserIds: [],
      setWelcomeTestEnabled: (v) => set({ welcomeTestEnabled: v }),
      addWelcomeQuestion: (q) =>
        set((s) => ({ welcomeQuestions: [...s.welcomeQuestions, { id: Date.now(), answers: ['', ''], correctIndex: 0, ...q }] })),
      updateWelcomeQuestion: (id, patch) =>
        set((s) => ({ welcomeQuestions: s.welcomeQuestions.map((q) => (q.id === id ? { ...q, ...patch } : q)) })),
      deleteWelcomeQuestion: (id) =>
        set((s) => ({ welcomeQuestions: s.welcomeQuestions.filter((q) => q.id !== id) })),
      passWelcomeTest: () =>
        set((s) => ({ passedWelcomeUserIds: [...s.passedWelcomeUserIds, s.user.id], view: 'home' })),
      failWelcomeTest: () => set({ user: null, view: 'auth' }),

      broadcasts: [],
      lastSeenBroadcastId: 0,
      sendBroadcast: (text) =>
        set((s) => ({ broadcasts: [{ id: Date.now(), text, date: new Date().toLocaleString('ar-SA') }, ...s.broadcasts] })),
      markBroadcastsSeen: () =>
        set((s) => ({ lastSeenBroadcastId: s.broadcasts[0]?.id ?? s.lastSeenBroadcastId })),

      legalPages: {
        terms: 'أضف نص الشروط والأحكام هنا من لوحة الإدارة.',
        privacy: 'أضف نص سياسة الخصوصية هنا من لوحة الإدارة.',
        about: 'أضف نص "من نحن" هنا من لوحة الإدارة.',
      },
      updateLegalPage: (key, text) => set((s) => ({ legalPages: { ...s.legalPages, [key]: text } })),

      security: { vpnDetection: true, autoBan: true, bannedIps: [] },
      updateSecurity: (patch) => set((s) => ({ security: { ...s.security, ...patch } })),
      addBannedIp: (ip) =>
        set((s) => ({ security: { ...s.security, bannedIps: [...new Set([...s.security.bannedIps, ip])] } })),
      removeBannedIp: (ip) =>
        set((s) => ({ security: { ...s.security, bannedIps: s.security.bannedIps.filter((x) => x !== ip) } })),

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
      toggleUserStatus: (id) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u)),
        })),
    }),
    {
      name: 'rabhan-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.view = state.user ? 'home' : 'auth';
          state.adminSection = null;
        }
      },
    }
  )
);
