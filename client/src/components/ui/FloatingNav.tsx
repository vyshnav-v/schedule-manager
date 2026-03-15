'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Clock, FileText } from 'lucide-react';

const NAV = [
  { href: '/scheduling', label: 'Scheduling', Icon: Calendar },
  { href: '/timesheet',  label: 'Timesheet',  Icon: Clock    },
  { href: '/logs',       label: 'Logs',        Icon: FileText },
];

export default function FloatingNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-1.5" suppressHydrationWarning>
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-2xl px-2 py-2 shadow-lg"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)' }}>
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
