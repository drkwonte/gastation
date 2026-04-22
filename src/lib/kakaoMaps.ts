import { KAKAO_MAPS_APP_KEY } from '../env'

declare global {
  interface Window {
    kakao?: typeof kakao
  }
}

let kakaoMapsLoadPromise: Promise<typeof kakao> | null = null

export function loadKakaoMaps(): Promise<typeof kakao> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Kakao Maps can only be loaded in a browser.'))
  }
  if (window.kakao?.maps) {
    return Promise.resolve(window.kakao)
  }
  if (kakaoMapsLoadPromise) return kakaoMapsLoadPromise

  const appKey = KAKAO_MAPS_APP_KEY
  if (!appKey) {
    return Promise.reject(
      new Error('Missing VITE_KAKAO_MAPS_APP_KEY. Set it in .env.local.'),
    )
  }

  kakaoMapsLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-kakao-maps-sdk="true"]',
    )
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (!window.kakao) return reject(new Error('Kakao SDK loaded but kakao is missing.'))
        window.kakao.maps.load(() => resolve(window.kakao!))
      })
      existingScript.addEventListener('error', () =>
        reject(
          new Error(
            `Failed to load Kakao Maps SDK. Check the JavaScript key and allowed domains. (origin: ${window.location.origin})`,
          ),
        ),
      )
      return
    }

    const script = document.createElement('script')
    script.dataset.kakaoMapsSdk = 'true'
    script.async = true
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false&libraries=services`
    script.onload = () => {
      if (!window.kakao) return reject(new Error('Kakao SDK loaded but kakao is missing.'))
      window.kakao.maps.load(() => resolve(window.kakao!))
    }
    script.onerror = () =>
      reject(
        new Error(
          `Failed to load Kakao Maps SDK. Check the JavaScript key and allowed domains. (origin: ${window.location.origin})`,
        ),
      )
    document.head.appendChild(script)
  })

  return kakaoMapsLoadPromise
}

