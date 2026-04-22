import type { Station } from '../../types/opinet'

export function clearMarkers(markers: any[]) {
  for (const marker of markers) marker.setMap(null)
  markers.length = 0
}

export function renderStationMarkers(args: {
  kakao: any
  map: any
  stations: Station[]
  markers: any[]
  onMarkerClick: (station: Station) => void
  selectedStationId?: string | null
}) {
  const { kakao, map, stations, markers, onMarkerClick, selectedStationId } = args
  clearMarkers(markers)

  for (const station of stations) {
    if (station.lat === null || station.lng === null) continue
    const position = new kakao.maps.LatLng(station.lat, station.lng)
    
    const isSelected = station.id === selectedStationId
    const markerImage = isSelected
      ? new kakao.maps.MarkerImage(
          'data:image/svg+xml;base64,' +
            btoa(
              `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="48" viewBox="0 0 36 48"><path d="M18 0C8.1 0 0 8.1 0 18c0 13.5 18 30 18 30s18-16.5 18-30C36 8.1 27.9 0 18 0z" fill="#ef4444"/><circle cx="18" cy="18" r="8" fill="white"/></svg>`,
            ),
          new kakao.maps.Size(36, 48),
          { offset: new kakao.maps.Point(18, 48) },
        )
      : undefined

    const marker = new kakao.maps.Marker({
      position,
      image: markerImage,
    })

    marker.setMap(map)
    markers.push(marker)

    const infowindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:5px 10px;font-size:12px;font-weight:600;background:white;border:1px solid #ddd;border-radius:6px;white-space:nowrap;">${station.name ?? '이름 없음'}</div>`,
      removable: false,
    })

    kakao.maps.event.addListener(marker, 'mouseover', () => {
      infowindow.open(map, marker)
    })

    kakao.maps.event.addListener(marker, 'mouseout', () => {
      infowindow.close()
    })

    kakao.maps.event.addListener(marker, 'click', () => onMarkerClick(station))
  }
}

