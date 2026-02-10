import React from "react";
import { motion, type MotionProps } from "motion/react";

/* -------------------------------------------------------------------------- */
/* Motion Preset                                                              */
/* -------------------------------------------------------------------------- */

const SECTION_ANIMATION: MotionProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: {
    duration: 0.7,
    ease: [0.16, 1, 0.3, 1],
  },
};

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

type ArchitectureBoxData = {
  label: string;
  sub: string;
  span?: boolean;
};

const BOXES: ArchitectureBoxData[] = [
  { label: "App.tsx", sub: "Entry point · view routing · state" },
  { label: "HeroHeader", sub: "Parallax hero · sticky nav" },
  { label: "Toolbar", sub: "⌘K search · category chips · filters" },
  { label: "PromptCard", sub: "Grid cell · favorites · category accent" },
  {
    label: "PromptModal",
    sub: "Detail view · copy · format toggle",
    span: true,
  },
  { label: "Prompt Data", sub: "100 prompts · 2 shards · barrel file" },
  { label: "Category Colors", sub: "8 accents · effort · thinking mode" },
  { label: "Markdown Utils", sub: "TC-EBC export · heading map" },
  {
    label: "ErrorBoundary",
    sub: "Per-section isolation · skeletons",
    span: true,
  },
];

/* -------------------------------------------------------------------------- */
/* Subcomponents                                                              */
/* -------------------------------------------------------------------------- */

function ArchitectureBox({ label, sub, span }: ArchitectureBoxData) {
  return (
    <div
      className={`bg-card p-4 sm:p-5 ${
        span ? "col-span-2 sm:col-span-3" : ""
      }`}
    >
      <span className="text-xs sm:text-sm text-foreground block mb-1">
        {label}
      </span>
      <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground/50 leading-snug">
        {sub}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function CsArchitecture() {
  return (
    <motion.section
      {...SECTION_ANIMATION}
      aria-labelledby="architecture-heading"
    >
      {/* Header */}
      <header className="flex items-center gap-3 mb-6 sm:mb-8">
        <span
          className="text-[10px] sm:text-xs font-mono text-muted-foreground/50 uppercase tracking-[0.2em]"
          aria-hidden
        >
          04
        </span>
        <h2 id="architecture-heading" className="text-foreground">
          System Overview
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 sm:gap-12">
        {/* Architecture Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-px border border-border bg-border"
          role="list"
        >
          {BOXES.map((box) => (
            <ArchitectureBox key={box.label} {...box} />
          ))}
        </div>

        {/* Description */}
        <div className="space-y-4 text-sm font-light text-muted-foreground leading-relaxed">
          <p>
            The app follows a{" "}
            <strong className="text-foreground font-medium">
              flat component architecture
            </strong>{" "}
            — no routing library, no global store. View state lives in{" "}
            <code className="text-[11px] font-mono bg-secondary px-1.5 py-0.5">
              App.tsx
            </code>{" "}
            and flows down via props.
          </p>

          <p>
            Prompt data is sharded into two 50-prompt files and merged through a
            barrel (
            <code className="text-[11px] font-mono bg-secondary px-1.5 py-0.5">
              prompt-data.ts
            </code>
            ), keeping each file under 2K lines for editor performance.
          </p>

          <p>
            <code className="text-[11px] font-mono bg-secondary px-1.5 py-0.5">
              category-colors.ts
            </code>{" "}
            acts as the single source of truth for accents, effort levels, and
            thinking modes.
          </p>

          <p>
            Code-split with{" "}
            <code className="text-[11px] font-mono bg-secondary px-1.5 py-0.5">
              React.lazy
            </code>
            : MethodologySection, ReferencesSection, and PromptModal each load on
            demand with shimmer skeleton fallbacks.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
