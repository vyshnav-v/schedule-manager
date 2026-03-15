import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { validateEnv } from './config/env';
import connectDB from './config/db';
import { initClickHouse } from './config/clickhouse';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';
import { requestLogger } from './middleware/requestLogger';
import workersRouter from './routes/workers';
import participantsRouter from './routes/participants';
import shiftsRouter from './routes/shifts';
import linksRouter from './routes/links';
import logsRouter from './routes/logs';

const app = express();

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ─── Rate limiting ────────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,                  // max 300 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please try again later.' },
});

const writeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,             // max 60 writes per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many write requests — please slow down.' },
});

// ─── Global middleware ────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json({ limit: '200kb' }));
app.use(requestLogger);
app.use('/api', apiLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/workers',      writeLimiter, workersRouter);
app.use('/api/participants',  writeLimiter, participantsRouter);
app.use('/api/shifts',        writeLimiter, shiftsRouter);
app.use('/api/links',         writeLimiter, linksRouter);
app.use('/api/logs',          logsRouter);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

async function start(): Promise<void> {
  validateEnv();
  await connectDB();
  await initClickHouse();
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

start();
