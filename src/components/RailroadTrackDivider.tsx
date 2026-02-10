import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import trainSpriteUrl from "../assets/hero/train.svg";

type TrackAccent = "off" | "blue" | "vermillion";
type TrackSize = "sm" | "md" | "lg";
type TrackDetail = "standard" | "premium";
type TrainDirection = "left-to-right" | "right-to-left";
type TrackScene = "studio" | "outdoor";
type TrackVariant = "classic" | "future";
type TrainStyle = "on-track" | "hover";

interface RailroadTrackDividerProps {
  height?: number;
  maxWidth?: number | string;
  accent?: TrackAccent;
  accentLine?: TrackAccent;
  ariaLabel?: string;
  label?: string;
  size?: TrackSize;
  detail?: TrackDetail;
  scene?: TrackScene;
  variant?: TrackVariant;
  trainActive?: boolean;
  trainDirection?: TrainDirection;
  trainStyle?: TrainStyle;
}

type TrackGeom = {
  height: number;
  gauge: number;
  railWidth: number;
  tieLength: number;
  tieWidth: number;
  tieSpacing: number;
};

const TRACK_W_FALLBACK = 1000;

const TRAIN_SPRITE_VIEW_W = 1332;
const TRAIN_SPRITE_VIEW_H = 222;
const TRAIN_SPRITE_ASPECT = TRAIN_SPRITE_VIEW_W / TRAIN_SPRITE_VIEW_H;

const GEOM_CONFIG: Record<TrackSize, TrackGeom> = {
  sm: {
    height: 96,
    gauge: 14,
    railWidth: 2,
    tieLength: 28,
    tieWidth: 4,
    tieSpacing: 12,
  },
  md: {
    height: 128,
    gauge: 22,
    railWidth: 3,
    tieLength: 46,
    tieWidth: 7,
    tieSpacing: 18,
  },
  lg: {
    height: 160,
    gauge: 30,
    railWidth: 4,
    tieLength: 64,
    tieWidth: 10,
    tieSpacing: 26,
  },
};

const TRACK_COLORS = {
  ballast: "var(--track-ballast, #2b2f36)",
  tie: "var(--track-tie, #15181e)",
  fastener: "var(--track-fastener, #3d4452)",
  railBase: "var(--track-rail-base, #0a0b0e)",
  railTop: "var(--track-rail-top, #4c5566)",
};

const ACCENT = {
  blue: "var(--track-accent-blue, #1f4f8f)",
  vermillion: "var(--track-accent-vermillion, #b3293f)",
} as const;

export function RailroadTrackDivider({
  height = 46,
  maxWidth = "100%",
  accent = "off",
  accentLine,
  ariaLabel = "Railroad track divider",
  label,
  size = "md",
  detail = "premium",
  scene = "studio",
  variant = "classic",
  trainActive = false,
  trainDirection = "left-to-right",
  trainStyle = "on-track",
}: RailroadTrackDividerProps) {
  const uid = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion() ?? false;
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [viewportPx, setViewportPx] = useState<{ width: number; height: number } | null>(null);
  const geomBase = GEOM_CONFIG[size];

  const geom = useMemo(() => {
    const effective =
      variant === "future"
        ? {
            ...geomBase,
            tieLength: Math.round(geomBase.tieLength * 0.74),
            tieWidth: Math.max(3, Math.round(geomBase.tieWidth * 0.78)),
            tieSpacing: Math.max(10, Math.round(geomBase.tieSpacing * 0.82)),
          }
        : geomBase;

    const cy = Math.round(effective.height / 2);
    const railYOffset = effective.gauge / 2;
    const railTopY = cy - railYOffset - effective.railWidth;
    const railBottomY = cy + railYOffset;

    return {
      ...effective,
      cy,
      railYOffset,
      railTopY,
      railBottomY,
    };
  }, [geomBase, variant]);

  const ballastGradId = `${uid}-ballast-grad`;
  const tiesPatternId = `${uid}-ties-pattern`;
  const tieGradId = `${uid}-tie-grad`;
  const railSheenId = `${uid}-rail-sheen`;
  const railEdgeId = `${uid}-rail-edge`;
  const railShadowId = `${uid}-rail-shadow`;
  const trainShadowId = `${uid}-train-shadow`;
  const resolvedAccent = accentLine ?? accent;

  const ballastY = geom.cy - geom.tieLength / 2 - 4;
  const ballastH = geom.tieLength + 8;
  const isFuture = variant === "future";

  useEffect(() => {
    const el = hostRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      setViewportPx((prev) => {
        const next = { width: rect.width, height: rect.height };
        if (prev && Math.abs(prev.width - next.width) < 0.5 && Math.abs(prev.height - next.height) < 0.5) {
          return prev;
        }
        return next;
      });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Keep x/y scale uniform by matching viewBox aspect ratio to the rendered viewport.
  const trackW = useMemo(() => {
    const w = viewportPx?.width ?? 0;
    const h = viewportPx?.height ?? 0;
    if (w > 0 && h > 0) {
      return Math.max(TRACK_W_FALLBACK, Math.round((w * geom.height) / Math.max(1, h)));
    }
    return TRACK_W_FALLBACK;
  }, [viewportPx, geom.height]);

  return (
    <div
      ref={hostRef}
      role="separator"
      aria-label={ariaLabel}
      style={{
        width: "100%",
        maxWidth,
        height,
      }}
    >
      <svg
        className="relative z-10 w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${trackW} ${geom.height}`}
        preserveAspectRatio="none"
      >
        {label ? <title>{label}</title> : null}

        <defs>
          <linearGradient id={tieGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d2027" stopOpacity="0.98" />
            <stop offset="55%" stopColor="#12141a" stopOpacity="1" />
            <stop offset="100%" stopColor="#0b0c10" stopOpacity="1" />
          </linearGradient>

          <linearGradient id={railSheenId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8f98aa" stopOpacity="0.92" />
            <stop offset="35%" stopColor="#5a6274" stopOpacity="0.86" />
            <stop offset="100%" stopColor="#303646" stopOpacity="0.92" />
          </linearGradient>

          <linearGradient id={railEdgeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#121318" stopOpacity="1" />
            <stop offset="100%" stopColor="#050608" stopOpacity="1" />
          </linearGradient>

          {detail === "premium" && (
            <filter id={railShadowId} x="-10%" y="-40%" width="120%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" />
            </filter>
          )}

          <filter id={trainShadowId} x="-30%" y="-80%" width="160%" height="260%">
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="5"
              floodColor="#000000"
              floodOpacity="0.22"
            />
          </filter>

          {detail === "premium" && (
            <linearGradient id={ballastGradId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={isFuture ? "var(--track-bed, #1d232a)" : TRACK_COLORS.ballast}
                stopOpacity="0.92"
              />
              <stop
                offset="50%"
                stopColor={isFuture ? "var(--track-bed, #161b22)" : TRACK_COLORS.ballast}
                stopOpacity="1"
              />
              <stop
                offset="100%"
                stopColor={isFuture ? "var(--track-bed, #1d232a)" : TRACK_COLORS.ballast}
                stopOpacity="0.92"
              />
            </linearGradient>
          )}

          <pattern
            id={tiesPatternId}
            x="0"
            y="0"
            width={geom.tieSpacing}
            height={geom.height}
            patternUnits="userSpaceOnUse"
          >
            <g transform={`translate(${geom.tieSpacing / 2}, ${geom.cy})`}>
              <rect
                x={-geom.tieWidth / 2}
                y={-geom.tieLength / 2}
                width={geom.tieWidth}
                height={geom.tieLength}
                fill={detail === "premium" ? `url(#${tieGradId})` : TRACK_COLORS.tie}
                rx={1}
              />

              {detail === "premium" && (
                <rect
                  x={-geom.tieWidth / 2 + 1}
                  y={-geom.tieLength / 2 + 1}
                  width={Math.max(0, geom.tieWidth - 2)}
                  height={Math.max(0, geom.tieLength - 2)}
                  fill="none"
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth="0.5"
                  rx={0.5}
                />
              )}

              {detail === "premium" && (
                <>
                  <rect
                    x={-geom.tieWidth / 2}
                    y={-geom.tieLength / 2}
                    width={geom.tieWidth}
                    height={1}
                    fill="rgba(255,255,255,0.10)"
                  />
                  <rect
                    x={-geom.tieWidth / 2}
                    y={geom.tieLength / 2 - 1}
                    width={geom.tieWidth}
                    height={1}
                    fill="rgba(0,0,0,0.28)"
                  />
                </>
              )}

              <g
                fill={TRACK_COLORS.fastener}
                opacity={detail === "premium" ? 0.9 : 0.75}
              >
                <rect
                  x={-geom.tieWidth / 2 + 1}
                  y={-geom.railYOffset - geom.railWidth - 1}
                  width={geom.tieWidth - 2}
                  height={geom.railWidth + 2}
                />
                <rect
                  x={-geom.tieWidth / 2 + 1}
                  y={geom.railYOffset - 1}
                  width={geom.tieWidth - 2}
                  height={geom.railWidth + 2}
                />
              </g>
            </g>
          </pattern>
        </defs>

        <g shapeRendering={isFuture ? "geometricPrecision" : "crispEdges"}>
          <rect
            x="0"
            y={ballastY}
            width={String(trackW)}
            height={ballastH}
            fill={
              detail === "premium"
                ? `url(#${ballastGradId})`
                : TRACK_COLORS.ballast
            }
            opacity={detail === "premium" ? 1 : 0.8}
          />

          {/* Ballast edge highlight/shadow (realism) */}
          {detail === "premium" && (
            <>
              <rect
                x="0"
                y={ballastY}
                width={String(trackW)}
                height={1}
                fill="rgba(255,255,255,0.10)"
              />
              <rect
                x="0"
                y={ballastY + ballastH - 1}
                width={String(trackW)}
                height={1}
                fill="rgba(0,0,0,0.22)"
              />
            </>
          )}

          <rect
            x="0"
            y="0"
            width={String(trackW)}
            height={geom.height}
            fill={`url(#${tiesPatternId})`}
          />

          <g>
            {detail === "premium" && (
              <rect
                x="0"
                y={geom.railTopY - 1}
                width={String(trackW)}
                height={geom.railWidth + 2}
                fill="rgba(0,0,0,0.32)"
                filter={`url(#${railShadowId})`}
                opacity={0.8}
              />
            )}
            <rect
              x="0"
              y={geom.railTopY - 1}
              width={String(trackW)}
              height={geom.railWidth + 2}
              fill={detail === "premium" ? `url(#${railEdgeId})` : TRACK_COLORS.railBase}
            />
            <rect
              x="0"
              y={geom.railTopY + 1}
              width={String(trackW)}
              height={Math.max(1, geom.railWidth - 2)}
              fill={detail === "premium" ? `url(#${railSheenId})` : TRACK_COLORS.railTop}
              opacity={detail === "premium" ? 0.65 : 0.5}
            />
            {detail === "premium" && (
              <rect
                x="0"
                y={geom.railTopY}
                width={String(trackW)}
                height={1}
                fill="rgba(255,255,255,0.14)"
              />
            )}
          </g>

          <g>
            {detail === "premium" && (
              <rect
                x="0"
                y={geom.railBottomY}
                width={String(trackW)}
                height={geom.railWidth + 2}
                fill="rgba(0,0,0,0.32)"
                filter={`url(#${railShadowId})`}
                opacity={0.8}
              />
            )}
            <rect
              x="0"
              y={geom.railBottomY}
              width={String(trackW)}
              height={geom.railWidth + 2}
              fill={detail === "premium" ? `url(#${railEdgeId})` : TRACK_COLORS.railBase}
            />
            <rect
              x="0"
              y={geom.railBottomY + 1}
              width={String(trackW)}
              height={Math.max(1, geom.railWidth - 2)}
              fill={detail === "premium" ? `url(#${railSheenId})` : TRACK_COLORS.railTop}
              opacity={detail === "premium" ? 0.65 : 0.5}
            />
            {detail === "premium" && (
              <rect
                x="0"
                y={geom.railBottomY + 1}
                width={String(trackW)}
                height={1}
                fill="rgba(255,255,255,0.10)"
              />
            )}
          </g>

          {resolvedAccent !== "off" && (
            <rect
              x="0"
              y={geom.cy - (size === "sm" ? 0.5 : 1)}
              width={String(trackW)}
              height={size === "sm" ? 1 : 2}
              fill={
                resolvedAccent === "blue"
                  ? ACCENT.blue
                  : ACCENT.vermillion
              }
              opacity={isFuture ? 0.55 : 1}
            />
          )}

          {/* Futuristic: a clean guideway strip (subtle, no neon) */}
          {isFuture && (
            <>
              <rect
                x="0"
                y={Math.max(0, geom.cy - Math.round(geom.gauge * 0.95))}
                width={String(trackW)}
                height={Math.round(geom.gauge * 1.9)}
                fill="rgba(255,255,255,0.04)"
              />
              <rect
                x="0"
                y={Math.max(0, geom.cy - Math.round(geom.gauge * 0.95))}
                width={String(trackW)}
                height={1}
                fill="rgba(255,255,255,0.10)"
                opacity={0.6}
              />
              <rect
                x="0"
                y={Math.max(0, geom.cy + Math.round(geom.gauge * 0.95))}
                width={String(trackW)}
                height={1}
                fill="rgba(0,0,0,0.28)"
                opacity={0.7}
              />
            </>
          )}
        </g>

        <AnimatePresence mode="wait">
          {trainActive && !reduceMotion && (
            <Train
              key={`${uid}-${trainDirection}`}
              direction={trainDirection}
              gauge={geom.gauge}
              cy={geom.cy}
              accentLine={resolvedAccent}
              style={trainStyle}
              shadowFilterId={trainShadowId}
              trackWidth={trackW}
            />
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}

function makeTrainColors(accentLine: TrackAccent) {
  // Backwards-compat: Train color hints (not used by sprite train).
  const stripe =
    accentLine === "vermillion"
      ? "var(--track-train-accent-vermillion, #8d2b35)"
      : accentLine === "blue"
        ? "var(--track-train-accent-blue, #2b4f74)"
        : "var(--track-train-accent, #334155)";

  return { stripe };
}

function Train({
  direction,
  gauge,
  cy,
  accentLine,
  style,
  shadowFilterId,
  trackWidth,
}: {
  direction: TrainDirection;
  gauge: number;
  cy: number;
  accentLine: TrackAccent;
  style: TrainStyle;
  shadowFilterId: string;
  trackWidth: number;
}) {
  const isLTR = direction === "left-to-right";

  // Slightly tone down any overly bright user SVGs without going neon.
  // (Mostly no-op for monochrome trains.)
  useMemo(() => makeTrainColors(accentLine), [accentLine]);

  const spriteH = Math.max(22, Math.round(gauge * 3.0));
  const spriteW = Math.max(120, Math.round(spriteH * TRAIN_SPRITE_ASPECT));

  const variants = useMemo(() => {
    const startX = isLTR ? -spriteW - 120 : trackWidth + 120;
    const endX = isLTR ? trackWidth + 120 : -spriteW - 120;

    return {
      initial: { x: startX, opacity: 1 },
      animate: {
        x: endX,
        opacity: 1,
        transition: { duration: 5.2, ease: "linear" as const },
      },
      exit: { opacity: 0, transition: { duration: 0.2 } },
    };
  }, [isLTR, spriteW, trackWidth]);

  return (
    <motion.g
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      style={{ willChange: "transform" }}
      shapeRendering="geometricPrecision"
    >
      <g
        transform={`translate(0, ${cy + (style === "hover" ? -Math.round(gauge * 0.32) : 0)})`}
        filter={style === "hover" ? `url(#${shadowFilterId})` : undefined}
      >
        <g transform={isLTR ? "" : `translate(${spriteW}, 0) scale(-1, 1)`}>
          {style === "hover" ? (
            <ellipse
              cx={spriteW * 0.52}
              cy={Math.round(gauge * 0.58)}
              rx={Math.round(spriteW * 0.40)}
              ry={Math.max(2, Math.round(gauge * 0.18))}
              fill="rgba(0,0,0,0.18)"
              opacity={0.55}
            />
          ) : null}

          <image
            href={trainSpriteUrl}
            x={0}
            y={-spriteH / 2}
            width={spriteW}
            height={spriteH}
            preserveAspectRatio="xMidYMid meet"
            opacity={0.98}
          />
        </g>
      </g>
    </motion.g>
  );
}
