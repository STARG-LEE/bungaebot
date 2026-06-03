// 개념 플래시카드 — 카드 뒤집기 + 간이 SRS(Leitner). "알았어요/다시" 로 복습 간격 조절.

import { useMemo, useState } from 'react'
import styles from './Flashcards.module.css'
import { FLASHCARDS } from '../../data/flashcards'
import { CATEGORIES } from '../../data/concepts'
import { reviewCard, useProgress } from '../../lib/progress'
import { askBot } from '../../lib/botBus'
import SectionLabel from './SectionLabel'

export default function Flashcards() {
  const state = useProgress()
  const [filter, setFilter] = useState('all')

  // 덱: 필터 적용 후, 박스 낮은(덜 외운) 카드 먼저
  const deck = useMemo(() => {
    const cards = FLASHCARDS.filter((c) => filter === 'all' || c.category === filter)
    return [...cards].sort((a, b) => (state.flashcards[a.id]?.box || 1) - (state.flashcards[b.id]?.box || 1))
  }, [filter, state.flashcards])

  const [pos, setPos] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const card = deck[Math.min(pos, deck.length - 1)] || FLASHCARDS[0]

  const mastered = useMemo(() => FLASHCARDS.filter((c) => (state.flashcards[c.id]?.box || 1) >= 5).length, [state.flashcards])

  const advance = () => { setFlipped(false); setPos((p) => (p + 1) % deck.length) }
  const grade = (ok) => { reviewCard(card.id, ok); advance() }
  const box = state.flashcards[card.id]?.box || 1

  return (
    <section className={styles.section} id="flashcards">
      <div className={styles.head}>
        <div>
          <SectionLabel chapter="CH.04 · CARDS" ko="플래시카드" />
          <h2 className={styles.title}>🃏 개념 플래시카드</h2>
          <p className={styles.sub}>카드를 눌러 뒤집고, 외운 정도를 표시하면 덜 외운 카드가 먼저 나와요.</p>
        </div>
        <div className={styles.progress}>완전암기 <b>{mastered}</b>/{FLASHCARDS.length}</div>
      </div>

      <div className={styles.filters}>
        <button className={`${styles.fbtn} ${filter === 'all' ? styles.fOn : ''}`} onClick={() => { setFilter('all'); setPos(0); setFlipped(false) }}>전체</button>
        {Object.values(CATEGORIES).map((c) => (
          <button key={c.id} className={`${styles.fbtn} ${filter === c.id ? styles.fOn : ''}`} onClick={() => { setFilter(c.id); setPos(0); setFlipped(false) }}>{c.label}</button>
        ))}
      </div>

      <div className={styles.stage}>
        <button className={`${styles.card} ${flipped ? styles.flipped : ''}`} onClick={() => setFlipped((f) => !f)} aria-label="카드 뒤집기">
          <div className={styles.inner}>
            <div className={styles.front}>
              <span className={styles.cardBadge} style={{ background: CATEGORIES[card.category]?.color }}>{card.group}</span>
              <p className={styles.frontText}>{card.front}</p>
              <span className={styles.tapToFlip}>눌러서 정답 보기</span>
            </div>
            <div className={styles.back}>
              <p className={styles.backText}>{card.back}</p>
              <span className={styles.boxTag}>복습 단계 {box}/5</span>
            </div>
          </div>
        </button>
      </div>

      <div className={styles.controls}>
        <button className={styles.again} onClick={() => grade(false)}>다시 볼래요</button>
        <button className={styles.ask} onClick={() => askBot(`"${card.front}" — 이 개념을 예시를 들어 쉽게 설명해줘.`)}>🤖 더 알아보기</button>
        <button className={styles.got} onClick={() => grade(true)}>알았어요 👍</button>
      </div>
      <p className={styles.counter}>{Math.min(pos + 1, deck.length)} / {deck.length}</p>
    </section>
  )
}
