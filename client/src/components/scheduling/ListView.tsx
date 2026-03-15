'use client';
import { useState } from 'react';
import { CalendarDays, Clock, Eye } from 'lucide-react';
import Avatar from '../ui/Avatar';
import StatusBadge from '../ui/StatusBadge';
import { useScheduleStore } from '../../store/scheduleStore';

export default function ListView() {
  const { shifts, openShiftDetail } = useScheduleStore();
  const [search, setSearch] = useState('');

  const filtered = shifts.filter((s) => {
    if (!s.workerId?.name || !s.participantId?.name) return false;
    const q = search.toLowerCase();
    return (
      s.workerId.name.toLowerCase().includes(q) ||
      s.participantId.name.toLowerCase().includes(q) ||
      (s.serviceType ?? '').toLowerCase().includes(q) ||
      s.date.includes(q)
    );
  });

  return (
    <div>
      {/* Search bar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-900">All Scheduled Shifts</h3>
        <div className="relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shifts..."
            className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {filtered.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">No shifts found.</div>
        )}
        {filtered.map((shift) => {
          if (!shift.workerId?.name || !shift.participantId?.name) return null;
          return (
          <div key={shift._id} className="p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Worker */}
                <div className="flex items-center gap-2 min-w-[160px]">
                  <Avatar initials={shift.workerId.avatar} color={shift.workerId.color} />
                  <div>
                    <div className="font-medium text-slate-900 text-sm">{shift.workerId.name}</div>
                    <div className="text-xs text-slate-500">Worker</div>
                  </div>
                </div>

                <div className="text-slate-300 px-2">→</div>

                {/* Participant */}
                <div className="flex items-center gap-2 min-w-[160px]">
                  <Avatar initials={shift.participantId.avatar} color={shift.participantId.color} />
                  <div>
                    <div className="font-medium text-slate-900 text-sm">{shift.participantId.name}</div>
                    <div className="text-xs text-slate-500">{shift.participantId.location}</div>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 ml-2 flex-wrap text-sm text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4" /> {shift.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {shift.startTime} – {shift.endTime}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">{shift.serviceType}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={shift.status} />
                <button
                  onClick={() => openShiftDetail(shift._id)}
                  className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
