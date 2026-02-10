import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Case Studies" },
  { to: "/gallery", label: "Gallery" },
  { to: "/prompt-library", label: "Prompt Library" },
  { to: "/prompt-notebook", label: "Notebook" },
  { to: "/flashcards", label: "Flashcards" },
  { to: "/cameo-store", label: "Cameo Store" },
  { to: "/resume", label: "Resume" },
  { to: "/info", label: "Info" },
] as const;

type SideNavProps = {
  layout?: "list" | "grid2";
};

export function SideNav({ layout = "list" }: SideNavProps) {
  const { pathname } = useLocation();
  const isGrid = layout === "grid2";
  const visibleItems = isGrid ? NAV_ITEMS.filter((item) => item.to !== "/") : NAV_ITEMS;

  return (
    <>
      <style>{`
        .side-nav {
          width: 100%;
        }
        .side-nav[data-layout="list"] {
          display: flex;
          flex-direction: column;
          max-height: 360px;
          overflow-y: auto;
          position: sticky;
          top: var(--sp-8);
        }
        .side-nav[data-layout="grid2"] {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--sp-2);
          max-width: none;
        }
        @media (max-width: 640px) {
          .side-nav[data-layout="grid2"] {
            grid-template-columns: 1fr;
          }
        }
        .side-nav-link {
          font-family: var(--font-body);
          font-size: var(--ts-body);
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-2);
          text-decoration: none;
          padding: var(--sp-3) 0;
          border-bottom: 1px solid var(--border-1);
          transition: color 200ms ease;
          display: block;
        }
        .side-nav[data-layout="list"] .side-nav-link:first-child {
          border-top: 1px solid var(--border-1);
        }
        .side-nav[data-layout="grid2"] .side-nav-link {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: var(--sp-2);
          border: 1px solid color-mix(in srgb, var(--text-1) 20%, var(--border-1));
          padding: 11px 12px;
          background: color-mix(in srgb, var(--surface-0) 86%, #ece8df 14%);
          color: var(--text-1);
          transition: background-color 160ms ease, color 160ms ease, border-color 160ms ease;
        }
        .side-nav-link:hover {
          color: var(--text-1);
        }
        .side-nav-link[data-active="true"] {
          color: var(--text-1);
          font-weight: 500;
        }
        .side-nav[data-layout="grid2"] .side-nav-link[data-active="true"] {
          background: var(--text-1);
          color: var(--surface-0);
          border-color: var(--text-1);
        }
        .side-nav[data-layout="grid2"] .side-nav-link:hover {
          background: color-mix(in srgb, var(--surface-1) 74%, white 26%);
          border-color: color-mix(in srgb, var(--text-1) 32%, var(--border-1));
        }
        .side-nav[data-layout="grid2"] .side-nav-link[data-active="true"]:hover {
          background: color-mix(in srgb, var(--text-1) 92%, black 8%);
          border-color: color-mix(in srgb, var(--text-1) 92%, black 8%);
          color: var(--surface-0);
        }
        .side-nav-index {
          font-size: var(--ts-overline);
          letter-spacing: 0.12em;
          color: var(--text-2);
        }
        .side-nav-label {
          font-size: var(--ts-overline);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .side-nav-arrow {
          font-size: var(--ts-small);
          line-height: 1;
          color: var(--text-2);
        }
        .side-nav[data-layout="grid2"] .side-nav-link[data-active="true"] .side-nav-index,
        .side-nav[data-layout="grid2"] .side-nav-link[data-active="true"] .side-nav-arrow {
          color: color-mix(in srgb, var(--surface-0) 70%, var(--text-2) 30%);
        }
        .side-nav-link:focus-visible {
          outline: 2px solid var(--text-1);
          outline-offset: 2px;
        }
      `}</style>
      <nav
        aria-label="Page navigation"
        className="side-nav"
        data-layout={layout}
      >
        {visibleItems.map((item, index) => (
          <Link
            key={item.to}
            to={item.to}
            className="side-nav-link"
            data-active={pathname === item.to}
            aria-current={pathname === item.to ? "page" : undefined}
          >
            {isGrid ? (
              <>
                <span className="side-nav-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="side-nav-label">{item.label}</span>
                <span className="side-nav-arrow" aria-hidden="true">
                  ↗
                </span>
              </>
            ) : (
              item.label
            )}
          </Link>
        ))}
      </nav>
    </>
  );
}
