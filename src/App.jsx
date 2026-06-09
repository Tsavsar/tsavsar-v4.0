import { useEffect, useRef, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Gallery from './components/Gallery'
import Intro from './components/Intro'
import Projects from './components/Projects'
import Articles from './components/Articles'
import Explorations from './components/Explorations'
import Footer from './components/Footer'
import AudioModal from './components/AudioModal'
import AudioToggle from './components/AudioToggle'
import CostGraphPage from './pages/CostGraphPage'
import LonarPage from './pages/LonarPage'
import KernUIPage from './pages/KernUIPage'
import FundifyPage from './pages/FundifyPage'
import ArticleVicariouslyPage from './pages/ArticleVicariouslyPage'
import ExplorationsPage from './pages/ExplorationsPage'
import styles from './App.module.css'
import useClickSound from './hooks/useClickSound'

function Home() {
  const refs = useRef([])
  const [galleryOpen, setGalleryOpen] = useState(false)

  useEffect(() => {
    const startDelay = 300
    const stagger    = 180
    refs.current.forEach((el, i) => {
      if (!el) return
      setTimeout(() => el.classList.add(styles.visible), startDelay + i * stagger)
    })
  }, [])

  const reg = i => el => { refs.current[i] = el }

  return (
    <div className={styles.page}>
      <div ref={reg(0)} className={`${styles.section} ${styles.navGroup}`}>
        <Nav galleryOpen={galleryOpen} onAvatarClick={() => setGalleryOpen(o => !o)} />
        <Gallery open={galleryOpen} />
      </div>
      <div ref={reg(1)} className={styles.section}><Intro /></div>
      <div ref={reg(2)} className={styles.section}><Projects /></div>
      <div ref={reg(3)} className={styles.section}><Explorations /></div>
      <div ref={reg(4)} className={styles.section}><Articles /></div>
      <div ref={reg(5)} className={styles.section}><Footer /></div>
    </div>
  )
}

export default function App() {
  const STORAGE_KEY = 'audio-enabled'
  const [audioEnabled, setAudioEnabled] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === null ? true : saved === 'true'
  })
  const [showModal, setShowModal] = useState(false)
  const audioEnabledRef = useRef(audioEnabled)

  // Keep ref in sync so useClickSound always reads the latest value
  useEffect(() => {
    audioEnabledRef.current = audioEnabled
    localStorage.setItem(STORAGE_KEY, audioEnabled)
  }, [audioEnabled])

  // Show modal once per session if audio hasn't been explicitly set before
  useEffect(() => {
    const hasChosen = localStorage.getItem(STORAGE_KEY) !== null
    if (!hasChosen) {
      const t = setTimeout(() => setShowModal(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  useClickSound(audioEnabledRef)

  function handleDisable() {
    setAudioEnabled(false)
    setShowModal(false)
  }

  function handleKeep() {
    setAudioEnabled(true)
    setShowModal(false)
  }

  return (
    <>
      {showModal && <AudioModal onDisable={handleDisable} onKeep={handleKeep} />}
      <AudioToggle enabled={audioEnabled} onToggle={() => setAudioEnabled(v => !v)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/costgraph" element={<CostGraphPage />} />
        <Route path="/work/lonar" element={<LonarPage />} />
        <Route path="/work/kernui" element={<KernUIPage />} />
        <Route path="/work/fundify" element={<FundifyPage />} />
        <Route path="/articles/vicariously" element={<ArticleVicariouslyPage />} />
      <Route path="/explorations" element={<ExplorationsPage />} />
      </Routes>
    </>
  )
}
