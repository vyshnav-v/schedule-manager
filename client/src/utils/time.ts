/** Parse a 24-h or 12-h time string "HH:MM" into { h, m } (0-based hours). */
function parseTime24(t: string): { h: number; m: number } | null {
  const match = t.match(/^(\d{1,2}):?(\d{2})?$/);
  if (!match) return null;
  const h = parseInt(match[1]);
  const m = parseInt(match[2] ?? '0');
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m };
}

/** Parse a 12-h time string "H:MM" with AM/PM into total minutes from midnight. */
function parse12hToMins(time: string, ap: 'AM' | 'PM'): number | null {
  const match = time.match(/^(\d{1,2}):?(\d{2})?$/);
  if (!match) return null;
  let h = parseInt(match[1]);
  const m = parseInt(match[2] ?? '0');
  if (h < 1 || h > 12 || m < 0 || m > 59) return null;
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

/** Calculate hours difference between two 24-h time strings (HH:MM). */
export function calcHours24(startTime: string, endTime: string): number {
  const s = parseTime24(startTime);
  const e = parseTime24(endTime);
  if (!s || !e) return 0;
  const diff = e.h * 60 + e.m - (s.h * 60 + s.m);
  return diff > 0 ? diff / 60 : 0;
}

/** Calculate hours difference for 12-h times with AM/PM (timesheet startend mode). */
export function calcHours12(
  startTime: string, startAP: 'AM' | 'PM',
  endTime:   string, endAP:   'AM' | 'PM',
): number {
  const s = parse12hToMins(startTime, startAP);
  const e = parse12hToMins(endTime, endAP);
  if (s === null || e === null) return 0;
  const diff = e - s;
  return diff > 0 ? diff / 60 : 0;
}

/** Convert a 24-h "HH:MM" string to 12-h parts e.g. { time: "9:00", ap: "AM" }. */
export function to12h(time24: string): { time: string; ap: 'AM' | 'PM' } {
  const parts = parseTime24(time24);
  if (!parts) return { time: '', ap: 'AM' };
  const { h, m } = parts;
  const ap: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return { time: `${h12}:${String(m).padStart(2, '0')}`, ap };
}

/** Convert "08:00" → "8:00 AM", "14:30" → "2:30 PM" */
export function formatTime12h(time24: string): string {
  const { time, ap } = to12h(time24);
  return time ? `${time} ${ap}` : time24;
}

/** Round hours to one decimal place. */
export function hoursDisplay(h: number): string {
  return `${h.toFixed(1)}h`;
}
