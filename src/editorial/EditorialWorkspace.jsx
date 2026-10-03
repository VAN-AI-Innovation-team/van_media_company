import { useEffect, useState } from 'react'
import './EditorialPage.css'

const STORAGE_KEY = 'van-newsroom-editorial-demo-v1'

const STATUS = {
  draft: { label: '작성 중', tone: 'neutral', step: 0 },
  in_review: { label: '검수 요청', tone: 'blue', step: 1 },
  changes_requested: { label: '수정 요청', tone: 'amber', step: 0 },
  approved: { label: '승인 완료', tone: 'green', step: 2 },
  scheduled: { label: '예약 등록', tone: 'purple', step: 3 },
}

const CATEGORIES = ['사회', '기술', '문화', '경제', '국제', '오피니언']
const STEPS = ['원고 작성', '데스크 검수', '승인', '예약 등록']

function createDraft() {
  const now = new Date().toISOString()
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `draft-${Date.now()}-${Math.random()}`,
    title: '',
    summary: '',
    body: '',
    category: CATEGORIES[0],
    author: '',
    reviewNote: '',
    scheduledAt: '',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  }
}

function loadDrafts() {
  try {
    if (typeof window === 'undefined') return [createDraft()]
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(saved)) {
      return saved.filter((item) => item && typeof item.id === 'string'
        && typeof item.title === 'string' && typeof item.summary === 'string'
        && typeof item.body === 'string' && typeof item.author === 'string'
        && typeof item.category === 'string' && STATUS[item.status])
    }
  } catch {
    // A blocked or older browser store should not stop the demo screen.
  }
  return [createDraft()]
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(date)
}

function StatusBadge({ status }) {
  const current = STATUS[status] ?? STATUS.draft
  return <span className={`editorial-status editorial-status--${current.tone}`}>{current.label}</span>
}

function validateDraft(draft) {
  if (!draft.title.trim()) return '제목을 입력해 주세요.'
  if (!draft.summary.trim()) return '요약을 입력해 주세요.'
  if (!draft.author.trim()) return '작성자를 입력해 주세요.'
  if (!draft.body.trim()) return '본문을 입력해 주세요.'
  return ''
}

export default function EditorialWorkspace() {
  const [drafts, setDrafts] = useState(loadDrafts)
  const [selectedId, setSelectedId] = useState(() => drafts[0]?.id ?? null)
  const [role, setRole] = useState('writer')
  const [reviewNote, setReviewNote] = useState('')
  const [scheduleInput, setScheduleInput] = useState('')
  const [message, setMessage] = useState('')
  const [storageError, setStorageError] = useState(false)
  const selected = drafts.find((draft) => draft.id === selectedId) ?? null
  const canEdit = selected && role === 'writer'
    && (selected.status === 'draft' || selected.status === 'changes_requested')

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }, [drafts])

  function selectDraft(id) {
    setSelectedId(id)
    setReviewNote('')
    setScheduleInput('')
    setMessage('')
  }

  function addDraft() {
    const draft = createDraft()
    setDrafts((current) => [draft, ...current])
    selectDraft(draft.id)
    setRole('writer')
    setMessage('새 원고를 만들었습니다.')
  }

  function updateSelected(patch) {
    setDrafts((current) => current.map((draft) => draft.id === selectedId
      ? { ...draft, ...patch, updatedAt: new Date().toISOString() }
      : draft))
    setMessage('')
  }

  function removeDraft() {
    if (!selected || !window.confirm('이 브라우저에 저장된 원고를 삭제할까요?')) return
    const remaining = drafts.filter((draft) => draft.id !== selected.id)
    setDrafts(remaining)
    selectDraft(remaining[0]?.id ?? null)
    setMessage('원고를 삭제했습니다.')
  }

  function requestReview() {
    const error = validateDraft(selected)
    if (error) {
      setMessage(error)
      return
    }
    updateSelected({ status: 'in_review', reviewNote: '', scheduledAt: '' })
    setMessage('검수 요청 상태로 변경했습니다. 데스크 화면에서 검토할 수 있습니다.')
  }

  function requestChanges() {
    if (!reviewNote.trim()) {
      setMessage('수정 요청 사유를 입력해 주세요.')
      return
    }
    updateSelected({ status: 'changes_requested', reviewNote: reviewNote.trim() })
    setReviewNote('')
    setMessage('수정 요청 상태로 변경했습니다.')
  }

  function approveDraft() {
    updateSelected({ status: 'approved', reviewNote: reviewNote.trim() })
    setReviewNote('')
    setMessage('승인 상태로 변경했습니다. 이 동작은 실제 발행을 하지 않습니다.')
  }

  function scheduleDraft() {
    if (!scheduleInput) {
      setMessage('예약 발행 날짜와 시간을 선택해 주세요.')
      return
    }
    const scheduled = new Date(scheduleInput)
    if (Number.isNaN(scheduled.getTime()) || scheduled.getTime() <= Date.now()) {
      setMessage('현재보다 미래의 날짜와 시간을 선택해 주세요.')
      return
    }
    updateSelected({ status: 'scheduled', scheduledAt: scheduled.toISOString() })
    setMessage('예약 상태를 저장했습니다. 실제 발행 작업은 실행되지 않습니다.')
  }

  const counts = {
    draft: drafts.filter((draft) => draft.status === 'draft' || draft.status === 'changes_requested').length,
    inReview: drafts.filter((draft) => draft.status === 'in_review').length,
    approved: drafts.filter((draft) => draft.status === 'approved').length,
    scheduled: drafts.filter((draft) => draft.status === 'scheduled').length,
  }

  return (
    <main id="main-content" className="editorial-page">
      <div className="editorial-wrap">
        <header className="editorial-hero">
          <div>
            <p className="editorial-eyebrow">NEWSROOM / EDITORIAL DESK</p>
            <h1>기자용 원고 작업실</h1>
            <p>원고를 쓰고, 데스크 검수를 거쳐 승인과 예약 상태까지 확인하세요.</p>
          </div>
          <div className="editorial-demo-chip"><span /> 프론트 시연</div>
        </header>

        <div className="editorial-demo-notice" role="note">
          <strong>데모 화면 안내</strong>
          <span>내용은 이 브라우저에만 저장됩니다. 계정 권한, 서버 검수, 실제 발행 및 예약 실행은 연결되지 않았습니다.</span>
        </div>
        {storageError && (
          <p className="editorial-storage-error" role="alert">브라우저 저장소를 사용할 수 없어 변경 사항이 새로고침 후 유지되지 않을 수 있습니다.</p>
        )}

        <section className="editorial-overview" aria-label="원고 현황">
          <div><span>작성 · 수정</span><strong>{counts.draft}</strong><small>원고 준비 중</small></div>
          <div><span>검수 대기</span><strong>{counts.inReview}</strong><small>데스크 확인 필요</small></div>
          <div><span>승인 완료</span><strong>{counts.approved}</strong><small>예약 가능</small></div>
          <div><span>예약 등록</span><strong>{counts.scheduled}</strong><small>브라우저 시연 상태</small></div>
        </section>

        <div className="editorial-workspace">
          <aside className="editorial-sidebar" aria-label="원고 목록">
            <div className="editorial-sidebar__top">
              <div><span className="editorial-kicker">MY STORIES</span><h2>원고 목록 <em>{drafts.length}</em></h2></div>
              <button className="editorial-new-button" type="button" onClick={addDraft}>+ 새 원고</button>
            </div>
            <div className="editorial-draft-list">
              {drafts.length === 0 && (
                <div className="editorial-empty-list"><strong>아직 원고가 없습니다.</strong><p>새 원고를 만들어 작성을 시작하세요.</p></div>
              )}
              {drafts.map((draft) => (
                <button
                  key={draft.id}
                  type="button"
                  className={`editorial-draft-item${selectedId === draft.id ? ' editorial-draft-item--active' : ''}`}
                  aria-current={selectedId === draft.id ? 'true' : undefined}
                  onClick={() => selectDraft(draft.id)}
                >
                  <span className="editorial-draft-item__meta">{draft.category} <span>·</span> {formatDate(draft.updatedAt)}</span>
                  <strong>{draft.title.trim() || '제목 없는 원고'}</strong>
                  <span className="editorial-draft-item__bottom"><StatusBadge status={draft.status} /><span>열기 →</span></span>
                </button>
              ))}
            </div>
          </aside>

          <section className="editorial-editor" aria-label="원고 편집">
            {selected ? (
              <>
                <div className="editorial-editor__head">
                  <div><span className="editorial-kicker">STORY WORKSPACE</span><h2>원고 편집</h2><p>마지막 변경 {formatDate(selected.updatedAt)}</p></div>
                  <StatusBadge status={selected.status} />
                </div>

                <div className="editorial-role-switch" role="group" aria-label="시연 역할 선택">
                  <span>시연 역할</span>
                  <button type="button" aria-pressed={role === 'writer'} onClick={() => { setRole('writer'); setMessage('') }}>기자</button>
                  <button type="button" aria-pressed={role === 'desk'} onClick={() => { setRole('desk'); setMessage('') }}>데스크</button>
                  <small>역할 선택은 권한 인증이 아닙니다.</small>
                </div>

                <ol className="editorial-progress" aria-label="원고 진행 단계">
                  {STEPS.map((step, index) => {
                    const currentStep = STATUS[selected.status].step
                    return (
                      <li key={step} className={index <= currentStep ? 'editorial-progress--reached' : ''} aria-current={index === currentStep ? 'step' : undefined}>
                        <span>{String(index + 1).padStart(2, '0')}</span>{step}
                      </li>
                    )
                  })}
                </ol>

                <form className="editorial-form" onSubmit={(event) => event.preventDefault()}>
                  <div className="editorial-form__row">
                    <label>분야
                      <select value={selected.category} disabled={!canEdit} onChange={(event) => updateSelected({ category: event.target.value })}>
                        {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                      </select>
                    </label>
                    <label>작성자
                      <input value={selected.author} readOnly={!canEdit} maxLength={60} placeholder="이름을 입력하세요" onChange={(event) => updateSelected({ author: event.target.value })} />
                    </label>
                  </div>
                  <label>기사 제목
                    <input className="editorial-title-input" value={selected.title} readOnly={!canEdit} maxLength={120} placeholder="독자의 시선을 끄는 제목을 입력하세요" onChange={(event) => updateSelected({ title: event.target.value })} />
                  </label>
                  <label><span className="editorial-field-label">기사 요약 <small>{selected.summary.length}/240</small></span>
                    <textarea className="editorial-summary-input" value={selected.summary} readOnly={!canEdit} maxLength={240} placeholder="핵심 내용을 두세 문장으로 정리하세요" onChange={(event) => updateSelected({ summary: event.target.value })} />
                  </label>
                  <label><span className="editorial-field-label">기사 본문 <small>{selected.body.trim().length.toLocaleString()}자</small></span>
                    <textarea className="editorial-body-input" value={selected.body} readOnly={!canEdit} placeholder="기사 본문을 입력하세요. 문단은 줄바꿈으로 구분할 수 있습니다." onChange={(event) => updateSelected({ body: event.target.value })} />
                  </label>
                  <div className="editorial-save-line"><span className="editorial-save-dot" /> 입력한 내용은 이 브라우저에 자동 저장됩니다.</div>
                </form>

                {selected.reviewNote && (
                  <div className="editorial-review-note"><span className="editorial-kicker">DESK NOTE</span><strong>데스크 의견</strong><p>{selected.reviewNote}</p></div>
                )}

                <div className="editorial-actions">
                  <div className="editorial-actions__head"><div><span className="editorial-kicker">NEXT ACTION</span><h3>다음 단계</h3></div><button type="button" className="editorial-delete" onClick={removeDraft}>원고 삭제</button></div>

                  {canEdit && (
                    <div className="editorial-action-row"><p>필수 항목을 채운 뒤 데스크에 검수를 요청하세요.</p><button className="editorial-primary" type="button" onClick={requestReview}>검수 요청 →</button></div>
                  )}
                  {role === 'writer' && selected.status === 'in_review' && (
                    <div className="editorial-action-row"><p>데스크 검수를 기다리는 중입니다. 원고를 다시 수정하려면 요청을 취소하세요.</p><button className="editorial-secondary" type="button" onClick={() => { updateSelected({ status: 'draft' }); setMessage('검수 요청을 취소했습니다.') }}>요청 취소</button></div>
                  )}
                  {role === 'writer' && (selected.status === 'approved' || selected.status === 'scheduled') && (
                    <div className="editorial-action-row"><p>승인 이후의 변경은 검수 흐름을 다시 시작합니다.</p><button className="editorial-secondary" type="button" onClick={() => { updateSelected({ status: 'draft', scheduledAt: '' }); setMessage('원고를 작성 중 상태로 되돌렸습니다.') }}>수정 다시 시작</button></div>
                  )}
                  {role === 'desk' && selected.status === 'in_review' && (
                    <div className="editorial-review-controls"><label>검수 의견<textarea value={reviewNote} placeholder="수정이 필요한 부분이나 승인 의견을 남기세요" onChange={(event) => setReviewNote(event.target.value)} /></label><div><button className="editorial-secondary" type="button" onClick={requestChanges}>수정 요청</button><button className="editorial-primary" type="button" onClick={approveDraft}>승인 완료 →</button></div></div>
                  )}
                  {role === 'desk' && selected.status === 'approved' && (
                    <div className="editorial-schedule-controls"><label><span className="editorial-field-label">예약 발행 일시 <small>현재 브라우저의 현지 시간</small></span><input type="datetime-local" value={scheduleInput} onChange={(event) => setScheduleInput(event.target.value)} /></label><button className="editorial-primary" type="button" onClick={scheduleDraft}>예약 등록 →</button></div>
                  )}
                  {selected.status === 'scheduled' && (
                    <div className="editorial-action-row"><p><strong>예약 시각 {formatDate(selected.scheduledAt)}</strong><br />시연용 상태이며 예약 시각에 실제로 기사가 게시되지는 않습니다.</p>{role === 'desk' && <button className="editorial-secondary" type="button" onClick={() => { updateSelected({ status: 'approved', scheduledAt: '' }); setMessage('예약 상태를 취소했습니다.') }}>예약 취소</button>}</div>
                  )}
                  {role === 'desk' && (selected.status === 'draft' || selected.status === 'changes_requested') && (
                    <p className="editorial-action-hint">기자가 원고의 검수를 요청하면 이곳에 검수·승인 버튼이 나타납니다.</p>
                  )}
                  {role === 'writer' && selected.status === 'changes_requested' && <p className="editorial-action-hint">데스크 의견을 반영한 뒤 다시 검수를 요청할 수 있습니다.</p>}
                  <p className="editorial-action-message" role="status" aria-live="polite">{message}</p>
                </div>
              </>
            ) : (
              <div className="editorial-empty-editor"><span>✦</span><h2>새 원고를 준비해 볼까요?</h2><p>제목과 본문을 작성하면 브라우저에 자동으로 저장됩니다.</p><button className="editorial-primary" type="button" onClick={addDraft}>새 원고 만들기</button></div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
