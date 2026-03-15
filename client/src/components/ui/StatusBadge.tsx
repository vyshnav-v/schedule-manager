import type { ShiftStatus } from '../../types';

const BADGE_STYLES: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pending:   'bg-amber-100 text-amber-700 border-amber-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export default function StatusBadge({ status }: { status: ShiftStatus }) {
  const cls = BADGE_STYLES[status] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${cls}`}>
      {status}
    </span>
  );
}
