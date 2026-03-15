import { Router } from 'express';
import {
  getAllShifts,
  getShiftById,
  createShift,
  updateShift,
  updateShiftStatus,
  deleteShift,
  getTimesheetByWorker,
} from '../controllers/shift.controller';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

// Must be before /:id to avoid route conflict
router.get('/timesheet/:workerId', asyncHandler(getTimesheetByWorker));

router.get('/', asyncHandler(getAllShifts));
router.get('/:id', asyncHandler(getShiftById));
router.post('/', asyncHandler(createShift));
router.put('/:id', asyncHandler(updateShift));
router.patch('/:id/status', asyncHandler(updateShiftStatus));
router.delete('/:id', asyncHandler(deleteShift));

export default router;
