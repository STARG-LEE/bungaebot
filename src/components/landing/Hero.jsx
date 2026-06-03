// 히어로 — PPT 표지(슬라이드1) 룩. 모노 이브로우 + 분개봇 워드마크(그린+골드∑) +
// DR/CR Q&A 카드(차변 파랑·대변 빨강·∑ TOTAL·대차평형) + 5단계 학습 루프.

import styles from './Hero.module.css'
import { openBot, askBot } from '../../lib/botBus'

const STEPS = [
  { n: 1, t: '질문 입력', d: '용어·분개·세법' },
  { n: 2, t: '쉬운 설명', d: '일상 언어로' },
  { n: 3, t: '단계 풀이', d: '차변·대변·T계정' },
  { n: 4, t: '오답 진단', d: '어디서 틀렸는지' },
  { n: 5, t: '복습 추천', d: '약점 기반' },
]

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.inner}>
        {/* 좌: 카피 */}
        <div className={styles.left}>
          <div className={styles.eyebrow}>
            <span className={styles.eyeLine} />
            <span className="mono">AI ACCOUNTING TUTOR · 비즈니스 모델 컴피티션</span>
          </div>
          <p className={styles.kicker}>말로 배우는 AI 회계 튜터</p>
          <h1 className={styles.wordmark}>분개봇<span className={styles.sigma}>∑</span></h1>
          <p className={styles.lead}>
            회계 단어와 분개 문제를 어려워하는 학생에게<br />
            <span className={styles.leadGreen}>말하듯 쉽게 설명하는 AI 튜터링 서비스</span>
          </p>

          <div className={styles.ctas}>
            <button className={styles.primary} onClick={() => openBot()}>🤖 분개봇에게 물어보기</button>
            <a className={styles.secondary} href="#graph">🕸 지식 그래프 보기</a>
          </div>

          <div className={styles.live}>
            <span className={styles.liveDot} />
            <span className={`${styles.liveTag} mono`}>LIVE</span>
            <span className={`${styles.liveUrl} mono`}>my-bot-tawny-ten.vercel.app</span>
          </div>

          <div className={styles.loop}>
            {STEPS.map((s, i) => (
              <div key={s.n} className={styles.step}>
                <span className={styles.stepNum}>{s.n}</span>
                <span className={styles.stepT}>{s.t}</span>
                {i < STEPS.length - 1 && <span className={styles.arrow}>→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* 우: Q&A 분개 카드 */}
        <div className={styles.right}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.who}>
                <span className={styles.botAvatar}>분</span>
                <div>
                  <div className={styles.botName}>분개봇</div>
                  <div className={`${styles.botStatus} mono`}><span className={styles.onDot} />ONLINE · 회계 학습 전용</div>
                </div>
              </div>
              <span className={`${styles.qaTag} mono`}>Q&amp;A · 01</span>
            </div>

            <div className={styles.dashed} />

            <div className={styles.qBubble}>외상매입금이 왜 대변이에요?</div>
            <div className={styles.aBubble}>
              쉽게 말하면, <b>외상매입금</b>은 나중에 갚아야 할 <b className={styles.gold}>의무</b>예요.
            </div>

            {/* DR / CR 표 (차변 파랑 · 대변 빨강) */}
            <div className={styles.entry}>
              <div className={`${styles.half} ${styles.halfDr}`}>
                <div className={`${styles.entryHead} mono`}>차변 · DEBIT</div>
                <div className={styles.entryRow}><span>재고자산</span><span className={styles.amt}>100,000</span></div>
                <div className={`${styles.entryTotal} mono`}><span>∑ TOTAL</span><span className={styles.amt}>100,000</span></div>
              </div>
              <div className={`${styles.half} ${styles.halfCr}`}>
                <div className={`${styles.entryHead} mono`}>대변 · CREDIT</div>
                <div className={styles.entryRow}><span>외상매입금</span><span className={styles.amt}>100,000</span></div>
                <div className={`${styles.entryTotal} mono`}><span>∑ TOTAL</span><span className={styles.amt}>100,000</span></div>
              </div>
            </div>
            <div className={`${styles.balance} mono`}>✓ DEBIT = CREDIT · 대차평형</div>

            <button className={styles.cardAsk} onClick={() => askBot('외상매입금이 왜 대변인지 쉽게 설명해줘.')}>이어서 물어보기 →</button>
          </div>
        </div>
      </div>
    </section>
  )
}
