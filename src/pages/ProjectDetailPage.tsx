import { useRef, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  ExternalLink,
  Github,
  BookOpen,
  Calendar,
  Clock,
  Layers,
  Target,
  Lightbulb,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { projects } from "../data/projects";
import { useStaggerVariants } from "../components/motion-variants";
import { EastTexasCaseStudyPage } from "./EastTexasCaseStudyPage";

const IS_PROMPT_LIBRARY = (id?: string) => id === "claude-opus-prompt-library";
const IS_CAMEO_STORE = (id?: string) => id === "the-cameo-store";
const IS_EAST_TEXAS = (id?: string) => id === "east-texas-heritage";

/* ── Section icon map ──────────────────────────────────────────────────── */
const SECTION_META: Record<string, { icon: React.ElementType; accent: string }> = {
  Problem: { icon: Target, accent: "var(--surface-2)" },
  Goals: { icon: Lightbulb, accent: "var(--surface-2)" },
  Approach: { icon: Layers, accent: "var(--surface-2)" },
  Outcome: { icon: TrendingUp, accent: "var(--surface-2)" },
};

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const caseStudyRef = useRef<HTMLDivElement>(null);
  const { container, item, prefersReduced } = useStaggerVariants();

  const project = projects.find((p) => p.id === id);
  const projectIndex = projects.findIndex((p) => p.id === id);

  if (!project) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.4 }}
        style={{ textAlign: "center", padding: "var(--sp-20) 0" }}
      >
        <h1
          style={{
            fontSize: "var(--ts-h1)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          Project not found
        </h1>
        <Link
          to="/projects"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--sp-2)",
            marginTop: "var(--sp-6)",
            fontSize: "var(--ts-caption)",
            fontWeight: 500,
            color: "var(--text-1)",
            textDecoration: "none",
          }}
        >
          Back to Projects
        </Link>
      </motion.div>
    );
  }

  if (IS_EAST_TEXAS(project.id)) {
    return <EastTexasCaseStudyPage />;
  }

  const isPromptLib = IS_PROMPT_LIBRARY(project.id);
  const isCameoStore = IS_CAMEO_STORE(project.id);

  const sections = [
    { heading: "Problem", body: project.problem },
    { heading: "Goals", body: project.goals },
    { heading: "Approach", body: project.approach },
    { heading: "Outcome", body: project.outcome },
  ];

  useEffect(() => {
    if (location.hash === '#case-study') {
      // scroll to the case study anchor if present
      setTimeout(() => caseStudyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }, [location.hash]);

  // Next/Prev navigation
  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const nextProject =
    projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  return (
    <>
      <style>{`
        .detail-page-shell {
          display: flex;
          flex-direction: column;
          gap: var(--sp-6);
        }
        .detail-layout {
          max-width: 1120px;
          margin: 0 auto;
          padding: var(--sp-12) var(--sp-6);
        }
      `}</style>
      <div className="detail-page-shell">
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
      <div className="detail-layout">
        <motion.article
          variants={container}
          initial="hidden"
          animate="visible"
          style={{ maxWidth: 720 }}
        >
      <motion.header variants={item} style={{ marginBottom: "var(--sp-12)" }}>
        {/* Project number + meta bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--sp-4)",
            marginBottom: "var(--sp-5)",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--ts-overline)",
              fontWeight: 500,
              color: "var(--text-2)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "3px 10px",
              border: "1px solid var(--border-1)",
            }}
          >
            {String(projectIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--sp-3)",
              fontSize: "var(--ts-overline)",
              color: "var(--text-2)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "var(--font-body)",
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Calendar size={11} strokeWidth={2} />
              2024–2025
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Clock size={11} strokeWidth={2} />
              Solo
            </span>
          </div>
        </div>

        {/* Title */}
        {isPromptLib ? (
          <>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                marginBottom: 4,
              }}
            >
              Claude Opus 4.6 × Figma Make
            </h1>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                marginBottom: "var(--sp-5)",
                color: "var(--text-2)",
              }}
            >
              Prompt Library
            </h1>
          </>
        ) : (
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: "var(--sp-5)",
            }}
          >
            {project.title}
          </h1>
        )}

        {/* Summary / lede */}
        <p
          style={{
            fontSize: "var(--ts-h3)",
            lineHeight: 1.45,
            color: "var(--text-2)",
            letterSpacing: "-0.005em",
            maxWidth: 600,
          }}
        >
          {project.summary}
        </p>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: "var(--sp-2)",
            marginTop: "var(--sp-5)",
            flexWrap: "wrap",
          }}
        >
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "var(--ts-overline)",
                padding: "3px 10px",
                border: "1px solid var(--border-1)",
                color: "var(--text-2)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.header>

      {/* ── Case study sections ── */}
      <div id="case-study" ref={caseStudyRef} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--sp-10)",
        }}
      >
        {sections.map((s) => {
          const meta = SECTION_META[s.heading] || {
            icon: Zap,
            accent: "rgba(11, 15, 26, 0.04)",
          };
          const Icon = meta.icon;

          return (
            <motion.section key={s.heading} variants={item}>
              {/* Section label with icon */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--sp-2)",
                  marginBottom: "var(--sp-4)",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: meta.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={14} strokeWidth={1.5} style={{ color: "var(--text-2)" }} />
                </div>
                <h2
                  style={{
                    fontSize: "var(--ts-overline)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    color: "var(--text-2)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {s.heading}
                </h2>
              </div>

              {/* Section body */}
              <p
                style={{
                  fontSize: "var(--ts-body)",
                  lineHeight: 1.6,
                  color: "var(--text-1)",
                  letterSpacing: "0.005em",
                  paddingLeft: 40,
                }}
              >
                {s.body}
              </p>
            </motion.section>
          );
        })}
      </div>

      {/* ── Action links ── */}
      <motion.div
        variants={item}
        style={{
          marginTop: "var(--sp-12)",
          paddingTop: "var(--sp-8)",
          borderTop: "1px solid var(--border-1)",
          display: "flex",
          gap: "var(--sp-3)",
          flexWrap: "wrap",
        }}
      >
        {/* Prompt library — primary CTA */}
        {isPromptLib && (
          <Link
            to="/prompt-library"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--sp-2)",
              padding: "10px 20px",
              backgroundColor: "var(--selected-bg)",
              color: "var(--selected-fg)",
              fontSize: "var(--ts-caption)",
              fontWeight: 500,
              textDecoration: "none",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              transition: "opacity 180ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <BookOpen size={14} strokeWidth={1.5} />
            Explore Prompt Library
          </Link>
        )}

        {/* Repository */}
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--sp-2)",
            padding: "10px 20px",
            border: "1px solid var(--border-1)",
            fontSize: "var(--ts-caption)",
            fontWeight: 500,
            color: "var(--text-1)",
            textDecoration: "none",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            transition: "background-color 180ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--surface-1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <Github size={14} strokeWidth={1.5} />
          Repository
        </a>

        {/* Cameo: open internal app + built case study */}
        {isCameoStore && (
          <>
            <Link
              to="/cameo-store/case-study"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--sp-2)",
                padding: "10px 20px",
                backgroundColor: "var(--selected-bg)",
                color: "var(--selected-fg)",
                fontSize: "var(--ts-caption)",
                fontWeight: 500,
                textDecoration: "none",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                transition: "opacity 180ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.85";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <BookOpen size={14} strokeWidth={1.5} />
              Built Case Study
            </Link>
            <Link
              to="/cameo-store"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--sp-2)",
                padding: "10px 20px",
                border: "1px solid var(--border-1)",
                fontSize: "var(--ts-caption)",
                fontWeight: 500,
                color: "var(--text-1)",
                textDecoration: "none",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                transition: "background-color 180ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--surface-1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ExternalLink size={14} strokeWidth={1.5} />
              Open Store
            </Link>
          </>
        )}

        {!isCameoStore && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--sp-2)",
              padding: "10px 20px",
              backgroundColor: "var(--selected-bg)",
              color: "var(--selected-fg)",
              fontSize: "var(--ts-caption)",
              fontWeight: 500,
              textDecoration: "none",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              transition: "opacity 180ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
            }}
          >
            <ExternalLink size={14} strokeWidth={1.5} />
            Live Demo
          </a>
        )}
      </motion.div>

      {/* ── Prev / Next navigation ── */}
      <motion.div
        variants={item}
        style={{
          marginTop: "var(--sp-16)",
          paddingTop: "var(--sp-8)",
          borderTop: "1px solid var(--border-1)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--sp-4)",
        }}
      >
        {/* Previous */}
        <div>
          {prevProject && (
            <Link
              to={`/projects/${prevProject.id}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                textDecoration: "none",
                color: "var(--text-1)",
                padding: "var(--sp-4)",
                transition: "background-color 180ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--surface-1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <span
                style={{
                  fontSize: "var(--ts-overline)",
                  fontWeight: 500,
                  color: "var(--text-2)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Previous
              </span>
              <span
                style={{
                  fontSize: "var(--ts-caption)",
                  fontWeight: 500,
                  lineHeight: 1.45,
                }}
              >
                {prevProject.title}
              </span>
            </Link>
          )}
        </div>

        {/* Next */}
        <div style={{ textAlign: "right" }}>
          {nextProject && (
            <Link
              to={`/projects/${nextProject.id}`}
              style={{
                display: "inline-flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 4,
                textDecoration: "none",
                color: "var(--text-1)",
                padding: "var(--sp-4)",
                transition: "background-color 180ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--surface-1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <span
                style={{
                  fontSize: "var(--ts-overline)",
                  fontWeight: 500,
                  color: "var(--text-2)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Next
              </span>
              <span
                style={{
                  fontSize: "var(--ts-caption)",
                  fontWeight: 500,
                  lineHeight: 1.45,
                }}
              >
                {nextProject.title}
              </span>
            </Link>
          )}
        </div>
      </motion.div>
    </motion.article>
      </div>
      </div>
    </>
  );
}
