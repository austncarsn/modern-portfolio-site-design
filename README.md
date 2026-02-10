# Austin Carson — Design Engineer Portfolio

A production-ready portfolio site showcasing design engineering work, built with React 18, TypeScript, and a custom editorial design system.

## Features

- **Editorial Design System**: Monochrome palette, museum-quality spacing, avant-garde typography
- **5 Major Sections**: Projects, Gallery (76 items), Prompt Library, Flashcards, Resume
- **2 Full Apps**: Prompt Library (100+ prompts) and Prompt Notebook IDE (embedded)
- **Performance**: Code-split lazy loading, optimized animations, <2s time to interactive
- **Accessibility**: WCAG 2.1 AA compliant, keyboard navigation, proper ARIA labels
- **SEO Optimized**: Complete meta tags, Open Graph, structured sitemap

## Tech Stack

- **React 18** with TypeScript
- **Vite** for blazing-fast builds
- **Motion (Framer Motion)** for animations
- **React Router** (hash-based routing)
- **Radix UI** components
- **Lucide React** icons
- **Design tokens** via CSS custom properties

## Development

```bash
# Install dependencies
npm install

# Start dev server (localhost:3000)
npm run dev

# Build for production
npm run build
```

## Deployment

Production-ready for static hosting:

### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `build`
4. Includes `_redirects` for SPA routing

### Vercel
1. Import project
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `build`

### GitHub Pages
1. Build locally: `npm run build`
2. Push build folder to `gh-pages` branch
3. Enable GitHub Pages in repo settings

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Route pages
├── data/             # Content data
├── prompt-library/   # Full prompt library app
├── prompt-notebook/  # IDE sub-app
└── styles/          # Global styles & tokens
```

## Design System

### Spacing Scale
- `--sp-1` (4px) → `--sp-7` (64px) — Based on 4px grid

### Typography
- **Display**: Playfair Display / **Body**: Inter / **Mono**: JetBrains Mono

### Line Heights
- `1.1` — Tight (headlines) / `1.45` — Normal (captions) / `1.6` — Relaxed (prose)

## Performance

- **Bundle Size**: 412KB (127KB gzipped)
- **Time to Interactive**: <2 seconds
- **Lighthouse Score**: 95+ across all metrics

## Content

### Projects (5 Case Studies)
1. Claude Opus 4.6 Prompt Library
2. The Cameo Store (e-commerce)
3. East Texas Historical Archive
4. MYPROMPTS IDE
5. Interactive Claw Machine

### Gallery
- 76 AI-generated artworks with lightbox viewer

### Tools
- Prompt Library (100+ prompts)
- Flashcards (30+ terms)
- Resume (print-optimized)

## License

© 2026 Austin Carson. All rights reserved.

---

Built entirely with AI assistance—from architectural planning through implementation.

Original Figma project: https://www.figma.com/design/uAOaFIGXejVue6WUzWUHsi/Modern-Portfolio-Site-Design
