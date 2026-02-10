import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Check,
  ExternalLink,
  Quote,
  Bookmark,
  CircleDot,
  Info,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  Flame,
  Shield,
  Code,
  Terminal,
  FileJson,
  PenTool,
  Braces,
  Copy,
  CheckCheck,
  Hash,
  ChevronDown,
  Minus,
  Plus,
} from 'lucide-react';
import { copyToClipboard } from '../utils/helpers';

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/** Recursively extract plain text from React children (for slug generation). */
function extractText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node) && (node.props as any)?.children) {
    return extractText((node.props as any).children);
  }
  return '';
}

/** URL-safe slug from a heading string. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// ── Code Copy Button ────────────────────────────────────────────────────
const CodeCopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-white/10"
      style={{ color: copied ? '#3fb950' : 'rgba(255,255,255,0.5)' }}
    >
      {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

// ── Anchor Link (hover-visible # for headings) ─────────────────────────
const AnchorLink = ({ id }: { id: string }) => (
  <a
    href={`#${id}`}
    aria-label="Link to this section"
    className="ml-2 inline-flex items-center justify-center min-w-[28px] min-h-[28px] opacity-40 md:opacity-0 md:group-hover:opacity-60 hover:!opacity-100 transition-opacity text-[var(--os-text-faint)] hover:text-[var(--os-accent-deep)]"
  >
    <Hash size={14} />
  </a>
);

// ── Diff-aware line rendering ───────────────────────────────────────────
function classifyDiffLine(line: string) {
  if (line.startsWith('+') && !line.startsWith('+++')) return 'add' as const;
  if (line.startsWith('-') && !line.startsWith('---')) return 'del' as const;
  return 'ctx' as const;
}

const DIFF_STYLES = {
  add: 'bg-[#1b4332]/30',
  del: 'bg-[#5f2a2a]/25',
  ctx: '',
} as const;

const DIFF_GUTTER_ICON = {
  add: <Plus size={10} className="text-[#3fb950]" />,
  del: <Minus size={10} className="text-[#f85149]" />,
  ctx: null,
} as const;

const DIFF_LINE_COLOR = {
  add: 'text-[#3fb950]',
  del: 'text-[#f85149]',
  ctx: 'text-[#e6edf3]',
} as const;

// ── Language → Icon map (module-level, created once) ────────────────────
const LANGUAGE_ICONS: Record<string, React.ComponentType<any>> = {
  javascript: Code, js: Code, typescript: Code, ts: Code, jsx: Code, tsx: Code,
  python: Terminal, py: Terminal, bash: Terminal, shell: Terminal, sh: Terminal, zsh: Terminal,
  json: FileJson, yaml: FileJson, yml: FileJson, toml: FileJson,
  html: Code, xml: Code, css: PenTool, scss: PenTool, less: PenTool,
  diff: Code, patch: Code, sql: Terminal, graphql: Braces, go: Terminal,
  rust: Terminal, ruby: Terminal, rb: Terminal, java: Code, kotlin: Code,
  swift: Code, c: Code, cpp: Code, markdown: FileJson, md: FileJson,
  default: Code,
};

// ── Collapsible Code Block ──────────────────────────────────────────────
const COLLAPSE_THRESHOLD = 25;
const VISIBLE_LINES_COLLAPSED = 15;

interface CodeBlockProps {
  lang: string;
  content: string;
  isDiff: boolean;
}

const CodeBlock = React.memo(({ lang, content, isDiff }: CodeBlockProps) => {
  const lines = useMemo(() => content.split('\n'), [content]);
  const lineCount = lines.length;
  const isLong = lineCount > COLLAPSE_THRESHOLD;
  const [collapsed, setCollapsed] = useState(isLong);
  const gutterPad = String(lineCount).length;

  const LangIcon = LANGUAGE_ICONS[lang] || LANGUAGE_ICONS.default;
  const visibleLines = collapsed ? lines.slice(0, VISIBLE_LINES_COLLAPSED) : lines;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="my-8 rounded-2xl overflow-hidden border border-[var(--os-border)] shadow-lg group/code"
    >
      {/* ── Header bar ─────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] px-5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-inner" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-inner" />
            <div className="w-3 h-3 rounded-full bg-[#28ca42] shadow-inner" />
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <LangIcon size={14} className="text-[#5DADE2]" />
            <span className="text-[11px] font-mono font-bold text-[#AED6F1] uppercase tracking-widest">
              {lang}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 bg-white/5 rounded text-[9px] font-mono text-white/40">
            {lineCount} {lineCount === 1 ? 'line' : 'lines'}
          </div>
          <CodeCopyButton text={content} />
        </div>
      </div>

      {/* ── Code body with line-number gutter ───────────────── */}
      <div className="relative bg-[#0d1117]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }} role="presentation">
            <tbody>
              {visibleLines.map((line, i) => {
                const dt = isDiff ? classifyDiffLine(line) : ('ctx' as const);
                return (
                  <tr key={i} className={`${DIFF_STYLES[dt]} hover:bg-white/[0.03] transition-colors`}>
                    {/* Gutter */}
                    <td
                      className="select-none text-right align-top pr-3 pl-4 border-r border-white/[0.06] font-mono leading-6 text-white/20 sticky left-0 bg-[#0d1117]"
                      style={{
                        fontSize: 13,
                        minWidth: `${gutterPad + 2.5}ch`,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        paddingTop: 1,
                        paddingBottom: 1,
                      }}
                    >
                      {isDiff && DIFF_GUTTER_ICON[dt]
                        ? <span className="inline-flex items-center justify-end w-full h-6">{DIFF_GUTTER_ICON[dt]}</span>
                        : (i + 1)
                      }
                    </td>
                    {/* Code */}
                    <td
                      className={`pl-4 pr-6 font-mono leading-6 whitespace-pre ${isDiff ? DIFF_LINE_COLOR[dt] : 'text-[#e6edf3]'}`}
                      style={{
                        fontSize: 13,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        paddingTop: 1,
                        paddingBottom: 1,
                      }}
                    >
                      {line || '\u00A0'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Fade overlay sits above button, overlaps last code lines */}
        {isLong && collapsed && (
          <div
            className="absolute left-0 right-0 h-24 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/90 to-transparent pointer-events-none z-10"
            style={{ bottom: 0 }}
          />
        )}
      </div>

      {/* ── Expand / Collapse bar ──────────────────────────── */}
      {isLong && (
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="relative z-20 w-full py-2 flex items-center justify-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest text-white/40 hover:text-white/70 bg-[#0d1117] hover:bg-[#161b22] border-t border-white/[0.06] transition-colors"
        >
          <motion.span
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="inline-flex"
          >
            <ChevronDown size={14} />
          </motion.span>
          {collapsed ? `Show ${lineCount - VISIBLE_LINES_COLLAPSED} more lines` : 'Collapse'}
        </button>
      )}
    </motion.div>
  );
});
CodeBlock.displayName = 'CodeBlock';

// ═══════════════════════════════════════════════════════════════════════════
// CALLOUT SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

const CALLOUT_STYLES: Record<string, {
  gradient: string;
  border: string;
  icon: React.ComponentType<any>;
  iconBg: string;
  iconColor: string;
  titleColor: string;
  textColor: string;
}> = {
  NOTE: {
    gradient: 'from-blue-50 dark:from-[#0d1f3c] to-sky-50 dark:to-[#0d1f3c]',
    border: 'border-blue-400 dark:border-[#1f4a7a]',
    icon: Info,
    iconBg: 'bg-blue-100 dark:bg-[#0d1f3c]',
    iconColor: 'text-blue-600 dark:text-[#58a6ff]',
    titleColor: 'text-blue-700 dark:text-[#79c0ff]',
    textColor: 'text-blue-900 dark:text-[#a5d6ff]',
  },
  INFO: {
    gradient: 'from-cyan-50 dark:from-[#0d2028] to-blue-50 dark:to-[#0d1f3c]',
    border: 'border-cyan-400 dark:border-[#1a4a5a]',
    icon: MessageSquare,
    iconBg: 'bg-cyan-100 dark:bg-[#0d2028]',
    iconColor: 'text-cyan-600 dark:text-[#56d4dd]',
    titleColor: 'text-cyan-700 dark:text-[#76d9e6]',
    textColor: 'text-cyan-900 dark:text-[#a5e8f0]',
  },
  WARNING: {
    gradient: 'from-amber-50 dark:from-[#2d2010] to-yellow-50 dark:to-[#2d2010]',
    border: 'border-amber-400 dark:border-[#5f4b1f]',
    icon: AlertTriangle,
    iconBg: 'bg-amber-100 dark:bg-[#3d2c10]',
    iconColor: 'text-amber-600 dark:text-[#d29922]',
    titleColor: 'text-amber-700 dark:text-[#e3b341]',
    textColor: 'text-amber-900 dark:text-[#f0c674]',
  },
  TIP: {
    gradient: 'from-emerald-50 dark:from-[#071f14] to-green-50 dark:to-[#071f14]',
    border: 'border-emerald-400 dark:border-[#1a4d2a]',
    icon: Lightbulb,
    iconBg: 'bg-emerald-100 dark:bg-[#0f2e1c]',
    iconColor: 'text-emerald-600 dark:text-[#3fb950]',
    titleColor: 'text-emerald-700 dark:text-[#56d364]',
    textColor: 'text-emerald-900 dark:text-[#7ee787]',
  },
  IMPORTANT: {
    gradient: 'from-violet-50 dark:from-[#1a1230] to-purple-50 dark:to-[#1e1435]',
    border: 'border-violet-400 dark:border-[#3b2d5f]',
    icon: Flame,
    iconBg: 'bg-violet-100 dark:bg-[#1e1435]',
    iconColor: 'text-violet-600 dark:text-[#bc8cff]',
    titleColor: 'text-violet-700 dark:text-[#d2a8ff]',
    textColor: 'text-violet-900 dark:text-[#d2a8ff]',
  },
  CAUTION: {
    gradient: 'from-rose-50 dark:from-[#2d1318] to-red-50 dark:to-[#2d1318]',
    border: 'border-rose-400 dark:border-[#5f2a2a]',
    icon: Shield,
    iconBg: 'bg-rose-100 dark:bg-[#2d1318]',
    iconColor: 'text-rose-600 dark:text-[#ffa198]',
    titleColor: 'text-rose-700 dark:text-[#ffbdb6]',
    textColor: 'text-rose-900 dark:text-[#ffa198]',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// MARKDOWN COMPONENTS
// All structural colors use --os-* CSS variables for automatic dark mode.
// Callouts & semantic badges use inline dark: variants per-type.
// Headers emit `id` attributes for Document Outline anchor-linking.
// ═══════════════════════════════════════════════════════════════════════════

export const markdownComponents = {
  // ═══════════════════════════════════════════════════════════════════════════
  // HEADERS — Visual hierarchy with anchor IDs for outline navigation
  // ═══════════════════════════════════════════════════════════════════════════
  h1: ({ children, ...props }: any) => {
    const text = extractText(children);
    const id = slugify(text);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        className="relative mb-10 pb-6 group"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[var(--os-navy)] to-[var(--os-accent-deep)]" />
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[var(--os-sky)] to-[#85C1E9]" />
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-[var(--os-accent-mist)] to-[var(--os-hover-accent)]" />
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-[var(--os-navy)]/20 to-transparent" />
        </div>

        <h1
          id={id}
          className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1B4F72] via-[#21618C] to-[var(--os-accent-deep)] dark:from-[#58a6ff] dark:via-[#79c0ff] dark:to-[#58a6ff] tracking-tight leading-tight scroll-mt-24 flex items-center"
          {...props}
        >
          {children}
          <AnchorLink id={id} />
        </h1>

        <div className="mt-4 flex items-center gap-2">
          <div className="h-1 w-16 bg-gradient-to-r from-[var(--os-navy)] to-[var(--os-sky)] rounded-full" />
          <div className="h-1 w-8 bg-gradient-to-r from-[var(--os-sky)] to-[var(--os-accent-mist)] rounded-full" />
          <div className="h-1 w-4 bg-[var(--os-hover-accent)] rounded-full" />
        </div>
      </motion.div>
    );
  },

  h2: ({ children, ...props }: any) => {
    const text = extractText(children);
    const id = slugify(text);
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        className="relative mt-12 mb-6 group"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--os-hover)] to-[var(--os-hover-accent)] flex items-center justify-center shadow-sm border border-[var(--os-accent-mist)]/30">
              <div className="w-3 h-3 rounded-md bg-gradient-to-br from-[#334E68] to-[#2874A6]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[var(--os-sky)] rounded-full opacity-60" />
          </div>

          <div className="flex-1">
            <h2
              id={id}
              className="text-xl font-bold text-[var(--os-accent-deep)] tracking-tight leading-snug scroll-mt-24 flex items-center"
              {...props}
            >
              {children}
              <AnchorLink id={id} />
            </h2>
            <div className="mt-2 h-0.5 w-24 bg-gradient-to-r from-[var(--os-sky)] via-[var(--os-accent-mist)] to-transparent rounded-full" />
          </div>
        </div>
      </motion.div>
    );
  },

  h3: ({ children, ...props }: any) => {
    const text = extractText(children);
    const id = slugify(text);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        className="mt-8 mb-4 group"
      >
        <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[var(--os-hover)] via-[var(--os-hover)] to-transparent pl-4 pr-6 py-2.5 rounded-r-full border-l-4 border-[var(--os-accent-deep)]">
          <Bookmark size={14} className="text-[var(--os-accent-deep)]" strokeWidth={2.5} />
          <h3
            id={id}
            className="text-sm font-bold text-[var(--os-accent-deep)] uppercase tracking-widest scroll-mt-24 flex items-center"
            {...props}
          >
            {children}
            <AnchorLink id={id} />
          </h3>
        </div>
      </motion.div>
    );
  },

  h4: ({ children, ...props }: any) => {
    const text = extractText(children);
    const id = slugify(text);
    return (
      <h4
        id={id}
        className="mt-6 mb-3 text-xs font-bold text-[var(--os-sky)] uppercase tracking-[0.2em] flex items-center gap-2 scroll-mt-24 group"
        {...props}
      >
        <CircleDot size={10} className="text-[var(--os-text-accent)]" />
        {children}
        <AnchorLink id={id} />
      </h4>
    );
  },

  h5: ({ children, ...props }: any) => {
    const text = extractText(children);
    const id = slugify(text);
    return (
      <h5
        id={id}
        className="mt-4 mb-2 text-xs font-semibold text-[var(--os-text-secondary)] tracking-wide scroll-mt-24"
        {...props}
      >
        {children}
      </h5>
    );
  },

  h6: ({ children, ...props }: any) => {
    const text = extractText(children);
    const id = slugify(text);
    return (
      <h6
        id={id}
        className="mt-3 mb-2 text-[11px] font-medium text-[var(--os-text-faint)] uppercase tracking-widest scroll-mt-24"
        {...props}
      >
        {children}
      </h6>
    );
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PARAGRAPH — Readability-optimized with callout detection
  // ═══════════════════════════════════════════════════════════════════════════
  p: ({ children, ...props }: any) => {
    const content = String(children);

    // Callout detection: [!NOTE], [!WARNING], [!TIP], etc.
    const calloutMatch = content.match(/^\[!(NOTE|WARNING|TIP|IMPORTANT|CAUTION|INFO)\]\s*(.*)/i);
    if (calloutMatch) {
      const [, type, text] = calloutMatch;
      const style = CALLOUT_STYLES[type.toUpperCase()] || CALLOUT_STYLES.NOTE;
      const IconComponent = style.icon;

      return (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          className={`my-6 bg-gradient-to-r ${style.gradient} border-l-4 ${style.border} rounded-r-xl overflow-hidden shadow-sm`}
        >
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className={`p-2.5 ${style.iconBg} rounded-xl shrink-0 shadow-sm`}>
                <IconComponent size={18} className={style.iconColor} strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-bold uppercase tracking-widest ${style.titleColor} mb-2 flex items-center gap-2`}>
                  {type}
                  <div className={`h-px flex-1 ${style.iconBg}`} />
                </div>
                <div className={`text-sm leading-relaxed ${style.textColor}`}>
                  {text}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <p
        className="mb-5 leading-[1.85] text-[var(--os-text)] text-[15px] tracking-[0.01em]"
        style={{ textRendering: 'optimizeLegibility' }}
        {...props}
      >
        {children}
      </p>
    );
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CODE — Premium code blocks with line numbers, diff support, collapsible
  // ═══════════════════════════════════════════════════════════════════════════
  code: ({ inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const content = String(children).replace(/\n$/, '');

    // Fenced code block
    if (!inline && match) {
      const lang = match[1].toLowerCase();
      const isDiff = lang === 'diff' || lang === 'patch';
      return <CodeBlock lang={lang} content={content} isDiff={isDiff} />;
    }

    // Inline variable badge: {{var_name}}
    if (inline) {
      const isVariable = /^\{\{.*\}\}$/.test(content);
      if (isVariable) {
        return (
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-100 to-violet-100 dark:from-[#2d1b4e] dark:to-[#1a1230] text-purple-700 dark:text-[#d2a8ff] px-3 py-1 rounded-full text-[13px] font-mono font-medium border border-purple-200/50 dark:border-[#553c9a50] mx-1 shadow-sm dark:shadow-none group/var cursor-default">
            <Braces size={12} className="text-purple-500 dark:text-[#bc8cff] group-hover/var:rotate-12 transition-transform" />
            {content}
          </span>
        );
      }

      // Regular inline code
      return (
        <code
          className="bg-gradient-to-r from-[var(--os-surface-muted)] to-[var(--os-surface-soft)] text-[#d63384] dark:text-[#f97583] px-2 py-0.5 rounded-md text-[13px] font-mono font-medium border border-[var(--os-border)]/50 mx-0.5"
          {...props}
        >
          {children}
        </code>
      );
    }

    // Fallback
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  pre: ({ children }: any) => <div className="contents">{children}</div>,

  // ═══════════════════════════════════════════════════════════════════════════
  // LISTS — Styled bullets/numbers with checkbox support
  // ═══════════════════════════════════════════════════════════════════════════
  ul: ({ children, ...props }: any) => (
    <ul className="my-6 space-y-3" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="my-6 space-y-3 counter-reset-item" {...props}>{children}</ol>
  ),
  li: ({ children, ordered, index, ...props }: any) => {
    const isCheckbox = React.Children.toArray(children).some(
      (child: any) => typeof child === 'object' && child?.props?.type === 'checkbox'
    );
    if (isCheckbox) {
      return (
        <li className="flex items-start gap-3 text-[var(--os-text)] leading-relaxed group" {...props}>
          {children}
        </li>
      );
    }
    return (
      <li className="flex items-start gap-4 text-[var(--os-text)] leading-relaxed group" {...props}>
        {ordered ? (
          <span className="flex items-center justify-center min-w-[28px] h-7 bg-gradient-to-br from-[#334E68] to-[#2874A6] text-white text-xs font-bold rounded-lg mt-0.5 shadow-sm">
            {(typeof index === 'number' ? index : 0) + 1}
          </span>
        ) : (
          <div className="flex items-center justify-center min-w-[8px] mt-2.5">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[var(--os-sky)] to-[var(--os-accent-deep)] shadow-sm group-hover:scale-125 transition-transform" />
          </div>
        )}
        <div className="flex-1 pt-0.5">{children}</div>
      </li>
    );
  },

  input: ({ type, checked, ...props }: any) => {
    if (type === 'checkbox') {
      return (
        <span
          className={`inline-flex items-center justify-center w-5 h-5 rounded-md border-2 mr-3 mt-0.5 transition-all ${
            checked
              ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-500 shadow-sm'
              : 'bg-[var(--os-surface-elevated)] border-[var(--os-border)] hover:border-[var(--os-sky)]'
          }`}
        >
          {checked && <Check size={12} className="text-white" strokeWidth={3} />}
        </span>
      );
    }
    return <input type={type} {...props} />;
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LINKS
  // ═══════════════════════════════════════════════════════════════════════════
  a: ({ children, href, ...props }: any) => (
    <a
      href={href}
      className="inline-flex items-center gap-1 text-[var(--os-accent-deep)] font-semibold border-b-2 border-[var(--os-accent-mist)] hover:border-[var(--os-accent-deep)] hover:bg-[var(--os-hover)] transition-all px-0.5 py-0.5 rounded-sm group"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // BLOCKQUOTE — Gradient sidebar with semantic icon
  // ═══════════════════════════════════════════════════════════════════════════
  blockquote: ({ children, ...props }: any) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      className="my-8 relative"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#334E68] via-[var(--os-sky)] to-[var(--os-accent-mist)] rounded-full" />
      <div className="pl-8 pr-6 py-4 bg-gradient-to-r from-[var(--os-surface)] via-[var(--os-surface-soft)] to-transparent rounded-r-xl">
        <Quote
          size={24}
          className="absolute left-4 top-4 text-[var(--os-accent-mist)] opacity-50"
          strokeWidth={1.5}
        />
        <div className="relative italic text-[var(--os-text-secondary)] text-[15px] leading-relaxed font-serif">
          {children}
        </div>
      </div>
    </motion.div>
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // HORIZONTAL RULE — Three-dot separator
  // ═══════════════════════════════════════════════════════════════════════════
  hr: () => (
    <div className="my-10 flex items-center gap-4" role="separator">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--os-border)] to-transparent" />
      <div className="flex gap-2">
        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[var(--os-navy)] to-[var(--os-sky)]" />
        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[var(--os-sky)] to-[var(--os-accent-mist)]" />
        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[var(--os-accent-mist)] to-[var(--os-hover-accent)]" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--os-border)] to-transparent" />
    </div>
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // TABLE — Data grid with column dividers, row striping, sticky header
  // ═══════════════════════════════════════════════════════════════════════════
  table: ({ children, ...props }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      className="my-8 rounded-xl overflow-hidden border border-[var(--os-border)] shadow-lg"
    >
      {/* Scroll fade hints for wide tables */}
      <div className="relative group/table">
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--os-surface-elevated)] to-transparent pointer-events-none z-10 opacity-0 group-hover/table:opacity-100 transition-opacity" />
        <div className="overflow-x-auto custom-scrollbar">
          <table
            className="w-full text-sm"
            style={{ borderCollapse: 'separate', borderSpacing: 0 }}
            {...props}
          >
            {children}
          </table>
        </div>
      </div>
    </motion.div>
  ),

  thead: ({ children, ...props }: any) => (
    <thead
      className="sticky top-0 z-10"
      style={{
        background: 'linear-gradient(135deg, #334E68 0%, #2874A6 50%, #334E68 100%)',
      }}
      {...props}
    >
      {children}
    </thead>
  ),

  tbody: ({ children, ...props }: any) => (
    <tbody className="bg-[var(--os-surface-elevated)]" {...props}>
      {children}
    </tbody>
  ),

  tr: ({ children, isHeader, ...props }: any) => (
    <tr
      className="border-b border-[var(--os-border)]/50 transition-colors duration-150 hover:bg-[var(--os-hover)] even:bg-[var(--os-surface-soft)]/40"
      {...props}
    >
      {children}
    </tr>
  ),

  th: ({ children, style, ...props }: any) => (
    <th
      className="px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-white/90 whitespace-nowrap border-r border-white/[0.08] last:border-r-0 text-left"
      style={style}
      {...props}
    >
      <div className="flex items-center gap-1.5">
        {children}
      </div>
    </th>
  ),

  td: ({ children, style, ...props }: any) => (
    <td
      className="px-5 py-3.5 text-[var(--os-text)] text-[13px] leading-relaxed border-r border-[var(--os-border)]/30 last:border-r-0 transition-colors"
      style={style}
      {...props}
    >
      {children}
    </td>
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // TEXT FORMATTING
  // ═══════════════════════════════════════════════════════════════════════════
  strong: ({ children, ...props }: any) => (
    <strong className="font-bold text-[var(--os-text)]" {...props}>{children}</strong>
  ),
  em: ({ children, ...props }: any) => (
    <em className="italic text-[var(--os-text-secondary)] font-serif" {...props}>{children}</em>
  ),
  del: ({ children, ...props }: any) => (
    <del className="text-[var(--os-text-faint)] line-through decoration-2 decoration-[var(--os-text-faint)]/40" {...props}>
      {children}
    </del>
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // IMAGE — Lazy loading with caption support
  // ═══════════════════════════════════════════════════════════════════════════
  img: ({ src, alt, ...props }: any) => (
    <figure className="my-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-30px' }}
        className="rounded-xl overflow-hidden border border-[var(--os-border)] shadow-lg"
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-auto transition-transform duration-500 hover:scale-[1.02]"
          {...props}
        />
      </motion.div>
      {alt && (
        <figcaption className="mt-3 text-center text-xs text-[var(--os-text-faint)] italic flex items-center justify-center gap-1.5">
          <span className="w-4 h-px bg-[var(--os-border)]" />
          {alt}
          <span className="w-4 h-px bg-[var(--os-border)]" />
        </figcaption>
      )}
    </figure>
  ),

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL ELEMENTS — kbd, mark, sup, sub
  // ═══════════════════════════════════════════════════════════════════════════

  /** Keyboard shortcut badge — renders as a physical key cap. */
  kbd: ({ children, ...props }: any) => (
    <kbd
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-bold text-[var(--os-text-dim)] bg-gradient-to-b from-[var(--os-surface-elevated)] to-[var(--os-surface-muted)] border border-[var(--os-border)] shadow-[0_2px_0_var(--os-border)] translate-y-[-1px] active:translate-y-0 active:shadow-none transition-all mx-0.5 select-none"
      {...props}
    >
      {children}
    </kbd>
  ),

  /** Highlighted / marked text. */
  mark: ({ children, ...props }: any) => (
    <mark
      className="bg-yellow-200/60 dark:bg-yellow-500/20 text-[var(--os-text)] px-1 py-0.5 rounded-sm"
      {...props}
    >
      {children}
    </mark>
  ),

  /** Superscript (footnote references, etc.) */
  sup: ({ children, ...props }: any) => (
    <sup
      className="text-[10px] font-bold text-[var(--os-accent-deep)] ml-0.5"
      {...props}
    >
      {children}
    </sup>
  ),

  /** Subscript */
  sub: ({ children, ...props }: any) => (
    <sub
      className="text-[10px] text-[var(--os-text-secondary)] ml-0.5"
      {...props}
    >
      {children}
    </sub>
  ),
};