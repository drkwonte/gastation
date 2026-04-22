import styles from './StaticPage.module.css'

export function ContactPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Contact</h1>
      <p className={styles.lead}>
        문의/제안은 아래 채널로 남겨주세요. 
      </p>

      <section className={styles.section}>
        <h2>연락처</h2>
        <ul>
          <li>
            Email: <code>drkwonte@gmail.com</code>
          </li>
        </ul>
      </section>
    </div>
  )
}

