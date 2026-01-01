import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Genie - Your Service Marketplace',
  description: 'Find local service providers in your area. From home repair to agriculture, healthcare to transport - connect with trusted providers.',
  keywords: 'services, service providers, marketplace, agriculture, healthcare, transport',
  manifest: '/manifest.json',
  themeColor: '#16a34a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Genie',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
