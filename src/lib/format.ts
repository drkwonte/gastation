export function formatPriceKRW(price: number | null): string {
  if (price === null) return '-'
  return `${price.toLocaleString('ko-KR')}원`
}

export function formatDistanceMeters(distanceMeters: number | null): string {
  if (distanceMeters === null) return '-'
  if (distanceMeters < 1000) return `${Math.round(distanceMeters)}m`
  return `${(distanceMeters / 1000).toFixed(1)}km`
}

