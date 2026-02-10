import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutGroup {
  label: string;
  shortcuts: { keys: string; description: string }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    label: 'General',
    shortcuts: [
      { keys: '⌘ K', description: 'Command Palette' },
      { keys: '⌘ S', description: 'Save document' },
      { keys: '⌘ N', description: 'New prompt' },
      { keys: '⌘ E', description: 'Export as Markdown' },
      { keys: '⌘ D', description: 'Toggle dark/light mode' },
      { keys: '⌘ H', description: 'Show keyboard shortcuts' },
    ],
  },
  {
    label: 'Navigation',
    shortcuts: [
      { keys: '⌘ B', description: 'Toggle sidebar' },
      { keys: '⌘ O', description: 'Toggle document outline' },
    ],
  },
  {
    label: 'Text Formatting',
    shortcuts: [
      { keys: '⌘ B', description: 'Bold' },
      { keys: '⌘ I', description: 'Italic' },
      { keys: '⌘ ⇧ X', description: 'Strikethrough' },
    ],
  },
  {
    label: 'Editor',
    shortcuts: [
      { keys: '⌘ Z', description: 'Undo' },
      { keys: '⌘ ⇧ Z', description: 'Redo' },
      { keys: 'Tab', description: 'Indent' },
      { keys: '⇧ Tab', description: 'Outdent' },
      { keys: 'Enter', description: 'Auto-continue lists' },
    ],
  },
  {
    label: 'Tools',
    shortcuts: [
      { keys: '⌘ ⇧ F', description: 'Magic Format' },
      { keys: '⌘ ⇧ V', description: 'Smart Paste modal' },
    ],
  },
];

export const KeyboardShortcutsOverlay = ({ isOpen, onClose }: KeyboardShortcutsOverlayProps) => {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            className="relative z-10 w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden"
            style={{
              backgroundColor: 'var(--os-surface-elevated)',
              borderColor: 'var(--os-border)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: 'var(--os-border)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--os-hover)' }}
                >
                  <Keyboard size={16} style={{ color: 'var(--os-text-accent)' }} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-sm font-bold" style={{ color: 'var(--os-text)' }}>
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-[10px] font-mono uppercase tracking-[0.12em]" style={{ color: 'var(--os-text-secondary)' }}>
                    Shrimp Notes v6
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--os-text-secondary)' }}
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="max-h-[65vh] overflow-y-auto custom-scrollbar p-6">
              <div className="grid grid-cols-2 gap-6">
                {SHORTCUT_GROUPS.map((group) => (
                  <div key={group.label}>
                    <h3
                      className="text-[9px] font-bold uppercase tracking-[0.18em] mb-3 pb-1.5 border-b"
                      style={{
                        color: 'var(--os-text-accent)',
                        borderColor: 'var(--os-border)',
                      }}
                    >
                      {group.label}
                    </h3>
                    <div className="space-y-2">
                      {group.shortcuts.map((shortcut) => (
                        <div
                          key={shortcut.keys + shortcut.description}
                          className="flex items-center justify-between gap-3"
                        >
                          <span
                            className="text-[12px] truncate"
                            style={{ color: 'var(--os-text-secondary)' }}
                          >
                            {shortcut.description}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            {shortcut.keys.split(' ').map((key, ki) => (
                              <kbd
                                key={ki}
                                className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md border text-[10px] font-mono font-bold"
                                style={{
                                  backgroundColor: 'var(--os-surface)',
                                  borderColor: 'var(--os-border)',
                                  color: 'var(--os-text)',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                }}
                              >
                                {key}
                              </kbd>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-6 py-3 border-t flex items-center justify-between"
              style={{
                backgroundColor: 'var(--os-surface)',
                borderColor: 'var(--os-border)',
              }}
            >
              <span className="text-[9px] font-mono uppercase tracking-[0.12em]" style={{ color: 'var(--os-text-accent)' }}>
                Press Esc to close
              </span>
              <span className="text-[9px] font-mono" style={{ color: 'var(--os-text-accent)' }}>
                ⌘H to toggle
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
