import { useState, useRef, useEffect } from 'react'
import styles from './ButtonDemo.module.css'

const ICON_WHITE  = 'https://www.figma.com/api/mcp/asset/f9e38a1f-fb62-4e34-ba20-84caa7f8a205'
const ICON_PURPLE = 'https://www.figma.com/api/mcp/asset/aa3f2d72-1c24-4ba8-a563-e2c5d14d6aaf'
const ICON_GREY   = 'https://www.figma.com/api/mcp/asset/1850f1de-4b9a-4ec3-bf4a-95fd90e81f9d'
// Chevron icon for dropdown
const CHEVRON_ICON = 'https://www.figma.com/api/mcp/asset/2e0af8b4-1607-4ffb-8843-9bdbff76dda6'

const VARIANTS   = ['Primary', 'Secondary', 'Destructive', 'Disabled']
const STATES     = ['Idle', 'Hover', 'Focused', 'Disabled']
const STYLES_OPT = ['Default', 'Stroke', 'Lighter', 'Ghost']
const SIZES      = ['36', '40', '44']

const SIZE_PADDING = { '36': '8px 12px', '40': '10px 12px', '44': '12px 14px' }

function getButtonStyle(variant, state, style) {
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

// ── KernUI-style select dropdown ──────────────────────────────────────
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
    <div className={styles.select} ref={ref}>
      <button className={styles.selectTrigger} onClick={() => setOpen(v => !v)}>
        <span className={styles.selectValue}>{value}</span>
        <span className={styles.selectChevron}>
          <img src={CHEVRON_ICON} alt="" width="16" height="16" style={{ display:'block' }} />
        </span>
      </button>
      {open && (
        <div className={styles.dropdown}>
          {options.map(opt => (
            <div
              key={opt}
              className={`${styles.dropdownItem} ${opt === value ? styles.dropdownItemActive : ''}`}
              onClick={() => { onChange(opt); setOpen(false) }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Panel row ─────────────────────────────────────────────────────────
function PropRow({ label, value, options, onChange, isToggle, toggled, onToggle }) {
  if (isToggle) {
    return (
      <div className={styles.row}>
        <span className={styles.rowLabel}>{label}</span>
        <button className={`${styles.toggle} ${toggled ? styles.toggleOn : ''}`} onClick={onToggle} aria-label={label} />
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

// ── Main ──────────────────────────────────────────────────────────────
export default function ButtonDemo() {
  const [variant,  setVariant]  = useState('Primary')
  const [state,    setState]    = useState('Idle')
  const [style,    setStyle]    = useState('Default')
  const [size,     setSize]     = useState('44')
  const [onlyIcon, setOnlyIcon] = useState(false)

  const btnStyle  = getButtonStyle(variant, state, style)
  const iconSrc   = getIcon(variant, state, style)
  const isDisabled = variant === 'Disabled' || state === 'Disabled'

  return (
    <div className={styles.root}>
      {/* Live button preview */}
      <div className={styles.preview}>
        <button
          className={styles.btn}
          style={{ ...btnStyle, padding: SIZE_PADDING[size] }}
          disabled={isDisabled}
        >
          <span className={styles.iconWrap}><img src={iconSrc} alt="" className={styles.icon} /></span>
          {!onlyIcon && <span className={styles.btnLabel}>Continue</span>}
          {!onlyIcon && <span className={styles.iconWrap}><img src={iconSrc} alt="" className={styles.icon} /></span>}
        </button>
      </div>

      {/* Figma-style property panel */}
      <div className={styles.panel}>
        <PropRow label="Size"      value={size}    options={SIZES}      onChange={setSize} />
        <PropRow label="Variant"   value={variant} options={VARIANTS}   onChange={setVariant} />
        <PropRow label="Only Icon" isToggle toggled={onlyIcon} onToggle={() => setOnlyIcon(v => !v)} />
        <PropRow label="Style"     value={style}   options={STYLES_OPT} onChange={setStyle} />
        <PropRow label="State"     value={state}   options={STATES}     onChange={setState} />
      </div>
    </div>
  )
}
