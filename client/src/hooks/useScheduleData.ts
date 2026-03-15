'use client';
import { useEffect } from 'react';
import { useScheduleStore } from '../store/scheduleStore';
import { workerApi, participantApi, shiftApi, linkApi } from '../utils/api';
import { toDateKey } from '../utils/date';

/** Fetches all scheduling data and loads it into the Zustand store. */
export function useScheduleData() {
  const { setWorkers, setParticipants, setShifts, setLinks, setLoading, setError, weekStart } =
    useScheduleStore();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [workers, participants, links, shifts] = await Promise.all([
          workerApi.getAll(),
          participantApi.getAll(),
          linkApi.getAll(),
          shiftApi.getAll({ week: toDateKey(weekStart) }),
        ]);
        if (cancelled) return;
        setWorkers(workers);
        setParticipants(participants);
        setLinks(links);
        setShifts(shifts);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);
}
