import { Request, Response } from 'express';
import Worker from '../models/Worker';

export async function getAllWorkers(_req: Request, res: Response): Promise<void> {
  const workers = await Worker.find({ isActive: true }).sort({ name: 1 });
  res.json(workers);
}

export async function getWorkerById(req: Request, res: Response): Promise<void> {
  const worker = await Worker.findById(req.params.id);
  if (!worker) {
    res.status(404).json({ error: 'Worker not found' });
    return;
  }
  res.json(worker);
}

export async function createWorker(req: Request, res: Response): Promise<void> {
  const worker = await Worker.create(req.body);
  res.status(201).json(worker);
}

export async function updateWorker(req: Request, res: Response): Promise<void> {
  const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!worker) {
    res.status(404).json({ error: 'Worker not found' });
    return;
  }
  res.json(worker);
}

export async function deleteWorker(req: Request, res: Response): Promise<void> {
  const worker = await Worker.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!worker) {
    res.status(404).json({ error: 'Worker not found' });
    return;
  }
  res.json({ message: 'Worker deactivated' });
}
