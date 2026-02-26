'use client';

import React, { useState } from 'react';
import { UploadCloud, FileText, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocumentUploadProps {
    label: string;
    onUpload?: (file: File) => void;
    error?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ label, onUpload, error }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            onUpload?.(file);

            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex justify-between">
                {label}
                {error && <span className="text-red-500 normal-case font-medium tracking-normal">{error}</span>}
            </label>
            
            <div className={cn(
                "relative h-40 border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden group",
                preview || fileName ? "border-primary-500 bg-primary-50/5 dark:bg-primary-900/5" : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5",
                error && "border-red-500 bg-red-50/50"
            )}>
                {!fileName ? (
                    <label className="flex flex-col items-center justify-center h-full w-full cursor-pointer">
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,application/pdf" />
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all">
                            <UploadCloud className="w-5 h-5" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-500 mt-3 group-hover:text-primary-600">Select Document</p>
                        <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-tighter">Images or PDF (max 5MB)</p>
                    </label>
                ) : (
                    <div className="h-full w-full flex items-center p-4">
                        {preview ? (
                            <img src={preview} alt="Preview" className="h-full w-24 object-cover rounded-xl shadow-lg" />
                        ) : (
                            <div className="h-full w-24 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                                <FileText className="w-8 h-8" />
                            </div>
                        )}
                        <div className="ml-4 flex-1">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{fileName}</p>
                            <p className="text-[10px] text-green-500 font-bold mt-1 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Ready to upload
                            </p>
                            <button 
                                onClick={() => { setFileName(null); setPreview(null); }}
                                className="mt-2 text-[10px] font-bold text-red-500 hover:underline uppercase tracking-widest flex items-center gap-1"
                            >
                                <X className="w-3 h-3" /> Remove
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
