# 🚀 Quick Start & Security Guide

## 🔐 Secure Setup (5 Minutes)

### 1. Get Your FREE FRED API Key
```bash
# Visit: https://fred.stlouisfed.org/docs/api/api_key.html
# Register (free) → Get API key → Copy key
```

### 2. Local Development Setup
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/random-data-correlat.git
cd random-data-correlat

# Copy environment template
cp .env.example .env

# Edit .env file and add your API key:
# VITE_FRED_API_KEY=your_actual_api_key_here

# Install and run
npm install
npm run dev
```

### 3. GitHub Deployment Setup
```bash
# In GitHub repository settings:
# Settings → Secrets → Actions → New repository secret
# Name: VITE_FRED_API_KEY
# Value: your_actual_api_key_here

# Push to main branch = automatic deployment!
git push origin main
```

## 🛡️ Security Features

✅ **API Keys Protected** - Never committed to Git  
✅ **Environment Variables** - Secure key management  
✅ **GitHub Secrets** - Encrypted deployment keys  
✅ **Automated Security Audit** - Run `./security-audit.sh`  
✅ **CORS Handled** - Development proxy configured  

## 📋 Complete Documentation

- **[API Setup Guide](./API_SETUP_GUIDE.md)** - Detailed API configuration
- **[GitHub Setup Guide](./GITHUB_SETUP_GUIDE.md)** - Repository & deployment
- **[DNS Setup Guide](./DNS_SETUP_GUIDE.md)** - Custom domain configuration
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Production deployment

## 🔍 Security Verification

Run the built-in security audit:
```bash
./security-audit.sh
```

Expected output: `🎉 Security audit completed successfully!`

## 🚨 Security Checklist

Before deploying, verify:

- [ ] `.env` file is gitignored ✅
- [ ] No API keys in source code ✅  
- [ ] GitHub Secrets configured ✅
- [ ] Security audit passes ✅
- [ ] Custom domain (optional) configured ✅

## 🌟 Features

- **Real Economic Data** from FRED & World Bank APIs
- **AI-Style Dark Theme** with dynamic background
- **Interactive Correlations** with mouse-responsive animations
- **Social Sharing** to Twitter, LinkedIn, Facebook
- **Favorites System** with persistent storage
- **Professional Citations** for all data sources

---

**🎯 Ready to explore economic correlations in 5 minutes!**