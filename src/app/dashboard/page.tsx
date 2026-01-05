"use client";

import Timer from "@/components/Timer";
import AIAssistant from "@/components/AIAssistant";
import TaskList from "@/components/TaskList";
import SessionCompleteDialog from "@/components/SessionCompleteDialog";
import { useAuth } from "@/store/useAuth";
import { motion } from "framer-motion";

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="flex flex-col h-full gap-8">
            <SessionCompleteDialog />
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-space font-bold mb-1">
                        Welcome back, <span className="text-mint">{user?.email?.split('@')[0] || 'Guest'}</span>
                    </h1>
                    <p className="text-white/60">Let's get into the flow.</p>
                </div>
                <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                    System Status: Optimal
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Focus Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 glass-card min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden"
                >
                    {/* Background Gradient */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-mint/20 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-mint/20 to-transparent" />

                    <Timer />
                </motion.div>

                {/* Side Widgets */}
                <div className="space-y-6">
                    {/* AI Assistant */}
                    <AIAssistant />

                    {/* Task List */}
                    <TaskList />
                </div>
            </div>
        </div>
    );
}
