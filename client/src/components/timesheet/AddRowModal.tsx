'use client';
import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { useTimesheetStore } from '../../store/timesheetStore';

const ICON_OPTIONS = [
  { value: 'work',     label: 'Work',         bg: 'bg-[#dbeafe]', text: 'text-[#2563eb]' },
  { value: 'leave',    label: 'Leave',         bg: 'bg-[#ede9fe]', text: 'text-[#7c3aed]' },
  { value: 'travel',   label: 'Travel',        bg: 'bg-[#fef3c7]', text: 'text-[#d97706]' },
  { value: 'training', label: 'Training',      bg: 'bg-[#d1fae5]', text: 'text-[#059669]' },
  { value: 'project',  label: 'Project',       bg: 'bg-[#fce7f3]', text: 'text-[#db2777]' },
  { value: 'ooo',      label: 'Out of Office', bg: 'bg-[#fed7aa]', text: 'text-[#ea580c]' },
];

const ICON_SVGS: Record<string, React.ReactNode> = {
  work: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  leave: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  travel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8v4.2c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
    </svg>
  ),
  training: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  project: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  ooo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
};

interface AddRowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddRowModal({ isOpen, onClose }: AddRowModalProps) {
  const { addRow } = useTimesheetStore();
  const [label,    setLabel]    = useState('');
  const [icon,     setIcon]     = useState('work');
  const [error,    setError]    = useState('');

  // Reset on open
  useEffect(() => {
    if (isOpen) { setLabel(''); setIcon('work'); setError(''); }
  }, [isOpen]);

  const handleAdd = () => {
    const trimmed = label.trim();
    if (!trimmed) { setError('Please enter a name for this row.'); return; }
    addRow(trimmed, icon);
    onClose();
  };

  const selected = ICON_OPTIONS.find((o) => o.value === icon)!;

  return (
    <Modal
      isOpen={isOpen}
      title="Add Timesheet Row"
      onClose={onClose}
      maxWidth="max-w-sm"
      footer={
        <div className="flex items-center gap-2 w-full justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            Add Row
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">

        {/* Row Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5">Row Name</label>
          <input
            autoFocus
            value={label}
            onChange={(e) => { setLabel(e.target.value); setError(''); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            placeholder="e.g. Overtime, On-call, Allowance…"
            className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-200 focus:border-blue-500'
            }`}
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        {/* Icon / Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Category Icon</label>
          <div className="grid grid-cols-3 gap-2">
            {ICON_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setIcon(opt.value)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                  icon === opt.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-400'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${opt.bg} ${opt.text}`}>
                  {ICON_SVGS[opt.value]}
                </span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Preview</p>
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${selected.bg} ${selected.text}`}>
              {ICON_SVGS[icon]}
            </span>
            <span className="text-sm font-semibold text-slate-700">{label || 'Row name…'}</span>
          </div>
        </div>

      </div>
    </Modal>
  );
}
