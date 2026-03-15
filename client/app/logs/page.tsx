'use client';
import dynamic from 'next/dynamic';

const LogsPageClient = dynamic(() => import('../../src/components/logs/LogsPageClient'), { ssr: false });

export default function LogsPage() {
  return <LogsPageClient />;
}
