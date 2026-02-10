import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  Save, 
  Wand2, 
  Sparkles,
  Download, 
  Layout, 
  FileText, 
  CornerDownLeft,
  Command,
  Moon,
  Sun,
  List,
  Keyboard
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  actions: {
    createNew: () => void;
    save: () => void;
    smartPaste: () => void;
    magicFormat?: () => void;
    exportMd: () => void;
    toggleSidebar: () => void;
    goToCaseStudy: () => void;
    toggleDarkMode?: () => void;
    toggleOutline?: () => void;
    showShortcuts?: () => void;
  };
  isDark?: boolean;
}

export const CommandPalette = ({ isOpen, onClose, actions, isDark = false }: CommandPaletteProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allCommands = [
    { id: 'new', label: 'New Prompt', description: 'Create a blank canvas', icon: Plus, action: actions.createNew, shortcut: '⌘N' },
    { id: 'save', label: 'Save Changes', description: 'Persist to storage', icon: Save, action: actions.save, shortcut: '⌘S' },
    { id: 'paste', label: 'Smart Paste', description: 'AI-powered formatting', icon: Sparkles, action: actions.smartPaste, shortcut: '⌘⇧V' },
    ...(actions.magicFormat ? [{ id: 'format', label: 'Magic Format', description: 'Auto-format entire document', icon: Wand2, action: actions.magicFormat, shortcut: '⌘⇧F' }] : []),
    { id: 'export', label: 'Export Markdown', description: 'Download as .md file', icon: Download, action: actions.exportMd, shortcut: '⌘E' },
    { id: 'sidebar', label: 'Toggle Sidebar', description: 'Show/hide file navigator', icon: Layout, action: actions.toggleSidebar, shortcut: '⌘B' },
    { id: 'study', label: 'View Case Study', description: 'Browse design showcase', icon: FileText, action: actions.goToCaseStudy, shortcut: '⌘C' },
    ...(actions.toggleDarkMode ? [{ id: 'darkmode', label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode', description: 'Toggle application theme', icon: isDark ? Sun : Moon, action: actions.toggleDarkMode, shortcut: '⌘D' }] : []),
    ...(actions.toggleOutline ? [{ id: 'outline', label: 'Toggle Document Outline', description: 'Show/hide heading navigator', icon: List, action: actions.toggleOutline, shortcut: '⌘O' }] : []),
    ...(actions.showShortcuts ? [{ id: 'shortcuts', label: 'Keyboard Shortcuts', description: 'View all keyboard shortcuts', icon: Keyboard, action: actions.showShortcuts, shortcut: '⌘H' }] : []),
  ];

  const filteredCommands = allCommands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[18vh] px-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(44,62,80,0.1)' }}
          />

          {/* Palette Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative z-10 border"
            style={{
              backgroundColor: 'var(--os-surface-elevated)',
              borderColor: 'var(--os-border)',
            }}
          >
            {/* Input Area */}
            <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--os-border)' }}>
              <Search size={16} className="shrink-0" style={{ color: 'var(--os-text-accent)' }} />
              <input 
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command..."
                className="flex-1 bg-transparent focus:outline-none text-[14px] font-sans"
                style={{ color: 'var(--os-text)', '--placeholder-color': 'var(--os-text-accent)' } as React.CSSProperties}
              />
              <kbd
                className="px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border select-none"
                style={{
                  backgroundColor: 'var(--os-surface)',
                  borderColor: 'var(--os-border)',
                  color: 'var(--os-text-secondary)',
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-1.5">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, index) => (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-150 group"
                    style={{
                      backgroundColor: index === selectedIndex ? 'var(--os-hover)' : 'transparent',
                    }}
                  >
                    <div
                      className="p-2 rounded-lg transition-all duration-150 shadow-sm"
                      style={{
                        backgroundColor: index === selectedIndex ? 'var(--os-navy)' : 'var(--os-surface)',
                        color: index === selectedIndex ? '#fff' : 'var(--os-text-secondary)',
                      }}
                    >
                       <cmd.icon size={14} strokeWidth={2} />
                    </div>
                    
                    <div className="flex flex-col items-start flex-1 min-w-0">
                      <span
                        className="text-[13px] font-semibold transition-colors"
                        style={{ color: index === selectedIndex ? 'var(--os-text)' : 'var(--os-text-secondary)' }}
                      >
                        {cmd.label}
                      </span>
                      <span className="text-[10px] truncate w-full text-left" style={{ color: 'var(--os-text-accent)' }}>
                        {cmd.description}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <kbd
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono transition-all"
                        style={{
                          backgroundColor: index === selectedIndex ? 'var(--os-surface-elevated)' : 'transparent',
                          color: index === selectedIndex ? 'var(--os-text)' : 'var(--os-text-accent)',
                          borderColor: index === selectedIndex ? 'var(--os-border)' : 'transparent',
                          borderWidth: index === selectedIndex ? '1px' : '0',
                        }}
                      >
                        {cmd.shortcut}
                      </kbd>
                      {index === selectedIndex && (
                        <motion.div
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <CornerDownLeft size={12} style={{ color: 'var(--os-text-accent)' }} />
                        </motion.div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-10 text-center">
                  <p className="text-[13px] font-medium" style={{ color: 'var(--os-text-accent)' }}>No commands found</p>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--os-text-accent)', opacity: 0.6 }}>Try a different search term</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="px-5 py-2.5 border-t flex justify-between items-center"
              style={{
                backgroundColor: 'var(--os-surface)',
                borderColor: 'var(--os-border)',
              }}
            >
              <span className="text-[9px] font-mono uppercase tracking-[0.12em]" style={{ color: 'var(--os-text-accent)' }}>
                {filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-3 text-[9px] font-mono" style={{ color: 'var(--os-text-accent)' }}>
                <span>↑↓ navigate</span>
                <span>↵ select</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
