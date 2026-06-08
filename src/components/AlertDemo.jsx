import { useState, useRef, useEffect } from 'react'
import styles from './AlertDemo.module.css'
import btnStyles from './ButtonDemo.module.css'

const CHEVRON_ICON = 'https://www.figma.com/api/mcp/asset/7d59be1e-cd15-45e3-9cf6-833ae01adebf'

function KernSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    function onOut(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onOut)
    return () => document.removeEventListener('mousedown', onOut)
  }, [open])
  return (
    <div className={btnStyles.select} ref={ref}>
      <button className={btnStyles.selectTrigger} onClick={() => setOpen(v => !v)}>
        <span className={btnStyles.selectValue}>{value}</span>
        <span className={btnStyles.selectChevron}>
          <img src={CHEVRON_ICON} alt="" width="12" height="12" style={{ display:'block' }} />
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

// ── Colour map per state ──────────────────────────────────────────────
const COLORS = {
  Success: { fill: '#1fc16b', light: '#e8fef0', icon: '#1fc16b' },
  Error:   { fill: '#fb3748', light: '#ffebec', icon: '#fb3748' },
  Info:    { fill: '#335cff', light: '#ebedff', icon: '#335cff' },
  Warning: { fill: '#fa7319', light: '#fff4eb', icon: '#fa7319' },
  Misc:    { fill: '#a3a3a3', light: '#f5f5f5', icon: '#a3a3a3' },
}

const VARIANTS = ['Fill', 'Light', 'Stroke', 'Dark']
const STATES   = ['Success', 'Error', 'Info', 'Warning', 'Misc']
const SIZES    = ['Small', 'Medium', 'Large']

function cycle(arr, cur) { return arr[(arr.indexOf(cur) + 1) % arr.length] }

// ── Inline icons ──────────────────────────────────────────────────────
function AlertIcon({ state, color }) {
  const icons = {
    Success: (
      <svg viewBox="0 0 20 20" fill="none" width="100%" height="100%">
        <circle cx="10" cy="10" r="7.5" stroke={color} strokeWidth="1.4"/>
        <path d="M6.5 10.2l2.3 2.3 4.7-4.7" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Error: (
      <svg viewBox="0 0 20 20" fill="none" width="100%" height="100%">
        <circle cx="10" cy="10" r="7.5" stroke={color} strokeWidth="1.4"/>
        <path d="M10 6.5v4M10 13v.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    Info: (
      <svg viewBox="0 0 20 20" fill="none" width="100%" height="100%">
        <circle cx="10" cy="10" r="7.5" stroke={color} strokeWidth="1.4"/>
        <path d="M10 9.5v4M10 7v.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    Warning: (
      <svg viewBox="0 0 20 20" fill="none" width="100%" height="100%">
        <path d="M10 3.5L17.5 16.5H2.5L10 3.5Z" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 9.5v3M10 14v.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    Misc: (
      <svg viewBox="0 0 20 20" fill="none" width="100%" height="100%">
        <circle cx="10" cy="10" r="7.5" stroke={color} strokeWidth="1.4"/>
        <path d="M7.5 8.2a2.5 2.5 0 014.8.8c0 1.6-2.3 2-2.3 3.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M10 14v.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  }
  return icons[state] || null
}

function CloseIcon({ color }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" width="100%" height="100%">
      <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

// ── Alert preview ─────────────────────────────────────────────────────
function AlertPreview({ variant, state, size, showClose, showButtons, showIcon }) {
  const col = COLORS[state]

  // Background and text per variant
  const variantStyle = {
    Fill:   { bg: col.fill,   text: '#fff',    border: 'none',                         shadow: 'none' },
    Light:  { bg: col.light,  text: '#171717', border: 'none',                         shadow: 'none' },
    Stroke: { bg: '#fff',     text: '#171717', border: '1px solid rgba(0,0,0,0.07)',   shadow: '0 2px 8px rgba(0,0,0,0.06)' },
    Dark:   { bg: '#1c1c1c',  text: '#fff',    border: '1.5px solid rgba(255,255,255,0.06)', shadow: '0 2px 8px rgba(0,0,0,0.12)' },
  }[variant]

  // Icon colour
  const iconColor  = (variant === 'Fill' || variant === 'Dark') ? variantStyle.text : col.icon
  const cancelColor = variantStyle.text

  // Size tokens
  const sizeTokens = {
    Small:  { px: 8,  py: 6,  r: 8,  fs: 12, iconSize: 16 },
    Medium: { px: 10, py: 8,  r: 12, fs: 14, iconSize: 20 },
    Large:  { px: 16, py: 16, r: 24, fs: 14, iconSize: 24 },
  }[size]

  const isLarge = size === 'Large'

  return (
    <div
      className={styles.alert}
      style={{
        background: variantStyle.bg,
        border: variantStyle.border,
        boxShadow: variantStyle.shadow,
        borderRadius: sizeTokens.r,
        padding: `${sizeTokens.py}px ${sizeTokens.px}px`,
        gap: isLarge ? 10 : 6,
        alignItems: isLarge ? 'flex-start' : 'center',
        fontSize: sizeTokens.fs,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Icon */}
      {showIcon && (
        <span className={styles.alertIcon} style={{ width: sizeTokens.iconSize, height: sizeTokens.iconSize, flexShrink: 0, marginTop: isLarge ? 2 : 0 }}>
          <AlertIcon state={state} color={iconColor} />
        </span>
      )}

      {/* Body */}
      <div className={styles.alertBody} style={{ flex: 1, minWidth: 0 }}>
        {isLarge && (
          <p className={styles.alertTitle} style={{ color: variantStyle.text, fontSize: 16 }}>
            This is an alert notification
          </p>
        )}
        <p className={styles.alertText} style={{ color: variantStyle.text }}>
          {isLarge
            ? "This is a sample notification message. It's a bit longer to help you visualize how content will appear in the final layout."
            : 'This is an alert notification'}
        </p>
        {isLarge && showButtons && (
          <div className={styles.alertActions}>
            <button className={styles.alertActionBtn} style={{ color: variantStyle.text, textDecoration: 'underline' }}>Continue</button>
            <button className={styles.alertActionBtn} style={{ color: variantStyle.text }}>Learn more</button>
          </div>
        )}
      </div>

      {/* Close controls (non-large) */}
      {!isLarge && showButtons && (
        <button className={styles.alertCancel} style={{ color: cancelColor, fontSize: sizeTokens.fs, textDecoration: 'underline' }}>
          Cancel
        </button>
      )}
      {!isLarge && showClose && (
        <span className={styles.alertCloseIcon} style={{ width: sizeTokens.iconSize, height: sizeTokens.iconSize, flexShrink: 0 }}>
          <CloseIcon color={iconColor} />
        </span>
      )}

      {/* Large close */}
      {isLarge && showClose && (
        <span className={styles.alertCloseAbsolute} style={{ color: iconColor }}>
          <CloseIcon color={iconColor} />
        </span>
      )}
    </div>
  )
}

// ── Figma-style panel row ─────────────────────────────────────────────
function PropRow({ label, value, options, onChange, isToggle, toggled, onToggle }) {
  if (isToggle) {
    return (
      <div className={styles.row}>
        <span className={styles.rowLabel}>{label}</span>
        <button className={`${styles.toggle} ${toggled ? styles.toggleOn : ''}`} onClick={onToggle}>
          <span className={styles.toggleThumb} />
        </button>
      </div>
    )
  }
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <KernSelect value={value} options={options} onChange={onChange} />
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────
export default function AlertDemo() {
  const [variant,     setVariant]     = useState('Fill')
  const [state,       setStateVal]    = useState('Error')
  const [size,        setSize]        = useState('Medium')
  const [showClose,   setShowClose]   = useState(true)
  const [showButtons, setShowButtons] = useState(true)
  const [showIcon,    setShowIcon]    = useState(true)

  return (
    <div className={styles.root}>
      {/* Live preview */}
      <div className={styles.preview}>
        <AlertPreview
          variant={variant} state={state} size={size}
          showClose={showClose} showButtons={showButtons} showIcon={showIcon}
        />
      </div>

      {/* Figma panel */}
      <div className={styles.panel}>
        <PropRow label="Variant"        value={variant} options={VARIANTS} onChange={setVariant} />
        <PropRow label="State"          value={state}   options={STATES}   onChange={setStateVal} />
        <PropRow label="Size"           value={size}    options={SIZES}    onChange={setSize} />
        <PropRow label="Show Close"     isToggle toggled={showClose}   onToggle={() => setShowClose(v => !v)} />
        <PropRow label="Show Button(s)" isToggle toggled={showButtons} onToggle={() => setShowButtons(v => !v)} />
        <PropRow label="Show Icon"      isToggle toggled={showIcon}    onToggle={() => setShowIcon(v => !v)} />
      </div>
    </div>
  )
}
