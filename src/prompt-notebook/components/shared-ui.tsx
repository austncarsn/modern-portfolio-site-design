import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import type { Theme } from '../utils/use-theme';

// ============================================================================
// Layout
// ============================================================================

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div
    className="min-h-screen font-mono overflow-hidden noise-texture scanline transition-colors duration-300"
    style={{
      backgroundColor: 'var(--os-surface)',
      backgroundImage:
        'radial-gradient(circle at 12% 16%, color-mix(in srgb, var(--os-sky) 14%, transparent) 0%, transparent 36%), radial-gradient(circle at 86% 84%, color-mix(in srgb, var(--os-highlight) 14%, transparent) 0%, transparent 38%)',
      color: 'var(--os-text)',
    }}
  >
    {children}
  </div>
);

// ============================================================================
// ThemeToggle
// ============================================================================

export const ThemeToggle = ({ theme, onToggle }: { theme: Theme; onToggle: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.92 }}
    onClick={onToggle}
    className="relative p-2 rounded-lg border border-[var(--os-border)] text-[var(--os-text-secondary)] hover:text-[var(--os-text)] hover:bg-[var(--os-hover)] transition-all duration-200"
    title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
  >
    <AnimatePresence mode="wait" initial={false}>
      {theme === 'light' ? (
        <motion.div key="sun" initial={{ rotate: -90, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: 90, scale: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
          <Moon size={14} strokeWidth={2} />
        </motion.div>
      ) : (
        <motion.div key="moon" initial={{ rotate: 90, scale: 0, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} exit={{ rotate: -90, scale: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
          <Sun size={14} strokeWidth={2} />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>
);

// ============================================================================
// AnimatedButton
// ============================================================================

interface AnimatedButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon';
  className?: string;
  icon?: React.ElementType;
  disabled?: boolean;
  title?: string;
  shortcut?: string;
}

export const AnimatedButton = ({
  children, onClick, variant = 'primary', className = '',
  icon: Icon, disabled = false, title, shortcut,
}: AnimatedButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center gap-2 transition-all duration-200 text-[11px] tracking-[0.06em] disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase rounded-lg";
  const variants: Record<string, string> = {
    primary: "px-4 py-2 shadow-sm hover:shadow hover:opacity-90",
    secondary: "px-4 py-2 border shadow-sm",
    danger: "px-4 py-2 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "px-3 py-1.5",
    icon: "p-2 rounded-lg",
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      style={{
        ...(variant === 'primary' ? { backgroundColor: 'var(--os-navy)', color: '#F7F7F2' } : {}),
        ...(variant === 'secondary' ? { backgroundColor: 'var(--os-surface-elevated)', borderColor: 'var(--os-border)', color: 'var(--os-text)' } : {}),
        ...(variant === 'ghost' ? { color: 'var(--os-text-secondary)' } : {}),
        ...(variant === 'icon' ? { color: 'var(--os-text-secondary)' } : {}),
      }}
      title={title}
    >
      {Icon && <Icon size={14} strokeWidth={2} />}
      {children}
      {shortcut && (
        <span className="hidden md:inline-block ml-1 text-[9px] opacity-40 font-mono tracking-normal normal-case">
          {shortcut}
        </span>
      )}
    </motion.button>
  );
};
