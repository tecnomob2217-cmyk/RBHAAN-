import React, { useState } from 'react';
import { useAppStore } from '../store';
import ErrorBoundary from '../components/ErrorBoundary';
import SafeIframe from '../components/SafeIframe';
import { Icon, NetworkBadge } from '../components/icons';

function buildWallUrl(network, uid) {
  const base = network.baseUrl?.trim();
  if (!base) return null;
  const params = new URLSearchParams({
    app_id: network.appId || '',
    api_key: network.apiKey || '',
    ext_user_id: String(uid),
  });
  return `${base}${base.includes('?') ? '&' : '?'}${params.toString()}`;
}

export default function OffersScreen({ t }) {
  const user = useAppStore((s) => s.user);
  const setView = useAppStore((s) => s.setView);
  const addTransaction = useAppStore((s) => s.addTransaction);
  const offerNetworks = useAppStore((s) => s.offerNetworks);
  const enabledNetworks = offerNetworks.filter((n) => n.enabled && n.baseUrl?.trim());
  const [activeId, setActiveId] = useState(null);

  const active = enabledNetworks.find((n) => n.id === activeId);
  const wallUrl = active ? buildWallUrl(active, user?.id ?? 'guest') : null;

  const simulateReward = () =>
    addTransaction({ label: active?.name ?? 'عرض', source: active?.id ?? 'test', status: 'earned', amount: 2.5, date: new Date().toLocaleString('ar-SA') });

  return (
    <div className="fade-in mx-auto max-w-md px-4 pb-28 pt-6">
      <button
        onClick={() => (active ? setActiveId(null) : setView('home'))}
        className="mb-3 flex items-center gap-1 text-sm font-bold text-muted"
      >
        <span className="inline-block rotate-180">{Icon.chevron}</span> {t('back')}
      </button>
      <h1 className="mb-1 text-xl font-black">{t('offers')}</h1>
      <p className="mb-4 text-sm text-muted">أكمل الاستطلاعات واكسب المكافآت فوراً</p>

      {!active && (
        <>
          {enabledNetworks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-6 text-center">
              <p className="mb-1 text-sm font-bold">لا توجد شبكات عروض مفعّلة حالياً</p>
              <p className="text-xs text-muted">
                فعّل شبكة (مثل CPALead أو TheoremReach) وأدخل مفاتيحها من لوحة الإدارة ← «شبكات العروض»
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {enabledNetworks.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setActiveId(n.id)}
                  className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-right shadow-soft active:scale-[0.98] transition"
                >
                  <NetworkBadge name={n.name} />
                  <div className="flex-1">
                    <p className="font-bold">{n.name}</p>
                    <p className="text-xs text-muted">اضغط لفتح عروض هذه الشبكة</p>
                  </div>
                  <span className="text-muted">{Icon.chevron}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {active && wallUrl && (
        <>
          <ErrorBoundary>
            <SafeIframe src={wallUrl} title={active.name} height={560} onLoaded={() => console.log(`[Rabhan] ${active.name} loaded`)} />
          </ErrorBoundary>

          <button
            onClick={simulateReward}
            className="mt-4 w-full rounded-2xl border border-dashed border-primary/40 bg-emerald-50 py-3 text-sm font-bold text-primary"
          >
            محاكاة: إتمام عرض ومكافأة +2.50 ر.س (للاختبار فقط)
          </button>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-semibold leading-relaxed text-amber-700">
            ⚠️ زر "المحاكاة" أعلاه للاختبار فقط. بالإنتاج الفعلي، الرصيد يُضاف تلقائياً عبر رابط Postback ترسله الشبكة لسيرفرك (راجع قسم «التكاملات & Postbacks» بلوحة الإدارة).
          </div>
        </>
      )}
    </div>
  );
}
