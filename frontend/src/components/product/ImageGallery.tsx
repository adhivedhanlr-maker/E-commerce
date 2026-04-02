import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
    images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    // High quality fallback
    const displayImages = images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Main Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-[32px] bg-secondary-100 dark:bg-white/5 border border-secondary-200 dark:border-white/10 group shadow-premium">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: cubicBezier(0.16, 1, 0.3, 1) }}
                        className="h-full w-full cursor-zoom-in relative"
                        onClick={() => setIsZoomed(!isZoomed)}
                    >
                        <Image
                            src={displayImages[activeIndex]}
                            alt={`Product Shot ${activeIndex + 1}`}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Controls */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-md shadow-premium hover:bg-white transition-all text-slate-900"
                        onClick={() => setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))}
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-md shadow-premium hover:bg-white transition-all text-slate-900"
                        onClick={() => setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))}
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </div>

                <div className="absolute top-6 right-6 p-3 rounded-2xl bg-white/90 backdrop-blur-md text-slate-900 shadow-premium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ZoomIn className="h-5 w-5" />
                </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {displayImages.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${activeIndex === index
                                ? 'border-primary-600 scale-105 shadow-premium'
                                : 'border-transparent opacity-50 hover:opacity-100'
                            }`}
                    >
                        <Image src={img} alt="Thumbnail" fill className="object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
