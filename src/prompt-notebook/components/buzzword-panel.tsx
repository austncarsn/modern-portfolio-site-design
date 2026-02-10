import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { BUZZWORD_ALTERNATIVES } from '../utils/buzzwords';

interface BuzzwordMatch {
  word: string;
  index: number;
  alternatives: string[];
}

interface BuzzwordPanelProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onReplace: (index: number, length: number, replacement: string) => void;
  onJumpTo: (index: number) => void;
}

// Derived term list from the shared alternatives map
const ALTERNATIVE_TERMS = Object.keys(BUZZWORD_ALTERNATIVES);

export const BuzzwordPanel = ({ isOpen, onClose, content, onReplace, onJumpTo }: BuzzwordPanelProps) => {

  // Find all buzzwords in content
  const findBuzzwords = (): BuzzwordMatch[] => {
    const matches: BuzzwordMatch[] = [];
    
    ALTERNATIVE_TERMS.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      let match;
      while ((match = regex.exec(content)) !== null) {
        matches.push({
          word: match[0],
          index: match.index,
          alternatives: BUZZWORD_ALTERNATIVES[term.toLowerCase()] || ['[no suggestions]']
        });
      }
    });

    // Sort by index
    return matches.sort((a, b) => a.index - b.index);
  };

  const buzzwords = findBuzzwords();

  const getContext = (index: number, word: string) => {
    const start = Math.max(0, index - 30);
    const end = Math.min(content.length, index + word.length + 30);
    const before = content.substring(start, index);
    const after = content.substring(index + word.length, end);
    
    return {
      before: start > 0 ? '...' + before : before,
      after: end < content.length ? after + '...' : after
    };
  };

  const handleReplace = (match: BuzzwordMatch, alternative: string) => {
    onReplace(match.index, match.word.length, alternative);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="contents">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[500px] shadow-2xl z-50 flex flex-col border-l transition-colors duration-300"
            style={{
              backgroundColor: 'var(--os-surface-elevated)',
              borderColor: 'var(--os-border)',
            }}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b" style={{ borderColor: 'var(--os-border)', background: 'linear-gradient(135deg, color-mix(in srgb, var(--os-surface) 80%, #f59e0b 20%), var(--os-surface-elevated))' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-full dark:bg-amber-500/20">
                    <AlertCircle size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight" style={{ color: 'var(--os-text)' }}>
                      Buzzword Detector
                    </h2>
                    <p className="text-xs font-mono" style={{ color: 'var(--os-text-secondary)' }}>
                      {buzzwords.length} {buzzwords.length === 1 ? 'term' : 'terms'} found
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--os-text-secondary)' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {buzzwords.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="p-4 bg-green-100 rounded-full mb-4 dark:bg-emerald-500/20">
                    <Lightbulb size={32} className="text-green-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--os-text)' }}>
                    All Clear!
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--os-text-secondary)' }}>
                    No corporate buzzwords detected.<br />
                    Your writing is crisp and human.
                  </p>
                </div>
              ) : (
                buzzwords.map((match, idx) => {
                  const context = getContext(match.index, match.word);
                  
                  return (
                    <motion.div
                      key={`${match.word}-${match.index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="rounded-lg border overflow-hidden hover:border-amber-300 transition-all"
                      style={{
                        backgroundColor: 'var(--os-surface-muted)',
                        borderColor: 'var(--os-border)',
                      }}
                    >
                      {/* Context Preview */}
                      <div className="p-4 border-b" style={{ backgroundColor: 'var(--os-surface-elevated)', borderColor: 'var(--os-border)' }}>
                        <p className="text-sm leading-relaxed font-mono" style={{ color: 'var(--os-text-secondary)' }}>
                          {context.before}
                          <span className="bg-amber-200 text-amber-900 px-1 py-0.5 rounded font-semibold dark:bg-amber-500/30 dark:text-amber-300">
                            {match.word}
                          </span>
                          {context.after}
                        </p>
                      </div>

                      {/* Alternatives */}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb size={14} className="text-amber-600 dark:text-amber-400" />
                          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--os-text-secondary)' }}>
                            Try Instead:
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {match.alternatives.map((alt, altIdx) => (
                            <button
                              key={altIdx}
                              onClick={() => handleReplace(match, alt)}
                              className="group px-3 py-1.5 border rounded-full text-xs font-medium transition-all flex items-center gap-1.5"
                              style={{
                                backgroundColor: 'var(--os-surface-elevated)',
                                borderColor: 'var(--os-border)',
                                color: 'var(--os-text)',
                              }}
                            >
                              <span>{alt}</span>
                              <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>

                        {/* Jump to Location */}
                        <button
                          onClick={() => {
                            onJumpTo(match.index);
                            onClose();
                          }}
                          className="mt-3 w-full px-3 py-2 bg-amber-50 text-amber-800 rounded text-xs font-semibold hover:bg-amber-100 transition-colors flex items-center justify-center gap-2 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20"
                        >
                          <span>Jump to Location</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer Tip */}
            {buzzwords.length > 0 && (
              <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-muted)' }}>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--os-text-secondary)' }}>
                  <strong>Pro Tip:</strong> Replace buzzwords with specific, concrete language. 
                  Instead of "leverage our robust solution," try "use our reliable tool."
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
