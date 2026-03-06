'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/dashboard');
    }, [router]);

    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-pulse text-slate-400 font-bold tracking-widest uppercase text-xs">
                Redirecting to dashboard...
            </div>
        </div>
    );
}
