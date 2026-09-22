export type Category = 'entrance' | 'kinetic' | 'scroll' | 'hover' | 'loop' | 'exit'
export type TextRole = 'heading' | 'paragraph' | 'button' | 'link' | 'label' | 'counter'

/**
 * 'full' — behaves the same with or without GSAP.
 * 'partial' — runs without GSAP but loses something; see vanillaNote.
 * 'none' — no zero-dependency equivalent exists yet.
 */
export type VanillaTier = 'full' | 'partial' | 'none'

export interface AnimationOptions {
  duration: number
  stagger: number
  delay: number
  ease: string
}

export type AnimationImpl = (el: HTMLElement, o: AnimationOptions, onComplete?: () => void) => () => void

/**
 * How this animation behaves when the visitor prefers reduced motion.
 * 'settle' — plays once, near-instantly, landing on its real authored end
 *            state (exit animations finish hidden, entrance/kinetic ones
 *            finish revealed). This is the default for one-shot animations.
 * 'skip'   — never runs at all. The only two reasons that's correct here:
 *            (a) it repeats forever, so forcing a near-zero duration would
 *            strobe rather than stop it, or (b) it's scroll-position-driven
 *            rather than duration-driven, so there's no duration to shrink
 *            in the first place — some of these also apply a degraded
 *            starting style (blur/clip/scale) before scroll position ever
 *            takes over, which would otherwise be stuck on screen.
 */
export type ReducedMotion = 'settle' | 'skip'

export interface AnimationModule {
  id: string
  name: string
  category: Category
  roles: TextRole[]
  tags: string[]
  blurb: string
  defaults: AnimationOptions
  plugins: string[]
  fitSafety?: number
  vanilla: VanillaTier
  vanillaNote?: string
  reducedMotion: ReducedMotion
  impl: {
    gsap: AnimationImpl
    vanilla?: AnimationImpl
  }
}

export interface CatalogEntry {
  module: AnimationModule
  source: string
  vanillaSource?: string
  css?: string
  path: string
}
