import React from 'react';
import { useAppStore } from '../store';
import { Icon, NetworkBadge } from '../components/icons';

function BalanceCard({ t, balance }) {
  return (
    <div className="mb-4 rounded-3xl bg-gradient-to-l from-emerald-600 to-emerald-500 p-5 text-white shadow-soft">
      <div className="mb-2 flex items-center gap-2 opacity-90">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20">{Icon.wallet}</span>
        <span className="text-sm font-semibold">{t('balance')}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-5xl font-black tracking-tight">{balance.toFixed(2)}</span>
        <span className="pb-1.5 text-sm font-semibold opacity-90">ر.س</span>
      </div>
    </div>
  );
}

function QuickActions({ t, setView }) {
  return (
    <div className="mb-4 grid grid-cols-2 gap-3">
      <button onClick={() => setView('history')}
        className="flex flex-col items-center gap-2 rounded-3xl bg-white p-5 shadow-soft active:scale-[0.98] transition">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-emerald-50 text-primary">{Icon.clock}</span>
        <span className="text-sm font-bold">{t('surveysLog')}</span>
      </button>
      <button onClick={() => setView('withdraw')}
        className="flex flex-col items-center gap-2 rounded-3xl bg-white p-5 shadow-soft active:scale-[0.98] transition">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-amber-50 text-amber-500">{Icon.cash}</span>
        <span className="text-sm font-bold">{t('withdraw')}</span>
      </button>
    </div>
  );
}

function DailyBonus({ t, dailyClaimed, claimDailyBonus, amount }) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-3xl bg-gradient-to-l from-emerald-600 to-emerald-500 p-4 text-white shadow-soft">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20">{Icon.gift}</span>
        <div>
          <p className="text-sm font-bold">{t('dailyBonus')}</p>
          <p className="text-xs opacity-90">+{amount.toFixed(2)} ر.س · سلسلة 1</p>
        </div>
      </div>
      <button
        onClick={claimDailyBonus}
        disabled={dailyClaimed}
        className="rounded-full bg-white px-5 py-2 text-sm font-bold text-primary transition active:scale-95 disabled:opacity-60"
      >
        {dailyClaimed ? t('claimed') : t('claim')}
      </button>
    </div>
  );
}

function OffersList({ t, offers, setView }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black">{t('liveOffers')}</h2>
        <span className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> {t('live')}
        </span>
      </div>
      <div className="mb-3 flex gap-2">
        <span className="rounded-full bg-primary px-5 py-1.5 text-xs font-bold text-white">{t('all')}</span>
        <span className="rounded-full bg-white px-5 py-1.5 text-xs font-bold text-muted shadow-soft">{t('surveys')}</span>
      </div>
      <div className="space-y-2.5">
        {offers.map((offer, i) => (
          <button key={`${offer.id}-${i}`} onClick={() => setView('offers')}
            className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-right shadow-soft active:scale-[0.98] transition">
            <NetworkBadge name={offer.name} />
            <div className="flex-1">
              <p className="font-bold">{offer.name}</p>
              <p className="text-xs text-muted">{t('surveys')}</p>
            </div>
            <span className="text-sm font-black text-primary">+{offer.payout.toFixed(2)} ر.س</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function HomeScreen({ t }) {
  const user = useAppStore((s) => s.user);
  const balance = useAppStore((s) => s.balance);
  const dailyClaimed = useAppStore((s) => s.dailyClaimed);
  const claimDailyBonus = useAppStore((s) => s.claimDailyBonus);
  const offers = useAppStore((s) => s.offers);
  const setView = useAppStore((s) => s.setView);
  const homeLayout = useAppStore((s) => s.homeLayout);
  const settings = useAppStore((s) => s.settings);
  const broadcasts = useAppStore((s) => s.broadcasts);
  const lastSeenBroadcastId = useAppStore((s) => s.lastSeenBroadcastId);
  const markBroadcastsSeen = useAppStore((s) => s.markBroadcastsSeen);

  const latest = broadcasts[0];
  const hasUnseen = latest && latest.id !== lastSeenBroadcastId;

  const sections = {
    balance: <BalanceCard t={t} balance={balance} />,
    actions: <QuickActions t={t} setView={setView} />,
    dailyBonus: <DailyBonus t={t} dailyClaimed={dailyClaimed} claimDailyBonus={claimDailyBonus} amount={settings.dailyBonusAmount} />,
    offers: <OffersList t={t} offers={offers} setView={setView} />,
  };

  return (
    <div className="fade-in mx-auto max-w-md px-4 pb-28 pt-6">
      <h1 className="mb-0.5 text-xl font-black">
        مرحباً، <span className="text-primary">{user?.name}</span> 👋
      </h1>
      <p className="mb-5 text-sm text-muted">أكمل الاستطلاعات واسحب أرباحك بكل سهولة</p>

      {hasUnseen && (
        <button
          onClick={markBroadcastsSeen}
          className="mb-4 flex w-full items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-right text-xs font-semibold text-amber-700"
        >
          <span>🔔</span>
          <span className="flex-1">{latest.text}</span>
          <span className="shrink-0 text-[10px] opacity-70">إخفاء</span>
        </button>
      )}

      {homeLayout.filter((sec) => sec.visible).map((sec) => (
        <div key={sec.key} className="[&:not(:last-child)]:mb-0">{sections[sec.key]}</div>
      ))}
    </div>
  );
}
