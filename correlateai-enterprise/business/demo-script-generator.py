#!/usr/bin/env python3
"""
CorrelateAI Enterprise Demo Script Generator
Creates customized demo scripts for different stakeholder types and industries
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Optional

class DemoScriptGenerator:
    """Generates customized demo scripts for CorrelateAI Enterprise"""
    
    def __init__(self):
        self.stakeholder_types = {
            "ceo": "Chief Executive Officer",
            "cfo": "Chief Financial Officer", 
            "cto": "Chief Technology Officer",
            "coo": "Chief Operating Officer",
            "cmo": "Chief Marketing Officer",
            "cro": "Chief Risk Officer",
            "head_analytics": "Head of Analytics",
            "head_strategy": "Head of Strategy",
            "board_member": "Board Member"
        }
        
        self.industries = {
            "financial_services": "Financial Services",
            "retail": "Retail & E-commerce",
            "manufacturing": "Manufacturing",
            "healthcare": "Healthcare",
            "technology": "Technology",
            "energy": "Energy & Utilities"
        }
        
        self.demo_scenarios = {
            "financial_services": {
                "trading_correlation": "Real-time market correlation discovery for algorithmic trading",
                "risk_monitoring": "Cross-asset correlation risk monitoring and alerts",
                "fraud_detection": "Customer behavior correlation analysis for fraud detection",
                "regulatory_compliance": "Automated correlation-based compliance monitoring"
            },
            "retail": {
                "customer_segmentation": "Multi-dimensional customer correlation analysis",
                "inventory_optimization": "Demand-supply correlation forecasting",
                "price_optimization": "Competitor-market correlation pricing",
                "personalization": "Customer journey correlation personalization"
            },
            "manufacturing": {
                "quality_control": "Process-quality correlation monitoring",
                "predictive_maintenance": "Equipment correlation failure prediction",
                "supply_chain": "Supplier-performance correlation optimization",
                "energy_efficiency": "Production-energy correlation analysis"
            },
            "healthcare": {
                "clinical_outcomes": "Treatment-outcome correlation analysis",
                "resource_optimization": "Patient flow correlation optimization",
                "population_health": "Risk factor correlation identification",
                "operational_efficiency": "Cost-quality correlation analysis"
            },
            "technology": {
                "user_behavior": "Feature-engagement correlation analysis",
                "performance_optimization": "System-performance correlation monitoring",
                "customer_success": "Usage-retention correlation modeling",
                "product_development": "Feature-adoption correlation insights"
            },
            "energy": {
                "demand_forecasting": "Weather-demand correlation modeling",
                "asset_performance": "Equipment-environment correlation analysis",
                "grid_optimization": "Load-capacity correlation optimization",
                "predictive_maintenance": "Asset-failure correlation prediction"
            }
        }

    def generate_demo_script(self, stakeholder: str, industry: str, 
                           company_size: str = "large", demo_length: str = "30min") -> str:
        """Generate a customized demo script"""
        
        script = f"""
# CorrelateAI Enterprise Demo Script
## Stakeholder: {self.stakeholder_types.get(stakeholder, stakeholder)}
## Industry: {self.industries.get(industry, industry)}
## Company Size: {company_size.title()}
## Demo Length: {demo_length}
## Generated: {datetime.now().strftime('%B %d, %Y')}

---

## Pre-Demo Preparation (15 minutes before demo)

### Technical Setup
- [ ] CorrelateAI Enterprise platform loaded
- [ ] {industry.replace('_', ' ').title()} sample datasets prepared
- [ ] Demo environment configured for {company_size} company simulation
- [ ] Executive dashboard customized for {stakeholder} role
- [ ] Screen sharing and recording tools tested

### Stakeholder Research
- [ ] Company background and recent news reviewed
- [ ] Specific challenges in {industry.replace('_', ' ')} industry identified
- [ ] Competitor analysis and market position understood
- [ ] Recent financial results and strategic initiatives noted

### Materials Prepared
- [ ] Custom ROI calculator loaded with company parameters
- [ ] Industry-specific case studies ready
- [ ] Business case presentation customized
- [ ] Contract and pricing information available

---

## Demo Flow ({demo_length})

### Opening & Discovery (5 minutes)

**Stakeholder Connection:**
"{self._get_opening_hook(stakeholder, industry)}"

**Discovery Questions:**
{self._get_discovery_questions(stakeholder, industry)}

**Pain Point Validation:**
{self._get_pain_points(stakeholder, industry)}

### Solution Overview (8 minutes)

**Platform Introduction:**
{self._get_platform_intro(stakeholder)}

**Value Proposition:**
{self._get_value_proposition(stakeholder, industry)}

**Key Differentiators:**
{self._get_differentiators(stakeholder)}

### Live Demonstration (12 minutes)

{self._get_demo_scenarios(industry, stakeholder)}

### ROI & Business Case (4 minutes)

**Financial Impact:**
{self._get_roi_discussion(stakeholder, industry)}

**Implementation Timeline:**
{self._get_implementation_timeline()}

### Next Steps & Close (1 minute)

**Immediate Actions:**
{self._get_next_steps(stakeholder)}

---

## Demo Scenarios - Detailed Scripts

{self._get_detailed_scenarios(industry, stakeholder)}

---

## Objection Handling

{self._get_objection_handling(stakeholder, industry)}

---

## Follow-up Materials

{self._get_followup_materials(stakeholder, industry)}

---

## Success Metrics

**Demo Success Indicators:**
- [ ] Stakeholder engagement (asking questions, leaning forward)
- [ ] Technical capability validation ("This is exactly what we need")
- [ ] Business value acknowledgment ("I can see the ROI")
- [ ] Next steps commitment (specific timeline agreed)

**Immediate Follow-up Required:**
- [ ] Send custom ROI analysis within 24 hours
- [ ] Schedule technical deep-dive with implementation team
- [ ] Provide industry-specific case studies
- [ ] Connect with existing customer references

---

## Notes Section

**Key Points Raised:**
_[To be filled during demo]_

**Specific Requirements:**
_[To be filled during demo]_

**Objections & Responses:**
_[To be filled during demo]_

**Next Steps Agreed:**
_[To be filled during demo]_

**Follow-up Timeline:**
_[To be filled during demo]_

"""
        return script

    def _get_opening_hook(self, stakeholder: str, industry: str) -> str:
        hooks = {
            "ceo": f"Most CEOs in {industry.replace('_', ' ')} tell us they're losing $1-2M monthly in missed opportunities because their data analysis takes 6-9 weeks. What if we could give you those insights in 1-2 days?",
            "cfo": f"CFOs in {industry.replace('_', ' ')} typically see 1,800%+ ROI within 6 months of implementing AI-powered correlation analysis. Let me show you exactly how that math works for your organization.",
            "cto": f"The biggest technical challenge CTOs face in {industry.replace('_', ' ')} is scaling analytics without scaling teams. Our platform gives you 40x more analytical capacity with the same headcount.",
            "coo": f"Operations leaders in {industry.replace('_', ' ')} report finding $8-15M in hidden operational efficiency opportunities through correlation analysis. Today I'll show you how.",
        }
        return hooks.get(stakeholder, f"Leaders in {industry.replace('_', ' ')} are discovering 20-30% performance improvements through AI-powered correlation analysis.")

    def _get_discovery_questions(self, stakeholder: str, industry: str) -> str:
        questions = {
            "ceo": [
                "What are your top 3 strategic priorities for this year?",
                "How quickly can your team analyze market opportunities?", 
                "What competitive advantages are you looking to create?",
                "Where do you think hidden opportunities might exist in your data?"
            ],
            "cfo": [
                "What's your current annual spend on data analysis and business intelligence?",
                "How long does it take to get answers for critical financial decisions?",
                "What opportunities do you think you're missing due to slow analysis?",
                "How do you measure ROI on technology investments?"
            ],
            "cto": [
                "What's your current analytics infrastructure and toolset?",
                "How do you handle scaling analytics capabilities?",
                "What are your biggest technical challenges with data analysis?",
                "How important is real-time correlation analysis to your operations?"
            ]
        }
        
        q_list = questions.get(stakeholder, [
            f"What are your biggest challenges in {industry.replace('_', ' ')}?",
            "How do you currently handle data analysis and insights?",
            "What opportunities do you think you're missing?",
            "How do you measure success in analytics initiatives?"
        ])
        
        return "\n".join([f"- {q}" for q in q_list])

    def _get_pain_points(self, stakeholder: str, industry: str) -> str:
        pain_points = {
            "ceo": [
                "Slow decision-making due to lengthy analysis cycles",
                "Missing market opportunities due to delayed insights",
                "Lack of competitive intelligence and market correlation insights",
                "Difficulty connecting business outcomes to operational factors"
            ],
            "cfo": [
                "High cost of data analysis teams and external consultants",
                "Slow financial analysis limiting strategic agility",
                "Missing cost optimization and revenue correlation opportunities",
                "Difficulty quantifying ROI of business initiatives"
            ],
            "cto": [
                "Scaling analytics capabilities without proportional team growth",
                "Integration challenges across multiple data sources",
                "Performance bottlenecks in complex analytical workloads",
                "Need for real-time correlation analysis capabilities"
            ]
        }
        
        pp_list = pain_points.get(stakeholder, [
            f"Industry-specific challenges in {industry.replace('_', ' ')}",
            "Manual and time-consuming analysis processes",
            "Missing hidden patterns and correlations in data",
            "Difficulty scaling analytical capabilities"
        ])
        
        return "\n".join([f"- {pp}" for pp in pp_list])

    def _get_platform_intro(self, stakeholder: str) -> str:
        intros = {
            "ceo": "CorrelateAI Enterprise is the first quantum-enhanced AI platform that autonomously discovers business correlations across your entire enterprise, delivering strategic insights 40x faster than traditional methods.",
            "cfo": "CorrelateAI Enterprise delivers measurable ROI through automated correlation discovery, typically generating 1,800%+ returns by finding hidden revenue opportunities and reducing analysis costs by 60%.",
            "cto": "CorrelateAI Enterprise is built on Azure-native architecture with quantum-enhanced algorithms, providing unlimited analytical scalability without the need to scale your team proportionally."
        }
        return intros.get(stakeholder, "CorrelateAI Enterprise uses AI agents to automatically discover meaningful correlations across your business data, delivering actionable insights in hours instead of weeks.")

    def _get_value_proposition(self, stakeholder: str, industry: str) -> str:
        value_props = {
            "ceo": f"""
**Strategic Value:**
- 40x faster strategic decision making (weeks → days)
- $15-30M annually in new opportunity discovery
- Competitive advantage through AI-powered insights
- Real-time market correlation intelligence
""",
            "cfo": f"""
**Financial Value:**
- 1,800%+ ROI with 1.9-month payback period
- $16M+ annual benefits vs. $850K investment
- 60% reduction in analysis labor costs
- $8-15M operational efficiency gains
""",
            "cto": f"""
**Technical Value:**
- 40x analytical capacity without team scaling
- Azure-native with quantum-enhanced algorithms
- Real-time correlation discovery and monitoring
- Enterprise security with SOC 2 compliance
"""
        }
        return value_props.get(stakeholder, f"**Business Value:** Faster insights, better decisions, competitive advantage in {industry.replace('_', ' ')}")

    def _get_differentiators(self, stakeholder: str) -> str:
        differentiators = [
            "**Only quantum-enhanced** correlation platform in market",
            "**40x faster** than traditional analysis methods",
            "**AI-generated business context** not just statistical outputs",
            "**Azure-native enterprise** security and scalability",
            "**Industry-specific** pre-trained correlation models",
            "**24/7 autonomous** correlation monitoring and alerts"
        ]
        return "\n".join(differentiators)

    def _get_demo_scenarios(self, industry: str, stakeholder: str) -> str:
        scenarios = self.demo_scenarios.get(industry, {})
        
        demo_flow = """
**Scenario 1: Real-Time Correlation Discovery (4 minutes)**
- Show live data ingestion from multiple sources
- Demonstrate AI correlation discovery in action
- Highlight business context generation
- Show executive dashboard updates

**Scenario 2: Industry-Specific Use Case (4 minutes)**
{}

**Scenario 3: Advanced Analytics & Insights (4 minutes)**
- Demonstrate quantum-enhanced correlation analysis
- Show predictive correlation modeling
- Display automated insight generation
- Highlight actionable recommendations
""".format(self._get_industry_specific_demo(industry))
        
        return demo_flow

    def _get_industry_specific_demo(self, industry: str) -> str:
        demos = {
            "financial_services": """
- Live market correlation analysis for trading optimization
- Real-time risk correlation monitoring across portfolios
- Customer behavior correlation for fraud detection
- Regulatory compliance correlation tracking""",
            
            "retail": """
- Customer journey correlation analysis for personalization
- Inventory demand correlation forecasting
- Price-competitor correlation optimization
- Seasonal-demographic correlation insights""",
            
            "manufacturing": """
- Process-quality correlation monitoring
- Equipment-maintenance correlation prediction
- Supply chain correlation optimization
- Energy-production correlation analysis""",
            
            "healthcare": """
- Patient-outcome correlation analysis
- Resource-demand correlation forecasting
- Risk factor correlation identification
- Cost-quality correlation optimization""",
            
            "technology": """
- User behavior correlation analysis
- Feature-adoption correlation modeling
- Performance-usage correlation monitoring
- Customer success correlation prediction""",
            
            "energy": """
- Weather-demand correlation forecasting
- Asset-performance correlation monitoring
- Grid-load correlation optimization
- Maintenance-failure correlation prediction"""
        }
        
        return demos.get(industry, "- Industry-specific correlation analysis demonstration")

    def _get_roi_discussion(self, stakeholder: str, industry: str) -> str:
        roi_discussions = {
            "ceo": f"""
**Strategic ROI:**
- Market opportunity identification: $15-30M annually
- Competitive advantage through faster decision making
- New revenue streams from correlation insights
- Risk mitigation and strategic positioning""",
            
            "cfo": f"""
**Financial ROI:**
- Total Investment: $850K (Year 1)
- Annual Returns: $16.4M (conservative estimate)
- ROI: 1,827% (Year 1)
- Payback Period: 1.9 months
- 3-Year NPV: $42.5M""",
            
            "cto": f"""
**Technology ROI:**
- 40x improvement in analytical capacity
- 60% reduction in infrastructure costs
- Elimination of scaling bottlenecks
- Future-proof quantum-ready platform"""
        }
        
        return roi_discussions.get(stakeholder, f"**Business ROI:** Significant value creation through AI-powered correlation analysis in {industry.replace('_', ' ')}")

    def _get_implementation_timeline(self) -> str:
        return """
**Phase 1 (Days 1-30):** Foundation & Quick Wins - $500K returns
**Phase 2 (Days 31-60):** Advanced Analytics - $3M+ returns  
**Phase 3 (Days 61-90):** Enterprise Scale - $8M+ returns

**Total Timeline:** 90 days to full ROI realization"""

    def _get_next_steps(self, stakeholder: str) -> str:
        next_steps = {
            "ceo": """
1. **Executive Committee Review** (Next 7 days)
2. **Custom ROI Analysis** (Delivered within 24 hours)
3. **Board Presentation** (Scheduled within 2 weeks)
4. **Implementation Planning** (Begin within 30 days)""",
            
            "cfo": """
1. **Financial Committee Approval** (Next 7 days)
2. **Detailed Cost-Benefit Analysis** (Delivered within 24 hours)
3. **Budget Allocation** (Finalized within 2 weeks)
4. **Procurement Process** (Begin within 30 days)""",
            
            "cto": """
1. **Technical Architecture Review** (Next 7 days)
2. **Integration Planning Session** (Scheduled within 1 week)
3. **Security and Compliance Review** (Completed within 2 weeks)
4. **Implementation Kickoff** (Begin within 30 days)"""
        }
        
        return next_steps.get(stakeholder, """
1. **Internal Evaluation** (Next 7 days)
2. **Custom Business Case** (Delivered within 24 hours)  
3. **Stakeholder Alignment** (Completed within 2 weeks)
4. **Implementation Planning** (Begin within 30 days)""")

    def _get_detailed_scenarios(self, industry: str, stakeholder: str) -> str:
        # This would contain detailed step-by-step demo scripts
        return f"""
### Detailed Demo Script for {industry.replace('_', ' ').title()}

**[This section would contain detailed step-by-step instructions for each demo scenario, including:**
- **Exact clicks and navigation paths**
- **Data points to highlight**
- **Questions to ask during demo**
- **Key metrics to emphasize**
- **Transition statements between sections]**

*Note: Detailed scenario scripts would be customized based on specific customer data and use cases*
"""

    def _get_objection_handling(self, stakeholder: str, industry: str) -> str:
        return f"""
### Common Objections & Responses

**"This seems too good to be true - 1,800% ROI?"**
- *Response: I understand the skepticism. Let me show you the conservative assumptions in our ROI model and share references from customers who've achieved similar results.*

**"We already have business intelligence tools"**
- *Response: Traditional BI shows you what happened. CorrelateAI discovers why it happened and predicts what will happen next through AI-powered correlation analysis.*

**"What about data security and compliance?"**
- *Response: CorrelateAI is built on Azure with enterprise-grade security, SOC 2 compliance, and industry-specific regulatory features built in.*

**"How long does implementation really take?"**
- *Response: We have a proven 90-day implementation methodology with guaranteed milestones. You'll see ROI within the first 30 days.*

**"What if it doesn't work for our specific industry?"**
- *Response: We have industry-specific correlation models and proven success in {industry.replace('_', ' ')}. Let me share some relevant case studies.*
"""

    def _get_followup_materials(self, stakeholder: str, industry: str) -> str:
        return f"""
### Materials to Send Within 24 Hours

**For {self.stakeholder_types.get(stakeholder, stakeholder)}:**
- [ ] Custom ROI analysis with company-specific parameters
- [ ] {industry.replace('_', ' ').title()} industry case studies and benchmarks
- [ ] Technical architecture overview and security documentation
- [ ] Implementation timeline and milestone framework
- [ ] Reference customer contact information
- [ ] Pricing and contract terms
- [ ] Executive presentation deck (customized)

### Follow-up Meeting Requests
- [ ] Technical deep-dive with CTO/IT team (if not primary stakeholder)
- [ ] Financial review with CFO/finance team (if not primary stakeholder)  
- [ ] Reference customer call
- [ ] Proof of concept planning session
"""

def main():
    """Generate demo scripts for different stakeholder/industry combinations"""
    generator = DemoScriptGenerator()
    
    # Example: Generate demo script for CEO of financial services company
    demo_script = generator.generate_demo_script(
        stakeholder="ceo",
        industry="financial_services", 
        company_size="enterprise",
        demo_length="30min"
    )
    
    # Save to file
    output_dir = "/Users/victorsaly/correlateAI/correlateai-enterprise/business/demo-scripts"
    os.makedirs(output_dir, exist_ok=True)
    
    filename = f"{output_dir}/ceo-financial_services-demo-script.md"
    with open(filename, 'w') as f:
        f.write(demo_script)
    
    print(f"Demo script generated: {filename}")
    
    # Generate additional combinations
    combinations = [
        ("cfo", "retail", "large", "45min"),
        ("cto", "manufacturing", "enterprise", "60min"),
        ("coo", "healthcare", "large", "30min"),
        ("head_analytics", "technology", "medium", "45min")
    ]
    
    for stakeholder, industry, size, length in combinations:
        script = generator.generate_demo_script(stakeholder, industry, size, length)
        filename = f"{output_dir}/{stakeholder}-{industry}-demo-script.md"
        with open(filename, 'w') as f:
            f.write(script)
        print(f"Demo script generated: {filename}")

if __name__ == "__main__":
    main()