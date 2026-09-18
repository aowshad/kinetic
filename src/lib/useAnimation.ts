import { useEffect, useRef, useState } from 'react'
import { fitText } from './fitText'
import type { AnimationModule, AnimationOptions } from './types'

interface FitRange {
  min: number
  max: number
}

export function useAnimation<T extends HTMLElement>(
  module: AnimationModule,
  options: AnimationOptions,
  active: boolean,
  playKey: string,
  fitRange: FitRange,
  onPlaying?: (playing: boolean) => void,
) {
  const ref = useRef<T>(null)
  const [resizeTick, setResizeTick] = useState(0)

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
      onPlaying?.(true)
      const result = module.run(el, options, () => onPlaying?.(false))
      cleanup = typeof result === 'function' ? result : () => result.progress(1).kill()
    })

    return () => {
      cancelled = true
      cleanup?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, playKey, resizeTick])

  return ref
}
