import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import CaseStudyLayout, { FadeItem } from '../components/CaseStudyLayout'
import ScrambleText from '../components/ScrambleText'
import { useScrollY } from '../hooks/useScrollY'
import styles from './CostGraphPage.module.css'
import imgStyles from './LonarPage.module.css'

const SECTIONS = ['Intro', 'My role', 'Solution', 'Process', 'Lessons']

const ARROW = (
  <svg viewBox="0 0 11.05 8.25" fill="none" style={{ width: 14, height: 14, flexShrink: 0 }}>
    <path d="M10.425 3.425H2.725C1.5651 3.425 0.625 4.3651 0.625 5.525V7.625" stroke="#5C5C5C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.625 6.225L10.425 3.425L7.625 0.625" stroke="#5C5C5C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Inline image block matching Figma layout
function ImgBlock({ children }) {
  return <div className={imgStyles.imgBlock}>{children}</div>
}

export default function LonarPage() {
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
        <div className={`${styles.breadcrumb} ${scrollY > 10 ? styles.breadcrumbScrolled : ""}`}>
          <div className={styles.breadcrumbInner}>
            <Link to="/" className={styles.backPill}>
              <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
                <path d="M10 4L6 8L10 12" stroke="#5c5c5c" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Back</span>
            </Link>
            <div className={styles.crumbs}>
              <div className={`${styles.breadcrumbThumb} ${heroCollapsed ? styles.breadcrumbThumbVisible : ''}`}
                style={{ background: 'linear-gradient(201deg,rgb(251,77,0) 3%,rgb(244,3,131) 96%)' }}>
                <img src="https://www.figma.com/api/mcp/asset/37c8431b-9aba-43d6-8ef9-e628d5258d3f" alt="" style={{ objectFit:'contain', padding:2 }} />
              </div>
              <span className={styles.crumbMuted}>Home</span>
              <span className={styles.crumbMuted}>/</span>
              <span className={styles.crumbActive}>Lönar</span>
              {ARROW}
            </div>
          </div>
        </div>
        , document.body)}

        {/* Hero */}
        <FadeItem><div className={styles.hero}>
          <div className={`${imgStyles.heroImg} ${heroCollapsed ? styles.heroImgMini : ""}`}>
            {/* Lönar logo centred */}
            <img src="https://www.figma.com/api/mcp/asset/37c8431b-9aba-43d6-8ef9-e628d5258d3f" alt=""
              style={{ position:'absolute', width:237, height:237, left:'calc(50% + 0.5px)', top:'calc(50% + 27.5px)', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
            {/* Dashboard screenshot */}
            <img src="https://www.figma.com/api/mcp/asset/4510881e-c2f5-48e1-9fa5-e1fa148f7ad5" alt=""
              style={{ position:'absolute', width:513, height:321, left:'50%', top:79, transform:'translateX(-50%)', objectFit:'cover', pointerEvents:'none' }} />
          </div>
          <div className={styles.heroTags}>
            <a href="https://lonar.cc" target="_blank" rel="noopener" className={imgStyles.tagLink}>
              <img src="https://www.figma.com/api/mcp/asset/dcb346dd-763a-47fa-bc2c-194e349dbf8d" alt="" style={{ width:14, height:14, objectFit:'contain' }} />
              lonar.cc
            </a>
            <span className={styles.tag}>2026</span>
          </div>
        </div></FadeItem>

        {/* Intro */}
        <FadeItem><section id="intro" data-section="Intro" ref={reg('Intro')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Intro</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Most invoice tools make you choose between simplicity and control. The simple ones do not track anything. The powerful ones bury you in onboarding before you can send a single invoice.</p>
            <p>I wanted to open a platform, create an invoice, send it, and track the payment. All in one place, with no setup friction. That was the whole idea.</p>
          </div>
        </section></FadeItem>

        {/* My role */}
        <FadeItem><section id="my-role" data-section="My role" ref={reg('My role')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>My role</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Co-founder and product lead.</p>
            <ul className={styles.list}>
              <li>Product strategy and UX direction</li>
              <li>User research synthesis</li>
              <li>Information architecture</li>
              <li>Design system</li>
              <li>High-fidelity UI design</li>
              <li>Interactive prototyping</li>
              <li>Design-engineering collaboration</li>
              <li>Social presence and brand design</li>
              <li>Light frontend engineering</li>
            </ul>
          </div>
        </section></FadeItem>

        {/* Solution */}
        <FadeItem><section id="solution" data-section="Solution" ref={reg('Solution')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Solution</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>You land on the platform and the invoice generator is the first thing you see. Client details can be saved so you are not re-entering the same information every time.</p>
            <ImgBlock>
              <img src="https://www.figma.com/api/mcp/asset/224f01dd-53c7-414c-a339-7582a7933294" alt=""
                style={{ position:'absolute', width:343, height:292, left:'calc(50% - 91.5px)', top:'calc(50% + 41px)', transform:'translate(-50%,-50%)', objectFit:'cover', borderRadius:6 }} />
              <img src="https://www.figma.com/api/mcp/asset/c786e4f4-e835-4b62-b603-003c0605fb20" alt=""
                style={{ position:'absolute', width:158, height:419, right:0, top:-142, objectFit:'cover' }} />
            </ImgBlock>

            <p>From there, the invoice goes directly to the client by email.</p>
            <ImgBlock>
              <img src="https://www.figma.com/api/mcp/asset/d6e0b35a-fbda-4ebc-970f-e114af912dce" alt=""
                style={{ position:'absolute', width:434, height:370, left:'50%', top:'calc(50% + 35px)', transform:'translate(-50%,-50%)', objectFit:'cover' }} />
            </ImgBlock>

            <p>That is where creation ends. Then there is the dashboard.</p>
            <ImgBlock>
              <img src="https://www.figma.com/api/mcp/asset/4510881e-c2f5-48e1-9fa5-e1fa148f7ad5" alt=""
                style={{ position:'absolute', width:513, height:321, left:'50%', top:42, transform:'translateX(-50%)', objectFit:'cover' }} />
            </ImgBlock>

            <p>Total earnings, broken down across all time and the last 30, 60, and 90 days. Number of clients, number of invoices. It gives the platform a memory beyond just the last thing you sent.</p>
            <p>Invoices are also grouped by client, so you can see everything attached to one person at once. During research, someone running a clothing business told me he needed to know how much each client had spent in total. That became a core part of how the client view works.</p>
            <ImgBlock>
              <img src="https://www.figma.com/api/mcp/asset/c5c0a0e6-0556-40be-808e-4183e0d2cdef" alt=""
                style={{ position:'absolute', width:399, height:250, left:-5, top:21, objectFit:'cover' }} />
              <img src="https://www.figma.com/api/mcp/asset/7864944b-8a0c-46ca-a3f3-b4131b9fbbac" alt=""
                style={{ position:'absolute', width:141, height:262, right:0, top:15, objectFit:'cover' }} />
            </ImgBlock>

            <p>Most of the features came from conversations exactly like that.</p>
            <ImgBlock>
              <img src="https://www.figma.com/api/mcp/asset/38f61ae1-202e-4e98-a5f1-35c7e7c39c1c" alt=""
                style={{ position:'absolute', width:369, height:315, left:229, top:16, objectFit:'cover' }} />
              <img src="https://www.figma.com/api/mcp/asset/98b68461-3766-4ef3-815d-179399e144e8" alt=""
                style={{ position:'absolute', width:197, height:331, left:22, top:16, objectFit:'cover' }} />
            </ImgBlock>
            <ImgBlock>
              <img src="https://www.figma.com/api/mcp/asset/fe00d965-02c3-4f37-9ed5-82390a3a89d6" alt=""
                style={{ position:'absolute', width:454, height:283, left:'calc(50% - 148px)', top:42, transform:'translateX(-50%)', objectFit:'cover', borderRadius:12 }} />
              <img src="https://www.figma.com/api/mcp/asset/41023870-ac60-4c0f-834e-354f791870d4" alt=""
                style={{ position:'absolute', width:200, height:213, right:0, top:87, objectFit:'cover' }} />
            </ImgBlock>

            <p>Payment tracking works by status. Full payments are not on the platform yet, so for now the flow relies on the client confirming via email. The system sends automatic reminders to clients when due dates pass. It is a lightweight version of something we plan to own fully.</p>
          </div>
        </section></FadeItem>

        {/* Process */}
        <FadeItem><section id="process" data-section="Process" ref={reg('Process')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Process</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Questionnaires came first. The responses confirmed what I suspected: people were stitching together multiple tools to do something that should take one.</p>
            <p>From that I built a user flow, pressure-tested it with potential users, and made corrections before touching the UI. A few assumptions did not survive that round.</p>
            <p>The invoice generator shipped before the full platform. That meant by the time I was deep in high-fidelity design, there were already real users sending feedback. Revision requests came directly from them, not from internal assumptions.</p>
            <ImgBlock>
              <img src="https://www.figma.com/api/mcp/asset/b4d3c79b-f65a-4f4e-a89c-13c96dbc005a" alt=""
                style={{ position:'absolute', width:514, height:321, left:'50%', top:'calc(50% + 46.5px)', transform:'translate(-50%,-50%)', objectFit:'cover', borderRadius:14 }} />
            </ImgBlock>
            <p>The final phase covered APIs, the pro plan, account management, and download and export. Getting the details right after the structure was already proven.</p>
          </div>
        </section></FadeItem>

        {/* Lessons */}
        <FadeItem><section id="lessons" data-section="Lessons" ref={reg('Lessons')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Lessons</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Shipping the generator before the full platform was the right call. It meant real feedback arrived early, when the cost of changing things was still low.</p>
            <p>It also pushed me further into the engineering side. Owning a product end to end means the line between design and implementation gets blurry fast. I stopped treating that as a problem.</p>
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
