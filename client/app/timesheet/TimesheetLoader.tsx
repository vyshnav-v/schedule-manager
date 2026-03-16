'use client';
import dynamic from 'next/dynamic';

const TimesheetPageClient = dynamic(
  () => import('@/src/components/timesheet/TimesheetPageClient'),
  { ssr: false },
);

export default function TimesheetLoader() {
  return <TimesheetPageClient />;
}
