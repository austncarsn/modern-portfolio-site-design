# Developer Handoff Documentation
## Austin Carson Portfolio Site

**Last Updated:** February 8, 2026
**Version:** 1.0.0
**Tech Stack:** React 18, TypeScript, Vite, React Router, Framer Motion

---

## Table of Contents

1. [Application Architecture](#application-architecture)
2. [Design System](#design-system)
3. [Component Inventory](#component-inventory)
4. [File Structure](#file-structure)
5. [Naming Conventions](#naming-conventions)
6. [Architectural Elements](#architectural-elements)
7. [Color Palettes](#color-palettes)
8. [Typography System](#typography-system)
9. [Spacing System](#spacing-system)
10. [Animation Patterns](#animation-patterns)
11. [Build & Deployment](#build-deployment)
12. [Development Workflow](#development-workflow)

---

## Application Architecture

### High-Level Overview

This is a **single-page application (SPA)** built with React and React Router. The application uses a **component-based architecture** with clear separation of concerns.

```
┌─────────────────────────────────────────────┐
│           HomeWithHero (Page)               │
├─────────────────────────────────────────────┤
│  HeroSection                                │
│  FrenchDivider (blue shelf - top boundary)  │
│  CardNavigation (French blue #4A6FA5)       │
│  ShelfDivider (ivory shelf - bottom)        │
│  Footer (black #0a0a0a)                     │
└─────────────────────────────────────────────┘
```

### Core Architectural Concepts

1. **French Blue Navigation Panel**: The central navigation section is styled as "French blue painted wood paneling" - a museum catalog aesthetic with editorial grid layout.

2. **Architectural Shelf Dividers**: Two distinct shelf components act as visual boundaries:
   - **Top Shelf** (FrenchDivider): French blue, sits above navigation
   - **Bottom Shelf** (ShelfDivider): Warm ivory/stone, sits above footer

3. **Recessed Footer**: Black footer with inset shadows creating a "-z depth" effect (pushed back visually).

### Page Flow

```
Hero Section → Blue Shelf → Navigation Cards → Ivory Shelf → Black Footer
   (ivory)      (blue)        (blue #4A6FA5)     (stone)      (black)
```

---

## Design System

### Design Philosophy

**Inspiration**: Museum catalog meets Parisian study
**Aesthetic**: Architectural French interior detailing (Louvre-era molding, gallery plinths)
**Typography**: Editorial hierarchy with display fonts for headings, body fonts for UI
**Color Strategy**: Restrained palette - ivory base, French blue accent, black footer

### CSS Custom Properties (Design Tokens)

All design tokens are defined in `src/styles/globals.css`:

```css
:root {
  /* Spacing Scale */
  --sp-1: 4px;
  --sp-2: 8px;
  --sp-3: 12px;
  --sp-4: 16px;
  --sp-5: 24px;
  --sp-6: 32px;
  --sp-7: 48px;
  --sp-8: 64px;
  --sp-9: 96px;
  --sp-10: 128px;

  /* Typography Scale */
  --ts-overline: 11px;
  --ts-small: 13px;
  --ts-caption: 14px;
  --ts-body: 16px;
  --ts-h3: 24px;
  --ts-h2: 32px;
  --ts-h1: 48px;

  /* Color System */
  --surface-0: #FFFEF9;        /* Primary background (ivory) */
  --surface-1: #F5F4F1;        /* Secondary background */
  --text-1: #1a1815;           /* Primary text */
  --text-2: #5a5550;           /* Secondary text */
  --border-1: rgba(0,0,0,0.08);

  /* Selection Colors */
  --selected-bg: #1a1815;      /* Dark button backgrounds */
  --selected-fg: #FFFEF9;      /* Light text on dark */

  /* Font Stacks */
  --font-display: /* Display font for headings */;
  --font-body: /* Body font for UI text */;
}
```

---

## Component Inventory

### Core Layout Components

#### 1. **HeroSection** (`src/components/HeroSection.tsx`)
- **Purpose**: Landing hero with title, subtitle, and gradient background
- **Styling**: Ivory gradient background, centered text, responsive typography
- **Key Props**: None (static content)
- **Notes**: Uses motion/react for fade-in animation

#### 2. **CardNavigation** (`src/components/CardNavigation.tsx`)
- **Purpose**: Primary navigation grid (6 navigation cards)
- **Background**: French blue (#4A6FA5)
- **Layout**: 2×3 grid on desktop, stacked on mobile
- **Cards**:
  - Profile (Info)
  - Work (Projects)
  - Tools (Prompt Library)
  - Gallery
  - Learning (Flashcards)
  - Resume
- **Styling**: Editorial grid with hairline borders (rgba(255,255,255,0.2))
- **Hover State**: `rgba(0,0,0,0.08)` background darkening
- **Focus State**: 2px white outline with 3px offset

#### 3. **Footer** (`src/components/Footer.tsx`)
- **Purpose**: Site footer with tagline, CTA, navigation, social links, copyright
- **Background**: Black (#0a0a0a) with subtle gradient overlay
- **Depth Treatment**: Inset shadows for recessed panel effect
- **Layout**: Single-zone (no separate copyright bar)
- **Sections**:
  - Tagline (--ts-h3, display font)
  - CTA button (Email link)
  - Hairline divider (max-width: 560px)
  - Nav links (Projects, Gallery, Info)
  - Social links (GitHub, LinkedIn, Dribbble)
  - Copyright (small, subdued)

### Architectural Dividers

#### 4. **FrenchDivider** (`src/components/FrenchDivider.tsx`)
- **Purpose**: Top shelf divider (above CardNavigation)
- **Color Palette**: French blue (#4A6FA5 and variants)
- **Variants**:
  - `"thin"` - Picture-rail molding (6px total)
  - `"shelf"` - Gallery shelf with full profile (48px total)
  - `"cornice"` - Symmetric cornice (18px total) ← **Used on homepage**
- **Layers**: Beveled beads, fluted channel, hairlines
- **Pattern**: Uses `repeating-linear-gradient` for ribbed texture

#### 5. **ShelfDivider** (`src/components/ShelfDivider.tsx`)
- **Purpose**: Bottom shelf divider (above Footer)
- **Color Palette**: Warm stone/ivory (#dbd9d2 and variants)
- **Profile**: 10-layer architectural moulding
  - Top highlight (2px)
  - Hairlines
  - Beveled beads (3px)
  - Palmette frieze (10px)
  - Fluted fascia (32px main body)
  - Dentil row (5px)
  - Bottom gradient (3px)
  - Cast shadow (32px gradient below)
- **Texture**: Fluted pattern + fractal noise + light falloff

### Page Components

#### 6. **HomeWithHero** (`src/pages/HomeWithHero.tsx`)
- **Purpose**: Homepage composition
- **Structure**:
```tsx
<HeroSection />
<FrenchDivider variant="cornice" />
<CardNavigation />
<ShelfDivider />
<Footer />
```

#### 7. **ProjectsPage** (`src/pages/ProjectsPage.tsx`)
- **Purpose**: Project listing grid
- **Layout**: 1/2/3 column responsive grid (sm/lg breakpoints)
- **Cards**: Project title, summary, tags, numbered index
- **Styling**: Bordered grid cells, hover states

#### 8. **Other Pages**
- GalleryPage
- InfoPage
- FlashcardsPage
- ResumePage
- ProjectDetailPage
- PromptLibraryApp
- PromptNotebookApp

### Utility Components

#### 9. **motion-variants.ts** (`src/components/motion-variants.ts`)
- **Purpose**: Reusable Framer Motion animation variants
- **Exports**: `useStaggerVariants()` hook
- **Usage**: Staggered fade-in animations for lists/grids

---

## File Structure

```
Modern Portfolio Site Design/
├── src/
│   ├── components/
│   │   ├── CardNavigation.tsx       # French blue nav grid
│   │   ├── FrenchDivider.tsx        # Top shelf (blue)
│   │   ├── ShelfDivider.tsx         # Bottom shelf (ivory)
│   │   ├── Footer.tsx               # Black footer
│   │   ├── HeroSection.tsx          # Landing hero
│   │   ├── motion-variants.ts       # Animation patterns
│   │   └── [other components]
│   ├── pages/
│   │   ├── HomeWithHero.tsx         # Homepage composition
│   │   ├── ProjectsPage.tsx         # Projects grid
│   │   ├── GalleryPage.tsx
│   │   ├── InfoPage.tsx
│   │   ├── FlashcardsPage.tsx
│   │   ├── ResumePage.tsx
│   │   └── ProjectDetailPage.tsx
│   ├── data/
│   │   └── projects.ts              # Project data
│   ├── styles/
│   │   └── globals.css              # Design tokens + global styles
│   ├── App.tsx                      # Router setup
│   └── main.tsx                     # React entry point
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── DEVELOPER_HANDOFF.md             # This file
```

---

## Naming Conventions

### Component Files
- **PascalCase** for component files: `CardNavigation.tsx`, `HeroSection.tsx`
- **Descriptive names** that indicate purpose: `ShelfDivider` (not `Divider1`)
- **Suffixes** for variants: `HomeWithHero` (page variant), `FrenchDivider` (architectural type)

### CSS Classes
- **camelCase** for scoped classes: `.cnSection`, `.cnLink`, `.cnGrid`
- **Prefix pattern**: Component-specific prefix to avoid collisions
  - `cn` = CardNavigation
  - `plinth` = Footer section
  - No global classes except design tokens

### Variables & Props
- **camelCase** for JavaScript: `backgroundColor`, `maxWidth`, `flexDirection`
- **kebab-case** for CSS custom properties: `--sp-4`, `--ts-body`, `--surface-0`
- **Descriptive prop names**: `variant` (not `type`), `tone` (not `style`)

### Color Palette Constants
- **PascalCase object with const assertion**:
```typescript
const S = {
  bright: "#f0efe9",
  light:  "#e8e7e1",
  mid:    "#dbd9d2",
  border: "#cac5bb",
  shadow: "#b8b3a8",
  deep:   "#a9a49a",
} as const;
```
- **Semantic names**: `bright`, `light`, `mid` (not `color1`, `color2`)

### Data Files
- **Lowercase with hyphens**: `projects.ts`, `motion-variants.ts`
- **Export pattern**: Named exports preferred over default exports

---

## Architectural Elements

### The Shelf Divider System

Both shelf dividers are **multi-layered architectural moulding** components inspired by French interior detailing (Louis XVI era, Louvre galleries, Parisian apartments).

#### Layer Anatomy (ShelfDivider example)

```
┌─────────────────────────────────────┐
│  Top highlight (catching light)     │  2px  - bright
├─────────────────────────────────────┤
│  Hairline rule                      │  1px  - border
├─────────────────────────────────────┤
│  Top bead (beveled lip)             │  3px  - mid (inset shadows)
├─────────────────────────────────────┤
│  Palmette frieze (recessed)         │  10px - light (ornament SVG)
├─────────────────────────────────────┤
│  Fillet groove                      │  1px  - shadow
├─────────────────────────────────────┤
│  Acanthus scroll channel            │  14px - mid (ornament SVG)
├─────────────────────────────────────┤
│  Hairline fillet                    │  1px  - border
├─────────────────────────────────────┤
│  Main fluted body (ribbed texture)  │  32px - light (patterns + noise)
├─────────────────────────────────────┤
│  Dentil row (repeating teeth)       │  5px  - light (pattern)
├─────────────────────────────────────┤
│  Lower fascia (underside)           │  6px  - shadow
├─────────────────────────────────────┤
│  Bottom edge (gradient)             │  3px  - shadow → deep
├─────────────────────────────────────┤
│  Hairline rule                      │  1px  - deep
└─────────────────────────────────────┘
     ↓ Cast shadow (absolute)         │  32px - gradient fade
```

### Visual Hierarchy

```
Lightest                             Darkest
───────────────────────────────────────────────
bright → light → mid → border → shadow → deep
```

Each palette step creates **depth through layering**:
- **Bright**: Top surfaces catching light
- **Light**: Primary faces
- **Mid**: Neutral surfaces
- **Border**: Hairlines and grooves
- **Shadow**: Recessed areas
- **Deep**: Undersides and bottom edges

---

## Color Palettes

### Primary Palette (Site Foundation)

```typescript
// Defined in globals.css
--surface-0: #FFFEF9;  // Primary background (warm ivory)
--surface-1: #F5F4F1;  // Secondary surfaces
--text-1: #1a1815;     // Primary text (near-black)
--text-2: #5a5550;     // Secondary text (warm gray)
```

### French Blue Palette (CardNavigation + Top Shelf)

```typescript
// Used in: FrenchDivider.tsx, CardNavigation.tsx
const P = {
  bright: "#6B8BB8",   // Lightest blue (top highlights)
  light:  "#5A7DAE",   // Light blue (primary faces)
  mid:    "#4A6FA5",   // Main blue (core color)
  border: "#3F5E8A",   // Blue-gray (borders)
  shadow: "#354F75",   // Dark blue (recessed areas)
  deep:   "#2A3F5F",   // Deepest blue (undersides)
} as const;
```

**Usage Context**: Navigation section background + architectural top shelf

### Warm Stone Palette (Bottom Shelf)

```typescript
// Used in: ShelfDivider.tsx
const S = {
  bright: "#f0efe9",   // Lightest ivory (top highlights)
  light:  "#e8e7e1",   // Light stone (primary faces)
  mid:    "#dbd9d2",   // Mid stone (core color)
  border: "#cac5bb",   // Warm gray (borders)
  shadow: "#b8b3a8",   // Taupe (recessed areas)
  deep:   "#a9a49a",   // Deep stone (undersides)
} as const;
```

**Usage Context**: Bottom shelf divider above footer

### Black Palette (Footer)

```typescript
// Used in: Footer.tsx
background: linear-gradient(
  to bottom,
  rgba(255,255,255,0.02) 0%,    // Subtle top highlight
  rgba(0,0,0,0.95) 100%          // Deep black
), #0a0a0a;                      // Base black
```

**Depth Treatment**:
```css
box-shadow:
  inset 0 2px 0 rgba(255,255,255,0.05),     /* Top rim highlight */
  inset 0 4px 12px rgba(0,0,0,0.4),         /* Primary inset */
  inset 0 -20px 30px rgba(0,0,0,0.3);       /* Bottom shadow */
```

### Color on Color Contrast (WCAG AA Compliance)

#### French Blue Section (#4A6FA5)
- **Text on blue**: `rgba(255,255,255,0.95)` (primary)
- **Secondary text**: `rgba(255,255,255,0.7)` (labels)
- **Borders**: `rgba(255,255,255,0.2)`
- **Hover state**: `rgba(0,0,0,0.08)` darken

#### Black Footer (#0a0a0a)
- **Text on black**: `rgba(255,255,255,0.95)` (primary)
- **Secondary text**: `rgba(255,255,255,0.75)` (links)
- **Subdued text**: `rgba(255,255,255,0.55)` (copyright)
- **Borders**: `rgba(255,255,255,0.2)`

---

## Typography System

### Type Scale (Mobile → Desktop)

```css
--ts-overline: 11px;   /* Uppercase labels, metadata */
--ts-small:    13px;   /* Small UI text, captions */
--ts-caption:  14px;   /* Button text, form labels */
--ts-body:     16px;   /* Body text, paragraphs */
--ts-h3:       24px;   /* Section headings */
--ts-h2:       32px;   /* Card titles */
--ts-h1:       48px;   /* Page titles */
```

### Font Families

```css
--font-display: /* Display serif for headings */
--font-body:    /* Sans-serif for UI text */
```

**Display Font Usage**:
- Page titles (h1)
- Card titles in navigation grid (h2)
- Footer tagline (h3)

**Body Font Usage**:
- All UI text (buttons, labels, nav)
- Body paragraphs
- Captions and metadata

### Typography Patterns

#### Overline Pattern (Category Labels)
```css
font-family: var(--font-body);
font-size: var(--ts-overline);
letter-spacing: 0.14em;
text-transform: uppercase;
color: rgba(255,255,255,0.65);
```

**Used in**: Card categories, section labels

#### Display Heading Pattern
```css
font-family: var(--font-display);
font-size: var(--ts-h2);
font-weight: 400;
line-height: 1.1;
letter-spacing: -0.015em;
```

**Used in**: Card titles, hero title

#### Body Text Pattern
```css
font-family: var(--font-body);
font-size: var(--ts-body);
line-height: 1.6;
color: var(--text-2);
```

**Used in**: Descriptions, paragraphs

---

## Spacing System

### Spacing Scale Philosophy

8px base unit with exponential growth for architectural rhythm.

```
--sp-1: 4px    (0.5× base) - Tight spacing
--sp-2: 8px    (1× base)   - Base unit
--sp-3: 12px   (1.5× base) - Small gaps
--sp-4: 16px   (2× base)   - Standard padding
--sp-5: 24px   (3× base)   - Section spacing (small)
--sp-6: 32px   (4× base)   - Section spacing (medium)
--sp-7: 48px   (6× base)   - Section spacing (large)
--sp-8: 64px   (8× base)   - Major sections
--sp-9: 96px   (12× base)  - Page sections
--sp-10: 128px (16× base)  - Hero spacing
```

### Common Spacing Patterns

#### Card Padding
```css
padding: 28px var(--sp-4);  /* Custom vertical, token horizontal */
```

#### Section Gaps
```css
gap: var(--sp-6);           /* Between major elements */
gap: var(--sp-5);           /* Between related elements */
```

#### Footer Spacing
```css
padding: var(--sp-10) var(--sp-4) var(--sp-9);
/* Top: 128px, Sides: 16px, Bottom: 96px */
```

#### Container Max-Width
```css
max-width: 1120px;          /* Standard content width */
max-width: 640px;           /* Narrow content (taglines) */
max-width: 600px;           /* Page headers */
max-width: 560px;           /* Footer divider */
```

---

## Animation Patterns

### Framer Motion Integration

All animations use **Framer Motion** (`motion/react`).

#### Stagger Animation Pattern

```typescript
// src/components/motion-variants.ts
export function useStaggerVariants() {
  return {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: "easeOut",
        },
      },
    },
  };
}
```

**Usage**:
```tsx
const { container, item } = useStaggerVariants();

<motion.div variants={container} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div key={item.id} variants={item}>
      {/* content */}
    </motion.div>
  ))}
</motion.div>
```

#### Fade-In Pattern (Dividers)

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
```

#### Scroll-Triggered Pattern (Footer)

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
  variants={container}
>
```

### CSS Transitions

**Hover states** use CSS transitions (not Framer Motion):

```css
transition: background-color 300ms ease;
transition: color 200ms ease;
transition: opacity 200ms ease, transform 200ms ease;
```

**Focus-visible states** are instant (no transition):

```css
.cnLink:focus-visible {
  outline: 2px solid rgba(255,255,255,0.9);
  outline-offset: 3px;
}
```

---

## Build & Deployment

### Scripts

```json
{
  "dev": "vite",                    // Development server
  "build": "vite build",            // Production build
  "preview": "vite preview",        // Preview production build
  "typecheck": "tsc --noEmit"      // TypeScript check (if added)
}
```

### Build Output

```
build/
├── index.html
├── assets/
│   ├── index-[hash].css          // Bundled styles
│   ├── index-[hash].js           // Main JS bundle
│   └── [component]-[hash].js     // Code-split chunks
└── [static assets]
```

### Environment Variables

None currently in use. All configuration is hardcoded.

### Browser Support

- Modern browsers (ES2020+)
- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

---

## Development Workflow

### Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Style Guidelines

#### 1. **Component Structure**
```tsx
// 1. Imports
import { memo } from "react";
import { motion } from "motion/react";

// 2. Types/Interfaces
interface Props {
  variant?: "blue" | "ivory";
}

// 3. Constants (outside component)
const PALETTE = {
  /* colors */
} as const;

// 4. Component
export const Component = memo(function Component({ variant }: Props) {
  // 5. Hooks
  const { container, item } = useStaggerVariants();

  // 6. Render
  return (
    <section>
      {/* JSX */}
    </section>
  );
});
```

#### 2. **Styling Approach**

**Inline styles** for component-specific styling:
```tsx
style={{
  display: "flex",
  gap: "var(--sp-4)",
  backgroundColor: "#4A6FA5",
}}
```

**Scoped CSS** via `<style>` tag for hover/focus states:
```tsx
<style>{`
  .myComponent {
    background: blue;
  }
  .myComponent:hover {
    background: darkblue;
  }
`}</style>
```

**Design tokens** for all spacing/typography:
```tsx
padding: "var(--sp-7) var(--sp-4)"
fontSize: "var(--ts-body)"
```

#### 3. **No External CSS Files**

Components are **self-contained**. No separate `.css` files except `globals.css` for design tokens.

#### 4. **Accessibility Requirements**

- **Focus-visible** states on all interactive elements
- **ARIA labels** on navigation regions
- **Semantic HTML**: `<header>`, `<main>`, `<footer>`, `<nav>`
- **Keyboard navigation**: All links/buttons accessible via Tab
- **Screen reader text**: `.sr-only` class for hidden labels

```tsx
<h1 className="sr-only">Austin Carson</h1>
<nav aria-label="Primary navigation">
```

#### 5. **Performance Patterns**

- **memo()** for components that don't need frequent re-renders
- **Code splitting**: Each page is a separate chunk
- **Image optimization**: Use WebP/AVIF where possible
- **Lazy loading**: Framer Motion animations don't block render

---

## Key Architectural Decisions

### 1. **Why Inline Styles?**

- **Co-location**: Styling lives with component logic
- **Type safety**: TypeScript checks all style values
- **No class name collisions**: Scoped by component
- **Design tokens**: All values use CSS variables for consistency

### 2. **Why Two Shelf Components?**

- **Visual hierarchy**: Top/bottom boundaries have different colors
- **Semantic clarity**: `FrenchDivider` = blue, `ShelfDivider` = ivory
- **Reusability**: Each shelf can be used independently on other pages

### 3. **Why Framer Motion Over CSS Animations?**

- **Declarative**: Variants pattern is more readable
- **React integration**: Respects component lifecycle
- **Stagger animations**: Built-in support for sequential reveals
- **Scroll-triggered**: `whileInView` viewport detection

### 4. **Why No CSS Modules/Tailwind?**

- **Simplicity**: Inline styles + design tokens = minimal tooling
- **Portability**: Components are self-contained, no external dependencies
- **Performance**: Vite handles bundling efficiently
- **Flexibility**: Can add Tailwind later if needed (already has `className` support)

---

## Common Patterns Reference

### Pattern 1: Architectural Shelf Component

```tsx
// Define palette
const P = {
  bright: "#color1",
  light:  "#color2",
  // ...
} as const;

// Layer each visual element as explicit <div>
<div style={{ height: 2, backgroundColor: P.bright }} />
<div style={{ height: 1, backgroundColor: P.border }} />
<div style={{ height: 10, backgroundColor: P.light }}>
  {/* Pattern overlays */}
</div>
```

### Pattern 2: Responsive Grid

```tsx
<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr",
  }}
  className="md:grid-cols-2!"
>
```

**Tailwind overrides** use `!` suffix:
- `sm:grid-cols-2!` (✓ correct)
- `sm:!grid-cols-2` (✗ deprecated)

### Pattern 3: Interactive Link/Button

```tsx
<Link
  to="/path"
  className="myLink"
  style={{
    textDecoration: "none",
    transition: "background-color 300ms ease",
  }}
>
  {/* content */}
</Link>

<style>{`
  .myLink:hover {
    background-color: rgba(0,0,0,0.08);
  }
  .myLink:focus-visible {
    outline: 2px solid rgba(255,255,255,0.9);
    outline-offset: 3px;
  }
`}</style>
```

### Pattern 4: Scoped Animation

```tsx
const { container, item } = useStaggerVariants();

<motion.ul variants={container} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.li key={item.id} variants={item}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

---

## Troubleshooting

### Build Issues

**Problem**: `Vite CJS API deprecated` warning
**Solution**: Ignore - this is a Vite internal warning, not an error

**Problem**: TypeScript errors
**Solution**: Run `npm install` to ensure types are installed

### Styling Issues

**Problem**: Shelf colors not updating
**Solution**: Hard refresh (Cmd+Shift+R) or clear Vite cache (`rm -rf node_modules/.vite`)

**Problem**: Design tokens not working
**Solution**: Check `globals.css` is imported in `main.tsx`

### Animation Issues

**Problem**: Stagger not working
**Solution**: Ensure parent has `variants={container}` and children have `variants={item}`

**Problem**: Scroll animation not triggering
**Solution**: Check `viewport={{ once: true, amount: 0.2 }}` is set

---

## Future Enhancements

### Potential Improvements

1. **Dark Mode**: Add theme toggle with CSS custom property overrides
2. **i18n**: Internationalization support for multi-language
3. **CMS Integration**: Headless CMS for project content
4. **Blog**: Add blog section with MDX support
5. **Analytics**: Google Analytics or Plausible tracking
6. **SEO**: Meta tags, OpenGraph, structured data
7. **PWA**: Service worker for offline support

### Technical Debt

1. **TypeScript Coverage**: Add explicit types for all props
2. **Testing**: Add Vitest + React Testing Library
3. **E2E Tests**: Playwright for critical user flows
4. **Accessibility Audit**: WAVE/Axe checks
5. **Performance Monitoring**: Core Web Vitals tracking

---

## Contact & Support

**Developer**: Austin Carson
**Email**: austncarsn@gmail.com
**GitHub**: https://github.com/austncarsn
**Portfolio**: [Live URL]

---

## Appendix: Quick Reference

### Essential Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run preview    # Preview production build
```

### Key Files

```
src/components/CardNavigation.tsx  # French blue nav grid
src/components/FrenchDivider.tsx   # Blue shelf (top)
src/components/ShelfDivider.tsx    # Ivory shelf (bottom)
src/components/Footer.tsx          # Black footer
src/pages/HomeWithHero.tsx         # Homepage composition
src/styles/globals.css             # Design tokens
```

### Color Cheat Sheet

```
French Blue:  #4A6FA5
Warm Stone:   #dbd9d2
Black:        #0a0a0a
Ivory:        #FFFEF9
Text:         #1a1815
```

### Spacing Cheat Sheet

```
--sp-4:  16px  # Standard padding
--sp-6:  32px  # Section spacing
--sp-7:  48px  # Large sections
--sp-9:  96px  # Major sections
--sp-10: 128px # Hero spacing
```

---

**Document Version:** 1.0.0
**Last Updated:** February 8, 2026
**Next Review:** March 2026
