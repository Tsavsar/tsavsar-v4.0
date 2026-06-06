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
            <div className={`${styles.breadcrumbThumb} ${heroCollapsed ? styles.breadcrumbThumbVisible : ''}`}
              style={{ background: 'linear-gradient(201deg,rgb(251,77,0) 3%,rgb(244,3,131) 96%)' }}>
              <img src="https://www.figma.com/api/mcp/asset/37c8431b-9aba-43d6-8ef9-e628d5258d3f" alt="" style={{ objectFit:'contain', padding:2 }} />
            </div>
            <div className={styles.crumbs}>
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
            <p>After using multiple invoice generators and invoice platforms, I realised a ton of people didn't have a fixed platform for generating invoices as well as managing them.</p>
            <p>Other platforms exist but some either force you into a larger ecosystem of products or they take you through tiring onboarding to setup your accounts, payments etc etc. The idea was, I want to open up a platform, create an invoice, send it out and track the payments all within one platform.</p>
            <p>That was motivation to build this.</p>
          </div>
        </section></FadeItem>

        {/* My role */}
        <FadeItem><section id="my-role" data-section="My role" ref={reg('My role')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>My role</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>On Lönar I was/am the product lead and co-founder, I worked on,</p>
            <ul className={styles.list}>
              <li>Product strategy and UX direction</li>
              <li>Social media accounts management and creating designs</li>
              <li>User research synthesis</li>
              <li>Information architecture</li>
              <li>Design systems</li>
              <li>High-fidelity UI design</li>
              <li>Interactive prototyping</li>
              <li>Design-engineering collaboration</li>
              <li>Light engineering here and there</li>
            </ul>
          </div>
        </section></FadeItem>

        {/* Solution */}
        <FadeItem><section id="solution" data-section="Solution" ref={reg('Solution')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Solution</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>The solution to the problem mentioned previously was the user comes to the platform, they first off see the invoice generator, then they have the option to save client details on the platform so they don't have to enter them every time.</p>
            <ImgBlock>
              <img src="https://www.figma.com/api/mcp/asset/224f01dd-53c7-414c-a339-7582a7933294" alt=""
                style={{ position:'absolute', width:343, height:292, left:'calc(50% - 91.5px)', top:'calc(50% + 41px)', transform:'translate(-50%,-50%)', objectFit:'cover', borderRadius:6 }} />
              <img src="https://www.figma.com/api/mcp/asset/c786e4f4-e835-4b62-b603-003c0605fb20" alt=""
                style={{ position:'absolute', width:158, height:419, right:0, top:-142, objectFit:'cover' }} />
            </ImgBlock>

            <p>When that is done, they can send the invoice directly to the client's email.</p>
            <ImgBlock>
              <img src="https://www.figma.com/api/mcp/asset/d6e0b35a-fbda-4ebc-970f-e114af912dce" alt=""
                style={{ position:'absolute', width:434, height:370, left:'50%', top:'calc(50% + 35px)', transform:'translate(-50%,-50%)', objectFit:'cover' }} />
            </ImgBlock>

            <p>That's where the creating and sending part ends, now we have the dashboard and the management side of things.</p>
            <ImgBlock>
              <img src="https://www.figma.com/api/mcp/asset/4510881e-c2f5-48e1-9fa5-e1fa148f7ad5" alt=""
                style={{ position:'absolute', width:513, height:321, left:'50%', top:42, transform:'translateX(-50%)', objectFit:'cover' }} />
            </ImgBlock>

            <p>I wanted users to see how much they have made in invoices all time and across the last 90, 60 and 30 days. As well as the number of clients they have and the number of invoices. That way the platform gives more than just "Hey, create an invoice".</p>
            <p>The next thing was managing invoices based on clients, allowing users see all invoices attached to one user. During research I spoke to someone who ran a clothing business and he said he liked to see how much each client has spent.</p>
            <ImgBlock>
              <img src="https://www.figma.com/api/mcp/asset/c5c0a0e6-0556-40be-808e-4183e0d2cdef" alt=""
                style={{ position:'absolute', width:399, height:250, left:-5, top:21, objectFit:'cover' }} />
              <img src="https://www.figma.com/api/mcp/asset/7864944b-8a0c-46ca-a3f3-b4131b9fbbac" alt=""
                style={{ position:'absolute', width:141, height:262, right:0, top:15, objectFit:'cover' }} />
            </ImgBlock>

            <p>A lot of features were created from conversations like that and that is why I feel this is such a strong platform.</p>
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

            <p>Then we have the system we built to allow you track when payments have been received or not. We don't have payments on the platform just yet but we are working towards it. For now we rely on the client letting the user know when they have paid on the email. The system also sends emails to the client when due dates have been passed.</p>
          </div>
        </section></FadeItem>

        {/* Process */}
        <FadeItem><section id="process" data-section="Process" ref={reg('Process')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Process</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>I was heavy on the research side of things.</p>
            <p>Started off first with the questionnaires, got a ton of responses that showed that there really was a gap when it came to how people send out invoices to clients.</p>
            <p>From the responses I put together a user flow diagram, ran it by a couple of people and potential users, got corrections in some areas before going ahead to work on the UI.</p>
            <p>Did some more validation while the UI was in the high fidelity mode, then put together some prototypes. By this point the app had users since we put out the invoice generator first, so we got revision requests directly from the users.</p>
            <ImgBlock>
              <img src="https://www.figma.com/api/mcp/asset/b4d3c79b-f65a-4f4e-a89c-13c96dbc005a" alt=""
                style={{ position:'absolute', width:514, height:321, left:'50%', top:'calc(50% + 46.5px)', transform:'translate(-50%,-50%)', objectFit:'cover', borderRadius:14 }} />
            </ImgBlock>
            <p>Next we polished everything — APIs, the pro plan, account creation and management and download/export features as well.</p>
          </div>
        </section></FadeItem>

        {/* Lessons */}
        <FadeItem><section id="lessons" data-section="Lessons" ref={reg('Lessons')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Lessons</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>Working on this project emphasised the importance of always being ready to reiterate and make changes on the fly because users expect their issues to be solved almost as fast as they came up.</p>
            <p>Also pushed me to step into a more design engineering role and not just focus entirely on the design side of things.</p>
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
