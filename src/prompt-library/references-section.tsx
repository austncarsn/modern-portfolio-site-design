import React, { useState, memo } from "react";
import { motion } from "motion/react";
import { ChevronDown, ExternalLink, BookOpen } from "lucide-react";

interface Reference { id: number; label: string; url: string; }

const TIER_1: Reference[] = [
  { id: 1, label: "Anthropic \u2014 Claude Prompting Best Practices", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices" },
  { id: 2, label: "Anthropic \u2014 Introducing Claude Opus 4.6", url: "https://www.anthropic.com/news/claude-opus-4-6" },
  { id: 3, label: "Anthropic \u2014 Adaptive Thinking", url: "https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking" },
  { id: 4, label: "Anthropic \u2014 Claude Opus 4.6 System Card", url: "https://www.anthropic.com/claude-opus-4-6-system-card" },
  { id: 5, label: "Anthropic \u2014 What's New in Claude 4.6", url: "https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-6" },
  { id: 6, label: "Anthropic \u2014 Build with Claude Overview", url: "https://platform.claude.com/docs/en/build-with-claude/overview" },
  { id: 7, label: "Figma \u2014 Write Design System Guidelines", url: "https://developers.figma.com/docs/code/write-design-system-guidelines/" },
  { id: 8, label: "Figma \u2014 Make Category (Help Center)", url: "https://help.figma.com/hc/en-us/categories/31304285531543-Figma-Make" },
  { id: 9, label: "Figma \u2014 Explore Figma Make", url: "https://help.figma.com/hc/en-us/articles/31304412302231-Explore-Figma-Make" },
  { id: 10, label: "Figma \u2014 Attach Designs and Images", url: "https://help.figma.com/hc/en-us/articles/31304529835671-Attach-designs-and-images-to-a-prompt" },
  { id: 11, label: "Figma \u2014 Style Context from Design Libraries", url: "https://help.figma.com/hc/en-us/articles/33024539096471-Bring-style-context-from-a-Figma-Design-library-into-Figma-Make" },
  { id: 12, label: "Figma Blog \u2014 Designer Framework for AI Prompts", url: "https://www.figma.com/blog/designer-framework-for-better-ai-prompts/" },
  { id: 13, label: "Figma Blog \u2014 Introducing Figma Make Embeds", url: "https://www.figma.com/blog/introducing-figma-make-embeds/" },
  { id: 14, label: "Figma \u2014 Prompt to App", url: "https://www.figma.com/solutions/prompt-to-app/" },
  { id: 15, label: "Google Cloud \u2014 Claude Opus 4.6 on Vertex AI", url: "https://cloud.google.com/blog/products/ai-machine-learning/expanding-vertex-ai-with-claude-opus-4-6" },
  { id: 16, label: "Microsoft Azure \u2014 Claude Opus 4.6 on Foundry", url: "https://azure.microsoft.com/en-us/blog/claude-opus-4-6-anthropics-powerful-model-for-coding-agents-and-enterprise-workflows-is-now-available-in-microsoft-foundry-on-azure/" },
  { id: 17, label: "OpenRouter \u2014 Claude Opus 4.6 API", url: "https://openrouter.ai/anthropic/claude-opus-4.6/api" },
];

const TIER_2: Reference[] = [
  { id: 18, label: "DataCamp \u2014 Claude Opus 4.6 Analysis", url: "https://www.datacamp.com/blog/claude-opus-4-6" },
  { id: 19, label: "ITPro \u2014 Enterprise-Focused Model Launch", url: "https://www.itpro.com/technology/artificial-intelligence/anthropic-reveals-claude-opus-4-6-enterprise-focused-model-1-million-token-context-window" },
  { id: 20, label: "CosmicJS \u2014 Opus 4.6 vs 4.5 Comparison", url: "https://www.cosmicjs.com/blog/claude-opus-46-vs-opus-45-a-real-world-comparison" },
  { id: 21, label: "Laravel News \u2014 Claude Opus 4.6", url: "https://laravel-news.com/claude-opus-4-6" },
  { id: 22, label: "Latent Space \u2014 AI News Roundup", url: "https://www.latent.space/p/ainews-openai-and-anthropic-go-to" },
  { id: 23, label: "TechBuzz \u2014 Multi-Agent Teams Feature", url: "https://www.techbuzz.ai/articles/anthropic-launches-opus-4-6-with-multi-agent-teams-feature" },
  { id: 24, label: "UX Collective \u2014 Figma Make Prompts with Examples", url: "https://uxdesign.cc/figma-make-prompts-with-real-examples-2ece15d0fce6" },
  { id: 25, label: "Nick Babich \u2014 Figma Design AI (LinkedIn)", url: "https://www.linkedin.com/posts/nbabich_figma-design-ai-activity-7382181112183406592-VMPf" },
  { id: 26, label: "Figma Community \u2014 PromptKit", url: "https://www.figma.com/community/file/1215140133434424597/promptkit" },
  { id: 27, label: "ADPList \u2014 Ultimate Figma Make Prompt Guide", url: "https://adplist.substack.com/p/ultimate-figma-make-prompt-guide" },
  { id: 28, label: "Reddit r/ClaudeCode \u2014 Opus 4.6 Features", url: "https://www.reddit.com/r/ClaudeCode/comments/1qxe2tt/three_features_in_opus_4_6_that_change_how_claude/" },
  { id: 29, label: "Reddit r/FigmaDesign \u2014 AI Design Systems", url: "https://www.reddit.com/r/FigmaDesign/comments/1qo2v3r/use_claude_to_generate_a_design_system_in_figma/" },
  { id: 30, label: "Figma Forum \u2014 Make & Design Systems", url: "https://forum.figma.com/ask-the-community-7/can-figma-make-use-our-design-system-41125" },
  { id: 31, label: "Figma Community \u2014 Make Templates", url: "https://www.figma.com/community/make" },
  { id: 32, label: "Anthropic GitHub \u2014 Prompt Engineering Tutorial", url: "https://github.com/anthropics/prompt-eng-interactive-tutorial" },
  { id: 33, label: "Figma Blog \u2014 8 Ways to Build with Make", url: "https://www.figma.com/blog/8-ways-to-build-with-figma-make/" },
  { id: 34, label: "Figma Make \u2014 Homepage", url: "https://www.figma.com/make/" },
  { id: 35, label: "UX Collective \u2014 Better Prompts for Product Design", url: "https://uxdesign.cc/how-to-prompt-figma-makes-ai-better-for-product-design-627daf3f4036" },
  { id: 36, label: "Reddit r/UXDesign \u2014 Generating Interfaces with Design Systems", url: "https://www.reddit.com/r/UXDesign/comments/1nvwljs/generating_figma_make_interfaces_with_a_design/" },
];

const RefLink = memo(({ reference }: { reference: Reference }) => (
  <a href={reference.url} target="_blank" rel="noopener noreferrer" className="group/ref flex items-start gap-2 py-1.5 sm:py-2 hover:text-foreground transition-colors">
    <span className="text-[10px] text-muted-foreground/40 tabular-nums flex-shrink-0 mt-px w-5 text-right" style={{ fontFamily: "var(--font-body)" }}>{reference.id}</span>
    <span className="text-[11px] sm:text-xs text-muted-foreground group-hover/ref:text-foreground transition-colors leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>{reference.label}</span>
    <ExternalLink className="w-3 h-3 text-muted-foreground/20 group-hover/ref:text-muted-foreground flex-shrink-0 mt-0.5 opacity-0 group-hover/ref:opacity-100 transition-opacity" strokeWidth={1.5} />
  </a>
));
RefLink.displayName = "RefLink";

export const ReferencesSection = memo(function ReferencesSection() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="mx-auto max-w-[1400px] px-4 sm:px-6 pb-8 sm:pb-16">
      <button onClick={() => setExpanded(!expanded)} className="w-full group cursor-pointer">
        <div className="border border-border bg-card/50 hover:bg-card transition-colors">
          <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5">
            <div className="flex items-center gap-3 sm:gap-4">
              <BookOpen className="w-4 h-4 text-muted-foreground/40" strokeWidth={1.5} />
              <span className="text-[11px] text-muted-foreground/50 uppercase tracking-[0.14em]" style={{ fontFamily: "var(--font-body)" }}>Research & References</span>
              <span className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.14em]" style={{ fontFamily: "var(--font-body)" }}>{TIER_1.length + TIER_2.length} Verified Sources</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground/40 uppercase tracking-[0.14em] hidden sm:inline" style={{ fontFamily: "var(--font-body)" }}>{expanded ? "Collapse" : "Expand"}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground/40 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </button>
      {expanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="border border-t-0 border-border bg-card/30">
          <div className="px-5 sm:px-8 py-6 sm:py-8">
            <p className="text-sm font-light text-muted-foreground max-w-2xl mb-6 sm:mb-8 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
              This library is built on a verified research base of <span className="text-foreground font-medium">{TIER_1.length + TIER_2.length} sources</span> spanning Anthropic's canonical documentation, Figma's official guides, cloud platform references, and practitioner analysis.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
              <div>
                <h4 className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-border" style={{ fontFamily: "var(--font-body)" }}>Tier 1 \u2014 Canonical Documentation</h4>
                <div className="flex flex-col">{TIER_1.map((r) => <RefLink key={r.id} reference={r} />)}</div>
              </div>
              <div>
                <h4 className="text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em] mb-4 pb-2 border-b border-border" style={{ fontFamily: "var(--font-body)" }}>Tier 2 \u2014 Practitioner Analysis & Community</h4>
                <div className="flex flex-col">{TIER_2.map((r) => <RefLink key={r.id} reference={r} />)}</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
});
