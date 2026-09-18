import { gsap } from './gsap'

export function easeCurvePath(name: string, samples = 32): string {
  const fn = gsap.parseEase(name)
  let d = ''
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const v = fn(t)
    d += `${i === 0 ? 'M' : 'L'} ${t.toFixed(3)} ${(1 - v).toFixed(3)} `
  }
  return d.trim()
}

export const EASE_DIAGONAL = 'M 0 1 L 1 0'
