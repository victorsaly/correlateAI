#!/bin/bash

# CorrelateAI Pro - Article Publishing Helper
# Usage: ./publish-articles.sh

echo "� CorrelateAI Pro - Article Publishing Helper"
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Not in a git repository. Please run from project root.${NC}"
    exit 1
fi

echo -e "${BLUE}📁 Current directory: $(pwd)${NC}"
echo ""

# Check article files
echo -e "${YELLOW}� Article Files Status:${NC}"

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 (missing)${NC}"
        return 1
    fi
}

check_file "docs/devto/correlateai-pro-advanced-data-visualization.md"
check_file "docs/linkedin/correlateai-pro-professional-summary.md"  
check_file "docs/twitter/correlateai-pro-engaging-thread.md"

echo ""
echo -e "${BLUE}� Your article content:${NC}"
echo -e "${BLUE}• Dev.to:${NC} docs/devto/correlateai-pro-advanced-data-visualization.md"
echo -e "${BLUE}• LinkedIn:${NC} docs/linkedin/correlateai-pro-professional-summary.md"
echo -e "${BLUE}• Twitter:${NC} docs/twitter/correlateai-pro-engaging-thread.md"
echo ""

# Show publishing guidance
echo -e "${GREEN}🎯 Publishing Steps:${NC}"
echo ""
echo -e "${GREEN}1. Dev.to Publishing:${NC}"
echo "   • Copy content from docs/devto/ article"
echo "   • Upload your screenshots manually"
echo "   • Add tags: react, typescript, dataviz, ai, frontend"  
echo "   • Set cover image"
echo "   • Publish article"
echo ""

echo -e "${GREEN}2. LinkedIn Publishing:${NC}"
echo "   • Copy content from docs/linkedin/ post"
echo "   • Upload professional screenshots"
echo "   • Add 3-5 relevant hashtags"
echo "   • Post during peak hours (9-11 AM, 1-3 PM EST)"
echo "   • Engage with comments promptly"
echo ""

echo -e "${GREEN}3. Twitter Publishing:${NC}"
echo "   • Copy thread from docs/twitter/"
echo "   • Create visual content (screenshots/GIFs)"
echo "   • Schedule thread with 2-3 minute intervals"
echo "   • Add hashtags: #React #TypeScript #DataViz #AI"
echo "   • Pin first tweet for 24-48 hours"
echo ""

# Check if app is running
echo -e "${YELLOW}🔗 Testing application...${NC}"
if curl --output /dev/null --silent --head --fail "http://localhost:5173" 2>/dev/null; then
    echo -e "${GREEN}✅ Development server running at http://localhost:5173${NC}"
elif curl --output /dev/null --silent --head --fail "https://correlationai.victorsaly.com" 2>/dev/null; then
    echo -e "${GREEN}✅ Live app accessible at https://correlationai.victorsaly.com${NC}"
else
    echo -e "${YELLOW}⚠️  App not accessible. For screenshots, run: npm run dev${NC}"
fi

echo ""
echo -e "${GREEN}🔗 Quick Links:${NC}"
echo -e "${GREEN}   • 🌐 Live Demo:${NC} https://correlationai.victorsaly.com"
echo -e "${GREEN}   • 💻 GitHub Repo:${NC} https://github.com/victorsaly/correlateAI"
echo ""

echo -e "${GREEN}✨ Ready to share your 8-hour AI development revolution story!${NC}"