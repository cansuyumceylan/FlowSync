"use client";

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/useAuth';
import { useTaskStore } from '@/store/useTaskStore';
import { useFocusStore } from '@/store/useFocusStore';
import { Globe, Trash2, LogOut, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { i18n } = useTranslation();
  const { signOut } = useAuth();
  
  // Direct access to stores to clear data if needed
  const clearTasks = () => useTaskStore.persist.clearStorage();
  const clearFocus = () => useFocusStore.persist.clearStorage();
  const clearAuth = () => useAuth.persist.clearStorage();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleResetData = () => {
    if (confirm("Are you sure? This will delete all your local tasks and settings.")) {
      clearTasks();
      clearFocus();
      clearAuth();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-space font-bold mb-8">Settings</h1>

      {/* Language Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-mint" />
          <h2 className="text-xl font-bold">Language / Dil</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => changeLanguage('en')}
            className={`p-4 rounded-xl border transition-all ${
              i18n.language === 'en' 
                ? 'bg-mint text-charcoal border-mint' 
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="block font-bold mb-1">English</span>
            <span className="text-xs opacity-70">Default</span>
          </button>
          <button
            onClick={() => changeLanguage('tr')}
            className={`p-4 rounded-xl border transition-all ${
              i18n.language === 'tr' 
                ? 'bg-mint text-charcoal border-mint' 
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="block font-bold mb-1">Türkçe</span>
            <span className="text-xs opacity-70">Çeviri</span>
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-card p-6 border-red-500/20">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-red-400" />
          <h2 className="text-xl font-bold text-red-400">Danger Zone</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-400/5 rounded-xl border border-red-400/10">
            <div>
              <h3 className="font-bold text-white/90">Reset Local Data</h3>
              <p className="text-sm text-white/50">Clear all tasks, settings, and login session from this browser.</p>
            </div>
            <button
              onClick={handleResetData}
              className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Reset Everything
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <div>
              <h3 className="font-bold text-white/90">Sign Out</h3>
              <p className="text-sm text-white/50">End your current session.</p>
            </div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
