import { useCallback, useState } from 'react'
import { normalizeKeywordQuery } from '../../lib/normalize'

export function usePlaceSearch(args: {
  services: { kakao: any; map: any; places: any; geocoder: any } | null
}) {
  const { services } = args
  const [isPlaceSearching, setIsPlaceSearching] = useState(false)
  const [lastPlaceLabel, setLastPlaceLabel] = useState<string | null>(null)

  const moveToPlaceByKeyword = useCallback(
    async (rawQuery: string) => {
      if (!services) return { moved: false as const, label: null as string | null }
      const query = normalizeKeywordQuery(rawQuery)
      if (!query) return { moved: false as const, label: null as string | null }

      setIsPlaceSearching(true)

      const searchPlaces = () =>
        new Promise<{ lat: number; lng: number; label: string }>((resolve, reject) => {
          services.places.keywordSearch(query, (data: any[], status: string) => {
            if (status !== services.kakao.maps.services.Status.OK || !data?.length) {
              reject(new Error('검색 결과가 없습니다.'))
              return
            }
            const best = data[0]
            const lat = Number(best.y)
            const lng = Number(best.x)
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
              reject(new Error('검색 좌표가 올바르지 않습니다.'))
              return
            }
            resolve({ lat, lng, label: best.place_name ?? query })
          })
        })

      const searchAddress = () =>
        new Promise<{ lat: number; lng: number; label: string }>((resolve, reject) => {
          services.geocoder.addressSearch(query, (data: any[], status: string) => {
            if (status !== services.kakao.maps.services.Status.OK || !data?.length) {
              reject(new Error('검색 결과가 없습니다.'))
              return
            }
            const best = data[0]
            const lat = Number(best.y)
            const lng = Number(best.x)
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
              reject(new Error('검색 좌표가 올바르지 않습니다.'))
              return
            }
            resolve({ lat, lng, label: best.address_name ?? query })
          })
        })

      try {
        let result: { lat: number; lng: number; label: string }
        try {
          result = await searchPlaces()
        } catch {
          result = await searchAddress()
        }

        const center = new services.kakao.maps.LatLng(result.lat, result.lng)
        services.map.setCenter(center)
        setLastPlaceLabel(result.label)
        return { moved: true as const, label: result.label }
      } finally {
        setIsPlaceSearching(false)
      }
    },
    [services],
  )

  return { isPlaceSearching, lastPlaceLabel, moveToPlaceByKeyword }
}

