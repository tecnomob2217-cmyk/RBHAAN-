import React from 'react';
import { useAppStore } from '../store';
import { Icon } from '../components/icons';

function Card({ icon, title, subtitle, onClick, danger }) {
  return (
    <button onClick={onClick}
      className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-right shadow-soft active:scale-[0.98] transition">
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${danger ? 'bg-red-50 text-red-500' : 'bg-sky-50 text-sky-500'}`}>{icon}</span>
      <div className="flex-1">
        <p className={`font-bold ${danger ? 'text-red-500' : ''}`}>{title}</p>
        {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      </div>
      <span className="text-muted">{Icon.chevron}</span>
    </button>
  );
}

export default function AccountScreen({ t }) {
  const user = useAppStore((s) => s.user);
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const setView = useAppStore((s) => s.setView);
  const logout = useAppStore((s) => s.logout);

  return (
    <div className="fade-in mx-auto max-w-md px-4 pb-28 pt-6">
      <p className="mb-0.5 text-xs font-bold text-muted">⚙️ {t('adminPanel')}</p>
      <h1 className="mb-5 text-xl font-black">{t('account')}</h1>

      <div className="mb-5 flex items-center gap-3 rounded-3xl bg-white p-4 shadow-soft">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-2xl font-black text-white">R</span>
        <div>
          <p className="font-black">{user?.name}</p>
          <p className="text-xs text-muted" dir="ltr">{user?.email}</p>
          <span className="mt-1 inline-block rounded-full bg-primary px-3 py-0.5 text-[10px] font-black tracking-wide text-white">ADMIN</span>
        </div>
      </div>

      <p className="mb-2 text-sm font-bold text-muted">{t('settings')}</p>
      <div className="mb-3 flex items-center justify-between rounded-3xl bg-white p-4 shadow-soft">
        <span className="flex items-center gap-2 text-sm font-bold">🌐 {t('language')}</span>
        <div className="flex gap-1 rounded-full bg-surface p-1">
          {['ar', 'en'].map((l) => (
            <button key={l} onClick={() => setLang(l)}
              className={`rounded-full px-4 py-1 text-xs font-bold transition ${lang === l ? 'bg-primary text-white' : 'text-muted'}`}>
              {l === 'ar' ? 'العربية' : 'English'}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-2 text-sm font-bold text-muted">{t('techSupport')}</p>
      <div className="space-y-2.5">
        <Card icon="💬" title={t('supportTickets')} subtitle={t('openTicket')} />
        <Card icon={<span className="text-xl">✈️</span>} title={t('telegram')} subtitle={t('telegramSub')}
          onClick={() => window.open('https://t.me/rabhan', '_blank')} />
      </div>

      <p className="mb-2 mt-5 text-sm font-bold text-muted">{t('account')}</p>
      <div className="space-y-2.5">
        <Card icon="⚙️" title={t('adminPanel')} onClick={() => { setView('admin'); }} />
        <Card icon="↪️" title={t('logout')} danger onClick={logout} />
      </div>
    </div>
  );
}
