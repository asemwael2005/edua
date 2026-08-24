'use client';

import Link from 'next/link';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-extrabold text-white">404 - الصفحة غير موجودة</h2>
      <p className="text-sm text-slate-400 max-w-sm">
        عذراً، الصفحة التي تحاول الوصول إليها غير متاحة أو تم نقلها.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        <span>العودة للرئيسية</span>
      </Link>
    </div>
  );
}
