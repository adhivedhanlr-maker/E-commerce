'use client';

import { motion, cubicBezier } from 'framer-motion';
import Hero from "@/components/home/Hero";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const featuredProducts = [
  {
    _id: "1",
    name: "Aura Pods Elite",
    price: 349.00,
    originalPrice: 429.00,
    discountPercentage: 20,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800"],
    brand: "Nexus Audio",
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
  },
  {
    _id: "10",
    name: "Equinox Chrono X",
    price: 890.00,
    originalPrice: 1100.00,
    discountPercentage: 19,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800"],
    brand: "Temporal",
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
  return (
    <div className="flex flex-col bg-background">
      <Hero />

      {/* Featured Products Section - Editorial Style */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
          >
            <div className="max-w-xl">
              <div className="flex items-center space-x-2 text-primary-600 mb-4">
                <Sparkles className="h-4 w-4" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">Season Favorites</span>
              </div>
              <h2 className="font-accent text-5xl md:text-6xl font-bold tracking-tight text-slate-950 dark:text-white">
                Featured <span className="italic font-light text-secondary-400">Drops</span>
              </h2>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Elevate your daily ritual with pieces that define modern craftsmanship.
                Our team has curated the season's most essential technology and lifestyle goods.
              </p>
            </div>
            <Link href="/shop" className="group flex items-center space-x-3 text-[12px] font-black uppercase tracking-widest text-slate-950 dark:text-white pb-2 border-b-2 border-primary-600 transition-all hover:border-slate-950">
              <span>View Full Catalog</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Staggered Grid */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-x-8 sm:gap-y-16"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product._id} variants={item}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Editorial Flash Sale / Promotion */}
      <section className="py-24 lg:py-32 bg-slate-950 relative overflow-hidden">
        {/* Abstract background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600/10 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <span className="text-primary-600 text-[10px] font-black uppercase tracking-[0.4em] mb-6 block">Limited Opportunity</span>
              <h2 className="font-accent text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8">
                The <span className="italic text-primary-600">Equinox</span> <br />
                Flash Event
              </h2>
              <p className="text-slate-400 text-lg mb-12 max-w-md">
                Our biannual curation of archival pieces and site-wide exclusives at exceptional values.
              </p>

              <div className="grid grid-cols-4 gap-4 mb-12">
                {[
                  { label: 'Days', value: '01' },
                  { label: 'Hours', value: '12' },
                  { label: 'Mins', value: '34' },
                  { label: 'Secs', value: '59' },
                ].map((t) => (
                  <div key={t.label} className="text-center">
                    <div className="text-4xl font-bold text-white mb-1">{t.value}</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">{t.label}</div>
                  </div>
                ))}
              </div>

              <Button asChild size="lg" className="rounded-full bg-white text-slate-950 hover:bg-slate-200 px-12 h-16 font-bold text-md">
                <Link href="/deals">Enter Event</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative"
            >
              <div className="aspect-square bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-center p-12 overflow-hidden shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary-600 to-transparent" />
                <div className="text-center">
                  <p className="font-accent text-white/10 text-9xl font-black italic select-none">NXS</p>
                  <p className="text-white font-bold tracking-widest uppercase text-sm -mt-12 backdrop-blur-sm">Archival Collection</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Editorial Footer Space (Newsletter Refined) */}
      <section className="py-24 lg:py-40 bg-background border-t border-slate-200 dark:border-white/5">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-accent text-4xl md:text-5xl font-bold text-slate-950 dark:text-white mb-6">Join the Journal</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-10">
              Insights on craft, early access to collections, and invitations to private events.
            </p>
            <form className="relative max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-secondary-100 dark:bg-white/5 border-none rounded-full h-16 px-8 text-md font-medium focus:ring-2 focus:ring-primary-600 transition-all placeholder:text-slate-400"
              />
              <button className="absolute right-2 top-2 h-12 px-6 rounded-full bg-slate-950 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
