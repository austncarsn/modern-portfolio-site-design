/**
 * PageLayout.tsx — Inner page shell
 *
 * Simple layout wrapper for content pages.
 * Navigation is now handled by the global Navigation component.
 */

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Footer } from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "var(--surface-0)",
    }}>
      {/* Main content */}
      <main
        role="main"
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 1120,
          margin: "0 auto",
          padding: "var(--sp-6) var(--sp-4) 80px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReduced ? 0 : 0.25,
            delay: prefersReduced ? 0 : 0.05,
          }}
        >
          {children}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
