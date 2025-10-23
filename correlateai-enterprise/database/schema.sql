-- CorrelateAI Enterprise - Sample Database Schema
-- Financial and Sales Data for Correlation Analysis Demo
-- Target: Azure SQL Database

-- ==================================================
-- FINANCIAL DATA SCHEMA
-- ==================================================

-- Financial Accounts Chart
CREATE TABLE Financial.Accounts (
    AccountID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    AccountCode NVARCHAR(20) NOT NULL UNIQUE,
    AccountName NVARCHAR(100) NOT NULL,
    AccountType NVARCHAR(50) NOT NULL, -- Revenue, Expense, Asset, Liability, Equity
    Category NVARCHAR(50) NOT NULL, -- Operating, Non-Operating, Capital, etc.
    ParentAccountID UNIQUEIDENTIFIER NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (ParentAccountID) REFERENCES Financial.Accounts(AccountID),
    INDEX IX_Accounts_Type_Category (AccountType, Category),
    INDEX IX_Accounts_Code (AccountCode)
);

-- Financial Transactions
CREATE TABLE Financial.Transactions (
    TransactionID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TransactionNumber NVARCHAR(50) NOT NULL UNIQUE,
    TransactionDate DATE NOT NULL,
    AccountID UNIQUEIDENTIFIER NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    DebitCredit NVARCHAR(6) NOT NULL CHECK (DebitCredit IN ('Debit', 'Credit')),
    Description NVARCHAR(255) NOT NULL,
    Reference NVARCHAR(100) NULL, -- Invoice, PO, etc.
    Department NVARCHAR(50) NULL,
    CostCenter NVARCHAR(50) NULL,
    Project NVARCHAR(50) NULL,
    CreatedBy NVARCHAR(100) NOT NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (AccountID) REFERENCES Financial.Accounts(AccountID),
    INDEX IX_Transactions_Date_Account (TransactionDate, AccountID),
    INDEX IX_Transactions_Amount (Amount),
    INDEX IX_Transactions_Department (Department),
    INDEX IX_Transactions_Reference (Reference)
);

-- Budget Planning
CREATE TABLE Financial.Budgets (
    BudgetID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    BudgetYear INT NOT NULL,
    BudgetPeriod NVARCHAR(20) NOT NULL, -- Monthly, Quarterly, Annual
    AccountID UNIQUEIDENTIFIER NOT NULL,
    Department NVARCHAR(50) NOT NULL,
    BudgetAmount DECIMAL(18,2) NOT NULL,
    ActualAmount DECIMAL(18,2) NULL,
    Variance DECIMAL(18,2) NULL,
    VariancePercent DECIMAL(5,2) NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Active',
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (AccountID) REFERENCES Financial.Accounts(AccountID),
    INDEX IX_Budgets_Year_Period (BudgetYear, BudgetPeriod),
    INDEX IX_Budgets_Department (Department),
    UNIQUE (BudgetYear, BudgetPeriod, AccountID, Department)
);

-- Cash Flow
CREATE TABLE Financial.CashFlow (
    CashFlowID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    FlowDate DATE NOT NULL,
    FlowType NVARCHAR(20) NOT NULL, -- Operating, Investing, Financing
    Category NVARCHAR(50) NOT NULL,
    Amount DECIMAL(18,2) NOT NULL,
    Description NVARCHAR(255) NOT NULL,
    BankAccount NVARCHAR(50) NOT NULL,
    Reference NVARCHAR(100) NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    INDEX IX_CashFlow_Date_Type (FlowDate, FlowType),
    INDEX IX_CashFlow_Amount (Amount),
    INDEX IX_CashFlow_Category (Category)
);

-- ==================================================
-- SALES DATA SCHEMA
-- ==================================================

-- Customers
CREATE TABLE Sales.Customers (
    CustomerID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CustomerCode NVARCHAR(20) NOT NULL UNIQUE,
    CompanyName NVARCHAR(100) NOT NULL,
    ContactName NVARCHAR(100) NULL,
    Email NVARCHAR(100) NULL,
    Phone NVARCHAR(20) NULL,
    Industry NVARCHAR(50) NOT NULL,
    Segment NVARCHAR(50) NOT NULL, -- Enterprise, SMB, Consumer
    Region NVARCHAR(50) NOT NULL,
    Country NVARCHAR(50) NOT NULL,
    City NVARCHAR(50) NOT NULL,
    CreditLimit DECIMAL(18,2) NULL,
    PaymentTerms INT NOT NULL DEFAULT 30, -- Days
    CustomerSince DATE NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    INDEX IX_Customers_Industry_Segment (Industry, Segment),
    INDEX IX_Customers_Region (Region),
    INDEX IX_Customers_Since (CustomerSince)
);

-- Products
CREATE TABLE Sales.Products (
    ProductID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    ProductCode NVARCHAR(20) NOT NULL UNIQUE,
    ProductName NVARCHAR(100) NOT NULL,
    Category NVARCHAR(50) NOT NULL,
    SubCategory NVARCHAR(50) NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    Cost DECIMAL(18,2) NOT NULL,
    Margin DECIMAL(5,2) NOT NULL,
    LaunchDate DATE NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    INDEX IX_Products_Category (Category, SubCategory),
    INDEX IX_Products_Price (UnitPrice),
    INDEX IX_Products_Launch (LaunchDate)
);

-- Sales Orders
CREATE TABLE Sales.Orders (
    OrderID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrderNumber NVARCHAR(50) NOT NULL UNIQUE,
    CustomerID UNIQUEIDENTIFIER NOT NULL,
    OrderDate DATE NOT NULL,
    RequiredDate DATE NULL,
    ShippedDate DATE NULL,
    SalesPersonID NVARCHAR(50) NOT NULL,
    Territory NVARCHAR(50) NOT NULL,
    OrderStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    TotalAmount DECIMAL(18,2) NOT NULL,
    DiscountAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
    NetAmount DECIMAL(18,2) NOT NULL,
    ShippingCost DECIMAL(18,2) NOT NULL DEFAULT 0,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ModifiedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    FOREIGN KEY (CustomerID) REFERENCES Sales.Customers(CustomerID),
    INDEX IX_Orders_Date_Customer (OrderDate, CustomerID),
    INDEX IX_Orders_SalesPerson (SalesPersonID),
    INDEX IX_Orders_Territory (Territory),
    INDEX IX_Orders_Amount (TotalAmount),
    INDEX IX_Orders_Status (OrderStatus)
);

-- Order Details
CREATE TABLE Sales.OrderDetails (
    OrderDetailID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrderID UNIQUEIDENTIFIER NOT NULL,
    ProductID UNIQUEIDENTIFIER NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    Discount DECIMAL(5,2) NOT NULL DEFAULT 0,
    LineTotal DECIMAL(18,2) NOT NULL,
    
    FOREIGN KEY (OrderID) REFERENCES Sales.Orders(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Sales.Products(ProductID),
    INDEX IX_OrderDetails_Order (OrderID),
    INDEX IX_OrderDetails_Product (ProductID),
    INDEX IX_OrderDetails_Quantity (Quantity)
);

-- Sales Performance
CREATE TABLE Sales.Performance (
    PerformanceID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    SalesPersonID NVARCHAR(50) NOT NULL,
    PeriodType NVARCHAR(20) NOT NULL, -- Monthly, Quarterly, Annual
    PeriodYear INT NOT NULL,
    PeriodNumber INT NOT NULL, -- Month 1-12, Quarter 1-4
    Territory NVARCHAR(50) NOT NULL,
    Revenue DECIMAL(18,2) NOT NULL,
    UnitsLold INT NOT NULL,
    NewCustomers INT NOT NULL,
    Target DECIMAL(18,2) NOT NULL,
    Achievement DECIMAL(5,2) NOT NULL, -- Percentage
    Commission DECIMAL(18,2) NOT NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    INDEX IX_Performance_Person_Period (SalesPersonID, PeriodYear, PeriodNumber),
    INDEX IX_Performance_Territory (Territory),
    INDEX IX_Performance_Revenue (Revenue),
    UNIQUE (SalesPersonID, PeriodType, PeriodYear, PeriodNumber)
);

-- ==================================================
-- OPERATIONAL DATA SCHEMA
-- ==================================================

-- Employees (HR Data)
CREATE TABLE Operations.Employees (
    EmployeeID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    EmployeeNumber NVARCHAR(20) NOT NULL UNIQUE,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Department NVARCHAR(50) NOT NULL,
    Position NVARCHAR(50) NOT NULL,
    HireDate DATE NOT NULL,
    Salary DECIMAL(18,2) NOT NULL,
    Manager NVARCHAR(20) NULL, -- EmployeeNumber
    Location NVARCHAR(50) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Active',
    TerminationDate DATE NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    INDEX IX_Employees_Department (Department),
    INDEX IX_Employees_Position (Position),
    INDEX IX_Employees_Hire (HireDate),
    INDEX IX_Employees_Manager (Manager)
);

-- Marketing Campaigns
CREATE TABLE Operations.MarketingCampaigns (
    CampaignID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    CampaignName NVARCHAR(100) NOT NULL,
    CampaignType NVARCHAR(50) NOT NULL, -- Email, Social, PPC, Print, etc.
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Budget DECIMAL(18,2) NOT NULL,
    ActualSpend DECIMAL(18,2) NULL,
    Impressions BIGINT NULL,
    Clicks BIGINT NULL,
    Conversions INT NULL,
    Revenue DECIMAL(18,2) NULL,
    TargetAudience NVARCHAR(100) NULL,
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    INDEX IX_Campaigns_Type_Date (CampaignType, StartDate),
    INDEX IX_Campaigns_Budget (Budget),
    INDEX IX_Campaigns_Revenue (Revenue)
);

-- Customer Support Tickets
CREATE TABLE Operations.SupportTickets (
    TicketID UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    TicketNumber NVARCHAR(50) NOT NULL UNIQUE,
    CustomerID UNIQUEIDENTIFIER NULL,
    Category NVARCHAR(50) NOT NULL, -- Technical, Billing, General
    Priority NVARCHAR(20) NOT NULL, -- Low, Medium, High, Critical
    Status NVARCHAR(20) NOT NULL DEFAULT 'Open',
    CreatedDate DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    ResolvedDate DATETIME2 NULL,
    ResolutionTime INT NULL, -- Hours
    AssignedTo NVARCHAR(50) NULL,
    Satisfaction DECIMAL(3,2) NULL, -- 1-5 rating
    
    FOREIGN KEY (CustomerID) REFERENCES Sales.Customers(CustomerID),
    INDEX IX_Tickets_Customer (CustomerID),
    INDEX IX_Tickets_Category_Priority (Category, Priority),
    INDEX IX_Tickets_Status (Status),
    INDEX IX_Tickets_Resolution (ResolutionTime)
);

-- ==================================================
-- CORRELATION ANALYSIS VIEWS
-- ==================================================

-- Monthly Financial Summary
CREATE VIEW Analysis.MonthlyFinancialSummary AS
SELECT 
    YEAR(t.TransactionDate) as FiscalYear,
    MONTH(t.TransactionDate) as FiscalMonth,
    a.AccountType,
    a.Category,
    SUM(CASE WHEN t.DebitCredit = 'Credit' THEN t.Amount ELSE -t.Amount END) as NetAmount,
    COUNT(*) as TransactionCount,
    AVG(CASE WHEN t.DebitCredit = 'Credit' THEN t.Amount ELSE -t.Amount END) as AvgAmount
FROM Financial.Transactions t
    INNER JOIN Financial.Accounts a ON t.AccountID = a.AccountID
WHERE a.IsActive = 1
GROUP BY 
    YEAR(t.TransactionDate),
    MONTH(t.TransactionDate),
    a.AccountType,
    a.Category;

-- Monthly Sales Summary
CREATE VIEW Analysis.MonthlySalesSummary AS
SELECT 
    YEAR(o.OrderDate) as SalesYear,
    MONTH(o.OrderDate) as SalesMonth,
    c.Industry,
    c.Segment,
    c.Region,
    COUNT(DISTINCT o.OrderID) as OrderCount,
    COUNT(DISTINCT o.CustomerID) as CustomerCount,
    SUM(o.NetAmount) as Revenue,
    AVG(o.NetAmount) as AvgOrderValue,
    SUM(od.Quantity) as UnitsLold
FROM Sales.Orders o
    INNER JOIN Sales.Customers c ON o.CustomerID = c.CustomerID
    INNER JOIN Sales.OrderDetails od ON o.OrderID = od.OrderID
GROUP BY 
    YEAR(o.OrderDate),
    MONTH(o.OrderDate),
    c.Industry,
    c.Segment,
    c.Region;

-- Combined Business Metrics
CREATE VIEW Analysis.BusinessMetrics AS
SELECT 
    fs.FiscalYear,
    fs.FiscalMonth,
    SUM(CASE WHEN fs.AccountType = 'Revenue' THEN fs.NetAmount ELSE 0 END) as FinancialRevenue,
    SUM(CASE WHEN fs.AccountType = 'Expense' THEN ABS(fs.NetAmount) ELSE 0 END) as FinancialExpenses,
    ss.Revenue as SalesRevenue,
    ss.OrderCount,
    ss.CustomerCount,
    ss.AvgOrderValue,
    (SELECT COUNT(*) FROM Operations.Employees WHERE Department IN ('Sales', 'Marketing') AND Status = 'Active') as SalesTeamSize,
    (SELECT SUM(Budget) FROM Operations.MarketingCampaigns 
     WHERE YEAR(StartDate) = fs.FiscalYear AND MONTH(StartDate) = fs.FiscalMonth) as MarketingSpend
FROM Analysis.MonthlyFinancialSummary fs
    LEFT JOIN (
        SELECT SalesYear, SalesMonth, 
               SUM(Revenue) as Revenue, 
               SUM(OrderCount) as OrderCount,
               SUM(CustomerCount) as CustomerCount,
               AVG(AvgOrderValue) as AvgOrderValue
        FROM Analysis.MonthlySalesSummary 
        GROUP BY SalesYear, SalesMonth
    ) ss ON fs.FiscalYear = ss.SalesYear AND fs.FiscalMonth = ss.SalesMonth
GROUP BY 
    fs.FiscalYear,
    fs.FiscalMonth,
    ss.Revenue,
    ss.OrderCount,
    ss.CustomerCount,
    ss.AvgOrderValue;