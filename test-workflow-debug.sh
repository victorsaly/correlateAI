#!/bin/bash

# Test script to isolate GitHub Actions workflow issues
echo "🧪 Testing individual workflow components..."

# Test 1: Basic Node.js script execution
echo "📋 Test 1: Basic Node.js ES Module Test"
cat > test-basic.js << 'EOF'
import { promises as fs } from 'fs';
import path from 'path';

async function basicTest() {
    console.log('✅ ES modules working');
    console.log('3'); // Simulate count output
}

basicTest().catch(console.error);
EOF

echo "Running basic test..."
if node test-basic.js; then
    echo "✅ Basic Node.js test passed"
else
    echo "❌ Basic Node.js test failed"
fi

# Test 2: Output extraction method
echo ""
echo "📋 Test 2: Output Extraction Test"
OUTPUT=$(node test-basic.js 2>&1)
COUNT=$(echo "$OUTPUT" | tail -1 | grep -o '[0-9]*' || echo "0")
echo "Extracted count: '$COUNT'"

if [ "$COUNT" = "3" ]; then
    echo "✅ Output extraction working"
else
    echo "❌ Output extraction failed"
fi

# Test 3: GITHUB_OUTPUT simulation
echo ""
echo "📋 Test 3: GITHUB_OUTPUT Test"
export GITHUB_OUTPUT=$(mktemp)
echo "test-output=$COUNT" >> "$GITHUB_OUTPUT"
if [ -f "$GITHUB_OUTPUT" ] && grep -q "test-output=3" "$GITHUB_OUTPUT"; then
    echo "✅ GITHUB_OUTPUT mechanism working"
    cat "$GITHUB_OUTPUT"
else
    echo "❌ GITHUB_OUTPUT mechanism failed"
fi

# Test 4: Simulate the exact workflow command
echo ""
echo "📋 Test 4: Simulate Exact Workflow Commands"

# Test the exact commands from workflow
cat > test-workflow-sim.js << 'EOF'
import { promises as fs } from 'fs';
import path from 'path';

async function main() {
    console.log('📊 Starting test data collection...');
    
    // Simulate successful data collection
    const testData = [
        { year: 2020, value: 100 },
        { year: 2021, value: 105 }
    ];
    
    console.log(`✅ Test data collection complete! Updated ${testData.length} datasets`);
    return testData.length;
}

main().then(count => {
    console.log(`✅ FRED data collection complete! Updated ${count} datasets`);
}).catch(console.error);
EOF

echo "Running workflow simulation..."
WORKFLOW_OUTPUT=$(node test-workflow-sim.js 2>&1)
echo "Workflow output:"
echo "$WORKFLOW_OUTPUT"

WORKFLOW_COUNT=$(echo "$WORKFLOW_OUTPUT" | tail -1 | grep -o '[0-9]*' || echo "0")
echo "Extracted workflow count: '$WORKFLOW_COUNT'"

echo "test-result=$WORKFLOW_COUNT" >> "$GITHUB_OUTPUT"

# Test 5: Check for potential issues
echo ""
echo "📋 Test 5: Dependency Check"
if npm list axios >/dev/null 2>&1; then
    echo "✅ axios available"
else
    echo "⚠️  axios not found"
fi

if npm list papaparse >/dev/null 2>&1; then
    echo "✅ papaparse available"
else
    echo "⚠️  papaparse not found"
fi

if npm list date-fns >/dev/null 2>&1; then
    echo "✅ date-fns available"
else
    echo "⚠️  date-fns not found"
fi

# Cleanup
rm -f test-basic.js test-workflow-sim.js "$GITHUB_OUTPUT"

echo ""
echo "🎉 All local tests completed!"
echo "If tests pass but workflow fails, the issue is likely:"
echo "1. Missing GitHub secrets (API keys)"
echo "2. Network connectivity in GitHub runners"
echo "3. Permission issues in GitHub Actions"
echo "4. Environment differences in GitHub runners"