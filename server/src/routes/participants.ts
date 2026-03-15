import { Router } from 'express';
import { getAllParticipants, getParticipantById, createParticipant, updateParticipant, deleteParticipant } from '../controllers/participant.controller';
import asyncHandler from '../utils/asyncHandler';
import { validate, validateObjectId, participantCreateSchema } from '../middleware/validate';

const router = Router();

router.get('/',     asyncHandler(getAllParticipants));
router.get('/:id',  validateObjectId, asyncHandler(getParticipantById));
router.post('/',    validate(participantCreateSchema), asyncHandler(createParticipant));
router.put('/:id',  validateObjectId, validate(participantCreateSchema.partial()), asyncHandler(updateParticipant));
router.delete('/:id', validateObjectId, asyncHandler(deleteParticipant));

export default router;
