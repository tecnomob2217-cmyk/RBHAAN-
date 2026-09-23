import React, { useEffect, useMemo } from 'react';
import { useAppStore } from './store';
import { makeT } from './i18n';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import WithdrawScreen from './screens/WithdrawScreen';
import AccountScreen from './screens/AccountScreen';
import OffersScreen from './screens/OffersScreen';
import AdminScreen from './screens/AdminScreen';
import BottomNav from './components/BottomNav';

export default function App() {
  const lang = useAppStore((s) => s.lang);
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const user = useAppStore((s) => s.user);

  // مزامنة اتجاه الصفحة ولغتها مع اللغة المختارة
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // تهيئة Telegram WebApp (الشاشة الكاملة + لون الهيدر) مرة واحدة فقط
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor?.('#10b981');
      tg.setBackgroundColor?.('#f6f7fb');
    }
  }, []);

  // محاكاة دخول تلقائي عند فتح التطبيق داخل تيليجرام
  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser && !user) {
      useAppStore.getState().login({
        id: tgUser.id, name: tgUser.first_name, email: `tg_${tgUser.id}@rabhan.app`, role: 'user',
      });
    }
  }, [user]);

  const t = useMemo(() => makeT(lang), [lang]);

  if (!user) return <AuthScreen t={t} />;

  const screens = {
    home: <HomeScreen t={t} />,
    history: <HistoryScreen t={t} />,
    withdraw: <WithdrawScreen t={t} />,
    account: <AccountScreen t={t} />,
    offers: <OffersScreen t={t} />,
    admin: <AdminScreen t={t} />,
  };

  return (
    <div className="app-shell min-h-screen bg-surface">
      {screens[view] ?? screens.home}
      <BottomNav t={t} />
    </div>
  );
}
