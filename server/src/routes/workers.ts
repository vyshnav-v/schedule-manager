import { Router } from 'express';
import {
  getAllWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
} from '../controllers/worker.controller';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getAllWorkers));
router.get('/:id', asyncHandler(getWorkerById));
router.post('/', asyncHandler(createWorker));
router.put('/:id', asyncHandler(updateWorker));
router.delete('/:id', asyncHandler(deleteWorker));

export default router;
