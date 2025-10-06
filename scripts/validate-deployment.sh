#!/bin/bash

# 🔍 Final Validation Script
# Checks if everything is ready for GitHub Actions deployment

echo "🔍 Final Deployment Validation"
echo "=============================="
echo ""

# Check if .env file exists and has required keys
echo "📋 Checking local environment..."
if [ -f ".env" ]; then
    echo "✅ .env file found"
    
    # Check for API keys in .env
    if grep -q "VITE_FRED_API_KEY" .env; then
        echo "✅ FRED API key present in .env"
    else
        echo "❌ FRED API key missing from .env"
    fi
    
    if grep -q "VITE_ALPHA_VANTAGE_API_KEY" .env; then
        echo "✅ Alpha Vantage API key present in .env"
    else
        echo "❌ Alpha Vantage API key missing from .env"
    fi
    
    if grep -q "VITE_OPENWEATHER_API_KEY" .env; then
        echo "✅ OpenWeather API key present in .env"
    else
        echo "❌ OpenWeather API key missing from .env"
    fi
else
    echo "❌ .env file not found"
fi

echo ""

# Check if GitHub workflow file exists
echo "🤖 Checking GitHub Actions workflow..."
if [ -f ".github/workflows/automated-data-collection.yml" ]; then
    echo "✅ GitHub Actions workflow file found"
    
    # Check if workflow contains our API key references
    if grep -q "VITE_FRED_API_KEY\|FRED_API_KEY" .github/workflows/automated-data-collection.yml; then
        echo "✅ FRED API integration configured in workflow"
    else
        echo "❌ FRED API not configured in workflow"
    fi
    
    if grep -q "VITE_ALPHA_VANTAGE_API_KEY\|ALPHA_VANTAGE_API_KEY" .github/workflows/automated-data-collection.yml; then
        echo "✅ Alpha Vantage API integration configured in workflow"
    else
        echo "❌ Alpha Vantage API not configured in workflow"
    fi
    
    if grep -q "VITE_OPENWEATHER_API_KEY\|OPENWEATHER_API_KEY" .github/workflows/automated-data-collection.yml; then
        echo "✅ OpenWeather API integration configured in workflow"
    else
        echo "❌ OpenWeather API not configured in workflow"
    fi
else
    echo "❌ GitHub Actions workflow file not found"
fi

echo ""

# Check if data directories exist
echo "📁 Checking data structure..."
if [ -d "public/ai-data" ]; then
    echo "✅ Main data directory exists"
    
    # Count existing datasets
    json_files=$(find public/ai-data -name "*.json" -not -name "*_metadata.json" 2>/dev/null | wc -l)
    echo "📊 Current datasets: $json_files files"
else
    echo "⚠️ Main data directory doesn't exist (will be created by workflow)"
fi

echo ""

# Check if required scripts exist
echo "🧪 Checking test scripts..."
if [ -f "scripts/test-api-keys.mjs" ]; then
    echo "✅ API key test script available"
else
    echo "❌ API key test script missing"
fi

if [ -f "scripts/test-workflow.mjs" ]; then
    echo "✅ Workflow test script available"
else
    echo "❌ Workflow test script missing"
fi

echo ""

# Final recommendations
echo "🚀 Deployment Readiness Check"
echo "============================="
echo ""
echo "Ready for GitHub Actions? Follow these steps:"
echo ""
echo "1. 🔐 Add API keys to GitHub repository secrets:"
echo "   Go to: GitHub repo → Settings → Secrets and variables → Actions"
echo "   Add:"
echo "   - VITE_FRED_API_KEY"
echo "   - VITE_ALPHA_VANTAGE_API_KEY" 
echo "   - VITE_OPENWEATHER_API_KEY"
echo ""
echo "2. 📤 Push your changes to GitHub:"
echo "   git add ."
echo "   git commit -m \"Add automated data collection workflow\""
echo "   git push origin main"
echo ""
echo "3. 👀 Monitor the workflow:"
echo "   Check GitHub → Actions tab for execution"
echo ""
echo "4. 🎉 Enjoy automated daily data updates!"
echo ""

# Check git status
if command -v git &> /dev/null; then
    echo "📋 Git Status:"
    if git rev-parse --git-dir > /dev/null 2>&1; then
        echo "✅ Git repository detected"
        
        # Check if there are uncommitted changes
        if [ -n "$(git status --porcelain)" ]; then
            echo "⚠️ You have uncommitted changes - remember to commit and push!"
        else
            echo "✅ No uncommitted changes"
        fi
        
        # Check current branch
        current_branch=$(git branch --show-current 2>/dev/null || echo "unknown")
        echo "🌿 Current branch: $current_branch"
    else
        echo "❌ Not in a git repository"
    fi
else
    echo "❌ Git not available"
fi

echo ""
echo "💡 Run 'node scripts/test-workflow.mjs' to test everything locally first!"