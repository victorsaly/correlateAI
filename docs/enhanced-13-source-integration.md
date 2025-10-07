# Enhanced Data Sources - 13 API Integration

## Overview
CorrelateAI has been expanded from 10 to 13 comprehensive data sources, adding cryptocurrency, international economic, and environmental data for richer correlation analysis.

## New Data Sources Added

### 1. 🪙 **CoinGecko Cryptocurrency Data**
- **API**: https://api.coingecko.com/api/v3
- **Free Tier**: 10-50 calls/minute
- **Key Required**: Optional (free tier available)
- **Data Coverage**:
  - Bitcoin price history
  - Ethereum price history  
  - Cardano price history
  - Solana price history
  - Global crypto market cap
  - Trending cryptocurrencies
  - DeFi market data

**Correlation Opportunities**:
- Crypto vs traditional markets (stocks, bonds)
- Technology adoption vs crypto prices
- Economic indicators vs crypto volatility
- Energy prices vs Bitcoin mining activity

### 2. 🌐 **OECD International Economic Data**
- **API**: https://stats.oecd.org/restsdmx/sdmx.ashx/GetData
- **Free Tier**: Unlimited access
- **Key Required**: None (public API)
- **Data Coverage**:
  - GDP data from 38 OECD countries
  - International inflation rates
  - Global unemployment statistics
  - Economic outlook indicators
  - Composite leading indicators
  - Trade transport data

**Correlation Opportunities**:
- US vs international economic trends
- Global economic synchronization
- International trade vs domestic indicators
- Cross-country policy impacts

### 3. 🌬️ **World Air Quality Index (WAQI)**
- **API**: https://api.waqi.info
- **Free Tier**: 1000 requests/day
- **Key Required**: Yes (free registration)
- **Data Coverage**:
  - Air quality data for major global cities
  - PM2.5 and PM10 measurements
  - AQI readings and classifications
  - Global air quality summary

**Correlation Opportunities**:
- Air quality vs health statistics (CDC data)
- Environmental quality vs economic activity
- Urban development vs pollution levels
- Climate change vs air quality trends

## Enhanced Platform Capabilities

### Total Data Coverage (13 Sources)
1. **FRED** - Federal Reserve Economic Data
2. **World Bank** - Global development data
3. **Alpha Vantage** - Financial market data
4. **OpenWeather** - Climate and weather data
5. **NASA** - Space and astronomical data
6. **USGS** - Geological and seismic data
7. **EIA** - Energy sector data
8. **BLS** - Labor statistics
9. **CDC** - Health statistics
10. **Nasdaq Data Link** - Market and financial data
11. **CoinGecko** - Cryptocurrency data ✨ **NEW**
12. **OECD** - International economic data ✨ **NEW**
13. **World Air Quality Index** - Environmental data ✨ **NEW**

### New Correlation Categories

#### **Cryptocurrency Correlations**
- Bitcoin price vs S&P 500 performance
- Ethereum adoption vs technology sector growth
- Crypto market cap vs global economic uncertainty
- DeFi growth vs traditional banking indicators

#### **International Economic Correlations**
- US vs EU economic performance
- Global inflation synchronization
- International trade flows vs domestic GDP
- Cross-border economic policy impacts

#### **Environmental-Economic Correlations**
- Air quality vs industrial production
- Pollution levels vs urban economic activity
- Environmental health vs healthcare costs
- Climate quality vs quality of life indicators

## Implementation Details

### Data Collection Enhancement
```javascript
// New API sources in collect-all-sources.mjs
CoinGecko: {
  name: 'CoinGecko Cryptocurrency Data',
  datasets: [
    'Bitcoin Price History',
    'Ethereum Price History', 
    'Global Market Cap',
    'Trending Cryptocurrencies'
  ]
},
OECD: {
  name: 'OECD International Data',
  datasets: [
    'OECD GDP Data',
    'International Inflation',
    'Global Unemployment',
    'Economic Outlook'
  ]
},
WorldAirQuality: {
  name: 'World Air Quality Index',
  datasets: [
    'Major Cities AQI',
    'PM2.5 Measurements',
    'Global Air Quality Summary'
  ]
}
```

### GitHub Workflow Updates
```yaml
env:
  # New API keys for enhanced data collection
  COINGECKO_API_KEY: ${{ secrets.COINGECKO_API_KEY }}
  OECD_API_KEY: ${{ secrets.OECD_API_KEY }}
  WAQI_API_KEY: ${{ secrets.WAQI_API_KEY }}
```

### UI Component Updates
- Added quick access links for new data sources
- Enhanced data source descriptions
- Updated total source count from 10 to 13
- Added new category badges and icons

## API Key Setup Instructions

### CoinGecko API Key
1. Visit https://www.coingecko.com/en/api
2. Sign up for free account
3. Generate API key (Pro plan recommended for higher limits)
4. Add to GitHub Secrets as `COINGECKO_API_KEY`

### OECD API (No Key Required)
- Public API with unlimited access
- No registration or authentication needed
- Supports SDMX format for comprehensive data

### World Air Quality Index API Key
1. Visit https://aqicn.org/api/
2. Register for free account
3. Generate API token
4. Add to GitHub Secrets as `WAQI_API_KEY`

## Value Proposition

### Enhanced Analysis Capabilities
- **25+ new correlation combinations** with crypto, international, and environmental data
- **Global economic context** through OECD international indicators
- **Technology-finance bridge** via cryptocurrency market analysis
- **Environmental-health-economic** triangle correlations

### Research Applications
- **Financial Research**: Crypto vs traditional asset correlations
- **Economic Research**: International policy synchronization analysis
- **Environmental Research**: Economic activity vs air quality impacts
- **Technology Research**: Blockchain adoption vs economic indicators

### User Benefits
- More diverse and interesting correlation discoveries
- International perspective on economic trends
- Environmental sustainability insights
- Cryptocurrency market intelligence

## Future Expansion Opportunities

With the scalable architecture now supporting 13 sources, additional valuable APIs can be easily integrated:
- **Polygon.io** for enhanced stock market data
- **News API** for sentiment analysis correlations
- **GitHub API** for technology trend analysis
- **REST Countries API** for demographic correlations

The platform now provides a comprehensive foundation for multi-dimensional data correlation analysis across finance, economics, technology, health, and environment domains.