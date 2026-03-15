import type { Metadata } from 'next';
import './globals.css';
import FloatingNav from '../src/components/ui/FloatingNav';

export const metadata: Metadata = {
  title: 'HR Nexus – Schedule Manager',
  description: 'Shift scheduling and timesheet management for support workers and participants',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <FloatingNav />
      </body>
    </html>
  );
}
