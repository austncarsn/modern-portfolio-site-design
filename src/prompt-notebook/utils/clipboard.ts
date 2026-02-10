/**
 * Clipboard Utilities — Shared across components
 * 
 * Provides both a React hook and a standalone function
 * for copying text to the clipboard with fallback support.
 */

import { useState, useCallback } from 'react';

const COPY_FEEDBACK_DURATION = 2000;

/**
 * Copy text to clipboard with fallback for restrictive environments.
 * Tries the modern Clipboard API first, then falls back to execCommand.
 */
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

/**
 * React hook that wraps copyToClipboard with a transient `copied` flag.
 * 
 * @example
 * const [copied, doCopy] = useCopyToClipboard();
 * <button onClick={() => doCopy(text)}>{copied ? 'Copied!' : 'Copy'}</button>
 */
export function useCopyToClipboard(): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false);

  const doCopy = useCallback((text: string) => {
    copyToClipboard(text).then((ok) => {
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION);
      }
    });
  }, []);

  return [copied, doCopy];
}

/**
 * Export text as a downloadable .md file.
 * Creates a temporary link, clicks it, then cleans up after a delay.
 * Falls back to opening content in a new tab if download is blocked.
 */
export function exportMarkdownFile(content: string, filenamePrefix = 'prompt'): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filenamePrefix}-${Date.now()}.md`;
  a.style.display = 'none';
  document.body.appendChild(a);

  try {
    a.click();
  } catch {
    // Fallback: open as plain text in a new tab so the user can save manually
    window.open(url, '_blank');
  }

  // Delay cleanup so the browser has time to initiate the download
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}