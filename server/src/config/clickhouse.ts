import { createClient, ClickHouseClient } from '@clickhouse/client';

export interface ShiftLogPayload {
  _id?: unknown;
  id?: unknown;
  workerId?: unknown;
  participantId?: unknown;
  date?: string;
  startTime?: string;
  endTime?: string;
  serviceType?: string;
  status?: string;
}

let client: ClickHouseClient | null = null;

function getClickHouseClient(): ClickHouseClient {
  if (!client) {
    client = createClient({
      url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
      username: process.env.CLICKHOUSE_USER || 'default',
      password: process.env.CLICKHOUSE_PASSWORD || '',
      database: process.env.CLICKHOUSE_DB || 'default',
    });
  }
  return client;
}

export async function initClickHouse(): Promise<void> {
  try {
    const ch = getClickHouseClient();
    const result = await ch.exec({
      query: `
        CREATE TABLE IF NOT EXISTS shift_logs (
          id               UUID    DEFAULT generateUUIDv4(),
          action           String,
          shift_id         String,
          worker_id        String,
          worker_name      String,
          participant_id   String,
          participant_name String,
          shift_date       String,
          start_time       String,
          end_time         String,
          service_type     String,
          status           String,
          performed_by     String,
          created_at       DateTime DEFAULT now()
        )
        ENGINE = MergeTree()
        ORDER BY created_at
      `,
    });
    // Drain the response stream to avoid ECONNRESET warnings on HTTPS connections
    result.stream.resume();
    await new Promise<void>((resolve) => result.stream.on('end', resolve));
    console.log('ClickHouse initialised');
  } catch (err) {
    console.warn('ClickHouse not available — logging disabled:', (err as Error).message);
  }
}

export async function logShiftAction(
  action: string,
  shift: ShiftLogPayload,
  workerName?: string,
  participantName?: string,
  performedBy = 'system',
): Promise<void> {
  try {
    const ch = getClickHouseClient();
    await ch.insert({
      table: 'shift_logs',
      values: [
        {
          action,
          shift_id: String(shift._id ?? shift.id ?? ''),
          worker_id: String(shift.workerId ?? ''),
          worker_name: workerName ?? '',
          participant_id: String(shift.participantId ?? ''),
          participant_name: participantName ?? '',
          shift_date: shift.date ?? '',
          start_time: shift.startTime ?? '',
          end_time: shift.endTime ?? '',
          service_type: shift.serviceType ?? '',
          status: shift.status ?? '',
          performed_by: performedBy,
        },
      ],
      format: 'JSONEachRow',
    });
  } catch (err) {
    console.warn('ClickHouse log failed (non-fatal):', (err as Error).message);
  }
}

export { getClickHouseClient };
