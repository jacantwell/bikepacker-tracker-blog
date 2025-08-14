import { format, parseISO } from 'date-fns'

export function formatDate(dateString: string): string {
  const date = parseISO(dateString)
  return format(date, 'LLLL d, yyyy')
}

export function formatTime(seconds: number | undefined): string {
  if (!seconds) return '0m'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function formatDistance(meters: number | undefined, unit?: string): string {
  if (!meters) return '0 m'
  if (unit === "km") return (meters / 1000).toFixed(2) + ' km'
  return meters ? meters.toFixed(2) + ' m' : '0 m'
}