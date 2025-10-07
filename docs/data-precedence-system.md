# Data Precedence System - CorrelateAI

## Overview
The CorrelateAI platform now implements a comprehensive data precedence system that ensures local data takes priority over GitHub-generated data while maintaining automated data collection capabilities.

## Data Source Hierarchy

### 1. Local Data (Highest Priority)
- **Location**: `public/data/` directory
- **Purpose**: Manually curated, locally developed datasets
- **Precedence**: Always takes priority over any automated data
- **Use Case**: Custom datasets, refined data, local overrides

### 2. Real API Data (Medium Priority)
- **Location**: `public/data/` directory (when collected via APIs)
- **Purpose**: Live data from 10 external API sources
- **Sources**: FRED, World Bank, Alpha Vantage, OpenWeather, NASA, USGS, EIA, BLS, CDC, Nasdaq
- **Precedence**: Used when local data is not available

### 3. AI-Generated Data (Lowest Priority)
- **Location**: `public/ai-data/` directory
- **Purpose**: Synthetic datasets for testing and fallback
- **Precedence**: Only used when neither local nor real API data is available

## Data Collection Architecture

### Local Development
```
1. Developer creates/modifies data in public/data/
2. DynamicDatasetService scans for local files first
3. Local files always override any automated data
4. Real API data fetched only for missing files
5. AI data used as final fallback
```

### GitHub Automation
```
1. GitHub Actions runs automated collection for all 10 sources
2. Data saved to public/data/ directory
3. Local data files (if present) are NOT overwritten
4. Missing datasets are populated from APIs
5. AI data generated as backup in public/ai-data/
```

## Implementation Details

### File Discovery System
The `DynamicDatasetService` implements smart file discovery:

```typescript
// Local data takes precedence
const localFile = path.join('public/data', filename);
const aiFile = path.join('public/ai-data', filename);

// Check local first, fallback to AI-generated
const dataFile = await fs.access(localFile) ? localFile : aiFile;
```

### API Collection Script
The `scripts/collect-all-sources.mjs` implements cache-aware collection:

```javascript
// Check if local file exists and is recent
if (!forceUpdate && await isLocalFileRecent(filePath)) {
  console.log(`⚡ Using cached data for ${dataset.name}`);
  return; // Skip API call, use local data
}
```

## Data Source Registry

### Complete 10-Source Setup
1. **FRED** (Federal Reserve Economic Data) - Economic indicators
2. **World Bank** - Global development data
3. **Alpha Vantage** - Financial market data
4. **OpenWeather** - Climate and weather data
5. **NASA** - Space and astronomical data
6. **USGS** - Geological and seismic data
7. **EIA** - Energy sector data
8. **BLS** - Labor statistics
9. **CDC** - Health statistics
10. **Nasdaq Data Link** - Market and financial data

### User Control System
Users can control data source preferences:
- **Mixed**: Combines real API data with AI fallbacks
- **Real Data Only**: Uses only live API data (default)
- **Synthetic**: Uses AI-generated data for testing

## GitHub Workflow Configuration

### Environment Variables
All 10 data sources are configured with API keys:
```yaml
env:
  FRED_API_KEY: ${{ secrets.FRED_API_KEY }}
  WORLD_BANK_API_KEY: ${{ secrets.WORLD_BANK_API_KEY }}
  ALPHA_VANTAGE_API_KEY: ${{ secrets.ALPHA_VANTAGE_API_KEY }}
  OPENWEATHER_API_KEY: ${{ secrets.OPENWEATHER_API_KEY }}
  NASA_API_KEY: ${{ secrets.NASA_API_KEY }}
  USGS_API_KEY: ${{ secrets.USGS_API_KEY }}
  EIA_API_KEY: ${{ secrets.EIA_API_KEY }}
  BLS_API_KEY: ${{ secrets.BLS_API_KEY }}
  CDC_API_KEY: ${{ secrets.CDC_API_KEY }}
  NASDAQ_API_KEY: ${{ secrets.NASDAQ_API_KEY }}
```

### Collection Steps
1. Individual collection steps for each of the 10 sources
2. Comprehensive collection script for missing data
3. Index generation for dataset discovery
4. Correlation generation with user-controlled preferences

## Benefits of This System

### Scalability
- Unlimited new data sources can be added
- Automatic discovery of new datasets
- No hardcoded limitations

### Flexibility
- Developers can override any automated data
- User choice between real vs synthetic data
- Local development doesn't require API keys

### Reliability
- Multiple fallback layers ensure data availability
- GitHub automation maintains fresh data
- Local overrides allow for data quality control

### Performance
- Cached data reduces API calls
- Smart file discovery minimizes I/O
- Dynamic source counting reflects actual availability

## Usage Examples

### Local Override
```bash
# Create custom dataset that overrides API data
echo '[{"year": 2024, "value": 42}]' > public/data/custom_metric.json

# System automatically uses local file instead of API
```

### Force API Update
```bash
# Force refresh all API data
node scripts/collect-all-sources.mjs --force

# Local files remain untouched, only missing data updated
```

### Source-Specific Collection
```bash
# Update only specific sources
node scripts/collect-all-sources.mjs --sources=FRED,WorldBank
```

## Next Steps

1. **GitHub Secrets Configuration**: Add the new API keys to repository secrets
2. **Testing**: Verify all 10 sources work correctly in GitHub Actions
3. **Monitoring**: Set up alerts for API failures or data quality issues
4. **Documentation**: Create API key setup guide for new developers

This system provides the perfect balance of automation and control, ensuring CorrelateAI always has access to the freshest data while allowing for local customization and override capabilities.