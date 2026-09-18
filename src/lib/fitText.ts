interface FitOptions {
  min?: number
  max?: number
  safety?: number
}

export function fitText(text: HTMLElement, box: HTMLElement, o: FitOptions = {}) {
  const { min = 12, max = 64, safety = 1 } = o

  const cs = getComputedStyle(box)
  const availW = (box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) * safety
  if (availW <= 0) return min

  // Pass 1: fit on width alone — box height is content-driven, not fixed.
  let lo = min
  let hi = max
  let best = min
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    text.style.fontSize = `${mid}px`
    if (text.scrollWidth <= availW) {
      best = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  text.style.fontSize = `${best}px`

  // Pass 2: the box still has a max-block-size backstop — shrink if we blew past it.
  const maxHeight = parseFloat(cs.maxHeight)
  if (Number.isFinite(maxHeight)) {
    while (best > min && text.scrollHeight > maxHeight) {
      best -= 1
      text.style.fontSize = `${best}px`
    }
  }

  return best
}
