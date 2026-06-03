// 상단 네비게이션 — 로고 · 섹션 앵커 · 시험 D-day · 테마 · 로그인(선택).

import styles from './NavBar.module.css'
import ExamDday from './ExamDday'

const LINKS = [
  { href: '#graph', label: '지식그래프' },
  { href: '#practice', label: '분개연습' },
  { href: '#quiz', label: '퀴즈' },
  { href: '#flashcards', label: '카드' },
  { href: '#glossary', label: '용어사전' },
  { href: '#dashboard', label: '대시보드' },
]

export default function NavBar({ theme, onToggleTheme, user, onLogin, onLogout }) {
  return (
    <header className={styles.bar}>
      <a href="#top" className={styles.brand}>
        <span className={styles.logo}>📒</span>
        <span className={styles.brandText}>분개봇</span>
        <span className={styles.brandSub}>AI 회계 튜터</span>
      </a>

      <nav className={styles.nav}>
        {LINKS.map((l) => <a key={l.href} href={l.href} className={styles.link}>{l.label}</a>)}
      </nav>

      <div className={styles.right}>
        <ExamDday />
        <button className={styles.themeBtn} onClick={onToggleTheme} title="테마 전환" aria-label="테마 전환">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        {user ? (
          <>
            <span className={styles.user}>{user.name || user.nickname || '사용자'}님</span>
            <button className={styles.logout} onClick={onLogout}>로그아웃</button>
          </>
        ) : (
          <button className={styles.login} onClick={onLogin}>로그인</button>
        )}
      </div>
    </header>
  )
}
