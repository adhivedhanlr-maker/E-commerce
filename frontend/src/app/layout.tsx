import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import BottomNav from "@/components/common/BottomNav";
import PageTransition from "@/components/common/PageTransition";
import { ThemeProvider } from "@/components/common/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "NexusStore | Premium E-commerce Destination",
  description: "Experience the next generation of online shopping with NexusStore. High-quality products, fast delivery, and premium service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased selection:bg-primary-500/30 selection:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="light" themes={["light", "dark", "dim"]}>
          <Navbar />
          <main className="min-h-screen pt-16 pb-20 md:pb-0">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <BottomNav />
          <Footer />

          {/* Global SVG filter for Liquid Glass Distortion */}
          <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
            <filter id="liquid-glass-filter" primitiveUnits="objectBoundingBox">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="blur" />
              <feDisplacementMap in="blur" in2="SourceGraphic" scale="0.1" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>
        </ThemeProvider>
      </body>
    </html>
  );
}
