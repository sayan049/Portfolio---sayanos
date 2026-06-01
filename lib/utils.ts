import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

export function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

export function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max + 1))
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

export function formatTime(date: Date): string {
  const h    = date.getHours()
  const m    = date.getMinutes()
  const s    = date.getSeconds()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12  = h % 12 || 12
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} ${ampm}`
}

export function formatTimeShort(date: Date): string {
  const h    = date.getHours()
  const m    = date.getMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12  = h % 12 || 12
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month:   'short',
    day:     'numeric',
  })
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function* typewriterGenerator(
  text: string,
  minDelay = 30,
  maxDelay = 55,
): AsyncGenerator<string> {
  for (const char of text) {
    await sleep(randomBetween(minDelay, maxDelay))
    yield char
  }
}

export function getCascadePosition(index: number): { x: number; y: number } {
  return {
    x: 120 + index * 28,
    y: 80  + index * 28,
  }
}