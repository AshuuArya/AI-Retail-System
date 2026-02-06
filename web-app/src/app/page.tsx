'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  Package,
  ArrowRight,
  Zap,
  Layers,
  ShieldCheck,
  ChevronRight,
  Terminal,
  Sparkles,
  Activity
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#030711] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Package size={22} />
          </div>
          <span className="text-xl font-bold premium-gradient-text tracking-tighter italic">OBSIDIAN</span>
        </div>
        <Link href="/login">
          <Button variant="ghost" className="text-slate-300 hover:text-white">
            Client Panel
          </Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="px-4 py-1.5 rounded-full glass-surface border-white/10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Project Obsidian v1.0 Live</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 max-w-4xl"
        >
          Neural <span className="italic premium-gradient-text">Inventory</span> <br />
          Management.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
        >
          Elevate your retail operations with a high-fidelity cinematic terminal.
          AI-powered synthesis, real-time telemetry, and obsidian-grade security.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link href="/register">
            <Button size="lg" className="h-16 px-10 text-lg glow-border group">
              Initialize System
              <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg" className="h-16 px-10 text-lg border-white/5">
              Resume Session
            </Button>
          </Link>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
          {[
            {
              title: 'Neural Synthesis',
              desc: 'Auto-generate verified asset profiles using Gemini AI clusters.',
              icon: Zap,
              color: 'blue'
            },
            {
              title: 'Tactical Analytics',
              desc: 'Monitor high-velocity sales streams with real-time telemetry.',
              icon: Activity,
              color: 'purple'
            },
            {
              title: 'Obsidian Shield',
              desc: 'Military-grade encryption for customer relations and ledgers.',
              icon: ShieldCheck,
              color: 'emerald'
            }
          ].map((feature, i) => (
            <Card key={i} delay={0.4 + (i * 0.1)} className="group border-white/5 !p-8">
              <div className="mb-6 w-14 h-14 rounded-2xl glass-surface flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <feature.icon size={28} className={`text-${feature.color}-400`} />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </Card>
          ))}
        </div>

        {/* Footer / Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-40 pt-12 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-blue-500" />
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">System Status: Operational</span>
          </div>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
            © 2026 AI Retail Systems Corp // Obsidian Protocol
          </p>
        </motion.div>
      </main>
    </div>
  );
}
