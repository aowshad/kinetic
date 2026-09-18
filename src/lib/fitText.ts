interface FitOptions {
  min?: number
  max?: number
  safety?: number
}

export function fitText(text: HTMLElement, box: HTMLElement, o: FitOptions = {}) {
  const { min = 12, max = 64, safety = 1 } = o

  const cs = getComputedStyle(box)
  const availW = (box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) * safety
  const availH = (box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)) * safety
  if (availW <= 0 || availH <= 0) return min

  let lo = min
  let hi = max
  let best = min
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    text.style.fontSize = `${mid}px`
    if (text.scrollWidth <= availW && text.scrollHeight <= availH) {
      best = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  text.style.fontSize = `${best}px`
  return best
}
