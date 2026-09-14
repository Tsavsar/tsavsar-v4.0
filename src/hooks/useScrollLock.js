import { useEffect } from 'react'

// Locks body scroll while `locked`. The gutter is reserved permanently by
// `html { scrollbar-gutter: stable }` in index.css, so hiding overflow never
// changes the viewport width — no padding compensation needed, and nothing
// (flow content or fixed chrome) moves sideways on open.
export function useScrollLock(locked) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [locked])
}
