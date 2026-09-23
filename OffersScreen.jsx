import React from 'react';
import { useAppStore } from '../store';
import ErrorBoundary from '../components/ErrorBoundary';
import SafeIframe from '../components/SafeIframe';
import { Icon } from '../components/icons';

/**
 * روابط شبكات العروض — تُحقن بمعرّف المستخدم الحقيقي في الإنتاج.
 * الصيغة أدناه نموذج لـ CPX و CPAGrip.
 */
const WALL_URLS = {
  cpx: (uid) => `https://offers.cpx-research.com/index.php?app_id=YOUR_APP_ID&ext_user_id=${uid}&secure_hash=YOUR_HASH`,
  cpagrip: (uid) => `https://www.cpagrip.com/show.php?l=YOUR_LOCK_ID&user_id=${uid}`,
};

export default function OffersScreen({ t }) {
  const user = useAppStore((s) => s.user);
  const setView = useAppStore((s) => s.setView);
  const addTransaction = useAppStore((s) => s.addTransaction);
  const wallUrl = WALL_URLS.cpx(encodeURIComponent(user?.id ?? 'guest'));

  // محاكاة مكافأة عند اكتمال عرض (في الإنتاج: عبر Postback من الشبكة)
  const simulateReward = () => addTransaction({ label: 'CPX Research', source: 'cpx', status: 'earned', amount: 2.50, date: new Date().toLocaleString('ar-SA') });

  return (
    <div className="fade-in mx-auto max-w-md px-4 pb-28 pt-6">
      <button onClick={() => setView('home')} className="mb-3 flex items-center gap-1 text-sm font-bold text-muted">
        <span className="rotate-180 inline-block">{Icon.chevron}</span> {t('back')}
      </button>
      <h1 className="mb-1 text-xl font-black">{t('offers')}</h1>
      <p className="mb-4 text-sm text-muted">أكمل الاستطلاعات واكسب المكافآت فوراً</p>

      <ErrorBoundary>
        <SafeIframe src={wallUrl} title="CPX Offer Wall" height={560} onLoaded={() => console.log('[Rabhan] wall loaded')} />
      </ErrorBoundary>

      <button onClick={simulateReward}
        className="mt-4 w-full rounded-2xl border border-dashed border-primary/40 bg-emerald-50 py-3 text-sm font-bold text-primary">
        محاكاة: إتمام عرض ومكافأة +2.50 ر.س (للاختبار)
      </button>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-semibold leading-relaxed text-amber-700">
        ⚠️ بعض الاستطلاعات معروضة كنماذج تجريبية حتى يتم تفعيل مفاتيح API الفعلية للمزوّدين.
      </div>
    </div>
  );
}
