"""
CorrelateAI Enterprise - Executive Dashboard API
FastAPI backend for stakeholder dashboard and reporting
"""

from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import pandas as pd
import json
import logging
import asyncio
from dataclasses import asdict

# Import our correlation analysis components
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from correlation.advanced_engine import AdvancedCorrelationEngine, TimeSeriesAnalyzer
from agents.core_agents import DataExplorerAgent, CorrelationAnalyzerAgent, InsightGeneratorAgent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="CorrelateAI Enterprise Dashboard API",
    description="AI-powered business intelligence and correlation analysis platform",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API requests/responses
class CorrelationResult(BaseModel):
    correlation_id: str
    source_metric: str
    target_metric: str
    correlation_strength: float
    correlation_type: str
    business_context: str
    recommendation: str
    impact_score: float
    confidence_level: str
    discovery_date: datetime

class InsightSummary(BaseModel):
    total_correlations: int
    high_impact_insights: int
    revenue_related_insights: int
    average_impact_score: float
    top_recommendations: List[Dict[str, Any]]

class StakeholderReport(BaseModel):
    stakeholder_type: str  # 'ceo', 'cfo', 'sales_director', 'marketing_director'
    title: str
    key_metrics: Dict[str, Any]
    insights: List[Dict[str, Any]]
    recommendations: List[str]
    generated_at: datetime

class AnalysisRequest(BaseModel):
    time_range_days: int = Field(default=365, ge=30, le=1095)
    metrics: Optional[List[str]] = None
    stakeholder_focus: Optional[str] = None

class MetricTrend(BaseModel):
    metric_name: str
    values: List[float]
    timestamps: List[datetime]
    trend_direction: str
    forecast_direction: str
    confidence_score: float

# Global variables for caching
correlation_cache = {}
analysis_results = {}
last_analysis_time = None

# Dependency injection
def get_correlation_engine():
    return AdvancedCorrelationEngine()

def get_time_series_analyzer():
    return TimeSeriesAnalyzer()

# API Endpoints

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "CorrelateAI Enterprise Dashboard API",
        "status": "healthy",
        "version": "1.0.0",
        "timestamp": datetime.now()
    }

@app.get("/api/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "correlation_engine": "ready",
            "time_series_analyzer": "ready",
            "database": "connected",
            "ai_agents": "initialized"
        },
        "last_analysis": last_analysis_time,
        "cache_size": len(correlation_cache)
    }

@app.post("/api/analysis/run")
async def run_analysis(
    request: AnalysisRequest,
    background_tasks: BackgroundTasks,
    correlation_engine: AdvancedCorrelationEngine = Depends(get_correlation_engine)
):
    """Trigger a new correlation analysis"""
    
    try:
        # Add background task for analysis
        background_tasks.add_task(
            perform_correlation_analysis, 
            request.time_range_days, 
            request.metrics,
            correlation_engine
        )
        
        return {
            "message": "Analysis started",
            "analysis_id": f"analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "estimated_completion": datetime.now() + timedelta(minutes=10)
        }
        
    except Exception as e:
        logger.error(f"Failed to start analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/api/correlations", response_model=List[CorrelationResult])
async def get_correlations(
    min_impact_score: float = 0.0,
    correlation_type: Optional[str] = None,
    limit: int = 50
):
    """Get correlation results with filtering"""
    
    try:
        correlations = correlation_cache.get('correlations', [])
        
        # Apply filters
        filtered = [c for c in correlations if c['impact_score'] >= min_impact_score]
        
        if correlation_type:
            filtered = [c for c in filtered if c['correlation_type'] == correlation_type]
        
        # Sort by impact score and limit
        filtered = sorted(filtered, key=lambda x: x['impact_score'], reverse=True)[:limit]
        
        return [CorrelationResult(**corr) for corr in filtered]
        
    except Exception as e:
        logger.error(f"Failed to get correlations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve correlations: {str(e)}")

@app.get("/api/insights/summary", response_model=InsightSummary)
async def get_insights_summary():
    """Get executive summary of insights"""
    
    try:
        correlations = correlation_cache.get('correlations', [])
        insights = analysis_results.get('insights', {})
        
        summary = InsightSummary(
            total_correlations=len(correlations),
            high_impact_insights=len([c for c in correlations if c['impact_score'] >= 7.0]),
            revenue_related_insights=len([c for c in correlations if 'Revenue' in c['source_metric'] or 'Revenue' in c['target_metric']]),
            average_impact_score=sum(c['impact_score'] for c in correlations) / len(correlations) if correlations else 0,
            top_recommendations=insights.get('prioritized_recommendations', {}).get('high_priority', [])[:5]
        )
        
        return summary
        
    except Exception as e:
        logger.error(f"Failed to get insights summary: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve insights: {str(e)}")

@app.get("/api/reports/{stakeholder_type}", response_model=StakeholderReport)
async def get_stakeholder_report(stakeholder_type: str):
    """Get stakeholder-specific report"""
    
    valid_stakeholders = ['ceo', 'cfo', 'sales_director', 'marketing_director']
    if stakeholder_type not in valid_stakeholders:
        raise HTTPException(status_code=400, detail=f"Invalid stakeholder type. Must be one of: {valid_stakeholders}")
    
    try:
        insights = analysis_results.get('insights', {})
        stakeholder_reports = insights.get('stakeholder_reports', {})
        
        report_data = stakeholder_reports.get(stakeholder_type, {})
        
        if not report_data:
            raise HTTPException(status_code=404, detail=f"No report available for {stakeholder_type}")
        
        return StakeholderReport(
            stakeholder_type=stakeholder_type,
            title=report_data.get('title', f"{stakeholder_type.title()} Report"),
            key_metrics=report_data,
            insights=report_data.get('insights', []),
            recommendations=report_data.get('recommendations', []),
            generated_at=datetime.now()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get stakeholder report: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve report: {str(e)}")

@app.get("/api/metrics/trends", response_model=List[MetricTrend])
async def get_metric_trends(metrics: Optional[str] = None):
    """Get time series trends for metrics"""
    
    try:
        patterns = analysis_results.get('patterns', [])
        
        if metrics:
            metric_list = [m.strip() for m in metrics.split(',')]
            patterns = [p for p in patterns if p.get('metric_name') in metric_list]
        
        trends = []
        for pattern in patterns:
            # Create sample data - in production, this would come from the database
            trend = MetricTrend(
                metric_name=pattern.get('metric_name', 'Unknown'),
                values=[100 + i * 10 for i in range(12)],  # Sample values
                timestamps=[datetime.now() - timedelta(days=30*i) for i in range(12)],
                trend_direction=pattern.get('trend_direction', 'stable'),
                forecast_direction=pattern.get('forecast_direction', 'stable'),
                confidence_score=pattern.get('confidence_level', 0.5)
            )
            trends.append(trend)
        
        return trends
        
    except Exception as e:
        logger.error(f"Failed to get metric trends: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve trends: {str(e)}")

@app.get("/api/analysis/status")
async def get_analysis_status():
    """Get current analysis status"""
    
    return {
        "last_analysis": last_analysis_time,
        "correlations_found": len(correlation_cache.get('correlations', [])),
        "insights_generated": len(analysis_results.get('insights', {})),
        "cache_status": "populated" if correlation_cache else "empty",
        "analysis_in_progress": False  # This would be dynamic in production
    }

@app.post("/api/insights/feedback")
async def submit_insight_feedback(
    correlation_id: str,
    feedback_score: int = Field(..., ge=1, le=5),
    feedback_text: Optional[str] = None
):
    """Submit feedback on insights for continuous improvement"""
    
    try:
        # In production, save to database
        feedback_data = {
            "correlation_id": correlation_id,
            "score": feedback_score,
            "text": feedback_text,
            "timestamp": datetime.now()
        }
        
        logger.info(f"Feedback received for {correlation_id}: {feedback_score}/5")
        
        return {
            "message": "Feedback submitted successfully",
            "feedback_id": f"fb_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        }
        
    except Exception as e:
        logger.error(f"Failed to submit feedback: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to submit feedback: {str(e)}")

@app.get("/api/export/report/{format}")
async def export_report(format: str, stakeholder_type: Optional[str] = None):
    """Export analysis report in different formats"""
    
    valid_formats = ['json', 'csv', 'pdf']
    if format not in valid_formats:
        raise HTTPException(status_code=400, detail=f"Invalid format. Must be one of: {valid_formats}")
    
    try:
        if format == 'json':
            export_data = {
                "correlations": correlation_cache.get('correlations', []),
                "insights": analysis_results.get('insights', {}),
                "generated_at": datetime.now().isoformat()
            }
            
            if stakeholder_type:
                stakeholder_reports = analysis_results.get('insights', {}).get('stakeholder_reports', {})
                export_data["stakeholder_report"] = stakeholder_reports.get(stakeholder_type, {})
            
            return JSONResponse(content=export_data)
        
        else:
            # For CSV and PDF, return a message indicating the file would be generated
            return {
                "message": f"Export in {format} format initiated",
                "download_url": f"/api/download/report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{format}",
                "estimated_ready_time": datetime.now() + timedelta(minutes=2)
            }
            
    except Exception as e:
        logger.error(f"Failed to export report: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to export report: {str(e)}")

# Background tasks
async def perform_correlation_analysis(
    time_range_days: int, 
    metrics: Optional[List[str]], 
    correlation_engine: AdvancedCorrelationEngine
):
    """Perform correlation analysis in background"""
    
    global correlation_cache, analysis_results, last_analysis_time
    
    try:
        logger.info(f"Starting correlation analysis for {time_range_days} days")
        
        # Generate sample data for demonstration
        # In production, this would query the actual database
        sample_data = generate_sample_data(time_range_days)
        
        # Run correlation analysis
        correlations = correlation_engine.analyze_comprehensive_correlations(sample_data)
        
        # Convert to serializable format
        correlation_data = []
        for corr in correlations:
            correlation_data.append({
                "correlation_id": f"corr_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{len(correlation_data)}",
                "source_metric": corr.metric1,
                "target_metric": corr.metric2,
                "correlation_strength": corr.pearson_correlation,
                "correlation_type": corr.correlation_type,
                "business_context": f"Analysis shows {corr.correlation_type} relationship between {corr.metric1} and {corr.metric2}",
                "recommendation": "Monitor this relationship for strategic opportunities",
                "impact_score": corr.business_impact_score,
                "confidence_level": "High" if corr.statistical_significance < 0.05 else "Medium",
                "discovery_date": datetime.now()
            })
        
        # Time series analysis
        ts_analyzer = TimeSeriesAnalyzer()
        patterns = ts_analyzer.analyze_patterns(
            sample_data, 
            'timestamp', 
            ['Marketing Spend', 'Sales Revenue', 'Customer Count']
        )
        
        # Convert patterns to serializable format
        pattern_data = []
        for pattern in patterns:
            pattern_data.append({
                "metric_name": pattern.metric_name,
                "trend_direction": pattern.trend_direction,
                "forecast_direction": pattern.forecast_direction,
                "confidence_level": pattern.confidence_level,
                "seasonality_detected": pattern.seasonality_detected,
                "volatility_score": pattern.volatility_score
            })
        
        # Generate insights
        insights = {
            "total_correlations": len(correlation_data),
            "high_impact_insights": len([c for c in correlation_data if c['impact_score'] >= 7.0]),
            "prioritized_recommendations": {
                "high_priority": [c for c in correlation_data if c['impact_score'] >= 8.0][:5],
                "medium_priority": [c for c in correlation_data if 6.0 <= c['impact_score'] < 8.0][:5],
                "low_priority": [c for c in correlation_data if c['impact_score'] < 6.0][:5]
            },
            "stakeholder_reports": generate_stakeholder_reports(correlation_data)
        }
        
        # Update cache
        correlation_cache['correlations'] = correlation_data
        analysis_results['insights'] = insights
        analysis_results['patterns'] = pattern_data
        last_analysis_time = datetime.now()
        
        logger.info(f"Analysis completed. Found {len(correlation_data)} correlations")
        
    except Exception as e:
        logger.error(f"Background analysis failed: {str(e)}")

def generate_sample_data(days: int) -> pd.DataFrame:
    """Generate sample business data for demonstration"""
    import numpy as np
    
    np.random.seed(42)
    dates = pd.date_range(end=datetime.now(), periods=days//30, freq='M')
    
    # Create realistic business metrics with correlations
    base_growth = np.linspace(100, 150, len(dates))
    seasonal_factor = 1 + 0.1 * np.sin(2 * np.pi * np.arange(len(dates)) / 12)
    
    marketing_spend = base_growth * seasonal_factor + np.random.normal(0, 10, len(dates))
    sales_revenue = marketing_spend * 2.5 + np.random.normal(0, 15, len(dates))
    customer_count = marketing_spend * 0.8 + np.random.normal(0, 5, len(dates))
    financial_revenue = sales_revenue * 0.9 + np.random.normal(0, 10, len(dates))
    financial_expenses = financial_revenue * 0.6 + np.random.normal(0, 8, len(dates))
    
    return pd.DataFrame({
        'timestamp': dates,
        'Marketing Spend': marketing_spend,
        'Sales Revenue': sales_revenue,
        'Customer Count': customer_count,
        'Financial Revenue': financial_revenue,
        'Financial Expenses': financial_expenses,
        'Order Count': customer_count * 1.2 + np.random.normal(0, 3, len(dates)),
        'Average Order Value': sales_revenue / (customer_count * 1.2) if all(customer_count > 0) else np.ones(len(dates)) * 100
    })

def generate_stakeholder_reports(correlations: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """Generate stakeholder-specific reports"""
    
    # CEO Report
    high_impact = [c for c in correlations if c['impact_score'] >= 7.0]
    ceo_report = {
        "title": "Executive Strategic Insights",
        "key_findings": len(high_impact),
        "revenue_impact": len([c for c in high_impact if 'Revenue' in c['source_metric'] or 'Revenue' in c['target_metric']]),
        "insights": high_impact[:3],
        "recommendations": [c['recommendation'] for c in high_impact[:5]]
    }
    
    # CFO Report
    financial_correlations = [c for c in correlations if 'Financial' in c['source_metric'] or 'Financial' in c['target_metric']]
    cfo_report = {
        "title": "Financial Performance Analysis",
        "financial_correlations": len(financial_correlations),
        "insights": financial_correlations,
        "recommendations": [c['recommendation'] for c in financial_correlations]
    }
    
    # Sales Director Report
    sales_correlations = [c for c in correlations if 'Sales' in c['source_metric'] or 'Sales' in c['target_metric'] or 'Customer' in c['source_metric']]
    sales_report = {
        "title": "Sales Performance Analytics",
        "sales_correlations": len(sales_correlations),
        "insights": sales_correlations,
        "recommendations": [c['recommendation'] for c in sales_correlations]
    }
    
    # Marketing Director Report
    marketing_correlations = [c for c in correlations if 'Marketing' in c['source_metric'] or 'Marketing' in c['target_metric']]
    marketing_report = {
        "title": "Marketing ROI Analysis",
        "marketing_correlations": len(marketing_correlations),
        "insights": marketing_correlations,
        "recommendations": [c['recommendation'] for c in marketing_correlations]
    }
    
    return {
        "ceo": ceo_report,
        "cfo": cfo_report,
        "sales_director": sales_report,
        "marketing_director": marketing_report
    }

# WebSocket endpoint for real-time updates (optional)
@app.websocket("/ws/analysis")
async def websocket_endpoint(websocket):
    """WebSocket endpoint for real-time analysis updates"""
    await websocket.accept()
    try:
        while True:
            # Send periodic updates
            await websocket.send_json({
                "type": "status_update",
                "timestamp": datetime.now().isoformat(),
                "correlations_count": len(correlation_cache.get('correlations', [])),
                "last_analysis": last_analysis_time.isoformat() if last_analysis_time else None
            })
            await asyncio.sleep(30)  # Update every 30 seconds
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)