import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import CaseStudyLayout, { FadeItem } from '../components/CaseStudyLayout'
import ScrambleText from '../components/ScrambleText'
import { useScrollY } from '../hooks/useScrollY'
import styles from './CostGraphPage.module.css'

const SECTIONS = ['Intro', 'My role', 'Process', 'Design system', 'GraphAI', 'Lessons']

const ARROW = (
  <svg viewBox="0 0 11.05 8.25" fill="none" style={{ width: 14, height: 14, flexShrink: 0 }}>
    <path d="M10.425 3.425H2.725C1.5651 3.425 0.625 4.3651 0.625 5.525V7.625" stroke="#5C5C5C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.625 6.225L10.425 3.425L7.625 0.625" stroke="#5C5C5C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function CostGraphPage() {
  const [active, setActive] = useState('Intro')
  const [copied, setCopied] = useState(false)
  const sectionRefs = useRef({})

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    document.title = 'CostGraph.ai — Shater Tsavsar'
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'CostGraph.ai — Shater Tsavsar')
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', '/assets/logo front.png')
    return () => {
      document.title = 'Shater Tsavsar - Systemic Native'
      document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'Shater Tsavsar - Systemic Native')
      document.querySelector('meta[property="og:image"]')?.setAttribute('content', '/og-image.png')
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.dataset.section) })
      },
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
      {/* Sticky sidebar */}
      <nav className={styles.sidebar}>
        {SECTIONS.map(s => (
          <a
            key={s}
            href={`#${s.toLowerCase().replace(' ', '-')}`}
            className={`${styles.sideLink} ${active === s ? styles.sideLinkActive : ''}`}
          >{s}</a>
        ))}
      </nav>

      <main className={styles.content}>
        {/* Breadcrumb — portalled so sticky/fixed works outside transform parents */}
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
              {/* Mini cover in breadcrumb when hero collapses */}
              <div className={`${styles.breadcrumbThumb} ${heroCollapsed ? styles.breadcrumbThumbVisible : ''}`}
                style={{ background: 'linear-gradient(190.846deg,rgb(3,8,18) 8.57%,rgb(10,52,119) 68.68%)' }}>
                <img src="/assets/logo front.png" alt="" style={{ objectFit:'contain', padding:4 }} />
              </div>
              <span className={styles.crumbMuted}>Home</span>
              <span className={styles.crumbMuted}>/</span>
              <span className={styles.crumbActive}>CostGraph.ai</span>
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
          <div className={`${styles.heroImg} ${heroCollapsed ? styles.heroImgMini : ""}`}>
            <img src="/assets/costgraph-cover.png" alt=""
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', pointerEvents:'none' }} />
          </div>
          <div className={styles.heroTags}>
            <span className={styles.tag}>
              <img src="/assets/cg-badge-logo.svg" alt="" style={{ width:14, height:14 }} />
              costgraph.ai
            </span>
            <span className={styles.tag}>2026</span>
          </div>
        </div></FadeItem>

        {/* Intro */}
        <FadeItem><section id="intro" data-section="Intro" ref={reg('Intro')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Intro</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Cloud cost tools give you too much data and not enough direction. That is the problem CostGraph exists to fix.</p>
            <p>I joined in 2025 as the sole product designer, working directly with engineering to build the platform from the ground up. Everything from UX strategy and the design system to interactive prototypes running on real infrastructure data.</p>
            <p>The focus was always the same: show teams what actually needs attention, not everything that could possibly be monitored.</p>
          </div>
        </section></FadeItem>

        {/* My role */}
        <FadeItem><section id="my-role" data-section="My role" ref={reg('My role')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>My role</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>I owned the full product experience, from zero.</p>
            <ul className={styles.list}>
              <li>Product strategy and UX direction</li>
              <li>User research synthesis</li>
              <li>Information architecture</li>
              <li>Design system</li>
              <li>High-fidelity UI design</li>
              <li>Interactive prototyping</li>
              <li>Design-engineering collaboration</li>
            </ul>
            <p>All design work was done against real backend exports and infrastructure datasets, not placeholder content.</p>
          </div>
        </section></FadeItem>

        {/* Process */}
        <FadeItem><section id="process" data-section="Process" ref={reg('Process')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Process</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>We started with interviews. DevOps and platform engineers told us what their current tools got wrong, what information they actually looked at, and what they mostly ignored. Those conversations shaped the product direction more than any competitive audit.</p>
            <p>From there I used Claude and v0 to move fast through concept exploration. Layouts, interaction flows, visualisation approaches. The goal was to test ideas before committing to them, not to produce polished mockups quickly.</p>
            <p>Once concepts felt solid, I built interactive prototypes against real data. That is where the navigation structure, recommendation logic, and workflow decisions got validated. Figma came later, for refinement.</p>
            <p>The final phase was about tightening everything. Hierarchy, consistency, interaction states, and preparing flows for implementation.</p>
          </div>
        </section></FadeItem>

        {/* Design system */}
        <FadeItem><section id="design-system" data-section="Design system" ref={reg('Design system')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Design system</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Dense technical interfaces go wrong when visual decisions are made ad hoc. I built the CostGraph design system from scratch so that every component, state, and spacing decision had a deliberate answer.</p>
            <p>Colour is semantic throughout. Warnings, inefficiencies, healthy resources, each has a distinct visual treatment. Not decoration, just signal.</p>
            <p>The system covers the full token set, component library, spacing rules, table patterns, recommendation cards, and interaction states across the platform.</p>
          </div>
        </section></FadeItem>

        {/* GraphAI */}
        <FadeItem><section id="graphai" data-section="GraphAI" ref={reg('GraphAI')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>GraphAI</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Most AI features in product tools live on a separate page. You go there, ask something, come back. The context is lost.</p>
            <p>GraphAI is designed differently. It stays accessible throughout the platform, and the prompts shift based on what the user is currently looking at. Infrastructure insights, anomalies, recommendations. All reachable without breaking the workflow.</p>
            <p>It does not announce itself. It is just there when you need it.</p>
          </div>
        </section></FadeItem>

        {/* Lessons */}
        <FadeItem><section id="lessons" data-section="Lessons" ref={reg('Lessons')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Lessons</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Clarity beats volume. Infrastructure teams already have access to every metric. What they do not have is a clear answer to "what do I fix first." That is the actual design problem.</p>
            <p>Working against real backend schemas changed how I made decisions. When the data is real, you stop designing for hypothetical states and start designing for what actually happens. The product got better because of it.</p>
          </div>
        </section></FadeItem>

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
                <span>5 min</span>
                <span className={styles.dot} />
                <span>2026</span>
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
