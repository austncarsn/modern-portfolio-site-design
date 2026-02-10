import React, { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { X, Copy, Check, Heart, Hash, ChevronDown, Zap, Brain, Paperclip, CheckCircle2, FileCode2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Prompt } from "./prompt-data";
import { getCategoryColor, getCategoryLabel, type CategoryColor } from "./category-colors";
import { promptToMarkdown, MarkdownRenderer } from "./markdown-utils";

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter((el) => {
    const style = window.getComputedStyle(el);
    return style.visibility !== "hidden" && style.display !== "none" && !el.hasAttribute("disabled");
  });
}

function legacyCopyToClipboard(text: string): boolean {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "-9999px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus({ preventScroll: true });
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

function useClipboard(options?: { resetDurationMs?: number }) {
  const resetMs = options?.resetDurationMs ?? 2200;
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const resetCopied = useCallback(() => setCopied(false), []);

  const copyToClipboard = useCallback(async (text: string) => {
    let success = false;
    try {
      if (window.isSecureContext && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        success = true;
      } else {
        success = legacyCopyToClipboard(text);
      }
    } catch {
      success = legacyCopyToClipboard(text);
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    setCopied(success);
    if (success) timerRef.current = setTimeout(() => setCopied(false), resetMs);
  }, [resetMs]);

  return { copied, copyToClipboard, resetCopied };
}

interface ModalLifecycleParams {
  isOpen: boolean;
  onClose: () => void;
  dialogRef: React.RefObject<HTMLElement | null>;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

function useModalLifecycle({ isOpen, onClose, dialogRef, initialFocusRef }: ModalLifecycleParams) {
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    restoreFocusRef.current = (document.activeElement as HTMLElement) ?? null;
    const body = document.body;
    const orig = body.style.overflow;
    body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = getFocusableElements(dialog);
      if (!focusable.length) { e.preventDefault(); return; }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (!active || active === first || !dialog.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (!active || active === last || !dialog.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });

    const raf = requestAnimationFrame(() => {
      const preferred = initialFocusRef?.current;
      if (preferred) { preferred.focus(); return; }
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = getFocusableElements(dialog);
      (focusable[0] ?? dialog)?.focus?.();
    });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", handleKeyDown, { capture: true } as EventListenerOptions);
      body.style.overflow = orig;
      restoreFocusRef.current?.focus?.();
      restoreFocusRef.current = null;
    };
  }, [isOpen, onClose, dialogRef, initialFocusRef]);
}

const TagList = memo(({ tags }: { tags: readonly string[] }) => (
  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8">
    {tags.map((tag, idx) => <span key={`${tag}-${idx}`} className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 sm:px-2 py-0.5 sm:py-1 uppercase tracking-wider select-none bg-background/50">{tag}</span>)}
  </div>
));
TagList.displayName = "TagList";

const MobileHeader = memo(({ onClose, colors }: { onClose: () => void; colors: CategoryColor }) => (
  <div className="flex sm:hidden items-center justify-between px-4 py-3 border-b border-border bg-card flex-shrink-0 z-10">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent }} />
      <span className="text-xs text-muted-foreground uppercase tracking-[0.14em]" style={{ fontFamily: "var(--font-body)" }}>Prompt Detail</span>
    </div>
    <button onClick={onClose} className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close modal"><X className="w-5 h-5" strokeWidth={1.5} /></button>
  </div>
));
MobileHeader.displayName = "MobileHeader";

const GlobalCopyToast = memo(({ copied }: { copied: boolean }) => (
  <AnimatePresence>
    {copied && (
      <motion.div initial={{ y: -80, opacity: 0, scale: 0.92 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -80, opacity: 0, scale: 0.92 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }} className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[1100] pointer-events-none"
      >
        <div className="relative flex items-center gap-3 text-white pl-4 pr-5 py-3 shadow-2xl border" style={{ backgroundColor: "#5A8A7A", boxShadow: "0 25px 50px -12px rgba(90,138,122,0.25)", borderColor: "rgba(90,138,122,0.3)" }}>
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 520, damping: 14, delay: 0.08 }}>
            <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
          </motion.div>
          <span className="text-sm font-medium tracking-wide whitespace-nowrap">Prompt copied to clipboard!</span>
          <motion.div className="absolute bottom-0 left-0 h-[2px] bg-white/40" initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 2.2, ease: "linear" }} />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
));
GlobalCopyToast.displayName = "GlobalCopyToast";

interface InfoPanelProps { prompt: Prompt; titleId: string; isFavorite: boolean; colors: CategoryColor; copied: boolean; onToggleFavorite: (id: number) => void; onCopy: () => void; }

const InfoPanel = memo(({ prompt, titleId, isFavorite, colors, copied, onToggleFavorite, onCopy }: InfoPanelProps) => {
  const effort = colors.effort || null;
  const thinkingAdaptive = colors.thinking === "adaptive";
  const attachments = Array.isArray(colors.attachments) ? colors.attachments : [];
  return (
    <div className="max-h-[45dvh] sm:max-h-none border-b sm:border-b-0 sm:border-r border-border bg-card relative flex flex-col min-h-0">
      <div className="absolute top-0 left-0 w-full h-[2px] hidden sm:block" style={{ backgroundColor: colors.accent }} />
      <div className="p-5 sm:p-8 flex-1 min-h-0 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div className="flex justify-between items-start mb-6 sm:mb-10">
          <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground border border-border px-2 py-1 select-none"><Hash className="w-3 h-3" />{String(prompt.id).padStart(3,"0")}</span>
          <button onClick={() => onToggleFavorite(prompt.id)} className="text-muted-foreground/60 hover:text-foreground transition-colors p-2 -mr-2" aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}>
            <Heart className={`w-5 h-5 transition-colors ${isFavorite ? "fill-foreground text-foreground" : ""}`} strokeWidth={1.5} />
          </button>
        </div>
        <div className="mb-2">
          <span className="text-xs uppercase tracking-[0.14em] mb-2 block" style={{ color: colors.accent, fontFamily: "var(--font-body)" }}>{getCategoryLabel(prompt.category)}</span>
          <h2 id={titleId} className="text-2xl sm:text-3xl md:text-4xl text-foreground leading-tight mb-4 sm:mb-6 tracking-tight" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>{prompt.title}</h2>
        </div>
        <p className="text-muted-foreground font-light leading-relaxed mb-6 sm:mb-8 text-sm" style={{ fontFamily: "var(--font-body)" }}>{prompt.description}</p>
        {(effort || thinkingAdaptive || attachments.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
            {effort && <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider border border-border px-2 py-1 text-muted-foreground bg-background/50"><Zap className="w-3 h-3" strokeWidth={1.5} />Effort: {effort}</span>}
            {thinkingAdaptive && <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider border border-border px-2 py-1 text-muted-foreground bg-background/50"><Brain className="w-3 h-3" strokeWidth={1.5} />Adaptive Thinking</span>}
            {attachments.map((att, idx) => <span key={`${att}-${idx}`} className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider border border-border px-2 py-1 text-muted-foreground bg-background/50"><Paperclip className="w-3 h-3" strokeWidth={1.5} />{att}</span>)}
          </div>
        )}
        <TagList tags={prompt.tags} />
      </div>
      <div className="p-4 sm:p-8 border-t border-border bg-card relative overflow-hidden flex-shrink-0">
        <AnimatePresence>{copied && <motion.div initial={{ scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} exit={{ scaleY: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.16,1,0.3,1] }} className="absolute inset-0 origin-bottom pointer-events-none" style={{ backgroundColor: "rgba(90,138,122,0.1)" }} />}</AnimatePresence>
        <button onClick={onCopy}
          className={`relative w-full py-3.5 sm:py-4 font-medium tracking-wide active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase text-xs ${copied ? "text-white ring-2 ring-offset-2 ring-offset-card" : "bg-primary text-primary-foreground hover:opacity-90"}`}
          style={copied ? { backgroundColor: "#5A8A7A", ringColor: "rgba(90,138,122,0.5)" } as React.CSSProperties : undefined}
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            {copied ? <motion.span key="ci" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} transition={{ type: "spring", stiffness: 420, damping: 16 }}><Check className="w-5 h-5" strokeWidth={3} /></motion.span>
              : <motion.span key="coi" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }} transition={{ duration: 0.14 }}><Copy className="w-4 h-4" /></motion.span>}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {copied ? <motion.span key="ct" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="font-semibold tracking-widest">Copied!</motion.span>
              : <motion.span key="cot" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>Copy Prompt</motion.span>}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
});
InfoPanel.displayName = "InfoPanel";

type ViewFormat = "raw" | "markdown";

const FormatToggle = memo(({ format, onFormatChange }: { format: ViewFormat; onFormatChange: (f: ViewFormat) => void }) => (
  <div className="flex items-center border border-border bg-background/50">
    <button onClick={() => onFormatChange("raw")} className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all ${format === "raw" ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"}`} aria-pressed={format === "raw"}>
      <FileCode2 className="w-3 h-3" strokeWidth={1.5} />Raw
    </button>
    <div className="w-px h-4 bg-border" />
    <button onClick={() => onFormatChange("markdown")} className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all ${format === "markdown" ? "bg-foreground/[0.07] text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"}`} aria-pressed={format === "markdown"}>
      <FileText className="w-3 h-3" strokeWidth={1.5} />Markdown
    </button>
  </div>
));
FormatToggle.displayName = "FormatToggle";

const CodePanel = memo(({ prompt, copied, onCopy, onClose, closeButtonRef, format, onFormatChange, markdownSource, accentColor }: {
  prompt: Prompt; copied: boolean; onCopy: () => void; onClose: () => void; closeButtonRef: React.RefObject<HTMLButtonElement | null>;
  format: ViewFormat; onFormatChange: (f: ViewFormat) => void; markdownSource: string; accentColor?: string;
}) => (
  <div className="flex-1 bg-secondary/30 relative flex flex-col min-h-0">
    <div className="absolute top-0 right-0 p-4 sm:p-6 z-10 hidden sm:block">
      <button ref={closeButtonRef} onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-foreground/5" aria-label="Close modal">
        <X className="w-6 h-6" strokeWidth={1} />
      </button>
    </div>
    <div className="flex items-center justify-between gap-2 px-5 sm:px-8 md:px-12 pt-4 sm:pt-6 pb-2">
      <div className="flex items-center gap-3 min-w-0">
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/40 sm:hidden flex-shrink-0" />
        <FormatToggle format={format} onFormatChange={onFormatChange} />
      </div>
    </div>
    <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-8 md:px-12 pb-5 sm:pb-8 md:pb-12 overscroll-contain">
      <AnimatePresence mode="wait">
        {format === "raw" ? (
          <motion.div key="raw" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.15 }}>
            <pre className="font-mono text-[13px] sm:text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap break-words"><code>{prompt.prompt ?? ""}</code></pre>
          </motion.div>
        ) : (
          <motion.div key="markdown" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.15 }}>
            <MarkdownRenderer source={markdownSource} accentColor={accentColor} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
));
CodePanel.displayName = "CodePanel";

export function PromptModal({ prompt, onClose, isFavorite, onToggleFavorite }: { prompt: Prompt | null; onClose: () => void; isFavorite: boolean; onToggleFavorite: (id: number) => void }) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const desktopCloseRef = useRef<HTMLButtonElement | null>(null);
  const [viewFormat, setViewFormat] = useState<ViewFormat>("raw");
  const { copied, copyToClipboard, resetCopied } = useClipboard({ resetDurationMs: 2200 });

  useEffect(() => { resetCopied(); setViewFormat("raw"); }, [prompt?.id, resetCopied]);

  const isOpen = !!prompt;
  useModalLifecycle({ isOpen, onClose, dialogRef, initialFocusRef: desktopCloseRef });

  const handleOverlayPointerDown = useCallback((e: React.PointerEvent) => { if (e.target === e.currentTarget) onClose(); }, [onClose]);

  const colors = useMemo<CategoryColor>(() => prompt ? getCategoryColor(prompt.category) : getCategoryColor("foundation"), [prompt]);
  const markdownSource = useMemo(() => prompt ? promptToMarkdown(prompt, colors) : "", [prompt, colors]);
  const handleCopy = useCallback(() => {
    if (!prompt) return;
    copyToClipboard(viewFormat === "markdown" ? markdownSource : prompt.prompt ?? "");
  }, [prompt, viewFormat, markdownSource, copyToClipboard]);

  if (!prompt) return null;

  return (
    <motion.div role="dialog" aria-modal="true" aria-labelledby={titleId}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-6 md:p-8 bg-foreground/15 sm:bg-background/80 backdrop-blur-md sm:backdrop-blur-lg"
      onPointerDown={handleOverlayPointerDown}
    >
      <GlobalCopyToast copied={copied} />
      <motion.div ref={dialogRef} tabIndex={-1}
        initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="w-full sm:max-w-5xl max-h-[94dvh] sm:max-h-[calc(100dvh-48px)] md:max-h-[calc(100dvh-64px)] flex flex-col bg-card border-t sm:border border-border shadow-2xl overflow-hidden rounded-t-xl sm:rounded-sm focus:outline-none"
      >
        <MobileHeader onClose={onClose} colors={colors} />
        {/* Panels wrapper: stacked on mobile, side-by-side grid on desktop.
            CSS grid gives both children a definite height from the row track,
            which makes overflow-y: auto work reliably. */}
        <div className="flex-1 min-h-0 flex flex-col sm:grid sm:grid-cols-[360px_minmax(0,1fr)] md:grid-cols-[400px_minmax(0,1fr)] sm:grid-rows-[minmax(0,1fr)]">
          <InfoPanel prompt={prompt} titleId={titleId} isFavorite={isFavorite} colors={colors} copied={copied} onToggleFavorite={onToggleFavorite} onCopy={handleCopy} />
          <CodePanel prompt={prompt} copied={copied} onCopy={handleCopy} onClose={onClose} closeButtonRef={desktopCloseRef} format={viewFormat} onFormatChange={setViewFormat} markdownSource={markdownSource} accentColor={colors.accent} />
        </div>
      </motion.div>
    </motion.div>
  );
}