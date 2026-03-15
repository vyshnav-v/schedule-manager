'use client';
import { CalendarDays, Clock, Pencil } from 'lucide-react';
import Modal from '../ui/Modal';
import Avatar from '../ui/Avatar';
import StatusBadge from '../ui/StatusBadge';
import { useScheduleStore } from '../../store/scheduleStore';
export default function ShiftDetailModal() {
  const { shiftDetailId, shifts, closeShiftDetail, openShiftModal } = useScheduleStore();
  const shift = shiftDetailId ? shifts.find((s) => s._id === shiftDetailId) : null;

  if (!shift) return null;

  const handleEdit = () => {
    closeShiftDetail();
    openShiftModal({ mode: 'edit', shiftId: shift._id });
  };

  return (
    <Modal
      isOpen={!!shiftDetailId}
      title="Shift Details"
      onClose={closeShiftDetail}
      footer={
        <div className="flex items-center justify-between w-full gap-2">
          <button onClick={closeShiftDetail} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm">Close</button>
          <button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Pencil className="w-4 h-4" /> Edit Shift
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Worker → Participant */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Avatar initials={shift.workerId.avatar} color={shift.workerId.color} />
            <div>
              <div className="text-xs text-slate-500">Worker</div>
              <div className="font-semibold text-slate-900 text-sm">{shift.workerId.name}</div>
            </div>
          </div>
          <div className="text-slate-300 text-lg">→</div>
          <div className="flex items-center gap-2">
            <Avatar initials={shift.participantId.avatar} color={shift.participantId.color} />
            <div>
              <div className="text-xs text-slate-500">Participant</div>
              <div className="font-semibold text-slate-900 text-sm">{shift.participantId.name}</div>
            </div>
          </div>
        </div>

        {/* Grid details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Date</div>
            <div className="text-sm font-medium text-slate-800">
            {new Date(shift.date + 'T00:00:00').toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Time</div>
            <div className="text-sm font-medium text-slate-800">{shift.startTime} – {shift.endTime}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500 mb-1">Service Type</div>
            <div className="text-sm font-medium text-slate-800">{shift.serviceType}</div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="text-xs text-slate-500 mb-1">Status</div>
            <StatusBadge status={shift.status} />
          </div>
        </div>

        {/* Notes */}
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="text-xs text-slate-500 mb-1">Notes</div>
          <div className="text-sm text-slate-800">
            {shift.notes || <span className="text-slate-400 italic">No notes added</span>}
          </div>
        </div>
      </div>
    </Modal>
  );
}
