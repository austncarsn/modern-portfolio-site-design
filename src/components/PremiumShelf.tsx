/**
 * PremiumShelf.tsx — Display Shelf
 *
 * Editorial presentation of display items and sticker rail.
 * Clean museum layout with hairline borders and flat surfaces.
 */

import { motion } from "motion/react";
import pandaImg from "figma:asset/a16ddc572b7ee405d3b37b68281ef58b6fe71317.png";
import bananaImg from "figma:asset/180b5e132ef1b8c3b08ec78e87b2b07cb42e0a6c.png";
import { StickerRail } from "./StickerRail";

const SPACE_IMG =
  "https://images.unsplash.com/photo-1760196339465-e403a30d662e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWVwJTIwc3BhY2UlMjBzdGFycyUyMG5lYnVsYSUyMGRhcmt8ZW58MXx8fHwxNzcwMzU0OTIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const shelfItems = [
  { img: pandaImg, label: "Gazpacho" },
  { img: bananaImg, label: "Banana" },
  { img: pandaImg, label: "Panda Duck" },
  { img: pandaImg, label: "Spring" },
  { img: pandaImg, label: "Dahlia" },
  { img: pandaImg, label: "Ranunculus" },
];

export const PremiumShelf = () => {
  return (
    <div style={{
      width: "100%",
      maxWidth: 1120,
      margin: "0 auto",
      padding: "64px 24px",
    }} className="md:!px-10">
      {/* Section header */}
      <div style={{ marginBottom: 48 }}>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--ts-overline)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-2)",
          marginBottom: 12,
        }}>
          Display
        </p>
        <div style={{ width: 32, height: 1, backgroundColor: "var(--border-1)", marginBottom: 16 }} />
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: "var(--ts-h2)",
          lineHeight: 1.1,
          letterSpacing: "-0.015em",
          color: "var(--text-1)",
        }}>
          Shelf
        </h2>
      </div>

      {/* Space display — cinematic viewport */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 640,
          margin: "0 auto 48px",
          border: "1px solid var(--border-1)",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative", height: 220, backgroundColor: "#0a0a0f" }}>
          <img
            src={SPACE_IMG}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.35) saturate(1.2)",
            }}
          />
          {/* Corner marks */}
          {[
            { top: 12, left: 12, borderLeft: "1px solid rgba(255,255,255,0.15)", borderTop: "1px solid rgba(255,255,255,0.15)" },
            { top: 12, right: 12, borderRight: "1px solid rgba(255,255,255,0.15)", borderTop: "1px solid rgba(255,255,255,0.15)" },
            { bottom: 12, left: 12, borderLeft: "1px solid rgba(255,255,255,0.15)", borderBottom: "1px solid rgba(255,255,255,0.15)" },
            { bottom: 12, right: 12, borderRight: "1px solid rgba(255,255,255,0.15)", borderBottom: "1px solid rgba(255,255,255,0.15)" },
          ].map((pos, i) => (
            <div
              key={i}
              aria-hidden
              style={{
                position: "absolute",
                width: 16,
                height: 16,
                pointerEvents: "none",
                ...pos,
              }}
            />
          ))}
          {/* Caption overlay */}
          <div style={{
            position: "absolute",
            bottom: 12,
            left: 16,
            fontFamily: "var(--font-body)",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
          }}>
            Deep Space
          </div>
        </div>
      </motion.div>

      {/* Display items grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 0,
          border: "1px solid var(--border-1)",
          marginBottom: 48,
        }}
        className="!grid-cols-2 sm:!grid-cols-3 md:!grid-cols-6"
      >
        {shelfItems.map((item, i) => (
          <div
            key={item.label + i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "24px 12px 16px",
              borderRight: "1px solid var(--border-1)",
              borderBottom: "1px solid var(--border-1)",
            }}
          >
            <motion.img
              src={item.img}
              alt={item.label}
              style={{
                height: 64,
                width: "auto",
                objectFit: "contain",
                marginBottom: 12,
              }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            />
            <span style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--ts-overline)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-2)",
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Sticker Rail */}
      <StickerRail />
    </div>
  );
};
