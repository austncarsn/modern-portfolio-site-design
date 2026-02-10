/**
 *  StickerRail.tsx — Infinite-scroll marquee of sticker thumbnails
 *
 *  A smooth, auto-scrolling horizontal rail that showcases the
 *  art sticker collection. Pauses on hover, keyboard accessible,
 *  and respects prefers-reduced-motion.
 */

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { clsx } from "clsx";
// Import available sticker assets
import userCloudSticker from "figma:asset/805a6f3508cf622cb9159868a1a587509b739f95.png";
import heartSticker from "figma:asset/f85d096177bad17676da47be64c08e159cab1459.png";
import bananaSticker from "figma:asset/a43c611d37822e3c55c5a52c5b87570b07694286.png";

/* ── Sticker data ──────────────────────────────────────────── */

interface Sticker {
  id: string;
  src: string;
  alt: string;
  rotation: number;
}

const STICKERS: Sticker[] = [
  { id: "s1", src: userCloudSticker, alt: "Cloud Sticker", rotation: -12 },
  { id: "s2", src: heartSticker, alt: "Heart Sticker", rotation: 8 },
  { id: "s3", src: bananaSticker, alt: "Banana Sticker", rotation: -5 },
];

// Double the array to create seamless loop
const RAIL_ITEMS = [...STICKERS, ...STICKERS];

/* ── Single sticker chip ───────────────────────────────────── */

function StickerChip({ sticker }: { sticker: Sticker }) {
  return (
    <motion.div
      className="group flex-shrink-0"
      initial={{ opacity: 0, scale: 0.5, rotate: sticker.rotation + 180 }}
      animate={{ opacity: 1, scale: 1, rotate: sticker.rotation }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{
        scale: 1.15,
        rotate: 0,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
      whileTap={{ scale: 0.92, rotate: sticker.rotation - 5 }}
    >
      <div className="relative w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center cursor-default">
        {/* Glossy highlight overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full blur-xl" />

        <img
          src={sticker.src}
          alt={sticker.alt}
          className="w-full h-full object-contain pointer-events-none select-none drop-shadow-sm"
          loading="lazy"
          draggable={false}
        />

        {/* Ambient glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10 blur-2xl scale-150" />
      </div>
    </motion.div>
  );
}

/* ── Exported rail ─────────────────────────────────────────── */

export function StickerRail({ className }: { className?: string }) {
  const reduced = !!useReducedMotion();
  const [paused, setPaused] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  // Total width of one set of stickers (approximate)
  const singleSetWidth = STICKERS.length * 92; // chip + gap

  return (
    <div
      className={clsx("relative w-full overflow-hidden", className)}
      style={{ padding: "8px 0" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-label="Sticker collection rail"
    >
      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, var(--surface-0) 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to left, var(--surface-0) 0%, transparent 100%)",
        }}
      />

      {/* Scrolling track */}
      <motion.div
        ref={railRef}
        className="flex items-center gap-5"
        style={{ width: "max-content" }}
        animate={
          reduced
            ? {}
            : {
                x: [0, -singleSetWidth],
              }
        }
        transition={
          reduced
            ? {}
            : {
                x: {
                  duration: 28,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                },
              }
        }
        {...(!reduced && {
          style: {
            width: "max-content",
            animationPlayState: paused ? "paused" : "running",
          },
        })}
      >
        {RAIL_ITEMS.map((sticker, i) => (
          <StickerChip key={`${sticker.id}-${i}`} sticker={sticker} />
        ))}
      </motion.div>
    </div>
  );
}