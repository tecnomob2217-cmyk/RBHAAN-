import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Icon } from '../components/icons';

const SECTIONS = [
  { key: 'users', title: 'إدارة المستخدمين', sub: '217 مستخدم', icon: Icon.users, bg: 'bg-indigo-500' },
  { key: 'analytics', title: 'لوحة التحليلات', sub: 'DAU: 0 · إتمام: 81%', icon: Icon.chart, bg: 'bg-amber-500' },
  { key: 'finance', title: 'النظام المالي', sub: 'الحد الأدنى للسحب · معدل النقاط', icon: Icon.wallet, bg: 'bg-emerald-500' },
  { key: 'security', title: 'الأمان ومكافحة الاحتيال', sub: 'كشف VPN · حظر تلقائي · قائمة IP', icon: Icon.shield, bg: 'bg-red-500' },
  { key: 'rewards', title: 'المكافآت والإحالات', sub: 'مكافأة يومية · نظام الإحالة', icon: Icon.gift, bg: 'bg-amber-500' },
  { key: 'offerNetworks', title: 'شبكات العروض', sub: 'إضافة مزوّدين · CPALead · TheoremReach', icon: '💠', bg: 'bg-sky-500' },
  { key: 'branding', title: 'الألوان والهوية', sub: 'الأسماء · الألوان · الوضع الداكن', icon: '🎨', bg: 'bg-pink-500' },
  { key: 'homeLayout', title: 'تخطيط الصفحة الرئيسية', sub: 'إظهار/إخفاء وترتيب الأقسام', icon: '▦', bg: 'bg-teal-500' },
  { key: 'support', title: 'تذاكر الدعم', sub: 'استلم واقرأ ورد على شكاوى المستخدمين', icon: '💬', bg: 'bg-cyan-600' },
  { key: 'welcome', title: 'اختبار الترحيب', sub: 'أسئلة مكافحة الحظر قبل الاستخدام', icon: '✅', bg: 'bg-orange-500' },
  { key: 'broadcast', title: 'إشعارات جماعية', sub: 'أرسل إشعاراً فورياً لجميع المستخدمين', icon: '🔔', bg: 'bg-orange-500' },
  { key: 'legal', title: 'الصفحات القانونية', sub: 'الشروط · الخصوصية · من نحن', icon: '📄', bg: 'bg-violet-500' },
  { key: 'integrations', title: 'التكاملات & Postbacks', sub: 'PayPal · TheoremReach · CPALead', icon: '🔁', bg: 'bg-pink-600' },
  { key: 'withdrawRequests', title: 'طلبات السحب', sub: 'معلق: 0 · قيد المعالجة: 0', icon: '💳', bg: 'bg-blue-500' },
];

/* ---- الأقسام الفرعية ---- */

function Users() {
  const users = useAppStore((s) => s.users);
  const [query, setQuery] = useState('');
  const filtered = users.filter((u) => u.name.includes(query) || u.email.includes(query)).slice(0, 30);
  return (
    <Section title="إدارة المستخدمين" sub={`${users.length} مستخدم`}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث بالاسم أو البريد..."
        className="mb-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary" />
      <div className="space-y-2">
        {filtered.map((u) => (
          <div key={u.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-50 font-black text-indigo-500">{u.id}</span>
            <div className="flex-1">
              <p className="text-sm font-bold">{u.name}</p>
              <p className="text-xs text-muted" dir="ltr">{u.email}</p>
            </div>
            <span className="text-xs font-black text-primary">{u.balance.toFixed(2)} ر.س</span>
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
              {u.status === 'active' ? 'نشط' : 'محظور'}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Analytics() {
  const stats = useAppStore((s) => s.adminStats);
  const items = [
    { label: 'إجمالي المستخدمين', value: stats.totalUsers },
    { label: 'المستخدمون النشطون يومياً (DAU)', value: stats.dau },
    { label: 'معدل الإتمام', value: stats.retention },
  ];
  return (
    <Section title="لوحة التحليلات" sub="DAU: 0 · إتمام: 81%">
      <div className="grid grid-cols-3 gap-2">
        {items.map((it) => (
          <div key={it.label} className="rounded-2xl bg-white p-3 text-center shadow-soft">
            <p className="text-2xl font-black text-primary">{it.value}</p>
            <p className="mt-1 text-[10px] font-semibold text-muted">{it.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid h-36 place-items-center rounded-2xl border border-dashed border-gray-300 bg-white text-xs text-muted">
        رسم بياني للإيرادات والنشاط (يتصل بـ Analytics API)
      </div>
    </Section>
  );
}

function Finance() {
  return (
    <Section title="النظام المالي" sub="الحد الأدنى للسحب · معدل النقاط">
      {[['الحد الأدنى لسحب PayPal', '3.00 ر.س'], ['سعر البطاقة (شحن رصيد)', '20.60 ر.س'], ['شدات ببجي / جواهر', '11.25 ر.س'], ['مكافأة الحضور اليومي', '0.25 ر.س']]
        .map(([k, v]) => (
          <div key={k} className="mb-2 flex items-center justify-between rounded-2xl bg-white p-4 shadow-soft">
            <span className="text-sm font-semibold">{k}</span>
            <span className="font-black text-primary">{v}</span>
          </div>
        ))}
    </Section>
  );
}

function Security() {
  const [vpn, setVpn] = useState(true);
  const [autoBan, setAutoBan] = useState(true);
  const Toggle = ({ on, onClick }) => (
    <button onClick={onClick} className={`h-7 w-12 rounded-full p-1 transition ${on ? 'bg-primary' : 'bg-gray-300'}`}>
      <span className={`block h-5 w-5 rounded-full bg-white transition ${on ? '-translate-x-5' : ''}`} />
    </button>
  );
  return (
    <Section title="الأمان ومكافحة الاحتيال" sub="كشف VPN · حظر تلقائي · قائمة IP">
      {[['كشف VPN وحظر المحاكيات', vpn, setVpn], ['الحظر التلقائي عند الغش', autoBan, setAutoBan]].map(([label, val, setter]) => (
        <div key={label} className="mb-2 flex items-center justify-between rounded-2xl bg-white p-4 shadow-soft">
          <span className="text-sm font-semibold">{label}</span>
          <Toggle on={val} onClick={() => setter(!val)} />
        </div>
      ))}
      <button className="mt-2 w-full rounded-2xl border border-red-200 bg-red-50 py-3 text-sm font-bold text-red-500">
        إدارة قائمة IP المحظورة
      </button>
    </Section>
  );
}

function Placeholder({ title, sub }) {
  return (
    <Section title={title} sub={sub}>
      <div className="grid h-40 place-items-center rounded-2xl border border-dashed border-gray-300 bg-white p-4 text-center text-xs text-muted">
        قسم «{title}» — واجهة جاهزة للربط مع الـ Backend (نموذج أولي)
      </div>
    </Section>
  );
}

function Section({ title, sub, children }) {
  return (
    <div className="fade-in mx-auto max-w-md px-4 pb-28 pt-6">
      <h1 className="mb-0.5 text-xl font-black">{title}</h1>
      <p className="mb-5 text-sm text-muted">{sub}</p>
      {children}
    </div>
  );
}

const SUBVIEWS = {
  users: <Users />,
  analytics: <Analytics />,
  finance: <Finance />,
  security: <Security />,
  rewards: <Placeholder title="المكافآت والإحالات" sub="مكافأة يومية · نظام الإحالة" />,
  offerNetworks: <Placeholder title="شبكات العروض" sub="إضافة مزوّدين · CPALead · TheoremReach" />,
  branding: <Placeholder title="الألوان والهوية" sub="الأسماء · الألوان · الوضع الداكن" />,
  homeLayout: <Placeholder title="تخطيط الصفحة الرئيسية" sub="إظهار/إخفاء وترتيب الأقسام" />,
  support: <Placeholder title="تذاكر الدعم" sub="استلم واقرأ ورد على شكاوى المستخدمين" />,
  welcome: <Placeholder title="اختبار الترحيب" sub="أسئلة مكافحة الحظر قبل الاستخدام" />,
  broadcast: <Placeholder title="إشعارات جماعية" sub="أرسل إشعاراً فورياً لجميع المستخدمين" />,
  legal: <Placeholder title="الصفحات القانونية" sub="الشروط · الخصوصية · من نحن" />,
  integrations: <Placeholder title="التكاملات & Postbacks" sub="PayPal · TheoremReach · CPALead" />,
  withdrawRequests: <Placeholder title="طلبات السحب" sub="معلق: 0 · قيد المعالجة: 0" />,
};

export default function AdminScreen({ t }) {
  const user = useAppStore((s) => s.user);
  const section = useAppStore((s) => s.adminSection);
  const setAdminSection = useAppStore((s) => s.setAdminSection);

  if (section && SUBVIEWS[section]) {
    return (
      <div>
        <div className="mx-auto max-w-md px-4 pt-4">
          <button onClick={() => setAdminSection(null)} className="flex items-center gap-1 text-sm font-bold text-muted">
            <span className="rotate-180 inline-block">{Icon.chevron}</span> {t('back')}
          </button>
        </div>
        {SUBVIEWS[section]}
      </div>
    );
  }

  return (
    <div className="fade-in mx-auto max-w-md px-4 pb-28 pt-6">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-xl font-black">لوحة الإدارة</h1>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500 text-white">{Icon.shield}</span>
      </div>
      <p className="mb-5 text-sm text-muted">{t('welcomeAdmin')}، {user?.name}</p>

      <div className="space-y-2.5">
        {SECTIONS.map((s) => (
          <button key={s.key} onClick={() => setAdminSection(s.key)}
            className="flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-right shadow-soft active:scale-[0.98] transition">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl text-white ${s.bg}`}>{s.icon}</span>
            <div className="flex-1">
              <p className="font-bold">{s.title}</p>
              <p className="text-xs text-muted">{s.sub}</p>
            </div>
            <span className="text-muted">{Icon.chevron}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
