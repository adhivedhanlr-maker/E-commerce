'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Building2, 
    FileText, 
    User, 
    CreditCard, 
    Package, 
    CheckCircle2, 
    ChevronRight, 
    ChevronLeft,
    Save,
    AlertCircle,
    Info,
    UploadCloud
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { saveOnboardingDraft, submitOnboarding, getOnboardingStatus } from '@/services/sellerService';
import { useAuth } from '@/store/useAuth';
import { DocumentUpload } from '@/components/seller/DocumentUpload';
import { cn } from '@/lib/utils';

// --- SCHEMAS ---
const stepSchemas = [
    // Step 1: Basic Details
    z.object({
        businessName: z.string().min(2, 'Business name is required'),
        tradeName: z.string().min(2, 'Trade name is required'),
        businessType: z.enum(['Proprietorship', 'Partnership', 'LLP', 'Pvt Ltd', 'OPC']),
        dateOfIncorporation: z.string(),
        natureOfBusiness: z.enum(['Retailer', 'Wholesaler', 'Manufacturer', 'Service Provider']),
        category: z.string().min(2, 'Category is required'),
    }),
    // Step 2: Legal Details
    z.object({
        panNumber: z.string().regex(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, 'Invalid PAN format'),
        gstin: z.string().optional(),
        cin: z.string().optional(),
        msmeNumber: z.string().optional(),
    }),
    // Step 3: Owner Details
    z.object({
        ownerName: z.string().min(2, 'Full name is required'),
        aadhaarNumber: z.string().length(12, 'Aadhaar must be 12 digits'),
        mobileNumber: z.string().length(10, 'Mobile must be 10 digits'),
        address: z.string().min(10, 'Full address is required'),
    }),
    // Step 4: Bank Details
    z.object({
        accountHolderName: z.string().min(2, 'Account holder name is required'),
        bankName: z.string().min(2, 'Bank name is required'),
        accountNumber: z.string().min(8, 'Invalid account number'),
        ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC format'),
        upiId: z.string().optional(),
    }),
    // Step 5: Operations
    z.object({
        warehouseAddress: z.string().min(10, 'Warehouse address is required'),
        pickupAddress: z.string().min(10, 'Pickup address is required'),
        returnAddress: z.string().min(10, 'Return address is required'),
        estimatedTurnover: z.string(),
        commissionAccepted: z.boolean().refine(v => v === true, 'You must accept the agreement'),
    })
];

const STEPS = [
    { id: 1, title: 'Basic Info', icon: Building2 },
    { id: 2, title: 'Legal & Tax', icon: FileText },
    { id: 3, title: 'Identity', icon: User },
    { id: 4, title: 'Banking', icon: CreditCard },
    { id: 5, title: 'Operations', icon: Package }
];

export default function AdvancedSellerRegister() {
    const router = useRouter();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<string>('none');

    const { register, handleSubmit, formState: { errors }, reset, trigger, setValue, watch } = useForm({
        resolver: zodResolver(stepSchemas[currentStep - 1]),
        mode: 'onChange'
    });

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await getOnboardingStatus();
                if (res.success) {
                    setStatus(res.data.status);
                    if (res.data.profile) {
                        setFormData(res.data.profile);
                        reset(res.data.profile);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch draft');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStatus();
    }, [reset]);

    const handleNext = async (data: any) => {
        const stepData = { ...formData, ...data };
        setFormData(stepData);
        
        if (currentStep < 5) {
            // Save draft automatically on next
            await saveOnboardingDraft(stepData);
            setCurrentStep(prev => prev + 1);
        } else {
            // Final Submit
            const res = await submitOnboarding(stepData);
            if (res.success) {
                setStatus('pending');
            }
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const onSaveDraft = async () => {
        await saveOnboardingDraft(formData);
        alert('Draft saved successfully!');
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (status === 'pending') {
        return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-none shadow-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl rounded-[40px] p-10 text-center">
                    <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary-600">
                        <Info className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Application Under Review</h2>
                    <p className="text-slate-500 mb-8">Our team is verifying your documents. We'll notify you once your store is activated.</p>
                    <Button onClick={() => router.push('/')} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold">
                        Back to Shopping
                    </Button>
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
                                            {STEPS[currentStep-1].title}
                                            <span className="text-sm font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                                Step {currentStep}/5
                                            </span>
                                        </h2>
                                        <p className="text-slate-500 mt-2">Please provide your {STEPS[currentStep-1].title.toLowerCase()} for verification.</p>
                                    </div>

                                    {/* STEP CONTENT RENDERING */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {renderStepContent(currentStep, register, errors, setValue, watch, (docKey: string, file: File) => {
                                            setFormData((prev: any) => ({
                                                ...prev,
                                                documents: {
                                                    ...(prev.documents || {}),
                                                    [docKey]: file.name // Simulating upload, storing name
                                                }
                                            }));
                                        })}
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="flex items-center justify-between pt-10 border-t border-slate-100 dark:border-white/5 mt-10">
                                        <div className="flex gap-4">
                                            {currentStep > 1 && (
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    onClick={handleBack}
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
                                                className="h-14 px-8 rounded-2xl font-bold text-slate-500 hover:text-primary-600"
                                            >
                                                <Save className="w-5 h-5 mr-2" />
                                                Save Draft
                                            </Button>
                                        </div>
                                        <Button 
                                            type="submit" 
                                            className="h-14 px-10 rounded-2xl font-bold bg-slate-900 text-white shadow-xl shadow-slate-900/10"
                                        >
                                            {currentStep === 5 ? 'Submit for Review' : 'Save & Continue'}
                                            <ChevronRight className="w-5 h-5 ml-2" />
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
function renderStepContent(step: number, register: any, errors: any, setValue: any, watch: any, handleDocUpload: (key: string, file: File) => void) {
    switch (step) {
        case 1:
            return (
                <>
                    <FormField label="Business Legal Name (as per PAN)" name="businessName" register={register} errors={errors} placeholder="Acme Corp" />
                    <FormField label="Trade Name" name="tradeName" register={register} errors={errors} placeholder="Acme Store" />
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Business Type</label>
                        <select {...register('businessType')} className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 px-5 text-sm outline-none focus:border-primary-500 transition-all">
                            <option value="Proprietorship">Proprietorship</option>
                            <option value="Partnership">Partnership</option>
                            <option value="LLP">LLP</option>
                            <option value="Pvt Ltd">Pvt Ltd</option>
                            <option value="OPC">OPC</option>
                        </select>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Nature of Business</label>
                        <select {...register('natureOfBusiness')} className="w-full h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 px-5 text-sm outline-none focus:border-primary-500 transition-all">
                            <option value="Retailer">Retailer</option>
                            <option value="Wholesaler">Wholesaler</option>
                            <option value="Manufacturer">Manufacturer</option>
                            <option value="Service Provider">Service Provider</option>
                        </select>
                    </div>
                </>
            );
        case 2:
            return (
                <>
                    <FormField label="PAN Number" name="panNumber" register={register} errors={errors} placeholder="ABCDE1234F" />
                    <FormField label="GSTIN (Optional)" name="gstin" register={register} errors={errors} placeholder="22AAAAA0000A1Z5" />
                    <DocumentUpload label="PAN Card Copy" onUpload={(file) => handleDocUpload('panCard', file)} />
                    <DocumentUpload label="GST Certificate" onUpload={(file) => handleDocUpload('gstCertificate', file)} />
                </>
            );
        case 3:
            return (
                <>
                    <FormField label="Owner Full Name" name="ownerName" register={register} errors={errors} placeholder="John Doe" />
                    <FormField label="Aadhaar Number" name="aadhaarNumber" register={register} errors={errors} placeholder="1234 5678 9012" />
                    <FormField label="Mobile Number" name="mobileNumber" register={register} errors={errors} placeholder="9988776655" />
                    <FormField label="Residential Address" name="address" register={register} errors={errors} placeholder="Flat, Street, Area, City" />
                    <DocumentUpload label="Aadhaar Front/Back" onUpload={(file) => handleDocUpload('aadhaarCard', file)} />
                    <DocumentUpload label="Owner Photo" onUpload={(file) => handleDocUpload('photo', file)} />
                </>
            );
        case 4:
            return (
                <>
                    <FormField label="Account Holder Name" name="accountHolderName" register={register} errors={errors} placeholder="John Doe" />
                    <FormField label="Bank Name" name="bankName" register={register} errors={errors} placeholder="State Bank of India" />
                    <FormField label="Account Number" name="accountNumber" register={register} errors={errors} placeholder="1234567890" />
                    <FormField label="IFSC Code" name="ifscCode" register={register} errors={errors} placeholder="SBIN0001234" />
                    <FormField label="UPI ID (Optional)" name="upiId" register={register} errors={errors} placeholder="john@upi" />
                    <DocumentUpload label="Cancelled Cheque copy" onUpload={(file) => handleDocUpload('cancelledCheque', file)} />
                </>
            );
        case 5:
            return (
                <>
                    <FormField label="Warehouse Address" name="warehouseAddress" register={register} errors={errors} placeholder="Full warehouse location" />
                    <FormField label="Pickup Address" name="pickupAddress" register={register} errors={errors} placeholder="Same as warehouse?" />
                    <FormField label="Return Address" name="returnAddress" register={register} errors={errors} placeholder="RTO location" />
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Estimated Monthly Turnover</label>
                        <select {...register('estimatedTurnover')} className="w-full h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 px-5 text-sm outline-none focus:border-primary-500 transition-all">
                            <option value="0-1L">Below 1 Lakh</option>
                            <option value="1L-5L">1 - 5 Lakhs</option>
                            <option value="5L-20L">5 - 20 Lakhs</option>
                            <option value="20L+">Above 20 Lakhs</option>
                        </select>
                    </div>
                    <div className="col-span-2 pt-6">
                        <label className="flex items-start gap-3 cursor-pointer p-4 rounded-2xl bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20">
                            <input {...register('commissionAccepted')} type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">I accept the Seller Commission Agreement</p>
                                <p className="text-xs text-slate-500 mt-1">By checking this, you agree to the platform commission fees as per the category guidelines.</p>
                                {errors.commissionAccepted && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider">{errors.commissionAccepted.message}</p>}
                            </div>
                        </label>
                    </div>
                </>
            );
        default:
            return null;
    }
}

function FormField({ label, name, register, errors, placeholder, type = "text" }: any) {
    return (
        <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 flex justify-between">
                {label}
                {errors[name] && <span className="text-red-500 normal-case font-medium tracking-normal flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors[name].message}
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

function DocUpload({ label }: { label: string }) {
    return (
        <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</label>
            <div className="h-32 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all">
                    <UploadCloud className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-bold text-slate-500">Click or Drag to Upload</p>
            </div>
        </div>
    );
}

