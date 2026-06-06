export default function Arrow({ size = 14, color = '#5C5C5C' }) {
  return (
    <svg width={size} height={size * (8.25 / 11.05)} viewBox="0 0 11.05 8.25" fill="none">
      <path d="M10.425 3.425H2.725C1.5651 3.425 0.625 4.3651 0.625 5.525V7.625"
        stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.625 6.225L10.425 3.425L7.625 0.625"
        stroke={color} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
