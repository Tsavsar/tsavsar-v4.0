import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './AvatarDemo.module.css'
import btnStyles from './ButtonDemo.module.css'

// ── Avatar assets ─────────────────────────────────────────────────────
const HUMAN_DEFAULT    = '/assets/kernui-demo/avatar-human-default.png'
const HUMAN_COLOR_IMG  = '/assets/kernui-demo/avatar-human-color.png'
const MEMOJI_IMG       = '/assets/kernui-demo/avatar-memoji.png'
const MEMOJI_COLOR_IMG = '/assets/kernui-demo/avatar-memoji-color.png'

// Illustration avatars (inline)
const ILLUS_DEFAULT_SVG = (
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <rect width="80" height="80" fill="#e5e5e5" />
    <circle cx="40" cy="32" r="14" fill="#bdbdbd" />
    <path d="M14 80C14 62 24 54 40 54C56 54 66 62 66 80Z" fill="#bdbdbd" />
  </svg>
)
const ILLUS_COLOR_SVG = (
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
    <rect width="80" height="80" fill="#efebff" />
    <circle cx="40" cy="32" r="14" fill="#7d52f4" />
    <path d="M14 80C14 62 24 54 40 54C56 54 66 62 66 80Z" fill="#7d52f4" />
  </svg>
)

// Badge icons (inline)
const PLUS_SVG = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <path d="M12 5V19M5 12H19" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
  </svg>
)
const X_SVG = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <path d="M6 6L18 18M18 6L6 18" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
  </svg>
)
const ARROW_BADGE_SVG = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <path d="M7 17L17 7M9 7H17V15" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const VERIFIED_SVG = (
  <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <circle cx="10" cy="10" r="10" fill="#1A8CFF" />
    <path d="M6 10.2L8.6 12.8L14 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)

const CHEVRON_SVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18">
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="#b0b0b0">
      <path d="M15.25 6.5L9 12.75L2.75 6.5" />
    </g>
  </svg>
)

// ── Options ───────────────────────────────────────────────────────────
const AVATAR_TYPES = ['Human', 'Illustration', 'Memoji', 'Initials']
const SIZES        = ['32', '40', '48', '64', '80']
const BADGE_TYPES  = ['None', 'Active', 'Idle', 'Offline', 'DND', 'Notification', 'Verified', 'Plus', 'Cancel', 'Number', 'Icon']

const BADGE_COLORS = {
  Active: '#1daf61', Idle: '#f6b51e', Offline: '#a3a3a3',
  DND: '#fb3748', Notification: '#7d52f4', Plus: '#1fc16b', Cancel: '#fb3748',
}

// ── Badge renderer ────────────────────────────────────────────────────
function Badge({ type, sz = 20 }) {
  if (!type || type === 'None') return null
  const base = {
    width: sz, height: sz, borderRadius: '50%',
    border: `${sz * 0.125}px solid #fff`, flexShrink: 0,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  }
  if (type === 'Verified') return (
    <span style={{ ...base, border: 'none', overflow: 'hidden' }}>
      {VERIFIED_SVG}
    </span>
  )
  if (type === 'Plus') return (
    <span style={{ ...base, background: '#1fc16b' }}>
      <span style={{ width: sz * 0.5, height: sz * 0.5 }}>{PLUS_SVG}</span>
    </span>
  )
  if (type === 'Cancel') return (
    <span style={{ ...base, background: '#fb3748' }}>
      <span style={{ width: sz * 0.4, height: sz * 0.4 }}>{X_SVG}</span>
    </span>
  )
  if (type === 'Icon') return (
    <span style={{ ...base, background: '#fff', position: 'relative' }}>
      <span style={{ position: 'absolute', inset: '4.8% 5% 5.2%', background: '#7d52f4', borderRadius: '50%' }} />
      <span style={{ width: sz * 0.4, height: sz * 0.4, position: 'relative', zIndex: 1 }}>{ARROW_BADGE_SVG}</span>
    </span>
  )
  if (type === 'Number') return (
    <span style={{ ...base, background: '#fff', position: 'relative' }}>
      <span style={{ position: 'absolute', inset: '4.8% 5% 5.2%', background: '#fb4ba3', borderRadius: '50%' }} />
      <span style={{ position: 'relative', zIndex: 1, fontSize: sz * 0.4, color: '#fff', fontWeight: 400 }}>9</span>
    </span>
  )
  return <span style={{ ...base, background: BADGE_COLORS[type] || '#888' }} />
}

// ── Avatar circle ─────────────────────────────────────────────────────
function AvatarCircle({ type, colored, size, topBadge, bottomBadge }) {
  const sz = parseInt(size)
  const badgeSz = Math.round(sz * 0.3)
  const offset = Math.round(sz * 0.04)

  const circleStyle = {
    width: sz, height: sz, borderRadius: '50%',
    overflow: 'hidden', position: 'relative',
    border: '2px solid #fff', flexShrink: 0, display: 'inline-block',
  }

  let inner = null
  if (type === 'Human') {
    inner = colored
      ? <><div style={{ position: 'absolute', inset: 0, background: '#d55959' }} /><img src={HUMAN_COLOR_IMG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '125%', objectFit: 'cover' }} /></>
      : <img src={HUMAN_DEFAULT} alt="" style={{ position: 'absolute', inset: '-2px', width: 'calc(100% + 4px)', height: '125%', objectFit: 'cover' }} />
  } else if (type === 'Illustration') {
    inner = colored ? ILLUS_COLOR_SVG : ILLUS_DEFAULT_SVG
  } else if (type === 'Memoji') {
    inner = colored
      ? <><div style={{ position: 'absolute', inset: 0, background: '#e0b0ff' }} /><img src={MEMOJI_COLOR_IMG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /></>
      : <img src={MEMOJI_IMG} alt="" style={{ position: 'absolute', inset: '-2px', width: 'calc(100% + 4px)', height: 'calc(100% + 4px)', objectFit: 'cover' }} />
  } else {
    // Initials
    inner = <>
      <div style={{ position: 'absolute', inset: 0, background: colored ? '#efebff' : '#f5f5f5' }} />
      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colored ? '#7d52f4' : '#888', fontWeight: 600, fontSize: sz * 0.32, letterSpacing: 0.5 }}>KU</span>
    </>
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={circleStyle}>{inner}</div>
      {topBadge && topBadge !== 'None' && (
        <div style={{ position: 'absolute', bottom: offset, right: -offset }}>
          <Badge type={topBadge} sz={badgeSz} />
        </div>
      )}
      {bottomBadge && bottomBadge !== 'None' && (
        <div style={{ position: 'absolute', top: offset, right: -offset }}>
          <Badge type={bottomBadge} sz={badgeSz} />
        </div>
      )}
    </div>
  )
}

// ── KernSelect (portalled) ────────────────────────────────────────────
function KernSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const [pos,  setPos]  = useState({ top: 0, left: 0, width: 0, triggerTop: 0, openUp: false })
  const ref = useRef(null)

  function handleToggle() {
    if (!open && ref.current) {
      const r = ref.current.getBoundingClientRect()
      const openUp = window.innerHeight - r.bottom < 220
      setPos({ top: r.bottom, left: r.left, width: r.width, triggerTop: r.top, openUp })
    }
    setOpen(v => !v)
  }

  useEffect(() => {
    if (!open) return
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('scroll', close, { passive: true })
    return () => window.removeEventListener('scroll', close)
  }, [open])

  return (
    <div className={btnStyles.select} ref={ref}>
      <button className={btnStyles.selectTrigger} onClick={handleToggle}>
        <span className={btnStyles.selectValue}>{value}</span>
        <span className={btnStyles.selectChevron}>{CHEVRON_SVG}</span>
      </button>
      {open && createPortal(
        <div
          className={btnStyles.dropdown}
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
            <div key={opt}
              className={`${btnStyles.dropdownItem} ${opt === value ? btnStyles.dropdownItemActive : ''}`}
              onMouseDown={e => { e.preventDefault(); onChange(opt); setOpen(false) }}>
              {opt}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

// ── KernToggle ────────────────────────────────────────────────────────
function KernToggle({ toggled, onToggle, label }) {
  return (
    <button
      className={`${btnStyles.toggle} ${toggled ? btnStyles.toggleOn : ''}`}
      onClick={onToggle}
      aria-label={label}
    />
  )
}

// ── Panel row ─────────────────────────────────────────────────────────
function PropRow({ label, value, options, onChange, isToggle, toggled, onToggle }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      {isToggle
        ? <KernToggle toggled={toggled} onToggle={onToggle} label={label} />
        : <KernSelect value={value} options={options} onChange={onChange} />
      }
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────
export default function AvatarDemo() {
  const [type,        setType]       = useState('Human')
  const [colored,     setColored]    = useState(false)
  const [size,        setSize]       = useState('64')
  const [showTop,     setShowTop]    = useState(true)
  const [topBadge,    setTopBadge]   = useState('Idle')
  const [showBottom,  setShowBottom] = useState(true)
  const [bottomBadge, setBottomBadge] = useState('Plus')

  return (
    <div className={styles.root}>
      {/* Live preview */}
      <div className={styles.preview}>
        <AvatarCircle
          type={type}
          colored={colored}
          size={size}
          topBadge={showTop ? topBadge : 'None'}
          bottomBadge={showBottom ? bottomBadge : 'None'}
        />
      </div>

      {/* Figma panel */}
      <div className={styles.panel}>
        <PropRow label="Avatar Type"      value={type}       options={AVATAR_TYPES} onChange={setType} />
        <PropRow label="Size"             value={size}       options={SIZES}        onChange={setSize} />
        <PropRow label="Colour"           isToggle toggled={colored}    onToggle={() => setColored(v => !v)} />
        <PropRow label="Show Top Badge"   isToggle toggled={showTop}    onToggle={() => setShowTop(v => !v)} />
        {showTop && (
          <PropRow label="Top Badge"      value={topBadge}   options={BADGE_TYPES}  onChange={setTopBadge} />
        )}
        <PropRow label="Show Bottom Badge" isToggle toggled={showBottom} onToggle={() => setShowBottom(v => !v)} />
        {showBottom && (
          <PropRow label="Bottom Badge"   value={bottomBadge} options={BADGE_TYPES} onChange={setBottomBadge} />
        )}
      </div>
    </div>
  )
}
