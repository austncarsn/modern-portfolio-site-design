/**
 * Consolidated utilities: API, Clipboard, Buzzword data
 */
import { useState, useCallback } from 'react';
import { projectId, publicAnonKey } from './supabase/info';
import { CustomRule } from './prompt-formatter';

// ============================================================================
// Types
// ============================================================================

export interface Prompt {
  id: string;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  color?: string;
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// API
// ============================================================================

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-554cbc7a`;
const headers = (extra: Record<string, string> = {}) => ({
  'Authorization': `Bearer ${publicAnonKey}`,
  ...extra,
});

export const fetchPrompts = async (): Promise<Prompt[]> => {
  const response = await fetch(`${API_URL}/prompts`, { headers: headers() });
  if (!response.ok) { const text = await response.text(); console.error('fetchPrompts failed:', text); throw new Error('Failed to fetch prompts'); }
  const data = await response.json();
  return data.prompts || [];
};

export const savePromptsToBackend = async (prompts: Prompt[]) => {
  const response = await fetch(`${API_URL}/prompts`, {
    method: 'POST', headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ prompts })
  });
  if (!response.ok) { const text = await response.text(); console.error('savePrompts failed:', text); throw new Error('Failed to save prompts'); }
  return response.json();
};

export const fetchCustomRules = async (): Promise<CustomRule[]> => {
  try {
    const response = await fetch(`${API_URL}/custom-rules`, { headers: headers() });
    if (!response.ok) { console.error('fetchCustomRules: non-OK status', response.status); return []; }
    const data = await response.json();
    return data.rules || [];
  } catch (err) { console.error('fetchCustomRules error:', err); return []; }
};

export const saveCustomRulesToBackend = async (rules: CustomRule[]) => {
  const response = await fetch(`${API_URL}/custom-rules`, {
    method: 'POST', headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ rules })
  });
  if (!response.ok) { const text = await response.text(); console.error('saveCustomRules failed:', text); throw new Error('Failed to save custom rules'); }
  return response.json();
};

// ============================================================================
// Clipboard
// ============================================================================

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      textarea.style.top = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    } catch (fallbackErr) {
      console.error('Clipboard: all copy methods failed:', fallbackErr);
      return false;
    }
  }
}

export function useCopyToClipboard(): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false);
  const doCopy = useCallback((text: string) => {
    copyToClipboard(text).then((ok) => {
      if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
    });
  }, []);
  return [copied, doCopy];
}

export function exportMarkdownFile(content: string, filenamePrefix = 'prompt'): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filenamePrefix}-${Date.now()}.md`;
  a.style.display = 'none';
  document.body.appendChild(a);
  try { a.click(); } catch { window.open(url, '_blank'); }
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
}

// ============================================================================
// Buzzword Data
// ============================================================================

export const BUZZWORD_ALTERNATIVES: Record<string, string[]> = {
  'leverage': ['use', 'apply', 'take advantage of', 'work with'],
  'leveraging': ['using', 'applying', 'working with'],
  'leveraged': ['used', 'applied', 'worked with'],
  'utilize': ['use', 'apply', 'employ'],
  'utilizes': ['uses', 'applies'],
  'utilizing': ['using', 'applying'],
  'utilization': ['use', 'usage'],
  'seamless': ['smooth', 'easy', 'simple', 'effortless'],
  'seamlessly': ['smoothly', 'easily', 'simply'],
  'cutting-edge': ['modern', 'advanced', 'new', 'latest'],
  'cutting edge': ['modern', 'advanced', 'new', 'latest'],
  'revolutionize': ['transform', 'change', 'improve', 'redesign'],
  'revolutionary': ['transformative', 'new', 'groundbreaking'],
  'revolutionizing': ['transforming', 'changing', 'improving'],
  'unlock': ['enable', 'reveal', 'access', 'discover'],
  'unlocking': ['enabling', 'revealing', 'accessing'],
  'unlocks': ['enables', 'reveals', 'accesses'],
  'empower': ['enable', 'help', 'allow', 'support'],
  'empowering': ['enabling', 'helping', 'supporting'],
  'empowered': ['enabled', 'helped', 'supported'],
  'empowerment': ['enablement', 'support', 'capability'],
  'robust': ['strong', 'reliable', 'solid', 'stable'],
  'robustness': ['strength', 'reliability', 'stability'],
  'synergy': ['cooperation', 'teamwork', 'collaboration'],
  'synergize': ['collaborate', 'work together', 'combine'],
  'synergistic': ['collaborative', 'cooperative', 'combined'],
  'optimize': ['improve', 'enhance', 'refine', 'better'],
  'optimization': ['improvement', 'enhancement'],
  'optimizing': ['improving', 'enhancing', 'refining'],
  'optimized': ['improved', 'enhanced', 'refined'],
  'streamline': ['simplify', 'improve', 'speed up', 'ease'],
  'streamlined': ['simplified', 'improved', 'easier'],
  'streamlining': ['simplifying', 'improving', 'easing'],
  'innovative': ['new', 'creative', 'original', 'fresh'],
  'innovation': ['creativity', 'new idea', 'invention'],
  'innovate': ['create', 'invent', 'improve'],
  'next-generation': ['new', 'modern', 'advanced', 'updated'],
  'next generation': ['new', 'modern', 'advanced', 'updated'],
  'state-of-the-art': ['advanced', 'modern', 'latest', 'best available'],
  'state of the art': ['advanced', 'modern', 'latest', 'best available'],
  'game-changing': ['important', 'transformative', 'significant'],
  'game changer': ['big change', 'major improvement', 'breakthrough'],
  'best-in-class': ['excellent', 'top-quality', 'leading', 'superior'],
  'best in class': ['excellent', 'top-quality', 'leading', 'superior'],
  'world-class': ['excellent', 'outstanding', 'top-tier', 'high-quality'],
  'world class': ['excellent', 'outstanding', 'top-tier', 'high-quality'],
  'industry-leading': ['leading', 'top', 'best', 'pioneering'],
  'industry leading': ['leading', 'top', 'best', 'pioneering'],
  'paradigm shift': ['major change', 'big shift', 'fundamental change'],
  'paradigm-shifting': ['transformative', 'groundbreaking', 'revolutionary'],
  'disruptive': ['innovative', 'game-changing', 'transformative'],
  'disruption': ['change', 'innovation', 'transformation'],
  'disrupt': ['change', 'challenge', 'transform'],
  'transformative': ['significant', 'important', 'life-changing'],
  'transform': ['change', 'improve', 'convert', 'reshape'],
  'transformation': ['change', 'shift', 'evolution'],
  'holistic': ['complete', 'comprehensive', 'whole', 'full'],
  'holistically': ['completely', 'fully', 'entirely'],
  'comprehensive': ['complete', 'thorough', 'full', 'detailed'],
  'strategic': ['planned', 'deliberate', 'intentional', 'thoughtful'],
  'strategically': ['deliberately', 'intentionally', 'carefully'],
  'mission-critical': ['essential', 'vital', 'crucial', 'necessary'],
  'mission critical': ['essential', 'vital', 'crucial', 'necessary'],
  'actionable': ['practical', 'useful', 'concrete', 'specific'],
  'actionability': ['usefulness', 'practicality'],
  'scalable': ['expandable', 'flexible', 'adaptable', 'growing'],
  'scalability': ['flexibility', 'adaptability', 'growth potential'],
  'scale': ['grow', 'expand', 'increase'],
  'agile': ['flexible', 'adaptable', 'quick', 'responsive'],
  'agility': ['flexibility', 'adaptability', 'speed'],
  'dynamic': ['active', 'changing', 'flexible', 'responsive'],
  'dynamically': ['actively', 'flexibly', 'responsively'],
  'proactive': ['forward-thinking', 'preventive', 'anticipatory'],
  'proactively': ['in advance', 'ahead of time', 'preventively'],
  'end-to-end': ['complete', 'full', 'comprehensive'],
  'end to end': ['complete', 'full', 'comprehensive'],
  'turnkey': ['ready-made', 'complete', 'ready to use'],
  'turn-key': ['ready-made', 'complete', 'ready to use'],
  'bleeding-edge': ['very new', 'experimental', 'latest'],
  'bleeding edge': ['very new', 'experimental', 'latest'],
  'deep dive': ['detailed analysis', 'thorough look', 'close examination'],
  'deep-dive': ['detailed analysis', 'thorough look', 'close examination'],
  'circle back': ['follow up', 'return to', 'revisit', 'get back to'],
  'touch base': ['check in', 'talk', 'connect', 'follow up'],
  'move the needle': ['make progress', 'improve', 'make a difference'],
  'low-hanging fruit': ['easy wins', 'quick wins', 'easy opportunities'],
  'think outside the box': ['be creative', 'think differently', 'innovate'],
};

export const GENERIC_TERMS: string[] = [
  ...Object.keys(BUZZWORD_ALTERNATIVES),
  'next-gen', 'ai-powered', 'ai powered', 'ml-driven', 'unlock the power',
  'synergies', 'innovating', 'gamechanger', 'market-leading', 'new paradigm',
  'disrupting', 'transforming', '360-degree', '360 degree', 'strategic alignment',
  'business-critical', 'actionable insights', 'at scale', 'e2e', 'out-of-the-box',
  'loop back', 'reach out', 'moving the needle', 'take it offline', 'take this offline',
  'boil the ocean', 'drink the kool-aid', 'bandwidth', 'no bandwidth', 'pivot',
  'pivoting', 'double-click', 'double click on that', 'unpack', 'let me unpack',
  'net-net', 'net net', 'learnings', 'key learnings', 'value-add', 'value add',
  'added value', 'ecosystem', 'digital ecosystem', 'omnichannel', 'omni-channel',
  'customer-centric', 'user-centric', 'data-driven', 'insight-driven',
  'future-proof', 'future proof',
];
