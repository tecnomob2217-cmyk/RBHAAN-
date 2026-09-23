import React from 'react';
import { useAppStore } from '../store';

const tabs = [
  { key: 'home', labelKey: 'home', icon: '🏠' },
  { key: 'history', labelKey: 'history', icon: '🕒' },
  { key: 'offers', labelKey: 'offers', icon: '💰' },
  { key: 'account', labelKey: 'account', icon: '👤' },
  { key: 'admin', labelKey: 'admin', icon: '🛡️' },
];

export default function BottomNav({ t }) {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const user = useAppStore((s) => s.user);
  if (!user) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 app-shell border-t border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-1">
        {tabs.map((tab) => {
          const active = view === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition-colors ${active ? 'text-primary' : 'text-muted'}`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
