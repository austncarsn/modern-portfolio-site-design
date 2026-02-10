/**
 * CardNavigation.tsx (refactored + optimized)
 *
 * Home page navigation section — French blue painted wood paneling.
 * Editorial grid with light text on #4A6FA5 surface, separated by
 * hairline rules. Museum catalog meets Parisian study aesthetic.
 *
 * Refactor goals:
 * - Remove JS hover handlers (use CSS :hover / :focus-visible)
 * - Keep motion variants + layout
 * - Improve semantics slightly (header + nav list)
 * - Performance optimizations with React best practices
 * - Keep as a single copy/paste file
 */

import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useStaggerVariants } from "./motion-variants";

interface NavCard {
  category: string;
  title: string;
  desc: string[];
  to: string;
}

const CARDS: NavCard[] = [
  {
    category: "PROFILE",
    title: "Austin\nCarson",
    desc: ["Design Engineer", "Info", "Background"],
    to: "/info",
  },
  {
    category: "WORK",
    title: "Case\nStudies",
    desc: ["Selected Projects", "Product", "Systems"],
    to: "/projects",
  },
  {
    category: "TOOLS",
    title: "Prompt\nLibrary",
    desc: ["Claude Opus 4.6", "Figma Make", "100 Prompts"],
    to: "/prompt-library",
  },
  {
    category: "STORE",
    title: "Cameo\nStore",
    desc: ["Vintage Commerce", "AI Artwork", "Shop + Case Study"],
    to: "/cameo-store",
  },
  {
    category: "GALLERY",
    title: "Digital Art\nGallery",
    desc: ["Video", "Image Works", "Experiments"],
    to: "/gallery",
  },
  {
    category: "LEARNING",
    title: "Flashcards",
    desc: ["Design Engineering", "Study Tool", "30 Terms"],
    to: "/flashcards",
  },
  {
    category: "RESUME",
    title: "View\nResume",
    desc: ["Experience", "Skills", "Download PDF"],
    to: "/resume",
  },
] as const;

export const CardNavigation = memo(function CardNavigation() {
  const { container, item } = useStaggerVariants();

  // Memoize card rendering to prevent unnecessary re-renders
  const renderedCards = useMemo(
    () =>
      CARDS.map((card, i) => {
        const isLeftCol = i % 2 === 0;
        return (
          <motion.div
            key={card.to}
            variants={item}
            className={`cnCell ${isLeftCol ? "cnCellLeft" : ""}`}
          >
            <Link to={card.to} className="cnLink" aria-label={`Navigate to ${card.category}`}>
              <div>
                <span className="cnCategory">{card.category}</span>
                <h2 className="cnTitle">{card.title}</h2>
              </div>

              <div className="cnMeta">
                <span className="cnDesc">{card.desc.join(" · ")}</span>
                <ArrowUpRight size={14} strokeWidth={1.5} className="cnIcon" aria-hidden="true" />
              </div>
            </Link>
          </motion.div>
        );
      }),
    [item]
  );

  return (
    <section className="cnSection" aria-label="Primary navigation">
      <style>{`
        .cnSection {
          width: 100%;
          background-color: #4A6FA5;
          border-top: 1px solid rgba(0,0,0,0.15);
          border-bottom: 1px solid rgba(0,0,0,0.15);
        }

        .cnInner {
          max-width: 1120px;
          margin: 0 auto;
          padding: var(--sp-12) var(--sp-4);
        }

        .cnHeader {
          margin-bottom: var(--sp-6);
        }

        .cnKicker {
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          margin: 0 0 12px 0;
        }

        .cnRule {
          width: var(--sp-5);
          height: 1px;
          background-color: rgba(255,255,255,0.25);
        }

        .cnGrid {
          display: grid;
          grid-template-columns: 1fr;
          border-top: 1px solid rgba(255,255,255,0.2);
        }

        /* Desktop: 2 columns */
        @media (min-width: 768px) {
          .cnGrid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .cnCell {
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        /* Right border for left column cells (desktop only) */
        @media (min-width: 768px) {
          .cnCellLeft {
            border-right: 1px solid rgba(255,255,255,0.2);
          }
        }

        .cnLink {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 190px;
          padding: 28px var(--sp-4);
          text-decoration: none;
          color: var(--selected-fg);
          background-color: transparent;
          transition: background-color 300ms ease;
        }

        .cnLink:hover {
          background-color: rgba(0,0,0,0.08);
        }

        .cnLink:focus-visible {
          outline: 2px solid rgba(255,255,255,0.9);
          outline-offset: 3px;
          background-color: rgba(0,0,0,0.08);
        }

        .cnCategory {
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          display: block;
          margin-bottom: var(--sp-3);
        }

        .cnTitle {
          font-family: var(--font-display);
          font-weight: 400;
          font-size: var(--ts-h2);
          line-height: 1.1;
          letter-spacing: -0.015em;
          white-space: pre-line;
          color: var(--selected-fg);
          margin: 0;
        }

        .cnMeta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          gap: var(--sp-3);
        }

        .cnDesc {
          font-family: var(--font-body);
          font-size: var(--ts-small);
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.02em;
        }

        .cnIcon {
          color: rgba(255,255,255,0.7);
          flex-shrink: 0;
        }
      `}</style>

      <motion.div
        className="cnInner md:px-10!"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {/* Section header */}
        <motion.header className="cnHeader" variants={item}>
          <p className="cnKicker">Navigation</p>
          <div className="cnRule" />
        </motion.header>

        {/* Editorial grid — 2×2 on desktop, stacked on mobile, hairline rules */}
        <nav aria-label="Site sections">
          <div className="cnGrid">{renderedCards}</div>
        </nav>
      </motion.div>
    </section>
  );
});
