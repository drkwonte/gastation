const CURRENT_LOCATION_MARKER_SIZE_PX = 36
const CURRENT_LOCATION_MARKER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48">
  <path d="M24 46s14-13.1 14-26A14 14 0 1 0 10 20c0 12.9 14 26 14 26z" fill="#ef4444"/>
  <circle cx="24" cy="20" r="6.5" fill="#ffffff"/>
  <circle cx="24" cy="20" r="4.3" fill="#ef4444"/>
</svg>`
const CURRENT_LOCATION_MARKER_DATA_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  CURRENT_LOCATION_MARKER_SVG,
)}`

export function createOrUpdateCurrentLocationMarker(args: {
  kakao: any
  map: any
  markerRef: { current: any | null }
  lat: number
  lng: number
}) {
  const { kakao, map, markerRef, lat, lng } = args

  const position = new kakao.maps.LatLng(lat, lng)

  if (!markerRef.current) {
    const imageSize = new kakao.maps.Size(
      CURRENT_LOCATION_MARKER_SIZE_PX,
      CURRENT_LOCATION_MARKER_SIZE_PX,
    )
    const imageOption = {
      offset: new kakao.maps.Point(
        CURRENT_LOCATION_MARKER_SIZE_PX / 2,
        CURRENT_LOCATION_MARKER_SIZE_PX,
      ),
    }
    const markerImage = new kakao.maps.MarkerImage(
      CURRENT_LOCATION_MARKER_DATA_URL,
      imageSize,
      imageOption,
    )

    markerRef.current = new kakao.maps.Marker({
      position,
      image: markerImage,
      zIndex: 10,
    })
    markerRef.current.setMap(map)
  } else {
    markerRef.current.setPosition(position)
  }
}

