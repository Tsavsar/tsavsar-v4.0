import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { useScrollY } from '../hooks/useScrollY'
import styles from './ArticleVicariouslyPage.module.css'

export default function ArticleVicariouslyPage() {
  const scrollY = useScrollY()
  const heroCollapsed = scrollY > 220

  useEffect(() => {
    document.title = 'Vicariously living through the main character — Shater Tsavsar'
    window.scrollTo(0, 0)
    return () => {
      document.title = 'Shater Tsavsar - Systemic Native'
    }
  }, [])

  return (
    <>
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
              <div
                className={`${styles.breadcrumbThumb} ${heroCollapsed ? styles.breadcrumbThumbVisible : ''}`}
                style={{ background: 'linear-gradient(180deg, #fdcc3d 0%, #fddc7c 100%)' }}
              />
              <span className={styles.crumbMuted}>Home</span>
              <span className={styles.crumbMuted}>/</span>
              <span className={styles.crumbActive}>Vicariously living through the main character</span>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className={styles.page}>
        <div className={styles.content}>

          {/* Header image */}
          <div className={styles.heroWrap}>
            <div className={styles.hero}>
              <img className={`${styles.heroOverlay} ${styles.heroOverlayA}`} src="/assets/article-vicariously/overlay1.png" alt="" />
              <img className={`${styles.heroOverlay} ${styles.heroOverlayB}`} src="/assets/article-vicariously/overlay2.png" alt="" />
              <img className={`${styles.heroOverlay} ${styles.heroOverlayC}`} src="/assets/article-vicariously/overlay3.png" alt="" />
              <img className={`${styles.heroOverlay} ${styles.heroOverlayD}`} src="/assets/article-vicariously/overlay4.png" alt="" />
              <img className={styles.heroMain} src="/assets/article-vicariously/main.png" alt="Vicariously living through the main character" />
            </div>

            <div className={styles.heroMeta}>
              <p className={styles.heroTitle}>Vicariously living through the main character</p>
              <div className={styles.tags}>
                <span className={styles.tag}>5 minute read</span>
                <span className={styles.tag}>2026</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className={styles.body}>
            <p>I was watching 500 Days of Summer when I decided to write this. You should probably watch it, alongside some of the other movies mentioned here.</p>

            <p>I've always been curious why certain movies become people's favourites. Not from a critical standpoint, but from a personal one. Sometimes a movie connects with you because a character feels real enough to exist outside the screen.</p>

            <p>With a movies like (500) days of Summer, Nick and Norah's infinite playlist, Scott Pilgrim vs. the World and so on, there's a character that feels real enough to connect with beyond just the cinematic world they live in. That's where the title comes from, Vicariously living through the main character.</p>

            <p>This might sound stupid cause yeah you are the main character in your story but are you really living the plot you want to? I loved Project Hail Mary, but I'm not going to space, it's too far, literally space is too far, but also the idea is too far removed from my life that I can't put myself in Grace's shoes. On the other hand of the spectrum we have Scott Pilgrim vs. the World, the story feels like it would play out the same if I substituted myself with Scott, more or less I guess, but it's a character that I see myself being, in a plot I see myself playing out.</p>

            <p>And this is where the attachment to certain movies comes in, it becomes a form of escapism, might not be the healthiest but I believe it gives something that would be harder to find in other places which is Perspective, I get to see a possible outcome in a situation I could find myself in, it's like an analogy, Grace in Project Hail Mary and Nick in Nick and Norah's Infinite playlist had to make the same choice they're both initially cynical and deeply insecure men who choose to step out of their comfort zones, embrace unexpected partnerships, and ultimately prioritise saving a friend over their own personal safety.</p>

            <p>Crazy as it might sound, not crazy at all if you've been following the dialogue, I'm far more attached to the choice Nick made than Grace's choice.</p>

            <p>We can subconsciously end up building ourselves out based on the characters we've been exposed to. I wasn't into playing the bass guitar when I was younger, I played acoustic, and my farthest memory of the bass is from Scott Pilgrim, same for The Smiths, prior to seeing (500) days of Summer, The Cure before I saw Sing Street and so on. We as human beings are so impressionable we don't even realise it, almost everything we do or have done was influenced by some form of connection or lack of connection in the past.</p>

            <p>When I first watched It's Kind Of A Funny Story, I was through the roof, I read the book first but in every scene I could see myself in Craig, the decisions he made, both good or bad all felt very "Me" y'know? It doesn't even have to be a happy go lucky movie right, another movie, HER, Theodore although being an extreme was another instance of "I can see myself making these decisions" and in this case you get to learn consequences through another person's actions.</p>

            <p>Safe to say when I'm asked "What's your favourite movie?" It's hard to pick between what was just a fun watch vs what actually spoke to me more on a deep level, there's room for both, people usually feel you have to pick one of the two. I think you can love a movie for being a fun-no-lessons-learnt experience as well as loving another for being a deep black and white think piece about the political and economic state of the world right now.</p>

            <p>It doesn't take anything away from us to acknowledge it, you don't instantly lose cool points or become less interesting, we are meant to be impressionable that's the whole point of the human experience.</p>

            <p>I guess all I'm trying to say here is movies like these make us feel better when they're closer to home, we get to live out plots, learn from experiences, and express ourselves without having to actually live those moments ourselves.</p>

            <p>Ending off with this, there will always be a huge factor to consider when comparing yourself to any image of yourself, you exist outside of fiction, and maybe that's what matters most and maybe that's why these movies stay with us.</p>

            <p>Not because we wanted to literally become those characters, but because for two hours they helped us understand parts of ourselves we didn't fully know how to explain yet.</p>
          </div>

          <Footer />
        </div>
      </div>
    </>
  )
}
