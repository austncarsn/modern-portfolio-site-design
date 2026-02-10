import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Wand2, ClipboardPaste, Eye, FileText, Check,
  Sparkles, Plus, Trash2, ToggleLeft, ToggleRight,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

import { smartFormatPrompt, CustomRule } from '../utils/prompt-formatter';
import { markdownComponents } from './markdown-styles';

// ── Types ────────────────────────────────────────────────────────────────────

interface SmartPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (text: string) => void;
  initialText: string;
  customRules?: CustomRule[];
  onCustomRulesChange?: (rules: CustomRule[]) => void;
}

// ── Layout Shell ─────────────────────────────────────────────────────────────

interface SmartPasteLayoutProps {
  isOpen: boolean;
  onClose: () => void;

  header: React.ReactNode;
  footer: React.ReactNode;

  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;

  ariaLabel?: string;
}

export const SmartPasteLayout: React.FC<SmartPasteLayoutProps> = ({
  isOpen,
  onClose,
  header,
  footer,
  left,
  center,
  right,
  ariaLabel = 'Smart Paste dialog',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Escape key handling
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Basic focus containment
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current.focus();

    return () => {
      previous?.focus?.();
    };
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            tabIndex={-1}
            initial={{ scale: 0.96, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[90vw] h-[85vh] bg-[var(--os-surface-elevated)] border border-[var(--os-border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden focus:outline-none"
          >
            {/* Header */}
            <header className="shrink-0">
              {header}
            </header>

            {/* Main Grid */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left */}
              <aside className="w-72 shrink-0 border-r border-[var(--os-border)] bg-gradient-to-b from-[var(--os-surface-soft)] to-[var(--os-surface-elevated)] overflow-hidden">
                {left}
              </aside>

              {/* Center */}
              <section className="flex-1 overflow-hidden bg-[var(--os-surface-elevated)]">
                {center}
              </section>

              {/* Right */}
              <aside className="flex-1 border-l border-[var(--os-border)] bg-gradient-to-br from-[var(--os-surface-soft)] via-[var(--os-surface-elevated)] to-[var(--os-surface)] overflow-hidden">
                {right}
              </aside>
            </div>

            {/* Footer */}
            <footer className="shrink-0">
              {footer}
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

// ── SmartPasteModal ──────────────────────────────────────────────────────────

type SourceMode = 'document' | 'paste';

export const SmartPasteModal: React.FC<SmartPasteModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialText,
  customRules = [],
  onCustomRulesChange,
}) => {
  const [sourceMode, setSourceMode] = useState<SourceMode>('document');
  const [pastedText, setPastedText] = useState('');
  const [showRules, setShowRules] = useState(false);
  const pasteRef = useRef<HTMLTextAreaElement>(null);

  // Draft rule fields
  const [draftName, setDraftName] = useState('');
  const [draftPattern, setDraftPattern] = useState('');
  const [draftReplacement, setDraftReplacement] = useState('');

  // Source text
  const sourceText = sourceMode === 'document' ? initialText : pastedText;

  // Formatted result (memoized, recomputed when source or rules change)
  const formatResult = useMemo(() => {
    if (!sourceText.trim()) return { formatted: '', formatType: 'Empty' };
    return smartFormatPrompt(sourceText, customRules);
  }, [sourceText, customRules]);

  // Reset paste area when modal opens
  useEffect(() => {
    if (isOpen) {
      setPastedText('');
      setSourceMode('document');
      setShowRules(false);
    }
  }, [isOpen]);

  // Focus paste textarea when switching to paste mode
  useEffect(() => {
    if (sourceMode === 'paste' && pasteRef.current) {
      pasteRef.current.focus();
    }
  }, [sourceMode]);

  const handleApply = useCallback(() => {
    if (!formatResult.formatted.trim()) return;
    onApply(formatResult.formatted);
    onClose();
  }, [formatResult.formatted, onApply, onClose]);

  const handleAddRule = useCallback(() => {
    if (!draftName.trim() || !draftPattern.trim() || !onCustomRulesChange) return;
    try {
      new RegExp(draftPattern); // validate
    } catch {
      toast.error('Invalid regex pattern');
      return;
    }
    const newRule: CustomRule = {
      id: Date.now().toString(),
      name: draftName.trim(),
      pattern: draftPattern.trim(),
      replacement: draftReplacement,
      active: true,
    };
    onCustomRulesChange([...customRules, newRule]);
    setDraftName('');
    setDraftPattern('');
    setDraftReplacement('');
    toast.success('Rule added');
  }, [draftName, draftPattern, draftReplacement, customRules, onCustomRulesChange]);

  const handleToggleRule = useCallback((id: string) => {
    if (!onCustomRulesChange) return;
    onCustomRulesChange(customRules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  }, [customRules, onCustomRulesChange]);

  const handleDeleteRule = useCallback((id: string) => {
    if (!onCustomRulesChange) return;
    onCustomRulesChange(customRules.filter(r => r.id !== id));
  }, [customRules, onCustomRulesChange]);

  const changed = formatResult.formatted !== sourceText;
  const wordCount = sourceText.split(/\s+/).filter(Boolean).length;
  const formattedWordCount = formatResult.formatted.split(/\s+/).filter(Boolean).length;

  // ── Header ───────────────────────────────────────────────────────────────

  const headerContent = (
    <div
      className="flex items-center justify-between px-5 py-3 border-b"
      style={{ borderColor: 'var(--os-border)' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--os-navy), var(--os-highlight))' }}
        >
          <Sparkles size={16} className="text-white" />
        </div>
        <div>
          <h2
            className="text-sm font-bold tracking-tight"
            style={{ color: 'var(--os-text)' }}
          >
            Smart Paste
          </h2>
          <p
            className="text-[10px] font-mono uppercase tracking-wider"
            style={{ color: 'var(--os-text-secondary)' }}
          >
            Format & transform
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 rounded-lg transition-colors hover:bg-[var(--os-hover)]"
        style={{ color: 'var(--os-text-secondary)' }}
      >
        <X size={16} />
      </button>
    </div>
  );

  // ── Left Panel: Source & Settings ─────────────────────────────────────────

  const leftContent = (
    <div className="flex flex-col h-full">
      {/* Source toggle */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--os-border)' }}>
        <p
          className="text-[9px] font-mono uppercase tracking-widest mb-2"
          style={{ color: 'var(--os-text-secondary)' }}
        >
          Source
        </p>
        <div
          className="flex rounded-lg border overflow-hidden"
          style={{ borderColor: 'var(--os-border)' }}
        >
          {([
            { key: 'document' as SourceMode, icon: FileText, label: 'Document' },
            { key: 'paste' as SourceMode, icon: ClipboardPaste, label: 'Paste' },
          ]).map((s) => {
            const SIcon = s.icon;
            const active = sourceMode === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSourceMode(s.key)}
                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                style={{
                  backgroundColor: active ? 'var(--os-navy)' : 'transparent',
                  color: active ? '#fff' : 'var(--os-text-secondary)',
                }}
              >
                <SIcon size={11} />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--os-border)' }}>
        <p
          className="text-[9px] font-mono uppercase tracking-widest mb-2"
          style={{ color: 'var(--os-text-secondary)' }}
        >
          Stats
        </p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px]" style={{ color: 'var(--os-text-secondary)' }}>
            <span>Words</span>
            <span className="font-mono">{wordCount}</span>
          </div>
          <div className="flex justify-between text-[10px]" style={{ color: 'var(--os-text-secondary)' }}>
            <span>Characters</span>
            <span className="font-mono">{sourceText.length.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[10px]" style={{ color: 'var(--os-text-secondary)' }}>
            <span>Format type</span>
            <span className="font-mono font-bold" style={{ color: 'var(--os-text-accent)' }}>
              {formatResult.formatType}
            </span>
          </div>
          {changed && (
            <div className="flex justify-between text-[10px]" style={{ color: 'var(--os-text-accent)' }}>
              <span>Result words</span>
              <span className="font-mono">{formattedWordCount}</span>
            </div>
          )}
        </div>
      </div>

      {/* Custom rules toggle */}
      {onCustomRulesChange && (
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--os-border)' }}>
          <button
            onClick={() => setShowRules(!showRules)}
            className="flex items-center justify-between w-full text-[10px] font-bold uppercase tracking-wider cursor-pointer"
            style={{ color: 'var(--os-text-secondary)' }}
          >
            <span>Custom Rules ({customRules.length})</span>
            <motion.div animate={{ rotate: showRules ? 180 : 0 }}>
              <Plus size={11} />
            </motion.div>
          </button>
        </div>
      )}

      {/* Custom rules list */}
      {showRules && onCustomRulesChange && (
        <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
          {customRules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center gap-2 py-1.5 border-b"
              style={{ borderColor: 'var(--os-border)' }}
            >
              <button
                onClick={() => handleToggleRule(rule.id)}
                className="shrink-0 cursor-pointer"
                style={{ color: rule.active ? 'var(--os-text-accent)' : 'var(--os-text-secondary)' }}
              >
                {rule.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold truncate" style={{ color: 'var(--os-text)' }}>
                  {rule.name}
                </p>
                <p className="text-[9px] font-mono truncate" style={{ color: 'var(--os-text-secondary)' }}>
                  {rule.pattern} &rarr; {rule.replacement || '(remove)'}
                </p>
              </div>
              <button
                onClick={() => handleDeleteRule(rule.id)}
                className="shrink-0 p-1 rounded transition-colors hover:bg-[var(--os-hover)] cursor-pointer"
                style={{ color: 'var(--os-text-secondary)' }}
              >
                <Trash2 size={11} />
              </button>
            </div>
          ))}

          {/* Add rule form */}
          <div className="mt-3 space-y-1.5">
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Rule name"
              className="w-full px-2 py-1 text-[10px] rounded border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--os-border)', color: 'var(--os-text)' }}
            />
            <input
              type="text"
              value={draftPattern}
              onChange={(e) => setDraftPattern(e.target.value)}
              placeholder="Regex pattern"
              className="w-full px-2 py-1 text-[10px] font-mono rounded border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--os-border)', color: 'var(--os-text)' }}
            />
            <input
              type="text"
              value={draftReplacement}
              onChange={(e) => setDraftReplacement(e.target.value)}
              placeholder="Replacement"
              className="w-full px-2 py-1 text-[10px] font-mono rounded border bg-transparent focus:outline-none"
              style={{ borderColor: 'var(--os-border)', color: 'var(--os-text)' }}
            />
            <button
              onClick={handleAddRule}
              disabled={!draftName.trim() || !draftPattern.trim()}
              className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-default"
              style={{
                backgroundColor: 'var(--os-navy)',
                color: '#fff',
              }}
            >
              <Plus size={10} />
              Add Rule
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ── Center Panel: Input/Source ─────────────────────────────────────────────

  const centerContent = (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center gap-2 px-4 py-2 border-b shrink-0"
        style={{ borderColor: 'var(--os-border)' }}
      >
        <FileText size={11} style={{ color: 'var(--os-text-accent)' }} />
        <span
          className="text-[9px] font-mono font-bold uppercase tracking-widest"
          style={{ color: 'var(--os-text-accent)' }}
        >
          {sourceMode === 'document' ? 'Current Document' : 'Pasted Input'}
        </span>
      </div>
      <div className="flex-1 overflow-hidden">
        {sourceMode === 'paste' ? (
          <textarea
            ref={pasteRef}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full h-full bg-transparent px-4 py-4 focus:outline-none resize-none font-mono text-[13px] leading-relaxed overflow-y-auto custom-scrollbar"
            style={{ color: 'var(--os-text)' }}
          />
        ) : (
          <div
            className="w-full h-full px-4 py-4 overflow-y-auto custom-scrollbar font-mono text-[13px] leading-relaxed whitespace-pre-wrap"
            style={{ color: 'var(--os-text)' }}
          >
            {sourceText || <span style={{ color: 'var(--os-text-secondary)', fontStyle: 'italic' }}>No document content</span>}
          </div>
        )}
      </div>
    </div>
  );

  // ── Right Panel: Formatted Preview ────────────────────────────────────────

  const rightContent = (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center gap-2 px-4 py-2 border-b shrink-0"
        style={{ borderColor: 'var(--os-border)' }}
      >
        <Eye size={11} style={{ color: 'var(--os-text-accent)' }} />
        <span
          className="text-[9px] font-mono font-bold uppercase tracking-widest"
          style={{ color: 'var(--os-text-accent)' }}
        >
          Formatted Preview
        </span>
        {changed && (
          <span
            className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded"
            style={{ backgroundColor: 'var(--os-navy)', color: '#fff' }}
          >
            Modified
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 font-sans-preview" style={{ color: 'var(--os-text)' }}>
        {formatResult.formatted.trim() ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {formatResult.formatted}
          </ReactMarkdown>
        ) : (
          <p className="text-[13px] italic" style={{ color: 'var(--os-text-secondary)' }}>
            Nothing to preview
          </p>
        )}
      </div>
    </div>
  );

  // ── Footer ────────────────────────────────────────────────────────────────

  const footerContent = (
    <div
      className="flex items-center justify-between px-5 py-3 border-t"
      style={{ borderColor: 'var(--os-border)' }}
    >
      <div className="flex items-center gap-2 text-[10px] font-mono" style={{ color: 'var(--os-text-secondary)' }}>
        <Wand2 size={11} />
        <span>{formatResult.formatType}</span>
        {!changed && sourceText.trim() && (
          <span className="ml-2 opacity-60">Already formatted</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
          style={{
            borderColor: 'var(--os-border)',
            color: 'var(--os-text-secondary)',
          }}
        >
          Cancel
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApply}
          disabled={!formatResult.formatted.trim()}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
          style={{
            background: 'linear-gradient(135deg, var(--os-navy), color-mix(in srgb, var(--os-navy) 80%, var(--os-highlight)))',
            color: '#fff',
          }}
        >
          <Check size={12} />
          Apply
        </motion.button>
      </div>
    </div>
  );

  return (
    <SmartPasteLayout
      isOpen={isOpen}
      onClose={onClose}
      header={headerContent}
      footer={footerContent}
      left={leftContent}
      center={centerContent}
      right={rightContent}
      ariaLabel="Smart Paste dialog"
    />
  );
};
