import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
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

/* Project marks — viewBox only, sized by .rowMark.
   `scale` optically balances the three different aspect ratios in a 16px box. */
const LUOTAIN_MARK = (
  <svg viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3.35296 5.11555L10.5263 0.926792C12.6163 -0.293593 15.2006 -0.309768 17.3057 0.88436L24.5313 4.98299C26.6365 6.17712 27.9426 8.40014 27.9579 10.8147L28.01 19.102C28.0253 21.5166 26.7472 23.7558 24.6572 24.9761L17.4838 29.1649C16.857 29.5309 16.1856 29.7887 15.4961 29.9379C14.7921 30.0902 14.1934 29.5025 14.1889 28.7844L14.1719 26.0934C14.1676 25.3976 14.7403 24.8475 15.3763 24.5608C15.479 24.5145 15.5798 24.4626 15.6782 24.4051L21.3757 21.0782C22.3709 20.497 22.9795 19.4308 22.9723 18.281L22.9308 11.6987C22.9236 10.5489 22.3016 9.49036 21.2991 8.92173L15.5602 5.66638C14.5578 5.09775 13.3272 5.10545 12.3319 5.68659L6.63448 9.01352C5.63927 9.59465 5.03065 10.6609 5.03789 11.8107L5.05001 13.7345C5.05449 14.4455 4.47998 15.0254 3.7668 15.0299L1.31704 15.0452C0.603866 15.0497 0.0220975 14.477 0.0176198 13.766L0.000134205 10.9896C-0.0150728 8.57513 1.26302 6.33594 3.35296 5.11555Z" fill="#0F0F0F"/>
    <path d="M13.5444 28.8322C13.5489 29.5326 12.9777 30.1478 12.2985 29.9686C11.7609 29.8268 11.2851 29.5662 10.6277 29.1884L3.42471 25.0504C1.32615 23.8448 0.0321905 21.6147 0.0302518 19.2001L0.0307183 16.976C0.0308657 16.2695 0.613318 15.695 1.32203 15.6889L3.7718 15.6736C4.48561 15.6687 5.06644 16.245 5.06496 16.9566L5.06206 18.3435C5.06298 19.4933 5.67915 20.5553 6.67847 21.1294L12.3994 24.416C12.9833 24.7515 13.5229 25.4061 13.5271 26.0779L13.5444 28.8322Z" fill="#FD6701"/>
  </svg>
)

const YOTE_MARK = (
  <svg viewBox="0 0 25 19" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M24.0356 10.8833L15.5507 7.82976L15.5451 7.82821C15.0001 7.63366 14.4092 7.76571 14.0008 8.16944C13.5921 8.5728 13.4622 9.15561 13.6618 9.68817L16.7616 18.0496C16.9751 18.6213 17.5275 19 18.1428 19H18.1749C18.8028 18.9862 19.3538 18.5814 19.5435 17.9926L20.3947 15.3738C20.5355 14.9407 20.88 14.6013 21.3196 14.4626L23.9742 13.6251C24.5755 13.4375 24.9871 12.8948 24.9996 12.2736C25.0136 11.6538 24.6244 11.0943 24.0356 10.8833Z" fill="black"/>
    <path d="M12.4119 11.2075C12.3785 11.1472 12.3491 11.0847 12.3268 11.0196C11.8882 9.73847 12.2165 8.35105 13.1974 7.38271C13.881 6.70645 14.5868 6.51476 15.5494 6.51476C15.9554 6.51476 16.3571 6.58147 16.7422 6.71405C16.7509 6.71694 18.8446 7.6064 20.9494 8.42844C21.8718 8.78869 22.8568 8.11335 22.8569 7.13584L22.8571 3.87037C22.8571 1.7359 21.0951 0 18.9285 0H3.92856C1.76199 0 0 1.7359 0 3.87037V10.2037C0 12.3382 1.76199 14.0741 3.92856 14.0741H11.593C12.6777 14.0741 13.3666 12.93 12.8468 11.9921L12.4119 11.2075ZM7.14268 7.03704C7.14268 7.81432 6.50309 8.44444 5.7141 8.44444C4.92513 8.44444 4.28553 7.81432 4.28553 7.03704C4.28553 6.25975 4.92513 5.62963 5.7141 5.62963C6.50309 5.62963 7.14268 6.25975 7.14268 7.03704ZM12.1427 7.03704C12.1427 7.81432 11.5031 8.44444 10.7141 8.44444C9.92513 8.44444 9.28553 7.81432 9.28553 7.03704C9.28553 6.25975 9.92513 5.62963 10.7141 5.62963C11.5031 5.62963 12.1427 6.25975 12.1427 7.03704Z" fill="black"/>
  </svg>
)

const KERNUI_MARK = (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M17.5148 4.71226C18.53 4.71226 19.3529 5.61062 19.3529 6.71879V16.0832C19.3529 17.8748 19.7046 18.6319 20.4079 19.6922C21.1447 20.716 22.317 21.2279 23.9246 21.2279C25.5323 21.2279 26.7213 20.716 27.4916 19.6922C28.262 18.6319 28.6471 17.8748 28.6471 16.0832V6.71879C28.6471 5.61062 29.47 4.71226 30.4852 4.71226L37.912 2.25C38.9271 2.25 39.75 3.14835 39.75 4.25653V16.0832C39.75 19.7761 39.0467 22.2699 37.64 24.9025C36.2333 27.4985 34.3074 29.4546 31.8624 30.7709C29.4175 32.0872 26.6878 32.7453 23.6734 32.7453C20.6591 32.7453 17.9797 32.0872 15.6352 30.7709C13.3242 29.4546 11.5155 27.4985 10.2093 24.9025C8.90311 22.3065 8.25 19.8126 8.25 16.0832V4.25653C8.25 3.14835 9.07291 2.25 10.088 2.25L17.5148 4.71226Z" fill="#1E1E1E"/>
    <path d="M18.4561 35.0974L16.1694 34.2371C15.8604 34.1208 15.5359 34.0615 15.2091 34.0615C12.2224 34.0615 11.1303 38.3534 13.6891 40.0351L21.1106 44.9127C22.7959 46.0203 24.902 46.0297 26.5955 44.937L34.3138 39.9573C36.8565 38.3168 35.7908 34.0615 32.8371 34.0615C32.514 34.0615 32.1932 34.1204 31.8878 34.2358L29.6294 35.0892C26.0107 36.4566 22.0765 36.4595 18.4561 35.0974Z" fill="#CA0016"/>
  </svg>
)

const PROJECTS = [
  {
    name: 'Luotain',
    desc: 'Link and QR analytics, designed and shipped solo.',
    mark: LUOTAIN_MARK,
    scale: 0.88,
    to: '/work/luotain',
  },
  {
    name: 'Yote',
    desc: 'An opinionated input component library for React.',
    mark: YOTE_MARK,
    scale: 0.96,
    href: 'https://yote.shatermt.com/',
  },
  {
    name: 'KernUI',
    desc: 'A design system used by 1,200+ designers and developers.',
    mark: KERNUI_MARK,
    scale: 1.08,
    href: 'https://kernui.framer.website/',
  },
]

function ProjectRow({ name, desc, mark, scale, to, href }) {
  const body = (
    <>
      <span className={styles.rowMark} style={{ '--mark-scale': scale }}>{mark}</span>
      <span className={styles.rowText}>
        <span className={styles.rowName}>{name}.</span>{' '}{desc}
      </span>
    </>
  )

  const className = `${styles.row} ${styles.rowLink}`

  if (to)   return <li><Link to={to} className={className}>{body}</Link></li>
  if (href) return (
    <li>
      <a className={className} href={href} target="_blank" rel="noopener">{body}</a>
    </li>
  )
  return <li><div className={styles.row}>{body}</div></li>
}

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

  return (
    <section className={styles.intro} id="about">
      <p className={styles.lead}>Shater Tsavsar, a designer.</p>
      <p className={styles.soft}>
        The best way to describe myself is a{' '}
        <span className={styles.medium}>"Systemic Native"</span>.
        {' '}Everything I do is grounded in some sort of system, and that shows up in the work whether I'm in Figma or in the codebase.
      </p>
      <p className={styles.soft}>
        I design and build{' '}
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
        {'. The design direction, the design system, and the frontend code those designs become.'}
      </p>

      <div className={styles.projects}>
        <p className={styles.projectsLabel}>projects</p>
        <ul className={styles.projectsList}>
          {PROJECTS.map(p => <ProjectRow key={p.name} {...p} />)}
        </ul>
      </div>

      <Tooltip
        anchorRef={cgRef}
        icon={CG_LOGO}
        name="costgraph.ai"
        url="https://costgraph.ai"
        desc="AI-powered cloud cost analysis. Surface and understand spend across your infrastructure without the overhead."
      />
    </section>
  )
}
