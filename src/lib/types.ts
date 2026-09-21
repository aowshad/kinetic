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
  impl: {
    gsap: AnimationImpl
    vanilla?: AnimationImpl
  }
}

export interface CatalogEntry {
  module: AnimationModule
  source: string
  css?: string
  path: string
}
