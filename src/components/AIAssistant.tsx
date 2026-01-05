"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useFocusStore, FocusMode } from "@/store/useFocusStore";
import { motion, AnimatePresence } from "framer-motion";

export default function AIAssistant() {
  const [task, setTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<{ mode: FocusMode; motivation: string } | null>(null);
  const setMode = useFocusStore((state) => state.setMode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    setIsLoading(true);
    setSuggestion(null);

    try {
      const res = await fetch("/api/gemini/recruit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      
      const data = await res.json();
      setSuggestion(data);
      
      // Auto-set the mode
      if (data.mode) {
        setMode(data.mode as FocusMode);
      }
    } catch (error) {
      console.error("Failed to get suggestion", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 bg-gradient-to-br from-white/5 to-mint/5 border-mint/10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-mint" />
        <h3 className="font-space font-bold text-lg">AI Assistant</h3>
      </div>

      <form onSubmit={handleSubmit} className="relative mb-4">
        <input
          type="text"
          placeholder="What are you working on?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-mint/50 transition-colors text-sm"
        />
        <button
          type="submit"
          disabled={isLoading || !task}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-mint text-charcoal hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </form>

      <AnimatePresence>
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-mint/10 border border-mint/20 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-mint">Recommended Mode</span>
              <span className="text-xs bg-mint text-charcoal px-2 py-0.5 rounded font-bold capitalize">
                {suggestion.mode.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
            <p className="text-sm text-white/80 italic">"{suggestion.motivation}"</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
