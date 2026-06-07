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
const VECTOR   = 'https://www.figma.com/api/mcp/asset/1e5ebaee-dd28-464b-a549-30a8497fd6f5'
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
  const sectionRefs = useRef({})

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
                <img src={VECTOR} alt="" style={{ objectFit:'contain', padding:3, width:'100%', height:'100%' }} />
              </div>
              <span className={styles.crumbMuted}>Home</span>
              <span className={styles.crumbMuted}>/</span>
              <span className={styles.crumbActive}>Fundify</span>
              {ARROW}
            </div>
          </div>
        </div>
        , document.body)}

        {/* Hero */}
        <FadeItem><div className={styles.hero}>
          <div className={`${imgStyles.heroImg} ${heroCollapsed ? styles.heroImgMini : ''}`}>
            {/* Fundify logo centred */}
            <img src={VECTOR} alt=""
              style={{ position:'absolute', width:300, left:'50%', top:24, transform:'translateX(-50%)', pointerEvents:'none' }} />
            {/* Left phone */}
            <img src={PHONE_L} alt=""
              style={{ position:'absolute', width:148, left:60, top:130, objectFit:'cover', objectPosition:'top', pointerEvents:'none' }} />
            {/* Center phone — prominent */}
            <img src={PHONE_C} alt=""
              style={{ position:'absolute', width:178, left:'50%', top:95, transform:'translateX(-50%)', objectFit:'cover', objectPosition:'top', pointerEvents:'none' }} />
            {/* Right phone */}
            <img src={PHONE_R} alt=""
              style={{ position:'absolute', width:148, right:60, top:140, objectFit:'cover', objectPosition:'top', pointerEvents:'none' }} />
          </div>
          <div className={styles.heroTags}>
            <span className={styles.tag} style={{ gap:6, display:'inline-flex', alignItems:'center' }}>
              <img src={VECTOR} alt="" style={{ width:14, height:14, objectFit:'contain' }} />
              Fundify
            </span>
            <span className={styles.tag}>2025</span>
          </div>
        </div></FadeItem>

        {/* Intro */}
        <FadeItem><section id="intro" data-section="Intro" ref={reg('Intro')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Intro</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Most people know they should save. They just do not. The app they downloaded three months ago sits unopened because it made saving feel like a chore.</p>
            <p>Fundify is a mobile finance app built on a different premise: money management should feel like progress, not punishment. I designed it to reward the behaviours that actually build financial health — saving, transferring, hitting targets — through a points system called FundCoins.</p>
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

            <ImgBlock>
              <img src={PHONE_C} alt=""
                style={{ position:'absolute', height:'110%', left:'50%', top:0, transform:'translateX(-50%)', objectFit:'cover', objectPosition:'top', pointerEvents:'none' }} />
            </ImgBlock>

            <p>That design reflects a fundamental misread of user behaviour. People disengage when tools make them feel bad. They stay when the tool makes them feel like they are winning.</p>
            <p>The goal was to build the opposite of a budget tracker. Not a tool that catches you failing — a tool that rewards you for doing the right thing.</p>
          </div>
        </section></FadeItem>

        {/* Design */}
        <FadeItem><section id="design" data-section="Design" ref={reg('Design')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Design</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>The visual language is deliberately premium and dark. Black backgrounds, gold tones, clean typography. Finance should feel like it has weight. Most finance apps look like productivity tools — Fundify looks like something you want to open.</p>

            <ImgBlock>
              <img src={PHONE_L} alt=""
                style={{ position:'absolute', width:'45%', left:30, top:0, objectFit:'cover', objectPosition:'top', pointerEvents:'none' }} />
              <img src={PHONE_R} alt=""
                style={{ position:'absolute', width:'45%', right:30, top:20, objectFit:'cover', objectPosition:'top', pointerEvents:'none' }} />
            </ImgBlock>

            <p>The core screens are the wallet (total balance, top up, transfer), the rewards hub (FundCoins points, redemption catalogue), and the activity feed (transactions, milestones). Navigation is minimal. Every tap is intentional.</p>
            <p>I also designed Travel Vouchers as one of the first redemption categories — a tangible, high-desire reward that gives users a clear reason to accumulate points.</p>
          </div>
        </section></FadeItem>

        {/* FundCoins */}
        <FadeItem><section id="fundcoins" data-section="FundCoins" ref={reg('FundCoins')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>FundCoins</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>FundCoins are the engine of the product. Every positive financial action earns points — saving a set amount, completing a transfer, hitting a weekly target. Points accumulate and convert to real rewards.</p>

            <ImgBlock>
              <img src={PHONE_C} alt=""
                style={{ position:'absolute', width:'50%', left:'50%', top:0, transform:'translateX(-50%)', objectFit:'cover', objectPosition:'center', pointerEvents:'none' }} />
            </ImgBlock>

            <p>The design challenge was making FundCoins feel real without feeling gimmicky. The gold coin icon, the points balance displayed prominently, the rewards catalogue with actual items — each decision pushes it toward something that feels earned rather than cheap.</p>
            <p>179,000 points. A user who sees that number does not feel like they are being tracked. They feel like they are getting somewhere.</p>
          </div>
        </section></FadeItem>

        {/* Lessons */}
        <FadeItem><section id="lessons" data-section="Lessons" ref={reg('Lessons')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Lessons</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Positive reinforcement is a design tool. It is not just a UX nicety — it changes the product category. Fundify does not compete with Monzo or Revolut. It competes with the version of those apps that people actually open.</p>
            <p>The visual identity did more work than I expected. The dark premium aesthetic set expectations before users read a single word. Tone communicates value before content does.</p>
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
