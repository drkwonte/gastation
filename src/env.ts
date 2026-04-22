export const KAKAO_MAPS_APP_KEY = import.meta.env.VITE_KAKAO_MAPS_APP_KEY as
  | string
  | undefined

export const DEFAULT_CENTER = {
  lat: 37.5665, // Seoul city hall
  lng: 126.978,
} as const

export const RADIUS_MAX_METERS = 5000
export const RADIUS_OPTIONS_METERS = [1000, 2000, 3000, 5000] as const

export type ProductCode = import('./types/opinet').ProductCode

export const PRODUCT_OPTIONS: ReadonlyArray<{
  code: ProductCode
  label: string
}> = [
  { code: 'B027', label: '휘발유 (보통)' },
  { code: 'D047', label: '경유' },
  { code: 'B034', label: '고급휘발유' },
  { code: 'C004', label: '등유' },
  { code: 'K015', label: 'LPG' },
]

