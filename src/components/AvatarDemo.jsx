import { useState, useRef, useEffect } from 'react'
import styles from './AvatarDemo.module.css'
import btnStyles from './ButtonDemo.module.css'

// ── Avatar assets ─────────────────────────────────────────────────────
const HUMAN_DEFAULT    = 'https://www.figma.com/api/mcp/asset/e21c4891-335c-4203-9a33-241f5f57567a'
const HUMAN_COLOR_IMG  = 'https://www.figma.com/api/mcp/asset/e82bbf9c-a999-4da7-a439-44110f40f653'
const ILLUS_DEFAULT    = 'https://www.figma.com/api/mcp/asset/3a2e69dd-8515-455d-86fc-4b34a59011aa'
const ILLUS_COLOR_IMG  = 'https://www.figma.com/api/mcp/asset/95ce4427-5844-4d23-b570-be3cfaedb17f'
const MEMOJI_IMG       = 'https://www.figma.com/api/mcp/asset/679c3160-232b-4a74-ae73-cc7ac9544b93'
const MEMOJI_COLOR_IMG = 'https://www.figma.com/api/mcp/asset/ebc1c40c-9fa3-44f1-91ad-86e58e7b019f'

// Badge assets
const PLUS_ICN    = 'https://www.figma.com/api/mcp/asset/afafa593-ebb0-4f78-9e8c-81fb2ec18194'
const VERIFIED    = 'https://www.figma.com/api/mcp/asset/7c0cf0db-1c49-4ebf-9fc8-a1a310ee0c00'
const ARROW_ICN   = 'https://www.figma.com/api/mcp/asset/2cf9fae7-7e17-4686-92f5-549eb1e88738'
const X_ICN       = 'https://www.figma.com/api/mcp/asset/e7efa234-7724-4972-a6a6-1b2934fc973f'
const CHEVRON     = 'https://www.figma.com/api/mcp/asset/2e0af8b4-1607-4ffb-8843-9bdbff76dda6'

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
      <img src={VERIFIED} alt="" style={{ width: '100%', height: '100%', display: 'block' }} />
    </span>
  )
  if (type === 'Plus') return (
    <span style={{ ...base, background: '#1fc16b' }}>
      <img src={PLUS_ICN} alt="" style={{ width: sz * 0.5, height: sz * 0.5 }} />
    </span>
  )
  if (type === 'Cancel') return (
    <span style={{ ...base, background: '#fb3748' }}>
      <img src={X_ICN} alt="" style={{ width: sz * 0.4, height: sz * 0.4 }} />
    </span>
  )
  if (type === 'Icon') return (
    <span style={{ ...base, background: '#fff', position: 'relative' }}>
      <span style={{ position: 'absolute', inset: '4.8% 5% 5.2%', background: '#7d52f4', borderRadius: '50%' }} />
      <img src={ARROW_ICN} alt="" style={{ width: sz * 0.4, height: sz * 0.4, position: 'relative', zIndex: 1 }} />
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
    inner = colored
      ? <><div style={{ position: 'absolute', inset: 0, background: '#f5f5f5' }} /><img src={ILLUS_COLOR_IMG} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1) rotate(180deg)' }} /></>
      : <img src={ILLUS_DEFAULT} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
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

// ── KernSelect (shared from ButtonDemo styles) ────────────────────────
function KernSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])
  return (
    <div className={btnStyles.select} ref={ref}>
      <button className={btnStyles.selectTrigger} onClick={() => setOpen(v => !v)}>
        <span className={btnStyles.selectValue}>{value}</span>
        <span className={btnStyles.selectChevron}>
          <img src={CHEVRON} alt="" width="12" height="12" style={{ display: 'block' }} />
        </span>
      </button>
      {open && (
        <div className={btnStyles.dropdown}>
          {options.map(opt => (
            <div key={opt}
              className={`${btnStyles.dropdownItem} ${opt === value ? btnStyles.dropdownItemActive : ''}`}
              onClick={() => { onChange(opt); setOpen(false) }}>
              {opt}
            </div>
          ))}
        </div>
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
