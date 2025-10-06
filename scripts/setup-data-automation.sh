#!/bin/bash

# CorrelateAI Data Automation Setup Script
# This script helps you set up automated data collection for your CorrelateAI application

echo "🚀 CorrelateAI Data Automation Setup"
echo "===================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env 2>/dev/null || touch .env
fi

echo "🔑 Setting up API keys for automated data collection..."
echo ""
echo "To enable automated data collection, you'll need API keys from these free sources:"
echo ""

# FRED API
echo "1. 📊 Federal Reserve Economic Data (FRED)"
echo "   - Visit: https://fred.stlouisfed.org/docs/api/api_key.html"
echo "   - Create a free account and get your API key"
echo "   - Add to .env: VITE_FRED_API_KEY=your_key_here"
echo ""

# Alpha Vantage (optional)
echo "2. 📈 Alpha Vantage (Stock Market Data - Optional)"
echo "   - Visit: https://www.alphavantage.co/support/#api-key"
echo "   - Get a free API key (500 requests/day)"
echo "   - Add to .env: VITE_ALPHA_VANTAGE_API_KEY=your_key_here"
echo ""

# OpenWeather (optional)
echo "3. 🌤️  OpenWeatherMap (Weather Data - Optional)"
echo "   - Visit: https://openweathermap.org/api"
echo "   - Get a free API key (1000 calls/day)"
echo "   - Add to .env: VITE_OPENWEATHER_API_KEY=your_key_here"
echo ""

# Census API (optional, no key required but rate limited)
echo "4. 🏛️  US Census Bureau (No API key required)"
echo "   - Automatically available"
echo "   - Rate limited to 500 requests per day"
echo ""

# World Bank (no key required)
echo "5. 🌍 World Bank Open Data (No API key required)"
echo "   - Automatically available"
echo "   - No rate limits"
echo ""

echo "📚 Additional Data Sources You Can Add:"
echo ""
echo "• OECD Data: https://data.oecd.org/api/"
echo "• UN Data: https://data.un.org/"
echo "• European Central Bank: https://data.ecb.europa.eu/"
echo "• Yahoo Finance: https://rapidapi.com/apidojo/api/yahoo-finance1/"
echo "• Quandl: https://www.quandl.com/tools/api"
echo ""

echo "⚙️  Configuring Vite for API Proxying..."

# Create vite config for API proxying in development
cat > vite.config.proxy.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // FRED API proxy to avoid CORS in development
      '/api/fred': {
        target: 'https://api.stlouisfed.org/fred',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fred/, ''),
        secure: true,
        headers: {
          'User-Agent': 'CorrelateAI/1.0'
        }
      },
      // World Bank API proxy
      '/api/worldbank': {
        target: 'https://api.worldbank.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/worldbank/, ''),
        secure: true
      },
      // Census API proxy
      '/api/census': {
        target: 'https://api.census.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/census/, ''),
        secure: true
      },
      // Alpha Vantage proxy (optional)
      '/api/alphavantage': {
        target: 'https://www.alphavantage.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/alphavantage/, ''),
        secure: true
      }
    }
  }
})
EOF

echo "✅ Vite proxy configuration created"
echo ""

echo "🗃️  Setting up data cache directory..."
mkdir -p public/cache/datasets
mkdir -p public/cache/correlations

cat > public/cache/.gitkeep << 'EOF'
# This directory stores cached API responses
# Cache files are automatically managed by the data pipeline
EOF

echo "✅ Cache directories created"
echo ""

echo "📦 Installing additional dependencies for data processing..."

# Check if package.json has the required dependencies
if command -v npm &> /dev/null; then
    echo "Installing data processing libraries..."
    npm install --save-dev @types/node
    npm install papaparse date-fns lodash
    npm install --save-dev @types/papaparse @types/lodash
    echo "✅ Dependencies installed"
else
    echo "⚠️  npm not found. Please install the following packages manually:"
    echo "   npm install papaparse date-fns lodash"
    echo "   npm install --save-dev @types/node @types/papaparse @types/lodash"
fi

echo ""
echo "📊 Creating sample data collection workflow..."

cat > scripts/data-collection-workflow.js << 'EOF'
/**
 * Sample Data Collection Workflow
 * 
 * This script demonstrates how to use the data pipeline service
 * for automated data collection and correlation discovery.
 */

import { dataPipelineService } from '../src/services/dataPipelineService.js'
import { dataService } from '../src/services/dataService.js'

async function runDataCollectionWorkflow() {
  console.log('🚀 Starting data collection workflow...')
  
  try {
    // 1. Check current data sources
    console.log('📊 Checking data sources...')
    const sourceStats = dataPipelineService.getDataSourceStats()
    console.log(`Found ${Object.keys(sourceStats).length} active data sources`)
    
    // 2. Trigger data updates
    console.log('🔄 Updating data...')
    const updates = await dataPipelineService.triggerUpdate()
    console.log(`Completed ${updates.length} data updates`)
    
    // 3. Find interesting correlations
    console.log('🔍 Discovering correlations...')
    const correlation = await dataService.generateRandomCorrelation()
    console.log(`Found correlation: ${correlation.description}`)
    console.log(`Correlation coefficient: ${correlation.correlation.toFixed(3)}`)
    
    // 4. Report results
    console.log('📈 Workflow completed successfully!')
    console.log(`Data quality average: ${updates.reduce((sum, u) => sum + u.qualityScore, 0) / updates.length}`)
    
  } catch (error) {
    console.error('❌ Workflow failed:', error)
  }
}

// Run the workflow
runDataCollectionWorkflow()
EOF

echo "✅ Sample workflow created"
echo ""

echo "⏰ Setting up automated scheduling (optional)..."

cat > scripts/setup-cron.sh << 'EOF'
#!/bin/bash

# This script sets up automated data collection using cron jobs
# Run with: bash scripts/setup-cron.sh

echo "Setting up automated data collection..."

# Create a cron job that runs data collection every hour
(crontab -l 2>/dev/null; echo "0 * * * * cd $(pwd) && node scripts/data-collection-workflow.js >> logs/data-collection.log 2>&1") | crontab -

# Create a cron job that discovers new sources weekly
(crontab -l 2>/dev/null; echo "0 0 * * 0 cd $(pwd) && node scripts/discover-sources.js >> logs/discovery.log 2>&1") | crontab -

echo "Cron jobs added:"
echo "- Hourly data collection"
echo "- Weekly source discovery"
echo ""
echo "View logs at: logs/data-collection.log"

# Create logs directory
mkdir -p logs
touch logs/data-collection.log
touch logs/discovery.log

echo "✅ Automated scheduling configured"
EOF

chmod +x scripts/setup-cron.sh

echo "✅ Cron setup script created"
echo ""

echo "🔒 Setting up environment variables..."

cat >> .env << 'EOF'

# =================================
# Data Pipeline Configuration
# =================================

# Federal Reserve Economic Data (Required for US economic data)
# Get your free API key at: https://fred.stlouisfed.org/docs/api/api_key.html
VITE_FRED_API_KEY=your_fred_api_key_here

# Alpha Vantage (Optional - for stock market data)
# Get your free API key at: https://www.alphavantage.co/support/#api-key
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here

# OpenWeatherMap (Optional - for weather data)
# Get your free API key at: https://openweathermap.org/api
VITE_OPENWEATHER_API_KEY=your_openweather_key_here

# Data Pipeline Settings
VITE_CACHE_EXPIRATION_HOURS=24
VITE_DATA_QUALITY_THRESHOLD=0.7
VITE_MAX_CONCURRENT_REQUESTS=5
VITE_AUTO_DISCOVERY_ENABLED=true
VITE_UPDATE_FREQUENCY=daily

EOF

echo "✅ Environment variables template added to .env"
echo ""

echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. 🔑 Add your API keys to the .env file"
echo "2. 🚀 Start your development server: npm run dev"
echo "3. 📊 Access the Data Source Manager in your app"
echo "4. ⚙️  Configure automation settings as needed"
echo "5. 📈 Watch as correlations are automatically discovered!"
echo ""
echo "💡 Pro Tips:"
echo "• Start with just the FRED API key - it provides excellent economic data"
echo "• Use the Data Source Manager UI to monitor data quality"
echo "• Check logs/data-collection.log for automated update status"
echo "• The system will automatically discover new correlations as data updates"
echo ""
echo "🆘 Need help? Check the documentation or create an issue on GitHub"
echo ""

# Check if API keys are already configured
if grep -q "your_.*_key_here" .env; then
    echo "⚠️  Don't forget to replace the placeholder API keys in .env with real ones!"
    echo ""
fi

echo "Happy correlating! 🎯"