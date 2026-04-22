import styles from './MapPane.module.css'

export function MapPane(props: { mapContainerRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <section className={styles.mapSection}>
      <div ref={props.mapContainerRef} className={styles.map} />
    </section>
  )
}

