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

## 현재 구현 범위: Issue 1~5 + 최종 통합

- 언론사 기사 화면 구조를 확인할 수 있는 시연용 기사 6건
- 기사별 제목·리드·핵심 포인트·5개 문단 전문·원문 언론사·기자명·발행일 데이터
- 대표 이미지와 본문 중간 이미지의 원본 비율 표시, 대체 텍스트·설명·출처 표기 구조
- `map()`을 사용한 기사 목록 렌더링
- `useState`와 클릭 이벤트를 사용한 카드형/리스트형 전환
- `aria-pressed`, 키보드 포커스, 반응형 레이아웃
- React Router 기반 `/`, `/articles/:articleId/`, `/en/`, `/en/articles/:articleId/` 경로
- 기사 카테고리·제목·작성팀·발행일·리드·전문을 구분한 상세 읽기 화면
- 외부 원문 이동 없이 사이트 안에서 읽는 기사별 5개 문단 전문과 핵심 포인트
- 같은 주제를 우선하는 관련 기사 3건과 목록 복귀 동선
- 존재하지 않는 기사 ID 안내와 최근 기사 추천
- 카드형에서는 기사 6건 전체 노출, 리스트형에서는 한 페이지당 3건과 이전/다음/페이지 번호 제공
- 향후 API의 `page`·`limit` 응답으로 교체할 수 있는 로컬 페이지 데이터 함수
- Web Share API를 우선 사용하는 모바일·데스크톱 공유 버튼
- 미지원 환경의 Clipboard API 링크 복사와 추가 대체 동작
- X·Facebook 아이콘 공유, Instagram 링크 복사 안내와 `aria-live` 결과 안내
- VAN Conference와 같은 Deep Navy·White·Off-white 계열의 반응형 디자인
- 기사별 title·description·Open Graph·Twitter 메타데이터와 Article JSON-LD 갱신
- 대표 이미지가 있는 기사의 Open Graph·X 대형 이미지 카드와 `NewsArticle` 이미지 메타데이터
- 한국어/영어 전환과 기사 6건의 영문 제목·요약·핵심 포인트
- 한국어/영어를 고정 URL로 구분하고 목록의 페이지·카드/리스트 상태를 쿼리로 유지
- 빌드 시 홈 2개와 기사 12개의 정적 HTML 메타데이터 페이지 생성
- Node.js 24에서 lint·데이터 테스트·빌드를 수행하는 GitHub Actions

### URL 예시

- 한국어 카드 목록: `/`
- 영어 리스트 2페이지: `/en/?view=list&page=2`
- 영어 기사 상세: `/en/articles/1/`

`src/articles.js`의 데이터만 바꾸면 목록, 상세, 관련 기사, 페이지네이션에 같이 반영됩니다. 향후 API/CMS를 연결할 때는 `getArticlePage`, `getArticleById`, `getRelatedArticles`의 데이터 소스를 교체하면 됩니다.

이미지 업로드 백엔드는 `POST /api/media`에서 파일을 저장한 뒤 `src`, `width`, `height`, `alt`, `caption`, `credit`을 반환하도록 연결합니다. 대표 이미지는 카드에서 일정한 비율로 잘라 보여주고 기사 상세에서는 잘리지 않은 원본 비율로 표시합니다. 본문 이미지는 `inlineImages`의 `afterParagraph` 값으로 들어갈 문단 위치를 지정할 수 있습니다.

> 현재는 백엔드 기사 API가 연결되지 않아 참고 원문의 언론사와 기자명을 표시한 정적 시연용 기사 데이터를 사용합니다. 운영 단계에서는 동일한 데이터 구조를 유지한 채 기자 작성·데스크 승인 절차를 통과한 CMS/API 기사로 교체합니다.

> 기사별 공유 메타데이터와 Article JSON-LD는 빌드 단계에서 정적 HTML로 생성되어 JavaScript를 실행하지 않는 SNS 로봇도 읽을 수 있습니다. 기사 본문 전체의 검색 노출을 확장하려면 운영 전환 시 SSR/SSG 프레임워크를 추가로 검토합니다.

## 실행

```bash
npm install
npm run dev
```

전체 검증 명령은 `npm run check`입니다. 개별로는 `npm run lint`, `npm run test`, `npm run build`, `npm run test:static`을 사용합니다.

Vercel은 생성된 기사별 정적 HTML을 우선 제공하고, 존재하지 않는 경로는 `vercel.json`의 SPA fallback으로 React Router에 연결합니다.

## media-outreach 백엔드 연동

`src/mediaOutreachApi.js`는 언론 컨택 자동화 백엔드([media-outreach](https://github.com/VAN-AI-Innovation/media-outreach))의 REST API를 감싸는 클라이언트입니다. 이 화면(기자 추천/메일 발송용 운영자 페이지)은 아직 없고, 향후 페이지에서 바로 가져다 쓸 수 있도록 API 연동 레이어만 먼저 준비했습니다.

흐름은 다음 순서입니다.

1. **보도자료** — `PressReleaseApi.create/list/get`
2. **기자 추천** — media-outreach 백엔드에는 추천 전용 엔드포인트가 없어, `JournalistApi.list()`로 가져온 기자 목록과 보도자료 키워드를 `recommendJournalists(pressRelease, journalists)`로 매칭해 클라이언트에서 점수를 매깁니다(관심 키워드/출입처 일치 개수 기준).
3. **개인화 메일 생성** — `MailDraftApi.generate`(Gemini 초안 생성) → 필요 시 `edit`/`regenerate` → `approve`. 승인(`APPROVED`) 상태여야 다음 단계에서 발송 대상으로 확정됩니다.
4. **발송** — `MailSendApi.confirmTargets`(중복/수신거부 검증 포함)로 발송 작업을 큐에 넣고, `pause`/`resume`/`cancel`/`reschedule`로 제어합니다. 실제 발송은 백엔드 워커가 처리합니다.
5. **후속 연락** — `FollowUpApi.pending/byJournalist/send/timeline`으로 미회신 기자의 후속 연락 대상을 조회하고 발송합니다.

### 환경변수

`VITE_MEDIA_OUTREACH_API_URL`을 비워두면 배포된 Railway 백엔드(`https://backend-production-2e28.up.railway.app`)로 붙습니다. 로컬 백엔드를 띄웠다면 `.env.local`로 복사해 `http://localhost:8080` 등으로 지정하세요(`.env.example` 참고).

배포된 프론트 도메인에서 API를 호출하려면 media-outreach 백엔드의 `FRONTEND_ORIGIN` 환경변수(CORS 허용 오리진)에 이 프로젝트의 배포 주소가 포함되어 있어야 합니다.

### 테스트

`recommendJournalists`의 매칭/점수 로직은 `src/mediaOutreachApi.test.js`에서 `npm run test`로 검증합니다. 나머지 API 함수는 실제 백엔드 호출을 감싸는 얇은 래퍼라 별도 유닛 테스트를 두지 않았습니다.
