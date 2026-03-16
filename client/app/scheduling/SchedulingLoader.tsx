'use client';
import dynamic from 'next/dynamic';

const SchedulingPageClient = dynamic(
  () => import('@/src/components/scheduling/SchedulingPageClient'),
  { ssr: false },
);

export default function SchedulingLoader() {
  return <SchedulingPageClient />;
}
