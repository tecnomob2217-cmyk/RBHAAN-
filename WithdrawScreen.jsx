import React, { useState } from 'react';
import { useAppStore } from '../store';

function StatusBadge({ status }) {
  const map = {
    approved: { cls: 'bg-amber-50 text-amber-600', label: 'قيد المعالجة' },
    suspended: { cls: 'bg-red-50 text-red-500', label: 'معلق' },
    paid: { cls: 'bg-emerald-50 text-emerald-600', label: 'مدفوع' },
  };
  const s = map[status] ?? map.approved;
  return <span className={`rounded-full px-4 py-1.5 text-xs font-bold ${s.cls}`}>{s.label}</span>;
}

export default function WithdrawScreen({ t }) {
  const balance = useAppStore((s) => s.balance);
  const methods = useAppStore((s) => s.withdrawMethods);
  const requests = useAppStore((s) => s.withdrawRequests);
  const requestWithdrawal = useAppStore((s) => s.requestWithdrawal);
  const [message, setMessage] = useState(null);

  const handleRequest = (id) => {
    const res = requestWithdrawal(id);
    setMessage(res.ok ? { ok: true, text: 'تم إرسال طلب السحب بنجاح' } : { ok: false, text: 'رصيدك الحالي لا يكفي لهذه الطريقة' });
    setTimeout(() => setMessage(null), 3000);
  };

  const icons = {
    paypal: <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-xl font-black text-sky-600">P</span>,
    topup: <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-50 text-xl">📱</span>,
    game: <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-xl">🎮</span>,
  };

  return (
    <div className="fade-in mx-auto max-w-md px-4 pb-28 pt-6">
      <h1 className="mb-0.5 text-xl font-black">{t('withdrawTitle')}</h1>
      <p className="mb-4 text-sm text-muted">رصيدك الحالي: <span className="font-black text-primary">{balance.toFixed(2)} ر.س</span></p>

      <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-semibold text-amber-700">
        ℹ️ {t('processingNote')}
      </div>

      {message && (
        <div className={`mb-4 rounded-2xl p-3 text-center text-sm font-bold ${message.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-3">
        {methods.map((m) => (
          <div key={m.id} className="rounded-3xl bg-white p-4 shadow-soft">
            <div className="flex items-center gap-3">
              {icons[m.icon]}
              <div className="flex-1">
                <p className="font-bold">{t(m.titleKey)}</p>
                <p className="text-xs text-muted">{t(m.subtitleKey)}</p>
                <p className="mt-1 text-sm">الرصيد المطلوب: <span className="font-black text-primary">{m.min.toFixed(2)} ر.س</span></p>
              </div>
              <button onClick={() => handleRequest(m.id)}
                className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-white active:scale-95 transition disabled:opacity-50"
                disabled={balance < m.min}>
                {t('withdraw')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-7 text-lg font-black">{t('withdrawLog')}</h2>
      <div className="space-y-2.5">
        {requests.map((r) => (
          <div key={r.id} className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-soft">
            <div className="flex-1">
              <p className="font-bold">{r.method}</p>
              <p className="text-xs text-muted">{r.date}</p>
            </div>
            <span className="text-sm font-black text-primary">{r.amount.toFixed(2)} ر.س</span>
            <StatusBadge status={r.status} />
          </div>
        ))}
        {requests.length === 0 && (
          <p className="py-6 text-center text-sm text-muted">لا توجد طلبات سحب بعد</p>
        )}
      </div>
    </div>
  );
}
