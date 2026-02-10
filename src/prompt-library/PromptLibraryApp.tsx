import React, { useState, useMemo, useCallback, useEffect, useRef, lazy, Suspense } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, Heart } from "lucide-react";
import { prompts, categories, type Prompt } from "./prompt-data";
import { PromptCard } from "./prompt-card";
import { HeroHeader } from "./hero-header";
import { Toolbar } from "./toolbar";
import { ErrorBoundary, SectionSkeleton } from "./error-boundary";
import { getCategoryColor, getCategoryLabel } from "./category-colors";

const MethodologySection = lazy(() => import("./methodology-section").then((m) => ({ default: m.MethodologySection })));
const ReferencesSection = lazy(() => import("./references-section").then((m) => ({ default: m.ReferencesSection })));
const CaseStudyPage = lazy(() => import("./case-study/case-study-page").then((m) => ({ default: m.CaseStudyPage })));

type AppView = "library" | "case-study";

interface PromptLibraryAppProps {
  onNavigateToPortfolio?: () => void;
}

export default function PromptLibraryApp({ onNavigateToPortfolio }: PromptLibraryAppProps) {
  const [activeView, setActiveView] = useState<AppView>("library");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [copied, setCopied] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [favorites, setFavorites] = useState<Set<number>>(() => {
    try {
      const s = localStorage.getItem("prompt-favorites");
      return s ? new Set(JSON.parse(s) as number[]) : new Set();
    } catch { return new Set(); }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === "Escape") {
        if (selectedPromptId) {
          setSelectedPromptId(null);
          return;
        }
        if (searchQuery) setSearchQuery("");
        else if (showFavoritesOnly) setShowFavoritesOnly(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery, showFavoritesOnly, selectedPromptId]);

  useEffect(() => { localStorage.setItem("prompt-favorites", JSON.stringify([...favorites])); }, [favorites]);
  useEffect(() => () => { if (copyTimerRef.current) clearTimeout(copyTimerRef.current); }, []);
  useEffect(() => { setCopied(false); }, [selectedPromptId]);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  }, []);

  const filtered = useMemo(() => {
    return prompts.filter((p) => {
      if (activeCategory !== "all" && p.category !== activeCategory) return false;
      if (showFavoritesOnly && !favorites.has(p.id)) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
    });
  }, [searchQuery, activeCategory, showFavoritesOnly, favorites]);

  useEffect(() => {
    if (selectedPromptId && !filtered.some((p) => p.id === selectedPromptId)) {
      setSelectedPromptId(null);
    }
  }, [filtered, selectedPromptId]);

  const copyPrompt = useCallback(async (value: string) => {
    let success = false;
    try {
      if (window.isSecureContext && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        success = true;
      }
    } catch {
      success = false;
    }
    if (!success) {
      try {
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.style.position = "fixed";
        ta.style.top = "0";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.focus({ preventScroll: true });
        ta.select();
        success = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        success = false;
      }
    }
    if (!success) return;
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    setCopied(true);
    copyTimerRef.current = setTimeout(() => setCopied(false), 1800);
  }, []);

  const handleOpenPrompt = useCallback((prompt: Prompt) => {
    setSelectedPromptId((prev) => (prev === prompt.id ? null : prompt.id));
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const navigateToCaseStudy = useCallback(() => {
    setActiveView("case-study");
    navigate({ hash: "#case-study" }, { replace: true });
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [navigate]);

  const navigateToLibrary = useCallback(() => {
    setActiveView("library");
    navigate("/prompt-library", { replace: true });
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [navigate]);

  useEffect(() => {
    if (location.hash === "#case-study") {
      setActiveView("case-study");
    }
  }, [location.hash]);

  if (activeView === "case-study") {
    return (
      <div className="prompt-library min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <ErrorBoundary section="Case Study">
          <Suspense fallback={<SectionSkeleton />}>
            <CaseStudyPage onNavigateToLibrary={navigateToLibrary} />
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="prompt-library min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <ErrorBoundary section="Hero">
        <HeroHeader
          totalPrompts={prompts.length}
          totalCategories={categories.length - 1}
          onNavigateToCaseStudy={navigateToCaseStudy}
          onNavigateToPortfolio={onNavigateToPortfolio}
        />
      </ErrorBoundary>

      <main className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 pb-16 sm:pb-32">
        <ErrorBoundary section="Methodology">
          <Suspense fallback={<SectionSkeleton />}><MethodologySection /></Suspense>
        </ErrorBoundary>

        <ErrorBoundary section="Toolbar">
          <Toolbar
            searchQuery={searchQuery} onSearchChange={setSearchQuery}
            activeCategory={activeCategory} onCategoryChange={setActiveCategory}
            showFavoritesOnly={showFavoritesOnly} onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
            favoritesCount={favorites.size} resultCount={filtered.length} totalCount={prompts.length}
            searchRef={searchRef}
          />
        </ErrorBoundary>

        <ErrorBoundary section="Prompt Grid">
          {filtered.length > 0 ? (
            <motion.div layout className="border border-border bg-card relative overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-[2px]"
                style={{ background: "linear-gradient(90deg, #5A8A7A 0%, #5A7A8A 25%, #B07A4E 50%, #8A6070 75%, #7A6A80 100%)" }}
              />
              {/* Glossary column count label */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-b border-border" style={{ background: "linear-gradient(90deg, rgba(90,138,122,0.08), rgba(90,122,138,0.08), rgba(176,122,78,0.08), rgba(138,96,112,0.08))" }}>
                <span className="text-[11px] text-muted-foreground/50 uppercase tracking-[0.14em]" style={{ fontFamily: "var(--font-body)" }}>
                  {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
                </span>
                <span className="text-[11px] text-muted-foreground/30 uppercase tracking-[0.14em] hidden sm:block" style={{ fontFamily: "var(--font-body)" }}>
                  Glossary
                </span>
              </div>
              {/* Entries list */}
              <div className="grid grid-cols-1">
                <AnimatePresence mode="popLayout">
                  {filtered.map((prompt) => {
                    const accent = getCategoryColor(prompt.category).accent;
                    return (
                      <div key={prompt.id}>
                        <PromptCard prompt={prompt} onOpen={handleOpenPrompt}
                          isSelected={selectedPromptId === prompt.id}
                          isFavorite={favorites.has(prompt.id)} onToggleFavorite={toggleFavorite}
                        />
                        <AnimatePresence initial={false}>
                          {selectedPromptId === prompt.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                              className="border-b border-border relative overflow-hidden"
                              style={{ background: `linear-gradient(140deg, ${accent}10 0%, rgba(255,255,255,0.72) 34%, rgba(255,255,255,0.98) 100%)` }}
                            >
                              <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: accent }} />
                              <div className="p-4 sm:p-6">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] px-2 py-1 border" style={{ color: accent, borderColor: `${accent}66`, backgroundColor: `${accent}12`, fontFamily: "var(--font-body)" }}>
                                      {getCategoryLabel(prompt.category)}
                                    </span>
                                    <h3 className="mt-2 text-xl sm:text-2xl leading-tight text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                                      {prompt.title}
                                    </h3>
                                  </div>
                                  <button onClick={() => toggleFavorite(prompt.id)} className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label={favorites.has(prompt.id) ? "Remove from favorites" : "Add to favorites"}>
                                    <Heart className={`w-4 h-4 ${favorites.has(prompt.id) ? "fill-foreground text-foreground" : ""}`} strokeWidth={1.5} />
                                  </button>
                                </div>
                                <p className="mt-3 text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                                  {prompt.description}
                                </p>
                                <div className="mt-4 border border-border bg-background/55">
                                  <pre className="p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words font-mono text-foreground/85">
                                    {prompt.prompt}
                                  </pre>
                                </div>
                                <button
                                  onClick={() => copyPrompt(prompt.prompt)}
                                  className={`mt-4 w-full sm:w-auto sm:px-6 py-3 text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-colors ${copied ? "bg-foreground text-background" : "text-white hover:opacity-90"}`}
                                  style={copied ? undefined : { backgroundColor: accent }}
                                >
                                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                  {copied ? "Copied" : "Copy Prompt"}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 sm:py-40 border border-border border-dashed bg-card/30"
            >
              <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">No Results Found</p>
              <button onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="mt-4 text-xs underline text-foreground hover:text-muted-foreground transition-colors"
              >Clear Filters</button>
            </motion.div>
          )}
        </ErrorBoundary>
      </main>

      <ErrorBoundary section="References">
        <Suspense fallback={<div className="mx-auto max-w-[1400px] px-4 sm:px-6 pb-8 sm:pb-16"><SectionSkeleton /></div>}>
          <ReferencesSection />
        </Suspense>
      </ErrorBoundary>

      <footer className="border-t border-border py-12 sm:py-20 bg-background relative z-10">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 sm:gap-10">
          <div className="text-center md:text-left">
            <h4 className="text-foreground font-light text-xl sm:text-2xl mb-2 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Claude Opus 4.6 × Figma Make</h4>
            <p className="text-muted-foreground text-[11px] sm:text-xs uppercase tracking-[0.14em]" style={{ fontFamily: "var(--font-body)" }}>Experimental Prompt Library v2.0</p>
          </div>
          <div className="flex gap-6 sm:gap-8 text-muted-foreground text-[11px] sm:text-xs uppercase tracking-[0.14em]" style={{ fontFamily: "var(--font-body)" }}>
            <a href="mailto:austncarsn@gmail.com" className="hover:text-foreground transition-colors">Contact</a>
            <a href="https://github.com/austncarsn/Claudeopus46xfigmamakepromptlibrary" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Github</a>
            <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">MIT License</a>
          </div>
        </div>
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 mt-10 sm:mt-14 flex justify-end">
          <span className="text-[9px] text-muted-foreground/20 uppercase tracking-[0.2em] select-none" style={{ fontFamily: "var(--font-body)" }}>Engineered by Austin Carson</span>
        </div>
      </footer>

    </div>
  );
}
