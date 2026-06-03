// 개념 플래시카드 — concepts.js 와 동일한 category/group 체계.
// front(질문/용어) ↔ back(답/설명). 간이 SRS(Leitner)는 lib/progress.js 가 관리.

export const FLASHCARDS = [
  // 회계원리
  { id: 'f1', category: 'principles', group: '회계의 기초', front: '회계등식은?', back: '자산 = 부채 + 자본' },
  { id: 'f2', category: 'principles', group: '계정과 분개', front: '차변(왼쪽)에 오는 것은?', back: '자산↑, 비용↑, 부채↓, 자본↓' },
  { id: 'f3', category: 'principles', group: '계정과 분개', front: '대변(오른쪽)에 오는 것은?', back: '부채↑, 자본↑, 수익↑, 자산↓' },
  { id: 'f4', category: 'principles', group: '계정과 분개', front: '거래의 8요소는?', back: '자산↑↓·부채↑↓·자본↑↓·수익발생·비용발생' },
  { id: 'f5', category: 'principles', group: '계정과 분개', front: '대차평균의 원리란?', back: '차변 합계 = 대변 합계 (항상 같다)' },
  { id: 'f6', category: 'principles', group: '자산 계정', front: '"선급비용"이 자산인 이유는?', back: '미리 냈지만 아직 효익을 못 썼으니 앞으로 받을 권리(자산)가 남아서' },
  { id: 'f7', category: 'principles', group: '부채 계정', front: '"외상매입금"이 대변인 이유는?', back: '나중에 갚아야 할 의무(부채)라서' },
  { id: 'f8', category: 'principles', group: '부채 계정', front: '상품 외상=? / 그 외 외상=?', back: '상품 외상 = 외상매입금 / 그 외 = 미지급금' },
  { id: 'f9', category: 'principles', group: '결산', front: '발생주의란?', back: '현금 수수와 무관하게 발생한 기간에 수익·비용 인식' },
  { id: 'f10', category: 'principles', group: '결산', front: '발생 vs 이연', back: '발생=미수수익·미지급비용 / 이연=선급비용·선수수익' },
  { id: 'f11', category: 'principles', group: '결산', front: '감가상각 결산분개(간접법)는?', back: '(차) 감가상각비 / (대) 감가상각누계액' },
  { id: 'f12', category: 'principles', group: '결산', front: '대손 설정 분개는?', back: '(차) 대손상각비 / (대) 대손충당금' },
  { id: 'f13', category: 'principles', group: '재무제표', front: '재무상태표 vs 손익계산서', back: '재무상태표=일정 시점 재무상태 / 손익계산서=일정 기간 성과' },
  { id: 'f14', category: 'principles', group: '수익 계정', front: '매출채권 회수 시 분개는?', back: '(차) 현금 / (대) 외상매출금' },

  // 중급회계
  { id: 'f15', category: 'intermediate', group: '재고자산', front: '저가법이란?', back: '재고를 취득원가와 순실현가능가치(NRV) 중 낮은 값으로 평가' },
  { id: 'f16', category: 'intermediate', group: '유형·무형자산', front: '정액법 공식은?', back: '(취득원가 − 잔존가치) ÷ 내용연수' },
  { id: 'f17', category: 'intermediate', group: '유형·무형자산', front: '취득원가에 포함되는 것은?', back: '매입가 + 운반비·설치비 등 사용가능 상태까지의 모든 원가' },
  { id: 'f18', category: 'intermediate', group: '유형·무형자산', front: '유형자산 처분 시 함께 제거할 것은?', back: '감가상각누계액도 함께 제거, 장부금액과 처분가 차이가 손익' },
  { id: 'f19', category: 'intermediate', group: '부채·사채', front: '충당부채 vs 우발부채', back: '충당부채=인식(의무·추정 가능) / 우발부채=주석 공시' },
  { id: 'f20', category: 'intermediate', group: '부채·사채', front: '사채가 할인발행되는 경우는?', back: '시장이자율 > 표시이자율일 때' },
  { id: 'f21', category: 'intermediate', group: '자본', front: '주식발행초과금은?', back: '발행가가 액면가를 초과한 금액(자본잉여금)' },
  { id: 'f22', category: 'intermediate', group: '수익인식', front: '수익인식 5단계는?', back: '①계약식별 ②수행의무식별 ③거래가격산정 ④배분 ⑤이행 시 인식' },
  { id: 'f23', category: 'intermediate', group: '법인세회계', front: '이연법인세가 생기는 원인은?', back: '회계이익과 과세소득의 일시적차이' },

  // 세법
  { id: 'f24', category: 'tax', group: '부가가치세', front: '부가세 납부세액 공식은?', back: '매출세액 − 매입세액' },
  { id: 'f25', category: 'tax', group: '부가가치세', front: '매출 시 받은 부가세 처리는?', back: '부가세예수금(부채) — 내 것이 아니라 맡아 둔 것' },
  { id: 'f26', category: 'tax', group: '부가가치세', front: '매입세액공제 요건은?', back: '세금계산서 등 적격 증빙 수취' },
  { id: 'f27', category: 'tax', group: '부가가치세', front: '영세율 vs 면세', back: '영세율=0%(매입세액 환급) / 면세=부가세 면제(매입세액 공제 불가)' },
  { id: 'f28', category: 'tax', group: '법인세법', front: '각사업연도소득 공식은?', back: '익금총액 − 손금총액' },
  { id: 'f29', category: 'tax', group: '법인세법', front: '세무조정이 필요한 이유는?', back: '회계 기준과 세법 기준이 달라서(회계이익→세법소득)' },
  { id: 'f30', category: 'tax', group: '법인세법', front: '익금산입 vs 손금불산입', back: '익금산입=세법상 소득에 더함 / 손금불산입=세법상 비용 불인정' },
  { id: 'f31', category: 'tax', group: '국세기본', front: '원천징수란?', back: '지급자가 세금을 미리 떼어 대신 납부(예: 급여 소득세 → 예수금)' },
  { id: 'f32', category: 'tax', group: '소득세', front: '종합소득에 합산되는 소득은?', back: '이자·배당·사업·근로·연금·기타소득' },
]

export const FLASHCARD_GROUPS = [...new Set(FLASHCARDS.map((c) => c.group))]
