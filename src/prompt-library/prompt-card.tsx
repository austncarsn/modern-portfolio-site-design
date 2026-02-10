import React, { useCallback } from "react";
import { Heart, ChevronRight, Zap, Check } from "lucide-react";
import { motion } from "motion/react";
import type { Prompt } from "./prompt-data";
import { getCategoryColor, getCategoryLabel } from "./category-colors";

interface PromptCardProps {
  prompt: Prompt;
  onOpen: (prompt: Prompt) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  isSelected?: boolean;
}

export const PromptCard = React.memo(function PromptCard({
  prompt,
  onOpen,
  isFavorite,
  onToggleFavorite,
  isSelected = false,
}: PromptCardProps) {
    const colors = getCategoryColor(prompt.category);

    const handleFavorite = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(prompt.id);
      },
      [prompt.id, onToggleFavorite],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(prompt);
        }
      },
      [onOpen, prompt],
    );

    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => onOpen(prompt)}
        onKeyDown={handleKeyDown}
        className={`group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${isSelected ? "bg-secondary/40 ring-1 ring-foreground/15" : ""}`}
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        aria-current={isSelected ? "true" : undefined}
        aria-label={`Open prompt ${String(prompt.id).padStart(3, "0")}: ${prompt.title}`}
      >
        <div className={`relative flex items-start gap-4 sm:gap-6 px-4 sm:px-6 py-5 sm:py-6 border-b border-border bg-card transition-colors duration-200 ${isSelected ? "bg-secondary/40" : "hover:bg-secondary/30"}`}>
          {/* ── Index number ── */}
          <span className="text-[11px] tracking-[0.14em] text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors pt-0.5 flex-shrink-0 w-7 text-right tabular-nums select-none"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {String(prompt.id).padStart(3, "0")}
          </span>

          {/* ── Entry body ── */}
          <div className="flex-1 min-w-0">
            {/* Category label */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-1.5 h-1.5 flex-shrink-0"
                style={{ backgroundColor: colors.accent }}
              />
              <span
                className="text-[10px] uppercase tracking-[0.14em] leading-none"
                style={{ color: colors.accent, fontFamily: "var(--font-body)" }}
              >
                {getCategoryLabel(prompt.category)}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/30 leading-none hidden sm:inline-flex items-center gap-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <Zap className="w-2 h-2 inline" strokeWidth={2} />
                {colors.effort}
              </span>
            </div>

            {/* Title — glossary term */}
            <h3 className="text-lg sm:text-xl text-foreground/90 group-hover:text-foreground transition-colors leading-snug mb-2"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              {prompt.title}
            </h3>

            {/* Description — glossary definition */}
            <p className="text-sm text-muted-foreground/70 group-hover:text-muted-foreground transition-colors line-clamp-2 leading-relaxed mb-3"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {prompt.description}
            </p>

            {/* Tags (inline, subtle) */}
            <div className="flex items-center gap-2 overflow-hidden">
              {prompt.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-muted-foreground/40 uppercase tracking-wider truncate max-w-[100px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {tag}
                </span>
              ))}
              {prompt.tags.length > 3 && (
                <span className="text-[10px] text-muted-foreground/25 tracking-wider"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  +{prompt.tags.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
            {isSelected && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-[0.14em] bg-foreground text-background">
                <Check className="w-2.5 h-2.5" strokeWidth={2.4} />
                Selected
              </span>
            )}
            <button
              onClick={handleFavorite}
              className={`p-2 transition-colors duration-200 ${
                isFavorite
                  ? "text-foreground"
                  : "text-muted-foreground/20 hover:text-muted-foreground/60"
              }`}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart
                className={`w-3.5 h-3.5 ${isFavorite ? "fill-foreground" : ""}`}
                strokeWidth={1.5}
              />
            </button>
            <ChevronRight
              className="w-3.5 h-3.5 text-muted-foreground/20 group-hover:text-muted-foreground/50 group-hover:translate-x-0.5 transition-all duration-200 hidden sm:block"
              strokeWidth={1.5}
            />
          </div>

          {/* Accent line on hover */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-[3px] transition-opacity duration-300 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            style={{ backgroundColor: colors.accent }}
          />
        </div>
      </motion.div>
    );
});
