import { Fragment } from 'react';
import { Users, UserCheck, CalendarDays, AlertCircle } from 'lucide-react';
import { useScheduleStore } from '../../store/scheduleStore';

export default function StatsBar() {
  const { workers, participants, shifts } = useScheduleStore();
  const pending = shifts.filter((s) => s.status === 'pending').length;

  const stats = [
    { label: 'Active Workers',   value: workers.length,      icon: Users,        color: 'bg-blue-100 text-blue-600'       },
    { label: 'Participants',     value: participants.length, icon: UserCheck,    color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Scheduled Shifts', value: shifts.length,       icon: CalendarDays, color: 'bg-purple-100 text-purple-600'   },
    { label: 'Pending Approval', value: pending,             icon: AlertCircle,  color: 'bg-amber-100 text-amber-600'     },
  ];

  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-6 flex-wrap">
          {stats.map(({ label, value, icon: Icon, color }, i) => (
            <Fragment key={label}>
              {i > 0 && <div className="w-px h-10 bg-slate-200" />}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">{value}</div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
