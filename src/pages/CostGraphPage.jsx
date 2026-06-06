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
            {/* Mini cover in breadcrumb when hero collapses */}
            <div className={`${styles.breadcrumbThumb} ${heroCollapsed ? styles.breadcrumbThumbVisible : ''}`}
              style={{ background: 'linear-gradient(190.846deg,rgb(3,8,18) 8.57%,rgb(10,52,119) 68.68%)' }}>
              <img src="/assets/logo front.png" alt="" style={{ objectFit:'contain', padding:4 }} />
            </div>
            <div className={styles.crumbs}>
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
            <p>I joined CostGraph in 2025, and since then we've gone on to build a cloud cost optimisation platform built for DevOps engineers and platform teams managing infrastructure at scale.</p>
            <p>As the sole product designer on the project, I worked closely with engineering to design the product from the ground up — shaping everything from the UX strategy and design system to interactive prototypes powered by real infrastructure data.</p>
            <p>The project focused heavily on helping teams understand where cloud waste exists and what actions they should take next, instead of overwhelming them with dashboards and metrics.</p>
          </div>
        </section></FadeItem>

        {/* My role */}
        <FadeItem><section id="my-role" data-section="My role" ref={reg('My role')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>My role</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>On CostGraph, I was responsible for the entire product experience from zero.</p>
            <ul className={styles.list}>
              <li>Product strategy and UX direction</li>
              <li>User research synthesis</li>
              <li>Information architecture</li>
              <li>Design systems</li>
              <li>High-fidelity UI design</li>
              <li>Interactive prototyping</li>
              <li>Design-engineering collaboration</li>
            </ul>
            <p>I also worked directly with real backend exports and infrastructure datasets instead of placeholder content.</p>
          </div>
        </section></FadeItem>

        {/* Process */}
        <FadeItem><section id="process" data-section="Process" ref={reg('Process')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Process</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>The process behind CostGraph was very much iterative and research-driven.</p>
            <p>We started with competitive research and user interviews to better understand how DevOps and platform teams currently manage cloud infrastructure, where existing tools fall short, and what information actually matters during day-to-day operations. Those conversations helped validate ideas early and shaped a lot of the product direction.</p>
            <p>From there, we moved quickly into exploration and prototyping. Instead of jumping straight into polished UI, we used tools like Claude and v0 to rapidly test concepts, layouts, interaction flows, and infrastructure visualisation ideas. This made it easier to experiment with different approaches before committing to final designs.</p>
            <p>Once ideas felt strong enough, I built interactive prototypes that could be tested and iterated on collaboratively with engineering and users. These prototypes helped us validate workflows, recommendation systems, and navigation structures early before refining everything further in Figma.</p>
            <p>The final phase focused on polishing the experience, tightening hierarchy, refining interactions, improving consistency through the design system, and preparing flows for user testing and implementation.</p>
          </div>
        </section></FadeItem>

        {/* Design system */}
        <FadeItem><section id="design-system" data-section="Design system" ref={reg('Design system')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Design system</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>I built the CostGraph design system from scratch to support a dense, technical product environment while keeping the interface readable and consistent.</p>
            <p>The visual language was intentionally restrained, using semantic colour systems to communicate operational states like warnings, inefficiencies, and healthy resources.</p>
            <p>I also established the full token system, component library, spacing rules, table patterns, recommendation cards, and interaction states used across the platform.</p>
          </div>
        </section></FadeItem>

        {/* GraphAI */}
        <FadeItem><section id="graphai" data-section="GraphAI" ref={reg('GraphAI')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>GraphAI</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>GraphAI is CostGraph's persistent AI layer integrated directly into the product experience.</p>
            <p>Instead of creating a separate AI page, I designed GraphAI as an ambient assistant that stays accessible throughout the platform. The prompts adapt based on the current context, helping users explore infrastructure insights, recommendations, and anomalies without leaving their workflow.</p>
            <p>The goal was to make AI feel integrated into operations rather than disconnected from them.</p>
          </div>
        </section></FadeItem>

        {/* Lessons */}
        <FadeItem><section id="lessons" data-section="Lessons" ref={reg('Lessons')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Lessons</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>CostGraph taught me a lot about designing for technical users and complex systems.</p>
            <p>One of the biggest lessons was that clarity matters more than volume. Infrastructure teams already have access to endless data — the real challenge is helping them understand what actually needs attention.</p>
            <p>The project also reinforced the value of working closely with engineering early in the process. Because I was designing directly against backend schemas and real infrastructure behaviour, the product decisions became much more grounded and implementation-friendly.</p>
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
