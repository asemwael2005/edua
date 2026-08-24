'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEduPulse } from '@/lib/context/EduPulseContext';

export default function Home() {
  const router = useRouter();
  const { userRole } = useEduPulse();

  useEffect(() => {
    if (userRole === 'admin') {
      router.replace('/admin');
    } else {
      router.replace('/student');
    }
  }, [userRole, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex items-center gap-3 text-brand-500 font-bold">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <span>جاري توجيهك للمنصة...</span>
      </div>
    </div>
  );
}
