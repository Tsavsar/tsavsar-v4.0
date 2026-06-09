import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { useScrollY } from '../hooks/useScrollY'
import styles from './ExplorationsPage.module.css'

const ITEMS = [
  // Videos
  { kind: 'video', src: '/assets/explorations/video-fundify.mov' },
  { kind: 'video', src: '/assets/explorations/video-main.mp4' },

  { kind: 'video', src: '/assets/explorations/video-copy2.mp4' },
  { kind: 'video', src: '/assets/explorations/video-1420.mp4' },
  { kind: 'video', src: '/assets/explorations/video-1260.mp4' },
  { kind: 'video', src: '/assets/explorations/video-1234.mp4' },
  { kind: 'video', src: '/assets/explorations/video-1046.mp4' },
  { kind: 'video', src: '/assets/explorations/video-1104.mp4' },
  { kind: 'video', src: '/assets/explorations/video-1280a.mp4' },
  { kind: 'video', src: '/assets/explorations/video-1280b.mp4' },
  { kind: 'video', src: '/assets/explorations/video-twitter.mp4' },
  { kind: 'video', src: '/assets/explorations/video-twitter2.mp4' },
  { kind: 'video', src: '/assets/explorations/video-rec1.mov' },
  { kind: 'video', src: '/assets/explorations/video-rec2.mov' },
  { kind: 'video', src: '/assets/explorations/video-rec3.mov' },
  { kind: 'video', src: '/assets/explorations/video-feb3.mov' },
  { kind: 'video', src: '/assets/explorations/video-jan31.mov' },
  // Images
  { kind: 'img', src: '/assets/explorations/lonar-dashboard.jpeg',  alt: 'Lönar dashboard' },
  { kind: 'img', src: '/assets/explorations/skaraa-audio.png',      alt: 'Skaraa audio' },
  { kind: 'img', src: '/assets/explorations/context-menus.jpeg',    alt: 'Context menus' },
  { kind: 'img', src: '/assets/explorations/settings-page.jpeg',    alt: 'Settings page' },
  { kind: 'img', src: '/assets/explorations/filter-chips.jpeg',     alt: 'Filter chips' },
  { kind: 'img', src: '/assets/explorations/finance-cards.jpeg',    alt: 'Finance cards' },
  { kind: 'img', src: '/assets/explorations/transaction-feed.jpeg', alt: 'Transaction feed' },
  { kind: 'img', src: '/assets/explorations/tanj-banner.jpeg',      alt: 'Tanj banner' },
  { kind: 'img', src: '/assets/explorations/task-pricing.jpeg',     alt: 'Task pricing' },
  { kind: 'img', src: '/assets/explorations/auth-flows.webp',       alt: 'Auth flows' },
  { kind: 'img', src: '/assets/explorations/pricing-page.jpeg',     alt: 'Pricing page' },
  { kind: 'img', src: '/assets/explorations/pricing-grows.png',     alt: 'Pricing grows' },
  { kind: 'img', src: '/assets/explorations/demo-audio.png',        alt: 'Demo audio' },
  { kind: 'img', src: '/assets/explorations/design-1.jpeg',         alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/design-2.jpeg',         alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/media-0.jpeg',          alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/media-1.jpeg',          alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/media-2.jpeg',          alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/media-3.jpeg',          alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/media-4.jpeg',          alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/media-5.jpeg',          alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/shater-1.jpeg',         alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/shater-2.jpeg',         alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/shater-3.jpeg',         alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/authstuff.webp',        alt: 'Auth stuff' },
  { kind: 'img', src: '/assets/explorations/screenshot-1.png',      alt: 'Screenshot' },
  { kind: 'img', src: '/assets/explorations/screenshot-2.png',      alt: 'Screenshot' },
  { kind: 'img', src: '/assets/explorations/design-extra.jpeg',     alt: 'Design' },
]

const ALL_LIGHTBOX = ITEMS.filter(i => i.kind === 'img')

export default function ExplorationsPage() {
  const scrollY = useScrollY()
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    document.title = 'Design Explorations — Shater Tsavsar'
    window.scrollTo(0, 0)
    return () => { document.title = 'Shater Tsavsar - Systemic Native' }
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight' && lightbox !== null) setLightbox(i => Math.min(i + 1, ALL_LIGHTBOX.length - 1))
      if (e.key === 'ArrowLeft'  && lightbox !== null) setLightbox(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  let lbIdx = 0

  return (
    <>
      {createPortal(
        <div className={`${styles.breadcrumb} ${scrollY > 10 ? styles.breadcrumbScrolled : ''}`}>
          <div className={styles.breadcrumbInner}>
            <Link to="/" className={styles.backPill}>
              <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <path d="M10 4L6 8L10 12" stroke="#6a6a6a" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Back</span>
            </Link>
            <div className={styles.crumbs}>
              <span className={styles.crumbMuted}>Home</span>
              <span className={styles.crumbMuted}>/</span>
              <span className={styles.crumbActive}>Design explorations</span>
            </div>
          </div>
        </div>,
        document.body
      )}

      {lightbox !== null && (
        <div className={styles.lightboxOverlay} onClick={() => setLightbox(null)}>
          <img
            src={ALL_LIGHTBOX[lightbox].src}
            alt={ALL_LIGHTBOX[lightbox].alt}
            className={styles.lightboxImg}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <div className={styles.page}>
        <div className={styles.grid}>
          {ITEMS.map((item, i) => {
            const idx = item.kind === 'img' ? lbIdx++ : null
            return (
              <div
                key={i}
                className={styles.cell}
                onClick={item.kind === 'img' ? () => setLightbox(idx) : undefined}
              >
                {item.kind === 'video' ? (
                  <video src={item.src} autoPlay muted loop playsInline />
                ) : (
                  <img src={item.src} alt={item.alt} loading="lazy" />
                )}
              </div>
            )
          })}
        </div>

        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    </>
  )
}
