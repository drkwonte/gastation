import { useEffect, useRef, useState } from 'react'
import { DEFAULT_CENTER } from '../../env'
import { loadKakaoMaps } from '../../lib/kakaoMaps'

export type KakaoMapServices = {
  kakao: any
  map: any
  places: any
  geocoder: any
}

export function useKakaoMap(mapContainerRef: React.RefObject<HTMLDivElement | null>) {
  const [services, setServices] = useState<KakaoMapServices | null>(null)
  const [error, setError] = useState<string | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const kakao = await loadKakaoMaps()
        if (cancelled || !isMountedRef.current) return

        const container = mapContainerRef.current
        if (!container) return

        const center = new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng)
        const map = new kakao.maps.Map(container, { center, level: 5 })

        const places = new kakao.maps.services.Places()
        const geocoder = new kakao.maps.services.Geocoder()

        setServices({ kakao, map, places, geocoder })
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to initialize map.'
        setError(message)
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [mapContainerRef])

  return { services, error }
}

