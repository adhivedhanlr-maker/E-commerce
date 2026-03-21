'use client';
import React, { useState } from 'react';
import { motion, cubicBezier, AnimatePresence } from 'framer-motion';
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Hero from "@/components/home/Hero";
import CategoryBar from "@/components/home/CategoryBar";

const featuredProducts = [
  {
    _id: "65d1f1e1f1e1f1e1f1e1f110",
    name: "Zen Watch Pro",
    price: 499.00,
    originalPrice: 549.00,
    discountPercentage: 9,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"],
    brand: "Temporal",
    isFeatured: true,
  },
  {
    _id: "65d1f1e1f1e1f1e1f1e1f1e1",
    name: "Aura Pods Elite",
    price: 349.00,
    originalPrice: 415.00,
    discountPercentage: 16,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"],
    brand: "Nexus Audio",
    isFeatured: true,
  },
  {
    _id: "65d1f1e1f1e1f1e1f1e1f113",
    name: "Zenith Keyboard",
    price: 159.99,
    originalPrice: 159.99,
    discountPercentage: 0,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800"],
    brand: "KeyClick",
    isFeatured: true,
  },
  {
    _id: "65d1f1e1f1e1f1e1f1e1f1e2",
    name: "Titan Phone 15",
    price: 1199.00,
    originalPrice: 1299.00,
    discountPercentage: 8,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800"],
    brand: "Titan Tech",
  },
];


const newArrivals = [
  {
    _id: "65d1f1e1f1e1f1e1f1e1f113",
    name: "Zenith Keyboard",
    price: 159.99,
    originalPrice: 159.99,
    discountPercentage: 0,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800"],
    brand: "KeyClick",
  },
  {
    _id: "65d1f1e1f1e1f1e1f1e1f115",
    name: "Velvet Cloud Sofa",
    price: 1800.00,
    originalPrice: 2200.00,
    discountPercentage: 18,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800"],
    brand: "Heritage Home",
  },
  {
    _id: "65d1f1e1f1e1f1e1f1e1f122",
    name: "Aerospace Aviators",
    price: 155.00,
    originalPrice: 195.00,
    discountPercentage: 20,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800"],
    brand: "Visionary",
  },
  {
    _id: "65d1f1e1f1e1f1e1f1e1f120",
    name: "Nomad Canvas Backpack",
    price: 185.00,
    originalPrice: 210.00,
    discountPercentage: 12,
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=800"],
    brand: "Metro Craft",
  },
];

const trendingProducts = [
  {
    _id: "65d1f1e1f1e1f1e1f1e1f1a7",
    name: "Lunar Orbital Lamp",
    price: 220.00,
    originalPrice: 280.00,
    discountPercentage: 21,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800"],
    brand: "Lumina Design",
  },
  {
    _id: "65d1f1e1f1e1f1e1f1e1f1a9",
    name: "Merino Precision Knit",
    price: 180.00,
    originalPrice: 180.00,
    discountPercentage: 0,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1614676471928-2ed0ad1061a4?auto=format&fit=crop&q=80&w=800"],
    brand: "Apex Outdoor",
  },
  {
    _id: "65d1f1e1f1e1f1e1f1e1f114",
    name: "SlimBook Ultra 14",
    price: 899.99,
    originalPrice: 999.99,
    discountPercentage: 10,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800"],
    brand: "SlimBook",
  },
  {
    _id: "65d1f1e1f1e1f1e1f1e1f116",
    name: "Onyx Coffee Table",
    price: 650.00,
    originalPrice: 750.00,
    discountPercentage: 13,
    rating: 4.7,
    images: ["https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800"],
    brand: "Heritage Home",
  },
];

const journalPosts = [
  {
    date: 'Oct 24, 2023',
    title: 'The Art of Minimalist Living',
    excerpt: 'How to curate your space for maximum productivity and peace of mind.',
    image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800',
  },
  {
    date: 'Nov 02, 2023',
    title: 'Future Tech: Nexus Audio',
    excerpt: 'A deep dive into the engineering behind our latest acoustic breakthroughs.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
  },
  {
    date: 'Nov 15, 2023',
    title: 'Sourcing Heritage Materials',
    excerpt: 'Our journey across the globe to find the worlds finest sustainable textiles.',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=800',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: cubicBezier(0.16, 1, 0.3, 1) } }
};

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('loading');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('success');
    setEmail('');
  };

  return (
    <div className="flex flex-col bg-background gap-0">
      <Hero />
      <CategoryBar />

      {/* Featured Products Section - Simple Grid */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8"
          >
            <div>
              <div className="flex items-center space-x-2 text-primary-600 mb-4">
                <Sparkles className="h-4 w-4" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">Season Favorites</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white uppercase">
                Featured Products
              </h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section - Minimalist Grid */}
      <section className="py-16 lg:py-20 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-8">
            <div>
              <span className="text-secondary-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Just In</span>
              <h2 className="font-accent text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
                New <span className="italic font-light text-primary-600">Arrivals</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-8">
            <div>
              <span className="text-primary-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Crowd Favorites</span>
              <h2 className="font-accent text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
                Trending <span className="italic font-light text-secondary-400">Now</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>


      {/* Journal / Blog Section */}
      <section className="py-16 lg:py-20 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8 text-center md:text-left">
            <div>
              <span className="text-secondary-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">The Journal</span>
              <h2 className="font-accent text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
                Read the <span className="italic font-light text-primary-600">Edit</span>
              </h2>
            </div>
            <Link href="/journal" className="text-[12px] font-black uppercase tracking-widest text-slate-950 dark:text-white pb-2 border-b-2 border-primary-600">
              View All Posts
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {journalPosts.map((post) => (
              <article key={post.title} className="group cursor-pointer">
                <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-slate-100 mb-6 font-primary">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary-600">{post.date}</p>
                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white group-hover:text-primary-600 transition-colors uppercase tracking-tight">{post.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Footer Space (Newsletter Refined) */}
      <section className="py-16 lg:py-24 bg-background border-t border-slate-200 dark:border-white/5">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-accent text-4xl md:text-5xl font-bold text-slate-950 dark:text-white mb-6">Never Miss a Volume</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
              Insights on craft, early access to collections, and invitations to private events.
            </p>
            <form onSubmit={handleSubscribe} className="relative max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading' || status === 'success'}
                className="w-full bg-secondary-100 dark:bg-white/5 border-none rounded-full h-16 px-8 text-md font-medium focus:ring-2 focus:ring-primary-600 transition-all placeholder:text-slate-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="absolute right-2 top-2 h-12 px-6 rounded-full bg-slate-950 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 disabled:bg-slate-400 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : status === 'success' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>

            <AnimatePresence>
              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 text-green-600 font-bold text-sm"
                >
                  Welcome to the Journal. Check your inbox soon.
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 text-red-500 font-bold text-sm flex items-center justify-center gap-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  Please enter a valid email address.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div >
  );
}
