# ربحان (Rabhan) — Telegram Mini App

تطبيق استطلاعات ومكافآت مبني بـ React + Tailwind CSS (عربي RTL، Mobile-first).

## التشغيل

```bash
npm install
npm run dev
```

## بنية المشروع

```
src/
├── main.jsx              نقطة الدخول
├── App.jsx               التوجيه بين الشاشات + تهيئة Telegram WebApp
├── store.js              إدارة الحالة (zustand — بلا infinite loops)
├── i18n.js               ترجمة عربي/إنجليزي
├── index.css             Tailwind + RTL
├── components/
│   ├── SafeIframe.jsx    تغليف آمن لشبكات العروض (srcDoc + sandbox + مؤقّت)
│   ├── ErrorBoundary.jsx حماية من انهيار المكونات
│   ├── BottomNav.jsx     شريط التنقل السفلي
│   └── icons.jsx         أيقونات SVG خفيفة
└── screens/
    ├── AuthScreen.jsx    تسجيل الدخول
    ├── HomeScreen.jsx    الرصيد + المكافأة اليومية + العروض
    ├── HistoryScreen.jsx سجل الاستطلاعات (ربح/طرد)
    ├── WithdrawScreen.jsx سحب الأرباح (PayPal/شحن/شدات) + سجل الطلبات
    ├── AccountScreen.jsx الحساب واللغة والدعم
    ├── OffersScreen.jsx  جدار العروض (CPX/CPAGrip داخل SafeIframe)
    └── AdminScreen.jsx   لوحة الإدارة الكاملة (14 قسماً)
```

## ملاحظات تقنية

- **SafeIframe**: يحقن شبكة العروض عبر `srcDoc` مع `window.location.replace`
  داخل sandbox محدود، ومؤقّت 15 ثانية يحوّل الشاشة البيضاء إلى زر «إعادة المحاولة».
- **الحالة**: zustand بإجراءات ثابتة (stable actions) — لا اعتماد على
  useEffect لتحديث الحالة، فلا infinite loops.
- **الأمان**: sandbox بدون `allow-top-navigation` فلا تستطيع شبكة العروض
  كسر Telegram WebView.
