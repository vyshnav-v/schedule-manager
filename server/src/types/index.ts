import { Types } from 'mongoose';

// ─── Enums ────────────────────────────────────────────────────────────────────

export type Availability = 'Full-time' | 'Part-time' | 'Casual';

export type ServiceType =
  | 'Personal Care'
  | 'Community Access'
  | 'Domestic'
  | 'Transport'
  | 'Behaviour Support'
  | 'Medication'
  | 'Other';

export type ShiftStatus = 'pending' | 'confirmed' | 'cancelled';

// ─── Model base shapes (without Mongoose Document fields) ─────────────────────

export interface WorkerBase {
  name: string;
  avatar: string;
  color: string;
  skills: string[];
  availability: Availability;
  rating: number;
  phone: string;
  email: string;
  isActive: boolean;
}

export interface ParticipantBase {
  name: string;
  avatar: string;
  color: string;
  ndisNumber: string;
  needs: string[];
  location: string;
  phone: string;
  email: string;
  isActive: boolean;
}

export interface ShiftBase {
  workerId: Types.ObjectId;
  participantId: Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: ServiceType;
  status: ShiftStatus;
  notes: string;
}

export interface LinkBase {
  workerId: Types.ObjectId;
  participantId: Types.ObjectId;
  isPrimary: boolean;
}

// ─── Request query param shapes ───────────────────────────────────────────────

export interface ShiftQuery {
  workerId?: string;
  participantId?: string;
  date?: string;
  week?: string;
}

export interface LogQuery {
  limit?: string;
  action?: string;
  workerId?: string;
  participantId?: string;
  from?: string;
  to?: string;
}

export interface TimesheetQuery {
  week?: string;
}

// ─── ClickHouse log row ───────────────────────────────────────────────────────

export interface ShiftLogRow {
  id: string;
  action: string;
  shift_id: string;
  worker_id: string;
  worker_name: string;
  participant_id: string;
  participant_name: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  service_type: string;
  status: string;
  performed_by: string;
  created_at: string;
}
