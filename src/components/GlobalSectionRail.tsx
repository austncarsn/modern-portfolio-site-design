import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { WheelNav, type NavItem } from "./WheelNav";
import { SECTION_NAV_ITEMS, isSectionRoute, mapPathToSection } from "./section-nav-items";

export function GlobalSectionRail() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const mobileItemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hasOpenedModal = useRef(false);

  const shouldRender = useMemo(() => isSectionRoute(pathname), [pathname]);

  const sectionPath = useMemo(() => mapPathToSection(pathname), [pathname]);

  const isItemCurrent = useCallback((item: NavItem, currentPath: string) => {
    return mapPathToSection(currentPath) === item.href;
  }, []);

  const navigateTo = useCallback(
    (href: string) => {
      setMobileOpen(false);
      navigate(href);
    },
    [navigate]
  );

  const handleModalKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setMobileOpen(false);
      return;
    }

    if (event.key !== "Tab" || !modalRef.current) {
      return;
    }

    const focusableElements = Array.from(
      modalRef.current.querySelectorAll<HTMLElement>("button,[href],[tabindex]:not([tabindex='-1'])")
    ).filter((element) => !element.hasAttribute("disabled"));

    if (focusableElements.length === 0) {
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const active = document.activeElement;

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
      return;
    }

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    }
  }, []);

  useEffect(() => {
    if (!shouldRender) {
      setMobileOpen(false);
    }
  }, [shouldRender]);

  useEffect(() => {
    if (!mobileOpen) {
      if (hasOpenedModal.current) {
        triggerRef.current?.focus();
        hasOpenedModal.current = false;
      }
      return;
    }

    hasOpenedModal.current = true;

    const activeSectionIndex = SECTION_NAV_ITEMS.findIndex((item) => item.href === sectionPath);
    const focusTargetIndex = activeSectionIndex >= 0 ? activeSectionIndex : 0;
    const focusRafId = requestAnimationFrame(() => {
      mobileItemRefs.current[focusTargetIndex]?.focus();
    });

    const previousOverflow = document.body.style.overflow;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onEscape);

    return () => {
      cancelAnimationFrame(focusRafId);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onEscape);
    };
  }, [mobileOpen, sectionPath]);

  if (!shouldRender) {
    return null;
  }

  return (
    <>
      <style>{`
        .global-wheel-rail-desktop {
          position: fixed;
          top: 50%;
          right: 16px;
          transform: translateY(-50%);
          width: 248px;
          z-index: 48;
          pointer-events: auto;
        }
        .global-wheel-rail-desktop .wheel-nav {
          border: 1px solid color-mix(in srgb, var(--text-1) 18%, var(--border-1));
          background: color-mix(in srgb, var(--surface-0) 88%, #ece8df 12%);
          padding: var(--sp-2);
        }
        .global-wheel-rail-desktop .wheel-nav-viewport {
          height: 354px;
          border-color: color-mix(in srgb, var(--text-1) 12%, var(--border-1));
          background: color-mix(in srgb, var(--surface-0) 82%, #f4f1ea 18%);
        }
        .global-wheel-rail-mobile {
          position: fixed;
          right: 14px;
          bottom: 14px;
          z-index: 62;
          display: none;
        }
        .global-wheel-rail-trigger {
          border: 1px solid color-mix(in srgb, var(--text-1) 26%, var(--border-1));
          background: color-mix(in srgb, var(--surface-0) 82%, #f0ece4 18%);
          color: var(--text-1);
          padding: 10px 12px;
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
        }
        .global-wheel-rail-trigger:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--text-1) 76%, white 24%);
          outline-offset: 2px;
        }
        .global-wheel-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 64;
          background: rgba(12, 14, 18, 0.52);
          display: none;
          align-items: flex-end;
          justify-content: center;
          padding: 0;
        }
        .global-wheel-modal {
          width: 100%;
          max-width: 560px;
          background: var(--surface-0);
          border-top: 1px solid var(--border-1);
          padding: var(--sp-4);
          display: grid;
          gap: var(--sp-3);
        }
        .global-wheel-modal-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--sp-3);
        }
        .global-wheel-modal-title {
          margin: 0;
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-2);
        }
        .global-wheel-modal-close {
          border: 1px solid var(--border-1);
          background: transparent;
          color: var(--text-1);
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 6px 10px;
          cursor: pointer;
        }
        .global-wheel-mobile-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--sp-2);
        }
        .global-wheel-mobile-item {
          border: 1px solid var(--border-1);
          background: color-mix(in srgb, var(--surface-0) 86%, #f1eee7 14%);
          color: var(--text-1);
          font-family: var(--font-body);
          font-size: var(--ts-overline);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 12px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: var(--sp-2);
          text-align: left;
          cursor: pointer;
        }
        .global-wheel-mobile-item[data-active="true"] {
          background: var(--text-1);
          border-color: var(--text-1);
          color: var(--surface-0);
        }
        .global-wheel-mobile-item:focus-visible,
        .global-wheel-modal-close:focus-visible {
          outline: 2px solid color-mix(in srgb, var(--text-1) 76%, white 24%);
          outline-offset: 2px;
        }
        @media (max-width: 1180px) {
          .global-wheel-rail-desktop {
            display: none;
          }
          .global-wheel-rail-mobile {
            display: block;
          }
          .global-wheel-modal-backdrop[data-open="true"] {
            display: flex;
          }
        }
      `}</style>

      <aside className="global-wheel-rail-desktop" aria-label="Primary navigation control rail">
        <WheelNav
          items={SECTION_NAV_ITEMS}
          showHint={false}
          captureScrollOnEngage
          isItemCurrent={isItemCurrent}
        />
      </aside>

      <div className="global-wheel-rail-mobile">
        <button
          ref={triggerRef}
          type="button"
          className="global-wheel-rail-trigger"
          onClick={() => setMobileOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={mobileOpen}
          aria-controls="global-section-nav-modal"
          aria-label="Open section navigation"
        >
          Nav
        </button>
      </div>

      <div
        className="global-wheel-modal-backdrop"
        data-open={mobileOpen ? "true" : "false"}
        role="dialog"
        aria-modal="true"
        aria-label="Section navigation"
        onClick={() => setMobileOpen(false)}
      >
        <div
          id="global-section-nav-modal"
          ref={modalRef}
          className="global-wheel-modal"
          onKeyDown={handleModalKeyDown}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="global-wheel-modal-head">
            <p className="global-wheel-modal-title">Section Navigation</p>
            <button
              type="button"
              className="global-wheel-modal-close"
              onClick={() => setMobileOpen(false)}
            >
              Close
            </button>
          </div>
          <div className="global-wheel-mobile-list">
            {SECTION_NAV_ITEMS.map((item, index) => {
              const isCurrent = sectionPath === item.href;
              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    mobileItemRefs.current[index] = node;
                  }}
                  type="button"
                  className="global-wheel-mobile-item"
                  data-active={isCurrent ? "true" : "false"}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={() => navigateTo(item.href)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
