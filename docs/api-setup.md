# 🔑 CorrelateAI Pro - API Setup Guide

This guide will help you set up the necessary API keys and environment variables to run CorrelateAI Pro with real economic data.

## 🛡️ Security First

**IMPORTANT**: Never commit API keys to version control. All sensitive data is protected through environment variables and proper .gitignore configuration.

## 📋 Required API Keys

### 1. FRED API (Federal Reserve Economic Data)
- **Provider**: Federal Reserve Bank of St. Louis
- **Cost**: 100% FREE
- **Rate Limit**: 120 requests per 60 seconds
- **Registration**: Required

### 2. World Bank API
- **Provider**: World Bank Group
- **Cost**: 100% FREE
- **Rate Limit**: None specified
- **Registration**: Not required

## 🚀 Quick Setup

### Step 1: Get Your FRED API Key

1. Visit [FRED API Key Registration](https://fred.stlouisfed.org/docs/api/api_key.html)
2. Click "Request API Key"
3. Fill out the simple registration form:
   - Name
   - Email address
   - Organization (can be personal)
   - Intended use (select "Academic/Research")
4. Check your email for the API key (usually instant)
5. Copy your API key (format: `1234567890abcdef1234567890abcdef`)

### Step 2: Set Up Environment Variables

1. **Copy the environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** and replace `your_fred_api_key_here` with your actual API key:
   ```bash
   # CorrelateAI Pro Environment Variables
   
   # FRED API Configuration
   VITE_FRED_API_KEY=1234567890abcdef1234567890abcdef
   
   # World Bank API (no key required)
   # Application Settings
   VITE_APP_NAME=CorrelateAI Pro
   VITE_APP_VERSION=1.0.0
   ```

3. **Save the file** - Your API key is now secured and will not be committed to Git

### Step 3: Verify Setup

Run the development server to test your API connection:

```bash
npm run dev
```

If successful, you should see:
- ✅ Real data fetching from FRED API
- ✅ World Bank data integration
- ✅ "Real Data" badges on generated correlations

## 🔧 GitHub Repository Setup

### For GitHub Pages Deployment

1. **Fork or clone this repository**
2. **Add your API key as a GitHub Secret**:
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Secrets and variables** → **Actions**
   - Click **"New repository secret"**
   - Name: `VITE_FRED_API_KEY`
   - Value: Your FRED API key
   - Click **"Add secret"**

3. **Enable GitHub Pages**:
   - Go to **Settings** → **Pages**
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` (will be created by the workflow)
   - Folder: `/ (root)`

4. **Configure custom domain** (optional):
   - Add your domain in the "Custom domain" field
   - Update the `CNAME` file if needed

### Automated Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

- ✅ Automatically builds the application
- ✅ Injects your API key from GitHub Secrets
- ✅ Deploys to GitHub Pages
- ✅ Updates your custom domain

**Trigger deployment**: Push to the `main` branch

## 🚨 Security Checklist

- [x] **`.env` file is gitignored** - API keys never committed
- [x] **Environment variables used** - No hardcoded secrets
- [x] **GitHub Secrets configured** - Secure deployment
- [x] **CORS handling** - Proper API access
- [x] **Rate limiting respected** - Responsible API usage

## 🔍 Available Data Sources

### FRED API Datasets (20 available)
- Personal Income
- Unemployment Rate
- Consumer Price Index
- GDP Growth
- Housing Price Index
- Interest Rates
- Employment Data
- Economic Indicators

### World Bank API Datasets (11 available)
- Population Demographics
- GDP per Capita
- Life Expectancy
- Education Enrollment
- CO2 Emissions
- Internet Usage
- Urban Population
- Inflation Rates

## 🛠️ Troubleshooting

### Common Issues

1. **"FRED API key not found" error**
   - Check your `.env` file exists
   - Verify the key format: `VITE_FRED_API_KEY=your_key_here`
   - Restart the development server

2. **CORS errors in development**
   - The Vite proxy is configured to handle this
   - Make sure you're using `npm run dev`

3. **API rate limits**
   - FRED: 120 requests/minute (very generous)
   - Reduce correlation generation frequency if needed

4. **GitHub Actions deployment fails**
   - Check your GitHub Secret is named exactly: `VITE_FRED_API_KEY`
   - Verify the secret value doesn't have extra spaces
   - Review the Actions tab for detailed error logs

### Development vs Production

- **Development**: Uses Vite proxy to avoid CORS issues
- **Production**: Direct API calls (FRED supports browser CORS)

## 📊 API Usage Statistics

Based on typical usage:
- **Development**: ~5-10 API calls per correlation
- **Production**: ~2-4 API calls per user session
- **Daily estimate**: Well within free tier limits

## 📞 Support

If you encounter issues:

1. Check the [FRED API Documentation](https://fred.stlouisfed.org/docs/api/)
2. Review [World Bank API Docs](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392)
3. Check the browser console for error messages
4. Verify your `.env` file configuration

---

**✨ Ready to explore real economic data correlations with CorrelateAI Pro!**