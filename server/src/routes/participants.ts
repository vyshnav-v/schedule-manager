import { Router } from 'express';
import {
  getAllParticipants,
  getParticipantById,
  createParticipant,
  updateParticipant,
  deleteParticipant,
} from '../controllers/participant.controller';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getAllParticipants));
router.get('/:id', asyncHandler(getParticipantById));
router.post('/', asyncHandler(createParticipant));
router.put('/:id', asyncHandler(updateParticipant));
router.delete('/:id', asyncHandler(deleteParticipant));

export default router;
