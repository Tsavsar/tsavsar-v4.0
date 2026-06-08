import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './ButtonDemo.module.css'

const CHEVRON = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18">
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="#b0b0b0">
      <path d="M15.25 6.5L9 12.75L2.75 6.5" />
    </g>
  </svg>
)

export default function KernSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const [pos,  setPos]  = useState({ top: 0, left: 0, width: 0, openUp: false })
  const triggerRef = useRef(null)

  function handleToggle() {
    if (!open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect()
      const openUp = window.innerHeight - r.bottom < 220
      setPos({ top: r.bottom, left: r.left, width: r.width, triggerTop: r.top, openUp })
    }
    setOpen(v => !v)
  }

  useEffect(() => {
    if (!open) return
    function onOut(e) {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onOut)
    return () => document.removeEventListener('mousedown', onOut)
  }, [open])

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('scroll', close, { passive: true })
    return () => window.removeEventListener('scroll', close)
  }, [open])

  return (
    <div className={styles.select}>
      <button ref={triggerRef} className={styles.selectTrigger} onClick={handleToggle}>
        <span className={styles.selectValue}>{value}</span>
        <span className={styles.selectChevron}>{CHEVRON}</span>
      </button>

      {open && createPortal(
        <div
          className={styles.dropdown}
          style={{
            position:  'fixed',
            top:       pos.openUp ? 'auto' : pos.top + 4,
            bottom:    pos.openUp ? window.innerHeight - pos.triggerTop + 4 : 'auto',
            left:      pos.left,
            width:     pos.width,
            zIndex:    9999,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {options.map(opt => (
            <div
              key={opt}
              className={`${styles.dropdownItem} ${opt === value ? styles.dropdownItemActive : ''}`}
              onMouseDown={e => { e.preventDefault(); onChange(opt); setOpen(false) }}
            >
              {opt}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}
