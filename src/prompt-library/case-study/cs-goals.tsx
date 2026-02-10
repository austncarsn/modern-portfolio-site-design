import React, { memo } from "react";
import { motion } from "motion/react";

/* -----------------------------------------------------------------------------
 * Custom Icon Component - Goals
 * -------------------------------------------------------------------------- */

const GoalsIcon = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="2" x2="6" y2="22" />
      <path d="M6 3h11l-2.5 3L17 9H6z" />
    </g>
  </svg>
);

const GOALS = [
  "Curate 100 production-ready prompts spanning 8 categories of the design-to-code workflow.",
  "Ground every prompt in the TC-EBC Framework, validated against 42 research sources.",
  "Ship a fast, responsive SPA that works seamlessly on mobile, tablet, and desktop.",
  "Provide one-click copy with smart Markdown export (including Opus metadata).",
  "Achieve keyboard-first accessibility: focus trapping, Escape-to-close, and ⌘K search.",
  "Keep the initial JS bundle lean via code splitting and lazy-loaded sections.",
] as const;

export const CsGoals = memo(function CsGoals() {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <span className="text-[10px] sm:text-xs font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">02</span>
        <h2 className="text-foreground">Goals</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GOALS.map((goal, i) => (
          <div key={i} className="flex items-start gap-3 p-4 sm:p-5 border border-border bg-card/50">
            <GoalsIcon className="w-4 h-4 shrink-0 mt-0.5 text-muted-foreground/40" />
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{goal}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
});
