import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useStaggerVariants } from "../components/motion-variants";
import { RailroadTrackDivider } from "../components/RailroadTrackDivider";

const FIGMA_SOURCE_URL =
  "https://www.figma.com/design/4A3l5WLd6P0zSOIetOR5lj/Railroad-Track-Divider-Component";

export function RailroadTrackCaseStudyPage() {
  const { container, item } = useStaggerVariants();

  return (
    <>
      <style>{`
        .rail-page-shell {
          display: flex;
          flex-direction: column;
          gap: var(--sp-6);
        }
        .rail-layout {
          max-width: 1120px;
          margin: 0 auto;
          padding: var(--sp-12) var(--sp-6);
        }
        .rail-article {
          max-width: 840px;
        }
        .rail-overline {
          font-size: var(--ts-overline);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-2);
          margin: 0 0 var(--sp-3) 0;
          font-family: var(--font-body);
        }
        .rail-rule {
          width: var(--sp-6);
          height: 1px;
          background: var(--border-1);
          margin-bottom: var(--sp-4);
        }
        .rail-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5.2vw, 3.7rem);
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 0.98;
          margin: 0 0 var(--sp-4) 0;
          color: var(--text-1);
        }
        .rail-lede {
          font-size: clamp(1rem, 1.15vw, 1.08rem);
          line-height: 1.62;
          color: var(--text-2);
          margin: 0 0 var(--sp-5) 0;
          max-width: 64ch;
        }
        .rail-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--sp-2);
          margin-bottom: var(--sp-10);
        }
        .rail-pill {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--border-1);
          padding: 6px 10px;
          font-size: var(--ts-overline);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-2);
          background: color-mix(in srgb, var(--surface-1) 78%, transparent);
        }
        .rail-demo {
          border: 1px solid var(--border-1);
          background: color-mix(in srgb, var(--surface-1) 74%, transparent);
          padding: var(--sp-5);
          margin-bottom: var(--sp-8);
        }
        .rail-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--sp-4);
        }
        @media (min-width: 900px) {
          .rail-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        .rail-card {
          border: 1px solid var(--border-1);
          background: color-mix(in srgb, var(--surface-1) 72%, transparent);
          padding: var(--sp-5);
        }
        .rail-card-title {
          font-size: var(--ts-overline);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-2);
          margin-bottom: var(--sp-3);
          font-family: var(--font-body);
        }
        .rail-card-text {
          font-size: var(--ts-body);
          line-height: 1.62;
          color: var(--text-1);
        }
      `}</style>
      <div className="rail-page-shell">
        <div
          style={{
            padding: "var(--sp-4) var(--sp-4) var(--sp-3)",
            borderBottom: "1px solid var(--border-1)",
            background: "var(--surface-1)",
          }}
        >
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--sp-2)",
              border: "1px solid var(--border-1)",
              background: "transparent",
              color: "var(--text-1)",
              padding: "8px 12px",
              fontSize: "var(--ts-overline)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Back to Home
          </Link>
        </div>

        <div className="rail-layout">
          <motion.article
            variants={container}
            initial="hidden"
            animate="visible"
            className="rail-article"
          >
            <motion.header variants={item}>
              <p className="rail-overline">Case Study</p>
              <div className="rail-rule" />
              <h1 className="rail-title">Railroad Track Divider Component</h1>
              <p className="rail-lede">
                A precision UI divider inspired by N-scale rail geometry, built
                as a reusable SVG component that can operate as a minimal line
                separator or a premium animated presentation element.
              </p>
              <div className="rail-meta">
                <span className="rail-pill">React</span>
                <span className="rail-pill">TypeScript</span>
                <span className="rail-pill">Motion</span>
                <span className="rail-pill">SVG Systems</span>
              </div>
            </motion.header>

            <motion.section variants={item} className="rail-demo">
              <RailroadTrackDivider
                height={70}
                maxWidth="100%"
                accent="blue"
                ariaLabel="Railroad divider demo"
              />
            </motion.section>

            <motion.section variants={item} className="rail-grid">
              <article className="rail-card">
                <h2 className="rail-card-title">Problem</h2>
                <p className="rail-card-text">
                  Standard divider lines often feel generic and disconnected
                  from brand narrative. This project explores how a structural
                  motif can double as navigation rhythm and identity.
                </p>
              </article>
              <article className="rail-card">
                <h2 className="rail-card-title">Goals</h2>
                <p className="rail-card-text">
                  Build a reusable horizontal divider with clean scaling,
                  controllable detail levels, and optional train motion while
                  keeping rendering crisp at multiple viewport widths.
                </p>
              </article>
              <article className="rail-card">
                <h2 className="rail-card-title">Approach</h2>
                <p className="rail-card-text">
                  Used integer-aligned SVG geometry for rail/tie proportions,
                  variant-driven props for size and accent, and motion-aware
                  behavior for progressive enhancement.
                </p>
              </article>
              <article className="rail-card">
                <h2 className="rail-card-title">Outcome</h2>
                <p className="rail-card-text">
                  Delivered a modular divider system now integrated into the
                  portfolio hero as a max-width horizontal element. Original
                  concept source remains available in Figma.
                </p>
                <a
                  href={FIGMA_SOURCE_URL}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "var(--sp-3)",
                    fontSize: "var(--ts-caption)",
                    color: "var(--text-2)",
                    textDecoration: "underline",
                  }}
                >
                  Open Figma Source
                </a>
              </article>
            </motion.section>
          </motion.article>
        </div>
      </div>
    </>
  );
}
