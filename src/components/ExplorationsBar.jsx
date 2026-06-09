import { Link } from 'react-router-dom'
import Arrow from './Arrow'
import styles from './ExplorationsBar.module.css'

export default function ExplorationsBar() {
  return (
    <Link to="/explorations" className={styles.bar}>
      <img src="/assets/icon-explorations.png" alt="" className={styles.icon} />
      <span className={styles.label}>Design explorations</span>
      <span className={styles.arrow}><Arrow size={14} /></span>
    </Link>
  )
}
