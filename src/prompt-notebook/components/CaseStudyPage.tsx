import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Code, Palette, Keyboard, Wand2, Layout as LayoutIcon, Eye,
  Layers, Database, Sparkles, Shield, Zap, FileText,
  Command, List, Moon, BarChart3, GitBranch,
  ArrowRight, ExternalLink,
} from 'lucide-react';

import {
  ScrollProgress, FloatingNav,
  CASE_STUDY_META,
  Section, Card, CardHeader, MetricCard,
  TechTag, Collapsible, FeatureItem, CodeBlock,
  QuoteBlock, ColorSwatch, ArchitectureLayer,
  GalleryMockup, TimelineItem,
  Brain,
} from './case-study-parts';

// ── Layout Shell ─────────────────────────────────────────────────────────────

interface CaseStudyLayoutProps {
  sections: string[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const CaseStudyLayout: React.FC<CaseStudyLayoutProps> = ({
  sections,
  header,
  footer,
  children,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!document.getElementById('case-study-anchor')) {
      const anchor = document.createElement('div');
      anchor.id = 'case-study-anchor';
      document.body.prepend(anchor);
    }
  }, []);

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto custom-scrollbar"
    >
      <div id="case-study-anchor" />

      <div className="relative min-h-screen bg-gradient-to-br from-[var(--os-surface)] via-[var(--os-surface-soft)] to-[var(--os-surface)] text-[var(--os-text)] selection:bg-[var(--os-hover-accent)] selection:text-[var(--os-navy)]">
        <ScrollProgress containerRef={scrollRef} />
        <FloatingNav sections={sections} containerRef={scrollRef} />

        {/* Noise Overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.012] pointer-events-none z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Radial Gradients */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse at top left, rgba(174, 198, 207, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(51, 78, 104, 0.08) 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10">
          {header}
          <main className="px-6 py-24 space-y-40">
            {children}
          </main>
          {footer}
        </div>
      </div>
    </div>
  );
};

// ── Section Names ────────────────────────────────────────────────────────────

const SECTIONS = [
  'Overview',
  'Design System',
  'Architecture',
  'Features',
  'Roadmap',
];

// ── Hero Header ──────────────────────────────────────────────────────────────

const HeroHeader: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-32 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="px-3 py-1.5 rounded-full bg-[var(--os-hover)] border border-[var(--os-border)]">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest" style={{ color: 'var(--os-text-accent)' }}>
                Case Study
              </span>
            </div>
            <span className="text-[10px] font-mono" style={{ color: 'var(--os-text-secondary)' }}>
              v{CASE_STUDY_META.version} &middot; {CASE_STUDY_META.timeline}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4" style={{ color: 'var(--os-text)' }}>
            <span style={{ color: 'var(--os-navy)' }}>{CASE_STUDY_META.title}</span>
          </h1>

          <p className="text-xl md:text-2xl font-light mb-8 max-w-2xl" style={{ color: 'var(--os-text-secondary)' }}>
            {CASE_STUDY_META.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest mr-2" style={{ color: 'var(--os-text-secondary)' }}>
              Role:
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--os-navy)' }}>
              {CASE_STUDY_META.role}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {CASE_STUDY_META.stack.map((tech) => (
              <TechTag key={tech}>{tech}</TechTag>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ── Footer ───────────────────────────────────────────────────────────────────

const CaseStudyFooter: React.FC = () => (
  <div className="max-w-6xl mx-auto px-6 py-20 border-t" style={{ borderColor: 'var(--os-border)' }}>
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <p className="text-sm font-bold" style={{ color: 'var(--os-text)' }}>
          {CASE_STUDY_META.title}
        </p>
        <p className="text-xs" style={{ color: 'var(--os-text-secondary)' }}>
          {CASE_STUDY_META.subtitle} &middot; v{CASE_STUDY_META.version}
        </p>
      </div>
      <div className="flex items-center gap-4">
        {CASE_STUDY_META.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="text-[9px] font-mono uppercase tracking-wider" style={{ color: 'var(--os-text-faint)' }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// ── CaseStudyPage ────────────────────────────────────────────────────────────

export const CaseStudyPage: React.FC = () => {
  return (
    <CaseStudyLayout
      sections={SECTIONS}
      header={<HeroHeader />}
      footer={<CaseStudyFooter />}
    >
      {/* ── 01 — Overview ─────────────────────────────────────────────── */}
      <Section title="Project Overview" number="01" subtitle="A prompt engineering workspace built for precision and speed.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <MetricCard
            value={CASE_STUDY_META.stats.linesOfCode}
            label="Lines of Code"
            sub="TypeScript + CSS"
            icon={Code}
          />
          <MetricCard
            value={CASE_STUDY_META.stats.components}
            label="Components"
            sub="React 18 functional"
            icon={Layers}
          />
          <MetricCard
            value={CASE_STUDY_META.stats.shortcuts}
            label="Keyboard Shortcuts"
            sub="Vim-inspired workflow"
            icon={Keyboard}
          />
          <MetricCard
            value={CASE_STUDY_META.stats.formatFunctions}
            label="Format Functions"
            sub="Smart Paste engine"
            icon={Wand2}
          />
        </div>

        <Card gradient>
          <CardHeader icon={FileText} title="Deliverables" subtitle="End-to-end design engineering" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CASE_STUDY_META.deliverables.map((d, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--os-hover)] transition-colors">
                <div className="w-6 h-6 rounded-md bg-[var(--os-hover-accent)] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[9px] font-mono font-bold" style={{ color: 'var(--os-navy)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--os-text-dim)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-12">
          <QuoteBlock
            quote="The goal was to build a tool that respects the craft of prompt writing — precise, fast, and distraction-free."
            author="Design Philosophy"
            role={CASE_STUDY_META.role}
          />
        </div>
      </Section>

      {/* ── 02 — Design System ────────────────────────────────────────── */}
      <Section title="Design System" number="02" subtitle="A CSS custom property architecture for complete theming control.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader icon={Palette} title="Token Architecture" subtitle="--os-* custom properties" />
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--os-text-dim)' }}>
              Every visual property is driven by CSS custom properties under the <code className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[var(--os-surface-muted)]">--os-*</code> namespace,
              enabling seamless light/dark mode switching and theme customization.
            </p>
            <div className="space-y-1">
              <ColorSwatch name="Navy" value="#334E68" description="Primary accent" />
              <ColorSwatch name="Sky" value="#AEC6CF" description="Secondary accent" />
              <ColorSwatch name="Highlight" value="#D4AF37" description="Interactive elements" />
              <ColorSwatch name="Surface" value="#F7F7F2" description="Base background" />
            </div>
          </Card>

          <Card>
            <CardHeader icon={Moon} title="Dark Mode" subtitle="Automatic & manual toggling" />
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--os-text-dim)' }}>
              Dark mode is implemented at the CSS variable layer — a single class toggle swaps the entire palette.
              No component-level dark mode logic needed.
            </p>
            <div className="space-y-1">
              <ColorSwatch name="Navy" value="#58A6FF" description="Dark primary" />
              <ColorSwatch name="Sky" value="#79C0FF" description="Dark secondary" />
              <ColorSwatch name="Highlight" value="#F0C040" description="Dark interactive" />
              <ColorSwatch name="Surface" value="#0D1117" description="Dark background" />
            </div>
          </Card>
        </div>

        <CodeBlock
          language="css"
          code={`:root {
  --os-navy: #334E68;
  --os-sky: #AEC6CF;
  --os-highlight: #D4AF37;
  --os-surface: #F7F7F2;
  --os-border: #E5E5E0;
  --os-text: #1A1A1A;
}

.dark {
  --os-navy: #58A6FF;
  --os-sky: #79C0FF;
  --os-highlight: #F0C040;
  --os-surface: #0D1117;
  --os-border: #30363D;
  --os-text: #C9D1D9;
}`}
        />
      </Section>

      {/* ── 03 — Architecture ─────────────────────────────────────────── */}
      <Section title="Technical Architecture" number="03" subtitle="Component hierarchy and data flow patterns.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <ArchitectureLayer
            title="Presentation"
            icon={LayoutIcon}
            items={[
              { name: 'RichTextEditor', desc: 'Split-view markdown editor with live preview', icon: Code },
              { name: 'CommandPalette', desc: 'Fuzzy search command launcher (⌘K)', icon: Command },
              { name: 'DocumentOutline', desc: 'Auto-generated heading tree navigation', icon: List },
            ]}
          />
          <ArchitectureLayer
            title="Logic"
            icon={Brain}
            items={[
              { name: 'SmartPasteModal', desc: 'Format pipeline with custom rules', icon: Sparkles },
              { name: 'BuzzwordPanel', desc: 'Detects and suggests replacements for jargon', icon: Shield },
              { name: 'PromptFormatter', desc: '58 formatting functions for markdown normalization', icon: Wand2 },
            ]}
          />
          <ArchitectureLayer
            title="Data"
            icon={Database}
            items={[
              { name: 'Supabase KV', desc: 'Serverless key-value persistence layer', icon: Database },
              { name: 'Auto-Save', desc: 'Debounced 3-second write with optimistic UI', icon: Zap },
              { name: 'Custom Rules', desc: 'User-defined regex transformations (persisted)', icon: GitBranch },
            ]}
          />
        </div>

        <Card>
          <CardHeader icon={Layers} title="Component Gallery" subtitle={`${CASE_STUDY_META.stats.components} production components`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {([
              { key: 'rich-text-editor.tsx', title: 'Rich Text Editor', desc: 'Split-view with toolbar, grid guides, HUD metrics', icon: Code },
              { key: 'command-palette.tsx', title: 'Command Palette', desc: 'Fuzzy-matched keyboard launcher', icon: Command },
              { key: 'smart-paste-modal.tsx', title: 'Smart Paste', desc: 'Format pipeline with live preview', icon: Sparkles },
              { key: 'file-system.tsx', title: 'File System', desc: 'Sidebar file browser with color labels', icon: FileText },
              { key: 'document-outline.tsx', title: 'Doc Outline', desc: 'Auto-generated heading tree', icon: List },
              { key: 'hud.tsx', title: 'HUD Metrics', desc: 'Token count, reading time, buzzword detection', icon: BarChart3 },
              { key: 'theme-toggle.tsx + app.css', title: 'Theme System', desc: 'Light/dark with CSS variables', icon: Moon },
              { key: 'buzzword-panel.tsx', title: 'Buzzword Panel', desc: 'Jargon detection with replacements', icon: Shield },
              { key: 'keyboard-shortcuts-overlay.tsx', title: 'Shortcuts', desc: 'Global keyboard shortcut reference', icon: Keyboard },
            ]).map((item) => (
              <div key={item.key} className="rounded-xl border border-[var(--os-border)] overflow-hidden hover:border-[var(--os-highlight)] transition-colors">
                <GalleryMockup componentKey={item.key} icon={item.icon} />
                <div className="p-4">
                  <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--os-text)' }}>{item.title}</h4>
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--os-text-dim)' }}>{item.desc}</p>
                  <p className="text-[9px] font-mono mt-2 opacity-50" style={{ color: 'var(--os-text-secondary)' }}>{item.key}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {/* ── 04 — Features ─────────────────────────────────────────────── */}
      <Section title="Key Features" number="04" subtitle="Engineering decisions that define the user experience.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader icon={Wand2} title="Smart Paste Engine" subtitle="v6.3 — 58 format functions" />
            <div className="space-y-0">
              <FeatureItem
                icon={Sparkles}
                title="Auto-Detection"
                description="Identifies document format (markdown, plain text, JSON, list) and applies appropriate transformations."
              />
              <FeatureItem
                icon={GitBranch}
                title="Custom Rules"
                description="Users define their own regex-based find/replace rules, persisted to backend."
                badge="New"
              />
              <FeatureItem
                icon={Eye}
                title="Live Preview"
                description="Side-by-side comparison of original vs. formatted output before applying."
              />
            </div>
          </Card>

          <Card>
            <CardHeader icon={Keyboard} title="Keyboard-First UX" subtitle={`${CASE_STUDY_META.stats.shortcuts} global shortcuts`} />
            <div className="space-y-0">
              <FeatureItem
                icon={Command}
                title="Command Palette"
                description="⌘K opens a fuzzy-matched command launcher for all app actions."
              />
              <FeatureItem
                icon={Zap}
                title="Magic Format"
                description="⌘⇧F applies the full Smart Paste pipeline to the current document instantly."
              />
              <FeatureItem
                icon={Shield}
                title="Buzzword Detection"
                description="Real-time detection of 138+ corporate jargon terms with suggested alternatives."
                badge="HUD"
              />
            </div>
          </Card>
        </div>

        <div className="mt-12">
          <Collapsible title="Editor Capabilities" number="4.1" icon={Code} isOpen>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--os-text)' }}>Write Mode</h4>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--os-text-dim)' }}>
                  <li className="flex items-start gap-2"><ArrowRight size={12} className="mt-1 shrink-0" style={{ color: 'var(--os-highlight)' }} /> Full markdown toolbar with inline shortcuts</li>
                  <li className="flex items-start gap-2"><ArrowRight size={12} className="mt-1 shrink-0" style={{ color: 'var(--os-highlight)' }} /> Auto-continue lists (bullet, numbered, checkbox)</li>
                  <li className="flex items-start gap-2"><ArrowRight size={12} className="mt-1 shrink-0" style={{ color: 'var(--os-highlight)' }} /> Grid guides (rows, lines, page, full grid)</li>
                  <li className="flex items-start gap-2"><ArrowRight size={12} className="mt-1 shrink-0" style={{ color: 'var(--os-highlight)' }} /> Variable insertion with {'{{mustache}}'} syntax</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold mb-3" style={{ color: 'var(--os-text)' }}>Preview Mode</h4>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--os-text-dim)' }}>
                  <li className="flex items-start gap-2"><ArrowRight size={12} className="mt-1 shrink-0" style={{ color: 'var(--os-highlight)' }} /> GitHub-flavored markdown rendering</li>
                  <li className="flex items-start gap-2"><ArrowRight size={12} className="mt-1 shrink-0" style={{ color: 'var(--os-highlight)' }} /> Tables, task lists, strikethrough support</li>
                  <li className="flex items-start gap-2"><ArrowRight size={12} className="mt-1 shrink-0" style={{ color: 'var(--os-highlight)' }} /> Deferred rendering for 60fps typing</li>
                  <li className="flex items-start gap-2"><ArrowRight size={12} className="mt-1 shrink-0" style={{ color: 'var(--os-highlight)' }} /> Split view with responsive divider</li>
                </ul>
              </div>
            </div>
          </Collapsible>

          <Collapsible title="HUD Metrics System" number="4.2" icon={BarChart3}>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--os-text-dim)' }}>
              The editor footer includes an expandable heads-up display showing real-time document analytics:
              token count, word count, reading time, speaking time, sentence count, paragraph count,
              average words per sentence, and buzzword density with severity levels.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--os-text-dim)' }}>
              All metrics use <code className="text-[11px] font-mono px-1 py-0.5 rounded bg-[var(--os-surface-muted)]">useDeferredValue</code> to
              avoid blocking keystroke rendering, with a single-pass regex for buzzword detection instead of 138 separate scans.
            </p>
          </Collapsible>
        </div>
      </Section>

      {/* ── 05 — Roadmap ──────────────────────────────────────────────── */}
      <Section title="Future Roadmap" number="05" subtitle="Planned enhancements and iteration priorities.">
        <div className="space-y-0">
          <TimelineItem
            title="AI-Powered Suggestions"
            description="Contextual prompt improvement suggestions powered by language models."
            priority="High"
            index={0}
            icon={Brain}
            status="planned"
          />
          <TimelineItem
            title="Version History"
            description="Git-style diff viewer for prompt iterations with restore capability."
            priority="High"
            index={1}
            icon={GitBranch}
            status="in-progress"
          />
          <TimelineItem
            title="Collaborative Editing"
            description="Real-time multi-user editing with cursor presence."
            priority="Medium"
            index={2}
            icon={Code}
            status="planned"
          />
          <TimelineItem
            title="Template Library"
            description="Pre-built prompt templates for common use cases."
            priority="Medium"
            index={3}
            icon={FileText}
            status="planned"
          />
          <TimelineItem
            title="Export to PDF"
            description="Styled PDF export with customizable formatting options."
            priority="Low"
            index={4}
            icon={ExternalLink}
            status="planned"
          />
        </div>
      </Section>
    </CaseStudyLayout>
  );
};

export default CaseStudyLayout;
