import { Router } from 'express';
import {
  getAllShifts, getShiftById, createShift,
  updateShift, updateShiftStatus, deleteShift, getTimesheetByWorker,
} from '../controllers/shift.controller';
import asyncHandler from '../utils/asyncHandler';
import { validate, validateObjectId, shiftCreateSchema, shiftUpdateSchema, shiftStatusSchema } from '../middleware/validate';

const router = Router();

router.get('/timesheet/:workerId', asyncHandler(getTimesheetByWorker));
router.get('/',     asyncHandler(getAllShifts));
router.get('/:id',  validateObjectId, asyncHandler(getShiftById));
router.post('/',    validate(shiftCreateSchema), asyncHandler(createShift));
router.put('/:id',  validateObjectId, validate(shiftUpdateSchema), asyncHandler(updateShift));
router.patch('/:id/status', validateObjectId, validate(shiftStatusSchema), asyncHandler(updateShiftStatus));
router.delete('/:id', validateObjectId, asyncHandler(deleteShift));

export default router;
