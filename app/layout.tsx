import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/AuthContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gaon Seva - आपके गांव की हर सेवा',
  description: 'Find local service providers in your village. From home repair to agriculture, healthcare to transport - connect with trusted providers.',
  keywords: 'rural services, village services, service providers, India, agriculture, healthcare, transport',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
