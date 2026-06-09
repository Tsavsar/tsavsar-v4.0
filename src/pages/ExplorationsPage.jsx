import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { useScrollY } from '../hooks/useScrollY'
import styles from './ExplorationsPage.module.css'

// Each item can be type 'img' or 'video'
// Rows alternate: full-width, two-col split
const ROWS = [
  // ── Videos first ──
  { type: 'full',  items: [{ kind: 'video', src: '/assets/explorations/video-main.mp4' }] },
  { type: 'split', items: [
    { kind: 'video', src: '/assets/explorations/video-copy.mp4',  flex: 50 },
    { kind: 'video', src: '/assets/explorations/video-copy2.mp4', flex: 50 },
  ]},
  { type: 'full',  items: [{ kind: 'video', src: '/assets/explorations/video-1420.mp4' }] },
  { type: 'split', items: [
    { kind: 'video', src: '/assets/explorations/video-1260.mp4', flex: 48 },
    { kind: 'video', src: '/assets/explorations/video-1234.mp4', flex: 52 },
  ]},
  { type: 'full',  items: [{ kind: 'video', src: '/assets/explorations/video-1046.mp4' }] },
  { type: 'split', items: [
    { kind: 'video', src: '/assets/explorations/video-1104.mp4',  flex: 50 },
    { kind: 'video', src: '/assets/explorations/video-1280a.mp4', flex: 50 },
  ]},
  { type: 'full',  items: [{ kind: 'video', src: '/assets/explorations/video-1280b.mp4' }] },
  { type: 'split', items: [
    { kind: 'video', src: '/assets/explorations/video-twitter.mp4',  flex: 50 },
    { kind: 'video', src: '/assets/explorations/video-twitter2.mp4', flex: 50 },
  ]},
  { type: 'full',  items: [{ kind: 'video', src: '/assets/explorations/video-fundify.mov' }] },
  { type: 'split', items: [
    { kind: 'video', src: '/assets/explorations/video-rec1.mov', flex: 50 },
    { kind: 'video', src: '/assets/explorations/video-rec2.mov', flex: 50 },
  ]},
  { type: 'full',  items: [{ kind: 'video', src: '/assets/explorations/video-rec3.mov' }] },
  { type: 'split', items: [
    { kind: 'video', src: '/assets/explorations/video-feb3.mov',  flex: 50 },
    { kind: 'video', src: '/assets/explorations/video-jan31.mov', flex: 50 },
  ]},

  // ── Original design shots ──
  { type: 'full',  items: [{ kind: 'img', src: '/assets/explorations/lonar-dashboard.jpeg', alt: 'Lönar dashboard' }] },
  { type: 'split', items: [
    { kind: 'img', src: '/assets/explorations/skaraa-audio.png',   alt: 'Skaraa audio', flex: 46 },
    { kind: 'img', src: '/assets/explorations/context-menus.jpeg', alt: 'Context menus', flex: 54 },
  ]},
  { type: 'full',  items: [{ kind: 'img', src: '/assets/explorations/settings-page.jpeg', alt: 'Settings page' }] },
  { type: 'split', items: [
    { kind: 'img', src: '/assets/explorations/lonar-invoice.jpeg', alt: 'Lönar invoice', flex: 54 },
    { kind: 'img', src: '/assets/explorations/filter-chips.jpeg',  alt: 'Filter chips',  flex: 46 },
  ]},
  { type: 'full',  items: [{ kind: 'img', src: '/assets/explorations/finance-cards.jpeg', alt: 'Finance cards' }] },
  { type: 'split', items: [
    { kind: 'img', src: '/assets/explorations/transaction-feed.jpeg', alt: 'Transaction feed', flex: 46 },
    { kind: 'img', src: '/assets/explorations/tanj-banner.jpeg',      alt: 'Tanj banner',      flex: 54 },
  ]},
  { type: 'full',  items: [{ kind: 'img', src: '/assets/explorations/task-pricing.jpeg', alt: 'Task pricing' }] },
  { type: 'split', items: [
    { kind: 'img', src: '/assets/explorations/auth-flows.webp', alt: 'Auth flows',  flex: 52 },
    { kind: 'img', src: '/assets/explorations/otp-input.jpeg',  alt: 'OTP input',   flex: 48 },
  ]},
  { type: 'full',  items: [{ kind: 'img', src: '/assets/explorations/pricing-page.jpeg', alt: 'Pricing page' }] },
  { type: 'full',  items: [{ kind: 'img', src: '/assets/explorations/pricing-grows.png', alt: 'Pricing grows' }] },

  // ── Additional design shots from Design Shots folder ──
  { type: 'full',  items: [{ kind: 'img', src: '/assets/explorations/demo-audio.png', alt: 'Demo audio' }] },
  { type: 'split', items: [
    { kind: 'img', src: '/assets/explorations/design-1.jpeg', alt: 'Design shot', flex: 50 },
    { kind: 'img', src: '/assets/explorations/design-2.jpeg', alt: 'Design shot', flex: 50 },
  ]},
  { type: 'full',  items: [{ kind: 'img', src: '/assets/explorations/media-0.jpeg', alt: 'Media post' }] },
  { type: 'split', items: [
    { kind: 'img', src: '/assets/explorations/media-1.jpeg', alt: 'Media post', flex: 50 },
    { kind: 'img', src: '/assets/explorations/media-2.jpeg', alt: 'Media post', flex: 50 },
  ]},
  { type: 'split', items: [
    { kind: 'img', src: '/assets/explorations/media-3.jpeg', alt: 'Media post', flex: 50 },
    { kind: 'img', src: '/assets/explorations/media-4.jpeg', alt: 'Media post', flex: 50 },
  ]},
  { type: 'full',  items: [{ kind: 'img', src: '/assets/explorations/media-5.jpeg', alt: 'Media post' }] },
  { type: 'split', items: [
    { kind: 'img', src: '/assets/explorations/shater-1.jpeg', alt: 'Design', flex: 50 },
    { kind: 'img', src: '/assets/explorations/shater-2.jpeg', alt: 'Design', flex: 50 },
  ]},
  { type: 'full',  items: [{ kind: 'img', src: '/assets/explorations/shater-3.jpeg', alt: 'Design' }] },
  { type: 'split', items: [
    { kind: 'img', src: '/assets/explorations/authstuff.webp',     alt: 'Auth stuff',    flex: 54 },
    { kind: 'img', src: '/assets/explorations/project-image.png',  alt: 'Project image', flex: 46 },
  ]},
  { type: 'split', items: [
    { kind: 'img', src: '/assets/explorations/screenshot-1.png', alt: 'Screenshot', flex: 50 },
    { kind: 'img', src: '/assets/explorations/screenshot-2.png', alt: 'Screenshot', flex: 50 },
  ]},
  { type: 'full',  items: [{ kind: 'img', src: '/assets/explorations/design-extra.jpeg', alt: 'Design' }] },
]

const ALL_LIGHTBOX = ROWS.flatMap(r => r.items.filter(i => i.kind === 'img'))

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

  let imgLightboxIdx = 0

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
          {ROWS.map((row, ri) => (
            <div key={ri} className={row.type === 'full' ? styles.rowFull : styles.rowSplit}>
              {row.items.map((item, ii) => {
                const lbIdx = item.kind === 'img' ? imgLightboxIdx++ : null
                return (
                  <div
                    key={ii}
                    className={styles.cell}
                    style={item.flex ? { flex: item.flex } : undefined}
                    onClick={item.kind === 'img' ? () => setLightbox(lbIdx) : undefined}
                  >
                    {item.kind === 'video' ? (
                      <video
                        src={item.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className={styles.cellVideo}
                      />
                    ) : (
                      <img src={item.src} alt={item.alt} loading="lazy" />
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <Footer />
        </div>
      </div>
    </>
  )
}
