import { useState, useEffect } from 'react'
import { SummaryActivity } from '../types/StravaTypes'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export function useStravaData(startDate: string) {
  const [activities, setActivities] = useState<SummaryActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await fetch(
          `${API_URL}/journey/activities?startDate=${encodeURIComponent(startDate)}`
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch activities')
        }
        
        const data = await response.json()
        setActivities(data.activities)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch journey data'))
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [startDate])

  return { activities, loading, error }
}