/**
 * FrenchDivider.tsx — Architectural Section Dividers
 *
 * Ornate French-inspired shelf / architectural molding dividers
 * in the French blue palette (#4A6FA5). Three variants for
 * different architectural weight:
 *   "thin"    — Picture-rail molding
 *   "shelf"   — Gallery shelf with refined ornament (default)
 *   "cornice" — Grand cornice with richer layering
 *
 * Design principle: Tasteful ornament, museum-grade detailing,
 * quiet luxury editorial aesthetic.
 */

import { motion } from "motion/react";
import type { CSSProperties } from "react";

/* ─── French blue palette matching CardNavigation ─── */
const P = {
  bright: "#6B8BB8",
  light: "#5A7DAE",
  mid: "#4A6FA5",
  border: "#3F5E8A",
  shadow: "#354F75",
  deep: "#2A3F5F",
} as const;

interface FrenchDividerProps {
  variant?: "thin" | "shelf" | "cornice";
  style?: CSSProperties;
  className?: string;
}

/* ─── Shared helpers ─── */

const absFill: CSSProperties = { position: "absolute", inset: 0 };

function Fill({ style }: { style: CSSProperties }) {
  return <div aria-hidden style={{ ...absFill, ...style }} />;
}

/** Refined fluted pattern — architectural vertical grooves */
const flutedPattern = `repeating-linear-gradient(90deg,
  rgba(255,255,255,0.24) 0px,
  rgba(255,255,255,0.24) 1px,
  transparent 1px,
  transparent 6px,
  rgba(0,0,0,0.03) 6px,
  rgba(0,0,0,0.03) 7px,
  transparent 7px,
  transparent 12px
)`;

/** Dentil block pattern — classical tooth molding */
const dentilPattern = `repeating-linear-gradient(90deg,
  rgba(0,0,0,0.03) 0px,
  rgba(0,0,0,0.03) 5px,
  rgba(0,0,0,0.06) 5px,
  rgba(0,0,0,0.06) 6px,
  transparent 6px,
  transparent 12px
)`;

/** Micro-noise for painted wood realism */
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.25' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`;

/** Palmette ornament — neoclassical fan motif */
const enc = encodeURIComponent;
const palmetteSvg = `url("data:image/svg+xml,${enc(
  `<svg xmlns='http://www.w3.org/2000/svg' width='56' height='12' viewBox='0 0 56 12'>
    <g transform='translate(28,10)' fill='none' stroke-linecap='round'>
      <path d='M0,-9 C1.2,-6.8 1.8,-3.2 0,0' stroke='rgba(0,0,0,0.06)' stroke-width='0.45'/>
      <path d='M0,-9 C-1.2,-6.8 -1.8,-3.2 0,0' stroke='rgba(0,0,0,0.06)' stroke-width='0.45'/>
      <path d='M-3.6,-8 C-2.5,-6 -1.2,-2.8 0,0' stroke='rgba(0,0,0,0.05)' stroke-width='0.35'/>
      <path d='M3.6,-8 C2.5,-6 1.2,-2.8 0,0' stroke='rgba(0,0,0,0.05)' stroke-width='0.35'/>
      <path d='M-6.8,-6.4 C-5,-4.6 -2.6,-2 0,0' stroke='rgba(0,0,0,0.04)' stroke-width='0.3'/>
      <path d='M6.8,-6.4 C5,-4.6 2.6,-2 0,0' stroke='rgba(0,0,0,0.04)' stroke-width='0.3'/>
      <circle cx='0' cy='0' r='1.2' fill='rgba(0,0,0,0.035)' stroke='rgba(0,0,0,0.06)' stroke-width='0.25'/>
    </g>
  </svg>`
)}")`;

/** Acanthus scroll band — subtle repeating motif */
const scrollBandSvg = `url("data:image/svg+xml,${enc(
  `<svg xmlns='http://www.w3.org/2000/svg' width='72' height='16' viewBox='0 0 72 16'>
    <g fill='none' stroke='rgba(0,0,0,0.055)' stroke-width='0.6' stroke-linecap='round'>
      <path d='M6,12 C10,4 18,4 22,12' />
      <path d='M22,12 C26,4 34,4 38,12' />
      <path d='M38,12 C42,4 50,4 54,12' />
      <path d='M54,12 C58,4 66,4 70,12' />
      <path d='M14,12 C16,10 16,8 14,6' />
      <path d='M30,12 C32,10 32,8 30,6' />
      <path d='M46,12 C48,10 48,8 46,6' />
      <path d='M62,12 C64,10 64,8 62,6' />
    </g>
  </svg>`
)}")`;

export function FrenchDivider({
  variant = "shelf",
  style,
  className,
}: FrenchDividerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ width: "100%", ...style }}
      className={className}
      aria-hidden="true"
    >
      {variant === "thin" && <ThinMolding />}
      {variant === "shelf" && <GalleryShelf />}
      {variant === "cornice" && <GrandCornice />}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
 * Variant 1: Thin Molding
 * Lightest profile — picture rail / chair rail
 * ═══════════════════════════════════════════════════════════ */
function ThinMolding() {
  return (
    <div style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${P.border} 15%, ${P.border} 85%, transparent 100%)`,
        }}
      />
      <div
        style={{
          height: 5,
          background: `linear-gradient(180deg, rgba(255,255,255,0.18), transparent 60%)`,
          backgroundColor: P.light,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.05)",
        }}
      />
      <div
        style={{
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, ${P.border} 15%, ${P.border} 85%, transparent 100%)`,
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
 * Variant 2: Gallery Shelf (default)
 * Museum display shelf — refined ornament, tasteful layering
 * Profile: ~75px with cast shadow
 * ═══════════════════════════════════════════════════════════ */
function GalleryShelf() {
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        boxShadow: `
          0 2px 6px rgba(0,0,0,0.05),
          0 10px 26px rgba(0,0,0,0.05),
          0 18px 44px rgba(0,0,0,0.03)
        `,
      }}
    >
      {/* 1) Top highlight lip */}
      <div
        style={{
          height: 3,
          backgroundColor: P.bright,
          background:
            `linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 100%), ${P.bright}`,
        }}
      />

      {/* 2) Hairline */}
      <div style={{ height: 1, backgroundColor: P.border }} />

      {/* 3) Upper bead (bevel) */}
      <div
        style={{
          height: 5,
          backgroundColor: P.mid,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.50), inset 0 -2px 3px rgba(0,0,0,0.06)",
          background:
            `linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 55%, rgba(0,0,0,0.05) 100%), ${P.mid}`,
        }}
      />

      {/* 4) Palmette frieze (recessed) */}
      <div
        style={{
          height: 12,
          position: "relative",
          overflow: "hidden",
          backgroundColor: P.light,
          boxShadow:
            "inset 0 2px 4px rgba(0,0,0,0.05), inset 0 -2px 4px rgba(0,0,0,0.04)",
        }}
      >
        <Fill
          style={{
            backgroundImage: palmetteSvg,
            backgroundSize: "56px 12px",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "center",
            opacity: 0.95,
          }}
        />
        <Fill
          style={{
            backgroundImage: NOISE,
            backgroundRepeat: "repeat",
            opacity: 0.02,
            mixBlendMode: "multiply",
          }}
        />
      </div>

      {/* 5) Groove */}
      <div style={{ height: 1, backgroundColor: P.shadow }} />

      {/* 6) Acanthus scroll band */}
      <div
        style={{
          height: 8,
          position: "relative",
          overflow: "hidden",
          backgroundColor: P.light,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.20)",
        }}
      >
        <Fill
          style={{
            backgroundImage: scrollBandSvg,
            backgroundRepeat: "repeat-x",
            backgroundPosition: "center",
            backgroundSize: "72px 16px",
            opacity: 0.9,
          }}
        />
      </div>

      {/* 7) Main fascia (fluted) */}
      <div
        style={{
          height: 28,
          position: "relative",
          overflow: "hidden",
          backgroundColor: P.light,
          boxShadow:
            "inset 0 2px 0 rgba(255,255,255,0.45), inset 0 -3px 6px rgba(0,0,0,0.05)",
        }}
      >
        <Fill style={{ backgroundImage: flutedPattern }} />
        <Fill
          style={{
            backgroundImage: NOISE,
            backgroundRepeat: "repeat",
            opacity: 0.02,
            mixBlendMode: "multiply",
          }}
        />
        <Fill
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 45%, rgba(0,0,0,0.035) 100%)",
          }}
        />
      </div>

      {/* 8) Dentil row */}
      <div
        style={{
          height: 6,
          position: "relative",
          overflow: "hidden",
          backgroundColor: P.light,
          boxShadow: "inset 0 -1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <Fill style={{ backgroundImage: dentilPattern }} />
      </div>

      {/* 9) Underside fascia */}
      <div
        style={{
          height: 8,
          backgroundColor: P.shadow,
          background:
            `linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 35%, rgba(0,0,0,0.16) 100%), ${P.shadow}`,
          boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.10)",
        }}
      />

      {/* 10) Bottom edge to deep */}
      <div
        style={{
          height: 3,
          background: `linear-gradient(180deg, ${P.shadow} 0%, ${P.deep} 100%)`,
          boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.10)",
        }}
      />

      {/* 11) Bottom hairline */}
      <div style={{ height: 1, backgroundColor: P.deep }} />

      {/* Cast shadow — installed shelf depth */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          height: 28,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.05) 40%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
 * Variant 3: Grand Cornice
 * Heaviest profile — Louvre-era crown moulding
 * Symmetric layering, richer recesses
 * Profile: ~60px with cast shadow
 * ═══════════════════════════════════════════════════════════ */
function GrandCornice() {
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        boxShadow: `
          0 2px 6px rgba(0,0,0,0.045),
          0 10px 28px rgba(0,0,0,0.045),
          0 18px 46px rgba(0,0,0,0.03)
        `,
      }}
    >
      {/* 1) Top rim highlight */}
      <div
        style={{
          height: 3,
          background:
            `linear-gradient(180deg, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.10) 100%), ${P.bright}`,
        }}
      />

      {/* 2) Hairline */}
      <div style={{ height: 1, backgroundColor: P.border }} />

      {/* 3) Upper bead (chunkier bevel) */}
      <div
        style={{
          height: 7,
          background:
            `linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 55%, rgba(0,0,0,0.08) 100%), ${P.mid}`,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -2px 4px rgba(0,0,0,0.08)",
        }}
      />

      {/* 4) Groove */}
      <div style={{ height: 1, backgroundColor: P.shadow }} />

      {/* 5) Recessed ornamental channel (palmette + scroll) */}
      <div
        style={{
          height: 14,
          position: "relative",
          overflow: "hidden",
          backgroundColor: P.light,
          boxShadow:
            "inset 0 3px 6px rgba(0,0,0,0.06), inset 0 -3px 6px rgba(0,0,0,0.06)",
        }}
      >
        <Fill
          style={{
            backgroundImage: palmetteSvg,
            backgroundRepeat: "repeat-x",
            backgroundPosition: "center",
            backgroundSize: "56px 12px",
            opacity: 0.9,
          }}
        />
        <Fill
          style={{
            backgroundImage: scrollBandSvg,
            backgroundRepeat: "repeat-x",
            backgroundPosition: "center",
            backgroundSize: "72px 16px",
            opacity: 0.55,
            mixBlendMode: "multiply",
          }}
        />
        <Fill
          style={{
            backgroundImage: NOISE,
            backgroundRepeat: "repeat",
            opacity: 0.018,
            mixBlendMode: "multiply",
          }}
        />
        <Fill
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(0,0,0,0.05) 100%)",
          }}
        />
      </div>

      {/* 6) Groove */}
      <div style={{ height: 1, backgroundColor: P.shadow }} />

      {/* 7) Broad fluted field (center mass) */}
      <div
        style={{
          height: 18,
          position: "relative",
          overflow: "hidden",
          backgroundColor: P.light,
          boxShadow:
            "inset 0 2px 0 rgba(255,255,255,0.36), inset 0 -3px 7px rgba(0,0,0,0.06)",
        }}
      >
        <Fill style={{ backgroundImage: flutedPattern }} />
        <Fill
          style={{
            backgroundImage: NOISE,
            backgroundRepeat: "repeat",
            opacity: 0.018,
            mixBlendMode: "multiply",
          }}
        />
        <Fill
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 55%, rgba(0,0,0,0.045) 100%)",
          }}
        />
      </div>

      {/* 8) Lower bead (mirrors upper) */}
      <div
        style={{
          height: 7,
          background:
            `linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 50%, rgba(0,0,0,0.12) 100%), ${P.mid}`,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.10)",
        }}
      />

      {/* 9) Bottom edge to deep */}
      <div
        style={{
          height: 3,
          background: `linear-gradient(180deg, ${P.shadow} 0%, ${P.deep} 100%)`,
          boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.12)",
        }}
      />

      {/* 10) Bottom hairline */}
      <div style={{ height: 1, backgroundColor: P.deep }} />

      {/* Cast shadow — crown moulding weight */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          height: 26,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.045) 45%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
