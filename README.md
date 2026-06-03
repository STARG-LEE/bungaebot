# 📒 분개봇 — 말로 배우는 AI 회계 튜터

> 회계 단어와 분개 문제가 막막한 학생을 위한 **AI 회계 튜터링 서비스**.
> 정답만이 아니라 **"왜 그렇게 처리되는지"**를 단계별로 풀어 설명합니다. (21학번 F5 · 분개해)

## ✨ 학습 기능 (메인 페이지)

| | |
|---|---|
| 🕸 **지식 그래프** | 회계원리·중급회계·세법 **100여 개 개념을 연결**해 시각화. 노드 클릭 → 쉬운 설명·왜·예시·연결 개념. (예: 법인세회계 ↔ 법인세법) |
| ✍️ **단계별 분개 연습** | 계정을 차변/대변에 배정 → 채점 → **단계별 해설**로 진단. 오답은 자동 누적. |
| 📊 **개인화 대시보드** | 오답 패턴 분석 → **취약 단원 시각화 + 복습 문제 추천** (기기에 저장, 로그인 불필요). |
| 🎮 **분개 퀴즈 게임** | 타이머·점수·연속정답 보너스. 결과는 약점 분석에 반영. |
| 🃏 **개념 플래시카드** | 카드 뒤집기 + 간이 SRS(Leitner)로 덜 외운 카드 우선. |
| 📖 **회계 용어 사전** | 80여 개 용어를 한 줄로 쉽게. 검색·필터. |
| 🗓 **시험 D-day** | 시험 날짜 등록 → 카운트다운. |

## 🤖 플로팅 튜터봇 (우하단 버튼)

| | |
|---|---|
| 💬 **단계별 설명** | 질문 → 쉬운 설명 → 단계 풀이 → 오답 진단 → 복습 (PPT 5단계 학습 루프) |
| 🧍 **3D 아바타** | 컴팩트 위젯 안의 VRM 캐릭터 (말할 때 립싱크) |
| 🗣 **음성** | STT/TTS — 음성으로 묻고 들을 수 있음 (토글) |
| 🔗 **연결** | 그래프·연습·용어의 "분개봇에게 물어보기" → 위젯 자동 열림 + 질문 전송 |

> 학습 콘텐츠(그래프/문제/용어/카드)는 `src/data/*.js`에 구조화되어 있어 **항목만 추가하면 확장**됩니다.
> 봇 채팅은 미들턴 Gemma4 + 팀 RAG(`/api/chat-stream`)를 사용하며 **배포 환경에서 동작**합니다(아래 설정).

---

## 🌐 라이브 데모

- **봇**: https://my-bot-tawny-ten.vercel.app/
- **RAG 관리 페이지** (예시): https://middleton.p-e.kr/finbot/team/03/rag

## 🧑‍💻 로컬 실행

```bash
npm install
npm run dev      # http://localhost:5173 (학습 기능은 백엔드 없이 동작)
npm run build    # 프로덕션 빌드
```

> 봇 채팅/음성은 Vercel 환경변수 `TEAM_ID`(+미들턴 백엔드)가 있어야 동작합니다. 로컬에서 채팅을 테스트하려면 `.env`에 설정하세요. 그래프·연습·퀴즈·대시보드·사전·플래시카드는 백엔드 없이 모두 동작합니다.

---

## 📊 전체 워크플로우 (학생 시점)

```
[1] 사전 준비       Git 설치, GitHub/Vercel/카카오 가입
        ↓
[2] GitHub 빈 레포 + git push       내 코드 저장소 생성
        ↓
[3] Vercel 배포 (TEAM_ID 설정)      내 봇 URL 발급 (3분)
        ↓
[4] 카카오 SDK 연결                  로그인 + 공유 기능 활성화
        ↓
[5] RAG 청크 추가                    텍스트 붙여넣기 → AI 자동 변환 → 봇 지식
        ↓
[6] VRoid 아바타 (선택)              내 캐릭터 적용
        ↓
✅ 완성! 카카오톡으로 친구에게 공유
```

소요 시간: **약 1시간** (VRoid 제외).

---

## ⚡ 빠른 시작

### 1️⃣ 사전 준비

- [Git](https://git-scm.com/downloads) 설치 (학생 PC에는 Git만 있으면 끝 — 빌드는 Vercel이 자동)
- GitHub / Vercel / 카카오디벨로퍼 계정 가입
- **본인 팀 번호** (01~16) — 운영자에게 받음

### 2️⃣ 레포 복사 + 푸시

#### 2-1. GitHub에서 빈 레포 만들기 (웹 브라우저)

1. https://github.com/new 접속 (본인 계정 로그인)
2. **Repository name**: `my-bot` (원하는 이름)
3. **Public** 선택
4. **체크박스 모두 OFF** (README/.gitignore/license 다 끄기 — 푸시 충돌 방지)
5. **Create repository** 클릭
6. 생성된 페이지에서 URL 확인: `https://github.com/[본인]/my-bot.git`

#### 2-2. 로컬에서 클론 + 푸시 (CMD)

```cmd
cd C:\projects
mkdir my-bot
cd my-bot
git clone https://github.com/sungbongju/cha-bot-starterkit.git .
rmdir /s /q .git
git init -b main
git add . && git commit -m "내 봇 시작"
git remote add origin https://github.com/[본인]/my-bot.git
git push -u origin main
```

> ⚠️ `git remote add` 명령의 URL은 **2-1에서 만든 본인 레포** URL입니다. `sungbongju/cha-bot-starterkit.git` 이 아님.

> 💡 처음 `git push` 시 GitHub 로그인 창이 뜹니다. 브라우저에서 인증하면 자동 푸시.

### 3️⃣ Vercel 배포

[vercel.com](https://vercel.com) → **New Project** → 본인 레포 → **Environment Variables** 추가:

| Name | Value |
|---|---|
| `TEAM_ID` | `03` (본인 팀 번호) |
| `VITE_KAKAO_JS_KEY` | 카카오 JS 키 (Step 4에서) |

**Deploy** → 3분 후 배포 URL 발급 (예: `https://my-bot-xxxx.vercel.app`).

### 4️⃣ 카카오 SDK

[Kakao Developers](https://developers.kakao.com/) → 앱 생성 → JS 키 복사:
1. **플랫폼 → Web** : 본인 Vercel URL 등록
2. **카카오 로그인 ON** + Redirect URI (`Vercel URL/oauth`)
3. **동의 항목**: 닉네임 필수
4. Vercel env `VITE_KAKAO_JS_KEY` 교체 + **Redeploy**

### 5️⃣ RAG 청크 추가 (본인 봇 지식) ⭐

```
https://middleton.p-e.kr/finbot/team/[본인팀번호]/rag
```

**두 가지 방법**:

#### 🆕 방법 A — 텍스트로 자동 만들기 (가장 쉬움)

뉴스 기사, 강의 노트, 위키 등 어떤 텍스트든 붙여넣기 → **🤖 AI로 청크 만들기** 클릭 → 30초~1분 후 자동 생성된 5~25개 Q&A 청크 미리보기 → **이대로 저장**. JSONL 형식 몰라도 됨.

#### 📎 방법 B — JSONL 파일 업로드 (개발자용)

직접 청크 작성한 경우. 예시 (`chunks.jsonl`):
```jsonl
{"id":"q1","question":"안녕","answer":"안녕! 나는 분개해 봇이야."}
{"id":"q2","question":"분개가 뭐야","answer":"거래를 차변과 대변으로 나누는 거예요."}
```

### 6️⃣ VRoid 아바타 (선택)

**빠른 경로**: [VRoid Hub](https://hub.vroid.com/) → "Allow Redistribution" 필터 → 마음에 드는 VRM 다운

**정공법**: [VRoid Studio](https://vroid.com/en/studio) 설치 → 캐릭터 제작 → Export → 라이선스 모두 Allow

다운로드 받은 VRM 파일을 **`public/avatar.vrm`** 으로 복사 (파일명 정확히, 한글 X):

```cmd
copy "%USERPROFILE%\Desktop\내캐릭터.vrm" "C:\projects\my-bot\public\avatar.vrm"
cd C:\projects\my-bot
git add public/avatar.vrm
git commit -m "Add avatar"
git push
```

> VRoid 안 만들면 placeholder 아바타 표시.

---

## 📖 자세한 자습서 — 11단계 무엇이 들어있나

[**docs/tutorial.html**](docs/tutorial.html) — 그림과 함께 단계별 안내

| Step | 내용 | 시간 |
|---|---|---|
| 1 | 사전 준비 (Git 설치 확인) | 3분 |
| 2 | GitHub 가입 + Git 설정 | 3분 |
| 3 | 템플릿 클론 + 본인 봇 폴더 만들기 | 5분 |
| 4 | 환경 변수 메모 (팀 번호 + 카카오 키 — Vercel 등록용) | 1분 |
| 5 | 본인 레포 만들기 + 푸시 | 7분 |
| 6 | Vercel 배포 (`TEAM_ID` + `VITE_KAKAO_JS_KEY`) | 10분 |
| 7 | 카카오 SDK 설정 (로그인 + 공유) | 10분 |
| **8** | **RAG 데이터 — 텍스트 자동 청크화 ⭐** | 10분 |
| 9 | VRoid 아바타 만들기 (빠른 경로 / 정공법) | 10분~1시간 |
| 10 | 페르소나 정의 (RAG 청크로) | 5분 |
| 11 | 봇 공유 (카카오톡) | 1분 |

---

## 🛠 어떻게 작동하나 (기술적 설명, 선택)

```
[학생 봇 페이지]  ←→  [Vercel Serverless Function]  ←→  [Middleton 백엔드]
   (React + VRM)       (api/chat-stream.js 프록시)      (Gemma4 + RAG + STT/TTS)
        ↑                                                       ↑
   VITE_KAKAO_JS_KEY                                       TEAM_ID로 본인 팀
   (env에서 주입)                                          RAG 청크 검색
```

**핵심 설계**:
- **TEAM_ID env**: Vercel에서 설정한 팀 번호로 백엔드가 자동으로 본인 팀 RAG만 사용
- **팀별 RAG 격리**: 미들턴 서버에 `team_01_chunks.json` ~ `team_16_chunks.json` 분리 보관
- **AI 자동 청크화**: 학생이 텍스트 던지면 Gemma4가 Q&A 형식으로 변환 → 즉시 RAG에 저장
- **무료 LLM**: 16팀이 한 미들턴 서버의 Gemma4를 공유 (OpenAI API 비용 0원)

---

## 🆘 트러블슈팅

| 증상 | 원인 / 해결 |
|---|---|
| 아바타 자리에 placeholder | `public/avatar.vrm` 없음 → 추가 (파일명 정확히 소문자) |
| 채팅 안 됨 | Vercel env `TEAM_ID` 확인 (01~16) |
| 카카오 로그인 에러 ("앱 정보가 정확하지 않음") | 카카오 디벨로퍼 → Web 도메인 등록 + 카카오 로그인 ON |
| RAG 청크 안 보임 | 본인 팀 번호 (TEAM_ID) 와 URL 팀번호 일치 확인 |
| `git push` "no upstream branch" | `git push -u origin main` 한 번만 |
| Vercel 배포 후 한글 깨짐 | JSONL 파일을 UTF-8로 저장 (VS Code 권장) |

---

## 🙏 만든 사람

- **백엔드 + 스타터킷**: 성봉주 + Claude (Anthropic)
- **VRM 렌더링**: [@pixiv/three-vrm](https://github.com/pixiv/three-vrm)

MIT License.
