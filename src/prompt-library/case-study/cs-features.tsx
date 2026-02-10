import React, { memo } from "react";
import { motion } from "motion/react";
import { Search, Copy, Heart, Layers, Smartphone, ShieldCheck, Zap, FileText, type LucideIcon } from "lucide-react";

interface Feature { icon: LucideIcon; title: string; description: string; }

const FEATURES: readonly Feature[] = [
  { icon: Search, title: "Command-Bar Search", description: "⌘K opens instant search across titles, descriptions, and tags with a live result counter and debounced input." },
  { icon: Layers, title: "Category Filtering", description: "Horizontally-scrollable chips with animated active state, accent dots derived from the shared color system." },
  { icon: Copy, title: "One-Click Copy", description: "Clipboard API with execCommand fallback, animated confirmation toast, and format toggle (Raw / Markdown)." },
  { icon: FileText, title: "Markdown Export", description: "TC-EBC-aware Markdown with Opus metadata block, category-specific guidance notes, and canonical heading maps." },
  { icon: Heart, title: "Persistent Favorites", description: "LocalStorage-backed favorites with SSR-safe lazy initialization and a dedicated filter toggle." },
  { icon: Smartphone, title: "Responsive Design", description: "Mobile-first layout: bottom-sheet modal on phones, side-panel on desktop, touch-friendly 44px hit areas." },
  { icon: ShieldCheck, title: "Error Isolation", description: "Per-section ErrorBoundary wrapping ensures a crash in one section doesn't take down the entire page." },
  { icon: Zap, title: "Performance", description: "React.lazy code splitting, shimmer skeleton fallbacks, GPU-accelerated backdrop-blur, and memo'd components." },
] as const;

export const CsFeatures = memo(function CsFeatures() {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <span className="text-[10px] sm:text-xs font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">05</span>
        <h2 className="text-foreground">Key Features</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px border border-border bg-border">
        {FEATURES.map((feat) => { const Icon = feat.icon; return (
          <div key={feat.title} className="bg-card p-5 sm:p-6">
            <Icon className="w-5 h-5 text-muted-foreground/40 mb-3" strokeWidth={1.5} />
            <h3 className="text-foreground text-sm mb-2">{feat.title}</h3>
            <p className="text-[11px] sm:text-xs text-muted-foreground font-light leading-relaxed">{feat.description}</p>
          </div>
        ); })}
      </div>
    </motion.section>
  );
});
