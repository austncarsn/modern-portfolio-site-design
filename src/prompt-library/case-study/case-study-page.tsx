import { motion, type MotionProps } from "motion/react";
import { ArrowLeft } from "lucide-react";

import { CsHero } from "./cs-hero";
import { CsProblem } from "./cs-problem";
import { CsGoals } from "./cs-goals";
import { CsProcess } from "./cs-process";
import { CsArchitecture } from "./cs-architecture";
import { CsFeatures } from "./cs-features";
import { CsPromptSystem } from "./cs-prompt-system";
import { CsResults } from "./cs-results";
import { CsLearnings } from "./cs-learnings";
import { CsFooterCta } from "./cs-footer-cta";

/* -------------------------------------------------------------------------- */
/* Motion Presets                                                             */
/* -------------------------------------------------------------------------- */

const NAV_ANIMATION: MotionProps = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    ease: [0.16, 1, 0.3, 1],
  },
};

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const SPECTRUM_GRADIENT =
  "linear-gradient(90deg, transparent, #7C3AED, #E11D48, #C026D3, transparent)";

const CM_GRADIENT = "linear-gradient(135deg, #7C3AED, #E11D48)";

/* -------------------------------------------------------------------------- */
/* Top Navigation                                                             */
/* -------------------------------------------------------------------------- */

interface TopNavProps {
  onBack: () => void;
}

function CaseStudyTopNav({ onBack }: TopNavProps) {
  return (
    <motion.nav
      {...NAV_ANIMATION}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border"
      style={{ transform: "translateZ(0)" }}
      aria-label="Case study navigation"
    >
      {/* Spectrum accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: SPECTRUM_GRADIENT }}
        aria-hidden
      />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs font-mono uppercase tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-ring p-1 -ml-1"
            aria-label="Back to library"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
            <span className="hidden sm:inline">Library</span>
          </button>

          <div className="w-px h-4 bg-border" aria-hidden />

          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-mono font-medium bg-clip-text text-transparent"
              style={{ backgroundImage: CM_GRADIENT }}
              aria-hidden
            >
              C×M
            </span>
            <span className="text-xs sm:text-sm font-medium text-foreground tracking-tight">
              Case Study
            </span>
          </div>
        </div>

        <span className="text-[10px] sm:text-xs font-mono text-muted-foreground/50 uppercase tracking-wider">
          Claude Opus 4.6 × Figma Make
        </span>
      </div>
    </motion.nav>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

interface CaseStudyPageProps {
  onNavigateToLibrary: () => void;
}

export function CaseStudyPage({
  onNavigateToLibrary,
}: CaseStudyPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <header>
        <CaseStudyTopNav onBack={onNavigateToLibrary} />
      </header>

      <CsHero />

      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-12 sm:py-20 space-y-16 sm:space-y-24">
        <CsProblem />
        <CsGoals />
        <CsProcess />
        <CsArchitecture />
        <CsFeatures />
        <CsPromptSystem />
        <CsResults />
        <CsLearnings />
      </main>

      <CsFooterCta onNavigateToLibrary={onNavigateToLibrary} />
    </div>
  );
}
