import React, { memo } from "react";
import { motion } from "motion/react";
import { Search, PenTool, Layers, Code2, RefreshCw, type LucideIcon } from "lucide-react";

interface ProcessStep { label: string; icon: LucideIcon; description: string; }

const STEPS: readonly ProcessStep[] = [
  { label: "Discover", icon: Search, description: "Audited 42 sources — Anthropic docs, Figma guides, practitioner analysis — to map Claude Opus 4.6's capabilities and Figma Make's prompt surface." },
  { label: "Define", icon: PenTool, description: "Developed the TC-EBC Framework (Task, Context, Elements, Behavior, Constraints) as a repeatable prompting methodology." },
  { label: "Design", icon: Layers, description: "Created the Cinematic Light visual system: Swiss-style typography, sharp edges, deep-pigment category accents, and CSS variable tokens." },
  { label: "Build", icon: Code2, description: "Implemented in React 19 + Tailwind v4 + Motion with code-split lazy loading, ErrorBoundary wrapping, and strong TypeScript types." },
  { label: "Iterate", icon: RefreshCw, description: "Refined prompts against real Claude Opus 4.6 output, tightened accessibility (focus trapping, ARIA), and optimized for mobile performance." },
] as const;

export const CsProcess = memo(function CsProcess() {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <span className="text-[10px] sm:text-xs font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">03</span>
        <h2 className="text-foreground">Process</h2>
      </div>
      <div className="hidden sm:grid sm:grid-cols-5 gap-px border border-border bg-border">
        {STEPS.map((step, i) => { const Icon = step.icon; return (
          <div key={step.label} className="bg-card p-5 sm:p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-3"><span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums">{String(i + 1).padStart(2, "0")}</span><Icon className="w-4 h-4 text-muted-foreground/50" strokeWidth={1.5} /></div>
            <h3 className="text-foreground text-sm mb-2">{step.label}</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground font-light leading-relaxed">{step.description}</p>
          </div>
        ); })}
      </div>
      <div className="sm:hidden space-y-0">
        {STEPS.map((step, i) => { const Icon = step.icon; return (
          <div key={step.label} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border border-border bg-card flex items-center justify-center flex-shrink-0"><Icon className="w-4 h-4 text-muted-foreground/50" strokeWidth={1.5} /></div>
              {i < STEPS.length - 1 && <div className="w-px flex-1 bg-border min-h-[24px]" />}
            </div>
            <div className="pb-6">
              <div className="flex items-center gap-2 mb-1"><span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums">{String(i + 1).padStart(2, "0")}</span><h3 className="text-foreground text-sm">{step.label}</h3></div>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">{step.description}</p>
            </div>
          </div>
        ); })}
      </div>
    </motion.section>
  );
});
