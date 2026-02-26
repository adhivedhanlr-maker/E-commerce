'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    Clock, 
    CheckCircle, 
    XCircle, 
    Search, 
    Filter, 
    Eye,
    Check,
    X,
    ExternalLink,
    Building2,
    Mail,
    Phone,
    Download
} from 'lucide-react';
import { getAllSellers, updateSellerStatus } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AdminSellersPage() {
    const [sellers, setSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('pending');
    const [selectedSeller, setSelectedSeller] = useState<any>(null);

    const fetchSellers = async () => {
        setLoading(true);
        try {
            const res = await getAllSellers(filterStatus);
            if (res.success) {
                setSellers(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch sellers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSellers();
    }, [filterStatus]);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            const res = await updateSellerStatus(id, status);
            if (res.success) {
                setSelectedSeller(null);
                fetchSellers();
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'pending': return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending Review</Badge>;
            case 'approved': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Approved</Badge>;
            case 'rejected': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Rejected</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <Users className="w-8 h-8 text-primary-600" />
                            Seller Management
                        </h1>
                        <p className="text-slate-500 mt-1">Review and manage business onboarding applications</p>
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
                        {['pending', 'approved', 'rejected'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterStatus(s)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                                    filterStatus === s ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List section */}
                    <div className="lg:col-span-1 space-y-4">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-3xl" />)
                        ) : sellers.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[40px] border border-dashed border-slate-200">
                                <p className="text-slate-400">No applications found</p>
                            </div>
                        ) : (
                            sellers.map((seller) => (
                                <Card 
                                    key={seller._id}
                                    onClick={() => setSelectedSeller(seller)}
                                    className={cn(
                                        "cursor-pointer border-none transition-all duration-300 rounded-[30px] group overflow-hidden",
                                        selectedSeller?._id === seller._id ? "ring-2 ring-primary-500 shadow-xl" : "hover:shadow-lg bg-white dark:bg-slate-900"
                                    )}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                    <Building2 className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight">
                                                        {seller.businessProfile?.businessName || seller.name}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 mt-0.5">{seller.email}</p>
                                                </div>
                                            </div>
                                            <StatusBadge status={seller.onboardingStatus} />
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400 pt-4 border-t border-slate-50 dark:border-white/5">
                                            <span>Applied: {new Date(seller.createdAt).toLocaleDateString()}</span>
                                            <span className="text-primary-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                                Review Details <ChevronRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>

                    {/* Detail section */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {selectedSeller ? (
                                <motion.div
                                    key={selectedSeller._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                >
                                    <Card className="border-none shadow-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl rounded-[40px] overflow-hidden">
                                        <CardContent className="p-8 md:p-12">
                                            <div className="flex justify-between items-start mb-10">
                                                <div>
                                                    <Badge className="mb-4">Internal ID: {selectedSeller._id}</Badge>
                                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white">
                                                        {selectedSeller.businessProfile?.businessName}
                                                    </h2>
                                                    <div className="flex flex-wrap gap-4 mt-4">
                                                        <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                            <Mail className="w-4 h-4" /> {selectedSeller.email}
                                                        </span>
                                                        <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                            <Phone className="w-4 h-4" /> {selectedSeller.businessProfile?.mobileNumber}
                                                        </span>
                                                    </div>
                                                </div>
                                                {selectedSeller.onboardingStatus === 'pending' && (
                                                    <div className="flex gap-3">
                                                        <Button 
                                                            onClick={() => handleUpdateStatus(selectedSeller._id, 'rejected')}
                                                            variant="outline" 
                                                            className="h-14 px-8 rounded-2xl font-bold border-red-100 text-red-600 hover:bg-red-50"
                                                        >
                                                            <X className="w-5 h-5 mr-2" /> Reject
                                                        </Button>
                                                        <Button 
                                                            onClick={() => handleUpdateStatus(selectedSeller._id, 'approved')}
                                                            className="h-14 px-8 rounded-2xl font-bold bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/20"
                                                        >
                                                            <Check className="w-5 h-5 mr-2" /> Approve Seller
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <section>
                                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 pb-2 border-b border-slate-100 dark:border-white/5">
                                                        Tax & Identity
                                                    </h4>
                                                    <div className="space-y-6">
                                                        <DetailItem label="PAN Number" value={selectedSeller.businessProfile?.panNumber} />
                                                        <DetailItem label="GSTIN" value={selectedSeller.businessProfile?.gstin || 'Not Provided'} />
                                                        <DetailItem label="Aadhaar Number" value={selectedSeller.businessProfile?.aadhaarNumber} />
                                                        <div className="pt-4 grid grid-cols-2 gap-4">
                                                            <DocPreview label="PAN Card" />
                                                            <DocPreview label="GST Certificate" />
                                                        </div>
                                                    </div>
                                                </section>

                                                <section>
                                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 pb-2 border-b border-slate-100 dark:border-white/5">
                                                        Bank & Operations
                                                    </h4>
                                                    <div className="space-y-6">
                                                        <DetailItem label="Bank Name" value={selectedSeller.businessProfile?.bankDetails?.bankName} />
                                                        <DetailItem label="IFSC Code" value={selectedSeller.businessProfile?.bankDetails?.ifscCode} />
                                                        <DetailItem label="Account Number" value={selectedSeller.businessProfile?.bankDetails?.accountNumber} />
                                                        <DetailItem label="Warehouse" value={selectedSeller.businessProfile?.operationalDetails?.warehouseAddress} />
                                                    </div>
                                                </section>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ) : (
                                <div className="h-full flex items-center justify-center p-20 text-center">
                                    <div className="max-w-xs">
                                        <div className="w-20 h-20 rounded-[30px] bg-white dark:bg-slate-900 shadow-xl flex items-center justify-center mx-auto mb-6 text-slate-400">
                                            <Eye className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Select an application</h3>
                                        <p className="text-slate-500">Choose a seller from the left to start the review process.</p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value }: { label: string, value?: string }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{value || 'N/A'}</p>
        </div>
    );
}

function DocPreview({ label }: { label: string }) {
    return (
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-between group hover:border-primary-500 transition-all cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                    <Download className="w-4 h-4" />
                </div>
                <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">{label}</p>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-primary-500" />
        </div>
    );
}

function ChevronRight(props: any) {
    return <motion.svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></motion.svg>;
}
