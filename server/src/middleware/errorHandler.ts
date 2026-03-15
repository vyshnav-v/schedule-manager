import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  status?: number;
  code?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Mongoose duplicate key
  if (err.code === 11000) {
    res.status(409).json({ error: 'Resource already exists' });
    return;
  }

  const status = err.status ?? 500;
  console.error(`[${status}] ${err.message}`);
  res.status(status).json({ error: err.message || 'Internal Server Error' });
}
