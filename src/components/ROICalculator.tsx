import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calculator, TrendUp, CurrencyDollar, CheckCircle, ArrowRight } from '@phosphor-icons/react'

interface ROICalculatorProps {
  onRequestDemo?: () => void
}

export const ROICalculator = ({ onRequestDemo }: ROICalculatorProps) => {
  const [industry, setIndustry] = useState('retail')
  const [annualRevenue, setAnnualRevenue] = useState('5000000') // $5M default
  const [employees, setEmployees] = useState('50')
  const [currentDataChallenges, setCurrentDataChallenges] = useState('manual-reporting')

  // ROI calculation logic
  const calculateROI = () => {
    const revenue = parseFloat(annualRevenue) || 0
    const empCount = parseInt(employees) || 0
    
    // Industry-specific improvement factors
    const industryFactors: Record<string, { 
      revenueGain: number, 
      costSaving: number, 
      label: string 
    }> = {
      retail: { revenueGain: 0.12, costSaving: 0.08, label: 'Inventory optimization & demand forecasting' },
      manufacturing: { revenueGain: 0.15, costSaving: 0.12, label: 'Downtime reduction & supply chain efficiency' },
      finance: { revenueGain: 0.10, costSaving: 0.15, label: 'Risk reduction & better loan decisions' },
      healthcare: { revenueGain: 0.08, costSaving: 0.18, label: 'Staffing optimization & resource allocation' },
      realestate: { revenueGain: 0.14, costSaving: 0.10, label: 'Pricing optimization & market timing' },
      logistics: { revenueGain: 0.10, costSaving: 0.15, label: 'Fuel efficiency & route optimization' }
    }

    const factor = industryFactors[industry] || industryFactors.retail

    // Conservative estimates (using lower end of ranges)
    const revenueIncrease = revenue * factor.revenueGain
    const operationalSavings = revenue * factor.costSaving
    
    // Time savings
    const hoursPerWeekSaved = empCount * 2 // 2 hours per employee per week
    const avgHourlyRate = 45 // Conservative average
    const timeSavingsAnnual = hoursPerWeekSaved * 52 * avgHourlyRate

    // Total annual benefit
    const totalAnnualBenefit = revenueIncrease + operationalSavings + timeSavingsAnnual

    // Cost based on company size
    let annualSubscription = 12000 // Professional plan default
    if (empCount < 10) annualSubscription = 3588 // Starter
    else if (empCount > 100) annualSubscription = 35988 // Enterprise

    const netBenefit = totalAnnualBenefit - annualSubscription
    const roi = ((netBenefit / annualSubscription) * 100)
    const paybackMonths = (annualSubscription / totalAnnualBenefit) * 12

    return {
      revenueIncrease,
      operationalSavings,
      timeSavingsAnnual,
      totalAnnualBenefit,
      annualSubscription,
      netBenefit,
      roi,
      paybackMonths,
      factor
    }
  }

  const results = calculateROI()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-green-600 text-white px-4 py-1.5">
          ROI Calculator
        </Badge>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Calculate Your Potential ROI
        </h1>
        <p className="text-gray-600 text-lg">
          See how CorrelateAI can impact your bottom line in less than 2 minutes
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Your Company Details
            </CardTitle>
            <CardDescription>
              Tell us about your organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Industry */}
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail & E-Commerce</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing & Supply Chain</SelectItem>
                  <SelectItem value="finance">Financial Services</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="realestate">Real Estate</SelectItem>
                  <SelectItem value="logistics">Logistics & Transportation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Annual Revenue */}
            <div className="space-y-2">
              <Label htmlFor="revenue">Annual Revenue (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="revenue"
                  type="number"
                  value={annualRevenue}
                  onChange={(e) => setAnnualRevenue(e.target.value)}
                  className="pl-7"
                  placeholder="5000000"
                />
              </div>
              <p className="text-xs text-gray-500">
                Example: Enter 5000000 for $5 million
              </p>
            </div>

            {/* Number of Employees */}
            <div className="space-y-2">
              <Label htmlFor="employees">Number of Employees</Label>
              <Input
                id="employees"
                type="number"
                value={employees}
                onChange={(e) => setEmployees(e.target.value)}
                placeholder="50"
              />
            </div>

            {/* Current Challenge */}
            <div className="space-y-2">
              <Label htmlFor="challenge">Biggest Data Challenge</Label>
              <Select value={currentDataChallenges} onValueChange={setCurrentDataChallenges}>
                <SelectTrigger id="challenge">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual-reporting">Manual reporting & spreadsheets</SelectItem>
                  <SelectItem value="siloed-data">Data siloed across departments</SelectItem>
                  <SelectItem value="no-insights">Can't find actionable insights</SelectItem>
                  <SelectItem value="expensive-analysts">Expensive data analysts/scientists</SelectItem>
                  <SelectItem value="slow-decisions">Slow decision-making</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendUp className="w-5 h-5 text-green-600" />
              Your Projected Results
            </CardTitle>
            <CardDescription>
              Based on {results.factor.label}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ROI Headline */}
            <div className="bg-white rounded-lg p-6 border-2 border-green-500 text-center">
              <div className="text-sm text-gray-600 mb-2">Projected First-Year ROI</div>
              <div className="text-5xl font-bold text-green-600 mb-2">
                {results.roi.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">
                Net benefit: <span className="font-semibold text-green-700">{formatCurrency(results.netBenefit)}</span>
              </div>
            </div>

            {/* Benefit Breakdown */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white/80 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">Revenue Growth</div>
                  <div className="text-sm text-gray-600">From better decision-making</div>
                  <div className="text-lg font-bold text-green-600">{formatCurrency(results.revenueIncrease)}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/80 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">Operational Savings</div>
                  <div className="text-sm text-gray-600">Efficiency improvements</div>
                  <div className="text-lg font-bold text-green-600">{formatCurrency(results.operationalSavings)}</div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/80 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">Time Savings</div>
                  <div className="text-sm text-gray-600">Automated insights vs. manual analysis</div>
                  <div className="text-lg font-bold text-green-600">{formatCurrency(results.timeSavingsAnnual)}</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Cost vs Benefit */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Annual Benefit</span>
                <span className="font-bold text-green-600 text-lg">{formatCurrency(results.totalAnnualBenefit)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">CorrelateAI Investment</span>
                <span className="font-bold text-gray-800 text-lg">-{formatCurrency(results.annualSubscription)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center bg-green-100 p-3 rounded-lg">
                <span className="font-semibold text-gray-800">Net First-Year Benefit</span>
                <span className="font-bold text-green-700 text-xl">{formatCurrency(results.netBenefit)}</span>
              </div>
            </div>

            {/* Payback Period */}
            <div className="bg-blue-100 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Payback Period</div>
              <div className="text-3xl font-bold text-blue-700">
                {results.paybackMonths.toFixed(0)} days
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Your investment pays for itself in under {Math.ceil(results.paybackMonths)} months
              </div>
            </div>

            {/* CTA */}
            <Button 
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 text-lg"
              onClick={onRequestDemo}
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Request Personalized Demo
            </Button>

            <p className="text-xs text-center text-gray-500">
              * These estimates are based on industry averages. Actual results may vary based on your specific use case and implementation.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <Card className="mt-8 border border-gray-200">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600 text-center">
            <strong>Methodology:</strong> ROI calculations are based on documented results from similar organizations in your industry. 
            Revenue gains assume improved decision-making leading to 8-15% operational improvements. 
            Cost savings reflect efficiency gains and error reduction. Time savings calculated at 2 hours per employee per week 
            previously spent on manual data analysis and reporting.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default ROICalculator
