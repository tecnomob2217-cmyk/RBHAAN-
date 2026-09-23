import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * SafeIframe — تغليف آمن لشبكات العروض (CPX / CPAGrip / ...).
 *
 * المشكلة: بعض شبكات العروض تعيد التوجيه أو تفتح سكربتات قد تتجمد
 * التطبيق أو تُظهر شاشة بيضاء داخل WebView الخاص بتيليجرام.
 *
 * الحل:
 * 1. نستخدم srcDoc بدل src مباشرة، ونضع بداخله شاشة تحميل أنيقة
 *    ثم window.location.replace(url) — فيتحمل المحتوى داخل نفس
 *    الـ iframe مع بقاء الـ host آمناً.
 * 2. sandbox محدد بدقة (بدون allow-top-navigation) حتى لا تستطيع
 *    شبكة العروض الخروج من الـ iframe أو كسر Telegram WebApp.
 * 3. مؤقّت زمني: إن لم يُطلق onload خلال 15 ثانية نُظهر زر
 *    "إعادة المحاولة" بدل الشاشة البيضاء.
 * 4. onLoad يُلغي المؤقّت — لا حالات متسربة بين عمليات إعادة التحميل.
 */
export default function SafeIframe({ src, title, height = 520, onLoaded }) {
  const [status, setStatus] = useState('loading'); // loading | loaded | error
  const [nonce, setNonce] = useState(0);
  const timerRef = useRef(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    loadedRef.current = false;
    setStatus('loading');
    timerRef.current = setTimeout(() => {
      if (!loadedRef.current) setStatus('error');
    }, 15000);
    return () => clearTimeout(timerRef.current);
  }, [src, nonce]);

  const srcDoc = useMemo(() => {
    const safe = JSON.stringify(src);
    return `<!doctype html>
<html dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body{margin:0;font-family:system-ui,sans-serif;background:#f6f7fb;display:flex;align-items:center;justify-content:center;height:100vh}
  .box{text-align:center;color:#6b7280}
  .spin{width:44px;height:44px;border:4px solid #d1fae5;border-top-color:#10b981;border-radius:50%;margin:0 auto 14px;animation:r 0.9s linear infinite}
  @keyframes r{to{transform:rotate(360deg)}}
</style>
</head>
<body>
  <div class="box"><div class="spin"></div><div>جاري تحميل العروض...</div></div>
  <script>
    try { window.location.replace(${safe}); } catch (e) { document.body.innerHTML = '<div class="box">تعذر تحميل العروض</div>'; }
  <\/script>
</body>
</html>`;
  }, [src]);

  const handleLoad = () => {
    // قد يُطلق load مرة للـ srcDoc ومرة للمحتوى الخارجي — نكتفي بالأولى
    if (loadedRef.current) return;
    loadedRef.current = true;
    clearTimeout(timerRef.current);
    setStatus('loaded');
    onLoaded?.();
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-surface" style={{ height }}>
      {status === 'error' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-surface text-center">
          <span className="text-3xl">⚠️</span>
          <p className="text-sm text-muted">تعذر تحميل العروض، تحقق من اتصالك بالإنترنت</p>
          <button
            onClick={() => setNonce((n) => n + 1)}
            className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white active:scale-95 transition"
          >
            إعادة المحاولة
          </button>
        </div>
      )}
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-surface">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-emerald-100 border-t-primary" />
          <p className="text-xs text-muted">جاري تحميل العروض...</p>
        </div>
      )}
      <iframe
        key={nonce}
        title={title}
        srcDoc={srcDoc}
        onLoad={handleLoad}
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        className="h-full w-full border-0"
        style={{ opacity: status === 'loaded' ? 1 : 0 }}
      />
    </div>
  );
}
