import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import CaseStudyLayout, { FadeItem } from '../components/CaseStudyLayout'
import ScrambleText from '../components/ScrambleText'
import { useScrollY } from '../hooks/useScrollY'
import styles from './CostGraphPage.module.css'
import imgStyles from './LuotainPage.module.css'

const SECTIONS = ['Intro', 'My role', 'Solution', 'Process', 'Lessons']

const ARROW = (
  <svg viewBox="0 0 11.05 8.25" fill="none" style={{ width: 14, height: 14, flexShrink: 0 }}>
    <path d="M10.425 3.425H2.725C1.5651 3.425 0.625 4.3651 0.625 5.525V7.625" stroke="#5C5C5C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.625 6.225L10.425 3.425L7.625 0.625" stroke="#5C5C5C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Slot for a screenshot or, once supplied, a video
function ImgBlock({ src }) {
  return (
    <div className={imgStyles.imgBlock}>
      {src && <img src={src} alt="" />}
    </div>
  )
}

export default function LuotainPage() {
  const [active, setActive] = useState('Intro')
  const [copied, setCopied] = useState(false)
  const sectionRefs = useRef({})

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    document.title = 'Luotain — Shater Tsavsar'
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Luotain — Shater Tsavsar')
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', '/assets/luotain-card.png')
    return () => {
      document.title = 'Shater Tsavsar - Systemic Native'
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Shater Tsavsar - Systemic Native')
      document.querySelector('meta[property="og:image"]')?.setAttribute('content', '/og-image.png')
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    const observer = new IntersectionObserver(
      entries => { entries.forEach(e => { if (e.isIntersecting) setActive(e.target.dataset.section) }) },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    Object.values(sectionRefs.current).forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const scrollY = useScrollY()
  const heroCollapsed = scrollY > 220
  const reg = id => el => { sectionRefs.current[id] = el }

  return (
    <CaseStudyLayout>
    <div className={styles.page}>
      <nav className={styles.sidebar}>
        {SECTIONS.map(s => (
          <a key={s} href={`#${s.toLowerCase().replace(' ', '-')}`}
            className={`${styles.sideLink} ${active === s ? styles.sideLinkActive : ''}`}>{s}</a>
        ))}
      </nav>

      <main className={styles.content}>
        {/* Breadcrumb */}
        {createPortal(
        <div className={`${styles.breadcrumb} ${scrollY > 10 ? styles.breadcrumbScrolled : ""}`}>
          <div className={styles.breadcrumbInner}>
            <Link to="/" className={styles.backPill}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2.39844 8.8H11.1984C12.524 8.8 13.5984 7.7256 13.5984 6.4V4" stroke="#A3A3A3" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.59844 5.59961L2.39844 8.79961L5.59844 11.9996" stroke="#A3A3A3" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Back</span>
            </Link>
            <div className={styles.crumbs}>
              <div className={`${styles.breadcrumbThumb} ${heroCollapsed ? styles.breadcrumbThumbVisible : ''}`}
                style={{ background: "#f6d9bd url('/assets/luotain/hero-bg.png') center / cover" }}>
                
              </div>
              <span className={styles.crumbMuted}>Home</span>
              <span className={styles.crumbMuted}>/</span>
              <span className={styles.crumbActive}>Luotain</span>
              <button onClick={handleCopy} className={styles.copyBtn} aria-label="Copy link">
                <span className={styles.copyBtnSpacer}>
                  <svg width="16" height="16" viewBox="0 0 18 18" /><span style={{ fontSize:11 }}>Link copied</span>
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
          </div>
        </div>
        , document.body)}


        {/* Hero */}
        <FadeItem><div className={styles.hero}>
          <div className={`${imgStyles.heroImg} ${heroCollapsed ? styles.heroImgMini : ""}`}>
            <img src="/assets/luotain/shot-1736.png" alt=""
              style={{ position:'absolute', width:500, left:'50%', top:22, transform:'translateX(-50%)', objectFit:'contain', borderRadius:6, boxShadow:'0 20px 44px rgba(120,60,20,0.18)', pointerEvents:'none' }} />
          </div>
          <div className={styles.heroTags}>
            <a href="https://luotain.app" target="_blank" rel="noopener" className={imgStyles.tagLink}>luotain.app</a>
            <span className={styles.tag}>2026</span>
          </div>
        </div></FadeItem>

        {/* Intro */}
        <FadeItem><section id="intro" data-section="Intro" ref={reg('Intro')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Intro</ScrambleText></p>
          <div className={styles.sectionBody}>
            {/* copy pending */}
          </div>
        </section></FadeItem>

        {/* My role */}
        <FadeItem><section id="my-role" data-section="My role" ref={reg('My role')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>My role</ScrambleText></p>
          <div className={styles.sectionBody}>
            {/* copy pending */}
          </div>
        </section></FadeItem>

        {/* Solution */}
        <FadeItem><section id="solution" data-section="Solution" ref={reg('Solution')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Solution</ScrambleText></p>
          <div className={styles.sectionBody}>
            {/* copy pending */}
          </div>
        </section></FadeItem>

        {/* Process */}
        <FadeItem><section id="process" data-section="Process" ref={reg('Process')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Process</ScrambleText></p>
          <div className={styles.sectionBody}>
            {/* copy pending */}
            <ImgBlock src="/assets/luotain/shot-1806.png" />
            <ImgBlock />
          </div>
        </section></FadeItem>

        {/* Lessons */}
        <FadeItem><section id="lessons" data-section="Lessons" ref={reg('Lessons')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Lessons</ScrambleText></p>
          <div className={styles.sectionBody}>
            {/* copy pending */}
            <ImgBlock />
            <ImgBlock />
            <ImgBlock />
            <ImgBlock />
            <ImgBlock />
            <ImgBlock />
            <ImgBlock />
            <ImgBlock />
          </div>
        </section></FadeItem>

        {/* Articles */}
        <FadeItem><section className={styles.articlesSection}>
          <p className={styles.sectionLabel}>my articles</p>
          <a className={styles.articleItem} href="#">
            <div className={styles.articleThumb}>
              <img src="/assets/article-vicariously/thumbnail.png" alt="" />
            </div>
            <div className={styles.articleBody}>
              <div className={styles.articleTitleRow}>
                <span className={styles.articleTitle}>Vicariously living through the main character</span>
                {ARROW}
              </div>
              <p className={styles.articleExcerpt}>Why we emotionally attach ourselves to movie characters and the lives they live.</p>
              <div className={styles.articleMeta}>
                <span>5 min</span><span className={styles.dot} /><span>2026</span>
              </div>
            </div>
          </a>
        </section></FadeItem>

        <Footer />
      </main>
    </div>
    </CaseStudyLayout>
  )
}
