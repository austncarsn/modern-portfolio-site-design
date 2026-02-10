// ╔══════════════════════════════════════════════════════════════════════════════╗
// ║  MYPROMPTS — Smart Prompt Formatter v6.5                                     ║
// ║  Full plain-text → Markdown conversion pipeline                             ║
// ║  Grammar · Headers · Inline fmt · Lists · Sequential · Run-on splitting    ║
// ║  v6.4: Guard tightening + false-positive reduction (Batch A+B)             ║
// ║  v6.5: Pipeline architecture + idempotency stabilization (Batch C)         ║
// ╚══════════════════════════════════════════════════════════════════════════════╝

export interface CustomRule {
  id: string;
  name: string;
  pattern: string;
  replacement: string;
  active: boolean;
}

// ─── Types ──────────────────────────────────────────────────────────────────────

type Segment = { type: 'prose' | 'code'; content: string };

type SectionKind =
  | 'role' | 'context' | 'task' | 'instructions' | 'steps'
  | 'output' | 'constraints' | 'examples' | 'tone' | 'audience'
  | 'input' | 'definitions' | 'fallback';

const SECTION_LABELS: Record<SectionKind, string> = {
  role: 'System Role', context: 'Context', task: 'Task',
  instructions: 'Instructions', steps: 'Steps', output: 'Output Format',
  constraints: 'Constraints', examples: 'Examples', tone: 'Tone & Style',
  audience: 'Audience', input: 'Input', definitions: 'Definitions',
  fallback: 'Details',
};

// ─── Utilities ──────────────────────────────────────────────────────────────────

function toTitleCase(str: string): string {
  const minor = new Set([
    'a','an','the','and','but','or','for','nor','at','by','in','of','on',
    'to','up','as','is','it','so','yet','via','vs','per','with','into','onto','from',
  ]);
  return str.split(/\s+/).filter(Boolean).map((w, i) => {
    const lower = w.toLowerCase();
    if (i === 0 || !minor.has(lower)) {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }
    return lower;
  }).join(' ');
}

// ─── Code-Fence-Aware Segment Splitter ──────────────────────────────────────────

function segmentDocument(text: string): Segment[] {
  const segments: Segment[] = [];
  const lines = text.split('\n');
  let current: string[] = [];
  let inCode = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      if (!inCode) {
        if (current.length) { segments.push({ type: 'prose', content: current.join('\n') }); current = []; }
        current.push(line); inCode = true;
      } else {
        current.push(line); segments.push({ type: 'code', content: current.join('\n') }); current = []; inCode = false;
      }
    } else { current.push(line); }
  }
  if (current.length) segments.push({ type: inCode ? 'code' : 'prose', content: current.join('\n') });
  return segments;
}

function reassemble(segments: Segment[]): string { return segments.map(s => s.content).join('\n'); }

function mapProse(segments: Segment[], fn: (text: string) => string): Segment[] {
  return segments.map(s => s.type === 'prose' ? { ...s, content: fn(s.content) } : s);
}

// ─── Pipeline Helpers ───────────────────────────────────────────────────────────

type TransformFn = (text: string) => { result: string; applied: boolean };

/** DRY helper: apply a transform function to prose segments, track applied label. */
function applyStage(
  segments: Segment[], fn: TransformFn, label: string, transforms: string[]
): Segment[] {
  return mapProse(segments, prose => {
    const r = fn(prose);
    if (r.applied) transforms.push(label);
    return r.result;
  });
}

// ─── Language Detection ─────────────────────────────────────────────────────────

function detectLanguage(text: string): string {
  const indicators: Record<string, RegExp[]> = {
    python: [/\bdef\s+\w+\(/, /\bimport\s+\w+/, /\bclass\s+\w+:/, /\bprint\(/, /\bself\./],
    javascript: [/\bconst\s+\w+\s*=/, /\blet\s+\w+/, /\bfunction\s+\w+/, /=>\s*\{/, /\bconsole\.log/],
    typescript: [/\binterface\s+\w+/, /:\s*(string|number|boolean|any)\b/, /\btype\s+\w+\s*=/],
    bash: [/^#!/m, /\becho\s+/, /\bif\s+\[/, /\bfi\b/, /\$\{?\w+\}?/],
    json: [/^\s*[{\[]/m, /"\w+":\s/, /^\s*[}\]]/m],
    html: [/<\w+[^>]*>/, /<\/\w+>/, /<!DOCTYPE/i],
    css: [/\{[^}]*:[^}]*;[^}]*\}/, /@media\s/, /\.[\w-]+\s*\{/],
    sql: [/\bSELECT\b.*\bFROM\b/i, /\bINSERT\s+INTO\b/i, /\bCREATE\s+TABLE\b/i],
    rust: [/\bfn\s+\w+/, /\blet\s+mut\b/, /\bimpl\s+/],
    go: [/\bfunc\s+/, /\bpackage\s+\w+/, /\bfmt\./],
    yaml: [/^\w[\w\s]*:\s/m, /^\s*-\s+\w/m],
  };
  let best = '', bestScore = 0;
  for (const [lang, pats] of Object.entries(indicators)) {
    const score = pats.filter(p => p.test(text)).length;
    if (score > bestScore) { bestScore = score; best = lang; }
  }
  return bestScore >= 2 ? best : '';
}

// ─── Section Inference ──────────────────────────────────────────────────────────

function inferSection(block: string): SectionKind | null {
  const l = block.toLowerCase();
  const lines = block.split('\n').filter(x => x.trim());
  const bulletCount = lines.filter(x => /^\s*[-*+\u2022]\s/.test(x)).length;
  const numberedCount = lines.filter(x => /^\s*\d+[.)]\s/.test(x)).length;
  const s: Record<SectionKind, number> = {
    role: 0, context: 0, task: 0, instructions: 0, steps: 0,
    output: 0, constraints: 0, examples: 0, tone: 0, audience: 0,
    input: 0, definitions: 0, fallback: 0,
  };

  if (/\byou are\b/.test(l)) s.role += 5;
  if (/\bact as\b/.test(l)) s.role += 5;
  if (/\bbehave as\b/.test(l)) s.role += 4;
  if (/\bpretend (to be|you'?re)\b/.test(l)) s.role += 4;
  if (/\byour role\b/.test(l)) s.role += 4;
  if (/\bpersona\b/.test(l)) s.role += 3;
  if (/\bsystem prompt\b/.test(l)) s.role += 5;
  if (/\bexpert (in|at|on)\b/.test(l)) s.role += 3;
  if (/\bassistant\b/.test(l) && /\bhelpful\b/.test(l)) s.role += 3;

  if (/\bgiven (that|the following)\b/.test(l)) s.context += 4;
  if (/\bbackground\b/.test(l)) s.context += 3;
  if (/\bcontext\b/.test(l)) s.context += 3;
  if (/\bthe following (information|data|text|content|details)\b/.test(l)) s.context += 4;
  if (/\bbased on\b/.test(l)) s.context += 2;
  if (/\bhere is\b/.test(l)) s.context += 2;
  if (/\bscenario\b/.test(l)) s.context += 2;

  if (/\byour (task|job|assignment)\b/.test(l)) s.task += 5;
  if (/\bi (want|need) you to\b/.test(l)) s.task += 5;
  if (/\bplease (create|write|generate|help|analyze|summarize|review|build|design|explain|translate|draft|compose|produce|develop|prepare|make|provide)\b/.test(l)) s.task += 4;
  if (/\bgoal\b/.test(l)) s.task += 2;
  if (/\bobjective\b/.test(l)) s.task += 2;
  if (/\bhelp me\b/.test(l)) s.task += 3;
  if (/\bi want\b/.test(l)) s.task += 2;

  if (bulletCount >= 2 && bulletCount / lines.length > 0.4) s.instructions += 4;
  if (/\bmake sure\b/.test(l)) s.instructions += 2;
  if (/\bfollow (these|the)\b/.test(l)) s.instructions += 3;
  if (/\bkeep in mind\b/.test(l)) s.instructions += 2;
  if (/\bremember to\b/.test(l)) s.instructions += 2;
  if (/\bshould\b/.test(l) && bulletCount >= 1) s.instructions += 2;

  if (/\bstep \d/i.test(l)) s.steps += 5;
  if (/\bfirst,?\s/.test(l) && /\bthen,?\s/.test(l)) s.steps += 4;
  if (numberedCount >= 2) s.steps += 4;
  if (numberedCount >= 3) s.steps += 2;
  if (/\bprocedure\b/.test(l)) s.steps += 3;
  if (/\bworkflow\b/.test(l)) s.steps += 3;

  if (/\boutput format\b/.test(l)) s.output += 6;
  if (/\bresponse format\b/.test(l)) s.output += 6;
  if (/\bformat (your|the) (response|output|answer|reply)\b/.test(l)) s.output += 5;
  if (/\brespond (in|with|using)\b/.test(l)) s.output += 3;
  if (/\b(as|in) (a )?(json|markdown|csv|table|list|bullet|numbered|xml|html|yaml)\b/.test(l)) s.output += 4;

  if (/\bdo not\b/.test(l)) s.constraints += 3;
  if (/\bavoid\b/.test(l)) s.constraints += 3;
  if (/\bnever\b/.test(l)) s.constraints += 3;
  if (/\bmust not\b/.test(l)) s.constraints += 4;
  if (/\brefrain from\b/.test(l)) s.constraints += 3;
  if (/\bkeep .{2,30}(short|brief|concise|simple|minimal)\b/i.test(l)) s.constraints += 3;

  if (/\bexamples?\b/.test(l)) s.examples += 3;
  if (/\bfor instance\b/.test(l)) s.examples += 3;
  if (/\binput:\s/i.test(l) && /\boutput:\s/i.test(l)) s.examples += 5;
  if (/\bfew[- ]shot\b/.test(l)) s.examples += 4;

  if (/\btone\b/.test(l)) s.tone += 5;
  if (/\bwriting style\b/.test(l)) s.tone += 5;
  if (/\b(professional|casual|formal|friendly|concise|verbose|academic|conversational)\b/.test(l)) s.tone += 2;

  if (/\baudience\b/.test(l)) s.audience += 5;
  if (/\btarget (reader|user|group)\b/.test(l)) s.audience += 4;
  if (/\bintended for\b/.test(l)) s.audience += 3;

  if (/\binput data\b/.test(l)) s.input += 5;
  if (/\bthe (data|text|content|document|code|file) (is|below|above|follows)\b/.test(l)) s.input += 4;

  if (/\bdefin(e|ition|itions)\b/.test(l)) s.definitions += 4;
  if (/\bglossary\b/.test(l)) s.definitions += 5;

  // Require score > 3 (i.e., >= 4) to infer a section — a single incidental keyword
  // (e.g., "workflow" in a bio) should not trigger section inference
  let best: SectionKind | null = null, bestScore = 3;
  for (const [kind, score] of Object.entries(s) as [SectionKind, number][]) {
    if (kind === 'fallback') continue;
    if (score > bestScore) { bestScore = score; best = kind; }
  }
  return best;
}

// ─── Title Generation ───────────────────────────────────────────────────────────

function generateTitle(fullText: string): string | null {
  const l = fullText.toLowerCase();
  const roleM = l.match(/you are (?:a |an )?(.{4,50}?)(?:\.|,|\n|$)/);
  if (roleM) {
    const c = roleM[1].replace(/\s+who\b.*$/, '').replace(/\s+that\b.*$/, '').replace(/\s+with\b.*$/, '').trim();
    if (c.length >= 4) return toTitleCase(c);
  }
  const taskM = l.match(/(?:create|write|generate|build|design|develop|analyze|review|summarize|explain|translate|draft|compose|produce) (?:a |an |the )?(.{4,45}?)(?:\.|,|\n|$)/);
  if (taskM) { const c = taskM[1].replace(/\s+(?:that|which|for me)\b.*$/, '').trim(); if (c.length >= 4) return toTitleCase(c) + ' Prompt'; }
  const needM = l.match(/i (?:need|want) (?:you to |a |an |the )?(.{4,45}?)(?:\.|,|\n|$)/);
  if (needM) { const c = needM[1].replace(/\s+(?:that|which|for me)\b.*$/, '').trim(); if (c.length >= 4) return toTitleCase(c); }
  return null;
}

// ─── Block Helpers ──────────────────────────────────────────────────────────────

function splitBlocks(prose: string): string[] {
  const blocks: string[] = [], buf: string[] = [];
  for (const line of prose.split('\n')) {
    if (line.trim() === '') { if (buf.length) { blocks.push(buf.join('\n')); buf.length = 0; } }
    else buf.push(line);
  }
  if (buf.length) blocks.push(buf.join('\n'));
  return blocks;
}

function hasHeader(block: string): boolean { return /^#{1,6}\s/.test(block.trim()); }

// ═══════════════════════════════════════════════════════════════════════════════
//  STAGE 0 — Whitespace Normalization
// ═══════════════════════════════════════════════════════════════════════════════

function normalize(text: string): string {
  let t = text;
  t = t.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  t = t.replace(/[ \t]+$/gm, '');
  t = t.replace(/\n{3,}/g, '\n\n');
  t = t.replace(/\t/g, '  ');
  return t.trim();
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STAGE 1 — Early-Exit Format Detection (JSON / YAML / Code / Table)
// ═══════════════════════════════════════════════════════════════════════════════

function tryFormatJSON(text: string): { result: string; label: string } | null {
  const t = text.trim();
  if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
    try { const p = JSON.parse(t); if (typeof p === 'object' && p !== null) return { result: '```json\n' + JSON.stringify(p, null, 2) + '\n```', label: 'JSON Prettify' }; } catch {}
  }
  return null;
}

function tryPreserveYAML(text: string): { result: string; label: string } | null {
  const t = text.trim();
  if (!t.startsWith('---')) return null;
  const e = t.indexOf('---', 4);
  if (e < 0) return null;
  const yb = t.substring(0, e + 3), body = t.substring(e + 3).trim();
  if (yb.split('\n').slice(1, -1).some(l => /^\s*\w[\w\s]*:\s*.+/.test(l.trim()))) return { result: yb + '\n\n' + body, label: 'YAML Front Matter' };
  return null;
}

function tryDetectCode(text: string): { result: string; label: string } | null {
  if (text.trim().startsWith('```')) return null;
  const kw = ['import ', 'export ', 'function ', 'const ', 'let ', 'var ', 'class ', 'interface ', 'return ', 'console.', '=>', 'def ', 'fn ', 'func ', 'package '];
  const lines = text.split('\n'), ne = lines.filter(l => l.trim());
  if (ne.length < 3 || !kw.some(k => text.includes(k))) return null;
  const cl = ne.filter(l => { const t = l.trim(); return kw.some(k => t.includes(k)) || /^[{}\[\]();]/.test(t) || /[{}\[\]();,]$/.test(t) || /^\/[\/\*]/.test(t) || /^\*/.test(t); });
  if (cl.length / ne.length > 0.5) { const lang = detectLanguage(text); return { result: '```' + (lang || '') + '\n' + text.trim() + '\n```', label: 'Auto-Code Block' }; }
  return null;
}

function tryDetectTable(text: string): { result: string; label: string } | null {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return null;
  const tabLines = lines.filter(l => l.includes('\t'));
  if (tabLines.length >= 2 && tabLines.length / lines.length > 0.7) {
    const rows = lines.map(l => l.split('\t').map(c => c.trim())), cols = rows[0]?.length || 0;
    if (cols >= 2 && rows.every(r => Math.abs(r.length - cols) <= 1)) return { result: buildMdTable(rows), label: 'Table Auto-Format' };
  }
  const pipeLines = lines.filter(l => l.includes('|') && !l.startsWith('#'));
  if (pipeLines.length >= 2 && pipeLines.length / lines.length > 0.7) {
    if (!lines.some(l => /^\|?\s*[-:]+([\s|]*[-:]+)+\s*\|?\s*$/.test(l))) {
      const rows = lines.map(l => l.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim())), cols = rows[0]?.length || 0;
      if (cols >= 2) return { result: buildMdTable(rows), label: 'Table Auto-Format' };
    }
  }
  return null;
}

function buildMdTable(rows: string[][]): string {
  return '| ' + rows[0].join(' | ') + ' |\n| ' + rows[0].map(() => '---').join(' | ') + ' |\n' + rows.slice(1).map(r => '| ' + r.join(' | ') + ' |').join('\n');
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STAGE 2 — Structural Detection (Chat / XML / CAPS / Keywords / Colons)
// ═══════════════════════════════════════════════════════════════════════════════

function formatChatStyle(text: string): { result: string; applied: boolean } {
  const m = text.match(/^(System|User|Assistant|Human|AI)\s*:\s*/gmi);
  if (!m || m.length < 2) return { result: text, applied: false };
  return { result: text.replace(/^(System|User|Assistant|Human|AI)\s*:\s*/gmi, (_m, role: string) => `\n## ${role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}\n\n`).trim(), applied: true };
}

function formatXMLTags(text: string): { result: string; applied: boolean } {
  const tags = /^<(instructions|context|examples?|constraints|rules|output|task|role|system|input|steps|format|response|thinking|answer|question)>\s*$/gmi;
  const close = /^<\/(instructions|context|examples?|constraints|rules|output|task|role|system|input|steps|format|response|thinking|answer|question)>\s*$/gmi;
  if (!tags.test(text)) return { result: text, applied: false };
  tags.lastIndex = 0;
  let r = text.replace(tags, (_m, tag: string) => `\n## ${toTitleCase(tag)}\n`);
  r = r.replace(close, '\n---\n');
  return { result: r.trim(), applied: true };
}

function normalizeAllCapsHeaders(text: string): { result: string; applied: boolean } {
  const names = [
    'ROLE','SYSTEM ROLE','CONTEXT','BACKGROUND','TASK','OBJECTIVE','GOAL','INSTRUCTIONS','STEPS','PROCESS',
    'WORKFLOW','CONSTRAINTS','RULES','LIMITATIONS','REQUIREMENTS','OUTPUT','OUTPUT FORMAT','FORMAT',
    'RESPONSE FORMAT','EXAMPLES','SAMPLES','TONE','STYLE','VOICE','AUDIENCE','INPUT','DEFINITIONS',
    'GLOSSARY','NOTES','IMPORTANT','GUIDELINES','CRITERIA','DELIVERABLES','EXPECTED OUTPUT',
    'ADDITIONAL CONTEXT','ADDITIONAL INSTRUCTIONS','OVERVIEW','DESCRIPTION','SUMMARY','INTRODUCTION',
    'PURPOSE','SCOPE','PARAMETERS','CONFIGURATION','SETTINGS','OPTIONS','CONCLUSION','REFERENCES',
    'APPENDIX','PREREQUISITES','ASSUMPTIONS','METHODS','RESULTS','DISCUSSION','ABSTRACT',
  ];
  const esc = names.map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pat = new RegExp(`^\\s*(#{1,3}\\s*)?(${esc.join('|')})\\s*:?\\s*$`, 'gm');
  let applied = false;
  const result = text.replace(pat, (match, _h, name: string) => {
    // Idempotency: skip if already formatted as "## Title Case"
    const expected = `## ${toTitleCase(name.trim())}`;
    if (match.trim() === expected) return match;
    applied = true;
    return `\n## ${toTitleCase(name.trim())}\n`;
  });
  return { result, applied };
}

function normalizeKeywordHeaders(text: string): { result: string; applied: boolean } {
  const map: Record<string, string[]> = {
    'System Role': ['role', 'system role', 'persona'],
    'Context': ['context', 'background', 'situation', 'overview', 'scenario', 'premise'],
    'Task': ['task', 'goal', 'objective', 'mission', 'assignment', 'purpose'],
    'Instructions': ['instructions', 'guidelines', 'directions', 'guidance', 'requirements'],
    'Steps': ['steps', 'process', 'workflow', 'procedure', 'sequence'],
    'Constraints': ['constraints', 'rules', 'limitations', 'restrictions', 'boundaries'],
    'Output Format': ['output', 'output format', 'response format', 'format', 'deliverables', 'expected output'],
    'Examples': ['example', 'examples', 'few-shot', 'sample', 'samples'],
    'Tone & Style': ['tone', 'style', 'voice', 'writing style'],
    'Audience': ['audience', 'target audience'],
    'Input': ['input', 'input data', 'source data'],
    'Definitions': ['definitions', 'glossary', 'terminology'],
    'Notes': ['notes', 'additional notes', 'remarks'],
    'Criteria': ['criteria', 'evaluation criteria', 'scoring'],
    'Introduction': ['introduction', 'intro'],
    'Conclusion': ['conclusion', 'summary', 'wrap up'],
    'Prerequisites': ['prerequisites', 'requirements', 'setup'],
    'References': ['references', 'sources', 'bibliography'],
  };
  let applied = false, result = text;
  for (const [header, keywords] of Object.entries(map)) {
    const kp = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    result = result.replace(new RegExp(`^\\s*(?:#{1,3}\\s*)?(${kp})\\s*:?\\s*$`, 'gmi'), (match) => {
      // Idempotency: skip if already formatted as "## Header"
      if (match.trim() === `## ${header}`) return match;
      applied = true;
      return `\n## ${header}\n`;
    });
  }
  return { result, applied };
}

function colonLineHeaders(text: string): { result: string; applied: boolean } {
  let applied = false;
  const skip = new Set([
    'Note', 'Warning', 'Tip', 'Important', 'Caution',
    'Example', 'Answer', 'Question', 'Response', 'Reply',
    'Reason', 'Result', 'Problem', 'Solution', 'Error',
    'Input', 'Output', 'Return', 'Default', 'Value',
  ]);
  const result = text.replace(/^(?!#)([A-Z][A-Za-z &\-()]{2,40}):\s*$/gm, (_m, h: string) => {
    if (/^\s*[>*\-+]/.test(_m) || skip.has(h.trim())) return _m;
    // Skip if the heading text contains "and" mid-phrase suggesting a sentence fragment
    if (/\band\b.*\band\b/.test(h)) return _m;
    applied = true;
    return `\n## ${toTitleCase(h.trim())}\n`;
  });
  return { result, applied };
}

// 2e — Promote short standalone lines that precede prose paragraphs to headers
function promoteShortLineBeforeParagraph(text: string): { result: string; applied: boolean } {
  let applied = false;
  const lines = text.split('\n');
  const out: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();

    // Skip blank, already-header, list, code, bold, or blockquote lines
    if (!t || /^[#>*\-+|`]/.test(t) || /^\d+[.)]\s/.test(t) || /^```/.test(t) || /^\*\*/.test(t)) {
      out.push(lines[i]);
      continue;
    }

    const words = t.split(/\s+/).length;

    // Must be a short line (2–5 words), start with uppercase, no sentence-ending punctuation
    // v6.4: Tightened — reduced max words from 6→5, added verb/article guards to avoid
    // promoting sentence fragments like "I want you to" or "The main thing is"
    const skipPhrase = /^(Dear|Hey|Hi|Hello|Thanks|Thank you|Sincerely|Regards|Best|Cheers|Yours|Love|Signed|From|Sent|I |We |My |Our |You |Your |It |The |A |An |This |That )/i;
    // v6.4: Skip lines that contain common verbs (likely sentence fragments, not section titles)
    const hasVerb = /\b(is|are|was|were|will|would|can|could|should|have|has|had|do|does|want|need|make|let|get|try|go)\b/i.test(t);
    if (words >= 2 && words <= 5 && /^[A-Z]/.test(t) && !/[.!?;,]$/.test(t) && !skipPhrase.test(t) && !hasVerb) {
      // Look ahead: skip blank lines, find next non-blank line
      let nextIdx = i + 1;
      while (nextIdx < lines.length && !lines[nextIdx].trim()) nextIdx++;

      if (nextIdx < lines.length) {
        const nextLine = lines[nextIdx].trim();
        const nextWords = nextLine.split(/\s+/).length;

        // If the next content line is a prose paragraph (20+ words), promote current line to header
        if (nextWords >= 20 && /^[A-Z]/.test(nextLine) && !/^[#>*\-+|`]/.test(nextLine) && !/^\d+[.)]\s/.test(nextLine)) {
          applied = true;
          out.push(`\n## ${toTitleCase(t)}\n`);
          continue;
        }
      }
    }

    out.push(lines[i]);
  }

  return { result: out.join('\n'), applied };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STAGE 3 — Paragraph Splitting (Wall-of-Text → Structured Paragraphs)
// ═══════════════════════════════��═══════════════════════════════════════════════

function splitWallOfText(text: string): { result: string; applied: boolean } {
  let applied = false;
  const lines = text.split('\n');
  const out: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip non-prose lines
    if (!trimmed || /^[#>*\-+|`]/.test(trimmed) || /^\d+[.)]\s/.test(trimmed) || /^```/.test(trimmed)) {
      out.push(line);
      continue;
    }
    const words = trimmed.split(/\s+/);
    // Split paragraphs with 45+ words (lowered from 60 for better structure)
    if (words.length < 45) {
      out.push(line);
      continue;
    }

    // Split at transition words after enough content
    const sentences = trimmed.match(/[^.!?]+[.!?]+\s*/g) || [trimmed];
    if (sentences.length < 3) { out.push(line); continue; }

    const transitions = /^(However|Furthermore|Moreover|Additionally|In addition|Also|Meanwhile|On the other hand|In contrast|Conversely|Nevertheless|Nonetheless|Therefore|Consequently|As a result|Thus|Hence|Finally|Lastly|In conclusion|To summarize|In summary|First|Second|Third|Next|Then|Alternatively|Specifically|For example|For instance|That said|Importantly|Notably|Significantly|On top of that|Beyond that|In particular|As such|To that end|With that in mind|That being said|At the same time|In other words|Put differently|More specifically|To clarify|To elaborate|In short|Overall)\b/i;

    let currentParagraph: string[] = [];
    let wordsSoFar = 0;
    let didSplit = false;

    for (const sentence of sentences) {
      const sw = sentence.trim().split(/\s+/).length;
      if (wordsSoFar >= 20 && transitions.test(sentence.trim())) {
        out.push(currentParagraph.join(''));
        out.push('');
        currentParagraph = [sentence];
        wordsSoFar = sw;
        didSplit = true;
        applied = true;
      } else {
        currentParagraph.push(sentence);
        wordsSoFar += sw;
      }
    }
    if (currentParagraph.length) out.push(currentParagraph.join(''));

    // Fallback: if no transition-based split and paragraph is very long (80+ words, 4+ sentences),
    // split into roughly equal chunks of ~3 sentences each
    if (!didSplit && words.length >= 80 && sentences.length >= 4) {
      out.pop(); // remove the un-split line we just pushed
      const chunkSize = Math.ceil(sentences.length / Math.ceil(sentences.length / 3));
      for (let si = 0; si < sentences.length; si += chunkSize) {
        const chunk = sentences.slice(si, si + chunkSize).join('');
        if (chunk.trim()) {
          if (si > 0) out.push('');
          out.push(chunk);
        }
      }
      applied = true;
    }
  }

  return { result: out.join('\n'), applied };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STAGE 4 — Numbered Section Headers ("1. Topic Name" → "## 1. Topic Name")
// ═══════════════════════════════════════════════════════════════════════════════

function numberedSectionHeaders(text: string): { result: string; applied: boolean } {
  let applied = false;
  const result = text.replace(
    /^(\d+)\.\s+([A-Z][A-Za-z &\-,]{2,50})\s*$/gm,
    (_m, num: string, heading: string, offset: number) => {
      // Only promote to header if it's a short line (not a sentence)
      if (/[.!?]$/.test(heading.trim())) return _m;
      // Check if previous line is empty or start of doc (indicates it's a section title)
      const before = text.substring(Math.max(0, offset - 2), offset);
      if (offset === 0 || /\n\s*$/.test(before) || /^\s*$/.test(before)) {
        applied = true;
        return `\n## ${num}. ${toTitleCase(heading.trim())}\n`;
      }
      return _m;
    }
  );
  return { result, applied };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STAGE 5 — Auto-Section Pass (Infer headers for headerless content)
// ═══════════════════════════════════════════════════════════════════════════════

function autoSection(text: string): { result: string; applied: boolean } {
  const blocks = splitBlocks(text);
  if (blocks.length < 2) return { result: text, applied: false };
  const headerCount = blocks.filter(b => hasHeader(b)).length;
  if (headerCount >= Math.ceil(blocks.length * 0.3) && headerCount >= 2) return { result: text, applied: false };

  const used = new Set<SectionKind>();
  const out: string[] = [];
  let applied = false;
  let hasTitle = blocks.some(b => /^#\s/.test(b.trim()));

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i], trimmed = block.trim();
    if (hasHeader(block)) { out.push(block); continue; }

    if (i === 0 && !hasTitle) {
      const nl = trimmed.indexOf('\n');
      const first = nl > 0 ? trimmed.substring(0, nl) : trimmed;
      const rest = nl > 0 ? trimmed.substring(nl + 1) : '';

      const titleWords = first.split(/\s+/).filter(Boolean);
      const greetPat = /^(hey|hi|hello|dear|ok|okay|so|well|um|uh|please|thanks|yo|sup|sure|right|anyway|basically|actually|just|like)\b/i;
      if (first.length < 80 && titleWords.length >= 2 && !greetPat.test(first) && !/^[0-9]+[.)]\s/.test(first) && !/^[-*+\u2022]/.test(first) && !/[.!?,;:]$/.test(first)) {
        out.push(`# ${toTitleCase(first)}`);
        if (rest.trim()) {
          const kind = inferSection(rest);
          if (kind && !used.has(kind)) { used.add(kind); out.push(`\n## ${SECTION_LABELS[kind]}\n\n${rest}`); }
          else out.push(rest);
        }
        hasTitle = true; applied = true; continue;
      }
      const genTitle = generateTitle(blocks.map(b => b.trim()).join('\n'));
      if (genTitle) { out.push(`# ${genTitle}`); hasTitle = true; applied = true; }
    }

    const kind = inferSection(trimmed);
    // Suppress section inference on first-person narrative blocks (bios, personal intros)
    const firstPersonCount = (trimmed.match(/\bI\b|\bI'm\b|\bI've\b|\bmy\b|\bmyself\b/g) || []).length;
    const isFirstPersonNarrative = firstPersonCount >= 3;
    if (kind && !used.has(kind) && !isFirstPersonNarrative) { used.add(kind); out.push(`## ${SECTION_LABELS[kind]}\n\n${trimmed}`); applied = true; }
    else out.push(trimmed);
  }
  return { result: out.join('\n\n'), applied };
}

function ensureTitle(text: string): { result: string; applied: boolean } {
  const lines = text.split('\n'), first = lines[0]?.trim() || '';
  if (first.startsWith('#')) return { result: text, applied: false };
  // Explicit "Title: X" pattern
  const pm = first.match(/^(Title|Subject|Prompt|Topic|Name|Heading):\s*(.+)$/i);
  if (pm) { lines[0] = `# ${toTitleCase(pm[2])}`; return { result: lines.join('\n'), applied: true }; }
  // Auto-promote short first line to title — with guards against greetings & single words
  const firstWords = first.split(/\s+/).filter(Boolean);
  const greetings = /^(hey|hi|hello|dear|ok|okay|so|well|um|uh|please|thanks|yo|sup|sure|right|anyway|basically|actually|just|like)\b/i;
  if (
    first.length > 0 && first.length < 80 && firstWords.length >= 2 &&
    !/^[0-9]+[.)]\s/.test(first) && !/^[-*+\u2022]/.test(first) &&
    !/^##?\s/.test(first) && !/[.!?,;:]$/.test(first) &&
    !greetings.test(first) && lines.length > 1
  ) {
    lines[0] = `# ${toTitleCase(first)}`;
    return { result: lines.join('\n'), applied: true };
  }
  return { result: text, applied: false };
}

function titleCaseHeaders(text: string): { result: string; applied: boolean } {
  let applied = false;
  const result = text.replace(/^(#{1,6})\s+(.+)$/gm, (_m, h: string, heading: string) => {
    const tc = toTitleCase(heading);
    if (tc !== heading) applied = true;
    return `${h} ${tc}`;
  });
  return { result, applied };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STAGE 6 — Step / Bullet / List Formatting
// ══════════════════════════════════════════════��════════════════════════════════

function formatSteps(text: string): { result: string; applied: boolean } {
  let applied = false;
  const result = text.replace(/^(Step|Phase)\s+(\d+)\s*[:.\u2014-]\s*/gmi, (_m, w: string, n: string) => {
    applied = true;
    return `### ${w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()} ${n}: `;
  });
  return { result, applied };
}

function normalizeBullets(text: string): string {
  let result = text;
  // Unicode bullets → "- "
  result = result.replace(/^[\u2022\u25CF\u25CB\u25E6\u25AA\u25AB\u25BA\u25B8\u27A4\u279C\u2192]\s+/gm, '- ');
  // Asterisk and plus bullets → "- " (at line start, possibly indented)
  result = result.replace(/^(\s*)[*+]\s+/gm, '$1- ');
  // Normalize "1)" → "1." style numbered lists
  result = result.replace(/^(\s*)(\d+)\)\s+/gm, '$1$2. ');
  return result;
}

// Split run-on lists pasted as a single line (e.g., "- item1 - item2 - item3")
function splitRunOnLists(text: string): { result: string; applied: boolean } {
  let applied = false;
  const lines = text.split('\n');
  const out: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Run-on bullet list: "- item - item - item" on one line (3+ items)
    // Guard: each item must be 2+ chars, avg length < 60 (rules out prose with em-dashes)
    if (/^-\s+.+\s+-\s+/.test(trimmed)) {
      const items = trimmed.split(/\s+-\s+/);
      if (items.length >= 3) {
        const cleaned = items.map(it => it.replace(/^-\s+/, '').trim()).filter(Boolean);
        const avgLen = cleaned.reduce((a, b) => a + b.length, 0) / cleaned.length;
        if (cleaned.every(it => it.length >= 2) && avgLen < 60) {
          applied = true;
          for (const item of cleaned) {
            out.push(`- ${item}`);
          }
          continue;
        }
      }
    }
    // Run-on numbered list: "1. item 2. item 3. item" on one line
    if (/^\d+\.\s+.+\s+\d+\.\s+/.test(trimmed)) {
      const items = trimmed.split(/\s+(?=\d+\.\s+)/);
      if (items.length >= 3) {
        applied = true;
        for (const item of items) {
          out.push(item.trim());
        }
        continue;
      }
    }
    out.push(line);
  }

  return { result: out.join('\n'), applied };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STAGE 7 — Embedded List Extraction
//  Converts "X: item1, item2, item3" or "X: item1; item2; item3" to bullet lists
// ═══════════════════════════════════════════════════════════════════════════════

function extractEmbeddedLists(text: string): { result: string; applied: boolean } {
  let applied = false;
  const lines = text.split('\n');
  const out: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i], trimmed = line.trim();

    // Skip non-prose
    if (!trimmed || /^[#>*\-+|`]/.test(trimmed) || /^\d+[.)]\s/.test(trimmed)) {
      out.push(line);
      continue;
    }

    // Pattern: "Label: item1, item2, item3" or "Label: item1; item2; item3"
    // v6.4: Tightened — label must be 1-3 words starting with uppercase, look like a category/attribute
    const colonListMatch = trimmed.match(/^(.{2,40}):\s*(.+)$/);
    if (colonListMatch) {
      const label = colonListMatch[1].trim();
      const rest = colonListMatch[2];
      const labelWords = label.split(/\s+/);

      // Skip if label looks like a sentence start
      const skipWords = new Set(['The','This','That','These','Those','There','Then','They','However','Here','He','She','It','If','In','Is','I','We','You','When','Where','What','Why','Who','Which','While','With','Would','Will','Was','Were','Are','Do','But','And','Or','Not','No','So','For','From','By','At','On','To','As','Be']);
      if (skipWords.has(labelWords[0])) { out.push(line); continue; }
      // v6.4: Label must be 1-3 words and start with uppercase (category name, not a sentence fragment)
      if (labelWords.length > 3 || !/^[A-Z]/.test(label)) { out.push(line); continue; }
      // v6.4: Skip labels that contain verbs suggesting a sentence (e.g., "Makes sure: ...")
      if (/\b(is|are|was|were|has|have|had|do|does|did|will|would|can|could|shall|should|may|might|must|make|makes|need|needs)\b/i.test(label)) { out.push(line); continue; }

      // Try semicolon split first (stronger signal)
      const semiItems = rest.split(/;\s*/);
      if (semiItems.length >= 3 && semiItems.every(it => it.trim().length >= 2 && it.trim().length <= 80)) {
        applied = true;
        out.push(`\n**${label.trim()}:**\n`);
        for (const item of semiItems) {
          if (item.trim()) out.push(`- ${item.trim().charAt(0).toUpperCase() + item.trim().slice(1)}`);
        }
        continue;
      }

      // Try comma split (3+ items, not a normal sentence)
      const commaItems = rest.split(/,\s*/);
      // Handle "X, Y and Z" (no Oxford comma): split last item on " and "
      const lastItem = commaItems[commaItems.length - 1];
      const andSplit = lastItem.split(/\s+and\s+/i);
      if (andSplit.length === 2 && andSplit[0].trim().length >= 2 && andSplit[1].trim().length >= 2) {
        commaItems.pop();
        commaItems.push(andSplit[0].trim(), andSplit[1].trim());
      } else {
        // Handle "and X" prefix on last item (Oxford comma case: "X, Y, and Z")
        const andMatch = lastItem.match(/^and\s+(.+)/i);
        if (andMatch) commaItems[commaItems.length - 1] = andMatch[1];
      }
      if (commaItems.length >= 3 && commaItems.every(it => it.trim().length >= 2 && it.trim().length <= 50) && !rest.includes('. ') && commaItems.every(it => it.trim().split(/\s+/).length <= 5)) {

        applied = true;
        out.push(`\n**${label.trim()}:**\n`);
        for (const item of commaItems) {
          if (item.trim()) out.push(`- ${item.trim().charAt(0).toUpperCase() + item.trim().slice(1)}`);
        }
        continue;
      }
    }

    out.push(line);
  }

  return { result: out.join('\n'), applied };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STAGE 7b — Sequential Instruction Extraction
//  "First, do X. Then, do Y. Finally, do Z." → numbered list
// ═══════════════════════════════════════════════════════════════════════════════

function extractSequentialInstructions(text: string): { result: string; applied: boolean } {
  // Strong sequence words that clearly indicate procedural steps
  const strongSeq = /^(First|Second|Third|Fourth|Fifth|Sixth|Finally|Lastly|Start by|Begin by|Begin with|Following that|Subsequently|Last of all|To start|To begin|To finish)\b/i;
  // Weaker words only count when followed by comma (avoids matching narrative "Then the dog...")
  const weakSeqComma = /^(Next|Then|After that|Additionally|Furthermore|Moreover|Also|In addition|Last),\s/i;

  let applied = false;
  const lines = text.split('\n');
  const out: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || /^[#>*\-+|`]/.test(trimmed) || /^\d+[.)]\s/.test(trimmed) || /^```/.test(trimmed)) {
      out.push(line);
      continue;
    }

    const sentences = trimmed.match(/[^.!?]+[.!?]+/g);
    if (!sentences || sentences.length < 3) {
      out.push(line);
      continue;
    }

    const seqCount = sentences.filter(s => {
      const st = s.trim();
      return strongSeq.test(st) || weakSeqComma.test(st);
    }).length;

    if (seqCount >= 3 || (seqCount >= 2 && sentences.length <= 4 && seqCount / sentences.length >= 0.5)) {
      applied = true;
      let step = 1;
      const strip = /^(First|Second|Third|Fourth|Fifth|Sixth|Next|Then|After that|Finally|Lastly|Additionally|Furthermore|Moreover|Also|Start by|Begin by|Begin with|Following that|Subsequently|In addition|Last|Last of all|To start|To begin|To finish),?\s*/i;
      for (const sentence of sentences) {
        const s = sentence.trim();
        const cleaned = s.replace(strip, '');
        const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        out.push(`${step}. ${capitalized}`);
        step++;
      }
      continue;
    }

    out.push(line);
  }

  return { result: out.join('\n'), applied };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STAGE 8 — Inline Markdown Formatting
// ═══════════════════════════════════════════════════════════════════════════════

// 8a — Inline code wrapping (camelCase, snake_case, PascalCase, file paths, env vars)
function wrapInlineCode(text: string): { result: string; applied: boolean } {
  let applied = false;
  // v6.4: Process line-by-line so we can skip headers, blockquotes, and code fences
  const lines = text.split('\n');
  const processed: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Never inject backticks into header lines, blockquotes, or code fences
    if (/^\s*#{1,6}\s/.test(line) || /^>\s/.test(trimmed) || /^```/.test(trimmed)) {
      processed.push(line);
      continue;
    }
    let result = line;

    // File paths: /path/to/file.ext or ./file.ext (not already in backticks or links)
    result = result.replace(
      /(?<!`)(?<!\[)(?<!\()((?:\.?\/|~\/)[a-zA-Z0-9_\-./]+\.\w{1,6})(?!`|\))/g,
      (match) => { applied = true; return '`' + match + '`'; }
    );

    // Environment variables: $VAR_NAME or ${VAR_NAME}
    result = result.replace(
      /(?<!`)(\$\{?[A-Z][A-Z0-9_]{2,}\}?)(?!`)/g,
      (match) => { applied = true; return '`' + match + '`'; }
    );

    // snake_case identifiers (3+ chars, at least one underscore) in prose context
    result = result.replace(
      /(?<=\s|^)(?<!`)([a-z][a-z0-9]*(?:_[a-z0-9]+)+)(?!`)(?=[\s.,;:!?)]|$)/gm,
      (match) => {
        if (/^(e_g|i_e|a_lot)$/.test(match)) return match;
        applied = true;
        return '`' + match + '`';
      }
    );

    // camelCase identifiers in prose context (min 4 chars, has uppercase after lowercase)
    result = result.replace(
      /(?<=\s|^)(?<!`)([a-z][a-z0-9]*[A-Z][a-zA-Z0-9]{1,30})(?!`)(?=[\s.,;:!?)]|$)/gm,
      (match) => { applied = true; return '`' + match + '`'; }
    );

    // PascalCase multi-word identifiers in prose (min 2 capital letters, not ALL-CAPS, not common words)
    result = result.replace(
      /(?<=\s|^)(?<!`)([A-Z][a-z]+(?:[A-Z][a-z]+){1,5})(?!`)(?=[\s.,;:!?)]|$)/gm,
      (match) => {
        const skip = new Set(['The','This','That','There','They','Their','These','Those','After','Before','About','Above','Below','Between','During','Without','Within','Through','Against','Around','Beyond','Until']);
        if (skip.has(match)) return match;
        if ((match.match(/[A-Z]/g) || []).length < 2) return match;
        applied = true;
        return '`' + match + '`';
      }
    );

    // CLI commands / flags: --flag-name or -f (only standalone)
    result = result.replace(
      /(?<=\s|^)(?<!`)(--[a-z][a-z0-9-]{1,20})(?!`)(?=[\s.,;:!?)]|$)/gm,
      (match) => { applied = true; return '`' + match + '`'; }
    );

    processed.push(result);
  }

  return { result: processed.join('\n'), applied };
}

// 8a2 — Wrap common technical acronyms in backticks
function wrapTechAcronyms(text: string): { result: string; applied: boolean } {
  let applied = false;
  const acronyms = new Set([
    'API', 'APIs', 'REST', 'JSON', 'HTML', 'CSS', 'HTTP', 'HTTPS', 'SQL',
    'URL', 'URLs', 'URI', 'URIs', 'CLI', 'SDK', 'IDE', 'GUI', 'XML', 'CSV',
    'YAML', 'TOML', 'JWT', 'SSH', 'SSL', 'TLS', 'DNS', 'TCP', 'UDP',
    'AWS', 'GCP', 'CDN', 'NPM', 'CORS', 'CRUD', 'DOM', 'AJAX', 'WASM',
    'GPU', 'CPU', 'RAM', 'SSD', 'HDD', 'EOF',
    'UUID', 'GUID', 'ENUM', 'ORM', 'MVC', 'MVVM',
  ]);
  // Process line-by-line to skip header lines
  const lines = text.split('\n');
  const out: string[] = [];
  for (const line of lines) {
    if (/^\s*#{1,6}\s/.test(line)) { out.push(line); continue; } // skip headers
    out.push(line.replace(
      /(?<=\s|^)(?<!`)(?<!\*\*)([A-Z]{2,6}s?)(?!`)(?!\*\*)(?=[\s.,;:!?)]|$)/gm,
      (match) => {
        if (acronyms.has(match)) { applied = true; return '`' + match + '`'; }
        return match;
      }
    ));
  }
  return { result: out.join('\n'), applied };
}

// 8b — Bold emphasis for ALL-CAPS phrases in prose (not acronyms)
// v6.4: Require 2+ ALL-CAPS words (not single words), skip list items & blockquotes
function boldAllCapsInProse(text: string): { result: string; applied: boolean } {
  let applied = false;
  const result = text.replace(
    /(?<=\s|^)(?<!\*\*)([A-Z]{2}[A-Z\s]{1,25}[A-Z])(?!\*\*)(?=[\s.,;:!?)]|$)/gm,
    (match, _group, offset) => {
      const word = match.trim();
      // Skip if it's a header line
      const lineStart = text.lastIndexOf('\n', offset) + 1;
      const linePrefix = text.substring(lineStart, offset).trim();
      if (linePrefix.startsWith('#')) return match;
      // Skip single ALL-CAPS words (≤8 chars, no spaces) — likely acronyms handled elsewhere
      if (word.length <= 8 && !/\s/.test(word)) return match;
      // v6.4: Require at least 2 space-separated words to be considered an emphasis phrase
      const capsWords = word.split(/\s+/).filter(Boolean);
      if (capsWords.length < 2) return match;
      // Skip if already formatted
      if (/^\*\*/.test(match) || /\*\*$/.test(match)) return match;
      // Skip if on a list item or blockquote line
      if (/^[-*+>]/.test(linePrefix) || /^\d+[.)]/.test(linePrefix)) return match;
      applied = true;
      return `**${toTitleCase(word)}**`;
    }
  );
  return { result, applied };
}

// 8c — Bold key terms in definitions: "Term - definition" or "Term: definition"
// v6.4: Added guard for list items, blockquotes, and header lines
function boldDefinitionTerms(text: string): { result: string; applied: boolean } {
  let applied = false;
  const result = text.replace(
    /^([A-Z][A-Za-z\s]{1,30})\s+[-\u2013\u2014]\s+(.{10,})$/gm,
    (_m, term: string, def: string) => {
      // Idempotency: skip if term is already bolded
      if (/^\*\*/.test(_m)) return _m;
      // v6.4: Skip if the term is on a list item or blockquote line
      if (/^\s*[-*+>]/.test(_m) || /^\s*\d+[.)]/.test(_m)) return _m;
      // v6.4: Skip terms longer than 3 words (likely sentence fragments, not definition terms)
      if (term.trim().split(/\s+/).length > 3) return _m;
      applied = true;
      return `**${term.trim()}** \u2014 ${def}`;
    }
  );
  return { result, applied };
}

// 8d — Emphasis for quoted terms (convert "quoted term" to **quoted term**)
// v6.4: Much more conservative — only boldify short technical-looking terms (2-4 words),
// preserve intentional quotation marks on everything else
function emphasizeQuotedTerms(text: string): { result: string; applied: boolean } {
  let applied = false;
  const result = text.replace(
    /"([^"]{2,40})"/g,
    (match, inner: string, offset: number) => {
      const trimmedInner = inner.trim();
      const wordCount = trimmedInner.split(/\s+/).length;
      // Skip if it looks like a full sentence (has period + space)
      if (/\.\s/.test(inner)) return match;
      // Skip URLs
      if (/^https?:/.test(inner)) return match;
      // Skip if inside backticks (code context)
      const before3 = text.substring(Math.max(0, offset - 3), offset);
      if (/`$/.test(before3)) return match;
      // v6.4: Only boldify if it looks like a technical term or key concept:
      // - 1-4 words (not long phrases/speech)
      // - Starts with uppercase OR contains technical patterns (camelCase, underscores, hyphens between words)
      if (wordCount > 4) return match;
      const isTechnical = /^[A-Z]/.test(trimmedInner) || /[_.]/.test(trimmedInner) || /[a-z][A-Z]/.test(trimmedInner);
      // Skip all-lowercase conversational/speech patterns
      if (/^[a-z]/.test(trimmedInner) && !isTechnical) return match;
      // Skip common conversational quotes
      const conversational = /^(yes|no|yeah|nah|ok|okay|sure|thanks|hello|hi|hey|please|sorry|right|maybe|well|hmm|oh|wow|great|fine|good|nice|cool|true|false)$/i;
      if (conversational.test(trimmedInner)) return match;
      // Skip if on a header line
      const lineStart = text.lastIndexOf('\n', offset) + 1;
      const linePrefix = text.substring(lineStart, offset).trim();
      if (/^#{1,6}\s/.test(linePrefix)) return match;
      applied = true;
      return `**${inner}**`;
    }
  );
  return { result, applied };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STAGE 9 — Grammar Correction
// ═══════════════════════════════════════════════════════════════════════════════

function fixContractions(text: string): { result: string; applied: boolean } {
  let applied = false;
  const pairs: [RegExp, string][] = [
    [/\bdont\b/gi, "don't"], [/\bcant\b/gi, "can't"], [/\bwont\b/gi, "won't"],
    [/\bshouldnt\b/gi, "shouldn't"], [/\bwouldnt\b/gi, "wouldn't"], [/\bcouldnt\b/gi, "couldn't"],
    [/\bisnt\b/gi, "isn't"], [/\barent\b/gi, "aren't"], [/\bwasnt\b/gi, "wasn't"],
    [/\bwerent\b/gi, "weren't"], [/\bdoesnt\b/gi, "doesn't"], [/\bhasnt\b/gi, "hasn't"],
    [/\bhavent\b/gi, "haven't"], [/\bhadnt\b/gi, "hadn't"], [/\btheyre\b/gi, "they're"],
    [/\byoure\b/gi, "you're"], [/\bthats\b/gi, "that's"], [/\bwhats\b/gi, "what's"],
    [/\bheres\b/gi, "here's"], [/\btheres\b/gi, "there's"], [/\bive\b/gi, "I've"],
  ];
  let result = text;
  for (const [p, r] of pairs) { const rep = result.replace(p, r); if (rep !== result) { applied = true; result = rep; } }
  return { result, applied };
}

function fixPronounI(text: string): { result: string; applied: boolean } {
  let applied = false;
  const result = text.replace(/(^|[.!?:;,\s])\bi\b(?=\s|['.!?,;:]|$)/gm, (match, prefix: string) => { applied = true; return prefix + 'I'; });
  return { result, applied };
}

function fixRepeatedWords(text: string): { result: string; applied: boolean } {
  let applied = false;
  const result = text.replace(/\b(\w{2,})\s+\1\b/gi, (match, word: string) => {
    if (/^(ha|he|la|na|do|go|no|so|bye|cha)$/i.test(word)) return match;
    applied = true; return word;
  });
  return { result, applied };
}

function fixSpacing(text: string): { result: string; applied: boolean } {
  let applied = false, result = text;
  // Double spaces → single (not at line start)
  let f = result.replace(/(\S)  +(\S)/g, '$1 $2');
  if (f !== result) { applied = true; result = f; }
  // Missing space after sentence punctuation before uppercase letter
  f = result.replace(/([.!?,;:])([A-Z])/g, (match, p: string, l: string, offset: number) => {
    const before = result.substring(Math.max(0, offset - 5), offset);
    if (/https?$|www$|\.\w$|e\.g$|i\.e$/i.test(before)) return match;
    applied = true; return `${p} ${l}`;
  });
  result = f;
  // Missing space after period before lowercase
  f = result.replace(/(\.)([a-z])/g, (match, p: string, l: string, offset: number) => {
    const before = result.substring(Math.max(0, offset - 10), offset);
    if (/https?:\/|www\.|[a-zA-Z]$|e\.g|i\.e|\d$/i.test(before) || /\.\w+$/.test(before)) return match;
    applied = true; return `${p} ${l.toUpperCase()}`;
  });
  result = f;
  return { result, applied };
}

function capitalizeSentences(text: string): { result: string; applied: boolean } {
  let applied = false;
  const codeKW = /^(const|let|var|function|import|export|return|if|else|for|while|class|interface|type|def|fn|func)$/;
  const lines = text.split('\n'), out: string[] = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t || /^[#>|`{<]/.test(t) || /^```/.test(t)) { out.push(line); continue; }

    // Capitalize first word of bullet list items: "- foo bar" → "- Foo bar"
    const bulletMatch = t.match(/^([-*+\u2022]\s+)([a-z])(\w*)(.*)/);
    if (bulletMatch) {
      if (!codeKW.test(bulletMatch[2] + bulletMatch[3])) {
        const cap = bulletMatch[1] + bulletMatch[2].toUpperCase() + bulletMatch[3] + bulletMatch[4];
        if (cap !== t) { applied = true; out.push(cap); continue; }
      }
      out.push(line); continue;
    }

    // Capitalize first word of numbered list items: "1. foo" → "1. Foo"
    const numMatch = t.match(/^(\d+[.)]\s+)([a-z])(\w*)(.*)/);
    if (numMatch) {
      if (!codeKW.test(numMatch[2] + numMatch[3])) {
        const cap = numMatch[1] + numMatch[2].toUpperCase() + numMatch[3] + numMatch[4];
        if (cap !== t) { applied = true; out.push(cap); continue; }
      }
      out.push(line); continue;
    }

    // Skip bold-start lines
    if (/^\*\*/.test(t)) { out.push(line); continue; }

    // Regular prose capitalization
    const idx = t.search(/[a-zA-Z]/);
    if (idx >= 0 && /^[a-z]/.test(t.charAt(idx))) {
      const word = t.match(/^[a-z]\w*/)?.[0] || '';
      if (!/[A-Z]/.test(word.slice(1)) && !codeKW.test(word)) {
        const indent = line.match(/^(\s*)/)?.[1] || '';
        const cap = indent + t.charAt(0).toUpperCase() + t.slice(1);
        if (cap !== line) applied = true;
        out.push(cap); continue;
      }
    }
    out.push(line);
  }
  let joined = out.join('\n');
  joined = joined.replace(/([.!?])\s+([a-z])/g, (match, p: string, l: string) => {
    if (/(?:e\.g|i\.e|etc|vs|dr|mr|mrs|ms)$/i.test(match)) return match;
    applied = true; return `${p} ${l.toUpperCase()}`;
  });
  return { result: joined, applied };
}

function fixCommonGrammar(text: string): { result: string; applied: boolean } {
  let applied = false, result = text;
  const fixes: [RegExp, string][] = [
    [/\balot\b/gi, 'a lot'], [/\baswell\b/gi, 'as well'], [/\binfact\b/gi, 'in fact'],
    [/\binorder\b/gi, 'in order'], [/\batleast\b/gi, 'at least'], [/\bincase\b/gi, 'in case'],
    [/\beventhough\b/gi, 'even though'], [/\beachother\b/gi, 'each other'],
    [/\bfor awhile\b/gi, 'for a while'], [/\bnoone\b/gi, 'no one'],
    [/\bcan not\b/gi, 'cannot'], [/\betc\b(?!\.)/gi, 'etc.'],
    // Common misspellings
    [/\bteh\b/gi, 'the'], [/\brecieve\b/gi, 'receive'], [/\bseperate\b/gi, 'separate'],
    [/\boccured\b/gi, 'occurred'], [/\bdefinate\b/gi, 'definite'],
    [/\bneccessary\b/gi, 'necessary'], [/\bneccesary\b/gi, 'necessary'],
    [/\baccomodate\b/gi, 'accommodate'], [/\boccassion\b/gi, 'occasion'],
    [/\buntill\b/gi, 'until'], [/\bwich\b/gi, 'which'], [/\bbeacuse\b/gi, 'because'],
    [/\bwether\b/gi, 'whether'], [/\benviroment\b/gi, 'environment'],
    [/\bgoverment\b/gi, 'government'], [/\bimmediatly\b/gi, 'immediately'],
    [/\bforiegn\b/gi, 'foreign'], [/\bwierd\b/gi, 'weird'],
    [/\bsuccesful\b/gi, 'successful'], [/\bsuccesfully\b/gi, 'successfully'],
  ];
  for (const [p, r] of fixes) { const rep = result.replace(p, r); if (rep !== result) { applied = true; result = rep; } }
  return { result, applied };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STAGE 10 — Semantic Formatting (Roles, Constraints, Callouts, Key-Values)
// ═══════════════════════════════════════════════════════════════════════════════

function highlightRoleDefinitions(text: string): { result: string; applied: boolean } {
  let applied = false;
  const result = text.replace(/^(Act as a|Act as an|You are a|You are an|Your role is|Simulate a|Simulate an|Imagine you are a|Imagine you are an|Imagine you're a|Imagine you're an|Pretend you are a|Pretend you are an|Pretend to be a|Pretend to be an|You should act as a|You should act as an|Behave as a|Behave as an|Behave like a|Behave like an|Take on the role of a|Take on the role of an|Assume the role of a|Assume the role of an)\s+([^.\n]{4,80})\./gmi,
    (_m, prefix: string, desc: string) => { applied = true; return `> **ROLE:** ${prefix} ${desc}.`; });
  return { result, applied };
}

function highlightConstraints(text: string): { result: string; applied: boolean } {
  let applied = false;
  const result = text.replace(/^[-\u2014\u203A*+]\s*(Do not|Don't|Avoid|Never|Must not|Cannot|Should not|Shall not|Refrain from|Ensure you don't|Make sure not to|Under no circumstances|Always ensure|Always|Ensure that|Ensure|Make sure to|Make sure)\s+([^.\n]+)\.?/gmi,
    (_m, verb: string, rest: string) => {
      // Skip if already bolded
      if (/^\*\*/.test(verb)) return _m;
      applied = true;
      return `- **${verb}** ${rest}`;
    });
  return { result, applied };
}

// v6.4: Added guards for unchecked checkboxes [ ], footnotes [^n], and existing {{var}} patterns
function standardizeVariables(text: string): { result: string; applied: boolean } {
  let applied = false;
  const result = text.replace(/\[([A-Za-z][A-Za-z0-9\s_]{1,30})\]/g,
    (match, inner: string, offset: number) => {
      // Skip markdown links [text](url)
      if (text[offset + match.length] === '(') return match;
      // Skip checkboxes [x], [X], [ ]
      if (/^[xX ]$/.test(inner)) return match;
      // Skip image alt text ![...]
      if (inner.startsWith('!')) return match;
      // Skip footnote references [^...]
      if (inner.startsWith('^')) return match;
      // Skip if already wrapped in {{ }} (idempotency)
      if (offset >= 2 && text.substring(offset - 2, offset) === '{{') return match;
      // Skip if on a header line — don't convert headings' bracketed text
      const lineStart = text.lastIndexOf('\n', offset) + 1;
      const linePrefix = text.substring(lineStart, offset).trim();
      if (/^#{1,6}\s/.test(linePrefix)) return match;
      applied = true; return `{{${inner}}}`;
    });
  return { result, applied };
}

function enhanceCallouts(text: string): { result: string; applied: boolean } {
  const pats: [RegExp, string][] = [
    [/^(Note|Important Note|Please Note|N\.B\.?):\s*(.+)/gmi, '> **Note:** $2'],
    [/^(Warning|Caution|Be Careful|Careful):\s*(.+)/gmi, '> **Warning:** $2'],
    [/^(Tip|Pro Tip|Hint|Suggestion):\s*(.+)/gmi, '> **Tip:** $2'],
    [/^(Important|Critical|Key Point|Attention):\s*(.+)/gmi, '> **Important:** $2'],
    [/^(TODO|FIXME|HACK|XXX|BUG):\s*(.+)/gm, '> **$1:** $2'],
    [/^(Reminder|Remember|Keep in Mind):\s*(.+)/gmi, '> **Note:** $2'],
  ];
  let applied = false, result = text;
  for (const [p, r] of pats) { const rep = result.replace(p, r); if (rep !== result) { applied = true; result = rep; } }
  return { result, applied };
}

// v6.4: Tightened — require key to be 1-2 words, skip list items and blockquotes
function formatKeyValues(text: string): string {
  return text.replace(/^([A-Z][A-Za-z\s&]{0,25}):\s+(.{1,80})$/gm, (_m, key: string, val: string) => {
    const skip = new Set(['The','This','That','These','Those','There','Then','They','Therefore','Thus','Through','Today','However','Here','Hence','How','His','Her','He','She','It','Its','If','In','Is','I','We','You','When','Where','What','Why','Who','Which','While','With','Would','Will','Was','Were','Are','Am','Do','Does','Did','But','And','Or','Not','No','So','Yet','For','From','By','At','On','To','As','Be','My','Our','Your','Their']);
    const keyTrimmed = key.trim();
    if (skip.has(keyTrimmed)) return _m;
    // v6.4: Skip if value contains multiple sentences (indicates prose, not key-value)
    if (/\.\s+[A-Z]/.test(val)) return _m;
    // v6.4: Require key to be 1-2 words (not a phrase that's really a sentence start)
    if (keyTrimmed.split(/\s+/).length > 2) return _m;
    // Idempotency: skip if already bolded
    if (/^\*\*/.test(_m)) return _m;
    // v6.4: Skip lines that start with list markers or blockquote
    if (/^\s*[-*+>]/.test(_m) || /^\s*\d+[.)]/.test(_m)) return _m;
    return `**${keyTrimmed}:** ${val}`;
  });
}

// v6.4: Added idempotency guard — skip URLs already wrapped in [text](url) or bare [url](url)
function autoLinkURLs(text: string): string {
  return text.replace(/(?<!\[)(?<!\()(?<!\]\()(?<!")(https?:\/\/[^\s<>)\]"']+)/g, (url, _m, offset) => {
    // Idempotency: check if this URL is already the target of a markdown link [...](<url>)
    const after = text.substring(offset + url.length, offset + url.length + 1);
    if (after === ')') return url; // already inside a link target
    // Check if preceding context is "](" (markdown link syntax)
    const before5 = text.substring(Math.max(0, offset - 5), offset);
    if (/\]\(\s*$/.test(before5)) return url;
    return `[${url}](${url})`;
  });
}

function normalizeDividers(text: string): string { return text.replace(/^-{3,}$/gm, '\n---\n'); }
function normalizeQuotes(text: string): string { return text.replace(/^>\s*([^>\s])/gm, '> $1'); }

// ═══════════════════════════════════════════════════════════════════════════════
//  STAGE 11 — Final Prose Polishing (Sentence endings, smart punctuation)
// ════════════════════════════════════════════��══════════════════════════════════

// v6.4: Only add period when line is at a true paragraph boundary (followed by blank line or EOF)
// and the line is clearly a prose sentence (6+ words, not a label/title pattern)
function ensureSentenceEndings(text: string): { result: string; applied: boolean } {
  let applied = false;
  const lines = text.split('\n'), out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i], t = line.trim(), next = lines[i + 1]?.trim() || '';
    if (!t || /^[#>*\-+|`]/.test(t) || /^\d+[.)]\s/.test(t) || /^```/.test(t) || /^\*\*\w/.test(t)) { out.push(line); continue; }
    // v6.4: Require paragraph boundary — followed by blank line OR at end of text
    const isParaEnd = (i === lines.length - 1) || next === '';
    if (!isParaEnd) { out.push(line); continue; }
    // Must be a real prose sentence: 6+ words, 30+ chars, not a label/key-value pattern
    if (t.length > 30 && t.split(/\s+/).length >= 6 && !/[.!?:;,\-\u2014)]$/.test(t) && !/\*\*$/.test(t) && !/\}\}$/.test(t) && !/\]$/.test(t) && !/`$/.test(t) && !/:\s*$/.test(t)) {
      applied = true; out.push(line + '.'); continue;
    }
    out.push(line);
  }
  return { result: out.join('\n'), applied };
}

// Smart quotes and dashes
function smartPunctuation(text: string): { result: string; applied: boolean } {
  let applied = false, result = text;
  // Em-dash: " -- " or "--" → " — "
  let f = result.replace(/\s*--\s*/g, ' \u2014 ');
  if (f !== result) { applied = true; result = f; }
  // Ellipsis: "..." → "…"
  f = result.replace(/\.\.\./g, '\u2026');
  if (f !== result) { applied = true; result = f; }
  return { result, applied };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  POST-PROCESS HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function deduplicateConsecutiveHeaders(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];
  let lastHeader = '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^#{1,6}\s+/.test(trimmed)) {
      if (trimmed === lastHeader) continue; // skip duplicate
      lastHeader = trimmed;
    } else if (trimmed !== '') {
      lastHeader = ''; // reset on non-blank, non-header content
    }
    out.push(line);
  }
  return out.join('\n');
}

function detectUnbulletedLists(text: string): { result: string; applied: boolean } {
  let applied = false;
  const lines = text.split('\n');
  const out: string[] = [];

  // Only bullet-ize content that appears after at least one ## header
  // (prevents bulleting metadata at the top of bios/profiles)
  let seenHeader = false;

  let i = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();

    // Track whether we've seen a ##+ section header (not # title — title is too early to trust)
    if (/^#{2,6}\s+/.test(trimmed)) seenHeader = true;

    // Skip already formatted, blank, header, code, or existing list lines
    if (!trimmed || /^[#>*\-+|`]/.test(trimmed) || /^\d+[.)]\s/.test(trimmed) || /^```/.test(trimmed) || /^\*\*/.test(trimmed)) {
      out.push(lines[i]);
      i++;
      continue;
    }

    // Collect a run of consecutive short, non-prose lines
    const runStart = i;
    const run: string[] = [];
    while (i < lines.length) {
      const t = lines[i].trim();
      if (!t) break; // blank line ends the run
      // Stop if it's a header, code, or existing list
      if (/^[#>*\-+|`]/.test(t) || /^\d+[.)]\s/.test(t) || /^```/.test(t) || /^\*\*/.test(t)) break;
      // Stop if it's a long prose sentence (>100 chars or ends with sentence punctuation and has 12+ words)
      const words = t.split(/\s+/).length;
      if (t.length > 100) break;
      if (/[.!?]$/.test(t) && words >= 12) break;
      run.push(t);
      i++;
    }

    // If we found a run of 3+ short lines, convert to bullet list
    // Guards: uppercase start, after a header, reasonable word count
    if (seenHeader && run.length >= 3 && run.every(r => r.split(/\s+/).length <= 15 && /^[A-Z0-9<(]/.test(r))) {
      applied = true;
      for (const item of run) {
        out.push(`- ${item}`);
      }
    } else if (run.length > 0) {
      // Not a list — push original lines
      for (let j = runStart; j < runStart + run.length; j++) {
        out.push(lines[j]);
      }
    } else {
      // Zero-length run (line broke immediately) — push line and advance
      out.push(lines[i]);
      i++;
    }
  }

  return { result: out.join('\n'), applied };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STAGE RUNNERS — Named groups for pipeline readability (v6.5)
// ═══════════════════════════════════════════════════════════════════════════════

function runStructuralDetection(s: Segment[], t: string[]): Segment[] {
  s = applyStage(s, formatChatStyle, 'Chat Prompt', t);
  s = applyStage(s, formatXMLTags, 'XML Tags', t);
  s = applyStage(s, normalizeAllCapsHeaders, 'Headers', t);
  s = applyStage(s, normalizeKeywordHeaders, 'Headers', t);
  s = applyStage(s, colonLineHeaders, 'Headers', t);
  s = applyStage(s, promoteShortLineBeforeParagraph, 'Headers', t);
  return s;
}

function runParagraphSplitting(s: Segment[], t: string[]): Segment[] {
  s = applyStage(s, splitWallOfText, 'Paragraphs', t);
  return s;
}

function runHeaderPromotion(s: Segment[], t: string[]): Segment[] {
  s = applyStage(s, numberedSectionHeaders, 'Headers', t);
  s = applyStage(s, autoSection, 'Structured', t);
  s = applyStage(s, ensureTitle, 'Title', t);
  s = applyStage(s, titleCaseHeaders, 'Headers', t);
  return s;
}

function runListFormatting(s: Segment[], t: string[]): Segment[] {
  s = applyStage(s, formatSteps, 'Steps', t);
  s = mapProse(s, normalizeBullets);
  s = applyStage(s, splitRunOnLists, 'Lists', t);
  s = applyStage(s, detectUnbulletedLists, 'Lists', t);
  s = applyStage(s, extractEmbeddedLists, 'Lists', t);
  s = applyStage(s, extractSequentialInstructions, 'Lists', t);
  return s;
}

function runInlineFormatting(s: Segment[], t: string[]): Segment[] {
  s = applyStage(s, wrapInlineCode, 'Code', t);
  s = applyStage(s, wrapTechAcronyms, 'Code', t);
  s = applyStage(s, boldAllCapsInProse, 'Emphasis', t);
  s = applyStage(s, boldDefinitionTerms, 'Emphasis', t);
  s = applyStage(s, emphasizeQuotedTerms, 'Emphasis', t);
  return s;
}

function runGrammarCorrection(s: Segment[], t: string[]): Segment[] {
  s = applyStage(s, fixContractions, 'Grammar', t);
  s = applyStage(s, fixPronounI, 'Grammar', t);
  s = applyStage(s, fixRepeatedWords, 'Grammar', t);
  s = applyStage(s, fixSpacing, 'Grammar', t);
  s = applyStage(s, capitalizeSentences, 'Grammar', t);
  s = applyStage(s, fixCommonGrammar, 'Grammar', t);
  return s;
}

function runSemanticFormatting(s: Segment[], t: string[]): Segment[] {
  s = applyStage(s, highlightRoleDefinitions, 'Roles', t);
  s = applyStage(s, highlightConstraints, 'Constraints', t);
  s = applyStage(s, standardizeVariables, 'Variables', t);
  s = applyStage(s, enhanceCallouts, 'Callouts', t);
  s = mapProse(s, formatKeyValues);
  s = mapProse(s, autoLinkURLs);
  s = mapProse(s, normalizeDividers);
  s = mapProse(s, normalizeQuotes);
  return s;
}

function runFinalPolish(s: Segment[], t: string[]): Segment[] {
  s = applyStage(s, ensureSentenceEndings, 'Punctuation', t);
  s = applyStage(s, smartPunctuation, 'Punctuation', t);
  return s;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  POST-PROCESSING — Spacing normalization & deduplication (extracted v6.5)
// ═══════════════════════════════════════════════════════════════════════════════

function postProcessSpacing(text: string): string {
  let out = text.trim();
  out = out.replace(/\n{3,}/g, '\n\n');

  // Ensure blank line before/after headers
  out = out.replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2');
  out = out.replace(/(#{1,6}\s.+)\n([^\n#>*\-])/g, '$1\n\n$2');

  // Ensure blank line before bullet lists
  out = out.replace(/([^\n])\n(- )/g, (match, before: string) => {
    if (/^-\s/.test(before.trim())) return match;
    return before + '\n\n- ';
  });

  // Ensure blank line before numbered lists
  out = out.replace(/([^\n])\n(\d+\.\s)/g, (match, before: string, num: string) => {
    if (/^\d+\.\s/.test(before.trim())) return match;
    return before + '\n\n' + num;
  });

  // Ensure blank line before blockquotes
  out = out.replace(/([^\n])\n(> )/g, (match, before: string) => {
    if (/^>\s/.test(before.trim())) return match;
    return before + '\n\n> ';
  });

  // Deduplicate consecutive identical headers
  out = deduplicateConsecutiveHeaders(out);

  // Final triple-newline collapse
  out = out.replace(/\n{3,}/g, '\n\n');

  return out;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CORE PIPELINE — Stages 2–11 + post-process (extracted for idempotency)
// ═══════════════════════════════════════════════════════════════════════════════

function runCorePipeline(text: string, transforms: string[]): string {
  let segments = segmentDocument(text);

  // Stage 2: Structural detection
  segments = runStructuralDetection(segments, transforms);
  // Stage 3: Paragraph splitting
  segments = runParagraphSplitting(segments, transforms);
  // Stages 4–5: Header promotion & auto-section
  segments = runHeaderPromotion(segments, transforms);
  // Stages 6–7: List formatting
  segments = runListFormatting(segments, transforms);
  // Stage 8: Inline formatting
  segments = runInlineFormatting(segments, transforms);
  // Stage 9: Grammar correction
  segments = runGrammarCorrection(segments, transforms);
  // Stage 10: Semantic formatting
  segments = runSemanticFormatting(segments, transforms);
  // Stage 11: Final polish
  segments = runFinalPolish(segments, transforms);

  // Reassemble & post-process spacing
  return postProcessSpacing(reassemble(segments));
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN FORMATTER — Entry point with idempotency stabilization (v6.5)
// ═══════════════════════════════════════════════════════════════════════════════

export const smartFormatPrompt = (text: string, customRules: CustomRule[] = []) => {
  const transforms: string[] = [];
  let formatted = text;

  // ── Pre-process: Custom Rules ─────────────────────────────────────────
  if (customRules.length) {
    customRules.filter(r => r.active).forEach(rule => {
      try {
        const regex = new RegExp(rule.pattern, 'gm');
        const rep = formatted.replace(regex, rule.replacement);
        if (rep !== formatted) { formatted = rep; transforms.push('Custom Rules'); }
      } catch (e) { console.error(`Invalid regex in custom rule "${rule.name}":`, e); }
    });
  }

  // ── Stage 0: Normalize whitespace ─────────────────────────────────────
  formatted = normalize(formatted);

  // ── Stage 1: Early-exit format detection ──────────────────────────────
  const json = tryFormatJSON(formatted);
  if (json) return { formatted: json.result, formatType: json.label };
  const yaml = tryPreserveYAML(formatted);
  if (yaml) { formatted = yaml.result; transforms.push(yaml.label); }
  const code = tryDetectCode(formatted);
  if (code) return { formatted: code.result, formatType: code.label };
  const table = tryDetectTable(formatted);
  if (table) return { formatted: table.result, formatType: table.label };

  // ── Core Pipeline (Stages 2–11 + post-process) ────────────────────────
  const pass1 = runCorePipeline(formatted, transforms);

  // ── Idempotency Stabilization ─────────────────────────────────────────
  // Run the pipeline a second time on the first pass's output.
  // If the result differs, use the stabilized (second) pass — it will be
  // closer to a fixpoint. This catches cascading stage interactions
  // (e.g., Stage 5 creates headers that Stage 8 then modifies).
  const stabilizeTransforms: string[] = [];
  const pass2 = runCorePipeline(pass1, stabilizeTransforms);

  if (pass1 !== pass2) {
    // Output was not idempotent — use the stabilized version
    console.log('[prompt-formatter] Idempotency stabilization applied (pass1 !== pass2)');
    formatted = pass2;
  } else {
    formatted = pass1;
  }

  // ── Build format type label ───────────────────────────────────────────
  const unique = [...new Set(transforms)];
  const formatType = unique.length > 0
    ? unique.length <= 3 ? unique.join(' + ') : `${unique.slice(0, 2).join(' + ')} +${unique.length - 2} more`
    : 'Standard';

  return { formatted, formatType };
};