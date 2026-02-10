/**
 * ShelfDivider.tsx — Warm Stone Architectural Shelf
 *
 * Architectural shelf divider in warm stone — matching
 * the site's ivory/stone palette.
 * Load-bearing horizontal plane separating content zones.
 */

import type { CSSProperties } from "react";

const S = {
  bright: "#f0efe9",
  light:  "#e8e7e1",
  mid:    "#dbd9d2",
  border: "#cac5bb",
  shadow: "#b8b3a8",
  deep:   "#a9a49a",
} as const;

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`;

const enc = encodeURIComponent;

const palmetteSvg = `url("data:image/svg+xml,${enc(
  `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='10' viewBox='0 0 48 10'>
    <g transform='translate(24,9)' fill='none'>
      <path d='M0,-8 C1,-6 1.5,-3 0,0' stroke='rgba(0,0,0,0.05)' stroke-width='0.35'/>
      <path d='M0,-8 C-1,-6 -1.5,-3 0,0' stroke='rgba(0,0,0,0.05)' stroke-width='0.35'/>
      <path d='M-3,-7 C-2,-5 -1,-2 0,0' stroke='rgba(0,0,0,0.04)' stroke-width='0.3'/>
      <path d='M3,-7 C2,-5 1,-2 0,0' stroke='rgba(0,0,0,0.04)' stroke-width='0.3'/>
      <path d='M-5.5,-5.5 C-4,-4 -2,-1.5 0,0' stroke='rgba(0,0,0,0.03)' stroke-width='0.25'/>
      <path d='M5.5,-5.5 C4,-4 2,-1.5 0,0' stroke='rgba(0,0,0,0.03)' stroke-width='0.25'/>
      <circle cx='0' cy='0' r='1' fill='rgba(0,0,0,0.03)' stroke='rgba(0,0,0,0.05)' stroke-width='0.25'/>
    </g>
  </svg>`
)}")`;

const acanthusScrollSvg = `url("data:image/svg+xml,${enc(
  `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='14' viewBox='0 0 80 14'>
    <g fill='none'>
      <path d='M0,7 C5,2 10,1 15,3 C18,5 16,9 12,9 C9,9 8,7 10,5' stroke='rgba(0,0,0,0.04)' stroke-width='0.4'/>
      <path d='M20,7 C22,3 26,2 30,4 C33,6 31,10 27,10 C24,10 23,8 25,6' stroke='rgba(0,0,0,0.04)' stroke-width='0.4'/>
      <path d='M40,7 Q42,2 47,3 Q50,4 50,7 Q50,10 47,11 Q42,12 40,7Z' fill='rgba(0,0,0,0.015)' stroke='rgba(0,0,0,0.04)' stroke-width='0.35'/>
      <path d='M50,7 C55,2 60,1 65,3 C68,5 66,9 62,9 C59,9 58,7 60,5' stroke='rgba(0,0,0,0.04)' stroke-width='0.4'/>
      <path d='M70,7 C72,3 76,2 80,4' stroke='rgba(0,0,0,0.04)' stroke-width='0.4'/>
    </g>
  </svg>`
)}")`;

const flutedWide = `repeating-linear-gradient(90deg,
  rgba(255,255,255,0.45) 0px, rgba(255,255,255,0.45) 1px,
  transparent 1px, transparent 4px,
  rgba(0,0,0,0.025) 4px, rgba(0,0,0,0.025) 5px,
  transparent 5px, transparent 10px
)`;

const dentilPattern = `repeating-linear-gradient(90deg,
  rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 4px,
  rgba(0,0,0,0.07) 4px, rgba(0,0,0,0.07) 5px,
  transparent 5px, transparent 10px
)`;

const absFill: CSSProperties = { position: "absolute", inset: 0 };
function Fill({ style }: { style: CSSProperties }) {
  return <div aria-hidden style={{ ...absFill, ...style }} />;
}

export function ShelfDivider() {
  return (
    <div
      className="relative w-full select-none pointer-events-none"
      aria-hidden="true"
      style={{
        zIndex: 10,
        marginTop: -1,
        /* Ambient occlusion — shelf floating forward */
        boxShadow: `
          0 2px 6px rgba(0,0,0,0.06),
          0 6px 20px rgba(0,0,0,0.05),
          0 12px 40px rgba(0,0,0,0.03)
        `,
      }}
    >
      {/* Top face — bright highlight catching overhead light */}
      <div style={{
        height: 2,
        background: `linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)`,
        backgroundColor: S.bright,
      }} />

      {/* 1. Hairline rule */}
      <div style={{ height: 1, backgroundColor: S.border }} />

      {/* 2. Top lip */}
      <div style={{
        height: 3,
        backgroundColor: S.mid,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65), inset 0 -1px 0 rgba(0,0,0,0.04)",
      }} />

      {/* 3. Palmette frieze */}
      <div style={{
        height: 10, position: "relative", overflow: "hidden",
        backgroundColor: S.light,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.03)",
      }}>
        <Fill style={{ backgroundImage: palmetteSvg, backgroundSize: "48px 10px", backgroundRepeat: "repeat-x", backgroundPosition: "center" }} />
      </div>

      {/* 4. Step groove */}
      <div style={{ height: 1, backgroundColor: S.shadow }} />

      {/* 5. Acanthus scroll channel — recessed, darker */}
      <div style={{
        height: 14, position: "relative", overflow: "hidden",
        backgroundColor: S.mid,
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05), inset 0 -1px 2px rgba(0,0,0,0.03)",
      }}>
        <Fill style={{ backgroundImage: acanthusScrollSvg, backgroundSize: "80px 14px", backgroundRepeat: "repeat-x", backgroundPosition: "center" }} />
      </div>

      {/* 6. Hairline fillet */}
      <div style={{ height: 1, backgroundColor: S.border }} />

      {/* 7. Main fluted body — front face with top-to-bottom light falloff */}
      <div style={{
        height: 32, position: "relative", overflow: "hidden",
        backgroundColor: S.light,
        boxShadow: "inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -3px 6px rgba(0,0,0,0.04)",
      }}>
        <Fill style={{ backgroundImage: flutedWide }} />
        <Fill style={{ backgroundImage: NOISE, backgroundRepeat: "repeat", opacity: 0.025, mixBlendMode: "multiply" }} />
        {/* Top-to-bottom light falloff on the front face */}
        <Fill style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 40%, rgba(0,0,0,0.03) 100%)",
        }} />
      </div>

      {/* 8. Dentil row */}
      <div style={{
        height: 5, position: "relative", overflow: "hidden",
        backgroundColor: S.light,
        boxShadow: "inset 0 -1px 2px rgba(0,0,0,0.03)",
      }}>
        <Fill style={{ backgroundImage: dentilPattern }} />
      </div>

      {/* 9. Lower fascia — darker, underside starts */}
      <div style={{
        height: 6,
        backgroundColor: S.shadow,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.06)",
      }} />

      {/* 10. Bottom edge — underside shadow face */}
      <div style={{
        height: 3,
        background: `linear-gradient(180deg, ${S.shadow} 0%, ${S.deep} 100%)`,
        boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.08)",
      }} />

      {/* 11. Hairline rule */}
      <div style={{ height: 1, backgroundColor: S.deep }} />

      {/* Cast shadow — pronounced shadow casting onto the footer plinth below */}
      <div aria-hidden style={{
        position: "absolute", top: "100%", left: 0, right: 0, height: 32,
        background: `linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.10) 50%, transparent 100%)`,
        pointerEvents: "none",
      }} />
    </div>
  );
}