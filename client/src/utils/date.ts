import type { DayMeta } from '../types';
import { WEEK_DAYS, WEEK_DAY_NAMES, WEEK_DAYS_MON, WEEK_DAY_NAMES_MON } from '../constants';

/** Returns a local YYYY-MM-DD string — avoids UTC off-by-one for non-UTC timezones */
export function toDateKey(d: Date): string {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/** Returns the Sunday of the current week offset by `offset` weeks from today. */
export function getWeekStart(offset = 0): Date {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOfWeek + offset * 7);
  return d;
}

/** Returns the Monday of the current week offset by `offset` weeks (matches shift-scheduling.html). */
export function getWeekStartMonday(offset = 0): Date {
  const today = new Date();
  const day = today.getDay(); // 0=Sun, 1=Mon, …
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayOffset + offset * 7);
  return d;
}

/** Returns 7 DayMeta objects for the week starting on `weekStart` (Sunday). Used by timesheet. */
export function getWeekDays(weekStart: Date): DayMeta[] {
  const todayKey = toDateKey(new Date());
  return WEEK_DAYS.map((key, i) => {
    const d = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i);
    return {
      key,
      name:     WEEK_DAY_NAMES[i],
      date:     d.getDate(),
      month:    d.toLocaleString('en-AU', { month: 'short' }),
      fullDate: toDateKey(d),
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      isToday:   toDateKey(d) === todayKey,
    };
  });
}

/** Returns 7 DayMeta objects for Mon–Sun week (matches shift-scheduling.html). */
export function getWeekDaysMonday(weekStart: Date): DayMeta[] {
  const todayKey = toDateKey(new Date());
  return WEEK_DAYS_MON.map((key, i) => {
    const d = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + i);
    return {
      key,
      name:     WEEK_DAY_NAMES_MON[i],
      date:     d.getDate(),
      month:    d.toLocaleString('en-AU', { month: 'short' }),
      fullDate: toDateKey(d),
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      isToday:   toDateKey(d) === todayKey,
    };
  });
}

/** Format week label for timesheet e.g. "14 Mar – 20 Mar 2026" */
export function formatWeekLabel(weekStart: Date): string {
  const days = getWeekDays(weekStart);
  const first = days[0];
  const last  = days[6];
  return `${first.date} ${first.month} – ${last.date} ${last.month} ${weekStart.getFullYear()}`;
}

/** Format week label for scheduling – matches HTML "13 - 19 Jan 2025" */
export function formatWeekLabelScheduling(weekStart: Date): string {
  const days = getWeekDaysMonday(weekStart);
  const first = days[0];
  const last  = days[6];
  const year  = weekStart.getFullYear();
  if (first.month === last.month) {
    return `${first.date} - ${last.date} ${first.month} ${year}`;
  }
  return `${first.date} ${first.month} - ${last.date} ${last.month} ${year}`;
}
