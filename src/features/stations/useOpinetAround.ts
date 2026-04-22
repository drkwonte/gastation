import { useCallback, useRef, useState } from 'react'
import type { AroundApiResponse, Station } from '../../types/opinet'

const SEARCH_SORT_BY_PRICE = '1'

export function useOpinetAround() {
  const [stations, setStations] = useState<Station[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const lastQueryRef = useRef<{ lat: number; lng: number } | null>(null)

  const searchAround = useCallback(
    async (args: { lat: number; lng: number; radius: number; prodcd: string }) => {
      setErrorMessage(null)
      setIsSearching(true)

      try {
        const params = new URLSearchParams({
          lat: String(args.lat),
          lng: String(args.lng),
          radius: String(args.radius),
          prodcd: args.prodcd,
          sort: SEARCH_SORT_BY_PRICE,
        })

        const response = await fetch(`/api/opinet/around?${params.toString()}`)
        const body = (await response.json()) as AroundApiResponse

        if (!response.ok || !body.ok) {
          throw new Error(body.raw ?? 'Opinet API request failed.')
        }

        const nextStations = body.stations ?? []
        setStations(nextStations)
        lastQueryRef.current = { lat: args.lat, lng: args.lng }
        return nextStations
      } catch (e) {
        const message = e instanceof Error ? e.message : '주변 주유소 조회에 실패했습니다.'
        setErrorMessage(message)
        setStations([])
        return []
      } finally {
        setIsSearching(false)
      }
    },
    [],
  )

  return { stations, setStations, isSearching, errorMessage, searchAround, lastQueryRef }
}

