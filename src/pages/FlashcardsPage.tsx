import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { PageLayout } from "../components/PageLayout";
import { flashcards, type Flashcard } from "../data/flashcards";

type Category = Flashcard["category"] | "All";

const STORAGE_KEY = "flashcard-progress";

export function FlashcardsPage() {
  const reduceMotion = useReducedMotion();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [masteredCards, setMasteredCards] = useState<Set<string>>(() => new Set());
  const [direction, setDirection] = useState(0);

  const categories: Category[] = useMemo(() => [
    "All",
    ...Array.from(new Set(flashcards.map((c) => c.category))).sort(),
  ], []);

  const filteredCards = useMemo(() => {
    if (selectedCategory === "All") return flashcards;
    return flashcards.filter((card) => card.category === selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (filteredCards.length === 0) {
      setCurrentIndex(0);
      setIsFlipped(false);
      return;
    }
    setCurrentIndex((prev) => Math.min(prev, filteredCards.length - 1));
    setIsFlipped(false);
  }, [filteredCards.length]);

  const currentCard = filteredCards.length > 0 ? filteredCards[currentIndex] : null;
  const isMastered = currentCard ? masteredCards.has(currentCard.id) : false;

  const progress = useMemo(() => {
    if (flashcards.length === 0) return 0;
    return Math.round((masteredCards.size / flashcards.length) * 100);
  }, [masteredCards.size]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const ids: unknown = JSON.parse(saved);
      if (Array.isArray(ids) && ids.every((v) => typeof v === "string")) {
        setMasteredCards(new Set(ids));
      }
    } catch (e) {
      console.error("Failed to load progress:", e);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(masteredCards)));
  }, [masteredCards]);

  const toggleFlip = useCallback(() => {
    if (!currentCard) return;
    setIsFlipped((prev) => !prev);
  }, [currentCard]);

  const goToNext = useCallback(() => {
    if (filteredCards.length === 0) return;
    setDirection(1);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  }, [filteredCards.length]);

  const goToPrevious = useCallback(() => {
    if (filteredCards.length === 0) return;
    setDirection(-1);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev === 0 ? filteredCards.length - 1 : prev - 1));
  }, [filteredCards.length]);

  const markMastered = useCallback(() => {
    if (!currentCard) return;
    setMasteredCards((prev) => new Set([...prev, currentCard.id]));
    window.setTimeout(goToNext, 260);
  }, [currentCard, goToNext]);

  const markUnmastered = useCallback(() => {
    if (!currentCard) return;
    setMasteredCards((prev) => {
      const next = new Set(prev);
      next.delete(currentCard.id);
      return next;
    });
  }, [currentCard]);

  const resetProgress = useCallback(() => {
    if (typeof window === "undefined") return;
    if (window.confirm("Reset all progress? This cannot be undone.")) {
      setMasteredCards(new Set());
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTypingTarget =
        tag === "input" ||
        tag === "textarea" ||
        target?.getAttribute("contenteditable") === "true";

      if (isTypingTarget) return;

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggleFlip();
        return;
      }

      if (e.key === "ArrowRight") {
        goToNext();
        return;
      }

      if (e.key === "ArrowLeft") {
        goToPrevious();
        return;
      }

      if (e.key.toLowerCase() === "m") {
        markMastered();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious, markMastered, toggleFlip]);

  const S = {
    shell: {
      maxWidth: 860,
      margin: "0 auto",
    },
    overline: {
      fontSize: "var(--ts-overline)",
      letterSpacing: "0.14em",
      textTransform: "uppercase" as const,
      color: "var(--text-2)",
      fontWeight: 500,
      fontFamily: "var(--font-body)",
    },
    divider: {
      width: "var(--sp-5)",
      height: 1,
      backgroundColor: "var(--border-1)",
    },
    h1: {
      fontFamily: "var(--font-display)",
      fontSize: "var(--ts-h1)",
      fontWeight: 400,
      letterSpacing: "-0.015em",
      lineHeight: 1.1,
    },
    body: {
      fontSize: "var(--ts-body)",
      lineHeight: 1.6,
      color: "var(--text-2)",
      fontFamily: "var(--font-body)",
    },
    progressTrack: {
      height: "var(--sp-2)",
      backgroundColor: "var(--surface-2)",
      border: "1px solid var(--border-1)",
      borderRadius: 999,
      overflow: "hidden" as const,
    },
    progressFill: {
      height: "100%",
      backgroundColor: "var(--selected-bg)",
      borderRadius: 999,
      boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.06)",
    },
    tabList: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: 8,
      marginBottom: "var(--sp-5)",
    },
    tab: {
      padding: "10px 12px",
      borderRadius: 999,
      fontSize: "var(--ts-overline)",
      fontWeight: 600,
      letterSpacing: "0.12em",
      textTransform: "uppercase" as const,
      border: "1px solid var(--border-1)",
      cursor: "pointer",
      fontFamily: "var(--font-body)",
      transition: reduceMotion
        ? "none"
        : "transform 120ms ease, background-color 150ms ease, color 150ms ease",
      backgroundColor: "var(--surface-0)",
      color: "var(--text-2)",
    },
    tabActive: {
      backgroundColor: "var(--selected-bg)",
      color: "var(--selected-fg)",
      borderColor: "transparent",
    },
    chipRow: {
      display: "flex",
      justifyContent: "center",
      gap: "var(--sp-2)",
      flexWrap: "wrap" as const,
      marginBottom: "var(--sp-4)",
    },
    chip: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      borderRadius: 999,
      border: "1px solid var(--border-1)",
      backgroundColor: "var(--surface-0)",
      color: "var(--text-2)",
      fontSize: "var(--ts-overline)",
      letterSpacing: "0.12em",
      textTransform: "uppercase" as const,
      fontFamily: "var(--font-body)",
      fontWeight: 500,
    },
    chipDot: {
      width: 6,
      height: 6,
      borderRadius: 999,
      backgroundColor: "var(--text-2)",
      opacity: 0.55,
    },
    cardStage: {
      perspective: "1100px",
      marginBottom: "var(--sp-5)",
    },
    notecardButton: {
      position: "relative" as const,
      width: "100%",
      height: 380,
      cursor: "pointer",
      transformStyle: "preserve-3d" as const,
      border: "none",
      background: "none",
      padding: 0,
      outline: "none",
      borderRadius: "24px",
    },
    faceBase: {
      position: "absolute" as const,
      inset: 0,
      borderRadius: "24px",
      overflow: "hidden" as const,
      border: "1px solid var(--border-1)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.08), 0 1px 0 rgba(0,0,0,0.03)",
    },
    paperGrain: {
      position: "absolute" as const,
      inset: 0,
      pointerEvents: "none" as const,
      opacity: 0.09,
      // cast to any to satisfy TypeScript's strict CSS property types
      mixBlendMode: "overlay" as any,
      backgroundImage:
        "radial-gradient(circle at 20% 10%, rgba(0,0,0,0.6) 0.5px, transparent 1px), radial-gradient(circle at 80% 30%, rgba(0,0,0,0.6) 0.5px, transparent 1px), radial-gradient(circle at 35% 85%, rgba(0,0,0,0.6) 0.5px, transparent 1px)",
      backgroundSize: "14px 14px",
    },
    controlsRow: {
      display: "flex",
      gap: "var(--sp-3)",
      marginBottom: "var(--sp-3)",
    },
    btn: {
      flex: 1,
      padding: "12px var(--sp-4)",
      borderRadius: 14,
      backgroundColor: "var(--surface-2)",
      color: "var(--text-1)",
      border: "1px solid var(--border-1)",
      fontSize: "var(--ts-body)",
      fontWeight: 500,
      fontFamily: "var(--font-body)",
      cursor: "pointer",
      transition: reduceMotion ? "none" : "transform 120ms ease, background-color 150ms ease",
    },
    btnPrimary: {
      width: "100%",
      padding: "12px var(--sp-4)",
      borderRadius: 14,
      backgroundColor: "var(--selected-bg)",
      color: "var(--selected-fg)",
      border: "1px solid transparent",
      fontSize: "var(--ts-body)",
      fontWeight: 500,
      fontFamily: "var(--font-body)",
      cursor: "pointer",
      transition: reduceMotion ? "none" : "transform 120ms ease, opacity 150ms ease",
    },
    btnGhost: {
      width: "100%",
      padding: "12px var(--sp-4)",
      borderRadius: 14,
      backgroundColor: "var(--surface-2)",
      color: "var(--text-1)",
      border: "1px solid var(--border-1)",
      fontSize: "var(--ts-body)",
      fontWeight: 500,
      fontFamily: "var(--font-body)",
      cursor: "pointer",
      transition: reduceMotion ? "none" : "transform 120ms ease, background-color 150ms ease",
    },
    kbd: {
      padding: "4px 8px",
      backgroundColor: "var(--surface-0)",
      border: "1px solid var(--border-1)",
      borderRadius: 10,
      fontSize: "var(--ts-small)",
      fontFamily: "var(--font-body)",
    },
    helperCard: {
      backgroundColor: "var(--surface-2)",
      border: "1px solid var(--border-1)",
      borderRadius: 18,
      padding: "var(--sp-4)",
      fontSize: "var(--ts-small)",
      color: "var(--text-2)",
      fontFamily: "var(--font-body)",
    },
  };

  return (
    <PageLayout>
      <style>{`
        .flashcards-page-shell {
          display: flex;
          flex-direction: column;
          gap: var(--sp-6);
        }
        .flashcards-layout {
          max-width: 1120px;
          margin: 0 auto;
          padding: var(--sp-12) var(--sp-6);
        }
      `}</style>
      <div className="flashcards-page-shell">
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
      <div className="flashcards-layout">
      <div style={S.shell}>
        {/* Header */}
        <header style={{ marginBottom: "var(--sp-6)" }}>
          <p style={{ ...S.overline, marginBottom: 12 }}>Study Tool</p>
          <div style={{ ...S.divider, marginBottom: "var(--sp-3)" }} />
          <h1 style={{ ...S.h1, marginBottom: "var(--sp-3)" }}>AI & Product Flashcards</h1>
          <p style={S.body}>
            Creative AI, prompt engineering, evaluation, and front-end product interfaces—practical knowledge for shipping intelligent experiences.
          </p>
        </header>

        {/* Progress */}
        <div style={{ marginBottom: "var(--sp-5)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "var(--sp-2)",
              fontSize: "var(--ts-caption)",
              fontFamily: "var(--font-body)",
            }}
          >
            <span style={{ color: "var(--text-2)" }}>
              Progress: {masteredCards.size}/{flashcards.length} mastered
            </span>
            <span style={{ color: "var(--text-2)" }}>{progress}%</span>
          </div>

          <div style={S.progressTrack}>
            <motion.div
              style={S.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div role="tablist" aria-label="Flashcard categories" style={S.tabList}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                style={{
                  ...S.tab,
                  ...(isActive ? S.tabActive : null),
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCards.length === 0 ? (
          <div
            style={{
              backgroundColor: "var(--surface-2)",
              border: "1px solid var(--border-1)",
              borderRadius: 18,
              padding: "var(--sp-4)",
              color: "var(--text-2)",
              fontSize: "var(--ts-body)",
              fontFamily: "var(--font-body)",
            }}
          >
            No flashcards found in <span style={{ fontWeight: 600 }}>{selectedCategory}</span>.
          </div>
        ) : (
          <>
            {/* Counter */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "var(--sp-3)",
                fontSize: "var(--ts-caption)",
                color: "var(--text-2)",
                fontFamily: "var(--font-body)",
                letterSpacing: "0.04em",
              }}
            >
              Card {currentIndex + 1} of {filteredCards.length}
            </div>

            {/* Chips */}
            <div style={S.chipRow} aria-label="Card metadata">
              <span style={S.chip}>
                <span style={S.chipDot} />
                {currentCard?.category}
              </span>

              {isMastered && (
                <span
                  style={{
                    ...S.chip,
                    backgroundColor: "var(--selected-bg)",
                    color: "var(--selected-fg)",
                    borderColor: "transparent",
                  }}
                >
                  ✓ Mastered
                </span>
              )}
            </div>

            {/* Notecard */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentCard?.id}
                custom={direction}
                initial={{ x: direction > 0 ? 260 : -260, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -260 : 260, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 32,
                  duration: reduceMotion ? 0 : undefined,
                }}
                style={S.cardStage}
              >
                <motion.button
                  type="button"
                  onClick={toggleFlip}
                  aria-label={isFlipped ? "Show term side" : "Show definition side"}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.38,
                    type: "spring",
                    stiffness: 110,
                    damping: 16,
                  }}
                  style={S.notecardButton}
                  whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleFlip();
                    }
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px var(--surface-0), 0 0 0 5px var(--selected-bg)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Front */}
                  <div
                    style={{
                      ...S.faceBase,
                      backfaceVisibility: "hidden",
                      backgroundColor: "var(--surface-1)",
                    }}
                  >
                    <div style={S.paperGrain} />
                    <div
                      style={{
                        height: "100%",
                        padding: "var(--sp-6)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                    >
                      <p style={{ ...S.overline, marginBottom: 14 }}>Term</p>

                      <h2
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "var(--ts-h2)",
                          fontWeight: 400,
                          letterSpacing: "-0.01em",
                          lineHeight: 1.12,
                          marginBottom: "var(--sp-3)",
                          maxWidth: 560,
                        }}
                      >
                        {currentCard?.term}
                      </h2>

                      <p
                        style={{
                          fontSize: "var(--ts-small)",
                          color: "var(--text-2)",
                          fontFamily: "var(--font-body)",
                          lineHeight: 1.45,
                          maxWidth: 520,
                        }}
                      >
                        Click or press Space to reveal the definition.
                      </p>
                    </div>
                  </div>

                  {/* Back */}
                  <div
                    style={{
                      ...S.faceBase,
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      backgroundColor: "var(--surface-0)",
                    }}
                  >
                    <div style={S.paperGrain} />
                    <div
                      style={{
                        height: "100%",
                        padding: "var(--sp-6)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: "var(--sp-4)",
                        textAlign: "left",
                      }}
                    >
                      <div>
                        <p style={{ ...S.overline, marginBottom: "var(--sp-2)" }}>Definition</p>
                        <p
                          style={{
                            fontSize: "var(--ts-body)",
                            lineHeight: 1.65,
                            color: "var(--text-1)",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {currentCard?.definition}
                        </p>
                      </div>

                      {currentCard?.example && (
                        <div>
                          <p style={{ ...S.overline, marginBottom: "var(--sp-2)" }}>Example</p>
                          <p
                            style={{
                              fontSize: "var(--ts-small)",
                              color: "var(--text-2)",
                              fontFamily: "var(--font-body)",
                              lineHeight: 1.5,
                              fontStyle: "italic",
                            }}
                          >
                            {currentCard.example}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div style={S.controlsRow}>
              <button
                type="button"
                onClick={goToPrevious}
                style={S.btn}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.99)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                ← Previous
              </button>

              <button
                type="button"
                onClick={goToNext}
                style={S.btn}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.99)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Next →
              </button>
            </div>

            <div style={{ marginBottom: "var(--sp-5)" }}>
              {isMastered ? (
                <button
                  type="button"
                  onClick={markUnmastered}
                  style={S.btnGhost}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.99)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  Unmark Mastered
                </button>
              ) : (
                <button
                  type="button"
                  onClick={markMastered}
                  style={S.btnPrimary}
                  onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.99)")}
                  onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  ✓ Mark as Mastered
                </button>
              )}
            </div>
          </>
        )}

        {/* Keyboard Shortcuts */}
        <div style={S.helperCard}>
          <div style={{ fontWeight: 600, marginBottom: "var(--sp-3)", color: "var(--text-1)" }}>
            Keyboard Shortcuts
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "var(--sp-2)",
              alignItems: "center",
            }}
          >
            <div>
              <kbd style={S.kbd}>Space</kbd> Flip card
            </div>
            <div>
              <kbd style={S.kbd}>←/→</kbd> Navigate
            </div>
            <div>
              <kbd style={S.kbd}>M</kbd> Mark mastered
            </div>
            <div>
              <button
                type="button"
                onClick={resetProgress}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-2)",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "var(--ts-small)",
                  fontFamily: "var(--font-body)",
                  padding: 0,
                  justifySelf: "start",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-1)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-2)")}
              >
                Reset Progress
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </PageLayout>
  );
}
