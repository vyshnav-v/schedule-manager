'use client';
import { useEffect, useState } from 'react';
import { useTimesheetStore } from '../../store/timesheetStore';
import { formatWeekLabel, getWeekStart } from '../../utils/date';

export default function WeekNav() {
  const { weekStart, changeWeek } = useTimesheetStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    useTimesheetStore.setState({ weekStart: getWeekStart(0) });
    setMounted(true);
  }, []);

  return (
    /* week-nav – matches HTML exactly (text "Prev" / "Next" buttons) */
    <div className="flex items-center gap-2" suppressHydrationWarning>
      <button
        onClick={() => changeWeek(-1)}
        className="flex items-center gap-1 px-2.5 py-[5px] rounded-md border border-slate-200 bg-white text-[#475569] text-[11px] font-medium hover:bg-slate-50 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Prev
      </button>

      <span className="text-xs font-semibold text-[#1e293b] min-w-[140px] text-center">
        {mounted ? formatWeekLabel(weekStart) : ''}
      </span>

      <button
        onClick={() => changeWeek(1)}
        className="flex items-center gap-1 px-2.5 py-[5px] rounded-md border border-slate-200 bg-white text-[#475569] text-[11px] font-medium hover:bg-slate-50 transition-colors">
        Next
        <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
