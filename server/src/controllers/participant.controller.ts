import { Request, Response } from 'express';
import Participant from '../models/Participant';

export async function getAllParticipants(_req: Request, res: Response): Promise<void> {
  const participants = await Participant.find({ isActive: true }).sort({ name: 1 });
  res.json(participants);
}

export async function getParticipantById(req: Request, res: Response): Promise<void> {
  const participant = await Participant.findById(req.params.id);
  if (!participant) {
    res.status(404).json({ error: 'Participant not found' });
    return;
  }
  res.json(participant);
}

export async function createParticipant(req: Request, res: Response): Promise<void> {
  const participant = await Participant.create(req.body);
  res.status(201).json(participant);
}

export async function updateParticipant(req: Request, res: Response): Promise<void> {
  const participant = await Participant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!participant) {
    res.status(404).json({ error: 'Participant not found' });
    return;
  }
  res.json(participant);
}

export async function deleteParticipant(req: Request, res: Response): Promise<void> {
  const participant = await Participant.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true },
  );
  if (!participant) {
    res.status(404).json({ error: 'Participant not found' });
    return;
  }
  res.json({ message: 'Participant deactivated' });
}
