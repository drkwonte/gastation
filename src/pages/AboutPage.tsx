import styles from './StaticPage.module.css'

export function AboutPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>주유성지</h1>
      <p className={styles.lead}>
        주유성지는 오피넷(Opinet) 공개 API를 활용해 주변 최저가 주유소를 빠르게 찾을 수 있는 웹앱입니다.
      </p>

      <section className={styles.section}>
        <h2>어떻게 사용하나요?</h2>
        <ul>
          <li>
            <strong>현재 위치로 검색</strong>: 현재 위치 버튼을 누르면 내 위치 기준으로 지도가 이동합니다.
          </li>
          <li>
            <strong>지역명으로 검색</strong>: 검색창에 지역명(예: 서현동, 정자역, 올림픽공원)을 입력하고 "이동" 버튼을 누르면 해당 지역으로 지도가 이동합니다.
          </li>
          <li>
            <strong>지도 이동</strong>: 지도를 드래그하거나 터치하여 원하는 위치로 이동할 수 있습니다.
          </li>
          <li>
            <strong>주유소 조회</strong>: 지도 위치를 정한 후 "주변 최저가 조회" 버튼을 누르면 해당 위치 기준으로 주변 주유소 가격을 검색합니다.
          </li>
          <li>
            <strong>유종 및 반경 선택</strong>: 원하는 유종(휘발유, 경유 등)과 검색 반경(2km, 5km 등)을 선택할 수 있습니다.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>데이터 출처</h2>
        <p>
          유가 데이터는 <strong>한국석유공사 오피넷(Opinet)</strong> 공개 API를 사용합니다. 
          가격 업데이트 시각 및 상세 정책은 오피넷 가이드를 참고하세요.
        </p>
      </section>
    </div>
  )
}
