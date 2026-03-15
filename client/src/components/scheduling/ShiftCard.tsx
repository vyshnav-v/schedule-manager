import StatusBadge from '../ui/StatusBadge';
import type { Shift, ViewBy } from '../../types';

interface ShiftCardProps {
  shift: Shift;
  viewBy: ViewBy;
  onClick: (id: string) => void;
}

export default function ShiftCard({ shift, viewBy, onClick }: ShiftCardProps) {
  const related = viewBy === 'worker' ? shift.participantId : shift.workerId;
  if (!related?.name) return null;
  const color = related.color ?? '#94a3b8';

  return (
    <div
      className="mb-1 p-1.5 rounded-lg text-xs border-l-3 cursor-pointer hover:brightness-95 transition-all"
      style={{ backgroundColor: `${color}15`, borderLeftColor: color }}
      onClick={(e) => { e.stopPropagation(); onClick(shift._id); }}
    >
      <div className="font-medium text-slate-800 truncate">{related.name}</div>
      <div className="text-slate-500 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
        {shift.startTime}–{shift.endTime}
      </div>
      <StatusBadge status={shift.status} />
    </div>
  );
}
