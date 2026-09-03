// 플로팅 튜터봇 위젯 — 우하단 런처 버튼 → 컴팩트 패널.
// 패널 = 작은 VRM 아바타 + 채팅 + 5단계 퀵액션 칩 + 음성/마이크.
// botBus 를 구독해 랜딩 페이지의 "분개봇에게 물어보기"로 자동 열림 + 질문 전송.

import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import styles from './TutorBotWidget.module.css'
import { useTutorBot } from '../hooks/useTutorBot'

// 무거운 three.js/VRM은 위젯을 처음 열 때만 로드 → 랜딩 초기 번들 경량화.
const VRMAvatar = lazy(() => import('./VRMAvatar'))
import { BOT_EVENTS, onBot } from '../lib/botBus'

// PPT 5p 학습 루프(질문→설명→풀이→진단→복습)를 퀵액션으로.
const QUICK_ACTIONS = [
  { label: '🟢 쉬운 설명', prompt: '방금 개념을 회계 초보도 이해할 수 있게 더 쉬운 말로 풀어서 설명해줘.' },
  { label: '🪜 단계별 풀이', prompt: '이 문제를 차변·대변으로 나눠 단계별로 분개해줘. 각 단계가 왜 그런지도 알려줘.' },
  { label: '❓ 왜 그렇게?', prompt: '왜 그렇게 처리되는지 이유를 차근차근 설명해줘.' },
  { label: '📝 비슷한 문제', prompt: '방금 개념을 연습할 수 있는 비슷한 분개 문제를 하나 내줘.' },
  { label: '🔍 오답 진단', prompt: '내가 푼 분개에서 어느 단계가 틀렸는지 단계별로 진단해줘.' },
]

function Bubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`${styles.row} ${isUser ? styles.userRow : styles.botRow}`}>
      {!isUser && <div className={styles.botAvatar}>분</div>}
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.botBubble}`}>
        {msg.text === '' ? <span className={styles.dots}><i /><i /><i /></span> : msg.text}
      </div>
    </div>
  )
}

export default function TutorBotWidget() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false) // 아바타 lazy 마운트(첫 오픈 후 유지)
  const [input, setInput] = useState('')
  const bot = useTutorBot()
  const messagesRef = useRef(null)
  const taRef = useRef(null)

  const openWidget = useCallback(() => {
    setMounted(true)
    setOpen(true)
    bot.startSession()
  }, [bot])

  // botBus 구독 — 랜딩에서 askBot()/openBot()/closeBot() 호출에 반응
  useEffect(() => {
    const offAsk = onBot(BOT_EVENTS.ASK, (e) => {
      openWidget()
      const prompt = e.detail?.prompt
      if (prompt && e.detail?.autoSend !== false) setTimeout(() => bot.sendMessage(prompt), 350)
      else if (prompt) setInput(prompt)
    })
    const offOpen = onBot(BOT_EVENTS.OPEN, () => openWidget())
    const offClose = onBot(BOT_EVENTS.CLOSE, () => setOpen(false))
    return () => { offAsk(); offOpen(); offClose() }
  }, [openWidget, bot])

  // 메시지 늘면 맨 아래로
  useEffect(() => {
    if (open) messagesRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' })
  }, [bot.messages, open])

  const handleSend = () => {
    const t = input.trim()
    if (!t || bot.isProcessing) return
    setInput('')
    if (taRef.current) taRef.current.style.height = 'auto'
    bot.sendMessage(t)
  }
  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }
  const handleInput = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px'
  }

  const speaking = bot.status === 'speaking'

  return (
    <>
      {/* 런처 버튼 */}
      {!open && (
        <button className={styles.launcher} onClick={openWidget} aria-label="분개봇 열기">
          <span className={styles.launcherIcon}>🤖</span>
          <span className={styles.launcherText}>분개봇</span>
          <span className={styles.launcherPulse} aria-hidden="true" />
        </button>
      )}

      {/* 패널 — 첫 오픈 후엔 DOM 유지(아바타·세션 보존), open 클래스로 표시 토글 */}
      {mounted && (
        <div className={`${styles.panel} ${open ? styles.panelOpen : ''}`} role="dialog" aria-label="분개봇 채팅">
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={`${styles.statusDot} ${speaking ? styles.dotSpeak : styles.dotOn}`} />
              <span className={styles.title}>분개봇</span>
              <span className={styles.subtitle}>회계 학습 친구</span>
            </div>
            <div className={styles.headerBtns}>
              <button
                className={styles.iconBtn}
                onClick={bot.toggleVoice}
                title={bot.voiceEnabled ? '음성 끄기' : '음성 켜기'}
                aria-label="음성 토글"
              >{bot.voiceEnabled ? '🔊' : '🔇'}</button>
              <button className={styles.iconBtn} onClick={() => { bot.interrupt(); setOpen(false) }} title="닫기" aria-label="닫기">✕</button>
            </div>
          </div>

          {/* 작은 아바타 */}
          <div className={`${styles.avatarStage} ${speaking ? styles.avatarSpeaking : ''}`}>
            <Suspense fallback={null}>
              <VRMAvatar
                ref={bot.vrmAvatarRef}
                vrmUrl="/avatar.vrm"
                onReady={bot.onAvatarReady}
                onError={() => {}}
                style={{ opacity: bot.avatarReady ? 1 : 0, transition: 'opacity .35s ease' }}
              />
            </Suspense>
            {!bot.avatarReady && <div className={styles.avatarLoading}><span className={styles.spinner} /></div>}
            {speaking && (
              <button className={styles.interrupt} onClick={bot.interrupt} title="그만 말하기">⏸ 그만</button>
            )}
          </div>

          {/* 메시지 */}
          <div className={styles.messages} ref={messagesRef}>
            {bot.messages.map((m, i) => <Bubble key={i} msg={m} />)}
          </div>

          {/* 5단계 퀵액션 칩 */}
          <div className={styles.chips}>
            {QUICK_ACTIONS.map((q) => (
              <button
                key={q.label}
                className={styles.chip}
                disabled={bot.isProcessing}
                onClick={() => bot.sendMessage(q.prompt)}
              >{q.label}</button>
            ))}
          </div>

          {/* 입력 */}
          <div className={styles.inputRow}>
            <button
              className={`${styles.micBtn} ${bot.isListening ? styles.micOn : ''}`}
              onClick={bot.toggleMic}
              title={bot.isListening ? '듣기 중지' : '음성으로 질문'}
              aria-label="마이크"
            >{bot.isListening ? '■' : '🎙'}</button>
            <textarea
              ref={taRef}
              className={styles.textarea}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKey}
              placeholder={bot.isListening ? '듣고 있어요…' : '회계 개념을 물어보세요…'}
              rows={1}
              disabled={bot.isProcessing}
            />
            <button className={styles.sendBtn} onClick={handleSend} disabled={bot.isProcessing || !input.trim()}>
              {bot.isProcessing ? <span className={styles.spinnerSm} /> : '↑'}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
