import { useScramble } from '../hooks/useScramble'

export default function ScrambleText({ children, delay = 0, duration = 700, as: Tag = 'span' }) {
  const text = typeof children === 'string' ? children : ''
  const output = useScramble(text, { delay, duration })
  return <Tag style={{ fontVariantNumeric: 'tabular-nums' }}>{output || ' '}</Tag>
}
