"use client";

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/useAuth';
import { useTaskStore } from '@/store/useTaskStore';
import { useFocusStore } from '@/store/useFocusStore';
import { useNoteStore } from '@/store/useNoteStore';
import { useActivityStore } from '@/store/useActivityStore';
import { useScheduleStore, DayOfWeek, BlockType } from '@/store/useScheduleStore'; // Import new store
import { LogOut, Trash2, Globe, Database, CalendarClock, Plus, X, Download, Upload } from 'lucide-react';
import { useState, useRef } from 'react';

export default function SettingsPage() {
  const { i18n } = useTranslation();
  const { signOut, user } = useAuth();
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Schedule Logic
  const { blocks, addBlock, removeBlock } = useScheduleStore();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [newBlock, setNewBlock] = useState({ start: '09:00', end: '10:00', label: 'Work', type: 'work' as BlockType });

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAddBlock = () => {
      addBlock({
          day: selectedDay,
          startTime: newBlock.start,
          endTime: newBlock.end,
          label: newBlock.label,
          type: newBlock.type
      });
  };

  // Clear functions
  const clearTasks = () => useTaskStore.persist.clearStorage();
  const clearFocus = () => useFocusStore.persist.clearStorage();
  const clearAuth = () => useAuth.persist.clearStorage();
  const clearNotes = () => useNoteStore.persist.clearStorage();
  const clearActivity = () => useActivityStore.persist.clearStorage();

  const handleResetData = () => {
    if (confirm('Are you sure? This will wipe ALL tasks and settings locally.')) {
      clearTasks();
      clearFocus();
      clearAuth();
      clearNotes();
      clearActivity();
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = {
        tasks: localStorage.getItem('flowsync-task-storage'),
        focus: localStorage.getItem('flowsync-focus-storage'),
        notes: localStorage.getItem('flowsync-note-storage'),
        activity: localStorage.getItem('flowsync-activity-storage'),
        schedule: localStorage.getItem('flowsync-schedule-storage'), // Export Schedule
        version: '1.1',
        exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flowsync-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
          try {
              const text = e.target?.result as string;
              const data = JSON.parse(text);

              if (data.tasks) localStorage.setItem('flowsync-task-storage', data.tasks);
              if (data.focus) localStorage.setItem('flowsync-focus-storage', data.focus);
              if (data.notes) localStorage.setItem('flowsync-note-storage', data.notes);
              if (data.activity) localStorage.setItem('flowsync-activity-storage', data.activity);
              if (data.schedule) localStorage.setItem('flowsync-schedule-storage', data.schedule);

              setImportStatus('Data imported successfully! Reloading...');
              setTimeout(() => window.location.reload(), 1500);
          } catch (error) {
              setImportStatus('Error importing file. Invalid format.');
              console.error(error);
          }
      };
      reader.readAsText(file);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-space font-bold mb-2">Settings</h1>
        <p className="text-white/60">Customize your FlowSync experience.</p>
      </div>

      {/* Language Section */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6 text-mint">
            <Globe className="w-5 h-5" />
            <h2 className="font-bold">Language</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={() => changeLanguage('en')}
                className={`p-4 rounded-xl border transition-all ${i18n.language === 'en' ? 'bg-mint text-charcoal border-mint font-bold' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
                English
            </button>
            <button 
                onClick={() => changeLanguage('tr')}
                className={`p-4 rounded-xl border transition-all ${i18n.language === 'tr' ? 'bg-mint text-charcoal border-mint font-bold' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
            >
                Türkçe
            </button>
        </div>
      </div>

      {/* Weekly Schedule Section - NEW */}
      <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-6 text-purple-400">
             <CalendarClock className="w-5 h-5" />
             <h2 className="font-bold">Weekly Routine & Time Blocks</h2>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
              {days.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${selectedDay === day ? 'bg-purple-500 text-white font-bold' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                  >
                      {day.slice(0, 3)}
                  </button>
              ))}
          </div>

          <div className="space-y-4">
              <div className="flex gap-2 items-end bg-white/5 p-4 rounded-xl">
                  <div className="flex-1 space-y-1">
                      <label className="text-xs text-white/40">Start</label>
                      <input type="time" value={newBlock.start} onChange={e => setNewBlock({...newBlock, start: e.target.value})} className="w-full bg-black/20 rounded p-2 text-sm text-white focus:outline-none" />
                  </div>
                  <div className="flex-1 space-y-1">
                      <label className="text-xs text-white/40">End</label>
                      <input type="time" value={newBlock.end} onChange={e => setNewBlock({...newBlock, end: e.target.value})} className="w-full bg-black/20 rounded p-2 text-sm text-white focus:outline-none" />
                  </div>
                  <div className="flex-[2] space-y-1">
                      <label className="text-xs text-white/40">Label</label>
                      <input type="text" value={newBlock.label} onChange={e => setNewBlock({...newBlock, label: e.target.value})} className="w-full bg-black/20 rounded p-2 text-sm text-white focus:outline-none" placeholder="Deep Work" />
                  </div>
                   <div className="flex-1 space-y-1">
                      <label className="text-xs text-white/40">Type</label>
                      <select value={newBlock.type} onChange={e => setNewBlock({...newBlock, type: e.target.value as BlockType})} className="w-full bg-black/20 rounded p-2 text-sm text-white focus:outline-none">
                          <option value="work">Work</option>
                          <option value="hobby">Hobby</option>
                          <option value="rest">Rest</option>
                          <option value="other">Other</option>
                      </select>
                  </div>
                  <button onClick={handleAddBlock} className="p-2 bg-purple-500 rounded text-white hover:bg-purple-400">
                      <Plus className="w-5 h-5" />
                  </button>
              </div>

               <div className="space-y-2">
                  {blocks.filter(b => b.day === selectedDay).sort((a,b) => a.startTime.localeCompare(b.startTime)).map(block => (
                      <div key={block.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg group">
                          <div className="flex items-center gap-4">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${block.type === 'work' ? 'bg-blue-500/20 text-blue-400' : block.type === 'hobby' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                  {block.type}
                              </span>
                              <span className="font-mono text-sm text-white/80">{block.startTime} - {block.endTime}</span>
                              <span className="font-medium text-white">{block.label}</span>
                          </div>
                          <button onClick={() => removeBlock(block.id)} className="text-white/20 hover:text-red-400 transition-colors">
                              <X className="w-4 h-4" />
                          </button>
                      </div>
                  ))}
                  {blocks.filter(b => b.day === selectedDay).length === 0 && (
                      <p className="text-center text-sm text-white/30 py-4">No blocks scheduled for {selectedDay}.</p>
                  )}
               </div>
          </div>
      </div>

      {/* Data Management Section */}
      <div className="glass-card p-6">
         <div className="flex items-center gap-3 mb-6 text-blue-400">
            <Database className="w-5 h-5" />
            <h2 className="font-bold">Data & Backup</h2>
        </div>
        
        <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                 <button 
                    onClick={handleExportData}
                    className="flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                 >
                     <Download className="w-5 h-5" />
                     <span>Export Backup</span>
                 </button>
                 
                 <button 
                    onClick={handleImportClick}
                    className="flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                 >
                     <Upload className="w-5 h-5" />
                     <span>Import Backup</span>
                 </button>
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImportFile} 
                    accept=".json" 
                    className="hidden" 
                 />
             </div>
             {importStatus && <p className="text-center text-sm font-bold text-mint">{importStatus}</p>}

             <div className="pt-6 border-t border-white/5">
                <button
                    onClick={handleResetData}
                    className="w-full p-4 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                    <Trash2 className="w-5 h-5" />
                    <span>Decrease Danger: Clear All Local Data</span>
                </button>
             </div>
        </div>
      </div>

      {/* Account Section */}
      <div className="glass-card p-6 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-mint to-blue-500 flex items-center justify-center text-charcoal font-bold text-lg">
                {user?.email?.[0].toUpperCase()}
            </div>
            <div>
                <p className="font-bold text-white">{user?.email}</p>
                <p className="text-xs text-white/40">Synced via Local Storage</p>
            </div>
         </div>
         
         <button
            onClick={() => signOut()}
            className="px-4 py-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
         >
            <LogOut className="w-5 h-5" />
         </button>
      </div>
    </div>
  );
}
