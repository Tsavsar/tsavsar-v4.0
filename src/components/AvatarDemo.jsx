import styles from './AvatarDemo.module.css'

// ── Avatar image assets ───────────────────────────────────────────────
const HUMAN_DEFAULT   = 'https://www.figma.com/api/mcp/asset/e21c4891-335c-4203-9a33-241f5f57567a'
const HUMAN_COLOR     = 'https://www.figma.com/api/mcp/asset/e82bbf9c-a999-4da7-a439-44110f40f653'
const ILLUS_DEFAULT   = 'https://www.figma.com/api/mcp/asset/3a2e69dd-8515-455d-86fc-4b34a59011aa'
const ILLUS_COLOR_BG  = '#f5f5f5'
const ILLUS_COLOR_IMG = 'https://www.figma.com/api/mcp/asset/95ce4427-5844-4d23-b570-be3cfaedb17f'
const MEMOJI_DEFAULT  = 'https://www.figma.com/api/mcp/asset/679c3160-232b-4a74-ae73-cc7ac9544b93'
const MEMOJI_COLOR_BG = '#e0b0ff'
const MEMOJI_COLOR_IMG= 'https://www.figma.com/api/mcp/asset/ebc1c40c-9fa3-44f1-91ad-86e58e7b019f'

// Badge assets
const PLUS_ICON   = 'https://www.figma.com/api/mcp/asset/afafa593-ebb0-4f78-9e8c-81fb2ec18194'
const VERIFIED    = 'https://www.figma.com/api/mcp/asset/7c0cf0db-1c49-4ebf-9fc8-a1a310ee0c00'
const ARROW_ICON  = 'https://www.figma.com/api/mcp/asset/2cf9fae7-7e17-4686-92f5-549eb1e88738'
const NOTION_ICON = 'https://www.figma.com/api/mcp/asset/08c31628-367a-4b71-96ac-706dcfa556d3'
const X_ICON      = 'https://www.figma.com/api/mcp/asset/e7efa234-7724-4972-a6a6-1b2934fc973f'

// ── Badge components ──────────────────────────────────────────────────
function Badge({ type }) {
  const base = { position:'absolute', borderRadius:'50%', width:20, height:20, border:'2.5px solid #fff' }

  const map = {
    notification: { background: '#7d52f4' },
    active:       { background: '#1daf61' },
    idle:         { background: '#f6b51e' },
    dnd:          { background: '#fb3748' },
    offline:      { background: '#a3a3a3' },
    error:        { background: '#fb3748' },
    success:      { background: '#1fc16b' },
  }

  if (type === 'verified') return (
    <span style={{ ...base, overflow:'hidden', border:'none' }}>
      <img src={VERIFIED} alt="" style={{ width:'100%', height:'100%', display:'block' }} />
    </span>
  )
  if (type === 'plus') return (
    <span style={{ ...base, background: '#1fc16b', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <img src={PLUS_ICON} alt="" style={{ width:10, height:10 }} />
    </span>
  )
  if (type === 'cancel') return (
    <span style={{ ...base, background: '#fb3748', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <img src={X_ICON} alt="" style={{ width:8, height:8 }} />
    </span>
  )
  if (type === 'number') return (
    <span style={{ ...base, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
      <span style={{ position:'absolute', inset:'4.8% 5% 5.2%', background:'#fb4ba3', borderRadius:'50%' }} />
      <span style={{ position:'relative', fontSize:8, color:'#fff', fontWeight:400, zIndex:1 }}>00</span>
    </span>
  )
  if (type === 'icon') return (
    <span style={{ ...base, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
      <span style={{ position:'absolute', inset:'4.8% 5% 5.2%', background:'#7d52f4', borderRadius:'50%' }} />
      <img src={ARROW_ICON} alt="" style={{ width:8, height:8, position:'relative', zIndex:1 }} />
    </span>
  )
  if (type === 'logo') return (
    <span style={{ ...base, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
      <img src={NOTION_ICON} alt="" style={{ width:12, height:12 }} />
    </span>
  )

  return <span style={{ ...base, ...map[type] }} />
}

// ── Single avatar circle ──────────────────────────────────────────────
function Avatar({ type, topBadge, bottomBadge, size = 64 }) {
  const circleStyle = {
    width: size, height: size, borderRadius: '50%',
    overflow: 'hidden', flexShrink: 0, position: 'relative',
    border: '2px solid #fff',
  }

  let inner = null
  if (type === 'human-default')
    inner = <img src={HUMAN_DEFAULT} alt="" style={{ position:'absolute', inset:'-2px', width:'calc(100% + 4px)', height:'125%', objectFit:'cover' }} />
  else if (type === 'human-color')
    inner = <><div style={{ position:'absolute', inset:0, background:'#d55959' }} /><img src={HUMAN_COLOR} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'125%', objectFit:'cover' }} /></>
  else if (type === 'illus-default')
    inner = <img src={ILLUS_DEFAULT} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
  else if (type === 'illus-color')
    inner = <><div style={{ position:'absolute', inset:0, background:ILLUS_COLOR_BG }} /><img src={ILLUS_COLOR_IMG} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transform:'scaleX(-1) rotate(180deg)' }} /></>
  else if (type === 'memoji-default')
    inner = <img src={MEMOJI_DEFAULT} alt="" style={{ position:'absolute', inset:'-2px', width:'calc(100% + 4px)', height:'calc(100% + 4px)', objectFit:'cover' }} />
  else if (type === 'memoji-color')
    inner = <><div style={{ position:'absolute', inset:0, background:MEMOJI_COLOR_BG }} /><img src={MEMOJI_COLOR_IMG} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} /></>
  else if (type === 'initials')
    inner = <><div style={{ position:'absolute', inset:0, background:'#efebff' }} /><span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'#7d52f4', fontWeight:500, fontSize:22, letterSpacing:0.3 }}>KU</span></>
  else if (type === 'memoji-aiden')
    inner = <img src={MEMOJI_DEFAULT} alt="" style={{ position:'absolute', inset:'-2px', width:'calc(100% + 4px)', height:'calc(100% + 4px)', objectFit:'cover' }} />

  return (
    <div style={{ position:'relative', display:'inline-block', flexShrink:0 }}>
      <div style={circleStyle}>{inner}</div>
      {topBadge && (
        <div style={{ position:'absolute', top: size - 20, right: -2 }}>
          <Badge type={topBadge} />
        </div>
      )}
      {bottomBadge && (
        <div style={{ position:'absolute', top: 0, right: -2 }}>
          <Badge type={bottomBadge} />
        </div>
      )}
    </div>
  )
}

// ── Type showcase row ─────────────────────────────────────────────────
function TypeRow({ label, left, right }) {
  return (
    <div className={styles.typeCol}>
      <div className={styles.typePair}>
        <Avatar type={left} size={76} />
        <Avatar type={right} size={76} />
      </div>
      <span className={styles.typeLabel}>{label}</span>
    </div>
  )
}

// ── Badge showcase row ────────────────────────────────────────────────
const BADGE_TYPES = ['notification','active','idle','dnd','offline','verified','icon','number','plus','cancel','logo']

// ── Main export ───────────────────────────────────────────────────────
export default function AvatarDemo() {
  return (
    <div className={styles.root}>
      {/* Row 1: Avatar types */}
      <div className={styles.typesRow}>
        <TypeRow label="Humans"       left="human-default"  right="human-color"   />
        <TypeRow label="Illustrations" left="illus-default"  right="illus-color"   />
        <TypeRow label="Memojis"      left="memoji-default" right="memoji-color"  />
      </div>

      {/* Row 2: Badges */}
      <div className={styles.badgesRow}>
        <span className={styles.badgesLabel}>Badges</span>
        <div className={styles.badgesList}>
          {BADGE_TYPES.map(b => (
            <span key={b} style={{ position:'relative', display:'inline-flex' }}>
              <Badge type={b} />
            </span>
          ))}
        </div>
      </div>

      {/* Row 3: Avatars with badges */}
      <div className={styles.badgedAvatars}>
        <Avatar type="memoji-aiden"  size={64} topBadge="notification" bottomBadge="verified" />
        <Avatar type="human-default" size={64} topBadge="idle"         bottomBadge="plus"     />
        <Avatar type="illus-color"   size={64} topBadge="icon"         bottomBadge="logo"     />
        <Avatar type="initials"      size={64} topBadge="verified"     bottomBadge="notification" />
      </div>
    </div>
  )
}
