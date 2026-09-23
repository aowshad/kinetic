import { useEffect } from 'react'

export const SITE_URL = 'https://aowshad.github.io/kinetic/'
export const SITE_NAME = 'Kinetic'
export const SITE_TITLE = 'Kinetic — text animations, with or without GSAP'
export const SITE_DESCRIPTION =
  '45 copy-paste text animations with live, editable previews. 45 of 45 run with zero dependencies — every card tells you which is which, exported as zero-dependency JS, GSAP, or React.'

function setTag(selector: string, attr: 'content' | 'href', value: string) {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

/**
 * Keeps the document head in step with the route. The prerender pass reads
 * the head straight off the rendered page, so whatever this writes is what
 * ends up in each route's static HTML — and therefore what a crawler that
 * never runs the bundle sees.
 */
export function useDocumentMeta({
  title,
  description,
  path,
  image,
}: {
  title: string
  description: string
  path: string
  /** Relative to the site root; unfurlers need it resolved to an absolute URL. */
  image: string
}) {
  useEffect(() => {
    const url = new URL(path, SITE_URL).href
    const imageUrl = new URL(image, SITE_URL).href
    document.title = title
    setTag('meta[name="description"]', 'content', description)
    setTag('link[rel="canonical"]', 'href', url)
    setTag('meta[property="og:title"]', 'content', title)
    setTag('meta[property="og:description"]', 'content', description)
    setTag('meta[property="og:url"]', 'content', url)
    setTag('meta[property="og:image"]', 'content', imageUrl)
    setTag('meta[property="og:image:alt"]', 'content', title)
    setTag('meta[name="twitter:title"]', 'content', title)
    setTag('meta[name="twitter:description"]', 'content', description)
    setTag('meta[name="twitter:image"]', 'content', imageUrl)
  }, [title, description, path, image])
}
