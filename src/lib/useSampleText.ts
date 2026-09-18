import { useEffect, useState } from 'react'

const KEY = 'kinetic-sample-text'
export const DEFAULT_SAMPLE_TEXT = 'I Love Bangladesh'
export const SAMPLE_TEXT_MAX = 120

function read(): string {
  try {
    return sessionStorage.getItem(KEY) ?? DEFAULT_SAMPLE_TEXT
  } catch {
    return DEFAULT_SAMPLE_TEXT
  }
}

export function useSampleText() {
  const [value, setValue] = useState(read)

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, value)
    } catch {
      // ignore
    }
  }, [value])

  return [value, setValue] as const
}
