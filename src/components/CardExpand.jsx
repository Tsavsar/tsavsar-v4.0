import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import styles from './CardExpand.module.css'

/**
 * Wraps a project card image. On click it expands to fill the viewport,
 * shows a "Visit" button, then collapses back on close or navigates on visit.
 */
export default function CardExpand({ bg, to, name, children }) {
  const triggerRef = useRef(null)
  const [state, setState] = useState('idle') // idle | opening | open | closing
  const [rect, setRect]   = useState(null)
  const navigate = useNavigate()

  function open() {
    if (!to) return
    const r = triggerRef.current.getBoundingClientRect()
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
    setState('opening')
    // next frame → trigger CSS transition to fullscreen
    requestAnimationFrame(() => requestAnimationFrame(() => setState('open')))
  }

  function close() {
    setState('closing')
  }

  function onTransitionEnd() {
    if (state === 'closing') {
      setState('idle')
      setRect(null)
    }
  }

  // Close on Escape
  useEffect(() => {
    if (state === 'idle') return
    const handler = e => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [state])

  const isVisible = state !== 'idle'
  const isExpanded = state === 'open'

  return (
    <>
      <div
        ref={triggerRef}
        className={`${styles.trigger} ${to ? styles.clickable : ''}`}
        onClick={open}
      >
        {children}
        {to && <div className={styles.hintLabel}>View project</div>}
      </div>

      {isVisible && createPortal(
        <div
          className={`${styles.overlay} ${isExpanded ? styles.overlayVisible : ''}`}
          onClick={close}
        >
          {/* The expanding card */}
          <div
            className={styles.card}
            style={isExpanded ? {} : {
              top:    rect?.top,
              left:   rect?.left,
              width:  rect?.width,
              height: rect?.height,
              opacity: 0,
            }}
            onTransitionEnd={onTransitionEnd}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.cardBg} style={{ background: bg }} />

            {/* Close */}
            <button className={styles.closeBtn} onClick={close} aria-label="Close">
              <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Visit */}
            <button
              className={styles.visitBtn}
              onClick={() => navigate(to)}
            >
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
