#!/bin/bash

# Test GitHub Actions permissions in local development
# This script tests the automated data collection workflow permissions

echo "🧪 Testing GitHub Actions permissions and workflow configuration..."

# Check if we're in the right directory
if [ ! -f ".github/workflows/automated-data-collection.yml" ]; then
    echo "❌ Error: Not in CorrelateAI repository root"
    exit 1
fi

echo "📁 Repository structure check:"
echo "✅ Found automated data collection workflow"

# Check current git status
echo ""
echo "🔄 Current git status:"
git status --porcelain

# Check if there are uncommitted changes that might affect testing
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: Uncommitted changes detected"
fi

# Test git configuration
echo ""
echo "🔧 Git configuration:"
echo "User name: $(git config user.name)"
echo "User email: $(git config user.email)"
echo "Remote origin: $(git remote get-url origin)"

# Check GitHub CLI authentication (if available)
echo ""
echo "🔐 GitHub CLI authentication check:"
if command -v gh &> /dev/null; then
    gh auth status 2>/dev/null || echo "❌ GitHub CLI not authenticated"
else
    echo "ℹ️  GitHub CLI not installed"
fi

# Test basic workflow syntax
echo ""
echo "🧾 Workflow syntax validation:"
if command -v yamllint &> /dev/null; then
    yamllint .github/workflows/automated-data-collection.yml
else
    echo "ℹ️  yamllint not available, skipping syntax check"
fi

# Check workflow permissions
echo ""
echo "🔐 Workflow permissions configuration:"
grep -A 5 "permissions:" .github/workflows/automated-data-collection.yml

# Check Node.js and npm setup
echo ""
echo "🟢 Node.js environment:"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Test npm dependencies
echo ""
echo "📦 Testing npm dependencies:"
if npm list axios papaparse date-fns > /dev/null 2>&1; then
    echo "✅ Core dependencies installed"
else
    echo "⚠️  Some dependencies may be missing"
    npm list axios papaparse date-fns 2>/dev/null || true
fi

# Test data collection scripts availability
echo ""
echo "📊 Data collection scripts check:"
scripts=(
    "scripts/generate-ai-datasets-enhanced.js"
    "src/services/dataPipelineService.ts" 
    "src/services/automatedDataService.ts"
)

for script in "${scripts[@]}"; do
    if [ -f "$script" ]; then
        echo "✅ Found: $script"
    else
        echo "❌ Missing: $script"
    fi
done

# Test API keys availability (without exposing values)
echo ""
echo "🔑 API keys configuration check:"
api_keys=(
    "FRED_API_KEY"
    "ALPHA_VANTAGE_API_KEY" 
    "WORLD_BANK_API_KEY"
    "OPENWEATHER_API_KEY"
)

for key in "${api_keys[@]}"; do
    if [ -n "${!key}" ]; then
        echo "✅ $key is set"
    else
        echo "⚠️  $key is not set in environment"
    fi
done

# Test local data pipeline execution (dry run)
echo ""
echo "🧪 Testing local data pipeline (dry run):"
if [ -f "scripts/generate-ai-datasets-enhanced.js" ]; then
    echo "Running data pipeline test..."
    node scripts/generate-ai-datasets-enhanced.js --dry-run 2>/dev/null || echo "⚠️  Data pipeline test failed (API keys may be required)"
else
    echo "❌ Data pipeline script not found"
fi

echo ""
echo "🎯 Recommendations for GitHub Actions permissions issues:"
echo "1. Ensure repository has 'Actions permissions' set to 'Allow all actions'"
echo "2. Check that 'Workflow permissions' is set to 'Read and write permissions'"
echo "3. Verify that 'Allow GitHub Actions to create and approve pull requests' is enabled"
echo "4. Consider regenerating GITHUB_TOKEN if issues persist"
echo ""
echo "📋 To manually trigger the workflow:"
echo "   gh workflow run 'Automated Data Collection & Correlation Discovery'"
echo ""
echo "✅ Permission test completed!"