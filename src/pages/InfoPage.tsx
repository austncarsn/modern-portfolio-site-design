import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useStaggerVariants } from "../components/motion-variants";

export function InfoPage() {
  const { container, item } = useStaggerVariants();

  return (
    <>
      <style>{`
        .info-page-shell {
          display: flex;
          flex-direction: column;
          gap: var(--sp-6);
        }
        .info-layout {
          max-width: 1120px;
          margin: 0 auto;
          padding: var(--sp-12) var(--sp-6);
        }
        .info-article {
          max-width: 760px;
          background: linear-gradient(180deg, color-mix(in srgb, var(--surface-1) 75%, transparent) 0%, transparent 100%);
          border: 1px solid color-mix(in srgb, var(--border-1) 85%, #ffffff 15%);
          padding: clamp(18px, 2.4vw, 34px);
        }
        .info-role {
          font-size: var(--ts-overline);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: color-mix(in srgb, var(--text-2) 92%, #ffffff 8%);
          font-weight: 500;
          margin: 0 0 12px 0;
          font-family: var(--font-body);
        }
        .info-rule {
          width: var(--sp-5);
          height: 1px;
          background-color: var(--border-1);
          margin-bottom: var(--sp-4);
        }
        .info-name {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 7.4vw, 4.6rem);
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1.02;
          margin: 0 0 18px 0;
          color: var(--text-1);
        }
        .info-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--sp-3);
          font-size: 0.94rem;
          color: color-mix(in srgb, var(--text-2) 95%, #ffffff 5%);
          letter-spacing: 0.02em;
          margin-bottom: var(--sp-8);
        }
        .info-body {
          display: flex;
          flex-direction: column;
          gap: var(--sp-6);
          font-size: var(--ts-body);
          line-height: 1.68;
          color: color-mix(in srgb, var(--text-1) 94%, #ffffff 6%);
          max-width: 64ch;
        }
        .info-break {
          width: 40px;
          height: 1px;
          background-color: color-mix(in srgb, var(--border-1) 85%, #ffffff 15%);
          margin: var(--sp-2) 0;
        }
      `}</style>
      <div className="info-page-shell">
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
      <div className="info-layout">
        <motion.article
          variants={container}
          initial="hidden"
          animate="visible"
          className="info-article"
        >
          {/* Header */}
          <motion.header variants={item} style={{ marginBottom: "var(--sp-2)" }}>
            <p className="info-role">
              Design Engineer
            </p>
            <div className="info-rule" />
            <h1 className="info-name">
              Austin Carson
            </h1>
            <div className="info-meta">
              <span>Missoula</span>
              <span style={{ color: "var(--border-1)" }} aria-hidden="true">/</span>
              <span>Gazpacho</span>
              <span style={{ color: "var(--border-1)" }} aria-hidden="true">/</span>
              <span>Creative Development</span>
            </div>
          </motion.header>

          {/* Body */}
          <div className="info-body">
            <motion.p variants={item}>
              I build practical web applications that solve real workflow problems.
              Most of my projects start as tools I need myself, then evolve into
              products with rigorous design systems and performance standards.
            </motion.p>
            <div className="info-break" aria-hidden />
            <motion.p variants={item}>
              AI is a core part of my development practice. I use Claude, GPT, and
              other models as instruments for rapid prototyping, design iteration,
              and code generation. This portfolio site was built entirely with AI
              assistance—starting from architectural planning through final
              implementation.
            </motion.p>
            <div className="info-break" aria-hidden />
            <motion.p variants={item}>
              I came to development from luxury retail, which shaped how I think
              about craft and perceived value. This portfolio's editorial
              aesthetic—monochrome palette, museum-quality spacing, avant-garde
              typography—is deliberate. It signals systems thinking and attention
              to detail without relying on flashy gradients or superficial trends.
            </motion.p>
          </div>
        </motion.article>

      </div>
      </div>
    </>
  );
}
