import React, { memo } from "react";
import { motion } from "motion/react";
import { Lightbulb, ArrowRight } from "lucide-react";

const LEARNINGS = [
  "Structured prompting methodology (TC-EBC) significantly outperforms ad-hoc prompt writing — consistency scales better than creativity alone.",
  "Sharding data files (2 × 50 prompts) was essential for keeping editor performance fast; a single 100-prompt file caused noticeable lag.",
  "Per-section ErrorBoundary wrapping adds minimal overhead but dramatically improves resilience — one bad render doesn't crash the page.",
  "The shadcn/ui scaffolding shipped by Figma Make is useful as a foundation, but custom components matched the Cinematic Light aesthetic better.",
  "Mobile-first design wasn't optional: 60%+ of test sessions were on phone viewports, requiring bottom-sheet modals and touch-friendly targets.",
] as const;

const NEXT_STEPS = [
  "Add Supabase for server-side favorites, analytics, and per-prompt usage tracking.",
  "Integrate real Claude Opus 4.6 API calls so users can test prompts live from the modal.",
  "Expand to 150+ prompts with community submissions and a voting/rating system.",
  "Ship dark mode using the existing CSS variable token architecture.",
  "Add a prompt builder wizard that guides users through TC-EBC step by step.",
] as const;

export const CsLearnings = memo(function CsLearnings() {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <span className="text-[10px] sm:text-xs font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">08</span>
        <h2 className="text-foreground">Learnings & Next Steps</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        <div>
          <h3 className="text-foreground text-sm mb-4 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-muted-foreground/40" strokeWidth={1.5} />Key Learnings</h3>
          <div className="space-y-3">{LEARNINGS.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-4 border border-border bg-card/50">
              <span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums flex-shrink-0 mt-px">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item}</p>
            </div>
          ))}</div>
        </div>
        <div>
          <h3 className="text-foreground text-sm mb-4 flex items-center gap-2"><ArrowRight className="w-4 h-4 text-muted-foreground/40" strokeWidth={1.5} />Next Steps</h3>
          <div className="space-y-3">{NEXT_STEPS.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-4 border border-border bg-card/50">
              <span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums flex-shrink-0 mt-px">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item}</p>
            </div>
          ))}</div>
        </div>
      </div>
    </motion.section>
  );
});
