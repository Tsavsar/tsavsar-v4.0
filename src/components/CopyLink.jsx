import { useState, useRef, useEffect } from 'react'
import styles from './CopyLink.module.css'

const LINK = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ display: 'block' }}>
    <path d="M8.36909 6.8934C8.06649 7.0539 7.78239 7.2617 7.52799 7.517L7.51799 7.527C6.13699 8.908 6.13699 11.146 7.51799 12.527L9.69299 14.702C11.074 16.083 13.312 16.083 14.693 14.702L14.703 14.692C16.084 13.311 16.084 11.073 14.703 9.692L13.9406 8.9296" stroke="#6a6a6a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9.63289 11.1066C9.93549 10.9461 10.2196 10.7383 10.474 10.483L10.484 10.473C11.865 9.09199 11.865 6.85399 10.484 5.47299L8.30899 3.29799C6.92799 1.91699 4.68999 1.91699 3.30899 3.29799L3.29899 3.30799C1.91799 4.68899 1.91799 6.92699 3.29899 8.30799L4.06139 9.07039" stroke="#6a6a6a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CHECK = (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ display: 'block' }}>
    <path d="M4 9.5L7.4 12.9L14 5.6" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function CopyLink({ label = 'Link copied' }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={handleCopy} className={styles.btn} aria-label="Copy link">
      <span className={styles.spacer} aria-hidden="true">
        <span style={{ width: 16, height: 16 }} /><span>{label}</span>
      </span>
      <span className={styles.row}>
        <span className="t-icon-swap" data-state={copied ? 'b' : 'a'}>
          <span className="t-icon" data-icon="a">{LINK}</span>
          <span className="t-icon" data-icon="b">{CHECK}</span>
        </span>
        <span className={styles.label} data-visible={copied}>{label}</span>
      </span>
    </button>
  )
}
