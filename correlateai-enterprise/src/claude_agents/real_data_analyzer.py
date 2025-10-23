"""
CorrelateAI Enterprise - Claude-Based Real Data Analysis
Practical implementation for analyzing local MSSQL sales and invoicing data using Claude
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
import json
import pandas as pd
import numpy as np
from dataclasses import dataclass, asdict
import pyodbc
from sqlalchemy import create_engine, text
import anthropic
import os
from pathlib import Path

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class SalesInsight:
    """Represents a sales/invoicing insight discovered by Claude"""
    insight_id: str
    insight_type: str  # 'correlation', 'trend', 'anomaly', 'opportunity'
    title: str
    description: str
    data_evidence: Dict[str, Any]
    business_impact: str
    recommended_actions: List[str]
    confidence_score: float
    discovery_date: datetime
    affected_metrics: List[str]

@dataclass
class DatabaseAnalysis:
    """Results of database schema and data analysis"""
    table_info: Dict[str, Any]
    data_quality: Dict[str, float]
    key_metrics: List[str]
    time_ranges: Dict[str, Any]
    relationships: List[Dict[str, str]]

class ClaudeDataAgent:
    """Claude-powered agent for analyzing sales and invoicing data"""
    
    def __init__(self, db_connection_string: str, claude_api_key: str):
        self.db_connection_string = db_connection_string
        self.engine = create_engine(db_connection_string)
        self.claude_client = anthropic.Anthropic(api_key=claude_api_key)
        self.insights_cache = []
        
    async def analyze_database_structure(self) -> DatabaseAnalysis:
        """Analyze the database structure to understand available data"""
        logger.info("Analyzing database structure...")
        
        # Get table information
        table_info_query = """
        SELECT 
            t.TABLE_SCHEMA,
            t.TABLE_NAME,
            c.COLUMN_NAME,
            c.DATA_TYPE,
            c.IS_NULLABLE,
            c.CHARACTER_MAXIMUM_LENGTH
        FROM INFORMATION_SCHEMA.TABLES t
        LEFT JOIN INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME 
            AND t.TABLE_SCHEMA = c.TABLE_SCHEMA
        WHERE t.TABLE_TYPE = 'BASE TABLE'
            AND t.TABLE_SCHEMA NOT IN ('sys', 'INFORMATION_SCHEMA')
        ORDER BY t.TABLE_SCHEMA, t.TABLE_NAME, c.ORDINAL_POSITION
        """
        
        with self.engine.connect() as conn:
            df = pd.read_sql_query(text(table_info_query), conn)
        
        # Organize table information
        table_info = {}
        for _, row in df.iterrows():
            schema = row['TABLE_SCHEMA']
            table = row['TABLE_NAME']
            
            if schema not in table_info:
                table_info[schema] = {}
            if table not in table_info[schema]:
                table_info[schema][table] = {'columns': [], 'row_count': 0}
            
            if pd.notna(row['COLUMN_NAME']):
                table_info[schema][table]['columns'].append({
                    'name': row['COLUMN_NAME'],
                    'type': row['DATA_TYPE'],
                    'nullable': row['IS_NULLABLE'] == 'YES'
                })
        
        # Get row counts for each table
        for schema, tables in table_info.items():
            for table_name in tables.keys():
                try:
                    count_query = f"SELECT COUNT(*) as row_count FROM [{schema}].[{table_name}]"
                    with self.engine.connect() as conn:
                        result = pd.read_sql_query(text(count_query), conn)
                        table_info[schema][table_name]['row_count'] = int(result.iloc[0]['row_count'])
                except Exception as e:
                    logger.warning(f"Could not get row count for {schema}.{table_name}: {e}")
                    table_info[schema][table_name]['row_count'] = 0
        
        # Identify key business metrics
        key_metrics = self._identify_key_metrics(table_info)
        
        # Analyze data quality
        data_quality = await self._analyze_data_quality(table_info)
        
        # Get time ranges
        time_ranges = await self._get_time_ranges(table_info)
        
        # Identify relationships
        relationships = self._identify_relationships(table_info)
        
        return DatabaseAnalysis(
            table_info=table_info,
            data_quality=data_quality,
            key_metrics=key_metrics,
            time_ranges=time_ranges,
            relationships=relationships
        )
    
    def _identify_key_metrics(self, table_info: Dict[str, Any]) -> List[str]:
        """Identify potential business metrics from table structure"""
        metrics = []
        
        # Common business metric patterns
        metric_patterns = [
            'amount', 'total', 'quantity', 'price', 'cost', 'revenue', 'sales',
            'discount', 'tax', 'profit', 'margin', 'commission', 'fee'
        ]
        
        for schema, tables in table_info.items():
            for table_name, table_data in tables.items():
                for column in table_data['columns']:
                    col_name = column['name'].lower()
                    col_type = column['type'].lower()
                    
                    # Look for numeric columns with business-relevant names
                    if any(pattern in col_name for pattern in metric_patterns):
                        if any(num_type in col_type for num_type in ['decimal', 'float', 'money', 'numeric', 'int']):
                            metrics.append(f"{schema}.{table_name}.{column['name']}")
        
        return metrics
    
    async def _analyze_data_quality(self, table_info: Dict[str, Any]) -> Dict[str, float]:
        """Analyze data quality for key tables"""
        quality_scores = {}
        
        for schema, tables in table_info.items():
            for table_name, table_data in tables.items():
                if table_data['row_count'] > 0:
                    try:
                        # Sample data quality checks
                        quality_query = f"""
                        SELECT 
                            COUNT(*) as total_rows,
                            COUNT(DISTINCT *) as unique_rows
                        FROM [{schema}].[{table_name}]
                        """
                        
                        with self.engine.connect() as conn:
                            result = pd.read_sql_query(text(quality_query), conn)
                            
                        total_rows = result.iloc[0]['total_rows']
                        unique_rows = result.iloc[0]['unique_rows']
                        
                        # Simple quality score based on uniqueness
                        quality_score = unique_rows / total_rows if total_rows > 0 else 0
                        quality_scores[f"{schema}.{table_name}"] = quality_score
                        
                    except Exception as e:
                        logger.warning(f"Could not analyze quality for {schema}.{table_name}: {e}")
                        quality_scores[f"{schema}.{table_name}"] = 0.5
        
        return quality_scores
    
    async def _get_time_ranges(self, table_info: Dict[str, Any]) -> Dict[str, Any]:
        """Get time ranges for tables with date columns"""
        time_ranges = {}
        
        for schema, tables in table_info.items():
            for table_name, table_data in tables.items():
                # Find date columns
                date_columns = [
                    col['name'] for col in table_data['columns'] 
                    if any(date_type in col['type'].lower() for date_type in ['date', 'time'])
                ]
                
                if date_columns and table_data['row_count'] > 0:
                    try:
                        date_col = date_columns[0]  # Use first date column
                        range_query = f"""
                        SELECT 
                            MIN([{date_col}]) as earliest_date,
                            MAX([{date_col}]) as latest_date,
                            COUNT(*) as records_count
                        FROM [{schema}].[{table_name}]
                        WHERE [{date_col}] IS NOT NULL
                        """
                        
                        with self.engine.connect() as conn:
                            result = pd.read_sql_query(text(range_query), conn)
                            
                        if not result.empty:
                            time_ranges[f"{schema}.{table_name}"] = {
                                'earliest': result.iloc[0]['earliest_date'],
                                'latest': result.iloc[0]['latest_date'],
                                'records': int(result.iloc[0]['records_count']),
                                'date_column': date_col
                            }
                    except Exception as e:
                        logger.warning(f"Could not get time range for {schema}.{table_name}: {e}")
        
        return time_ranges
    
    def _identify_relationships(self, table_info: Dict[str, Any]) -> List[Dict[str, str]]:
        """Identify potential relationships between tables"""
        relationships = []
        
        # Look for foreign key patterns
        for schema, tables in table_info.items():
            for table_name, table_data in tables.items():
                for column in table_data['columns']:
                    col_name = column['name'].lower()
                    
                    # Look for ID columns that might reference other tables
                    if col_name.endswith('id') and col_name != 'id':
                        # Extract potential referenced table name
                        referenced_table = col_name[:-2]  # Remove 'id' suffix
                        
                        # Check if referenced table exists
                        for other_table_name in tables.keys():
                            if referenced_table in other_table_name.lower():
                                relationships.append({
                                    'from_table': f"{schema}.{table_name}",
                                    'from_column': column['name'],
                                    'to_table': f"{schema}.{other_table_name}",
                                    'relationship_type': 'foreign_key'
                                })
        
        return relationships
    
    async def discover_sales_insights(self, analysis: DatabaseAnalysis) -> List[SalesInsight]:
        """Use Claude to discover insights from sales and invoicing data"""
        logger.info("Discovering sales insights with Claude...")
        
        insights = []
        
        # Get sample data for analysis
        sample_data = await self._get_sample_data(analysis)
        
        # Analyze with Claude
        claude_insights = await self._analyze_with_claude(analysis, sample_data)
        
        # Convert Claude insights to structured format
        for insight_data in claude_insights:
            insight = SalesInsight(
                insight_id=f"insight_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{len(insights)}",
                insight_type=insight_data.get('type', 'correlation'),
                title=insight_data.get('title', 'Business Insight'),
                description=insight_data.get('description', ''),
                data_evidence=insight_data.get('evidence', {}),
                business_impact=insight_data.get('impact', ''),
                recommended_actions=insight_data.get('actions', []),
                confidence_score=insight_data.get('confidence', 0.7),
                discovery_date=datetime.now(),
                affected_metrics=insight_data.get('metrics', [])
            )
            insights.append(insight)
        
        self.insights_cache.extend(insights)
        return insights
    
    async def _get_sample_data(self, analysis: DatabaseAnalysis) -> Dict[str, pd.DataFrame]:
        """Get sample data from key tables for Claude analysis"""
        sample_data = {}
        
        # Prioritize tables with high row counts and good quality
        table_priorities = []
        for table_name, quality in analysis.data_quality.items():
            schema, table = table_name.split('.')
            row_count = analysis.table_info[schema][table]['row_count']
            priority_score = quality * np.log(row_count + 1)
            table_priorities.append((table_name, priority_score))
        
        # Sort by priority and take top tables
        table_priorities.sort(key=lambda x: x[1], reverse=True)
        top_tables = [t[0] for t in table_priorities[:5]]  # Top 5 tables
        
        for table_name in top_tables:
            try:
                schema, table = table_name.split('.')
                
                # Get sample of data (last 1000 records if there's a date column)
                time_info = analysis.time_ranges.get(table_name)
                if time_info:
                    date_col = time_info['date_column']
                    sample_query = f"""
                    SELECT TOP 1000 * 
                    FROM [{schema}].[{table}] 
                    ORDER BY [{date_col}] DESC
                    """
                else:
                    sample_query = f"SELECT TOP 1000 * FROM [{schema}].[{table}]"
                
                with self.engine.connect() as conn:
                    df = pd.read_sql_query(text(sample_query), conn)
                    sample_data[table_name] = df
                    
            except Exception as e:
                logger.warning(f"Could not get sample data for {table_name}: {e}")
        
        return sample_data
    
    async def _analyze_with_claude(self, analysis: DatabaseAnalysis, sample_data: Dict[str, pd.DataFrame]) -> List[Dict[str, Any]]:
        """Analyze data with Claude to discover insights"""
        
        # Prepare context for Claude
        context = self._prepare_claude_context(analysis, sample_data)
        
        prompt = f"""
        You are a business intelligence analyst specializing in sales and invoicing data analysis. 
        
        I have provided you with information about a business database containing sales and invoicing data:
        
        {context}
        
        Please analyze this data and identify:
        
        1. **Key Correlations**: Relationships between different metrics (sales amounts, quantities, customer patterns, etc.)
        2. **Trends**: Temporal patterns in the data (seasonal trends, growth patterns, etc.)
        3. **Anomalies**: Unusual patterns that might indicate opportunities or issues
        4. **Business Opportunities**: Actionable insights that could improve revenue or efficiency
        
        For each insight, provide:
        - Type (correlation/trend/anomaly/opportunity)
        - Clear title and description
        - Evidence from the data
        - Business impact assessment
        - Specific recommended actions
        - Confidence level (0.0-1.0)
        - Affected metrics
        
        Format your response as a JSON array of insights. Be specific and actionable.
        Focus on insights that would be valuable to executives, sales managers, and financial analysts.
        """
        
        try:
            response = self.claude_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Parse Claude's response
            response_text = response.content[0].text
            
            # Extract JSON from response
            try:
                # Try to find JSON in the response
                start_idx = response_text.find('[')
                end_idx = response_text.rfind(']') + 1
                
                if start_idx != -1 and end_idx != -1:
                    json_str = response_text[start_idx:end_idx]
                    insights = json.loads(json_str)
                    return insights
                else:
                    # If no JSON found, create insights from text
                    return self._parse_text_insights(response_text)
                    
            except json.JSONDecodeError:
                logger.warning("Could not parse Claude response as JSON, using text parsing")
                return self._parse_text_insights(response_text)
                
        except Exception as e:
            logger.error(f"Error analyzing with Claude: {e}")
            return []
    
    def _prepare_claude_context(self, analysis: DatabaseAnalysis, sample_data: Dict[str, pd.DataFrame]) -> str:
        """Prepare context information for Claude"""
        
        context_parts = []
        
        # Database structure summary
        context_parts.append("DATABASE STRUCTURE:")
        for schema, tables in analysis.table_info.items():
            context_parts.append(f"\nSchema: {schema}")
            for table_name, table_data in tables.items():
                context_parts.append(f"  Table: {table_name} ({table_data['row_count']} records)")
                key_columns = [col['name'] for col in table_data['columns'][:5]]  # Top 5 columns
                context_parts.append(f"    Key columns: {', '.join(key_columns)}")
        
        # Key metrics
        context_parts.append(f"\nKEY BUSINESS METRICS:\n{chr(10).join(analysis.key_metrics[:10])}")
        
        # Time ranges
        context_parts.append("\nDATA TIME RANGES:")
        for table, time_info in analysis.time_ranges.items():
            context_parts.append(f"  {table}: {time_info['earliest']} to {time_info['latest']} ({time_info['records']} records)")
        
        # Sample data statistics
        context_parts.append("\nSAMPLE DATA STATISTICS:")
        for table_name, df in sample_data.items():
            context_parts.append(f"\n{table_name}:")
            context_parts.append(f"  Rows: {len(df)}, Columns: {len(df.columns)}")
            
            # Numeric columns summary
            numeric_cols = df.select_dtypes(include=[np.number]).columns
            if len(numeric_cols) > 0:
                context_parts.append("  Numeric columns summary:")
                for col in numeric_cols[:5]:  # Top 5 numeric columns
                    stats = df[col].describe()
                    context_parts.append(f"    {col}: min={stats['min']:.2f}, max={stats['max']:.2f}, mean={stats['mean']:.2f}")
        
        return "\n".join(context_parts)
    
    def _parse_text_insights(self, text: str) -> List[Dict[str, Any]]:
        """Parse insights from Claude's text response when JSON parsing fails"""
        insights = []
        
        # Simple text parsing to extract insights
        lines = text.split('\n')
        current_insight = {}
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Look for insight markers
            if any(keyword in line.lower() for keyword in ['correlation', 'trend', 'anomaly', 'opportunity']):
                if current_insight:
                    insights.append(current_insight)
                    current_insight = {}
                
                current_insight['title'] = line
                current_insight['type'] = 'correlation'
                current_insight['description'] = ''
                current_insight['evidence'] = {}
                current_insight['impact'] = ''
                current_insight['actions'] = []
                current_insight['confidence'] = 0.7
                current_insight['metrics'] = []
            
            elif current_insight:
                # Add to description
                current_insight['description'] += line + ' '
        
        # Add last insight
        if current_insight:
            insights.append(current_insight)
        
        # Ensure we have at least one insight
        if not insights:
            insights.append({
                'title': 'Sales Data Analysis Complete',
                'type': 'opportunity',
                'description': 'Analysis of sales and invoicing data has been completed. Review the data structure and metrics for further insights.',
                'evidence': {},
                'impact': 'Foundation for ongoing business intelligence analysis',
                'actions': ['Review key metrics regularly', 'Set up automated reporting', 'Monitor trends'],
                'confidence': 0.8,
                'metrics': []
            })
        
        return insights
    
    async def generate_executive_report(self, insights: List[SalesInsight]) -> Dict[str, Any]:
        """Generate an executive report from discovered insights"""
        
        # Categorize insights
        high_impact = [i for i in insights if i.confidence_score >= 0.8]
        correlations = [i for i in insights if i.insight_type == 'correlation']
        trends = [i for i in insights if i.insight_type == 'trend']
        opportunities = [i for i in insights if i.insight_type == 'opportunity']
        
        # Generate summary statistics
        total_revenue_mentions = sum(1 for i in insights if any('revenue' in metric.lower() for metric in i.affected_metrics))
        
        report = {
            "executive_summary": {
                "total_insights": len(insights),
                "high_confidence_insights": len(high_impact),
                "correlations_found": len(correlations),
                "trends_identified": len(trends),
                "opportunities_discovered": len(opportunities),
                "revenue_related_insights": total_revenue_mentions
            },
            "key_findings": [
                {
                    "title": insight.title,
                    "impact": insight.business_impact,
                    "confidence": insight.confidence_score,
                    "recommended_actions": insight.recommended_actions
                }
                for insight in sorted(insights, key=lambda x: x.confidence_score, reverse=True)[:5]
            ],
            "recommended_actions": {
                "immediate": [],
                "short_term": [],
                "long_term": []
            },
            "next_steps": [
                "Implement recommended actions from high-confidence insights",
                "Set up automated monitoring for identified trends",
                "Establish regular correlation analysis schedule",
                "Review and validate insights with business stakeholders"
            ],
            "generated_at": datetime.now().isoformat()
        }
        
        # Categorize actions by timeline
        for insight in high_impact:
            for action in insight.recommended_actions:
                if any(word in action.lower() for word in ['immediate', 'urgent', 'now']):
                    report["recommended_actions"]["immediate"].append(action)
                elif any(word in action.lower() for word in ['week', 'month', 'quarter']):
                    report["recommended_actions"]["short_term"].append(action)
                else:
                    report["recommended_actions"]["long_term"].append(action)
        
        return report
    
    async def save_insights(self, insights: List[SalesInsight], output_path: str = "correlation_insights.json"):
        """Save insights to file"""
        insights_data = [asdict(insight) for insight in insights]
        
        # Convert datetime objects to strings
        for insight in insights_data:
            insight['discovery_date'] = insight['discovery_date'].isoformat()
        
        with open(output_path, 'w') as f:
            json.dump(insights_data, f, indent=2, default=str)
        
        logger.info(f"Saved {len(insights)} insights to {output_path}")

# Main orchestration class
class SalesDataAnalyzer:
    """Main class for orchestrating sales data analysis"""
    
    def __init__(self, db_connection_string: str, claude_api_key: str):
        self.claude_agent = ClaudeDataAgent(db_connection_string, claude_api_key)
        
    async def run_full_analysis(self) -> Dict[str, Any]:
        """Run complete sales data analysis"""
        logger.info("Starting comprehensive sales data analysis...")
        
        try:
            # Step 1: Analyze database structure
            logger.info("Step 1: Analyzing database structure")
            db_analysis = await self.claude_agent.analyze_database_structure()
            
            # Step 2: Discover insights with Claude
            logger.info("Step 2: Discovering insights with Claude")
            insights = await self.claude_agent.discover_sales_insights(db_analysis)
            
            # Step 3: Generate executive report
            logger.info("Step 3: Generating executive report")
            executive_report = await self.claude_agent.generate_executive_report(insights)
            
            # Step 4: Save results
            logger.info("Step 4: Saving results")
            await self.claude_agent.save_insights(insights)
            
            # Compile final results
            results = {
                "database_analysis": {
                    "tables_analyzed": len(db_analysis.table_info),
                    "total_records": sum(
                        table_data['row_count'] 
                        for schema in db_analysis.table_info.values() 
                        for table_data in schema.values()
                    ),
                    "key_metrics_found": len(db_analysis.key_metrics),
                    "time_range_coverage": db_analysis.time_ranges
                },
                "insights_discovered": len(insights),
                "executive_report": executive_report,
                "detailed_insights": [asdict(insight) for insight in insights],
                "analysis_completed_at": datetime.now().isoformat()
            }
            
            # Save complete analysis
            with open('complete_sales_analysis.json', 'w') as f:
                json.dump(results, f, indent=2, default=str)
            
            logger.info("Analysis completed successfully!")
            return results
            
        except Exception as e:
            logger.error(f"Analysis failed: {e}")
            raise

# Example usage function
async def analyze_sales_database(connection_string: str, claude_api_key: str):
    """Example function to analyze a sales database"""
    
    analyzer = SalesDataAnalyzer(connection_string, claude_api_key)
    results = await analyzer.run_full_analysis()
    
    print("\n" + "="*60)
    print("SALES DATA ANALYSIS RESULTS")
    print("="*60)
    print(f"Tables analyzed: {results['database_analysis']['tables_analyzed']}")
    print(f"Total records: {results['database_analysis']['total_records']:,}")
    print(f"Insights discovered: {results['insights_discovered']}")
    print(f"High-confidence insights: {results['executive_report']['executive_summary']['high_confidence_insights']}")
    print("\nTop recommendations:")
    for i, finding in enumerate(results['executive_report']['key_findings'][:3], 1):
        print(f"{i}. {finding['title']}")
        print(f"   Impact: {finding['impact']}")
        print(f"   Confidence: {finding['confidence']:.1%}")
        print()
    
    return results

if __name__ == "__main__":
    # Example configuration
    # Replace with your actual database connection string and Claude API key
    
    # Example connection string for local SQL Server
    connection_string = "mssql+pyodbc://localhost/YourSalesDB?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
    
    # Get Claude API key from environment
    claude_api_key = os.getenv('CLAUDE_API_KEY')
    
    if not claude_api_key:
        print("Please set CLAUDE_API_KEY environment variable")
        exit(1)
    
    # Run analysis
    asyncio.run(analyze_sales_database(connection_string, claude_api_key))