// 지식 그래프 (PPT 6p #1) — 의존성 없는 force-directed SVG.
// 회계원리·중급회계·세법 개념을 노드로, 개념 간 관계를 엣지로 시각화.
// 노드 클릭 → 사이드 패널(쉬운 설명·왜·예시·연결 개념·분개봇에게 물어보기).

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './KnowledgeGraph.module.css'
import { NODES, EDGES, CATEGORIES, NODE_BY_ID, neighborsOf } from '../../data/concepts'
import { askBot } from '../../lib/botBus'
import SectionLabel from './SectionLabel'

// 시뮬레이션 상수 (검증 중 시각적으로 튜닝)
const REPULSION = 4200
const LINK_DIST = 50
const SPRING = 0.03
const CLUSTER = 0.055   // 카테고리별 클러스터 인력 (3그룹으로 모이게)
const DAMP = 0.86
const ALPHA_DECAY = 0.985
const ALPHA_MIN = 0.02
const HUB_DEGREE = 6    // 이 차수 이상(허브)만 기본 라벨 표시 — 나머지는 hover/선택 시

export default function KnowledgeGraph() {
  const wrapRef = useRef(null)
  const svgRef = useRef(null)
  const posRef = useRef(new Map())
  const rafRef = useRef(0)
  const alphaRef = useRef(1)
  const dragRef = useRef(null) // { id } | { pan:true, sx, sy, tx0, ty0 }
  const viewRef = useRef({ tx: 0, ty: 0, k: 1 })

  const [size, setSize] = useState({ w: 800, h: 560 })
  const [, setTick] = useState(0)
  const [view, setView] = useState({ tx: 0, ty: 0, k: 1 })
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  // 노드 차수(연결 수) → 크기
  const degree = useMemo(() => {
    const d = {}
    for (const e of EDGES) { d[e.source] = (d[e.source] || 0) + 1; d[e.target] = (d[e.target] || 0) + 1 }
    return d
  }, [])

  const visibleIds = useMemo(() => {
    const set = new Set()
    for (const n of NODES) {
      const catOk = filter === 'all' || n.category === filter
      if (catOk) set.add(n.id)
    }
    return set
  }, [filter])

  const searchHit = useMemo(() => {
    const q = query.trim()
    if (!q) return null
    return NODES.find((n) => n.label.includes(q) || (n.plain || '').includes(q))?.id || null
  }, [query])

  // 위치 초기화 — 카테고리별로 좌/중/우 영역에 흩뿌려 클러스터 시드
  const initPositions = (w, h) => {
    const regionX = { principles: w * 0.3, intermediate: w * 0.62, tax: w * 0.5 }
    const regionY = { principles: h * 0.45, intermediate: h * 0.4, tax: h * 0.72 }
    let i = 0
    for (const n of NODES) {
      if (posRef.current.has(n.id)) continue
      const a = (i * 2.399963) % (Math.PI * 2) // 황금각으로 분산
      const r = 30 + (i % 13) * 9
      posRef.current.set(n.id, {
        x: (regionX[n.category] || w / 2) + Math.cos(a) * r,
        y: (regionY[n.category] || h / 2) + Math.sin(a) * r,
        vx: 0, vy: 0,
      })
      i++
    }
  }

  const reheat = () => { alphaRef.current = Math.max(alphaRef.current, 0.7); ensureLoop() }

  const ensureLoop = () => {
    if (rafRef.current) return
    const loop = () => {
      step()
      setTick((t) => (t + 1) & 0xffff)
      if (alphaRef.current > ALPHA_MIN || dragRef.current) {
        rafRef.current = requestAnimationFrame(loop)
      } else {
        rafRef.current = 0
      }
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  const step = () => {
    const { w, h } = size
    const pos = posRef.current
    const a = alphaRef.current
    const centers = {
      principles: { x: w * 0.30, y: h * 0.40 },
      intermediate: { x: w * 0.70, y: h * 0.38 },
      tax: { x: w * 0.50, y: h * 0.76 },
    }
    const ids = NODES.map((n) => n.id)

    // 반발력
    for (let i = 0; i < ids.length; i++) {
      const pi = pos.get(ids[i]); if (!pi) continue
      for (let j = i + 1; j < ids.length; j++) {
        const pj = pos.get(ids[j]); if (!pj) continue
        let dx = pi.x - pj.x, dy = pi.y - pj.y
        let d2 = dx * dx + dy * dy
        if (d2 < 0.01) { d2 = 0.01; dx = Math.random() - 0.5; dy = Math.random() - 0.5 }
        const f = (REPULSION * a) / d2
        const d = Math.sqrt(d2)
        const fx = (dx / d) * f, fy = (dy / d) * f
        pi.vx += fx; pi.vy += fy
        pj.vx -= fx; pj.vy -= fy
      }
    }
    // 스프링(엣지)
    for (const e of EDGES) {
      const ps = pos.get(e.source), pt = pos.get(e.target)
      if (!ps || !pt) continue
      const dx = pt.x - ps.x, dy = pt.y - ps.y
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01
      const f = (d - LINK_DIST) * SPRING * a
      const fx = (dx / d) * f, fy = (dy / d) * f
      ps.vx += fx; ps.vy += fy
      pt.vx -= fx; pt.vy -= fy
    }
    // 카테고리 클러스터 인력 + 적분
    const drag = dragRef.current
    for (const n of NODES) {
      const p = pos.get(n.id); if (!p) continue
      if (drag && drag.id === n.id) { p.vx = 0; p.vy = 0; continue }
      const c = centers[n.category] || { x: w / 2, y: h / 2 }
      p.vx += (c.x - p.x) * CLUSTER * a
      p.vy += (c.y - p.y) * CLUSTER * a
      p.x += p.vx * DAMP
      p.y += p.vy * DAMP
      p.vx *= DAMP; p.vy *= DAMP
    }
    alphaRef.current = Math.max(0, a * ALPHA_DECAY)
  }

  // 동기 워밍업 — rAF 없이 N스텝 정착 후 1회 렌더. (브라우저 rAF 스로틀과 무관하게 즉시 표시)
  const settle = (steps) => {
    for (let i = 0; i < steps && alphaRef.current > ALPHA_MIN; i++) step()
    setTick((t) => (t + 1) & 0xffff)
  }

  // 크기 측정
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth || 800
      const h = el.clientHeight || 560
      setSize({ w, h })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // 초기화 — 동기 워밍업으로 즉시 정착·렌더. rAF는 드래그 등 상호작용에서만 사용.
  useEffect(() => {
    initPositions(size.w, size.h)
    alphaRef.current = 1
    settle(320)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = 0 }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.w, size.h])

  // 검색 매칭 → 선택 + 재가열
  useEffect(() => {
    if (searchHit) { setSelected(searchHit); reheat() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchHit])

  // ── 좌표 변환 ──
  const toGraph = (clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect()
    const { tx, ty, k } = viewRef.current
    return { x: (clientX - rect.left - tx) / k, y: (clientY - rect.top - ty) / k }
  }
  const applyView = (v) => { viewRef.current = v; setView(v) }

  const onPointerDownNode = (e, id) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    dragRef.current = { id }
    setSelected(id)
    reheat()
  }
  const onPointerDownBg = (e) => {
    const { tx, ty } = viewRef.current
    dragRef.current = { pan: true, sx: e.clientX, sy: e.clientY, tx0: tx, ty0: ty }
  }
  const onPointerMove = (e) => {
    const drag = dragRef.current
    if (!drag) return
    if (drag.pan) {
      applyView({ ...viewRef.current, tx: drag.tx0 + (e.clientX - drag.sx), ty: drag.ty0 + (e.clientY - drag.sy) })
    } else if (drag.id) {
      const g = toGraph(e.clientX, e.clientY)
      const p = posRef.current.get(drag.id)
      if (p) { p.x = g.x; p.y = g.y; p.vx = 0; p.vy = 0 }
      reheat()
    }
  }
  const onPointerUp = () => { dragRef.current = null }
  const onWheel = (e) => {
    e.preventDefault()
    const rect = svgRef.current.getBoundingClientRect()
    const { tx, ty, k } = viewRef.current
    const mx = e.clientX - rect.left, my = e.clientY - rect.top
    const nk = Math.min(2.4, Math.max(0.4, k * (e.deltaY < 0 ? 1.12 : 0.89)))
    // 커서 기준 줌
    applyView({ k: nk, tx: mx - ((mx - tx) / k) * nk, ty: my - ((my - ty) / k) * nk })
  }

  const selNode = selected ? NODE_BY_ID[selected] : null
  const neighborIds = useMemo(() => {
    if (!selected) return new Set()
    return new Set(neighborsOf(selected).map((n) => n.id))
  }, [selected])

  const pos = posRef.current
  const nodeR = (id) => 8 + Math.min(10, (degree[id] || 0) * 1.1)
  // 기본은 허브(고차수)만 라벨 표시 → 복잡도↓. 선택·이웃·hover 노드는 항상 표시.
  const showLabel = (id) => (degree[id] || 0) >= HUB_DEGREE || selected === id || neighborIds.has(id) || hovered === id

  const isDim = (id) => {
    if (!visibleIds.has(id)) return true
    if (selected) return id !== selected && !neighborIds.has(id)
    if (searchHit) return id !== searchHit
    return false
  }

  return (
    <section className={styles.section} id="graph">
      <div className={styles.head}>
        <div>
          <SectionLabel chapter="CH.01 · GRAPH" ko="지식 그래프" />
          <h2 className={styles.title}>🕸 지식 그래프</h2>
          <p className={styles.sub}>개념이 어떻게 연결되는지 한눈에. 노드를 누르면 쉬운 설명과 연결된 개념이 나와요.</p>
        </div>
        <input
          className={styles.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="개념 검색 (예: 감가상각, 부가가치세)"
        />
      </div>

      <div className={styles.filters}>
        <button className={`${styles.fbtn} ${filter === 'all' ? styles.fOn : ''}`} onClick={() => setFilter('all')}>전체</button>
        {Object.values(CATEGORIES).map((c) => (
          <button
            key={c.id}
            className={`${styles.fbtn} ${filter === c.id ? styles.fOn : ''}`}
            style={filter === c.id ? { background: c.color, borderColor: c.color, color: '#fff' } : { borderColor: c.color, color: c.color }}
            onClick={() => setFilter(c.id)}
          >{c.label}</button>
        ))}
        <span className={styles.hint}>드래그·휠 · 노드 위에 올리면 이름 표시</span>
      </div>

      <div className={styles.canvasRow}>
        <div className={styles.graphWrap} ref={wrapRef}>
          <svg
            ref={svgRef}
            className={styles.svg}
            width={size.w}
            height={size.h}
            onPointerDown={onPointerDownBg}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onWheel={onWheel}
          >
            <g transform={`translate(${view.tx},${view.ty}) scale(${view.k})`}>
              {EDGES.map((e, i) => {
                const a = pos.get(e.source), b = pos.get(e.target)
                if (!a || !b) return null
                const hot = selected && (e.source === selected || e.target === selected)
                const dim = isDim(e.source) || isDim(e.target)
                return (
                  <line
                    key={i}
                    x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    className={`${styles.edge} ${hot ? styles.edgeHot : ''}`}
                    style={{ opacity: dim ? 0.04 : hot ? 0.9 : 0.13 }}
                  />
                )
              })}
              {NODES.map((n) => {
                const p = pos.get(n.id)
                if (!p) return null
                const r = nodeR(n.id)
                const color = CATEGORIES[n.category]?.color || '#888'
                const dim = isDim(n.id)
                const isSel = selected === n.id
                return (
                  <g
                    key={n.id}
                    transform={`translate(${p.x},${p.y})`}
                    className={styles.node}
                    style={{ opacity: dim ? 0.18 : 1, cursor: 'pointer' }}
                    onPointerDown={(e) => onPointerDownNode(e, n.id)}
                    onPointerEnter={() => setHovered(n.id)}
                    onPointerLeave={() => setHovered((hv) => (hv === n.id ? null : hv))}
                  >
                    <circle r={r} fill={color} stroke={isSel ? '#fff' : 'rgba(0,0,0,0.15)'} strokeWidth={isSel ? 3 : 1} className={isSel ? styles.selCircle : ''} />
                    {showLabel(n.id) && (
                      <text className={styles.label} y={r + 11} style={{ fontWeight: isSel ? 700 : 400 }}>{n.label}</text>
                    )}
                  </g>
                )
              })}
            </g>
          </svg>

          <div className={styles.legend}>
            {Object.values(CATEGORIES).map((c) => (
              <span key={c.id} className={styles.legendItem}><i style={{ background: c.color }} />{c.label}</span>
            ))}
          </div>
          <div className={styles.count}>{NODES.length}개 개념 · {EDGES.length}개 연결</div>
        </div>

        {/* 상세 패널 */}
        <aside className={`${styles.detail} ${selNode ? styles.detailOpen : ''}`}>
          {selNode ? (
            <>
              <div className={styles.detailHead}>
                <span className={styles.badge} style={{ background: CATEGORIES[selNode.category]?.color }}>
                  {CATEGORIES[selNode.category]?.label} · {selNode.group}
                </span>
                <button className={styles.closeDetail} onClick={() => setSelected(null)} aria-label="닫기">✕</button>
              </div>
              <h3 className={styles.detailTitle}>{selNode.label}</h3>
              <p className={styles.plain}>{selNode.plain}</p>
              {selNode.why && (<div className={styles.block}><span className={styles.blockLabel}>왜 그렇게?</span><p>{selNode.why}</p></div>)}
              {selNode.example && (<div className={styles.block}><span className={styles.blockLabel}>예시</span><p className={styles.example}>{selNode.example}</p></div>)}
              <div className={styles.block}>
                <span className={styles.blockLabel}>연결된 개념</span>
                <div className={styles.neighbors}>
                  {neighborsOf(selNode.id).map((nb) => (
                    <button key={nb.id} className={styles.nbChip} style={{ borderColor: CATEGORIES[nb.category]?.color }} onClick={() => { setSelected(nb.id); reheat() }}>
                      {nb.label}
                    </button>
                  ))}
                </div>
              </div>
              <button className={styles.askBtn} onClick={() => askBot(`"${selNode.label}" 개념을 회계 초보도 이해하게 쉽게, 왜 그렇게 처리되는지 단계별로 설명해줘.`)}>
                🤖 분개봇에게 물어보기
              </button>
            </>
          ) : (
            <div className={styles.detailEmpty}>
              <span className={styles.emptyIcon}>👆</span>
              <p>노드를 눌러 개념을 살펴보세요.</p>
              <p className={styles.emptySub}>회계원리 → 중급회계 → 세법이 어떻게 이어지는지 연결선을 따라가 보세요. (예: <b>법인세회계 ↔ 법인세법</b>)</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
