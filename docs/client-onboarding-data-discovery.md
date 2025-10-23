# Client Data Discovery & Onboarding Guide

## 📋 Client Profile
- **Annual Turnover**: $135M
- **Employees**: 240
- **Data History**: 12 years
- **System**: ERP (Enterprise Resource Planning)
- **Data Scope**: End-to-end business operations

---

## 🎯 Discovery Objectives

### **Primary Goals:**
1. Identify revenue drivers and predictors
2. Discover operational inefficiencies
3. Find customer behavior patterns
4. Predict cash flow and revenue trends
5. Optimize resource allocation

---

## 📊 Phase 1: Initial Data Inventory (Week 1)

### **Step 1: System Access & Security**

#### **Before Any Data Access:**
- [ ] **Signed NDA** (Non-Disclosure Agreement)
- [ ] **Data Processing Agreement** (GDPR/privacy compliance)
- [ ] **Access Authorization** from client IT Director/CTO
- [ ] **Scope of Work** document signed

#### **Technical Requirements:**
```
Database Information Needed:
- Database Type: [ ] SQL Server [ ] Oracle [ ] PostgreSQL [ ] MySQL [ ] Other: _____
- Version: _________________
- Server Location: [ ] On-Premise [ ] Cloud (AWS/Azure/GCP)
- Access Method: [ ] Direct DB [ ] API [ ] Data Export [ ] VPN
- Authentication: [ ] SQL Auth [ ] Windows Auth [ ] SSO [ ] API Key
```

#### **Security Checklist:**
- [ ] Read-only access granted (no write permissions)
- [ ] VPN or secure tunnel setup
- [ ] IP whitelisting configured
- [ ] Audit logging enabled
- [ ] Data will be anonymized/pseudonymized where needed
- [ ] Data retention policy agreed (how long we keep data)
- [ ] Data destruction process defined

---

### **Step 2: Database Schema Discovery**

#### **Request from Client IT:**
```sql
-- Get all table names and row counts
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    DATA_LENGTH,
    INDEX_LENGTH
FROM 
    INFORMATION_SCHEMA.TABLES
WHERE 
    TABLE_SCHEMA = 'your_database_name'
ORDER BY 
    TABLE_ROWS DESC;
```

#### **Key Information to Collect:**
1. **Entity Relationship Diagram (ERD)** - How tables connect
2. **Data Dictionary** - What each field means
3. **Primary/Foreign Keys** - Relationships between entities
4. **Date Fields** - Which columns contain timestamps
5. **Data Quality Issues** - Known issues, null values, duplicates

---

## 📈 Phase 2: Data Mapping - What to Extract

### **A. Sales & Revenue Data** 🎯 **HIGH PRIORITY**

#### **1. Quotes/Proposals Table**
```
Fields to Extract:
- quote_id (unique identifier)
- quote_date (when quote was created)
- customer_id (link to customer)
- salesperson_id (who created quote)
- product_id or service_id (what was quoted)
- quote_amount (total value)
- quote_status (pending, won, lost, expired)
- close_date (when deal closed or lost)
- lead_source (how did they hear about you?)
- industry_sector (customer industry)
- region/location (geographic data)
- quote_version (if quotes get revised)
```

**Analysis Potential:**
- Win rate by salesperson, product, season, region
- Quote-to-close time patterns
- Price sensitivity analysis
- Lead source ROI

---

#### **2. Invoices/Orders Table**
```
Fields to Extract:
- invoice_id
- invoice_date
- customer_id
- order_date
- delivery_date (if different from invoice)
- invoice_amount
- payment_terms (net 30, net 60, etc.)
- payment_received_date (cash flow timing)
- product_line or category
- quantity
- unit_price
- discount_applied
- salesperson_id
- region/territory
- payment_method (credit card, wire, check)
```

**Analysis Potential:**
- Revenue trends by product/season/region
- Payment behavior patterns
- Discount effectiveness
- Cash conversion cycle

---

#### **3. Revenue Recognition/Financial Summary**
```
Fields to Extract:
- period (year-month)
- total_revenue
- cost_of_goods_sold (COGS)
- gross_profit
- operating_expenses
- net_profit
- accounts_receivable (AR)
- accounts_payable (AP)
- cash_position
```

**Analysis Potential:**
- Profitability trends
- Working capital patterns
- Seasonal revenue cycles

---

### **B. Customer Data** 🎯 **HIGH PRIORITY**

#### **4. Customers Table**
```
Fields to Extract:
- customer_id
- company_name (anonymize if needed: Customer_001, Customer_002)
- customer_since_date (acquisition date)
- industry_sector
- company_size (employees or revenue band)
- region/state/country
- customer_tier (A/B/C or SMB/Mid-Market/Enterprise)
- account_manager_id
- credit_limit
- payment_rating (credit score if available)
- is_active (current vs churned)
- churn_date (if they stopped buying)
```

**Analysis Potential:**
- Customer lifetime value (CLV)
- Churn prediction
- Acquisition cost vs value
- Best customer profiles

---

#### **5. Customer Contacts/Interactions**
```
Fields to Extract:
- contact_id
- customer_id
- contact_date
- contact_type (email, call, meeting, support)
- contact_reason (sales, support, complaint, inquiry)
- outcome (resolved, escalated, follow-up needed)
- salesperson_id or support_agent_id
- response_time (how fast was contact handled)
```

**Analysis Potential:**
- Contact frequency vs retention
- Support load patterns
- Sales touch patterns for wins vs losses

---

### **C. Product/Service Data** 🎯 **MEDIUM PRIORITY**

#### **6. Products/Services Table**
```
Fields to Extract:
- product_id
- product_name or SKU
- product_category
- product_line
- unit_cost
- unit_price
- margin_percentage
- launch_date
- discontinued_date (if applicable)
- supplier_id
```

**Analysis Potential:**
- Product profitability
- Product lifecycle trends
- Cross-sell/upsell patterns

---

#### **7. Product Sales History**
```
Fields to Extract:
- sale_date
- product_id
- quantity_sold
- revenue
- customer_id
- region
- season/quarter
```

**Analysis Potential:**
- Product demand patterns
- Seasonal trends by product
- Product affinity (which products sell together)

---

### **D. Supplier & Operations Data** 🎯 **MEDIUM PRIORITY**

#### **8. Suppliers Table**
```
Fields to Extract:
- supplier_id
- supplier_name (anonymize: Supplier_001)
- supplier_since_date
- product_categories_supplied
- region/country
- payment_terms
- lead_time_days (ordering to delivery)
- quality_rating (if tracked)
```

**Analysis Potential:**
- Supplier reliability
- Lead time patterns
- Cost fluctuations

---

#### **9. Purchase Orders Table**
```
Fields to Extract:
- po_id
- po_date
- supplier_id
- product_id
- quantity_ordered
- unit_cost
- total_cost
- expected_delivery_date
- actual_delivery_date
- order_status (pending, delivered, late, cancelled)
```

**Analysis Potential:**
- Supply chain delays
- Cost inflation trends
- Order timing optimization

---

### **E. Employee/Resource Data** 🎯 **LOW PRIORITY (Sensitive)**

#### **10. Employees/Sales Team (Anonymized)**
```
Fields to Extract (ANONYMIZED):
- employee_id (e.g., EMP_001, not real names)
- hire_date
- department (sales, support, operations, etc.)
- role/title
- region/territory
- is_active
- termination_date (if applicable)
```

**Analysis Potential:**
- Hiring patterns vs revenue growth
- Territory coverage effectiveness
- Turnover impact on performance

---

## 🎯 Phase 3: Prioritized Data Extraction Plan

### **Week 1: Quick Wins (80/20 Rule)**

Extract these tables FIRST for immediate insights:

#### **Priority 1: Revenue & Sales**
```
1. Invoices (last 3 years) - 36 months of data
2. Customers - all active + churned
3. Products - active catalog

Estimated rows: ~50K-100K records
File format: CSV or Parquet
Estimated size: 50-100 MB
```

**Immediate Analyses:**
- Revenue trends by month
- Top 20% customers (80/20 rule)
- Product performance
- Seasonal patterns
- Growth rate trajectory

---

#### **Priority 2: Customer Behavior**
```
4. Quotes (last 3 years) - win/loss analysis
5. Customer contacts (last 2 years) - interaction patterns

Estimated rows: ~30K-80K records
File format: CSV
Estimated size: 30-80 MB
```

**Immediate Analyses:**
- Win rate trends
- Sales cycle length
- Lead conversion patterns
- Customer engagement correlation

---

#### **Priority 3: Operations (If time permits Week 1)**
```
6. Purchase Orders (last 2 years)
7. Suppliers

Estimated rows: ~20K-50K records
```

**Immediate Analyses:**
- Supply chain patterns
- Cost fluctuation trends
- Delivery reliability

---

### **Week 2-3: Deep Dive (Full 12 Years)**

Once quick wins are proven, extract full historical data:
- All tables with 12-year history
- More granular detail
- Additional context fields

---

## 📋 Data Extraction Request Template

### **Email to Client IT Team:**

```
Subject: Data Extraction Request - CorrelateAI Analysis

Hi [IT Contact Name],

To begin the correlation analysis for [Company Name], we need to extract 
the following datasets from your ERP system. 

SECURITY NOTES:
- Read-only access required
- Data will be pseudonymized (customer names replaced with IDs)
- All data encrypted in transit and at rest
- Data retained for 90 days post-project, then securely deleted

EXTRACTION REQUEST:

Phase 1 (Week 1) - Priority Tables:
1. Invoices table (2022-2024)
   Fields: invoice_id, invoice_date, customer_id, invoice_amount, 
           product_category, region, payment_date
   Format: CSV
   Estimated rows: ~50,000

2. Customers table (all)
   Fields: customer_id, customer_since_date, industry_sector, 
           company_size, region, is_active, churn_date
   Format: CSV
   Estimated rows: ~5,000

3. Products table (all active)
   Fields: product_id, product_name, category, unit_cost, 
           unit_price, margin_percentage
   Format: CSV
   Estimated rows: ~500

[See attached detailed field list]

PREFERRED EXTRACTION METHOD:
[ ] Direct SQL export from database
[ ] Data warehouse/BI tool export
[ ] API endpoint access
[ ] Scheduled automated export

DELIVERY:
[ ] SFTP to our secure server
[ ] Secure cloud storage (AWS S3, Azure Blob)
[ ] Encrypted email (files < 25MB)

TARGET DELIVERY: [Date - 5 business days from now]

Questions? Let's schedule a 30-min call to discuss:
[Calendar link]

Best regards,
[Your name]
```

---

## 🔍 Phase 4: Data Quality Assessment

### **Upon Receiving Data:**

#### **1. Data Profiling Checklist:**
```python
# Run these checks on each table:
- [ ] Row count matches expected
- [ ] Date range covers expected period
- [ ] No missing critical IDs (customer_id, product_id)
- [ ] Date formats consistent
- [ ] Currency values positive (where expected)
- [ ] Foreign key integrity (customers exist in invoices)
- [ ] Duplicate detection
- [ ] Null value percentage < 10% on key fields
```

#### **2. Sample Analysis Queries:**
```sql
-- Revenue by month
SELECT 
    DATE_TRUNC('month', invoice_date) AS month,
    SUM(invoice_amount) AS revenue,
    COUNT(*) AS invoice_count,
    COUNT(DISTINCT customer_id) AS unique_customers
FROM invoices
GROUP BY month
ORDER BY month;

-- Top customers
SELECT 
    customer_id,
    COUNT(*) AS order_count,
    SUM(invoice_amount) AS total_revenue,
    AVG(invoice_amount) AS avg_order_value
FROM invoices
GROUP BY customer_id
ORDER BY total_revenue DESC
LIMIT 20;

-- Seasonal patterns
SELECT 
    EXTRACT(MONTH FROM invoice_date) AS month,
    EXTRACT(YEAR FROM invoice_date) AS year,
    SUM(invoice_amount) AS revenue
FROM invoices
GROUP BY year, month
ORDER BY year, month;
```

---

## 🎯 Phase 5: Initial Correlations to Analyze

### **Week 1 Analysis - Quick Wins:**

#### **Revenue Correlations:**
1. **Monthly Revenue vs Employee Count**
   - "Does revenue scale with team size?"
   - Finding: Identify if hiring drives growth or lags behind

2. **Revenue vs Customer Acquisition Rate**
   - "Do new customers correlate with revenue spikes?"
   - Finding: Understand if growth is new customers or upsells

3. **Invoice Amount vs Payment Speed**
   - "Do larger invoices get paid faster or slower?"
   - Finding: Optimize payment terms

4. **Win Rate vs Salesperson Tenure**
   - "Do experienced salespeople close more deals?"
   - Finding: Training effectiveness

5. **Revenue vs Product Mix**
   - "Which product combinations drive highest revenue?"
   - Finding: Cross-sell opportunities

---

#### **Customer Behavior Correlations:**
1. **Customer Contacts vs Retention**
   - "Does more touchpoints = less churn?"
   - Finding: Optimal contact frequency

2. **Quote Response Time vs Win Rate**
   - "Do faster quotes win more?"
   - Finding: Speed-to-lead impact

3. **Discount % vs Close Rate**
   - "Does bigger discount = more wins?"
   - Finding: Pricing strategy optimization

4. **Customer Size vs Lifetime Value**
   - "Are big customers always better?"
   - Finding: Ideal customer profile

---

#### **Operational Correlations:**
1. **Supplier Lead Time vs Revenue**
   - "Do supply delays hurt sales?"
   - Finding: Inventory optimization

2. **Product Launch Date vs Sales Growth**
   - "How long until new products take off?"
   - Finding: Product lifecycle insights

3. **Region vs Profitability**
   - "Which regions are most profitable?"
   - Finding: Territory optimization

---

## 📊 Expected Output - First Client Report

### **Deliverable (End of Week 2):**

**"Executive Correlation Report"**

```
Section 1: Revenue Insights (5-7 key correlations)
- Finding 1: Revenue increases 12% when [X] happens
- Finding 2: Top 15% customers drive 68% of revenue
- Finding 3: Seasonal pattern: Q4 is 34% higher than Q2
- ROI Impact: $4.2M opportunity identified

Section 2: Customer Insights (3-5 key correlations)  
- Finding 1: Customers who receive quote in <2 hours are 43% more likely to buy
- Finding 2: Churn drops 31% when contact frequency > 8x/year
- ROI Impact: $1.8M retention opportunity

Section 3: Operational Insights (2-4 key correlations)
- Finding 1: Supplier delays correlate 0.78 with lost sales
- Finding 2: Product X sells 2.3x better when bundled with Product Y
- ROI Impact: $2.1M efficiency gain

Section 4: Spurious Warnings (2-3 false patterns detected)
- Warning 1: "Revenue spike in March" is NOT caused by [X] - it's seasonal
- Warning 2: "Salesperson A outperforms B" - sample size too small, not statistically significant

TOTAL IDENTIFIED OPPORTUNITY: $8.1M (6% of annual revenue)
CorrelateAI Investment: $12K/year
ROI: 675% (6.75x return)
```

---

## 🔒 Security & Compliance Checklist

### **Before Starting:**
- [ ] NDA signed by both parties
- [ ] Data Processing Agreement (DPA) signed
- [ ] GDPR compliance confirmed (if EU customers)
- [ ] Client data classification reviewed (PII, financial, etc.)
- [ ] Data anonymization plan approved
- [ ] Secure transfer method agreed
- [ ] Data retention policy documented
- [ ] Data destruction process agreed

### **During Analysis:**
- [ ] Data stored on encrypted drives
- [ ] Access limited to authorized personnel only
- [ ] No data transferred to personal devices
- [ ] Audit log maintained of all data access
- [ ] Client approves any screenshots/reports before sharing

### **After Project:**
- [ ] All data securely deleted (certificate provided)
- [ ] Client confirmation of deletion received
- [ ] Final report delivered (anonymized)
- [ ] Lessons learned documented (without client details)

---

## 💰 Pricing for This Client

### **Project Proposal:**

```
Client Profile:
- Turnover: $135M
- Employees: 240
- Complexity: High (12 years, full ERP)

Pricing Tier: ENTERPRISE

Option 1: PROJECT-BASED
- One-time analysis: $35,000
- Includes:
  * Full data extraction & cleaning
  * 50+ correlation analyses
  * Executive report
  * 2-hour presentation to leadership
  * 30-day support
  
Timeline: 4 weeks

Option 2: SUBSCRIPTION (Recommended)
- Annual: $36,000 ($3,000/month)
- Includes:
  * Everything in Option 1
  * Quarterly correlation updates
  * Real-time dashboard access
  * Unlimited correlation queries
  * Ongoing optimization recommendations
  * Priority support

ROI Justification:
- Expected identified opportunities: $8M+ (6% of revenue)
- Investment: $36K
- ROI: 22,000% (220x return)
- Payback: First identified opportunity pays for entire year
```

---

## 📞 Next Steps - Action Items

### **For You (This Week):**
1. [ ] Send NDA to client for signature
2. [ ] Send data extraction request email (use template above)
3. [ ] Schedule 30-min call with client IT team
4. [ ] Set up secure SFTP or cloud storage for data transfer
5. [ ] Prepare data anonymization scripts
6. [ ] Review ERP documentation (if available)

### **For Client (This Week):**
1. [ ] Sign NDA and DPA
2. [ ] Identify IT contact person
3. [ ] Confirm database type and access method
4. [ ] Approve security/privacy plan
5. [ ] Schedule data extraction (target: 5 business days)

### **For Both (Next Week):**
1. [ ] Kick-off call (60 min)
   - Review objectives
   - Confirm data scope
   - Set expectations
   - Answer questions
2. [ ] Data transfer test (small sample)
3. [ ] Begin analysis on sample data

---

## 🎯 Success Metrics

### **Week 1:**
- [ ] Data received and validated
- [ ] 5+ quick-win correlations identified
- [ ] Client "aha moment" achieved

### **Week 2:**
- [ ] 20+ correlations analyzed
- [ ] Draft report prepared
- [ ] Client review session scheduled

### **Week 3:**
- [ ] Final report delivered
- [ ] Executive presentation completed
- [ ] ROI opportunities quantified

### **Week 4:**
- [ ] Client implements first recommendation
- [ ] Testimonial requested
- [ ] Case study drafted (anonymized)
- [ ] Referrals requested

---

## 📧 Quick Reference - Questions to Ask Client

**On Initial Call:**
1. "What are your top 3 business questions you want answered?"
2. "What decisions are currently made by 'gut feel' that you'd like data for?"
3. "What's your biggest pain point: revenue, costs, or operations?"
4. "Who will be our main contact for data access?"
5. "What format do you prefer reports: dashboard, PDF, or presentation?"
6. "Any known data quality issues we should be aware of?"
7. "Timeline: when do you need insights by?"
8. "Budget: what's the expected ROI to justify this investment?"

---

**This is your complete roadmap for onboarding your first $135M client!** 🚀

Next: Send me their response to the data extraction request, and I'll help you build the specific SQL queries and analysis scripts.
