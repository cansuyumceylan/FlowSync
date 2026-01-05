"use client";

import { useState } from 'react';
import { useNoteStore } from '@/store/useNoteStore';
import { format } from 'date-fns';
import { Plus, Trash2, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotesPage() {
  const { notes, addNote, deleteNote, addComment } = useNoteStore();
  const [newNote, setNewNote] = useState('');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addNote(newNote);
    setNewNote('');
  };

  const handleAddComment = (e: React.FormEvent, noteId: string) => {
      e.preventDefault();
      if(!newComment.trim()) return;
      addComment(noteId, newComment);
      setNewComment('');
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-space font-bold mb-2">My Notes</h1>
        <p className="text-white/60">Capture your thoughts, quick ideas, and reminders.</p>
      </div>

      {/* Add Note Input */}
      <form onSubmit={handleAddNote} className="mb-8 relative">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Type a new note..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-16 text-white placeholder:text-white/20 focus:outline-none focus:border-mint/50 focus:bg-white/10 transition-all font-medium"
        />
        <button
          type="submit"
          disabled={!newNote.trim()}
          className="absolute right-3 top-3 p-2 bg-mint text-charcoal rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
        <AnimatePresence mode="popLayout">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-lg text-white/90 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
                    <span>{format(note.createdAt, 'MMM d, yyyy • HH:mm')}</span>
                    <button 
                        onClick={() => setActiveNoteId(activeNoteId === note.id ? null : note.id)}
                        className="flex items-center gap-1 hover:text-mint transition-colors"
                    >
                        <MessageSquare className="w-3 h-3" />
                         {note.comments.length} Comments
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

               {/* Comments Section */}
               <AnimatePresence>
                   {activeNoteId === note.id && (
                       <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-4 pt-4 border-t border-white/5"
                       >
                           <div className="space-y-3 mb-4 pl-4 border-l border-white/10">
                               {note.comments.map(comment => (
                                   <div key={comment.id} className="text-sm">
                                       <p className="text-white/80">{comment.content}</p>
                                       <span className="text-xs text-white/30">{format(comment.createdAt, 'HH:mm')}</span>
                                   </div>
                               ))}
                               {note.comments.length === 0 && <span className="text-xs text-white/30 italic">No comments yet.</span>}
                           </div>
                           
                           <form onSubmit={(e) => handleAddComment(e, note.id)} className="flex gap-2">
                               <input 
                                    type="text" 
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..." 
                                    className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-mint/30 border border-transparent"
                                />
                                <button type="submit" disabled={!newComment.trim()} className="p-2 text-mint hover:bg-white/5 rounded-lg disabled:opacity-50">
                                    <Send className="w-4 h-4" />
                                </button>
                           </form>
                       </motion.div>
                   )}
               </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {notes.length === 0 && (
          <div className="text-center py-20 opacity-30">
            <p>No notes yet. Start typing above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
