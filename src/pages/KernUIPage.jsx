import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import CaseStudyLayout, { FadeItem } from '../components/CaseStudyLayout'
import ScrambleText from '../components/ScrambleText'
import { useScrollY } from '../hooks/useScrollY'
import styles from './CostGraphPage.module.css'
import imgStyles from './KernUIPage.module.css'

const SECTIONS = ['Intro', 'My role', 'Problem', 'System', 'Impact', 'Lessons']

const ARROW = (
  <svg viewBox="0 0 11.05 8.25" fill="none" style={{ width: 14, height: 14, flexShrink: 0 }}>
    <path d="M10.425 3.425H2.725C1.5651 3.425 0.625 4.3651 0.625 5.525V7.625" stroke="#5C5C5C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.625 6.225L10.425 3.425L7.625 0.625" stroke="#5C5C5C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function VideoBlock() {
  return (
    <div className={imgStyles.videoBlock}>
      <video
        src="/assets/kernuivideo.mp4"
        autoPlay
        loop
        muted
        playsInline
        className={imgStyles.video}
      />
    </div>
  )
}

function ImgBlock({ children, height }) {
  return <div className={imgStyles.imgBlock} style={height ? { height } : {}}>{children}</div>
}

export default function KernUIPage() {
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
                style={{ background: 'linear-gradient(135deg, #7d52f4 0%, #5b2fe8 100%)' }}>
                <img src="/assets/kern-logo.svg" alt="" style={{ objectFit:'contain', padding:5, width:'100%', height:'100%', filter:'brightness(10)' }} />
              </div>
              <span className={styles.crumbMuted}>Home</span>
              <span className={styles.crumbMuted}>/</span>
              <span className={styles.crumbActive}>KernUI</span>
              {ARROW}
            </div>
          </div>
        </div>
        , document.body)}

        {/* Hero */}
        <FadeItem><div className={styles.hero}>
          <div className={`${imgStyles.heroImg} ${heroCollapsed ? styles.heroImgMini : ''}`}>
            {/* Component grid assets from project card */}
            <img src="https://www.figma.com/api/mcp/asset/157fe76d-8a66-47a9-a9e9-3a287170d4d8" alt=""
              style={{ position:'absolute', width:214, height:298, right:19, bottom:-6, pointerEvents:'none', objectFit:'cover' }} />
            <img src="https://www.figma.com/api/mcp/asset/eb20f63a-67fb-4ebe-95c2-166f2ebc0cb3" alt=""
              style={{ position:'absolute', width:210, height:192, left:0, top:40, transform:'rotate(19.17deg)', objectFit:'cover', pointerEvents:'none' }} />
            <img src="https://www.figma.com/api/mcp/asset/277565a6-9c8f-4b73-bd7a-ade04411fb61" alt=""
              style={{ position:'absolute', width:184, height:176, left:'50%', top:'50%', transform:'translate(-50%,-50%) rotate(28.07deg)', objectFit:'cover', pointerEvents:'none' }} />
            <img src="https://www.figma.com/api/mcp/asset/ac90efec-3d17-4a41-af04-e96ac83437fb" alt=""
              style={{ position:'absolute', width:188, height:165, left:20, bottom:10, transform:'rotate(8.02deg)', objectFit:'cover', pointerEvents:'none' }} />
          </div>
          <div className={styles.heroTags}>
            <a href="https://www.kernui.com" target="_blank" rel="noopener" className={imgStyles.tagLink}>
              <img src="/assets/kern-logo.svg" alt="" style={{ width:14, height:14, objectFit:'contain' }} />
              kernui.com
            </a>
            <span className={styles.tag}>2024</span>
          </div>
        </div></FadeItem>

        {/* Intro */}
        <FadeItem><section id="intro" data-section="Intro" ref={reg('Intro')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Intro</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Most design systems get abandoned. Not because teams do not want one, but because they are too brittle, too generic, or too expensive to maintain. KernUI is built around the opposite of that.</p>
            <p>I designed KernUI as a production-ready UI kit for product teams — over 3,000 components, built-in light and dark theming, 1,600+ icons, and a token system that actually scales. It is trusted by more than 1,200 designers and developers.</p>
          </div>
        </section></FadeItem>

        {/* My role */}
        <FadeItem><section id="my-role" data-section="My role" ref={reg('My role')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>My role</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Solo designer and founder.</p>
            <ul className={styles.list}>
              <li>Design system architecture</li>
              <li>Component design and documentation</li>
              <li>Token system and theming</li>
              <li>Icon library (1,600+)</li>
              <li>Brand and marketing design</li>
              <li>Pricing and product strategy</li>
              <li>Community and education content</li>
            </ul>
          </div>
        </section></FadeItem>

        {/* Problem */}
        <FadeItem><section id="problem" data-section="Problem" ref={reg('Problem')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Problem</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Teams waste hours rebuilding the same buttons, form fields, and navigation patterns from scratch. The problem is not effort — it is repetition. Every new project resets the work.</p>

            <ImgBlock height={340}>
              <img src="/assets/kern-feature-1.svg" alt="Production ready components"
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }} />
            </ImgBlock>

            <p>Existing UI kits either go too generic (every interface looks the same) or too rigid (you cannot adapt them to a real product). The handoff between design and development breaks down because the kit does not speak both languages.</p>
            <p>KernUI was built to close that gap. Flexible enough to fit a brand. Structured enough to hand off cleanly.</p>
          </div>
        </section></FadeItem>

        {/* System */}
        <FadeItem><section id="system" data-section="System" ref={reg('System')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>System</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>The foundation is a token system. Colours, spacing, typography, and radius values are all defined as variables — not hard-coded. Swapping a theme from light to dark does not require touching individual components.</p>

            <VideoBlock />

            <p>Components are built in layers. Atoms (buttons, inputs, badges) compose into molecules (cards, modals, nav bars), which compose into templates. Every state is designed: default, hover, focus, error, disabled. Nothing is left for developers to guess.</p>

            <ImgBlock height={340}>
              <img src="/assets/kern-feature-6.svg" alt="Light and dark mode components"
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }} />
            </ImgBlock>

            <p>The icon library sits at 1,600+ and is organised by category. Every icon has a consistent 24px grid, two weight variants, and is exported as both SVG and component-ready format.</p>

            <ImgBlock height={300}>
              <img src="/assets/kern-feature-4.svg" alt="Over 1600 themed icons"
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }} />
            </ImgBlock>

            <p>The avatar system ships with hundreds of diverse, illustrated and photographic options. Everything from custom illustrations to real-photo avatars, all on a consistent circular grid.</p>

            <ImgBlock height={300}>
              <img src="/assets/kern-feature-3.svg" alt="Avatars and custom illustrations"
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }} />
            </ImgBlock>

            <p>There are three tiers. Free covers the palette, typography, icons, and logo/flag sets. Startup ($99) unlocks the full variable system, pre-built components, and regular updates. Enterprise is custom — dedicated support, team training, and bespoke design work.</p>
          </div>
        </section></FadeItem>

        {/* Impact */}
        <FadeItem><section id="impact" data-section="Impact" ref={reg('Impact')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Impact</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Over 1,200 designers and developers use KernUI. The feedback that comes up most: it reduces the back-and-forth between design and development. Teams spend less time arguing about spacing and more time shipping.</p>

            <ImgBlock height={340}>
              <img src="/assets/kern-feature-5.svg" alt="KernUI design system"
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'top' }} />
            </ImgBlock>

            <p>The freemium model was deliberate. Giving the palette and icons away for free meant people could evaluate the system before committing. Conversion from free to Startup followed naturally once they hit the limits of what free covered.</p>
          </div>
        </section></FadeItem>

        {/* Lessons */}
        <FadeItem><section id="lessons" data-section="Lessons" ref={reg('Lessons')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Lessons</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Documentation is half the product. A component without clear usage guidance gets misused or ignored. The time spent writing docs paid back in fewer support questions and faster onboarding.</p>
            <p>A design system is never finished. The ones that get abandoned are the ones that try to be complete before launching. KernUI shipped incomplete and iterated based on what users actually needed. That is still the right call.</p>
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
