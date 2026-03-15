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
export type ViewMode = 'calendar' | 'matrix' | 'list';
export type ViewBy = 'worker' | 'participant';
export type WorkType = 'shift' | 'office';
export type TimesheetType = 'general' | 'project';
export type InputType = 'hours' | 'startend';
export type PayPeriod = 'weekly' | 'fortnightly' | 'monthly';
export type EntryTypeId = 'regular' | 'leave' | 'ooo' | 'travel' | 'training' | 'project' | string;

// ─── API Models ────────────────────────────────────────────────────────────────

export interface Worker {
  _id: string;
  name: string;
  avatar: string;
  color: string;
  skills: string[];
  availability: Availability;
  rating: number;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Participant {
  _id: string;
  name: string;
  avatar: string;
  color: string;
  ndisNumber: string;
  needs: string[];
  location: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Shift {
  _id: string;
  workerId: Worker;
  participantId: Participant;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:MM
  endTime: string;
  serviceType: ServiceType;
  status: ShiftStatus;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Link {
  _id: string;
  workerId: Worker;
  participantId: Participant;
  isPrimary: boolean;
}

export interface ShiftLog {
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

// ─── Form Payloads ─────────────────────────────────────────────────────────────

export interface CreateShiftPayload {
  workerId: string;
  participantId: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: ServiceType;
  notes?: string;
}

export interface UpdateShiftPayload extends Partial<CreateShiftPayload> {
  status?: ShiftStatus;
}

// ─── Timesheet ────────────────────────────────────────────────────────────────

export interface TimesheetCell {
  hours: number;
  startTime: string;
  startAP: 'AM' | 'PM';
  endTime: string;
  endAP: 'AM' | 'PM';
  proj: string;
}

export type TimesheetRow = Record<string, TimesheetCell>; // key = day abbreviation
export type TimesheetData = Record<EntryTypeId, TimesheetRow>;

export interface EntryType {
  id: EntryTypeId;
  label: string;
  icon: string;
  isProject?: boolean;
}

export interface DayMeta {
  key: string;        // 'mon', 'tue', ...
  name: string;       // 'Mon', 'Tue', ...
  date: number;       // day of month
  month: string;      // 'Jan', 'Feb', ...
  fullDate: string;   // 'YYYY-MM-DD'
  isWeekend: boolean;
  isToday: boolean;
}

// ─── Modal state ──────────────────────────────────────────────────────────────

export interface ShiftModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  shiftId: string | null;
  prefillWorkerId: string | null;
  prefillParticipantId: string | null;
  prefillDate: string | null;
}

export interface DetailPanelState {
  isOpen: boolean;
  entityId: string | null;
  entityType: 'worker' | 'participant' | null;
}
