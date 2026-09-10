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
- Render 기사 API를 통한 목록·페이지네이션·상세·관련 기사 비동기 조회
- 한국어/영어 로딩·빈 목록·오류·재시도 안내와 이전 요청 취소
- Windows·모바일의 기기 기본 공유창을 여는 Web Share API 버튼과 미지원 환경의 링크 복사 대체 동작
- 미지원 환경의 Clipboard API 링크 복사와 추가 대체 동작
- X·Facebook 아이콘 공유, Instagram 링크 복사 안내와 `aria-live` 결과 안내
- VAN Conference와 같은 Deep Navy·White·Off-white 계열의 반응형 디자인
- 기사별 title·description·Open Graph·Twitter 메타데이터와 Article JSON-LD 갱신
- 대표 이미지가 있는 기사의 Open Graph·X 대형 이미지 카드와 `NewsArticle` 이미지 메타데이터
- 한국어/영어 전환과 기사 6건의 영문 제목·요약·핵심 포인트
- 한국어/영어를 고정 URL로 구분하고 목록의 페이지·카드/리스트 상태를 쿼리로 유지
- 빌드 시 API에서 받은 한국어/영어 기사별 정적 HTML 메타데이터 페이지 생성
- Google 검색만 제외하는 `googlebot` 전용 `noindex` 메타태그
- Node.js 24에서 lint·데이터 테스트·빌드를 수행하는 GitHub Actions

### URL 예시

- 한국어 카드 목록: `/`
- 영어 리스트 2페이지: `/en/?view=list&page=2`
- 영어 기사 상세: `/en/articles/1/`

`src/articles.js`의 `getAllArticles`, `getArticlePage`, `getArticleById`, `getRelatedArticles`는 모두 Promise를 반환하며 Render API를 조회합니다. 기사 본문·한영 번역·관련 기사 순서는 서버 응답을 사용합니다. 카드형은 전체 목록, 리스트형은 서버 페이지네이션을 사용합니다. 상세 404는 없는 기사 안내로, 서버·네트워크 오류는 재시도 안내로 구분합니다. 관련 기사 요청이 실패해도 본문은 유지합니다.

| 프론트 함수 | API |
| --- | --- |
| `getAllArticles(language)` | `GET /api/articles?language=ko` |
| `getArticlePage({ page, limit, language })` | `GET /api/articles/page?page=1&limit=3&language=ko` |
| `getArticleById(id, language)` | `GET /api/articles/{id}?language=ko` |
| `getRelatedArticles(id, limit, language)` | `GET /api/articles/{id}/related?limit=3&language=ko` |

기본 백엔드는 `https://press-media-recommendation-backend.onrender.com`입니다. 브라우저는 같은 사이트의 `/api`로 요청하고, Vite 개발/미리보기 프록시와 `vercel.json`의 외부 rewrite가 백엔드로 전달합니다. 현재 백엔드 응답에 CORS 허용 헤더가 없으므로 이 경로를 기본값으로 유지합니다. 요청 제한 시간은 60초이며 Render 시작이 지연되면 재시도할 수 있습니다.

설정을 바꾸려면 `.env.example`을 `.env.local`로 복사합니다. `ARTICLE_API_ORIGIN`은 로컬 프록시와 빌드 시 API 주소, `SITE_URL`은 공유 canonical 주소입니다. `VITE_ARTICLE_API_BASE_URL`에 외부 API 주소를 직접 지정하는 경우 해당 서버의 CORS 허용이 필요합니다. 운영 백엔드 주소 변경 시 `vercel.json`도 수정해야 합니다.

이미지 업로드 백엔드는 `POST /api/media`에서 파일을 저장한 뒤 `src`, `width`, `height`, `alt`, `caption`, `credit`을 반환하도록 연결합니다. 대표 이미지는 카드에서 일정한 비율로 잘라 보여주고 기사 상세에서는 잘리지 않은 원본 비율로 표시합니다. 본문 이미지는 `inlineImages`의 `afterParagraph` 값으로 들어갈 문단 위치를 지정할 수 있습니다.

> 기사 데이터는 API에서 조회하며 오류 시 정적 기사로 대체하지 않습니다. API의 `/images/internal-review/` 경로는 기존 프론트 `public/images/internal-review/` 파일을 가리킵니다. 이미지 크기가 없는 경우 해당 크기 메타태그를 생략합니다. `tests/fixtures/`의 JSON은 2026-09-10에 확인한 API 응답으로, 자동 테스트에서만 사용합니다.

> 기사별 공유 메타데이터와 Article JSON-LD는 빌드 단계에서 정적 HTML로 생성되어 JavaScript를 실행하지 않는 SNS 로봇도 읽을 수 있습니다. 기사 본문 전체의 검색 노출을 확장하려면 운영 전환 시 SSR/SSG 프레임워크를 추가로 검토합니다.

공유용 정적 HTML은 빌드 시점의 API 데이터입니다. 새 기사나 메타데이터 변경을 SNS 미리보기에 반영하려면 다시 빌드·배포해야 합니다. 빌드 시에는 Render 시작 시간을 고려해 API 응답을 최대 180초 기다립니다. 요청 실패 시 빌드는 실패하며, 오래된 데이터로 대체하지 않습니다. API가 빈 배열을 반환하면 홈 페이지만 생성합니다. 검증용 빌드 입력은 배포 대상 외부인 `.generated/article-snapshot.json`에 저장합니다.

## 실행

```bash
npm install
npm run dev
```

전체 검증 명령은 `npm run check`입니다. 개별로는 `npm run lint`, `npm run test`, `npm run build`, `npm run test:static`을 사용합니다.

브라우저 회귀 테스트는 `npx playwright install chromium` 후 `npm run test:e2e`로 실행합니다. 이 테스트는 실제 응답 형식의 fixture를 사용해 페이지 이동, 언어 전환 중 늦은 응답, 404/서버 오류 구분, 재시도, 빈 목록, 모바일 레이아웃을 검증합니다. 설치된 Edge를 사용하려면 `PLAYWRIGHT_BROWSER_CHANNEL=msedge`를 설정합니다. 실제 API 프록시 검증은 `TEST_LIVE_API=1`을 설정한 뒤 `npx playwright test --grep @live`로 실행합니다.

Vercel은 생성된 기사별 정적 HTML을 우선 제공하고, 존재하지 않는 경로는 `vercel.json`의 SPA fallback으로 React Router에 연결합니다.
