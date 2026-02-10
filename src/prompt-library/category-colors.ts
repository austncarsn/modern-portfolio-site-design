/* ── Category Color System ──────────────────────────────────
 * Swiss Style / International Inks for Cinematic Light
 * Deep, pigment-rich tones that anchor the gallery aesthetic.
 *
 * PRODUCTION NOTE: CategoryKey is the single source of truth.
 * Adding a new category requires updating this union type,
 * then the compiler will flag every location that must change.
 * ────────────────────────────────────────────────────────── */

/** Exhaustive union of all valid prompt categories */
export type CategoryKey =
  | "foundation"
  | "components"
  | "interactions"
  | "data"
  | "design"
  | "advanced"
  | "ai-patterns"
  | "integration";

/** Effort level required by the LLM for this category */
export type EffortLevel = "Medium" | "High" | "Max";

/** Thinking strategy used */
export type ThinkingMode = "adaptive" | "standard";

export interface CategoryColor {
  readonly accent: string;
  readonly label?: string;
  readonly effort: EffortLevel;
  readonly thinking: ThinkingMode;
  readonly attachments?: readonly string[];
}

/**
 * Strongly-typed category → color mapping.
 * Record<CategoryKey, ...> ensures every CategoryKey has an entry.
 */
export const categoryColors: Record<CategoryKey, CategoryColor> = {
  foundation:   { accent: "#6B6560", effort: "High",   thinking: "adaptive" },
  components:   { accent: "#5A7A8A", effort: "Medium", thinking: "standard" },
  interactions: { accent: "#7B6B8A", effort: "High",   thinking: "adaptive" },
  data:         { accent: "#5C6B8A", effort: "Max",    thinking: "adaptive" },
  design:       { accent: "#8A6070", effort: "Medium", thinking: "standard", attachments: ["Figma library", "screenshot"] },
  advanced:     { accent: "#5A8A7A", effort: "High",   thinking: "adaptive" },
  "ai-patterns": { accent: "#7A6A80", label: "AI / LLM", effort: "High", thinking: "adaptive" },
  integration:  { accent: "#5A7A6A", effort: "Medium", thinking: "standard" },
} as const;

/** Default fallback color (foundation) */
const FALLBACK: CategoryColor = categoryColors.foundation;

/**
 * Type guard: validates that a string is a known CategoryKey.
 * Useful for runtime validation of data from external sources.
 */
export function isCategoryKey(key: string): key is CategoryKey {
  return key in categoryColors;
}

/** Get the color config for a category, with safe fallback */
export function getCategoryColor(key: string): CategoryColor {
  if (isCategoryKey(key)) return categoryColors[key];
  return FALLBACK;
}

/** Get the display label for a category */
export function getCategoryLabel(key: string): string {
  if (isCategoryKey(key)) {
    return categoryColors[key].label ?? key.replace("-", " ");
  }
  return key.replace("-", " ");
}
