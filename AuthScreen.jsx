import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Icon } from '../components/icons';

export default function AuthScreen({ t }) {
  const login = useAppStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e?.preventDefault();
    login({ id: 1, name: 'Rabhan Admin', email: email || 'admin@rabhan.app', role: 'admin' });
  };

  return (
    <div className="fade-in flex min-h-screen flex-col items-center justify-center bg-surface px-6 pb-10">
      <div className="mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-b from-emerald-500 to-amber-500 text-4xl font-black text-white shadow-soft">
        R
      </div>
      <h1 className="mb-1 text-3xl font-black">ربحان</h1>
      <p className="mb-8 text-muted">اربح مكافآت حقيقية من جوالك</p>

      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <label className="block text-sm font-semibold text-muted">{t('email')}</label>
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" dir="ltr"
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-left outline-none focus:border-primary"
        />
        <label className="block text-sm font-semibold text-muted">{t('password')}</label>
        <input
          type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" dir="ltr"
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-left outline-none focus:border-primary"
        />
        <button type="submit" className="w-full rounded-2xl bg-primary py-3.5 font-bold text-white shadow-soft active:scale-[0.98] transition">
          {t('login')}
        </button>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-muted">أو تابع باستخدام</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button type="button" onClick={() => handleLogin()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3.5 font-bold active:scale-[0.98] transition">
          {Icon.google} {t('googleLogin')}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        {t('noAccount')}{' '}
        <button className="font-bold text-primary">{t('createAccount')}</button>
      </p>
    </div>
  );
}
