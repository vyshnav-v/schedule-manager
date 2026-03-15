import 'dotenv/config';
import express from 'express';
import cors from 'cors';
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

// ─── Global middleware ────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(requestLogger);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/workers', workersRouter);
app.use('/api/participants', participantsRouter);
app.use('/api/shifts', shiftsRouter);
app.use('/api/links', linksRouter);
app.use('/api/logs', logsRouter);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

async function start(): Promise<void> {
  await connectDB();
  await initClickHouse();
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

start();
