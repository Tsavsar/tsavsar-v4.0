import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import CaseStudyLayout, { FadeItem } from '../components/CaseStudyLayout'
import ScrambleText from '../components/ScrambleText'
import { useScrollY } from '../hooks/useScrollY'
import styles from './CostGraphPage.module.css'
import imgStyles from './LuotainPage.module.css'

const SECTIONS = ['Intro', 'My role', 'Problem', 'Solution', 'Features']

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
                style={{ background: '#fff' }}>
                <img src="/assets/luotain/luotain-icon.svg" alt="" style={{ objectFit:'contain', padding:5 }} />
                
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
            <a href="https://luotain.app" target="_blank" rel="noopener" className={imgStyles.tagLink}>
              <img src="/assets/luotain/luotain-icon.svg" alt="" style={{ width:14, height:14, objectFit:'contain' }} />
              luotain.app
            </a>
            <span className={styles.tag}>2026</span>
          </div>
        </div></FadeItem>

        {/* Intro */}
        <FadeItem><section id="intro" data-section="Intro" ref={reg('Intro')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Intro</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>If I had a nickel for every one of my projects that starts with an L, I'd have two nickels. Which isn't a lot, but it's weird that it happened twice.</p>
            <p>Anyway, short links and qr code sites are treated as internet waste, you've 100% used one of these types of sites at least once and I'm very sure you don't remember what it was called.</p>
            <p>Of course you have the "bitly"s but we're not talking about those guys right now lol.</p>
            <p>Anyway, it's called Luotain which is a Finnish noun meaning "probe" or "detector". I know I know, really cool name, thanks thanks.</p>
          </div>
        </section></FadeItem>

        {/* My role */}
        <FadeItem><section id="my-role" data-section="My role" ref={reg('My role')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>My role</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>I worked on this end to end which was a lot but to list it all out;</p>
            <ul className={styles.list}>
              <li>Product strategy and UX direction</li>
              <li>Front end and back end engineering</li>
              <li>Social media accounts management and creating designs</li>
              <li>User research synthesis</li>
              <li>Information architecture</li>
              <li>Design systems</li>
              <li>High-fidelity UI design</li>
              <li>Interactive prototyping</li>
              <li>Design-engineering</li>
            </ul>
          </div>
        </section></FadeItem>

        {/* Problem */}
        <FadeItem><section id="problem" data-section="Problem" ref={reg('Problem')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Problem</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p>You know those QR codes on restaurant tables. A place near me printed a few hundred of them for a new menu, then moved the menu to a different URL a month later, and every single card was dead. The code still scanned fine. It just went nowhere.</p>
            <p>That stuck with me because it's such an easy thing to fix and nobody does. Every shortener I looked at treats QR codes like an afterthought. You make a link, then there's a button buried somewhere that hands you a PNG, and that PNG has no analytics and no way to change where it goes. So if you've stuck the same code on a flyer, a window and a receipt, you've got no idea which one people are actually scanning.</p>
            <p>So that's what I built. Every link gets a code, the code has its own scan data, and you can change the destination whenever you want. Print it once, point it wherever.</p>
          </div>
        </section></FadeItem>

        {/* Solution */}
        <FadeItem><section id="solution" data-section="Solution" ref={reg('Solution')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Solution</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p className={imgStyles.subhead}>You can just use it</p>
            <p>The homepage isn't a screenshot of the app, it's the app. Paste a link in, get a real short link back. Flip to the QR tab and you get a real code you can restyle and download. No signup, nothing.</p>
            <ImgBlock src="/assets/luotain/shot-1736.png" />
            <p>I did that because explaining this product in a paragraph never worked. Ten seconds of using it does the job instantly, so I stopped writing copy and just put the thing on the page.</p>
            <p>The bit I'm actually pleased with is that the links follow you. If you make one on the homepage and then sign up in the same browser, it's already sitting in your account when you land, clicks and everything. Getting that wrong would have been rough. You try the product, you like it, you sign up, and the thing you just made is gone.</p>
            <p className={imgStyles.subhead}>Making a link and making a code are the same screen</p>
            <ImgBlock />
            <p>There's a toggle up top, Short link or QR code. It looks like it switches modes but it doesn't. Both do exactly the same thing, the toggle just decides where you end up afterwards.</p>
            <p>I had it the other way at first, where the fields changed depending on what you picked, and it felt like two different tools sharing a screen. Nothing moves now.</p>
            <p>The QR side does one extra thing. Most of the time a code is for something you already made, like a sticker for a menu you linked last week, so there's a picker for your existing links sitting right there.</p>
          </div>
        </section></FadeItem>

        {/* Features */}
        <FadeItem><section id="features" data-section="Features" ref={reg('Features')} className={styles.section}>
          <p className={styles.sectionLabel}><ScrambleText duration={600}>Features</ScrambleText></p>
          <div className={styles.sectionBody}>
            <p className={imgStyles.subhead}>The designer</p>
            <ImgBlock />
            <p>Colours, patterns, your logo in the middle. The corner squares get their own colour separately, which is the bit most people want, because you can brand those without touching the rest and breaking the scan.</p>
            <p>Tap the code and it opens bigger and tilts toward your cursor. It lags behind the pointer slightly rather than following it exactly, and honestly that lag is the whole effect. When I had it tracking perfectly it felt twitchy and cheap.</p>
            <ImgBlock />
            <p>Downloads are PNG or SVG, and the PNG comes out at 1024 with a white background. Transparency sounds like the nicer option right up until somebody drops the code onto a dark card, it inverts, and no phone can read it.</p>
            <p className={imgStyles.subhead}>Which one worked</p>
            <ImgBlock />
            <p>Four hundred clicks doesn't tell you anything. What you want to know is which of your five placements got them. So nothing is summed, it's all split by source, country and device.</p>
            <ImgBlock src="/assets/luotain/shot-1806.png" />
            <p>The nice side effect is this works in places you can't put a script. Someone else's newsletter, a printed flyer, a DM. Analytics tags only work on pages you own, and a link works anywhere.</p>
            <p className={imgStyles.subhead}>Comparing links side by side</p>
            <ImgBlock />
            <p>This one's my favourite and it's easy to miss. On the clicks chart you can tap two or three links and it splits them out instead of showing you the total.</p>
            <p>That's the whole point of the product really. If you've put the same thing on a flyer and in a newsletter, the number you want isn't 400 clicks, it's 240 from the flyer and 160 from the newsletter. Summing them throws away the only interesting part.</p>
            <p>The rows animate to their new positions when the order changes rather than jumping, which took longer than the comparison itself. When you toggle a filter and the ranking shifts, rows sliding to where they belong reads as the data updating. Rows teleporting reads as a bug.</p>
            <p className={imgStyles.subhead}>Bringing people in</p>
            <ImgBlock />
            <p>You can invite people, and there are three roles. Owner, admin, member. Members can make links and read analytics, admins can also touch domains and billing, and there's one owner who can delete the whole workspace.</p>
            <p>The bit I put effort into is the invite form. Most products make you invite one person, wait, then do it again. This one is a list you can keep adding rows to, each with its own email and role, because you're usually onboarding a team rather than a person.</p>
            <p>Pressing enter on the last row adds another one, so you can invite five people without touching the mouse. Pending invites sit in the same list as actual members with their role showing, and you can cancel one if you got the email wrong.</p>
            <p className={imgStyles.subhead}>Custom domains</p>
            <ImgBlock />
            <p>This screen is boring and I'm weirdly proud of it. It has to teach DNS to someone who's never touched DNS, and get it right, because the record you need depends on the shape of your domain. go.yourbrand.com takes one kind, yourbrand.link takes another, and DNS flat out won't let you use the first kind at a root domain. So the page works out which you gave it and only shows you that one.</p>
            <ImgBlock />
            <p>It checks in the background while you're waiting and stops when you switch tabs. And when it fails it tells you what went wrong instead of just going red.</p>
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
          <a className={styles.articleItem} href="#">
            <div className={styles.articleThumb}>
              <img src="/assets/article-vicariously/thumbnail.png" alt="" />
            </div>
            <div className={styles.articleBody}>
              <div className={styles.articleTitleRow}>
                <span className={styles.articleTitle}>Exploring the depths of character development</span>
                {ARROW}
              </div>
              <p className={styles.articleExcerpt}>Understanding the impact of backstories on audience engagement.</p>
              <div className={styles.articleMeta}>
                <span>4 min</span><span className={styles.dot} /><span>2026</span>
              </div>
            </div>
          </a>
          <a className={styles.articleItem} href="#">
            <div className={styles.articleThumb}>
              <img src="/assets/article-vicariously/thumbnail.png" alt="" />
            </div>
            <div className={styles.articleBody}>
              <div className={styles.articleTitleRow}>
                <span className={styles.articleTitle}>The role of cinematography in storytelling</span>
                {ARROW}
              </div>
              <p className={styles.articleExcerpt}>How visual elements shape our emotional responses to film.</p>
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
