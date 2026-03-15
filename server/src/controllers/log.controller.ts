import { Request, Response } from 'express';
import { getClickHouseClient } from '../config/clickhouse';
import { LogQuery } from '../types';

export async function getLogs(
  req: Request<object, object, object, LogQuery>,
  res: Response,
): Promise<void> {
  const rawLimit = parseInt(req.query.limit ?? '50', 10);
  const limit = isNaN(rawLimit) ? 50 : Math.min(rawLimit, 500);

  // Build parameterised WHERE clause — never interpolate user input directly
  const conditions: string[] = [];
  const params: Record<string, string> = { limit: String(limit) };

  if (req.query.action) {
    conditions.push('action = {action:String}');
    params.action = req.query.action;
  }
  if (req.query.workerId) {
    conditions.push('worker_id = {workerId:String}');
    params.workerId = req.query.workerId;
  }
  if (req.query.participantId) {
    conditions.push('participant_id = {participantId:String}');
    params.participantId = req.query.participantId;
  }
  if (req.query.from) {
    conditions.push('toDate(created_at) >= {from:Date}');
    params.from = req.query.from;
  }
  if (req.query.to) {
    conditions.push('toDate(created_at) <= {to:Date}');
    params.to = req.query.to;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const ch = getClickHouseClient();
  const result = await ch.query({
    query: `SELECT * FROM shift_logs ${where} ORDER BY created_at DESC LIMIT {limit:UInt32}`,
    query_params: params,
    format: 'JSONEachRow',
  });

  const rows = await result.json();
  res.json(rows);
}
