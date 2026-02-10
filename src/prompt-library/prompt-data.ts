/* ── Prompt Data ────────────────────────────────────────────
 * Central barrel file that merges both prompt sets and
 * exports the shared Prompt type + categories list.
 *
 * PRODUCTION NOTES:
 * - CategoryKey is imported from category-colors.ts (single source of truth)
 * - Prompt.category is typed as CategoryKey | string for data compatibility
 * - categories uses `as const` satisfies for exhaustive type inference
 * ────────────────────────────────────────────────────────── */

import { promptsSet1 } from "./prompts-1-50";
import { promptsSet2 } from "./prompts-51-100";
import type { CategoryKey } from "./category-colors";

/* -------------------------------------------------------------------------- */
/*                                Core Types                                  */
/* -------------------------------------------------------------------------- */

export interface Prompt {
  /** Unique numeric identifier (1–100) */
  readonly id: number;
  /** Category key — should match a CategoryKey; string fallback for extensibility */
  readonly category: CategoryKey | (string & {});
  /** Human-readable title */
  readonly title: string;
  /** Brief description shown on the card */
  readonly description: string;
  /** The actual prompt text to copy */
  readonly prompt: string;
  /** Searchable tags */
  readonly tags: readonly string[];
}

/** Re-export CategoryKey for downstream consumers */
export type { CategoryKey };

/* -------------------------------------------------------------------------- */
/*                              Categories List                               */
/* -------------------------------------------------------------------------- */

export interface CategoryEntry {
  readonly key: "all" | CategoryKey;
  readonly label: string;
}

export const categories: readonly CategoryEntry[] = [
  { key: "all",          label: "All" },
  { key: "foundation",   label: "Foundation" },
  { key: "components",   label: "Components" },
  { key: "interactions", label: "Interactions" },
  { key: "data",         label: "Data & Logic" },
  { key: "design",       label: "Design Systems" },
  { key: "ai-patterns",  label: "AI & LLM" },
  { key: "integration",  label: "Integration" },
  { key: "advanced",     label: "Advanced" },
] as const;

/* -------------------------------------------------------------------------- */
/*                              Merged Prompt Set                             */
/* -------------------------------------------------------------------------- */

export const prompts: readonly Prompt[] = [...promptsSet1, ...promptsSet2];
