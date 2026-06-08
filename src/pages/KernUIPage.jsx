import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import CaseStudyLayout, { FadeItem } from '../components/CaseStudyLayout'
import ScrambleText from '../components/ScrambleText'
import { useScrollY } from '../hooks/useScrollY'
import styles from './CostGraphPage.module.css'
import imgStyles from './KernUIPage.module.css'
import ButtonDemo from '../components/ButtonDemo'
import AlertDemo from '../components/AlertDemo'
import AvatarDemo from '../components/AvatarDemo'
import RadioCardDemo from '../components/RadioCardDemo'
import RichTextEditorDemo from '../components/RichTextEditorDemo'

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
  const [copied, setCopied] = useState(false)
  const sectionRefs = useRef({})

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    document.title = 'KernUI — Shater Tsavsar'
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', 'KernUI — Shater Tsavsar')
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', '/assets/kernui-cover.png')
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
                style={{ background: 'linear-gradient(135deg, #7d52f4 0%, #5b2fe8 100%)' }}>
                <img src="/assets/kern-icon.svg" alt="" style={{ objectFit:'contain', width:'100%', height:'100%', borderRadius:6 }} />
              </div>
              <span className={styles.crumbMuted}>Home</span>
              <span className={styles.crumbMuted}>/</span>
              <span className={styles.crumbActive}>KernUI</span>
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
            {/* Background "U" vector */}
            <img src="https://www.figma.com/api/mcp/asset/5f13c420-29f1-4620-9b83-961535503e0d" alt=""
              style={{ position:'absolute', width:283, height:394, right:44, bottom:-111, pointerEvents:'none' }} />
            {/* Small vector top-right */}
            <img src="https://www.figma.com/api/mcp/asset/d2b1484e-378f-46e4-94ac-a4d26b8748ac" alt=""
              style={{ position:'absolute', width:42, height:59, left:'calc(50% + 262px)', top:'calc(50% - 95.5px)', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
            {/* Image — rotated 19.17deg */}
            <img src="https://www.figma.com/api/mcp/asset/e6355090-881b-4e90-a452-1d66063f17e2" alt=""
              style={{ position:'absolute', width:210, height:192, left:74, top:93, transform:'rotate(19.17deg)', objectFit:'cover', pointerEvents:'none' }} />
            {/* Image1 — rotated 7.63deg */}
            <img src="https://www.figma.com/api/mcp/asset/a3a58265-313c-4265-a5e6-de3c207ed0c6" alt=""
              style={{ position:'absolute', width:125, height:265, left:-25, top:55, transform:'rotate(7.63deg)', objectFit:'cover', pointerEvents:'none' }} />
            {/* Dropdown — rotated 28.07deg */}
            <img src="https://www.figma.com/api/mcp/asset/3a83dbac-ba62-4200-9761-4fcfac8c1d8c" alt=""
              style={{ position:'absolute', width:184, height:176, left:230, top:135, transform:'rotate(28.07deg)', objectFit:'cover', pointerEvents:'none' }} />
            {/* Image2 — rotated -19.27deg */}
            <img src="https://www.figma.com/api/mcp/asset/e63a977a-fa47-4d94-822f-2ff485756135" alt=""
              style={{ position:'absolute', width:182, height:50, left:178, top:236, transform:'rotate(-19.27deg)', objectFit:'cover', pointerEvents:'none' }} />
            {/* Image3 — rotated 8.02deg */}
            <img src="https://www.figma.com/api/mcp/asset/f9fc61b6-53d1-4011-bde5-d58d114f472e" alt=""
              style={{ position:'absolute', width:188, height:165, left:63, top:183, transform:'rotate(8.02deg)', objectFit:'cover', pointerEvents:'none' }} />
          </div>
          <div className={styles.heroTags}>
            <a href="https://www.kernui.com" target="_blank" rel="noopener" className={imgStyles.tagLink}>
              <img src="/assets/kern-icon.svg" alt="" style={{ width:14, height:14, objectFit:'contain', borderRadius:6 }} />
              kernui.com
            </a>
            <span className={styles.tag}>2025</span>
          </div>
        </div></FadeItem>

        {/* Figma preview banner */}
        <FadeItem>
          <a
            href="https://www.figma.com/design/rjtGbVAp1klmlQkfUD3O21/%E2%9C%A7-PREVIEW-%E2%9C%A7-KernUI---Design-System-%E2%9C%A7-Pro--v1.0-?node-id=570-21345&p=f&t=qjlnSXoZPVURsTta-0"
            target="_blank"
            rel="noopener"
            className={imgStyles.previewBanner}
          >
            <div className={imgStyles.previewBannerLeft}>
              <span className={imgStyles.previewBannerLabel}>Preview</span>
              <span className={imgStyles.previewBannerTitle}>Open KernUI in Figma</span>
            </div>
          </a>
        </FadeItem>

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

            <p>Existing UI kits either go too generic (every interface looks the same) or too rigid (you cannot adapt them to a real product). The handoff between design and development breaks down because the kit does not speak both languages.</p>
            <p>KernUI was built to close that gap. Flexible enough to fit a brand. Structured enough to hand off cleanly.</p>
          </div>
        </section></FadeItem>

        {/* System */}
        <FadeItem><section id="system" data-section="System" ref={reg('System')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>System</ScrambleText></p>
          <div className={styles.sectionBody}>
            <RadioCardDemo />

            <p>The foundation is a token system. Colours, spacing, typography, and radius values are all defined as variables — not hard-coded. Swapping a theme from light to dark does not require touching individual components.</p>

            <p>Components are built in layers. Atoms (buttons, inputs, badges) compose into molecules (cards, modals, nav bars), which compose into templates. Every state is designed: default, hover, focus, error, disabled. Nothing is left for developers to guess.</p>

            <ButtonDemo />

            <p>The same state logic applies across every component. Alert notifications carry their own variant, colour, size, and visibility controls — all wired to the same token system.</p>

            <AlertDemo />

            <p>The icon library sits at 1,600+ and is organised by category. Every icon has a consistent 24px grid, two weight variants, and is exported as both SVG and component-ready format.</p>

            <p>The avatar system ships with three avatar types — humans, illustrations, and memojis — each with default and colour variants. Every avatar supports top and bottom badge slots for status, notification, and action states.</p>

            <AvatarDemo />

            <RichTextEditorDemo />

            <p>There are three tiers. Free covers the palette, typography, icons, and logo/flag sets. Startup ($99) unlocks the full variable system, pre-built components, and regular updates. Enterprise is custom — dedicated support, team training, and bespoke design work.</p>
          </div>
        </section></FadeItem>

        {/* Impact */}
        <FadeItem><section id="impact" data-section="Impact" ref={reg('Impact')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Impact</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Over 1,200 designers and developers use KernUI. The feedback that comes up most: it reduces the back-and-forth between design and development. Teams spend less time arguing about spacing and more time shipping.</p>

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

        <FadeItem><VideoBlock /></FadeItem>

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
