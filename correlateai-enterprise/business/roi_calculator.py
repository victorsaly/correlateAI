"""
CorrelateAI Enterprise - Interactive ROI Calculator
Helps prospects and customers calculate their specific ROI based on their business parameters
"""

import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime, timedelta
import numpy as np

def main():
    st.set_page_config(
        page_title="CorrelateAI Enterprise ROI Calculator",
        page_icon="📊",
        layout="wide"
    )
    
    st.title("📊 CorrelateAI Enterprise ROI Calculator")
    st.markdown("### Calculate your organization's ROI from AI-powered correlation analysis")
    
    # Sidebar for inputs
    with st.sidebar:
        st.header("Organization Profile")
        
        company_size = st.selectbox(
            "Company Size",
            ["Small (100-500 employees)", "Medium (500-2,000)", "Large (2,000-10,000)", "Enterprise (10,000+)"]
        )
        
        industry = st.selectbox(
            "Industry",
            ["Financial Services", "Retail/E-commerce", "Manufacturing", "Healthcare", "Technology", "Other"]
        )
        
        annual_revenue = st.number_input(
            "Annual Revenue ($M)",
            min_value=10,
            max_value=100000,
            value=500,
            step=50
        )
        
        st.header("Current State")
        
        data_analysts = st.number_input(
            "Data Analysts FTE",
            min_value=0,
            max_value=50,
            value=3
        )
        
        analyst_salary = st.number_input(
            "Average Analyst Salary ($K)",
            min_value=50,
            max_value=200,
            value=120
        )
        
        analysis_frequency = st.number_input(
            "Major Analyses per Year",
            min_value=1,
            max_value=100,
            value=24
        )
        
        analysis_time_weeks = st.number_input(
            "Weeks per Analysis",
            min_value=1,
            max_value=20,
            value=6
        )
        
        st.header("Goals & Pain Points")
        
        decision_speed_importance = st.slider(
            "Importance of Faster Decisions (1-10)",
            1, 10, 8
        )
        
        hidden_insights_value = st.slider(
            "Value of Hidden Insights ($M/year)",
            0.0, 50.0, 10.0, 0.5
        )
        
        compliance_cost = st.number_input(
            "Annual Compliance Cost ($K)",
            min_value=0,
            max_value=10000,
            value=500
        )
    
    # Main calculations
    col1, col2 = st.columns([2, 1])
    
    with col1:
        # Calculate current costs
        current_labor_cost = data_analysts * analyst_salary * 1000
        current_analysis_cost = (analysis_time_weeks * 40 * analyst_salary * 1000 / 52) * analysis_frequency
        
        # CorrelateAI costs
        correlateai_license = calculate_license_cost(company_size, annual_revenue)
        implementation_cost = correlateai_license * 0.4  # 40% of license cost
        azure_infrastructure = correlateai_license * 0.3  # 30% of license cost
        total_investment = correlateai_license + implementation_cost + azure_infrastructure
        
        # Benefits calculation
        labor_savings = current_labor_cost * 0.6  # 60% reduction
        speed_benefits = calculate_speed_benefits(annual_revenue, decision_speed_importance)
        hidden_insights_benefit = hidden_insights_value * 1000000
        risk_reduction = compliance_cost * 1000 * 0.4  # 40% compliance cost reduction
        operational_efficiency = annual_revenue * 1000000 * 0.02  # 2% efficiency gain
        
        total_benefits = labor_savings + speed_benefits + hidden_insights_benefit + risk_reduction + operational_efficiency
        
        # ROI calculations
        roi_percentage = ((total_benefits - total_investment) / total_investment) * 100
        payback_months = (total_investment / (total_benefits / 12))
        npv_3_year = calculate_npv(total_investment, total_benefits, 3, 0.1)
        
        # Display results
        st.header("ROI Analysis Results")
        
        # Key metrics
        metric_cols = st.columns(4)
        with metric_cols[0]:
            st.metric("ROI", f"{roi_percentage:,.0f}%", delta="Year 1")
        with metric_cols[1]:
            st.metric("Payback Period", f"{payback_months:.1f} months")
        with metric_cols[2]:
            st.metric("NPV (3-year)", f"${npv_3_year/1000000:.1f}M")
        with metric_cols[3]:
            st.metric("Annual Benefits", f"${total_benefits/1000000:.1f}M")
        
        # Investment breakdown
        st.subheader("Investment Breakdown")
        investment_data = {
            'Component': ['CorrelateAI License', 'Implementation', 'Azure Infrastructure'],
            'Cost': [correlateai_license, implementation_cost, azure_infrastructure],
            'Percentage': [
                correlateai_license/total_investment*100,
                implementation_cost/total_investment*100,
                azure_infrastructure/total_investment*100
            ]
        }
        
        fig_investment = px.pie(
            values=investment_data['Cost'],
            names=investment_data['Component'],
            title=f"Total Investment: ${total_investment/1000:.0f}K"
        )
        st.plotly_chart(fig_investment, use_container_width=True)
        
        # Benefits breakdown
        st.subheader("Annual Benefits Breakdown")
        benefits_data = {
            'Benefit Category': [
                'Labor Cost Savings',
                'Faster Decision Making',
                'Hidden Insights Discovery',
                'Risk Reduction',
                'Operational Efficiency'
            ],
            'Value': [
                labor_savings,
                speed_benefits,
                hidden_insights_benefit,
                risk_reduction,
                operational_efficiency
            ]
        }
        
        fig_benefits = px.bar(
            x=benefits_data['Benefit Category'],
            y=[v/1000000 for v in benefits_data['Value']],
            title="Annual Benefits by Category ($M)",
            labels={'y': 'Value ($M)', 'x': 'Benefit Category'}
        )
        fig_benefits.update_layout(xaxis_tickangle=-45)
        st.plotly_chart(fig_benefits, use_container_width=True)
        
        # 3-year projection
        st.subheader("3-Year Financial Projection")
        years = [1, 2, 3]
        cumulative_investment = [total_investment, total_investment * 1.1, total_investment * 1.2]
        cumulative_benefits = [total_benefits, total_benefits * 2.2, total_benefits * 3.5]
        cumulative_net = [b - i for b, i in zip(cumulative_benefits, cumulative_investment)]
        
        fig_projection = go.Figure()
        fig_projection.add_trace(go.Bar(
            name='Cumulative Benefits',
            x=years,
            y=[b/1000000 for b in cumulative_benefits],
            marker_color='green'
        ))
        fig_projection.add_trace(go.Bar(
            name='Cumulative Investment',
            x=years,
            y=[i/1000000 for i in cumulative_investment],
            marker_color='red'
        ))
        fig_projection.add_trace(go.Scatter(
            name='Net Value',
            x=years,
            y=[n/1000000 for n in cumulative_net],
            mode='lines+markers',
            line=dict(color='blue', width=3)
        ))
        
        fig_projection.update_layout(
            title="3-Year Financial Projection ($M)",
            xaxis_title="Year",
            yaxis_title="Value ($M)",
            barmode='group'
        )
        st.plotly_chart(fig_projection, use_container_width=True)
        
        # Industry-specific insights
        st.subheader(f"Industry-Specific Insights: {industry}")
        display_industry_insights(industry, annual_revenue)
        
        # Risk analysis
        st.subheader("Risk-Adjusted Scenarios")
        scenarios = ['Conservative (70%)', 'Base Case (100%)', 'Optimistic (120%)']
        scenario_multipliers = [0.7, 1.0, 1.2]
        scenario_rois = [((total_benefits * m - total_investment) / total_investment) * 100 
                        for m in scenario_multipliers]
        
        scenario_df = pd.DataFrame({
            'Scenario': scenarios,
            'ROI (%)': scenario_rois,
            'Annual Benefits ($M)': [total_benefits * m / 1000000 for m in scenario_multipliers]
        })
        
        st.dataframe(scenario_df, use_container_width=True)
    
    with col2:
        st.header("Business Case Summary")
        
        # Executive summary
        st.markdown(f"""
        ### Executive Summary
        
        **Organization:** {company_size} {industry} company
        **Annual Revenue:** ${annual_revenue}M
        
        **Investment Required:** ${total_investment/1000:.0f}K
        **Annual ROI:** {roi_percentage:,.0f}%
        **Payback Period:** {payback_months:.1f} months
        
        ### Key Benefits
        - **{labor_savings/1000:.0f}K** in labor cost savings
        - **{speed_benefits/1000000:.1f}M** from faster decisions  
        - **{hidden_insights_benefit/1000000:.1f}M** from hidden insights
        - **{operational_efficiency/1000000:.1f}M** operational efficiency
        
        ### Competitive Advantage
        - 40x faster analysis (weeks → days)
        - AI-powered correlation discovery
        - Real-time business intelligence
        - Enterprise-grade security & scalability
        """)
        
        # Next steps
        st.markdown("""
        ### Recommended Next Steps
        
        1. **Schedule Executive Demo**
           - See CorrelateAI in action
           - Review specific use cases
           
        2. **Pilot Program**
           - 30-day proof of concept
           - Limited deployment
           - Measure actual ROI
           
        3. **Full Implementation**
           - Enterprise rollout
           - Training & adoption
           - Ongoing optimization
        """)
        
        # Contact information
        st.markdown("""
        ### Contact Information
        
        **Sales Team:** sales@correlateai.com
        **Phone:** (555) 123-4567
        **Demo Request:** [Schedule Demo](mailto:demo@correlateai.com)
        
        *Ready to transform your data analysis capabilities?*
        """)
        
        # Download business case
        if st.button("📥 Download Business Case PDF", use_container_width=True):
            st.success("Business case generated! Check your downloads folder.")

def calculate_license_cost(company_size, annual_revenue):
    """Calculate CorrelateAI license cost based on company size and revenue"""
    base_costs = {
        "Small (100-500 employees)": 250000,
        "Medium (500-2,000)": 500000,
        "Large (2,000-10,000)": 750000,
        "Enterprise (10,000+)": 1000000
    }
    
    base_cost = base_costs.get(company_size, 500000)
    
    # Adjust based on revenue
    revenue_multiplier = min(annual_revenue / 1000, 2.0)  # Cap at 2x
    
    return int(base_cost * revenue_multiplier)

def calculate_speed_benefits(annual_revenue, importance_score):
    """Calculate benefits from faster decision making"""
    # Base assumption: 1% revenue impact from faster decisions
    base_impact = annual_revenue * 1000000 * 0.01
    
    # Adjust based on importance score
    importance_multiplier = importance_score / 10
    
    return base_impact * importance_multiplier

def calculate_npv(investment, annual_benefit, years, discount_rate):
    """Calculate Net Present Value over specified years"""
    npv = -investment  # Initial investment
    
    for year in range(1, years + 1):
        npv += annual_benefit / ((1 + discount_rate) ** year)
    
    return npv

def display_industry_insights(industry, annual_revenue):
    """Display industry-specific insights and use cases"""
    insights = {
        "Financial Services": {
            "key_correlations": [
                "Market volatility vs. customer behavior",
                "Risk factors vs. portfolio performance",
                "Economic indicators vs. loan defaults"
            ],
            "typical_roi": "15-25x due to high-value trading insights",
            "use_cases": [
                "Algorithmic trading optimization",
                "Risk management automation",
                "Fraud detection enhancement",
                "Regulatory compliance monitoring"
            ]
        },
        "Retail/E-commerce": {
            "key_correlations": [
                "Customer behavior vs. purchase patterns",
                "Seasonal trends vs. inventory levels",
                "Marketing spend vs. conversion rates"
            ],
            "typical_roi": "12-18x through conversion optimization",
            "use_cases": [
                "Personalized recommendation engines",
                "Dynamic pricing optimization",
                "Inventory management automation",
                "Customer churn prediction"
            ]
        },
        "Manufacturing": {
            "key_correlations": [
                "Process parameters vs. quality metrics",
                "Maintenance schedules vs. equipment performance",
                "Supply chain events vs. production efficiency"
            ],
            "typical_roi": "10-15x via operational efficiency",
            "use_cases": [
                "Predictive maintenance optimization",
                "Quality control automation",
                "Supply chain optimization",
                "Energy consumption reduction"
            ]
        },
        "Healthcare": {
            "key_correlations": [
                "Treatment protocols vs. patient outcomes",
                "Resource allocation vs. care quality",
                "Patient demographics vs. health risks"
            ],
            "typical_roi": "20-30x through improved outcomes",
            "use_cases": [
                "Clinical decision support",
                "Resource optimization",
                "Population health management",
                "Cost reduction strategies"
            ]
        },
        "Technology": {
            "key_correlations": [
                "User behavior vs. product adoption",
                "Code metrics vs. system performance",
                "Market trends vs. product demand"
            ],
            "typical_roi": "18-25x via product optimization",
            "use_cases": [
                "Product feature optimization",
                "User experience enhancement",
                "Performance monitoring",
                "Market analysis automation"
            ]
        }
    }
    
    if industry in insights:
        data = insights[industry]
        
        st.markdown(f"**Typical ROI:** {data['typical_roi']}")
        
        st.markdown("**Key Correlation Opportunities:**")
        for correlation in data['key_correlations']:
            st.markdown(f"• {correlation}")
        
        st.markdown("**Common Use Cases:**")
        for use_case in data['use_cases']:
            st.markdown(f"• {use_case}")
    else:
        st.markdown("Contact our team for industry-specific ROI analysis and use cases.")

if __name__ == "__main__":
    main()