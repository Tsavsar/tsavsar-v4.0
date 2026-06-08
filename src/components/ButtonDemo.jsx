import { useState } from 'react'
import styles from './ButtonDemo.module.css'

// Icon assets from KernUI design system
const ICON_WHITE  = 'https://www.figma.com/api/mcp/asset/f9e38a1f-fb62-4e34-ba20-84caa7f8a205'
const ICON_PURPLE = 'https://www.figma.com/api/mcp/asset/aa3f2d72-1c24-4ba8-a563-e2c5d14d6aaf'
const ICON_GREY   = 'https://www.figma.com/api/mcp/asset/1850f1de-4b9a-4ec3-bf4a-95fd90e81f9d'

const TABS = [
  {
    id: 'variant',
    label: 'Variant',
    options: ['Primary', 'Secondary', 'Destructive', 'Disabled'],
  },
  {
    id: 'state',
    label: 'State',
    options: ['Idle', 'Hover', 'Focused', 'Disabled'],
  },
  {
    id: 'style',
    label: 'Style',
    options: ['Default', 'Stroke', 'Lighter', 'Ghost'],
  },
  {
    id: 'icon',
    label: 'Icon',
    options: ['Icon + Text', 'Only Icon'],
  },
]

function getButtonStyle(variant, state, style) {
  const isDisabled = variant === 'Disabled' || state === 'Disabled'

  if (isDisabled) {
    return { background: '#d1d1d1', color: '#fff', boxShadow: 'none', border: 'none', cursor: 'not-allowed', opacity: 1 }
  }

  // Variant base colours
  const variantMap = {
    Primary:     { background: '#7d52f4', color: '#fff' },
    Secondary:   { background: '#171717', color: '#fff' },
    Destructive: { background: '#fb3748', color: '#fff' },
  }

  // Style overrides (only applies to primary-ish colours)
  if (style === 'Stroke') {
    return { background: 'transparent', color: '#7d52f4', border: '1px solid #7d52f4', boxShadow: 'none' }
  }
  if (style === 'Lighter') {
    return { background: '#efebff', color: '#7d52f4', border: '0.5px solid rgba(255,255,255,0.8)', boxShadow: 'none' }
  }
  if (style === 'Ghost') {
    return { background: 'transparent', color: '#7d52f4', border: 'none', boxShadow: 'none' }
  }

  // Default solid — apply state modifiers
  const base = variantMap[variant] || variantMap.Primary
  if (state === 'Hover' && variant === 'Primary') {
    return { ...base, background: '#351a75', boxShadow: 'none', border: 'none' }
  }
  if (state === 'Focused') {
    return { ...base, boxShadow: '0 0 0 2px #fff, 0 0 0 4px rgba(125,82,244,0.24)', border: 'none' }
  }
  return { ...base, boxShadow: 'none', border: 'none' }
}

function getIcon(variant, state, style) {
  const isDisabled = variant === 'Disabled' || state === 'Disabled'
  if (isDisabled) return ICON_GREY
  if (style === 'Stroke' || style === 'Lighter' || style === 'Ghost') return ICON_PURPLE
  return ICON_WHITE
}

function Icon({ src }) {
  return (
    <span className={styles.iconWrap}>
      <img src={src} alt="" className={styles.icon} />
    </span>
  )
}

export default function ButtonDemo() {
  const [activeTab, setActiveTab] = useState('variant')
  const [selected, setSelected] = useState({
    variant: 'Primary',
    state: 'Idle',
    style: 'Default',
    icon: 'Icon + Text',
  })

  function pick(tabId, option) {
    setSelected(s => ({ ...s, [tabId]: option }))
  }

  const btnStyle  = getButtonStyle(selected.variant, selected.state, selected.style)
  const iconSrc   = getIcon(selected.variant, selected.state, selected.style)
  const iconOnly  = selected.icon === 'Only Icon'
  const currentTab = TABS.find(t => t.id === activeTab)

  return (
    <div className={styles.root}>
      {/* Live button preview */}
      <div className={styles.preview}>
        <button
          className={styles.btn}
          style={btnStyle}
          disabled={selected.variant === 'Disabled' || selected.state === 'Disabled'}
        >
          <Icon src={iconSrc} />
          {!iconOnly && <span className={styles.btnLabel}>Continue</span>}
          {!iconOnly && <Icon src={iconSrc} />}
        </button>
      </div>

      {/* Category tabs */}
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Option pills */}
      <div className={styles.options}>
        {currentTab.options.map(opt => (
          <button
            key={opt}
            className={`${styles.pill} ${selected[activeTab] === opt ? styles.pillActive : ''}`}
            onClick={() => pick(activeTab, opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
