import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { useScrollY } from '../hooks/useScrollY'
import styles from './ExplorationsPage.module.css'

// Layout: 'full' = one image spanning full width, 'split' = two images side by side
// flex values control proportional width in split rows
const ROWS = [
  { type: 'full',  images: [{ src: '/assets/explorations/lonar-dashboard.jpeg',  alt: 'Lönar — login and dashboard' }] },
  { type: 'split', images: [
    { src: '/assets/explorations/skaraa-audio.png',   alt: 'Skaraa — audio stem splitter', flex: 46 },
    { src: '/assets/explorations/context-menus.jpeg', alt: 'Context menu variants',         flex: 54 },
  ]},
  { type: 'full',  images: [{ src: '/assets/explorations/settings-page.jpeg', alt: 'Settings page' }] },
  { type: 'split', images: [
    { src: '/assets/explorations/lonar-invoice.jpeg', alt: 'Lönar — invoice send flow', flex: 54 },
    { src: '/assets/explorations/filter-chips.jpeg',  alt: 'Filter chip components',    flex: 46 },
  ]},
  { type: 'full',  images: [{ src: '/assets/explorations/finance-cards.jpeg', alt: 'Finance category cards' }] },
  { type: 'split', images: [
    { src: '/assets/explorations/transaction-feed.jpeg', alt: 'Transaction activity feed', flex: 46 },
    { src: '/assets/explorations/tanj-banner.jpeg',      alt: 'Tanj — CTA banner',         flex: 54 },
  ]},
  { type: 'full',  images: [{ src: '/assets/explorations/task-pricing.jpeg', alt: 'Task categories and pricing plans' }] },
  { type: 'split', images: [
    { src: '/assets/explorations/auth-flows.webp', alt: 'Auth flows',        flex: 52 },
    { src: '/assets/explorations/otp-input.jpeg',  alt: 'OTP input states',  flex: 48 },
  ]},
  { type: 'full',  images: [{ src: '/assets/explorations/pricing-page.jpeg', alt: 'Pricing page layout' }] },
  { type: 'full',  images: [{ src: '/assets/explorations/pricing-grows.png', alt: 'Pricing — grows with you' }] },
]

const ALL_IMAGES = ROWS.flatMap(r => r.images)

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
      if (e.key === 'ArrowRight' && lightbox !== null) setLightbox(i => Math.min(i + 1, ALL_IMAGES.length - 1))
      if (e.key === 'ArrowLeft'  && lightbox !== null) setLightbox(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  let imgIndex = 0

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
            src={ALL_IMAGES[lightbox].src}
            alt={ALL_IMAGES[lightbox].alt}
            className={styles.lightboxImg}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      <div className={styles.page}>
        <div className={styles.grid}>
          {ROWS.map((row, ri) => {
            const rowStart = imgIndex
            imgIndex += row.images.length
            return (
              <div key={ri} className={row.type === 'full' ? styles.rowFull : styles.rowSplit}>
                {row.images.map((img, ii) => {
                  const idx = rowStart + ii
                  return (
                    <div
                      key={ii}
                      className={styles.cell}
                      style={img.flex ? { flex: img.flex } : undefined}
                      onClick={() => setLightbox(idx)}
                    >
                      <img src={img.src} alt={img.alt} loading="lazy" />
                    </div>
                  )
                })}
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
