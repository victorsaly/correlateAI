#!/bin/bash

# Test the correlation path fix
echo "🧪 Testing correlation file path construction fix..."

# Create test script that mimics the updated correlation logic
cat > test-correlation-paths.js << 'EOF'
import { promises as fs } from 'fs';
import path from 'path';

async function testPathConstruction() {
    const dataDir = 'public/ai-data';
    
    // Test datasets that represent different sources
    const testDatasets = [
        {
            id: 'climate-global-temperatures',
            source: 'OpenWeather API',
            name: 'Global Temperatures'
        },
        {
            id: 'gdp',
            source: 'FRED',
            name: 'GDP Data'
        },
        {
            id: 'ny-gdp-mktp-cd',
            source: 'World Bank',
            name: 'World Bank GDP'
        }
    ];
    
    console.log('🔍 Testing path construction for different sources:');
    
    for (const dataset of testDatasets) {
        let dataPath;
        
        // Apply the same logic as in the fixed correlation script
        if (dataset.source === 'OpenWeather API') {
            dataPath = path.join(dataDir, `${dataset.id}.json`);
        } else {
            const cleanSource = dataset.source.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
            dataPath = path.join(dataDir, `${cleanSource}-${dataset.id}.json`);
        }
        
        console.log(`📁 ${dataset.source} → ${dataPath}`);
        
        // Check if file exists
        try {
            await fs.access(dataPath);
            console.log(`   ✅ File exists`);
        } catch (error) {
            console.log(`   ❌ File not found, checking alternatives...`);
            
            // Try alternative path
            const altPath = path.join(dataDir, `${dataset.id}.json`);
            try {
                await fs.access(altPath);
                console.log(`   ✅ Alternative path found: ${altPath}`);
            } catch (altError) {
                console.log(`   ⚠️  No file found for ${dataset.id}`);
            }
        }
    }
}

testPathConstruction().catch(console.error);
EOF

echo "Running path construction test..."
node test-correlation-paths.js

# Cleanup
rm -f test-correlation-paths.js

echo ""
echo "✅ Path construction test completed!"