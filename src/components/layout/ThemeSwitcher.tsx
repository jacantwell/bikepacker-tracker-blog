import { useEffect, useState } from 'react'
import styles from './switch.module.css' // import the CSS module


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
      className={styles.switch} // use the imported .switch class
      onClick={handleModeSwitch}
      // remove inline border, size, etc. to defer to switch.module.css
      title="Toggle theme"
    >
      {mode === 'dark' ? '' : ''}
    </button>
  )
}

export { ThemeSwitcher }