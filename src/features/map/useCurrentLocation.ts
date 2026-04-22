import { useCallback, useEffect, useRef, useState } from 'react'
import { createOrUpdateCurrentLocationMarker } from './currentLocationMarker'

export type CurrentLocation = { lat: number; lng: number }

export function useCurrentLocation(args: {
  services: { kakao: any; map: any } | null
}) {
  const { services } = args
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation | null>(null)
  const markerRef = useRef<any>(null)

  const setMarker = useCallback(
    (lat: number, lng: number) => {
      if (!services) return
      createOrUpdateCurrentLocationMarker({
        kakao: services.kakao,
        map: services.map,
        markerRef,
        lat,
        lng,
      })
    },
    [services],
  )

  const moveToCurrentLocation = useCallback(async () => {
    if (!services) return

    if (!navigator.geolocation) {
      throw new Error('이 브라우저는 위치 정보를 지원하지 않습니다.')
    }

    return new Promise<void>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setCurrentLocation({ lat: latitude, lng: longitude })
          setMarker(latitude, longitude)
          const center = new services.kakao.maps.LatLng(latitude, longitude)
          services.map.setCenter(center)
          resolve()
        },
        () => reject(new Error('위치 접근이 거부되었거나 위치를 가져오지 못했습니다.')),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30_000 },
      )
    })
  }, [services, setMarker])

  useEffect(() => {
    if (!services) return
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setCurrentLocation({ lat: latitude, lng: longitude })
        setMarker(latitude, longitude)
      },
      () => {
        // ignore
      },
      { enableHighAccuracy: false, timeout: 2500, maximumAge: 60_000 },
    )
  }, [services, setMarker])

  return { currentLocation, moveToCurrentLocation }
}

