'use client';

import React, { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FilterSidebar from '@/components/shop/FilterSidebar';
import ProductCard from '@/components/product/ProductCard';
import { Grid, List, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/services/productService';

interface Product {
    _id: string;
    name: string;
    price: number;
    originalPrice: number;
    discountPercentage: number;
    rating: number;
    images: string[];
    brand: string;
    category: string;
}

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const catParam = searchParams.get('cat');
    const keywordParam = searchParams.get('keyword');

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
    const [minRating, setMinRating] = useState<number>(0);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<string>('featured');
    const [currentPage, setCurrentPage] = useState(1);
    const PRODUCTS_PER_PAGE = 6;

    // Map URL param to category name
    useEffect(() => {
        if (catParam) {
            const mapping: Record<string, string> = {
                'electronics': 'Electronics',
                'fashion': 'Apparel',
                'home': 'Furniture',
                'lifestyle': 'Lifestyle',
            };
            const category = mapping[catParam.toLowerCase()];
            if (category && !selectedCategories.includes(category)) {
                setSelectedCategories([category]);
            }
        }
    }, [catParam]);

    // Fetch products from backend
    useEffect(() => {
        const fetchAllProducts = async () => {
            setIsLoading(true);
            try {
                const params: Record<string, string> = {};
                if (keywordParam) params.keyword = keywordParam;

                // Fetch all and filter client-side for now to maintain existing filter UI behavior
                // or fetch with all params. For this implementation, we'll fetch based on search/category.
                const response = await getProducts(params);
                const products = response?.data?.products ?? response?.products ?? [];
                setFetchedProducts(products);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllProducts();
    }, [keywordParam]);

    const filteredAndSortedProducts = useMemo(() => {
        return fetchedProducts.filter(product => {
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
            const ratingMatch = product.rating >= minRating;
            return categoryMatch && priceMatch && ratingMatch;
        }).sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'rating') return b.rating - a.rating;
            return 0; // featured/default
        });
    }, [fetchedProducts, selectedCategories, priceRange, minRating, sortBy]);

    const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        return filteredAndSortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
    }, [filteredAndSortedProducts, currentPage]);

    const handleFilterChange = (type: string, value: string | number | number[] | null) => {
        setCurrentPage(1);
        if (type === 'category' && typeof value === 'string') {
            setSelectedCategories(prev =>
                prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
            );
        } else if (type === 'price' && Array.isArray(value)) {
            setPriceRange(value as [number, number]);
        } else if (type === 'rating' && typeof value === 'number') {
            setMinRating(prev => prev === value ? 0 : value);
        } else if (type === 'clear') {
            setSelectedCategories([]);
            setPriceRange([0, 3000]);
            setMinRating(0);
            if (catParam || keywordParam) {
                router.push('/shop');
            }
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Mobile Sort Bar */}
                <div className="flex md:hidden items-center gap-4 mb-8">
                    <div className="flex-1 h-12 relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full h-full appearance-none bg-white dark:bg-slate-950 border border-secondary-200 dark:border-white/10 rounded-xl px-5 text-xs font-bold uppercase tracking-widest outline-none"
                        >
                            <option value="featured">Sort: Featured</option>
                            <option value="price-low">Sort: Price Low to High</option>
                            <option value="price-high">Sort: Price High to Low</option>
                            <option value="rating">Sort: Top Rated</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar */}
                    <div className="hidden md:block">
                        <FilterSidebar
                            selectedCategories={selectedCategories}
                            priceRange={priceRange}
                            minRating={minRating}
                            onFilterChange={handleFilterChange}
                        />
                    </div>

                    {/* Product Feed */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 border-b border-secondary-200/50 pb-8">
                            <div>
                                <h1 className="font-accent text-4xl font-bold text-slate-950 dark:text-white mb-2">
                                    {keywordParam ? `Search: "${keywordParam}"` : 'Shop All'} <span className="italic font-light text-secondary-400">Products</span>
                                </h1>
                                <p className="text-sm text-slate-500 tracking-tight">
                                    {isLoading ? 'Loading collections...' : `Showing ${paginatedProducts.length} of ${filteredAndSortedProducts.length} items`}
                                </p>
                            </div>
                            <div className="hidden md:flex items-center gap-6">
                                <div className="flex items-center space-x-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Layout</span>
                                    <div className="flex items-center bg-secondary-100 rounded-full p-1 dark:bg-white/5">
                                        <button onClick={() => setView('grid')} className={cn("h-8 w-8 flex items-center justify-center rounded-full transition-all", view === 'grid' ? "bg-white shadow-premium text-slate-900 dark:bg-slate-800 dark:text-white" : "text-slate-400 hover:text-slate-600")}>
                                            <Grid className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => setView('list')} className={cn("h-8 w-8 flex items-center justify-center rounded-full transition-all", view === 'list' ? "bg-white shadow-premium text-slate-900 dark:bg-slate-800 dark:text-white" : "text-slate-400 hover:text-slate-600")}>
                                            <List className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="relative group">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none flex items-center gap-3 bg-white dark:bg-slate-950 border border-secondary-200 dark:border-white/10 rounded-full px-5 py-2.5 text-[11px] font-black uppercase tracking-widest hover:border-primary-600 transition-all shadow-sm hover:shadow-premium outline-none pr-10"
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Best Rating</option>
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-hover:text-primary-600 transition-all pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-500">
                                <Loader2 className="h-10 w-10 animate-spin text-primary-600 mb-4" />
                                <p className="font-medium animate-pulse">Curating your collection...</p>
                            </div>
                        ) : paginatedProducts.length > 0 ? (
                            <div className={cn(
                                "grid gap-4 sm:gap-x-6 sm:gap-y-6",
                                view === 'grid' ? "grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                            )}>
                                {paginatedProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-secondary-50 rounded-3xl dark:bg-white/5 border border-dashed border-secondary-200">
                                <p className="text-slate-500 font-medium">No items match your {keywordParam ? 'search' : 'filters'}.</p>
                                <Button variant="link" onClick={() => handleFilterChange('clear', null)} className="mt-4 text-primary-600 font-bold uppercase tracking-widest text-xs">Reset All Filters</Button>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-16">
                                <div className="hidden sm:flex items-center justify-center gap-2">
                                    <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-primary-500 hover:text-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                        <ChevronDown className="h-4 w-4 rotate-90" />
                                    </button>
                                    <div className="flex items-center gap-2">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={cn("h-10 w-10 shrink-0 flex items-center justify-center rounded-lg border transition-all font-bold", currentPage === i + 1 ? "bg-primary-600 border-primary-600 text-white" : "border-slate-200 text-slate-600 hover:border-primary-500 hover:text-primary-600")}>
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-primary-500 hover:text-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                        <ChevronDown className="h-4 w-4 -rotate-90" />
                                    </button>
                                </div>
                                <div className="flex sm:hidden flex-col items-center gap-4">
                                    {currentPage < totalPages && (
                                        <Button size="lg" className="w-full rounded-xl bg-slate-900 text-white font-bold h-14 tracking-widest uppercase text-xs" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}>
                                            Next Page
                                        </Button>
                                    )}
                                    <span className="text-xs font-bold text-slate-500">Page {currentPage} of {totalPages}</span>
                                </div>
                            </div>
                        )}

                        {/* Mobile Filter Section */}
                        <div className="md:hidden mt-6 pt-12 border-t border-secondary-200/50">
                            <h2 className="font-accent text-3xl font-bold text-slate-950 dark:text-white mb-8">Filter Products</h2>
                            <FilterSidebar
                                selectedCategories={selectedCategories}
                                priceRange={priceRange}
                                minRating={minRating}
                                onFilterChange={handleFilterChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}
