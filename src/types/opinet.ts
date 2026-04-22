export type ProductCode = 'B027' | 'D047' | 'B034' | 'C004' | 'K015'

export type Station = {
  id: string | null
  brand: string | null
  name: string | null
  price: number | null
  distanceMeters: number | null
  x: number | null
  y: number | null
  lat: number | null
  lng: number | null
}

export type AroundApiResponse = {
  ok: boolean
  status: number
  requested: {
    x: string
    y: string
    radius: number
    prodcd: string
    sort: string
  }
  stations: Station[] | null
  raw: string | null
}

