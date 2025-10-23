# Workflow Fix: Preventing Deployment Conflicts

## Problem Summary

The automated data collection workflow was causing deployment conflicts and unnecessary builds:

### Issues Identified:

1. **No Branch Restriction**: The data collection workflow could run on any branch
2. **Triggering Unnecessary Deployments**: Every data update pushed to main triggered a full deployment rebuild
3. **No Branch Verification**: The workflow didn't verify it was running on the correct branch before pushing
4. **Deployment on Data-Only Changes**: The deploy workflow rebuilt the entire site even when only data files changed

## Root Cause

```
Automated Data Collection Workflow (weekly cron)
    ↓
Commits data updates to current branch
    ↓
Pushes to main branch
    ↓
Triggers Deploy Workflow (on every push to main)
    ↓
Full site rebuild and deployment
    ↓
CONFLICT: If workflow runs on wrong branch or during active development
```

## Solutions Implemented

### 1. **Branch Restrictions on Data Collection** (`automated-data-collection.yml`)

```yaml
on:
  schedule:
    - cron: '0 6 * * 1'  # Still runs weekly
  workflow_dispatch:
    # ... inputs ...
  push:
    branches:
      - main
    paths:
      - '.github/workflows/automated-data-collection.yml'
```

**Why**: Ensures the workflow only runs on main branch and when the workflow file itself changes.

### 2. **Branch Verification Step**

```yaml
- name: ✅ Verify Branch
  run: |
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "main" ]; then
      echo "❌ Error: This workflow must run on main branch"
      exit 1
    fi
    echo "✅ Confirmed running on main branch"
```

**Why**: Adds a safety check to fail fast if the workflow somehow runs on the wrong branch.

### 3. **Skip CI in Commit Messages**

```yaml
git commit -m "🤖 Automated data update - $TIMESTAMP [skip ci]
```

**Why**: The `[skip ci]` tag tells GitHub Actions to skip running workflows on this commit, preventing recursive workflow triggers.

### 4. **Explicit Branch Push**

```yaml
git push origin main
```

**Why**: Explicitly pushes to the main branch instead of using `git push` which pushes to the current branch.

### 5. **Path Ignore in Deploy Workflow** (`deploy.yml`)

```yaml
on:
  push:
    branches: ["main"]
    paths-ignore:
      - 'public/ai-data/**'
      - 'data-summary.md'
      - '**.md'
      - 'docs/**'
  workflow_dispatch:
```

**Why**: The deployment workflow now ignores changes to:
- Data files in `public/ai-data/`
- Documentation files (`.md`)
- The `data-summary.md` file
- Documentation folder

This prevents unnecessary deployments when only data updates occur.

## Benefits

✅ **Prevents Deployment Conflicts**: Data updates no longer trigger full site rebuilds  
✅ **Saves Build Minutes**: Automated data updates don't consume GitHub Actions minutes for deployments  
✅ **Clearer Separation**: Data collection and deployment are now independent processes  
✅ **Safer Operations**: Branch verification prevents accidental pushes to wrong branches  
✅ **Faster Data Updates**: Data can be updated without waiting for a full deployment cycle  

## Workflow Behavior Now

### Data Collection (Weekly or Manual)
```
Monday 6 AM UTC (or manual trigger)
    ↓
Verify running on main branch
    ↓
Collect data from 13+ sources
    ↓
Commit with [skip ci] tag
    ↓
Push to main branch
    ↓
✅ Data updated, NO deployment triggered
```

### Deployment (Code Changes Only)
```
Push code changes to main
    ↓
Check if code files changed (not just data)
    ↓
If YES: Trigger deployment
If NO: Skip deployment
    ↓
✅ Only deploys when necessary
```

## Testing the Fix

### Test Data Collection Without Deployment:
```bash
# Manually trigger data collection
gh workflow run automated-data-collection.yml

# Verify no deployment was triggered
gh run list --workflow=deploy.yml --limit 5
```

### Test Deployment Still Works:
```bash
# Make a code change
git commit -m "Update component"
git push origin main

# Verify deployment is triggered
gh run list --workflow=deploy.yml --limit 1
```

## Monitoring

Check workflow status:
```bash
# Check recent data collection runs
gh run list --workflow=automated-data-collection.yml --limit 5

# Check recent deployments
gh run list --workflow=deploy.yml --limit 5

# View specific run logs
gh run view <run-id> --log
```

## Future Improvements

Consider implementing:

1. **Separate Data Branch**: Use a `data` branch for updates, then PR to main
2. **Conditional Deployment**: Only deploy if data changes AND it's a specific day/time
3. **Manual Approval**: Require manual approval for deployments after data updates
4. **Staging Environment**: Test data updates in staging before production

## Related Files

- `.github/workflows/automated-data-collection.yml` - Data collection workflow
- `.github/workflows/deploy.yml` - Deployment workflow
- `public/ai-data/` - Data storage directory
- `scripts/collect-*.js` - Data collection scripts

## Commit Reference

This fix prevents the issue where automated data updates were triggering full site rebuilds, causing deployment conflicts and consuming unnecessary build minutes.

**Date**: October 23, 2025  
**Branch**: feat/financial_approach → main  
**Status**: ✅ Fixed
