import { Request, Response, NextFunction, RequestHandler } from 'express';

/* eslint-disable @typescript-eslint/no-explicit-any */
type AsyncFn = (req: Request<any, any, any, any>, res: Response, next: NextFunction) => Promise<void>;
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Wraps an async route handler so uncaught errors are forwarded to
 * Express's error-handling middleware instead of crashing the process.
 */
const asyncHandler =
  (fn: AsyncFn): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
