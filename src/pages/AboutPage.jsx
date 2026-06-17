import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { useScrollY } from '../hooks/useScrollY'
import styles from './AboutPage.module.css'

const am = f => `/assets/aboutme%20page/${encodeURIComponent(f)}`

const SIG_PATH = "M40.8613 34.142C49.863 29.7983 48.196 22.9486 43.0284 23.6169C36.4797 26.6814 34.11 32.2208 28.2756 52.3521C21.3577 67.7221 9.27205 71.3975 10.8558 65.5502C16.0772 58.2166 38.5275 44.4165 57.1143 40.1564C71.4502 36.8705 76.4511 37.3163 79.7017 34.142M75.8677 26.9582C75.0342 28.2947 72.031 27.2923 69.9473 28.8795C67.5558 29.5208 67.3991 30.0536 65.3658 31.469C63.8516 32.523 62.7962 34.0245 61.0316 34.5597C59.2338 35.105 59.0361 33.268 57.6143 33.8914C53.6136 35.6456 49.6129 37.901 47.6958 38.4857C46.6687 38.799 48.2793 36.2303 46.8624 35.8127C45.4454 35.395 40.4445 41.0752 39.6944 40.407C38.9442 39.7387 39.4443 38.4857 39.4443 38.4857M69.9473 28.8795C70.5308 27.4594 73.7006 25.3711 73.0338 24.4522C72.367 23.5334 71.3669 25.7888 70.45 27.6265C69.5332 29.4642 68.4654 33.9038 71.1168 34.6432C73.4955 35.3065 77.4021 31.469 78.322 30.0103"

const CANVAS_W = 800

// x/y = position on canvas. w = display width. Tilt baked into image files.
const COLLAGE_ITEMS = [
  { id: 'img4892',    src: am('IMG_4892 1.png'),                                x: -20,  y: 30,  w: 207 },
  { id: 'vector',     src: am('Vector.png'),                                    x: 40,   y: -30, w: 95  },
  { id: 'dm_card',    src: am('Frame 2095587326.png'),                          x: 95,   y: 60,  w: 225 },
  { id: 'img75352',   src: am('IMG_7535 2.png'),                                x: 30,   y: 220, w: 93  },
  { id: 'vector2',    src: am('Vector-2.png'),                                  x: 155,  y: 175, w: 61  },
  { id: 'img7648',    src: am('IMG_7648.png'),                                  x: 140,  y: 100, w: 184 },
  { id: 'vector1',    src: am('Vector-1.png'),                                  x: 260,  y: -20, w: 100 },
  { id: 'image282',   src: am('image 282.png'),                                 x: 295,  y: 60,  w: 165 },
  { id: 'receiptify', src: am('Top Tracks Short Term from Receiptify 1.png'),   x: 355,  y: -10, w: 205 },
  { id: 'vector3',    src: am('Vector-3.png'),                                  x: 330,  y: 185, w: 142 },
  { id: 'vector4',    src: am('Vector-4.png'),                                  x: 260,  y: 255, w: 104 },
  { id: 'img9931',    src: am('IMG_9931.png'),                                  x: 455,  y: 170, w: 112 },
  { id: 'img3050',    src: am('IMG_3050.png'),                                  x: 490,  y: 55,  w: 143 },
  { id: 'img6462',    src: am('IMG_6462.png'),                                  x: 570,  y: 200, w: 87  },
  { id: 'knicks',     src: am('New York Knicks Logo 1995 1.png'),               x: 610,  y: 155, w: 62  },
  { id: 'polaroid',   src: am('Frame 2095586967.png'),                          x: 490,  y: -20, w: 350 },
  { id: 'ea_card',   src: am('EA FC 26 Card Saliba 1.png'),                    x: 670,  y: 80,  w: 152 },
  { id: 'image283',   src: am('image 283.png'),                                 x: 700,  y: -10, w: 136 },
  { id: 'flag',       src: am('🇳🇬.png'),                                       x: 735,  y: 175, w: 126 },
]

const MOVIES = [
  { src: am('image 9.png'), title: '500 Days of Summer',          imdb: 'https://www.imdb.com/title/tt1022603/' },
  { src: am('image 2.png'), title: 'Scott Pilgrim vs. the World', imdb: 'https://www.imdb.com/title/tt0446029/' },
  { src: am('image 3.png'), title: "It's Kind of a Funny Story",  imdb: 'https://www.imdb.com/title/tt1195935/' },
  { src: am('image 1.png'), title: 'Inglourious Basterds',        imdb: 'https://www.imdb.com/title/tt0361748/' },
  { src: am('image 6.png'), title: 'Sing Street',                 imdb: 'https://www.imdb.com/title/tt3544112/' },
]

const ALBUMS = [
  { src: am('image 2-1.png'), spotify: null },
  { src: am('image.png'),     spotify: null },
  { src: am('image-1.png'),   spotify: 'https://open.spotify.com/album/4ULX5yNL7dqM24NMLcKaJK' },
  { src: am('image-2.png'),   spotify: 'https://open.spotify.com/album/7f6xPqyaolTiziKf5R5Z0c' },
  { src: am('image-3.png'),   spotify: null },
  { src: am('image-4.png'),   spotify: 'https://open.spotify.com/album/3a3rCsGp8l3TLXzc56DFOX' },
  { src: am('image-5.png'),   spotify: 'https://open.spotify.com/album/2MnMLbOWh6Gv0jEBkXfTHV' },
  { src: am('image-6.png'),   spotify: null },
  { src: am('image-7.png'),   spotify: null },
  { src: am('image-8.png'),   spotify: null },
]

// ── Collage ──────────────────────────────────────────────────────────────────
function Collage() {
  const [offsets, setOffsets] = useState(
    () => Object.fromEntries(COLLAGE_ITEMS.map(i => [i.id, { dx: 0, dy: 0 }]))
  )
  const [dragging, setDragging] = useState(null)
  const [zOrder, setZOrder]     = useState(() => COLLAGE_ITEMS.map(i => i.id))

  const startDrag = useCallback((clientX, clientY, id) => {
    const off = offsets[id]
    setDragging({ id, startMouseX: clientX, startMouseY: clientY, startDx: off.dx, startDy: off.dy })
    setZOrder(prev => [...prev.filter(i => i !== id), id])
  }, [offsets])

  useEffect(() => {
    if (!dragging) return
    function onMove(e) {
      const cx = e.clientX ?? e.touches?.[0]?.clientX
      const cy = e.clientY ?? e.touches?.[0]?.clientY
      if (cx == null) return
      setOffsets(prev => ({
        ...prev,
        [dragging.id]: {
          dx: dragging.startDx + (cx - dragging.startMouseX),
          dy: dragging.startDy + (cy - dragging.startMouseY),
        }
      }))
    }
    function onUp() { setDragging(null) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragging])

  return (
    <div className={styles.collageOuter}>
      <div className={styles.collageCanvas} style={{ width: CANVAS_W }}>
        {COLLAGE_ITEMS.map(item => {
          const off    = offsets[item.id]
          const zIdx   = zOrder.indexOf(item.id)
          const isDrag = dragging?.id === item.id
          return (
            <div
              key={item.id}
              className={`${styles.collageItem} ${isDrag ? styles.itemDragging : ''}`}
              style={{
                left:   item.x + off.dx,
                top:    item.y + off.dy,
                zIndex: zIdx,
              }}
              onMouseDown={e => { e.preventDefault(); startDrag(e.clientX, e.clientY, item.id) }}
              onTouchStart={e => {
                e.preventDefault()
                const t = e.touches[0]
                startDrag(t.clientX, t.clientY, item.id)
              }}
            >
              <img src={item.src} alt="" draggable={false} className={styles.collageImg} style={{ width: item.w }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [copied, setCopied] = useState(false)
  const pathRef  = useRef(null)
  const scrollY  = useScrollY()
  const scrolled = scrollY > 10

  useEffect(() => {
    document.title = 'About me — Shater Tsavsar'
    window.scrollTo(0, 0)
    return () => { document.title = 'Shater Tsavsar - Systemic Native' }
  }, [])

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function playSig() {
    if (!pathRef.current) return
    pathRef.current.animate(
      [{ strokeDashoffset: 1200 }, { strokeDashoffset: 0 }],
      { duration: 5000, easing: 'cubic-bezier(0.4,0,0.2,1)', fill: 'forwards' }
    )
  }

  const breadcrumb = (
    <div className={`${styles.breadcrumb} ${scrolled ? styles.breadcrumbScrolled : ''}`}>
      <div className={styles.breadcrumbInner}>
        <Link to="/" className={styles.backPill}>
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
            <path d="M10 4L6 8L10 12" stroke="#5C5C5C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Back</span>
        </Link>
        <div className={styles.crumbs}>
          <svg className={styles.sig} viewBox="0 0 90 90" fill="none" onMouseEnter={playSig} aria-hidden="true">
            <path
              ref={pathRef}
              d={SIG_PATH}
              stroke="#1A1714"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ strokeDasharray: 1200, strokeDashoffset: 0 }}
            />
          </svg>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbActive}>About me</span>
        </div>
        <button onClick={handleCopy} className={styles.copyBtn} aria-label="Copy link">
          <span className={styles.copyBtnState} style={{ opacity: copied ? 0 : 1 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M8.369 6.893c-.303.16-.587.368-.841.624l-.01.01C6.137 8.908 6.137 11.146 7.518 12.527l2.175 2.175c1.381 1.381 3.619 1.381 5 0l.01-.01c1.381-1.381 1.381-3.619 0-5l-.762-.762" stroke="#6a6a6a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.633 11.107c.302-.16.586-.369.84-.624l.01-.01c1.381-1.381 1.381-3.619 0-5L8.309 3.298c-1.381-1.381-3.619-1.381-5 0l-.01.01c-1.381 1.381-1.381 3.619 0 5l.762.762" stroke="#6a6a6a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className={styles.copyBtnState} style={{ opacity: copied ? 1 : 0, fontSize: 11, fontWeight: 500, color: 'var(--text-sub)' }}>
            Copied
          </span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {createPortal(breadcrumb, document.body)}

      <div className={styles.page}>
        <div className={styles.content}>

          {/* Collage — breaks out of the 620px column via negative margins */}
          <div className={`${styles.collageSectionWrap} ${styles.fadeItem} ${styles.fadeItem0}`}>
            <Collage />
          </div>

          {/* Bio */}
          <section className={`${styles.section} ${styles.fadeItem} ${styles.fadeItem1}`}>
            <p>btw, go back and click on my picture on the homepage 👀</p>
            <p>Asides the work I have going on, I'm also really invested in sports, supporting Arsenal FC is the longest running commitment in my life, 18 years and counting! Then in the Nba, I'm a New York Knicks fan. I play basketball and I also play chess.</p>
            <p>2026 has been crazy cause both teams won their leagues, what a time to be alive fr.</p>
            <p>There are a couple movies/shows I feel best represent myself and they're always a good watch. Here are a few, it was almost impossible to reduce everything to these 5 but yeah, they're great watches.</p>
          </section>

          {/* Movies */}
          <div className={`${styles.movieRow} ${styles.fadeItem} ${styles.fadeItem2}`}>
            {MOVIES.map(({ src, title, imdb }) => (
              <a key={title} href={imdb} target="_blank" rel="noopener noreferrer" className={styles.movieCell} title={title}>
                <img src={src} alt={title} className={styles.movieImg} />
                <div className={styles.movieOverlay}>
                  <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                    <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5"/>
                    <path d="M8 7l5 3-5 3V7z" fill="white"/>
                  </svg>
                  <span>IMDb</span>
                </div>
              </a>
            ))}
          </div>

          {/* Music bio */}
          <section className={`${styles.section} ${styles.fadeItem} ${styles.fadeItem3}`}>
            <p>I passively write music, vocals here and there but mostly stuff around my bass guitar. I can go on and on about music and it's impact y'know, read some of my articles on that to see where my head is about it all.</p>
            <p>That said, I am very in love with music, it's almost an obsession at this point, here are a few albums I'd 100% recommend you checkout at least once.</p>
          </section>

          {/* Albums */}
          <div className={`${styles.albumGrid} ${styles.fadeItem} ${styles.fadeItem4}`}>
            {[ALBUMS.slice(0, 5), ALBUMS.slice(5)].map((row, ri) => (
              <div key={ri} className={styles.albumRow}>
                {row.map(({ src, spotify }, i) =>
                  spotify ? (
                    <a key={i} href={spotify} target="_blank" rel="noopener noreferrer" className={styles.albumCell}>
                      <img src={src} alt="" className={styles.albumImg} />
                      <div className={styles.albumOverlay}>
                        <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                          <circle cx="12" cy="12" r="10" fill="#1DB954"/>
                          <path d="M7.5 15.5c2.5-1.5 6.5-1.5 9 0M6.5 12.5c3-2 8-2 11 0M8 9.5c2-1.5 6-1.5 8 0" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </a>
                  ) : (
                    <div key={i} className={styles.albumCell}>
                      <img src={src} alt="" className={styles.albumImg} />
                    </div>
                  )
                )}
              </div>
            ))}
          </div>

          <div className={`${styles.fadeItem} ${styles.fadeItem5}`}><Footer /></div>

        </div>
      </div>
    </>
  )
}
