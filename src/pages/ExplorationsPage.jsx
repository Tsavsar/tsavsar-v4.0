import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { useScrollY } from '../hooks/useScrollY'
import styles from './ExplorationsPage.module.css'

const SHOTS = [
  { src: '/assets/explorations/lonar-dashboard.jpeg',  alt: 'Lönar — login and dashboard overview' },
  { src: '/assets/explorations/context-menus.jpeg',    alt: 'Context menu component variants' },
  { src: '/assets/explorations/skaraa-audio.png',      alt: 'Skaraa — audio stem splitter' },
  { src: '/assets/explorations/settings-page.jpeg',    alt: 'Settings page — desktop and mobile' },
  { src: '/assets/explorations/lonar-invoice.jpeg',    alt: 'Lönar — invoice send flow' },
  { src: '/assets/explorations/filter-chips.jpeg',     alt: 'Filter chip and badge components' },
  { src: '/assets/explorations/finance-cards.jpeg',    alt: 'Finance category cards' },
  { src: '/assets/explorations/transaction-feed.jpeg', alt: 'Transaction activity feed' },
  { src: '/assets/explorations/tanj-banner.jpeg',      alt: 'Tanj — CTA banner (desktop and mobile)' },
  { src: '/assets/explorations/task-pricing.jpeg',     alt: 'Task categories and pricing plans' },
  { src: '/assets/explorations/auth-flows.webp',       alt: 'Auth flows — login, verify, create account' },
  { src: '/assets/explorations/otp-input.jpeg',        alt: 'OTP / PIN input states' },
  { src: '/assets/explorations/pricing-page.jpeg',     alt: 'Pricing page layout' },
  { src: '/assets/explorations/pricing-grows.png',     alt: 'Pricing — grows with you' },
]

export default function ExplorationsPage() {
  const scrollY = useScrollY()

  useEffect(() => {
    document.title = 'My Design Explorations — Shater Tsavsar'
    window.scrollTo(0, 0)
    return () => { document.title = 'Shater Tsavsar - Systemic Native' }
  }, [])

  return (
    <>
      {createPortal(
        <div className={`${styles.breadcrumb} ${scrollY > 10 ? styles.breadcrumbScrolled : ''}`}>
          <div className={styles.breadcrumbInner}>
            <Link to="/" className={styles.backPill}>
              <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <path d="M10 4L6 8L10 12" stroke="#5c5c5c" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Back</span>
            </Link>
            <div className={styles.crumbs}>
              <span className={styles.crumbMuted}>Home</span>
              <span className={styles.crumbMuted}>/</span>
              <span className={styles.crumbActive}>Design explorations</span>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className={styles.page}>
        <div className={styles.content}>
          <header className={styles.header}>
            <p className={styles.label}>my design explorations</p>
            <h1 className={styles.title}>Component designs, prototypes and concepts.</h1>
            <p className={styles.sub}>Take a look at some of the things I've worked on outside of full projects — UI components, interaction explorations and concept screens.</p>
          </header>

          <div className={styles.grid}>
            {SHOTS.map((shot, i) => (
              <div key={i} className={styles.shot}>
                <img src={shot.src} alt={shot.alt} loading="lazy" />
              </div>
            ))}
          </div>

          <Footer />
        </div>
      </div>
    </>
  )
}
