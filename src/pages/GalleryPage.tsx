import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Play, Image as ImageIcon, Film } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { galleryItems, type GalleryItem, type GalleryMediaType } from "../data/gallery";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useStaggerVariants } from "../components/motion-variants";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";

type FilterValue = "all" | GalleryMediaType;
type FilterIcon = "image" | "video" | null;
type FilterDefinition = { value: FilterValue; label: string; icon: FilterIcon };

// Varying aspect ratios for masonry effect
const ASPECT_RATIOS = [
  1,      // Square
  4 / 3,  // Landscape
  3 / 4,  // Portrait
  16 / 9, // Wide
  5 / 4,  // Slightly wide
];

const BENTO_SPANS = ["wide", "square", "tall", "square", "wide", "tall", "square"] as const;
const IMAGE_EXT_REGEX = /\.(png|jpe?g|webp|avif|gif|bmp|svg)$/i;
const FILTERS: FilterDefinition[] = [
  { value: "all", label: "All", icon: null },
  { value: "image", label: "PNG", icon: "image" },
  { value: "video", label: "Video", icon: "video" },
];

function escapeXmlText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isImageUrl(url: string) {
  return IMAGE_EXT_REGEX.test((url || "").split(/[?#]/)[0]);
}

function buildVideoPoster(item: GalleryItem) {
  const label = escapeXmlText(`${item.title} • ${item.year}`);
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4A6FA5"/>
      <stop offset="55%" stop-color="#2A3C59"/>
      <stop offset="100%" stop-color="#171F2D"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <rect x="28" y="28" width="1224" height="664" fill="none" stroke="rgba(255,255,255,0.24)" stroke-width="2"/>
  <circle cx="640" cy="360" r="56" fill="rgba(255,255,255,0.94)"/>
  <polygon points="622,330 622,390 678,360" fill="#24354f"/>
  <text x="640" y="620" text-anchor="middle" fill="rgba(255,255,255,0.92)" font-size="28" font-family="Inter, Arial, sans-serif" letter-spacing="1.4">${label}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function GalleryPage() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const [lightboxPool, setLightboxPool] = useState<GalleryItem[]>([]);
  const [previewReady, setPreviewReady] = useState<Record<string, boolean>>({});
  const filterButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { container, item, prefersReduced } = useStaggerVariants();

  const featuredItem = useMemo(
    () => galleryItems.find((entry) => entry.title === "Classical Cameo Relief") || galleryItems[0],
    []
  );
  const gridItems = useMemo(
    () => galleryItems.filter((entry) => entry.id !== featuredItem.id),
    [featuredItem]
  );

  const filtered = useMemo(
    () => (filter === "all" ? gridItems : gridItems.filter((entry) => entry.type === filter)),
    [filter, gridItems]
  );

  const closeLightbox = useCallback(() => {
    setLightboxId(null);
  }, []);
  const markPreviewReady = useCallback((id: string) => {
    setPreviewReady((current) => (current[id] ? current : { ...current, [id]: true }));
  }, []);

  const openLightbox = useCallback(
    (clickedItem: GalleryItem) => {
      const poolWithoutDuplicateFeatured = filtered.filter((entry) => entry.id !== featuredItem.id);
      const pool = [featuredItem, ...poolWithoutDuplicateFeatured];
      setLightboxPool(pool);
      setLightboxId(clickedItem.id);
    },
    [filtered, featuredItem]
  );

  const handleFilterKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
      const moveTo = (targetIndex: number) => {
        const normalized = (targetIndex + FILTERS.length) % FILTERS.length;
        setFilter(FILTERS[normalized].value);
        filterButtonRefs.current[normalized]?.focus();
      };

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        moveTo(index + 1);
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        moveTo(index - 1);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        moveTo(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        moveTo(FILTERS.length - 1);
      }
    },
    []
  );

  useEffect(() => {
    if (!lightboxId) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      }
    };

    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = previousOverflow;
    };
  }, [lightboxId, closeLightbox]);

  const lightboxSlides = useMemo(
    () =>
      lightboxPool.map((entry) =>
        entry.type === "video"
          ? {
              type: "video" as const,
              width: 1920,
              height: 1080,
              poster: isImageUrl(entry.thumbnailUrl) ? entry.thumbnailUrl : buildVideoPoster(entry),
              title: entry.title,
              description: entry.year,
              sources: [{ src: entry.fullUrl, type: "video/mp4" }],
            }
          : {
              src: entry.fullUrl,
              alt: entry.title,
              title: entry.title,
              description: entry.year,
            }
      ),
    [lightboxPool]
  );

  const lightboxIndex = useMemo(() => {
    if (!lightboxId) {
      return 0;
    }
    const activeSlideIndex = lightboxPool.findIndex((entry) => entry.id === lightboxId);
    return activeSlideIndex >= 0 ? activeSlideIndex : 0;
  }, [lightboxId, lightboxPool]);

  const { imageCount, videoCount } = useMemo(() => {
    return galleryItems.reduce(
      (totals, entry) => {
        if (entry.type === "video") {
          totals.videoCount += 1;
        } else {
          totals.imageCount += 1;
        }
        return totals;
      },
      { imageCount: 0, videoCount: 0 }
    );
  }, []);

  return (
    <>
      <style>{`
        .gallery-page-shell {
          display: flex;
          flex-direction: column;
          gap: var(--sp-6);
          background:
            radial-gradient(circle at 82% 14%, color-mix(in srgb, #4a6fa5 14%, transparent) 0%, transparent 36%),
            radial-gradient(circle at 12% 88%, color-mix(in srgb, #29261f 10%, transparent) 0%, transparent 34%),
            var(--surface-0);
        }
        .gallery-frame {
          border-radius: 18px;
          overflow: hidden;
        }
        .ornate-frame {
          position: relative;
          padding: 22px;
          background:
            linear-gradient(180deg, color-mix(in srgb, #4a6fa5 10%, var(--surface-0)) 0%, var(--surface-0) 42%);
        }
        .ornate-frame::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>\
<rect x='2' y='2' width='96' height='96' fill='none' stroke='rgba(255,255,255,0.28)' stroke-width='0.8'/>\
<rect x='4' y='4' width='92' height='92' fill='none' stroke='rgba(255,255,255,0.18)' stroke-width='0.4'/>\
<path d='M8 8 Q12 12 16 8 M84 8 Q88 12 92 8 M8 92 Q12 88 16 92 M84 92 Q88 88 92 92' stroke='rgba(255,255,255,0.35)' stroke-width='0.6' fill='none'/>\
</svg>");
          background-size: 100% 100%;
          opacity: 0.9;
        }
        .ornate-inner {
          position: relative;
          z-index: 1;
          border-radius: 12px;
          background: var(--surface-0);
          padding: var(--sp-3);
        }
        .gallery-content {
          position: relative;
          max-width: 1120px;
          margin: 0 auto;
          width: 100%;
        }
        .gallery-topbar {
          padding: var(--sp-4) var(--sp-4) var(--sp-3);
          border: 1px solid color-mix(in srgb, #4a6fa5 18%, var(--border-1));
          background: color-mix(in srgb, #4a6fa5 8%, var(--surface-1));
          border-radius: 12px;
        }
        .gallery-main-header {
          margin-bottom: var(--sp-10);
          max-width: 760px;
        }
        .gallery-overline {
          font-size: var(--ts-overline);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-2);
          margin: 0 0 var(--sp-3) 0;
          font-family: var(--font-body);
        }
        .gallery-rule {
          width: var(--sp-6);
          height: 1px;
          background: var(--border-1);
          margin-bottom: var(--sp-4);
        }
        .gallery-title {
          font-family: var(--font-display);
          font-size: clamp(2.1rem, 5.4vw, 3.7rem);
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 0.98;
          margin: 0 0 var(--sp-4) 0;
          color: var(--text-1);
        }
        .gallery-lede {
          font-size: clamp(1rem, 1.2vw, 1.08rem);
          line-height: 1.6;
          color: var(--text-2);
          margin: 0 0 var(--sp-5) 0;
          max-width: 68ch;
        }
        .gallery-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--sp-2);
        }
        .gallery-pill {
          display: inline-flex;
          align-items: center;
          gap: var(--sp-2);
          border: 1px solid var(--border-1);
          padding: 6px 10px;
          font-size: var(--ts-overline);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-2);
          background: color-mix(in srgb, #4a6fa5 8%, var(--surface-1));
        }
        .gallery-featured {
          margin-bottom: var(--sp-12);
        }
        .gallery-featured-card {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          cursor: pointer;
          background-color: var(--surface-2);
          padding: 0;
          border: 1px solid var(--border-1);
          transition: transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease;
        }
        .gallery-featured-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 28px rgba(20, 20, 20, 0.14);
          border-color: color-mix(in srgb, var(--text-2) 30%, var(--border-1));
        }
        .gallery-featured-badge {
          position: absolute;
          top: var(--sp-3);
          left: var(--sp-3);
          z-index: 2;
          font-size: var(--ts-overline);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #f9f9f8;
          border: 1px solid rgba(255,255,255,0.28);
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(6px);
          padding: 4px 8px;
        }
        .gallery-filter-wrap {
          display: flex;
          gap: var(--sp-2);
          margin-bottom: var(--sp-6);
          flex-wrap: wrap;
        }
        .gallery-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--sp-1);
          padding: var(--sp-2) var(--sp-3);
          font-size: var(--ts-overline);
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: 1px solid var(--border-1);
          background: color-mix(in srgb, #4a6fa5 7%, var(--surface-1));
          color: var(--text-2);
          cursor: pointer;
          transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease;
        }
        .gallery-filter-btn[data-active="true"] {
          background: var(--selected-bg);
          color: var(--selected-fg);
          border-color: var(--selected-bg);
        }
        .gallery-filter-btn:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--text-1) 76%, white 24%);
          outline-offset: 2px;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--sp-3);
        }
        @media (min-width: 860px) {
          .gallery-grid {
            grid-template-columns: repeat(12, minmax(0, 1fr));
            grid-auto-rows: 56px;
            grid-auto-flow: dense;
          }
          .gallery-card {
            aspect-ratio: auto !important;
            height: 100%;
            min-height: 240px;
          }
          .gallery-card[data-span="wide"] {
            grid-column: span 8;
            grid-row: span 5;
          }
          .gallery-card[data-span="square"] {
            grid-column: span 4;
            grid-row: span 5;
          }
          .gallery-card[data-span="tall"] {
            grid-column: span 4;
            grid-row: span 7;
          }
        }
        .gallery-card {
          position: relative;
          display: block;
          width: 100%;
          overflow: hidden;
          cursor: pointer;
          background-color: var(--surface-2);
          padding: 0;
          border: 1px solid var(--border-1);
          transition: transform 250ms ease, box-shadow 250ms ease, border-color 250ms ease;
        }
        .gallery-card:hover {
          border-color: color-mix(in srgb, var(--text-2) 30%, var(--border-1));
          box-shadow: 0 10px 22px rgba(10, 10, 10, 0.1);
        }
        .gallery-preview-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          background: color-mix(in srgb, #4a6fa5 12%, var(--surface-1));
        }
        .gallery-preview-placeholder {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.28) 45%, transparent 70%),
            color-mix(in srgb, #4a6fa5 12%, var(--surface-1));
          background-size: 220% 100%, auto;
          animation: galleryShimmer 1.5s linear infinite;
        }
        .gallery-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          opacity: 0;
          transition: opacity 220ms ease;
        }
        .gallery-preview[data-ready="true"] {
          opacity: 1;
        }
        @keyframes galleryShimmer {
          0% { background-position: 180% 0, 0 0; }
          100% { background-position: -80% 0, 0 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gallery-preview-placeholder {
            animation: none;
          }
        }
        .gallery-layout {
          display: block;
          padding: var(--sp-5);
        }
      `}</style>
      <div className="gallery-page-shell">
        <div className="gallery-frame ornate-frame">
          <div className="ornate-inner">
            <div className="gallery-topbar">
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
            <div className="gallery-layout">
              <motion.div variants={container} initial="hidden" animate="visible" className="gallery-content">
      {/* Header */}
      <motion.header variants={item} className="gallery-main-header">
        <p className="gallery-overline">Creative Work</p>
        <div className="gallery-rule" />
        <h1 className="gallery-title">Digital Art Gallery</h1>
        <p className="gallery-lede">
          Explorations in AI-generated imagery — testing visual design through iterative prompting, style transfer, and compositional refinement. Each piece represents dozens of generations, parameter tweaks, and aesthetic decisions.
        </p>
        <div className="gallery-meta">
          <span className="gallery-pill">{galleryItems.length} pieces</span>
          <span className="gallery-pill">{imageCount} stills</span>
          <span className="gallery-pill">{videoCount} motion</span>
        </div>
      </motion.header>

      {/* Featured Project */}
      <motion.section variants={item} className="gallery-featured">
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--sp-4)",
        }}>
          <h2 style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--ts-overline)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-2)",
            fontWeight: 500,
          }}>
            Featured
          </h2>
        </div>

        <button
          type="button"
          onClick={() => openLightbox(featuredItem)}
          className="gallery-featured-card"
          aria-label={`View featured: ${featuredItem.title}`}
        >
          <span className="gallery-featured-badge">Featured Drop</span>
          <div className="gallery-preview-wrap">
            {!previewReady[featuredItem.id] && (
              <div className="gallery-preview-placeholder" aria-hidden />
            )}
            {featuredItem.type === "video" ? (
              <video
                src={featuredItem.fullUrl}
                poster={isImageUrl(featuredItem.thumbnailUrl) ? featuredItem.thumbnailUrl : buildVideoPoster(featuredItem)}
                preload="metadata"
                muted
                playsInline
                onLoadedData={() => markPreviewReady(featuredItem.id)}
                onError={() => markPreviewReady(featuredItem.id)}
                className="gallery-preview"
                data-ready={previewReady[featuredItem.id] ? "true" : "false"}
              />
            ) : (
              <ImageWithFallback
                src={featuredItem.thumbnailUrl}
                alt={featuredItem.title}
                onLoad={() => markPreviewReady(featuredItem.id)}
                onError={() => markPreviewReady(featuredItem.id)}
                data-ready={previewReady[featuredItem.id] ? "true" : "false"}
                className="gallery-preview"
              />
            )}
          </div>

          {/* Label overlay */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "var(--sp-7) var(--sp-4) var(--sp-4)",
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
          }}>
            <p style={{
              fontSize: "var(--ts-h3)",
              fontWeight: 500,
              color: "#fff",
              letterSpacing: "-0.01em",
              fontFamily: "var(--font-display)",
              marginBottom: "var(--sp-1)",
              lineHeight: 1.1,
            }}>
              {featuredItem.title}
            </p>
            <p style={{
              fontSize: "var(--ts-caption)",
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.02em",
              fontFamily: "var(--font-body)",
            }}>
              {featuredItem.year} · Featured Work
            </p>
          </div>
        </button>
      </motion.section>

      {/* Grid header */}
      <motion.div variants={item} style={{ marginBottom: "var(--sp-5)" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "var(--sp-4)",
          flexWrap: "wrap",
          gap: "var(--sp-3)",
        }}>
          <h2 style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--ts-overline)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-2)",
            fontWeight: 500,
          }}>
            All Work
          </h2>
          <p style={{
            fontSize: "var(--ts-overline)",
            color: "var(--text-2)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            {imageCount} images &middot; {videoCount} videos
          </p>
        </div>
      </motion.div>

      {/* Segmented control / Filter */}
      <motion.div
        variants={item}
        className="gallery-filter-wrap"
        role="radiogroup"
        aria-label="Filter gallery by type"
      >
        {FILTERS.map((f, index) => {
          const isActive = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              ref={(node) => {
                filterButtonRefs.current[index] = node;
              }}
              onKeyDown={(event) => handleFilterKeyDown(event, index)}
              onClick={() => setFilter(f.value)}
              className="gallery-filter-btn"
              data-active={isActive ? "true" : "false"}
            >
              {f.icon === "image" ? (
                <ImageIcon size={12} strokeWidth={1.5} />
              ) : f.icon === "video" ? (
                <Film size={12} strokeWidth={1.5} />
              ) : null}
              {f.label}
            </button>
          );
        })}
      </motion.div>

      {/* Gallery grid - Masonry-style with varying heights */}
      <motion.div
        key={filter}
        variants={container}
        initial="hidden"
        animate="visible"
        className="gallery-grid"
      >
        {filtered.map((galleryItem, index) => {
          // Assign varying aspect ratios for visual interest
          const aspectRatio = ASPECT_RATIOS[index % ASPECT_RATIOS.length];
          const bentoSpan = BENTO_SPANS[index % BENTO_SPANS.length];

          return (
            <motion.button
              key={galleryItem.id}
              type="button"
              variants={item}
              onClick={() => openLightbox(galleryItem)}
              transition={{ duration: 0.2 }}
              className="gallery-card"
              data-span={bentoSpan}
              style={{
                aspectRatio: String(aspectRatio),
              }}
              whileHover={{
                scale: prefersReduced ? 1 : 1.02,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              }}
              aria-label={`Open ${galleryItem.title}`}
            >
              <div className="gallery-preview-wrap">
                {!previewReady[galleryItem.id] && (
                  <div className="gallery-preview-placeholder" aria-hidden />
                )}
                {galleryItem.type === "video" ? (
                  <video
                    src={galleryItem.fullUrl}
                    poster={isImageUrl(galleryItem.thumbnailUrl) ? galleryItem.thumbnailUrl : buildVideoPoster(galleryItem)}
                    preload="metadata"
                    muted
                    playsInline
                    onLoadedData={() => markPreviewReady(galleryItem.id)}
                    onError={() => markPreviewReady(galleryItem.id)}
                    className="gallery-preview"
                    data-ready={previewReady[galleryItem.id] ? "true" : "false"}
                  />
                ) : (
                  <ImageWithFallback
                    src={galleryItem.thumbnailUrl}
                    alt={galleryItem.title}
                    onLoad={() => markPreviewReady(galleryItem.id)}
                    onError={() => markPreviewReady(galleryItem.id)}
                    className="gallery-preview"
                    data-ready={previewReady[galleryItem.id] ? "true" : "false"}
                  />
                )}
              </div>

              {galleryItem.type === "video" && (
                <div style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  width: 32,
                  height: 32,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  backdropFilter: "blur(8px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                }} aria-hidden>
                  <Play size={12} fill="#fff" color="#fff" />
                </div>
              )}

              {/* Label overlay */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "var(--sp-8) var(--sp-4) var(--sp-4)",
                background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
              }}>
                <p style={{
                  fontSize: "var(--ts-small)",
                  fontWeight: 500,
                  color: "#fff",
                  letterSpacing: "0.01em",
                  fontFamily: "var(--font-body)",
                  marginBottom: 4,
                }}>
                  {galleryItem.title}
                </p>
                <p style={{
                  fontSize: "var(--ts-overline)",
                  color: "rgba(255,255,255,0.6)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-body)",
                }}>
                  {galleryItem.year}
                </p>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        open={!!lightboxId}
        close={closeLightbox}
        index={lightboxIndex}
        slides={lightboxSlides}
        plugins={[Thumbnails, Captions, Zoom, Fullscreen, Video]}
        carousel={{ finite: false }}
        controller={{ closeOnBackdropClick: true }}
        captions={{ showToggle: true, descriptionTextAlign: "center" }}
        thumbnails={{ position: "bottom", width: 120, height: 80, borderRadius: 0 }}
        zoom={{ maxZoomPixelRatio: 3, zoomInMultiplier: 2 }}
        styles={{
          container: { backgroundColor: "rgba(8, 10, 14, 0.92)", backdropFilter: "blur(8px)" },
        }}
      />
    </>
  );
}
