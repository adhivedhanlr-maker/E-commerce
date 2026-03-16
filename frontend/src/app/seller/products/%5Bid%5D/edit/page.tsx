'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, Plus, X, Package, Link as LinkIcon, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import api from '@/services/api';

const productSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.preprocess((val) => Number(val) || 0, z.number().positive('Price must be positive')),
    category: z.string().min(1, 'Category is required'),
    brand: z.string().min(1, 'Brand is required'),
    countInStock: z.preprocess((val) => Number(val) || 0, z.number().int().min(0, 'Stock cannot be negative')),
    images: z.array(z.string()).min(1, 'At least one image is required'),
    variants: z.array(z.object({
        size: z.string().optional(),
        color: z.string().optional(),
        stock: z.preprocess((val) => Number(val) || 0, z.number().int().min(0)),
    })).optional(),
});

type ProductForm = z.infer<typeof productSchema>;

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, control, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<ProductForm>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(productSchema) as any,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants"
    });

    const images = watch('images') || [];

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                if (data.success) {
                    reset(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
                alert('Failed to load product details.');
                router.push('/seller/products');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id, reset, router]);

    const addImage = (e?: React.MouseEvent | React.KeyboardEvent) => {
        if (e) e.preventDefault();
        if (imageUrl.trim()) {
            setValue('images', [...images, imageUrl.trim()]);
            setImageUrl('');
        }
    };

    const removeImage = (index: number) => {
        setValue('images', images.filter((_, i) => i !== index));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const { data } = await api.post('/upload', formData);
            if (data.success) {
                setValue('images', [...images, data.data.url]);
            }
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            alert(error.response?.data?.message || error.message || 'Upload failed');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const onSubmit = async (data: ProductForm) => {
        try {
            const response = await api.put(`/products/${id}`, data);
            if (response.data.success) {
                router.push('/seller/products');
            }
        } catch (error) {
            console.error('Update failed:', error);
            alert('Failed to update product.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-600/20">
                        <Package className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Edit Product</h1>
                        <p className="text-slate-500 font-medium">Update your product listing details</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="rounded-3xl border-none shadow-premium bg-white dark:bg-white/5">
                                <CardHeader className="border-b pb-6">
                                    <CardTitle className="text-xl">General Information</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-slate-400">Product Name</label>
                                        <Input {...register('name')} className="h-12 rounded-xl bg-slate-50/50" />
                                        {errors.name && <p className="text-xs text-red-500 font-bold">{errors.name.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase text-slate-400">Description</label>
                                        <Textarea {...register('description')} className="min-h-[120px] rounded-2xl bg-slate-50/50" />
                                        {errors.description && <p className="text-xs text-red-500 font-bold">{errors.description.message}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-slate-400">Category</label>
                                            <Input {...register('category')} className="h-12 rounded-xl bg-slate-50/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-slate-400">Brand</label>
                                            <Input {...register('brand')} className="h-12 rounded-xl bg-slate-50/50" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-primary-600">Price (₹)</label>
                                            <Input {...register('price')} type="number" className="h-12 rounded-xl bg-slate-50/50 font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase text-slate-400">Inventory Stock</label>
                                            <Input {...register('countInStock')} type="number" className="h-12 rounded-xl bg-slate-50/50" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-3xl border-none shadow-premium bg-white dark:bg-white/5">
                                <CardHeader className="border-b pb-6">
                                    <CardTitle className="text-xl">Variants</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 space-y-4">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex gap-4 items-end pb-4 border-b last:border-0 last:pb-0">
                                            <div className="flex-1 space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400">Size</label>
                                                <Input {...register(`variants.${index}.size`)} className="bg-slate-50/50" />
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400">Color</label>
                                                <Input {...register(`variants.${index}.color`)} className="bg-slate-50/50" />
                                            </div>
                                            <div className="w-24 space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400">Stock</label>
                                                <Input type="number" {...register(`variants.${index}.stock`)} className="bg-slate-50/50" />
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-red-500">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" variant="outline" size="sm" onClick={() => append({ size: '', color: '', stock: 0 })} className="mt-2 rounded-xl border-dashed">
                                        <Plus className="h-4 w-4 mr-2" /> Add Variant
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="rounded-3xl border-none shadow-premium bg-white dark:bg-white/5">
                                <CardHeader className="border-b pb-6">
                                    <CardTitle className="text-xl">Media</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Input
                                                    value={imageUrl}
                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && addImage(e)}
                                                    placeholder="URL..."
                                                    className="pl-9 rounded-xl transition-all focus:ring-2 focus:ring-primary-500"
                                                />
                                                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                            </div>
                                            <Button type="button" onClick={addImage} size="icon" className="rounded-xl bg-slate-900">
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            className="w-full h-12 rounded-xl border-2 border-dashed bg-slate-50/50 text-slate-600 hover:bg-slate-100 transition-all font-bold"
                                        >
                                            {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                                            Upload Image
                                        </Button>
                                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {images.map((url, i) => (
                                            <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={url} alt="Preview" className="object-cover h-full w-full" />
                                                <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.images && <p className="text-xs text-red-500 font-bold">{errors.images.message}</p>}
                                </CardContent>
                            </Card>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-16 rounded-3xl bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-600/20 transition-all hover:-translate-y-1"
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Changes
                            </Button>
                            
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => router.push('/seller/products')}
                                className="w-full h-12 rounded-2xl text-slate-500 font-bold"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
