import React, { memo } from "react";
import { motion } from "motion/react";
import { Blocks, Component, MousePointerClick, Database, PenTool, BrainCircuit, Cable, Wand2, type LucideIcon } from "lucide-react";
import { categoryColors, getCategoryLabel, type CategoryKey } from "../category-colors";

const FRAMEWORK_LETTERS = [
  { key: "T", label: "Task", desc: "The core action Claude should perform." },
  { key: "C", label: "Context", desc: "Audience, use-case, and environment." },
  { key: "E", label: "Elements", desc: "Specific UI components and data." },
  { key: "B", label: "Behavior", desc: "Interactions, states, animations." },
  { key: "C\u2082", label: "Constraints", desc: "Tech stack, a11y, performance." },
] as const;

const CATEGORY_ICONS: Record<CategoryKey, LucideIcon> = {
  foundation: Blocks, components: Component, interactions: MousePointerClick,
  data: Database, design: PenTool, "ai-patterns": BrainCircuit, integration: Cable, advanced: Wand2,
};

const categoryKeys = Object.keys(categoryColors) as CategoryKey[];

export const CsPromptSystem = memo(function CsPromptSystem() {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <span className="text-[10px] sm:text-xs font-mono text-muted-foreground/50 uppercase tracking-[0.2em]">06</span>
        <h2 className="text-foreground">Prompt System</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        <div className="border border-border bg-card/50 p-5 sm:p-8">
          <h3 className="text-foreground text-sm mb-1">TC-EBC Framework</h3>
          <p className="text-xs text-muted-foreground font-light mb-6 leading-relaxed">Every prompt follows this five-part structure validated across 42 research sources.</p>
          <div className="space-y-3">
            {FRAMEWORK_LETTERS.map((step) => (
              <div key={step.label} className="flex items-start gap-3">
                <span className="w-7 h-7 flex items-center justify-center text-[11px] font-mono border border-border text-muted-foreground flex-shrink-0">{step.key}</span>
                <div><span className="text-xs text-foreground block">{step.label}</span><span className="text-[11px] text-muted-foreground/60 font-light">{step.desc}</span></div>
              </div>
            ))}
          </div>
        </div>
        <div className="border border-border bg-card/50 p-5 sm:p-8">
          <h3 className="text-foreground text-sm mb-1">8 Categories</h3>
          <p className="text-xs text-muted-foreground font-light mb-6 leading-relaxed">Prompts are organized by workflow stage, each with its own accent color, effort level, and thinking mode.</p>
          <div className="space-y-2">
            {categoryKeys.map((key) => { const color = categoryColors[key]; const Icon = CATEGORY_ICONS[key]; return (
              <div key={key} className="flex items-center gap-3 py-2 px-3 border border-border bg-background/50">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color.accent }} />
                <Icon className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-xs text-foreground flex-1 capitalize">{getCategoryLabel(key)}</span>
                <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-wider">{color.effort} · {color.thinking}</span>
              </div>
            ); })}
          </div>
        </div>
      </div>
    </motion.section>
  );
});
