'use client';
import { useTimesheetStore } from '../../store/timesheetStore';

export default function ConfigPanel() {
  const {
    workers, selectedWorker, setSelectedWorker,
    payPeriod, setPayPeriod,
    workType, setWorkType,
    timesheetType, setTimesheetType,
    inputType, setInputType,
  } = useTimesheetStore();

  const handleWorker = (id: string) => {
    const w = workers.find((w) => w._id === id) ?? null;
    setSelectedWorker(w);
  };

  /* Derive avatar colour for the employee-select-wrapper avatar */
  const avatarColor = selectedWorker?.color ?? '#10b981';
  const initials    = selectedWorker?.avatar ?? '?';

  return (
    /* config-panel – matches HTML exactly */
    <div className="bg-white rounded-[10px] px-[18px] py-3.5 mb-4 border border-[#e2e8f0]" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div className="flex gap-5 items-center flex-wrap">

        {/* Employee */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold text-[#64748b] uppercase">Employee:</label>
          {/* employee-select-wrapper */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 border-[1.5px] border-slate-200 rounded-lg bg-white cursor-pointer focus-within:border-[#0ea5e9] transition-colors"
            style={{ boxShadow: undefined }}>
            {/* employee-avatar-sm */}
            <div
              className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}cc)` }}>
              {initials}
            </div>
            <select
              value={selectedWorker?._id ?? ''}
              onChange={(e) => handleWorker(e.target.value)}
              className="border-none outline-none text-xs font-semibold text-[#1e293b] bg-transparent cursor-pointer min-w-[140px] p-0">
              <option value="">Select worker…</option>
              {workers.map((w) => (
                <option key={w._id} value={w._id}>{w.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pay Period */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold text-[#64748b] uppercase">Pay Period:</label>
          <select
            value={payPeriod}
            onChange={(e) => setPayPeriod(e.target.value as typeof payPeriod)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-[#1e293b] bg-white outline-none cursor-pointer focus:border-[#0ea5e9]">
            <option value="weekly">Weekly</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Work Type */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold text-[#64748b] uppercase">Work Type:</label>
          <select
            value={workType}
            onChange={(e) => setWorkType(e.target.value as typeof workType)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-[#1e293b] bg-white outline-none cursor-pointer focus:border-[#0ea5e9]">
            <option value="shift">Shift Work</option>
            <option value="office">Office Work</option>
          </select>
        </div>

        {/* Timesheet Type */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold text-[#64748b] uppercase">Timesheet Type:</label>
          <select
            value={timesheetType}
            onChange={(e) => setTimesheetType(e.target.value as typeof timesheetType)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-[#1e293b] bg-white outline-none cursor-pointer focus:border-[#0ea5e9]">
            <option value="general">General</option>
            <option value="project">Project Based</option>
          </select>
        </div>

        {/* Entry Type */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold text-[#64748b] uppercase">Entry Type:</label>
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value as typeof inputType)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-[#1e293b] bg-white outline-none cursor-pointer focus:border-[#0ea5e9]">
            <option value="hours">Only Hours</option>
            <option value="startend">Start / End Time</option>
          </select>
        </div>
      </div>
    </div>
  );
}
