'use client';
import { create } from 'zustand';
import type { Worker, Shift, EntryType, WorkType, TimesheetType, InputType, PayPeriod } from '../types';
import { ENTRY_TYPES } from '../constants';
import { getWeekStart } from '../utils/date';
import { calcHours24, calcHours12, to12h } from '../utils/time';

interface TimesheetCell {
  hours: number;
  startTime: string;
  startAP: 'AM' | 'PM';
  endTime: string;
  endAP: 'AM' | 'PM';
  proj: string;
}

type DayKey = string;
type RowData = Record<DayKey, TimesheetCell>;
type AllRows = Record<string, RowData>;

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function emptyCell(): TimesheetCell {
  return { hours: 0, startTime: '', startAP: 'AM', endTime: '', endAP: 'PM', proj: '' };
}

function initRows(types: EntryType[]): AllRows {
  const rows: AllRows = {};
  types.forEach((t) => {
    rows[t.id] = {};
    DAYS.forEach((d) => { rows[t.id][d] = emptyCell(); });
  });
  return rows;
}

interface TimesheetStore {
  // Config
  selectedWorker:  Worker | null;
  workers:         Worker[];
  payPeriod:       PayPeriod;
  workType:        WorkType;
  timesheetType:   TimesheetType;
  inputType:       InputType;
  weekOffset:      number;
  weekStart:       Date;

  // Data
  entryTypes:      EntryType[];
  rows:            AllRows;
  isLoading:       boolean;

  // Actions
  setWorkers:       (w: Worker[])      => void;
  setSelectedWorker:(w: Worker | null) => void;
  setPayPeriod:     (p: PayPeriod)     => void;
  setWorkType:      (t: WorkType)      => void;
  setTimesheetType: (t: TimesheetType) => void;
  setInputType:     (t: InputType)     => void;
  changeWeek:       (delta: number)    => void;
  setLoading:       (v: boolean)       => void;

  /** Populate the Regular Hours row from API shift data */
  fillFromShifts: (shifts: Shift[], weekDayKeys: string[]) => void;

  updateCell: (rowId: string, day: string, field: keyof TimesheetCell, value: string | number) => void;
  addRow:     (label: string) => void;

  getDayTotal:   (dayKey: string) => number;
  getRowTotal:   (rowId: string) => number;
  getGrandTotal: () => number;
}

export const useTimesheetStore = create<TimesheetStore>((set, get) => ({
  selectedWorker:  null,
  workers:         [],
  payPeriod:       'fortnightly',
  workType:        'shift',
  timesheetType:   'general',
  inputType:       'hours',
  weekOffset:      0,
  weekStart:       typeof window === 'undefined' ? new Date(0) : getWeekStart(0),
  entryTypes:      ENTRY_TYPES,
  rows:            initRows(ENTRY_TYPES),
  isLoading:       false,

  setWorkers:       (workers)         => set({ workers }),
  setSelectedWorker:(selectedWorker)  => set({ selectedWorker }),
  setPayPeriod:     (payPeriod)       => set({ payPeriod }),
  setWorkType:      (workType)        => set({ workType }),
  setTimesheetType: (timesheetType)   => set({ timesheetType }),
  setInputType:     (inputType)       => set({ inputType }),
  setLoading:       (isLoading)       => set({ isLoading }),

  changeWeek: (delta) =>
    set((st) => {
      const next = st.weekOffset + delta;
      return { weekOffset: next, weekStart: getWeekStart(next) };
    }),

  fillFromShifts: (shifts, weekDayKeys) => {
    set((st) => {
      const newRows = { ...st.rows };
      newRows['regular'] = {};
      DAYS.forEach((d) => { newRows['regular'][d] = emptyCell(); });

      shifts.forEach((shift) => {
        const idx = weekDayKeys.indexOf(shift.date);
        if (idx < 0) return;
        const dayKey = DAYS[idx];
        const hrs = calcHours24(shift.startTime, shift.endTime);
        const cell = newRows['regular'][dayKey];
        // Convert 24h API times → 12h for timesheet display
        const start = to12h(shift.startTime);
        const end   = to12h(shift.endTime);
        cell.hours    += hrs;
        cell.startTime = start.time;
        cell.startAP   = start.ap;
        cell.endTime   = end.time;
        cell.endAP     = end.ap;
      });

      return { rows: newRows };
    });
  },

  updateCell: (rowId, day, field, value) =>
    set((st) => {
      const rows = { ...st.rows };
      if (!rows[rowId]) return st;
      const cell = { ...rows[rowId][day] };
      (cell as Record<string, unknown>)[field] = value;

      // Auto-calc hours: use 12h AM/PM-aware calc (timesheet uses 12h format)
      if (cell.startTime && cell.endTime) {
        cell.hours = calcHours12(cell.startTime, cell.startAP, cell.endTime, cell.endAP);
      }

      rows[rowId] = { ...rows[rowId], [day]: cell };
      return { rows };
    }),

  addRow: (label) =>
    set((st) => {
      const id = label.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      const newType: EntryType = { id, label, icon: 'work' };
      const newRow: RowData = {};
      DAYS.forEach((d) => { newRow[d] = emptyCell(); });
      return {
        entryTypes: [...st.entryTypes, newType],
        rows: { ...st.rows, [id]: newRow },
      };
    }),

  getDayTotal: (dayKey) => {
    const { rows, entryTypes } = get();
    return entryTypes.reduce((sum, t) => {
      const cell = rows[t.id]?.[dayKey];
      return sum + (cell?.hours ?? 0);
    }, 0);
  },

  getRowTotal: (rowId) => {
    const { rows } = get();
    const row = rows[rowId] ?? {};
    return Object.values(row).reduce((sum, c) => sum + (c.hours ?? 0), 0);
  },

  getGrandTotal: () => {
    const { entryTypes } = get();
    return entryTypes.reduce((sum, t) => sum + get().getRowTotal(t.id), 0);
  },
}));
