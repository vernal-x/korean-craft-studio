# Deep Interview Spec: 온결 공방 (프론트엔드 실습 프로토타입)

## Metadata
- Rounds: 5 (+ Round 0 topology)
- Final Ambiguity Score: ~17%
- Type: brownfield (create-next-app 초기 스캐폴드)
- Threshold: 0.2 (source: default)
- Initial Context Summarized: no
- Status: PASSED, pending approval (코드 수정 없음)

## Topology
| Component | Status | Description | Coverage |
|---|---|---|---|
| 공예품 전시·주문 탭 | active | 공예품 카드 + 주문 문의 | AC 1-3, 6 |
| 공방 클래스 탭 | active | 클래스 카드 + 신청 | AC 4-6 |
| Mock 데이터·Mock API | active | TS mock data, 700ms 지연 성공/실패 | AC 7-9 |
| 실습용 안내·개인정보 경고 | active | 실제 개인정보 입력 금지 안내 | AC 10 |
| 공통 셸·디자인 | active | 사이트명, 2탭, 반응형, 톤 | AC 11-12 |

## Goal
로그인·DB·결제·외부 API 없이, 한국 전통 공예를 소개하고 주문 문의와 클래스 신청 흐름을 Mock으로 체험하는 반응형 프로토타입 '온결 공방'을 만든다.

## Constraints
- Next.js App Router + TypeScript + Tailwind CSS (현재 next 16.3.7, react 19, tailwind v4). 구현 전 `node_modules/next/dist/docs/` 확인 필수 (AGENTS.md).
- **폴더 구조:** `src/` 도입. `app/` → `src/app/`, `tsconfig` 경로 별칭 `@/*` → `./src/*`. Mock API는 `src/lib/mock-api.ts`.
- 상품/클래스 데이터는 TS 파일 Mock Data.
- 이미지는 CSS/SVG 자체 플레이스홀더 (외부 이미지·요청 없음, `public/` 사진 없음).
- 폼은 모달 다이얼로그. 성공 시 같은 모달에서 접수번호 표시.
- 폼 필드(최소): 공통 이름·연락처 / 주문 문의 수량·문의내용(선택) / 클래스 신청 희망일·인원. 선택한 상품/클래스는 자동 표시.
- 인원은 1~정원 범위를 폼에서 검증. 잔여 좌석 차감 없음.
- Mock API: 네트워크·저장 없음, 약 700ms 지연 후 성공/실패 반환. 연락처 `010-0000-0000` 입력 시 Mock 오류.
- 상단 정확히 2개 탭: "공예품 전시·주문", "공방 클래스".

## Non-Goals
회원가입, 로그인, DB, 실제 결제, 외부 API, 실제 저장, 잔여 좌석 차감, 관리자 화면, 장바구니.

## Acceptance Criteria
- [ ] 1. 상단 탭이 정확히 2개이며 전환 시 해당 내용이 표시된다.
- [ ] 2. 공예품 카드에 이미지, 이름, 공예 종류, 설명, 가격이 있고 도자기·나전칠기·보자기·목공예를 모두 포함한다.
- [ ] 3. "주문 문의하기" 버튼이 해당 상품이 표시된 주문 문의 모달을 연다.
- [ ] 4. 클래스 카드에 이름, 설명, 가격, 소요시간, 정원이 있고 도자기 만들기·보자기 만들기를 포함한다.
- [ ] 5. "클래스 신청" 버튼이 해당 클래스가 표시된 신청 모달을 연다.
- [ ] 6. 모달은 ESC/배경 클릭/닫기 버튼으로 닫히고 필수 필드는 검증된다.
- [ ] 7. 제출 시 `src/lib/mock-api.ts`의 비동기 함수를 호출하고 약 700ms 로딩 상태를 보여준다.
- [ ] 8. 성공 시 가짜 접수번호와 접수 완료 메시지를 보여준다.
- [ ] 9. 연락처 `010-0000-0000` 입력 시 오류 메시지를 보여주고 재시도할 수 있다. 네트워크 요청은 발생하지 않는다.
- [ ] 10. 상단 또는 폼 근처에 실습용 안내와 "실제 이름·전화번호를 입력하지 마세요" 문구가 표시된다.
- [ ] 11. 모바일(약 375px)과 PC에서 레이아웃이 깨지지 않는다.
- [ ] 12. `npm run lint`와 `npm run build`가 통과한다.

## Assumptions (인터뷰에서 확정하지 않은 기본값, 승인 시 조정 가능)
| 항목 | 기본값 |
|---|---|
| 탭 전환 | 단일 페이지 클라이언트 상태 (URL 분리 없음) |
| 강조점 | 공예품 전시·주문 탭을 기본 활성 탭으로 |
| 연락처 검증 | `01X-XXXX-XXXX` 형식 수준의 느슨한 검증 |
| 가격 표기 | 원 단위, 천 단위 콤마 (예: 48,000원) |
| 접수번호 형식 | 예: `OG-` + 난수 숫자 |
| 상품/클래스 수 | 상품 각 종류당 1~2개, 클래스 2~3개 |
| 색상 | 아이보리·먹색·차분한 청자/옻칠 포인트, 전통 문양 최소 |

## Technical Context
- 스캐폴드 상태: `app/{page.tsx,layout.tsx,globals.css,favicon.ico}` 만 존재. `public/`에는 create-next-app 기본 SVG.
- 신규 파일 예상: `src/data/{products,classes}.ts`, `src/lib/mock-api.ts`, 탭/카드/모달/폼 컴포넌트.

## Ontology
| Entity | Type | Fields | Relationships |
|---|---|---|---|
| Product | core | id, name, craftType, description, price, illustration | 주문 문의의 대상 |
| CraftClass | core | id, name, description, price, duration, capacity | 클래스 신청의 대상 |
| InquiryRequest | core | productId, name, phone, quantity, message? | Product를 참조 |
| EnrollmentRequest | core | classId, name, phone, date, headcount | CraftClass를 참조 |
| MockResponse | supporting | success, receiptNo?, message | 두 요청의 응답 |

## Interview Transcript 요약
- R0: 5개 구성요소 확정
- R1: `src/` 도입
- R2: 이미지는 CSS/SVG 플레이스홀더
- R3: 최소 폼 필드
- R4: 모달 다이얼로그
- R5: 정원은 폼에서 검증 (반론 모드 통과)
