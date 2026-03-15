'use client';
import { useEffect, useState } from 'react';
import { Clock, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { logApi } from '../../utils/api';
import type { ShiftLog } from '../../types';

const ACTION_COLORS: Record<string, string> = {
  CREATE:        'bg-emerald-100 text-emerald-700',
  UPDATE:        'bg-blue-100    text-blue-700',
  STATUS_CHANGE: 'bg-amber-100   text-amber-700',
  DELETE:        'bg-red-100     text-red-700',
};

const PAGE_SIZE = 15;

export default function LogsPageClient() {
  const [logs,    setLogs]    = useState<ShiftLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');
  const [page,    setPage]    = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const data = await logApi.getAll({ limit: 500 });
      setLogs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Reset to page 1 when filter changes
  useEffect(() => { setPage(1); }, [filter]);

  const filtered = logs.filter((l) => {
    const q = filter.toLowerCase();
    return (
      !q ||
      l.worker_name.toLowerCase().includes(q) ||
      l.participant_name.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.service_type.toLowerCase().includes(q)
    );
  });

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const pageStart   = (safePage - 1) * PAGE_SIZE;
  const paginated   = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const goTo  = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  // Generate page numbers to show (max 7 buttons with ellipsis)
  const pageNumbers = (): (number | '…')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (safePage <= 4)   return [1, 2, 3, 4, 5, '…', totalPages];
    if (safePage >= totalPages - 3) return [1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '…', safePage - 1, safePage, safePage + 1, '…', totalPages];
  };

  return (
    <div className="min-h-screen bg-slate-100">

      <header style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' }}
        className="sticky top-0 z-40 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)' }}
            className="w-9 h-9 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">HR Nexus</h1>
            <span className="text-[#94a3b8] text-[11px]">Audit Logs</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">

          {/* Toolbar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-semibold text-slate-900">Scheduling Audit Logs</h2>
              <p className="text-xs text-slate-500 mt-0.5">All shift actions logged in ClickHouse</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Search logs…"
                  className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button onClick={load} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                <RefreshCw className={`w-4 h-4 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm animate-pulse">Loading logs…</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: 900 }}>
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs text-slate-500 uppercase font-medium">
                    {['Action', 'Worker', 'Participant', 'Date', 'Time', 'Service', 'Status', 'Performed By', 'Logged At'].map((h) => (
                      <th key={h} className="px-4 py-2.5 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-10 text-center text-slate-400">No logs found.</td>
                    </tr>
                  )}
                  {paginated.map((log, i) => (
                    <tr key={`${log.id}-${i}`} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${ACTION_COLORS[log.action] ?? 'bg-slate-100 text-slate-600'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-medium text-slate-800">{log.worker_name}</td>
                      <td className="px-4 py-2.5 text-slate-600">{log.participant_name}</td>
                      <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">{log.shift_date}</td>
                      <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">{log.start_time}–{log.end_time}</td>
                      <td className="px-4 py-2.5 text-slate-600">{log.service_type}</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${
                          log.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                          log.status === 'pending'   ? 'bg-amber-100 text-amber-700'    : 'bg-slate-100 text-slate-600'
                        }`}>{log.status}</span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-500">{log.performed_by}</td>
                      <td className="px-4 py-2.5 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString('en-AU')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer: count + pagination */}
          {!loading && (
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-3">

              {/* Entry count */}
              <p className="text-xs text-slate-400">
                Showing{' '}
                <span className="font-medium text-slate-600">
                  {filtered.length === 0 ? 0 : pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, filtered.length)}
                </span>{' '}
                of{' '}
                <span className="font-medium text-slate-600">{filtered.length}</span> entries
                {filter && <span className="ml-1">(filtered from {logs.length} total)</span>}
              </p>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  {/* Prev */}
                  <button
                    onClick={() => goTo(safePage - 1)}
                    disabled={safePage === 1}
                    className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {/* Page numbers */}
                  {pageNumbers().map((p, idx) =>
                    p === '…' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-xs text-slate-400 select-none">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goTo(p)}
                        className={`min-w-[30px] h-[30px] rounded-md text-xs font-medium border transition-colors ${
                          p === safePage
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  {/* Next */}
                  <button
                    onClick={() => goTo(safePage + 1)}
                    disabled={safePage === totalPages}
                    className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
