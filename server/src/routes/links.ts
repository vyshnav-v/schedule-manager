import { Router } from 'express';
import { getAllLinks, createLink, updateLink, deleteLink } from '../controllers/link.controller';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getAllLinks));
router.post('/', asyncHandler(createLink));
router.patch('/:id', asyncHandler(updateLink));
router.delete('/:id', asyncHandler(deleteLink));

export default router;
