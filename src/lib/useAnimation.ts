import { useEffect, useRef, useState } from 'react'
import { fitText } from './fitText'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import type { Engine } from './usePreviewEngine'
import type { AnimationModule, AnimationOptions } from './types'

interface FitRange {
  min: number
  max: number
}

// Under reduced motion, everything jumps to its true end state in one
// (near-)instant step instead of playing. Scramble-tagged animations get a
// larger floor: GSAP's ScrambleTextPlugin revealDelay is an absolute number
// of seconds, not a fraction of the tween's own duration, so a near-zero
// duration leaves the text permanently scrambled — never reaching the end
// state at all. 0.35s clears every revealDelay in this catalog (worst case
// 0.3s) while still being far faster than any animation's authored default.
const REDUCED_DURATION = 0.01
const REDUCED_DURATION_SCRAMBLE = 0.35

export function useAnimation<T extends HTMLElement>(
  module: AnimationModule,
  options: AnimationOptions,
  active: boolean,
  playKey: string,
  fitRange: FitRange,
  engine: Engine,
  onPlaying?: (playing: boolean) => void,
) {
  const ref = useRef<T>(null)
  const [resizeTick, setResizeTick] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const box = ref.current?.parentElement
    if (!box) return
    let first = true
    const ro = new ResizeObserver(() => {
      if (first) {
        first = false
        return
      }
      setResizeTick((t) => t + 1)
    })
    ro.observe(box)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = ref.current
    const box = el?.parentElement
    if (!active || !el || !box) return
    let cancelled = false
    let cleanup: (() => void) | undefined

    document.fonts.ready.then(() => {
      if (cancelled) return
      fitText(el, box, { ...fitRange, safety: module.fitSafety ?? 1 })
      const impl = engine === 'vanilla' && module.impl.vanilla ? module.impl.vanilla : module.impl.gsap

      if (prefersReducedMotion && module.reducedMotion === 'skip') {
        onPlaying?.(false)
        return
      }

      const effectiveOptions = prefersReducedMotion
        ? {
            ...options,
            duration: module.tags.includes('scramble') ? REDUCED_DURATION_SCRAMBLE : REDUCED_DURATION,
            stagger: 0,
            delay: 0,
          }
        : options

      onPlaying?.(true)
      cleanup = impl(el, effectiveOptions, () => onPlaying?.(false))
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, playKey, resizeTick, engine, prefersReducedMotion])

  return ref
}
