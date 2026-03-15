'use client';
import { Clock, Plus } from 'lucide-react';
import ConfigPanel from './ConfigPanel';
import WeekNav from './WeekNav';
import TimesheetTable from './TimesheetTable';
import { useTimesheetStore } from '../../store/timesheetStore';
import { useTimesheetData } from '../../hooks/useTimesheetData';

export default function TimesheetPageClient() {
  useTimesheetData();

  const { selectedWorker, addRow, getGrandTotal, getRowTotal } = useTimesheetStore();

  const grandTotal = getGrandTotal();
  const leaveTotal = getRowTotal('leave');
  const overtime   = Math.max(0, grandTotal - 38);

  const workerName     = selectedWorker?.name ?? 'HR Nexus';
  const workerInitials = selectedWorker?.avatar ?? 'HR';
  const workerColor    = selectedWorker?.color ?? '#10b981';

  const handleAddRow = () => {
    const name = prompt('Enter new entry type name:');
    if (name?.trim()) addRow(name.trim());
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Dark gradient header */}
      <header style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' }}
        className="sticky top-0 z-40 px-5 py-3 flex items-center justify-between">

        <div className="flex items-center gap-2.5">
          <div style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)' }}
            className="w-9 h-9 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">HR Nexus</h1>
            <span className="text-[#94a3b8] text-[11px]">Timesheet Management</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white text-sm">
            <span className="text-[#94a3b8] text-[13px]">{workerName}</span>
            <div style={{ background: `linear-gradient(135deg, ${workerColor}, ${workerColor}cc)` }}
              className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs">
              {workerInitials}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto p-4">

        <ConfigPanel />

        <div className="bg-white rounded-[10px] border border-[#e2e8f0] overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>

          <div className="px-[18px] py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <h2 className="text-sm font-semibold text-slate-900">
                {selectedWorker ? `${selectedWorker.name.split(' ')[0]}'s Timesheet` : 'Weekly Timesheet'}
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded bg-[#f3f4f6] text-[#6b7280]">
                Draft
              </span>
            </div>
            <WeekNav />
          </div>

          <div className="overflow-x-auto">
            <TimesheetTable />
          </div>

          <button onClick={handleAddRow}
            className="inline-flex items-center gap-1 m-2 px-2.5 py-1.5 border border-dashed border-[#cbd5e1] rounded text-[10px] font-medium text-[#64748b] hover:border-[#0ea5e9] hover:text-[#0ea5e9] hover:bg-[#f0f9ff] transition-colors cursor-pointer">
            <Plus className="w-2.5 h-2.5" />
            Add Row
          </button>

          <div className="px-[18px] py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 flex-wrap gap-3">
            <div className="flex items-center gap-4 text-xs text-[#64748b]">
              <div className="flex items-center gap-1">
                <span>Total:</span>
                <strong className="text-slate-900 font-bold">{grandTotal.toFixed(1)}h</strong>
              </div>
              <div className="flex items-center gap-1">
                <span>Overtime:</span>
                <strong className="text-slate-900 font-bold">{overtime.toFixed(1)}h</strong>
              </div>
              <div className="flex items-center gap-1">
                <span>Leave:</span>
                <strong className="text-slate-900 font-bold">{leaveTotal.toFixed(1)}h</strong>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-md text-xs font-semibold text-[#475569] bg-white hover:bg-slate-50 transition-colors">
                Export
              </button>
              <button className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-md text-xs font-semibold text-[#475569] bg-white hover:bg-slate-50 transition-colors">
                Save
              </button>
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold text-white transition-colors"
                style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', boxShadow: '0 2px 6px rgba(14,165,233,0.25)' }}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
