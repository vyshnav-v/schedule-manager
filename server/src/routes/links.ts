import { Router } from 'express';
import { getAllLinks, createLink, updateLink, deleteLink } from '../controllers/link.controller';
import asyncHandler from '../utils/asyncHandler';
import { validate, validateObjectId, linkCreateSchema, linkUpdateSchema } from '../middleware/validate';

const router = Router();

router.get('/',       asyncHandler(getAllLinks));
router.post('/',      validate(linkCreateSchema), asyncHandler(createLink));
router.patch('/:id',  validateObjectId, validate(linkUpdateSchema), asyncHandler(updateLink));
router.delete('/:id', validateObjectId, asyncHandler(deleteLink));

export default router;
