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
  const sectionRefs = useRef({})

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
              {ARROW}
            </div>
          </div>
        </div>
        , document.body)}

        {/* Hero */}
        <FadeItem><div className={styles.hero}>
          <div className={`${styles.heroImg} ${heroCollapsed ? styles.heroImgMini : ""}`}>
            <img src="/assets/cg-dots-bg.png" alt=""
              style={{ position:'absolute', width:155, height:176, left:'calc(50% - 0.5px)', top:'calc(50% + 42px)', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
            <img src="/assets/glass bottom.png" alt=""
              style={{ position:'absolute', width:811, height:791, left:-22, top:12, pointerEvents:'none' }} />
            <img src="/assets/glass top.png" alt=""
              style={{ position:'absolute', width:443, height:423, left:-163, top:-264, pointerEvents:'none' }} />
            <img src="/assets/logo front.png" alt=""
              style={{ position:'absolute', width:46, height:52, left:'50%', top:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
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
          <a className={styles.articleItem} href="/article.html">
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
