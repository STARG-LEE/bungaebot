// 회계 용어 사전 — 검색 + 카테고리 필터. 각 용어에서 분개봇으로 바로 질문.

import { useMemo, useState } from 'react'
import styles from './Glossary.module.css'
import { GLOSSARY } from '../../data/glossary'
import { CATEGORIES } from '../../data/concepts'
import { askBot } from '../../lib/botBus'
import SectionLabel from './SectionLabel'

export default function Glossary() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')

  const list = useMemo(() => {
    const query = q.trim()
    return GLOSSARY.filter((g) => {
      const catOk = filter === 'all' || g.category === filter
      const qOk = !query || g.term.includes(query) || g.plain.includes(query) || (g.example || '').includes(query)
      return catOk && qOk
    })
  }, [q, filter])

  return (
    <section className={styles.section} id="glossary">
      <div className={styles.head}>
        <div>
          <SectionLabel chapter="CH.06 · GLOSSARY" ko="용어 사전" />
          <h2 className={styles.title}>📖 회계 용어 사전</h2>
          <p className={styles.sub}>어려운 용어를 한 줄로 쉽게. 모르는 단어는 바로 분개봇에게 물어보세요.</p>
        </div>
        <input className={styles.search} value={q} onChange={(e) => setQ(e.target.value)} placeholder="용어 검색 (예: 선급비용, 세무조정)" />
      </div>

      <div className={styles.filters}>
        <button className={`${styles.fbtn} ${filter === 'all' ? styles.fOn : ''}`} onClick={() => setFilter('all')}>전체 {GLOSSARY.length}</button>
        {Object.values(CATEGORIES).map((c) => (
          <button key={c.id} className={`${styles.fbtn} ${filter === c.id ? styles.fOn : ''}`} onClick={() => setFilter(c.id)}>{c.label}</button>
        ))}
        <span className={styles.count}>{list.length}개</span>
      </div>

      <div className={styles.grid}>
        {list.map((g) => (
          <div key={g.term} className={styles.item}>
            <div className={styles.itemHead}>
              <span className={styles.term}>{g.term}</span>
              <span className={styles.cat} style={{ background: CATEGORIES[g.category]?.color }}>{g.group}</span>
            </div>
            <p className={styles.plain}>{g.plain}</p>
            {g.example && <p className={styles.example}>예: {g.example}</p>}
            <button className={styles.ask} onClick={() => askBot(`회계 용어 "${g.term}"를 예시를 들어 쉽게 설명해줘.`)}>🤖 더 묻기</button>
          </div>
        ))}
        {list.length === 0 && <p className={styles.none}>검색 결과가 없어요. 다른 단어로 찾아보거나 분개봇에게 직접 물어보세요.</p>}
      </div>
    </section>
  )
}
