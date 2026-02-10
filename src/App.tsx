import { HashRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { PageLayout } from "./components/PageLayout";
import { PageTransition } from "./components/PageTransition";
import { GlobalSectionRail } from "./components/GlobalSectionRail";
import { HomeWithHero } from "./pages/HomeWithHero";
import { useEffect, lazy, Suspense } from "react";

// Lazy load heavy applications for better performance
const PromptLibraryApp = lazy(() => import("./prompt-library/PromptLibraryApp"));
const PromptNotebookApp = lazy(() => import("./prompt-notebook/PromptNotebookApp"));
const InfoPageLazy = lazy(async () => {
  const module = await import("./pages/InfoPage");
  return { default: module.InfoPage };
});
const ProjectsPageLazy = lazy(async () => {
  const module = await import("./pages/ProjectsPage");
  return { default: module.ProjectsPage };
});
const RailroadTrackCaseStudyPageLazy = lazy(async () => {
  const module = await import("./pages/RailroadTrackCaseStudyPage");
  return { default: module.RailroadTrackCaseStudyPage };
});
const ProjectDetailPageLazy = lazy(async () => {
  const module = await import("./pages/ProjectDetailPage");
  return { default: module.ProjectDetailPage };
});
const FlashcardsPageLazy = lazy(async () => {
  const module = await import("./pages/FlashcardsPage");
  return { default: module.FlashcardsPage };
});
const ResumePageLazy = lazy(async () => {
  const module = await import("./pages/ResumePage");
  return { default: module.ResumePage };
});
const CameoStorePageLazy = lazy(async () => {
  const module = await import("./pages/CameoStorePage");
  return { default: module.CameoStorePage };
});
const GalleryPageLazy = lazy(async () => {
  const module = await import("./pages/GalleryPage");
  return { default: module.GalleryPage };
});

// Loading fallback component for better UX
const LoadingFallback = ({ message }: { message: string }) => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
    }}
  >
    <p
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "var(--ts-overline)",
        color: "var(--text-2)",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
      }}
    >
      {message}
    </p>
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PromptLibraryRoute() {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<LoadingFallback message="Loading Prompt Library..." />}>
      <PromptLibraryApp onNavigateToPortfolio={() => navigate("/")} />
    </Suspense>
  );
}

function PromptNotebookRoute() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "#0D1117" }}>
      <div
        style={{
          padding: "var(--sp-4) var(--sp-4) var(--sp-3)",
          borderBottom: "1px solid #202938",
          background: "#0D1117",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--sp-2)",
            border: "1px solid #2D3748",
            background: "transparent",
            color: "#E6EDF3",
            padding: "8px 12px",
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </div>
      <Suspense
        fallback={
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0D1117",
            }}
          >
            <p
              style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: "11px",
                color: "#7D8590",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}
            >
              Loading Prompt Notebook IDE...
            </p>
          </div>
        }
      >
        <PromptNotebookApp />
      </Suspense>
    </div>
  );
}

function CameoStoreRoute({ initialView = "shop" }: { initialView?: "shop" | "case-study" }) {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-0)" }}>
      <div
        style={{
          padding: "var(--sp-4) var(--sp-4) var(--sp-3)",
          borderBottom: "1px solid var(--border-1)",
          background: "var(--surface-1)",
        }}
      >
        <button
          onClick={() => navigate("/")}
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
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </div>
      <Suspense fallback={<LoadingFallback message="Loading Cameo Store..." />}>
        <CameoStorePageLazy initialView={initialView} />
      </Suspense>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Animated route shell — AnimatePresence + location-keyed Routes            */
/* -------------------------------------------------------------------------- */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Prompt Library — full-screen, outside PageLayout */}
        <Route
          path="/prompt-library"
          element={
            <PageTransition>
              <PromptLibraryRoute />
            </PageTransition>
          }
        />

        {/* Prompt Notebook IDE — full-screen, outside PageLayout */}
        <Route
          path="/prompt-notebook"
          element={
            <PageTransition>
              <PromptNotebookRoute />
            </PageTransition>
          }
        />

        <Route
          path="/cameo-store"
          element={
            <PageTransition>
              <CameoStoreRoute initialView="shop" />
            </PageTransition>
          }
        />

        <Route
          path="/cameo-store/case-study"
          element={
            <PageTransition>
              <CameoStoreRoute initialView="case-study" />
            </PageTransition>
          }
        />

        {/* Home with hero — full-bleed, outside PageLayout */}
        <Route
          path="/"
          element={
            <PageTransition>
              <HomeWithHero />
            </PageTransition>
          }
        />

        {/* Portfolio routes — wrapped in PageLayout */}
        <Route
          path="/info"
          element={
            <PageTransition>
              <PageLayout>
                <Suspense fallback={<LoadingFallback message="Loading Info..." />}>
                  <InfoPageLazy />
                </Suspense>
              </PageLayout>
            </PageTransition>
          }
        />
        <Route
          path="/projects"
          element={
            <PageTransition>
              <PageLayout>
                <Suspense fallback={<LoadingFallback message="Loading Case Studies..." />}>
                  <ProjectsPageLazy />
                </Suspense>
              </PageLayout>
            </PageTransition>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <PageTransition>
              <PageLayout>
                <Suspense fallback={<LoadingFallback message="Loading Case Study..." />}>
                  <ProjectDetailPageLazy />
                </Suspense>
              </PageLayout>
            </PageTransition>
          }
        />
        <Route
          path="/railroad-track-divider"
          element={
            <PageTransition>
              <PageLayout>
                <Suspense fallback={<LoadingFallback message="Loading Case Study..." />}>
                  <RailroadTrackCaseStudyPageLazy />
                </Suspense>
              </PageLayout>
            </PageTransition>
          }
        />
        <Route
          path="/gallery"
          element={
            <PageTransition>
              <Suspense fallback={<LoadingFallback message="Loading Gallery..." />}>
                <PageLayout>
                  <GalleryPageLazy />
                </PageLayout>
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/flashcards"
          element={
            <PageTransition>
              <Suspense fallback={<LoadingFallback message="Loading Flashcards..." />}>
                <FlashcardsPageLazy />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/resume"
          element={
            <PageTransition>
              <Suspense fallback={<LoadingFallback message="Loading Resume..." />}>
                <ResumePageLazy />
              </Suspense>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <GlobalSectionRail />
      <AnimatedRoutes />
    </HashRouter>
  );
}
