import type { EntryType, ServiceType } from '../types';

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const WEEK_DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
export const WEEK_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/** Mon–Sun for scheduling (matches shift-scheduling.html) */
export const WEEK_DAYS_MON = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export const WEEK_DAY_NAMES_MON = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export const SERVICE_TYPES: ServiceType[] = [
  'Personal Care',
  'Community Access',
  'Domestic',
  'Transport',
  'Behaviour Support',
  'Medication',
  'Other',
];

/** Display labels for modal (HTML uses "Domestic Assistance", "Medication Administration") */
export const SERVICE_TYPE_LABELS: Record<string, string> = {
  Domestic: 'Domestic Assistance',
  Medication: 'Medication Administration',
};

export const ENTRY_TYPES: EntryType[] = [
  { id: 'regular',  label: 'Regular Hours', icon: 'work'     },
  { id: 'leave',    label: 'Leave',          icon: 'leave'    },
  { id: 'ooo',      label: 'Out Of Office',  icon: 'ooo'      },
  { id: 'travel',   label: 'Travel',         icon: 'travel'   },
  { id: 'training', label: 'Training',       icon: 'training' },
];

export const STATUS_STYLES: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export const DEFAULT_WEEK_OFFSET = 0;
