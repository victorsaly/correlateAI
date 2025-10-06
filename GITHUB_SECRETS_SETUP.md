# 🔐 GitHub Repository Secrets Setup Guide

Your API keys are working perfectly! Follow these steps to set them up for automated data collection:

## Step 1: Navigate to Repository Settings

1. Go to your GitHub repository: https://github.com/victorsaly/correlateAI
2. Click on **Settings** tab (requires repository write access)
3. In the left sidebar, click **Secrets and variables** → **Actions**

## Step 2: Add Your API Keys

Click **New repository secret** for each of these:

### Required Secrets

| Secret Name | Value Source | Description |
|-------------|-------------|-------------|
| `VITE_FRED_API_KEY` | From your local `.env` file | Federal Reserve Economic Data API |
| `VITE_ALPHA_VANTAGE_API_KEY` | From your local `.env` file | Financial markets data API |
| `VITE_OPENWEATHER_API_KEY` | From your local `.env` file | Weather and climate data API |

### ⚠️ Security Note
**Never commit actual API keys to the repository!** 
- Copy the values from your local `.env` file
- The `.env` file should be in your `.gitignore` (it is!)
- Only add keys to GitHub repository secrets

### Alternative Names (if you prefer)

You can also use these names instead:
- `FRED_API_KEY` 
- `ALPHA_VANTAGE_API_KEY`
- `OPENWEATHER_API_KEY`

The workflow supports both naming conventions.

## Step 3: Verify Setup

Once added, your secrets should look like this:

```
Repository secrets
├── VITE_FRED_API_KEY          ••••••••••••••••
├── VITE_ALPHA_VANTAGE_API_KEY ••••••••••••••••  
└── VITE_OPENWEATHER_API_KEY   ••••••••••••••••
```

## Step 4: Test the Workflow

1. **Manual trigger**: Go to **Actions** tab → **🤖 Automated Data Collection** → **Run workflow**
2. **Automatic**: The workflow runs daily at 6 AM UTC
3. **Monitor**: Check the **Actions** tab for execution logs

## What Happens Next

Once set up, your GitHub Actions workflow will:

✅ **Daily Data Collection** (6 AM UTC)
- FRED: Economic indicators (GDP, unemployment, interest rates, etc.)
- Alpha Vantage: Stock market data (SPY, major indices)
- OpenWeather: Global weather/climate data from major cities

✅ **Automated Processing**
- Quality validation and filtering
- Correlation discovery between datasets  
- Metadata generation for each dataset

✅ **Repository Updates**
- New data files saved to `public/ai-data/`
- Index files updated automatically
- Commit messages with collection summary

## Troubleshooting

### Common Issues:
- **Secret not found**: Double-check the secret name matches exactly
- **API rate limits**: Workflow includes proper rate limiting delays
- **Permission errors**: Ensure `GITHUB_TOKEN` has write permissions (enabled by default)

### Debugging:
- Check the **Actions** tab for detailed logs
- Failed runs will show specific error messages
- Manual triggers help test individual components

## 🎯 Ready to Deploy!

Your local testing shows all APIs are working correctly. Once you add the secrets to GitHub, your automated data collection system will be live!

**Next Steps:**
1. Add the 3 API keys to repository secrets (copy from your local `.env` file)
2. Push any remaining changes to trigger the workflow
3. Monitor the first run in GitHub Actions
4. Enjoy fresh data updates daily! 🚀

## 🔒 Security Best Practices

- ✅ `.env` file is in `.gitignore` 
- ✅ API keys only in GitHub repository secrets
- ✅ No hardcoded credentials in code
- ✅ Environment variables used properly
- ✅ Public repository safe for sharing