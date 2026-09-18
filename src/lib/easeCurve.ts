import { gsap } from './gsap'

export function easeCurvePath(name: string, size = 28, samples = 24): string {
  const fn = gsap.parseEase(name)
  let d = ''
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const v = fn(t)
    const x = (t * size).toFixed(1)
    const y = (size - v * size).toFixed(1)
    d += `${i === 0 ? 'M' : 'L'} ${x} ${y} `
  }
  return d.trim()
}
