export interface Project {
  id: string;
  title: string;
  summary: string;
  problem: string;
  goals: string;
  approach: string;
  outcome: string;
  repoUrl: string;
  liveUrl: string;
  tags: string[];
}

export const projects: Project[] = [
  {
    id: "claude-opus-prompt-library",
    title: "Claude Opus 4.6 × Figma Make Prompt Library",
    summary:
      "A curated collection of 100 production-ready agentic prompts across 8 categories, engineered for Figma Make powered by Claude Opus 4.6. Built as a single-page React application with a Cinematic Light design system, full-text search, category filtering, one-click copy/export, and an interactive case study documenting the design process.",
    problem:
      "As AI-powered design tools like Figma Make matured, prompt quality became the bottleneck. Working with Claude Opus 4.6 for agentic UI generation, there was no reliable, framework-backed prompt resource tailored to Figma Make's capabilities. Existing prompt libraries were either too generic (not optimized for design tooling) or too narrow (single use-case), with no resource combining research-backed prompting methodology with practical, copy-ready templates across the full design workflow. Prompts were scattered across docs, Slack threads, and personal notes with no single, searchable source of truth.",
    goals:
      "Build a searchable, single-page prompt library of 100 prompts organized into 8 categories (Foundation, Components, Interactions, Data & Logic, Design Systems, AI & LLM, Integration, Advanced) with one-click copy, Markdown export, a favorites system, and a full portfolio-style case study — all powered by a custom TC-EBC Framework (Task, Context, Elements, Behavior, Constraints) validated against 42+ research sources including Anthropic docs, Figma guides, and practitioner analysis.",
    approach:
      "Solo-authored React 19 SPA on Figma Make with Tailwind CSS v4, Motion for animation, Lucide React for icons, and strict TypeScript (union types, type guards, readonly modifiers). Code-split with React.lazy + Suspense for below-fold sections. Production-hardened with ErrorBoundary wrapping every section, shimmer skeleton fallbacks, Cmd+K command-bar search, horizontally-scrollable category chips, split-pane prompt modal, and localStorage-persisted favorites. Cinematic Light theme built on CSS variable design tokens with glass-panel effects and Swiss-style deep pigment category accents. Fully responsive mobile-first layout with safe-area insets and 100svh/100dvh viewport units. DM Sans + JetBrains Mono typography via Google Fonts.",
    outcome:
      "Shipped a complete prompt OS housing 100 prompts with a research bibliography of 42 sources (Tier 1 canonical docs + Tier 2 practitioner analysis), an interactive TC-EBC methodology section, and a 10-section narrative case study — all as a pure-frontend static site with zero API dependencies and <2s time to interactive. The project structure includes 15+ custom components, two code-split prompt data modules (prompts 1–50 and 51–100), and a full case study sub-app with its own hero, problem statement, goals, process, architecture, features, prompt system design, results, learnings, and footer CTA sections. 100% responsive coverage across mobile, tablet, and desktop with keyboard-accessible navigation and ARIA landmarks.",
    repoUrl: "https://github.com/austncarsn/aesthetic-system-design",
    liveUrl: "https://www.figma.com/design/prompt-library",
    tags: ["React 19", "TypeScript", "Tailwind v4", "Figma Make", "Claude Opus 4.6", "Prompt Engineering", "Motion", "Design Systems"],
  },
  {
    id: "the-cameo-store",
    title: "The Cameo Store",
    summary:
      "A vintage-inspired e-commerce experience for AI-generated cameo art, built with a 1970s typewriter aesthetic and modern React architecture. Features real-time search, full cart system with localStorage persistence, inline color variant switching, wishlist functionality, and a complete checkout flow — all without backend dependencies.",
    problem:
      "Most e-commerce storefronts follow identical templates — clean, minimal, and forgettable. For a curated cameo collection, this approach fails to communicate the artisanal quality and heritage of the pieces. Collectors and enthusiasts need an experience that feels as carefully crafted as the cameos themselves, while demonstrating that distinctive design and solid engineering can coexist.",
    goals:
      "Build a fully functional shopping experience that doubles as a brand statement: establish a distinctive 70s typewriter visual identity with Courier New typography and ASCII decorative elements, implement real-time search across product attributes, create a complete cart system with quantity controls and localStorage persistence, support inline color variation switching without page reloads, and demonstrate production-quality React + Tailwind architecture across responsive breakpoints.",
    approach:
      "React 18 SPA on Figma Make with Tailwind CSS v4, Motion for entrance animations and transitions, Shadcn/ui component primitives (Dialog, Sheet, Badge, Input), and Lucide React icons. Architecture follows clean separation of concerns with focused single-responsibility components, two custom hooks (usePersistedCart, usePersistedWishlist) encapsulating localStorage with silent degradation, and strict TypeScript interfaces. Product catalog houses 8 SKUs across 10 color variations. Built iteratively using the TC-EBC prompt framework (Task, Context, Elements, Behavior, Constraints) across Foundation, Components, Interactions, Data & Logic, Design Systems, and Advanced categories.",
    outcome:
      "Shipped a complete e-commerce storefront with 8 product SKUs, 4 category filters, 15+ modular React components, 2 custom hooks, and 60+ structured prompt iterations — all as a pure client-side application with zero external APIs. The system includes a product grid with real-time fuzzy search, slide-out cart drawer with full CRUD operations, product detail modals with variant switching, wishlist toggle persistence, checkout confirmation flow, and a comprehensive 10-section case study documenting the design process, technical architecture, and key learnings.",
    repoUrl: "https://github.com/austncarsn/aesthetic-system-design",
    liveUrl: "https://www.figma.com/design/cameo-storefront",
    tags: ["React 18", "TypeScript", "Tailwind v4", "Figma Make", "Motion", "Shadcn/ui", "E-Commerce", "Design Systems"],
  },
  {
    id: "railroad-track-divider",
    title: "Railroad Track Divider Component",
    summary:
      "A precision-built SVG divider system inspired by N-scale rail geometry, designed for editorial UI structure and motion-ready interaction. The component supports configurable size/detail variants, optional accent channels, and progressive train animation for premium presentations.",
    problem:
      "Traditional section dividers often fail to carry brand identity and can feel visually generic. The challenge was to create a structural UI element that communicates craft while remaining reusable as a lightweight horizontal pattern.",
    goals:
      "Build a reusable divider component with clean viewport scaling, crisp geometry, and composable variants for size, detail level, and accent behavior. Ensure it can function as both a quiet layout separator and an enhanced motion-first showcase element.",
    approach:
      "Implemented divider geometry in SVG with deterministic spacing for ties and rails, then wrapped behavior in typed React props. Motion hooks were used for optional train transit while preserving reduced-motion compatibility. The system was authored so it can be dropped into layout contexts without route-level dependencies.",
    outcome:
      "Delivered a production-ready divider component and integrated it into the portfolio hero as a max-width horizontal track line. Added a dedicated case-study page to document design intent, implementation approach, and usage in the broader system.",
    repoUrl: "https://github.com/austncarsn/aesthetic-system-design",
    liveUrl: "https://www.figma.com/design/4A3l5WLd6P0zSOIetOR5lj/Railroad-Track-Divider-Component",
    tags: ["React", "TypeScript", "SVG", "Motion", "Component Design", "UI Systems"],
  },
  {
    id: "east-texas-heritage",
    title: "East Texas Historical Archive",
    summary:
      "A comprehensive digital archive preserving the architectural and industrial heritage of twelve Northeast Texas towns through editorial-quality presentation, structured historical narratives, and interactive cartography. Features config-driven town microsites, custom SVG atlas with population scaling, polymorphic section renderers, and a Quiet Luxury Editorial design system built with Playfair Display and warm ivory palette.",
    problem:
      "Northeast Texas towns spanning Caddo civilizations, Spanish missions, railroad booms, and oil strikes had their heritage scattered across TSHA handbook entries, county courthouse records, and aging newspapers with no single, well-designed digital resource organizing these narratives town-by-town. Existing county websites were utilitarian; heritage tourism sites lacked depth. The challenge: build a production-grade digital archive treating small-town Texas history with museum-catalog editorial rigor while remaining technically maintainable and extensible to new towns over time without backend dependencies or external map APIs.",
    goals:
      "Create a scalable historical archive system where adding a new town requires only data files with zero UI changes. Achieve editorial credibility through source citations with external links on every history section. Establish accessibility baseline with ARIA landmarks, focus-visible, aria-live regions, and semantic HTML throughout. Deliver sub-second perceived load with zero API calls, static data, lazy images, and memoized computations. Build interactive SVG atlas with population scaling and category filtering. Maintain design coherence across 12 towns through shared design tokens, component classes, and polymorphic section renderers.",
    approach:
      "React 18 SPA with hash-based routing managing 4 page-level views (home, town, history, map) and TypeScript schemas enforcing structure across 12 TownConfig files and comprehensive history data. Quiet Luxury Editorial design system using Playfair Display + Inter typography, warm ivory (#FFFEF9) palette, hairline rules, 0px border radius, and 4px spacing scale. Custom SVG atlas with computed projections, population-scaled markers, and proximity connectors eliminating Mapbox/Leaflet dependency. Config-driven loader pattern with typed HistoryData schema supporting 4 polymorphic section renderers (rich_text, feature, stat_panel, timeline). Inline markdown parser for bold/italic avoiding 40KB remark/rehype bundle. Performance optimization through React.memo, useMemo, useId, and lazy image loading.",
    outcome:
      "Shipped production-grade historical archive documenting 12 towns with 15+ custom components, 4 polymorphic section renderers, zero external API dependencies, and comprehensive accessibility implementation (ARIA landmarks, focus management, screen-reader optimization). Delivered config-driven architecture where new town addition requires only data entry, not UI engineering. Built custom SVG cartography system with population scaling and interactive filtering. Established editorial-quality presentation with source attribution chains maintaining TSHA, NPS, and Census citations. Created maintainable codebase with typed schemas, component-class hybrid architecture, and responsive patterns (Sheet mobile menu, collapsible chapter index, clamp typography). Included comprehensive case study with evidence map, decision log, and technical roadmap.",
    repoUrl: "https://github.com/austncarsn/aesthetic-system-design",
    liveUrl: "https://www.figma.com/design/QLl9wThR0IChTUaMRGMOoI/East-Texas-Heritage",
    tags: ["React 18", "TypeScript", "Tailwind v4", "Information Architecture", "Design Systems", "Data Visualization", "Editorial UI", "Cultural Heritage", "Accessibility"],
  },
  {
    id: "myprompts-ide",
    title: "MYPROMPTS - Prompt Engineering IDE",
    summary:
      "A production-grade markdown editor designed specifically for LLM prompt engineering. Features split-view editing with live preview, 12-stage intelligent formatting pipeline, buzzword detection system, three-column Smart Paste modal, command palette with fuzzy search, and comprehensive keyboard shortcuts — all wrapped in a Futuristic Hover Typewriter aesthetic with full dark mode support and Supabase backend integration.",
    problem:
      "Writing high-quality LLM prompts requires consistent structure, markdown formatting, and awareness of overused AI jargon — but no dedicated IDE existed for this workflow. Prompt engineers were juggling generic text editors, scattered formatting scripts, and manual jargon checks with no integrated solution. The challenge: build a specialized editor that understands prompt engineering patterns, detects buzzwords with replacement suggestions, applies intelligent formatting pipelines, and maintains a searchable prompt library with real-time metrics — all while providing the focused writing experience of a professional IDE.",
    goals:
      "Build a full-featured prompt engineering IDE with split-view markdown editing (Write/Preview/Split modes), a 12-stage formatting pipeline handling section headers, lists, grammar, and inline styles, buzzword detection flagging 170+ overused AI terms with alternatives, three-column Smart Paste modal for batch formatting, Cmd+K command palette, document outline with click-to-jump navigation, HUD status bar with word count and read-time metrics, searchable file sidebar with color labels, 11+ global keyboard shortcuts, full dark mode with CSS custom properties, debounced auto-save to Supabase backend, and user-defined regex transformation rules.",
    approach:
      "React 18 three-tier architecture on Figma Make: frontend with Tailwind v4 and Motion, Supabase Edge Function running Hono server on Deno, and Supabase KV store for persistence. Built 80+ files totaling over 10,000 lines including a 1,958-line CaseStudyPage, 1,544-line formatter pipeline (v6.5 with idempotency stabilization), and 1,243-line Smart Paste modal. Implemented Futuristic Hover Typewriter design system with JetBrains Mono, Inter, and Merriweather typography. Created comprehensive theming system with --os-* CSS custom properties supporting light/dark modes. Engineered debounced auto-save using refs to avoid stale closures. Built custom markdown renderers, noise texture overlays, scanline effects, and Swiss-style component patterns. Full keyboard-driven workflow with global shortcuts and focus management.",
    outcome:
      "Shipped production-ready prompt engineering IDE with complete markdown editing suite, intelligent formatting pipeline processing plain text through 12 transformation stages, buzzword detection panel with contextual alternatives, three-column Smart Paste processor, command palette supporting fuzzy search across all actions, document outline navigation, real-time metrics tracking (word count, read time, buzzword severity), searchable prompt library with color-coded organization, custom regex rule system, comprehensive keyboard shortcuts (Cmd+K palette, Cmd+S save, Cmd+Shift+F format, Cmd+Shift+V paste), full dark mode implementation, Supabase backend with auto-save persistence, and 10-section case study documenting the architecture. Includes 9 CSS-only wireframe mockups, complete handoff documentation, and platform-constraint compliance for Figma Make deployment.",
    repoUrl: "https://github.com/austncarsn/aesthetic-system-design",
    liveUrl: "https://austincarson.dev/#/prompt-notebook",
    tags: ["React 18", "TypeScript", "Tailwind v4", "Figma Make", "Supabase", "Hono", "Markdown", "Motion", "Design Systems", "LLM Tools", "Prompt Engineering", "Edge Functions"],
  },
  {
    id: "claw-machine",
    title: "Interactive Claw Machine",
    summary:
      "A fully playable arcade claw machine rendered entirely with CSS gradients, box-shadows, and clip-path geometry — zero SVG or bitmap assets for structural elements. Features an 8-state game loop with deterministic state machine, Web Audio API synth engine with 12+ distinct sound effects, one-point-perspective 3D interior, and responsive layout maintaining cinematic 21:9 aspect ratio from mobile to ultra-wide displays.",
    problem:
      "Interactive portfolio projects are rare. Most developers showcase CRUD apps or static landing pages — work that demonstrates competence but not craft. Portfolio projects rarely demonstrate real interactivity, CSS-art projects tend to be flat illustrations with no functional game logic, and most web-based arcade recreations rely heavily on canvas or pre-rendered sprites, hiding the craft of pure CSS. The challenge was to build something that stops the scroll: a project that is visually rich, mechanically complete, and technically surprising — proving the modern CSS and React ecosystem is powerful enough to render hyper-detailed 3D environments, run real-time physics simulations, and synthesize audio without a single image asset or canvas element.",
    goals:
      "Build a fully functional arcade game with zero external image/SVG assets for structural elements — every surface rendered via CSS. Implement complete 8-state game loop with deterministic state machine (no ambiguous transitions). Create Web Audio API synth engine with 12+ distinct sound effects without audio file downloads. Design one-point-perspective 3D interior using only clip-path geometry and gradients. Ensure responsive layout from mobile portrait to ultra-wide, maintaining cinematic 21:9 aspect ratio. Achieve sub-16ms animation budget by offloading looping animations to CSS @keyframes while reserving Motion for reactive physics.",
    approach:
      "Studied real UFO Catcher machines to understand materials, lighting, proportions, and player psychology. Established the material-constant architecture and 8-state game loop as the system backbone. Built CSS-only surface library with chrome gradients, glass simulation, and one-point-perspective box geometry. Implemented physics systems including spring gantry motion, pendulum swing dynamics, cable stretch, along with collision logic and particle effects. Conducted performance optimization pass migrating looping animations to CSS @keyframes, adding willChange hints, and reducing particle counts to maintain 60fps. Delivered as single-file ~1000-line React component with 40+ unique gradient/shadow constants, split 60/40 between CSS @keyframes and Motion for animation.",
    outcome:
      "Shipped production-ready playable claw machine with 0 external assets (zero SVGs, zero bitmaps for structure), 40+ unique CSS material constants defining chrome, glass, and metal surfaces, ~1000 lines of code in single-file component architecture, 60/40 animation split between CSS @keyframes and Motion, 12+ synthesized audio effects via Web Audio API, and strict 8-state discriminated union finite state machine. Complete with embedded 10-section case study documenting problem statement, goals, process, system overview, features, prompt system architecture, results, and key learnings. Demonstrates that modern CSS is sufficient for building fully interactive 3D game experiences without canvas or external assets.",
    repoUrl: "https://github.com/austncarsn/aesthetic-system-design",
    liveUrl: "https://www.figma.com/design/P1pD4x9a9rMY600tUnrdn2/Claw-Machine",
    tags: ["React 18", "TypeScript", "CSS Art", "Web Audio API", "Motion", "Game Development", "3D CSS", "State Machines", "Physics Simulation", "Interactive Design"],
  },
];
