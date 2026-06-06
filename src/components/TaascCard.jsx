import { useState, useRef, useEffect } from 'react'
import styles from './TaascCard.module.css'

const PRIORITIES = ['High', 'Medium', 'Low']
const STATUSES   = ['Queued', 'In-Progress', 'Completed', 'Dropped']
const ALL_TAGS   = ['Design', 'Development', 'Marketing', 'Testing']
const ALL_PROJECTS = ['Taasc management', 'Lönar']

const PRIORITY_COLORS = { High: '#FA4545', Medium: '#FA7319', Low: '#3B82F6' }
const STATUS_COLORS   = { Queued: '#a3a3a3', 'In-Progress': '#FA7319', Completed: '#22C55E', Dropped: '#FA4545' }

function Dropdown({ options, value, onChange, renderOption, renderTrigger }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    function handler(e) { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  return (
    <div ref={ref} className={styles.dropdown}>
      <button className={styles.dropTrigger} onClick={() => setOpen(o => !o)}>
        {renderTrigger(value)}
      </button>
      {open && (
        <div className={styles.dropMenu}>
          {options.map(opt => (
            <button key={opt} className={`${styles.dropItem} ${opt === value ? styles.dropItemActive : ''}`}
              onClick={() => { onChange(opt); setOpen(false) }}>
              {renderOption(opt)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function TagDropdown({ selected, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    function handler(e) { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  const toggle = (tag) => onChange(selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag])
  return (
    <div ref={ref} className={styles.dropdown}>
      <button className={styles.chipBtn} onClick={() => setOpen(o => !o)}>
        {selected.join(', ') || 'Add tag'}
      </button>
      {open && (
        <div className={styles.dropMenu}>
          {ALL_TAGS.map(tag => (
            <button key={tag} className={`${styles.dropItem} ${selected.includes(tag) ? styles.dropItemActive : ''}`}
              onClick={() => toggle(tag)}>
              {selected.includes(tag) && <span className={styles.check}>✓</span>}
              {tag}
            </button>
          ))}
          <div className={styles.dropDivider} />
          <button className={`${styles.dropItem} ${styles.addNew}`}>+ Add tag</button>
        </div>
      )}
    </div>
  )
}

function ProjectDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    function handler(e) { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  return (
    <div ref={ref} className={styles.dropdown}>
      <button className={styles.chipBtn} onClick={() => setOpen(o => !o)}>
        {value}
      </button>
      {open && (
        <div className={styles.dropMenu}>
          {ALL_PROJECTS.map(p => (
            <button key={p} className={`${styles.dropItem} ${p === value ? styles.dropItemActive : ''}`}
              onClick={() => { onChange(p); setOpen(false) }}>
              {p === value && <span className={styles.check}>✓</span>}
              {p}
            </button>
          ))}
          <div className={styles.dropDivider} />
          <button className={`${styles.dropItem} ${styles.addNew}`}>+ Add project</button>
        </div>
      )}
    </div>
  )
}

function MiniCalendar({ value, onChange }) {
  const [month, setMonth] = useState(new Date(2026, 1, 1))

  const year = month.getFullYear()
  const mon  = month.getMonth()
  const firstDay = new Date(year, mon, 1).getDay()
  const daysInMonth = new Date(year, mon + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

  return (
    <div className={styles.calendar}>
      <div className={styles.calHeader}>
        <button className={styles.calNav} onClick={() => setMonth(new Date(year, mon - 1))}>‹</button>
        <span className={styles.calTitle}>{MONTHS[mon]} {year}</span>
        <button className={styles.calNav} onClick={() => setMonth(new Date(year, mon + 1))}>›</button>
      </div>
      <div className={styles.calGrid}>
        {DAYS.map(d => <span key={d} className={styles.calDayLabel}>{d}</span>)}
        {days.map((d, i) => (
          <button
            key={i}
            className={`${styles.calDay} ${!d ? styles.calEmpty : ''} ${d === value?.getDate() && value?.getMonth() === mon ? styles.calSelected : ''}`}
            onClick={() => d && onChange(new Date(year, mon, d))}
            disabled={!d}
          >{d}</button>
        ))}
      </div>
    </div>
  )
}

function DateField({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    function handler(e) { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  const fmt = (d) => d ? `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]} ${d.getDate()} ${d.getFullYear()}` : 'Pick date'
  return (
    <div ref={ref} className={styles.dropdown}>
      <button className={styles.chipBtn} onClick={() => setOpen(o => !o)}>{fmt(value)}</button>
      {open && (
        <div className={`${styles.dropMenu} ${styles.calDropMenu}`}>
          <MiniCalendar value={value} onChange={(d) => { onChange(d); setOpen(false) }} />
        </div>
      )}
    </div>
  )
}

export default function TaascCard() {
  const [priority, setPriority]   = useState('High')
  const [status, setStatus]       = useState('Queued')
  const [tags, setTags]           = useState(['Design'])
  const [project, setProject]     = useState('Taasc management')
  const [created, setCreated]     = useState(new Date(2025, 8, 2))
  const [completed, setCompleted] = useState(false)

  return (
    <div className={styles.card}>
      {/* Header row */}
      <div className={styles.cardHeader}>
        <div className={styles.radioCheck} onClick={() => setCompleted(c => !c)}>
          {completed
            ? <svg viewBox="0 0 14 14" fill="none" width="14" height="14"><circle cx="7" cy="7" r="6" stroke="#22C55E" strokeWidth="1.5"/><path d="M4.5 7L6.5 9L9.5 5.5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            : <svg viewBox="0 0 14 14" fill="none" width="14" height="14"><circle cx="7" cy="7" r="6" stroke="#d1d1d1" strokeWidth="1.5" strokeDasharray="2"/></svg>
          }
        </div>

        <Dropdown
          options={PRIORITIES}
          value={priority}
          onChange={setPriority}
          renderTrigger={(p) => (
            <span className={styles.priorityChip}>
              <span className={styles.priorityDot} style={{ background: PRIORITY_COLORS[p] }} />
              {p}
            </span>
          )}
          renderOption={(p) => (
            <span className={styles.priorityChip}>
              <span className={styles.priorityDot} style={{ background: PRIORITY_COLORS[p] }} />
              {p}
            </span>
          )}
        />

        <div className={styles.headerRight}>
          <button className={styles.iconBtn}>‹</button>
          <button className={styles.iconBtn}>›</button>
          <button className={styles.iconBtn}>···</button>
        </div>
      </div>

      {/* Title + description */}
      <div className={styles.body}>
        <h3 className={styles.title}>Refine Side Drawer on Wide Screens</h3>
        <p className={styles.desc}>Improve layout and spacing so task details feel balanced and usable on large monitors.</p>
      </div>

      {/* Metadata grid */}
      <div className={styles.meta}>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Status</span>
          <Dropdown
            options={STATUSES}
            value={status}
            onChange={setStatus}
            renderTrigger={(s) => (
              <span className={styles.statusChip}>
                <span className={styles.statusDot} style={{ background: STATUS_COLORS[s] }} />
                {s}
              </span>
            )}
            renderOption={(s) => (
              <span className={styles.statusChip}>
                <span className={styles.statusDot} style={{ background: STATUS_COLORS[s] }} />
                {s}
              </span>
            )}
          />
          <span className={styles.metaLabel}>Tags</span>
          <TagDropdown selected={tags} onChange={setTags} />
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Created</span>
          <DateField value={created} onChange={setCreated} />
          <span className={styles.metaLabel}>Project</span>
          <ProjectDropdown value={project} onChange={setProject} />
        </div>
      </div>
    </div>
  )
}
