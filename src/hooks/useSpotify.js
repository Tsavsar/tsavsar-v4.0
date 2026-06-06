import { useState, useEffect } from 'react'

export function useSpotify() {
  const [data, setData] = useState({
    title: 'Feminine Feelings',
    artist: 'Chrissy',
    albumArt: '',
    isPlaying: false,
    songUrl: '',
  })

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch('https://spotify-api-lilac.vercel.app/api/now-playing')
        const json = await res.json()
        setData(prev => ({
          title:    json.title    || prev.title,
          artist:   json.artist   || prev.artist,
          albumArt: json.albumArt || prev.albumArt,
          isPlaying: !!json.isPlaying,
          songUrl:  json.songUrl  || '',
        }))
      } catch {}
    }
    fetch_()
    const id = setInterval(fetch_, 10000)
    return () => clearInterval(id)
  }, [])

  return data
}
