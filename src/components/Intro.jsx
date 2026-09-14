import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import styles from './Intro.module.css'

const CG_LOGO = (
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
)

const LUOTAIN_LOGO = (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2.58964 2.9133L5.71476 1.08276C6.62526 0.54943 7.75112 0.542361 8.66824 1.06421L11.8161 2.85537C12.7332 3.37722 13.3023 4.34871 13.3089 5.40389L13.3316 9.02559C13.3383 10.0808 12.7815 11.0593 11.871 11.5927L8.74584 13.4232C8.47274 13.5832 8.18027 13.6958 7.87986 13.761C7.57315 13.8276 7.31234 13.5708 7.31037 13.2569L7.30299 12.0809C7.30108 11.7768 7.5506 11.5364 7.82769 11.4111C7.87241 11.3909 7.91632 11.3682 7.95922 11.3431L10.4413 9.88919C10.8749 9.63522 11.1401 9.16924 11.1369 8.66678L11.1189 5.79023C11.1157 5.28777 10.8447 4.82515 10.408 4.57665L7.9078 3.15402C7.47108 2.90552 6.93495 2.90889 6.50138 3.16285L4.01925 4.61677C3.58568 4.87073 3.32054 5.33671 3.32369 5.83918L3.32897 6.6799C3.33092 6.9906 3.08063 7.24405 2.76994 7.246L1.70268 7.2527C1.39198 7.25465 1.13853 7.00437 1.13658 6.69367L1.12896 5.48036C1.12234 4.42519 1.67915 3.44663 2.58964 2.9133Z" fill="#EBEBEB"/>
    <path d="M7.02962 13.2778C7.03154 13.5839 6.78272 13.8527 6.48681 13.7744C6.25261 13.7124 6.04534 13.5986 5.7589 13.4335L2.6209 11.6251C1.70665 11.0982 1.14293 10.1237 1.14209 9.06846L1.14229 8.09649C1.14235 7.78772 1.3961 7.53667 1.70486 7.53401L2.77211 7.52731C3.08309 7.52519 3.33613 7.77704 3.33548 8.08802L3.33422 8.69411C3.33462 9.19659 3.60306 9.66068 4.03842 9.91157L6.53078 11.3479C6.78516 11.4945 7.02022 11.7805 7.02206 12.0741L7.02962 13.2778Z" fill="#FA7319"/>
  </svg>
)

function Tooltip({ anchorRef, icon, name, url, desc }) {
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
      <div className={styles.tooltipIcon}>{icon}</div>
      <div className={styles.tooltipContent}>
        <div className={styles.tooltipRow}>
          <a className={styles.tooltipName} href={url} target="_blank" rel="noopener">
            {name}
          </a>
          <svg viewBox="0 0 12.45 9.25" fill="none"
            style={{ width:11, height:11, display:'block', transform:'scaleY(-1)', flexShrink:0 }}>
            <path d="M11.825 3.825H3.025C1.6994 3.825 0.625 4.8994 0.625 6.225V8.625"
              stroke="#9BA3B0" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.625 7.025L11.825 3.825L8.625 0.625"
              stroke="#9BA3B0" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className={styles.tooltipDesc}>{desc}</p>
      </div>
    </div>
  )

  return createPortal(card, document.body)
}

export default function Intro() {
  const cgRef = useRef(null)
  const luRef = useRef(null)

  return (
    <section className={styles.intro} id="about">
      <p className={styles.lead}>Shater Tsavsar, a design engineer.</p>
      <p className={styles.soft}>
        The best way to describe myself is a{' '}
        <span className={styles.medium}>"Systemic Native"</span>.
        {' '}Everything I do is grounded in some sort of system, and that shows up in the work whether I'm in Figma or in the codebase.
      </p>
      <p className={styles.soft}>
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
        {', where I own the product surface end to end: design direction, the design system, and the frontend code those designs become.'}
      </p>
      <p className={styles.soft}>
        On the side I built{' '}
        <span className={styles.badgeTrigger}>
          <a
            ref={luRef}
            className={styles.badge}
            href="https://luotain.app"
            target="_blank"
            rel="noopener"
          >
            <span className={styles.badgeLogoInline}>{LUOTAIN_LOGO}</span>
            <span className={styles.badgeText}>Luotain</span>
          </a>
        </span>
        {', a link and QR analytics product. Design, frontend, design system, all of it.'}
      </p>

      <Tooltip
        anchorRef={cgRef}
        icon={CG_LOGO}
        name="costgraph.ai"
        url="https://costgraph.ai"
        desc="AI-powered cloud cost analysis. Surface and understand spend across your infrastructure without the overhead."
      />
      <Tooltip
        anchorRef={luRef}
        icon={LUOTAIN_LOGO}
        name="luotain.app"
        url="https://luotain.app"
        desc="Link shortening and QR code analytics. Every code tracks its own scans, and stays editable after it's printed."
      />
    </section>
  )
}
