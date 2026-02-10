import React from "react";
import { motion } from "motion/react";
import {
  Activity,
  Circle,
  Check,
  Loader2,
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface HUDStatusProps {
  status: "idle" | "syncing" | "saved" | "typing";
}

interface MetricItemProps {
  value: number | string;
  label: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    strokeWidth?: number;
  }>;
  iconColor?: string;
  trend?: "up" | "down" | "neutral";
  warning?: boolean;
  onClick?: () => void;
  suffix?: string;
  tooltip?: string;
}

interface BuzzwordSeverity {
  level: "none" | "low" | "medium" | "high" | "critical";
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
}

// ============================================================================
// Constants
// ============================================================================

export const AVERAGE_READING_WPM = 238;
export const AVERAGE_SPEAKING_WPM = 150;

// ============================================================================
// Helper Functions
// ============================================================================

export function getBuzzwordSeverity(
  count: number,
  wordCount: number,
): BuzzwordSeverity {
  if (count === 0) {
    return {
      level: "none",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      label: "Clean",
    };
  }

  const ratio = wordCount > 0 ? (count / wordCount) * 100 : 0;

  if (ratio < 1 || count <= 2) {
    return {
      level: "low",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      label: "Minor",
    };
  }

  if (ratio < 3 || count <= 5) {
    return {
      level: "medium",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      label: "Moderate",
    };
  }

  if (ratio < 5 || count <= 10) {
    return {
      level: "high",
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      label: "High",
    };
  }

  return {
    level: "critical",
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
    label: "Critical",
  };
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toLocaleString();
}

export function formatTime(minutes: number): string {
  if (minutes < 1) {
    return "<1m";
  }
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatLastSaved(timestamp: number | null): string {
  if (!timestamp) return "";
  
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 1000) return "Just now";
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ============================================================================
// Sub-Components
// ============================================================================

export const MetricItem: React.FC<MetricItemProps> = ({
  value,
  label,
  icon: Icon,
  iconColor = "text-[#5DADE2]",
  warning = false,
  onClick,
  suffix,
  tooltip,
}) => {
  return (
    <motion.div
      whileHover={onClick ? { scale: 1.05, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={`
        relative flex flex-col items-center px-2 py-1.5 md:px-4 md:py-2 rounded-2xl transition-all duration-300
        ${onClick ? "cursor-pointer" : "cursor-default"}
        group
      `}
      style={{
        backgroundColor: warning ? 'color-mix(in srgb, var(--os-surface-elevated) 80%, #f59e0b 20%)' : undefined,
      }}
      onClick={onClick}
      title={tooltip}
    >
      {/* Icon with glow effect */}
      <div className="relative mb-1.5">
        <Icon
          size={14}
          className={`${warning ? "text-amber-500" : iconColor} transition-colors`}
          strokeWidth={2}
        />
        {warning && (
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-amber-400 rounded-full blur-md -z-10"
          />
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-0.5">
        <span
          className="text-lg md:text-2xl font-light leading-none tracking-tight font-sans transition-colors"
          style={{ color: warning ? undefined : 'var(--os-text)' }}
        >
          {typeof value === "number"
            ? formatNumber(value)
            : value}
        </span>
        {suffix && (
          <span className="text-xs font-medium" style={{ color: 'var(--os-text-secondary)' }}>
            {suffix}
          </span>
        )}
      </div>

      {/* Label */}
      <span
        className="text-[8px] font-bold uppercase tracking-[0.15em] mt-1 transition-colors"
        style={{ color: warning ? undefined : 'var(--os-text-secondary)' }}
      >
        {label}
      </span>

      {/* Warning indicator */}
      {warning && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1"
        >
          <div className="relative">
            <div className="w-3 h-3 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">
                !
              </span>
            </div>
            <motion.div
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.6, 0, 0.6],
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 bg-amber-400 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export const HUDDivider: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-12 px-1">
    <div className="w-px h-full" style={{ background: 'linear-gradient(to bottom, transparent, var(--os-border), transparent)' }} />
  </div>
);

export const StatusIndicator: React.FC<{
  status: HUDStatusProps["status"];
  lastSaved?: number | null;
}> = ({ status, lastSaved }) => {
  const statusConfig = {
    idle: {
      icon: Circle,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500",
      label: lastSaved ? formatLastSaved(lastSaved) : "Ready",
      animate: false,
    },
    typing: {
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-500",
      label: "Typing",
      animate: true,
    },
    syncing: {
      icon: Loader2,
      color: "text-amber-500",
      bgColor: "bg-amber-500",
      label: "Syncing",
      animate: true,
    },
    saved: {
      icon: Check,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500",
      label: "Saved",
      animate: false,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center px-2 py-1.5 md:px-4 md:py-2 min-w-[60px] md:min-w-[80px]">
      <div className="relative flex items-center justify-center w-6 h-6 md:w-8 md:h-8 mb-1">
        {/* Background pulse for active states */}
        {config.animate && (
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: status === "typing" ? 0.8 : 1.5,
              ease: "easeInOut",
            }}
            className={`absolute inset-0 ${config.bgColor} rounded-full`}
          />
        )}

        {/* Icon */}
        <motion.div
          animate={
            status === "syncing"
              ? { rotate: 360 }
              : status === "typing"
                ? { scale: [1, 1.1, 1] }
                : {}
          }
          transition={
            status === "syncing"
              ? {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                }
              : status === "typing"
                ? { repeat: Infinity, duration: 0.6 }
                : {}
          }
        >
          <Icon
            size={18}
            className={config.color}
            strokeWidth={2}
          />
        </motion.div>

        {/* Status dot */}
        <motion.div
          animate={
            config.animate
              ? { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }
              : {}
          }
          transition={{ repeat: Infinity, duration: 1 }}
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 ${config.bgColor} rounded-full border-2 shadow-sm`}
          style={{ borderColor: 'var(--os-surface-elevated)' }}
        />
      </div>

      <span className="text-[8px] font-bold uppercase tracking-[0.15em] whitespace-nowrap" style={{ color: 'var(--os-text-secondary)' }}>
        {config.label}
      </span>
    </div>
  );
};