import { useEffect, useRef, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Gallery from './components/Gallery'
import Intro from './components/Intro'
import Projects from './components/Projects'
import Articles from './components/Articles'
import Footer from './components/Footer'
import CostGraphPage from './pages/CostGraphPage'
import LonarPage from './pages/LonarPage'
import styles from './App.module.css'

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
      <div ref={reg(3)} className={styles.section}><Articles /></div>
      <div ref={reg(4)} className={styles.section}><Footer /></div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/work/costgraph" element={<CostGraphPage />} />
      <Route path="/work/lonar" element={<LonarPage />} />
    </Routes>
  )
}
