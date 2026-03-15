import { Router } from 'express';
import { getLogs } from '../controllers/log.controller';
import asyncHandler from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getLogs));

export default router;
