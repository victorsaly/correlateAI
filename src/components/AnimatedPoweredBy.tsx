import { useState, useEffect } from 'react'
import { Database } from '@phosphor-icons/react'
import { type DataSourceInfo } from '@/services/dynamicDataSourceService'

interface AnimatedPoweredByProps {
  sources: Map<string, DataSourceInfo>
  isMobile?: boolean
}

export function AnimatedPoweredBy({ sources, isMobile = false }: AnimatedPoweredByProps) {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const sourceEntries = Array.from(sources.entries()).filter(([key]) => key !== 'AI')
  
  useEffect(() => {
    if (sourceEntries.length === 0) return

    const interval = setInterval(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        setCurrentSourceIndex((prev) => (prev + 1) % sourceEntries.length)
        setIsVisible(true)
      }, 200)
      
    }, isMobile ? 2500 : 3000)

    return () => clearInterval(interval)
  }, [sourceEntries.length, isMobile])

  if (sourceEntries.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Database size={14} className="text-cyan-400" />
        <span>Powered by</span>
        <span className="font-semibold text-blue-400">FRED</span>
        <span>+</span>
        <span className="font-semibold text-green-400">World Bank</span>
        <span>+</span>
        <span className="font-semibold text-purple-400">AI Datasets</span>
      </div>
    )
  }

  const [currentKey, currentSource] = sourceEntries[currentSourceIndex]
  
  const getSourceColor = (key: string) => {
    switch (key) {
      case 'FRED': return 'text-blue-400'
      case 'WorldBank': return 'text-green-400'
      case 'AlphaVantage': return 'text-orange-400'
      case 'OpenWeather': return 'text-cyan-400'
      case 'NASA': return 'text-indigo-400'
      case 'USGS': return 'text-amber-400'
      case 'EIA': return 'text-yellow-400'
      case 'BLS': return 'text-emerald-400'
      case 'CDC': return 'text-red-400'
      default: return 'text-purple-400'
    }
  }

  return (
    <div className="flex items-center gap-2 min-h-[20px]">
      <Database size={14} className="text-cyan-400" />
      <span>Powered by</span>
      <div 
        className={`transition-all duration-300 ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-1'
        }`}
      >
        <span className={`font-semibold ${getSourceColor(currentKey)}`}>
          {currentSource.name}
        </span>
        {!isMobile && (
          <span className="text-gray-400 text-xs ml-1">
            ({currentSourceIndex + 1}/{sourceEntries.length})
          </span>
        )}
      </div>
      {!isMobile && sourceEntries.length > 1 && (
        <div className="flex gap-1 ml-2">
          {sourceEntries.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentSourceIndex 
                  ? 'bg-blue-400 scale-110' 
                  : 'bg-gray-400/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}