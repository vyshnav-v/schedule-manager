'use client';
import { create } from 'zustand';
import type {
  Worker, Participant, Shift, Link,
  ViewMode, ViewBy, ShiftModalState, DetailPanelState,
} from '../types';
import { getWeekStartMonday } from '../utils/date';

interface ScheduleStore {
  // ── Data ─────────────────────────────────────────────────────────────────
  workers:      Worker[];
  participants: Participant[];
  shifts:       Shift[];
  links:        Link[];
  isLoading:    boolean;
  error:        string | null;

  // ── UI State ─────────────────────────────────────────────────────────────
  viewMode:     ViewMode;
  viewBy:       ViewBy;
  weekOffset:   number;
  weekStart:    Date;

  // ── Modals ────────────────────────────────────────────────────────────────
  shiftModal:        ShiftModalState;
  detailPanel:       DetailPanelState;
  shiftDetailId:     string | null;

  // ── Data Actions ──────────────────────────────────────────────────────────
  setWorkers:      (w: Worker[])      => void;
  setParticipants: (p: Participant[]) => void;
  setShifts:       (s: Shift[])       => void;
  setLinks:        (l: Link[])        => void;
  setLoading:      (v: boolean)       => void;
  setError:        (e: string | null) => void;
  addShift:        (s: Shift)         => void;
  updateShift:     (s: Shift)         => void;
  removeShift:     (id: string)       => void;

  // ── UI Actions ────────────────────────────────────────────────────────────
  setViewMode:   (m: ViewMode) => void;
  setViewBy:     (v: ViewBy)   => void;
  changeWeek:    (delta: number) => void;

  openShiftModal:  (opts?: Partial<Pick<ShiftModalState, 'mode' | 'shiftId' | 'prefillWorkerId' | 'prefillParticipantId' | 'prefillDate'>>) => void;
  closeShiftModal: () => void;

  openDetailPanel:  (id: string, type: 'worker' | 'participant') => void;
  closeDetailPanel: () => void;

  openShiftDetail:  (id: string) => void;
  closeShiftDetail: () => void;

  // ── Derived helpers ───────────────────────────────────────────────────────
  getLinkedParticipants: (workerId: string)      => Array<Participant & { isPrimary: boolean }>;
  getLinkedWorkers:      (participantId: string) => Array<Worker & { isPrimary: boolean }>;
  getShiftsForEntity:    (entityId: string, type: ViewBy, date?: string) => Shift[];
}

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
  workers:       [],
  participants:  [],
  shifts:        [],
  links:         [],
  isLoading:     false,
  error:         null,
  viewMode:      'calendar',
  viewBy:        'worker',
  weekOffset:    0,
  weekStart:     typeof window === 'undefined' ? new Date(0) : getWeekStartMonday(0),
  shiftModal:    { isOpen: false, mode: 'create', shiftId: null, prefillWorkerId: null, prefillParticipantId: null, prefillDate: null },
  detailPanel:   { isOpen: false, entityId: null, entityType: null },
  shiftDetailId: null,

  setWorkers:      (workers)      => set({ workers }),
  setParticipants: (participants) => set({ participants }),
  setShifts:       (shifts)       => set({ shifts }),
  setLinks:        (links)        => set({ links }),
  setLoading:      (isLoading)    => set({ isLoading }),
  setError:        (error)        => set({ error }),

  addShift:    (s) => set((st) => ({ shifts: [...st.shifts, s] })),
  updateShift: (s) => set((st) => ({ shifts: st.shifts.map((x) => (x._id === s._id ? s : x)) })),
  removeShift: (id) => set((st) => ({ shifts: st.shifts.filter((x) => x._id !== id) })),

  setViewMode: (viewMode) => set({ viewMode }),
  setViewBy:   (viewBy)   => set({ viewBy }),

  changeWeek: (delta) =>
    set((st) => {
      const next = st.weekOffset + delta;
      return { weekOffset: next, weekStart: getWeekStartMonday(next) };
    }),

  openShiftModal: (opts = {}) =>
    set({ shiftModal: { isOpen: true, mode: 'create', shiftId: null, prefillWorkerId: null, prefillParticipantId: null, prefillDate: null, ...opts } }),
  closeShiftModal: () =>
    set({ shiftModal: { isOpen: false, mode: 'create', shiftId: null, prefillWorkerId: null, prefillParticipantId: null, prefillDate: null } }),

  openDetailPanel:  (entityId, entityType) => set({ detailPanel: { isOpen: true, entityId, entityType } }),
  closeDetailPanel: ()                     => set({ detailPanel: { isOpen: false, entityId: null, entityType: null } }),

  openShiftDetail:  (id) => set({ shiftDetailId: id }),
  closeShiftDetail: ()   => set({ shiftDetailId: null }),

  getLinkedParticipants: (workerId) => {
    const { links, participants } = get();
    return links
      .filter((l) => l.workerId?._id === workerId)
      .map((l) => {
        const p = participants.find((p) => p._id === l.participantId?._id);
        return p ? { ...p, isPrimary: l.isPrimary } : null;
      })
      .filter(Boolean) as Array<typeof participants[0] & { isPrimary: boolean }>;
  },

  getLinkedWorkers: (participantId) => {
    const { links, workers } = get();
    return links
      .filter((l) => l.participantId?._id === participantId)
      .map((l) => {
        const w = workers.find((w) => w._id === l.workerId?._id);
        return w ? { ...w, isPrimary: l.isPrimary } : null;
      })
      .filter(Boolean) as Array<typeof workers[0] & { isPrimary: boolean }>;
  },

  getShiftsForEntity: (entityId, type, date) => {
    const { shifts } = get();
    return shifts.filter((s) => {
      if (!s.workerId?._id || !s.participantId?._id) return false;
      const match = type === 'worker' ? s.workerId._id === entityId : s.participantId._id === entityId;
      return match && (date ? s.date === date : true);
    });
  },
}));
