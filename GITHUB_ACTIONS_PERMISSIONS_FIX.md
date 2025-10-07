# 🔐 GitHub Actions Permissions Configuration Guide

## Current Issue: Permission Denied Errors

The automated data collection workflow is failing with "Permission denied" errors during git push and issue creation operations, despite having correct permissions configured in the workflow file.

## ✅ What's Already Fixed

1. **Workflow Permissions**: Added to `.github/workflows/automated-data-collection.yml`:
   ```yaml
   permissions:
     contents: write
     issues: write
     pull-requests: write
   ```

2. **Enhanced Checkout**: Configured with proper token and credentials:
   ```yaml
   - name: 🔄 Checkout Repository
     uses: actions/checkout@v4
     with:
       token: ${{ secrets.GITHUB_TOKEN }}
       fetch-depth: 1
       persist-credentials: true
   ```

3. **Test Script**: Created `scripts/test-github-permissions.sh` for validation

## 🎯 Required Repository Settings

To fix the permissions issue, you need to configure these GitHub repository settings:

### 1. Actions General Permissions

1. Go to your repository on GitHub.com
2. Navigate to **Settings** > **Actions** > **General**
3. Under "Actions permissions", ensure one of these is selected:
   - ✅ **"Allow all actions and reusable workflows"** (recommended)
   - ✅ **"Allow {organization} and select non-{organization} actions and reusable workflows"**

### 2. Workflow Permissions

In the same **Settings** > **Actions** > **General** page:

1. Scroll down to "Workflow permissions"
2. Select: ✅ **"Read and write permissions"**
3. Check: ✅ **"Allow GitHub Actions to create and approve pull requests"**

### 3. Repository Security (if applicable)

For private repositories or organizations with stricter policies:

1. Go to **Settings** > **Security** > **Code security and analysis**
2. Ensure GitHub Actions is not blocked by organization policies

## 🔧 Alternative Solutions

If the above doesn't work, try these alternatives:

### Option 1: Use Personal Access Token

1. Create a Personal Access Token with repo permissions
2. Add it as a repository secret (e.g., `PAT_TOKEN`)
3. Update the checkout step:
   ```yaml
   - name: 🔄 Checkout Repository
     uses: actions/checkout@v4
     with:
       token: ${{ secrets.PAT_TOKEN }}
   ```

### Option 2: Use GitHub App Token

For organizations, consider using a GitHub App token instead of the default `GITHUB_TOKEN`.

## 🧪 Testing the Fix

After updating repository settings:

1. **Manual Test**: Run the permission test script locally:
   ```bash
   ./scripts/test-github-permissions.sh
   ```

2. **Workflow Test**: Manually trigger the workflow:
   ```bash
   gh workflow run "Automated Data Collection & Correlation Discovery"
   ```
   Or via GitHub web interface: Actions tab > "Automated Data Collection" > "Run workflow"

3. **Monitor Results**: Check the workflow logs for:
   - ✅ Successful data collection
   - ✅ Successful git push
   - ✅ Successful issue creation (if errors occur)

## 📊 Expected Workflow Success

When properly configured, the workflow should:

1. ✅ Collect data from FRED, World Bank, Alpha Vantage, OpenWeather
2. ✅ Generate correlations and insights  
3. ✅ Commit changes with detailed messages
4. ✅ Push to main branch
5. ✅ Create issues only on failures

## 🚨 Troubleshooting

If permissions issues persist:

1. **Check Organization Settings**: Organization admins may need to adjust Action permissions
2. **Verify Branch Protection**: Ensure main branch protection rules allow Action pushes
3. **Token Scope**: Confirm `GITHUB_TOKEN` has sufficient scope for your use case
4. **Workflow Syntax**: Validate YAML syntax with the test script

## 📋 Quick Checklist

- [ ] Repository Actions permissions set to "Allow all actions"
- [ ] Workflow permissions set to "Read and write"  
- [ ] "Allow GitHub Actions to create and approve pull requests" enabled
- [ ] No organization policies blocking Actions
- [ ] Branch protection rules allow Action pushes
- [ ] Workflow file has correct permissions block
- [ ] Test script runs without errors

## 🎉 Success Indicators

You'll know it's working when:
- Workflow completes without permission errors
- New commits appear from `github-actions[bot]`
- Data files are updated automatically
- Issues are created only on actual failures

---

**Next Steps**: Update your repository settings and test the workflow!