# 🤖 Automated Data Collection Setup for CorrelateAI

This guide will help you set up automated daily data collection using GitHub Actions, ensuring your CorrelateAI application always has fresh, real-world data for correlation analysis.

## 🎯 What This Automation Does

- **Daily Data Collection**: Automatically fetches fresh data from multiple sources
- **Quality Assurance**: Validates data quality before adding to your app
- **Correlation Discovery**: Generates new correlations automatically  
- **Version Control**: Commits new data directly to your repository
- **Error Monitoring**: Creates GitHub issues when problems occur

## 📊 Data Sources Included

### 🏛️ Federal Reserve Economic Data (FRED) - **Recommended**
- **50+ economic indicators** (GDP, unemployment, inflation, housing, etc.)
- **Free API key required**: https://fred.stlouisfed.org/docs/api/api_key.html
- **Rate limit**: 120 requests/minute
- **Quality**: Extremely high - official US government data

### 🌍 World Bank Open Data - **Always Available**
- **Global economic indicators** (GDP per capita, population, trade data)
- **No API key needed**
- **Rate limit**: No strict limits
- **Quality**: High - official international data

### 💹 Alpha Vantage Financial Data - **Optional**
- **Stock market indices** (S&P 500, NASDAQ, Dow Jones, etc.)
- **Free API key**: https://www.alphavantage.co/support/#api-key
- **Rate limit**: 5 requests/minute (free tier)
- **Quality**: High - real market data

### 🌤️ OpenWeatherMap - **Optional for Weather Correlations**
- **Weather and climate data**
- **Free API key**: https://openweathermap.org/api
- **Rate limit**: 1000 calls/day (free tier)

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your API Keys

1. **FRED API Key** (Required - most important!):
   - Go to https://fred.stlouisfed.org/docs/api/api_key.html
   - Create free account → Request API key
   - Copy your key (looks like: `abcdef1234567890abcdef1234567890`)

2. **Alpha Vantage** (Optional but recommended):
   - Go to https://www.alphavantage.co/support/#api-key  
   - Get free key → Copy it

### Step 2: Add API Keys to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

```
Name: FRED_API_KEY
Value: your_actual_fred_api_key_here

Name: ALPHA_VANTAGE_API_KEY  
Value: your_actual_alpha_vantage_key_here

Name: OPENWEATHER_API_KEY
Value: your_actual_openweather_key_here
```

### Step 3: Enable GitHub Actions

1. Go to **Actions** tab in your repository
2. Enable Actions if prompted
3. The workflow is now active! 🎉

## 📅 How It Works

### Automatic Schedule
- **Runs daily at 6 AM UTC** (adjust timezone in workflow file)
- **Weekend runs included** for maximum data freshness
- **Smart rate limiting** prevents API quota exhaustion

### Manual Triggers
- **Run manually** from GitHub Actions tab
- **Force updates** with the `force_update` option
- **Test specific sources** using the data sources input

### What Gets Updated

```
public/ai-data/
├── economics-gdp.json                     # GDP data
├── economics-gdp_metadata.json           # Dataset info
├── economics-unrate.json                 # Unemployment data
├── worldbank-ny-gdp-pcap-cd.json        # GDP per capita
├── finance-spy.json                      # S&P 500 data
├── datasets_index.json                   # Master index
├── generated_correlations.json           # Auto-discovered correlations
└── last-update.json                      # Update timestamp
```

## 🎯 Expected Results

### With FRED API Key Only:
- **15+ economic datasets** 
- **200+ data points**
- **50+ correlations discovered**
- **Daily updates**

### With All API Keys:
- **25+ datasets across multiple categories**
- **400+ data points** 
- **100+ correlations discovered**
- **Rich financial and economic insights**

## 📊 Sample Data Generated

After the first run, you'll have datasets like:

```json
// economics-gdp.json
[
  { "year": 2020, "value": 20953030, "date": "2020-01-01" },
  { "year": 2021, "value": 22996100, "date": "2021-01-01" },
  { "year": 2022, "value": 25462700, "date": "2022-01-01" }
]

// Auto-generated correlation example
{
  "title": "GDP vs S&P 500",
  "correlation": 0.847,
  "description": "strong positive correlation between GDP and S&P 500",
  "data": [/* chart data */]
}
```

## 🔍 Monitoring Your Data Pipeline

### Check Status
- **Actions tab**: See all workflow runs
- **data-summary.md**: Detailed collection reports  
- **Issues tab**: Automatic error reporting

### View Collected Data
```bash
# See what data was collected
ls public/ai-data/

# Check the master index
cat public/ai-data/datasets_index.json

# View correlations
cat public/ai-data/generated_correlations.json
```

## ⚙️ Customization Options

### Change Update Frequency
Edit `.github/workflows/automated-data-collection.yml`:
```yaml
schedule:
  - cron: '0 6 * * *'  # Daily at 6 AM
  - cron: '0 */6 * * *'  # Every 6 hours  
  - cron: '0 9 * * 1'  # Weekly on Monday
```

### Add New Data Sources
Extend the workflow with additional APIs:
```yaml
- name: 🏢 Collect Corporate Data
  run: |
    # Add your custom data collection script
    node collect-custom-data.js
```

### Adjust Quality Thresholds
Modify environment variables:
```yaml
env:
  QUALITY_THRESHOLD: 0.8  # Higher = stricter quality
  MAX_DATASETS_PER_RUN: 100  # More datasets per run
```

## 🚨 Troubleshooting

### Common Issues

**❌ "API key not found"**
- Check GitHub Secrets are properly named
- Verify API key is valid and active

**❌ "Rate limit exceeded"**  
- Wait for rate limits to reset
- Reduce collection frequency
- Upgrade to paid API tiers

**❌ "No data collected"**
- Check API endpoints are accessible
- Verify data source formats haven't changed
- Review workflow logs for specific errors

### Getting Help

1. **Check workflow logs** in GitHub Actions tab
2. **Review generated issues** for automatic error reports  
3. **Test API keys manually** with curl/Postman
4. **Join discussions** in repository Issues

## 📈 Advanced Features

### Custom Correlation Rules
Edit `generate-correlations.js` to add business logic:
```javascript
// Skip certain correlations
if (dataset1.category === dataset2.category) continue;

// Focus on specific combinations  
if (dataset1.category === 'economics' && dataset2.category === 'finance') {
  // Prioritize economic-financial correlations
}
```

### Data Quality Monitoring
The pipeline automatically:
- ✅ Validates data completeness
- ✅ Checks for outliers
- ✅ Ensures temporal consistency  
- ✅ Monitors correlation strength

### Integration with Your App
The collected data is automatically available in your CorrelateAI app:
```typescript
// Your app automatically loads fresh data
import { dataService } from './services/dataService'

// Gets the latest collected datasets
const latestData = await dataService.getLatestData()
```

## 🎉 Success Metrics

After setup, you should see:
- **Daily commits** with new data
- **Growing dataset count** in your app
- **Fresh correlations** discovered automatically
- **Improved user engagement** with real, current data

## 🔮 Future Enhancements

Planned features:
- **ML-powered correlation discovery**
- **Anomaly detection in data patterns**
- **Predictive correlation modeling** 
- **Custom notification systems**
- **API for external data integration**

---

## 💡 Pro Tips for Data Analytics Professionals

1. **Start with FRED** - Best ROI for economic analysis
2. **Monitor data quality scores** - Maintain high standards
3. **Customize correlation thresholds** - Focus on meaningful relationships
4. **Use manual triggers** during development
5. **Set up monitoring alerts** for critical data sources

Ready to automate your data pipeline? Just add your API keys and watch the magic happen! 🚀

---

*Questions? Create an issue or check the [workflow documentation](.github/workflows/automated-data-collection.yml)*