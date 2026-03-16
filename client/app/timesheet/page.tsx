import type { Metadata } from 'next';
import TimesheetLoader from './TimesheetLoader';

export const metadata: Metadata = {
  title:       'Timesheet',
  description: 'Review and export weekly timesheets per worker — track regular hours, leave, travel, and training entries.',
  openGraph: {
    title:       'Timesheet | HR Nexus',
    description: 'Weekly timesheet management with export and entry-type breakdown.',
  },
};

export default function TimesheetPage() {
  return <TimesheetLoader />;
}
