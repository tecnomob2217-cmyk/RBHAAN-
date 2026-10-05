import React from 'react';
import { useAppStore } from '../store';

function Row({ tx }) {
  const ok = tx.status === 'earned';
  return (
    <div className="flex items-center gap-3 rounded-3xl bg-white p-4 shadow-soft">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg font-black ${ok ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
        {ok ? '✓' : '✕'}
      </span>
      <div className="flex-1">
        <p className="font-bold">{tx.label}</p>
        <p className="text-xs text-muted" dir="ltr">{tx.date}</p>
        {ok && <p className="mt-0.5 text-sm font-black text-primary">+{tx.amount.toFixed(2)} ر.س</p>}
      </div>
      <span className={`rounded-full px-4 py-1.5 text-xs font-bold text-white ${ok ? 'bg-green-500' : 'bg-red-500'}`}>
        {ok ? 'ربح' : 'طرد'}
      </span>
    </div>
  );
}

export default function HistoryScreen({ t }) {
  const transactions = useAppStore((s) => s.transactions);
  return (
    <div className="fade-in mx-auto max-w-md px-4 pb-28 pt-6">
      <h1 className="mb-0.5 text-xl font-black">{t('surveysLog')}</h1>
      <p className="mb-5 text-sm text-muted">كل محاولات الاستطلاعات وحالاتها</p>
      <div className="space-y-2.5">
        {transactions.map((tx) => <Row key={tx.id} tx={tx} />)}
      </div>
    </div>
  );
}
