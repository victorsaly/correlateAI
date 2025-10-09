/**
 * Advanced Quantum Correlation Display Component
 * 
 * Displays cutting-edge quantum concepts inspired by "Beyond the Quantum":
 * - Quantum entanglement analysis with Bell state classification
 * - Quantum interference patterns and decoherence
 * - Multi-qubit correlation analysis
 * - Non-local correlation detection using Bell inequalities
 * - Hybrid quantum-classical computation results
 */

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { 
  Atom,
  Zap,
  Waves,
  Target,
  Brain,
  Activity,
  ChevronDown,
  ChevronRight,
  Info,
  AlertTriangle,
  CheckCircle,
  Cpu,
  Network,
  Clock,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import { AdvancedQuantumCorrelationResult } from '@/services/advancedQuantumCorrelationService'

interface AdvancedQuantumDisplayProps {
  result: AdvancedQuantumCorrelationResult
  variable1Name: string
  variable2Name: string
  className?: string
}

export function AdvancedQuantumDisplay({
  result,
  variable1Name,
  variable2Name,
  className = ''
}: AdvancedQuantumDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    entanglement: true,
    interference: false,
    multiQubit: false,
    nonLocal: false,
    hybrid: false,
    advanced: false,
    temporal: false
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const getBellStateColor = (bellState: string) => {
    switch (bellState) {
      case 'φ+': return 'bg-green-100 text-green-800'
      case 'φ-': return 'bg-blue-100 text-blue-800'
      case 'ψ+': return 'bg-purple-100 text-purple-800'
      case 'ψ-': return 'bg-orange-100 text-orange-800'
      case 'mixed': return 'bg-yellow-100 text-yellow-800'
      case 'separable': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getQuantumAdvantageColor = (advantage: number) => {
    if (advantage > 0.8) return 'text-green-600 bg-green-50'
    if (advantage > 0.5) return 'text-blue-600 bg-blue-50'
    if (advantage > 0.2) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  const formatComplex = (complex: { real: number; imaginary: number }) => {
    const real = complex.real.toFixed(3)
    const imag = complex.imaginary.toFixed(3)
    const sign = complex.imaginary >= 0 ? '+' : ''
    return `${real}${sign}${imag}i`
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quantum Entanglement Analysis */}
      <Collapsible 
        open={expandedSections.entanglement} 
        onOpenChange={() => toggleSection('entanglement')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-purple-50/50 transition-colors border-purple-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-purple-700">
                  <Atom className="h-5 w-5" />
                  Quantum Entanglement Analysis
                  {expandedSections.entanglement ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className={getBellStateColor(result.quantumEntanglement.bellStateClassification)}>
                    |{result.quantumEntanglement.bellStateClassification}⟩
                  </Badge>
                  <Badge variant="outline">
                    {(result.quantumEntanglement.entanglementStrength * 100).toFixed(1)}% entangled
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-purple-600">
                Bell state analysis and quantum correlation measurement
              </CardDescription>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="border-purple-200 bg-purple-50/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Entanglement Strength</div>
                  <div className="text-xl font-bold text-purple-600">
                    {(result.quantumEntanglement.entanglementStrength * 100).toFixed(1)}%
                  </div>
                  <Progress value={result.quantumEntanglement.entanglementStrength * 100} className="h-1 mt-2" />
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Concurrence</div>
                  <div className="text-xl font-bold text-purple-600">
                    {result.quantumEntanglement.concurrence.toFixed(3)}
                  </div>
                  <Progress value={result.quantumEntanglement.concurrence * 100} className="h-1 mt-2" />
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Mutual Information</div>
                  <div className="text-xl font-bold text-purple-600">
                    {result.quantumEntanglement.quantumMutualInformation.toFixed(3)} bits
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Formation</div>
                  <div className="text-xl font-bold text-purple-600">
                    {result.quantumEntanglement.entanglementOfFormation.toFixed(3)}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-purple-700 mb-2">Bell State Classification</h4>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getBellStateColor(result.quantumEntanglement.bellStateClassification)}>
                    |{result.quantumEntanglement.bellStateClassification}⟩ State
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {result.quantumEntanglement.bellStateClassification === 'φ+' && '(|00⟩ + |11⟩)/√2 - Maximally entangled'}
                    {result.quantumEntanglement.bellStateClassification === 'φ-' && '(|00⟩ - |11⟩)/√2 - Maximally entangled'}
                    {result.quantumEntanglement.bellStateClassification === 'ψ+' && '(|01⟩ + |10⟩)/√2 - Maximally entangled'}
                    {result.quantumEntanglement.bellStateClassification === 'ψ-' && '(|01⟩ - |10⟩)/√2 - Maximally entangled'}
                    {result.quantumEntanglement.bellStateClassification === 'mixed' && 'Mixed quantum state'}
                    {result.quantumEntanglement.bellStateClassification === 'separable' && 'Separable (no entanglement)'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Quantum Interpretation:</strong> The correlation between {variable1Name} and {variable2Name} exhibits 
                  quantum entanglement properties characteristic of a {result.quantumEntanglement.bellStateClassification} Bell state, 
                  indicating {result.quantumEntanglement.entanglementStrength > 0.5 ? 'strong' : 'weak'} quantum correlations 
                  beyond classical statistical relationships.
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Quantum Interference Patterns */}
      <Collapsible 
        open={expandedSections.interference} 
        onOpenChange={() => toggleSection('interference')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-blue-50/50 transition-colors border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-blue-700">
                  <Waves className="h-5 w-5" />
                  Quantum Interference Patterns
                  {expandedSections.interference ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <Badge className={
                  result.quantumInterference.interferencePattern === 'constructive' ? 'bg-green-100 text-green-800' :
                  result.quantumInterference.interferencePattern === 'destructive' ? 'bg-red-100 text-red-800' :
                  result.quantumInterference.interferencePattern === 'mixed' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {result.quantumInterference.interferencePattern}
                </Badge>
              </div>
              <CardDescription className="text-blue-600">
                Temporal quantum coherence and decoherence analysis
              </CardDescription>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="border-blue-200 bg-blue-50/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Interference Strength</div>
                  <div className="text-xl font-bold text-blue-600">
                    {result.quantumInterference.interferenceStrength.toFixed(3)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {result.quantumInterference.interferenceStrength > 0 ? 'Constructive' : 'Destructive'}
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Phase Coherence</div>
                  <div className="text-xl font-bold text-blue-600">
                    {(result.quantumInterference.phaseCoherence * 100).toFixed(1)}%
                  </div>
                  <Progress value={result.quantumInterference.phaseCoherence * 100} className="h-1 mt-1" />
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Quantum Fidelity</div>
                  <div className="text-xl font-bold text-blue-600">
                    {(result.quantumInterference.quantumFidelity * 100).toFixed(1)}%
                  </div>
                  <Progress value={result.quantumInterference.quantumFidelity * 100} className="h-1 mt-1" />
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Decoherence Rate</div>
                  <div className="text-xl font-bold text-blue-600">
                    {(result.quantumInterference.decoherenceRate * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-blue-700 mb-2">Interference Analysis</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Pattern Type:</strong> {result.quantumInterference.interferencePattern} interference detected 
                    between quantum states representing temporal correlation evolution.
                  </p>
                  <p>
                    <strong>Quantum Coherence:</strong> Phase relationships maintain 
                    {(result.quantumInterference.phaseCoherence * 100).toFixed(1)}% coherence across time series data points.
                  </p>
                  <p>
                    <strong>Decoherence Effects:</strong> Environmental decoherence introduces 
                    {(result.quantumInterference.decoherenceRate * 100).toFixed(1)}% information loss in quantum correlations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Multi-Qubit Analysis */}
      <Collapsible 
        open={expandedSections.multiQubit} 
        onOpenChange={() => toggleSection('multiQubit')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-green-50/50 transition-colors border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-green-700">
                  <Network className="h-5 w-5" />
                  Multi-Qubit Correlation Analysis
                  {expandedSections.multiQubit ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <Badge variant="outline">
                  {result.multiQubitAnalysis.qubitRepresentation.totalQubits} qubits
                </Badge>
              </div>
              <CardDescription className="text-green-600">
                Quantum register representation and von Neumann entropy
              </CardDescription>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="border-green-200 bg-green-50/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Quantum Register</div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {result.multiQubitAnalysis.qubitRepresentation.totalQubits}
                  </div>
                  <div className="text-xs text-gray-500">
                    {result.multiQubitAnalysis.qubitRepresentation.variable1Qubits} + {result.multiQubitAnalysis.qubitRepresentation.variable2Qubits} qubits
                  </div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Von Neumann Entropy</div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {result.multiQubitAnalysis.quantumRegisterEntropy.toFixed(3)}
                  </div>
                  <div className="text-xs text-gray-500">bits</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">State Vector Dim</div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {result.multiQubitAnalysis.quantumStateVector.length}
                  </div>
                  <div className="text-xs text-gray-500">
                    2^{result.multiQubitAnalysis.qubitRepresentation.totalQubits} basis states
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border mb-4">
                <h4 className="font-semibold text-green-700 mb-3">Quantum State Vector</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
                  {result.multiQubitAnalysis.quantumStateVector.slice(0, 8).map((amplitude, idx) => (
                    <div key={idx} className="p-2 bg-gray-50 rounded">
                      <div className="font-semibold">|{idx.toString(2).padStart(2, '0')}⟩</div>
                      <div className="text-green-600">{formatComplex(amplitude)}</div>
                    </div>
                  ))}
                </div>
                {result.multiQubitAnalysis.quantumStateVector.length > 8 && (
                  <div className="text-center text-gray-500 text-xs mt-2">
                    ... showing first 8 of {result.multiQubitAnalysis.quantumStateVector.length} basis states
                  </div>
                )}
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-green-700 mb-2">Measurement Probabilities</h4>
                <div className="space-y-2">
                  {result.multiQubitAnalysis.measurementProbabilities.slice(0, 4).map((prob, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm font-mono">|{idx.toString(2).padStart(2, '0')}⟩</span>
                      <div className="flex items-center gap-2 flex-1 ml-4">
                        <Progress value={prob * 100} className="h-2" />
                        <span className="text-sm w-12">{(prob * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Non-Local Correlations */}
      <Collapsible 
        open={expandedSections.nonLocal} 
        onOpenChange={() => toggleSection('nonLocal')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-orange-50/50 transition-colors border-orange-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-orange-700">
                  <Target className="h-5 w-5" />
                  Non-Local Correlation Detection
                  {expandedSections.nonLocal ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className={
                    result.nonLocalCorrelations.nonLocalityStrength === 'maximal' ? 'bg-red-100 text-red-800' :
                    result.nonLocalCorrelations.nonLocalityStrength === 'strong' ? 'bg-orange-100 text-orange-800' :
                    result.nonLocalCorrelations.nonLocalityStrength === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    result.nonLocalCorrelations.nonLocalityStrength === 'weak' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {result.nonLocalCorrelations.nonLocalityStrength}
                  </Badge>
                  <Badge variant={result.nonLocalCorrelations.chshValue > 2 ? "default" : "secondary"}>
                    CHSH: {result.nonLocalCorrelations.chshValue.toFixed(3)}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-orange-600">
                Bell inequality violations and quantum advantage measurement
              </CardDescription>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="border-orange-200 bg-orange-50/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">CHSH Value</div>
                  <div className="text-xl font-bold text-orange-600">
                    {result.nonLocalCorrelations.chshValue.toFixed(3)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Classical limit: 2.0
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Bell Violation</div>
                  <div className="text-xl font-bold text-orange-600">
                    {result.nonLocalCorrelations.bellInequalityViolation.toFixed(3)}
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Quantum Advantage</div>
                  <div className="text-xl font-bold text-orange-600">
                    {result.nonLocalCorrelations.quantumAdvantage.toFixed(3)}
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Separability</div>
                  <div className="text-sm font-bold text-orange-600">
                    {result.nonLocalCorrelations.separabilityTest}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-orange-700 mb-2">Bell Inequality Analysis</h4>
                <div className="space-y-3">
                  {result.nonLocalCorrelations.chshValue > 2 ? (
                    <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-orange-700">
                        <strong>Bell Inequality Violation Detected:</strong> CHSH value of {result.nonLocalCorrelations.chshValue.toFixed(3)} 
                        exceeds the classical bound of 2.0, indicating genuine quantum non-local correlations between {variable1Name} and {variable2Name}.
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <Info className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-700">
                        <strong>Classical Correlations:</strong> CHSH value of {result.nonLocalCorrelations.chshValue.toFixed(3)} 
                        does not exceed the classical bound, suggesting correlations can be explained by local hidden variable theories.
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    <strong>Non-locality Strength:</strong> {result.nonLocalCorrelations.nonLocalityStrength} quantum non-locality detected.
                    {result.nonLocalCorrelations.nonLocalityStrength === 'maximal' && ' This approaches the theoretical quantum maximum (Tsirelson bound).'}
                    {result.nonLocalCorrelations.nonLocalityStrength === 'strong' && ' Significant violation of local realism.'}
                    {result.nonLocalCorrelations.nonLocalityStrength === 'moderate' && ' Moderate quantum correlations beyond classical limit.'}
                    {result.nonLocalCorrelations.nonLocalityStrength === 'weak' && ' Weak quantum signatures detected.'}
                    {result.nonLocalCorrelations.nonLocalityStrength === 'none' && ' No quantum advantage over classical correlations.'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Advanced Quantum Metrics */}
      <Collapsible 
        open={expandedSections.advanced} 
        onOpenChange={() => toggleSection('advanced')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-indigo-50/50 transition-colors border-indigo-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-indigo-700">
                  <Brain className="h-5 w-5" />
                  Advanced Quantum Metrics
                  {expandedSections.advanced ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <Badge variant="outline">
                  {result.advancedMetrics.quantumSpeedupFactor.toFixed(1)}x speedup
                </Badge>
              </div>
              <CardDescription className="text-indigo-600">
                Quantum discord, coherence, and algorithmic complexity
              </CardDescription>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="border-indigo-200 bg-indigo-50/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Quantum Discord</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {result.advancedMetrics.quantumDiscord.toFixed(3)}
                  </div>
                  <div className="text-xs text-gray-500">Beyond entanglement</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Quantum Coherence</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {result.advancedMetrics.quantumCoherence.toFixed(3)}
                  </div>
                  <Progress value={result.advancedMetrics.quantumCoherence * 100} className="h-1 mt-2" />
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Information Capacity</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {result.advancedMetrics.quantumCapacity.toFixed(3)}
                  </div>
                  <div className="text-xs text-gray-500">bits</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-indigo-700 mb-2">Quantum Speedup</h4>
                  <div className="text-3xl font-bold text-indigo-600 mb-1">
                    {result.advancedMetrics.quantumSpeedupFactor.toFixed(1)}×
                  </div>
                  <div className="text-sm text-gray-600">
                    Theoretical speedup over classical correlation analysis
                  </div>
                  <Progress value={Math.min(100, result.advancedMetrics.quantumSpeedupFactor * 25)} className="h-2 mt-2" />
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-indigo-700 mb-2">Algorithmic Complexity</h4>
                  <div className="text-3xl font-bold text-indigo-600 mb-1">
                    {result.advancedMetrics.quantumAlgorithmicComplexity.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Quantum Kolmogorov complexity measure
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Temporal Quantum Dynamics */}
      <Collapsible 
        open={expandedSections.temporal} 
        onOpenChange={() => toggleSection('temporal')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-teal-50/50 transition-colors border-teal-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-teal-700">
                  <Clock className="h-5 w-5" />
                  Temporal Quantum Dynamics
                  {expandedSections.temporal ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <Badge variant="outline">
                  {result.temporalQuantumDynamics.decoherenceTime.toFixed(1)} time units
                </Badge>
              </div>
              <CardDescription className="text-teal-600">
                Time evolution and quantum memory effects
              </CardDescription>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="border-teal-200 bg-teal-50/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Decoherence Time</div>
                  <div className="text-2xl font-bold text-teal-600">
                    {result.temporalQuantumDynamics.decoherenceTime.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500">time units</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Memory Effect</div>
                  <div className="text-2xl font-bold text-teal-600">
                    {(result.temporalQuantumDynamics.quantumMemoryEffect * 100).toFixed(1)}%
                  </div>
                  <Progress value={result.temporalQuantumDynamics.quantumMemoryEffect * 100} className="h-1 mt-2" />
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Evolution Points</div>
                  <div className="text-2xl font-bold text-teal-600">
                    {result.temporalQuantumDynamics.quantumEvolution.length}
                  </div>
                  <div className="text-xs text-gray-500">temporal samples</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-teal-700 mb-3">Quantum Evolution Trajectory</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Initial Fidelity</span>
                    <span>Final Fidelity</span>
                  </div>
                  <Progress 
                    value={result.temporalQuantumDynamics.quantumEvolution[result.temporalQuantumDynamics.quantumEvolution.length - 1] * 100} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1.000</span>
                    <span>{result.temporalQuantumDynamics.quantumEvolution[result.temporalQuantumDynamics.quantumEvolution.length - 1]?.toFixed(3)}</span>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    <strong>Temporal Analysis:</strong> Quantum correlations show 
                    {result.temporalQuantumDynamics.quantumMemoryEffect > 0.5 ? ' persistent ' : ' decaying '}
                    memory effects over time, with a characteristic decoherence timescale of 
                    {result.temporalQuantumDynamics.decoherenceTime.toFixed(1)} time units.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default AdvancedQuantumDisplay