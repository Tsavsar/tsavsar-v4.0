import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { useScrollY } from '../hooks/useScrollY'
import styles from './ExplorationsPage.module.css'

const ITEMS = [
  // Videos
  { kind: 'video', src: '/assets/explorations/video-twitter2.mp4' },
  { kind: 'video', src: '/assets/explorations/video-fundify.mov' },
  { kind: 'video', src: '/assets/explorations/video-main.mp4' },

  { kind: 'video', src: '/assets/explorations/video-1420.mp4' },
  { kind: 'video', src: '/assets/explorations/video-1260.mp4' },
  { kind: 'video', src: '/assets/explorations/video-1234.mp4' },
  { kind: 'video', src: '/assets/explorations/video-1046.mp4' },
  { kind: 'video', src: '/assets/explorations/video-1104.mp4' },
  { kind: 'video', src: '/assets/explorations/video-1280a.mp4' },
  { kind: 'video', src: '/assets/explorations/video-1280b.mp4' },
  { kind: 'video', src: '/assets/explorations/video-twitter.mp4' },
  { kind: 'video', src: '/assets/explorations/video-copy2.mp4' },
  { kind: 'video', src: '/assets/explorations/video-rec1.mov' },
  { kind: 'video', src: '/assets/explorations/video-rec2.mov' },
  { kind: 'video', src: '/assets/explorations/video-rec3.mov' },
  { kind: 'video', src: '/assets/explorations/video-feb3.mov' },
  { kind: 'video', src: '/assets/explorations/video-jan31.mov' },
  { kind: 'video', src: '/assets/explorations/video-boki.mp4' },

  // Images — ordered by quality
  { kind: 'img', src: '/assets/explorations/weave-onboarding.png',     alt: 'Weave — secure card payments' },
  { kind: 'img', src: '/assets/explorations/weave-control.png',        alt: 'Weave — financial control' },
  { kind: 'img', src: '/assets/explorations/new-3.png',                alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/new-6.png',                alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/analytics-dashboard.webp', alt: 'Analytics dashboard' },
  { kind: 'img', src: '/assets/explorations/lonar-overview.png',         alt: 'Lönar — overview' },
  { kind: 'img', src: '/assets/explorations/lonar-clients.webp',        alt: 'Lönar — clients & detail' },
  { kind: 'img', src: '/assets/explorations/kanban-board.webp',         alt: 'Kanban board' },
  { kind: 'img', src: '/assets/explorations/lonar-mobile-1.png',        alt: 'Lönar mobile — settings & overview' },
  { kind: 'img', src: '/assets/explorations/lonar-mobile-2.png',    alt: 'Lönar mobile — invoice detail' },
  { kind: 'img', src: '/assets/explorations/lyfers-breakdown.png',  alt: 'Lyfers — balance breakdown' },
  { kind: 'img', src: '/assets/explorations/lyfers-wallet.png',     alt: 'Lyfers — fund wallet & transaction' },
  { kind: 'img', src: '/assets/explorations/lyfers-spotify.png',    alt: 'Lyfers — Spotify bottom sheet' },
  { kind: 'img', src: '/assets/explorations/lyfers-card.png',       alt: 'Lyfers — card screen' },
  { kind: 'img', src: '/assets/explorations/lyfers-home.png',       alt: 'Lyfers — home balance' },
  { kind: 'img', src: '/assets/explorations/banking-home.png',      alt: 'Banking app — home' },
  { kind: 'img', src: '/assets/explorations/list-property.webp',   alt: 'List your property' },
  { kind: 'img', src: '/assets/explorations/pdf-upload.png',        alt: 'PDF upload component' },
  { kind: 'img', src: '/assets/explorations/new-1.png',             alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/new-2.png',             alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/new-4.png',             alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/new-5.png',             alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/boki-ai.webp',          alt: 'Boki AI' },
  { kind: 'img', src: '/assets/explorations/design-extra.jpeg',     alt: 'Design' },
  { kind: 'img', src: '/assets/explorations/lonar-dashboard.jpeg',  alt: 'Lönar dashboard' },
  { kind: 'img', src: '/assets/explorations/skaraa-audio.png',      alt: 'Skaraa audio' },
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
]

const ALL_LIGHTBOX = ITEMS.filter(i => i.kind === 'img')

export default function ExplorationsPage() {
  const scrollY = useScrollY()
  const [lightbox, setLightbox] = useState(null)
  const [copied, setCopied] = useState(false)

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

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
            <button onClick={copyLink} className={styles.copyBtn} aria-label="Copy link">
              <span className={styles.copyBtnSpacer}>
                <svg width="16" height="16" viewBox="0 0 18 18"/><span style={{ fontSize:11 }}>Link copied</span>
              </span>
              <span className={styles.copyBtnState} style={{ opacity: copied ? 0 : 1 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" style={{ flexShrink:0 }}>
                  <path d="M8.36909 6.8934C8.06649 7.0539 7.78239 7.2617 7.52799 7.517L7.51799 7.527C6.13699 8.908 6.13699 11.146 7.51799 12.527L9.69299 14.702C11.074 16.083 13.312 16.083 14.693 14.702L14.703 14.692C16.084 13.311 16.084 11.073 14.703 9.692L13.9406 8.9296" stroke="#6a6a6a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M9.63289 11.1066C9.93549 10.9461 10.2196 10.7383 10.474 10.483L10.484 10.473C11.865 9.09199 11.865 6.85399 10.484 5.47299L8.30899 3.29799C6.92799 1.91699 4.68999 1.91699 3.30899 3.29799L3.29899 3.30799C1.91799 4.68899 1.91799 6.92699 3.29899 8.30799L4.06139 9.07039" stroke="#6a6a6a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </span>
              <span className={styles.copyBtnState} style={{ opacity: copied ? 1 : 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" style={{ flexShrink:0 }}>
                  <path d="M6.50011 15C6.23741 14.9834 5.96302 14.8438 5.83412 14.5952C4.78042 12.563 3.5987 10.9062 2.2198 9.5307C1.9268 9.2382 1.92683 8.7631 2.21883 8.4702C2.51083 8.1773 2.98642 8.1763 3.28032 8.4692C4.48242 9.6699 5.54301 11.0605 6.50001 12.6958C8.76461 8.7539 11.5537 5.5454 14.8047 3.1465C15.1377 2.9004 15.6074 2.9722 15.8535 3.3047C16.0996 3.6377 16.0283 4.1074 15.6953 4.3535C12.3027 6.8574 9.4316 10.3047 7.1631 14.6001C7.0332 14.8462 6.77841 15 6.50011 15Z" fill="#6a6a6a"/>
                </svg>
                <span style={{ fontSize:11, color:'#6a6a6a', fontWeight:500, letterSpacing:'0.01em' }}>Link copied</span>
              </span>
            </button>
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
