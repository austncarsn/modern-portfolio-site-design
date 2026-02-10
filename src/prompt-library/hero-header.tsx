import React, {
  useEffect,
  useState,
  useRef,
  memo,
  useCallback,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";
import { ArrowDown, FileText, ArrowLeft } from "lucide-react";

interface HeroHeaderProps {
  totalPrompts: number;
  totalCategories: number;
  onNavigateToCaseStudy?: () => void;
  onNavigateToPortfolio?: () => void;
}

const HERO_TONES = ["#5A8A7A", "#8A6070", "#5A7A8A", "#B07A4E", "#7A6A80"];
const FRAMEWORK_PILLS = [
  { label: "Task", color: "#5A8A7A" },
  { label: "Context", color: "#5A7A8A" },
  { label: "Elements", color: "#B07A4E" },
  { label: "Behavior", color: "#8A6070" },
  { label: "Constraints", color: "#7A6A80" },
];

/* ── Top Navigation ── */
const TopNav = memo(({ onNavigateToCaseStudy, onNavigateToPortfolio }: { onNavigateToCaseStudy?: () => void; onNavigateToPortfolio?: () => void }) => (
  <motion.nav className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-6"
    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="flex items-center gap-2.5">
      {onNavigateToPortfolio && (
        <button onClick={onNavigateToPortfolio}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-foreground/10 text-xs text-muted-foreground/60 hover:text-foreground hover:border-foreground/20 transition-colors uppercase tracking-[0.12em] mr-3"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <ArrowLeft className="w-3 h-3" strokeWidth={1.5} />
          Portfolio
        </button>
      )}
    </div>
    {onNavigateToCaseStudy && (
      <button onClick={onNavigateToCaseStudy}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-foreground/10 text-xs text-muted-foreground/60 hover:text-foreground hover:border-foreground/20 transition-colors uppercase tracking-[0.12em]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <FileText className="w-3 h-3" strokeWidth={1.5} />
        Case Study
      </button>
    )}
  </motion.nav>
));
TopNav.displayName = "TopNav";

/* ── Sticky Navigation (appears on scroll) ── */
const StickyNavigation = memo(({ isVisible, totalPrompts, onNavigateToCaseStudy }: {
  isVisible: boolean; totalPrompts: number; onNavigateToCaseStudy?: () => void;
}) => (
  <motion.div className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none"
    initial={{ y: -100, opacity: 0 }} animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="mt-3 sm:mt-6 mx-3 sm:mx-0 px-4 sm:px-6 py-2.5 sm:py-3 bg-background/90 backdrop-blur-md border border-border flex items-center gap-4 sm:gap-6 pointer-events-auto shadow-sm relative overflow-hidden">
      <div className="absolute left-0 top-0 h-[2px] w-full" style={{ background: "linear-gradient(90deg, #5A8A7A 0%, #5A7A8A 25%, #B07A4E 50%, #8A6070 75%, #7A6A80 100%)" }} />
      <span className="text-sm font-medium text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        Claude Opus 4.6 × Make
      </span>
      <div className="w-px h-3 bg-border" />
      <span className="text-[11px] text-muted-foreground tabular-nums uppercase tracking-[0.12em]" style={{ fontFamily: "var(--font-body)" }}>
        {totalPrompts} Prompts
      </span>
      {onNavigateToCaseStudy && (
        <>
          <div className="w-px h-3 bg-border" />
          <button onClick={onNavigateToCaseStudy} className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.12em]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <FileText className="w-3 h-3" strokeWidth={1.5} />
            <span className="hidden sm:inline">Case Study</span>
          </button>
        </>
      )}
    </div>
  </motion.div>
));
StickyNavigation.displayName = "StickyNavigation";

/* ── Scroll CTA ── */
const ScrollCTA = memo(() => {
  const handleClick = useCallback(() => {
    const mainContent = document.querySelector("main");
    if (mainContent) mainContent.scrollIntoView({ behavior: "smooth" });
  }, []);
  return (
    <motion.button className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer group z-10"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 1, ease: [0.16, 1, 0.3, 1] }} onClick={handleClick}
    >
      <span className="text-[11px] text-muted-foreground/40 uppercase tracking-[0.2em] group-hover:text-muted-foreground transition-colors"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Discover
      </span>
      <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <ArrowDown className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" strokeWidth={1} />
      </motion.div>
    </motion.button>
  );
});
ScrollCTA.displayName = "ScrollCTA";

/* ── Main Hero ── */
export function HeroHeader({ totalPrompts, totalCategories, onNavigateToCaseStudy, onNavigateToPortfolio }: HeroHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const opacity = useTransform(smoothScrollY, [0, 400], [1, 0]);
  const scale = useTransform(smoothScrollY, [0, 400], [1, 0.96]);
  const y = useTransform(smoothScrollY, [0, 400], [0, 60]);

  useEffect(() => {
    let ticking = false;
    const updateScrollState = () => { const t = window.scrollY > 100; if (t !== isScrolled) setIsScrolled(t); ticking = false; };
    const onScroll = () => { if (!ticking) { window.requestAnimationFrame(updateScrollState); ticking = true; } };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isScrolled]);

  const safeTotalPrompts = Math.max(0, totalPrompts || 0);

  return (
    <>
      <section ref={heroRef}
        className="relative min-h-[480px] sm:min-h-[540px] flex items-center justify-center overflow-hidden border-b border-border"
        style={{ height: "75vh" }}
        aria-label="Introduction"
      >
        {/* ── Background layers (warm ivory, matching portfolio) ── */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* Warm gradient base */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(170deg, #ECE7E0 0%, #F7F1EA 38%, #FFFEF9 100%)" }} />
          {/* Color atmosphere */}
          <motion.div
            className="absolute -left-24 -top-16 w-[360px] h-[360px] rounded-full blur-3xl"
            animate={{ x: [0, 16, 0], y: [0, -10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            style={{ backgroundColor: "rgba(90,138,122,0.25)" }}
          />
          <motion.div
            className="absolute -right-20 top-[18%] w-[320px] h-[320px] rounded-full blur-3xl"
            animate={{ x: [0, -14, 0], y: [0, 10, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
            style={{ backgroundColor: "rgba(138,96,112,0.22)" }}
          />
          <motion.div
            className="absolute left-[36%] bottom-[-80px] w-[300px] h-[300px] rounded-full blur-3xl"
            animate={{ x: [0, 8, 0], y: [0, 12, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            style={{ backgroundColor: "rgba(176,122,78,0.2)" }}
          />
          {/* Soft radial spotlight */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(255,254,249,0.9) 0%, transparent 70%)" }} />
          {/* Subtle vignette */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(200,195,185,0.15) 100%)" }} />
          {/* Noise grain texture */}
          <div className="absolute inset-0" style={{
            opacity: 0.035,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }} />
        </div>

        {/* Top nav */}
        <TopNav onNavigateToCaseStudy={onNavigateToCaseStudy} onNavigateToPortfolio={onNavigateToPortfolio} />

        {/* ── Hero content ── */}
        <motion.div style={{ y, scale, opacity }} className="relative z-10 text-center px-5 sm:px-6 max-w-[900px] w-full">
          {/* Overline */}
          <motion.p
            className="mb-5 sm:mb-6 text-[11px] sm:text-xs uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-2)" }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            Production-Ready Prompts
          </motion.p>

          {/* Title */}
          <motion.h1
            className="mb-4 sm:mb-5"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400, letterSpacing: "-0.015em", color: "var(--text-1)" }}
            >
              Claude Opus 4.6
            </span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-1"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400, letterSpacing: "-0.015em", color: "#5A7A8A" }}
            >
              × Figma Make
            </span>
          </motion.h1>

          {/* Hairline rule */}
          <motion.div
            className="mx-auto mb-5 sm:mb-6"
            style={{ width: "var(--sp-5)", height: 1, backgroundColor: "var(--border-1)" }}
            initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl max-w-lg mx-auto text-balance px-2"
            style={{ fontFamily: "var(--font-body)", color: "var(--text-2)", lineHeight: 1.6, fontWeight: 300 }}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            A curated collection of {safeTotalPrompts} agentic prompts across {totalCategories} categories.
            <br className="hidden md:block" />
            Engineered for the next generation of automated design.
          </motion.p>

          <motion.div
            className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
          >
            {FRAMEWORK_PILLS.map((pill) => (
              <span
                key={pill.label}
                className="px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] border"
                style={{ fontFamily: "var(--font-body)", borderColor: `${pill.color}55`, color: pill.color, backgroundColor: `${pill.color}10` }}
              >
                {pill.label}
              </span>
            ))}
          </motion.div>

          {/* Meta bar */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-8 gap-y-1 mt-6 sm:mt-8 border px-4 sm:px-5 py-2.5 mx-auto w-fit relative overflow-hidden"
            style={{ fontFamily: "var(--font-body)", backgroundColor: "rgba(255,254,249,0.55)", borderColor: "rgba(176,122,78,0.28)" }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <div className="absolute inset-0 opacity-[0.14]" style={{ background: "linear-gradient(90deg, rgba(90,138,122,0.25), rgba(90,122,138,0.25), rgba(176,122,78,0.25), rgba(138,96,112,0.25), rgba(122,106,128,0.25))" }} />
            <span className="text-[10px] sm:text-[11px] text-muted-foreground/50 uppercase tracking-[0.14em]">v2.0</span>
            <span className="text-foreground/10">·</span>
            <span className="text-[10px] sm:text-[11px] text-muted-foreground/50 uppercase tracking-[0.14em]">{new Date().getFullYear()}</span>
            <span className="text-foreground/10">·</span>
            <span className="text-[10px] sm:text-[11px] text-muted-foreground/50 uppercase tracking-[0.14em]">{totalCategories} Categories</span>
            <span className="hidden sm:inline text-foreground/10">·</span>
            <span className="hidden sm:inline text-[10px] sm:text-[11px] text-muted-foreground/50 uppercase tracking-[0.14em]">React 18</span>
            <span className="hidden md:inline text-foreground/10">·</span>
            <span className="hidden md:inline text-[10px] sm:text-[11px] text-muted-foreground/50 uppercase tracking-[0.14em]">Opus 4.6</span>
          </motion.div>

          <motion.div
            className="mt-4 flex items-center justify-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.5 }}
          >
            {HERO_TONES.map((tone, idx) => (
              <span
                key={`${tone}-${idx}`}
                className="w-6 sm:w-8 h-1.5"
                style={{ backgroundColor: tone }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll CTA */}
        <ScrollCTA />
      </section>

      <StickyNavigation isVisible={isScrolled} totalPrompts={safeTotalPrompts} onNavigateToCaseStudy={onNavigateToCaseStudy} />
    </>
  );
}
