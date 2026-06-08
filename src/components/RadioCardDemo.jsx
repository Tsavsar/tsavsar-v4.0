import { useState } from 'react'
import styles from './RadioCardDemo.module.css'

const GITLAB_ICON = 'https://www.figma.com/api/mcp/asset/1850f1de-4b9a-4ec3-bf4a-95fd90e81f9d'

function Radio({ selected }) {
  return (
    <div className={`${styles.radio} ${selected ? styles.radioSelected : ''}`}>
      {selected && (
        <div className={styles.radioInner}>
          <div className={styles.radioDot} />
        </div>
      )}
    </div>
  )
}

function Divider() {
  return <div className={styles.divider} />
}

export default function RadioCardDemo() {
  const [plan, setPlan] = useState('premium')
  const [autoRenew, setAutoRenew] = useState(true)

  return (
    <div className={styles.root}>
      <div className={styles.card}>

        {/* Header row */}
        <div className={styles.listItem}>
          <div className={styles.listItemMain}>
            <div className={styles.listItemText}>
              <span className={styles.listItemTitle}>Upgrade plan</span>
              <span className={styles.listItemSub}>Get more out of your time for less.</span>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, opacity: 0.35 }}>
            <path d="M7 4l5 5-5 5" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <Divider />

        {/* Radio cards */}
        <div className={styles.radioGroup}>
          {/* Premium plan */}
          <button
            className={`${styles.radioCard} ${plan === 'premium' ? styles.radioCardSelected : ''}`}
            onClick={() => setPlan('premium')}
          >
            <div className={styles.radioCardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#FC6D26"/>
                <path d="M12 5.5l1.545 4.755H18.5l-4.045 2.94 1.545 4.755L12 14.96l-4 2.99 1.545-4.755L5.5 10.255H10.455L12 5.5z" fill="white"/>
              </svg>
            </div>
            <div className={styles.radioCardBody}>
              <div className={styles.radioCardTitleRow}>
                <span className={styles.radioCardTitle}>Premium plan</span>
                <span className={styles.badge}>Popular</span>
              </div>
              <span className={styles.radioCardSub}>$10/m with all the services included.</span>
            </div>
            <Radio selected={plan === 'premium'} />
          </button>

          {/* Student plan */}
          <button
            className={`${styles.radioCard} ${plan === 'student' ? styles.radioCardSelected : ''}`}
            onClick={() => setPlan('student')}
          >
            <div className={styles.radioCardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#FC6D26"/>
                <path d="M12 5.5l1.545 4.755H18.5l-4.045 2.94 1.545 4.755L12 14.96l-4 2.99 1.545-4.755L5.5 10.255H10.455L12 5.5z" fill="white"/>
              </svg>
            </div>
            <div className={styles.radioCardBody}>
              <div className={styles.radioCardTitleRow}>
                <span className={styles.radioCardTitle}>Student plan</span>
              </div>
              <span className={styles.radioCardSub}>$5/m with all the services included.</span>
            </div>
            <Radio selected={plan === 'student'} />
          </button>
        </div>

        <Divider />

        {/* Action rows */}
        <div className={styles.actionGroup}>
          {/* Auto-renew */}
          <div className={styles.listItem}>
            <div className={styles.listItemMain}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                <path d="M3 9a6 6 0 0110.5-4M15 9a6 6 0 01-10.5 4M3 5v4h4M15 13v-4h-4" stroke="#171717" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={styles.listItemTitle}>Auto-renew plan</span>
            </div>
            <button
              className={`${styles.toggle} ${autoRenew ? styles.toggleOn : ''}`}
              onClick={() => setAutoRenew(v => !v)}
              aria-label="Toggle auto-renew"
            />
          </div>
        </div>

      </div>
    </div>
  )
}
