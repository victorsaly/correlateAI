# 🚀 GitHub Repository Setup Guide

Complete guide for setting up CorrelateAI Pro on GitHub with secure API key management and automated deployment.

## 🎯 Overview

This guide covers:
- ✅ Secure API key management
- ✅ GitHub Pages deployment
- ✅ Custom domain configuration
- ✅ Automated CI/CD pipeline
- ✅ Security best practices
- ✅ Project structure organization

## 📋 Prerequisites

- GitHub account
- FRED API key ([Get one here](https://fred.stlouisfed.org/docs/api/api_key.html))
- Basic Git knowledge

## 📁 Project Structure Overview

The repository follows modern conventions with organized directories:

```
correlateai-pro/
├── docs/                  # Documentation (lowercase naming)
│   ├── api-setup.md       # API configuration guide
│   ├── github-setup.md    # This file
│   ├── quick-start.md     # 5-minute setup
│   └── ...
├── scripts/               # Utility scripts
│   └── security-audit.sh  # Security verification
├── data/                  # Data schemas and references
└── src/                   # Source code
```

**📖 Full structure**: See [project-structure.md](./project-structure.md)

## 📋 Prerequisites

- GitHub account
- FRED API key ([Get one here](https://fred.stlouisfed.org/docs/api/api_key.html))
- Basic Git knowledge

## 🔧 Step 1: Repository Setup

### Option A: Fork This Repository
1. Click **"Fork"** on the GitHub repository page
2. Choose your GitHub account as the destination
3. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/random-data-correlat.git
   cd random-data-correlat
   ```

### Option B: Create New Repository
1. Create a new repository on GitHub
2. Clone this project and push to your new repo:
   ```bash
   git clone https://github.com/victorsaly/random-data-correlat.git
   cd random-data-correlat
   git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## 🔑 Step 2: Secure API Key Configuration

### GitHub Secrets Setup

1. **Navigate to Repository Settings**:
   - Go to your repository on GitHub
   - Click **Settings** tab
   - Select **Secrets and variables** → **Actions**

2. **Add FRED API Key Secret**:
   - Click **"New repository secret"**
   - **Name**: `VITE_FRED_API_KEY`
   - **Secret**: Your FRED API key (e.g., `1234567890abcdef1234567890abcdef`)
   - Click **"Add secret"**

3. **Verify Secret Added**:
   - You should see `VITE_FRED_API_KEY` in your secrets list
   - The value will be hidden for security

### Local Development Setup

1. **Create local environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Add your API key to `.env`**:
   ```bash
   VITE_FRED_API_KEY=your_actual_api_key_here
   VITE_APP_NAME=CorrelateAI Pro
   VITE_APP_VERSION=1.0.0
   ```

3. **Verify `.env` is gitignored** (it should be by default):
   ```bash
   cat .gitignore | grep .env
   # Should show: .env
   ```

## 🌐 Step 3: GitHub Pages Deployment

### Enable GitHub Pages

1. **Go to Repository Settings**:
   - Click **Settings** tab
   - Scroll down to **Pages** section

2. **Configure Source**:
   - **Source**: "Deploy from a branch"
   - **Branch**: `gh-pages` *(will be created automatically)*
   - **Folder**: `/ (root)`

3. **Save Settings**:
   - Click **Save**
   - GitHub will show your site URL (e.g., `https://username.github.io/repository-name`)

### Custom Domain Setup (Optional)

1. **Add Custom Domain**:
   - In Pages settings, add your domain: `correlateai.yourdomain.com`
   - Update `public/CNAME` file if needed

2. **Configure DNS** (follow [DNS_SETUP_GUIDE.md](./DNS_SETUP_GUIDE.md)):
   - Add CNAME record pointing to your GitHub Pages URL

## 🤖 Step 4: Automated Deployment

### GitHub Actions Workflow

The repository includes `.github/workflows/deploy.yml` that:

- **Triggers**: On every push to `main` branch
- **Builds**: React application with Vite
- **Injects**: API keys from GitHub Secrets
- **Deploys**: To GitHub Pages automatically
- **Updates**: Custom domain configuration

### Trigger First Deployment

1. **Make a small change** (e.g., update README):
   ```bash
   echo "# My CorrelateAI Pro" > README.md
   git add README.md
   git commit -m "Initial deployment setup"
   git push origin main
   ```

2. **Monitor Deployment**:
   - Go to **Actions** tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow
   - Should complete in 2-3 minutes

3. **Verify Live Site**:
   - Visit your GitHub Pages URL
   - Test data correlation generation
   - Check for "Real Data" badges (confirms API working)

## 🔒 Step 5: Security Verification

### Security Checklist

- [x] **API keys are in GitHub Secrets** (not in code)
- [x] **`.env` file is gitignored** (not committed)
- [x] **No hardcoded secrets in source code**
- [x] **HTTPS enabled on custom domain**
- [x] **Rate limiting respected** (FRED: 120/minute)

### Verify No Sensitive Data in Repository

1. **Search for potential secrets**:
   ```bash
   # These should return NO results:
   git log --all --grep="api.*key" -i
   git log --all --grep="secret" -i
   git log --all -S "VITE_FRED_API_KEY" --source --all
   ```

2. **Check current code**:
   ```bash
   # Should only find environment variable usage:
   grep -r "VITE_FRED_API_KEY" src/
   # Should show: import.meta.env.VITE_FRED_API_KEY
   ```

## 📊 Step 6: Monitoring & Maintenance

### GitHub Actions Monitoring

- **Actions Tab**: Monitor deployment status
- **Deployment Logs**: Check for API connection issues
- **Pages Tab**: Verify successful deployments

### API Usage Monitoring

- **FRED Console**: Check your API usage at [FRED My Account](https://fred.stlouisfed.org/account/)
- **Rate Limits**: Monitor for 120 requests/minute limit
- **Error Handling**: Check browser console for API errors

## 🐛 Troubleshooting

### Common Deployment Issues

1. **"API key not found" in production**:
   - ✅ Verify GitHub Secret name: `VITE_FRED_API_KEY`
   - ✅ Check workflow file references the secret correctly
   - ✅ Redeploy after adding secret

2. **Build fails in GitHub Actions**:
   - ✅ Check Actions tab for detailed error logs
   - ✅ Verify all dependencies are in `package.json`
   - ✅ Test build locally: `npm run build`

3. **Custom domain not working**:
   - ✅ Check DNS propagation (can take up to 24 hours)
   - ✅ Verify CNAME file contains correct domain
   - ✅ Ensure SSL certificate is provisioned

4. **API CORS errors**:
   - ✅ Should not occur (FRED supports browser CORS)
   - ✅ If persistent, check browser network tab
   - ✅ Verify API key format and validity

### Local Development Issues

1. **"FRED API key not found" locally**:
   - ✅ Verify `.env` file exists and has correct format
   - ✅ Restart development server after creating `.env`
   - ✅ Check file is in project root directory

2. **CORS errors in development**:
   - ✅ Vite proxy should handle this automatically
   - ✅ Use `npm run dev` (not `npm start`)
   - ✅ Check `vite.config.ts` proxy configuration

## 📈 Success Metrics

After successful setup, you should see:

- ✅ **Automated deployments** from GitHub Actions
- ✅ **Real economic data** in correlations
- ✅ **"Real Data" badges** on generated correlations
- ✅ **FRED/World Bank API** data sources working
- ✅ **Custom domain** (if configured) resolving correctly

## 🔄 Updates & Maintenance

### Regular Updates
- **API Key Rotation**: Update GitHub Secret if needed
- **Dependencies**: `npm audit` and updates
- **Domain**: Renew custom domain if applicable

### Monitoring Health
- **Weekly**: Check GitHub Actions for failed deployments
- **Monthly**: Review API usage in FRED dashboard
- **Quarterly**: Update dependencies and security patches

---

**🎉 Your CorrelateAI Pro is now securely deployed with real economic data!**

**Live Site**: Check your GitHub Pages URL
**API Status**: Monitor in browser console
**Deployment**: Automatic on every push to main
