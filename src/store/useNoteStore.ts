import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Note {
  id: string;
  content: string;
  createdAt: number;
  comments: Comment[];
  category?: string;
}

export interface Comment {
    id: string;
    content: string;
    createdAt: number;
}

interface NoteState {
  notes: Note[];
  addNote: (content: string, category?: string) => void;
  deleteNote: (id: string) => void;
  addComment: (noteId: string, content: string) => void;
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (content, category) => set((state) => ({
        notes: [
          {
            id: crypto.randomUUID(),
            content,
            createdAt: Date.now(),
            comments: [],
            category
          },
          ...state.notes,
        ],
      })),
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter((n) => n.id !== id),
      })),
      addComment: (noteId, content) => set((state) => ({
          notes: state.notes.map(n => 
            n.id === noteId 
            ? { ...n, comments: [...n.comments, { id: crypto.randomUUID(), content, createdAt: Date.now() }] }
            : n
          )
      }))
    }),
    {
      name: 'flowsync-note-storage',
    }
  )
);
