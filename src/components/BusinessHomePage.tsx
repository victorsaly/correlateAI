import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Briefcase, 
  TrendUp, 
  Shield, 
  Users, 
  Globe, 
  Calculator,
  Rocket,
  Target,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  Database,
  Clock,
  CurrencyDollar
} from '@phosphor-icons/react'

interface BusinessHomePageProps {
  onGetStarted: () => void
  onViewDemo: () => void
}

export const BusinessHomePage = ({ onGetStarted, onViewDemo }: BusinessHomePageProps) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)

  const industries = [
    {
      id: 'retail',
      name: 'Retail & E-Commerce',
      icon: <Briefcase className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      question: 'What really drives our sales?',
      insight: 'Weekend temperature increases correlate 0.82 with ice cream sales',
      roi: 'Optimize inventory, reduce waste, increase margins by 8-15%'
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing',
      icon: <Globe className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      question: 'Why do our production delays happen?',
      insight: 'Supplier delays correlate 0.74 with fuel price increases (3-week lag)',
      roi: 'Reduce downtime 12-20%, improve supplier negotiations'
    },
    {
      id: 'finance',
      name: 'Financial Services',
      icon: <CurrencyDollar className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      question: 'Which customers are credit risks?',
      insight: 'Late payments correlate 0.81 with regional unemployment changes',
      roi: 'Reduce default rates 10-15%, improve loan approval accuracy'
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      icon: <Shield className="w-6 h-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      question: 'How can we optimize staffing?',
      insight: 'ER visits increase 0.76 correlation with temperature extremes',
      roi: 'Reduce overtime costs 15-25%, improve patient wait times'
    },
    {
      id: 'realestate',
      name: 'Real Estate',
      icon: <Target className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      question: 'What affects property values?',
      insight: 'Rental demand correlates 0.79 with new business openings within 2km',
      roi: 'Better pricing strategies, identify growth markets early'
    },
    {
      id: 'logistics',
      name: 'Logistics',
      icon: <Globe className="w-6 h-6" />,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      question: 'How do we reduce fuel costs?',
      insight: 'Fuel efficiency drops 0.68 with route changes during peak hours',
      roi: 'Reduce fuel costs 10-18%, improve delivery estimates'
    }
  ]

  const features = [
    {
      icon: <Database className="w-5 h-5" />,
      title: 'Connect Your Data',
      description: 'Excel, SQL databases, CRM, ERP - no coding required'
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: 'AI-Powered Insights',
      description: 'Plain English explanations, not technical jargon'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Detect False Patterns',
      description: 'Avoid costly mistakes from spurious correlations'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Go Live in Days',
      description: 'Fast implementation, immediate value'
    }
  ]

  const roi = [
    { metric: 'Average ROI', value: '316%', period: 'First year' },
    { metric: 'Payback Period', value: '90 days', period: 'Or less' },
    { metric: 'Time Savings', value: '80%', period: 'vs hiring data scientists' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge className="mb-4 bg-blue-600 text-white px-4 py-1.5 text-sm">
            For Business Decision Makers
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Turn Your Data Into Decisions
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Discover hidden relationships in your business data that drive revenue and reduce costs.
            <br />
            <span className="font-semibold">No data science degree required.</span>
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg"
              onClick={onGetStarted}
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-6 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={onViewDemo}
            >
              <Target className="w-5 h-5 mr-2" />
              See Live Demo
            </Button>
          </div>
        </div>

        {/* ROI Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          {roi.map((item, idx) => (
            <Card key={idx} className="border-2 border-blue-200 bg-white/80 backdrop-blur">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{item.value}</div>
                <div className="font-semibold text-gray-800">{item.metric}</div>
                <div className="text-sm text-gray-600">{item.period}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Problem Statement */}
        <Card className="mb-16 border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-orange-600" />
              The Business Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 leading-relaxed">
              Your organization collects massive amounts of data across sales, operations, finance, HR, and supply chain. 
              But <span className="font-bold">connecting the dots is expensive and time-consuming</span>. 
              Hiring data scientists costs $150K+ per year. Waiting for IT takes months. 
              Meanwhile, <span className="font-bold text-red-600">hidden insights that could save or make millions remain buried in spreadsheets</span>.
            </p>
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How CorrelateAI Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="border-2 border-blue-100 hover:border-blue-300 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3 text-blue-600">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Industry Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4">See Your Industry</h2>
          <p className="text-center text-gray-600 mb-8 text-lg">
            Click an industry to see real-world examples
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {industries.map((industry) => (
              <Card 
                key={industry.id}
                className={`cursor-pointer transition-all hover:shadow-xl border-2 ${
                  selectedIndustry === industry.id 
                    ? 'border-blue-500 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedIndustry(selectedIndustry === industry.id ? null : industry.id)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-full ${industry.bgColor} flex items-center justify-center mb-3 ${industry.color}`}>
                    {industry.icon}
                  </div>
                  <CardTitle className="text-lg">{industry.name}</CardTitle>
                  <CardDescription className="font-semibold text-gray-700">
                    "{industry.question}"
                  </CardDescription>
                </CardHeader>
                {selectedIndustry === industry.id && (
                  <CardContent className="border-t pt-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-gray-500 mb-1">EXAMPLE INSIGHT</div>
                        <p className="text-sm font-medium text-blue-600">💡 {industry.insight}</p>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500 mb-1">ROI IMPACT</div>
                        <p className="text-sm font-medium text-green-600">💰 {industry.roi}</p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <Card className="mb-16 border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-green-600" />
              Enterprise-Grade Security & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold mb-1">Your Data Stays Private</div>
                <div className="text-sm text-gray-600">On-premise deployment available</div>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold mb-1">Compliance Ready</div>
                <div className="text-sm text-gray-600">GDPR, HIPAA, SOC 2 certified</div>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold mb-1">Role-Based Access</div>
                <div className="text-sm text-gray-600">Control who sees what data</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Proof */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Trusted By Organizations Like Yours</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Organizations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">$40M+</div>
              <div className="text-gray-600">Cost Savings Identified</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10M+</div>
              <div className="text-gray-600">Data Points Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">94%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="border-4 border-blue-500 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Unlock Your Data's Potential?</h2>
            <p className="text-xl mb-8 opacity-90">
              Start your free 14-day trial. No credit card required.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={onGetStarted}
              >
                <Rocket className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => window.open('/docs/business-value-proposition.md', '_blank')}
              >
                <Users className="w-5 h-5 mr-2" />
                IT Reseller Program
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BusinessHomePage
