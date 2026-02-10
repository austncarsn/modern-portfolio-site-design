import React from "react";
import { motion, type MotionProps } from "motion/react";

/* -----------------------------------------------------------------------------
 * Custom Icon Component - Problem
 * -------------------------------------------------------------------------- */

const ProblemIcon = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
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
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" />
    </g>
  </svg>
);

/* -----------------------------------------------------------------------------
 * Motion
 * -------------------------------------------------------------------------- */

const SECTION_ANIMATION: MotionProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: {
    duration: 0.7,
    ease: [0.16, 1, 0.3, 1],
  },
};

/* -----------------------------------------------------------------------------
 * Data
 * -------------------------------------------------------------------------- */

const PAIN_POINTS = [
  "Prompts were scattered across docs, Slack threads, and personal notes — no single, searchable source of truth.",
  "Most public prompt collections lack structure: no categorization, no effort metadata, no framework consistency.",
  "I was spending 15–30 minutes per prompt iterating on wording instead of shipping features.",
] as const;

/* -----------------------------------------------------------------------------
 * Subcomponents
 * -------------------------------------------------------------------------- */

function PainPointItem({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-3 p-4 border border-border bg-card/50">
      <ProblemIcon
        className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5"
        aria-hidden
      />
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
        {children}
      </p>
    </li>
  );
}

/* -----------------------------------------------------------------------------
 * Component
 * -------------------------------------------------------------------------- */

export function CsProblem() {
  return (
    <motion.section {...SECTION_ANIMATION} aria-labelledby="problem-heading">
      {/* Header */}
      <header className="flex items-center gap-3 mb-6 sm:mb-8">
        <span
          className="text-[10px] sm:text-xs font-mono text-muted-foreground/50 uppercase tracking-[0.2em]"
          aria-hidden
        >
          01
        </span>
        <h2 id="problem-heading" className="text-foreground">
          Problem
        </h2>
      </header>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        <div className="space-y-4">
          <p className="text-sm sm:text-base font-light text-muted-foreground leading-relaxed">
            As AI-powered design tools like Figma Make matured, prompt quality
            became the bottleneck. Working with Claude Opus 4.6 for agentic UI
            generation, I needed reliable, tested prompts — but had no centralized
            resource tailored to Figma Make&apos;s capabilities.
          </p>

          <p className="text-sm sm:text-base font-light text-muted-foreground leading-relaxed">
            Existing prompt libraries were either too generic (not optimized for
            design tooling) or too narrow (single use-case). There was no resource
            that combined research-backed prompting methodology with practical,
            copy-ready templates across the full design workflow.
          </p>
        </div>

        <ul className="space-y-3" role="list">
          {PAIN_POINTS.map((point) => (
            <PainPointItem key={point}>{point}</PainPointItem>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
