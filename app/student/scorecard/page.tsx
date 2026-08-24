'use client';

import React from 'react';
import { useEduPulse } from '@/lib/context/EduPulseContext';
import { BanShield } from '@/components/BanShield';
import { Trophy, Award, PlusCircle, MinusCircle, Crown, Sparkles, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentScorecardPage() {
  const { dict, activeStudent, students, gradeLogs } = useEduPulse();

  if (!activeStudent) return null;

  const sortedStudents = [...students].sort((a, b) => b.totalPoints - a.totalPoints);
  const top3 = sortedStudents.slice(0, 3);
  const myRank = sortedStudents.findIndex((s) => s.id === activeStudent.id) + 1;

  const myLogs = gradeLogs.filter((g) => g.studentId === activeStudent.id);

  return (
    <BanShield student={activeStudent}>
      <div className="space-y-8 pb-12">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Trophy className="w-7 h-7 text-amber-500" />
            <span>{dict.scorecard.title}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">{dict.scorecard.subtitle}</p>
        </div>

        {/* Top 3 Podium Visual */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border border-brand-500/30 shadow-2xl space-y-6">
          <h3 className="text-base font-extrabold text-white text-center flex items-center justify-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <span>{dict.scorecard.top3Title}</span>
          </h3>

          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto items-end pt-4">
            
            {/* 2nd Place */}
            {top3[1] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center space-y-2 text-center"
              >
                <div className="relative">
                  <img src={top3[1].avatar} alt={top3[1].name} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-300 shadow-lg" />
                  <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-black text-xs flex items-center justify-center font-mono">
                    2
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-200 truncate w-full">{top3[1].name}</span>
                <div className="w-full h-24 rounded-t-2xl bg-gradient-to-t from-slate-700 to-slate-500 flex items-center justify-center font-mono font-extrabold text-white text-sm shadow-md">
                  {top3[1].totalPoints} ن
                </div>
              </motion.div>
            )}

            {/* 1st Place */}
            {top3[0] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center space-y-2 text-center"
              >
                <div className="relative">
                  <Crown className="w-6 h-6 text-amber-400 absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce" />
                  <img src={top3[0].avatar} alt={top3[0].name} className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-xl" />
                  <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center font-mono">
                    1
                  </span>
                </div>
                <span className="text-xs font-black text-amber-300 truncate w-full">{top3[0].name}</span>
                <div className="w-full h-32 rounded-t-2xl bg-gradient-to-t from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center font-mono font-black text-slate-950 text-base shadow-xl">
                  {top3[0].totalPoints} ن
                </div>
              </motion.div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center space-y-2 text-center"
              >
                <div className="relative">
                  <img src={top3[2].avatar} alt={top3[2].name} className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-700 shadow-lg" />
                  <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center font-mono">
                    3
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-200 truncate w-full">{top3[2].name}</span>
                <div className="w-full h-20 rounded-t-2xl bg-gradient-to-t from-amber-900 to-amber-700 flex items-center justify-center font-mono font-extrabold text-white text-xs shadow-md">
                  {top3[2].totalPoints} ن
                </div>
              </motion.div>
            )}

          </div>
        </div>

        {/* My Rank Summary */}
        <div className="p-6 rounded-3xl glass-panel border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 font-mono font-black text-xl flex items-center justify-center border border-brand-500/30">
              #{myRank}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">{dict.scorecard.yourRank}</h3>
              <p className="text-xs text-slate-400">ترتيبك بين جميع طلاب المركز الإجمالي</p>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="block text-2xl font-black text-amber-400">{activeStudent.totalPoints} نقطة</span>
            <span className="text-xs text-emerald-400 font-bold">{activeStudent.attendanceRate}% حضور</span>
          </div>
        </div>

        {/* Itemized Points Ledger Log */}
        <div className="p-6 rounded-3xl glass-panel border space-y-4">
          <h3 className="text-base font-extrabold text-white">{dict.scorecard.ledgerTitle}</h3>

          <div className="space-y-3">
            {myLogs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">لا توجد سجلات نقاط مسجلة حتى الآن</p>
            ) : (
              myLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 text-xs font-semibold"
                >
                  <div className="flex items-center gap-3">
                    {log.amount > 0 ? (
                      <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        <PlusCircle className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-rose-950 text-rose-400 border border-rose-500/30">
                        <MinusCircle className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <span className="block font-bold text-white">{log.reason}</span>
                      <span className="text-[10px] text-slate-400">
                        بواسطة: {log.adminName} | {new Date(log.date).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-sm font-mono font-black ${
                      log.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {log.amount > 0 ? `+${log.amount}` : log.amount} نقطة
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </BanShield>
  );
}
