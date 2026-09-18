import { useEffect, useRef } from 'react'
import type { AnimationModule, AnimationOptions } from './types'

export function useAnimation<T extends HTMLElement>(
  module: AnimationModule,
  options: AnimationOptions,
  enabled: boolean,
  deps: unknown[],
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return
    const result = module.run(el, options)
    return typeof result === 'function' ? result : () => result.progress(1).kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps])

  return ref
}
