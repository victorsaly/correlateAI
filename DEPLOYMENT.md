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
   - Runs `npm run build` (skips prefetch/generate in CI)
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

To build locally (CI mode, skips prefetch/generate):
```bash
SKIP_PREFETCH=true npm run build
```

To build locally (full mode, runs prefetch/generate):
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
- **`scripts/ci-build.mjs`** - CI-aware build script (skips prefetch/generate in CI)
- **`vite.config.ts`** - Build configuration
- **`public/.nojekyll`** - Prevents GitHub Pages Jekyll processing

## Environment Variables

Set these as GitHub Secrets (Settings → Secrets and variables → Actions):

- `VITE_FRED_API_KEY` - Federal Reserve Economic Data API key
- (Other API keys as needed)

The workflow also sets:
- `VITE_APP_NAME="CorrelateAI Pro"`
- `VITE_APP_VERSION="1.0.0"`
- `SKIP_PREFETCH=true` (for CI builds)
