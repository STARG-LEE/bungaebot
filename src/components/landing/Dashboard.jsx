// 개인화 대시보드 (PPT 6p #3, 7p) — 오답 패턴·취약 단원 시각화·복습 추천·진도 통계.
// lib/progress 의 누적 데이터를 읽어 보여준다(로그인 불필요, 로컬 저장).

import { useMemo } from 'react'
import styles from './Dashboard.module.css'
import { useProgress, computeStats, getWrongAttempts, getDday, resetAll } from '../../lib/progress'
import { PROBLEM_BY_ID, PROBLEMS } from '../../data/problems'
import { CATEGORIES } from '../../data/concepts'
import { askBot, loadPractice } from '../../lib/botBus'
import SectionLabel from './SectionLabel'

const catColor = (c) => CATEGORIES[c]?.color || '#888'

export default function Dashboard() {
  const state = useProgress()
  const stats = useMemo(() => computeStats(state), [state])
  const wrong = useMemo(() => getWrongAttempts(state, 6), [state])
  const dday = getDday(state)

  // 복습 추천: 취약 단원(weakGroups)에서 문제를 골라 추천
  const recommend = useMemo(() => {
    const out = []
    const used = new Set()
    for (const g of stats.weakGroups) {
      if (g.rate >= 80) continue
      const cand = PROBLEMS.filter((p) => p.group === g.group && !used.has(p.id))
      for (const p of cand) {
        out.push(p); used.add(p.id)
        if (out.length >= 4) return out
        break // 단원당 1개씩 다양하게
      }
    }
    return out
  }, [stats.weakGroups])

  const hasData = stats.total > 0

  return (
    <section className={styles.section} id="dashboard">
      <div className={styles.head}>
        <div>
          <SectionLabel chapter="CH.05 · DIAGNOSE" ko="개인화 진단" />
          <h2 className={styles.title}>📊 나의 학습 대시보드</h2>
          <p className={styles.sub}>오답을 분석해 <b>취약 단원</b>을 진단하고 <b>복습 문제</b>를 추천해요. (이 기기에 저장)</p>
        </div>
        {hasData && <button className={styles.reset} onClick={() => { if (confirm('학습 기록을 모두 지울까요?')) resetAll() }}>기록 초기화</button>}
      </div>

      {/* 상단 통계 카드 */}
      <div className={styles.stats}>
        <StatCard label="푼 문제" value={stats.total} unit="개" />
        <StatCard label="정답률" value={stats.accuracy} unit="%" accent />
        <StatCard label="틀린 문제" value={stats.wrong} unit="개" />
        <StatCard label="퀴즈 최고 연속" value={stats.quizBest.streak} unit="연속" />
        {dday && <StatCard label={`D-day · ${dday.title}`} value={dday.days >= 0 ? `D-${dday.days}` : `D+${-dday.days}`} unit="" dday />}
      </div>

      {!hasData ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🌱</span>
          <p>아직 기록이 없어요. <b>분개 연습</b>이나 <b>퀴즈</b>를 풀면<br />여기에 약점 분석과 복습 추천이 나타나요.</p>
          <a className={styles.emptyBtn} href="#practice">분개 연습 시작하기 →</a>
        </div>
      ) : (
        <div className={styles.grid}>
          {/* 취약 단원 막대그래프 */}
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>단원별 정답률 (취약한 순)</h3>
            <div className={styles.bars}>
              {stats.weakGroups.map((g) => (
                <div key={g.category + g.group} className={styles.barRow}>
                  <div className={styles.barLabel} title={`${g.category} · ${g.group}`}>
                    <span className={styles.dot} style={{ background: catColor(g.category) }} />
                    {g.group}
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ width: `${g.rate}%`, background: catColor(g.category) }} />
                  </div>
                  <span className={styles.barPct}>{g.rate}% <span className={styles.barCnt}>({g.correct}/{g.attempts})</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* 오답노트 */}
          <div className={styles.panel}>
            <h3 className={styles.panelTitle}>📒 오답노트</h3>
            {wrong.length === 0 ? (
              <p className={styles.allClear}>👏 최근 오답이 없어요! 잘하고 있어요.</p>
            ) : (
              <ul className={styles.wrongList}>
                {wrong.map((a) => {
                  const p = PROBLEM_BY_ID[a.refId]
                  if (!p) return null
                  return (
                    <li key={a.id} className={styles.wrongItem}>
                      <span className={styles.wrongGroup} style={{ color: catColor(a.category) }}>{a.group}</span>
                      <span className={styles.wrongQ}>{p.question}</span>
                      <button className={styles.miniAsk} onClick={() => askBot(`이 분개 문제를 단계별로 쉽게 풀이해줘: ${p.question}`)}>봇에게 풀이 듣기</button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* 복습 추천 */}
          <div className={`${styles.panel} ${styles.full}`}>
            <h3 className={styles.panelTitle}>🎯 복습 추천</h3>
            {recommend.length === 0 ? (
              <p className={styles.allClear}>약점 단원이 또렷하지 않아요. 다양한 문제를 더 풀어보면 추천이 정교해져요.</p>
            ) : (
              <div className={styles.recos}>
                {recommend.map((p) => (
                  <div key={p.id} className={styles.reco}>
                    <span className={styles.recoGroup} style={{ background: catColor(p.category) }}>{p.group}</span>
                    <p className={styles.recoQ}>{p.question}</p>
                    <div className={styles.recoActions}>
                      <button className={styles.recoGo} onClick={() => loadPractice(p.id)}>연습하기</button>
                      <button className={styles.recoAsk} onClick={() => askBot(`복습할게요. 이 개념(${p.group})을 쉽게 설명하고, 다음 문제를 단계별로 풀이해줘: ${p.question}`)}>봇에게 묻기</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

function StatCard({ label, value, unit, accent, dday }) {
  return (
    <div className={`${styles.stat} ${accent ? styles.statAccent : ''} ${dday ? styles.statDday : ''}`}>
      <span className={styles.statValue}>{value}<small>{unit}</small></span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}
