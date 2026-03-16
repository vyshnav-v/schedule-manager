import type { Metadata } from 'next';
import './globals.css';
import FloatingNav    from '../src/components/ui/FloatingNav';
import TopProgressBar from '../src/components/ui/TopProgressBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://hrnexus.app'),
  title: {
    default:  'HR Nexus – Schedule Manager',
    template: '%s | HR Nexus',
  },
  description:
    'Shift scheduling, timesheet management, and audit logs for support workers and participants.',
  keywords: ['shift scheduling', 'timesheet', 'HR', 'support workers', 'NDIS', 'roster management'],
  authors: [{ name: 'HR Nexus' }],
  creator: 'HR Nexus',
  openGraph: {
    type:        'website',
    siteName:    'HR Nexus',
    title:       'HR Nexus – Schedule Manager',
    description: 'Shift scheduling, timesheet management, and audit logs for support workers and participants.',
  },
  twitter: {
    card:        'summary',
    title:       'HR Nexus – Schedule Manager',
    description: 'Shift scheduling, timesheet management, and audit logs for support workers and participants.',
  },
  robots: {
    index:          false,
    follow:         false,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <TopProgressBar />
        {children}
        <FloatingNav />
      </body>
    </html>
  );
}
