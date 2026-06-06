import { useEffect, useRef } from 'react'
import styles from './CaseStudyLayout.module.css'

export default function CaseStudyLayout({ children }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const els = containerRef.current?.querySelectorAll('[data-fade]') || []
    els.forEach((el, i) => {
      setTimeout(() => el.classList.add(styles.visible), 80 + i * 60)
    })
  }, [])

  return <div ref={containerRef}>{children}</div>
}

export function FadeItem({ children, index = 0 }) {
  return (
    <div data-fade className={styles.fadeItem}>
      {children}
    </div>
  )
}
