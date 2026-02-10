/**
 * ResumePage.tsx — Resume with editorial design system
 *
 * Matches portfolio's CSS variable tokens, monochrome aesthetic,
 * and editorial typography. Print-optimized.
 */

import { motion } from "motion/react";
import { Download } from "lucide-react";
import { Link } from "react-router-dom";
import { useStaggerVariants } from "../components/motion-variants";

export function ResumePage() {
  const { container, item } = useStaggerVariants();

  return (
    <>
      <style>{`
        .resume-page-shell {
          display: flex;
          flex-direction: column;
          gap: var(--sp-6);
        }
        .resume-layout {
          max-width: 1120px;
          margin: 0 auto;
          padding: var(--sp-12) var(--sp-6);
        }
      `}</style>
      <div className="resume-page-shell">
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
      <div className="resume-layout">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
        >
      {/* Download Button */}
      <motion.div
        variants={item}
        style={{
          maxWidth: 800,
          margin: "0 auto var(--sp-8)",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={() => window.print()}
          aria-label="Download resume as PDF"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--sp-2)",
            padding: "var(--sp-2) var(--sp-5)",
            backgroundColor: "var(--selected-bg)",
            color: "var(--selected-fg)",
            fontSize: "var(--ts-caption)",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            textDecoration: "none",
            border: "none",
            cursor: "pointer",
            transition: "opacity 180ms ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          className="print:hidden"
        >
          <Download size={14} strokeWidth={1.5} />
          Download PDF
        </button>
      </motion.div>

      {/* Resume Container */}
      <motion.div
        variants={item}
        style={{
          maxWidth: 800,
          margin: "0 auto",
          backgroundColor: "var(--surface-1)",
          padding: "var(--sp-16) var(--sp-12)",
          border: "1px solid var(--border-1)",
        }}
        className="resume-content"
      >
        {/* HEADER */}
        <header style={{
          textAlign: "center",
          marginBottom: "var(--sp-8)",
          paddingBottom: "var(--sp-6)",
          borderBottom: "2px solid var(--text-1)",
        }}>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "2.25rem",
            fontWeight: 400,
            letterSpacing: "0.08em",
            marginBottom: "var(--sp-3)",
            textTransform: "uppercase",
          }}>
            Austin Carson
          </h1>
          <div style={{
            fontSize: "var(--ts-small)",
            color: "var(--text-2)",
            lineHeight: 1.6,
            fontFamily: "var(--font-body)",
          }}>
            Missoula, MT | (206) 620-4803 | austncarsn@gmail.com<br />
            austincarson.dev | linkedin.com/in/austncarsn | github.com/austncarsn
          </div>
        </header>

        {/* PROFESSIONAL SUMMARY */}
        <div style={{
          textAlign: "center",
          fontFamily: "var(--font-body)",
          fontSize: "var(--ts-caption)",
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}>
          AI Product Designer | Frontend Engineer
        </div>
        <p style={{
          fontSize: "var(--ts-small)",
          lineHeight: 1.6,
          marginBottom: "var(--sp-8)",
          color: "var(--text-1)",
        }}>
          I architect high-fidelity AI interfaces that synthesize technical rigor with human-centric heuristics. By integrating Reinforcement Learning from Human Feedback (RLHF) with sophisticated frontend architecture, I have mitigated model hallucinations by 15% across 3,500+ evaluations while engineering React applications that achieve 98/100 performance metrics. I am dedicated to the confluence of algorithmic precision and scalable, utilitarian design.
        </p>

        {/* EXPERIENCE */}
        <h2 style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--ts-caption)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          marginTop: "var(--sp-8)",
          marginBottom: "var(--sp-4)",
          paddingBottom: "var(--sp-2)",
          borderBottom: "1px solid var(--border-1)",
        }}>
          Experience
        </h2>

        <div style={{ marginBottom: "var(--sp-6)" }}>
          <div style={{ marginBottom: "var(--sp-2)" }}>
            <span style={{ fontWeight: 600 }}>AI Evaluator</span> |{" "}
            <span style={{ fontWeight: 500 }}>Various Platforms</span> |{" "}
            <span style={{ fontSize: "var(--ts-small)", color: "var(--text-2)", fontStyle: "italic" }}>
              2023 – Present
            </span>
          </div>
          <ul style={{
            listStyle: "disc",
            marginLeft: "var(--sp-6)",
            fontSize: "var(--ts-small)",
            lineHeight: 1.6,
          }}>
            <li style={{ marginBottom: "var(--sp-2)" }}>
              <strong>Model Quality Assurance:</strong> Audited 3,500+ generative AI outputs across text, code, and visual domains, identifying systemic hallucination patterns that reduced error rates by 12% in subsequent model retraining cycles
            </li>
            <li style={{ marginBottom: "var(--sp-2)" }}>
              <strong>Prompt Architecture:</strong> Developed comprehensive prompt taxonomy and evaluation frameworks, increasing annotation consistency by 15% across distributed human-in-the-loop evaluation teams
            </li>
            <li style={{ marginBottom: "var(--sp-2)" }}>
              <strong>Dataset Curation:</strong> Curated complex multimodal datasets (text/code/visual) to refine AI training pipelines, directly contributing to 23% reduction in code-generation syntax errors and improved reasoning accuracy
            </li>
            <li style={{ marginBottom: "var(--sp-2)" }}>
              <strong>Safety & Alignment:</strong> Rigorously evaluated model outputs for logic, reasoning accuracy, and safety parameters using RLHF methodologies to inform algorithmic alignment improvements
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: "var(--sp-6)" }}>
          <div style={{ marginBottom: "var(--sp-2)" }}>
            <span style={{ fontWeight: 600 }}>Client Specialist</span> |{" "}
            <span style={{ fontWeight: 500 }}>Swarovski Crystal</span> |{" "}
            <span style={{ fontSize: "var(--ts-small)", color: "var(--text-2)", fontStyle: "italic" }}>
              2024 – 2025
            </span>
          </div>
          <ul style={{
            listStyle: "disc",
            marginLeft: "var(--sp-6)",
            fontSize: "var(--ts-small)",
            lineHeight: 1.6,
          }}>
            <li style={{ marginBottom: "var(--sp-2)" }}>
              <strong>Revenue Performance:</strong> Consistently exceeded monthly sales acquisition targets by 20% through personalized client relationship management and data-driven experience design strategies
            </li>
            <li style={{ marginBottom: "var(--sp-2)" }}>
              <strong>Visual Merchandising:</strong> Designed and implemented spatial merchandising layouts using behavioral psychology principles, resulting in measurable increases in customer engagement and conversion rates
            </li>
            <li style={{ marginBottom: "var(--sp-2)" }}>
              <strong>Training Development:</strong> Created and facilitated technical training modules that improved team product knowledge retention by 30% and elevated client communication standards across retail locations
            </li>
            <li style={{ marginBottom: "var(--sp-2)" }}>
              <strong>Customer Analytics:</strong> Analyzed customer behavior patterns and preferences to optimize inventory recommendations and personalized outreach campaigns
            </li>
          </ul>
        </div>

        {/* PROJECTS */}
        <h2 style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--ts-caption)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          marginTop: "var(--sp-8)",
          marginBottom: "var(--sp-4)",
          paddingBottom: "var(--sp-2)",
          borderBottom: "1px solid var(--border-1)",
        }}>
          Projects
        </h2>

        <div style={{ marginBottom: "var(--sp-6)" }}>
          <div style={{ marginBottom: "var(--sp-2)" }}>
            <span style={{ fontWeight: 600 }}>Claude Opus 4.6 × Figma Make Prompt Library</span> |{" "}
            <span style={{ fontWeight: 500 }}>Production AI Tool</span> |{" "}
            <span style={{ fontSize: "var(--ts-small)", color: "var(--text-2)", fontStyle: "italic" }}>
              2025
            </span>
          </div>
          <ul style={{
            listStyle: "disc",
            marginLeft: "var(--sp-6)",
            fontSize: "var(--ts-small)",
            lineHeight: 1.6,
          }}>
            <li style={{ marginBottom: "var(--sp-2)" }}>
              <strong>Objective:</strong> Engineer comprehensive prompt library housing 100 production-ready agentic prompts across 8 categories with research-backed TC-EBC framework validated against 42+ sources
            </li>
            <li style={{ marginBottom: "var(--sp-2)" }}>
              <strong>Technical Execution:</strong> Built React 19 SPA with TypeScript achieving {'<'}2s time-to-interactive using code-splitting, lazy loading, and optimized state management with localStorage persistence
            </li>
            <li style={{ marginBottom: "var(--sp-2)" }}>
              <strong>Design System:</strong> Developed Cinematic Light theme with CSS variable design tokens, glass-panel effects, and Swiss-style category accents ensuring visual consistency across 15+ custom components
            </li>
            <li style={{ marginBottom: "var(--sp-2)" }}>
              <strong>Impact:</strong> Delivered production-hardened application with Cmd+K search, split-pane modals, favorites system, and full case study documentation demonstrating end-to-end product design capabilities
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: "var(--sp-6)" }}>
          <div style={{ marginBottom: "var(--sp-2)" }}>
            <span style={{ fontWeight: 600 }}>The Cameo Store</span> |{" "}
            <span style={{ fontWeight: 500 }}>E-commerce Platform</span> |{" "}
            <span style={{ fontSize: "var(--ts-small)", color: "var(--text-2)", fontStyle: "italic" }}>
              2025
            </span>
          </div>
          <ul style={{
            listStyle: "disc",
            marginLeft: "var(--sp-6)",
            fontSize: "var(--ts-small)",
            lineHeight: 1.6,
          }}>
            <li style={{ marginBottom: "var(--sp-2)" }}>
              <strong>Objective:</strong> Engineer frictionless e-commerce experience prioritizing micro-interactions, accessibility, and performance optimization for luxury retail market
            </li>
            <li style={{ marginBottom: "var(--sp-2)" }}>
              <strong>Technical Execution:</strong> Built highly performant frontend architecture using React, Next.js, and TypeScript, achieving 98/100 Lighthouse performance score with full WCAG 2.1 accessibility compliance
            </li>
            <li style={{ marginBottom: "var(--sp-2)" }}>
              <strong>Design System:</strong> Developed modular component library with Tailwind CSS ensuring visual consistency and rapid iteration capabilities across product pages, checkout flow, and user dashboard
            </li>
            <li style={{ marginBottom: "var(--sp-2)" }}>
              <strong>Impact:</strong> Delivered sub-2-second page load times with optimized image handling, lazy loading, and code splitting strategies to maximize conversion potential
            </li>
          </ul>
        </div>

        {/* SKILLS */}
        <h2 style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--ts-caption)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          marginTop: "var(--sp-8)",
          marginBottom: "var(--sp-4)",
          paddingBottom: "var(--sp-2)",
          borderBottom: "1px solid var(--border-1)",
        }}>
          Skills
        </h2>

        <div style={{
          fontSize: "var(--ts-small)",
          lineHeight: 1.6,
        }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontWeight: 600 }}>AI/Machine Learning:</span> RLHF Evaluation, Prompt Engineering, Model Auditing, Bias Detection, Algorithmic Alignment, LangChain, OpenAI API, GPT Integration, Claude API, Multimodal AI Systems
          </div>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontWeight: 600 }}>Frontend Engineering:</span> React, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Responsive Design, Performance Optimization, Lighthouse Optimization, Git/GitHub, API Integration
          </div>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontWeight: 600 }}>Design & UX:</span> Figma, Adobe Creative Suite (Photoshop, Illustrator), UI/UX Design, Interaction Design, Design Systems, Accessibility (WCAG 2.1), User Research, A/B Testing, Wireframing, Prototyping
          </div>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontWeight: 600 }}>Methodologies:</span> Heuristic Analysis, Human-Centered Design, Agile Development, User Testing, Data-Driven Design, Behavioral Psychology, Information Architecture
          </div>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontWeight: 600 }}>Technical Tools:</span> VS Code, npm/yarn, Vercel, Netlify, Chrome DevTools, Postman, REST APIs, JSON, HTML5, CSS3, Markdown
          </div>
        </div>

        {/* EDUCATION */}
        <h2 style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--ts-caption)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          marginTop: "var(--sp-8)",
          marginBottom: "var(--sp-4)",
          paddingBottom: "var(--sp-2)",
          borderBottom: "1px solid var(--border-1)",
        }}>
          Education
        </h2>

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            Bachelor of Science, Biological Sciences
          </div>
          <div style={{ fontSize: "var(--ts-small)", color: "var(--text-2)" }}>
            Southern Methodist University, Dallas, TX | 2020
          </div>
          <div style={{ fontSize: "var(--ts-small)", color: "var(--text-2)", marginTop: 4 }}>
            Relevant Coursework: Data Analysis, Statistical Methods, Research Methodology, Scientific Communication
          </div>
        </div>

        {/* PORTFOLIO */}
        <h2 style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--ts-caption)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          marginTop: "var(--sp-8)",
          marginBottom: "var(--sp-4)",
          paddingBottom: "var(--sp-2)",
          borderBottom: "1px solid var(--border-1)",
        }}>
          Portfolio
        </h2>

        <div style={{
          fontSize: "var(--ts-small)",
          lineHeight: 1.6,
        }}>
          <div style={{ marginBottom: 4 }}>
            <strong>Website:</strong>{" "}
            <a
              href="https://austincarson.dev"
              style={{
                color: "var(--text-1)",
                textDecoration: "underline",
                textDecorationColor: "var(--border-1)",
              }}
            >
              austincarson.dev
            </a>
          </div>
          <div>
            <strong>GitHub:</strong>{" "}
            <a
              href="https://github.com/austncarsn"
              style={{
                color: "var(--text-1)",
                textDecoration: "underline",
                textDecorationColor: "var(--border-1)",
              }}
            >
              github.com/austncarsn
            </a>
          </div>
        </div>
      </motion.div>

      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .resume-content {
            box-shadow: none !important;
            padding: 0.5in !important;
            border: none !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </motion.div>
      </div>
      </div>
    </>
  );
}
