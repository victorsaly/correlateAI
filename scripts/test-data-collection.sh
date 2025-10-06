#!/bin/bash

# Local Data Collection Test Script
# This script lets you test data collection locally before setting up GitHub Actions

echo "🧪 CorrelateAI Local Data Collection Test"
echo "========================================"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Creating one..."
    cat > .env << 'EOF'
# Add your API keys here for local testing
VITE_FRED_API_KEY=your_fred_api_key_here
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
VITE_OPENWEATHER_API_KEY=your_openweather_key_here
EOF
    echo "📝 Created .env file. Please add your API keys and run the script again."
    exit 1
fi

# Load environment variables
set -a
source .env
set +a

echo "🔑 API Keys Status:"
if [ -n "$VITE_FRED_API_KEY" ] && [ "$VITE_FRED_API_KEY" != "your_fred_api_key_here" ]; then
    echo "✅ FRED API Key: Configured"
    FRED_AVAILABLE=true
else
    echo "❌ FRED API Key: Not configured"
    FRED_AVAILABLE=false
fi

if [ -n "$VITE_ALPHA_VANTAGE_API_KEY" ] && [ "$VITE_ALPHA_VANTAGE_API_KEY" != "your_alpha_vantage_key_here" ]; then
    echo "✅ Alpha Vantage API Key: Configured"
    AV_AVAILABLE=true
else
    echo "❌ Alpha Vantage API Key: Not configured"
    AV_AVAILABLE=false
fi

echo "✅ World Bank API: Always available (no key needed)"
echo ""

# Create test data directory
mkdir -p public/ai-data-test
echo "📁 Created test data directory: public/ai-data-test/"

# Install required dependencies if not present
echo "📦 Checking dependencies..."
if ! npm list axios &>/dev/null; then
    echo "Installing axios for API testing..."
    npm install --save-dev axios
else
    echo "✅ axios is already installed"
fi

if ! npm list papaparse &>/dev/null; then
    echo "Installing papaparse for CSV processing..."
    npm install --save-dev papaparse
else
    echo "✅ papaparse is already installed"
fi

if ! npm list date-fns &>/dev/null; then
    echo "Installing date-fns for date processing..."
    npm install --save-dev date-fns
else
    echo "✅ date-fns is already installed"
fi

echo "🚀 Starting data collection test..."
echo ""

# Test FRED API
if [ "$FRED_AVAILABLE" = true ]; then
    echo "🏛️ Testing FRED API..."
    
    cat > test-fred.mjs << 'EOF'
import axios from 'axios';
import fs from 'fs/promises';

async function testFred() {
    try {
        console.log('Testing FRED API connection...');
        
        const response = await axios.get('https://api.stlouisfed.org/fred/series/observations', {
            params: {
                series_id: 'GDP',
                api_key: process.env.VITE_FRED_API_KEY,
                file_type: 'json',
                limit: 5
            }
        });
        
        if (response.data && response.data.observations) {
            console.log('✅ FRED API: Connected successfully');
            console.log(`   Sample GDP data: ${response.data.observations.length} observations`);
            
            // Save sample data
            await fs.writeFile(
                'public/ai-data-test/fred-test.json', 
                JSON.stringify(response.data.observations.slice(0, 3), null, 2)
            );
            
            return true;
        } else {
            console.log('❌ FRED API: Invalid response format');
            return false;
        }
    } catch (error) {
        console.log('❌ FRED API: Error -', error.response?.data?.error_message || error.message);
        return false;
    }
}

testFred();
EOF
    
    node test-fred.mjs
    rm test-fred.mjs
    echo ""
fi

# Test World Bank API
echo "🌍 Testing World Bank API..."

cat > test-worldbank.mjs << 'EOF'
import axios from 'axios';
import fs from 'fs/promises';

async function testWorldBank() {
    try {
        console.log('Testing World Bank API connection...');
        
        const response = await axios.get('https://api.worldbank.org/v2/country/US/indicator/NY.GDP.MKTP.CD', {
            params: {
                format: 'json',
                date: '2020:2023',
                per_page: 5
            }
        });
        
        if (response.data && Array.isArray(response.data) && response.data[1]) {
            console.log('✅ World Bank API: Connected successfully');
            console.log(`   Sample US GDP data: ${response.data[1].length} data points`);
            
            // Save sample data
            await fs.writeFile(
                'public/ai-data-test/worldbank-test.json', 
                JSON.stringify(response.data[1].slice(0, 3), null, 2)
            );
            
            return true;
        } else {
            console.log('❌ World Bank API: Invalid response format');
            return false;
        }
    } catch (error) {
        console.log('❌ World Bank API: Error -', error.message);
        return false;
    }
}

testWorldBank();
EOF

node test-worldbank.mjs
rm test-worldbank.mjs
echo ""

# Test Alpha Vantage if available
if [ "$AV_AVAILABLE" = true ]; then
    echo "💹 Testing Alpha Vantage API..."
    
    cat > test-alphavantage.mjs << 'EOF'
import axios from 'axios';
import fs from 'fs/promises';

async function testAlphaVantage() {
    try {
        console.log('Testing Alpha Vantage API connection...');
        
        const response = await axios.get('https://www.alphavantage.co/query', {
            params: {
                function: 'TIME_SERIES_MONTHLY',
                symbol: 'SPY',
                apikey: process.env.VITE_ALPHA_VANTAGE_API_KEY
            }
        });
        
        if (response.data && response.data['Monthly Time Series']) {
            console.log('✅ Alpha Vantage API: Connected successfully');
            const dataCount = Object.keys(response.data['Monthly Time Series']).length;
            console.log(`   Sample SPY data: ${dataCount} monthly data points`);
            
            // Save sample data
            const sampleData = Object.entries(response.data['Monthly Time Series'])
                .slice(0, 3)
                .reduce((obj, [key, value]) => {
                    obj[key] = value;
                    return obj;
                }, {});
            
            await fs.writeFile(
                'public/ai-data-test/alphavantage-test.json', 
                JSON.stringify(sampleData, null, 2)
            );
            
            return true;
        } else if (response.data && response.data['Error Message']) {
            console.log('❌ Alpha Vantage API: Error -', response.data['Error Message']);
            return false;
        } else if (response.data && response.data['Note']) {
            console.log('⚠️ Alpha Vantage API: Rate limited -', response.data['Note']);
            return false;
        } else {
            console.log('❌ Alpha Vantage API: Invalid response format');
            return false;
        }
    } catch (error) {
        console.log('❌ Alpha Vantage API: Error -', error.message);
        return false;
    }
}

testAlphaVantage();
EOF
    
    node test-alphavantage.mjs
    rm test-alphavantage.mjs
    echo ""
fi

# Create a simple correlation test
echo "🔗 Testing correlation calculation..."

cat > test-correlation.mjs << 'EOF'
import fs from 'fs/promises';

function calculateCorrelation(x, y) {
    const n = x.length;
    if (n !== y.length || n === 0) return 0;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
}

async function testCorrelation() {
    // Test with sample data
    const dataset1 = [1, 2, 3, 4, 5];
    const dataset2 = [2, 4, 6, 8, 10];  // Perfect positive correlation
    
    const correlation = calculateCorrelation(dataset1, dataset2);
    
    console.log('Testing correlation calculation...');
    console.log(`Sample data 1: [${dataset1.join(', ')}]`);
    console.log(`Sample data 2: [${dataset2.join(', ')}]`);
    console.log(`Correlation: ${correlation.toFixed(3)} (should be ~1.000)`);
    
    if (Math.abs(correlation - 1.0) < 0.001) {
        console.log('✅ Correlation calculation: Working correctly');
        
        // Save test correlation
        const testCorrelation = {
            title: 'Test Correlation',
            correlation: correlation,
            description: 'Perfect positive correlation test',
            data: dataset1.map((val, i) => ({
                year: 2020 + i,
                value1: val,
                value2: dataset2[i]
            }))
        };
        
        await fs.writeFile(
            'public/ai-data-test/test-correlation.json', 
            JSON.stringify(testCorrelation, null, 2)
        );
        
        return true;
    } else {
        console.log('❌ Correlation calculation: Error in calculation');
        return false;
    }
}

testCorrelation();
EOF

node test-correlation.mjs
rm test-correlation.mjs
echo ""

# Summary
echo "📋 Test Summary"
echo "==============="
echo ""

if [ -f "public/ai-data-test/fred-test.json" ]; then
    echo "✅ FRED API test data saved"
fi

if [ -f "public/ai-data-test/worldbank-test.json" ]; then
    echo "✅ World Bank API test data saved"
fi

if [ -f "public/ai-data-test/alphavantage-test.json" ]; then
    echo "✅ Alpha Vantage API test data saved"
fi

if [ -f "public/ai-data-test/test-correlation.json" ]; then
    echo "✅ Correlation calculation test passed"
fi

echo ""
echo "📁 Test files saved in: public/ai-data-test/"
echo ""

# Check test files
TEST_FILES=$(ls public/ai-data-test/ 2>/dev/null | wc -l)
if [ "$TEST_FILES" -gt 0 ]; then
    echo "🎉 Local testing completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. 🔑 Add your API keys to GitHub repository secrets"
    echo "2. 🚀 Push the workflow file to trigger automated collection"
    echo "3. 📊 Monitor the GitHub Actions tab for daily updates"
    echo ""
    echo "💡 Tip: The GitHub workflow will collect much more data than this test!"
else
    echo "⚠️ No test data was collected. Please check your API keys and try again."
    echo ""
    echo "Troubleshooting:"
    echo "1. Verify API keys in .env file"
    echo "2. Check internet connection"
    echo "3. Ensure API keys are valid and active"
fi

echo ""
echo "🧹 Cleaning up test files..."
rm -rf public/ai-data-test/
echo "✅ Cleanup complete"

echo ""
echo "Happy correlating! 🎯"