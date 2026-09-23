import React from 'react';
import { useAppStore } from '../store';
import { Icon, NetworkBadge } from '../components/icons';

export default function HomeScreen({ t }) {
  const user = useAppStore((s) => s.user);
  const balance = useAppStore((s) => s.balance);
  const dailyClaimed = useAppStore((s) => s.dailyClaimed);
  const claimDailyBonus = useAppStore((s) => s.claimDailyBonus);
  const offers = useAppStore((s) => s.offers);
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="fade-in mx-auto max-w-md px-4 pb-28 pt-6">
      <h1 className="mb-0.5 text-xl font-black">
        مرحباً، <span className="text-primary">{user?.name}</span> 👋
      </h1>
      <p className="mb-5 text-sm text-muted">أكمل الاستطلاعات واسحب أرباحك بكل سهولة</p>

      {/* بطاقة الرصيد */}
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

      {/* سجل الاستطلاعات + سحب الأرباح */}
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

      {/* مكافأة الحضور اليومي */}
      <div className="mb-6 flex items-center justify-between rounded-3xl bg-gradient-to-l from-emerald-600 to-emerald-500 p-4 text-white shadow-soft">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20">{Icon.gift}</span>
          <div>
            <p className="text-sm font-bold">{t('dailyBonus')}</p>
            <p className="text-xs opacity-90">+0.25 ر.س · سلسلة 1</p>
          </div>
        </div>
        <button
          onClick={claimDailyBonus}
          disabled={dailyClaimed}
          className="rounded-full bg-white px-5 py-2 text-sm font-bold text-primary disabled:opacity-60 active:scale-95 transition"
        >
          {dailyClaimed ? t('claimed') : t('claim')}
        </button>
      </div>

      {/* الاستطلاعات والعروض المتاحة */}
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
