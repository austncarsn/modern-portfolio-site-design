import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Save, PanelLeftClose, PanelLeft, Command, List } from 'lucide-react';
import { toast, Toaster } from 'sonner';

// Components
import { Layout, AnimatedButton as Button, ThemeToggle } from './components/shared-ui';
import { RichTextEditor } from './components/rich-text-editor';
import { CaseStudyPage } from './components/CaseStudyPage';
import { BuzzwordPanel } from './components/buzzword-panel';
import { FileSystem } from './components/file-system';
import { CommandPalette } from './components/command-palette';
import { DocumentOutline } from './components/document-outline';
import { KeyboardShortcutsOverlay } from './components/keyboard-shortcuts-overlay';

// Utils
import { fetchPrompts, savePromptsToBackend, fetchCustomRules, saveCustomRulesToBackend, Prompt, exportMarkdownFile } from './utils/helpers';
import { CustomRule, smartFormatPrompt } from './utils/prompt-formatter';
import { useTheme } from './utils/use-theme';

/**
 * Main App Component — Shrimp Notes
 * Orchestrates application state, data fetching, keyboard shortcuts,
 * and high-level layout composition.
 */
function App() {
  const navigate = useNavigate();
  // ── Theme ────────────────────────────────────────────────────────────
  const { theme, toggleTheme, isDark } = useTheme();

  // ── Core State ───────────────────────────────────────────────────────────
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState('');
  const [view, setView] = useState<'editor' | 'casestudy'>('editor');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showBuzzwordPanel, setShowBuzzwordPanel] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  
  // Jump-to support for document outline
  const [jumpToIndex, setJumpToIndex] = useState<number | null>(null);
  
  // Custom Rules (persisted)
  const [customRules, setCustomRules] = useState<CustomRule[]>([]);

  // HUD Metrics Status
  const [status, setStatus] = useState<'idle' | 'typing' | 'syncing' | 'saved'>('idle');
  const typingTimeoutRef = useRef<number | null>(null);

  // Refs for auto-save (avoids stale closures)
  const promptsRef = useRef(prompts);
  const selectedPromptIdRef = useRef(selectedPromptId);
  const currentContentRef = useRef(currentContent);
  useEffect(() => { promptsRef.current = prompts; }, [prompts]);
  useEffect(() => { selectedPromptIdRef.current = selectedPromptId; }, [selectedPromptId]);
  useEffect(() => { currentContentRef.current = currentContent; }, [currentContent]);

  // Derived
  const selectedPrompt = prompts.find(p => p.id === selectedPromptId);
  const documentTitle = selectedPrompt?.title || 'Untitled Note';
  const wordCount = currentContent.split(/\s+/).filter(Boolean).length;

  // ── Shared Prompt Builder (DRY: used by manual save + auto-save) ────
  const buildPrompt = useCallback((content: string, existingId: string | null, existingPrompts: Prompt[]): Prompt => {
    const title = content.split('\n')[0].replace(/^#\s*/, '').substring(0, 40) || 'Untitled';
    const now = Date.now();
    const existing = existingId ? existingPrompts.find(p => p.id === existingId) : undefined;
    return {
      id: existingId || now.toString(),
      title,
      content,
      tags: [],
      color: existing?.color,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };
  }, []);

  // ── Data Fetching ────────────────────────────────────────────────────────

  useEffect(() => {
    fetchPrompts().then(setPrompts).catch(console.error);
    fetchCustomRules().then(setCustomRules).catch(console.error);
  }, []);

  // ── Manual Save ──────────────────────────────────────────────────────────

  const handleSave = useCallback(async () => {
    const newPrompt = buildPrompt(currentContent, selectedPromptId, prompts);
    const updatedPrompts = selectedPromptId 
      ? prompts.map(p => p.id === newPrompt.id ? newPrompt : p)
      : [newPrompt, ...prompts];
      
    setPrompts(updatedPrompts);
    setSelectedPromptId(newPrompt.id);
    setStatus('saved');
    setLastSaved(newPrompt.updatedAt);
    toast.success("Saved");

    try {
      await savePromptsToBackend(updatedPrompts);
    } catch (err) {
      console.error(err);
      toast.error("Sync failed");
    }
  }, [currentContent, selectedPromptId, prompts, buildPrompt]);

  // ── Export ───────────────────────────────────────────────────────────────

  const handleExport = useCallback(() => {
    exportMarkdownFile(currentContent);
    toast.success("Exported");
  }, [currentContent]);

  // ── Magic Format (global) ───────────────────────────────────────────────

  const handleMagicFormat = useCallback(() => {
    if (!currentContent.trim()) return;
    const result = smartFormatPrompt(currentContent);
    if (result.formatted !== currentContent) {
      setCurrentContent(result.formatted);
      toast.success(`Magic Format applied: ${result.formatType}`);
    } else {
      toast('Document already formatted');
    }
  }, [currentContent]);

  // ── Global Keyboard Shortcuts ────────────────────────────────────────────

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // ⌘K — Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
      // ⌘S — Save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // ⌘D — Toggle Dark Mode
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        toggleTheme();
      }
      // ⌘O — Toggle Outline
      if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
        e.preventDefault();
        setShowOutline(prev => !prev);
      }
      // ⌘B — Toggle Sidebar (only when not editing text)
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        const tag = document.activeElement?.tagName;
        if (tag !== 'TEXTAREA' && tag !== 'INPUT') {
          e.preventDefault();
          setSidebarOpen(prev => !prev);
        }
      }
      // ⌘N — New Prompt
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        createNew();
      }
      // ⌘E — Export Markdown
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        handleExport();
      }
      // ⌘H — Show Keyboard Shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleSave, handleExport, toggleTheme]);

  // ── Typing Activity & Auto-save ──────────────────────────────────────────

  const handleTypingActivity = useCallback(() => {
    setStatus('typing');
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = window.setTimeout(() => {
      setStatus('idle');
    }, 1500);
  }, []);

  // Auto-save debounce: persist to backend after 3s of no typing
  const autoSaveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!currentContent.trim()) return;

    if (autoSaveTimeoutRef.current) {
      window.clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = window.setTimeout(async () => {
      const content = currentContentRef.current;
      const curPrompts = promptsRef.current;
      const curSelectedId = selectedPromptIdRef.current;

      const newPrompt = buildPrompt(content, curSelectedId, curPrompts);

      const updatedPrompts = curSelectedId
        ? curPrompts.map(p => p.id === newPrompt.id ? newPrompt : p)
        : [newPrompt, ...curPrompts];

      setPrompts(updatedPrompts);
      if (!curSelectedId) setSelectedPromptId(newPrompt.id);
      setStatus('syncing');

      try {
        await savePromptsToBackend(updatedPrompts);
        setStatus('saved');
        setLastSaved(Date.now());
        setTimeout(() => setStatus('idle'), 2000);
      } catch (err) {
        console.error('Auto-save failed:', err);
        setStatus('idle');
      }
    }, 3000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        window.clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [currentContent, buildPrompt]);

  // ── Mobile Sidebar ──────────────────────────────────────────────────────

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    if (mq.matches) setSidebarOpen(false);
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setSidebarOpen(false);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Open case study from URL hash (deep-link)
  const location = useLocation();
  useEffect(() => {
    if (location.hash === '#case-study') {
      setView('casestudy');
      window.setTimeout(() => {
        const el = document.getElementById('case-study-anchor');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 40);
    }
  }, [location.hash]);

  // ── Prompt Navigation ────────────────────────────────────────────────────

  const loadPrompt = useCallback((id: string) => {
    const prompt = prompts.find(p => p.id === id);
    if (prompt) {
      setSelectedPromptId(id);
      setCurrentContent(prompt.content);
      setView('editor');
      // Auto-close sidebar on mobile after selecting a file
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    }
  }, [prompts]);

  const createNew = useCallback(() => {
    setSelectedPromptId(null);
    setCurrentContent('');
    setView('editor');
  }, []);

  // ── Delete Prompt ───────────────────────────────────────────────────────

  const deletePrompt = useCallback(async (id: string) => {
    const updatedPrompts = prompts.filter(p => p.id !== id);
    setPrompts(updatedPrompts);
    // If deleting the currently selected prompt, clear editor
    if (selectedPromptId === id) {
      setSelectedPromptId(null);
      setCurrentContent('');
    }
    toast.success('Deleted');
    try {
      await savePromptsToBackend(updatedPrompts);
    } catch (err) {
      console.error(err);
      toast.error('Sync failed');
    }
  }, [prompts, selectedPromptId]);

  // ── Color Change ───────────────────────────────────────────────────────

  const handleColorChange = useCallback(async (id: string, color: string | undefined) => {
    const updatedPrompts = prompts.map(p => p.id === id ? { ...p, color } : p);
    setPrompts(updatedPrompts);
    try {
      await savePromptsToBackend(updatedPrompts);
    } catch (err) {
      console.error('Color sync failed:', err);
    }
  }, [prompts]);

  // ── Buzzword Panel Handlers ──────────────────────────────────────────────

  const handleBuzzwordReplace = useCallback((index: number, length: number, replacement: string) => {
    setCurrentContent(prev => {
      const before = prev.substring(0, index);
      const after = prev.substring(index + length);
      return before + replacement + after;
    });
    toast.success(`Replaced with "${replacement}"`);
  }, []);

  const handleBuzzwordJumpTo = useCallback((index: number) => {
    setJumpToIndex(index);
    setView('editor');
  }, []);

  // ── Custom Rules Persistence ─────────────────────────────────────────────

  const handleCustomRulesChange = useCallback(async (rules: CustomRule[]) => {
    setCustomRules(rules);
    try {
      await saveCustomRulesToBackend(rules);
    } catch (err) {
      console.error('Failed to persist custom rules:', err);
    }
  }, []);

  // ── Command Palette Actions ──────────────────────────────────────────────

  const commandActions = useMemo(() => ({
    createNew,
    save: handleSave,
    smartPaste: () => {},
    magicFormat: handleMagicFormat,
    exportMd: handleExport,
    toggleSidebar: () => setSidebarOpen(prev => !prev),
    goToCaseStudy: () => setView('casestudy'),
    toggleDarkMode: toggleTheme,
    toggleOutline: () => setShowOutline(prev => !prev),
    showShortcuts: () => setShowShortcuts(true),
  }), [createNew, handleSave, handleMagicFormat, handleExport, toggleTheme]);

  // ── Outline Jump Handler ─────────────────────────────────────────────────

  const handleOutlineJumpTo = useCallback((index: number, _line: number) => {
    setJumpToIndex(index);
    setView('editor');
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <Layout>
      <Toaster position="top-center" theme={isDark ? 'dark' : 'light'} />
      
      {/* ── Overlays (z-50+) ─────────────────────────────────────────── */}
      <CommandPalette 
        isOpen={showCommandPalette} 
        onClose={() => setShowCommandPalette(false)} 
        actions={commandActions}
        isDark={isDark}
      />

      <BuzzwordPanel 
        isOpen={showBuzzwordPanel}
        onClose={() => setShowBuzzwordPanel(false)}
        content={currentContent}
        onReplace={handleBuzzwordReplace}
        onJumpTo={handleBuzzwordJumpTo}
      />

      <KeyboardShortcutsOverlay
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
      
      {/* ══════════════════════════════════════════════════════════════════
          MAIN LAYOUT: Column(Header → Row(Sidebar | Content | Outline))
          ══════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col h-screen overflow-hidden">
        
        {/* ── HEADER BAR ──────────────────────────────────────────────── */}
        <header
          className="relative flex items-center justify-between h-16 px-4 sm:px-5 backdrop-blur-md z-30 shrink-0 transition-colors duration-300 border-b"
          style={{
            background: isDark
              ? 'linear-gradient(90deg, rgba(10,14,22,0.95) 0%, rgba(13,17,23,0.96) 45%, rgba(16,21,30,0.95) 100%)'
              : 'linear-gradient(90deg, rgba(243,245,248,0.96) 0%, rgba(247,247,242,0.96) 45%, rgba(240,242,246,0.96) 100%)',
            borderColor: 'var(--os-border)',
            ['--pn-header-height' as any]: '4rem',
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--os-sky), var(--os-highlight), transparent)',
              opacity: isDark ? 0.55 : 0.35,
            }}
          />
          
          {/* Left: sidebar toggle + document title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg transition-colors shrink-0"
              style={{
                color: 'var(--os-text-secondary)',
              }}
              title={sidebarOpen ? 'Close sidebar (⌘B)' : 'Open sidebar (⌘B)'}
            >
              {sidebarOpen 
                ? <PanelLeftClose size={18} strokeWidth={1.75} /> 
                : <PanelLeft size={18} strokeWidth={1.75} />
              }
            </motion.button>

            <div className="w-px h-5 shrink-0" style={{ backgroundColor: 'var(--os-border)' }} />
            
            <div className="hidden md:flex flex-col leading-tight select-none">
              <span className="text-[9px] font-bold uppercase tracking-[0.16em]" style={{ color: 'var(--os-text-accent)' }}>
                Shrimp Notes
              </span>
              <span className="text-[8px] font-mono uppercase tracking-[0.14em]" style={{ color: 'var(--os-text-secondary)' }}>
                Austin Carson
              </span>
            </div>

            <div className="flex flex-col min-w-0 max-w-[140px] sm:max-w-none">
              <h1 className="text-[11px] sm:text-[13px] font-bold tracking-tight truncate leading-tight" style={{ color: 'var(--os-text)' }}>
                {documentTitle}
              </h1>
              <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.15em] leading-tight mt-0.5" style={{ color: 'var(--os-sky)' }}>
                {selectedPromptId ? 'Editing Note' : 'New Note'}
              </span>
            </div>
          </div>
          
          {/* Center: navigation tabs (flex-centered to avoid overlap) */}
          <div className="hidden sm:flex flex-1 justify-center">
            <nav className="flex items-center h-full">
              <button 
                onClick={() => setView('editor')}
                className={`relative h-full px-5 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
                  view === 'editor' 
                    ? 'tab-active' 
                    : ''
                }`}
                style={{ color: view === 'editor' ? 'var(--os-text)' : 'var(--os-text-secondary)' }}
              >
                Notebook
              </button>
              <button 
                onClick={() => setView('casestudy')}
                className={`relative h-full px-5 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors ${
                  view === 'casestudy'
                    ? 'tab-active'
                    : ''
                }`}
                style={{ color: view === 'casestudy' ? 'var(--os-text)' : 'var(--os-text-secondary)' }}
              >
                Case Study
              </button>
            </nav>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 shrink-0 flex-1 justify-end">
            {/* Outline toggle (editor only) */}
            {view === 'editor' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowOutline(!showOutline)}
                className="p-2 rounded-lg border transition-all duration-200"
                style={{
                  borderColor: showOutline ? 'var(--os-highlight)' : 'var(--os-border)',
                  color: showOutline ? 'var(--os-text)' : 'var(--os-text-secondary)',
                  backgroundColor: showOutline ? 'var(--os-hover)' : 'transparent',
                }}
                title="Document Outline"
              >
                <List size={14} strokeWidth={2} />
              </motion.button>
            )}

            {/* Dark mode toggle */}
            <ThemeToggle theme={theme} onToggle={toggleTheme} />

            <button 
              onClick={() => setShowCommandPalette(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all text-[10px] font-mono"
              style={{
                borderColor: 'var(--os-border)',
                color: 'var(--os-text-secondary)',
              }}
              title="Command Palette (⌘K)"
            >
              <Command size={11} strokeWidth={2} />
              <span className="font-bold">K</span>
            </button>

            <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--os-border)' }} />

            <Button variant="primary" icon={Save} onClick={handleSave} shortcut="⌘S">
              Save
            </Button>
          </div>

          {/* Header bottom separator */}
          <div className="header-separator absolute bottom-0 left-0 right-0" />
        </header>

        {/* ── CONTENT ROW ─────────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          
          {/* Mobile sidebar backdrop */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-30 bg-black/40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Sidebar */}
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.aside 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 288, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                className="fixed md:relative z-40 md:z-20 shrink-0 overflow-hidden bottom-0 left-0 md:top-auto md:bottom-auto md:left-auto"
                style={{ maxWidth: '85vw', top: 'var(--pn-header-height)' }}
              >
                <div className="w-72 h-full max-w-[85vw]">
                  <FileSystem 
                    files={prompts}
                    selectedFileId={selectedPromptId}
                    onSelect={loadPrompt}
                    onNew={createNew}
                    onDelete={deletePrompt}
                    onColorChange={handleColorChange}
                  />
                </div>
                {/* Sidebar right edge */}
                <div className="sidebar-separator absolute right-0 top-0 bottom-0" />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1 min-w-0 relative overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--os-surface)' }}>
            <AnimatePresence mode="wait">
              {view === 'editor' && (
                <motion.div 
                  key="editor"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="h-full w-full px-3 py-3 lg:px-5 lg:py-4"
                >
                  <div className="h-full w-full">
                    <RichTextEditor 
                      value={currentContent} 
                      onChange={setCurrentContent}
                      onActivity={handleTypingActivity}
                      jumpToIndex={jumpToIndex}
                      onJumpComplete={() => setJumpToIndex(null)}
                      status={status}
                      lastSaved={lastSaved}
                      onBuzzwordClick={() => setShowBuzzwordPanel(true)}
                      customRules={customRules}
                      onCustomRulesChange={handleCustomRulesChange}
                    />
                  </div>
                </motion.div>
              )}

              {view === 'casestudy' && (
                <motion.div
                  key="casestudy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-full overflow-y-auto custom-scrollbar"
                >
                  <CaseStudyPage />
                </motion.div>
              )}

            </AnimatePresence>
          </main>

          {/* Document Outline (right panel, editor only) */}
          {view === 'editor' && (
            <DocumentOutline
              content={currentContent}
              isOpen={showOutline}
              onClose={() => setShowOutline(false)}
              onJumpTo={handleOutlineJumpTo}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default App;
