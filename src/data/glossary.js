// 회계/세법 용어 사전 — concepts.js 와 동일한 category/group 체계.
// 빠른 검색용 평면 목록(쉬운 설명 + 예시). 그래프 노드보다 범위를 넓게.

export const GLOSSARY = [
  // 회계의 기초
  { term: '복식부기', category: 'principles', group: '회계의 기초', plain: '하나의 거래를 차변·대변 양쪽에 기록하는 방식.', example: '현금으로 비품을 사면 비품↑(차변)·현금↓(대변).' },
  { term: '단식부기', category: 'principles', group: '회계의 기초', plain: '현금 출납처럼 한 면만 기록하는 단순 방식.', example: '가계부.' },
  { term: '회계연도(회계기간)', category: 'principles', group: '회계의 기초', plain: '회계 보고를 위해 끊는 기간(보통 1년).', example: '1.1 ~ 12.31.' },
  { term: '회계등식', category: 'principles', group: '회계의 기초', plain: '자산 = 부채 + 자본.', example: '자산 100 = 부채 40 + 자본 60.' },
  { term: '거래의 8요소', category: 'principles', group: '회계의 기초', plain: '자산↑↓·부채↑↓·자본↑↓·수익발생·비용발생.', example: '모든 분개는 이 조합.' },

  // 계정과 분개
  { term: '차변', category: 'principles', group: '계정과 분개', plain: '계정의 왼쪽. 자산↑·비용↑·부채↓·자본↓.', example: '현금 입금은 차변.' },
  { term: '대변', category: 'principles', group: '계정과 분개', plain: '계정의 오른쪽. 부채↑·자본↑·수익↑·자산↓.', example: '매출은 대변.' },
  { term: '분개', category: 'principles', group: '계정과 분개', plain: '거래를 차변·대변으로 나누어 기록.', example: '(차)비품 (대)현금.' },
  { term: '전기', category: 'principles', group: '계정과 분개', plain: '분개를 총계정원장 계정으로 옮기는 것.', example: '분개의 현금 → 현금 계정으로.' },
  { term: '총계정원장', category: 'principles', group: '계정과 분개', plain: '모든 계정 잔액을 모은 장부.', example: '계정별 잔액 확인.' },
  { term: 'T계정', category: 'principles', group: '계정과 분개', plain: '계정을 T자(차변|대변)로 표현.', example: '잔액 계산에 유용.' },
  { term: '대차평균의 원리', category: 'principles', group: '계정과 분개', plain: '차변 합 = 대변 합.', example: '시산표로 점검.' },
  { term: '복합분개', category: 'principles', group: '계정과 분개', plain: '차변 또는 대변에 계정이 둘 이상인 분개.', example: '(차)현금·누계액 (대)기계장치·처분이익.' },

  // 자산
  { term: '유동자산', category: 'principles', group: '자산 계정', plain: '1년 내 현금화되는 자산.', example: '현금·매출채권·재고.' },
  { term: '비유동자산', category: 'principles', group: '자산 계정', plain: '1년 넘게 보유하는 자산.', example: '건물·기계.' },
  { term: '당좌예금', category: 'principles', group: '자산 계정', plain: '수표·어음 결제용 예금(자산).', example: '당좌수표 발행.' },
  { term: '외상매출금', category: 'principles', group: '자산 계정', plain: '외상 판매로 받을 권리(자산).', example: '(차)외상매출금 (대)매출.' },
  { term: '받을어음', category: 'principles', group: '자산 계정', plain: '어음으로 받을 권리(자산).', example: '만기에 회수.' },
  { term: '미수금', category: 'principles', group: '자산 계정', plain: '상품 외 거래에서 받을 돈(자산).', example: '비품을 외상으로 팔면 미수금.' },
  { term: '선급비용', category: 'principles', group: '자산 계정', plain: '미리 낸 비용 중 미경과분(자산).', example: '선급보험료.' },
  { term: '미수수익', category: 'principles', group: '자산 계정', plain: '발생했지만 못 받은 수익(자산).', example: '미수이자.' },
  { term: '가지급금', category: 'principles', group: '자산 계정', plain: '용도 미확정 지급액(임시 자산).', example: '출장비 가지급.' },

  // 부채
  { term: '유동부채', category: 'principles', group: '부채 계정', plain: '1년 내 갚을 부채.', example: '외상매입금.' },
  { term: '외상매입금', category: 'principles', group: '부채 계정', plain: '외상 매입으로 갚을 의무(부채).', example: '(차)상품 (대)외상매입금.' },
  { term: '미지급금', category: 'principles', group: '부채 계정', plain: '상품 외 거래의 외상 채무(부채).', example: '비품 외상 구입.' },
  { term: '미지급비용', category: 'principles', group: '부채 계정', plain: '발생했지만 안 낸 비용(부채).', example: '미지급이자.' },
  { term: '선수금', category: 'principles', group: '부채 계정', plain: '상품 주기 전 미리 받은 대금(부채).', example: '계약금 수령.' },
  { term: '선수수익', category: 'principles', group: '부채 계정', plain: '미리 받은 미제공 용역 대가(부채).', example: '선수임대료.' },
  { term: '예수금', category: 'principles', group: '부채 계정', plain: '원천징수 등 임시 보관액(부채).', example: '소득세 예수금.' },
  { term: '가수금', category: 'principles', group: '부채 계정', plain: '내용 미확정 입금(임시 부채).', example: '용도 불명 입금.' },

  // 자본
  { term: '자본금', category: 'principles', group: '자본 계정', plain: '주주가 출자한 기본 자본.', example: '액면 × 주식수.' },
  { term: '인출금', category: 'principles', group: '자본 계정', plain: '개인기업 사장의 사적 인출(자본 차감).', example: '사적 현금 인출.' },
  { term: '이익잉여금', category: 'principles', group: '자본 계정', plain: '사내에 쌓은 이익.', example: '순이익 누적.' },

  // 수익/비용
  { term: '수익', category: 'principles', group: '수익 계정', plain: '벌어들인 것(자본↑ 요인).', example: '매출·이자수익.' },
  { term: '비용', category: 'principles', group: '비용 계정', plain: '쓴 것(자본↓ 요인).', example: '급여·임차료.' },
  { term: '매출원가', category: 'principles', group: '비용 계정', plain: '판매된 상품의 원가.', example: '기초+매입−기말.' },
  { term: '감가상각비', category: 'principles', group: '비용 계정', plain: '유형자산 원가의 기간 배분 비용.', example: '(차)감가상각비 (대)누계액.' },
  { term: '대손상각비', category: 'principles', group: '비용 계정', plain: '못 받을 채권을 비용처리.', example: '(차)대손상각비 (대)대손충당금.' },
  { term: '세금과공과', category: 'principles', group: '비용 계정', plain: '재산세·자동차세 등 세금·공과금 비용.', example: '재산세 납부.' },
  { term: '자본적지출', category: 'principles', group: '비용 계정', plain: '자산 가치·수명을 늘리는 지출(자산 처리).', example: '엘리베이터 신설.' },
  { term: '수익적지출', category: 'principles', group: '비용 계정', plain: '원상 유지를 위한 지출(비용 처리).', example: '도색·수선.' },

  // 결산
  { term: '발생주의', category: 'principles', group: '결산', plain: '발생한 기간에 수익·비용 인식.', example: '현금 무관 인식.' },
  { term: '수익비용대응', category: 'principles', group: '결산', plain: '수익과 관련 비용을 같은 기간에 대응.', example: '매출과 매출원가.' },
  { term: '결산정리분개', category: 'principles', group: '결산', plain: '기말 발생·이연 반영 수정분개.', example: '감가상각·미수수익.' },
  { term: '시산표', category: 'principles', group: '결산', plain: '차변·대변 합계 일치 확인표.', example: '오류 1차 점검.' },
  { term: '잔존가치', category: 'principles', group: '결산', plain: '내용연수 종료 시 남는 가치.', example: '정액법 계산에 사용.' },
  { term: '내용연수', category: 'principles', group: '결산', plain: '자산을 사용할 것으로 예상하는 기간.', example: '기계 5년.' },

  // 재무제표
  { term: '재무상태표', category: 'principles', group: '재무제표', plain: '일정 시점 자산·부채·자본.', example: '기말 현재 상태.' },
  { term: '손익계산서', category: 'principles', group: '재무제표', plain: '일정 기간 수익·비용·이익.', example: '당기순이익 산출.' },
  { term: '현금흐름표', category: 'principles', group: '재무제표', plain: '기간 현금 유출입.', example: '영업·투자·재무.' },

  // 중급
  { term: '현금성자산', category: 'intermediate', group: '현금·금융자산', plain: '취득 당시 만기 3개월 이내 단기상품.', example: 'MMF.' },
  { term: '대손충당금', category: 'intermediate', group: '현금·금융자산', plain: '매출채권 회수불능 추정액(자산 차감).', example: '채권 순액 표시.' },
  { term: '유효이자율법', category: 'intermediate', group: '현금·금융자산', plain: '실질 수익률로 이자 배분.', example: '사채차금 상각.' },
  { term: '원가흐름가정', category: 'intermediate', group: '재고자산', plain: '선입선출·평균법 등 원가 배분 가정.', example: 'FIFO.' },
  { term: '저가법', category: 'intermediate', group: '재고자산', plain: '원가와 NRV 중 낮은 값으로 평가.', example: '평가손실 인식.' },
  { term: '순실현가능가치', category: 'intermediate', group: '재고자산', plain: '예상 판매가 − 추가비용.', example: '저가법 비교 기준.' },
  { term: '취득원가', category: 'intermediate', group: '유형·무형자산', plain: '사용가능 상태까지의 모든 원가.', example: '매입가+운반비.' },
  { term: '감가상각', category: 'intermediate', group: '유형·무형자산', plain: '원가를 내용연수에 배분.', example: '정액·정률.' },
  { term: '정액법', category: 'intermediate', group: '유형·무형자산', plain: '매년 동일액 상각.', example: '(원가−잔존)/연수.' },
  { term: '정률법', category: 'intermediate', group: '유형·무형자산', plain: '장부금액 × 상각률(초기에 많이).', example: '가속상각.' },
  { term: '감가상각누계액', category: 'intermediate', group: '유형·무형자산', plain: '상각 합계(자산 차감).', example: '취득원가 보존.' },
  { term: '손상차손', category: 'intermediate', group: '유형·무형자산', plain: '회수가능액 < 장부금액 차이 비용.', example: '가치 급락.' },
  { term: '영업권', category: 'intermediate', group: '유형·무형자산', plain: '합병 시 순자산 초과 지급액.', example: '브랜드 가치.' },
  { term: '충당부채', category: 'intermediate', group: '부채·사채', plain: '시기·금액 불확실하나 의무 있는 부채.', example: '제품보증.' },
  { term: '우발부채', category: 'intermediate', group: '부채·사채', plain: '주석 공시 대상 잠재 의무.', example: '소송.' },
  { term: '사채할인발행차금', category: 'intermediate', group: '부채·사채', plain: '액면보다 싸게 발행한 차액.', example: '시장>표시이자율.' },
  { term: '현재가치', category: 'intermediate', group: '부채·사채', plain: '미래 현금을 할인한 현재 가치.', example: '돈의 시간가치.' },
  { term: '주식발행초과금', category: 'intermediate', group: '자본', plain: '발행가가 액면을 초과한 자본잉여금.', example: '액면 5,000을 7,000에.' },
  { term: '자기주식', category: 'intermediate', group: '자본', plain: '되산 자기 주식(자본 차감).', example: '자사주 매입.' },
  { term: '수익인식 5단계', category: 'intermediate', group: '수익인식', plain: '계약→의무→가격→배분→이행.', example: '구독료 기간 배분.' },
  { term: '계약부채', category: 'intermediate', group: '수익인식', plain: '대가는 받았으나 의무 미이행분(부채).', example: '상품권 판매.' },
  { term: '이연법인세', category: 'intermediate', group: '법인세회계', plain: '일시적차이를 자산·부채로 인식.', example: '감가상각 차이.' },
  { term: '일시적차이', category: 'intermediate', group: '법인세회계', plain: '회계·세무 시점 차이(나중 소멸).', example: '한도초과 상각.' },

  // 세법
  { term: '원천징수', category: 'tax', group: '국세기본', plain: '지급자가 세금을 미리 떼어 납부.', example: '급여 소득세.' },
  { term: '부가가치세', category: 'tax', group: '부가가치세', plain: '부가가치에 10% 과세. 매출−매입세액.', example: '납부세액 = 예수금−대급금.' },
  { term: '매출세액', category: 'tax', group: '부가가치세', plain: '매출 시 거래징수한 부가세.', example: '공급가×10%.' },
  { term: '매입세액', category: 'tax', group: '부가가치세', plain: '매입 시 부담한 부가세.', example: '공제 대상.' },
  { term: '매입세액공제', category: 'tax', group: '부가가치세', plain: '매입세액을 매출세액에서 차감.', example: '세금계산서 필요.' },
  { term: '세금계산서', category: 'tax', group: '부가가치세', plain: '부가세 거래 법정 증빙.', example: '전자발급.' },
  { term: '영세율', category: 'tax', group: '부가가치세', plain: '0% 세율(수출 등). 매입세액 환급.', example: '수출 재화.' },
  { term: '면세', category: 'tax', group: '부가가치세', plain: '부가세 면제(매입세액 공제 불가).', example: '기초생필품·교육.' },
  { term: '법인세', category: 'tax', group: '법인세법', plain: '법인 소득에 과세. 익금−손금.', example: '각사업연도소득.' },
  { term: '익금', category: 'tax', group: '법인세법', plain: '법인세법상 수익.', example: '매출·처분이익.' },
  { term: '손금', category: 'tax', group: '법인세법', plain: '법인세법상 비용.', example: '인건비.' },
  { term: '세무조정', category: 'tax', group: '법인세법', plain: '회계이익을 세법소득으로 조정.', example: '익금산입 등.' },
  { term: '익금산입', category: 'tax', group: '법인세법', plain: '세법상 소득에 더하는 조정.', example: '한도초과 가산.' },
  { term: '손금불산입', category: 'tax', group: '법인세법', plain: '세법상 비용 불인정 조정.', example: '벌과금.' },
  { term: '소득처분', category: 'tax', group: '법인세법', plain: '조정액 귀속 결정(상여·배당 등).', example: '대표자 상여.' },
  { term: '결산조정/신고조정', category: 'tax', group: '법인세법', plain: '장부 반영 vs 신고서에서만 조정.', example: '감가상각 vs 준비금.' },
  { term: '종합소득', category: 'tax', group: '소득세', plain: '이자·배당·사업·근로·연금·기타 합산.', example: '누진세율 과세.' },
  { term: '연말정산', category: 'tax', group: '소득세', plain: '근로소득세를 1년 단위로 정산.', example: '환급/추가납부.' },
  { term: '가산세', category: 'tax', group: '가산세', plain: '신고·납부 위반 시 추가 세금.', example: '무신고 가산세.' },
]

export const GLOSSARY_GROUPS = [...new Set(GLOSSARY.map((g) => g.group))]
