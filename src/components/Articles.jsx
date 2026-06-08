import { Link } from 'react-router-dom'
import styles from './Articles.module.css'

const ARROW = (
  <svg viewBox="0 0 11.05 8.25" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:14, height:14, flexShrink:0 }}>
    <path d="M10.425 3.425H2.725C1.5651 3.425 0.625 4.3651 0.625 5.525V7.625" stroke="#5C5C5C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.625 6.225L10.425 3.425L7.625 0.625" stroke="#5C5C5C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function Articles() {
  return (
    <section className={styles.section}>
      <p className={styles.label}>my articles</p>
      <div className={styles.list}>
        <Link className={styles.item} to="/articles/vicariously">
          <div className={styles.thumb}>
            <img src="https://www.figma.com/api/mcp/asset/b50054ec-659f-47c0-a81b-02200d94ccc5" alt="Article thumbnail" />
          </div>
          <div className={styles.body}>
            <div className={styles.titleRow}>
              <span className={styles.title}>Vicariously living through the main character</span>
              {ARROW}
            </div>
            <p className={styles.excerpt}>Why we emotionally attach ourselves to movie characters and the lives they live.</p>
            <div className={styles.meta}>
              <span>5 min</span>
              <span className={styles.dot} />
              <span>2026</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
