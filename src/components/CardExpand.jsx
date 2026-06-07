import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import styles from './CardExpand.module.css'

/**
 * useCursorLabel — returns { areaProps, labelEl }
 * Attach areaProps to the hover zone; labelEl renders a floating pill that
 * follows the mouse with a smooth lerp.
 */
export function useCursorLabel(text = 'View project') {
  const labelRef   = useRef(null)
  const pos        = useRef({ x: 0, y: 0 })
  const target     = useRef({ x: 0, y: 0 })
  const rafId      = useRef(null)
  const [visible, setVisible] = useState(false)

  const animate = useCallback(() => {
    pos.current.x += (target.current.x - pos.current.x) * 0.12
    pos.current.y += (target.current.y - pos.current.y) * 0.12
    if (labelRef.current) {
      labelRef.current.style.transform =
        `translate(${pos.current.x}px, ${pos.current.y}px)`
    }
    rafId.current = requestAnimationFrame(animate)
  }, [])

  function onEnter(e) {
    target.current = { x: e.clientX, y: e.clientY }
    pos.current    = { x: e.clientX, y: e.clientY }
    setVisible(true)
    rafId.current = requestAnimationFrame(animate)
  }

  function onMove(e) {
    target.current = { x: e.clientX + 14, y: e.clientY + 14 }
  }

  function onLeave() {
    setVisible(false)
    cancelAnimationFrame(rafId.current)
  }

  useEffect(() => () => cancelAnimationFrame(rafId.current), [])

  const areaProps = { onMouseEnter: onEnter, onMouseMove: onMove, onMouseLeave: onLeave }

  const labelEl = createPortal(
    <div
      ref={labelRef}
      className={`${styles.cursorLabel} ${visible ? styles.cursorLabelVisible : ''}`}
      style={{ willChange: 'transform' }}
    >
      {text}
    </div>,
    document.body
  )

  return { areaProps, labelEl }
}

/**
 * CardExpand — wraps a project card image.
 * Click → expands to fullscreen with position transition. ESC / click-outside closes.
 */
export default function CardExpand({ bg, to, name, children }) {
  const triggerRef = useRef(null)
  const [state, setState] = useState('idle') // idle | opening | open | closing
  const [rect, setRect]   = useState(null)
  const navigate = useNavigate()
  const { areaProps, labelEl } = useCursorLabel('View project')

  function open() {
    if (!to) return
    const r = triggerRef.current.getBoundingClientRect()
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
    setState('opening')
    requestAnimationFrame(() => requestAnimationFrame(() => setState('open')))
  }

  function close() { setState('closing') }

  function onTransitionEnd() {
    if (state === 'closing') { setState('idle'); setRect(null) }
  }

  useEffect(() => {
    if (state === 'idle') return
    const h = e => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [state])

  const isVisible  = state !== 'idle'
  const isExpanded = state === 'open'

  return (
    <>
      {labelEl}
      <div
        ref={triggerRef}
        className={`${styles.trigger} ${to ? styles.clickable : ''}`}
        onClick={open}
        {...areaProps}
      >
        {children}
      </div>

      {isVisible && createPortal(
        <div
          className={`${styles.overlay} ${isExpanded ? styles.overlayVisible : ''}`}
          onClick={close}
        >
          <div
            className={styles.card}
            style={isExpanded ? {} : {
              top: rect?.top, left: rect?.left,
              width: rect?.width, height: rect?.height,
              opacity: 0,
            }}
            onTransitionEnd={onTransitionEnd}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.cardBg} style={{ background: bg }} />

            <button className={styles.closeBtn} onClick={close} aria-label="Close">
              <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            <button className={styles.visitBtn} onClick={() => navigate(to)}>
              Read case study
              <svg viewBox="0 0 11.05 8.25" fill="none" width="12" height="12">
                <path d="M10.425 3.425H2.725C1.565 3.425 0.625 4.365 0.625 5.525V7.625" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.625 6.225L10.425 3.425L7.625 0.625" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <p className={styles.cardName}>{name}</p>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
