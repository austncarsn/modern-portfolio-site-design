import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Code,
  Eye,
  GitBranch,
  Layers,
  Lightbulb,
  MapPin,
  Palette,
  Shield,
  Target,
  Users,
} from "lucide-react";
import { PageTransition } from "../components/PageTransition";

const CASE_STUDY_META = {
  title: "East Texas Historical Archive",
  role: "Design Engineer + Client Advisor",
  timeline: "2025–2026 (ongoing)",
  stack: ["React 18", "TypeScript", "Tailwind CSS v4", "Lucide Icons", "Radix UI Primitives"],
  oneLiner:
    "A comprehensive digital archive preserving the architectural and industrial heritage of twelve Northeast Texas towns through editorial-quality presentation, structured historical narratives, and interactive cartography.",
  deliverables: [
    "Design system (tokens, components, editorial patterns)",
    "UI engineering (4 page-level views, 15+ components)",
    "Information architecture (config-driven town microsites)",
    "Data visualization (SVG atlas with proximity mapping)",
    "Content structure (typed history schema with 4 section types)",
    "Advisory (aesthetic direction, codebase architecture, refactoring strategy)",
  ],
};

const DECISION_LOG = [
  {
    decision: "Static TypeScript data files over API/database",
    rationale:
      "Maximizes content integrity and eliminates loading states. Historical data changes infrequently; the tradeoff is requiring code deployments for content updates.",
    risk: "Scaling to 50+ towns would make the bundle significantly larger.",
  },
  {
    decision: "Hash-based routing over file-based Next.js routing",
    rationale:
      "Enables single-file SPA deployment with no server configuration. All routes resolve client-side.",
    risk: "No SEO indexing of individual town pages without additional tooling.",
  },
  {
    decision: "Custom SVG atlas over Mapbox/Leaflet",
    rationale:
      "Eliminates external API dependency, keeps bundle lightweight, and allows full design-system integration.",
    risk: "No terrain or geocoding. Suitable for relational visualization, not navigation.",
  },
  {
    decision: "Inline markdown parser over remark/rehype",
    rationale:
      "History content needs only bold and italic. A tiny regex parser avoids pulling in a full Markdown pipeline.",
    risk: "Adding tables, links, or images would require parser expansion.",
  },
];

const GALLERY_SHOTS = [
  {
    caption:
      "Homepage Hero — full-viewport editorial entrance with Playfair Display typography and dual CTAs",
    route: "# (HomePage)",
    component: "HeroSection in HomePage.tsx",
  },
  {
    caption:
      "Town Index — 3-column card grid with lazy-loaded images, county kickers, and hover-reveal arrows",
    route: "#communities (HomePage)",
    component: "CommunitiesSection + TownCard",
  },
  {
    caption:
      "SVG Atlas — population-scaled markers, proximity connectors, hover tooltips, and category filters",
    route: "#map (MapPage)",
    component: "MapPage.tsx",
  },
];

const TOC_ITEMS = [
  { id: "context", label: "Context" },
  { id: "goals", label: "Goals" },
  { id: "role", label: "My Role" },
  { id: "approach", label: "Approach" },
  { id: "solution", label: "Solution" },
];

function Reveal({
  children,
  delay = 0,
  duration = 700,
  offset = 10,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  offset?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: offset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: duration / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({ overline, title, id }: { overline: string; title: string; id?: string }) {
  return (
    <div id={id} style={{ marginBottom: "var(--sp-8)" }}>
      <div
        style={{
          fontSize: "var(--ts-overline)",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "var(--text-2)",
          marginBottom: "var(--sp-3)",
        }}
      >
        {overline}
      </div>
      <div style={{ width: 28, height: 1, background: "var(--border-1)" }} />
      <h2
        style={{
          marginTop: "var(--sp-4)",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
          letterSpacing: "-0.02em",
          lineHeight: 0.95,
          color: "var(--text-1)",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: "var(--sp-6)", border: "1px solid var(--border-1)" }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          letterSpacing: "-0.015em",
          lineHeight: 1.02,
          color: "var(--text-1)",
          marginBottom: "var(--sp-2)",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "var(--text-2)",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function CaseStudyNav() {
  return (
    <nav style={{ position: "sticky", top: "calc(56px + var(--sp-8))" }}>
      <div style={{ paddingBottom: "var(--sp-3)", borderBottom: "1px solid var(--border-1)", marginBottom: "var(--sp-6)" }}>
        <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-2)" }}>
          Sections
        </span>
      </div>
      <div style={{ display: "grid", gap: "var(--sp-3)" }}>
        {TOC_ITEMS.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            style={{
              display: "flex",
              gap: "var(--sp-3)",
              textDecoration: "none",
              padding: "var(--sp-1) 0",
            }}
          >
            <span style={{ fontSize: 12, color: "var(--text-2)" }}>{String(index + 1).padStart(2, "0")}</span>
            <span style={{ fontSize: 14, color: "var(--text-2)" }}>{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

export function EastTexasCaseStudyPage() {
  return (
    <PageTransition>
      <div style={{ minHeight: "100vh", background: "var(--surface-0)", color: "var(--text-1)" }}>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: "var(--surface-0)",
            borderBottom: "1px solid var(--border-1)",
            height: 56,
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              width: "100%",
              padding: "0 var(--sp-6)",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--sp-2)",
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "var(--text-2)",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>
        </div>

        <header
          style={{
            paddingTop: "calc(56px + var(--sp-12))",
            paddingBottom: "var(--sp-10)",
            borderBottom: "1px solid var(--border-1)",
          }}
        >
          <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", padding: "0 var(--sp-6)" }}>
            <div style={{ maxWidth: 900 }}>
              <Reveal delay={80} duration={700}>
                <div
                  style={{
                    fontSize: "var(--ts-overline)",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "var(--text-2)",
                    marginBottom: "var(--sp-4)",
                  }}
                >
                  Case Study - 2025-2026
                </div>
                <div style={{ width: 28, height: 1, background: "var(--border-1)" }} />
              </Reveal>

              <Reveal delay={200} duration={850} offset={14}>
                <h1
                  style={{
                    marginTop: "var(--sp-6)",
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(2.5rem, 8vw, 5rem)",
                    letterSpacing: "-0.02em",
                    lineHeight: 0.95,
                    color: "var(--text-1)",
                  }}
                >
                  East Texas
                  <br />
                  Historical Archive
                </h1>
              </Reveal>

              <Reveal delay={350} duration={700}>
                <p
                  style={{
                    marginTop: "var(--sp-8)",
                    fontSize: 18,
                    lineHeight: 1.5,
                    color: "var(--text-2)",
                    maxWidth: 720,
                  }}
                >
                  {CASE_STUDY_META.oneLiner}
                </p>
              </Reveal>

              <Reveal delay={450} duration={650}>
                <div
                  style={{
                    marginTop: "var(--sp-10)",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "var(--sp-6)",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-2)", marginBottom: "var(--sp-2)" }}>
                      Role
                    </div>
                    <div style={{ fontSize: 16, color: "var(--text-1)" }}>{CASE_STUDY_META.role}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-2)", marginBottom: "var(--sp-2)" }}>
                      Timeline
                    </div>
                    <div style={{ fontSize: 16, color: "var(--text-1)" }}>{CASE_STUDY_META.timeline}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-2)", marginBottom: "var(--sp-2)" }}>
                      Stack
                    </div>
                    <div style={{ fontSize: 14, color: "var(--text-1)" }}>{CASE_STUDY_META.stack.slice(0, 3).join(" / ")}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-2)", marginBottom: "var(--sp-2)" }}>
                      Status
                    </div>
                    <div style={{ fontSize: 16, color: "var(--text-1)" }}>Production (ongoing)</div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={500} duration={600}>
                <div style={{ marginTop: "var(--sp-10)", paddingTop: "var(--sp-6)", borderTop: "1px solid var(--border-1)" }}>
                  <div
                    style={{
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "var(--text-2)",
                      marginBottom: "var(--sp-5)",
                    }}
                  >
                    Deliverables
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--sp-3)" }}>
                    {CASE_STUDY_META.deliverables.map((deliverable, index) => (
                      <div key={deliverable} style={{ display: "flex", alignItems: "flex-start", gap: "var(--sp-3)", fontSize: 14, color: "var(--text-2)" }}>
                        <span style={{ marginTop: 2, flexShrink: 0 }}>{String(index + 1).padStart(2, "0")}</span>
                        <span>{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </header>

        <section style={{ padding: "var(--sp-10) 0", borderBottom: "1px solid var(--border-1)", background: "var(--surface-1)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", padding: "0 var(--sp-6)" }}>
            <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-2)", marginBottom: "var(--sp-6)" }}>
              Intended Outcomes
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--sp-5)" }}>
              <StatBlock value="12" label="Towns documented" />
              <StatBlock value="4" label="Section renderers" />
              <StatBlock value="15+" label="Components built" />
              <StatBlock value="0" label="External API dependencies" />
            </div>
          </div>
        </section>

        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", padding: "var(--sp-10) var(--sp-6)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "var(--sp-10)" }}>
            <div className="desktop-only" style={{ display: "none" }} />
            <style>{`
              @media (min-width: 1024px) {
                .east-texas-body-grid { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: var(--sp-10); }
                .east-texas-sidebar { display: block; }
              }
              @media (max-width: 1023px) {
                .east-texas-sidebar { display: none; }
              }
            `}</style>
            <div className="east-texas-body-grid">
              <aside className="east-texas-sidebar">
                <CaseStudyNav />
              </aside>

              <main style={{ maxWidth: 780, display: "flex", flexDirection: "column", gap: "var(--sp-12)" }}>
                <section id="context">
                  <SectionHeader overline="01 - Context" title="The Problem Space" />
                  <div style={{ display: "grid", gap: "var(--sp-5)", fontSize: 16, lineHeight: 1.6, color: "var(--text-2)" }}>
                    <p style={{ fontSize: 18, color: "var(--text-1)" }}>
                      Northeast Texas is home to dozens of small towns whose histories span Caddo civilizations, Spanish missions, the Republic of Texas, railroad booms, oil strikes, and agricultural transformation.
                    </p>
                    <p>
                      There was no single, well-designed digital resource that organized these narratives town-by-town with proper source attribution, structured timelines, and spatial context.
                    </p>
                    <p>
                      The challenge: build a production-grade digital archive that treats small-town Texas history with museum-level editorial rigor while remaining maintainable and extensible.
                    </p>
                  </div>

                  <div style={{ marginTop: "var(--sp-10)", paddingTop: "var(--sp-6)", borderTop: "1px solid var(--border-1)" }}>
                    <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-2)", marginBottom: "var(--sp-6)" }}>
                      Target Users
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--sp-5)" }}>
                      {[
                        { icon: BookOpen, label: "Researchers & Genealogists", desc: "Need sourced, structured data they can cite" },
                        { icon: Users, label: "Local Residents", desc: "Want to see their town story told with dignity" },
                        { icon: MapPin, label: "Heritage Tourists", desc: "Planning visits, seeking spatial context" },
                        { icon: Eye, label: "Educators & Students", desc: "Need organized timelines and landmark inventories" },
                      ].map((user) => (
                        <div key={user.label} style={{ display: "flex", alignItems: "flex-start", gap: "var(--sp-4)", padding: "var(--sp-5)", border: "1px solid var(--border-1)" }}>
                          <user.icon size={18} style={{ color: "var(--text-2)", marginTop: 2, flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: 14, color: "var(--text-1)", marginBottom: "var(--sp-1)" }}>{user.label}</div>
                            <div style={{ fontSize: 13, color: "var(--text-2)" }}>{user.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: "var(--sp-10)", paddingTop: "var(--sp-6)", borderTop: "1px solid var(--border-1)" }}>
                    <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-2)", marginBottom: "var(--sp-5)" }}>
                      Constraints
                    </div>
                    <ul style={{ display: "grid", gap: "var(--sp-3)", fontSize: 14, color: "var(--text-2)", listStyle: "none", padding: 0, margin: 0 }}>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                        <AlertTriangle size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                        <span>No backend or database. All content must be statically typed and bundled.</span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                        <AlertTriangle size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                        <span>No external map API keys. Geographic visualization must be self-contained.</span>
                      </li>
                      <li style={{ display: "flex", alignItems: "flex-start", gap: "var(--sp-3)" }}>
                        <AlertTriangle size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                        <span>Public records only. Source attribution chains must remain intact.</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <section id="goals">
                  <SectionHeader overline="02 - Goals" title="Design Goals" />
                  <div style={{ display: "grid", gap: "var(--sp-5)" }}>
                    {[
                      { goal: "Editorial credibility", metric: "Every history section includes source citations with external links" },
                      { goal: "Config-driven scalability", metric: "Adding a new town requires only data files, zero UI changes" },
                      { goal: "Accessibility baseline", metric: "ARIA landmarks, focus-visible, aria-live regions, semantic HTML throughout" },
                      { goal: "Sub-second perceived load", metric: "Static data, lazy images, and memoized computations" },
                    ].map((goalItem) => (
                      <div key={goalItem.goal} style={{ display: "flex", alignItems: "flex-start", gap: "var(--sp-4)", padding: "var(--sp-5)", borderBottom: "1px solid var(--border-1)" }}>
                        <Target size={16} style={{ marginTop: 3, flexShrink: 0, color: "var(--text-2)" }} />
                        <div>
                          <div style={{ fontSize: 16, color: "var(--text-1)", marginBottom: "var(--sp-1)" }}>{goalItem.goal}</div>
                          <div style={{ fontSize: 14, color: "var(--text-2)" }}>{goalItem.metric}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="role">
                  <SectionHeader overline="03 - My Role" title="Responsibilities" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--sp-4)" }}>
                    {[
                      { icon: Lightbulb, label: "Product Strategy", desc: "Defined config-driven architecture and town microsite patterns" },
                      { icon: Layers, label: "Information Architecture", desc: "Structured TownConfig and HistoryData schemas" },
                      { icon: Palette, label: "Design System", desc: "Created the editorial token system and component classes" },
                      { icon: Code, label: "UI Engineering", desc: "Built components, routing, data loaders, and map visualization" },
                      { icon: Shield, label: "Accessibility", desc: "Implemented ARIA patterns, focus states, semantic structure" },
                      { icon: GitBranch, label: "Codebase Stewardship", desc: "Audited naming, removed dead code, and consolidated utilities" },
                    ].map((roleItem) => (
                      <div key={roleItem.label} style={{ display: "flex", alignItems: "flex-start", gap: "var(--sp-4)", padding: "var(--sp-5)", border: "1px solid var(--border-1)" }}>
                        <roleItem.icon size={16} style={{ marginTop: 2, flexShrink: 0, color: "var(--text-2)" }} />
                        <div>
                          <div style={{ fontSize: 14, color: "var(--text-1)", marginBottom: "var(--sp-1)" }}>{roleItem.label}</div>
                          <div style={{ fontSize: 13, color: "var(--text-2)" }}>{roleItem.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="approach">
                  <SectionHeader overline="04 - Approach" title="Discovery to Delivery" />
                  <div style={{ display: "grid", gap: "var(--sp-8)" }}>
                    {[
                      { phase: "Discovery", desc: "Inventoried TSHA, NPS, Census, and local records to define minimum viable schema." },
                      { phase: "System Mapping", desc: "Designed TownConfig and HistoryData with loader patterns that decouple route and data." },
                      { phase: "Design System", desc: "Developed Quiet Luxury Editorial language with warm palette and disciplined typography." },
                      { phase: "Execution", desc: "Built section renderers first, then composed pages and route-level behavior." },
                    ].map((step, index) => (
                      <div key={step.phase}>
                        <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-2)", marginBottom: "var(--sp-2)" }}>
                          Phase {String(index + 1).padStart(2, "0")}
                        </div>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.25rem, 3vw, 1.5rem)", lineHeight: 1.02, color: "var(--text-1)", marginBottom: "var(--sp-4)" }}>
                          {step.phase}
                        </h3>
                        <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--text-2)" }}>{step.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "var(--sp-10)", paddingTop: "var(--sp-6)", borderTop: "1px solid var(--border-1)" }}>
                    <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-2)", marginBottom: "var(--sp-6)" }}>
                      Key Decisions
                    </div>
                    <div style={{ display: "grid", gap: "var(--sp-6)" }}>
                      {DECISION_LOG.map((decisionItem, index) => (
                        <div key={decisionItem.decision}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: "var(--sp-3)", marginBottom: "var(--sp-2)" }}>
                            <span style={{ fontSize: 12, color: "var(--text-2)" }}>{String(index + 1).padStart(2, "0")}</span>
                            <h4 style={{ fontSize: 16, color: "var(--text-1)", fontWeight: 500 }}>{decisionItem.decision}</h4>
                          </div>
                          <div style={{ paddingLeft: "var(--sp-6)", borderLeft: "1px solid var(--border-1)" }}>
                            <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: "var(--sp-2)" }}>
                              <strong style={{ color: "var(--text-1)" }}>Why:</strong> {decisionItem.rationale}
                            </p>
                            <p style={{ fontSize: 14, color: "var(--text-2)" }}>
                              <strong style={{ color: "var(--text-1)" }}>Risk:</strong> {decisionItem.risk}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section id="solution">
                  <SectionHeader overline="05 - Solution" title="Final Implementation" />
                  <p style={{ fontSize: 18, lineHeight: 1.6, color: "var(--text-2)", marginBottom: "var(--sp-8)" }}>
                    The final application serves as a performant, accessible, and editorial-grade archive. It honors the subject matter through deliberate typography and layout while providing robust tools for historical inquiry.
                  </p>

                  <div style={{ display: "grid", gap: "var(--sp-8)" }}>
                    {GALLERY_SHOTS.map((shot) => (
                      <figure key={shot.component} style={{ margin: 0 }}>
                        <div style={{ aspectRatio: "16 / 10", background: "var(--surface-1)", border: "1px solid var(--border-1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--sp-3)" }}>
                          <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-2)" }}>
                            [Screenshot: {shot.component}]
                          </span>
                        </div>
                        <figcaption style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--sp-2)" }}>
                          <div style={{ fontSize: 14, color: "var(--text-1)", fontWeight: 500 }}>{shot.caption}</div>
                          <div style={{ fontSize: 12, color: "var(--text-2)", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>{shot.route}</div>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </section>
              </main>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
