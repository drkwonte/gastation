import { NavLink, Outlet } from 'react-router-dom'
import styles from './AppShell.module.css'

import { useState, useEffect } from 'react'

export function AppShell() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme')
    return stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <NavLink to="/" className={styles.brand}>
          <img src="/logo.png" alt="주유성지" className={styles.logo} />
          <div className={styles.brandName}>주유성지</div>
        </NavLink>

        <div className={styles.topbarRight}>
          <NavLink to="/posts" className={styles.headerLink}>
            유가 관련 정보
          </NavLink>
          <button
            className={styles.themeToggle}
            onClick={() => setIsDark(!isDark)}
            aria-label="테마 전환"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <Outlet />

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerCopy}>© {new Date().getFullYear()} 주유성지</div>
          <nav className={styles.footerNav} aria-label="Footer">
            <NavLink to="/about" className={styles.footerLink}>
              About
            </NavLink>
            <span className={styles.footerDivider}>·</span>
            <NavLink to="/privacy" className={styles.footerLink}>
              Privacy
            </NavLink>
            <span className={styles.footerDivider}>·</span>
            <NavLink to="/contact" className={styles.footerLink}>
              Contact
            </NavLink>
          </nav>
        </div>
      </footer>
    </div>
  )
}

