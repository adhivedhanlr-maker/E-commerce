'use client';

import React, { useState, useMemo } from 'react';
import FilterSidebar from '@/components/shop/FilterSidebar';
import ProductCard from '@/components/product/ProductCard';
import { Grid, List, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        images: ["https://images.unsplash.com/photo-1507473885765-e6ed657f9971?auto=format&fit=crop&q=80&w=800"],
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
        images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800"],
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
        images: ["https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800"],
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
        images: ["https://images.unsplash.com/photo-1508685096489-7as68962d382?auto=format&fit=crop&q=80&w=800"],
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
        images: ["https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=800"],
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
        images: ["https://images.unsplash.com/photo-1511499767010-a588b5b2f191?auto=format&fit=crop&q=80&w=800"],
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

    const filteredProducts = useMemo(() => {
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

    const handleFilterChange = (type: string, value: any) => {
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
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar */}
                    <FilterSidebar
                        selectedCategories={selectedCategories}
                        priceRange={priceRange}
                        minRating={minRating}
                        onFilterChange={handleFilterChange}
                    />

                    {/* Product Feed */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 border-b border-secondary-200/50 pb-8">
                            <div>
                                <h1 className="font-accent text-4xl font-bold text-slate-950 dark:text-white mb-2">Shop All <span className="italic font-light text-secondary-400">Products</span></h1>
                                <p className="text-sm text-slate-500 tracking-tight">Showing {filteredProducts.length} of {products.length} items</p>
                            </div>
                            <div className="flex items-center gap-6">
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
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-3 w-3 text-secondary-400 pointer-events-none transition-transform group-hover:rotate-180" />
                                </div>
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <div className={cn(
                                "grid gap-x-8 gap-y-16",
                                view === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                            )}>
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center bg-secondary-50 rounded-3xl dark:bg-white/5 border border-dashed border-secondary-200">
                                <p className="text-slate-500 font-medium">No items match your specific curation.</p>
                                <Button variant="link" onClick={() => handleFilterChange('clear', null)} className="mt-4 text-primary-600 font-bold uppercase tracking-widest text-xs">Reset All Filters</Button>
                            </div>
                        )}

                        {/* Pagination Mock */}
                        <div className="mt-16 flex items-center justify-center gap-2">
                            <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-primary-500 hover:text-primary-600 transition-all">{"<"}</button>
                            <button className="h-10 w-10 flex items-center justify-center rounded-lg border bg-primary-600 border-primary-600 text-white font-bold">1</button>
                            <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-primary-500 hover:text-primary-600 transition-all">2</button>
                            <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-primary-500 hover:text-primary-600 transition-all">3</button>
                            <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-primary-500 hover:text-primary-600 transition-all">{">"}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
