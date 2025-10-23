#!/usr/bin/env python3
"""
CorrelateAI MVP: Simple Customer Demo
Focus on functional value demonstration, not technical complexity
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import time

# Page configuration
st.set_page_config(
    page_title="CorrelateAI MVP Demo",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS for professional appearance
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%);
        color: white;
        padding: 2rem;
        border-radius: 10px;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-left: 4px solid #3b82f6;
    }
    .success-metric {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin: 0.5rem 0;
    }
    .demo-section {
        background: #f8fafc;
        padding: 2rem;
        border-radius: 10px;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

def main():
    # Header
    st.markdown("""
    <div class="main-header">
        <h1>CorrelateAI MVP Demo</h1>
        <h3>Turn Your Business Data Into Profitable Insights</h3>
        <p>5-Minute Functional Demonstration</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Demo navigation
    demo_tab = st.selectbox(
        "Demo Section",
        ["🎯 ROI Calculator", "📊 Live Analysis Demo", "💰 Business Impact", "🚀 30-Day Pilot"]
    )
    
    if demo_tab == "🎯 ROI Calculator":
        show_roi_calculator()
    elif demo_tab == "📊 Live Analysis Demo":
        show_live_demo()
    elif demo_tab == "💰 Business Impact":
        show_business_impact()
    elif demo_tab == "🚀 30-Day Pilot":
        show_pilot_proposal()

def show_roi_calculator():
    st.markdown("## 🎯 Your ROI Calculation")
    st.markdown("*Enter your current analytics costs to see potential savings*")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### Current Analytics Costs")
        
        analyst_salary = st.number_input("Senior Analyst Salary", value=120000, step=5000)
        num_analysts = st.number_input("Number of Analysts", value=2, step=1)
        bi_tools = st.number_input("BI Tools & Software", value=150000, step=10000)
        consulting = st.number_input("External Consulting", value=200000, step=25000)
        
        current_total = (analyst_salary * num_analysts) + bi_tools + consulting
        
        st.markdown(f"""
        <div class="metric-card">
            <h4>Total Current Cost</h4>
            <h2>${current_total:,.0f}/year</h2>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("### CorrelateAI Investment")
        
        correlate_license = 500000
        implementation = 50000
        training = 25000
        total_investment = correlate_license + implementation + training
        
        st.markdown(f"""
        <div class="metric-card">
            <h4>CorrelateAI Platform</h4>
            <p>License: ${correlate_license:,.0f}</p>
            <p>Implementation: ${implementation:,.0f}</p>
            <p>Training: ${training:,.0f}</p>
            <h3>Total: ${total_investment:,.0f}</h3>
        </div>
        """, unsafe_allow_html=True)
    
    # ROI Calculation
    st.markdown("---")
    
    col1, col2, col3 = st.columns(3)
    
    cost_savings = max(0, current_total - (total_investment * 0.7))  # 30% of platform cost for ongoing
    revenue_opportunities = cost_savings * 12  # Conservative multiplier
    risk_avoidance = revenue_opportunities * 0.3
    
    total_annual_return = cost_savings + revenue_opportunities + risk_avoidance
    roi_percentage = ((total_annual_return - total_investment) / total_investment) * 100
    payback_months = (total_investment / total_annual_return) * 12
    
    with col1:
        st.markdown(f"""
        <div class="success-metric">
            <h4>Annual ROI</h4>
            <h2>{roi_percentage:.0f}%</h2>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="success-metric">
            <h4>Payback Period</h4>
            <h2>{payback_months:.1f} months</h2>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="success-metric">
            <h4>Annual Return</h4>
            <h2>${total_annual_return:,.0f}</h2>
        </div>
        """, unsafe_allow_html=True)

def show_live_demo():
    st.markdown("## 📊 Live Correlation Analysis")
    st.markdown("*Watch CorrelateAI discover profitable insights in real-time*")
    
    # Demo selector
    demo_type = st.selectbox(
        "Choose Business Scenario",
        ["Sales vs Marketing Spend", "Revenue vs Market Trends", "Costs vs Operational Metrics"]
    )
    
    if st.button("🚀 Run Analysis", type="primary"):
        # Simulate AI processing
        progress_bar = st.progress(0)
        status_text = st.empty()
        
        # Simulate analysis steps
        steps = [
            "Connecting to data sources...",
            "Analyzing correlation patterns...",
            "Applying AI algorithms...",
            "Generating business insights...",
            "Preparing recommendations..."
        ]
        
        for i, step in enumerate(steps):
            status_text.text(step)
            progress_bar.progress((i + 1) / len(steps))
            time.sleep(0.8)  # Simulate processing time
        
        status_text.text("✅ Analysis Complete!")
        
        # Generate demo results based on selection
        if demo_type == "Sales vs Marketing Spend":
            show_sales_marketing_demo()
        elif demo_type == "Revenue vs Market Trends":
            show_revenue_trends_demo()
        else:
            show_costs_operations_demo()

def show_sales_marketing_demo():
    st.markdown("### 🎯 Sales vs Marketing Spend Analysis")
    
    # Generate sample data
    dates = pd.date_range(start='2023-01-01', end='2024-12-31', freq='M')
    marketing_spend = np.random.normal(50000, 8000, len(dates))
    sales_revenue = marketing_spend * 3.2 + np.random.normal(0, 20000, len(dates))
    
    df = pd.DataFrame({
        'Date': dates,
        'Marketing_Spend': marketing_spend,
        'Sales_Revenue': sales_revenue
    })
    
    # Calculate correlation
    correlation = np.corrcoef(df['Marketing_Spend'], df['Sales_Revenue'])[0, 1]
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Chart
        fig = px.scatter(df, x='Marketing_Spend', y='Sales_Revenue',
                        title='Marketing Spend vs Sales Revenue',
                        trendline='ols')
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown(f"""
        <div class="demo-section">
            <h4>Key Insights Discovered:</h4>
            <p>🔍 <strong>Correlation Strength:</strong> {correlation:.2f} (Strong positive)</p>
            <p>💰 <strong>ROI Impact:</strong> Every $1 in marketing generates $3.20 in sales</p>
            <p>📈 <strong>Optimal Spend:</strong> $52,000/month for maximum ROI</p>
            <p>⚡ <strong>Quick Win:</strong> Increase marketing budget by 15% for $180K additional revenue</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("#### 💡 Business Recommendations:")
        st.success("✅ Increase marketing budget to $52K/month")
        st.success("✅ Focus on channels with highest correlation")
        st.success("✅ Implement real-time ROI tracking")

def show_revenue_trends_demo():
    st.markdown("### 📈 Revenue vs Market Trends Analysis")
    
    # Generate market trend data
    dates = pd.date_range(start='2023-01-01', end='2024-12-31', freq='M')
    market_index = 100 + np.cumsum(np.random.normal(0.5, 2, len(dates)))
    company_revenue = market_index * 10000 + np.random.normal(0, 50000, len(dates))
    
    df = pd.DataFrame({
        'Date': dates,
        'Market_Index': market_index,
        'Company_Revenue': company_revenue
    })
    
    correlation = np.corrcoef(df['Market_Index'], df['Company_Revenue'])[0, 1]
    
    col1, col2 = st.columns(2)
    
    with col1:
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=df['Date'], y=df['Market_Index'], 
                               name='Market Index', line=dict(color='blue')))
        
        # Add second y-axis for revenue
        fig.add_trace(go.Scatter(x=df['Date'], y=df['Company_Revenue']/1000, 
                               name='Revenue ($K)', yaxis='y2', line=dict(color='green')))
        
        fig.update_layout(
            title='Revenue Correlation with Market Trends',
            yaxis=dict(title='Market Index'),
            yaxis2=dict(title='Revenue ($K)', overlaying='y', side='right'),
            height=400
        )
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown(f"""
        <div class="demo-section">
            <h4>Market Intelligence:</h4>
            <p>🔍 <strong>Market Correlation:</strong> {correlation:.2f}</p>
            <p>📊 <strong>Revenue Sensitivity:</strong> 1% market change = 0.8% revenue impact</p>
            <p>🎯 <strong>Prediction Accuracy:</strong> 85% for next quarter</p>
            <p>⚠️ <strong>Risk Alert:</strong> Market downturn could reduce revenue by $200K</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("#### 🔮 Forward-Looking Insights:")
        st.info("📈 Market trending upward - expect 12% revenue growth")
        st.warning("⚠️ Prepare for potential Q3 market volatility")
        st.success("✅ Diversify revenue streams to reduce market dependency")

def show_costs_operations_demo():
    st.markdown("### ⚙️ Costs vs Operational Metrics Analysis")
    
    # Generate operational data
    months = 24
    dates = pd.date_range(start='2023-01-01', periods=months, freq='M')
    efficiency_score = np.random.normal(75, 8, months)
    operational_costs = 500000 - (efficiency_score * 2000) + np.random.normal(0, 15000, months)
    
    df = pd.DataFrame({
        'Date': dates,
        'Efficiency_Score': efficiency_score,
        'Operational_Costs': operational_costs
    })
    
    correlation = np.corrcoef(df['Efficiency_Score'], df['Operational_Costs'])[0, 1]
    
    col1, col2 = st.columns(2)
    
    with col1:
        fig = px.scatter(df, x='Efficiency_Score', y='Operational_Costs',
                        title='Operational Efficiency vs Costs',
                        trendline='ols')
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        potential_savings = abs(correlation) * 150000  # Estimate based on correlation strength
        
        st.markdown(f"""
        <div class="demo-section">
            <h4>Cost Optimization Insights:</h4>
            <p>🔍 <strong>Efficiency Impact:</strong> {correlation:.2f} correlation</p>
            <p>💰 <strong>Savings Potential:</strong> ${potential_savings:,.0f}/year</p>
            <p>📊 <strong>Optimal Range:</strong> 80-85% efficiency score</p>
            <p>⚡ <strong>Quick Win:</strong> 5% efficiency improvement = $60K savings</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("#### 🎯 Cost Reduction Opportunities:")
        st.success("✅ Focus on efficiency improvements in underperforming areas")
        st.success("✅ Implement real-time efficiency monitoring")
        st.success("✅ Target 80%+ efficiency score for optimal costs")

def show_business_impact():
    st.markdown("## 💰 Your Business Impact Summary")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### ⏰ Time Savings")
        st.markdown("""
        <div class="demo-section">
            <h4>Current Process vs CorrelateAI</h4>
            <div style="display: flex; justify-content: space-between; margin: 1rem 0;">
                <div>
                    <h5>Before</h5>
                    <p>📅 6-9 weeks per analysis</p>
                    <p>👥 3+ analysts required</p>
                    <p>📊 Limited insights discovered</p>
                    <p>💸 High cost per insight</p>
                </div>
                <div>
                    <h5>After</h5>
                    <p>⚡ 2-4 hours per analysis</p>
                    <p>👤 1 analyst can handle multiple</p>
                    <p>🎯 40% more insights found</p>
                    <p>💰 80% cost reduction</p>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("### 📈 Revenue Impact")
        
        revenue_metrics = {
            "Hidden Opportunities": "$2.5M/year",
            "Faster Decisions": "$1.8M/year", 
            "Risk Avoidance": "$1.2M/year",
            "Cost Reduction": "$800K/year"
        }
        
        total_impact = 6.3  # Million
        
        for metric, value in revenue_metrics.items():
            st.markdown(f"""
            <div class="success-metric">
                <p><strong>{metric}:</strong> {value}</p>
            </div>
            """, unsafe_allow_html=True)
        
        st.markdown(f"""
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); 
                    color: white; padding: 1.5rem; border-radius: 10px; text-align: center; margin-top: 1rem;">
            <h3>Total Annual Impact</h3>
            <h1>${total_impact:.1f}M</h1>
        </div>
        """, unsafe_allow_html=True)
    
    # Industry comparison
    st.markdown("---")
    st.markdown("### 🏆 Industry Benchmark Comparison")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Analysis Speed", "20x faster", "vs. industry average")
    with col2:
        st.metric("Cost Efficiency", "65% lower", "vs. traditional BI")
    with col3:
        st.metric("Insight Discovery", "+40% more", "vs. manual analysis")

def show_pilot_proposal():
    st.markdown("## 🚀 Risk-Free 30-Day Pilot Program")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        ### 📋 Pilot Program Details
        
        **Duration:** 30 days
        **Investment:** $0 upfront
        **Success Guarantee:** Minimum 500% ROI demonstration
        **Data Integration:** Your existing systems
        
        #### Week 1: Setup & Integration
        - Connect to your data sources
        - Configure AI analysis parameters
        - Train your team on the platform
        
        #### Week 2-3: Analysis & Discovery
        - Run correlation analysis on your data
        - Identify profitable opportunities
        - Generate actionable insights
        
        #### Week 4: Results & Validation
        - Measure ROI achievement
        - Document business impact
        - Plan full implementation
        """)
    
    with col2:
        st.markdown("### ✅ Success Criteria")
        
        criteria = [
            "Discover 3+ actionable business correlations",
            "Demonstrate minimum 500% ROI potential", 
            "Achieve 80%+ user adoption rate",
            "Complete analysis 10x faster than current process",
            "Generate specific revenue recommendations"
        ]
        
        for criterion in criteria:
            st.success(f"✅ {criterion}")
        
        st.markdown("### 🔒 Risk Mitigation")
        st.info("💰 **No payment required until ROI is proven**")
        st.info("📊 **Independent validation of all results**")
        st.info("🔄 **Full money-back guarantee if goals not met**")
        st.info("📈 **Expansion only after pilot success**")
    
    # Call to action
    st.markdown("---")
    st.markdown("""
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                color: white; padding: 2rem; border-radius: 10px; text-align: center;">
        <h2>Ready to Start Your Pilot?</h2>
        <h4>Prove ROI with your data in 30 days</h4>
        <p>Contact us to schedule your implementation: demo@correlateai.com</p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()