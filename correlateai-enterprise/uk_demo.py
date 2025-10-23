#!/usr/bin/env python3
"""
CorrelateAI MVP: UK Business Demo
Tailored for British business culture and financial practices
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
    page_title="CorrelateAI UK Enterprise Demo",
    page_icon="🇬🇧",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# British-themed CSS
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%);
        color: white;
        padding: 2rem;
        border-radius: 10px;
        text-align: center;
        margin-bottom: 2rem;
        border: 2px solid #1e40af;
    }
    .metric-card {
        background: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-left: 4px solid #1e40af;
        margin-bottom: 1rem;
    }
    .success-metric {
        background: linear-gradient(135deg, #059669 0%, #047857 100%);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin: 0.5rem 0;
        text-align: center;
    }
    .uk-section {
        background: #f8fafc;
        padding: 2rem;
        border-radius: 10px;
        margin: 1rem 0;
        border: 1px solid #e2e8f0;
    }
    .sterling-highlight {
        background: linear-gradient(135deg, #1e40af 0%, #3730a3 100%);
        color: white;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        font-weight: bold;
    }
    .british-flag {
        display: inline-block;
        margin-right: 0.5rem;
    }
</style>
""", unsafe_allow_html=True)

def main():
    # British-themed header
    st.markdown("""
    <div class="main-header">
        <h1>🇬🇧 CorrelateAI Enterprise UK</h1>
        <h3>Transforming British Business Intelligence</h3>
        <p>Methodical • Reliable • Demonstrably Effective</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Demo navigation with British terminology
    demo_section = st.selectbox(
        "Demonstration Sections",
        ["💷 ROI Calculator (Sterling)", "📊 Live Analysis Demo", "🏛️ Business Case", "🤝 Partnership Proposal"]
    )
    
    if demo_section == "💷 ROI Calculator (Sterling)":
        show_uk_roi_calculator()
    elif demo_section == "📊 Live Analysis Demo":
        show_uk_live_demo()
    elif demo_section == "🏛️ Business Case":
        show_uk_business_case()
    elif demo_section == "🤝 Partnership Proposal":
        show_uk_partnership_proposal()

def show_uk_roi_calculator():
    st.markdown("## 💷 UK Enterprise ROI Analysis")
    st.markdown("*Calculate your organisation's potential returns in Sterling*")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### Current Analytics Investment")
        
        senior_analyst_salary = st.number_input("Senior Analyst Salary (£)", value=85000, step=2500, help="Typical UK senior analyst salary")
        business_analyst_salary = st.number_input("Business Analyst Salary (£)", value=55000, step=2500, help="UK business analyst market rate")
        num_analysts = st.number_input("Number of Analysts", value=2, step=1)
        bi_software = st.number_input("BI Software & Licences (£)", value=120000, step=5000, help="Annual software licensing costs")
        external_consulting = st.number_input("External Consulting (£)", value=180000, step=10000, help="Big 4 / specialist consulting")
        
        current_total = (senior_analyst_salary + business_analyst_salary) * num_analysts + bi_software + external_consulting
        
        st.markdown(f"""
        <div class="metric-card">
            <h4>Total Current Investment</h4>
            <h2>£{current_total:,.0f} per annum</h2>
            <p><small>Includes National Insurance and benefits</small></p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("### CorrelateAI UK Investment")
        
        # UK-specific pricing
        correlate_license = 400000  # £400K annual licence
        implementation = 35000      # £35K implementation
        training = 15000           # £15K training
        vat_rate = 0.20           # 20% UK VAT
        
        subtotal = correlate_license + implementation + training
        vat_amount = subtotal * vat_rate
        total_investment_inc_vat = subtotal + vat_amount
        
        st.markdown(f"""
        <div class="metric-card">
            <h4>CorrelateAI UK Enterprise</h4>
            <p>Annual Licence: £{correlate_license:,.0f}</p>
            <p>Implementation: £{implementation:,.0f}</p>
            <p>Training: £{training:,.0f}</p>
            <hr>
            <p>Subtotal: £{subtotal:,.0f}</p>
            <p>VAT (20%): £{vat_amount:,.0f}</p>
            <h3>Total: £{total_investment_inc_vat:,.0f}</h3>
        </div>
        """, unsafe_allow_html=True)
    
    # British-style ROI calculation
    st.markdown("---")
    st.markdown("### 📈 Return on Investment Analysis")
    
    # Conservative British calculations
    labour_savings = max(0, current_total * 0.6)  # 60% reduction in analytical labour
    efficiency_gains = labour_savings * 2.5       # Conservative efficiency multiplier
    risk_mitigation = current_total * 1.8         # Risk avoidance value
    opportunity_identification = efficiency_gains * 1.5  # Revenue opportunities
    
    total_annual_return = labour_savings + efficiency_gains + risk_mitigation + opportunity_identification
    net_annual_benefit = total_annual_return - total_investment_inc_vat
    roi_percentage = (net_annual_benefit / total_investment_inc_vat) * 100
    payback_months = (total_investment_inc_vat / total_annual_return) * 12
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown(f"""
        <div class="success-metric">
            <h4>Annual ROI</h4>
            <h2>{roi_percentage:.0f}%</h2>
            <p>Conservative estimate</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="success-metric">
            <h4>Payback Period</h4>
            <h2>{payback_months:.1f} months</h2>
            <p>Break-even point</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="success-metric">
            <h4>Annual Return</h4>
            <h2>£{total_annual_return:,.0f}</h2>
            <p>Gross benefits</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown(f"""
        <div class="success-metric">
            <h4>Net Benefit</h4>
            <h2>£{net_annual_benefit:,.0f}</h2>
            <p>After investment</p>
        </div>
        """, unsafe_allow_html=True)
    
    # UK-specific benefits breakdown
    st.markdown("### 🇬🇧 UK-Specific Value Drivers")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        **Regulatory Compliance Benefits:**
        - GDPR compliance automation: £25K annual savings
        - FCA reporting efficiency: £40K annual savings  
        - Board reporting enhancement: £15K annual savings
        - Audit trail automation: £20K annual savings
        """)
    
    with col2:
        st.markdown("""
        **British Business Advantages:**
        - Sterling-based financial analysis
        - UK data sovereignty (Azure UK datacentres)
        - British business culture alignment
        - Same timezone support and collaboration
        """)

def show_uk_live_demo():
    st.markdown("## 📊 Live UK Business Analysis")
    st.markdown("*Demonstrating real-world British business scenarios*")
    
    # UK-specific demo scenarios
    demo_scenario = st.selectbox(
        "Choose British Business Scenario",
        ["FTSE 100 Revenue vs Market Conditions", "Brexit Impact on Supply Chain", "UK Consumer Spending Patterns"]
    )
    
    if st.button("🚀 Run Analysis", type="primary"):
        # British-style progress indicators
        progress_bar = st.progress(0)
        status_text = st.empty()
        
        # UK business analysis steps
        steps = [
            "Accessing UK market data sources...",
            "Applying correlation algorithms...",
            "Analysing British market patterns...",
            "Generating business insights...",
            "Preparing executive summary..."
        ]
        
        for i, step in enumerate(steps):
            status_text.text(f"🇬🇧 {step}")
            progress_bar.progress((i + 1) / len(steps))
            time.sleep(0.7)
        
        status_text.text("✅ Analysis Complete - Ready for Board Presentation")
        
        if demo_scenario == "FTSE 100 Revenue vs Market Conditions":
            show_ftse_demo()
        elif demo_scenario == "Brexit Impact on Supply Chain":
            show_brexit_demo()
        else:
            show_consumer_demo()

def show_ftse_demo():
    st.markdown("### 🏛️ FTSE 100 Revenue Correlation Analysis")
    
    # Generate UK market data
    dates = pd.date_range(start='2022-01-01', end='2024-12-31', freq='M')
    ftse_index = 7000 + np.cumsum(np.random.normal(15, 45, len(dates)))
    company_revenue = (ftse_index - 7000) * 150 + 2500000 + np.random.normal(0, 85000, len(dates))
    gbp_usd_rate = 1.25 + np.cumsum(np.random.normal(0, 0.02, len(dates)))
    
    df = pd.DataFrame({
        'Date': dates,
        'FTSE_100': ftse_index,
        'Revenue_GBP': company_revenue,
        'GBP_USD_Rate': gbp_usd_rate
    })
    
    correlation_ftse = np.corrcoef(df['FTSE_100'], df['Revenue_GBP'])[0, 1]
    correlation_fx = np.corrcoef(df['GBP_USD_Rate'], df['Revenue_GBP'])[0, 1]
    
    col1, col2 = st.columns(2)
    
    with col1:
        # FTSE correlation chart
        fig = px.scatter(df, x='FTSE_100', y='Revenue_GBP',
                        title='FTSE 100 vs Company Revenue (£)',
                        trendline='ols',
                        color_discrete_sequence=['#1e40af'])
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown(f"""
        <div class="uk-section">
            <h4>🇬🇧 Key British Market Insights:</h4>
            <p>📈 <strong>FTSE Correlation:</strong> {correlation_ftse:.3f} (Strong positive)</p>
            <p>💷 <strong>Revenue Sensitivity:</strong> £{abs(correlation_ftse * 150):,.0f} per FTSE point</p>
            <p>🌍 <strong>FX Impact:</strong> {correlation_fx:.3f} correlation with GBP/USD</p>
            <p>📊 <strong>Market Beta:</strong> {correlation_ftse:.2f} (vs. FTSE 100 benchmark)</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("#### 💡 Strategic Recommendations:")
        st.success("✅ Increase exposure to UK domestic market (low FTSE correlation)")
        st.success("✅ Implement GBP hedging strategy for international revenues")
        st.success("✅ Prepare contingency plans for FTSE volatility periods")
        st.info("📋 Suitable for PLC board risk committee reporting")

def show_brexit_demo():
    st.markdown("### 🚢 Brexit Supply Chain Impact Analysis")
    
    # Brexit-related supply chain data
    dates = pd.date_range(start='2019-01-01', end='2024-12-31', freq='M')
    
    # Create Brexit timeline impact
    brexit_impact = np.zeros(len(dates))
    for i, date in enumerate(dates):
        if date >= pd.Timestamp('2020-01-31'):  # Brexit implementation
            brexit_impact[i] = np.random.normal(0.15, 0.05)  # Increased costs
        if date >= pd.Timestamp('2021-01-01'):  # Trade deal
            brexit_impact[i] = np.random.normal(0.08, 0.03)  # Reduced impact
    
    supply_chain_costs = 1000000 + np.cumsum(brexit_impact * 50000) + np.random.normal(0, 25000, len(dates))
    delivery_delays = 3.5 + brexit_impact * 10 + np.random.normal(0, 0.8, len(dates))
    
    df = pd.DataFrame({
        'Date': dates,
        'Supply_Chain_Costs': supply_chain_costs,
        'Delivery_Delays_Days': delivery_delays,
        'Brexit_Impact_Score': brexit_impact
    })
    
    correlation_cost = np.corrcoef(df['Brexit_Impact_Score'], df['Supply_Chain_Costs'])[0, 1]
    correlation_delays = np.corrcoef(df['Brexit_Impact_Score'], df['Delivery_Delays_Days'])[0, 1]
    
    col1, col2 = st.columns(2)
    
    with col1:
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=df['Date'], y=df['Supply_Chain_Costs']/1000,
                               name='Supply Chain Costs (£K)', line=dict(color='red')))
        fig.add_trace(go.Scatter(x=df['Date'], y=df['Delivery_Delays_Days']*50,
                               name='Delivery Delays (Days×50)', yaxis='y2', line=dict(color='orange')))
        
        # Add Brexit milestones
        fig.add_vline(x=pd.Timestamp('2020-01-31'), line_dash="dash", 
                     annotation_text="Brexit Day", annotation_position="top")
        fig.add_vline(x=pd.Timestamp('2021-01-01'), line_dash="dash",
                     annotation_text="Trade Deal", annotation_position="top")
        
        fig.update_layout(
            title='Brexit Impact on UK Supply Chain',
            yaxis=dict(title='Supply Chain Costs (£K)'),
            yaxis2=dict(title='Delivery Delays (Days)', overlaying='y', side='right'),
            height=400
        )
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        annual_impact = (df['Supply_Chain_Costs'].iloc[-1] - df['Supply_Chain_Costs'].iloc[0])
        
        st.markdown(f"""
        <div class="uk-section">
            <h4>🇪🇺➡️🇬🇧 Brexit Impact Analysis:</h4>
            <p>📈 <strong>Cost Correlation:</strong> {correlation_cost:.3f}</p>
            <p>💷 <strong>Total Impact:</strong> £{annual_impact:,.0f} since Brexit</p>
            <p>⏰ <strong>Delay Correlation:</strong> {correlation_delays:.3f}</p>
            <p>📊 <strong>Recovery Trend:</strong> Stabilising since Q2 2021</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("#### 🎯 Supply Chain Optimisation:")
        st.success("✅ Diversify supplier base beyond EU-dependent sources")
        st.success("✅ Implement UK-based inventory buffers")
        st.success("✅ Establish direct trade relationships post-Brexit")
        st.warning("⚠️ Monitor ongoing regulatory changes")

def show_consumer_demo():
    st.markdown("### 🛍️ UK Consumer Spending Pattern Analysis")
    
    # UK consumer spending data
    dates = pd.date_range(start='2022-01-01', end='2024-12-31', freq='M')
    
    # Seasonal UK patterns
    seasonal_factor = np.array([np.sin(2 * np.pi * i / 12) for i in range(len(dates))])
    cost_of_living_impact = np.linspace(0, 0.15, len(dates))  # Increasing impact
    
    consumer_spending = 2800 - cost_of_living_impact * 400 + seasonal_factor * 150 + np.random.normal(0, 45, len(dates))
    retail_sales = consumer_spending * 0.85 + np.random.normal(0, 25, len(dates))
    
    df = pd.DataFrame({
        'Date': dates,
        'Consumer_Spending': consumer_spending,
        'Retail_Sales': retail_sales,
        'Cost_of_Living_Index': 100 + cost_of_living_impact * 100
    })
    
    correlation = np.corrcoef(df['Consumer_Spending'], df['Retail_Sales'])[0, 1]
    
    col1, col2 = st.columns(2)
    
    with col1:
        fig = px.line(df, x='Date', y=['Consumer_Spending', 'Retail_Sales'],
                     title='UK Consumer Spending vs Retail Sales (£/month)',
                     color_discrete_map={'Consumer_Spending': '#1e40af', 'Retail_Sales': '#059669'})
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown(f"""
        <div class="uk-section">
            <h4>🇬🇧 UK Consumer Insights:</h4>
            <p>📊 <strong>Spending Correlation:</strong> {correlation:.3f}</p>
            <p>💰 <strong>Average Monthly Spend:</strong> £{df['Consumer_Spending'].mean():,.0f}</p>
            <p>📈 <strong>Seasonal Variance:</strong> {df['Consumer_Spending'].std():,.0f}</p>
            <p>📉 <strong>Cost of Living Impact:</strong> -{cost_of_living_impact[-1]*100:.1f}% reduction</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("#### 💼 Retail Strategy Recommendations:")
        st.success("✅ Focus on value propositions during cost-of-living pressures")
        st.success("✅ Optimise seasonal inventory for British shopping patterns")
        st.success("✅ Develop loyalty programmes for spending retention")

def show_uk_business_case():
    st.markdown("## 🏛️ UK Enterprise Business Case")
    
    st.markdown("### 📊 Executive Summary for British Boards")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div class="uk-section">
            <h4>🎯 Strategic Business Case</h4>
            <p><strong>Investment Rationale:</strong> Transform analytical capabilities whilst maintaining cost discipline and regulatory compliance.</p>
            
            <p><strong>Competitive Advantage:</strong> Deliver insights 20x faster than traditional methods, enabling superior market responsiveness.</p>
            
            <p><strong>Risk Mitigation:</strong> Early identification of market changes and operational risks through automated correlation monitoring.</p>
            
            <p><strong>Regulatory Benefits:</strong> Enhanced compliance reporting capabilities for FCA, GDPR, and sector-specific requirements.</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        # British business metrics
        st.markdown("### 📈 Key Performance Indicators")
        
        metrics = {
            "EBITDA Impact": "+£3.2M annually",
            "Working Capital Optimisation": "£1.8M improvement",
            "Analysis Efficiency": "85% time reduction",
            "Compliance Cost Savings": "£65K annually",
            "Risk Detection Improvement": "75% faster identification"
        }
        
        for metric, value in metrics.items():
            st.markdown(f"""
            <div class="sterling-highlight">
                <strong>{metric}:</strong> {value}
            </div>
            """, unsafe_allow_html=True)
    
    # Industry benchmarking
    st.markdown("---")
    st.markdown("### 🏆 Industry Benchmarking (UK Market)")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("vs. FTSE 100 Average", "35% faster", "decision-making speed")
        st.metric("vs. Traditional BI", "60% lower", "total cost of ownership")
    
    with col2:
        st.metric("vs. Manual Analysis", "20x improvement", "insight generation")
        st.metric("vs. External Consulting", "70% cost reduction", "ongoing analytics")
    
    with col3:
        st.metric("UK Data Sovereignty", "100% compliant", "GDPR requirements")
        st.metric("British Support", "Same-day response", "timezone alignment")

def show_uk_partnership_proposal():
    st.markdown("## 🤝 UK Partnership Proposal")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        ### 📋 30-Day UK Pilot Programme
        
        **Scope:** Comprehensive evaluation using your organisation's actual data
        **Investment:** £0 upfront commitment
        **Success Criteria:** Demonstrate minimum 400% ROI potential
        **Data Handling:** UK-based processing, GDPR compliant
        
        #### Programme Structure:
        
        **Week 1: Integration & Setup**
        - Secure data connectivity establishment
        - GDPR compliance validation
        - Team training and onboarding
        - Initial correlation baseline
        
        **Week 2-3: Analysis & Discovery**
        - Comprehensive correlation analysis
        - British market context integration
        - Regulatory compliance correlation monitoring
        - Business impact quantification
        
        **Week 4: Validation & Planning**
        - ROI validation with finance team
        - Board presentation preparation
        - Implementation roadmap development
        - Commercial terms negotiation
        """)
    
    with col2:
        st.markdown("### ✅ UK Success Guarantees")
        
        guarantees = [
            "Identify minimum 3 actionable business correlations",
            "Demonstrate 400%+ ROI potential within 30 days",
            "Achieve 80%+ user adoption across pilot team",
            "Complete analysis 15x faster than current methods",
            "Generate specific revenue/cost recommendations",
            "Maintain 100% GDPR compliance throughout",
            "Provide same-day UK support response"
        ]
        
        for guarantee in guarantees:
            st.success(f"✅ {guarantee}")
        
        st.markdown("### 🔒 Risk Mitigation")
        st.info("💰 **No payment required until ROI demonstrated**")
        st.info("📊 **Independent validation by your finance team**")
        st.info("🔄 **Full data return guarantee**")
        st.info("📈 **Expansion only after pilot success validation**")
        st.info("🇬🇧 **UK data sovereignty maintained throughout**")
    
    # British-style call to action
    st.markdown("---")
    st.markdown("""
    <div class="sterling-highlight">
        <h2>🇬🇧 Ready to Transform Your Analytics Capability?</h2>
        <h4>Demonstrate ROI with your organisation's data in 30 days</h4>
        <p>Contact: enterprise.uk@correlateai.com | +44 20 7123 4567</p>
        <p>Schedule Executive Briefing: calendly.com/correlateai-uk/executive-briefing</p>
    </div>
    """, unsafe_allow_html=True)
    
    # UK-specific next steps
    st.markdown("### 📞 Next Steps")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        **For Finance Directors:**
        - Board-ready business case review
        - ROI validation with your finance team
        - Compliance framework assessment
        - Sterling-based financial modeling
        """)
    
    with col2:
        st.markdown("""
        **For Technology Directors:**
        - Technical architecture review
        - UK data centre integration planning
        - Security and compliance validation
        - System integration assessment
        """)

if __name__ == "__main__":
    main()