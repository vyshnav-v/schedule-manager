'use client';
import { X, Star, MapPin, Briefcase } from 'lucide-react';
import Avatar from '../ui/Avatar';
import StatusBadge from '../ui/StatusBadge';
import { useScheduleStore } from '../../store/scheduleStore';

export default function DetailPanel() {
  const {
    detailPanel, closeDetailPanel,
    workers, participants, shifts,
    getLinkedParticipants, getLinkedWorkers,
    openShiftDetail,
  } = useScheduleStore();

  const { isOpen, entityId, entityType } = detailPanel;

  if (!isOpen || !entityId || !entityType) return null;

  const entity = entityType === 'worker'
    ? workers.find((w) => w._id === entityId)
    : participants.find((p) => p._id === entityId);

  if (!entity) return null;

  const linked = entityType === 'worker'
    ? getLinkedParticipants(entityId)
    : getLinkedWorkers(entityId);

  const entityShifts = shifts.filter((s) =>
    entityType === 'worker'
      ? s.workerId._id === entityId
      : s.participantId._id === entityId,
  );

  const tags = entityType === 'worker'
    ? (entity as typeof workers[0]).skills
    : (entity as typeof participants[0]).needs;

  return (
    <div
      className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-slate-200 z-50 overflow-y-auto flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="font-semibold text-slate-900">
            {entityType === 'worker' ? 'Worker Details' : 'Participant Details'}
          </h2>
          <button onClick={closeDetailPanel} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Profile */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Avatar initials={entity.avatar} color={entity.color} size="lg" />
            <div>
              <h3 className="font-semibold text-slate-900">{entity.name}</h3>
              {entityType === 'worker' ? (
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {(entity as typeof workers[0]).rating} · {(entity as typeof workers[0]).availability}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {(entity as typeof participants[0]).location}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
              {entityType === 'worker' ? 'Skills' : 'Support Needs'}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Linked entities */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              Linked {entityType === 'worker' ? 'Participants' : 'Workers'} ({linked.length})
            </div>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Manage</button>
          </div>
          <div className="space-y-2">
            {linked.map((l) => (
              <div key={l._id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Avatar initials={l.avatar} color={l.color} size="sm" />
                  <span className="text-sm font-medium text-slate-900">{l.name}</span>
                </div>
                {l.isPrimary && (
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming shifts */}
        <div className="p-4 flex-1">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
            Upcoming Shifts ({entityShifts.length})
          </div>
          <div className="space-y-2">
            {entityShifts.slice(0, 5).map((shift) => {
              const related = entityType === 'worker' ? shift.participantId : shift.workerId;
              return (
                <div
                  key={shift._id}
                  className="p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => { closeDetailPanel(); openShiftDetail(shift._id); }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar initials={related.avatar} color={related.color} size="sm" />
                      <span className="text-sm font-medium text-slate-900">{related.name}</span>
                    </div>
                    <StatusBadge status={shift.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {shift.date}</span>
                    <span>{shift.startTime}–{shift.endTime}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
}
