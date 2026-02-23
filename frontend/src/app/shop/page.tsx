'use client';

import React, { useState, useMemo } from 'react';
import FilterSidebar from '@/components/shop/FilterSidebar';
import ProductCard from '@/components/product/ProductCard';
import { Grid, List, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';


const products = [
    {
        _id: "1",
        name: "Aura Pods Elite",
        price: 349.00,
        originalPrice: 429.00,
        discountPercentage: 20,
        rating: 4.9,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"],
        brand: "Nexus Audio",
        category: "Electronics"
    },
    {
        _id: "2",
        name: "Titan Phone 15",
        price: 1199.00,
        originalPrice: 1299.00,
        discountPercentage: 8,
        rating: 4.8,
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800"],
        brand: "Titan Tech",
        category: "Electronics"
    },
    {
        _id: "3",
        name: "Lumina Vision Pro",
        price: 2499.00,
        originalPrice: 2799.00,
        discountPercentage: 10,
        rating: 5.0,
        images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800"],
        brand: "Visionary",
        category: "Electronics"
    },
    {
        _id: "4",
        name: "Zenith Game Console",
        price: 499.00,
        originalPrice: 599.00,
        discountPercentage: 15,
        rating: 4.7,
        images: ["https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=800"],
        brand: "Zenith Interactive",
        category: "Electronics"
    },
    {
        _id: "5",
        name: "Eames Silhouette Lounge",
        price: 1250.00,
        originalPrice: 1500.00,
        discountPercentage: 16,
        rating: 4.9,
        images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800"],
        brand: "Heritage Home",
        category: "Furniture"
    },
    {
        _id: "6",
        name: "Zenith Minimalist Desk",
        price: 850.00,
        originalPrice: 950.00,
        discountPercentage: 10,
        rating: 4.8,
        images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800"],
        brand: "Heritage Home",
        category: "Furniture"
    },
    {
        _id: "7",
        name: "Lunar Orbital Lamp",
        price: 220.00,
        originalPrice: 280.00,
        discountPercentage: 21,
        rating: 4.6,
        images: ["https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800"],
        brand: "Lumina Design",
        category: "Furniture"
    },
    {
        _id: "8",
        name: "Obsidian Tech Jacket",
        price: 549.00,
        originalPrice: 650.00,
        discountPercentage: 15,
        rating: 4.9,
        images: ["https://images.unsplash.com/photo-1551488831-00ddcb6c6ec3?auto=format&fit=crop&q=80&w=800"],
        brand: "Apex Outdoor",
        category: "Apparel"
    },
    {
        _id: "9",
        name: "Merino Precision Knit",
        price: 180.00,
        originalPrice: 180.00,
        discountPercentage: 0,
        rating: 4.7,
        images: ["https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?auto=format&fit=crop&q=80&w=800"],
        brand: "Apex Outdoor",
        category: "Apparel"
    },
    {
        _id: "10",
        name: "Equinox Chrono X",
        price: 890.00,
        originalPrice: 1100.00,
        discountPercentage: 19,
        rating: 4.8,
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"],
        brand: "Temporal",
        category: "Electronics"
    },
    {
        _id: "11",
        name: "Metropolis Weekender",
        price: 420.00,
        originalPrice: 420.00,
        discountPercentage: 0,
        rating: 4.5,
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800"],
        brand: "Metro Craft",
        category: "Lifestyle"
    },
    {
        _id: "12",
        name: "Titan Watch Pro",
        price: 299.99,
        originalPrice: 349.99,
        discountPercentage: 15,
        rating: 4.5,
        images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800"],
        brand: "Titan Tech",
        category: "Electronics"
    },
    {
        _id: "13",
        name: "Zenith Keyboard",
        price: 159.99,
        originalPrice: 159.99,
        discountPercentage: 0,
        rating: 4.9,
        images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800"],
        brand: "KeyClick",
        category: "Electronics"
    },
    {
        _id: "14",
        name: "SlimBook Ultra 14",
        price: 899.99,
        originalPrice: 999.99,
        discountPercentage: 10,
        rating: 4.6,
        images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800"],
        brand: "SlimBook",
        category: "Electronics"
    },
    {
        _id: "15",
        name: "Velvet Cloud Sofa",
        price: 1800.00,
        originalPrice: 2200.00,
        discountPercentage: 18,
        rating: 4.9,
        images: ["https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800"],
        brand: "Heritage Home",
        category: "Furniture"
    },
    {
        _id: "16",
        name: "Onyx Coffee Table",
        price: 650.00,
        originalPrice: 750.00,
        discountPercentage: 13,
        rating: 4.7,
        images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800"],
        brand: "Heritage Home",
        category: "Furniture"
    },
    {
        _id: "17",
        name: "Silk Drapery Set",
        price: 320.00,
        originalPrice: 400.00,
        discountPercentage: 20,
        rating: 4.6,
        images: ["https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"],
        brand: "Heritage Home",
        category: "Furniture"
    },
    {
        _id: "18",
        name: "Cashmere Overcoat",
        price: 750.00,
        originalPrice: 850.00,
        discountPercentage: 11,
        rating: 5.0,
        images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=800"],
        brand: "Apex Outdoor",
        category: "Apparel"
    },
    {
        _id: "19",
        name: "Urban Cargo Joggers",
        price: 140.00,
        originalPrice: 160.00,
        discountPercentage: 12,
        rating: 4.4,
        images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800"],
        brand: "Apex Outdoor",
        category: "Apparel"
    },
    {
        _id: "20",
        name: "Nomad Canvas Backpack",
        price: 185.00,
        originalPrice: 210.00,
        discountPercentage: 12,
        rating: 4.5,
        images: ["https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800"],
        brand: "Metro Craft",
        category: "Lifestyle"
    },
    {
        _id: "21",
        name: "Nordic Scent Set",
        price: 65.00,
        originalPrice: 75.00,
        discountPercentage: 13,
        rating: 4.8,
        images: ["https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=800"],
        brand: "Lumina Design",
        category: "Lifestyle"
    },
    {
        _id: "22",
        name: "Aerospace Aviators",
        price: 155.00,
        originalPrice: 195.00,
        discountPercentage: 20,
        rating: 4.7,
        images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800"],
        brand: "Visionary",
        category: "Apparel"
    }
];

export default function ShopPage() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);
    const [minRating, setMinRating] = useState<number>(0);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<string>('featured');
    const [currentPage, setCurrentPage] = useState(1);
    const PRODUCTS_PER_PAGE = 6;

    const filteredAndSortedProducts = useMemo(() => {
        return products.filter(product => {
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
    }, [selectedCategories, priceRange, minRating, sortBy]);

    const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        return filteredAndSortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
    }, [filteredAndSortedProducts, currentPage]);

    const handleFilterChange = (type: string, value: any) => {
        setCurrentPage(1); // Reset to first page on filter change
        if (type === 'category') {
            setSelectedCategories(prev =>
                prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
            );
        } else if (type === 'price') {
            setPriceRange(value);
        } else if (type === 'rating') {
            setMinRating(prev => prev === value ? 0 : value);
        } else if (type === 'clear') {
            setSelectedCategories([]);
            setPriceRange([0, 3000]);
            setMinRating(0);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Mobile Sort Bar (Top) */}
                <div className="flex md:hidden items-center gap-4 mb-8">
                    <div className="flex-1 h-12 relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full h-full appearance-none bg-white dark:bg-slate-950 border border-secondary-200 dark:border-white/10 rounded-xl px-5 text-xs font-bold uppercase tracking-widest outline-none"
                        >
                            <option value="featured">Sort: Featured Collection</option>
                            <option value="price-low">Sort: Price Low to High</option>
                            <option value="price-high">Sort: Price High to Low</option>
                            <option value="rating">Sort: Top Rated</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar - Desktop Only */}
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
                                <h1 className="font-accent text-4xl font-bold text-slate-950 dark:text-white mb-2">Shop All <span className="italic font-light text-secondary-400">Products</span></h1>
                                <p className="text-sm text-slate-500 tracking-tight">Showing {paginatedProducts.length} of {filteredAndSortedProducts.length} items</p>
                            </div>
                            <div className="hidden md:flex items-center gap-6">
                                <div className="flex items-center space-x-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Layout</span>
                                    <div className="flex items-center bg-secondary-100 rounded-full p-1 dark:bg-white/5">
                                        <button
                                            onClick={() => setView('grid')}
                                            className={cn(
                                                "h-8 w-8 flex items-center justify-center rounded-full transition-all",
                                                view === 'grid' ? "bg-white shadow-premium text-slate-900 dark:bg-slate-800 dark:text-white" : "text-slate-400 hover:text-slate-600"
                                            )}
                                        >
                                            <Grid className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setView('list')}
                                            className={cn(
                                                "h-8 w-8 flex items-center justify-center rounded-full transition-all",
                                                view === 'list' ? "bg-white shadow-premium text-slate-900 dark:bg-slate-800 dark:text-white" : "text-slate-400 hover:text-slate-600"
                                            )}
                                        >
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

                        {paginatedProducts.length > 0 ? (
                            <div className={cn(
                                "grid gap-4 sm:gap-x-8 sm:gap-y-16",
                                view === 'grid'
                                    ? "grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3"
                                    : "grid-cols-1"
                            )}>
                                {paginatedProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-secondary-50 rounded-3xl dark:bg-white/5 border border-dashed border-secondary-200">
                                <p className="text-slate-500 font-medium">No items match your specific curation.</p>
                                <Button variant="link" onClick={() => handleFilterChange('clear', null)} className="mt-4 text-primary-600 font-bold uppercase tracking-widest text-xs">Reset All Filters</Button>
                            </div>
                        )}

                        {/* Functional Pagination - Responsive */}
                        {totalPages > 1 && (
                            <div className="mt-16">
                                {/* Desktop/Tablet Pagination */}
                                <div className="hidden sm:flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-primary-500 hover:text-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronDown className="h-4 w-4 rotate-90" />
                                    </button>

                                    <div className="flex items-center gap-2 overflow-x-auto max-w-full px-2 py-1 no-scrollbar">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={cn(
                                                    "h-10 w-10 shrink-0 flex items-center justify-center rounded-lg border transition-all font-bold",
                                                    currentPage === i + 1
                                                        ? "bg-primary-600 border-primary-600 text-white"
                                                        : "border-slate-200 text-slate-600 hover:border-primary-500 hover:text-primary-600"
                                                )}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-primary-500 hover:text-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronDown className="h-4 w-4 -rotate-90" />
                                    </button>
                                </div>

                                {/* Mobile "Load More" Style Pagination */}
                                <div className="flex sm:hidden flex-col items-center gap-4">
                                    {currentPage < totalPages ? (
                                        <Button
                                            size="lg"
                                            className="w-full rounded-xl bg-slate-900 text-white font-bold h-14 tracking-widest uppercase text-xs"
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        >
                                            Next Page
                                        </Button>
                                    ) : (
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">End of Collections</p>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs font-bold text-slate-500">Page {currentPage} of {totalPages}</span>
                                        {currentPage > 1 && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-lg h-8 text-[10px] font-black uppercase tracking-widest"
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            >
                                                Previous
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Mobile Filter Section (Bottom) */}
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
