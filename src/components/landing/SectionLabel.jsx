// 섹션 이브로우 — PPT의 "CH.0X · LABEL  한글설명" 모노스페이스 라벨.

import styles from './SectionLabel.module.css'

export default function SectionLabel({ chapter, ko }) {
  return (
    <div className={styles.wrap}>
      <span className={styles.tag}>{chapter}</span>
      {ko && <span className={styles.ko}>{ko}</span>}
    </div>
  )
}
