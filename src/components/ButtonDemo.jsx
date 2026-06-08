import { useState } from 'react'
import styles from './ButtonDemo.module.css'

const ICON_WHITE  = 'https://www.figma.com/api/mcp/asset/f9e38a1f-fb62-4e34-ba20-84caa7f8a205'
const ICON_PURPLE = 'https://www.figma.com/api/mcp/asset/aa3f2d72-1c24-4ba8-a563-e2c5d14d6aaf'
const ICON_GREY   = 'https://www.figma.com/api/mcp/asset/1850f1de-4b9a-4ec3-bf4a-95fd90e81f9d'

const VARIANTS = ['Primary', 'Secondary', 'Destructive', 'Disabled']
const STATES   = ['Idle', 'Hover', 'Focused', 'Disabled']
const STYLES_OPT = ['Default', 'Stroke', 'Lighter', 'Ghost']

function cycle(arr, current) {
  return arr[(arr.indexOf(current) + 1) % arr.length]
}

function getButtonStyle(variant, state, style, onlyIcon) {
  const isDisabled = variant === 'Disabled' || state === 'Disabled'
  if (isDisabled) return { background: '#d1d1d1', color: '#fff', boxShadow: 'none', border: 'none', cursor: 'not-allowed' }
  if (style === 'Stroke')  return { background: 'transparent', color: '#7d52f4', border: '1px solid #7d52f4', boxShadow: 'none' }
  if (style === 'Lighter') return { background: '#efebff', color: '#7d52f4', border: '0.5px solid rgba(255,255,255,0.8)', boxShadow: 'none' }
  if (style === 'Ghost')   return { background: 'transparent', color: '#7d52f4', border: 'none', boxShadow: 'none' }
  const bases = { Primary: '#7d52f4', Secondary: '#171717', Destructive: '#fb3748' }
  const bg = bases[variant] || bases.Primary
  if (state === 'Hover' && variant === 'Primary') return { background: '#351a75', color: '#fff', border: 'none', boxShadow: 'none' }
  if (state === 'Focused') return { background: bg, color: '#fff', border: 'none', boxShadow: '0 0 0 2px #fff, 0 0 0 4px rgba(125,82,244,0.24)' }
  return { background: bg, color: '#fff', border: 'none', boxShadow: 'none' }
}

function getIcon(variant, state, style) {
  if (variant === 'Disabled' || state === 'Disabled') return ICON_GREY
  if (style === 'Stroke' || style === 'Lighter' || style === 'Ghost') return ICON_PURPLE
  return ICON_WHITE
}

// A single row in the Figma-style panel
function PropRow({ label, value, onClick, isToggle, toggled, onToggle }) {
  if (isToggle) {
    return (
      <div className={styles.row}>
        <span className={styles.rowLabel}>{label}</span>
        <button
          className={`${styles.toggle} ${toggled ? styles.toggleOn : ''}`}
          onClick={onToggle}
          aria-label={label}
        >
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

export default function ButtonDemo() {
  const [variant,  setVariant]  = useState('Primary')
  const [state,    setState]    = useState('Idle')
  const [style,    setStyle]    = useState('Default')
  const [onlyIcon, setOnlyIcon] = useState(false)

  const btnStyle = getButtonStyle(variant, state, style, onlyIcon)
  const iconSrc  = getIcon(variant, state, style)
  const isDisabled = variant === 'Disabled' || state === 'Disabled'

  return (
    <div className={styles.root}>
      {/* Left: live button preview */}
      <div className={styles.preview}>
        <button className={styles.btn} style={btnStyle} disabled={isDisabled}>
          <span className={styles.iconWrap}><img src={iconSrc} alt="" className={styles.icon} /></span>
          {!onlyIcon && <span className={styles.btnLabel}>Continue</span>}
          {!onlyIcon && <span className={styles.iconWrap}><img src={iconSrc} alt="" className={styles.icon} /></span>}
        </button>
      </div>

      {/* Right: Figma-style property panel */}
      <div className={styles.panel}>
        {/* Panel header */}
        <div className={styles.panelHeader}>
          <div className={styles.panelTitle}>
            <span>Button</span>
            <svg viewBox="0 0 10 6" fill="none" width="10" height="6">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.panelIcons}>
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14" opacity=".4">
              <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            <svg viewBox="0 0 16 4" fill="none" width="14" height="4" opacity=".4">
              <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
              <circle cx="8" cy="2" r="1.5" fill="currentColor"/>
              <circle cx="14" cy="2" r="1.5" fill="currentColor"/>
            </svg>
          </div>
        </div>
        <p className={styles.panelSub}>From this file <span className={styles.diamond}>◇</span></p>
        <div className={styles.divider} />

        {/* Properties */}
        <PropRow label="Size"    value="Medium (44)" onClick={() => {}} />
        <PropRow label="Variant" value={variant}
          onClick={() => setVariant(cycle(VARIANTS, variant))} />
        <PropRow label="Only Icon" isToggle toggled={onlyIcon} onToggle={() => setOnlyIcon(v => !v)} />
        <PropRow label="Style"  value={style}
          onClick={() => setStyle(cycle(STYLES_OPT, style))} />
        <PropRow label="State"  value={state}
          onClick={() => setState(cycle(STATES, state))} />
        <PropRow label="Icon"   value="atom" onClick={() => {}} />
      </div>
    </div>
  )
}
