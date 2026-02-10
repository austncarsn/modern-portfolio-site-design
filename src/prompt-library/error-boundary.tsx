import React, { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (props: { error: Error; resetError: () => void }) => ReactNode;
  section?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback, section } = this.props;
    if (hasError && error) {
      if (fallback) return fallback({ error, resetError: this.resetError });
      return <DefaultFallback error={error} section={section} onReset={this.resetError} />;
    }
    return children;
  }
}

function DefaultFallback({ error, section, onReset }: { error: Error; section?: string; onReset: () => void }) {
  return (
    <div role="alert" className="border border-border bg-card/50 p-6 sm:p-10 flex flex-col items-center justify-center text-center min-h-[200px]">
      <div className="w-10 h-10 flex items-center justify-center border border-destructive/20 bg-destructive/5 mb-4">
        <AlertTriangle className="w-5 h-5 text-destructive" strokeWidth={1.5} />
      </div>
      <p className="text-xs font-mono text-muted-foreground/50 uppercase tracking-[0.2em] mb-2">
        {section ? `${section} — ` : ""}Render Error
      </p>
      <p className="text-sm text-muted-foreground max-w-md mb-1">Something went wrong while rendering this section.</p>
      <button onClick={onReset} className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider border border-border bg-background hover:bg-secondary text-foreground transition-colors active:scale-[0.98]">
        <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
        Try Again
      </button>
    </div>
  );
}

function Shimmer({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`relative overflow-hidden bg-secondary/60 ${className}`} style={style}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }} />
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="border border-border bg-card/50 px-5 sm:px-8 py-4 sm:py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Shimmer className="h-3 w-20 sm:w-24" />
          <Shimmer className="h-3 w-28 hidden sm:block" />
        </div>
        <Shimmer className="h-4 w-4" />
      </div>
    </div>
  );
}

export function ModalSkeleton() {
  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-6 md:p-8 bg-black/40 sm:bg-background/80 backdrop-blur-md sm:backdrop-blur-xl">
      <div className="w-full sm:max-w-5xl h-[95dvh] sm:h-[85dvh] flex flex-col sm:flex-row bg-card border-t sm:border border-border shadow-2xl overflow-hidden rounded-t-xl sm:rounded-sm animate-pulse">
        <div className="sm:w-[360px] md:w-[400px] flex-shrink-0 border-b sm:border-b-0 sm:border-r border-border p-5 sm:p-8 space-y-6">
          <div className="flex justify-between"><Shimmer className="h-6 w-16" /><Shimmer className="h-6 w-6 rounded-full" /></div>
          <div className="space-y-3"><Shimmer className="h-3 w-20" /><Shimmer className="h-8 w-full" /><Shimmer className="h-8 w-3/4" /></div>
          <div className="space-y-2"><Shimmer className="h-4 w-full" /><Shimmer className="h-4 w-5/6" /><Shimmer className="h-4 w-4/6" /></div>
        </div>
        <div className="flex-1 bg-secondary/30 p-5 sm:p-8 md:p-12 space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (<Shimmer key={i} className="h-4" style={{ width: `${40 + Math.random() * 55}%` } as React.CSSProperties} />))}
        </div>
      </div>
    </div>
  );
}
