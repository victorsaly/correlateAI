#!/bin/bash

# 📋 GitHub Secrets Setup Helper
# Provides copy-paste ready values for manual setup

echo "🔐 GitHub Repository Secrets - Copy & Paste Helper"
echo "================================================="
echo ""
echo "Since GitHub secrets must be added manually for security, here are your"
echo "ready-to-copy values for the GitHub web interface:"
echo ""

# Load from .env file
if [ -f ".env" ]; then
    echo "📋 Your API Keys (ready to copy):"
    echo "================================"
    echo ""
    
    # Extract keys from .env
    FRED_KEY=$(grep "VITE_FRED_API_KEY" .env | cut -d '=' -f2)
    ALPHA_KEY=$(grep "VITE_ALPHA_VANTAGE_API_KEY" .env | cut -d '=' -f2)
    WEATHER_KEY=$(grep "VITE_OPENWEATHER_API_KEY" .env | cut -d '=' -f2)
    
    echo "1️⃣ FRED API Key:"
    echo "   Name: VITE_FRED_API_KEY"
    echo "   Value: $FRED_KEY"
    echo ""
    
    echo "2️⃣ Alpha Vantage API Key:"
    echo "   Name: VITE_ALPHA_VANTAGE_API_KEY" 
    echo "   Value: $ALPHA_KEY"
    echo ""
    
    echo "3️⃣ OpenWeather API Key:"
    echo "   Name: VITE_OPENWEATHER_API_KEY"
    echo "   Value: $WEATHER_KEY"
    echo ""
    
    echo "🌐 GitHub Setup Steps:"
    echo "====================="
    echo ""
    echo "1. Open: https://github.com/victorsaly/correlateAI/settings/secrets/actions"
    echo "2. Click 'New repository secret' for each key above"
    echo "3. Copy the Name and Value exactly as shown"
    echo "4. Click 'Add secret'"
    echo ""
    echo "💡 Pro tip: Keep this terminal open and copy each value one by one!"
    echo ""
    
    # Open GitHub directly (macOS)
    echo "🚀 Want me to open GitHub for you? (macOS only)"
    read -p "Open GitHub secrets page? (y/N): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "https://github.com/victorsaly/correlateAI/settings/secrets/actions"
        echo "✅ GitHub secrets page opened in browser"
        echo ""
        echo "📋 Keep this terminal open to copy the values above!"
    fi
    
else
    echo "❌ .env file not found"
    echo "Please make sure you're in the correlateAI directory"
fi

echo ""
echo "🎯 After adding secrets, run:"
echo "   git add ."
echo "   git commit -m 'Add automated data collection workflow'"
echo "   git push origin $(git branch --show-current)"