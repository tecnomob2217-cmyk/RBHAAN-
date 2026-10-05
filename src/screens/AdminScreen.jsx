import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Icon } from '../components/icons';

const SECTIONS = [
  { key: 'users', title: 'إدارة المستخدمين', icon: Icon.users, bg: 'bg-indigo-500' },
  { key: 'analytics', title: 'لوحة التحليلات', icon: Icon.chart, bg: 'bg-amber-500' },
  { key: 'finance', title: 'النظام المالي', icon: Icon.wallet, bg: 'bg-emerald-500' },
  { key: 'security', title: 'الأمان ومكافحة الاحتيال', icon: Icon.shield, bg: 'bg-red-500' },
  { key: 'rewards', title: 'المكافآت والإحالات', icon: Icon.gift, bg: 'bg-amber-500' },
  { key: 'offerNetworks', title: 'شبكات العروض', icon: '💠', bg: 'bg-sky-500' },
  { key: 'branding', title: 'الألوان والهوية', icon: '🎨', bg: 'bg-pink-500' },
  { key: 'homeLayout', title: 'تخطيط الصفحة الرئيسية', icon: '▦', bg: 'bg-teal-500' },
  { key: 'support', title: 'تذاكر الدعم', icon: '💬', bg: 'bg-cyan-600' },
  { key: 'welcome', title: 'اختبار الترحيب', icon: '✅', bg: 'bg-orange-500' },
  { key: 'broadcast', title: 'إشعارات جماعية', icon: '🔔', bg: 'bg-orange-500' },
  { key: 'legal', title: 'الصفحات القانونية', icon: '📄', bg: 'bg-violet-500' },
  { key: 'integrations', title: 'التكاملات & Postbacks', icon: '🔁', bg: 'bg-pink-600' },
  { key: 'withdrawRequests', title: 'طلبات السحب', icon: '💳', bg: 'bg-blue-500' },
];

function Section({ title, sub, children }) {
  return (
    <div className="fade-in mx-auto max-w-md px-4 pb-28 pt-6">
      <h1 className="mb-0.5 text-xl font-black">{title}</h1>
      {sub && <p className="mb-5 text-sm text-muted">{sub}</p>}
      {children}
    </div>
  );
}

const Input = (props) => (
  <input {...props} className={`w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary ${props.className ?? ''}`} />
);
const Textarea = (props) => (
  <textarea {...props} className={`w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary ${props.className ?? ''}`} />
);
const Toggle = ({ on, onClick }) => (
  <button onClick={onClick} className={`h-7 w-12 shrink-0 rounded-full p-1 transition ${on ? 'bg-primary' : 'bg-gray-300'}`}>
    <span className={`block h-5 w-5 rounded-full bg-white transition ${on ? '-translate-x-5' : ''}`} />
  </button>
);
const SaveToast = ({ show }) =>
  show ? <div className="mb-3 rounded-2xl bg-emerald-50 p-3 text-center text-sm font-bold text-emerald-700">تم الحفظ ✓</div> : null;

function useSavedFlash() {
  const [saved, setSaved] = useState(false);
  const flash = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };
  return [saved, flash];
}

function Users() {
  const users = useAppStore((s) => s.users);
  const toggleUserStatus = useAppStore((s) => s.toggleUserStatus);
  const [query, setQuery] = useState('');
  const filtered = users.filter((u) => u.name.includes(query) || u.email.includes(query)).slice(0, 30);
  return (
    <Section title="إدارة المستخدمين" sub={`${users.length} مستخدم`}>
      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="بحث بالاسم أو البريد..." className="mb-3" />
      <div className="space-y-2">
        {filtered.map((u) => (
          <div key={u.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-50 font-black text-indigo-500">{u.id}</span>
            <div className="flex-1">
              <p className="text-sm font-bold">{u.name}</p>
              <p className="text-xs text-muted" dir="ltr">{u.email}</p>
            </div>
            <span className="text-xs font-black text-primary">{u.balance.toFixed(2)} ر.س</span>
            <button
              onClick={() => toggleUserStatus(u.id)}
              className={`rounded-full px-3 py-1 text-[10px] font-bold ${u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}
            >
              {u.status === 'active' ? 'نشط' : 'محظور'}
            </button>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Analytics() {
  const stats = useAppStore((s) => s.adminStats);
  const tickets = useAppStore((s) => s.tickets);
  const withdrawRequests = useAppStore((s) => s.withdrawRequests);
  const pending = withdrawRequests.filter((r) => r.status === 'approved').length;
  const openTickets = tickets.filter((t) => t.status === 'open').length;
  const items = [
    { label: 'إجمالي المستخدمين', value: stats.totalUsers },
    { label: 'طلبات سحب معلّقة', value: pending },
    { label: 'تذاكر دعم مفتوحة', value: openTickets },
  ];
  return (
    <Section title="لوحة التحليلات" sub={`DAU: ${stats.dau} · إتمام: ${stats.retention}`}>
      <div className="grid grid-cols-3 gap-2">
        {items.map((it) => (
          <div key={it.label} className="rounded-2xl bg-white p-3 text-center shadow-soft">
            <p className="text-2xl font-black text-primary">{it.value}</p>
            <p className="mt-1 text-[10px] font-semibold text-muted">{it.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 grid h-36 place-items-center rounded-2xl border border-dashed border-gray-300 bg-white text-xs text-muted">
        رسم بياني للإيرادات والنشاط (يحتاج ربط قاعدة بيانات حقيقية)
      </div>
    </Section>
  );
}

function Finance() {
  const methods = useAppStore((s) => s.withdrawMethods);
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [saved, flash] = useSavedFlash();
  return (
    <Section title="النظام المالي" sub="الحد الأدنى للسحب وقيمة المكافأة اليومية">
      <SaveToast show={saved} />
      {methods.map((m) => (
        <div key={m.id} className="mb-2 flex items-center justify-between rounded-2xl bg-white p-4 shadow-soft">
          <span className="text-sm font-semibold">{m.titleKey}</span>
          <span className="font-black text-primary">{m.min.toFixed(2)} ر.س</span>
        </div>
      ))}
      <div className="mt-4 rounded-2xl bg-white p-4 shadow-soft">
        <label className="mb-1 block text-sm font-semibold">مكافأة الحضور اليومي (ر.س)</label>
        <div className="flex gap-2">
          <Input
            type="number" step="0.05" value={settings.dailyBonusAmount}
            onChange={(e) => updateSettings({ dailyBonusAmount: +e.target.value })}
          />
          <button onClick={flash} className="shrink-0 rounded-2xl bg-primary px-5 text-sm font-bold text-white">حفظ</button>
        </div>
      </div>
    </Section>
  );
}

function Security() {
  const security = useAppStore((s) => s.security);
  const updateSecurity = useAppStore((s) => s.updateSecurity);
  const addBannedIp = useAppStore((s) => s.addBannedIp);
  const removeBannedIp = useAppStore((s) => s.removeBannedIp);
  const [ip, setIp] = useState('');

  return (
    <Section title="الأمان ومكافحة الاحتيال" sub="كشف VPN · حظر تلقائي · قائمة IP">
      <div className="mb-2 flex items-center justify-between rounded-2xl bg-white p-4 shadow-soft">
        <span className="text-sm font-semibold">كشف VPN وحظر المحاكيات</span>
        <Toggle on={security.vpnDetection} onClick={() => updateSecurity({ vpnDetection: !security.vpnDetection })} />
      </div>
      <div className="mb-2 flex items-center justify-between rounded-2xl bg-white p-4 shadow-soft">
        <span className="text-sm font-semibold">الحظر التلقائي عند الغش</span>
        <Toggle on={security.autoBan} onClick={() => updateSecurity({ autoBan: !security.autoBan })} />
      </div>

      <p className="mb-2 mt-4 text-sm font-bold text-muted">قائمة IP المحظورة يدوياً</p>
      <div className="flex gap-2">
        <Input value={ip} onChange={(e) => setIp(e.target.value)} placeholder="مثال: 192.168.1.1" dir="ltr" />
        <button
          onClick={() => { if (ip.trim()) { addBannedIp(ip.trim()); setIp(''); } }}
          className="shrink-0 rounded-2xl bg-primary px-5 text-sm font-bold text-white"
        >
          إضافة
        </button>
      </div>
      <div className="mt-3 space-y-2">
        {security.bannedIps.length === 0 && <p className="text-center text-xs text-muted">لا يوجد عناوين محظورة</p>}
        {security.bannedIps.map((x) => (
          <div key={x} className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-soft">
            <span className="text-sm font-mono" dir="ltr">{x}</span>
            <button onClick={() => removeBannedIp(x)} className="text-xs font-bold text-red-500">حذف</button>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Rewards() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [saved, flash] = useSavedFlash();
  return (
    <Section title="المكافآت والإحالات" sub="مكافأة يومية · نظام الإحالة">
      <SaveToast show={saved} />
      <div className="space-y-3">
        <div className="rounded-2xl bg-white p-4 shadow-soft">
          <label className="mb-1 block text-sm font-semibold">مكافأة الحضور اليومي (ر.س)</label>
          <Input type="number" step="0.05" value={settings.dailyBonusAmount} onChange={(e) => updateSettings({ dailyBonusAmount: +e.target.value })} />
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-soft">
          <label className="mb-1 block text-sm font-semibold">مكافأة إحالة صديق (ر.س)</label>
          <Input type="number" step="0.5" value={settings.referralBonus} onChange={(e) => updateSettings({ referralBonus: +e.target.value })} />
        </div>
        <button onClick={flash} className="w-full rounded-2xl bg-primary py-3 text-sm font-bold text-white">حفظ التغييرات</button>
      </div>
    </Section>
  );
}

function OfferNetworks() {
  const networks = useAppStore((s) => s.offerNetworks);
  const addOfferNetwork = useAppStore((s) => s.addOfferNetwork);
  const updateOfferNetwork = useAppStore((s) => s.updateOfferNetwork);
  const deleteOfferNetwork = useAppStore((s) => s.deleteOfferNetwork);
  const [form, setForm] = useState({ name: '', appId: '', apiKey: '', baseUrl: '' });
  const [saved, flash] = useSavedFlash();

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addOfferNetwork(form);
    setForm({ name: '', appId: '', apiKey: '', baseUrl: '' });
    flash();
  };

  return (
    <Section title="شبكات العروض" sub="أضف مزوّدين مثل CPALead أو TheoremReach واربط مفاتيحهم">
      <SaveToast show={saved} />
      <div className="space-y-2">
        {networks.map((n) => (
          <div key={n.id} className="rounded-2xl bg-white p-4 shadow-soft">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-bold">{n.name}</span>
              <div className="flex items-center gap-2">
                <Toggle on={n.enabled} onClick={() => updateOfferNetwork(n.id, { enabled: !n.enabled })} />
                <button onClick={() => deleteOfferNetwork(n.id)} className="text-xs font-bold text-red-500">حذف</button>
              </div>
            </div>
            <div className="space-y-2">
              <Input placeholder="App ID / Publisher ID" value={n.appId} onChange={(e) => updateOfferNetwork(n.id, { appId: e.target.value })} dir="ltr" />
              <Input placeholder="API Key" value={n.apiKey} onChange={(e) => updateOfferNetwork(n.id, { apiKey: e.target.value })} dir="ltr" />
              <Input placeholder="Base URL" value={n.baseUrl} onChange={(e) => updateOfferNetwork(n.id, { baseUrl: e.target.value })} dir="ltr" />
            </div>
          </div>
        ))}
      </div>

      <p className="mb-2 mt-5 text-sm font-bold text-muted">إضافة شبكة جديدة</p>
      <div className="space-y-2 rounded-2xl bg-white p-4 shadow-soft">
        <Input placeholder="اسم الشبكة" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="App ID / Publisher ID" value={form.appId} onChange={(e) => setForm({ ...form, appId: e.target.value })} dir="ltr" />
        <Input placeholder="API Key" value={form.apiKey} onChange={(e) => setForm({ ...form, apiKey: e.target.value })} dir="ltr" />
        <Input placeholder="Base URL" value={form.baseUrl} onChange={(e) => setForm({ ...form, baseUrl: e.target.value })} dir="ltr" />
        <button onClick={handleAdd} className="w-full rounded-2xl bg-primary py-3 text-sm font-bold text-white">إضافة الشبكة</button>
      </div>
    </Section>
  );
}

const PRESET_COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
function Branding() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [saved, flash] = useSavedFlash();
  return (
    <Section title="الألوان والهوية" sub="اسم التطبيق واللون الأساسي والوضع الداكن">
      <SaveToast show={saved} />
      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-4 shadow-soft">
          <label className="mb-1 block text-sm font-semibold">اسم التطبيق</label>
          <Input value={settings.appName} onChange={(e) => { updateSettings({ appName: e.target.value }); flash(); }} />
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-soft">
          <label className="mb-2 block text-sm font-semibold">اللون الأساسي</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => { updateSettings({ primaryColor: c }); flash(); }}
                className="h-10 w-10 rounded-full ring-offset-2 transition"
                style={{ background: c, boxShadow: settings.primaryColor === c ? `0 0 0 2px ${c}` : 'none' }}
              />
            ))}
            <input
              type="color" value={settings.primaryColor}
              onChange={(e) => updateSettings({ primaryColor: e.target.value })}
              className="h-10 w-10 cursor-pointer rounded-full border-0 bg-transparent"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-soft">
          <span className="text-sm font-semibold">الوضع الداكن (تجريبي)</span>
          <Toggle on={settings.darkMode} onClick={() => updateSettings({ darkMode: !settings.darkMode })} />
        </div>
      </div>
    </Section>
  );
}

function HomeLayout() {
  const layout = useAppStore((s) => s.homeLayout);
  const toggleHomeSection = useAppStore((s) => s.toggleHomeSection);
  const moveHomeSection = useAppStore((s) => s.moveHomeSection);
  return (
    <Section title="تخطيط الصفحة الرئيسية" sub="إظهار/إخفاء وترتيب أقسام الرئيسية">
      <div className="space-y-2">
        {layout.map((sec, i) => (
          <div key={sec.key} className="flex items-center gap-2 rounded-2xl bg-white p-3 shadow-soft">
            <div className="flex flex-col">
              <button onClick={() => moveHomeSection(i, -1)} disabled={i === 0} className="text-muted disabled:opacity-20">▲</button>
              <button onClick={() => moveHomeSection(i, 1)} disabled={i === layout.length - 1} className="text-muted disabled:opacity-20">▼</button>
            </div>
            <span className="flex-1 text-sm font-bold">{sec.label}</span>
            <Toggle on={sec.visible} onClick={() => toggleHomeSection(sec.key)} />
          </div>
        ))}
      </div>
    </Section>
  );
}

function Support() {
  const tickets = useAppStore((s) => s.tickets);
  const replyTicket = useAppStore((s) => s.replyTicket);
  const closeTicket = useAppStore((s) => s.closeTicket);
  const [openId, setOpenId] = useState(null);
  const [reply, setReply] = useState('');

  const open = tickets.find((t) => t.id === openId);

  if (open) {
    return (
      <Section title={open.subject} sub={`من: ${open.userName ?? 'مستخدم'}`}>
        <button onClick={() => setOpenId(null)} className="mb-3 text-sm font-bold text-muted">‹ رجوع لكل التذاكر</button>
        <div className="space-y-2">
          {open.messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] rounded-2xl p-3 text-sm ${m.from === 'admin' ? 'mr-auto bg-primary text-white' : 'ml-auto bg-white shadow-soft'}`}>
              {m.text}
              <p className="mt-1 text-[10px] opacity-70" dir="ltr">{m.date}</p>
            </div>
          ))}
        </div>
        {open.status !== 'closed' && (
          <div className="mt-4 flex gap-2">
            <Input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="اكتب رداً..." />
            <button
              onClick={() => { if (reply.trim()) { replyTicket(open.id, reply.trim()); setReply(''); } }}
              className="shrink-0 rounded-2xl bg-primary px-5 text-sm font-bold text-white"
            >
              إرسال
            </button>
          </div>
        )}
        {open.status !== 'closed' && (
          <button onClick={() => closeTicket(open.id)} className="mt-3 w-full rounded-2xl border border-red-200 py-2 text-sm font-bold text-red-500">
            إغلاق التذكرة
          </button>
        )}
      </Section>
    );
  }

  return (
    <Section title="تذاكر الدعم" sub={`${tickets.length} تذكرة`}>
      <div className="space-y-2">
        {tickets.length === 0 && <p className="py-6 text-center text-sm text-muted">لا توجد تذاكر بعد</p>}
        {tickets.map((tkt) => (
          <button key={tkt.id} onClick={() => setOpenId(tkt.id)} className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-right shadow-soft">
            <div className="flex-1">
              <p className="text-sm font-bold">{tkt.subject}</p>
              <p className="text-xs text-muted">{tkt.userName ?? 'مستخدم'}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold ${
              tkt.status === 'open' ? 'bg-amber-50 text-amber-600' : tkt.status === 'answered' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-muted'
            }`}>
              {tkt.status === 'open' ? 'جديدة' : tkt.status === 'answered' ? 'تم الرد' : 'مغلقة'}
            </span>
          </button>
        ))}
      </div>
    </Section>
  );
}

function Welcome() {
  const enabled = useAppStore((s) => s.welcomeTestEnabled);
  const setEnabled = useAppStore((s) => s.setWelcomeTestEnabled);
  const questions = useAppStore((s) => s.welcomeQuestions);
  const addQ = useAppStore((s) => s.addWelcomeQuestion);
  const updateQ = useAppStore((s) => s.updateWelcomeQuestion);
  const deleteQ = useAppStore((s) => s.deleteWelcomeQuestion);
  const [form, setForm] = useState({ question: '', answers: ['', ''], correctIndex: 0 });

  return (
    <Section title="اختبار الترحيب" sub="أسئلة مكافحة الحظر قبل الاستخدام">
      <div className="mb-4 flex items-center justify-between rounded-2xl bg-white p-4 shadow-soft">
        <span className="text-sm font-semibold">تفعيل الاختبار للمستخدمين الجدد</span>
        <Toggle on={enabled} onClick={() => setEnabled(!enabled)} />
      </div>

      <div className="space-y-2">
        {questions.map((q) => (
          <div key={q.id} className="rounded-2xl bg-white p-3 shadow-soft">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-sm font-bold">{q.question}</p>
              <button onClick={() => deleteQ(q.id)} className="text-xs font-bold text-red-500">حذف</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {q.answers.map((a, i) => (
                <button
                  key={i}
                  onClick={() => updateQ(q.id, { correctIndex: i })}
                  className={`rounded-full px-3 py-1 text-[11px] font-bold ${i === q.correctIndex ? 'bg-primary text-white' : 'bg-gray-100 text-muted'}`}
                >
                  {a || `خيار ${i + 1}`}
                </button>
              ))}
            </div>
            <p className="mt-1 text-[10px] text-muted">اضغط على الإجابة الصحيحة لتحديدها</p>
          </div>
        ))}
      </div>

      <p className="mb-2 mt-5 text-sm font-bold text-muted">إضافة سؤال جديد</p>
      <div className="space-y-2 rounded-2xl bg-white p-4 shadow-soft">
        <Input placeholder="نص السؤال" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
        {form.answers.map((a, i) => (
          <Input
            key={i} placeholder={`الخيار ${i + 1}`} value={a}
            onChange={(e) => { const arr = [...form.answers]; arr[i] = e.target.value; setForm({ ...form, answers: arr }); }}
          />
        ))}
        <button
          onClick={() => setForm({ ...form, answers: [...form.answers, ''] })}
          className="text-xs font-bold text-primary"
        >
          + إضافة خيار آخر
        </button>
        <button
          onClick={() => {
            if (!form.question.trim() || form.answers.filter((a) => a.trim()).length < 2) return;
            addQ(form);
            setForm({ question: '', answers: ['', ''], correctIndex: 0 });
          }}
          className="w-full rounded-2xl bg-primary py-3 text-sm font-bold text-white"
        >
          إضافة السؤال
        </button>
      </div>
    </Section>
  );
}

function Broadcast() {
  const broadcasts = useAppStore((s) => s.broadcasts);
  const sendBroadcast = useAppStore((s) => s.sendBroadcast);
  const [text, setText] = useState('');
  const [saved, flash] = useSavedFlash();
  return (
    <Section title="إشعارات جماعية" sub="يظهر الإشعار لكل مستخدم بأعلى الصفحة الرئيسية">
      <SaveToast show={saved} />
      <div className="mb-4 rounded-2xl bg-white p-4 shadow-soft">
        <Textarea rows={3} placeholder="اكتب نص الإشعار..." value={text} onChange={(e) => setText(e.target.value)} />
        <button
          onClick={() => { if (text.trim()) { sendBroadcast(text.trim()); setText(''); flash(); } }}
          className="mt-2 w-full rounded-2xl bg-primary py-3 text-sm font-bold text-white"
        >
          إرسال للجميع الآن
        </button>
      </div>
      <p className="mb-2 text-sm font-bold text-muted">آخر الإشعارات المُرسلة</p>
      <div className="space-y-2">
        {broadcasts.length === 0 && <p className="py-4 text-center text-xs text-muted">لا توجد إشعارات بعد</p>}
        {broadcasts.map((b) => (
          <div key={b.id} className="rounded-2xl bg-white p-3 shadow-soft">
            <p className="text-sm">{b.text}</p>
            <p className="mt-1 text-[10px] text-muted" dir="ltr">{b.date}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Legal() {
  const legalPages = useAppStore((s) => s.legalPages);
  const updateLegalPage = useAppStore((s) => s.updateLegalPage);
  const [saved, flash] = useSavedFlash();
  const pages = [
    ['terms', 'الشروط والأحكام'],
    ['privacy', 'سياسة الخصوصية'],
    ['about', 'من نحن'],
  ];
  return (
    <Section title="الصفحات القانونية" sub="نصوص تظهر للمستخدمين من صفحة الحساب">
      <SaveToast show={saved} />
      <div className="space-y-4">
        {pages.map(([key, label]) => (
          <div key={key} className="rounded-2xl bg-white p-4 shadow-soft">
            <label className="mb-1 block text-sm font-semibold">{label}</label>
            <Textarea rows={4} value={legalPages[key]} onChange={(e) => updateLegalPage(key, e.target.value)} onBlur={flash} />
          </div>
        ))}
      </div>
    </Section>
  );
}

function Integrations() {
  const postbackBaseUrl = useAppStore((s) => s.postbackBaseUrl);
  const setPostbackBaseUrl = useAppStore((s) => s.setPostbackBaseUrl);
  const networks = useAppStore((s) => s.offerNetworks);
  const [saved, flash] = useSavedFlash();
  const [copied, setCopied] = useState(null);

  const copy = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <Section title="التكاملات & Postbacks" sub="روابط استقبال تأكيد إتمام العروض من كل شبكة">
      <SaveToast show={saved} />
      <div className="mb-4 rounded-2xl bg-white p-4 shadow-soft">
        <label className="mb-1 block text-sm font-semibold">نطاق السيرفر (Domain)</label>
        <Input value={postbackBaseUrl} onChange={(e) => setPostbackBaseUrl(e.target.value)} onBlur={flash} dir="ltr" />
        <p className="mt-1 text-[11px] text-muted">استبدله بدومينك الفعلي بعد نشر الباك إند</p>
      </div>

      <p className="mb-2 text-sm font-bold text-muted">روابط Postback لكل شبكة</p>
      <div className="space-y-2">
        {networks.map((n) => {
          const url = `${postbackBaseUrl}?network=${n.id}&subid={subid}&amount={amount}`;
          return (
            <div key={n.id} className="rounded-2xl bg-white p-3 shadow-soft">
              <p className="mb-1 text-sm font-bold">{n.name}</p>
              <p className="mb-2 break-all rounded-xl bg-surface p-2 text-[11px] text-muted" dir="ltr">{url}</p>
              <button onClick={() => copy(url, n.id)} className="text-xs font-bold text-primary">
                {copied === n.id ? 'تم النسخ ✓' : 'نسخ الرابط'}
              </button>
            </div>
          );
        })}
        {networks.length === 0 && <p className="py-4 text-center text-xs text-muted">أضف شبكات أولاً من قسم «شبكات العروض»</p>}
      </div>
    </Section>
  );
}

function WithdrawRequests() {
  const requests = useAppStore((s) => s.withdrawRequests);
  const updateWithdrawalStatus = useAppStore((s) => s.updateWithdrawalStatus);
  const map = { approved: 'قيد المعالجة', paid: 'مدفوع', rejected: 'مرفوض', suspended: 'معلق' };
  return (
    <Section title="طلبات السحب" sub={`${requests.filter((r) => r.status === 'approved').length} قيد المعالجة`}>
      <div className="space-y-2">
        {requests.map((r) => (
          <div key={r.id} className="rounded-2xl bg-white p-3 shadow-soft">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">{r.method}</p>
                <p className="text-xs text-muted" dir="ltr">{r.date}</p>
              </div>
              <span className="text-sm font-black text-primary">{r.amount.toFixed(2)} ر.س</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted">{map[r.status] ?? r.status}</span>
              {r.status === 'approved' && (
                <div className="flex gap-2">
                  <button onClick={() => updateWithdrawalStatus(r.id, 'paid')} className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold text-white">
                    تعليم كمدفوع
                  </button>
                  <button onClick={() => updateWithdrawalStatus(r.id, 'rejected')} className="rounded-full bg-red-500 px-3 py-1 text-[11px] font-bold text-white">
                    رفض
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

const SUBVIEWS = {
  users: <Users />,
  analytics: <Analytics />,
  finance: <Finance />,
  security: <Security />,
  rewards: <Rewards />,
  offerNetworks: <OfferNetworks />,
  branding: <Branding />,
  homeLayout: <HomeLayout />,
  support: <Support />,
  welcome: <Welcome />,
  broadcast: <Broadcast />,
  legal: <Legal />,
  integrations: <Integrations />,
  withdrawRequests: <WithdrawRequests />,
};

export default function AdminScreen({ t }) {
  const user = useAppStore((s) => s.user);
  const section = useAppStore((s) => s.adminSection);
  const setAdminSection = useAppStore((s) => s.setAdminSection);
  const setView = useAppStore((s) => s.setView);

  if (user?.role !== 'admin') {
    return (
      <div className="fade-in mx-auto max-w-md px-4 pb-28 pt-6 text-center">
        <p className="mb-4 text-sm font-bold text-muted">ليست لديك صلاحية للوصول إلى هذه الصفحة.</p>
        <button onClick={() => setView('home')} className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white">
          {t('home')}
        </button>
      </div>
    );
  }

  if (section && SUBVIEWS[section]) {
    return (
      <div>
        <div className="mx-auto max-w-md px-4 pt-4">
          <button onClick={() => setAdminSection(null)} className="flex items-center gap-1 text-sm font-bold text-muted">
            <span className="inline-block rotate-180">{Icon.chevron}</span> {t('back')}
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
            <p className="flex-1 font-bold">{s.title}</p>
            <span className="text-muted">{Icon.chevron}</span>
          </button>
        ))}
      </div>
    </div>
  );
            }
