import { Link } from 'react-router-dom'
import { POSTS } from '../content/posts'
import styles from './PostsPage.module.css'

export function PostsPage() {
  if (POSTS.length === 0) {
    return <div className={styles.page}></div>
  }

  return (
    <div className={styles.page}>
      {POSTS.map((p) => (
        <Link key={p.slug} to={`/posts/${p.slug}`} className={styles.item}>
          <div className={styles.meta}>{p.date}</div>
          <h2 className={styles.title}>{p.title}</h2>
        </Link>
      ))}
    </div>
  )
}

