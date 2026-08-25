'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEduPulse } from '@/lib/context/EduPulseContext';

export default function Home() {
  const router = useRouter();
  const { userRole } = useEduPulse();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.authenticated && data.user) {
          if (data.user.role === 'admin') {
            router.replace('/admin');
          } else {
            router.replace('/student');
          }
        } else {
          router.replace('/login');
        }
      })
      .catch(() => {
        router.replace('/login');
      });
  }, [router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-brand-500 font-bold">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">جاري التوجيه إلى المنصة...</span>
      </div>
    </div>
  );
}
