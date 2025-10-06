#!/bin/bash

# Test the updated GitHub Actions output syntax
echo "🧪 Testing GitHub Actions Output Fix"

# Create a mock GITHUB_OUTPUT file
export GITHUB_OUTPUT=$(mktemp)
echo "Created mock GITHUB_OUTPUT file: $GITHUB_OUTPUT"

# Test 1: Simple script with corrected output
cat > test-output.js << 'EOF'
import { promises as fs } from 'fs';

async function testDataCollection() {
    console.log('🔄 Starting test data collection...');
    
    // Simulate data collection
    const mockData = [
        { year: 2020, value: 100 },
        { year: 2021, value: 105 },
        { year: 2022, value: 110 }
    ];
    
    console.log(`✅ Test data collection complete! Updated ${mockData.length} datasets`);
    return mockData.length;
}

testDataCollection().then(count => {
    console.log(`✅ Generated ${count} datasets`);
}).catch(console.error);
EOF

echo "📋 Testing script execution and output capture..."

# Run the script and capture output
SCRIPT_OUTPUT=$(node test-output.js 2>&1)
echo "Script output:"
echo "$SCRIPT_OUTPUT"

# Extract count using the same method as in workflow
COUNT=$(echo "$SCRIPT_OUTPUT" | tail -1 | grep -o '[0-9]*' || echo "0")
echo "Extracted count: $COUNT"

# Test writing to GITHUB_OUTPUT
echo "datasets-updated=$COUNT" >> $GITHUB_OUTPUT

# Verify output was written correctly
echo "Contents of GITHUB_OUTPUT:"
cat $GITHUB_OUTPUT

# Cleanup
rm -f test-output.js
rm -f $GITHUB_OUTPUT

if [ "$COUNT" = "3" ]; then
    echo "✅ GitHub Actions output fix successful!"
    echo "The workflow should now work correctly."
else
    echo "❌ Output capture failed"
    exit 1
fi