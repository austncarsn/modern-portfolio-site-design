import React, { useState, useRef, useEffect, useCallback, useMemo, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye, RotateCcw, Redo2, Bold, Italic, Hash, List,
  Code, Wand2, Braces, Download, Keyboard, Strikethrough,
  Link2, Quote, ListOrdered, CheckSquare, Table, Columns,
  Minus, Copy, CheckCheck, Sparkles, AlignJustify, Grid3x3,
  FileText, CircleOff, Type,
  Zap, Clock, AlertTriangle, Shield, BookOpen, BarChart3,
  ChevronUp
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

import { SmartPasteModal } from './smart-paste-modal';
import { markdownComponents } from './markdown-styles';
import { smartFormatPrompt, CustomRule } from '../utils/prompt-formatter';
import { useCopyToClipboard, exportMarkdownFile, GENERIC_TERMS } from '../utils/helpers';
import {
  MetricItem, HUDDivider, StatusIndicator,
  AVERAGE_READING_WPM, AVERAGE_SPEAKING_WPM,
  getBuzzwordSeverity, formatTime
} from './hud';

// Custom Edit Icon Component
const EditIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      opacity="0.4"
      d="M5.5 3.25H15.5411L14.0411 4.75H5.5C5.08579 4.75 4.75 5.08579 4.75 5.5V18.5C4.75 18.9142 5.08579 19.25 5.5 19.25H18.5C18.9142 19.25 19.25 18.9142 19.25 18.5V9.95823L20.75 8.45823V18.5C20.75 19.7426 19.7426 20.75 18.5 20.75H5.5C4.25736 20.75 3.25 19.7426 3.25 18.5V5.5C3.25 4.25736 4.25736 3.25 5.5 3.25Z"
      fill="currentColor"
    />
    <path
      d="M20.8749 2.51256C20.1915 1.82914 19.0834 1.82915 18.4 2.51256L13.2418 7.6708C12.879 8.03363 12.651 8.50959 12.5958 9.01974L12.4068 10.7667C12.3824 10.9924 12.4616 11.2171 12.6221 11.3777C12.7827 11.5382 13.0074 11.6174 13.2332 11.593L14.9801 11.404C15.4902 11.3488 15.9662 11.1209 16.329 10.758L21.4873 5.59978C22.1707 4.91637 22.1707 3.80833 21.4873 3.12491L20.8749 2.51256ZM18.5981 4.43586L19.564 5.40176L15.2684 9.69736C15.1474 9.8183 14.9888 9.89428 14.8187 9.91268L13.9984 10.0014L14.0871 9.18111C14.1055 9.01106 14.1815 8.8524 14.3025 8.73146L18.5981 4.43586Z"
      fill="currentColor"
    />
  </svg>
);

// --- Types ---

type EditorMode = 'write' | 'preview' | 'split';
type GridGuide = 'none' | 'rows' | 'lines' | 'page' | 'grid';

// Stable constant — outside component to avoid re-creation
const GUIDE_ORDER: GridGuide[] = ['none', 'rows', 'lines', 'page', 'grid'];

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  onPaste?: (e: React.ClipboardEvent) => void;
  onActivity?: () => void;
  jumpToIndex?: number | null;
  onJumpComplete?: () => void;
  status?: 'idle' | 'typing' | 'syncing' | 'saved';
  lastSaved?: number | null;
  onBuzzwordClick?: () => void;
  customRules?: CustomRule[];
  onCustomRulesChange?: (rules: CustomRule[]) => void;
}

// --- Main Component ---

export const RichTextEditor = ({ value, onChange, onPaste, onActivity, jumpToIndex, onJumpComplete, status, lastSaved, onBuzzwordClick, customRules, onCustomRulesChange }: RichTextEditorProps) => {
  const [mode, setMode] = useState<EditorMode>('split');
  const [isFocused, setIsFocused] = useState(false);
  const [showSmartPasteModal, setShowSmartPasteModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [copied, doCopy] = useCopyToClipboard();
  const [hudExpanded, setHudExpanded] = useState(false);

  // ── Deferred value — lets React prioritise the textarea re-render ──
  // Expensive derived work (preview, metrics, buzzwords) reads from this
  // so they never block per-character input at 60 fps.
  const deferredValue = useDeferredValue(value);

  // Pre-compiled single-pass buzzword regex (built once, never per-keystroke)
  const buzzwordRegex = useMemo(() => {
    // Use fromCharCode to construct word-boundary escape without source-level backslashes
    const wb = String.fromCharCode(92) + 'b';
    const joined = GENERIC_TERMS.join('|');
    return new RegExp(wb + '(?:' + joined + ')' + wb, 'gi');
  }, []);

  // Grid Guide State
  const [gridGuide, setGridGuide] = useState<GridGuide>('none');
  const cycleGuide = useCallback(() => {
    setGridGuide(prev => {
      const idx = GUIDE_ORDER.indexOf(prev);
      const next = GUIDE_ORDER[(idx + 1) % GUIDE_ORDER.length];
      return next;
    });
  }, []);

  // History Stack with Undo & Redo
  const [historyStack, setHistoryStack] = useState<string[]>([value]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const saveToHistory = useCallback((newValue: string) => {
    setHistoryStack(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newValue);
      if (newHistory.length > 80) newHistory.shift();
      return newHistory;
    });
    setCurrentIndex(prev => {
      const cappedLen = Math.min(currentIndex + 2, 80);
      return cappedLen - 1;
    });
  }, [currentIndex]);

  const handleUndo = useCallback(() => {
    if (currentIndex > 0) {
      const prevValue = historyStack[currentIndex - 1];
      setCurrentIndex(currentIndex - 1);
      onChange(prevValue);
    }
  }, [currentIndex, historyStack, onChange]);

  const handleRedo = useCallback(() => {
    if (currentIndex < historyStack.length - 1) {
      const nextValue = historyStack[currentIndex + 1];
      setCurrentIndex(currentIndex + 1);
      onChange(nextValue);
    }
  }, [currentIndex, historyStack, onChange]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== historyStack[currentIndex]) {
        saveToHistory(value);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [value]);

  // ── Insert / Wrap text ──────────────────────────────────────────────
  const insertText = useCallback((before: string, after: string = '') => {
    const el = textareaRef.current;
    if (!el) {
      const newText = value + before + after;
      onChange(newText);
      saveToHistory(newText);
      return;
    }
    
    if (value !== historyStack[currentIndex]) {
      saveToHistory(value);
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const beforeText = text.substring(0, start);
    const selectedText = text.substring(start, end);
    const afterText = text.substring(end);
    
    const newText = `${beforeText}${before}${selectedText}${after}${afterText}`;
    onChange(newText);
    
    setHistoryStack(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newText);
      return newHistory;
    });
    setCurrentIndex(prev => prev + 1);
    
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  }, [value, historyStack, currentIndex, onChange, saveToHistory]);

  const insertAtLineStart = useCallback((prefix: string) => {
    const el = textareaRef.current;
    if (!el) { insertText(prefix); return; }

    const start = el.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const beforeLine = value.substring(0, lineStart);
    const afterLineStart = value.substring(lineStart);

    const newText = `${beforeLine}${prefix}${afterLineStart}`;
    onChange(newText);
    saveToHistory(newText);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  }, [value, onChange, saveToHistory, insertText]);

  const insertTable = useCallback(() => {
    const template = '\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n';
    insertText(template);
  }, [insertText]);

  // ── One-click Magic Format (apply smart formatter to full document) ──
  const [formatFlash, setFormatFlash] = useState(false);

  const handleMagicFormat = useCallback(() => {
    if (!value.trim()) return;
    const result = smartFormatPrompt(value, customRules);
    if (result.formatted !== value) {
      saveToHistory(value);
      onChange(result.formatted);
      setFormatFlash(true);
      setTimeout(() => setFormatFlash(false), 1200);
      toast.success(`Magic Format applied: ${result.formatType}`);
    } else {
      toast('Document already formatted');
    }
  }, [value, onChange, saveToHistory, customRules]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onActivity) onActivity();
    const mod = e.metaKey || e.ctrlKey;

    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        const el = textareaRef.current;
        if (el) {
          const start = el.selectionStart;
          const lineStart = value.lastIndexOf('\n', start - 1) + 1;
          if (value.substring(lineStart, lineStart + 2) === '  ') {
            const newText = value.substring(0, lineStart) + value.substring(lineStart + 2);
            onChange(newText);
            el.setSelectionRange(Math.max(start - 2, lineStart), Math.max(start - 2, lineStart));
          }
        }
      } else {
        insertText('  ');
      }
      return;
    }

    if (mod && e.shiftKey && e.key === 'v') {
      e.preventDefault();
      setShowSmartPasteModal(true);
      return;
    }

    // ⌘⇧F — Magic Format
    if (mod && e.shiftKey && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      handleMagicFormat();
      return;
    }

    if (mod && !e.shiftKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          insertText('**', '**');
          return;
        case 'i':
          e.preventDefault();
          insertText('*', '*');
          return;
        case 'z':
          e.preventDefault();
          handleUndo();
          return;
        case 'y':
          e.preventDefault();
          handleRedo();
          return;
      }
    }

    if (mod && e.shiftKey && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      handleRedo();
      return;
    }

    // ⌘⇧X — Strikethrough
    if (mod && e.shiftKey && e.key.toLowerCase() === 'x') {
      e.preventDefault();
      insertText('~~', '~~');
      return;
    }

    // Enter → auto-continue list
    if (e.key === 'Enter' && !mod && !e.shiftKey) {
      const el = textareaRef.current;
      if (el) {
        const cursorPos = el.selectionStart;
        const lineStart = value.lastIndexOf('\n', cursorPos - 1) + 1;
        const currentLine = value.substring(lineStart, cursorPos);
        
        const bulletMatch = currentLine.match(/^(\s*[-*+]\s)/);
        const numberedMatch = currentLine.match(/^(\s*)(\d+)\.\s/);
        const checkboxMatch = currentLine.match(/^(\s*-\s\[[ x]\]\s)/);
        
        if (bulletMatch && (currentLine.trim() === '-' || currentLine.trim() === '*' || currentLine.trim() === '+')) {
          e.preventDefault();
          const newText = value.substring(0, lineStart) + '\n' + value.substring(cursorPos);
          onChange(newText);
          setTimeout(() => { el.setSelectionRange(lineStart + 1, lineStart + 1); }, 0);
          return;
        }

        if (checkboxMatch) {
          e.preventDefault();
          const prefix = checkboxMatch[1].replace(/\[x\]/, '[ ]');
          const newText = value.substring(0, cursorPos) + '\n' + prefix + value.substring(cursorPos);
          onChange(newText);
          setTimeout(() => { const p = cursorPos + 1 + prefix.length; el.setSelectionRange(p, p); }, 0);
          return;
        }

        if (bulletMatch) {
          e.preventDefault();
          const prefix = bulletMatch[1];
          const newText = value.substring(0, cursorPos) + '\n' + prefix + value.substring(cursorPos);
          onChange(newText);
          setTimeout(() => { const p = cursorPos + 1 + prefix.length; el.setSelectionRange(p, p); }, 0);
          return;
        }
        
        if (numberedMatch) {
          e.preventDefault();
          const indent = numberedMatch[1];
          const nextNum = parseInt(numberedMatch[2]) + 1;
          const prefix = `${indent}${nextNum}. `;
          const newText = value.substring(0, cursorPos) + '\n' + prefix + value.substring(cursorPos);
          onChange(newText);
          setTimeout(() => { const p = cursorPos + 1 + prefix.length; el.setSelectionRange(p, p); }, 0);
          return;
        }
      }
    }
  }, [value, onChange, onActivity, insertText, handleUndo, handleRedo, handleMagicFormat, customRules]);

  const handleExport = useCallback(() => {
    exportMarkdownFile(value, 'editorial-prompt');
    toast.success("Exported");
  }, [value]);

  const handleCopyAll = useCallback(() => {
    doCopy(value);
    toast.success("Copied to clipboard");
  }, [value, doCopy]);

  // ── Paste handler ───────────────────────────────────────────────────
  const handleInternalPaste = useCallback((e: React.ClipboardEvent) => {
    if (onPaste) onPaste(e);
    if (onActivity) onActivity();
    
    const text = e.clipboardData.getData('text');
    if (!text) return;
    e.preventDefault();

    const el = textareaRef.current;
    if (el) {
      if (value !== historyStack[currentIndex]) saveToHistory(value);
      
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newText = `${value.substring(0, start)}${text}${value.substring(end)}`;
      onChange(newText);
      
      setHistoryStack(prev => { const h = prev.slice(0, currentIndex + 1); h.push(newText); return h; });
      setCurrentIndex(prev => prev + 1);
      
      setTimeout(() => {
        el.focus();
        const newPos = start + text.length;
        el.setSelectionRange(newPos, newPos);
      }, 0);
    } else {
      onChange(value + text);
      saveToHistory(value + text);
    }
  }, [value, onChange, onPaste, onActivity, historyStack, currentIndex, saveToHistory]);

  const handleSmartPasteApply = useCallback((text: string) => {
    onChange(text);
    saveToHistory(text);
    toast.success("Applied Smart Paste Format");
  }, [onChange, saveToHistory]);

  // Process content for preview — always render variables in preview/split
  // Uses deferredValue so markdown parsing never blocks keystroke rendering
  const processedContent = useMemo(() => {
    return deferredValue.replace(/(\{\{[^}]+\}\})/g, '`$1`');
  }, [deferredValue]);

  // Memoize the preview so React skips DOM reconciliation while
  // the deferred value is still catching up with keystrokes.
  const PreviewContent = useMemo(() => (
    <div 
      ref={previewRef}
      className="w-full h-full px-6 py-6 lg:px-10 lg:py-8 overflow-y-auto custom-scrollbar font-sans-preview bg-transparent" 
      style={{ color: 'var(--os-text)' }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {processedContent || '*Canvas Empty*'}
      </ReactMarkdown>
    </div>
  ), [processedContent]);

  // Immediate — charCount is O(1), always fresh for the footer
  const charCount = value.length;

  // Deferred — these scan the full string; safe to lag a frame
  const lineCount = useMemo(() => deferredValue.split('\n').length, [deferredValue]);
  const wordCount = useMemo(() => deferredValue.split(/\s+/).filter(Boolean).length, [deferredValue]);

  // Deferred variable detection
  const variables = useMemo(() => {
    const regex = /\{\{([^}]+)\}\}/g;
    const found: string[] = [];
    let match;
    while ((match = regex.exec(deferredValue)) !== null) {
      found.push(match[1]);
    }
    return [...new Set(found)];
  }, [deferredValue]);

  // ── HUD Metrics — deferred + single-pass regex ────────────────────────
  const hudMetrics = useMemo(() => {
    const tokenCount = Math.round(deferredValue.length / 4);
    const sentenceCount = (deferredValue.match(/[.!?]+/g) || []).length || (deferredValue.length > 0 ? 1 : 0);
    const paragraphCount = deferredValue.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length || (deferredValue.length > 0 ? 1 : 0);
    const deferredWordCount = deferredValue.split(/\s+/).filter(Boolean).length;
    const readingTimeMinutes = deferredWordCount / AVERAGE_READING_WPM;
    const speakingTimeMinutes = deferredWordCount / AVERAGE_SPEAKING_WPM;
    const avgWordsPerSentence = sentenceCount > 0 ? Math.round(deferredWordCount / sentenceCount) : 0;
    // Single-pass regex instead of 138 separate scans
    const buzzwordMatches = deferredValue.match(buzzwordRegex);
    const buzzwordCount = buzzwordMatches ? buzzwordMatches.length : 0;
    const buzzwordSeverity = getBuzzwordSeverity(buzzwordCount, deferredWordCount);
    return { tokenCount, sentenceCount, paragraphCount, readingTimeMinutes, speakingTimeMinutes, avgWordsPerSentence, buzzwordCount, buzzwordSeverity };
  }, [deferredValue, buzzwordRegex]);

  // ── Jump to index (from outline) ─────────────────────────────────────
  useEffect(() => {
    if (jumpToIndex !== null && jumpToIndex !== undefined && textareaRef.current) {
      const el = textareaRef.current;
      if (mode === 'preview') setMode('split');

      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(jumpToIndex, jumpToIndex);
        const textBefore = value.substring(0, jumpToIndex);
        const lineNum = textBefore.split('\n').length;
        el.scrollTop = Math.max(0, (lineNum - 1) * 24 - el.clientHeight / 3);
        if (onJumpComplete) onJumpComplete();
      });
    }
  }, [jumpToIndex]);

  // ═══════════════════════════════════════════════════════════════════════
  // SHARED RENDER PIECES
  // ═══════════════════════════════════════════════════════════════════════

  // ── Grid Guide Overlay ──────────────────────────────────────────────
  const LINE_HEIGHT = 24; // matches leading-relaxed at 14px ≈ 1.625 × 14 ≈ 22.75, rounding to 24
  const guideOverlayStyle: React.CSSProperties | undefined = gridGuide === 'none' ? undefined : (() => {
    const borderCol = 'var(--os-border)';
    switch (gridGuide) {
      case 'rows':
        return {
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent ${LINE_HEIGHT - 1}px, ${borderCol} ${LINE_HEIGHT - 1}px, ${borderCol} ${LINE_HEIGHT}px)`,
          backgroundSize: `100% ${LINE_HEIGHT}px`,
          opacity: 0.35,
        };
      case 'lines':
        return {
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent ${LINE_HEIGHT - 1}px, ${borderCol} ${LINE_HEIGHT - 1}px, ${borderCol} ${LINE_HEIGHT}px)`,
          backgroundSize: `100% ${LINE_HEIGHT}px`,
          opacity: 0.35,
          borderLeft: `1px solid ${borderCol}`,
          marginLeft: 42,
        };
      case 'page':
        return {
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent ${LINE_HEIGHT - 1}px, ${borderCol} ${LINE_HEIGHT - 1}px, ${borderCol} ${LINE_HEIGHT}px)`,
          backgroundSize: `100% ${LINE_HEIGHT}px`,
          opacity: 0.25,
          borderLeft: `2px solid color-mix(in srgb, ${borderCol} 60%, transparent)`,
          borderRight: `2px solid color-mix(in srgb, ${borderCol} 60%, transparent)`,
          marginLeft: 48,
          marginRight: 48,
        };
      case 'grid':
        return {
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent ${LINE_HEIGHT - 1}px, ${borderCol} ${LINE_HEIGHT - 1}px, ${borderCol} ${LINE_HEIGHT}px),
            repeating-linear-gradient(90deg, transparent, transparent 79px, ${borderCol} 79px, ${borderCol} 80px)
          `,
          backgroundSize: `100% ${LINE_HEIGHT}px, 80px 100%`,
          opacity: 0.2,
        };
      default: return {};
    }
  })();

  const GuideOverlay = gridGuide !== 'none' ? (
    <div
      className="absolute inset-0 pointer-events-none z-1"
      style={{
        ...guideOverlayStyle,
        paddingTop: 48,
        paddingBottom: 24,
      }}
    />
  ) : null;

  // ── Line Number Gutter (for 'lines' and 'page' modes) ──────────────
  const LineNumberGutter = (gridGuide === 'lines' || gridGuide === 'page') ? (
    <div
      className="absolute left-0 top-0 h-full pointer-events-none z-2 select-none overflow-hidden font-editor text-[10px]"
      style={{
        width: gridGuide === 'page' ? 44 : 38,
        paddingTop: 48,
        paddingBottom: 24,
        color: 'var(--os-text-secondary)',
        opacity: 0.35,
        lineHeight: `${LINE_HEIGHT}px`,
      }}
    >
      {Array.from({ length: Math.max(lineCount, 30) }, (_, i) => (
        <div
          key={i}
          className="text-right pr-2"
          style={{ height: LINE_HEIGHT }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  ) : null;

  const WriteTextarea = (
    <textarea 
      ref={textareaRef}
      value={value}
      onChange={(e) => { onChange(e.target.value); if (onActivity) onActivity(); }}
      onKeyDown={handleKeyDown}
      onPaste={handleInternalPaste}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={"Type your prompt here...\n\nUse **markdown** for formatting, {{variables}} for dynamic content.\nShift+Paste for plain paste. ⌘⇧V for Smart Paste modal."}
      className="w-full h-full bg-transparent px-6 pt-12 pb-6 lg:px-10 lg:pt-14 lg:pb-8 focus:outline-none resize-none font-editor leading-relaxed overflow-y-auto custom-scrollbar text-[14px]"
      style={{ color: 'var(--os-text)' }}
      spellCheck={false}
    />
  );

  // ── Floating toolbar ────────────────────────────────────────────────
  const FloatingToolbar = (() => {
    // Compact icon button for toolbar
    const ToolBtn = ({ icon: Icon, onClick, title, disabled, active, shortcut }: {
      icon: React.ElementType; onClick: () => void; title: string;
      disabled?: boolean; active?: boolean; shortcut?: string;
    }) => (
      <motion.button
        whileHover={!disabled ? { scale: 1.12 } : {}}
        whileTap={!disabled ? { scale: 0.9 } : {}}
        onClick={onClick}
        onMouseDown={(e: React.MouseEvent) => e.preventDefault()}
        type="button"
        disabled={disabled}
        className="w-7 h-7 flex items-center justify-center rounded-md transition-all duration-150 disabled:opacity-20 cursor-pointer disabled:cursor-default hover:bg-(--os-hover)"
        style={{
          color: active ? '#fff' : 'var(--os-text-secondary)',
          backgroundColor: active ? 'var(--os-navy)' : 'transparent',
        }}
        title={shortcut ? `${title} (${shortcut})` : title}
      >
        <Icon size={14} strokeWidth={2} />
      </motion.button>
    );

    // Thin vertical divider between groups
    const ToolSep = () => (
      <div className="w-px h-4 mx-1 shrink-0" style={{ backgroundColor: 'var(--os-border)' }} />
    );

    return (
      <div className="absolute top-0 left-0 right-0 z-20 select-none">
        <div
          className="flex items-center px-2 py-1 backdrop-blur-xl border-b overflow-x-auto"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--os-surface-elevated) 88%, transparent)',
            borderColor: 'var(--os-border)',
            scrollbarWidth: 'none',
          }}
        >
          {/* ── Mode Toggle (segmented control) ── */}
          <div className="flex items-center rounded-lg border overflow-hidden shrink-0" style={{ borderColor: 'var(--os-border)' }}>
            {([
              { key: 'write' as EditorMode, icon: EditIcon, label: 'Write' },
              { key: 'split' as EditorMode, icon: Columns, label: 'Split' },
              { key: 'preview' as EditorMode, icon: Eye, label: 'Preview' },
            ]).map((m) => {
              const MIcon = m.icon;
              const isActive = mode === m.key;
              return (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className="flex items-center gap-1 px-2 py-1 transition-all duration-150 cursor-pointer"
                  style={{
                    backgroundColor: isActive ? 'var(--os-navy)' : 'transparent',
                    color: isActive ? '#fff' : 'var(--os-text-secondary)',
                  }}
                  title={`${m.label} mode`}
                >
                  <MIcon size={12} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[9px] font-mono font-semibold uppercase tracking-wider hidden sm:inline">
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>

          <ToolSep />

          {/* ── History ── */}
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolBtn icon={RotateCcw} onClick={handleUndo} title="Undo" disabled={currentIndex <= 0} shortcut="⌘Z" />
            <ToolBtn icon={Redo2} onClick={handleRedo} title="Redo" disabled={currentIndex >= historyStack.length - 1} shortcut="⌘⇧Z" />
          </div>

          <ToolSep />

          {/* ── Inline Format ── */}
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolBtn icon={Bold} onClick={() => insertText('**', '**')} title="Bold" shortcut="⌘B" />
            <ToolBtn icon={Italic} onClick={() => insertText('*', '*')} title="Italic" shortcut="⌘I" />
            <ToolBtn icon={Strikethrough} onClick={() => insertText('~~', '~~')} title="Strikethrough" shortcut="⌘⇧X" />
          </div>

          <ToolSep />

          {/* ── Block Structure ── */}
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolBtn icon={Hash} onClick={() => insertAtLineStart('## ')} title="Heading" />
            <ToolBtn icon={List} onClick={() => insertAtLineStart('- ')} title="Bullet list" />
            <ToolBtn icon={ListOrdered} onClick={() => insertAtLineStart('1. ')} title="Numbered list" />
            <ToolBtn icon={CheckSquare} onClick={() => insertAtLineStart('- [ ] ')} title="Task list" />
          </div>

          <ToolSep />

          {/* ── Insert ── */}
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolBtn icon={Code} onClick={() => insertText('```\n', '\n```')} title="Code block" />
            <ToolBtn icon={Link2} onClick={() => insertText('[', '](url)')} title="Link" />
            <ToolBtn icon={Quote} onClick={() => insertAtLineStart('> ')} title="Blockquote" />
            <ToolBtn icon={Table} onClick={insertTable} title="Table" />
            <ToolBtn icon={Minus} onClick={() => insertText('\n---\n')} title="Horizontal rule" />
          </div>

          <ToolSep />

          {/* ── Tools ── */}
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolBtn icon={Sparkles} onClick={() => setShowSmartPasteModal(true)} title="Smart Paste" shortcut="⌘⇧V" />
            <ToolBtn icon={Braces} onClick={() => insertText('{{', '}}')} title="Insert variable" />
          </div>

          {/* Spacer */}
          <div className="flex-1 min-w-3" />

          {/* ── Actions ── */}
          <div className="flex items-center gap-0.5 shrink-0">
            <ToolBtn icon={copied ? CheckCheck : Copy} onClick={handleCopyAll} title="Copy all" active={copied} />
            <ToolBtn icon={Download} onClick={handleExport} title="Export .md" />
          </div>

          <ToolSep />

          {/* ── Magic Format CTA ── */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleMagicFormat}
            disabled={!value.trim()}
            className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-25 disabled:cursor-default border"
            style={{
              background: 'linear-gradient(135deg, var(--os-navy), color-mix(in srgb, var(--os-navy) 80%, var(--os-highlight)))',
              borderColor: 'color-mix(in srgb, var(--os-navy) 50%, transparent)',
              color: '#fff',
              boxShadow: '0 1px 6px -1px rgba(0,0,0,0.2)',
            }}
            title="Magic Format (⌘⇧F)"
          >
            <Wand2 size={12} strokeWidth={2.2} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Format</span>
            <span className="text-[8px] font-mono opacity-50 ml-0.5 hidden md:inline">⌘⇧F</span>
          </motion.button>
        </div>
      </div>
    );
  })();

  // ── Inline Magic Format FAB (always visible in write pane) ──────────
  const MagicFormatFab = value.trim() ? (
    <div className="absolute right-4 bottom-4 z-20 select-none">
      <motion.button
        initial={{ opacity: 0, y: 8, scale: 0.9 }}
        animate={{ 
          opacity: 1, y: 0, scale: 1,
          ...(formatFlash ? { boxShadow: ['0 4px 20px -4px rgba(0,0,0,0.25)', '0 0 24px 4px rgba(88,166,255,0.5)', '0 4px 20px -4px rgba(0,0,0,0.25)'] } : {}),
        }}
        exit={{ opacity: 0, y: 8, scale: 0.9 }}
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleMagicFormat}
        className="flex items-center gap-2 py-2 px-3.5 rounded-xl border cursor-pointer backdrop-blur-xl shadow-lg transition-colors duration-200"
        style={{
          background: formatFlash
            ? 'linear-gradient(135deg, #27AE60, #2ECC71)'
            : 'linear-gradient(135deg, var(--os-navy), color-mix(in srgb, var(--os-navy) 85%, var(--os-highlight)))',
          borderColor: formatFlash
            ? '#27AE60'
            : 'color-mix(in srgb, var(--os-navy) 50%, transparent)',
          color: '#fff',
          boxShadow: '0 4px 20px -4px rgba(0,0,0,0.25), 0 2px 6px -2px rgba(0,0,0,0.12)',
        }}
        title="Magic Format — auto-format entire document (⌘⇧F)"
      >
        {formatFlash ? (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Wand2 size={13} strokeWidth={2.2} />
          </motion.div>
        ) : (
          <Wand2 size={13} strokeWidth={2.2} />
        )}
        <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
          {formatFlash ? 'Done' : 'Format'}
        </span>
        {!formatFlash && (
          <span className="text-[9px] font-mono opacity-50 ml-0.5">
            ⌘⇧F
          </span>
        )}
      </motion.button>
    </div>
  ) : null;

  // ── Preview pane header ─────────────────────────────────────────────
  const PreviewPaneHeader = (
    <div 
      className="flex items-center gap-2 px-6 lg:px-10 py-2.5 border-b select-none shrink-0"
      style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}
    >
      <Eye size={11} style={{ color: 'var(--os-text-accent)' }} />
      <span className="text-[9px] font-mono font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--os-text-accent)' }}>
        Live Preview
      </span>
      <div className="h-px flex-1 ml-2" style={{ backgroundColor: 'var(--os-border)' }} />
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  return (
    <div className="h-full w-full relative flex flex-col">
      <SmartPasteModal 
         isOpen={showSmartPasteModal} 
         onClose={() => setShowSmartPasteModal(false)}
         onApply={handleSmartPasteApply}
         initialText={value}
         customRules={customRules}
         onCustomRulesChange={onCustomRulesChange}
      />
      
      <div className="editor-surface flex flex-col flex-1 overflow-hidden relative group transition-[border-color,box-shadow] duration-200">
        
        {/* ── Content Area ─────────────────────────────────────────── */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">

            {/* ═══ SPLIT VIEW (default) ═══════════════════════════════ */}
            {mode === 'split' && (
              <motion.div
                key="split"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full flex"
              >
                {/* ── Write Pane ──────────────────────────────────────── */}
                <div className="relative flex-1 h-full min-w-0">
                  {GuideOverlay}
                  {LineNumberGutter}
                  {WriteTextarea}
                  {/* Toolbar floats inside write pane → sits at the divider edge */}
                  {FloatingToolbar}
                  {MagicFormatFab}
                </div>

                {/* ── Divider ────────────────────────────────────────── */}
                <div 
                  className="w-px h-full relative shrink-0"
                  style={{ backgroundColor: 'var(--os-border)' }}
                >
                  {/* Decorative dots */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-10">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--os-text-secondary)', opacity: 0.3 }} />
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--os-text-secondary)', opacity: 0.3 }} />
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--os-text-secondary)', opacity: 0.3 }} />
                  </div>
                </div>

                {/* ── Preview Pane ────────────────────────────────────── */}
                <div 
                  className="flex-1 h-full min-w-0 flex flex-col overflow-hidden"
                  style={{ backgroundColor: 'var(--os-surface)' }}
                >
                  {PreviewPaneHeader}
                  <div className="flex-1 overflow-hidden">
                    {PreviewContent}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ WRITE ONLY ════════════════════════════════════════ */}
            {mode === 'write' && (
              <motion.div
                key="write"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full relative"
              >
                {GuideOverlay}
                {LineNumberGutter}
                {WriteTextarea}
                {FloatingToolbar}
                {MagicFormatFab}
              </motion.div>
            )}

            {/* ═══ PREVIEW ONLY ══════════════════════════════════════ */}
            {mode === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full relative flex flex-col"
              >
                {PreviewPaneHeader}
                <div className="flex-1 overflow-hidden">
                  {PreviewContent}
                </div>
                {/* Still show mode toggle in preview-only */}
                <div className="absolute right-3 top-3 z-20 select-none opacity-50 hover:opacity-100 transition-opacity duration-300">
                  <div className="backdrop-blur-sm rounded-xl p-1 border shadow-lg flex flex-col items-center gap-0.5" style={{ backgroundColor: 'var(--os-surface-elevated)', borderColor: 'var(--os-border)' }}>
                    <button
                      onClick={() => setMode('write')}
                      className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-(--os-hover-surface)"
                      style={{ color: 'var(--os-text-secondary)' }}
                      title="Write only"
                    >
                      <EditIcon size={13} />
                    </button>
                    <button 
                      onClick={() => setMode('split')}
                      className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-(--os-hover-surface)"
                      style={{ color: 'var(--os-text-secondary)' }}
                      title="Split view"
                    >
                      <Columns size={13} />
                    </button>
                    <button 
                      onClick={() => setMode('preview')}
                      className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 bg-(--os-navy) text-white shadow-sm"
                      title="Preview only"
                    >
                      <Eye size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── Editor Footer Bar ────────────────────────────────────── */}
        <div className="flex items-center justify-between px-4 py-1.5 border-t select-none shrink-0" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)', color: 'var(--os-text-secondary)' }}>
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-mono uppercase tracking-wider tabular-nums">
              {mode === 'write' ? 'Markdown' : mode === 'split' ? 'Split' : 'Preview'}
            </span>
            <div className="w-px h-3" style={{ backgroundColor: 'var(--os-border)' }} />
            <span className="text-[9px] font-mono tabular-nums">
              Ln {lineCount}
            </span>
            <span className="text-[9px] font-mono tabular-nums">
              {wordCount} words
            </span>
            <span className="text-[9px] font-mono tabular-nums opacity-60">
              {charCount.toLocaleString()} chars
            </span>

            {/* ── Grid Guide Toggle ────────────────────────────────── */}
            {mode !== 'preview' && (
              <div className="flex items-center">
                <div className="w-px h-3 mr-3" style={{ backgroundColor: 'var(--os-border)' }} />
                <div className="flex items-center rounded-md border overflow-hidden" style={{ borderColor: 'var(--os-border)' }}>
                  {([
                    { key: 'none' as GridGuide, icon: CircleOff, label: 'Off' },
                    { key: 'rows' as GridGuide, icon: AlignJustify, label: 'Rows' },
                    { key: 'lines' as GridGuide, icon: FileText, label: 'Lines' },
                    { key: 'page' as GridGuide, icon: FileText, label: 'Page' },
                    { key: 'grid' as GridGuide, icon: Grid3x3, label: 'Grid' },
                  ]).map((g) => {
                    const GIcon = g.icon;
                    const isActive = gridGuide === g.key;
                    return (
                      <button
                        key={g.key}
                        onClick={() => setGridGuide(g.key)}
                        className="flex items-center gap-1 px-1.5 py-0.5 transition-all duration-150 cursor-pointer"
                        style={{
                          backgroundColor: isActive ? 'var(--os-navy)' : 'transparent',
                          color: isActive ? '#fff' : 'var(--os-text-secondary)',
                        }}
                        title={`${g.label} guide`}
                      >
                        <GIcon size={9} strokeWidth={isActive ? 2.5 : 1.8} />
                        <span className="text-[8px] font-mono font-semibold uppercase tracking-wider">
                          {g.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {variables.length > 0 && (
              <span className="flex items-center gap-1 text-[9px] font-mono" style={{ color: 'var(--os-text-accent)' }}>
                <Braces size={9} />
                {variables.length} var{variables.length !== 1 ? 's' : ''}
              </span>
            )}
            <span className="hidden md:flex items-center gap-1 text-[9px] font-mono" style={{ color: 'var(--os-text-accent)' }}>
              <Wand2 size={9} />
              ⌘⇧F format
            </span>
            <span className="flex items-center gap-1 text-[9px] font-mono" style={{ color: 'var(--os-text-accent)' }}>
              <Keyboard size={9} />
              ⌘⇧V smart
            </span>
            <span className="hidden lg:flex items-center gap-1 text-[9px] font-mono opacity-50" style={{ color: 'var(--os-text-accent)' }}>
              Shift+V plain
            </span>
          </div>
        </div>

        {/* ── HUD Metrics Strip (integrated into editor module) ──── */}
        <div className="relative shrink-0 select-none border-t overflow-hidden" style={{ borderColor: 'var(--os-border)', backgroundColor: 'color-mix(in srgb, var(--os-surface-elevated) 90%, transparent)' }}>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-transparent pointer-events-none dark:from-white/5" />
          
          {/* Expand/Collapse Toggle */}
          <div className="absolute top-1 right-3 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setHudExpanded(!hudExpanded)}
              className="w-5 h-5 rounded-full border flex items-center justify-center transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--os-surface-elevated)', borderColor: 'var(--os-border)' }}
              title={hudExpanded ? 'Collapse metrics' : 'Expand metrics'}
            >
              <motion.div animate={{ rotate: hudExpanded ? 180 : 0 }}>
                <ChevronUp size={10} style={{ color: 'var(--os-text-secondary)' }} />
              </motion.div>
            </motion.button>
          </div>

          {/* Primary Metrics Row */}
          <div className="relative flex items-center justify-center flex-wrap gap-0 md:gap-1 px-2 md:px-4 py-1">
            <MetricItem
              value={hudMetrics.tokenCount}
              label="Tokens"
              icon={Zap}
              iconColor="text-violet-500"
              tooltip="Estimated token count (≈4 chars/token)"
            />
            <div className="hidden md:block"><HUDDivider /></div>
            <MetricItem
              value={wordCount}
              label="Words"
              icon={Type}
              iconColor="text-blue-500"
              tooltip="Total word count"
            />
            <div className="hidden md:block"><HUDDivider /></div>
            <MetricItem
              value={formatTime(hudMetrics.readingTimeMinutes)}
              label="Read Time"
              icon={Clock}
              iconColor="text-teal-500"
              tooltip={`~${AVERAGE_READING_WPM} words per minute`}
            />
            <div className="hidden md:block"><HUDDivider /></div>
            <MetricItem
              value={hudMetrics.buzzwordCount}
              label={hudMetrics.buzzwordSeverity.label}
              icon={hudMetrics.buzzwordCount > 0 ? AlertTriangle : Shield}
              iconColor={hudMetrics.buzzwordSeverity.color}
              warning={hudMetrics.buzzwordCount > 0}
              onClick={onBuzzwordClick}
              tooltip="Click to highlight buzzwords"
            />
            {status && (
              <div style={{ display: 'contents' }}>
                <div className="hidden md:block"><HUDDivider /></div>
                <StatusIndicator status={status} lastSaved={lastSaved} />
              </div>
            )}
          </div>

          {/* Expanded Metrics Row */}
          <AnimatePresence>
            {hudExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="overflow-hidden"
              >
                <div className="px-4 pt-1 pb-1" style={{ borderTop: '1px solid var(--os-border)' }}>
                  <div className="flex items-center justify-center gap-1">
                    <MetricItem
                      value={charCount}
                      label="Chars"
                      icon={Hash}
                      iconColor="text-indigo-400"
                      tooltip="Total character count"
                    />
                    <HUDDivider />
                    <MetricItem
                      value={hudMetrics.sentenceCount}
                      label="Sentences"
                      icon={FileText}
                      iconColor="text-sky-400"
                      tooltip="Number of sentences"
                    />
                    <HUDDivider />
                    <MetricItem
                      value={hudMetrics.paragraphCount}
                      label="Paragraphs"
                      icon={BookOpen}
                      iconColor="text-cyan-500"
                      tooltip="Number of paragraphs"
                    />
                    <HUDDivider />
                    <MetricItem
                      value={hudMetrics.avgWordsPerSentence}
                      label="Avg W/S"
                      icon={BarChart3}
                      iconColor="text-amber-400"
                      tooltip="Average words per sentence"
                    />
                    <HUDDivider />
                    <MetricItem
                      value={formatTime(hudMetrics.speakingTimeMinutes)}
                      label="Speak"
                      icon={Eye}
                      iconColor="text-rose-400"
                      tooltip={`~${AVERAGE_SPEAKING_WPM} words per minute`}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};