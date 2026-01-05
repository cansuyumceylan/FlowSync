"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, Zap, Brain, Shield, Clock, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import AuthUI from "@/components/AuthUI";

export default function Home() {
  const { t } = useTranslation();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-mint/10 blur-[100px]" />
      <div className="absolute top-1/2 -right-40 h-80 w-80 rounded-full bg-mint/5 blur-[100px]" />

      <main className="container mx-auto px-6 pt-24 pb-32">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-24">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-mint rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-charcoal" />
            </div>
            <span className="text-2xl font-space font-bold">FlowSync</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#" className="hover:text-mint transition-colors">Features</a>
            <a href="#" className="hover:text-mint transition-colors">Presets</a>
            <a href="#" className="hover:text-mint transition-colors">Pricing</a>
          </div>
          <button onClick={() => setShowAuth(true)} className="btn-primary flex items-center gap-2">
            {t('hero.cta')} <ArrowRight className="h-4 w-4" />
          </button>
        </nav>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-mint/10 text-mint text-xs font-bold uppercase tracking-wider mb-6 border border-mint/20">
              AI-Powered Deep Focus
            </span>
            <h1 className="text-5xl md:text-7xl mb-8 leading-[1.1]">
              <span dangerouslySetInnerHTML={{ __html: t('hero.title').replace('Flow State', '<span class="text-mint">Flow State</span>') }} />
            </h1>
            <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => setShowAuth(true)} className="btn-primary w-full sm:w-auto h-14 px-10 text-lg flex items-center justify-center gap-2">
                {t('hero.cta')} <ArrowRight className="h-5 w-5" />
              </button>
              <button className="btn-ghost w-full sm:w-auto h-14 px-10 text-lg border border-white/10">
                {t('hero.demo')}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Auth Modal Overlay */}
        <AnimatePresence>
          {showAuth && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-charcoal/80 backdrop-blur-sm"
            >
              <div className="relative w-full max-w-md">
                <button 
                  onClick={() => setShowAuth(false)}
                  className="absolute -top-12 right-0 text-white/60 hover:text-white"
                >
                  <X className="w-8 h-8" />
                </button>
                <AuthUI />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Calendar className="h-6 w-6 text-mint" />}
            title={t('features.calendar')}
            description="Two-way sync with Google & Outlook. Your focus sessions are perfectly aligned with your availability."
          />
          <FeatureCard
            icon={<Brain className="h-6 w-6 text-mint" />}
            title={t('features.ai')}
            description="Gemini-powered insights suggest the perfect Pomodoro mode based on your task complexity."
          />
          <FeatureCard
            icon={<Shield className="h-6 w-6 text-mint" />}
            title={t('features.rescheduling')}
            description="Interrupted? FlowSync automatically finds the next best slot for your deep work session."
          />
        </div>

        {/* Presets Preview */}
        <div className="mt-32">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl mb-4 text-center md:text-left">Engineered Presets</h2>
              <p className="text-white/60 text-center md:text-left">
                Choose from scientifically-backed rhythms or create your own custom focus cycles.
              </p>
            </div>
            <button className="btn-ghost flex items-center gap-2">
              Explore All Presets <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <PresetCard title="The Spark" duration="25/5" label="Quick Tasks" emoji="⚡" />
            <PresetCard title="Deep Dive" duration="50/10" label="Hard Work" emoji="🌊" />
            <PresetCard title="Peak Flow" duration="90/20" label="Maximum Focus" emoji="🚀" active />
            <PresetCard title="Custom" duration="--/--" label="You Decide" emoji="⚙️" />
          </div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-card p-8 group hover:bg-white/10 transition-all duration-300">
      <div className="h-12 w-12 rounded-xl bg-mint/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl mb-4">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function PresetCard({ title, duration, label, emoji, active = false }: { title: string, duration: string, label: string, emoji: string, active?: boolean }) {
  return (
    <div className={`glass-card p-6 flex flex-col justify-between aspect-square transition-all duration-300 ${active ? 'ring-2 ring-mint bg-mint/5' : 'hover:scale-[1.02]'}`}>
      <div className="flex justify-between items-start">
        <span className="text-3xl">{emoji}</span>
        {active && <span className="bg-mint text-charcoal text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Active</span>}
      </div>
      <div>
        <p className="text-mint font-bold text-sm mb-1">{duration}</p>
        <h4 className="text-lg leading-tight mb-1">{title}</h4>
        <p className="text-white/40 text-xs">{label}</p>
      </div>
    </div>
  );
}
