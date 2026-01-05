import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: number;
}

interface TaskState {
  tasks: Task[];
  addTask: (title: string) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [
        { id: '1', title: 'Start your first Focus Session', isCompleted: false, createdAt: Date.now() }
      ],
      addTask: (title) => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            id: crypto.randomUUID(),
            title,
            isCompleted: false,
            createdAt: Date.now(),
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
    }),
    {
      name: 'flowsync-task-storage',
    }
  )
);
