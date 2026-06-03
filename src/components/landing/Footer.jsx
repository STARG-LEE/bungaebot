// 푸터 — PPT 마무리(슬라이드10) "CLOSING · ∑ FINAL ENTRY / 결산" 다크그린 섹션.

import styles from './Footer.module.css'
import { openBot } from '../../lib/botBus'

const SUMMARY = [
  { n: '01', en: 'ITEM', t: '쉬운 말 회계 튜터' },
  { n: '02', en: 'PROBLEM', t: '고객 니즈 명확' },
  { n: '03', en: 'SOLUTION', t: '차별화된 AI 풀이' },
  { n: '04', en: 'BM', t: '구독 + 기관 연계' },
  { n: '05', en: 'ROADMAP', t: 'MVP 기반 확장' },
]

export default function Footer() {
  return (
    <footer className={styles.footer} id="about">
      <div className={styles.inner}>
        <div className={styles.eyebrow}>
          <span className={styles.line} />
          <span className="mono">CLOSING · ∑ FINAL ENTRY</span>
        </div>

        <h2 className={styles.headline}>
          문제를 읽고,<br />
          솔루션을 <span className={styles.gold}>만들고,</span><br />
          비즈니스로 <span className={styles.gold}>증명하라!</span>
        </h2>
        <p className={styles.sub}>
          분개봇은 <b>회계 학습자의 막힌 지점</b>을 말로 풀어 주고,<br className={styles.brk} />
          풀이 과정과 오답 진단을 통해 <span className={styles.gold}>학습 성과를 비즈니스로 연결</span>.
        </p>

        <div className={styles.totalRow}>
          <span className={styles.totalLine} />
          <span className={`${styles.totalTag} mono`}>∑ TOTAL · 결산</span>
        </div>

        <div className={styles.cards}>
          {SUMMARY.map((s) => (
            <div key={s.n} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={`${styles.cardNum} mono`}>{s.n}</span>
                <span className={`${styles.cardEn} mono`}>{s.en}</span>
              </div>
              <div className={styles.cardT}>{s.t}</div>
            </div>
          ))}
        </div>

        <div className={styles.finalMsg}>
          <span className={`${styles.fmTag} mono`}>▸ FINAL MESSAGE</span>
          <span className={styles.fmText}>
            분개봇은 회계를 포기하게 만드는 <b className={styles.gold}>‘첫 막힘’</b>을 해결하는 AI 학습 파트너입니다.
          </span>
        </div>

        <div className={styles.bottom}>
          <button className={styles.cta} onClick={() => openBot()}>지금 분개봇과 시작하기 🤖</button>
          <div className={`${styles.meta} mono`}>
            <span>21학번 F5 · 분개해 · 분개봇 LEDGER</span>
            <a href="https://github.com/gjrywjd/my-bot" target="_blank" rel="noopener noreferrer">GITHUB ↗</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
