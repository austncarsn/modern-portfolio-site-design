import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { List, Hash, X, FileText } from 'lucide-react';

/* ============================================================================
 * Types
 * ========================================================================== */

interface Heading {
  level: number;
  text: string;
  line: number;
  index: number;
}

interface DocumentOutlineProps {
  content: string;
  isOpen: boolean;
  onClose: () => void;
  onJumpTo: (index: number, line: number) => void;
}

/* ============================================================================
 * Constants
 * ========================================================================== */

const PANEL_WIDTH = 240;

const SPRING = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 35,
};

const HEADING_REGEX = /^(#{1,6})\s+(.+)/;

/* ============================================================================
 * Helpers
 * ========================================================================== */

function extractHeadings(content: string): Heading[] {
  if (!content) return [];

  const lines = content.split('\n');
  const headings: Heading[] = [];
  let charIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(HEADING_REGEX);

    if (match) {
      const cleanText = match[2]
        .replace(/\[(.*?)\]\([^)]+\)/g, '$1') // markdown links
        .replace(/[`*_~]/g, '')               // inline formatting
        .replace(/<!?[^>]+>/g, '')            // simple HTML
        .trim();

      headings.push({
        level: match[1].length,
        text: cleanText,
        line: i + 1,
        index: charIndex,
      });
    }

    charIndex += line.length + 1;
  }

  return headings;
}

function headingTextClass(level: number): string {
  if (level === 1) {
    return 'text-[11px] font-bold text-(--os-text)';
  }
  if (level === 2) {
    return 'text-[11px] font-semibold text-(--os-text-secondary)';
  }
  return 'text-[10px] text-(--os-text-secondary) opacity-80';
}

/* ============================================================================
 * Component
 * ========================================================================== */

export const DocumentOutline: React.FC<DocumentOutlineProps> = ({
  content,
  isOpen,
  onClose,
  onJumpTo,
}) => {
  const headings = useMemo(() => extractHeadings(content), [content]);

  const minLevel = useMemo(
    () => (headings.length ? Math.min(...headings.map(h => h.level)) : 1),
    [headings]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="navigation"
          aria-label="Document outline"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: PANEL_WIDTH, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={SPRING}
          className="relative shrink-0 overflow-hidden"
        >
          {/* Left separator */}
          <div className="sidebar-separator absolute inset-y-0 left-0" />

          <div className="w-60 h-full flex flex-col bg-(--os-surface)">
            {/* ── Header ───────────────────────────────────────── */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-(--os-border)">
              <div className="flex items-center gap-2">
                <List
                  size={13}
                  strokeWidth={2}
                  className="text-(--os-text-accent)"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-(--os-text-secondary)">
                  Outline
                </span>

                {headings.length > 0 && (
                  <span
                    aria-hidden
                    className="px-1.5 py-0.5 rounded-md bg-[var(--os-hover)] text-[9px] font-bold tabular-nums text-[var(--os-text-accent)]"
                  >
                    {headings.length}
                  </span>
                )}
              </div>

              <motion.button
                onClick={onClose}
                aria-label="Close outline"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-lg text-(--os-text-secondary) hover:text-(--os-text) hover:bg-(--os-hover) transition-colors"
              >
                <X size={12} strokeWidth={2} />
              </motion.button>
            </header>

            {/* ── Headings List ───────────────────────────────── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 py-2">
              {headings.length > 0 ? (
                <div className="space-y-0.5">
                  {headings.map((heading, i) => {
                    const depth = heading.level - minLevel;

                    return (
                      <motion.button
                        key={`${heading.line}-${i}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(i * 0.03, 0.3) }}
                        onClick={() =>
                          onJumpTo(heading.index, heading.line)
                        }
                        aria-label={`Jump to ${heading.text}, line ${heading.line}`}
                        title={`Line ${heading.line}: ${heading.text}`}
                        className="group w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-all hover:bg-(--os-hover)"
                        style={{ paddingLeft: depth * 14 + 10 }}
                      >
                        {/* Level marker */}
                        <span className="shrink-0">
                          {heading.level <= 2 ? (
                            <Hash
                              size={10}
                              strokeWidth={2.5}
                              className="opacity-60 text-(--os-text-accent) group-hover:opacity-100 transition-opacity"
                            />
                          ) : (
                            <span className="block w-1.5 h-1.5 rounded-full bg-(--os-text-accent) opacity-40 group-hover:opacity-80 transition-opacity" />
                          )}
                        </span>

                        {/* Heading text */}
                        <span
                          className={`truncate leading-tight transition-colors group-hover:text-[var(--os-text)] ${headingTextClass(
                            heading.level
                          )}`}
                        >
                          {heading.text}
                        </span>

                        {/* Line number */}
                        <span className="ml-auto shrink-0 font-mono text-[8px] tabular-nums text-(--os-text-accent) opacity-0 group-hover:opacity-60 transition-opacity">
                          {heading.line}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-(--os-hover)">
                    <FileText
                      size={16}
                      strokeWidth={1.5}
                      className="opacity-50 text-(--os-text-accent)"
                    />
                  </div>

                  <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-(--os-text-secondary) opacity-60">
                    No Headings
                  </span>
                  <span className="text-[9px] text-(--os-text-accent) opacity-40">
                    Use # to create headings
                  </span>
                </div>
              )}
            </div>

            {/* ── Footer ──────────────────────────────────────── */}
            <footer className="border-t border-(--os-border) px-4 py-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[8px] uppercase tracking-widest text-(--os-text-accent) opacity-50">
                  Document Map
                </span>
                <span className="font-mono text-[8px] tabular-nums text-(--os-text-accent) opacity-40">
                  {headings.length} heading{headings.length !== 1 && 's'}
                </span>
              </div>
            </footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
