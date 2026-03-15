import { Router } from 'express';
import { getAllWorkers, getWorkerById, createWorker, updateWorker, deleteWorker } from '../controllers/worker.controller';
import asyncHandler from '../utils/asyncHandler';
import { validate, validateObjectId, workerCreateSchema } from '../middleware/validate';

const router = Router();

router.get('/',     asyncHandler(getAllWorkers));
router.get('/:id',  validateObjectId, asyncHandler(getWorkerById));
router.post('/',    validate(workerCreateSchema), asyncHandler(createWorker));
router.put('/:id',  validateObjectId, validate(workerCreateSchema.partial()), asyncHandler(updateWorker));
router.delete('/:id', validateObjectId, asyncHandler(deleteWorker));

export default router;
