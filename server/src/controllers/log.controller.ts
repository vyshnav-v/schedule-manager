import { Request, Response } from 'express';
import { getClickHouseClient } from '../config/clickhouse';
import { LogQuery, ShiftLogRow } from '../types';

export async function getLogs(
  req: Request<object, object, object, LogQuery>,
  res: Response,
): Promise<void> {
  const limit = Math.min(parseInt(req.query.limit ?? '50'), 500);
  const conditions: string[] = [];

  if (req.query.action) conditions.push(`action = '${req.query.action}'`);
  if (req.query.workerId) conditions.push(`worker_id = '${req.query.workerId}'`);
  if (req.query.participantId) conditions.push(`participant_id = '${req.query.participantId}'`);
  if (req.query.from) conditions.push(`toDate(created_at) >= '${req.query.from}'`);
  if (req.query.to) conditions.push(`toDate(created_at) <= '${req.query.to}'`);

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const ch = getClickHouseClient();
  const result = await ch.query({
    query: `SELECT * FROM shift_logs ${where} ORDER BY created_at DESC LIMIT ${limit}`,
    format: 'JSONEachRow',
  });

  const rows: ShiftLogRow[] = await result.json();
  res.json(rows);
}
