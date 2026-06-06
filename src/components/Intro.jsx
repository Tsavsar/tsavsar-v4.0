import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import styles from './Intro.module.css'

function Tooltip({ anchorRef }) {
  const [visible, setVisible] = useState(false)
  const [pos, setPos]         = useState({ top: 0, left: 0 })
  const cardRef  = useRef(null)
  const hideTimer = useRef(null)

  const show = useCallback(() => {
    clearTimeout(hideTimer.current)
    if (!anchorRef.current) return
    setVisible(true)
    // Position after render so we have the card's real height
    requestAnimationFrame(() => {
      if (!anchorRef.current || !cardRef.current) return
      const a = anchorRef.current.getBoundingClientRect()
      const c = cardRef.current.getBoundingClientRect()
      const left = Math.min(a.left, window.innerWidth - c.width - 16)
      setPos({ top: a.top - c.height - 12, left })
    })
  }, [anchorRef])

  const hide = useCallback(() => {
    hideTimer.current = setTimeout(() => setVisible(false), 120)
  }, [])

  useEffect(() => {
    const el = anchorRef.current
    if (!el) return
    el.addEventListener('mouseenter', show)
    el.addEventListener('mouseleave', hide)
    return () => {
      el.removeEventListener('mouseenter', show)
      el.removeEventListener('mouseleave', hide)
    }
  }, [show, hide, anchorRef])

  const card = (
    <div
      ref={cardRef}
      className={`${styles.tooltip} ${visible ? styles.tooltipVisible : ''}`}
      style={{ top: pos.top, left: pos.left }}
      onMouseEnter={() => clearTimeout(hideTimer.current)}
      onMouseLeave={hide}
    >
      <div className={styles.tooltipIcon}>
        <svg viewBox="0 0 12 14" fill="none" width="18" height="18">
          <circle cx="3.224" cy="3.019" r="1" fill="#0F6DFF"/>
          <circle cx="3.224" cy="7" r="1" fill="#0F6DFF"/>
          <circle cx="3.224" cy="10.983" r="1" fill="#0F6DFF"/>
          <circle cx="8.714" cy="3.019" r="1" fill="#0F6DFF"/>
          <circle cx="8.714" cy="7" r="1" fill="#0F6DFF"/>
          <circle cx="8.714" cy="10.983" r="1" fill="#0F6DFF"/>
          <circle cx="1" cy="5.01" r="1" fill="#0F6DFF"/>
          <circle cx="1" cy="8.991" r="1" fill="#0F6DFF"/>
          <circle cx="6" cy="1.027" r="1" fill="#0F6DFF"/>
          <circle cx="6" cy="8.991" r="1" fill="#0F6DFF"/>
          <circle cx="6" cy="14" r="1" fill="#0F6DFF"/>
          <circle cx="11" cy="5.01" r="1" fill="#0F6DFF"/>
          <circle cx="11" cy="8.991" r="1" fill="#0F6DFF"/>
        </svg>
      </div>
      <div className={styles.tooltipContent}>
        <div className={styles.tooltipRow}>
          <a className={styles.tooltipName} href="https://costgraph.ai" target="_blank" rel="noopener">
            costgraph.ai
          </a>
          <svg viewBox="0 0 12.45 9.25" fill="none"
            style={{ width:11, height:11, display:'block', transform:'scaleY(-1)', flexShrink:0 }}>
            <path d="M11.825 3.825H3.025C1.6994 3.825 0.625 4.8994 0.625 6.225V8.625"
              stroke="#9BA3B0" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.625 7.025L11.825 3.825L8.625 0.625"
              stroke="#9BA3B0" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className={styles.tooltipDesc}>
          AI-powered cloud cost analysis. Surface and understand spend across your infrastructure without the overhead.
        </p>
      </div>
    </div>
  )

  return createPortal(card, document.body)
}

export default function Intro() {
  const cgRef = useRef(null)

  return (
    <section className={styles.intro} id="about">
      <p>Shater Tsavsar, a product designer.</p>
      <p>
        The best way to describe myself is a{' '}
        <span className={styles.medium}>"Systemic Native"</span>.
        {' '}Everything I do is grounded in some sort of system and that is largely reflected in the work I put out.
      </p>
      <p className={styles.workText}>
        I'm currently designing{' '}
        <span className={styles.badgeTrigger}>
          <a
            ref={cgRef}
            className={styles.badge}
            id="cgLink"
            href="https://costgraph.ai"
            target="_blank"
            rel="noopener"
          >
            <span className={styles.badgeLogo}>
              <img src="/assets/cg-badge-logo.svg" alt="" />
            </span>
            <span className={styles.badgeText}>CostGraph.ai</span>
          </a>
        </span>
        {', where most of my work has been designing around GraphAI, a cost analysis tool, figuring out how to surface it naturally across the product without it feeling bolted on or overwhelming.'}
      </p>

      <Tooltip anchorRef={cgRef} />
    </section>
  )
}
