import React, { memo } from "react";
import { motion } from "motion/react";

/* -----------------------------------------------------------------------------
 * Custom Icon Component - Outcome
 * -------------------------------------------------------------------------- */

const OutcomeIcon = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
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
      <polyline points="3,17 9,11 14,14 21,7" />
      <polyline points="17,7 21,7 21,11" />
    </g>
  </svg>
);

const OUTCOMES = [
  { metric: "100", label: "Production Prompts", detail: "Covering 8 categories from foundation layouts to advanced agentic patterns." },
  { metric: "42", label: "Research Sources", detail: "Tier 1 canonical docs + Tier 2 practitioner analysis and community validation." },
  { metric: "< 2s", label: "Time to Interactive", detail: "Code-split lazy loading keeps the initial bundle lean for fast first paint." },
  { metric: "100%", label: "Responsive Coverage", detail: "Mobile, tablet, and desktop layouts tested across breakpoints." },
  { metric: "A11y", label: "Keyboard Accessible", detail: "Focus trapping, Escape handling, ARIA labels, and screen-reader landmarks." },
  { metric: "2", label: "Export Formats", detail: "Raw XML prompt and TC-EBC Markdown with Opus configuration metadata." },
] as const;

export const CsResults = memo(function CsResults() {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <span className="text-[10px] sm:text-xs font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">07</span>
        <h2 className="text-foreground">Results</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border border-border bg-border">
        {OUTCOMES.map((o) => (
          <div key={o.label} className="bg-card p-5 sm:p-6">
            <span className="block text-2xl sm:text-3xl text-foreground tracking-tight mb-1">{o.metric}</span>
            <span className="block text-xs font-mono text-muted-foreground/50 uppercase tracking-[0.15em] mb-2">{o.label}</span>
            <p className="text-[11px] sm:text-xs text-muted-foreground font-light leading-relaxed">{o.detail}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
});
