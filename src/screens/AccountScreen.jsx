import React, { useState } from 'react';
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

function MyTickets({ onBack }) {
  const user = useAppStore((s) => s.user);
  const tickets = useAppStore((s) => s.tickets).filter((t) => t.userId === user?.id);
  const createTicket = useAppStore((s) => s.createTicket);
  const replyTicket = useAppStore((s) => s.replyTicket);
  const [openId, setOpenId] = useState(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const open = tickets.find((t) => t.id === openId);

  if (open) {
    return (
      <div className="fade-in mx-auto max-w-md px-4 pb-28 pt-6">
        <button onClick={() => setOpenId(null)} className="mb-3 text-sm font-bold text-muted">‹ رجوع</button>
        <h1 className="mb-1 text-xl font-black">{open.subject}</h1>
        <div className="mt-4 space-y-2">
          {open.messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] rounded-2xl p-3 text-sm ${m.from === 'user' ? 'mr-auto bg-primary text-white' : 'ml-auto bg-white shadow-soft'}`}>
              {m.text}
              <p className="mt-1 text-[10px] opacity-70" dir="ltr">{m.date}</p>
            </div>
          ))}
        </div>
        {open.status !== 'closed' ? (
          <div className="mt-4 flex gap-2">
            <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="اكتب رداً..."
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary" />
            <button
              onClick={() => { if (reply.trim()) { replyTicket(open.id, reply.trim(), 'user'); setReply(''); } }}
              className="shrink-0 rounded-2xl bg-primary px-5 text-sm font-bold text-white">
              إرسال
            </button>
          </div>
        ) : (
          <p className="mt-4 text-center text-xs text-muted">تم إغلاق هذه التذكرة</p>
        )}
      </div>
    );
  }

  return (
    <div className="fade-in mx-auto max-w-md px-4 pb-28 pt-6">
      <button onClick={onBack} className="mb-3 text-sm font-bold text-muted">‹ رجوع للحساب</button>
      <h1 className="mb-5 text-xl font-black">تذاكر الدعم</h1>

      <div className="mb-5 space-y-2 rounded-3xl bg-white p-4 shadow-soft">
        <p className="text-sm font-bold">فتح تذكرة جديدة</p>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="الموضوع"
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary" />
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="اشرح مشكلتك بالتفصيل..." rows={3}
          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary" />
        <button
          onClick={() => { if (subject.trim() && message.trim()) { createTicket(subject.trim(), message.trim()); setSubject(''); setMessage(''); } }}
          className="w-full rounded-2xl bg-primary py-3 text-sm font-bold text-white">
          إرسال التذكرة
        </button>
      </div>

      <p className="mb-2 text-sm font-bold text-muted">تذاكرك السابقة</p>
      <div className="space-y-2">
        {tickets.length === 0 && <p className="py-4 text-center text-xs text-muted">لا توجد تذاكر بعد</p>}
        {tickets.map((tkt) => (
          <button key={tkt.id} onClick={() => setOpenId(tkt.id)} className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-right shadow-soft">
            <div className="flex-1">
              <p className="text-sm font-bold">{tkt.subject}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${
              tkt.status === 'open' ? 'bg-amber-50 text-amber-600' : tkt.status === 'answered' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-muted'
            }`}>
              {tkt.status === 'open' ? 'بانتظار الرد' : tkt.status === 'answered' ? 'تم الرد' : 'مغلقة'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function LegalPage({ title, text, onBack }) {
  return (
    <div className="fade-in mx-auto max-w-md px-4 pb-28 pt-6">
      <button onClick={onBack} className="mb-3 text-sm font-bold text-muted">‹ رجوع</button>
      <h1 className="mb-4 text-xl font-black">{title}</h1>
      <div className="whitespace-pre-wrap rounded-3xl bg-white p-4 text-sm leading-7 shadow-soft">{text}</div>
    </div>
  );
}

export default function AccountScreen({ t }) {
  const user = useAppStore((s) => s.user);
  const lang = useAppStore((s) => s.lang);
  const setLang = useAppStore((s) => s.setLang);
  const setView = useAppStore((s) => s.setView);
  const logout = useAppStore((s) => s.logout);
  const legalPages = useAppStore((s) => s.legalPages);
  const settings = useAppStore((s) => s.settings);
  const [sub, setSub] = useState(null);

  const isAdmin = user?.role === 'admin';

  if (sub === 'tickets') return <MyTickets onBack={() => setSub(null)} />;
  if (sub === 'terms') return <LegalPage title="الشروط والأحكام" text={legalPages.terms} onBack={() => setSub(null)} />;
  if (sub === 'privacy') return <LegalPage title="سياسة الخصوصية" text={legalPages.privacy} onBack={() => setSub(null)} />;
  if (sub === 'about') return <LegalPage title="من نحن" text={legalPages.about} onBack={() => setSub(null)} />;

  const referralLink = `https://t.me/rabhan_bot?start=ref_${user?.id ?? ''}`;

  return (
    <div className="fade-in mx-auto max-w-md px-4 pb-28 pt-6">
      <h1 className="mb-5 text-xl font-black">{t('account')}</h1>

      <div className="mb-5 flex items-center gap-3 rounded-3xl bg-white p-4 shadow-soft">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-2xl font-black text-white">
          {user?.name?.[0]?.toUpperCase() ?? 'R'}
        </span>
        <div>
          <p className="font-black">{user?.name}</p>
          <p className="text-xs text-muted" dir="ltr">{user?.email}</p>
          {isAdmin && (
            <span className="mt-1 inline-block rounded-full bg-primary px-3 py-0.5 text-[10px] font-black tracking-wide text-white">ADMIN</span>
          )}
        </div>
      </div>

      <p className="mb-2 text-sm font-bold text-muted">دعوة الأصدقاء</p>
      <div className="mb-5 rounded-3xl bg-white p-4 shadow-soft">
        <p className="mb-2 text-xs text-muted">اربح {settings.referralBonus.toFixed(2)} ر.س عن كل صديق ينضم برابطك</p>
        <div className="flex items-center gap-2 rounded-2xl bg-surface p-2">
          <span className="flex-1 truncate text-xs" dir="ltr">{referralLink}</span>
          <button onClick={() => navigator.clipboard?.writeText(referralLink)} className="shrink-0 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-white">نسخ</button>
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
        <Card icon="💬" title={t('supportTickets')} subtitle={t('openTicket')} onClick={() => setSub('tickets')} />
        <Card icon={<span className="text-xl">✈️</span>} title={t('telegram')} subtitle={t('telegramSub')}
          onClick={() => window.open('https://t.me/rabhan', '_blank')} />
      </div>

      <p className="mb-2 mt-5 text-sm font-bold text-muted">الصفحات القانونية</p>
      <div className="space-y-2.5">
        <Card icon="📄" title="الشروط والأحكام" onClick={() => setSub('terms')} />
        <Card icon="🔒" title="سياسة الخصوصية" onClick={() => setSub('privacy')} />
        <Card icon="ℹ️" title="من نحن" onClick={() => setSub('about')} />
      </div>

      <p className="mb-2 mt-5 text-sm font-bold text-muted">{t('account')}</p>
      <div className="space-y-2.5">
        {isAdmin && (
          <Card icon="⚙️" title={t('adminPanel')} onClick={() => setView('admin')} />
        )}
        <Card icon="↪️" title={t('logout')} danger onClick={logout} />
      </div>
    </div>
  );
    }
