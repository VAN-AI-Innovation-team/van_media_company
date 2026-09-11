// media-outreach 백엔드(언론 컨택 자동화 시스템) REST API 클라이언트.
// 흐름: 보도자료 등록 -> 기자 추천 -> 개인화 메일 생성 -> 발송 -> 후속 연락
// 엔드포인트 목록 출처: https://github.com/VAN-AI-Innovation/media-outreach README "주요 API" 표 + 컨트롤러 소스.
// 이 모듈을 붙일 화면(운영자용 아웃리치 페이지)은 아직 없고, 우선 API 연동 레이어만 준비한다.

// 배포된 media-outreach 백엔드(Railway). VITE_MEDIA_OUTREACH_API_URL이 있으면 그걸 쓰고,
// 없으면 이 주소로 붙는다(로컬 백엔드를 띄웠다면 .env.local에 http://localhost:8080을 지정).
const MEDIA_OUTREACH_BACKEND_ORIGIN = 'https://backend-production-2e28.up.railway.app'

function getBaseUrl() {
  const configured = import.meta.env.VITE_MEDIA_OUTREACH_API_URL
  return (configured || MEDIA_OUTREACH_BACKEND_ORIGIN).replace(/\/+$/, '')
}

export class MediaOutreachApiError extends Error {
  constructor(status, body) {
    super(`media-outreach API error: HTTP ${status}`)
    this.status = status
    this.body = body
  }
}

async function request(method, path, { query, body } = {}) {
  const qs = query
    ? Object.entries(query)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&')
    : ''
  const url = `${getBaseUrl()}${path}${qs ? `?${qs}` : ''}`

  const options = { method }
  if (body !== undefined) {
    options.headers = { 'Content-Type': 'application/json' }
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url, options)

  if (response.status === 204) return undefined

  const contentType = response.headers.get('content-type') || ''
  const parsed = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : await response.text()

  if (!response.ok) throw new MediaOutreachApiError(response.status, parsed)
  return parsed
}

// ---- 1. 보도자료 ----
export const PressReleaseApi = {
  list: () => request('GET', '/api/press-releases'),
  get: (id) => request('GET', `/api/press-releases/${id}`),
  create: ({ title, content, keywords }) =>
    request('POST', '/api/press-releases', { body: { title, content, keywords } }),
}

// ---- 2. 기자 (등록/조회 + 클라이언트 측 추천) ----
export const JournalistApi = {
  list: () => request('GET', '/api/journalists'),
  get: (id) => request('GET', `/api/journalists/${id}`),
  create: ({ name, email, mediaOutlet, beat, interestKeywords }) =>
    request('POST', '/api/journalists', { body: { name, email, mediaOutlet, beat, interestKeywords } }),
  update: (id, { name, mediaOutlet, beat, interestKeywords }) =>
    request('PUT', `/api/journalists/${id}`, { body: { name, mediaOutlet, beat, interestKeywords } }),
  remove: (id) => request('DELETE', `/api/journalists/${id}`),
  addArticle: (id, { title, url, publishedAt }) =>
    request('POST', `/api/journalists/${id}/articles`, { body: { title, url, publishedAt } }),
}

// media-outreach 백엔드에는 "기자 추천" 전용 엔드포인트가 없다(README/컨트롤러 기준).
// 보도자료 키워드와 기자의 관심 키워드/출입처(beat)를 겹치는 정도로 점수를 매겨
// 클라이언트에서 추천 목록을 구성한다.
function normalizeKeyword(keyword) {
  return String(keyword ?? '').trim().toLowerCase()
}

export function recommendJournalists(pressRelease, journalists, { limit = 10 } = {}) {
  const releaseKeywords = new Set((pressRelease?.keywords ?? []).map(normalizeKeyword))

  return journalists
    .map((journalist) => {
      const journalistKeywords = journalist.interestKeywords ?? []
      const matchedKeywords = journalistKeywords.filter((keyword) =>
        releaseKeywords.has(normalizeKeyword(keyword)),
      )
      const beatMatches = releaseKeywords.has(normalizeKeyword(journalist.beat))
      const score = matchedKeywords.length + (beatMatches ? 1 : 0)

      return { journalist, score, matchedKeywords, beatMatches }
    })
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
}

// ---- 3. 개인화 메일 생성 (Gemini 기반 초안) ----
export const MailDraftApi = {
  list: ({ journalistId, status } = {}) =>
    request('GET', '/api/mail-drafts', { query: { journalistId, status } }),
  get: (id) => request('GET', `/api/mail-drafts/${id}`),
  generate: ({ journalistId, pressReleaseId }) =>
    request('POST', '/api/mail-drafts', { body: { journalistId, pressReleaseId } }),
  edit: (id, { subject, body }) => request('PUT', `/api/mail-drafts/${id}`, { body: { subject, body } }),
  regenerate: (id) => request('POST', `/api/mail-drafts/${id}/regenerate`),
  approve: (id) => request('POST', `/api/mail-drafts/${id}/approve`),
}

// ---- 4. 발송 ----
export const MailSendApi = {
  confirmTargets: ({ mailDraftIds, scheduledAt = null, forceSend = false }) =>
    request('POST', '/api/mail-send/targets/confirm', { body: { mailDraftIds, scheduledAt, forceSend } }),
  reschedule: (jobId, scheduledAt) =>
    request('PUT', `/api/mail-send/jobs/${jobId}/schedule`, { body: { scheduledAt } }),
  cancel: (jobId) => request('POST', `/api/mail-send/jobs/${jobId}/cancel`),
  pause: (jobId) => request('POST', `/api/mail-send/jobs/${jobId}/pause`),
  resume: (jobId) => request('POST', `/api/mail-send/jobs/${jobId}/resume`),
  get: (jobId) => request('GET', `/api/mail-send/jobs/${jobId}`),
  listByJournalist: (journalistId) => request('GET', '/api/mail-send/jobs', { query: { journalistId } }),
}

export const TrackingApi = {
  status: (journalistId) => request('GET', `/api/tracking/journalists/${journalistId}/status`),
  stats: (pressReleaseId) => request('GET', '/api/tracking/stats', { query: { pressReleaseId } }),
}

export const UnsubscribeApi = {
  status: (journalistId) => request('GET', `/api/unsubscribe/${journalistId}/status`),
  unsubscribe: (journalistId, reason) =>
    request('POST', `/api/unsubscribe/${journalistId}`, { body: { reason } }),
}

// ---- 5. 후속 연락 ----
export const FollowUpApi = {
  pending: () => request('GET', '/api/followups/pending'),
  byJournalist: (journalistId) => request('GET', '/api/followups', { query: { journalistId } }),
  addManual: ({ journalistId, pressReleaseId }) =>
    request('POST', '/api/followups', { body: { journalistId, pressReleaseId } }),
  send: (scheduleId) => request('POST', `/api/followups/${scheduleId}/send`),
  cancel: (scheduleId) => request('DELETE', `/api/followups/${scheduleId}`),
  timeline: (journalistId) => request('GET', `/api/followups/journalists/${journalistId}/timeline`),
}

export async function pingMediaOutreach() {
  try {
    const response = await fetch(`${getBaseUrl()}/api/journalists`)
    return { ok: response.status < 500, status: response.status }
  } catch {
    return { ok: false, status: null }
  }
}
