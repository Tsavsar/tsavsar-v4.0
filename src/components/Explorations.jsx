import { Link } from 'react-router-dom'
import Arrow from './Arrow'
import styles from './Explorations.module.css'

const SITES = [
  { label: 'Tanj', href: 'https://tanj.framer.website/' },
  { label: 'Clearline', href: 'https://clearline.framer.website/' },
]

export default function Explorations() {
  return (
    <section className={styles.section}>
      <p className={styles.label}>my design explorations</p>

      <Link to="/explorations" className={styles.footer}>
        <p className={styles.footerLabel}>Design explorations</p>
        <span className={styles.arrow}><Arrow size={14} /></span>
      </Link>
      <p className={styles.footerDesc}>Take a look at some component designs, prototypes and concepts I've worked on.</p>

      <div className={styles.sites}>
        {SITES.map(s => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.siteTab}
          >
            {s.label}
            <svg viewBox="0 0 12 12" fill="none" width="11" height="11" className={styles.extIcon}>
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H5M9.5 2.5V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        ))}
      </div>
    </section>
  )
}
