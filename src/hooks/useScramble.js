import { useState, useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&'

export function useScramble(text, { delay = 0, duration = 800 } = {}) {
  const [output, setOutput] = useState('')
  const raf = useRef(null)
  const timer = useRef(null)

  useEffect(() => {
    timer.current = setTimeout(() => {
      const start = performance.now()

      function tick(now) {
        const elapsed  = now - start
        const progress = Math.min(elapsed / duration, 1)
        const revealed = Math.floor(progress * text.length)

        let result = ''
        for (let i = 0; i < text.length; i++) {
          if (i < revealed) {
            result += text[i]
          } else if (i < revealed + 6 && text[i] !== ' ') {
            result += CHARS[Math.floor(Math.random() * CHARS.length)]
          } else {
            result += ' '
          }
        }
        setOutput(result)

        if (progress < 1) {
          raf.current = requestAnimationFrame(tick)
        } else {
          setOutput(text)
        }
      }

      raf.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timer.current)
      cancelAnimationFrame(raf.current)
    }
  }, [text, delay, duration])

  return output
}
