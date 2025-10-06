#!/bin/bash

# Test script for data collection workflow
echo "🧪 Testing CorrelateAI Data Collection Workflow"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test functions
test_passed() {
    echo -e "${GREEN}✅ PASS${NC}: $1"
}

test_failed() {
    echo -e "${RED}❌ FAIL${NC}: $1"
    return 1
}

test_warning() {
    echo -e "${YELLOW}⚠️  WARN${NC}: $1"
}

test_info() {
    echo -e "ℹ️  INFO: $1"
}

# Test 1: Check if the workflow file exists and is valid YAML
echo ""
echo "🔍 Test 1: Workflow File Validation"
if [ -f ".github/workflows/automated-data-collection.yml" ]; then
    test_passed "Workflow file exists"
    
    # Check YAML syntax
    if npx yaml-lint .github/workflows/automated-data-collection.yml >/dev/null 2>&1; then
        test_passed "YAML syntax is valid"
    else
        test_failed "YAML syntax validation failed"
        exit 1
    fi
else
    test_failed "Workflow file not found"
    exit 1
fi

# Test 2: Check Node.js and npm
echo ""
echo "🔍 Test 2: Runtime Environment"
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    test_passed "Node.js available ($NODE_VERSION)"
else
    test_failed "Node.js not found"
    exit 1
fi

if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    test_passed "npm available ($NPM_VERSION)"
else
    test_failed "npm not found"
    exit 1
fi

# Test 3: Check package.json configuration
echo ""
echo "🔍 Test 3: Package Configuration"
if [ -f "package.json" ]; then
    test_passed "package.json exists"
    
    # Check if type: module is set
    if grep -q '"type": "module"' package.json; then
        test_passed "ES modules configured"
    else
        test_warning "ES modules not configured (may cause import issues)"
    fi
else
    test_failed "package.json not found"
fi

# Test 4: Check required dependencies
echo ""
echo "🔍 Test 4: Dependencies Check"
REQUIRED_DEPS=("axios" "papaparse" "date-fns")
MISSING_DEPS=()

for dep in "${REQUIRED_DEPS[@]}"; do
    if npm list "$dep" >/dev/null 2>&1; then
        test_passed "$dep is installed"
    else
        MISSING_DEPS+=("$dep")
        test_warning "$dep is not installed (will be installed by workflow)"
    fi
done

# Test 5: Check directory structure
echo ""
echo "🔍 Test 5: Directory Structure"
if [ -d "public" ]; then
    test_passed "public/ directory exists"
else
    test_warning "public/ directory not found (will be created)"
fi

if [ -d "public/ai-data" ]; then
    test_passed "public/ai-data/ directory exists"
    
    # Count existing datasets
    JSON_FILES=$(find public/ai-data -name "*.json" 2>/dev/null | wc -l | tr -d ' ')
    test_info "Found $JSON_FILES existing data files"
else
    test_warning "public/ai-data/ directory not found (will be created)"
fi

# Test 6: Create and test a simple data collection script
echo ""
echo "🔍 Test 6: Script Execution Test"

# Create a simple test script using ES modules
cat > test-data-script.js << 'EOF'
import { promises as fs } from 'fs';
import path from 'path';

async function testDataCollection() {
    console.log('🧪 Testing data collection script...');
    
    // Ensure directory exists
    await fs.mkdir('test-output', { recursive: true });
    
    // Create test data
    const testData = [
        { year: 2020, value: 100 },
        { year: 2021, value: 105 },
        { year: 2022, value: 110 },
        { year: 2023, value: 115 }
    ];
    
    // Save test data
    await fs.writeFile('test-output/test-data.json', JSON.stringify(testData, null, 2));
    
    // Create metadata
    const metadata = {
        id: 'test-data',
        name: 'Test Dataset',
        unit: 'Units',
        category: 'test',
        source: 'Test Script',
        lastUpdated: new Date().toISOString(),
        dataPoints: testData.length,
        description: 'Test dataset for workflow validation'
    };
    
    await fs.writeFile('test-output/test-data_metadata.json', JSON.stringify(metadata, null, 2));
    
    console.log('✅ Test script executed successfully');
    return true;
}

testDataCollection().catch(console.error);
EOF

# Run the test script
if node test-data-script.js >/dev/null 2>&1; then
    test_passed "ES module script execution works"
    
    # Check if files were created
    if [ -f "test-output/test-data.json" ] && [ -f "test-output/test-data_metadata.json" ]; then
        test_passed "Data files created successfully"
        
        # Cleanup
        rm -rf test-output test-data-script.js
    else
        test_failed "Data files not created"
    fi
else
    test_failed "ES module script execution failed"
    test_info "This may indicate issues with the Node.js environment or module system"
fi

# Test 7: Environment Variables Check
echo ""
echo "🔍 Test 7: Environment Variables"
ENV_VARS=("FRED_API_KEY" "ALPHA_VANTAGE_API_KEY" "OPENWEATHER_API_KEY")

test_info "Checking for API keys (these should be set as GitHub secrets):"
for var in "${ENV_VARS[@]}"; do
    if [ -n "${!var}" ]; then
        test_passed "$var is set locally"
    else
        test_info "$var not set locally (should be configured as GitHub secret)"
    fi
done

# Test 8: Workflow Trigger Configuration
echo ""
echo "🔍 Test 8: Workflow Configuration"

# Check if the workflow has proper triggers
if grep -q "schedule:" .github/workflows/automated-data-collection.yml; then
    test_passed "Scheduled trigger configured"
else
    test_warning "Scheduled trigger not found"
fi

if grep -q "workflow_dispatch:" .github/workflows/automated-data-collection.yml; then
    test_passed "Manual trigger configured"
else
    test_warning "Manual trigger not found"
fi

# Summary
echo ""
echo "📊 Test Summary"
echo "==============="
test_info "Workflow is ready for GitHub Actions execution"
test_info "Remember to configure the following GitHub secrets:"
echo "   - FRED_API_KEY (for economic data)"
echo "   - ALPHA_VANTAGE_API_KEY (for financial data)" 
echo "   - OPENWEATHER_API_KEY (for weather data)"
echo ""
test_info "The workflow will run daily at 6 AM UTC and can be triggered manually"
test_info "Data will be collected and committed to the repository automatically"

echo ""
echo "🎉 Workflow testing completed!"