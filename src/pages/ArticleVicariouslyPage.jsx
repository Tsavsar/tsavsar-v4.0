import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import styles from './ArticleVicariouslyPage.module.css'

export default function ArticleVicariouslyPage() {
  useEffect(() => {
    document.title = 'Vicariously living through the main character — Shater Tsavsar'
    window.scrollTo(0, 0)
    return () => {
      document.title = 'Shater Tsavsar - Systemic Native'
    }
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Link to="/" className={styles.back}>← back</Link>

        <header className={styles.header}>
          <p className={styles.meta}>5 min · 2026</p>
          <h1 className={styles.title}>Vicariously living through the main character</h1>
          <p className={styles.subtitle}>Why we emotionally attach ourselves to movie characters and the lives they live.</p>
        </header>

        <div className={styles.body}>
          <p>I was watching 500 Days of Summer when I decided to write this. You should probably watch it, alongside some of the other movies mentioned here.</p>

          <p>I've always been curious why certain movies become people's favourites. Not from a critical standpoint, but from a personal one. Sometimes a movie connects with you because a character feels real enough to exist outside the screen.</p>

          <p>With movies like <em>(500) Days of Summer</em>, <em>Nick and Norah's Infinite Playlist</em>, <em>Scott Pilgrim vs. the World</em> and so on, there's a character that feels real enough to connect with beyond just the cinematic world they live in. That's where the title comes from — Vicariously living through the main character.</p>

          <p>This might sound stupid cause yeah you are the main character in your story but are you really living the plot you want to? I loved <em>Project Hail Mary</em>, but I'm not going to space, it's too far, literally space is too far, but also the idea is too far removed from my life that I can't put myself in Grace's shoes. On the other hand of the spectrum we have <em>Scott Pilgrim vs. the World</em>, the story feels like it would play out the same if I substituted myself with Scott, more or less I guess, but it's a character that I see myself being, in a plot I see myself playing out.</p>

          <p>And this is where the attachment to certain movies comes in, it becomes a form of escapism, might not be the healthiest but I believe it gives something that would be harder to find in other places which is Perspective. I get to see a possible outcome in a situation I could find myself in, it's like an analogy — Grace in <em>Project Hail Mary</em> and Nick in <em>Nick and Norah's Infinite Playlist</em> had to make the same choice. They're both initially cynical and deeply insecure men who choose to step out of their comfort zones, embrace unexpected partnerships, and ultimately prioritise saving a friend over their own personal safety.</p>

          <p>Crazy as it might sound, not crazy at all if you've been following the dialogue, I'm far more attached to the choice Nick made than Grace's choice.</p>

          <p>We can subconsciously end up building ourselves out based on the characters we've been exposed to. I wasn't into playing the bass guitar when I was younger, I played acoustic, and my farthest memory of the bass is from <em>Scott Pilgrim</em>, same for The Smiths, prior to seeing <em>(500) Days of Summer</em>, The Cure before I saw <em>Sing Street</em> and so on. We as human beings are so impressionable we don't even realise it — almost everything we do or have done was influenced by some form of connection or lack of connection in the past.</p>

          <p>When I first watched <em>It's Kind of a Funny Story</em>, I was through the roof. I read the book first but in every scene I could see myself in Craig, the decisions he made, both good or bad all felt very "Me" y'know? It doesn't even have to be a happy go lucky movie right — another movie, <em>Her</em>, Theodore although being an extreme was another instance of "I can see myself making these decisions" and in this case you get to learn consequences through another person's actions.</p>

          <p>Safe to say when I'm asked "What's your favourite movie?" it's hard to pick between what was just a fun watch vs what actually spoke to me more on a deep level. There's room for both — people usually feel you have to pick one of the two. I think you can love a movie for being a fun-no-lessons-learnt experience as well as loving another for being a deep black and white think piece about the political and economic state of the world right now.</p>

          <p>It doesn't take anything away from us to acknowledge it. You don't instantly lose cool points or become less interesting. We are meant to be impressionable — that's the whole point of the human experience.</p>

          <p>I guess all I'm trying to say here is movies like these make us feel better when they're closer to home. We get to live out plots, learn from experiences, and express ourselves without having to actually live those moments ourselves.</p>

          <p>Ending off with this — there will always be a huge factor to consider when comparing yourself to any image of yourself. You exist outside of fiction, and maybe that's what matters most and maybe that's why these movies stay with us.</p>

          <p>Not because we wanted to literally become those characters, but because for two hours they helped us understand parts of ourselves we didn't fully know how to explain yet.</p>
        </div>

        <Footer />
      </div>
    </div>
  )
}
