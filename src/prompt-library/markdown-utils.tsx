import React, { memo } from "react";
import type { Prompt } from "./prompt-data";
import { getCategoryColor, getCategoryLabel, type CategoryColor } from "./category-colors";

const categoryGuidance: Record<string, string> = {
  foundation: "Use `Effort: High`. Best for starting from zero.",
  components: "Use `Effort: Medium`. Best for iterating on existing frames.",
  interactions: "Use `Effort: High`. Opus 4.6 shines here by writing complex logic.",
  data: "Use `Effort: Max`. Leverage Opus 4.6's coding strength.",
  design: 'Use `Effort: Medium`. Requires "Attach Library" or "Attach Image".',
  "ai-patterns": "Use `Effort: High`. Leverage adaptive thinking for LLM-native patterns.",
  integration: "Use `Effort: Medium`. Focus on API contracts and service boundaries.",
  advanced: "Use `Thinking: Adaptive`. These utilize the model's agentic capabilities.",
};

const TC_EBC_HEADING_MAP: Record<string, string> = {
  task: "Task",
  context: "Context",
  elements: "Elements",
  behavior: "Behavior",
  constraints: "Constraints",
  constraint: "Constraints",
  role: "Role",
  structure: "Structure",
  architecture: "Architecture",
  responsive_behavior: "Responsive Behavior",
  agent_instructions: "Agent Instructions",
  conversion_process: "Conversion Process",
  state_persistence: "State Persistence",
  navigation: "Navigation",
  layout: "Layout",
  data_model: "Data Model",
  streaming: "Streaming",
  input: "Input",
  conversations: "Conversations",
  messages: "Messages",
  sections: "Sections",
  variable_handling: "Variable Handling",
  builder_ui: "Builder UI",
  opus_strategy: "Opus Strategy",
};

function tagToHeading(tag: string): string {
  const lower = tag.toLowerCase();
  if (TC_EBC_HEADING_MAP[lower]) return TC_EBC_HEADING_MAP[lower];
  return tag.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function promptToMarkdown(prompt: Prompt, colors?: CategoryColor): string {
  const resolvedColors = colors ?? getCategoryColor(prompt.category);
  const lines: string[] = [];
  lines.push(`# ${prompt.title}`, "");
  lines.push(`> ${prompt.description}`, "");
  lines.push(`**Category:** ${getCategoryLabel(prompt.category)}  `);
  lines.push(`**Tags:** ${prompt.tags.join(", ")}  `);
  lines.push(`**Effort:** ${resolvedColors.effort}  `);
  lines.push(`**Thinking:** ${resolvedColors.thinking === "adaptive" ? "Adaptive" : "Standard"}  `);
  if (resolvedColors.attachments && resolvedColors.attachments.length > 0) {
    lines.push(`**Attachments:** ${resolvedColors.attachments.join(", ")}  `);
  }
  lines.push("");
  const guidance = categoryGuidance[prompt.category];
  if (guidance) lines.push(`> **TC-EBC Framework Note:** ${guidance}`, "");
  lines.push("---", "");
  const body = prompt.prompt
    .replace(/<([\w][\w_-]*?)>([\s\S]*?)<\/\1>/g, (_match, tag: string, content: string) => {
      const heading = tagToHeading(tag);
      return `## ${heading}\n\n${content.trim()}\n`;
    })
    .replace(/^<([\w][\w_-]*?)>\s*$/gm, (_match, tag: string) => `## ${tagToHeading(tag)}\n`)
    .replace(/<\/([\w][\w_-]*?)>/g, "")
    .trim();
  lines.push(body);
  lines.push("", "---", "");
  lines.push(`*Prompt #${String(prompt.id).padStart(3, "0")} — ${getCategoryLabel(prompt.category)} — Claude Opus 4.6 × Figma Make Prompt Library*`);
  return lines.join("\n");
}

type Block =
  | { type: "h1"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "hr" }
  | { type: "code"; language: string; text: string }
  | { type: "paragraph"; text: string };

function parseBlocks(source: string): Block[] {
  const lines = source.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code blocks
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: "code", language: lang, text: codeLines.join("\n") });
      i++;
      continue;
    }

    // Horizontal rules
    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("### ")) { blocks.push({ type: "h3", text: line.slice(4).trim() }); i++; continue; }
    if (line.startsWith("## ")) { blocks.push({ type: "h2", text: line.slice(3).trim() }); i++; continue; }
    if (line.startsWith("# ")) { blocks.push({ type: "h1", text: line.slice(2).trim() }); i++; continue; }

    // Blockquotes
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: "blockquote", text: quoteLines.join(" ") });
      continue;
    }

    // Unordered lists
    if (/^[-*] /.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*] /, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered lists
    if (/^\d+[.)]\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Blank lines
    if (line.trim() === "") { i++; continue; }

    // Paragraphs (everything else)
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("> ") &&
      !/^[-*] /.test(lines[i].trim()) &&
      !/^\d+[.)]\s/.test(lines[i].trim()) &&
      !lines[i].startsWith("```") &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "paragraph", text: paraLines.join("\n") });
    }
  }

  return blocks;
}

function InlineContent({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={i} className="text-foreground font-medium">{part.slice(2, -2)}</strong>;
        if (part.startsWith("*") && part.endsWith("*"))
          return <em key={i} className="text-foreground/70 italic">{part.slice(1, -1)}</em>;
        if (part.startsWith("~~") && part.endsWith("~~"))
          return <del key={i} className="text-muted-foreground/50 line-through">{part.slice(2, -2)}</del>;
        if (part.startsWith("`") && part.endsWith("`"))
          return <code key={i} className="font-mono text-[0.9em] bg-secondary/60 border border-border/30 px-1 py-0.5">{part.slice(1, -1)}</code>;
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch)
          return <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-2 hover:text-foreground/70 transition-colors">{linkMatch[1]}</a>;
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}

function MarkdownBlock({ block, accentColor }: { block: Block; accentColor?: string }) {
  switch (block.type) {
    case "h1":
      return <h1 className="text-xl sm:text-2xl text-foreground tracking-tight pb-2 mb-2 border-b border-border/50"><InlineContent text={block.text} /></h1>;
    case "h2":
      return <h2 className="text-sm sm:text-base text-foreground tracking-wide uppercase mt-6 mb-1" style={accentColor ? { color: accentColor } : undefined}><InlineContent text={block.text} /></h2>;
    case "h3":
      return <h3 className="text-sm text-foreground/80 tracking-wide uppercase mt-4 mb-1"><InlineContent text={block.text} /></h3>;
    case "blockquote":
      return <blockquote className="border-l-2 border-muted-foreground/20 pl-4 text-sm text-muted-foreground italic leading-relaxed"><InlineContent text={block.text} /></blockquote>;
    case "ul":
      return (
        <ul className="space-y-1.5 pl-1">
          {block.items.map((item, idx) => (
            <li key={idx} className="text-sm text-foreground/80 leading-relaxed flex gap-2.5">
              <span className="text-muted-foreground/40 mt-[2px] select-none flex-shrink-0">&bull;</span>
              <span className="flex-1"><InlineContent text={item} /></span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="space-y-1.5 pl-1">
          {block.items.map((item, idx) => (
            <li key={idx} className="text-sm text-foreground/80 leading-relaxed flex gap-2.5">
              <span className="text-muted-foreground/50 font-mono text-xs mt-[2px] select-none flex-shrink-0 w-5 text-right">{idx + 1}.</span>
              <span className="flex-1"><InlineContent text={item} /></span>
            </li>
          ))}
        </ol>
      );
    case "hr":
      return <hr className="border-t border-border/50 my-4" />;
    case "code":
      return (
        <pre className="bg-secondary/50 border border-border/40 px-4 py-3 overflow-x-auto">
          <code className="font-mono text-xs text-foreground/70 leading-relaxed">{block.text}</code>
        </pre>
      );
    case "paragraph":
      return <p className="text-sm text-foreground/80 leading-relaxed"><InlineContent text={block.text} /></p>;
  }
}

export const MarkdownRenderer = memo(function MarkdownRenderer({ source, accentColor }: { source: string; accentColor?: string }) {
  const blocks = parseBlocks(source);
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <MarkdownBlock key={i} block={block} accentColor={accentColor} />
      ))}
    </div>
  );
});
