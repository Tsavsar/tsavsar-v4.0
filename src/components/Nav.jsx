import { useEffect, useRef } from 'react'
import styles from './Nav.module.css'

const SIG_PATH = "M40.8613 34.142C49.863 29.7983 48.196 22.9486 43.0284 23.6169C36.4797 26.6814 34.11 32.2208 28.2756 52.3521C21.3577 67.7221 9.27205 71.3975 10.8558 65.5502C16.0772 58.2166 38.5275 44.4165 57.1143 40.1564C71.4502 36.8705 76.4511 37.3163 79.7017 34.142M75.8677 26.9582C75.0342 28.2947 72.031 27.2923 69.9473 28.8795C67.5558 29.5208 67.3991 30.0536 65.3658 31.469C63.8516 32.523 62.7962 34.0245 61.0316 34.5597C59.2338 35.105 59.0361 33.268 57.6143 33.8914C53.6136 35.6456 49.6129 37.901 47.6958 38.4857C46.6687 38.799 48.2793 36.2303 46.8624 35.8127C45.4454 35.395 40.4445 41.0752 39.6944 40.407C38.9442 39.7387 39.4443 38.4857 39.4443 38.4857M69.9473 28.8795C70.5308 27.4594 73.7006 25.3711 73.0338 24.4522C72.367 23.5334 71.3669 25.7888 70.45 27.6265C69.5332 29.4642 68.4654 33.9038 71.1168 34.6432C73.4955 35.3065 77.4021 31.469 78.322 30.0103"

export default function Nav({ galleryOpen, onAvatarClick }) {
  const pathRef  = useRef(null)
  const animRef  = useRef(null)
  const sigTimer = useRef(null)

  function playDraw() {
    if (animRef.current) animRef.current.cancel()
    animRef.current = pathRef.current.animate(
      [{ strokeDashoffset: 1200 }, { strokeDashoffset: 0 }],
      { duration: 5000, delay: 200, easing: 'cubic-bezier(0.4,0,0.2,1)', fill: 'forwards' }
    )
  }

  useEffect(() => {
    playDraw()
    function schedule() {
      sigTimer.current = setTimeout(() => { playDraw(); schedule() }, 8000 + Math.random() * 4000)
    }
    schedule()
    return () => clearTimeout(sigTimer.current)
  }, [])

  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <div
          className={`${styles.avatarWrap} ${galleryOpen ? styles.avatarWrapActive : ''}`}
          onClick={onAvatarClick}
          title="View gallery"
        >
          <img
            className={styles.avatar}
            src="https://www.figma.com/api/mcp/asset/1aa1c2c3-f09a-4a01-97ce-b56642ff0c91"
            alt="Shater Tsavsar"
          />
        </div>
        <svg
          className={styles.sig}
          viewBox="0 0 90 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Signature"
          onMouseEnter={playDraw}
        >
          <path
            ref={pathRef}
            d={SIG_PATH}
            stroke="#1A1714"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ strokeDasharray: 1200, strokeDashoffset: 1200 }}
          />
        </svg>
      </div>
      <div className={styles.links}>
        <a href="#about">About me</a>
        <a href="https://x.com/Tsavsar_" target="_blank" rel="noopener">X</a>
        <a href="https://www.linkedin.com/in/tsavsar/" target="_blank" rel="noopener">LinkedIn</a>
        <a href="mailto:Shatermt@gmail.com">Email</a>
      </div>
    </nav>
  )
}
