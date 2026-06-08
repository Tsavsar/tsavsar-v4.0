import { useState } from 'react'
import styles from './AlertDemo.module.css'

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
function PropRow({ label, value, onClick, isToggle, toggled, onToggle }) {
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
    <div className={styles.row} onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>
        {value}
        <svg viewBox="0 0 10 6" fill="none" width="10" height="6" style={{ flexShrink:0, opacity:0.4 }}>
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
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
        <div className={styles.panelHeader}>
          <div className={styles.panelTitle}>
            <span>Alert</span>
            <svg viewBox="0 0 10 6" fill="none" width="10" height="6">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.panelIcons}>
            <svg viewBox="0 0 16 16" fill="none" width="13" height="13" opacity=".4">
              <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            <svg viewBox="0 0 16 4" fill="none" width="13" height="4" opacity=".4">
              <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="2" r="1.5" fill="currentColor"/>
              <circle cx="14" cy="2" r="1.5" fill="currentColor"/>
            </svg>
          </div>
        </div>
        <p className={styles.panelSub}>From this file <span className={styles.diamond}>◇</span></p>
        <div className={styles.divider} />

        <PropRow label="Variant"       value={variant} onClick={() => setVariant(cycle(VARIANTS, variant))} />
        <PropRow label="State"         value={state}   onClick={() => setStateVal(cycle(STATES, state))} />
        <PropRow label="Size"          value={size}    onClick={() => setSize(cycle(SIZES, size))} />
        <PropRow label="Show Close"    isToggle toggled={showClose}   onToggle={() => setShowClose(v => !v)} />
        <PropRow label="Show Button(s)" isToggle toggled={showButtons} onToggle={() => setShowButtons(v => !v)} />
        <PropRow label="Show Icon"     isToggle toggled={showIcon}    onToggle={() => setShowIcon(v => !v)} />
      </div>
    </div>
  )
}
