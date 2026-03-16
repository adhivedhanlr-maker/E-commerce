'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, Package, ExternalLink, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import api from '@/services/api';
import { useAuth } from '@/store/useAuth';

interface Product {
    _id: string;
    name: string;
    price: number;
    countInStock: number;
    images: string[];
    category: string;
}

export default function SellerProductsPage() {
    const { user } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMyProducts = async () => {
            try {
                setIsLoading(true);
                const { data } = await api.get('/products/myproducts');
                if (data.success) {
                    setProducts(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) fetchMyProducts();
    }, [user]);

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                const { data } = await api.delete(`/products/${id}`);
                if (data.success) {
                    setProducts(products.filter(p => p._id !== id));
                }
            } catch (error) {
                console.error('Failed to delete product:', error);
                alert('Failed to delete product. Please try again.');
            }
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">My Inventory</h1>
                        <p className="text-slate-500 font-medium">Manage and edit your product listings</p>
                    </motion.div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-12 w-64 rounded-xl border-none shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {filteredProducts.length === 0 ? (
                    <Card className="rounded-[40px] border-none shadow-xl p-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <Package className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">No products found</h2>
                        <p className="text-slate-500 mb-8">You haven&apos;t added any products to your inventory yet.</p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Card className="group rounded-3xl border-none shadow-premium hover:shadow-premium-hover transition-all duration-500 overflow-hidden bg-white/70 backdrop-blur-xl dark:bg-white/5">
                                    <div className="aspect-[4/3] overflow-hidden relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src={product.images[0] || '/placeholder.png'} 
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary-600 shadow-lg">
                                                {product.category}
                                            </span>
                                        </div>
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white line-clamp-1">{product.name}</h3>
                                                <p className="text-2xl font-black text-primary-600 mt-1">₹{product.price}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stock</p>
                                                <p className={cn(
                                                    "text-sm font-bold",
                                                    product.countInStock > 5 ? "text-emerald-500" : "text-amber-500"
                                                )}>{product.countInStock} units</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
                                            <Button asChild variant="outline" className="flex-1 rounded-xl h-11 font-bold border-slate-200">
                                                <Link href={`/seller/products/${product._id}/edit`}>
                                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                                </Link>
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="icon" 
                                                className="rounded-xl h-11 w-11 border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all"
                                                onClick={() => handleDelete(product._id, product.name)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <Button asChild variant="ghost" size="icon" className="rounded-xl h-11 w-11 text-slate-400 hover:text-primary-600">
                                                <Link href={`/product/${product._id}`} target="_blank">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
