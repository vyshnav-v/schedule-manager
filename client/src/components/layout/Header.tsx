'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, CalendarDays, FileText, BarChart2 } from 'lucide-react';

const NAV = [
  { href: '/scheduling', label: 'Scheduling', icon: CalendarDays },
  { href: '/timesheet',  label: 'Timesheet',  icon: FileText },
  { href: '/logs',       label: 'Logs',        icon: BarChart2 },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0ea5e9,#06b6d4)' }}>
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-slate-900">HR Nexus</span>
            <span className="hidden sm:block text-xs text-slate-400">Schedule Manager</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User badge */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
            HR
          </div>
          <span className="hidden sm:inline font-medium">HR Nexus</span>
        </div>
      </div>
    </header>
  );
}
