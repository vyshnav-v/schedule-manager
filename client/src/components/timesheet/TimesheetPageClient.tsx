"use client";
import { useState } from "react";
import { Clock, Plus, CheckCircle } from "lucide-react";
import ConfigPanel from "./ConfigPanel";
import WeekNav from "./WeekNav";
import TimesheetTable from "./TimesheetTable";
import AddRowModal from "./AddRowModal";
import { useTimesheetStore } from "../../store/timesheetStore";
import { useTimesheetData } from "../../hooks/useTimesheetData";
import { getWeekDays } from "../../utils/date";

const DAYS_ORDER = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export default function TimesheetPageClient() {
  useTimesheetData();

  const {
    selectedWorker,
    getGrandTotal,
    getRowTotal,
    error,
    isLoading,
    entryTypes,
    rows,
    weekStart,
  } = useTimesheetStore();

  const [saveMsg, setSaveMsg] = useState("");
  const [addRowOpen, setAddRowOpen] = useState(false);

  const grandTotal = getGrandTotal();
  const leaveTotal = getRowTotal("leave");
  const overtime = Math.max(0, grandTotal - 38);

  const workerName = selectedWorker?.name ?? "HR Nexus";
  const workerInitials = selectedWorker?.avatar ?? "HR";
  const workerColor = selectedWorker?.color ?? "#10b981";

  const handleAddRow = () => setAddRowOpen(true);

  // ── Export CSV ──────────────────────────────────────────────────────────────
  const handleExport = () => {
    const days = getWeekDays(weekStart);

    // Header row
    const headers = [
      "Entry Type",
      ...days.map((d) => `${d.name} ${d.date} ${d.month}`),
      "Total",
    ];
    const csvRows: string[][] = [headers];

    entryTypes.forEach((type) => {
      const row = rows[type.id] ?? {};
      const dayCells = DAYS_ORDER.map((dk) => {
        const cell = row[dk];
        return cell?.hours ? String(cell.hours) : "0";
      });
      const total = dayCells.reduce((s, v) => s + parseFloat(v), 0);
      csvRows.push([type.label, ...dayCells, total.toFixed(1)]);
    });

    // Totals footer row
    const dayTotals = DAYS_ORDER.map((dk) =>
      entryTypes
        .reduce((s, t) => s + (rows[t.id]?.[dk]?.hours ?? 0), 0)
        .toFixed(1),
    );
    csvRows.push(["Daily Total", ...dayTotals, grandTotal.toFixed(1)]);

    const csv = csvRows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const workerLabel = selectedWorker
      ? selectedWorker.name.replace(/\s+/g, "_")
      : "Timesheet";
    const weekLabel = days[0] ? `${days[0].date}_${days[0].month}` : "week";
    const filename = `${workerLabel}_${weekLabel}.csv`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Save (local state toast) ────────────────────────────────────────────────
  const handleSave = () => {
    setSaveMsg("Timesheet saved!");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-100">
        {/* Dark gradient header */}
        <header
          style={{
            background: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
          }}
          className="sticky top-0 z-40 px-5 py-3 flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{
                background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              }}
              className="w-9 h-9 rounded-lg flex items-center justify-center"
            >
              <Clock className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">
                HR Nexus
              </h1>
              <span className="text-[#94a3b8] text-[11px]">
                Timesheet Management
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white text-sm">
              <span className="text-[#94a3b8] text-[13px]">{workerName}</span>
              <div
                style={{
                  background: `linear-gradient(135deg, ${workerColor}, ${workerColor}cc)`,
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs"
              >
                {workerInitials}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-[1400px] mx-auto p-4">
          {/* Error banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error} — make sure the server is running on port 5000.
            </div>
          )}

          {/* Loading skeleton */}
          {isLoading && !error && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg text-sm animate-pulse">
              Loading timesheet data…
            </div>
          )}

          {/* Save toast */}
          {saveMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2 transition-all">
              <CheckCircle className="w-4 h-4 shrink-0" />
              {saveMsg}
            </div>
          )}

          <ConfigPanel />

          <div
            className="bg-white rounded-[10px] border border-[#e2e8f0] overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
            <div className="px-[18px] py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <h2 className="text-sm font-semibold text-slate-900">
                  {selectedWorker
                    ? `${selectedWorker.name.split(" ")[0]}'s Timesheet`
                    : "Weekly Timesheet"}
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

            <button
              onClick={handleAddRow}
              className="inline-flex items-center gap-1 m-2 px-2.5 py-1.5 border border-dashed border-[#cbd5e1] rounded text-[10px] font-medium text-[#64748b] hover:border-[#0ea5e9] hover:text-[#0ea5e9] hover:bg-[#f0f9ff] transition-colors cursor-pointer"
            >
              <Plus className="w-2.5 h-2.5" />
              Add Row
            </button>

            <div className="px-[18px] py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 flex-wrap gap-3">
              <div className="flex items-center gap-4 text-xs text-[#64748b]">
                <div className="flex items-center gap-1">
                  <span>Total:</span>
                  <strong className="text-slate-900 font-bold">
                    {grandTotal.toFixed(1)}h
                  </strong>
                </div>
                <div className="flex items-center gap-1">
                  <span>Overtime:</span>
                  <strong
                    className={`font-bold ${overtime > 0 ? "text-amber-600" : "text-slate-900"}`}
                  >
                    {overtime.toFixed(1)}h
                  </strong>
                </div>
                <div className="flex items-center gap-1">
                  <span>Leave:</span>
                  <strong className="text-slate-900 font-bold">
                    {leaveTotal.toFixed(1)}h
                  </strong>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  disabled={!selectedWorker}
                  className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-md text-xs font-semibold text-[#475569] bg-white hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Export
                </button>
                <button
                  onClick={handleSave}
                  disabled={!selectedWorker}
                  className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 rounded-md text-xs font-semibold text-[#475569] bg-white hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Save
                </button>
                <button
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold text-white transition-colors"
                  style={{
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                    boxShadow: "0 2px 6px rgba(14,165,233,0.25)",
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddRowModal isOpen={addRowOpen} onClose={() => setAddRowOpen(false)} />
    </>
  );
}
