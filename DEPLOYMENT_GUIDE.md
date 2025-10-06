# 🚀 CorrelateAI Deployment Guide

## 📋 **Pre-Deployment Setup**

### 1. 🔑 **Configure GitHub Secrets**

Navigate to your GitHub repository settings and add these secrets:

```bash
# Required API Keys
FRED_API_KEY=your_fred_api_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here  
OPENWEATHER_API_KEY=your_openweather_key_here

# Optional webhook for deployment notifications
DEPLOY_WEBHOOK_URL=your_deployment_webhook_url
```

### 2. ⚙️ **Repository Configuration**

Ensure these settings are enabled in your GitHub repository:

- **Actions**: Enabled with read/write permissions
- **Pages**: Configured for deployment (if using GitHub Pages)
- **Webhooks**: Set up for deployment triggers (optional)

### 3. 🧪 **Pre-Flight Testing**

Run the validation scripts locally:

```bash
# Test the workflow configuration
./test-workflow.sh

# Validate dataset availability
node test-datasets.js

# Check security configuration
./scripts/security-audit.sh
```

## 🚀 **Deployment Process**

### Method 1: 🔄 **Merge to Main Branch**

1. **Review the pull request** thoroughly
2. **Merge `feat/enchance_ux` to `main`**
3. **Monitor the GitHub Actions workflow**
4. **Verify data collection starts automatically**

### Method 2: 🎯 **Manual Trigger**

1. Go to **Actions** tab in GitHub
2. Select **"🤖 Automated Data Collection & Correlation Discovery"**
3. Click **"Run workflow"**
4. Select branch and trigger options
5. **Monitor execution logs**

## 📊 **Monitoring & Verification**

### ✅ **Success Indicators**

Check these after deployment:

1. **GitHub Actions**: Green checkmarks on workflow runs
2. **Data Files**: New files appearing in `public/ai-data/`
3. **Correlations**: `generated_correlations.json` being updated
4. **Index**: `datasets_index.json` reflecting new data count
5. **Timestamps**: `last-update.json` showing recent updates

### 🚨 **Troubleshooting Common Issues**

#### **API Rate Limits**
```bash
# Solution: Workflow respects rate limits automatically
# Check logs for rate limiting messages
# Financial data collection skips on manual runs to conserve limits
```

#### **Missing API Keys**
```bash
# Error: "API key not found" or 401 Unauthorized
# Solution: Verify GitHub secrets are correctly set
# Check secret names match exactly (case-sensitive)
```

#### **Network Timeouts**
```bash
# Error: "Request timeout" or "Network error"
# Solution: Workflow includes retry logic
# Check GitHub runner connectivity
```

## 📈 **Expected Results**

### 📊 **Data Collection Timeline**

| Time | Event | Expected Outcome |
|------|-------|------------------|
| **0 min** | Deployment | UI enhancements live |
| **Daily 6AM UTC** | First auto-run | Fresh data collection |
| **+30 min** | Processing | Correlations generated |
| **+45 min** | Commit | Updated data pushed |
| **Ongoing** | Daily updates | Continuous data refresh |

### 🎯 **Performance Metrics**

Expected results after first 24 hours:

- **129+ datasets** available with fresh timestamps
- **50+ correlations** automatically discovered
- **4 data sources** successfully integrated
- **Quality scores** above 0.7 threshold
- **Zero failed workflows** (with proper API keys)

## 🔧 **Maintenance & Operations**

### 📅 **Regular Tasks**

#### **Weekly**
- Review workflow execution logs
- Check data quality metrics
- Monitor API usage and costs
- Validate correlation discoveries

#### **Monthly**
- Update API keys (if needed)
- Review and add new data sources
- Optimize correlation algorithms
- Performance tuning

#### **Quarterly**
- Security audit and dependency updates
- API integration health check
- Data retention policy review
- User feedback incorporation

### 🛠️ **Configuration Updates**

#### **Adding New Data Sources**
1. Update `dataPipelineService.ts` with new source config
2. Add collection logic to GitHub workflow
3. Update UI components for new source badges
4. Test with `test-data-collection.sh`

#### **Modifying Collection Schedule**
```yaml
# In .github/workflows/automated-data-collection.yml
schedule:
  - cron: '0 6 * * *'  # Change time here (UTC)
```

#### **Adjusting Quality Thresholds**
```yaml
# In workflow environment variables
QUALITY_THRESHOLD: 0.7  # Adjust as needed (0-1)
MAX_CORRELATIONS_TO_GENERATE: 100  # Increase for more discoveries
```

## 🔐 **Security Considerations**

### 🛡️ **API Key Management**

- **Never commit API keys** to repository
- **Use GitHub secrets** for all credentials
- **Rotate keys regularly** (quarterly recommended)
- **Monitor API usage** for unusual patterns

### 🔍 **Access Control**

- **Limit workflow permissions** to necessary actions
- **Review contributor access** regularly
- **Monitor repository activity** for unauthorized changes
- **Enable branch protection** for main branch

### 📋 **Audit Trail**

All data collection activities are logged:

- **GitHub Actions logs**: Detailed execution history
- **Commit messages**: Automated change tracking
- **Error reports**: Automatic issue creation for failures
- **Quality metrics**: Data validation results

## 📞 **Support & Escalation**

### 🆘 **Getting Help**

1. **Check workflow logs** first for error details
2. **Review documentation** in `/docs` folder
3. **Run local tests** to isolate issues
4. **Contact development team** with specific error messages

### 🐛 **Reporting Issues**

When reporting problems, include:

- **Workflow run ID** and timestamp
- **Error messages** and stack traces
- **Expected vs actual behavior**
- **Environment details** (Node.js version, etc.)

---

## ✅ **Deployment Checklist**

Before marking deployment complete, verify:

- [ ] All GitHub secrets configured correctly
- [ ] First workflow run completed successfully
- [ ] Data files updated with recent timestamps
- [ ] UI enhancements visible and functional
- [ ] No errors in browser console
- [ ] Mobile responsiveness working
- [ ] All 129 datasets accessible
- [ ] Correlation discovery functioning
- [ ] Documentation updated and accessible

---

## 🎉 **You're Ready!**

With this comprehensive infrastructure in place, CorrelateAI now automatically discovers fascinating correlations between economic indicators, financial markets, and global weather patterns. The system is designed to run autonomously while providing rich insights for data exploration.

**Welcome to the future of automated data intelligence!** 🚀

---

*Last updated: October 6, 2025*