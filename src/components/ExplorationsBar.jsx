import { Link } from 'react-router-dom'
import Arrow from './Arrow'
import styles from './ExplorationsBar.module.css'

function CompassIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
      <path d="m12.2041,6.8105l-3.5,1.5c-.1768.0762-.3174.2168-.3936.394l-1.5,3.5c-.1211.2817-.0576.6089.1592.8257.1436.1436.335.2197.5303.2197.0996,0,.2002-.02.2959-.0605l3.5-1.5c.1768-.0762.3174-.2168.3936-.394l1.5-3.5c.1211-.2817.0576-.6089-.1592-.8257s-.542-.2788-.8262-.1592Z" fill="currentColor" strokeWidth="0"/>
    </svg>
  )
}

export default function ExplorationsBar() {
  return (
    <Link to="/explorations" className={styles.bar}>
      <span className={styles.iconWrap}><CompassIcon /></span>
      <span className={styles.label}>Design explorations</span>
      <span className={styles.arrow}><Arrow size={14} /></span>
    </Link>
  )
}
