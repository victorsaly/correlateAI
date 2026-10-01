import { useCallback, useEffect, useState } from 'react'

export type ThemePref = 'light' | 'dark' | 'system'

const KEY = 'theme'
const media = () => window.matchMedia('(prefers-color-scheme: dark)')

function readPref(): ThemePref {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    // storage blocked: fall back to system
  }
  return 'system'
}

function apply(pref: ThemePref) {
  const dark = pref === 'dark' || (pref === 'system' && media().matches)
  document.documentElement.classList.toggle('dark', dark)
  return dark
}

/** Light / dark / system preference; index.html applies it before first paint. */
export function useTheme() {
  const [pref, setPref] = useState<ThemePref>(readPref)
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    setIsDark(apply(pref))
    if (pref !== 'system') return
    const mq = media()
    const onChange = () => setIsDark(apply('system'))
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [pref])

  const setTheme = useCallback((next: ThemePref) => {
    try {
      if (next === 'system') localStorage.removeItem(KEY)
      else localStorage.setItem(KEY, next)
    } catch {
      // ignore
    }
    setPref(next)
  }, [])

  return { pref, isDark, setTheme }
}
