import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { EduPulseProvider } from '@/lib/context/EduPulseContext';
import { Toast } from '@/components/ui/Toast';
import { LayoutShell } from '@/components/layout/LayoutShell';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EduPulse | منصة إديو بلس التعليمية',
  description: 'نظام إدارة المراكز والأكاديميات التعليمية المتقدم - الإدارة، الحضور، عروض السلايدات، الاختبارات الإلكترونية، والواجبات.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} dark`}>
      <body className="antialiased selection:bg-brand-500 selection:text-white">
        <EduPulseProvider>
          <LayoutShell>{children}</LayoutShell>
          <Toast />
        </EduPulseProvider>
      </body>
    </html>
  );
}
