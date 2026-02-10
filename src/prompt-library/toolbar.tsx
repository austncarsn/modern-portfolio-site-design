import React, { memo, useRef, useState, useEffect } from "react";
import { Search, X, Heart, LayoutGrid, Blocks, Component, MousePointerClick, Database, PenTool, BrainCircuit, Cable, Wand2, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { categories } from "./prompt-data";
import { getCategoryColor } from "./category-colors";

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeCategory: string;
  onCategoryChange: (key: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
  resultCount: number;
  totalCount: number;
  searchRef: React.RefObject<HTMLInputElement | null>;
}

const categoryIcons: Record<string, LucideIcon> = {
  all: LayoutGrid, foundation: Blocks, components: Component, interactions: MousePointerClick,
  data: Database, design: PenTool, "ai-patterns": BrainCircuit, integration: Cable, advanced: Wand2,
};

const CategoryChip = memo(({ catKey, label, isActive, onClick }: { catKey: string; label: string; isActive: boolean; onClick: () => void }) => {
  const Icon = categoryIcons[catKey] || LayoutGrid;
  const colors = catKey === "all" ? null : getCategoryColor(catKey);
  return (
    <button onClick={onClick}
      className="relative flex items-center gap-1.5 sm:gap-2 px-3 py-2.5 sm:py-2 text-[11px] sm:text-xs tracking-[0.12em] uppercase transition-all duration-300 whitespace-nowrap select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
      style={{ fontFamily: "var(--font-body)" }}
      aria-pressed={isActive}
    >
      {isActive && <motion.div layoutId="activeChipBg" className="absolute inset-0 bg-foreground/[0.06] border border-foreground/10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
      {colors && <span className="relative w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform duration-300" style={{ backgroundColor: isActive ? colors.accent : `${colors.accent}60`, transform: isActive ? "scale(1.3)" : "scale(1)" }} />}
      <Icon className={`relative w-3.5 h-3.5 flex-shrink-0 transition-colors duration-300 ${isActive ? "text-foreground" : "text-muted-foreground/60"}`} strokeWidth={isActive ? 2 : 1.5} />
      <span className={`relative transition-colors duration-300 ${isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"} ${isActive ? "" : "hidden sm:inline"}`}>{label}</span>
    </button>
  );
});
CategoryChip.displayName = "CategoryChip";

const SearchField = memo(({ value, onChange, inputRef }: { value: string; onChange: (v: string) => void; inputRef: React.RefObject<HTMLInputElement | null> }) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleContainerClick = (e: React.MouseEvent) => { if ((e.target as HTMLElement).closest("button")) return; inputRef.current?.focus(); };
  return (
    <div onClick={handleContainerClick}
      className={`relative flex items-center gap-2 border transition-all duration-300 bg-background/60 cursor-text ${isFocused ? "border-foreground/20 shadow-[0_0_0_3px_rgba(0,0,0,0.04)]" : "border-border hover:border-foreground/10"}`}
    >
      <Search className={`absolute left-3 w-4 h-4 transition-colors duration-200 ${isFocused ? "text-foreground" : "text-muted-foreground/50"}`} strokeWidth={1.5} />
      <input ref={inputRef} type="text" value={value} onChange={(e) => onChange(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
        placeholder="Search prompts..." className="w-full md:w-56 bg-transparent py-3 sm:py-2.5 pl-10 pr-16 text-base sm:text-sm font-light focus:outline-none text-foreground placeholder:text-muted-foreground/40"
        style={{ fontFamily: "var(--font-body)" }}
        autoComplete="off" autoCorrect="off" spellCheck={false}
      />
      <div className="absolute right-3 flex items-center gap-2">
        <AnimatePresence mode="wait">
          {value ? (
            <motion.button key="clear" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }}
              onClick={() => onChange("")} className="p-1.5 -mr-1.5 text-muted-foreground hover:text-foreground transition-colors" aria-label="Clear search"
            ><X className="w-4 h-4" strokeWidth={2} /></motion.button>
          ) : (
            <motion.kbd key="shortcut" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/50 border border-border bg-secondary/50 select-none"
            >Cmd+K</motion.kbd>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
SearchField.displayName = "SearchField";

export const Toolbar = memo(function Toolbar({
  searchQuery, onSearchChange, activeCategory, onCategoryChange, showFavoritesOnly, onToggleFavorites, favoritesCount, resultCount, totalCount, searchRef,
}: ToolbarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    document.fonts?.ready?.then(checkScroll);
    return () => { el.removeEventListener("scroll", checkScroll); window.removeEventListener("resize", checkScroll); };
  }, []);

  const isFiltering = searchQuery || activeCategory !== "all" || showFavoritesOnly;

  return (
    <div className="sticky top-0 z-40 -mx-4 sm:-mx-6 mb-12 sm:mb-16">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-card/88 backdrop-blur-lg border-b border-border relative overflow-hidden" style={{ transform: "translateZ(0)" }}
      >
        <div className="absolute left-0 top-0 w-full h-[2px]" style={{ background: "linear-gradient(90deg, #5A8A7A 0%, #5A7A8A 25%, #B07A4E 50%, #8A6070 75%, #7A6A80 100%)" }} />
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 flex items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-0"><SearchField value={searchQuery} onChange={onSearchChange} inputRef={searchRef} /></div>
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            <span className="text-[11px] tracking-[0.12em] tabular-nums whitespace-nowrap" style={{ fontFamily: "var(--font-body)", color: "#5A7A8A" }}>{resultCount}<span className="text-muted-foreground/35">/{totalCount}</span></span>
            <div className="w-px h-4 bg-border hidden sm:block" />
            <button onClick={onToggleFavorites}
              className={`flex items-center gap-1.5 sm:gap-2 p-2.5 sm:px-3 sm:py-2 text-xs uppercase tracking-wider border transition-all duration-300 select-none active:scale-95 ${showFavoritesOnly ? "bg-foreground/[0.06] border-foreground/10 text-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground"}`}
              aria-pressed={showFavoritesOnly}
            >
              <Heart className={`w-4 h-4 sm:w-3.5 sm:h-3.5 transition-all duration-300 ${showFavoritesOnly ? "fill-foreground text-foreground scale-110" : ""}`} strokeWidth={1.5} />
              <span className="hidden sm:inline">Saved</span>
              {favoritesCount > 0 && <span className={`text-[10px] font-mono px-1 sm:px-1.5 py-0.5 transition-colors ${showFavoritesOnly ? "bg-foreground/10 text-foreground" : "bg-secondary text-muted-foreground"}`}>{favoritesCount}</span>}
            </button>
            <AnimatePresence>
              {isFiltering && (
                <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}
                  onClick={() => { onSearchChange(""); onCategoryChange("all"); if (showFavoritesOnly) onToggleFavorites(); }}
                  className="p-2.5 sm:px-2.5 sm:py-2 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors active:scale-95 flex items-center gap-1.5"
                ><X className="w-4 h-4 sm:w-3 sm:h-3" strokeWidth={2} /><span className="hidden md:inline">Clear</span></motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="relative">
          {canScrollLeft && <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-r from-background/80 to-transparent z-10 pointer-events-none" />}
          {canScrollRight && <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-l from-background/80 to-transparent z-10 pointer-events-none" />}
          <div ref={scrollContainerRef} className="flex items-center gap-0.5 sm:gap-1 px-3 sm:px-4 pb-2.5 sm:pb-3 overflow-x-auto no-scrollbar"
            style={{ WebkitOverflowScrolling: "touch", scrollSnapType: "x proximity" }}
          >
            {categories.map((cat) => (
              <div key={cat.key} style={{ scrollSnapAlign: "start" }}>
                <CategoryChip catKey={cat.key} label={cat.label} isActive={activeCategory === cat.key} onClick={() => onCategoryChange(cat.key)} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
});
