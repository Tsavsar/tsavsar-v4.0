import { useEffect, useState } from 'react'
import styles from './AudioModal.module.css'

export default function AudioModal({ onDisable, onKeep }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`${styles.overlay} ${visible ? styles.overlayVisible : ''}`}>
      <div className={styles.modal}>
        <div className={styles.icon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18">
            <g fill="#171717">
              <path d="M11.35,1.567c-.4-.219-.889-.203-1.273,.044l-5.295,3.389H2.25c-1.241,0-2.25,1.009-2.25,2.25v3.5c0,1.241,1.009,2.25,2.25,2.25h2.531l5.295,3.389c.205,.131,.439,.198,.675,.198,.206,0,.412-.051,.599-.153,.401-.219,.65-.64,.65-1.097V2.664c0-.457-.249-.877-.65-1.097Z"/>
              <path d="M14.444,7.056c-.293-.293-.769-.293-1.061,0-.293,.293-.293,.768,0,1.061,.236,.236,.366,.55,.366,.884s-.13,.647-.366,.884c-.293,.292-.293,.768,0,1.061,.146,.146,.338,.22,.53,.22s.384-.073,.53-.22c.52-.519,.806-1.209,.806-1.944s-.286-1.425-.806-1.944Z"/>
              <path d="M15.329,5.111c-.293,.293-.293,.768,0,1.061,1.56,1.56,1.56,4.098,0,5.657-.293,.293-.293,.768,0,1.061,.146,.146,.338,.22,.53,.22s.384-.073,.53-.22c1.039-1.039,1.611-2.42,1.611-3.889s-.572-2.851-1.611-3.889c-.293-.293-.768-.293-1.061,0Z"/>
            </g>
          </svg>
        </div>
        <div className={styles.text}>
          <p className={styles.title}>Audio effects are on</p>
          <p className={styles.sub}>This site plays subtle click sounds. You can disable them now or toggle anytime.</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.btnDisable} onClick={onDisable}>Disable audio</button>
          <button className={styles.btnKeep} onClick={onKeep}>Keep on</button>
        </div>
      </div>
    </div>
  )
}
