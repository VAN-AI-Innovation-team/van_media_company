# 언론사 미디어 플랫폼 프론트엔드

PDF의 `2-5 언론사 미디어 플랫폼` 요구사항과 연결해, 프론트엔드를 5개의 GitHub Issue 단위로 나눠 진행하는 별도 프로젝트입니다.

이 프로젝트는 독자가 사용하는 공개 프론트엔드 학습용 프로토타입입니다. PDF의 전체 MVP에 포함된 기자 작성, 데스크 승인, 예약 발행, 검색, 뉴스레터, 제보, 감사로그는 아래 5개 Issue에 없는 기능이므로 현재 프로젝트에 임의로 넣지 않습니다.

## PDF 요구사항 연결

1. 기사 카드/리스트 토글: `NP-001` 기사 목록, `NP-011` 모바일 우선 레이아웃
2. 라우팅: `NP-001` 분야·기자·기획·연재 분류, `NP-012` 기자 프로필 페이지의 URL 기반
3. Pagination: `NP-001` 기사 목록이 늘어날 때의 탐색성과 성능 보완
4. 기사 상세 페이지: `NP-007` 관련 기사, `NP-011` 읽기 경험, `NP-013` 정정 표시, `NP-014` 구조화 데이터
5. 외부 공유: `NP-008` 링크 복사·SNS 공유·공유 카드 메타태그

## GitHub Issue 작업 순서

1. `feat: 기사 카드형/리스트형 보기 전환` - React `useState`, 이벤트, `map()`
2. `feat: 기사 목록과 상세 경로 라우팅` - React Router, `Routes`, `Route`, `Link`, `useParams`
3. `feat: 기사 목록 Pagination` - `useState`, `slice()`, 페이지 계산
4. `feat: 기사 상세 페이지 구현` - `find()`, Props, 관련 기사 `filter()`
5. `feat: 기사 외부 공유 기능 구현` - Web Share API, Clipboard API 대체 동작, 공유 메타태그

각 Issue는 앞 Issue가 완료된 뒤 시작합니다. 특히 4번 상세 페이지와 5번 공유는 2번에서 정의한 기사 URL에 의존합니다.

## 기술 스택

- 현재 1~5단계 학습용 프론트엔드: React 19, Vite 8, JavaScript, CSS
- 2단계부터 추가: React Router
- 5단계 공유: Web Share API와 Clipboard API
- PDF의 실제 운영 서비스 전환 시: SSR/SSG 프레임워크와 Headless CMS를 별도로 검토해야 함 (`NP-014` SEO·구조화 데이터, PDF 4장의 공개 프런트 권고)

## 현재 구현 범위: Issue 1

- 배열/객체로 구성한 기사 데이터 6건
- `map()`을 사용한 기사 목록 렌더링
- `useState`와 클릭 이벤트를 사용한 카드형/리스트형 전환
- `aria-pressed`, 키보드 포커스, 반응형 레이아웃
- Router, Pagination, 상세 페이지, 외부 공유는 아직 추가하지 않음

## 실행

```bash
npm install
npm run dev
```

검증 명령은 `npm run lint`, `npm run build`입니다.
