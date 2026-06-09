import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { useScrollY } from '../hooks/useScrollY'
import styles from './ExplorationsPage.module.css'

export default function ExplorationsPage() {
  const scrollY = useScrollY()

  useEffect(() => {
    document.title = 'Design Explorations — Shater Tsavsar'
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
            <p className={styles.label}>design explorations</p>
            <h1 className={styles.title}>Component designs, prototypes and concepts.</h1>
          </header>

          <div className={styles.empty}>
            <p>More coming soon.</p>
          </div>

          <Footer />
        </div>
      </div>
    </>
  )
}
