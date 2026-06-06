import { useState, useEffect } from 'react'

export function useRecentlyPlayed() {
  const [tracks, setTracks] = useState([])

  useEffect(() => {
    async function fetch_() {
      try {
        const res  = await fetch('https://spotify-api-lilac.vercel.app/api/recently-played')
        const data = await res.json()
        setTracks(data.tracks || [])
      } catch {}
    }
    fetch_()
    const id = setInterval(fetch_, 10000)
    return () => clearInterval(id)
  }, [])

  return tracks
}
