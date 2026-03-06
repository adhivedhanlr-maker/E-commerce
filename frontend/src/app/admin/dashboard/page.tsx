'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Users, CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react';
import { getAllSellers } from '@/services/adminService';
import { Card, CardContent } from '@/components/ui/card';

interface Stats {
    pending: number;
    approved: number;
    rejected: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
                getAllSellers('pending'),
                getAllSellers('approved'),
                getAllSellers('rejected'),
            ]);
            setStats({
                pending: pendingRes.success ? pendingRes.data.length : 0,
                approved: approvedRes.success ? approvedRes.data.length : 0,
                rejected: rejectedRes.success ? rejectedRes.data.length : 0,
            });
        } catch {
            console.error('Failed to fetch admin stats');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    const statCards = [
        {
            label: 'Pending Review',
            value: stats.pending,
            icon: Clock,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
        },
        {
            label: 'Approved Sellers',
            value: stats.approved,
            icon: CheckCircle2,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
        },
        {
            label: 'Rejected',
            value: stats.rejected,
            icon: XCircle,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
        },
    ];

    return (
        <div>
            <div className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Admin Overview</h1>
                <p className="text-slate-500 mt-1">Summary of all seller onboarding activity.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                {statCards.map(({ label, value, icon: Icon, color, bg, border }) => (
                    <Card key={label} className={`border ${border} bg-white dark:bg-slate-900 rounded-[30px] shadow-sm`}>
                        <CardContent className="p-8 flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center ${color}`}>
                                <Icon className="w-7 h-7" />
                            </div>
                            <div>
                                {loading ? (
                                    <div className="h-8 w-12 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse mb-1" />
                                ) : (
                                    <p className={`text-3xl font-black ${color}`}>{value}</p>
                                )}
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        href="/admin/sellers?filter=pending"
                        className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-primary-400 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">Review Applications</p>
                                <p className="text-xs text-slate-500">{stats.pending} pending review</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-primary-500 transition-all" />
                    </Link>

                    <Link
                        href="/admin/sellers?filter=approved"
                        className="flex items-center justify-between p-6 bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 dark:text-white">Approved Sellers</p>
                                <p className="text-xs text-slate-500">{stats.approved} active sellers</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
