import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore } from './store';
import { supabase } from './supabaseClient';
import { makeT } from './i18n';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import WithdrawScreen from './screens/WithdrawScreen';
import AccountScreen from './screens/AccountScreen';
import OffersScreen from './screens/OffersScreen';
import AdminScreen from './screens/AdminScreen';
import WelcomeTestScreen from './screens/WelcomeTestScreen';
import BottomNav from './components/BottomNav';

export default function App() {
  const lang = useAppStore((s) => s.lang);
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const user = useAppStore((s) => s.user);
  const login = useAppStore((s) => s.login);
  const logout = useAppStore((s) => s.logout);
  const settings = useAppStore((s) => s.settings);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    document.title = settings.appName || 'ربحان';
    document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
    document.documentElement.style.setProperty('--color-primary-dark', settings.primaryColorDark);
    document.documentElement.classList.toggle('dark', !!settings.darkMode);
  }, [settings.appName, settings.primaryColor, settings.primaryColorDark, settings.darkMode]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (user?.email === 'google_user@rabhan.app') {
        setCheckingSession(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', session.user.id)
          .single();
        login({
          id: session.user.id,
          name: profile?.name || session.user.email.split('@')[0],
          email: session.user.email,
          role: profile?.role || 'user',
        });
      } else if (user) {
        logout();
      }
      setCheckingSession(false);
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor?.('#10b981');
      tg.setBackgroundColor?.('#f6f7fb');
    }
  }, []);

  const t = useMemo(() => makeT(lang), [lang]);

  if (checkingSession) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-emerald-100 border-t-primary" />
      </div>
    );
  }

  if (!user) return <AuthScreen t={t} />;

  if (view === 'welcomeTest') return <WelcomeTestScreen t={t} />;

  const screens = {
    home: <HomeScreen t={t} />,
    history: <HistoryScreen t={t} />,
    withdraw: <WithdrawScreen t={t} />,
    account: <AccountScreen t={t} />,
    offers: <OffersScreen t={t} />,
    admin: <AdminScreen t={t} />,
  };

  return (
    <div className="app-shell min-h-screen bg-surface text-ink">
      {screens[view] ?? screens.home}
      <BottomNav t={t} />
    </div>
  );
}
