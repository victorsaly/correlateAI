# Technical Implementation: ERP Database Integration

## 🎯 Client: $135M Company with 12 Years of ERP Data

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT'S ERP SYSTEM                     │
│  (SQL Server / Oracle / PostgreSQL / MySQL / SAP / etc.)   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ ① Secure Connection (VPN/API/SFTP)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              DATA EXTRACTION LAYER (Read-Only)              │
│  - Connection validation                                    │
│  - Query execution                                          │
│  - Data sampling & profiling                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ ② ETL Process
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   DATA STAGING AREA                         │
│  - CSV/Parquet files                                        │
│  - Data cleaning & validation                               │
│  - Anonymization layer                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ ③ Import to CorrelateAI
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  CORRELATEAI ANALYSIS ENGINE                │
│  - Load datasets                                            │
│  - Calculate correlations                                   │
│  - Detect spurious patterns                                 │
│  - Generate insights                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ ④ Results
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              DASHBOARD / REPORTS / API                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Implementation Steps

### **Step 1: Database Connection Setup**

#### **Option A: Direct Database Connection (Fastest)**

**For SQL Server:**
```python
# File: scripts/client_db_connector.py

import pyodbc
import pandas as pd
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

class ClientDatabaseConnector:
    def __init__(self):
        self.server = os.getenv('CLIENT_DB_SERVER')
        self.database = os.getenv('CLIENT_DB_NAME')
        self.username = os.getenv('CLIENT_DB_USER')
        self.password = os.getenv('CLIENT_DB_PASSWORD')
        self.connection = None
        
    def connect(self):
        """Establish secure read-only connection"""
        try:
            conn_str = (
                f'DRIVER={{ODBC Driver 17 for SQL Server}};'
                f'SERVER={self.server};'
                f'DATABASE={self.database};'
                f'UID={self.username};'
                f'PWD={self.password};'
                f'ApplicationIntent=ReadOnly;'  # Read-only mode
            )
            self.connection = pyodbc.connect(conn_str)
            print("✅ Connected to client database (read-only)")
            return True
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            return False
    
    def test_connection(self):
        """Test connection and get basic info"""
        if not self.connection:
            self.connect()
        
        query = """
        SELECT 
            COUNT(*) as table_count
        FROM 
            INFORMATION_SCHEMA.TABLES
        WHERE 
            TABLE_TYPE = 'BASE TABLE'
        """
        df = pd.read_sql(query, self.connection)
        print(f"📊 Database has {df['table_count'][0]} tables")
        return df
    
    def get_table_list(self):
        """Get all tables with row counts"""
        query = """
        SELECT 
            t.TABLE_NAME,
            p.rows AS row_count
        FROM 
            INFORMATION_SCHEMA.TABLES t
        LEFT JOIN 
            sys.partitions p ON OBJECT_ID(t.TABLE_NAME) = p.object_id
        WHERE 
            t.TABLE_TYPE = 'BASE TABLE'
            AND p.index_id IN (0,1)
        ORDER BY 
            p.rows DESC
        """
        df = pd.read_sql(query, self.connection)
        print(f"📋 Found {len(df)} tables")
        return df
    
    def extract_table(self, table_name, date_column=None, 
                     start_date=None, limit=None):
        """Extract data from specific table"""
        query = f"SELECT * FROM {table_name}"
        
        # Add date filter if specified
        if date_column and start_date:
            query += f" WHERE {date_column} >= '{start_date}'"
        
        # Add limit for testing
        if limit:
            query += f" LIMIT {limit}"
        
        print(f"📥 Extracting from {table_name}...")
        df = pd.read_sql(query, self.connection)
        print(f"✅ Extracted {len(df)} rows, {len(df.columns)} columns")
        return df
    
    def extract_invoices(self, start_year=2022):
        """Extract invoices table with key fields"""
        query = f"""
        SELECT 
            invoice_id,
            invoice_date,
            customer_id,
            invoice_amount,
            payment_date,
            product_category,
            region,
            salesperson_id
        FROM 
            invoices
        WHERE 
            YEAR(invoice_date) >= {start_year}
        ORDER BY 
            invoice_date
        """
        return pd.read_sql(query, self.connection)
    
    def extract_customers(self):
        """Extract customer master data"""
        query = """
        SELECT 
            customer_id,
            customer_since_date,
            industry_sector,
            company_size,
            region,
            is_active,
            churn_date
        FROM 
            customers
        """
        return pd.read_sql(query, self.connection)
    
    def close(self):
        """Close database connection"""
        if self.connection:
            self.connection.close()
            print("🔒 Connection closed")

# Usage Example:
if __name__ == "__main__":
    connector = ClientDatabaseConnector()
    
    if connector.connect():
        # Test connection
        connector.test_connection()
        
        # Get table list
        tables = connector.get_table_list()
        print(tables.head(10))
        
        # Extract sample data
        invoices = connector.extract_invoices(start_year=2022)
        print(f"\n📊 Invoices: {len(invoices)} records")
        print(invoices.head())
        
        # Close connection
        connector.close()
```

**Environment Variables (.env):**
```bash
# Client Database Credentials
CLIENT_DB_SERVER=client-erp-server.database.windows.net
CLIENT_DB_NAME=erp_production
CLIENT_DB_USER=correlateai_readonly
CLIENT_DB_PASSWORD=secure_password_here
```

---

#### **Option B: CSV Export (If No Direct Access)**

**Data Export Script for Client IT:**
```sql
-- Script for client IT to export data
-- File: client_data_export.sql

-- 1. Export Invoices (Last 3 Years)
SELECT 
    invoice_id,
    invoice_date,
    customer_id,
    invoice_amount,
    payment_date,
    payment_terms,
    product_category,
    region,
    salesperson_id,
    discount_applied
FROM 
    invoices
WHERE 
    invoice_date >= DATEADD(year, -3, GETDATE())
ORDER BY 
    invoice_date;
-- Export to: invoices_3years.csv

-- 2. Export Customers
SELECT 
    customer_id,
    customer_since_date,
    industry_sector,
    company_size,
    region,
    is_active,
    churn_date,
    customer_tier
FROM 
    customers;
-- Export to: customers_all.csv

-- 3. Export Products
SELECT 
    product_id,
    product_name,
    product_category,
    unit_cost,
    unit_price,
    margin_percentage,
    launch_date
FROM 
    products
WHERE 
    is_active = 1;
-- Export to: products_active.csv

-- 4. Export Quotes (Last 2 Years)
SELECT 
    quote_id,
    quote_date,
    customer_id,
    salesperson_id,
    quote_amount,
    quote_status,
    close_date,
    lead_source
FROM 
    quotes
WHERE 
    quote_date >= DATEADD(year, -2, GETDATE())
ORDER BY 
    quote_date;
-- Export to: quotes_2years.csv
```

---

### **Step 2: Data Import to CorrelateAI**

#### **Create Custom Dataset Loader:**

```typescript
// File: src/services/clientDataLoader.ts

import Papa from 'papaparse'

export interface ClientInvoice {
  invoice_id: string
  invoice_date: string
  customer_id: string
  invoice_amount: number
  payment_date?: string
  product_category: string
  region: string
  salesperson_id?: string
}

export interface ClientCustomer {
  customer_id: string
  customer_since_date: string
  industry_sector: string
  company_size: string
  region: string
  is_active: boolean
  churn_date?: string
}

export class ClientDataLoader {
  
  async loadInvoices(file: File): Promise<ClientInvoice[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          console.log(`✅ Loaded ${results.data.length} invoices`)
          resolve(results.data as ClientInvoice[])
        },
        error: (error) => {
          console.error('❌ Error loading invoices:', error)
          reject(error)
        }
      })
    })
  }
  
  async loadCustomers(file: File): Promise<ClientCustomer[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          console.log(`✅ Loaded ${results.data.length} customers`)
          resolve(results.data as ClientCustomer[])
        },
        error: (error) => {
          console.error('❌ Error loading customers:', error)
          reject(error)
        }
      })
    })
  }
  
  // Transform invoice data to time series
  aggregateRevenueByMonth(invoices: ClientInvoice[]): Array<{year: number, value: number}> {
    const monthlyRevenue = new Map<string, number>()
    
    invoices.forEach(invoice => {
      const date = new Date(invoice.invoice_date)
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const current = monthlyRevenue.get(yearMonth) || 0
      monthlyRevenue.set(yearMonth, current + invoice.invoice_amount)
    })
    
    // Convert to array and sort
    return Array.from(monthlyRevenue.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([yearMonth, value]) => ({
        year: parseInt(yearMonth.split('-')[0]),
        value: value
      }))
  }
  
  // Calculate customer metrics
  calculateCustomerMetrics(customers: ClientCustomer[], invoices: ClientInvoice[]) {
    const metrics = {
      totalCustomers: customers.length,
      activeCustomers: customers.filter(c => c.is_active).length,
      churnRate: 0,
      avgRevenuePerCustomer: 0,
      customersByRegion: new Map<string, number>()
    }
    
    // Churn rate
    const churned = customers.filter(c => !c.is_active).length
    metrics.churnRate = (churned / customers.length) * 100
    
    // Revenue per customer
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.invoice_amount, 0)
    metrics.avgRevenuePerCustomer = totalRevenue / customers.length
    
    // Customers by region
    customers.forEach(customer => {
      const count = metrics.customersByRegion.get(customer.region) || 0
      metrics.customersByRegion.set(customer.region, count + 1)
    })
    
    return metrics
  }
  
  // Prepare data for correlation analysis
  prepareCorrelationDataset(
    name: string,
    data: Array<{date: string, value: number}>,
    unit: string
  ) {
    return {
      id: name.toLowerCase().replace(/\s+/g, '_'),
      name: name,
      unit: unit,
      category: 'client_data',
      dataSource: 'Client ERP',
      data: data.map((d, idx) => ({
        year: new Date(d.date).getFullYear(),
        value: d.value
      }))
    }
  }
}
```

---

### **Step 3: Add Client Data Upload UI**

```typescript
// File: src/components/ClientDataUpload.tsx

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Database, CheckCircle, XCircle } from '@phosphor-icons/react'
import { ClientDataLoader } from '@/services/clientDataLoader'
import { toast } from 'sonner'

export const ClientDataUpload = () => {
  const [invoicesFile, setInvoicesFile] = useState<File | null>(null)
  const [customersFile, setCustomersFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  
  const loader = new ClientDataLoader()
  
  const handleUpload = async () => {
    if (!invoicesFile || !customersFile) {
      toast.error('Please upload both files')
      return
    }
    
    setLoading(true)
    
    try {
      // Load data
      const invoices = await loader.loadInvoices(invoicesFile)
      const customers = await loader.loadCustomers(customersFile)
      
      // Calculate metrics
      const metrics = loader.calculateCustomerMetrics(customers, invoices)
      
      // Show success
      toast.success(`✅ Loaded: ${invoices.length} invoices, ${customers.length} customers`)
      console.log('Metrics:', metrics)
      
      setLoaded(true)
      
      // Here you would integrate with your correlation engine
      // generateClientCorrelations(invoices, customers)
      
    } catch (error) {
      toast.error('Error loading data: ' + error)
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          Upload Client Data
        </CardTitle>
        <CardDescription>
          Upload CSV exports from the client's ERP system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Invoices File */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Invoices Data (CSV)</label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setInvoicesFile(e.target.files?.[0] || null)}
              className="text-sm"
            />
            {invoicesFile && <CheckCircle className="w-5 h-5 text-green-600" />}
          </div>
        </div>
        
        {/* Customers File */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Customers Data (CSV)</label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCustomersFile(e.target.files?.[0] || null)}
              className="text-sm"
            />
            {customersFile && <CheckCircle className="w-5 h-5 text-green-600" />}
          </div>
        </div>
        
        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!invoicesFile || !customersFile || loading}
          className="w-full"
        >
          <Upload className="w-4 h-4 mr-2" />
          {loading ? 'Loading...' : 'Analyze Data'}
        </Button>
        
        {loaded && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Data loaded successfully!</span>
            </div>
            <p className="text-sm text-green-700 mt-2">
              Ready to generate correlations from client data
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

---

### **Step 4: Generate Client-Specific Correlations**

```typescript
// File: src/services/clientCorrelationService.ts

import { ClientInvoice, ClientCustomer, ClientDataLoader } from './clientDataLoader'

export interface ClientCorrelation {
  id: string
  title: string
  description: string
  correlation: number
  rSquared: number
  data: Array<{ year: number; value1: number; value2: number }>
  insight: string
  recommendation: string
  roiImpact: string
}

export class ClientCorrelationService {
  private loader = new ClientDataLoader()
  
  async analyzeRevenueVsCustomerCount(
    invoices: ClientInvoice[],
    customers: ClientCustomer[]
  ): Promise<ClientCorrelation> {
    
    // Aggregate revenue by month
    const monthlyRevenue = new Map<string, number>()
    const monthlyCustomers = new Map<string, Set<string>>()
    
    invoices.forEach(invoice => {
      const date = new Date(invoice.invoice_date)
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      // Revenue
      const currentRevenue = monthlyRevenue.get(yearMonth) || 0
      monthlyRevenue.set(yearMonth, currentRevenue + invoice.invoice_amount)
      
      // Unique customers
      if (!monthlyCustomers.has(yearMonth)) {
        monthlyCustomers.set(yearMonth, new Set())
      }
      monthlyCustomers.get(yearMonth)!.add(invoice.customer_id)
    })
    
    // Create correlation data
    const data = Array.from(monthlyRevenue.keys())
      .sort()
      .map(yearMonth => {
        const [year, month] = yearMonth.split('-').map(Number)
        return {
          year: year + (month / 12),
          value1: monthlyRevenue.get(yearMonth) || 0,
          value2: monthlyCustomers.get(yearMonth)?.size || 0
        }
      })
    
    // Calculate correlation (simplified Pearson)
    const correlation = this.calculateCorrelation(
      data.map(d => d.value1),
      data.map(d => d.value2)
    )
    
    return {
      id: 'revenue_vs_customer_count',
      title: 'Monthly Revenue vs Active Customer Count',
      description: 'Correlation between revenue and number of unique customers per month',
      correlation: correlation,
      rSquared: correlation * correlation,
      data: data,
      insight: correlation > 0.7 
        ? `Strong positive correlation (${(correlation * 100).toFixed(0)}%): Revenue increases ${(correlation * 100).toFixed(0)}% when customer count increases`
        : `Moderate correlation (${(correlation * 100).toFixed(0)}%): Revenue is partially influenced by customer count`,
      recommendation: correlation > 0.7
        ? 'Focus on customer acquisition to drive revenue growth'
        : 'Revenue depends on factors beyond customer count - analyze average order value and upsells',
      roiImpact: this.calculateROIImpact(data, correlation)
    }
  }
  
  private calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length
    const sum_x = x.reduce((a, b) => a + b, 0)
    const sum_y = y.reduce((a, b) => a + b, 0)
    const sum_xy = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sum_x2 = x.reduce((sum, xi) => sum + xi * xi, 0)
    const sum_y2 = y.reduce((sum, yi) => sum + yi * yi, 0)
    
    const numerator = n * sum_xy - sum_x * sum_y
    const denominator = Math.sqrt((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y))
    
    return denominator === 0 ? 0 : numerator / denominator
  }
  
  private calculateROIImpact(data: any[], correlation: number): string {
    // Calculate potential revenue impact
    const avgRevenue = data.reduce((sum, d) => sum + d.value1, 0) / data.length
    const revenueGrowth = avgRevenue * correlation * 0.1 // Conservative 10% improvement
    
    return `Potential annual impact: $${(revenueGrowth * 12).toLocaleString()} 
            (assuming ${(correlation * 10).toFixed(1)}% improvement)`
  }
}
```

---

## 📦 Dependencies to Install

```bash
# Python (for database connection)
pip install pandas pyodbc sqlalchemy python-dotenv

# Node/React (for file upload)
npm install papaparse
npm install @types/papaparse --save-dev
```

---

## 🚀 Quick Start Commands

```bash
# 1. Test database connection
python scripts/client_db_connector.py

# 2. Extract data to CSV
python scripts/extract_client_data.py --start-year 2022

# 3. Start CorrelateAI with client data support
npm run dev
```

---

## 📊 Next Steps

1. **Get database credentials from client IT**
2. **Test connection with sample query**
3. **Extract Priority 1 tables (invoices, customers, products)**
4. **Load into CorrelateAI**
5. **Generate first 10 correlations**
6. **Present findings to client**

---

This gives you everything you need to connect to their ERP and start analyzing! Let me know when you get the database details and I'll help you with the specific extraction queries.
