'use client';

import React from 'react';
import { Filter, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const categories = ['Electronics', 'Furniture', 'Apparel', 'Lifestyle'];

interface FilterSidebarProps {
    selectedCategories: string[];
    priceRange: [number, number];
    minRating: number;
    onFilterChange: (type: string, value: string | number | [number, number] | null) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
    selectedCategories,
    priceRange,
    minRating,
    onFilterChange
}) => {
    return (
        <aside className="w-full md:w-64 space-y-6 md:sticky md:top-24 self-start">
            <div className="flex items-center justify-between pb-4 border-b">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <Filter className="h-4 w-4 text-primary-600" />
                    Filters
                </h2>
                <Button
                    variant="link"
                    onClick={() => onFilterChange('clear', null)}
                    className="h-auto p-0 text-xs font-semibold text-primary-600 hover:text-primary-700"
                >
                    Clear All
                </Button>
            </div>

            <Accordion type="multiple" defaultValue={['categories', 'price', 'rating']} className="w-full">
                {/* Categories */}
                <AccordionItem value="categories" className="border-none">
                    <AccordionTrigger className="py-3 hover:no-underline">
                        <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Categories</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                        <div className="space-y-3">
                            {categories.map((category) => (
                                <div key={category} className="flex items-center space-x-3 group cursor-pointer">
                                    <Checkbox
                                        id={`cat-${category}`}
                                        checked={selectedCategories.includes(category)}
                                        onCheckedChange={() => onFilterChange('category', category)}
                                        className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                                    />
                                    <label
                                        htmlFor={`cat-${category}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 group-hover:text-primary-600 transition-colors dark:text-slate-400 cursor-pointer"
                                    >
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Price Range */}
                <AccordionItem value="price" className="border-none">
                    <AccordionTrigger className="py-3 hover:no-underline">
                        <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Price Range</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                        <div className="space-y-6 px-1">
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                                    <Input
                                        value={priceRange[0]}
                                        onChange={(e) => onFilterChange('price', [Number(e.target.value), priceRange[1]])}
                                        type="number"
                                        className="h-9 pl-5 border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-primary-500"
                                    />
                                </div>
                                <span className="text-slate-400 text-xs">-</span>
                                <div className="relative flex-1">
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                                    <Input
                                        value={priceRange[1]}
                                        onChange={(e) => onFilterChange('price', [priceRange[0], Number(e.target.value)])}
                                        type="number"
                                        className="h-9 pl-5 border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-primary-500"
                                    />
                                </div>
                            </div>
                            <Slider
                                value={[priceRange[0], priceRange[1]]}
                                min={0}
                                max={3000}
                                step={50}
                                onValueChange={(val) => onFilterChange('price', val as [number, number])}
                                className="py-4"
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Ratings */}
                <AccordionItem value="rating" className="border-none">
                    <AccordionTrigger className="py-3 hover:no-underline">
                        <span className="text-sm font-bold uppercase tracking-wider text-slate-500">Customer Rating</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                        <div className="space-y-3">
                            {[4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center space-x-3 group cursor-pointer" onClick={() => onFilterChange('rating', rating)}>
                                    <div className="flex items-center justify-center p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full">
                                        <div className="flex items-center flex-1 space-x-2">
                                            <div className="flex space-x-0.5 text-amber-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={cn("h-3 w-3 fill-current", i >= rating && "text-slate-200 dark:text-slate-800 fill-none")} />
                                                ))}
                                            </div>
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">& up</span>
                                        </div>
                                        <Checkbox
                                            id={`rating-${rating}`}
                                            checked={minRating === rating}
                                            onCheckedChange={() => onFilterChange('rating', rating)}
                                            className="data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="md:hidden pt-6 space-y-4">
                <Button
                    className="w-full h-12 text-sm font-bold uppercase tracking-widest bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-premium"
                    onClick={() => {
                        // In a real app, this might trigger a closing action, but here we'll just let the sheet close.
                        // The actual values are already synced via state.
                    }}
                >
                    Apply Filters
                </Button>
            </div>
        </aside>
    );
};

export default FilterSidebar;
