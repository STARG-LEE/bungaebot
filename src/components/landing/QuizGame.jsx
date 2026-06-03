// 분개 퀴즈 게임 — 타이머·점수·연속정답. PROBLEMS(단일 차변/대변) 기반 4지선다.
// 결과는 progress 에 누적(취약 단원 분석에 반영) + 최고 기록 저장.

import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './QuizGame.module.css'
import { PROBLEMS } from '../../data/problems'
import { CATEGORIES } from '../../data/concepts'
import { recordAttempt, recordQuiz, useProgress } from '../../lib/progress'
import SectionLabel from './SectionLabel'

const ROUND = 8
const TIME = 22 // 초

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}
const fmt = (d, c) => `(차) ${d} / (대) ${c}`

// 단일 차변/대변 문제만 사용해 4지선다 생성
function buildQuestion(p) {
  const d = p.debit[0], c = p.credit[0]
  const correct = fmt(d, c)
  const set = new Set([correct])
  set.add(fmt(c, d)) // 차/대 뒤바꿈
  const distractors = shuffle(p.options.filter((o) => o !== d && o !== c))
  let di = 0
  while (set.size < 4 && di < distractors.length) {
    const x = distractors[di++]
    set.add(Math.random() < 0.5 ? fmt(x, c) : fmt(d, x))
  }
  // 그래도 부족하면 채움
  for (const o of distractors) { if (set.size >= 4) break; set.add(fmt(d, o)) }
  const opts = shuffle([...set]).slice(0, 4)
  return { problem: p, options: opts, correct }
}

export default function QuizGame() {
  useProgress() // 최고 기록 표시 갱신용 구독
  const [phase, setPhase] = useState('idle') // idle | playing | done
  const [round, setRound] = useState([])
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [picked, setPicked] = useState(null)
  const [locked, setLocked] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIME)
  const [timeSetting, setTimeSetting] = useState(TIME) // 사용자가 슬라이더로 조절

  const eligible = useMemo(() => PROBLEMS.filter((p) => p.debit.length === 1 && p.credit.length === 1), [])

  const start = () => {
    const qs = shuffle(eligible).slice(0, ROUND).map(buildQuestion)
    setRound(qs); setQi(0); setScore(0); setStreak(0); setBestStreak(0); setCorrectCount(0)
    setPicked(null); setLocked(false); setTimeLeft(timeSetting); setPhase('playing')
  }

  const cur = round[qi]

  const answer = useCallback((opt) => {
    if (locked || !cur) return
    setLocked(true)
    setPicked(opt)
    const correct = opt === cur.correct
    recordAttempt({ kind: 'quiz', refId: cur.problem.id, category: cur.problem.category, group: cur.problem.group, correct })
    if (correct) {
      const gained = 100 + timeLeft * 4 + streak * 20
      setScore((s) => s + gained)
      setStreak((st) => { const n = st + 1; setBestStreak((b) => Math.max(b, n)); return n })
      setCorrectCount((c) => c + 1)
    } else {
      setStreak(0)
    }
  }, [locked, cur, timeLeft, streak])

  const nextQ = () => {
    if (qi + 1 >= round.length) {
      recordQuiz({ score, streak: bestStreak })
      setPhase('done')
    } else {
      setQi((i) => i + 1); setPicked(null); setLocked(false); setTimeLeft(timeSetting)
    }
  }

  // 타이머 — 1초마다 감소. 0이 되면 효과에서 시간초과 처리(렌더 중 setState 방지).
  useEffect(() => {
    if (phase !== 'playing' || locked) return
    if (timeLeft <= 0) { answer('__timeout__'); return }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [phase, locked, timeLeft, answer])

  return (
    <section className={styles.section} id="quiz">
      <div className={styles.head}>
        <SectionLabel chapter="CH.03 · QUIZ" ko="분개 퀴즈" />
        <h2 className={styles.title}>🎮 분개 퀴즈 게임</h2>
        <p className={styles.sub}>제한 시간 안에 올바른 분개를 고르세요. 빠르고 연속으로 맞힐수록 점수 UP!</p>
      </div>

      <div className={styles.card}>
        {phase === 'idle' && (
          <div className={styles.center}>
            <span className={styles.bigIcon}>⚡</span>
            <p className={styles.lead}>{ROUND}문제 · 문제당 {timeSetting}초</p>
            <p className={styles.leadSub}>연속 정답 보너스 + 시간 보너스로 최고 점수에 도전!</p>
            <div className={styles.timeCtrl}>
              <div className={`${styles.timeCtrlTop} mono`}>
                <span>제한시간</span><span className={styles.timeVal}>{timeSetting}s</span>
              </div>
              <input
                type="range" min="10" max="40" step="1" value={timeSetting}
                onChange={(e) => setTimeSetting(Number(e.target.value))}
                className={styles.slider}
                aria-label="문제당 제한시간"
              />
              <div className={`${styles.timeMarks} mono`}><span>10s</span><span>25s</span><span>40s</span></div>
            </div>
            <button className={styles.primary} onClick={start}>퀴즈 시작</button>
          </div>
        )}

        {phase === 'playing' && cur && (
          <>
            <div className={styles.hud}>
              <span className={`${styles.hudItem} mono`}>Q <b>{qi + 1}</b>/{round.length}</span>
              <span className={`${styles.hudItem} mono`}>SCORE <b>{score}</b></span>
              <span className={`${styles.hudItem} mono`}>🔥 <b>{streak}</b></span>
            </div>
            <div className={styles.timerTrack}><div className={styles.timerFill} style={{ width: `${(timeLeft / timeSetting) * 100}%`, background: timeLeft <= 5 ? 'var(--red)' : 'var(--green)' }} /></div>

            <div className={styles.qmeta}>
              <span className={styles.qbadge} style={{ background: CATEGORIES[cur.problem.category]?.color }}>{cur.problem.group}</span>
            </div>
            <p className={styles.question}>{cur.problem.question}</p>
            <p className={styles.amount}>금액: <b>{cur.problem.amount}</b></p>

            <div className={styles.opts}>
              {cur.options.map((o) => {
                let cls = styles.opt
                if (locked) {
                  if (o === cur.correct) cls += ' ' + styles.optRight
                  else if (o === picked) cls += ' ' + styles.optWrong
                }
                return <button key={o} className={cls} onClick={() => answer(o)} disabled={locked}>{o}</button>
              })}
            </div>

            {locked && (
              <div className={styles.feedback}>
                <span className={picked === cur.correct ? styles.fbOk : styles.fbNo}>
                  {picked === cur.correct ? '✅ 정답!' : picked === '__timeout__' ? '⏰ 시간 초과' : '❌ 오답'}
                </span>
                <span className={styles.fbExp}>{cur.problem.steps[0]}</span>
                <button className={styles.nextBtn} onClick={nextQ}>{qi + 1 >= round.length ? '결과 보기' : '다음 →'}</button>
              </div>
            )}
          </>
        )}

        {phase === 'done' && (
          <div className={styles.center}>
            <span className={styles.bigIcon}>🏆</span>
            <p className={styles.finalScore}>{score}<small>점</small></p>
            <p className={styles.lead}>{round.length}문제 중 <b>{correctCount}</b>개 정답 · 최고 연속 <b>{bestStreak}</b></p>
            <div className={styles.doneBtns}>
              <button className={styles.primary} onClick={start}>다시 도전</button>
              <a className={styles.secondary} href="#dashboard">약점 보기</a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
