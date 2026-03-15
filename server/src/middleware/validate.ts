import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

/** Wraps a Zod schema and returns a middleware that validates req.body */
export function validate(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const messages = result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
      res.status(400).json({ error: 'Validation failed', details: messages });
      return;
    }
    req.body = result.data; // replace with parsed + coerced data
    next();
  };
}

/** Validates req.params.id is a valid MongoDB ObjectId */
export function validateObjectId(req: Request, res: Response, next: NextFunction): void {
  const id = req.params.id;
  if (!/^[a-f\d]{24}$/i.test(id)) {
    res.status(400).json({ error: `Invalid ID format: ${id}` });
    return;
  }
  next();
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const SERVICE_TYPES = [
  'Personal Care', 'Domestic', 'Community Access',
  'Transport', 'Behaviour Support', 'Medication', 'Other',
] as const;

const SHIFT_STATUSES = ['pending', 'confirmed', 'cancelled'] as const;

export const shiftCreateSchema = z.object({
  workerId:      z.string().regex(/^[a-f\d]{24}$/i, 'Invalid workerId'),
  participantId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid participantId'),
  date:          z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
  startTime:     z.string().regex(/^\d{2}:\d{2}$/, 'startTime must be HH:MM'),
  endTime:       z.string().regex(/^\d{2}:\d{2}$/, 'endTime must be HH:MM'),
  serviceType:   z.enum(SERVICE_TYPES),
  status:        z.enum(SHIFT_STATUSES).optional().default('pending'),
  notes:         z.string().max(500).optional().default(''),
});

export const shiftUpdateSchema = shiftCreateSchema.partial();

export const shiftStatusSchema = z.object({
  status: z.enum(SHIFT_STATUSES),
});

export const workerCreateSchema = z.object({
  name:         z.string().min(1).max(100),
  avatar:       z.string().max(3).optional(),
  color:        z.string().regex(/^#[0-9a-f]{6}$/i, 'color must be a hex colour').optional(),
  availability: z.string().max(50).optional(),
  rating:       z.number().min(0).max(5).optional(),
  isActive:     z.boolean().optional().default(true),
});

export const participantCreateSchema = z.object({
  name:         z.string().min(1).max(100),
  avatar:       z.string().max(3).optional(),
  color:        z.string().regex(/^#[0-9a-f]{6}$/i).optional(),
  location:     z.string().max(100).optional(),
  isActive:     z.boolean().optional().default(true),
});

export const linkCreateSchema = z.object({
  workerId:      z.string().regex(/^[a-f\d]{24}$/i, 'Invalid workerId'),
  participantId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid participantId'),
  isPrimary:     z.boolean().optional().default(false),
});

export const linkUpdateSchema = z.object({
  isPrimary: z.boolean(),
});
