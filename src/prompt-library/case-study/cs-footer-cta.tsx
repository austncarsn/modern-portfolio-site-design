import React, { memo } from "react";
import { motion } from "motion/react";
import { ArrowRight, BookOpen } from "lucide-react";

interface CsFooterCtaProps { onNavigateToLibrary: () => void; }

export const CsFooterCta = memo(function CsFooterCta({ onNavigateToLibrary }: CsFooterCtaProps) {
  return (
    <motion.section className="border-t border-border bg-card/30 py-16 sm:py-24" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 text-center">
        <p className="text-[10px] sm:text-xs font-mono text-muted-foreground/50 uppercase tracking-[0.25em] mb-4">Ready to explore?</p>
        <h2 className="text-foreground mb-3 max-w-lg mx-auto">Try the Prompt Library</h2>
        <p className="text-sm sm:text-base font-light text-muted-foreground max-w-md mx-auto mb-8 sm:mb-10">Browse all 100 prompts, search by keyword, filter by category, and copy with one click.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button onClick={onNavigateToLibrary} className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wider hover:opacity-90 transition-opacity active:scale-[0.98]">
            <BookOpen className="w-4 h-4" strokeWidth={1.5} />Explore Prompts<ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
          <a href="mailto:austncarsn@gmail.com" className="inline-flex items-center gap-2 px-6 py-3.5 border border-border text-foreground text-xs font-mono uppercase tracking-wider hover:bg-secondary transition-colors active:scale-[0.98]">Contact</a>
        </div>
      </div>
    </motion.section>
  );
});
