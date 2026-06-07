import { useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './Projects.module.css'
import { useCursorLabel } from './CardExpand'

const ARROW = (
  <svg viewBox="0 0 11.05 8.25" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 14, height: 14, flexShrink: 0 }}>
    <path d="M10.425 3.425H2.725C1.5651 3.425 0.625 4.3651 0.625 5.525V7.625" stroke="#5C5C5C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.625 6.225L10.425 3.425L7.625 0.625" stroke="#5C5C5C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function ParallaxCard({ name, category, desc, bg, to, children }) {
  const imgRef  = useRef(null)
  const piRefs  = useRef([])
  const navigate = useNavigate()
  const { areaProps: imgAreaProps,  labelEl: imgLabelEl  } = useCursorLabel('View project')
  const { areaProps: descAreaProps, labelEl: descLabelEl } = useCursorLabel('View project')

  useEffect(() => {
    // Capture base transform from inline style on each .pi element
    piRefs.current.forEach(el => {
      if (!el) return
      const m = (el.getAttribute('style') || '').match(/transform:\s*([^;]+)/)
      el._base = m ? m[1].trim() : ''
    })

    // Stagger items in
    piRefs.current.forEach((el, i) => {
      if (!el) return
      setTimeout(() => el.classList.add(styles.piIn), 600 + i * 150)
    })
  }, [])

  function onMouseMove(e) {
    const r = imgRef.current.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width  / 2) / r.width
    const y = (e.clientY - r.top  - r.height / 2) / r.height
    piRefs.current.forEach(el => {
      if (!el) return
      const s = parseFloat(el.dataset.speed) || 10
      el.style.transition = 'transform 0.08s linear'
      el.style.transform  = `${el._base || ''} translate(${x * s}px, ${y * s}px)`
    })
  }

  function onMouseLeave() {
    piRefs.current.forEach(el => {
      if (!el) return
      el.style.transition = 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)'
      el.style.transform  = el._base || 'none'
    })
  }

  function reg(i) {
    return el => { piRefs.current[i] = el }
  }

  return (
    <div className={styles.card}>
      {to && imgLabelEl}
      <div
        ref={imgRef}
        className={`${styles.img} ${to ? styles.imgClickable : ''}`}
        style={{ background: bg }}
        onMouseMove={onMouseMove}
        onMouseLeave={e => { onMouseLeave(); if (to) imgAreaProps.onMouseLeave(e) }}
        onMouseEnter={to ? imgAreaProps.onMouseEnter : undefined}
        onClick={to ? () => navigate(to) : undefined}
        {...(to ? { onMouseMove: e => { onMouseMove(e); imgAreaProps.onMouseMove(e) } } : {})}
      >
        {children(reg)}
      </div>
      {to ? (
        <>
          {descLabelEl}
          <Link to={to} className={styles.info} style={{ textDecoration: 'none', cursor: 'none' }} {...descAreaProps}>
            <div className={styles.meta}>
              <span className={styles.name}>{name}</span>
              <span className={styles.category}>{category}</span>
              {ARROW}
            </div>
            <p className={styles.desc}>{desc}</p>
          </Link>
        </>
      ) : (
        <div className={styles.info}>
          <div className={styles.meta}>
            <span className={styles.name}>{name}</span>
            <span className={styles.category}>{category}</span>
            {ARROW}
          </div>
          <p className={styles.desc}>{desc}</p>
        </div>
      )}
    </div>
  )
}

export default function Projects() {
  const scrollRef = useRef(null)
  const drag = useRef({ down: false, startX: 0, scrollLeft: 0 })

  function onDown(e) {
    drag.current = { down: true, startX: e.pageX - scrollRef.current.offsetLeft, scrollLeft: scrollRef.current.scrollLeft }
    scrollRef.current.style.cursor = 'grabbing'
  }
  function onUp() {
    drag.current.down = false
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }
  function onMove(e) {
    if (!drag.current.down) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    scrollRef.current.scrollLeft = drag.current.scrollLeft - (x - drag.current.startX) * 1.5
  }

  return (
    <section className={styles.section}>
      <p className={styles.label}>my work</p>
      <div
        ref={scrollRef}
        className={styles.outer}
        id="projectsScroll"
        onMouseDown={onDown}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onMouseMove={onMove}
      >
        <div className={styles.wrapper}>
          <div className={styles.track}>

            {/* CostGraph */}
            <ParallaxCard
              to="/work/costgraph"
              name="CostGraph.ai"
              category="Cloud cost optimisation"
              desc="Teams lose track of what they're spending on Kubernetes and VMs. CostGraph surfaces that spend and recommends exactly where to cut."
              bg="linear-gradient(190.846deg, rgb(3,8,18) 8.5746%, rgb(10,52,119) 68.68%)"
            >
              {reg => (<>
                <img ref={reg(0)} data-speed="8" className={styles.pi}
                  src="/assets/logo back.png" alt=""
                  style={{ position:'absolute', width:155, height:176, left:'calc(50% - 0.5px)', top:'calc(50% + 42px)', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
                <img ref={reg(1)} data-speed="20" className={styles.pi}
                  src="/assets/glass bottom.png" alt=""
                  style={{ position:'absolute', width:811, height:791, left:-22, top:12, pointerEvents:'none' }} />
                <img ref={reg(2)} data-speed="14" className={styles.pi}
                  src="/assets/glass top.png" alt=""
                  style={{ position:'absolute', width:443, height:423, left:-163, top:-264, pointerEvents:'none' }} />
                <img ref={reg(3)} data-speed="6" className={styles.pi}
                  src="/assets/logo front.png" alt=""
                  style={{ position:'absolute', width:46, height:52, left:'50%', top:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none' }} />
              </>)}
            </ParallaxCard>

            {/* Lönar */}
            <ParallaxCard
              to="/work/lonar"
              name="Lönar"
              category="Invoice platform"
              desc="Chasing clients and tracking payments is a mess. Lönar keeps it all in one place. Manage clients, automate invoices and always know who owes you."
              bg="linear-gradient(216.73deg, rgb(251,77,0) 3.08%, rgb(244,3,131) 95.93%)"
            >
              {reg => (<>
                <div ref={reg(0)} data-speed="18" className={styles.pi}
                  style={{ position:'absolute', width:237, height:237, left:'calc(50% - 118px)', top:'calc(50% + 27.5px - 118px)', pointerEvents:'none' }}>
                  <img src="https://www.figma.com/api/mcp/asset/36974781-2699-4c66-9105-a823d94fdb84" style={{ width:'100%', height:'100%' }} alt="" />
                </div>
                <div ref={reg(1)} data-speed="10" className={styles.pi}
                  style={{ position:'absolute', width:40, height:40, left:'calc(50% - 20px)', top:'calc(50% - 102px - 20px)', overflow:'hidden', pointerEvents:'none' }}>
                  <img src="https://www.figma.com/api/mcp/asset/8ad02711-5ec8-403c-858b-39ced3d34111"
                    style={{ width:'88%', height:'88%', position:'absolute', top:'6%', left:'6%', transform:'scaleX(-1)' }} alt="" />
                </div>
                <div ref={reg(2)} data-speed="25" className={styles.pi}
                  style={{ position:'absolute', width:241, height:335, left:'calc(50% - 118px)', bottom:-127, pointerEvents:'none' }}>
                  <img src="https://www.figma.com/api/mcp/asset/21b40784-1f5e-42a5-9948-2a5a976d0ff4"
                    style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="" />
                </div>
              </>)}
            </ParallaxCard>

            {/* KernUI */}
            <ParallaxCard
              to="/work/kernui"
              name="KernUI"
              category="Design system library"
              desc="Starting from scratch on every project slows teams down. KernUI gives designers and devs a shared component library so they can build faster together."
              bg="#7d52f4"
            >
              {reg => (<>
                <div ref={reg(0)} data-speed="8" className={styles.pi}
                  style={{ position:'absolute', width:214, height:298, right:19, bottom:-6, pointerEvents:'none' }}>
                  <img src="https://www.figma.com/api/mcp/asset/157fe76d-8a66-47a9-a9e9-3a287170d4d8" style={{ width:'100%', height:'100%' }} alt="" />
                </div>
                <div ref={reg(1)} data-speed="20" className={styles.pi}
                  style={{ position:'absolute', left:-23, top:21, width:261, height:250, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                  <img src="https://www.figma.com/api/mcp/asset/eb20f63a-67fb-4ebe-95c2-166f2ebc0cb3" style={{ width:210, height:192, flexShrink:0, transform:'rotate(19.17deg)', objectFit:'cover' }} alt="" />
                </div>
                <div ref={reg(2)} data-speed="14" className={styles.pi}
                  style={{ position:'absolute', left:-35, top:50, width:159, height:279, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                  <img src="https://www.figma.com/api/mcp/asset/b7ab85a6-827e-41d0-817f-8d64d527b25e" style={{ width:125, height:265, flexShrink:0, transform:'rotate(7.63deg)', objectFit:'cover' }} alt="" />
                </div>
                <div ref={reg(3)} data-speed="24" className={styles.pi}
                  style={{ position:'absolute', left:122, top:134, width:245, height:242, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                  <img src="https://www.figma.com/api/mcp/asset/277565a6-9c8f-4b73-bd7a-ade04411fb61" style={{ width:184, height:176, flexShrink:0, transform:'rotate(28.07deg)', objectFit:'cover' }} alt="" />
                </div>
                <div ref={reg(4)} data-speed="18" className={styles.pi}
                  style={{ position:'absolute', left:100, top:236, width:188, height:107, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                  <img src="https://www.figma.com/api/mcp/asset/a2ea3a77-1447-48d6-a436-ac643d649633" style={{ width:182, height:50, flexShrink:0, transform:'rotate(-19.27deg)', objectFit:'cover' }} alt="" />
                </div>
                <div ref={reg(5)} data-speed="16" className={styles.pi}
                  style={{ position:'absolute', left:-21, top:173, width:209, height:190, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
                  <img src="https://www.figma.com/api/mcp/asset/ac90efec-3d17-4a41-af04-e96ac83437fb" style={{ width:188, height:165, flexShrink:0, transform:'rotate(8.02deg)', objectFit:'cover' }} alt="" />
                </div>
                <div ref={reg(6)} data-speed="28" className={styles.pi}
                  style={{ position:'absolute', width:32, height:44, left:'calc(50% + 108px - 16px)', top:'calc(50% - 92px - 22px)', pointerEvents:'none' }}>
                  <img src="https://www.figma.com/api/mcp/asset/5ea2c87b-9202-4e6e-be57-f42810e81721" style={{ width:'100%', height:'100%' }} alt="" />
                </div>
              </>)}
            </ParallaxCard>

            {/* Fundify */}
            <ParallaxCard
              to="/work/fundify"
              name="Fundify"
              category="Fintech mobile app"
              desc="Saving money feels like punishment. Fundify flips that — rewarding every good financial move with FundCoins you can actually spend."
              bg="#141414"
            >
              {reg => (<>
                {/* Fundify logo wordmark */}
                <div ref={reg(0)} data-speed="6" className={styles.pi}
                  style={{ position:'absolute', width:200, left:'calc(50% - 100px)', top:24, pointerEvents:'none' }}>
                  <img src="https://www.figma.com/api/mcp/asset/1e5ebaee-dd28-464b-a549-30a8497fd6f5" style={{ width:'100%' }} alt="" />
                </div>
                {/* Left phone */}
                <div ref={reg(1)} data-speed="14" className={styles.pi}
                  style={{ position:'absolute', width:110, left:28, top:110, pointerEvents:'none' }}>
                  <img src="https://www.figma.com/api/mcp/asset/6612f1fe-c761-4dae-a4f2-fa021c95226f" style={{ width:'100%', objectFit:'cover', objectPosition:'top' }} alt="" />
                </div>
                {/* Center phone */}
                <div ref={reg(2)} data-speed="8" className={styles.pi}
                  style={{ position:'absolute', width:138, left:'calc(50% - 69px)', top:80, pointerEvents:'none' }}>
                  <img src="https://www.figma.com/api/mcp/asset/5378a954-2dd8-455b-9938-14458adc0032" style={{ width:'100%', objectFit:'cover', objectPosition:'top' }} alt="" />
                </div>
                {/* Right phone */}
                <div ref={reg(3)} data-speed="18" className={styles.pi}
                  style={{ position:'absolute', width:110, right:28, top:120, pointerEvents:'none' }}>
                  <img src="https://www.figma.com/api/mcp/asset/87fab92f-a81e-4a80-b551-1a002372476c" style={{ width:'100%', objectFit:'cover', objectPosition:'top' }} alt="" />
                </div>
              </>)}
            </ParallaxCard>

          </div>
        </div>
      </div>
    </section>
  )
}
