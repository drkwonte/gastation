import type { Station } from '../types/opinet'
import { formatDistanceMeters, formatPriceKRW } from '../lib/format'
import styles from './ResultsPane.module.css'

export function ResultsPane(props: {
  stations: Station[]
  selectedStationId: string | null
  onSelectStation: (id: string) => void
  currentLocation: { lat: number; lng: number } | null
  lastPlaceLabel: string | null
}) {
  const selectedStation =
    props.stations.find((s) => s.id && s.id === props.selectedStationId) ?? null

  return (
    <section className={styles.listSection} aria-label="주유소 목록">
      <div className={styles.listHeader}>
        <h2>결과</h2>
        <span className={styles.count}>{props.stations.length}곳</span>
      </div>

      {props.lastPlaceLabel ? (
        <div className={`${styles.card} ${styles.searchBasis}`}>
          <div className={styles.cardTitle}>검색 기준</div>
          <div className={styles.cardName}>{props.lastPlaceLabel}</div>
        </div>
      ) : null}

      {props.currentLocation ? (
        <div className={`${styles.card} ${styles.currentLocation}`}>
          <div className={styles.cardTitle}>내 위치</div>
          <div className={styles.cardMeta}>
            {props.currentLocation.lat.toFixed(5)}, {props.currentLocation.lng.toFixed(5)}
          </div>
        </div>
      ) : null}

      {selectedStation ? (
        <div className={styles.card}>
          <div className={styles.cardTitle}>선택됨</div>
          <div className={styles.cardName}>{selectedStation.name ?? '이름 없음'}</div>
          <div className={styles.cardMetaRow}>
            <span>{formatPriceKRW(selectedStation.price)}</span>
            <span className={styles.dot} />
            <span>{formatDistanceMeters(selectedStation.distanceMeters)}</span>
          </div>
        </div>
      ) : null}

      <ul className={styles.list}>
        {props.stations.map((s) => {
          const isSelected = Boolean(s.id && s.id === props.selectedStationId)
          return (
            <li
              key={s.id ?? `${s.name}-${s.x}-${s.y}`}
              className={isSelected ? `${styles.item} ${styles.selectedItem}` : styles.item}
            >
              <button
                className={styles.itemButton}
                onClick={() => {
                  if (s.id) props.onSelectStation(s.id)
                }}
              >
                <div className={styles.row}>
                  <div className={styles.name}>{s.name ?? '이름 없음'}</div>
                  <div className={styles.price}>{formatPriceKRW(s.price)}</div>
                </div>
                <div className={`${styles.row} ${styles.meta}`}>
                  <span className={styles.brand}>{s.brand ?? '-'}</span>
                  <span className={styles.dot} />
                  <span>{formatDistanceMeters(s.distanceMeters)}</span>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

