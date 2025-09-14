# Data Sources Schema

This document describes the data sources and API endpoints used by CorrelateAI Pro.

## API Configuration

### FRED API (Federal Reserve Economic Data)
- **Base URL**: `https://api.stlouisfed.org/fred/`
- **Authentication**: API Key required
- **Rate Limit**: 120 requests per minute
- **Data Format**: JSON
- **Available Series**: 20+ economic indicators

### World Bank API
- **Base URL**: `https://api.worldbank.org/v2/`
- **Authentication**: None required (public access)
- **Rate Limit**: None specified
- **Data Format**: JSON
- **Available Indicators**: 11+ global development indicators

## Data Structure

### CorrelationData Interface
```typescript
interface CorrelationData {
  id: string
  title: string
  description: string
  correlation: number      // Correlation coefficient (-1 to 1)
  rSquared: number        // R-squared value (0 to 1)
  data: ChartDataPoint[]  // Time series data
  variable1: Dataset | RealDataset
  variable2: Dataset | RealDataset
  citation: string
  journal: string
  year: number
  isRealData: boolean
  dataSource: string
}
```

### Dataset Categories
- `economics`: Economic indicators and financial data
- `social`: Demographics and social indicators
- `finance`: Financial markets and monetary data
- `demographics`: Population and social statistics
- `technology`: Technology adoption and usage
- `environment`: Environmental and sustainability metrics
- `health`: Health and healthcare statistics
- `education`: Education enrollment and outcomes
- `trade`: International trade and commerce
- `commodities`: Commodity prices and production

## Sample Data Points

### FRED API Series
| Series ID | Name | Category | Unit |
|-----------|------|----------|------|
| UNRATE | Unemployment Rate | economics | Percent |
| GDPC1 | Real GDP | economics | Billions of Chained 2012 Dollars |
| CPIAUCSL | Consumer Price Index | economics | Index 1982-1984=100 |
| FEDFUNDS | Federal Funds Rate | finance | Percent |
| HOUST | Housing Starts | economics | Thousands of Units |

### World Bank Indicators
| Indicator ID | Name | Category | Unit |
|--------------|------|----------|------|
| SP.POP.TOTL | Population, total | demographics | People |
| NY.GDP.PCAP.CD | GDP per capita | economics | Current US$ |
| SP.DYN.LE00.IN | Life expectancy at birth | health | Years |
| SE.PRM.NENR | Primary education enrollment | education | % net |
| EN.ATM.CO2E.PC | CO2 emissions per capita | environment | Metric tons |

## Data Processing Pipeline

1. **Data Fetching**: Retrieve time series data from APIs
2. **Normalization**: Standardize date formats and values
3. **Correlation Calculation**: Calculate Pearson correlation coefficient
4. **Statistical Analysis**: Compute R-squared and significance metrics
5. **Visualization**: Generate interactive charts with Recharts
6. **Caching**: Store processed results for performance

## Error Handling

- **API Timeouts**: 10-second timeout with retry logic
- **Rate Limiting**: Respect API limits with request queuing
- **Data Validation**: Verify data integrity before processing
- **Fallback Data**: Use synthetic data if APIs unavailable
- **CORS Issues**: Development proxy for cross-origin requests

## Security Considerations

- **API Keys**: Stored as environment variables only
- **Rate Limiting**: Implemented to prevent abuse
- **Data Privacy**: No personal data stored or transmitted
- **HTTPS**: All API requests use secure connections
- **Validation**: Input sanitization and output validation