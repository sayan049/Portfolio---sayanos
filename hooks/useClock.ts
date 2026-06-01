'use client'

import { useState, useEffect } from 'react'
import { formatTime, formatTimeShort, formatDate } from '@/lib/utils'

interface ClockData {
  timeFull:  string
  timeShort: string
  date:      string
  hours:     string
  minutes:   string
  ampm:      string
}

export function useClock(): ClockData {
  const [now, setNow] = useState<Date>(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const h    = now.getHours()
  const m    = now.getMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12  = String(h % 12 || 12).padStart(2, '0')
  const mm   = String(m).padStart(2, '0')

  return {
    timeFull:  formatTime(now),
    timeShort: formatTimeShort(now),
    date:      formatDate(now),
    hours:     h12,
    minutes:   mm,
    ampm,
  }
}