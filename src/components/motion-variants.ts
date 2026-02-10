/**
 * motion-variants.ts
 *
 * Shared Motion for React variant definitions for consistent entrance/stagger
 * animations across pages/components.
 */

import { useMemo } from "react";
import type { Variants } from "motion/react";
import { useReducedMotion } from "motion/react";

/* ── Easings ─────────────────────────────────────────────────────────────── */

const EASE_OUT = [0.25, 0.1, 0.25, 1] as const;
export const EASE_EXPO_OUT = [0.16, 1, 0.3, 1] as const;

/* ── Stagger container + child (vertical slide-up) ───────────────────────── */

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.08,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
};

/* ── Scale + fade (modals / lightbox) ───────────────────────────────────── */

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

/* ── Backdrop overlay ───────────────────────────────────────────────────── */

export const backdropFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/* ── Reduced-motion helpers ─────────────────────────────────────────────── */

type AnyRecord = Record<string, unknown>;

function isObject(value: unknown): value is AnyRecord {
  return typeof value === "object" && value !== null;
}

/**
 * Collapses time-based parts of a transition, including child staggering.
 * This is intentionally conservative: it keeps easing/other config but removes timing.
 */
function reduceTransition(transition: unknown): unknown {
  if (!isObject(transition)) return transition;

  const out: AnyRecord = { ...transition };

  for (const key of Object.keys(out)) {
    const value = out[key];

    // Common timing knobs
    if (
      key === "duration" ||
      key === "delay" ||
      key === "staggerChildren"
    ) {
      out[key] = 0;
      continue;
    }

    // `delayChildren` may be a number or a function (eg stagger()) — either way, neutralize it.
    if (key === "delayChildren") {
      out[key] = 0;
      continue;
    }

    // Some transitions have nested objects (per-property transitions, etc).
    if (isObject(value)) out[key] = reduceTransition(value);
  }

  return out;
}

/**
 * Reduced-motion variant transform:
 * - Removes movement (x/y) and scale changes when present.
 * - Collapses transition timing (duration/delay/staggers).
 */
export function reduceVariants<V extends Variants>(
  variants: V,
): V {
  const out: Record<string, unknown> = {};

  for (const key of Object.keys(variants)) {
    const state = variants[key];

    if (!isObject(state)) {
      out[key] = state;
      continue;
    }

    const next: AnyRecord = { ...state };

    if ("x" in next) next.x = 0;
    if ("y" in next) next.y = 0;
    if ("scale" in next) next.scale = 1;

    next.transition = reduceTransition(next.transition);

    out[key] = next;
  }

  return out as V;
}

/* ── Hook: reduced-motion–aware stagger variants ────────────────────────── */

export function useStaggerVariants() {
  const prefersReduced = useReducedMotion(); // returns true when the OS/browser setting is enabled. [web:29]

  return useMemo(() => {
    const container = prefersReduced
      ? reduceVariants(staggerContainer)
      : staggerContainer;
    const item = prefersReduced
      ? reduceVariants(staggerItem)
      : staggerItem;

    return {
      container,
      item,
      prefersReduced: !!prefersReduced,
    };
  }, [prefersReduced]);
}