'use client';
import { useEffect, useState } from 'react';
import { useTimesheetStore } from '../../store/timesheetStore';
import { getWeekDays } from '../../utils/date';

/* ── Icon SVG strings (matching HTML icon() fn) ── */
const ICONS: Record<string, React.ReactNode> = {
  work: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-[11px] h-[11px]">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  leave: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-[11px] h-[11px]">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  travel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-[11px] h-[11px]">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8v4.2c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
    </svg>
  ),
  training: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-[11px] h-[11px]">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  project: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-[11px] h-[11px]">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  ooo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-[11px] h-[11px]">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
};

/* ── Row-icon background / text colours – exact match to HTML ── */
const ICON_CLS: Record<string, string> = {
  work:     'bg-[#dbeafe] text-[#2563eb]',
  leave:    'bg-[#ede9fe] text-[#7c3aed]',
  travel:   'bg-[#fef3c7] text-[#d97706]',
  training: 'bg-[#d1fae5] text-[#059669]',
  project:  'bg-[#fce7f3] text-[#db2777]',
  ooo:      'bg-[#fed7aa] text-[#ea580c]',
};

const PROJECTS = [
  { id: '', label: '-' },
  { id: 'client',    label: 'Client'    },
  { id: 'inhome',    label: 'In-Home'   },
  { id: 'respite',   label: 'Respite'   },
  { id: 'community', label: 'Community' },
  { id: 'admin',     label: 'Admin'     },
];

export default function TimesheetTable() {
  const {
    entryTypes, rows, weekStart, inputType, timesheetType,
    updateCell, getDayTotal, getRowTotal, getGrandTotal,
    selectedWorker,
  } = useTimesheetStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const days = mounted ? getWeekDays(weekStart) : [];

  const allTypes = timesheetType === 'project'
    ? [...entryTypes, { id: 'project', label: 'Project', icon: 'project', isProject: true }]
    : entryTypes.map((t) => ({ ...t, isProject: false }));

  if (!selectedWorker) {
    return (
      <div className="p-12 text-center text-[#64748b] text-sm">
        Select a worker from the config panel above to view their timesheet.
      </div>
    );
  }

  return (
    /* timesheet-table-wrapper */
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full border-collapse text-[11px]" style={{ minWidth: 900 }}>

        {/* ── thead – matches HTML .timesheet-table thead ── */}
        <thead>
          <tr>
            {/* Row label header */}
            <th className="border border-[#e5e7eb] pl-[10px] pr-2 py-2 text-left font-semibold text-[#475569] text-[10px] min-w-[110px] bg-[#e2e8f0]">
              Entry Type
            </th>

            {/* Day headers */}
            {days.map((d) => {
              let cls = 'day-header border border-[#e5e7eb] px-1 py-2 text-center min-w-[85px]';
              if (d.isWeekend)  cls += ' bg-[#fef9c3]';
              else if (d.isToday) cls += ' bg-[#dcfce7]';
              else cls += ' bg-[#f1f5f9]';

              return (
                <th key={d.key} className={cls}>
                  <div className="text-[9px] font-semibold uppercase text-[#64748b]">{d.name}</div>
                  <div className={`text-[13px] font-bold mt-0.5 ${d.isToday ? 'text-[#16a34a]' : 'text-[#1e293b]'}`}>
                    {d.date}
                  </div>
                </th>
              );
            })}

            {/* Total header – bg-[#dbeafe] text-[#1e40af] */}
            <th className="border border-[#e5e7eb] px-1 py-2 text-center min-w-[50px] bg-[#dbeafe] text-[#1e40af] font-semibold text-[10px]">
              Total
            </th>
          </tr>
        </thead>

        {/* ── tbody ── */}
        <tbody>
          {allTypes.map((type) => {
            const row = rows[type.id] ?? {};
            const rowTotal = getRowTotal(type.id);

            return (
              <tr key={type.id}>
                {/* Row label – matches HTML .row-label */}
                <td className="border border-[#e5e7eb] px-2 py-1.5 bg-[#f8fafc]">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${ICON_CLS[type.icon] ?? 'bg-slate-100 text-slate-500'}`}>
                      {ICONS[type.icon] ?? ICONS.work}
                    </div>
                    <span className="font-semibold text-[#334155] text-[11px]">{type.label}</span>
                  </div>
                </td>

                {/* Day cells */}
                {days.map((d) => {
                  const cell = row[d.key] ?? { hours: 0, startTime: '', startAP: 'AM' as const, endTime: '', endAP: 'PM' as const, proj: '' };
                  const hasVal = cell.hours > 0;

                  let cellCls = 'border border-[#e5e7eb] p-0 text-center align-top';
                  if (d.isWeekend) cellCls += ' bg-[#fffbeb]';
                  else if (hasVal) cellCls += ' bg-[#f0fdf4]';
                  else cellCls += ' bg-white';

                  return (
                    <td key={d.key} className={cellCls}>

                      {inputType === 'hours' ? (
                        /* Hours-only mode */
                        <div>
                          {type.isProject && (
                            /* Project selector */
                            <select
                              value={cell.proj}
                              onChange={(e) => updateCell(type.id, d.key, 'proj', e.target.value)}
                              className="w-full px-0.5 py-0.5 border border-[#e5e7eb] rounded-sm text-[8px] bg-[#fdf4ff] text-[#7e22ce] outline-none cursor-pointer mb-0.5"
                              style={{ fontSize: 8 }}>
                              {PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                            </select>
                          )}
                          <input
                            type="number"
                            value={cell.hours || ''}
                            placeholder="0"
                            min={0} max={24} step={0.5}
                            onChange={(e) => updateCell(type.id, d.key, 'hours', parseFloat(e.target.value) || 0)}
                            className="w-full py-2 px-0.5 text-center text-sm font-semibold outline-none bg-transparent placeholder-[#d1d5db]"
                            style={{ color: cell.hours > 0 ? '#0284c7' : '#1e293b' }}
                          />
                        </div>
                      ) : (
                        /* Start/End Time mode – matches HTML .time-entry */
                        <div className="flex flex-col gap-0.5 p-0.5">
                          {type.isProject && (
                            <select
                              value={cell.proj}
                              onChange={(e) => updateCell(type.id, d.key, 'proj', e.target.value)}
                              className="w-full px-0.5 py-0.5 border border-[#e5e7eb] rounded-sm text-[8px] bg-[#fdf4ff] text-[#7e22ce] outline-none cursor-pointer mb-0.5"
                              style={{ fontSize: 8 }}>
                              {PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                            </select>
                          )}

                          {/* In row */}
                          <div className="flex items-center justify-center gap-0.5">
                            <span className="text-[8px] font-bold text-[#9ca3af] uppercase w-4 text-right">In</span>
                            <input
                              type="text"
                              value={cell.startTime}
                              placeholder="9:00"
                              onChange={(e) => updateCell(type.id, d.key, 'startTime', e.target.value)}
                              className="w-9 py-0.5 px-0.5 border border-[#e5e7eb] rounded-sm text-[11px] text-center bg-white outline-none focus:border-[#0ea5e9] text-[#374151] placeholder-[#d1d5db]"
                            />
                            <select
                              value={cell.startAP}
                              onChange={(e) => updateCell(type.id, d.key, 'startAP', e.target.value)}
                              className="w-8 py-0.5 px-0.5 border border-[#e5e7eb] rounded-sm text-[9px] bg-white outline-none focus:border-[#0ea5e9] cursor-pointer text-[#374151]">
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>

                          {/* Out row */}
                          <div className="flex items-center justify-center gap-0.5">
                            <span className="text-[8px] font-bold text-[#9ca3af] uppercase w-4 text-right">Out</span>
                            <input
                              type="text"
                              value={cell.endTime}
                              placeholder="5:00"
                              onChange={(e) => updateCell(type.id, d.key, 'endTime', e.target.value)}
                              className="w-9 py-0.5 px-0.5 border border-[#e5e7eb] rounded-sm text-[11px] text-center bg-white outline-none focus:border-[#0ea5e9] text-[#374151] placeholder-[#d1d5db]"
                            />
                            <select
                              value={cell.endAP}
                              onChange={(e) => updateCell(type.id, d.key, 'endAP', e.target.value)}
                              className="w-8 py-0.5 px-0.5 border border-[#e5e7eb] rounded-sm text-[9px] bg-white outline-none focus:border-[#0ea5e9] cursor-pointer text-[#374151]">
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>

                          {/* Calc hours display */}
                          {cell.hours > 0 ? (
                            <div className="text-center text-[9px] font-bold text-[#0369a1] bg-[#e0f2fe] rounded px-0.5 mt-0.5">
                              {cell.hours.toFixed(1)}h
                            </div>
                          ) : (
                            <div className="text-center text-[9px] text-[#d1d5db] mt-0.5">-</div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}

                {/* Row total – matches HTML .total-cell */}
                <td className="border border-[#e5e7eb] px-1 py-1.5 text-center font-bold text-[#1e40af] text-xs bg-[#eff6ff]">
                  {rowTotal.toFixed(1)}
                </td>
              </tr>
            );
          })}
        </tbody>

        {/* ── tfoot – dark navy matching HTML exactly ── */}
        <tfoot>
          <tr>
            {/* "Daily Total" label – bg #1e3a5f text-right */}
            <td className="border border-[#1e3a5f] px-2.5 py-2 text-right font-semibold text-xs text-white"
              style={{ backgroundColor: '#1e3a5f' }}>
              Daily Total
            </td>

            {days.map((d) => (
              <td key={d.key}
                className="border border-[#1e3a5f] px-1 py-2 text-center font-semibold text-xs text-white"
                style={{ backgroundColor: '#1e3a5f' }}>
                {getDayTotal(d.key).toFixed(1)}
              </td>
            ))}

            {/* Grand total – bg #0ea5e9 */}
            <td className="border border-[#0ea5e9] px-1 py-2 text-center font-bold text-sm text-white"
              style={{ backgroundColor: '#0ea5e9' }}>
              {getGrandTotal().toFixed(1)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
