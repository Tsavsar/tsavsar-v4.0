import { Link } from 'react-router-dom'
import Arrow from './Arrow'
import styles from './Explorations.module.css'

export default function Explorations() {
  return (
    <section className={styles.section}>
      <p className={styles.label}>my design explorations</p>

      <Link to="/explorations" className={styles.footer}>
        <p className={styles.footerLabel}>Design explorations</p>
        <span className={styles.arrow}><Arrow size={14} /></span>
      </Link>
      <p className={styles.footerDesc}>Take a look at some component designs, prototypes and concepts I've worked on.</p>
    </section>
  )
}
