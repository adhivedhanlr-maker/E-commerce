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

          {/* Global SVG filters for Liquid Glass and Frosted Effects */}
          <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
            <filter id="liquid-glass-filter" primitiveUnits="objectBoundingBox">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="blur" />
              <feDisplacementMap in="blur" in2="SourceGraphic" scale="0.1" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="frosted" primitiveUnits="objectBoundingBox">
              <feImage href="data:image/png;base64,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" x="0" y="0" width="1" height="1" result="map" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="blur" />
              <feDisplacementMap id="disp" in="blur" in2="map" scale="1" xChannelSelector="R" yChannelSelector="G">
                <animate attributeName="scale" to="1.4" dur="0.3s" begin="btn.mouseover" fill="freeze" />
                <animate attributeName="scale" to="1" dur="0.3s" begin="btn.mouseout" fill="freeze" />
              </feDisplacementMap>
            </filter>
          </svg>
        </ThemeProvider>
      </body>
    </html>
  );
}
