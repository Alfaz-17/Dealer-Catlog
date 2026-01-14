"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Box, ShieldCheck, Sparkles, Zap } from "lucide-react";

export default function HomePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background text-foreground">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop" 
          alt="Luxury Car"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-background z-10" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-4 pt-32 pb-20">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={stagger}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-blue-400 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>The Future of Digital Dealerships</span>
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-bold tracking-tighter text-white text-glow"
          >
            AUTOCARD<span className="text-blue-500">.</span>
          </motion.h1>

          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed"
          >
            The world's most sophisticated platform for elite automotive showrooms. 
            Elevate your inventory to a digital art gallery.
          </motion.p>

          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
          >
            <Link href="/register">
              <Button size="lg" className="h-16 px-10 text-lg font-bold rounded-2xl bg-white text-black hover:bg-slate-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                Launch Showroom <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-medium rounded-2xl glass border-white/20 text-white hover:bg-white/10 transition-all">
                Dealer Login
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40"
        >
          <div className="p-8 rounded-3xl glass border-white/5 space-y-4 group hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Instant Deployment</h3>
            <p className="text-slate-400 leading-relaxed">Your professional storefront live in under 60 seconds with advanced SEO optimization.</p>
          </div>

          <div className="p-8 rounded-3xl glass border-white/5 space-y-4 group hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Luxury Presentation</h3>
            <p className="text-slate-400 leading-relaxed">Ultra-high fidelity display for your premium inventory with built-in compression.</p>
          </div>

          <div className="p-8 rounded-3xl glass border-white/5 space-y-4 group hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <Box className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Advanced Inventory</h3>
            <p className="text-slate-400 leading-relaxed">Sophisticated management system designed for the fast-paced automotive market.</p>
          </div>
        </motion.div>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-slate-800/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
