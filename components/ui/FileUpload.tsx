'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';

interface FileUploadProps {
  onUploadSuccess: (fileData: { url: string; name: string; size: number; type: string }) => void;
  accept?: string;
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  accept = '.pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg',
  label = 'رفع ملف، ملزمة، أو سلايدات (PDF, Docs, Images)',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ url: string; name: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUploadedFile({ url: data.url, name: data.name });
        onUploadSuccess(data);
      } else {
        setError(data.error || 'فشل رفع الملف');
      }
    } catch (err: any) {
      setError('حدث خطأ أثناء الاتصال بالسيرفر');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300">{label}</label>

      {uploadedFile ? (
        <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-bold truncate">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{uploadedFile.name}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadedFile(null)}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="relative border-2 border-dashed border-slate-700 hover:border-brand-500 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-slate-950/50 transition text-center group">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex items-center gap-2 text-xs text-brand-400 font-bold">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>جاري رفع الملف للسيرفر...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-slate-400 group-hover:text-brand-400 group-hover:bg-brand-500/20 flex items-center justify-center transition">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-300">اضغط هنا لاختيار الملف من جهازك</span>
              <span className="text-[10px] text-slate-500 font-mono">يدعم PDF, Word, PowerPoint, والصور</span>
            </>
          )}
        </label>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
