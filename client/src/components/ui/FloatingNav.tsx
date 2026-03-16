'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Clock, FileText, X } from 'lucide-react';
import { useNavStore } from '../../store/navStore';
import Spinner from './Spinner';

const NAV = [
  { href: '/scheduling', label: 'Scheduling', Icon: Calendar },
  { href: '/timesheet',  label: 'Timesheet',  Icon: Clock    },
  { href: '/logs',       label: 'Logs',        Icon: FileText },
];

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <rect x="2" y="4"  width="16" height="2" rx="1" />
      <rect x="2" y="9"  width="16" height="2" rx="1" />
      <rect x="2" y="14" width="16" height="2" rx="1" />
    </svg>
  );
}

export default function FloatingNav() {
  const pathname                       = usePathname();
  const [open, setOpen]                = useState(false);
  const { navigating, setNavigating }  = useNavStore();

  const handleNavClick = (href: string) => {
    if (!pathname.startsWith(href)) {
      setNavigating(true);
    }
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2" suppressHydrationWarning>

      {/* Horizontal nav — expands to the left when open */}
      <div
        className={`flex items-center gap-1 bg-white border border-slate-200 rounded-2xl px-2 py-2 shadow-xl transition-all duration-250 origin-right overflow-hidden ${
          open
            ? 'opacity-100 max-w-xs pointer-events-auto'
            : 'opacity-0 max-w-0 px-0 border-transparent pointer-events-none'
        }`}
        style={{ boxShadow: open ? '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)' : 'none' }}
      >
        {NAV.map(({ href, label, Icon }) => {
          const active  = pathname.startsWith(href);
          const loading = navigating && !active && pathname !== href;

          return (
            <Link
              key={href}
              href={href}
              onClick={() => handleNavClick(href)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {loading
                ? <Spinner size="sm" color={active ? 'text-white' : 'text-slate-400'} />
                : <Icon className="w-3.5 h-3.5 shrink-0" />
              }
              {label}
            </Link>
          );
        })}
      </div>

      {/* Hamburger / close toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 shrink-0 ${
          open
            ? 'bg-slate-800 text-white'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)' }}
      >
        {open
          ? <X className="w-4 h-4" />
          : navigating
            ? <Spinner size="sm" color="text-blue-500" />
            : <HamburgerIcon className="w-4 h-4" />
        }
      </button>
    </div>
  );
}
