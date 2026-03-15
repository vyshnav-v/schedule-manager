'use client';
import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { useScheduleStore } from '../../store/scheduleStore';
import { shiftApi } from '../../utils/api';
import { SERVICE_TYPES, SERVICE_TYPE_LABELS } from '../../constants';
import type { CreateShiftPayload, ServiceType } from '../../types';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINS = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

function timeToHM(t: string): { h: string; m: string } {
  const [h = '08', m = '00'] = t.split(':');
  return { h: h.padStart(2, '0'), m: m.padStart(2, '0') };
}

export default function ShiftModal() {
  const {
    shiftModal, closeShiftModal, shifts,
    workers,
    getLinkedParticipants,
    addShift, updateShift,
  } = useScheduleStore();

  const { isOpen, mode, shiftId, prefillWorkerId, prefillParticipantId, prefillDate } = shiftModal;

  const existing = shiftId ? shifts.find((s) => s._id === shiftId) : null;

  const [workerId,       setWorkerId]       = useState('');
  const [participantId,  setParticipantId]  = useState('');
  const [date,           setDate]           = useState('');
  const [startH, setStartH] = useState('08');
  const [startM, setStartM] = useState('00');
  const [endH,   setEndH]   = useState('16');
  const [endM,   setEndM]   = useState('00');
  const [serviceType,    setServiceType]    = useState<ServiceType>('Personal Care');
  const [notes,          setNotes]          = useState('');
  const [saving,         setSaving]         = useState(false);
  const [errors,         setErrors]         = useState<Record<string, boolean>>({});

  // Pre-fill on open — intentionally only re-runs when modal opens/closes,
  // not on every prefill prop change (they are captured at open time)
  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && existing) {
      setWorkerId(existing.workerId._id);
      setParticipantId(existing.participantId._id);
      setDate(existing.date);
      const { h: sh, m: sm } = timeToHM(existing.startTime);
      const { h: eh, m: em } = timeToHM(existing.endTime);
      setStartH(sh); setStartM(sm); setEndH(eh); setEndM(em);
      setServiceType(existing.serviceType);
      setNotes(existing.notes ?? '');
    } else {
      setWorkerId(prefillWorkerId ?? '');
      setParticipantId(prefillParticipantId ?? '');
      setDate(prefillDate ?? '');
      setStartH('08'); setStartM('00'); setEndH('16'); setEndM('00');
      setServiceType('Personal Care');
      setNotes('');
    }
    setErrors({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const linkedParticipants = workerId ? getLinkedParticipants(workerId) : [];

  // When worker changes in create mode, reset participant
  const handleWorkerChange = (id: string) => {
    setWorkerId(id);
    setParticipantId('');
  };

  const validate = () => {
    const e: Record<string, boolean> = {};
    if (!workerId)      e.workerId = true;
    if (!participantId) e.participantId = true;
    if (!date)          e.date = true;
    if (!serviceType)   e.serviceType = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: CreateShiftPayload = {
        workerId,
        participantId,
        date,
        startTime: `${startH}:${startM}`,
        endTime:   `${endH}:${endM}`,
        serviceType,
        notes,
      };
      if (mode === 'edit' && shiftId) {
        const updated = await shiftApi.update(shiftId, payload);
        // Ensure populated objects — fall back to store data if server returns plain IDs
        const { workers: storeWorkers, participants: storeParticipants } = useScheduleStore.getState();
        if (typeof updated.workerId === 'string' || !updated.workerId?.name) {
          updated.workerId = storeWorkers.find((w) => w._id === (updated.workerId as unknown as string) || w._id === updated.workerId?._id) ?? updated.workerId;
        }
        if (typeof updated.participantId === 'string' || !updated.participantId?.name) {
          updated.participantId = storeParticipants.find((p) => p._id === (updated.participantId as unknown as string) || p._id === updated.participantId?._id) ?? updated.participantId;
        }
        updateShift(updated);
      } else {
        const created = await shiftApi.create(payload);
        // Ensure populated objects — fall back to store data if server returns plain IDs
        const { workers: storeWorkers, participants: storeParticipants } = useScheduleStore.getState();
        if (typeof created.workerId === 'string' || !created.workerId?.name) {
          (created as unknown as Record<string, unknown>).workerId =
            storeWorkers.find((w) => w._id === (created.workerId as unknown as string)) ?? created.workerId;
        }
        if (typeof created.participantId === 'string' || !created.participantId?.name) {
          (created as unknown as Record<string, unknown>).participantId =
            storeParticipants.find((p) => p._id === (created.participantId as unknown as string)) ?? created.participantId;
        }
        addShift(created);
      }
      closeShiftModal();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const inputCls = (field: string) =>
    `w-full p-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 ${errors[field] ? 'border-red-400 ring-1 ring-red-300' : 'border-slate-200 focus:border-blue-500'}`;

  const title = mode === 'edit' ? 'Edit Shift' : prefillWorkerId
    ? `New Shift — ${workers.find((w) => w._id === prefillWorkerId)?.name ?? ''}`
    : 'Create New Shift';

  // When both worker and participant are pre-filled (e.g. from Matrix "+" click),
  // show all participants so the pre-filled one is always visible regardless of link status
  const allParticipants = useScheduleStore.getState().participants;
  const availableParticipants =
    workerId && prefillParticipantId
      ? allParticipants          // both pre-filled → show all so the pair is always selectable
      : workerId
        ? linkedParticipants     // only worker pre-filled → show only linked
        : allParticipants;       // nothing pre-filled → show all

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={closeShiftModal}
      footer={
        <>
          <button onClick={closeShiftModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : mode === 'edit' ? 'Save Changes' : 'Create Shift'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Worker */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Support Worker</label>
          <select value={workerId} onChange={(e) => handleWorkerChange(e.target.value)} className={inputCls('workerId')}>
            <option value="">Select a worker…</option>
            {workers.map((w) => <option key={w._id} value={w._id}>{w.name}</option>)}
          </select>
        </div>

        {/* Participant */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Participant</label>
          <select value={participantId} onChange={(e) => setParticipantId(e.target.value)} className={inputCls('participantId')}>
            <option value="">Select a participant…</option>
            {availableParticipants.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          {workerId && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              Only showing participants linked to selected worker
            </p>
          )}
        </div>

        {/* Date + Times */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls('date')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Start Time</label>
            <div className="flex gap-1">
              <select value={startH} onChange={(e) => setStartH(e.target.value)} className="flex-1 p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                {HOURS.map((h) => <option key={h}>{h}</option>)}
              </select>
              <span className="flex items-center text-slate-400 font-bold">:</span>
              <select value={startM} onChange={(e) => setStartM(e.target.value)} className="flex-1 p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                {MINS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">End Time</label>
            <div className="flex gap-1">
              <select value={endH} onChange={(e) => setEndH(e.target.value)} className="flex-1 p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                {HOURS.map((h) => <option key={h}>{h}</option>)}
              </select>
              <span className="flex items-center text-slate-400 font-bold">:</span>
              <select value={endM} onChange={(e) => setEndM(e.target.value)} className="flex-1 p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
                {MINS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Service type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Service Type</label>
          <select value={serviceType} onChange={(e) => setServiceType(e.target.value as ServiceType)} className={inputCls('serviceType')}>
            <option value="">Select service type…</option>
            {SERVICE_TYPES.map((t) => <option key={t} value={t}>{SERVICE_TYPE_LABELS[t] ?? t}</option>)}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Add any special instructions or notes…"
            className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>
      </div>
    </Modal>
  );
}
