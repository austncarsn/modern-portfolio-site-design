import type { NavItem } from "./WheelNav";

export const SECTION_NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "projects", label: "Case Studies", href: "/projects" },
  { id: "gallery", label: "Gallery", href: "/gallery" },
  { id: "flashcards", label: "Flashcards", href: "/flashcards" },
  { id: "info", label: "Info", href: "/info" },
];

export function mapPathToSection(pathname: string) {
  if (pathname === "/railroad-track-divider" || pathname.startsWith("/projects/")) {
    return "/projects";
  }
  return pathname;
}

export function isSectionRoute(pathname: string) {
  const normalizedPath = mapPathToSection(pathname);
  return SECTION_NAV_ITEMS.some((item) => item.href === normalizedPath);
}
