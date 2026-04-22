# 내 주변 최저가 주유소 (Vite + React + TS + Cloudflare Pages Functions)

카카오맵에서 지도 중심점 기준으로 Opinet(오피넷) 무료 API를 조회해 **주변 최저가 주유소** 목록을 보여주는 웹앱입니다.

## 로컬 개발 시작

1) 환경변수 파일 준비

- `.env.local` (Vite)
  - `VITE_KAKAO_MAPS_APP_KEY=...`
- `.dev.vars` (Wrangler / Pages Functions)
  - `OPINET_API_KEY=...`

둘 다 예시 파일이 있으니 복사해서 사용하세요.

2) 의존성 설치

```bash
npm install
```

3) Vite + Functions 동시 실행 (추천)

```bash
npm run dev:full
```

브라우저는 Wrangler 쪽(`http://localhost:8788`)으로 접속하면 `/api/*`는 Functions가 처리하고, 나머지는 Vite로 프록시됩니다.

## 스크립트

- `npm run dev`: Vite만 실행
- `npm run dev:cf`: Pages Functions + Vite 프록시 서버만 실행(별도 Vite 실행 필요)
- `npm run dev:full`: Vite + Pages Functions를 동시에 실행
- `npm run build`: 타입체크 + Vite 빌드

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
