import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useRecentlyPlayed } from '../hooks/useRecentlyPlayed'
import styles from './VinylOverlay.module.css'

const ARROW = (
  <svg width="12" height="12" viewBox="0 0 11.05 8.25" fill="none">
    <path d="M10.425 3.425H2.725C1.5651 3.425 0.625 4.3651 0.625 5.525V7.625" stroke="#171717" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.625 6.225L10.425 3.425L7.625 0.625" stroke="#171717" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 60000)
  if (diff < 1)  return 'just now'
  if (diff < 60) return `${diff}m ago`
  const h = Math.floor(diff / 60)
  if (h < 24)    return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function Overlay({ open, onClose, spotify }) {
  const recent = useRecentlyPlayed()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  const link = spotify.songUrl ||
    `https://open.spotify.com/search/${encodeURIComponent(`${spotify.title} ${spotify.artist}`)}`

  return (
    <div
      className={`${styles.overlay} ${open ? styles.open : ''}`}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <button className={styles.close} onClick={onClose} aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Vinyl + current track */}
      <div className={`${styles.vinylWrap} ${open ? styles.vinylWrapOpen : ''}`}>
        <div className={styles.vinyl}>
          <img className={styles.art} src={spotify.albumArt} alt="" />
          <span className={styles.hole} />
        </div>
      </div>

      <div className={styles.details}>
        <span className={styles.status}>{spotify.isPlaying ? 'NOW PLAYING' : 'LAST PLAYED'}</span>
        <span className={styles.title}>{spotify.title || '—'}</span>
        <span className={styles.artist}>{spotify.artist || '—'}</span>
        <a className={styles.link} href={link} target="_blank" rel="noopener">
          Open in Spotify {ARROW}
        </a>
      </div>

      {/* Recently played */}
      {recent.length > 0 && (
        <div className={styles.recentSection}>
          <p className={styles.recentLabel}>Recently played</p>
          <div className={styles.recentList}>
            {recent.map((t, i) => (
              <a
                key={i}
                href={t.songUrl}
                target="_blank"
                rel="noopener"
                className={styles.recentItem}
              >
                <img src={t.albumArt} alt="" className={styles.recentArt} />
                <div className={styles.recentInfo}>
                  <span className={styles.recentTitle}>{t.title}</span>
                  <span className={styles.recentArtist}>{t.artist}</span>
                </div>
                <span className={styles.recentTime}>{timeAgo(t.playedAt)}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function VinylOverlay(props) {
  return createPortal(<Overlay {...props} />, document.body)
}
