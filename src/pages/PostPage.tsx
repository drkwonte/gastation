import ReactMarkdown from 'react-markdown'
import { Link, useParams } from 'react-router-dom'
import { POSTS } from '../content/posts'
import styles from './PostsPage.module.css'

export function PostPage() {
  const { slug } = useParams()
  const post = POSTS.find((p) => p.slug === slug)

  if (!post) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Not found</h1>
          <p className={styles.subtitle}>해당 글을 찾을 수 없습니다.</p>
          <Link to="/posts" className={styles.backLink}>
            ← Posts로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.meta}>{post.date}</div>
        <h1 className={styles.title}>{post.title}</h1>
        <Link to="/posts" className={styles.backLink}>
          ← Posts로 돌아가기
        </Link>
      </div>

      <article className={styles.markdown}>
        <ReactMarkdown>{post.body}</ReactMarkdown>
      </article>
    </div>
  )
}

