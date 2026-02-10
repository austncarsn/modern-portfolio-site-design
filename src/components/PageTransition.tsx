/**
 *  PageTransition.tsx
 *
 *  Wraps page content in a motion.div with fade + slide transitions.
 *  Designed to be used as a direct child of <AnimatePresence> in the router.
 *
 *  Respects prefers-reduced-motion: all durations collapse to 0.
 */

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  /** Override the default "fade + slide" with a variant key */
  variant?: "fade-slide" | "fade-scale";
}

const VARIANTS = {
  "fade-slide": {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  },
  "fade-scale": {
    initial: { opacity: 0, scale: 0.97 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  },
} as const;

export function PageTransition({
  children,
  variant = "fade-slide",
}: PageTransitionProps) {
  const prefersReduced = useReducedMotion();
  const v = VARIANTS[variant];

  const duration = prefersReduced ? 0 : 0.3;
  const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1]; // cubic-bezier — smooth decel

  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{ duration, ease }}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}
