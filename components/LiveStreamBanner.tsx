'use client';

import React, { useState } from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { Radio, ExternalLink, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LiveStreamBanner: React.FC = () => {
  const { activeLiveStream, sessions, showToast } = useEduPulse();
  const [copied, setCopied] = useState(false);

  // Derive meeting link & status
  const isLive = Boolean(activeLiveStream?.isLive || sessions.some((s) => s.isLive));
  const meetingUrl = activeLiveStream?.meetingUrl || sessions.find((s) => s.isLive)?.liveMeetingUrl || '';
  const title = activeLiveStream?.title || sessions.find((s) => s.isLive)?.title || 'محاضرة بث مباشر تفاعلية أونلاين 🔴';

  const handleCopyLink = () => {
    if (!meetingUrl) return;
    navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    showToast('تم نسخ رابط الميتنج بنجاح 📋');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleJoin = () => {
    if (!meetingUrl) return;
    let validUrl = meetingUrl.trim();
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = `https://${validUrl}`;
    }
    window.open(validUrl, '_blank', 'noopener,noreferrer');
  };

  // Render if live stream is active OR if meetingUrl exists
  if (!isLive && !meetingUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="w-full mb-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-red-950 border-2 border-rose-500/80 shadow-2xl space-y-4 glow-rose text-white relative overflow-hidden z-20"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold animate-pulse shadow-lg shrink-0">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-mono font-bold animate-pulse">
                  مباشر الآن 🔴 LIVE STREAM
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-white mt-1 leading-snug">{title}</h3>
              <p className="text-xs text-rose-200/90 mt-0.5">البث المباشر يعمل الآن! اضغط للفتح والمتابعة الفورية مع المعلم</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {meetingUrl && (
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-bold flex items-center gap-1.5 transition"
                title="نسخ رابط الميتنج"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-rose-400" />}
                <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
              </button>
            )}

            {meetingUrl && (
              <button
                type="button"
                onClick={handleJoin}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-xl shadow-rose-600/40 flex items-center gap-2 transition"
              >
                <ExternalLink className="w-4 h-4" />
                <span>انضمام للبث المباشر الآن 🚀</span>
              </button>
            )}
          </div>
        </div>

        {/* Display Meeting URL in clear text */}
        {meetingUrl && (
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-rose-500/30 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-rose-400 font-bold font-sans">رابط الغرفة / الميتنج المباشر:</span>
            <a
              href={meetingUrl.startsWith('http') ? meetingUrl : `https://${meetingUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 underline font-bold truncate max-w-full hover:text-cyan-200"
            >
              {meetingUrl}
            </a>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
