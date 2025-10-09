/**
 * Enhanced Data Generation for Quantum Nonequilibrium Detection
 * 
 * Generates correlation data specifically designed to trigger Valentini's 
 * quantum nonequilibrium conditions, including:
 * - Quantum measurement-like datasets
 * - Physical system correlations
 * - Nonequilibrium quantum states
 * - Hidden variable scenarios
 * - Cosmological-inspired data
 */

export interface QuantumDataset {
  name: string
  unit: string
  baseValue: number
  category: string
  quantumNature: 'classical' | 'quantum' | 'nonequilibrium' | 'hidden-variable'
  physicalSystem?: string
  nonequilibriumParameters?: {
    deviationStrength: number
    signalingPotential: number
    hiddenVariables: string[]
  }
  // Additional quantum parameters for enhanced data generation
  quantumCoherence?: number
  phaseOffset?: number
  nonequilibriumStrength?: number
  hiddenVariableEffect?: number
}

export class QuantumDataGenerator {
  /**
   * Generate quantum physics inspired datasets
   */
  static getQuantumPhysicsDatasets(): QuantumDataset[] {
    return [
      // Quantum measurement datasets
      {
        name: "Photon Polarization Measurements",
        unit: "correlation coefficient",
        baseValue: 0.7,
        category: "quantum-optics",
        quantumNature: "nonequilibrium",
        physicalSystem: "Entangled photon pairs",
        quantumCoherence: 2.5,
        phaseOffset: Math.PI / 4,
        nonequilibriumStrength: 0.8,
        hiddenVariableEffect: 0.6,
        nonequilibriumParameters: {
          deviationStrength: 0.15,
          signalingPotential: 0.4,
          hiddenVariables: ["detector_efficiency", "temporal_drift"]
        }
      },
      {
        name: "Electron Spin Correlations",
        unit: "spin correlation",
        baseValue: 0.85,
        category: "quantum-optics", 
        quantumNature: "nonequilibrium",
        physicalSystem: "EPR electron pairs",
        quantumCoherence: 3.2,
        phaseOffset: Math.PI / 6,
        nonequilibriumStrength: 0.75,
        hiddenVariableEffect: 0.7,
        nonequilibriumParameters: {
          deviationStrength: 0.12,
          signalingPotential: 0.35,
          hiddenVariables: ["magnetic_field_fluctuation", "measurement_angle"]
        }
      },
      {
        name: "Atomic State Preparations",
        unit: "state fidelity",
        baseValue: 0.92,
        category: "atomic-physics",
        quantumNature: "quantum",
        physicalSystem: "Cold atom ensembles",
        quantumCoherence: 1.8,
        phaseOffset: 0,
        nonequilibriumStrength: 0.4,
        hiddenVariableEffect: 0.3
      },
      {
        name: "Quantum Dot Energy Levels",
        unit: "energy (meV)",
        baseValue: 1.2,
        category: "solid-state",
        quantumNature: "hidden-variable",
        physicalSystem: "Semiconductor quantum dots",
        quantumCoherence: 1.5,
        phaseOffset: Math.PI / 3,
        nonequilibriumStrength: 0.9,
        hiddenVariableEffect: 0.8,
        nonequilibriumParameters: {
          deviationStrength: 0.08,
          signalingPotential: 0.2,
          hiddenVariables: ["substrate_strain", "temperature_gradient"]
        }
      },
      {
        name: "Superconductor Phase Coherence",
        unit: "coherence length (μm)",
        baseValue: 150,
        category: "condensed-matter",
        quantumNature: "quantum",
        physicalSystem: "Josephson junctions",
        quantumCoherence: 2.0,
        phaseOffset: Math.PI / 2,
        nonequilibriumStrength: 0.5,
        hiddenVariableEffect: 0.4
      },

      // Cosmological quantum datasets
      {
        name: "Cosmic Microwave Background Fluctuations",
        unit: "temperature variance (μK)",
        baseValue: 18.2,
        category: "cosmology",
        quantumNature: "nonequilibrium",
        physicalSystem: "Primordial quantum fluctuations",
        nonequilibriumParameters: {
          deviationStrength: 0.22,
          signalingPotential: 0.6,
          hiddenVariables: ["inflation_field", "primordial_nonequilibrium"]
        }
      },
      {
        name: "Dark Matter Interaction Rates",
        unit: "events/kg/day",
        baseValue: 0.003,
        category: "cosmology",
        quantumNature: "hidden-variable",
        physicalSystem: "WIMP-nucleus scattering",
        nonequilibriumParameters: {
          deviationStrength: 0.18,
          signalingPotential: 0.45,
          hiddenVariables: ["galactic_velocity", "local_density"]
        }
      },

      // Biological quantum systems
      {
        name: "Quantum Coherence in Photosynthesis",
        unit: "coherence time (fs)",
        baseValue: 660,
        category: "biophysics",
        quantumNature: "nonequilibrium",
        physicalSystem: "Chlorophyll excitation transfer",
        nonequilibriumParameters: {
          deviationStrength: 0.25,
          signalingPotential: 0.3,
          hiddenVariables: ["protein_dynamics", "vibrational_coupling"]
        }
      },
      {
        name: "Avian Navigation Magnetoreception",
        unit: "angular sensitivity (degrees)",
        baseValue: 2.1,
        category: "biophysics",
        quantumNature: "hidden-variable",
        physicalSystem: "Cryptochrome radical pairs",
        nonequilibriumParameters: {
          deviationStrength: 0.14,
          signalingPotential: 0.25,
          hiddenVariables: ["magnetic_inclination", "light_intensity"]
        }
      },

      // Experimental quantum systems
      {
        name: "Quantum Computer Gate Fidelity",
        unit: "fidelity",
        baseValue: 0.995,
        category: "quantum-computing",
        quantumNature: "quantum",
        physicalSystem: "Superconducting qubits"
      },
      {
        name: "Trapped Ion Motional States",
        unit: "phonon number",
        baseValue: 0.05,
        category: "atomic-physics",
        quantumNature: "nonequilibrium",
        physicalSystem: "Laser-cooled ions",
        nonequilibriumParameters: {
          deviationStrength: 0.10,
          signalingPotential: 0.15,
          hiddenVariables: ["laser_noise", "trap_frequency"]
        }
      },

      // Exotic quantum phenomena
      {
        name: "Quantum Vacuum Fluctuations",
        unit: "energy density (J/m³)",
        baseValue: 1e-15,
        category: "quantum-field-theory",
        quantumNature: "nonequilibrium",
        physicalSystem: "Casimir effect measurements",
        nonequilibriumParameters: {
          deviationStrength: 0.30,
          signalingPotential: 0.7,
          hiddenVariables: ["plate_separation", "surface_roughness"]
        }
      },
      {
        name: "Hawking Radiation Analogues",
        unit: "particle flux",
        baseValue: 0.02,
        category: "quantum-field-theory",
        quantumNature: "nonequilibrium",
        physicalSystem: "Sonic black holes",
        nonequilibriumParameters: {
          deviationStrength: 0.35,
          signalingPotential: 0.8,
          hiddenVariables: ["flow_velocity", "acoustic_horizon"]
        }
      }
    ]
  }

  /**
   * Generate quantum nonequilibrium correlation data
   */
  static generateQuantumNonequilibriumData(
    dataset1: QuantumDataset, 
    dataset2: QuantumDataset, 
    points: number = 24
  ): Array<{ year: number; value1: number; value2: number }> {
    console.log('🌌 Generating quantum nonequilibrium data for:', {
      dataset1: dataset1.name,
      dataset2: dataset2.name,
      system1: dataset1.physicalSystem,
      system2: dataset2.physicalSystem,
      points
    })

    const data: Array<{ year: number; value1: number; value2: number }> = []
    const startYear = 2000
    
    // Ensure strong nonequilibrium conditions that will trigger Valentini analysis
    const nonequilibriumStrength = Math.random() > 0.3 ? 0.7 + Math.random() * 0.3 : 0.4 + Math.random() * 0.3 // 70% chance of strong nonequilibrium
    const hiddenVariableContribution = 0.3 + Math.random() * 0.4 // Significant hidden variable effects
    const quantumCorrelation = (Math.random() - 0.5) * 1.4 // Strong quantum correlations
    
    console.log('🔬 Quantum parameters:', {
      nonequilibriumStrength,
      hiddenVariableContribution,
      quantumCorrelation
    })

    for (let i = 0; i < points; i++) {
      const year = startYear + i
      
      // Generate quantum measurement data with built-in nonequilibrium signatures
      const timePhase = (i / points) * 2 * Math.PI
      
      // Add quantum coherence effects (with defaults if undefined)
      const coherencePhase1 = Math.sin(timePhase * (dataset1.quantumCoherence || 1.5) + (dataset1.phaseOffset || 0))
      const coherencePhase2 = Math.sin(timePhase * (dataset2.quantumCoherence || 1.5) + (dataset2.phaseOffset || 0))
      
      // Add nonequilibrium deviations (this is key for Valentini detection)
      const nonequilibriumDeviation1 = nonequilibriumStrength * Math.sin(timePhase * 3 + Math.PI/4) * (dataset1.nonequilibriumStrength || 0.6)
      const nonequilibriumDeviation2 = nonequilibriumStrength * Math.sin(timePhase * 3 + Math.PI/2) * (dataset2.nonequilibriumStrength || 0.6)
      
      // Add hidden variable effects (detectable by pilot wave analysis)
      const hiddenVariable1 = hiddenVariableContribution * Math.cos(timePhase * 2) * (dataset1.hiddenVariableEffect || 0.5)
      const hiddenVariable2 = hiddenVariableContribution * Math.cos(timePhase * 2 + quantumCorrelation) * (dataset2.hiddenVariableEffect || 0.5)
      
      // Add quantum entanglement correlations
      const entanglementEffect = quantumCorrelation * 0.3 * Math.sin(timePhase + Math.PI/3)
      
      // Combine all quantum effects
      const quantumNoise1 = (Math.random() - 0.5) * 0.1 * dataset1.baseValue
      const quantumNoise2 = (Math.random() - 0.5) * 0.1 * dataset2.baseValue
      
      const value1 = Math.abs(
        dataset1.baseValue * (1 + coherencePhase1 * 0.2) +
        nonequilibriumDeviation1 * dataset1.baseValue * 0.4 +
        hiddenVariable1 * dataset1.baseValue * 0.3 +
        quantumNoise1
      )
      
      const value2 = Math.abs(
        dataset2.baseValue * (1 + coherencePhase2 * 0.2) +
        nonequilibriumDeviation2 * dataset2.baseValue * 0.4 +
        hiddenVariable2 * dataset2.baseValue * 0.3 +
        entanglementEffect * dataset2.baseValue * 0.2 +
        quantumNoise2
      )
      
      data.push({ year, value1, value2 })
    }
    
    console.log('✅ Generated quantum data with nonequilibrium signatures:', {
      sampleData: data.slice(0, 3),
      totalPoints: data.length,
      avgValue1: data.reduce((sum, d) => sum + d.value1, 0) / data.length,
      avgValue2: data.reduce((sum, d) => sum + d.value2, 0) / data.length
    })

    return data
  }

  /**
   * Generate quantum-enhanced correlation with specific nonequilibrium conditions
   */
  static generateEnhancedQuantumCorrelation(
    correlationStrength: number = 0.8,
    nonequilibriumStrength: 'weak' | 'moderate' | 'strong' | 'extreme' = 'moderate',
    length: number = 20
  ) {
    const data: Array<{ year: number; value1: number; value2: number }> = []
    const startYear = 2020

    // Map nonequilibrium strength to parameters
    const strengthMap = {
      weak: { deviation: 0.05, signaling: 0.15, hidden: 0.1 },
      moderate: { deviation: 0.15, signaling: 0.4, hidden: 0.25 },
      strong: { deviation: 0.25, signaling: 0.6, hidden: 0.4 },
      extreme: { deviation: 0.35, signaling: 0.8, hidden: 0.6 }
    }

    const params = strengthMap[nonequilibriumStrength]

    for (let i = 0; i < length; i++) {
      const year = startYear + i
      const t = i / (length - 1)

      // Generate base quantum states
      const baseState1 = Math.sin(2 * Math.PI * t * 2.3) + Math.cos(2 * Math.PI * t * 1.7)
      const baseState2 = correlationStrength * baseState1 + 
                        (1 - correlationStrength) * (Math.sin(2 * Math.PI * t * 1.9) + Math.cos(2 * Math.PI * t * 2.1))

      // Add nonequilibrium deviations
      const nonequilibriumDeviation1 = params.deviation * Math.sin(4 * Math.PI * t + Math.PI/3)
      const nonequilibriumDeviation2 = params.deviation * Math.cos(4 * Math.PI * t - Math.PI/6)

      // Add faster-than-light signaling correlations
      const ftlSignal = params.signaling * Math.sin(8 * Math.PI * t)

      // Add hidden variable correlations
      const hiddenVar1 = params.hidden * Math.sin(2 * Math.PI * t * 0.8)
      const hiddenVar2 = params.hidden * Math.sin(2 * Math.PI * t * 0.8 + Math.PI/4)  // Slight phase shift

      // Combine all effects
      const value1 = 50 + 20 * (baseState1 + nonequilibriumDeviation1 + ftlSignal + hiddenVar1)
      const value2 = 50 + 20 * (baseState2 + nonequilibriumDeviation2 + ftlSignal + hiddenVar2)

      data.push({
        year,
        value1: Math.max(0.1, value1),
        value2: Math.max(0.1, value2)
      })
    }

    return data
  }
}

// Export enhanced datasets
export const quantumPhysicsDatasets = QuantumDataGenerator.getQuantumPhysicsDatasets()