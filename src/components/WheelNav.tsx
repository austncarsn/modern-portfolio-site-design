import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";

export type NavItem = {
  id: string;
  label: string;
  href: string;
};

type WheelNavProps = {
  items?: NavItem[];
  className?: string;
  showHint?: boolean;
  captureScrollOnEngage?: boolean;
  isItemCurrent?: (item: NavItem, pathname: string) => boolean;
};

const DEFAULT_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "projects", label: "Case Studies", href: "/projects" },
  { id: "gallery", label: "Gallery", href: "/gallery" },
  { id: "prompt-library", label: "Prompt Library", href: "/prompt-library" },
  { id: "prompt-notebook", label: "Notebook", href: "/prompt-notebook" },
  { id: "flashcards", label: "Flashcards", href: "/flashcards" },
  { id: "cameo-store", label: "Cameo Store", href: "/cameo-store" },
  { id: "resume", label: "Resume", href: "/resume" },
  { id: "info", label: "Info", href: "/info" },
];

const ITEM_HEIGHT = 64;
const ITEM_SPACING = 72;
const WHEEL_STEP_LOCK_MS = 140;
const MIN_WHEEL_DELTA = 8;
const TOUCH_THRESHOLD_PX = 26;

const SPRING = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.9,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function clampIndex(nextIndex: number, itemCount: number) {
  if (itemCount <= 0) {
    return 0;
  }
  return clamp(nextIndex, 0, itemCount - 1);
}

const defaultIsItemCurrent = (item: NavItem, pathname: string) => item.href === pathname;

export function WheelNav({
  items = DEFAULT_ITEMS,
  className,
  showHint = true,
  captureScrollOnEngage = false,
  isItemCurrent = defaultIsItemCurrent,
}: WheelNavProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const prefersReducedMotion = useReducedMotion() ?? false;

  const navRef = useRef<HTMLElement | null>(null);
  const wheelStepLockUntil = useRef(0);
  const touchState = useRef({ active: false, y: 0 });

  const routeIndex = useMemo(
    () => items.findIndex((item) => isItemCurrent(item, pathname)),
    [items, pathname, isItemCurrent]
  );

  const [activeIndex, setActiveIndex] = useState(routeIndex >= 0 ? routeIndex : 0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);

  const isEngaged = isHovered || isFocusWithin;

  useEffect(() => {
    const nextIndex = routeIndex >= 0 ? routeIndex : 0;
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  }, [routeIndex]);

  useEffect(() => {
    if (isEngaged || routeIndex < 0) {
      return;
    }
    setActiveIndex((current) => (current === routeIndex ? current : routeIndex));
  }, [isEngaged, routeIndex]);

  const updateActiveIndex = useCallback(
    (updater: (index: number) => number) => {
      setActiveIndex((current) => clampIndex(updater(current), items.length));
    },
    [items.length]
  );

  const stepActiveIndex = useCallback((direction: 1 | -1) => {
    if (items.length === 0) {
      return;
    }
    updateActiveIndex((index) => index + direction);
  }, [items.length, updateActiveIndex]);

  const stepFromWheelDelta = useCallback((deltaY: number) => {
    if (Math.abs(deltaY) < MIN_WHEEL_DELTA) {
      return;
    }

    const now = performance.now();
    if (now < wheelStepLockUntil.current) {
      return;
    }

    wheelStepLockUntil.current = now + WHEEL_STEP_LOCK_MS;
    stepActiveIndex(deltaY > 0 ? 1 : -1);
  }, [stepActiveIndex]);

  const handleLocalWheel = useCallback(
    (event: WheelEvent<HTMLElement>) => {
      event.preventDefault();
      stepFromWheelDelta(event.deltaY);
    },
    [stepFromWheelDelta]
  );

  useEffect(() => {
    if (!captureScrollOnEngage || !isEngaged) {
      return;
    }

    const handleWindowWheel = (event: globalThis.WheelEvent) => {
      const targetNode = event.target;
      if (targetNode instanceof Node && navRef.current?.contains(targetNode)) {
        return;
      }

      event.preventDefault();
      stepFromWheelDelta(event.deltaY);
    };

    window.addEventListener("wheel", handleWindowWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWindowWheel);
    };
  }, [captureScrollOnEngage, isEngaged, stepFromWheelDelta]);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "touch") {
      return;
    }

    touchState.current.active = true;
    touchState.current.y = event.clientY;
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (!touchState.current.active || event.pointerType !== "touch") {
        return;
      }

      const delta = touchState.current.y - event.clientY;
      if (Math.abs(delta) < TOUCH_THRESHOLD_PX) {
        return;
      }

      stepFromWheelDelta(delta);
      touchState.current.y = event.clientY;
    },
    [stepFromWheelDelta]
  );

  const handlePointerEnd = useCallback(() => {
    touchState.current.active = false;
  }, []);

  const handleFocusCapture = useCallback(() => {
    setIsFocusWithin(true);
  }, []);

  const handleBlurCapture = useCallback((event: FocusEvent<HTMLElement>) => {
    const nextTarget = event.relatedTarget;
    if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
      setIsFocusWithin(false);
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        stepActiveIndex(1);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        stepActiveIndex(-1);
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const activeItem = items[activeIndex];
        if (activeItem) {
          navigate(activeItem.href);
        }
        return;
      }

      if (event.key === "Escape") {
        const focusedElement = document.activeElement;
        if (focusedElement instanceof HTMLElement && navRef.current?.contains(focusedElement)) {
          focusedElement.blur();
        }
        (event.currentTarget as HTMLElement).blur();
        setIsFocusWithin(false);
      }
    },
    [activeIndex, items, navigate, stepActiveIndex]
  );

  const handleItemClick = useCallback(
    (index: number) => {
      if (index === activeIndex) {
        const activeItem = items[index];
        if (activeItem) {
          navigate(activeItem.href);
        }
        return;
      }

      setActiveIndex(index);
    },
    [activeIndex, items, navigate]
  );

  const transition = prefersReducedMotion ? { duration: 0 } : SPRING;

  return (
    <>
      <style>{`
        .wheel-nav {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: var(--sp-2);
        }
        .wheel-nav-viewport {
          position: relative;
          height: 392px;
          overflow: hidden;
          border: 1px solid var(--border-1);
          background: color-mix(in srgb, var(--surface-1) 72%, white 28%);
          touch-action: pan-y;
          outline: none;
        }
        .wheel-nav[data-engaged="true"] .wheel-nav-viewport {
          border-color: color-mix(in srgb, var(--text-1) 24%, var(--border-1));
        }
        .wheel-nav-centerline {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: ${ITEM_HEIGHT}px;
          transform: translateY(-50%);
          border-top: 1px solid color-mix(in srgb, var(--text-1) 12%, transparent);
          border-bottom: 1px solid color-mix(in srgb, var(--text-1) 12%, transparent);
          pointer-events: none;
        }
        .wheel-nav-item {
          position: absolute;
          left: var(--sp-2);
          right: var(--sp-2);
          top: calc(50% - ${ITEM_HEIGHT / 2}px);
          height: ${ITEM_HEIGHT}px;
          border: 1px solid var(--border-1);
          background: color-mix(in srgb, var(--surface-0) 88%, #f4f1ea 12%);
          color: var(--text-2);
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: var(--sp-2);
          padding: 0 var(--sp-3);
          cursor: pointer;
          text-align: left;
        }
        .wheel-nav-item[data-active="true"] {
          color: var(--text-1);
          background: color-mix(in srgb, var(--surface-0) 68%, white 32%);
          border-color: color-mix(in srgb, var(--text-1) 24%, var(--border-1));
          font-weight: 500;
        }
        .wheel-nav-item-index {
          color: var(--text-2);
        }
        .wheel-nav-item[data-active="true"] .wheel-nav-item-index {
          color: color-mix(in srgb, var(--text-1) 78%, var(--text-2));
        }
        .wheel-nav-hint {
          margin: 0;
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-2);
          opacity: 0.84;
        }
        .wheel-nav-viewport:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--text-1) 76%, white 24%);
          outline-offset: 2px;
        }
      `}</style>
      <nav
        ref={navRef}
        aria-label="Primary navigation"
        className={`wheel-nav ${className ?? ""}`}
        data-engaged={isEngaged ? "true" : "false"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocusCapture={handleFocusCapture}
        onBlurCapture={handleBlurCapture}
      >
        <div
          className="wheel-nav-viewport"
          onWheel={handleLocalWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="group"
          aria-label="Scroll or use arrow keys to choose a section. Press Enter to open."
        >
          <div className="wheel-nav-centerline" aria-hidden />
          {items.map((item, index) => {
            const distance = index - activeIndex;
            const absDistance = Math.abs(distance);
            const scale = prefersReducedMotion
              ? clamp(1 - absDistance * 0.05, 0.9, 1)
              : clamp(1 - absDistance * 0.12, 0.72, 1);
            const opacity = prefersReducedMotion
              ? clamp(1 - absDistance * 0.12, 0.55, 1)
              : clamp(1 - absDistance * 0.25, 0.35, 1);
            const zIndex = 100 - absDistance;
            const isActive = index === activeIndex;
            const isCurrentPage = isItemCurrent(item, pathname);

            return (
              <motion.button
                key={item.id}
                type="button"
                className="wheel-nav-item"
                tabIndex={-1}
                data-active={isActive ? "true" : "false"}
                style={{ zIndex }}
                animate={{
                  y: distance * ITEM_SPACING,
                  scale,
                  opacity,
                }}
                transition={transition}
                onClick={() => handleItemClick(index)}
                aria-current={isCurrentPage ? "page" : undefined}
                aria-label={`${item.label}${isActive ? ", active" : ""}`}
              >
                <span className="wheel-nav-item-index">{String(index + 1).padStart(2, "0")}</span>
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </div>
        {showHint ? (
          <p className="wheel-nav-hint">Tab focus. Wheel or up/down to select. Enter to open.</p>
        ) : null}
      </nav>
    </>
  );
}
