// 단계별 분개 연습 (PPT 6p #2, 7p) — 문제를 풀고 단계 해설로 진단.
// 계정 칩을 눌러 차변/대변으로 배정 → 채점 → 단계별 해설. 오답은 progress 에 누적.

import { useEffect, useMemo, useState } from 'react'
import styles from './JournalPractice.module.css'
import { PROBLEMS } from '../../data/problems'
import { CATEGORIES } from '../../data/concepts'
import { recordAttempt } from '../../lib/progress'
import { askBot, onBot, BOT_EVENTS } from '../../lib/botBus'
import SectionLabel from './SectionLabel'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const eqSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x))

export default function JournalPractice() {
  const [filter, setFilter] = useState('all')
  const pool = useMemo(() => PROBLEMS.filter((p) => filter === 'all' || p.category === filter), [filter])

  const [idx, setIdx] = useState(0)
  const problem = pool[Math.min(idx, pool.length - 1)] || PROBLEMS[0]

  const [seed, setSeed] = useState(0) // 옵션 셔플 트리거
  const options = useMemo(() => shuffle(problem.options), [problem.id, seed]) // eslint-disable-line react-hooks/exhaustive-deps
  const [assign, setAssign] = useState({}) // { account: 'debit'|'credit' }
  const [submitted, setSubmitted] = useState(false)
  const [hint, setHint] = useState(false)
  const [dragZone, setDragZone] = useState(null) // 드롭 하이라이트: 'debit'|'credit'|'pool'

  const reset = () => { setAssign({}); setSubmitted(false); setHint(false); setDragZone(null) }

  // 대시보드 "연습하기" → 해당 문제를 이 섹션에 로드 + 스크롤
  useEffect(() => onBot(BOT_EVENTS.PRACTICE_LOAD, (e) => {
    const i = PROBLEMS.findIndex((p) => p.id === e.detail?.problemId)
    if (i < 0) return
    setFilter('all'); setIdx(i); setSeed((s) => s + 1)
    setAssign({}); setSubmitted(false); setHint(false); setDragZone(null)
    setTimeout(() => document.getElementById('practice')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }), [])

  const myDebit = Object.keys(assign).filter((k) => assign[k] === 'debit')
  const myCredit = Object.keys(assign).filter((k) => assign[k] === 'credit')
  const accountPool = options.filter((o) => !assign[o])

  // 드래그 앤 드롭
  const onDragStart = (e, acc) => { e.dataTransfer.setData('text/plain', acc); e.dataTransfer.effectAllowed = 'move' }
  const allowDrop = (e, zone) => { e.preventDefault(); setDragZone(zone) }
  const onDropZone = (e, zone) => {
    e.preventDefault(); setDragZone(null)
    if (submitted) return
    const acc = e.dataTransfer.getData('text/plain')
    if (!acc) return
    setAssign((prev) => {
      const o = { ...prev }
      if (zone === 'pool') delete o[acc]
      else o[acc] = zone
      return o
    })
  }
  // 탭(터치) 폴백: 배정 칩 클릭 → 차변→대변→빼기 순환
  const cycleAssigned = (acc) => { if (submitted) return; setAssign((prev) => { const o = { ...prev }; if (o[acc] === 'debit') o[acc] = 'credit'; else delete o[acc]; return o }) }
  const assignTo = (acc, zone) => { if (!submitted) setAssign((prev) => ({ ...prev, [acc]: zone })) }
  const isCorrect = eqSet(myDebit, problem.debit) && eqSet(myCredit, problem.credit)

  const submit = () => {
    if (submitted || (myDebit.length === 0 && myCredit.length === 0)) return
    setSubmitted(true)
    recordAttempt({ kind: 'practice', refId: problem.id, category: problem.category, group: problem.group, correct: isCorrect })
  }

  const next = () => {
    const others = pool.map((_, i) => i).filter((i) => i !== idx)
    const ni = others.length ? others[Math.floor(Math.random() * others.length)] : 0
    setIdx(ni); setSeed((s) => s + 1); reset()
  }

  const askForHelp = () => {
    askBot(`분개 문제를 단계별로 풀이해줘.\n문제: ${problem.question}\n내 답 → 차변: ${myDebit.join(', ') || '(없음)'} / 대변: ${myCredit.join(', ') || '(없음)'}\n어디가 왜 틀렸는지 단계별로 설명해줘.`)
  }

  const cat = CATEGORIES[problem.category]

  return (
    <section className={styles.section} id="practice">
      <div className={styles.head}>
        <div>
          <SectionLabel chapter="CH.02 · PRACTICE" ko="단계별 분개" />
          <h2 className={styles.title}>✍️ 단계별 분개 연습</h2>
          <p className={styles.sub}>계정을 눌러 <b>차변</b>/<b>대변</b>으로 배정하고 채점하세요. 정답만이 아니라 <b>왜 그런지</b> 단계로 알려드려요.</p>
        </div>
      </div>

      <div className={styles.filters}>
        <button className={`${styles.fbtn} ${filter === 'all' ? styles.fOn : ''}`} onClick={() => { setFilter('all'); setIdx(0); reset() }}>전체</button>
        {Object.values(CATEGORIES).map((c) => (
          <button key={c.id} className={`${styles.fbtn} ${filter === c.id ? styles.fOn : ''}`} onClick={() => { setFilter(c.id); setIdx(0); reset() }}>{c.label}</button>
        ))}
      </div>

      <div className={styles.card}>
        <div className={styles.qmeta}>
          <span className={styles.qbadge} style={{ background: cat?.color }}>{cat?.label} · {problem.group}</span>
          <span className={styles.diff}>{'★'.repeat(problem.difficulty)}{'☆'.repeat(3 - problem.difficulty)}</span>
        </div>
        <p className={styles.question}>{problem.question}</p>
        <p className={styles.amount}>금액: <b>{problem.amount}</b></p>

        {/* 차변/대변 드롭존 */}
        <div className={styles.taccount}>
          <div
            className={`${styles.tcol} ${dragZone === 'debit' ? styles.dropActive : ''}`}
            onDragOver={(e) => allowDrop(e, 'debit')}
            onDragLeave={() => setDragZone((z) => (z === 'debit' ? null : z))}
            onDrop={(e) => onDropZone(e, 'debit')}
          >
            <span className={styles.tlabel}>차변 · DEBIT</span>
            <div className={styles.tslots}>
              {myDebit.length ? myDebit.map((a) => (
                <span key={a} className={styles.tchip} draggable={!submitted} onDragStart={(e) => onDragStart(e, a)} onClick={() => cycleAssigned(a)} title="드래그 또는 클릭(차변→대변→빼기)">{a}</span>
              )) : <span className={styles.tempty}>여기로 드래그</span>}
            </div>
          </div>
          <div className={styles.tdivider} />
          <div
            className={`${styles.tcol} ${dragZone === 'credit' ? styles.dropActive : ''}`}
            onDragOver={(e) => allowDrop(e, 'credit')}
            onDragLeave={() => setDragZone((z) => (z === 'credit' ? null : z))}
            onDrop={(e) => onDropZone(e, 'credit')}
          >
            <span className={styles.tlabel}>대변 · CREDIT</span>
            <div className={styles.tslots}>
              {myCredit.length ? myCredit.map((a) => (
                <span key={a} className={styles.tchip} draggable={!submitted} onDragStart={(e) => onDragStart(e, a)} onClick={() => cycleAssigned(a)} title="드래그 또는 클릭(차변→대변→빼기)">{a}</span>
              )) : <span className={styles.tempty}>여기로 드래그</span>}
            </div>
          </div>
        </div>

        {/* 계정 보기 (드래그해서 차변/대변에 놓기) */}
        <div
          className={`${styles.pool} ${dragZone === 'pool' ? styles.dropActive : ''}`}
          onDragOver={(e) => allowDrop(e, 'pool')}
          onDragLeave={() => setDragZone((z) => (z === 'pool' ? null : z))}
          onDrop={(e) => onDropZone(e, 'pool')}
        >
          {accountPool.length ? accountPool.map((acc) => (
            <span key={acc} className={styles.poolChip} draggable={!submitted} onDragStart={(e) => onDragStart(e, acc)} onClick={() => assignTo(acc, 'debit')} title="드래그 또는 클릭(차변에 추가)">{acc}</span>
          )) : <span className={styles.poolEmpty}>모든 계정을 배정했어요 ✓</span>}
        </div>
        <p className={styles.tapHint}>계정을 <b>차변</b>/<b>대변</b> 칸으로 <b>드래그</b>하세요. (배정된 계정은 클릭하면 다시 빠져요)</p>

        {/* 액션 */}
        {!submitted ? (
          <div className={styles.actions}>
            <button className={styles.hintBtn} onClick={() => setHint((h) => !h)}>{hint ? '힌트 숨기기' : '💡 힌트'}</button>
            <button className={styles.submitBtn} onClick={submit} disabled={myDebit.length === 0 && myCredit.length === 0}>채점하기</button>
          </div>
        ) : (
          <div className={styles.actions}>
            <button className={styles.askBtn} onClick={askForHelp}>🤖 분개봇에게 풀이 듣기</button>
            <button className={styles.submitBtn} onClick={next}>다음 문제 →</button>
          </div>
        )}

        {hint && !submitted && <div className={styles.hintBox}>💡 {problem.hint}</div>}

        {/* 결과 + 단계 해설 */}
        {submitted && (
          <div className={`${styles.result} ${isCorrect ? styles.ok : styles.no}`}>
            <div className={styles.resultHead}>{isCorrect ? '✅ 정답이에요!' : '❌ 다시 볼까요?'}</div>
            <div className={styles.answer}>
              <span>정답 → <b>차변</b> {problem.debit.join(', ')} / <b>대변</b> {problem.credit.join(', ')}</span>
            </div>
            <ol className={styles.steps}>
              {problem.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}
