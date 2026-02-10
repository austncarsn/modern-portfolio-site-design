import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { projects } from "../data/projects";
import { useStaggerVariants } from "../components/motion-variants";

export function ProjectsPage() {
  const { container, item } = useStaggerVariants();
  const totalProjects = projects.length;

  return (
    <>
      <style>{`
        .projects-page-shell {
          display: flex;
          flex-direction: column;
          gap: var(--sp-6);
          background:
            radial-gradient(circle at 84% 20%, color-mix(in srgb, var(--surface-2) 70%, transparent) 0%, transparent 45%),
            var(--surface-0);
        }
        .projects-layout {
          max-width: 1120px;
          margin: 0 auto;
          padding: var(--sp-12) var(--sp-6);
        }
        .projects-header {
          margin-bottom: var(--sp-10);
          max-width: 760px;
        }
        .projects-overline {
          font-size: var(--ts-overline);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-2);
          margin: 0 0 var(--sp-3) 0;
          font-family: var(--font-body);
        }
        .projects-rule {
          width: var(--sp-6);
          height: 1px;
          background: var(--border-1);
          margin-bottom: var(--sp-4);
        }
        .projects-section-id {
          margin: 0 0 var(--sp-4) 0;
          font-size: var(--ts-overline);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-2);
          font-family: var(--font-body);
        }
        .projects-title {
          font-family: var(--font-display);
          font-size: clamp(2.1rem, 5.8vw, 3.75rem);
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 0.98;
          margin: 0 0 var(--sp-4) 0;
          color: var(--text-1);
        }
        .projects-lede {
          font-size: clamp(1rem, 1.2vw, 1.08rem);
          line-height: 1.6;
          color: var(--text-2);
          margin: 0 0 var(--sp-5) 0;
          max-width: 64ch;
        }
        .projects-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--sp-2);
        }
        .projects-pill {
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
          border: 1px solid var(--border-1);
          padding: 6px 10px;
          font-size: var(--ts-overline);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-2);
          background: color-mix(in srgb, var(--surface-1) 80%, transparent);
        }
        .projects-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--sp-4);
        }
        @media (min-width: 860px) {
          .projects-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        .project-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 280px;
          padding: var(--sp-6);
          border: 1px solid var(--border-1);
          text-decoration: none;
          color: var(--text-1);
          background:
            linear-gradient(180deg, color-mix(in srgb, var(--surface-1) 62%, transparent) 0%, var(--surface-0) 100%);
          transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }
        .project-card:hover {
          transform: translateY(-2px);
          border-color: color-mix(in srgb, var(--text-2) 38%, var(--border-1));
          box-shadow: 0 12px 26px rgba(24, 24, 24, 0.09);
          background: linear-gradient(180deg, var(--surface-1) 0%, var(--surface-0) 100%);
        }
        .project-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--sp-4);
        }
        .project-index {
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-2);
        }
        .project-arrow {
          width: 24px;
          height: 24px;
          border: 1px solid var(--border-1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--text-2);
          background: color-mix(in srgb, var(--surface-1) 75%, transparent);
          transition: transform 180ms ease, color 180ms ease, border-color 180ms ease;
        }
        .project-card:hover .project-arrow {
          transform: translate(2px, -2px);
          color: var(--text-1);
          border-color: color-mix(in srgb, var(--text-2) 42%, var(--border-1));
        }
        .project-title {
          font-family: var(--font-display);
          font-size: clamp(1.45rem, 2.2vw, 1.9rem);
          font-weight: 400;
          letter-spacing: -0.012em;
          line-height: 1.08;
          margin: 0;
        }
        .project-summary {
          font-size: var(--ts-caption);
          line-height: 1.55;
          color: var(--text-2);
          margin-top: var(--sp-3);
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .project-tags {
          display: flex;
          gap: var(--sp-2);
          flex-wrap: wrap;
          margin-top: var(--sp-6);
        }
        .project-tag {
          font-size: var(--ts-overline);
          padding: 2px 8px;
          border: 1px solid var(--border-1);
          color: var(--text-2);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: color-mix(in srgb, var(--surface-1) 62%, transparent);
        }
      `}</style>
      <div className="projects-page-shell">
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
      <div className="projects-layout">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
        >
      {/* Page header */}
      <motion.header variants={item} className="projects-header">
        <p className="projects-overline">Portfolio Archive</p>
        <div className="projects-rule" />
        <p className="projects-section-id">Section · Case Studies</p>
        <h1 className="projects-title">Case Studies</h1>
        <p className="projects-lede">
          End-to-end documentation of design engineering projects — from problem
          framing through technical execution to measurable outcomes.
        </p>
        <div className="projects-meta">
          <span className="projects-pill">{totalProjects} studies</span>
          <span className="projects-pill">Product + Engineering</span>
          <span className="projects-pill">Updated 2026</span>
        </div>
      </motion.header>

      {/* Project grid */}
      <div className="projects-grid">
        {projects.map((project, index) => {
          let detailPath = `/projects/${project.id}`;
          if (project.id === "claude-opus-prompt-library") {
            detailPath = "/prompt-library#case-study";
          } else if (project.id === "myprompts-ide") {
            detailPath = "/prompt-notebook#case-study";
          } else if (project.id === "the-cameo-store") {
            detailPath = "/cameo-store/case-study";
          } else if (project.id === "railroad-track-divider") {
            detailPath = "/railroad-track-divider";
          }

          return (
            <motion.div key={project.id} variants={item}>
              <Link
                to={detailPath}
                className="project-card"
              >
              <div>
                <div className="project-card-top">
                  <span className="project-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="project-arrow">
                    <ArrowUpRight size={12} strokeWidth={1.6} />
                  </span>
                </div>
                <h2 className="project-title">{project.title}</h2>
                <p className="project-summary">
                  {project.summary.length > 120
                    ? project.summary.slice(0, 120) + "..."
                    : project.summary}
                </p>
              </div>

              <div className="project-tags">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="project-tag">
                    {tag}
                  </span>
                ))}
                {project.tags.length > 3 && (
                  <span className="project-tag">
                    +{project.tags.length - 3}
                  </span>
                )}
              </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
      </div>
      </div>
    </>
  );
}
