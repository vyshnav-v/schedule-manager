import { Request, Response } from 'express';
import Shift from '../models/Shift';
import Worker from '../models/Worker';
import Participant from '../models/Participant';
import { logShiftAction } from '../config/clickhouse';
import { ShiftQuery, TimesheetQuery } from '../types';

function weekRange(weekStart: string): { $gte: string; $lte: string } {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { $gte: fmt(start), $lte: fmt(end) };
}

export async function getAllShifts(
  req: Request<object, object, object, ShiftQuery>,
  res: Response,
): Promise<void> {
  const filter: Record<string, unknown> = {};
  if (req.query.workerId) filter.workerId = req.query.workerId;
  if (req.query.participantId) filter.participantId = req.query.participantId;
  if (req.query.date) filter.date = req.query.date;
  if (req.query.week) filter.date = weekRange(req.query.week);

  const shifts = await Shift.find(filter)
    .populate('workerId', 'name avatar color')
    .populate('participantId', 'name avatar color location')
    .sort({ date: 1, startTime: 1 });

  res.json(shifts);
}

export async function getShiftById(req: Request, res: Response): Promise<void> {
  const shift = await Shift.findById(req.params.id)
    .populate('workerId', 'name avatar color')
    .populate('participantId', 'name avatar color location');

  if (!shift) {
    res.status(404).json({ error: 'Shift not found' });
    return;
  }
  res.json(shift);
}

export async function createShift(req: Request, res: Response): Promise<void> {
  const shift = await Shift.create(req.body);
  const populated = await Shift.findById(shift._id)
    .populate('workerId', 'name avatar color')
    .populate('participantId', 'name avatar color location');
  const worker = await Worker.findById(shift.workerId).lean();
  const participant = await Participant.findById(shift.participantId).lean();
  await logShiftAction('CREATE', shift.toObject(), worker?.name, participant?.name);
  res.status(201).json(populated);
}

export async function updateShift(req: Request, res: Response): Promise<void> {
  const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate('workerId', 'name avatar color')
    .populate('participantId', 'name avatar color location');
  if (!shift) {
    res.status(404).json({ error: 'Shift not found' });
    return;
  }
  const worker = await Worker.findById((shift.workerId as any)?._id ?? shift.workerId).lean();
  const participant = await Participant.findById((shift.participantId as any)?._id ?? shift.participantId).lean();
  await logShiftAction('UPDATE', shift.toObject(), worker?.name, participant?.name);
  res.json(shift);
}

export async function updateShiftStatus(req: Request, res: Response): Promise<void> {
  const { status } = req.body as { status: string };
  const shift = await Shift.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true },
  );
  if (!shift) {
    res.status(404).json({ error: 'Shift not found' });
    return;
  }
  const worker = await Worker.findById(shift.workerId).lean();
  const participant = await Participant.findById(shift.participantId).lean();
  await logShiftAction('STATUS_CHANGE', shift.toObject(), worker?.name, participant?.name);
  res.json(shift);
}

export async function deleteShift(req: Request, res: Response): Promise<void> {
  const shift = await Shift.findByIdAndDelete(req.params.id);
  if (!shift) {
    res.status(404).json({ error: 'Shift not found' });
    return;
  }
  const worker = await Worker.findById(shift.workerId).lean();
  const participant = await Participant.findById(shift.participantId).lean();
  await logShiftAction('DELETE', shift.toObject(), worker?.name, participant?.name);
  res.json({ message: 'Shift deleted' });
}

export async function getTimesheetByWorker(
  req: Request<{ workerId: string }, object, object, TimesheetQuery>,
  res: Response,
): Promise<void> {
  const { workerId } = req.params;
  const weekStart = req.query.week ?? new Date().toISOString().slice(0, 10);

  const shifts = await Shift.find({ workerId, date: weekRange(weekStart) })
    .populate('participantId', 'name avatar color')
    .sort({ date: 1, startTime: 1 });

  // Group by date for timesheet rendering
  const grouped: Record<string, typeof shifts> = {};
  for (const s of shifts) {
    if (!grouped[s.date]) grouped[s.date] = [];
    grouped[s.date].push(s);
  }

  res.json(grouped);
}
