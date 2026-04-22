type Env = {
  OPINET_API_KEY: string
}

import proj4 from 'proj4'

const OPINET_BASE_URL = 'https://www.opinet.co.kr/api/aroundAll.do'
const OPINET_OUTPUT_FORMAT = 'json'

const RADIUS_MAX_METERS = 5000
const DEFAULT_RADIUS_METERS = 2000
const SORT_BY_PRICE = '1'
const SORT_BY_DISTANCE = '2'
const DEFAULT_SORT = SORT_BY_PRICE

const DEFAULT_PRODUCT_CODE = 'B027' // 보통휘발유
const PRODUCT_CODES = new Set(['B027', 'D047', 'B034', 'C004', 'K015'])

const CACHE_TTL_SECONDS = 90

const EPSG_WGS84 = 'EPSG:4326'
const KATEC = 'KATEC'
// Opinet guide uses "KATEC" coordinates. In practice this is commonly the
// navigation/KTDB KATEC definition (non-EPSG), not EPSG:2097.
// Source examples: Kakao/KTDB coordinate conversion guides.
const KATEC_DEF =
  '+proj=tmerc +lat_0=38 +lon_0=128 +k=0.9999 +x_0=400000 +y_0=600000 +ellps=bessel ' +
  '+towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43 +units=m +no_defs'

type OpinetAroundParams = {
  x: string
  y: string
  radius: number
  prodcd: string
  sort: string
}

function getStringParam(url: URL, key: string): string | null {
  const value = url.searchParams.get(key)
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function clampRadiusMeters(radius: number): number {
  if (!Number.isFinite(radius)) return DEFAULT_RADIUS_METERS
  if (radius <= 0) return DEFAULT_RADIUS_METERS
  return Math.min(radius, RADIUS_MAX_METERS)
}

function parseSort(sortRaw: string | null): string {
  if (sortRaw === SORT_BY_PRICE || sortRaw === SORT_BY_DISTANCE) return sortRaw
  return DEFAULT_SORT
}

function parseProductCode(prodcdRaw: string | null): string {
  if (prodcdRaw && PRODUCT_CODES.has(prodcdRaw)) return prodcdRaw
  return DEFAULT_PRODUCT_CODE
}

let proj4Initialized = false
function ensureProj4Definitions() {
  if (proj4Initialized) return
  proj4.defs(KATEC, KATEC_DEF)
  proj4Initialized = true
}

function wgs84ToKatec(lat: number, lng: number): { x: number; y: number } {
  ensureProj4Definitions()
  const [x, y] = proj4(EPSG_WGS84, KATEC, [lng, lat]) as [number, number]
  return { x, y }
}

function katecToWgs84(x: number, y: number): { lat: number; lng: number } {
  ensureProj4Definitions()
  const [lng, lat] = proj4(KATEC, EPSG_WGS84, [x, y]) as [number, number]
  return { lat, lng }
}

function buildOpinetUrl(env: Env, params: OpinetAroundParams): string {
  const url = new URL(OPINET_BASE_URL)
  url.searchParams.set('code', env.OPINET_API_KEY)
  url.searchParams.set('out', OPINET_OUTPUT_FORMAT)
  url.searchParams.set('x', params.x)
  url.searchParams.set('y', params.y)
  url.searchParams.set('radius', String(params.radius))
  url.searchParams.set('prodcd', params.prodcd)
  url.searchParams.set('sort', params.sort)
  return url.toString()
}

function buildCacheKey(params: OpinetAroundParams): string {
  return [
    'opinet:around',
    `x=${params.x}`,
    `y=${params.y}`,
    `radius=${params.radius}`,
    `prodcd=${params.prodcd}`,
    `sort=${params.sort}`,
  ].join('&')
}

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init?.headers ?? {}),
    },
  })
}

type UnknownRecord = Record<string, unknown>

type NormalizedStation = {
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

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Number(value.replaceAll(',', '').trim())
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function toStringOrNull(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function findFirstStationArray(payload: unknown): UnknownRecord[] | null {
  const visit = (node: unknown): UnknownRecord[] | null => {
    if (Array.isArray(node)) {
      if (node.every((item) => isRecord(item) && ('PRICE' in item || 'OS_NM' in item))) {
        return node as UnknownRecord[]
      }
      for (const item of node) {
        const found = visit(item)
        if (found) return found
      }
      return null
    }
    if (isRecord(node)) {
      for (const value of Object.values(node)) {
        const found = visit(value)
        if (found) return found
      }
    }
    return null
  }

  return visit(payload)
}

function normalizeStations(stations: UnknownRecord[]): NormalizedStation[] {
  return stations.map((s) => {
    const x = toNumber(s.GIS_X_COOR)
    const y = toNumber(s.GIS_Y_COOR)
    const wgs84 =
      x !== null && y !== null ? katecToWgs84(x, y) : { lat: null, lng: null }

    return {
      id: toStringOrNull(s.UNI_ID),
      brand: toStringOrNull(s.POLL_DIV_CD),
      name: toStringOrNull(s.OS_NM),
      price: toNumber(s.PRICE),
      distanceMeters: toNumber(s.DISTANCE),
      x,
      y,
      lat: wgs84.lat,
      lng: wgs84.lng,
    }
  })
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context
  const url = new URL(request.url)

  const xParam = getStringParam(url, 'x')
  const yParam = getStringParam(url, 'y')
  const latParam = getStringParam(url, 'lat')
  const lngParam = getStringParam(url, 'lng')

  if (!env.OPINET_API_KEY) {
    return jsonResponse(
      { error: 'Missing OPINET_API_KEY in server environment.' },
      { status: 500 },
    )
  }

  let x: string | null = xParam
  let y: string | null = yParam

  if ((!x || !y) && latParam && lngParam) {
    const lat = Number(latParam)
    const lng = Number(lngParam)
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      const converted = wgs84ToKatec(lat, lng)
      x = String(converted.x)
      y = String(converted.y)
    }
  }

  if (!x || !y) {
    return jsonResponse(
      {
        error:
          'Missing required query params. Provide either (x, y) in KATEC or (lat, lng) in WGS84.',
      },
      { status: 400 },
    )
  }

  const radiusMetersRaw = Number(getStringParam(url, 'radius') ?? DEFAULT_RADIUS_METERS)
  const radius = clampRadiusMeters(radiusMetersRaw)
  const sort = parseSort(getStringParam(url, 'sort'))
  const prodcd = parseProductCode(getStringParam(url, 'prodcd'))

  const opinetParams: OpinetAroundParams = { x, y, radius, prodcd, sort }
  const cacheKey = buildCacheKey(opinetParams)

  const cache = caches.default
  const cacheUrl = new URL(url.toString())
  cacheUrl.search = ''
  cacheUrl.pathname = `/__cache/${encodeURIComponent(cacheKey)}`
  const cacheRequest = new Request(cacheUrl.toString(), { method: 'GET' })

  const cached = await cache.match(cacheRequest)
  if (cached) {
    const response = new Response(cached.body, cached)
    response.headers.set('x-cache', 'HIT')
    return response
  }

  const opinetUrl = buildOpinetUrl(env, opinetParams)
  const upstreamResponse = await fetch(opinetUrl, {
    headers: {
      'user-agent': 'ep4-oil (Cloudflare Pages Functions)',
    },
  })

  const upstreamText = await upstreamResponse.text()

  // Opinet occasionally returns non-JSON on failures even when out=json.
  // Keep a stable envelope and attempt best-effort JSON parsing.
  let upstreamJson: unknown | null = null
  let normalizedStations: NormalizedStation[] | null = null
  try {
    upstreamJson = JSON.parse(upstreamText)
    const stationArray = findFirstStationArray(upstreamJson)
    normalizedStations = stationArray ? normalizeStations(stationArray) : null
  } catch {
    upstreamJson = null
    normalizedStations = null
  }

  const envelope = {
    ok: upstreamResponse.ok,
    status: upstreamResponse.status,
    requested: opinetParams,
    upstream: {
      url: OPINET_BASE_URL,
    },
    data: upstreamJson,
    stations: normalizedStations,
    raw: upstreamJson ? null : upstreamText,
  }

  const response = jsonResponse(envelope, {
    status: upstreamResponse.ok ? 200 : 502,
    headers: {
      'cache-control': `public, max-age=${CACHE_TTL_SECONDS}`,
      'x-cache': 'MISS',
    },
  })

  context.waitUntil(cache.put(cacheRequest, response.clone()))
  return response
}

