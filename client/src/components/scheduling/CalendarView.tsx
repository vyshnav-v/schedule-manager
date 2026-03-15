'use client';
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Avatar from '../ui/Avatar';
import ShiftCard from './ShiftCard';
import { useScheduleStore } from '../../store/scheduleStore';
import { getWeekDaysMonday } from '../../utils/date';
import type { DayMeta } from '../../types';

export default function CalendarView() {
  const {
    workers, participants, shifts, viewBy,
    weekStart, openShiftModal, openDetailPanel, openShiftDetail,
    getLinkedParticipants, getLinkedWorkers,
  } = useScheduleStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const days: DayMeta[] = mounted ? getWeekDaysMonday(weekStart) : [];
  const entities = viewBy === 'worker' ? workers : participants;

  const shiftsForCell = (entityId: string, date: string) =>
    shifts.filter((s) =>
      s.workerId?._id && s.participantId?._id && (
        viewBy === 'worker'
          ? s.workerId._id === entityId && s.date === date
          : s.participantId._id === entityId && s.date === date
      ),
    );

  return (
    <div className="overflow-x-auto scrollbar-thin">
      {/* Header row – same grid-cols-8 as HTML */}
      <div className="grid grid-cols-8 border-b border-slate-200" style={{ minWidth: 900 }}>
        <div className="p-3 bg-slate-50 border-r border-slate-200 font-medium text-slate-600 text-sm">
          {viewBy === 'worker' ? 'Support Worker' : 'Participant'}
        </div>
        {days.map((d) => (
          <div key={d.key} className="p-3 bg-slate-50 text-center border-r border-slate-200 last:border-r-0">
            <div className="font-medium text-slate-900">{d.name}</div>
            <div className="text-xs text-slate-500">{d.date} {d.month}</div>
          </div>
        ))}
      </div>

      {/* Entity rows */}
      <div className="divide-y divide-slate-200" style={{ minWidth: 900 }}>
        {entities.map((entity) => (
          <div key={entity._id} className="grid grid-cols-8">
            {/* Entity label */}
            <div
              className="p-3 border-r border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => openDetailPanel(entity._id, viewBy)}
            >
              <div className="flex items-center gap-2">
                <Avatar initials={entity.avatar} color={entity.color} size="md" />
                <div className="min-w-0">
                  <div className="font-medium text-slate-900 text-sm truncate">{entity.name}</div>
                  <div className="text-xs text-slate-500">
                    {viewBy === 'worker'
                      ? `${getLinkedParticipants(entity._id).length} participants`
                      : `${getLinkedWorkers(entity._id).length} workers`}
                  </div>
                </div>
              </div>
            </div>

            {/* Day cells */}
            {days.map((d) => {
              const cellShifts = shiftsForCell(entity._id, d.fullDate);
              return (
                <div
                  key={d.key}
                  className="p-1.5 border-r border-slate-200 last:border-r-0 min-h-[80px] hover:bg-slate-50 transition-colors cursor-pointer group relative"
                  onClick={() =>
                    openShiftModal({
                      prefillDate: d.fullDate,
                      ...(viewBy === 'worker'
                        ? { prefillWorkerId: entity._id }
                        : { prefillParticipantId: entity._id }),
                    })
                  }
                >
                  {/* "+" hover indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <Plus className="w-3 h-3 text-blue-500" />
                    </div>
                  </div>
                  {cellShifts.map((shift) => (
                    <ShiftCard key={shift._id} shift={shift} viewBy={viewBy} onClick={openShiftDetail} />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
