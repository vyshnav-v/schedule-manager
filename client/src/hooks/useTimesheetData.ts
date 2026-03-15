'use client';
import { useEffect } from 'react';
import { useTimesheetStore } from '../store/timesheetStore';
import { workerApi, shiftApi } from '../utils/api';
import { toDateKey, getWeekDays } from '../utils/date';

/** Fetches workers and the selected worker's shifts for the timesheet. */
export function useTimesheetData() {
  const { selectedWorker, weekStart, setWorkers, setLoading, fillFromShifts } = useTimesheetStore();

  // Load workers once on mount
  useEffect(() => {
    workerApi.getAll().then(setWorkers).catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load shifts when worker or week changes
  useEffect(() => {
    if (!selectedWorker) return;
    let cancelled = false;
    setLoading(true);

    const weekDayKeys = getWeekDays(weekStart).map((d) => d.fullDate);

    shiftApi
      .getAll({ workerId: selectedWorker._id, week: toDateKey(weekStart) })
      .then((shifts) => {
        if (!cancelled) fillFromShifts(shifts, weekDayKeys);
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorker, weekStart]);
}
