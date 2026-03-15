'use client';
import { Plus, Check } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { useScheduleStore } from '../../store/scheduleStore';

export default function MatrixView() {
  const { workers, participants, links, shifts, openShiftModal } = useScheduleStore();

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full" style={{ minWidth: 800 }}>
        <thead>
          <tr className="bg-slate-50">
            <th className="p-3 text-left font-medium text-slate-600 text-sm border-b border-r border-slate-200 sticky left-0 bg-slate-50 z-10 min-w-[180px]">
              Support Workers
            </th>
            {participants.map((p) => (
              <th key={p._id} className="p-3 border-b border-r border-slate-200 last:border-r-0 min-w-[140px]">
                <div className="flex flex-col items-center gap-1">
                  <Avatar initials={p.avatar} color={p.color} size="md" />
                  <span className="text-sm font-medium text-slate-900">{p.name}</span>
                  <span className="text-xs text-slate-500">{p.location}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => (
            <tr key={worker._id} className="hover:bg-slate-50">
              {/* Worker cell */}
              <td className="p-3 border-b border-r border-slate-200 sticky left-0 bg-white z-10">
                <div className="flex items-center gap-2">
                  <Avatar initials={worker.avatar} color={worker.color} size="md" />
                  <div>
                    <div className="font-medium text-slate-900 text-sm">{worker.name}</div>
                    <div className="text-xs text-slate-500">{worker.availability}</div>
                  </div>
                </div>
              </td>

              {/* Participant link cells */}
              {participants.map((participant) => {
                const link = links.find(
                  (l) => l.workerId._id === worker._id && l.participantId._id === participant._id,
                );
                const shiftCount = shifts.filter(
                  (s) => s.workerId?._id === worker._id && s.participantId?._id === participant._id,
                ).length;

                const handleAddShift = () => {
                  openShiftModal({
                    prefillWorkerId:     worker._id,
                    prefillParticipantId: participant._id,
                  });
                };

                return (
                  <td key={participant._id} className="p-3 border-b border-r border-slate-200 last:border-r-0 text-center">
                    {link ? (
                      <div
                        className="flex flex-col items-center gap-1 cursor-pointer group"
                        onClick={handleAddShift}
                        title={`Add shift: ${worker.name} → ${participant.name}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors group-hover:opacity-80 ${link.isPrimary ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                          {link.isPrimary ? (
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </div>
                        <span className="text-xs text-slate-500">{shiftCount} shifts</span>
                        {link.isPrimary && <span className="text-xs text-emerald-600 font-medium">Primary</span>}
                      </div>
                    ) : (
                      <button
                        onClick={handleAddShift}
                        title={`Add shift: ${worker.name} → ${participant.name}`}
                        className="w-8 h-8 rounded-full border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-colors mx-auto flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 text-slate-400" />
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
