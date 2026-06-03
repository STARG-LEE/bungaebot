// 분개봇 — AI 회계 튜터링 서비스 (랜딩 페이지 + 플로팅 튜터봇 위젯).
//
// 메인 페이지: 지식 그래프 · 단계별 분개 연습 · 퀴즈 · 플래시카드 · 개인화 대시보드 · 용어사전.
// 봇: 우하단 플로팅 위젯(작은 VRM 아바타 + 음성 + 5단계 학습 루프).
// 로그인은 선택(익명도 모든 학습 기능 사용 가능, 진도는 기기에 저장).

import { useState, useEffect, useCallback } from 'react'
import styles from './App.module.css'
import NavBar from './components/landing/NavBar'
import Hero from './components/landing/Hero'
import KnowledgeGraph from './components/landing/KnowledgeGraph'
import JournalPractice from './components/landing/JournalPractice'
import QuizGame from './components/landing/QuizGame'
import Flashcards from './components/landing/Flashcards'
import Dashboard from './components/landing/Dashboard'
import Glossary from './components/landing/Glossary'
import Footer from './components/landing/Footer'
import TutorBotWidget from './components/TutorBotWidget'
import AuthModal from './components/AuthModal'
import { getUser, clearAuth, verifyToken } from './lib/api'

export default function App() {
  const [user, setUser] = useState(getUser())
  const [authOpen, setAuthOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // 토큰 검증 — 자동 로그인(있을 때만). 로그인 모달은 강제로 열지 않음(선택).
  useEffect(() => {
    verifyToken().then((u) => { if (u) setUser(u) })
  }, [])

  const toggleTheme = useCallback(() => setTheme((p) => (p === 'light' ? 'dark' : 'light')), [])
  const handleLogout = () => { clearAuth(); setUser(null) }

  return (
    <div className={styles.app}>
      <NavBar
        theme={theme}
        onToggleTheme={toggleTheme}
        user={user}
        onLogin={() => setAuthOpen(true)}
        onLogout={handleLogout}
      />

      <main className={styles.main}>
        <Hero />
        <KnowledgeGraph />
        <JournalPractice />
        <QuizGame />
        <Flashcards />
        <Dashboard />
        <Glossary />
      </main>

      <Footer />

      {/* 플로팅 튜터봇 (우하단) */}
      <TutorBotWidget />

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(u) => { setUser(u); setAuthOpen(false) }}
      />
    </div>
  )
}
