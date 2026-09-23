import React from 'react';

/** أيقونات SVG خفيفة — تمنع مشاكل تحميل الصور الخارجية داخل WebView */
export const Icon = {
  wallet: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h16a2 2 0 0 0 2-2v-1.5a1.5 1.5 0 0 0 0-3V9a1.5 1.5 0 0 0 0-1.5ZM5 6h14v1H5a1 1 0 0 1 0-2Zm13 8.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"/></svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm4.2 14.2L11 13.4V7h2v5.2l4.2 2.5Z"/></svg>
  ),
  cash: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm9 8.5A2.5 2.5 0 1 0 12 9.5a2.5 2.5 0 0 0 0 5ZM6.5 8A1.5 1.5 0 1 0 8 9.5 1.5 1.5 0 0 0 6.5 8Zm11 7A1.5 1.5 0 1 0 20 16.5 1.5 1.5 0 0 0 17.5 15Z"/></svg>
  ),
  gift: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M12 4a3 3 0 0 0-3-3 3 3 0 0 0-3 3H3v5h18V4Zm-3-1a1 1 0 1 1 1 1H8Zm5 1a1 1 0 1 1 1-1h1a1 1 0 1 1-1 1ZM3 11v9a1 1 0 0 0 1 1h7v-8H3Zm10 10h7a1 1 0 0 0 1-1v-9h-8Z"/></svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M8 11a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 8 11Zm8 0a3.5 3.5 0 1 0-3.5-3.5A3.5 3.5 0 0 0 16 11ZM2 19a6 6 0 0 1 12 0Zm10.4 1.7A7.5 7.5 0 0 0 22 19a7.5 7.5 0 0 0-6-7.35A5 5 0 0 1 18 16a4.9 4.9 0 0 1-5.6 4.7Z"/></svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M4 20V10h3v10Zm6.5 0V4h3v16Zm6.5 0v-7h3v7Z"/></svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5Zm-1.5 15-3.5-3.5L8 11.5l2.5 2.5L16.5 8l1 1Z"/></svg>
  ),
  chevron: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M14.7 6.3a1 1 0 0 0-1.4 0l-4 4a1 1 0 0 0 0 1.4l4 4a1 1 0 1 0 1.4-1.4L11.42 12l3.28-3.3a1 1 0 0 0 0-1.4Z"/></svg>
  ),
  google: (
    <svg viewBox="0 0 24 24" className="h-5 w-5"><path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.3h6.5a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2.1-2 3.6-4.9 3.6-8.3Z"/><path fill="#34A853" d="M12 24c3 0 5.5-1 7.4-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.9A11 11 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.7 14a6.6 6.6 0 0 1 0-4.2V6.9H2a11 11 0 0 0 0 10Z"/><path fill="#EA4335" d="M12 4.7c1.6 0 3.1.6 4.3 1.7l3.2-3.2A11 11 0 0 0 2 6.9L5.7 9.8C6.6 7.2 9.1 4.7 12 4.7Z"/></svg>
  ),
};

export const NetworkBadge = ({ name }) => {
  const colors = {
    CPX: 'bg-red-500', BitLabs: 'bg-emerald-500',
    TheoremReach: 'bg-violet-500', CPALead: 'bg-sky-500',
  };
  const short = name.replace(' Research', '');
  return (
    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-xs font-black text-white ${colors[short] ?? 'bg-gray-400'}`}>
      {short.slice(0, 2).toUpperCase()}
    </span>
  );
};
