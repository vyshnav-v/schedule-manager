import type { Metadata } from 'next';
import SchedulingLoader from './SchedulingLoader';

export const metadata: Metadata = {
  title:       'Scheduling',
  description: 'View and manage weekly shift schedules for support workers and participants. Switch between calendar, matrix, and list views.',
  openGraph: {
    title:       'Shift Scheduling | HR Nexus',
    description: 'Manage weekly shift schedules across workers and participants.',
  },
};

export default function SchedulingPage() {
  return <SchedulingLoader />;
}
