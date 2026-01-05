"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Github, LogIn } from 'lucide-react';

export default function AuthUI() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setMessage(error.message);
    else setMessage('Check your email for the login link!');
    setLoading(false);
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({ provider });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 w-full max-w-md mx-auto"
    >
      <h2 className="text-3xl font-space mb-6 text-center">FlowSync'e Katıl</h2>
      
      <div className="space-y-4">
        <button 
          onClick={() => handleOAuthLogin('google')}
          className="w-full flex items-center justify-center gap-3 bg-white text-charcoal h-12 rounded-xl font-bold hover:bg-white/90 transition-all"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Google ile Devam Et
        </button>

        <button 
          onClick={() => handleOAuthLogin('github')}
          className="w-full flex items-center justify-center gap-3 bg-[#24292e] text-white h-12 rounded-xl font-bold hover:bg-[#24292e]/90 transition-all"
        >
          <Github className="w-5 h-5" />
          GitHub ile Devam Et
        </button>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-charcoal px-2 text-white/40">Veya E-posta</span>
          </div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input 
              type="email"
              placeholder="e-posta@adresiniz.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 h-12 pl-12 pr-4 rounded-xl focus:outline-none focus:border-mint transition-colors"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="btn-primary w-full h-12 flex items-center justify-center gap-2"
          >
            {loading ? 'Yükleniyor...' : 'E-posta ile Giriş'} <LogIn className="w-5 h-5" />
          </button>
        </form>

        {message && (
          <p className="text-center text-sm mt-4 text-mint">{message}</p>
        )}
      </div>
    </motion.div>
  );
}
