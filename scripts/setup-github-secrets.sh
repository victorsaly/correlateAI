#!/bin/bash

# 🔐 Semi-Automated GitHub Secrets Setup
# Uses GitHub CLI to set repository secrets

echo "🔐 GitHub Repository Secrets Setup"
echo "=================================="
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo ""
    echo "To install GitHub CLI:"
    echo "  macOS: brew install gh"
    echo "  Or visit: https://cli.github.com/"
    echo ""
    echo "After installation:"
    echo "1. Run: gh auth login"
    echo "2. Run this script again"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &>/dev/null; then
    echo "❌ Not authenticated with GitHub CLI"
    echo ""
    echo "Please run: gh auth login"
    echo "Then run this script again"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Load environment variables from .env
if [ -f ".env" ]; then
    echo "📋 Loading API keys from .env file..."
    
    # Read API keys from .env
    FRED_KEY=$(grep "VITE_FRED_API_KEY" .env | cut -d '=' -f2)
    ALPHA_KEY=$(grep "VITE_ALPHA_VANTAGE_API_KEY" .env | cut -d '=' -f2)
    WEATHER_KEY=$(grep "VITE_OPENWEATHER_API_KEY" .env | cut -d '=' -f2)
    
    echo "✅ FRED API Key: ${FRED_KEY:0:8}..."
    echo "✅ Alpha Vantage Key: ${ALPHA_KEY:0:8}..."
    echo "✅ OpenWeather Key: ${WEATHER_KEY:0:8}..."
    echo ""
else
    echo "❌ .env file not found"
    exit 1
fi

# Confirm with user
echo "🚨 SECURITY WARNING: This will add your API keys to GitHub repository secrets"
echo "Repository: $(gh repo view --json nameWithOwner -q .nameWithOwner)"
echo ""
read -p "Do you want to continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled by user"
    exit 1
fi

echo ""
echo "🔄 Adding secrets to GitHub repository..."

# Add secrets using GitHub CLI
echo "Adding VITE_FRED_API_KEY..."
if echo "$FRED_KEY" | gh secret set VITE_FRED_API_KEY; then
    echo "✅ VITE_FRED_API_KEY added successfully"
else
    echo "❌ Failed to add VITE_FRED_API_KEY"
fi

echo "Adding VITE_ALPHA_VANTAGE_API_KEY..."
if echo "$ALPHA_KEY" | gh secret set VITE_ALPHA_VANTAGE_API_KEY; then
    echo "✅ VITE_ALPHA_VANTAGE_API_KEY added successfully"
else
    echo "❌ Failed to add VITE_ALPHA_VANTAGE_API_KEY"
fi

echo "Adding VITE_OPENWEATHER_API_KEY..."
if echo "$WEATHER_KEY" | gh secret set VITE_OPENWEATHER_API_KEY; then
    echo "✅ VITE_OPENWEATHER_API_KEY added successfully"
else
    echo "❌ Failed to add VITE_OPENWEATHER_API_KEY"
fi

echo ""
echo "🎉 GitHub secrets setup complete!"
echo ""
echo "📋 Verify your secrets:"
echo "1. Go to: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/settings/secrets/actions"
echo "2. Check that all 3 secrets are listed"
echo ""
echo "🚀 Next steps:"
echo "1. Push your workflow file: git push origin $(git branch --show-current)"
echo "2. Monitor GitHub Actions: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/actions"
echo "3. Enjoy automated data collection!"