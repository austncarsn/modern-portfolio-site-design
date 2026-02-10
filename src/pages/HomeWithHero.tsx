import { HeroSection } from "../components/HeroSection";

export function HomeWithHero() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--surface-0)" }}>
      <header>
        <HeroSection />
      </header>
    </div>
  );
}