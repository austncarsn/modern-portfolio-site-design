import React, { useState, memo } from "react";
import { motion } from "motion/react";
import { ChevronDown, Target, Layers, LayoutGrid, Activity, ShieldCheck } from "lucide-react";

const FRAMEWORK_STEPS = [
  { key: "T", label: "Task", icon: Target, description: "Define what you want Claude to build \u2014 the core action." },
  { key: "C", label: "Context", icon: Layers, description: "Provide audience, use-case, and environment constraints." },
  { key: "E", label: "Elements", icon: LayoutGrid, description: "List specific UI components, sections, and data structures." },
  { key: "B", label: "Behavior", icon: Activity, description: "Describe interactions, animations, states, and transitions." },
  { key: "C", label: "Constraints", icon: ShieldCheck, description: "Set boundaries: tech stack, accessibility, performance targets." },
];

export const MethodologySection = memo(function MethodologySection() {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.section className="mx-auto max-w-[1400px] px-4 sm:px-6 mb-8 sm:mb-12"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full group cursor-pointer">
        <div className="border border-border bg-card/50 hover:bg-card transition-colors">
          <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-[11px] text-muted-foreground/50 uppercase tracking-[0.14em]" style={{ fontFamily: "var(--font-body)" }}>Methodology</span>
              <span className="hidden sm:inline text-[10px] text-muted-foreground/30 uppercase tracking-[0.14em]" style={{ fontFamily: "var(--font-body)" }}>TC-EBC Framework</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.14em] hidden sm:inline" style={{ fontFamily: "var(--font-body)" }}>{expanded ? "Collapse" : "Expand"}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground/40 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} strokeWidth={1.5} />
            </div>
          </div>
          {!expanded && (
            <div className="flex flex-wrap items-center gap-2 px-5 sm:px-8 pb-4 sm:pb-5">
              {FRAMEWORK_STEPS.map((step, i) => (
                <span key={`${step.label}-${i}`} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-[10px] sm:text-xs border border-border text-muted-foreground/60" style={{ fontFamily: "var(--font-body)" }}>{step.key}</span>
              ))}
              <span className="text-[10px] text-muted-foreground/30 ml-2" style={{ fontFamily: "var(--font-body)" }}>Task . Context . Elements . Behavior . Constraints</span>
            </div>
          )}
        </div>
      </button>
      {expanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="border border-t-0 border-border bg-card/30">
          <div className="px-5 sm:px-8 py-6 sm:py-8">
            <p className="text-sm font-light text-muted-foreground max-w-2xl mb-6 sm:mb-8 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              Every prompt in this library follows the <span className="text-foreground font-medium">TC-EBC Framework</span> \u2014 a structured prompting methodology validated across 42 research sources for maximizing Claude 4.6's agentic output quality in Figma Make.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-4">
              {FRAMEWORK_STEPS.map((step, i) => { const Icon = step.icon; return (
                <div key={`${step.label}-${i}`} className="flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2 p-3 sm:p-4 border border-border bg-background/50 sm:text-center">
                  <div className="flex items-center gap-2 sm:flex-col sm:gap-1.5">
                    <Icon className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-xs text-foreground uppercase tracking-[0.12em]" style={{ fontFamily: "var(--font-body)" }}>{step.label}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-light leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{step.description}</p>
                </div>
              ); })}
            </div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
});
