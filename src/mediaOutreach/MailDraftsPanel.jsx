import { useState } from 'react'
import { MailDraftApi } from '../mediaOutreachApi.js'
import { DraftStatusBadge, Notice, Panel, RawViewer, useNotice } from './shared.jsx'
import { useJournalists, usePressReleases } from './hooks.js'

const STATUSES = ['DRAFT', 'EDITED', 'APPROVED']

export default function MailDraftsPanel() {
  const { journalists } = useJournalists()
  const { pressReleases } = usePressReleases()
  const { notice, ok, err, clear } = useNotice()

  const [genJournalistId, setGenJournalistId] = useState('')
  const [genPressReleaseId, setGenPressReleaseId] = useState('')
  const [generating, setGenerating] = useState(false)

  const [filterJournalistId, setFilterJournalistId] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const [editing, setEditing] = useState({})
  const [busyId, setBusyId] = useState(null)

  function journalistName(id) {
    return journalists.find((j) => j.id === id)?.name ?? `#${id}`
  }
  function pressReleaseTitle(id) {
    return pressReleases.find((p) => p.id === id)?.title ?? `#${id}`
  }

  async function generate() {
    clear()
    setGenerating(true)
    try {
      const draft = await MailDraftApi.generate({
        journalistId: Number(genJournalistId),
        pressReleaseId: Number(genPressReleaseId),
      })
      ok(`초안 #${draft.id}을(를) 생성했습니다.`)
      setDrafts((prev) => [draft, ...prev])
      setLoaded(true)
    } catch (caught) {
      err(caught)
    } finally {
      setGenerating(false)
    }
  }

  async function loadDrafts() {
    clear()
    setLoading(true)
    try {
      const result = await MailDraftApi.list({
        journalistId: filterJournalistId ? Number(filterJournalistId) : undefined,
        status: filterStatus || undefined,
      })
      setDrafts(result)
      setLoaded(true)
    } catch (caught) {
      err(caught)
    } finally {
      setLoading(false)
    }
  }

  function startEdit(draft) {
    setEditing((prev) => ({ ...prev, [draft.id]: { subject: draft.subject, body: draft.body } }))
  }

  function updateOne(updated) {
    setDrafts((prev) => prev.map((draft) => (draft.id === updated.id ? updated : draft)))
  }

  async function saveEdit(id) {
    const value = editing[id]
    if (!value) return
    clear()
    setBusyId(id)
    try {
      const updated = await MailDraftApi.edit(id, value)
      updateOne(updated)
      setEditing((prev) => {
        const { [id]: _dropped, ...rest } = prev
        return rest
      })
      ok(`초안 #${id}을(를) 수정했습니다.`)
    } catch (caught) {
      err(caught)
    } finally {
      setBusyId(null)
    }
  }

  async function regenerate(id) {
    clear()
    setBusyId(id)
    try {
      const updated = await MailDraftApi.regenerate(id)
      updateOne(updated)
      ok(`초안 #${id}을(를) 재생성했습니다.`)
    } catch (caught) {
      err(caught)
    } finally {
      setBusyId(null)
    }
  }

  async function approve(id) {
    clear()
    setBusyId(id)
    try {
      const updated = await MailDraftApi.approve(id)
      updateOne(updated)
      ok(`초안 #${id}을(를) 승인했습니다.`)
    } catch (caught) {
      err(caught)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <Panel title="3. 개인화 메일 생성" hint="기자와 보도자료를 선택하면 Gemini로 개인화 메일 초안을 생성합니다.">
        <Notice notice={notice} />
        <div className="outreach-form-grid">
          <div className="outreach-field">
            <label>기자</label>
            <select value={genJournalistId} onChange={(event) => setGenJournalistId(event.target.value)}>
              <option value="">선택</option>
              {journalists.map((journalist) => (
                <option key={journalist.id} value={journalist.id}>
                  #{journalist.id} {journalist.name} ({journalist.mediaOutlet})
                </option>
              ))}
            </select>
          </div>
          <div className="outreach-field">
            <label>보도자료</label>
            <select value={genPressReleaseId} onChange={(event) => setGenPressReleaseId(event.target.value)}>
              <option value="">선택</option>
              {pressReleases.map((pressRelease) => (
                <option key={pressRelease.id} value={pressRelease.id}>
                  #{pressRelease.id} {pressRelease.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          className="outreach-btn outreach-btn--primary"
          disabled={generating || !genJournalistId || !genPressReleaseId}
          onClick={generate}
        >
          {generating ? '생성 중…' : '초안 생성'}
        </button>
      </Panel>

      <Panel title="메일 초안 조회" hint="필터 없이 조회하면 승인된(APPROVED) 초안만 표시됩니다.">
        <div className="outreach-form-grid">
          <div className="outreach-field">
            <label>기자로 필터</label>
            <select value={filterJournalistId} onChange={(event) => setFilterJournalistId(event.target.value)}>
              <option value="">전체</option>
              {journalists.map((journalist) => (
                <option key={journalist.id} value={journalist.id}>
                  #{journalist.id} {journalist.name}
                </option>
              ))}
            </select>
          </div>
          <div className="outreach-field">
            <label>상태로 필터</label>
            <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
              <option value="">(기본값: APPROVED)</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className="outreach-btn outreach-btn--sm" disabled={loading} onClick={loadDrafts}>
          {loading ? '조회 중…' : '조회'}
        </button>

        {loaded && drafts.length === 0 && <p className="outreach-empty">조건에 맞는 초안이 없습니다.</p>}

        {drafts.map((draft) => {
          const isEditing = draft.id in editing
          const editValue = editing[draft.id]
          return (
            <div key={draft.id} className="outreach-item">
              <div className="outreach-item__row">
                <div>
                  <span className="outreach-mono">#{draft.id}</span> <DraftStatusBadge status={draft.status} />{' '}
                  <span className="outreach-muted">v{draft.version}</span>
                </div>
                <span className="outreach-muted">
                  {journalistName(draft.journalistId)} · {pressReleaseTitle(draft.pressReleaseId)}
                </span>
              </div>

              {isEditing ? (
                <>
                  <div className="outreach-field outreach-field--grow" style={{ marginTop: 10 }}>
                    <label>제목</label>
                    <input
                      value={editValue.subject}
                      onChange={(event) => setEditing({ ...editing, [draft.id]: { ...editValue, subject: event.target.value } })}
                    />
                  </div>
                  <div className="outreach-field outreach-field--grow" style={{ marginTop: 8 }}>
                    <label>본문</label>
                    <textarea
                      rows={6}
                      value={editValue.body}
                      onChange={(event) => setEditing({ ...editing, [draft.id]: { ...editValue, body: event.target.value } })}
                    />
                  </div>
                  <div className="outreach-actions">
                    <button className="outreach-btn outreach-btn--sm outreach-btn--primary" disabled={busyId === draft.id} onClick={() => saveEdit(draft.id)}>
                      저장
                    </button>
                    <button
                      className="outreach-btn outreach-btn--sm"
                      onClick={() =>
                        setEditing((prev) => {
                          const { [draft.id]: _dropped, ...rest } = prev
                          return rest
                        })
                      }
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="outreach-item__title">{draft.subject}</p>
                  <p className="outreach-item__body">{draft.body}</p>
                  {draft.validationWarnings.length > 0 && (
                    <div className="outreach-notice outreach-notice--err">⚠ {draft.validationWarnings.join(' / ')}</div>
                  )}
                  <div className="outreach-actions">
                    <button className="outreach-btn outreach-btn--sm" onClick={() => startEdit(draft)}>
                      수정
                    </button>
                    <button className="outreach-btn outreach-btn--sm" disabled={busyId === draft.id} onClick={() => regenerate(draft.id)}>
                      재생성
                    </button>
                    <button
                      className="outreach-btn outreach-btn--sm outreach-btn--primary"
                      disabled={busyId === draft.id || draft.status === 'APPROVED'}
                      onClick={() => approve(draft.id)}
                    >
                      승인
                    </button>
                  </div>
                </>
              )}
              <RawViewer label="raw" data={draft} />
            </div>
          )
        })}
      </Panel>
    </div>
  )
}
