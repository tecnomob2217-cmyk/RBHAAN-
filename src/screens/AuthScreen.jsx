import React, { useState } from 'react';
import { useAppStore } from '../store';
import { supabase } from '../supabaseClient';
import { Icon } from '../components/icons';

export default function AuthScreen({ t }) {
  const login = useAppStore((s) => s.login);
  const [mode, setMode] = useState('login'); // login | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const completeLogin = async (authUser) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, role, balance')
      .eq('id', authUser.id)
      .single();

    login({
      id: authUser.id,
      name: profile?.name || authUser.email.split('@')[0],
      email: authUser.email,
      role: profile?.role || 'user',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    if (!email.trim() || !password.trim()) {
      setErrorMsg('أدخل البريد الإلكتروني وكلمة المرور');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { name: name.trim() || email.split('@')[0] } },
        });
        if (error) throw error;
        if (!data.session) {
          setInfoMsg('تم إنشاء الحساب! تحقق من بريدك لتأكيده ثم سجل الدخول.');
          setMode('login');
          setLoading(false);
          return;
        }
        await completeLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        await completeLogin(data.user);
      }
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('Invalid login credentials')) {
        setErrorMsg('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else if (msg.includes('already registered') || msg.includes('already exists')) {
        setErrorMsg('هذا البريد مسجل مسبقاً، جرب تسجيل الدخول بدلاً من إنشاء حساب');
      } else if (msg.includes('Password should be at least')) {
        setErrorMsg('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      } else {
        setErrorMsg('حدث خطأ غير متوقع، حاول مرة أخرى');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    login({ id: `google_demo_${Date.now()}`, name: 'مستخدم Google', email: 'google_user@rabhan.app', role: 'user' });
  };

  return (
    <div className="fade-in flex min-h-screen flex-col items-center justify-center bg-surface px-6 pb-10">
      <div className="mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-b from-emerald-500 to-amber-500 text-4xl font-black text-white shadow-soft">
        R
      </div>
      <h1 className="mb-1 text-3xl font-black">ربحان</h1>
      <p className="mb-8 text-muted">اربح مكافآت حقيقية من جوالك</p>

      {errorMsg && (
        <div className="mb-4 w-full max-w-sm rounded-2xl bg-red-50 p-3 text-center text-sm font-bold text-red-600">
          {errorMsg}
        </div>
      )}
      {infoMsg && (
        <div className="mb-4 w-full max-w-sm rounded-2xl bg-emerald-50 p-3 text-center text-sm font-bold text-emerald-700">
          {infoMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {mode === 'signup' && (
          <>
            <label className="block text-sm font-semibold text-muted">الاسم</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="اسمك"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 outline-none focus:border-primary"
            />
          </>
        )}
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
        <button type="submit" disabled={loading}
          className="w-full rounded-2xl bg-primary py-3.5 font-bold text-white shadow-soft active:scale-[0.98] transition disabled:opacity-60">
          {loading ? t('loading') : mode === 'signup' ? t('createAccount') : t('login')}
        </button>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-muted">أو تابع باستخدام</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <button type="button" onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3.5 font-bold active:scale-[0.98] transition">
          {Icon.google} {t('googleLogin')}
        </button>
        <p className="text-center text-[11px] text-muted">
          (تسجيل Google تجريبي حالياً — ربط حقيقي قادم لاحقاً)
        </p>
      </form>

      <p className="mt-6 text-sm text-muted">
        {mode === 'login' ? (
          <>
            {t('noAccount')}{' '}
            <button onClick={() => { setMode('signup'); setErrorMsg(''); setInfoMsg(''); }} className="font-bold text-primary">
              {t('createAccount')}
            </button>
          </>
        ) : (
          <>
            لديك حساب بالفعل؟{' '}
            <button onClick={() => { setMode('login'); setErrorMsg(''); setInfoMsg(''); }} className="font-bold text-primary">
              {t('login')}
            </button>
          </>
        )}
      </p>
    </div>
  );
    }
