import { useRef, useState } from 'react'
import type { ProductCode } from '../types/opinet'
import { RADIUS_MAX_METERS, RADIUS_OPTIONS_METERS } from '../env'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useKakaoMap } from '../features/map/useKakaoMap'
import { useCurrentLocation } from '../features/map/useCurrentLocation'
import { useOpinetAround } from '../features/stations/useOpinetAround'
import { usePlaceSearch } from '../features/places/usePlaceSearch'
import { renderStationMarkers } from '../features/stations/stationMarkers'
import { HeaderControls } from '../components/HeaderControls'
import { MapPane } from '../components/MapPane'
import { ResultsPane } from '../components/ResultsPane'
import styles from './MapPage.module.css'

function clampRadius(radius: number): number {
  if (!Number.isFinite(radius) || radius <= 0) return RADIUS_OPTIONS_METERS[1]
  return Math.min(radius, RADIUS_MAX_METERS)
}

export function MapPage() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const stationMarkersRef = useRef<any[]>([])

  const isMobile = useMediaQuery('(max-width: 768px)')

  const [radiusMeters, setRadiusMeters] = useState<number>(RADIUS_OPTIONS_METERS[1])
  const [productCode, setProductCode] = useState<ProductCode>('B027')
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)
  const [placeQuery, setPlaceQuery] = useState('')

  const { services, error: mapInitError } = useKakaoMap(mapContainerRef)
  const isMapReady = Boolean(services)

  const { currentLocation, moveToCurrentLocation } = useCurrentLocation({
    services: services ? { kakao: services.kakao, map: services.map } : null,
  })
  const { stations, isSearching, errorMessage, searchAround } = useOpinetAround()
  const { isPlaceSearching, lastPlaceLabel, moveToPlaceByKeyword } = usePlaceSearch({
    services,
  })

  const effectiveError = mapInitError ?? errorMessage

  async function onSearchAround() {
    if (!services) return
    setSelectedStationId(null)

    const center = services.map.getCenter()
    const lat = center.getLat()
    const lng = center.getLng()

    const nextStations = await searchAround({
      lat,
      lng,
      radius: clampRadius(radiusMeters),
      prodcd: productCode,
    })

    renderStationMarkers({
      kakao: services.kakao,
      map: services.map,
      stations: nextStations,
      markers: stationMarkersRef.current,
      selectedStationId: null,
      onMarkerClick: (station) => {
        if (station.id) setSelectedStationId(station.id)
      },
    })

    const cheapest =
      nextStations
        .filter((s) => typeof s.price === 'number')
        .sort(
          (a, b) =>
            (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY),
        )[0] ?? null
    if (cheapest?.id) setSelectedStationId(cheapest.id)
  }

  function onSelectStation(id: string) {
    setSelectedStationId(id)
    
    if (!services) return
    const station = stations.find((s) => s.id === id)
    if (!station || station.lat === null || station.lng === null) return

    const position = new services.kakao.maps.LatLng(station.lat, station.lng)
    services.map.panTo(position)

    renderStationMarkers({
      kakao: services.kakao,
      map: services.map,
      stations,
      markers: stationMarkersRef.current,
      selectedStationId: id,
      onMarkerClick: (station) => {
        if (station.id) setSelectedStationId(station.id)
      },
    })
  }

  return (
    <div className={styles.page}>
      {effectiveError ? <div className={styles.error}>{effectiveError}</div> : null}

      <div className={isMobile ? styles.mobileLayout : styles.desktopLayout}>
        {!isMobile ? (
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <HeaderControls
                placeQuery={placeQuery}
                setPlaceQuery={setPlaceQuery}
                onMoveToPlace={async () => {
                  setSelectedStationId(null)
                  await moveToPlaceByKeyword(placeQuery)
                }}
                isPlaceSearching={isPlaceSearching}
                productCode={productCode}
                setProductCode={setProductCode}
                radiusMeters={radiusMeters}
                setRadiusMeters={setRadiusMeters}
                onMoveToCurrentLocation={async () => {
                  setSelectedStationId(null)
                  await moveToCurrentLocation()
                }}
                onSearchAround={onSearchAround}
                isMapReady={isMapReady}
                isSearching={isSearching}
              />
            </div>

            <div className={styles.sidebarResults}>
              <ResultsPane
                stations={stations}
                selectedStationId={selectedStationId}
                onSelectStation={onSelectStation}
                currentLocation={currentLocation}
                lastPlaceLabel={lastPlaceLabel}
              />
            </div>
          </aside>
        ) : null}

        <div className={styles.mapArea}>
          <MapPane mapContainerRef={mapContainerRef} />

          {isMobile ? (
            <>
              <div className={styles.mobileTop}>
                <div className={styles.mobileSearchCard}>
                  <HeaderControls
                    placeQuery={placeQuery}
                    setPlaceQuery={setPlaceQuery}
                    onMoveToPlace={async () => {
                      setSelectedStationId(null)
                      await moveToPlaceByKeyword(placeQuery)
                    }}
                    isPlaceSearching={isPlaceSearching}
                    productCode={productCode}
                    setProductCode={setProductCode}
                    radiusMeters={radiusMeters}
                    setRadiusMeters={setRadiusMeters}
                    onMoveToCurrentLocation={async () => {
                      setSelectedStationId(null)
                      await moveToCurrentLocation()
                    }}
                    onSearchAround={onSearchAround}
                    isMapReady={isMapReady}
                    isSearching={isSearching}
                  />
                </div>
              </div>

              <div className={styles.bottomSheet}>
                <div className={styles.sheetHandle} aria-hidden="true" />
                <ResultsPane
                  stations={stations}
                  selectedStationId={selectedStationId}
                  onSelectStation={onSelectStation}
                  currentLocation={currentLocation}
                  lastPlaceLabel={lastPlaceLabel}
                />
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

