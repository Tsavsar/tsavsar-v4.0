import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './RichTextEditorDemo.module.css'
import btnStyles from './ButtonDemo.module.css'

const VARIANTS      = ['Full', 'Compact', 'Minimal', 'Media', 'Alignment']
const HEADING_OPTS  = ['Body', 'Header', 'H1', 'H2', 'H3', 'H4', 'Caption']
const SIZE_OPTS     = ['10px', '12px', '14px', '16px', '18px', '24px', '32px']
const COLORS = [
  '#7d52f4', '#171717', '#fb3748', '#1daf61', '#f6b51e',
  '#0077ff', '#ff6b00', '#e040fb', '#5c5c5c', '#ffffff',
]

// ── Icons ─────────────────────────────────────────────────────────────
function IconBold() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4.5 3h4a2.5 2.5 0 010 5H4.5V3zM4.5 8h4.5a2.5 2.5 0 010 5H4.5V8z" stroke="#5c5c5c" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconItalic() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7 3h4M5 13h4M9 3l-2 10" stroke="#5c5c5c" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconUnderline() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 3v4.5a4 4 0 008 0V3M3 13h10" stroke="#5c5c5c" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconStrike() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M5.5 5.5C5.5 4.12 6.62 3 8 3s2.5 1.12 2.5 2.5c0 .85-.43 1.6-1.08 2.05M6 10.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5" stroke="#5c5c5c" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconCode() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 5l-3 3 3 3M11 5l3 3-3 3" stroke="#5c5c5c" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconLink() {
  return <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M8.37 6.89a5 5 0 00-1.46 1.46l-.01.01a4 4 0 000 5.66l2.17 2.17a4 4 0 005.66-5.65l-.76-.77" stroke="#5c5c5c" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.63 11.11a5 5 0 001.46-1.46l.01-.01a4 4 0 000-5.66L8.93 1.81A4 4 0 003.27 7.46l.76.76" stroke="#5c5c5c" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconAlignLeft()    { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 7h8M2 10h10M2 13h6" stroke="#5c5c5c" strokeWidth="1.35" strokeLinecap="round"/></svg> }
function IconAlignCenter()  { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 7h8M3 10h10M5 13h6" stroke="#5c5c5c" strokeWidth="1.35" strokeLinecap="round"/></svg> }
function IconAlignRight()   { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M6 7h8M4 10h10M8 13h6" stroke="#5c5c5c" strokeWidth="1.35" strokeLinecap="round"/></svg> }
function IconAlignJustify() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 7h12M2 10h12M2 13h12" stroke="#5c5c5c" strokeWidth="1.35" strokeLinecap="round"/></svg> }
function IconComment()  { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13 2H3a1 1 0 00-1 1v7a1 1 0 001 1h2l2 3 2-3h4a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="#5c5c5c" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IconAttach()   { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 7.5l-6 6a4.24 4.24 0 01-6-6l6-6a2.83 2.83 0 014 4l-6 6a1.41 1.41 0 01-2-2l5.5-5.5" stroke="#5c5c5c" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IconImage()    { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="#5c5c5c" strokeWidth="1.35"/><circle cx="5.5" cy="5.5" r="1" fill="#5c5c5c"/><path d="M2 11l3-3 2 2 2.5-3L14 11" stroke="#5c5c5c" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IconMore()     { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="3" cy="8" r="1.2" fill="#5c5c5c"/><circle cx="8" cy="8" r="1.2" fill="#5c5c5c"/><circle cx="13" cy="8" r="1.2" fill="#5c5c5c"/></svg> }
function Chevron({ size = 10 }) {
  return <svg width={size} height={size} viewBox="0 0 18 18" fill="none"><path d="M15.25 6.5L9 12.75L2.75 6.5" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

// ── Mini portalled dropdown ────────────────────────────────────────────
function MiniSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos]   = useState({ top: 0, left: 0, width: 0 })
  const ref = useRef(null)

  function toggle() {
    if (!open && ref.current) {
      const r = ref.current.getBoundingClientRect()
      setPos({ top: r.bottom + 4, left: r.left, width: Math.max(r.width, 90) })
    }
    setOpen(v => !v)
  }

  useEffect(() => {
    if (!open) return
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <button className={styles.textDropdown} onClick={toggle}>
        <span>{value}</span>
        <Chevron />
      </button>
      {open && createPortal(
        <div className={btnStyles.dropdown} style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999, maxHeight: 200, overflowY: 'auto' }}>
          {options.map(opt => (
            <div key={opt}
              className={`${btnStyles.dropdownItem} ${opt === value ? btnStyles.dropdownItemActive : ''}`}
              onMouseDown={e => { e.preventDefault(); onChange(opt); setOpen(false) }}
            >{opt}</div>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

// ── Color picker (portalled) ──────────────────────────────────────────
function ColorSelect({ color, onChange }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos]   = useState({ top: 0, left: 0 })
  const ref = useRef(null)

  function toggle() {
    if (!open && ref.current) {
      const r = ref.current.getBoundingClientRect()
      setPos({ top: r.bottom + 4, left: r.left })
    }
    setOpen(v => !v)
  }

  useEffect(() => {
    if (!open) return
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div ref={ref} style={{ display: 'inline-flex' }}>
      <button className={styles.colorBtn} onClick={toggle}>
        <span className={styles.colorSwatch} style={{ background: color }} />
        <Chevron />
      </button>
      {open && createPortal(
        <div className={styles.colorPalette} style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}>
          {COLORS.map(c => (
            <button
              key={c}
              className={`${styles.colorDot} ${c === color ? styles.colorDotActive : ''}`}
              style={{ background: c, border: c === '#ffffff' ? '1px solid #e0e0e0' : 'none' }}
              onMouseDown={e => { e.preventDefault(); onChange(c); setOpen(false) }}
            />
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

// ── Variant select (portalled) ────────────────────────────────────────
function VariantSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos]   = useState({ top: 0, left: 0, width: 0 })
  const ref = useRef(null)

  function toggle() {
    if (!open && ref.current) {
      const r = ref.current.getBoundingClientRect()
      setPos({ top: r.bottom + 4, left: r.left, width: r.width })
    }
    setOpen(v => !v)
  }

  useEffect(() => {
    if (!open) return
    const close = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div className={btnStyles.select} ref={ref}>
      <button className={btnStyles.selectTrigger} onClick={toggle}>
        <span className={btnStyles.selectValue}>{value}</span>
        <span className={btnStyles.selectChevron}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18">
            <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="#b0b0b0">
              <path d="M15.25 6.5L9 12.75L2.75 6.5" />
            </g>
          </svg>
        </span>
      </button>
      {open && createPortal(
        <div className={btnStyles.dropdown} style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}>
          {VARIANTS.map(v => (
            <div key={v}
              className={`${btnStyles.dropdownItem} ${v === value ? btnStyles.dropdownItemActive : ''}`}
              onMouseDown={e => { e.preventDefault(); onChange(v); setOpen(false) }}
            >{v}</div>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}

function Div() { return <div className={styles.div} /> }
function ToolBtn({ children }) {
  return <button className={styles.toolBtn}>{children}</button>
}

// ── Toolbar ───────────────────────────────────────────────────────────
function Toolbar({ variant, showMore, heading, setHeading, size, setSize, color, setColor }) {
  const showFull    = variant === 'Full'
  const showCompact = variant === 'Compact'
  const showMinimal = variant === 'Minimal'
  const showMedia   = variant === 'Media'
  const showAlign   = variant === 'Alignment'

  return (
    <div className={styles.toolbar}>
      {(showFull || showCompact) && (
        <>
          <div className={styles.group}>
            <MiniSelect value={heading} options={HEADING_OPTS} onChange={setHeading} />
            <MiniSelect value={size}    options={SIZE_OPTS}    onChange={setSize} />
            <ColorSelect color={color} onChange={setColor} />
          </div>
          <Div />
        </>
      )}

      {(showFull || showMinimal) && (
        <div className={styles.group}>
          <ToolBtn><IconBold /></ToolBtn>
          <ToolBtn><IconItalic /></ToolBtn>
          <ToolBtn><IconUnderline /></ToolBtn>
          <ToolBtn><IconStrike /></ToolBtn>
          <ToolBtn><IconCode /></ToolBtn>
          <ToolBtn><IconLink /></ToolBtn>
        </div>
      )}

      {(showCompact || showMedia) && (
        <div className={styles.group}>
          <ToolBtn><IconComment /></ToolBtn>
          <ToolBtn><IconAttach /></ToolBtn>
          <ToolBtn><IconImage /></ToolBtn>
        </div>
      )}

      {(showCompact || showMinimal || showMedia) && showMore && (
        <><Div /><ToolBtn><IconMore /></ToolBtn></>
      )}

      {(showFull || showAlign) && (
        <>
          {showFull && <Div />}
          <div className={styles.group}>
            <ToolBtn><IconAlignLeft /></ToolBtn>
            <ToolBtn><IconAlignCenter /></ToolBtn>
            <ToolBtn><IconAlignRight /></ToolBtn>
            <ToolBtn><IconAlignJustify /></ToolBtn>
          </div>
        </>
      )}

      {showFull && (
        <>
          <Div />
          <div className={styles.group}>
            <ToolBtn><IconComment /></ToolBtn>
            <ToolBtn><IconAttach /></ToolBtn>
            <ToolBtn><IconImage /></ToolBtn>
          </div>
        </>
      )}

      {(showFull || showAlign) && showMore && (
        <><Div /><ToolBtn><IconMore /></ToolBtn></>
      )}
    </div>
  )
}

function KernToggle({ toggled, onToggle }) {
  return (
    <button
      className={`${btnStyles.toggle} ${toggled ? btnStyles.toggleOn : ''}`}
      onClick={onToggle}
      aria-label="Toggle"
    />
  )
}

// ── Main export ───────────────────────────────────────────────────────
export default function RichTextEditorDemo() {
  const [variant,  setVariant]  = useState('Full')
  const [showMore, setShowMore] = useState(true)
  const [heading,  setHeading]  = useState('Header')
  const [size,     setSize]     = useState('14px')
  const [color,    setColor]    = useState('#7d52f4')

  return (
    <div className={styles.root}>
      <div className={styles.preview}>
        <Toolbar variant={variant} showMore={showMore} heading={heading} setHeading={setHeading} size={size} setSize={setSize} color={color} setColor={setColor} />
      </div>

      <div className={styles.controls}>
        <div className={styles.panel}>
          <div className={btnStyles.row}>
            <span className={btnStyles.rowLabel}>Variant</span>
            <VariantSelect value={variant} onChange={setVariant} />
          </div>
          <div className={btnStyles.row}>
            <span className={btnStyles.rowLabel}>Show More</span>
            <KernToggle toggled={showMore} onToggle={() => setShowMore(v => !v)} />
          </div>
        </div>
      </div>
    </div>
  )
}
