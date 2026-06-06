import TaascCard from './TaascCard'
import Arrow from './Arrow'
import styles from './Explorations.module.css'

export default function Explorations() {
  return (
    <section className={styles.section}>
      <p className={styles.label}>my explorations</p>

      <div className={styles.showcase}>
        <p className={styles.hint}>You can interact with the components</p>
        <div className={styles.cardWrap}>
          <TaascCard />
        </div>
        <p className={styles.caption}>Task management card</p>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerLabel}>Design explorations</p>
        <Arrow size={14} />
      </div>
      <p className={styles.footerDesc}>Take a look at some component designs, prototypes and concepts I've worked on.</p>
    </section>
  )
}
