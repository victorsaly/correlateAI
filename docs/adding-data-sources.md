# Adding New Data Sources to CorrelateAI

This guide explains how to easily add new API endpoints and data sources to the CorrelateAI platform using the centralized configuration system.

## Quick Start: Adding a New Data Source

### 1. Add to Data Source Registry

Edit `/src/config/dataSources.ts` and add your new source to the `DATA_SOURCE_REGISTRY` array:

```typescript
{
  key: 'YourAPI',                    // Unique identifier
  name: 'Your API Name',             // Short name
  displayName: 'Your API Full Name', // Display name
  description: 'Brief description of the API',
  url: 'https://yourapi.com/',
  category: 'financial',             // economics|financial|climate|space|geology|energy|health|synthetic
  icon: 'chart',                     // Icon identifier
  color: 'text-purple-500',          // Tailwind color class
  badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  dataPath: '/data/yourapi/',        // Optional: for dynamic sources
  isStatic: false,                   // true for always-available, false for dynamic
  expectedDatasets: 5                // Expected number of datasets
}
```

### 2. Add File Detection (for Dynamic Sources)

If your source has dynamic data availability, add file patterns to the centralized service.

Edit `/src/services/centralizedDataSourceService.ts` and add your files to `getKnownFilesForSource()`:

```typescript
yourapi: [
  'yourapi_dataset1.json',
  'yourapi_dataset2.json',
  'yourapi_dataset3.json'
]
```

### 3. Add Icon Mapping

Edit `/src/components/DataSources.tsx` and add your icon to the `iconMap`:

```typescript
'YourAPI': <YourIcon className="w-4 h-4" />
```

### 4. Create Data Collection Script

Create `/scripts/collect-yourapi-data.mjs`:

```javascript
// Your data collection logic
// Save files to /public/data/yourapi/
// Include metadata files with _metadata.json suffix
```

That's it! Your new data source will automatically:
- ✅ Appear in the animated header rotation
- ✅ Show up in the data sources list with proper styling
- ✅ Be counted in footer statistics
- ✅ Include proper badges and explore links
- ✅ Be included in documentation

## Current Data Sources

The platform currently supports 10 API sources:

### Economics
- **FRED** (Federal Reserve Economic Data) - 16 datasets
- **World Bank** - 11 datasets
- **BLS** (Bureau of Labor Statistics) - 2 datasets

### Financial
- **Alpha Vantage** - 7 datasets
- **Nasdaq Data Link** - 5 datasets

### Climate
- **OpenWeather** - 6 datasets

### Space
- **NASA** - 5 datasets

### Geology
- **USGS** - 4 datasets

### Energy
- **EIA** - 5 datasets

### Health
- **CDC** - 1 dataset

### Synthetic
- **AI-Generated** - 48 datasets

## Architecture Benefits

### Centralized Configuration
- Single source of truth for all data sources
- Automatic UI updates when adding sources
- Consistent styling and behavior
- Easy maintenance and scaling

### Automatic Integration
- Footer counts update automatically
- Header rotation includes new sources
- Data source cards render automatically
- Badge colors and icons applied consistently

### Type Safety
- TypeScript interfaces ensure consistency
- Compile-time checks for configuration
- Intellisense support for development

### Scalability
- Easy to add dozens of new endpoints
- Minimal code changes required
- Consistent user experience
- Professional presentation

## Best Practices

### 1. Data Quality
- Always include proper metadata files
- Use consistent JSON structure
- Include source URLs and timestamps
- Validate data before saving

### 2. Error Handling
- Implement proper fallbacks
- Handle API rate limits
- Log collection results
- Graceful degradation

### 3. Performance
- Cache data appropriately
- Use efficient file structures
- Implement proper rate limiting
- Monitor API usage

### 4. Documentation
- Update README.md with new sources
- Include API documentation links
- Document any special requirements
- Maintain clear descriptions

## Future Enhancements

The centralized system makes it easy to add:
- Automatic API health monitoring
- Dynamic source priority management
- Category-based filtering
- Advanced source analytics
- Real-time status indicators
- Source performance metrics

## Contributing

When adding new data sources:
1. Follow the configuration pattern
2. Test thoroughly
3. Update documentation
4. Include proper error handling
5. Maintain consistent naming conventions