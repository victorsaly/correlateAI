#!/bin/bash

# Minimal test script to diagnose workflow issues
echo "🧪 Diagnosing GitHub Actions workflow failure..."

# Test 1: Check if we can create and run a simple script with imports
echo "📋 Test 1: ES Module Import Test"
cat > test-import.js << 'EOF'
import { promises as fs } from 'fs';
import path from 'path';

async function test() {
    console.log('✅ ES modules working');
    console.log('✅ fs.promises available');
    console.log('✅ path module available');
    
    // Test directory creation
    await fs.mkdir('test-dir', { recursive: true });
    console.log('✅ Directory creation works');
    
    // Test file writing
    await fs.writeFile('test-dir/test.json', '{"test": true}');
    console.log('✅ File writing works');
    
    // Cleanup
    await fs.rm('test-dir', { recursive: true, force: true });
    console.log('✅ Cleanup works');
}

test().then(() => {
    console.log('🎉 All basic operations successful');
}).catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
EOF

if node test-import.js; then
    echo "✅ ES module test passed"
else
    echo "❌ ES module test failed"
    exit 1
fi

# Test 2: Check axios availability 
echo ""
echo "📋 Test 2: Axios HTTP Client Test"
cat > test-axios.js << 'EOF'
import axios from 'axios';

async function testAxios() {
    console.log('✅ Axios imported successfully');
    
    // Test a simple HTTP request to a reliable endpoint
    try {
        const response = await axios.get('https://httpbin.org/json', {
            timeout: 10000
        });
        console.log('✅ HTTP request successful');
        console.log('✅ Response status:', response.status);
    } catch (error) {
        console.error('❌ HTTP request failed:', error.message);
        throw error;
    }
}

testAxios().then(() => {
    console.log('🎉 Axios test successful');
}).catch(error => {
    console.error('❌ Axios test failed:', error.message);
    process.exit(1);
});
EOF

if node test-axios.js; then
    echo "✅ Axios test passed"
else
    echo "❌ Axios test failed"
    echo "This might indicate network issues or missing dependencies"
    exit 1
fi

# Test 3: Check package.json configuration
echo ""
echo "📋 Test 3: Package Configuration Check"
if grep -q '"type": "module"' package.json; then
    echo "✅ ES modules configured in package.json"
else
    echo "❌ ES modules not configured - this could cause import issues"
    exit 1
fi

# Test 4: Check dependency availability
echo ""
echo "📋 Test 4: Required Dependencies Check"
REQUIRED_DEPS=("axios" "papaparse" "date-fns")
for dep in "${REQUIRED_DEPS[@]}"; do
    if npm list "$dep" >/dev/null 2>&1; then
        echo "✅ $dep is available"
    else
        echo "⚠️  $dep not found - workflow will need to install it"
    fi
done

# Test 5: Simulate GitHub Actions environment
echo ""
echo "📋 Test 5: GitHub Actions Environment Simulation"
cat > test-gh-env.js << 'EOF'
// Simulate the GitHub Actions environment conditions
import { promises as fs } from 'fs';
import path from 'path';

async function simulateWorkflow() {
    console.log('🔄 Simulating GitHub Actions workflow...');
    
    // Test 1: Ensure directories exist (like in workflow)
    await fs.mkdir('public/ai-data', { recursive: true });
    console.log('✅ Directory creation successful');
    
    // Test 2: Write a test dataset
    const testData = [
        { year: 2020, value: 100 },
        { year: 2021, value: 105 },
        { year: 2022, value: 110 }
    ];
    
    await fs.writeFile(
        'public/ai-data/test-dataset.json',
        JSON.stringify(testData, null, 2)
    );
    console.log('✅ Dataset creation successful');
    
    // Test 3: Write metadata
    const metadata = {
        id: 'test-dataset',
        name: 'Test Dataset',
        unit: 'Units',
        category: 'test',
        source: 'Test Source',
        lastUpdated: new Date().toISOString(),
        dataPoints: testData.length
    };
    
    await fs.writeFile(
        'public/ai-data/test-dataset_metadata.json',
        JSON.stringify(metadata, null, 2)
    );
    console.log('✅ Metadata creation successful');
    
    // Test 4: Simulate output setting (like in GitHub Actions)
    console.log('::set-output name=test-result::success');
    console.log('✅ GitHub Actions output simulation successful');
    
    // Cleanup
    await fs.rm('public/ai-data/test-dataset.json', { force: true });
    await fs.rm('public/ai-data/test-dataset_metadata.json', { force: true });
    console.log('✅ Cleanup successful');
}

simulateWorkflow().then(() => {
    console.log('🎉 GitHub Actions simulation successful');
}).catch(error => {
    console.error('❌ Simulation failed:', error.message);
    process.exit(1);
});
EOF

if node test-gh-env.js; then
    echo "✅ GitHub Actions simulation passed"
else
    echo "❌ GitHub Actions simulation failed"
    exit 1
fi

# Cleanup test files
rm -f test-import.js test-axios.js test-gh-env.js

echo ""
echo "🎉 All diagnostic tests passed!"
echo "The workflow should work in GitHub Actions environment."
echo ""
echo "If the workflow is still failing, the issue is likely:"
echo "1. Missing API keys in GitHub secrets"
echo "2. Network connectivity issues in GitHub runners"
echo "3. Rate limiting from API providers"
echo "4. GitHub Actions runner environment differences"