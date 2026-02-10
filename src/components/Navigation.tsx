import { memo, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { EASE_EXPO_OUT } from "./motion-variants";
import shrimpsArtwork from "../assets/shrimps-artwork.png";

/* Simple inline AC monogram (SVG) */
function Monogram({ size = 36 }: { size?: number }) {
  const color = "var(--text-1)";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Austin Carson</title>
      <rect width="48" height="48" rx="8" fill="none" />
      <circle cx="24" cy="24" r="22" fill="currentColor" opacity="0.06" />
      <g transform="translate(6,8) scale(0.7)" fill="none" stroke={color} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 28 L6 4 L24 28" />
        <path d="M30 4 L18 28" />
      </g>
    </svg>
  );
}

/* ───────────────────────── Noise texture ───────────────────────── */

const NOISE_URI = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/* ───────────────────────── Motion variants ───────────────────────── */

const bootContainer: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: EASE_EXPO_OUT,
      staggerChildren: 0.08,
    },
  },
};

const bootChild: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_EXPO_OUT },
  },
};

/* ───────────────────────── Hero title ───────────────────────── */

export type HeroTitleProps = {
  firstName: string;
  lastName: string;
};

const HeroTitle = memo(function HeroTitle({
  firstName,
  lastName,
}: HeroTitleProps) {
  const textStyle = useMemo<React.CSSProperties>(
    () => ({
      fontFamily: "var(--font-display)",
      fontSize: "clamp(2.5rem, 7.5vw, 6rem)",
      fontWeight: 400,
      letterSpacing: "-0.02em",
      lineHeight: 1.1,
      color: "var(--text-1)",
      mixBlendMode: "multiply",
    }),
    []
  );

  return (
    <motion.div
      variants={bootChild}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <span style={textStyle}>{firstName}</span>
      <span style={textStyle}>{lastName}</span>
    </motion.div>
  );
});

/* ───────────────────────── Hero section ───────────────────────── */

export type HeroSectionProps = {
  firstName?: string;
  lastName?: string;
  maxWidth?: number;
  className?: string;
};

export function HeroSection({
  firstName = "Austin",
  lastName = "Carson",
  maxWidth = 1120,
  className,
}: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <section
      className={className}
      aria-label="Hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background layers */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #EDE9E3 0%, #F0ECE6 20%, #F3F0EB 40%, #F5F4F1 60%, #FFFEF9 85%, #FFFEF9 100%)",
          zIndex: 0,
        }}
      />

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }
        }
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, transparent 0%, transparent 15%, rgba(228,227,222,0.3) 30%, rgba(245,244,241,0.6) 50%, #FFFEF9 70%, #FFFEF9 100%)",
          zIndex: 1,
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(255,254,249,0.6) 0%, transparent 60%)",
          zIndex: 2,
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(202,197,187,0.12) 100%)",
          zIndex: 2,
        }}
      />

      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: NOISE_URI,
          backgroundRepeat: "repeat",
          opacity: 0.04,
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <motion.div
        variants={bootContainer}
        initial={prefersReducedMotion ? "visible" : "hidden"}
        animate="visible"
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth,
          margin: "0 auto",
          padding:
            "clamp(80px, 14vh, 160px) clamp(16px, 4vw, 48px) var(--sp-16)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.p
          variants={bootChild}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--ts-overline)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-2)",
            marginBottom: "var(--sp-4)",
          }}
        >
          Design Engineer
        </motion.p>

        <HeroTitle firstName={firstName} lastName={lastName} />

        <motion.div
          variants={bootChild}
          aria-hidden
          style={{
            width: "var(--sp-6)",
            height: 1,
            backgroundColor: "var(--border-1)",
            margin: "40px 0",
          }}
        />

        <motion.div
          variants={bootChild}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              position: "relative",
              border: "1px solid var(--border-1)",
              padding: "clamp(16px, 2vw, 28px)",
              backgroundColor: "var(--surface-1)",
            }}
          >
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: NOISE_URI,
                backgroundRepeat: "repeat",
                opacity: 0.025,
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                border: "1px solid var(--border-1)",
                padding: "clamp(3px, 0.4vw, 5px)",
                backgroundColor: "var(--surface-2)",
              }}
            >
              <img
                src={shrimpsArtwork}
                alt="Mixed-media collage — original artwork by Austin Carson"
                style={{
                  display: "block",
                  width: "clamp(120px, 18vw, 200px)",
                  height: "auto",
                }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function Navigation() {
  const [open, setOpen] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const navigate = useNavigate();

  const location = useLocation();

  const items = useMemo(() => [
    { to: '/projects', label: 'Case Studies' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/prompt-library', label: 'Prompt Library' },
    { to: '/prompt-notebook', label: 'Notebook' },
    { to: '/flashcards', label: 'Flashcards' },
    { to: '/cameo-store', label: 'Cameo Store' },
    { to: '/resume', label: 'Resume' },
    { to: '/info', label: 'Info' },
  ], []);

  const caseStudyHref = useMemo(() => {
    const p = location.pathname;
    if (p.startsWith('/projects/')) return `${p}#case-study`;
    if (p === '/prompt-library') return '/prompt-library#case-study';
    if (p.startsWith('/prompt-notebook')) return '/prompt-notebook#case-study';
    return null;
  }, [location.pathname]);

  return (
    <header
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 60,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        backgroundColor: 'color-mix(in srgb, var(--surface-1) 80%, transparent)',
        borderBottom: '1px solid var(--border-1)',
      }}
    >
      <nav
        aria-label="Site"
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: 'var(--sp-3) var(--sp-4)',
          display: 'block',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', left: 'var(--sp-4)', top: '50%', transform: 'translateY(-50%)' }}>
          <Link to="/" aria-label="Home" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--text-1)' }}>
            <Monogram size={36} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600 }}>Austin Carson</span>
          </Link>
        </div>

        {/* Centered links */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="desktop-only nav-links-desktop" style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            {items.map((it) => (
              <Link key={it.to} to={it.to} style={{ color: 'var(--text-1)', textDecoration: 'none', fontSize: '0.95rem' }}>
                {it.label}
              </Link>
            ))}

            {caseStudyHref && (
              <button
                onClick={() => navigate(caseStudyHref)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-1)', textDecoration: 'none', fontSize: '0.95rem', padding: '6px 8px', borderRadius: 8 }}
                aria-label="Open case study"
              >
                Case Study
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu button (right aligned) */}
        <div style={{ position: 'absolute', right: 'var(--sp-4)', top: '50%', transform: 'translateY(-50%)' }}>
          <div className="mobile-only" style={{ display: 'inline-flex', alignItems: 'center' }}>
            <motion.button
              aria-expanded={open}
              aria-controls="site-navigation-mobile"
              onClick={() => setOpen((v) => !v)}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              className="p-2 rounded-md"
              style={{ background: 'transparent', border: '1px solid transparent' }}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {/* simple hamburger / close icon */}
              {open ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 6L18 18M6 18L18 6" stroke="var(--text-1)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M3 6h18M3 12h18M3 18h18" stroke="var(--text-1)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.18 }}
            className="mobile-nav-overlay"
            onClick={() => setOpen(false)}
          >
            <motion.div
              id="site-navigation-mobile"
              role="menu"
              aria-label="Mobile site navigation"
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
              className="mobile-nav-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Link to="/" onClick={() => setOpen(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--text-1)' }}>
                  <Monogram size={28} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600 }}>Austin Carson</span>
                </Link>
                <button aria-label="Close menu" onClick={() => setOpen(false)} style={{ padding: 8, borderRadius: 8, background: 'transparent', border: 'none' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 6L18 18M6 18L18 6" stroke="var(--text-1)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <nav aria-label="Mobile Links" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {items.map((it) => (
                  <Link key={it.to} to={it.to} onClick={() => setOpen(false)} role="menuitem" style={{ color: 'var(--text-1)' }}>
                    {it.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
