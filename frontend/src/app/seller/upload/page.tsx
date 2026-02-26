'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Upload, Plus, X, Package, Palette, Info, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import api from '@/services/api';

const productSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.preprocess((val) => Number(val), z.number().positive('Price must be positive')),
    category: z.string().min(1, 'Category is required'),
    brand: z.string().min(1, 'Brand is required'),
    countInStock: z.preprocess((val) => Number(val), z.number().int().min(0, 'Stock cannot be negative')),
    images: z.array(z.string()).min(1, 'At least one image is required'),
    variants: z.array(z.object({
        size: z.string().optional(),
        color: z.string().optional(),
        stock: z.preprocess((val) => Number(val), z.number().int().min(0)),
    })).optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export default function SellerUploadPage() {
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState('');

    const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm<ProductForm>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            images: [],
            variants: [{ size: '', color: '', stock: 0 }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants"
    });

    const images = watch('images');

    const addImage = () => {
        if (imageUrl.trim()) {
            setValue('images', [...images, imageUrl.trim()]);
            setImageUrl('');
        }
    };

    const removeImage = (index: number) => {
        setValue('images', images.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: ProductForm) => {
        try {
            const response = await api.post('/products', data);
            if (response.data.success) {
                router.push('/shop');
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
                        <Upload className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Upload Product</h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Add a new item to your store catalogue</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Basic Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="rounded-3xl border-none shadow-premium-hover bg-white/70 backdrop-blur-xl dark:bg-white/5 overflow-hidden">
                                <CardHeader className="border-b border-slate-100 dark:border-white/5 pb-6">
                                    <div className="flex items-center gap-2 text-primary-600 mb-1">
                                        <Package className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Core Details</span>
                                    </div>
                                    <CardTitle className="text-xl">General Information</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">Product Name</label>
                                        <Input
                                            {...register('name')}
                                            placeholder="e.g. Minimalist Wooden Desk"
                                            className="h-12 rounded-xl bg-slate-50/50 border-slate-200 dark:bg-transparent dark:border-white/10"
                                        />
                                        {errors.name && <p className="text-xs text-red-500 font-bold">{errors.name.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">Description</label>
                                        <Textarea
                                            {...register('description')}
                                            placeholder="Tell customers more about your product..."
                                            className="min-h-[120px] rounded-2xl bg-slate-50/50 border-slate-200 dark:bg-transparent dark:border-white/10 p-4"
                                        />
                                        {errors.description && <p className="text-xs text-red-500 font-bold">{errors.description.message}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">Category</label>
                                            <Input
                                                {...register('category')}
                                                placeholder="e.g. Furniture"
                                                className="h-12 rounded-xl bg-slate-50/50 border-slate-200 dark:bg-transparent dark:border-white/10"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">Brand</label>
                                            <Input
                                                {...register('brand')}
                                                placeholder="e.g. Artisan Wood"
                                                className="h-12 rounded-xl bg-slate-50/50 border-slate-200 dark:bg-transparent dark:border-white/10"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-white/5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400 text-primary-600">Price ($)</label>
                                            <Input
                                                {...register('price')}
                                                type="number"
                                                placeholder="0.00"
                                                className="h-12 rounded-xl bg-slate-50/50 border-slate-200 dark:bg-transparent dark:border-white/10 font-bold text-lg"
                                            />
                                            {errors.price && <p className="text-xs text-red-500 font-bold">{errors.price.message}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">Initial Stock</label>
                                            <Input
                                                {...register('countInStock')}
                                                type="number"
                                                placeholder="10"
                                                className="h-12 rounded-xl bg-slate-50/50 border-slate-200 dark:bg-transparent dark:border-white/10"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-3xl border-none shadow-premium-hover bg-white/70 backdrop-blur-xl dark:bg-white/5">
                                <CardHeader className="border-b border-slate-100 dark:border-white/5 pb-6">
                                    <div className="flex items-center gap-2 text-primary-600 mb-1">
                                        <Palette className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Variants</span>
                                    </div>
                                    <CardTitle className="text-xl">Sizes & Colors</CardTitle>
                                    <CardDescription>Add different versions of your product</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex gap-4 items-end pb-4 border-b border-slate-100 dark:border-white/5 last:border-0 last:pb-0">
                                            <div className="flex-1 space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400">Size</label>
                                                <Input {...register(`variants.${index}.size`)} placeholder="S, M, L..." className="bg-slate-50/50 border-slate-100" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400">Color</label>
                                                <Input {...register(`variants.${index}.color`)} placeholder="Black, Oak..." className="bg-slate-50/50 border-slate-100" />
                                            </div>
                                            <div className="w-24 space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400">Stock</label>
                                                <Input type="number" {...register(`variants.${index}.stock`)} className="bg-slate-50/50 border-slate-100" />
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="rounded-lg text-slate-400 hover:text-red-500">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => append({ size: '', color: '', stock: 0 })}
                                        className="mt-2 rounded-xl border-dashed border-2 hover:border-primary-600 hover:text-primary-600"
                                    >
                                        <Plus className="h-4 w-4 mr-2" /> Add Variant
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Images */}
                        <div className="space-y-6">
                            <Card className="rounded-3xl border-none shadow-premium-hover bg-white/70 backdrop-blur-xl dark:bg-white/5 min-h-[400px]">
                                <CardHeader className="border-b border-slate-100 dark:border-white/5 pb-6">
                                    <div className="flex items-center gap-2 text-primary-600 mb-1">
                                        <ImageIcon className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Media</span>
                                    </div>
                                    <CardTitle className="text-xl">Product Images</CardTitle>
                                    <CardDescription>Upload via URL (Unsplash, Cloudinary, etc.)</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Input
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                                placeholder="Paste image URL..."
                                                className="pl-9 rounded-xl bg-slate-50/50 border-slate-200"
                                            />
                                            <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        </div>
                                        <Button type="button" onClick={addImage} size="icon" className="rounded-xl bg-slate-900">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {images.map((url, i) => (
                                            <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={url} alt={`Preview ${i}`} className="object-cover h-full w-full" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(i)}
                                                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.images && <p className="text-xs text-red-500 font-bold">{errors.images.message}</p>}

                                    <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/30 flex gap-4">
                                        <Info className="h-5 w-5 text-primary-600 shrink-0" />
                                        <p className="text-[10px] leading-relaxed text-primary-800 dark:text-primary-300 font-medium">
                                            Tip: Use high-quality vertical images for a more premium look in the feed.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-16 rounded-3xl bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-[0.25em] text-xs shadow-xl shadow-primary-600/20 transition-all hover:-translate-y-1 active:scale-95"
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish Product'}
                            </Button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
