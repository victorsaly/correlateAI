"""
CorrelateAI Enterprise - AI Agent Framework
Core implementation using Azure AI Foundry Agent Service
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from abc import ABC, abstractmethod

import pandas as pd
import numpy as np
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import Agent, AgentThread, AgentMessage
import pyodbc
from sqlalchemy import create_engine, text
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class CorrelationInsight:
    """Represents a discovered correlation insight"""
    correlation_id: str
    source_metric: str
    target_metric: str
    correlation_strength: float
    p_value: float
    business_context: str
    recommendation: str
    impact_score: float
    confidence_level: str
    discovery_date: datetime
    data_timeframe: str

@dataclass
class BusinessMetric:
    """Represents a business metric with metadata"""
    name: str
    value: float
    timestamp: datetime
    category: str
    department: str
    metadata: Dict[str, Any]

class BaseAgent(ABC):
    """Base class for all CorrelateAI agents"""
    
    def __init__(self, agent_name: str, project_client: AIProjectClient, db_connection_string: str):
        self.agent_name = agent_name
        self.project_client = project_client
        self.db_connection_string = db_connection_string
        self.engine = create_engine(db_connection_string)
        self.agent_id = None
        self.thread_id = None
        
    async def initialize_agent(self, instructions: str, model_name: str = "gpt-4o-mini"):
        """Initialize the Azure AI Foundry agent"""
        try:
            # Create agent
            agent = await self.project_client.agents.create_agent(
                model=model_name,
                name=self.agent_name,
                instructions=instructions,
                tools=[
                    {"type": "function", "function": {
                        "name": "execute_sql_query",
                        "description": "Execute SQL queries against the enterprise database",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "query": {"type": "string", "description": "SQL query to execute"},
                                "description": {"type": "string", "description": "Purpose of the query"}
                            },
                            "required": ["query", "description"]
                        }
                    }},
                    {"type": "function", "function": {
                        "name": "calculate_correlation",
                        "description": "Calculate statistical correlation between two metrics",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "metric1_data": {"type": "array", "description": "First metric data points"},
                                "metric2_data": {"type": "array", "description": "Second metric data points"},
                                "correlation_type": {"type": "string", "enum": ["pearson", "spearman"], "default": "pearson"}
                            },
                            "required": ["metric1_data", "metric2_data"]
                        }
                    }}
                ]
            )
            self.agent_id = agent.id
            
            # Create thread
            thread = await self.project_client.agents.create_thread()
            self.thread_id = thread.id
            
            logger.info(f"Agent {self.agent_name} initialized with ID: {self.agent_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to initialize agent {self.agent_name}: {str(e)}")
            return False
    
    async def execute_sql_query(self, query: str, description: str = "") -> pd.DataFrame:
        """Execute SQL query and return results as DataFrame"""
        try:
            logger.info(f"Executing query: {description}")
            with self.engine.connect() as conn:
                df = pd.read_sql_query(text(query), conn)
            logger.info(f"Query returned {len(df)} rows")
            return df
        except Exception as e:
            logger.error(f"SQL query failed: {str(e)}")
            return pd.DataFrame()
    
    @abstractmethod
    async def analyze(self) -> List[Any]:
        """Abstract method for agent-specific analysis"""
        pass

class DataExplorerAgent(BaseAgent):
    """Agent responsible for database exploration and data profiling"""
    
    def __init__(self, project_client: AIProjectClient, db_connection_string: str):
        super().__init__("DataExplorerAgent", project_client, db_connection_string)
        self.discovered_schemas = {}
        self.data_quality_metrics = {}
    
    async def analyze(self) -> Dict[str, Any]:
        """Perform comprehensive database analysis"""
        instructions = """
        You are a Data Explorer Agent specialized in enterprise database analysis.
        Your responsibilities:
        1. Discover and map database schemas and relationships
        2. Profile data quality and identify anomalies
        3. Catalog business metrics and their metadata
        4. Identify potential correlation candidates
        
        Always provide detailed analysis with business context and recommendations.
        Focus on finding patterns that could indicate business relationships.
        """
        
        await self.initialize_agent(instructions)
        
        # Discover database schema
        schema_info = await self._discover_schemas()
        
        # Profile data quality
        quality_metrics = await self._profile_data_quality()
        
        # Identify key business metrics
        business_metrics = await self._identify_business_metrics()
        
        return {
            "schemas": schema_info,
            "quality_metrics": quality_metrics,
            "business_metrics": business_metrics,
            "analysis_timestamp": datetime.now().isoformat()
        }
    
    async def _discover_schemas(self) -> Dict[str, Any]:
        """Discover database schemas and relationships"""
        schema_query = """
        SELECT 
            s.name AS schema_name,
            t.name AS table_name,
            c.name AS column_name,
            ty.name AS data_type,
            c.max_length,
            c.is_nullable
        FROM sys.schemas s
        INNER JOIN sys.tables t ON s.schema_id = t.schema_id
        INNER JOIN sys.columns c ON t.object_id = c.object_id
        INNER JOIN sys.types ty ON c.user_type_id = ty.user_type_id
        WHERE s.name IN ('Financial', 'Sales', 'Operations', 'Analysis')
        ORDER BY s.name, t.name, c.column_id
        """
        
        df = await self.execute_sql_query(schema_query, "Discovering database schemas")
        
        # Organize schema information
        schemas = {}
        for _, row in df.iterrows():
            schema = row['schema_name']
            table = row['table_name']
            
            if schema not in schemas:
                schemas[schema] = {}
            if table not in schemas[schema]:
                schemas[schema][table] = []
                
            schemas[schema][table].append({
                'column': row['column_name'],
                'type': row['data_type'],
                'nullable': row['is_nullable']
            })
        
        return schemas
    
    async def _profile_data_quality(self) -> Dict[str, Any]:
        """Profile data quality across key tables"""
        quality_queries = {
            "financial_completeness": """
                SELECT 
                    COUNT(*) as total_transactions,
                    COUNT(CASE WHEN Amount IS NULL THEN 1 END) as null_amounts,
                    COUNT(CASE WHEN Amount = 0 THEN 1 END) as zero_amounts,
                    MIN(TransactionDate) as earliest_date,
                    MAX(TransactionDate) as latest_date
                FROM Financial.Transactions
            """,
            "sales_completeness": """
                SELECT 
                    COUNT(*) as total_orders,
                    COUNT(CASE WHEN NetAmount IS NULL THEN 1 END) as null_amounts,
                    COUNT(CASE WHEN NetAmount <= 0 THEN 1 END) as invalid_amounts,
                    AVG(NetAmount) as avg_order_value,
                    MIN(OrderDate) as earliest_order,
                    MAX(OrderDate) as latest_order
                FROM Sales.Orders
            """
        }
        
        quality_results = {}
        for metric_name, query in quality_queries.items():
            df = await self.execute_sql_query(query, f"Profiling {metric_name}")
            if not df.empty:
                quality_results[metric_name] = df.iloc[0].to_dict()
        
        return quality_results
    
    async def _identify_business_metrics(self) -> List[BusinessMetric]:
        """Identify key business metrics for correlation analysis"""
        metrics_query = """
        SELECT 
            FiscalYear,
            FiscalMonth,
            FinancialRevenue,
            FinancialExpenses,
            SalesRevenue,
            OrderCount,
            CustomerCount,
            AvgOrderValue,
            MarketingSpend
        FROM Analysis.BusinessMetrics
        WHERE FiscalYear >= 2023
        ORDER BY FiscalYear, FiscalMonth
        """
        
        df = await self.execute_sql_query(metrics_query, "Identifying business metrics")
        
        metrics = []
        for _, row in df.iterrows():
            timestamp = datetime(int(row['FiscalYear']), int(row['FiscalMonth']), 1)
            
            # Create metrics for each business indicator
            metric_definitions = [
                ('Financial Revenue', row['FinancialRevenue'], 'Financial', 'Finance'),
                ('Financial Expenses', row['FinancialExpenses'], 'Financial', 'Finance'),
                ('Sales Revenue', row['SalesRevenue'], 'Sales', 'Sales'),
                ('Order Count', row['OrderCount'], 'Sales', 'Sales'),
                ('Customer Count', row['CustomerCount'], 'Sales', 'Sales'),
                ('Average Order Value', row['AvgOrderValue'], 'Sales', 'Sales'),
                ('Marketing Spend', row['MarketingSpend'], 'Marketing', 'Marketing')
            ]
            
            for name, value, category, department in metric_definitions:
                if pd.notna(value) and value != 0:
                    metrics.append(BusinessMetric(
                        name=name,
                        value=float(value),
                        timestamp=timestamp,
                        category=category,
                        department=department,
                        metadata={
                            'fiscal_year': int(row['FiscalYear']),
                            'fiscal_month': int(row['FiscalMonth'])
                        }
                    ))
        
        return metrics

class CorrelationAnalyzerAgent(BaseAgent):
    """Agent specialized in correlation analysis and pattern detection"""
    
    def __init__(self, project_client: AIProjectClient, db_connection_string: str):
        super().__init__("CorrelationAnalyzerAgent", project_client, db_connection_string)
        self.correlation_threshold = 0.5
        self.significance_level = 0.05
    
    async def analyze(self, business_metrics: List[BusinessMetric]) -> List[CorrelationInsight]:
        """Analyze correlations between business metrics"""
        instructions = """
        You are a Correlation Analyzer Agent specialized in statistical analysis and pattern detection.
        Your responsibilities:
        1. Calculate statistical correlations between business metrics
        2. Identify significant relationships and patterns
        3. Detect time-lag correlations and seasonal patterns
        4. Assess business significance of correlations
        
        Focus on finding actionable insights that can drive business decisions.
        Consider both direct and inverse correlations, and their business implications.
        """
        
        await self.initialize_agent(instructions)
        
        # Group metrics by name for correlation analysis
        metric_groups = self._group_metrics_by_name(business_metrics)
        
        # Find correlations between different metrics
        correlations = await self._find_correlations(metric_groups)
        
        # Analyze time-based patterns
        time_patterns = await self._analyze_time_patterns(metric_groups)
        
        # Generate correlation insights
        insights = await self._generate_insights(correlations, time_patterns)
        
        return insights
    
    def _group_metrics_by_name(self, business_metrics: List[BusinessMetric]) -> Dict[str, List[BusinessMetric]]:
        """Group metrics by name for correlation analysis"""
        groups = {}
        for metric in business_metrics:
            if metric.name not in groups:
                groups[metric.name] = []
            groups[metric.name].append(metric)
        
        # Sort by timestamp
        for name in groups:
            groups[name].sort(key=lambda x: x.timestamp)
        
        return groups
    
    async def _find_correlations(self, metric_groups: Dict[str, List[BusinessMetric]]) -> List[Dict[str, Any]]:
        """Find correlations between different metric types"""
        correlations = []
        metric_names = list(metric_groups.keys())
        
        # Compare each pair of metrics
        for i in range(len(metric_names)):
            for j in range(i + 1, len(metric_names)):
                metric1_name = metric_names[i]
                metric2_name = metric_names[j]
                
                # Get aligned time series data
                aligned_data = self._align_time_series(
                    metric_groups[metric1_name],
                    metric_groups[metric2_name]
                )
                
                if len(aligned_data) >= 3:  # Minimum data points for correlation
                    correlation = await self._calculate_correlation(
                        aligned_data,
                        metric1_name,
                        metric2_name
                    )
                    if correlation:
                        correlations.append(correlation)
        
        return correlations
    
    def _align_time_series(self, metrics1: List[BusinessMetric], metrics2: List[BusinessMetric]) -> List[tuple]:
        """Align two time series by timestamp"""
        aligned = []
        dict1 = {m.timestamp: m.value for m in metrics1}
        dict2 = {m.timestamp: m.value for m in metrics2}
        
        common_timestamps = set(dict1.keys()) & set(dict2.keys())
        
        for timestamp in sorted(common_timestamps):
            aligned.append((dict1[timestamp], dict2[timestamp]))
        
        return aligned
    
    async def _calculate_correlation(self, aligned_data: List[tuple], metric1_name: str, metric2_name: str) -> Optional[Dict[str, Any]]:
        """Calculate correlation between two aligned time series"""
        if len(aligned_data) < 3:
            return None
        
        values1 = [x[0] for x in aligned_data]
        values2 = [x[1] for x in aligned_data]
        
        # Calculate Pearson correlation
        correlation_matrix = np.corrcoef(values1, values2)
        correlation = correlation_matrix[0, 1]
        
        # Calculate p-value (simplified)
        n = len(values1)
        t_stat = correlation * np.sqrt((n - 2) / (1 - correlation**2))
        # Simplified p-value calculation
        p_value = 2 * (1 - abs(t_stat) / (abs(t_stat) + n - 2))
        
        if abs(correlation) >= self.correlation_threshold and p_value <= self.significance_level:
            return {
                'metric1': metric1_name,
                'metric2': metric2_name,
                'correlation': correlation,
                'p_value': p_value,
                'data_points': n,
                'values1': values1,
                'values2': values2
            }
        
        return None
    
    async def _analyze_time_patterns(self, metric_groups: Dict[str, List[BusinessMetric]]) -> Dict[str, Any]:
        """Analyze time-based patterns in metrics"""
        patterns = {}
        
        for metric_name, metrics in metric_groups.items():
            if len(metrics) >= 12:  # Need at least a year of data
                values = [m.value for m in metrics]
                timestamps = [m.timestamp for m in metrics]
                
                # Calculate month-over-month growth
                mom_growth = []
                for i in range(1, len(values)):
                    if values[i-1] != 0:
                        growth = (values[i] - values[i-1]) / values[i-1] * 100
                        mom_growth.append(growth)
                
                patterns[metric_name] = {
                    'trend': 'increasing' if len(mom_growth) > 0 and np.mean(mom_growth) > 0 else 'decreasing',
                    'volatility': np.std(values) if len(values) > 1 else 0,
                    'average_growth': np.mean(mom_growth) if mom_growth else 0,
                    'seasonality_score': self._detect_seasonality(values)
                }
        
        return patterns
    
    def _detect_seasonality(self, values: List[float]) -> float:
        """Simple seasonality detection"""
        if len(values) < 12:
            return 0
        
        # Calculate quarterly averages
        quarters = []
        for i in range(0, len(values), 3):
            quarter_values = values[i:i+3]
            if quarter_values:
                quarters.append(np.mean(quarter_values))
        
        if len(quarters) >= 4:
            return np.std(quarters) / np.mean(quarters) if np.mean(quarters) != 0 else 0
        
        return 0
    
    async def _generate_insights(self, correlations: List[Dict[str, Any]], time_patterns: Dict[str, Any]) -> List[CorrelationInsight]:
        """Generate business insights from correlations and patterns"""
        insights = []
        
        for corr in correlations:
            # Determine business context and recommendations
            business_context = self._interpret_business_context(corr['metric1'], corr['metric2'], corr['correlation'])
            recommendation = self._generate_recommendation(corr['metric1'], corr['metric2'], corr['correlation'])
            impact_score = self._calculate_impact_score(corr)
            confidence_level = self._determine_confidence_level(corr['correlation'], corr['p_value'])
            
            insight = CorrelationInsight(
                correlation_id=f"CORR_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                source_metric=corr['metric1'],
                target_metric=corr['metric2'],
                correlation_strength=corr['correlation'],
                p_value=corr['p_value'],
                business_context=business_context,
                recommendation=recommendation,
                impact_score=impact_score,
                confidence_level=confidence_level,
                discovery_date=datetime.now(),
                data_timeframe=f"{corr['data_points']} months"
            )
            insights.append(insight)
        
        return insights
    
    def _interpret_business_context(self, metric1: str, metric2: str, correlation: float) -> str:
        """Interpret the business context of a correlation"""
        correlation_strength = "strong" if abs(correlation) > 0.7 else "moderate"
        direction = "positive" if correlation > 0 else "negative"
        
        # Business context mappings
        context_map = {
            ('Marketing Spend', 'Sales Revenue'): f"Marketing investments show a {correlation_strength} {direction} impact on sales performance",
            ('Financial Expenses', 'Financial Revenue'): f"Operating expenses demonstrate a {correlation_strength} {direction} relationship with revenue",
            ('Order Count', 'Sales Revenue'): f"Order volume has a {correlation_strength} {direction} correlation with total revenue",
            ('Customer Count', 'Sales Revenue'): f"Customer acquisition shows a {correlation_strength} {direction} impact on revenue growth",
            ('Average Order Value', 'Sales Revenue'): f"Order value optimization has a {correlation_strength} {direction} effect on total sales"
        }
        
        key = (metric1, metric2) if (metric1, metric2) in context_map else (metric2, metric1)
        return context_map.get(key, f"{metric1} and {metric2} show a {correlation_strength} {direction} correlation")
    
    def _generate_recommendation(self, metric1: str, metric2: str, correlation: float) -> str:
        """Generate actionable business recommendations"""
        if correlation > 0.7:
            if 'Marketing Spend' in [metric1, metric2] and 'Revenue' in [metric1, metric2]:
                return "Consider increasing marketing budget to drive revenue growth. Monitor ROI closely."
            elif 'Customer Count' in [metric1, metric2] and 'Revenue' in [metric1, metric2]:
                return "Focus on customer acquisition strategies to boost revenue. Implement retention programs."
            elif 'Order Count' in [metric1, metric2] and 'Revenue' in [metric1, metric2]:
                return "Optimize sales processes to increase order frequency. Consider promotional campaigns."
        elif correlation < -0.7:
            if 'Expenses' in [metric1, metric2] and 'Revenue' in [metric1, metric2]:
                return "Review expense management strategies. Look for cost optimization opportunities."
        
        return "Monitor this relationship closely for strategic planning opportunities."
    
    def _calculate_impact_score(self, correlation_data: Dict[str, Any]) -> float:
        """Calculate business impact score (0-10)"""
        base_score = abs(correlation_data['correlation']) * 10
        
        # Adjust based on metric importance
        important_metrics = ['Sales Revenue', 'Financial Revenue', 'Marketing Spend']
        if correlation_data['metric1'] in important_metrics or correlation_data['metric2'] in important_metrics:
            base_score *= 1.2
        
        return min(10.0, base_score)
    
    def _determine_confidence_level(self, correlation: float, p_value: float) -> str:
        """Determine confidence level in the correlation"""
        if abs(correlation) > 0.8 and p_value < 0.01:
            return "Very High"
        elif abs(correlation) > 0.6 and p_value < 0.05:
            return "High"
        elif abs(correlation) > 0.4 and p_value < 0.1:
            return "Medium"
        else:
            return "Low"

class InsightGeneratorAgent(BaseAgent):
    """Agent responsible for generating business insights and recommendations"""
    
    def __init__(self, project_client: AIProjectClient, db_connection_string: str):
        super().__init__("InsightGeneratorAgent", project_client, db_connection_string)
    
    async def analyze(self, correlation_insights: List[CorrelationInsight]) -> Dict[str, Any]:
        """Generate comprehensive business insights and reports"""
        instructions = """
        You are an Insight Generator Agent specialized in business intelligence and strategic recommendations.
        Your responsibilities:
        1. Synthesize correlation findings into actionable business insights
        2. Generate executive summaries and detailed reports
        3. Prioritize recommendations by business impact
        4. Create stakeholder-specific insights
        
        Focus on translating technical correlations into business value.
        Provide specific, actionable recommendations with clear next steps.
        """
        
        await self.initialize_agent(instructions)
        
        # Generate executive summary
        executive_summary = self._generate_executive_summary(correlation_insights)
        
        # Create detailed insights
        detailed_insights = self._create_detailed_insights(correlation_insights)
        
        # Generate recommendations by priority
        prioritized_recommendations = self._prioritize_recommendations(correlation_insights)
        
        # Create stakeholder reports
        stakeholder_reports = self._create_stakeholder_reports(correlation_insights)
        
        return {
            "executive_summary": executive_summary,
            "detailed_insights": detailed_insights,
            "prioritized_recommendations": prioritized_recommendations,
            "stakeholder_reports": stakeholder_reports,
            "insight_count": len(correlation_insights),
            "high_impact_insights": len([i for i in correlation_insights if i.impact_score >= 7.0]),
            "generation_timestamp": datetime.now().isoformat()
        }
    
    def _generate_executive_summary(self, insights: List[CorrelationInsight]) -> Dict[str, Any]:
        """Generate executive summary of key findings"""
        high_impact = [i for i in insights if i.impact_score >= 7.0]
        revenue_related = [i for i in insights if 'Revenue' in i.source_metric or 'Revenue' in i.target_metric]
        
        summary = {
            "total_correlations_discovered": len(insights),
            "high_impact_findings": len(high_impact),
            "revenue_related_insights": len(revenue_related),
            "average_impact_score": np.mean([i.impact_score for i in insights]),
            "key_findings": []
        }
        
        # Top 3 highest impact insights
        sorted_insights = sorted(insights, key=lambda x: x.impact_score, reverse=True)[:3]
        for insight in sorted_insights:
            summary["key_findings"].append({
                "correlation": f"{insight.source_metric} ↔ {insight.target_metric}",
                "strength": f"{insight.correlation_strength:.3f}",
                "context": insight.business_context,
                "impact_score": insight.impact_score
            })
        
        return summary
    
    def _create_detailed_insights(self, insights: List[CorrelationInsight]) -> List[Dict[str, Any]]:
        """Create detailed insight reports"""
        detailed = []
        
        for insight in insights:
            detailed.append({
                "correlation_id": insight.correlation_id,
                "relationship": f"{insight.source_metric} → {insight.target_metric}",
                "correlation_strength": insight.correlation_strength,
                "statistical_significance": f"p-value: {insight.p_value:.4f}",
                "confidence_level": insight.confidence_level,
                "business_context": insight.business_context,
                "recommendation": insight.recommendation,
                "impact_score": insight.impact_score,
                "timeframe": insight.data_timeframe,
                "discovery_date": insight.discovery_date.isoformat()
            })
        
        return sorted(detailed, key=lambda x: x["impact_score"], reverse=True)
    
    def _prioritize_recommendations(self, insights: List[CorrelationInsight]) -> Dict[str, List[Dict[str, Any]]]:
        """Prioritize recommendations by impact and urgency"""
        high_priority = []
        medium_priority = []
        low_priority = []
        
        for insight in insights:
            rec = {
                "recommendation": insight.recommendation,
                "correlation": f"{insight.source_metric} ↔ {insight.target_metric}",
                "impact_score": insight.impact_score,
                "confidence": insight.confidence_level,
                "business_context": insight.business_context
            }
            
            if insight.impact_score >= 8.0 and insight.confidence_level in ["High", "Very High"]:
                high_priority.append(rec)
            elif insight.impact_score >= 6.0:
                medium_priority.append(rec)
            else:
                low_priority.append(rec)
        
        return {
            "high_priority": sorted(high_priority, key=lambda x: x["impact_score"], reverse=True),
            "medium_priority": sorted(medium_priority, key=lambda x: x["impact_score"], reverse=True),
            "low_priority": sorted(low_priority, key=lambda x: x["impact_score"], reverse=True)
        }
    
    def _create_stakeholder_reports(self, insights: List[CorrelationInsight]) -> Dict[str, Dict[str, Any]]:
        """Create role-specific stakeholder reports"""
        
        # CEO/Executive Report
        ceo_insights = [i for i in insights if i.impact_score >= 7.0]
        ceo_report = {
            "title": "Executive Strategic Insights",
            "key_findings": len(ceo_insights),
            "revenue_impact": len([i for i in ceo_insights if 'Revenue' in i.source_metric or 'Revenue' in i.target_metric]),
            "top_priorities": [
                {
                    "insight": f"{i.source_metric} ↔ {i.target_metric}",
                    "business_value": i.business_context,
                    "recommended_action": i.recommendation
                }
                for i in sorted(ceo_insights, key=lambda x: x.impact_score, reverse=True)[:3]
            ]
        }
        
        # CFO Report
        financial_insights = [i for i in insights if 'Financial' in i.source_metric or 'Financial' in i.target_metric]
        cfo_report = {
            "title": "Financial Performance Correlations",
            "financial_correlations": len(financial_insights),
            "expense_insights": len([i for i in financial_insights if 'Expense' in i.source_metric or 'Expense' in i.target_metric]),
            "revenue_insights": len([i for i in financial_insights if 'Revenue' in i.source_metric or 'Revenue' in i.target_metric]),
            "recommendations": [i.recommendation for i in financial_insights]
        }
        
        # Sales Director Report
        sales_insights = [i for i in insights if 'Sales' in i.source_metric or 'Sales' in i.target_metric or 'Order' in i.source_metric or 'Customer' in i.source_metric]
        sales_report = {
            "title": "Sales Performance Analytics",
            "sales_correlations": len(sales_insights),
            "customer_insights": len([i for i in sales_insights if 'Customer' in i.source_metric or 'Customer' in i.target_metric]),
            "order_insights": len([i for i in sales_insights if 'Order' in i.source_metric or 'Order' in i.target_metric]),
            "action_items": [
                {
                    "correlation": f"{i.source_metric} → {i.target_metric}",
                    "strength": f"{i.correlation_strength:.3f}",
                    "action": i.recommendation
                }
                for i in sales_insights
            ]
        }
        
        # Marketing Director Report
        marketing_insights = [i for i in insights if 'Marketing' in i.source_metric or 'Marketing' in i.target_metric]
        marketing_report = {
            "title": "Marketing ROI and Impact Analysis",
            "marketing_correlations": len(marketing_insights),
            "roi_insights": [
                {
                    "correlation": f"{i.source_metric} → {i.target_metric}",
                    "impact": i.business_context,
                    "optimization": i.recommendation
                }
                for i in marketing_insights
            ]
        }
        
        return {
            "ceo": ceo_report,
            "cfo": cfo_report,
            "sales_director": sales_report,
            "marketing_director": marketing_report
        }

# Example usage and orchestration
async def main():
    """Main orchestration function"""
    # Initialize Azure AI Project Client
    credential = DefaultAzureCredential()
    project_client = AIProjectClient(
        endpoint="https://your-ai-project.openai.azure.com/",
        credential=credential
    )
    
    # Database connection string (using managed identity)
    db_connection_string = "mssql+pyodbc://your-server.database.windows.net/CorrelateAI?driver=ODBC+Driver+17+for+SQL+Server&Authentication=ActiveDirectoryMsi"
    
    try:
        # Initialize agents
        data_explorer = DataExplorerAgent(project_client, db_connection_string)
        correlation_analyzer = CorrelationAnalyzerAgent(project_client, db_connection_string)
        insight_generator = InsightGeneratorAgent(project_client, db_connection_string)
        
        logger.info("Starting CorrelateAI Enterprise analysis...")
        
        # Step 1: Data exploration
        logger.info("Phase 1: Data exploration and profiling")
        exploration_results = await data_explorer.analyze()
        business_metrics = exploration_results["business_metrics"]
        
        # Step 2: Correlation analysis
        logger.info("Phase 2: Correlation analysis")
        correlation_insights = await correlation_analyzer.analyze(business_metrics)
        
        # Step 3: Insight generation
        logger.info("Phase 3: Business insight generation")
        final_insights = await insight_generator.analyze(correlation_insights)
        
        # Output results
        print("\n" + "="*60)
        print("CORRELATEAI ENTERPRISE - ANALYSIS COMPLETE")
        print("="*60)
        print(f"Total correlations discovered: {len(correlation_insights)}")
        print(f"High-impact insights: {final_insights['insight_count']}")
        print(f"Executive recommendations: {len(final_insights['prioritized_recommendations']['high_priority'])}")
        
        # Save results to database or file
        with open('correlation_analysis_results.json', 'w') as f:
            json.dump({
                "exploration": exploration_results,
                "correlations": [
                    {
                        "correlation_id": c.correlation_id,
                        "source_metric": c.source_metric,
                        "target_metric": c.target_metric,
                        "correlation_strength": c.correlation_strength,
                        "business_context": c.business_context,
                        "recommendation": c.recommendation,
                        "impact_score": c.impact_score
                    } for c in correlation_insights
                ],
                "insights": final_insights
            }, f, indent=2, default=str)
        
        logger.info("Analysis results saved to correlation_analysis_results.json")
        
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(main())