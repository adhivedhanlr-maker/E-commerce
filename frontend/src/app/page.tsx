'use client';

import { motion, cubicBezier } from 'framer-motion';
import Hero from "@/components/home/Hero";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
    _id: "2",
    name: "Titan Phone 15",
    price: 1199.00,
    originalPrice: 1299.00,
    discountPercentage: 8,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800"],
    brand: "Titan Tech",
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
    _id: "6",
    name: "Zenith Minimalist Desk",
    price: 850.00,
    originalPrice: 950.00,
    discountPercentage: 10,
    rating: 4.8,
    images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800"],
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
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"],
    brand: "Temporal",
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
  },
];

const categories = [
  { name: 'Electronics', count: '1,240+', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800', link: '/shop?cat=electronics' },
  { name: 'Fashion', count: '3,500+', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800', link: '/shop?cat=fashion' },
  { name: 'Home & Living', count: '850+', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800', link: '/shop?cat=home' },
  { name: 'Lifestyle', count: '420+', image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&q=80&w=800', link: '/shop' },
];

const newArrivals = [
  {
    _id: "13",
    name: "Zenith Keyboard",
    price: 159.99,
    originalPrice: 159.99,
    discountPercentage: 0,
    rating: 4.9,
    images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800"],
    brand: "KeyClick",
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
  },
];

const trendingProducts = [
  {
    _id: "7",
    name: "Lunar Orbital Lamp",
    price: 220.00,
    originalPrice: 280.00,
    discountPercentage: 21,
    rating: 4.6,
    images: ["https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800"],
    brand: "Lumina Design",
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
  return (
    <div className="flex flex-col bg-background gap-16 pt-12">
      {/* Top Featured Card - Equinox Flash Event */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative overflow-hidden rounded-[48px] bg-slate-950 px-8 py-20 lg:py-24 shadow-2xl border border-white/5">
          {/* Abstract background */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-600/10 blur-[100px]" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <span className="text-primary-600 text-[10px] font-black uppercase tracking-[0.4em] mb-6 block">Limited Opportunity</span>
              <h2 className="font-accent text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-8">
                The <span className="italic text-primary-600">Equinox</span> <br />
                Flash Event
              </h2>
              <p className="text-slate-500 text-lg mb-12 font-light max-w-md">The pinnacle of technical achievement and aesthetic purity. These aren&apos;t just tools; they are the artifacts of a life well-lived.</p>

              <div className="grid grid-cols-4 gap-4 mb-12 max-w-xs">
                {[
                  { label: 'Days', value: '01' },
                  { label: 'Hours', value: '12' },
                  { label: 'Mins', value: '34' },
                  { label: 'Secs', value: '59' },
                ].map((t) => (
                  <div key={t.label} className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{t.value}</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">{t.label}</div>
                  </div>
                ))}
              </div>

              <Button asChild size="lg" className="rounded-full bg-white text-slate-950 hover:bg-slate-200 px-12 h-16 font-bold text-md">
                <Link href="/deals">Enter Event</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square w-full max-w-[440px] ml-auto"
            >
              <div className="absolute inset-0 bg-white/5 rounded-[40px] border border-white/10 overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=1200"
                  alt="Equinox Archival Product"
                  fill
                  priority
                  className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary-600 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-center justify-center p-12">
                  <div className="text-center">
                    <p className="font-accent text-white/10 text-8xl lg:text-9xl font-black italic select-none">NXS</p>
                    <p className="text-white font-bold tracking-widest uppercase text-xs lg:text-sm -mt-8 lg:mt-[-3rem] backdrop-blur-sm">Archival Collection</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Hero />

      {/* Categories Grid - Visual Curation */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="font-accent text-3xl md:text-4xl font-bold tracking-tight text-slate-950 dark:text-white mb-4">
              Curated <span className="italic font-light text-secondary-400">Collections</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Explore our range of meticulously selected items across different archetypes of modern living.</p>
          </div>
          <div className="flex flex-nowrap lg:flex-wrap gap-6 overflow-x-auto pb-8 lg:pb-0 lg:overflow-visible no-scrollbar">
            {categories.map((category) => (
              <Link key={category.name} href={category.link} className="group relative min-w-[280px] lg:min-w-0 lg:flex-1 aspect-[4/5] overflow-hidden rounded-[32px] bg-slate-200 flex-shrink-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-2">{category.count} Items</p>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                Our team has curated the season&apos;s most essential technology and lifestyle goods.
              </p>
            </div>
            <Link href="/shop" className="group flex items-center space-x-3 text-[12px] font-black uppercase tracking-widest text-slate-950 dark:text-white pb-2 border-b-2 border-primary-600 transition-all hover:border-slate-950">
              <span>View Full Catalog</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

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

      {/* New Arrivals Section - Minimalist Grid */}
      <section className="py-24 lg:py-32 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
            <div>
              <span className="text-secondary-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Just In</span>
              <h2 className="font-accent text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
                New <span className="italic font-light text-primary-600">Arrivals</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
            <div>
              <span className="text-primary-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Crowd Favorites</span>
              <h2 className="font-accent text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
                Trending <span className="italic font-light text-secondary-400">Now</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {trendingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>


      {/* Journal / Blog Section */}
      <section className="py-24 lg:py-32 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 text-center md:text-left">
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
          <div className="space-y-12 max-w-5xl mx-auto">
            {journalPosts.map((post) => (
              <article key={post.title} className="group cursor-pointer flex flex-col md:flex-row gap-8 items-center bg-slate-50 dark:bg-white/5 p-8 rounded-[40px] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                <div className="relative w-full md:w-1/3 aspect-[16/10] overflow-hidden rounded-3xl bg-slate-100 font-primary flex-shrink-0">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary-600">{post.date}</p>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-950 dark:text-white group-hover:text-primary-600 transition-colors uppercase tracking-tight">{post.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed line-clamp-2">{post.excerpt}</p>
                </div>
              </article>
            ))}
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
    </div >
  );
}
