import React, { memo } from "react";
import { motion } from "motion/react";

const METADATA: { label: string; value: string }[] = [
  { label: "Role", value: "Design Engineer" },
  { label: "Timeline", value: "4 weeks" },
  { label: "Tools", value: "Figma Make, Claude Opus 4.6, React 19" },
  { label: "Platform", value: "Web (responsive SPA)" },
];

export const CsHero = memo(function CsHero() {
  return (
    <section className="border-b border-border bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #7C3AED, #E11D48, #C026D3, #0284C7)" }} />
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 pt-20 sm:pt-28 pb-12 sm:pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <p className="text-[10px] sm:text-xs font-mono text-muted-foreground/50 uppercase tracking-[0.25em] mb-4 sm:mb-6">Case Study</p>
          <h1 className="text-foreground mb-4 sm:mb-6 max-w-3xl">Building a Production-Ready<br className="hidden sm:block" /> AI Prompt Library</h1>
          <p className="text-base sm:text-lg font-light text-muted-foreground max-w-2xl leading-relaxed mb-8 sm:mb-12">
            How I designed and engineered 100 agentic prompts for Claude Opus 4.6 × Figma Make — from a research-backed framework to a fully interactive single-page application.
          </p>
        </motion.div>
        <motion.div className="flex flex-wrap gap-px border border-border bg-border" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          {METADATA.map((item) => (
            <div key={item.label} className="flex-1 min-w-[140px] bg-card px-4 sm:px-6 py-3 sm:py-4">
              <span className="block text-[9px] sm:text-[10px] font-mono text-muted-foreground/50 uppercase tracking-[0.2em] mb-1">{item.label}</span>
              <span className="text-xs sm:text-sm text-foreground">{item.value}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});
