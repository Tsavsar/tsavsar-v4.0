import { useState } from 'react'
import { useSpotify } from '../hooks/useSpotify'
import VinylOverlay from './VinylOverlay'
import styles from './Footer.module.css'

export default function Footer() {
  const spotify = useSpotify()
  const [open, setOpen] = useState(false)

  return (
    <>
      <footer className={styles.footer}>
        <div
          className={styles.tag}
          role="button"
          tabIndex={0}
          onClick={() => setOpen(true)}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setOpen(true)}
        >
          {/* Vinyl record */}
          <span className={`${styles.vinyl} ${spotify.isPlaying ? styles.spinning : ''}`}>
            <img className={styles.vinylArt} src={spotify.albumArt} alt="" />
            <span className={styles.vinylHole} />
          </span>
          {/* Text */}
          <span className={styles.lines}>
            <span className={styles.text}>
              {spotify.isPlaying ? 'Now playing' : 'Last played'}
            </span>
            <span className={styles.text}>
              <strong>{spotify.title}</strong>{' by '}<strong>{spotify.artist}</strong>
            </span>
          </span>
        </div>

        <div className={styles.bar}>
          <p>© 2026 Shater M. Tsavsar</p>
          <p>design closer to the user.</p>
        </div>
      </footer>

      <VinylOverlay open={open} onClose={() => setOpen(false)} spotify={spotify} />
    </>
  )
}
