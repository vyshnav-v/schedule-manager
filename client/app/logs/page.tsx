import type { Metadata } from 'next';
import LogsLoader from './LogsLoader';

export const metadata: Metadata = {
  title:       'Audit Logs',
  description: 'Full audit trail of all shift actions — create, update, status changes, and deletes — stored in ClickHouse.',
  openGraph: {
    title:       'Audit Logs | HR Nexus',
    description: 'Searchable, paginated audit log of all scheduling actions.',
  },
};

export default function LogsPage() {
  return <LogsLoader />;
}
