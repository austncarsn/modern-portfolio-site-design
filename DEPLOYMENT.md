# Deployment Checklist

Your portfolio is production-ready. Follow this checklist to deploy:

## Pre-Deployment

- [x] Build compiles cleanly (`npm run build`)
- [x] All content is present (76 gallery items, 5 projects, resume, etc.)
- [x] SEO meta tags configured
- [x] sitemap.xml and robots.txt added
- [x] .gitignore configured
- [x] README documentation complete
- [x] Accessibility verified (WCAG 2.1 AA)

## Deployment Options

### Option 1: Netlify (Recommended - Easiest)
1. Create account at netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git repository
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Node version: 18 or higher
5. Click "Deploy site"
6. ✅ Includes automatic `_redirects` for SPA routing

**Custom Domain:**
- Go to Site settings → Domain management
- Add custom domain (austincarson.dev)
- Follow DNS configuration instructions

### Option 2: Vercel
1. Create account at vercel.com
2. Click "New Project"
3. Import your Git repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Click "Deploy"

### Option 3: GitHub Pages
1. In package.json, update base URL if needed
2. Build locally: `npm run build`
3. Install gh-pages: `npm install --save-dev gh-pages`
4. Add deploy script to package.json:
   ```json
   "scripts": {
     "deploy": "gh-pages -d build"
   }
   ```
5. Run: `npm run deploy`
6. Enable GitHub Pages in repo Settings

## Post-Deployment

- [ ] Test all routes work (/, /#/projects, /#/gallery, etc.)
- [ ] Verify images load correctly
- [ ] Check responsive design on mobile
- [ ] Test lightbox functionality in gallery
- [ ] Verify resume download/print works
- [ ] Test social sharing (check og:image appears)
- [ ] Submit sitemap to Google Search Console
- [ ] Add site to Bing Webmaster Tools

## Optional Enhancements

- [ ] Add Google Analytics (if desired)
- [ ] Set up form backend for contact (Formspree, Basin, etc.)
- [ ] Create Open Graph image (1200×630px)
- [ ] Add favicon set (16×16, 32×32, 180×180)
- [ ] Configure custom 404 page

## Domain Configuration

If using **austincarson.dev**:

1. Update all meta tags in `index.html` with production URL
2. Update sitemap.xml URLs
3. Configure DNS A/CNAME records at domain registrar
4. Enable HTTPS (auto on Netlify/Vercel)

## Performance Verification

After deployment, test with:
- Lighthouse (in Chrome DevTools)
- PageSpeed Insights
- GTmetrix

Target scores: 90+ on all metrics

---

**Current Status**: ✅ Production-ready, zero blockers

## Quick Deploy Commands

```bash
# Build for production
npm run build

# Test production build locally
npm install -g serve
serve -s build

# Deploy to Netlify (after connecting)
netlify deploy --prod

# Deploy to Vercel (after vercel init)
vercel --prod
```

---

**Need help?** All documentation is in README.md
