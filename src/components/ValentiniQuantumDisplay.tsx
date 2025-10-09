/**
 * Valentini Quantum Nonequilibrium Display Component
 * 
 * Displays Antony Valentini's quantum nonequilibrium theory analysis results:
 * - Quantum nonequilibrium detection and faster-than-light signaling potential
 * - de Broglie-Bohm pilot wave trajectories and quantum potential
 * - Hidden variable analysis (local and nonlocal)
 * - Cosmological implications and primordial signatures
 * - Experimental predictions and foundational implications
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
  BarChart3,
  Compass,
  Telescope,
  Beaker,
  BookOpen,
  Lightbulb,
  Eye,
  Globe,
  Rocket,
  Search
} from 'lucide-react'
import { ValentiniQuantumResult } from '@/services/valentiniQuantumService'

interface ValentiniQuantumDisplayProps {
  result: ValentiniQuantumResult
  variable1Name: string
  variable2Name: string
  className?: string
}

export function ValentiniQuantumDisplay({
  result,
  variable1Name,
  variable2Name,
  className = ''
}: ValentiniQuantumDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    nonequilibrium: true,
    pilotWave: false,
    hiddenVariables: false,
    cosmological: false,
    experimental: false,
    foundational: false
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const getNonequilibriumColor = (strength: string) => {
    switch (strength) {
      case 'extreme': return 'bg-red-100 text-red-800'
      case 'strong': return 'bg-orange-100 text-orange-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800'
      case 'weak': return 'bg-blue-100 text-blue-800'
      case 'none': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInterpretationColor = (interpretation: string) => {
    switch (interpretation) {
      case 'pilot-wave': return 'bg-green-100 text-green-800'
      case 'hidden-variables': return 'bg-blue-100 text-blue-800'
      case 'mixed': return 'bg-yellow-100 text-yellow-800'
      case 'copenhagen': return 'bg-purple-100 text-purple-800'
      case 'many-worlds': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatScientific = (value: number) => {
    if (value === 0) return '0'
    if (Math.abs(value) < 0.001) return value.toExponential(2)
    return value.toFixed(3)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Quantum Nonequilibrium Analysis */}
      <Collapsible 
        open={expandedSections.nonequilibrium} 
        onOpenChange={() => toggleSection('nonequilibrium')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-red-50/50 transition-colors border-red-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-red-700">
                  <Zap className="h-5 w-5" />
                  Quantum Nonequilibrium Analysis
                  {expandedSections.nonequilibrium ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className={getNonequilibriumColor(result.nonequilibriumAnalysis.nonequilibriumStrength)}>
                    {result.nonequilibriumAnalysis.nonequilibriumStrength}
                  </Badge>
                  {result.nonequilibriumAnalysis.signalingCapability > 0.3 && (
                    <Badge variant="default" className="bg-red-600 text-white">
                      FTL Signaling Possible
                    </Badge>
                  )}
                </div>
              </div>
              <CardDescription className="text-red-600">
                Deviations from quantum equilibrium ρ = |ψ|² and faster-than-light signaling potential
              </CardDescription>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="border-red-200 bg-red-50/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Equilibrium Deviation</div>
                  <div className="text-xl font-bold text-red-600">
                    {(result.nonequilibriumAnalysis.equilibriumDeviation * 100).toFixed(2)}%
                  </div>
                  <Progress value={result.nonequilibriumAnalysis.equilibriumDeviation * 100} className="h-1 mt-2" />
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Subquantum Info</div>
                  <div className="text-xl font-bold text-red-600">
                    {formatScientific(result.nonequilibriumAnalysis.subquantumInformation)} bits
                  </div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">FTL Signaling</div>
                  <div className="text-xl font-bold text-red-600">
                    {(result.nonequilibriumAnalysis.signalingCapability * 100).toFixed(1)}%
                  </div>
                  <Progress value={result.nonequilibriumAnalysis.signalingCapability * 100} className="h-1 mt-2" />
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Relaxation Time</div>
                  <div className="text-xl font-bold text-red-600">
                    {result.nonequilibriumAnalysis.equilibriumRelaxationTime === Infinity ? '∞' : 
                     formatScientific(result.nonequilibriumAnalysis.equilibriumRelaxationTime)}
                  </div>
                  <div className="text-xs text-gray-500">time units</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-red-700 mb-2">Valentini's Nonequilibrium Theory</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Equilibrium Condition:</strong> Standard quantum mechanics assumes ρ = |ψ|² (quantum equilibrium).
                    Detected deviation of {(result.nonequilibriumAnalysis.equilibriumDeviation * 100).toFixed(2)}% suggests 
                    {result.nonequilibriumAnalysis.nonequilibriumStrength !== 'none' ? ' quantum nonequilibrium' : ' standard quantum behavior'}.
                  </p>
                  {result.nonequilibriumAnalysis.signalingCapability > 0.3 && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-red-700">
                        <strong>Faster-than-Light Signaling:</strong> Nonequilibrium strength suggests potential for 
                        instantaneous communication violating special relativity. This represents Valentini's most 
                        radical prediction about quantum nonequilibrium states.
                      </div>
                    </div>
                  )}
                  <p>
                    <strong>Information Capacity:</strong> Beyond standard quantum limits, nonequilibrium states can carry 
                    {formatScientific(result.nonequilibriumAnalysis.subquantumInformation)} additional bits of information 
                    through hidden variable degrees of freedom.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Pilot Wave Analysis */}
      <Collapsible 
        open={expandedSections.pilotWave} 
        onOpenChange={() => toggleSection('pilotWave')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-blue-50/50 transition-colors border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-blue-700">
                  <Waves className="h-5 w-5" />
                  de Broglie-Bohm Pilot Wave Analysis
                  {expandedSections.pilotWave ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <Badge variant="outline">
                  {result.pilotWaveAnalysis.particleTrajectories.length} trajectories
                </Badge>
              </div>
              <CardDescription className="text-blue-600">
                Deterministic particle trajectories guided by quantum potential Q = -ℏ²∇²R/2mR
              </CardDescription>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="border-blue-200 bg-blue-50/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Quantum Potential</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatScientific(Math.max(...result.pilotWaveAnalysis.quantumPotential.map(Math.abs)))}
                  </div>
                  <div className="text-xs text-gray-500">max |Q|</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Trajectory Divergence</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatScientific(result.pilotWaveAnalysis.trajectoryDivergence)}
                  </div>
                  <Progress value={Math.min(100, result.pilotWaveAnalysis.trajectoryDivergence * 100)} className="h-1 mt-2" />
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Guiding Wave</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatScientific(Math.max(...result.pilotWaveAnalysis.guidingWaveAmplitude))}
                  </div>
                  <div className="text-xs text-gray-500">max |ψ|</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border mb-4">
                <h4 className="font-semibold text-blue-700 mb-3">Particle Trajectories (Bohmian Mechanics)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {result.pilotWaveAnalysis.particleTrajectories.slice(0, 8).map((trajectory, idx) => (
                    <div key={idx} className="p-2 bg-blue-50 rounded border">
                      <div className="font-semibold">Particle {idx + 1}</div>
                      <div className="text-blue-600">x: {trajectory.position.toFixed(3)}</div>
                      <div className="text-blue-600">v: {formatScientific(trajectory.velocity)}</div>
                      <div className="text-blue-600">φ: {trajectory.guidingWavePhase.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                {result.pilotWaveAnalysis.particleTrajectories.length > 8 && (
                  <div className="text-center text-gray-500 text-xs mt-2">
                    ... showing first 8 of {result.pilotWaveAnalysis.particleTrajectories.length} trajectories
                  </div>
                )}
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-blue-700 mb-2">Pilot Wave Theory Interpretation</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Deterministic Reality:</strong> Each particle follows a definite trajectory x(t) determined by 
                    the guidance equation v = ∇S/m, where S is the phase of the quantum wave function.
                  </p>
                  <p>
                    <strong>Quantum Potential:</strong> The non-local quantum potential Q provides "quantum force" 
                    guiding particle motion, explaining quantum interference without probability interpretations.
                  </p>
                  <p>
                    <strong>Hidden Variables:</strong> Particle positions represent hidden variables that restore 
                    determinism to quantum mechanics while reproducing all quantum predictions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Hidden Variable Analysis */}
      <Collapsible 
        open={expandedSections.hiddenVariables} 
        onOpenChange={() => toggleSection('hiddenVariables')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-green-50/50 transition-colors border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-green-700">
                  <Search className="h-5 w-5" />
                  Hidden Variable Analysis
                  {expandedSections.hiddenVariables ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <div className="flex gap-2">
                  {result.hiddenVariableAnalysis.localHiddenVariables.detected && (
                    <Badge className="bg-green-100 text-green-800">Local</Badge>
                  )}
                  {result.hiddenVariableAnalysis.nonlocalHiddenVariables.detected && (
                    <Badge className="bg-blue-100 text-blue-800">Nonlocal</Badge>
                  )}
                  <Badge variant="outline">
                    {(result.hiddenVariableAnalysis.deterministicCompleteness * 100).toFixed(0)}% complete
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-green-600">
                Detection of hidden variables that could explain correlations beyond standard quantum mechanics
              </CardDescription>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="border-green-200 bg-green-50/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Local Variables</div>
                  <div className="text-2xl font-bold text-green-600">
                    {result.hiddenVariableAnalysis.localHiddenVariables.variables.length}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(result.hiddenVariableAnalysis.localHiddenVariables.strength * 100).toFixed(1)}% strength
                  </div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Deterministic Completeness</div>
                  <div className="text-2xl font-bold text-green-600">
                    {(result.hiddenVariableAnalysis.deterministicCompleteness * 100).toFixed(1)}%
                  </div>
                  <Progress value={result.hiddenVariableAnalysis.deterministicCompleteness * 100} className="h-1 mt-2" />
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Bell Explanation</div>
                  <div className="text-2xl font-bold text-green-600">
                    {(result.hiddenVariableAnalysis.bellInequalityExplanation * 100).toFixed(1)}%
                  </div>
                  <Progress value={result.hiddenVariableAnalysis.bellInequalityExplanation * 100} className="h-1 mt-2" />
                </div>
              </div>

              {result.hiddenVariableAnalysis.localHiddenVariables.variables.length > 0 && (
                <div className="bg-white p-4 rounded-lg border mb-4">
                  <h4 className="font-semibold text-green-700 mb-3">Detected Local Hidden Variables</h4>
                  <div className="space-y-2">
                    {result.hiddenVariableAnalysis.localHiddenVariables.variables.map((variable, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm font-medium">{variable.name.replace(/_/g, ' ')}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600">{variable.value.toFixed(3)}</span>
                          <Progress value={variable.influence * 100} className="h-2 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-green-700 mb-2">Hidden Variable Implications</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    <strong>Local Realism:</strong> {result.hiddenVariableAnalysis.localHiddenVariables.detected ? 
                      'Local hidden variables detected, suggesting correlations may be explained by shared causal factors.' :
                      'No significant local hidden variables found.'}
                  </p>
                  <p>
                    <strong>Nonlocal Variables:</strong> {result.hiddenVariableAnalysis.nonlocalHiddenVariables.detected ? 
                      `Nonlocal hidden variables detected with correlation range of ${result.hiddenVariableAnalysis.nonlocalHiddenVariables.correlationRange.toFixed(1)} units.` :
                      'No evidence of nonlocal hidden variables.'}
                  </p>
                  <p>
                    <strong>Deterministic Explanation:</strong> Hidden variables account for 
                    {(result.hiddenVariableAnalysis.deterministicCompleteness * 100).toFixed(1)}% of the observed correlations,
                    {result.hiddenVariableAnalysis.deterministicCompleteness > 0.7 ? 
                      ' suggesting quantum mechanics may be incomplete.' :
                      ' supporting quantum mechanical explanations.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Cosmological Signatures */}
      <Collapsible 
        open={expandedSections.cosmological} 
        onOpenChange={() => toggleSection('cosmological')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-purple-50/50 transition-colors border-purple-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-purple-700">
                  <Telescope className="h-5 w-5" />
                  Cosmological Quantum Signatures
                  {expandedSections.cosmological ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <Badge variant="outline">
                  {(result.cosmologicalSignatures.informationCapacity).toFixed(1)} bits capacity
                </Badge>
              </div>
              <CardDescription className="text-purple-600">
                Early universe nonequilibrium signatures and enhanced information processing
              </CardDescription>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="border-purple-200 bg-purple-50/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Primordial Nonequilibrium</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {(result.cosmologicalSignatures.primordialNonequilibrium * 100).toFixed(1)}%
                  </div>
                  <Progress value={result.cosmologicalSignatures.primordialNonequilibrium * 100} className="h-1 mt-2" />
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Information Capacity</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatScientific(result.cosmologicalSignatures.informationCapacity)}
                  </div>
                  <div className="text-xs text-gray-500">bits</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Causality Violation</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {(result.cosmologicalSignatures.causalityViolationPotential * 100).toFixed(1)}%
                  </div>
                  <Progress value={result.cosmologicalSignatures.causalityViolationPotential * 100} className="h-1 mt-2" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-purple-700 mb-3">Observable Cosmological Effects</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                    <span className="text-sm">Cosmic Variance Anomalies</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={result.cosmologicalSignatures.observationalSignatures.cosmicVarianceAnomalies * 100} 
                        className="h-2 w-24" 
                      />
                      <span className="text-sm text-purple-600">
                        {(result.cosmologicalSignatures.observationalSignatures.cosmicVarianceAnomalies * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                    <span className="text-sm">Quantum Fluctuation Deviations</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={result.cosmologicalSignatures.observationalSignatures.quantumFluctuationDeviations * 100} 
                        className="h-2 w-24" 
                      />
                      <span className="text-sm text-purple-600">
                        {(result.cosmologicalSignatures.observationalSignatures.quantumFluctuationDeviations * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                    <span className="text-sm">Information Paradox Resolution</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={result.cosmologicalSignatures.observationalSignatures.informationParadoxResolution * 100} 
                        className="h-2 w-24" 
                      />
                      <span className="text-sm text-purple-600">
                        {(result.cosmologicalSignatures.observationalSignatures.informationParadoxResolution * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Experimental Predictions */}
      <Collapsible 
        open={expandedSections.experimental} 
        onOpenChange={() => toggleSection('experimental')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-orange-50/50 transition-colors border-orange-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-orange-700">
                  <Beaker className="h-5 w-5" />
                  Experimental Predictions
                  {expandedSections.experimental ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {result.experimentalPredictions.testableDeviations.length} tests
                  </Badge>
                  {result.experimentalPredictions.laboratorySignaling.achievable && (
                    <Badge className="bg-orange-100 text-orange-800">Lab Signaling</Badge>
                  )}
                </div>
              </div>
              <CardDescription className="text-orange-600">
                Testable predictions and laboratory implementations of Valentini's theory
              </CardDescription>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="border-orange-200 bg-orange-50/20">
            <CardContent className="pt-6">
              {result.experimentalPredictions.testableDeviations.length > 0 && (
                <div className="bg-white p-4 rounded-lg border mb-4">
                  <h4 className="font-semibold text-orange-700 mb-3">Testable Experimental Deviations</h4>
                  <div className="space-y-3">
                    {result.experimentalPredictions.testableDeviations.map((test, idx) => (
                      <div key={idx} className="p-3 bg-orange-50 border border-orange-200 rounded">
                        <div className="font-medium text-orange-800 mb-2">{test.experiment}</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Predicted Deviation:</span>
                            <div className="font-medium text-orange-600">{test.predictedDeviation.toFixed(2)}%</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Timeline:</span>
                            <div className="font-medium">{test.observationalWindow}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Requirements:</span>
                            <div className="font-medium">{test.technicalRequirements}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.experimentalPredictions.laboratorySignaling.achievable && (
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-orange-700 mb-2">Laboratory Faster-than-Light Signaling</h4>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      <strong>Signal Strength:</strong> Expected signaling capability of 
                      {(result.experimentalPredictions.laboratorySignaling.expectedSignalStrength * 100).toFixed(1)}%
                    </p>
                    <div>
                      <strong>Required Conditions:</strong>
                      <ul className="ml-4 mt-1 space-y-1">
                        {result.experimentalPredictions.laboratorySignaling.requiredConditions.map((condition, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-orange-600 flex-shrink-0" />
                            {condition}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Foundational Implications */}
      <Collapsible 
        open={expandedSections.foundational} 
        onOpenChange={() => toggleSection('foundational')}
      >
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:bg-indigo-50/50 transition-colors border-indigo-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2 text-indigo-700">
                  <BookOpen className="h-5 w-5" />
                  Foundational Implications
                  {expandedSections.foundational ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge className={getInterpretationColor(result.foundationalImplications.realityInterpretation)}>
                    {result.foundationalImplications.realityInterpretation.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline">
                    QM {(result.foundationalImplications.quantumMechanicsCompleteness * 100).toFixed(0)}% complete
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-indigo-600">
                Implications for the foundations of quantum mechanics and nature of reality
              </CardDescription>
            </CardHeader>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="border-indigo-200 bg-indigo-50/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">QM Completeness</div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {(result.foundationalImplications.quantumMechanicsCompleteness * 100).toFixed(1)}%
                  </div>
                  <Progress value={result.foundationalImplications.quantumMechanicsCompleteness * 100} className="h-2 mt-2" />
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-2">Determinism Restoration</div>
                  <div className="text-3xl font-bold text-indigo-600">
                    {(result.foundationalImplications.determinismRestoration * 100).toFixed(1)}%
                  </div>
                  <Progress value={result.foundationalImplications.determinismRestoration * 100} className="h-2 mt-2" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-semibold text-indigo-700 mb-3">Philosophical Implications</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded">
                    <strong>Reality Interpretation:</strong> The analysis suggests a {' '}
                    <span className="font-medium text-indigo-700">
                      {result.foundationalImplications.realityInterpretation.replace('-', ' ')}
                    </span> interpretation of quantum mechanics is most consistent with the observed correlations.
                  </div>
                  
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded">
                    <strong>Observer-Independent Reality:</strong> Evidence for objective reality independent of 
                    observation: {(result.foundationalImplications.observerIndependentReality * 100).toFixed(1)}%. 
                    {result.foundationalImplications.observerIndependentReality > 0.6 ? 
                      ' This supports realist interpretations over instrumentalist views.' :
                      ' This supports observer-dependent interpretations.'}
                  </div>

                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded">
                    <strong>Deterministic Completeness:</strong> Classical determinism can be restored to 
                    {(result.foundationalImplications.determinismRestoration * 100).toFixed(1)}% through hidden variables, 
                    {result.foundationalImplications.determinismRestoration > 0.7 ? 
                      ' suggesting quantum randomness may be epistemic rather than ontological.' :
                      ' but significant genuinely random elements remain.'}
                  </div>

                  {result.foundationalImplications.quantumMechanicsCompleteness < 0.8 && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-yellow-700">
                        <strong>Incompleteness Suggested:</strong> The analysis indicates quantum mechanics may be 
                        incomplete, supporting Valentini's view that a more fundamental theory (like pilot wave theory) 
                        could provide a complete description of quantum phenomena.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default ValentiniQuantumDisplay