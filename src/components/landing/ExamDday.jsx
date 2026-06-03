// 시험 D-day — 네비바에서 사용. 클릭하면 팝오버로 시험명/날짜 설정.

import { useState } from 'react'
import styles from './ExamDday.module.css'
import { useProgress, getDday, setExam } from '../../lib/progress'

export default function ExamDday() {
  const state = useProgress()
  const dday = getDday(state)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(dday?.title || '회계원리 시험')
  const [date, setDate] = useState(dday?.dateISO || '')

  const save = () => { setExam(title.trim() || '시험', date); setOpen(false) }
  const clear = () => { setExam(null, null); setOpen(false) }

  return (
    <div className={styles.wrap}>
      <button className={styles.chip} onClick={() => setOpen((o) => !o)}>
        {dday ? (
          <>🗓 <b className={dday.days <= 7 ? styles.urgent : ''}>{dday.days >= 0 ? `D-${dday.days}` : `D+${-dday.days}`}</b> <span className={styles.chipTitle}>{dday.title}</span></>
        ) : (
          <>🗓 시험 D-day</>
        )}
      </button>
      {open && (
        <div className={styles.pop}>
          <label className={styles.label}>시험 이름</label>
          <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 중간고사" />
          <label className={styles.label}>날짜</label>
          <input className={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <div className={styles.btns}>
            {dday && <button className={styles.clear} onClick={clear}>삭제</button>}
            <button className={styles.save} onClick={save} disabled={!date}>저장</button>
          </div>
        </div>
      )}
    </div>
  )
}
