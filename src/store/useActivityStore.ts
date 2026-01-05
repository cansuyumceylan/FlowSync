import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ActivityLog {
  id: string;
  taskId: string | null;
  taskTitle: string | null;
  mode: string;
  duration: number; // minutes
  completedAt: number;
  notes?: string;
}

interface ActivityState {
  logs: ActivityLog[];
  addLog: (log: Omit<ActivityLog, 'id' | 'completedAt'>) => void;
  clearLogs: () => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (log) => set((state) => ({
        logs: [
          {
            id: crypto.randomUUID(),
            completedAt: Date.now(),
            ...log
          },
          ...state.logs
        ]
      })),
      clearLogs: () => set({ logs: [] })
    }),
    {
      name: 'flowsync-activity-storage',
    }
  )
);
