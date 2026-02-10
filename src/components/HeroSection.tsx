import { motion, useReducedMotion, type Variants } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Mail } from "lucide-react";
import { EASE_EXPO_OUT } from "./motion-variants";
import { SECTION_NAV_ITEMS, mapPathToSection } from "./section-nav-items";

const revealContainer: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: EASE_EXPO_OUT,
      staggerChildren: 0.08,
    },
  },
};

const revealItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: EASE_EXPO_OUT },
  },
};

const SYSTEM_PROFILE = [
  { label: "Discipline", value: "Product Systems / UI Engineering" },
  { label: "Focus", value: "Clarity, Navigation, Information Architecture" },
  { label: "Environment", value: "React, TypeScript, Tailwind" },
  { label: "Approach", value: "Design decisions as maintainable systems" },
] as const;

const OPERATING_PRINCIPLES = [
  "Legibility over ornament",
  "Hierarchy before decoration",
  "Repeatable patterns over one-off layouts",
] as const;

export type HeroSectionProps = {
  firstName?: string;
  lastName?: string;
  maxWidth?: number;
  className?: string;
};

export function HeroSection({
  firstName = "Austin",
  lastName = "Carson",
  maxWidth = 1120,
  className,
}: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { pathname } = useLocation();
  const activeSection = mapPathToSection(pathname);

  return (
    <section className={`hero-shell ${className ?? ""}`}>
      <style>{`
        .hero-shell {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background: #f4f3f0;
        }

        .hero-backdrop {
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(180deg, #efeeea 0%, #f5f4f1 46%, #faf9f6 100%);
        }

        .hero-grid-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background-image:
            linear-gradient(to right, rgba(41, 38, 31, 0.045) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(41, 38, 31, 0.035) 1px, transparent 1px);
          background-size: 76px 76px;
          opacity: 0.48;
        }

        .hero-top-rail {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2;
          height: clamp(56px, 8vh, 72px);
          border-bottom: 1px solid color-mix(in srgb, var(--text-1) 12%, transparent);
          background: linear-gradient(
            180deg,
            color-mix(in srgb, #d9d6cf 32%, var(--surface-0)) 0%,
            color-mix(in srgb, #d9d6cf 12%, var(--surface-0)) 100%
          );
        }

        .hero-layout {
          position: relative;
          z-index: 5;
          width: 100%;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr) minmax(0, 1fr);
          gap: clamp(16px, 2.6vw, 36px);
          padding: clamp(104px, 14vh, 146px) clamp(16px, 4vw, 48px) clamp(42px, 7vh, 84px);
        }

        .hero-identity {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: var(--sp-4);
          min-width: 0;
        }

        .hero-kicker {
          margin: 0;
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-2);
        }

        .hero-name {
          margin: 0;
          font-family: var(--font-display);
          font-size: clamp(2.4rem, 7.8vw, 5.8rem);
          line-height: 0.92;
          letter-spacing: -0.03em;
          color: var(--text-1);
          text-wrap: balance;
        }

        .hero-summary {
          margin: 0;
          max-width: 48ch;
          font-family: var(--font-body);
          font-size: clamp(1rem, 1.2vw, 1.08rem);
          line-height: 1.65;
          color: color-mix(in srgb, var(--text-1) 84%, white 16%);
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--sp-2);
          margin-top: var(--sp-2);
        }

        .hero-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--sp-2);
          padding: 10px 14px;
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid var(--border-1);
          transition: background-color 160ms ease, color 160ms ease, border-color 160ms ease;
        }

        .hero-action-primary {
          background: var(--text-1);
          border-color: var(--text-1);
          color: var(--surface-0);
        }

        .hero-action-primary:hover {
          background: color-mix(in srgb, var(--text-1) 90%, black);
          border-color: color-mix(in srgb, var(--text-1) 90%, black);
        }

        .hero-action-secondary {
          background: transparent;
          color: var(--text-1);
        }

        .hero-action-secondary:hover {
          background: color-mix(in srgb, var(--surface-1) 70%, white 30%);
          border-color: color-mix(in srgb, var(--text-1) 24%, var(--border-1));
        }

        .hero-email {
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
          margin-top: var(--sp-3);
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-2);
          text-decoration: none;
          width: fit-content;
          transition: color 160ms ease;
        }

        .hero-email:hover {
          color: var(--text-1);
        }

        .hero-panel,
        .hero-nav-wrap {
          border: 1px solid color-mix(in srgb, var(--text-1) 16%, var(--border-1));
          background: color-mix(in srgb, var(--surface-0) 86%, #ece9e2 14%);
          min-height: 100%;
        }

        .hero-panel {
          display: flex;
          flex-direction: column;
          padding: var(--sp-4);
        }

        .hero-panel-head {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: var(--sp-3);
          border-bottom: 1px solid var(--border-1);
          padding-bottom: var(--sp-3);
          margin-bottom: var(--sp-3);
        }

        .hero-panel-kicker,
        .hero-panel-version,
        .hero-nav-kicker {
          margin: 0;
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-2);
        }

        .hero-profile {
          display: grid;
          gap: 0;
        }

        .hero-profile-row {
          display: grid;
          grid-template-columns: minmax(112px, 34%) 1fr;
          gap: var(--sp-3);
          padding: 10px 0;
          border-top: 1px solid color-mix(in srgb, var(--border-1) 85%, transparent);
        }

        .hero-profile-row:first-child {
          border-top: 0;
        }

        .hero-profile-label {
          margin: 0;
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-2);
        }

        .hero-profile-value {
          margin: 0;
          font-family: var(--font-body);
          font-size: 0.9rem;
          line-height: 1.45;
          color: var(--text-1);
        }

        .hero-principles {
          margin-top: var(--sp-4);
          padding-top: var(--sp-3);
          border-top: 1px solid var(--border-1);
        }

        .hero-principles-title {
          margin: 0 0 var(--sp-2) 0;
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-2);
        }

        .hero-principles-list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 8px;
        }

        .hero-principles-item {
          font-family: var(--font-body);
          font-size: 0.9rem;
          line-height: 1.45;
          color: var(--text-1);
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 10px;
          align-items: baseline;
        }

        .hero-principles-item::before {
          content: "→";
          color: var(--text-2);
        }

        .hero-nav-wrap {
          padding: var(--sp-4);
          display: flex;
          flex-direction: column;
          gap: var(--sp-3);
        }
        .hero-nav-indicator {
          display: grid;
          gap: var(--sp-2);
        }
        .hero-nav-indicator-row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: var(--sp-2);
          border: 1px solid color-mix(in srgb, var(--text-1) 20%, var(--border-1));
          padding: 11px 12px;
          background: color-mix(in srgb, var(--surface-0) 86%, #ece8df 14%);
          color: var(--text-2);
        }
        .hero-nav-indicator-row[data-active="true"] {
          background: var(--text-1);
          color: var(--surface-0);
          border-color: var(--text-1);
        }
        .hero-nav-indicator-index,
        .hero-nav-indicator-state {
          font-size: var(--ts-overline);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .hero-nav-indicator-label {
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .hero-nav-note {
          margin: 0;
          padding-top: var(--sp-2);
          border-top: 1px solid var(--border-1);
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-2);
        }

        .hero-nav-head {
          border-bottom: 1px solid var(--border-1);
          padding-bottom: var(--sp-3);
        }

        .hero-nav-title {
          margin: var(--sp-2) 0 0 0;
          font-family: var(--font-body);
          font-size: var(--ts-body);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--text-1);
          font-weight: 500;
        }

        .hero-shell a:focus-visible,
        .hero-shell button:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--text-1) 80%, white 20%);
          outline-offset: 2px;
        }

        @media (max-width: 1160px) {
          .hero-layout {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          }

          .hero-nav-wrap {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 840px) {
          .hero-layout {
            grid-template-columns: 1fr;
            padding-top: clamp(84px, 12vh, 104px);
            gap: var(--sp-4);
          }

          .hero-name {
            max-width: 12ch;
          }

          .hero-profile-row {
            grid-template-columns: 1fr;
            gap: 4px;
          }
        }
      `}</style>

      <div className="hero-backdrop" aria-hidden />
      <div className="hero-grid-overlay" aria-hidden />
      <div className="hero-top-rail" aria-hidden />

      <motion.div
        className="hero-layout"
        variants={revealContainer}
        initial={prefersReducedMotion ? "visible" : "hidden"}
        animate="visible"
        style={{ maxWidth }}
      >
        <motion.div variants={revealItem} className="hero-identity">
          <p className="hero-kicker">Design Engineer</p>
          <h1 className="hero-name">
            {firstName}
            <br />
            {lastName}
          </h1>
          <p className="hero-summary">
            I design digital products as coherent systems: clear information
            structure, strong navigation, and interface decisions that remain
            maintainable as scope grows.
          </p>

          <div className="hero-actions">
            <Link to="/projects" className="hero-action hero-action-primary">
              View Case Studies
              <ArrowUpRight size={14} strokeWidth={1.6} />
            </Link>
            <Link to="/prompt-notebook" className="hero-action hero-action-secondary">
              Open Notebook
            </Link>
            <a href="mailto:austncarsn@gmail.com" className="hero-action hero-action-secondary">
              Contact
            </a>
          </div>

          <a className="hero-email" href="mailto:austncarsn@gmail.com" aria-label="Email Austin Carson">
            <Mail size={14} strokeWidth={1.5} />
            austncarsn@gmail.com
          </a>
        </motion.div>

        <motion.aside variants={revealItem} className="hero-panel" aria-label="System profile">
          <div className="hero-panel-head">
            <p className="hero-panel-kicker">System Profile</p>
            <p className="hero-panel-version">v2026</p>
          </div>

          <dl className="hero-profile">
            {SYSTEM_PROFILE.map((row) => (
              <div key={row.label} className="hero-profile-row">
                <dt className="hero-profile-label">{row.label}</dt>
                <dd className="hero-profile-value">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="hero-principles">
            <p className="hero-principles-title">Operating Principles</p>
            <ul className="hero-principles-list">
              {OPERATING_PRINCIPLES.map((principle) => (
                <li key={principle} className="hero-principles-item">
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.aside>

        <motion.aside variants={revealItem} className="hero-nav-wrap" aria-label="Primary navigation panel">
          <header className="hero-nav-head">
            <p className="hero-nav-kicker">Navigation</p>
            <p className="hero-nav-title">Control Surface</p>
          </header>
          <div className="hero-nav-indicator" aria-hidden="true">
            {SECTION_NAV_ITEMS.map((section, index) => {
              const isActive = activeSection === section.href;
              return (
                <div
                  key={section.id}
                  className="hero-nav-indicator-row"
                  data-active={isActive ? "true" : "false"}
                >
                  <span className="hero-nav-indicator-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="hero-nav-indicator-label">{section.label}</span>
                  <span className="hero-nav-indicator-state" aria-hidden>
                    {isActive ? "active" : ""}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="hero-nav-note">Primary wheel is mounted as a global rail.</p>
        </motion.aside>
      </motion.div>
    </section>
  );
}
