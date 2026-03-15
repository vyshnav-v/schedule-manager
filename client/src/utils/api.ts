import { API_BASE } from '../constants';
import type {
  Worker, Participant, Shift, Link, ShiftLog,
  CreateShiftPayload, UpdateShiftPayload, ShiftStatus,
} from '../types';

// ─── Base fetch wrapper ───────────────────────────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── Workers ──────────────────────────────────────────────────────────────────

export const workerApi = {
  getAll:  ()                          => request<Worker[]>('/workers'),
  getById: (id: string)                => request<Worker>(`/workers/${id}`),
  create:  (body: Partial<Worker>)     => request<Worker>('/workers', { method: 'POST', body: JSON.stringify(body) }),
  update:  (id: string, body: Partial<Worker>) => request<Worker>(`/workers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove:  (id: string)                => request<{ message: string }>(`/workers/${id}`, { method: 'DELETE' }),
};

// ─── Participants ─────────────────────────────────────────────────────────────

export const participantApi = {
  getAll:  ()                               => request<Participant[]>('/participants'),
  getById: (id: string)                     => request<Participant>(`/participants/${id}`),
  create:  (body: Partial<Participant>)     => request<Participant>('/participants', { method: 'POST', body: JSON.stringify(body) }),
  update:  (id: string, body: Partial<Participant>) => request<Participant>(`/participants/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove:  (id: string)                     => request<{ message: string }>(`/participants/${id}`, { method: 'DELETE' }),
};

// ─── Shifts ───────────────────────────────────────────────────────────────────

export interface ShiftFilters {
  workerId?: string;
  participantId?: string;
  date?: string;
  week?: string; // YYYY-MM-DD of week start (Sun)
}

export const shiftApi = {
  getAll: (filters?: ShiftFilters) => {
    const params = new URLSearchParams();
    if (filters?.workerId)      params.set('workerId',      filters.workerId);
    if (filters?.participantId) params.set('participantId', filters.participantId);
    if (filters?.date)          params.set('date',          filters.date);
    if (filters?.week)          params.set('week',          filters.week);
    const qs = params.toString();
    return request<Shift[]>(`/shifts${qs ? `?${qs}` : ''}`);
  },
  getById:      (id: string)                           => request<Shift>(`/shifts/${id}`),
  create:       (body: CreateShiftPayload)              => request<Shift>('/shifts', { method: 'POST', body: JSON.stringify(body) }),
  update:       (id: string, body: UpdateShiftPayload) => request<Shift>(`/shifts/${id}`, { method: 'PUT',   body: JSON.stringify(body) }),
  updateStatus: (id: string, status: ShiftStatus)      => request<Shift>(`/shifts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  remove:       (id: string)                           => request<{ message: string }>(`/shifts/${id}`, { method: 'DELETE' }),
  getTimesheet: (workerId: string, week?: string) => {
    const qs = week ? `?week=${week}` : '';
    return request<Record<string, Shift[]>>(`/shifts/timesheet/${workerId}${qs}`);
  },
};

// ─── Links ────────────────────────────────────────────────────────────────────

export const linkApi = {
  getAll:    (workerId?: string, participantId?: string) => {
    const params = new URLSearchParams();
    if (workerId)      params.set('workerId',      workerId);
    if (participantId) params.set('participantId', participantId);
    const qs = params.toString();
    return request<Link[]>(`/links${qs ? `?${qs}` : ''}`);
  },
  create:    (body: { workerId: string; participantId: string; isPrimary?: boolean }) =>
    request<Link>('/links', { method: 'POST', body: JSON.stringify(body) }),
  update:    (id: string, isPrimary: boolean) =>
    request<Link>(`/links/${id}`, { method: 'PATCH', body: JSON.stringify({ isPrimary }) }),
  remove:    (id: string) => request<{ message: string }>(`/links/${id}`, { method: 'DELETE' }),
};

// ─── Logs ─────────────────────────────────────────────────────────────────────

export interface LogFilters {
  limit?: number;
  action?: string;
  workerId?: string;
  participantId?: string;
  from?: string;
  to?: string;
}

export const logApi = {
  getAll: (filters?: LogFilters) => {
    const params = new URLSearchParams();
    if (filters?.limit)         params.set('limit',         String(filters.limit));
    if (filters?.action)        params.set('action',        filters.action);
    if (filters?.workerId)      params.set('workerId',      filters.workerId);
    if (filters?.participantId) params.set('participantId', filters.participantId);
    if (filters?.from)          params.set('from',          filters.from);
    if (filters?.to)            params.set('to',            filters.to);
    const qs = params.toString();
    return request<ShiftLog[]>(`/logs${qs ? `?${qs}` : ''}`);
  },
};
