import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, FileText, X, Trash2, Palette } from 'lucide-react';

// ============================================================================
// Constants
// ============================================================================

const COLOR_PRESETS = [
  { id: 'red',    label: 'Red',    value: '#ef4444' },
  { id: 'orange', label: 'Orange', value: '#f97316' },
  { id: 'amber',  label: 'Amber',  value: '#f59e0b' },
  { id: 'green',  label: 'Green',  value: '#22c55e' },
  { id: 'teal',   label: 'Teal',   value: '#14b8a6' },
  { id: 'blue',   label: 'Blue',   value: '#3b82f6' },
  { id: 'purple', label: 'Purple', value: '#a855f7' },
  { id: 'pink',   label: 'Pink',   value: '#ec4899' },
];

// ============================================================================
// Types
// ============================================================================

interface FileSystemProps {
  files: Array<{
    id: string;
    title: string;
    tags: string[];
    color?: string;
    updatedAt: number;
  }>;
  selectedFileId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete?: (id: string) => void;
  onColorChange?: (id: string, color: string | undefined) => void;
}

interface FileRowProps {
  file: {
    id: string;
    title: string;
    tags: string[];
    color?: string;
    updatedAt: number;
  };
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: (id: string) => void;
  onColorChange?: (id: string, color: string | undefined) => void;
  openPickerId: string | null;
  onOpenPicker: (id: string | null) => void;
}

// ============================================================================
// Color Picker Popover
// ============================================================================

const ColorPicker = ({
  fileId,
  currentColor,
  anchorRect,
  containerRect,
  onColorChange,
  onClose,
}: {
  fileId: string;
  currentColor?: string;
  anchorRect: DOMRect | null;
  containerRect: DOMRect | null;
  onColorChange: (id: string, color: string | undefined) => void;
  onClose: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    // Use a short delay so the opening click/tap doesn't immediately close
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Determine if the popover should open upward (when near the bottom of the scroll container)
  const openUpward = (() => {
    if (!anchorRect || !containerRect) return false;
    const spaceBelow = containerRect.bottom - anchorRect.bottom;
    return spaceBelow < 160;
  })();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.92, y: openUpward ? 4 : -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: openUpward ? 4 : -4 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
      className="absolute z-50 rounded-lg border p-2.5 shadow-xl"
      style={{
        backgroundColor: 'var(--os-surface-elevated)',
        borderColor: 'var(--os-border)',
        right: 0,
        ...(openUpward
          ? { bottom: '100%', marginBottom: 4 }
          : { top: '100%', marginTop: 4 }),
        minWidth: 140,
      }}
      onClick={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-1.5 mb-2 px-0.5">
        <Palette size={10} style={{ color: 'var(--os-text-accent)' }} />
        <span
          className="text-[9px] font-bold uppercase tracking-[0.1em]"
          style={{ color: 'var(--os-text-accent)' }}
        >
          Label Color
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {COLOR_PRESETS.map((preset) => {
          const isActive = currentColor === preset.value;
          return (
            <button
              key={preset.id}
              onClick={() => {
                onColorChange(fileId, preset.value);
                onClose();
              }}
              className="rounded-md transition-all duration-150 active:scale-95 flex items-center justify-center"
              style={{
                width: 28,
                height: 28,
                minWidth: 28,
                minHeight: 28,
                backgroundColor: preset.value,
                boxShadow: isActive
                  ? '0 0 0 2px var(--os-surface-elevated), 0 0 0 4px ' + preset.value
                  : 'inset 0 0 0 1px rgba(0,0,0,0.08)',
              }}
              title={preset.label}
              aria-label={preset.label}
            >
              {isActive && (
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
      {/* Clear color option */}
      {currentColor && (
        <button
          onClick={() => {
            onColorChange(fileId, undefined);
            onClose();
          }}
          className="w-full mt-2 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-[0.08em] transition-colors active:opacity-70"
          style={{
            backgroundColor: 'var(--os-hover)',
            color: 'var(--os-text-accent)',
          }}
        >
          Clear Label
        </button>
      )}
    </motion.div>
  );
};

// ============================================================================
// FileRow Sub-component
// ============================================================================

const FileRow = ({
  file,
  isSelected,
  onSelect,
  onDelete,
  onColorChange,
  openPickerId,
  onOpenPicker,
}: FileRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const pickerAnchorRef = useRef<HTMLButtonElement>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  const showColorPicker = openPickerId === file.id;

  // Selected rows always show action buttons (works for both desktop and touch).
  // Non-selected rows reveal actions on hover via group-hover (desktop only).
  const actionsAlwaysVisible = isSelected;

  const handleTogglePicker = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (showColorPicker) {
      onOpenPicker(null);
    } else {
      // Capture anchor position for smart placement
      if (pickerAnchorRef.current) {
        setAnchorRect(pickerAnchorRef.current.getBoundingClientRect());
      }
      // Find the scrollable container for boundary check
      const scrollContainer = rowRef.current?.closest('.custom-scrollbar');
      if (scrollContainer) {
        setContainerRect(scrollContainer.getBoundingClientRect());
      }
      onOpenPicker(file.id);
    }
  }, [showColorPicker, file.id, onOpenPicker]);

  return (
    <div
      ref={rowRef}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
      className="relative w-full text-left px-4 py-3.5 group transition-all duration-200 flex items-start gap-3 rounded-lg cursor-pointer"
      style={{
        backgroundColor: isSelected ? 'var(--os-surface-elevated)' : 'transparent',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: isSelected ? 'var(--os-border)' : 'transparent',
        boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
      }}
    >
      {/* Selection accent — uses file color if set */}
      {isSelected && (
        <motion.div
          layoutId="sidebar-selection"
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
          style={{ backgroundColor: file.color || 'var(--os-navy)' }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}

      {/* Color indicator bar (non-selected, has color) */}
      {!isSelected && file.color && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full"
          style={{ backgroundColor: file.color }}
        />
      )}

      {/* File icon — tinted by color */}
      <div
        className="shrink-0 mt-0.5 p-1.5 rounded-md transition-colors"
        style={{
          backgroundColor: file.color
            ? file.color + '1a'
            : isSelected ? 'var(--os-navy)' : 'var(--os-hover)',
          color: file.color
            ? file.color
            : isSelected ? '#fff' : 'var(--os-text-accent)',
        }}
      >
        <FileText size={12} strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <span
          className="text-[12px] font-bold tracking-tight leading-tight truncate transition-colors pr-12"
          style={{ color: isSelected ? 'var(--os-text)' : 'var(--os-text-secondary)' }}
        >
          {file.title || 'Untitled_Entry'}
        </span>

        {/* Meta row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Color dot inline indicator */}
          {file.color && (
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: file.color }}
            />
          )}
          <span
            className="px-1.5 py-0.5 text-[8px] font-bold rounded tracking-widest leading-none"
            style={{ backgroundColor: 'var(--os-hover)', color: 'var(--os-text-accent)' }}
          >
            TXT
          </span>
          {file.tags?.length > 0 && (
            <span
              className="px-1.5 py-0.5 text-[8px] font-bold rounded tracking-widest leading-none"
              style={{ backgroundColor: 'var(--os-hover)', color: 'var(--os-text-accent)' }}
            >
              {file.tags[0].toUpperCase()}
            </span>
          )}
          <span
            className="text-[9px] font-mono ml-auto tabular-nums leading-none"
            style={{ color: 'var(--os-text-accent)', opacity: 0.6 }}
          >
            {new Date(file.updatedAt).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })}
          </span>
        </div>
      </div>

      {/* ── Action buttons ──────────────────────────────────────── */}
      {/* Desktop: revealed on hover via group-hover.                */}
      {/* Selected rows: always visible (any device).                */}
      <div
        className={`absolute right-2 top-2.5 flex items-center gap-1 transition-opacity duration-150 ${
          actionsAlwaysVisible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        {/* Color label button */}
        {onColorChange && (
          <div className="relative">
            <button
              ref={pickerAnchorRef}
              onClick={handleTogglePicker}
              className="p-1.5 rounded-md transition-all active:scale-90"
              style={{
                color: file.color || 'var(--os-text-accent)',
                opacity: showColorPicker ? 1 : 0.6,
                backgroundColor: showColorPicker ? 'var(--os-hover)' : 'transparent',
              }}
              title="Set color label"
              aria-label="Set color label"
            >
              <Palette size={12} strokeWidth={2} />
            </button>
            <AnimatePresence>
              {showColorPicker && (
                <ColorPicker
                  fileId={file.id}
                  currentColor={file.color}
                  anchorRect={anchorRect}
                  containerRect={containerRect}
                  onColorChange={onColorChange}
                  onClose={() => onOpenPicker(null)}
                />
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(file.id);
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
            }}
            className="p-1.5 rounded-md transition-all active:scale-90"
            style={{ color: 'var(--os-text-accent)', opacity: 0.6 }}
            title="Delete prompt"
            aria-label="Delete prompt"
          >
            <Trash2 size={12} strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

/**
 * Sidebar file-system navigator.
 * Displays saved prompts with selection, creation, search, color labels, and metadata.
 * Responsive: touch-friendly action buttons, adaptive color picker placement.
 * Dark-mode aware via CSS custom properties.
 */
export const FileSystem = ({ files, selectedFileId, onSelect, onNew, onDelete, onColorChange }: FileSystemProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);

  const filteredFiles = searchQuery
    ? files.filter(f => f.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : files;

  // Close any open picker when selecting a different file
  const handleSelect = useCallback((id: string) => {
    setOpenPickerId(null);
    onSelect(id);
  }, [onSelect]);

  return (
    <div className="w-full h-full flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--os-surface)' }}>
      {/* ── Brand Header ─────────────────────────────────────────── */}
      <div className="px-4 sm:px-5 pt-5 sm:pt-6 pb-2">
        <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
          <div className="flex gap-[3px]">
            <div className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: 'var(--os-navy)' }} />
            <div className="w-2.5 h-2.5 rounded-[3px]" style={{ backgroundColor: 'var(--os-text-accent)' }} />
          </div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] select-none" style={{ color: 'var(--os-text-secondary)' }}>
            SHRIMP NOTES
          </h2>
          {files.length > 0 && (
            <span
              className="ml-auto px-1.5 py-0.5 text-[9px] font-bold rounded-md tabular-nums"
              style={{ backgroundColor: 'var(--os-hover)', color: 'var(--os-text-accent)' }}
            >
              {files.length}
            </span>
          )}
        </div>

        {/* ── New Entry Button ─────────────────────────────────────── */}
        <button
          onClick={onNew}
          className="w-full flex items-center justify-between group py-2.5 px-0 border-b transition-colors mb-3 sm:mb-4"
          style={{ borderColor: 'var(--os-navy)', color: 'var(--os-text)' }}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.1em]">New Entry</span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono opacity-40 hidden sm:inline" style={{ color: 'var(--os-text-secondary)' }}>⌘N</span>
            <Plus size={14} className="group-hover:rotate-90 transition-transform duration-200" />
          </div>
        </button>

        {/* ── Search / Filter ─────────────────────────────────────── */}
        {files.length > 3 && (
          <div className="relative mb-2">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--os-text-accent)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter notes..."
              className="w-full pl-7 pr-7 py-2.5 sm:py-2 rounded-lg text-[11px] focus:outline-none transition-all font-sans border"
              style={{
                backgroundColor: 'var(--os-surface-elevated)',
                borderColor: 'var(--os-border)',
                color: 'var(--os-text)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 transition-colors"
                style={{ color: 'var(--os-text-accent)' }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── File List ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-3 pb-6 space-y-0.5 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredFiles.map((file, index) => (
            <motion.div
              key={file.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ delay: Math.min(index * 0.03, 0.2), type: 'spring', stiffness: 400, damping: 30 }}
            >
              <FileRow
                file={file}
                isSelected={selectedFileId === file.id}
                onSelect={() => handleSelect(file.id)}
                onDelete={onDelete}
                onColorChange={onColorChange}
                openPickerId={openPickerId}
                onOpenPicker={setOpenPickerId}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {filteredFiles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--os-hover)' }}>
              <FileText size={16} style={{ color: 'var(--os-text-accent)' }} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: 'var(--os-text-accent)' }}>
              {searchQuery ? 'No Matches' : 'No Records'}
            </span>
            <span className="text-[10px]" style={{ color: 'var(--os-text-accent)', opacity: 0.6 }}>
              {searchQuery ? 'Try a different search term' : 'Create your first prompt'}
            </span>
          </div>
        )}
      </div>

      {/* ── Footer / System Info ──────────────────────────────────── */}
      <div className="px-4 sm:px-5 py-3 border-t" style={{ borderColor: 'var(--os-hover)' }}>
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-mono uppercase tracking-widest" style={{ color: 'var(--os-text-accent)', opacity: 0.6 }}>
            v5.0.0
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[8px] font-mono uppercase tracking-widest" style={{ color: 'var(--os-text-accent)', opacity: 0.6 }}>
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
