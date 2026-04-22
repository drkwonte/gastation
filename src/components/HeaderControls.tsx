import type { ProductCode } from '../types/opinet'
import { PRODUCT_OPTIONS, RADIUS_OPTIONS_METERS } from '../env'
import { Button } from './ui/button'
import { Input } from './ui/input'
import styles from './HeaderControls.module.css'

export function HeaderControls(props: {
  placeQuery: string
  setPlaceQuery: (value: string) => void
  onMoveToPlace: () => void
  isPlaceSearching: boolean
  productCode: ProductCode
  setProductCode: (value: ProductCode) => void
  radiusMeters: number
  setRadiusMeters: (value: number) => void
  onMoveToCurrentLocation: () => void
  onSearchAround: () => void
  isMapReady: boolean
  isSearching: boolean
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <div className={styles.label}>지역 검색</div>
        <div className="grid grid-cols-[1fr_76px] gap-2 items-center">
          <Input
            value={props.placeQuery}
            onChange={(e) => props.setPlaceQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') props.onMoveToPlace()
            }}
            placeholder="서현동, 정자역, 올림픽공원, 강남구…"
            aria-label="지역 또는 지명 검색"
          />
          <Button
            variant="secondary"
            className="w-[76px]"
            onClick={props.onMoveToPlace}
            disabled={!props.isMapReady || props.isPlaceSearching}
          >
            {props.isPlaceSearching ? '검색…' : '이동'}
          </Button>
        </div>
      </div>

      <div className="grid gap-2">
        <div className={styles.label}>유가 관련 정보</div>
        <div className="grid grid-cols-2 gap-2">
          <select
            className={styles.selectBase}
            value={props.productCode}
            onChange={(e) => props.setProductCode(e.target.value as ProductCode)}
          >
            {PRODUCT_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            className={styles.selectBase}
            value={props.radiusMeters}
            onChange={(e) => props.setRadiusMeters(Number(e.target.value))}
          >
            {RADIUS_OPTIONS_METERS.map((meters) => (
              <option key={meters} value={meters}>
                {meters >= 1000 ? `${meters / 1000}km` : `${meters}m`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="ghost"
          className="w-full bg-slate-700 text-white hover:bg-slate-800"
          onClick={props.onMoveToCurrentLocation}
          disabled={!props.isMapReady}
        >
          현재 위치
        </Button>
        <Button
          variant="ghost"
          className="w-full bg-slate-700 text-white hover:bg-slate-800"
          onClick={props.onSearchAround}
          disabled={!props.isMapReady || props.isSearching}
        >
          {props.isSearching ? '조회 중…' : '주변 최저가 조회'}
        </Button>
      </div>
    </div>
  )
}

