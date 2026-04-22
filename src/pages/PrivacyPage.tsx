import styles from './StaticPage.module.css'

export function PrivacyPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Privacy</h1>
      <p className={styles.lead}>
        FuelWise는 로그인 기능이 없으며, 개인을 식별할 수 있는 정보를 수집하지 않도록 설계했습니다.
      </p>

      <section className={styles.section}>
        <h2>위치 정보</h2>
        <p>
          현재 위치 기능은 브라우저의 위치 권한을 사용합니다. 위치는 지도 표시 및 주변 검색에만
          사용되며, 서버에 저장하지 않습니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2>API 호출</h2>
        <p>
          오피넷 조회는 Cloudflare Functions를 통해 프록시 호출되며, 호출 제한/캐시를 위해 최소한의
          요청 정보가 처리될 수 있습니다.
        </p>
      </section>
    </div>
  )
}

