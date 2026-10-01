# Deployment Guide

## GitHub Pages Configuration

**CRITICAL:** This project uses GitHub Actions to build and deploy. The GitHub Pages source **MUST** be configured correctly.

### Required Settings

1. Go to: https://github.com/victorsaly/correlateAI/settings/pages
2. Under **"Build and deployment"** → **"Source"**
3. Select: **"GitHub Actions"** (NOT "Deploy from a branch")
4. Save changes

### Why This Matters

- ❌ **Wrong:** "Deploy from a branch" (main/root) → Deploys the dev `index.html` with source file references
- ✅ **Correct:** "GitHub Actions" → Deploys the built `dist/` folder with compiled assets

### Symptoms of Misconfiguration

If you see these errors on the live site:
```
Failed to load module script: Expected a JavaScript module but the server responded with a MIME type of "application/octet-stream"
main.tsx:1 Failed to load...
site.webmanifest 404 error
```

**This means GitHub Pages is deploying from the wrong source!**

## Deployment Workflow

The deployment happens automatically via `.github/workflows/deploy.yml`:

1. **Trigger:** Push to `main` branch (or manual workflow dispatch)
2. **Build:** 
   - Installs dependencies (`npm ci`)
   - Runs `npm run build` (type-check, data validation, Vite build; no network calls)
   - Outputs to `./dist/` directory
3. **Verify:** 
   - Checks for `.nojekyll`, `site.webmanifest`, `index.html`
   - Validates production script tags in `index.html`
4. **Deploy:**
   - Uploads `./dist/` as GitHub Pages artifact
   - Deploys via `actions/deploy-pages@v4`

## Manual Deployment

To manually trigger a deployment:

1. Go to: https://github.com/victorsaly/correlateAI/actions/workflows/deploy.yml
2. Click **"Run workflow"**
3. Select branch: **main**
4. Click **"Run workflow"**

## Local Build

To build locally (type-check, validate the committed data, then Vite build):
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## Troubleshooting

### MIME Type Errors After Deployment

1. **Check GitHub Pages source:** Settings → Pages → Source should be "GitHub Actions"
2. **Wait for workflow to complete:** Check https://github.com/victorsaly/correlateAI/actions
3. **Clear browser cache:** Hard refresh (`Cmd+Shift+R` on Mac, `Ctrl+Shift+R` on Windows/Linux)
4. **Clear site data:** DevTools → Application → Clear site data

### Build Failures

Check the GitHub Actions logs:
1. Go to: https://github.com/victorsaly/correlateAI/actions
2. Click on the failed workflow run
3. Check the "Verify build output" and "Prepare artifact for upload" steps

### Files Not Found (404)

If `site.webmanifest` or other public assets return 404:
- Ensure they exist in `public/` directory
- Vite copies `public/` contents to `dist/` during build
- Check `vite.config.ts` has `publicDir: 'public'` set
- Verify files are in `dist/` after build: `ls -la dist/`

## Key Files

- **`index.html`** (root) - Dev template, used by Vite dev server only, **NEVER deployed**
- **`dist/index.html`** (generated) - Production build with compiled asset references
- **`.github/workflows/deploy.yml`** - Automated deployment workflow
- **`scripts/ci-build.mjs`** - Build script: type-check, validate `public/data`, Vite build, static pages
- **`vite.config.ts`** - Build configuration
- **`public/.nojekyll`** - Prevents GitHub Pages Jekyll processing

## Environment Variables

None. The app reads only the committed series in `public/data`, and the public
sources the weekly data workflow (`automated-data-collection.yml`) collects from
need no API keys.
