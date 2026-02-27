'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    FileText,
    CreditCard,
    Package,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Save,
    AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForm, UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { saveOnboardingDraft, submitOnboarding, getOnboardingStatus } from '@/services/sellerService';
import { DocumentUpload } from '@/components/seller/DocumentUpload';
import { cn } from '@/lib/utils';
import { IBusinessProfile } from '@/types/seller';
import { useAuth } from '@/store/useAuth';
import axios from 'axios';

// --- SCHEMAS ---
// --- SCHEMAS ---
const stepSchemas = [
    // Step 1: Basic Details
    z.object({
        businessName: z.string().min(2, 'Shop name is required'),
        ownerName: z.string().min(2, 'Owner name is required'),
        mobileNumber: z.string().regex(/^[0-9]{10}$/, 'Mobile must be exactly 10 digits'),
        email: z.string().email('Invalid email address'),
        natureOfBusiness: z.enum(['Retailer', 'Wholesaler', 'Manufacturer', 'Service Provider', 'E-commerce']),
        category: z.string().min(2, 'Category is required'),
    }),
    // Step 2: Legal Details
    z.object({
        gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST format'),
        panNumber: z.string().regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, 'Invalid PAN format'),
        licenseNumber: z.string().optional(),
        udyamNumber: z.string().optional(),
    }),
    // Step 3: Address Details
    z.object({
        shopAddress_street: z.string().min(5, 'Street address is required'),
        shopAddress_city: z.string().min(2, 'City is required'),
        shopAddress_district: z.string().min(2, 'District is required'),
        shopAddress_state: z.string().min(2, 'State is required'),
        shopAddress_pincode: z.string().length(6, 'Pincode must be 6 digits'),
    }),
    // Step 4: Bank Details
    z.object({
        accountHolderName: z.string().min(2, 'Account holder name is required'),
        bankName: z.string().min(2, 'Bank name is required'),
        accountNumber: z.string().min(8, 'Invalid account number'),
        ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC format'),
        upiId: z.string().optional(),
    }),
    // Step 5: Uploads
    z.object({
        // Even if empty, Zod needs something if used with react-hook-form
        _uploads: z.string().optional()
    }),
    // Step 6: Review & Terms
    z.object({
        commissionAccepted: z.boolean().refine(v => v === true, 'You must accept the terms and conditions'),
    })
];

const STEPS = [
    { id: 1, title: 'Basic Details', icon: Building2 },
    { id: 2, title: 'Legal & Tax', icon: FileText },
    { id: 3, title: 'Address', icon: Package },
    { id: 4, title: 'Banking', icon: CreditCard },
    { id: 5, title: 'Uploads', icon: Package },
    { id: 6, title: 'Review', icon: CheckCircle2 }
];

interface FlatOnboardingForm extends Record<string, string | boolean | number | undefined> {
    businessName: string;
    ownerName: string;
    mobileNumber: string;
    email: string;
    natureOfBusiness: 'Retailer' | 'Wholesaler' | 'Manufacturer' | 'Service Provider' | 'E-commerce';
    category: string;
    gstin: string;
    panNumber: string;
    licenseNumber?: string;
    udyamNumber?: string;
    shopAddress_street: string;
    shopAddress_city: string;
    shopAddress_district: string;
    shopAddress_state: string;
    shopAddress_pincode: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    upiId?: string;
    commissionAccepted: boolean;
}

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function AdvancedSellerRegister() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const { user, loginAsDev } = useAuth();
    const [formData, setFormData] = useState<Partial<IBusinessProfile>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<string>('none');

    // Moved from renderStepContent to respect Rules of Hooks
    const [otpSent, setOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(true); // Verification bypassed as per user request
    const [submitting, setSubmitting] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<FlatOnboardingForm>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(stepSchemas[currentStep - 1]) as any,
        mode: 'onChange',
        defaultValues: {
            natureOfBusiness: 'Retailer',
            commissionAccepted: false
        }
    });

    useEffect(() => {
        const fetchStatus = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await getOnboardingStatus();
                if (res.success) {
                    setStatus(res.data.status);
                    if (res.data.profile) {
                        setFormData(res.data.profile);
                        setIsOtpVerified(res.data.profile.isMobileVerified || false);
                        // Flatten data for the form reset
                        const flatData = {
                            ...res.data.profile,
                            ...res.data.profile.bankDetails,
                            ...res.data.profile.operationalDetails,
                            shopAddress_street: res.data.profile.shopAddress?.street || '',
                            shopAddress_city: res.data.profile.shopAddress?.city || '',
                            shopAddress_district: res.data.profile.shopAddress?.district || '',
                            shopAddress_state: res.data.profile.shopAddress?.state || '',
                            shopAddress_pincode: res.data.profile.shopAddress?.pincode || '',
                        } as unknown as FlatOnboardingForm;
                        reset(flatData);
                    }
                }
            } catch (error: unknown) {
                console.error('Failed to fetch draft/status:', error);
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    setGlobalError('Not authorized. Please login as a demo user to continue.');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchStatus();
    }, [reset, user]);

    const handleSendOtp = () => {
        setOtpSent(true);
        showToast('OTP sent to your mobile number! (Mocked)');
    };

    const handleVerifyOtp = () => {
        setIsOtpVerified(true);
        showToast('Mobile number verified successfully!');
    };

    const generatePDF = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const doc = new jsPDF() as any;

        // Header
        doc.setFontSize(22);
        doc.text('Shop Registration Summary', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`Registration ID: ${formData.operationalDetails?.registrationId || 'N/A'}`, 105, 30, { align: 'center' });
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 37, { align: 'center' });

        // Basic Info
        doc.setDrawColor(200);
        doc.line(20, 45, 190, 45);

        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text('Business Details', 20, 55);

        const businessTable = [
            ['Shop Name', formData.businessName || 'N/A'],
            ['Owner Name', formData.ownerName || 'N/A'],
            ['Mobile Number', formData.mobileNumber || 'N/A'],
            ['Category', formData.natureOfBusiness || 'N/A'],
            ['GST Number', formData.gstin || 'N/A'],
            ['PAN Number', formData.panNumber || 'N/A'],
        ];

        doc.autoTable({
            startY: 60,
            head: [['Field', 'Value']],
            body: businessTable,
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42] }
        });

        // Address Info
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const addressY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(16);
        doc.text('Shop Address', 20, addressY);

        const addressTable = [
            ['Street', formData.shopAddress?.street || 'N/A'],
            ['City/District', `${formData.shopAddress?.city || ''}, ${formData.shopAddress?.district || ''}`],
            ['State', formData.shopAddress?.state || 'N/A'],
            ['Pincode', formData.shopAddress?.pincode || 'N/A'],
        ];

        doc.autoTable({
            startY: addressY + 5,
            head: [['Field', 'Value']],
            body: addressTable,
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42] }
        });

        // Banking Info
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bankY = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(16);
        doc.text('Banking Details', 20, bankY);

        const bankTable = [
            ['Bank Name', formData.bankDetails?.bankName || 'N/A'],
            ['Account Number', formData.bankDetails?.accountNumber || 'N/A'],
            ['IFSC Code', formData.bankDetails?.ifscCode || 'N/A'],
            ['UPI ID', formData.bankDetails?.upiId || 'N/A'],
        ];

        doc.autoTable({
            startY: bankY + 5,
            head: [['Field', 'Value']],
            body: bankTable,
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42] }
        });

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('This is an auto-generated registration summary for reference.', 105, 280, { align: 'center' });

        doc.save(`${formData.businessName || 'shop'}_registration_summary.pdf`);
    };

    const handleNext = async (data: FlatOnboardingForm) => {
        setSubmitting(true);
        setGlobalError(null);
        console.log('Submitting step:', currentStep, 'with data:', data);

        try {
            // Map flat data to IBusinessProfile
            const mappedData: Partial<IBusinessProfile> = {
                ...formData,
                businessName: data.businessName || formData.businessName,
                ownerName: data.ownerName || formData.ownerName,
                mobileNumber: data.mobileNumber || formData.mobileNumber,
                isMobileVerified: isOtpVerified,
                natureOfBusiness: data.natureOfBusiness || formData.natureOfBusiness,
                category: data.category || formData.category,
                panNumber: data.panNumber || formData.panNumber,
                gstin: data.gstin || formData.gstin,
                licenseNumber: data.licenseNumber || formData.licenseNumber,
                udyamNumber: data.udyamNumber || formData.udyamNumber,
            };

            // Only update address if we have street (from Step 3)
            if (data.shopAddress_street) {
                mappedData.shopAddress = {
                    street: data.shopAddress_street,
                    city: data.shopAddress_city,
                    district: data.shopAddress_district,
                    state: data.shopAddress_state,
                    pincode: data.shopAddress_pincode
                };
            }

            // Only update bank if we have account number (from Step 4)
            if (data.accountNumber) {
                mappedData.bankDetails = {
                    accountHolderName: data.accountHolderName,
                    bankName: data.bankName,
                    accountNumber: data.accountNumber,
                    ifscCode: data.ifscCode,
                    upiId: data.upiId
                };
            }

            // Update operational/commission (Step 6)
            mappedData.operationalDetails = {
                ...(formData.operationalDetails || {}),
                commissionAccepted: data.commissionAccepted ?? formData.operationalDetails?.commissionAccepted,
            } as IBusinessProfile['operationalDetails'];

            setFormData(mappedData);

            // Mobile verification check bypassed
            /*
            if (currentStep === 1 && !isOtpVerified) {
                setGlobalError('Please verify your mobile number with the OTP before proceeding.');
                return;
            }
            */

            if (currentStep < 6) {
                const res = await saveOnboardingDraft(mappedData);
                if (res.success) {
                    setCurrentStep(prev => prev + 1);
                    window.scrollTo(0, 0);
                } else {
                    setGlobalError(res.message || 'Failed to save draft');
                }
            } else {
                const res = await submitOnboarding(mappedData as IBusinessProfile);
                if (res.success) {
                    setFormData(res.data);
                    setStatus('pending');
                    window.scrollTo(0, 0);
                } else {
                    setGlobalError(res.message || 'Failed to submit registration');
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error('Error in handleNext:', err);
            setGlobalError(err.response?.data?.message || err.message || 'An unexpected error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const onSaveDraft = async () => {
        const data = watch(); // Get latest data from form
        const mappedData: Partial<IBusinessProfile> = {
            ...formData,
            businessName: data.businessName || formData.businessName,
            ownerName: data.ownerName || formData.ownerName,
            mobileNumber: data.mobileNumber || formData.mobileNumber,
            isMobileVerified: isOtpVerified,
            natureOfBusiness: data.natureOfBusiness || formData.natureOfBusiness,
            category: data.category || formData.category,
            panNumber: data.panNumber || formData.panNumber,
            gstin: data.gstin || formData.gstin,
            licenseNumber: data.licenseNumber || formData.licenseNumber,
            udyamNumber: data.udyamNumber || formData.udyamNumber,
        };

        if (data.shopAddress_street) {
            mappedData.shopAddress = {
                street: data.shopAddress_street,
                city: data.shopAddress_city,
                district: data.shopAddress_district,
                state: data.shopAddress_state,
                pincode: data.shopAddress_pincode
            };
        }

        setSubmitting(true);
        try {
            const res = await saveOnboardingDraft(mappedData);
            if (res.success) {
                setFormData(mappedData);
                showToast('Draft saved successfully!');
            } else {
                setGlobalError(res.message || 'Failed to save draft');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setGlobalError(err.message || 'Error saving draft');
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (status === 'pending') {
        return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-none shadow-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl rounded-[40px] p-10 text-center">
                    <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary-600">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Registration Submitted!</h2>
                    <p className="text-sm font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-full inline-block mb-4">
                        ID: {formData.operationalDetails?.registrationId || 'Generating...'}
                    </p>
                    <p className="text-slate-500 mb-8">Your application is under review. You can download your registration summary below.</p>

                    <div className="space-y-4">
                        <Button
                            onClick={generatePDF}
                            className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center gap-2"
                        >
                            <FileText className="w-5 h-5" />
                            Download Summary PDF
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/')}
                            className="w-full h-14 rounded-2xl text-slate-500 font-bold"
                        >
                            Back to Home
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    if (status === 'approved') {
        return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-none shadow-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl rounded-[40px] p-10 text-center">
                    <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-green-500">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Store Approved!</h2>
                    <p className="text-slate-500 mb-8">Congratulations! Your business registration is approved. You can now start listing products.</p>
                    <Button onClick={() => router.push('/seller/dashboard')} className="w-full h-14 rounded-2xl bg-green-500 text-white font-bold">
                        Go to Dashboard
                    </Button>
                </Card>
            </div>
        );
    }

    /* // Moving this check inside the form to prevent data loss 
    if (!user) {
        ...
    }
    */
    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Progress Header */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-8 px-2">
                        {STEPS.map((step) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                                <div key={step.id} className="flex flex-col items-center relative flex-1">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 shadow-lg",
                                        isActive ? "bg-primary-600 text-white scale-110 shadow-primary-500/25" :
                                            isCompleted ? "bg-green-500 text-white" : "bg-white dark:bg-slate-800 text-slate-400"
                                    )}>
                                        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <p className={cn(
                                        "text-[10px] font-bold uppercase tracking-widest mt-3 transition-colors",
                                        isActive ? "text-primary-600" : "text-slate-400"
                                    )}>
                                        {step.title}
                                    </p>
                                    {step.id < 5 && (
                                        <div className="absolute top-6 left-1/2 w-full h-[2px] bg-slate-200 dark:bg-slate-800 -z-0">
                                            <div className={cn(
                                                "h-full bg-primary-600 transition-all duration-700",
                                                currentStep > step.id ? "w-full" : "w-0"
                                            )} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Form Card - Glassmorphism style */}
                <Card className="border-none shadow-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl rounded-[40px] overflow-hidden border border-white/20 dark:border-white/5">
                    <CardContent className="p-8 md:p-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <form onSubmit={handleSubmit(handleNext)} className="space-y-8">
                                    {/* Step Title Section */}
                                    <div className="mb-10">
                                        <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                            {STEPS[currentStep - 1].title}
                                            <span className="text-sm font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                                Step {currentStep}/6
                                            </span>
                                        </h2>
                                        <p className="text-slate-500 mt-2">Please provide your {STEPS[currentStep - 1].title.toLowerCase()} for verification.</p>
                                        {Object.keys(errors).length > 0 && (
                                            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl">
                                                <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Please fix the highlighted field errors to proceed</p>
                                            </div>
                                        )}
                                        {globalError && (
                                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                                <div className="flex items-center gap-3">
                                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                                    <p className="text-sm font-bold text-red-600 dark:text-red-400">{globalError}</p>
                                                </div>
                                                {globalError.includes('Not authorized') && (
                                                    <div className="mt-4">
                                                        <Button
                                                            onClick={() => {
                                                                loginAsDev();
                                                                setGlobalError(null);
                                                            }}
                                                            variant="secondary"
                                                            className="h-10 px-4 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-50 dark:bg-slate-800 dark:text-white"
                                                        >
                                                            Fix: Login as Demo User
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {toast && (
                                            <div className={cn(
                                                "mt-4 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2",
                                                toast.type === 'success' ? "bg-green-500/10 border border-green-500/20" : "bg-red-500/10 border border-red-500/20"
                                            )}>
                                                {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                                                <p className={cn("text-sm font-bold", toast.type === 'success' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>{toast.message}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* STEP CONTENT RENDERING */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {renderStepContent(
                                            currentStep,
                                            register,
                                            errors,
                                            setValue,
                                            watch,
                                            otpSent,
                                            handleSendOtp,
                                            isOtpVerified,
                                            handleVerifyOtp,
                                            (docKey: string, file: File) => {
                                                setFormData((prev: Partial<IBusinessProfile>) => ({
                                                    ...prev,
                                                    documents: {
                                                        ...(prev.documents || {}),
                                                        [docKey]: file.name // Simulating upload, storing name
                                                    }
                                                }));
                                            }
                                        )}
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="flex items-center justify-between pt-10 border-t border-slate-100 dark:border-white/5 mt-10">
                                        <div className="flex gap-4">
                                            {currentStep > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handleBack}
                                                    disabled={submitting}
                                                    className="h-14 px-8 rounded-2xl font-bold border-slate-200"
                                                >
                                                    <ChevronLeft className="w-5 h-5 mr-2" />
                                                    Back
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={onSaveDraft}
                                                disabled={submitting}
                                                className="h-14 px-8 rounded-2xl font-bold text-slate-500 hover:text-primary-600 disabled:opacity-50"
                                            >
                                                <Save className="w-5 h-5 mr-2" />
                                                Save Draft
                                            </Button>
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={submitting}
                                            className="h-14 px-10 rounded-2xl font-bold bg-slate-900 text-white shadow-xl shadow-slate-900/10 flex items-center gap-2"
                                        >
                                            {submitting ? 'Saving...' : (currentStep === 6 ? 'Submit for Review' : 'Save & Continue')}
                                            {!submitting && <ChevronRight className="w-5 h-5" />}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// --- RENDERING HELPERS ---
function renderStepContent(
    step: number,
    register: UseFormRegister<FlatOnboardingForm>,
    errors: FieldErrors<FlatOnboardingForm>,
    setValue: UseFormSetValue<FlatOnboardingForm>,
    watch: UseFormWatch<FlatOnboardingForm>,
    otpSent: boolean,
    handleSendOtp: () => void,
    isOtpVerified: boolean,
    handleVerifyOtp: () => void,
    handleDocUpload: (key: string, file: File) => void
) {
    const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const pincode = e.target.value;
        if (pincode.length === 6) {
            try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                const data = await res.json();
                if (data[0].Status === 'Success') {
                    const postOffice = data[0].PostOffice[0];
                    setValue('shopAddress_city', postOffice.Block);
                    setValue('shopAddress_district', postOffice.District);
                    setValue('shopAddress_state', postOffice.State);
                }
            } catch (err) {
                console.error('Failed to fetch pincode data', err);
            }
        }
    };

    switch (step) {
        case 1:
            return (
                <>
                    <FormField label="Shop Name" name="businessName" register={register} errors={errors} placeholder="Acme Store" />
                    <FormField label="Owner Name" name="ownerName" register={register} errors={errors} placeholder="John Doe" />
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex justify-between">
                            Mobile Number
                            {errors.mobileNumber && <span className="text-red-500 normal-case font-medium tracking-normal">{errors.mobileNumber.message as string}</span>}
                        </label>
                        <div className="relative">
                            <Input {...register('mobileNumber')} placeholder="9988776655" className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 px-5 text-sm" />
                            {isOtpVerified && (
                                <div className="absolute right-4 top-4 flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-100 dark:border-green-900/30">
                                    <CheckCircle2 className="w-4 h-4" /> Verified
                                </div>
                            )}
                        </div>
                    </div>
                    <FormField label="Email ID" name="email" register={register} errors={errors} placeholder="owner@example.com" />
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex justify-between">
                            Business Category
                            {errors.natureOfBusiness && <span className="text-red-500 normal-case font-medium tracking-normal">{errors.natureOfBusiness.message as string}</span>}
                        </label>
                        <select {...register('natureOfBusiness')} className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 px-5 text-sm outline-none focus:border-primary-500 transition-all">
                            <option value="Retailer">Retail</option>
                            <option value="Wholesaler">Wholesale</option>
                            <option value="Service Provider">Service</option>
                            <option value="Manufacturer">Manufacturing</option>
                            <option value="E-commerce">E-commerce</option>
                        </select>
                    </div>
                    <FormField label="Specific Category" name="category" register={register} errors={errors} placeholder="Electronics, Clothing, etc." />
                </>
            );
        case 2:
            return (
                <>
                    <FormField label="GST Number" name="gstin" register={register} errors={errors} placeholder="22AAAAA0000A1Z5" />
                    <FormField label="PAN Number" name="panNumber" register={register} errors={errors} placeholder="ABCDE1234F" />
                    <FormField label="Shop & Establishment License (Optional)" name="licenseNumber" register={register} errors={errors} placeholder="LIC123456" />
                    <FormField label="UDYAM Registration (Optional)" name="udyamNumber" register={register} errors={errors} placeholder="UDYAM-XX-00-1234567" />
                </>
            );
        case 3:
            return (
                <>
                    <div className="col-span-1 md:col-span-2 space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Pincode (Auto-fills City/State)</label>
                        <Input
                            {...register('shopAddress_pincode')}
                            placeholder="560001"
                            onChange={(e) => {
                                register('shopAddress_pincode').onChange(e);
                                handlePincodeChange(e);
                            }}
                            className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 px-5 text-sm"
                        />
                    </div>
                    <FormField label="Shop Address" name="shopAddress_street" register={register} errors={errors} placeholder="Flat, Street, Area" />
                    <FormField label="District" name="shopAddress_district" register={register} errors={errors} placeholder="District" />
                    <FormField label="City" name="shopAddress_city" register={register} errors={errors} placeholder="City" />
                    <FormField label="State" name="shopAddress_state" register={register} errors={errors} placeholder="State" />
                </>
            );
        case 4:
            return (
                <>
                    <FormField label="Bank Name" name="bankName" register={register} errors={errors} placeholder="State Bank of India" />
                    <FormField label="Account Number" name="accountNumber" register={register} errors={errors} placeholder="1234567890" />
                    <FormField label="IFSC Code" name="ifscCode" register={register} errors={errors} placeholder="SBIN0001234" />
                    <FormField label="UPI ID (Optional)" name="upiId" register={register} errors={errors} placeholder="owner@upi" />
                </>
            );
        case 5:
            return (
                <>
                    <DocumentUpload label="Shop Logo" onUpload={(file) => handleDocUpload('shopLogo', file)} />
                    <DocumentUpload label="GST Certificate" onUpload={(file) => handleDocUpload('gstCertificate', file)} />
                    <DocumentUpload label="ID Proof (Aadhaar/PAN)" onUpload={(file) => handleDocUpload('idProof', file)} />
                    <DocumentUpload label="Digital Signature" onUpload={(file) => handleDocUpload('digitalSignature', file)} />
                </>
            );
        case 6:
            return (
                <div className="col-span-1 md:col-span-2 space-y-8">
                    <div className="p-10 rounded-[32px] bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Review Registration</h3>
                        <p className="text-sm text-slate-500">Please review all your details before final submission. Once submitted, you cannot edit them until approved.</p>

                        <div className="flex items-start gap-4">
                            <input {...register('commissionAccepted')} type="checkbox" className="mt-1 w-6 h-6 rounded-lg accent-primary-600" />
                            <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">I agree to the Terms & Conditions</p>
                                <p className="text-xs text-slate-500 mt-1">By checking this, you agree to our platform seller agreement and 5% commission policy.</p>
                                {errors.commissionAccepted && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-widest">{errors.commissionAccepted.message as string}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            );
        default:
            return null;
    }
}

interface FormFieldProps {
    label: string;
    name: Path<FlatOnboardingForm>;
    register: UseFormRegister<FlatOnboardingForm>;
    errors: FieldErrors<FlatOnboardingForm>;
    placeholder: string;
    type?: string;
}

function FormField({ label, name, register, errors, placeholder, type = "text" }: FormFieldProps) {
    return (
        <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex justify-between">
                {label}
                {errors[name] && <span className="text-red-500 normal-case font-medium tracking-normal flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors[name].message as string}
                </span>}
            </label>
            <div className="relative group">
                <Input
                    {...register(name)}
                    type={type}
                    placeholder={placeholder}
                    className={cn(
                        "h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 px-5 text-sm transition-all duration-300 focus-visible:ring-primary-500/20 group-hover:border-slate-300 dark:group-hover:border-white/20",
                        errors[name] && "border-red-500 bg-red-50/50 dark:bg-red-500/5 focus-visible:ring-red-500/20"
                    )}
                />
                {!errors[name] && <div className="absolute right-4 top-4 text-green-500 opacity-0 transition-opacity">
                    <CheckCircle2 className="w-5 h-5" />
                </div>}
            </div>
        </div>
    );
}



