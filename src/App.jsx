import { useEffect, useRef, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Gallery from './components/Gallery'
import Intro from './components/Intro'
import Projects from './components/Projects'
import Articles from './components/Articles'
import Explorations from './components/Explorations'
import ExplorationsBar from './components/ExplorationsBar'
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
  const [galleryOpen, setGalleryOpen] = useState(false)

  return (
    <div className={styles.page}>
      <div className={`${styles.section} ${styles.navGroup}`} style={{ '--appear-delay': '0s' }}>
        <Nav galleryOpen={galleryOpen} onAvatarClick={() => setGalleryOpen(o => !o)} />
        <Gallery open={galleryOpen} />
      </div>
      <div className={styles.section} style={{ '--appear-delay': '0.1s' }}><Intro /></div>
      <div className={styles.section} style={{ '--appear-delay': '0.18s' }}><Projects /></div>
      <div className={styles.section} style={{ '--appear-delay': '0.22s' }}><ExplorationsBar /></div>
      <div className={styles.section} style={{ '--appear-delay': '0.26s' }}><Articles /></div>
      <div className={styles.section} style={{ '--appear-delay': '0.42s' }}><Footer /></div>
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
