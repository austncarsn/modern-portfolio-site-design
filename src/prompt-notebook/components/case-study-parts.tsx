import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowDown,
  CheckCheck,
  CheckCircle,
  ChevronDown,
  Circle,
  Copy,
  Flag,
  Minus,
  Quote,
  RefreshCw,
  Terminal,
  TrendingUp,
  User,
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring, useInView } from 'motion/react';
import { PALETTE } from '../utils/use-theme';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  number?: string;
  subtitle?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export interface MetricCardProps {
  value: string;
  label: string;
  sub?: string;
  icon?: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
  number?: string;
  icon?: React.ElementType;
}

export interface FeatureItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
}

export interface TimelineItemProps {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  index: number;
  icon?: React.ElementType;
  status?: 'planned' | 'in-progress' | 'completed';
}

export interface CardHeaderProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  className?: string;
}

export interface ArchitectureLayerProps {
  title: string;
  icon: React.ElementType;
  items: Array<{
    name: string;
    desc: string;
    icon: React.ElementType;
  }>;
}

// ============================================================================
// Case Study Meta
// ============================================================================

export const CASE_STUDY_META = {
  title: 'Shrimp Notes',
  subtitle: 'A Prompt Engineering Notebook',
  role: 'Design Engineer + Client Advisor',
  stack: ['React 18', 'TypeScript', 'Supabase', 'Tailwind v4', 'Motion', 'Hono'],
  timeline: 'Q4 2025 — Present',
  tags: ['Markdown Editor', 'Split-View Preview', 'Command Palette', 'Smart Paste', 'Dark Mode', 'Document Outline', 'CSS Variables'],
  version: '2.2',
  stats: {
    linesOfCode: '16,800+',
    components: '19',
    shortcuts: '12',
    formatFunctions: '58',
  },
  deliverables: [
    'Design System (--os-* token architecture)',
    'UI Engineering (19 components, 23+ MD renderers)',
    'Smart Paste Engine (v6.3, 58 functions)',
    'Keyboard-First UX (12 global shortcuts)',
    'Backend & Persistence (Supabase KV + Hono)',
    'Advisory & Architecture Documentation',
  ],
};

// Re-export PALETTE for convenience
export { PALETTE };

// ============================================================================
// Utility Components
// ============================================================================

export const AnimatedNumber: React.FC<{ value: string; delay?: number }> = ({
  value,
  delay = 0,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="inline-block"
    >
      {value}
    </motion.span>
  );
};

export const ScrollProgress: React.FC<{ containerRef: React.RefObject<HTMLDivElement | null> }> = ({ containerRef }) => {
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{ scaleX }}
      className="sticky top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#334E68] via-[var(--os-sky)] to-[var(--os-highlight)] origin-left z-50"
    />
  );
};

export const FloatingNav: React.FC<{ sections: string[]; containerRef: React.RefObject<HTMLDivElement | null> }> = ({ sections, containerRef }) => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const triggerPoint = containerRect.top + containerRect.height / 3;

      let active = 0;
      sections.forEach((_, i) => {
        const el = document.getElementById(`section-${String(i + 1).padStart(2, '0')}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerPoint) {
            active = i;
          }
        }
      });
      setActiveSection(active);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [sections, containerRef]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3"
    >
      {sections.map((section, i) => (
        <button
          key={i}
          onClick={() => {
            document.getElementById(`section-${String(i + 1).padStart(2, '0')}`)?.scrollIntoView({
              behavior: 'smooth',
            });
          }}
          className="group flex items-center gap-3"
        >
          <span
            className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
              activeSection === i
                ? 'text-[var(--os-navy)] translate-x-0 opacity-100'
                : 'text-transparent translate-x-2 opacity-0 group-hover:text-[var(--os-highlight)] group-hover:translate-x-0 group-hover:opacity-100'
            }`}
          >
            {section}
          </span>
          <div
            className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
              activeSection === i
                ? 'bg-[var(--os-navy)] border-[var(--os-navy)] scale-100'
                : 'bg-transparent border-[var(--os-border)] scale-75 group-hover:border-[var(--os-highlight)] group-hover:scale-100'
            }`}
          />
        </button>
      ))}
    </motion.div>
  );
};

// ============================================================================
// Styled Components
// ============================================================================

export const TechTag: React.FC<{ children: React.ReactNode; icon?: React.ElementType }> = ({
  children,
  icon: Icon,
}) => (
  <motion.span
    whileHover={{ scale: 1.05, y: -2 }}
    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--os-surface-elevated)] text-[var(--os-navy)] text-[11px] font-bold uppercase tracking-[0.1em] rounded-xl border border-[var(--os-border)] font-mono hover:bg-[var(--os-hover)] hover:border-[var(--os-highlight)] hover:shadow-md transition-all duration-300 leading-none cursor-default"
  >
    {Icon && <Icon size={12} strokeWidth={2.5} />}
    {children}
  </motion.span>
);

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = '',
  number,
  subtitle,
}) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={ref}
      id={number ? `section-${number.replace('.', '')}` : undefined}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`max-w-6xl mx-auto ${className}`}
    >
      <div className="relative mb-16">
        {/* Decorative Background Element */}
        {number && (
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-[120px] font-black text-[var(--os-watermark)] leading-none pointer-events-none select-none font-mono">
            {number}
          </div>
        )}

        <div className="relative flex items-start gap-6">
          {/* Number Badge */}
          {number && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={isInView ? { scale: 1, rotate: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
              className="relative shrink-0"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#334E68] to-[var(--os-accent-deep)] flex items-center justify-center shadow-lg">
                <span className="text-white font-mono text-lg font-bold">{number}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--os-highlight)] rounded-full" />
            </motion.div>
          )}

          {/* Title Content */}
          <div className="flex-1 pt-2">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-3xl md:text-4xl font-light text-[var(--os-text)] tracking-tight leading-tight"
            >
              {title.split(' ').map((word, i) => (
                <span key={i}>
                  {i === title.split(' ').length - 1 ? (
                    <span className="font-semibold text-[var(--os-navy)]">{word}</span>
                  ) : (
                    word + ' '
                  )}
                </span>
              ))}
            </motion.h2>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-3 text-sm text-[var(--os-text-secondary)] max-w-xl"
              >
                {subtitle}
              </motion.p>
            )}

            {/* Decorative Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 flex items-center gap-3 origin-left"
            >
              <div className="h-1 w-16 bg-gradient-to-r from-[#334E68] to-[var(--os-sky)] rounded-full" />
              <div className="h-1 w-8 bg-gradient-to-r from-[var(--os-sky)] to-[var(--os-highlight)] rounded-full" />
              <div className="h-1 w-4 bg-[var(--os-highlight)] rounded-full" />
            </motion.div>
          </div>
        </div>
      </div>
      {children}
    </motion.section>
  );
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  gradient = false,
}) => (
  <motion.div
    whileHover={hover ? { y: -4, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)' } : undefined}
    className={`
      relative overflow-hidden rounded-2xl border transition-all duration-500
      ${gradient
        ? 'bg-gradient-to-br from-[var(--os-surface-elevated)] via-[var(--os-surface-soft)] to-[var(--os-surface)] border-[var(--os-border)]'
        : 'bg-[var(--os-surface-elevated)] border-[var(--os-border)]'}
      ${hover ? 'hover:border-[var(--os-highlight)]' : ''}
      ${className}
    `}
  >
    {/* Subtle gradient overlay on hover */}
    {hover && (
      <div className="absolute inset-0 bg-gradient-to-br from-[#EBF5FB]/0 to-[#EBF5FB]/0 hover:from-[#EBF5FB]/20 hover:to-transparent transition-all duration-500 pointer-events-none" />
    )}
    <div className="relative p-8">{children}</div>
  </motion.div>
);

export const CardHeader: React.FC<CardHeaderProps> = ({ icon: Icon, title, subtitle, className = 'mb-8' }) => (
  <div className={`flex items-center gap-3 ${className} pb-4 border-b border-[var(--os-border)]`}>
    <div className="p-2 bg-gradient-to-br from-[var(--os-hover)] to-[var(--os-hover-accent)] rounded-lg">
      <Icon size={16} className="text-[var(--os-navy)]" />
    </div>
    <div>
      <h3 className="text-sm font-bold text-[var(--os-text)]">{title}</h3>
      {subtitle && <p className="text-[10px] text-[var(--os-text-faint)]">{subtitle}</p>}
    </div>
  </div>
);

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  sub,
  icon: Icon,
  trend,
  trendValue,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12)' }}
      className="relative bg-[var(--os-surface-elevated)] rounded-2xl border border-[var(--os-border)] overflow-hidden group"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <pattern id={`grid-${label}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.5" fill="currentColor" />
          </pattern>
          <rect width="100" height="100" fill={`url(#grid-${label})`} />
        </svg>
      </div>

      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#334E68] via-[var(--os-sky)] to-[var(--os-highlight)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-8 flex flex-col items-center text-center">
        {/* Icon */}
        {Icon && (
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
            className="relative mb-6"
          >
            <div className="p-4 bg-gradient-to-br from-[var(--os-hover)] to-[var(--os-hover-accent)] rounded-2xl group-hover:from-[var(--os-hover-accent)] group-hover:to-[var(--os-accent-mist)] transition-all duration-500 shadow-sm">
              <Icon size={28} className="text-[var(--os-navy)]" strokeWidth={1.5} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[var(--os-sky)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        )}

        {/* Value */}
        <div className="relative mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl font-bold text-[var(--os-text)] tracking-tight font-mono"
          >
            {value}
          </motion.div>

          {/* Trend Indicator */}
          {trend && trendValue && (
            <div
              className={`absolute -right-8 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold ${
                trend === 'up'
                  ? 'text-emerald-600'
                  : trend === 'down'
                  ? 'text-red-500'
                  : 'text-[var(--os-text-secondary)]'
              }`}
            >
              {trend === 'up' ? (
                <TrendingUp size={14} />
              ) : trend === 'down' ? (
                <ArrowDown size={14} />
              ) : (
                <Minus size={14} />
              )}
              {trendValue}
            </div>
          )}
        </div>

        {/* Label */}
        <div className="text-xs font-bold text-[var(--os-text-secondary)] uppercase tracking-[0.2em] mb-2">
          {label}
        </div>

        {/* Sub text */}
        {sub && (
          <div className="text-[11px] text-[var(--os-text-faint)] font-mono max-w-[200px] leading-relaxed">
            {sub}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const Collapsible: React.FC<CollapsibleProps> = ({
  title,
  children,
  isOpen: defaultOpen = false,
  number,
  icon: Icon,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-[var(--os-border)] rounded-2xl overflow-hidden bg-[var(--os-surface-elevated)] mb-4 last:mb-0 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 px-8 hover:bg-gradient-to-r hover:from-[var(--os-surface-soft)] hover:to-transparent transition-all text-left group"
      >
        <div className="flex items-center gap-4 flex-1">
          {number && (
            <span className="font-mono text-[var(--os-text-accent)] font-bold text-sm bg-[var(--os-hover)] px-3 py-1.5 rounded-lg group-hover:bg-[var(--os-hover-accent)] transition-colors">
              {number}
            </span>
          )}
          {Icon && (
            <div className="p-2 bg-[var(--os-surface-muted)] rounded-lg group-hover:bg-[var(--os-hover)] transition-colors">
              <Icon size={16} className="text-[var(--os-navy)]" />
            </div>
          )}
          <span className="font-semibold text-[var(--os-text)] text-base tracking-tight group-hover:text-[var(--os-navy)] transition-colors">
            {title}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="p-2 bg-[var(--os-surface-muted)] rounded-full group-hover:bg-[var(--os-hover)] transition-colors"
        >
          <ChevronDown size={18} className="text-[var(--os-text-secondary)] group-hover:text-[var(--os-navy)] transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 text-[var(--os-text-dim)] leading-relaxed border-t border-[var(--os-surface-muted)]">
              <div className="pt-6">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const FeatureItem: React.FC<FeatureItemProps> = ({ icon: Icon, title, description, badge }) => (
  <motion.div
    whileHover={{ x: 4 }}
    className="flex items-start gap-4 group p-4 -mx-4 rounded-xl hover:bg-[var(--os-surface-soft)] transition-all"
  >
    <div className="relative">
      <div className="p-3 bg-gradient-to-br from-[var(--os-hover)] to-[var(--os-hover-accent)] rounded-xl shrink-0 group-hover:from-[var(--os-hover-accent)] group-hover:to-[var(--os-accent-mist)] transition-all duration-300 shadow-sm">
        <Icon size={20} className="text-[var(--os-navy)]" strokeWidth={2} />
      </div>
      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[var(--os-sky)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
    <div className="flex-1 pt-1">
      <div className="flex items-center gap-2 mb-1.5">
        <h4 className="text-sm font-bold text-[var(--os-text)] group-hover:text-[var(--os-navy)] transition-colors">
          {title}
        </h4>
        {badge && (
          <span className="px-2 py-0.5 bg-[var(--os-hover)] text-[var(--os-navy)] text-[9px] font-bold uppercase tracking-wider rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-[var(--os-text-dim)] leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export const TimelineItem: React.FC<TimelineItemProps> = ({
  title,
  description,
  priority,
  index,
  icon: Icon = Flag,
  status = 'planned',
}) => {
  const priorityStyles = {
    High: {
      bg: 'bg-red-50 dark:bg-[#3d1820]',
      text: 'text-red-600 dark:text-[#f97583]',
      border: 'border-red-200 dark:border-[#5c2d35]',
      dot: 'bg-red-500',
    },
    Medium: {
      bg: 'bg-amber-50 dark:bg-[#3d2c10]',
      text: 'text-amber-600 dark:text-[#e3b341]',
      border: 'border-amber-200 dark:border-[#5c4a1e]',
      dot: 'bg-amber-500',
    },
    Low: {
      bg: 'bg-[var(--os-surface-soft)] ',
      text: 'text-[var(--os-text-secondary)]',
      border: 'border-[var(--os-border)]',
      dot: 'bg-[var(--os-text-faint)]',
    },
  };

  const statusStyles = {
    planned: { icon: Circle, color: 'text-[var(--os-text-faint)]' },
    'in-progress': { icon: RefreshCw, color: 'text-[var(--os-text-accent)]' },
    completed: { icon: CheckCircle, color: 'text-emerald-500 dark:text-[#3fb950]' },
  };

  const style = priorityStyles[priority];
  const StatusIcon = statusStyles[status].icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ x: 8 }}
      className="relative flex items-stretch gap-6 group"
    >
      {/* Timeline Line & Dot */}
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full ${style.dot} shrink-0 ring-4 ring-[var(--os-surface-elevated)] shadow-md z-10`} />
        {index < 5 && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-[var(--os-border)] to-transparent mt-2" />
        )}
      </div>

      {/* Content Card */}
      <div className="flex-1 pb-8">
        <div className="bg-[var(--os-surface-elevated)] border border-[var(--os-border)] rounded-xl p-5 group-hover:border-[var(--os-highlight)] group-hover:shadow-lg transition-all duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-[var(--os-surface-muted)] rounded-lg group-hover:bg-[var(--os-hover)] transition-colors">
                <Icon size={16} className="text-[var(--os-navy)]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-[var(--os-text)] group-hover:text-[var(--os-navy)] transition-colors">
                    {title}
                  </h4>
                  <StatusIcon
                    size={14}
                    className={`${statusStyles[status].color} ${
                      status === 'in-progress' ? 'animate-spin' : ''
                    }`}
                  />
                </div>
                <p className="text-xs text-[var(--os-text-dim)] leading-relaxed">{description}</p>
              </div>
            </div>
            <span
              className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${style.bg} ${style.text} ${style.border} border`}
            >
              {priority}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const CodeBlock: React.FC<{ code: string; language?: string }> = ({
  code,
  language = 'typescript',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-[var(--os-border)] shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28ca42]" />
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-[var(--os-sky)]" />
            <span className="text-[11px] font-mono font-bold text-[var(--os-accent-mist)] uppercase tracking-widest">
              {language}
            </span>
          </div>
        </div>
        <button onClick={handleCopy} className="p-1.5 hover:bg-white/10 rounded transition-colors" title="Copy code">
          {copied ? (
            <CheckCheck size={14} className="text-emerald-400" />
          ) : (
            <Copy size={14} className="text-white/50 hover:text-white" />
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="bg-[#0d1117] p-6 overflow-x-auto">
        <pre className="text-[13px] font-mono leading-relaxed text-[#e6edf3]">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export const QuoteBlock: React.FC<{ quote: string; author: string; role?: string }> = ({
  quote,
  author,
  role,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="relative"
  >
    {/* Background Decoration */}
    <div className="absolute -left-4 top-0 w-24 h-24 bg-gradient-to-br from-[var(--os-hover)] to-transparent rounded-full blur-2xl opacity-60" />

    <div className="relative bg-gradient-to-br from-[var(--os-surface-elevated)] to-[var(--os-surface-soft)] border border-[var(--os-border)] rounded-2xl p-10 shadow-lg">
      {/* Quote Mark */}
      <div className="absolute -top-4 left-8">
        <div className="w-12 h-12 bg-gradient-to-br from-[#334E68] to-[var(--os-sky)] rounded-xl flex items-center justify-center shadow-lg">
          <Quote size={24} className="text-white" strokeWidth={2} />
        </div>
      </div>

      {/* Quote Text */}
      <blockquote className="text-xl md:text-2xl font-light text-[var(--os-text)] leading-relaxed pt-4 font-serif italic">
        "{quote}"
      </blockquote>

      {/* Author — only render if provided */}
      {author && (
        <div className="flex items-center gap-4 mt-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#334E68] to-[var(--os-highlight)] flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-[var(--os-text)]">{author}</div>
            {role && (
              <div className="text-xs text-[var(--os-text-secondary)] font-mono uppercase tracking-wider">
                {role}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </motion.div>
);

// ============================================================================
// Color Swatch Component
// ============================================================================

export const ColorSwatch: React.FC<{
  name: string;
  value: string;
  description: string;
}> = ({ name, value, description }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--os-hover)] transition-all group"
  >
    <div className="relative">
      <div
        className="w-14 h-14 rounded-xl shadow-lg border-4 border-[var(--os-surface-elevated)] dark:border-[var(--os-surface-muted)]"
        style={{ backgroundColor: value }}
      />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--os-surface-muted)] rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Copy size={10} className="text-[var(--os-navy)]" />
      </div>
    </div>
    <div className="flex-1">
      <div className="text-sm font-bold text-[var(--os-text)] mb-0.5">{name}</div>
      <div className="flex items-center gap-3">
        <code className="text-[10px] font-mono text-[var(--os-text-dim)] bg-[var(--os-surface-muted)] px-2 py-1 rounded-md border border-[var(--os-border)]">
          {value}
        </code>
        <span className="text-[10px] text-[var(--os-text-faint)]">{description}</span>
      </div>
    </div>
  </motion.div>
);

// ============================================================================
// Architecture Component
// ============================================================================

export const ArchitectureLayer: React.FC<ArchitectureLayerProps> = ({ title, icon: Icon, items }) => (
  <div className="space-y-6 min-w-0">
    <div className="flex items-center gap-3 pb-4 border-b-2 border-[var(--os-border)]">
      <div className="p-2 bg-gradient-to-br from-[var(--os-hover)] to-[var(--os-hover-accent)] rounded-lg shrink-0">
        <Icon size={18} className="text-[var(--os-navy)]" strokeWidth={2} />
      </div>
      <h4 className="text-xs uppercase tracking-[0.2em] text-[var(--os-text-secondary)] font-bold truncate">{title}</h4>
    </div>
    <div className="space-y-3">
      {items.map((component, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          whileHover={{ x: 4 }}
          className="group p-3 rounded-lg hover:bg-[var(--os-hover)] transition-all cursor-default overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-1.5 min-w-0">
            <component.icon
              size={14}
              className="text-[var(--os-highlight)] opacity-50 group-hover:text-[var(--os-sky)] group-hover:opacity-100 transition-colors shrink-0"
            />
            <div className="text-sm font-bold text-[var(--os-text)] font-mono group-hover:text-[var(--os-navy)] transition-colors truncate">
              {component.name}
            </div>
          </div>
          <div className="text-xs text-[var(--os-text-dim)] leading-relaxed pl-6 break-words">{component.desc}</div>
        </motion.div>
      ))}
    </div>
  </div>
);

// ============================================================================
// Custom Icon Components (not available in lucide-react)
// ============================================================================

export const Github: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const Twitter: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export const Linkedin: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const Brain: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

// ============================================================================
// Gallery Mockups — Miniaturized wireframe previews
// ============================================================================

const MockFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`h-36 w-full bg-[var(--os-surface-muted)] border-b border-[var(--os-border)] flex items-center justify-center overflow-hidden relative ${className}`}>
    {children}
  </div>
);

const Line: React.FC<{ w?: string; className?: string }> = ({ w = 'w-full', className = '' }) => (
  <div className={`h-[3px] ${w} rounded-full bg-[var(--os-border)] ${className}`} />
);

const AccentLine: React.FC<{ w?: string; className?: string }> = ({ w = 'w-full', className = '' }) => (
  <div className={`h-[3px] ${w} rounded-full bg-[var(--os-highlight)] opacity-60 ${className}`} />
);

const SplitViewMockup: React.FC = () => (
  <MockFrame>
    <div className="w-[85%] h-[80%] flex flex-col gap-0 rounded-lg overflow-hidden border border-[var(--os-border)] bg-[var(--os-surface-elevated)]">
      <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-[var(--os-border)] bg-[var(--os-surface-soft)]">
        <div className="flex gap-1">
          <div className="w-[5px] h-[5px] rounded-full bg-[#ff5f57]" />
          <div className="w-[5px] h-[5px] rounded-full bg-[#ffbd2e]" />
          <div className="w-[5px] h-[5px] rounded-full bg-[#28ca42]" />
        </div>
        <div className="flex-1" />
        <div className="flex gap-1">
          <div className="w-5 h-2.5 rounded-[3px] bg-[var(--os-navy)] opacity-30" />
          <div className="w-5 h-2.5 rounded-[3px] bg-[var(--os-highlight)] opacity-40" />
        </div>
      </div>
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 p-2 space-y-1.5 border-r border-[var(--os-border)]">
          <Line w="w-[70%]" /><Line w="w-[90%]" /><AccentLine w="w-[50%]" /><Line w="w-[80%]" /><Line w="w-[60%]" /><Line w="w-[75%]" /><AccentLine w="w-[40%]" />
        </div>
        <div className="flex-1 p-2 space-y-1.5 bg-[var(--os-surface-soft)]">
          <div className="h-[5px] w-[50%] rounded-full bg-[var(--os-navy)] opacity-25" />
          <Line w="w-[85%]" /><Line w="w-[70%]" />
          <div className="h-[3px] w-[30%] rounded-full bg-[var(--os-sky)] opacity-40 mt-1" />
          <Line w="w-[90%]" /><Line w="w-[55%]" />
        </div>
      </div>
    </div>
  </MockFrame>
);

const CommandPaletteMockup: React.FC = () => (
  <MockFrame>
    <div className="absolute inset-0 bg-[var(--os-navy)] opacity-[0.06]" />
    <div className="w-[70%] bg-[var(--os-surface-elevated)] border border-[var(--os-border)] rounded-lg shadow-xl overflow-hidden z-10">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--os-border)]">
        <div className="w-2.5 h-2.5 rounded-full bg-[var(--os-sky)] opacity-60" />
        <div className="flex-1 h-[4px] rounded-full bg-[var(--os-border)]" />
      </div>
      <div className="p-1.5 space-y-0.5">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-[var(--os-hover)]">
          <div className="w-2 h-2 rounded-[2px] bg-[var(--os-highlight)] opacity-50" />
          <Line w="w-[60%]" />
          <div className="ml-auto flex gap-0.5">
            <div className="w-3 h-2.5 rounded-[2px] bg-[var(--os-border)]" />
            <div className="w-3 h-2.5 rounded-[2px] bg-[var(--os-border)]" />
          </div>
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded">
          <div className="w-2 h-2 rounded-[2px] bg-[var(--os-border)]" /><Line w="w-[45%]" />
        </div>
        <div className="flex items-center gap-2 px-2 py-1.5 rounded">
          <div className="w-2 h-2 rounded-[2px] bg-[var(--os-border)]" /><Line w="w-[55%]" />
        </div>
      </div>
    </div>
  </MockFrame>
);

const SmartPasteMockup: React.FC = () => (
  <MockFrame>
    <div className="absolute inset-0 bg-[var(--os-navy)] opacity-[0.06]" />
    <div className="w-[75%] bg-[var(--os-surface-elevated)] border border-[var(--os-border)] rounded-lg shadow-xl overflow-hidden z-10">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--os-border)]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-purple-400 opacity-50" />
          <div className="h-[3px] w-10 rounded-full bg-[var(--os-text)] opacity-20" />
        </div>
        <div className="w-2 h-2 rounded-sm bg-[var(--os-border)]" />
      </div>
      <div className="px-3 py-2 space-y-1">
        <div className="flex gap-1 items-center"><Line w="w-[30%]" /><div className="h-[3px] w-[20%] rounded-full bg-purple-400 opacity-40" /><Line w="w-[25%]" /></div>
        <div className="flex gap-1 items-center"><Line w="w-[15%]" /><div className="h-[3px] w-[35%] rounded-full bg-purple-400 opacity-40" /></div>
        <div className="flex gap-1 items-center"><Line w="w-[40%]" /><div className="h-[3px] w-[15%] rounded-full bg-purple-400 opacity-40" /><Line w="w-[20%]" /></div>
      </div>
      <div className="flex items-center justify-end gap-1.5 px-3 py-1.5 border-t border-[var(--os-border)]">
        <div className="w-8 h-2.5 rounded-[3px] bg-[var(--os-border)]" />
        <div className="w-8 h-2.5 rounded-[3px] bg-[var(--os-accent-deep)] opacity-60" />
      </div>
    </div>
  </MockFrame>
);

const FileSystemMockup: React.FC = () => (
  <MockFrame>
    <div className="w-[50%] h-[85%] bg-[var(--os-surface-elevated)] border border-[var(--os-border)] rounded-lg overflow-hidden flex flex-col">
      <div className="px-2 py-1.5 border-b border-[var(--os-border)]"><div className="h-3 rounded bg-[var(--os-surface-muted)] border border-[var(--os-border)]" /></div>
      <div className="flex-1 p-1.5 space-y-0.5 overflow-hidden">
        {['55%','70%','45%','60%','50%'].map((w, i) => (
          <div key={i} className={`flex items-center gap-1.5 px-1.5 py-1 rounded ${i === 0 ? 'bg-[var(--os-hover)]' : ''}`}>
            <div className={`w-2 h-2 rounded-[2px] ${i === 0 ? 'bg-[var(--os-sky)] opacity-50' : 'bg-[var(--os-border)]'}`} />
            <Line w={`w-[${w}]`} />
          </div>
        ))}
      </div>
      <div className="px-2 py-1 border-t border-[var(--os-border)] flex items-center justify-center">
        <div className="w-4 h-2 rounded-[3px] bg-[var(--os-highlight)] opacity-40" />
      </div>
    </div>
  </MockFrame>
);

const DocOutlineMockup: React.FC = () => (
  <MockFrame>
    <div className="w-[55%] h-[85%] bg-[var(--os-surface-elevated)] border border-[var(--os-border)] rounded-lg overflow-hidden flex flex-col">
      <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-[var(--os-border)]">
        <div className="w-2 h-2 rounded-sm bg-[var(--os-highlight)] opacity-50" />
        <div className="h-[3px] w-12 rounded-full bg-[var(--os-text)] opacity-20" />
      </div>
      <div className="flex-1 p-2 space-y-1.5 overflow-hidden">
        <div className="flex items-center gap-1.5"><div className="w-1 h-3 rounded-full bg-[var(--os-navy)] opacity-40" /><div className="h-[4px] w-[65%] rounded-full bg-[var(--os-text)] opacity-20" /></div>
        <div className="flex items-center gap-1.5 ml-2"><div className="w-1 h-3 rounded-full bg-[var(--os-sky)] opacity-60" /><div className="h-[4px] w-[50%] rounded-full bg-[var(--os-sky)] opacity-40" /></div>
        <div className="flex items-center gap-1.5 ml-4"><div className="w-0.5 h-2.5 rounded-full bg-[var(--os-border)]" /><Line w="w-[40%]" /></div>
        <div className="flex items-center gap-1.5 ml-4"><div className="w-0.5 h-2.5 rounded-full bg-[var(--os-border)]" /><Line w="w-[35%]" /></div>
        <div className="flex items-center gap-1.5 ml-2"><div className="w-1 h-3 rounded-full bg-[var(--os-border)]" /><div className="h-[4px] w-[55%] rounded-full bg-[var(--os-text)] opacity-15" /></div>
        <div className="flex items-center gap-1.5 ml-4"><div className="w-0.5 h-2.5 rounded-full bg-[var(--os-border)]" /><Line w="w-[30%]" /></div>
      </div>
    </div>
  </MockFrame>
);

const HudMockup: React.FC = () => (
  <MockFrame>
    <div className="w-[85%] flex flex-col items-center gap-3">
      <div className="w-full h-14 bg-[var(--os-surface-elevated)] border border-[var(--os-border)] rounded-lg p-2 space-y-1.5">
        <Line w="w-[80%]" /><Line w="w-[60%]" /><AccentLine w="w-[45%]" />
      </div>
      <div className="w-full flex items-center gap-1.5 px-2 py-1.5 bg-[var(--os-surface-elevated)] border border-[var(--os-border)] rounded-lg">
        {[4,5,3].map((w, i) => (
          <div key={i} className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--os-surface-muted)]">
            <div className="w-1 h-1 rounded-full bg-[var(--os-sky)] opacity-60" />
            <div className={`h-[3px] w-${w} rounded-full bg-[var(--os-border)]`} />
          </div>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--os-surface-muted)]">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-60" />
          <div className="h-[3px] w-4 rounded-full bg-[var(--os-border)]" />
        </div>
      </div>
    </div>
  </MockFrame>
);

const DarkModeMockup: React.FC = () => (
  <MockFrame>
    <div className="w-[80%] h-[75%] flex rounded-lg overflow-hidden border border-[var(--os-border)]">
      <div className="flex-1 bg-white p-2 space-y-1.5">
        <div className="h-[4px] w-[40%] rounded-full bg-[#2C3E50] opacity-25" />
        <div className="h-[3px] w-[80%] rounded-full bg-[#E5E5E5]" /><div className="h-[3px] w-[60%] rounded-full bg-[#E5E5E5]" />
        <div className="h-[3px] w-[70%] rounded-full bg-[#AEC6CF] opacity-40" /><div className="h-[3px] w-[50%] rounded-full bg-[#E5E5E5]" />
        <div className="mt-1.5 flex gap-1"><div className="w-4 h-2.5 rounded-[2px] bg-[#EBF5FB]" /><div className="w-4 h-2.5 rounded-[2px] bg-[#D6EAF8]" /></div>
      </div>
      <div className="relative w-px bg-[var(--os-border)] flex items-center justify-center">
        <div className="absolute w-4 h-4 rounded-full bg-[var(--os-highlight)] border-2 border-[var(--os-surface-elevated)] shadow z-10" />
      </div>
      <div className="flex-1 bg-[#0d1117] p-2 space-y-1.5">
        <div className="h-[4px] w-[40%] rounded-full bg-[#c9d1d9] opacity-25" />
        <div className="h-[3px] w-[80%] rounded-full bg-[#30363d]" /><div className="h-[3px] w-[60%] rounded-full bg-[#30363d]" />
        <div className="h-[3px] w-[70%] rounded-full bg-[#58a6ff] opacity-30" /><div className="h-[3px] w-[50%] rounded-full bg-[#30363d]" />
        <div className="mt-1.5 flex gap-1"><div className="w-4 h-2.5 rounded-[2px] bg-[#1c2128]" /><div className="w-4 h-2.5 rounded-[2px] bg-[#21262d]" /></div>
      </div>
    </div>
  </MockFrame>
);

const BuzzwordMockup: React.FC = () => (
  <MockFrame>
    <div className="w-[80%] h-[80%] flex gap-2">
      <div className="flex-[2] bg-[var(--os-surface-elevated)] border border-[var(--os-border)] rounded-lg p-2 space-y-1.5">
        <div className="flex gap-1 items-center flex-wrap"><Line w="w-[25%]" /><div className="h-[4px] w-[18%] rounded-full bg-amber-400 opacity-50" /><Line w="w-[30%]" /></div>
        <div className="flex gap-1 items-center flex-wrap"><Line w="w-[35%]" /><div className="h-[4px] w-[22%] rounded-full bg-red-400 opacity-50" /></div>
        <div className="flex gap-1 items-center flex-wrap"><Line w="w-[20%]" /><div className="h-[4px] w-[15%] rounded-full bg-amber-400 opacity-50" /><Line w="w-[25%]" /></div>
        <Line w="w-[70%]" />
        <div className="flex gap-1 items-center flex-wrap"><Line w="w-[40%]" /><div className="h-[4px] w-[20%] rounded-full bg-red-400 opacity-50" /></div>
      </div>
      <div className="flex-1 bg-[var(--os-surface-elevated)] border border-[var(--os-border)] rounded-lg p-1.5 space-y-1">
        {['red','amber','amber','red'].map((c, i) => (
          <div key={i} className={`flex items-center justify-between px-1 py-0.5 rounded bg-${c}-50 dark:bg-${c}-950/30`}>
            <div className={`h-[3px] w-[${[50,40,55,45][i]}%] rounded-full bg-${c}-300 opacity-60`} />
            <div className={`h-[3px] w-2 rounded-full bg-${c}-400 opacity-40`} />
          </div>
        ))}
      </div>
    </div>
  </MockFrame>
);

const KeyboardShortcutsMockup: React.FC = () => (
  <MockFrame>
    <div className="w-[80%] h-[80%] bg-[var(--os-surface-elevated)] border border-[var(--os-border)] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--os-border)]">
        <div className="h-[3px] w-14 rounded-full bg-[var(--os-text)] opacity-20" />
        <div className="w-2 h-2 rounded-sm bg-[var(--os-border)]" />
      </div>
      <div className="grid grid-cols-3 gap-x-2 gap-y-1.5 p-2.5">
        {[65, 50, 55, 45, 60, 40, 55, 45, 50].map((w, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="flex gap-0.5">
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[var(--os-surface-muted)] border border-[var(--os-border)]" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-[var(--os-surface-muted)] border border-[var(--os-border)]" />
            </div>
            <div className="h-[3px] rounded-full bg-[var(--os-border)]" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    </div>
  </MockFrame>
);

const MOCKUP_MAP: Record<string, React.FC> = {
  'rich-text-editor.tsx': SplitViewMockup,
  'command-palette.tsx': CommandPaletteMockup,
  'smart-paste-modal.tsx': SmartPasteMockup,
  'file-system.tsx': FileSystemMockup,
  'document-outline.tsx': DocOutlineMockup,
  'hud.tsx': HudMockup,
  'theme-toggle.tsx + app.css': DarkModeMockup,
  'buzzword-panel.tsx': BuzzwordMockup,
  'keyboard-shortcuts-overlay.tsx': KeyboardShortcutsMockup,
};

export const GalleryMockup: React.FC<{ componentKey: string; icon: React.ElementType }> = ({ componentKey, icon: Icon }) => {
  const Mockup = MOCKUP_MAP[componentKey];
  if (Mockup) return <Mockup />;
  return (
    <MockFrame>
      <Icon size={32} className="text-[var(--os-highlight)] opacity-40" strokeWidth={1.5} />
    </MockFrame>
  );
};
