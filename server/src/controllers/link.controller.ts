import { Request, Response } from 'express';
import Link from '../models/Link';

export async function getAllLinks(req: Request, res: Response): Promise<void> {
  const filter: Record<string, unknown> = {};
  if (req.query.workerId) filter.workerId = req.query.workerId;
  if (req.query.participantId) filter.participantId = req.query.participantId;

  const links = await Link.find(filter)
    .populate('workerId', 'name avatar color availability rating')
    .populate('participantId', 'name avatar color location');

  res.json(links);
}

export async function createLink(req: Request, res: Response): Promise<void> {
  const link = await Link.create(req.body);
  res.status(201).json(link);
}

export async function updateLink(req: Request, res: Response): Promise<void> {
  const link = await Link.findByIdAndUpdate(
    req.params.id,
    { isPrimary: req.body.isPrimary },
    { new: true },
  );
  if (!link) {
    res.status(404).json({ error: 'Link not found' });
    return;
  }
  res.json(link);
}

export async function deleteLink(req: Request, res: Response): Promise<void> {
  const link = await Link.findByIdAndDelete(req.params.id);
  if (!link) {
    res.status(404).json({ error: 'Link not found' });
    return;
  }
  res.json({ message: 'Link removed' });
}
