import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import styles from './Gallery.module.css'

const PHOTOS = [
  '/assets/photo1.jpg',
  '/assets/photo2.jpg',
  '/assets/photo3.jpg',
  '/assets/photo4.jpg',
  '/assets/IMG_4893.jpg',
  '/assets/_DSC0069-3 2.JPG',
  '/assets/1 2.PNG',
]

function Lightbox({ index: initial, onClose }) {
  const [index, setIndex] = useState(initial)

  const prev = useCallback(() => setIndex(i => (i - 1 + PHOTOS.length) % PHOTOS.length), [])
  const next = useCallback(() => setIndex(i => (i + 1) % PHOTOS.length), [])

  useEffect(() => {
    const fn = e => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
    }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose, next, prev])

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.overlayInner} onClick={e => e.stopPropagation()}>
        <button className={styles.overlayClose} onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={prev} aria-label="Previous">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <img
          key={index}
          src={PHOTOS[index]}
          alt=""
          className={styles.overlayImg}
        />

        <button className={`${styles.navBtn} ${styles.navNext}`} onClick={next} aria-label="Next">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className={styles.overlayDots}>
          {PHOTOS.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default function Gallery({ open }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [lightbox, setLightbox]         = useState(null)

  useEffect(() => {
    if (!open) { setVisibleCount(0); return }
    let i = 0
    const tick = () => { i++; setVisibleCount(i); if (i < PHOTOS.length) setTimeout(tick, 80) }
    setTimeout(tick, 60)
  }, [open])

  return (
    <>
      <div className={`${styles.gallery} ${open ? styles.open : ''}`}>
        <div className={styles.track}>
          {PHOTOS.map((src, i) => (
            <div
              key={i}
              className={`${styles.card} ${i < visibleCount ? styles.cardIn : ''}`}
              onClick={() => setLightbox(i)}
            >
              <img src={src} alt="" className={styles.img} />
            </div>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox index={lightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  )
}
