import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: number;
  scheduledDate: string | null; // ISO Date "YYYY-MM-DD"
  startTime: string | null; // "HH:mm"
  duration: number; // minutes
  priority: 'low' | 'medium' | 'high'; // NEW
  notes: string; // NEW
}

interface TaskState {
  tasks: Task[];
  addTask: (title: string, scheduledDate?: string | null) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  moveTask: (id: string, date: string | null, time?: string | null) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [
        { 
          id: '1', 
          title: 'Start your first Focus Session', 
          isCompleted: false, 
          createdAt: Date.now(),
          scheduledDate: new Date().toISOString().split('T')[0],
          startTime: '09:00',
          duration: 25,
          priority: 'medium',
          notes: 'Welcome to FlowSync! This is your first task.'
        }
      ],
      addTask: (title, scheduledDate = null) => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            id: crypto.randomUUID(),
            title,
            isCompleted: false,
            createdAt: Date.now(),
            scheduledDate,
            startTime: null,
            duration: 25,
            priority: 'medium',
            notes: ''
          },
        ],
      })),
      removeTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      })),
      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
        ),
      })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) => 
          t.id === id ? { ...t, ...updates } : t
        )
      })),
      moveTask: (id, date, time = null) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, scheduledDate: date, startTime: time } : t
        )
      })),
    }),
    {
      name: 'flowsync-task-storage',
    }
  )
);
