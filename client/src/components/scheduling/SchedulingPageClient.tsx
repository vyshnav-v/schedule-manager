'use client';
import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Spinner from '../ui/Spinner';
import StatsBar from './StatsBar';
import CalendarView from './CalendarView';
import MatrixView from './MatrixView';
import ListView from './ListView';
import ShiftModal from './ShiftModal';
import ShiftDetailModal from './ShiftDetailModal';
import DetailPanel from './DetailPanel';
import { useScheduleStore } from '../../store/scheduleStore';
import { useScheduleData } from '../../hooks/useScheduleData';
import { formatWeekLabelScheduling, getWeekStartMonday } from '../../utils/date';

function LoadingSkeleton() {
  return (
    <div className="p-10 flex flex-col items-center justify-center gap-4 min-h-[260px]">
      <Spinner size="lg" color="text-blue-400" />
      <div className="flex flex-col items-center gap-2">
        <div className="h-2.5 w-40 rounded-full bg-slate-200 animate-pulse" />
        <div className="h-2 w-28 rounded-full bg-slate-100 animate-pulse" />
      </div>
    </div>
  );
}

export default function SchedulingPageClient() {
  useScheduleData();
  const {
    viewMode, setViewMode,
    viewBy, setViewBy,
    weekStart, changeWeek,
    isLoading, error,
    openShiftModal,
  } = useScheduleStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    useScheduleStore.setState({ weekStart: getWeekStartMonday(0) });
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Shift Scheduling</h1>
              <p className="text-sm text-slate-500">Manage support worker and participant shifts</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                {[
                  { mode: 'calendar' as const, Icon: () => (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>) },
                  { mode: 'matrix' as const, Icon: () => (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                    </svg>) },
                  { mode: 'list' as const, Icon: () => (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>) },
                ].map(({ mode, Icon }) => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className={`p-2 rounded-md transition-colors ${viewMode === mode ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Icon />
                  </button>
                ))}
              </div>

              {/* View By Toggle – calendar only */}
              {viewMode === 'calendar' && (
                <div className="flex items-center bg-slate-100 rounded-lg p-1">
                  <button onClick={() => setViewBy('worker')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${viewBy === 'worker' ? 'bg-white shadow text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    By Worker
                  </button>
                  <button onClick={() => setViewBy('participant')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${viewBy === 'participant' ? 'bg-white shadow text-slate-900 font-medium' : 'text-slate-500 hover:text-slate-700'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" />
                    </svg>
                    By Participant
                  </button>
                </div>
              )}

              {/* Week Navigation */}
              <div className="flex items-center gap-1 border border-slate-200 rounded-lg bg-white">
                <button onClick={() => changeWeek(-1)}
                  className="p-2 hover:bg-slate-100 transition-colors rounded-l-lg">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <span className="px-2 text-sm font-medium text-slate-700 min-w-[150px] text-center">
                  {mounted ? formatWeekLabelScheduling(weekStart) : ''}
                </span>
                <button onClick={() => changeWeek(1)}
                  className="p-2 hover:bg-slate-100 transition-colors rounded-r-lg">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {/* Add Shift Button */}
              <button onClick={() => openShiftModal()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Shift
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <StatsBar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error} — make sure the server is running on port 5000.
          </div>
        )}

        {/* Calendar View */}
        <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${viewMode !== 'calendar' ? 'hidden' : ''}`}>
          {isLoading ? <LoadingSkeleton /> : <CalendarView />}
        </div>

        {/* Matrix View */}
        <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${viewMode !== 'matrix' ? 'hidden' : ''}`}>
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-slate-900">Worker ↔ Participant Assignment Matrix</h3>
            <p className="text-sm text-slate-500 mt-1">Visual representation of many-to-many relationships</p>
          </div>
          {isLoading ? <LoadingSkeleton /> : <MatrixView />}
        </div>

        {/* List View */}
        <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${viewMode !== 'list' ? 'hidden' : ''}`}>
          {isLoading ? <LoadingSkeleton /> : <ListView />}
        </div>
      </main>

      {/* Overlays */}
      <ShiftModal />
      <ShiftDetailModal />
      <DetailPanel />
    </div>
  );
}
