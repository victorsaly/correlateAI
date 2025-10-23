-- CorrelateAI Enterprise - Sample Data Generation
-- Realistic financial and sales data for correlation analysis demo

-- ==================================================
-- CREATE SCHEMAS
-- ==================================================
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Financial')
    EXEC('CREATE SCHEMA Financial');

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Sales')
    EXEC('CREATE SCHEMA Sales');

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Operations')
    EXEC('CREATE SCHEMA Operations');

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'Analysis')
    EXEC('CREATE SCHEMA Analysis');

-- ==================================================
-- SAMPLE DATA INSERTION
-- ==================================================

-- Sample Financial Accounts
INSERT INTO Financial.Accounts (AccountCode, AccountName, AccountType, Category) VALUES
('1001', 'Cash and Cash Equivalents', 'Asset', 'Current'),
('1002', 'Accounts Receivable', 'Asset', 'Current'),
('1003', 'Inventory', 'Asset', 'Current'),
('1101', 'Property, Plant & Equipment', 'Asset', 'Fixed'),
('2001', 'Accounts Payable', 'Liability', 'Current'),
('2002', 'Accrued Expenses', 'Liability', 'Current'),
('2101', 'Long-term Debt', 'Liability', 'Long-term'),
('3001', 'Common Stock', 'Equity', 'Capital'),
('3002', 'Retained Earnings', 'Equity', 'Capital'),
('4001', 'Product Sales', 'Revenue', 'Operating'),
('4002', 'Service Revenue', 'Revenue', 'Operating'),
('4003', 'Interest Income', 'Revenue', 'Non-Operating'),
('5001', 'Cost of Goods Sold', 'Expense', 'Operating'),
('5002', 'Sales & Marketing', 'Expense', 'Operating'),
('5003', 'General & Administrative', 'Expense', 'Operating'),
('5004', 'Research & Development', 'Expense', 'Operating'),
('5005', 'Interest Expense', 'Expense', 'Non-Operating');

-- Sample Customers
INSERT INTO Sales.Customers (CustomerCode, CompanyName, ContactName, Email, Industry, Segment, Region, Country, City, CreditLimit, CustomerSince) VALUES
('CUST001', 'TechCorp Solutions', 'John Smith', 'john@techcorp.com', 'Technology', 'Enterprise', 'North America', 'USA', 'New York', 500000, '2020-01-15'),
('CUST002', 'Global Manufacturing Inc', 'Sarah Johnson', 'sarah@globalmfg.com', 'Manufacturing', 'Enterprise', 'North America', 'USA', 'Detroit', 750000, '2019-06-20'),
('CUST003', 'HealthPlus Systems', 'Mike Davis', 'mike@healthplus.com', 'Healthcare', 'Enterprise', 'North America', 'USA', 'Boston', 300000, '2021-03-10'),
('CUST004', 'RetailMart Chain', 'Lisa Wilson', 'lisa@retailmart.com', 'Retail', 'SMB', 'North America', 'USA', 'Chicago', 200000, '2020-09-05'),
('CUST005', 'EuroTech Ltd', 'Hans Mueller', 'hans@eurotech.eu', 'Technology', 'SMB', 'Europe', 'Germany', 'Munich', 150000, '2021-01-12'),
('CUST006', 'Pacific Logistics', 'Yuki Tanaka', 'yuki@pacificlog.jp', 'Logistics', 'Enterprise', 'Asia Pacific', 'Japan', 'Tokyo', 400000, '2020-11-08'),
('CUST007', 'Financial Partners', 'Emma Brown', 'emma@finpartners.com', 'Financial Services', 'Enterprise', 'Europe', 'UK', 'London', 600000, '2019-12-18');

-- Sample Products
INSERT INTO Sales.Products (ProductCode, ProductName, Category, SubCategory, UnitPrice, Cost, Margin, LaunchDate) VALUES
('PROD001', 'Enterprise Software License', 'Software', 'Enterprise', 15000.00, 3000.00, 80.00, '2019-01-01'),
('PROD002', 'Professional Services', 'Services', 'Consulting', 250.00, 100.00, 60.00, '2019-01-01'),
('PROD003', 'Cloud Storage Premium', 'Software', 'Cloud', 500.00, 150.00, 70.00, '2020-03-15'),
('PROD004', 'Analytics Platform', 'Software', 'Analytics', 8000.00, 2000.00, 75.00, '2020-06-01'),
('PROD005', 'Mobile App License', 'Software', 'Mobile', 100.00, 30.00, 70.00, '2021-01-10'),
('PROD006', 'Support Package Premium', 'Services', 'Support', 5000.00, 1500.00, 70.00, '2019-01-01'),
('PROD007', 'Training Services', 'Services', 'Training', 1500.00, 500.00, 66.67, '2019-01-01');

-- Sample Employees
INSERT INTO Operations.Employees (EmployeeNumber, FirstName, LastName, Email, Department, Position, HireDate, Salary, Manager, Location) VALUES
('EMP001', 'Alice', 'Johnson', 'alice.johnson@company.com', 'Sales', 'Sales Director', '2018-01-15', 120000, NULL, 'New York'),
('EMP002', 'Bob', 'Smith', 'bob.smith@company.com', 'Sales', 'Senior Sales Rep', '2019-03-20', 85000, 'EMP001', 'New York'),
('EMP003', 'Carol', 'Davis', 'carol.davis@company.com', 'Sales', 'Sales Rep', '2020-06-10', 65000, 'EMP001', 'Chicago'),
('EMP004', 'David', 'Wilson', 'david.wilson@company.com', 'Marketing', 'Marketing Director', '2018-05-01', 110000, NULL, 'San Francisco'),
('EMP005', 'Eve', 'Brown', 'eve.brown@company.com', 'Marketing', 'Marketing Manager', '2019-09-15', 75000, 'EMP004', 'San Francisco'),
('EMP006', 'Frank', 'Miller', 'frank.miller@company.com', 'Finance', 'CFO', '2017-01-10', 150000, NULL, 'New York'),
('EMP007', 'Grace', 'Taylor', 'grace.taylor@company.com', 'Finance', 'Financial Analyst', '2020-02-01', 70000, 'EMP006', 'New York');

-- Sample Marketing Campaigns
INSERT INTO Operations.MarketingCampaigns (CampaignName, CampaignType, StartDate, EndDate, Budget, ActualSpend, Impressions, Clicks, Conversions, Revenue, TargetAudience) VALUES
('Q1 2024 Product Launch', 'Digital', '2024-01-01', '2024-03-31', 50000, 48500, 2000000, 25000, 500, 750000, 'Enterprise Technology'),
('Summer Sales Push', 'Email', '2024-06-01', '2024-08-31', 15000, 14200, 500000, 12000, 200, 300000, 'Existing Customers'),
('Holiday Promotion', 'PPC', '2024-11-01', '2024-12-31', 75000, 72000, 3000000, 45000, 800, 1200000, 'All Segments'),
('Webinar Series', 'Content', '2024-02-15', '2024-05-15', 25000, 23800, 1000000, 8000, 150, 225000, 'SMB Market'),
('Trade Show Participation', 'Events', '2024-09-01', '2024-09-30', 100000, 95000, 50000, 2000, 100, 1500000, 'Enterprise');

-- Generate sample financial transactions for 2023-2024
DECLARE @StartDate DATE = '2023-01-01';
DECLARE @EndDate DATE = '2024-12-31';
DECLARE @CurrentDate DATE = @StartDate;
DECLARE @AccountID UNIQUEIDENTIFIER;
DECLARE @Amount DECIMAL(18,2);
DECLARE @TransactionNumber NVARCHAR(50);
DECLARE @Counter INT = 1;

WHILE @CurrentDate <= @EndDate
BEGIN
    -- Generate revenue transactions (varying by month and seasonality)
    SET @Amount = 50000 + (RAND() * 100000) + 
                  CASE WHEN MONTH(@CurrentDate) IN (11, 12) THEN 30000 ELSE 0 END; -- Holiday boost
    
    SELECT @AccountID = AccountID FROM Financial.Accounts WHERE AccountCode = '4001';
    SET @TransactionNumber = 'TXN' + FORMAT(@Counter, '000000');
    
    INSERT INTO Financial.Transactions (TransactionNumber, TransactionDate, AccountID, Amount, DebitCredit, Description, Department)
    VALUES (@TransactionNumber, @CurrentDate, @AccountID, @Amount, 'Credit', 'Daily Sales Revenue', 'Sales');
    
    SET @Counter = @Counter + 1;
    
    -- Generate expense transactions
    IF DATEPART(WEEKDAY, @CurrentDate) = 2 -- Monday - weekly expenses
    BEGIN
        -- Sales & Marketing expenses
        SELECT @AccountID = AccountID FROM Financial.Accounts WHERE AccountCode = '5002';
        SET @TransactionNumber = 'TXN' + FORMAT(@Counter, '000000');
        SET @Amount = 8000 + (RAND() * 5000);
        
        INSERT INTO Financial.Transactions (TransactionNumber, TransactionDate, AccountID, Amount, DebitCredit, Description, Department)
        VALUES (@TransactionNumber, @CurrentDate, @AccountID, @Amount, 'Debit', 'Weekly Marketing Spend', 'Marketing');
        
        SET @Counter = @Counter + 1;
    END
    
    SET @CurrentDate = DATEADD(DAY, 1, @CurrentDate);
END

-- Generate sample sales orders with correlation patterns
DECLARE @OrderDate DATE = '2023-01-01';
DECLARE @CustomerID UNIQUEIDENTIFIER;
DECLARE @ProductID UNIQUEIDENTIFIER;
DECLARE @OrderID UNIQUEIDENTIFIER;
DECLARE @OrderCounter INT = 1;

WHILE @OrderDate <= '2024-12-31'
BEGIN
    -- Generate 1-5 orders per day with seasonal variations
    DECLARE @OrdersToday INT = 1 + (RAND() * 4);
    IF MONTH(@OrderDate) IN (11, 12) SET @OrdersToday = @OrdersToday + 2; -- Holiday increase
    
    DECLARE @DailyOrder INT = 1;
    WHILE @DailyOrder <= @OrdersToday
    BEGIN
        -- Select random customer (weighted toward larger customers)
        SELECT TOP 1 @CustomerID = CustomerID 
        FROM Sales.Customers 
        ORDER BY CASE WHEN Segment = 'Enterprise' THEN RAND() * 0.7 ELSE RAND() END DESC;
        
        SET @OrderID = NEWID();
        DECLARE @OrderNumber NVARCHAR(50) = 'ORD' + FORMAT(@OrderCounter, '000000');
        DECLARE @TotalAmount DECIMAL(18,2) = 0;
        DECLARE @NetAmount DECIMAL(18,2) = 0;
        
        -- Insert order header
        INSERT INTO Sales.Orders (OrderID, OrderNumber, CustomerID, OrderDate, SalesPersonID, Territory, OrderStatus, TotalAmount, NetAmount)
        VALUES (@OrderID, @OrderNumber, @CustomerID, @OrderDate, 'EMP002', 'North America', 'Completed', 0, 0);
        
        -- Add 1-3 products per order
        DECLARE @ProductCount INT = 1 + (RAND() * 2);
        DECLARE @ProductIndex INT = 1;
        
        WHILE @ProductIndex <= @ProductCount
        BEGIN
            SELECT TOP 1 @ProductID = ProductID FROM Sales.Products ORDER BY NEWID();
            
            DECLARE @Quantity INT = 1 + (RAND() * 10);
            DECLARE @UnitPrice DECIMAL(18,2);
            DECLARE @LineTotal DECIMAL(18,2);
            
            SELECT @UnitPrice = UnitPrice FROM Sales.Products WHERE ProductID = @ProductID;
            SET @LineTotal = @Quantity * @UnitPrice;
            SET @TotalAmount = @TotalAmount + @LineTotal;
            
            INSERT INTO Sales.OrderDetails (OrderID, ProductID, Quantity, UnitPrice, LineTotal)
            VALUES (@OrderID, @ProductID, @Quantity, @UnitPrice, @LineTotal);
            
            SET @ProductIndex = @ProductIndex + 1;
        END
        
        SET @NetAmount = @TotalAmount;
        
        -- Update order totals
        UPDATE Sales.Orders 
        SET TotalAmount = @TotalAmount, NetAmount = @NetAmount 
        WHERE OrderID = @OrderID;
        
        SET @OrderCounter = @OrderCounter + 1;
        SET @DailyOrder = @DailyOrder + 1;
    END
    
    SET @OrderDate = DATEADD(DAY, 1, @OrderDate);
END

-- Generate support tickets with correlation to sales
INSERT INTO Operations.SupportTickets (TicketNumber, CustomerID, Category, Priority, Status, CreatedDate, ResolvedDate, ResolutionTime, AssignedTo, Satisfaction)
SELECT 
    'TICK' + FORMAT(ROW_NUMBER() OVER (ORDER BY c.CustomerID), '000000'),
    c.CustomerID,
    CASE WHEN RAND() < 0.4 THEN 'Technical' 
         WHEN RAND() < 0.7 THEN 'Billing' 
         ELSE 'General' END,
    CASE WHEN RAND() < 0.1 THEN 'Critical'
         WHEN RAND() < 0.3 THEN 'High' 
         WHEN RAND() < 0.7 THEN 'Medium'
         ELSE 'Low' END,
    'Resolved',
    DATEADD(DAY, -ABS(CHECKSUM(NEWID())) % 365, GETDATE()),
    DATEADD(HOUR, ABS(CHECKSUM(NEWID())) % 72, DATEADD(DAY, -ABS(CHECKSUM(NEWID())) % 365, GETDATE())),
    ABS(CHECKSUM(NEWID())) % 72,
    'EMP007',
    3.0 + (RAND() * 2.0)
FROM Sales.Customers c
CROSS JOIN (SELECT TOP 3 1 as dummy FROM sys.objects) t; -- 3 tickets per customer

PRINT 'Sample data generation completed successfully!';