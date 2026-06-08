import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import CaseStudyLayout, { FadeItem } from '../components/CaseStudyLayout'
import ScrambleText from '../components/ScrambleText'
import { useScrollY } from '../hooks/useScrollY'
import styles from './CostGraphPage.module.css'
import imgStyles from './FundifyPage.module.css'

const SECTIONS = ['Intro', 'My role', 'Problem', 'Design', 'FundCoins', 'Lessons']

// Figma assets
const VECTOR   = 'https://www.figma.com/api/mcp/asset/48460bb0-4a02-4125-b00e-46af4dddddc5'
const PHONE_C  = 'https://www.figma.com/api/mcp/asset/5378a954-2dd8-455b-9938-14458adc0032'
const PHONE_L  = 'https://www.figma.com/api/mcp/asset/6612f1fe-c761-4dae-a4f2-fa021c95226f'
const PHONE_R  = 'https://www.figma.com/api/mcp/asset/87fab92f-a81e-4a80-b551-1a002372476c'

const ARROW = (
  <svg viewBox="0 0 11.05 8.25" fill="none" style={{ width: 14, height: 14, flexShrink: 0 }}>
    <path d="M10.425 3.425H2.725C1.5651 3.425 0.625 4.3651 0.625 5.525V7.625" stroke="#5C5C5C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.625 6.225L10.425 3.425L7.625 0.625" stroke="#5C5C5C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function ImgBlock({ children, light }) {
  return (
    <div className={light ? imgStyles.imgBlockLight : imgStyles.imgBlock}>
      {children}
    </div>
  )
}

export default function FundifyPage() {
  const [active, setActive] = useState('Intro')
  const [copied, setCopied] = useState(false)
  const sectionRefs = useRef({})

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    document.title = 'Fundify — Shater Tsavsar'
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Fundify — Shater Tsavsar')
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', 'https://www.figma.com/api/mcp/asset/5378a954-2dd8-455b-9938-14458adc0032')
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
        <div className={`${styles.breadcrumb} ${scrollY > 10 ? styles.breadcrumbScrolled : ''}`}>
          <div className={styles.breadcrumbInner}>
            <Link to="/" className={styles.backPill}>
              <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <path d="M10 4L6 8L10 12" stroke="#5c5c5c" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Back</span>
            </Link>
            <div className={styles.crumbs}>
              <div className={`${styles.breadcrumbThumb} ${heroCollapsed ? styles.breadcrumbThumbVisible : ''}`}
                style={{ background: '#141414' }}>
                <img src={VECTOR} alt="" style={{ objectFit:'contain', padding:6, width:'100%', height:'100%' }} />
              </div>
              <span className={styles.crumbMuted}>Home</span>
              <span className={styles.crumbMuted}>/</span>
              <span className={styles.crumbActive}>Fundify</span>
              <button onClick={handleCopy} className={styles.copyBtn} aria-label="Copy link">
                <span className={styles.copyBtnSpacer}>
                  <svg width="16" height="16" viewBox="0 0 18 18" /><span style={{ fontSize:11 }}>Link copied</span>
                </span>
                <span className={styles.copyBtnState} style={{ opacity: copied ? 0 : 1 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" style={{ flexShrink:0 }}>
                    <path d="M8.36909 6.8934C8.06649 7.0539 7.78239 7.2617 7.52799 7.517L7.51799 7.527C6.13699 8.908 6.13699 11.146 7.51799 12.527L9.69299 14.702C11.074 16.083 13.312 16.083 14.693 14.702L14.703 14.692C16.084 13.311 16.084 11.073 14.703 9.692L13.9406 8.9296" stroke="#5c5c5c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    <path d="M9.63289 11.1066C9.93549 10.9461 10.2196 10.7383 10.474 10.483L10.484 10.473C11.865 9.09199 11.865 6.85399 10.484 5.47299L8.30899 3.29799C6.92799 1.91699 4.68999 1.91699 3.30899 3.29799L3.29899 3.30799C1.91799 4.68899 1.91799 6.92699 3.29899 8.30799L4.06139 9.07039" stroke="#5c5c5c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </span>
                <span className={styles.copyBtnState} style={{ opacity: copied ? 1 : 0 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" style={{ flexShrink:0 }}>
                    <path d="M6.50011 15C6.23741 14.9834 5.96302 14.8438 5.83412 14.5952C4.78042 12.563 3.5987 10.9062 2.2198 9.5307C1.9268 9.2382 1.92683 8.7631 2.21883 8.4702C2.51083 8.1773 2.98642 8.1763 3.28032 8.4692C4.48242 9.6699 5.54301 11.0605 6.50001 12.6958C8.76461 8.7539 11.5537 5.5454 14.8047 3.1465C15.1377 2.9004 15.6074 2.9722 15.8535 3.3047C16.0996 3.6377 16.0283 4.1074 15.6953 4.3535C12.3027 6.8574 9.4316 10.3047 7.1631 14.6001C7.0332 14.8462 6.77841 15 6.50011 15Z" fill="#5c5c5c"/>
                  </svg>
                  <span style={{ fontSize:11, color:'#5c5c5c', fontWeight:500, letterSpacing:'0.01em' }}>Link copied</span>
                </span>
              </button>
            </div>
          </div>
        </div>
        , document.body)}

        {/* Hero */}
        <FadeItem><div className={styles.hero}>
          <div className={`${imgStyles.heroImg} ${heroCollapsed ? styles.heroImgMini : ''}`}>
            <img src="/assets/fundify cover image internal.png" alt=""
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', pointerEvents:'none' }} />
          </div>
          <div className={styles.heroTags}>
            <span className={styles.tag} style={{ gap:6, display:'inline-flex', alignItems:'center' }}>
              <img src={VECTOR} alt="" style={{ width:14, height:14, objectFit:'contain' }} />
              Fundify
            </span>
            <span className={styles.tag}>2024</span>
          </div>
        </div></FadeItem>

        {/* Intro */}
        <FadeItem><section id="intro" data-section="Intro" ref={reg('Intro')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Intro</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Most people know they should save. They just do not. The app they downloaded three months ago sits unopened because it made saving feel like a chore.</p>
            <p>Fundify is a mobile finance app built on a different premise: money management should feel like progress, not punishment. I designed it to reward the behaviours that actually build financial health, saving, transferring, hitting targets, through a points system called FundCoins.</p>
          </div>
        </section></FadeItem>

        {/* My role */}
        <FadeItem><section id="my-role" data-section="My role" ref={reg('My role')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>My role</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Solo product designer, end to end.</p>
            <ul className={styles.list}>
              <li>Product strategy and concept</li>
              <li>UX and information architecture</li>
              <li>Visual identity and brand</li>
              <li>High-fidelity UI design</li>
              <li>Interaction and motion design</li>
              <li>Rewards system design (FundCoins)</li>
              <li>Prototype and user testing</li>
            </ul>
          </div>
        </section></FadeItem>

        {/* Problem */}
        <FadeItem><section id="problem" data-section="Problem" ref={reg('Problem')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Problem</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Finance apps treat users like they need to be managed. Dashboards full of red numbers, budget warnings, alerts about overspending. The feedback loop is negative by default.</p>

            <p>That design reflects a fundamental misread of user behaviour. People disengage when tools make them feel bad. They stay when the tool makes them feel like they are winning.</p>
            <p>The goal was to build the opposite of a budget tracker. Not a tool that catches you failing, a tool that rewards you for doing the right thing.</p>
          </div>
        </section></FadeItem>

        {/* Design */}
        <FadeItem><section id="design" data-section="Design" ref={reg('Design')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Design</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>The visual language is deliberately premium and dark. Black backgrounds, gold tones, clean typography. Finance should feel like it has weight. Most finance apps look like productivity tools. Fundify looks like something you want to open.</p>

            <div className={imgStyles.videoBlock}>
              <video
                src="/assets/Fundify demo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className={imgStyles.video}
              />
            </div>

            <p>The core screens are the wallet (total balance, top up, transfer), the rewards hub (FundCoins points, redemption catalogue), and the activity feed (transactions, milestones). Navigation is minimal. Every tap is intentional.</p>
            <p>I also designed Travel Vouchers as one of the first redemption categories, a tangible, high-desire reward that gives users a clear reason to accumulate points.</p>

            <img src="https://www.figma.com/api/mcp/asset/d5e620c9-a880-4731-a83f-36a76b6c5b58" alt=""
              style={{ width:'100%', display:'block', borderRadius:12 }} />
          </div>
        </section></FadeItem>

        {/* FundCoins */}
        <FadeItem><section id="fundcoins" data-section="FundCoins" ref={reg('FundCoins')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>FundCoins</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>FundCoins are the engine of the product. Every positive financial action earns points: saving a set amount, completing a transfer, hitting a weekly target. Points accumulate and convert to real rewards.</p>

            <p>The design challenge was making FundCoins feel real without feeling gimmicky. The gold coin icon, the points balance displayed prominently, the rewards catalogue with actual items. Each decision pushes it toward something that feels earned rather than cheap.</p>
            <p>179,000 points. A user who sees that number does not feel like they are being tracked. They feel like they are getting somewhere.</p>

            <img src="https://www.figma.com/api/mcp/asset/c0a08512-d4ca-4fba-a6db-d9d6a4f837ea" alt=""
              style={{ width:'100%', display:'block', borderRadius:12 }} />
          </div>
        </section></FadeItem>

        {/* Lessons */}
        <FadeItem><section id="lessons" data-section="Lessons" ref={reg('Lessons')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Lessons</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Positive reinforcement is a design tool. It is not just a UX nicety. It changes the product category. Fundify does not compete with Monzo or Revolut. It competes with the version of those apps that people actually open.</p>
            <p>The visual identity did more work than I expected. The dark premium aesthetic set expectations before users read a single word. Tone communicates value before content does.</p>
          </div>
        </section></FadeItem>

        {/* Screen showcase */}
        <FadeItem><img src="https://www.figma.com/api/mcp/asset/f9a200cf-74a2-4575-9224-14c8ad062a8c" alt="" style={{ width:'100%', display:'block', borderRadius:12 }} /></FadeItem>
        <FadeItem><img src="https://www.figma.com/api/mcp/asset/d5e620c9-a880-4731-a83f-36a76b6c5b58" alt="" style={{ width:'100%', display:'block', borderRadius:12 }} /></FadeItem>
        <FadeItem><img src="https://www.figma.com/api/mcp/asset/72717aaa-2c12-42a1-97b4-8f9c2dfa1cc9" alt="" style={{ width:'100%', display:'block', borderRadius:12 }} /></FadeItem>
        <FadeItem><img src="https://www.figma.com/api/mcp/asset/c0a08512-d4ca-4fba-a6db-d9d6a4f837ea" alt="" style={{ width:'100%', display:'block', borderRadius:12 }} /></FadeItem>

        {/* Articles */}
        <FadeItem><section className={styles.articlesSection}>
          <p className={styles.sectionLabel}>my articles</p>
          <a className={styles.articleItem} href="#">
            <div className={styles.articleThumb}>
              <img src="https://www.figma.com/api/mcp/asset/b50054ec-659f-47c0-a81b-02200d94ccc5" alt="" />
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
