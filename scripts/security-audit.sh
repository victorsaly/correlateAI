#!/bin/bash

# 🔒 CorrelateAI Pro Security Audit Script
# This script helps verify that your repository is properly configured for secure deployment

echo "🔒 CorrelateAI Pro - Security Audit"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Success/Failure counters
CHECKS_PASSED=0
CHECKS_FAILED=0
TOTAL_CHECKS=0

# Function to print status
print_status() {
    local message="$1"
    local status="$2"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    
    if [ "$status" = "PASS" ]; then
        echo -e "[${GREEN}✅ PASS${NC}] $message"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    elif [ "$status" = "FAIL" ]; then
        echo -e "[${RED}❌ FAIL${NC}] $message"
        CHECKS_FAILED=$((CHECKS_FAILED + 1))
    elif [ "$status" = "WARN" ]; then
        echo -e "[${YELLOW}⚠️  WARN${NC}] $message"
    else
        echo -e "[${YELLOW}ℹ️  INFO${NC}] $message"
    fi
}

print_section() {
    echo ""
    echo -e "${YELLOW}$1${NC}"
    echo "$(printf '=%.0s' {1..50})"
}

# Check 1: .gitignore configuration
print_section "Git Configuration Checks"

if [ -f ".gitignore" ]; then
    if grep -q "^\.env$" .gitignore; then
        print_status ".env file is properly gitignored" "PASS"
    else
        print_status ".env file is NOT gitignored - SECURITY RISK!" "FAIL"
    fi
    
    if grep -q "^node_modules" .gitignore; then
        print_status "node_modules is gitignored" "PASS"
    else
        print_status "node_modules should be gitignored" "WARN"
    fi
else
    print_status ".gitignore file not found" "FAIL"
fi

# Check 2: Environment file configuration
print_section "Environment Configuration Checks"

if [ -f ".env.example" ]; then
    print_status ".env.example template exists" "PASS"
    
    if grep -q "VITE_FRED_API_KEY=" .env.example; then
        print_status ".env.example contains FRED API key template" "PASS"
    else
        print_status ".env.example missing FRED API key template" "FAIL"
    fi
else
    print_status ".env.example template not found" "FAIL"
fi

if [ -f ".env" ]; then
    print_status ".env file exists for local development" "PASS"
    
    # Check if .env contains a real API key (not the template)
    if grep -q "your_fred_api_key_here" .env; then
        print_status ".env still contains template values - needs real API key" "WARN"
    elif grep -q "VITE_FRED_API_KEY=.*[a-f0-9]" .env; then
        print_status ".env contains configured API key" "PASS"
    fi
else
    print_status ".env file not found - copy from .env.example for local development" "WARN"
fi

# Check 3: Source code security
print_section "Source Code Security Checks"

# Check for hardcoded API keys (but exclude error messages and comments)
if grep -r "VITE_FRED_API_KEY\s*=" src/ 2>/dev/null | grep -v "import.meta.env" | grep -q .; then
    print_status "Hardcoded API keys found in source code - SECURITY RISK!" "FAIL"
elif grep -r "['\"].*[a-f0-9]{32}['\"]" src/ 2>/dev/null | grep -q .; then
    print_status "Potential hardcoded API keys found (32-char hex strings) - SECURITY RISK!" "FAIL"
else
    print_status "No hardcoded API keys found in source code" "PASS"
fi

# Check for proper environment variable usage
if grep -r "import.meta.env.VITE_FRED_API_KEY" src/ >/dev/null 2>&1; then
    print_status "Proper environment variable usage found" "PASS"
else
    print_status "Environment variable usage not found - may not be using API" "WARN"
fi

# Check 4: GitHub Actions configuration
print_section "GitHub Actions Configuration Checks"

if [ -f ".github/workflows/deploy.yml" ]; then
    print_status "GitHub Actions workflow file exists" "PASS"
    
    if grep -q "VITE_FRED_API_KEY: \${{ secrets.VITE_FRED_API_KEY }}" .github/workflows/deploy.yml; then
        print_status "GitHub Actions uses secrets for API key" "PASS"
    else
        print_status "GitHub Actions not configured for API key secrets" "FAIL"
    fi
    
    if grep -q "npm run build" .github/workflows/deploy.yml; then
        print_status "Build step configured in workflow" "PASS"
    else
        print_status "Build step missing in workflow" "FAIL"
    fi
else
    print_status "GitHub Actions workflow not found" "FAIL"
fi

# Check 5: Git history security
print_section "Git History Security Checks"

# Check if any API keys were ever committed
if git log --all --grep="api.*key" -i --oneline 2>/dev/null | grep -q .; then
    print_status "Potential API key references found in commit messages" "WARN"
else
    print_status "No API key references in commit messages" "PASS"
fi

# Check for any secrets in git history
if git log --all -S "VITE_FRED_API_KEY=" --oneline 2>/dev/null | grep -q .; then
    print_status "Environment variable found in git history (check if values are safe)" "WARN"
else
    print_status "No environment variables found in git history" "PASS"
fi

# Check 6: Deployment configuration
print_section "Deployment Configuration Checks"

if [ -f "public/CNAME" ]; then
    DOMAIN=$(cat public/CNAME)
    print_status "Custom domain configured: $DOMAIN" "PASS"
else
    print_status "No custom domain configured (using GitHub Pages default)" "INFO"
fi

if [ -f "vite.config.ts" ]; then
    if grep -q "base:" vite.config.ts; then
        print_status "Vite base configuration found" "PASS"
    else
        print_status "Vite base configuration may need adjustment" "WARN"
    fi
else
    print_status "Vite configuration not found" "WARN"
fi

# Summary
print_section "Security Audit Summary"

echo ""
echo -e "Total Checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}Failed: $CHECKS_FAILED${NC}"
echo -e "${YELLOW}Warnings: $((TOTAL_CHECKS - CHECKS_PASSED - CHECKS_FAILED))${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Security audit completed successfully!${NC}"
    echo -e "${GREEN}Your repository is properly configured for secure deployment.${NC}"
    exit 0
else
    echo -e "${RED}🚨 Security issues found that need attention.${NC}"
    echo -e "${RED}Please review the failed checks above and fix them before deploying.${NC}"
    exit 1
fi