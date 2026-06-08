import { useEffect, useRef } from 'react'

function createClick(ctx, type = 'click') {
  const now = ctx.currentTime
  const gain = ctx.createGain()
  gain.connect(ctx.destination)

  if (type === 'open') {
    // Slightly softer, higher pitch for "open" interactions
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(900, now)
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.06)
    gain.gain.setValueAtTime(0.06, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)
    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.08)
  } else {
    // Subtle click — short noise burst
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 6)
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)
    source.connect(gain)
    source.start(now)
  }
}

export default function useClickSound(enabledRef) {
  const ctxRef = useRef(null)

  useEffect(() => {
    function getCtx() {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      return ctxRef.current
    }

    async function handleClick(e) {
      if (enabledRef && !enabledRef.current) return
      const target = e.target
      const ctx = getCtx()
      if (ctx.state === 'suspended') await ctx.resume()

      const isOpen = target.closest('button, [role="button"], nav a, .pi')
      createClick(ctx, isOpen ? 'open' : 'click')
    }

    document.addEventListener('click', handleClick, { passive: true })
    return () => document.removeEventListener('click', handleClick)
  }, [enabledRef])
}
