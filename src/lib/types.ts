export type Category = 'entrance' | 'kinetic' | 'scroll' | 'hover' | 'loop' | 'exit'
export type TextRole = 'heading' | 'paragraph' | 'button' | 'link' | 'label' | 'counter'

export interface AnimationOptions {
  duration: number
  stagger: number
  delay: number
  ease: string
}

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
  run: (el: HTMLElement, o: AnimationOptions, onComplete?: () => void) => gsap.core.Timeline | (() => void)
}

export interface CatalogEntry {
  module: AnimationModule
  source: string
  css?: string
  path: string
}
