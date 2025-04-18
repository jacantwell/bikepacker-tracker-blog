import { useEffect, useState, memo } from 'react'

const STORAGE_KEY = 'bikepacker-tracker-theme'
const modes = ['dark', 'light']

const ThemeSwitcher = () => {
  const [mode, setMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    const handleThemeChange = () => {
      const newMode = localStorage.getItem(STORAGE_KEY) || 'light'
      if (newMode === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      document.documentElement.setAttribute('data-mode', newMode)
    }

    // Initialize on first load
    handleThemeChange()

    // Listen for storage changes (for multi-tab sync)
    window.addEventListener('storage', handleThemeChange)
    return () => window.removeEventListener('storage', handleThemeChange)
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    document.documentElement.setAttribute('data-mode', mode)
  }, [mode])

  const handleModeSwitch = () => {
    const index = modes.indexOf(mode)
    setMode(modes[(index + 1) % modes.length])
  }

  return (
    <button
      className="fixed right-5 top-5 z-50 h-8 w-8 rounded-full border border-current text-current transition-all hover:scale-110"
      onClick={handleModeSwitch}
      title="Toggle theme"
    >
      {mode === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}

export { ThemeSwitcher }